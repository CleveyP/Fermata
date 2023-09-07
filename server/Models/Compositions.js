const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompositionsSchema = new Schema({
    title: {
        type: String,
        required: true,

    },

    date: {
        type: Object
    },

    millis: {
        type: Number
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
    },
    trebleAtt: {
        type: Number,
        default: 0
    },
    trebleRel: {
        type: Number,
        default: 0
    },
    trebleSus: {
        type: Number,
        default: 0.2
    },
    trebleMento: {
        type: Number,
        default: 0
    },
    bassAtt: {
        type: Number,
        default: 0
    },
    bassRel: {
        type: Number,
        default: 0
    },
    bassSus: {
        type: Number,
        default: 0.3
    },
    bassMento: {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model("compositions", CompositionsSchema);