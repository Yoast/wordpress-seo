var $ = jQuery;

var _forEach = require( 'lodash/foreach' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );

var MARK_TAG = 'yoastmark';

/**
 * Saves the content to the editor, then retrieves it to replace any invalid marks where < and > are converted to
 * html entities so these can be filtered out to keep the output text clean.
 *
 * @param {tinyMCE.Editor} editor The editor to remove invalid marks from.
 * @param {string} html The text to clean invalid marks in.
 * @returns {string} The text with invalid marks removed.
 */
function removeInvalidMarks( editor, html ) {
	editor.setContent( html );

	html = editor.getContent();

	return html
		.replace( new RegExp( '&lt;yoastmark.+?(?=&gt;)&gt;', 'g' ), '' )
		.replace( new RegExp( '&lt;/yoastmark&gt;', 'g' ), '' );
}

/**
 * Puts a list of marks into the given tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to apply the marks to.
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 */
function markTinyMCE( editor, paper, marks ) {
	var dom = editor.dom;
	var html = editor.getContent();
	html = removeMarks( html );

	// Generate marked HTML.
	_forEach( marks, function( mark ) {
		html = mark.applyWithReplace( html );
	});

	html = removeInvalidMarks( html );

	// Replace the contents in the editor with the marked HTML.
	editor.setContent( html );

	var markElements = dom.select( MARK_TAG );
	/*
	 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
	 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
	 */
	_forEach( markElements, function( markElement ) {
		markElement.setAttribute( 'data-mce-bogus', '1' );
	} );
}

/**
 * Returns a function that can decorate a tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to return a function for.
 * @returns {Function} The function that can be called to decorate the editor.
 */
function tinyMCEDecorator( editor ) {
	window.test = editor;

	return markTinyMCE.bind( null, editor );
}

/**
 * Returns whether or not the editor has marks
 *
 * @param {tinyMCE.Editor} editor The editor.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
function editorHasMarks( editor ) {
	var content = editor.getContent({ format: 'raw' });

	return -1 !== content.indexOf( '<' + MARK_TAG );
}

/**
 * Removes marks currently in the given editor
 *
 * @param {tinyMCE.Editor} editor The editor to remove all marks for.
 */
function editorRemoveMarks( editor ) {
	// Create a decorator with the given editor.
	var decorator = tinyMCEDecorator( editor );

	// Calling the decorator with an empty array of marks will clear the editor of marks.
	decorator( null, [] );
}

module.exports = {
	tinyMCEDecorator: tinyMCEDecorator,

	editorHasMarks: editorHasMarks,
	editorRemoveMarks: editorRemoveMarks
};
