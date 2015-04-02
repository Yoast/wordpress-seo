/**
 * Created by danny on 3/19/15.
 */

/*text analyzer*/

Analyzer = function (args){
    this.config = args;
    this.init();
};

Analyzer.prototype.init = function() {

    //init preprocessor if not exists
    if (typeof yst_pp != 'object' || yst_pp.inputText != this.config.textString) {
        yst_pp = new PreProcessor(this.config.textString);
    }

    //if no available function queues, make new queue
    if (typeof this.queue != 'Array') {
        this.queue = [];
    }

    //if custom queue available load queue, otherwise load default queue.
    if(typeof this.config.queue != 'undefined' && this.config.queue.length != 0){
        this.queue = this.config.queue;
    }else{
        this.queue = ['keywordDensity', 'subheaderChecker'];
    }

    //set default variables
    this.keywordRegex = new RegExp(this.config.keyword);
    this._output = [];
}

/* function queuer */
Analyzer.prototype.runQueue = function(){
    //remove first function from queue and execute it.
    if(this.queue.length > 0){
        this._output.push(this[this.queue.shift()]());
        this.runQueue();
    }
};

Analyzer.prototype.abortQueue = function(){
    //empty current Queue
    this.queue = [];
};

/*keyword density checker*/
Analyzer.prototype.keywordDensity = function(){
    if(yst_pp._store.wordcount >= 100) {
        var keywordMatches = yst_pp._store.cleanText.match(new RegExp(this.config.keyword, 'g'));
        if ( keywordMatches != null ) {
            var keywordCount = keywordMatches.length;
            var keywordDensity = (keywordCount / yst_pp._store.wordcount - (keywordCount - 1 * keywordCount)) * 100;
        } else {
            var keywordDensity = 0;
        }
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
        result = {name: 'keywordDensity', result: {keywordDensity: keywordDensity.toFixed(1) }, rating: rating};
    }else{
        result = {name: 'keywordDensity', result: null, rating: null};
    }
    return result;
};

/*subheader checker*/
Analyzer.prototype.subheaderChecker = function() {

    //regex for headers
    var headers = yst_pp._store.cleanTextSomeTags.match(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/g);
    if(headers == null){
       result = {name: 'subHeadings', result: null, rating: 7};
    }else {
        var foundInHeader = 0;
        for (var i = 0; i < headers.length; i++) {
            var formattedHeaders = this.stripSeperators(headers[i], true);
            var formattedHeadersKeywords = this.stripSeperators(headers[i], false);
            if (formattedHeaders.match(new RegExp(this.config.keyword, 'g')) || formattedHeadersKeywords.match(new RegExp(this.config.keyword, 'g'))) {
                foundInHeader++;
            }
        }
        if (foundInHeader > 0) {
            var result = {keywordFound: foundInHeader, numberofHeaders: headers.length};
            var rating = 9;
        }else{
            var result = {keywordFound: 0, numberofHeaders: headers.length}
            var rating = 7;
        }
        result = {name: 'subHeadings', result: result, rating: rating};
    }
    return result;
}

/*helper functions*/

/* strip seperators and certain keywords */
Analyzer.prototype.stripSeperators = function(textString, removeOptionalCharacters){
    //words to remove
    var wordsToRemove = [' a', ' in', ' an', ' on', ' for', ' the', ' and'];
    var wordString = '';
    for (var i = 0; i < wordsToRemove.length; i++){
        if(wordString.length > 0){ wordString += '|'; }
        wordString += '('+wordsToRemove[i]+')\\b';
    }
    var wordsRegex = new RegExp(wordString, 'g');
    textString =  textString.replace(wordsRegex, '');
    //remove double space
    return textString.replace(/ {2,}/g, ' ');
}

/*text preprocessor*/
PreProcessor = function (text){
    //create _store object to store data
    this._store = {};
    this._store.origText = text;
    this.init();
}

PreProcessor.prototype.init = function(){
    //call function to clean text
    this.cleanText();
    //call function to count words
    this.wordcount();
}

PreProcessor.prototype.cleanText = function(){
    var tmpStr = this._store.origText;
    tmpStr = tmpStr.toLocaleLowerCase();
    //replace comma', hyphens etc with spaces
    tmpStr = tmpStr.replace(/[-;:,()"'|“”]/g, ' ');
    //unify all terminators
    tmpStr = tmpStr.replace(/[.?!]/g, '.');
    //add period in case it is missing
    tmpStr += '.';
    //replace newlines with spaces
    tmpStr = tmpStr.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ' ');
    //remove duplicate terminators
    tmpStr = tmpStr.replace(/([\.])[\. ]+/g, '$1');
    //pad sentence terminators
    tmpStr = tmpStr.replace(/[ ]*([\.])+/g, '$1 ');
    //Remove "words" comprised only of numbers
    tmpStr = tmpStr.replace(/[0-9]+[ ]/g, '')
    //replace multiple spaces
    tmpStr = tmpStr.replace(/ {2,}/g, ' ');
    //remove first/last character if space
    tmpStr = tmpStr.replace(/^\s+|\s+$/g, '');
    //save string as cleanText
    this._store.cleanText = tmpStr;
    //remove tags, except li, p, h1-6, dd
    tmpStr = tmpStr.replace(/\<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, " ");
    //replace multiple spaces
    tmpStr = tmpStr.replace(/ {2,}/g, ' ');
    //remove first/last character if space
    tmpStr = tmpStr.replace(/^\s+|\s+$/g, '');
    //save string as cleanText with some tags
    this._store.cleanTextSomeTags = tmpStr;
    //remove all tags
    tmpStr = tmpStr.replace(/(<([^>]+)>)/ig," ");
    //replace multiple spaces
    tmpStr = tmpStr.replace(/ {2,}/g, ' ');
    //remove first/last character if space
    tmpStr = tmpStr.replace(/^\s+|\s+$/g, '');
    //save string as cleanText without tags
    this._store.cleanTextNoTags = tmpStr;
}

PreProcessor.prototype.wordcount = function(){
    this._store.wordcount = this._store.cleanText.split(' ').length;
    this._store.wordcountNoTags = this._store.cleanTextNoTags.split(' ').length;
}