/**
 * Created by mkahn on 6/23/17.
 */

app.controller('latestBlogsController', function($scope, $log, $http, toastr){

    $log.debug('loaded latestBlogsController');

    function errToast(err){
        toastr.error(err.message);
    }

    function reload(){

        $http.get( '/blogpost' )
            .then( function ( resp ) {
                $log.debug( "Got me some blog posts!" );
                $scope.blogPosts = resp.data;
            } )
            .catch( function ( err ) {
                $log.error( err.message );
            } )

    }


    $scope.deletePost = function(blogId){

        $http.delete('/blogpost/'+blogId)
            .then( function(resp){
                toastr.success('Nuked!');
                reload();
            })
            .catch(errToast)

    }

    reload();

});