/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO_WordPressScraper = function(args, refObj) {
    this.values = {};
    this.config = args;
    this.refObj = refObj;
    this.replacedVars = [];
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
        case "excerpt":
            val = document.getElementById("excerpt").value;
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
    ev.currentTarget.value = this.__refObj.source.replaceVars( textString, ev.currentTarget );
    this.__refObj.analyzeTimer();
};

/**
 * Replaces %% strings with WordPress variables
 * @param textString
 * @returns {string}
 */
YoastSEO_WordPressScraper.prototype.replaceVars = function( textString, target ) {
    window.tempObj = {};
    var title = this.refObj.snippetPreview.formatTitle();

    if (title.length > 0) {
        textString = textString.replace( /%%title%%/g, title );
    }
    textString = this.defaultReplace( textString );
    var excerpt = this.refObj.pageAnalyzer.YoastSEO_preProcessor.stripAllTags(this.getInput( "excerpt" ));
    if( excerpt.length > 0 ){
        textString.replace( /%%excerpt_only%%/, excerpt);
    }
    if( excerpt === "" && this.getInput( "text" ) !== "" ){
        excerpt = this.refObj.snippetPreview.getMetaText();
    }
    var parentId = document.getElementById( "parent_id" );

    if( parentId !== null && parentId.options[parentId.selectedIndex].text !== wpseoMetaboxL10n.no_parent_text ){
        textString = textString.replace( /%%parent_title%%/, parentId.options[parentId.selectedIndex].text );
    }
    textString.replace( /%%excerpt%%/, excerpt );

    var escaped_seperator = this.refObj.pageAnalyzer.stringHelper.addEscapeChars( wpseoMetaboxL10n.sep );
    var pattern = new RegExp( escaped_seperator + " " + escaped_seperator, "g" );
    textString = textString.replace( pattern, wpseoMetaboxL10n.sep );

    if (textString.indexOf( "%%" ) !== -1 && textString.match( /%%[a-z0-0_-]+%%/i ) !== null && typeof this.replacedVars !== "undefined")
        var regex = /%%[a-z0-9_-]+%%/gi;
        var matches = textString.match( regex );
        for ( var i = 0; i < matches.length; i++ ) {
            if ( typeof( this.replacedVars[ matches[ i ] ] ) !== "undefined" ) {
                textString = textString.replace( matches[ i ], this.replacedVars[ matches[ i ] ] );
            }
            else {
                var replaceableVar = matches[ i ];
                // create the cache already, so we don't do the request twice.
                this.replacedVars[ replaceableVar ] = '';
                this.ajaxReplaceVariables( replaceableVar, this, target, textString );
            }
        }
    target.value = textString;
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
                     .replace( /%%focuskw%%/g, this.refObj.pageAnalyzer.YoastSEO_preProcessor.stripAllTags ( this.refObj.pageAnalyzer.config.keyword) )
};

YoastSEO_WordPressScraper.prototype.ajaxReplaceVariables = function ( replaceableVar, refObj, target, textString ){
    window.tempObj = {};
    window.tempObj.refObj = refObj;
    window.tempObj.currentTarget = target;
    window.tempObj.currentString = textString;
    jQuery.post( ajaxurl, {
            action: 'wpseo_replace_vars',
            string: replaceableVar,
            post_id: document.getElementById( 'post_ID' ).value,
            _wpnonce: wpseoMetaboxL10n.wpseo_replace_vars_nonce
        }, function( data ) {
            if ( data ) {
                tempObj.refObj.replacedVars[ replaceableVar ] = data;
            }
            tempObj.refObj.replaceVars( tempObj.currentString, tempObj.currentTarget);
        }
    );
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