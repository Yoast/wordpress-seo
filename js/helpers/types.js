/**
 * Gets the parsed type name of subjects.
 *
 * @param {array|object|string|number} subject The subject to get the parsed type from.
 * @returns {string} The parsed type name.
 */
var getType = function( subject ) {
	var rawTypeName = toString.call( subject );
	var parsedTypeName = "undefined";

	switch( rawTypeName ) {
		case "[object Array]":
			parsedTypeName =  "array";
			break;
		case "[object Object]":
			parsedTypeName = "object";
			break;
		case "[object String]":
			parsedTypeName = "string";
			break;
		case "[object Number]":
			parsedTypeName = "number";
			break;
		case "[object Boolean]":
			parsedTypeName = "boolean";
			break;
		default:
			return rawTypeName;
	}
	return parsedTypeName;
};

/**
 * Validates the type of subjects. Throws an error if the type is invalid.
 *
 * @param {object} subject The object containing all subjects.
 * @param {string} expectedType The expected type.
 * @returns {boolean} Returns true if types matches expected type. Otherwise returns false.
 */
var isSameType = function( subject, expectedType ) {
	var passedType = getType( subject );
	return passedType === expectedType;
};

module.exports = {
	getType: getType,
	isSameType: isSameType,
};
