console.log('this is loaded');

require("dotenv").config();
exports.keys = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
  omdbapi: process.env.OMBD_API
};
