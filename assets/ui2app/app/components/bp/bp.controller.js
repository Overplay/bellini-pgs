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

    $scope.bestposition = bp;

    $scope.carrierChoices = [ "DirecTV", "Dish", "Comcast" ];

    $scope.postThisBestPosition = function(){
        $log.debug("Post that shizzz");


            $scope.bestposition.save()
                .then( function(bp){
                    toastr.success("Your Best Position was Saved, Sparky ! :)");
                    $state.go('bestposition.list');
                })
                .catch( function(err){
                    toastr.error(err.message);
                });


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
