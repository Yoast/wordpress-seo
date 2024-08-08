import { inherits } from "util";
import Assessor from "./assessor.js";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment.js";
import InternalLinksAssessment from "../assessments/seo/InternalLinksAssessment.js";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment.js";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment.js";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment.js";
import ImageCount from "../assessments/seo/ImageCountAssessment.js";
import TextLength from "../assessments/seo/TextLengthAssessment.js";
import OutboundLinks from "../assessments/seo/OutboundLinksAssessment.js";
import TitleWidth from "../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment.js";

/**
 * Creates the Assessor
 *
 * @param {Researcher}  researcher      The researcher to use for the analysis.
 * @param {Object?}     options         The options for this assessor.
 * @param {Function}    options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const SEOAssessor = function( researcher,  options ) {
	Assessor.call( this, researcher, options );
	this.type = "SEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeyphraseDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new ImageKeyphrase(),
		new ImageCount(),
		new TextLength(),
		new OutboundLinks(),
		new KeyphraseInSEOTitleAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth( {
			scores: {
				widthTooShort: 9,
			},
		}, true ),
		new SlugKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
	];
};

inherits( SEOAssessor, Assessor );

export default SEOAssessor;
