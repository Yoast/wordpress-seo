(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @module analyses/calculateFleschReading */

var cleanText = require( "../stringProcessing/cleanText.js" );
var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {string} text The text to analyze the fleschreading score for.
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( text ) {
	if ( text === "" ) {
		return 0;
	}
	text = cleanText ( text );
	text = stripHTMLTags( text );
	var wordCount = countWords( text  );

	text = stripNumbers ( text );
	var sentenceCount = countSentences( text );
	var syllableCount = countSyllables( text );
	var score = 206.835 - ( 1.015 * ( wordCount / sentenceCount ) ) - ( 84.6 * ( syllableCount / wordCount ) );

	return score.toFixed( 1 );
};

},{"../stringProcessing/cleanText.js":32,"../stringProcessing/countSentences.js":33,"../stringProcessing/countSyllables.js":34,"../stringProcessing/countWords.js":35,"../stringProcessing/stripHTMLTags.js":47,"../stringProcessing/stripNumbers.js":49}],2:[function(require,module,exports){
/** @module analyses/checkForKeywordDoubles */

/**
 * Checks the keyword in an array of used keywords. If the keyword is in this array, it will return the
 * number of times the keyword is found, and an ID if it was used once before.
 *
 * @param {string} keyword The keyword to check in the array.
 * @param {array} usedKeywords The array with used keywords and IDs.
 * @returns {object} The id of the keyword and the number of times the keyword is found
 */
module.exports = function( keyword, usedKeywords ) {
	var result = { count: 0, id: 0 };
	if ( typeof usedKeywords[ keyword ] !== "undefined" ) {
		result.count = usedKeywords[ keyword ].length;
	}
	if ( result.count === 1 ) {
		result.id = usedKeywords[ keyword ][ 0 ];
	}
	return result;
};

},{}],3:[function(require,module,exports){
/** @module analyses/checkStringForStopwords */

var stopwords = require( "../config/stopwords.js" )();
var keywordRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a textstring to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {array} An array with all stopwords found in the text.
 */
module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( keywordRegex( stopwords[i] ) ) !== null  ) {
			matches.push( stopwords[i] );
		}
	}
	return matches;
};


},{"../config/stopwords.js":23,"../stringProcessing/stringToRegex.js":46}],4:[function(require,module,exports){
/** @module analyses/checkUrlForStopwords */

var stopwords = require( "../analyses/checkStringForStopwords.js" );

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 *
 * @param {string} url The URL to check for stopwords.
 * @returns {array} stopwords found in URL
 */

module.exports = function( url ) {
	url = url.replace( /[-_]/g, " " );
	return stopwords( url );
};

},{"../analyses/checkStringForStopwords.js":3}],5:[function(require,module,exports){
/** @module analyses/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {url} url The URL to check for keyword
 * @param {string} keyword The keyword to match
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( url, keyword ) {
	keyword = keyword.replace( /\s/ig, "-" );

	return wordMatch( url, keyword );
};

},{"../stringProcessing/matchTextWithWord.js":42}],6:[function(require,module,exports){
/** @module analyses/findKeywordInFirstParagraph */

var regexMatch = require( "../stringProcessing/matchStringWithRegex.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {string} text The text to check for paragraphs.
 * @param {string} keyword The keyword to match in paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( text, keyword ) {
	var paragraph;

	//matches everything between the <p> and </p> tags.
	paragraph = regexMatch( text, "<p(?:[^>]+)?>(.*?)<\/p>" );
	if ( paragraph.length > 0 ) {
		return wordMatch( paragraph[0], keyword );
	}

	/* if no <p> tags found, use a regex that matches [^], not nothing, so any character,
	including linebreaks untill it finds double linebreaks.
	*/
	paragraph = regexMatch( text, "[^]*?\n\n" );
	if ( paragraph.length > 0 ) {
		return wordMatch( paragraph[0], keyword );
	}

	//if no double linebreaks found, return the keyword count of the entire text
	return wordMatch( text, keyword );
};

},{"../stringProcessing/matchStringWithRegex.js":41,"../stringProcessing/matchTextWithWord.js":42}],7:[function(require,module,exports){
/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {string} text The text to match the keyword in.
 * @param {string} keyword The keyword to match for.
 * @returns {object} result with the matches and position.
 */

module.exports = function( text, keyword ) {
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( text, keyword );
	result.position = text.toLocaleLowerCase().indexOf( keyword );

	return result;
};

},{"../stringProcessing/matchTextWithWord.js":42}],8:[function(require,module,exports){
/** @module analyses/getImageStatistics */

var matchStringWithRegex = require( "../stringProcessing/matchStringWithRegex" );
var imageAlttag = require( "../stringProcessing/getAlttagContent.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Checks if the keyword is present in the alttag and returns the property of the imageCount
 * object that needs to be updated.
 *
 * @param {string} alttag The alttag to match the keyword in
 * @param {string} keyword The keyword to match in the alttag
 * @returns {string} The property of the imageCount object that needs to be updated
 */
var matchKeywordInAlttags = function( alttag, keyword ) {
	if ( keyword !== "" ) {
		if ( wordMatch( alttag, keyword ) > 0 ) {
			return "altKeyword";
		} else {

			//this counts all alt-tags w/o the keyword when a keyword is set.
			return "alt";
		}
	} else {
		return "altNaKeyword";
	}
};

/**
 * Matches the alttags in the images found in the text.
 * Returns an imageCount object with the totals and different alttags.
 *
 * @param {array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for
 * @returns {object} imageCount object with all alttags
 */
var matchImageTags = function( imageMatches, keyword ) {
	var imageCount = { total: imageMatches.length, alt: 0, noAlt: 0, altKeyword: 0, altNaKeyword: 0 };
	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[i] );

		if ( alttag !== "" ) {
			imageCount[ matchKeywordInAlttags( alttag, keyword ) ]++;
		} else {
			imageCount.noAlt++;
		}
	}
	return imageCount;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {string} text The textstring to check for images
 * @param {string} keyword The keyword to check in alttags
 * @returns {object} Object containing all types of found images
 */
module.exports = function( text, keyword ) {

	var imageMatches = matchStringWithRegex( text, "<img(?:[^>]+)?>" );
	var imageCount =  matchImageTags( imageMatches, keyword );

	return imageCount;
};

},{"../stringProcessing/getAlttagContent.js":38,"../stringProcessing/matchStringWithRegex":41,"../stringProcessing/matchTextWithWord.js":42}],9:[function(require,module,exports){
/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Calculates the keyword density .
 *
 * @param {string} text The text to count the keywords in.
 * @param {string} keyword The keyword to match.
 * @returns {number} The keyword density.
 */
module.exports = function( text, keyword ) {
	var wordCount = countWords( text );
	var keywordCount = matchWords ( text, keyword );
	var keywordDensity = ( keywordCount / wordCount ) * 100;
	return keywordDensity.toFixed( 1 );
};

},{"../stringProcessing/countWords.js":35,"../stringProcessing/matchTextWithWord.js":42}],10:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {string} text The text to check for anchors.
 * @param {string} keyword The keyword to use for matching in anchors.
 * @param {string} url The url of the page.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found
 * totalNaKeyword: the total number of links if keyword is not available
 * totalKeyword: the total number of links with the keyword
 * internalTotal: the total number of links that are internal
 * internalDofollow: the internal links without a nofollow attribute
 * internalNofollow: the internal links with a nofollow attribute
 * externalTotal: the total number of links that are external
 * externalDofollow: the external links without a nofollow attribute
 * externalNofollow: the internal links with a dofollow attribute
 * otherTotal: all links that are not HTTP or HTTPS
 * otherDofollow: other links without a nofollow attribute
 * otherNofollow: other links with a nofollow attribute
 */
module.exports = function( text, keyword, url ) {
	var anchors = getAnchors( text );

	var linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		totalKeyword: 0,
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0
	};
	var linkKeyword;
	for ( var i = 0; i < anchors.length; i++ ) {
		linkKeyword = findKeywordInUrl( anchors[i], keyword );
		if ( linkKeyword ) {
			if ( keyword !== "" ) {
				linkCount.totalKeyword++;
			} else {
				linkCount.totalNaKeyword++;
			}
		}
		var linkType = getLinkType( anchors[i], url );
		linkCount[linkType + "Total"]++;
		var linkFollow = checkNofollow( anchors[i] );
		linkCount[linkType + linkFollow]++;
	}
	return linkCount;
};

},{"../stringProcessing/checkNofollow.js":31,"../stringProcessing/findKeywordInUrl.js":37,"../stringProcessing/getAnchorsFromText.js":39,"../stringProcessing/getLinkType.js":40}],11:[function(require,module,exports){
/** @module analyses/getWordCount */

var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Checks the number of words in a string
 *
 * @param {string} text The keyphrase to count words in.
 * @returns {number} The wordcount of the given string.
 */
module.exports = function( text ) {
	text = sanitizeString( text );

	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};

},{"../stringProcessing/sanitizeString.js":45}],12:[function(require,module,exports){
/** @module analyses/isUrlTooLong */

var analyzerConfig = require( "../config/analyzerConfig" )();

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {string} url The URL to check the length from.
 * @param {string} keyword The keyword
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( url, keyword ) {
	var urlLength = url.length;
	var keywordLength = keyword.length;
	var isUrlTooLong = false;
	if ( urlLength > analyzerConfig.maxUrlLength  && urlLength > keywordLength + analyzerConfig.maxSlugLength ) {
		isUrlTooLong = true;
	}
	return isUrlTooLong;
};

},{"../config/analyzerConfig":18}],13:[function(require,module,exports){
/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "../stringProcessing/subheadingsMatch.js" );

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {string} text The text to check for subheadings.
 * @param {string} keyword The keyword to match for.
 * @returns {object} the result object.
 * count: the number of matches
 * matches:the number of ocurrences of the keyword for each match
 */
module.exports = function( text, keyword ) {
	var matches;
	var result = { count: 0 };
	text = stripSomeTags( text );
	matches = text.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );

	if ( matches !== null ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword );
	}
	return result;
};


},{"../stringProcessing/stripNonTextTags.js":48,"../stringProcessing/subheadingsMatch.js":51}],14:[function(require,module,exports){
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

		this.keywordRegex = this.stringHelper.getWordBoundaryRegex(
			this.preProcessor.replaceDiacritics( keyword.replace( /[-_]/g, " " )
		) );

		// Creates new regex from keyword with global and caseinsensitive option,
		// replaces space with -. Used for URL matching
		this.keywordRegexInverse = this.stringHelper.getWordBoundaryRegex(
			this.preProcessor.replaceDiacritics( keyword.replace( /\s/g, "-" ) ),
			"\\-"
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
	var fleschReadingIndex;

	//if custom queue available load queue, otherwise load default queue.
	if ( typeof this.config.queue !== "undefined" && this.config.queue.length !== 0 ) {
		this.queue = this.config.queue.slice();
	} else {
		this.queue = YoastSEO.analyzerConfig.queue.slice();
	}

	// Exclude the flesh easy reading score for non-english languages
	if ( 0 !== this.config.locale.indexOf( "en_" ) && ( fleschReadingIndex = this.queue.indexOf( "fleschReading" ) ) ) {
		this.queue.splice( fleschReadingIndex, 1 );
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
	var matchWords = require( "./stringProcessing/matchTextWithWord.js" );
	var keywordCount = countWords( this.config.text );

	if ( keywordCount >= 100 ) {
		var density = getKeywordDensity( this.config.text, this.config.keyword );

		// Present for backwards compatibility with the .refObj.__store.keywordCount option in scoring.js
		this.__store.keywordCount = matchWords( this.config.text, this.config.keyword );

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
	var getSubheadings = require( "./analyses/matchKeywordInSubheadings.js" );

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

	/* Matchestext is used for scoring, we should move this to the scoring */
	var matchesText = matches.join( ", " );

	return [ {
		test: "stopwordKeywordCount",
		result: {
			count: matches.length,
			matches: matchesText
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
	var score = calculateFleschReading( this.config.text );
	if ( score < 0 ) {
		score = 0;
	}

	if ( score > 100 ) {
		score = 100;
	}

	return [ { test: "fleschReading", result: score } ];
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
	var keyword = this.config.keyword;

	if ( typeof keyword === "undefined" ) {
		keyword = "";
	}

	return [ { test: "linkCount", result: countLinks( this.config.text, keyword, this.config.baseUrl ) } ];
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
	return [ { test: "imageCount", result: countImages( this.config.text, this.config.keyword ) } ];
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
	var findKeywordInPageTitle = require( "./analyses/findKeywordInPageTitle.js" );
	var result = [ { test: "pageTitleKeyword", result: { position: -1, matches: 0 } } ];
	if ( typeof this.config.pageTitle !== "undefined" && typeof this.config.keyword !== "undefined" ) {
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

	if ( typeof this.config.meta !== "undefined" && typeof this.config.keyword !== "undefined" &&
		this.config.meta !== "" && this.config.keyword !== "" ) {
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
	if ( typeof  this.config.meta !== "undefined" ) {
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
	var score = 0;

	if ( typeof this.config.keyword !== "undefined" && typeof this.config.url !== "undefined" ) {
		score = checkForKeywordInUrl( this.config.url, this.config.keyword );
	}

	var result = [ { test: "urlKeyword", result: score } ];
	return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.urlLength = function() {
	var isUrlTooLong = require( "./analyses/isUrlTooLong.js" );
	var result = [ { test: "urlLength", result: { urlTooLong: isUrlTooLong(
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
	var checkUrlForStopwords = require( "./analyses/checkUrlForStopwords.js" );
	var result = [ { test: "urlStopwords", result: checkUrlForStopwords( this.config.url ) } ];

	return result;
};

/**
 * checks if the keyword has been used before. Uses usedkeywords array. If empty, returns 0.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keywordDoubles = function() {
	var result = [ { test: "keywordDoubles", result: { count: 0, id: 0 } } ];
	if ( typeof this.config.keyword !== "undefined" && typeof this.config.usedKeywords !== "undefined" ) {
		var checkForKeywordDoubles = require( "./analyses/checkForKeywordDoubles.js" );
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

},{"./analyses/calculateFleschReading.js":1,"./analyses/checkForKeywordDoubles.js":2,"./analyses/checkStringForStopwords.js":3,"./analyses/checkUrlForStopwords.js":4,"./analyses/countKeywordInUrl.js":5,"./analyses/findKeywordInFirstParagraph.js":6,"./analyses/findKeywordInPageTitle.js":7,"./analyses/getImageStatistics.js":8,"./analyses/getKeywordDensity.js":9,"./analyses/getLinkStatistics.js":10,"./analyses/getWordCount.js":11,"./analyses/isUrlTooLong.js":12,"./analyses/matchKeywordInSubheadings.js":13,"./stringProcessing/countWords.js":35,"./stringProcessing/matchTextWithWord.js":42}],15:[function(require,module,exports){
/* global YoastSEO: true */

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

},{}],16:[function(require,module,exports){
/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

var defaultsDeep = require( "lodash/object/defaultsDeep" );
var isObject = require( "lodash/lang/isObject" );
var isString = require( "lodash/lang/isString" );
var MissingArgument = require( "./errors/missingArgument" );

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
var defaults = {
	callbacks: {
		bindElementEvents: function( ) { },
		updateSnippetValues: function( ) { },
		saveScores: function( ) { }
	},
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "This is an example title - edit by clicking here",
		keyword: "Choose a focus keyword",
		meta: "Modify your meta description by editing it right here",
		text: "Start writing your text!"
	},
	queue: [ "wordCount",
		"keywordDensity",
		"subHeadings",
		"stopwords",
		"fleschReading",
		"linkCount",
		"imageCount",
		"urlKeyword",
		"urlLength",
		"metaDescription",
		"pageTitleKeyword",
		"pageTitleLength",
		"firstParagraph",
		"'keywordDoubles" ],
	typeDelay: 300,
	typeDelayStep: 100,
	maxTypeDelay: 1500,
	dynamicDelay: true,
	locale: "en_US",
	translations: {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	},
	replaceTarget: [],
	resetTarget: [],
	elementTarget: []
};

var isUndefined = require( "lodash/lang/isUndefined" );

var SnippetPreview = require( "./snippetPreview.js" );

/**
 * Creates a default snippet preview, this can be used if no snippet preview has been passed.
 *
 * @private
 * @this App
 *
 * @returns {SnippetPreview}
 */
function createDefaultSnippetPreview() {
	var targetElement = document.getElementById( this.config.targets.snippet ),
		SnippetPreview = require( "../js/snippetPreview.js" );

	return new SnippetPreview( {
		analyzerApp: this,
		targetElement: targetElement,
		callbacks: {
			saveSnippetData: this.config.callbacks.saveSnippetData
		}
	} );
}

/**
 * Returns whether or not the given argument is a valid SnippetPreview object.
 *
 * @param {*} snippetPreview
 * @returns {boolean}
 */
function isValidSnippetPreview( snippetPreview ) {
	return !isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object} args The arguments object passed to the App.
 */
function verifyArguments( args ) {

	if ( !isObject( args.callbacks.getData ) ) {
		throw new MissingArgument( "The app requires an object with a getdata callback." );
	}

	if ( !isObject( args.targets ) ) {
		throw new MissingArgument( "`targets` is a required App argument, `targets` is not an object." );
	}

	if ( !isString( args.targets.output ) ) {
		throw new MissingArgument( "`targets.output` is a required App argument, `targets.output` is not a string." );
	}

	// The args.targets.snippet argument is only required if not SnippetPreview object has been passed.
	if ( !isValidSnippetPreview( args.snippetPreview ) && !isString( args.targets.snippet ) ) {
		throw new MissingArgument( "A snippet preview is required. When no SnippetPreview object isn't passed to " +
			"the App, the `targets.snippet` is a required App argument. `targets.snippet` is not a string." );
	}
}

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
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 *
 * @param {SnippetPreview} args.snippetPreview
 *
 * @constructor
 */
YoastSEO.App = function( args ) {
	if ( !isObject( args ) ) {
		args = {};
	}
	defaultsDeep( args, defaults );

	verifyArguments( args );

	this.config = args;

	this.callbacks = this.config.callbacks;

	this.i18n = this.constructI18n( this.config.translations );
	this.stringHelper = new YoastSEO.StringHelper();
	this.pluggable = new YoastSEO.Pluggable( this );

	this.getData();

	this.showLoadingDialog();

	if ( isValidSnippetPreview( args.snippetPreview ) ) {
		this.snippetPreview = args.snippetPreview;

		// Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		// dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		// app.
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
			this.snippetPreview.i18n = this.i18n;
		}
	} else {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}
	this.initSnippetPreview();

	this.runAnalyzer();
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
	args.locale = args.locale || "en_US";

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
	var Jed = require( "jed" );

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

	return new Jed( translations );
};

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 */
YoastSEO.App.prototype.getData = function() {
	var isUndefined = require( "lodash/lang/isUndefined" );

	this.rawData = this.callbacks.getData();

	if ( !isUndefined( this.snippetPreview ) ) {
		var data = this.snippetPreview.getAnalyzerData();

		this.rawData.pageTitle = data.title;
		this.rawData.url = data.url;
		this.rawData.meta = data.metaDesc;
	}

	if ( this.pluggable.loaded ) {
		this.rawData.pageTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.pageTitle );
		this.rawData.meta = this.pluggable._applyModifications( "data_meta_desc", this.rawData.meta );
	}
	this.rawData.locale = this.config.locale;
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
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 */
YoastSEO.App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Initializes the snippet preview for this App.
 */
YoastSEO.App.prototype.initSnippetPreview = function() {
	this.snippetPreview.renderTemplate();
	this.snippetPreview.callRegisteredEventBinder();
	this.snippetPreview.bindEvents();
	this.snippetPreview.init();
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

},{"../js/snippetPreview.js":29,"./errors/missingArgument":25,"./snippetPreview.js":29,"jed":56,"lodash/lang/isObject":132,"lodash/lang/isString":134,"lodash/lang/isUndefined":136,"lodash/object/defaultsDeep":138}],17:[function(require,module,exports){
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

require( "./config/config.js" );
require( "./config/scoring.js" );
require( "./analyzer.js" );
require( "./preprocessor.js" );
require( "./analyzescorer.js" );
require( "./scoreFormatter.js" );
require( "./stringhelper.js" );
YoastSEO.SnippetPreview = require( "./snippetPreview.js" );
require( "./app.js" );
require( "./pluggable.js" );

YoastSEO.Jed = require( "jed" );

},{"./analyzer.js":14,"./analyzescorer.js":15,"./app.js":16,"./config/config.js":19,"./config/scoring.js":22,"./pluggable.js":26,"./preprocessor.js":27,"./scoreFormatter.js":28,"./snippetPreview.js":29,"./stringhelper.js":53,"jed":56}],18:[function(require,module,exports){
/**
 * Returns a configobject with maxSlugLength, maxUrlLength and MaxMeta to be used
 * for analysis
 *
 * @returns {object} the config object containing the maxSlugLength, maxUrlLength and the MaxMeta values
 */
module.exports = function(){
	return {
		maxSlugLength: 20,
		maxUrlLength: 40,
		maxMeta: 156
	}
};

},{}],19:[function(require,module,exports){
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

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

},{}],20:[function(require,module,exports){
/** @module config/diacritics */

/**
 * Returns the diacritics map
 *
 * @returns {array} diacritics map
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

},{}],21:[function(require,module,exports){
/** @module config/removalWords */

/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */
module.exports = function(){
	return [ " a", " in", " an", " on", " for", " the", " and" ];
};

},{}],22:[function(require,module,exports){
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

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

                    /* translators: %1$s expands to the numeric flesh reading ease score, %2$s to a link to a Yoast.com article about Flesh ease reading score, %3$s to the easyness of reading, %4$s expands to a note about the flesh reading score. */
                    value: i18n.dgettext('js-text-analysis', "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s")
                },
                { name: "text", position: "%1$s", sourceObj: ".result" },
                {
                    name: "scoreUrl",
                    position: "%2$s",
                    value: "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>"
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
                    /* translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
                    text: i18n.dgettext( "js-text-analysis", "Your focus keyword contains one or more stop words. This may or may not be wise depending on the circumstances. Read %1$sthis article%2$s for more info." )
                },
                { matcher: "count", max: 0, score: 0, text: "" }
            ],
            replaceArray: [
                {
                    name: "urlOpen",
                    position: "%1$s",
                    value: "<a href='https://yoast.com/handling-stopwords/' target='new'>"
                },
                {
                    name: "urlClose",
                    position: "%2$s",
                    value: "</a>"
                }
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

},{}],23:[function(require,module,exports){
/** @module config/stopwords */

/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {array} stopwords The array filled with stopwords.
 */
module.exports = function(){
	return [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
};

},{}],24:[function(require,module,exports){
/** @module config/syllables */

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
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

},{}],25:[function(require,module,exports){
"use strict";

module.exports = function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":147}],26:[function(require,module,exports){
/* global console: true */
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

	this.app.analyzeTimer();
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

},{}],27:[function(require,module,exports){
/* global YoastSEO: true */
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
	this.__store.cleanTextNoDigits = this.stringHelper.stripNonWords( this.__store.cleanTextNoTags );
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

},{}],28:[function(require,module,exports){
/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

var isUndefined = require( "lodash/lang/isUndefined" );
var difference = require( "lodash/array/difference" );

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
	var unsortables = this.getUndefinedScores( this.scores );
	var sortables = difference( this.scores, unsortables );

	sortables.sort( function( a, b ) {
		return a.score - b.score;
	} );

	this.scores = unsortables.concat( sortables );
};

/**
 * Extracts scorers with a score of undefined
 *
 * @param {Array} scorers The scorers that are being sorted
 * @returns {Array} The scorers that cannot be sorted
 */
YoastSEO.ScoreFormatter.prototype.getUndefinedScores = function( scorers ) {
	var filtered = scorers.filter( function( scorer ) {
		return isUndefined( scorer.score );
	} );

	return filtered;
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
 *
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
 *
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

},{"lodash/array/difference":57,"lodash/lang/isUndefined":136}],29:[function(require,module,exports){
/* jshint browser: true */
/* global YoastSEO: false */

var isEmpty = require( "lodash/lang/isEmpty" );
var isElement = require( "lodash/lang/isElement" );
var isUndefined = require( "lodash/lang/isUndefined" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );
var forEach = require( "lodash/collection/forEach" );
var map = require( "lodash/collection/map" );
var debounce = require( "lodash/function/debounce" );

var stripSpaces = require( "../js/stringProcessing/stripSpaces.js" );

var defaults = {
	data: {
		title: "",
		metaDesc: "",
		urlPath: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	},
	addTrailingSlash: true,
	metaDescriptionDate: ""
};

var titleMaxLength = 70;

var inputPreviewBindings = [
	{
		"preview": "title_container",
		"inputField": "title"
	},
	{
		"preview": "url_container",
		"inputField": "urlPath"
	},
	{
		"preview": "meta_container",
		"inputField": "metaDesc"
	}
];

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The key to retrieve.
 */
function retrieveUnformattedText( key ) {
	return this.data[ key ];
}

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 */
function updateUnformattedText( key, value ) {
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
function addClass( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
}

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
function removeClass( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
}

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 */
function removeClasses( element, classes ) {
	forEach( classes, removeClass.bind( null, element ) );
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url
 * @returns {boolean}
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean}
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return progressElement.max !== undefined;
}

/**
 * Returns a rating based on the length of the title
 *
 * @param {string} titleLength
 * @returns {string}
 */
function rateTitleLength( titleLength ) {
	var rating;

	switch ( true ) {
		case titleLength > 0 && titleLength <= 39:
		case titleLength >= 71:
			rating = "ok";
			break;

		case titleLength >= 40 && titleLength <= 70:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Returns a rating based on the length of the meta description
 *
 * @param {string} metaDescLength
 * @returns {string}
 */
function rateMetaDescLength( metaDescLength ) {
	var rating;

	switch ( true ) {
		case metaDescLength > 0 && metaDescLength <= 120:
		case metaDescLength >= 157:
			rating = "ok";
			break;

		case metaDescLength >= 120 && metaDescLength <= 157:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Updates a progress bar
 *
 * @private
 * @this SnippetPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good"
		];

	element.value = value;
	removeClasses( element, allClasses );
	addClass( element, "snippet-editor__progress--" + rating );

	if ( !this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The fallback values for the snippet preview rendering.
 * @param {string}         opts.placeholder.title         - The fallback value for the title.
 * @param {string}         opts.placeholder.metaDesc      - The fallback value for the meta description.
 * @param {string}         opts.placeholder.urlPath       - The fallback value for the URL path.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 * @param {string}         opts.metaDescriptionDate       - The date to display before the meta description.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc      - The rendered meta description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {
	defaultsDeep( opts, defaults );

	this.data = opts.data;

	if ( !isUndefined( opts.analyzerApp ) ) {
		this.refObj = opts.analyzerApp;
		this.i18n = this.refObj.i18n;

		this.data = {
			title: this.refObj.rawData.snippetTitle || "",
			urlPath: this.refObj.rawData.snippetCite || "",
			metaDesc: this.refObj.rawData.snippetMeta || ""
		};

		// For backwards compatibility set the pageTitle as placeholder.
		if ( !isEmpty( this.refObj.rawData.pageTitle ) ) {
			opts.placeholder.title = this.refObj.rawData.pageTitle;
		}
	}

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	this.opts = opts;
	this._currentFocus = null;
	this._currentHover = null;

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" )
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 */
SnippetPreview.prototype.renderTemplate = function() {
	var snippetEditorTemplate = require( "./templates.js" ).snippetEditor;
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			snippetEditor: this.i18n.dgettext( "js-text-analysis", "Snippet editor" )
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[0],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[0]
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[0],
			metaDesc: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[0]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		urlPath: this.element.input.urlPath.parentNode,
		metaDesc: this.element.input.metaDesc.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		urlPath: this.element.rendered.urlPath.parentNode,
		metaDesc: this.element.rendered.metaDesc.parentNode
	};

	this.hasProgressSupport = hasProgressSupport();

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.metaDesc.max = YoastSEO.analyzerConfig.maxMeta;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.opened = false;
	this.updateProgressBars();
};

/**
 * Refreshes the snippet editor rendered HTML
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string}
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}
	title = this.refObj.pluggable._applyModifications( "data_page_title", title );

	return stripSpaces( title );
}

/**
 * Returns the metaDescription, includes the date if it is set.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string}
 */
var getAnalyzerMetaDesc = function() {
	var metaDesc = this.data.metaDesc;

	metaDesc = this.refObj.pluggable._applyModifications( "data_meta_desc", metaDesc );

	// If no meta has been set, generate one.
	if ( isEmpty( metaDesc ) ) {
		metaDesc = this.getMetaText();
	}

	if ( !isEmpty( this.opts.metaDescriptionDate ) && !isEmpty( metaDesc ) ) {
		metaDesc = this.opts.metaDescriptionDate + " - " + this.data.metaDesc;
	}

	return stripSpaces( metaDesc );
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object}
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    getAnalyzerTitle.call( this ),
		url:      this.data.urlPath,
		metaDesc: getAnalyzerMetaDesc.call( this )
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	this.refObj.callbacks.bindElementEvents( this.refObj );
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.pageTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object}
 */
SnippetPreview.prototype.htmlOutput = function() {
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
 * @returns {string}
 */
SnippetPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	// Apply modification to the title before showing it.
	if ( this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	// TODO: Replace this with the stripAllTags module.
	title = this.refObj.stringHelper.stripAllTags( title );

	// If a keyword is set we want to highlight it in the title.
	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		return this.formatKeyword( title );
	}

	return title;
};

/**
 * Formates the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	// TODO: Replace this with the stripAllTags module.
	cite = this.refObj.stringHelper.stripAllTags( cite );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.urlPath;
	}

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && !hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// Apply modification to the desc before showing it.
	if ( this.refObj.pluggable.loaded ) {
		meta = this.refObj.pluggable._applyModifications( "data_meta_desc", meta );
	}

	// TODO: Replace this with the stripAllTags module.
	meta = this.refObj.stringHelper.stripAllTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt. It uses the keyword to
 * select an appropriate part of the text. If the keyword isn't present it takes the first 156 characters of the text.
 * If both the keyword, text and excerpt are empty this function returns the sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText;
	if ( this.opts.placeholder.metaDesc !== defaults.placeholder.metaDesc ) {
		metaText = this.opts.placeholder.metaDesc;
	}

	if ( !isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( !isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	if ( isEmpty( metaText ) ) {
		metaText = this.opts.placeholder.metaDesc;
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
		return this.opts.placeholder.metaDesc;
	}
	return metaText.substring( 0, YoastSEO.analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
SnippetPreview.prototype.getIndexMatches = function() {
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
SnippetPreview.prototype.getPeriodMatches = function() {
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
 *
 * @param {string} textString
 * @returns {string}
 */
SnippetPreview.prototype.formatKeyword = function( textString ) {

	// removes characters from the keyword that could break the regex, or give unwanted results
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, " " );

	// Match keyword case-insensitively
	var keywordRegex = YoastSEO.getStringHelper().getWordBoundaryRegex( keyword );
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
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = this.refObj.stringHelper.sanitizeKeyword( this.refObj.rawData.keyword );
	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = YoastSEO.getStringHelper().getWordBoundaryRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var metaDesc = this.element.rendered.metaDesc;

	if ( this.data.metaDesc === "" ) {
		addClass( metaDesc, "desc-render" );
		removeClass( metaDesc, "desc-default" );
	} else {
		addClass( metaDesc, "desc-default" );
		removeClass( metaDesc, "desc-render" );
	}
};

/**
 * function to call init, to rerender the snippetpreview
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
SnippetPreview.prototype.checkTextLength = function( ev ) {
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
			if ( text.length > titleMaxLength ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring( 0, titleMaxLength );
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
SnippetPreview.prototype.getUnformattedText = function( ev ) {
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
SnippetPreview.prototype.setUnformattedText = function( ev ) {
	var elem =  ev.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Validates all fields and highlights errors.
 */
SnippetPreview.prototype.validateFields = function() {
	var metaDescription = getAnalyzerMetaDesc.call( this );
	var title = getAnalyzerTitle.call( this );

	if ( metaDescription.length > YoastSEO.analyzerConfig.maxMeta ) {
		addClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	} else {
		removeClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the data
 */
SnippetPreview.prototype.updateProgressBars = function() {
	var metaDescriptionRating, titleRating, metaDescription, title;

	metaDescription = getAnalyzerMetaDesc.call( this );
	title = getAnalyzerTitle.call( this );

	titleRating = rateTitleLength( title.length );
	metaDescriptionRating = rateMetaDescLength( metaDescription.length );

	updateProgressBar(
		this.element.progress.title,
		title.length,
		titleMaxLength,
		titleRating
	);

	updateProgressBar(
		this.element.progress.metaDesc,
		metaDescription.length,
		YoastSEO.analyzerConfig.maxMeta,
		metaDescriptionRating
	);
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ],
		focusBindings;

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[0];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

	// Map binding keys to the actual elements
	focusBindings = map( inputPreviewBindings, function( binding ) {
		return {
			"preview": document.getElementById( binding.preview ),
			"inputField": this.element.input[ binding.inputField ]
		};
	}.bind( this ) );

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( inputPreviewBindings, function( binding ) {
		var previewElement = document.getElementById( binding.preview );
		var inputElement = this.element.input[ binding.inputField ];

		// Make the preview element click open the editor and focus the correct input.
		previewElement.addEventListener( "click", function() {
			this.openEditor();
			inputElement.focus();
		}.bind( this ) );

		// Make focusing an input, update the carets.
		inputElement.addEventListener( "focus", function() {
			this._currentFocus = binding.inputField;

			this._updateFocusCarets();
		}.bind( this ) );

		// Make removing focus from an element, update the carets.
		inputElement.addEventListener( "blur", function() {
			this._currentFocus = null;

			this._updateFocusCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseover", function() {
			this._currentHover = binding.inputField;

			this._updateHoverCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseout", function() {
			this._currentHover = null;

			this._updateHoverCarets();
		}.bind( this ) );

	}.bind( this ) );
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 */
SnippetPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	this.refObj.refresh.call( this.refObj );
}, 25 );

/**
 * Updates our data object from the DOM
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 */
SnippetPreview.prototype.openEditor = function() {

	// Hide these elements.
	addClass( this.element.editToggle,       "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.formContainer, "snippet-editor--hidden" );
	removeClass( this.element.headingEditor, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 */
SnippetPreview.prototype.closeEditor = function() {

	// Hide these elements.
	addClass( this.element.formContainer,     "snippet-editor--hidden" );
	addClass( this.element.headingEditor,     "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.editToggle,     "snippet-editor--hidden" );

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 */
SnippetPreview.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 */
SnippetPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		addClass( focusedLabel, "snippet-editor__label--focus" );
		addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 */
SnippetPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/* jshint ignore:start */
/**
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 *
 * @deprecated
 * @param {KeyboardEvent} ev
 */
SnippetPreview.prototype.disableEnter = function( ev ) {};

/**
 * Adds and remove the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {};

/**
 * shows the edit icon corresponding to the hovered element
 *
 * @deprecated
 *
 * @param ev
 */
SnippetPreview.prototype.showEditIcon = function( ev ) {

};

/**
 * removes all editIcon-classes, sets to snippet_container
 *
 * @deprecated
 */
SnippetPreview.prototype.hideEditIcon = function() {};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {};
/* jshint ignore:end */

module.exports = SnippetPreview;

},{"../js/stringProcessing/stripSpaces.js":50,"./templates.js":54,"lodash/collection/forEach":59,"lodash/collection/map":60,"lodash/function/debounce":62,"lodash/lang/clone":125,"lodash/lang/isElement":128,"lodash/lang/isEmpty":129,"lodash/lang/isUndefined":136,"lodash/object/defaultsDeep":138}],30:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} extraWordBoundary Extra characters to match a word boundary on.
 * @return {string} A regex string that matches the matchString with word boundaries
 */
module.exports = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	if ( typeof extraWordBoundary === "undefined" ) {
		extraWordBoundary = "";
	}

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+\-;!?:\/" + extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],31:[function(require,module,exports){
/** @module stringProcessing/checkNofollow */

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	var linkFollow = "Dofollow";

	// Matches all nofollow links, case insensitive and global
	if ( text.match( /rel=([\'\"])nofollow\1/ig ) !== null ) {
		linkFollow = "Nofollow";
	}
	return linkFollow;
};

},{}],32:[function(require,module,exports){
/** @module stringProcessing/cleanText */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );

/**
 * Removes words, duplicate spaces and sentence terminators, and words consisting of only digits
 * from the text. This is used for the flesh reading ease test.
 *
 * @param {String} text The cleaned text
 * @returns {String} The text
 */
module.exports = function( text ) {
	if ( text === "" ) {
		return text;
	}

	text = replaceDiacritics( text );
	text = text.toLocaleLowerCase();

	text = unifyWhitespace( text );

	// replace comma', hyphens etc with spaces
	text = text.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

	// remove apostrophe
	text = text.replace( /[\’]/g, "" );

	// unify all terminators
	text = text.replace( /[.?!]/g, "." );

	// Remove double spaces
	text = stripSpaces( text );

	// add period in case it is missing
	text += ".";

	// replace newlines with spaces
	text = text.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

	// remove duplicate terminators
	text = text.replace( /([\.])[\. ]+/g, "$1" );

	// pad sentence terminators
	text = text.replace( /[ ]*([\.])+/g, "$1 " );

	// Remove double spaces
	text = stripSpaces( text );

	if ( text === "." ) {
		return "";
	}

	return text;
};

},{"../stringProcessing/replaceDiacritics.js":43,"../stringProcessing/stripSpaces.js":50,"../stringProcessing/unifyWhitespace.js":52}],33:[function(require,module,exports){
/** @module stringProcessing/countSentences */

var cleanText = require( "../stringProcessing/cleanText.js" );

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
module.exports = function( text ) {
	var sentences = cleanText( text ).split( "." );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

},{"../stringProcessing/cleanText.js":32}],34:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

var cleanText = require( "../stringProcessing/cleanText.js" );
var syllableArray = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

/**
 * Checks the textstring for exclusion words. If they are found, returns the number of syllables these have, since
 * they are incorrectly detected with the syllablecounters based on regexes.
 *
 * @param {string} text The text to look for exclusionwords
 * @returns {number} The number of syllables found in the exclusionwords
 */
var countExclusionSyllables = function( text ) {
	var count = 0, wordArray, regex, matches;
	wordArray = syllableArray().exclusionWords;
	for ( var i = 0; i < wordArray.length; i++ ) {
		regex = new RegExp ( wordArray[i].word, "ig" );
		matches = text.match ( regex );
		if ( matches !== null ) {
			count += ( matches.length * wordArray[i].syllables );
		}
	}
	return count;
};

/**
 * Removes words from the text that are in the exclusion array. These words are counted
 * incorrectly in the syllable counters, so they are removed and checked sperately.
 *
 * @param {string} text The text to remove words from
 * @returns {string} The text with the exclusionwords removed
 */
var removeExclusionWords = function( text ) {
	var exclusionWords = syllableArray().exclusionWords;
	var wordArray = [];
	for ( var i = 0; i < exclusionWords.length; i++ ) {
		wordArray.push( exclusionWords[i].word );
	}
	return text.replace( arrayToRegex( wordArray ), "" );
};

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countBasicSyllables = function( text ) {
	var array = text.split( " " );
	var i, j, splitWord, count = 0;

	//split textstring to individual words
	for ( i = 0; i < array.length; i++ ) {

		//split on consonants
		splitWord = array[ i ].split( /[^aeiouy]/g );

		//if the string isn't empty, a consonant was found, up the counter
		for ( j = 0; j < splitWord.length; j++ ) {
			if ( splitWord[ j ] !== "" ) {
				count++;
			}
		}
	}

	return count;
};

/**
 * Advanced syllable counter to match texstring with regexes.
 *
 * @param {String} text The text to count the syllables.
 * @param {String} operator The operator to determine which regex to use.
 * @returns {number} the amount of syllables found in string.
 */
var countAdvancedSyllables = function( text, operator ) {
	var matches, count = 0, words = text.split( " " );
	var regex = "";
	switch ( operator ) {
		case "add":
			regex = arrayToRegex( syllableArray().addSyllables, true );
			break;
		case "subtract":
			regex = arrayToRegex( syllableArray().subtractSyllables, true );
			break;
		default:
			break;
	}
	for ( var i = 0; i < words.length; i++ ) {
		matches = words[i].match ( regex );
		if ( matches !== null ) {
			count += matches.length;
		}
	}
	return count;
};

/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} text The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ) {
	var count = 0;
	count += countExclusionSyllables( text );

	text = removeExclusionWords( text );
	text = cleanText( text );
	text.replace( /[.]/g, " " );

	count += countBasicSyllables( text );
	count += countAdvancedSyllables( text, "add" );
	count -= countAdvancedSyllables( text, "subtract" );

	return count;
};


},{"../config/syllables.js":24,"../stringProcessing/cleanText.js":32,"../stringProcessing/createRegexFromArray.js":36}],35:[function(require,module,exports){
/** @module stringProcessing/countWords */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {String} text The text to count words in.
 * @returns {int} The wordcount of the given text.
 */
module.exports = function( text ) {

	text = stripTags( text );
	text = stripSpaces( text );
	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};

},{"../stringProcessing/stripHTMLTags.js":47,"../stringProcessing/stripSpaces.js":50}],36:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} disableWordBoundary Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;

	array = array.map( function( string ) {
		if ( disableWordBoundary ) {
			return string;
		} else {
			return addWordBoundary( string );
		}
	} );

	regexString = "(" + array.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":30}],37:[function(require,module,exports){
/** @module stringProcessing/findKeywordInUrl */

var keywordRegex = require( "../stringProcessing/stringToRegex.js" );
/**
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword ) {
	var keywordFound = false;
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[0].replace( /<.*?>\s?/ig, "" );
		if ( formatUrl.match( keywordRegex( keyword ) ) !== null ) {
			keywordFound = true;
		}
	}

	return keywordFound;
};

},{"../stringProcessing/stringToRegex.js":46}],38:[function(require,module,exports){
/** @module stringProcessing/getAlttagContent */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Checks for an alttag in the image and returns its content
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function( text ) {
	var alt = "";
	var image = text.match( /alt=([\'\"])(.*?)\1/ig );
	if ( image !== null ) {

		// Matches the value of the alt attribute (alphanumeric chars), global and case insensitive
		alt = image[ 0 ].split( "=" )[ 1 ];
		alt = stripSpaces( alt.replace( /[\'\"]*/g, "" ) );
	}
	return alt;
};

},{"../stringProcessing/stripSpaces.js":50}],39:[function(require,module,exports){
/** @module stringProcessing/getAnchorsFromText */

/**
 * Check for anchors in the textstring and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 * @returns {Array} The matched links in text.
 */
module.exports = function( text ) {
	var matches;

	//regex matches everything between <a> and </a>
	matches = text.match( /<a(?:[^>]+)?>(.*?)<\/a>/ig );
	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],40:[function(require,module,exports){
/** @module stringProcess/getLinkType */

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	var linkType = "other";

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( text.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";
		var urlMatch = text.match( url );
		if ( urlMatch !== null && urlMatch[ 0 ].length !== 0 ) {
			linkType = "internal";
		}
	}
	return linkType;
};

},{}],41:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ) {
	var matches;
	var regex = new RegExp( regexString, "ig" );
	matches = text.match( regex );
	if ( matches === null ) {
		matches = [];
	}
	return matches;
};

},{}],42:[function(require,module,exports){
/** @module stringProcessing/matchTextWithWord */

var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} extraBoundary An extra string that can be added to the wordboundary regex
 * @returns {string} The text without characters.
 */
module.exports = function( text, wordToMatch, extraBoundary ) {
	text = stripSomeTags ( text );
	text = unifyWhitespace( text );
	text = replaceDiacritics( text );
	var regex = stringToRegex( wordToMatch, extraBoundary );
	var matches = text.match( regex );
	if ( matches === null ) {
		return 0;
	}

	return matches.length;
};

},{"../stringProcessing/replaceDiacritics.js":43,"../stringProcessing/stringToRegex.js":46,"../stringProcessing/stripNonTextTags.js":48,"../stringProcessing/unifyWhitespace.js":52}],43:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var diacritisRemovalMap = require( "../config/diacritics.js" );

/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
module.exports = function( text ) {
	var map = diacritisRemovalMap();

	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
};

},{"../config/diacritics.js":20}],44:[function(require,module,exports){
/** @module stringProcessing/replaceString */

/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */
module.exports = function( text, stringToReplace, replacement ) {
	text = text.replace( stringToReplace, replacement );

	return text;
};

},{}],45:[function(require,module,exports){
/** @module stringProcessing/sanitizeString */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
module.exports = function( text ) {
	text = text.replace( /[\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g, "" );
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
};

},{"../stringProcessing/stripHTMLTags.js":47,"../stringProcessing/stripSpaces.js":50}],46:[function(require,module,exports){
/** @module stringProcessing/stringToRegex */

var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} extraBoundary A string that is used as extra boundary for the regex.
 * @returns {string} regex The regex made from the keyword
 */
module.exports = function( string, extraBoundary ) {
	string = replaceDiacritics( string );
	string = sanitizeString( string );
	string = addWordBoundary( string, extraBoundary );
	return new RegExp ( string, "ig" );
};

},{"../stringProcessing/addWordboundary.js":30,"../stringProcessing/replaceDiacritics.js":43,"../stringProcessing/sanitizeString.js":45}],47:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	return text;
};

},{}],48:[function(require,module,exports){
/** @module stringProcessing/stripNonTextTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strips all tags from the text, except li, p, dd and h1-h6 tags from the text that contain content to check.
 *
 * @param {string} text The text to strip tags from
 * @returns {string} The text stripped of tags, except for li, p, dd and h1-h6 tags.
 */
module.exports = function( text ) {
	text = text.replace( /<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "" );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":50}],49:[function(require,module,exports){
/** @module stringProcessing/stripNumbers */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with numberonly words removed.
 */

module.exports = function( text ) {

	// Remove "words" comprised only of numbers
	text = text.replace( /\b[0-9]+\b/g, "" );

	text = stripSpaces( text );

	if ( text === "." ) {
		text = "";
	}
	return text;
};

},{"../stringProcessing/stripSpaces.js":50}],50:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {

	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}],51:[function(require,module,exports){
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				formattedHeaders.match( stringToRegex( keyword ) ) ||
				matches[ i ].match( stringToRegex( keyword ) )
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};

},{"../config/removalWords.js":21,"../stringProcessing/replaceString.js":44,"../stringProcessing/stringToRegex.js":46}],52:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */

module.exports = function( text ) {

	// Replace &nbsp with space
	text = text.replace( "&nbsp;", " " );

	// Replace whitespaces with space
	text = text.replace( /\s/g, " " );

	return text;
};


},{}],53:[function(require,module,exports){
/* global YoastSEO: true */
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
 * builds regex from array with multiple strings
 * @param stringArray
 * @returns {RegExp}
 */
YoastSEO.StringHelper.prototype.stringToRegex = function( stringArray, disableWordBoundary ) {
	var regexString;

	stringArray = stringArray.map( function( string ) {
		if ( disableWordBoundary ) {
			return string;
		} else {
			return this.getWordBoundaryString( string );
		}
	}.bind( this ) );

	regexString = "(" + stringArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "g" );
};

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {String} matchString The string to generate a regex string for.
 * @param {String} extraWordBoundary Extra characters to match a word boundary on.
 * @return {String} A regex string that matches the matchString with word boundaries
 */
YoastSEO.StringHelper.prototype.getWordBoundaryString = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	if ( typeof extraWordBoundary === "undefined" ) {
		extraWordBoundary = "";
	}

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+;!?:\/" + extraWordBoundary + "<>]";
	wordBoundaryEnd = "($|" + wordBoundary + ")";
	wordBoundaryStart = "(^|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

/**
 * Creates a regex with a wordboundary. Since /b isn't working properly in JavaScript we have to
 * use an alternative regex.
 */
YoastSEO.StringHelper.prototype.getWordBoundaryRegex = function( textString, extraWordBoundary ) {
	return new RegExp( this.getWordBoundaryString( textString, extraWordBoundary ), "ig" );
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
 * Removes all words comprised only of numbers and remove special characters.
 * @param textString {String}
 * @returns {string}
 */
YoastSEO.StringHelper.prototype.stripNonWords = function( textString ) {

	// replace comma', hyphens etc with spaces
	textString = textString.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

	// remove apostrophe
	textString = textString.replace( /[\’]/g, "" );

	// Remove "words" comprised only of numbers
	textString = textString.replace( this.getWordBoundaryRegex( "[0-9]+" ), "$1$3" );

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


},{}],54:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  var VERSION = '3.10.1';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional characters
   * use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value.
   * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in Internet Explorer < 9, they can break out
   * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
   * for more details.
   *
   * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
   * to reduce XSS vectors.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    // Reset `lastIndex` because in IE < 9 `String#replace` does not.
    string = baseToString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'snippetEditor': {}
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview">\n    <h4 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h4>\n\n    <section class="snippet-editor__preview">\n        <div class="snippet_container snippet-editor__container" id="title_container">\n            <span class="title" id="snippet_title">\n                ' +
    __e( rendered.title ) +
    '\n            </span>\n            <span class="title" id="snippet_sitename"></span>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="url_container">\n            <cite class="url urlBase" id="snippet_citeBase">\n                ' +
    __e( rendered.baseUrl ) +
    '\n            </cite>\n            <cite class="url" id="snippet_cite">\n                ' +
    __e( rendered.snippetCite ) +
    '\n            </cite>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="meta_container">\n            ';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n                <span class="snippet-editor__date">\n                    ' +
    __e( metaDescriptionDate ) +
    ' -\n                </span>\n            ';
     }
    __p += '\n            <span class="desc" id="snippet_meta">\n                ' +
    __e( rendered.meta ) +
    '\n            </span>\n        </div>\n\n        <button class="snippet-editor__button snippet-editor__edit-button" type="button">\n            ' +
    __e( i18n.edit ) +
    '\n        </button>\n    </section>\n\n    <h4 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit snippet-editor--hidden">' +
    __e( i18n.snippetEditor ) +
    '</h4>\n\n    <div class="snippet-editor__form snippet-editor--hidden">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n            <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title">\n                <div class="snippet-editor__progress-bar"></div>\n            </progress>\n        </label>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n            <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description">\n                <div class="snippet-editor__progress-bar"></div>\n            </progress>\n        </label>\n\n        <button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n    </div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = templates).templates = templates;
    } else {
      freeExports.templates = templates;
    }
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],55:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],56:[function(require,module,exports){
/**
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

},{}],57:[function(require,module,exports){
var baseDifference = require('../internal/baseDifference'),
    baseFlatten = require('../internal/baseFlatten'),
    isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike'),
    restParam = require('../function/restParam');

/**
 * Creates an array of unique `array` values not included in the other
 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3], [4, 2]);
 * // => [1, 3]
 */
var difference = restParam(function(array, values) {
  return (isObjectLike(array) && isArrayLike(array))
    ? baseDifference(array, baseFlatten(values, false, true))
    : [];
});

module.exports = difference;

},{"../function/restParam":63,"../internal/baseDifference":74,"../internal/baseFlatten":76,"../internal/isArrayLike":114,"../internal/isObjectLike":119}],58:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],59:[function(require,module,exports){
var arrayEach = require('../internal/arrayEach'),
    baseEach = require('../internal/baseEach'),
    createForEach = require('../internal/createForEach');

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"../internal/arrayEach":66,"../internal/baseEach":75,"../internal/createForEach":103}],60:[function(require,module,exports){
var arrayMap = require('../internal/arrayMap'),
    baseCallback = require('../internal/baseCallback'),
    baseMap = require('../internal/baseMap'),
    isArray = require('../lang/isArray');

/**
 * Creates an array of values by running each element in `collection` through
 * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
 * arguments: (value, index|key, collection).
 *
 * If a property name is provided for `iteratee` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `iteratee` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
 * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
 * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
 * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
 * `sum`, `uniq`, and `words`
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function timesThree(n) {
 *   return n * 3;
 * }
 *
 * _.map([1, 2], timesThree);
 * // => [3, 6]
 *
 * _.map({ 'a': 1, 'b': 2 }, timesThree);
 * // => [3, 6] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // using the `_.property` callback shorthand
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee, thisArg) {
  var func = isArray(collection) ? arrayMap : baseMap;
  iteratee = baseCallback(iteratee, thisArg, 3);
  return func(collection, iteratee);
}

module.exports = map;

},{"../internal/arrayMap":67,"../internal/baseCallback":71,"../internal/baseMap":85,"../lang/isArray":127}],61:[function(require,module,exports){
var getNative = require('../internal/getNative');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internal/getNative":109}],62:[function(require,module,exports){
var isObject = require('../lang/isObject'),
    now = require('../date/now');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it's invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

module.exports = debounce;

},{"../date/now":61,"../lang/isObject":132}],63:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],64:[function(require,module,exports){
(function (global){
var cachePush = require('./cachePush'),
    getNative = require('./getNative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = SetCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cachePush":97,"./getNative":109}],65:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],66:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],67:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],68:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],69:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],70:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":139,"./baseCopy":73}],71:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":143,"../utility/property":144,"./baseMatches":86,"./baseMatchesProperty":87,"./bindCallback":94}],72:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    initCloneArray = require('./initCloneArray'),
    initCloneByTag = require('./initCloneByTag'),
    initCloneObject = require('./initCloneObject'),
    isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

module.exports = baseClone;

},{"../lang/isArray":127,"../lang/isObject":132,"./arrayCopy":65,"./arrayEach":66,"./baseAssign":70,"./baseForOwn":79,"./initCloneArray":111,"./initCloneByTag":112,"./initCloneObject":113}],73:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],74:[function(require,module,exports){
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":81,"./cacheIndexOf":96,"./createCache":101}],75:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":79,"./createBaseEach":99}],76:[function(require,module,exports){
var arrayPush = require('./arrayPush'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../lang/isArguments":126,"../lang/isArray":127,"./arrayPush":68,"./isArrayLike":114,"./isObjectLike":119}],77:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":100}],78:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keysIn = require('../object/keysIn');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

module.exports = baseForIn;

},{"../object/keysIn":140,"./baseFor":77}],79:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":139,"./baseFor":77}],80:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":123}],81:[function(require,module,exports){
var indexOfNaN = require('./indexOfNaN');

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./indexOfNaN":110}],82:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":132,"./baseIsEqualDeep":83,"./isObjectLike":119}],83:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":127,"../lang/isTypedArray":135,"./equalArrays":104,"./equalByTag":105,"./equalObjects":106}],84:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":82,"./toObject":123}],85:[function(require,module,exports){
var baseEach = require('./baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./baseEach":75,"./isArrayLike":114}],86:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    getMatchData = require('./getMatchData'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":84,"./getMatchData":108,"./toObject":123}],87:[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":58,"../lang/isArray":127,"./baseGet":80,"./baseIsEqual":82,"./baseSlice":92,"./isKey":117,"./isStrictComparable":120,"./toObject":123,"./toPath":124}],88:[function(require,module,exports){
var arrayEach = require('./arrayEach'),
    baseMergeDeep = require('./baseMergeDeep'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike'),
    isTypedArray = require('../lang/isTypedArray'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.merge` without support for argument juggling,
 * multiple sources, and `this` binding `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {Object} Returns `object`.
 */
function baseMerge(object, source, customizer, stackA, stackB) {
  if (!isObject(object)) {
    return object;
  }
  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
      props = isSrcArr ? undefined : keys(source);

  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObjectLike(srcValue)) {
      stackA || (stackA = []);
      stackB || (stackB = []);
      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
    }
    else {
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
      }
      if ((result !== undefined || (isSrcArr && !(key in object))) &&
          (isCommon || (result === result ? (result !== value) : (value === value)))) {
        object[key] = result;
      }
    }
  });
  return object;
}

