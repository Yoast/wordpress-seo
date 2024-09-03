import ContentAssessor from "../contentAssessor";
import ParagraphTooLong from "../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../../assessments/readability/TextPresenceAssessment.js";

/**
 * The CornerStoneContentAssessor class is used for the readability analysis on cornerstone content.
 */
export default class CornerStoneContentAssessor extends ContentAssessor {
	/**
	 * Creates a new CornerStoneContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "cornerstoneContentAssessor";

		this._assessments = [
			new SubheadingDistributionTooLong( {
				parameters: {
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
		];
	}
}
