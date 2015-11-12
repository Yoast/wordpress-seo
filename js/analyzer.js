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
		// replaces - and _ with space

		this.keywordRegex = new RegExp( "\\b" +
			this.preProcessor.replaceDiacritics( keyword.replace( /[-_]/, " " ) ) + "\\b",
			"ig"
		);

		// Creates new regex from keyword with global and caseinsensitive option,
		// replaces space with -. Used for URL matching
		this.keywordRegexInverse = new RegExp( "\\b" +
			this.preProcessor.replaceDiacritics( keyword.replace( " ", "-" ) ) + "\\b",
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
	return [ { test: "wordCount", result: this.preProcessor.__store.wordcountNoTags } ];
};

/**
 * Checks if keyword is present, if not returns 0
 * @returns {{test: string, result: number}[]}
 */
YoastSEO.Analyzer.prototype.keyWordCheck = function() {
	if ( this.stringHelper.sanitizeKeyword( this.config.keyword ) === "" ) {
		return [ { test: "keywordCheck", result: 0 } ];
	}
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
	var keywordMatches = this.preProcessor.__store.cleanText.match( this.keywordRegex );
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

	//prefix space to the keyword to make sure it matches if the keyword starts with a stopword.
	var keyword = this.config.keyword;
	var matches = this.stringHelper.matchString( keyword, this.config.stopWords );
	var stopwordCount = matches !== null ? matches.length : 0;
	var matchesText = "";
	if ( matches !== null ) {
		for ( var i = 0; i < matches.length; i++ ) {
			matchesText = matchesText + matches[ i ] + ", ";
		}
	}
	return [ {
		test: "stopwordKeywordCount",
		result: {
			count: stopwordCount,
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
							this.preProcessor.__store.wordcountNoTags /
							this.preProcessor.__store.sentenceCountNoTags
						)
					) -
						(
							84.6 *
						(
					this.preProcessor.__store.syllablecount /
					this.preProcessor.__store.wordcountNoTags
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
		var urlMatch = url.match( this.config.url );
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

	//split on > to discard the data in the anchortag
	var formatUrl = url.match( /href=([\'\"])(.*?)\1/ig );
	if ( formatUrl !== null && formatUrl[ 0 ].match( this.keywordRegex ) !== null ) {
		keywordFound = true;
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
	if ( result.externalTotal !== result.externalDofollow && result.externalTotal > 0 ) {
		result.externalHasNofollow = true;
	}
	if ( result.externalTotal === result.externalNofollow && result.externalTotal > 0 ) {
		result.externalAllNofollow = true;
	}
	if ( result.externalTotal === result.externalDofollow && result.externalTotal > 0 ) {
		result.externalAllDofollow = true;
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

		//matches the value of the alt attribute (alphanumeric chars), global and case insensitive
		if ( image[ 0 ].split( "=" )[ 1 ].match( /[a-z0-9](.*?)[a-z0-9]/ig ) !== null ) {
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
		if ( image[ 0 ].match( this.keywordRegex ) !== null ) {
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
			this.config.pageTitle.toLocaleLowerCase(),
			this.keywordRegex
		);
		result[ 0 ].result.position = this.config.pageTitle.indexOf( this.config.keyword );
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
			this.config.meta, this.keywordRegex
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
		if ( typeof this.config.usedKeywords[ this.config.keyword ] !== "undefined" ) {
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
