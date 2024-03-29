/**
 * Created by mkahn on 4/22/17.
 */

app.factory( 'sideMenuService', function ( $rootScope ) {

    var _currentMenu = [];

    var _defaultMenu = [ { label: 'Home', sref: "dashboard", icon: "home" } ];

    return {
        setMenu: function ( menu ) {
            _currentMenu = menu || _defaultMenu;
            $rootScope.$broadcast( "NEW_SIDEMENU", _currentMenu );

        },

        getMenu: function () {
            return _currentMenu;
        }

    }

} );

app.factory( 'navService', function ( $rootScope, userAuthService ) {

    var currentSideKey = '';
    var currentTopKey = '';

    var userRing = 0;

    userAuthService.getCurrentUserRing()
        .then( function ( ring ) {
            userRing = ring;
        } );



    var topMenuGroups = {

        topMenu: [
            // { label: "dashboard", sref: "dashboard", icon: "cube" },
            // { label: "best position", sref: "bestposition.list", icon: "cube" },
        ]

    }

    return {

        topMenu: {

            buildForUser: function ( user ) {

                var menu = [];

                // TODO maybe this should be if-then since fallthrough is weird
                switch ( user.auth.ring ) {

                    case 1:
                    case 3:
                    default:
                        // Admin & user same fornow
                        menu = menu.concat( topMenuGroups.topMenu );
                        //menu = menu.concat(topMenuGroups.advertiserMenu);
                        //menu = menu.concat(topMenuGroups.ownerMenu);
                        break;


                }

                return menu;

            }


        },


    }

} );


app.controller( 'redirectController', [ '$state', 'user', function ( $state, user ) {
    // TODO think about removing the individual dashbaords and just add tiles to one unified dash


    //right now there is only one dashboard...

    $state.go('dashboard');

    // if ( user.isAdmin ) {
    //     $state.go( 'admin.dashboard' );
    // }
    //
    // else {
    //     $state.go( 'user.dashboard' );
    // }


} ] );


app.factory( 'dialogService', function ( $uibModal, uibHelper, $log, toastr ) {

    var service = {};

    service.passwordDialog = function () {

        var modalInstance = $uibModal.open( {
            templateUrl: '/ui2app/app/services/ui/passwordchange.dialog.html',
            controller:  function ( $scope, $uibModalInstance ) {

                $scope.password = { pass: '', match: '' };

                $scope.ok = function () {
                    $uibModalInstance.close( $scope.password.pass );
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss( 'cancel' );
                }

            }
        } );

        return modalInstance.result;

    }

    service.addressDialog = function ( location, geocode, ring, yelp ) {
        var modalInstance = $uibModal.open( {
            templateUrl: '/ui2app/app/services/ui/addresschange.dialog.html',
            controller:  function ( $scope, $uibModalInstance, sailsVenues, toastr, geocode ) {
                $scope.data = {
                    address:       location.address || {},
                    geolocation:   location.geolocation || {},
                    yelpId:        "",
                    googlePlaceId: ""
                };
                $scope.modal = { title: location.title };
                $scope.ring = ring;
                $scope.yelp = yelp;
                $scope.parameters = { limit: 8 };
                $scope.zipRegex = "\\d{5}([\\-]\\d{4})?";
                $scope.setForm = function ( form ) { $scope.form = form; };

                $scope.initializeLocation = function () {
                    $scope.parameters.location = "Locating...";
                    geocode.locate()
                        .then( geocode.revGeocode )
                        .then( function ( loc ) {
                            $scope.parameters.location = loc.city + ", " + loc.state;
                            toastr.success( "Successfully located!" );
                        } )
                        .catch( function ( err ) {
                            $scope.parameters.location = "";
                            $log.error( err );
                            toastr.error( "Could not find your location" );
                        } )
                };

                $scope.yelpSearch = function () {
                    return sailsVenues.yelp( $scope.parameters )
                        .catch( function ( err ) {
                            toastr.error( "Error fetching Yelp suggestions" );
                            $log.error( err );
                        } );
                };

                $scope.yelpCopy = function ( $item, $model ) {
                    $scope.data.address = {
                        street:  $model.location.address1,
                        street2: $model.location.address2,
                        city:    $model.location.city,
                        state:   $model.location.state,
                        zip:     $model.location.zip_code
                    };
                    $scope.data.geolocation = {
                        latitude:  $model.coordinates.latitude,
                        longitude: $model.coordinates.longitude
                    };
                    $scope.data.yelpId = $model.id;
                };

                $scope.geoCheck = function () {
                    if ( geocode && $scope.form.$valid ) {
                        toastr.success( "", "Geocoding..." );
                        sailsVenues.geocode( sailsVenues.addressStr( $scope.data.address ) )
                            .then( function ( res ) {
                                toastr.success( res[ 0 ].formatted_address, "Geocoded successfully" );
                                $scope.data.geolocation.longitude = res[ 0 ].geometry.location.lng;
                                $scope.data.geolocation.latitude = res[ 0 ].geometry.location.lat;
                                $scope.data.googlePlaceId = res[ 0 ].place_id;
                            } )
                            .catch( function ( err ) {
                                toastr.error( err.toString(), "Error geocoding" );
                            } )
                    }
                }

                $scope.ok = function () {
                    $uibModalInstance.close( $scope.data );
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss( 'cancel' );
                }
            },
            size:        'lg'

        } );

        return modalInstance.result;
    }

    service.pickVenue = function ( venues ) {

        var modalInstance = $uibModal.open( {
            templateUrl: '/ui2app/app/services/ui/pickvenue.dialog.html',
            controller:  function ( $scope, $uibModalInstance ) {

                $scope.venues = venues;

                $scope.ok = function () {
                    $uibModalInstance.close( $scope.venue );
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss( 'cancel' );
                }
            }

        } );

        return modalInstance.result;
    }

    function terror( err ) {
        if ( err === 'cancel' ) {
            toastr.warning( 'Edit abandoned' );
        } else {
            toastr.error( err.message );

        }
    }


    service.changeStringField = function ( model, field, prompt, textArea ) {

        uibHelper.stringEditModal( prompt, "", model[ field ], field, textArea )
            .then( function ( newString ) {
                $log.debug( 'String for ' + field + ' changed to: ' + newString );
                model[ field ] = newString;
                model.save()
                    .then( function () {
                        toastr.success( "Field changed" );
                    } )
                    .catch( terror );
            } );

    }

    return service;

} );

app.directive( 'ogSpinner', function () {

    return {
        template: `
    
    <div style="width: 80vw; height: 80vh;">
    <div class="spinner-holder">
        <div class="spinner">
            <div class="dot1"></div>
            <div class="dot2"></div>
        </div>
    </div>
</div>
    
    `
    }

} )