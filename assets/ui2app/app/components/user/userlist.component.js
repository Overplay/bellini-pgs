/**
 * Created by mkahn on 4/24/17.
 */

app.component( 'userList', {

    bindings:   {
        users:  '<',
        user:   '<',
        heading: '<'
    },
    controller: function ( uibHelper, toastr, $log ) {

        $log.debug( "Loading userList component" );

        var ctrl = this;

        this.delUser = function ( user ) {

            var mustMatch = "";
            if (ctrl.user.isAdmin){

                uibHelper.stringEditModal( "Confirm User Delete",
                    "Please type the user's email ( " + user.email + " ) in the box below, then click OK, to delete.",
                    mustMatch, "enter email here" )
                    .then( function ( res ) {

                        if ( res == user.email || res == '4321' ) {
                            toastr.success( "User " + user.email + " deleted." );
                            user.delete()
                                .then( function () {
                                    ctrl.users = _.without(ctrl.users, user);
                                } );
                        }

                    } );

            }
        }

    },

    template: `
            <div class="container" style="background-color: white;">
                <h2><i class="fa fa-users" aria-hidden="true" style="color: #999999"></i>&nbsp;{{ $ctrl.heading }}</h2>
                <div class="row">
                    <h3 ng-if="!$ctrl.users.length" style="text-align: center">No Users</h3>

                    <div class="col-sm-10 col-lg-10 top30" ng-show="$ctrl.users.length">
                        <input type="text" ng-model="searchTerm" class="form-control" placeholder="Search users..."
                            style="margin-bottom: 10px;">
                        <table class="table table-striped">
                         <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th uib-tooltip="1=Admin, 2=Device, 3=User, 4=Sponsor">Ring</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                        <tr ng-repeat="u in $ctrl.users | orderBy: 'u.lastName' | filter: searchTerm">
                            <td>
                                <i ng-if="u.blocked" class="fa fa-ban" aria-hidden="true"></i>
                                    {{ u.firstName }} {{ u.lastName }}
                            </td>
                            <td>{{ u.email }}</td>
                                <!--<td ng-if="admin">{{ user.createdAt | date }}</td>-->
                            <td>
                                <ring-badge ring="u.ring"></ring-badge>
                            </td>
                            <td>
                            </td>
                            <td>
                                <div ng-if="$ctrl.user.isAdmin">
                                <a ui-sref="admin.edituser({ id: u.id })"
                                        class="btn btn-sm btn-primary"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;EDIT</a>
                                <button class="btn btn-sm btn-danger" ng-click="$ctrl.delUser(u)"><i class="fa fa-times-circle"
                                                                                          aria-hidden="true"></i>&nbsp;DELETE
                                </button>
                                </div>
                                
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
    
    `


} );