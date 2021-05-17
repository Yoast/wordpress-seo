/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder = require( "./element/imagePlaceholder" );
var bemAddModifier = require( "./helpers/bem/addModifier" );
var bemRemoveModifier = require( "./helpers/bem/removeModifier" );

var TextField = require( "./inputs/textInput" );
var TextArea = require( "./inputs/textarea" );

var InputElement = require( "./element/input" );
var PreviewEvents = require( "./preview/events" );

var twitterEditorTemplate = require( "./templates" ).twitterPreview;

var twitterDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: "",
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: "",
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function() {},
		modifyTitle: function( title ) {
			return title;
		},
		modifyDescription: function( description ) {
			return description;
		},
		modifyImageUrl: function( imageUrl ) {
			return imageUrl;
		},
	},
};

var inputTwitterPreviewBindings = [
	{
		preview: "editable-preview__title--twitter",
		inputField: "title",
	},
	{
		preview: "editable-preview__image--twitter",
		inputField: "imageUrl",
	},
	{
		preview: "editable-preview__description--twitter",
		inputField: "description",
	},
];

var WIDTH_TWITTER_IMAGE_SMALL = 120;
var WIDTH_TWITTER_IMAGE_LARGE = 506;
var TWITTER_IMAGE_THRESHOLD_WIDTH = 280;
var TWITTER_IMAGE_THRESHOLD_HEIGHT = 150;

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview.
 *
 * @param {Object}         opts                               - Snippet preview options.
 * @param {Object}         opts.placeholder                   - The placeholder values for the fields, will be shown as
 *                                                              actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title             - Placeholder for the title field.
 * @param {string}         opts.placeholder.description       - Placeholder for the description field.
 * @param {string}         opts.placeholder.imageUrl          - Placeholder for the image url field.
 *
 * @param {Object}         opts.defaultValue                  - The default value for the fields, if the user has not
 *                                                              changed a field, this value will be used for the analyzer,
 *                                                              preview and the progress bars.
 * @param {string}         opts.defaultValue.title            - Default title.
 * @param {string}         opts.defaultValue.description      - Default description.
 * @param {string}         opts.defaultValue.imageUrl         - Default image url.
 *
 * @param {string}         opts.baseURL                       - The basic URL as it will be displayed in twitter.
 * @param {HTMLElement}    opts.targetElement                 - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                     - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.updateSocialPreview - Function called when the social preview is updated.
 *
 * @param {Object}         i18n                               - The i18n object.
 *
 * @property {Object}      i18n                               - The translation object.
 *
 * @property {HTMLElement} targetElement                      - The target element that contains this snippet editor.
 *
 * @property {Object}      element                            - The elements for this snippet editor.
 * @property {Object}      element.rendered                   - The rendered elements.
 * @property {HTMLElement} element.rendered.title             - The rendered title element.
 * @property {HTMLElement} element.rendered.imageUrl          - The rendered url path element.
 * @property {HTMLElement} element.rendered.description       - The rendered twitter description element.
 *
 * @property {Object}      element.input                      - The input elements.
 * @property {HTMLElement} element.input.title                - The title input element.
 * @property {HTMLElement} element.input.imageUrl             - The url path input element.
 * @property {HTMLElement} element.input.description          - The meta description input element.
 *
 * @property {HTMLElement} element.container                  - The main container element.
 * @property {HTMLElement} element.formContainer              - The form container element.
 * @property {HTMLElement} element.editToggle                 - The button that toggles the editor form.
 *
 * @property {Object}      data                               - The data for this snippet editor.
 * @property {string}      data.title                         - The title.
 * @property {string}      data.imageUrl                      - The url path.
 * @property {string}      data.description                   - The meta description.
 *
 * @property {string}      baseURL                            - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var TwitterPreview = function( opts, i18n ) {
	this.i18n = i18n || this.constructI18n();

	twitterDefaults.placeholder = {
		title: this.i18n.dgettext( "yoast-social-previews", "This is an example title - edit by clicking here" ),
		description: this.i18n.sprintf(
			/** translators: %1$s expands to twitter */
			this.i18n.dgettext( "yoast-social-previews", "Modify your %1$s description by editing it right here" ),
			"twitter"
		),
		imageUrl: "",
	};

	defaultsDeep( opts, twitterDefaults );

	if ( ! isElement( opts.targetElement ) ) {
		throw new Error( "The twitter preview requires a valid target element" );
	}

	this.data = opts.data;
	this.i18n = i18n || this.constructI18n();
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Initializes i18n object based on passed configuration.
 *
 * @param {Object} translations - The values to translate.
 *
 * @returns {Jed} - The Jed translation object.
 */
TwitterPreview.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		domain: "yoast-social-previews",
		/* eslint-disable camelcase */
		locale_data: {
		/* eslint-enable camelcase */
			"yoast-social-previews": {
				"": {},
			},
		},
	};

	translations = translations || {};

	defaultsDeep( translations, defaultTranslations );

	return new Jed( translations );
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
TwitterPreview.prototype.init = function() {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = twitterEditorTemplate( {
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL,
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to twitter */
			edit: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "Edit %1$s preview" ), "twitter" ),
			/** translators: %1$s expands to twitter */
			snippetPreview: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s preview" ), "twitter" ),
			/** translators: %1$s expands to twitter */
			snippetEditor: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s editor" ), "twitter" ),
		},
	} );

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName( "editable-preview__value--twitter-title" )[ 0 ],
			description: targetElement.getElementsByClassName( "editable-preview__value--twitter-description" )[ 0 ],
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName( "editable-preview--twitter" )[ 0 ],
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[ 0 ],
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render() +
		this.element.fields.title.render() +
		this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
		imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[ 0 ],
		description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[ 0 ],
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ];

	this.element.caretHooks = {
		title: this.element.input.title.previousSibling,
		imageUrl: this.element.input.imageUrl.previousSibling,
		description: this.element.input.description.previousSibling,
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName( "editable-preview__image--twitter" )[ 0 ],
		description: this.element.rendered.description.parentNode,
	};
};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
TwitterPreview.prototype.getFields = function() {
	return {
		title: new TextField( {
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "twitter-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			title: this.i18n.sprintf(
				/** translators: %1$s expands to twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s title" ),
				"twitter"
			),
			labelClassName: "snippet-editor__label",
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "twitter-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.sprintf(
				/** translators: %1$s expands to twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s description" ),
				"twitter"
			),
			labelClassName: "snippet-editor__label",
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "twitter-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.sprintf(
				/** translators: %1$s expands to twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s image" ),
				"twitter"
			),
			labelClassName: "snippet-editor__label",
		} ),
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field element.
 */
TwitterPreview.prototype.getFieldElements = function() {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.sprintf(
					/** translators: %1$s expands to twitter */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s title by editing the snippet below." ),
					"twitter"
				),
			},
			this.updatePreview.bind( this )
		),
		 description: new InputElement(
			 targetElement.getElementsByClassName( "js-snippet-editor-description" )[ 0 ],
			 {
				 currentValue: this.data.description,
				 defaultValue: this.opts.defaultValue.description,
				 placeholder: this.opts.placeholder.description,
				 fallback: this.i18n.sprintf(
					 /** translators: %1$s expands to twitter */
					 this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s description by editing the snippet below." ),
					 "twitter"
				 ),
			 },
			 this.updatePreview.bind( this )
		 ),
		imageUrl: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[ 0 ],
			{
				currentValue: this.data.imageUrl,
				defaultValue: this.opts.defaultValue.imageUrl,
				placeholder: this.opts.placeholder.imageUrl,
				fallback: "",
			},
			this.updatePreview.bind( this )
		),
	};
};

