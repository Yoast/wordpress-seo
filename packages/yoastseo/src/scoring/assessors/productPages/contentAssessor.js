import { inherits } from "util";

import Assessor from "../assessor";
import ContentAssessor from "../contentAssessor";
import SubheadingDistributionTooLongAssessment from "../../assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../assessments/readability/TextPresenceAssessment";
import ListAssessment from "../../assessments/readability/ListAssessment";

import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {object} researcher   The researcher to use for the analysis.
 * @param {Object} options      The options for this assessor.
 *
 * @constructor
 */
const ProductContentAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
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
		new ListAssessment( {
			urlTitle: createAnchorOpeningTag( options.listsUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.listsCTAUrl ),
		} ),
	];
};

inherits( ProductContentAssessor, ContentAssessor );


export default ProductContentAssessor;

