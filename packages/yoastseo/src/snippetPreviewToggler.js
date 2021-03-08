import { forEach } from "lodash-es";
import domManipulation from "./helpers/domManipulation.js";

var previewModes = {
	desktop: "snippet-editor__view--desktop",
	mobile: "snippet-editor__view--mobile",
};

var minimumDesktopWidth = 640;

/**
 * Constructs the snippet preview toggle.
 *
 * @param {string}    previewMode    The default preview mode.
 * @param {Element[]} previewToggles Array with toggle elements.
 *
 * @property {string}    previewMode    The current preview mode.
 * @property {Element[]} previewToggles The array with toggle elements.
 * @property {Element}   viewElement    The target element.
 * @constructor
 */
var SnippetPreviewToggler = function( previewMode, previewToggles ) {
	this.previewMode      = previewMode;
	this.previewToggles   = previewToggles;
	this.viewElement      = document.getElementById( "snippet-preview-view" );
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
 * Binds a function on the click event of the preview toggle.
 *
 * @param {string} previewToggle The previewToggle to bind the click event on.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.bindClickEvent = function( previewToggle ) {
	previewToggle.addEventListener( "click", function() {
		this._setPreviewMode( previewToggle.getAttribute( "data-type" ), previewToggle );
		this.removeTooltipAbility( previewToggle );
	}.bind( this ) );
};

/**
 * Binds a function on the mouseleave event of the preview toggle.
 *
 * @param {string} previewToggle The previewToggle to bind the mouseleave event on.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.bindMouseleaveEvent = function( previewToggle ) {
	previewToggle.addEventListener( "mouseleave", function() {
		this.removeTooltipAbility( previewToggle );
	}.bind( this ) );
};

/**
 * Binds a function on the blur event of the preview toggle.
 *
 * @param {string} previewToggle The previewToggle to bind the blur event on.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.bindBlurEvent = function( previewToggle ) {
	previewToggle.addEventListener( "blur", function() {
		this.restoreTooltipAbility( previewToggle );
	}.bind( this ) );
};

/**
 * Binds a function on the mouseenter event of the preview toggle.
 *
 * @param {string} previewToggle The previewToggle to bind the mouseenter event on.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.bindMouseenterEvent = function( previewToggle ) {
	previewToggle.addEventListener( "mouseenter", function() {
		this.restoreTooltipAbility( previewToggle );
	}.bind( this ) );
};

/**
 * Sets the events for the preview toggles to switch between the preview modes and handle the tooltips.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.bindEvents = function() {
	forEach( this.previewToggles, function( previewToggle ) {
		this.bindClickEvent( previewToggle );
		this.bindMouseleaveEvent( previewToggle );
		this.bindBlurEvent( previewToggle );
		this.bindMouseenterEvent( previewToggle );
	}.bind( this ) );
};

/**
 * Returns the element by given mode.
 *
 * @param {string} previewMode The mode used to find the element.
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

	domManipulation.removeClass( this.viewElement, previewModes[ this.previewMode ] );
	domManipulation.addClass( this.viewElement, previewModes[ previewMode ] );

	this.previewMode = previewMode;
};

/**
 * Sets the Snippet Preview Toggler to desktop mode.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.setDesktopMode = function() {
	this._setPreviewMode( "desktop", this._findElementByMode( "desktop" ) );
};

/**
 * Sets the Snippet Preview Toggler to mobile mode.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.setMobileMode = function() {
	this._setPreviewMode( "mobile", this._findElementByMode( "mobile" ) );
};

/**
 * Sets the initial view to desktop or mobile based on the width of the Snippet Preview container.
 *
 * @param {number} previewWidth the width of the Snippet Preview container.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.setVisibility = function( previewWidth ) {
	if ( previewWidth < minimumDesktopWidth ) {
		this.setMobileMode();
		// At this point the desktop view is scrollable: set a CSS class to show the Scroll Hint message.
		domManipulation.addClass( this.viewElement, "snippet-editor__view--desktop-has-scroll" );
	} else {
		this.setDesktopMode();
	}
};

/**
 * When the window is resized, sets the visibility of the Scroll Hint message.
 *
 * @param {number} previewWidth the width of the Snippet Preview container.
 *
 * @returns {void}
 */
SnippetPreviewToggler.prototype.setScrollHintVisibility = function( previewWidth ) {
	domManipulation.removeClass( this.viewElement, "snippet-editor__view--desktop-has-scroll" );
	if ( previewWidth < minimumDesktopWidth ) {
		domManipulation.addClass( this.viewElement, "snippet-editor__view--desktop-has-scroll" );
	}
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
	domManipulation.removeClass( previewToggle, "snippet-editor__view-icon-" + previewToggle.getAttribute( "data-type" ) + "--active" );
	domManipulation.removeClass( previewToggle, "snippet-editor__view-icon--active" );
	previewToggle.setAttribute( "aria-pressed", "false" );
};

/**
 * Makes an element tooltip hidden.
 *
 * @param {Element} previewToggle The element on which the tooltip should be hidden.
 * @returns {void}
 */
SnippetPreviewToggler.prototype.removeTooltipAbility = function( previewToggle ) {
	domManipulation.addClass( previewToggle, "yoast-tooltip-hidden" );
};

/**
 * Makes an element tooltip visible.
 *
 * @param {Element} previewToggle The element on which the tooltip should be visible.
 * @returns {void}
 */
SnippetPreviewToggler.prototype.restoreTooltipAbility = function( previewToggle ) {
	domManipulation.removeClass( previewToggle, "yoast-tooltip-hidden" );
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
	domManipulation.addClass( elementToActivate, "snippet-editor__view-icon--active"  );
	elementToActivate.setAttribute( "aria-pressed", "true" );
};

export default SnippetPreviewToggler;
