import Assessor from "../assessor.js";
import ContentAssessor from "../contentAssessor";
import ParagraphTooLong from "../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../assessments/readability/TextPresenceAssessment.js";

/*
 Temporarily disabled:

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
	this.type = "cornerstoneContentAssessor";

	this._assessments = [
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			applicableIfTextLongerThan: 250,
			cornerstoneContent: true,
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

