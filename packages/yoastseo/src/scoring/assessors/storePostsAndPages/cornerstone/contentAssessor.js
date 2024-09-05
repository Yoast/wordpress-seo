import ContentAssessor from "../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../../assessments/readability/SentenceLengthInTextAssessment.js";
import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The StorePostsAndPagesCornerstoneContentAssessor class is used for the readability analysis for cornerstone store posts and pages.
 */
export default class StorePostsAndPagesCornerstoneContentAssessor extends ContentAssessor {
	/**
	 * Creates a new StorePostsAndPagesCornerstoneContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storePostsAndPagesCornerstoneContentAssessor";

		this.addAssessment( "subheadingsTooLong", new SubheadingDistributionTooLongAssessment( {
			parameters:	{ slightlyTooMany: 250, farTooMany: 300, recommendedMaximumLength: 250 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "textSentenceLength", new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20, farTooMany: 25,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		}, true ) );
	}
}
