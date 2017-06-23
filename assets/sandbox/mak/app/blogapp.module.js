

var app = angular.module( 'blogApp', [ 'ui.router', 'ui.bootstrap', 'toastr', 'ngAnimate' ] );


app.run( function ( $log ) {

    $log.debug("I just started");

});