/**
 * Created by mkahn on 6/23/17.
 */

app.config( function ( $stateProvider, $urlRouterProvider ) {

    console.debug( "Loading routes" );

    $urlRouterProvider.otherwise( '/' );

    $stateProvider

        .state( 'latestblogs', {
            url:         '/',
            templateUrl: 'app/components/latest/latestblogs.template.html',
            controller:  'latestBlogsController'
        } )

        .state( 'newpost', {
            url:         '/postitnore',
            templateUrl: 'app/components/edit/edit.partial.html',
            controller:  'newPostController'
        } )


});