/* jshint -W097 */

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} controls The HTML ID of the element this button controls.
 *
 * @returns {string} Generated HTML.
 */
function helpButton( text, controls ) {
	return '<button type="button" class="yoast_help yoast-help-button dashicons" aria-expanded="false" ' +
		'aria-controls="' + controls + '"><span class="screen-reader-text">' + text + '</span></button>';
}

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} id The HTML ID to give this button.
 *
 * @returns {string} The generated HTMl.
 */
function helpText( text, id ) {
	return '<p id="' + id + '" class="yoast-help-panel">' + text + '</p>';
}

module.exports = {
	helpButton: helpButton,
	helpText: helpText,
};
