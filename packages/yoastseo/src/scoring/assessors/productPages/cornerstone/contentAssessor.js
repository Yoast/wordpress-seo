import ProductContentAssessor from "../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../../assessments/readability/SentenceLengthInTextAssessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The ProductContentAssessor class is used for the readability analysis for cornerstone products.
 */
export default class ProductCornerstoneContentAssessor extends ProductContentAssessor {
	/**
	 * Creates a new ProductContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "productCornerstoneContentAssessor";

		this.addAssessment( "subheadingsTooLong", new SubheadingDistributionTooLongAssessment( {
			parameters: { slightlyTooMany: 250, farTooMany: 300, recommendedMaximumLength: 250 },
			applicableIfTextLongerThan: 250,
			shouldNotAppearInShortText: true,
			urlTitle: createAnchorOpeningTag( options.subheadingUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.subheadingCTAUrl ),
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "textSentenceLength", new SentenceLengthInTextAssessment( {
			slightlyTooMany: 15, farTooMany: 20,
			urlTitle: createAnchorOpeningTag( options.sentenceLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.sentenceLengthCTAUrl ),
		}, true, true ) );
	}
}
