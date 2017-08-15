/**
 * Created by mkahn on 8/15/17.
 */

app.component( 'bpList', {

    bindings:   {
        bps:    '<',
        header: '<',
        user:   '<'
    },
    controller: function ( uibHelper, toastr, $state, $log ) {
        $log.debug( "loading bpList component" );

        var ctrl = this;

        this.$onInit = function () {
            $log.debug("initted");
        }

    },
    template:   `

    <div class="container" style="background-color: white;">
    <div class="row">
        <div class="col-lg-10">
            <h2><i class="fa fa-globe" aria-hidden="true" style="color: #999999"></i>&nbsp;&nbsp;{{ $ctrl.header || 'Best Position Entries' }}</h2>

            <div ng-if="$ctrl.bps.length">
                <input type="text" ng-model="$ctrl.searchTerm" class="form-control" placeholder="Search positioning info...">
                <table class="table table-striped" ng-if="$ctrl.bps.length">
                    <thead>
                    <tr>
                        <th>Carrier</th>
                        <th>Channel No.</th>
                        <th>Network</th>
                        <th>Lineup ID</th>
                        <th>Program ID</th>
                        <th>Widget Ex Zone</th>
                        <th>Crawler Ex Zone</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="bp in $ctrl.bps | orderBy: 'channelNumber' | filter:searchTerm">
                        <td>{{bp.carrier}}</td>
                        <td>{{ bp.channelNumber }}</td>
                        <td>{{ bp.network }}</td>
                        <td>{{ bp.lineupID }}</td>
                        <td>{{ bp.programID }}</td>
                        <td>{{ bp.widgetLocation | json }}</td>
                        <td>{{ bp.crawlerLocation | json }}</td>

                        <td>
                            <a ui-sref="bestposition.edit({ id: bp.id })" style="margin-right: 10px;"
                               class="btn btn-thin btn-primary"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;EDIT</a>
                            <button class="btn btn-thin btn-danger" ng-click="$ctrl.delelte(bp)" ng-if="$ctrl.user.isAdmin"><i class="fa fa-times-circle"
                                                                                            aria-hidden="true"></i>&nbsp;DELETE
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <h3 ng-if="!$ctrl.bps.length" style="text-align: center; padding-bottom: 10px;">No Entries</h3>

        </div>
    </div>
</div>

    `
} );