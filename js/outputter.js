var args = {
    analyzer: true,
    snippetPreview: true,
    inputType: "both",
    elementTarget: "inputForm",
    typeDelay: 300,
    typeDelayStep: 100,
    maxTypeDelay: 1500,
    dynamicDelay: true,
    targets: {
        output: "output",
        overall: "overallScore",
        snippet: "snippet"
    },
    sampleText: {
        url: "please fill in an URL",
        title: "please fill in a title",
        keyword: "please fill in a keyword",
        meta: "please fill in a metadescription",
        text: "please fill in a text"
    }
};

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 * @param args
 * @constructor
 */
AnalyzeLoader = function( args ) {
    window.analyzeLoader = this;
    this.config = args;
    this.inputs = {};
    this.defineElements();
    this.createElements();
    this.bindEvent();
};

/**
 * creates input elements in the DOM
 */
AnalyzeLoader.prototype.createElements = function() {
    var targetElement = document.getElementById( this.config.elementTarget );
    if( this.config.inputType === "both" || this.config.inputType === "inputs" ){
        this.createInput("title", targetElement, "Title");
    }
    this.createText("text", targetElement, "text");
    if( this.config.inputType === "both" || this.config.inputType === "inputs" ) {
        this.createInput("url", targetElement, "URL");
        this.createInput("meta", targetElement, "Metadescription");
    }
    this.createInput("keyword", targetElement, "Focus keyword");
    this.createSnippetPreview();
};

/**
 * Creates inputs for the form, and creates labels and linebreaks.
 * the ID and placeholder text is based on the type variable.
 * @param type
 * @param targetElement
 * @param text
 */
AnalyzeLoader.prototype.createInput = function( type, targetElement, text ) {
    this.createLabel ( type, targetElement, text);
    var input = document.createElement( "input" );
    input.type = "text";
    input.id = type+"Input";
    input.placeholder = this.config.sampleText[ type ];
    targetElement.appendChild( input );
    this.createBr( targetElement );
};

/**
 * Creates textfields for the form, and creates labels and linebreaks;
 * the ID and placeholder text is based on the type variable.
 * @param type
 * @param targetElement
 * @param text
 */
AnalyzeLoader.prototype.createText = function( type, targetElement, text ) {
    this.createLabel ( type, targetElement, text );
    var textarea = document.createElement( "textarea" );
    textarea.placeholder = this.config.sampleText[ type ];
    textarea.id = type+"Input";
    targetElement.appendChild( textarea );
    this.createBr( targetElement );
};

/**
 * creates label for the form. Uses the type variable to fill the for attribute.
 * @param type
 * @param targetElement
 * @param text
 */
AnalyzeLoader.prototype.createLabel = function( type, targetElement, text ) {
    var label = document.createElement( "label" );
    label.innerText = text;
    label.for = type+"Input";
    targetElement.appendChild( label );

};

/**
 * creates linebreak
 * @param targetElement
 */
AnalyzeLoader.prototype.createBr = function( targetElement ) {
    var br = document.createElement( "br" );
    targetElement.appendChild( br );
};

/**
 * creates the elements for the snippetPreview
 */
AnalyzeLoader.prototype.createSnippetPreview = function() {
    var targetElement = document.getElementById( this.config.targets.snippet );
    var div = document.createElement( "div" );
    div.id = "snippet_preview";
    this.createSnippetPreviewTitle( div );
    this.createSnippetPreviewCite ( div );
    this.createSnippetPreviewMeta ( div );
    targetElement.appendChild( div );
};

/**
 * 
 * @param target
 */
AnalyzeLoader.prototype.createSnippetPreviewTitle = function( target ) {
    var title;
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        title = document.createElement("span");
        title.contentEditable = true;
        title.innerText = this.config.sampleText["title"];
    } else {
        title = document.createElement("a");
    }
    title.className = "title";
    title.id = "snippet_title";
    target.appendChild( title );
};

AnalyzeLoader.prototype.createSnippetPreviewCite = function( target ){
    var cite = document.createElement( "cite" );
    cite.className = "url";
    cite.id = "snippet_cite";
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        cite.innerText = this.config.sampleText["url"];
        cite.contentEditable = true;
    }
    target.appendChild( cite );
};

AnalyzeLoader.prototype.createSnippetPreviewMeta = function ( target ){
    var meta = document.createElement( "span" );
    meta.className = "desc";
    meta.id = "snippet_meta";
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        meta.contentEditable = true;
        meta.innerText = this.config.sampleText["meta"];
    }
    target.appendChild( meta );
};

/**
 * defines the target element to be used for the output on the page
 */
AnalyzeLoader.prototype.defineElements = function() {
    this.target = document.getElementById( this.config.targets.output );
};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the analyzer.
 */
