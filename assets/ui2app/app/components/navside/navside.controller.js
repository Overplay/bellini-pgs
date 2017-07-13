/**
 * Created by mkahn on 4/21/17.
 */

app.controller( "navSideController", function ( $scope, $log, navService, $timeout ) {

    $log.debug( "Loading navSideController" );

    // Not using the sliding menu for now
    $scope.menuVisible = true;

    var links = navService.sideMenu.getMenu();
    var idx = 0;

    function addNextLink() {
        $scope.sidelinks.push( links[ idx ] );
        idx++;
        if ( idx < links.length )
            $timeout( addNextLink, 50 );
    }

    $scope.sidelinks = [];

    if ( links.length )
        addNextLink();

    $scope.$on( 'TOGGLE_SIDEMENU', function ( ev ) {
        $scope.menuVisible = !$scope.menuVisible;
    } );

    $scope.$on( 'CHANGE_SIDEMENU', function ( ev, data ) {
        idx = 0;
        links = [];
        $scope.sidelinks = [];
        $timeout( function(){
            links = data;
            addNextLink();
        }, 1000 );
    } );


} );