require("dotenv").config();
// require keys.js
// Loading the keys.js and relevant packages
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var liriArgument = process.argv[2];
var spotify = new Spotify(
    keys.keys

    // id: "f54dac1df22948fab269f7bd1e6efa15",
    // secret: "3293019c70e74363af64970749c65e35",
);
var moment = require('moment');
moment().format();

// let url = ombd.com with your api key. trilogy api key
// request(url, (err, res,body) => ){
//    if (err ) throw err;
//}



// require file-system
var fs = require('fs');
	// Possible commands for this liri app
	switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
        case "do-what-it-says": doWhatItSays(); break;
        case "bands-in-town": artistThis(); break;
		// Instructions displayed in terminal to the user
		default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
            "4. do-what-it-says."+"\r\n"+
            "5. bands-in-town. 'any artist name' "+"\r\n"+
			"Be sure to put the movie or song name in quotation marks if it's more than one word.");
	};
// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};
// Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
function log(logResults) {
  fs.appendFile("log.txt", logResults, (error) => {
    if(error) {
      throw error;
    }
  });
}

// Spotify function, uses the Spotify module to call the Spotify api
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if(!songName){
        songName = "What's my age again";
    }
    params = songName;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults); // calling log function
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
};

function movieThis(){
    var movie = process.argv[3];
    if(!movie){
        movie = "mr nobody";
    }
    params = movie
    request("http://www.omdbapi.com/?apikey=" + keys.keys.omdbapi + "&t=" + params + "&y=&plot=short&r=json&tomatoes=true",{
    JSON: true },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            //console.log(movieObject); // Show the text in the terminal
            var movieResults =
            "------------------------------ begin ------------------------------" + "\r\n"
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating +"\r\n"+
            // "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
            "------------------------------ fin ------------------------------" + "\r\n";
            console.log(movieObject);
            console.log(movieResults);
            log(movieResults); // calling log function
        } else {
            console.log("Error :"+ error);
            return;
        }
    });
};
function artistThis(){
    console.log("artistThis");
    var bandsInTown = process.argv[3];
    if(!bandsInTown){
        console.log("Invalid Artist");
    }
    params = bandsInTown
    console.log(params);
    request("https://rest.bandsintown.com/artists/" + params + "/events?app_id=codingbootcamp"),

    function (error, response, body) {
        if (!error && response.statusCode == 200)
         {console.log(error);

            var bandsObject = JSON.parse(body);
            //console.log(movieObject); // Show the text in the terminal
            var bandResults =
            "------------------------------ begin ------------------------------" + "\r\n"
            "Name of Venue: " + name.venueData+"\r\n"+
            "Location: " + bandsObject.venue.city+"\r\n"+
            "Date Of Event: " + bandsObject.dateTime+"\r\n"+
            "------------------------------ fin ------------------------------" + "\r\n";
            console.log(bandsObject);
            console.log(bandResults);
            log(bandResults); // calling log function
        } else {
            console.log("Error :"+ error);
            return;
        };
    
    };
};



