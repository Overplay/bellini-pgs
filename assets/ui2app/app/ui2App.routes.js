/**
 * Created by mkahn on 4/6/16.
 */

app.config( function ( $stateProvider, $urlRouterProvider ) {

    console.debug( "Loading routes" );

    var navViews = {
        "navtop":  {
            templateUrl: '/ui2app/app/components/navtop/navtop.partial.html',
            controller:  'navTopController',
        },
        "navside": {
            templateUrl: '/ui2app/app/components/navside/navside.partial.html',
            controller:  'navSideController'
        }
    };

    function buildCompleteView( withView ) {
        return _.extend( navViews, { "appbody": withView } );
    }


    $urlRouterProvider.otherwise( '/' );

    $stateProvider

        .state( 'dashboard', {
            url:   '/',
            views: buildCompleteView( {
                templateUrl:   '/ui2app/app/components/dashboard/dashboard.partial.html',
                // controller: 'redirectController'
            }),
            sideMenu: [
                { label: "Best Positions", sref: "bestposition.list", icon: "cube" },
                { label: "User Mgt", sref: "admin.userlist", icon: 'users'}
            ]
        } )

        // ACCOUNT

        .state( 'myaccount', {
            url:     '/myaccount',
            views:   buildCompleteView( {
                templateUrl: '/ui2app/app/components/account/myaccount.partial.html',
                controller:  'myAccountController'
            } )
        } )


        .state( 'bestposition', {
            abstract: true,
            url:      '/bp',
            views:    buildCompleteView( { template: '<ui-view></ui-view>', } )
        } )

        .state( 'bestposition.list', {
            url:         '/list',
            component: 'bpList',
            sideMenu: [
                { label: "Home", sref: "dashboard", icon: "home" },
                { label: "New BP", sref: "bestposition.edit({ id: 'new'})", icon: 'cube' }
            ],
            resolve:     {
                bps: function ( sailsBestPosition ) {
                    return sailsBestPosition.getAll();
                }
            }

        } )

        .state( 'bestposition.edit', {
            url:         '/edit/:id',
            templateUrl: '/ui2app/app/components/bp/bpedit.partial.html',
            controller:  'bpEditController',
            resolve:     {
                bp:    function ( sailsBestPosition, $stateParams ) {
                    return sailsBestPosition.get( $stateParams.id );
                }
            }

        } )

        .state( 'admin', {
            abstract: true,
            url:      '/admin',
            views:    buildCompleteView( { template: '<ui-view></ui-view>', } )
        } )

        // .state( 'admin.dashboard', {
        //     url:       '/dash',
        //     component: 'adminDashboard',
        //     sideMenu:  [
        //         { label: "Users", sref: "admin.userlist", icon: "users" },
        //         { label: "Venues", sref: "admin.venuelist", icon: "globe" },
        //         { label: "Ads", sref: "admin.adlist", icon: "bullhorn" },
        //         { label: "Devices", sref: "admin.devicelist", icon: "television" },
        //         { label: "Maintenance", sref: "admin.maint", icon: "gears" }
        //     ],
        //     resolve:   {
        //         userinfo:  function ( sailsUsers ) {
        //             return sailsUsers.analyze();
        //         },
        //         venueinfo: function ( $http ) {
        //             return $http.get( '/venue/count' ).then( function ( d ) { return d.data; } );
        //         },
        //         ads:       function ( sailsAds ) {
        //             return sailsAds.getForReview();
        //         }
        //     }
        // } )

        .state( 'admin.userlist', {
            url:       '/userlist',
            component: 'userList',
            sideMenu:  [
                { label: 'Home', sref: "dashboard", icon: "home" },
                { label: "Add User", sref: "admin.edituser({id: 'new'})", icon: "user" }
            ],
            resolve:   {
                users:   function ( sailsUsers2 ) {
                    return sailsUsers2.getAll();
                },
                heading: function () { return "All Users" }
            }
        } )

        .state( 'admin.edituser', {
            url:         '/edituser/:id',
            templateUrl: '/ui2app/app/components/admin/edituser.partial.html',
            controller:  'adminUserEditController',
            sideMenu:    [
                { label: 'Home', sref: "dashboard", icon: "home" },
                { label: "All Users", sref: "admin.userlist", icon: "users" },
                { label: "Add User", sref: "admin.edituser({id: 'new'})", icon: "user" }
            ],
            resolve:     {
                user2edit: function ( sailsUsers, $stateParams ) {
                    return sailsUsers.get( $stateParams.id );
                }
            }

        } )

} );
