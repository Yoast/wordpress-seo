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
 * @param {Assessor} args.assesor
 * @param {Jed} args.assessor.i18n
 * @constructor
 */
var ScoreFormatter = function( args ) {
	this.totalScore = 0;
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.assessor.i18n;
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
			scores[i].seoText = scoreRating.seoText;
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
		return a.score - b.score;
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
		return isUndefined( scorer.score ) || scorer.score === "na";
	} );

	return filtered;
};

/**
 * outputs the overallScore in the overallTarget element.
 */
ScoreFormatter.prototype.outputOverallScore = function() {
	var overallTarget = document.getElementById( this.overall );

	if ( overallTarget ) {
		overallTarget.className = "overallScore " + this.overallScoreRating( Math.round( this.assessor.calculateOverallScore() ) ).text;
	}

	if ( overallTarget && this.keyword === "" ) {
		overallTarget.className = "overallScore " + this.overallScoreRating( "na" ).text;
	}
};

/**
 * Retuns a string that is used as a CSSclass, based on the numeric score or the NA string.
 *
 * @param {number|string} score
 * @returns {object} rating
 */
ScoreFormatter.prototype.scoreRating = function( score ) {
	var rating = {};

	if ( !isNumber( score ) && score !== "na" ) {
		return rating;
	}

	switch ( true ) {
		case score <= 4:
			rating.text = "bad";
			rating.seoText = this.i18n.dgettext( "js-text-analysis", "Bad SEO score" );
			break;
		case score > 4 && score <= 7:
			rating.text = "ok";
			rating.seoText = this.i18n.dgettext( "js-text-analysis", "Ok SEO score" );
			break;
		case score > 7:
			rating.text = "good";
			rating.seoText = this.i18n.dgettext( "js-text-analysis", "Good SEO score" );
			break;
		default:
		case score === "na":
			rating.text = "na";
			rating.seoText = this.i18n.dgettext( "js-text-analysis", "No keyword" );
			break;
	}

	return rating;
};

/**
 * Divides the total score by ten and calls the scoreRating function.
 *
 * @param {number|string} score
 * @returns {string} scoreRate
 */
ScoreFormatter.prototype.overallScoreRating = function( score ) {
	if ( isNumber( score ) ) {
		score = ( score / 10 );
	}

	return this.scoreRating( score ).text;
};

module.exports = ScoreFormatter;
