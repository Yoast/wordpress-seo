/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * defines the variables used for the scoreformatter, runs the outputScore en overallScore
 * functions.
 *
 * @param {YoastSEO.App} args
 * @constructor
 */
YoastSEO.ScoreFormatter = function( args ) {
	this.scores = args.pageAnalyzer.analyzeScorer.__score;
	this.overallScore = args.pageAnalyzer.analyzeScorer.__totalScore;
	this.outputTarget = args.config.targets.output;
	this.overallTarget = args.config.targets.overall;
	this.totalScore = 0;
	this.refObj = args;
	this.outputScore();
	this.outputOverallScore();
};

/**
 * creates the list for showing the results from the analyzerscorer
 */
YoastSEO.ScoreFormatter.prototype.outputScore = function() {
	this.sortScores();
	var outputTarget = document.getElementById( this.outputTarget );
	outputTarget.innerHTML = "";
	var newList = document.createElement( "ul" );
	newList.className = "wpseoanalysis";
	for ( var i = 0; i < this.scores.length; i++ ) {
		if ( this.scores[ i ].text !== "" ) {
			var newLI = document.createElement( "li" );
			newLI.className = "score";
			var scoreSpan = document.createElement( "span" );
			scoreSpan.className = "wpseo-score-icon " + this.scoreRating( this.scores[ i ].score );
			newLI.appendChild( scoreSpan );
			var screenReaderDiv = document.createElement( "span" );
			screenReaderDiv.className = "screen-reader-text";
			screenReaderDiv.textContent = "seo score " + this.scoreRating( this.scores[ i ].score );
			newLI.appendChild( screenReaderDiv );
			var textSpan = document.createElement( "span" );
			textSpan.className = "wpseo-score-text";
			textSpan.innerHTML = this.scores[ i ].text;
			newLI.appendChild( textSpan );
			newList.appendChild( newLI );
		}
	}
	outputTarget.appendChild( newList );
};

/**
 * sorts the scores array on ascending scores
 */
YoastSEO.ScoreFormatter.prototype.sortScores = function() {
	this.scores = this.scores.sort( function( a, b ) {
		return a.score - b.score;
	} );
};

/**
 * outputs the overallScore in the overallTarget element.
 */
YoastSEO.ScoreFormatter.prototype.outputOverallScore = function() {
	var overallTarget = document.getElementById( this.overallTarget );
	overallTarget.className = "overallScore " + this.scoreRating( Math.round( this.overallScore ) );
	if ( this.keyword === "" ) {
		overallTarget.className = "overallScore " + this.scoreRating( "na" );
	}
	this.callbacks.saveScores( this.overallScore );
};

/**
 * retuns a string that is used as a CSSclass, based on the numeric score or the NA string
 * @param score
 * @returns scoreRate
 */
YoastSEO.ScoreFormatter.prototype.scoreRating = function( score ) {
	var scoreRate;
	switch ( score ) {
		case "na":
			scoreRate = "na";
			break;
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			scoreRate = "poor";
			break;
		case 6:
		case 7:
			scoreRate = "ok";
			break;
		case 8:
		case 9:
		case 10:
			scoreRate = "good";
			break;
		default:
			scoreRate = "bad";
			break;
	}
	return scoreRate;
};
