'use strict';
var pinboard_ID;
var ref = new Firebase('https://photopinwall.firebaseio.com/');
/* Controllers */

var photoAlbumControllers = angular.module('photoAlbumControllers', []);

photoAlbumControllers.controller('photoUploadCtrlJQuery', ['$scope', '$rootScope', '$routeParams', '$location', 'cloudinary',
  /* Uploading with jQuery File Upload */
  function($scope, $rootScope, $routeParams, $location, cloudinary) {

    $scope.zoekpinboard = function(){
      var zoekname = $scope.textboxname;
      var pinboards = ref.child("pinboards");
      pinboards.orderByKey().equalTo(zoekname).on("value" , function(snapshot){
        var Post = snapshot.val();
        if (Post!== null) {
          snapshot.forEach(function(data) {
            pinboard_ID = data.key();
            $("#codevisible").fadeOut(600);
            setTimeout(function(){
              $('#direct_upload_jquery').fadeIn(600);
            }, 700);
            
          });
          
        };
      });
    }

    $scope.submit = function(){
      var PinboardDirectory  = ref.child("pinboards/" + pinboard_ID);
      PinboardDirectory.push({
        "titel" : $scope.titel,
        "beschrijving" : $scope.beschrijving, 
        "url" : $scope.file.result.secure_url

      });
      console.log($scope.file);

      console.log($scope.file.result.secure_url);

    }
    $scope.file = {};

    $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload(cloudinary.config().upload_preset, {tags: 'myphotoalbum', context:'photo='}, {
        // Uncomment the following lines to enable client side image resizing and validation.
        // Make sure cloudinary/processing is included the js file
        //disableImageResize: false,
        //imageMaxWidth: 800,
        //imageMaxHeight: 600,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        maxFileSize: 20000000, // 20MB
        dropZone: "#direct_upload_jquery",
        start: function (e) {
          $scope.status = "Starting upload...";
          $scope.$apply();
        },
        fail: function (e, data) {
          $scope.status = "Upload failed";
          $scope.$apply();
        }
      })
      .on("cloudinaryprogress", function (e, data) {
        var name = data.files[0].name;
        $scope.file.progress = Math.round((data.loaded * 100.0) / data.total);
        $scope.file.status = "Uploading... " + $scope.file.progress + "%";
        $scope.$apply();
        })
      .on("cloudinaryprogressall", function (e, data) {
        $scope.progress = Math.round((data.loaded * 100.0) / data.total);
        $scope.status = "Uploading... " + $scope.progress + "%";
        $scope.$apply();
      })
      .on("cloudinarydone", function (e, data) {
        $rootScope.photos = $rootScope.photos || [];
        data.result.context = {custom: {photo: $scope.title}};
        $scope.result = data.result;
        var name = data.files[0].name;
        $scope.file.name = name;
        $scope.file.result = data.result;
        $rootScope.photos.push(data.result);
        $scope.$apply();
      }).on("cloudinaryfail", function(e, data){
          $scope.file.name = name;
          $scope.file.result = data.result;
        });
  }]);