/* jshint browser: true */

var isEmpty = require( "lodash/lang/isEmpty" );
var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );
var debounce = require( "lodash/function/debounce" );

var Jed = require( "jed" );

var stripHTMLTags = require( "yoastseo/js/stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "yoastseo/js/stringProcessing/stripSpaces.js" );

var addClass = require( "./helpers/addClass.js" );
var removeClass = require( "./helpers/removeClass.js" );
var imageRatio = require( "./helpers/imageRatio" );
var renderDescription = require( "./helpers/renderDescription" );

var TextField = require( "./fields/textFieldFactory" );
var TextArea = require( "./fields/textAreaFactory" );
var Button = require( "./fields/button.js" );

var PreviewEvents = require( "./preview/events" );

var facebookEditorTemplate = require( "./templates.js" ).facebookPreview;

var facebookDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		description: "Modify your facebook description by editing it right here",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		saveSnippetData: function() {}
	}
};

var inputFacebookPreviewBindings = [
	{
		"preview": "facebook_title_container",
		"inputField": "title"
	},
	{
		"preview": "facebook_image_container",
		"inputField": "imageUrl"
	},
	{
		"preview": "facebook_description_container",
		"inputField": "description"
	}
];

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - Placeholder for the title field.
 * @param {string}         opts.placeholder.description   - Placeholder for the description field.
 * @param {string}         opts.placeholder.imageUrl      - Placeholder for the image url field.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - Default title.
 * @param {string}         opts.defaultValue.description  - Default description.
 * @param {string}         opts.defaultValue.imageUrl     - Default image url.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in facebook.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {Object}         i18n                           - The i18n object.
 *
 * @property {Object}      i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.imageUrl      - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.description   - The rendered facebook description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.imageUrl         - The url path input element.
 * @property {HTMLElement} element.input.description      - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.imageUrl                  - The url path.
 * @property {string}      data.description               - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var FacebookPreview = function( opts, i18n ) {
	defaultsDeep( opts, facebookDefaults );

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The facebook preview requires a valid target element" );
	}

	this.data = opts.data;
	this.i18n = i18n || this.constructI18n();
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations - The values to translate.
 *
 * @returns {Jed} - The Jed translation object.
 */
FacebookPreview.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};

	// Use default object to prevent Jed from erroring out.
	translations = translations || defaultTranslations;

	return new Jed( translations );
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
FacebookPreview.prototype.init = function() {
	this.renderTemplate();
	this.bindEvents();

	// Sets the image ratio.
	this.setImageRatio( this.element.rendered.imageUrl );

	// Renders the snippet style.
	renderDescription( this.element.rendered.description, this.getDescription() );
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = facebookEditorTemplate( {
		raw: {
			title: this.data.title,
			imageUrl: this.data.imageUrl,
			description: this.data.description
		},
		rendered: {
			title: this.formatTitle(),
			description: this.formatDescription(),
			imageUrl: this.formatImageUrl(),
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit Facebook preview" ),
			title: this.i18n.dgettext( "js-text-analysis", "Facebook title" ),
			imageUrl:  this.i18n.dgettext( "js-text-analysis", "Facebook image URL" ),
			description: this.i18n.dgettext( "js-text-analysis", "Facebook description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close facebook editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Facebook preview" ),
			snippetEditor: this.i18n.dgettext( "js-text-analysis", "Facebook editor" )
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "facebook_title" ),
			urlBase: document.getElementById( "facebook_base_url" ),
			imageUrl: document.getElementById( "facebook_image" ),
			description: document.getElementById( "facebook_description" )
		},
		fields: {
			title: new TextField( {
				className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
				id: "facebook-editor-title",
				value: this.data.title,
				placeholder: this.opts.placeholder.title,
				title: this.i18n.dgettext( "js-text-analysis", "Facebook title" ),
				labelClassName: "snippet-editor__label"
			} ),
			description: new TextArea( {
				className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
				id: "facebook-editor-description",
				value: this.data.description,
				placeholder: this.opts.placeholder.description,
				title: this.i18n.dgettext( "js-text-analysis", "Facebook description" ),
				labelClassName: "snippet-editor__label"
			} ),
			imageUrl: new TextField( {
				className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
				id: "facebook-editor-imageUrl",
				value: this.data.imageUrl,
				placeholder: this.opts.placeholder.imageUrl,
				title: this.i18n.dgettext( "js-text-analysis", "Facebook image URL" ),
				labelClassName: "snippet-editor__label"
			} ),
			button : new Button(
				{
					className : "snippet-editor__submit snippet-editor__button",
					value: this.i18n.dgettext( "js-text-analysis", "Close facebook editor" )
				}
			)
		},
		container: document.getElementById( "twitter_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.title.render()
		+ this.element.fields.description.render()
		+ this.element.fields.imageUrl.render()
		+ this.element.fields.button.render();

	this.element.input = {
		title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
		imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
		description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[0]
	};

	this.element.closeEditor = targetElement.getElementsByClassName( "snippet-editor__submit" )[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: this.element.rendered.imageUrl.parentNode,
		description: this.element.rendered.description.parentNode
	};

};

/**
 * Creates html object to contain the strings for the Facebook preview
 *
 * @returns {Object} The formatted output
 */
FacebookPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.description = this.formatDescription();
	html.imageUrl = this.formatImageUrl();

	return html;
};

/**
 * Formats the title for the Facebook preview. If title is empty, sampletext is used
 *
 * @returns {string} The formatted title, without html tags.
 */
FacebookPreview.prototype.formatTitle = function() {
	var title = this.getTitle();

	title = stripHTMLTags( title );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide a Facebook title by editing the snippet below." );
	}

	return title;
};

