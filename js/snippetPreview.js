/* jshint browser: true */
/* global YoastSEO: false */

var _ = {
	isObject: require( "lodash/lang/isObject" ),
	isEmpty: require( "lodash/lang/isEmpty" ),
	isElement: require( "lodash/lang/isElement" ),
	clone: require( "lodash/lang/clone" ),
	cloneDeep: require( "lodash/lang/cloneDeep" ),
	defaultsDeep: require( "lodash/object/defaultsDeep" )
};

var defaults = {
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	}
};

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL. But the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !_.isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The key to retrieve.
 */
function retrieveUnformattedText( key ) {
	console.log( key, this, arguments );
	return this.data[ key ];
}

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 */
function updateUnformattedText( key, value ) {
	console.log( key, value, this, arguments );
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * @module snippetPreview
 */

/**
 * defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The fallback values for the snippet preview rendering.
 * @param {string}         opts.placeholder.title         - The fallback value for the title.
 * @param {string}         opts.placeholder.metaDesc      - The fallback value for the meta description.
 * @param {string}         opts.placeholder.urlPath       - The fallback value for the URL path.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc      - The rendered meta description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {

	// Accept an App object for backwards compatibility
	if ( _.isObject( opts ) && opts instanceof YoastSEO.App ) {
		opts = {
			analyzerApp: opts
		};
	}

	// base URL

	// Placeholder title
	// Placeholder slug
	// Placeholder meta description

	_.defaultsDeep( opts, defaults );

	this.refObj = opts.analyzerApp;
	this.i18n = this.refObj.i18n;
	this.opts = opts;

	if ( !_.isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	//this.unformattedText = {
	//	snippet_cite: this.refObj.rawData.snippetCite || "",
	//	snippet_meta: this.refObj.rawData.snippetMeta || "",
	//	snippet_title: this.refObj.rawData.snippetTitle || ""
	//};

	this.data = {
		title: this.refObj.rawData.snippetTitle || "",
		urlPath: this.refObj.rawData.snippetCite || "",
		metaDesc: this.refObj.rawData.snippetMeta || ""
	};

	// For backwards compatibility use the pageTitle if the title is empty at this point.
	if ( !_.isEmpty( this.refObj.rawData.pageTitle ) && _.isEmpty( this.data.title ) ) {
		this.data.title = this.refObj.rawData.pageTitle;
	}

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" )
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 */
SnippetPreview.prototype.renderTemplate = function() {
	var snippetEditorTemplate = require( "../js/templates.js" ).snippetEditor;
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit meta fields (title, url, description)" ),
			title: this.i18n.dgettext( "js-text-analysis", "Meta title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" )
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[0],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[0]
		}
	};
};

/**
 * Refreshes the snippet editor rendered HTML
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object}
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    this.data.title,
		url:      getBaseURL.call( this ) + this.data.urlPath,
		metaDesc: this.data.metaDesc
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	this.refObj.callbacks.bindElementEvents( this.refObj );
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.pageTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object}
 */
SnippetPreview.prototype.htmlOutput = function() {
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
 * @returns {string}
 */
SnippetPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( _.isEmpty( title ) ) {
		title = this.refObj.config.sampleText.title;
	}

	// TODO: Replace this with the stripAllTags module.
	title = this.refObj.stringHelper.stripAllTags( title );

	// Apply modification to the title before showing it.
	if ( this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	// If a keyword is set we want to highlight it in the title.
	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
		return this.formatKeyword( title );
	}

	return title;
};

/**
 * Formates the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	// TODO: Replace this with the stripAllTags module.
	cite = this.refObj.stringHelper.stripAllTags( cite );

	// Fallback to the default if the cite is empty.
	if ( _.isEmpty( cite ) ) {
		cite = this.refObj.config.sampleText.snippetCite;
	}

	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( _.isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// TODO: Replace this with the stripAllTags module.
	meta = this.refObj.stringHelper.stripAllTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );

	if ( !_.isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt. It uses the keyword to
 * select an appropriate part of the text. If the keyword isn't present it takes the first 156 characters of the text.
 * If both the keyword, text and excerpt are empty this function returns the sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText;
	if ( typeof this.refObj.rawData.excerpt !== "undefined" ) {
		metaText = this.refObj.rawData.excerpt;
	}
	if ( typeof this.refObj.rawData.text !== "undefined" ) {
		metaText = this.refObj.rawData.text;
	}
	if ( _.isEmpty( metaText ) ) {
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
SnippetPreview.prototype.getIndexMatches = function() {
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
SnippetPreview.prototype.getPeriodMatches = function() {
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
 * strips unwanted characters that could break the regex or give unwanted results
 *
 * @param {string} textString
 * @returns {string}
 */
