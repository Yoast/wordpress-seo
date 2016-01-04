/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * Text Analyzer, accepts args for config and calls init for initialization
 *
 * @param {Object} args The analyzer arguments.
 * @param {String} args.keyword The keyword to analyze the text with.
 * @param {String} args.meta The meta description of the page.
 * @param {String} args.text The text of the page.
 * @param {String} args.pageTitle The title of the page as displayed in google.
 * @param {String} args.title The actual title of the page.
 * @param {String} args.url The full URL that the page will be displayed on.
 * @param {String} args.excerpt The page excerpt.
 * @param {String} args.snippetTitle The title as displayed in the snippet preview.
 * @param {String} args.snippetMeta The meta description as displayed in the snippet preview.
 * @param {String} args.snippetCite  The URL as displayed in the snippet preview.
 *
 * @property {Object} analyses Object that contains all analyses.
 *
 * @constructor
 */
YoastSEO.Analyzer = function( args ) {
	this.config = args;
	this.checkConfig();
	this.init( args );

	this.analyses = {};
};

/**
 * sets value to "" of text if it is undefined to make sure it doesn' break the preprocessor and
 * analyzer
 */
YoastSEO.Analyzer.prototype.checkConfig = function() {
	if ( typeof this.config.text === "undefined" ) {
		this.config.text = "";
	}
};

/**
 * YoastSEO.Analyzer initialization. Loads defaults and overloads custom settings.
 */
YoastSEO.Analyzer.prototype.init = function( args ) {
	this.config = args;
	this.initDependencies();
	this.formatKeyword();
	this.initQueue();
	this.loadWordlists();
	this.__output = [];
	this.__store = {};
};

/**
 * creates a regex from the keyword including /ig switch so it is case insensitive and global.
 * replaces a number of characters that can break the regex.
*/
YoastSEO.Analyzer.prototype.formatKeyword = function() {
	if ( typeof this.config.keyword !== "undefined" && this.config.keyword !== "" ) {

		// removes characters from the keyword that could break the regex, or give unwanted results.
		// leaves the - since this is replaced later on in the function
		var keyword = this.stringHelper.sanitizeKeyword( this.config.keyword );

		// Creates new regex from keyword with global and caseinsensitive option,

		this.keywordRegex = new RegExp( "\\b" +
			this.preProcessor.replaceDiacritics( keyword.replace( /[-_]/g, " " ) ) + "\\b",
			"ig"
		);

		// Creates new regex from keyword with global and caseinsensitive option,
		// replaces space with -. Used for URL matching
		this.keywordRegexInverse = new RegExp( "\\b" +
			this.preProcessor.replaceDiacritics( keyword.replace( /\s/g, "-" ) ) + "\\b",
			"ig"
		);
	}
};

/**
 * initializes required objects.
 * For the analyzeScorer a new object is always defined, to make sure there are no duplicate scores
 */
YoastSEO.Analyzer.prototype.initDependencies = function() {

	//init preprocessor
	this.preProcessor = new YoastSEO.getPreProcessor( this.config.text );

	//init helper
	this.stringHelper = YoastSEO.getStringHelper();

	//init scorer
	this.analyzeScorer = new YoastSEO.AnalyzeScorer( this );
};

/**
 * initializes the function queue. Uses slice for assignment so it duplicates array in stead of
 * referencing it.
 */
YoastSEO.Analyzer.prototype.initQueue = function() {

	//if custom queue available load queue, otherwise load default queue.
	if ( typeof this.config.queue !== "undefined" && this.config.queue.length !== 0 ) {
		this.queue = this.config.queue.slice();
	} else {
		this.queue = YoastSEO.analyzerConfig.queue.slice();
	}
};

/**
 * load wordlists.
 */
YoastSEO.Analyzer.prototype.loadWordlists = function() {

	//if no available keywords, load default array
	if ( typeof this.config.wordsToRemove === "undefined" ) {
		this.config.wordsToRemove = YoastSEO.analyzerConfig.wordsToRemove;
	}
	if ( typeof this.config.stopWords === "undefined" ) {
		this.config.stopWords = YoastSEO.analyzerConfig.stopWords;
	}
};

/**
 * starts queue of functions executing the analyzer functions untill queue is empty.
 */
YoastSEO.Analyzer.prototype.runQueue = function() {
	var output, score;

	// Remove the first item from the queue and execute it.
	if ( this.queue.length > 0 ) {
		var currentQueueItem = this.queue.shift();

		if ( undefined !== this[ currentQueueItem ] ) {
			output = this[ currentQueueItem ]();
		} else if ( this.analyses.hasOwnProperty( currentQueueItem ) ) {
			score = this.analyses[ currentQueueItem ].callable();

			/*
			 * This is because the analyzerScorer requires this format and we want users that add plugins to just return
			 * a score because that makes the API easier. So this is a translation while our internal format isn't
			 * perfect.
			 */
			output = {
				"test": this.analyses[ currentQueueItem ].name,
				"result": score
			};
		}

		this.__output = this.__output.concat( output );

		this.runQueue();
	} else {
		this.score();
	}
};

/**
 * Adds an analysis to the analyzer
 *
 * @param {Object}   analysis The analysis object.
 * @param {string}   analysis.name The name of this analysis.
 * @param {function} analysis.callable The function to call to calculate this the score.
 */
YoastSEO.Analyzer.prototype.addAnalysis = function( analysis ) {
	this.analyses[ analysis.name ] = analysis;
	this.queue.push( analysis.name );
};

/**
 * returns wordcount from the preprocessor storage to include them in the results.
 * @returns {{test: string, result: (Function|YoastSEO.PreProcessor.wordcount|Number)}[]}
 */
YoastSEO.Analyzer.prototype.wordCount = function() {
	var countWords = require( "./stringProcessing/countWords.js" );
	return [ { test: "wordCount", result: countWords( this.config.text ) } ];
};

/**
 * Checks if keyword is present, if not returns 0
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keyphraseSizeCheck = function() {
	var getKeyphraseLength = require( "./analyses/getWordCount.js" );
	return [ { test: "keyphraseSizeCheck", result: getKeyphraseLength( this.config.keyword ) } ];
};

/**
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
YoastSEO.Analyzer.prototype.keywordDensity = function() {
	var getKeywordDensity = require( "./analyses/getKeywordDensity.js" );
	var countWords = require( "./stringProcessing/countWords.js" );
	if ( countWords (this.config.text ) >= 100 ){
		var density = getKeywordDensity( this.config.text, this.config.keyword );

		return [ { test: "keywordDensity", result: density } ];
	}
};

/**
 * counts the number of keyword occurrences of the keyword. Saves this in the __store and returns
 * it.
 * @returns keywordCount
 */
