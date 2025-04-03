/**
 * The relatedKeywordAssessor class is used for the related keyword analysis.
 */
export default class RelatedKeywordAssessor extends Assessor {
    _assessments: (IntroductionKeyword | KeyphraseLength | KeyphraseDensityAssessment | MetaDescriptionKeyword | TextCompetingLinks | ImageKeyphrase | FunctionWordsInKeyphrase)[];
    _scoreAggregator: ValidOnlyResultsScoreAggregator;
}
import Assessor from "./assessor.js";
import IntroductionKeyword from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinks from "../assessments/seo/TextCompetingLinksAssessment.js";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
import ValidOnlyResultsScoreAggregator from "../scoreAggregators/ValidOnlyResultsScoreAggregator";
