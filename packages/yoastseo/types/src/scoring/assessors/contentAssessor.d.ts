/**
 * The ContentAssessor class is used for the readability analysis.
 */
export default class ContentAssessor extends Assessor {
    _assessments: (ParagraphTooLong | SentenceLengthInText | SubheadingDistributionTooLong | TransitionWords | PassiveVoice | SentenceBeginnings | TextPresence)[];
    _scoreAggregator: ReadabilityScoreAggregator;
    /**
     * Calculates the weighted rating for languages that have all assessments based on a given rating.
     *
     * @param {string} rating The rating to be weighted.
     * @returns {number} The weighted rating.
     */
    calculatePenaltyPointsFullSupport(rating: string): number;
    /**
     * Calculates the weighted rating for languages that don't have all assessments based on a given rating.
     *
     * @param {string} rating The rating to be weighted.
     * @returns {number} The weighted rating.
     */
    calculatePenaltyPointsPartialSupport(rating: string): number;
    /**
     * Determines whether a language is fully supported. If a language supports 7 content assessments,
     * it is fully supported
     *
     * @returns {boolean} True if fully supported.
     */
    _allAssessmentsSupported(): boolean;
    /**
     * Calculates the penalty points based on the assessment results.
     *
     * @returns {number} The total penalty points for the results.
     */
    calculatePenaltyPoints(): number;
    /**
     * Rates the penalty points
     *
     * @param {number} totalPenaltyPoints The amount of penalty points.
     * @returns {number} The score based on the amount of penalty points.
     *
     * @private
     */
    private _ratePenaltyPoints;
}
import Assessor from "./assessor.js";
import ParagraphTooLong from "../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../assessments/readability/TextPresenceAssessment.js";
import { ReadabilityScoreAggregator } from "../scoreAggregators";
