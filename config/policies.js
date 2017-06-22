/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    // Everything open by default, but with some template vars set so we know what up

    // Normally set to false
    '*': true,

    LandingController: {
        landing: [ 'authDecorator', 'authRedirect' ]
    },

    // Let's tighten down a bit on blog posts
    BlogPostController: {
        restricted: [ 'sessionAuth' ],
        open:       true,
        admin:      [ 'isAdmin' ]
    },

    EJSExampleController: {
        restricted: [ 'authDecorator', 'sessionAuth' ],
        open:       true,
        admin:      [ 'authDecorator', 'isAdmin' ]
    },

    /**
     *
     *  The login page is open to all, as it should be.
     *  POSTs to auth/login are also open, though we may want to consider locking this down with some
     *  2 step process: get a token, do a login.
     *
     */


    AuthController: {
        '*':         'isAdmin',
        // 'find':    [ 'sessionAuth', 'isAdmin' ],
        // 'findOne': ['sessionAuth', 'isVenueOwnerMeOrAdmin'], //tricky for manager list and whatnot
        'update':    [ 'authProtection' ],
        'destroy':   [ 'authProtection' ], //maybe me?
        //'register': ['sessionAuth', 'isAdmin'], //not even used anywhere
        'addUser':   true, //used by mobile app
        'resetPwd':  [ 'passwordReset' ],
        'register':  false, //we use a differnet registration than waterlock
        //changePw own policy because it could be an authenticated user OR a reset token 
        'changePwd': [ 'passwordChange' ], //this is tricky becuase of pw reset...
        // Checked by MAK April 2017
        // anyone can go to the login page
        'loginPage': true,
        'login':     true,
        'logout':    true // anyone can post to the login endpoint, though we may want to add an IP range restriction
    },


    MediaController: {
        '*':                true,
        'upload':           [ 'sessionAuth' ],
        'deleteAllEntries': false
    },


    UserController: {
        '*':                 false,
        'find':              [ 'sessionAuth' ],
        'findOne':           [ 'sessionAuth' ],
        'update':            [ 'sessionAuth' ],
        'destroy':           [ 'isAdmin' ],
        'findByEmail':       [ 'sessionAuth' ],
        // New by Mitch 4-2017
        'all':               [ 'isAdmin' ],
        'checkjwt':          [ 'hasJsonWebToken' ]

    },


    UIController: {
        'uiApp': [ 'forceAnonToLogin', 'authDecorator', 'sessionAuth' ]
    },

    // Override this in local.js for testing
    wideOpen: false,

    // HUGE security hole, close after test. Enables "God" JWT that always passes
    godToken: true

};