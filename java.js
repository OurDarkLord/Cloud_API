var ref = new Firebase('photopinwall.firebaseIO.com');
var app = angular.module("app", []);


$(function()
	{ 
		$(".nav .dropdown").hover(function(arg)
		{
			$(".dropdown-menu").fadeIn("slow"); 
		}, function(arg)
		{
			$(".dropdown-menu").fadeOut("fast"); 
		}); 
		$("[data-toggle='tooltip']").tooltip({animation:true}); 



	});




    //javascript sdk facebook
	//initialise facebook sdk
	//*********************************************
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '1782048892025458',
	      xfbml      : true,
	      version    : 'v2.6'
	    });

	    FB.getLoginStatus(function(response){
    		loginFB(response);
    	},{scope: 'email'});
	    
	  };

	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
	//*********************************************



app.controller("main",function($scope){


// navbar ***************************************************
	$scope.home = function(){
		nonactiven();
		document.getElementById("LiHome").className = "active";
		$scope.homevisible = true;
	}
	$scope.pinboards = function(){
		nonactiven();
		document.getElementById("LiPinboards").className = "active";
	}
	$scope.help = function(){
		nonactiven();
		document.getElementById("LiHelp").className = "active";
	}
	$scope.info = function(){
		nonactiven();
		document.getElementById("LiInfo").className = "active";
		$scope.infovisible = true;
	}
	$scope.LogMeIn = function(){
        
      	FB.getLoginStatus(function(response){
    		loginFB(response);
    	},{scope: 'email'});
        
    }
    $scope.testnav = function(){
        nonactiven();
		document.getElementById("LiTest").className = "active";
		$scope.testvisible= true;
		$scope.data= $scope.email;
    }

    function nonactiven(){
	document.getElementById("LiHome").className = "";
	document.getElementById("LiPinboards").className = "";
	document.getElementById("LiHelp").className = "";
	document.getElementById("LiInfo").className = "";
	document.getElementById("LiTest").className = "";
	$scope.testvisible = false;
	$scope.homevisible = false;
	$scope.infovisible = false;
	}

//*************************************************************



// test *********************
$scope.data = "test angular";
$scope.adduser = function(){
		
		var naam = $("#name").val();
		$scope.data= naam;
		var userbase = ref.child("users");
		userbase.push({
			
		    date_of_birth: "June 23, 1912",
		    full_name: naam
		  
		});
	};


$scope.testvisible = false;
$scope.homevisible = true;
$scope.infovisible = false;
//**********************************

});

function loginFB(response){

		if (response.status === 'connected') {
	    	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,email'}, function(response) {
				$("#loginName").text(response.email);
					var userbase = ref.child("users");
					userbase.orderByChild("mail").equalTo(response.email).on("value" , function(snapshot){
						console.log(snapshot.val());
						if (snapshot.val()===null) {
							userbase.push({
							    name: response.first_name,
							    last_name: response.last_name,
							    mail: response.email
							});
						};

						}, function (errorObject) {
				  		console.log("The read failed: " + errorObject.code);
					});
			});
	    }else if (response.status === 'not_autorized') {
	    	$("#loginName").text('not autorized');
	    }else{
	    	$("#loginName").text('log in');
	    }

}

function getInfo() {
	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,email'}, function(response) {
		document.getElementById('status').innerHTML = response.id;
	});
}








