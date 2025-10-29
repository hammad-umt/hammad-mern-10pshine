const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   // optional but recommended
    },
    password: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: false,
    }
}, { timestamps: true }); // optional: createdAt, updatedAt

const User = mongoose.model("User", userSchema);
module.exports = User;
