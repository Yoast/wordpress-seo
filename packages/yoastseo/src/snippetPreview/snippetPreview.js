import { isEmpty } from "lodash-es";
import { isElement } from "lodash-es";
import { isUndefined } from "lodash-es";
import { clone } from "lodash-es";
import { defaultsDeep } from "lodash-es";
import { forEach } from "lodash-es";
import { debounce } from "lodash-es";

import createWordRegex from "../languageProcessing/helpers/regex/createWordRegex";
import { stripFullTags as stripHTMLTags } from "../languageProcessing/helpers/sanitize/stripHTMLTags";
import stripSpaces from "../languageProcessing/helpers/sanitize/stripSpaces";
import replaceDiacritics from "../languageProcessing/helpers/transliterate/replaceDiacritics";
import transliterate from "../languageProcessing/helpers/transliterate/transliterate";

import templates from "./templates.js";
var snippetEditorTemplate = templates.snippetEditor;
var hiddenElement = templates.hiddenSpan;

import SnippetPreviewToggler from "./snippetPreviewToggler";
import domManipulation from "../helpers/domManipulation.js";

var defaults = {
	data: {
		title: "",
		metaDesc: "",
		urlPath: "",
		titleWidth: 0,
		metaHeight: 0,
	},
	placeholder: {
		title: "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath: "example-post/",
	},
	defaultValue: {
		title: "",
		metaDesc: "",
	},
	baseURL: "http://example.com/",
	callbacks: {
		/**
		 * Empty function.
		 * @returns {void}
		 */
		saveSnippetData: function() {},
	},
	addTrailingSlash: true,
	metaDescriptionDate: "",
	previewMode: "desktop",

};

var titleMaxLength = 600;
const maximumMetaDescriptionLength = 156;

var inputPreviewBindings = [
	{
		preview: "title_container",
		inputField: "title",
	},
	{
		preview: "url_container",
		inputField: "urlPath",
	},
	{
		preview: "meta_container",
		inputField: "metaDesc",
	},
];

/**
 * Get's the base URL for this instance of the Snippet Preview.
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
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( this.hasApp() && ! isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
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
 *
 * @returns {string} The unformatted text.
 */
function retrieveUnformattedText( key ) {
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
 *
 * @returns {void}
 */
function updateUnformattedText( key, value ) {
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url The url to check for a trailing slash.
 *
 * @returns {boolean} Whether or not the url contains a trailing slash.
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean} Whether or not the browser supports a <progress> element
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return ! isUndefined( progressElement.max );
}

/**
 * Returns a rating based on the length of the title
 *
 * @param {number} titleLength the length of the title.
 *
 * @returns {string} The rating given based on the title length.
 */
