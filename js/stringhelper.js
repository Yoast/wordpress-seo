/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**helper functions*/
YoastSEO.StringHelper = function() {};

/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
YoastSEO.StringHelper.prototype.replaceString = function(
	textString,
	stringsToRemove,
	replacement
) {
	if ( typeof replacement === "undefined" ) {
		replacement = " ";
	}
	textString = textString.replace( this.stringToRegex( stringsToRemove ), replacement );
	return this.stripSpaces( textString );
};

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
YoastSEO.StringHelper.prototype.matchString = function( textString, stringsToMatch ) {
	return textString.match( this.stringToRegex( stringsToMatch, false ) );
};

/**
 * checks if the match on textStrings is not null. If it has matches returns the length.
 * Otherwise it returns 0 (no matches).
 * @param textString
 * @param regex
 * @returns {number}
 */
YoastSEO.StringHelper.prototype.countMatches = function( textString, regex ) {
	return textString.match( regex ) !== null ? textString.match.length : 0;
};

/**
 * builds regex from array with multiple strings
 * @param stringArray
 * @returns {RegExp}
 */
YoastSEO.StringHelper.prototype.stringToRegex = function( stringArray, disableWordBoundary ) {
	var regexString;

	stringArray = stringArray.map( function( string ) {
		if ( disableWordBoundary ) {
			return string;
		} else {
			return this.getWordBoundaryString( string );
		}
	}.bind( this ) );

	regexString = "(" + stringArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "g" );
};

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {String} matchString The string to generate a regex string for.
 * @param {String} extraWordBoundary Extra characters to match a word boundary on.
 * @return {String} A regex string that matches the matchString with word boundaries
 */
YoastSEO.StringHelper.prototype.getWordBoundaryString = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	if ( typeof extraWordBoundary === "undefined" ) {
		extraWordBoundary = "";
	}

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+;!?:\/" + extraWordBoundary + "<>]";
	wordBoundaryEnd = "($|" + wordBoundary + ")";
	wordBoundaryStart = "(^|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

/**
 * Creates a regex with a wordboundary. Since /b isn't working properly in JavaScript we have to
 * use an alternative regex.
 */
YoastSEO.StringHelper.prototype.getWordBoundaryRegex = function( textString, extraWordBoundary ) {
	return new RegExp( this.getWordBoundaryString( textString, extraWordBoundary ), "ig" );
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripSpaces = function( textString ) {

	//replace multiple spaces with single space
	textString = textString.replace( /\s{2,}/g, " " );

	//replace spaces followed by periods with only the period.
	textString = textString.replace( /\s\./g, "." );

	//remove first/last character if space
	textString = textString.replace( /^\s+|\s+$/g, "" );
	return textString;
};

/**
 * adds escape characters to string
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.addEscapeChars = function( textString ) {
	return textString.replace( /[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" );
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripSomeTags = function( textString ) {

	//remove tags, except li, p, h1-6, dd
	textString = textString.replace(
		/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g,
		" "
	);
	textString = this.stripSpaces( textString );
	return textString;
};

/**
 * remove all HTMLtags from input string.
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripAllTags = function( textString ) {

	//remove all tags
	textString = textString.replace( /(<([^>]+)>)/ig, " " );

	//remove < and > if any are used
	textString = textString.replace( /[<>]/g, "" );
	textString = this.stripSpaces( textString );
	return textString;
};

/**
 * removes all words comprised only of numbers.
 * @param textString {String}
 * @returns {string}
 */
YoastSEO.StringHelper.prototype.stripNumbers = function( textString ) {

	// Remove "words" comprised only of numbers
	textString = textString.replace( this.getWordBoundaryRegex( "[0-9]+" ), "$1$3" );

	textString = this.stripSpaces( textString );

	if ( textString === "." ) {
		textString = "";
	}
	return textString;
};

/**
 * Removes all invalid characters from a certain keyword
 *
 * @param {string} keyword The un-sanitized keyword.
 * @returns {string} The sanitized keyword.
 */
YoastSEO.StringHelper.prototype.sanitizeKeyword = function( keyword ) {
	keyword = keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g, "" );

	keyword = this.stripAllTags( keyword );

	return keyword;
};

/**
 * Escapes HTML characters from strings.
 *
 * @param textString
 * @returns {string}
 */
YoastSEO.StringHelper.prototype.escapeHTML = function( textString ) {
	if ( typeof textString === "string" ) {
		textString = textString.replace( /&/g, "&amp;" )
					.replace( /</g, "&lt;" )
					.replace( />/g, "&gt;" )
					.replace( /\"/, "&quot;" )
					.replace( /\'/g, "&#39;" );
	}
	return textString;
};

/**
 * Checks if the stringhelper is already initialized. Returns stringHelper.
 *
 * @returns {YoastSEO.StringHelper}
 */
YoastSEO.getStringHelper = function() {
	if ( typeof YoastSEO.cachedStringHelper !== "object" ) {
		YoastSEO.cachedStringHelper = new YoastSEO.StringHelper();
	}
	return YoastSEO.cachedStringHelper;
};

