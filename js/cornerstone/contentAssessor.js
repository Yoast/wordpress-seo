let Assessor = require( "../assessor.js" );
let ContentAssessor = require( "../contentAssessor" );

let fleschReadingEase = require( "../assessments/readability/fleschReadingEaseAssessment.js" );
let paragraphTooLong = require( "../assessments/readability/paragraphTooLongAssessment.js" );
let SentenceLengthInText = require( "../assessments/readability/sentenceLengthInTextAssessment.js" );
let SubheadingDistributionTooLong = require( "../assessments/readability/subheadingDistributionTooLongAssessment.js" );
let transitionWords = require( "../assessments/readability/transitionWordsAssessment.js" );
let passiveVoice = require( "../assessments/readability/passiveVoiceAssessment.js" );
let sentenceBeginnings = require( "../assessments/readability/sentenceBeginningsAssessment.js" );
let textPresence = require( "../assessments/readability/textPresenceAssessment.js" );
/*
 Temporarily disabled:

 var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
 var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
 */

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
let CornerStoneContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [

		fleschReadingEase,
		new SubheadingDistributionTooLong(
			{

				greenBulletTreshold: 250,
				redBulletTreshhold: 300,
			}
		),
		paragraphTooLong,
		new SentenceLengthInText(
			{
				greenPercentage: 20,
				redPercentage: 25,
			}
		),
		transitionWords,
		passiveVoice,
		textPresence,
		sentenceBeginnings,
		// Temporarily disabled: wordComplexity,
	];
};

require( "util" ).inherits( CornerStoneContentAssessor, ContentAssessor );


module.exports = CornerStoneContentAssessor;

