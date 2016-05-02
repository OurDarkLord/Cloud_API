var ref = new Firebase('https://photopinwall.firebaseio.com/');
var app = angular.module("app", []);




$(function()
	{ 

	});
//******************************************************

app.controller("main",function($scope){
	$scope.codevisible = true;
	$scope.zoekpinboard = function($scope){
		var pinboards = ref.child("pinboards");
		pinboards.equalTo("fZ3WB").on("child_added" , function(snapshot){
			var Post = snapshot.val();
			if (snapshot!== null) {
				$scope.codevisible = false;

			};
		});
	}

});











