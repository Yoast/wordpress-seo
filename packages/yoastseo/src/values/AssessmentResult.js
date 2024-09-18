import { isArray, isNumber, isUndefined } from "lodash";

import Mark from "./Mark";

/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
const emptyMarker = () => [];

/**
 * Represents the assessment result.
 */
class AssessmentResult {
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
	constructor( values ) {
		this._hasScore = false;
		this._identifier = "";
		this._hasAIFixes = false;
		this._hasMarks = false;
		this._hasJumps = false;
		this._hasEditFieldName = false;
		this._marker = emptyMarker;
		this._hasBetaBadge = false;
		this.score = 0;
		this.text = "";
		this.marks = [];
		this.editFieldName = "";

		if ( isUndefined( values ) ) {
			values = {};
		}

		if ( ! isUndefined( values.score ) ) {
			this.setScore( values.score );
		}

		if ( ! isUndefined( values.text ) ) {
			this.setText( values.text );
		}

		if ( ! isUndefined( values.marks ) ) {
			this.setMarks( values.marks );
		}

		if ( ! isUndefined( values._hasBetaBadge ) ) {
			this.setHasBetaBadge( values._hasBetaBadge );
		}

		if ( ! isUndefined( values._hasJumps ) ) {
			this.setHasJumps( values._hasJumps );
		}

		if ( ! isUndefined( values.editFieldName ) ) {
			this.setEditFieldName( values.editFieldName );
		}

		if ( ! isUndefined( values._hasAIFixes ) ) {
			this.setHasAIFixes( values._hasAIFixes );
		}
	}

	/**
	 * Checks if a score is available.
	 * @returns {boolean} Whether or not a score is available.
	 */
	hasScore() {
		return this._hasScore;
	}

	/**
	 * Gets the available score.
	 * @returns {number} The score associated with the AssessmentResult.
	 */
	getScore() {
		return this.score;
	}

	/**
	 * Sets the score for the assessment.
	 * @param {number} score The score to be used for the score property.
	 * @returns {void}
	 */
	setScore( score ) {
		if ( isNumber( score ) ) {
			this.score = score;
			this._hasScore = true;
		}
	}

	/**
	 * Checks if a text for the assessment result is available.
	 * @returns {boolean} Whether or not a text is available.
	 */
	hasText() {
		return this.text !== "";
	}

	/**
	 * Gets the available text for the assessment result.
	 * @returns {string} The text associated with the AssessmentResult.
	 */
	getText() {
		return this.text;
	}

	/**
	 * Sets the text for the assessment.
	 * @param {string} text The text to be used for the text property.
	 * @returns {void}
	 */
	setText( text ) {
		if ( isUndefined( text ) ) {
			text = "";
		}

		this.text = text;
	}

	/**
	 * Gets the available marks.
	 *
	 * @returns {array} The marks associated with the AssessmentResult.
	 */
	getMarks() {
		return this.marks;
	}

	/**
	 * Sets the marks for the assessment.
	 *
	 * @param {array} marks The marks to be used for the marks property.
	 *
	 * @returns {void}
	 */
	setMarks( marks ) {
		if ( isArray( marks ) ) {
			this.marks = marks;
			this._hasMarks = marks.length > 0;
		}
	}

	/**
	 * Sets the identifier.
	 *
	 * @param {string} identifier An alphanumeric identifier for this result.
	 * @returns {void}
	 */
	setIdentifier( identifier ) {
		this._identifier = identifier;
	}

	/**
	 * Gets the identifier.
	 *
	 * @returns {string} An alphanumeric identifier for this result.
	 */
	getIdentifier() {
		return this._identifier;
	}

	/**
	 * Sets the marker, a pure function that can return the marks for a given Paper.
	 *
	 * @param {Function} marker The marker to set.
	 * @returns {void}
	 */
	setMarker( marker ) {
		this._marker = marker;
	}

	/**
	 * Returns whether this result has a marker that can be used to mark for a given Paper.
	 *
	 * @returns {boolean} Whether this result has a marker.
	 */
	hasMarker() {
		return this._hasMarks && this._marker !== emptyMarker;
	}

	/**
	 * Gets the marker, a pure function that can return the marks for a given Paper.
	 *
	 * @returns {Function} The marker.
	 */
	getMarker() {
		return this._marker;
	}

