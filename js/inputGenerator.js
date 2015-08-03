/**
 * Inputgenerator generates a form for use as input.
 * @param args
 * @param refObj
 * @constructor
 */
YoastSEO_InputGenerator = function( args, refObj ){
    this.config = args;
    this.refObj = refObj;
    this.analyzerData = {};
    this.formattedData = {};
    this.createElements();
    this.getData();
};
/**
 * creates input elements in the DOM
 */
YoastSEO_InputGenerator.prototype.createElements = function() {
    var targetElement = document.getElementById( this.config.elementTarget );
    this.createText("text", targetElement, "text");
    this.createInput("keyword", targetElement, "Focus keyword");

};

YoastSEO_InputGenerator.prototype.getData = function() {
    this.analyzerData.keyword = this.refObj.config.sampleText.keyword;
    this.analyzerData.meta = this.refObj.config.sampleText.meta;
    this.analyzerData.snippetMeta = this.refObj.config.sampleText.meta;
    this.analyzerData.text = this.refObj.config.sampleText.text;
    this.analyzerData.title = this.refObj.config.sampleText.title;
    this.analyzerData.snippetTitle = this.refObj.config.sampleText.title;
    this.analyzerData.pageTitle = this.refObj.config.sampleText.title;
    this.analyzerData.url = this.refObj.config.sampleText.url;
    this.analyzerData.snippetCite = this.refObj.config.sampleText.url;
    this.formattedData = this.analyzerData;
};


/**
 * Creates inputs for the form, and creates labels and linebreaks.
 * the ID and placeholder text is based on the type variable.
 * @param type
 * @param targetElement
 * @param text
 */
YoastSEO_InputGenerator.prototype.createInput = function( type, targetElement, text ) {
    this.createLabel ( type, targetElement, text);
    var input = document.createElement( "input" );
    input.type = "text";
    input.id = type+"Input";
    input.refObj = this.refObj;
    input.placeholder = this.config.sampleText[ type ];
    targetElement.appendChild( input );
};

/**
 * Creates textfields for the form, and creates labels and linebreaks;
 * the ID and placeholder text is based on the type variable.
 * @param type
 * @param targetElement
 * @param text
 */
YoastSEO_InputGenerator.prototype.createText = function( type, targetElement, text ) {
    this.createLabel ( type, targetElement, text );
    var textarea = document.createElement( "textarea" );
    textarea.placeholder = this.config.sampleText[ type ];
    textarea.id = type+"Input";
    targetElement.appendChild( textarea );
};

/**
 * creates label for the form. Uses the type variable to fill the for attribute.
 * @param type
 * @param targetElement
 * @param text
 */
YoastSEO_InputGenerator.prototype.createLabel = function( type, targetElement, text ) {
    var label = document.createElement( "label" );
    label.textContent = text;
    label.htmlFor = type+"Input";
    targetElement.appendChild( label );
};

/**
 * initializes the snippetPreview if it isn't there.
 * If it is already initialized, it get's new values from the inputs and rerenders snippet.
 */
YoastSEO_InputGenerator.prototype.getAnalyzerInput = function() {
    if(typeof this.refObj.snippetPreview === "undefined") {
        this.refObj.init();
    }else{
        this.formattedData.text = this.getDataFromInput( "text" );
        this.formattedData.keyword = this.getDataFromInput( "keyword" );
        this.formattedData.snippetTitle = this.getDataFromInput( "title" );
        this.formattedData.snippetMeta = this.getDataFromInput( "meta" );
        this.formattedData.snippetCite = this.getDataFromInput( "url" );
        this.refObj.reloadSnippetText();
    }
    this.refObj.runAnalyzerCallback();
};

/**
 * calls the eventbinders.
 */
YoastSEO_InputGenerator.prototype.bindElementEvents = function() {
    this.inputElementEventBinder();
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 */
YoastSEO_InputGenerator.prototype.snippetPreviewEventBinder = function() {
    var elems = ["cite", "meta", "title"];
    for (var i = 0; i < elems.length; i++){
        document.getElementById("snippet_"+elems[i]).addEventListener("focus", this.snippetCallback);
    }
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO_InputGenerator.prototype.inputElementEventBinder = function() {
    var elems = ["textInput", "keywordInput","snippet_cite", "snippet_meta", "snippet_title"];
    for (var i = 0; i < elems.length; i++){
        document.getElementById(elems[i]).__refObj = this;
        document.getElementById(elems[i]).addEventListener("change", this.renewData);
    }
};

/**
 * calls getAnalyzerinput function on change event from element
 * @param event
 */
YoastSEO_InputGenerator.prototype.renewData = function ( ev ) {
    ev.currentTarget.__refObj.getAnalyzerInput();
};

/**
 * calles getAnalyzerinput function on focus of the snippet elements;
 * @param event
 */
YoastSEO_InputGenerator.prototype.snippetCallback = function( ev ) {
    ev.currentTarget.__refObj.getAnalyzerInput();
};