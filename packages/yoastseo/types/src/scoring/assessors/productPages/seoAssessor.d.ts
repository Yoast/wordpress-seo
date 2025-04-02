/**
 * The ProductSEOAssessor class is used for the SEO analysis for products.
 */
export default class ProductSEOAssessor extends SEOAssessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseLengthAssessment | KeyphraseDensityAssessment | MetaDescriptionKeywordAssessment | TextCompetingLinksAssessment | KeyphraseInSEOTitleAssessment | SlugKeywordAssessment | MetaDescriptionLengthAssessment | SubheadingsKeywordAssessment | ImageKeyphraseAssessment | ImageCountAssessment | TextLengthAssessment | PageTitleWidthAssessment | FunctionWordsInKeyphraseAssessment | SingleH1Assessment)[];
}
import SEOAssessor from "../seoAssessor";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import SubheadingsKeywordAssessment from "../../assessments/seo/SubHeadingsKeywordAssessment.js";
import ImageKeyphraseAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment.js";
import ImageCountAssessment from "../../assessments/seo/ImageCountAssessment.js";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment.js";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment.js";
