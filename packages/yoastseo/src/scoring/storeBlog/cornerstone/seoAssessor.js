import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "../../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import Assessor from "../../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const StoreBlogCornerstoneSEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "storeBlogCornerstoneSEOAssessor";

	this._assessments = [
		new KeyphraseLengthAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
		} ),
		new TitleKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new TitleWidth( {
			scores: {
				widthTooShort: 3,
				widthTooLong: 3,
			},
		} ),
		new UrlKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
			}
		),
		new FunctionWordsInKeyphrase(),
	];
};

inherits( StoreBlogCornerstoneSEOAssessor, SEOAssessor );

export default StoreBlogCornerstoneSEOAssessor;
