/**
 * Text Analyzer, accepts args for config and calls init for initialization
 * @param args
 * @constructor
 */
YoastSEO_Analyzer = function ( args ) {
    this.config = args;
    this.init();
};

/**
 * YoastSEO_Analyzer initialization. Loads defaults and overloads custom settings.
 */
YoastSEO_Analyzer.prototype.init = function() {
    this.toLowCase();
    this.initDependencies();
    this.initQueue();
    this.loadWordlists();
    this.setDefaults();
    this.__output = [];
    this.__store = {};
};

YoastSEO_Analyzer.prototype.toLowCase = function() {
    this.config.keywordLowerCase = this.config.keyword.toLocaleLowerCase().trim();
};

/**
 * initializes required objects.
 * For the analyzeScorer a new object is always defined, to make sure there are no duplicate scores
 */
YoastSEO_Analyzer.prototype.initDependencies = function() {
    //init preprocessor
    this.YoastSEO_preProcessor = new YoastSEO_preProcessor( this.config.textString );
    //init helper
    this.stringHelper = stringHelper();
    //init scorer
    this.analyzeScorer = new YoastSEO_AnalyzeScorer( this );
};

/**
 * initializes the function queue.
 */
YoastSEO_Analyzer.prototype.initQueue = function() {
    //if no available function queues, make new queue
    if ( typeof this.queue !== "object" ) {
        this.queue = [];
    }
    //if custom queue available load queue, otherwise load default queue.
    if( typeof this.config.queue !== "undefined" && this.config.queue.length !== 0 ) {
        this.queue = this.config.queue;
    } else {
        this.queue = [
            "wordCount",
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
            "firstParagraph"
        ];
    }
};

/**
 * load wordlists.
 */
YoastSEO_Analyzer.prototype.loadWordlists = function() {
    //if no available keywords, load default array
    if( typeof this.config.wordsToRemove === "undefined" ) {
        this.config.wordsToRemove =  analyzerConfig.wordsToRemove;
    }
    if( typeof this.config.stopWords === "undefined" ) {
        this.config.stopWords = analyzerConfig.stopWords;
    }
};

/**
 * set default variables.
 */
YoastSEO_Analyzer.prototype.setDefaults = function() {
    //creates new regex from keyword with global and caseinsensitive option
    this.keywordRegex = new RegExp( this.config.keywordLowerCase, "ig" );
};

/**
 * starts queue of functions executing the analyzer functions untill queue is empty.
 */
YoastSEO_Analyzer.prototype.runQueue = function() {
    //remove first function from queue and execute it.
    if( this.queue.length > 0 ) {
        this.__output = this.__output.concat( this[ this.queue.shift() ]() );
        this.runQueue();
    } else {
        this.score();
    }
};

/**
 * clears current queue of functions, effectively stopping execution of the analyzer.
 */
YoastSEO_Analyzer.prototype.abortQueue = function() {
    //empty current Queue
    this.queue = [];
};

/**
 * returns wordcount from the preprocessor storage to include them in the results.
 * @returns {{test: string, result: (Function|YoastSEO_PreProcessor.wordcount|Number)}[]}
 */
YoastSEO_Analyzer.prototype.wordCount = function() {
    return [ {test: "wordCount", result:this.YoastSEO_preProcessor.__store.wordcount} ];
};


/**
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
YoastSEO_Analyzer.prototype.keywordDensity = function() {
    var result = [ { test: "keywordDensity", result: 0 } ];
    if (this.YoastSEO_preProcessor.__store.wordcount > 100) {
        var keywordDensity = this.keywordDensityCheck();
        result[0].result = keywordDensity.toFixed( 1 );
        return result;
    }

};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
YoastSEO_Analyzer.prototype.keywordDensityCheck = function() {
    var keywordCount = this.keywordCount();
    var keywordDensity = 0;
    if ( keywordCount !== 0 ) {
        keywordDensity = ( keywordCount / this.YoastSEO_preProcessor.__store.wordcount - ( keywordCount - 1 * keywordCount ) ) * 100;
    }
    return keywordDensity;
};

/**
 * counts the number of keyword occurrences of the keyword. Saves this in the __store and returns it.
 * @returns keywordCount
 */
