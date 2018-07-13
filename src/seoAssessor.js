import * as Assessor from "./assessor.js";

import * as introductionKeyword from "./assessments/seo/introductionKeywordAssessment.js";
import KeyphraseLength from "./assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "./assessments/seo/KeywordDensityAssessment.js";
import * as keywordStopWords from "./assessments/seo/keywordStopWordsAssessment.js";
import * as metaDescriptionKeyword from "./assessments/seo/metaDescriptionKeywordAssessment.js";
import * as MetaDescriptionLength from "./assessments/seo/metaDescriptionLengthAssessment.js";
import * as SubheadingsKeyword from "./assessments/seo/subheadingsKeywordAssessment.js";
import * as textCompetingLinks from "./assessments/seo/textCompetingLinksAssessment.js";
import * as TextImages from "./assessments/seo/textImagesAssessment.js";
import * as TextLength from "./assessments/seo/textLengthAssessment.js";
import * as OutboundLinks from "./assessments/seo/outboundLinksAssessment.js";
import InternalLinks from "./assessments/seo/InternalLinksAssessment";
import * as titleKeyword from "./assessments/seo/titleKeywordAssessment.js";
import * as TitleWidth from "./assessments/seo/pageTitleWidthAssessment.js";
import UrlKeyword from "./assessments/seo/UrlKeywordAssessment.js";
import * as UrlLength from "./assessments/seo/urlLengthAssessment.js";
import * as urlStopWords from "./assessments/seo/urlStopWordsAssessment.js";

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
		new KeyphraseLength(),
		new KeywordDensity(),
		keywordStopWords,
		metaDescriptionKeyword,
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		textCompetingLinks,
		new TextImages(),
		new TextLength(),
		new OutboundLinks(),
		new InternalLinks(),
		titleKeyword,
		new TitleWidth(),
		new UrlKeyword(),
		new UrlLength(),
		urlStopWords,
	];
};

require( "util" ).inherits( SEOAssessor, Assessor );

module.exports = SEOAssessor;
