(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
	return [ { test: "wordCount", result: this.preProcessor.__store.wordcountNoTags } ];
};

/**
 * Checks if keyword is present, if not returns 0
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keyphraseSizeCheck = function() {
	var result = [ { test: "keyphraseSizeCheck", result: 0 } ];
	var keyword = this.stringHelper.sanitizeKeyword( this.config.keyword );
	if ( keyword !== "" ) {
		result[ 0 ].result = keyword.split( /\s/g ).length;
	}
	return result;
};

/**
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
YoastSEO.Analyzer.prototype.keywordDensity = function() {
	var result = [ { test: "keywordDensity", result: 0 } ];
	if ( this.preProcessor.__store.wordcount > 100 ) {
		var keywordDensity = this.keywordDensityCheck();
		result[ 0 ].result = keywordDensity.toFixed( 1 );
		return result;
	}
};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
YoastSEO.Analyzer.prototype.keywordDensityCheck = function() {
	var keywordCount = this.keywordCount();
	var keywordDensity = 0;
	if ( keywordCount !== 0 ) {
		keywordDensity = (
				keywordCount /
				this.preProcessor.__store.wordcountNoTags - ( keywordCount - 1 * keywordCount )
			) *
			100;
	}
	return keywordDensity;
};

/**
 * counts the number of keyword occurrences of the keyword. Saves this in the __store and returns
 * it.
 * @returns keywordCount
 */
YoastSEO.Analyzer.prototype.keywordCount = function() {
	var keywordMatches = this.preProcessor.__store.cleanTextSomeTags.match( this.keywordRegex );

	var keywordCount = 0;
	if ( keywordMatches !== null ) {
		keywordCount = keywordMatches.length;
	}
	this.__store.keywordCount = keywordCount;
	return keywordCount;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
YoastSEO.Analyzer.prototype.subHeadings = function() {
	var result = [ { test: "subHeadings", result: { count: 0, matches: 0 } } ];

	//matches everything from H1-H6 openingtags untill the closingtags.
	var matches = this.preProcessor.__store.cleanTextSomeTags.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );
	if ( matches !== null ) {
		result[ 0 ].result.count = matches.length;
		result[ 0 ].result.matches = this.subHeadingsCheck( matches );
	}
	return result;
};

/**
 * subHeadings checker to check if keyword is present in given headings.
 * @param matches
 * @returns {number}
 */
