import ContentAssessor from "../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import ParagraphTooLongAssessment from "../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import TransitionWordsAssessment from "../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoiceAssessment from "../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresenceAssessment from "../../assessments/readability/TextPresenceAssessment.js";
import SentenceBeginningsAssessment from "../../assessments/readability/SentenceBeginningsAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * The StorePostsAndPagesContentAssessor class is used for the readability analysis for store posts and pages.
 */
export default class StorePostsAndPagesContentAssessor extends ContentAssessor {
	/**
	 * Creates a new StorePostsAndPagesContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storePostsAndPagesContentAssessor";

		this._assessments = [
			new SubheadingDistributionTooLongAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
			} ),
			new ParagraphTooLongAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify66" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify67" ),
			} ),
			new SentenceLengthInTextAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
			} ),
			new TransitionWordsAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify44" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify45" ),
			} ),
			new PassiveVoiceAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify42" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify43" ),
			} ),
			new TextPresenceAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify56" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify57" ),
			} ),
			new SentenceBeginningsAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify5" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify65" ),
			} ),
		];
	}
}
