/**
 * wordpress scraper to gather inputfields.
 * @constructor
 */
YoastSEO_WordPressScraper = function(args, refObj) {
    this.config = args;
    this.refObj = refObj;
    this.analyzerData = {};
    this.formattedData = {};
    this.formattedData.usedKeywords = wpseoMetaboxL10n.keyword_usage;
	this.formattedData.searchUrl = "<a target='new' href="+wpseoMetaboxL10n.search_url+">";
	this.formattedData.postUrl = "<a target='new' href="+wpseoMetaboxL10n.post_edit_url+">";
    this.formattedData.queue = ["wordCount",
        "keywordDensity",
        "subHeadings",
        "stopwords",
        "fleschReading",
        "linkCount",
        "imageCount",
        "urlKeyword",
        "urlLength",
        "metaDescription",
        "pageTitleKeyword",
        "pageTitleLength",
        "firstParagraph",
        "keywordDoubles"];
    this.replacedVars = {};
    this.getData();
};

/**
 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippetpreview
 */
YoastSEO_WordPressScraper.prototype.getData = function() {
    this.analyzerData.keyword = this.getDataFromInput( "keyword" );
    this.analyzerData.meta = this.getDataFromInput( "meta" );
    this.analyzerData.text = this.getDataFromInput( "text" );
    this.analyzerData.pageTitle = this.getDataFromInput( "pageTitle" );
    this.analyzerData.title = this.getDataFromInput( "title" );
    this.analyzerData.url = this.getDataFromInput( "url" );
    this.analyzerData.excerpt = this.getDataFromInput( "excerpt" );
    this.analyzerData.snippetTitle = this.getDataFromInput( "snippetTitle" );
    this.analyzerData.snippetMeta = this.getDataFromInput( "meta" );
    this.analyzerData.snippetCite = this.getDataFromInput( "cite" );
};

/**
 * gets the values from the given input. Returns this value
 * @param inputType
 * @returns value
 */