YoastSEO.Analyzer.prototype.subHeadingsCheck = function( matches ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {
			var formattedHeaders = this.stringHelper.replaceString(
				matches[ i ],
				this.config.wordsToRemove
			);
			if (
				formattedHeaders.match( this.keywordRegex ) ||
				matches[ i ].match( this.keywordRegex )
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};

/**
 * check if the keyword contains stopwords.
 * @returns {result object}
 */
YoastSEO.Analyzer.prototype.stopwords = function() {
	var keyword = this.config.keyword;
	var stopWord, stopWordCount = 0;
	var matchesText = "";

	for ( var i = 0; i < this.config.stopWords.length; i++ ) {
		stopWord = this.config.stopWords[ i ];

		if ( keyword.match( this.stringHelper.getWordBoundaryRegex( stopWord ) ) !== null ) {
			matchesText += stopWord + ", ";
			stopWordCount++;
		}
	}

	return [ {
		test: "stopwordKeywordCount",
		result: {
			count: stopWordCount,
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
	if ( this.preProcessor.__store.wordcountNoTags > 0 ) {
		var score = (
			206.835 -
				(
					1.015 *
						(
							this.preProcessor.__store.wordcountNoDigits /
							this.preProcessor.__store.sentenceCountNoTags
						)
					) -
						(
							84.6 *
						(
					this.preProcessor.__store.syllablecount /
					this.preProcessor.__store.wordcountNoDigits
				)
			)
		)
		.toFixed( 1 );
		if ( score < 0 ) {
			score = 0;
		} else if ( score > 100 ) {
			score = 100;
		}
		return [ { test: "fleschReading", result: score } ];
	}
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

	//regex matches everything between <a> and </a>
	var linkMatches = this.preProcessor.__store.originalText.match(
		/<a(?:[^>]+)?>(.*?)<\/a>/ig
	);
	var linkCount = {
		total: 0,
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
	if ( linkMatches !== null ) {
		linkCount.total = linkMatches.length;
		for ( var i = 0; i < linkMatches.length; i++ ) {
			var linkKeyword = this.linkKeyword( linkMatches[ i ] );
			if ( linkKeyword ) {
				if ( this.config.keyword !== "" ) {
					linkCount.totalKeyword++;
				} else {
					linkCount.totalNaKeyword++;
				}
			}
			var linkType = this.linkType( linkMatches[ i ] );
			linkCount[ linkType + "Total" ]++;
			var linkFollow = this.linkFollow( linkMatches[ i ] );
			linkCount[ linkType + linkFollow ]++;
		}
	}
	linkCount = this.linkResult( linkCount );
	return [ { test: "linkCount", result: linkCount } ];
};

/**
 * Checks the linktype of the given url against the URL stored in the config.
 * @param url
 * @returns {string}
 */
YoastSEO.Analyzer.prototype.linkType = function( url ) {
	var linkType = "other";

	//matches all links that start with http:// and https://, case insensitive and global
	if ( url.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";
		var urlMatch = url.match( this.config.baseUrl );
		if ( urlMatch !== null && urlMatch[ 0 ].length !== 0 ) {
			linkType = "internal";
		}
	}
	return linkType;
};

/**
 * checks if the URL has a nofollow attribute
 * @param url
 * @returns {string}
 */
YoastSEO.Analyzer.prototype.linkFollow = function( url ) {
	var linkFollow = "Dofollow";

	//matches all nofollow links, case insensitive and global
	if ( url.match( /rel=([\'\"])nofollow\1/ig ) !== null ) {
		linkFollow = "Nofollow";
	}
	return linkFollow;
};

/**
 * checks if the url contains the keyword
 * @param url
 * @returns {boolean}
 */
YoastSEO.Analyzer.prototype.linkKeyword = function( url ) {
	var keywordFound = false;

	var formatUrl = url.match( />(.*)/ig );
	if ( formatUrl !== null ) {
		formatUrl = formatUrl[0].replace( /<.*?>\s?/ig, "" );
		if ( formatUrl.match( this.keywordRegex ) !== null ) {
		keywordFound = true;
		}
	}
	return keywordFound;
};

/**
 * checks if the links are all followed or not, and saves this in the resultobject, to be used for
 * scoring
 */
YoastSEO.Analyzer.prototype.linkResult = function( obj ) {
	var result = obj;
	result.externalHasNofollow = false;
	result.externalAllNofollow = false;
	result.externalAllDofollow = false;
	result.internalAllDofollow = false;
	result.noExternal = false;
	if ( result.externalTotal !== result.externalDofollow && result.externalTotal > 0 ) {
		result.externalHasNofollow = true;
	}
	if ( result.externalTotal === result.externalNofollow && result.externalTotal > 0 ) {
		result.externalAllNofollow = true;
	}
	if ( result.externalTotal === result.externalDofollow && result.externalTotal > 0 ) {
		result.externalAllDofollow = true;
	}
	if ( result.total === result.internalDofollow && result.internalTotal > 0 ) {
		result.internalAllDofollow = true;
	}
	if ( result.total === ( result.internalTotal + result.otherTotal ) ) {
		result.noExternal = true;
	}
	return result;
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
	var imageCount = { total: 0, alt: 0, noAlt: 0, altKeyword: 0, altNaKeyword: 0 };

	//matches everything in the <img>-tag, case insensitive and global
	var imageMatches = this.preProcessor.__store.originalText.match( /<img(?:[^>]+)?>/ig );
	if ( imageMatches !== null ) {
		imageCount.total = imageMatches.length;
		for ( var i = 0; i < imageMatches.length; i++ ) {

			//matches everything in the alt attribute, case insensitive and global.
			var alttag = imageMatches[ i ].match( /alt=([\'\"])(.*?)\1/ig );
			if ( this.imageAlttag( alttag ) ) {
				if ( this.config.keyword !== "" ) {
					if ( this.imageAlttagKeyword( alttag ) ) {
						imageCount.altKeyword++;
					} else {

						//this counts all alt-tags w/o the keyword when a keyword is set.
						imageCount.alt++;
					}
				} else {
					imageCount.altNaKeyword++;
				}
			} else {
				imageCount.noAlt++;
			}
		}
	}
	return [ { test: "imageCount", result: imageCount } ];
};

/**
 * checks if  the alttag contains any text.
 * @param image
 * @returns {boolean}
 */
YoastSEO.Analyzer.prototype.imageAlttag = function( image ) {
	var hasAlttag = false;
	if ( image !== null ) {
		var alt = image[ 0 ].split( "=" )[ 1 ];

		//Checks if the alttag of the given image isn't empty after whitespaces are removed.
		if ( alt !== null && this.stringHelper.stripSpaces( alt.replace( /[\'\"]*/g, "" ) ) !== "" ) {
			hasAlttag = true;
		}
	}
	return hasAlttag;
};

/**
 * checks if the alttag matches the keyword
 * @param image
 * @returns {boolean}
 */
YoastSEO.Analyzer.prototype.imageAlttagKeyword = function( image ) {
	var hasKeyword = false;
	if ( image !== null ) {
		if ( this.preProcessor.replaceDiacritics( image[ 0 ] ).match( this.keywordRegex ) !== null ) {
			hasKeyword = true;
		}
	}
	return hasKeyword;
};

/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */

YoastSEO.Analyzer.prototype.pageTitleLength = function() {
	var count = 0;
	if ( typeof this.config.pageTitle !== "undefined" ) {
		count = this.config.pageTitle.length;
	}
	return [ { test: "pageTitleLength", result: count } ];
};

/**
 * counts the occurrences of the keyword in the pagetitle, returns 0 if pagetitle is empty or not
 * set.
 *
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.pageTitleKeyword = function() {
	var result = [ { test: "pageTitleKeyword", result: { matches: 0, position: 0 } } ];
	if ( typeof this.config.pageTitle !== "undefined" ) {
		result[ 0 ].result.matches = this.stringHelper.countMatches(
			this.config.pageTitle,
			this.stringHelper.getWordBoundaryRegex( this.config.keyword )
		);
		result[ 0 ].result.position = this.config.pageTitle.toLocaleLowerCase().indexOf( this.config.keyword.toLocaleLowerCase() );
	}
	return result;
};

/**
 * counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.firstParagraph = function() {
	var result = [ { test: "firstParagraph", result: 0 } ];

	//matches everything between the <p> and </p> tags.
	var p = this.paragraphChecker(
		this.preProcessor.__store.cleanTextSomeTags,
		new RegExp( "<p(?:[^>]+)?>(.*?)<\/p>", "ig" )
	);

	if ( p === 0 ) {

		//use a regex that matches [^], not nothing, so any character, including linebreaks
		p = this.paragraphChecker(
			this.preProcessor.__store.originalText,
			new RegExp( "[^]*?\n\n", "ig" )
		);

		/*
		 * If there is no match yet
		 * And there are no paragraph tags
		 * And there are not double newline
		 * Then we are dealing with a single paragraph and we should just use the keyword count in the full text.
		 */
		if (
			p === 0 &&
			this.preProcessor.__store.originalText.indexOf( "\n\n" ) === -1 &&
			this.preProcessor.__store.originalText.indexOf( "</p>" ) === -1
		) {
			p = this.keywordCount();
		}
	}
	result[ 0 ].result = p;
	return result;
};

/**
 * checks if the keyword is found in the given textString.
 * @param textString
 * @param regexp
 * @returns count
 */
YoastSEO.Analyzer.prototype.paragraphChecker = function( textString, regexp ) {
	var matches = textString.match( regexp );
	var count = 0;
	if ( matches !== null ) {
		count = this.stringHelper.countMatches( matches[ 0 ], this.keywordRegex );
	}
	return count;
};

/**
 * counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is
 * empty or not set. Default is -1, if the meta is empty, this way we can score for empty meta.
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.metaDescriptionKeyword = function() {
	var result = [ { test: "metaDescriptionKeyword", result: -1 } ];
	if ( typeof this.config.meta !== "undefined" && this.config.meta.length > 0 && this.config.keyword !== "" ) {
		result[ 0 ].result = this.stringHelper.countMatches(
			this.config.meta, this.stringHelper.getWordBoundaryRegex( this.config.keyword )
		);
	}
	return result;
};

/**
 * returns the length of the metadescription
 * @returns {{test: string, result: Number}[]}
 */
YoastSEO.Analyzer.prototype.metaDescriptionLength = function() {
	var result = [ { test: "metaDescriptionLength", result: 0 } ];
	if ( typeof this.config.meta !== "undefined" ) {
		result[0].result = this.config.meta.length;
	}
	return result;
};

/**
 * counts the occurences of the keyword in the URL, returns 0 if no URL is set or is empty.
 * @returns {{name: string, count: number}}
 */
YoastSEO.Analyzer.prototype.urlKeyword = function() {
	var result = [ { test: "urlKeyword", result: 0 } ];
	if ( typeof this.config.url !== "undefined" ) {
		result[ 0 ].result = this.stringHelper.countMatches(
			this.config.url, this.keywordRegexInverse
		);
	}
	return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.urlLength = function() {
	var result = [ { test: "urlLength", result: { urlTooLong: false } } ];
	if ( typeof this.config.url !== "undefined" ) {
		var length = this.config.url.length;
		if (
			length > this.config.maxUrlLength &&
			length > this.config.maxSlugLength + this.config.keyword.length
		) {
			result[ 0 ].result.urlTooLong = true;
		}
	}
	return result;
};

/**
 * checks if there are stopwords used in the URL.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.urlStopwords = function() {
	var result = [ { test: "urlStopwords", result: 0 } ];
	if ( typeof this.config.url !== "undefined" ) {
		var stopwords = this.stringHelper.matchString( this.config.url, this.config.stopWords );
		if ( stopwords !== null ) {
			result[ 0 ].result = stopwords.length;
		}
	}
	return result;
};

/**
 * checks if the keyword has been used before. Uses usedkeywords array. If empty, returns 0.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keywordDoubles = function() {
	var result = [ { test: "keywordDoubles", result: { count: 0, id: 0 } } ];
	if ( typeof this.config.keyword !== "undefined" ) {
		if ( typeof this.config.usedKeywords !== "undefined" && typeof this.config.usedKeywords[ this.config.keyword ] !== "undefined" ) {
			result[ 0 ].result.count = this.config.usedKeywords[ this.config.keyword ].length;
			if ( result[ 0 ].result.count === 1 ) {
				result[ 0 ].result.id = this.config.usedKeywords[ this.config.keyword ][ 0 ];
			}
		}
	}
	return result;
};

/**
 * runs the scorefunction of the analyzeScorer with the generated output that is used as a queue.
 */
YoastSEO.Analyzer.prototype.score = function() {
	this.analyzeScorer.score( this.__output );
};

/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

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

/* jshint browser: true */
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

		this.rawData.title = data.title;
		this.rawData.url = data.url;
		this.rawData.snippetMeta = data.metaDesc;
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
 */
YoastSEO.App.prototype.createSnippetPreview = function() {
	var SnippetPreview = require( "../js/snippetPreview.js" );

	var targetElement = document.getElementById( this.config.targets.snippet );

	this.snippetPreview = new SnippetPreview( this );
	this.snippetPreview.setTargetElement( targetElement );
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
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div id="snippet_preview">\n    <button class="snippet-editor__edit_button js-snippet-editor-edit" type="button">\n        <span class="screen-reader-text">{{i18n.edit}}</span>\n    </button>\n    <div class="snippet_container" id="title_container">\n        <span class="title" id="snippet_title">\n            ' +
    __e( rendered.title ) +
    '\n        </span>\n        <span class="title" id="snippet_sitename"></span>\n    </div>\n    <div class="snippet_container" id="url_container">\n        <cite class="url urlBase" id="snippet_citeBase">\n            ' +
    __e( rendered.baseUrl ) +
    '\n        </cite>\n        <cite class="url" id="snippet_cite">\n            ' +
    __e( rendered.snippetCite ) +
    '\n        </cite>\n    </div>\n    <div class="snippet_container" id="meta_container">\n        <span class="desc" id="snippet_meta">\n            ' +
    __e( rendered.meta ) +
    '\n        </span>\n    </div>\n\n    <div class="snippet-editor__form">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" />\n        </label>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description">' +
    __e( raw.meta ) +
    '</textarea>\n        </label>\n\n        <button class="snippet-editor__submit js-snippet-editor-save" type="button">' +
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
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is more than the %2$d word recommended minimum.")
                },
                {
                    min: 250,
                    max: 299,
                    score: 7,

                    /* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is slightly below the %2$d word recommended minimum. Add a bit more copy.")
                },
                {
                    min: 200,
                    max: 249,
                    score: 5,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 100,
                    max: 199,
                    score: -10,

                    /* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.")
                },
                {
                    min: 0,
                    max: 99,
                    score: -20,

                    /* translators: %1$d expands to the number of words in the text */
                    text: i18n.dgettext('js-text-analysis', "The text contains %1$d words. This is far too low and should be increased.")
                }
            ],
            replaceArray: [
                {name: "wordCount", position: "%1$d", source: "matcher"},
                {name: "recommendedWordcount", position: "%2$d", value: 300}

            ]
        },{
			scoreName: "keyphraseSizeCheck",
			scoreArray: [
				{
					max: 0,
					score: -999,
					text: i18n.dgettext('js-text-analysis', "No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.")
				},
				{
					min: 11,
					score: 0,
					text: i18n.dgettext('js-text-analysis', "Your keyphrase is over 10 words, a keyphrase should be shorter.")
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
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is way over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 2.51,
                    max: 3.49,
                    score: -10,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is over the advised 2.5% maximum; the focus keyword was found %2$d times.")
                },
                {
                    min: 0.5,
                    max: 2.50,
                    score: 9,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is great; the focus keyword was found %2$d times.")
                },
                {
                    min: 0,
                    max: 0.49,
                    score: 4,

                    /* translators: %1$f expands to the keyword density percentage, %2$d expands to the number of times the keyword is found */
                    text: i18n.dgettext('js-text-analysis', "The keyword density is %1$f%, which is a bit low; the focus keyword was found %2$d times.")
                }
            ],
            replaceArray: [
                {name: "keywordDensity", position: "%1$f", source: "matcher"},
                {name: "keywordCount", position: "%2$d", sourceObj: ".refObj.__store.keywordCount"}
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
                    text: i18n.dgettext('js-text-analysis', "No outbound links appear in this page, consider adding some as appropriate.")
                },
				{
					type: "internalAllDofollow",
					score: 6,
					text: i18n.dgettext('js-text-analysis', "No outbound links appear in this page, consider adding some as appropriate.")
				},{
					type: "noExternal",
					score: 6,
					text: i18n.dgettext('js-text-analysis', "No outbound links appear in this page, consider adding some as appropriate.")
				},
				{
					matcher: "totalNaKeyword",
					min: 1,
					score: 2,
					text: i18n.dgettext('js-text-analysis', "Outbound links appear in this page")
				},
                {
                    matcher: "totalKeyword",
                    min: 1,
                    score: 2,
                    text: i18n.dgettext('js-text-analysis', "You\'re linking to another page with the focus keyword you want this page to rank for. Consider changing that if you truly want this page to rank.")
                },

                /* translators: %2$s expands the number of outbound links */
                {type: "externalAllNofollow", score: 7, text: i18n.dgettext('js-text-analysis', "This page has %2$s outbound link(s), all nofollowed.")},
                {
                    type: "externalHasNofollow",
                    score: 8,

                    /* translators: %2$s expands to the number of nofollow links, %3$s to the number of outbound links */
                    text: i18n.dgettext('js-text-analysis', "This page has %2$s nofollowed link(s) and %3$s normal outbound link(s).")
                },

                /* translators: %1$s expands to the number of outbound links */
                {type: "externalAllDofollow", score: 9, text: i18n.dgettext('js-text-analysis', "This page has %1$s outbound link(s).")}
            ],
            replaceArray: [
                {name: "links", position: "%1$s", sourceObj: ".result.externalTotal"},
                {name: "nofollow", position: "%2$s", sourceObj: ".result.externalNofollow"},
                {name: "dofollow", position: "%3$s", sourceObj: ".result.externalDofollow"}
            ]
        },
        {
            scoreName: "fleschReading",
            scoreArray: [
                {min: 90, score: 9, text: "{{text}}", resultText: "very easy", note: ""},
                {min: 80, max: 89.9, score: 9, text: "{{text}}", resultText: "easy", note: ""},
                {min: 70, max: 79.9, score: 8, text: "{{text}}", resultText: "fairly easy", note: ""},
                {min: 60, max: 69.9, score: 8, text: "{{text}}", resultText: "ok", note: ""},
                {
                    min: 50,
                    max: 59.9,
                    score: 6,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences to improve readability.")
                },
                {
                    min: 30,
                    max: 49.9,
                    score: 5,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences, using less difficult words to improve readability.")
                },
                {
                    min: 0,
                    max: 29.9,
                    score: 4,
                    text: "{{text}}",
                    resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
                    note: i18n.dgettext('js-text-analysis', "Try to make shorter sentences, using less difficult words to improve readability.")
                }
            ],
            replaceArray: [
                {
                    name: "scoreText",
                    position: "{{text}}",

                    /* translators: %1$s expands to the numeric flesh reading ease score, %2$s to a link to a Yoast.com article about Flesh ease reading score, %3$s to the easyness of reading, %4$s expands to a note about the flesh reading score. */
                    value: i18n.dgettext('js-text-analysis', "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s")
                },
                {name: "text", position: "%1$s", sourceObj: ".result"},
                {
                    name: "scoreUrl",
                    position: "%2$s",
                    value: "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>"
                },
                {name: "resultText", position: "%3$s", scoreObj: "resultText"},
                {name: "note", position: "%4$s", scoreObj: "note"}
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
                    text: i18n.dgettext('js-text-analysis', "No meta description has been specified, search engines will display copy from the page instead.")
                },
                {
                    max: 120,
                    score: 6,

                    /* translators: %1$d expands to the minimum length for the meta description, %2$d to the maximum length for the meta description */
                    text: i18n.dgettext('js-text-analysis', "The meta description is under %1$d characters, however up to %2$d characters are available.")
                },
                {
                    min: 157,
                    score: 6,

                    /* translators: %2$d expands to the maximum length for the meta description */
                    text: i18n.dgettext('js-text-analysis', "The specified meta description is over %2$d characters. Reducing it will ensure the entire description is visible")
                },
                {
                    min: 120,
                    max: 157,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?")
                }
            ],
            replaceArray: [
                {name: "minCharacters", position: "%1$d", value: 120},
                {name: "maxCharacters", position: "%2$d", value: 156}
            ]
        },
        {
            scoreName: "metaDescriptionKeyword",
            scoreArray: [
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The meta description contains the focus keyword.")},
                {
                    max: 0,
					min: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "A meta description has been specified, but it does not contain the focus keyword.")
                }
            ]
        }, {
            scoreName: "firstParagraph",
            scoreArray: [
                {
                    max: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "The focus keyword doesn\'t appear in the first paragraph of the copy. Make sure the topic is clear immediately.")
                },
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The focus keyword appears in the first paragraph of the copy.")}
            ]
        }, {
            scoreName: "stopwordKeywordCount",
            scoreArray: [
                {
                    matcher: "count",
                    min: 1,
                    score: 5,

                    /* translators: %1$s expands to a link to the wikipedia article about stop words, %2$s expands to the actual stop words found in the text */
                    text: i18n.dgettext('js-text-analysis', "The focus keyword for this page contains one or more %1$s, consider removing them. Found \'%2$s\'.")
                },
                {matcher: "count", max: 0, score: 0, text: ""}
            ],
            replaceArray: [
                {
                    name: "scoreUrl",
                    position: "%1$s",
                    value: i18n.dgettext( "js-text-analysis", "<a href='https://en.wikipedia.org/wiki/Stop_words' target='new'>stop words</a>" )
                },
                {name: "stopwords", position: "%2$s", sourceObj: ".result.matches"}
            ]
        }, {
            scoreName: "subHeadings",
            scoreArray: [
                {matcher: "count", max: 0, score: 7, text: i18n.dgettext('js-text-analysis', "No subheading tags (like an H2) appear in the copy.")},
                {
                    matcher: "matches",
                    max: 0,
                    score: 3,
                    text: i18n.dgettext('js-text-analysis', "You have not used your focus keyword in any subheading (such as an H2) in your copy.")
                },
                {
                    matcher: "matches",
                    min: 1,
                    score: 9,

                    /* translators: %1$d expands to the number of subheadings, %2$d to the number of subheadings containing the focus keyword */
                    text: i18n.dgettext('js-text-analysis', "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. While not a major ranking factor, this is beneficial.")
                }
            ],
            replaceArray: [
                {name: "count", position: "%1$d", sourceObj: ".result.count"},
                {name: "matches", position: "%2$d", sourceObj: ".result.matches"}
            ]
        }, {
            scoreName: "pageTitleLength",
            scoreArray: [
                {max: 0, score: 1, text: i18n.dgettext('js-text-analysis', "Please create a page title.")},
                {
                    max: 39,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %1$d to the minimum number of characters for the title */
                    text: i18n.dgettext('js-text-analysis', "The page title contains %3$d characters, which is less than the recommended minimum of %1$d characters. Use the space to add keyword variations or create compelling call-to-action copy.")
                },
                {
                    min: 71,
                    score: 6,

                    /* translators: %3$d expands to the number of characters in the page title, %2$d to the maximum number of characters for the title */
                    text: i18n.dgettext('js-text-analysis', "The page title contains %3$d characters, which is more than the viewable limit of %2$d characters; some words will not be visible to users in your listing.")
                },
                {
                    min: 40,
                    max: 70,
                    score: 9,

                    /* translators: %1$d expands to the minimum number of characters in the page title, %2$d to the maximum number of characters */
                    text: i18n.dgettext('js-text-analysis', "The page title is between the %1$d character minimum and the recommended %2$d character maximum.")
                }
            ],
            replaceArray: [
                {name: "minLength", position: "%1$d", value: 40},
                {name: "maxLength", position: "%2$d", value: 70},
                {name: "length", position: "%3$d", source: "matcher"}
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
                    text: i18n.dgettext('js-text-analysis', "The focus keyword '%1$s' does not appear in the page title.")
                },
                {
                    matcher: "position",
                    max: 1,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "The page title contains the focus keyword, at the beginning which is considered to improve rankings.")
                },
                {
                    matcher: "position",
                    min: 1,
                    score: 6,
                    text: i18n.dgettext('js-text-analysis', "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.")
                }
            ],
            replaceArray: [
                {name: "keyword", position: "%1$s", sourceObj: ".refObj.config.keyword"}
            ]
        }, {
            scoreName: "urlKeyword",
            scoreArray: [
                {min: 1, score: 9, text: i18n.dgettext('js-text-analysis', "The focus keyword appears in the URL for this page.")},
                {
                    max: 0,
                    score: 6,
                    text: i18n.dgettext('js-text-analysis', "The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!")
                }
            ]
        }, {
            scoreName: "urlLength",
            scoreArray: [
                {type: "urlTooLong", score: 5, text: i18n.dgettext('js-text-analysis', "The slug for this page is a bit long, consider shortening it.")}
            ]
        }, {
            scoreName: "urlStopwords",
            scoreArray: [
                {
                    min: 1,
                    score: 5,
					/* translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
                    text: i18n.dgettext('js-text-analysis', "The slug for this page contains one or more %1$sstop words%2$s, consider removing them.")
                }
			],
			replaceArray: [
				{
					name: "url",
					position: "%1$s",
					/* translators: this link is referred to in the content analysis when a slug contains one or more stop words */
					value: "<a href='" + i18n.dgettext( 'js-text-analysis', "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>"
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
                    text: i18n.dgettext('js-text-analysis', "No images appear in this page, consider adding some as appropriate.")
                },
                {
					matcher: "noAlt",
					min: 1,
					score: 5,
					text: i18n.dgettext('js-text-analysis', "The images on this page are missing alt tags.")
				},
				{
					matcher: "altNaKeyword",
					min: 1,
					score: 5,
					text: i18n.dgettext('js-text-analysis', "The images on this page contain alt tags")
				},
                {
                    matcher: "altKeyword",
                    min: 1,
                    score: 9,
                    text: i18n.dgettext('js-text-analysis', "The images on this page contain alt tags with the focus keyword.")
                },
                {
                    matcher: "alt",
                    min: 1,
                    score: 5,
                    text: i18n.dgettext('js-text-analysis', "The images on this page do not have alt tags containing your focus keyword.")
                }
            ]
        }, {
            scoreName: "keywordDoubles",
            scoreArray: [
                {matcher: "count", max: 0, score: 9, text: i18n.dgettext('js-text-analysis', "You've never used this focus keyword before, very good.")},
                {
                    matcher: "count",
                    max: 1,
                    score: 6,

                    /* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
                    text: i18n.dgettext('js-text-analysis', "You've used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword.")
                },
                {
                    matcher: "count",
                    min: 1,
                    score: 1,

                    /* translators: %3$s and $2$s expand to the admin search page for the focus keyword, %4$d expands to the number of times this focus keyword has been used before, %5$s and %6$s expand to a link to an article on yoast.com about cornerstone content */
                    text: i18n.dgettext('js-text-analysis', "You've used this focus keyword %3$s%4$d times before%2$s, it's probably a good idea to read %6$sthis post on cornerstone content%5$s and improve your keyword strategy.")
                }
            ],
            replaceArray: [
                {name: "singleUrl", position: "%1$s", sourceObj: ".refObj.config.postUrl", rawOutput: true},
                {name: "endTag", position: "%2$s", value: "</a>"},
                {name: "multiUrl", position: "%3$s", sourceObj: ".refObj.config.searchUrl", rawOutput: true},
                {name: "occurrences", position: "%4$d", sourceObj: ".result.count"},
                {name: "endTag", position: "%5$s", value: "</a>"},
                {
                    name: "cornerstone",
                    position: "%6$s",
                    value: "<a href='https://yoast.com/cornerstone-content-rank/' target='new'>"
                },
                {name: "id", position: "{id}", sourceObj: ".result.id"},
                {name: "keyword", position: "{keyword}", sourceObj: ".refObj.config.keyword"}
            ]
        }
    ];
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../js/snippetPreview.js":2,"jed":4,"lodash/lang/isUndefined":45}],2:[function(require,module,exports){
/* jshint browser: true */
/* global YoastSEO: false */

var _ = {
	isObject: require( "lodash/lang/isObject" ),
	isEmpty: require( "lodash/lang/isEmpty" ),
	clone: require( "lodash/lang/clone" ),
	defaultsDeep: require( "lodash/object/defaultsDeep" )
};

var defaults = {
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	baseURL: "http://example.com/"
};

/**
 * @module snippetPreview
 */

/**
 * defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                      - Snippet preview options.
 * @param {App}            opts.analyzerApp          - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder          - The fallback values for the snippet preview rendering.
 * @param {string}         opts.placeholder.title    - The fallback value for the title.
 * @param {string}         opts.placeholder.metaDesc - The fallback value for the meta description.
 * @param {string}         opts.placeholder.urlPath  - The fallback value for the URL path.
 *
 * @param {string}         opts.baseURL              - The basic URL as it will be displayed in google.
 *
 * @property {App}         refObj                    - The connected app object.
 * @property {Jed}         i18n                      - The translation object.
 *
 * @property {HTMLElement} targetElement             - The target element that contains this snippet editor.
 *
 * @property {Object}      element                   - The elements for this snippet editor.
 * @property {Object}      element.rendered          - The rendered elements.
 * @property {HTMLElement} element.rendered.title    - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath  - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase  - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc - The rendered meta description element.
 *
 * @property {Object}      element.input             - The input elements.
 * @property {HTMLElement} element.input.title       - The title input element.
 * @property {HTMLElement} element.input.urlPath     - The url path input element.
 * @property {HTMLElement} element.input.metaDesc    - The meta description input element.
 *
 * @property {Object}      data                      - The data for this snippet editor.
 * @property {string}      data.title                - The title.
 * @property {string}      data.urlPath              - The url path.
 * @property {string}      data.metaDesc             - The meta description.
 *
 * @property {string}      baseURL                   - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {

	// Accept an App object for backwards compatibility
	if ( _.isObject( opts ) && opts instanceof YoastSEO.App ) {
		opts = {
			analyzerApp: opts
		};
	}

	// base URL

	// Placeholder title
	// Placeholder slug
	// Placeholder meta description

	_.defaultsDeep( opts, defaults );

	this.refObj = opts.analyzerApp;
	this.i18n = this.refObj.i18n;
	this.opts = opts;

	this.unformattedText = {
		snippet_cite: this.refObj.rawData.snippetCite || "",
		snippet_meta: this.refObj.rawData.snippetMeta || "",
		snippet_title: this.refObj.rawData.snippetTitle || ""
	};

	this.data = {
		title: this.refObj.rawData.snippetTitle || "",
		urlPath: this.refObj.rawData.snippetCite || "",
		metaDesc: this.refObj.rawData.snippetMeta || ""
	};
};

/**
 * Set the target element the snippet editor should be rendered in.
 *
 * @param {HTMLElement} targetElement The element the editor should be rendered in.
 */
SnippetPreview.prototype.setTargetElement = function( targetElement ) {
	if ( _.isObject( targetElement ) ) {
		this.targetElement = targetElement;
	}
};

/**
 * Renders snippet editor and adds it to the targetElement
 */
SnippetPreview.prototype.renderTemplate = function() {
	var snippetEditorTemplate = require( "../js/templates.js" ).snippetEditor;

	this.targetElement.innerHTML = snippetEditorTemplate( {
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
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit meta fields (title, url, description)" ),
			title: this.i18n.dgettext( "js-text-analysis", "Meta title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" )
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
			title: this.targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			urlPath: this.targetElement.getElementsByClassName( "js-snippet-editor-slug" )[0],
			metaDesc: this.targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[0]
		}
	};
};

/**
 * Refreshes the snippet editor rendered HTML
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
};

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL. But the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !_.isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object}
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    this.data.title,
		url:      getBaseURL.call( this ) + this.data.urlPath,
		metaDesc: this.data.metaDesc
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
	if ( _.isEmpty( title ) ) {
		title = this.refObj.config.sampleText.title;
	}

	// TODO: Replace this with the stripAllTags module.
	title = this.refObj.stringHelper.stripAllTags( title );

	// If a keyword is set we want to highlight it in the title.
	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
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

	//removes the http(s) part of the url
	return url.replace( /https?:\/\//ig, "" );
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
	if ( _.isEmpty( cite ) ) {
		cite = this.refObj.config.sampleText.snippetCite;
	}

	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

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
	if ( _.isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// TODO: Replace this with the stripAllTags module.
	meta = this.refObj.stringHelper.stripAllTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );

	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
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
	if ( typeof this.refObj.rawData.excerpt !== "undefined" ) {
		metaText = this.refObj.rawData.excerpt;
	}
	if ( typeof this.refObj.rawData.text !== "undefined" ) {
		metaText = this.refObj.rawData.text;
	}
	if ( _.isEmpty( metaText ) ) {
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
	var keywordRegex = YoastSEO.getStringHelper().getWordBoundaryRegex( dashedKeyword );

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
 * Sets the classname of the meta field in the snippet, based on the rawData.snippetMeta
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var cssClass = "desc-default";
	if ( this.refObj.rawData.meta === "" ) {
		cssClass = "desc-render";
	}
	document.getElementById( "snippet_meta" ).className = "desc " + cssClass;
};

/**
 * function to call init, to rerender the snippetpreview
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
SnippetPreview.prototype.disableEnter = function( ev ) {
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
 * Adds and remove the tooLong class when a text is too long.
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {
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
SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 */
SnippetPreview.prototype.hideEditIcon = function() {
	var elems = document.getElementsByClassName( "editIcon " );
	for ( var i = 0; i < elems.length; i++ ) {
		elems[ i ].className = "snippet_container";
	}
};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {
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

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement, saveForm, editButton,
		elems = [ "title", "slug", "meta-description" ];

	for ( var i = 0; i < elems.length; i++ ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elems[ i ] );
		targetElement = targetElement[0];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "keydown", this.disableEnter.bind( this ) );

		targetElement.addEventListener( "blur", this.refObj.callbacks.updateSnippetValues );
	}

	editButton = document.getElementsByClassName( "js-snippet-editor-edit" );
	saveForm = document.getElementsByClassName( "js-snippet-editor-save" );

	editButton[0].addEventListener( "click", this.editSnippet.bind( this ) );
	saveForm[0].addEventListener( "click", this.saveSnippet.bind( this ) );
};

SnippetPreview.prototype.changedInput = function() {
	this.updateDataFromDOM();

	this.refresh();

	this.refObj.refresh.call( this.refObj );
};

/**
 * Updates our data object from the DOM
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;
};

/**
 * Edits the snippet
 */
SnippetPreview.prototype.editSnippet = function() {
	var form, formFields, snippetEditor;

	snippetEditor = document.getElementById( "snippet_preview" );
	formFields = document.getElementsByClassName( "snippet-editor__form-field" );

	snippetEditor.className = "editing";

	[].forEach.call( formFields, function( formField ) {
		formField.className = "snippet-editor__form-field snippet-editor__form-field--shown";
	} );

	form = document.getElementsByClassName( "snippet-editor__form" );
	form[0].className = "snippet-editor__form snippet-editor__form--shown";
};

/**
 * Saves the snippet fields
 */
SnippetPreview.prototype.saveSnippet = function() {
	var form = document.getElementsByClassName( "snippet-editor__form" );

	form[0].className = "snippet-editor__form";
};

module.exports = SnippetPreview;

},{"../js/templates.js":3,"lodash/lang/clone":35,"lodash/lang/isEmpty":38,"lodash/lang/isObject":41,"lodash/object/defaultsDeep":47}],3:[function(require,module,exports){
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
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div id="snippet_preview">\n    <button class="snippet-editor__edit_button js-snippet-editor-edit" type="button">\n        <span class="screen-reader-text">{{i18n.edit}}</span>\n    </button>\n    <div class="snippet_container" id="title_container">\n        <span class="title" id="snippet_title">\n            ' +
    __e( rendered.title ) +
    '\n        </span>\n        <span class="title" id="snippet_sitename"></span>\n    </div>\n    <div class="snippet_container" id="url_container">\n        <cite class="url urlBase" id="snippet_citeBase">\n            ' +
    __e( rendered.baseUrl ) +
    '\n        </cite>\n        <cite class="url" id="snippet_cite">\n            ' +
    __e( rendered.snippetCite ) +
    '\n        </cite>\n    </div>\n    <div class="snippet_container" id="meta_container">\n        <span class="desc" id="snippet_meta">\n            ' +
    __e( rendered.meta ) +
    '\n        </span>\n    </div>\n\n    <div class="snippet-editor__form">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" />\n        </label>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description">' +
    __e( raw.meta ) +
    '</textarea>\n        </label>\n\n        <button class="snippet-editor__submit js-snippet-editor-save" type="button">' +
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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../object/keys":48,"./baseCopy":10}],9:[function(require,module,exports){
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

},{"../lang/isArray":37,"../lang/isObject":41,"./arrayCopy":6,"./arrayEach":7,"./baseAssign":8,"./baseForOwn":13,"./initCloneArray":24,"./initCloneByTag":25,"./initCloneObject":26}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./createBaseFor":20}],12:[function(require,module,exports){
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

},{"../object/keysIn":49,"./baseFor":11}],13:[function(require,module,exports){
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

},{"../object/keys":48,"./baseFor":11}],14:[function(require,module,exports){
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

},{"../lang/isArray":37,"../lang/isObject":41,"../lang/isTypedArray":44,"../object/keys":48,"./arrayEach":7,"./baseMergeDeep":15,"./isArrayLike":27,"./isObjectLike":31}],15:[function(require,module,exports){
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

},{"../lang/isArguments":36,"../lang/isArray":37,"../lang/isPlainObject":42,"../lang/isTypedArray":44,"../lang/toPlainObject":46,"./arrayCopy":6,"./isArrayLike":27}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"../utility/identity":51}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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

},{"../function/restParam":5,"./bindCallback":17,"./isIterateeCall":29}],20:[function(require,module,exports){
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

},{"./toObject":34}],21:[function(require,module,exports){
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

},{"../function/restParam":5}],22:[function(require,module,exports){
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

},{"./baseProperty":16}],23:[function(require,module,exports){
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

},{"../lang/isNative":40}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"./bufferClone":18}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./getLength":22,"./isLength":30}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"../lang/isObject":41,"./isArrayLike":27,"./isIndex":28}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"../object/merge":50}],33:[function(require,module,exports){
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

},{"../lang/isArguments":36,"../lang/isArray":37,"../object/keysIn":49,"./isIndex":28,"./isLength":30}],34:[function(require,module,exports){
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

},{"../lang/isObject":41}],35:[function(require,module,exports){
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

},{"../internal/baseClone":9,"../internal/bindCallback":17,"../internal/isIterateeCall":29}],36:[function(require,module,exports){
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

},{"../internal/isArrayLike":27,"../internal/isObjectLike":31}],37:[function(require,module,exports){
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

},{"../internal/getNative":23,"../internal/isLength":30,"../internal/isObjectLike":31}],38:[function(require,module,exports){
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

},{"../internal/isArrayLike":27,"../internal/isObjectLike":31,"../object/keys":48,"./isArguments":36,"./isArray":37,"./isFunction":39,"./isString":43}],39:[function(require,module,exports){
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

},{"./isObject":41}],40:[function(require,module,exports){
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

},{"../internal/isObjectLike":31,"./isFunction":39}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{"../internal/baseForIn":12,"../internal/isObjectLike":31,"./isArguments":36}],43:[function(require,module,exports){
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

},{"../internal/isObjectLike":31}],44:[function(require,module,exports){
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

},{"../internal/isLength":30,"../internal/isObjectLike":31}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{"../internal/baseCopy":10,"../object/keysIn":49}],47:[function(require,module,exports){
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

},{"../internal/createDefaults":21,"../internal/mergeDefaults":32,"./merge":50}],48:[function(require,module,exports){
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

},{"../internal/getNative":23,"../internal/isArrayLike":27,"../internal/shimKeys":33,"../lang/isObject":41}],49:[function(require,module,exports){
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

},{"../internal/isIndex":28,"../internal/isLength":30,"../lang/isArguments":36,"../lang/isArray":37,"../lang/isObject":41}],50:[function(require,module,exports){
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

},{"../internal/baseMerge":14,"../internal/createAssigner":19}],51:[function(require,module,exports){
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

},{}]},{},[1]);
