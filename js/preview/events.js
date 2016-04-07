var forEach = require( "lodash/collection/forEach" );

var addClass = require( "../helpers/addClass.js" );
var removeClass = require( "../helpers/removeClass.js" );

/**
 *
 * @param {Object} bindings The fields to bind.
 * @param {Object} element The element to bind the events to.
 * @param {boolean} alwaysOpen Whether the input form should always be open.
 * @constructor
 */
function PreviewEvents( bindings, element, alwaysOpen ) {
	this._bindings = bindings;
	this.element = element;
	this._alwaysOpen = alwaysOpen;
}

/**
 * Bind the events.
 *
 * @param {Object} editToggle - The edit toggle element
 * @param {Object} closeEditor - The button to close the editor
 */
PreviewEvents.prototype.bindEvents = function( editToggle, closeEditor ) {
	if ( ! this._alwaysOpen ) {
		editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
		closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );
	}

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( this._bindings, this.bindInputEvent.bind( this ) );
};

/**
 * Binds the event for the input
 *
 * @param {Object} binding The field to bind.
 */
PreviewEvents.prototype.bindInputEvent = function( binding ) {
	var previewElement = document.getElementsByClassName( binding.preview )[0];
	var inputElement = this.element.input[ binding.inputField ];

	// Make the preview element click open the editor and focus the correct input.
	previewElement.addEventListener( "click", function() {
		this.openEditor();
		inputElement.focus();
	}.bind( this ) );

	// Make focusing an input, update the carets.
	inputElement.addEventListener( "focus", function() {
		this._currentFocus = binding.inputField;

		this._updateFocusCarets();
	}.bind( this ) );

	// Make removing focus from an element, update the carets.
	inputElement.addEventListener( "blur", function() {
		this._currentFocus = null;

		this._updateFocusCarets();
	}.bind( this ) );

	previewElement.addEventListener( "mouseover", function() {
		this._currentHover = binding.inputField;

		this._updateHoverCarets();
	}.bind( this ) );

	previewElement.addEventListener( "mouseout", function() {
		this._currentHover = null;

		this._updateHoverCarets();
	}.bind( this ) );
};

/**
 * Opens the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.openEditor = function() {

	if ( this._alwaysOpen ) {
		return;
	}

	// Hide these elements.
	addClass( this.element.editToggle,       "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.formContainer, "snippet-editor--hidden" );
	removeClass( this.element.headingEditor, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.closeEditor = function() {

	if ( this._alwaysOpen ) {
		return;
	}

	// Hide these elements.
	addClass( this.element.formContainer,     "snippet-editor--hidden" );
	addClass( this.element.headingEditor,     "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.editToggle,     "snippet-editor--hidden" );

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		addClass( focusedLabel, "snippet-editor__label--focus" );
		addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

module.exports = PreviewEvents;
