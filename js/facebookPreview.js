/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var imageRatio = require( "./helpers/imageRatio" );
var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder  = require( "./element/imagePlaceholder" );

var TextField = require( "./inputs/textInput" );
var TextArea = require( "./inputs/textarea" );
var Button = require( "./inputs/button.js" );

var FieldElement = require( "./element/input" );
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
		updateSocialPreview: function() {}
	}
};

var inputFacebookPreviewBindings = [
	{
		"preview": "editable-preview__title--facebook",
		"inputField": "title"
	},
	{
		"preview": "editable-preview__image--facebook",
		"inputField": "imageUrl"
	},
	{
		"preview": "editable-preview__description--facebook",
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
 * @param {Function}       opts.callbacks.updateSocialPreview - Function called when the social preview is updated.
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
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
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
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = facebookEditorTemplate( {
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "yoast-social-previews", "Edit Facebook preview" ),
			snippetPreview: this.i18n.dgettext( "yoast-social-previews", "Facebook preview" ),
			snippetEditor: this.i18n.dgettext( "yoast-social-previews", "Facebook editor" )
		}
	} );

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName( "editable-preview__value--facebook-title" )[0],
			description: targetElement.getElementsByClassName( "editable-preview__value--facebook-description" )[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName( "editable-preview--facebook" )[0],
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render()
	    + this.element.fields.title.render()
		+ this.element.fields.description.render()
		+ this.element.fields.button.render();

	this.element.input = {
		title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
		imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
		description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName( "snippet-editor__submit" )[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName( "editable-preview__image--facebook" )[0],
		description: this.element.rendered.description.parentNode
	};

};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
FacebookPreview.prototype.getFields = function() {
	return {
		title: new TextField( {
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "facebook-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook title" ),
			labelClassName: "snippet-editor__label"
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook description" ),
			labelClassName: "snippet-editor__label"
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook image" ),
			labelClassName: "snippet-editor__label"
		} ),
		button : new Button(
			{
				className : "snippet-editor__submit snippet-editor__button",
				value: this.i18n.dgettext( "yoast-social-previews", "Close facebook editor" )
			}
		)
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field elements.
 */
FacebookPreview.prototype.getFieldElements = function() {
	var targetElement = this.opts.targetElement;

	return {
		title: new FieldElement(
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.dgettext( "yoast-social-previews", "Please provide a Facebook title by editing the snippet below." )
			},
			this.updatePreview.bind( this )
		),
		description: new FieldElement(
			targetElement.getElementsByClassName( "js-snippet-editor-description" )[0],
			{
				currentValue: this.data.description,
				defaultValue: this.opts.defaultValue.description,
				placeholder: this.opts.placeholder.description,
				fallback: this.i18n.dgettext( "yoast-social-previews", "Please provide a Facebook by editing the snippet below." )
			},
			this.updatePreview.bind( this )
		),
		imageUrl: new FieldElement(
			targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
			{
				currentValue: this.data.imageUrl,
				defaultValue: this.opts.defaultValue.imageUrl,
				placeholder: this.opts.placeholder.imageUrl,
				fallback: ""
			},
			this.updatePreview.bind( this )
		)
	};
};


/**
 * Updates the twitter preview.
 */
FacebookPreview.prototype.updatePreview = function() {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle( this.element.fieldElements.title.getValue() );

	// Set the description field and parse the styling of it.
	this.setDescription( this.element.fieldElements.description.getValue() );

	// Sets the Image URL
	this.setImageUrl( this.data.imageUrl );

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview( clone( this.data ) );
};

/**
 * Sets the preview title.
 *
 * @param {string} title The title to set
 */
FacebookPreview.prototype.setTitle = function( title ) {
	this.element.rendered.title.innerHTML = title;
};

/**
 * Set the preview description.
 *
 * @param {string} description The description to set
 */
FacebookPreview.prototype.setDescription = function( description ) {
	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 */
FacebookPreview.prototype.setImageUrl = function( imageUrl ) {
	var imageContainer = this.element.preview.imageUrl;
	if ( imageUrl === '' && this.data.imageUrl === "" ) {
		imagePlaceholder( imageContainer,
			this.i18n.dgettext( "yoast-social-previews", "Please enter an image url by clicking here" ),
			false,
			"facebook"
		);

		return;
	}

	var img   = new Image();
	img.onload = function() {
		imageContainer.innerHTML = "<img src='" + imageUrl + "' />";

		imageRatio( imageContainer.childNodes[0], 470 );
	};

	img.onerror = imagePlaceholder.bind(
		null,
		imageContainer,
		this.i18n.dgettext( "yoast-social-previews", "The given image url cannot be loaded" ),
		true,
		"facebook"
	);

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputFacebookPreviewBindings, this.element );
	previewEvents.bindEvents( this.element.editToggle, this.element.closeEditor );
};

module.exports = FacebookPreview;
