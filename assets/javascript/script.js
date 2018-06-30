
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
var playserReady = false;


function addButtons() {

  var buttonNames = ["Rock", "Paper", "Scissors"];


  for (i = 0; i < buttonNames.length; i++) {
    var newButton = $("<button>");
    newButton.text(buttonNames[i]);
    newButton.addClass("player" + player + "-choice");
    newButton.attr("data", buttonNames[i]);
    console.log(newButton.attr("data"));
    $("#p" + player + "-stage").append(newButton);

  }



}

function checkWin() {


}

function checkPlayers() {



  
}

$(document).ready(function () {

  $("#start-button").on("click", function () {
    event.preventDefault();
    database.ref("player").once("value").then(function (snapshot) {

      var name = $("#name").val().trim();
      var nameDisplay = $("<p>");



      if (!snapshot.child("1").exists()) {
        console.log("blah");

        database.ref("player/1").set({
          name: name,
          wins: 0,
          loses: 0
        });

        nameDisplay.text(name);
        nameDisplay.addClass("p1-name");
        $("#p1-stage").append(nameDisplay)
        player = 1;
        otherPlayer = 2;
        addButtons();

        
        console.log(player);

      }
      else if (!snapshot.child("2").exists()) {
        console.log("naw");

        database.ref("player/2").set({
          name: name,
          wins: 0,
          loses: 0
        });

        nameDisplay.text(name);
        nameDisplay.addClass("p2-name");
        $("#p2-stage").append(nameDisplay)
        player = 2;
        otherPlayer = 1;
        addButtons();
        console.log(player);
      }
      else {
        nameDisplay.text("Game is full, try again later.");
        nameDisplay.addClass("game-full");
        $("#outcome-stage").append(nameDisplay)
      }

      if (snapshot.child("1").exists() && !snapshot.child("2").exists()) {
        var p1Ready = $("<h3>")
        p1Ready.text("Waiting for Player 2")
      }

      $(".player1-choice").on("click", function () {
        database.ref("player/1/choice").set($(this).attr("data"));
        $(".player1-choice").remove();
        $("#p1-stage").append($(this).attr("data"));
        console.log($(this).attr("data"));

      });

      $(".player2-choice").on("click", function () {
        database.ref("player/2/choice").set($(this).attr("data"));
        $(".player2-choice").remove();
        $("#p2-stage").append($(this).attr("data"));
        console.log($(this).attr("data"));

      });

    });



  });



  $(window).on("beforeunload", function (event) {
    database.ref("player/" + player).remove();
  });
});