/**
 * Created by alexawestlake on 6/26/17.
 */


var app = angular.module( 'bestPosApp', [ 'ui.router', 'ui.bootstrap', 'toastr', 'ngAnimate' ] );


app.run( function ( $log ) {

  $log.debug("I just started");

});
