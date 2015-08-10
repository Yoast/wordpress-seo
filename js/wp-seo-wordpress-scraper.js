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
	var val = "";
	switch( inputType){
		case "text":
		case "content":
			val = this.getContentTinyMCE();
			break;
		case "url":
			if(document.getElementById( "sample-permalink" ) !== null) {
				val = document.getElementById( "sample-permalink" ).innerHTML.split("<span")[0];
			}
			break;
		case "cite":
		case "editable-post-name":
			if(document.getElementById( "editable-post-name") !== null) {
				val = document.getElementById( "editable-post-name" ).textContent;
				var elem = document.getElementById( "new-post-slug" );
				if (elem !== null && val === "") {
					val = document.getElementById( "new-post-slug" ).value;
				}
			}
			break;
		case "meta":
			val = document.getElementById( "yoast_wpseo_metadesc" ).value;
			break;
		case "keyword":
			val = document.getElementById( "yoast_wpseo_focuskw" ).value;
			break;
		case "title":
		case "snippetTitle":
			val = document.getElementById( "yoast_wpseo_title" ).value;
			break;
		case "pageTitle":
			val = document.getElementById( "title" ).value;
			break;
		case "excerpt":
			val = document.getElementById( "excerpt" ).value;
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
			if( document.getElementById( "editable-post-name" )  !== null ) {
				document.getElementById( "editable-post-name" ).textContent = value;
				document.getElementById( "editable-post-name-full").textContent = value;
			}
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
			document.getElementById( "snippet_title" ).focus();
			break;
		case "meta":
			document.getElementById( "snippet_meta").focus();
			document.getElementById( "snippet_meta" ).textContent = document.getElementById( "yoast_wpseo_metadesc" ).value;

			break;
		case "url":
			var newUrl = document.getElementById( "snippet_cite" ).textContent;
			document.getElementById( "editable-post-name" ).textContent = newUrl;
			document.getElementById( "editable-post-name" ).focus();
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
				YoastSEO_loader.source.replacedVars[srcObj.replaceableVar] = data;
				YoastSEO_loader.source.replaceVariables (srcObj.textString, srcObj.type, srcObj.object);
			}
		}
	);
};

/**
 * calls the eventbinders.
 */
YoastSEO_WordPressScraper.prototype.bindElementEvents = function() {
	this.snippetPreviewEventBinder();
	this.inputElementEventBinder();
	document.getElementById("yoast_wpseo_focuskw").addEventListener("keydown", this.refObj.snippetPreview.disableEnter);
};

/**
 * binds the getinputfieldsdata to the snippetelements.
 */
YoastSEO_WordPressScraper.prototype.snippetPreviewEventBinder = function() {
	var elems = ["snippet_cite", "snippet_meta", "snippet_title"];
	for (var i = 0; i < elems.length; i++) {
		document.getElementById(elems[i]).addEventListener("focus", this.getInputFieldsData);
		document.getElementById(elems[i]).addEventListener("keydown", this.refObj.snippetPreview.disableEnter);
		document.getElementById(elems[i]).addEventListener("blur", this.refObj.snippetPreview.checkTextLength);
		//textFeedback is given on input (when user types or pastests), but also on focus. If a string that is too long is being recalled
		//from the saved values, it gets the correct classname right away.
		document.getElementById(elems[i]).addEventListener("input", this.refObj.snippetPreview.textFeedback);
		document.getElementById(elems[i]).addEventListener("focus", this.refObj.snippetPreview.textFeedback);
		//shows edit icon by hovering over element
		document.getElementById(elems[i]).addEventListener("mouseover", this.refObj.snippetPreview.showEditIcon);
		//hides the edit icon onmouseout, on focus and on keyup. If user clicks or types AND moves his mouse, the edit icon could return while editting
		//by binding to these 3 events
		document.getElementById(elems[i]).addEventListener("mouseout", this.refObj.snippetPreview.hideEditIcon);
		document.getElementById(elems[i]).addEventListener("focus", this.refObj.snippetPreview.hideEditIcon);
		document.getElementById(elems[i]).addEventListener("keyup", this.refObj.snippetPreview.hideEditIcon);
	}
	var elems = ["title_container", "url_container", "meta_container"];
	//when clicked on the
	for (var i = 0; i < elems.length; i++) {
		document.getElementById(elems[i]).addEventListener("click", this.refObj.snippetPreview.setFocus)
	}
};

/**
 * bins the renewData function on the change of inputelements.
 */
YoastSEO_WordPressScraper.prototype.inputElementEventBinder = function() {
	var elems = ["excerpt", "content", "editable-post-name", "yoast_wpseo_focuskw"];
	for (var i = 0; i < elems.length; i++){
		var elem = document.getElementById(elems[i]);
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
 * Uses the __unformattedText if the textFeedback function has put a string there (if text was too long).
<<<<<<< HEAD
 * clears this after use. 
=======
 * clears this after use.
>>>>>>> c492d59c88810384699239dc68f8f9d3aed696c5
 * @param ev
 */
YoastSEO_WordPressScraper.prototype.updateSnippetValues = function( ev ) {
	var dataFromSnippet = ev.currentTarget.textContent;
	if(typeof ev.currentTarget.__unformattedText !== "undefined"){
		if(ev.currentTarget.__unformattedText !== ""){
			dataFromSnippet = ev.currentTarget.__unformattedText;
			ev.currentTarget.__unformattedText = "";
		}
	}
	ev.currentTarget.refObj.source.setDataFromSnippet( dataFromSnippet, ev.currentTarget.id);
	ev.currentTarget.refObj.source.getData();
	ev.currentTarget.refObj.source.getAnalyzerInput();
};

/**
 * Saves the score to the linkdex.
 * Outputs the score in the overalltarget.
 * @param score
 */
YoastSEO_WordPressScraper.prototype.saveScores = function( score ) {
	//fancy SVG needs to go here.
	document.getElementById(this.config.targets.overall).textContent = score;
	document.getElementById("yoast_wpseo_linkdex").value = score;
};

/**
 * binds to the WordPress jQuery function to put the permalink on the page.
 * If the response matches with permalinkstring, the snippet can be rerendered.
 */
jQuery(document).on("ajaxComplete", function(ev,response){
	if(response.responseText.match("Permalink:") !== null){
		YoastSEO_loader.source.getData();
		YoastSEO_loader.source.getAnalyzerInput();
		YoastSEO_loader.snippetPreview.reRender();
	}
});
