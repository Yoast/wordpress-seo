/**
 * The Assessor class that is used for the assessment of the meta description.
 */
export default class MetaDescriptionAssessor extends Assessor {
    _assessments: (MetaDescriptionKeywordAssessment | MetaDescriptionLength)[];
}
import Assessor from "./assessor";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment";
