/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * snippetpreview
 */

/**
 * defines the config and outputTarget for the YoastSEO.SnippetPreview
 *
 * @param {YoastSEO.App} refObj
 *
 * @constructor
 */
YoastSEO.SnippetPreview = function( refObj ) {
	this.refObj = refObj;
	this.unformattedText = {
		snippet_cite: "",
		snippet_meta: "",
		snippet_title: ""
	};
	this.init();
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
YoastSEO.SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.pageTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.checkCiteAvailable();
		this.output = this.htmlOutput();
		this.renderOutput();
	}
};

/**
 * checks if the snippetCite is available
 */
YoastSEO.SnippetPreview.prototype.checkCiteAvailable = function() {
	if ( typeof this.refObj.callbacks.citeAvailable !== "undefined" ) {
		this.refObj.callbacks.citeAvailable();
	}
};

/**
 * creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object}
 */
YoastSEO.SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 *
 * @returns {String}
 */
YoastSEO.SnippetPreview.prototype.formatTitle = function() {
	var title = this.refObj.rawData.snippetTitle;
	if ( title === "" ) {
		title = this.refObj.rawData.pageTitle;
	}
	this.unformattedText.snippet_title = title;
	if ( title === "" ) {
		title = this.refObj.config.sampleText.title;
	}
	title = this.refObj.stringHelper.stripAllTags( title );
	if ( this.refObj.rawData.keyword !== "" ) {
		return this.formatKeyword( title );
	}
	return title;
};

/**
 * removes the protocol name from the urlstring.
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatUrl = function() {
	var url = this.refObj.rawData.baseUrl;

	//removes the http(s) part of the url
	url.replace( /https?:\/\//ig, "" );
	return url;
};

/**
 * formats the url for the snippet preview
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatCite = function() {
	var cite = this.refObj.rawData.snippetCite;
	cite = this.refObj.stringHelper.stripAllTags( cite );
	this.unformattedText.snippet_cite = cite;
	if ( cite === "" ) {
		cite = this.refObj.config.sampleText.snippetCite;
	}
	return this.formatKeywordUrl( cite );
};

/**
 * formats the metatext for the snippet preview, if empty runs getMetaText
 * @returns formatted metatext
 */
YoastSEO.SnippetPreview.prototype.formatMeta = function() {
	var meta = this.refObj.rawData.meta;
	if ( meta === this.refObj.config.sampleText.snippetMeta ) {
		meta = "";
	}
	this.unformattedText.snippet_meta = meta;
	if ( meta === "" ) {
		meta = this.getMetaText();
	}
	meta = this.refObj.stringHelper.stripAllTags( meta );
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );
	if ( this.refObj.rawData.keyword !== "" && meta !== "" ) {
		return this.formatKeyword( meta );
	}
	return meta;
};

/**
 * formats the metatext, based on the keyword to select a part of the text.
 * If no keyword matches, takes the first 156chars (depending on the config).
 * If keyword and/or text is empty, it uses the sampletext.
 * @returns metatext
 */