YoastSEO.Analyzer.prototype.keywordCount = function() {
	var matchTextWithWord = require( "./stringProcessing/matchTextWithWord.js" );
	var keywordCount = matchTextWithWord( this.config.text, this.config.keyword );

	return keywordCount;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
YoastSEO.Analyzer.prototype.subHeadings = function() {
	var getSubheadings = require ( "./analyses/matchKeywordInSubheadings.js" );

	var result = [ { test: "subHeadings", result: getSubheadings( this.config.text, this.config.keyword ) } ];

	return result;
};

/**
 * check if the keyword contains stopwords.
 * @returns {result object}
 */
YoastSEO.Analyzer.prototype.stopwords = function() {
	var checkStringForStopwords = require( "./analyses/checkStringForStopwords.js" );
	var matches = checkStringForStopwords( this.config.keyword );

	/* matchestext is used for scoring, we should move this to the scoring */
	var matchesText = "";
	if ( matches !== null ) {
		for ( var i = 0; i < matches.length; i++ ) {
			matchesText = matchesText + matches[ i ] + ", ";
		}
	}

	return [ {
		test: "stopwordKeywordCount",
		result: {
			count: matches.length,
			matches: matchesText.substring( 0, matchesText.length - 2 )
		}
	} ];
};

/**
 * calculate Flesch Reading score
 * formula: 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 * @returns {result object}
 */
YoastSEO.Analyzer.prototype.fleschReading = function() {
	var calculateFleschReading = require( "./analyses/calculateFleschReading.js" );
	return [ { test: "fleschReading", result: calculateFleschReading( this.config.text ) } ];
};

/**
 * counts the links in a given text. Also checks if a link is internal of external.
 * @returns {
 * 		{
 * 			total: number, internal: {
 * 				total: number,
 * 				totalNaKeyword: number,
 * 				totalKeyword: number,
 * 				dofollow: number,
 * 				nofollow: number
 * 			}, external: {
 * 				total: number,
 * 				dofollow: number,
 * 				nofollow: number
 * 			}, other: {
 * 				total: number,
 * 				dofollow: number,
 * 				nofollow: number
 * 			}
 * 		}
 * 	}
 */
YoastSEO.Analyzer.prototype.linkCount = function() {
	var countLinks = require( "./analyses/getLinkStatistics.js" );
	return [ { test: "linkCount", result: countLinks( this.config.text, this.config.keyword, this.config.baseUrl ) } ];
};

/**
 * counts the number of images found in a given textstring, based on the <img>-tag and returns a
 * result object
 *
 * @todo update function so it will also check on picture elements/make it configurable.
 *
 * @returns {{name: string, result: {total: number, alt: number, noAlt: number}}}
 */
YoastSEO.Analyzer.prototype.imageCount = function() {
	var countImages = require( "./analyses/getImageStatistics.js" );
	return [ { test: "imageCount", result: countImages(this.config.text, this.config.keyword ) } ];
};

/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */
YoastSEO.Analyzer.prototype.pageTitleLength = function() {
	var result =  [ { test: "pageTitleLength", result:  0 } ];
	if ( typeof this.config.pageTitle !== "undefined" ) {
		result[ 0 ].result = this.config.pageTitle.length;
	}
	return result;
};

/**
 * counts the occurrences of the keyword in the pagetitle, returns 0 if pagetitle is empty or not
 * set.
 *
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.pageTitleKeyword = function() {
	var findKeywordInPageTitle = require ( "./analyses/findKeywordInPageTitle.js" );
	var result = [ { test: "pageTitleKeyword", result: { position: -1, matches: 0 } }  ];
	if( typeof this.config.pageTitle !== "undefined" && typeof this.config.keyword !== "undefined" ){
		result[0].result = findKeywordInPageTitle( this.config.pageTitle, this.config.keyword );
	}
	return result;
};

/**
 * counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.firstParagraph = function() {
	var findKeywordInFirstParagraph = require( "./analyses/findKeywordInFirstParagraph.js" );
	var result = [ { test: "firstParagraph", result: findKeywordInFirstParagraph( this.config.text, this.config.keyword ) } ];
	return result;
};

/**
 * counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is
 * empty or not set. Default is -1, if the meta is empty, this way we can score for empty meta.
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.metaDescriptionKeyword = function() {
	var wordMatch = require( "./stringProcessing/matchTextWithWord.js" );
	var result = [ { test: "metaDescriptionKeyword", result: -1 } ];
	if ( typeof this.config.meta !== "undefined" && typeof this.config.keyword !== "undefined" && this.config.meta !== "" && this.config.keyword !== "" ){
		result[ 0 ].result = wordMatch( this.config.meta, this.config.keyword );
	}


	return result;
};

/**
 * returns the length of the metadescription
 * @returns {{test: string, result: Number}[]}
 */
YoastSEO.Analyzer.prototype.metaDescriptionLength = function() {
	var result = [ { test: "metaDescriptionLength", result: 0 } ];
	if( typeof  this.config.meta !== "undefined" ){
		result[ 0 ].result =  this.config.meta.length;
	}

	return result;
};

/**
 * counts the occurences of the keyword in the URL, returns 0 if no URL is set or is empty.
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.urlKeyword = function() {
	var checkForKeywordInUrl = require( "./analyses/countKeywordInUrl.js" );

	var result = [ { test: "urlKeyword", result: checkForKeywordInUrl( this.config.url, this.config.keyword ) } ];
	return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.urlLength = function() {
	var getUrlLength = require( "./analyses/getUrlLength.js" );
	var result = [ { test: "urlLength", result: { urlTooLong: getUrlLength(
		this.config.url,
		this.config.keyword,
		this.config.maxSlugLength,
		this.config.maxUrlLength
	) } } ];
	return result;
};

/**
 * checks if there are stopwords used in the URL.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.urlStopwords = function() {
	var checkUrlForStopwords = require ( "./analyses/checkUrlForStopwords.js" );
	var result = [ { test: "urlStopwords", result: checkUrlForStopwords( this.config.url ) } ];

	return result;
};

/**
 * checks if the keyword has been used before. Uses usedkeywords array. If empty, returns 0.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keywordDoubles = function() {
	var result = [ { test: "keywordDoubles", result: {count: 0, id: 0 } } ];
	if ( this.config.keyword !== "undefined" && this.config.usedKeywords !== "undefined" ){
		var checkForKeywordDoubles = require ( "./analyses/checkForKeywordDoubles.js" );
		result[0].result = checkForKeywordDoubles( this.config.keyword, this.config.usedKeywords );
	}
	return result;
};

/**
 * runs the scorefunction of the analyzeScorer with the generated output that is used as a queue.
 */
YoastSEO.Analyzer.prototype.score = function() {
	this.analyzeScorer.score( this.__output );
};
;/* global YoastSEO: true */

/**
 * inits the analyzerscorer used for scoring of the output from the textanalyzer
 *
 * @param {YoastSEO.Analyzer} refObj
 * @constructor
 */
YoastSEO.AnalyzeScorer = function( refObj ) {
	this.__score = [];
	this.refObj = refObj;
	this.i18n = refObj.config.i18n;
	this.init();
};

/**
 * loads the analyzerScoring from the config file.
 */
YoastSEO.AnalyzeScorer.prototype.init = function() {
	var scoringConfig = new YoastSEO.AnalyzerScoring( this.i18n );
	this.scoring = scoringConfig.analyzerScoring;
};

/**
 * Starts the scoring by taking the resultObject from the analyzer. Then runs the scorequeue.
 * @param resultObj
 */
YoastSEO.AnalyzeScorer.prototype.score = function( resultObj ) {
	this.resultObj = resultObj;
	this.runQueue();
};

/**
 * runs the queue and saves the result in the __score-object.
 */
YoastSEO.AnalyzeScorer.prototype.runQueue = function() {
	for ( var i = 0; i < this.resultObj.length; i++ ) {
		var subScore = this.genericScore( this.resultObj[ i ] );
		if ( typeof subScore !== "undefined" ) {
			this.__score = this.__score.concat( subScore );
		}
	}
	this.__totalScore = this.totalScore();
};

/**
 * scoring function that returns results based on the resultobj from the analyzer matched with
 * the scorearrays in the scoring config.
 * @param obj
 * @returns {{name: (analyzerScoring.scoreName), score: number, text: string}}
 */
YoastSEO.AnalyzeScorer.prototype.genericScore = function( obj ) {
	if ( typeof obj !== "undefined" ) {
		var scoreObj = this.scoreLookup( obj.test );

		//defines default score Object.
		var score = { name: scoreObj.scoreName, score: 0, text: "" };
		for ( var i = 0; i < scoreObj.scoreArray.length; i++ ) {
			this.setMatcher( obj, scoreObj, i );
			switch ( true ) {

				// if a type is given, the scorer looks for that object in the resultObject to use
				// for scoring
				case (
					typeof scoreObj.scoreArray[ i ].type === "string" &&
					this.result[ scoreObj.scoreArray[ i ].type ]
				):
					return this.returnScore( score, scoreObj, i );

				// looks if the value from the score is below the maximum value
				case (
					typeof scoreObj.scoreArray[ i ].min === "undefined" &&
					this.matcher <= scoreObj.scoreArray[ i ].max
				):
					return this.returnScore( score, scoreObj, i );

				// looks if the value from the score is above the minimum value
				case (
					typeof scoreObj.scoreArray[ i ].max === "undefined" &&
					this.matcher >= scoreObj.scoreArray[ i ].min
				):
					return this.returnScore( score, scoreObj, i );

				// looks if the value from the score is between the minimum and maximum value
				case (
					this.matcher >= scoreObj.scoreArray[ i ].min &&
					this.matcher <= scoreObj.scoreArray[ i ].max
				):
					return this.returnScore( score, scoreObj, i );
				default:
					break;
			}
		}
		return score;
	}
};

/**
 * sets matcher and resultvariables so the scorefunction can use this.
 * @param obj
 * @param scoreObj
 * @param i
 */
YoastSEO.AnalyzeScorer.prototype.setMatcher = function( obj, scoreObj, i ) {
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
YoastSEO.AnalyzeScorer.prototype.scoreLookup = function( name ) {
	for ( var ii = 0; ii < this.scoring.length; ii++ ) {
		if ( name === this.scoring[ ii ].scoreName ) {
			return this.scoring[ ii ];
		}
	}
};

/**
 * fills the score with score and text from the scoreArray and runs the textformatter.
 * @param score
 * @param scoreObj
 * @param i
 * @returns scoreObject
 */
YoastSEO.AnalyzeScorer.prototype.returnScore = function( score, scoreObj, i ) {
	score.score = scoreObj.scoreArray[ i ].score;
	score.text = this.scoreTextFormat( scoreObj.scoreArray[ i ], scoreObj.replaceArray );
	return score;
};

/**
 * Formats the resulttexts with variables. Uses a value, source, sourceObj or scoreObj for the
 * replacement source replaces the position from the replaceArray with the replacement source.
 * @param scoreObj
 * @param replaceArray
 * @returns formatted resultText
 */
YoastSEO.AnalyzeScorer.prototype.scoreTextFormat = function( scoreObj, replaceArray ) {
	var replaceWord;
	var resultText = scoreObj.text;
	resultText = this.refObj.stringHelper.escapeHTML( resultText );
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
						this.refObj.stringHelper.escapeHTML( this[ replaceArray[ i ].source ] )
					);
					break;
				case ( typeof replaceArray[ i ].sourceObj !== "undefined" ):

					// gets the replaceword (which is a reference to an object in the analyzer) and
					// replaces is on the given position
					replaceWord = this.parseReplaceWord( replaceArray[ i ].sourceObj );
					if ( typeof replaceArray[ i ].rawOutput === "undefined" || replaceArray[ i ].rawOutput !== true ) {
						replaceWord = this.refObj.stringHelper.escapeHTML( replaceWord );
					}

					resultText = resultText.replace( replaceArray[ i ].position, replaceWord );
					break;
				case ( typeof replaceArray[ i ].scoreObj !== "undefined" ):

					// gets the replaceword from the scoreObject, to use values from the score in
					// the textString.
					resultText = resultText.replace(
						replaceArray[ i ].position,
						this.refObj.stringHelper.escapeHTML( scoreObj[ replaceArray[ i ].scoreObj ] )
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
YoastSEO.AnalyzeScorer.prototype.parseReplaceWord = function( replaceWord ) {
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
YoastSEO.AnalyzeScorer.prototype.totalScore = function() {
	var scoreAmount = this.__score.length;
	var totalScore = 0;
	for ( var i = 0; i < this.__score.length; i++ ) {
		if ( typeof this.__score[ i ] !== "undefined" && this.__score[ i ].text !== "" ) {
			totalScore += this.__score[ i ].score;
		} else {
			scoreAmount--;
		}
	}
	var totalAmount = scoreAmount * YoastSEO.analyzerScoreRating;
	return Math.round( ( totalScore / totalAmount ) * 100 );
};

/**
 * Returns total score as calculated.
 *
 * @returns {number}
 */
YoastSEO.AnalyzeScorer.prototype.getTotalScore = function() {
	return this.__totalScore;
};

/**
 * Adds a custom scoring to the analyzer scoring
 *
 * @param {Object} scoring
 * @param {string} scoring.name
 * @param {Object} scoring.scoring
 */
YoastSEO.AnalyzeScorer.prototype.addScoring = function( scoring ) {
	var scoringObject = scoring.scoring;

	scoringObject.scoreName = scoring.name;

	this.scoring.push( scoringObject );
};

module.exports = YoastSEO.AnalyzeScorer;
;/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * This should return an object with the given properties
 *
 * @callback YoastSEO.App~getData
 * @returns {Object} data
 * @returns {String} data.keyword The keyword that should be used
 * @returns {String} data.meta
 * @returns {String} data.text The text to analyze
 * @returns {String} data.pageTitle The text in the HTML title tag
 * @returns {String} data.title The title to analyze
 * @returns {String} data.url The URL for the given page
 * @returns {String} data.excerpt Excerpt for the pages
 */

/**
 * @callback YoastSEO.App~getAnalyzerInput
 *
 * @returns {Array} An array containing the analyzer queue
 */

/**
 * @callback YoastSEO.App~bindElementEvents
 *
 * @param {YoastSEO.App} app A reference to the YoastSEO.App from where this is called.
 */

/**
 * @callback YoastSEO.App~updateSnippetValues
 *
 * @param {Object} ev The event emitted from the DOM
 */

/**
 * @callback YoastSEO.App~saveScores
 *
 * @param {int} overalScore The overal score as determined by the analyzer.
 */

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 *
 * @param {Object} args
 * @param {Object} args.translations Jed compatible translations.
 * @param {Object} args.targets Targets to retrieve or set on.
 * @param {String} args.targets.snippet ID for the snippet preview element.
 * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
 * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the
 *        analyzer output.
 * @param {boolean} args.dynamicDelay Whether to enable dynamic delay, will ignore type delay if the
 *        analyzer takes a long time. Applicable on slow devices.
 * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
 * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when
 *        dynamic delay is enabled.
 * @param {Object} args.callbacks The callbacks that the app requires.
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input
 *        for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to
 *        the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the
 *        snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been
 *        determined by the analyzer.
 *
 *
 * @constructor
 */
YoastSEO.App = function( args ) {
	this.config = this.extendConfig( args );
	this.callbacks = this.config.callbacks;

	this.i18n = this.constructI18n( this.config.translations );
	this.stringHelper = new YoastSEO.StringHelper();
	this.pluggable = new YoastSEO.Pluggable( this );

	this.getData();

	this.showLoadingDialog();
	this.createSnippetPreview();
	this.runAnalyzer();
};

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
YoastSEO.App.defaultConfig = {
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "This is an example title - edit by clicking here",
		keyword: "Choose a focus keyword",
		meta: "Modify your meta description by editing it right here",
		text: "Start writing your text!"
	}
};

/**
 * Extend the config with defaults.
 *
 * @param {Object} args
 * @returns {Object} args
 */
YoastSEO.App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.queue = args.queue || YoastSEO.analyzerConfig.queue;

	return args;
};

/**
 * Extend sample text config with defaults.
 *
 * @param {Object} sampleText
 * @returns {Object} sampleText
 */
YoastSEO.App.prototype.extendSampleText = function( sampleText ) {
	var defaultSampleText = YoastSEO.App.defaultConfig.sampleText;

	if ( sampleText === undefined ) {
		sampleText = defaultSampleText;
	} else {
		for ( var key in sampleText ) {
			if ( sampleText[ key ] === undefined ) {
				sampleText[ key ] = defaultSampleText[ key ];
			}
		}
	}

	return sampleText;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations
 */
YoastSEO.App.prototype.constructI18n = function( translations ) {

	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};

	// Use default object to prevent Jed from erroring out.
	translations = translations || defaultTranslations;

	return new YoastSEO.Jed( translations );
};

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 */
YoastSEO.App.prototype.getData = function() {
	this.rawData = this.callbacks.getData();
	if ( this.pluggable.loaded ) {
		this.rawData.pageTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.pageTitle );
		this.rawData.meta = this.pluggable._applyModifications( "data_meta_desc", this.rawData.meta );
	}
};

/**
 * Refreshes the analyzer and output of the analyzer
 */
YoastSEO.App.prototype.refresh = function() {
	this.getData();
	this.runAnalyzer();
};

/**
 * creates the elements for the snippetPreview
 */
YoastSEO.App.prototype.createSnippetPreview = function() {
	var targetElement = document.getElementById( this.config.targets.snippet );
	var div = document.createElement( "div" );
	div.id = "snippet_preview";
	targetElement.appendChild( div );
	this.createSnippetPreviewTitle( div );
	this.createSnippetPreviewUrl( div );
	this.createSnippetPreviewMeta( div );
	this.snippetPreview = new YoastSEO.SnippetPreview( this );
	this.bindEvent();
	this.bindSnippetEvents();
};

/**
 * creates the title elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewTitle = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "title_container";
	target.appendChild( elem );
	var title;
	title = document.createElement( "span" );
	title.contentEditable = true;
	title.textContent = this.config.sampleText.title;
	title.className = "title";
	title.id = "snippet_title";
	elem.appendChild( title );
	var sitename;
	sitename = document.createElement( "span" );
	sitename.className = "title";
	sitename.id = "snippet_sitename";
	elem.appendChild( sitename );
};

/**
 * creates the URL elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewUrl = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "url_container";
	target.appendChild( elem );
	var baseUrl = document.createElement( "cite" );
	baseUrl.className = "url urlBase";
	baseUrl.id = "snippet_citeBase";
	baseUrl.textContent = this.config.sampleText.baseUrl;
	elem.appendChild( baseUrl );
	var cite = document.createElement( "cite" );
	cite.className = "url";
	cite.id = "snippet_cite";
	cite.textContent = this.config.sampleText.snippetCite;
	cite.contentEditable = true;
	elem.appendChild( cite );
};

/**
 * creates the meta description elements in the snippetPreview and appends to target
 *
 * @param {HTMLElement} target The HTML element for the snippet preview
 */
YoastSEO.App.prototype.createSnippetPreviewMeta = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "meta_container";
	target.appendChild( elem );
	var meta = document.createElement( "span" );
	meta.className = "desc";
	meta.id = "snippet_meta";
	meta.contentEditable = true;
	meta.textContent = this.config.sampleText.meta;
	elem.appendChild( meta );
};

