const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notesSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, default: "General" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', notesSchema);