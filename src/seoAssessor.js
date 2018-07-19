import { inherits } from "util";

import * as Assessor from "./assessor";
import * as introductionKeyword from "./assessments/seo/introductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import * as keywordStopWords from "./assessments/seo/keywordStopWordsAssessment";
import * as metaDescriptionKeyword from "./assessments/seo/metaDescriptionKeywordAssessment";
import * as MetaDescriptionLength from "./assessments/seo/metaDescriptionLengthAssessment";
import * as SubheadingsKeyword from "./assessments/seo/subheadingsKeywordAssessment";
import * as textCompetingLinks from "./assessments/seo/textCompetingLinksAssessment";
import * as TextImages from "./assessments/seo/textImagesAssessment";
import * as TextLength from "./assessments/seo/textLengthAssessment";
import * as OutboundLinks from "./assessments/seo/outboundLinksAssessment";
import InternalLinksAssessment from "./assessments/seo/InternalLinksAssessment";
import * as titleKeyword from "./assessments/seo/titleKeywordAssessment";
import * as TitleWidth from "./assessments/seo/pageTitleWidthAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import * as UrlLength from "./assessments/seo/urlLengthAssessment";
import * as urlStopWords from "./assessments/seo/urlStopWordsAssessment";

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

	this._assessments = [
		introductionKeyword,
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		keywordStopWords,
		metaDescriptionKeyword,
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		textCompetingLinks,
		new TextImages(),
		new TextLength(),
		new OutboundLinks(),
		new InternalLinksAssessment(),
		titleKeyword,
		new TitleWidth(),
		new UrlKeywordAssessment(),
		new UrlLength(),
		urlStopWords,
	];
};

inherits( SEOAssessor, Assessor );

module.exports = SEOAssessor;
