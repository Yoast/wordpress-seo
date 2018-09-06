let Assessor = require( "../assessor.js" );
let ContentAssessor = require( "../contentAssessor" );

let FleschReadingEase = require( "../assessments/readability/fleschReadingEaseAssessment.js" );
let paragraphTooLong = require( "../assessments/readability/paragraphTooLongAssessment.js" );
let SentenceLengthInText = require( "../assessments/readability/sentenceLengthInTextAssessment.js" );
let SubheadingDistributionTooLong = require( "../assessments/readability/subheadingDistributionTooLongAssessment.js" );
let transitionWords = require( "../assessments/readability/transitionWordsAssessment.js" );
let passiveVoice = require( "../assessments/readability/passiveVoiceAssessment.js" );
let sentenceBeginnings = require( "../assessments/readability/sentenceBeginningsAssessment.js" );
let textPresence = require( "../assessments/readability/textPresenceAssessment.js" );

let contentConfiguration = require( "./../config/content/combinedConfig.js" );

/*
 Temporarily disabled:

 var wordComplexity = require( "./assessments/readability/wordComplexityAssessment.js" );
 var sentenceLengthInDescription = require( "./assessments/readability/sentenceLengthInDescriptionAssessment.js" );
 */

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 * @param {string} options.locale The locale.
 *
 * @constructor
 */
let CornerStoneContentAssessor = function( i18n, options = {} ) {
	Assessor.call( this, i18n, options );
	let locale = ( options.hasOwnProperty( "locale" ) ) ? options.locale : "en_US";

	this._assessments = [

		new FleschReadingEase( contentConfiguration( locale ).fleschReading ),
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumWordCount: 250,
			},
		} ),
		paragraphTooLong,
		new SentenceLengthInText(
			{
				recommendedWordCount: contentConfiguration( locale ).sentenceLength.recommendedWordCount,
				slightlyTooMany: 20,
				farTooMany: 25,
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

