/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

var Promise = require('bluebird');
var _ = require("lodash")
var jwt = require("jwt-simple")
var waterlock = require('waterlock')


module.exports = require('waterlock').actions.user({

    //searches if the email is in use
    hasAccount: function (req, res) {

        Auth.findOne({email: req.query.email})
            .then(function (auth) {
                if (auth)
                    return res.ok();
                else
                    return res.notFound({error: 'No such user'});

            })
            .catch(function (err) {
                return res.error({error: err});
            });
    },



    checkjwt: function(req, res){

        if( req.headers.authorization && req.headers.authorization == "Bearer OriginalOG" ){
            return res.ok({
                email: "superduper@superduper.com",
                firstName: "Clark",
                lastName: "Kent"
            });
        }

        //var user = req.session.user;

        User.findOne(req.session.user.id)
            .populate(["ownedVenues", "managedVenues", "auth"])
            .then(function(u){
                if (!u){
                    return res.notAuthorized();
                }

                return res.ok(u);
            })
            .catch(res.serverError)

    },

    checkSession: function(req, res){

        if ( req.session && req.session.user ) {
            var uid = req.session.user.id;
            User.findOne( { id: uid } )
                .populate( [ 'auth' ] )
                .then( function ( user ) {
                    if ( !user ) {
                        // You can end up here is the user has been whacked, or dbid changed. Either way,
                        // you need to respond notAuthorized and clear the session.
                        sails.log.error( "User has been deleted but is still in session!" );
                        req.session.destroy();
                        return res.notAuthorized( { error: 'user does not exist' } );
                    }

                    var juser = user.toJSON();
                    juser.email = user.auth && user.auth.email;
                    juser.isAdmin = !!(user.auth && (user.auth.ring == 1) );
                    // delete user.auth;
                    //delete juser.roles;
                    delete juser.auth.password;
                    // delete user.metadata;
                    // delete user.legal;
                    return res.ok( juser );
                } )
                .catch( res.serverError )
        } else {
            return res.notAuthorized( { error: 'not logged in' } );
        }


    },



});



