/* global jQuery */

var getL10nObject = require( "./getL10nObject" );
var getI18n = require( "./getI18n" );
var getTitlePlaceholder = require( "./getTitlePlaceholder" );
var getDescriptionPlaceholder = require( "./getDescriptionPlaceholder" );

var SnippetPreview = require( "yoastseo" ).SnippetPreview;

/**
 * Removes all analysis objects from the DOM except the snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @returns {void}
 */
function isolate( snippetContainer ) {
	snippetContainer = jQuery( snippetContainer );

	// Remove all other table rows except the snippet preview one.
	var tr = snippetContainer.closest( "tr" );
	tr.siblings().hide();

	// Remove the tab navigation.
	jQuery( ".wpseo-metabox-tabs" ).hide();
}

/**
 * Returns all the arguments required to create a snippet preview object.
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @returns {Object} An object with all the arguments required to create a snippet preview object.
 */
function getSnippetPreviewArgs( snippetContainer, data, saveCallback ) {
	var l10nObject = getL10nObject();

	snippetContainer = jQuery( snippetContainer ).get( 0 );

	var titlePlaceholder = getTitlePlaceholder();
	var descriptionPlaceholder = getDescriptionPlaceholder();

	var snippetPreviewArgs = {
		targetElement: snippetContainer,
		placeholder: {
			title: titlePlaceholder,
			urlPath: "",
		},
		defaultValue: {
			title: titlePlaceholder,
		},
		baseURL: l10nObject.base_url,
		callbacks: {
			saveSnippetData: saveCallback,
		},
		metaDescriptionDate: l10nObject.metaDescriptionDate,
		data: data,

	};

	if ( descriptionPlaceholder !== "" ) {
		snippetPreviewArgs.placeholder.metaDesc = descriptionPlaceholder;
		snippetPreviewArgs.defaultValue.metaDesc = descriptionPlaceholder;
	}

	return snippetPreviewArgs;
}
/**
 * Creates a snippet preview in the given location
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @returns {SnippetPreview} The newly created snippet preview object.
 */
function create( snippetContainer, data, saveCallback ) {
	var args = getSnippetPreviewArgs( snippetContainer, data, saveCallback );

	return new SnippetPreview( args );
}

/**
 * Creates a standalone snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @returns {SnippetPreview} The newly created snippet preview object.
 */
function createStandalone( snippetContainer, data, saveCallback ) {
	var args;

	args = getSnippetPreviewArgs( snippetContainer, data, saveCallback );
	args.i18n = getI18n();

	var snippetPreview = new SnippetPreview( args );
	snippetPreview.renderTemplate();
	snippetPreview.callRegisteredEventBinder();
	snippetPreview.bindEvents();
	snippetPreview.init();

	return snippetPreview;
}

module.exports = {
	isolate: isolate,
	create: create,
	createStandalone: createStandalone,
};
