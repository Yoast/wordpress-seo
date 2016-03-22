
/**
 * Returns an instance of the textfield object to represent a textarea.
 *
 * @param {object} attributes
 * @returns {TextField}
 */
function textAreaFactory( attributes ) {
	var textAreaTemplate = require( "../../js/templates" ).fields.textarea;
	var TextField = require( "./text" );

	return new TextField( attributes, textAreaTemplate );
}

module.exports = textAreaFactory;