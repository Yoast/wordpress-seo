/**
 * Created by danny on 3/19/15.
 */

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
    tmpStr = this._store.origText;
    tmpStr = tmpStr.toLowerCase();
    //replace comma', hyphens etc with spaces
    tmpStr = tmpStr.replace(/[-;:,()"']/g, ' ');
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
    this._store.wordcount = this._store.cleanText.split(" ").length;
    this._store.wordcountNoTags = this._store.cleanTextNoTags.split(" ").length;
}