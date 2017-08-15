/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Promises = require( 'bluebird' );


module.exports.bootstrap = function ( cb ) {


    var coreAdmins = [

        {
            user: {
                firstName: 'Admin',
                lastName:  'Pukeface',
                metadata:  { preinstall: true }
            },
            auth: {
                email:    'admin@test.com',
                password: 'beerchugs',
                ring: 1
            }
        },
        {
            user: {
                firstName: 'Mitch',
                lastName:  'Kahn',
                metadata:  { preinstall: true }
            },
            auth: {
                email:    'mitcha@ourglass.tv',
                password: 'D@rkB0ck!',
                ring: 1
            }
        },
        {
            user: {
                firstName: 'Treb',
                lastName:  'Ryan',
                metadata:  { preinstall: true },
            },
            auth: {
                email:    'treba@ourglass.tv',
                password: 'D@rkB0ck!',
                ring: 1
            }
        }

    ];

    coreAdmins.forEach(function(admin){
        AdminService.addUserAtRing( admin.auth.email, admin.auth.password, 1, admin.user, false )
            .then( function () { sails.log.debug( "Admin user created." )} )
            .catch( function ( err ) {
                    sails.log.warn( "Admin user NOT created. Probably already existed." )
                }
            );
    });

    sails.config.testdata.install();

    sails.log.debug( "Bootstrapping SAILS done" );

    cb();
}
;
