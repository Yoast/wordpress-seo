import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "./assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "./assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import SlugKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLength from "./assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "./assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "./assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "./assessments/seo/ImageCountAssessment";
import TextLength from "./assessments/seo/TextLengthAssessment";
import OutboundLinks from "./assessments/seo/OutboundLinksAssessment";
import TitleWidth from "./assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./assessments/seo/SingleH1Assessment";
/**
 * Creates the Assessor
 *
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 * @param {Object}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const SEOAssessor = function( researcher,  options ) {
	Assessor.call( this, researcher, options );
	this.type = "SEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new ImageKeyphrase(),
		new ImageCount(),
		new TextLength(),
		new OutboundLinks(),
		new TitleKeywordAssessment(),
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
