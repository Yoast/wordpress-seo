/* jshint browser: true */

var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );
var difference = require( "lodash/difference" );
var template = require( "./templates.js" ).scoreResult;

/**
 * defines the variables used for the scoreformatter, runs the outputScore en overallScore
 * functions.
 *
 * @param {App} args
 * @param {object} args.targets
 * @param {string} args.targets.output
 * @param {string} args.targets.overall
 * @param {string} args.keyword
 * @param {Assessor} args.assessor
 * @param {Jed} args.i18n
 * @constructor
 */
var ScoreFormatter = function( args ) {
	this.totalScore = 0;
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall;
};

/**
 * Renders the score in the HTML.
 */
ScoreFormatter.prototype.renderScore = function() {
	this.outputScore();
	this.outputOverallScore();
};

/**
 * creates the list for showing the results from the analyzerscorer
 */
ScoreFormatter.prototype.outputScore = function() {
	var scores = {};
	var outputTarget = document.getElementById( this.output );

	outputTarget.innerHTML = "";

	this.scores = this.sortScores( this.assessor.getValidResults() );

	for ( var i = 0; i < this.scores.length; i++ ) {
		if ( this.scores[ i ].text !== "" ) {
			var scoreRating = this.scoreRating( this.scores[i].result.score );

			scores[i] = {};
			scores[i].rating = scoreRating.text;
			scores[i].screenreaderText = scoreRating.screenreaderText;
			scores[i].text = this.scores[ i ].result.text;
		}
	}

	outputTarget.innerHTML = template( {
		scores: scores
	} );
};

/**
 * Sorts the scores array on ascending scores
 * @param {Array} scores The scores array that needs to be sorted.
 */
ScoreFormatter.prototype.sortScores = function( scores ) {
	var unsortables = this.getUndefinedScores( scores );
	var sortables = difference( scores, unsortables );

	sortables.sort( function( a, b ) {
		return a.result.score - b.result.score;
	} );

	return unsortables.concat( sortables );
};

/**
 * Extracts scorers with a score of undefined
 *
 * @param {Array} scorers The scorers that are being sorted
 * @returns {Array} The scorers that cannot be sorted
 */
ScoreFormatter.prototype.getUndefinedScores = function( scorers ) {
	var filtered = scorers.filter( function( scorer ) {
		return isUndefined( scorer.result.score ) || scorer.result.score === 0;
	} );

	return filtered;
};

/**
 * Outputs the overallScore in the overallTarget element.
 */
ScoreFormatter.prototype.outputOverallScore = function() {
	var overallTarget = document.getElementById( this.overall );
	var baseClassName = "overallScore ";

	if ( !overallTarget ) {
		return;
	}

	if ( this.keyword === "" ) {
		overallTarget.className = baseClassName + this.overallScoreRating( 0 ).text;
		return;
	}

	overallTarget.className = baseClassName + this.overallScoreRating( this.assessor.calculateOverallScore() ).text;
};

/**
 * Retuns a string that is used as a CSS class, based on the numeric score.
 *
 * @param {number} score
 * @returns {object} rating
 */
ScoreFormatter.prototype.scoreRating = function( score ) {
	var rating = {};

	if ( !isNumber( score ) ) {
		return rating;
	}

	if ( score === 0 ) {
		return {
			text: "na",
			screenreaderText: this.i18n.dgettext( "js-text-analysis", "Feedback" )
		};
	}

	if ( score <= 4 ) {
		return {
			text: "bad",
			screenreaderText: this.i18n.dgettext( "js-text-analysis", "Bad SEO score" )
		};
	}

	if ( score > 4 && score <= 7 ) {
		return {
			text: "ok",
			screenreaderText: this.i18n.dgettext( "js-text-analysis", "Ok SEO score" )
		};
	}

	if ( score > 7 ) {
		return {
			text: "good",
			screenreaderText: this.i18n.dgettext( "js-text-analysis", "Good SEO score" )
		};
	}

	return rating;
};

/**
 * Divides the total score by ten and calls the scoreRating function.
 *
 * @param {number} overallScore
 * @returns {Object} scoreRating
 */
ScoreFormatter.prototype.overallScoreRating = function( overallScore ) {
	if ( isNumber( overallScore ) ) {
		overallScore = ( overallScore / 10 );
	}

	return this.scoreRating( overallScore );
};

module.exports = ScoreFormatter;
