import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

import IntroductionKeywordAssessment from "./../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./../../assessments/seo/MetaDescriptionKeywordAssessment";
import Assessor from "./../../assessor";
import FunctionWordsInKeyphrase from "./../../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {object}  i18n        The i18n object used for translations.
 * @param {object}  researcher  The researcher to use for the analysis.
 * @param {Object}  options     The options for this assessor.
 *
 * @constructor
 */
const CollectionCornerstoneRelatedKeywordAssessor = function( i18n, researcher, options ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "CollectionCornerstoneRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
			isRelatedKeyphrase: true,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeywordDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} ),
		new MetaDescriptionKeywordAssessment(
			{ parameters: { recommendedMinimum: 1 },
				scores: { good: 9, bad: 3 },
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
			}
		),
		new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
	];
};

inherits( CollectionCornerstoneRelatedKeywordAssessor, Assessor );

export default CollectionCornerstoneRelatedKeywordAssessor;
