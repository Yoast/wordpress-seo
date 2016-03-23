/* global YoastSEO: true */

var escapeHTML = require( "lodash/string/escape" );
var Score = require( "./values/Score.js" );
var AnalyzerScoring = require( "./config/scoring.js" ).AnalyzerScoring;
var analyzerScoreRating = require( "./config/scoring.js" ).analyzerScoreRating;

var isUndefined = require( "lodash/lang/isUndefined" );

var assessments = {};
assessments.wordCount = require( "./assessments/countWords.js" );
assessments.fleschReading = require( "./assessments/calculateFleschReading.js" );
assessments.linkCount = require( "./assessments/getLinkStatistics.js" );
assessments.pageTitleKeyword = require( "./assessments/pageTitleKeyword.js" );
assessments.subHeadings = require( "./assessments/matchKeywordInSubheading.js" );
assessments.keywordDensity = require( "./assessments/keywordDensity.js" );
assessments.stopwordKeywordCount = require( "./assessments/stopWordsInKeyword.js" );
assessments.urlStopwords = require( "./assessments/stopWordsInUrl.js" );
assessments.metaDescriptionLength = require( "./assessments/metaDescriptionLength.js" );
assessments.keyphraseSizeCheck = require( "./assessments/keyphraseLength.js" );
assessments.metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeyword.js" );
assessments.imageCount = require( "./assessments/imageCount.js" );
assessments.urlKeyword = require( "./assessments/keywordInUrl.js" );

/**
 * inits the analyzerscorer used for scoring of the output from the textanalyzer
 *
 * @param {YoastSEO.Analyzer} refObj
 * @constructor
 */
var AnalyzeScorer = function( refObj ) {
	this.__score = [];
	this.refObj = refObj;
	this.i18n = refObj.config.i18n;
	this.paper = refObj.paper;
	this.init();
};

/**
 * loads the analyzerScoring from the config file.
 */
AnalyzeScorer.prototype.init = function() {
	var scoringConfig = new AnalyzerScoring( this.i18n );
	this.scoring = scoringConfig.analyzerScoring;
};

/**
 * Starts the scoring by taking the resultObject from the analyzer. Then runs the scorequeue.
 * @param resultObj
 */
AnalyzeScorer.prototype.score = function( resultObj ) {
	this.resultObj = resultObj;
	this.runQueue();
};

/**
 * runs the queue and saves the result in the __score-object.
 */
AnalyzeScorer.prototype.runQueue = function() {
	for ( var i = 0; i < this.resultObj.length; i++ ) {
		var subScore = this.genericScore( this.resultObj[ i ] );
		if ( typeof subScore !== "undefined" && subScore !== "" ) {
			this.__score = this.__score.concat( subScore );
		}
	}
	this.__totalScore = this.totalScore();
};

/**
 * Looks up the score based on the scorename in the object and calls calculate score
 * if a scoreObject is found.
 * @param {object} obj The resultobject from the resultarray.
 * @returns {{name: (analyzerScoring.scoreName), score: number, text: string}}
 */
AnalyzeScorer.prototype.genericScore = function( obj ) {
	if ( isUndefined( obj ) ) {
		return "";
	}

	var scoreObj = this.scoreLookup( obj.test );

	if ( isUndefined( scoreObj ) ) {
		return assessments[ obj.test ]( this.paper, YoastSEO.app.researcher,  this.i18n );
	}

	return this.calculateScore( obj, scoreObj, scoreObj.scoreName );
};

/**
 * calculates score based on the scoreObject
 *
 * @param {object} obj The object with the testresult.
 * @param {object} scoreObj The object containing all scores.
 * @param {string} scoreName The name of the score
 * @returns {*} The score from the analysis.
 */
AnalyzeScorer.prototype.calculateScore = function( obj, scoreObj, scoreName ) {
	var score = { name: scoreName, score: 0, text: "" };

	for ( var i = 0; i < scoreObj.scoreArray.length; i++ ) {
		this.setMatcher( obj, scoreObj, i );
		switch ( true ) {

			// if a type is given, the scorer looks for that object in the resultObject to use
			// for scoring
			case (
				typeof scoreObj.scoreArray[i].type === "string" &&
				this.result[ scoreObj.scoreArray[i].type ]
			):
				return this.returnScore( scoreObj, i );

			// looks if the value from the score is below the maximum value
			case (
				typeof scoreObj.scoreArray[i].min === "undefined" &&
				this.matcher <= scoreObj.scoreArray[i].max
			):
				return this.returnScore( scoreObj, i );

			// looks if the value from the score is above the minimum value
			case (
				typeof scoreObj.scoreArray[i].max === "undefined" &&
				this.matcher >= scoreObj.scoreArray[i].min
			):
				return this.returnScore( scoreObj, i );

			// looks if the value from the score is between the minimum and maximum value
			case (
				this.matcher >= scoreObj.scoreArray[i].min &&
				this.matcher <= scoreObj.scoreArray[i].max
			):
				return this.returnScore( scoreObj, i );
			default:
				break;
		}
	}
	return score;
};

