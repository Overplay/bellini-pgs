/**
 * Created by mkahn on 4/22/17.
 */

app.controller( 'adminUserListController', function ( $scope, users, $log, uibHelper, toastr, $state ) {

    $log.debug( "Loading adminUserListController" );
    $scope.users = users;

    $scope.delUser = function ( user ) {

        var mustMatch = "";

        uibHelper.stringEditModal( "Confirm User Delete",
            "Please type the user's email ( " + user.email + " ) in the box below, then click OK, to delete.",
            mustMatch, "enter email here" )
            .then( function ( res ) {

                if ( res == user.email || res == '4321' ) {
                    toastr.success( "User " + user.email + " deleted." );
                    user.delete()
                        .then( function () {
                            $state.reload();
                        } );
                }

            } );

    }
} );

// USER EDIT FOR ADMIN

app.controller( 'adminUserEditController', function ( $scope, user2edit, $log, uibHelper, toastr,
                                                      $state, userAuthService ) {

    $log.debug( "Loading adminUserEditController" );
    $scope.user = user2edit;
    var _newUser;


    function makeNameFields( user ) {
        return [
            {
                label:       "First Name",
                placeholder: "first name",
                type:        'text',
                field:       'firstName',
                value:       user && user.firstName || '',
                required:    true
            }
            ,
            {
                label:       "Last Name",
                placeholder: "last name",
                type:        'text',
                field:       'lastName',
                value:       user && user.lastName || '',
                required:    true
            }
        ];
    }


    function makeEmailField( user ) {
        return [ {
            label:       "Email",
            placeholder: "email",
            type:        'text',
            field:       'email',
            value:       user && user.email || '',
            required:    true
        } ];
    }

    function makeTempPasswordField() {
        return [ {
            label:       "Temporary Password",
            placeholder: "password",
            type:        'text',
            field:       'password',
            value:       userAuthService.genRandomPassword(),
            required:    true
        } ];
    }

    function createBrandNewUser( preload ) {


        var allFields = makeNameFields( preload ).concat( makeEmailField() ).concat( makeTempPasswordField() );

        uibHelper.inputBoxesModal( "New User", "All fields are required.", allFields )
            .then( function ( fields ) {

                userAuthService.addUser( fields.email, fields.password, fields )
                    .then( function ( wha ) {
                        // redirect-ish
                        $state.go( 'admin.edituser', { id: wha.id } );
                    } )
                    .catch( function ( err ) {
                        if ( (err && err.data && err.data.badEmail) ) {
                            toastr.error( "Unacceptable email address, pal!" );
                            createBrandNewUser( fields );
                        } else {
                            toastr.error( "Hmm, weird error creating user." );
                        }
                        $state.go( 'admin.userlist' );
                    } )

            } )
            .catch( function ( err ) {
                $state.go( 'admin.userlist' );
            } );

    }

    if ( !user2edit.email ) {
        createBrandNewUser();
    }


} );



app.controller( 'adminDashController', [ '$scope', '$log', 'userinfo', 'venueinfo', 'ads', 'toastr',
    function ( $scope, $log, userinfo, venueinfo, ads, toastr ) {

        $scope.userinfo = userinfo;
        $scope.venueinfo = venueinfo;
        $scope.adsToReview = ads;

        $scope.userChartObj = {};

        $scope.userChartObj.type = "PieChart";

        $scope.onions = [
            { v: "Onions" },
            { v: 3 },
        ];

        $scope.userChartObj.data = {
            "cols":    [
                { id: "p", label: "Permission", type: "string" },
                { id: "c", label: "Count", type: "number" }
            ], "rows": [
                {
                    c: [
                        { v: "Admin" },
                        { v: userinfo.admin },
                    ]
                },
                {
                    c: [
                        { v: "Sponsor" },
                        { v: userinfo.sponsor }
                    ]
                },
                {
                    c: [
                        { v: "Owner" },
                        { v: userinfo.po },
                    ]
                },
                {
                    c: [
                        { v: "Manager" },
                        { v: userinfo.pm },
                    ]
                },
                {
                    c: [
                        { v: "Patron" },
                        { v: userinfo.u },
                    ]
                }
            ]
        };

        $scope.userChartObj.options = {
            'title': 'User Breakdown by Highest Permission'
        };


    } ] );