	/**
	 * Sets the value of _hasMarks to determine if there is something to mark.
	 *
	 * @param {boolean} hasMarks Is there something to mark.
	 * @returns {void}
	 */
	setHasMarks( hasMarks ) {
		this._hasMarks = hasMarks;
	}

	/**
	 * Returns the value of _hasMarks to determine if there is something to mark.
	 *
	 * @returns {boolean} Is there something to mark.
	 */
	hasMarks() {
		return this._hasMarks;
	}

	/**
	 * Sets the value of _hasBetaBadge to determine if the result has a beta badge.
	 *
	 * @param {boolean} hasBetaBadge Whether this result has a beta badge.
	 * @returns {void}
	 */
	setHasBetaBadge( hasBetaBadge ) {
		this._hasBetaBadge = hasBetaBadge;
	}

	/**
	 * Returns the value of _hasBetaBadge to determine if the result has a beta badge.
	 *
	 * @returns {bool} Whether this result has a beta badge.
	 */
	hasBetaBadge() {
		return this._hasBetaBadge;
	}

	/**
	 * Sets the value of _hasJumps to determine whether it's needed to jump to a different field.
	 *
	 * @param {boolean} hasJumps Whether this result causes a jump to a different field.
	 * @returns {void}
	 */
	setHasJumps( hasJumps ) {
		this._hasJumps = hasJumps;
	}

	/**
	 * Returns the value of _hasJumps to determine whether it's needed to jump to a different field.
	 *
	 * @returns {bool} Whether this result causes a jump to a different field.
	 */
	hasJumps() {
		return this._hasJumps;
	}

	/**
	 * Check if an edit field name is available.
	 * @returns {boolean} Whether or not an edit field name is available.
	 */
	hasEditFieldName() {
		return this._hasEditFieldName;
	}

	/**
	 * Gets the edit field name.
	 * @returns {string} The edit field name associated with the AssessmentResult.
	 */
	getEditFieldName() {
		return this.editFieldName;
	}

	/**
	 * Sets the edit field name to be used to create the aria label for an edit button.
	 * @param {string} editFieldName The string to be used for the string property
	 * @returns {void}
	 */
	setEditFieldName( editFieldName ) {
		if ( editFieldName !== "" ) {
			this.editFieldName = editFieldName;
			this._hasEditFieldName = true;
		}
	}

	/**
	 * Sets the value of _hasAIFixes to determine if the result has AI fixes.
	 *
	 * @param {boolean} hasAIFixes Whether this result has AI fixes.
	 * @returns {void}
	 */
	setHasAIFixes( hasAIFixes ) {
		this._hasAIFixes = hasAIFixes;
	}

	/**
	 * Returns the value of _hasAIFixes to determine if the result has AI fixes.
	 *
	 * @returns {bool} Whether this result has AI fixes.
	 */
	hasAIFixes() {
		return this._hasAIFixes;
	}

	/**
	 * Serializes the AssessmentResult instance to an object.
	 *
	 * @returns {Object} The serialized AssessmentResult.
	 */
	serialize() {
		return {
			_parseClass: "AssessmentResult",
			identifier: this._identifier,
			score: this.score,
			text: this.text,
			marks: this.marks.map( mark => mark.serialize() ),
			_hasBetaBadge: this._hasBetaBadge,
			_hasJumps: this._hasJumps,
			_hasAIFixes: this._hasAIFixes,
			editFieldName: this.editFieldName,
		};
	}

	/**
	 * Parses the object to an AssessmentResult.
	 *
	 * @param {Object} serialized The serialized object.
	 *
	 * @returns {AssessmentResult} The parsed AssessmentResult.
	 */
	static parse( serialized ) {
		const result = new AssessmentResult( {
			text: serialized.text,
			score: serialized.score,
			marks: serialized.marks.map( mark => Mark.parse( mark ) ),
			_hasBetaBadge: serialized._hasBetaBadge,
			_hasJumps: serialized._hasJumps,
			_hasAIFixes: serialized._hasAIFixes, editFieldName: serialized.editFieldName,
		} );
		result.setIdentifier( serialized.identifier );

		return result;
	}
}

export default AssessmentResult;
