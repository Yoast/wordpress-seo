/**
 * Text Analyzer, accepts args for config and calls init for initialisation
 * @param args
 * @constructor
 */

Analyzer = function (args){
    this.config = args;
    this.init();
};

/**
 * Analyzer initialisation. Loads defaults and overloads custom settings.
 */
Analyzer.prototype.init = function() {
    this.initDependencies();
    this.initQueue();
    this.loadWordlists();
    this.setDefaults();
    this.__output = [];
    this.__store = {};
};

/**
 * initializes required objects.
 * For the analyzeScorer a new object is always defined, to make sure there are no duplicate scores
 */
Analyzer.prototype.initDependencies = function(){
    //init preprocessor
    this.preProcessor = preProcessor(this.config.textString);
    //init helper
    this.stringHelper = stringHelper();
    //init scorer
    this.analyzeScorer = new AnalyzeScorer(this);
};

/**
 * initializes the function queue.
 */
Analyzer.prototype.initQueue = function(){
    //if no available function queues, make new queue
    if (typeof this.queue !== "object") {
        this.queue = [];
    }
    //if custom queue available load queue, otherwise load default queue.
    if(typeof this.config.queue !== "undefined" && this.config.queue.length !== 0){
        this.queue = this.config.queue;
    }else{
        this.queue = ["wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescription", "pageTitleKeyword", "pageTitleLength", "firstParagraph"];
    }
};

/**
 * load wordlists.
 */
Analyzer.prototype.loadWordlists = function(){
    //if no available keywords, load default array
    if(typeof this.config.wordsToRemove === "undefined"){
        this.config.wordsToRemove =  analyzerConfig.wordsToRemove;
    }
    if(typeof this.config.stopWords === "undefined"){
        this.config.stopWords = analyzerConfig.stopWords;
    }
};

/**
 * set default variables.
 */
Analyzer.prototype.setDefaults = function(){
    //set default variables
    this.keywordRegex = new RegExp(this.config.keyword);
};

/**
 * starts queue of functions executing the analyzer functions untill queue is empty.
 */
Analyzer.prototype.runQueue = function(){
    //remove first function from queue and execute it.
    if(this.queue.length > 0){
        this.__output = this.__output.concat(this[this.queue.shift()]());
        this.runQueue();
    } else {
        this.score();
    }
};

/**
 * clears current queue of functions, effectively stopping execution of the analyzer.
 */
Analyzer.prototype.abortQueue = function(){
    //empty current Queue
    this.queue = [];
};

/**
 * returns wordcount from the preprocessor storage to include them in the results.
 * @returns {{test: string, result: (Function|PreProcessor.wordcount|Number)}[]}
 */
Analyzer.prototype.wordCount = function(){
    return [{test: "wordCount", result:this.preProcessor.__store.wordcount}];
};


/**
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
Analyzer.prototype.keywordDensity = function() {
    var result = [{ test: "keywordDensity", result: 0  }];
    if (this.preProcessor.__store.wordcount > 100) {
        var keywordDensity = this.keywordDensityCheck();
        result[0].result = keywordDensity.toFixed(1);
    }
    return result;
};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
Analyzer.prototype.keywordDensityCheck = function(){
    var keywordCount = this.keywordCount();
    var keywordDensity = 0;
    if ( keywordCount !== 0 ) {
        keywordDensity = (keywordCount / this.preProcessor.__store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
    }
    return keywordDensity;
};

/**
 * counts the number of keyword occurrences of the keyword. Saves this in the __store and returns it.
 * @returns {*}
 */
