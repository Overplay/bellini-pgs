/**
 * Created by alexawestlake on 6/26/17.
 */


app.config( function ( $stateProvider, $urlRouterProvider ) {

  console.debug( "Loading routes" );

  $urlRouterProvider.otherwise( '/' );

  $stateProvider

    .state( 'home', {
      url:         '/',
      templateUrl: 'app/components/home/home.template.html',
      controller:  ''
    } )

    .state( 'newpost', {
      url:         '/',
      templateUrl: 'app/components/newpost/newpost.template.html',
      controller:  'newPostController'
    } )

    .state( 'responses', {
      url:         '/',
      templateUrl: 'app/components/responses/responses.template.html',
      controller:  'latestResponsesController'
    } )

});
