import { inherits } from "util";

import IntroductionKeywordAssessment from "./scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./scoring/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "./scoring/assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "./scoring/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "./scoring/assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./scoring/assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLength from "./scoring/assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "./scoring/assessments/seo/SubHeadingsKeywordAssessment";
import TextImages from "./scoring/assessments/seo/TextImagesAssessment";
import TextLength from "./scoring/assessments/seo/TextLengthAssessment";
import OutboundLinks from "./scoring/assessments/seo/OutboundLinksAssessment";
import TitleWidth from "./scoring/assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./scoring/assessments/seo/SingleH1Assessment";
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "SEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new TextImages(),
		new TextLength(),
		new OutboundLinks(),
		new TitleKeywordAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth(),
		new UrlKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
	];
};

inherits( SEOAssessor, Assessor );

export default SEOAssessor;