Analyzer.prototype.keywordCount = function(){
    var keywordMatches = this.stringHelper.matchString(this.preProcessor.__store.cleanText,[this.config.keyword]);
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
Analyzer.prototype.subHeadings = function() {
    var result = [{test: "subHeadings", result: {count: 0, matches: 0 } }];
    var matches = this.preProcessor.__store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    if(matches !== null){
        result[0].result.count = matches.length;
        result[0].result.matches = this.subHeadingsCheck(matches);
    }
    return result;
};

/**
 * subHeadings checker to check if keyword is present in given headings.
 * @param matches
 * @returns {number}
 */
Analyzer.prototype.subHeadingsCheck = function(matches){
    var foundInHeader;
    if (matches === null){
        foundInHeader = -1;
    }else{
        foundInHeader = 0;
        for (var i = 0; i < matches.length; i++) {
            var formattedHeaders = this.stringHelper.replaceString(matches[i], this.config.wordsToRemove);
            if (formattedHeaders.match(new RegExp(this.config.keyword, "g")) || matches[i].match(new RegExp(this.config.keyword, "g"))) {
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
Analyzer.prototype.stopwords = function(){
    //prefix space to the keyword to make sure it matches if the keyword starts with a stopword.
    var keyword = this.config.keyword;
    var matches = this.stringHelper.matchString(keyword, this.config.stopWords);
    var stopwordCount = matches !== null ? matches.length : 0;
    var matchesText = "";
    if (matches !== null){
        for (var i = 0; i < matches.length; i++){
            matchesText = matchesText + matches[i] + ", ";
        }
    }
    return [ { test: "stopwordKeywordCount", result: {count: stopwordCount, matches: matchesText.substring(0,matchesText.length - 2)} } ];
};

/**
 * calculate Flesch Reading score
 * @returns {result object}
 */
Analyzer.prototype.fleschReading = function(){
    var score =  (206.835 - (1.015 * (this.preProcessor.__store.wordcountNoTags / this.preProcessor.__store.sentenceCountNoTags)) - (84.6 * (this.preProcessor.__store.syllablecount / this.preProcessor.__store.wordcountNoTags))).toFixed(1);
    if(score < 0){score = 0;}else if (score > 100){score = 100;}
    return [ { test: "fleschReading", result: score} ];
};

/**
 * counts the links in a given text. Also checks if a link is internal of external.
 * @returns {{total: number, internal: {total: number, dofollow: number, nofollow: number}, external: {total: number, dofollow: number, nofollow: number}, other: {total: number, dofollow: number, nofollow: number}}}
 */
Analyzer.prototype.linkCount = function(){
    var linkMatches = this.preProcessor.__store.originalText.match(/<a(?:[^>]+)?>(.*?)<\/a>/g);
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
    if(linkMatches !== null){
        linkCount.total = linkMatches.length;
        for(var i = 0; i < linkMatches.length; i++){
            var linkKeyword = this.linkKeyword(linkMatches[i]);
            if(linkKeyword){
                linkCount.totalKeyword++;
            }
            var linkType = this.linkType(linkMatches[i]);
            linkCount[linkType+"Total"]++;
            var linkFollow = this.linkFollow(linkMatches[i]);
            linkCount[linkType+linkFollow]++;
        }
    }
    linkCount = this.linkResult(linkCount);
    return [ { test: "linkCount", result: linkCount } ];
};

/**
 * Checks the linktype of the given url against the URL stored in the config.
 * @param url
 * @returns {string}
 */
Analyzer.prototype.linkType = function(url){
    var linkType = "other";
    if(url.match(/https?:\/\//g) !== null){
        linkType = "external";
        var urlMatch = url.match(this.config.url);
        if(urlMatch !== null && urlMatch[0].length !== 0){
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
Analyzer.prototype.linkFollow = function(url){
    var linkFollow = "Dofollow";
    if(url.match(/rel=([\'\"])nofollow\1/g) !== null){
        linkFollow = "Nofollow";
    }
    return linkFollow;
};

/**
 * checks if the url contains the keyword
 * @param url
 * @returns {boolean}
 */
Analyzer.prototype.linkKeyword = function(url){
    var keywordFound = false;
    var formatUrl = url.match(/<a(.*?)(?:[^>]+)?>/);
    if(formatUrl[0].match(this.config.keyword) !== null){
        keywordFound = true;
    }
    return keywordFound;
};

/**
 * checks if the links are all followed or not, and saves this in the resultobject, to be used for scoring
 */
Analyzer.prototype.linkResult = function(obj){
    var result = obj;
    result.externalHasNofollow = false;
    result.externalAllNofollow = false;
    result.externalAllDofollow = false;
    if(result.externalTotal !== result.externalDofollow && result.externalTotal > 0){
        result.externalHasNofollow = true;
    }
    if(result.externalTotal === result.externalNofollow && result.externalTotal > 0){
        result.externalAllNofollow = true;
    }
    if(result.externalTotal === result.externalDofollow && result.externalTotal > 0){
        result.externalAllDofollow = true;
    }
    return result;
};

/**
 * counts the number of images found in a given textstring, based on the <img>-tag and returns a result object
 * @returns {{name: string, result: {total: number, alt: number, noalt: number}}}
 */
//todo update function so it will also check on picture elements/make it configurable.
Analyzer.prototype.imageCount = function(){
    var imageCount = {total: 0, alt: 0, noalt: 0, altKeyword: 0};
    var imageMatches = this.preProcessor.__store.originalText.match(/<img(?:[^>]+)?>/g);
    if(imageMatches !== null){
        imageCount.total = imageMatches.length;
        for (var i = 0; i < imageMatches.length; i++){
            var alttag = imageMatches[i].match(/alt=([\'\"])(.*?)\1/g);
            if(this.imageAlttag(alttag)){
                if(this.imageAlttagKeyword(alttag)){
                    imageCount.altKeyword++;
                }else{
                    imageCount.alt++;
                }

            }else{
                imageCount.noalt++;
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
Analyzer.prototype.imageAlttag = function(image){
    var hasAlttag = false;
    if(image !== null){
        if(image[0].split("=")[1].match(/[a-z0-9](.*?)[a-z0-9]/g) !== null){
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
Analyzer.prototype.imageAlttagKeyword = function(image){
    var hasKeyword = false;
    if(image !== null){
        if(image[0].match(this.keywordRegex) !== null){
            hasKeyword = true;
        }
    }
    return hasKeyword;
};


/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */

Analyzer.prototype.pageTitleLength = function(){
    var count = 0;
    if(typeof this.config.pageTitle !== "undefined"){
        count = this.config.pageTitle.length;
    }
    return [ {test: "pageTitleLength", result: count } ];
};

/**
 * counts the occurrences of the keyword in the pagetitle, returns 0 if pagetitle is empty or not set.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.pageTitleKeyword = function(){
    var result = [ { test: "pageTitleKeyword", result: {matches: 0, position: 0 } } ];
    if(typeof this.config.pageTitle !== "undefined") {
        result[0].result.matches = this.stringHelper.countMatches(this.config.pageTitle, this.keywordRegex);
        result[0].result.position = this.config.pageTitle.indexOf(this.config.keyword);
    }
    return result;
};

/**
 * counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * or there is no paragraph-tag in the given string.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.firstParagraph = function() {
    var matches = this.preProcessor.__store.cleanTextSomeTags.match(/<p(?:[^>]+)?>(.*?)<\/p>/g);
    var result =[ { test: "firstParagraph", result: 0 } ];
    if(matches !== null){
        result[0].result = this.stringHelper.countMatches(matches[0], this.keywordRegex);
    }
    return result;
};

/**
 * counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is empty or not set.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.metaDescription = function() {
    var result =[ { test: "metaDescriptionLength", result: 0 }, {test : "metaDescriptionKeyword", result : 0 } ];
    if(typeof this.config.meta !== "undefined") {
        result[0].result = this.config.meta.length;
        result[1].result = this.stringHelper.countMatches(this.config.meta, this.keywordRegex);
    }
    return result;
};

/**
 * counts the occurences of the keyword in the URL, returns 0 if no URL is set or is empty.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.urlKeyword = function() {
    var result = [ { test: "urlKeyword", result : 0 } ];
    if(typeof this.config.url !== "undefined") {
        result[0].result = this.stringHelper.countMatches(this.config.url, this.keywordRegex);
    }
    return result;
};

/**
 * returns the length of the URL
 * @returns {{test: string, result: number}[]}
 */
Analyzer.prototype.urlLength = function(){
    var result = [ { test: "urlLength", result :{ urlTooLong: false } } ];
    if(typeof this.config.url !== "undefined") {
        var length = this.config.url.length;
        if(length > this.config.maxUrlLength && length > this.config.maxSlugLength + this.config.keyword.length){
            result[0].result.urlTooLong = true;
        }
    }
    return result;
};

/**
 * checks if there are stopwords used in the URL.
 * @returns {{test: string, result: number}[]}
 */
Analyzer.prototype.urlStopwords = function(){
    var result = [ { test: "urlStopwords", result : 0 } ];
    if(typeof this.config.url !== "undefined") {
        var stopwords = this.stringHelper.matchString(this.config.url, this.config.stopWords);
        if(stopwords !== null) {
            result[0].result = stopwords.length;
        }
    }
    return result;
};

/**
 * runs the scorefunction of the analyzeScorer with the generated output that is used as a queue.
 */
Analyzer.prototype.score = function() {
    this.analyzeScorer.score(this.__output);
};

/**helper functions*/
StringHelper = function(){};
/**
 * removes strings from array and replaces them with keyword.
 * @param textString
 * @param stringsToRemove []
 * @param replacement (default == space)
 * @returns {textString}
 */
StringHelper.prototype.replaceString = function(textString, stringsToRemove, replacement){
    if(typeof replacement === "undefined"){replacement = " ";}
    textString = textString.replace(this.stringToRegex(stringsToRemove), replacement);
    return this.stripSpaces(textString);
};

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
StringHelper.prototype.matchString = function(textString, stringsToMatch){
    return textString.match(this.stringToRegex(stringsToMatch));
};

/**
 * matches string with regex, returns the number of matches
 * @param textString
 * @param regex
 * @returns {number}
 */
StringHelper.prototype.countMatches = function(textString, regex){
    var count = 0;
    var matches = textString.match(regex);
    if(matches !== null){
        count = matches.length;
    }
    return count;
};

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
StringHelper.prototype.stringToRegex = function(stringArray, disableWordBoundary){
    var regexString = "";
    var wordBoundary = "\\b";
    if(disableWordBoundary){
        wordBoundary = "";
    }
    for(var i = 0; i < stringArray.length; i++){
        if(regexString.length > 0){ regexString += "|"; }
        regexString += stringArray[i]+wordBoundary;
    }
    return new RegExp(regexString, "g");
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
StringHelper.prototype.stripSpaces = function(textString){
    //replace multiple spaces with single space
    textString = textString.replace(/ {2,}/g, " ");
    //remove first/last character if space
    textString = textString.replace(/^\s+|\s+$/g, "");
    return textString;
};

/**
 * PreProcessor object definition. Creates __store object and calls init.
 * @params textString
 */
PreProcessor = function (text){
    //create __store object to store data
    this.__store = {};
    this.__store.originalText = text;
    this.stringHelper = stringHelper();
    this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
PreProcessor.prototype.init = function(){
    //call function to clean text
    this.textFormat();
    //call function to count words
    this.countStore();
};

/**
 * formats the original text from __store and save as cleantext, cleantextSomeTags en cleanTextNoTags
 */
PreProcessor.prototype.textFormat = function(){
    this.__store.cleanText = this.cleanText(this.__store.originalText);
    this.__store.cleanTextSomeTags = this.stripSomeTags(this.__store.cleanText);
    this.__store.cleanTextNoTags = this.stripAllTags(this.__store.cleanTextSomeTags);
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the __store object
 */
PreProcessor.prototype.countStore = function(){
    /*wordcounters*/
    this.__store.wordcount = this.__store.cleanText.split(" ").length;
    this.__store.wordcountNoTags = this.__store.cleanTextNoTags.split(" ").length;
    /*sentencecounters*/
    this.__store.sentenceCount = this.sentenceCount(this.__store.cleanText);
    this.__store.sentenceCountNoTags = this.sentenceCount(this.__store.cleanTextNoTags);
    /*syllablecounters*/
    this.__store.syllablecount = this.syllableCount(this.__store.cleanTextNoTags);
};

/**
 * counts the number of sentences in a textstring by splitting on a period. Removes sentences that are empty or have only a space.
 * @param textString
 */
PreProcessor.prototype.sentenceCount = function(textString){
    var sentences = textString.split(".");
    sentenceCount = 0;
    for (var i = 0; i < sentences.length; i++){
        if(sentences[i] !== "" && sentences[i] !== " "){
            sentenceCount++;
        }
    }
    return sentenceCount;
};

/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
PreProcessor.prototype.syllableCount = function(textString) {
    this.syllableCount = 0;
    textString = textString.replace(/[.]/g, " ");
    textString = this.removeWords(textString);
    var words = textString.split(" ");
    var subtractSyllablesRegexp = this.stringHelper.stringToRegex(preprocessorConfig.syllables.subtractSyllables, true);
    var addSyllablesRegexp = this.stringHelper.stringToRegex(preprocessorConfig.syllables.addSyllables, true);
    for (var i = 0; i < words.length; i++){
        this.basicSyllableCount(words[i].split(/[^aeiouy]/g));
        this.advancedSyllableCount(words[i], subtractSyllablesRegexp, "subtract");
        this.advancedSyllableCount(words[i], addSyllablesRegexp, "add");
    }
    return this.syllableCount;
};

/**
 * counts the syllables by splitting on consonants
 * @param splitWordArray
 */

PreProcessor.prototype.basicSyllableCount = function(splitWordArray){
    for (var j = 0; j < splitWordArray.length; j++){
        if(splitWordArray[j].length > 0){
            this.syllableCount++;
        }
    }
};

/**
 * counts the syllables by validating against regexxes, and adding and subtracting the number of matches.
 * @param inputString
 * @param regex
 * @param operator
 */
PreProcessor.prototype.advancedSyllableCount = function(inputString, regex, operator){
    var match = inputString.match(regex);
    if(match !== null){
        if(operator === "subtract"){
            this.syllableCount -= match.length;
        }else if(operator === "add"){
            this.syllableCount += match.length;
        }
    }
};

/**
 * removes words from textstring and count syllables. Used for words that fail against regexes.
 * @param textString
 * @returns textString with exclusionwords removed
 */
PreProcessor.prototype.removeWords = function(textString){
    for (var i = 0; i < preprocessorConfig.syllables.exclusionWords.length; i++){
        var exclusionRegex = new RegExp(preprocessorConfig.syllables.exclusionWords[i].word, "g");
        var matches = textString.match(exclusionRegex);
        if(matches !== null){
            this.syllableCount += preprocessorConfig.syllables.exclusionWords[i].syllables;
            textString = textString.replace(exclusionRegex, "");
        }
    }
    return textString;
};

/**
 * cleans text by removing special characters, numberonly words and replacing all terminators by periods
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.cleanText = function(textString){
    textString = textString.toLocaleLowerCase();
    //replace comma', hyphens etc with spaces
    textString = textString.replace(/[\-\;\:\,\(\)\"\'\|\“\”]/g, " ");
    //remove apostrophe
    textString = textString.replace(/[\’]/g, "");
    //unify all terminators
    textString = textString.replace(/[.?!]/g, ".");
    //add period in case it is missing
    textString += ".";
    //replace newlines with spaces
    textString = textString.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, " ");
    //remove duplicate terminators
    textString = textString.replace(/([\.])[\. ]+/g, "$1");
    //pad sentence terminators
    textString = textString.replace(/[ ]*([\.])+/g, "$1 ");
    //Remove "words" comprised only of numbers
    textString = textString.replace(/[0-9]+[ ]/g, "");
    return this.stringHelper.stripSpaces(textString);
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSomeTags = function(textString){
    //remove tags, except li, p, h1-6, dd
    textString = textString.replace(/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
    textString = this.stringHelper.stripSpaces(textString);
    return textString;
};

/**
 * remove all HTMLtags from input string.
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripAllTags = function(textString){
    //remove all tags
    textString = textString.replace(/(<([^>]+)>)/ig," ");
    textString = this.stringHelper.stripSpaces(textString);
    return textString;
};
/**
 * inits the analyzerscorer used for scoring of the output from the textanalyzer
 * @constructor
 */
AnalyzeScorer = function(refObj){
    this.__score = [];
    this.refObj = refObj;
    this.init();
};

/**
 * loads the analyzerScoring from the config file.
 */
AnalyzeScorer.prototype.init = function(){
    this.scoring = analyzerScoring;
};

/**
 * Starts the scoring by taking the resultObject from the analyzer. Then runs the scorequeue.
 * @param resultObj
 */
AnalyzeScorer.prototype.score = function(resultObj){
    this.resultObj = resultObj;
    this.runQueue();
};

/**
 * runs the queue and saves the result in the __score-object.
 */
AnalyzeScorer.prototype.runQueue = function(){
    for (var i = 0; i < this.resultObj.length; i++){
        this.__score = this.__score.concat(this.genericScore(this.resultObj[i]));
    }
    this.__totalScore = this.totalScore();
};

/**
 * scoring function that returns results based on the resultobj from the analyzer matched with
 * the scorearrays in the scoring config.
 * @param obj
 * @returns {{name: (analyzerScoring.scoreName|*), score: number, text: string}}
 */
AnalyzeScorer.prototype.genericScore = function(obj){
    var scoreObj = this.scoreLookup(obj.test);
    var score = {name: scoreObj.scoreName, score: 0, text: ""};
    for (var i = 0; i < scoreObj.scoreArray.length; i++){
        this.setMatcher(obj, scoreObj, i);
        switch(true){
            case (typeof scoreObj.scoreArray[i].type === "string" && this.result[scoreObj.scoreArray[i].type]):
                return this.returnScore(score, scoreObj, i);
            case (typeof scoreObj.scoreArray[i].min === "undefined" && this.matcher <= scoreObj.scoreArray[i].max):
                return this.returnScore(score, scoreObj, i);
            case (typeof scoreObj.scoreArray[i].max === "undefined" && this.matcher >= scoreObj.scoreArray[i].min):
                return this.returnScore(score, scoreObj, i);
            case (this.matcher >= scoreObj.scoreArray[i].min && this.matcher <= scoreObj.scoreArray[i].max):
                return this.returnScore(score, scoreObj, i);
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
AnalyzeScorer.prototype.setMatcher = function(obj, scoreObj, i){
    this.matcher = parseFloat(obj.result);
    this.result = obj.result;
    if(typeof scoreObj.scoreArray[i].matcher !== "undefined"){
        this.matcher = parseFloat(this.result[scoreObj.scoreArray[i].matcher]);
    }
};

/**
 * finds the scoringobject by scorename for the current result.
 * @param name
 * @returns {*}
 */
AnalyzeScorer.prototype.scoreLookup = function(name){
    for (var ii = 0; ii < this.scoring.length; ii++){
        if (name === this.scoring[ii].scoreName){
            return this.scoring[ii];
        }
    }
};

/**
 * fills the score with score and text from the scoreArray and runs the textformatter.
 * @param score
 * @param scoreObj
 * @param i
 * @returns {*}
 */
AnalyzeScorer.prototype.returnScore = function(score, scoreObj, i){
    score.score = scoreObj.scoreArray[i].score;
    score.text = this.scoreTextFormat(scoreObj.scoreArray[i], scoreObj.replaceArray);
    return score;
};

/**
 * Formats the resulttexts with variables. Uses a value, source, sourceObj or scoreObj for the replacement source
 * replaces the position from the replaceArray with the replacement source.
 * @param scoreObj
 * @param replaceArray
 * @returns {*}
 */
AnalyzeScorer.prototype.scoreTextFormat = function(scoreObj, replaceArray){
    var resultText = scoreObj.text;
    if(typeof replaceArray !== "undefined") {
        for (var i = 0; i < replaceArray.length; i++) {
            switch(true) {
                case (typeof replaceArray[i].value !== "undefined"):
                    resultText = resultText.replace(replaceArray[i].position, replaceArray[i].value);
                    break;
                case (typeof replaceArray[i].source !== "undefined"):
                    resultText = resultText.replace(replaceArray[i].position, this[replaceArray[i].source]);
                    break;
                case (typeof replaceArray[i].sourceObj !== "undefined"):
                    var replaceWord = this.parseReplaceWord(replaceArray[i].sourceObj);
                    resultText = resultText.replace(replaceArray[i].position, replaceWord);
                    break;
                case (typeof replaceArray[i].scoreObj !== "undefined"):
                    resultText = resultText.replace(replaceArray[i].position, scoreObj[replaceArray[i].scoreObj]);
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
 * @returns {AnalyzeScorer}
 */
AnalyzeScorer.prototype.parseReplaceWord = function(replaceWord){
    var parts = replaceWord.split(".");
    var source = this;
    for (var i = 1; i < parts.length; i++){
        source = source[parts[i]];
    }
    return source;
};

AnalyzeScorer.prototype.totalScore = function(){
    var scoreAmount = this.__score.length;
    var totalScore = 0;
    for(var i = 0; i < this.__score.length; i++){
        totalScore += this.__score[i].score;
    }
    var endScore = totalScore / scoreAmount;
    return endScore;

};

/**
 * Checks if the preprocessor is already initialized and if so if the textstring differs from the input.
 * @param inputString
 * @returns {PreProcessor|*|yst_preProcessor}
 */
preProcessor = function(inputString){
    if (typeof yst_preProcessor !== "object" || yst_preProcessor.inputText !== inputString) {
        yst_preProcessor = new PreProcessor(inputString);
    }
    return yst_preProcessor;
};

/**
 * Checks if the stringhelper is already initialized. Returns stringHelper.
 * @returns {StringHelper}
 */
stringHelper = function(){
    if (typeof yst_stringHelper !== "object"){
        yst_stringHelper = new StringHelper();
    }
    return yst_stringHelper;
};