module.exports = baseMerge;

},{"../lang/isArray":127,"../lang/isObject":132,"../lang/isTypedArray":135,"../object/keys":139,"./arrayEach":66,"./baseMergeDeep":89,"./isArrayLike":114,"./isObjectLike":119}],89:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isPlainObject = require('../lang/isPlainObject'),
    isTypedArray = require('../lang/isTypedArray'),
    toPlainObject = require('../lang/toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
  var length = stackA.length,
      srcValue = source[key];

  while (length--) {
    if (stackA[length] == srcValue) {
      object[key] = stackB[length];
      return;
    }
  }
  var value = object[key],
      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
      isCommon = result === undefined;

  if (isCommon) {
    result = srcValue;
    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
      result = isArray(value)
        ? value
        : (isArrayLike(value) ? arrayCopy(value) : []);
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      result = isArguments(value)
        ? toPlainObject(value)
        : (isPlainObject(value) ? value : {});
    }
    else {
      isCommon = false;
    }
  }
  // Add the source value to the stack of traversed objects and associate
  // it with its merged value.
  stackA.push(srcValue);
  stackB.push(result);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
  } else if (result === result ? (result !== value) : (value === value)) {
    object[key] = result;
  }
}

module.exports = baseMergeDeep;

},{"../lang/isArguments":126,"../lang/isArray":127,"../lang/isPlainObject":133,"../lang/isTypedArray":135,"../lang/toPlainObject":137,"./arrayCopy":65,"./isArrayLike":114}],90:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],91:[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":80,"./toPath":124}],92:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],93:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],94:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":143}],95:[function(require,module,exports){
(function (global){
/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

module.exports = bufferClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],96:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

module.exports = cacheIndexOf;

},{"../lang/isObject":132}],97:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

module.exports = cachePush;

},{"../lang/isObject":132}],98:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall'),
    restParam = require('../function/restParam');

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../function/restParam":63,"./bindCallback":94,"./isIterateeCall":116}],99:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":107,"./isLength":118,"./toObject":123}],100:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":123}],101:[function(require,module,exports){
(function (global){
var SetCache = require('./SetCache'),
    getNative = require('./getNative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
function createCache(values) {
  return (nativeCreate && Set) ? new SetCache(values) : null;
}

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./SetCache":64,"./getNative":109}],102:[function(require,module,exports){
var restParam = require('../function/restParam');

/**
 * Creates a `_.defaults` or `_.defaultsDeep` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Function} Returns the new defaults function.
 */
function createDefaults(assigner, customizer) {
  return restParam(function(args) {
    var object = args[0];
    if (object == null) {
      return object;
    }
    args.push(customizer);
    return assigner.apply(undefined, args);
  });
}

module.exports = createDefaults;

},{"../function/restParam":63}],103:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isArray = require('../lang/isArray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

module.exports = createForEach;

},{"../lang/isArray":127,"./bindCallback":94}],104:[function(require,module,exports){
var arraySome = require('./arraySome');

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

module.exports = equalArrays;

},{"./arraySome":69}],105:[function(require,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],106:[function(require,module,exports){
var keys = require('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":139}],107:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":90}],108:[function(require,module,exports){
var isStrictComparable = require('./isStrictComparable'),
    pairs = require('../object/pairs');

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"../object/pairs":142,"./isStrictComparable":120}],109:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":131}],110:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],111:[function(require,module,exports){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],112:[function(require,module,exports){
var bufferClone = require('./bufferClone');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

module.exports = initCloneByTag;

},{"./bufferClone":95}],113:[function(require,module,exports){
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

module.exports = initCloneObject;

},{}],114:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":107,"./isLength":118}],115:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],116:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":132,"./isArrayLike":114,"./isIndex":115}],117:[function(require,module,exports){
var isArray = require('../lang/isArray'),
    toObject = require('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":127,"./toObject":123}],118:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],119:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],120:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":132}],121:[function(require,module,exports){
var merge = require('../object/merge');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function mergeDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
}

module.exports = mergeDefaults;

},{"../object/merge":141}],122:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":126,"../lang/isArray":127,"../object/keysIn":140,"./isIndex":115,"./isLength":118}],123:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":132}],124:[function(require,module,exports){
var baseToString = require('./baseToString'),
    isArray = require('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":127,"./baseToString":93}],125:[function(require,module,exports){
var baseClone = require('../internal/baseClone'),
    bindCallback = require('../internal/bindCallback'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it's
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with up to three argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  return typeof customizer == 'function'
    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 3))
    : baseClone(value, isDeep);
}

module.exports = clone;

},{"../internal/baseClone":72,"../internal/bindCallback":94,"../internal/isIterateeCall":116}],126:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":114,"../internal/isObjectLike":119}],127:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":109,"../internal/isLength":118,"../internal/isObjectLike":119}],128:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"../internal/isObjectLike":119,"./isPlainObject":133}],129:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('../internal/isArrayLike'),
    isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike'),
    isString = require('./isString'),
    keys = require('../object/keys');

