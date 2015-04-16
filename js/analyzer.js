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
    this._output = [];
};

/**
 * initializes required objects.
 */
Analyzer.prototype.initRequiredObjects = function(){
    //init preprocessor if not exists
    if (typeof yst_preProcessor !== 'object' || yst_preProcessor.inputText !== this.config.textString) {
        yst_preProcessor = new PreProcessor(this.config.textString);
    }
    //init helper
    if(typeof yst_stringHelper !== 'object'){
        yst_stringHelper = new StringHelper();
    }
};

/**
 * initializes the function queue.
 */
Analyzer.prototype.initQueue = function(){
    //if no available function queues, make new queue
    if (typeof this.queue !== 'Array') {
        this.queue = [];
    }
    //if custom queue available load queue, otherwise load default queue.
    if(typeof this.config.queue !== 'undefined' && this.config.queue.length !== 0){
        this.queue = this.config.queue;
    }else{
        this.queue = ['keywordDensity', 'subHeadings', 'stopwordChecker', 'fleschReading'];
    }
};

/**
 * load wordlists.
 */
Analyzer.prototype.loadWordlists = function(){
    //if no available keywords, load default array
    if(typeof this.config.wordsToRemove === 'undefined'){
        this.config.wordsToRemove =  analyzerConfig.wordsToRemove;
    }
    if(typeof this.config.stopWords === 'undefined'){
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
        this._output.push(this[this.queue.shift()]());
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
 * checks the keyword density of given keyword against the cleantext stored in _store.
 * @returns resultObject
 */
Analyzer.prototype.keywordDensity = function(){
    if(yst_preProcessor._store.wordcount > 100) {
        var keywordDensity = this.keywordDensityChecker();
        var rating = this.keywordDensityRater(keywordDensity);
        result = {name: 'keywordDensity', result: {keywordDensity: keywordDensity.toFixed(1) }, rating: rating};
    }else{
        result = {name: 'keywordDensity', result: null, rating: null};
    }
    return result;
};

/**
 * checks and returns the keyword density
 * @returns {number}
 */
Analyzer.prototype.keywordDensityChecker = function(){
    var keywordMatches = yst_stringHelper.stringMatcher(yst_preProcessor._store.cleanText,[this.config.keyword]);
    var keywordDensity = 0;
    if ( keywordMatches !== null ) {
        var keywordCount = keywordMatches.length;
        keywordDensity = (keywordCount / yst_preProcessor._store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
    }
    return keywordDensity;
};

/**
 * rates the keyword density against given number
 * @param keywordDensity
 * @returns {number}
 */
Analyzer.prototype.keywordDensityRater = function(keywordDensity){
    switch (true) {
        case (keywordDensity < 1):
            var rating =  4;
            break;
        case (keywordDensity > 4.5):
            var rating = -50;
            break;
        default:
            var rating = 9;
            break;
    }
    return rating;
};

/**
 * checks if keywords appear in subheaders of stored cleanTextSomeTags text.
 * @returns resultObject
 */
Analyzer.prototype.subHeadings = function() {
    var matches = yst_preProcessor._store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    foundInHeader = this.subHeadingsChecker(matches);
    return this.subHeadingsRater(foundInHeader, matches);
};
/**
 * subHeadings checker to check if keyword is present in given headings.
 * @param matches
 * @returns {number}
 */
Analyzer.prototype.subHeadingsChecker = function(matches){
    if (matches === null){
        var foundInHeader = -1;
    }else{
        var foundInHeader = 0;
        for (var i = 0; i < matches.length; i++) {
            var formattedHeaders = yst_stringHelper.stringReplacer(matches[i], this.config.wordsToRemove);
            if (formattedHeaders.match(new RegExp(this.config.keyword, 'g')) || matches[i].match(new RegExp(this.config.keyword, 'g'))) {
                foundInHeader++;
            }
        }
    }
    return foundInHeader
};

/**
 * Rates the subheadings on base of the number of found keywords in headers.
 * @param foundInHeader
 * @param matches
 * @returns {{name: string, result: (*|{keywordFound: *, numberofHeaders: *}|{keywordFound: number, numberofHeaders: *}), rating: number}}
 */
Analyzer.prototype.subHeadingsRater = function(foundInHeader, matches){
    switch(true){
        case foundInHeader === -1:
            var result = null;
            var rating = 7;
            break;
        case foundInHeader > 0:
            var result = {keywordFound: foundInHeader, numberofHeaders: matches.length};
            var rating = 9;
            break;
        default:
            var result = {keywordFound: 0, numberofHeaders: matches.length};
            var rating = 3;
    }
    return {name: 'subHeadings', result: result, rating: rating};
};

/**
 * check if the keyword contains stopwords
 */
Analyzer.prototype.stopwordChecker = function(){
    var matches = yst_stringHelper.stringMatcher(this.config.keyword, this.config.stopWords);
    var stopwordCount = matches !== null ? matches.length : 0;
    return {name: 'stopWords', result: {count: stopwordCount, matches: matches}, rating:5 };
};


/**
 * calculate Flesch Reading score
 */
Analyzer.prototype.fleschReading = function(){
    var score =  (206.835 - (1.015 * (yst_preProcessor._store.wordcount / yst_preProcessor._store.sentencecount)) - (84.6 * (yst_preProcessor._store.syllablecount / yst_preProcessor._store.wordcount))).toFixed(1);
    if(score < 0){score = 0}else if (score > 100){score = 100};
    return {name: 'fleschReading', result: score};
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

StringHelper.prototype.stringReplacer = function(textString, stringsToRemove, replacement){
    if(typeof replacement == 'undefined'){replacement = ' '};
    textString = textString.replace(this.regexStringBuilder(stringsToRemove), replacement);
    return this.stripSpaces(textString);
}

/**
 * matches string with given array of strings to match.
 * @param textString
 * @param stringsToMatch
 * @returns {matches}
 */
StringHelper.prototype.stringMatcher = function(textString, stringsToMatch){
    return textString.match(this.regexStringBuilder(stringsToMatch));
}

/**
 * builds regex from array with strings
 * @param stringArray
 * @returns {RegExp}
 */
StringHelper.prototype.regexStringBuilder = function(stringArray, disableWordBoundary){
    var regexString = '';
    var wordBoundary = '\\b';
    if(disableWordBoundary){
        wordBoundary = '';
    }
    for(var i = 0; i < stringArray.length; i++){
        if(regexString.length > 0){ regexString += '|'; }
        regexString += stringArray[i]+wordBoundary;
    }
    return new RegExp(regexString, 'g');
};

/**
 * Strip extra spaces, replace duplicates with single space. Remove space at front / end of string
 * @param textString
 * @returns textString
 */
StringHelper.prototype.stripSpaces = function(textString){
    //replace multiple spaces with single space
    textString = textString.replace(/ {2,}/g, ' ');
    //remove first/last character if space
    textString = textString.replace(/^\s+|\s+$/g, '');
    return textString;
};

/**
 * PreProcessor object definition. Creates _store object and calls init.
 * @params textString
 */
PreProcessor = function (text){
    //create _store object to store data
    this._store = {};
    this._store.originalText = text;
    if(typeof yst_stringHelper != 'object'){
        yst_stringHelper = new StringHelper();
    }
    this.init();
};

/**
 * init function calling all necessary PreProcessorfunctions
 */
PreProcessor.prototype.init = function(){
    //call function to clean text
    this.textFormatter();
    //call function to count words
    this.wordcount();
};

/**
 * formats the original text form _store and save as cleantext, cleantextSomeTags en cleanTextNoTags
 */
PreProcessor.prototype.textFormatter = function(){
    this._store.cleanText = this.cleanText(this._store.originalText);
    this._store.cleanTextSomeTags = this.stripSomeTags(this._store.cleanText);
    this._store.cleanTextNoTags = this.stripAllTags(this._store.cleanTextSomeTags);
};

/**
 * saves wordcount (all words) and wordcountNoTags (all words except those in tags) in the _store object
 */
PreProcessor.prototype.wordcount = function(){
    /*wordcounters*/
    this._store.wordcount = this._store.cleanText.split(' ').length;
    this._store.wordcountNoTags = this._store.cleanTextNoTags.split(' ').length;
    /*sentencecounters*/
    this._store.sentencecount = this._store.cleanText.split('.').length;
    this._store.sentencecountNoTags = this._store.cleanTextNoTags.split('.').length;
    /*syllablecounters*/
    this._store.syllablecount = this.syllableCount(this._store.cleanTextNoTags);
};

/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
PreProcessor.prototype.syllableCount = function(textString) {
    this.syllableCount = 0;
    textString = textString.replace(/[.]/g, ' ');
    textString = this.wordRemover(textString);
    var words = textString.split(' ');
    var subtractSyllablesRegexp = yst_stringHelper.regexStringBuilder(preprocessorConfig.syllables.subtractSyllables, true);
    var addSyllablesRegexp = yst_stringHelper.regexStringBuilder(preprocessorConfig.syllables.addSyllables, true);
    for (var i = 0; i < words.length; i++){
        this.basicSyllableCounter(words[i].split(/[^aeiouy]/g));
        this.advancedSyllableCounter(words[i], subtractSyllablesRegexp, 'subtract');
        this.advancedSyllableCounter(words[i], addSyllablesRegexp, 'add');
    }
    return this.syllableCount;
};

/**
 * counts the syllables by splitting on consonants
 * @param splitWordArray
 */

PreProcessor.prototype.basicSyllableCounter = function(splitWordArray){
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
PreProcessor.prototype.advancedSyllableCounter = function(inputString, regex, operator){
    var match = inputString.match(regex);
    if(match !== null){
        if(operator === 'subtract'){
            this.syllableCount -= match.length;
        }else if(operator === 'add'){
            this.syllableCount += match.length;
        }
    }
};

/**
 * removes words from textstring and count syllables. Used for words that fail against regexes.
 * @param textString
 * @returns textString with exclusionwords removed
 */
PreProcessor.prototype.wordRemover = function(textString){
    for (var i = 0; i < preprocessorConfig.syllables.exclusionWords.length; i++){
        var exclusionRegex = new RegExp(preprocessorConfig.syllables.exclusionWords[i].word, 'g');
        var matches = textString.match(exclusionRegex);
        if(matches !== null){
            this.syllableCount += preprocessorConfig.syllables.exclusionWords[i].syllables;
            textString = textString.replace(exclusionRegex, '');
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
    textString = textString.replace(/[-;:,()"'|“”]/g, ' ');
    //remove apostrophe
    textString = textString.replace(/[’]/g, '');
    //unify all terminators
    textString = textString.replace(/[.?!]/g, '.');
    //add period in case it is missing
    textString += '.';
    //replace newlines with spaces
    textString = textString.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ' ');
    //remove duplicate terminators
    textString = textString.replace(/([\.])[\. ]+/g, '$1');
    //pad sentence terminators
    textString = textString.replace(/[ ]*([\.])+/g, '$1 ');
    //Remove "words" comprised only of numbers
    textString = textString.replace(/[0-9]+[ ]/g, '');
    return yst_stringHelper.stripSpaces(textString);
};

/**
 * removes all HTMLtags from input string, except h1-6, li, p and dd
 * @param textString
 * @returns textString
 */
PreProcessor.prototype.stripSomeTags = function(textString){
    //remove tags, except li, p, h1-6, dd
    textString = textString.replace(/\<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
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
