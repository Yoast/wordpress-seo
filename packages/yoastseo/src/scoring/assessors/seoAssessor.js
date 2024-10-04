import Assessor from "./assessor";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "../assessments/seo/InternalLinksAssessment";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "../assessments/seo/UrlKeywordAssessment";
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
 * The SEOAssessor class is used for the general SEO analysis.
 */
export default class SEOAssessor extends Assessor {
	/**
	 * Creates a new SEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
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
	}
}
