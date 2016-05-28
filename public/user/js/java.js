var ref = new Firebase('https://photopinwall.firebaseio.com/');
var refPinboard = new Firebase('https://photopinwall.firebaseio.com/pinboards/');


var app = angular.module("app", []);
var postID;
var pinboardsarrey = [];
var $IDphoto = 0;
var $IDphotoremove = 0;
var $IDcurrentPinwall;
var RemovePinboard;


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



//************************************************

app.controller("main",function($scope){
	$scope.testvisible = false;
	$scope.homevisible = true;
	$scope.infovisible = false;
	$scope.pinboardsvisible = false;


//************************* navbar ***************************************************
	$scope.homeshow = function(){
		nonactiven();
		document.getElementById("LiHome").className = "active";
		$scope.homevisible = true;
	}
	$scope.pinboardsshow = function(){
		nonactiven();
		document.getElementById("LiPinboards").className = "active";
		getpinboards($scope);
		$scope.pinboardvisible = false;
		$scope.pinboardsvisible = true;
		$scope.pinboardsettingsvisible = true;


		var usersPinboard = new Firebase('https://photopinwall.firebaseio.com/users/' + postID + '/pinboard');
		usersPinboard.on("value", function(snapshot) {
			snapshot.forEach(function(pinboardID) {
				var key = pinboardID.key();
				var val = pinboardID.val();
				console.log(key + val);
			});
		});

	}
	$scope.helpshow = function(){
		nonactiven();
		document.getElementById("LiHelp").className = "active";
	}
	$scope.infoshow = function(){
		nonactiven();
		document.getElementById("LiInfo").className = "active";
		$scope.infovisible = true;
	}
	$scope.LogMeIn = function(){
        FB.login(function(response){
        	loginFB(response);
        },{scope: 'email'})
    }
    $scope.testnavshow = function(){
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
	$scope.infopinboard =false;
	
	}

//*************************************************************

//****************************** add pinboard ***********************************************

$scope.addpinboard = function(){

	var currentpinboards = countpinboards();
	if (currentpinboards<=4) {
		var idpinboard = makeid();
		var iduniek = checkID(idpinboard);

		if (!iduniek) {
			addpinboardtodB(idpinboard, currentpinboards);
		}
		else{
			idpinboard = makeid();
			iduniek = checkID(idpinboard);
			if (!iduniek) {
				addpinboardtodB(idpinboard, currentpinboards);
			};
		}
	}else{
		alert("you can have only 5 pinboards");
	}

}



function addpinboardtodB(idpinboard, currentpinboards){
	var pinboardbase = ref.child("pinboards");
	var newpinboard = pinboardbase.child(idpinboard);
	newpinboard.update({
		"user_ID" : postID,
	});
	var userpinboards = ref.child("users/"+postID+"/pinboard");

	userpinboards.push({
		"pinboard_ID" : idpinboard,
		"total_Photos" : 0
	});
	currentpinboards ++;

	var userref = ref.child("users/"+postID);
	userref.update({
		"totalpinboards": currentpinboards 
	});
}

//************************ Delete pinwall*************************
$scope.deletepinwall = function(){
	console.log($IDcurrentPinwall);

	RemovePinboard = refPinboard.child($IDcurrentPinwall);
	RemovePinboard.remove();
	getpinboards($scope);
}

//***********************Show entire wall***************************
$scope.entireWall = function() {
	$scope.pinboardsettingsvisible = false;
}

function checkID(idpinboard){
	var pinboards = ref.child("pinboards");
	pinboards.orderByKey().equalTo(idpinboard).on("value" , function(snapshot){
	    var Post = snapshot.val();
        if (Post!== null) {
         	return false;
          }else{
          	return true;
          }
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
//*********************************** haalt al de pinboards op **************************************************

function getpinboards($scope){

	var userpinboards = ref.child("users/"+postID+"/pinboard");
	userpinboards.on("value", function(snapshot) {
		var Post = snapshot.val();
		
		for(var key  in Post){
		  
		  var obj = Post[key];
		  var pushtoarray = true;

			for (var i = pinboardsarrey.length - 1; i >= 0; i--) {
				if (pinboardsarrey[i].pinboard_ID === obj.pinboard_ID) {
					pushtoarray = false;
				};
			};
		  
		  if (pushtoarray) {
		  	pinboardsarrey.push(obj);
		  };
          /*
		  for (var prop in obj) {
        	// skip loop if the property is from prototype
        	if(!obj.hasOwnProperty(prop)) continue;
		        console.log(prop + " = " + obj[prop]);
		    }
			*/
		}
	  $scope.pinboards = pinboardsarrey;
	});
}

//*********************************** als men op een pinboard klikt *********************************************
$scope.pinboardladen = function(name){
			for (var i = pinboardsarrey.length - 1; i >= 0; i--) {
				if (pinboardsarrey[i].pinboard_ID === name) {
					$scope.infonaam = pinboardsarrey[i].pinboard_ID;
					$scope.infoaantalfotos = pinboardsarrey[i].total_Photos;
					$("#infopinboard").fadeIn(1000);
					$IDcurrentPinwall = pinboardsarrey[i].pinboard_ID;
				};
			};
		}


//*************************** functie die de aantal pinboards telt **************************************

function countpinboards(){
	var amountpinboards;
	var userpinboards = ref.child("users/"+postID+"/pinboard");
	userpinboards.once("value", function(snapshot) {
		amountpinboards = snapshot.numChildren();
	});
	return amountpinboards;
}

//************************** laad de pinboard ********************

$scope.bekijkpinwall = function(){
	removeAllPicsFromPinboard();
	$scope.pinboardsettingsvisible = false;
	$scope.pinboardvisible = true;
	console.log($IDcurrentPinwall);

	var currentpinboard = ref.child("pinboards/"+ $IDcurrentPinwall);
	currentpinboard.on("child_added", function(snapshot) {
		var newPost = snapshot.val();
		if (newPost.url != null) {
			addPhotoToWall(newPost.titel,newPost.beschrijving,newPost.url);
		};
	});
}


// Popup ***************************************************



function addPhotoToWall(titel, beschrijving, url){
	var $afbeelding = document.createElement("div");
	//$afbeelding.class = 'afbeeldingpinboard';  -> nope werkt ni
	$afbeelding.id= 'afbeeldingpinboard' + $IDphoto;
	var randomnumber = Math.floor((Math.random() * 20) - 10); 
	var $rotatiepic = 360 + randomnumber;

	$afbeelding.style.cssText = 'width: 35%; height: 60%; position: absolute; left: 35%; top:20%; background-color: white; transform: rotate('+$rotatiepic+'deg);  box-shadow: 6px 6px 25px #000000; display: none;';
	$('.pinboardpictures').append($afbeelding);
	
	var $textbox = document.createElement("div");

	$textbox.id= 'textboxImage' + $IDphoto ;
	$textbox.style.cssText = 'font-size: '+$fontSizeTitelFoto+'px;';
	$("#afbeeldingpinboard" + $IDphoto).append($textbox);

	var $header = $("<h2>").text(titel);

	$("#afbeeldingpinboard" + $IDphoto).append($header);
	var $comment = $("<p>").text(beschrijving);
	
	$("#afbeeldingpinboard" + $IDphoto).append($comment);


	
	
	var $img = document.createElement("img");
	$img.src = url;
	$img.style.cssText = 'position: absolute; max-width: 90%; max-height: 70%; left: 5%; right: 5%; top: 25%; margin: auto;';
	$("#afbeeldingpinboard" + $IDphoto).append($img);

	$("#afbeeldingpinboard" + $IDphoto).fadeIn(800);
	$IDphoto ++;

	if ($IDphoto>5) {
		removePicFromPinboard();

	};

}

//*****************************foto van de pinboard verwijderen *******************
function removePicFromPinboard(){
	$("#afbeeldingpinboard"+$IDphotoremove).remove();
	$IDphotoremove++;
}
//********************************Al de foto's van het pinbord verwijderen*******************************
function removeAllPicsFromPinboard(){
	console.log($IDphotoremove);
	console.log($IDphoto);
	for (var i = $IDphoto - $IDphotoremove; i > 0; i--) {
		console.log(i);
		removePicFromPinboard();
		
}


//************************************************************
//************************************laad de foto's***********************

$scope.pinboardbekijkfotos = function(infonaam){
	console.log(infonaam);
}
//**************************************************************************

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
	console.log("login");
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










