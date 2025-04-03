/**
 * The Assessor class that is used for the assessment of the SEO title.
 */
export default class SeoTitleAssessor extends Assessor {
    _assessments: (KeyphraseInSEOTitleAssessment | PageTitleWidthAssessment)[];
}
import Assessor from "./assessor";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment";
import PageTitleWidthAssessment from "../assessments/seo/PageTitleWidthAssessment";
