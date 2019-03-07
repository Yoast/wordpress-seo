import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "./assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "./assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLength from "./assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "./assessments/seo/SubHeadingsKeywordAssessment";
import TextImages from "./assessments/seo/TextImagesAssessment";
import TextLength from "./assessments/seo/TextLengthAssessment";
import OutboundLinks from "./assessments/seo/OutboundLinksAssessment";
import TitleWidth from "./assessments/seo/PageTitleWidthAssessment";
import UrlLength from "./assessments/seo/UrlLengthAssessment";
import urlStopWords from "./assessments/seo/urlStopWordsAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./assessments/seo/SingleH1Assessment";
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

	if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
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
	} else {
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
			new UrlLength(),
			urlStopWords,
			new FunctionWordsInKeyphrase(),
		];
	}
};

inherits( SEOAssessor, Assessor );

export default SEOAssessor;
