import { inherits } from "util";

import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment";
import TitleKeywordAssessment from "../../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import Assessor from "../../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "../../assessments/seo/ImageCountAssessment";
import TextLength from "../../assessments/seo/TextLengthAssessment";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment";

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
	this.type = "StoreBlogCornerstoneSEOAssessor";

	this._assessments = [
		new KeyphraseLengthAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
		} ),
		new TitleKeywordAssessment(),
		new TitleWidth( {
			scores: {
				widthTooShort: 9,
			},
		}, true ),
		new UrlKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
			}
		),
		new FunctionWordsInKeyphrase(),
	];
};

inherits( StoreBlogCornerstoneSEOAssessor, SEOAssessor );

export default StoreBlogCornerstoneSEOAssessor;
