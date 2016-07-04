/* global jQuery */

"use strict";

var getI18n = require( './getI18n' );
var SnippetPreview = require( 'yoastseo' ).SnippetPreview;

/**
 * Removes all analysis objects from the DOM except the snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 */
function isolate( snippetContainer ) {
	snippetContainer = jQuery( snippetContainer );

	// Remove all other table rows except the snippet preview one.
	var tr = snippetContainer.closest( 'tr' );
	tr.siblings().hide();

	// Remove the tab navigation.
	jQuery( '#wpseo-metabox-tabs' ).hide();
}

/**
 * Creates a standalone snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @returns {SnippetPreview} The newly created snippet preview object.
 */
function createStandalone( snippetContainer ) {
	snippetContainer = jQuery( snippetContainer );

	var i18n = getI18n();

	var snippetPreviewContainer = snippetContainer.get( 0 );

	var args = {
		i18n: i18n,
		targetElement: snippetPreviewContainer
	};

	var snippetPreview = new SnippetPreview( args );
	snippetPreview.renderTemplate();
	snippetPreview.callRegisteredEventBinder();
	snippetPreview.bindEvents();
	snippetPreview.init();

	return snippetPreview;
}

module.exports = {
	isolate: isolate,
	createStandalone: createStandalone
};
