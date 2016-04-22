var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var ContentAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = {
		fleschReadingEase:      fleschReadingEase
	};
};

module.exports = ContentAssessor;

require( "util" ).inherits( module.exports, Assessor );

