
var forEach = require( "lodash/forEach" );
var domManipulation = require( "./helpers/domManipulation.js" );

var previewModes = {
	desktop: "",
	mobile: "snippet-editor__view--mobile",
};

/**
 * Constructs the snippet preview toggle.
 *
 * @param {string}    previewMode    The default preview mode.
 * @param {Element[]} previewToggles Array with toggle elements.
 *
 * @property {string}   previewMode    The current preview mode.
 * @propert {Element[]} preivewToggles The array with toggle elements.
 * @constructor
 */
var SnippetPreviewToggler = function( previewMode, previewToggles ) {
	this.previewMode    = previewMode;
	this.previewToggles = previewToggles;
};

/**
 * Initializes the object by setting the current previewMode as the active one.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.initialize = function() {
	this._setPreviewMode( this.previewMode, this._findElementByMode( this.previewMode ) );
};

/**
 * Sets the events for the preview toggles to switch between the preview modes.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.setEvents = function() {
	forEach( this.previewToggles, function( previewToggle ) {
		previewToggle.addEventListener( "click", function( evt ) {
			evt.preventDefault();

			this._setPreviewMode( previewToggle.getAttribute( "data-type" ), previewToggle );
		}.bind( this ) );
	}.bind( this ) );
};

/**
 * Returns the element by given node.
 *
 * @param {string} previewMode The element to search.
 * @returns {Element} The found element.
 * @private
 */
SnippetPreviewToggler.prototype._findElementByMode = function( previewMode ) {
	return document.getElementsByClassName( "snippet-editor__view-icon-" + previewMode )[ 0 ];
};

/**
 * Sets the preview mode.
 *
 * @param {string}  previewMode   The preview mode that has to be set.
 * @param {Element} toggleElement The element that has been triggered.
 *
 * @returns {void}
 * @private
 */
SnippetPreviewToggler.prototype._setPreviewMode = function( previewMode, toggleElement ) {
	this._removeActiveStates();
	this._setActiveState( toggleElement );

	if( previewMode === this.previewMode ) {
		return;
	}

	var viewElement = document.getElementById( "snippet-preview-view" );

	domManipulation.removeClass( viewElement, previewModes[ this.previewMode ] );
	domManipulation.addClass( viewElement, previewModes[ previewMode ] );

	this.previewMode = previewMode;
};

/**
 * Removes all active state for the preview toggles.
 *
 * @returns {void}
 * @private
 */
SnippetPreviewToggler.prototype._removeActiveStates = function() {
	forEach( this.previewToggles, this._removeActiveState.bind( this ) );
};

/**
 * Removes the active state for the given element.
 *
 * @param {Element} previewToggle The element to remove its state for.
 * @returns {void}
 * @private
 */
SnippetPreviewToggler.prototype._removeActiveState = function( previewToggle ) {
	domManipulation.removeClass( previewToggle,  "snippet-editor__view-icon-" + previewToggle.getAttribute( "data-type" ) + "--active" );
};

/**
 * Adds active state to the given element.
 *
 * @param {Element} elementToActivate The element that will be activated.
 * @returns {void}
 * @private
 */
SnippetPreviewToggler.prototype._setActiveState = function( elementToActivate ) {
	domManipulation.addClass( elementToActivate, "snippet-editor__view-icon-" + elementToActivate.getAttribute( "data-type" ) + "--active"  );
};

module.exports = SnippetPreviewToggler;