YoastSEO.SnippetPreview.prototype.getMetaText = function() {
	var metaText;
	if ( typeof this.refObj.rawData.excerpt !== "undefined" ) {
		metaText = this.refObj.rawData.excerpt;
	}
	if ( metaText === "" ) {
		metaText = this.refObj.config.sampleText.meta;
	}
	metaText = this.refObj.stringHelper.stripAllTags( metaText );
	if (
		this.refObj.rawData.keyword !== "" &&
		this.refObj.rawData.text !== ""
	) {
		var indexMatches = this.getIndexMatches();
		var periodMatches = this.getPeriodMatches();
		metaText = metaText.substring(
			0,
			YoastSEO.analyzerConfig.maxMeta
		);
		var curStart = 0;
		if ( indexMatches.length > 0 ) {
			for ( var j = 0; j < periodMatches.length; ) {
				if ( periodMatches[ 0 ] < indexMatches[ 0 ] ) {
					curStart = periodMatches.shift();
				} else {
					if ( curStart > 0 ) {
						curStart += 2;
					}
					break;
				}
			}
		}
	}
	if ( this.refObj.stringHelper.stripAllTags( metaText ) === "" ) {
		return this.refObj.config.sampleText.meta;
	}
	return metaText.substring( 0, YoastSEO.analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
YoastSEO.SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	//starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	//runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		//pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns array with sentences
 */
YoastSEO.SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.rawData.text.indexOf( ".", i ) ) > -1 ) {
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
YoastSEO.SnippetPreview.prototype.formatKeyword = function( textString ) {

	//matches case insensitive and global
	var replacer = new RegExp( "\\b" + this.refObj.rawData.keyword + "\\b", "ig" );
	return textString.replace( replacer, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 *
 * @param textString
 * @returns {XML|string|void}
 */
YoastSEO.SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var replacer = this.refObj.rawData.keyword.replace( " ", "[-_]" );

	//matches case insensitive and global
	replacer = new RegExp( replacer, "ig" );
	return textString.replace( replacer, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
YoastSEO.SnippetPreview.prototype.renderOutput = function() {
	document.getElementById( "snippet_title" ).innerHTML = this.output.title;
	document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
	document.getElementById( "snippet_citeBase" ).innerHTML = this.output.url;
	document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * function to call init, to rerender the snippetpreview
 */
YoastSEO.SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.disableEnter = function( ev ) {
	if ( ev.keyCode === 13 ) {
		ev.returnValue = false;
		ev.cancelBubble = true;
		ev.preventDefault();
	}
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.checkTextLength = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			ev.currentTarget.className = "desc";
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring(
					0,
					YoastSEO.analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			ev.currentTarget.className = "title";
			if ( text.length > 40 ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring( 0, 40 );

			}
			break;
		default:
			break;
	}
};

/**
 * when clicked on an element in the snippet, checks fills the textContent with the data from the unformatted text.
 * This removes the keyword highlighting and modified data so the original content can be editted.
 * @param ev {event}
 */
YoastSEO.SnippetPreview.prototype.getUnformattedText = function( ev ) {
	var currentElement = ev.currentTarget.id;
	if ( typeof YoastSEO.app.snippetPreview.unformattedText[ currentElement ] !== "undefined" ) {
		ev.currentTarget.textContent = YoastSEO.app.snippetPreview.unformattedText[currentElement];
	}
};

YoastSEO.SnippetPreview.prototype.setUnformattedElemText = function( elem ) {
	YoastSEO.app.snippetPreview.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * when text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.setUnformattedText = function( ev ) {
	ev.currentTarget.refObj.snippetPreview.setUnformattedElemText ( ev.currentTarget.id );

	//var currentElement = ev.currentTarget.id;
	//YoastSEO.app.snippetPreview.unformattedText[ currentElement ] =  ev.currentTarget.textContent;
};

/**
 * adds and remove the tooLong class when a text is too long.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.textFeedback = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				ev.currentTarget.className = "desc tooLong";
			} else {
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if ( text.length > 40 ) {
				ev.currentTarget.className = "title tooLong";
			} else {
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
YoastSEO.SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 */
YoastSEO.SnippetPreview.prototype.hideEditIcon = function() {
	var elems = document.getElementsByClassName( "editIcon " );
	for ( var i = 0; i < elems.length; i++ ) {
		elems[ i ].className = "snippet_container";
	}
};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.setFocus = function( ev ) {
	var targetElem = ev.currentTarget.firstChild;
	while ( targetElem !== null ) {
		if ( targetElem.contentEditable === "true" ) {
			targetElem.focus();
			targetElem.refObj.snippetPreview.hideEditIcon();
			break;
		} else {
			targetElem = targetElem.nextSibling;
		}
	}
};

