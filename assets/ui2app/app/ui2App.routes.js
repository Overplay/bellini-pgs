/**
 * Created by mkahn on 4/6/16.
 */

app.config( function ( $stateProvider, $urlRouterProvider ) {

    console.debug( "Loading routes" );

    var navViews = {
        "navtop":  {
            templateUrl: '/ui2app/app/components/navtop/navtop.partial.html',
            controller:  'navTopController',
            resolve:     {
                user: function ( userAuthService ) {
                    return userAuthService.getCurrentUser();
                }
            }
        },
        "navside": {
            templateUrl: '/ui2app/app/components/navside/navside.partial.html',
            controller:  'navSideController'
        }
    };

    function buildCompleteView( withView ) {
        return _.extend( navViews, { "appbody": withView } );
    }

    // Probably won't be used in PGS, but here in case
    function withUserResolve( resolvers ) {
        return _.extend( resolvers, { user: function(userAuthService){
            return userAuthService.getCurrentUser();
        } } );
    }

    $urlRouterProvider.otherwise( '/' );

    $stateProvider

        .state( 'dashboard', {
            url:   '/',
            views: buildCompleteView( {
                templateUrl:   '/ui2app/app/components/dashboard/dashboard.partial.html',
                controller: 'redirectController'
            } ),
            resolve: withUserResolve()

        } )

        // ACCOUNT

        .state( 'myaccount', {
            url:     '/myaccount',
            views:   buildCompleteView( {
                templateUrl: '/ui2app/app/components/account/myaccount.partial.html',
                controller:  'myAccountController'
            } ),
            resolve: withUserResolve( {
                sm: function ( navService ) {
                    navService.sideMenu.change( 'accountMenu' );
                }
            })

        } )


        .state( 'bestposition', {
            abstract: true,
            url:      '/bp',
            views:    buildCompleteView( { template: '<ui-view></ui-view>', } ),
            resolve:  {
                sm: function ( navService ) {
                    navService.sideMenu.change('bpMenu');
                }
            }
        } )

        .state( 'bestposition.list', {
            url:         '/list',
            templateUrl: '/ui2app/app/components/bp/bplist.partial.html',
            controller:  'bpListController',
            resolve:     {
                deals: function ( sailsBestPosition ) {
                    return sailsBestPosition.getAll();
                }
            }

        } )

        .state( 'bestposition.edit', {
            url:         '/edit/:id',
            templateUrl: '/ui2app/app/components/bp/bpedit.partial.html',
            controller:  'dealEditController',
            resolve:     {
                bp:    function ( sailsBestPosition, $stateParams ) {
                    return sailsBestPosition.get( $stateParams.id );
                }
            }

        } )

} );
