import { markers, languageProcessing } from "yoastseo";
import { forEach } from "lodash-es";

var MARK_TAG = "yoastmark";

/**
 * Cleans the editor of any invalid marks. Invalid marks are marks where < and > are converted to
 * html entities by tinyMCE so these can be filtered out to keep the output text clean.
 *
 * @param {tinyMCE.Editor} editor The editor to remove invalid marks from.
 *
 * @returns {void}
 */
function removeInvalidMarks( editor ) {
	var html = editor.getContent();

	html = html
		.replace( new RegExp( "&lt;yoastmark.+?&gt;", "g" ), "" )
		.replace( new RegExp( "&lt;/yoastmark&gt;", "g" ), "" );

	editor.setContent( html );
}

/**
 * Puts a list of marks into the given tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to apply the marks to.
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 *
 * @returns {void}
 */
function markTinyMCE( editor, paper, marks ) {
	const dom = editor.dom;
	let html = editor.getContent();
	html = markers.removeMarks( html );

	/*
	 * Get the information whether we want to mark a specific part of the HTML. If we do, `fieldsToMark` should return an array with that information.
	 * For example, [ "subehading" ] means that we only want to apply the markings in subheadings only, and not the other parts.
	 * `selectedHTML` is an array of the HTML parts that we want to apply the marking to.
	 */
	const { fieldsToMark, selectedHTML } = languageProcessing.getFieldsToMark( marks, html );

	// Generate marked HTML.
	forEach( marks, function( mark ) {
		/*
		 * Classic editor uses double quotes for HTML attribute values. However, in `yoastseo`, we use single quotes for the attribute values
		 * when we create the marked object. As the result, the replacement did not work, as the marks passed by `yoastseo` did not match anything
		 * in the original text. This step is replacing the single quotes in the marked object output by `yoastseo` with double quotes.
		 * This way, we make sure that the replacement can find a match between the original text of the marked object and the text in the page.
		 */
		mark._properties.marked = languageProcessing.replaceSingleQuotesInTags( mark._properties.marked );
		mark._properties.original = languageProcessing.replaceSingleQuotesInTags( mark._properties.original );

		// Check if we want to mark only specific part of the HTML.
		if ( fieldsToMark.length > 0 ) {
			// Apply the marking to the selected HTML parts.
			selectedHTML.forEach( element => {
				const markedElement = mark.applyWithReplace( element );
				html = html.replace( element, markedElement );
			} );
		} else {
			html = mark.applyWithReplace( html );
		}
	} );

	// Replace the contents in the editor with the marked HTML.
	editor.setContent( html );

	removeInvalidMarks( editor );

	const markElements = dom.select( MARK_TAG );
	/*
	 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
	 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
	 */
	forEach( markElements, function( markElement ) {
		markElement.setAttribute( "data-mce-bogus", "1" );
	} );
}

/**
 * Returns a function that can decorate a tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to return a function for.
 * @returns {Function} The function that can be called to decorate the editor.
 */
export function tinyMCEDecorator( editor ) {
	window.test = editor;

	return markTinyMCE.bind( null, editor );
}

/**
 * Returns whether or not the editor has marks
 *
 * @param {tinyMCE.Editor} editor The editor.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
export function editorHasMarks( editor ) {
	var content = editor.getContent( { format: "raw" } );

	return -1 !== content.indexOf( "<" + MARK_TAG );
}

/**
 * Removes marks currently in the given editor
 *
 * @param {tinyMCE.Editor} editor The editor to remove all marks for.
 *
 * @returns {void}
 */
export function editorRemoveMarks( editor ) {
	// Create a decorator with the given editor.
	var decorator = tinyMCEDecorator( editor );

	// Calling the decorator with an empty array of marks will clear the editor of marks.
	decorator( null, [] );
}
