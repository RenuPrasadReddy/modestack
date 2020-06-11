const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: String,
    email:{
        type: String
    },
    password: String,
    address: String

});

const User = mongoose.model("User", userSchema);

module.exports = {User};