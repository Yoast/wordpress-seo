import markTinyMCE, { MARK_TAG } from "./helpers/markTinyMCE";

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
