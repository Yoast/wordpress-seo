/**
 * Returns an instance of the textfield object representing a text field.
 *
 * @param {object} attributes
 * @returns {TextField}
 */
function textFieldFactory( attributes ) {
	var textFieldTemplate = require( "../../js/templates" ).fields.text;
	var TextField = require( "./text" );

	return new TextField( attributes, textFieldTemplate );
}

module.exports = textFieldFactory;
