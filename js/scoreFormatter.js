
/**
 * defines the variables used for the scoreformatter, runs the outputScore en overallScore functions.
 * @param scores
 * @param target
 * @constructor
 */
YoastSEO_ScoreFormatter = function ( scores, target ) {
    this.scores = scores.analyzeScorer.__score;
    this.overallScore = scores.analyzeScorer.__totalScore;
    this.outputTarget = target.output;
    this.overallTarget = target.overall;
    this.totalScore = 0;
    this.outputScore();
    this.outputOverallScore();
};

/**
 * creates the list for showing the results from the analyzerscorer
 */
YoastSEO_ScoreFormatter.prototype.outputScore = function() {
    this.sortScores();
    var outputTarget = document.getElementById( this.outputTarget );
    outputTarget.innerHTML = "";
    var newList = document.createElement( "ul" );
    newList.className = "wpseoanalysis";
    for ( var i = 0; i < this.scores.length; i++ ){
        if( this.scores[i].text !== "" ) {
            var newLI = document.createElement( "li" );
            newLI.className = "score";
            var scoreSpan = document.createElement( "span" );
            scoreSpan.className = "wpseo-score-icon " + this.scoreRating( this.scores[i].score );
            newLI.appendChild( scoreSpan );
			var screenReaderDiv = document.createElement( "span" );
			screenReaderDiv.className = "screen-reader-text";
			screenReaderDiv.textContent = "seo score "+ this.scoreRating( this.scores[i].score );
			newLI.appendChild( screenReaderDiv );
            var textSpan = document.createElement( "span" );
            textSpan.className = "wpseo-score-text";
            textSpan.innerHTML = this.scores[i].text;
            newLI.appendChild( textSpan );
            newList.appendChild( newLI );
        }
    }
    outputTarget.appendChild( newList );
};

/**
 * sorts the scores array on ascending scores
 */
YoastSEO_ScoreFormatter.prototype.sortScores = function() {
    this.scores = this.scores.sort( function( a, b ){
        return a.score - b.score;
    });
};

/**
 * outputs the overallScore in the overallTarget element.
 */
YoastSEO_ScoreFormatter.prototype.outputOverallScore = function() {
    var overallTarget = document.getElementById( this.overallTarget );
    overallTarget.className = "overallScore "+this.scoreRating(Math.round(this.overallScore));
};

/**
 * retuns a string that is used as a CSSclass, based on the numeric score
 * @param score
 * @returns scoreRate
 */
YoastSEO_ScoreFormatter.prototype.scoreRating = function( score ){
    var scoreRate;
    switch( score ) {
        case 0:
            scoreRate = "na";
            break;
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
