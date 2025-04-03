/**
 * The InclusiveLanguageAssessor assesses a paper for potentially non-inclusive language.
 */
export default class InclusiveLanguageAssessor extends Assessor {
    _options: {
        infoLinks: {};
    } & Object;
    _assessments: InclusiveLanguageAssessment[];
}
import Assessor from "./assessor.js";
import InclusiveLanguageAssessment from "../assessments/inclusiveLanguage/InclusiveLanguageAssessment.js";
