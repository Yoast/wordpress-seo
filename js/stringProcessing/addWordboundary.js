/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {String} matchString The string to generate a regex string for.
 * @param {String} extraWordBoundary Extra characters to match a word boundary on.
 * @return {String} A regex string that matches the matchString with word boundaries
 */
module.exports = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	if ( typeof extraWordBoundary === "undefined" ) {
		extraWordBoundary = "";
	}

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+;!?:\/" + extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};
