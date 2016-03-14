/* jshint browser: true */

var isEmpty = require( "lodash/lang/isEmpty" );
var isElement = require( "lodash/lang/isElement" );
var isUndefined = require( "lodash/lang/isUndefined" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );
var forEach = require( "lodash/collection/forEach" );
var debounce = require( "lodash/function/debounce" );

var stringToRegex = require( "../js/stringProcessing/stringToRegex.js" );
var stripHTMLTags = require( "../js/stringProcessing/stripHTMLTags.js" );
var sanitizeString = require( "../js/stringProcessing/sanitizeString.js" );
var stripSpaces = require( "../js/stringProcessing/stripSpaces.js" );
var analyzerConfig = require( "./config/config.js" );

var snippetEditorTemplate = require( "./templates.js" ).snippetEditor;

var defaults = {
	data: {
		title: "",
		description: "",
		imageURL: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		description: "Modify your meta description by editing it right here"
	},
	defaultValue: {
		title: "",
		description: "",
		imageURL: ""
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	},
	addTrailingSlash: true
};

var titleMaxLength = 65;

var inputPreviewBindings = [
	{
		"preview": "title_container",
		"inputField": "title"
	},
	{
		"preview": "url_container",
		"inputField": "imageURL"
	},
	{
		"preview": "meta_container",
		"inputField": "description"
	}
];

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this FacebookPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this FacebookPreview
 *
 * @param {string} key The key to retrieve.
 */
function retrieveUnformattedText( key ) {
	return this.data[ key ];
}

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this FacebookPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 */
function updateUnformattedText( key, value ) {
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
function addClass( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
}

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
function removeClass( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
}

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 */
function removeClasses( element, classes ) {
	forEach( classes, removeClass.bind( null, element ) );
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url
 * @returns {boolean}
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean}
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return !isUndefined( progressElement.max );
}

/**
 * Returns a rating based on the length of the title
 *
 * @param {string} titleLength
 * @returns {string}
 */
