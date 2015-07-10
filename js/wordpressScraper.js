/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO_WordPressScraper = function(args, refObj) {
    this.config = args;
    this.refObj = refObj;
    this.analyzerData = {};
    this.formattedAnalyzerData = {};
    this.formattedSnippetData = {};
    this.replacedVars = {};
    this.getData();
};

YoastSEO_WordPressScraper.prototype.getData = function() {
    this.analyzerData.keyword = this.getDataFromInput( "keyword" );
    this.analyzerData.meta = this.getDataFromInput( "meta" );
    this.analyzerData.text = this.getDataFromInput( "text" );
    this.analyzerData.title = this.getDataFromInput( "title" );
    this.analyzerData.url = this.getDataFromInput( "url" );
    this.analyzerData.excerpt = this.getDataFromInput( "excerpt" );
};


YoastSEO_WordPressScraper.prototype.getDataFromInput = function( inputType ) {
    var val;
    switch( inputType){
        case "text":
            val = this.getContentTinyMCE();
            break;
        case "url":
        case "cite":
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
        case "excerpt":
            val = document.getElementById("excerpt").value;
            break;
        default:
            break;
    }
    return val;
};

/**
 * feeds data to the loader that is required for the analyzer
 * @param inputType
 */
YoastSEO_WordPressScraper.prototype.getAnalyzerInput = function() {
    this.analyzerDataQueue = ["text", "keyword", "meta", "url", "title"];
    this.runAnalyzerDataQueue();
};

/**
 * Queue for the analyzer data. Runs a queue to prevent timing issues with the replace variable callback
 */
YoastSEO_WordPressScraper.prototype.runAnalyzerDataQueue = function() {
    if(this.analyzerDataQueue.length > 0){
        var currentData = this.analyzerDataQueue.shift();
        this.replaceVariables(this.analyzerData[currentData], currentData, this.formattedAnalyzerData)
    }else{
        this.refObj.runAnalyzerCallback();
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
 * gets data from hidden input fields. Is triggered on click in the snippet preview. Fetches data and inserts into snippetPreview
 * @param inputType
 */
YoastSEO_WordPressScraper.prototype.getInputFieldsData = function ( ev ) {
    var inputType = ev.currentTarget.id.replace(/snippet_/i, "");
    switch( inputType ){
        case "title":
            document.getElementById( "snippet_title" ).innerText = document.getElementById( "title" ).value;
            break;
        case "meta":
            document.getElementById( "snippet_meta" ).innerText = document.getElementById( "yoast_wpseo_metadesc" ).value;
            break;
        case "url":
            /*var urlBase = document.getElementById("sample-permalink").innerText.replace(/https?:\/\//i, "").split("/")[0]+"/";
            var newUrl = document.getElementById( "snippet_cite" ).innerText;
            newUrl = newUrl.replace(urlBase, "");
            document.getElementById("editable-post-name").innerText = newUrl;
            document.getElementById("editable-post-name-full").innerText = newUrl;*/
            break;
        default:
            break;
    }
};

/*
YoastSEO_WordPressScraper.prototype.setSnippetData = function( inputType ) {

};
    */


/**
 * Replaces %% strings with WordPress variables
 * @param textString
 * @returns {string}
 */
YoastSEO_WordPressScraper.prototype.replaceVariables = function( textString, type, object ) {
    var title = this.analyzerData.title;

    if (title.length > 0) {
        textString = textString.replace( /%%title%%/g, title );
    }
    textString = this.defaultReplace( textString );
    var excerpt = this.analyzerData.excerpt;
    if( excerpt.length > 0 ){
        textString.replace( /%%excerpt_only%%/, excerpt);
    }
  /*  if( excerpt === "" && this.analyzerData.text !== "" ){
        excerpt = this.refObj.snippetPreview.getMetaText();
    }*/
    var parentId = document.getElementById( "parent_id" );

    if( parentId !== null && parentId.options[parentId.selectedIndex].text !== wpseoMetaboxL10n.no_parent_text ){
        textString = textString.replace( /%%parent_title%%/, parentId.options[parentId.selectedIndex].text );
    }
    textString.replace( /%%excerpt%%/, excerpt );

    var escaped_seperator = this.refObj.stringHelper.addEscapeChars( wpseoMetaboxL10n.sep );
    var pattern = new RegExp( escaped_seperator + " " + escaped_seperator, "g" );
    textString = textString.replace( pattern, wpseoMetaboxL10n.sep );

    if (textString.indexOf( "%%" ) !== -1 && textString.match( /%%[a-z0-0_-]+%%/i ) !== null && typeof this.replacedVars !== "undefined"){
        var regex = /%%[a-z0-9_-]+%%/gi;
        var matches = textString.match( regex );
        for ( var i = 0; i < matches.length; i++ ) {
            if (typeof( this.replacedVars[matches[i]] ) !== "undefined") {
                textString = textString.replace(matches[i], this.replacedVars[matches[i]]);
            }
            else {
                var replaceableVar = matches[i];
                // create the cache already, so we don't do the request twice.
                this.replacedVars[replaceableVar] = '';
                var srcObj = {};
                srcObj.replaceableVar = replaceableVar;
                srcObj.textString = textString;
                srcObj.type = type;
                srcObj.object = object;
                this.ajaxReplaceVariables(srcObj);
            }
        }
        if(textString.match( /%%[a-z0-0_-]+%%/i ) === null) {
            object[type] = textString;
            this.runAnalyzerDataQueue();
        }
    } else {
        object[type] = textString;
        this.runAnalyzerDataQueue();
    }
};

/**
 *
 * @param textString
 */
YoastSEO_WordPressScraper.prototype.defaultReplace = function (textString){
    return textString.replace( /%%sitedesc%%/g, wpseoMetaboxL10n.sitedesc )
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
        .replace( /%%focuskw%%/g, this.refObj.stringHelper.stripAllTags ( this.analyzerData.keyword) )
};

/**
 * Variable replacer. Gets the replaceable var from an Ajaxcall, saves this in the replacedVars object and runs the
 * replace function again to replace the new found values.
 * @param srcObj
 */
YoastSEO_WordPressScraper.prototype.ajaxReplaceVariables = function( srcObj ) {
    jQuery.post( ajaxurl, {
            action: 'wpseo_replace_vars',
            string: srcObj.replaceableVar,
            post_id: jQuery( '#post_ID' ).val(),
            _wpnonce: wpseoMetaboxL10n.wpseo_replace_vars_nonce
        }, function( data ) {
            if ( data ) {
                analyzeLoader.source.replacedVars[srcObj.replaceableVar] = data;
                analyzeLoader.source.replaceVariables (srcObj.textString, srcObj.type, srcObj.object);
            }
        }
    );
};

YoastSEO_WordPressScraper.prototype.bindElementEvents = function() {
    this.snippetPreviewEventBinder();
};

YoastSEO_WordPressScraper.prototype.snippetPreviewEventBinder = function() {
    var elems = ["cite", "meta", "title"];
    for (var i = 0; i < elems.length; i++){
        document.getElementById("snippet_"+elems[i]).addEventListener("focus", this.getInputFieldsData);
    }
};