import { inherits } from "util";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";

import Assessor from "../assessor.js";
import IntroductionKeyword from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";
import TextCompetingLinks from "../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {object}  i18n            The i18n object used for translations.
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 * @param {Object}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesRelatedKeywordAssessor = function( i18n, researcher, options ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "storePostsAndPagesRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeyword(),
		new KeyphraseLength( { isRelatedKeyphrase: true } ),
		new KeywordDensity(),
		new MetaDescriptionKeyword( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new TextCompetingLinks( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
		} ),
		new FunctionWordsInKeyphrase(),
		new ImageKeyphrase(),
	];
};

inherits( StorePostsAndPagesRelatedKeywordAssessor, Assessor );

export default StorePostsAndPagesRelatedKeywordAssessor;
