(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var getL10nObject = require("./getL10nObject");

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string} The description placeholder.
 */
function getDescriptionPlaceholder() {
	var descriptionPlaceholder = "";
	var l10nObject = getL10nObject();

	if (l10nObject) {
		descriptionPlaceholder = l10nObject.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;

},{"./getL10nObject":2}],2:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object} The l10n object for the current page.
 */
function getL10nObject() {
	var l10nObject = null;

	if (!isUndefined(window.wpseoPostScraperL10n)) {
		l10nObject = window.wpseoPostScraperL10n;
	} else if (!isUndefined(window.wpseoTermScraperL10n)) {
		l10nObject = window.wpseoTermScraperL10n;
	}

	return l10nObject;
}

module.exports = getL10nObject;

},{"lodash/isUndefined":4}],3:[function(require,module,exports){
"use strict";

var getL10nObject = require("./getL10nObject");

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string} The title placeholder.
 */
function getTitlePlaceholder() {
	var titlePlaceholder = "";
	var l10nObject = getL10nObject();

	if (l10nObject) {
		titlePlaceholder = l10nObject.title_template;
	}

	if (titlePlaceholder === "") {
		titlePlaceholder = "%%title%% - %%sitename%%";
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"./getL10nObject":2}],4:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],5:[function(require,module,exports){
'use strict';

/* jshint -W097 */

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} controls The HTML ID of the element this button controls.
 *
 * @returns {string} Generated HTML.
 */
function helpButton(text, controls) {
  return '<button type="button" class="yoast_help yoast-help-button dashicons" aria-expanded="false" ' + 'aria-controls="' + controls + '"><span class="screen-reader-text">' + text + '</span></button>';
}

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} id The HTML ID to give this button.
 *
 * @returns {string} The generated HTMl.
 */
function helpText(text, id) {
  return '<p id="' + id + '" class="yoast-help-panel">' + text + '</p>';
}

module.exports = {
  helpButton: helpButton,
  helpText: helpText
};

},{}],6:[function(require,module,exports){
"use strict";

/* global yoastSocialPreview, tinyMCE, require, wp, YoastSEO, ajaxurl  */
/* jshint -W097 */

var getImages = require("yoastseo/js/stringProcessing/imageInText");
var helpPanel = require("./helpPanel");
var getTitlePlaceholder = require("../../../../js/src/analysis/getTitlePlaceholder");
var getDescriptionPlaceholder = require("../../../../js/src/analysis/getDescriptionPlaceholder");

var _debounce = require("lodash/debounce");
var clone = require("lodash/clone");
var forEach = require("lodash/forEach");
var _has = require("lodash/has");
var isUndefined = require("lodash/isUndefined");

var Jed = require("jed");
var socialPreviews = require("yoast-social-previews");

(function ($) {
	/**
  * We want to store the fallbacks in an object, to have directly access to them.
  * @type {{content: string, featured: string}}
  */
	var imageFallBack = {
		content: "",
		featured: ""
	};

	var canReadFeaturedImage = true;

	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

	var facebookPreview, twitterPreview;

	var translations = yoastSocialPreview.i18n;

	var i18n = new Jed(addLibraryTranslations(translations.library));
	var biggerImages = {};

	var postTitleInputId = "title";

	/**
  * Sets the events for opening the WP media library when pressing the button.
  *
  * @param {Object} imageUrl The image URL object.
  * @param {string} imageButton ID name for the image button.
  * @param {string} removeButton ID name for the remove button.
  * @param {function} onMediaSelect The event that will be ran when image is chosen.
  * @param {Object} imagePreviewElement The image preview element that can be clicked to update as well.
  *
  * @returns {void}
  */
	function bindUploadButtonEvents(imageUrl, imageButton, removeButton, onMediaSelect, imagePreviewElement) {
		/* eslint-disable camelcase */
		var socialPreviewUploader = wp.media.frames.file_frame = wp.media({
			title: yoastSocialPreview.choose_image,
			button: { text: yoastSocialPreview.choose_image },
			multiple: false
		});
		/* eslint-enable camelcase */

		socialPreviewUploader.on("select", function () {
			var attachment = socialPreviewUploader.state().get("selection").first().toJSON();

			// Set the image URL.
			imageUrl.val(attachment.url);

			onMediaSelect();

			$(removeButton).show();
		});

		$(removeButton).click(function (evt) {
			evt.preventDefault();

			// Clear the image URL
			imageUrl.val("");

			onMediaSelect();

			$(removeButton).hide();
		});

		$(imageButton).click(function (evt) {
			evt.preventDefault();
			socialPreviewUploader.open();
		});

		$(imagePreviewElement).on("click", function (eventObject) {
			socialPreviewUploader.open();
		});
	}

	/**
  * Adds the choose image button and hides the input field.
  *
  * @param {Object} preview The preview to add the upload button to.
  *
  * @returns {void}
  */
	function addUploadButton(preview) {
		if (typeof wp.media === "undefined") {
			return;
		}

		var imageUrl = $(preview.element.formContainer).find(".js-snippet-editor-imageUrl");

		var buttonDiv = $("<div></div>");
		buttonDiv.insertAfter(imageUrl);

		var uploadButtonText = getUploadButtonText(preview);

		var imageFieldId = jQuery(imageUrl).attr("id");
		var imageButtonId = imageFieldId + "_button";
		var imageButtonHtml = '<button id="' + imageButtonId + '" ' + 'class="button button-primary wpseo_preview_image_upload_button" type="button">' + uploadButtonText + '</button>';

		var removeButtonId = imageFieldId + "_remove_button";
		var removeButtonHtml = '<button id="' + removeButtonId + '" type="button" ' + 'class="button wpseo_preview_image_upload_button">' + yoastSocialPreview.removeImageButton + '</button>';

		$(buttonDiv).append(imageButtonHtml);
		$(buttonDiv).append(removeButtonHtml);

		imageUrl.hide();
		if (imageUrl.val() === "") {
			$("#" + removeButtonId).hide();
		}

		bindUploadButtonEvents(imageUrl, "#" + imageButtonId, "#" + removeButtonId, preview.updatePreview.bind(preview), $(preview.element.container).find(".editable-preview__image"));
	}

	/**
  * Returns the type of the current page: post or term.
  *
  * @returns {string} The current type.
  */
	function getCurrentType() {
		// When this field exists, it is a post.
		if ($("#post_ID").length > 0) {
			return "post";
		}

		// When this field is found, it is a term.
		if ($("input[name=tag_ID]").length > 0) {
			return "term";
		}

		return "";
	}

	/**
  * Returns the prefix for the fields, because of the fields for the post do have an othere prefix than the ones for
  * a taxonomy.
  *
  * @returns {*} The prefix to use.
  */
	function fieldPrefix() {
		switch (getCurrentType()) {
			case "post":
				return "yoast_wpseo";
			case "term":
				return "wpseo";
			default:
				return "";
		}
	}

	/**
  * Returns the name of the tinymce and textarea fields.
  *
  * @returns {string} The name for the content field.
  */
	function contentTextName() {
		switch (getCurrentType()) {
			case "post":
				return "content";
			case "term":
				return "description";
			default:
				return "";
		}
	}

	/**
  * Creates the social preview container and hides the old form table, to replace it.
  *
  * @param {Object} socialPreviewholder The holder element where the container will be append to.
  * @param {string} containerId The id the container will get
  * @returns {void}
  */
	function createSocialPreviewContainer(socialPreviewholder, containerId) {
		socialPreviewholder.append('<div id="' + containerId + '"></div>');
	}

	/**
  * Gets the meta description from the snippet editor
  * @returns {void}
  */
	function getMetaDescription() {
		return $("#yoast_wpseo_metadesc").val();
	}

	/**
  * Returns the placeholder for the meta description field.
  *
  * @returns {string} The placeholder for the meta description.
  */
	function getSocialDescriptionPlaceholder() {
		var description = getMetaDescription();

		if ("" === description) {
			description = getDescriptionPlaceholder();
		}

		return description;
	}

	/**
  * Returns the arguments for the social preview prototypes.
  *
  * @param {string} targetElement The element where the preview is loaded.
  * @param {string} fieldPrefix The prefix each form element has.
  *
  * @returns { {
  * 		targetElement: Element,
  *		data: {title: *, description: *, imageUrl: *},
  * 		baseURL: *,
  * 		callbacks: {updateSocialPreview: callbacks.updateSocialPreview}
  * } } The arguments for the social preview.
  */
	function getSocialPreviewArgs(targetElement, fieldPrefix) {
		var titlePlaceholder = getTitlePlaceholder();
		var descriptionPlaceholder = getSocialDescriptionPlaceholder();

		var args = {
			targetElement: $(targetElement).get(0),
			data: {
				title: $("#" + fieldPrefix + "-title").val(),
				description: $("#" + fieldPrefix + "-description").val(),
				imageUrl: $("#" + fieldPrefix + "-image").val()
			},
			baseURL: yoastSocialPreview.website,
			callbacks: {
				updateSocialPreview: function updateSocialPreview(data) {
					$("#" + fieldPrefix + "-title").val(data.title);
					$("#" + fieldPrefix + "-description").val(data.description);
					$("#" + fieldPrefix + "-image").val(data.imageUrl);

					// Make sure Twitter is updated if a Facebook image is set
					$(".editable-preview").trigger("imageUpdate");

					if (data.imageUrl !== "") {
						var buttonPrefix = targetElement.attr("id").replace("Preview", "");
						setUploadButtonValue(buttonPrefix, yoastSocialPreview.useOtherImage);
					}

					jQuery(targetElement).find(".editable-preview").trigger("titleUpdate");
					jQuery(targetElement).find(".editable-preview").trigger("descriptionUpdate");
				},
				modifyImageUrl: function modifyImageUrl(imageUrl) {
					if (imageUrl === "") {
						imageUrl = getFallbackImage("");
					}

					return imageUrl;
				},
				modifyTitle: function modifyTitle(title) {
					if (fieldPrefix.indexOf("twitter") > -1) {
						if (title === $("#twitter-editor-title").attr("placeholder")) {
							var facebookTitle = $("#facebook-editor-title").val();
							if (!isUndefined(facebookTitle) && facebookTitle !== "") {
								title = facebookTitle;
							}
						}
					}
					return YoastSEO.wp.replaceVarsPlugin.replaceVariables(title);
				},
				modifyDescription: function modifyDescription(description) {
					if (fieldPrefix.indexOf("twitter") > -1) {
						if (description === $("#twitter-editor-description").attr("placeholder")) {
							var facebookDescription = $("#facebook-editor-description").val();
							if (facebookDescription !== "") {
								description = facebookDescription;
							}
						}
						if (isUndefined(description)) {
							description = $("#twitter-editor-description").attr('placeholder');
						}
					}

					return YoastSEO.wp.replaceVarsPlugin.replaceVariables(description);
				}
			},
			placeholder: {
				title: titlePlaceholder
			},
			defaultValue: {
				title: titlePlaceholder
			}
		};

		if ("" !== descriptionPlaceholder) {
			args.placeholder.description = descriptionPlaceholder;
			args.defaultValue.description = descriptionPlaceholder;
		}

		return args;
	}

	/**
  * Try to get the Facebook author name via AJAX and put it to the Facebook preview.
  *
  * @param {FacebookPreview} facebookPreview The Facebook preview object
  * @returns {void}
  */
	function getFacebookAuthor(facebookPreview) {
		$.get(ajaxurl, {
			action: "wpseo_get_facebook_name",
			_ajax_nonce: yoastSocialPreview.facebookNonce,
			user_id: $("#post_author_override").val()
		}, function (author) {
			if (author !== 0) {
				facebookPreview.setAuthor(author);
			}
		});
	}

	/**
  * Initialize the Facebook preview.
  *
  * @param {Object} facebookHolder Target element for adding the Facebook preview.
  * @returns {void}
  */
	function initFacebook(facebookHolder) {
		createSocialPreviewContainer(facebookHolder, "facebookPreview");

		var facebookPreviewContainer = $("#facebookPreview");
		facebookPreview = new FacebookPreview(getSocialPreviewArgs(facebookPreviewContainer, fieldPrefix() + "_opengraph"), i18n);

		facebookPreviewContainer.on("imageUpdate", ".editable-preview", function () {
			setUploadButtonValue("facebook", getUploadButtonText(facebookPreview));
			setFallbackImage(facebookPreview);
		});

		facebookPreview.init();

		addUploadButton(facebookPreview);

		var postAuthorDropdown = $("#post_author_override");
		if (postAuthorDropdown.length > 0) {
			postAuthorDropdown.on("change", getFacebookAuthor.bind(this, facebookPreview));
			postAuthorDropdown.trigger("change");
		}

		$("#" + postTitleInputId).on("keydown keyup input focus blur", _debounce(facebookPreview.updatePreview.bind(facebookPreview), 500));
	}

	/**
  * Initialize the twitter preview.
  *
  * @param {Object} twitterHolder Target element for adding the twitter preview.
  * @returns {void}
  */
	function initTwitter(twitterHolder) {
		createSocialPreviewContainer(twitterHolder, "twitterPreview");

		var twitterPreviewContainer = $("#twitterPreview");
		twitterPreview = new TwitterPreview(getSocialPreviewArgs(twitterPreviewContainer, fieldPrefix() + "_twitter"), i18n);

		twitterPreviewContainer.on("imageUpdate", ".editable-preview", function () {
			setUploadButtonValue("twitter", getUploadButtonText(twitterPreview));
			setFallbackImage(twitterPreview);
		});

		var facebookPreviewContainer = $("#facebookPreview");
		facebookPreviewContainer.on("titleUpdate", ".editable-preview", twitterTitleFallback.bind(this, twitterPreview));

		facebookPreviewContainer.on("descriptionUpdate", ".editable-preview", twitterDescriptionFallback.bind(this, twitterPreview));

		twitterPreview.init();

		addUploadButton(twitterPreview);
		twitterTitleFallback(twitterPreview);
		twitterDescriptionFallback(twitterPreview);

		$("#" + postTitleInputId).on("keydown keyup input focus blur", _debounce(twitterTitleFallback.bind(this, twitterPreview), 500));
	}

	/**
  * When twitter title is empty, use the Facebook title
  *
  * @param {TwitterPreview} twitterPreview The twitter preview object
  * @returns {void}
  */
	function twitterTitleFallback(twitterPreview) {
		var $twitterTitle = $("#twitter-editor-title");
		var twitterTitle = $twitterTitle.val();
		if (twitterTitle !== "") {
			return;
		}

		var facebookTitle = $("#facebook-editor-title").val();
		if (!isUndefined(facebookTitle) && facebookTitle !== "") {
			twitterPreview.setTitle(facebookTitle);
		} else {
			twitterPreview.setTitle($twitterTitle.attr("placeholder"));
		}
	}

	/**
  * When twitter description is empty, use the description title
  *
  * @param {TwitterPreview} twitterPreview The twitter preview object
  * @returns {void}
  */
	function twitterDescriptionFallback(twitterPreview) {
		var $twitterDescription = $("#twitter-editor-description");
		var twitterDescription = $twitterDescription.val();
		if (twitterDescription !== "") {
			return;
		}

		var facebookDescription = $("#facebook-editor-description").val();
		if (facebookDescription !== "") {
			twitterPreview.setDescription(facebookDescription);
		} else {
			twitterPreview.setDescription($twitterDescription.attr("placeholder"));
		}
	}

	/**
  * Set the fallback image for the preview if no image has been set
  *
  * @param {Object} preview Preview to set fallback image on.
  * @returns {void}
     */
	function setFallbackImage(preview) {
		if (preview.data.imageUrl === "") {
			preview.setImage(getFallbackImage(""));
		}
	}

	/**
  * Changes the upload button value when there are fallback images present.
  *
  * @param {string} buttonPrefix The value before the id name.
  * @param {string} text The text on the button.
  * @returns {void}
  */
	function setUploadButtonValue(buttonPrefix, text) {
		$("#" + buttonPrefix + "-editor-imageUrl_button").html(text);
	}

	/**
  * Bind the image events to set the fallback and rendering the preview.
  *
  * @returns {void}
  */
	function bindImageEvents() {
		if (getCurrentType() === "post") {
			bindFeaturedImageEvents();
		}

		bindContentEvents();
	}

	/**
  * Get the text that the upload button needs to display
  *
  * @param {Object} preview Preview to read image from.
  * @returns {*} The text for the button.
     */
	function getUploadButtonText(preview) {
		return preview.data.imageUrl === "" ? yoastSocialPreview.uploadImage : yoastSocialPreview.useOtherImage;
	}

	/**
  * Binds the events for the featured image.
  *
  * @returns {void}
  */
	function bindFeaturedImageEvents() {
		if (isUndefined(wp.media) || isUndefined(wp.media.featuredImage)) {
			return;
		}

		// When the featured image is being changed
		var featuredImage = wp.media.featuredImage.frame();

		featuredImage.on("select", function () {
			var imageDetails = featuredImage.state().get("selection").first().attributes;

			canReadFeaturedImage = true;

			setFeaturedImage(imageDetails.url);
		});

		$("#postimagediv").on("click", "#remove-post-thumbnail", function () {
			canReadFeaturedImage = false;

			clearFeaturedImage();
		});
	}

	/**
  * Bind the events for the content.
  *
  * @returns {void}
  */
	function bindContentEvents() {
		// Bind the event when something changed in the text editor.
		var contentElement = $("#" + contentTextName());
		if (contentElement.length > 0) {
			contentElement.on("input", detectImageFallback);
		}

		// Bind the events when something changed in the tinyMCE editor.
		if (typeof tinyMCE !== "undefined" && typeof tinyMCE.on === "function") {
			var events = ["input", "change", "cut", "paste"];
			tinyMCE.on("addEditor", function (e) {
				for (var i = 0; i < events.length; i++) {
					e.editor.on(events[i], detectImageFallback);
				}
			});
		}
	}

	/**
  * Sets the featured image fallback value as an empty value and runs the fallback method.
  *
  * @returns {void}
  */
	function clearFeaturedImage() {
		setFeaturedImage("");
		detectImageFallback();
	}

	/**
  * Sets the image fallbacks like the featured image (in case of a post) and the content image.
  *
  * @returns {void}
  */
	function detectImageFallback() {
		// In case of a post: we want to have the featured image.
		if (getCurrentType() === "post") {
			var featuredImage = getFeaturedImage();
			setFeaturedImage(featuredImage);

			if (featuredImage !== "") {
				return;
			}
		}

		setContentImage(getContentImage(function (image) {
			setContentImage(image);
		}));
	}

	/**
  * Sets the featured image based on the given image URL.
  *
  * @param {string} featuredImage The image we want to set.
  * @returns {void}
  */
	function setFeaturedImage(featuredImage) {
		if (imageFallBack.featured !== featuredImage) {
			imageFallBack.featured = featuredImage;

			// Just refresh the image URL.
			$(".editable-preview").trigger("imageUpdate");
		}
	}

	/**
  * Sets the content image base on the given image URL
  *
  * @param {string} contentImage The image we want to set.
  * @returns {void}
  */
	function setContentImage(contentImage) {
		if (imageFallBack.content !== contentImage) {
			imageFallBack.content = contentImage;

			// Just refresh the image URL.
			$(".editable-preview").trigger("imageUpdate");
		}
	}

	/**
  * Gets the featured image source from the DOM.
  *
  * @returns {string} The url to the featured image.
  */
	function getFeaturedImage() {
		if (canReadFeaturedImage === false) {
			return "";
		}

		var postThumbnail = $(".attachment-post-thumbnail");
		if (postThumbnail.length > 0) {
			return $(postThumbnail.get(0)).attr("src");
		}

		return "";
	}

	/**
  * Returns the image from the content.
  *
  * @param {Function} callback function to call if a bigger size is available.
  *
  * @returns {string} The first image found in the content.
  */
	function getContentImage(callback) {
		var content = getContent();

		var images = getImages(content);
		var image = "";

		if (images.length === 0) {
			return image;
		}

		do {
			var currentImage = images.shift();
			currentImage = $(currentImage);

			var imageSource = currentImage.prop("src");

			if (imageSource) {
				image = imageSource;
			}
		} while ("" === image && images.length > 0);

		image = getBiggerImage(image, callback);

		return image;
	}

	/**
  * Try to retrieve a bigger image for a certain image found in the content.
  *
  * @param {string}   url      The URL to retrieve.
  * @param {Function} callback The callback to call if there is a bigger image.
  * @returns {string} Returns the bigger image url.
  */
	function getBiggerImage(url, callback) {
		if (_has(biggerImages, url)) {
			return biggerImages[url];
		}

		retrieveImageDataFromURL(url, function (imageUrl) {
			biggerImages[url] = imageUrl;

			callback(imageUrl);
		});

		return url;
	}

	/**
  * Retrieves the image metadata from an image url and saves it to the image manager afterwards
  *
  * @param {string} url The image URL to retrieve the metadata from.
  * @param {Function} callback Callback to call with the image URL result.
  * @returns {void}
  */
	function retrieveImageDataFromURL(url, callback) {
		$.getJSON(ajaxurl, {
			action: "retrieve_image_data_from_url",
			imageURL: url
		}, function (response) {
			if ("success" === response.status) {
				callback(response.result);
			}
		});
	}

	/**
  * Returns the content from current visible content editor
  *
  * @returns {string} The value of the tinymce box.
  */
	function getContent() {
		if (isTinyMCEAvailable()) {
			return tinyMCE.get(contentTextName()).getContent();
		}

		var contentElement = $("#" + contentTextName());
		if (contentElement.length > 0) {
			return contentElement.val();
		}

		return "";
	}

	/**
  * Check if tinymce is active on the current page.
  *
  * @returns {boolean} True when tinymce is available.
  * @private
  */
	function isTinyMCEAvailable() {
		if (typeof tinyMCE === "undefined" || typeof tinyMCE.editors === "undefined" || tinyMCE.editors.length === 0 || tinyMCE.get(contentTextName()) === null || tinyMCE.get(contentTextName()).isHidden()) {
			return false;
		}

		return true;
	}

	/**
  * Check if there is a fallback image like the featured image or the first image in the content.
  *
  * @param {string} defaultImage The default image when nothing has been found.
  * @returns {string} The image to use.
  */
	function getFallbackImage(defaultImage) {
		// Twitter always first falls back to Facebook
		if (!isUndefined(facebookPreview) && facebookPreview.data.imageUrl !== "") {
			return facebookPreview.data.imageUrl;
		}

		// In case of an post: we want to have the featured image.
		if (getCurrentType() === "post") {
			if (imageFallBack.featured !== "") {
				return imageFallBack.featured;
			}
		}

		// When the featured image is empty, try an image in the content
		if (imageFallBack.content !== "") {
			return imageFallBack.content;
		}

		if (typeof defaultImage !== "undefined") {
			return defaultImage;
		}

		return "";
	}

	/**
  * Adds the help panels to the social previews
  *
  * @returns {void}
  */
	function addHelpPanels() {
		var panels = [{
			beforeElement: "#facebook-editor-imageUrl__caret-hook",
			buttonText: translations.helpButton.facebookImage,
			descriptionText: translations.help.facebookImage,
			id: "facebook-editor-image-help"
		}, {
			beforeElement: "#facebook-editor-title__caret-hook",
			buttonText: translations.helpButton.facebookTitle,
			descriptionText: translations.help.facebookTitle,
			id: "facebook-editor-title-help"
		}, {
			beforeElement: "#facebook-editor-description__caret-hook",
			buttonText: translations.helpButton.facebookDescription,
			descriptionText: translations.help.facebookDescription,
			id: "facebook-editor-description-help"
		}, {
			beforeElement: "#twitter-editor-imageUrl__caret-hook",
			buttonText: translations.helpButton.twitterImage,
			descriptionText: translations.help.twitterImage,
			id: "twitter-editor-image-help"
		}, {
			beforeElement: "#twitter-editor-title__caret-hook",
			buttonText: translations.helpButton.twitterTitle,
			descriptionText: translations.help.twitterTitle,
			id: "twitter-editor-title-help"
		}, {
			beforeElement: "#twitter-editor-description__caret-hook",
			buttonText: translations.helpButton.twitterDescription,
			descriptionText: translations.help.twitterDescription,
			id: "twitter-editor-description-help"
		}];

		forEach(panels, function (panel) {
			$(panel.beforeElement).before(helpPanel.helpButton(panel.buttonText, panel.id) + helpPanel.helpText(panel.descriptionText, panel.id));
		});

		$(".snippet-editor__form").on("click", ".yoast-help-button", function () {
			var $button = $(this),
			    helpPanel = $("#" + $button.attr("aria-controls")),
			    isPanelVisible = helpPanel.is(":visible");

			$(helpPanel).slideToggle(200, function () {
				$button.attr("aria-expanded", !isPanelVisible);
			});
		});
	}

	/**
  * Adds library translations
  * @param {Object} translations The translations to use.
  * @returns {Object} translations mapped to the proper domain.
  */
	function addLibraryTranslations(translations) {
		if (typeof translations !== "undefined" && typeof translations.domain !== "undefined") {
			translations.domain = "yoast-social-previews";
			translations.locale_data["yoast-social-previews"] = clone(translations.locale_data["wordpress-seo-premium"]);

			delete translations.locale_data["wordpress-seo-premium"];

			return translations;
		}

		return {
			domain: "yoast-social-previews",
			locale_data: {
				"yoast-social-previews": {
					"": {}
				}
			}
		};
	}

	/**
  * Initialize the social previews.
  *
  * @returns {void}
  */
	function initYoastSocialPreviews() {
		var facebookHolder = $("#wpseo_facebook");
		var twitterHolder = $("#wpseo_twitter");

		if (facebookHolder.length > 0 || twitterHolder.length > 0) {
			jQuery(window).on("YoastSEO:ready", function () {
				detectImageFallback();

				if (facebookHolder.length > 0) {
					initFacebook(facebookHolder);
				}

				if (twitterHolder.length > 0) {
					initTwitter(twitterHolder);
				}

				addHelpPanels();
				bindImageEvents();
			});
		}
	}

	$(initYoastSocialPreviews);
})(jQuery);

},{"../../../../js/src/analysis/getDescriptionPlaceholder":1,"../../../../js/src/analysis/getTitlePlaceholder":3,"./helpPanel":5,"jed":7,"lodash/clone":119,"lodash/debounce":120,"lodash/forEach":122,"lodash/has":123,"lodash/isUndefined":135,"yoast-social-previews":145,"yoastseo/js/stringProcessing/imageInText":221}],7:[function(require,module,exports){
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton

MIT License

A jQuery Foundation project - requires CLA to contribute -
https://contribute.jquery.org/CLA/



Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);

},{}],8:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":70,"./_root":109}],9:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":78,"./_hashDelete":79,"./_hashGet":80,"./_hashHas":81,"./_hashSet":82}],10:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":91,"./_listCacheDelete":92,"./_listCacheGet":93,"./_listCacheHas":94,"./_listCacheSet":95}],11:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":70,"./_root":109}],12:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":96,"./_mapCacheDelete":97,"./_mapCacheGet":98,"./_mapCacheHas":99,"./_mapCacheSet":100}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":70,"./_root":109}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":70,"./_root":109}],15:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":10,"./_stackClear":111,"./_stackDelete":112,"./_stackGet":113,"./_stackHas":114,"./_stackSet":115}],16:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":109}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":109}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":70,"./_root":109}],19:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],20:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],21:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],22:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],23:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":45,"./_isIndex":86,"./isArguments":125,"./isArray":126,"./isBuffer":128,"./isTypedArray":134}],24:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],25:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],26:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],27:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":31,"./eq":121}],28:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":121}],29:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":59,"./keys":136}],30:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":59,"./keysIn":137}],31:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":65}],32:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":15,"./_arrayEach":21,"./_assignValue":27,"./_baseAssign":29,"./_baseAssignIn":30,"./_cloneBuffer":51,"./_copyArray":58,"./_copySymbols":60,"./_copySymbolsIn":61,"./_getAllKeys":67,"./_getAllKeysIn":68,"./_getTag":75,"./_initCloneArray":83,"./_initCloneByTag":84,"./_initCloneObject":85,"./isArray":126,"./isBuffer":128,"./isObject":131,"./keys":136}],33:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":131}],34:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":36,"./_createBaseEach":63}],35:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":64}],36:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":35,"./keys":136}],37:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":25,"./isArray":126}],38:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":16,"./_getRawTag":72,"./_objectToString":107}],39:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;

},{}],40:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":38,"./isObjectLike":132}],41:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":89,"./_toSource":118,"./isFunction":129,"./isObject":131}],42:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":38,"./isLength":130,"./isObjectLike":132}],43:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":90,"./_nativeKeys":104}],44:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":90,"./_nativeKeysIn":105,"./isObject":131}],45:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],46:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":16,"./_arrayMap":24,"./isArray":126,"./isSymbol":133}],47:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],48:[function(require,module,exports){
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":124}],49:[function(require,module,exports){
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./_isKey":87,"./_stringToPath":116,"./isArray":126,"./toString":143}],50:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":17}],51:[function(require,module,exports){
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":109}],52:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":50}],53:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":19,"./_arrayReduce":26,"./_mapToArray":101}],54:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],55:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":20,"./_arrayReduce":26,"./_setToArray":110}],56:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":16}],57:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":50}],58:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],59:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":27,"./_baseAssignValue":31}],60:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":59,"./_getSymbols":73}],61:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":59,"./_getSymbolsIn":74}],62:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":109}],63:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":127}],64:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],65:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":70}],66:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],67:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":37,"./_getSymbols":73,"./keys":136}],68:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":37,"./_getSymbolsIn":74,"./keysIn":137}],69:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":88}],70:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":41,"./_getValue":76}],71:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":108}],72:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":16}],73:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":22,"./stubArray":140}],74:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":25,"./_getPrototype":71,"./_getSymbols":73,"./stubArray":140}],75:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":8,"./_Map":11,"./_Promise":13,"./_Set":14,"./_WeakMap":18,"./_baseGetTag":38,"./_toSource":118}],76:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],77:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":49,"./_isIndex":86,"./_toKey":117,"./isArguments":125,"./isArray":126,"./isLength":130}],78:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":103}],79:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],80:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":103}],81:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":103}],82:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":103}],83:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],84:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":50,"./_cloneDataView":52,"./_cloneMap":53,"./_cloneRegExp":54,"./_cloneSet":55,"./_cloneSymbol":56,"./_cloneTypedArray":57}],85:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":33,"./_getPrototype":71,"./_isPrototype":90}],86:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],87:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":126,"./isSymbol":133}],88:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],89:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":62}],90:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],91:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],92:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":28}],93:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":28}],94:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":28}],95:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":28}],96:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":9,"./_ListCache":10,"./_Map":11}],97:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":69}],98:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":69}],99:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":69}],100:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":69}],101:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],102:[function(require,module,exports){
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":138}],103:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":70}],104:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":108}],105:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],106:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":66}],107:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],108:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],109:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":66}],110:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],111:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":10}],112:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],113:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],114:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],115:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":10,"./_Map":11,"./_MapCache":12}],116:[function(require,module,exports){
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":102}],117:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":133}],118:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],119:[function(require,module,exports){
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;

},{"./_baseClone":32}],120:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":131,"./now":139,"./toNumber":142}],121:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],122:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":21,"./_baseEach":34,"./_castFunction":48,"./isArray":126}],123:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":39,"./_hasPath":77}],124:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],125:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":40,"./isObjectLike":132}],126:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],127:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":129,"./isLength":130}],128:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":109,"./stubFalse":141}],129:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":38,"./isObject":131}],130:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],131:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],132:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],133:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":38,"./isObjectLike":132}],134:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":42,"./_baseUnary":47,"./_nodeUtil":106}],135:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],136:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":23,"./_baseKeys":43,"./isArrayLike":127}],137:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":23,"./_baseKeysIn":44,"./isArrayLike":127}],138:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":12}],139:[function(require,module,exports){
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":109}],140:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],141:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],142:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":131,"./isSymbol":133}],143:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":46}],144:[function(require,module,exports){
var findMatchingRule = function(rules, text){
  var i;
  for(i=0; i<rules.length; i++)
    if(rules[i].regex.test(text))
      return rules[i];
  return undefined;
};

var findMaxIndexAndRule = function(rules, text){
  var i, rule, last_matching_rule;
  for(i=0; i<text.length; i++){
    rule = findMatchingRule(rules, text.substring(0, i + 1));
    if(rule)
      last_matching_rule = rule;
    else if(last_matching_rule)
      return {max_index: i, rule: last_matching_rule};
  }
  return last_matching_rule ? {max_index: text.length, rule: last_matching_rule} : undefined;
};

module.exports = function(onToken_orig){
  var buffer = "";
  var rules = [];
  var line = 1;
  var col = 1;

  var onToken = function(src, type){
    onToken_orig({
      type: type,
      src: src,
      line: line,
      col: col
    });
    var lines = src.split("\n");
    line += lines.length - 1;
    col = (lines.length > 1 ? 1 : col) + lines[lines.length - 1].length;
  };

  return {
    addRule: function(regex, type){
      rules.push({regex: regex, type: type});
    },
    onText: function(text){
      var str = buffer + text;
      var m = findMaxIndexAndRule(rules, str);
      while(m && m.max_index !== str.length){
        onToken(str.substring(0, m.max_index), m.rule.type);

        //now find the next token
        str = str.substring(m.max_index);
        m = findMaxIndexAndRule(rules, str);
      }
      buffer = str;
    },
    end: function(){
      if(buffer.length === 0)
        return;

      var rule = findMatchingRule(rules, buffer);
      if(!rule){
        var err = new Error("unable to tokenize");
        err.tokenizer2 = {
          buffer: buffer,
          line: line,
          col: col
        };
        throw err;
      }

      onToken(buffer, rule.type);
    }
  };
};

},{}],145:[function(require,module,exports){
module.exports = {
	FacebookPreview: require( "./js/facebookPreview" ),
	TwitterPreview: require( "./js/twitterPreview" )
};

},{"./js/facebookPreview":148,"./js/twitterPreview":162}],146:[function(require,module,exports){
var placeholderTemplate = require( "../templates" ).imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object}  imageContainer The location to put the placeholder in.
 * @param {string}  placeholder    The value for the placeholder.
 * @param {boolean} isError        When the placeholder should an error.
 * @param {string}  modifier       A css class modifier to change the styling.
 *
 * @returns {void}
 */
function setImagePlaceholder( imageContainer, placeholder, isError, modifier ) {
	var classNames = [ "social-image-placeholder" ];
	isError = isError || false;
	modifier = modifier || "";

	if ( isError ) {
		classNames.push( "social-image-placeholder--error" );
	}

	if ( "" !== modifier ) {
		classNames.push( "social-image-placeholder--" + modifier );
	}

	imageContainer.innerHTML = placeholderTemplate( {
		className: classNames.join( " " ),
		placeholder: placeholder,
	} );
}

module.exports = setImagePlaceholder;

},{"../templates":161}],147:[function(require,module,exports){
var isEmpty = require( "lodash/lang/isEmpty" );
var debounce = require( "lodash/function/debounce" );
var stripHTMLTags = require( "yoastseo/js/stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "yoastseo/js/stringProcessing/stripSpaces.js" );

/**
 * Represents a field and sets the events for that field.
 *
 * @param {Object}           inputField The field to represent.
 * @param {Object}           values     The values to use.
 * @param {Object|undefined} callback   The callback to executed after field change.
 * @constructor
 */
function InputElement( inputField, values, callback ) {
	this.inputField = inputField;
	this.values = values;
	this._callback = callback;

	this.setValue( this.getInputValue() );

	this.bindEvents();
}

/**
 * Binds the events.
 *
 * @returns {void}
 */
InputElement.prototype.bindEvents = function() {
	// Set the events.
	this.inputField.addEventListener( "keydown", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "keyup", this.changeEvent.bind( this ) );

	this.inputField.addEventListener( "input", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "focus", this.changeEvent.bind( this ) );
	this.inputField.addEventListener( "blur", this.changeEvent.bind( this ) );
};

/**
 * Do the change event.
 *
 * @type {Function}
 */
InputElement.prototype.changeEvent = debounce( function() {
	// When there is a callback run it.
	if ( typeof this._callback !== "undefined" ) {
		this._callback();
	}

	this.setValue( this.getInputValue() );
}, 25 );

/**
 * Gets the current field value.
 *
 * @returns {string} The current field value.
 */
InputElement.prototype.getInputValue = function() {
	return this.inputField.value;
};

/**
 * Formats the a value for the preview. If value is empty a sample value is used.
 *
 * @returns {string} The formatted title, without html tags.
 */
InputElement.prototype.formatValue = function() {
	var value = this.getValue();

	value = stripHTMLTags( value );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( value ) ) {
		value = this.values.fallback;
	}

	return stripSpaces( value );
};

/**
 * Get the value.
 *
 * @returns {string} Return the value or get a fallback one.
 */
InputElement.prototype.getValue = function() {
	var value = this.values.currentValue;

	// Fallback to the default if value is empty.
	if ( isEmpty( value ) ) {
		value = this.values.defaultValue;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( value ) ) {
		value = this.values.placeholder;
	}

	return value;
};

/**
 * Set the current value.
 *
 * @param {string} value The value to set.
 *
 * @returns {void}
 */
InputElement.prototype.setValue = function( value ) {
	this.values.currentValue = value;
};

module.exports = InputElement;

},{"lodash/function/debounce":165,"lodash/lang/isEmpty":205,"yoastseo/js/stringProcessing/stripHTMLTags.js":223,"yoastseo/js/stringProcessing/stripSpaces.js":224}],148:[function(require,module,exports){
/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var imageDisplayMode = require( "./helpers/imageDisplayMode" );
var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder = require( "./element/imagePlaceholder" );
var bemAddModifier = require( "./helpers/bem/addModifier" );
var bemRemoveModifier = require( "./helpers/bem/removeModifier" );

var TextField = require( "./inputs/textInput" );
var TextArea = require( "./inputs/textarea" );

var InputElement = require( "./element/input" );
var PreviewEvents = require( "./preview/events" );

var templates = require( "./templates.js" );
var facebookEditorTemplate = templates.facebookPreview;
var facebookAuthorTemplate = templates.facebookAuthor;

var facebookDefaults = {
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

var inputFacebookPreviewBindings = [
	{
		preview: "editable-preview__title--facebook",
		inputField: "title",
	},
	{
		preview: "editable-preview__image--facebook",
		inputField: "imageUrl",
	},
	{
		preview: "editable-preview__description--facebook",
		inputField: "description",
	},
];

var WIDTH_FACEBOOK_IMAGE_SMALL = 158;
var WIDTH_FACEBOOK_IMAGE_LARGE = 470;

var FACEBOOK_IMAGE_TOO_SMALL_WIDTH = 200;
var FACEBOOK_IMAGE_TOO_SMALL_HEIGHT = 200;

var FACEBOOK_IMAGE_THRESHOLD_WIDTH = 600;
var FACEBOOK_IMAGE_THRESHOLD_HEIGHT = 315;

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
 * @param {string}         opts.baseURL                       - The basic URL as it will be displayed in Facebook.
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
 * @property {HTMLElement} element.rendered.description       - The rendered Facebook description element.
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
var FacebookPreview = function( opts, i18n ) {
	this.i18n = i18n || this.constructI18n();

	facebookDefaults.placeholder = {
		title: this.i18n.dgettext( "yoast-social-previews", "This is an example title - edit by clicking here" ),
		description: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext( "yoast-social-previews", "Modify your %1$s description by editing it right here" ),
			"Facebook"
		),
		imageUrl: "",
	};

	defaultsDeep( opts, facebookDefaults );

	if ( ! isElement( opts.targetElement ) ) {
		throw new Error( "The Facebook preview requires a valid target element" );
	}

	this.data = opts.data;
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
			baseUrl: this.opts.baseURL,
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Facebook */
			edit: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "Edit %1$s preview" ), "Facebook" ),
			/** translators: %1$s expands to Facebook */
			snippetPreview: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s preview" ), "Facebook" ),
			/** translators: %1$s expands to Facebook */
			snippetEditor: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s editor" ), "Facebook" ),
		},
	} );

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName( "editable-preview__value--facebook-title" )[ 0 ],
			description: targetElement.getElementsByClassName( "editable-preview__value--facebook-description" )[ 0 ],
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName( "editable-preview--facebook" )[ 0 ],
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[ 0 ],
		authorContainer: targetElement.getElementsByClassName( "editable-preview__value--facebook-author" )[ 0 ],
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
		imageUrl: targetElement.getElementsByClassName( "editable-preview__image--facebook" )[ 0 ],
		description: this.element.rendered.description.parentNode,
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
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s title" ), "Facebook" ),
			labelClassName: "snippet-editor__label",
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s description" ), "Facebook" ),
			labelClassName: "snippet-editor__label",
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s image" ), "Facebook" ),
			labelClassName: "snippet-editor__label",
		} ),
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
		title: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.sprintf(
					/** translators: %1$s expands to Facebook */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s title by editing the snippet below." ),
					"Facebook"
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
					/** translators: %1$s expands to Facebook */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s description by editing the snippet below." ),
					"Facebook"
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
 * Updates the Facebook preview.
 *
 * @returns {void}
 */
FacebookPreview.prototype.updatePreview = function() {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle( this.element.fieldElements.title.getValue() );
	this.setTitle( this.element.fieldElements.title.getValue() );

	// Set the description field and parse the styling of it.
	this.setDescription( this.element.fieldElements.description.getValue() );

	// Sets the Image
	this.setImage( this.data.imageUrl );

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview( clone( this.data ) );
};

/**
 * Sets the preview title.
 *
 * @param {string} title The title to set.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setTitle = function( title ) {
	title = this.opts.callbacks.modifyTitle( title );

	this.element.rendered.title.innerHTML = title;
};

/**
 * Sets the preview description.
 *
 * @param {string} description The description to set.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setDescription = function( description ) {
	description = this.opts.callbacks.modifyDescription( description );

	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Gets the image container.
 *
 * @returns {string} The container that will hold the image.
 */
FacebookPreview.prototype.getImageContainer = function() {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setImage = function( imageUrl ) {
	imageUrl = this.opts.callbacks.modifyImageUrl( imageUrl );

	if ( imageUrl === "" && this.data.imageUrl === "" ) {
		this.removeImageFromContainer();
		return this.noUrlSet();
	}

	var img = new Image();

	img.onload = function() {
		if ( this.isTooSmallImage( img ) ) {
			this.removeImageFromContainer();
			return this.imageTooSmall();
		}

		this.setSizingClass( img );
		this.addImageToContainer( imageUrl );
	}.bind( this );

	img.onerror = function() {
		this.removeImageFromContainer();
		return this.imageError();
	}.bind( this );

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Displays the No URL Set warning.
 *
 * @returns {void}
 */
FacebookPreview.prototype.noUrlSet = function() {
	this.removeImageClasses();

	imagePlaceholder(
		this.getImageContainer(),
		this.i18n.dgettext( "yoast-social-previews", "Please select an image by clicking here" ),
		false,
		"facebook"
	);

	return;
};

/**
 * Displays the Image Too Small error.
 *
 * @returns {void}
 */
FacebookPreview.prototype.imageTooSmall = function() {
	var message;
	this.removeImageClasses();

	if ( this.data.imageUrl === "" ) {
		message = this.i18n.sprintf(
			/* translators: %1$s expands to Facebook */
			this.i18n.dgettext( "yoast-social-previews", "We are unable to detect an image " +
				"in your post that is large enough to be displayed on Facebook. We advise you " +
				"to select a %1$s image that fits the recommended image size." ),
			"Facebook"
		);
	} else {
		message = this.i18n.sprintf(
			/* translators: %1$s expands to Facebook */
			this.i18n.dgettext( "yoast-social-previews", "The image you selected is too small for %1$s" ),
			"Facebook"
		);
	}

	imagePlaceholder(
		this.getImageContainer(),
		message,
		true,
		"facebook"
	);

	return;
};

/**
 * Displays the Url Cannot Be Loaded error.
 *
 * @returns {void}
 */
FacebookPreview.prototype.imageError = function() {
	this.removeImageClasses();

	imagePlaceholder(
		this.getImageContainer(),
		this.i18n.dgettext( "yoast-social-previews", "The given image url cannot be loaded" ),
		true,
		"facebook"
	);
};

/**
 * Sets the image of the image container.
 *
 * @param {string} image The image to use.
 *
 * @returns {void}
 */
FacebookPreview.prototype.addImageToContainer = function( image ) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 *
 * @returns {void}
 */
FacebookPreview.prototype.removeImageFromContainer = function() {
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
FacebookPreview.prototype.setSizingClass = function( img ) {
	this.removeImageClasses();

	if ( imageDisplayMode( img ) === "portrait" ) {
		this.setPortraitImageClasses();

		return;
	}

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
 * @returns {int} The calculated maxwidth.
 */
FacebookPreview.prototype.getMaxImageWidth = function( img ) {
	if ( this.isSmallImage( img ) ) {
		return WIDTH_FACEBOOK_IMAGE_SMALL;
	}

	return WIDTH_FACEBOOK_IMAGE_LARGE;
};

/**
 * Detects if the Facebook preview should switch to small image mode.
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
FacebookPreview.prototype.isSmallImage = function( image ) {
	return (
		image.width < FACEBOOK_IMAGE_THRESHOLD_WIDTH ||
		image.height < FACEBOOK_IMAGE_THRESHOLD_HEIGHT
	);
};

/**
 * Detects if the Facebook preview image is too small.
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
FacebookPreview.prototype.isTooSmallImage = function( image ) {
	return (
		image.width < FACEBOOK_IMAGE_TOO_SMALL_WIDTH ||
		image.height < FACEBOOK_IMAGE_TOO_SMALL_HEIGHT
	);
};

/**
 * Sets the classes on the Facebook preview so that it will display a small Facebook image preview.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-small", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the small image classes.
 *
 * @returns {void}
 */
FacebookPreview.prototype.removeSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-small", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-large", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the large image classes.
 *
 * @returns {void}
 */
FacebookPreview.prototype.removeLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-large", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the Facebook preview so that it will display a portrait Facebook image preview.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setPortraitImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-portrait", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-portrait", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-portrait", "editable-preview__text-keeper--facebook", targetElement );
	bemAddModifier( "facebook-bottom", "editable-preview__website--facebook", targetElement );
};

/**
 * Removes the portrait image classes.
 *
 * @returns {void}
 */
FacebookPreview.prototype.removePortraitImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-portrait", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-portrait", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-portrait", "editable-preview__text-keeper--facebook", targetElement );
	bemRemoveModifier( "facebook-bottom", "editable-preview__website--facebook", targetElement );
};

/**
 * Removes all image classes.
 *
 * @returns {void}
 */
FacebookPreview.prototype.removeImageClasses = function() {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
	this.removePortraitImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputFacebookPreviewBindings, this.element, true );
	previewEvents.bindEvents( this.element.editToggle, this.element.closeEditor );
};

/**
 * Sets the value of the Facebook author name.
 *
 * @param {string} authorName The name of the author to show.
 *
 * @returns {void}
 */
FacebookPreview.prototype.setAuthor = function( authorName ) {
	var authorHtml = "";
	if ( authorName !== "" ) {
		authorHtml = facebookAuthorTemplate(
			{
				authorName: authorName,
				authorBy: this.i18n.dgettext( "yoast-social-previews", "By" ),
			}
		);
	}

	this.element.authorContainer.innerHTML = authorHtml;
};

module.exports = FacebookPreview;

},{"./element/imagePlaceholder":146,"./element/input":147,"./helpers/bem/addModifier":150,"./helpers/bem/removeModifier":152,"./helpers/imageDisplayMode":153,"./helpers/renderDescription":156,"./inputs/textInput":158,"./inputs/textarea":159,"./preview/events":160,"./templates.js":161,"jed":7,"lodash/lang/clone":201,"lodash/lang/isElement":204,"lodash/object/defaultsDeep":215}],149:[function(require,module,exports){
/**
 * Adds a class to an element.
 *
 * @param {HTMLElement} element   The element to add the class to.
 * @param {string}      className The class to add.
 *
 * @returns {void}
 */
module.exports = function( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

},{}],150:[function(require,module,exports){
var addClass = require( "./../addClass" );
var addModifierToClass = require( "./addModifierToClass" );

/**
 * Adds a BEM modifier to an element.
 *
 * @param {string}      modifier     Modifier to add to the target.
 * @param {string}      targetClass  The target to add the modifier to.
 * @param {HTMLElement} targetParent The parent in which the target should be.
 *
 * @returns {void}
 */
function addModifier( modifier, targetClass, targetParent ) {
	var element = targetParent.getElementsByClassName( targetClass )[ 0 ];
	var newClass = addModifierToClass( modifier, targetClass );

	addClass( element, newClass );
}

module.exports = addModifier;

},{"./../addClass":149,"./addModifierToClass":151}],151:[function(require,module,exports){
/**
 * Adds a modifier to a class name, makes sure
 *
 * @param {string} modifier The modifier to add to the class name.
 * @param {string} className The class name to add the modifier to.
 *
 * @returns {string} The new class with the modifier.
 */
function addModifierToClass( modifier, className ) {
	var baseClass = className.replace( /--.+/, "" );

	return baseClass + "--" + modifier;
}

module.exports = addModifierToClass;

},{}],152:[function(require,module,exports){
var removeClass = require( "./../removeClass" );
var addModifierToClass = require( "./addModifierToClass" );

/**
 * Removes a BEM modifier from an element.
 *
 * @param {string}      modifier     Modifier to add to the target.
 * @param {string}      targetClass  The target to add the modifier to.
 * @param {HTMLElement} targetParent The parent in which the target should be.
 *
 * @returns {void}
 */
function removeModifier( modifier, targetClass, targetParent ) {
	var element = targetParent.getElementsByClassName( targetClass )[ 0 ];
	var newClass = addModifierToClass( modifier, targetClass );

	removeClass( element, newClass );
}

module.exports = removeModifier;

},{"./../removeClass":155,"./addModifierToClass":151}],153:[function(require,module,exports){
/**
 * Retrieves the image display mode
 *
 * @param {Object} image The image object.
 * @returns {string} The display mode of the image.
 */
function imageDisplayMode( image ) {
	if ( image.height > image.width ) {
		return "portrait";
	}

	return "landscape";
}

module.exports = imageDisplayMode;

},{}],154:[function(require,module,exports){
/**
 * Cleans spaces from the html.
 *
 * @param  {string} html The html to minimize.
 *
 * @returns {string} The minimized html string.
 */
function minimizeHtml( html ) {
	html = html.replace( /(\s+)/g, " " );
	html = html.replace( /> </g, "><" );
	html = html.replace( / >/g, ">" );
	html = html.replace( /> /g, ">" );
	html = html.replace( / </g, "<" );
	html = html.replace( / $/, "" );

	return html;
}

module.exports = minimizeHtml;

},{}],155:[function(require,module,exports){
/**
 * Removes a class from an element.
 *
 * @param {HTMLElement} element   The element to remove the class from.
 * @param {string}      className The class to remove.
 *
 * @returns {void}
 */
module.exports = function( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

},{}],156:[function(require,module,exports){
var isEmpty = require( "lodash/lang/isEmpty" );
var addClass = require( "./addClass" );
var removeClass = require( "./removeClass" );

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @param {string} descriptionElement Target description element.
 * @param {string} description        Current description.
 *
 * @returns {void}
 */
function renderDescription( descriptionElement, description ) {
	if ( isEmpty( description ) ) {
		addClass( descriptionElement, "desc-render" );
		removeClass( descriptionElement, "desc-default" );
	} else {
		addClass( descriptionElement, "desc-default" );
		removeClass( descriptionElement, "desc-render" );
	}
}

module.exports = renderDescription;

},{"./addClass":149,"./removeClass":155,"lodash/lang/isEmpty":205}],157:[function(require,module,exports){
var defaults = require( "lodash/object/defaults" );
var minimizeHtml = require( "../helpers/minimizeHtml" );

/**
 * Factory for the inputfield.
 *
 * @param {Object} template Template object to use.
 *
 * @returns {TextField} The textfield object.
 */
function inputFieldFactory( template ) {
	var defaultAttributes = {
		value: "",
		className: "",
		id: "",
		placeholder: "",
		name: "",
		title: "",
		labelClassName: "",
	};

	/**
	 * Represents an HTML text field.
	 *
	 * @param {Object} attributes             The attributes to set on the HTML element.
	 * @param {string} attributes.value       The value for this text field.
	 * @param {string} attributes.placeholder The placeholder for this text field.
	 * @param {string} attributes.name        The name for this text field.
	 * @param {string} attributes.id          The id for this text field.
	 * @param {string} attributes.className   The class for this text field.
	 * @param {string} attributes.title       The title that describes this text field.
	 *
	 * @constructor
	 */
	function TextField( attributes ) {
		attributes = attributes || {};
		attributes = defaults( attributes, defaultAttributes );

		this._attributes = attributes;
	}

	/**
	 * Returns the HTML attributes set for this text field.
	 *
	 * @returns {Object} The HTML attributes.
	 */
	TextField.prototype.getAttributes = function() {
		return this._attributes;
	};

	/**
	 * Renders the text field to HTML.
	 *
	 * @returns {string} The rendered HTML.
	 */
	TextField.prototype.render = function() {
		var html = template( this.getAttributes() );

		html = minimizeHtml( html );

		return html;
	};

	/**
	 * Set the value of the input field.
	 *
	 * @param {string} value The value to set on this input field.
	 *
	 * @returns {void}
	 */
	TextField.prototype.setValue = function( value ) {
		this._attributes.value = value;
	};

	/**
	 * Set the value of the input field.
	 *
	 * @param {string} className The class to set on this input field.
	 *
	 * @returns {void}
	 */
	TextField.prototype.setClassName = function( className ) {
		this._attributes.className = className;
	};

	return TextField;
}

module.exports = inputFieldFactory;

},{"../helpers/minimizeHtml":154,"lodash/object/defaults":214}],158:[function(require,module,exports){
var inputFieldFactory = require( "./inputField" );

module.exports = inputFieldFactory( require( "../templates" ).fields.text );

},{"../templates":161,"./inputField":157}],159:[function(require,module,exports){
var inputFieldFactory = require( "./inputField" );

module.exports = inputFieldFactory( require( "../templates" ).fields.textarea );

},{"../templates":161,"./inputField":157}],160:[function(require,module,exports){
var forEach = require( "lodash/collection/forEach" );
var addClass = require( "../helpers/addClass.js" );
var removeClass = require( "../helpers/removeClass.js" );

/**
 *
 * @param {Object}  bindings   The fields to bind.
 * @param {Object}  element    The element to bind the events to.
 * @param {boolean} alwaysOpen Whether the input form should always be open.
 * @constructor
 */
function PreviewEvents( bindings, element, alwaysOpen ) {
	this._bindings = bindings;
	this.element = element;
	this._alwaysOpen = alwaysOpen;
}

/**
 * Bind the events.
 *
 * @param {Object} editToggle  The edit toggle element.
 * @param {Object} closeEditor The button to close the editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.bindEvents = function( editToggle, closeEditor ) {
	if ( ! this._alwaysOpen ) {
		editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
		closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );
	}

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( this._bindings, this.bindInputEvent.bind( this ) );
};

/**
 * Binds the event for the input.
 *
 * @param {Object} binding The field to bind.
 *
 * @returns {void}
 */
PreviewEvents.prototype.bindInputEvent = function( binding ) {
	var previewElement = document.getElementsByClassName( binding.preview )[ 0 ];
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
};

/**
 * Opens the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.openEditor = function() {
	if ( this._alwaysOpen ) {
		return;
	}

	// Hide these elements.
	addClass( this.element.editToggle,       "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.formContainer, "snippet-editor--hidden" );
	removeClass( this.element.headingEditor, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.closeEditor = function() {
	if ( this._alwaysOpen ) {
		return;
	}

	// Hide these elements.
	addClass( this.element.formContainer,     "snippet-editor--hidden" );
	addClass( this.element.headingEditor,     "snippet-editor--hidden" );

	// Show these elements.
	removeClass( this.element.editToggle,     "snippet-editor--hidden" );

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.toggleEditor = function() {
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
PreviewEvents.prototype._updateFocusCarets = function() {
	var focusedCaretHook, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.caretHooks, function( element ) {
		removeClass( element, "snippet-editor__caret-hook--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedCaretHook = this.element.caretHooks[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		addClass( focusedCaretHook, "snippet-editor__caret-hook--focus" );
		addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateHoverCarets = function() {
	var hoveredCaretHook;

	forEach( this.element.caretHooks, function( element ) {
		removeClass( element, "snippet-editor__caret-hook--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredCaretHook = this.element.caretHooks[ this._currentHover ];

		addClass( hoveredCaretHook, "snippet-editor__caret-hook--hover" );
	}
};

module.exports = PreviewEvents;

},{"../helpers/addClass.js":149,"../helpers/removeClass.js":155,"lodash/collection/forEach":163}],161:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  var root = freeGlobal || freeSelf || Function('return this')();

  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.4';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"']/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
   * corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'facebookAuthor': {},
    'facebookPreview': {},
    'fields': {
        'button': {},
        'text': {},
        'textarea': {}
    },
    'imagePlaceholder': {},
    'twitterPreview': {}
  };

  templates['facebookAuthor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<span class="editable-preview__website--facebook-pipe">|</span> ' +
    __e( authorBy ) +
    '\n<span class="editable-preview__author--facebook">' +
    __e( authorName ) +
    '</span>\n';

    }
    return __p
  };

  templates['facebookPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class="editable-preview editable-preview--facebook">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye editable-preview__heading ">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--facebook">\n		<div class="social-preview__inner social-preview__inner--facebook">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--facebook snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--facebook">\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__title--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-title">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__description--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-url">\n						' +
    __e( rendered.baseUrl ) +
    '\n						<span class="editable-preview__value--facebook-author"></span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit editable-preview__heading">' +
    __e( i18n.snippetEditor ) +
    '</h3>\n\n	<div class="snippet-editor__form">\n\n	</div>\n</div>\n';

    }
    return __p
  };

  templates['fields']['button'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<button\n	type="button"\n	';
     if (className) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n>\n	' +
    __e( value ) +
    '\n</button>';

    }
    return __p
  };

  templates['fields']['text'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<label';
     if ( id ) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if ( labelClassName ) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>';

    if ( id ) {
    __p +=
    __e( title ) +
    '</label>';
     } else {
    __p +=
    __e( title );
     }
    __p += '\n	<span class="snippet-editor__caret-hook"\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '__caret-hook"';
     }
    __p += '\n	></span>\n	<input type="text"\n		';
     if ( value ) {
    __p += 'value="' +
    __e( value ) +
    '"';
     }
    __p += '\n		';
     if ( placeholder ) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		';
     if ( className ) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		';
     if ( name ) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	/>\n';
     if ( ! id ) {
    __p += '</label>';
     }
    __p += '\n';

    }
    return __p
  };

  templates['fields']['textarea'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<label';
     if ( id ) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if ( labelClassName ) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>';

    if ( id ) {
    __p +=
    __e( title ) +
    '</label>';
     } else {
    __p +=
    __e( title );
     }
    __p += '\n	<span class="snippet-editor__caret-hook"\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '__caret-hook"';
     }
    __p += '\n	></span>\n	<textarea\n		';
     if ( placeholder ) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		';
     if ( className ) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		';
     if ( name ) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	>\n		';
     if (value) {
    __p +=
    __e( value );
     }
    __p += '\n	</textarea>\n';
     if ( ! id ) {
    __p += '</label>';
     }
    __p += '\n';

    }
    return __p
  };

  templates['imagePlaceholder'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class=\'' +
    __e( className ) +
    '\'>' +
    __e( placeholder ) +
    '</div>';

    }
    return __p
  };

  templates['twitterPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class="editable-preview editable-preview--twitter">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye editable-preview__heading">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--twitter">\n		<div class="social-preview__inner social-preview__inner--twitter">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--twitter snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--twitter">\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__title--twitter snippet_container" >\n					<div class="editable-preview__value editable-preview__value--twitter-title ">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__description--twitter twitter-preview__description snippet_container">\n					<div class="editable-preview__value editable-preview__value--twitter-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--twitter snippet_container">\n					<div class="editable-preview__value ">\n						' +
    __e( rendered.baseUrl ) +
    '\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit editable-preview__heading">' +
    __e( i18n.snippetEditor ) +
    '</h3>\n\n	<div class="snippet-editor__form">\n\n	</div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeModule) {
    (freeModule.exports = templates).templates = templates;
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],162:[function(require,module,exports){
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
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext( "yoast-social-previews", "Modify your %1$s description by editing it right here" ),
			"Twitter"
		),
		imageUrl: "",
	};

	defaultsDeep( opts, twitterDefaults );

	if ( ! isElement( opts.targetElement ) ) {
		throw new Error( "The Twitter preview requires a valid target element" );
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
			/** translators: %1$s expands to Twitter */
			edit: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "Edit %1$s preview" ), "Twitter" ),
			/** translators: %1$s expands to Twitter */
			snippetPreview: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s preview" ), "Twitter" ),
			/** translators: %1$s expands to Twitter */
			snippetEditor: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s editor" ), "Twitter" ),
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
				/** translators: %1$s expands to Twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s title" ),
				"Twitter"
			),
			labelClassName: "snippet-editor__label",
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "twitter-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.sprintf(
				/** translators: %1$s expands to Twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s description" ),
				"Twitter"
			),
			labelClassName: "snippet-editor__label",
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "twitter-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.sprintf(
				/** translators: %1$s expands to Twitter */
				this.i18n.dgettext( "yoast-social-previews", "%1$s image" ),
				"Twitter"
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
					/** translators: %1$s expands to Twitter */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s title by editing the snippet below." ),
					"Twitter"
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
					 /** translators: %1$s expands to Twitter */
					 this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s description by editing the snippet below." ),
					 "Twitter"
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

},{"./element/imagePlaceholder":146,"./element/input":147,"./helpers/bem/addModifier":150,"./helpers/bem/removeModifier":152,"./helpers/renderDescription":156,"./inputs/textInput":158,"./inputs/textarea":159,"./preview/events":160,"./templates":161,"jed":7,"lodash/lang/clone":201,"lodash/lang/isElement":204,"lodash/object/defaultsDeep":215}],163:[function(require,module,exports){
var arrayEach = require('../internal/arrayEach'),
    baseEach = require('../internal/baseEach'),
    createForEach = require('../internal/createForEach');

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"../internal/arrayEach":168,"../internal/baseEach":174,"../internal/createForEach":187}],164:[function(require,module,exports){
var getNative = require('../internal/getNative');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internal/getNative":189}],165:[function(require,module,exports){
var isObject = require('../lang/isObject'),
    now = require('../date/now');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it's invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

module.exports = debounce;

},{"../date/now":164,"../lang/isObject":208}],166:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],167:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],168:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],169:[function(require,module,exports){
/**
 * Used by `_.defaults` to customize its `_.assign` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function assignDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : objectValue;
}

module.exports = assignDefaults;

},{}],170:[function(require,module,exports){
var keys = require('../object/keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = assignWith;

},{"../object/keys":216}],171:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":216,"./baseCopy":173}],172:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    initCloneArray = require('./initCloneArray'),
    initCloneByTag = require('./initCloneByTag'),
    initCloneObject = require('./initCloneObject'),
    isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

module.exports = baseClone;

},{"../lang/isArray":203,"../lang/isObject":208,"./arrayCopy":167,"./arrayEach":168,"./baseAssign":171,"./baseForOwn":177,"./initCloneArray":190,"./initCloneByTag":191,"./initCloneObject":192}],173:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],174:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":177,"./createBaseEach":184}],175:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":185}],176:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keysIn = require('../object/keysIn');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

module.exports = baseForIn;

},{"../object/keysIn":217,"./baseFor":175}],177:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":216,"./baseFor":175}],178:[function(require,module,exports){
var arrayEach = require('./arrayEach'),
    baseMergeDeep = require('./baseMergeDeep'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike'),
    isTypedArray = require('../lang/isTypedArray'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.merge` without support for argument juggling,
 * multiple sources, and `this` binding `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {Object} Returns `object`.
 */
function baseMerge(object, source, customizer, stackA, stackB) {
  if (!isObject(object)) {
    return object;
  }
  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
      props = isSrcArr ? undefined : keys(source);

  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObjectLike(srcValue)) {
      stackA || (stackA = []);
      stackB || (stackB = []);
      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
    }
    else {
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
      }
      if ((result !== undefined || (isSrcArr && !(key in object))) &&
          (isCommon || (result === result ? (result !== value) : (value === value)))) {
        object[key] = result;
      }
    }
  });
  return object;
}

module.exports = baseMerge;

},{"../lang/isArray":203,"../lang/isObject":208,"../lang/isTypedArray":211,"../object/keys":216,"./arrayEach":168,"./baseMergeDeep":179,"./isArrayLike":193,"./isObjectLike":197}],179:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isPlainObject = require('../lang/isPlainObject'),
    isTypedArray = require('../lang/isTypedArray'),
    toPlainObject = require('../lang/toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
  var length = stackA.length,
      srcValue = source[key];

  while (length--) {
    if (stackA[length] == srcValue) {
      object[key] = stackB[length];
      return;
    }
  }
  var value = object[key],
      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
      isCommon = result === undefined;

  if (isCommon) {
    result = srcValue;
    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
      result = isArray(value)
        ? value
        : (isArrayLike(value) ? arrayCopy(value) : []);
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      result = isArguments(value)
        ? toPlainObject(value)
        : (isPlainObject(value) ? value : {});
    }
    else {
      isCommon = false;
    }
  }
  // Add the source value to the stack of traversed objects and associate
  // it with its merged value.
  stackA.push(srcValue);
  stackB.push(result);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
  } else if (result === result ? (result !== value) : (value === value)) {
    object[key] = result;
  }
}

module.exports = baseMergeDeep;

},{"../lang/isArguments":202,"../lang/isArray":203,"../lang/isPlainObject":209,"../lang/isTypedArray":211,"../lang/toPlainObject":212,"./arrayCopy":167,"./isArrayLike":193}],180:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],181:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":219}],182:[function(require,module,exports){
(function (global){
/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

module.exports = bufferClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],183:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall'),
    restParam = require('../function/restParam');

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../function/restParam":166,"./bindCallback":181,"./isIterateeCall":195}],184:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":188,"./isLength":196,"./toObject":200}],185:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":200}],186:[function(require,module,exports){
var restParam = require('../function/restParam');

/**
 * Creates a `_.defaults` or `_.defaultsDeep` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Function} Returns the new defaults function.
 */
function createDefaults(assigner, customizer) {
  return restParam(function(args) {
    var object = args[0];
    if (object == null) {
      return object;
    }
    args.push(customizer);
    return assigner.apply(undefined, args);
  });
}

module.exports = createDefaults;

},{"../function/restParam":166}],187:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isArray = require('../lang/isArray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

module.exports = createForEach;

},{"../lang/isArray":203,"./bindCallback":181}],188:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":180}],189:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":207}],190:[function(require,module,exports){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],191:[function(require,module,exports){
var bufferClone = require('./bufferClone');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

module.exports = initCloneByTag;

},{"./bufferClone":182}],192:[function(require,module,exports){
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

module.exports = initCloneObject;

},{}],193:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":188,"./isLength":196}],194:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],195:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":208,"./isArrayLike":193,"./isIndex":194}],196:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],197:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],198:[function(require,module,exports){
var merge = require('../object/merge');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function mergeDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
}

module.exports = mergeDefaults;

},{"../object/merge":218}],199:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":202,"../lang/isArray":203,"../object/keysIn":217,"./isIndex":194,"./isLength":196}],200:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":208}],201:[function(require,module,exports){
var baseClone = require('../internal/baseClone'),
    bindCallback = require('../internal/bindCallback'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it's
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with up to three argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  return typeof customizer == 'function'
    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 3))
    : baseClone(value, isDeep);
}

module.exports = clone;

},{"../internal/baseClone":172,"../internal/bindCallback":181,"../internal/isIterateeCall":195}],202:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":193,"../internal/isObjectLike":197}],203:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":189,"../internal/isLength":196,"../internal/isObjectLike":197}],204:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"../internal/isObjectLike":197,"./isPlainObject":209}],205:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('../internal/isArrayLike'),
    isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike'),
    isString = require('./isString'),
    keys = require('../object/keys');

/**
 * Checks if `value` is empty. A value is considered empty unless it's an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !value.length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"../internal/isArrayLike":193,"../internal/isObjectLike":197,"../object/keys":216,"./isArguments":202,"./isArray":203,"./isFunction":206,"./isString":210}],206:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":208}],207:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":197,"./isFunction":206}],208:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],209:[function(require,module,exports){
var baseForIn = require('../internal/baseForIn'),
    isArguments = require('./isArguments'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * **Note:** This method assumes objects created by the `Object` constructor
 * have no inherited enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  var Ctor;

  // Exit early for non `Object` objects.
  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  // IE < 9 iterates inherited properties before own properties. If the first
  // iterated property is an object's own property then there are no inherited
  // enumerable properties.
  var result;
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  baseForIn(value, function(subValue, key) {
    result = key;
  });
  return result === undefined || hasOwnProperty.call(value, result);
}

module.exports = isPlainObject;

},{"../internal/baseForIn":176,"../internal/isObjectLike":197,"./isArguments":202}],210:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":197}],211:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":196,"../internal/isObjectLike":197}],212:[function(require,module,exports){
var baseCopy = require('../internal/baseCopy'),
    keysIn = require('../object/keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable
 * properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return baseCopy(value, keysIn(value));
}

module.exports = toPlainObject;

},{"../internal/baseCopy":173,"../object/keysIn":217}],213:[function(require,module,exports){
var assignWith = require('../internal/assignWith'),
    baseAssign = require('../internal/baseAssign'),
    createAssigner = require('../internal/createAssigner');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it's invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"../internal/assignWith":170,"../internal/baseAssign":171,"../internal/createAssigner":183}],214:[function(require,module,exports){
var assign = require('./assign'),
    assignDefaults = require('../internal/assignDefaults'),
    createDefaults = require('../internal/createDefaults');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = createDefaults(assign, assignDefaults);

module.exports = defaults;

},{"../internal/assignDefaults":169,"../internal/createDefaults":186,"./assign":213}],215:[function(require,module,exports){
var createDefaults = require('../internal/createDefaults'),
    merge = require('./merge'),
    mergeDefaults = require('../internal/mergeDefaults');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = createDefaults(merge, mergeDefaults);

module.exports = defaultsDeep;

},{"../internal/createDefaults":186,"../internal/mergeDefaults":198,"./merge":218}],216:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":189,"../internal/isArrayLike":193,"../internal/shimKeys":199,"../lang/isObject":208}],217:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":194,"../internal/isLength":196,"../lang/isArguments":202,"../lang/isArray":203,"../lang/isObject":208}],218:[function(require,module,exports){
var baseMerge = require('../internal/baseMerge'),
    createAssigner = require('../internal/createAssigner');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * overwrite property assignments of previous sources. If `customizer` is
 * provided it's invoked to produce the merged values of the destination and
 * source properties. If `customizer` returns `undefined` merging is handled
 * by the method instead. The `customizer` is bound to `thisArg` and invoked
 * with five arguments: (objectValue, sourceValue, key, object, source).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 *
 * // using a customizer callback
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(object, other, function(a, b) {
 *   if (_.isArray(a)) {
 *     return a.concat(b);
 *   }
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var merge = createAssigner(baseMerge);

module.exports = merge;

},{"../internal/baseMerge":178,"../internal/createAssigner":183}],219:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],220:[function(require,module,exports){
"use strict";

var blockElements = ["address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];
var inlineElements = ["b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button", "input", "label", "select", "textarea"];
var blockElementsRegex = new RegExp("^(" + blockElements.join("|") + ")$", "i");
var inlineElementsRegex = new RegExp("^(" + inlineElements.join("|") + ")$", "i");
var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>$", "i");
var blockElementEndRegex = new RegExp("^</(" + blockElements.join("|") + ")[^>]*?>$", "i");
var inlineElementStartRegex = new RegExp("^<(" + inlineElements.join("|") + ")[^>]*>$", "i");
var inlineElementEndRegex = new RegExp("^</(" + inlineElements.join("|") + ")[^>]*>$", "i");
var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;
var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;
var commentRegex = /<!--(.|[\r\n])*?-->/g;
var core = require("tokenizer2/core");
var forEach = require("lodash/forEach");
var memoize = require("lodash/memoize");
var tokens = [];
var htmlBlockTokenizer;
/**
 * Creates a tokenizer to tokenize HTML into blocks.
 *
 * @returns {void}
 */
function createTokenizer() {
    tokens = [];
    htmlBlockTokenizer = core(function (token) {
        tokens.push(token);
    });
    htmlBlockTokenizer.addRule(contentRegex, "content");
    htmlBlockTokenizer.addRule(greaterThanContentRegex, "greater-than-sign-content");
    htmlBlockTokenizer.addRule(blockElementStartRegex, "block-start");
    htmlBlockTokenizer.addRule(blockElementEndRegex, "block-end");
    htmlBlockTokenizer.addRule(inlineElementStartRegex, "inline-start");
    htmlBlockTokenizer.addRule(inlineElementEndRegex, "inline-end");
    htmlBlockTokenizer.addRule(otherElementStartRegex, "other-element-start");
    htmlBlockTokenizer.addRule(otherElementEndRegex, "other-element-end");
}
/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement(htmlElementName) {
    return blockElementsRegex.test(htmlElementName);
}
/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement(htmlElementName) {
    return inlineElementsRegex.test(htmlElementName);
}
/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks(text) {
    var blocks = [],
        depth = 0,
        blockStartTag = "",
        currentBlock = "",
        blockEndTag = "";
    // Remove all comments because it is very hard to tokenize them.
    text = text.replace(commentRegex, "");
    createTokenizer();
    htmlBlockTokenizer.onText(text);
    htmlBlockTokenizer.end();
    forEach(tokens, function (token, i) {
        var nextToken = tokens[i + 1];
        switch (token.type) {
            case "content":
            case "greater-than-sign-content":
            case "inline-start":
            case "inline-end":
            case "other-tag":
            case "other-element-start":
            case "other-element-end":
            case "greater than sign":
                if (!nextToken || depth === 0 && (nextToken.type === "block-start" || nextToken.type === "block-end")) {
                    currentBlock += token.src;
                    blocks.push(currentBlock);
                    blockStartTag = "";
                    currentBlock = "";
                    blockEndTag = "";
                } else {
                    currentBlock += token.src;
                }
                break;
            case "block-start":
                if (depth !== 0) {
                    if (currentBlock.trim() !== "") {
                        blocks.push(currentBlock);
                    }
                    currentBlock = "";
                    blockEndTag = "";
                }
                depth++;
                blockStartTag = token.src;
                break;
            case "block-end":
                depth--;
                blockEndTag = token.src;
                /*
                 * We try to match the most deep blocks so discard any other blocks that have been started but not
                 * finished.
                 */
                if ("" !== blockStartTag && "" !== blockEndTag) {
                    blocks.push(blockStartTag + currentBlock + blockEndTag);
                } else if ("" !== currentBlock.trim()) {
                    blocks.push(currentBlock);
                }
                blockStartTag = "";
                currentBlock = "";
                blockEndTag = "";
                break;
        }
        // Handles HTML with too many closing tags.
        if (depth < 0) {
            depth = 0;
        }
    });
    return blocks;
}
module.exports = {
    blockElements: blockElements,
    inlineElements: inlineElements,
    isBlockElement: isBlockElement,
    isInlineElement: isInlineElement,
    getBlocks: memoize(getBlocks)
};



},{"lodash/forEach":122,"lodash/memoize":138,"tokenizer2/core":144}],221:[function(require,module,exports){
"use strict";
/** @module stringProcessing/imageInText */

var matchStringWithRegex = require("./matchStringWithRegex.js");
/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function (text) {
  return matchStringWithRegex(text, "<img(?:[^>]+)?>");
};



},{"./matchStringWithRegex.js":222}],222:[function(require,module,exports){
"use strict";
/** @module stringProcessing/matchStringWithRegex */
/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */

module.exports = function (text, regexString) {
    var regex = new RegExp(regexString, "ig");
    var matches = text.match(regex);
    if (matches === null) {
        matches = [];
    }
    return matches;
};



},{}],223:[function(require,module,exports){
"use strict";
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require("../stringProcessing/stripSpaces.js");
var blockElements = require("../helpers/html.js").blockElements;
var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>", "i");
var blockElementEndRegex = new RegExp("</(" + blockElements.join("|") + ")[^>]*?>$", "i");
/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function stripIncompleteTags(text) {
    text = text.replace(/^(<\/([^>]+)>)+/i, "");
    text = text.replace(/(<([^\/>]+)>)+$/i, "");
    return text;
};
/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
var stripBlockTagsAtStartEnd = function stripBlockTagsAtStartEnd(text) {
    text = text.replace(blockElementStartRegex, "");
    text = text.replace(blockElementEndRegex, "");
    return text;
};
/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function stripFullTags(text) {
    text = text.replace(/(<([^>]+)>)/ig, " ");
    text = stripSpaces(text);
    return text;
};
module.exports = {
    stripFullTags: stripFullTags,
    stripIncompleteTags: stripIncompleteTags,
    stripBlockTagsAtStartEnd: stripBlockTagsAtStartEnd
};



},{"../helpers/html.js":220,"../stringProcessing/stripSpaces.js":224}],224:[function(require,module,exports){
"use strict";
/** @module stringProcessing/stripSpaces */
/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */

module.exports = function (text) {
    // Replace multiple spaces with single space
    text = text.replace(/\s{2,}/g, " ");
    // Replace spaces followed by periods with only the period.
    text = text.replace(/\s\./g, ".");
    // Remove first/last character if space
    text = text.replace(/^\s+|\s+$/g, "");
    return text;
};



},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlci5qcyIsIi4uL2pzL3NyYy9hbmFseXNpcy9nZXRMMTBuT2JqZWN0LmpzIiwiLi4vanMvc3JjL2FuYWx5c2lzL2dldFRpdGxlUGxhY2Vob2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVW5kZWZpbmVkLmpzIiwiYXNzZXRzL2pzL3NyYy9oZWxwUGFuZWwuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LXByZW1pdW0tc29jaWFsLXByZXZpZXcuanMiLCJub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fSGFzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N0YWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1dlYWtNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hZGRNYXBFbnRyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZFNldEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25Jbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldEFsbEtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUJ1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL3Rva2VuaXplcjIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZWxlbWVudC9pbnB1dC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZmFjZWJvb2tQcmV2aWV3LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2FkZENsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9hZGRNb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9iZW0vYWRkTW9kaWZpZXJUb0NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9pbWFnZURpc3BsYXlNb2RlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL21pbmltaXplSHRtbC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW5kZXJEZXNjcmlwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL2lucHV0RmllbGQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0SW5wdXQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0YXJlYS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvcHJldmlldy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3RlbXBsYXRlcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvdHdpdHRlclByZXZpZXcuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvY29sbGVjdGlvbi9mb3JFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2RhdGUvbm93LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2Z1bmN0aW9uL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2Z1bmN0aW9uL3Jlc3RQYXJhbS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUNvcHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYXJyYXlFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbkRlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbldpdGguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQ2xvbmUuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9ySW4uanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZvck93bi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlTWVyZ2UuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmluZENhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2J1ZmZlckNsb25lLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VGb3IuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlRm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9tZXJnZURlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3NoaW1LZXlzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3RvT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvY2xvbmUuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0VsZW1lbnQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1BsYWluT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNTdHJpbmcuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy90b1BsYWluT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXAuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3QvbWVyZ2UuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvdXRpbGl0eS9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9oZWxwZXJzL2h0bWwuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL21hdGNoU3RyaW5nV2l0aFJlZ2V4LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLGdCQUFnQixRQUFTLGlCQUFULENBQXBCOztBQUVBOzs7OztBQUtBLFNBQVMseUJBQVQsR0FBcUM7QUFDcEMsS0FBSSx5QkFBeUIsRUFBN0I7QUFDQSxLQUFJLGFBQWEsZUFBakI7O0FBRUEsS0FBSyxVQUFMLEVBQWtCO0FBQ2pCLDJCQUF5QixXQUFXLGlCQUFwQztBQUNBOztBQUVELFFBQU8sc0JBQVA7QUFDQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUIseUJBQWpCOzs7OztBQ2xCQSxJQUFJLGNBQWMsUUFBUyxvQkFBVCxDQUFsQjs7QUFFQTs7Ozs7QUFLQSxTQUFTLGFBQVQsR0FBeUI7QUFDeEIsS0FBSSxhQUFhLElBQWpCOztBQUVBLEtBQUssQ0FBRSxZQUFhLE9BQU8sb0JBQXBCLENBQVAsRUFBb0Q7QUFDbkQsZUFBYSxPQUFPLG9CQUFwQjtBQUNBLEVBRkQsTUFFTyxJQUFLLENBQUUsWUFBYSxPQUFPLG9CQUFwQixDQUFQLEVBQW9EO0FBQzFELGVBQWEsT0FBTyxvQkFBcEI7QUFDQTs7QUFFRCxRQUFPLFVBQVA7QUFDQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakI7Ozs7O0FDbkJBLElBQUksZ0JBQWdCLFFBQVMsaUJBQVQsQ0FBcEI7O0FBRUE7Ozs7O0FBS0EsU0FBUyxtQkFBVCxHQUErQjtBQUM5QixLQUFJLG1CQUFtQixFQUF2QjtBQUNBLEtBQUksYUFBYSxlQUFqQjs7QUFFQSxLQUFLLFVBQUwsRUFBa0I7QUFDakIscUJBQW1CLFdBQVcsY0FBOUI7QUFDQTs7QUFFRCxLQUFLLHFCQUFxQixFQUExQixFQUErQjtBQUM5QixxQkFBbUIsMEJBQW5CO0FBQ0E7O0FBRUQsUUFBTyxnQkFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQixtQkFBakI7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEJBOztBQUVBOzs7Ozs7OztBQVFBLFNBQVMsVUFBVCxDQUFxQixJQUFyQixFQUEyQixRQUEzQixFQUFzQztBQUNyQyxTQUFPLGdHQUNOLGlCQURNLEdBQ2MsUUFEZCxHQUN5QixxQ0FEekIsR0FDaUUsSUFEakUsR0FDd0Usa0JBRC9FO0FBRUE7O0FBRUQ7Ozs7Ozs7O0FBUUEsU0FBUyxRQUFULENBQW1CLElBQW5CLEVBQXlCLEVBQXpCLEVBQThCO0FBQzdCLFNBQU8sWUFBWSxFQUFaLEdBQWlCLDZCQUFqQixHQUFpRCxJQUFqRCxHQUF3RCxNQUEvRDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQjtBQUNoQixjQUFZLFVBREk7QUFFaEIsWUFBVTtBQUZNLENBQWpCOzs7OztBQzNCQTtBQUNBOztBQUVBLElBQUksWUFBWSxRQUFTLDBDQUFULENBQWhCO0FBQ0EsSUFBSSxZQUFZLFFBQVMsYUFBVCxDQUFoQjtBQUNBLElBQUksc0JBQXNCLFFBQVMsaURBQVQsQ0FBMUI7QUFDQSxJQUFJLDRCQUE0QixRQUFTLHVEQUFULENBQWhDOztBQUVBLElBQUksWUFBWSxRQUFTLGlCQUFULENBQWhCO0FBQ0EsSUFBSSxRQUFRLFFBQVMsY0FBVCxDQUFaO0FBQ0EsSUFBSSxVQUFVLFFBQVMsZ0JBQVQsQ0FBZDtBQUNBLElBQUksT0FBTyxRQUFTLFlBQVQsQ0FBWDtBQUNBLElBQUksY0FBYyxRQUFTLG9CQUFULENBQWxCOztBQUVBLElBQUksTUFBTSxRQUFTLEtBQVQsQ0FBVjtBQUNBLElBQUksaUJBQWlCLFFBQVMsdUJBQVQsQ0FBckI7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7OztBQUlBLEtBQUksZ0JBQWdCO0FBQ25CLFdBQVMsRUFEVTtBQUVuQixZQUFVO0FBRlMsRUFBcEI7O0FBS0EsS0FBSSx1QkFBdUIsSUFBM0I7O0FBRUEsS0FBSSxrQkFBa0IsZUFBZSxlQUFyQztBQUNBLEtBQUksaUJBQWlCLGVBQWUsY0FBcEM7O0FBRUEsS0FBSSxlQUFKLEVBQXFCLGNBQXJCOztBQUVBLEtBQUksZUFBZSxtQkFBbUIsSUFBdEM7O0FBRUEsS0FBSSxPQUFPLElBQUksR0FBSixDQUFTLHVCQUF3QixhQUFhLE9BQXJDLENBQVQsQ0FBWDtBQUNBLEtBQUksZUFBZSxFQUFuQjs7QUFFQSxLQUFJLG1CQUFtQixPQUF2Qjs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxVQUFTLHNCQUFULENBQWlDLFFBQWpDLEVBQTJDLFdBQTNDLEVBQXdELFlBQXhELEVBQXNFLGFBQXRFLEVBQXFGLG1CQUFyRixFQUEyRztBQUMxRztBQUNBLE1BQUksd0JBQXdCLEdBQUcsS0FBSCxDQUFTLE1BQVQsQ0FBZ0IsVUFBaEIsR0FBNkIsR0FBRyxLQUFILENBQVU7QUFDbEUsVUFBTyxtQkFBbUIsWUFEd0M7QUFFbEUsV0FBUSxFQUFFLE1BQU0sbUJBQW1CLFlBQTNCLEVBRjBEO0FBR2xFLGFBQVU7QUFId0QsR0FBVixDQUF6RDtBQUtBOztBQUVBLHdCQUFzQixFQUF0QixDQUEwQixRQUExQixFQUFvQyxZQUFXO0FBQzlDLE9BQUksYUFBYSxzQkFBc0IsS0FBdEIsR0FBOEIsR0FBOUIsQ0FBbUMsV0FBbkMsRUFBaUQsS0FBakQsR0FBeUQsTUFBekQsRUFBakI7O0FBRUE7QUFDQSxZQUFTLEdBQVQsQ0FBYyxXQUFXLEdBQXpCOztBQUVBOztBQUVBLEtBQUcsWUFBSCxFQUFrQixJQUFsQjtBQUNBLEdBVEQ7O0FBV0EsSUFBRyxZQUFILEVBQWtCLEtBQWxCLENBQXlCLFVBQVUsR0FBVixFQUFnQjtBQUN4QyxPQUFJLGNBQUo7O0FBRUE7QUFDQSxZQUFTLEdBQVQsQ0FBYyxFQUFkOztBQUVBOztBQUVBLEtBQUcsWUFBSCxFQUFrQixJQUFsQjtBQUNBLEdBVEQ7O0FBV0EsSUFBRyxXQUFILEVBQWlCLEtBQWpCLENBQXdCLFVBQVUsR0FBVixFQUFnQjtBQUN2QyxPQUFJLGNBQUo7QUFDQSx5QkFBc0IsSUFBdEI7QUFDQSxHQUhEOztBQUtBLElBQUcsbUJBQUgsRUFBeUIsRUFBekIsQ0FBNkIsT0FBN0IsRUFBc0MsVUFBVSxXQUFWLEVBQXdCO0FBQzdELHlCQUFzQixJQUF0QjtBQUNBLEdBRkQ7QUFHQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZUFBVCxDQUEwQixPQUExQixFQUFvQztBQUNuQyxNQUFLLE9BQU8sR0FBRyxLQUFWLEtBQW9CLFdBQXpCLEVBQXVDO0FBQ3RDO0FBQ0E7O0FBRUQsTUFBSSxXQUFXLEVBQUcsUUFBUSxPQUFSLENBQWdCLGFBQW5CLEVBQW1DLElBQW5DLENBQXlDLDZCQUF6QyxDQUFmOztBQUVBLE1BQUksWUFBWSxFQUFHLGFBQUgsQ0FBaEI7QUFDQSxZQUFVLFdBQVYsQ0FBdUIsUUFBdkI7O0FBRUEsTUFBSSxtQkFBbUIsb0JBQXFCLE9BQXJCLENBQXZCOztBQUVBLE1BQUksZUFBa0IsT0FBUSxRQUFSLEVBQW1CLElBQW5CLENBQXlCLElBQXpCLENBQXRCO0FBQ0EsTUFBSSxnQkFBa0IsZUFBZSxTQUFyQztBQUNBLE1BQUksa0JBQWtCLGlCQUFpQixhQUFqQixHQUFpQyxJQUFqQyxHQUNyQixnRkFEcUIsR0FDOEQsZ0JBRDlELEdBQ2lGLFdBRHZHOztBQUdBLE1BQUksaUJBQW1CLGVBQWUsZ0JBQXRDO0FBQ0EsTUFBSSxtQkFBbUIsaUJBQWlCLGNBQWpCLEdBQWtDLGtCQUFsQyxHQUN0QixtREFEc0IsR0FDZ0MsbUJBQW1CLGlCQURuRCxHQUN1RSxXQUQ5Rjs7QUFHQSxJQUFHLFNBQUgsRUFBZSxNQUFmLENBQXVCLGVBQXZCO0FBQ0EsSUFBRyxTQUFILEVBQWUsTUFBZixDQUF1QixnQkFBdkI7O0FBRUEsV0FBUyxJQUFUO0FBQ0EsTUFBSyxTQUFTLEdBQVQsT0FBbUIsRUFBeEIsRUFBNkI7QUFDNUIsS0FBRyxNQUFNLGNBQVQsRUFBMEIsSUFBMUI7QUFDQTs7QUFFRCx5QkFDQyxRQURELEVBRUMsTUFBTSxhQUZQLEVBR0MsTUFBTSxjQUhQLEVBSUMsUUFBUSxhQUFSLENBQXNCLElBQXRCLENBQTRCLE9BQTVCLENBSkQsRUFLQyxFQUFHLFFBQVEsT0FBUixDQUFnQixTQUFuQixFQUErQixJQUEvQixDQUFxQywwQkFBckMsQ0FMRDtBQU9BOztBQUVEOzs7OztBQUtBLFVBQVMsY0FBVCxHQUEwQjtBQUN6QjtBQUNBLE1BQUssRUFBRyxVQUFILEVBQWdCLE1BQWhCLEdBQXlCLENBQTlCLEVBQWtDO0FBQ2pDLFVBQU8sTUFBUDtBQUNBOztBQUVEO0FBQ0EsTUFBSyxFQUFHLG9CQUFILEVBQTBCLE1BQTFCLEdBQW1DLENBQXhDLEVBQTRDO0FBQzNDLFVBQU8sTUFBUDtBQUNBOztBQUVELFNBQU8sRUFBUDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLFdBQVQsR0FBdUI7QUFDdEIsVUFBUSxnQkFBUjtBQUNDLFFBQUssTUFBTDtBQUNDLFdBQU8sYUFBUDtBQUNELFFBQUssTUFBTDtBQUNDLFdBQU8sT0FBUDtBQUNEO0FBQ0MsV0FBTyxFQUFQO0FBTkY7QUFRQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGVBQVQsR0FBMkI7QUFDMUIsVUFBUyxnQkFBVDtBQUNDLFFBQUssTUFBTDtBQUNDLFdBQU8sU0FBUDtBQUNELFFBQUssTUFBTDtBQUNDLFdBQU8sYUFBUDtBQUNEO0FBQ0MsV0FBTyxFQUFQO0FBTkY7QUFRQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsNEJBQVQsQ0FBdUMsbUJBQXZDLEVBQTRELFdBQTVELEVBQTBFO0FBQ3pFLHNCQUFvQixNQUFwQixDQUE0QixjQUFjLFdBQWQsR0FBNEIsVUFBeEQ7QUFDQTs7QUFFRDs7OztBQUlBLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsU0FBTyxFQUFHLHVCQUFILEVBQTZCLEdBQTdCLEVBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLCtCQUFULEdBQTJDO0FBQzFDLE1BQUksY0FBYyxvQkFBbEI7O0FBRUEsTUFBSyxPQUFPLFdBQVosRUFBMEI7QUFDekIsaUJBQWMsMkJBQWQ7QUFDQTs7QUFFRCxTQUFPLFdBQVA7QUFDQTs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBLFVBQVMsb0JBQVQsQ0FBK0IsYUFBL0IsRUFBOEMsV0FBOUMsRUFBNEQ7QUFDM0QsTUFBSSxtQkFBbUIscUJBQXZCO0FBQ0EsTUFBSSx5QkFBeUIsaUNBQTdCOztBQUVBLE1BQUksT0FBTztBQUNWLGtCQUFlLEVBQUcsYUFBSCxFQUFtQixHQUFuQixDQUF3QixDQUF4QixDQURMO0FBRVYsU0FBTTtBQUNMLFdBQU8sRUFBRyxNQUFNLFdBQU4sR0FBb0IsUUFBdkIsRUFBa0MsR0FBbEMsRUFERjtBQUVMLGlCQUFhLEVBQUcsTUFBTSxXQUFOLEdBQW9CLGNBQXZCLEVBQXdDLEdBQXhDLEVBRlI7QUFHTCxjQUFVLEVBQUcsTUFBTSxXQUFOLEdBQW9CLFFBQXZCLEVBQWtDLEdBQWxDO0FBSEwsSUFGSTtBQU9WLFlBQVMsbUJBQW1CLE9BUGxCO0FBUVYsY0FBVztBQUNWLHlCQUFxQiw2QkFBVSxJQUFWLEVBQWlCO0FBQ3JDLE9BQUcsTUFBTSxXQUFOLEdBQW9CLFFBQXZCLEVBQWtDLEdBQWxDLENBQXVDLEtBQUssS0FBNUM7QUFDQSxPQUFHLE1BQU0sV0FBTixHQUFvQixjQUF2QixFQUF3QyxHQUF4QyxDQUE2QyxLQUFLLFdBQWxEO0FBQ0EsT0FBRyxNQUFNLFdBQU4sR0FBb0IsUUFBdkIsRUFBa0MsR0FBbEMsQ0FBdUMsS0FBSyxRQUE1Qzs7QUFFQTtBQUNBLE9BQUcsbUJBQUgsRUFBeUIsT0FBekIsQ0FBa0MsYUFBbEM7O0FBRUEsU0FBSyxLQUFLLFFBQUwsS0FBa0IsRUFBdkIsRUFBNEI7QUFDM0IsVUFBSSxlQUFlLGNBQWMsSUFBZCxDQUFvQixJQUFwQixFQUEyQixPQUEzQixDQUFvQyxTQUFwQyxFQUErQyxFQUEvQyxDQUFuQjtBQUNBLDJCQUFzQixZQUF0QixFQUFvQyxtQkFBbUIsYUFBdkQ7QUFDQTs7QUFFRCxZQUFRLGFBQVIsRUFBd0IsSUFBeEIsQ0FBOEIsbUJBQTlCLEVBQW9ELE9BQXBELENBQTZELGFBQTdEO0FBQ0EsWUFBUSxhQUFSLEVBQXdCLElBQXhCLENBQThCLG1CQUE5QixFQUFvRCxPQUFwRCxDQUE2RCxtQkFBN0Q7QUFDQSxLQWhCUztBQWlCVixvQkFBZ0Isd0JBQVUsUUFBVixFQUFxQjtBQUNwQyxTQUFLLGFBQWEsRUFBbEIsRUFBdUI7QUFDdEIsaUJBQVcsaUJBQWtCLEVBQWxCLENBQVg7QUFDQTs7QUFFRCxZQUFPLFFBQVA7QUFDQSxLQXZCUztBQXdCVixpQkFBYSxxQkFBVSxLQUFWLEVBQWtCO0FBQzlCLFNBQUssWUFBWSxPQUFaLENBQXFCLFNBQXJCLElBQW1DLENBQUMsQ0FBekMsRUFBNkM7QUFDNUMsVUFBSyxVQUFVLEVBQUcsdUJBQUgsRUFBNkIsSUFBN0IsQ0FBbUMsYUFBbkMsQ0FBZixFQUFvRTtBQUNuRSxXQUFJLGdCQUFnQixFQUFHLHdCQUFILEVBQThCLEdBQTlCLEVBQXBCO0FBQ0EsV0FBSyxDQUFFLFlBQWEsYUFBYixDQUFGLElBQWtDLGtCQUFrQixFQUF6RCxFQUE4RDtBQUM3RCxnQkFBUSxhQUFSO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsWUFBTyxTQUFTLEVBQVQsQ0FBWSxpQkFBWixDQUE4QixnQkFBOUIsQ0FBZ0QsS0FBaEQsQ0FBUDtBQUNBLEtBbENTO0FBbUNWLHVCQUFtQiwyQkFBVSxXQUFWLEVBQXdCO0FBQzFDLFNBQUssWUFBWSxPQUFaLENBQXFCLFNBQXJCLElBQW1DLENBQUMsQ0FBekMsRUFBNkM7QUFDNUMsVUFBSyxnQkFBZ0IsRUFBRyw2QkFBSCxFQUFtQyxJQUFuQyxDQUF5QyxhQUF6QyxDQUFyQixFQUFnRjtBQUMvRSxXQUFJLHNCQUFzQixFQUFHLDhCQUFILEVBQW9DLEdBQXBDLEVBQTFCO0FBQ0EsV0FBSyx3QkFBd0IsRUFBN0IsRUFBa0M7QUFDakMsc0JBQWMsbUJBQWQ7QUFDQTtBQUNEO0FBQ0QsVUFBSyxZQUFhLFdBQWIsQ0FBTCxFQUFrQztBQUNqQyxxQkFBYyxFQUFHLDZCQUFILEVBQW1DLElBQW5DLENBQXlDLGFBQXpDLENBQWQ7QUFDQTtBQUNEOztBQUVELFlBQU8sU0FBUyxFQUFULENBQVksaUJBQVosQ0FBOEIsZ0JBQTlCLENBQWdELFdBQWhELENBQVA7QUFDQTtBQWpEUyxJQVJEO0FBMkRWLGdCQUFhO0FBQ1osV0FBTztBQURLLElBM0RIO0FBOERWLGlCQUFjO0FBQ2IsV0FBTztBQURNO0FBOURKLEdBQVg7O0FBbUVBLE1BQUssT0FBTyxzQkFBWixFQUFxQztBQUNwQyxRQUFLLFdBQUwsQ0FBaUIsV0FBakIsR0FBK0Isc0JBQS9CO0FBQ0EsUUFBSyxZQUFMLENBQWtCLFdBQWxCLEdBQWdDLHNCQUFoQztBQUNBOztBQUVELFNBQU8sSUFBUDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGlCQUFULENBQTRCLGVBQTVCLEVBQThDO0FBQzdDLElBQUUsR0FBRixDQUNDLE9BREQsRUFFQztBQUNDLFdBQVEseUJBRFQ7QUFFQyxnQkFBYSxtQkFBbUIsYUFGakM7QUFHQyxZQUFTLEVBQUcsdUJBQUgsRUFBNkIsR0FBN0I7QUFIVixHQUZELEVBT0MsVUFBVSxNQUFWLEVBQW1CO0FBQ2xCLE9BQUssV0FBVyxDQUFoQixFQUFvQjtBQUNuQixvQkFBZ0IsU0FBaEIsQ0FBMkIsTUFBM0I7QUFDQTtBQUNELEdBWEY7QUFhQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxZQUFULENBQXVCLGNBQXZCLEVBQXdDO0FBQ3ZDLCtCQUE4QixjQUE5QixFQUE4QyxpQkFBOUM7O0FBRUEsTUFBSSwyQkFBMkIsRUFBRyxrQkFBSCxDQUEvQjtBQUNBLG9CQUFrQixJQUFJLGVBQUosQ0FDakIscUJBQXNCLHdCQUF0QixFQUFnRCxnQkFBZ0IsWUFBaEUsQ0FEaUIsRUFFakIsSUFGaUIsQ0FBbEI7O0FBS0EsMkJBQXlCLEVBQXpCLENBQ0MsYUFERCxFQUVDLG1CQUZELEVBR0MsWUFBVztBQUNWLHdCQUFzQixVQUF0QixFQUFrQyxvQkFBcUIsZUFBckIsQ0FBbEM7QUFDQSxvQkFBa0IsZUFBbEI7QUFDQSxHQU5GOztBQVNBLGtCQUFnQixJQUFoQjs7QUFFQSxrQkFBaUIsZUFBakI7O0FBRUEsTUFBSSxxQkFBcUIsRUFBRyx1QkFBSCxDQUF6QjtBQUNBLE1BQUksbUJBQW1CLE1BQW5CLEdBQTRCLENBQWhDLEVBQW9DO0FBQ25DLHNCQUFtQixFQUFuQixDQUF1QixRQUF2QixFQUFpQyxrQkFBa0IsSUFBbEIsQ0FBd0IsSUFBeEIsRUFBOEIsZUFBOUIsQ0FBakM7QUFDQSxzQkFBbUIsT0FBbkIsQ0FBNEIsUUFBNUI7QUFDQTs7QUFFRCxJQUFHLE1BQU0sZ0JBQVQsRUFBNEIsRUFBNUIsQ0FDQyxnQ0FERCxFQUVDLFVBQVcsZ0JBQWdCLGFBQWhCLENBQThCLElBQTlCLENBQW9DLGVBQXBDLENBQVgsRUFBa0UsR0FBbEUsQ0FGRDtBQUlBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLFdBQVQsQ0FBc0IsYUFBdEIsRUFBc0M7QUFDckMsK0JBQThCLGFBQTlCLEVBQTZDLGdCQUE3Qzs7QUFFQSxNQUFJLDBCQUEwQixFQUFHLGlCQUFILENBQTlCO0FBQ0EsbUJBQWlCLElBQUksY0FBSixDQUNoQixxQkFBc0IsdUJBQXRCLEVBQStDLGdCQUFnQixVQUEvRCxDQURnQixFQUVoQixJQUZnQixDQUFqQjs7QUFLQSwwQkFBd0IsRUFBeEIsQ0FDQyxhQURELEVBRUMsbUJBRkQsRUFHQyxZQUFXO0FBQ1Ysd0JBQXNCLFNBQXRCLEVBQWlDLG9CQUFxQixjQUFyQixDQUFqQztBQUNBLG9CQUFrQixjQUFsQjtBQUNBLEdBTkY7O0FBU0EsTUFBSSwyQkFBMkIsRUFBRyxrQkFBSCxDQUEvQjtBQUNBLDJCQUF5QixFQUF6QixDQUNDLGFBREQsRUFFQyxtQkFGRCxFQUdDLHFCQUFxQixJQUFyQixDQUEyQixJQUEzQixFQUFpQyxjQUFqQyxDQUhEOztBQU1BLDJCQUF5QixFQUF6QixDQUNDLG1CQURELEVBRUMsbUJBRkQsRUFHQywyQkFBMkIsSUFBM0IsQ0FBaUMsSUFBakMsRUFBdUMsY0FBdkMsQ0FIRDs7QUFNQSxpQkFBZSxJQUFmOztBQUVBLGtCQUFpQixjQUFqQjtBQUNBLHVCQUFzQixjQUF0QjtBQUNBLDZCQUE0QixjQUE1Qjs7QUFFQSxJQUFHLE1BQU0sZ0JBQVQsRUFBNEIsRUFBNUIsQ0FDQyxnQ0FERCxFQUVDLFVBQVcscUJBQXFCLElBQXJCLENBQTJCLElBQTNCLEVBQWlDLGNBQWpDLENBQVgsRUFBOEQsR0FBOUQsQ0FGRDtBQUlBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLG9CQUFULENBQStCLGNBQS9CLEVBQWdEO0FBQy9DLE1BQUksZ0JBQWdCLEVBQUcsdUJBQUgsQ0FBcEI7QUFDQSxNQUFJLGVBQWUsY0FBYyxHQUFkLEVBQW5CO0FBQ0EsTUFBSSxpQkFBaUIsRUFBckIsRUFBMEI7QUFDekI7QUFDQTs7QUFFRCxNQUFJLGdCQUFnQixFQUFHLHdCQUFILEVBQThCLEdBQTlCLEVBQXBCO0FBQ0EsTUFBSyxDQUFFLFlBQWEsYUFBYixDQUFGLElBQWtDLGtCQUFrQixFQUF6RCxFQUE4RDtBQUM3RCxrQkFBZSxRQUFmLENBQXlCLGFBQXpCO0FBQ0EsR0FGRCxNQUVPO0FBQ04sa0JBQWUsUUFBZixDQUF5QixjQUFjLElBQWQsQ0FBb0IsYUFBcEIsQ0FBekI7QUFDQTtBQUNEOztBQUVEOzs7Ozs7QUFNQSxVQUFTLDBCQUFULENBQXFDLGNBQXJDLEVBQXNEO0FBQ3JELE1BQUksc0JBQXNCLEVBQUcsNkJBQUgsQ0FBMUI7QUFDQSxNQUFJLHFCQUFxQixvQkFBb0IsR0FBcEIsRUFBekI7QUFDQSxNQUFJLHVCQUF1QixFQUEzQixFQUFnQztBQUMvQjtBQUNBOztBQUVELE1BQUksc0JBQXNCLEVBQUcsOEJBQUgsRUFBb0MsR0FBcEMsRUFBMUI7QUFDQSxNQUFLLHdCQUF3QixFQUE3QixFQUFrQztBQUNqQyxrQkFBZSxjQUFmLENBQStCLG1CQUEvQjtBQUNBLEdBRkQsTUFFTztBQUNOLGtCQUFlLGNBQWYsQ0FBK0Isb0JBQW9CLElBQXBCLENBQTBCLGFBQTFCLENBQS9CO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxnQkFBVCxDQUEyQixPQUEzQixFQUFxQztBQUNwQyxNQUFLLFFBQVEsSUFBUixDQUFhLFFBQWIsS0FBMEIsRUFBL0IsRUFBb0M7QUFDbkMsV0FBUSxRQUFSLENBQWtCLGlCQUFrQixFQUFsQixDQUFsQjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLG9CQUFULENBQStCLFlBQS9CLEVBQTZDLElBQTdDLEVBQW9EO0FBQ25ELElBQUcsTUFBTyxZQUFQLEdBQXNCLHlCQUF6QixFQUFxRCxJQUFyRCxDQUEyRCxJQUEzRDtBQUNBOztBQUVEOzs7OztBQUtBLFVBQVMsZUFBVCxHQUEyQjtBQUMxQixNQUFLLHFCQUFxQixNQUExQixFQUFtQztBQUNsQztBQUNBOztBQUVEO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsbUJBQVQsQ0FBOEIsT0FBOUIsRUFBd0M7QUFDdkMsU0FBTyxRQUFRLElBQVIsQ0FBYSxRQUFiLEtBQTBCLEVBQTFCLEdBQStCLG1CQUFtQixXQUFsRCxHQUFnRSxtQkFBbUIsYUFBMUY7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLHVCQUFULEdBQW1DO0FBQ2xDLE1BQUssWUFBYSxHQUFHLEtBQWhCLEtBQTJCLFlBQWEsR0FBRyxLQUFILENBQVMsYUFBdEIsQ0FBaEMsRUFBd0U7QUFDdkU7QUFDQTs7QUFFRDtBQUNBLE1BQUksZ0JBQWdCLEdBQUcsS0FBSCxDQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBcEI7O0FBRUEsZ0JBQWMsRUFBZCxDQUFrQixRQUFsQixFQUE0QixZQUFXO0FBQ3RDLE9BQUksZUFBZSxjQUFjLEtBQWQsR0FBc0IsR0FBdEIsQ0FBMkIsV0FBM0IsRUFBeUMsS0FBekMsR0FBaUQsVUFBcEU7O0FBRUEsMEJBQXVCLElBQXZCOztBQUVBLG9CQUFrQixhQUFhLEdBQS9CO0FBQ0EsR0FORDs7QUFRQSxJQUFHLGVBQUgsRUFBcUIsRUFBckIsQ0FBeUIsT0FBekIsRUFBa0Msd0JBQWxDLEVBQTRELFlBQVc7QUFDdEUsMEJBQXVCLEtBQXZCOztBQUVBO0FBQ0EsR0FKRDtBQUtBOztBQUVEOzs7OztBQUtBLFVBQVMsaUJBQVQsR0FBNkI7QUFDNUI7QUFDQSxNQUFJLGlCQUFpQixFQUFHLE1BQU0saUJBQVQsQ0FBckI7QUFDQSxNQUFLLGVBQWUsTUFBZixHQUF3QixDQUE3QixFQUFpQztBQUNoQyxrQkFBZSxFQUFmLENBQW1CLE9BQW5CLEVBQTRCLG1CQUE1QjtBQUNBOztBQUVEO0FBQ0EsTUFBSyxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsSUFBa0MsT0FBTyxRQUFRLEVBQWYsS0FBc0IsVUFBN0QsRUFBMEU7QUFDekUsT0FBSSxTQUFTLENBQUUsT0FBRixFQUFXLFFBQVgsRUFBcUIsS0FBckIsRUFBNEIsT0FBNUIsQ0FBYjtBQUNBLFdBQVEsRUFBUixDQUFZLFdBQVosRUFBeUIsVUFBVSxDQUFWLEVBQWM7QUFDdEMsU0FBTSxJQUFJLElBQUksQ0FBZCxFQUFpQixJQUFJLE9BQU8sTUFBNUIsRUFBb0MsR0FBcEMsRUFBMEM7QUFDekMsT0FBRSxNQUFGLENBQVMsRUFBVCxDQUFhLE9BQVEsQ0FBUixDQUFiLEVBQTBCLG1CQUExQjtBQUNBO0FBQ0QsSUFKRDtBQUtBO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxrQkFBVCxHQUE4QjtBQUM3QixtQkFBa0IsRUFBbEI7QUFDQTtBQUNBOztBQUVEOzs7OztBQUtBLFVBQVMsbUJBQVQsR0FBK0I7QUFDOUI7QUFDQSxNQUFLLHFCQUFxQixNQUExQixFQUFtQztBQUNsQyxPQUFJLGdCQUFnQixrQkFBcEI7QUFDQSxvQkFBa0IsYUFBbEI7O0FBRUEsT0FBSyxrQkFBa0IsRUFBdkIsRUFBNEI7QUFDM0I7QUFDQTtBQUNEOztBQUVELGtCQUFpQixnQkFBaUIsVUFBVSxLQUFWLEVBQWtCO0FBQ25ELG1CQUFpQixLQUFqQjtBQUNBLEdBRmdCLENBQWpCO0FBR0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsZ0JBQVQsQ0FBMkIsYUFBM0IsRUFBMkM7QUFDMUMsTUFBSyxjQUFjLFFBQWQsS0FBMkIsYUFBaEMsRUFBZ0Q7QUFDL0MsaUJBQWMsUUFBZCxHQUF5QixhQUF6Qjs7QUFFQTtBQUNBLEtBQUcsbUJBQUgsRUFBeUIsT0FBekIsQ0FBa0MsYUFBbEM7QUFDQTtBQUNEOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGVBQVQsQ0FBMEIsWUFBMUIsRUFBeUM7QUFDeEMsTUFBSyxjQUFjLE9BQWQsS0FBMEIsWUFBL0IsRUFBOEM7QUFDN0MsaUJBQWMsT0FBZCxHQUF3QixZQUF4Qjs7QUFFQTtBQUNBLEtBQUcsbUJBQUgsRUFBeUIsT0FBekIsQ0FBa0MsYUFBbEM7QUFDQTtBQUNEOztBQUVEOzs7OztBQUtBLFVBQVMsZ0JBQVQsR0FBNEI7QUFDM0IsTUFBSyx5QkFBeUIsS0FBOUIsRUFBc0M7QUFDckMsVUFBTyxFQUFQO0FBQ0E7O0FBRUQsTUFBSSxnQkFBZ0IsRUFBRyw0QkFBSCxDQUFwQjtBQUNBLE1BQUssY0FBYyxNQUFkLEdBQXVCLENBQTVCLEVBQWdDO0FBQy9CLFVBQU8sRUFBRyxjQUFjLEdBQWQsQ0FBbUIsQ0FBbkIsQ0FBSCxFQUE0QixJQUE1QixDQUFrQyxLQUFsQyxDQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGVBQVQsQ0FBMEIsUUFBMUIsRUFBcUM7QUFDcEMsTUFBSSxVQUFVLFlBQWQ7O0FBRUEsTUFBSSxTQUFTLFVBQVcsT0FBWCxDQUFiO0FBQ0EsTUFBSSxRQUFTLEVBQWI7O0FBRUEsTUFBSyxPQUFPLE1BQVAsS0FBa0IsQ0FBdkIsRUFBMkI7QUFDMUIsVUFBTyxLQUFQO0FBQ0E7O0FBRUQsS0FBRztBQUNGLE9BQUksZUFBZSxPQUFPLEtBQVAsRUFBbkI7QUFDQSxrQkFBZSxFQUFHLFlBQUgsQ0FBZjs7QUFFQSxPQUFJLGNBQWMsYUFBYSxJQUFiLENBQW1CLEtBQW5CLENBQWxCOztBQUVBLE9BQUssV0FBTCxFQUFtQjtBQUNsQixZQUFRLFdBQVI7QUFDQTtBQUNELEdBVEQsUUFTVSxPQUFPLEtBQVAsSUFBZ0IsT0FBTyxNQUFQLEdBQWdCLENBVDFDOztBQVdBLFVBQVEsZUFBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsQ0FBUjs7QUFFQSxTQUFPLEtBQVA7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsY0FBVCxDQUF5QixHQUF6QixFQUE4QixRQUE5QixFQUF5QztBQUN4QyxNQUFLLEtBQU0sWUFBTixFQUFvQixHQUFwQixDQUFMLEVBQWlDO0FBQ2hDLFVBQU8sYUFBYyxHQUFkLENBQVA7QUFDQTs7QUFFRCwyQkFBMEIsR0FBMUIsRUFBK0IsVUFBVSxRQUFWLEVBQXFCO0FBQ25ELGdCQUFjLEdBQWQsSUFBc0IsUUFBdEI7O0FBRUEsWUFBVSxRQUFWO0FBQ0EsR0FKRDs7QUFNQSxTQUFPLEdBQVA7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsd0JBQVQsQ0FBbUMsR0FBbkMsRUFBd0MsUUFBeEMsRUFBbUQ7QUFDbEQsSUFBRSxPQUFGLENBQVcsT0FBWCxFQUFvQjtBQUNuQixXQUFRLDhCQURXO0FBRW5CLGFBQVU7QUFGUyxHQUFwQixFQUdHLFVBQVUsUUFBVixFQUFxQjtBQUN2QixPQUFLLGNBQWMsU0FBUyxNQUE1QixFQUFxQztBQUNwQyxhQUFVLFNBQVMsTUFBbkI7QUFDQTtBQUNELEdBUEQ7QUFRQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLFVBQVQsR0FBc0I7QUFDckIsTUFBSyxvQkFBTCxFQUE0QjtBQUMzQixVQUFPLFFBQVEsR0FBUixDQUFhLGlCQUFiLEVBQWlDLFVBQWpDLEVBQVA7QUFDQTs7QUFFRCxNQUFJLGlCQUFpQixFQUFHLE1BQU0saUJBQVQsQ0FBckI7QUFDQSxNQUFLLGVBQWUsTUFBZixHQUF3QixDQUE3QixFQUFpQztBQUNoQyxVQUFPLGVBQWUsR0FBZixFQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsTUFBSyxPQUFPLE9BQVAsS0FBbUIsV0FBbkIsSUFDSixPQUFPLFFBQVEsT0FBZixLQUEyQixXQUR2QixJQUVKLFFBQVEsT0FBUixDQUFnQixNQUFoQixLQUEyQixDQUZ2QixJQUdKLFFBQVEsR0FBUixDQUFhLGlCQUFiLE1BQXFDLElBSGpDLElBSUosUUFBUSxHQUFSLENBQWEsaUJBQWIsRUFBa0MsUUFBbEMsRUFKRCxFQUlnRDtBQUMvQyxVQUFPLEtBQVA7QUFDQTs7QUFFRCxTQUFPLElBQVA7QUFDQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxnQkFBVCxDQUEyQixZQUEzQixFQUEwQztBQUN6QztBQUNBLE1BQUssQ0FBRSxZQUFhLGVBQWIsQ0FBRixJQUFvQyxnQkFBZ0IsSUFBaEIsQ0FBcUIsUUFBckIsS0FBa0MsRUFBM0UsRUFBZ0Y7QUFDL0UsVUFBTyxnQkFBZ0IsSUFBaEIsQ0FBcUIsUUFBNUI7QUFDQTs7QUFFRDtBQUNBLE1BQUsscUJBQXFCLE1BQTFCLEVBQW1DO0FBQ2xDLE9BQUssY0FBYyxRQUFkLEtBQTJCLEVBQWhDLEVBQXFDO0FBQ3BDLFdBQU8sY0FBYyxRQUFyQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFLLGNBQWMsT0FBZCxLQUEwQixFQUEvQixFQUFvQztBQUNuQyxVQUFPLGNBQWMsT0FBckI7QUFDQTs7QUFFRCxNQUFLLE9BQU8sWUFBUCxLQUF3QixXQUE3QixFQUEyQztBQUMxQyxVQUFPLFlBQVA7QUFDQTs7QUFFRCxTQUFPLEVBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGFBQVQsR0FBeUI7QUFDeEIsTUFBSSxTQUFTLENBQ1o7QUFDQyxrQkFBZSx1Q0FEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixhQUZyQztBQUdDLG9CQUFpQixhQUFhLElBQWIsQ0FBa0IsYUFIcEM7QUFJQyxPQUFJO0FBSkwsR0FEWSxFQU9aO0FBQ0Msa0JBQWUsb0NBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsYUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLGFBSHBDO0FBSUMsT0FBSTtBQUpMLEdBUFksRUFhWjtBQUNDLGtCQUFlLDBDQURoQjtBQUVDLGVBQVksYUFBYSxVQUFiLENBQXdCLG1CQUZyQztBQUdDLG9CQUFpQixhQUFhLElBQWIsQ0FBa0IsbUJBSHBDO0FBSUMsT0FBSTtBQUpMLEdBYlksRUFtQlo7QUFDQyxrQkFBZSxzQ0FEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixZQUZyQztBQUdDLG9CQUFpQixhQUFhLElBQWIsQ0FBa0IsWUFIcEM7QUFJQyxPQUFJO0FBSkwsR0FuQlksRUF5Qlo7QUFDQyxrQkFBZSxtQ0FEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixZQUZyQztBQUdDLG9CQUFpQixhQUFhLElBQWIsQ0FBa0IsWUFIcEM7QUFJQyxPQUFJO0FBSkwsR0F6QlksRUErQlo7QUFDQyxrQkFBZSx5Q0FEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixrQkFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLGtCQUhwQztBQUlDLE9BQUk7QUFKTCxHQS9CWSxDQUFiOztBQXVDQSxVQUFTLE1BQVQsRUFBaUIsVUFBVSxLQUFWLEVBQWtCO0FBQ2xDLEtBQUcsTUFBTSxhQUFULEVBQXlCLE1BQXpCLENBQ0MsVUFBVSxVQUFWLENBQXNCLE1BQU0sVUFBNUIsRUFBd0MsTUFBTSxFQUE5QyxJQUNBLFVBQVUsUUFBVixDQUFvQixNQUFNLGVBQTFCLEVBQTJDLE1BQU0sRUFBakQsQ0FGRDtBQUlBLEdBTEQ7O0FBT0EsSUFBRyx1QkFBSCxFQUE2QixFQUE3QixDQUFpQyxPQUFqQyxFQUEwQyxvQkFBMUMsRUFBZ0UsWUFBVztBQUMxRSxPQUFJLFVBQVUsRUFBRyxJQUFILENBQWQ7QUFBQSxPQUNDLFlBQVksRUFBRyxNQUFNLFFBQVEsSUFBUixDQUFjLGVBQWQsQ0FBVCxDQURiO0FBQUEsT0FFQyxpQkFBaUIsVUFBVSxFQUFWLENBQWMsVUFBZCxDQUZsQjs7QUFJQSxLQUFHLFNBQUgsRUFBZSxXQUFmLENBQTRCLEdBQTVCLEVBQWlDLFlBQVc7QUFDM0MsWUFBUSxJQUFSLENBQWMsZUFBZCxFQUErQixDQUFFLGNBQWpDO0FBQ0EsSUFGRDtBQUdBLEdBUkQ7QUFTQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLHNCQUFULENBQWlDLFlBQWpDLEVBQWdEO0FBQy9DLE1BQUssT0FBTyxZQUFQLEtBQXdCLFdBQXhCLElBQXVDLE9BQU8sYUFBYSxNQUFwQixLQUErQixXQUEzRSxFQUF5RjtBQUN4RixnQkFBYSxNQUFiLEdBQXNCLHVCQUF0QjtBQUNBLGdCQUFhLFdBQWIsQ0FBMEIsdUJBQTFCLElBQXNELE1BQU8sYUFBYSxXQUFiLENBQTBCLHVCQUExQixDQUFQLENBQXREOztBQUVBLFVBQVEsYUFBYSxXQUFiLENBQTBCLHVCQUExQixDQUFSOztBQUVBLFVBQU8sWUFBUDtBQUNBOztBQUVELFNBQU87QUFDTixXQUFRLHVCQURGO0FBRU4sZ0JBQWE7QUFDWiw2QkFBeUI7QUFDeEIsU0FBSTtBQURvQjtBQURiO0FBRlAsR0FBUDtBQVFBOztBQUVEOzs7OztBQUtBLFVBQVMsdUJBQVQsR0FBbUM7QUFDbEMsTUFBSSxpQkFBaUIsRUFBRyxpQkFBSCxDQUFyQjtBQUNBLE1BQUksZ0JBQWdCLEVBQUcsZ0JBQUgsQ0FBcEI7O0FBRUEsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBeEIsSUFBNkIsY0FBYyxNQUFkLEdBQXVCLENBQXpELEVBQTZEO0FBQzVELFVBQVEsTUFBUixFQUFpQixFQUFqQixDQUFxQixnQkFBckIsRUFBdUMsWUFBVztBQUNqRDs7QUFFQSxRQUFLLGVBQWUsTUFBZixHQUF3QixDQUE3QixFQUFpQztBQUNoQyxrQkFBYyxjQUFkO0FBQ0E7O0FBRUQsUUFBSyxjQUFjLE1BQWQsR0FBdUIsQ0FBNUIsRUFBZ0M7QUFDL0IsaUJBQWEsYUFBYjtBQUNBOztBQUVEO0FBQ0E7QUFDQSxJQWJEO0FBY0E7QUFDRDs7QUFFRCxHQUFHLHVCQUFIO0FBQ0EsQ0FuM0JDLEVBbTNCQyxNQW4zQkQsQ0FBRjs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3dEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTs7QUFFQSxJQUFJLGdCQUFnQixDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLE9BQXZCLEVBQWdDLFlBQWhDLEVBQThDLFFBQTlDLEVBQXdELElBQXhELEVBQThELEtBQTlELEVBQXFFLElBQXJFLEVBQTJFLFVBQTNFLEVBQXVGLFlBQXZGLEVBQXFHLFFBQXJHLEVBQStHLFFBQS9HLEVBQXlILE1BQXpILEVBQWlJLElBQWpJLEVBQXVJLElBQXZJLEVBQTZJLElBQTdJLEVBQW1KLElBQW5KLEVBQXlKLElBQXpKLEVBQStKLElBQS9KLEVBQXFLLFFBQXJLLEVBQStLLFFBQS9LLEVBQXlMLElBQXpMLEVBQStMLElBQS9MLEVBQXFNLE1BQXJNLEVBQTZNLEtBQTdNLEVBQW9OLFVBQXBOLEVBQWdPLElBQWhPLEVBQXNPLFFBQXRPLEVBQWdQLEdBQWhQLEVBQXFQLEtBQXJQLEVBQTRQLFNBQTVQLEVBQXVRLE9BQXZRLEVBQWdSLE9BQWhSLEVBQXlSLElBQXpSLEVBQStSLE9BQS9SLENBQXBCO0FBQ0EsSUFBSSxpQkFBaUIsQ0FBQyxHQUFELEVBQU0sS0FBTixFQUFhLEdBQWIsRUFBa0IsT0FBbEIsRUFBMkIsSUFBM0IsRUFBaUMsTUFBakMsRUFBeUMsU0FBekMsRUFBb0QsTUFBcEQsRUFBNEQsTUFBNUQsRUFBb0UsS0FBcEUsRUFBMkUsSUFBM0UsRUFBaUYsS0FBakYsRUFBd0YsUUFBeEYsRUFBa0csTUFBbEcsRUFBMEcsTUFBMUcsRUFBa0gsS0FBbEgsRUFBeUgsR0FBekgsRUFBOEgsS0FBOUgsRUFBcUksSUFBckksRUFBMkksS0FBM0ksRUFBa0osS0FBbEosRUFBeUosUUFBekosRUFBbUssR0FBbkssRUFBd0ssUUFBeEssRUFBa0wsTUFBbEwsRUFBMEwsS0FBMUwsRUFBaU0sS0FBak0sRUFBd00sUUFBeE0sRUFBa04sT0FBbE4sRUFBMk4sT0FBM04sRUFBb08sUUFBcE8sRUFBOE8sVUFBOU8sQ0FBckI7QUFDQSxJQUFJLHFCQUFxQixJQUFJLE1BQUosQ0FBVyxPQUFPLGNBQWMsSUFBZCxDQUFtQixHQUFuQixDQUFQLEdBQWlDLElBQTVDLEVBQWtELEdBQWxELENBQXpCO0FBQ0EsSUFBSSxzQkFBc0IsSUFBSSxNQUFKLENBQVcsT0FBTyxlQUFlLElBQWYsQ0FBb0IsR0FBcEIsQ0FBUCxHQUFrQyxJQUE3QyxFQUFtRCxHQUFuRCxDQUExQjtBQUNBLElBQUkseUJBQXlCLElBQUksTUFBSixDQUFXLFFBQVEsY0FBYyxJQUFkLENBQW1CLEdBQW5CLENBQVIsR0FBa0MsV0FBN0MsRUFBMEQsR0FBMUQsQ0FBN0I7QUFDQSxJQUFJLHVCQUF1QixJQUFJLE1BQUosQ0FBVyxTQUFTLGNBQWMsSUFBZCxDQUFtQixHQUFuQixDQUFULEdBQW1DLFdBQTlDLEVBQTJELEdBQTNELENBQTNCO0FBQ0EsSUFBSSwwQkFBMEIsSUFBSSxNQUFKLENBQVcsUUFBUSxlQUFlLElBQWYsQ0FBb0IsR0FBcEIsQ0FBUixHQUFtQyxVQUE5QyxFQUEwRCxHQUExRCxDQUE5QjtBQUNBLElBQUksd0JBQXdCLElBQUksTUFBSixDQUFXLFNBQVMsZUFBZSxJQUFmLENBQW9CLEdBQXBCLENBQVQsR0FBb0MsVUFBL0MsRUFBMkQsR0FBM0QsQ0FBNUI7QUFDQSxJQUFJLHlCQUF5QixzQkFBN0I7QUFDQSxJQUFJLHVCQUF1QixzQkFBM0I7QUFDQSxJQUFJLGVBQWUsU0FBbkI7QUFDQSxJQUFJLDBCQUEwQixXQUE5QjtBQUNBLElBQUksZUFBZSxzQkFBbkI7QUFDQSxJQUFJLE9BQU8sUUFBUSxpQkFBUixDQUFYO0FBQ0EsSUFBSSxVQUFVLFFBQVEsZ0JBQVIsQ0FBZDtBQUNBLElBQUksVUFBVSxRQUFRLGdCQUFSLENBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQUksa0JBQUo7QUFDQTs7Ozs7QUFLQSxTQUFTLGVBQVQsR0FBMkI7QUFDdkIsYUFBUyxFQUFUO0FBQ0EseUJBQXFCLEtBQUssVUFBVSxLQUFWLEVBQWlCO0FBQ3ZDLGVBQU8sSUFBUCxDQUFZLEtBQVo7QUFDSCxLQUZvQixDQUFyQjtBQUdBLHVCQUFtQixPQUFuQixDQUEyQixZQUEzQixFQUF5QyxTQUF6QztBQUNBLHVCQUFtQixPQUFuQixDQUEyQix1QkFBM0IsRUFBb0QsMkJBQXBEO0FBQ0EsdUJBQW1CLE9BQW5CLENBQTJCLHNCQUEzQixFQUFtRCxhQUFuRDtBQUNBLHVCQUFtQixPQUFuQixDQUEyQixvQkFBM0IsRUFBaUQsV0FBakQ7QUFDQSx1QkFBbUIsT0FBbkIsQ0FBMkIsdUJBQTNCLEVBQW9ELGNBQXBEO0FBQ0EsdUJBQW1CLE9BQW5CLENBQTJCLHFCQUEzQixFQUFrRCxZQUFsRDtBQUNBLHVCQUFtQixPQUFuQixDQUEyQixzQkFBM0IsRUFBbUQscUJBQW5EO0FBQ0EsdUJBQW1CLE9BQW5CLENBQTJCLG9CQUEzQixFQUFpRCxtQkFBakQ7QUFDSDtBQUNEOzs7Ozs7QUFNQSxTQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUM7QUFDckMsV0FBTyxtQkFBbUIsSUFBbkIsQ0FBd0IsZUFBeEIsQ0FBUDtBQUNIO0FBQ0Q7Ozs7OztBQU1BLFNBQVMsZUFBVCxDQUF5QixlQUF6QixFQUEwQztBQUN0QyxXQUFPLG9CQUFvQixJQUFwQixDQUF5QixlQUF6QixDQUFQO0FBQ0g7QUFDRDs7Ozs7O0FBTUEsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQ3JCLFFBQUksU0FBUyxFQUFiO0FBQUEsUUFDSSxRQUFRLENBRFo7QUFBQSxRQUVJLGdCQUFnQixFQUZwQjtBQUFBLFFBR0ksZUFBZSxFQUhuQjtBQUFBLFFBSUksY0FBYyxFQUpsQjtBQUtBO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEVBQTNCLENBQVA7QUFDQTtBQUNBLHVCQUFtQixNQUFuQixDQUEwQixJQUExQjtBQUNBLHVCQUFtQixHQUFuQjtBQUNBLFlBQVEsTUFBUixFQUFnQixVQUFVLEtBQVYsRUFBaUIsQ0FBakIsRUFBb0I7QUFDaEMsWUFBSSxZQUFZLE9BQU8sSUFBSSxDQUFYLENBQWhCO0FBQ0EsZ0JBQVEsTUFBTSxJQUFkO0FBQ0ksaUJBQUssU0FBTDtBQUNBLGlCQUFLLDJCQUFMO0FBQ0EsaUJBQUssY0FBTDtBQUNBLGlCQUFLLFlBQUw7QUFDQSxpQkFBSyxXQUFMO0FBQ0EsaUJBQUsscUJBQUw7QUFDQSxpQkFBSyxtQkFBTDtBQUNBLGlCQUFLLG1CQUFMO0FBQ0ksb0JBQUksQ0FBQyxTQUFELElBQWMsVUFBVSxDQUFWLEtBQWdCLFVBQVUsSUFBVixLQUFtQixhQUFuQixJQUFvQyxVQUFVLElBQVYsS0FBbUIsV0FBdkUsQ0FBbEIsRUFBdUc7QUFDbkcsb0NBQWdCLE1BQU0sR0FBdEI7QUFDQSwyQkFBTyxJQUFQLENBQVksWUFBWjtBQUNBLG9DQUFnQixFQUFoQjtBQUNBLG1DQUFlLEVBQWY7QUFDQSxrQ0FBYyxFQUFkO0FBQ0gsaUJBTkQsTUFNTztBQUNILG9DQUFnQixNQUFNLEdBQXRCO0FBQ0g7QUFDRDtBQUNKLGlCQUFLLGFBQUw7QUFDSSxvQkFBSSxVQUFVLENBQWQsRUFBaUI7QUFDYix3QkFBSSxhQUFhLElBQWIsT0FBd0IsRUFBNUIsRUFBZ0M7QUFDNUIsK0JBQU8sSUFBUCxDQUFZLFlBQVo7QUFDSDtBQUNELG1DQUFlLEVBQWY7QUFDQSxrQ0FBYyxFQUFkO0FBQ0g7QUFDRDtBQUNBLGdDQUFnQixNQUFNLEdBQXRCO0FBQ0E7QUFDSixpQkFBSyxXQUFMO0FBQ0k7QUFDQSw4QkFBYyxNQUFNLEdBQXBCO0FBQ0E7Ozs7QUFJQSxvQkFBSSxPQUFPLGFBQVAsSUFBd0IsT0FBTyxXQUFuQyxFQUFnRDtBQUM1QywyQkFBTyxJQUFQLENBQVksZ0JBQWdCLFlBQWhCLEdBQStCLFdBQTNDO0FBQ0gsaUJBRkQsTUFFTyxJQUFJLE9BQU8sYUFBYSxJQUFiLEVBQVgsRUFBZ0M7QUFDbkMsMkJBQU8sSUFBUCxDQUFZLFlBQVo7QUFDSDtBQUNELGdDQUFnQixFQUFoQjtBQUNBLCtCQUFlLEVBQWY7QUFDQSw4QkFBYyxFQUFkO0FBQ0E7QUE3Q1I7QUErQ0E7QUFDQSxZQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ1gsb0JBQVEsQ0FBUjtBQUNIO0FBQ0osS0FyREQ7QUFzREEsV0FBTyxNQUFQO0FBQ0g7QUFDRCxPQUFPLE9BQVAsR0FBaUI7QUFDYixtQkFBZSxhQURGO0FBRWIsb0JBQWdCLGNBRkg7QUFHYixvQkFBZ0IsY0FISDtBQUliLHFCQUFpQixlQUpKO0FBS2IsZUFBVyxRQUFRLFNBQVI7QUFMRSxDQUFqQjtBQU9BO0FBQ0E7OztBQzFJQTtBQUNBOztBQUVBLElBQUksdUJBQXVCLFFBQVEsMkJBQVIsQ0FBM0I7QUFDQTs7Ozs7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQjtBQUMvQixTQUFPLHFCQUFxQixJQUFyQixFQUEyQixpQkFBM0IsQ0FBUDtBQUNELENBRkQ7QUFHQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQixXQUFoQixFQUE2QjtBQUMxQyxRQUFJLFFBQVEsSUFBSSxNQUFKLENBQVcsV0FBWCxFQUF3QixJQUF4QixDQUFaO0FBQ0EsUUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBZDtBQUNBLFFBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNsQixrQkFBVSxFQUFWO0FBQ0g7QUFDRCxXQUFPLE9BQVA7QUFDSCxDQVBEO0FBUUE7QUFDQTs7O0FDbkJBO0FBQ0E7O0FBRUEsSUFBSSxjQUFjLFFBQVEsb0NBQVIsQ0FBbEI7QUFDQSxJQUFJLGdCQUFnQixRQUFRLG9CQUFSLEVBQThCLGFBQWxEO0FBQ0EsSUFBSSx5QkFBeUIsSUFBSSxNQUFKLENBQVcsUUFBUSxjQUFjLElBQWQsQ0FBbUIsR0FBbkIsQ0FBUixHQUFrQyxVQUE3QyxFQUF5RCxHQUF6RCxDQUE3QjtBQUNBLElBQUksdUJBQXVCLElBQUksTUFBSixDQUFXLFFBQVEsY0FBYyxJQUFkLENBQW1CLEdBQW5CLENBQVIsR0FBa0MsV0FBN0MsRUFBMEQsR0FBMUQsQ0FBM0I7QUFDQTs7Ozs7O0FBTUEsSUFBSSxzQkFBc0IsU0FBUyxtQkFBVCxDQUE2QixJQUE3QixFQUFtQztBQUN6RCxXQUFPLEtBQUssT0FBTCxDQUFhLGtCQUFiLEVBQWlDLEVBQWpDLENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLGtCQUFiLEVBQWlDLEVBQWpDLENBQVA7QUFDQSxXQUFPLElBQVA7QUFDSCxDQUpEO0FBS0E7Ozs7OztBQU1BLElBQUksMkJBQTJCLFNBQVMsd0JBQVQsQ0FBa0MsSUFBbEMsRUFBd0M7QUFDbkUsV0FBTyxLQUFLLE9BQUwsQ0FBYSxzQkFBYixFQUFxQyxFQUFyQyxDQUFQO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSxvQkFBYixFQUFtQyxFQUFuQyxDQUFQO0FBQ0EsV0FBTyxJQUFQO0FBQ0gsQ0FKRDtBQUtBOzs7Ozs7QUFNQSxJQUFJLGdCQUFnQixTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsRUFBNkI7QUFDN0MsV0FBTyxLQUFLLE9BQUwsQ0FBYSxlQUFiLEVBQThCLEdBQTlCLENBQVA7QUFDQSxXQUFPLFlBQVksSUFBWixDQUFQO0FBQ0EsV0FBTyxJQUFQO0FBQ0gsQ0FKRDtBQUtBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLG1CQUFlLGFBREY7QUFFYix5QkFBcUIsbUJBRlI7QUFHYiw4QkFBMEI7QUFIYixDQUFqQjtBQUtBO0FBQ0E7OztBQzlDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxJQUFWLEVBQWdCO0FBQzdCO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEdBQXhCLENBQVA7QUFDQTtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQixHQUF0QixDQUFQO0FBQ0E7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsRUFBMkIsRUFBM0IsQ0FBUDtBQUNBLFdBQU8sSUFBUDtBQUNILENBUkQ7QUFTQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBnZXRMMTBuT2JqZWN0ID0gcmVxdWlyZSggXCIuL2dldEwxMG5PYmplY3RcIiApO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGRlc2NyaXB0aW9uIHBsYWNlaG9sZGVyIGZvciB1c2UgaW4gdGhlIGRlc2NyaXB0aW9uIGZvcm1zLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBkZXNjcmlwdGlvbiBwbGFjZWhvbGRlci5cbiAqL1xuZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcigpIHtcblx0dmFyIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBcIlwiO1xuXHR2YXIgbDEwbk9iamVjdCA9IGdldEwxMG5PYmplY3QoKTtcblxuXHRpZiAoIGwxMG5PYmplY3QgKSB7XG5cdFx0ZGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IGwxMG5PYmplY3QubWV0YWRlc2NfdGVtcGxhdGU7XG5cdH1cblxuXHRyZXR1cm4gZGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuIiwidmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGwxMG4gb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYWdlLCBlaXRoZXIgdGVybSBvciBwb3N0LlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBsMTBuIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFnZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TDEwbk9iamVjdCgpIHtcblx0dmFyIGwxMG5PYmplY3QgPSBudWxsO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggd2luZG93Lndwc2VvUG9zdFNjcmFwZXJMMTBuICkgKSB7XG5cdFx0bDEwbk9iamVjdCA9IHdpbmRvdy53cHNlb1Bvc3RTY3JhcGVyTDEwbjtcblx0fSBlbHNlIGlmICggISBpc1VuZGVmaW5lZCggd2luZG93Lndwc2VvVGVybVNjcmFwZXJMMTBuICkgKSB7XG5cdFx0bDEwbk9iamVjdCA9IHdpbmRvdy53cHNlb1Rlcm1TY3JhcGVyTDEwbjtcblx0fVxuXG5cdHJldHVybiBsMTBuT2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEwxMG5PYmplY3Q7XG4iLCJ2YXIgZ2V0TDEwbk9iamVjdCA9IHJlcXVpcmUoIFwiLi9nZXRMMTBuT2JqZWN0XCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aXRsZSBwbGFjZWhvbGRlciBmb3IgdXNlIGluIHRoZSB0aXRsZSBmb3Jtcy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGl0bGUgcGxhY2Vob2xkZXIuXG4gKi9cbmZ1bmN0aW9uIGdldFRpdGxlUGxhY2Vob2xkZXIoKSB7XG5cdHZhciB0aXRsZVBsYWNlaG9sZGVyID0gXCJcIjtcblx0dmFyIGwxMG5PYmplY3QgPSBnZXRMMTBuT2JqZWN0KCk7XG5cblx0aWYgKCBsMTBuT2JqZWN0ICkge1xuXHRcdHRpdGxlUGxhY2Vob2xkZXIgPSBsMTBuT2JqZWN0LnRpdGxlX3RlbXBsYXRlO1xuXHR9XG5cblx0aWYgKCB0aXRsZVBsYWNlaG9sZGVyID09PSBcIlwiICkge1xuXHRcdHRpdGxlUGxhY2Vob2xkZXIgPSBcIiUldGl0bGUlJSAtICUlc2l0ZW5hbWUlJVwiO1xuXHR9XG5cblx0cmV0dXJuIHRpdGxlUGxhY2Vob2xkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGl0bGVQbGFjZWhvbGRlcjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNVbmRlZmluZWQobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1VuZGVmaW5lZDtcbiIsIi8qIGpzaGludCAtVzA5NyAqL1xuXG4vKipcbiAqIFJldHVybnMgdGhlIEhUTUwgZm9yIGEgaGVscCBidXR0b25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBwdXQgaW4gdGhlIGJ1dHRvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250cm9scyBUaGUgSFRNTCBJRCBvZiB0aGUgZWxlbWVudCB0aGlzIGJ1dHRvbiBjb250cm9scy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBHZW5lcmF0ZWQgSFRNTC5cbiAqL1xuZnVuY3Rpb24gaGVscEJ1dHRvbiggdGV4dCwgY29udHJvbHMgKSB7XG5cdHJldHVybiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ5b2FzdF9oZWxwIHlvYXN0LWhlbHAtYnV0dG9uIGRhc2hpY29uc1wiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiICcgK1xuXHRcdCdhcmlhLWNvbnRyb2xzPVwiJyArIGNvbnRyb2xzICsgJ1wiPjxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+JyArIHRleHQgKyAnPC9zcGFuPjwvYnV0dG9uPic7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgSFRNTCBmb3IgYSBoZWxwIGJ1dHRvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHB1dCBpbiB0aGUgYnV0dG9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBIVE1MIElEIHRvIGdpdmUgdGhpcyBidXR0b24uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGdlbmVyYXRlZCBIVE1sLlxuICovXG5mdW5jdGlvbiBoZWxwVGV4dCggdGV4dCwgaWQgKSB7XG5cdHJldHVybiAnPHAgaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJ5b2FzdC1oZWxwLXBhbmVsXCI+JyArIHRleHQgKyAnPC9wPic7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRoZWxwQnV0dG9uOiBoZWxwQnV0dG9uLFxuXHRoZWxwVGV4dDogaGVscFRleHQsXG59O1xuIiwiLyogZ2xvYmFsIHlvYXN0U29jaWFsUHJldmlldywgdGlueU1DRSwgcmVxdWlyZSwgd3AsIFlvYXN0U0VPLCBhamF4dXJsICAqL1xuLyoganNoaW50IC1XMDk3ICovXG5cbnZhciBnZXRJbWFnZXMgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvaW1hZ2VJblRleHRcIiApO1xudmFyIGhlbHBQYW5lbCA9IHJlcXVpcmUoIFwiLi9oZWxwUGFuZWxcIiApO1xudmFyIGdldFRpdGxlUGxhY2Vob2xkZXIgPSByZXF1aXJlKCBcIi4uLy4uLy4uLy4uL2pzL3NyYy9hbmFseXNpcy9nZXRUaXRsZVBsYWNlaG9sZGVyXCIgKTtcbnZhciBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gcmVxdWlyZSggXCIuLi8uLi8uLi8uLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlclwiICk7XG5cbnZhciBfZGVib3VuY2UgPSByZXF1aXJlKCBcImxvZGFzaC9kZWJvdW5jZVwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9jbG9uZVwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIF9oYXMgPSByZXF1aXJlKCBcImxvZGFzaC9oYXNcIiApO1xudmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xuXG52YXIgSmVkID0gcmVxdWlyZSggXCJqZWRcIiApO1xudmFyIHNvY2lhbFByZXZpZXdzID0gcmVxdWlyZSggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiApO1xuXG4oIGZ1bmN0aW9uKCAkICkge1xuXHQvKipcblx0ICogV2Ugd2FudCB0byBzdG9yZSB0aGUgZmFsbGJhY2tzIGluIGFuIG9iamVjdCwgdG8gaGF2ZSBkaXJlY3RseSBhY2Nlc3MgdG8gdGhlbS5cblx0ICogQHR5cGUge3tjb250ZW50OiBzdHJpbmcsIGZlYXR1cmVkOiBzdHJpbmd9fVxuXHQgKi9cblx0dmFyIGltYWdlRmFsbEJhY2sgPSB7XG5cdFx0Y29udGVudDogXCJcIixcblx0XHRmZWF0dXJlZDogXCJcIixcblx0fTtcblxuXHR2YXIgY2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSB0cnVlO1xuXG5cdHZhciBGYWNlYm9va1ByZXZpZXcgPSBzb2NpYWxQcmV2aWV3cy5GYWNlYm9va1ByZXZpZXc7XG5cdHZhciBUd2l0dGVyUHJldmlldyA9IHNvY2lhbFByZXZpZXdzLlR3aXR0ZXJQcmV2aWV3O1xuXG5cdHZhciBmYWNlYm9va1ByZXZpZXcsIHR3aXR0ZXJQcmV2aWV3O1xuXG5cdHZhciB0cmFuc2xhdGlvbnMgPSB5b2FzdFNvY2lhbFByZXZpZXcuaTE4bjtcblxuXHR2YXIgaTE4biA9IG5ldyBKZWQoIGFkZExpYnJhcnlUcmFuc2xhdGlvbnMoIHRyYW5zbGF0aW9ucy5saWJyYXJ5ICkgKTtcblx0dmFyIGJpZ2dlckltYWdlcyA9IHt9O1xuXG5cdGxldCBwb3N0VGl0bGVJbnB1dElkID0gXCJ0aXRsZVwiO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBldmVudHMgZm9yIG9wZW5pbmcgdGhlIFdQIG1lZGlhIGxpYnJhcnkgd2hlbiBwcmVzc2luZyB0aGUgYnV0dG9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VVcmwgVGhlIGltYWdlIFVSTCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZUJ1dHRvbiBJRCBuYW1lIGZvciB0aGUgaW1hZ2UgYnV0dG9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3ZlQnV0dG9uIElEIG5hbWUgZm9yIHRoZSByZW1vdmUgYnV0dG9uLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbk1lZGlhU2VsZWN0IFRoZSBldmVudCB0aGF0IHdpbGwgYmUgcmFuIHdoZW4gaW1hZ2UgaXMgY2hvc2VuLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VQcmV2aWV3RWxlbWVudCBUaGUgaW1hZ2UgcHJldmlldyBlbGVtZW50IHRoYXQgY2FuIGJlIGNsaWNrZWQgdG8gdXBkYXRlIGFzIHdlbGwuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZFVwbG9hZEJ1dHRvbkV2ZW50cyggaW1hZ2VVcmwsIGltYWdlQnV0dG9uLCByZW1vdmVCdXR0b24sIG9uTWVkaWFTZWxlY3QsIGltYWdlUHJldmlld0VsZW1lbnQgKSB7XG5cdFx0LyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5cdFx0dmFyIHNvY2lhbFByZXZpZXdVcGxvYWRlciA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoIHtcblx0XHRcdHRpdGxlOiB5b2FzdFNvY2lhbFByZXZpZXcuY2hvb3NlX2ltYWdlLFxuXHRcdFx0YnV0dG9uOiB7IHRleHQ6IHlvYXN0U29jaWFsUHJldmlldy5jaG9vc2VfaW1hZ2UgfSxcblx0XHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHR9ICk7XG5cdFx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cblxuXHRcdHNvY2lhbFByZXZpZXdVcGxvYWRlci5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXR0YWNobWVudCA9IHNvY2lhbFByZXZpZXdVcGxvYWRlci5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XG5cblx0XHRcdC8vIFNldCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0aW1hZ2VVcmwudmFsKCBhdHRhY2htZW50LnVybCApO1xuXG5cdFx0XHRvbk1lZGlhU2VsZWN0KCk7XG5cblx0XHRcdCQoIHJlbW92ZUJ1dHRvbiApLnNob3coKTtcblx0XHR9ICk7XG5cblx0XHQkKCByZW1vdmVCdXR0b24gKS5jbGljayggZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBDbGVhciB0aGUgaW1hZ2UgVVJMXG5cdFx0XHRpbWFnZVVybC52YWwoIFwiXCIgKTtcblxuXHRcdFx0b25NZWRpYVNlbGVjdCgpO1xuXG5cdFx0XHQkKCByZW1vdmVCdXR0b24gKS5oaWRlKCk7XG5cdFx0fSApO1xuXG5cdFx0JCggaW1hZ2VCdXR0b24gKS5jbGljayggZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9wZW4oKTtcblx0XHR9ICk7XG5cblx0XHQkKCBpbWFnZVByZXZpZXdFbGVtZW50ICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oIGV2ZW50T2JqZWN0ICkge1xuXHRcdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9wZW4oKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgY2hvb3NlIGltYWdlIGJ1dHRvbiBhbmQgaGlkZXMgdGhlIGlucHV0IGZpZWxkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBUaGUgcHJldmlldyB0byBhZGQgdGhlIHVwbG9hZCBidXR0b24gdG8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkVXBsb2FkQnV0dG9uKCBwcmV2aWV3ICkge1xuXHRcdGlmICggdHlwZW9mIHdwLm1lZGlhID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpbWFnZVVybCA9ICQoIHByZXZpZXcuZWxlbWVudC5mb3JtQ29udGFpbmVyICkuZmluZCggXCIuanMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApO1xuXG5cdFx0dmFyIGJ1dHRvbkRpdiA9ICQoIFwiPGRpdj48L2Rpdj5cIiApO1xuXHRcdGJ1dHRvbkRpdi5pbnNlcnRBZnRlciggaW1hZ2VVcmwgKTtcblxuXHRcdHZhciB1cGxvYWRCdXR0b25UZXh0ID0gZ2V0VXBsb2FkQnV0dG9uVGV4dCggcHJldmlldyApO1xuXG5cdFx0dmFyIGltYWdlRmllbGRJZCAgICA9IGpRdWVyeSggaW1hZ2VVcmwgKS5hdHRyKCBcImlkXCIgKTtcblx0XHR2YXIgaW1hZ2VCdXR0b25JZCAgID0gaW1hZ2VGaWVsZElkICsgXCJfYnV0dG9uXCI7XG5cdFx0dmFyIGltYWdlQnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIGltYWdlQnV0dG9uSWQgKyAnXCIgJyArXG5cdFx0XHQnY2xhc3M9XCJidXR0b24gYnV0dG9uLXByaW1hcnkgd3BzZW9fcHJldmlld19pbWFnZV91cGxvYWRfYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiPicgKyB1cGxvYWRCdXR0b25UZXh0ICsgJzwvYnV0dG9uPic7XG5cblx0XHR2YXIgcmVtb3ZlQnV0dG9uSWQgICA9IGltYWdlRmllbGRJZCArIFwiX3JlbW92ZV9idXR0b25cIjtcblx0XHR2YXIgcmVtb3ZlQnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIHJlbW92ZUJ1dHRvbklkICsgJ1wiIHR5cGU9XCJidXR0b25cIiAnICtcblx0XHRcdCdjbGFzcz1cImJ1dHRvbiB3cHNlb19wcmV2aWV3X2ltYWdlX3VwbG9hZF9idXR0b25cIj4nICsgeW9hc3RTb2NpYWxQcmV2aWV3LnJlbW92ZUltYWdlQnV0dG9uICsgJzwvYnV0dG9uPic7XG5cblx0XHQkKCBidXR0b25EaXYgKS5hcHBlbmQoIGltYWdlQnV0dG9uSHRtbCApO1xuXHRcdCQoIGJ1dHRvbkRpdiApLmFwcGVuZCggcmVtb3ZlQnV0dG9uSHRtbCApO1xuXG5cdFx0aW1hZ2VVcmwuaGlkZSgpO1xuXHRcdGlmICggaW1hZ2VVcmwudmFsKCkgPT09IFwiXCIgKSB7XG5cdFx0XHQkKCBcIiNcIiArIHJlbW92ZUJ1dHRvbklkICkuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGJpbmRVcGxvYWRCdXR0b25FdmVudHMoXG5cdFx0XHRpbWFnZVVybCxcblx0XHRcdFwiI1wiICsgaW1hZ2VCdXR0b25JZCxcblx0XHRcdFwiI1wiICsgcmVtb3ZlQnV0dG9uSWQsXG5cdFx0XHRwcmV2aWV3LnVwZGF0ZVByZXZpZXcuYmluZCggcHJldmlldyApLFxuXHRcdFx0JCggcHJldmlldy5lbGVtZW50LmNvbnRhaW5lciApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdfX2ltYWdlXCIgKVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgY3VycmVudCBwYWdlOiBwb3N0IG9yIHRlcm0uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjdXJyZW50IHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDdXJyZW50VHlwZSgpIHtcblx0XHQvLyBXaGVuIHRoaXMgZmllbGQgZXhpc3RzLCBpdCBpcyBhIHBvc3QuXG5cdFx0aWYgKCAkKCBcIiNwb3N0X0lEXCIgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuIFwicG9zdFwiO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhpcyBmaWVsZCBpcyBmb3VuZCwgaXQgaXMgYSB0ZXJtLlxuXHRcdGlmICggJCggXCJpbnB1dFtuYW1lPXRhZ19JRF1cIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gXCJ0ZXJtXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcHJlZml4IGZvciB0aGUgZmllbGRzLCBiZWNhdXNlIG9mIHRoZSBmaWVsZHMgZm9yIHRoZSBwb3N0IGRvIGhhdmUgYW4gb3RoZXJlIHByZWZpeCB0aGFuIHRoZSBvbmVzIGZvclxuXHQgKiBhIHRheG9ub215LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Kn0gVGhlIHByZWZpeCB0byB1c2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBmaWVsZFByZWZpeCgpIHtcblx0XHRzd2l0Y2goIGdldEN1cnJlbnRUeXBlKCkgKSB7XG5cdFx0XHRjYXNlIFwicG9zdFwiOlxuXHRcdFx0XHRyZXR1cm4gXCJ5b2FzdF93cHNlb1wiO1xuXHRcdFx0Y2FzZSBcInRlcm1cIjpcblx0XHRcdFx0cmV0dXJuIFwid3BzZW9cIjtcblx0XHRcdGRlZmF1bHQgOlxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgdGlueW1jZSBhbmQgdGV4dGFyZWEgZmllbGRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbmFtZSBmb3IgdGhlIGNvbnRlbnQgZmllbGQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb250ZW50VGV4dE5hbWUoKSB7XG5cdFx0c3dpdGNoICggZ2V0Q3VycmVudFR5cGUoKSApIHtcblx0XHRcdGNhc2UgXCJwb3N0XCIgOlxuXHRcdFx0XHRyZXR1cm4gXCJjb250ZW50XCI7XG5cdFx0XHRjYXNlIFwidGVybVwiIDpcblx0XHRcdFx0cmV0dXJuIFwiZGVzY3JpcHRpb25cIjtcblx0XHRcdGRlZmF1bHQgOlxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgc29jaWFsIHByZXZpZXcgY29udGFpbmVyIGFuZCBoaWRlcyB0aGUgb2xkIGZvcm0gdGFibGUsIHRvIHJlcGxhY2UgaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzb2NpYWxQcmV2aWV3aG9sZGVyIFRoZSBob2xkZXIgZWxlbWVudCB3aGVyZSB0aGUgY29udGFpbmVyIHdpbGwgYmUgYXBwZW5kIHRvLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29udGFpbmVySWQgVGhlIGlkIHRoZSBjb250YWluZXIgd2lsbCBnZXRcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCBzb2NpYWxQcmV2aWV3aG9sZGVyLCBjb250YWluZXJJZCApIHtcblx0XHRzb2NpYWxQcmV2aWV3aG9sZGVyLmFwcGVuZCggJzxkaXYgaWQ9XCInICsgY29udGFpbmVySWQgKyAnXCI+PC9kaXY+JyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIG1ldGEgZGVzY3JpcHRpb24gZnJvbSB0aGUgc25pcHBldCBlZGl0b3Jcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRNZXRhRGVzY3JpcHRpb24oKSB7XG5cdFx0cmV0dXJuICQoIFwiI3lvYXN0X3dwc2VvX21ldGFkZXNjXCIgKS52YWwoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIG1ldGEgZGVzY3JpcHRpb24gZmllbGQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIG1ldGEgZGVzY3JpcHRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTb2NpYWxEZXNjcmlwdGlvblBsYWNlaG9sZGVyKCkge1xuXHRcdHZhciBkZXNjcmlwdGlvbiA9IGdldE1ldGFEZXNjcmlwdGlvbigpO1xuXG5cdFx0aWYgKCBcIlwiID09PSBkZXNjcmlwdGlvbiApIHtcblx0XHRcdGRlc2NyaXB0aW9uID0gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcigpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBhcmd1bWVudHMgZm9yIHRoZSBzb2NpYWwgcHJldmlldyBwcm90b3R5cGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0RWxlbWVudCBUaGUgZWxlbWVudCB3aGVyZSB0aGUgcHJldmlldyBpcyBsb2FkZWQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZFByZWZpeCBUaGUgcHJlZml4IGVhY2ggZm9ybSBlbGVtZW50IGhhcy5cblx0ICpcblx0ICogQHJldHVybnMgeyB7XG5cdCAqIFx0XHR0YXJnZXRFbGVtZW50OiBFbGVtZW50LFxuXHQgKlx0XHRkYXRhOiB7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKn0sXG5cdCAqIFx0XHRiYXNlVVJMOiAqLFxuXHQgKiBcdFx0Y2FsbGJhY2tzOiB7dXBkYXRlU29jaWFsUHJldmlldzogY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXd9XG5cdCAqIH0gfSBUaGUgYXJndW1lbnRzIGZvciB0aGUgc29jaWFsIHByZXZpZXcuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTb2NpYWxQcmV2aWV3QXJncyggdGFyZ2V0RWxlbWVudCwgZmllbGRQcmVmaXggKSB7XG5cdFx0dmFyIHRpdGxlUGxhY2Vob2xkZXIgPSBnZXRUaXRsZVBsYWNlaG9sZGVyKCk7XG5cdFx0dmFyIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBnZXRTb2NpYWxEZXNjcmlwdGlvblBsYWNlaG9sZGVyKCk7XG5cblx0XHR2YXIgYXJncyA9IHtcblx0XHRcdHRhcmdldEVsZW1lbnQ6ICQoIHRhcmdldEVsZW1lbnQgKS5nZXQoIDAgKSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dGl0bGU6ICQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi10aXRsZVwiICkudmFsKCksXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItZGVzY3JpcHRpb25cIiApLnZhbCgpLFxuXHRcdFx0XHRpbWFnZVVybDogJCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWltYWdlXCIgKS52YWwoKSxcblx0XHRcdH0sXG5cdFx0XHRiYXNlVVJMOiB5b2FzdFNvY2lhbFByZXZpZXcud2Vic2l0ZSxcblx0XHRcdGNhbGxiYWNrczoge1xuXHRcdFx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0XHQkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItdGl0bGVcIiApLnZhbCggZGF0YS50aXRsZSApO1xuXHRcdFx0XHRcdCQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1kZXNjcmlwdGlvblwiICkudmFsKCBkYXRhLmRlc2NyaXB0aW9uICk7XG5cdFx0XHRcdFx0JCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWltYWdlXCIgKS52YWwoIGRhdGEuaW1hZ2VVcmwgKTtcblxuXHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSBUd2l0dGVyIGlzIHVwZGF0ZWQgaWYgYSBGYWNlYm9vayBpbWFnZSBpcyBzZXRcblx0XHRcdFx0XHQkKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcImltYWdlVXBkYXRlXCIgKTtcblxuXHRcdFx0XHRcdGlmICggZGF0YS5pbWFnZVVybCAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdHZhciBidXR0b25QcmVmaXggPSB0YXJnZXRFbGVtZW50LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiUHJldmlld1wiLCBcIlwiICk7XG5cdFx0XHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggYnV0dG9uUHJlZml4LCB5b2FzdFNvY2lhbFByZXZpZXcudXNlT3RoZXJJbWFnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGpRdWVyeSggdGFyZ2V0RWxlbWVudCApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwidGl0bGVVcGRhdGVcIiApO1xuXHRcdFx0XHRcdGpRdWVyeSggdGFyZ2V0RWxlbWVudCApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiZGVzY3JpcHRpb25VcGRhdGVcIiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0XHRcdGlmICggaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRpbWFnZVVybCA9IGdldEZhbGxiYWNrSW1hZ2UoIFwiXCIgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gaW1hZ2VVcmw7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBmaWVsZFByZWZpeC5pbmRleE9mKCBcInR3aXR0ZXJcIiApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRpdGxlID09PSAkKCBcIiN0d2l0dGVyLWVkaXRvci10aXRsZVwiICkuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmYWNlYm9va1RpdGxlID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhIGlzVW5kZWZpbmVkKCBmYWNlYm9va1RpdGxlICkgJiYgZmFjZWJvb2tUaXRsZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZSA9IGZhY2Vib29rVGl0bGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFlvYXN0U0VPLndwLnJlcGxhY2VWYXJzUGx1Z2luLnJlcGxhY2VWYXJpYWJsZXMoIHRpdGxlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRcdFx0aWYgKCBmaWVsZFByZWZpeC5pbmRleE9mKCBcInR3aXR0ZXJcIiApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGRlc2NyaXB0aW9uID09PSAkKCBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiICkuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmYWNlYm9va0Rlc2NyaXB0aW9uID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBmYWNlYm9va0Rlc2NyaXB0aW9uICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gZmFjZWJvb2tEZXNjcmlwdGlvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBpc1VuZGVmaW5lZCggZGVzY3JpcHRpb24gKSApIHtcblx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSAkKCBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiICkuYXR0ciggJ3BsYWNlaG9sZGVyJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBZb2FzdFNFTy53cC5yZXBsYWNlVmFyc1BsdWdpbi5yZXBsYWNlVmFyaWFibGVzKCBkZXNjcmlwdGlvbiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdHBsYWNlaG9sZGVyOiB7XG5cdFx0XHRcdHRpdGxlOiB0aXRsZVBsYWNlaG9sZGVyLFxuXHRcdFx0fSxcblx0XHRcdGRlZmF1bHRWYWx1ZToge1xuXHRcdFx0XHR0aXRsZTogdGl0bGVQbGFjZWhvbGRlcixcblx0XHRcdH0sXG5cdFx0fTtcblxuXHRcdGlmICggXCJcIiAhPT0gZGVzY3JpcHRpb25QbGFjZWhvbGRlciApIHtcblx0XHRcdGFyZ3MucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdFx0YXJncy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmdzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyeSB0byBnZXQgdGhlIEZhY2Vib29rIGF1dGhvciBuYW1lIHZpYSBBSkFYIGFuZCBwdXQgaXQgdG8gdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RmFjZWJvb2tQcmV2aWV3fSBmYWNlYm9va1ByZXZpZXcgVGhlIEZhY2Vib29rIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFjZWJvb2tBdXRob3IoIGZhY2Vib29rUHJldmlldyApIHtcblx0XHQkLmdldChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19nZXRfZmFjZWJvb2tfbmFtZVwiLFxuXHRcdFx0XHRfYWpheF9ub25jZTogeW9hc3RTb2NpYWxQcmV2aWV3LmZhY2Vib29rTm9uY2UsXG5cdFx0XHRcdHVzZXJfaWQ6ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKS52YWwoKSxcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggYXV0aG9yICkge1xuXHRcdFx0XHRpZiAoIGF1dGhvciAhPT0gMCApIHtcblx0XHRcdFx0XHRmYWNlYm9va1ByZXZpZXcuc2V0QXV0aG9yKCBhdXRob3IgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgRmFjZWJvb2sgcHJldmlldy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGZhY2Vib29rSG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdEZhY2Vib29rKCBmYWNlYm9va0hvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCBmYWNlYm9va0hvbGRlciwgXCJmYWNlYm9va1ByZXZpZXdcIiApO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3ID0gbmV3IEZhY2Vib29rUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCBmYWNlYm9va1ByZXZpZXdDb250YWluZXIsIGZpZWxkUHJlZml4KCkgKyBcIl9vcGVuZ3JhcGhcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImltYWdlVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0VXBsb2FkQnV0dG9uVmFsdWUoIFwiZmFjZWJvb2tcIiwgZ2V0VXBsb2FkQnV0dG9uVGV4dCggZmFjZWJvb2tQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggZmFjZWJvb2tQcmV2aWV3ICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZhY2Vib29rUHJldmlldy5pbml0KCk7XG5cblx0XHRhZGRVcGxvYWRCdXR0b24oIGZhY2Vib29rUHJldmlldyApO1xuXG5cdFx0dmFyIHBvc3RBdXRob3JEcm9wZG93biA9ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKTtcblx0XHRpZiggcG9zdEF1dGhvckRyb3Bkb3duLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24ub24oIFwiY2hhbmdlXCIsIGdldEZhY2Vib29rQXV0aG9yLmJpbmQoIHRoaXMsIGZhY2Vib29rUHJldmlldyApICk7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24udHJpZ2dlciggXCJjaGFuZ2VcIiApO1xuXHRcdH1cblxuXHRcdCQoIFwiI1wiICsgcG9zdFRpdGxlSW5wdXRJZCApLm9uKFxuXHRcdFx0XCJrZXlkb3duIGtleXVwIGlucHV0IGZvY3VzIGJsdXJcIixcblx0XHRcdF9kZWJvdW5jZSggZmFjZWJvb2tQcmV2aWV3LnVwZGF0ZVByZXZpZXcuYmluZCggZmFjZWJvb2tQcmV2aWV3ICksIDUwMCApXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSB0d2l0dGVyIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0d2l0dGVySG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIHR3aXR0ZXIgcHJldmlldy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0VHdpdHRlciggdHdpdHRlckhvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCB0d2l0dGVySG9sZGVyLCBcInR3aXR0ZXJQcmV2aWV3XCIgKTtcblxuXHRcdHZhciB0d2l0dGVyUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI3R3aXR0ZXJQcmV2aWV3XCIgKTtcblx0XHR0d2l0dGVyUHJldmlldyA9IG5ldyBUd2l0dGVyUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCB0d2l0dGVyUHJldmlld0NvbnRhaW5lciwgZmllbGRQcmVmaXgoKSArIFwiX3R3aXR0ZXJcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHR0d2l0dGVyUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwiaW1hZ2VVcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggXCJ0d2l0dGVyXCIsIGdldFVwbG9hZEJ1dHRvblRleHQoIHR3aXR0ZXJQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggdHdpdHRlclByZXZpZXcgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJ0aXRsZVVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0dHdpdHRlclRpdGxlRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKVxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImRlc2NyaXB0aW9uVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjay5iaW5kKCB0aGlzLCB0d2l0dGVyUHJldmlldyApXG5cdFx0KTtcblxuXHRcdHR3aXR0ZXJQcmV2aWV3LmluaXQoKTtcblxuXHRcdGFkZFVwbG9hZEJ1dHRvbiggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyVGl0bGVGYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblxuXHRcdCQoIFwiI1wiICsgcG9zdFRpdGxlSW5wdXRJZCApLm9uKFxuXHRcdFx0XCJrZXlkb3duIGtleXVwIGlucHV0IGZvY3VzIGJsdXJcIixcblx0XHRcdF9kZWJvdW5jZSggdHdpdHRlclRpdGxlRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKSwgNTAwIClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdHdpdHRlciB0aXRsZSBpcyBlbXB0eSwgdXNlIHRoZSBGYWNlYm9vayB0aXRsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge1R3aXR0ZXJQcmV2aWV3fSB0d2l0dGVyUHJldmlldyBUaGUgdHdpdHRlciBwcmV2aWV3IG9iamVjdFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHR3aXR0ZXJUaXRsZUZhbGxiYWNrKCB0d2l0dGVyUHJldmlldyApIHtcblx0XHR2YXIgJHR3aXR0ZXJUaXRsZSA9ICQoIFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlXCIgKTtcblx0XHR2YXIgdHdpdHRlclRpdGxlID0gJHR3aXR0ZXJUaXRsZS52YWwoKTtcblx0XHRpZiggdHdpdHRlclRpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBmYWNlYm9va1RpdGxlID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIgKS52YWwoKTtcblx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rVGl0bGUgKSAmJiBmYWNlYm9va1RpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoIGZhY2Vib29rVGl0bGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoICR0d2l0dGVyVGl0bGUuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiB0d2l0dGVyIGRlc2NyaXB0aW9uIGlzIGVtcHR5LCB1c2UgdGhlIGRlc2NyaXB0aW9uIHRpdGxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7VHdpdHRlclByZXZpZXd9IHR3aXR0ZXJQcmV2aWV3IFRoZSB0d2l0dGVyIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHdpdHRlckRlc2NyaXB0aW9uRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICkge1xuXHRcdHZhciAkdHdpdHRlckRlc2NyaXB0aW9uID0gJCggXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIiApO1xuXHRcdHZhciB0d2l0dGVyRGVzY3JpcHRpb24gPSAkdHdpdHRlckRlc2NyaXB0aW9uLnZhbCgpO1xuXHRcdGlmKCB0d2l0dGVyRGVzY3JpcHRpb24gIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhY2Vib29rRGVzY3JpcHRpb24gPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIiApLnZhbCgpO1xuXHRcdGlmICggZmFjZWJvb2tEZXNjcmlwdGlvbiAhPT0gXCJcIiApIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCBmYWNlYm9va0Rlc2NyaXB0aW9uICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCAkdHdpdHRlckRlc2NyaXB0aW9uLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZmFsbGJhY2sgaW1hZ2UgZm9yIHRoZSBwcmV2aWV3IGlmIG5vIGltYWdlIGhhcyBiZWVuIHNldFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHNldCBmYWxsYmFjayBpbWFnZSBvbi5cblx0ICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG5cdGZ1bmN0aW9uIHNldEZhbGxiYWNrSW1hZ2UoIHByZXZpZXcgKSB7XG5cdFx0aWYgKCBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0XHRwcmV2aWV3LnNldEltYWdlKCBnZXRGYWxsYmFja0ltYWdlKCBcIlwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hhbmdlcyB0aGUgdXBsb2FkIGJ1dHRvbiB2YWx1ZSB3aGVuIHRoZXJlIGFyZSBmYWxsYmFjayBpbWFnZXMgcHJlc2VudC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblByZWZpeCBUaGUgdmFsdWUgYmVmb3JlIHRoZSBpZCBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCBvbiB0aGUgYnV0dG9uLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFVwbG9hZEJ1dHRvblZhbHVlKCBidXR0b25QcmVmaXgsIHRleHQgKSB7XG5cdFx0JCggXCIjXCIgICsgYnV0dG9uUHJlZml4ICsgXCItZWRpdG9yLWltYWdlVXJsX2J1dHRvblwiICkuaHRtbCggdGV4dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGltYWdlIGV2ZW50cyB0byBzZXQgdGhlIGZhbGxiYWNrIGFuZCByZW5kZXJpbmcgdGhlIHByZXZpZXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEltYWdlRXZlbnRzKCkge1xuXHRcdGlmICggZ2V0Q3VycmVudFR5cGUoKSA9PT0gXCJwb3N0XCIgKSB7XG5cdFx0XHRiaW5kRmVhdHVyZWRJbWFnZUV2ZW50cygpO1xuXHRcdH1cblxuXHRcdGJpbmRDb250ZW50RXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB0ZXh0IHRoYXQgdGhlIHVwbG9hZCBidXR0b24gbmVlZHMgdG8gZGlzcGxheVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHJlYWQgaW1hZ2UgZnJvbS5cblx0ICogQHJldHVybnMgeyp9IFRoZSB0ZXh0IGZvciB0aGUgYnV0dG9uLlxuICAgICAqL1xuXHRmdW5jdGlvbiBnZXRVcGxvYWRCdXR0b25UZXh0KCBwcmV2aWV3ICkge1xuXHRcdHJldHVybiBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgPyB5b2FzdFNvY2lhbFByZXZpZXcudXBsb2FkSW1hZ2UgOiB5b2FzdFNvY2lhbFByZXZpZXcudXNlT3RoZXJJbWFnZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgZXZlbnRzIGZvciB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEZlYXR1cmVkSW1hZ2VFdmVudHMoKSB7XG5cdFx0aWYgKCBpc1VuZGVmaW5lZCggd3AubWVkaWEgKSB8fCBpc1VuZGVmaW5lZCggd3AubWVkaWEuZmVhdHVyZWRJbWFnZSApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhlIGZlYXR1cmVkIGltYWdlIGlzIGJlaW5nIGNoYW5nZWRcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2Uub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGltYWdlRGV0YWlscyA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLmF0dHJpYnV0ZXM7XG5cblx0XHRcdGNhblJlYWRGZWF0dXJlZEltYWdlID0gdHJ1ZTtcblxuXHRcdFx0c2V0RmVhdHVyZWRJbWFnZSggaW1hZ2VEZXRhaWxzLnVybCApO1xuXHRcdH0gKTtcblxuXHRcdCQoIFwiI3Bvc3RpbWFnZWRpdlwiICkub24oIFwiY2xpY2tcIiwgXCIjcmVtb3ZlLXBvc3QtdGh1bWJuYWlsXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSBmYWxzZTtcblxuXHRcdFx0Y2xlYXJGZWF0dXJlZEltYWdlKCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGV2ZW50cyBmb3IgdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZENvbnRlbnRFdmVudHMoKSB7XG5cdFx0Ly8gQmluZCB0aGUgZXZlbnQgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGV4dCBlZGl0b3IuXG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gJCggXCIjXCIgKyBjb250ZW50VGV4dE5hbWUoKSApO1xuXHRcdGlmICggY29udGVudEVsZW1lbnQubGVuZ3RoID4gMCApIHtcblx0XHRcdGNvbnRlbnRFbGVtZW50Lm9uKCBcImlucHV0XCIsIGRldGVjdEltYWdlRmFsbGJhY2sgKTtcblx0XHR9XG5cblx0XHQvLyBCaW5kIHRoZSBldmVudHMgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGlueU1DRSBlZGl0b3IuXG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5vbiA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0dmFyIGV2ZW50cyA9IFsgXCJpbnB1dFwiLCBcImNoYW5nZVwiLCBcImN1dFwiLCBcInBhc3RlXCIgXTtcblx0XHRcdHRpbnlNQ0Uub24oIFwiYWRkRWRpdG9yXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0ZS5lZGl0b3Iub24oIGV2ZW50c1sgaSBdLCBkZXRlY3RJbWFnZUZhbGxiYWNrICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgZmFsbGJhY2sgdmFsdWUgYXMgYW4gZW1wdHkgdmFsdWUgYW5kIHJ1bnMgdGhlIGZhbGxiYWNrIG1ldGhvZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbGVhckZlYXR1cmVkSW1hZ2UoKSB7XG5cdFx0c2V0RmVhdHVyZWRJbWFnZSggXCJcIiApO1xuXHRcdGRldGVjdEltYWdlRmFsbGJhY2soKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbWFnZSBmYWxsYmFja3MgbGlrZSB0aGUgZmVhdHVyZWQgaW1hZ2UgKGluIGNhc2Ugb2YgYSBwb3N0KSBhbmQgdGhlIGNvbnRlbnQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGV0ZWN0SW1hZ2VGYWxsYmFjaygpIHtcblx0XHQvLyBJbiBjYXNlIG9mIGEgcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSBnZXRGZWF0dXJlZEltYWdlKCk7XG5cdFx0XHRzZXRGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdGlmICggZmVhdHVyZWRJbWFnZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNldENvbnRlbnRJbWFnZSggZ2V0Q29udGVudEltYWdlKCBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdFx0XHRzZXRDb250ZW50SW1hZ2UoIGltYWdlICk7XG5cdFx0fSApICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgYmFzZWQgb24gdGhlIGdpdmVuIGltYWdlIFVSTC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmVkSW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBmZWF0dXJlZEltYWdlICkge1xuXHRcdFx0aW1hZ2VGYWxsQmFjay5mZWF0dXJlZCA9IGZlYXR1cmVkSW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbnRlbnQgaW1hZ2UgYmFzZSBvbiB0aGUgZ2l2ZW4gaW1hZ2UgVVJMXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50SW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldENvbnRlbnRJbWFnZSggY29udGVudEltYWdlICkge1xuXHRcdGlmICggaW1hZ2VGYWxsQmFjay5jb250ZW50ICE9PSBjb250ZW50SW1hZ2UgKSB7XG5cdFx0XHRpbWFnZUZhbGxCYWNrLmNvbnRlbnQgPSBjb250ZW50SW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGZlYXR1cmVkIGltYWdlIHNvdXJjZSBmcm9tIHRoZSBET00uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB1cmwgdG8gdGhlIGZlYXR1cmVkIGltYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmVhdHVyZWRJbWFnZSgpIHtcblx0XHRpZiAoIGNhblJlYWRGZWF0dXJlZEltYWdlID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblxuXHRcdHZhciBwb3N0VGh1bWJuYWlsID0gJCggXCIuYXR0YWNobWVudC1wb3N0LXRodW1ibmFpbFwiICk7XG5cdFx0aWYgKCBwb3N0VGh1bWJuYWlsLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gJCggcG9zdFRodW1ibmFpbC5nZXQoIDAgKSApLmF0dHIoIFwic3JjXCIgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIGlmIGEgYmlnZ2VyIHNpemUgaXMgYXZhaWxhYmxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZmlyc3QgaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50SW1hZ2UoIGNhbGxiYWNrICkge1xuXHRcdHZhciBjb250ZW50ID0gZ2V0Q29udGVudCgpO1xuXG5cdFx0dmFyIGltYWdlcyA9IGdldEltYWdlcyggY29udGVudCApO1xuXHRcdHZhciBpbWFnZSAgPSBcIlwiO1xuXG5cdFx0aWYgKCBpbWFnZXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuIGltYWdlO1xuXHRcdH1cblxuXHRcdGRvIHtcblx0XHRcdHZhciBjdXJyZW50SW1hZ2UgPSBpbWFnZXMuc2hpZnQoKTtcblx0XHRcdGN1cnJlbnRJbWFnZSA9ICQoIGN1cnJlbnRJbWFnZSApO1xuXG5cdFx0XHR2YXIgaW1hZ2VTb3VyY2UgPSBjdXJyZW50SW1hZ2UucHJvcCggXCJzcmNcIiApO1xuXG5cdFx0XHRpZiAoIGltYWdlU291cmNlICkge1xuXHRcdFx0XHRpbWFnZSA9IGltYWdlU291cmNlO1xuXHRcdFx0fVxuXHRcdH0gd2hpbGUgKCBcIlwiID09PSBpbWFnZSAmJiBpbWFnZXMubGVuZ3RoID4gMCApO1xuXG5cdFx0aW1hZ2UgPSBnZXRCaWdnZXJJbWFnZSggaW1hZ2UsIGNhbGxiYWNrICk7XG5cblx0XHRyZXR1cm4gaW1hZ2U7XG5cdH1cblxuXHQvKipcblx0ICogVHJ5IHRvIHJldHJpZXZlIGEgYmlnZ2VyIGltYWdlIGZvciBhIGNlcnRhaW4gaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHVybCAgICAgIFRoZSBVUkwgdG8gcmV0cmlldmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBjYWxsIGlmIHRoZXJlIGlzIGEgYmlnZ2VyIGltYWdlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBiaWdnZXIgaW1hZ2UgdXJsLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0QmlnZ2VySW1hZ2UoIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCBfaGFzKCBiaWdnZXJJbWFnZXMsIHVybCApICkge1xuXHRcdFx0cmV0dXJuIGJpZ2dlckltYWdlc1sgdXJsIF07XG5cdFx0fVxuXG5cdFx0cmV0cmlldmVJbWFnZURhdGFGcm9tVVJMKCB1cmwsIGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdGJpZ2dlckltYWdlc1sgdXJsIF0gPSBpbWFnZVVybDtcblxuXHRcdFx0Y2FsbGJhY2soIGltYWdlVXJsICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGltYWdlIG1ldGFkYXRhIGZyb20gYW4gaW1hZ2UgdXJsIGFuZCBzYXZlcyBpdCB0byB0aGUgaW1hZ2UgbWFuYWdlciBhZnRlcndhcmRzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGltYWdlIFVSTCB0byByZXRyaWV2ZSB0aGUgbWV0YWRhdGEgZnJvbS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gY2FsbCB3aXRoIHRoZSBpbWFnZSBVUkwgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHJldHJpZXZlSW1hZ2VEYXRhRnJvbVVSTCggdXJsLCBjYWxsYmFjayApIHtcblx0XHQkLmdldEpTT04oIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJyZXRyaWV2ZV9pbWFnZV9kYXRhX2Zyb21fdXJsXCIsXG5cdFx0XHRpbWFnZVVSTDogdXJsLFxuXHRcdH0sIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggXCJzdWNjZXNzXCIgPT09IHJlc3BvbnNlLnN0YXR1cyApIHtcblx0XHRcdFx0Y2FsbGJhY2soIHJlc3BvbnNlLnJlc3VsdCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjb250ZW50IGZyb20gY3VycmVudCB2aXNpYmxlIGNvbnRlbnQgZWRpdG9yXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgdGlueW1jZSBib3guXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50KCkge1xuXHRcdGlmICggaXNUaW55TUNFQXZhaWxhYmxlKCkgKSB7XG5cdFx0XHRyZXR1cm4gdGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICkuZ2V0Q29udGVudCgpO1xuXHRcdH1cblxuXHRcdHZhciBjb250ZW50RWxlbWVudCA9ICQoIFwiI1wiICsgY29udGVudFRleHROYW1lKCkgKTtcblx0XHRpZiAoIGNvbnRlbnRFbGVtZW50Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudEVsZW1lbnQudmFsKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGlueW1jZSBpcyBhY3RpdmUgb24gdGhlIGN1cnJlbnQgcGFnZS5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiB0aW55bWNlIGlzIGF2YWlsYWJsZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGlzVGlueU1DRUF2YWlsYWJsZSgpIHtcblx0XHRpZiAoIHR5cGVvZiB0aW55TUNFID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0eXBlb2YgdGlueU1DRS5lZGl0b3JzID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0aW55TUNFLmVkaXRvcnMubGVuZ3RoID09PSAwIHx8XG5cdFx0XHR0aW55TUNFLmdldCggY29udGVudFRleHROYW1lKCkgKSA9PT0gbnVsbCB8fFxuXHRcdFx0dGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICApLmlzSGlkZGVuKCkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlcmUgaXMgYSBmYWxsYmFjayBpbWFnZSBsaWtlIHRoZSBmZWF0dXJlZCBpbWFnZSBvciB0aGUgZmlyc3QgaW1hZ2UgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkZWZhdWx0SW1hZ2UgVGhlIGRlZmF1bHQgaW1hZ2Ugd2hlbiBub3RoaW5nIGhhcyBiZWVuIGZvdW5kLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgaW1hZ2UgdG8gdXNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFsbGJhY2tJbWFnZSggZGVmYXVsdEltYWdlICkge1xuXHRcdC8vIFR3aXR0ZXIgYWx3YXlzIGZpcnN0IGZhbGxzIGJhY2sgdG8gRmFjZWJvb2tcblx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rUHJldmlldyApICYmIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsO1xuXHRcdH1cblxuXHRcdC8vIEluIGNhc2Ugb2YgYW4gcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBcIlwiICkge1xuXHRcdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5mZWF0dXJlZDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSBmZWF0dXJlZCBpbWFnZSBpcyBlbXB0eSwgdHJ5IGFuIGltYWdlIGluIHRoZSBjb250ZW50XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmNvbnRlbnQgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5jb250ZW50O1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIGRlZmF1bHRJbWFnZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybiBkZWZhdWx0SW1hZ2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgaGVscCBwYW5lbHMgdG8gdGhlIHNvY2lhbCBwcmV2aWV3c1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFkZEhlbHBQYW5lbHMoKSB7XG5cdFx0dmFyIHBhbmVscyA9IFtcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjZmFjZWJvb2stZWRpdG9yLWltYWdlVXJsX19jYXJldC1ob29rXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLmZhY2Vib29rSW1hZ2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAuZmFjZWJvb2tJbWFnZSxcblx0XHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWltYWdlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI2ZhY2Vib29rLWVkaXRvci10aXRsZV9fY2FyZXQtaG9va1wiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi5mYWNlYm9va1RpdGxlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLmZhY2Vib29rVGl0bGUsXG5cdFx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci10aXRsZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25fX2NhcmV0LWhvb2tcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24uZmFjZWJvb2tEZXNjcmlwdGlvbixcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC5mYWNlYm9va0Rlc2NyaXB0aW9uLFxuXHRcdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb24taGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItaW1hZ2VVcmxfX2NhcmV0LWhvb2tcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlckltYWdlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJJbWFnZSxcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItaW1hZ2UtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItdGl0bGVfX2NhcmV0LWhvb2tcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlclRpdGxlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJUaXRsZSxcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItdGl0bGUtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25fX2NhcmV0LWhvb2tcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlckRlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJEZXNjcmlwdGlvbixcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb24taGVscFwiLFxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0Zm9yRWFjaCggcGFuZWxzLCBmdW5jdGlvbiggcGFuZWwgKSB7XG5cdFx0XHQkKCBwYW5lbC5iZWZvcmVFbGVtZW50ICkuYmVmb3JlKFxuXHRcdFx0XHRoZWxwUGFuZWwuaGVscEJ1dHRvbiggcGFuZWwuYnV0dG9uVGV4dCwgcGFuZWwuaWQgKSArXG5cdFx0XHRcdGhlbHBQYW5lbC5oZWxwVGV4dCggcGFuZWwuZGVzY3JpcHRpb25UZXh0LCBwYW5lbC5pZCApXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCQoIFwiLnNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKS5vbiggXCJjbGlja1wiLCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkYnV0dG9uID0gJCggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSAkKCBcIiNcIiArICRidXR0b24uYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSApLFxuXHRcdFx0XHRpc1BhbmVsVmlzaWJsZSA9IGhlbHBQYW5lbC5pcyggXCI6dmlzaWJsZVwiICk7XG5cblx0XHRcdCQoIGhlbHBQYW5lbCApLnNsaWRlVG9nZ2xlKCAyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkYnV0dG9uLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIGlzUGFuZWxWaXNpYmxlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgbGlicmFyeSB0cmFuc2xhdGlvbnNcblx0ICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyBUaGUgdHJhbnNsYXRpb25zIHRvIHVzZS5cblx0ICogQHJldHVybnMge09iamVjdH0gdHJhbnNsYXRpb25zIG1hcHBlZCB0byB0aGUgcHJvcGVyIGRvbWFpbi5cblx0ICovXG5cdGZ1bmN0aW9uIGFkZExpYnJhcnlUcmFuc2xhdGlvbnMoIHRyYW5zbGF0aW9ucyApIHtcblx0XHRpZiAoIHR5cGVvZiB0cmFuc2xhdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRyYW5zbGF0aW9ucy5kb21haW4gIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHR0cmFuc2xhdGlvbnMuZG9tYWluID0gXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjtcblx0XHRcdHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiBdID0gY2xvbmUoIHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ3b3JkcHJlc3Mtc2VvLXByZW1pdW1cIiBdICk7XG5cblx0XHRcdGRlbGV0ZSggdHJhbnNsYXRpb25zLmxvY2FsZV9kYXRhWyBcIndvcmRwcmVzcy1zZW8tcHJlbWl1bVwiIF0gKTtcblxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0aW9ucztcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZG9tYWluOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdFx0bG9jYWxlX2RhdGE6IHtcblx0XHRcdFx0XCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjoge1xuXHRcdFx0XHRcdFwiXCI6IHt9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHNvY2lhbCBwcmV2aWV3cy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0WW9hc3RTb2NpYWxQcmV2aWV3cygpIHtcblx0XHR2YXIgZmFjZWJvb2tIb2xkZXIgPSAkKCBcIiN3cHNlb19mYWNlYm9va1wiICk7XG5cdFx0dmFyIHR3aXR0ZXJIb2xkZXIgPSAkKCBcIiN3cHNlb190d2l0dGVyXCIgKTtcblxuXHRcdGlmICggZmFjZWJvb2tIb2xkZXIubGVuZ3RoID4gMCB8fCB0d2l0dGVySG9sZGVyLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRqUXVlcnkoIHdpbmRvdyApLm9uKCBcIllvYXN0U0VPOnJlYWR5XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkZXRlY3RJbWFnZUZhbGxiYWNrKCk7XG5cblx0XHRcdFx0aWYgKCBmYWNlYm9va0hvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGluaXRGYWNlYm9vayggZmFjZWJvb2tIb2xkZXIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggdHdpdHRlckhvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGluaXRUd2l0dGVyKCB0d2l0dGVySG9sZGVyICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhZGRIZWxwUGFuZWxzKCk7XG5cdFx0XHRcdGJpbmRJbWFnZUV2ZW50cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdCQoIGluaXRZb2FzdFNvY2lhbFByZXZpZXdzICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyoqXG4gKiBAcHJlc2VydmUgamVkLmpzIGh0dHBzOi8vZ2l0aHViLmNvbS9TbGV4QXh0b24vSmVkXG4gKi9cbi8qXG4tLS0tLS0tLS0tLVxuQSBnZXR0ZXh0IGNvbXBhdGlibGUgaTE4biBsaWJyYXJ5IGZvciBtb2Rlcm4gSmF2YVNjcmlwdCBBcHBsaWNhdGlvbnNcblxuYnkgQWxleCBTZXh0b24gLSBBbGV4U2V4dG9uIFthdF0gZ21haWwgLSBAU2xleEF4dG9uXG5cbk1JVCBMaWNlbnNlXG5cbkEgalF1ZXJ5IEZvdW5kYXRpb24gcHJvamVjdCAtIHJlcXVpcmVzIENMQSB0byBjb250cmlidXRlIC1cbmh0dHBzOi8vY29udHJpYnV0ZS5qcXVlcnkub3JnL0NMQS9cblxuXG5cbkplZCBvZmZlcnMgdGhlIGVudGlyZSBhcHBsaWNhYmxlIEdOVSBnZXR0ZXh0IHNwZWMnZCBzZXQgb2ZcbmZ1bmN0aW9ucywgYnV0IGFsc28gb2ZmZXJzIHNvbWUgbmljZXIgd3JhcHBlcnMgYXJvdW5kIHRoZW0uXG5UaGUgYXBpIGZvciBnZXR0ZXh0IHdhcyB3cml0dGVuIGZvciBhIGxhbmd1YWdlIHdpdGggbm8gZnVuY3Rpb25cbm92ZXJsb2FkaW5nLCBzbyBKZWQgYWxsb3dzIGEgbGl0dGxlIG1vcmUgb2YgdGhhdC5cblxuTWFueSB0aGFua3MgdG8gSm9zaHVhIEkuIE1pbGxlciAtIHVucnRzdEBjcGFuLm9yZyAtIHdobyB3cm90ZVxuZ2V0dGV4dC5qcyBiYWNrIGluIDIwMDguIEkgd2FzIGFibGUgdG8gdmV0IGEgbG90IG9mIG15IGlkZWFzXG5hZ2FpbnN0IGhpcy4gSSBhbHNvIG1hZGUgc3VyZSBKZWQgcGFzc2VkIGFnYWluc3QgaGlzIHRlc3RzXG5pbiBvcmRlciB0byBvZmZlciBlYXN5IHVwZ3JhZGVzIC0tIGpzZ2V0dGV4dC5iZXJsaW9zLmRlXG4qL1xuKGZ1bmN0aW9uIChyb290LCB1bmRlZikge1xuXG4gIC8vIFNldCB1cCBzb21lIHVuZGVyc2NvcmUtc3R5bGUgZnVuY3Rpb25zLCBpZiB5b3UgYWxyZWFkeSBoYXZlXG4gIC8vIHVuZGVyc2NvcmUsIGZlZWwgZnJlZSB0byBkZWxldGUgdGhpcyBzZWN0aW9uLCBhbmQgdXNlIGl0XG4gIC8vIGRpcmVjdGx5LCBob3dldmVyLCB0aGUgYW1vdW50IG9mIGZ1bmN0aW9ucyB1c2VkIGRvZXNuJ3RcbiAgLy8gd2FycmFudCBoYXZpbmcgdW5kZXJzY29yZSBhcyBhIGZ1bGwgZGVwZW5kZW5jeS5cbiAgLy8gVW5kZXJzY29yZSAxLjMuMCB3YXMgdXNlZCB0byBwb3J0IGFuZCBpcyBsaWNlbnNlZFxuICAvLyB1bmRlciB0aGUgTUlUIExpY2Vuc2UgYnkgSmVyZW15IEFzaGtlbmFzLlxuICB2YXIgQXJyYXlQcm90byAgICA9IEFycmF5LnByb3RvdHlwZSxcbiAgICAgIE9ialByb3RvICAgICAgPSBPYmplY3QucHJvdG90eXBlLFxuICAgICAgc2xpY2UgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgICBoYXNPd25Qcm9wICAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHksXG4gICAgICBuYXRpdmVGb3JFYWNoID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgICAgYnJlYWtlciAgICAgICA9IHt9O1xuXG4gIC8vIFdlJ3JlIG5vdCB1c2luZyB0aGUgT09QIHN0eWxlIF8gc28gd2UgZG9uJ3QgbmVlZCB0aGVcbiAgLy8gZXh0cmEgbGV2ZWwgb2YgaW5kaXJlY3Rpb24uIFRoaXMgc3RpbGwgbWVhbnMgdGhhdCB5b3VcbiAgLy8gc3ViIG91dCBmb3IgcmVhbCBgX2AgdGhvdWdoLlxuICB2YXIgXyA9IHtcbiAgICBmb3JFYWNoIDogZnVuY3Rpb24oIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQgKSB7XG4gICAgICB2YXIgaSwgbCwga2V5O1xuICAgICAgaWYgKCBvYmogPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoICkge1xuICAgICAgICBvYmouZm9yRWFjaCggaXRlcmF0b3IsIGNvbnRleHQgKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCApIHtcbiAgICAgICAgZm9yICggaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIGlmICggaSBpbiBvYmogJiYgaXRlcmF0b3IuY2FsbCggY29udGV4dCwgb2JqW2ldLCBpLCBvYmogKSA9PT0gYnJlYWtlciApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKCBoYXNPd25Qcm9wLmNhbGwoIG9iaiwga2V5ICkgKSB7XG4gICAgICAgICAgICBpZiAoIGl0ZXJhdG9yLmNhbGwgKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaiApID09PSBicmVha2VyICkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBleHRlbmQgOiBmdW5jdGlvbiggb2JqICkge1xuICAgICAgdGhpcy5mb3JFYWNoKCBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKSwgZnVuY3Rpb24gKCBzb3VyY2UgKSB7XG4gICAgICAgIGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH07XG4gIC8vIEVORCBNaW5pYXR1cmUgdW5kZXJzY29yZSBpbXBsXG5cbiAgLy8gSmVkIGlzIGEgY29uc3RydWN0b3IgZnVuY3Rpb25cbiAgdmFyIEplZCA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcbiAgICAvLyBTb21lIG1pbmltYWwgZGVmYXVsdHNcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgXCJsb2NhbGVfZGF0YVwiIDoge1xuICAgICAgICBcIm1lc3NhZ2VzXCIgOiB7XG4gICAgICAgICAgXCJcIiA6IHtcbiAgICAgICAgICAgIFwiZG9tYWluXCIgICAgICAgOiBcIm1lc3NhZ2VzXCIsXG4gICAgICAgICAgICBcImxhbmdcIiAgICAgICAgIDogXCJlblwiLFxuICAgICAgICAgICAgXCJwbHVyYWxfZm9ybXNcIiA6IFwibnBsdXJhbHM9MjsgcGx1cmFsPShuICE9IDEpO1wiXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFRoZXJlIGFyZSBubyBkZWZhdWx0IGtleXMsIHRob3VnaFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVGhlIGRlZmF1bHQgZG9tYWluIGlmIG9uZSBpcyBtaXNzaW5nXG4gICAgICBcImRvbWFpblwiIDogXCJtZXNzYWdlc1wiLFxuICAgICAgLy8gZW5hYmxlIGRlYnVnIG1vZGUgdG8gbG9nIHVudHJhbnNsYXRlZCBzdHJpbmdzIHRvIHRoZSBjb25zb2xlXG4gICAgICBcImRlYnVnXCIgOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBNaXggaW4gdGhlIHNlbnQgb3B0aW9ucyB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCgge30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMgKTtcbiAgICB0aGlzLnRleHRkb21haW4oIHRoaXMub3B0aW9ucy5kb21haW4gKTtcblxuICAgIGlmICggb3B0aW9ucy5kb21haW4gJiYgISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIHRoaXMub3B0aW9ucy5kb21haW4gXSApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGV4dCBkb21haW4gc2V0IHRvIG5vbi1leGlzdGVudCBkb21haW46IGAnICsgb3B0aW9ucy5kb21haW4gKyAnYCcpO1xuICAgIH1cbiAgfTtcblxuICAvLyBUaGUgZ2V0dGV4dCBzcGVjIHNldHMgdGhpcyBjaGFyYWN0ZXIgYXMgdGhlIGRlZmF1bHRcbiAgLy8gZGVsaW1pdGVyIGZvciBjb250ZXh0IGxvb2t1cHMuXG4gIC8vIGUuZy46IGNvbnRleHRcXHUwMDA0a2V5XG4gIC8vIElmIHlvdXIgdHJhbnNsYXRpb24gY29tcGFueSB1c2VzIHNvbWV0aGluZyBkaWZmZXJlbnQsXG4gIC8vIGp1c3QgY2hhbmdlIHRoaXMgYXQgYW55IHRpbWUgYW5kIGl0IHdpbGwgdXNlIHRoYXQgaW5zdGVhZC5cbiAgSmVkLmNvbnRleHRfZGVsaW1pdGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZSggNCApO1xuXG4gIGZ1bmN0aW9uIGdldFBsdXJhbEZvcm1GdW5jICggcGx1cmFsX2Zvcm1fc3RyaW5nICkge1xuICAgIHJldHVybiBKZWQuUEYuY29tcGlsZSggcGx1cmFsX2Zvcm1fc3RyaW5nIHx8IFwibnBsdXJhbHM9MjsgcGx1cmFsPShuICE9IDEpO1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENoYWluKCBrZXksIGkxOG4gKXtcbiAgICB0aGlzLl9rZXkgPSBrZXk7XG4gICAgdGhpcy5faTE4biA9IGkxOG47XG4gIH1cblxuICAvLyBDcmVhdGUgYSBjaGFpbmFibGUgYXBpIGZvciBhZGRpbmcgYXJncyBwcmV0dGlseVxuICBfLmV4dGVuZCggQ2hhaW4ucHJvdG90eXBlLCB7XG4gICAgb25Eb21haW4gOiBmdW5jdGlvbiAoIGRvbWFpbiApIHtcbiAgICAgIHRoaXMuX2RvbWFpbiA9IGRvbWFpbjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgd2l0aENvbnRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQgKSB7XG4gICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaWZQbHVyYWwgOiBmdW5jdGlvbiAoIG51bSwgcGtleSApIHtcbiAgICAgIHRoaXMuX3ZhbCA9IG51bTtcbiAgICAgIHRoaXMuX3BrZXkgPSBwa2V5O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBmZXRjaCA6IGZ1bmN0aW9uICggc0FyciApIHtcbiAgICAgIGlmICgge30udG9TdHJpbmcuY2FsbCggc0FyciApICE9ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICAgIHNBcnIgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKCBzQXJyICYmIHNBcnIubGVuZ3RoID8gSmVkLnNwcmludGYgOiBmdW5jdGlvbih4KXsgcmV0dXJuIHg7IH0gKShcbiAgICAgICAgdGhpcy5faTE4bi5kY25wZ2V0dGV4dCh0aGlzLl9kb21haW4sIHRoaXMuX2NvbnRleHQsIHRoaXMuX2tleSwgdGhpcy5fcGtleSwgdGhpcy5fdmFsKSxcbiAgICAgICAgc0FyclxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFkZCBmdW5jdGlvbnMgdG8gdGhlIEplZCBwcm90b3R5cGUuXG4gIC8vIFRoZXNlIHdpbGwgYmUgdGhlIGZ1bmN0aW9ucyBvbiB0aGUgb2JqZWN0IHRoYXQncyByZXR1cm5lZFxuICAvLyBmcm9tIGNyZWF0aW5nIGEgYG5ldyBKZWQoKWBcbiAgLy8gVGhlc2Ugc2VlbSByZWR1bmRhbnQsIGJ1dCB0aGV5IGd6aXAgcHJldHR5IHdlbGwuXG4gIF8uZXh0ZW5kKCBKZWQucHJvdG90eXBlLCB7XG4gICAgLy8gVGhlIHNleGllciBhcGkgc3RhcnQgcG9pbnRcbiAgICB0cmFuc2xhdGUgOiBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIHJldHVybiBuZXcgQ2hhaW4oIGtleSwgdGhpcyApO1xuICAgIH0sXG5cbiAgICB0ZXh0ZG9tYWluIDogZnVuY3Rpb24gKCBkb21haW4gKSB7XG4gICAgICBpZiAoICEgZG9tYWluICkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dGRvbWFpbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RleHRkb21haW4gPSBkb21haW47XG4gICAgfSxcblxuICAgIGdldHRleHQgOiBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIGRnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGtleSApIHtcbiAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIGRjZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluICwga2V5IC8qLCBjYXRlZ29yeSAqLyApIHtcbiAgICAgIC8vIElnbm9yZXMgdGhlIGNhdGVnb3J5IGFueXdheXNcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBuZ2V0dGV4dCA6IGZ1bmN0aW9uICggc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZG5nZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkY25nZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIHNrZXksIHBrZXksIHZhbC8qLCBjYXRlZ29yeSAqLykge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIHBnZXR0ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0LCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIGRwZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBkY3BnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIGtleS8qLCBjYXRlZ29yeSAqLykge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRucGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgLy8gVGhlIG1vc3QgZnVsbHkgcXVhbGlmaWVkIGdldHRleHQgZnVuY3Rpb24uIEl0IGhhcyBldmVyeSBvcHRpb24uXG4gICAgLy8gU2luY2UgaXQgaGFzIGV2ZXJ5IG9wdGlvbiwgd2UgY2FuIHVzZSBpdCBmcm9tIGV2ZXJ5IG90aGVyIG1ldGhvZC5cbiAgICAvLyBUaGlzIGlzIHRoZSBicmVhZCBhbmQgYnV0dGVyLlxuICAgIC8vIFRlY2huaWNhbGx5IHRoZXJlIHNob3VsZCBiZSBvbmUgbW9yZSBhcmd1bWVudCBpbiB0aGlzIGZ1bmN0aW9uIGZvciAnQ2F0ZWdvcnknLFxuICAgIC8vIGJ1dCBzaW5jZSB3ZSBuZXZlciB1c2UgaXQsIHdlIG1pZ2h0IGFzIHdlbGwgbm90IHdhc3RlIHRoZSBieXRlcyB0byBkZWZpbmUgaXQuXG4gICAgZGNucGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5LCB2YWwgKSB7XG4gICAgICAvLyBTZXQgc29tZSBkZWZhdWx0c1xuXG4gICAgICBwbHVyYWxfa2V5ID0gcGx1cmFsX2tleSB8fCBzaW5ndWxhcl9rZXk7XG5cbiAgICAgIC8vIFVzZSB0aGUgZ2xvYmFsIGRvbWFpbiBkZWZhdWx0IGlmIG9uZVxuICAgICAgLy8gaXNuJ3QgZXhwbGljaXRseSBwYXNzZWQgaW5cbiAgICAgIGRvbWFpbiA9IGRvbWFpbiB8fCB0aGlzLl90ZXh0ZG9tYWluO1xuXG4gICAgICB2YXIgZmFsbGJhY2s7XG5cbiAgICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2VzXG5cbiAgICAgIC8vIE5vIG9wdGlvbnMgZm91bmRcbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMgKSB7XG4gICAgICAgIC8vIFRoZXJlJ3MgbGlrZWx5IHNvbWV0aGluZyB3cm9uZywgYnV0IHdlJ2xsIHJldHVybiB0aGUgY29ycmVjdCBrZXkgZm9yIGVuZ2xpc2hcbiAgICAgICAgLy8gV2UgZG8gdGhpcyBieSBpbnN0YW50aWF0aW5nIGEgYnJhbmQgbmV3IEplZCBpbnN0YW5jZSB3aXRoIHRoZSBkZWZhdWx0IHNldFxuICAgICAgICAvLyBmb3IgZXZlcnl0aGluZyB0aGF0IGNvdWxkIGJlIGJyb2tlbi5cbiAgICAgICAgZmFsbGJhY2sgPSBuZXcgSmVkKCk7XG4gICAgICAgIHJldHVybiBmYWxsYmFjay5kY25wZ2V0dGV4dC5jYWxsKCBmYWxsYmFjaywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSwgdmFsICk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vIHRyYW5zbGF0aW9uIGRhdGEgcHJvdmlkZWRcbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGEgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbG9jYWxlIGRhdGEgcHJvdmlkZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIGRvbWFpbiBdICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvbWFpbiBgJyArIGRvbWFpbiArICdgIHdhcyBub3QgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIGRvbWFpbiBdWyBcIlwiIF0gKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbG9jYWxlIG1ldGEgaW5mb3JtYXRpb24gcHJvdmlkZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdHJ1dGh5IGtleS4gT3RoZXJ3aXNlIHdlIG1pZ2h0IHN0YXJ0IGxvb2tpbmdcbiAgICAgIC8vIGludG8gdGhlIGVtcHR5IHN0cmluZyBrZXksIHdoaWNoIGlzIHRoZSBvcHRpb25zIGZvciB0aGUgbG9jYWxlXG4gICAgICAvLyBkYXRhLlxuICAgICAgaWYgKCAhIHNpbmd1bGFyX2tleSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB0cmFuc2xhdGlvbiBrZXkgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgID0gY29udGV4dCA/IGNvbnRleHQgKyBKZWQuY29udGV4dF9kZWxpbWl0ZXIgKyBzaW5ndWxhcl9rZXkgOiBzaW5ndWxhcl9rZXksXG4gICAgICAgICAgbG9jYWxlX2RhdGEgPSB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGEsXG4gICAgICAgICAgZGljdCA9IGxvY2FsZV9kYXRhWyBkb21haW4gXSxcbiAgICAgICAgICBkZWZhdWx0Q29uZiA9IChsb2NhbGVfZGF0YS5tZXNzYWdlcyB8fCB0aGlzLmRlZmF1bHRzLmxvY2FsZV9kYXRhLm1lc3NhZ2VzKVtcIlwiXSxcbiAgICAgICAgICBwbHVyYWxGb3JtcyA9IGRpY3RbXCJcIl0ucGx1cmFsX2Zvcm1zIHx8IGRpY3RbXCJcIl1bXCJQbHVyYWwtRm9ybXNcIl0gfHwgZGljdFtcIlwiXVtcInBsdXJhbC1mb3Jtc1wiXSB8fCBkZWZhdWx0Q29uZi5wbHVyYWxfZm9ybXMgfHwgZGVmYXVsdENvbmZbXCJQbHVyYWwtRm9ybXNcIl0gfHwgZGVmYXVsdENvbmZbXCJwbHVyYWwtZm9ybXNcIl0sXG4gICAgICAgICAgdmFsX2xpc3QsXG4gICAgICAgICAgcmVzO1xuXG4gICAgICB2YXIgdmFsX2lkeDtcbiAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyB2YWx1ZSBwYXNzZWQgaW47IGFzc3VtZSBzaW5ndWxhciBrZXkgbG9va3VwLlxuICAgICAgICB2YWxfaWR4ID0gMDtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVmFsdWUgaGFzIGJlZW4gcGFzc2VkIGluOyB1c2UgcGx1cmFsLWZvcm1zIGNhbGN1bGF0aW9ucy5cblxuICAgICAgICAvLyBIYW5kbGUgaW52YWxpZCBudW1iZXJzLCBidXQgdHJ5IGNhc3Rpbmcgc3RyaW5ncyBmb3IgZ29vZCBtZWFzdXJlXG4gICAgICAgIGlmICggdHlwZW9mIHZhbCAhPSAnbnVtYmVyJyApIHtcbiAgICAgICAgICB2YWwgPSBwYXJzZUludCggdmFsLCAxMCApO1xuXG4gICAgICAgICAgaWYgKCBpc05hTiggdmFsICkgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBudW1iZXIgdGhhdCB3YXMgcGFzc2VkIGluIGlzIG5vdCBhIG51bWJlci4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YWxfaWR4ID0gZ2V0UGx1cmFsRm9ybUZ1bmMocGx1cmFsRm9ybXMpKHZhbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRocm93IGFuIGVycm9yIGlmIGEgZG9tYWluIGlzbid0IGZvdW5kXG4gICAgICBpZiAoICEgZGljdCApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBkb21haW4gbmFtZWQgYCcgKyBkb21haW4gKyAnYCBjb3VsZCBiZSBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFsX2xpc3QgPSBkaWN0WyBrZXkgXTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbWF0Y2gsIHRoZW4gcmV2ZXJ0IGJhY2sgdG9cbiAgICAgIC8vIGVuZ2xpc2ggc3R5bGUgc2luZ3VsYXIvcGx1cmFsIHdpdGggdGhlIGtleXMgcGFzc2VkIGluLlxuICAgICAgaWYgKCAhIHZhbF9saXN0IHx8IHZhbF9pZHggPiB2YWxfbGlzdC5sZW5ndGggKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWlzc2luZ19rZXlfY2FsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMubWlzc2luZ19rZXlfY2FsbGJhY2soa2V5LCBkb21haW4pO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IFsgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5IF07XG5cbiAgICAgICAgLy8gY29sbGVjdCB1bnRyYW5zbGF0ZWQgc3RyaW5nc1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnPT09dHJ1ZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMocGx1cmFsRm9ybXMpKCB2YWwgKSBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzWyBnZXRQbHVyYWxGb3JtRnVuYygpKCB2YWwgKSBdO1xuICAgICAgfVxuXG4gICAgICByZXMgPSB2YWxfbGlzdFsgdmFsX2lkeCBdO1xuXG4gICAgICAvLyBUaGlzIGluY2x1ZGVzIGVtcHR5IHN0cmluZ3Mgb24gcHVycG9zZVxuICAgICAgaWYgKCAhIHJlcyAgKSB7XG4gICAgICAgIHJlcyA9IFsgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5IF07XG4gICAgICAgIHJldHVybiByZXNbIGdldFBsdXJhbEZvcm1GdW5jKCkoIHZhbCApIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLyBXZSBhZGQgaW4gc3ByaW50ZiBjYXBhYmlsaXRpZXMgZm9yIHBvc3QgdHJhbnNsYXRpb24gdmFsdWUgaW50ZXJvbGF0aW9uXG4gIC8vIFRoaXMgaXMgbm90IGludGVybmFsbHkgdXNlZCwgc28geW91IGNhbiByZW1vdmUgaXQgaWYgeW91IGhhdmUgdGhpc1xuICAvLyBhdmFpbGFibGUgc29tZXdoZXJlIGVsc2UsIG9yIHdhbnQgdG8gdXNlIGEgZGlmZmVyZW50IHN5c3RlbS5cblxuICAvLyBXZSBfc2xpZ2h0bHlfIG1vZGlmeSB0aGUgbm9ybWFsIHNwcmludGYgYmVoYXZpb3IgdG8gbW9yZSBncmFjZWZ1bGx5IGhhbmRsZVxuICAvLyB1bmRlZmluZWQgdmFsdWVzLlxuXG4gIC8qKlxuICAgc3ByaW50ZigpIGZvciBKYXZhU2NyaXB0IDAuNy1iZXRhMVxuICAgaHR0cDovL3d3dy5kaXZlaW50b2phdmFzY3JpcHQuY29tL3Byb2plY3RzL2phdmFzY3JpcHQtc3ByaW50ZlxuXG4gICBDb3B5cmlnaHQgKGMpIEFsZXhhbmRydSBNYXJhc3RlYW51IDxhbGV4YWhvbGljIFthdCkgZ21haWwgKGRvdF0gY29tPlxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAgICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICAgICAqIE5laXRoZXIgdGhlIG5hbWUgb2Ygc3ByaW50ZigpIGZvciBKYXZhU2NyaXB0IG5vciB0aGVcbiAgICAgICAgIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXG4gICAgICAgICBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblxuICAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG4gICBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuICAgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRVxuICAgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgQWxleGFuZHJ1IE1hcmFzdGVhbnUgQkUgTElBQkxFIEZPUiBBTllcbiAgIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcbiAgIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gICovXG4gIHZhciBzcHJpbnRmID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGdldF90eXBlKHZhcmlhYmxlKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RyX3JlcGVhdChpbnB1dCwgbXVsdGlwbGllcikge1xuICAgICAgZm9yICh2YXIgb3V0cHV0ID0gW107IG11bHRpcGxpZXIgPiAwOyBvdXRwdXRbLS1tdWx0aXBsaWVyXSA9IGlucHV0KSB7LyogZG8gbm90aGluZyAqL31cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgdmFyIHN0cl9mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc3RyX2Zvcm1hdC5jYWNoZS5oYXNPd25Qcm9wZXJ0eShhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSA9IHN0cl9mb3JtYXQucGFyc2UoYXJndW1lbnRzWzBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJfZm9ybWF0LmZvcm1hdC5jYWxsKG51bGwsIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5mb3JtYXQgPSBmdW5jdGlvbihwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgbm9kZV90eXBlID0gJycsIGFyZywgb3V0cHV0ID0gW10sIGksIGssIG1hdGNoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICBub2RlX3R5cGUgPSBnZXRfdHlwZShwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBvdXRwdXQucHVzaChwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlX3R5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICBtYXRjaCA9IHBhcnNlX3RyZWVbaV07IC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICBpZiAobWF0Y2hbMl0pIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IG1hdGNoWzJdLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xuICAgICAgICAgICAgICAgIHRocm93KHNwcmludGYoJ1tzcHJpbnRmXSBwcm9wZXJ0eSBcIiVzXCIgZG9lcyBub3QgZXhpc3QnLCBtYXRjaFsyXVtrXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKG1hdGNoWzFdKSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgYXJnID0gYXJndlttYXRjaFsxXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICgvW15zXS8udGVzdChtYXRjaFs4XSkgJiYgKGdldF90eXBlKGFyZykgIT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJXMnLCBnZXRfdHlwZShhcmcpKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSmVkIEVESVRcbiAgICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT0gJ3VuZGVmaW5lZCcgfHwgYXJnID09PSBudWxsICkge1xuICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEplZCBFRElUXG5cbiAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzhdKSB7XG4gICAgICAgICAgICBjYXNlICdiJzogYXJnID0gYXJnLnRvU3RyaW5nKDIpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2MnOiBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZCc6IGFyZyA9IHBhcnNlSW50KGFyZywgMTApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2UnOiBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZic6IGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ28nOiBhcmcgPSBhcmcudG9TdHJpbmcoOCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncyc6IGFyZyA9ICgoYXJnID0gU3RyaW5nKGFyZykpICYmIG1hdGNoWzddID8gYXJnLnN1YnN0cmluZygwLCBtYXRjaFs3XSkgOiBhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3UnOiBhcmcgPSBNYXRoLmFicyhhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhcmcgPSAoL1tkZWZdLy50ZXN0KG1hdGNoWzhdKSAmJiBtYXRjaFszXSAmJiBhcmcgPj0gMCA/ICcrJysgYXJnIDogYXJnKTtcbiAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PSAnMCcgPyAnMCcgOiBtYXRjaFs0XS5jaGFyQXQoMSkgOiAnICc7XG4gICAgICAgICAgcGFkX2xlbmd0aCA9IG1hdGNoWzZdIC0gU3RyaW5nKGFyZykubGVuZ3RoO1xuICAgICAgICAgIHBhZCA9IG1hdGNoWzZdID8gc3RyX3JlcGVhdChwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoKSA6ICcnO1xuICAgICAgICAgIG91dHB1dC5wdXNoKG1hdGNoWzVdID8gYXJnICsgcGFkIDogcGFkICsgYXJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5jYWNoZSA9IHt9O1xuXG4gICAgc3RyX2Zvcm1hdC5wYXJzZSA9IGZ1bmN0aW9uKGZtdCkge1xuICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoID0gW10sIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMDtcbiAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgIGlmICgobWF0Y2ggPSAvXlteXFx4MjVdKy8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjV7Mn0vLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZm9zdXhYXSkvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICBhcmdfbmFtZXMgfD0gMTtcbiAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL14oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL15cXC4oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFxbKFxcZCspXFxdLy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgIH1cbiAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VfdHJlZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0cl9mb3JtYXQ7XG4gIH0pKCk7XG5cbiAgdmFyIHZzcHJpbnRmID0gZnVuY3Rpb24oZm10LCBhcmd2KSB7XG4gICAgYXJndi51bnNoaWZ0KGZtdCk7XG4gICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgYXJndik7XG4gIH07XG5cbiAgSmVkLnBhcnNlX3BsdXJhbCA9IGZ1bmN0aW9uICggcGx1cmFsX2Zvcm1zLCBuICkge1xuICAgIHBsdXJhbF9mb3JtcyA9IHBsdXJhbF9mb3Jtcy5yZXBsYWNlKC9uL2csIG4pO1xuICAgIHJldHVybiBKZWQucGFyc2VfZXhwcmVzc2lvbihwbHVyYWxfZm9ybXMpO1xuICB9O1xuXG4gIEplZC5zcHJpbnRmID0gZnVuY3Rpb24gKCBmbXQsIGFyZ3MgKSB7XG4gICAgaWYgKCB7fS50b1N0cmluZy5jYWxsKCBhcmdzICkgPT0gJ1tvYmplY3QgQXJyYXldJyApIHtcbiAgICAgIHJldHVybiB2c3ByaW50ZiggZm10LCBbXS5zbGljZS5jYWxsKGFyZ3MpICk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSApO1xuICB9O1xuXG4gIEplZC5wcm90b3R5cGUuc3ByaW50ZiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSmVkLnNwcmludGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgLy8gRU5EIHNwcmludGYgSW1wbGVtZW50YXRpb25cblxuICAvLyBTdGFydCB0aGUgUGx1cmFsIGZvcm1zIHNlY3Rpb25cbiAgLy8gVGhpcyBpcyBhIGZ1bGwgcGx1cmFsIGZvcm0gZXhwcmVzc2lvbiBwYXJzZXIuIEl0IGlzIHVzZWQgdG8gYXZvaWRcbiAgLy8gcnVubmluZyAnZXZhbCcgb3IgJ25ldyBGdW5jdGlvbicgZGlyZWN0bHkgYWdhaW5zdCB0aGUgcGx1cmFsXG4gIC8vIGZvcm1zLlxuICAvL1xuICAvLyBUaGlzIGNhbiBiZSBpbXBvcnRhbnQgaWYgeW91IGdldCB0cmFuc2xhdGlvbnMgZG9uZSB0aHJvdWdoIGEgM3JkXG4gIC8vIHBhcnR5IHZlbmRvci4gSSBlbmNvdXJhZ2UgeW91IHRvIHVzZSB0aGlzIGluc3RlYWQsIGhvd2V2ZXIsIElcbiAgLy8gYWxzbyB3aWxsIHByb3ZpZGUgYSAncHJlY29tcGlsZXInIHRoYXQgeW91IGNhbiB1c2UgYXQgYnVpbGQgdGltZVxuICAvLyB0byBvdXRwdXQgdmFsaWQvc2FmZSBmdW5jdGlvbiByZXByZXNlbnRhdGlvbnMgb2YgdGhlIHBsdXJhbCBmb3JtXG4gIC8vIGV4cHJlc3Npb25zLiBUaGlzIG1lYW5zIHlvdSBjYW4gYnVpbGQgdGhpcyBjb2RlIG91dCBmb3IgdGhlIG1vc3RcbiAgLy8gcGFydC5cbiAgSmVkLlBGID0ge307XG5cbiAgSmVkLlBGLnBhcnNlID0gZnVuY3Rpb24gKCBwICkge1xuICAgIHZhciBwbHVyYWxfc3RyID0gSmVkLlBGLmV4dHJhY3RQbHVyYWxFeHByKCBwICk7XG4gICAgcmV0dXJuIEplZC5QRi5wYXJzZXIucGFyc2UuY2FsbChKZWQuUEYucGFyc2VyLCBwbHVyYWxfc3RyKTtcbiAgfTtcblxuICBKZWQuUEYuY29tcGlsZSA9IGZ1bmN0aW9uICggcCApIHtcbiAgICAvLyBIYW5kbGUgdHJ1ZXMgYW5kIGZhbHNlcyBhcyAwIGFuZCAxXG4gICAgZnVuY3Rpb24gaW1wbHkoIHZhbCApIHtcbiAgICAgIHJldHVybiAodmFsID09PSB0cnVlID8gMSA6IHZhbCA/IHZhbCA6IDApO1xuICAgIH1cblxuICAgIHZhciBhc3QgPSBKZWQuUEYucGFyc2UoIHAgKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuICAgICAgcmV0dXJuIGltcGx5KCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdCApKCBuICkgKTtcbiAgICB9O1xuICB9O1xuXG4gIEplZC5QRi5pbnRlcnByZXRlciA9IGZ1bmN0aW9uICggYXN0ICkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICB2YXIgcmVzO1xuICAgICAgc3dpdGNoICggYXN0LnR5cGUgKSB7XG4gICAgICAgIGNhc2UgJ0dST1VQJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QuZXhwciApKCBuICk7XG4gICAgICAgIGNhc2UgJ1RFUk5BUlknOlxuICAgICAgICAgIGlmICggSmVkLlBGLmludGVycHJldGVyKCBhc3QuZXhwciApKCBuICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QudHJ1dGh5ICkoIG4gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmZhbHNleSApKCBuICk7XG4gICAgICAgIGNhc2UgJ09SJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgfHwgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdBTkQnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAmJiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0xUJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0dUJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0xURSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIDw9IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnR1RFJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPj0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdFUSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID09IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTkVRJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgIT0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdNT0QnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAlIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnVkFSJzpcbiAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgY2FzZSAnTlVNJzpcbiAgICAgICAgICByZXR1cm4gYXN0LnZhbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFRva2VuIGZvdW5kLlwiKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIEplZC5QRi5leHRyYWN0UGx1cmFsRXhwciA9IGZ1bmN0aW9uICggcCApIHtcbiAgICAvLyB0cmltIGZpcnN0XG4gICAgcCA9IHAucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG5cbiAgICBpZiAoISAvO1xccyokLy50ZXN0KHApKSB7XG4gICAgICBwID0gcC5jb25jYXQoJzsnKTtcbiAgICB9XG5cbiAgICB2YXIgbnBsdXJhbHNfcmUgPSAvbnBsdXJhbHNcXD0oXFxkKyk7LyxcbiAgICAgICAgcGx1cmFsX3JlID0gL3BsdXJhbFxcPSguKik7LyxcbiAgICAgICAgbnBsdXJhbHNfbWF0Y2hlcyA9IHAubWF0Y2goIG5wbHVyYWxzX3JlICksXG4gICAgICAgIHJlcyA9IHt9LFxuICAgICAgICBwbHVyYWxfbWF0Y2hlcztcblxuICAgIC8vIEZpbmQgdGhlIG5wbHVyYWxzIG51bWJlclxuICAgIGlmICggbnBsdXJhbHNfbWF0Y2hlcy5sZW5ndGggPiAxICkge1xuICAgICAgcmVzLm5wbHVyYWxzID0gbnBsdXJhbHNfbWF0Y2hlc1sxXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25wbHVyYWxzIG5vdCBmb3VuZCBpbiBwbHVyYWxfZm9ybXMgc3RyaW5nOiAnICsgcCApO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGF0IGRhdGEgdG8gZ2V0IHRvIHRoZSBmb3JtdWxhXG4gICAgcCA9IHAucmVwbGFjZSggbnBsdXJhbHNfcmUsIFwiXCIgKTtcbiAgICBwbHVyYWxfbWF0Y2hlcyA9IHAubWF0Y2goIHBsdXJhbF9yZSApO1xuXG4gICAgaWYgKCEoIHBsdXJhbF9tYXRjaGVzICYmIHBsdXJhbF9tYXRjaGVzLmxlbmd0aCA+IDEgKSApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHBsdXJhbGAgZXhwcmVzc2lvbiBub3QgZm91bmQ6ICcgKyBwKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdXJhbF9tYXRjaGVzWyAxIF07XG4gIH07XG5cbiAgLyogSmlzb24gZ2VuZXJhdGVkIHBhcnNlciAqL1xuICBKZWQuUEYucGFyc2VyID0gKGZ1bmN0aW9uKCl7XG5cbnZhciBwYXJzZXIgPSB7dHJhY2U6IGZ1bmN0aW9uIHRyYWNlKCkgeyB9LFxueXk6IHt9LFxuc3ltYm9sc186IHtcImVycm9yXCI6MixcImV4cHJlc3Npb25zXCI6MyxcImVcIjo0LFwiRU9GXCI6NSxcIj9cIjo2LFwiOlwiOjcsXCJ8fFwiOjgsXCImJlwiOjksXCI8XCI6MTAsXCI8PVwiOjExLFwiPlwiOjEyLFwiPj1cIjoxMyxcIiE9XCI6MTQsXCI9PVwiOjE1LFwiJVwiOjE2LFwiKFwiOjE3LFwiKVwiOjE4LFwiblwiOjE5LFwiTlVNQkVSXCI6MjAsXCIkYWNjZXB0XCI6MCxcIiRlbmRcIjoxfSxcbnRlcm1pbmFsc186IHsyOlwiZXJyb3JcIiw1OlwiRU9GXCIsNjpcIj9cIiw3OlwiOlwiLDg6XCJ8fFwiLDk6XCImJlwiLDEwOlwiPFwiLDExOlwiPD1cIiwxMjpcIj5cIiwxMzpcIj49XCIsMTQ6XCIhPVwiLDE1OlwiPT1cIiwxNjpcIiVcIiwxNzpcIihcIiwxODpcIilcIiwxOTpcIm5cIiwyMDpcIk5VTUJFUlwifSxcbnByb2R1Y3Rpb25zXzogWzAsWzMsMl0sWzQsNV0sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsMV0sWzQsMV1dLFxucGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCx5eWxlbmcseXlsaW5lbm8seXkseXlzdGF0ZSwkJCxfJCkge1xuXG52YXIgJDAgPSAkJC5sZW5ndGggLSAxO1xuc3dpdGNoICh5eXN0YXRlKSB7XG5jYXNlIDE6IHJldHVybiB7IHR5cGUgOiAnR1JPVVAnLCBleHByOiAkJFskMC0xXSB9O1xuYnJlYWs7XG5jYXNlIDI6dGhpcy4kID0geyB0eXBlOiAnVEVSTkFSWScsIGV4cHI6ICQkWyQwLTRdLCB0cnV0aHkgOiAkJFskMC0yXSwgZmFsc2V5OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAzOnRoaXMuJCA9IHsgdHlwZTogXCJPUlwiLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDQ6dGhpcy4kID0geyB0eXBlOiBcIkFORFwiLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDU6dGhpcy4kID0geyB0eXBlOiAnTFQnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDY6dGhpcy4kID0geyB0eXBlOiAnTFRFJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA3OnRoaXMuJCA9IHsgdHlwZTogJ0dUJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA4OnRoaXMuJCA9IHsgdHlwZTogJ0dURScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgOTp0aGlzLiQgPSB7IHR5cGU6ICdORVEnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDEwOnRoaXMuJCA9IHsgdHlwZTogJ0VRJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMTp0aGlzLiQgPSB7IHR5cGU6ICdNT0QnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDEyOnRoaXMuJCA9IHsgdHlwZTogJ0dST1VQJywgZXhwcjogJCRbJDAtMV0gfTtcbmJyZWFrO1xuY2FzZSAxMzp0aGlzLiQgPSB7IHR5cGU6ICdWQVInIH07XG5icmVhaztcbmNhc2UgMTQ6dGhpcy4kID0geyB0eXBlOiAnTlVNJywgdmFsOiBOdW1iZXIoeXl0ZXh0KSB9O1xuYnJlYWs7XG59XG59LFxudGFibGU6IFt7MzoxLDQ6MiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezE6WzNdfSx7NTpbMSw2XSw2OlsxLDddLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl19LHs0OjE3LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NTpbMiwxM10sNjpbMiwxM10sNzpbMiwxM10sODpbMiwxM10sOTpbMiwxM10sMTA6WzIsMTNdLDExOlsyLDEzXSwxMjpbMiwxM10sMTM6WzIsMTNdLDE0OlsyLDEzXSwxNTpbMiwxM10sMTY6WzIsMTNdLDE4OlsyLDEzXX0sezU6WzIsMTRdLDY6WzIsMTRdLDc6WzIsMTRdLDg6WzIsMTRdLDk6WzIsMTRdLDEwOlsyLDE0XSwxMTpbMiwxNF0sMTI6WzIsMTRdLDEzOlsyLDE0XSwxNDpbMiwxNF0sMTU6WzIsMTRdLDE2OlsyLDE0XSwxODpbMiwxNF19LHsxOlsyLDFdfSx7NDoxOCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MTksMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIwLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjIsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIzLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjUsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI2LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezY6WzEsN10sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMSwyOF19LHs2OlsxLDddLDc6WzEsMjldLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl19LHs1OlsyLDNdLDY6WzIsM10sNzpbMiwzXSw4OlsyLDNdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDNdfSx7NTpbMiw0XSw2OlsyLDRdLDc6WzIsNF0sODpbMiw0XSw5OlsyLDRdLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiw0XX0sezU6WzIsNV0sNjpbMiw1XSw3OlsyLDVdLDg6WzIsNV0sOTpbMiw1XSwxMDpbMiw1XSwxMTpbMiw1XSwxMjpbMiw1XSwxMzpbMiw1XSwxNDpbMiw1XSwxNTpbMiw1XSwxNjpbMSwxNl0sMTg6WzIsNV19LHs1OlsyLDZdLDY6WzIsNl0sNzpbMiw2XSw4OlsyLDZdLDk6WzIsNl0sMTA6WzIsNl0sMTE6WzIsNl0sMTI6WzIsNl0sMTM6WzIsNl0sMTQ6WzIsNl0sMTU6WzIsNl0sMTY6WzEsMTZdLDE4OlsyLDZdfSx7NTpbMiw3XSw2OlsyLDddLDc6WzIsN10sODpbMiw3XSw5OlsyLDddLDEwOlsyLDddLDExOlsyLDddLDEyOlsyLDddLDEzOlsyLDddLDE0OlsyLDddLDE1OlsyLDddLDE2OlsxLDE2XSwxODpbMiw3XX0sezU6WzIsOF0sNjpbMiw4XSw3OlsyLDhdLDg6WzIsOF0sOTpbMiw4XSwxMDpbMiw4XSwxMTpbMiw4XSwxMjpbMiw4XSwxMzpbMiw4XSwxNDpbMiw4XSwxNTpbMiw4XSwxNjpbMSwxNl0sMTg6WzIsOF19LHs1OlsyLDldLDY6WzIsOV0sNzpbMiw5XSw4OlsyLDldLDk6WzIsOV0sMTA6WzIsOV0sMTE6WzIsOV0sMTI6WzIsOV0sMTM6WzIsOV0sMTQ6WzIsOV0sMTU6WzIsOV0sMTY6WzEsMTZdLDE4OlsyLDldfSx7NTpbMiwxMF0sNjpbMiwxMF0sNzpbMiwxMF0sODpbMiwxMF0sOTpbMiwxMF0sMTA6WzIsMTBdLDExOlsyLDEwXSwxMjpbMiwxMF0sMTM6WzIsMTBdLDE0OlsyLDEwXSwxNTpbMiwxMF0sMTY6WzEsMTZdLDE4OlsyLDEwXX0sezU6WzIsMTFdLDY6WzIsMTFdLDc6WzIsMTFdLDg6WzIsMTFdLDk6WzIsMTFdLDEwOlsyLDExXSwxMTpbMiwxMV0sMTI6WzIsMTFdLDEzOlsyLDExXSwxNDpbMiwxMV0sMTU6WzIsMTFdLDE2OlsyLDExXSwxODpbMiwxMV19LHs1OlsyLDEyXSw2OlsyLDEyXSw3OlsyLDEyXSw4OlsyLDEyXSw5OlsyLDEyXSwxMDpbMiwxMl0sMTE6WzIsMTJdLDEyOlsyLDEyXSwxMzpbMiwxMl0sMTQ6WzIsMTJdLDE1OlsyLDEyXSwxNjpbMiwxMl0sMTg6WzIsMTJdfSx7NDozMCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezU6WzIsMl0sNjpbMSw3XSw3OlsyLDJdLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsMl19XSxcbmRlZmF1bHRBY3Rpb25zOiB7NjpbMiwxXX0sXG5wYXJzZUVycm9yOiBmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xufSxcbnBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgc3RhY2sgPSBbMF0sXG4gICAgICAgIHZzdGFjayA9IFtudWxsXSwgLy8gc2VtYW50aWMgdmFsdWUgc3RhY2tcbiAgICAgICAgbHN0YWNrID0gW10sIC8vIGxvY2F0aW9uIHN0YWNrXG4gICAgICAgIHRhYmxlID0gdGhpcy50YWJsZSxcbiAgICAgICAgeXl0ZXh0ID0gJycsXG4gICAgICAgIHl5bGluZW5vID0gMCxcbiAgICAgICAgeXlsZW5nID0gMCxcbiAgICAgICAgcmVjb3ZlcmluZyA9IDAsXG4gICAgICAgIFRFUlJPUiA9IDIsXG4gICAgICAgIEVPRiA9IDE7XG5cbiAgICAvL3RoaXMucmVkdWN0aW9uQ291bnQgPSB0aGlzLnNoaWZ0Q291bnQgPSAwO1xuXG4gICAgdGhpcy5sZXhlci5zZXRJbnB1dChpbnB1dCk7XG4gICAgdGhpcy5sZXhlci55eSA9IHRoaXMueXk7XG4gICAgdGhpcy55eS5sZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmxleGVyLnl5bGxvYyA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgdGhpcy5sZXhlci55eWxsb2MgPSB7fTtcbiAgICB2YXIgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICBsc3RhY2sucHVzaCh5eWxvYyk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMueXkucGFyc2VFcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gdGhpcy55eS5wYXJzZUVycm9yO1xuXG4gICAgZnVuY3Rpb24gcG9wU3RhY2sgKG4pIHtcbiAgICAgICAgc3RhY2subGVuZ3RoID0gc3RhY2subGVuZ3RoIC0gMipuO1xuICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG4gICAgICAgIGxzdGFjay5sZW5ndGggPSBsc3RhY2subGVuZ3RoIC0gbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsZXgoKSB7XG4gICAgICAgIHZhciB0b2tlbjtcbiAgICAgICAgdG9rZW4gPSBzZWxmLmxleGVyLmxleCgpIHx8IDE7IC8vICRlbmQgPSAxXG4gICAgICAgIC8vIGlmIHRva2VuIGlzbid0IGl0cyBudW1lcmljIHZhbHVlLCBjb252ZXJ0XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHNlbGYuc3ltYm9sc19bdG9rZW5dIHx8IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG5cbiAgICB2YXIgc3ltYm9sLCBwcmVFcnJvclN5bWJvbCwgc3RhdGUsIGFjdGlvbiwgYSwgciwgeXl2YWw9e30scCxsZW4sbmV3U3RhdGUsIGV4cGVjdGVkO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIC8vIHJldHJlaXZlIHN0YXRlIG51bWJlciBmcm9tIHRvcCBvZiBzdGFja1xuICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcblxuICAgICAgICAvLyB1c2UgZGVmYXVsdCBhY3Rpb25zIGlmIGF2YWlsYWJsZVxuICAgICAgICBpZiAodGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV0pIHtcbiAgICAgICAgICAgIGFjdGlvbiA9IHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgLy8gcmVhZCBhY3Rpb24gZm9yIGN1cnJlbnQgc3RhdGUgYW5kIGZpcnN0IGlucHV0XG4gICAgICAgICAgICBhY3Rpb24gPSB0YWJsZVtzdGF0ZV0gJiYgdGFibGVbc3RhdGVdW3N5bWJvbF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgcGFyc2UgZXJyb3JcbiAgICAgICAgX2hhbmRsZV9lcnJvcjpcbiAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICd1bmRlZmluZWQnIHx8ICFhY3Rpb24ubGVuZ3RoIHx8ICFhY3Rpb25bMF0pIHtcblxuICAgICAgICAgICAgaWYgKCFyZWNvdmVyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVwb3J0IGVycm9yXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHAgaW4gdGFibGVbc3RhdGVdKSBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkLnB1c2goXCInXCIrdGhpcy50ZXJtaW5hbHNfW3BdK1wiJ1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGVyclN0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnNob3dQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnKyh5eWxpbmVubysxKStcIjpcXG5cIit0aGlzLmxleGVyLnNob3dQb3NpdGlvbigpK1wiXFxuRXhwZWN0aW5nIFwiK2V4cGVjdGVkLmpvaW4oJywgJykgKyBcIiwgZ290ICdcIiArIHRoaXMudGVybWluYWxzX1tzeW1ib2xdKyBcIidcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnKyh5eWxpbmVubysxKStcIjogVW5leHBlY3RlZCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbCA9PSAxIC8qRU9GKi8gPyBcImVuZCBvZiBpbnB1dFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCInXCIrKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkrXCInXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKGVyclN0cixcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IHRoaXMubGV4ZXIubWF0Y2gsIHRva2VuOiB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wsIGxpbmU6IHRoaXMubGV4ZXIueXlsaW5lbm8sIGxvYzogeXlsb2MsIGV4cGVjdGVkOiBleHBlY3RlZH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBqdXN0IHJlY292ZXJlZCBmcm9tIGFub3RoZXIgZXJyb3JcbiAgICAgICAgICAgIGlmIChyZWNvdmVyaW5nID09IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sID09IEVPRikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyU3RyIHx8ICdQYXJzaW5nIGhhbHRlZC4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIGN1cnJlbnQgbG9va2FoZWFkIGFuZCBncmFiIGFub3RoZXJcbiAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJ5IHRvIHJlY292ZXIgZnJvbSBlcnJvclxuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZXJyb3IgcmVjb3ZlcnkgcnVsZSBpbiB0aGlzIHN0YXRlXG4gICAgICAgICAgICAgICAgaWYgKChURVJST1IudG9TdHJpbmcoKSkgaW4gdGFibGVbc3RhdGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyU3RyIHx8ICdQYXJzaW5nIGhhbHRlZC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9wU3RhY2soMSk7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZUVycm9yU3ltYm9sID0gc3ltYm9sOyAvLyBzYXZlIHRoZSBsb29rYWhlYWQgdG9rZW5cbiAgICAgICAgICAgIHN5bWJvbCA9IFRFUlJPUjsgICAgICAgICAvLyBpbnNlcnQgZ2VuZXJpYyBlcnJvciBzeW1ib2wgYXMgbmV3IGxvb2thaGVhZFxuICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgICAgICBhY3Rpb24gPSB0YWJsZVtzdGF0ZV0gJiYgdGFibGVbc3RhdGVdW1RFUlJPUl07XG4gICAgICAgICAgICByZWNvdmVyaW5nID0gMzsgLy8gYWxsb3cgMyByZWFsIHN5bWJvbHMgdG8gYmUgc2hpZnRlZCBiZWZvcmUgcmVwb3J0aW5nIGEgbmV3IGVycm9yXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIHNob3VsZG4ndCBoYXBwZW4sIHVubGVzcyByZXNvbHZlIGRlZmF1bHRzIGFyZSBvZmZcbiAgICAgICAgaWYgKGFjdGlvblswXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiAnK3N0YXRlKycsIHRva2VuOiAnK3N5bWJvbCk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGFjdGlvblswXSkge1xuXG4gICAgICAgICAgICBjYXNlIDE6IC8vIHNoaWZ0XG4gICAgICAgICAgICAgICAgLy90aGlzLnNoaWZ0Q291bnQrKztcblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh0aGlzLmxleGVyLnl5dGV4dCk7XG4gICAgICAgICAgICAgICAgbHN0YWNrLnB1c2godGhpcy5sZXhlci55eWxsb2MpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYWN0aW9uWzFdKTsgLy8gcHVzaCBzdGF0ZVxuICAgICAgICAgICAgICAgIHN5bWJvbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkgeyAvLyBub3JtYWwgZXhlY3V0aW9uL25vIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHl5bGVuZyA9IHRoaXMubGV4ZXIueXlsZW5nO1xuICAgICAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuICAgICAgICAgICAgICAgICAgICB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvdmVyaW5nLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gZXJyb3IganVzdCBvY2N1cnJlZCwgcmVzdW1lIG9sZCBsb29rYWhlYWQgZi8gYmVmb3JlIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IHByZUVycm9yU3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6IC8vIHJlZHVjZVxuICAgICAgICAgICAgICAgIC8vdGhpcy5yZWR1Y3Rpb25Db3VudCsrO1xuXG4gICAgICAgICAgICAgICAgbGVuID0gdGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVsxXTtcblxuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gc2VtYW50aWMgYWN0aW9uXG4gICAgICAgICAgICAgICAgeXl2YWwuJCA9IHZzdGFja1t2c3RhY2subGVuZ3RoLWxlbl07IC8vIGRlZmF1bHQgdG8gJCQgPSAkMVxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbG9jYXRpb24sIHVzZXMgZmlyc3QgdG9rZW4gZm9yIGZpcnN0cywgbGFzdCBmb3IgbGFzdHNcbiAgICAgICAgICAgICAgICB5eXZhbC5fJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGgtKGxlbnx8MSldLmZpcnN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGgtMV0ubGFzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoLShsZW58fDEpXS5maXJzdF9jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0xXS5sYXN0X2NvbHVtblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgciA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHl5dmFsLCB5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHRoaXMueXksIGFjdGlvblsxXSwgdnN0YWNrLCBsc3RhY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwb3Agb2ZmIHN0YWNrXG4gICAgICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLnNsaWNlKDAsLTEqbGVuKjIpO1xuICAgICAgICAgICAgICAgICAgICB2c3RhY2sgPSB2c3RhY2suc2xpY2UoMCwgLTEqbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrID0gbHN0YWNrLnNsaWNlKDAsIC0xKmxlbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzBdKTsgICAgLy8gcHVzaCBub250ZXJtaW5hbCAocmVkdWNlKVxuICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHl5dmFsLiQpO1xuICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHl5dmFsLl8kKTtcbiAgICAgICAgICAgICAgICAvLyBnb3RvIG5ldyBzdGF0ZSA9IHRhYmxlW1NUQVRFXVtOT05URVJNSU5BTF1cbiAgICAgICAgICAgICAgICBuZXdTdGF0ZSA9IHRhYmxlW3N0YWNrW3N0YWNrLmxlbmd0aC0yXV1bc3RhY2tbc3RhY2subGVuZ3RoLTFdXTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5ld1N0YXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAzOiAvLyBhY2NlcHRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59fTsvKiBKaXNvbiBnZW5lcmF0ZWQgbGV4ZXIgKi9cbnZhciBsZXhlciA9IChmdW5jdGlvbigpe1xuXG52YXIgbGV4ZXIgPSAoe0VPRjoxLFxucGFyc2VFcnJvcjpmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuICAgICAgICBpZiAodGhpcy55eS5wYXJzZUVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnl5LnBhcnNlRXJyb3Ioc3RyLCBoYXNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuICAgICAgICB9XG4gICAgfSxcbnNldElucHV0OmZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgICAgICB0aGlzLl9tb3JlID0gdGhpcy5fbGVzcyA9IHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnl5bGluZW5vID0gdGhpcy55eWxlbmcgPSAwO1xuICAgICAgICB0aGlzLnl5dGV4dCA9IHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2ggPSAnJztcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjayA9IFsnSU5JVElBTCddO1xuICAgICAgICB0aGlzLnl5bGxvYyA9IHtmaXJzdF9saW5lOjEsZmlyc3RfY29sdW1uOjAsbGFzdF9saW5lOjEsbGFzdF9jb2x1bW46MH07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5pbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjaCA9IHRoaXMuX2lucHV0WzBdO1xuICAgICAgICB0aGlzLnl5dGV4dCs9Y2g7XG4gICAgICAgIHRoaXMueXlsZW5nKys7XG4gICAgICAgIHRoaXMubWF0Y2grPWNoO1xuICAgICAgICB0aGlzLm1hdGNoZWQrPWNoO1xuICAgICAgICB2YXIgbGluZXMgPSBjaC5tYXRjaCgvXFxuLyk7XG4gICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubysrO1xuICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKDEpO1xuICAgICAgICByZXR1cm4gY2g7XG4gICAgfSxcbnVucHV0OmZ1bmN0aW9uIChjaCkge1xuICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5tb3JlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5wYXN0SW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFzdCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIHRoaXMubWF0Y2gubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIChwYXN0Lmxlbmd0aCA+IDIwID8gJy4uLic6JycpICsgcGFzdC5zdWJzdHIoLTIwKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgfSxcbnVwY29taW5nSW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmV4dCA9IHRoaXMubWF0Y2g7XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA8IDIwKSB7XG4gICAgICAgICAgICBuZXh0ICs9IHRoaXMuX2lucHV0LnN1YnN0cigwLCAyMC1uZXh0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0LnN1YnN0cigwLDIwKSsobmV4dC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG5zaG93UG9zaXRpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJlID0gdGhpcy5wYXN0SW5wdXQoKTtcbiAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xuICAgICAgICByZXR1cm4gcHJlICsgdGhpcy51cGNvbWluZ0lucHV0KCkgKyBcIlxcblwiICsgYytcIl5cIjtcbiAgICB9LFxubmV4dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2lucHV0KSB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciB0b2tlbixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgY29sLFxuICAgICAgICAgICAgbGluZXM7XG4gICAgICAgIGlmICghdGhpcy5fbW9yZSkge1xuICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSAnJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wO2kgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSB0aGlzLl9pbnB1dC5tYXRjaCh0aGlzLnJ1bGVzW3J1bGVzW2ldXSk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBsaW5lcyA9IG1hdGNoWzBdLm1hdGNoKC9cXG4uKi9nKTtcbiAgICAgICAgICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8gKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0ge2ZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8rMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/IGxpbmVzW2xpbmVzLmxlbmd0aC0xXS5sZW5ndGgtMSA6IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uICsgbWF0Y2hbMF0ubGVuZ3RofVxuICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVzID0gbWF0Y2g7XG4gICAgICAgICAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9yZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnl5LCB0aGlzLCBydWxlc1tpXSx0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTFdKTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW5wdXQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcignTGV4aWNhbCBlcnJvciBvbiBsaW5lICcrKHRoaXMueXlsaW5lbm8rMSkrJy4gVW5yZWNvZ25pemVkIHRleHQuXFxuJyt0aGlzLnNob3dQb3NpdGlvbigpLFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJcIiwgdG9rZW46IG51bGwsIGxpbmU6IHRoaXMueXlsaW5lbm99KTtcbiAgICAgICAgfVxuICAgIH0sXG5sZXg6ZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xuICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxleCgpO1xuICAgICAgICB9XG4gICAgfSxcbmJlZ2luOmZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrLnB1c2goY29uZGl0aW9uKTtcbiAgICB9LFxucG9wU3RhdGU6ZnVuY3Rpb24gcG9wU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrLnBvcCgpO1xuICAgIH0sXG5fY3VycmVudFJ1bGVzOmZ1bmN0aW9uIF9jdXJyZW50UnVsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0xXV0ucnVsZXM7XG4gICAgfSxcbnRvcFN0YXRlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMl07XG4gICAgfSxcbnB1c2hTdGF0ZTpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5iZWdpbihjb25kaXRpb24pO1xuICAgIH19KTtcbmxleGVyLnBlcmZvcm1BY3Rpb24gPSBmdW5jdGlvbiBhbm9ueW1vdXMoeXkseXlfLCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMsWVlfU1RBUlQpIHtcblxudmFyIFlZU1RBVEU9WVlfU1RBUlQ7XG5zd2l0Y2goJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucykge1xuY2FzZSAwOi8qIHNraXAgd2hpdGVzcGFjZSAqL1xuYnJlYWs7XG5jYXNlIDE6cmV0dXJuIDIwXG5icmVhaztcbmNhc2UgMjpyZXR1cm4gMTlcbmJyZWFrO1xuY2FzZSAzOnJldHVybiA4XG5icmVhaztcbmNhc2UgNDpyZXR1cm4gOVxuYnJlYWs7XG5jYXNlIDU6cmV0dXJuIDZcbmJyZWFrO1xuY2FzZSA2OnJldHVybiA3XG5icmVhaztcbmNhc2UgNzpyZXR1cm4gMTFcbmJyZWFrO1xuY2FzZSA4OnJldHVybiAxM1xuYnJlYWs7XG5jYXNlIDk6cmV0dXJuIDEwXG5icmVhaztcbmNhc2UgMTA6cmV0dXJuIDEyXG5icmVhaztcbmNhc2UgMTE6cmV0dXJuIDE0XG5icmVhaztcbmNhc2UgMTI6cmV0dXJuIDE1XG5icmVhaztcbmNhc2UgMTM6cmV0dXJuIDE2XG5icmVhaztcbmNhc2UgMTQ6cmV0dXJuIDE3XG5icmVhaztcbmNhc2UgMTU6cmV0dXJuIDE4XG5icmVhaztcbmNhc2UgMTY6cmV0dXJuIDVcbmJyZWFrO1xuY2FzZSAxNzpyZXR1cm4gJ0lOVkFMSUQnXG5icmVhaztcbn1cbn07XG5sZXhlci5ydWxlcyA9IFsvXlxccysvLC9eWzAtOV0rKFxcLlswLTldKyk/XFxiLywvXm5cXGIvLC9eXFx8XFx8LywvXiYmLywvXlxcPy8sL146LywvXjw9LywvXj49LywvXjwvLC9ePi8sL14hPS8sL149PS8sL14lLywvXlxcKC8sL15cXCkvLC9eJC8sL14uL107XG5sZXhlci5jb25kaXRpb25zID0ge1wiSU5JVElBTFwiOntcInJ1bGVzXCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTddLFwiaW5jbHVzaXZlXCI6dHJ1ZX19O3JldHVybiBsZXhlcjt9KSgpXG5wYXJzZXIubGV4ZXIgPSBsZXhlcjtcbnJldHVybiBwYXJzZXI7XG59KSgpO1xuLy8gRW5kIHBhcnNlclxuXG4gIC8vIEhhbmRsZSBub2RlLCBhbWQsIGFuZCBnbG9iYWwgc3lzdGVtc1xuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBKZWQ7XG4gICAgfVxuICAgIGV4cG9ydHMuSmVkID0gSmVkO1xuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEplZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBMZWFrIGEgZ2xvYmFsIHJlZ2FyZGxlc3Mgb2YgbW9kdWxlIHN5c3RlbVxuICAgIHJvb3RbJ0plZCddID0gSmVkO1xuICB9XG5cbn0pKHRoaXMpO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQWRkcyB0aGUga2V5LXZhbHVlIGBwYWlyYCB0byBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXIgVGhlIGtleS12YWx1ZSBwYWlyIHRvIGFkZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG1hcGAuXG4gKi9cbmZ1bmN0aW9uIGFkZE1hcEVudHJ5KG1hcCwgcGFpcikge1xuICAvLyBEb24ndCByZXR1cm4gYG1hcC5zZXRgIGJlY2F1c2UgaXQncyBub3QgY2hhaW5hYmxlIGluIElFIDExLlxuICBtYXAuc2V0KHBhaXJbMF0sIHBhaXJbMV0pO1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1hcEVudHJ5O1xuIiwiLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gYHNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBtb2RpZnkuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhZGQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBzZXRgLlxuICovXG5mdW5jdGlvbiBhZGRTZXRFbnRyeShzZXQsIHZhbHVlKSB7XG4gIC8vIERvbid0IHJldHVybiBgc2V0LmFkZGAgYmVjYXVzZSBpdCdzIG5vdCBjaGFpbmFibGUgaW4gSUUgMTEuXG4gIHNldC5hZGQodmFsdWUpO1xuICByZXR1cm4gc2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFNldEVudHJ5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICBpZiAoaW5pdEFjY3VtICYmIGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gYXJyYXlbKytpbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCBhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UmVkdWNlO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGJhc2VBc3NpZ25JbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25JbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgY29weVN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzSW4nKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX0ZMQVRfRkxBRyA9IDIsXG4gICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0YVZpZXdUYWddID1cbmNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGVUYWddID1cbmNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3ltYm9sVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xuY2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgYW5kIGBfLmNsb25lRGVlcGAgd2hpY2ggdHJhY2tzXG4gKiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIERlZXAgY2xvbmVcbiAqICAyIC0gRmxhdHRlbiBpbmhlcml0ZWQgcHJvcGVydGllc1xuICogIDQgLSBDbG9uZSBzeW1ib2xzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgcGFyZW50IG9iamVjdCBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGFuZCB0aGVpciBjbG9uZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0LFxuICAgICAgaXNEZWVwID0gYml0bWFzayAmIENMT05FX0RFRVBfRkxBRyxcbiAgICAgIGlzRmxhdCA9IGJpdG1hc2sgJiBDTE9ORV9GTEFUX0ZMQUcsXG4gICAgICBpc0Z1bGwgPSBiaXRtYXNrICYgQ0xPTkVfU1lNQk9MU19GTEFHO1xuXG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QsIHN0YWNrKSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cbiAgICBpZiAoaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIHJlc3VsdCA9IChpc0ZsYXQgfHwgaXNGdW5jKSA/IHt9IDogaW5pdENsb25lT2JqZWN0KHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBpc0ZsYXRcbiAgICAgICAgICA/IGNvcHlTeW1ib2xzSW4odmFsdWUsIGJhc2VBc3NpZ25JbihyZXN1bHQsIHZhbHVlKSlcbiAgICAgICAgICA6IGNvcHlTeW1ib2xzKHZhbHVlLCBiYXNlQXNzaWduKHJlc3VsdCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjbG9uZWFibGVUYWdzW3RhZ10pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdCA/IHZhbHVlIDoge307XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBiYXNlQ2xvbmUsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgdmFyIGtleXNGdW5jID0gaXNGdWxsXG4gICAgPyAoaXNGbGF0ID8gZ2V0QWxsS2V5c0luIDogZ2V0QWxsS2V5cylcbiAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IGtleXNGdW5jKHZhbHVlKTtcbiAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzdWJWYWx1ZTtcbiAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsInZhciBhZGRNYXBFbnRyeSA9IHJlcXVpcmUoJy4vX2FkZE1hcEVudHJ5JyksXG4gICAgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIG1hcFRvQXJyYXkgPSByZXF1aXJlKCcuL19tYXBUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBtYXAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lTWFwKG1hcCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKG1hcFRvQXJyYXkobWFwKSwgQ0xPTkVfREVFUF9GTEFHKSA6IG1hcFRvQXJyYXkobWFwKTtcbiAgcmV0dXJuIGFycmF5UmVkdWNlKGFycmF5LCBhZGRNYXBFbnRyeSwgbmV3IG1hcC5jb25zdHJ1Y3Rvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVNYXA7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIGFkZFNldEVudHJ5ID0gcmVxdWlyZSgnLi9fYWRkU2V0RW50cnknKSxcbiAgICBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvbmVGdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHNldC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTZXQoc2V0LCBpc0RlZXAsIGNsb25lRnVuYykge1xuICB2YXIgYXJyYXkgPSBpc0RlZXAgPyBjbG9uZUZ1bmMoc2V0VG9BcnJheShzZXQpLCBDTE9ORV9ERUVQX0ZMQUcpIDogc2V0VG9BcnJheShzZXQpO1xuICByZXR1cm4gYXJyYXlSZWR1Y2UoYXJyYXksIGFkZFNldEVudHJ5LCBuZXcgc2V0LmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpO1xuXG4vKipcbiAqIENvcGllcyBvd24gYW5kIGluaGVyaXRlZCBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9sc0luKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9sc0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHNJbjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBvYmplY3QubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKSxcbiAgICBjbG9uZURhdGFWaWV3ID0gcmVxdWlyZSgnLi9fY2xvbmVEYXRhVmlldycpLFxuICAgIGNsb25lTWFwID0gcmVxdWlyZSgnLi9fY2xvbmVNYXAnKSxcbiAgICBjbG9uZVJlZ0V4cCA9IHJlcXVpcmUoJy4vX2Nsb25lUmVnRXhwJyksXG4gICAgY2xvbmVTZXQgPSByZXF1aXJlKCcuL19jbG9uZVNldCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvbmVGdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBjbG9uZUZ1bmMsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgcmV0dXJuIGNsb25lRGF0YVZpZXcob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVUeXBlZEFycmF5KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lTWFwKG9iamVjdCwgaXNEZWVwLCBjbG9uZUZ1bmMpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lUmVnRXhwKG9iamVjdCk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVNldChvYmplY3QsIGlzRGVlcCwgY2xvbmVGdW5jKTtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2VcbiAqIFtgT2JqZWN0LmtleXNgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGV4Y2VwdCB0aGF0IGl0IGluY2x1ZGVzIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIG5hdGl2ZUtleXNJbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5c0luO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUxlYWRpbmdEb3QgPSAvXlxcLi8sXG4gICAgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemVDYXBwZWQoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHJlTGVhZGluZ0RvdC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYHZhbHVlYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cHM6Ly9tZG4uaW8vU3RydWN0dXJlZF9jbG9uZV9hbGdvcml0aG0pXG4gKiBhbmQgc3VwcG9ydHMgY2xvbmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLCBkYXRlIG9iamVjdHMsIG1hcHMsXG4gKiBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLCBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWRcbiAqIGFycmF5cy4gVGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhcmUgY2xvbmVkXG4gKiBhcyBwbGFpbiBvYmplY3RzLiBBbiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoXG4gKiBhcyBlcnJvciBvYmplY3RzLCBmdW5jdGlvbnMsIERPTSBub2RlcywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKiBAc2VlIF8uY2xvbmVEZWVwXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZShvYmplY3RzKTtcbiAqIGNvbnNvbGUubG9nKHNoYWxsb3dbMF0gPT09IG9iamVjdHNbMF0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4vbm93JyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgY2FzdEZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fY2FzdEZ1bmN0aW9uJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoUmlnaHRcbiAqIEBleGFtcGxlXG4gKlxuICogXy5mb3JFYWNoKFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAxYCB0aGVuIGAyYC5cbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaCA6IGJhc2VFYWNoO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBjYXN0RnVuY3Rpb24oaXRlcmF0ZWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiB7ICdiJzogMiB9IH07XG4gKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXMob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob3RoZXIsICdhJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzSW4nKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCwgdHJ1ZSkgOiBiYXNlS2V5c0luKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJBcnJheTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwidmFyIGZpbmRNYXRjaGluZ1J1bGUgPSBmdW5jdGlvbihydWxlcywgdGV4dCl7XG4gIHZhciBpO1xuICBmb3IoaT0wOyBpPHJ1bGVzLmxlbmd0aDsgaSsrKVxuICAgIGlmKHJ1bGVzW2ldLnJlZ2V4LnRlc3QodGV4dCkpXG4gICAgICByZXR1cm4gcnVsZXNbaV07XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG52YXIgZmluZE1heEluZGV4QW5kUnVsZSA9IGZ1bmN0aW9uKHJ1bGVzLCB0ZXh0KXtcbiAgdmFyIGksIHJ1bGUsIGxhc3RfbWF0Y2hpbmdfcnVsZTtcbiAgZm9yKGk9MDsgaTx0ZXh0Lmxlbmd0aDsgaSsrKXtcbiAgICBydWxlID0gZmluZE1hdGNoaW5nUnVsZShydWxlcywgdGV4dC5zdWJzdHJpbmcoMCwgaSArIDEpKTtcbiAgICBpZihydWxlKVxuICAgICAgbGFzdF9tYXRjaGluZ19ydWxlID0gcnVsZTtcbiAgICBlbHNlIGlmKGxhc3RfbWF0Y2hpbmdfcnVsZSlcbiAgICAgIHJldHVybiB7bWF4X2luZGV4OiBpLCBydWxlOiBsYXN0X21hdGNoaW5nX3J1bGV9O1xuICB9XG4gIHJldHVybiBsYXN0X21hdGNoaW5nX3J1bGUgPyB7bWF4X2luZGV4OiB0ZXh0Lmxlbmd0aCwgcnVsZTogbGFzdF9tYXRjaGluZ19ydWxlfSA6IHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob25Ub2tlbl9vcmlnKXtcbiAgdmFyIGJ1ZmZlciA9IFwiXCI7XG4gIHZhciBydWxlcyA9IFtdO1xuICB2YXIgbGluZSA9IDE7XG4gIHZhciBjb2wgPSAxO1xuXG4gIHZhciBvblRva2VuID0gZnVuY3Rpb24oc3JjLCB0eXBlKXtcbiAgICBvblRva2VuX29yaWcoe1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIHNyYzogc3JjLFxuICAgICAgbGluZTogbGluZSxcbiAgICAgIGNvbDogY29sXG4gICAgfSk7XG4gICAgdmFyIGxpbmVzID0gc3JjLnNwbGl0KFwiXFxuXCIpO1xuICAgIGxpbmUgKz0gbGluZXMubGVuZ3RoIC0gMTtcbiAgICBjb2wgPSAobGluZXMubGVuZ3RoID4gMSA/IDEgOiBjb2wpICsgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYWRkUnVsZTogZnVuY3Rpb24ocmVnZXgsIHR5cGUpe1xuICAgICAgcnVsZXMucHVzaCh7cmVnZXg6IHJlZ2V4LCB0eXBlOiB0eXBlfSk7XG4gICAgfSxcbiAgICBvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgdmFyIHN0ciA9IGJ1ZmZlciArIHRleHQ7XG4gICAgICB2YXIgbSA9IGZpbmRNYXhJbmRleEFuZFJ1bGUocnVsZXMsIHN0cik7XG4gICAgICB3aGlsZShtICYmIG0ubWF4X2luZGV4ICE9PSBzdHIubGVuZ3RoKXtcbiAgICAgICAgb25Ub2tlbihzdHIuc3Vic3RyaW5nKDAsIG0ubWF4X2luZGV4KSwgbS5ydWxlLnR5cGUpO1xuXG4gICAgICAgIC8vbm93IGZpbmQgdGhlIG5leHQgdG9rZW5cbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyhtLm1heF9pbmRleCk7XG4gICAgICAgIG0gPSBmaW5kTWF4SW5kZXhBbmRSdWxlKHJ1bGVzLCBzdHIpO1xuICAgICAgfVxuICAgICAgYnVmZmVyID0gc3RyO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpe1xuICAgICAgaWYoYnVmZmVyLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB2YXIgcnVsZSA9IGZpbmRNYXRjaGluZ1J1bGUocnVsZXMsIGJ1ZmZlcik7XG4gICAgICBpZighcnVsZSl7XG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJ1bmFibGUgdG8gdG9rZW5pemVcIik7XG4gICAgICAgIGVyci50b2tlbml6ZXIyID0ge1xuICAgICAgICAgIGJ1ZmZlcjogYnVmZmVyLFxuICAgICAgICAgIGxpbmU6IGxpbmUsXG4gICAgICAgICAgY29sOiBjb2xcbiAgICAgICAgfTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuXG4gICAgICBvblRva2VuKGJ1ZmZlciwgcnVsZS50eXBlKTtcbiAgICB9XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdEZhY2Vib29rUHJldmlldzogcmVxdWlyZSggXCIuL2pzL2ZhY2Vib29rUHJldmlld1wiICksXG5cdFR3aXR0ZXJQcmV2aWV3OiByZXF1aXJlKCBcIi4vanMvdHdpdHRlclByZXZpZXdcIiApXG59O1xuIiwidmFyIHBsYWNlaG9sZGVyVGVtcGxhdGUgPSByZXF1aXJlKCBcIi4uL3RlbXBsYXRlc1wiICkuaW1hZ2VQbGFjZWhvbGRlcjtcblxuLyoqXG4gKiBTZXRzIHRoZSBwbGFjZWhvbGRlciB3aXRoIGEgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICBpbWFnZUNvbnRhaW5lciBUaGUgbG9jYXRpb24gdG8gcHV0IHRoZSBwbGFjZWhvbGRlciBpbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgcGxhY2Vob2xkZXIgICAgVGhlIHZhbHVlIGZvciB0aGUgcGxhY2Vob2xkZXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRXJyb3IgICAgICAgIFdoZW4gdGhlIHBsYWNlaG9sZGVyIHNob3VsZCBhbiBlcnJvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgbW9kaWZpZXIgICAgICAgQSBjc3MgY2xhc3MgbW9kaWZpZXIgdG8gY2hhbmdlIHRoZSBzdHlsaW5nLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBzZXRJbWFnZVBsYWNlaG9sZGVyKCBpbWFnZUNvbnRhaW5lciwgcGxhY2Vob2xkZXIsIGlzRXJyb3IsIG1vZGlmaWVyICkge1xuXHR2YXIgY2xhc3NOYW1lcyA9IFsgXCJzb2NpYWwtaW1hZ2UtcGxhY2Vob2xkZXJcIiBdO1xuXHRpc0Vycm9yID0gaXNFcnJvciB8fCBmYWxzZTtcblx0bW9kaWZpZXIgPSBtb2RpZmllciB8fCBcIlwiO1xuXG5cdGlmICggaXNFcnJvciApIHtcblx0XHRjbGFzc05hbWVzLnB1c2goIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyLS1lcnJvclwiICk7XG5cdH1cblxuXHRpZiAoIFwiXCIgIT09IG1vZGlmaWVyICkge1xuXHRcdGNsYXNzTmFtZXMucHVzaCggXCJzb2NpYWwtaW1hZ2UtcGxhY2Vob2xkZXItLVwiICsgbW9kaWZpZXIgKTtcblx0fVxuXG5cdGltYWdlQ29udGFpbmVyLmlubmVySFRNTCA9IHBsYWNlaG9sZGVyVGVtcGxhdGUoIHtcblx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZXMuam9pbiggXCIgXCIgKSxcblx0XHRwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXIsXG5cdH0gKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRJbWFnZVBsYWNlaG9sZGVyO1xuIiwidmFyIGlzRW1wdHkgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRW1wdHlcIiApO1xudmFyIGRlYm91bmNlID0gcmVxdWlyZSggXCJsb2Rhc2gvZnVuY3Rpb24vZGVib3VuY2VcIiApO1xudmFyIHN0cmlwSFRNTFRhZ3MgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qc1wiICk7XG52YXIgc3RyaXBTcGFjZXMgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanNcIiApO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBmaWVsZCBhbmQgc2V0cyB0aGUgZXZlbnRzIGZvciB0aGF0IGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgaW5wdXRGaWVsZCBUaGUgZmllbGQgdG8gcmVwcmVzZW50LlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICB2YWx1ZXMgICAgIFRoZSB2YWx1ZXMgdG8gdXNlLlxuICogQHBhcmFtIHtPYmplY3R8dW5kZWZpbmVkfSBjYWxsYmFjayAgIFRoZSBjYWxsYmFjayB0byBleGVjdXRlZCBhZnRlciBmaWVsZCBjaGFuZ2UuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSW5wdXRFbGVtZW50KCBpbnB1dEZpZWxkLCB2YWx1ZXMsIGNhbGxiYWNrICkge1xuXHR0aGlzLmlucHV0RmllbGQgPSBpbnB1dEZpZWxkO1xuXHR0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0dGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuXHR0aGlzLnNldFZhbHVlKCB0aGlzLmdldElucHV0VmFsdWUoKSApO1xuXG5cdHRoaXMuYmluZEV2ZW50cygpO1xufVxuXG4vKipcbiAqIEJpbmRzIHRoZSBldmVudHMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBTZXQgdGhlIGV2ZW50cy5cblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5ZG93blwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJrZXl1cFwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImlucHV0XCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImZvY3VzXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImJsdXJcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcbn07XG5cbi8qKlxuICogRG8gdGhlIGNoYW5nZSBldmVudC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuY2hhbmdlRXZlbnQgPSBkZWJvdW5jZSggZnVuY3Rpb24oKSB7XG5cdC8vIFdoZW4gdGhlcmUgaXMgYSBjYWxsYmFjayBydW4gaXQuXG5cdGlmICggdHlwZW9mIHRoaXMuX2NhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdHRoaXMuX2NhbGxiYWNrKCk7XG5cdH1cblxuXHR0aGlzLnNldFZhbHVlKCB0aGlzLmdldElucHV0VmFsdWUoKSApO1xufSwgMjUgKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IGZpZWxkIHZhbHVlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjdXJyZW50IGZpZWxkIHZhbHVlLlxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmdldElucHV0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0cyB0aGUgYSB2YWx1ZSBmb3IgdGhlIHByZXZpZXcuIElmIHZhbHVlIGlzIGVtcHR5IGEgc2FtcGxlIHZhbHVlIGlzIHVzZWQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB0aXRsZSwgd2l0aG91dCBodG1sIHRhZ3MuXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZm9ybWF0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuXG5cdHZhbHVlID0gc3RyaXBIVE1MVGFncyggdmFsdWUgKTtcblxuXHQvLyBBcyBhbiB1bHRpbWF0ZSBmYWxsYmFjayBwcm92aWRlIHRoZSB1c2VyIHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLmZhbGxiYWNrO1xuXHR9XG5cblx0cmV0dXJuIHN0cmlwU3BhY2VzKCB2YWx1ZSApO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybiB0aGUgdmFsdWUgb3IgZ2V0IGEgZmFsbGJhY2sgb25lLlxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB2YWx1ZSA9IHRoaXMudmFsdWVzLmN1cnJlbnRWYWx1ZTtcblxuXHQvLyBGYWxsYmFjayB0byB0aGUgZGVmYXVsdCBpZiB2YWx1ZSBpcyBlbXB0eS5cblx0aWYgKCBpc0VtcHR5KCB2YWx1ZSApICkge1xuXHRcdHZhbHVlID0gdGhpcy52YWx1ZXMuZGVmYXVsdFZhbHVlO1xuXHR9XG5cblx0Ly8gRm9yIHJlbmRlcmluZyB3ZSBjYW4gZmFsbGJhY2sgdG8gdGhlIHBsYWNlaG9sZGVyIGFzIHdlbGwuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLnBsYWNlaG9sZGVyO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGN1cnJlbnQgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdHRoaXMudmFsdWVzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dEVsZW1lbnQ7XG4iLCIvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuXG52YXIgaXNFbGVtZW50ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VsZW1lbnRcIiApO1xudmFyIGNsb25lID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9jbG9uZVwiICk7XG52YXIgZGVmYXVsdHNEZWVwID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzRGVlcFwiICk7XG5cbnZhciBKZWQgPSByZXF1aXJlKCBcImplZFwiICk7XG5cbnZhciBpbWFnZURpc3BsYXlNb2RlID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvaW1hZ2VEaXNwbGF5TW9kZVwiICk7XG52YXIgcmVuZGVyRGVzY3JpcHRpb24gPSByZXF1aXJlKCBcIi4vaGVscGVycy9yZW5kZXJEZXNjcmlwdGlvblwiICk7XG52YXIgaW1hZ2VQbGFjZWhvbGRlciA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2ltYWdlUGxhY2Vob2xkZXJcIiApO1xudmFyIGJlbUFkZE1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyXCIgKTtcbnZhciBiZW1SZW1vdmVNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllclwiICk7XG5cbnZhciBUZXh0RmllbGQgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRJbnB1dFwiICk7XG52YXIgVGV4dEFyZWEgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRhcmVhXCIgKTtcblxudmFyIElucHV0RWxlbWVudCA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2lucHV0XCIgKTtcbnZhciBQcmV2aWV3RXZlbnRzID0gcmVxdWlyZSggXCIuL3ByZXZpZXcvZXZlbnRzXCIgKTtcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoIFwiLi90ZW1wbGF0ZXMuanNcIiApO1xudmFyIGZhY2Vib29rRWRpdG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tQcmV2aWV3O1xudmFyIGZhY2Vib29rQXV0aG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tBdXRob3I7XG5cbnZhciBmYWNlYm9va0RlZmF1bHRzID0ge1xuXHRkYXRhOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCIsXG5cdH0sXG5cdGRlZmF1bHRWYWx1ZToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiLFxuXHR9LFxuXHRiYXNlVVJMOiBcImV4YW1wbGUuY29tXCIsXG5cdGNhbGxiYWNrczoge1xuXHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCkge30sXG5cdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdHJldHVybiB0aXRsZTtcblx0XHR9LFxuXHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdFx0fSxcblx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0cmV0dXJuIGltYWdlVXJsO1xuXHRcdH0sXG5cdH0sXG59O1xuXG52YXIgaW5wdXRGYWNlYm9va1ByZXZpZXdCaW5kaW5ncyA9IFtcblx0e1xuXHRcdHByZXZpZXc6IFwiZWRpdGFibGUtcHJldmlld19fdGl0bGUtLWZhY2Vib29rXCIsXG5cdFx0aW5wdXRGaWVsZDogXCJ0aXRsZVwiLFxuXHR9LFxuXHR7XG5cdFx0cHJldmlldzogXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIixcblx0XHRpbnB1dEZpZWxkOiBcImltYWdlVXJsXCIsXG5cdH0sXG5cdHtcblx0XHRwcmV2aWV3OiBcImVkaXRhYmxlLXByZXZpZXdfX2Rlc2NyaXB0aW9uLS1mYWNlYm9va1wiLFxuXHRcdGlucHV0RmllbGQ6IFwiZGVzY3JpcHRpb25cIixcblx0fSxcbl07XG5cbnZhciBXSURUSF9GQUNFQk9PS19JTUFHRV9TTUFMTCA9IDE1ODtcbnZhciBXSURUSF9GQUNFQk9PS19JTUFHRV9MQVJHRSA9IDQ3MDtcblxudmFyIEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9XSURUSCA9IDIwMDtcbnZhciBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfSEVJR0hUID0gMjAwO1xuXG52YXIgRkFDRUJPT0tfSU1BR0VfVEhSRVNIT0xEX1dJRFRIID0gNjAwO1xudmFyIEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFQgPSAzMTU7XG5cbi8qKlxuICogQG1vZHVsZSBzbmlwcGV0UHJldmlld1xuICovXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29uZmlnIGFuZCBvdXRwdXRUYXJnZXQgZm9yIHRoZSBTbmlwcGV0UHJldmlldy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gU25pcHBldCBwcmV2aWV3IG9wdGlvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyICAgICAgICAgICAgICAgICAgIC0gVGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBmb3IgdGhlIGZpZWxkcywgd2lsbCBiZSBzaG93biBhc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbCBwbGFjZWhvbGRlcnMgaW4gdGhlIGlucHV0cyBhbmQgYXMgYSBmYWxsYmFjayBmb3IgdGhlIHByZXZpZXcuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLnRpdGxlICAgICAgICAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSB0aXRsZSBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGRlc2NyaXB0aW9uIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCAgICAgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgaW1hZ2UgdXJsIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlICAgICAgICAgICAgICAgICAgLSBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhlIGZpZWxkcywgaWYgdGhlIHVzZXIgaGFzIG5vdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgYSBmaWVsZCwgdGhpcyB2YWx1ZSB3aWxsIGJlIHVzZWQgZm9yIHRoZSBhbmFseXplcixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3IGFuZCB0aGUgcHJvZ3Jlc3MgYmFycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlICAgICAgICAgICAgLSBEZWZhdWx0IHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gICAgICAtIERlZmF1bHQgZGVzY3JpcHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCAgICAgICAgIC0gRGVmYXVsdCBpbWFnZSB1cmwuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5iYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gRmFjZWJvb2suXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICBvcHRzLnRhcmdldEVsZW1lbnQgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmNhbGxiYWNrcyAgICAgICAgICAgICAgICAgICAgIC0gRnVuY3Rpb25zIHRoYXQgYXJlIGNhbGxlZCBvbiBzcGVjaWZpYyBpbnN0YW5jZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBvcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3IC0gRnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHNvY2lhbCBwcmV2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBpMThuIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50ICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGVsZW1lbnRzIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5yZW5kZXJlZCAgICAgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQudGl0bGUgICAgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdGl0bGUgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuaW1hZ2VVcmwgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdXJsIHBhdGggZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24gICAgICAgLSBUaGUgcmVuZGVyZWQgRmFjZWJvb2sgZGVzY3JpcHRpb24gZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50LmlucHV0ICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGlucHV0IGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC50aXRsZSAgICAgICAgICAgICAgICAtIFRoZSB0aXRsZSBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5pbWFnZVVybCAgICAgICAgICAgICAtIFRoZSB1cmwgcGF0aCBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbiAgICAgICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uIGlucHV0IGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5jb250YWluZXIgICAgICAgICAgICAgICAgICAtIFRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5mb3JtQ29udGFpbmVyICAgICAgICAgICAgICAtIFRoZSBmb3JtIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5lZGl0VG9nZ2xlICAgICAgICAgICAgICAgICAtIFRoZSBidXR0b24gdGhhdCB0b2dnbGVzIHRoZSBlZGl0b3IgZm9ybS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBkYXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGRhdGEgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLnRpdGxlICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRpdGxlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5pbWFnZVVybCAgICAgICAgICAgICAgICAgICAgICAtIFRoZSB1cmwgcGF0aC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEuZGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBiYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiBnb29nbGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBGYWNlYm9va1ByZXZpZXcgPSBmdW5jdGlvbiggb3B0cywgaTE4biApIHtcblx0dGhpcy5pMThuID0gaTE4biB8fCB0aGlzLmNvbnN0cnVjdEkxOG4oKTtcblxuXHRmYWNlYm9va0RlZmF1bHRzLnBsYWNlaG9sZGVyID0ge1xuXHRcdHRpdGxlOiB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhpcyBpcyBhbiBleGFtcGxlIHRpdGxlIC0gZWRpdCBieSBjbGlja2luZyBoZXJlXCIgKSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIk1vZGlmeSB5b3VyICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyBpdCByaWdodCBoZXJlXCIgKSxcblx0XHRcdFwiRmFjZWJvb2tcIlxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IFwiXCIsXG5cdH07XG5cblx0ZGVmYXVsdHNEZWVwKCBvcHRzLCBmYWNlYm9va0RlZmF1bHRzICk7XG5cblx0aWYgKCAhIGlzRWxlbWVudCggb3B0cy50YXJnZXRFbGVtZW50ICkgKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcIlRoZSBGYWNlYm9vayBwcmV2aWV3IHJlcXVpcmVzIGEgdmFsaWQgdGFyZ2V0IGVsZW1lbnRcIiApO1xuXHR9XG5cblx0dGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXHR0aGlzLm9wdHMgPSBvcHRzO1xuXG5cblx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgaTE4biBvYmplY3QgYmFzZWQgb24gcGFzc2VkIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNsYXRpb25zIC0gVGhlIHZhbHVlcyB0byB0cmFuc2xhdGUuXG4gKlxuICogQHJldHVybnMge0plZH0gLSBUaGUgSmVkIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0ZG9tYWluOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuXHRcdGxvY2FsZV9kYXRhOiB7XG5cdFx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge30sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW5kZXJUZW1wbGF0ZSgpO1xuXHR0aGlzLmJpbmRFdmVudHMoKTtcblx0dGhpcy51cGRhdGVQcmV2aWV3KCk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgc25pcHBldCBlZGl0b3IgYW5kIGFkZHMgaXQgdG8gdGhlIHRhcmdldEVsZW1lbnQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHR0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9IGZhY2Vib29rRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkwsXG5cdFx0fSxcblx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLFxuXHRcdGkxOG46IHtcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRlZGl0OiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIkVkaXQgJTEkcyBwcmV2aWV3XCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0c25pcHBldFByZXZpZXc6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBwcmV2aWV3XCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0c25pcHBldEVkaXRvcjogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGVkaXRvclwiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdH0sXG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXRpdGxlXCIgKVsgMCBdLFxuXHRcdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stZGVzY3JpcHRpb25cIiApWyAwIF0sXG5cdFx0fSxcblx0XHRmaWVsZHM6IHRoaXMuZ2V0RmllbGRzKCksXG5cdFx0Y29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlldy0tZmFjZWJvb2tcIiApWyAwIF0sXG5cdFx0Zm9ybUNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKVsgMCBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWyAwIF0sXG5cdFx0Zm9ybUZpZWxkczogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtLWZpZWxkXCIgKSxcblx0XHRoZWFkaW5nRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yXCIgKVsgMCBdLFxuXHRcdGF1dGhvckNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1hdXRob3JcIiApWyAwIF0sXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gdGhpcy5lbGVtZW50LmZpZWxkcy5pbWFnZVVybC5yZW5kZXIoKSArXG5cdFx0dGhpcy5lbGVtZW50LmZpZWxkcy50aXRsZS5yZW5kZXIoKSArXG5cdFx0dGhpcy5lbGVtZW50LmZpZWxkcy5kZXNjcmlwdGlvbi5yZW5kZXIoKTtcblxuXHR0aGlzLmVsZW1lbnQuaW5wdXQgPSB7XG5cdFx0dGl0bGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiIClbIDAgXSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKVsgMCBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWyAwIF0sXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMgPSB0aGlzLmdldEZpZWxkRWxlbWVudHMoKTtcblx0dGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yID0gdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19zdWJtaXRcIiApWyAwIF07XG5cblx0dGhpcy5lbGVtZW50LmNhcmV0SG9va3MgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5pbnB1dC50aXRsZS5wcmV2aW91c1NpYmxpbmcsXG5cdFx0aW1hZ2VVcmw6IHRoaXMuZWxlbWVudC5pbnB1dC5pbWFnZVVybC5wcmV2aW91c1NpYmxpbmcsXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbi5wcmV2aW91c1NpYmxpbmcsXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LnByZXZpZXcgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIgKVsgMCBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZSxcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZm9ybSBmaWVsZHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogKiwgZGVzY3JpcHRpb246ICosIGltYWdlVXJsOiAqLCBidXR0b246IEJ1dHRvbn19IE9iamVjdCB3aXRoIHRoZSBmaWVsZHMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX3RpdGxlIGpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItdGl0bGVcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgdGl0bGVcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiLFxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIixcblx0XHR9ICksXG5cdFx0aW1hZ2VVcmw6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2ltYWdlVXJsIGpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgaW1hZ2VcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiLFxuXHRcdH0gKSxcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVsgMCBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0XHRmYWxsYmFjazogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIHRpdGxlIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHRcIkZhY2Vib29rXCJcblx0XHRcdFx0KSxcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbIDAgXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbixcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0XHRcdCksXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWyAwIF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHRcdGZhbGxiYWNrOiBcIlwiLFxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpLFxuXHR9O1xufTtcblxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIEZhY2Vib29rIHByZXZpZXcuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUudXBkYXRlUHJldmlldyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBVcGRhdGUgdGhlIGRhdGEuXG5cdHRoaXMuZGF0YS50aXRsZSA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldElucHV0VmFsdWUoKTtcblx0dGhpcy5kYXRhLmRlc2NyaXB0aW9uID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuaW1hZ2VVcmwgPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5pbWFnZVVybC5nZXRJbnB1dFZhbHVlKCk7XG5cblx0Ly8gU2V0cyB0aGUgdGl0bGUgZmllbGRcblx0dGhpcy5zZXRUaXRsZSggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0VmFsdWUoKSApO1xuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cblx0Ly8gU2V0IHRoZSBkZXNjcmlwdGlvbiBmaWVsZCBhbmQgcGFyc2UgdGhlIHN0eWxpbmcgb2YgaXQuXG5cdHRoaXMuc2V0RGVzY3JpcHRpb24oIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXRzIHRoZSBJbWFnZVxuXHR0aGlzLnNldEltYWdlKCB0aGlzLmRhdGEuaW1hZ2VVcmwgKTtcblxuXHQvLyBDbG9uZSBzbyB0aGUgZGF0YSBpc24ndCBjaGFuZ2VhYmxlLlxuXHR0aGlzLm9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcoIGNsb25lKCB0aGlzLmRhdGEgKSApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcmV2aWV3IHRpdGxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSBUaGUgdGl0bGUgdG8gc2V0LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFRpdGxlID0gZnVuY3Rpb24oIHRpdGxlICkge1xuXHR0aXRsZSA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5VGl0bGUoIHRpdGxlICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcmV2aWV3IGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgZGVzY3JpcHRpb24gdG8gc2V0LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgdGhlIGltYWdlLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEltYWdlQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmVsZW1lbnQucHJldmlldy5pbWFnZVVybDtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgaW1hZ2Ugb2JqZWN0IHdpdGggdGhlIG5ldyBVUkwuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsIFRoZSBpbWFnZSBwYXRoLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRpbWFnZVVybCA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5SW1hZ2VVcmwoIGltYWdlVXJsICk7XG5cblx0aWYgKCBpbWFnZVVybCA9PT0gXCJcIiAmJiB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRyZXR1cm4gdGhpcy5ub1VybFNldCgpO1xuXHR9XG5cblx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG5cdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMuaXNUb29TbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbWFnZVRvb1NtYWxsKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTaXppbmdDbGFzcyggaW1nICk7XG5cdFx0dGhpcy5hZGRJbWFnZVRvQ29udGFpbmVyKCBpbWFnZVVybCApO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHRpbWcub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0cmV0dXJuIHRoaXMuaW1hZ2VFcnJvcigpO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHQvLyBMb2FkIGltYWdlIHRvIHRyaWdnZXIgbG9hZCBvciBlcnJvciBldmVudC5cblx0aW1nLnNyYyA9IGltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBEaXNwbGF5cyB0aGUgTm8gVVJMIFNldCB3YXJuaW5nLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLm5vVXJsU2V0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aW1hZ2VQbGFjZWhvbGRlcihcblx0XHR0aGlzLmdldEltYWdlQ29udGFpbmVyKCksXG5cdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBzZWxlY3QgYW4gaW1hZ2UgYnkgY2xpY2tpbmcgaGVyZVwiICksXG5cdFx0ZmFsc2UsXG5cdFx0XCJmYWNlYm9va1wiXG5cdCk7XG5cblx0cmV0dXJuO1xufTtcblxuLyoqXG4gKiBEaXNwbGF5cyB0aGUgSW1hZ2UgVG9vIFNtYWxsIGVycm9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlVG9vU21hbGwgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1lc3NhZ2U7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0bWVzc2FnZSA9IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIldlIGFyZSB1bmFibGUgdG8gZGV0ZWN0IGFuIGltYWdlIFwiICtcblx0XHRcdFx0XCJpbiB5b3VyIHBvc3QgdGhhdCBpcyBsYXJnZSBlbm91Z2ggdG8gYmUgZGlzcGxheWVkIG9uIEZhY2Vib29rLiBXZSBhZHZpc2UgeW91IFwiICtcblx0XHRcdFx0XCJ0byBzZWxlY3QgYSAlMSRzIGltYWdlIHRoYXQgZml0cyB0aGUgcmVjb21tZW5kZWQgaW1hZ2Ugc2l6ZS5cIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRtZXNzYWdlID0gdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGltYWdlIHlvdSBzZWxlY3RlZCBpcyB0b28gc21hbGwgZm9yICUxJHNcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fVxuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdG1lc3NhZ2UsXG5cdFx0dHJ1ZSxcblx0XHRcImZhY2Vib29rXCJcblx0KTtcblxuXHRyZXR1cm47XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBVcmwgQ2Fubm90IEJlIExvYWRlZCBlcnJvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pbWFnZUVycm9yID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aW1hZ2VQbGFjZWhvbGRlcihcblx0XHR0aGlzLmdldEltYWdlQ29udGFpbmVyKCksXG5cdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlRoZSBnaXZlbiBpbWFnZSB1cmwgY2Fubm90IGJlIGxvYWRlZFwiICksXG5cdFx0dHJ1ZSxcblx0XHRcImZhY2Vib29rXCJcblx0KTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgaW1hZ2Ugb2YgdGhlIGltYWdlIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2UgVGhlIGltYWdlIHRvIHVzZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGFpbmVyID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBpbWFnZSArIFwiKVwiO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250YWluZXIuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjb250YWluZXIgPSB0aGlzLmdldEltYWdlQ29udGFpbmVyKCk7XG5cblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwiXCI7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByb3BlciBDU1MgY2xhc3MgZm9yIHRoZSBjdXJyZW50IGltYWdlLlxuICpcbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2UgdG8gYmFzZSB0aGUgc2l6aW5nIGNsYXNzIG9uLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFNpemluZ0NsYXNzID0gZnVuY3Rpb24oIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIGltYWdlRGlzcGxheU1vZGUoIGltZyApID09PSBcInBvcnRyYWl0XCIgKSB7XG5cdFx0dGhpcy5zZXRQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoLlxuICpcbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2Ugb2JqZWN0IHRvIHVzZS5cbiAqXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgY2FsY3VsYXRlZCBtYXh3aWR0aC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX1NNQUxMO1xuXHR9XG5cblx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX0xBUkdFO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNob3VsZCBzd2l0Y2ggdG8gc21hbGwgaW1hZ2UgbW9kZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgc21hbGwuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuaXNTbWFsbEltYWdlID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHRyZXR1cm4gKFxuXHRcdGltYWdlLndpZHRoIDwgRkFDRUJPT0tfSU1BR0VfVEhSRVNIT0xEX1dJRFRIIHx8XG5cdFx0aW1hZ2UuaGVpZ2h0IDwgRkFDRUJPT0tfSU1BR0VfVEhSRVNIT0xEX0hFSUdIVFxuXHQpO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSBGYWNlYm9vayBwcmV2aWV3IGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgdG9vIHNtYWxsLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmlzVG9vU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9XSURUSCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9IRUlHSFRcblx0KTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgRmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIHNtYWxsIEZhY2Vib29rIGltYWdlIHByZXZpZXcuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzbWFsbCBpbWFnZSBjbGFzc2VzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIGxhcmdlIGZhY2Vib29rIGltYWdlIHByZXZpZXcuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0TGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBsYXJnZSBpbWFnZSBjbGFzc2VzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUxhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgRmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIHBvcnRyYWl0IEZhY2Vib29rIGltYWdlIHByZXZpZXcuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0UG9ydHJhaXRJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1ib3R0b21cIiwgXCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIHBvcnRyYWl0IGltYWdlIGNsYXNzZXMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlUG9ydHJhaXRJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1ib3R0b21cIiwgXCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGltYWdlIGNsYXNzZXMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlU21hbGxJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVMYXJnZUltYWdlQ2xhc3NlcygpO1xuXHR0aGlzLnJlbW92ZVBvcnRyYWl0SW1hZ2VDbGFzc2VzKCk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSByZWxvYWRTbmlwcGV0VGV4dCBmdW5jdGlvbiB0byB0aGUgYmx1ciBvZiB0aGUgc25pcHBldCBpbnB1dHMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcHJldmlld0V2ZW50cyA9IG5ldyBQcmV2aWV3RXZlbnRzKCBpbnB1dEZhY2Vib29rUHJldmlld0JpbmRpbmdzLCB0aGlzLmVsZW1lbnQsIHRydWUgKTtcblx0cHJldmlld0V2ZW50cy5iaW5kRXZlbnRzKCB0aGlzLmVsZW1lbnQuZWRpdFRvZ2dsZSwgdGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBGYWNlYm9vayBhdXRob3IgbmFtZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYXV0aG9yTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXV0aG9yIHRvIHNob3cuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0QXV0aG9yID0gZnVuY3Rpb24oIGF1dGhvck5hbWUgKSB7XG5cdHZhciBhdXRob3JIdG1sID0gXCJcIjtcblx0aWYgKCBhdXRob3JOYW1lICE9PSBcIlwiICkge1xuXHRcdGF1dGhvckh0bWwgPSBmYWNlYm9va0F1dGhvclRlbXBsYXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRhdXRob3JOYW1lOiBhdXRob3JOYW1lLFxuXHRcdFx0XHRhdXRob3JCeTogdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIkJ5XCIgKSxcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dGhpcy5lbGVtZW50LmF1dGhvckNvbnRhaW5lci5pbm5lckhUTUwgPSBhdXRob3JIdG1sO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9va1ByZXZpZXc7XG4iLCIvKipcbiAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgICBUaGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBhZGQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIGNsYXNzTmFtZSApIHtcblx0dmFyIGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCggXCIgXCIgKTtcblxuXHRpZiAoIC0xID09PSBjbGFzc2VzLmluZGV4T2YoIGNsYXNzTmFtZSApICkge1xuXHRcdGNsYXNzZXMucHVzaCggY2xhc3NOYW1lICk7XG5cdH1cblxuXHRlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbiggXCIgXCIgKTtcbn07XG4iLCJ2YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCBcIi4vLi4vYWRkQ2xhc3NcIiApO1xudmFyIGFkZE1vZGlmaWVyVG9DbGFzcyA9IHJlcXVpcmUoIFwiLi9hZGRNb2RpZmllclRvQ2xhc3NcIiApO1xuXG4vKipcbiAqIEFkZHMgYSBCRU0gbW9kaWZpZXIgdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICBtb2RpZmllciAgICAgTW9kaWZpZXIgdG8gYWRkIHRvIHRoZSB0YXJnZXQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICB0YXJnZXRDbGFzcyAgVGhlIHRhcmdldCB0byBhZGQgdGhlIG1vZGlmaWVyIHRvLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0UGFyZW50IFRoZSBwYXJlbnQgaW4gd2hpY2ggdGhlIHRhcmdldCBzaG91bGQgYmUuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MsIHRhcmdldFBhcmVudCApIHtcblx0dmFyIGVsZW1lbnQgPSB0YXJnZXRQYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggdGFyZ2V0Q2xhc3MgKVsgMCBdO1xuXHR2YXIgbmV3Q2xhc3MgPSBhZGRNb2RpZmllclRvQ2xhc3MoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcyApO1xuXG5cdGFkZENsYXNzKCBlbGVtZW50LCBuZXdDbGFzcyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1vZGlmaWVyO1xuIiwiLyoqXG4gKiBBZGRzIGEgbW9kaWZpZXIgdG8gYSBjbGFzcyBuYW1lLCBtYWtlcyBzdXJlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyIFRoZSBtb2RpZmllciB0byBhZGQgdG8gdGhlIGNsYXNzIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyBuYW1lIHRvIGFkZCB0aGUgbW9kaWZpZXIgdG8uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5ldyBjbGFzcyB3aXRoIHRoZSBtb2RpZmllci5cbiAqL1xuZnVuY3Rpb24gYWRkTW9kaWZpZXJUb0NsYXNzKCBtb2RpZmllciwgY2xhc3NOYW1lICkge1xuXHR2YXIgYmFzZUNsYXNzID0gY2xhc3NOYW1lLnJlcGxhY2UoIC8tLS4rLywgXCJcIiApO1xuXG5cdHJldHVybiBiYXNlQ2xhc3MgKyBcIi0tXCIgKyBtb2RpZmllcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNb2RpZmllclRvQ2xhc3M7XG4iLCJ2YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4vLi4vcmVtb3ZlQ2xhc3NcIiApO1xudmFyIGFkZE1vZGlmaWVyVG9DbGFzcyA9IHJlcXVpcmUoIFwiLi9hZGRNb2RpZmllclRvQ2xhc3NcIiApO1xuXG4vKipcbiAqIFJlbW92ZXMgYSBCRU0gbW9kaWZpZXIgZnJvbSBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIG1vZGlmaWVyICAgICBNb2RpZmllciB0byBhZGQgdG8gdGhlIHRhcmdldC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIHRhcmdldENsYXNzICBUaGUgdGFyZ2V0IHRvIGFkZCB0aGUgbW9kaWZpZXIgdG8uXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRQYXJlbnQgVGhlIHBhcmVudCBpbiB3aGljaCB0aGUgdGFyZ2V0IHNob3VsZCBiZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTW9kaWZpZXIoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcywgdGFyZ2V0UGFyZW50ICkge1xuXHR2YXIgZWxlbWVudCA9IHRhcmdldFBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB0YXJnZXRDbGFzcyApWyAwIF07XG5cdHZhciBuZXdDbGFzcyA9IGFkZE1vZGlmaWVyVG9DbGFzcyggbW9kaWZpZXIsIHRhcmdldENsYXNzICk7XG5cblx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIG5ld0NsYXNzICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlTW9kaWZpZXI7XG4iLCIvKipcbiAqIFJldHJpZXZlcyB0aGUgaW1hZ2UgZGlzcGxheSBtb2RlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGltYWdlIFRoZSBpbWFnZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGlzcGxheSBtb2RlIG9mIHRoZSBpbWFnZS5cbiAqL1xuZnVuY3Rpb24gaW1hZ2VEaXNwbGF5TW9kZSggaW1hZ2UgKSB7XG5cdGlmICggaW1hZ2UuaGVpZ2h0ID4gaW1hZ2Uud2lkdGggKSB7XG5cdFx0cmV0dXJuIFwicG9ydHJhaXRcIjtcblx0fVxuXG5cdHJldHVybiBcImxhbmRzY2FwZVwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlRGlzcGxheU1vZGU7XG4iLCIvKipcbiAqIENsZWFucyBzcGFjZXMgZnJvbSB0aGUgaHRtbC5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGh0bWwgVGhlIGh0bWwgdG8gbWluaW1pemUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG1pbmltaXplZCBodG1sIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gbWluaW1pemVIdG1sKCBodG1sICkge1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvKFxccyspL2csIFwiIFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8+IDwvZywgXCI+PFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gPi9nLCBcIj5cIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvPiAvZywgXCI+XCIgKTtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLyA8L2csIFwiPFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gJC8sIFwiXCIgKTtcblxuXHRyZXR1cm4gaHRtbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtaW5pbWl6ZUh0bWw7XG4iLCIvKipcbiAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgIFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgY2xhc3MgZnJvbS5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgIGNsYXNzTmFtZSBUaGUgY2xhc3MgdG8gcmVtb3ZlLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBlbGVtZW50LCBjbGFzc05hbWUgKSB7XG5cdHZhciBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoIFwiIFwiICk7XG5cdHZhciBmb3VuZENsYXNzID0gY2xhc3Nlcy5pbmRleE9mKCBjbGFzc05hbWUgKTtcblxuXHRpZiAoIC0xICE9PSBmb3VuZENsYXNzICkge1xuXHRcdGNsYXNzZXMuc3BsaWNlKCBmb3VuZENsYXNzLCAxICk7XG5cdH1cblxuXHRlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbiggXCIgXCIgKTtcbn07XG4iLCJ2YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvaXNFbXB0eVwiICk7XG52YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkQ2xhc3NcIiApO1xudmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSggXCIuL3JlbW92ZUNsYXNzXCIgKTtcblxuLyoqXG4gKiBNYWtlcyB0aGUgcmVuZGVyZWQgZGVzY3JpcHRpb24gZ3JheSBpZiBubyBkZXNjcmlwdGlvbiBoYXMgYmVlbiBzZXQgYnkgdGhlIHVzZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uRWxlbWVudCBUYXJnZXQgZGVzY3JpcHRpb24gZWxlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiAgICAgICAgQ3VycmVudCBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gcmVuZGVyRGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uRWxlbWVudCwgZGVzY3JpcHRpb24gKSB7XG5cdGlmICggaXNFbXB0eSggZGVzY3JpcHRpb24gKSApIHtcblx0XHRhZGRDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtcmVuZGVyXCIgKTtcblx0XHRyZW1vdmVDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtZGVmYXVsdFwiICk7XG5cdH0gZWxzZSB7XG5cdFx0YWRkQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLWRlZmF1bHRcIiApO1xuXHRcdHJlbW92ZUNsYXNzKCBkZXNjcmlwdGlvbkVsZW1lbnQsIFwiZGVzYy1yZW5kZXJcIiApO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyRGVzY3JpcHRpb247XG4iLCJ2YXIgZGVmYXVsdHMgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNcIiApO1xudmFyIG1pbmltaXplSHRtbCA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9taW5pbWl6ZUh0bWxcIiApO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIHRoZSBpbnB1dGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZSBUZW1wbGF0ZSBvYmplY3QgdG8gdXNlLlxuICpcbiAqIEByZXR1cm5zIHtUZXh0RmllbGR9IFRoZSB0ZXh0ZmllbGQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbnB1dEZpZWxkRmFjdG9yeSggdGVtcGxhdGUgKSB7XG5cdHZhciBkZWZhdWx0QXR0cmlidXRlcyA9IHtcblx0XHR2YWx1ZTogXCJcIixcblx0XHRjbGFzc05hbWU6IFwiXCIsXG5cdFx0aWQ6IFwiXCIsXG5cdFx0cGxhY2Vob2xkZXI6IFwiXCIsXG5cdFx0bmFtZTogXCJcIixcblx0XHR0aXRsZTogXCJcIixcblx0XHRsYWJlbENsYXNzTmFtZTogXCJcIixcblx0fTtcblxuXHQvKipcblx0ICogUmVwcmVzZW50cyBhbiBIVE1MIHRleHQgZmllbGQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzICAgICAgICAgICAgIFRoZSBhdHRyaWJ1dGVzIHRvIHNldCBvbiB0aGUgSFRNTCBlbGVtZW50LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy52YWx1ZSAgICAgICBUaGUgdmFsdWUgZm9yIHRoaXMgdGV4dCBmaWVsZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMucGxhY2Vob2xkZXIgVGhlIHBsYWNlaG9sZGVyIGZvciB0aGlzIHRleHQgZmllbGQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLm5hbWUgICAgICAgIFRoZSBuYW1lIGZvciB0aGlzIHRleHQgZmllbGQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLmlkICAgICAgICAgIFRoZSBpZCBmb3IgdGhpcyB0ZXh0IGZpZWxkLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5jbGFzc05hbWUgICBUaGUgY2xhc3MgZm9yIHRoaXMgdGV4dCBmaWVsZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMudGl0bGUgICAgICAgVGhlIHRpdGxlIHRoYXQgZGVzY3JpYmVzIHRoaXMgdGV4dCBmaWVsZC5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqL1xuXHRmdW5jdGlvbiBUZXh0RmllbGQoIGF0dHJpYnV0ZXMgKSB7XG5cdFx0YXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfHwge307XG5cdFx0YXR0cmlidXRlcyA9IGRlZmF1bHRzKCBhdHRyaWJ1dGVzLCBkZWZhdWx0QXR0cmlidXRlcyApO1xuXG5cdFx0dGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgSFRNTCBhdHRyaWJ1dGVzIHNldCBmb3IgdGhpcyB0ZXh0IGZpZWxkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgSFRNTCBhdHRyaWJ1dGVzLlxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHRleHQgZmllbGQgdG8gSFRNTC5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHJlbmRlcmVkIEhUTUwuXG5cdCAqL1xuXHRUZXh0RmllbGQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBodG1sID0gdGVtcGxhdGUoIHRoaXMuZ2V0QXR0cmlidXRlcygpICk7XG5cblx0XHRodG1sID0gbWluaW1pemVIdG1sKCBodG1sICk7XG5cblx0XHRyZXR1cm4gaHRtbDtcblx0fTtcblxuXHQvKipcblx0ICogU2V0IHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmllbGQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoaXMgaW5wdXQgZmllbGQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR0aGlzLl9hdHRyaWJ1dGVzLnZhbHVlID0gdmFsdWU7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpZWxkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBzZXQgb24gdGhpcyBpbnB1dCBmaWVsZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRUZXh0RmllbGQucHJvdG90eXBlLnNldENsYXNzTmFtZSA9IGZ1bmN0aW9uKCBjbGFzc05hbWUgKSB7XG5cdFx0dGhpcy5fYXR0cmlidXRlcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cdH07XG5cblx0cmV0dXJuIFRleHRGaWVsZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dEZpZWxkRmFjdG9yeTtcbiIsInZhciBpbnB1dEZpZWxkRmFjdG9yeSA9IHJlcXVpcmUoIFwiLi9pbnB1dEZpZWxkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dEZpZWxkRmFjdG9yeSggcmVxdWlyZSggXCIuLi90ZW1wbGF0ZXNcIiApLmZpZWxkcy50ZXh0ICk7XG4iLCJ2YXIgaW5wdXRGaWVsZEZhY3RvcnkgPSByZXF1aXJlKCBcIi4vaW5wdXRGaWVsZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3RvcnkoIHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5maWVsZHMudGV4dGFyZWEgKTtcbiIsInZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvY29sbGVjdGlvbi9mb3JFYWNoXCIgKTtcbnZhciBhZGRDbGFzcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9hZGRDbGFzcy5qc1wiICk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvcmVtb3ZlQ2xhc3MuanNcIiApO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIGJpbmRpbmdzICAgVGhlIGZpZWxkcyB0byBiaW5kLlxuICogQHBhcmFtIHtPYmplY3R9ICBlbGVtZW50ICAgIFRoZSBlbGVtZW50IHRvIGJpbmQgdGhlIGV2ZW50cyB0by5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWx3YXlzT3BlbiBXaGV0aGVyIHRoZSBpbnB1dCBmb3JtIHNob3VsZCBhbHdheXMgYmUgb3Blbi5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBQcmV2aWV3RXZlbnRzKCBiaW5kaW5ncywgZWxlbWVudCwgYWx3YXlzT3BlbiApIHtcblx0dGhpcy5fYmluZGluZ3MgPSBiaW5kaW5ncztcblx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0dGhpcy5fYWx3YXlzT3BlbiA9IGFsd2F5c09wZW47XG59XG5cbi8qKlxuICogQmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlZGl0VG9nZ2xlICBUaGUgZWRpdCB0b2dnbGUgZWxlbWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjbG9zZUVkaXRvciBUaGUgYnV0dG9uIHRvIGNsb3NlIHRoZSBlZGl0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiggZWRpdFRvZ2dsZSwgY2xvc2VFZGl0b3IgKSB7XG5cdGlmICggISB0aGlzLl9hbHdheXNPcGVuICkge1xuXHRcdGVkaXRUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCB0aGlzLnRvZ2dsZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0XHRjbG9zZUVkaXRvci5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIHRoaXMuY2xvc2VFZGl0b3IuYmluZCggdGhpcyApICk7XG5cdH1cblxuXHQvLyBMb29wIHRocm91Z2ggdGhlIGJpbmRpbmdzIGFuZCBiaW5kIGEgY2xpY2sgaGFuZGxlciB0byB0aGUgY2xpY2sgdG8gZm9jdXMgdGhlIGZvY3VzIGVsZW1lbnQuXG5cdGZvckVhY2goIHRoaXMuX2JpbmRpbmdzLCB0aGlzLmJpbmRJbnB1dEV2ZW50LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgZXZlbnQgZm9yIHRoZSBpbnB1dC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmluZGluZyBUaGUgZmllbGQgdG8gYmluZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuYmluZElucHV0RXZlbnQgPSBmdW5jdGlvbiggYmluZGluZyApIHtcblx0dmFyIHByZXZpZXdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggYmluZGluZy5wcmV2aWV3IClbIDAgXTtcblx0dmFyIGlucHV0RWxlbWVudCA9IHRoaXMuZWxlbWVudC5pbnB1dFsgYmluZGluZy5pbnB1dEZpZWxkIF07XG5cblx0Ly8gTWFrZSB0aGUgcHJldmlldyBlbGVtZW50IGNsaWNrIG9wZW4gdGhlIGVkaXRvciBhbmQgZm9jdXMgdGhlIGNvcnJlY3QgaW5wdXQuXG5cdHByZXZpZXdFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5vcGVuRWRpdG9yKCk7XG5cdFx0aW5wdXRFbGVtZW50LmZvY3VzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0Ly8gTWFrZSBmb2N1c2luZyBhbiBpbnB1dCwgdXBkYXRlIHRoZSBjYXJldHMuXG5cdGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImZvY3VzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRGb2N1cyA9IGJpbmRpbmcuaW5wdXRGaWVsZDtcblxuXHRcdHRoaXMuX3VwZGF0ZUZvY3VzQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0Ly8gTWFrZSByZW1vdmluZyBmb2N1cyBmcm9tIGFuIGVsZW1lbnQsIHVwZGF0ZSB0aGUgY2FyZXRzLlxuXHRpbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJibHVyXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRGb2N1cyA9IG51bGw7XG5cblx0XHR0aGlzLl91cGRhdGVGb2N1c0NhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdHByZXZpZXdFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRIb3ZlciA9IGJpbmRpbmcuaW5wdXRGaWVsZDtcblxuXHRcdHRoaXMuX3VwZGF0ZUhvdmVyQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9jdXJyZW50SG92ZXIgPSBudWxsO1xuXG5cdFx0dGhpcy5fdXBkYXRlSG92ZXJDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcbn07XG5cbi8qKlxuICogT3BlbnMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5vcGVuRWRpdG9yID0gZnVuY3Rpb24oKSB7XG5cdGlmICggdGhpcy5fYWx3YXlzT3BlbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBIaWRlIHRoZXNlIGVsZW1lbnRzLlxuXHRhZGRDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICAgIFwic25pcHBldC1lZGl0b3ItLWhpZGRlblwiICk7XG5cblx0Ly8gU2hvdyB0aGVzZSBlbGVtZW50cy5cblx0cmVtb3ZlQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmhlYWRpbmdFZGl0b3IsIFwic25pcHBldC1lZGl0b3ItLWhpZGRlblwiICk7XG5cblx0dGhpcy5vcGVuZWQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiBDbG9zZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5jbG9zZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblxuXHQvLyBTaG93IHRoZXNlIGVsZW1lbnRzLlxuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS50b2dnbGVFZGl0b3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB0aGlzLm9wZW5lZCApIHtcblx0XHR0aGlzLmNsb3NlRWRpdG9yKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5vcGVuRWRpdG9yKCk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBjYXJldHMgYmVmb3JlIHRoZSBwcmV2aWV3IGFuZCBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUZvY3VzQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBmb2N1c2VkQ2FyZXRIb29rLCBmb2N1c2VkUHJldmlldztcblxuXHQvLyBEaXNhYmxlIGFsbCBjYXJldHMgb24gdGhlIGxhYmVscy5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmNhcmV0SG9va3MsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1mb2N1c1wiICk7XG5cdH0gKTtcblxuXHQvLyBEaXNhYmxlIGFsbCBjYXJldHMgb24gdGhlIHByZXZpZXdzLlxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQucHJldmlldywgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIFwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lci0tZm9jdXNcIiApO1xuXHR9ICk7XG5cblx0aWYgKCBudWxsICE9PSB0aGlzLl9jdXJyZW50Rm9jdXMgKSB7XG5cdFx0Zm9jdXNlZENhcmV0SG9vayA9IHRoaXMuZWxlbWVudC5jYXJldEhvb2tzWyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblx0XHRmb2N1c2VkUHJldmlldyA9IHRoaXMuZWxlbWVudC5wcmV2aWV3WyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblxuXHRcdGFkZENsYXNzKCBmb2N1c2VkQ2FyZXRIb29rLCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1mb2N1c1wiICk7XG5cdFx0YWRkQ2xhc3MoIGZvY3VzZWRQcmV2aWV3LCBcInNuaXBwZXQtZWRpdG9yX19jb250YWluZXItLWZvY3VzXCIgKTtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIGhvdmVyIGNhcmV0cyBiZWZvcmUgdGhlIGlucHV0IGZpZWxkcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5fdXBkYXRlSG92ZXJDYXJldHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGhvdmVyZWRDYXJldEhvb2s7XG5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmNhcmV0SG9va3MsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1ob3ZlclwiICk7XG5cdH0gKTtcblxuXHRpZiAoIG51bGwgIT09IHRoaXMuX2N1cnJlbnRIb3ZlciApIHtcblx0XHRob3ZlcmVkQ2FyZXRIb29rID0gdGhpcy5lbGVtZW50LmNhcmV0SG9va3NbIHRoaXMuX2N1cnJlbnRIb3ZlciBdO1xuXG5cdFx0YWRkQ2xhc3MoIGhvdmVyZWRDYXJldEhvb2ssIFwic25pcHBldC1lZGl0b3JfX2NhcmV0LWhvb2stLWhvdmVyXCIgKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aWV3RXZlbnRzO1xuIiwiOyhmdW5jdGlvbigpIHtcbiAgdmFyIHVuZGVmaW5lZDtcblxuICB2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbiAgdmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbiAgdmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbiAgdmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIHZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlLUVTNSBlbnZpcm9ubWVudHMuICovXG4gIHZhciB1bmRlZmluZWQ7XG5cbiAgLyoqIFVzZWQgYXMgdGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLiAqL1xuICB2YXIgVkVSU0lPTiA9ICc0LjE3LjQnO1xuXG4gIC8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xuICB2YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuICAvKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG4gIHZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuICAvKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMuICovXG4gIHZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ10vZyxcbiAgICAgIHJlSGFzVW5lc2NhcGVkSHRtbCA9IFJlZ0V4cChyZVVuZXNjYXBlZEh0bWwuc291cmNlKTtcblxuICAvKiogVXNlZCB0byBtYXAgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLiAqL1xuICB2YXIgaHRtbEVzY2FwZXMgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnXG4gIH07XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG4gIHZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gICAqIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlPZmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVByb3BlcnR5T2Yob2JqZWN0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLmVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICB2YXIgZXNjYXBlSHRtbENoYXIgPSBiYXNlUHJvcGVydHlPZihodG1sRXNjYXBlcyk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKipcbiAgICogVXNlZCB0byByZXNvbHZlIHRoZVxuICAgKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAgICogb2YgdmFsdWVzLlxuICAgKi9cbiAgdmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG4gIHZhciBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4gIC8qKiBVc2VkIHRvIGxvb2t1cCB1bm1pbmlmaWVkIGZ1bmN0aW9uIG5hbWVzLiAqL1xuICB2YXIgcmVhbE5hbWVzID0ge307XG5cbiAgLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG4gIHZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICAgIH1cbiAgICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICAgKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gICAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICAgIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgaWYgKHVubWFza2VkKSB7XG4gICAgICBpZiAoaXNPd24pIHtcbiAgICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gICAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gICAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvU3RyaW5nKG51bGwpO1xuICAgKiAvLyA9PiAnJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKC0wKTtcbiAgICogLy8gPT4gJy0wJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+ICcxLDIsMydcbiAgICovXG4gIGZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIFwiJlwiLCBcIjxcIiwgXCI+XCIsICdcIicsIGFuZCBcIidcIiBpbiBgc3RyaW5nYCB0byB0aGVpclxuICAgKiBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqICoqTm90ZToqKiBObyBvdGhlciBjaGFyYWN0ZXJzIGFyZSBlc2NhcGVkLiBUbyBlc2NhcGUgYWRkaXRpb25hbFxuICAgKiBjaGFyYWN0ZXJzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAgICpcbiAgICogVGhvdWdoIHRoZSBcIj5cIiBjaGFyYWN0ZXIgaXMgZXNjYXBlZCBmb3Igc3ltbWV0cnksIGNoYXJhY3RlcnMgbGlrZVxuICAgKiBcIj5cIiBhbmQgXCIvXCIgZG9uJ3QgbmVlZCBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZ1xuICAgKiB1bmxlc3MgdGhleSdyZSBwYXJ0IG9mIGEgdGFnIG9yIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS4gU2VlXG4gICAqIFtNYXRoaWFzIEJ5bmVucydzIGFydGljbGVdKGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9hbWJpZ3VvdXMtYW1wZXJzYW5kcylcbiAgICogKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqXG4gICAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAgICogW3F1b3RlIGF0dHJpYnV0ZSB2YWx1ZXNdKGh0dHA6Ly93b25rby5jb20vcG9zdC9odG1sLWVzY2FwaW5nKSB0byByZWR1Y2VcbiAgICogWFNTIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gICAqIC8vID0+ICdmcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXMnXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1VuZXNjYXBlZEh0bWwudGVzdChzdHJpbmcpKVxuICAgICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgICAgOiBzdHJpbmc7XG4gIH1cblxuICB2YXIgXyA9IHsgJ2VzY2FwZSc6IGVzY2FwZSB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgdmFyIHRlbXBsYXRlcyA9IHtcbiAgICAnZmFjZWJvb2tBdXRob3InOiB7fSxcbiAgICAnZmFjZWJvb2tQcmV2aWV3Jzoge30sXG4gICAgJ2ZpZWxkcyc6IHtcbiAgICAgICAgJ2J1dHRvbic6IHt9LFxuICAgICAgICAndGV4dCc6IHt9LFxuICAgICAgICAndGV4dGFyZWEnOiB7fVxuICAgIH0sXG4gICAgJ2ltYWdlUGxhY2Vob2xkZXInOiB7fSxcbiAgICAndHdpdHRlclByZXZpZXcnOiB7fVxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmFjZWJvb2tBdXRob3InXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9vay1waXBlXCI+fDwvc3Bhbj4gJyArXG4gICAgX19lKCBhdXRob3JCeSApICtcbiAgICAnXFxuPHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19hdXRob3ItLWZhY2Vib29rXCI+JyArXG4gICAgX19lKCBhdXRob3JOYW1lICkgK1xuICAgICc8L3NwYW4+XFxuJztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWydmYWNlYm9va1ByZXZpZXcnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXcgZWRpdGFibGUtcHJldmlldy0tZmFjZWJvb2tcIj5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWljb24tZXllIGVkaXRhYmxlLXByZXZpZXdfX2hlYWRpbmcgXCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRQcmV2aWV3ICkgK1xuICAgICc8L2gzPlxcblxcblx0PHNlY3Rpb24gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19pbm5lciBlZGl0YWJsZS1wcmV2aWV3X19pbm5lci0tZmFjZWJvb2tcIj5cXG5cdFx0PGRpdiBjbGFzcz1cInNvY2lhbC1wcmV2aWV3X19pbm5lciBzb2NpYWwtcHJldmlld19faW5uZXItLWZhY2Vib29rXCI+XFxuXHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19faW1hZ2UgZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyIGVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiPlxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1mYWNlYm9vayBlZGl0YWJsZS1wcmV2aWV3X190aXRsZS0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay10aXRsZVwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQudGl0bGUgKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1mYWNlYm9vayBlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1kZXNjcmlwdGlvblwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuZGVzY3JpcHRpb24gKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1uby1jYXJldCBlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXVybFwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuYmFzZVVybCApICtcbiAgICAnXFxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stYXV0aG9yXCI+PC9zcGFuPlxcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvc2VjdGlvbj5cXG5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvciBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWVkaXQgZWRpdGFibGUtcHJldmlld19faGVhZGluZ1wiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWydidXR0b24nXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbiAgICBmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxidXR0b25cXG5cdHR5cGU9XCJidXR0b25cIlxcblx0JztcbiAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4+XFxuXHQnICtcbiAgICBfX2UoIHZhbHVlICkgK1xuICAgICdcXG48L2J1dHRvbj4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0J10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZSwgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8bGFiZWwnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnIGZvcj1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuXG4gICAgIGlmICggbGFiZWxDbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICcgY2xhc3M9XCInICtcbiAgICBfX2UoIGxhYmVsQ2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJz4nO1xuXG4gICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHRpdGxlICkgK1xuICAgICc8L2xhYmVsPic7XG4gICAgIH0gZWxzZSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdDxzcGFuIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NhcmV0LWhvb2tcIlxcblx0XHQnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdfX2NhcmV0LWhvb2tcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Pjwvc3Bhbj5cXG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiXFxuXHRcdCc7XG4gICAgIGlmICggdmFsdWUgKSB7XG4gICAgX19wICs9ICd2YWx1ZT1cIicgK1xuICAgIF9fZSggdmFsdWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggcGxhY2Vob2xkZXIgKSB7XG4gICAgX19wICs9ICdwbGFjZWhvbGRlcj1cIicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggY2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBuYW1lICkge1xuICAgIF9fcCArPSAnbmFtZT1cIicgK1xuICAgIF9fZSggbmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdC8+XFxuJztcbiAgICAgaWYgKCAhIGlkICkge1xuICAgIF9fcCArPSAnPC9sYWJlbD4nO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0YXJlYSddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIGZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGxhYmVsJztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJyBmb3I9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cblxuICAgICBpZiAoIGxhYmVsQ2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnIGNsYXNzPVwiJyArXG4gICAgX19lKCBsYWJlbENsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICc+JztcblxuICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApICtcbiAgICAnPC9sYWJlbD4nO1xuICAgICB9IGVsc2Uge1xuICAgIF9fcCArPVxuICAgIF9fZSggdGl0bGUgKTtcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHQ8c3BhbiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rXCJcXG5cdFx0JztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnX19jYXJldC1ob29rXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdD48L3NwYW4+XFxuXHQ8dGV4dGFyZWFcXG5cdFx0JztcbiAgICAgaWYgKCBwbGFjZWhvbGRlciApIHtcbiAgICBfX3AgKz0gJ3BsYWNlaG9sZGVyPVwiJyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBjbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICdjbGFzcz1cIicgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIG5hbWUgKSB7XG4gICAgX19wICs9ICduYW1lPVwiJyArXG4gICAgX19lKCBuYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Plxcblx0XHQnO1xuICAgICBpZiAodmFsdWUpIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHZhbHVlICk7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0PC90ZXh0YXJlYT5cXG4nO1xuICAgICBpZiAoICEgaWQgKSB7XG4gICAgX19wICs9ICc8L2xhYmVsPic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snaW1hZ2VQbGFjZWhvbGRlciddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVxcJycgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcXCc+JyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnPC9kaXY+JztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWyd0d2l0dGVyUHJldmlldyddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlldyBlZGl0YWJsZS1wcmV2aWV3LS10d2l0dGVyXCI+XFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWV5ZSBlZGl0YWJsZS1wcmV2aWV3X19oZWFkaW5nXCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRQcmV2aWV3ICkgK1xuICAgICc8L2gzPlxcblxcblx0PHNlY3Rpb24gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19pbm5lciBlZGl0YWJsZS1wcmV2aWV3X19pbm5lci0tdHdpdHRlclwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwic29jaWFsLXByZXZpZXdfX2lubmVyIHNvY2lhbC1wcmV2aWV3X19pbm5lci0tdHdpdHRlclwiPlxcblx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyIGVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCI+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLXR3aXR0ZXIgZWRpdGFibGUtcHJldmlld19fdGl0bGUtLXR3aXR0ZXIgc25pcHBldF9jb250YWluZXJcIiA+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci10aXRsZSBcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLnRpdGxlICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tdHdpdHRlciBlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tdHdpdHRlciB0d2l0dGVyLXByZXZpZXdfX2Rlc2NyaXB0aW9uIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci1kZXNjcmlwdGlvblwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuZGVzY3JpcHRpb24gKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1uby1jYXJldCBlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmJhc2VVcmwgKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvc2VjdGlvbj5cXG5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvciBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWVkaXQgZWRpdGFibGUtcHJldmlld19faGVhZGluZ1wiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmIChmcmVlTW9kdWxlKSB7XG4gICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcykudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICAgIGZyZWVFeHBvcnRzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxuICBlbHNlIHtcbiAgICByb290LnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cbnZhciBpc0VsZW1lbnQgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRWxlbWVudFwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2Nsb25lXCIgKTtcbnZhciBkZWZhdWx0c0RlZXAgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNEZWVwXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcblxudmFyIHJlbmRlckRlc2NyaXB0aW9uID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvcmVuZGVyRGVzY3JpcHRpb25cIiApO1xudmFyIGltYWdlUGxhY2Vob2xkZXIgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbWFnZVBsYWNlaG9sZGVyXCIgKTtcbnZhciBiZW1BZGRNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9hZGRNb2RpZmllclwiICk7XG52YXIgYmVtUmVtb3ZlTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vcmVtb3ZlTW9kaWZpZXJcIiApO1xuXG52YXIgVGV4dEZpZWxkID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0SW5wdXRcIiApO1xudmFyIFRleHRBcmVhID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0YXJlYVwiICk7XG5cbnZhciBJbnB1dEVsZW1lbnQgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbnB1dFwiICk7XG52YXIgUHJldmlld0V2ZW50cyA9IHJlcXVpcmUoIFwiLi9wcmV2aWV3L2V2ZW50c1wiICk7XG5cbnZhciB0d2l0dGVyRWRpdG9yVGVtcGxhdGUgPSByZXF1aXJlKCBcIi4vdGVtcGxhdGVzXCIgKS50d2l0dGVyUHJldmlldztcblxudmFyIHR3aXR0ZXJEZWZhdWx0cyA9IHtcblx0ZGF0YToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiLFxuXHR9LFxuXHRkZWZhdWx0VmFsdWU6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIixcblx0fSxcblx0YmFzZVVSTDogXCJleGFtcGxlLmNvbVwiLFxuXHRjYWxsYmFja3M6IHtcblx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbigpIHt9LFxuXHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRyZXR1cm4gdGl0bGU7XG5cdFx0fSxcblx0XHRtb2RpZnlEZXNjcmlwdGlvbjogZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRcdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHRcdH0sXG5cdFx0bW9kaWZ5SW1hZ2VVcmw6IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHR9LFxuXHR9LFxufTtcblxudmFyIGlucHV0VHdpdHRlclByZXZpZXdCaW5kaW5ncyA9IFtcblx0e1xuXHRcdHByZXZpZXc6IFwiZWRpdGFibGUtcHJldmlld19fdGl0bGUtLXR3aXR0ZXJcIixcblx0XHRpbnB1dEZpZWxkOiBcInRpdGxlXCIsXG5cdH0sXG5cdHtcblx0XHRwcmV2aWV3OiBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsXG5cdFx0aW5wdXRGaWVsZDogXCJpbWFnZVVybFwiLFxuXHR9LFxuXHR7XG5cdFx0cHJldmlldzogXCJlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tdHdpdHRlclwiLFxuXHRcdGlucHV0RmllbGQ6IFwiZGVzY3JpcHRpb25cIixcblx0fSxcbl07XG5cbnZhciBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMID0gMTIwO1xudmFyIFdJRFRIX1RXSVRURVJfSU1BR0VfTEFSR0UgPSA1MDY7XG52YXIgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfV0lEVEggPSAyODA7XG52YXIgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfSEVJR0hUID0gMTUwO1xuXG4vKipcbiAqIEBtb2R1bGUgc25pcHBldFByZXZpZXdcbiAqL1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbmZpZyBhbmQgb3V0cHV0VGFyZ2V0IGZvciB0aGUgU25pcHBldFByZXZpZXcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFNuaXBwZXQgcHJldmlldyBvcHRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlciAgICAgICAgICAgICAgICAgICAtIFRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgZm9yIHRoZSBmaWVsZHMsIHdpbGwgYmUgc2hvd24gYXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWwgcGxhY2Vob2xkZXJzIGluIHRoZSBpbnB1dHMgYW5kIGFzIGEgZmFsbGJhY2sgZm9yIHRoZSBwcmV2aWV3LlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci50aXRsZSAgICAgICAgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgdGl0bGUgZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uICAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBkZXNjcmlwdGlvbiBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwgICAgICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGltYWdlIHVybCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZSAgICAgICAgICAgICAgICAgIC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoZSBmaWVsZHMsIGlmIHRoZSB1c2VyIGhhcyBub3RcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkIGEgZmllbGQsIHRoaXMgdmFsdWUgd2lsbCBiZSB1c2VkIGZvciB0aGUgYW5hbHl6ZXIsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlldyBhbmQgdGhlIHByb2dyZXNzIGJhcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSAgICAgICAgICAgIC0gRGVmYXVsdCB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uICAgICAgLSBEZWZhdWx0IGRlc2NyaXB0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwgICAgICAgICAtIERlZmF1bHQgaW1hZ2UgdXJsLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuYmFzZVVSTCAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIHR3aXR0ZXIuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICBvcHRzLnRhcmdldEVsZW1lbnQgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmNhbGxiYWNrcyAgICAgICAgICAgICAgICAgICAgIC0gRnVuY3Rpb25zIHRoYXQgYXJlIGNhbGxlZCBvbiBzcGVjaWZpYyBpbnN0YW5jZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBvcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3IC0gRnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHNvY2lhbCBwcmV2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBpMThuIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50ICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGVsZW1lbnRzIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5yZW5kZXJlZCAgICAgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQudGl0bGUgICAgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdGl0bGUgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuaW1hZ2VVcmwgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdXJsIHBhdGggZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24gICAgICAgLSBUaGUgcmVuZGVyZWQgdHdpdHRlciBkZXNjcmlwdGlvbiBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQuaW5wdXQgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgaW5wdXQgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LnRpdGxlICAgICAgICAgICAgICAgIC0gVGhlIHRpdGxlIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmltYWdlVXJsICAgICAgICAgICAgIC0gVGhlIHVybCBwYXRoIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uICAgICAgICAgIC0gVGhlIG1ldGEgZGVzY3JpcHRpb24gaW5wdXQgZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmNvbnRhaW5lciAgICAgICAgICAgICAgICAgIC0gVGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmZvcm1Db250YWluZXIgICAgICAgICAgICAgIC0gVGhlIGZvcm0gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmVkaXRUb2dnbGUgICAgICAgICAgICAgICAgIC0gVGhlIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIGVkaXRvciBmb3JtLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgZGF0YSBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEudGl0bGUgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdGl0bGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmltYWdlVXJsICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHVybCBwYXRoLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5kZXNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGJhc2VVUkwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIGdvb2dsZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFR3aXR0ZXJQcmV2aWV3ID0gZnVuY3Rpb24oIG9wdHMsIGkxOG4gKSB7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cblx0dHdpdHRlckRlZmF1bHRzLnBsYWNlaG9sZGVyID0ge1xuXHRcdHRpdGxlOiB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhpcyBpcyBhbiBleGFtcGxlIHRpdGxlIC0gZWRpdCBieSBjbGlja2luZyBoZXJlXCIgKSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiTW9kaWZ5IHlvdXIgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIGl0IHJpZ2h0IGhlcmVcIiApLFxuXHRcdFx0XCJUd2l0dGVyXCJcblx0XHQpLFxuXHRcdGltYWdlVXJsOiBcIlwiLFxuXHR9O1xuXG5cdGRlZmF1bHRzRGVlcCggb3B0cywgdHdpdHRlckRlZmF1bHRzICk7XG5cblx0aWYgKCAhIGlzRWxlbWVudCggb3B0cy50YXJnZXRFbGVtZW50ICkgKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcIlRoZSBUd2l0dGVyIHByZXZpZXcgcmVxdWlyZXMgYSB2YWxpZCB0YXJnZXQgZWxlbWVudFwiICk7XG5cdH1cblxuXHR0aGlzLmRhdGEgPSBvcHRzLmRhdGE7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cdHRoaXMub3B0cyA9IG9wdHM7XG5cblx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgaTE4biBvYmplY3QgYmFzZWQgb24gcGFzc2VkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyAtIFRoZSB2YWx1ZXMgdG8gdHJhbnNsYXRlLlxuICpcbiAqIEByZXR1cm5zIHtKZWR9IC0gVGhlIEplZCB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0ZG9tYWluOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdC8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuXHRcdGxvY2FsZV9kYXRhOiB7XG5cdFx0LyogZXNsaW50LWVuYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge30sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbmRlclRlbXBsYXRlKCk7XG5cdHRoaXMuYmluZEV2ZW50cygpO1xuXHR0aGlzLnVwZGF0ZVByZXZpZXcoKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyBzbmlwcGV0IGVkaXRvciBhbmQgYWRkcyBpdCB0byB0aGUgdGFyZ2V0RWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0dGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSB0d2l0dGVyRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkwsXG5cdFx0fSxcblx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLFxuXHRcdGkxOG46IHtcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdGVkaXQ6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiRWRpdCAlMSRzIHByZXZpZXdcIiApLCBcIlR3aXR0ZXJcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0c25pcHBldFByZXZpZXc6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBwcmV2aWV3XCIgKSwgXCJUd2l0dGVyXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdHNuaXBwZXRFZGl0b3I6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBlZGl0b3JcIiApLCBcIlR3aXR0ZXJcIiApLFxuXHRcdH0sXG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItdGl0bGVcIiApWyAwIF0sXG5cdFx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS10d2l0dGVyLWRlc2NyaXB0aW9uXCIgKVsgMCBdLFxuXHRcdH0sXG5cdFx0ZmllbGRzOiB0aGlzLmdldEZpZWxkcygpLFxuXHRcdGNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXctLXR3aXR0ZXJcIiApWyAwIF0sXG5cdFx0Zm9ybUNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKVsgMCBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWyAwIF0sXG5cdFx0Y2xvc2VFZGl0b3I6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fc3VibWl0XCIgKVsgMCBdLFxuXHRcdGZvcm1GaWVsZHM6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybS1maWVsZFwiICksXG5cdFx0aGVhZGluZ0VkaXRvcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvclwiIClbIDAgXSxcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuZmllbGRzLmltYWdlVXJsLnJlbmRlcigpICtcblx0XHR0aGlzLmVsZW1lbnQuZmllbGRzLnRpdGxlLnJlbmRlcigpICtcblx0XHR0aGlzLmVsZW1lbnQuZmllbGRzLmRlc2NyaXB0aW9uLnJlbmRlcigpO1xuXG5cdHRoaXMuZWxlbWVudC5pbnB1dCA9IHtcblx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVsgMCBdLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWyAwIF0sXG5cdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbIDAgXSxcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cyA9IHRoaXMuZ2V0RmllbGRFbGVtZW50cygpO1xuXHR0aGlzLmVsZW1lbnQuY2xvc2VFZGl0b3IgPSB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX3N1Ym1pdFwiIClbIDAgXTtcblxuXHR0aGlzLmVsZW1lbnQuY2FyZXRIb29rcyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LmlucHV0LnRpdGxlLnByZXZpb3VzU2libGluZyxcblx0XHRpbWFnZVVybDogdGhpcy5lbGVtZW50LmlucHV0LmltYWdlVXJsLnByZXZpb3VzU2libGluZyxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uLnByZXZpb3VzU2libGluZyxcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQucHJldmlldyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiIClbIDAgXSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLnBhcmVudE5vZGUsXG5cdH07XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX3RpdGxlIGpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci10aXRsZVwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIudGl0bGUsXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgdGl0bGVcIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiLFxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSxcblx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdCksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIixcblx0XHR9ICksXG5cdFx0aW1hZ2VVcmw6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2ltYWdlVXJsIGpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgaW1hZ2VcIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiLFxuXHRcdH0gKSxcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnQuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRGaWVsZEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0cmV0dXJuIHtcblx0XHR0aXRsZTogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiIClbIDAgXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIHRpdGxlIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0XHQpLFxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpLFxuXHRcdCBkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdCB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWyAwIF0sXG5cdFx0XHQge1xuXHRcdFx0XHQgY3VycmVudFZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHQgZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdCAvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdFx0IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdCBcIlR3aXR0ZXJcIlxuXHRcdFx0XHQgKSxcblx0XHRcdCB9LFxuXHRcdFx0IHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQgKSxcblx0XHRpbWFnZVVybDogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbIDAgXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCxcblx0XHRcdFx0ZmFsbGJhY2s6IFwiXCIsXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdH07XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHR3aXR0ZXIgcHJldmlldy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnVwZGF0ZVByZXZpZXcgPSBmdW5jdGlvbigpIHtcbi8vIFVwZGF0ZSB0aGUgZGF0YS5cblx0dGhpcy5kYXRhLnRpdGxlID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5pbWFnZVVybCA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmltYWdlVXJsLmdldElucHV0VmFsdWUoKTtcblxuXHQvLyBTZXRzIHRoZSB0aXRsZSBmaWVsZFxuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cblx0Ly8gU2V0IHRoZSBkZXNjcmlwdGlvbiBmaWVsZCBhbmQgcGFyc2UgdGhlIHN0eWxpbmcgb2YgaXQuXG5cdHRoaXMuc2V0RGVzY3JpcHRpb24oIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXRzIHRoZSBJbWFnZSBVUkxcblx0dGhpcy5zZXRJbWFnZSggdGhpcy5kYXRhLmltYWdlVXJsICk7XG5cblx0Ly8gQ2xvbmUgc28gdGhlIGRhdGEgaXNuJ3QgY2hhbmdlYWJsZS5cblx0dGhpcy5vcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3KCBjbG9uZSggdGhpcy5kYXRhICkgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyB0aXRsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgVGhlIG5ldyB0aXRsZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFRpdGxlID0gZnVuY3Rpb24oIHRpdGxlICkge1xuXHR0aXRsZSA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5VGl0bGUoIHRpdGxlICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHByZXZpZXcgZGVzY3JpcHRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBkZXNjcmlwdGlvbiB0byBzZXQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKCBkZXNjcmlwdGlvbiApIHtcblx0ZGVzY3JpcHRpb24gPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeURlc2NyaXB0aW9uKCBkZXNjcmlwdGlvbiApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBkZXNjcmlwdGlvbjtcblx0cmVuZGVyRGVzY3JpcHRpb24oIHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbiwgdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0SW5wdXRWYWx1ZSgpICk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGltYWdlIGNvbnRhaW5lci5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29udGFpbmVyIHRoYXQgd2lsbCBob2xkIHRoZSBpbWFnZS5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldEltYWdlQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmVsZW1lbnQucHJldmlldy5pbWFnZVVybDtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgaW1hZ2Ugb2JqZWN0IHdpdGggdGhlIG5ldyBVUkwuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsIFRoZSBpbWFnZSBwYXRoLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0SW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdGltYWdlVXJsID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlJbWFnZVVybCggaW1hZ2VVcmwgKTtcblxuXHRpZiAoIGltYWdlVXJsID09PSBcIlwiICYmIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG5cdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMuaXNUb29TbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0XHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXHRcdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTaXppbmdDbGFzcyggaW1nICk7XG5cdFx0dGhpcy5hZGRJbWFnZVRvQ29udGFpbmVyKCBpbWFnZVVybCApO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHRpbWcub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblx0XHR0aGlzLnNldFBsYWNlSG9sZGVyKCk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdC8vIExvYWQgaW1hZ2UgdG8gdHJpZ2dlciBsb2FkIG9yIGVycm9yIGV2ZW50LlxuXHRpbWcuc3JjID0gaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGltYWdlIG9mIHRoZSBpbWFnZSBjb250YWluZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGFpbmVyID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBpbWFnZSArIFwiKVwiO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250YWluZXIuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVJbWFnZUZyb21Db250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJcIjtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJvcGVyIENTUyBjbGFzcyBmb3IgdGhlIGN1cnJlbnQgaW1hZ2UuXG4gKlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSB0byBiYXNlIHRoZSBzaXppbmcgY2xhc3Mgb24uXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRTaXppbmdDbGFzcyA9IGZ1bmN0aW9uKCBpbWcgKSB7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoLlxuICpcbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2Ugb2JqZWN0IHRvIHVzZS5cbiAqXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgY2FsY3VsYXRlZCBtYXggd2lkdGguXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEw7XG5cdH1cblxuXHRyZXR1cm4gV0lEVEhfVFdJVFRFUl9JTUFHRV9MQVJHRTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgZGVmYXVsdCB0d2l0dGVyIHBsYWNlaG9sZGVyLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0UGxhY2VIb2xkZXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmwsXG5cdFx0XCJcIixcblx0XHRmYWxzZSxcblx0XHRcInR3aXR0ZXJcIlxuXHQpO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSB0d2l0dGVyIHByZXZpZXcgc2hvdWxkIHN3aXRjaCB0byBzbWFsbCBpbWFnZSBtb2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyBzbWFsbC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmlzU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX1dJRFRIIHx8XG5cdFx0aW1hZ2UuaGVpZ2h0IDwgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIHR3aXR0ZXIgcHJldmlldyBpbWFnZSBpcyB0b28gc21hbGwuXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmlzVG9vU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEwgfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIGZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBmYWNlYm9vayBpbWFnZSBwcmV2aWV3LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVTbWFsbEltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBmYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgbGFyZ2UgZmFjZWJvb2sgaW1hZ2UgcHJldmlldy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldExhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwgaW1hZ2UgY2xhc3Nlcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cdHRoaXMucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMoKTtcbn07XG5cbi8qKlxuICogQmluZHMgdGhlIHJlbG9hZFNuaXBwZXRUZXh0IGZ1bmN0aW9uIHRvIHRoZSBibHVyIG9mIHRoZSBzbmlwcGV0IGlucHV0cy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHByZXZpZXdFdmVudHMgPSBuZXcgUHJldmlld0V2ZW50cyggaW5wdXRUd2l0dGVyUHJldmlld0JpbmRpbmdzLCB0aGlzLmVsZW1lbnQsIHRydWUgKTtcblx0cHJldmlld0V2ZW50cy5iaW5kRXZlbnRzKCB0aGlzLmVsZW1lbnQuZWRpdFRvZ2dsZSwgdGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFR3aXR0ZXJQcmV2aWV3O1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUVhY2gnKSxcbiAgICBjcmVhdGVGb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRm9yRWFjaCcpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGludm9raW5nIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBgaXRlcmF0ZWVgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseVxuICogYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIiBwcm9wZXJ0eVxuICogYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIGBfLmZvckluYCBvciBgXy5mb3JPd25gXG4gKiBtYXkgYmUgdXNlZCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGl0ZXJhdGVlYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXyhbMSwgMl0pLmZvckVhY2goZnVuY3Rpb24obikge1xuICogICBjb25zb2xlLmxvZyhuKTtcbiAqIH0pLnZhbHVlKCk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUgZnJvbSBsZWZ0IHRvIHJpZ2h0IGFuZCByZXR1cm5zIHRoZSBhcnJheVxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKG4sIGtleSkge1xuICogICBjb25zb2xlLmxvZyhuLCBrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUta2V5IHBhaXIgYW5kIHJldHVybnMgdGhlIG9iamVjdCAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG52YXIgZm9yRWFjaCA9IGNyZWF0ZUZvckVhY2goYXJyYXlFYWNoLCBiYXNlRWFjaCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBnZXROYXRpdmUoRGF0ZSwgJ25vdycpO1xuXG4vKipcbiAqIEdldHMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAqICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IGxvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGZ1bmN0aW9uIHRvIGJlIGludm9rZWRcbiAqL1xudmFyIG5vdyA9IG5hdGl2ZU5vdyB8fCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi4vZGF0ZS9ub3cnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgaW52b2NhdGlvbnMuIFByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QgdG8gaW5kaWNhdGUgdGhhdCBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdFxuICogYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpcyBpbnZva2VkXG4gKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzXG4gKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHA6Ly9kcnVwYWxtb3Rpb24uY29tL2FydGljbGUvZGVib3VuY2UtYW5kLXRocm90dGxlLXZpc3VhbC1leHBsYW5hdGlvbilcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZ1xuICogIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF0gVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZVxuICogIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmdcbiAqICBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4XG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIGludm9rZSBgc2VuZE1haWxgIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHNcbiAqIGpRdWVyeSgnI3Bvc3Rib3gnKS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHNcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gKiAgICdtYXhXYWl0JzogMTAwMFxuICogfSkpO1xuICpcbiAqIC8vIGNhbmNlbCBhIGRlYm91bmNlZCBjYWxsXG4gKiB2YXIgdG9kb0NoYW5nZXMgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAxMDAwKTtcbiAqIE9iamVjdC5vYnNlcnZlKG1vZGVscy50b2RvLCB0b2RvQ2hhbmdlcyk7XG4gKlxuICogT2JqZWN0Lm9ic2VydmUobW9kZWxzLCBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gKiAgIGlmIChfLmZpbmQoY2hhbmdlcywgeyAndXNlcic6ICd0b2RvJywgJ3R5cGUnOiAnZGVsZXRlJ30pKSB7XG4gKiAgICAgdG9kb0NoYW5nZXMuY2FuY2VsKCk7XG4gKiAgIH1cbiAqIH0sIFsnZGVsZXRlJ10pO1xuICpcbiAqIC8vIC4uLmF0IHNvbWUgcG9pbnQgYG1vZGVscy50b2RvYCBpcyBjaGFuZ2VkXG4gKiBtb2RlbHMudG9kby5jb21wbGV0ZWQgPSB0cnVlO1xuICpcbiAqIC8vIC4uLmJlZm9yZSAxIHNlY29uZCBoYXMgcGFzc2VkIGBtb2RlbHMudG9kb2AgaXMgZGVsZXRlZFxuICogLy8gd2hpY2ggY2FuY2VscyB0aGUgZGVib3VuY2VkIGB0b2RvQ2hhbmdlc2AgY2FsbFxuICogZGVsZXRlIG1vZGVscy50b2RvO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBhcmdzLFxuICAgICAgbWF4VGltZW91dElkLFxuICAgICAgcmVzdWx0LFxuICAgICAgc3RhbXAsXG4gICAgICB0aGlzQXJnLFxuICAgICAgdGltZW91dElkLFxuICAgICAgdHJhaWxpbmdDYWxsLFxuICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICBtYXhXYWl0ID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHdhaXQgPCAwID8gMCA6ICgrd2FpdCB8fCAwKTtcbiAgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgdHJhaWxpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhXYWl0ID0gJ21heFdhaXQnIGluIG9wdGlvbnMgJiYgbmF0aXZlTWF4KCtvcHRpb25zLm1heFdhaXQgfHwgMCwgd2FpdCk7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGxhc3RDYWxsZWQgPSAwO1xuICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBsZXRlKGlzQ2FsbGVkLCBpZCkge1xuICAgIGlmIChpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9XG4gICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsYXllZCgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3coKSAtIHN0YW1wKTtcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgY29tcGxldGUodHJhaWxpbmdDYWxsLCBtYXhUaW1lb3V0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF4RGVsYXllZCgpIHtcbiAgICBjb21wbGV0ZSh0cmFpbGluZywgdGltZW91dElkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHN0YW1wID0gbm93KCk7XG4gICAgdGhpc0FyZyA9IHRoaXM7XG4gICAgdHJhaWxpbmdDYWxsID0gdHJhaWxpbmcgJiYgKHRpbWVvdXRJZCB8fCAhbGVhZGluZyk7XG5cbiAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgIHZhciBsZWFkaW5nQ2FsbCA9IGxlYWRpbmcgJiYgIXRpbWVvdXRJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgfVxuICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICBpc0NhbGxlZCA9IHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IG1heFdhaXQ7XG5cbiAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBtYXhUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KG1heERlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiB0aW1lb3V0SWQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGltZW91dElkICYmIHdhaXQgIT09IG1heFdhaXQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgfVxuICAgIGlmIChsZWFkaW5nQ2FsbCkge1xuICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlDb3B5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5Q29weTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbkRlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogb2JqZWN0VmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduRGVmYXVsdHM7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbldpdGg7XG4iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuL2Jhc2VDb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9hcnJheUVhY2gnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9iYXNlQXNzaWduJyksXG4gICAgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vYmFzZUZvck93bicpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vaW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9XG5jbG9uZWFibGVUYWdzW2RhdGVUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MzJUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW21hcFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZ1xuICogYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcgdmFsdWVzLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IGB2YWx1ZWAgYmVsb25ncyB0by5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIGNsb25lcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QpIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnO1xuXG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gaW5pdENsb25lT2JqZWN0KGlzRnVuYyA/IHt9IDogdmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbG9uZWFibGVUYWdzW3RhZ11cbiAgICAgICAgPyBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBpc0RlZXApXG4gICAgICAgIDogKG9iamVjdCA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG5cbiAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgIH1cbiAgfVxuICAvLyBBZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMgYW5kIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyBjbG9uZS5cbiAgc3RhY2tBLnB1c2godmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gIChpc0FyciA/IGFycmF5RWFjaCA6IGJhc2VGb3JPd24pKHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2tBLCBzdGFja0IpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCIvKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb3B5KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvckluYCBhbmQgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzXG4gKiBvdmVyIGBvYmplY3RgIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvclxuICogZWFjaCBwcm9wZXJ0eS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5XG4gKiByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckluYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9ySW4ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JJbjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL2FycmF5RWFjaCcpLFxuICAgIGJhc2VNZXJnZURlZXAgPSByZXF1aXJlKCcuL2Jhc2VNZXJnZURlZXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgdmFsdWVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICB2YXIgaXNTcmNBcnIgPSBpc0FycmF5TGlrZShzb3VyY2UpICYmIChpc0FycmF5KHNvdXJjZSkgfHwgaXNUeXBlZEFycmF5KHNvdXJjZSkpLFxuICAgICAgcHJvcHMgPSBpc1NyY0FyciA/IHVuZGVmaW5lZCA6IGtleXMoc291cmNlKTtcblxuICBhcnJheUVhY2gocHJvcHMgfHwgc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzcmNWYWx1ZTtcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc09iamVjdExpa2Uoc3JjVmFsdWUpKSB7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgICByZXN1bHQgPSBjdXN0b21pemVyID8gY3VzdG9taXplcih2YWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChpc0NvbW1vbikge1xuICAgICAgICByZXN1bHQgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICgocmVzdWx0ICE9PSB1bmRlZmluZWQgfHwgKGlzU3JjQXJyICYmICEoa2V5IGluIG9iamVjdCkpKSAmJlxuICAgICAgICAgIChpc0NvbW1vbiB8fCAocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzUGxhaW5PYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIHRvUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL3RvUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoLFxuICAgICAgc3JjVmFsdWUgPSBzb3VyY2Vba2V5XTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gc3JjVmFsdWUpIHtcbiAgICAgIG9iamVjdFtrZXldID0gc3RhY2tCW2xlbmd0aF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIodmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgcmVzdWx0ID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKHNyY1ZhbHVlKSAmJiAoaXNBcnJheShzcmNWYWx1ZSkgfHwgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkpIHtcbiAgICAgIHJlc3VsdCA9IGlzQXJyYXkodmFsdWUpXG4gICAgICAgID8gdmFsdWVcbiAgICAgICAgOiAoaXNBcnJheUxpa2UodmFsdWUpID8gYXJyYXlDb3B5KHZhbHVlKSA6IFtdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICByZXN1bHQgPSBpc0FyZ3VtZW50cyh2YWx1ZSlcbiAgICAgICAgPyB0b1BsYWluT2JqZWN0KHZhbHVlKVxuICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFkZCB0aGUgc291cmNlIHZhbHVlIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgYXNzb2NpYXRlXG4gIC8vIGl0IHdpdGggaXRzIG1lcmdlZCB2YWx1ZS5cbiAgc3RhY2tBLnB1c2goc3JjVmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIG9iamVjdFtrZXldID0gbWVyZ2VGdW5jKHJlc3VsdCwgc3JjVmFsdWUsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB7XG4gICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2VEZWVwO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuIiwiLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBBcnJheUJ1ZmZlciA9IGdsb2JhbC5BcnJheUJ1ZmZlcixcbiAgICBVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBnaXZlbiBhcnJheSBidWZmZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIuYnl0ZUxlbmd0aCksXG4gICAgICB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkocmVzdWx0KTtcblxuICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidWZmZXJDbG9uZTtcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5hc3NpZ25gLCBgXy5kZWZhdWx0c2AsIG9yIGBfLm1lcmdlYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3RQYXJhbShmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAyID8gc291cmNlc1tsZW5ndGggLSAyXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGhpc0FyZyA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBiaW5kQ2FsbGJhY2soY3VzdG9taXplciwgdGhpc0FyZywgNSk7XG4gICAgICBsZW5ndGggLT0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VzdG9taXplciA9IHR5cGVvZiB0aGlzQXJnID09ICdmdW5jdGlvbicgPyB0aGlzQXJnIDogdW5kZWZpbmVkO1xuICAgICAgbGVuZ3RoIC09IChjdXN0b21pemVyID8gMSA6IDApO1xuICAgIH1cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGdldExlbmd0aChjb2xsZWN0aW9uKSA6IDA7XG4gICAgaWYgKCFpc0xlbmd0aChsZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSB0b09iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCJ2YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIGBfLmZvckluYCBvciBgXy5mb3JJblJpZ2h0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaXRlcmFibGUgPSB0b09iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5kZWZhdWx0c2Agb3IgYF8uZGVmYXVsdHNEZWVwYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVmYXVsdHMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRzKGFzc2lnbmVyLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBvYmplY3QgPSBhcmdzWzBdO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgYXJncy5wdXNoKGN1c3RvbWl6ZXIpO1xuICAgIHJldHVybiBhc3NpZ25lci5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWZhdWx0cztcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gZm9yIGBfLmZvckVhY2hgIG9yIGBfLmZvckVhY2hSaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFycmF5RnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGFuIGFycmF5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBlYWNoIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGb3JFYWNoKGFycmF5RnVuYywgZWFjaEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgaXRlcmF0ZWUgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnID09PSB1bmRlZmluZWQgJiYgaXNBcnJheShjb2xsZWN0aW9uKSlcbiAgICAgID8gYXJyYXlGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKVxuICAgICAgOiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBiaW5kQ2FsbGJhY2soaXRlcmF0ZWUsIHRoaXNBcmcsIDMpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGb3JFYWNoO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGVuZ3RoO1xuIiwidmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnLi4vbGFuZy9pc05hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsIi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIGFycmF5IHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGJ1ZmZlckNsb25lID0gcmVxdWlyZSgnLi9idWZmZXJDbG9uZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBidWZmZXJDbG9uZShvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgdmFyIGJ1ZmZlciA9IG9iamVjdC5idWZmZXI7XG4gICAgICByZXR1cm4gbmV3IEN0b3IoaXNEZWVwID8gYnVmZmVyQ2xvbmUoYnVmZmVyKSA6IGJ1ZmZlciwgb2JqZWN0LmJ5dGVPZmZzZXQsIG9iamVjdC5sZW5ndGgpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yKG9iamVjdC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhvYmplY3QpKTtcbiAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSBvYmplY3QubGFzdEluZGV4O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCIvKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICghKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSB7XG4gICAgQ3RvciA9IE9iamVjdDtcbiAgfVxuICByZXR1cm4gbmV3IEN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuLi9vYmplY3QvbWVyZ2UnKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzRGVlcGAgdG8gY3VzdG9taXplIGl0cyBgXy5tZXJnZWAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9iamVjdFZhbHVlIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNvdXJjZVZhbHVlIFRoZSBzb3VyY2Ugb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBtZXJnZURlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogbWVyZ2Uob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBtZXJnZURlZmF1bHRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZURlZmF1bHRzO1xuIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaW1LZXlzO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b09iamVjdDtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlQ2xvbmUnKSxcbiAgICBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB2YWx1ZWAuIElmIGBpc0RlZXBgIGlzIGB0cnVlYCBuZXN0ZWQgb2JqZWN0cyBhcmUgY2xvbmVkLFxuICogb3RoZXJ3aXNlIHRoZXkgYXJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3NcbiAqIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGBcbiAqIGNsb25pbmcgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG9cbiAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHVwIHRvIHRocmVlIGFyZ3VtZW50OyAodmFsdWUgWywgaW5kZXh8a2V5LCBvYmplY3RdKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNpbnRlcm5hbC1zdHJ1Y3R1cmVkLWNsb25pbmctYWxnb3JpdGhtKS5cbiAqIFRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhbmQgb2JqZWN0cyBjcmVhdGVkIGJ5XG4gKiBjb25zdHJ1Y3RvcnMgb3RoZXIgdGhhbiBgT2JqZWN0YCBhcmUgY2xvbmVkIHRvIHBsYWluIGBPYmplY3RgIG9iamVjdHMuIEFuXG4gKiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoIGFzIGZ1bmN0aW9ucywgRE9NIG5vZGVzLFxuICogTWFwcywgU2V0cywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZSh1c2Vycyk7XG4gKiBzaGFsbG93WzBdID09PSB1c2Vyc1swXTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmUodXNlcnMsIHRydWUpO1xuICogZGVlcFswXSA9PT0gdXNlcnNbMF07XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGVsID0gXy5jbG9uZShkb2N1bWVudC5ib2R5LCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZShmYWxzZSk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIGVsID09PSBkb2N1bWVudC5ib2R5XG4gKiAvLyA9PiBmYWxzZVxuICogZWwubm9kZU5hbWVcbiAqIC8vID0+IEJPRFlcbiAqIGVsLmNoaWxkTm9kZXMubGVuZ3RoO1xuICogLy8gPT4gMFxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCB0aGlzQXJnKSB7XG4gIGlmIChpc0RlZXAgJiYgdHlwZW9mIGlzRGVlcCAhPSAnYm9vbGVhbicgJiYgaXNJdGVyYXRlZUNhbGwodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplcikpIHtcbiAgICBpc0RlZXAgPSBmYWxzZTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaXNEZWVwID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzQXJnID0gY3VzdG9taXplcjtcbiAgICBjdXN0b21pemVyID0gaXNEZWVwO1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nXG4gICAgPyBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDMpKVxuICAgIDogYmFzZUNsb25lKHZhbHVlLCBpc0RlZXApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VsZW1lbnQoZG9jdW1lbnQuYm9keSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VsZW1lbnQoJzxib2R5PicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHZhbHVlLm5vZGVUeXBlID09PSAxICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzUGxhaW5PYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudDtcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBlbXB0eS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGVtcHR5IHVubGVzcyBpdCdzIGFuXG4gKiBgYXJndW1lbnRzYCBvYmplY3QsIGFycmF5LCBzdHJpbmcsIG9yIGpRdWVyeS1saWtlIGNvbGxlY3Rpb24gd2l0aCBhIGxlbmd0aFxuICogZ3JlYXRlciB0aGFuIGAwYCBvciBhbiBvYmplY3Qgd2l0aCBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gIWtleXModmFsdWUpLmxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZywgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsInZhciBiYXNlRm9ySW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlRm9ySW4nKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGFzc3VtZXMgb2JqZWN0cyBjcmVhdGVkIGJ5IHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3RvclxuICogaGF2ZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHZhciBDdG9yO1xuXG4gIC8vIEV4aXQgZWFybHkgZm9yIG5vbiBgT2JqZWN0YCBvYmplY3RzLlxuICBpZiAoIShpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IG9iamVjdFRhZyAmJiAhaXNBcmd1bWVudHModmFsdWUpKSB8fFxuICAgICAgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY29uc3RydWN0b3InKSAmJiAoQ3RvciA9IHZhbHVlLmNvbnN0cnVjdG9yLCB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmICEoQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gSUUgPCA5IGl0ZXJhdGVzIGluaGVyaXRlZCBwcm9wZXJ0aWVzIGJlZm9yZSBvd24gcHJvcGVydGllcy4gSWYgdGhlIGZpcnN0XG4gIC8vIGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWRcbiAgLy8gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICB2YXIgcmVzdWx0O1xuICAvLyBJbiBtb3N0IGVudmlyb25tZW50cyBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcyBhcmUgaXRlcmF0ZWQgYmVmb3JlXG4gIC8vIGl0cyBpbmhlcml0ZWQgcHJvcGVydGllcy4gSWYgdGhlIGxhc3QgaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3NcbiAgLy8gb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gIGJhc2VGb3JJbih2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIHJlc3VsdCA9IGtleTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCByZXN1bHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCJ2YXIgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9XG50eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9IHR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlQ29weSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VDb3B5JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZVxuICogcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNvcHkodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYXNzaWduV2l0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Fzc2lnbldpdGgnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUFzc2lnbicpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlQXNzaWduZXInKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICogSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzOlxuICogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyksXG4gICAgYXNzaWduRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25EZWZhdWx0cycpLFxuICAgIGNyZWF0ZURlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMnKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdCBmb3IgYWxsIGRlc3RpbmF0aW9uIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgLiBPbmNlIGFcbiAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGRlZmF1bHRzID0gY3JlYXRlRGVmYXVsdHMoYXNzaWduLCBhc3NpZ25EZWZhdWx0cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCJ2YXIgY3JlYXRlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cycpLFxuICAgIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpLFxuICAgIG1lcmdlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9tZXJnZURlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5kZWZhdWx0c2AgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgYXNzaWduc1xuICogZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHNEZWVwKHsgJ3VzZXInOiB7ICduYW1lJzogJ2Jhcm5leScgfSB9LCB7ICd1c2VyJzogeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDM2IH0gfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSB9XG4gKlxuICovXG52YXIgZGVmYXVsdHNEZWVwID0gY3JlYXRlRGVmYXVsdHMobWVyZ2UsIG1lcmdlRGVmYXVsdHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzRGVlcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICBsZW5ndGggPSAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAqIGRvbid0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgaW50byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAqIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLiBJZiBgY3VzdG9taXplcmAgaXNcbiAqIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvbiBhbmRcbiAqIHNvdXJjZSBwcm9wZXJ0aWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCBtZXJnaW5nIGlzIGhhbmRsZWRcbiAqIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAqIHdpdGggZml2ZSBhcmd1bWVudHM6IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSB7XG4gKiAgICdkYXRhJzogW3sgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICd1c2VyJzogJ2ZyZWQnIH1dXG4gKiB9O1xuICpcbiAqIHZhciBhZ2VzID0ge1xuICogICAnZGF0YSc6IFt7ICdhZ2UnOiAzNiB9LCB7ICdhZ2UnOiA0MCB9XVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKHVzZXJzLCBhZ2VzKTtcbiAqIC8vID0+IHsgJ2RhdGEnOiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dIH1cbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gKiAgICd2ZWdldGFibGVzJzogWydiZWV0J11cbiAqIH07XG4gKlxuICogdmFyIG90aGVyID0ge1xuICogICAnZnJ1aXRzJzogWydiYW5hbmEnXSxcbiAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2NhcnJvdCddXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlciwgZnVuY3Rpb24oYSwgYikge1xuICogICBpZiAoXy5pc0FycmF5KGEpKSB7XG4gKiAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICogICB9XG4gKiB9KTtcbiAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdCddIH1cbiAqL1xudmFyIG1lcmdlID0gY3JlYXRlQXNzaWduZXIoYmFzZU1lcmdlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgYmxvY2tFbGVtZW50cyA9IFtcImFkZHJlc3NcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJibG9ja3F1b3RlXCIsIFwiY2FudmFzXCIsIFwiZGRcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLCBcImZpZ3VyZVwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImxpXCIsIFwibWFpblwiLCBcIm5hdlwiLCBcIm5vc2NyaXB0XCIsIFwib2xcIiwgXCJvdXRwdXRcIiwgXCJwXCIsIFwicHJlXCIsIFwic2VjdGlvblwiLCBcInRhYmxlXCIsIFwidGZvb3RcIiwgXCJ1bFwiLCBcInZpZGVvXCJdO1xudmFyIGlubGluZUVsZW1lbnRzID0gW1wiYlwiLCBcImJpZ1wiLCBcImlcIiwgXCJzbWFsbFwiLCBcInR0XCIsIFwiYWJiclwiLCBcImFjcm9ueW1cIiwgXCJjaXRlXCIsIFwiY29kZVwiLCBcImRmblwiLCBcImVtXCIsIFwia2JkXCIsIFwic3Ryb25nXCIsIFwic2FtcFwiLCBcInRpbWVcIiwgXCJ2YXJcIiwgXCJhXCIsIFwiYmRvXCIsIFwiYnJcIiwgXCJpbWdcIiwgXCJtYXBcIiwgXCJvYmplY3RcIiwgXCJxXCIsIFwic2NyaXB0XCIsIFwic3BhblwiLCBcInN1YlwiLCBcInN1cFwiLCBcImJ1dHRvblwiLCBcImlucHV0XCIsIFwibGFiZWxcIiwgXCJzZWxlY3RcIiwgXCJ0ZXh0YXJlYVwiXTtcbnZhciBibG9ja0VsZW1lbnRzUmVnZXggPSBuZXcgUmVnRXhwKFwiXihcIiArIGJsb2NrRWxlbWVudHMuam9pbihcInxcIikgKyBcIikkXCIsIFwiaVwiKTtcbnZhciBpbmxpbmVFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cChcIl4oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKFwifFwiKSArIFwiKSRcIiwgXCJpXCIpO1xudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKFwiXjwoXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oXCJ8XCIpICsgXCIpW14+XSo/PiRcIiwgXCJpXCIpO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cChcIl48LyhcIiArIGJsb2NrRWxlbWVudHMuam9pbihcInxcIikgKyBcIilbXj5dKj8+JFwiLCBcImlcIik7XG52YXIgaW5saW5lRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKFwiXjwoXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKFwifFwiKSArIFwiKVtePl0qPiRcIiwgXCJpXCIpO1xudmFyIGlubGluZUVsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoXCJePC8oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKFwifFwiKSArIFwiKVtePl0qPiRcIiwgXCJpXCIpO1xudmFyIG90aGVyRWxlbWVudFN0YXJ0UmVnZXggPSAvXjwoW14+XFxzXFwvXSspW14+XSo+JC87XG52YXIgb3RoZXJFbGVtZW50RW5kUmVnZXggPSAvXjxcXC8oW14+XFxzXSspW14+XSo+JC87XG52YXIgY29udGVudFJlZ2V4ID0gL15bXjxdKyQvO1xudmFyIGdyZWF0ZXJUaGFuQ29udGVudFJlZ2V4ID0gL148W14+PF0qJC87XG52YXIgY29tbWVudFJlZ2V4ID0gLzwhLS0oLnxbXFxyXFxuXSkqPy0tPi9nO1xudmFyIGNvcmUgPSByZXF1aXJlKFwidG9rZW5pemVyMi9jb3JlXCIpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKFwibG9kYXNoL2ZvckVhY2hcIik7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoXCJsb2Rhc2gvbWVtb2l6ZVwiKTtcbnZhciB0b2tlbnMgPSBbXTtcbnZhciBodG1sQmxvY2tUb2tlbml6ZXI7XG4vKipcbiAqIENyZWF0ZXMgYSB0b2tlbml6ZXIgdG8gdG9rZW5pemUgSFRNTCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuICAgIHRva2VucyA9IFtdO1xuICAgIGh0bWxCbG9ja1Rva2VuaXplciA9IGNvcmUoZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICB9KTtcbiAgICBodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZShjb250ZW50UmVnZXgsIFwiY29udGVudFwiKTtcbiAgICBodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZShncmVhdGVyVGhhbkNvbnRlbnRSZWdleCwgXCJncmVhdGVyLXRoYW4tc2lnbi1jb250ZW50XCIpO1xuICAgIGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIik7XG4gICAgaHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiYmxvY2stZW5kXCIpO1xuICAgIGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKGlubGluZUVsZW1lbnRTdGFydFJlZ2V4LCBcImlubGluZS1zdGFydFwiKTtcbiAgICBodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZShpbmxpbmVFbGVtZW50RW5kUmVnZXgsIFwiaW5saW5lLWVuZFwiKTtcbiAgICBodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZShvdGhlckVsZW1lbnRTdGFydFJlZ2V4LCBcIm90aGVyLWVsZW1lbnQtc3RhcnRcIik7XG4gICAgaHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUob3RoZXJFbGVtZW50RW5kUmVnZXgsIFwib3RoZXItZWxlbWVudC1lbmRcIik7XG59XG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBpcyBhIGJsb2NrIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWxFbGVtZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgSFRNTCBlbGVtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IGl0IGlzIGEgYmxvY2sgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gaXNCbG9ja0VsZW1lbnQoaHRtbEVsZW1lbnROYW1lKSB7XG4gICAgcmV0dXJuIGJsb2NrRWxlbWVudHNSZWdleC50ZXN0KGh0bWxFbGVtZW50TmFtZSk7XG59XG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYW4gaW5saW5lIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzSW5saW5lRWxlbWVudChodG1sRWxlbWVudE5hbWUpIHtcbiAgICByZXR1cm4gaW5saW5lRWxlbWVudHNSZWdleC50ZXN0KGh0bWxFbGVtZW50TmFtZSk7XG59XG4vKipcbiAqIFNwbGl0cyBhIHRleHQgaW50byBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzcGxpdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBsaXN0IG9mIGJsb2NrcyBiYXNlZCBvbiBIVE1MIGJsb2NrIGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiBnZXRCbG9ja3ModGV4dCkge1xuICAgIHZhciBibG9ja3MgPSBbXSxcbiAgICAgICAgZGVwdGggPSAwLFxuICAgICAgICBibG9ja1N0YXJ0VGFnID0gXCJcIixcbiAgICAgICAgY3VycmVudEJsb2NrID0gXCJcIixcbiAgICAgICAgYmxvY2tFbmRUYWcgPSBcIlwiO1xuICAgIC8vIFJlbW92ZSBhbGwgY29tbWVudHMgYmVjYXVzZSBpdCBpcyB2ZXJ5IGhhcmQgdG8gdG9rZW5pemUgdGhlbS5cbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGNvbW1lbnRSZWdleCwgXCJcIik7XG4gICAgY3JlYXRlVG9rZW5pemVyKCk7XG4gICAgaHRtbEJsb2NrVG9rZW5pemVyLm9uVGV4dCh0ZXh0KTtcbiAgICBodG1sQmxvY2tUb2tlbml6ZXIuZW5kKCk7XG4gICAgZm9yRWFjaCh0b2tlbnMsIGZ1bmN0aW9uICh0b2tlbiwgaSkge1xuICAgICAgICB2YXIgbmV4dFRva2VuID0gdG9rZW5zW2kgKyAxXTtcbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29udGVudFwiOlxuICAgICAgICAgICAgY2FzZSBcImdyZWF0ZXItdGhhbi1zaWduLWNvbnRlbnRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJpbmxpbmUtc3RhcnRcIjpcbiAgICAgICAgICAgIGNhc2UgXCJpbmxpbmUtZW5kXCI6XG4gICAgICAgICAgICBjYXNlIFwib3RoZXItdGFnXCI6XG4gICAgICAgICAgICBjYXNlIFwib3RoZXItZWxlbWVudC1zdGFydFwiOlxuICAgICAgICAgICAgY2FzZSBcIm90aGVyLWVsZW1lbnQtZW5kXCI6XG4gICAgICAgICAgICBjYXNlIFwiZ3JlYXRlciB0aGFuIHNpZ25cIjpcbiAgICAgICAgICAgICAgICBpZiAoIW5leHRUb2tlbiB8fCBkZXB0aCA9PT0gMCAmJiAobmV4dFRva2VuLnR5cGUgPT09IFwiYmxvY2stc3RhcnRcIiB8fCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1lbmRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJsb2NrICs9IHRva2VuLnNyYztcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tTdGFydFRhZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9jayA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrRW5kVGFnID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJibG9jay1zdGFydFwiOlxuICAgICAgICAgICAgICAgIGlmIChkZXB0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEJsb2NrLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY3VycmVudEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBibG9ja0VuZFRhZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICAgICAgYmxvY2tTdGFydFRhZyA9IHRva2VuLnNyYztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJibG9jay1lbmRcIjpcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgICAgIGJsb2NrRW5kVGFnID0gdG9rZW4uc3JjO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogV2UgdHJ5IHRvIG1hdGNoIHRoZSBtb3N0IGRlZXAgYmxvY2tzIHNvIGRpc2NhcmQgYW55IG90aGVyIGJsb2NrcyB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGJ1dCBub3RcbiAgICAgICAgICAgICAgICAgKiBmaW5pc2hlZC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoXCJcIiAhPT0gYmxvY2tTdGFydFRhZyAmJiBcIlwiICE9PSBibG9ja0VuZFRhZykge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9ja1N0YXJ0VGFnICsgY3VycmVudEJsb2NrICsgYmxvY2tFbmRUYWcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJcIiAhPT0gY3VycmVudEJsb2NrLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChjdXJyZW50QmxvY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBibG9ja1N0YXJ0VGFnID0gXCJcIjtcbiAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2sgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGJsb2NrRW5kVGFnID0gXCJcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBIYW5kbGVzIEhUTUwgd2l0aCB0b28gbWFueSBjbG9zaW5nIHRhZ3MuXG4gICAgICAgIGlmIChkZXB0aCA8IDApIHtcbiAgICAgICAgICAgIGRlcHRoID0gMDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBibG9ja3M7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBibG9ja0VsZW1lbnRzOiBibG9ja0VsZW1lbnRzLFxuICAgIGlubGluZUVsZW1lbnRzOiBpbmxpbmVFbGVtZW50cyxcbiAgICBpc0Jsb2NrRWxlbWVudDogaXNCbG9ja0VsZW1lbnQsXG4gICAgaXNJbmxpbmVFbGVtZW50OiBpc0lubGluZUVsZW1lbnQsXG4gICAgZ2V0QmxvY2tzOiBtZW1vaXplKGdldEJsb2Nrcylcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1odG1sLmpzLm1hcFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHRtbC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dCAqL1xuXG52YXIgbWF0Y2hTdHJpbmdXaXRoUmVnZXggPSByZXF1aXJlKFwiLi9tYXRjaFN0cmluZ1dpdGhSZWdleC5qc1wiKTtcbi8qKlxuICogQ2hlY2tzIHRoZSB0ZXh0IGZvciBpbWFnZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHRzdHJpbmcgdG8gY2hlY2sgZm9yIGltYWdlc1xuICogQHJldHVybnMge0FycmF5fSBBcnJheSBjb250YWluaW5nIGFsbCB0eXBlcyBvZiBmb3VuZCBpbWFnZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGV4dCkge1xuICByZXR1cm4gbWF0Y2hTdHJpbmdXaXRoUmVnZXgodGV4dCwgXCI8aW1nKD86W14+XSspPz5cIik7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW1hZ2VJblRleHQuanMubWFwXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbWFnZUluVGV4dC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9tYXRjaFN0cmluZ1dpdGhSZWdleCAqL1xuLyoqXG4gKiBDaGVja3MgYSBzdHJpbmcgd2l0aCBhIHJlZ2V4LCByZXR1cm4gYWxsIG1hdGNoZXMgZm91bmQgd2l0aCB0aGF0IHJlZ2V4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIG1hdGNoIHRoZVxuICogQHBhcmFtIHtTdHJpbmd9IHJlZ2V4U3RyaW5nIEEgc3RyaW5nIHRvIHVzZSBhcyByZWdleC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgd2l0aCBtYXRjaGVzLCBlbXB0eSBhcnJheSBpZiBubyBtYXRjaGVzIGZvdW5kLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRleHQsIHJlZ2V4U3RyaW5nKSB7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZywgXCJpZ1wiKTtcbiAgICB2YXIgbWF0Y2hlcyA9IHRleHQubWF0Y2gocmVnZXgpO1xuICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgIG1hdGNoZXMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXM7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWF0Y2hTdHJpbmdXaXRoUmVnZXguanMubWFwXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXRjaFN0cmluZ1dpdGhSZWdleC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzICovXG5cbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIpO1xudmFyIGJsb2NrRWxlbWVudHMgPSByZXF1aXJlKFwiLi4vaGVscGVycy9odG1sLmpzXCIpLmJsb2NrRWxlbWVudHM7XG52YXIgYmxvY2tFbGVtZW50U3RhcnRSZWdleCA9IG5ldyBSZWdFeHAoXCJePChcIiArIGJsb2NrRWxlbWVudHMuam9pbihcInxcIikgKyBcIilbXj5dKj8+XCIsIFwiaVwiKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoXCI8LyhcIiArIGJsb2NrRWxlbWVudHMuam9pbihcInxcIikgKyBcIilbXj5dKj8+JFwiLCBcImlcIik7XG4vKipcbiAqIFN0cmlwIGluY29tcGxldGUgdGFncyB3aXRoaW4gYSB0ZXh0LiBTdHJpcHMgYW4gZW5kdGFnIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJpbmcgYW5kIHRoZSBzdGFydCB0YWcgYXQgdGhlIGVuZCBvZiBhXG4gKiBzdGFydCBvZiBhIHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHRoZSBIVE1MLXRhZ3MgZnJvbSBhdCB0aGUgYmVnaW4gYW5kIGVuZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgSFRNTC10YWdzIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICovXG52YXIgc3RyaXBJbmNvbXBsZXRlVGFncyA9IGZ1bmN0aW9uIHN0cmlwSW5jb21wbGV0ZVRhZ3ModGV4dCkge1xuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL14oPFxcLyhbXj5dKyk+KSsvaSwgXCJcIik7XG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvKDwoW15cXC8+XSspPikrJC9pLCBcIlwiKTtcbiAgICByZXR1cm4gdGV4dDtcbn07XG4vKipcbiAqIFJlbW92ZXMgdGhlIGJsb2NrIGVsZW1lbnQgdGFncyBhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmcgYW5kIHJldHVybnMgdGhpcyBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHVuZm9ybWF0dGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggcmVtb3ZlZCBIVE1MIGJlZ2luIGFuZCBlbmQgYmxvY2sgZWxlbWVudHNcbiAqL1xudmFyIHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZCA9IGZ1bmN0aW9uIHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZCh0ZXh0KSB7XG4gICAgdGV4dCA9IHRleHQucmVwbGFjZShibG9ja0VsZW1lbnRTdGFydFJlZ2V4LCBcIlwiKTtcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGJsb2NrRWxlbWVudEVuZFJlZ2V4LCBcIlwiKTtcbiAgICByZXR1cm4gdGV4dDtcbn07XG4vKipcbiAqIFN0cmlwIEhUTUwtdGFncyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncy5cbiAqL1xudmFyIHN0cmlwRnVsbFRhZ3MgPSBmdW5jdGlvbiBzdHJpcEZ1bGxUYWdzKHRleHQpIHtcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oPChbXj5dKyk+KS9pZywgXCIgXCIpO1xuICAgIHRleHQgPSBzdHJpcFNwYWNlcyh0ZXh0KTtcbiAgICByZXR1cm4gdGV4dDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzdHJpcEZ1bGxUYWdzOiBzdHJpcEZ1bGxUYWdzLFxuICAgIHN0cmlwSW5jb21wbGV0ZVRhZ3M6IHN0cmlwSW5jb21wbGV0ZVRhZ3MsXG4gICAgc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kOiBzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJpcEhUTUxUYWdzLmpzLm1hcFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaXBIVE1MVGFncy5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcyAqL1xuLyoqXG4gKiBTdHJpcCBkb3VibGUgc3BhY2VzIGZyb20gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHNwYWNlcyBmcm9tLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBkb3VibGUgc3BhY2VzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzIHdpdGggc2luZ2xlIHNwYWNlXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxzezIsfS9nLCBcIiBcIik7XG4gICAgLy8gUmVwbGFjZSBzcGFjZXMgZm9sbG93ZWQgYnkgcGVyaW9kcyB3aXRoIG9ubHkgdGhlIHBlcmlvZC5cbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHNcXC4vZywgXCIuXCIpO1xuICAgIC8vIFJlbW92ZSBmaXJzdC9sYXN0IGNoYXJhY3RlciBpZiBzcGFjZVxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuICAgIHJldHVybiB0ZXh0O1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cmlwU3BhY2VzLmpzLm1hcFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaXBTcGFjZXMuanMubWFwXG4iXX0=
