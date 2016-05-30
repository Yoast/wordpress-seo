var $ = jQuery;

var _forEach = require( 'lodash/foreach' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );

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

	// Replace the contents in the editor with the marked HTML.
	editor.setContent( html );

	var markElements = dom.select( "yoastmark" );
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

module.exports = tinyMCEDecorator;