SnippetPreview.prototype.formatKeyword = function( textString ) {

	// removes characters from the keyword that could break the regex, or give unwanted results
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, " " );

	// Match keyword case-insensitively
	var keywordRegex = YoastSEO.getStringHelper().getWordBoundaryRegex( keyword );
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results
 *
 * @param textString
 * @returns {XML|string|void}
 */
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = this.refObj.stringHelper.sanitizeKeyword( this.refObj.rawData.keyword );
	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = YoastSEO.getStringHelper().getWordBoundaryRegex( dashedKeyword );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Sets the classname of the meta field in the snippet, based on the rawData.snippetMeta
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var cssClass = "desc-default";
	if ( this.refObj.rawData.meta === "" ) {
		cssClass = "desc-render";
	}
	document.getElementById( "snippet_meta" ).className = "desc " + cssClass;
};

/**
 * function to call init, to rerender the snippetpreview
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
SnippetPreview.prototype.disableEnter = function( ev ) {
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
SnippetPreview.prototype.checkTextLength = function( ev ) {
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
			if ( text.length > 70 ) {
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring( 0, 70 );
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
SnippetPreview.prototype.getUnformattedText = function( ev ) {
	var currentElement = ev.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		ev.currentTarget.textContent = this.unformattedText[currentElement];
	}
};

/**
 * when text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param ev
 */
SnippetPreview.prototype.setUnformattedText = function( ev ) {
	var elem =  ev.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Adds and remove the tooLong class when a text is too long.
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {
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
			if ( text.length > 70 ) {
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
SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 */
SnippetPreview.prototype.hideEditIcon = function() {
	var elems = document.getElementsByClassName( "editIcon " );
	for ( var i = 0; i < elems.length; i++ ) {
		elems[ i ].className = "snippet_container";
	}
};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {
	var targetElem = ev.currentTarget.firstChild;
	while ( targetElem !== null ) {
		if ( targetElem.contentEditable === "true" ) {
			targetElem.focus();
			this.hideEditIcon();
			break;
		} else {
			targetElem = targetElem.nextSibling;
		}
	}
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement, saveForm, editButton,
		elems = [ "title", "slug", "meta-description" ];

	for ( var i = 0; i < elems.length; i++ ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elems[ i ] );
		targetElement = targetElement[0];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "keydown", this.disableEnter.bind( this ) );
	}

	editButton = document.getElementsByClassName( "js-snippet-editor-edit" );
	saveForm = document.getElementsByClassName( "js-snippet-editor-save" );

	editButton[0].addEventListener( "click", this.editSnippet.bind( this ) );
	saveForm[0].addEventListener( "click", this.saveSnippet.bind( this ) );
};

SnippetPreview.prototype.changedInput = function() {
	this.updateDataFromDOM();

	this.refresh();

	this.refObj.refresh.call( this.refObj );
};

/**
 * Updates our data object from the DOM
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( _.clone( this.data ) );
};

/**
 * Edits the snippet
 */
SnippetPreview.prototype.editSnippet = function() {
	var form, formFields, snippetEditor;

	snippetEditor = document.getElementById( "snippet_preview" );
	formFields = document.getElementsByClassName( "snippet-editor__form-field" );

	snippetEditor.className = "editing";

	[].forEach.call( formFields, function( formField ) {
		formField.className = "snippet-editor__form-field snippet-editor__form-field--shown";
	} );

	form = document.getElementsByClassName( "snippet-editor__form" );
	form[0].className = "snippet-editor__form snippet-editor__form--shown";
};

/**
 * Saves the snippet fields
 */
SnippetPreview.prototype.saveSnippet = function() {
	var form = document.getElementsByClassName( "snippet-editor__form" );

	form[0].className = "snippet-editor__form";
};

module.exports = SnippetPreview;
