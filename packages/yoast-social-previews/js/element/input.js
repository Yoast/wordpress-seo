var isEmpty = require( "lodash/lang/isEmpty" );
var debounce = require( "lodash/function/debounce" );
var analysis = require( "yoastseo" );
var stripHTMLTags = analysis.string.stripHTMLTags;
var stripSpaces = analysis.string.stripSpaces;

/**
 * Represents a field and sets the events for that field.
 *
 * @param {Object}           inputField The field to represent.
 * @param {Object}           values     The values to use.
 * @param {Object|undefined} callback   The callback to executed after field change.
 * @constructor
 */
function InputElement( inputField, values, callback ) {
	this.inputField = inputField;
	this.values = values;
	this._callback = callback;

	this.setValue( this.getInputValue() );

	this.bindEvents();
}

/**
 * Binds the events.
 *
 * @returns {void}
 */
InputElement.prototype.bindEvents = function() {
	// Set the events.
	this.inputField.addEventListener( "keydown", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "keyup", this.changeEvent.bind( this ) );

	this.inputField.addEventListener( "input", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "focus", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "blur", this.changeEvent.bind( this ) );
};

/**
 * Do the change event.
 *
 * @type {Function}
 */
InputElement.prototype.changeEvent = debounce( function() {
	// When there is a callback run it.
	if ( typeof this._callback !== "undefined" ) {
		this._callback();
	}

	this.setValue( this.getInputValue() );
}, 25 );

/**
 * Gets the current field value.
 *
 * @returns {string} The current field value.
 */
InputElement.prototype.getInputValue = function() {
	return this.inputField.value;
};

/**
 * Formats the a value for the preview. If value is empty a sample value is used.
 *
 * @returns {string} The formatted title, without html tags.
 */
InputElement.prototype.formatValue = function() {
	var value = this.getValue();

	value = stripHTMLTags( value );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( value ) ) {
		value = this.values.fallback;
	}

	return stripSpaces( value );
};

/**
 * Get the value.
 *
 * @returns {string} Return the value or get a fallback one.
 */
InputElement.prototype.getValue = function() {
	var value = this.values.currentValue;

	// Fallback to the default if value is empty.
	if ( isEmpty( value ) ) {
		value = this.values.defaultValue;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( value ) ) {
		value = this.values.placeholder;
	}

	return value;
};

/**
 * Set the current value.
 *
 * @param {string} value The value to set.
 *
 * @returns {void}
 */
InputElement.prototype.setValue = function( value ) {
	this.values.currentValue = value;
};

module.exports = InputElement;