YoastSEO_WordPressScraper.prototype.getDataFromInput = function( inputType ) {
    var val;
    switch( inputType){
        case "text":
        case "content":
            val = this.getContentTinyMCE();
            break;
        case "url":
        case "editable-post-name":
			var elem = document.getElementById("sample-permalink");
			val = "";
			if(elem !== null) {
				val = document.getElementById("sample-permalink").textContent;
				var postSlug = document.getElementById("new-post-slug");
				if (postSlug !== null) {
					val += postSlug.value + "/";
				}
			}
            break;
        case "cite":
			var elem = document.getElementById("sample-permalink");
			val = "";
			if(elem !== null) {
				val = document.getElementById("sample-permalink").textContent.replace(/https?:\/\//i, "");
			}
            break;
        case "meta":
            val = document.getElementById("yoast_wpseo_metadesc").value;
            break;
        case "keyword":
            val = document.getElementById("yoast_wpseo_focuskw").value;
            break;
        case "title":
        case "snippetTitle":
            val = document.getElementById("yoast_wpseo_title").value;
            break;
        case "pageTitle":
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
 * When the snippet is updated, update the (hidden) fields on the page
 * @param value
 * @param type
 */
YoastSEO_WordPressScraper.prototype.setDataFromSnippet = function( value, type) {
    switch(type){
        case "snippet_meta":
            document.getElementById("yoast_wpseo_metadesc").value = value;
            break;
        case "snippet_cite":
            document.getElementById("editable-post-name").textContent = value;
            break;
        case "snippet_title":
            document.getElementById("yoast_wpseo_title").value = value;
            break;
        default:
            break;
    }
};

/**
 * feeds data to the loader that is required for the analyzer
 * @param inputType
 */
YoastSEO_WordPressScraper.prototype.getAnalyzerInput = function() {
    this.analyzerDataQueue = ["text", "keyword", "meta", "url", "title", "pageTitle", "snippetTitle", "snippetMeta", "snippetCite", "excerpt"];
    this.runDataQueue();
};

/**
 * Queue for the analyzer data. Runs a queue to prevent timing issues with the replace variable callback
 */
YoastSEO_WordPressScraper.prototype.runDataQueue = function() {
    if(this.analyzerDataQueue.length > 0){
        var currentData = this.analyzerDataQueue.shift();
        this.replaceVariables(this.analyzerData[currentData], currentData, this.formattedData);
    }else{
        if(typeof this.refObj.snippetPreview === "undefined") {
            this.refObj.init();
        }else{
            this.refObj.reloadSnippetText();
        }
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
            document.getElementById( "snippet_title" ).textContent = document.getElementById( "yoast_wpseo_title" ).value;
            break;
        case "meta":
            document.getElementById( "snippet_meta" ).textContent = document.getElementById( "yoast_wpseo_metadesc" ).value;
            break;
        case "url":
            var urlBase = document.getElementById("sample-permalink").textContent.replace(/https?:\/\//i, "").split("/")[0]+"/";
            var newUrl = document.getElementById( "snippet_cite" ).textContent;
            newUrl = newUrl.replace(urlBase, "");
            document.getElementById("editable-post-name").textContent = newUrl;
            document.getElementById("editable-post-name-full").textContent = newUrl;
            break;
        default:
            break;
    }
};

/**
 * Replaces %% strings with WordPress variables
 * @param textString
 * @param type
 * @param object
 * @param target
 * @returns {string}
 */
YoastSEO_WordPressScraper.prototype.replaceVariables = function( textString, type, object) {
    if(typeof textString === "undefined"){
        object[type] = "";
        this.runDataQueue();

    } else {
        textString = this.titleReplace(textString);
        textString = this.defaultReplace(textString);
        textString = this.parentReplace(textString);
        textString = this.doubleSepReplace(textString);
        textString = this.excerptReplace(textString);

        if (textString.indexOf("%%") !== -1 && textString.match(/%%[a-z0-9_-]+%%/i) !== null && typeof this.replacedVars !== "undefined") {
            var regex = /%%[a-z0-9_-]+%%/gi;
            var matches = textString.match(regex);
            for (var i = 0; i < matches.length; i++) {
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
            if (textString.match(/%%[a-z0-9_-]+%%/i) === null) {
                object[type] = textString;
                this.runDataQueue();
            }
        } else {
            object[type] = textString;
            this.runDataQueue();
        }
    }
};


/**
 * replaces %%title%% with the title
 * @param textString
 * @returns textString
 */
YoastSEO_WordPressScraper.prototype.titleReplace = function ( textString ){
    var title = this.analyzerData.title;
    if(typeof title === "undefined"){
        title = this.analyzerData.pageTitle;
    }
    if (title.length > 0) {
        textString = textString.replace( /%%title%%/g, title );
    }
    return textString;
};

/**
 * replaces %%parent_title%% with the selected value from selectbox (if available on page).
 * @param textString
 * @returns textString
 */
YoastSEO_WordPressScraper.prototype.parentReplace = function ( textString ){
    var parentId = document.getElementById( "parent_id" );

    if( parentId !== null && parentId.options[parentId.selectedIndex].text !== wpseoMetaboxL10n.no_parent_text ){
        textString = textString.replace( /%%parent_title%%/, parentId.options[parentId.selectedIndex].text );
    }
    return textString;
};

/**
 * removes double seperators and replaces them with a single seperator
 * @param textString
 * @returns textString
 */
YoastSEO_WordPressScraper.prototype.doubleSepReplace = function (textString ){
    var escaped_seperator = this.refObj.stringHelper.addEscapeChars( wpseoMetaboxL10n.sep );
    var pattern = new RegExp( escaped_seperator + " " + escaped_seperator, "g" );
    textString = textString.replace( pattern, wpseoMetaboxL10n.sep );
    return textString;
};

/**
 * replaces the excerpts strings with strings for the excerpts, if not empty.
 * @param textString
 * @returns {*}
 */
YoastSEO_WordPressScraper.prototype.excerptReplace = function ( textString ){
    if( this.analyzerData.excerpt.length > 0 ){
        textString.replace( /%%excerpt_only%%/, this.analyzerData.excerpt);
        textString.replace( /%%excerpt%%/, this.analyzerData.excerpt );
    }
    return textString;
};

/**
 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
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
        .replace( /%%focuskw%%/g, this.refObj.stringHelper.stripAllTags ( this.analyzerData.keyword) );
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

/**
 * calls the eventbinders.
 */
//todo check if elements need to be rebound
YoastSEO_WordPressScraper.prototype.bindElementEvents = function() {
    this.snippetPreviewEventBinder();
    this.inputElementEventBinder();
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 */
YoastSEO_WordPressScraper.prototype.snippetPreviewEventBinder = function() {
    var elems = ["cite", "meta", "title"];
    for (var i = 0; i < elems.length; i++){
        document.getElementById("snippet_"+elems[i]).addEventListener("focus", this.getInputFieldsData);
    }
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO_WordPressScraper.prototype.inputElementEventBinder = function() {
    var elems = ["excerpt", "content", "editable-post-name", "yoast_wpseo_focuskw"];
    for (var i = 0; i < elems.length; i++){
		elem = document.getElementById(elems[i]);
		if(elem !== null) {
			document.getElementById(elems[i]).addEventListener("change", this.renewData);
		}
    }
};

/**
 * renews Data in the analyzerData object and reruns the getAnalyzerInput to keep data up to date.
 * @param ev
 */
YoastSEO_WordPressScraper.prototype.renewData = function ( ev ) {
    ev.currentTarget.__refObj.source.getData();
    ev.currentTarget.__refObj.source.getAnalyzerInput();
};

/**
 * Updates the snippet values, is bound by the loader when generating the elements for the snippet.
 * @param ev
 */
YoastSEO_WordPressScraper.prototype.updateSnippetValues = function( ev ) {
    ev.currentTarget.refObj.source.setDataFromSnippet( ev.currentTarget.textContent, ev.currentTarget.id);
    ev.currentTarget.refObj.source.getData();
    ev.currentTarget.refObj.source.getAnalyzerInput();
};