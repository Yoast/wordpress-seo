import { inherits } from "util";

import Assessor from "../assessor";
import ContentAssessor from "../contentAssessor";
import SubheadingDistributionTooLongAssessment from "../../assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../assessments/readability/TextPresenceAssessment";
import SentenceBeginningsAssessment from "../../assessments/readability/SentenceBeginningsAssessment";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Creates the Assessor for e-commerce posts and pages content types.
 *
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 *
 * @constructor
 */
const StorePostsAndPagesContentAssessor = function( researcher, options = {} ) {
	Assessor.call( this, researcher, options );
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
};

inherits( StorePostsAndPagesContentAssessor, ContentAssessor );

export default StorePostsAndPagesContentAssessor;

