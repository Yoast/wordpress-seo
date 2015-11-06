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
	this.scores = args.scores;
	this.overallScore = args.overallScore;
	this.outputTarget = args.outputTarget;
	this.overallTarget = args.overallTarget;
	this.totalScore = 0;
	this.keyword = args.keyword;
	this.i18n = args.i18n;
	this.saveScores = args.saveScores;
};

/**
 * Renders the score in the HTML.
 */
YoastSEO.ScoreFormatter.prototype.renderScore = function() {
	this.outputScore( this.i18n );
	this.outputOverallScore();
};

/**
 * creates the list for showing the results from the analyzerscorer
 *
 * @param {Jed} i18n An translation object to translate the strings with.
 */
YoastSEO.ScoreFormatter.prototype.outputScore = function( i18n ) {
	var seoScoreText, scoreRating;

	this.sortScores();
	var outputTarget = document.getElementById( this.outputTarget );
	outputTarget.innerHTML = "";
	var newList = document.createElement( "ul" );
	newList.className = "wpseoanalysis";
	for ( var i = 0; i < this.scores.length; i++ ) {
		if ( this.scores[ i ].text !== "" ) {
			scoreRating = this.scoreRating( this.scores[ i ].score );

			var newLI = document.createElement( "li" );
			newLI.className = "score";
			var scoreSpan = document.createElement( "span" );
			scoreSpan.className = "wpseo-score-icon " + scoreRating;
			newLI.appendChild( scoreSpan );

			seoScoreText = this.getSEOScoreText( scoreRating, i18n );

			var screenReaderDiv = document.createElement( "span" );
			screenReaderDiv.className = "screen-reader-text";
			screenReaderDiv.textContent = seoScoreText;

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

	if ( overallTarget ) {
		overallTarget.className = "overallScore " + this.scoreRating( Math.round( this.overallScore ) );
		if ( this.keyword === "" ) {
			overallTarget.className = "overallScore " + this.scoreRating( "na" );
		}
	}

	this.saveScores( this.overallScore );
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

/**
 * Returns a translated score description based on the textual score rating
 *
 * @param {string} scoreRating Textual score rating, can be retrieved with scoreRating from the actual score.
 * @param {Jed}    i18n A translation object to use when translating the strings.
 *
 * @return {string}
 */
YoastSEO.ScoreFormatter.prototype.getSEOScoreText = function( scoreRating, i18n ) {
	var scoreText = "";

	switch ( scoreRating ) {
		case "na":
			scoreText = i18n.dgettext( "js-text-analysis", "No keyword" );
			break;

		case "bad":
			scoreText = i18n.dgettext( "js-text-analysis", "Bad SEO score" );
			break;

		case "poor":
			scoreText = i18n.dgettext( "js-text-analysis", "Poor SEO score" );
			break;

		case "ok":
			scoreText = i18n.dgettext( "js-text-analysis", "Ok SEO score" );
			break;

		case "good":
			scoreText = i18n.dgettext( "js-text-analysis", "Good SEO score" );
			break;
	}

	return scoreText;
};
