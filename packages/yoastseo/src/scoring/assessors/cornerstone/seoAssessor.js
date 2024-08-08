import { inherits } from "util";
import Assessor from "../assessor.js";
import SEOAssessor from "../seoAssessor.js";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment.js";
import InternalLinksAssessment from "../../assessments/seo/InternalLinksAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import SubheadingsKeyword from "../../assessments/seo/SubHeadingsKeywordAssessment.js";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment.js";
import ImageCount from "../../assessments/seo/ImageCountAssessment.js";
import TextLength from "../../assessments/seo/TextLengthAssessment.js";
import OutboundLinks from "../../assessments/seo/OutboundLinksAssessment.js";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment.js";

/**
 * Creates the Assessor
 *
 * @param {Researcher} researcher    The researcher used for the analysis.
 * @param {Object?} options          The options for this assessor.
 * @param {Function} options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const CornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "cornerstoneSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeyphraseDensityAssessment(),
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