YoastSEO_Analyzer.prototype.keywordCount = function() {
    var keywordMatches = this.stringHelper.matchString( this.YoastSEO_preProcessor.__store.cleanText, [this.config.keywordLowerCase] );
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
YoastSEO_Analyzer.prototype.subHeadings = function() {
    var result = [ {test: "subHeadings", result: {count: 0, matches: 0 } } ];
    //matches everything from H1-H6 openingtags untill the closingtags.
    var matches = this.YoastSEO_preProcessor.__store.cleanTextSomeTags.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );
    if( matches !== null ){
        result[0].result.count = matches.length;
        result[0].result.matches = this.subHeadingsCheck( matches );
    }
    return result;
};

/**
 * subHeadings checker to check if keyword is present in given headings.
 * @param matches
 * @returns {number}
 */
YoastSEO_Analyzer.prototype.subHeadingsCheck = function( matches ){
    var foundInHeader;
    if ( matches === null ){
        foundInHeader = -1;
    }else{
        foundInHeader = 0;
        for ( var i = 0; i < matches.length; i++ ) {
            var formattedHeaders = this.stringHelper.replaceString(matches[i], this.config.wordsToRemove);
            if (formattedHeaders.match( this.keywordRegex  ) || matches[i].match( this.keywordRegex ) ) {
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
YoastSEO_Analyzer.prototype.stopwords = function() {
    //prefix space to the keyword to make sure it matches if the keyword starts with a stopword.
    var keyword = this.config.keyword;
    var matches = this.stringHelper.matchString( keyword, this.config.stopWords );
    var stopwordCount = matches !== null ? matches.length : 0;
    var matchesText = "";
    if ( matches !== null ){
        for ( var i = 0; i < matches.length; i++ ){
            matchesText = matchesText + matches[i] + ", ";
        }
    }
    return [ { test: "stopwordKeywordCount", result: { count: stopwordCount, matches: matchesText.substring( 0, matchesText.length - 2 ) } } ];
};

/**
 * calculate Flesch Reading score
 * @returns {result object}
 */
YoastSEO_Analyzer.prototype.fleschReading = function() {
    var score =  ( 206.835 -
        ( 1.015 * ( this.YoastSEO_preProcessor.__store.wordcountNoTags / this.YoastSEO_preProcessor.__store.sentenceCountNoTags ) ) -
        ( 84.6 * ( this.YoastSEO_preProcessor.__store.syllablecount / this.YoastSEO_preProcessor.__store.wordcountNoTags ) ) )
        .toFixed( 1 );
    if( score < 0 ){
        score = 0;
    }else if ( score > 100 ){
        score = 100;
    }
    return [ { test: "fleschReading", result: score} ];
};

/**
 * counts the links in a given text. Also checks if a link is internal of external.
 * @returns {{total: number, internal: {total: number, dofollow: number, nofollow: number}, external: {total: number, dofollow: number, nofollow: number}, other: {total: number, dofollow: number, nofollow: number}}}
 */
YoastSEO_Analyzer.prototype.linkCount = function() {
    //regex matches everything between <a> and </a>
    var linkMatches = this.YoastSEO_preProcessor.__store.originalText.match( /<a(?:[^>]+)?>(.*?)<\/a>/ig );
    var linkCount = {
        total: 0,
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
    if( linkMatches !== null ){
        linkCount.total = linkMatches.length;
        for( var i = 0; i < linkMatches.length; i++ ){
            var linkKeyword = this.linkKeyword( linkMatches[i] );
            if( linkKeyword ){
                linkCount.totalKeyword++;
            }
            var linkType = this.linkType( linkMatches[i] );
            linkCount[linkType + "Total"]++;
            var linkFollow = this.linkFollow( linkMatches[i] );
            linkCount[linkType + linkFollow]++;
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
YoastSEO_Analyzer.prototype.linkType = function( url ) {
    var linkType = "other";
    //matches all links that start with http:// and https://, case insensitive and global
    if( url.match( /https?:\/\//ig ) !== null ){
        linkType = "external";
        var urlMatch = url.match( this.config.url );
        if( urlMatch !== null && urlMatch[0].length !== 0 ){
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
YoastSEO_Analyzer.prototype.linkFollow = function( url ){
    var linkFollow = "Dofollow";
    //matches all nofollow links, case insensitive and global
    if( url.match( /rel=([\'\"])nofollow\1/ig ) !== null ){
        linkFollow = "Nofollow";
    }
    return linkFollow;
};

/**
 * checks if the url contains the keyword
 * @param url
 * @returns {boolean}
 */
YoastSEO_Analyzer.prototype.linkKeyword = function(url){
    var keywordFound = false;
    //split on > to discard the data in the anchortag
	var formatUrl = url.split(">");
    if( formatUrl[1].match( this.keywordRegex ) !== null ){
        keywordFound = true;
    }
    return keywordFound;
};

/**
 * checks if the links are all followed or not, and saves this in the resultobject, to be used for scoring
 */
YoastSEO_Analyzer.prototype.linkResult = function( obj ){
    var result = obj;
    result.externalHasNofollow = false;
    result.externalAllNofollow = false;
    result.externalAllDofollow = false;
    if( result.externalTotal !== result.externalDofollow && result.externalTotal > 0 ){
        result.externalHasNofollow = true;
    }
    if( result.externalTotal === result.externalNofollow && result.externalTotal > 0 ){
        result.externalAllNofollow = true;
    }
    if( result.externalTotal === result.externalDofollow && result.externalTotal > 0 ){
        result.externalAllDofollow = true;
    }
    return result;
};

/**
 * counts the number of images found in a given textstring, based on the <img>-tag and returns a result object
 * @returns {{name: string, result: {total: number, alt: number, noAlt: number}}}
 */
//todo update function so it will also check on picture elements/make it configurable.
YoastSEO_Analyzer.prototype.imageCount = function() {
    var imageCount = { total: 0, alt: 0, noAlt: 0, altKeyword: 0 };
    //matches everything in the <img>-tag, case insensitive and global
    var imageMatches = this.YoastSEO_preProcessor.__store.originalText.match( /<img(?:[^>]+)?>/ig );
    if( imageMatches !== null ){
        imageCount.total = imageMatches.length;
        for ( var i = 0; i < imageMatches.length; i++ ){
            //matches everything in the alt attribute, case insensitive and global.
            var alttag = imageMatches[i].match( /alt=([\'\"])(.*?)\1/ig );
            if( this.imageAlttag( alttag ) ){
                if( this.imageAlttagKeyword( alttag ) ){
                    imageCount.altKeyword++;
                }else{
                    imageCount.alt++;
                }

            }else{
                imageCount.noAlt++;
            }
        }
    }
    return  [ {test: "imageCount", result: imageCount } ];
};

/**
 * checks if  the alttag contains any text.
 * @param image
 * @returns {boolean}
 */
YoastSEO_Analyzer.prototype.imageAlttag = function( image ) {
    var hasAlttag = false;
    if( image !== null ){
        //matches the value of the alt attribute (alphanumeric chars), global and case insensitive
        if( image[0].split( "=" )[1].match( /[a-z0-9](.*?)[a-z0-9]/ig ) !== null ){
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
YoastSEO_Analyzer.prototype.imageAlttagKeyword = function( image ){
    var hasKeyword = false;
    if( image !== null ){
        if( image[0].match(this.keywordRegex) !== null ){
            hasKeyword = true;
        }
    }
    return hasKeyword;
};


/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */

YoastSEO_Analyzer.prototype.pageTitleLength = function() {
    var count = 0;
    if( typeof this.config.pageTitle !== "undefined" ){
        count = this.config.pageTitle.length;
    }
    return [ {test: "pageTitleLength", result: count } ];
};

/**
 * counts the occurrences of the keyword in the pagetitle, returns 0 if pagetitle is empty or not set.
 * @returns {{name: string, count: number}}
 */
YoastSEO_Analyzer.prototype.pageTitleKeyword = function() {
    var result = [ { test: "pageTitleKeyword", result: {matches: 0, position: 0 } } ];
    if( typeof this.config.pageTitle !== "undefined" ) {
        result[0].result.matches = this.stringHelper.countMatches( this.config.pageTitle.toLocaleLowerCase(), this.keywordRegex );
        result[0].result.position = this.config.pageTitle.indexOf( this.config.keyword );
    }
    return result;
};

/**
 * counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines
 * @returns {{name: string, count: number}}
 */
YoastSEO_Analyzer.prototype.firstParagraph = function() {
    var result =[ { test: "firstParagraph", result: 0 } ];
    //matches everything between the <p> and </p> tags.
    var p = this.paragraphChecker( this.YoastSEO_preProcessor.__store.cleanTextSomeTags , new RegExp("<p(?:[^>]+)?>(.*?)<\/p>", "ig") );
    if ( p === 0){
        //use a regex that matches [^], not nothing, so any character, including linebreaks
        p = this.paragraphChecker( this.YoastSEO_preProcessor.__store.originalText, new RegExp("[^]*?\n\n", "ig") );
    }
    result[0].result = p;
    return result;
};

/**
 * checks if the keyword is found in the given textString. 
 * @param textString
 * @param regexp
 * @returns count
 */
YoastSEO_Analyzer.prototype.paragraphChecker = function( textString, regexp) {
    var matches = textString.match ( regexp );
    var count = 0;
    if ( matches !== null ){
        count = this.stringHelper.countMatches( matches[0], this.keywordRegex );
    }
    return count;
};

/**
 * counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is empty or not set.
 * @returns {{name: string, count: number}}
 */
YoastSEO_Analyzer.prototype.metaDescription = function() {
    var result =[ { test: "metaDescriptionLength", result: 0 }, { test : "metaDescriptionKeyword", result : 0 } ];
    if(typeof this.config.meta !== "undefined") {
        result[0].result = this.config.meta.length;
        result[1].result = this.stringHelper.countMatches( this.config.meta, this.keywordRegex );
    }
    return result;
};

/**
 * counts the occurences of the keyword in the URL, returns 0 if no URL is set or is empty.
 * @returns {{name: string, count: number}}
 */
YoastSEO_Analyzer.prototype.urlKeyword = function() {
    var result = [ { test: "urlKeyword", result : 0 } ];
    var regex = this.config.keywordLowerCase.replace(" ", "[-_]");
    regex = new RegExp(regex);
    if( typeof this.config.url !== "undefined" ) {
        result[0].result = this.stringHelper.countMatches( this.config.url, regex );
    }
    return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
YoastSEO_Analyzer.prototype.urlLength = function() {
    var result = [ { test: "urlLength", result :{ urlTooLong: false } } ];
    if( typeof this.config.url !== "undefined" ) {
        var length = this.config.url.length;
        if( length > this.config.maxUrlLength && length > this.config.maxSlugLength + this.config.keyword.length ){
            result[0].result.urlTooLong = true;
        }
    }
    return result;
};

/**
 * checks if there are stopwords used in the URL.
 * @returns {{test: string, result: number}[]}
 */
YoastSEO_Analyzer.prototype.urlStopwords = function() {
    var result = [ { test: "urlStopwords", result : 0 } ];
    if( typeof this.config.url !== "undefined" ) {
        var stopwords = this.stringHelper.matchString( this.config.url, this.config.stopWords );
        if( stopwords !== null ) {
            result[0].result = stopwords.length;
        }
    }
    return result;
};

/**
 * runs the scorefunction of the analyzeScorer with the generated output that is used as a queue.
 */
YoastSEO_Analyzer.prototype.score = function() {
    this.analyzeScorer.score(this.__output);
};
