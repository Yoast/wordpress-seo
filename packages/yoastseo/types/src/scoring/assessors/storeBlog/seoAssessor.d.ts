/**
 * The StoreBlogSEOAssessor class is used for the SEO analysis for store blogs.
 */
export default class StoreBlogSEOAssessor extends SEOAssessor {
    _assessments: (KeyphraseLengthAssessment | MetaDescriptionKeywordAssessment | KeyphraseInSEOTitleAssessment | SlugKeywordAssessment | MetaDescriptionLengthAssessment | PageTitleWidthAssessment | FunctionWordsInKeyphraseAssessment)[];
}
import SEOAssessor from "../seoAssessor";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
