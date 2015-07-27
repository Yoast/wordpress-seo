/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 * @param args
 * @constructor
 */
YoastSEO = function( args ) {
    window.YoastSEO_loader = this;
    this.config = args;
    this.inputs = {};
	this.loadQueue();
    this.stringHelper = new YoastSEO_StringHelper();
    this.source = new this.config.source(args, this);
    this.checkInputs();
    if(!this.config.ajax){
        this.defineElements();
    }
};

/**
 * inits YoastSEO, calls element definer and snippet preview creater
 */
YoastSEO.prototype.init = function(){
    this.defineElements();
    this.createSnippetPreview();
};

/**
* loads the queue from the analyzer if no queue is defined.
*/
YoastSEO.prototype.loadQueue = function() {
	if(typeof this.queue === "undefined"){
		this.queue = YoastSEO_config.analyzerConfig.queue;
	}
};

/**
 * Adds function to the analyzer queue. Function must be in the Analyzer prototype to be added.
 * @param func
 */
YoastSEO.prototype.addToQueue = function( func ) {
	if(typeof YoastSEO_Analyzer.prototype[func] === "function"){
		this.queue.push( func );
	}
};

/**
 * Removes function from queue if it is currently in the queue.
 * @param func
 */
YoastSEO.prototype.removeFromQueue = function( func ) {
	var funcIndex = this.queue.indexOf( func );
	if(funcIndex > -1) {
		this.queue.splice(funcIndex, 1);
	}
};


/**
 * creates the elements for the snippetPreview
 */
YoastSEO.prototype.createSnippetPreview = function() {
    var targetElement = document.getElementById( this.config.targets.snippet );
    var div = document.createElement( "div" );
    div.id = "snippet_preview";
	targetElement.appendChild( div );
    this.createSnippetPreviewTitle( div );
    this.createSnippetPreviewUrl ( div );
    this.createSnippetPreviewMeta ( div );
    this.snippetPreview = new YoastSEO_SnippetPreview( this );
    this.bindEvent();
    this.bindSnippetEvents();
};

/**
 * creates the title elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO.prototype.createSnippetPreviewTitle = function( target ) {
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "title_container";
	target.appendChild( elem );
    var title;
    title = document.createElement( "span" );
    title.contentEditable = true;
    title.textContent = this.config.sampleText.title;
    title.className = "title";
    title.id = "snippet_title";
    elem.appendChild( title );
	//this.createEditIcon( elem, "title");
};

/**
 * creates the URL elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO.prototype.createSnippetPreviewUrl = function( target ){
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "url_container";
	target.appendChild( elem );
    var baseUrl = document.createElement( "cite" );
    baseUrl.className = "url urlBase";
	baseUrl.id = "snippet_citeBase";
	elem.appendChild( baseUrl );
	var cite = document.createElement( "cite" );
	cite.className = "url";
	cite.id = "snippet_cite";
    cite.textContent = this.config.sampleText.url;
    cite.contentEditable = true;
    elem.appendChild( cite );
	//this.createEditIcon( elem, "url" );
};

/**
 * creates the meta description elements in the snippetPreview and appends to target
 * @param target
 */
YoastSEO.prototype.createSnippetPreviewMeta = function ( target ){
	var elem = document.createElement( "div" );
	elem.className = "snippet_container";
	elem.id = "meta_container";
	target.appendChild( elem );
    var meta = document.createElement( "span" );
    meta.className = "desc";
    meta.id = "snippet_meta";
    meta.contentEditable = true;
    meta.textContent = this.config.sampleText.meta;
    elem.appendChild( meta );
	//this.createEditIcon( elem, "desc" );
};

/**
 * defines the target element to be used for the output on the page
 */
YoastSEO.prototype.defineElements = function() {
    this.target = document.getElementById( this.config.targets.output );
    for ( var i = 0; i < this.config.elementTarget.length; i++ ){
		var elem = document.getElementById(this.config.elementTarget[i]);
		if(elem !== null) {
			elem.__refObj = this;
		}

    }
};