/**
 * Gets the title for the preview.
 *
 * @returns {string} Returns the title, or a fallback title
 */
FacebookPreview.prototype.getTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	return title;
};
/**
 * Formats the description for the facebook preview..
 *
 * @returns {string} Formatted description.
 */
FacebookPreview.prototype.formatDescription = function() {
	var description = this.getDescription();

	description = stripHTMLTags( description );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( description ) ) {
		description = this.i18n.dgettext( "js-text-analysis", "Please provide a description by editing the snippet below." );
	}

	return description;
};

/**
 * Returns the description.
 *
 * @returns {string} Returns description or a fallback description.
 */
FacebookPreview.prototype.getDescription = function() {
	var description = this.data.description;

	if ( isEmpty( description ) ) {
		description = this.opts.defaultValue.description;
	}

	return stripSpaces( description );
};

/**
 * Formats the imageUrl for the facebook preview
 *
 * @returns {string} Formatted URL for the facebook preview.
 */
FacebookPreview.prototype.formatImageUrl = function() {
	var imageUrl = this.getImageUrl();

	imageUrl = stripHTMLTags( imageUrl );

	return imageUrl;
};

/**
 * Gets the imageUrl
 *
 * @returns {string} Returns the image URL
 */
FacebookPreview.prototype.getImageUrl = function() {
	var imageUrl = this.data.imageUrl;

	// Fallback to the default if the imageUrl is empty.
	if ( isEmpty( imageUrl ) ) {
		imageUrl = this.opts.placeholder.imageUrl;
	}

	return imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {Object} image    Image element.
 * @param {string} imageUrl The image path.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setImageUrl = function( image, imageUrl ) {

	var img = new Image();
	img.onload = function() {
		image.src = imageUrl;

		this.setImageRatio( image );

		// Show the image, because it's done.
		removeClass( image, "snippet-editor--hidden" );
	}.bind( this );

	img.onerror = function() {
		addClass( image, "snippet-editor--hidden" );
	};

	img.src = imageUrl;
};


/**
 * Sets the image dimensions by ratio
 *
 * @param {Object} image The image object to calculate the ratio for.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setImageRatio = function( image ) {
	imageRatio( image, 470 );
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputFacebookPreviewBindings, this.element );
	var elems = [ "title", "description", "imageUrl" ];

	previewEvents.bindFormEvents( this.opts.targetElement, elems, this.changedInput.bind( this ) );
	previewEvents.bindEvents();
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 *
 * @returns {void}
 */
FacebookPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.refresh();
}, 25 );

/**
 * Updates our data object from the DOM
 *
 * @returns {void}
 */
FacebookPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.imageUrl = this.element.input.imageUrl.value;
	this.data.description = this.element.input.description.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Refreshes the snippet editor rendered HTML
 *
 * @returns {void}
 */
FacebookPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();

	renderDescription( this.element.rendered.description, this.getDescription() );
};

/**
 * Renders the outputs to the elements on the page.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;

	if ( typeof this.output.imageUrl !== "undefined" ) {
		this.setImageUrl( this.element.rendered.imageUrl, this.output.imageUrl );
	}

	this.element.rendered.description.innerHTML = this.output.description;
};

module.exports = FacebookPreview;
