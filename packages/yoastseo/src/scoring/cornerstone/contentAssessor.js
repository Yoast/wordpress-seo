import Assessor from "../assessor.js";
import ContentAssessor from "../contentAssessor";
import fleschReadingEase from "../assessments/readability/fleschReadingEaseAssessment.js";
import ParagraphTooLong from "../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../assessments/readability/TextPresenceAssessment.js";

/*
 Temporarily disabled:

 var wordComplexity = require( "./assessments/readability/wordComplexityAssessment.js" );
 var sentenceLengthInDescription = require( "./assessments/readability/sentenceLengthInDescriptionAssessment.js" );
 */

/**
 * Creates the Assessor
 *
 * @param {object} researcher       The researcher used for the analysis.
 * @param {Object} options          The options for this assessor.
 * @param {Object} options.marker   The marker to pass the list of marks to.
 *
 * @constructor
 */
const CornerStoneContentAssessor = function( researcher, options = {} ) {
	Assessor.call( this, researcher, options );
	this.type = "CornerstoneContentAssessor";

	this._assessments = [

		fleschReadingEase,
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumWordCount: 250,
			},
		} ),
		new ParagraphTooLong(),
		new SentenceLengthInText( {
			slightlyTooMany: 20,
			farTooMany: 25,
		}, true ),
		new TransitionWords(),
		new PassiveVoice(),
		new TextPresence(),
		new SentenceBeginnings(),
		// Temporarily disabled: wordComplexity,
	];
};

require( "util" ).inherits( CornerStoneContentAssessor, ContentAssessor );


export default CornerStoneContentAssessor;

