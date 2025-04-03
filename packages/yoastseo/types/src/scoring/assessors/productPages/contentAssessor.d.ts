/**
 * The ProductContentAssessor class is used for the readability analysis for products.
 */
export default class ProductContentAssessor extends ContentAssessor {
    _assessments: (ParagraphTooLongAssessment | SentenceLengthInTextAssessment | SubheadingDistributionTooLongAssessment | TransitionWordsAssessment | PassiveVoiceAssessment | TextPresenceAssessment)[];
}
import ContentAssessor from "../contentAssessor.js";
import ParagraphTooLongAssessment from "../../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInTextAssessment from "../../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLongAssessment from "../../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWordsAssessment from "../../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoiceAssessment from "../../assessments/readability/PassiveVoiceAssessment.js";
import TextPresenceAssessment from "../../assessments/readability/TextPresenceAssessment.js";
