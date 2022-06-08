import { inherits } from "util";

import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "../assessments/seo/InternalLinksAssessment";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "../assessments/seo/UrlKeywordAssessment";
import Assessor from "../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "../assessments/seo/ImageCountAssessment";
import TextLength from "../assessments/seo/TextLengthAssessment";
import OutboundLinks from "../assessments/seo/OutboundLinksAssessment";
import TitleWidth from "../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment";

/**
 * Creates the Assessor
 *
 * @param {object} researcher       The researcher used for the analysis.
 * @param {Object} options          The options for this assessor.
 * @param {Object} options.marker   The marker to pass the list of marks to.
 *
 * @constructor
 */
const CornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "cornerstoneSEOAssessor";

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
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new ImageKeyphrase( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
		} ),
		new ImageCount(),
		new TextLength( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20,
			},

			cornerstoneContent: true,
		} ),
		new OutboundLinks( {
			scores: {
				noLinks: 3,
			},
		} ),
		new KeyphraseInSEOTitleAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth(
			{
				scores: {
					widthTooShort: 9,
				},
			},
			true
		),
		new SlugKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
			}
		),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
	];
};

inherits( CornerstoneSEOAssessor, SEOAssessor );

export default CornerstoneSEOAssessor;
