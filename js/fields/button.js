var defaults = require( "lodash/object/defaults" );
var buttonTemplate = require( "../../js/templates" ).fields.button;

var defaultAttributes = {
	value: "",
	className: ""
};

/**
 * Represents an HTML button
 *
 * @param {Object} attributes The attributes to set on the HTML element
 * @param {string} attributes.value The value for this text field
 * @param {string} attributes.placeholder The placeholder for this text field
 * @param {string} attributes.name The name for this text field
 * @param {string} attributes.id The id for this text field
 * @param {string} attributes.className The class for this text field
 * @param {string} attributes.title The title that describes this text field
 *
 * @constructor
 */
function Button( attributes ) {
	attributes = attributes || {};
	attributes = defaults( attributes, defaultAttributes );

	this._attributes = attributes;
}

/**
 * Returns the HTML attributes set for this text field
 *
 * @returns {Object} The HTML attributes
 */
Button.prototype.getAttributes = function() {
	return this._attributes;
};

/**
 * Renders the text field to HTML
 *
 * @returns {string} The rendered HTML
 */
Button.prototype.render = function() {
	var html = buttonTemplate( this.getAttributes() );

	html = html.replace( /(\s+)/g, " " );
	html = html.replace( /> </g, "><" );
	html = html.replace( / >/g, ">" );
	html = html.replace( /> /g, ">" );
	html = html.replace( / </g, "<" );
	html = html.replace( / $/, "" );

	return html;
};

/**
 * Set the value of the input field
 *
 * @param {string} value The value to set on this input field
 */
Button.prototype.setValue = function( value ) {
	this._attributes.value = value;
};

/**
 * Set the value of the input field
 *
 * @param {string} className The class to set on this input field
 */
Button.prototype.setClassName = function( className ) {
	this._attributes.className = className;
};

module.exports = Button;
