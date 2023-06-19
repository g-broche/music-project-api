const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
    name: String,
    country: String,
    albums: Array
}, { collection: "artists" });

module.exports = mongoose.model("Artist", ArtistSchema)