function rateTitleLength( titleLength ) {
	var rating;

	switch ( true ) {
		case titleLength > 0 && titleLength <= 399:
		case titleLength > 600:
			rating = "ok";
			break;

		case titleLength >= 400 && titleLength <= 600:
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
 * @param {number} metaDescLength the length of the meta description.
 *
 * @returns {string} The rating given based on the description length.
 */
function rateMetaDescLength( metaDescLength ) {
	var rating;

	switch ( true ) {
		case metaDescLength > 0 && metaDescLength < 120:
		case metaDescLength > maximumMetaDescriptionLength:
			rating = "ok";
			break;

		case metaDescLength >= 120 && metaDescLength <= maximumMetaDescriptionLength:
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
 * @this SnippetPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 *
 * @returns {void}
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good",
		];

	element.value = value;
	domManipulation.removeClasses( element, allClasses );
	domManipulation.addClass( element, "snippet-editor__progress--" + rating );

	if ( ! this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the Snippet Preview is part of.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - The placeholder title.
 * @param {string}         opts.placeholder.metaDesc      - The placeholder meta description.
 * @param {string}         opts.placeholder.urlPath       - The placeholder url.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - The default title.
 * @param {string}         opts.defaultValue.metaDesc     - The default meta description.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 * @param {string}         opts.metaDescriptionDate       - The date to display before the meta description.
 *
 * @param {Jed}            opts.i18n                      - The translation object.
 *
 * @param {string}         opts.previewMode               - The current preview mode.
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
 * @property {HTMLElement} element.measurers.titleWidth   - The rendered title width element.
 * @property {HTMLElement} element.measurers.metaHeight   - The rendered meta height element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 * @property {int}         data.titleWidth                - The width of the title in pixels.
 * @property {int}         data.metaHeight                - The height of the meta description in pixels.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {
	defaultsDeep( opts, defaults );

	this.data = opts.data;

	if ( ! isUndefined( opts.analyzerApp ) ) {
		this.refObj = opts.analyzerApp;
		this.i18n = this.refObj.i18n;

		this.data = {
			title: this.refObj.rawData.snippetTitle || "",
			urlPath: this.refObj.rawData.snippetCite || "",
			metaDesc: this.refObj.rawData.snippetMeta || "",
		};

		// For backwards compatibility set the metaTitle as placeholder.
		if ( ! isEmpty( this.refObj.rawData.metaTitle ) ) {
			opts.placeholder.title = this.refObj.rawData.metaTitle;
		}
	}

	if ( ! isUndefined( opts.i18n ) ) {
		this.i18n = opts.i18n;
	}

	if ( ! isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	this.opts = opts;
	this._currentFocus = null;
	this._currentHover = null;

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" ),
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" ),
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" ),
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 * @returns {void}
 */
SnippetPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc,
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta(),
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug: this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Google preview" ),
			titleLabel: this.i18n.dgettext( "js-text-analysis", "SEO title preview:" ),
			slugLabel: this.i18n.dgettext( "js-text-analysis", "Slug preview:" ),
			metaDescriptionLabel: this.i18n.dgettext( "js-text-analysis", "Meta description preview:" ),
			snippetPreviewDescription: this.i18n.dgettext(
				"js-text-analysis",
				"You can click on each element in the preview to jump to the Snippet Editor."
			),
			desktopPreviewMode: this.i18n.dgettext( "js-text-analysis", "Desktop preview" ),
			mobilePreviewMode: this.i18n.dgettext( "js-text-analysis", "Mobile preview" ),
			isScrollableHint: this.i18n.dgettext( "js-text-analysis", "Scroll to see the preview content." ),
		},
	} );

	this.element = {
		measurers: {
			metaHeight: null,
		},
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" ),
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[ 0 ],
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[ 0 ],
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		urlPath: this.element.input.urlPath.parentNode,
		metaDesc: this.element.input.metaDesc.parentNode,
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		urlPath: this.element.rendered.urlPath.parentNode,
		metaDesc: this.element.rendered.metaDesc.parentNode,
	};

	this.hasProgressSupport = hasProgressSupport();

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.metaDesc.max = maximumMetaDescriptionLength;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			domManipulation.addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.initPreviewToggler();
	this.setInitialView();

	this.opened = false;
	this.createMeasurementElements();
	this.updateProgressBars();
};

/**
 * Initializes the Snippet Preview Toggler.
 *
 * @returns {void}
 */
SnippetPreview.prototype.initPreviewToggler = function() {
	this.snippetPreviewToggle = new SnippetPreviewToggler(
		this.opts.previewMode, this.opts.targetElement.getElementsByClassName( "snippet-editor__view-icon" )
	);
	this.snippetPreviewToggle.initialize();
	this.snippetPreviewToggle.bindEvents();
};

/**
 * Refreshes the snippet editor rendered HTML
 * @returns {void}
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.measureTitle();
	this.measureMetaDescription();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The title that is meant for the analyzer.
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	if ( this.hasPluggable() ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	return stripSpaces( title );
}

/**
 * Returns the metaDescription, includes the date if it is set.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The meta data for the analyzer.
 */
var getAnalyzerMetaDesc = function() {
	var metaDesc = this.data.metaDesc;

	if ( isEmpty( metaDesc ) ) {
		metaDesc = this.opts.defaultValue.metaDesc;
	}

	if ( this.hasPluggable() ) {
		metaDesc = this.refObj.pluggable._applyModifications( "data_meta_desc", metaDesc );
	}

	if ( ! isEmpty( this.opts.metaDescriptionDate ) && ! isEmpty( metaDesc ) ) {
		metaDesc = this.opts.metaDescriptionDate + " - " + this.data.metaDesc;
	}

	return stripSpaces( metaDesc );
};

/**
 * Returns the data from the Snippet Preview.
 *
 * @returns {Object} The collected data for the analyzer.
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title: getAnalyzerTitle.call( this ),
		url: this.data.urlPath,
		metaDesc: getAnalyzerMetaDesc.call( this ),
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 *
 * @returns {void}
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	if ( this.hasApp() ) {
		this.refObj.callbacks.bindElementEvents( this.refObj );
	}
};

/**
 *  Checks if title and url are set so they can be rendered in the Snippet Preview.
 *
 *  @returns {void}
 */
SnippetPreview.prototype.init = function() {
	if (
		this.hasApp() &&
		this.refObj.rawData.metaTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * Creates html object to contain the strings for the Snippet Preview.
 *
 * @returns {Object} The HTML output of the collected data.
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
 * Formats the title for the Snippet Preview. If title and pageTitle are empty, sampletext is used.
 *
 * @returns {string} The correctly formatted title.
 */
SnippetPreview.prototype.formatTitle = function() {
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
	if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	title = stripHTMLTags( title );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

	return title;
};

/**
 * Formats the base url for the Snippet Preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the Snippet Preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the Snippet Preview.
 *
 * @returns {string} Formatted URL for the Snippet Preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	cite = replaceDiacritics( stripHTMLTags( cite ) );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.urlPath;
	}

	if ( this.hasApp() && ! isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && ! hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );
	// Strip out question mark and hash characters from the raw URL.
	cite = cite.replace( /\?|#/g, "" );

	return cite;
};

/**
 * Formats the meta description for the Snippet Preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// Apply modification to the desc before showing it.
	if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
		meta = this.refObj.pluggable._applyModifications( "data_meta_desc", meta );
	}

	meta = stripHTMLTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, maximumMetaDescriptionLength );

	if ( this.hasApp() && ! isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( meta ) ) {
		meta = this.i18n.dgettext( "js-text-analysis", "Please provide a meta description by editing the snippet below." );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt.
 * It uses the keyword to select an appropriate part of the text. If the keyword isn't present it takes the maximum
 * meta description length of the text. If both the keyword, text and excerpt are empty this function returns the
 * sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText = this.opts.defaultValue.metaDesc;

	if ( this.hasApp() && ! isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( this.hasApp() && ! isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	metaText = stripHTMLTags( metaText );

	return metaText.substring( 0, maximumMetaDescriptionLength );
};

/**
 * Builds an array with all indexes of the keyword.
 *
 * @returns {Array} Array with matches
 */
SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	// Starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	// Runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		// Pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .).
 *
 * @returns {Array} Array with sentences.
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
 * Formats the keyword for use in the snippetPreview by adding <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results.
 *
 * @param {string} textString The keyword string that needs to be formatted.
 *
 * @returns {string} The formatted keyword.
 */
SnippetPreview.prototype.formatKeyword = function( textString ) {
	// Removes characters from the keyword that could break the regex, or give unwanted results.
	var keyword = this.refObj.rawData.keyword;

	// Match keyword case-insensitively.
	var keywordRegex = createWordRegex( keyword, "", false );

	textString = textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );

	// Transliterate the keyword for highlighting
	var transliterateKeyword = transliterate( keyword, this.refObj.rawData.locale );
	if ( transliterateKeyword !== keyword ) {
		keywordRegex = createWordRegex( transliterateKeyword, "", false );
		textString = textString.replace( keywordRegex, function( str ) {
			return "<strong>" + str + "</strong>";
		} );
	}
	return textString;
};

/**
 * Formats the keyword for use in the URL by accepting - and _ instead of spaces and by adding <strong>-tags.
 * Strips unwanted characters that could break the regex or give unwanted results.
 *
 * @param {string} textString The keyword string that needs to be formatted.
 *
 * @returns {XML|string|void} The formatted keyword string to be used in the URL.
 */
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = this.refObj.rawData.keyword;
	keyword = transliterate( keyword, this.refObj.rawData.locale );
	keyword = keyword.replace( /'/, "" );

	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = createWordRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 *
 * @returns {void}
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 *
 * @returns {void}
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var metaDescElement = this.element.rendered.metaDesc;
	var metaDesc = getAnalyzerMetaDesc.call( this );

	if ( isEmpty( metaDesc ) ) {
		domManipulation.addClass( metaDescElement, "desc-render" );
		domManipulation.removeClass( metaDescElement, "desc-default" );
	} else {
		domManipulation.addClass( metaDescElement, "desc-default" );
		domManipulation.removeClass( metaDescElement, "desc-render" );
	}
};

/**
 * Function to call init, to rerender the Snippet Preview.
 *
 * @returns {void}
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * Checks text length of the snippetmeta and snippet title, shortens it if it is too long.
 * @param {Object} event The event to check the text length from.
 *
 * @returns {void}
 */
SnippetPreview.prototype.checkTextLength = function( event ) {
	var text = event.currentTarget.textContent;
	switch ( event.currentTarget.id ) {
		case "snippet_meta":
			event.currentTarget.className = "desc";
			if ( text.length > maximumMetaDescriptionLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring(
					0,
					maximumMetaDescriptionLength
				);
			}
			break;
		case "snippet_title":
			event.currentTarget.className = "title";
			if ( text.length > titleMaxLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring( 0, titleMaxLength );
			}
			break;
		default:
			break;
	}
};

/**
 * Get the unformatted text.
 *
 * When clicking on an element in the Snippet Preview, this checks and fills the textContent with the data from the
 * unformatted text. This removes the keyword highlighting and modified data so the original content can be editted.
 *
 * @param {Object} event The event to get the unformatted text from.
 *
 * @returns {void}
 */
SnippetPreview.prototype.getUnformattedText = function( event ) {
	var currentElement = event.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		event.currentTarget.textContent = this.unformattedText[ currentElement ];
	}
};

/**
 * Sets the unformatted text.
 *
 * When text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 *
 * @param {Object} event The event to set the unformatted text from.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setUnformattedText = function( event ) {
	var elem =  event.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Validates all fields and highlights errors.
 *
 * @returns {void}
 */
SnippetPreview.prototype.validateFields = function() {
	var metaDescription = getAnalyzerMetaDesc.call( this );
	var title = getAnalyzerTitle.call( this );

	if ( metaDescription.length > maximumMetaDescriptionLength ) {
		domManipulation.addClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		domManipulation.addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the available data.
 *
 * @returns {void}
 */
SnippetPreview.prototype.updateProgressBars = function() {
	var metaDescriptionRating, titleRating, metaDescription;

	metaDescription = getAnalyzerMetaDesc.call( this );

	titleRating = rateTitleLength( this.data.titleWidth );
	metaDescriptionRating = rateMetaDescLength( metaDescription.length );

	updateProgressBar.call(
		this,
		this.element.progress.title,
		this.data.titleWidth,
		titleMaxLength,
		titleRating
	);

	updateProgressBar.call(
		this,
		this.element.progress.metaDesc,
		metaDescription.length,
		maximumMetaDescriptionLength,
		metaDescriptionRating
	);
};

/**
 * Gets the width of the Snippet Preview to set its initial view to desktop or mobile.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setInitialView = function() {
	var previewWidth = document.getElementById( "snippet_preview" ).getBoundingClientRect().width;
	this.snippetPreviewToggle.setVisibility( previewWidth );
};

/**
 * When the window is resized, gets the width of the Snippet Preview to set the Scroll Hint visibility.
 *
 * @returns {void}
 */
SnippetPreview.prototype.handleWindowResizing = debounce( function() {
	var previewWidth = document.getElementById( "snippet_preview" ).getBoundingClientRect().width;
	this.snippetPreviewToggle.setScrollHintVisibility( previewWidth );
}, 25 );

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ];

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[ 0 ];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

	// Note: `handleWindowResizing` is called also in Yoast SEO when the WP admin menu state changes.
	window.addEventListener( "resize", this.handleWindowResizing.bind( this ) );

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
 * Updates Snippet Preview on changed input. It's debounced so that we can call this function as much as we want.
 *
 * @returns {void}
 */
SnippetPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	if ( this.hasApp() ) {
		this.refObj.refresh();
	}
}, 25 );

/**
 * Updates our data object from the DOM.
 *
 * @returns {void}
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 *
 * @returns {void}
 */
SnippetPreview.prototype.openEditor = function() {
	this.element.editToggle.setAttribute( "aria-expanded", "true" );

	// Show these elements.
	domManipulation.removeClass( this.element.formContainer, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 *
 * @returns {void}
 */
SnippetPreview.prototype.closeEditor = function() {
	// Hide these elements.
	domManipulation.addClass( this.element.formContainer, "snippet-editor--hidden" );

	this.element.editToggle.setAttribute( "aria-expanded", "false" );
	this.element.editToggle.focus();

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 *
 * @returns {void}
 */
SnippetPreview.prototype.toggleEditor = function() {
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
 *
 * @returns {void}
 */
SnippetPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		domManipulation.addClass( focusedLabel, "snippet-editor__label--focus" );
		domManipulation.addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 *
 * @returns {void}
 */
SnippetPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		domManipulation.addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/**
 * Updates the title data and the title input field. This also means the snippet editor view is updated.
 *
 * @param {string} title The title to use in the input field.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setTitle = function( title ) {
	this.element.input.title.value = title;

	this.changedInput();
};

/**
 * Updates the url path data and the url path input field. This also means the snippet editor view is updated.
 *
 * @param {string} urlPath the URL path to use in the input field.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setUrlPath = function( urlPath ) {
	this.element.input.urlPath.value = urlPath;

	this.changedInput();
};

/**
 * Updates the meta description data and the meta description input field. This also means the snippet editor view is updated.
 *
 * @param {string} metaDesc the meta description to use in the input field.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setMetaDescription = function( metaDesc ) {
	this.element.input.metaDesc.value = metaDesc;

	this.changedInput();
};

/**
 * Creates elements with the purpose to calculate the sizes of elements and puts these elements to the body.
 *
 * @returns {void}
 */
SnippetPreview.prototype.createMeasurementElements = function() {
	var metaDescriptionElement, spanHolder;
	metaDescriptionElement = hiddenElement(
		{
			width: document.getElementById( "meta_container" ).offsetWidth + "px",
			whiteSpace: "",
		}
	);

	spanHolder = document.createElement( "div" );
	spanHolder.className = "yoast-measurement-elements-holder";

	spanHolder.innerHTML = metaDescriptionElement;

	document.body.appendChild( spanHolder );

	this.element.measurers.metaHeight = spanHolder.childNodes[ 0 ];
};

/**
 * Copies the title text to the title measure element to calculate the width in pixels.
 *
 * @returns {void}
 */
SnippetPreview.prototype.measureTitle = function() {
	if ( this.element.rendered.title.offsetWidth !== 0 || this.element.rendered.title.textContent === "" ) {
		this.data.titleWidth = this.element.rendered.title.offsetWidth;
	}
};

/**
 * Copies the metadescription text to the metadescription measure element to calculate the height in pixels.
 *
 * @returns {void}
 */
SnippetPreview.prototype.measureMetaDescription = function() {
	var metaHeightElement = this.element.measurers.metaHeight;

	metaHeightElement.innerHTML = this.element.rendered.metaDesc.innerHTML;

	this.data.metaHeight = metaHeightElement.offsetHeight;
};

/**
 * Returns the width of the title in pixels.
 *
 * @returns {Number} The width of the title in pixels.
 */
SnippetPreview.prototype.getTitleWidth = function() {
	return this.data.titleWidth;
};

/**
 * Allows to manually set the title width.
 *
 * This may be useful in setups where the title field will not always be rendered.
 *
 * @param {Number} titleWidth The width of the title in pixels.
 *
 * @returns {void}
 */
SnippetPreview.prototype.setTitleWidth = function( titleWidth ) {
	this.data.titleWidth = titleWidth;
};

/**
 * Returns whether or not an app object is present.
 *
 * @returns {boolean} Whether or not there is an App object present.
 */
SnippetPreview.prototype.hasApp = function() {
	return ! isUndefined( this.refObj );
};

/**
 * Returns whether or not a pluggable object is present.
 *
 * @returns {boolean} Whether or not there is a Pluggable object present.
 */
SnippetPreview.prototype.hasPluggable = function() {
	return ! isUndefined( this.refObj ) && ! isUndefined( this.refObj.pluggable );
};

/* eslint-disable */

/**
 * Disables Enter as input.
 *
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent other elements from capturing this event.
 *
 * @deprecated
 *
 * @param {KeyboardEvent} ev The keyboard event.
 */
SnippetPreview.prototype.disableEnter = function( ev ) {};

/**
 * Adds and removes the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev The event.
 */
SnippetPreview.prototype.textFeedback = function( ev ) {};

/**
 * Shows the edit icon corresponding to the hovered element.
 *
 * @deprecated
 *
 * @param ev The event.
 */
SnippetPreview.prototype.showEditIcon = function( ev ) {

};

/**
 * Removes all editIcon-classes, sets to snippet_container.
 *
 * @deprecated
 */
SnippetPreview.prototype.hideEditIcon = function() {};

/**
 * Sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 *
 * @param ev The event.
 */
SnippetPreview.prototype.setFocus = function( ev ) {};

/* eslint-disable */
export default SnippetPreview;
