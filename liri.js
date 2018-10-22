require("dotenv").config();
//initializing node-spotify-api package
var Spotify = require("node-spotify-api");
//getting data from keys file
var keys = require("./keys.js");
//filesystem initialize
var fs = require("fs");
//initializing request
var request = require("request");
//asigning process.argv to the switch case 'liriArguments'
var liriArgument = process.argv[2];
//calling the id and secret for spotify
var spotify = new Spotify(
    keys.keys
);
//initializing chalk package
const chalk = require("chalk");
//initializing moment.js
var moment = require("moment");

// Possible commands for this liri app
switch (liriArgument) {
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
    case "bands-in-town": artistThis(); break;
    // Instructions displayed in terminal to the user
    default: console.log("\r\n" + "Try typing one of the following commands after 'node liri.js' : " + "\r\n" +
        "1. spotify-this-song 'any song name' " + "\r\n" +
        "2. movie-this 'any movie name' " + "\r\n" +
        "3. do-what-it-says." + "\r\n" +
        "4. bands-in-town. 'any artist name' " + "\r\n" +
        "Be sure to put the movie or song name in quotation marks if it's more than one word.");
};
// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};
// function that logs all the results to the log.text file in beautiful layout
function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
        if (error) {
            throw error;
        };
    });
};

// Spotify this song function
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if (!songName) {
        songName = "What's my age again";
    };
    params = songName;
    spotify.search({ type: "track", query: params },
        function (error, data) {
            if (!error) {
                var songInfo = data.tracks.items;
                for (var i = 0; i < 5; i++) {
                    if (songInfo[i] != undefined) {
                        var spotifyResults =
                            "-------------------- SPOTIFY-THIS-SONG --------------------" + "\r\n" +
                            "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                            "Song: " + songInfo[i].name + "\r\n" +
                            "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                            "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                            "-------------------- " + i + " --------------------" + "\r\n";
                        console.log(chalk.bold.redBright(spotifyResults));
                        log(spotifyResults); // calling log function
                    }
                }
            } else {
                console.log("Error :" + err);
                return;
            }
        });
};
// movie this function
function movieThis() {
    var movie = process.argv[3];
    if (!movie) {
        movie = "mr nobody";
    };
    params = movie
    request("http://www.omdbapi.com/?apikey=" + keys.keys.omdbapi + "&t=" + params + "&y=&plot=short&r=json&tomatoes=true", {
        JSON: true
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const movieObject = JSON.parse(body);
                //console.log(movieObject); // Show the text in the terminal
                const movieResults =
                    "-------------------- MOVIE REVIEW --------------------" + "\r\n" +
                    "Title: " + movieObject.Title + "\r\n" +
                    "Year: " + movieObject.Year + "\r\n" +
                    "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
                    "Country: " + movieObject.Country + "\r\n" +
                    "Language: " + movieObject.Language + "\r\n" +
                    "Plot: " + movieObject.Plot + "\r\n" +
                    "Actors: " + movieObject.Actors + "\r\n" +
                    "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                    // "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
                    "-------------------- END --------------------" + "\r\n";
                console.log(chalk.bold.blue(movieResults));
                log(movieResults); // calling log function
            } else {
                console.log("Error :" + error);
                return;
            };
        });
};
// bands in town function
function artistThis() {
    console.log("artistThis");
    const bandsInTown = process.argv[3];
    if (!bandsInTown) {
        console.log("Invalid Artist");
    };
    params = bandsInTown
    console.log(params);
    request("https://rest.bandsintown.com/artists/" + params + "/events?app_id=" + keys.keys.bandsintown,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                const bandsObject = JSON.parse(body);
                let venueDate = 'dddd, MMMM Do YYYY [at] h:mm A'; // date displayed in the format of Thursday, April 12th 2018 at 6:29 PM

                // moment(bandsObject[0].datetime).format(dateFormat)
                const bandResults =
                    "-------------------- BANDS IN TOWN --------------------" + "\r\n" +
                    "BAND NAME: " + bandsObject[0].lineup + "\r\n" +

                    "VENUE: " + bandsObject[0].venue.name + "\r\n" +

                    "LOCATION OF VENUE: " + bandsObject[0].venue.city + "\r\n" +

                    "DATE: " +  moment(bandsObject[0].datetime).format(venueDate) + "\r\n" +
                    "-------------------- END --------------------" + "\r\n";
                console.log(chalk.bold.magenta(bandResults));
                log(bandResults)
            } else {
                console.log("Error :" + error);
                return;
            };
        });
};