/**
 * sets matcher and resultvariables so the scorefunction can use this.
 * @param obj
 * @param scoreObj
 * @param i
 */
AnalyzeScorer.prototype.setMatcher = function( obj, scoreObj, i ) {
	this.matcher = parseFloat( obj.result );
	this.result = obj.result;
	if ( typeof scoreObj.scoreArray[ i ].matcher !== "undefined" ) {
		this.matcher = parseFloat( this.result[ scoreObj.scoreArray[ i ].matcher ] );
	}
};

/**
 * finds the scoringobject by scorename for the current result.
 * @param name
 * @returns scoringObject
 */
AnalyzeScorer.prototype.scoreLookup = function( name ) {
	for ( var ii = 0; ii < this.scoring.length; ii++ ) {
		if ( name === this.scoring[ ii ].scoreName ) {
			return this.scoring[ ii ];
		}
	}
};

/**
 * fills the score with score and text from the scoreArray and runs the textformatter.
 * @param {Object} scoreObj
 * @param {number} i
 * @returns {Score}
 */
AnalyzeScorer.prototype.returnScore = function( scoreObj, i ) {

	return new Score( scoreObj.scoreArray[ i ].score, this.scoreTextFormat( scoreObj.scoreArray[ i ], scoreObj.replaceArray ) );
};

/**
 * Formats the resulttexts with variables. Uses a value, source, sourceObj or scoreObj for the
 * replacement source replaces the position from the replaceArray with the replacement source.
 * @param scoreObj
 * @param replaceArray
 * @returns formatted resultText
 */
AnalyzeScorer.prototype.scoreTextFormat = function( scoreObj, replaceArray ) {
	var replaceWord;
	var resultText = scoreObj.text;
	resultText = escapeHTML( resultText );
	if ( typeof replaceArray !== "undefined" ) {
		for ( var i = 0; i < replaceArray.length; i++ ) {
			switch ( true ) {
				case ( typeof replaceArray[ i ].value !== "undefined" ):

					// gets the value from the replaceArray and replaces it on the given position
					resultText = resultText.replace(
						replaceArray[ i ].position,
						replaceArray[ i ].value
					);
					break;
				case ( typeof replaceArray[ i ].source !== "undefined" ):

					// gets the source (which is a value of the analyzer) and replaces it on the
					// given position
					resultText = resultText.replace(
						replaceArray[ i ].position,
						escapeHTML( this[ replaceArray[ i ].source ] )
					);
					break;
				case ( typeof replaceArray[ i ].sourceObj !== "undefined" ):

					// gets the replaceword (which is a reference to an object in the analyzer) and
					// replaces is on the given position
					replaceWord = this.parseReplaceWord( replaceArray[ i ].sourceObj );
					if ( typeof replaceArray[ i ].rawOutput === "undefined" || replaceArray[ i ].rawOutput !== true ) {
						replaceWord = escapeHTML( replaceWord );
					}

					resultText = resultText.replace( replaceArray[ i ].position, replaceWord );
					break;
				case ( typeof replaceArray[ i ].scoreObj !== "undefined" ):

					// gets the replaceword from the scoreObject, to use values from the score in
					// the textString.
					resultText = resultText.replace(
						replaceArray[ i ].position,
						escapeHTML( scoreObj[ replaceArray[ i ].scoreObj ] )
					);
					break;
				default:
					break;
			}
		}
	}
	return resultText;
};

/**
 * converts the string to the correct object and returns the string to be used in the text.
 * @param replaceWord
 * @returns {YoastSEO.AnalyzeScorer}
 */
AnalyzeScorer.prototype.parseReplaceWord = function( replaceWord ) {
	var parts = replaceWord.split( "." );
	var source = this;
	for ( var i = 1; i < parts.length; i++ ) {
		source = source[ parts[ i ] ];
	}
	return source;
};

/**
 * calculates the totalscore, by adding all scores and dividing them by the amount in the score
 * array. Removes unused results that have no score
 * @returns score
 */
AnalyzeScorer.prototype.totalScore = function() {
	var scoreAmount = this.__score.length;
	var totalScore = 0;
	for ( var i = 0; i < this.__score.length; i++ ) {
		if (
			typeof this.__score[ i ] !== "undefined" &&
			this.__score[ i ].text !== "" &&
		    typeof this.__score[ i ].score !== "undefined"
		) {
			totalScore += this.__score[ i ].score;
		} else {
			scoreAmount--;
		}
	}
	var totalAmount = scoreAmount * analyzerScoreRating;
	return Math.round( ( totalScore / totalAmount ) * 100 );
};

/**
 * Returns total score as calculated.
 *
 * @returns {number}
 */
AnalyzeScorer.prototype.getTotalScore = function() {
	return this.__totalScore;
};

/**
 * Adds a custom scoring to the analyzer scoring
 *
 * @param {Object} scoring
 * @param {string} scoring.name
 * @param {Object} scoring.scoring
 */
AnalyzeScorer.prototype.addScoring = function( scoring ) {
	var scoringObject = scoring.scoring;

	scoringObject.scoreName = scoring.name;

	this.scoring.push( scoringObject );
};

module.exports = AnalyzeScorer;
