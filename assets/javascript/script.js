
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

//Load page with player data or submit name to play or waiting for other player
var database = firebase.database();

var player = 0;
var otherPlayer = 0;
var playersReady = false;
var numberOfPlayers = 0;

//Function to create buttons
function addButtons() {

  //Names of buttons
  var buttonNames = ["rock", "paper", "scissors"];
  $("#p1-buttons").empty();
  $("#p2-buttons").empty();

  //Loop through buttonNames array to create butons
  for (i = 0; i < buttonNames.length; i++) {
    var newButton = $("<button>");
    newButton.text(buttonNames[i]);
    newButton.addClass("player" + player + "-choice");
    newButton.attr("data", buttonNames[i]);
    console.log(newButton.attr("data"));
    $("#p" + player + "-buttons").append(newButton);

  }
}

console.log(playersReady);
//Function to check winner
function checkWinner(player2Choice) {
  firebase.database().ref().once("value").then(function (snapshot) {
    // On tie
    if (snapshot.child("player/1/choice").val() == player2Choice) {
      // Set winner to 0 (tie game)
      database.ref("winner").set("0");

    } // On player 1 win
    else if ((snapshot.child("player/1/choice").val() == "rock" && snapshot.child("player/2/choice").val() == "scissors") ||
      (snapshot.child("player/1/choice").val() == "paper" && snapshot.child("player/2/choice").val() == "rock") ||
      (snapshot.child("player/1/choice").val() == "scissors" && snapshot.child("player/2/choice").val() == "paper")) {

      // Add to player 1 wins and player 2 loses
      firebase.database().ref("player/1/wins").transaction(function (currentWins) { return currentWins + 1; });
      firebase.database().ref("player/2/loses").transaction(function (currentLoses) { return currentLoses + 1; });

      // Set winner to 1 (player 1)
      firebase.database().ref("winner").set("1");

    } // On player 2 win
    else {
      // Add to player 2 wins and player 1 loses
      firebase.database().ref("player/2/wins").transaction(function (currentWins) { return currentWins + 1; });
      firebase.database().ref("player/1/loses").transaction(function (currentLoses) { return currentLoses + 1; });

      // Set winner to 2 (player 2)
      firebase.database().ref("winner").set("2");
    }
  });
}

//Function to show winner on page
function showWinner() {
  firebase.database().ref().once("value").then(function (snapshot) {
    // Show text on page depending on win/loss/tie
    switch (snapshot.child("winner").val()) {
      case "0": $("#outcome-stage").html("<h2>Its a tie!<h2>"); break;
      case "1": $("#outcome-stage").html("<h2>" + snapshot.child("player/1/name").val() + " wins!</h2>"); break;
      case "2": $("#outcome-stage").html("<h2>" + snapshot.child("player/2/name").val() + " wins!</h2>"); 
    }

    // // Remove previous game data if still present
    // if (snapshot.child("1/choice").exists()) { firebase.database().ref("player/1/choice").remove(); }
    // if (snapshot.child("winner").exists()) { firebase.database().ref("win/winner").remove(); }

    setTimeout(resetGame, 2000);

    // Start game over
    function resetGame() {
      $("#outcome-stage").html("");
      database.ref("player/1/choice").remove();
      database.ref("player/2/choice").remove();
      database.ref("winner").remove();
      $("#outcome-stage").html("Waiting for Player 1 choice!");
      addButtons();
    }
  });
}

//Function to listens for a child being removed to take players off page
database.ref("player").on("child_removed", function (snapshot) {

  if (snapshot.val().name) {
    $("#p" + otherPlayer + "-name").text("Waiting for player");
    $("#p" + otherPlayer + "-wins").empty();
    $("#p" + otherPlayer + "-loses").empty();
    $("#p" + otherPlayer + "-buttons").empty();

    console.log("hi");
  }

});

