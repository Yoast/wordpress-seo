var Researcher = require( "./researcher.js" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isFunction = require( "lodash/isFunction" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var findIndex = require( "lodash/findIndex" );
var find = require( "lodash/find" );

var ScoreRating = 9;

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var Assessor = function( i18n, options ) {
	this.setI18n( i18n );
	this._assessments = [];

	this._options = options || {};
};

/**
 * Checks if the i18n object is defined and sets it.
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 */
Assessor.prototype.setI18n = function( i18n ) {
	if ( isUndefined( i18n ) ) {
		throw new MissingArgument( "The assessor requires an i18n object." );
	}
	this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function() {
	return this._assessments;
};

/**
 * Checks whether or not the Assessment is applicable.
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function( assessment, paper, researcher ) {
	if ( assessment.hasOwnProperty( "isApplicable" ) ) {
		return assessment.isApplicable( paper, researcher );
	}

	return true;
};

/**
 * Determines whether or not an assessment has a marker
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function( assessment ) {
	return isFunction( this._options.marker ) && assessment.hasOwnProperty( "getMarks" );
};

/**
 * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
 *
 * @param {Object} assessment The assessment for which we are retrieving the composed marker.
 * @param {Paper} paper The paper to retrieve the marker for.
 * @param {Researcher} researcher The researcher for the paper.
 * @returns {Function} A function that can mark the given paper according to the given assessment.
 */
Assessor.prototype.getMarker = function( assessment, paper, researcher ) {
	var specificMarker = this._options.marker;

	return function() {
		var marks = assessment.getMarks( paper, researcher );

		specificMarker( paper, marks );
	};
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @param {Paper} paper The paper to run assessments on.
 */
Assessor.prototype.assess = function( paper ) {
	var result;
	var researcher = new Researcher( paper );
	var assessments = this.getAvailableAssessments();
	this.results = [];

	assessments = filter( assessments, function( assessment ) {
		return this.isApplicable( assessment, paper, researcher );
	}.bind( this ) );

	this.results = map( assessments, function( assessment ) {
		result = assessment.getResult( paper, researcher, this.i18n );

		result.setIdentifier( assessment.identifier );

		if ( this.hasMarker( assessment ) ) {
			result.setMarker( this.getMarker( assessment, paper, researcher ) );
		}

		return result;
	}.bind( this ) );
};

/**
 * Filters out all assessmentresults that have no score and no text.
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function() {
	return filter( this.results, function( result ) {
		return this.isValidResult( result );
	}.bind( this ) );
};

/**
 * Returns if an assessmentResult is valid.
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function( assessmentResult ) {
	return assessmentResult.hasScore() && assessmentResult.hasText();
};

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore  = function() {
	var results = this.getValidResults();
	var totalScore = 0;

	forEach( results, function( assessmentResult ) {
		totalScore += assessmentResult.getScore();
	} );

	return Math.round( totalScore / ( results.length * ScoreRating ) * 100 );
};

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function( name, assessment ) {
	if ( !assessment.hasOwnProperty( "identifier" ) ) {
		assessment.identifier = name;
	}

	this._assessments.push( assessment );
	return true;
};

/**
 * Remove a specific Assessment from the list of Assessments.
 * @param {string} name The Assessment to remove from the list of assessments.
 */
Assessor.prototype.removeAssessment = function( name ) {
	var toDelete = findIndex( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && name === assessment.identifier;
	} );

	if ( -1 !== toDelete ) {
		this._assessments.splice( toDelete, 1 );
	}
};

/**
 * Returns an assessment by identifier
 *
 * @param {string} identifier The identifier of the assessment.
 * @returns {undefined|Object} The object if found, otherwise undefined.
 */
Assessor.prototype.getAssessment = function( identifier ) {
	return find( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && identifier === assessment.identifier;
	} );
};

module.exports = Assessor;
