import { inherits } from "util";

import IntroductionKeywordAssessment from "./languages/legacy/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./languages/legacy/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./languages/legacy/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./languages/legacy/assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "./languages/legacy/assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "./languages/legacy/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "./languages/legacy/assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./languages/legacy/assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLength from "./languages/legacy/assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "./languages/legacy/assessments/seo/SubHeadingsKeywordAssessment";
import TextImages from "./languages/legacy/assessments/seo/TextImagesAssessment";
import TextLength from "./languages/legacy/assessments/seo/TextLengthAssessment";
import OutboundLinks from "./languages/legacy/assessments/seo/OutboundLinksAssessment";
import TitleWidth from "./languages/legacy/assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./languages/legacy/assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./languages/legacy/assessments/seo/SingleH1Assessment";
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
