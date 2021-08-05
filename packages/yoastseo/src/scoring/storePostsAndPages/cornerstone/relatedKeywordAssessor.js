import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import Assessor from "../../assessor.js";

import IntroductionKeyword from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinks from "../../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesCornerstoneRelatedKeywordAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "storePostsAndPagesCornerstoneRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeyword( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLength( {
			isRelatedKeyphrase: true,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeywordDensity(),
		new MetaDescriptionKeyword(),
		new TextCompetingLinks(),
		new FunctionWordsInKeyphrase(),
		new ImageKeyphrase( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
		} ),
	];
};

inherits( StorePostsAndPagesCornerstoneRelatedKeywordAssessor, Assessor );

export default StorePostsAndPagesCornerstoneRelatedKeywordAssessor;
