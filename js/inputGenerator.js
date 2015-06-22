YoastSEO_InputGenerator = function( args ){
    this.config = args;
    this.createElements();
};
/**
 * creates input elements in the DOM
 */
YoastSEO_InputGenerator.prototype.createElements = function() {
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
YoastSEO_InputGenerator.prototype.createText = function( type, targetElement, text ) {
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
YoastSEO_InputGenerator.prototype.createLabel = function( type, targetElement, text ) {
    var label = document.createElement( "label" );
    label.innerText = text;
    label.for = type+"Input";
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

YoastSEO_InputGenerator.prototype.getInputs = function( inputType ) {

};

YoastSEO_InputGenerator.prototype.setInputData = function( inputType, value ) {

};
