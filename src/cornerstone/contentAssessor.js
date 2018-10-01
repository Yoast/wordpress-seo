import Assessor from "../assessor.js";
import ContentAssessor from "../contentAssessor";
import FleschReadingEase from "../assessments/readability/fleschReadingEaseAssessment.js";
import paragraphTooLong from "../assessments/readability/paragraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/sentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/subheadingDistributionTooLongAssessment.js";
import transitionWords from "../assessments/readability/transitionWordsAssessment.js";
import passiveVoice from "../assessments/readability/passiveVoiceAssessment.js";
import sentenceBeginnings from "../assessments/readability/sentenceBeginningsAssessment.js";
import textPresence from "../assessments/readability/textPresenceAssessment.js";
import contentConfiguration from "./../config/content/combinedConfig.js";

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
	this.type = "CornerstoneContentAssessor";
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


export default CornerStoneContentAssessor;

