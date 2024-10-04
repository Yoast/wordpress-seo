import ContentAssessor from "../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import ParagraphTooLongAssessment from "../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import TransitionWordsAssessment from "../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoiceAssessment from "../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresenceAssessment from "../../assessments/readability/TextPresenceAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * The ProductContentAssessor class is used for the readability analysis for products.
 */
export default class ProductContentAssessor extends ContentAssessor {
	/**
	 * Creates a new ProductContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "productContentAssessor";

		this._assessments = [
			new SubheadingDistributionTooLongAssessment( {
				shouldNotAppearInShortText: true,
				urlTitle: createAnchorOpeningTag( options.subheadingUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.subheadingCTAUrl ),
			} ),
			new ParagraphTooLongAssessment( {
				parameters: {
					recommendedLength: 70,
					maximumRecommendedLength: 100,
				},
				urlTitle: createAnchorOpeningTag( options.paragraphUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.paragraphCTAUrl ),
			}, true ),
			new SentenceLengthInTextAssessment( {
				slightlyTooMany: 20,
				farTooMany: 25,
				urlTitle: createAnchorOpeningTag( options.sentenceLengthUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.sentenceLengthCTAUrl ),
			}, false, true ),
			new TransitionWordsAssessment( {
				urlTitle: createAnchorOpeningTag( options.transitionWordsUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.transitionWordsCTAUrl ),
			} ),
			new PassiveVoiceAssessment( {
				urlTitle: createAnchorOpeningTag( options.passiveVoiceUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.passiveVoiceCTAUrl ),
			} ),
			new TextPresenceAssessment( {
				urlTitle: createAnchorOpeningTag( options.textPresenceUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.textPresenceCTAUrl ),
			} ),
		];
	}
}
