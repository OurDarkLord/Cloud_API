var ref = new Firebase('https://photopinwall.firebaseio.com/');
var app = angular.module("app", []);
var postID;


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
    },{scope: 'email'})
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
	$scope.testvisible = false;
	$scope.homevisible = true;
	$scope.infovisible = false;
	$scope.pinboardsvisible = false;


// navbar ***************************************************
	$scope.home = function(){
		nonactiven();
		document.getElementById("LiHome").className = "active";
		$scope.homevisible = true;
	}
	$scope.pinboards = function(){
		nonactiven();
		document.getElementById("LiPinboards").className = "active";
		$scope.pinboardsvisible = true;
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
        FB.login(function(response){
        	loginFB(response);
        },{scope: 'email'})
    }
    $scope.testnav = function(){
        nonactiven();
		document.getElementById("LiTest").className = "active";
		$scope.testvisible= true;
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
	$scope.pinboardsvisible = false;
	}

//*************************************************************

// add pinboard ***********************************************

$scope.addpinboard = function(){
	var currentpinboards = 0;
	var pinboardbase = ref.child("pinboards");
	var idpinboard = makeid();
	var newpinboard = pinboardbase.child(idpinboard);
	newpinboard.update({
		"user_ID" : postID
	});
	var userpinboards = ref.child("users/"+postID+"/pinboard");

	userpinboards.push({
		"pinboard_ID" : idpinboard,
		"total_Photos" : 0
	});
	currentpinboards = countpinboards();
	var userref = ref.child("users/"+postID);
	userref.update({
		"totalpinboards": currentpinboards
	});


}
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// functie die de aantal pinboards telt **************************************

function countpinboards(){
	var amountpinboards;
	var userpinboards = ref.child("users/"+postID+"/pinboard");
	userpinboards.once("value", function(snapshot) {
		amountpinboards = snapshot.numChildren();
	});
	return amountpinboards;
}


//************************************************************


// test *****************************************
$scope.data = "test angular";
$scope.adduser = function(){
		
		var pad = ref.child("pinboards/"+ postID);
		pad.orderByKey().equalTo("Fee7v").on("value", function(snapshot) {
		  console.log(snapshot.val());
		});
	};



//**********************************

});

function loginFB(response){
	if (response.status === 'connected') {
    	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,email'}, function(response) {
			$("#loginName").text(response.first_name);
			var userbase = ref.child("users");
			userbase.orderByChild("mail").equalTo(response.email).on("value" , function(snapshot){
				console.log(snapshot.val());
				if (snapshot.val()===null) {
					var newuser = userbase.push({
					    name: response.first_name,
					    last_name: response.last_name,
					    mail: response.email,
					    totalpinboards: 0
					});
					postID = newuser.key();
				}else{
					snapshot.forEach(function(data) {
						postID = data.key();
					});
					
				}

				console.log(postID);
				}, function (errorObject) {
		  		console.log("The read failed: " + errorObject.code);
			});
		});
    }else if (response.status === 'not_autorized') {
    	$("#loginName").text('not autorized');
    }else{
    	$("#loginName").text('not logged in');
    }
}

function getInfo() {
	FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
		document.getElementById('status').innerHTML = response.id;
	});
}








