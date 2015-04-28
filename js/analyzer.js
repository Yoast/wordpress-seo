/**
 * Text Analyzer, accepts args for config and
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
    this.initRequiredObjects();
    this.initQueue();
    this.loadWordlists();
    this.setDefaults();
    this.__output = [];
};

/**
 * initializes required objects.
 */
Analyzer.prototype.initRequiredObjects = function(){
    //init preprocessor if not exists
    if (typeof yst_preProcessor !== "object" || yst_preProcessor.inputText !== this.config.textString) {
        yst_preProcessor = new PreProcessor(this.config.textString);
    }
    //init helper
    if(typeof yst_stringHelper !== "object"){
        yst_stringHelper = new StringHelper();
    }
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
        this.queue = ["keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount"];
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
        this.__output.push(this[this.queue.shift()]());
        this.runQueue();
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
 * checks the keyword density of given keyword against the cleantext stored in __store.
 * @returns resultObject
 */
Analyzer.prototype.keywordDensity = function() {
    if (yst_preProcessor.__store.wordcount > 100) {
        var keywordDensity = this.keywordDensityCheck();
        var rating = this.keywordDensityRating(keywordDensity);
        return {name: "keywordDensity", result: {keywordDensity: keywordDensity.toFixed(1)}, rating: rating};
    } else {
        return {name: "keywordDensity", result: null, rating: null};
    }
};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
Analyzer.prototype.keywordDensityCheck = function(){
    var keywordMatches = yst_stringHelper.matchString(yst_preProcessor.__store.cleanText,[this.config.keyword]);
    var keywordDensity = 0;
    if ( keywordMatches !== null ) {
        var keywordCount = keywordMatches.length;
        keywordDensity = (keywordCount / yst_preProcessor.__store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
    }
    return keywordDensity;
};

/**
 * rates the keyword density against given number
 * @param keywordDensity
 * @returns {number}
 */
Analyzer.prototype.keywordDensityRating = function(keywordDensity){
    var rating;
    switch (true) {
        case (keywordDensity < 1):
            rating =  4;
            break;
        case (keywordDensity > 4.5):
            rating = -50;
            break;
        default:
            rating = 9;
            break;
    }
    return rating;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
Analyzer.prototype.subHeadings = function() {
    var matches = yst_preProcessor.__store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    foundInHeader = this.subHeadingsCheck(matches);
    return this.subHeadingsRating(foundInHeader, matches);
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
            var formattedHeaders = yst_stringHelper.replaceString(matches[i], this.config.wordsToRemove);
            if (formattedHeaders.match(new RegExp(this.config.keyword, "g")) || matches[i].match(new RegExp(this.config.keyword, "g"))) {
                foundInHeader++;
            }
        }
    }
    return foundInHeader;
};

/**
 * Rates the subheadings on base of the number of found keywords in headers.
 * @param foundInHeader
 * @param matches
 * @returns {{name: string, result: (*|{keywordFound: *, numberofHeaders: *}|{keywordFound: number, numberofHeaders: *}), rating: number}}
 */
Analyzer.prototype.subHeadingsRating = function(foundInHeader, matches){
    var result, rating;
    switch(true){
        case foundInHeader === -1:
            result = null;
            rating = 7;
            break;
        case foundInHeader > 0:
            result = {keywordFound: foundInHeader, numberofHeaders: matches.length};
            rating = 9;
            break;
        default:
            result = {keywordFound: 0, numberofHeaders: matches.length};
            rating = 3;
    }
    return {name: "subHeadings", result: result, rating: rating};
};

/**
 * check if the keyword contains stopwords
 */
Analyzer.prototype.stopwords = function(){
    var matches = yst_stringHelper.matchString(this.config.keyword, this.config.stopWords);
    var stopwordCount = matches !== null ? matches.length : 0;
    return {name: "stopWords", result: {count: stopwordCount, matches: matches}, rating:5 };
};


/**
 * calculate Flesch Reading score
 * @returns {result object}
 */
Analyzer.prototype.fleschReading = function(){
    var score =  (206.835 - (1.015 * (yst_preProcessor.__store.wordcount / yst_preProcessor.__store.sentencecount)) - (84.6 * (yst_preProcessor.__store.syllablecount / yst_preProcessor.__store.wordcount))).toFixed(1);
    if(score < 0){score = 0;}else if (score > 100){score = 100;}
    return {name: "fleschReading", result: score};
};

/**
 * counts the links in a given text. Also checks if a link is internal of external.
 * @returns {{total: number, internal: {total: number, dofollow: number, nofollow: number}, external: {total: number, dofollow: number, nofollow: number}, other: {total: number, dofollow: number, nofollow: number}}}
 */
Analyzer.prototype.linkCount = function(){
    var linkMatches = yst_preProcessor.__store.originalText.match(/<a(?:[^>]+)?>(.*?)<\/a>/g);
    var linkCount = {
        total: 0,
        internal: {total: 0, dofollow: 0,nofollow: 0},
        external: {total: 0,dofollow: 0,nofollow: 0},
        other: {total: 0,dofollow: 0,nofollow: 0}
    };
    if(linkMatches !== null){
        linkCount.total = linkMatches.length;
        for(var i = 0; i < linkMatches.length; i++){
            var linkType = this.linkType(linkMatches[i]);
            linkCount[linkType].total++;
            var linkFollow = this.linkFollow(linkMatches[i]);
            linkCount[linkType][linkFollow]++;
        }
    }
    return {name: "linkCount", result: linkCount};
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
    var linkFollow = "dofollow";
    if(url.match(/rel=['"]nofollow['"]/g) !== null){
        linkFollow = "nofollow";
    }
    return linkFollow;
};

/**
 * counts the number of images found in a given textstring, based on the <img>-tag and returns a result object
 * @returns {{name: string, result: {total: number, alt: number, noalt: number}}}
 */
Analyzer.prototype.imageCount = function(){
    var imageCount = {total: 0, alt: 0, noalt: 0};
    var imageMatches = yst_preProcessor.__store.originalText.match(/<img(?:[^>]+)?>/g);
    if(imageMatches !== null){
        imageCount.total = imageMatches.length;
        for (var i = 0; i < imageMatches.length; i++){
            if(this.imageAlttag(imageMatches[i])){
                imageCount.alt++;
            }else{
                imageCount.noalt++;
            }
        }
    }
    return {name: "imageCount", result: imageCount};
};

/**
 * checks if an image has an alttag and if the alttag contains any text.
 * @param image
 * @returns {boolean}
 */
Analyzer.prototype.imageAlttag = function(image){
    var hasAlttag = false;
    var alttag = image.match(/alt=['"](.*?)['"]/g);
    if(alttag !== null){
        if(alttag[0].split("=")[1].match(/[a-z0-9](.*?)[a-z0-9]/g) !== null){
            hasAlttag = true;
        }
    }
    return hasAlttag;
};

/**
 * counts the number of characters in the pagetitle, returns 0 if empty or not set.
 * @returns {{name: string, count: *}}
 */

Analyzer.prototype.pageTitleCount = function(){
    var count = 0;
    if(typeof this.config.pageTitle !== "undefined"){
        count = this.config.pageTitle.length;
    }
    return {name: "pageTitleCount", count: count};
};

/**
 * counts the occurrences of the keyword in the pagetitl, returns 0 if pagetitle is empty or not set.
 * @returns {{name: string, count: number}}
 */
Analyzer.prototype.pageTitleKeyword = function(){
    var count = 0;
    if(typeof this.config.pageTitle !== "undefined") {
        var matches = this.config.pageTitle.match(this.keywordRegex);
        if (matches !== null) {
            count = matches.length;
        }
    }
    return { name: "pageTitleKeyword", count: count };
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
    if(typeof yst_stringHelper !== "object"){
        yst_stringHelper = new StringHelper();
    }
    this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
PreProcessor.prototype.init = function(){
    //call function to clean text
    this.textFormat();
    //call function to count words
    this.wordcount();
};

/**
 * formats the original text form __store and save as cleantext, cleantextSomeTags en cleanTextNoTags
 */
PreProcessor.prototype.textFormat = function(){
    this.__store.cleanText = this.cleanText(this.__store.originalText);
    this.__store.cleanTextSomeTags = this.stripSomeTags(this.__store.cleanText);
    this.__store.cleanTextNoTags = this.stripAllTags(this.__store.cleanTextSomeTags);
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the __store object
 */
PreProcessor.prototype.wordcount = function(){
    /*wordcounters*/
    this.__store.wordcount = this.__store.cleanText.split(" ").length;
    this.__store.wordcountNoTags = this.__store.cleanTextNoTags.split(" ").length;
    /*sentencecounters*/
    this.__store.sentencecount = this.__store.cleanText.split(".").length;
    this.__store.sentencecountNoTags = this.__store.cleanTextNoTags.split(".").length;
    /*syllablecounters*/
    this.__store.syllablecount = this.syllableCount(this.__store.cleanTextNoTags);
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
    var subtractSyllablesRegexp = yst_stringHelper.stringToRegex(preprocessorConfig.syllables.subtractSyllables, true);
    var addSyllablesRegexp = yst_stringHelper.stringToRegex(preprocessorConfig.syllables.addSyllables, true);
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
    textString = textString.replace(/[-;:,()"'|“”]/g, " ");
    //remove apostrophe
    textString = textString.replace(/[’]/g, "");
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
    return yst_stringHelper.stripSpaces(textString);
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSomeTags = function(textString){
    //remove tags, except li, p, h1-6, dd
    textString = textString.replace(/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
    textString = yst_stringHelper.stripSpaces(textString);
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
    textString = yst_stringHelper.stripSpaces(textString);
    return textString;
};