YoastSEO.prototype.createEditIcon = function( elem, id ) {
	var div = document.createElement( "div" );
	div.className = "editIcon";
	div.id = "editIcon_"+id;
	elem.appendChild( div );

};

/**
 * gets the values from the inputfields. The values from these fields are used as input for the analyzer.
 */
YoastSEO.prototype.getAnalyzerInput = function() {
    this.inputs = this.source.getAnalyzerInput();
};

/**
 * binds the events to the generated inputs. Binds events on the snippetinputs if editable
 */
YoastSEO.prototype.bindEvent = function() {
    this.source.bindElementEvents();
};

/**
 * binds the analyzeTimer function to the input of the targetElement on the page.
 */
YoastSEO.prototype.bindInputEvent = function() {
    for (var i = 0; i < this.config.elementTarget.length; i++) {
        var elem = document.getElementById( this.config.elementTarget[i] );
        elem.addEventListener( "input", this.analyzeTimer );
    }
};

/**
 * binds the reloadSnippetText function to the blur of the snippet inputs.
 */
YoastSEO.prototype.bindSnippetEvents = function() {
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
YoastSEO.prototype.reloadSnippetText = function() {
    if( typeof this.snippetPreview !== "undefined" ) {
        this.snippetPreview.reRender();
    }
};

/**
 * the analyzeTimer calls the checkInputs function with a delay, so the function won't be executed at every keystroke
 * checks the reference object, so this function can be called from anywhere, without problems with different scopes.
 */
YoastSEO.prototype.analyzeTimer = function() {
    var refObj = this.__refObj;
    //if __refObj is not found (used on elements), use refObj
    if( typeof refObj === "undefined" ){
        refObj = this.refObj;
    }
    //if refObj is not found (used on objects), use this
    if( typeof refObj === "undefined" ){
        refObj = this;
    }
    clearTimeout( window.timer );
    window.timer = setTimeout( refObj.checkInputs, refObj.config.typeDelay );
};

/**
 * calls the getInput function to retrieve values from inputs. If the keyword is empty calls message, if keyword is filled, runs the analyzer
 */
YoastSEO.prototype.checkInputs = function() {
    var refObj = window.YoastSEO_loader;
    refObj.getAnalyzerInput();
};

YoastSEO.prototype.runAnalyzerCallback = function() {
    var refObj = window.YoastSEO_loader;
    if( refObj.source.analyzerData.keyword === "" ) {
        refObj.showMessage();
    }else{
        refObj.runAnalyzer();
    }
};

/**
 * used when no keyword is filled in, it will display a message in the target element
 */
YoastSEO.prototype.showMessage = function() {
    this.target.innerHTML = "";
    var messageDiv = document.createElement( "div" );
    messageDiv.className = "wpseo_msg";
    messageDiv.innerHTML = "<p><strong>No focus keyword was set for this page. If you do not set a focus keyword, no score can be calculated.</strong></p>";
    this.target.appendChild( messageDiv );
};

/**
 * sets the startTime timestamp
 */
YoastSEO.prototype.startTime = function() {
    this.startTimestamp = new Date().getTime();
};

/**
 * sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 */
YoastSEO.prototype.endTime = function() {
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
YoastSEO.prototype.runAnalyzer = function() {
    if( this.config.dynamicDelay ){
        this.startTime();
    }
	if( typeof this.pageAnalyzer === "undefined") {
		var args = this.source.analyzerData;
		args.queue = this.queue;
		this.pageAnalyzer = new YoastSEO_Analyzer(args);
	}else{
		this.pageAnalyzer.init();
	}
    this.pageAnalyzer.runQueue();
    this.scoreFormatter = new YoastSEO_ScoreFormatter( this.pageAnalyzer, this.config.targets );
    if( this.config.dynamicDelay ){
        this.endTime();
    }
};


/**
 * run at pageload to init the analyzeLoader for pageAnalysis.
 */
YoastSEO_loadEvents = function() {
    if( document.readyState === "complete" ){
        var YoastSEO_loader = new YoastSEO( YoastSEO_args );
    }else{
        setTimeout( YoastSEO_loadEvents, 50 );
    }
};
YoastSEO_loadEvents();
