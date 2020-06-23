"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generates a random separator of a given length.
 *
 * @param length     The length.
 * @param characters The allowed characters.
 *
 * @returns The separator.
 */
function generateSeparator(length, characters) {
    var output = "";
    for (var i = 0; i < length; i++) {
        output += characters[Math.floor(Math.random() * characters.length)];
    }
    return output;
}
exports.generateSeparator = generateSeparator;
/**
 * Generates a unique separator for a given text.
 *
 * @param text       The text.
 * @param characters The allowed characters.
 *
 * @returns The separator.
 */
function generateUniqueSeparator(text, characters) {
    var length = 2;
    while (true) {
        var separator = generateSeparator(Math.floor(length), characters);
        if (text.indexOf(separator) === -1) {
            return separator;
        }
        length += 0.2;
    }
}
exports.generateUniqueSeparator = generateUniqueSeparator;
