/*
 * The script collects all functions for word form building per language and returns this collection to a Researcher
 */

const englishGetForms = require( "../morphology/english/getForms.js" );

module.exports = function() {
	return {
		en: englishGetForms,
	};
};
