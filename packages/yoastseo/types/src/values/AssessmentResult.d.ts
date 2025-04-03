export default AssessmentResult;
/**
 * Represents the assessment result.
 */
declare class AssessmentResult {
    /**
     * Parses the object to an AssessmentResult.
     *
     * @param {Object} serialized The serialized object.
     *
     * @returns {AssessmentResult} The parsed AssessmentResult.
     */
    static parse(serialized: Object): AssessmentResult;
    /**
     * Constructs the AssessmentResult value object.
     *
     * @param {Object} [values] The values for this assessment result.
     * @param {number} [values.score] The score for this assessment result.
     * @param {string} [values.text] The text for this assessment result. This is the text that can be used as a feedback message associated with the score.
     * @param {array} [values.marks] The marks for this assessment result.
     * @param {boolean} [values._hasBetaBadge] Whether this result has a beta badge.
     * @param {boolean} [values._hasJumps] Whether this result causes a jump to a different field.
     * @param {string} [values.editFieldName] The edit field name for this assessment result.
     * @param {boolean} [values._hasAIFixes] Whether this result has AI fixes.
     * @constructor
     * @returns {void}
     */
    constructor(values?: {
        score?: number | undefined;
        text?: string | undefined;
        marks?: any;
        _hasBetaBadge?: boolean | undefined;
        _hasJumps?: boolean | undefined;
        editFieldName?: string | undefined;
        _hasAIFixes?: boolean | undefined;
    } | undefined);
    _hasScore: boolean;
    _identifier: string;
    _hasAIFixes: boolean;
    _hasMarks: boolean;
    _hasJumps: boolean;
    _hasEditFieldName: boolean;
    _marker: () => any[];
    _hasBetaBadge: boolean;
    score: number;
    text: string;
    marks: any[];
    editFieldName: string;
    /**
     * Checks if a score is available.
     * @returns {boolean} Whether or not a score is available.
     */
    hasScore(): boolean;
    /**
     * Gets the available score.
     * @returns {number} The score associated with the AssessmentResult.
     */
    getScore(): number;
    /**
     * Sets the score for the assessment.
     * @param {number} score The score to be used for the score property.
     * @returns {void}
     */
    setScore(score: number): void;
    /**
     * Checks if a text for the assessment result is available.
     * @returns {boolean} Whether or not a text is available.
     */
    hasText(): boolean;
    /**
     * Gets the available text for the assessment result.
     * @returns {string} The text associated with the AssessmentResult.
     */
    getText(): string;
    /**
     * Sets the text for the assessment.
     * @param {string} text The text to be used for the text property.
     * @returns {void}
     */
    setText(text: string): void;
    /**
     * Gets the available marks.
     *
     * @returns {array} The marks associated with the AssessmentResult.
     */
    getMarks(): array;
    /**
     * Sets the marks for the assessment.
     *
     * @param {array} marks The marks to be used for the marks property.
     *
     * @returns {void}
     */
    setMarks(marks: array): void;
    /**
     * Sets the identifier.
     *
     * @param {string} identifier An alphanumeric identifier for this result.
     * @returns {void}
     */
    setIdentifier(identifier: string): void;
    /**
     * Gets the identifier.
     *
     * @returns {string} An alphanumeric identifier for this result.
     */
    getIdentifier(): string;
    /**
     * Sets the marker, a pure function that can return the marks for a given Paper.
     *
     * @param {Function} marker The marker to set.
     * @returns {void}
     */
    setMarker(marker: Function): void;
    /**
     * Returns whether this result has a marker that can be used to mark for a given Paper.
     *
     * @returns {boolean} Whether this result has a marker.
     */
    hasMarker(): boolean;
    /**
     * Gets the marker, a pure function that can return the marks for a given Paper.
     *
     * @returns {Function} The marker.
     */
    getMarker(): Function;
    /**
     * Sets the value of _hasMarks to determine if there is something to mark.
     *
     * @param {boolean} hasMarks Is there something to mark.
     * @returns {void}
     */
    setHasMarks(hasMarks: boolean): void;
    /**
     * Returns the value of _hasMarks to determine if there is something to mark.
     *
     * @returns {boolean} Is there something to mark.
     */
    hasMarks(): boolean;
    /**
     * Sets the value of _hasBetaBadge to determine if the result has a beta badge.
     *
     * @param {boolean} hasBetaBadge Whether this result has a beta badge.
     * @returns {void}
     */
    setHasBetaBadge(hasBetaBadge: boolean): void;
    /**
     * Returns the value of _hasBetaBadge to determine if the result has a beta badge.
     *
     * @returns {bool} Whether this result has a beta badge.
     */
    hasBetaBadge(): bool;
    /**
     * Sets the value of _hasJumps to determine whether it's needed to jump to a different field.
     *
     * @param {boolean} hasJumps Whether this result causes a jump to a different field.
     * @returns {void}
     */
    setHasJumps(hasJumps: boolean): void;
    /**
     * Returns the value of _hasJumps to determine whether it's needed to jump to a different field.
     *
     * @returns {bool} Whether this result causes a jump to a different field.
     */
    hasJumps(): bool;
    /**
     * Check if an edit field name is available.
     * @returns {boolean} Whether or not an edit field name is available.
     */
    hasEditFieldName(): boolean;
    /**
     * Gets the edit field name.
     * @returns {string} The edit field name associated with the AssessmentResult.
     */
    getEditFieldName(): string;
    /**
     * Sets the edit field name to be used to create the aria label for an edit button.
     * @param {string} editFieldName The string to be used for the string property
     * @returns {void}
     */
    setEditFieldName(editFieldName: string): void;
    /**
     * Sets the value of _hasAIFixes to determine if the result has AI fixes.
     *
     * @param {boolean} hasAIFixes Whether this result has AI fixes.
     * @returns {void}
     */
    setHasAIFixes(hasAIFixes: boolean): void;
    /**
     * Returns the value of _hasAIFixes to determine if the result has AI fixes.
     *
     * @returns {bool} Whether this result has AI fixes.
     */
    hasAIFixes(): bool;
    /**
     * Serializes the AssessmentResult instance to an object.
     *
     * @returns {Object} The serialized AssessmentResult.
     */
    serialize(): Object;
}
