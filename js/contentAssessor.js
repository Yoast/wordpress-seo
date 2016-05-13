var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} opts The options for this assessor.
 * @param {Object} opts.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, opts ) {
	Assessor.call( this, i18n, opts );

	this._assessments = [
		fleschReadingEase,
		wordComplexity,
		getSubheadingPresence,
		subheadingDistributionTooLong,
		subheadingDistributionTooShort,
		subHeadingLength,
		paragraphTooLong,
		paragraphTooShort,
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

