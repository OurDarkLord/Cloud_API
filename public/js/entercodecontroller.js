var ref = new Firebase('https://photopinwall.firebaseio.com/');
var pinboard_ID;
var EnterCodeControllers = angular.module('enterCodeModule', []);
EnterCodeControllers.controller('enterCodeCtrl', function($scope, $location, $rootScope){

	$scope.zoekpinboard = function(){
      var zoekname = $scope.textboxname;
      var pinboards = ref.child("pinboards");
      pinboards.orderByKey().equalTo(zoekname).on("value" , function(snapshot){
        var Post = snapshot.val();
        if (Post!== null) {
          snapshot.forEach(function(data) {
            pinboard_ID = data.key();
            console.log(pinboard_ID);
            $scope.$apply();
            $("#codevisible").fadeOut(600);
            setTimeout(function(){

              $rootScope.$apply(function() {
                $location.path('/'+pinboard_ID);
                console.log($location.path());
              });

            }, 700);
            
          });
          
        };
      });
    }


	});