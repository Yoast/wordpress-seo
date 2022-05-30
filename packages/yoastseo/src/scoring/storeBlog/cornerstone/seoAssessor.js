import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import SeoTitleKeywordAssessment from "../../assessments/seo/SeoTitleKeywordAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import Assessor from "../../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {object} researcher       The researcher used for the analysis.
 * @param {Object} options          The options for this assessor.
 * @param {Object} options.marker   The marker to pass the list of marks to.
 *
 * @constructor
 */
const StoreBlogCornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "storeBlogCornerstoneSEOAssessor";

	this._assessments = [
		new KeyphraseLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new SeoTitleKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new TitleWidth( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true ),
		new SlugKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
			}
		),
		new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
	];
};

inherits( StoreBlogCornerstoneSEOAssessor, SEOAssessor );

export default StoreBlogCornerstoneSEOAssessor;
