/**
 * Created by rhartzell on 5/6/16.
 */

//Note: test data will be duplicated if being run on a cluster! 
var moment = require('moment')
var Promise = require('bluebird');
var self = module.exports.testdata = {

    installTestData: true,
    eraseOldData: false,

    install: function () {

        if (!self.installTestData) {
            sails.log.debug("Skipping test data installation.");
            return;
        }

        var chain = Promise.resolve();

        if (self.eraseOldData) {
            sails.log.debug("Erasing old test data installation.");

            var destruct = [
                Auth.destroy({}),
                User.destroy({}),
                Media.destroy({}),
            ];

            chain = chain.then(function () {
                return Promise.all(destruct)
                    .then(function () {
                        sails.log.debug("All test models destroyed.");
                    });
            })
        }


        self.users.forEach(function (u) {

            // if (u.organizationEmail) {
            //     var organizationEmail = u.organizationEmail;
            //     chain = chain.then(function () {
            //         return Organization.findOne({email: organizationEmail})
            //             .then(function (o) {
            //                 u.organization = o;
            //             })
            //     })
            //     delete u.organizationEmail;
            // }
            chain = chain.then(function () {
                return AdminService.addUserAtRing( u.email, u.password, u.ring,
                    { firstName: u.firstName, lastName: u.lastName }, false )
                    .then( function () { sails.log.debug( "User created." )} )
                    .catch( function () { sails.log.warn( "User NOT created. Probably already existed." )} );
            })
        });



    },

    users: [
        {
            firstName: 'Ryan',
            lastName: 'Smith',
            email: 'ryan@test.com',
            password: 'pa$$word',
            ring: 3
        },
        {
            firstName: 'Vid',
            lastName: 'Baum',
            email: 'vid@test.com',
            password: 'pa$$word',
            ring: 3
        },

    ]

};
