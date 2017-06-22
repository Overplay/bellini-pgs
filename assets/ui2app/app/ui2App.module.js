/**
 * Created by mkahn on 4/6/16.
 */

var app = angular.module( 'uiApp', [ 'ui.router', 'ui.bootstrap', 'toastr', 'ui.og', 'googlechart', 'ngAnimate', 'uiGmapgoogle-maps'  ] );

app.config( function ( toastrConfig ) {
    angular.extend( toastrConfig, {
        positionClass: 'toast-bottom-center'
    } );
} );

 app.config( function ( uiGmapGoogleMapApiProvider) {
     uiGmapGoogleMapApiProvider.configure({
         key: 'AIzaSyCrbE5uwJxaBdT7bXTGpes3F3VmQ5K9nXE'
     })
 })
//
// app.config(['ChartJsProvider', function (ChartJsProvider) {
//     // Configure all charts
//     ChartJsProvider.setOptions({
//         chartColors: ['#3FAD49', '#39A8FF'],
//     });
// }])


app.run( function ( $log, $rootScope, toastr, $state ) {

    $log.info( "Bellini is pouring!" );

    $rootScope.$on( '$stateChangeError',
        function ( event, toState, toParams, fromState, fromParams, error ) {
            $log.error( "State change fail!" );

            if ( !fromState.name ) {
                $log.debug( 'FromState is nil, prolly a reload, bailing out to root' );
                window.location = '/';
            } else

            if ( error && error.status ) {

                switch ( error.status ) {
                    case 401:
                        $log.debug( 'not logged in' );
                        window.location = '/';
                        break;

                    case 403:
                        $log.debug( 'forbidden fruit' );
                        toastr.error( "Yeah, we're gonna need you not to do that.", "Not Authorized" );
                        event.preventDefault();
                        $state.go('welcome');
                        break;
                }

            }

        } );

} );

app.filter( 'capitalize', function () {
    return function ( input, scope ) {
        if ( input != null )
            input = input.toLowerCase();
        return input.substring( 0, 1 ).toUpperCase() + input.substring( 1 );
    }
} );

app.filter( 'startFrom', function () {
    return function ( input, start ) {
        //        start = parseInt(start);
        if ( input )
            return input.slice( start );
        return null;
    }
} );

app.filter( 'addressify', function () {
    return function ( addressJson ) {
        var newAddr = addressJson.street + ' ';
        newAddr += addressJson.city + ', ';
        newAddr += addressJson.state + ' ';
        newAddr += addressJson.zip;
        return newAddr;
    }
} );

app.filter( 'ringToHuman', function () {
    return function ( ring ) {
        var rings = [ 'Admin', 'Device', 'User', 'Advertiser', 'Other (unused)' ];
        return rings[ ring - 1 ];
    }
} );

function stripHttpData( data ) { return data.data };