function rateTitleLength( titleLength ) {
	var rating;

	switch ( true ) {
		case titleLength > 0 && titleLength <= 34:
		case titleLength >= 66:
			rating = "ok";
			break;

		case titleLength >= 35 && titleLength <= 65:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Returns a rating based on the length of the meta description
 *
 * @param {string} descriptionLength
 * @returns {string}
 */
function rateMetaDescLength( descriptionLength ) {
	var rating;

	switch ( true ) {
		case descriptionLength > 0 && descriptionLength <= 120:
		case descriptionLength >= 157:
			rating = "ok";
			break;

		case descriptionLength >= 120 && descriptionLength <= 157:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Updates a progress bar
 *
 * @private
 * @this FacebookPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good"
		];

	element.value = value;
	removeClasses( element, allClasses );
	addClass( element, "snippet-editor__progress--" + rating );

	if ( !this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title
 * @param {string}         opts.placeholder.description
 * @param {string}         opts.placeholder.imageURL
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title
 * @param {string}         opts.defaultValue.description
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.imageURL       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.description      - The rendered meta description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.imageURL          - The url path input element.
 * @property {HTMLElement} element.input.description         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.imageURL                   - The url path.
 * @property {string}      data.description                  - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var FacebookPreview = function(opts, i18n ) {
	defaultsDeep( opts, defaults );

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The facebook preview requires a valid target element" );
	}

	this.data = opts.data;
	this.i18n = i18n;
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Renders snippet editor and adds it to the targetElement
 */
FacebookPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.imageURL,
			meta: this.data.description
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			descriptionription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			snippetEditor: this.i18n.dgettext( "js-text-analysis", "Snippet editor" )
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			imageURL: document.getElementById( "snippet_cite" ),
			description: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			imageURL: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[0],
			description: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[0]
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[0],
			description: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[0]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageURL: this.element.input.imageURL.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageURL: this.element.rendered.imageURL.parentNode,
		description: this.element.rendered.description.parentNode
	};

	this.hasProgressSupport = hasProgressSupport();

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.description.max = analyzerConfig.maxMeta;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.opened = false;
	this.updateProgressBars();
};

/**
 * Refreshes the snippet editor rendered HTML
 */
FacebookPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this FacebookPreview
 *
 * @returns {string}
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	title = this.refObj.pluggable._applyModifications( "data_page_title", title );

	return stripSpaces( title );
}

/**
 * Returns the descriptionription, includes the date if it is set.
 *
 * @private
 * @this FacebookPreview
 *
 * @returns {string}
 */
var getAnalyzerMetaDesc = function() {
	var description = this.data.description;

	if ( isEmpty( description ) ) {
		description = this.opts.defaultValue.description;
	}

	description = this.refObj.pluggable._applyModifications( "data_meta_desc", description );

	return stripSpaces( description );
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object}
 */
FacebookPreview.prototype.getAnalyzerData = function() {
	return {
		title:    getAnalyzerTitle.call( this ),
		url:      this.data.imageURL,
		description: getAnalyzerMetaDesc.call( this )
	};
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
FacebookPreview.prototype.init = function() {
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
FacebookPreview.prototype.htmlOutput = function() {
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
FacebookPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	// Apply modification to the title before showing it.
	if ( this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	title = stripHTMLTags( title );

	// If a keyword is set we want to highlight it in the title.
	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		title = this.formatKeyword( title );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

	return title;
};

/**
 * Formates the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
FacebookPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
FacebookPreview.prototype.formatCite = function() {
	var cite = this.data.imageURL;

	cite = stripHTMLTags( cite );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.imageURL;
	}

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && !hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
FacebookPreview.prototype.formatMeta = function() {
	var meta = this.data.description;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// Apply modification to the desc before showing it.
	if ( this.refObj.pluggable.loaded ) {
		meta = this.refObj.pluggable._applyModifications( "data_meta_desc", meta );
	}

	meta = stripHTMLTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, analyzerConfig.maxMeta );

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( meta ) ) {
		meta = this.i18n.dgettext( "js-text-analysis", "Please provide a meta description by editing the snippet below." );
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
FacebookPreview.prototype.getMetaText = function() {
	var metaText;

	metaText = this.opts.defaultValue.description;

	if ( !isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( !isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	metaText = stripHTMLTags( metaText );
	if (
		this.refObj.rawData.keyword !== "" &&
		this.refObj.rawData.text !== ""
	) {
		var indexMatches = this.getIndexMatches();
		var periodMatches = this.getPeriodMatches();

		metaText = metaText.substring(
			0,
			analyzerConfig.maxMeta
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

	return metaText.substring( 0, analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
FacebookPreview.prototype.getIndexMatches = function() {
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
FacebookPreview.prototype.getPeriodMatches = function() {
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
FacebookPreview.prototype.formatKeyword = function(textString ) {

	// removes characters from the keyword that could break the regex, or give unwanted results
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, " " );

	// Match keyword case-insensitively
	var keywordRegex = stringToRegex( keyword, "", true );
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
FacebookPreview.prototype.formatKeywordUrl = function(textString ) {
	var keyword = sanitizeString( this.refObj.rawData.keyword );
	keyword = keyword.replace( /'/, "" );

	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
FacebookPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.imageURL.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.description.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 */
FacebookPreview.prototype.renderSnippetStyle = function() {
	var descriptionElement = this.element.rendered.description;
	var description = getAnalyzerMetaDesc.call( this );

	if ( isEmpty( description ) ) {
		addClass( descriptionElement, "desc-render" );
		removeClass( descriptionElement, "desc-default" );
	} else {
		addClass( descriptionElement, "desc-default" );
		removeClass( descriptionElement, "desc-render" );
	}
};

/**
 * function to call init, to rerender the snippetpreview
 */
FacebookPreview.prototype.reRender = function() {
	this.init();
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
FacebookPreview.prototype.checkTextLength = function(ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			ev.currentTarget.className = "desc";
			if ( text.length > analyzerConfig.maxMeta ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = ev.currentTarget.textContent;
				/* eslint-enable */
				ev.currentTarget.textContent = text.substring(
					0,
					analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			ev.currentTarget.className = "title";
			if ( text.length > titleMaxLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = ev.currentTarget.textContent;
				/* eslint-enable */
				ev.currentTarget.textContent = text.substring( 0, titleMaxLength );
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
FacebookPreview.prototype.getUnformattedText = function(ev ) {
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
FacebookPreview.prototype.setUnformattedText = function(ev ) {
	var elem =  ev.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Validates all fields and highlights errors.
 */
FacebookPreview.prototype.validateFields = function() {
	var descriptionription = getAnalyzerMetaDesc.call( this );
	var title = getAnalyzerTitle.call( this );

	if ( descriptionription.length > analyzerConfig.maxMeta ) {
		addClass( this.element.input.description, "snippet-editor__field--invalid" );
	} else {
		removeClass( this.element.input.description, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the data
 */
FacebookPreview.prototype.updateProgressBars = function() {
	var descriptionriptionRating, titleRating, descriptionription, title;

	descriptionription = getAnalyzerMetaDesc.call( this );
	title = getAnalyzerTitle.call( this );

	titleRating = rateTitleLength( title.length );
	descriptionriptionRating = rateMetaDescLength( descriptionription.length );

	updateProgressBar(
		this.element.progress.title,
		title.length,
		titleMaxLength,
		titleRating
	);

	updateProgressBar(
		this.element.progress.description,
		descriptionription.length,
		analyzerConfig.maxMeta,
		descriptionriptionRating
	);
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
FacebookPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ];

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[0];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( inputPreviewBindings, function( binding ) {
		var previewElement = document.getElementById( binding.preview );
		var inputElement = this.element.input[ binding.inputField ];

		// Make the preview element click open the editor and focus the correct input.
		previewElement.addEventListener( "click", function() {
			this.openEditor();
			inputElement.focus();
		}.bind( this ) );

		// Make focusing an input, update the carets.
		inputElement.addEventListener( "focus", function() {
			this._currentFocus = binding.inputField;

			this._updateFocusCarets();
		}.bind( this ) );

		// Make removing focus from an element, update the carets.
		inputElement.addEventListener( "blur", function() {
			this._currentFocus = null;

			this._updateFocusCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseover", function() {
			this._currentHover = binding.inputField;

			this._updateHoverCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseout", function() {
			this._currentHover = null;

			this._updateHoverCarets();
		}.bind( this ) );

	}.bind( this ) );
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 */
FacebookPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	this.refObj.refresh();
}, 25 );

/**
 * Updates our data object from the DOM
 */
FacebookPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.imageURL = this.element.input.imageURL.value;
	this.data.description = this.element.input.description.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 */
FacebookPreview.prototype.openEditor = function() {

	// Hide these elements.
	addClass( this.element.editToggle,       "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.formContainer, "snippet-editor--hidden" );
	removeClass( this.element.headingEditor, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 */
FacebookPreview.prototype.closeEditor = function() {

	// Hide these elements.
	addClass( this.element.formContainer,     "snippet-editor--hidden" );
	addClass( this.element.headingEditor,     "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.editToggle,     "snippet-editor--hidden" );

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 */
FacebookPreview.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 */
FacebookPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		addClass( focusedLabel, "snippet-editor__label--focus" );
		addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 */
FacebookPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/**
 * Updates the title data and the the title input field. This also means the snippet editor view is updated.
 *
 * @param {string} title
 */
FacebookPreview.prototype.setTitle = function(title ) {
	this.element.input.title.value = title;

	this.changedInput();
};

/**
 * Updates the url path data and the the url path input field. This also means the snippet editor view is updated.
 *
 * @param {string} imageURL
 */
FacebookPreview.prototype.setUrlPath = function(imageURL ) {
	this.element.input.imageURL.value = imageURL;

	this.changedInput();
};

/**
 * Updates the meta description data and the the meta description input field. This also means the snippet editor view is updated.
 *
 * @param {string} description
 */
FacebookPreview.prototype.setTitle = function(description ) {
	this.element.input.description.value = description;

	this.changedInput();
};

/* jshint ignore:start */
/* eslint-disable */

/**
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 *
 * @deprecated
 * @param {KeyboardEvent} ev
 */
FacebookPreview.prototype.disableEnter = function(ev ) {};

/**
 * Adds and remove the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev
 */
FacebookPreview.prototype.textFeedback = function(ev ) {};

/**
 * shows the edit icon corresponding to the hovered element
 *
 * @deprecated
 *
 * @param ev
 */
FacebookPreview.prototype.showEditIcon = function(ev ) {

};

/**
 * removes all editIcon-classes, sets to snippet_container
 *
 * @deprecated
 */
FacebookPreview.prototype.hideEditIcon = function() {};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 * @param ev
 */
FacebookPreview.prototype.setFocus = function(ev ) {};
/* jshint ignore:end */
/* eslint-disable */
module.exports = FacebookPreview;
