/**
 * The Assessor class that is used for the assessments of the keyphrase.
 */
export default class KeyphraseAssessor extends Assessor {
    _assessments: (KeyphraseLengthAssessment | FunctionWordsInKeyphraseAssessment)[];
}
import Assessor from "./assessor";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import FunctionWordsInKeyphraseAssessment from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