/**
 * Creates an edit icon in a element with a certain ID
 *
 * @param {HTMLElement} elem The element to append the edit icon to.
 * @param {String} id The ID to give this edit icon.
 */
YoastSEO.App.prototype.createEditIcon = function( elem, id ) {
	var div = document.createElement( "div" );
	div.className = "editIcon";
	div.id = "editIcon_" + id;
	elem.appendChild( div );

};

/**
 * binds the events to the generated inputs. Binds events on the snippetinputs if editable
 */
YoastSEO.App.prototype.bindEvent = function() {
	this.callbacks.bindElementEvents( this );
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO.App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.analyzeTimer.bind( this ) );
	}
};

/**
 * binds the reloadSnippetText function to the blur of the snippet inputs.
 */
YoastSEO.App.prototype.bindSnippetEvents = function() {
	var elems = [ "meta", "cite", "title" ];
	for ( var i = 0; i < elems.length; i++ ) {
		var targetElement = document.getElementById( "snippet_" + elems[ i ] );
		targetElement.addEventListener( "blur", this.callbacks.updateSnippetValues );
	}
};

/**
 * runs the rerender function of the snippetPreview if that object is defined.
 */
YoastSEO.App.prototype.reloadSnippetText = function() {
	if ( typeof this.snippetPreview !== "undefined" ) {
		this.snippetPreview.reRender();
	}
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 */
YoastSEO.App.prototype.analyzeTimer = function() {
	clearTimeout( window.timer );
	window.timer = setTimeout( this.refresh.bind( this ), this.config.typeDelay );
};

/**
 * sets the startTime timestamp
 */
YoastSEO.App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
YoastSEO.App.prototype.endTime = function() {
	this.endTimestamp = new Date().getTime();
	if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
		if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
			this.config.typeDelay += this.config.typeDelayStep;
		}
	}
};

/**
 * inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter
 * to format outputs.
 */
