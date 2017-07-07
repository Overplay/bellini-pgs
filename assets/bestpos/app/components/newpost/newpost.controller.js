/**
 * Created by alexawestlake on 6/26/17.
 */


app.controller('newPostController', function($scope, $log, $http, toastr, $state){

  $log.debug('loaded newPostController');

  // important information that will be converted to a JSON

  $scope.post = {carrier: '', channelNumber: '', network: '', lineupID: '', programID: '', postalCode: '', location: {}}

  $scope.postThisPost = function(){
    $log.debug("Post that shizzz");

    //{ title: $scope.post.title, post: $scope.post.post }
    if ( $scope.post.carrier && $scope.post.channelNumber && $scope.post.network && $scope.post.lineupID && $scope.post.programID && $scope.post.postalCode){
      // it's a valid post
      stripFalseLocations();
      console.log($scope.post.locations);
      $http.post('/responses', $scope.post )
        .then( function(resp){
          toastr.success("Your new post has ID: "+resp.data.id);
          $state.go('responses');
        })
        .catch( function(err){
          toastr.error(err.message);
        })

    } else {
      toastr.error("Please fill in all of the following fields.");

    }
  };

  var stripFalseLocations = function(){
    Object.keys($scope.post.location).map(function(item) {
      if(!$scope.post.location[item]){
        delete $scope.post.location[item];
      }
    });
  };

});
