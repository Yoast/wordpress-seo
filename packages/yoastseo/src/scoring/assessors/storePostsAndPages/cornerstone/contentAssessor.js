import { inherits } from "util";

import Assessor from "../../assessor.js";
import ContentAssessor from "../../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import ParagraphTooLongAssessment from "../../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../../assessments/readability/SentenceLengthInTextAssessment.js";
import TransitionWordsAssessment from "../../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoiceAssessment from "../../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresenceAssessment from "../../../assessments/readability/TextPresenceAssessment.js";
import SentenceBeginningsAssessment from "../../../assessments/readability/SentenceBeginningsAssessment.js";
import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {object} researcher       The researcher used for the analysis.
 * @param {Object} options          The options for this assessor.
 * @param {Object} options.marker   The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesCornerstoneContentAssessor = function( researcher, options = {} ) {
	Assessor.call( this, researcher, options );
	this.type = "storePostsAndPagesCornerstoneContentAssessor";

	this._assessments = [

		new SubheadingDistributionTooLongAssessment( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
			cornerstoneContent: true,
		} ),
		new ParagraphTooLongAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify66" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify67" ),
		} ),
		new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		}, true ),
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

inherits( StorePostsAndPagesCornerstoneContentAssessor, ContentAssessor );


export default StorePostsAndPagesCornerstoneContentAssessor;

