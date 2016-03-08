var escapeRegExp = require( "lodash/string/escapeRegExp" );
var forEach = require( "lodash/collection/forEach" );

/**
 * Replace placeholders in the passed string.
 * @param {object} obj The object to be used for replacements.
 * @param {object} replacements The replacement values to be used.
 * @returns {string} The string with the replaced placeholders.
 */
var replaceAll = function( obj, replacements ) {
	var string = obj.text;

	var replacementString = "";
	forEach( Object.keys( replacements ), function( value ){
		if( replacementString !== "" ){
			replacementString += "|"
		}
		replacementString += "(" + escapeRegExp( value ) + ")"
	});

	var replaceObj = obj;
	return string.replace( new RegExp( replacementString, "gi"), function( matched ) {
		if( typeof replacements[ matched ] === "function" ){
			return replacements[ matched ]( replaceObj );
		}

		return replacements[ matched.toLowerCase() ];
	} );
};

module.exports = replaceAll;
