/**
 * MediaController
 *
 * @description :: Server-side logic for managing Media v2
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var util = require( 'util' );
var verror = require( 'verror' );
var promise = require( "bluebird" );




function killMediaArrayThenRespond( array, response, count ) {
    if ( array.length ) {
        Media.destroy( array[ 0 ].id ).then( function ( data ) {
            array.splice( 0, 1 );
            killMediaArrayThenRespond( array, response, count + 1 );
        }, response.negotiate );
    }
    else {
        response.ok( "Successfully deleted " + count + " media" );
    }
}

module.exports = {

    /**
     * Static method to count the # of records
     * @param req
     * @param res
     */
    count: function ( req, res ) {

        if ( req.method != 'GET' ) {
            return res.badRequest( "Must use GET" );
        }

        var params = req.allParams();

        var query = {};

        //Count in time window
        if ( params.start && params.end ) {

            query = {
                createdAt: { '<=': new Date( params.end ), '>': new Date( params.start ) }
            };
        }


        Media.count( query )
            .then( function ( count ) {
                return res.ok( { count: count } );
            } )
            .catch( res.serverError )

    },

    /*
     uploads a file and creates it as a Media instance
     */
    upload: function ( req, res ) {

        if ( req.method != 'POST' ) {
            return res.badRequest( { error: "Must use POST" } );
        }

        // The code below can take down sails because SkipperDisk is shitty

        // var numFiles = req.file( 'file' )._files.length;
        //
        // if ( numFiles == 0 )
        //     return res.badRequest( { error: "No files in POST" } );
        //
        // if ( numFiles > 1 )
        //     return res.badRequest( { error: "This endpoint only does single files, try media/uploadmultiple." } );

        var destinationFolder = require( 'path' ).resolve( sails.config.paths.media );

        var uploadOptions = {
            dirname:  destinationFolder,
            maxBytes: 10 * 1024 * 1024
        };

        req.file( 'file' ).upload( uploadOptions, function whenDone( err, uploadedFiles ) {

            if ( err ) {
                sails.log.error( "Media upload error: " + util.inspect( err ) );
                return res.serverError( { error: err } );
            }

            // If no files were uploaded, respond with an error.
            if ( (uploadedFiles === undefined) || (uploadedFiles.length === 0) ) {
                return res.badRequest( { error: 'No file(s) uploaded.' } );
            }

            sails.log.silly( "Processing uploaded file." );

            var localFile = uploadedFiles[ 0 ];

            var mObj = {
                path: localFile.fd,
                file: {
                    size: localFile.size,
                    type: localFile.type
                },
                metadata: req.param( 'metadata' ),
                source: req.param( 'source' )
            };

            Media.create( mObj )
                .then( function ( newMedia ) {
                    if ( !newMedia )
                        throw new Error( "Could not create new Media!" );

                    sails.log.silly( "Media.create: [ " + newMedia.id + " ]" );
                    return res.ok(newMedia);
                } )
                .catch( function ( err ) {
                    return res.badRequest( { error: err.message } );
                } );

        } );

    },

    // Split off by MAK pulled from Wandr
    uploadMultiple: function ( req, res ) {

        if ( req.method != 'POST' ) {
            return res.badRequest( { error: "Must use POST" } );
        }

        req.file( 'file' ).upload( uploadOptions, function whenDone( err, uploadedFiles ) {

            if ( err ) {
                sails.log.error( "Media upload error: " + util.inspect( err ) );
                return res.serverError( err );
            }

            // If no files were uploaded, respond with an error.
            if ( (uploadedFiles === undefined) || (uploadedFiles.length === 0) ) {
                return res.badRequest( { error: 'No file(s) uploaded.' } );
            }

            sails.log.silly( "Processing uploaded files." );

            var ops = [];

            uploadedFiles.forEach( function ( localFile ) {

                var mObj = {
                    path:     localFile.fd,
                    file:     {
                        size: localFile.size,
                        type: localFile.type
                    },
                    metadata: req.param( 'metadata' ),
                    source:   req.param( 'source' )
                };

                ops.push( Media.create( mObj ) );

            } );

            //Resolve creation of all media
            Promise.all( ops )
                .then(
                    function ( newMedias ) {
                        sails.log.silly( "Media.create: [ " + util.inspect( _.pluck( newMedias, 'id' ) ) + " ]" );
                        return res.ok( newMedias );
                    } )
                .catch(
                    function ( err ) {
                        sails.log.error( "Media.create (error): " + util.inspect( err ) );
                        return res.serverError( err );
                    } );


        } );


    },


    download: function ( req, res ) {

        // This will spit out a bad request via req.bad_request
        // http://sailsjs.org/#!/documentation/reference/res/res.badRequest.html
        req.validate( {
            id: 'string'
        } );

        var mediaId = req.param( 'id' );

        Media.findOne( mediaId ).then(
            function ( media ) {

                /**
                 * Throw errors if
                 * 1: path is empty
                 * 2: file doesn't exist
                 * 3: error on read
                 */

                if ( !media ) {

                    var err1 = new verror( "Media `%s` not found", mediaId );
                    err1.status = 404;
                    err1.propertyName = "id";
                    err1.propertyValue = mediaId;
                    return res.negotiate( err1 );

                } else if ( !media.path ) {

                    var err1 = new verror( "Media `%s` missing path. This is an error in the upload logic or a Media item was improperly modified.", mediaId );
                    err1.status = 404;
                    err1.propertyName = "path";
                    err1.propertyValue = media.path;
                    return res.negotiate( err1 );

                } else {

                    var SkipperDisk = require( 'skipper-disk' );
                    var fileAdapter = SkipperDisk( /* optional opts */ );

                    // Stream the file down
                    fileAdapter.read( media.path )
                        .on( 'error', function ( err ) {

                            var err1 = new verror( err, "Download media `%s` read failed", mediaId );
                            err1.status = 500;
                            err1.propertyName = "path";
                            err1.propertyValue = media.path;
                            return res.negotiate( err1 );
                        } )
                        .pipe( res );
                }
            },

            function ( err ) {
                var err1 = new verror( err, "Download media `%s` failed", mediaId );
                err1.status = 500;
                err1.propertyName = "id";
                err1.propertyValue = mediaId;
                return res.negotiate( err1 );
            }
        );
    },


    // TODO: This is very dangerous in Asahi. Maybe we should remove?
    deleteAllEntries: function ( req, res ) {
        if ( req.method != "DELETE" ) {
            res.badRequest( { error: 'bad verb'} );
            return;
        }
        Media.find().then( function ( data ) {
            killMediaArrayThenRespond( data, res, 0 );
        }, res.negotiate );

    }
};