AnalyzeLoader.prototype.getInput = function() {
    this.inputs.textString = document.getElementById( "textInput" ).value;
    this.inputs.keyword = document.getElementById( "keywordInput" ).value;
    this.inputs.meta = document.getElementById( "metaInput" ).value;
    this.inputs.url = document.getElementById( "urlInput" ).value;
    this.inputs.pageTitle = document.getElementById( "titleInput" ).value;
};

/**
 * binds the 'input'event to the targetform/input. This will trigger the analyzeTimer funct ion.
 */
AnalyzeLoader.prototype.bindEvent = function() {
    var elem = document.getElementById( this.config.elementTarget );
    elem.__refObj = this;
    elem.addEventListener( "input", this.analyzeTimer );
    if( this.config.inputType === "both" || this.config.inputType === "inline") {
        var snippetElem = document.getElementById(this.config.targets.snippet);
        snippetElem.refObj = this;
        snippetElem.addEventListener("input", this.callBackSnippetData);
        var elems = ["meta", "cite", "title"];
        for (var i = 0; i < elems.length; i++) {
            var targetElement = document.getElementById("snippet_" + elems[i]);
            targetElement.refObj = this;
            targetElement.addEventListener("blur", this.reloadSnippetText);
        }
    }
};

AnalyzeLoader.prototype.callBackSnippetData = function() {
    document.getElementById( "titleInput" ).value = document.getElementById( "snippet_title" ).innerText;
    document.getElementById( "metaInput" ).value = document.getElementById( "snippet_meta" ).innerText;
    document.getElementById( "urlInput" ).value = document.getElementById( "snippet_cite" ).innerText;

};

