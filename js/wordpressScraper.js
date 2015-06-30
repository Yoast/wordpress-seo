/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO_WordPressScraper = function() {
    this.values = {};
};

/**
 * gets necessary content from different inputfields
 * @returns values object
 */
YoastSEO_WordPressScraper.prototype.getContent = function() {
    this.values.keyword = this.getInput( "keyword" );
    this.values.meta = this.getInput( "meta" );
    this.values.textString = this.getInput( "text" );
    this.values.title = this.getInput( "title" );
    this.values.url = this.getInput( "url" );
    return this.values;
};

/**
 *
 * @param inputType
 * @returns {*}
 */
YoastSEO_WordPressScraper.prototype.getInput = function( inputType ) {
    var val;
    switch( inputType){
        case "text":
            val = this.getContentTinyMCE();
            break;
        case "url":
            val = document.getElementById("sample-permalink").innerText;
            var postSlug = document.getElementById("new-post-slug");
            if(postSlug !== null) {
                val += postSlug.value + "/";
            }
            break;
        case "meta":
            val = document.getElementById("yoast_wpseo_metadesc").value;
            break;
        case "keyword":
            val = document.getElementById("yoast_wpseo_focuskw").value;
            break;
        case "title":
            val = document.getElementById("title").value;
            break;
        default:
            break;
    }
    return val;
};

YoastSEO_WordPressScraper.prototype.setInputData = function ( inputType ) {
    switch( inputType ){
        case "title":
            document.getElementById( "title" ).value = document.getElementById( "snippet_title" ).innerText;
            break;
        case "meta":
            document.getElementById( "yoast_wpseo_metadesc" ).value = document.getElementById( "snippet_meta" ).innerText;
            break;
        case "url":
            var urlBase = document.getElementById("sample-permalink").innerText.replace(/https?:\/\//i, "").split("/")[0]+"/";
            var newUrl = document.getElementById( "snippet_cite" ).innerText;
            newUrl = newUrl.replace(urlBase, "");
            document.getElementById("editable-post-name").innerText = newUrl;
            document.getElementById("editable-post-name-full").innerText = newUrl;
            break;
        default:
            break;
    }
};

/**
 * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
 * @returns textString
 */
YoastSEO_WordPressScraper.prototype.getContentTinyMCE = function() {
    var val = document.getElementById( "content").value;
    if(tinyMCE.editors.length !== 0){
        val = tinyMCE.get( "content").getContent();
    }
    return val;
};

/**
 * Callback for the snippet, updates the source with new values from the snippet, then calls the timer function
 */
YoastSEO_WordPressScraper.prototype.snippetCallback = function() {
    this.refObj.source.setInputData( "title" );
    this.refObj.source.setInputData( "meta" );
    this.refObj.source.setInputData( "url" );
    this.refObj.analyzeTimer();
};