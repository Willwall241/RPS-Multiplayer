
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBBPOAiu_Okb3S2gvf2Yb5XEyRwmH2wRpw",
  authDomain: "rps-multiplayer-11cb3.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-11cb3.firebaseio.com",
  projectId: "rps-multiplayer-11cb3",
  storageBucket: "rps-multiplayer-11cb3.appspot.com",
  messagingSenderId: "1041721341665"
};
firebase.initializeApp(config);

//load page with player data or submit name to play or waiting for other player
var database = firebase.database();

var player = 0;
var otherPlayer = 0;
var playersReady = false;


function addButtons() {

  var buttonNames = ["Rock", "Paper", "Scissors"];
  for (i = 0; i < buttonNames.length; i++) {
    var newButton = $("<button>");
    newButton.text(buttonNames[i]);
    newButton.addClass("player" + player + "-choice");
    newButton.attr("data", buttonNames[i]);
    console.log(newButton.attr("data"));
    $("#p" + player + "-buttons").append(newButton);

  }
}



$(function() {
  //On click event listener for start button
  $("#start-button").on("click", function () {
    event.preventDefault();

    database.ref("player").once("value").then(function (snapshot) {

      //Set player input to name
      var name = $("#name").val().trim();
      //Set p element creation to variable
      var nameDisplay = $("<p>");

      //Check if player 1 exists in firebase if not create player
      if (!snapshot.child("1").exists()) {
        player = 1;
        console.log("blah");

        database.ref("player/1").set({
          name: name,
          wins: 0,
          loses: 0
        });

        nameDisplay.text(name);
        nameDisplay.addClass("p1-name");
        // $("#p1-stage").append(nameDisplay)

        otherPlayer = 2;
        // addButtons
        console.log("player" + player);

      }
      //Check if player 2 exists in firebase if not create player
      else if (!snapshot.child("2").exists()) {
        player = 2;
        console.log("naw");

        database.ref("player/2").set({
          name: name,
          wins: 0,
          loses: 0
        });

        nameDisplay.text(name);
        nameDisplay.addClass("p2-name");
        // $("#p2-stage").append(nameDisplay)

        otherPlayer = 1;
        console.log("player" + player);
      }
      //if player 1 and player 2 exists display message in outcome-stage div
      else {
        nameDisplay.text("Game is full, try again later.");
        nameDisplay.addClass("game-full");
        $("#outcome-stage").append(nameDisplay)
      }



    });



  });

  $(document).on('click', '.player1-choice', function(){ 
    console.log("test");
  
    database.ref("player/1/choice").set($(this).attr("data"));
    $(".player1-choice").remove();
    $("#p1-buttons").append($(this).attr("data"));
    console.log($(this).attr("data"));
  
  });
  
  $(document).on('click', '.player2-choice', function(){  
  
    database.ref("player/2/choice").set($(this).attr("data"));
    $(".player2-choice").remove();
    $("#p2-buttons").append($(this).attr("data"));
    console.log($(this).attr("data"));
  
  });


  $(window).on("beforeunload", function () {
    database.ref("player/" + player).remove();
  });
});

database.ref("player").on("value", function (snapshot) {


  //fill page with content when players exist
  if (snapshot.child("1").exists()) {

    $("#p1-name").html(snapshot.child("1/name").val());
    $("#p1-wins").html("Wins: " + snapshot.child("1/wins").val());
    $("#p1-loses").html("Loses: " + snapshot.child("1/loses").val());
    console.log(snapshot.child("1/name").val());
  }

  if (snapshot.child("2").exists()) {

    $("#p2-name").html(snapshot.child("2/name").val());
    $("#p2-wins").html("Wins: " + snapshot.child("2/wins").val());
    $("#p2-loses").html("Loses: " + snapshot.child("2/loses").val());
    console.log(snapshot.child("2/name").val());

  }

  if (snapshot.child("1").exists() && snapshot.child("2").exists() && playersReady === false) {
    playersReady = true;
    setTimeout(addButtons, 3000);
    console.log(playersReady);
  }


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

