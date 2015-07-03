/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO_WordPressScraper = function(args, refObj) {
    this.values = {};
    this.config = args;
    this.refObj = refObj;
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
 * binds events to all input elements
 */
YoastSEO_WordPressScraper.prototype.bindElementEvents = function() {
    var elems = this.refObj.config.elementTarget;
    for (var i = 0; i < elems.length; i++){
        document.getElementById( elems[i]).addEventListener( "change", this.elementEvents );
    }
};

/**
 *
 */
YoastSEO_WordPressScraper.prototype.elementEvents = function( ev ) {
    textString = ev.currentTarget.value;
    if (typeof textString === "undefined"){
        textString = ev.currentTarget.firstChild.value;
    }
    ev.currentTarget.value = this.__refObj.source.replaceVars( textString );
    this.__refObj.analyzeTimer();
};

YoastSEO_WordPressScraper.prototype.replaceVars = function( textString ) {
    var title = this.refObj.snippetPreview.formatTitle();

    if (title.length > 0) {
        textString = textString.replace( /%%title%%/g, title );
    }
    textString = textString.replace( /%%sitedesc%%/g, wpseoMetaboxL10n.sitedesc )
                           .replace( /%%sitename%%/g, wpseoMetaboxL10n.sitename )
                           .replace( /%%sep%%/g, wpseoMetaboxL10n.sep )
                           .replace( /%%date%%/g, wpseoMetaboxL10n.date )
                           .replace( /%%id%%/g, wpseoMetaboxL10n.id )
                           .replace( /%%page%%/g, wpseoMetaboxL10n.page )
                           .replace( /%%currenttime%%/g, wpseoMetaboxL10n.currenttime )
                           .replace( /%%currentdate%%/g, wpseoMetaboxL10n.currentdate )
                           .replace( /%%currentday%%/g, wpseoMetaboxL10n.currentday )
                           .replace( /%%currentmonth%%/g, wpseoMetaboxL10n.currentmonth )
                           .replace( /%%currentyear%%/g, wpseoMetaboxL10n.currentyear )
    return textString;
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