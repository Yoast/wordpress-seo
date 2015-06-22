var args = {
    source: YoastSEO_WordPressScraper,
    analyzer: true,
    snippetPreview: true,
    //inputType is inputs, inline or both
    inputType: "both",
    elementTarget: "poststuff",
    typeDelay: 300,
    typeDelayStep: 100,
    maxTypeDelay: 1500,
    dynamicDelay: true,
    multiKeyword: false,
    targets: {
        output: "wpseo_meta",
        overall: "overallScore",
        snippet: "wpseosnippet"
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
YoastSEO_AnalyzeLoader = function( args ) {
    window.analyzeLoader = this;
    this.config = args;
    this.inputs = {};
    this.defineElements();
    this.source = new this.config.source( args );
    if(this.config.snippetPreview){
        this.createSnippetPreview();
    }
    this.bindEvent();
};


/**
 * creates the elements for the snippetPreview
 */
YoastSEO_AnalyzeLoader.prototype.createSnippetPreview = function() {
    var targetElement = document.getElementById( this.config.targets.snippet );
    var div = document.createElement( "div" );
    div.id = "snippet_preview";
    this.createSnippetPreviewTitle( div );
    this.createSnippetPreviewUrl ( div );
    this.createSnippetPreviewMeta ( div );
    targetElement.appendChild( div );
};

/**
 * creates the title elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO_AnalyzeLoader.prototype.createSnippetPreviewTitle = function( target ) {
    var title;
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        title = document.createElement( "span" );
        title.contentEditable = true;
        title.innerText = this.config.sampleText[ "title" ];
    } else {
        title = document.createElement( "a" );
    }
    title.className = "title";
    title.id = "snippet_title";
    target.appendChild( title );
};

/**
 * creates the URL elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO_AnalyzeLoader.prototype.createSnippetPreviewUrl = function( target ){
    var cite = document.createElement( "cite" );
    cite.className = "url";
    cite.id = "snippet_cite";
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        cite.innerText = this.config.sampleText[ "url" ];
        cite.contentEditable = true;
    }
    target.appendChild( cite );
};

/**
 * creates the meta description elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO_AnalyzeLoader.prototype.createSnippetPreviewMeta = function ( target ){
    var meta = document.createElement( "span" );
    meta.className = "desc";
    meta.id = "snippet_meta";
    if( this.config.inputType === "both" || this.config.inputType === "inline" ){
        meta.contentEditable = true;
        meta.innerText = this.config.sampleText[ "meta" ];
    }
    target.appendChild( meta );
};

/**
 * defines the target element to be used for the output on the page
 */
YoastSEO_AnalyzeLoader.prototype.defineElements = function() {
    this.target = document.getElementById( this.config.targets.output );
};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the analyzer.
 */
YoastSEO_AnalyzeLoader.prototype.getInput = function() {
    this.inputs.textString = this.source.getInput( "text" );
    this.inputs.keyword = this.source.getInput( "keyword" );
    this.inputs.meta = this.source.getInput( "meta" );
    this.inputs.url = this.source.getInput( "url" );
    this.inputs.pageTitle = this.source.getInput( "title" );
};

/**
 * binds the events to the generated inputs. Binds events on the snippetinputs if editable
 */
YoastSEO_AnalyzeLoader.prototype.bindEvent = function() {
    this.bindInputEvent();
    if( this.config.inputType === "both" || this.config.inputType === "inline" ) {
        this.bindSnippetEvents();
    }
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO_AnalyzeLoader.prototype.bindInputEvent = function() {
    var elem = document.getElementById( this.config.elementTarget );
    elem.__refObj = this;
    elem.addEventListener( "input", this.analyzeTimer );
};

/**
 * binds the reloadSnippetText function to the blur of the snippet inputs.
 */
YoastSEO_AnalyzeLoader.prototype.bindSnippetEvents = function() {
    var snippetElem = document.getElementById(this.config.targets.snippet);
    snippetElem.refObj = this;
    snippetElem.addEventListener("input", this.callBackSnippetData);
    var elems = ["meta", "cite", "title"];
    for (var i = 0; i < elems.length; i++) {
        var targetElement = document.getElementById( "snippet_" + elems[i] );
        targetElement.refObj = this;
        targetElement.addEventListener( "blur", this.reloadSnippetText );
    }
};

/**
 * callBackSnippetData is bound on the inputs of the snippetPreview, to update the inputs when entering text
 * in the snippetPreview.
 */
YoastSEO_AnalyzeLoader.prototype.callBackSnippetData = function() {
    this.source.setInputData( "title",  document.getElementById( "snippet_title" ).innerText );
    this.source.setInputData( "meta",  document.getElementById( "snippet_meta" ).innerText );
    this.source.setInputData( "url",  document.getElementById( "snippet_cite" ).innerText );
};

/**
 * runs the rerender function of the snippetPreview if that object is defined.
 */
YoastSEO_AnalyzeLoader.prototype.reloadSnippetText = function() {
    if( typeof this.refObj.snippetPreview !== "undefined" ) {
        this.refObj.snippetPreview.reRender();
    }
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won' be executed at every keystroke
 */
YoastSEO_AnalyzeLoader.prototype.analyzeTimer = function() {
    var refObj = this.__refObj;
    clearTimeout( window.timer );
    window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retreive values from inputs. If the keyword is empty calls message, if keyword is filled, runs the analyzer
 */
YoastSEO_AnalyzeLoader.prototype.checkInputs = function() {
    var refObj = window.analyzeLoader;

    refObj.getInput();
    if( refObj.inputs.keyword === "" ) {
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }
};

/**
 * used when no keyword is filled in, it will display a message in the target element
 */
YoastSEO_AnalyzeLoader.prototype.showMessage = function() {
    this.target.innerHTML = "";
    var messageDiv = document.createElement( "div" );
    messageDiv.className = "wpseo_msg";
    messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
    this.target.appendChild( messageDiv );
};

/**
 * sets the startTime timestamp
 */
YoastSEO_AnalyzeLoader.prototype.startTime = function() {
    this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
YoastSEO_AnalyzeLoader.prototype.endTime = function() {
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
YoastSEO_AnalyzeLoader.prototype.runAnalyzer = function() {
    if( this.config.dynamicDelay ){
        this.startTime();
    }
    this.pageAnalyzer = new YoastSEO_Analyzer( this.inputs );
    this.pageAnalyzer.runQueue();
    this.snippetPreview = new YoastSEO_SnippetPreview( this );
    this.scoreFormatter = new YoastSEO_ScoreFormatter( this.pageAnalyzer, this.config.targets );
    if( this.config.dynamicDelay ){
        this.endTime();
    }
};


/**
 * run at pageload to init the analyzeLoader for pageAnalysis.
 */
loadEvents = function() {
    if( document.readyState === "complete" ){
        loader = new YoastSEO_AnalyzeLoader( args );
    }else{
        setTimeout( loadEvents, 50 );
    }
};
loadEvents();
