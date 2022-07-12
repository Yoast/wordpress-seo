import { isArray } from "lodash-es";
import { isUndefined } from "lodash-es";
import { isNumber } from "lodash-es";

import Mark from "./Mark";

/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
var emptyMarker = function() {
	return [];
};

/**
 * Construct the AssessmentResult value object.
 *
 * @param {Object} [values] The values for this assessment result.
 *
 * @constructor
 */
var AssessmentResult = function( values ) {
	this._hasScore = false;
	this._identifier = "";
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
};

/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function() {
	return this._hasScore;
};

/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function() {
	return this.score;
};

/**
 * Set the score for the assessment.
 * @param {number} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function( score ) {
	if ( isNumber( score ) ) {
		this.score = score;
		this._hasScore = true;
	}
};

/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function() {
	return this.text !== "";
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function() {
	return this.text;
};

/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function( text ) {
	if ( isUndefined( text ) ) {
		text = "";
	}

	this.text = text;
};

/**
 * Gets the available marks.
 *
 * @returns {array} The marks associated with the AssessmentResult.
 */
AssessmentResult.prototype.getMarks = function() {
	return this.marks;
};

/**
 * Sets the marks for the assessment.
 *
 * @param {array} marks The marks to be used for the marks property
 *
 * @returns {void}
 */
AssessmentResult.prototype.setMarks = function( marks ) {
	if ( isArray( marks ) ) {
		this.marks = marks;
		this._hasMarks = marks.length > 0;
	}
};

/**
 * Sets the identifier
 *
 * @param {string} identifier An alphanumeric identifier for this result.
 * @returns {void}
 */
AssessmentResult.prototype.setIdentifier = function( identifier ) {
	this._identifier = identifier;
};

/**
 * Gets the identifier
 *
 * @returns {string} An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.getIdentifier = function() {
	return this._identifier;
};

/**
 * Sets the marker, a pure function that can return the marks for a given Paper
 *
 * @param {Function} marker The marker to set.
 * @returns {void}
 */
AssessmentResult.prototype.setMarker = function( marker ) {
	this._marker = marker;
};

/**
 * Returns whether or not this result has a marker that can be used to mark for a given Paper
 *
 * @returns {boolean} Whether or this result has a marker.
 */
AssessmentResult.prototype.hasMarker = function() {
	return this._hasMarks && this._marker !== this.emptyMarker;
};

/**
 * Gets the marker, a pure function that can return the marks for a given Paper
 *
 * @returns {Function} The marker.
 */
AssessmentResult.prototype.getMarker = function() {
	return this._marker;
};

/**
 * Sets the value of _hasMarks to determine if there is something to mark.
 *
 * @param {boolean} hasMarks Is there something to mark.
 * @returns {void}
 */
AssessmentResult.prototype.setHasMarks = function( hasMarks ) {
	this._hasMarks = hasMarks;
};

/**
 * Returns the value of _hasMarks to determine if there is something to mark.
 *
 * @returns {boolean} Is there something to mark.
 */
AssessmentResult.prototype.hasMarks = function() {
	return this._hasMarks;
};

/**
 * Sets the value of _hasBetaBadge to determine if the result has a beta badge.
 *
 * @param {boolean} hasBetaBadge Whether this result has a beta badge.
 * @returns {void}
 */
AssessmentResult.prototype.setHasBetaBadge = function( hasBetaBadge ) {
	this._hasBetaBadge = hasBetaBadge;
};

/**
 * Returns the value of _hasBetaBadge to determine if the result has a beta badge.
 *
 * @returns {bool} Whether this result has a beta badge.
 */
AssessmentResult.prototype.hasBetaBadge = function() {
	return this._hasBetaBadge;
};

/**
 * Sets the value of _hasJumps to determine whether it's needed to jump to a different field.
 *
 * @param {boolean} hasJumps Whether this result causes a jump to a different field.
 * @returns {void}
 */
AssessmentResult.prototype.setHasJumps = function( hasJumps ) {
	this._hasJumps = hasJumps;
};

/**
 * Returns the value of _hasJumps to determine whether it's needed to jump to a different field.
 *
 * @returns {bool} Whether this result causes a jump to a different field.
 */
AssessmentResult.prototype.hasJumps = function() {
	return this._hasJumps;
};

/**
 * Check if an edit field name is available.
 * @returns {boolean} Whether or not an edit field name is available.
 */
AssessmentResult.prototype.hasEditFieldName = function() {
	return this._hasEditFieldName;
};

/**
 * Get the edit field name.
 * @returns {string} The edit field name associated with the AssessmentResult.
 */
AssessmentResult.prototype.getEditFieldName = function() {
	return this.editFieldName;
};

/**
 * Set the edit field name to be used to create the aria label for an edit button.
 * @param {string} editFieldName The string to be used for the string property
 * @returns {void}
 */
AssessmentResult.prototype.setEditFieldName = function( editFieldName ) {
	if ( editFieldName !== "" ) {
		this.editFieldName = editFieldName;
		this._hasEditFieldName = true;
	}
};

/**
 * Serializes the AssessmentResult instance to an object.
 *
 * @returns {Object} The serialized AssessmentResult.
 */
AssessmentResult.prototype.serialize = function() {
	return {
		_parseClass: "AssessmentResult",
		identifier: this._identifier,
		score: this.score,
		text: this.text,
		marks: this.marks.map( mark => mark.serialize() ),
		_hasBetaBadge: this._hasBetaBadge,
		_hasJumps: this._hasJumps,
		editFieldName: this.editFieldName,
	};
};

/**
 * Parses the object to an AssessmentResult.
 *
 * @param {Object} serialized The serialized object.
 *
 * @returns {AssessmentResult} The parsed AssessmentResult.
 */
AssessmentResult.parse = function( serialized ) {
	const result = new AssessmentResult( {
		text: serialized.text,
		score: serialized.score,
		marks: serialized.marks.map( mark => Mark.parse( mark ) ),
		_hasBetaBadge: serialized._hasBetaBadge,
		_hasJumps: serialized._hasJumps,
		editFieldName: serialized.editFieldName,
	} );
	result.setIdentifier( serialized.identifier );

	return result;
};

export default AssessmentResult;
