/* jshint -W097 */

'use strict';

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} controls The HTML ID of the element this button controls.
 */
function helpButton( text, controls ) {
	return '<button type="button" class="yoast_help yoast-help-button dashicons" aria-expanded="false" aria-controls="' + controls + '"><span class="screen-reader-text">' + text + '</span></button>';
}

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} id The HTML ID to give this button.
 */
function helpText( text, id ) {
	return '<p id="' + id + '" class="yoast-help-panel">' + text + '</p>';
}

module.exports = {
	helpButton: helpButton,
	helpText: helpText
};
