import ContentAssessor from "../contentAssessor";
import SentenceLengthInText from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";

/**
 * The CornerStoneContentAssessor class is used for the readability analysis on cornerstone content.
 */
export default class CornerstoneContentAssessor extends ContentAssessor {
	/**
	 * Creates a new CornerStoneContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "cornerstoneContentAssessor";

		this.addAssessment( "subheadingsTooLong", new SubheadingDistributionTooLong( {
			parameters: { slightlyTooMany: 250, farTooMany: 300, recommendedMaximumLength: 250 },
			applicableIfTextLongerThan: 250,
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "textSentenceLength", new SentenceLengthInText( {
			slightlyTooMany: 20, farTooMany: 25 }, true )
		);
	}
}
