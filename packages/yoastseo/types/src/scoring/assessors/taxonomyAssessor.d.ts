export function getTextLengthAssessment(): TextLengthAssessment;
/**
 * The TaxonomyAssessor is used for the assessment of terms.
 */
export default class TaxonomyAssessor extends Assessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseLengthAssessment | KeyphraseDensityAssessment | MetaDescriptionKeywordAssessment | KeyphraseInSEOTitleAssessment | SlugKeywordAssessment | MetaDescriptionLengthAssessment | TextLengthAssessment | PageTitleWidthAssessment | FunctionWordsInKeyphrase | SingleH1Assessment)[];
    _scoreAggregator: SEOScoreAggregator;
}
import TextLengthAssessment from "../assessments/seo/TextLengthAssessment.js";
import Assessor from "./assessor.js";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../assessments/seo/MetaDescriptionLengthAssessment.js";
import PageTitleWidthAssessment from "../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment.js";
import SEOScoreAggregator from "../scoreAggregators/SEOScoreAggregator";