AnalyzeLoader.prototype.reloadSnippetText = function() {
    if( typeof this.refObj.snippetPreview !== "undefined" ) {
        this.refObj.snippetPreview.reRender();
    }
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won' be executed at every keystroke
 */
AnalyzeLoader.prototype.analyzeTimer = function() {
    var refObj = this.__refObj;
    clearTimeout( window.timer );
    window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retreive values from inputs. If the keyword is empty calls message, if keyword is filled, runs the analyzer
 */
AnalyzeLoader.prototype.checkInputs = function() {
    var refObj = window.analyzeLoader;

    refObj.getInput();
    if( refObj.inputs.keyword === "" ){
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }

};

/**
 * used when no keyword is filled in, it will display a message in the target element
 */
AnalyzeLoader.prototype.showMessage = function() {
    this.target.innerHTML = "";
    var messageDiv = document.createElement( "div" );
    messageDiv.className = "wpseo_msg";
    messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
    this.target.appendChild( messageDiv );
};

/**
 * sets the startTime timestamp
 */
AnalyzeLoader.prototype.startTime = function() {
    this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
AnalyzeLoader.prototype.endTime = function() {
    this.endTimestamp = new Date().getTime();
    if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
        if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
            this.config.typeDelay += this.config.typeDelayStep;
        }
    }
};

/**
 * inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter to format outputs.
 */
AnalyzeLoader.prototype.runAnalyzer = function() {
    if( this.config.dynamicDelay ){
        this.startTime();
    }
    this.pageAnalyzer = new Analyzer( this.inputs );
    this.pageAnalyzer.runQueue();
    this.snippetPreview = new SnippetPreview( this.inputs, this.config.targets );
    this.scoreFormatter = new ScoreFormatter( this.pageAnalyzer, this.config.targets );
    if( this.config.dynamicDelay ){
        this.endTime();
    }
};

/**
 * defines the variables used for the scoreformatter, runs the outputScore en overallScore functions.
 * @param scores
 * @param target
 * @constructor
 */
ScoreFormatter = function ( scores, target ) {
    this.scores = scores.analyzeScorer.__score;
    this.overallScore = scores.analyzeScorer.__totalScore;
    this.outputTarget = target.output;
    this.overallTarget = target.overall;
    this.totalScore = 0;
    this.outputScore();
    this.outputOverallScore();
};

/**
 * creates the table for showing the results from the analyzerscorer
 */
ScoreFormatter.prototype.outputScore = function() {
    this.sortScores();
    var outputTarget = document.getElementById( this.outputTarget );
    outputTarget.innerHTML = "";
    var newTable = document.createElement( "table" );
    newTable.className = "wpseoanalysis";
    for ( var i = 0; i < this.scores.length; i++ ){
        if( this.scores[i].text !== "" ) {
            var newTR = document.createElement( "tr" );
            var newTDScore = document.createElement( "td" );
            newTDScore.className = "score";
            var scoreDiv = document.createElement( "div" );
            scoreDiv.className = "wpseo-score-icon " + this.scoreRating( this.scores[i].score );
            newTDScore.appendChild( scoreDiv );
            var newTD = document.createElement( "td" );
            newTD.innerHTML = this.scores[i].text;
            newTR.appendChild( newTDScore );
            newTR.appendChild( newTD );
            newTable.appendChild( newTR );
        }
    }
    outputTarget.appendChild( newTable );
};

/**
 * sorts the scores array on ascending scores
 */
ScoreFormatter.prototype.sortScores = function() {
    this.scores = this.scores.sort( function( a, b ){
        return a.score - b.score;
    });
};

/**
 * outputs the overallScore in the overallTarget element.
 */
ScoreFormatter.prototype.outputOverallScore = function() {
    var overallTarget = document.getElementById( this.overallTarget );
    overallTarget.innerHTML = "";
    var newSpan = document.createElement( "span" );
    newSpan.className = "wpseo-score-icon  "+this.scoreRating( Math.round( this.overallScore ) );
    overallTarget.appendChild( newSpan );
};

/**
 * retuns a string that is used as a CSSclass, based on the numeric score
 * @param score
 * @returns {scoreRate}
 */
ScoreFormatter.prototype.scoreRating = function( score ){
    var scoreRate;
    switch( score ) {
        case 0:
            scoreRate = "na";
            break;
        case 4:
        case 5:
            scoreRate = "poor";
            break;
        case 6:
        case 7:
            scoreRate = "ok";
            break;
        case 8:
        case 9:
        case 10:
            scoreRate = "good";
            break;
        default:
            scoreRate = "bad";
            break;
    }
    return scoreRate;
};

/**
 * snippetpreview
 */

SnippetPreview = function(args, target) {
    this.config = args;
    this.outputTarget = target.snippet;
    this.init();
};

SnippetPreview.prototype.init = function() {
    if( this.config.pageTitle !== null && this.config.url !== null ) {
        this.output = this.htmlOutput();
        this.renderOutput();
    }
};

SnippetPreview.prototype.htmlOutput = function() {
    var html = {};
    html.title = this.formatTitle();
    html.cite = this.formatCite();
    html.meta = this.formatMeta();
    return html;
};

SnippetPreview.prototype.formatTitle = function() {
    var title = this.config.pageTitle;
    title = this.formatKeyword( title );
    title = "<a href="+this.config.url+" class='title'>" + title + "</a>";
    return title;
};

SnippetPreview.prototype.formatCite = function() {
    var cite = this.config.url;
    cite = this.formatKeyword( cite );
    cite = "<cite class='url'>"+ cite + "</cite>";
    return cite;
};

SnippetPreview.prototype.formatMeta = function() {
    var meta = this.config.meta;
    if(meta === ""){
        meta = this.getMetaText();
        //meta = this.config.textString.substring(analyzerConfig.maxMeta,0);
    }
    meta = this.formatKeyword( meta );
    meta = "<span class='desc'>" + meta + "</span>";
    return meta;
};

SnippetPreview.prototype.getMetaText = function() {
    var indexMatches = [];
    var periodMatches = [0];
    var metaText = this.config.textString.substring(0, 156);
    var i = 0;
    var match;
    while ((match = this.config.textString.indexOf(this.config.keyword, i)) > -1) {
        indexMatches.push(match);
        i = match + this.config.keyword.length;
    }
    i = 0;
    while((match = this.config.textString.indexOf('.', i)) > -1){
        periodMatches.push(match);
        i = match + 1;
    }
    var curStart = 0;
    if(indexMatches.length > 0) {
        for (var j = 0; j < periodMatches.length; ) {
            if (periodMatches[0] < indexMatches[0] ) {
                curStart = periodMatches.shift();
            } else {
                if( curStart > 0 ){
                    curStart += 2;
                }
                break;
            }
        }
        metaText = this.config.textString.substring( curStart, curStart + analyzerConfig.maxMeta );
    }
    return metaText;

};

SnippetPreview.prototype.formatKeyword = function( textString ) {
    var replacer = new RegExp(this.config.keyword, "g");
    return textString.replace(replacer, "<strong>"+this.config.keyword+"</strong>" );
};

/**
 *
 */
SnippetPreview.prototype.renderOutput = function() {
    document.getElementById( "snippet_title" ).innerHTML = this.output.title;
    document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
    document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * function to fill the configs with data from the inputs and call init, to rerender the snippetpreview
 */
SnippetPreview.prototype.reRender = function () {
    this.config.pageTitle = document.getElementById( "snippet_title").innerText;
    this.config.meta = document.getElementById( "snippet_meta").innerText;
    this.config.url = document.getElementById( "snippet_cite").innerText;
    this.init();
};
/**
 * run at pageload to init the analyzeLoader for pageAnalysis.
 */
loadEvents = function(){
    if( document.readyState === "complete" ){
        new AnalyzeLoader( args );
    }else{
        setTimeout( loadEvents, 50 );
    }
};
loadEvents();
