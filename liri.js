require("dotenv").config();

console.log(process.env.MONGODB_URI);
console.log(process.env.spotifyKey);

const keys = {
    spotfiy: process.env.spotifyKey
}

var spotfiy = new Spotify(keys.spotify);