YoastSEO.App.prototype.runAnalyzer = function() {
	if ( this.pluggable.loaded === false ) {
		return;
	}

	if ( this.config.dynamicDelay ) {
		this.startTime();
	}

	this.analyzerData = this.modifyData( this.rawData );
	this.analyzerData.i18n = this.i18n;

	var keyword = this.stringHelper.sanitizeKeyword( this.rawData.keyword );
	if ( keyword === "" ) {
		this.analyzerData.queue = [ "keyphraseSizeCheck", "wordCount", "fleschReading", "pageTitleLength", "urlStopwords", "metaDescriptionLength" ];
	}

	this.analyzerData.keyword = keyword;

	if ( typeof this.pageAnalyzer === "undefined" ) {
		this.pageAnalyzer = new YoastSEO.Analyzer( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	} else {
		this.pageAnalyzer.init( this.analyzerData );

		this.pluggable._addPluginTests( this.pageAnalyzer );
	}

	this.pageAnalyzer.runQueue();
	this.scoreFormatter = new YoastSEO.ScoreFormatter( {
		scores: this.pageAnalyzer.analyzeScorer.__score,
		overallScore: this.pageAnalyzer.analyzeScorer.__totalScore,
		outputTarget: this.config.targets.output,
		overallTarget: this.config.targets.overall,
		keyword: this.rawData.keyword,
		saveScores: this.callbacks.saveScores,
		i18n: this.i18n
	} );
	this.scoreFormatter.renderScore();

	if ( this.config.dynamicDelay ) {
		this.endTime();
	}

	this.snippetPreview.reRender();
};

/**
 * Modifies the data with plugins before it is sent to the analyzer.
 * @param data
 * @returns {*}
 */
YoastSEO.App.prototype.modifyData = function( data ) {

	// Copy rawdata to lose object reference.
	data = JSON.parse( JSON.stringify( data ) );

	data.text = this.pluggable._applyModifications( "content", data.text );
	data.title = this.pluggable._applyModifications( "title", data.title );

	return data;
};

/**
 * Function to fire the analyzer when all plugins are loaded, removes the loading dialog.
 */
YoastSEO.App.prototype.pluginsLoaded = function() {
	this.getData();
	this.removeLoadingDialog();
	this.runAnalyzer();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 */
YoastSEO.App.prototype.showLoadingDialog = function() {
	var dialogDiv = document.createElement( "div" );
	dialogDiv.className = "YoastSEO_msg";
	dialogDiv.id = "YoastSEO-plugin-loading";
	document.getElementById( this.config.targets.output ).appendChild( dialogDiv );
};

/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading
 * @param plugins
 */
YoastSEO.App.prototype.updateLoadingDialog = function( plugins ) {
	var dialog = document.getElementById( "YoastSEO-plugin-loading" );
	dialog.textContent = "";
	for ( var plugin in this.pluggable.plugins ) {
		dialog.innerHTML += "<span class=left>" + plugin + "</span><span class=right " +
							plugins[ plugin ].status + ">" + plugins[ plugin ].status + "</span><br />";
	}
	dialog.innerHTML += "<span class=bufferbar></span>";
};

/**
 * removes the pluging load dialog.
 */
YoastSEO.App.prototype.removeLoadingDialog = function() {
	document.getElementById( this.config.targets.output ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
};
;/* global console: true */
/* global setTimeout: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
 *
 * A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications.
 * In order to do so, it must first register itself as a plugin with YoastSEO.js. To keep our content analysis fast, we
 * don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify
 * the content. If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once
 * preloaded.
 *
 * To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically
 * fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded
 * by calling `reloaded`.
 *
 * @todo: add list of supported modifications and compare on registration of modification
 *
 * @constructor
 * @property preloadThreshold	{number} The maximum time plugins are allowed to preload before we load our content analysis.
 * @property plugins			{object} The plugins that have been registered.
 * @property modifications 		{object} The modifications that have been registered. Every modification contains an array with callables.
 * @property customTests        {Array} All tests added by plugins.
 */
YoastSEO.Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

	// Allow plugins 1500 ms to register before we start polling their
	setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
};

/**************** PUBLIC DSL ****************/

/**
 * Delegates to `YoastSEO.app.pluggable.registerPlugin`
 *
 * @param pluginName	{string}
 * @param options 		{{status: "ready"|"loading"}}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.registerPlugin = function( pluginName, options ) {
	return this.pluggable._registerPlugin( pluginName, options );
};

/**
 * Delegates to `YoastSEO.app.pluggable.ready`
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.pluginReady = function( pluginName ) {
	return this.pluggable._ready( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.reloaded`
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.pluginReloaded = function( pluginName ) {
	return this.pluggable._reloaded( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.registerModification`
 *
 * @param modification 	{string} 	The name of the filter
 * @param callable 		{function} 	The callable
 * @param pluginName 	{string} 	The plugin that is registering the modification.
 * @param priority 		{number} 	(optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									Lower numbers correspond with earlier execution.
 * @returns 			{boolean}
 */
YoastSEO.App.prototype.registerModification = function( modification, callable, pluginName, priority ) {
	return this.pluggable._registerModification( modification, callable, pluginName, priority );
};

/**
 * Registers a custom test for use in the analyzer, this will result in a new line in the analyzer results. The function
 * has to return a result based on the contents of the page/posts.
 *
 * The scoring object is a special object with definitions about how to translate a result from your analysis function
 * to a SEO score.
 *
 * Negative scores result in a red circle
 * Scores 1, 2, 3, 4 and 5 result in a orange circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a red circle
 *
 * @param {string}   name       Name of the test.
 * @param {function} analysis   A function that analyzes the content and determines a score for a certain trait.
 * @param {Object}   scoring    A scoring object that defines how the analysis translates to a certain SEO score.
 * @param {string}   pluginName The plugin that is registering the test.
 * @param {number}   priority   (optional) Determines when this test is run in the analyzer queue. Is currently ignored,
 *                              tests are added to the end of the queue.
 * @returns {boolean}
 */
YoastSEO.App.prototype.registerTest = function( name, analysis, scoring, pluginName, priority ) {
	return this.pluggable._registerTest( name, analysis, scoring, pluginName, priority );
};

/**************** DSL IMPLEMENTATION ****************/

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param pluginName	{string}
 * @param options 		{{status: "ready"|"loading"}}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( typeof options !== "undefined" && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a string." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[pluginName] = options;
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( this.plugins[pluginName] === undefined ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[pluginName].status = "ready";
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( this.plugins[pluginName] === undefined ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.app.runAnalyzer();
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param modification 	{string} 	The name of the filter
 * @param callable 		{function} 	The callable
 * @param pluginName 	{string} 	The plugin that is registering the modification.
 * @param priority 		{number} 	(optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									Lower numbers correspond with earlier execution.
 * @returns 			{boolean}
 */
YoastSEO.Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

	var callableObject = {
		callable: callable,
		origin: pluginName,
		priority: prio
	};

	// Make sure modification is defined on modifications object
	if ( this.modifications[modification] === undefined ) {
		this.modifications[modification] = [];
	}

	this.modifications[modification].push( callableObject );

	return true;
};

/**
 * @private
 */
YoastSEO.Pluggable.prototype._registerTest = function( name, analysis, scoring, pluginName, priority ) {
	if ( typeof name !== "string" ) {
		console.error( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
		return false;
	}

	if ( typeof analysis !== "function" ) {
		console.error( "Failed to register test for plugin " + pluginName + ". Expected parameter `analyzer` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register test for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register test for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ? priority : 10;

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	this.customTests.push( {
		"name": name,
		"analysis": analysis,
		"scoring": scoring,
		"prio": prio
	} );

	return true;
};

/**************** PRIVATE HANDLERS ****************/

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param pollTime {number} (optional) The accumulated time to compare with the pre-load threshold.
 * @private
 */
YoastSEO.Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = pollTime === undefined ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._allReady = function() {
	for ( var plugin in this.plugins ) {
		if ( this.plugins[plugin].status !== "ready" ) {
			return false;
		}
	}
	return true;
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @private
 */
YoastSEO.Pluggable.prototype._pollTimeExceeded = function() {
	for ( var plugin in this.plugins ) {
		if ( this.plugins[plugin].options !== undefined && this.plugins[plugin].options.status !== "ready" ) {
			console.error( "Error: Plugin " + plugin + ". did not finish loading in time." );
			delete this.plugins[plugin];
		}
	}
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param modification	{string}	The name of the filter
 * @param data 			{*} 		The data to filter
 * @param context 		{*} 		(optional) Object for passing context parameters to the callable.
 * @returns 			{*} 		The filtered data
 * @private
 */
YoastSEO.Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[modification];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		for ( var callableObject in callChain ) {
			var callable = callChain[callableObject].callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callChain[callableObject].origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		}
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @private
 */
YoastSEO.Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer
 * @param {Object}            pluginTest
 * @param {string}            pluginTest.name
 * @param {function}          pluginTest.callable
 * @param {Object}            pluginTest.scoring
 * @private
 */
YoastSEO.Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param callChain		{Array}
 * @returns callChain 	{Array}
 * @private
 */
YoastSEO.Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	for ( var callableObject in callChain ) {
		if ( this._validateOrigin( callChain[callableObject].origin ) === false ) {
			delete callChain[callableObject];
		}
	}

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[pluginName].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param pluginName	{string}
 * @returns 			{boolean}
 * @private
 */
YoastSEO.Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( this.plugins[pluginName] !== undefined ) {
		return false;
	}
	return true;
};
;/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * YoastSEO.PreProcessor object definition. Creates __store object and calls init.
 * @params textString
 */
YoastSEO.PreProcessor = function( text ) {

	//create __store object to store data
	this.__store = {};
	this.__store.originalText = text;
	this.stringHelper = YoastSEO.getStringHelper();
	this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
YoastSEO.PreProcessor.prototype.init = function() {

	//call function to clean text
	this.textFormat();

	//call function to count words
	this.countStore();
};

/**
 * formats the original text from __store and save as cleantext, cleantextSomeTags en
 * cleanTextNoTags
 */
YoastSEO.PreProcessor.prototype.textFormat = function() {
	this.__store.cleanText = this.cleanText( this.__store.originalText );
	this.__store.cleanTextSomeTags = this.stringHelper.stripSomeTags( this.__store.cleanText );
	this.__store.cleanTextNoTags = this.stringHelper.stripAllTags( this.__store.cleanTextSomeTags );
	this.__store.cleanTextNoDigits = this.stringHelper.stripNumbers( this.__store.cleanTextNoTags );
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the __store
 * saves sentencecount and syllable count in __store
 * object
 */
YoastSEO.PreProcessor.prototype.countStore = function() {

	/*wordcounters*/
	var wordcountString = this.__store.cleanText;

	this.__store.wordcount = wordcountString === "" ?
		0 :
		wordcountString.split( /\s/g ).length;

	var wordcountStringNoTags = this.__store.cleanTextNoTags;

	this.__store.wordcountNoTags = wordcountStringNoTags === "" ?
		0 :
		wordcountStringNoTags.split( /\s/g ).length;

	var wordcountStringNoDigits = this.__store.cleanTextNoDigits;

	this.__store.wordcountNoDigits = wordcountStringNoDigits === "" ?
		0 :
		wordcountStringNoDigits.split ( /\s/g ).length;

	/*sentencecounters*/
	this.__store.sentenceCountNoTags = this.sentenceCount( this.__store.cleanTextNoDigits );

	/*syllablecounters*/
	this.__store.syllablecount = this.syllableCount( this.__store.cleanTextNoDigits );
};

/**
 * counts the number of sentences in a textstring by splitting on a period. Removes sentences that
 * are empty or have only a space.
 * @param textString
 */
YoastSEO.PreProcessor.prototype.sentenceCount = function( textString ) {
	var sentences = textString.split( "." );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
YoastSEO.PreProcessor.prototype.syllableCount = function( textString ) {
	this.syllableCount = 0;
	textString = textString.replace( /[.]/g, " " );
	textString = this.removeWords( textString );
	var words = textString.split( " " );
	var subtractSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.subtractSyllables,
		true
	);
	var addSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.addSyllables,
		true
	);
	for ( var i = 0; i < words.length; i++ ) {
		this.basicSyllableCount( words[ i ].split( /[^aeiouy]/g ) );
		this.advancedSyllableCount( words[ i ], subtractSyllablesRegexp, "subtract" );
		this.advancedSyllableCount( words[ i ], addSyllablesRegexp, "add" );
	}
	return this.syllableCount;
};

/**
 * counts the syllables by splitting on consonants
 * @param splitWordArray
 */

YoastSEO.PreProcessor.prototype.basicSyllableCount = function( splitWordArray ) {
	for ( var j = 0; j < splitWordArray.length; j++ ) {
		if ( splitWordArray[ j ].length > 0 ) {
			this.syllableCount++;
		}
	}
};

/**
 * counts the syllables by validating against regexxes, and adding and subtracting the number of
 * matches.
 * @param inputString
 * @param regex
 * @param operator
 */
YoastSEO.PreProcessor.prototype.advancedSyllableCount = function( inputString, regex, operator ) {
	var match = inputString.match( regex );
	if ( match !== null ) {
		if ( operator === "subtract" ) {
			this.syllableCount -= match.length;
		} else if ( operator === "add" ) {
			this.syllableCount += match.length;
		}
	}
};

/**
 * removes words from textstring and count syllables. Used for words that fail against regexes.
 * @param textString
 * @returns textString with exclusionwords removed
 */
YoastSEO.PreProcessor.prototype.removeWords = function( textString ) {
	var config = YoastSEO.preprocessorConfig;

	for ( var i = 0; i < config.syllables.exclusionWords.length; i++ ) {
		var exclusionRegex = new RegExp(
			config.syllables.exclusionWords[ i ].word,
			"g"
		);
		var matches = textString.match( exclusionRegex );
		if ( matches !== null ) {
			this.syllableCount += config.syllables.exclusionWords[ i ].syllables;
			textString = textString.replace( exclusionRegex, "" );
		}
	}
	return textString;
};

/**
 * cleans text by removing special characters, numberonly words and replacing all terminators by
 * periods
 * @param textString
 * @returns textString
 */
YoastSEO.PreProcessor.prototype.cleanText = function( textString ) {
	if ( textString !== "" ) {
		textString = this.replaceDiacritics( textString );
		textString = textString.toLocaleLowerCase();

		// Remove some HTML entities as first action
		textString = textString.replace( "&nbsp;", " " );

		// replace comma', hyphens etc with spaces
		textString = textString.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

		// remove apostrophe
		textString = textString.replace( /[\’]/g, "" );

		// unify all terminators
		textString = textString.replace( /[.?!]/g, "." );

		// Remove double spaces
		textString = this.stringHelper.stripSpaces( textString );

		// add period in case it is missing
		textString += ".";

		// replace newlines with spaces
		textString = textString.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

		// remove duplicate terminators
		textString = textString.replace( /([\.])[\. ]+/g, "$1" );

		// pad sentence terminators
		textString = textString.replace( /[ ]*([\.])+/g, "$1 " );

		// Remove double spaces
		textString = this.stringHelper.stripSpaces( textString );

		if ( textString === "." ) {
			textString = "";
		}
	}
	return textString;
};

/**
 * replaces all diacritics with standard characters following the diacritics removal map from the
 * config.
 * @param textString
 * @returns textString
 */
YoastSEO.PreProcessor.prototype.replaceDiacritics = function( textString ) {
	var config = YoastSEO.preprocessorConfig;

	for ( var i = 0; i < config.diacriticsRemovalMap.length; i++ ) {
		textString = textString.replace(
			config.diacriticsRemovalMap[ i ].letters,
			config.diacriticsRemovalMap[ i ].base
		);
	}
	return textString;
};

/**
 * Checks if the preprocessor is already initialized and if so if the textstring differs from the
 * input.
 *
 * @param inputString
 * @returns {YoastSEO.PreProcessor}
 */
YoastSEO.getPreProcessor = function( inputString ) {
	if (
		typeof YoastSEO.cachedPreProcessor !== "object" ||
		YoastSEO.cachedPreProcessor.inputText !== inputString
	) {
		YoastSEO.cachedPreProcessor = new YoastSEO.PreProcessor( inputString );
	}
	return YoastSEO.cachedPreProcessor;
};
;/* jshint browser: true */
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
	this.outputScore();
	this.outputOverallScore();
};

/**
 * creates the list for showing the results from the analyzerscorer
 */
YoastSEO.ScoreFormatter.prototype.outputScore = function() {
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

			seoScoreText = this.getSEOScoreText( scoreRating );

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
		overallTarget.className = "overallScore " + this.overallScoreRating( Math.round( this.overallScore ) );
		if ( this.keyword === "" ) {
			overallTarget.className = "overallScore " + this.overallScoreRating( "na" );
		}
	}

	this.saveScores( this.overallScore );
};

/**
 * Retuns a string that is used as a CSSclass, based on the numeric score or the NA string.
 * @param {number|string} score
 * @returns {string} scoreRate
 */
YoastSEO.ScoreFormatter.prototype.scoreRating = function( score ) {
	var scoreRate;
	switch ( true ) {
		case score <= 4:
			scoreRate = "bad";
			break;
		case score > 4 && score <= 7:
			scoreRate = "ok";
			break;
		case score > 7:
			scoreRate = "good";
			break;
		default:
		case score === "na":
			scoreRate = "na";
			break;
	}
	return scoreRate;
};

/**
 * Divides the total score by ten and calls the scoreRating function.
 * @param {number|string} score
 * @returns {string} scoreRate
 */
YoastSEO.ScoreFormatter.prototype.overallScoreRating = function( score ) {
	if ( typeof score === "number" ) {
		score = ( score / 10 );
	}
	return this.scoreRating( score );
};

/**
 * Returns a translated score description based on the textual score rating
 *
 * @param {string} scoreRating Textual score rating, can be retrieved with scoreRating from the actual score.
 *
 * @return {string}
 */
YoastSEO.ScoreFormatter.prototype.getSEOScoreText = function( scoreRating ) {
	var scoreText = "";

	switch ( scoreRating ) {
		case "na":
			scoreText = this.i18n.dgettext( "js-text-analysis", "No keyword" );
			break;

		case "bad":
			scoreText = this.i18n.dgettext( "js-text-analysis", "Bad SEO score" );
			break;

		case "ok":
			scoreText = this.i18n.dgettext( "js-text-analysis", "Ok SEO score" );
			break;

		case "good":
			scoreText = this.i18n.dgettext( "js-text-analysis", "Good SEO score" );
			break;
	}

	return scoreText;
};
;/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * snippetpreview
 */

/**
 * defines the config and outputTarget for the YoastSEO.SnippetPreview
 *
 * @param {YoastSEO.App} refObj
 *
 * @constructor
 */
YoastSEO.SnippetPreview = function( refObj ) {
	this.refObj = refObj;
	this.unformattedText = {
		snippet_cite: this.refObj.rawData.snippetCite || "",
		snippet_meta: this.refObj.rawData.snippetMeta || "",
		snippet_title: this.refObj.rawData.snippetTitle || ""
	};
	this.init();
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
YoastSEO.SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.pageTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.output = this.htmlOutput();
		this.renderOutput();
		this.renderSnippetStyle();
	}
};

/**
 * creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object}
 */
YoastSEO.SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 *
 * @returns {String}
 */
YoastSEO.SnippetPreview.prototype.formatTitle = function() {
	var title = this.refObj.rawData.pageTitle;

	if ( title === "" || typeof title === "undefined" ) {
		title = this.refObj.config.sampleText.title;
	}
	title = this.refObj.stringHelper.stripAllTags( title );
	if ( this.refObj.rawData.keyword !== "" ) {
		return this.formatKeyword( title );
	}
	return title;
};

/**
 * removes the protocol name from the urlstring.
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatUrl = function() {
	var url = this.refObj.rawData.baseUrl;

	//removes the http(s) part of the url
	return url.replace( /https?:\/\//ig, "" );
};

/**
 * formats the url for the snippet preview
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatCite = function() {
	var cite = this.refObj.rawData.snippetCite;
	cite = this.refObj.stringHelper.stripAllTags( cite );
	if ( cite === "" ) {
		cite = this.refObj.config.sampleText.snippetCite;
	}
	return this.formatKeywordUrl( cite );
};

/**
 * formats the metatext for the snippet preview, if empty runs getMetaText
 * @returns formatted metatext
 */
YoastSEO.SnippetPreview.prototype.formatMeta = function() {
	var meta = this.refObj.rawData.meta;
	if ( meta === this.refObj.config.sampleText.snippetMeta ) {
		meta = "";
	}
	if ( meta === "" ) {
		meta = this.getMetaText();
	}
	meta = this.refObj.stringHelper.stripAllTags( meta );
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );
	if ( this.refObj.rawData.keyword !== "" && meta !== "" ) {
		return this.formatKeyword( meta );
	}
	return meta;
};

/**
 * formats the metatext, based on the keyword to select a part of the text.
 * If no keyword matches, takes the first 156chars (depending on the config).
 * If keyword and/or text is empty, it uses the sampletext.
 * @returns metatext
 */
YoastSEO.SnippetPreview.prototype.getMetaText = function() {
	var metaText;
	if ( typeof this.refObj.rawData.excerpt !== "undefined" ) {
		metaText = this.refObj.rawData.excerpt;
	}
	if ( typeof this.refObj.rawData.text !== "undefined" ) {
		metaText = this.refObj.rawData.text;
	}
	if ( metaText === "" ) {
		metaText = this.refObj.config.sampleText.meta;
	}
	metaText = this.refObj.stringHelper.stripAllTags( metaText );
	if (
		this.refObj.rawData.keyword !== "" &&
		this.refObj.rawData.text !== ""
	) {
		var indexMatches = this.getIndexMatches();
		var periodMatches = this.getPeriodMatches();
		metaText = metaText.substring(
			0,
			YoastSEO.analyzerConfig.maxMeta
		);
		var curStart = 0;
		if ( indexMatches.length > 0 ) {
			for ( var j = 0; j < periodMatches.length; ) {
				if ( periodMatches[ 0 ] < indexMatches[ 0 ] ) {
					curStart = periodMatches.shift();
				} else {
					if ( curStart > 0 ) {
						curStart += 2;
					}
					break;
				}
			}
		}
	}
	if ( this.refObj.stringHelper.stripAllTags( metaText ) === "" ) {
		return this.refObj.config.sampleText.meta;
	}
	return metaText.substring( 0, YoastSEO.analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
YoastSEO.SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	//starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	//runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		//pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns array with sentences
 */
YoastSEO.SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.rawData.text.indexOf( ".", i ) ) > -1 ) {
		periodMatches.push( match );
		i = match + 1;
	}
	return periodMatches;
};

/**
 * formats the keyword for use in the snippetPreview by adding <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results
 * @param textString
 * @returns textString
 */
YoastSEO.SnippetPreview.prototype.formatKeyword = function( textString ) {

	// removes characters from the keyword that could break the regex, or give unwanted results
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, " " );

	// Match keyword case-insensitively
	var keywordRegex = new RegExp( "\\b" + keyword + "\\b", "ig" );
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results
 *
 * @param textString
 * @returns {XML|string|void}
 */
YoastSEO.SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = this.refObj.stringHelper.sanitizeKeyword( this.refObj.rawData.keyword );
	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = new RegExp( "\\b" + dashedKeyword + "\\b", "ig" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
YoastSEO.SnippetPreview.prototype.renderOutput = function() {
	document.getElementById( "snippet_title" ).innerHTML = this.output.title;
	document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
	document.getElementById( "snippet_citeBase" ).innerHTML = this.output.url;
	document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * Sets the classname of the meta field in the snippet, based on the rawData.snippetMeta
 */
YoastSEO.SnippetPreview.prototype.renderSnippetStyle = function() {
	var cssClass = "desc-default";
	if ( this.refObj.rawData.meta === "" ) {
		cssClass = "desc-render";
	}
	document.getElementById( "snippet_meta" ).className = "desc " + cssClass;
};

/**
 * function to call init, to rerender the snippetpreview
 */
YoastSEO.SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.disableEnter = function( ev ) {
	if ( ev.keyCode === 13 ) {
		ev.returnValue = false;
		ev.cancelBubble = true;
		ev.preventDefault();
	}
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.checkTextLength = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			ev.currentTarget.className = "desc";
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring(
					0,
					YoastSEO.analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			ev.currentTarget.className = "title";
			if ( text.length > 70 ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring( 0, 70 );
			}
			break;
		default:
			break;
	}
};

/**
 * when clicked on an element in the snippet, checks fills the textContent with the data from the unformatted text.
 * This removes the keyword highlighting and modified data so the original content can be editted.
 * @param ev {event}
 */
YoastSEO.SnippetPreview.prototype.getUnformattedText = function( ev ) {
	var currentElement = ev.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		ev.currentTarget.textContent = this.unformattedText[currentElement];
	}
};

/**
 * when text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.setUnformattedText = function( ev ) {
	var elem =  ev.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Adds and remove the tooLong class when a text is too long.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.textFeedback = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				ev.currentTarget.className = "desc tooLong";
			} else {
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if ( text.length > 70 ) {
				ev.currentTarget.className = "title tooLong";
			} else {
				ev.currentTarget.className = "title";
			}
			break;
		default:
			break;
	}
};

/**
 * shows the edit icon corresponding to the hovered element
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 */
YoastSEO.SnippetPreview.prototype.hideEditIcon = function() {
	var elems = document.getElementsByClassName( "editIcon " );
	for ( var i = 0; i < elems.length; i++ ) {
		elems[ i ].className = "snippet_container";
	}
};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.setFocus = function( ev ) {
	var targetElem = ev.currentTarget.firstChild;
	while ( targetElem !== null ) {
		if ( targetElem.contentEditable === "true" ) {
			targetElem.focus();
			this.hideEditIcon();
			break;
		} else {
			targetElem = targetElem.nextSibling;
		}
	}
};
;/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**helper functions*/
YoastSEO.StringHelper = function() {};

/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
YoastSEO.StringHelper.prototype.replaceString = function(
	textString,
	stringsToRemove,
	replacement
) {
	if ( typeof replacement === "undefined" ) {
		replacement = " ";
	}
	textString = textString.replace( this.stringToRegex( stringsToRemove ), replacement );
	return this.stripSpaces( textString );
};

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
YoastSEO.StringHelper.prototype.matchString = function( textString, stringsToMatch ) {
	return textString.match( this.stringToRegex( stringsToMatch, false ) );
};

/**
 * checks if the match on textStrings is not null. If it has matches returns the length.
 * Otherwise it returns 0 (no matches).
 * @param textString
 * @param regex
 * @returns {number}
 */
YoastSEO.StringHelper.prototype.countMatches = function( textString, regex ) {
	return textString.match( regex ) !== null ? textString.match.length : 0;
};

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
YoastSEO.StringHelper.prototype.stringToRegex = function( stringArray, disableWordBoundary ) {
	var regexString = "";
	var wordBoundary = "\\b";
	if ( disableWordBoundary ) {
		wordBoundary = "";
	}
	for ( var i = 0; i < stringArray.length; i++ ) {
		if ( regexString.length > 0 ) {
			regexString += "|";
		}
		regexString += wordBoundary + stringArray[ i ] + wordBoundary;
	}
	return new RegExp( regexString, "g" );
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripSpaces = function( textString ) {

	//replace multiple spaces with single space
	textString = textString.replace( /\s{2,}/g, " " );

	//replace spaces followed by periods with only the period.
	textString = textString.replace( /\s\./g, "." );

	//remove first/last character if space
	textString = textString.replace( /^\s+|\s+$/g, "" );
	return textString;
};

/**
 * adds escape characters to string
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.addEscapeChars = function( textString ) {
	return textString.replace( /[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&" );
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripSomeTags = function( textString ) {

	//remove tags, except li, p, h1-6, dd
	textString = textString.replace(
		/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g,
		" "
	);
	textString = this.stripSpaces( textString );
	return textString;
};

/**
 * remove all HTMLtags from input string.
 * @param textString
 * @returns textString
 */
YoastSEO.StringHelper.prototype.stripAllTags = function( textString ) {

	//remove all tags
	textString = textString.replace( /(<([^>]+)>)/ig, " " );

	//remove < and > if any are used
	textString = textString.replace( /[<>]/g, "" );
	textString = this.stripSpaces( textString );
	return textString;
};

/**
 * removes all words comprised only of numbers.
 * @param textString {String}
 * @returns {string}
 */
YoastSEO.StringHelper.prototype.stripNumbers = function( textString ) {

	// Remove "words" comprised only of numbers
	textString = textString.replace( /\b[0-9]+\b/g, "" );

	textString = this.stripSpaces( textString );

	if ( textString === "." ) {
		textString = "";
	}
	return textString;
};

/**
 * Removes all invalid characters from a certain keyword
 *
 * @param {string} keyword The un-sanitized keyword.
 * @returns {string} The sanitized keyword.
 */
YoastSEO.StringHelper.prototype.sanitizeKeyword = function( keyword ) {
	keyword = keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g, "" );

	keyword = this.stripAllTags( keyword );

	return keyword;
};

/**
 * Escapes HTML characters from strings.
 *
 * @param textString
 * @returns {string}
 */
YoastSEO.StringHelper.prototype.escapeHTML = function( textString ) {
	if ( typeof textString === "string" ) {
		textString = textString.replace( /&/g, "&amp;" )
					.replace( /</g, "&lt;" )
					.replace( />/g, "&gt;" )
					.replace( /\"/, "&quot;" )
					.replace( /\'/g, "&#39;" );
	}

	return textString;
};

/**
 * Checks if the stringhelper is already initialized. Returns stringHelper.
 *
 * @returns {YoastSEO.StringHelper}
 */
YoastSEO.getStringHelper = function() {
	if ( typeof YoastSEO.cachedStringHelper !== "object" ) {
		YoastSEO.cachedStringHelper = new YoastSEO.StringHelper();
	}
	return YoastSEO.cachedStringHelper;
};

;YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;(function() {/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton
WTFPL license for use
Dojo CLA for contributions

Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define('jed', function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);
}.call(YoastSEO));/**
 * Returns a configobject with maxSlugLength, maxURLLength and MaxMeta to be used
 * for analysis
 *
 * @returns {object} the config object
 */
module.exports = function(){
	return {
		maxSlugLength: 20,
		maxUrlLength: 40,
		maxMeta: 156
	}
};
;YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.analyzerConfig = {
	queue: [ "wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescriptionLength", "metaDescriptionKeyword", "pageTitleKeyword", "pageTitleLength", "firstParagraph", "urlStopwords", "keywordDoubles", "keyphraseSizeCheck" ],
	stopWords: [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ],
	wordsToRemove: [ " a", " in", " an", " on", " for", " the", " and" ],
	maxSlugLength: 20,
	maxUrlLength: 40,
	maxMeta: 156
};
YoastSEO.preprocessorConfig = {
	syllables: {
		subtractSyllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e\\b", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
		addSyllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]l", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]" ],
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 }
		]
	},
	diacriticsRemovalMap: [
		{
			base: "a",
			letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{ base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
		{
			base: "c",
			letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		},
		{
			base: "d",
			letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
			base: "e",
			letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
			base: "g",
			letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
		},
		{
			base: "h",
			letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
			base: "i",
			letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
			base: "k",
			letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
		},
		{
			base: "l",
			letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{ base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
		{
			base: "n",
			letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
			base: "o",
			letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{ base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
			base: "r",
			letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
		},
		{
			base: "s",
			letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
		},
		{
			base: "t",
			letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
			base: "u",
			letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		},
		{ base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
		{ base: "vy", letters: /[\uA761]/g },
		{
			base: "w",
			letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
			base: "y",
			letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
		},
		{
			base: "z",
			letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		}
	]
};
;/** @module config/diacritics */

/**
 * Returns the diacritics map
 *
 * @returns {object} diacritics map
 */
module.exports = function(){
	return [
		{
			base: "a",
			letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{ base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
		{
			base: "c",
			letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		},
		{
			base: "d",
			letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
			base: "e",
			letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
			base: "g",
			letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
		},
		{
			base: "h",
			letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
			base: "i",
			letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
			base: "k",
			letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
		},
		{
			base: "l",
			letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{ base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
		{
			base: "n",
			letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
			base: "o",
			letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{ base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
			base: "r",
			letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
		},
		{
			base: "s",
			letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
		},
		{
			base: "t",
			letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
			base: "u",
			letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		},
		{ base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
		{ base: "vy", letters: /[\uA761]/g },
		{
			base: "w",
			letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
			base: "y",
			letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
		},
		{
			base: "z",
			letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		}
	];
};
;/** @module config/removalWords */

/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */
module.exports = function(){
	return [ " a", " in", " an", " on", " for", " the", " and" ];
};
;YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

YoastSEO.analyzerScoreRating = 9;
/**
 *
 * @param {Jed} i18n
 * @constructor
 */
YoastSEO.AnalyzerScoring = function( i18n ) {
    this.analyzerScoring = [
        {
            scoreName: "wordCount",
            scoreArray: [
                {
                    min: 300,
                    score: 9,

                    /* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
                    text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is more than the %2$d word recommended minimum.")
                },
                {
                    min: 250,
                    max: 299,
                    score: 7,

                    /* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
                    text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.")
                },
                {
                    min: 200,
                    max: 249,
                    score: 5,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 100,
                    max: 199,
                    score: -10,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 0,
                    max: 99,
                    score: -20,

                    /* translators: %1$d expands to the number of words in the text */
                    text: i18n.dgettext( "js-text-analysis", "The text contains %1$d words. This is far too low and should be increased.")
                }
            ],
            replaceArray: [
                { name: "wordCount", position: "%1$d", source: "matcher" },
                { name: "recommendedWordcount", position: "%2$d", value: 300 }

            ]
        },{
			scoreName: "keyphraseSizeCheck",
			scoreArray: [
				{
					max: 0,
					score: -999,
					text: i18n.dgettext( "js-text-analysis", "No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.")
				},
				{
					min: 11,
					score: 0,
					text: i18n.dgettext( "js-text-analysis", "Your keyphrase is over 10 words, a keyphrase should be shorter.")
				}
			]
		},
        {
            scoreName: "keywordDensity",
            scoreArray: [
                {
                    min: 3.5,
                    score: -50,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is way over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 2.51,
                    max: 3.49,
                    score: -10,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 0.5,
                    max: 2.50,
                    score: 9,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is great; the focus keyword was found %2$d times.")
                },
                {
                    min: 0,
                    max: 0.49,
                    score: 4,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$f%, which is a bit low; the focus keyword was found %2$d times.")
                }
            ],
            replaceArray: [
                { name: "keywordDensity", position: "%1$f", source: "matcher" },
                { name: "keywordCount", position: "%2$d", sourceObj: ".refObj.__store.keywordCount" }
            ]
        },
        {
            scoreName: "linkCount",
            scoreArray: [
                {
                    matcher: "total",
                    min: 0,
                    max: 0,
                    score: 6,
                    text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate.")
                },
				{
					type: "internalAllDofollow",
					score: 6,
					text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate.")
				},{
					type: "noExternal",
					score: 6,
					text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate.")
				},
				{
					matcher: "totalNaKeyword",
					min: 1,
					score: 2,
					text: i18n.dgettext( "js-text-analysis", "Outbound links appear in this page")
				},
                {
                    matcher: "totalKeyword",
                    min: 1,
                    score: 2,
                    text: i18n.dgettext( "js-text-analysis", "You\'re linking to another page with the focus keyword you want this page to rank for. Consider changing that if you truly want this page to rank.")
                },

                /* translators: %2$s expands the number of outbound links */
                { type: "externalAllNofollow", score: 7, text: i18n.dgettext( "js-text-analysis", "This page has %2$s outbound link(s), all nofollowed." ) },
                {
                    type: "externalHasNofollow",
                    score: 8,

                    /* translators: %2$s expands to the number of nofollow links, %3$s to the number of outbound links */
                    text: i18n.dgettext( "js-text-analysis", "This page has %2$s nofollowed link(s) and %3$s normal outbound link(s)." )
                },

                /* translators: %1$s expands to the number of outbound links */
                { type: "externalAllDofollow", score: 9, text: i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ) }
            ],
            replaceArray: [
                { name: "links", position: "%1$s", sourceObj: ".result.externalTotal" },
                { name: "nofollow", position: "%2$s", sourceObj: ".result.externalNofollow" },
                { name: "dofollow", position: "%3$s", sourceObj: ".result.externalDofollow" }
            ]
        },
        {
            scoreName: "fleschReading",
            scoreArray: [
                { min: 90, score: 9, text: "{{text}}", resultText: "very easy", note: "" },
                { min: 80, max: 89.9, score: 9, text: "{{text}}", resultText: "easy", note: "" },
                { min: 70, max: 79.9, score: 8, text: "{{text}}", resultText: "fairly easy", note: "" },
                { min: 60, max: 69.9, score: 8, text: "{{text}}", resultText: "ok", note: "" },
                {
                    min: 50,
                    max: 59.9,
                    score: 6,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
                    note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
                },
                {
                    min: 30,
                    max: 49.9,
                    score: 5,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
                    note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
                },
                {
                    min: 0,
                    max: 29.9,
                    score: 4,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
                    note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability.")
                }
            ],
            replaceArray: [
                {
                    name: "scoreText",
                    position: "{{text}}",

                    /* translators: %1$s expands to the numeric flesh reading ease score, %2$s to a link to the wikipedia article about Flesh ease reading score, %3$s to the easyness of reading, %4$s expands to a note about the flesh reading score. */
                    value: i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s")
                },
                { name: "text", position: "%1$s", sourceObj: ".result" },
                {
                    name: "scoreUrl",
                    position: "%2$s",
                    value: "<a href='https://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease' target='new'>Flesch Reading Ease</a>"
                },
                { name: "resultText", position: "%3$s", scoreObj: "resultText" },
                { name: "note", position: "%4$s", scoreObj: "note" }
            ]
        },
        {
            scoreName: "metaDescriptionLength",
            metaMinLength: 120,
            metaMaxLength: 157,
            scoreArray: [
                {
                    max: 0,
                    score: 1,
                    text: i18n.dgettext( "js-text-analysis", "No meta description has been specified, search engines will display copy from the page instead.")
                },
                {
                    max: 120,
                    score: 6,

                    /* translators: %1$d expands to the minimum length for the meta description, %2$d to the maximum length for the meta description */
                    text: i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters, however up to %2$d characters are available.")
                },
                {
                    min: 157,
                    score: 6,

                    /* translators: %2$d expands to the maximum length for the meta description */
                    text: i18n.dgettext( "js-text-analysis", "The specified meta description is over %2$d characters. Reducing it will ensure the entire description is visible")
                },
                {
                    min: 120,
                    max: 157,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?")
                }
            ],
            replaceArray: [
                { name: "minCharacters", position: "%1$d", value: 120 },
                { name: "maxCharacters", position: "%2$d", value: 156 }
            ]
        },
        {
            scoreName: "metaDescriptionKeyword",
            scoreArray: [
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The meta description contains the focus keyword." ) },
                {
                    max: 0,
					min: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword." )
                }
            ]
        }, {
            scoreName: "firstParagraph",
            scoreArray: [
                {
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword doesn\'t appear in the first paragraph of the copy. Make sure the topic is clear immediately." )
                },
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the first paragraph of the copy." ) }
            ]
        }, {
            scoreName: "stopwordKeywordCount",
            scoreArray: [
                {
                    matcher: "count",
                    min: 1,
                    score: 5,

                    /* translators: %1$s expands to a link to the wikipedia article about stop words, %2$s expands to the actual stop words found in the text */
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword for this page contains one or more %1$s, consider removing them. Found \'%2$s\'." )
                },
                { matcher: "count", max: 0, score: 0, text: "" }
            ],
            replaceArray: [
                {
                    name: "scoreUrl",
                    position: "%1$s",
                    value: i18n.dgettext( "js-text-analysis", "<a href='https://en.wikipedia.org/wiki/Stop_words' target='new'>stop words</a>" )
                },
                { name: "stopwords", position: "%2$s", sourceObj: ".result.matches" }
            ]
        }, {
            scoreName: "subHeadings",
            scoreArray: [
                { matcher: "count", max: 0, score: 7, text: i18n.dgettext( "js-text-analysis", "No subheading tags (like an H2) appear in the copy." ) },
                {
                    matcher: "matches",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "You have not used your focus keyword in any subheading (such as an H2) in your copy." )
                },
                {
                    matcher: "matches",
                    min: 1,
                    score: 9,

                    /* translators: %1$d expands to the number of subheadings, %2$d to the number of subheadings containing the focus keyword */
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. While not a major ranking factor, this is beneficial.")
                }
            ],
            replaceArray: [
                { name: "count", position: "%1$d", sourceObj: ".result.count" },
                { name: "matches", position: "%2$d", sourceObj: ".result.matches" }
            ]
        }, {
            scoreName: "pageTitleLength",
            scoreArray: [
                {max: 0, score: 1, text: i18n.dgettext( "js-text-analysis", "Please create a page title.")},
                {
                    max: 39,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %1$d to the minimum number of characters for the title */
                    text: i18n.dgettext( "js-text-analysis", "The page title contains %3$d characters, which is less than the recommended minimum of %1$d characters. Use the space to add keyword variations or create compelling call-to-action copy.")
                },
                {
                    min: 71,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %2$d to the maximum number of characters for the title */
                    text: i18n.dgettext( "js-text-analysis", "The page title contains %3$d characters, which is more than the viewable limit of %2$d characters; some words will not be visible to users in your listing.")
                },
                {
                    min: 40,
                    max: 70,
                    score: 9,

                    /* translators: %1$d expands to the minimum number of characters in the page title, %2$d to the maximum number of characters */
                    text: i18n.dgettext( "js-text-analysis", "The page title is between the %1$d character minimum and the recommended %2$d character maximum.")
                }
            ],
            replaceArray: [
                { name: "minLength", position: "%1$d", value: 40 },
                { name: "maxLength", position: "%2$d", value: 70 },
                { name: "length", position: "%3$d", source: "matcher" }
            ]
        }, {
            scoreName: "pageTitleKeyword",
            scoreTitleKeywordLimit: 0,
            scoreArray: [
                {
                    matcher: "matches",
                    max: 0,
                    score: 2,

                    /* translators: %1$s expands to the focus keyword */
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does not appear in the page title.")
                },
                {
                    matcher: "position",
                    max: 1,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, at the beginning which is considered to improve rankings.")
                },
                {
                    matcher: "position",
                    min: 1,
                    score: 6,
                    text: i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.")
                }
            ],
            replaceArray: [
                {name: "keyword", position: "%1$s", sourceObj: ".refObj.config.keyword"}
            ]
        }, {
            scoreName: "urlKeyword",
            scoreArray: [
                { min: 1, score: 9, text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page.")},
                {
                    max: 0,
                    score: 6,
                    text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" )
                }
            ]
        }, {
            scoreName: "urlLength",
            scoreArray: [
                {type: "urlTooLong", score: 5, text: i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." ) }
            ]
        }, {
            scoreName: "urlStopwords",
            scoreArray: [
                {
                    min: 1,
                    score: 5,
					/* translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
                    text: i18n.dgettext( "js-text-analysis", "The slug for this page contains one or more %1$sstop words%2$s, consider removing them." )
                }
			],
			replaceArray: [
				{
					name: "url",
					position: "%1$s",
					/* translators: this link is referred to in the content analysis when a slug contains one or more stop words */
					value: "<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>"
				},
                {
                    name: "urlClose",
                    position: "%2$s",
                    value: "</a>"
                }
			]
        }, {
            scoreName: "imageCount",
            scoreArray: [
                {
                    matcher: "total",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext( "js-text-analysis", "No images appear in this page, consider adding some as appropriate." )
                },
                {
					matcher: "noAlt",
					min: 1,
					score: 5,
					text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt tags." )
				},
				{
					matcher: "altNaKeyword",
					min: 1,
					score: 5,
					text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt tags" )
				},
                {
                    matcher: "altKeyword",
                    min: 1,
                    score: 9,
                    text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt tags with the focus keyword." )
                },
                {
                    matcher: "alt",
                    min: 1,
                    score: 5,
                    text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt tags containing your focus keyword." )
                }
            ]
        }, {
            scoreName: "keywordDoubles",
            scoreArray: [
                {matcher: "count", max: 0, score: 9, text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ) },
                {
                    matcher: "count",
                    max: 1,
                    score: 6,

                    /* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
                    text: i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword." )
                },
                {
                    matcher: "count",
                    min: 1,
                    score: 1,

                    /* translators: %3$s and $2$s expand to the admin search page for the focus keyword, %4$d expands to the number of times this focus keyword has been used before, %5$s and %6$s expand to a link to an article on yoast.com about cornerstone content */
                    text: i18n.dgettext( "js-text-analysis", "You've used this focus keyword %3$s%4$d times before%2$s, it's probably a good idea to read %6$sthis post on cornerstone content%5$s and improve your keyword strategy." )
                }
            ],
            replaceArray: [
                { name: "singleUrl", position: "%1$s", sourceObj: ".refObj.config.postUrl", rawOutput: true },
                { name: "endTag", position: "%2$s", value: "</a>" },
                { name: "multiUrl", position: "%3$s", sourceObj: ".refObj.config.searchUrl", rawOutput: true },
                { name: "occurrences", position: "%4$d", sourceObj: ".result.count" },
                { name: "endTag", position: "%5$s", value: "</a>" },
                {
                    name: "cornerstone",
                    position: "%6$s",
                    value: "<a href='https://yoast.com/cornerstone-content-rank/' target='new'>"
                },
                { name: "id", position: "{id}", sourceObj: ".result.id" },
                { name: "keyword", position: "{keyword}", sourceObj: ".refObj.config.keyword" }
            ]
        }
    ];
};
;/** @module config/stopwords */

/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {array} stopwords The array filled with stopwords.
 */
module.exports = function(){
	return [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
};
;/** @module config/syllables */

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as wone but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
module.exports = function(){
	return {
		subtractSyllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e\\b", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
		addSyllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]l", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]" ],
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 }
		]
	};
};
