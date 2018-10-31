import { inherits } from "util";

import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "../assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "../assessments/seo/UrlKeywordAssessment";
import Assessor from "../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment";
import TextImages from "../assessments/seo/TextImagesAssessment";
import TextLength from "../assessments/seo/TextLengthAssessment";
import OutboundLinks from "../assessments/seo/OutboundLinksAssessment";
import TitleWidth from "../assessments/seo/PageTitleWidthAssessment";
import UrlLength from "../assessments/seo/UrlLengthAssessment";
import urlStopWords from "../assessments/seo/urlStopWordsAssessment";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";

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
	this.type = "CornerstoneSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
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
		new TextCompetingLinksAssessment(),
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
		new TitleKeywordAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth(
			{
				scores: {
					widthTooShort: 3,
					widthTooLong: 3,
				},
			}
		),
		new UrlKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
			}
		),
		new UrlLength( {
			scores: {
				tooLong: 3,
			},
		} ),
		urlStopWords,
		new FunctionWordsInKeyphrase(),
	];
};

inherits( CornerstoneSEOAssessor, SEOAssessor );

export default CornerstoneSEOAssessor;
