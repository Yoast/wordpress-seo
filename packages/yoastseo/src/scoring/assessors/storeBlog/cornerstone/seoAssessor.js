import { inherits } from "util";

import Assessor from "../../assessor.js";
import SeoAssessor from "../../seoAssessor.js";
import KeyphraseLengthAssessment from "../../../assessments/seo/KeyphraseLengthAssessment.js";
import MetaDescriptionKeywordAssessment from "../../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../../../assessments/seo/MetaDescriptionLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import PageTitleWidthAssessment from "../../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {Researcher} researcher    The researcher used for the analysis.
 * @param {Object?} options          The options for this assessor.
 * @param {Function} options.marker  The marker to pass the list of marks to.
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
		new MetaDescriptionLengthAssessment( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new PageTitleWidthAssessment( {
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
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
	];
};

inherits( StoreBlogCornerstoneSEOAssessor, SeoAssessor );

export default StoreBlogCornerstoneSEOAssessor;
