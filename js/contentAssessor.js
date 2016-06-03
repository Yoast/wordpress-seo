var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );
var textSubheadings = require( "./assessments/textSubheadingsAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		wordComplexity,
		getSubheadingPresence,
		textSubheadings,
		subheadingDistributionTooLong,
		subHeadingLength,
		paragraphTooLong,
		sentenceLengthInText,
		sentenceLengthInDescription,
		transitionWords,
		sentenceVariation,
		sentenceBeginnings,
		passiveVoice
	];
};

module.exports = ContentAssessor;

require( "util" ).inherits( module.exports, Assessor );

