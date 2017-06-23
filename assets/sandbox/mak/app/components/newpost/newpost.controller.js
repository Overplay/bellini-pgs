/**
 * Created by mkahn on 6/23/17.
 */

app.controller('newPostController', function($scope, $log, $http, toastr, $state){

    $log.debug('loaded newPostController');

    // title and post

    $scope.post = { title: '', post: '' }

    $scope.postThisPost = function(){
        $log.debug("Post that shizzz");

        //{ title: $scope.post.title, post: $scope.post.post }
        if ( $scope.post.title && $scope.post.post ){
            // it's a valid post
            $http.post('/blogpost', $scope.post )
                .then( function(resp){
                    toastr.success("Your new post has ID: "+resp.data.id);
                    $state.go('latestblogs');
                })
                .catch( function(err){
                    toastr.error(err.message);
                })

        } else {
            toastr.error("How about using all the fields, genius?");

        }
    }



});