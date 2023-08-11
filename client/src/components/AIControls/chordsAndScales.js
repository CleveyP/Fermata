let chords = new Map();
let scales = new Map();

//populate the scales
scales.set("A", ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
scales.set("B", ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']);
scales.set("C", ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
scales.set("D", ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
scales.set("E", ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']);
scales.set("F", ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
scales.set("G", ['G', 'A', 'B', 'C', 'D', 'E', 'F#']);

scales.set("Ab", ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']);
scales.set("Bb", ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']);
scales.set("Cb", ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb']);
scales.set("Db", ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']);
scales.set("Eb", ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D']);
scales.set("Fb", ['Fb', 'Gb', 'Ab', 'A', 'Cb', 'Db', 'Eb']);
scales.set("Gb", ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']);

scales.set("A#", ['A#', 'B#', 'D', 'D#', 'E#', 'G', 'A']);
scales.set("B#", ['B#', 'D', 'E', 'F', 'G', 'A', 'B']);
scales.set("C#", ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#']);
scales.set("D#", ['D#', 'E#', 'G', 'G#', 'A#', 'B#', 'D']);
scales.set("E#", ['E#', 'G', 'A', 'A#', 'B#', 'D', 'E']);
scales.set("F#", ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']);
scales.set("G#", ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F']);

//populate the chords

chords.set("A", [['A', 'C#', 'E'], ['B', 'D', "F#"], ['C#', "E", 'G#'], ['D', 'F#', 'A'], ['E', 'G#', 'B'], ['F#', 'A', 'C#'], ['G#', "B", 'D']]);
chords.set("B", [['B', 'D#', 'F#'], ['C#', 'E', "G#"], ['D#', "F#", 'A#'], ['E', 'G#', 'B'], ['F#', 'A#', 'C#'], ['G#', 'B', 'D#'], ['A#', "C#", 'E']]);
chords.set("C", [['C', 'E', 'G'], ['D', 'F', "A"], ['E', "G", 'B'], ['F', 'A', 'C'], ['G', 'B', 'D'], ['A', 'C', 'E'], ['B', "D", 'F']]);
chords.set("D", [['D', 'F#', 'A'], ['E', 'G', "B"], ['F#', "A", 'C#'], ['G', 'B', 'D'], ['A', 'C#', 'E'], ['B', 'D', 'F#'], ['C#', "E", 'G']]);
chords.set("E", [['E', 'G#', 'B'], ['F#', 'A', "C#"], ['G#', "B", 'D#'], ['A', 'C#', 'E'], ['B', 'D#', 'F#'], ['C#', 'E', 'G#'], ['D#', "F#", 'A']]);
chords.set("F", [['F', 'A', 'C'], ['G', 'Bb', "D"], ['A', "C", 'E'], ['Bb', 'D', 'F'], ['C', 'E', 'G'], ['D', 'F', 'A'], ['E', "G", 'Bb']]);
chords.set("G", [['G', 'B', 'D'], ['A', 'C', "E"], ['B', "D", 'F#'], ['C', 'E', 'G'], ['D', 'F#', 'A'], ['E', 'G', 'B'], ['F#', "A", 'C']]);

chords.set("Ab", [['Ab', 'C', 'Eb'], ['Bb', 'Db', "F"], ['C', "Eb", 'G'], ['Db', 'F', 'Ab'], ['Eb', 'G', 'Bb'], ['F', 'Ab', 'C'], ['G', "Bb", 'Db']]);
chords.set("Bb", [['Bb', 'D', 'F'], ['C', 'Eb', "G"], ['D', "F", 'A'], ['Eb', 'G', 'Bb'], ['F', 'A', 'C'], ['G', 'Bb', 'D'], ['A', "C", 'Eb']]);
chords.set("Cb", [['Cb', 'Eb', 'Gb'], ['Db', 'Fb', "Ab"], ['Eb', "Gb", 'Bb'], ['Fb', 'Ab', 'Cb'], ['Gb', 'Bb', 'Db'], ['Ab', 'Cb', 'Eb'], ['Bb', "Db", 'Fb']]);
chords.set("Db", [['Db', 'F', 'Ab'], ['Eb', 'Gb', "Bb"], ['F', "Ab", 'C'], ['Gb', 'Bb', 'Db'], ['Ab', 'Cb', 'Eb'], ['Bb', 'Db', 'F'], ['C', "Eb", 'Gb']]);
chords.set("Eb", [['Eb', 'G', 'Bb'], ['F', 'Ab', "C"], ['G', "Bb", 'D'], ['Ab', 'C', 'Eb'], ['Bb', 'D', 'F'], ['C', 'Eb', 'G'], ['D', "F", 'Ab']]);
chords.set("Fb", [['Fb', 'Ab', 'Cb'], ['Gb', 'A', "Db"], ['Ab', "Cb", 'Eb'], ['A', 'Db', 'Fb'], ['Cb', 'Eb', 'Gb'], ['Db', 'Fb', 'Ab'], ['Eb', "Gb", 'A']]);
chords.set("Gb", [['Gb', 'Bb', 'Db'], ['Ab', 'Cb', "Eb"], ['Bb', "Db", 'F'], ['Cb', 'Eb', 'Gb'], ['Db', 'F', 'Ab'], ['Eb', 'Gb', 'Bb'], ['F', "Ab", 'Cb']]);

// chords.set("A#", ['A#', 'B#', 'D', 'D#', 'E#', 'G', 'A']);
// chords.set("B#", ['B#', 'D', 'E', 'F', 'G', 'A', 'B']);
// chords.set("C#", ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#']);
// chords.set("D#", ['D#', 'E#', 'G', 'G#', 'A#', 'B#', 'D']);
// chords.set("E#", ['E#', 'G', 'A', 'A#', 'B#', 'D', 'E']);
// chords.set("F#", ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']);
// chords.set("G#", ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'chords

export const chordQualities = ["major", "minor", "minor", "major", "dominant", "minor", "diminished"];


export function deepCopyArray(arr) {
    return arr.map(subArray => [...subArray]);
  }

export const chordsAndScales = {chords: chords, scales: scales};









