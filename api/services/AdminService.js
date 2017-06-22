/**
 * Created by mkahn on 4/7/16.
 * Common Admin tasks for Waterlock
 *
 */

var _ = require( 'lodash' );


module.exports = require( 'waterlock' ).waterlocked( {


    /**
     * Adds admin privilege to the account pointed to by emailAddr
     *
     * @param emailAddr
     */
    addAdmin: function ( emailAddr ) {

        return Auth.findOneByEmail( emailAddr )
            .then( function ( auth ) {
                if ( !auth ) {
                    sails.log.error( "Could not upgrade user to Admin, no such email!" );
                    throw new Error( 'no user with that email' );
                }

                sails.log.debug( "Found an auth for email: " + emailAddr );
                auth.ring = 0;
                return auth.save();

            } )
            .catch( function ( err ) {
                sails.log.error( "No email for that user: " + emailAddr );
                reject( err );
            } );

    },

    /**
     * Creates a user with local authentication. You can set the permission level by
     * passing a userObj like { accountType: 'admin' }
     *
     * @param emailAddr
     * @param password
     * @param userObj
     */

    // Backwards compatible call until we go thru all the non-ring code. Creates a regular user.
    addUser: function ( emailAddr, password, userObj, facebookId, requireValidation ) {

        return module.exports.addUserAtRing( emailAddr, password, 3, userObj, facebookId, requireValidation )

    },

    addUserAtRing: function ( emailAddr, password, ring, userObj, facebookId, requireValidation ) {

        var authAttrib = {
            email:    emailAddr,
            password: password,
            ring:     ring
        };

        if ( facebookId && typeof facebookId !== 'undefined' )
            authAttrib.facebookId = facebookId;

        requireValidation = requireValidation || sails.config.waterlock.alwaysValidate;

        // rewritten massively by MAK 4-2017
        return Auth.findOne( { email: emailAddr } ) //TODO check on facebook id too?? I think that facebook auth with login if found
        // automatically -CG
            .then( function ( auth ) {
                if ( auth ) {
                    sails.log.debug( "Email is in system, rejecting create." )
                    throw new Error( "Email already in system" );
                }

                sails.log.debug( "Email is not in system, adding account." )
                return User.create( userObj || {} );
            } )
            .then( function ( newUser ) {
                // have to wrap up the old-skool method
                return new Promise( function ( resolve, reject ) {
                    waterlock.engine.attachAuthToUser( authAttrib, newUser, function ( err, userWithAuth ) {
                        if ( err ) {
                            sails.log.error( 'AdminService.addUser: Error attaching auth to user' );
                            sails.log.error( err );
                            reject( err );
                        }

                        resolve( userWithAuth );

                    } );
                } ); // end Promise
            } )
            .then( function ( userWithAuth ) {

                var finalIndignity;

                if ( requireValidation ) {
                    sails.log.info( "AdminService.addUser: adding validation token" );
                    finalIndignity = ValidateToken.create( { owner: userWithAuth.auth.id } )
                        .then( function ( tok ) {
                            return Auth.update( { id: tok.owner }, {
                                validateToken: tok,
                                blocked:       true
                            } );
                        } );
                } else {
                    // no validation so just pass this shit through
                    finalIndignity = Promise.resolve( userWithAuth );
                }

                return finalIndignity;

            } );


    },

    /**
     * Change the password for a specific email address
     *
     * @param params { password: "password", email | token: "value" }
     *
     */
    changePwd: function ( params ) {

        if ( !params.password ) {
            return Promise.reject( new Error( "Try including a password!" ) );
        }

        if ( params.email ) {

            return Auth.findOneByEmail( params.email )
                .then( function ( authObj ) {

                    if ( !authObj ) {
                        throw new Error( 'no such email' );
                    }

                    authObj.password = params.password;
                    return authObj.save();

                } )


        } else if ( params.resetToken ) {

            // Token is stored on the Auth resetToken.token

            // TODO I think this is broken, the param below does not match!
            return Auth.findOne( { "resetToken.token": params.token } )
                .then( function ( authObj ) {
                    authObj.password = params.password;
                    return authObj.save()
                } );

        }

        return Promise.reject( new Error( 'bad params' ) ); //fixes promise handler warning

    }

});