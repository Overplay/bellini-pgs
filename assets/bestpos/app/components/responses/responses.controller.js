/**
 * Created by alexawestlake on 6/26/17.
 */

/**
 * Created by mkahn on 6/23/17.
 */

app.controller('latestResponsesController', function($scope, $log, $http, toastr){

  $log.debug('loaded latestResponsesController');

  function errToast(err){
    toastr.error(err.message);
  }

  function reload(){

    $http.get( '/responses' )
      .then( function ( resp ) {
        $log.debug( "Here's where the important info is" );
        $scope.responsepost = resp.data;
      } )
      .catch( function ( err ) {
        $log.error( err.message );
      } )

  }


  $scope.deletePost = function(responseId){

    $http.delete('/responses/'+responseId)
      .then( function(resp){
        toastr.success('Successfully Deleted');
        reload();
      })
      .catch(errToast)

  };



  reload();

});
