import * as Assessor from "../assessor.js";
import * as SEOAssessor from "../seoAssessor";

import * as introductionKeyword from "../assessments/seo/introductionKeywordAssessment.js";
import * as KeyphraseLength from "../assessments/seo/keyphraseLengthAssessment.js";
import * as KeywordDensity from "../assessments/seo/keywordDensityAssessment.js";
import * as keywordStopWords from "../assessments/seo/keywordStopWordsAssessment.js";
import * as metaDescriptionKeyword from "../assessments/seo/metaDescriptionKeywordAssessment.js";
import * as MetaDescriptionLength from "../assessments/seo/metaDescriptionLengthAssessment.js";
import * as SubheadingsKeyword from "../assessments/seo/subheadingsKeywordAssessment.js";
import * as textCompetingLinks from "../assessments/seo/textCompetingLinksAssessment.js";
import * as TextImages from "../assessments/seo/textImagesAssessment.js";
import * as TextLength from "../assessments/seo/textLengthAssessment.js";
import * as OutboundLinks from "../assessments/seo/outboundLinksAssessment.js";
import InternalLinks from "../assessments/seo/InternalLinksAssessment.js";
import * as titleKeyword from "../assessments/seo/titleKeywordAssessment.js";
import * as TitleWidth from "../assessments/seo/pageTitleWidthAssessment.js";
import * as UrlKeyword from "../assessments/seo/urlKeywordAssessment.js";
import * as UrlLength from "../assessments/seo/urlLengthAssessment.js";
import * as urlStopWords from "../assessments/seo/urlStopWordsAssessment.js";

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const CornerstoneSEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		new KeyphraseLength(),
		new KeywordDensity(),
		keywordStopWords,
		metaDescriptionKeyword,
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
		} ),
		new SubheadingsKeyword(
			{
				scores: {
					noMatches: 3,
					oneMatch: 6,
					multipleMatches: 9,
				},
			}
		),
		textCompetingLinks,
		new TextImages( {
			scores: {
				noImages: 3,
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
		} ),
		new TextLength( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,
			farBelowMinimum: 0,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20,
			},
		} ),
		new OutboundLinks( {
			scores: {
				noLinks: 3,
			},
		} ),
		new InternalLinks(),
		titleKeyword,
		new TitleWidth(
			{
				scores: {
					widthTooShort: 3,
					widthTooLong: 3,
				},
			}
		),
		new UrlKeyword(
			{
				scores: {
					noKeywordInUrl: 3,
				},
			}
		),
		new UrlLength( {
			scores: {
				tooLong: 3,
			},
		} ),
		urlStopWords,
	];
};

require( "util" ).inherits( CornerstoneSEOAssessor, SEOAssessor );

module.exports = CornerstoneSEOAssessor;
