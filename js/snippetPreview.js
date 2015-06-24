/**
 * snippetpreview
 */

/**
 * defines the config and outputTarget for the YoastSEO_SnippetPreview
 * @param refObj
 * @constructor
 */
YoastSEO_SnippetPreview = function( refObj ) {
    this.refObj = refObj;
    this.init();
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
YoastSEO_SnippetPreview.prototype.init = function() {
    if( this.refObj.inputs.pageTitle !== null && this.refObj.inputs.url !== null ) {
        this.output = this.htmlOutput();
        this.renderOutput();
    }
};

/**
 * creates html object to contain the strings for the snippetpreview
 * @returns {html object with html-strings}
 */
YoastSEO_SnippetPreview.prototype.htmlOutput = function() {
    var html = {};
    html.title = this.formatTitle();
    html.cite = this.formatCite();
    html.meta = this.formatMeta();
    return html;
};

/**
 * formats the title for the snippet preview
 * @returns {formatted page title}
 */
YoastSEO_SnippetPreview.prototype.formatTitle = function() {
    var title = this.refObj.inputs.pageTitle;
    title = this.refObj.pageAnalyzer.YoastSEO_preProcessor.stripAllTags( title );
    return this.formatKeyword( title );
};

/**
 * formats the url for the snippet preview
 * @returns formatted url
 */
YoastSEO_SnippetPreview.prototype.formatCite = function() {
    var cite = this.refObj.inputs.url;
    cite = this.refObj.pageAnalyzer.YoastSEO_preProcessor.stripAllTags( cite );
    return this.formatKeyword( cite );
};

/**
 * formats the metatext for the snippet preview, if empty runs getMetaText
 * @returns formatted metatext
 */
YoastSEO_SnippetPreview.prototype.formatMeta = function() {
    var meta = this.refObj.inputs.meta;
    if(meta === ""){
        meta = this.getMetaText();
    }
    meta = this.refObj.pageAnalyzer.YoastSEO_preProcessor.stripAllTags( meta );
    meta = meta.substring(0,analyzerConfig.maxMeta);
    return this.formatKeyword( meta );
};

/**
 * formats the metatext, based on the keyword to select a part of the text.
 * If no keyword matches, takes the first 156chars (depending on the config)
 * @returns metatext
 */
YoastSEO_SnippetPreview.prototype.getMetaText = function() {
    var indexMatches = this.getIndexMatches();
    var periodMatches = this.getPeriodMatches();
    var metaText = this.refObj.inputs.textString.substring(0, analyzerConfig.maxMeta);
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
        metaText = this.refObj.inputs.textString.substring( curStart, curStart + analyzerConfig.maxMeta );
    }
    return metaText;
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
YoastSEO_SnippetPreview.prototype.getIndexMatches = function() {
    var indexMatches = [];
    var match;
    var i = 0;
    while ( ( match = this.refObj.inputs.textString.indexOf( this.refObj.inputs.keyword, i ) ) > -1 ) {
        indexMatches.push( match );
        i = match + this.refObj.inputs.keyword.length;
    }
    return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns array with sentences
 */
YoastSEO_SnippetPreview.prototype.getPeriodMatches = function() {
    var periodMatches = [0];
    var match;
    var i = 0;
    while( ( match = this.refObj.inputs.textString.indexOf( ".", i ) ) > -1 ){
        periodMatches.push( match );
        i = match + 1;
    }
    return periodMatches;
};

/**
 * formats the keyword for use in the snippetPreview by adding <strong>-tags
 * @param textString
 * @returns textString
 */
YoastSEO_SnippetPreview.prototype.formatKeyword = function( textString ) {
    var replacer = new RegExp( this.refObj.inputs.keyword, "ig" );
    return textString.replace( replacer, "<strong>"+this.refObj.inputs.keyword+"</strong>" );
};

/**
 * Renders the outputs to the elements on the page.
 */
YoastSEO_SnippetPreview.prototype.renderOutput = function() {
    document.getElementById( "snippet_title" ).innerHTML = this.output.title;
    document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
    document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * function to fill the configs with data from the inputs and call init, to rerender the snippetpreview
 */
YoastSEO_SnippetPreview.prototype.reRender = function () {
    //this.refObj.inputs.pageTitle = document.getElementById( "snippet_title" ).innerText;
    //this.refObj.inputs.meta = document.getElementById( "snippet_meta" ).innerText;
    //this.refObj.inputs.url = document.getElementById( "snippet_cite" ).innerText;
    this.init();
};