/**
 * The CollectionSEOAssessor class is used for the SEO analysis for collections.
 */
export default class CollectionSEOAssessor extends SEOAssessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseLengthAssessment | KeyphraseDensityAssessment | MetaDescriptionKeywordAssessment | KeyphraseInSEOTitleAssessment | SlugKeywordAssessment | MetaDescriptionLengthAssessment | TextLengthAssessment | PageTitleWidthAssessment | FunctionWordsInKeyphraseAssessment | SingleH1Assessment)[];
    _scoreAggregator: ValidOnlyResultsScoreAggregator;
}
import SEOAssessor from "../seoAssessor.js";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment.js";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment.js";
import ValidOnlyResultsScoreAggregator from "../../scoreAggregators/ValidOnlyResultsScoreAggregator";
