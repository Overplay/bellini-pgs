/**
 * Created by mkahn on 6/23/17.
 */
app.controller('bpListController', function ($scope, $log, bestpositions, toastr) {
    $log.debug('loaded bpListController');

    $scope.bestpositions = bestpositions;

    $scope.delete = function (bpObject) {
        bpObject.delete()
            .then( function(resp){
                toastr.success('Successfully Deleted');
                $scope.bestpositions = _.without($scope.bestpositions, bpObject);
            })
            .catch(errToast)

    };

});


app.controller('bpEditController', function($scope, $log, toastr, $state, bp){

    $log.debug('loaded bpEditController');

    // important information that will be converted to a JSON

    $scope.bestposition = bp;

    $scope.postThisBestPosition = function(){
        $log.debug("Post that shizzz");

        if ( $scope.bestposition.carrier && $scope.bestposition.channelNumber && $scope.bestposition.network && $scope.bestposition.lineupID && $scope.bestposition.programID && $scope.bestposition.postalCode && $scope.bestposition.postalCode > 0 && $scope.bestposition.channelNumber > 0){
            // it's a valid post
            //stripFalseLocations();
            $scope.bestposition.save()
                .then( function(bp){
                    toastr.success("Your Best Position was Saved, Sparky ! :)");
                    $state.go('bestposition.list');
                })
                .catch( function(err){
                    toastr.error(err.message);
                });

        } else {
            if ($scope.bestposition.channelNumber < 0){
                toastr.error("Your channel number must be a positive whole number.");
            }
            if ($scope.bestposition.postalCode < 0){
                toastr.error("Your postal code must be a positive whole number.");
            }
            if (!$scope.bestposition.carrier){
                toastr.error("You must put in a valid carrier.");
            }
            else {
                toastr.error("Please fill in all of the following fields correctly.");
            }

        }
    };
    //
    // var stripFalseLocations = function(){
    //     Object.keys($scope.bestposition.widgetLocation).map(function(item) {
    //         if(!$scope.bestposition.widgetLocation[item]){
    //             delete $scope.bestposition.widgetLocation[item];
    //         }
    //     });
    //     Object.keys($scope.bestposition.crawlerLocation).map(function(item) {
    //         if(!$scope.bestposition.crawlerLocation[item]){
    //             delete $scope.bestposition.crawlerLocation[item];
    //         }
    //     });
    // };

});
