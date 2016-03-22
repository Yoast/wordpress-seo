var defaults = require( "lodash/object/defaults" );
var minimizeHtml = require( "../helpers/minimizeHtml" );

var defaultAttributes = {
	value: "",
	className: "",
	id: "",
	placeholder: "",
	name: "",
	title: "",
	labelClassName: ""
};

/**
 * Represents an HTML text field
 *
 * @param {Object} attributes The attributes to set on the HTML element
 * @param {string} attributes.value The value for this text field
 * @param {string} attributes.placeholder The placeholder for this text field
 * @param {string} attributes.name The name for this text field
 * @param {string} attributes.id The id for this text field
 * @param {string} attributes.className The class for this text field
 * @param {string} attributes.title The title that describes this text field
 * @param {Object} template
 *
 * @constructor
 */
function TextField( attributes, template ) {
	attributes = attributes || {};
	attributes = defaults( attributes, defaultAttributes );

	this._attributes = attributes;
	this._template = template;
}

/**
 * Returns the HTML attributes set for this text field
 *
 * @returns {Object} The HTML attributes
 */
TextField.prototype.getAttributes = function() {
	return this._attributes;
};

/**
 * Renders the text field to HTML
 *
 * @returns {string} The rendered HTML
 */
TextField.prototype.render = function() {
	var html = this._template( this.getAttributes() );

	html = minimizeHtml( html );

	return html;
};

/**
 * Set the value of the input field
 *
 * @param {string} value The value to set on this input field
 */
TextField.prototype.setValue = function( value ) {
	this._attributes.value = value;
};

/**
 * Set the value of the input field
 *
 * @param {string} className The class to set on this input field
 */
TextField.prototype.setClassName = function( className ) {
	this._attributes.className = className;
};

module.exports = TextField;
