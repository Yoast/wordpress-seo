import { inherits } from "util";

import Assessor from "../../assessor.js";
import ContentAssessor from "../../contentAssessor.js";
import SubheadingDistributionTooLongAssessment from "../../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import ParagraphTooLongAssessment from "../../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../../assessments/readability/SentenceLengthInTextAssessment.js";
import TransitionWordsAssessment from "../../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoiceAssessment from "../../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresenceAssessment from "../../../assessments/readability/TextPresenceAssessment.js";
import ListAssessment from "../../../assessments/readability/ListAssessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {object} researcher   The researcher to use for the analysis.
 * @param {Object} options      The options for this assessor.
 *
 * @constructor
 */
const ProductCornerstoneContentAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "productCornerstoneContentAssessor";

	this._assessments = [
		new SubheadingDistributionTooLongAssessment( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			applicableIfTextLongerThan: 250,
			shouldNotAppearInShortText: true,
			urlTitle: createAnchorOpeningTag( options.subheadingUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.subheadingCTAUrl ),
			cornerstoneContent: true,
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
			slightlyTooMany: 15,
			farTooMany: 20,
			urlTitle: createAnchorOpeningTag( options.sentenceLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.sentenceLengthCTAUrl ),
		}, true, true ),
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

inherits( ProductCornerstoneContentAssessor, ContentAssessor );


export default ProductCornerstoneContentAssessor;

