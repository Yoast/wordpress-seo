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
import ImageCount from "../assessments/seo/ImageCountAssessment.js";
import AltTextLength from "../assessments/seo/AltTextLengthAssessment.js";
import DuplicateAltText from "../assessments/seo/DuplicateAltTextAssessment.js";
import RedundantPhraseInAltText from "../assessments/seo/RedundantPhraseInAltTextAssessment.js";
import NonDescriptiveAltText from "../assessments/seo/NonDescriptiveAltTextAssessment.js";
import KeyphraseStuffingInAltText from "../assessments/seo/KeyphraseStuffingInAltTextAssessment.js";
import TextLength from "../assessments/seo/TextLengthAssessment.js";
import OutboundLinks from "../assessments/seo/OutboundLinksAssessment.js";
import TitleWidth from "../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment.js";
import ValidOnlyResultsScoreAggregator from "../scoreAggregators/ValidOnlyResultsScoreAggregator.js";

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
			new ImageCount(),
			new AltTextLength(),
			new DuplicateAltText(),
			new RedundantPhraseInAltText(),
			new NonDescriptiveAltText(),
			new KeyphraseStuffingInAltText(),
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

		this._scoreAggregator = new ValidOnlyResultsScoreAggregator();
	}
}
