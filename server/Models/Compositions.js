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
    },
    bpm: {
        type: Number,
        default: 120
    },
    trebleSynth: {
        type: String,
        default: "FM"
    },
    bassSynth: {
        type: String,
        default: "FM"
    },
    trebleEffects: {
        type: []
    },
    bassEffects: {
        type: []
    },
    trebleVolume: {
        type: Number,
        default: 0
    },
    bassVolume: {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model("compositions", CompositionsSchema);