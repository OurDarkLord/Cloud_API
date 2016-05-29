'use strict';
var ref = new Firebase('https://photopinwall.firebaseio.com/');
var pinboard_ID = null;
var lastsegment;

/* App Module */
var photoAlbumApp = angular.module('photoAlbumApp', [
  'ngRoute',
  'cloudinary',
  'photoAlbumAnimations',
  'photoAlbumControllers',
  'photoAlbumServices',
  'enterCodeModule'
]);


//*******************************nog in ontwikkeling **************************************
photoAlbumApp.controller('mainapp', function($scope,$route, $rootScope, $location ){
      var loc = location.href; 
      var array = loc.split('/');
      lastsegment = array[array.length-1];
      console.log(lastsegment);
    

      var pinboards = ref.child("pinboards");
      pinboards.orderByKey().equalTo(lastsegment).on("value" , function(snapshot){
        var Post = snapshot.val();
        if (Post!== null) {
          snapshot.forEach(function(data) {
            pinboard_ID = data.key(); 
            console.log(pinboard_ID);

            //$location.path();
            //$route.reload();

            //$routeParams.pinboard_ID;

            // $rootScope.$on('$routeUpdate', function() {  $route.reload(); });
            

          });
          
        };
      });

    

});
photoAlbumApp.config(['$routeProvider',
  function ($routeProvider) {


      $routeProvider.when('/', {
          templateUrl: 'partials/entercode.html',
          controller: 'enterCodeCtrl'
        }).otherwise({
          templateUrl: 'partials/uploadimg.html',
          controller: 'photoUploadCtrlJQuery'
        });


   /*   $routeProvider.when('/', {
          templateUrl: 'partials/entercode.html',
          controller: 'enterCodeCtrl'
        })
        .otherwise({
            templateUrl: 'partials/page.html',
            controller: 'mainapp'
        });

   */

    
  }]);