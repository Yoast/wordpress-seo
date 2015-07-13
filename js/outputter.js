/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 * @param args
 * @constructor
 */
YoastSEO_AnalyzeLoader = function( args ) {
    window.analyzeLoader = this;
    this.config = args;
    this.inputs = {};
    this.stringHelper = new YoastSEO_StringHelper();
    this.source = new this.config.source(args, this);
    this.checkInputs();
    if(!this.config.ajax){
        this.defineElements();
        this.createSnippetPreview();
    }
};

YoastSEO_AnalyzeLoader.prototype.init = function(){
    this.defineElements();
    this.createSnippetPreview();
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
    this.snippetPreview = new YoastSEO_SnippetPreview( this );
    this.bindEvent();
    this.bindSnippetEvents();
};

/**
 * creates the title elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO_AnalyzeLoader.prototype.createSnippetPreviewTitle = function( target ) {
    var title;
    title = document.createElement( "span" );
    title.contentEditable = true;
    title.innerText = this.config.sampleText[ "title" ];
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
    cite.innerText = this.config.sampleText[ "url" ];
    cite.contentEditable = true;
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
    meta.contentEditable = true;
    meta.innerText = this.config.sampleText[ "meta" ];
    target.appendChild( meta );
};

/**
 * defines the target element to be used for the output on the page
 */
YoastSEO_AnalyzeLoader.prototype.defineElements = function() {
    this.target = document.getElementById( this.config.targets.output );
    for ( var i = 0; i < this.config.elementTarget.length; i++ ){
        document.getElementById( this.config.elementTarget[i]).__refObj = this;
    }
};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the analyzer.
 */
YoastSEO_AnalyzeLoader.prototype.getAnalyzerInput = function() {
    this.inputs = this.source.getAnalyzerInput();
};

/**
 * binds the events to the generated inputs. Binds events on the snippetinputs if editable
 */
YoastSEO_AnalyzeLoader.prototype.bindEvent = function() {
    this.source.bindElementEvents();
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO_AnalyzeLoader.prototype.bindInputEvent = function() {
   // this.source.bindElementEvents();
    for (var i = 0; i < this.config.elementTarget.length; i++) {
        var elem = document.getElementById( this.config.elementTarget[i] );
        elem.addEventListener( "input", this.analyzeTimer );
    }
};

/**
 * binds the reloadSnippetText function to the blur of the snippet inputs.
 */
YoastSEO_AnalyzeLoader.prototype.bindSnippetEvents = function() {
    var snippetElem = document.getElementById(this.config.targets.snippet);
    snippetElem.refObj = this;
    var elems = ["meta", "cite", "title"];
    for (var i = 0; i < elems.length; i++) {
        var targetElement = document.getElementById( "snippet_" + elems[i] );
        targetElement.refObj = this;
        targetElement.addEventListener( "blur", this.source.updateSnippetValues );

    }
};

/**
 * runs the rerender function of the snippetPreview if that object is defined.
 */
YoastSEO_AnalyzeLoader.prototype.reloadSnippetText = function() {
    if( typeof this.snippetPreview !== "undefined" ) {
        this.snippetPreview.reRender();
    }
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won' be executed at every keystroke
 */
YoastSEO_AnalyzeLoader.prototype.analyzeTimer = function() {
    //todo check refObj references on elements
    var refObj = this.__refObj;
    if( typeof refObj === "undefined" ){
        refObj = this.refObj;
    }
    if( typeof refObj === "undefined" ){
        refObj = this;
    }
    clearTimeout( window.timer );
    window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retrieve values from inputs. If the keyword is empty calls message, if keyword is filled, runs the analyzer
 */
YoastSEO_AnalyzeLoader.prototype.checkInputs = function() {
    var refObj = window.analyzeLoader;
    refObj.getAnalyzerInput();
};

YoastSEO_AnalyzeLoader.prototype.runAnalyzerCallback = function() {
    var refObj = window.analyzeLoader;
    if( refObj.source.analyzerData.keyword === "" ) {
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }
}

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
    this.pageAnalyzer = new YoastSEO_Analyzer( this.source.analyzerData );
    this.pageAnalyzer.runQueue();

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