/**
 * Checks if `value` is empty. A value is considered empty unless it's an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !value.length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"../internal/isArrayLike":114,"../internal/isObjectLike":119,"../object/keys":139,"./isArguments":126,"./isArray":127,"./isFunction":130,"./isString":134}],130:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":132}],131:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":119,"./isFunction":130}],132:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],133:[function(require,module,exports){
var baseForIn = require('../internal/baseForIn'),
    isArguments = require('./isArguments'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * **Note:** This method assumes objects created by the `Object` constructor
 * have no inherited enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  var Ctor;

  // Exit early for non `Object` objects.
  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  // IE < 9 iterates inherited properties before own properties. If the first
  // iterated property is an object's own property then there are no inherited
  // enumerable properties.
  var result;
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  baseForIn(value, function(subValue, key) {
    result = key;
  });
  return result === undefined || hasOwnProperty.call(value, result);
}

module.exports = isPlainObject;

},{"../internal/baseForIn":78,"../internal/isObjectLike":119,"./isArguments":126}],134:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":119}],135:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":118,"../internal/isObjectLike":119}],136:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],137:[function(require,module,exports){
var baseCopy = require('../internal/baseCopy'),
    keysIn = require('../object/keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable
 * properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return baseCopy(value, keysIn(value));
}

module.exports = toPlainObject;

},{"../internal/baseCopy":73,"../object/keysIn":140}],138:[function(require,module,exports){
var createDefaults = require('../internal/createDefaults'),
    merge = require('./merge'),
    mergeDefaults = require('../internal/mergeDefaults');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = createDefaults(merge, mergeDefaults);

module.exports = defaultsDeep;

},{"../internal/createDefaults":102,"../internal/mergeDefaults":121,"./merge":141}],139:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":109,"../internal/isArrayLike":114,"../internal/shimKeys":122,"../lang/isObject":132}],140:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":115,"../internal/isLength":118,"../lang/isArguments":126,"../lang/isArray":127,"../lang/isObject":132}],141:[function(require,module,exports){
var baseMerge = require('../internal/baseMerge'),
    createAssigner = require('../internal/createAssigner');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * overwrite property assignments of previous sources. If `customizer` is
 * provided it's invoked to produce the merged values of the destination and
 * source properties. If `customizer` returns `undefined` merging is handled
 * by the method instead. The `customizer` is bound to `thisArg` and invoked
 * with five arguments: (objectValue, sourceValue, key, object, source).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 *
 * // using a customizer callback
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(object, other, function(a, b) {
 *   if (_.isArray(a)) {
 *     return a.concat(b);
 *   }
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var merge = createAssigner(baseMerge);

module.exports = merge;

},{"../internal/baseMerge":88,"../internal/createAssigner":98}],142:[function(require,module,exports){
var keys = require('./keys'),
    toObject = require('../internal/toObject');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"../internal/toObject":123,"./keys":139}],143:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],144:[function(require,module,exports){
var baseProperty = require('../internal/baseProperty'),
    basePropertyDeep = require('../internal/basePropertyDeep'),
    isKey = require('../internal/isKey');

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":90,"../internal/basePropertyDeep":91,"../internal/isKey":117}],145:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],146:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],147:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":146,"_process":145,"inherits":55}]},{},[17]);
