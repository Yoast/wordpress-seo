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
    if( this.refObj.source.formattedData.pageTitle !== null && this.refObj.source.formattedData.cite !== null ) {
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
	html.url = this.formatUrl();
    return html;
};

/**
 * formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 * @returns {formatted page title}
 */
YoastSEO_SnippetPreview.prototype.formatTitle = function() {
    var title = this.refObj.source.formattedData.snippetTitle;
    if(title === ""){
        title = this.refObj.source.formattedData.pageTitle;
    }
	if(title === ""){
		title = this.refObj.config.sampleText.title;
	}
    title = this.refObj.stringHelper.stripAllTags( title );
	if(this.refObj.source.formattedData.keyword !== ""){
    	return this.formatKeyword( title );
	}
	return title;
};

/**
 * removes the protocol name from the urlstring.
 * @returns formatted url
 */
YoastSEO_SnippetPreview.prototype.formatUrl = function() {
	var url = this.refObj.source.formattedData.url;
	//removes the http(s) part of the url
	url.replace(/https?:\/\//ig, "");
	return url;
};


/**
 * formats the url for the snippet preview
 * @returns formatted url
 */
YoastSEO_SnippetPreview.prototype.formatCite = function() {
    var cite = this.refObj.source.formattedData.snippetCite;
    cite = this.refObj.stringHelper.stripAllTags( cite );
	if(cite === ""){
		cite = this.refObj.config.sampleText.url;
		return cite;
	}else {
		return this.formatKeywordUrl(cite);
	}
};

/**
 * formats the metatext for the snippet preview, if empty runs getMetaText
 * @returns formatted metatext
 */
YoastSEO_SnippetPreview.prototype.formatMeta = function() {
    var meta = this.refObj.source.formattedData.snippetMeta;
    if(meta === ""){
        meta = this.getMetaText();
    }
    meta = this.refObj.stringHelper.stripAllTags( meta );
    meta = meta.substring(0,YoastSEO_config.analyzerConfig.maxMeta);
	if(this.refObj.source.formattedData.keyword !== "") {
		return this.formatKeyword(meta);
	}
	return meta;
};

/**
 * formats the metatext, based on the keyword to select a part of the text.
 * If no keyword matches, takes the first 156chars (depending on the config).
 * If keyword and/or text is empty, it uses the sampletext.
 * @returns metatext
 */
YoastSEO_SnippetPreview.prototype.getMetaText = function() {
    var metaText;
    if(typeof this.refObj.source.formattedData.excerpt !== "undefined"){
        metaText = this.refObj.source.formattedData.excerpt.substring(0, YoastSEO_config.analyzerConfig.maxMeta);
    }
    if(metaText === ""){
		metaText = this.refObj.config.sampleText.meta;
		if(this.refObj.source.formattedData.keyword !== "" && this.refObj.source.formattedData.text !== "") {
			var indexMatches = this.getIndexMatches();
			var periodMatches = this.getPeriodMatches();
			metaText = this.refObj.source.formattedData.text.substring(0, YoastSEO_config.analyzerConfig.maxMeta);
			var curStart = 0;
			if (indexMatches.length > 0) {
				for (var j = 0; j < periodMatches.length;) {
					if (periodMatches[0] < indexMatches[0]) {
						curStart = periodMatches.shift();
					} else {
						if (curStart > 0) {
							curStart += 2;
						}
						break;
					}
				}
				metaText = this.refObj.source.formattedData.text.substring(curStart, curStart + YoastSEO_config.analyzerConfig.maxMeta);
			}
		}
    }
    return metaText;
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
YoastSEO_SnippetPreview.prototype.getIndexMatches = function() {
    var indexMatches = [];
    var i = 0;
    //starts at 0, locates first match of the keyword.
    var match = this.refObj.source.formattedData.text.indexOf( this.refObj.source.formattedData.keyword, i );
    //runs the loop untill no more indexes are found, and match returns -1.
    while ( match > -1 ) {
        indexMatches.push( match );
        //pushes location to indexMatches and increase i with the length of keyword.
        i = match + this.refObj.source.formattedData.keyword.length;
		match = this.refObj.source.formattedData.text.indexOf( this.refObj.source.formattedData.keyword, i );
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
    while( ( match = this.refObj.source.formattedData.text.indexOf( ".", i ) ) > -1 ){
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
    //matches case insensitive and global
    var replacer = new RegExp( this.refObj.source.formattedData.keyword, "ig" );
    return textString.replace( replacer, function(str){return "<strong>"+str+"</strong>"; } );
};

/**
 * formats the keyword for use in the URL by accepting - and _ in stead of space and by adding <strong>-tags
 * @param textString
 * @returns {XML|string|void}
 */
YoastSEO_SnippetPreview.prototype.formatKeywordUrl = function ( textString ) {
    var replacer = this.refObj.source.formattedData.keyword.replace(" ", "[-_]");
    //matches case insensitive and global
    replacer = new RegExp( replacer, "ig" );
    return textString.replace( replacer, function(str){return "<strong>"+str+"</strong>"; } );
};

/**
 * Renders the outputs to the elements on the page.
 */
YoastSEO_SnippetPreview.prototype.renderOutput = function() {
    document.getElementById( "snippet_title" ).innerHTML = this.output.title;
    document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
	document.getElementById( "snippet_citeBase").innerHTML = this.output.url;
    document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * function to call init, to rerender the snippetpreview
 */
YoastSEO_SnippetPreview.prototype.reRender = function () {
    this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
YoastSEO_SnippetPreview.prototype.disableEnter = function( ev ) {
	if(ev.keyCode === 13){
		ev.returnValue = false;
		ev.cancelBubble = true;
		ev.preventDefault();
	}
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
YoastSEO_SnippetPreview.prototype.checkTextLength = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch(ev.currentTarget.id){
		case "snippet_meta":
			if(text.length > YoastSEO_config.analyzerConfig.maxMeta){
				ev.currentTarget.__unformattedText = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring(0, YoastSEO_config.analyzerConfig.maxMeta);
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if(text.length > 40){
				ev.currentTarget.__unformattedText = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring(0, 40);
				ev.currentTarget.className = "title";
			}
			break;
		default:
			break;
	}
};

/**
 * adds and remove the tooLong class when a text is too long.
 * @param ev
 */
YoastSEO_SnippetPreview.prototype.textFeedback = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch(ev.currentTarget.id){
		case "snippet_meta":
			if(text.length > YoastSEO_config.analyzerConfig.maxMeta){
				ev.currentTarget.className = "desc tooLong";
			}else {
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if(text.length > 40){
				ev.currentTarget.className = "title tooLong";
			}else{
				ev.currentTarget.className = "title";
			}
			break;
		default:
			break;
	}
};

/**
 * shows the edit icon corresponding to the hovered element
 * @param ev
 */
YoastSEO_SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 * @param ev
 */
YoastSEO_SnippetPreview.prototype.hideEditIcon = function(){
	var elems = document.getElementsByClassName( "editIcon ");
	for (var i = 0; i < elems.length; i++){
		elems[i].className = "snippet_container";
	}
};