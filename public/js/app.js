'use strict';


/* App Module */
var photoAlbumApp = angular.module('photoAlbumApp', [
  'ngRoute',
  'cloudinary',
  'photoAlbumAnimations',
  'photoAlbumControllers',
  'photoAlbumServices',
  'enterCodeModule'
]);


/*/*******************************nog in ontwikkeling *************************************
photoAlbumApp.controller('mainapp', function($scope,$route, $rootScope, $location, $routeProvider){
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

              $rootScope.$apply(function() {
                $location.path('/upload/'+pinboard_ID);
                console.log($location.path());
              });

          });
          
        };
      });


});*/
photoAlbumApp.config(['$routeProvider',
  function ($routeProvider) {

      $routeProvider.when('/', {
          templateUrl: 'partials/entercode.html',
          controller: 'enterCodeCtrl'
        }).otherwise({
          templateUrl: 'partials/uploadimg.html',
          controller: 'photoUploadCtrlJQuery'
        });
    
  }]);
