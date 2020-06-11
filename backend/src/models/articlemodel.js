const mongoose = require("mongoose");

let articleSchema = mongoose.Schema({
    title: String,
    body: String,
    author: String
});

const Article = mongoose.model("Article", articleSchema);

module.exports = {Article};