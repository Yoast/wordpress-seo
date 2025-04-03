/**
 * The Assessor class that is used for the assessments of the keyphrase use.
 */
export default class KeyphraseUseAssessor extends Assessor {
    _assessments: (IntroductionKeywordAssessment | KeyphraseDensityAssessment | SubheadingsKeyword | ImageKeyphrase)[];
}
import Assessor from "./assessor";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";
