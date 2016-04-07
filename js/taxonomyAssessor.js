var Assessor = require( "./assessor.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var SEOAssessor = function( i18n ) {
	Assessor.call(this, i18n);

	this._assessments = {
		wordCount: require( "./assessments/countWords.js" )
	};
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );

