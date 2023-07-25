const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompositionsSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    numBars: {
        type: Number,
        required: true,
    },
    timeSignature: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    compositionArray: {
        type: Object
    }
})

module.exports = mongoose.model("compositions", CompositionsSchema);