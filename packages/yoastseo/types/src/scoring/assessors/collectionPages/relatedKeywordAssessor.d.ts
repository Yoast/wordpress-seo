/**
 * The CollectionRelatedKeywordAssessor class is used for the related keyword analysis for collections.
 */
export default class CollectionRelatedKeywordAssessor extends RelatedKeywordAssessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseLengthAssessment | KeyphraseDensityAssessment | MetaDescriptionKeywordAssessment | FunctionWordsInKeyphraseAssessment)[];
}
import RelatedKeywordAssessor from "../relatedKeywordAssessor";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
