import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import Assessor from "../../assessor.js";
import ContentAssessor from "../../contentAssessor";
import ParagraphTooLong from "../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresence from "../../assessments/readability/TextPresenceAssessment.js";
import ListsPresence from "../../assessments/readability/ListAssessment.js";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const ProductCornerstoneContentAssessor = function( i18n, options = {} ) {
	Assessor.call( this, i18n, options );
	this.type = "productCornerstoneContentAssessor";

	this._assessments = [
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumWordCount: 250,
			},
			shouldNotAppearInShortText: true,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
		} ),
		new ParagraphTooLong( {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		} ),
		new SentenceLengthInText( {
			slightlyTooMany: 15,
			farTooMany: 20,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		}, true, true ),
		new TransitionWords( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify44" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify45" ),
		} ),
		new PassiveVoice( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify42" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify43" ),
		} ),
		new TextPresence(),
		new ListsPresence( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify38" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify39" ),
		} ),
	];
};

require( "util" ).inherits( ProductCornerstoneContentAssessor, ContentAssessor );


export default ProductCornerstoneContentAssessor;