//Document ready functoin
$(function () {
  //On click event listener for start button
  $("#start-button").on("click", function () {
    event.preventDefault();

    //Function that listens to value change in Firebase
    database.ref("player").once("value").then(function (snapshot) {

      //Set player input to name
      var name = $("#name").val().trim();
      //Set p element creation to variable
      var nameDisplay = $("<p>");

      //Check if player 1 exists in firebase if not create player
      if (!snapshot.child("1").exists()) {
        player = 1;
        otherPlayer = 2;
        numberOfPlayers++;
        console.log("blah");
        console.log(numberOfPlayers);

        //Create player child in Firebase
        database.ref("player/1").set({
          name: name,
          wins: 0,
          loses: 0
        });


      }
      //Check if player 2 exists in firebase if not create player
      else if (!snapshot.child("2").exists()) {
        player = 2;
        otherPlayer = 1;
        numberOfPlayers++;

        //Create player child in Firebase
        database.ref("player/2").set({
          name: name,
          wins: 0,
          loses: 0
        });


      }
      //if player 1 and player 2 exists display message in outcome-stage div
      else {
        nameDisplay.text("Game is full, try again later.");
        nameDisplay.addClass("game-full");
        $("#outcome-stage").append(nameDisplay)
      }

      
    });

  });


  //Click listener for player one buttons
  $(document).on('click', '.player1-choice', function () {


    database.ref("player/" + player + "/choice").set($(this).attr("data"));
    $(".player-choice").remove();
    $("#p" + player + "-buttons").append($(this).attr("data"));
    console.log($(this).attr("data"));

    database.ref("player/" + player).update({
      choice: $(this).attr("data")
    });

  });

  //Click listener for player two buttons
  $(document).on('click', '.player2-choice', function () {


    database.ref("player/" + player + "/choice").set($(this).attr("data"));
    $(".player-choice").remove();
    $("#p" + player + "-buttons").append($(this).attr("data"));
    console.log($(this).attr("data"));

    database.ref("player/" + player).update({
      choice: $(this).attr("data")
    });

    checkWinner();

});


//Unload listener to remove information from Firebase on refresh or closing page
$(window).on("beforeunload", function () {
  database.ref("player/" + player).remove();
  database.ref("winner").remove();
  playersReady = false;

});
});

//Function that listens for winner child to be created
database.ref().on("value", function (snapshot) {

  if (snapshot.child("winner").exists()) {
    showWinner();
  }

});

//Function that listens to change in player children
database.ref().on("value", function (snapshot) {

  console.log(playersReady);
  console.log(snapshot.child("player/1").val());
  //Fill page with content when players 1 exist
  if (snapshot.child("player/1").exists()) {

    $("#p1-name").html(snapshot.child("player/1/name").val());
    $("#p1-wins").html("Wins: " + snapshot.child("player/1/wins").val());
    $("#p1-loses").html("Loses: " + snapshot.child("player/1/loses").val());
    $("#message").html()
    console.log(snapshot.child("1/name").val());
  }

  //Fill page with content when players 1 exist
  if (snapshot.child("player/2").exists()) {

    $("#p2-name").html(snapshot.child("player/2/name").val());
    $("#p2-wins").html("Wins: " + snapshot.child("player/2/wins").val());
    $("#p2-loses").html("Loses: " + snapshot.child("player/2/loses").val());
    console.log(snapshot.child("2/name").val());

  }

  //Call addButtons fucntion when players exist
  if (snapshot.child("player/1").exists() && snapshot.child("player/2").exists() && playersReady === false) {
    playersReady = true;
    addButtons();
    console.log(playersReady);
  };


  if (playersReady == false) {
    $("#outcome-stage").text("Waiting for players to join");
    console.log("farts");
  }
  else if (playersReady == true && !snapshot.child("player/1/choice").exists()) {
    $("#outcome-stage").html("Waiting for Player 1 choice!");
    console.log("playersReady");
  }
  else {
    $("#outcome-stage").text("Waiting for Player 2 choice")
  }



}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);


});

