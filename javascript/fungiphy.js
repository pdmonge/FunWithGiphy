// Use giphy API to retrieve interesting gifs

// Initialize topic list - Actors
var actorsList = [
	'Anthony Hopkins',
	'Charlize Theron',
	'James Earl Jones',
	'Ben Affleck',
	'Michelle Yeoh',
	'Cate Blanchette'];

const maxGifs = 9; // Don't change without changing the HTML or changing to dynamic loading
const apiKey = '9afb8f5d4c4b492c9afe06afb0904326';
var imagesLoaded = false;
var buttonsAreaDiv;
var gifsList;

function buildAButton (btnName, btnIndex) {
// Builds a HTML button and returns it
//		Required: btnName type String
//		Required: btnIndex type Number
	var newButton = $('<button>');
	newButton.addClass('btn');
	newButton.addClass('btn-info');
	newButton.attr('type','button');
	newButton.attr('data-index', btnIndex);
	newButton.text(btnName);

	return newButton;
}

function addNewButton () {
	// Capture data for new button
	newActorName = $('#input-actor-name').val().trim();
	newActorIndex = actorsList.length;

	// Empty the input once data is captured
	$('#input-actor-name').val('');

	// Add the new actor to actorsList
	actorsList.push(newActorName);

	// Create the new button and add it the page
	var newActorButton = buildAButton(newActorName, newActorIndex);
	buttonsAreaDiv.append(newActorButton);
}

function getGifs () {
// Retrieve gifs from giphy and load them into the image placeholders

	var actorIndex = $(this).attr('data-index');
	var actorName = $(this).text();
	var queryURL='';

	// Construct a queryURL using the actorName
	// replace spaces with + for the queryURL
	queryURL += 'https://api.giphy.com/v1/gifs/search?q=';
	queryURL += actorName.replace(/ /g, '+');
	queryURL += '&api_key='+apiKey;
	queryURL += '&limit='+maxGifs;

	// Performing an AJAX get request with the queryURL
	$.get(queryURL).done(function(response) {

		// Store the data from the AJAX request in the results variable
		var results = response.data;

		// Looping through each result item
		for (var i = 0,len=results.length; i < len; i++) {
			// Add data values to each img
			gifImageList.eq(i).attr("data-still", results[i].images.fixed_height_still.url);
			gifImageList.eq(i).attr("data-animate", results[i].images.fixed_height.url);
			
			// Set the initial state of gif to still
			gifImageList.eq(i).attr("data-state", "still");
			gifImageList.eq(i).attr("src", results[i].images.fixed_height_still.url);

			// Add the rating
			$('#rating'+i).text('Rating: '+results[i].rating);
		}
		imagesLoaded = true;
	});
}

function toggleGif () {
// Change gif from still to animated
	if (imagesLoaded) {
		if ($(this).attr("data-state") === "still") {
	    $(this).attr("data-state", "animate");
	    $(this).attr("src", $(this).attr("data-animate"));
		}
		else {
		  $(this).attr("data-state", "still");
		  $(this).attr("src", $(this).attr("data-still"));
		}
	}
}

$(document).ready(function() {

	// Initialize global DOM object variables
	buttonsAreaDiv = $('#buttons-area');
	gifImageList = $('.gallery img');

	// Remove any existing subject buttons
	buttonsAreaDiv.empty();

	// Add buttons for items already in actorsList
	for (var i = 0,len=actorsList.length; i < len; i++) {
		buttonsAreaDiv.append(buildAButton(actorsList[i], i));
	}

	// Handle click for Add button
	$('#btn-add-new').click(function (event) {
		event.preventDefault();
		addNewButton();
	});

	// Handle click for Actor buttons
	buttonsAreaDiv.on("click", ".btn", getGifs);

	// Handle clicks on gifs
	gifImageList.click(toggleGif);
});