/**
 * Updates the twitter preview.
 *
 * @returns {void}
 */
TwitterPreview.prototype.updatePreview = function() {
// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle( this.element.fieldElements.title.getValue() );

	// Set the description field and parse the styling of it.
	this.setDescription( this.element.fieldElements.description.getValue() );

	// Sets the Image URL
	this.setImage( this.data.imageUrl );

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview( clone( this.data ) );
};

/**
 * Sets the preview title.
 *
 * @param {string} title The new title.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setTitle = function( title ) {
	title = this.opts.callbacks.modifyTitle( title );

	this.element.rendered.title.innerHTML = title;
};

/**
 * Set the preview description.
 *
 * @param {string} description The description to set.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setDescription = function( description ) {
	description = this.opts.callbacks.modifyDescription( description );

	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Gets the image container.
 *
 * @returns {string} The container that will hold the image.
 */
TwitterPreview.prototype.getImageContainer = function() {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setImage = function( imageUrl ) {
	imageUrl = this.opts.callbacks.modifyImageUrl( imageUrl );

	if ( imageUrl === "" && this.data.imageUrl === "" ) {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();

		return;
	}

	var img = new Image();

	img.onload = function() {
		if ( this.isTooSmallImage( img ) ) {
			this.removeImageFromContainer();
			this.removeImageClasses();
			this.setPlaceHolder();

			return;
		}

		this.setSizingClass( img );
		this.addImageToContainer( imageUrl );
	}.bind( this );

	img.onerror = function() {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();
	}.bind( this );

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Sets the image of the image container.
 *
 * @param {string} image The image to use.
 *
 * @returns {void}
 */
TwitterPreview.prototype.addImageToContainer = function( image ) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 *
 * @returns {void}
 */
TwitterPreview.prototype.removeImageFromContainer = function() {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 *
 * @param {Image} img The image to base the sizing class on.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setSizingClass = function( img ) {
	this.removeImageClasses();

	if ( this.isSmallImage( img ) ) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width.
 *
 * @param {Image} img The image object to use.
 *
 * @returns {int} The calculated max width.
 */
TwitterPreview.prototype.getMaxImageWidth = function( img ) {
	if ( this.isSmallImage( img ) ) {
		return WIDTH_TWITTER_IMAGE_SMALL;
	}

	return WIDTH_TWITTER_IMAGE_LARGE;
};

/**
 * Sets the default twitter placeholder.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setPlaceHolder = function() {
	this.setSmallImageClasses();

	imagePlaceholder(
		this.element.preview.imageUrl,
		"",
		false,
		"twitter"
	);
};

/**
 * Detects if the twitter preview should switch to small image mode.
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
TwitterPreview.prototype.isSmallImage = function( image ) {
	return (
		image.width < TWITTER_IMAGE_THRESHOLD_WIDTH ||
		image.height < TWITTER_IMAGE_THRESHOLD_HEIGHT
	);
};

/**
 * Detects if the twitter preview image is too small.
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
TwitterPreview.prototype.isTooSmallImage = function( image ) {
	return (
		image.width < WIDTH_TWITTER_IMAGE_SMALL ||
		image.height < WIDTH_TWITTER_IMAGE_SMALL
	);
};

/**
 * Sets the classes on the facebook preview so that it will display a small facebook image preview.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "twitter-small", "social-preview__inner", targetElement );
	bemAddModifier( "twitter-small", "editable-preview__image--twitter", targetElement );
	bemAddModifier( "twitter-small", "editable-preview__text-keeper--twitter", targetElement );
};

TwitterPreview.prototype.removeSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "twitter-small", "social-preview__inner", targetElement );
	bemRemoveModifier( "twitter-small", "editable-preview__image--twitter", targetElement );
	bemRemoveModifier( "twitter-small", "editable-preview__text-keeper--twitter", targetElement );
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "twitter-large", "social-preview__inner", targetElement );
	bemAddModifier( "twitter-large", "editable-preview__image--twitter", targetElement );
	bemAddModifier( "twitter-large", "editable-preview__text-keeper--twitter", targetElement );
};

TwitterPreview.prototype.removeLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "twitter-large", "social-preview__inner", targetElement );
	bemRemoveModifier( "twitter-large", "editable-preview__image--twitter", targetElement );
	bemRemoveModifier( "twitter-large", "editable-preview__text-keeper--twitter", targetElement );
};

/**
 * Removes all image classes.
 *
 * @returns {void}
 */
TwitterPreview.prototype.removeImageClasses = function() {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
TwitterPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputTwitterPreviewBindings, this.element, true );
	previewEvents.bindEvents( this.element.editToggle, this.element.closeEditor );
};

module.exports = TwitterPreview;
