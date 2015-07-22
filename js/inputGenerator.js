/**
 * Inputgenerator generates a form for use as input.
 * @param args
 * @param refObj
 * @constructor
 */
YoastSEO_InputGenerator = function( args, refObj ){
    this.config = args;
    this.refObj = refObj;
    this.createElements();
};
/**
 * creates input elements in the DOM
 */
YoastSEO_InputGenerator.prototype.createElements = function() {
    var targetElement = document.getElementById( this.config.elementTarget );
    this.createText("text", targetElement, "text");
    this.createInput("keyword", targetElement, "Focus keyword");

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
    label.innerText = text;
    label.htmlFor = type+"Input";
    targetElement.appendChild( label );
};

/**
 * creates linebreak
 * @param targetElement
 */
YoastSEO_InputGenerator.prototype.createBr = function( targetElement ) {
    var br = document.createElement( "br" );
    targetElement.appendChild( br );
};

/**
 * get values from generated inputfields.
 * @param inputType
 * @returns {*}
 */
YoastSEO_InputGenerator.prototype.getInput = function( inputType ) {
    var val;
    switch( inputType){
        case "text":
            val = document.getElementById( "textInput" ).value;
            break;
        case "url":
            val = document.getElementById("snippet_cite").innerText;
            break;
        case "meta":
            val = document.getElementById("snippet_meta").innerText;
            break;
        case "keyword":
            val = document.getElementById("keywordInput").value;
            break;
        case "title":
            val = document.getElementById("snippet_title").innerText;
            break;
        default:
            break;
    }
    return val;
};

/**
 * callback for the generated snippet.
 */
YoastSEO_InputGenerator.prototype.snippetCallback = function( ) {
    this.refObj.analyzeTimer();
};