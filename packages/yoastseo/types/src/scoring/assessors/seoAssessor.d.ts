/**
 * The SEOAssessor class is used for the general SEO analysis.
 */
export default class SEOAssessor extends Assessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseLengthAssessment | KeyphraseDensityAssessment | MetaDescriptionKeywordAssessment | TextCompetingLinksAssessment | InternalLinksAssessment | KeyphraseInSEOTitleAssessment | SlugKeywordAssessment | MetaDescriptionLength | SubheadingsKeyword | ImageKeyphrase | ImageCount | TextLength | OutboundLinks | TitleWidth | FunctionWordsInKeyphrase | SingleH1Assessment)[];
    _scoreAggregator: SEOScoreAggregator;
}
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
import SEOScoreAggregator from "../scoreAggregators/SEOScoreAggregator";
