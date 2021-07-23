import { inherits } from "util";

import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment";
import TitleKeywordAssessment from "../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "../assessments/seo/UrlKeywordAssessment";
import Assessor from "../assessor";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "../assessments/seo/ImageCountAssessment";
import TextLength from "../assessments/seo/TextLengthAssessment";
import TitleWidth from "../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment";
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
const ProductSEOAssessor = function( i18n, researcher, options ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "productSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new TextLength(),
		new TitleKeywordAssessment(),
		new TitleWidth( {
			scores: {
				widthTooShort: 9,
			},
		}, true ),
		new UrlKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
		new ImageCount(),
		new ImageKeyphrase(),
	];
};

inherits( ProductSEOAssessor, Assessor );

export default ProductSEOAssessor;
