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
		var socialPreviewUploader = wp.media.frames.file_frame = wp.media({
			title: yoastSocialPreview.choose_image,
			button: { text: yoastSocialPreview.choose_image },
			multiple: false
		});

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
		socialPreviewholder.find(".form-table").hide();
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
							if (facebookTitle !== "") {
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
							description = $('#twitter-editor-description').attr('placeholder');
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
		if (facebookTitle !== "") {
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

		if (defaultImage !== undefined) {
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
			beforeElement: "#facebook-editor-imageUrl",
			buttonText: translations.helpButton.facebookImage,
			descriptionText: translations.help.facebookImage,
			id: "facebook-editor-image-help"
		}, {
			beforeElement: "#facebook-editor-title",
			buttonText: translations.helpButton.facebookTitle,
			descriptionText: translations.help.facebookTitle,
			id: "facebook-editor-title-help"
		}, {
			beforeElement: "#facebook-editor-description",
			buttonText: translations.helpButton.facebookDescription,
			descriptionText: translations.help.facebookDescription,
			id: "facebook-editor-description-help"
		}, {
			beforeElement: "#twitter-editor-imageUrl",
			buttonText: translations.helpButton.twitterImage,
			descriptionText: translations.help.twitterImage,
			id: "twitter-editor-image-help"
		}, {
			beforeElement: "#twitter-editor-title",
			buttonText: translations.helpButton.twitterTitle,
			descriptionText: translations.help.twitterTitle,
			id: "twitter-editor-title-help"
		}, {
			beforeElement: "#twitter-editor-description",
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

},{"../../../../js/src/analysis/getDescriptionPlaceholder":1,"../../../../js/src/analysis/getTitlePlaceholder":3,"./helpPanel":5,"jed":7,"lodash/clone":130,"lodash/forEach":132,"lodash/has":134,"lodash/isUndefined":147,"yoast-social-previews":156,"yoastseo/js/stringProcessing/imageInText":154}],7:[function(require,module,exports){
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

},{"./_getNative":81,"./_root":118}],9:[function(require,module,exports){
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
      length = entries ? entries.length : 0;

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

},{"./_hashClear":87,"./_hashDelete":88,"./_hashGet":89,"./_hashHas":90,"./_hashSet":91}],10:[function(require,module,exports){
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
      length = entries ? entries.length : 0;

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

},{"./_listCacheClear":101,"./_listCacheDelete":102,"./_listCacheGet":103,"./_listCacheHas":104,"./_listCacheSet":105}],11:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":81,"./_root":118}],12:[function(require,module,exports){
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
      length = entries ? entries.length : 0;

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

},{"./_mapCacheClear":106,"./_mapCacheDelete":107,"./_mapCacheGet":108,"./_mapCacheHas":109,"./_mapCacheSet":110}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":81,"./_root":118}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":81,"./_root":118}],15:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":12,"./_setCacheAdd":119,"./_setCacheHas":120}],16:[function(require,module,exports){
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

},{"./_ListCache":10,"./_stackClear":122,"./_stackDelete":123,"./_stackGet":124,"./_stackHas":125,"./_stackSet":126}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":118}],18:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":118}],19:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":81,"./_root":118}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

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

},{"./_baseTimes":54,"./_isIndex":95,"./isArguments":137,"./isArray":138,"./isBuffer":140,"./isTypedArray":146}],24:[function(require,module,exports){
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
      length = array ? array.length : 0,
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
      length = array ? array.length : 0;

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
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],28:[function(require,module,exports){
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

},{"./_baseAssignValue":31,"./eq":131}],29:[function(require,module,exports){
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

},{"./eq":131}],30:[function(require,module,exports){
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

},{"./_copyObject":68,"./keys":148}],31:[function(require,module,exports){
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

},{"./_defineProperty":73}],32:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

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
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
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
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
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

  var props = isArr ? undefined : (isFull ? getAllKeys : keys)(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":16,"./_arrayEach":22,"./_assignValue":28,"./_baseAssign":30,"./_cloneBuffer":60,"./_copyArray":67,"./_copySymbols":69,"./_getAllKeys":78,"./_getTag":84,"./_initCloneArray":92,"./_initCloneByTag":93,"./_initCloneObject":94,"./isArray":138,"./isBuffer":140,"./isObject":143,"./keys":148}],33:[function(require,module,exports){
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

},{"./isObject":143}],34:[function(require,module,exports){
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

},{"./_baseForOwn":36,"./_createBaseEach":71}],35:[function(require,module,exports){
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

},{"./_createBaseFor":72}],36:[function(require,module,exports){
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

},{"./_baseFor":35,"./keys":148}],37:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":58,"./_isKey":96,"./_toKey":128}],38:[function(require,module,exports){
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

},{"./_arrayPush":25,"./isArray":138}],39:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

module.exports = baseGetTag;

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],42:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && objectToString.call(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./isObjectLike":144}],43:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":44,"./isObject":143,"./isObjectLike":144}],44:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":16,"./_equalArrays":74,"./_equalByTag":75,"./_equalObjects":76,"./_getTag":84,"./isArray":138,"./isBuffer":140,"./isTypedArray":146}],45:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":16,"./_baseIsEqual":43}],46:[function(require,module,exports){
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

},{"./_isMasked":98,"./_toSource":129,"./isFunction":141,"./isObject":143}],47:[function(require,module,exports){
var isLength = require('./isLength'),
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

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = baseIsTypedArray;

},{"./isLength":142,"./isObjectLike":144}],48:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":50,"./_baseMatchesProperty":51,"./identity":136,"./isArray":138,"./property":150}],49:[function(require,module,exports){
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

},{"./_isPrototype":99,"./_nativeKeys":115}],50:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":45,"./_getMatchData":80,"./_matchesStrictComparable":112}],51:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":43,"./_isKey":96,"./_isStrictComparable":100,"./_matchesStrictComparable":112,"./_toKey":128,"./get":133,"./hasIn":135}],52:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],53:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":37}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"./_Symbol":17,"./_arrayMap":24,"./isArray":138,"./isSymbol":145}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],58:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":127,"./isArray":138}],59:[function(require,module,exports){
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

},{"./_Uint8Array":18}],60:[function(require,module,exports){
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

},{"./_root":118}],61:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":59}],62:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

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
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":20,"./_arrayReduce":26,"./_mapToArray":111}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

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
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":21,"./_arrayReduce":26,"./_setToArray":121}],65:[function(require,module,exports){
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

},{"./_Symbol":17}],66:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":59}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{"./_assignValue":28,"./_baseAssignValue":31}],69:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
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

},{"./_copyObject":68,"./_getSymbols":83}],70:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":118}],71:[function(require,module,exports){
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

},{"./isArrayLike":139}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":81}],74:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":15,"./_arraySome":27,"./_cacheHas":57}],75:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":17,"./_Uint8Array":18,"./_equalArrays":74,"./_mapToArray":111,"./_setToArray":121,"./eq":131}],76:[function(require,module,exports){
var keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./keys":148}],77:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],78:[function(require,module,exports){
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

},{"./_baseGetAllKeys":38,"./_getSymbols":83,"./keys":148}],79:[function(require,module,exports){
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

},{"./_isKeyable":97}],80:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":100,"./keys":148}],81:[function(require,module,exports){
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

},{"./_baseIsNative":46,"./_getValue":85}],82:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":117}],83:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":117,"./stubArray":151}],84:[function(require,module,exports){
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

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

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

},{"./_DataView":8,"./_Map":11,"./_Promise":13,"./_Set":14,"./_WeakMap":19,"./_baseGetTag":39,"./_toSource":129}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
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
  path = isKey(path, object) ? [path] : castPath(path);

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
  length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":58,"./_isIndex":95,"./_isKey":96,"./_toKey":128,"./isArguments":137,"./isArray":138,"./isLength":142}],87:[function(require,module,exports){
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

},{"./_nativeCreate":114}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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

},{"./_nativeCreate":114}],90:[function(require,module,exports){
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
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":114}],91:[function(require,module,exports){
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

},{"./_nativeCreate":114}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":59,"./_cloneDataView":61,"./_cloneMap":62,"./_cloneRegExp":63,"./_cloneSet":64,"./_cloneSymbol":65,"./_cloneTypedArray":66}],94:[function(require,module,exports){
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

},{"./_baseCreate":33,"./_getPrototype":82,"./_isPrototype":99}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{"./isArray":138,"./isSymbol":145}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{"./_coreJsData":70}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":143}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],103:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],104:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],105:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],106:[function(require,module,exports){
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

},{"./_Hash":9,"./_ListCache":10,"./_Map":11}],107:[function(require,module,exports){
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

},{"./_getMapData":79}],108:[function(require,module,exports){
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

},{"./_getMapData":79}],109:[function(require,module,exports){
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

},{"./_getMapData":79}],110:[function(require,module,exports){
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

},{"./_getMapData":79}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],113:[function(require,module,exports){
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

},{"./memoize":149}],114:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":81}],115:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":117}],116:[function(require,module,exports){
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
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":77}],117:[function(require,module,exports){
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

},{}],118:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":77}],119:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],120:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],121:[function(require,module,exports){
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

},{}],122:[function(require,module,exports){
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

},{"./_ListCache":10}],123:[function(require,module,exports){
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

},{}],124:[function(require,module,exports){
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

},{}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{"./_ListCache":10,"./_Map":11,"./_MapCache":12}],127:[function(require,module,exports){
var memoizeCapped = require('./_memoizeCapped'),
    toString = require('./toString');

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
  string = toString(string);

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

},{"./_memoizeCapped":113,"./toString":153}],128:[function(require,module,exports){
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

},{"./isSymbol":145}],129:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
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

},{}],130:[function(require,module,exports){
var baseClone = require('./_baseClone');

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
  return baseClone(value, false, true);
}

module.exports = clone;

},{"./_baseClone":32}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
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
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":22,"./_baseEach":34,"./_baseIteratee":48,"./isArray":138}],133:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":37}],134:[function(require,module,exports){
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

},{"./_baseHas":40,"./_hasPath":86}],135:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":41,"./_hasPath":86}],136:[function(require,module,exports){
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

},{}],137:[function(require,module,exports){
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

},{"./_baseIsArguments":42,"./isObjectLike":144}],138:[function(require,module,exports){
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

},{}],139:[function(require,module,exports){
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

},{"./isFunction":141,"./isLength":142}],140:[function(require,module,exports){
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

},{"./_root":118,"./stubFalse":152}],141:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./isObject":143}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{}],144:[function(require,module,exports){
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

},{}],145:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":144}],146:[function(require,module,exports){
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

},{"./_baseIsTypedArray":47,"./_baseUnary":56,"./_nodeUtil":116}],147:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],148:[function(require,module,exports){
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

},{"./_arrayLikeKeys":23,"./_baseKeys":49,"./isArrayLike":139}],149:[function(require,module,exports){
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
 * method interface of `delete`, `get`, `has`, and `set`.
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
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
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

},{"./_MapCache":12}],150:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":52,"./_basePropertyDeep":53,"./_isKey":96,"./_toKey":128}],151:[function(require,module,exports){
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

},{}],152:[function(require,module,exports){
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

},{}],153:[function(require,module,exports){
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

},{"./_baseToString":55}],154:[function(require,module,exports){
/** @module stringProcessing/imageInText */

var matchStringWithRegex = require( "./matchStringWithRegex.js" );

/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function( text ) {
	return matchStringWithRegex( text, "<img(?:[^>]+)?>" );
};

},{"./matchStringWithRegex.js":155}],155:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ) {
	var regex = new RegExp( regexString, "ig" );
	var matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],156:[function(require,module,exports){
"use strict";

module.exports = {
	FacebookPreview: require("./js/facebookPreview"),
	TwitterPreview: require("./js/twitterPreview")
};

},{"./js/facebookPreview":159,"./js/twitterPreview":173}],157:[function(require,module,exports){
"use strict";

var placeholderTemplate = require("../templates").imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object} imageContainer The location to put the placeholder in.
 * @param {string} placeholder The value for the placeholder.
 * @param {boolean} isError When the placeholder should an error.
 * @param {string} modifier A css class modifier to change the styling.
 */
function setImagePlaceholder(imageContainer, placeholder, isError, modifier) {
	var classNames = ["social-image-placeholder"];
	isError = isError || false;
	modifier = modifier || "";

	if (isError) {
		classNames.push("social-image-placeholder--error");
	}

	if ("" !== modifier) {
		classNames.push("social-image-placeholder--" + modifier);
	}

	imageContainer.innerHTML = placeholderTemplate({
		className: classNames.join(" "),
		placeholder: placeholder
	});
}

module.exports = setImagePlaceholder;

},{"../templates":172}],158:[function(require,module,exports){
"use strict";

var isEmpty = require("lodash/lang/isEmpty");
var debounce = require("lodash/function/debounce");

var stripHTMLTags = require("yoastseo/js/stringProcessing/stripHTMLTags.js");
var stripSpaces = require("yoastseo/js/stringProcessing/stripSpaces.js");

/**
 * Represents a field and sets the events for that field.
 *
 * @param {Object} inputField The field to represent.
 * @param {Object} values The values to use.
 * @param {Object|undefined} callback The callback to executed after field change.
 * @constructor
 */
function InputElement(inputField, values, callback) {
	this.inputField = inputField;
	this.values = values;
	this._callback = callback;

	this.setValue(this.getInputValue());

	this.bindEvents();
}

/**
 * Binds the events
 */
InputElement.prototype.bindEvents = function () {
	// Set the events.
	this.inputField.addEventListener("keydown", this.changeEvent.bind(this));
	this.inputField.addEventListener("keyup", this.changeEvent.bind(this));

	this.inputField.addEventListener("input", this.changeEvent.bind(this));
	this.inputField.addEventListener("focus", this.changeEvent.bind(this));
	this.inputField.addEventListener("blur", this.changeEvent.bind(this));
};

/**
 * Do the change event
 *
 * @type {Function}
 */
InputElement.prototype.changeEvent = debounce(function () {
	// When there is a callback run it.
	if (typeof this._callback !== "undefined") {
		this._callback();
	}

	this.setValue(this.getInputValue());
}, 25);

/**
 *
 * @returns {string} The current field value
 */
InputElement.prototype.getInputValue = function () {
	return this.inputField.value;
};

/**
 * Formats the a value for the preview. If value is empty a sample value is used
 *
 * @returns {string} The formatted title, without html tags.
 */
InputElement.prototype.formatValue = function () {
	var value = this.getValue();

	value = stripHTMLTags(value);

	// As an ultimate fallback provide the user with a helpful message.
	if (isEmpty(value)) {
		value = this.values.fallback;
	}

	return stripSpaces(value);
};

/**
 * Get the value
 *
 * @returns {string} Return the value or get a fallback one.
 */
InputElement.prototype.getValue = function () {
	var value = this.values.currentValue;

	// Fallback to the default if value is empty.
	if (isEmpty(value)) {
		value = this.values.defaultValue;
	}

	// For rendering we can fallback to the placeholder as well.
	if (isEmpty(value)) {
		value = this.values.placeholder;
	}

	return value;
};

/**
 * Set the current value
 *
 * @param {string} value The value to set
 */
InputElement.prototype.setValue = function (value) {
	this.values.currentValue = value;
};

module.exports = InputElement;

},{"lodash/function/debounce":177,"lodash/lang/isEmpty":217,"yoastseo/js/stringProcessing/stripHTMLTags.js":232,"yoastseo/js/stringProcessing/stripSpaces.js":233}],159:[function(require,module,exports){
"use strict";

/* jshint browser: true */

var isElement = require("lodash/lang/isElement");
var clone = require("lodash/lang/clone");
var defaultsDeep = require("lodash/object/defaultsDeep");

var Jed = require("jed");

var imageDisplayMode = require("./helpers/imageDisplayMode");
var renderDescription = require("./helpers/renderDescription");
var imagePlaceholder = require("./element/imagePlaceholder");
var bemAddModifier = require("./helpers/bem/addModifier");
var bemRemoveModifier = require("./helpers/bem/removeModifier");

var TextField = require("./inputs/textInput");
var TextArea = require("./inputs/textarea");

var InputElement = require("./element/input");
var PreviewEvents = require("./preview/events");

var templates = require("./templates.js");
var facebookEditorTemplate = templates.facebookPreview;
var facebookAuthorTemplate = templates.facebookAuthor;

var facebookDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function updateSocialPreview() {},
		modifyTitle: function modifyTitle(title) {
			return title;
		},
		modifyDescription: function modifyDescription(description) {
			return description;
		},
		modifyImageUrl: function modifyImageUrl(imageUrl) {
			return imageUrl;
		}
	}
};

var inputFacebookPreviewBindings = [{
	"preview": "editable-preview__title--facebook",
	"inputField": "title"
}, {
	"preview": "editable-preview__image--facebook",
	"inputField": "imageUrl"
}, {
	"preview": "editable-preview__description--facebook",
	"inputField": "description"
}];

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
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in Facebook.
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
 * @property {HTMLElement} element.rendered.description   - The rendered Facebook description element.
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
var FacebookPreview = function FacebookPreview(opts, i18n) {
	this.i18n = i18n || this.constructI18n();

	facebookDefaults.placeholder = {
		title: this.i18n.dgettext("yoast-social-previews", "This is an example title - edit by clicking here"),
		description: this.i18n.sprintf(
		/** translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "Modify your %1$s description by editing it right here"), "Facebook"),
		imageUrl: ""
	};

	defaultsDeep(opts, facebookDefaults);

	if (!isElement(opts.targetElement)) {
		throw new Error("The Facebook preview requires a valid target element");
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
FacebookPreview.prototype.constructI18n = function (translations) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
	};

	translations = translations || {};

	defaultsDeep(translations, defaultTranslations);

	return new Jed(translations);
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
FacebookPreview.prototype.init = function () {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderTemplate = function () {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = facebookEditorTemplate({
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Facebook */
			edit: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "Edit %1$s preview"), "Facebook"),
			/** translators: %1$s expands to Facebook */
			snippetPreview: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s preview"), "Facebook"),
			/** translators: %1$s expands to Facebook */
			snippetEditor: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s editor"), "Facebook")
		}
	});

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName("editable-preview__value--facebook-title")[0],
			description: targetElement.getElementsByClassName("editable-preview__value--facebook-description")[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName("editable-preview--facebook")[0],
		formContainer: targetElement.getElementsByClassName("snippet-editor__form")[0],
		editToggle: targetElement.getElementsByClassName("snippet-editor__edit-button")[0],
		formFields: targetElement.getElementsByClassName("snippet-editor__form-field"),
		headingEditor: targetElement.getElementsByClassName("snippet-editor__heading-editor")[0],
		authorContainer: targetElement.getElementsByClassName("editable-preview__value--facebook-author")[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render() + this.element.fields.title.render() + this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName("js-snippet-editor-title")[0],
		imageUrl: targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0],
		description: targetElement.getElementsByClassName("js-snippet-editor-description")[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName("snippet-editor__submit")[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName("editable-preview__image--facebook")[0],
		description: this.element.rendered.description.parentNode
	};
};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
FacebookPreview.prototype.getFields = function () {
	return {
		title: new TextField({
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "facebook-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s title"), "Facebook"),
			labelClassName: "snippet-editor__label"
		}),
		description: new TextArea({
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s description"), "Facebook"),
			labelClassName: "snippet-editor__label"
		}),
		imageUrl: new TextField({
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s image"), "Facebook"),
			labelClassName: "snippet-editor__label"
		})
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field elements.
 */
FacebookPreview.prototype.getFieldElements = function () {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-title")[0], {
			currentValue: this.data.title,
			defaultValue: this.opts.defaultValue.title,
			placeholder: this.opts.placeholder.title,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s title by editing the snippet below."), "Facebook")
		}, this.updatePreview.bind(this)),
		description: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-description")[0], {
			currentValue: this.data.description,
			defaultValue: this.opts.defaultValue.description,
			placeholder: this.opts.placeholder.description,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s description by editing the snippet below."), "Facebook")
		}, this.updatePreview.bind(this)),
		imageUrl: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0], {
			currentValue: this.data.imageUrl,
			defaultValue: this.opts.defaultValue.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			fallback: ""
		}, this.updatePreview.bind(this))
	};
};

/**
 * Updates the Facebook preview.
 */
FacebookPreview.prototype.updatePreview = function () {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle(this.element.fieldElements.title.getValue());
	this.setTitle(this.element.fieldElements.title.getValue());

	// Set the description field and parse the styling of it.
	this.setDescription(this.element.fieldElements.description.getValue());

	// Sets the Image
	this.setImage(this.data.imageUrl);

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview(clone(this.data));
};

/**
 * Sets the preview title.
 *
 * @param {string} title The title to set
 */
FacebookPreview.prototype.setTitle = function (title) {
	title = this.opts.callbacks.modifyTitle(title);

	this.element.rendered.title.innerHTML = title;
};

/**
 * Sets the preview description.
 *
 * @param {string} description The description to set
 */
FacebookPreview.prototype.setDescription = function (description) {
	description = this.opts.callbacks.modifyDescription(description);

	this.element.rendered.description.innerHTML = description;
	renderDescription(this.element.rendered.description, this.element.fieldElements.description.getInputValue());
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
FacebookPreview.prototype.getImageContainer = function () {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 * @returns {void}
 */
FacebookPreview.prototype.setImage = function (imageUrl) {
	imageUrl = this.opts.callbacks.modifyImageUrl(imageUrl);

	if (imageUrl === "" && this.data.imageUrl === "") {
		this.removeImageFromContainer();
		return this.noUrlSet();
	}

	var img = new Image();

	img.onload = function () {
		if (this.isTooSmallImage(img)) {
			this.removeImageFromContainer();
			return this.imageTooSmall();
		}

		this.setSizingClass(img);
		this.addImageToContainer(imageUrl);
	}.bind(this);

	img.onerror = function () {
		this.removeImageFromContainer();
		return this.imageError();
	}.bind(this);

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Displays the No URL Set warning.
 * @returns {void}
 */
FacebookPreview.prototype.noUrlSet = function () {
	this.removeImageClasses();

	imagePlaceholder(this.getImageContainer(), this.i18n.dgettext("yoast-social-previews", "Please select an image by clicking here"), false, "facebook");

	return;
};

/**
 * Displays the Image Too Small error.
 * @returns {void}
 */
FacebookPreview.prototype.imageTooSmall = function () {
	var message;
	this.removeImageClasses();

	if (this.data.imageUrl === "") {
		message = this.i18n.sprintf(
		/* translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "We are unable to detect an image " + "in your post that is large enough to be displayed on Facebook. We advise you " + "to select a %1$s image that fits the recommended image size."), "Facebook");
	} else {
		message = this.i18n.sprintf(
		/* translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "The image you selected is too small for %1$s"), "Facebook");
	}

	imagePlaceholder(this.getImageContainer(), message, true, "facebook");

	return;
};

/**
 * Displays the Url Cannot Be Loaded error.
 * @returns {void}
 */
FacebookPreview.prototype.imageError = function () {
	this.removeImageClasses();

	imagePlaceholder(this.getImageContainer(), this.i18n.dgettext("yoast-social-previews", "The given image url cannot be loaded"), true, "facebook");
};

/**
 * Sets the image of the image container.
 * @param {string} image The image to use.
 */
FacebookPreview.prototype.addImageToContainer = function (image) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
FacebookPreview.prototype.removeImageFromContainer = function () {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 * @returns {void}
 */
FacebookPreview.prototype.setSizingClass = function (img) {
	this.removeImageClasses();

	if (imageDisplayMode(img) === "portrait") {
		this.setPortraitImageClasses();

		return;
	}

	if (this.isSmallImage(img)) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated maxwidth
 */
FacebookPreview.prototype.getMaxImageWidth = function (img) {
	if (this.isSmallImage(img)) {
		return WIDTH_FACEBOOK_IMAGE_SMALL;
	}

	return WIDTH_FACEBOOK_IMAGE_LARGE;
};

/**
 * Detects if the Facebook preview should switch to small image mode
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
FacebookPreview.prototype.isSmallImage = function (image) {
	return image.width < FACEBOOK_IMAGE_THRESHOLD_WIDTH || image.height < FACEBOOK_IMAGE_THRESHOLD_HEIGHT;
};

/**
 * Detects if the Facebook preview image is too small
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
FacebookPreview.prototype.isTooSmallImage = function (image) {
	return image.width < FACEBOOK_IMAGE_TOO_SMALL_WIDTH || image.height < FACEBOOK_IMAGE_TOO_SMALL_HEIGHT;
};

/**
 * Sets the classes on the Facebook preview so that it will display a small Facebook image preview
 */
FacebookPreview.prototype.setSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-small", "social-preview__inner", targetElement);
	bemAddModifier("facebook-small", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-small", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Removes the small image classes.
 */
FacebookPreview.prototype.removeSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-small", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-small", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-small", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
FacebookPreview.prototype.setLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-large", "social-preview__inner", targetElement);
	bemAddModifier("facebook-large", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-large", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Removes the large image classes.
 */
FacebookPreview.prototype.removeLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-large", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-large", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-large", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Sets the classes on the Facebook preview so that it will display a portrait Facebook image preview
 */
FacebookPreview.prototype.setPortraitImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-portrait", "social-preview__inner", targetElement);
	bemAddModifier("facebook-portrait", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-portrait", "editable-preview__text-keeper--facebook", targetElement);
	bemAddModifier("facebook-bottom", "editable-preview__website--facebook", targetElement);
};

/**
 * Removes the portrait image classes.
 */
FacebookPreview.prototype.removePortraitImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-portrait", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-portrait", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-portrait", "editable-preview__text-keeper--facebook", targetElement);
	bemRemoveModifier("facebook-bottom", "editable-preview__website--facebook", targetElement);
};

/**
 * Removes all image classes.
 */
FacebookPreview.prototype.removeImageClasses = function () {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
	this.removePortraitImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function () {
	var previewEvents = new PreviewEvents(inputFacebookPreviewBindings, this.element, true);
	previewEvents.bindEvents(this.element.editToggle, this.element.closeEditor);
};

/**
 * Sets the value of the Facebook author name.
 *
 * @param {string} authorName The name of the author to show.
 */
FacebookPreview.prototype.setAuthor = function (authorName) {
	var authorHtml = "";
	if (authorName !== "") {
		authorHtml = facebookAuthorTemplate({
			authorName: authorName,
			authorBy: this.i18n.dgettext("yoast-social-previews", "By")
		});
	}

	this.element.authorContainer.innerHTML = authorHtml;
};

module.exports = FacebookPreview;

},{"./element/imagePlaceholder":157,"./element/input":158,"./helpers/bem/addModifier":161,"./helpers/bem/removeModifier":163,"./helpers/imageDisplayMode":164,"./helpers/renderDescription":167,"./inputs/textInput":169,"./inputs/textarea":170,"./preview/events":171,"./templates.js":172,"jed":174,"lodash/lang/clone":213,"lodash/lang/isElement":216,"lodash/object/defaultsDeep":227}],160:[function(require,module,exports){
"use strict";

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
module.exports = function (element, className) {
  var classes = element.className.split(" ");

  if (-1 === classes.indexOf(className)) {
    classes.push(className);
  }

  element.className = classes.join(" ");
};

},{}],161:[function(require,module,exports){
"use strict";

var addClass = require("./../addClass");
var addModifierToClass = require("./addModifierToClass");

/**
 * Adds a BEM modifier to an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function addModifier(modifier, targetClass, targetParent) {
  var element = targetParent.getElementsByClassName(targetClass)[0];
  var newClass = addModifierToClass(modifier, targetClass);

  addClass(element, newClass);
}

module.exports = addModifier;

},{"./../addClass":160,"./addModifierToClass":162}],162:[function(require,module,exports){
"use strict";

/**
 * Adds a modifier to a class name, makes sure
 *
 * @param {string} modifier The modifier to add to the class name.
 * @param {string} className The class name to add the modifier to.
 *
 * @returns {string} The new class with the modifier.
 */
function addModifierToClass(modifier, className) {
  var baseClass = className.replace(/--.+/, "");

  return baseClass + "--" + modifier;
}

module.exports = addModifierToClass;

},{}],163:[function(require,module,exports){
"use strict";

var removeClass = require("./../removeClass");
var addModifierToClass = require("./addModifierToClass");

/**
 * Removes a BEM modifier from an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function removeModifier(modifier, targetClass, targetParent) {
  var element = targetParent.getElementsByClassName(targetClass)[0];
  var newClass = addModifierToClass(modifier, targetClass);

  removeClass(element, newClass);
}

module.exports = removeModifier;

},{"./../removeClass":166,"./addModifierToClass":162}],164:[function(require,module,exports){
"use strict";

/**
 * Retrieves the image display mode
 *
 * @param {Object} image The image object.
 * @returns {string} The display mode of the image.
 */
function imageDisplayMode(image) {
  if (image.height > image.width) {
    return "portrait";
  }

  return "landscape";
}

module.exports = imageDisplayMode;

},{}],165:[function(require,module,exports){
"use strict";

/**
 * Cleans spaces from the html.
 *
 * @param  {string} html The html to minimize.
 *
 * @returns {string} The minimized html string.
 */
function minimizeHtml(html) {
	html = html.replace(/(\s+)/g, " ");
	html = html.replace(/> </g, "><");
	html = html.replace(/ >/g, ">");
	html = html.replace(/> /g, ">");
	html = html.replace(/ </g, "<");
	html = html.replace(/ $/, "");

	return html;
}

module.exports = minimizeHtml;

},{}],166:[function(require,module,exports){
"use strict";

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
module.exports = function (element, className) {
	var classes = element.className.split(" ");
	var foundClass = classes.indexOf(className);

	if (-1 !== foundClass) {
		classes.splice(foundClass, 1);
	}

	element.className = classes.join(" ");
};

},{}],167:[function(require,module,exports){
"use strict";

var isEmpty = require("lodash/lang/isEmpty");

var addClass = require("./addClass");
var removeClass = require("./removeClass");

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @param {string} descriptionElement Target description element
 * @param {string} description Current description
 */
function renderDescription(descriptionElement, description) {
	if (isEmpty(description)) {
		addClass(descriptionElement, "desc-render");
		removeClass(descriptionElement, "desc-default");
	} else {
		addClass(descriptionElement, "desc-default");
		removeClass(descriptionElement, "desc-render");
	}
}

module.exports = renderDescription;

},{"./addClass":160,"./removeClass":166,"lodash/lang/isEmpty":217}],168:[function(require,module,exports){
"use strict";

var defaults = require("lodash/object/defaults");
var minimizeHtml = require("../helpers/minimizeHtml");

/**
 * Factory for the inputfield.
 *
 * @param {Object} template Template object to use.
 * @returns {TextField} The textfield object.
 */
function inputFieldFactory(template) {

	var defaultAttributes = {
		value: "",
		className: "",
		id: "",
		placeholder: "",
		name: "",
		title: "",
		labelClassName: ""
	};

	/**
  * Represents an HTML text field
  *
  * @param {Object} attributes The attributes to set on the HTML element
  * @param {string} attributes.value The value for this text field
  * @param {string} attributes.placeholder The placeholder for this text field
  * @param {string} attributes.name The name for this text field
  * @param {string} attributes.id The id for this text field
  * @param {string} attributes.className The class for this text field
  * @param {string} attributes.title The title that describes this text field
  *
  * @constructor
  */
	function TextField(attributes) {
		attributes = attributes || {};
		attributes = defaults(attributes, defaultAttributes);

		this._attributes = attributes;
	}

	/**
  * Returns the HTML attributes set for this text field
  *
  * @returns {Object} The HTML attributes
  */
	TextField.prototype.getAttributes = function () {
		return this._attributes;
	};

	/**
  * Renders the text field to HTML
  *
  * @returns {string} The rendered HTML
  */
	TextField.prototype.render = function () {
		var html = template(this.getAttributes());

		html = minimizeHtml(html);

		return html;
	};

	/**
  * Set the value of the input field
  *
  * @param {string} value The value to set on this input field
  */
	TextField.prototype.setValue = function (value) {
		this._attributes.value = value;
	};

	/**
  * Set the value of the input field
  *
  * @param {string} className The class to set on this input field
  */
	TextField.prototype.setClassName = function (className) {
		this._attributes.className = className;
	};

	return TextField;
}

module.exports = inputFieldFactory;

},{"../helpers/minimizeHtml":165,"lodash/object/defaults":226}],169:[function(require,module,exports){
"use strict";

var inputFieldFactory = require("./inputField");

module.exports = inputFieldFactory(require("../templates").fields.text);

},{"../templates":172,"./inputField":168}],170:[function(require,module,exports){
"use strict";

var inputFieldFactory = require("./inputField");

module.exports = inputFieldFactory(require("../templates").fields.textarea);

},{"../templates":172,"./inputField":168}],171:[function(require,module,exports){
"use strict";

var forEach = require("lodash/collection/forEach");

var addClass = require("../helpers/addClass.js");
var removeClass = require("../helpers/removeClass.js");

/**
 *
 * @param {Object} bindings The fields to bind.
 * @param {Object} element The element to bind the events to.
 * @param {boolean} alwaysOpen Whether the input form should always be open.
 * @constructor
 */
function PreviewEvents(bindings, element, alwaysOpen) {
	this._bindings = bindings;
	this.element = element;
	this._alwaysOpen = alwaysOpen;
}

/**
 * Bind the events.
 *
 * @param {Object} editToggle - The edit toggle element
 * @param {Object} closeEditor - The button to close the editor
 */
PreviewEvents.prototype.bindEvents = function (editToggle, closeEditor) {
	if (!this._alwaysOpen) {
		editToggle.addEventListener("click", this.toggleEditor.bind(this));
		closeEditor.addEventListener("click", this.closeEditor.bind(this));
	}

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach(this._bindings, this.bindInputEvent.bind(this));
};

/**
 * Binds the event for the input
 *
 * @param {Object} binding The field to bind.
 */
PreviewEvents.prototype.bindInputEvent = function (binding) {
	var previewElement = document.getElementsByClassName(binding.preview)[0];
	var inputElement = this.element.input[binding.inputField];

	// Make the preview element click open the editor and focus the correct input.
	previewElement.addEventListener("click", function () {
		this.openEditor();
		inputElement.focus();
	}.bind(this));

	// Make focusing an input, update the carets.
	inputElement.addEventListener("focus", function () {
		this._currentFocus = binding.inputField;

		this._updateFocusCarets();
	}.bind(this));

	// Make removing focus from an element, update the carets.
	inputElement.addEventListener("blur", function () {
		this._currentFocus = null;

		this._updateFocusCarets();
	}.bind(this));

	previewElement.addEventListener("mouseover", function () {
		this._currentHover = binding.inputField;

		this._updateHoverCarets();
	}.bind(this));

	previewElement.addEventListener("mouseout", function () {
		this._currentHover = null;

		this._updateHoverCarets();
	}.bind(this));
};

/**
 * Opens the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.openEditor = function () {

	if (this._alwaysOpen) {
		return;
	}

	// Hide these elements.
	addClass(this.element.editToggle, "snippet-editor--hidden");

	// Show these elements.
	removeClass(this.element.formContainer, "snippet-editor--hidden");
	removeClass(this.element.headingEditor, "snippet-editor--hidden");

	this.opened = true;
};

/**
 * Closes the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.closeEditor = function () {

	if (this._alwaysOpen) {
		return;
	}

	// Hide these elements.
	addClass(this.element.formContainer, "snippet-editor--hidden");
	addClass(this.element.headingEditor, "snippet-editor--hidden");

	// Show these elements.
	removeClass(this.element.editToggle, "snippet-editor--hidden");

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.toggleEditor = function () {
	if (this.opened) {
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
PreviewEvents.prototype._updateFocusCarets = function () {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach(this.element.label, function (element) {
		removeClass(element, "snippet-editor__label--focus");
	});

	// Disable all carets on the previews.
	forEach(this.element.preview, function (element) {
		removeClass(element, "snippet-editor__container--focus");
	});

	if (null !== this._currentFocus) {
		focusedLabel = this.element.label[this._currentFocus];
		focusedPreview = this.element.preview[this._currentFocus];

		addClass(focusedLabel, "snippet-editor__label--focus");
		addClass(focusedPreview, "snippet-editor__container--focus");
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateHoverCarets = function () {
	var hoveredLabel;

	forEach(this.element.label, function (element) {
		removeClass(element, "snippet-editor__label--hover");
	});

	if (null !== this._currentHover) {
		hoveredLabel = this.element.label[this._currentHover];

		addClass(hoveredLabel, "snippet-editor__label--hover");
	}
};

module.exports = PreviewEvents;

},{"../helpers/addClass.js":160,"../helpers/removeClass.js":166,"lodash/collection/forEach":175}],172:[function(require,module,exports){
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
  var VERSION = '4.16.4';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

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
        length = array ? array.length : 0,
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

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

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
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
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
    __p += '<div class="editable-preview editable-preview--facebook">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--facebook">\n		<div class="social-preview__inner social-preview__inner--facebook">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--facebook snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--facebook">\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__title--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-title">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__description--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-url">\n						' +
    __e( rendered.baseUrl ) +
    '\n						<span class="editable-preview__value--facebook-author"></span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit">' +
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
     if (id) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if (labelClassName) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>\n	' +
    __e( title ) +
    '\n	<input type="text"\n		';
     if (value) {
    __p += 'value="' +
    __e( value ) +
    '"';
     }
    __p += '\n		';
     if (placeholder) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		';
     if (className) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		';
     if (id) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		';
     if (name) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	/>\n</label>\n';

    }
    return __p
  };

  templates['fields']['textarea'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<label';
     if (id) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if (labelClassName) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>\n	' +
    __e( title ) +
    '\n	<textarea\n\n		   ';
     if (placeholder) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		   ';
     if (className) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		   ';
     if (id) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		   ';
     if (name) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	>\n		';
     if (value) {
    __p +=
    __e( value );
     }
    __p += '\n	</textarea>\n</label>\n';

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
    __p += '<div class="editable-preview editable-preview--twitter">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--twitter">\n		<div class="social-preview__inner social-preview__inner--twitter">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--twitter snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--twitter">\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__title--twitter snippet_container" >\n					<div class="editable-preview__value editable-preview__value--twitter-title ">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__description--twitter twitter-preview__description snippet_container">\n					<div class="editable-preview__value editable-preview__value--twitter-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--twitter snippet_container">\n					<div class="editable-preview__value ">\n						' +
    __e( rendered.baseUrl ) +
    '\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit">' +
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

},{}],173:[function(require,module,exports){
"use strict";

/* jshint browser: true */

var isElement = require("lodash/lang/isElement");
var clone = require("lodash/lang/clone");
var defaultsDeep = require("lodash/object/defaultsDeep");

var Jed = require("jed");

var renderDescription = require("./helpers/renderDescription");
var imagePlaceholder = require("./element/imagePlaceholder");
var bemAddModifier = require("./helpers/bem/addModifier");
var bemRemoveModifier = require("./helpers/bem/removeModifier");

var TextField = require("./inputs/textInput");
var TextArea = require("./inputs/textarea");

var InputElement = require("./element/input");
var PreviewEvents = require("./preview/events");

var twitterEditorTemplate = require("./templates").twitterPreview;

var twitterDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function updateSocialPreview() {},
		modifyTitle: function modifyTitle(title) {
			return title;
		},
		modifyDescription: function modifyDescription(description) {
			return description;
		},
		modifyImageUrl: function modifyImageUrl(imageUrl) {
			return imageUrl;
		}
	}
};

var inputTwitterPreviewBindings = [{
	"preview": "editable-preview__title--twitter",
	"inputField": "title"
}, {
	"preview": "editable-preview__image--twitter",
	"inputField": "imageUrl"
}, {
	"preview": "editable-preview__description--twitter",
	"inputField": "description"
}];

var WIDTH_TWITTER_IMAGE_SMALL = 120;
var WIDTH_TWITTER_IMAGE_LARGE = 506;
var TWITTER_IMAGE_THRESHOLD_WIDTH = 280;
var TWITTER_IMAGE_THRESHOLD_HEIGHT = 150;

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
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in twitter.
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
 * @property {HTMLElement} element.rendered.description   - The rendered twitter description element.
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
var TwitterPreview = function TwitterPreview(opts, i18n) {
	this.i18n = i18n || this.constructI18n();

	twitterDefaults.placeholder = {
		title: this.i18n.dgettext("yoast-social-previews", "This is an example title - edit by clicking here"),
		description: this.i18n.sprintf(
		/** translators: %1$s expands to Twitter */
		this.i18n.dgettext("yoast-social-previews", "Modify your %1$s description by editing it right here"), "Twitter"),
		imageUrl: ""
	};

	defaultsDeep(opts, twitterDefaults);

	if (!isElement(opts.targetElement)) {
		throw new Error("The Twitter preview requires a valid target element");
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
TwitterPreview.prototype.constructI18n = function (translations) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
	};

	translations = translations || {};

	defaultsDeep(translations, defaultTranslations);

	return new Jed(translations);
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
TwitterPreview.prototype.init = function () {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderTemplate = function () {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = twitterEditorTemplate({
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Twitter */
			edit: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "Edit %1$s preview"), "Twitter"),
			/** translators: %1$s expands to Twitter */
			snippetPreview: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s preview"), "Twitter"),
			/** translators: %1$s expands to Twitter */
			snippetEditor: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s editor"), "Twitter")
		}
	});

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName("editable-preview__value--twitter-title")[0],
			description: targetElement.getElementsByClassName("editable-preview__value--twitter-description")[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName("editable-preview--twitter")[0],
		formContainer: targetElement.getElementsByClassName("snippet-editor__form")[0],
		editToggle: targetElement.getElementsByClassName("snippet-editor__edit-button")[0],
		closeEditor: targetElement.getElementsByClassName("snippet-editor__submit")[0],
		formFields: targetElement.getElementsByClassName("snippet-editor__form-field"),
		headingEditor: targetElement.getElementsByClassName("snippet-editor__heading-editor")[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render() + this.element.fields.title.render() + this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName("js-snippet-editor-title")[0],
		imageUrl: targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0],
		description: targetElement.getElementsByClassName("js-snippet-editor-description")[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName("snippet-editor__submit")[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName("editable-preview__image--twitter")[0],
		description: this.element.rendered.description.parentNode
	};
};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
TwitterPreview.prototype.getFields = function () {
	return {
		title: new TextField({
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "twitter-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s title"), "Twitter"),
			labelClassName: "snippet-editor__label"
		}),
		description: new TextArea({
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "twitter-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s description"), "Twitter"),
			labelClassName: "snippet-editor__label"
		}),
		imageUrl: new TextField({
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "twitter-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s image"), "Twitter"),
			labelClassName: "snippet-editor__label"
		})
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field element.
 */
TwitterPreview.prototype.getFieldElements = function () {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-title")[0], {
			currentValue: this.data.title,
			defaultValue: this.opts.defaultValue.title,
			placeholder: this.opts.placeholder.title,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s title by editing the snippet below."), "Twitter")
		}, this.updatePreview.bind(this)),
		description: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-description")[0], {
			currentValue: this.data.description,
			defaultValue: this.opts.defaultValue.description,
			placeholder: this.opts.placeholder.description,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s description by editing the snippet below."), "Twitter")
		}, this.updatePreview.bind(this)),
		imageUrl: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0], {
			currentValue: this.data.imageUrl,
			defaultValue: this.opts.defaultValue.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			fallback: ""
		}, this.updatePreview.bind(this))
	};
};

/**
 * Updates the twitter preview.
 */
TwitterPreview.prototype.updatePreview = function () {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle(this.element.fieldElements.title.getValue());

	// Set the description field and parse the styling of it.
	this.setDescription(this.element.fieldElements.description.getValue());

	// Sets the Image URL
	this.setImage(this.data.imageUrl);

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview(clone(this.data));
};

/**
 * Sets the preview title.
 *
 * @param {string} title The new title.
 */
TwitterPreview.prototype.setTitle = function (title) {
	title = this.opts.callbacks.modifyTitle(title);

	this.element.rendered.title.innerHTML = title;
};

/**
 * Set the preview description.
 *
 * @param {string} description The description to set.
 */
TwitterPreview.prototype.setDescription = function (description) {
	description = this.opts.callbacks.modifyDescription(description);

	this.element.rendered.description.innerHTML = description;
	renderDescription(this.element.rendered.description, this.element.fieldElements.description.getInputValue());
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
TwitterPreview.prototype.getImageContainer = function () {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 */
TwitterPreview.prototype.setImage = function (imageUrl) {
	imageUrl = this.opts.callbacks.modifyImageUrl(imageUrl);

	if (imageUrl === "" && this.data.imageUrl === "") {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();

		return;
	}

	var img = new Image();

	img.onload = function () {
		if (this.isTooSmallImage(img)) {
			this.removeImageFromContainer();
			this.removeImageClasses();
			this.setPlaceHolder();

			return;
		}

		this.setSizingClass(img);
		this.addImageToContainer(imageUrl);
	}.bind(this);

	img.onerror = function () {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();
	}.bind(this);

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Sets the image of the image container.
 * @param {string} image The image to use.
 */
TwitterPreview.prototype.addImageToContainer = function (image) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
TwitterPreview.prototype.removeImageFromContainer = function () {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setSizingClass = function (img) {
	this.removeImageClasses();

	if (this.isSmallImage(img)) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated max width.
 */
TwitterPreview.prototype.getMaxImageWidth = function (img) {
	if (this.isSmallImage(img)) {
		return WIDTH_TWITTER_IMAGE_SMALL;
	}

	return WIDTH_TWITTER_IMAGE_LARGE;
};
/**
 * Sets the default twitter placeholder
 */
TwitterPreview.prototype.setPlaceHolder = function () {
	this.setSmallImageClasses();

	imagePlaceholder(this.element.preview.imageUrl, "", false, "twitter");
};

/**
 * Detects if the twitter preview should switch to small image mode
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
TwitterPreview.prototype.isSmallImage = function (image) {
	return image.width < TWITTER_IMAGE_THRESHOLD_WIDTH || image.height < TWITTER_IMAGE_THRESHOLD_HEIGHT;
};

/**
 * Detects if the twitter preview image is too small
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
TwitterPreview.prototype.isTooSmallImage = function (image) {
	return image.width < WIDTH_TWITTER_IMAGE_SMALL || image.height < WIDTH_TWITTER_IMAGE_SMALL;
};

/**
 * Sets the classes on the facebook preview so that it will display a small facebook image preview
 */
TwitterPreview.prototype.setSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("twitter-small", "social-preview__inner", targetElement);
	bemAddModifier("twitter-small", "editable-preview__image--twitter", targetElement);
	bemAddModifier("twitter-small", "editable-preview__text-keeper--twitter", targetElement);
};

TwitterPreview.prototype.removeSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("twitter-small", "social-preview__inner", targetElement);
	bemRemoveModifier("twitter-small", "editable-preview__image--twitter", targetElement);
	bemRemoveModifier("twitter-small", "editable-preview__text-keeper--twitter", targetElement);
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
TwitterPreview.prototype.setLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("twitter-large", "social-preview__inner", targetElement);
	bemAddModifier("twitter-large", "editable-preview__image--twitter", targetElement);
	bemAddModifier("twitter-large", "editable-preview__text-keeper--twitter", targetElement);
};

TwitterPreview.prototype.removeLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("twitter-large", "social-preview__inner", targetElement);
	bemRemoveModifier("twitter-large", "editable-preview__image--twitter", targetElement);
	bemRemoveModifier("twitter-large", "editable-preview__text-keeper--twitter", targetElement);
};

/**
 * Removes all image classes.
 */
TwitterPreview.prototype.removeImageClasses = function () {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
TwitterPreview.prototype.bindEvents = function () {
	var previewEvents = new PreviewEvents(inputTwitterPreviewBindings, this.element, true);
	previewEvents.bindEvents(this.element.editToggle, this.element.closeEditor);
};

module.exports = TwitterPreview;

},{"./element/imagePlaceholder":157,"./element/input":158,"./helpers/bem/addModifier":161,"./helpers/bem/removeModifier":163,"./helpers/renderDescription":167,"./inputs/textInput":169,"./inputs/textarea":170,"./preview/events":171,"./templates":172,"jed":174,"lodash/lang/clone":213,"lodash/lang/isElement":216,"lodash/object/defaultsDeep":227}],174:[function(require,module,exports){
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton
WTFPL license for use
Dojo CLA for contributions

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
      define('jed', function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);

},{}],175:[function(require,module,exports){
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

},{"../internal/arrayEach":180,"../internal/baseEach":186,"../internal/createForEach":199}],176:[function(require,module,exports){
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

},{"../internal/getNative":201}],177:[function(require,module,exports){
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

},{"../date/now":176,"../lang/isObject":220}],178:[function(require,module,exports){
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

},{}],179:[function(require,module,exports){
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

},{}],180:[function(require,module,exports){
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

},{}],181:[function(require,module,exports){
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

},{}],182:[function(require,module,exports){
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

},{"../object/keys":228}],183:[function(require,module,exports){
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

},{"../object/keys":228,"./baseCopy":185}],184:[function(require,module,exports){
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

},{"../lang/isArray":215,"../lang/isObject":220,"./arrayCopy":179,"./arrayEach":180,"./baseAssign":183,"./baseForOwn":189,"./initCloneArray":202,"./initCloneByTag":203,"./initCloneObject":204}],185:[function(require,module,exports){
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

},{}],186:[function(require,module,exports){
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

},{"./baseForOwn":189,"./createBaseEach":196}],187:[function(require,module,exports){
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

},{"./createBaseFor":197}],188:[function(require,module,exports){
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

},{"../object/keysIn":229,"./baseFor":187}],189:[function(require,module,exports){
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

},{"../object/keys":228,"./baseFor":187}],190:[function(require,module,exports){
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

},{"../lang/isArray":215,"../lang/isObject":220,"../lang/isTypedArray":223,"../object/keys":228,"./arrayEach":180,"./baseMergeDeep":191,"./isArrayLike":205,"./isObjectLike":209}],191:[function(require,module,exports){
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

},{"../lang/isArguments":214,"../lang/isArray":215,"../lang/isPlainObject":221,"../lang/isTypedArray":223,"../lang/toPlainObject":224,"./arrayCopy":179,"./isArrayLike":205}],192:[function(require,module,exports){
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

},{}],193:[function(require,module,exports){
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

},{"../utility/identity":231}],194:[function(require,module,exports){
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

},{}],195:[function(require,module,exports){
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

},{"../function/restParam":178,"./bindCallback":193,"./isIterateeCall":207}],196:[function(require,module,exports){
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

},{"./getLength":200,"./isLength":208,"./toObject":212}],197:[function(require,module,exports){
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

},{"./toObject":212}],198:[function(require,module,exports){
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

},{"../function/restParam":178}],199:[function(require,module,exports){
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

},{"../lang/isArray":215,"./bindCallback":193}],200:[function(require,module,exports){
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

},{"./baseProperty":192}],201:[function(require,module,exports){
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

},{"../lang/isNative":219}],202:[function(require,module,exports){
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

},{}],203:[function(require,module,exports){
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

},{"./bufferClone":194}],204:[function(require,module,exports){
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

},{}],205:[function(require,module,exports){
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

},{"./getLength":200,"./isLength":208}],206:[function(require,module,exports){
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

},{}],207:[function(require,module,exports){
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

},{"../lang/isObject":220,"./isArrayLike":205,"./isIndex":206}],208:[function(require,module,exports){
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

},{}],209:[function(require,module,exports){
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

},{}],210:[function(require,module,exports){
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

},{"../object/merge":230}],211:[function(require,module,exports){
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

},{"../lang/isArguments":214,"../lang/isArray":215,"../object/keysIn":229,"./isIndex":206,"./isLength":208}],212:[function(require,module,exports){
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

},{"../lang/isObject":220}],213:[function(require,module,exports){
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

},{"../internal/baseClone":184,"../internal/bindCallback":193,"../internal/isIterateeCall":207}],214:[function(require,module,exports){
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

},{"../internal/isArrayLike":205,"../internal/isObjectLike":209}],215:[function(require,module,exports){
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

},{"../internal/getNative":201,"../internal/isLength":208,"../internal/isObjectLike":209}],216:[function(require,module,exports){
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

},{"../internal/isObjectLike":209,"./isPlainObject":221}],217:[function(require,module,exports){
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

},{"../internal/isArrayLike":205,"../internal/isObjectLike":209,"../object/keys":228,"./isArguments":214,"./isArray":215,"./isFunction":218,"./isString":222}],218:[function(require,module,exports){
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

},{"./isObject":220}],219:[function(require,module,exports){
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

},{"../internal/isObjectLike":209,"./isFunction":218}],220:[function(require,module,exports){
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

},{}],221:[function(require,module,exports){
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

},{"../internal/baseForIn":188,"../internal/isObjectLike":209,"./isArguments":214}],222:[function(require,module,exports){
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

},{"../internal/isObjectLike":209}],223:[function(require,module,exports){
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

},{"../internal/isLength":208,"../internal/isObjectLike":209}],224:[function(require,module,exports){
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

},{"../internal/baseCopy":185,"../object/keysIn":229}],225:[function(require,module,exports){
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

},{"../internal/assignWith":182,"../internal/baseAssign":183,"../internal/createAssigner":195}],226:[function(require,module,exports){
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

},{"../internal/assignDefaults":181,"../internal/createDefaults":198,"./assign":225}],227:[function(require,module,exports){
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

},{"../internal/createDefaults":198,"../internal/mergeDefaults":210,"./merge":230}],228:[function(require,module,exports){
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

},{"../internal/getNative":201,"../internal/isArrayLike":205,"../internal/shimKeys":211,"../lang/isObject":220}],229:[function(require,module,exports){
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

},{"../internal/isIndex":206,"../internal/isLength":208,"../lang/isArguments":214,"../lang/isArray":215,"../lang/isObject":220}],230:[function(require,module,exports){
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

},{"../internal/baseMerge":190,"../internal/createAssigner":195}],231:[function(require,module,exports){
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

},{}],232:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":233}],233:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {

	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlci5qcyIsIi4uL2pzL3NyYy9hbmFseXNpcy9nZXRMMTBuT2JqZWN0LmpzIiwiLi4vanMvc3JjL2FuYWx5c2lzL2dldFRpdGxlUGxhY2Vob2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVW5kZWZpbmVkLmpzIiwiYXNzZXRzL2pzL3NyYy9oZWxwUGFuZWwuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LXByZW1pdW0tc29jaWFsLXByZXZpZXcuanMiLCJub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fSGFzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZE1hcEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYWRkU2V0RW50cnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFBhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZURhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVJlZ0V4cC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNTdHJpY3RDb21wYXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tZW1vaXplQ2FwcGVkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUFkZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2Nsb25lLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL21hdGNoU3RyaW5nV2l0aFJlZ2V4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2luZGV4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9lbGVtZW50L2lucHV0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2ZhY2Vib29rUHJldmlldy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2FkZENsYXNzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyVG9DbGFzcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2ltYWdlRGlzcGxheU1vZGUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9taW5pbWl6ZUh0bWwuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW1vdmVDbGFzcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL3JlbmRlckRlc2NyaXB0aW9uLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy9pbnB1dEZpZWxkLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0SW5wdXQuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL3RleHRhcmVhLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3ByZXZpZXcvZXZlbnRzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3RlbXBsYXRlcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy90d2l0dGVyUHJldmlldy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbGxlY3Rpb24vZm9yRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2RhdGUvbm93LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnVuY3Rpb24vZGVib3VuY2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9mdW5jdGlvbi9yZXN0UGFyYW0uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUNvcHkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUVhY2guanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25EZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbldpdGguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQXNzaWduLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNsb25lLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VGb3IuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9ySW4uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9yT3duLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlRGVlcC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VQcm9wZXJ0eS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2JpbmRDYWxsYmFjay5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2J1ZmZlckNsb25lLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQXNzaWduZXIuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVCYXNlRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VGb3IuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUZvckVhY2guanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXROYXRpdmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pbml0Q2xvbmVBcnJheS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUJ5VGFnLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaW5pdENsb25lT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNBcnJheUxpa2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0luZGV4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0xlbmd0aC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL21lcmdlRGVmYXVsdHMuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9zaGltS2V5cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3RvT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9jbG9uZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNBcmd1bWVudHMuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzRWxlbWVudC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNFbXB0eS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNGdW5jdGlvbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNOYXRpdmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1BsYWluT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1N0cmluZy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNUeXBlZEFycmF5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy90b1BsYWluT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2Fzc2lnbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXAuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9rZXlzSW4uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3QvbWVyZ2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC91dGlsaXR5L2lkZW50aXR5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZ0JBQWdCLFFBQVMsaUJBQVQsQ0FBcEI7O0FBRUE7Ozs7O0FBS0EsU0FBUyx5QkFBVCxHQUFxQztBQUNwQyxLQUFJLHlCQUF5QixFQUE3QjtBQUNBLEtBQUksYUFBYSxlQUFqQjs7QUFFQSxLQUFLLFVBQUwsRUFBa0I7QUFDakIsMkJBQXlCLFdBQVcsaUJBQXBDO0FBQ0E7O0FBRUQsUUFBTyxzQkFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQix5QkFBakI7Ozs7O0FDbEJBLElBQUksY0FBYyxRQUFTLG9CQUFULENBQWxCOztBQUVBOzs7OztBQUtBLFNBQVMsYUFBVCxHQUF5QjtBQUN4QixLQUFJLGFBQWEsSUFBakI7O0FBRUEsS0FBSyxDQUFFLFlBQWEsT0FBTyxvQkFBcEIsQ0FBUCxFQUFvRDtBQUNuRCxlQUFhLE9BQU8sb0JBQXBCO0FBQ0EsRUFGRCxNQUVPLElBQUssQ0FBRSxZQUFhLE9BQU8sb0JBQXBCLENBQVAsRUFBb0Q7QUFDMUQsZUFBYSxPQUFPLG9CQUFwQjtBQUNBOztBQUVELFFBQU8sVUFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7Ozs7QUNuQkEsSUFBSSxnQkFBZ0IsUUFBUyxpQkFBVCxDQUFwQjs7QUFFQTs7Ozs7QUFLQSxTQUFTLG1CQUFULEdBQStCO0FBQzlC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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2V0TDEwbk9iamVjdCA9IHJlcXVpcmUoIFwiLi9nZXRMMTBuT2JqZWN0XCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZXNjcmlwdGlvbiBwbGFjZWhvbGRlciBmb3IgdXNlIGluIHRoZSBkZXNjcmlwdGlvbiBmb3Jtcy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGVzY3JpcHRpb24gcGxhY2Vob2xkZXIuXG4gKi9cbmZ1bmN0aW9uIGdldERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKSB7XG5cdHZhciBkZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gXCJcIjtcblx0dmFyIGwxMG5PYmplY3QgPSBnZXRMMTBuT2JqZWN0KCk7XG5cblx0aWYgKCBsMTBuT2JqZWN0ICkge1xuXHRcdGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBsMTBuT2JqZWN0Lm1ldGFkZXNjX3RlbXBsYXRlO1xuXHR9XG5cblx0cmV0dXJuIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBsMTBuIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFnZSwgZWl0aGVyIHRlcm0gb3IgcG9zdC5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbDEwbiBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGdldEwxMG5PYmplY3QoKSB7XG5cdHZhciBsMTBuT2JqZWN0ID0gbnVsbDtcblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIHdpbmRvdy53cHNlb1Bvc3RTY3JhcGVyTDEwbiApICkge1xuXHRcdGwxMG5PYmplY3QgPSB3aW5kb3cud3BzZW9Qb3N0U2NyYXBlckwxMG47XG5cdH0gZWxzZSBpZiAoICEgaXNVbmRlZmluZWQoIHdpbmRvdy53cHNlb1Rlcm1TY3JhcGVyTDEwbiApICkge1xuXHRcdGwxMG5PYmplY3QgPSB3aW5kb3cud3BzZW9UZXJtU2NyYXBlckwxMG47XG5cdH1cblxuXHRyZXR1cm4gbDEwbk9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMMTBuT2JqZWN0O1xuIiwidmFyIGdldEwxMG5PYmplY3QgPSByZXF1aXJlKCBcIi4vZ2V0TDEwbk9iamVjdFwiICk7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGl0bGUgcGxhY2Vob2xkZXIgZm9yIHVzZSBpbiB0aGUgdGl0bGUgZm9ybXMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRpdGxlIHBsYWNlaG9sZGVyLlxuICovXG5mdW5jdGlvbiBnZXRUaXRsZVBsYWNlaG9sZGVyKCkge1xuXHR2YXIgdGl0bGVQbGFjZWhvbGRlciA9IFwiXCI7XG5cdHZhciBsMTBuT2JqZWN0ID0gZ2V0TDEwbk9iamVjdCgpO1xuXG5cdGlmICggbDEwbk9iamVjdCApIHtcblx0XHR0aXRsZVBsYWNlaG9sZGVyID0gbDEwbk9iamVjdC50aXRsZV90ZW1wbGF0ZTtcblx0fVxuXG5cdGlmICggdGl0bGVQbGFjZWhvbGRlciA9PT0gXCJcIiApIHtcblx0XHR0aXRsZVBsYWNlaG9sZGVyID0gXCIlJXRpdGxlJSUgLSAlJXNpdGVuYW1lJSVcIjtcblx0fVxuXG5cdHJldHVybiB0aXRsZVBsYWNlaG9sZGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRpdGxlUGxhY2Vob2xkZXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNVbmRlZmluZWQ7XG4iLCIvKiBqc2hpbnQgLVcwOTcgKi9cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBIVE1MIGZvciBhIGhlbHAgYnV0dG9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcHV0IGluIHRoZSBidXR0b24uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udHJvbHMgVGhlIEhUTUwgSUQgb2YgdGhlIGVsZW1lbnQgdGhpcyBidXR0b24gY29udHJvbHMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gR2VuZXJhdGVkIEhUTUwuXG4gKi9cbmZ1bmN0aW9uIGhlbHBCdXR0b24oIHRleHQsIGNvbnRyb2xzICkge1xuXHRyZXR1cm4gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwieW9hc3RfaGVscCB5b2FzdC1oZWxwLWJ1dHRvbiBkYXNoaWNvbnNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiAnICtcblx0XHQnYXJpYS1jb250cm9scz1cIicgKyBjb250cm9scyArICdcIj48c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj48L2J1dHRvbj4nO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIEhUTUwgZm9yIGEgaGVscCBidXR0b25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBwdXQgaW4gdGhlIGJ1dHRvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSFRNTCBJRCB0byBnaXZlIHRoaXMgYnV0dG9uLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBnZW5lcmF0ZWQgSFRNbC5cbiAqL1xuZnVuY3Rpb24gaGVscFRleHQoIHRleHQsIGlkICkge1xuXHRyZXR1cm4gJzxwIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwieW9hc3QtaGVscC1wYW5lbFwiPicgKyB0ZXh0ICsgJzwvcD4nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aGVscEJ1dHRvbjogaGVscEJ1dHRvbixcblx0aGVscFRleHQ6IGhlbHBUZXh0LFxufTtcbiIsIi8qIGdsb2JhbCB5b2FzdFNvY2lhbFByZXZpZXcsIHRpbnlNQ0UsIHJlcXVpcmUsIHdwLCBZb2FzdFNFTywgYWpheHVybCAgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuXG52YXIgZ2V0SW1hZ2VzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2ltYWdlSW5UZXh0XCIgKTtcbnZhciBoZWxwUGFuZWwgPSByZXF1aXJlKCBcIi4vaGVscFBhbmVsXCIgKTtcbnZhciBnZXRUaXRsZVBsYWNlaG9sZGVyID0gcmVxdWlyZSggXCIuLi8uLi8uLi8uLi9qcy9zcmMvYW5hbHlzaXMvZ2V0VGl0bGVQbGFjZWhvbGRlclwiICk7XG52YXIgZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IHJlcXVpcmUoIFwiLi4vLi4vLi4vLi4vanMvc3JjL2FuYWx5c2lzL2dldERlc2NyaXB0aW9uUGxhY2Vob2xkZXJcIiApO1xuXG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9jbG9uZVwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIF9oYXMgPSByZXF1aXJlKCBcImxvZGFzaC9oYXNcIiApO1xudmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xuXG52YXIgSmVkID0gcmVxdWlyZSggXCJqZWRcIiApO1xudmFyIHNvY2lhbFByZXZpZXdzID0gcmVxdWlyZSggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiApO1xuXG4oIGZ1bmN0aW9uKCAkICkge1xuXHQvKipcblx0ICogV2Ugd2FudCB0byBzdG9yZSB0aGUgZmFsbGJhY2tzIGluIGFuIG9iamVjdCwgdG8gaGF2ZSBkaXJlY3RseSBhY2Nlc3MgdG8gdGhlbS5cblx0ICogQHR5cGUge3tjb250ZW50OiBzdHJpbmcsIGZlYXR1cmVkOiBzdHJpbmd9fVxuXHQgKi9cblx0dmFyIGltYWdlRmFsbEJhY2sgPSB7XG5cdFx0Y29udGVudDogXCJcIixcblx0XHRmZWF0dXJlZDogXCJcIixcblx0fTtcblxuXHR2YXIgY2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSB0cnVlO1xuXG5cdHZhciBGYWNlYm9va1ByZXZpZXcgPSBzb2NpYWxQcmV2aWV3cy5GYWNlYm9va1ByZXZpZXc7XG5cdHZhciBUd2l0dGVyUHJldmlldyA9IHNvY2lhbFByZXZpZXdzLlR3aXR0ZXJQcmV2aWV3O1xuXG5cdHZhciBmYWNlYm9va1ByZXZpZXcsIHR3aXR0ZXJQcmV2aWV3O1xuXG5cdHZhciB0cmFuc2xhdGlvbnMgPSB5b2FzdFNvY2lhbFByZXZpZXcuaTE4bjtcblxuXHR2YXIgaTE4biA9IG5ldyBKZWQoIGFkZExpYnJhcnlUcmFuc2xhdGlvbnMoIHRyYW5zbGF0aW9ucy5saWJyYXJ5ICkgKTtcblx0dmFyIGJpZ2dlckltYWdlcyA9IHt9O1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBldmVudHMgZm9yIG9wZW5pbmcgdGhlIFdQIG1lZGlhIGxpYnJhcnkgd2hlbiBwcmVzc2luZyB0aGUgYnV0dG9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VVcmwgVGhlIGltYWdlIFVSTCBvYmplY3QuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZUJ1dHRvbiBJRCBuYW1lIGZvciB0aGUgaW1hZ2UgYnV0dG9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3ZlQnV0dG9uIElEIG5hbWUgZm9yIHRoZSByZW1vdmUgYnV0dG9uLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbk1lZGlhU2VsZWN0IFRoZSBldmVudCB0aGF0IHdpbGwgYmUgcmFuIHdoZW4gaW1hZ2UgaXMgY2hvc2VuLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VQcmV2aWV3RWxlbWVudCBUaGUgaW1hZ2UgcHJldmlldyBlbGVtZW50IHRoYXQgY2FuIGJlIGNsaWNrZWQgdG8gdXBkYXRlIGFzIHdlbGwuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZFVwbG9hZEJ1dHRvbkV2ZW50cyggaW1hZ2VVcmwsIGltYWdlQnV0dG9uLCByZW1vdmVCdXR0b24sIG9uTWVkaWFTZWxlY3QsIGltYWdlUHJldmlld0VsZW1lbnQgKSB7XG5cdFx0dmFyIHNvY2lhbFByZXZpZXdVcGxvYWRlciA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoIHtcblx0XHRcdHRpdGxlOiB5b2FzdFNvY2lhbFByZXZpZXcuY2hvb3NlX2ltYWdlLFxuXHRcdFx0YnV0dG9uOiB7IHRleHQ6IHlvYXN0U29jaWFsUHJldmlldy5jaG9vc2VfaW1hZ2UgfSxcblx0XHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHR9ICk7XG5cblx0XHRzb2NpYWxQcmV2aWV3VXBsb2FkZXIub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGF0dGFjaG1lbnQgPSBzb2NpYWxQcmV2aWV3VXBsb2FkZXIuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLnRvSlNPTigpO1xuXG5cdFx0XHQvLyBTZXQgdGhlIGltYWdlIFVSTC5cblx0XHRcdGltYWdlVXJsLnZhbCggYXR0YWNobWVudC51cmwgKTtcblxuXHRcdFx0b25NZWRpYVNlbGVjdCgpO1xuXG5cdFx0XHQkKCByZW1vdmVCdXR0b24gKS5zaG93KCk7XG5cdFx0fSApO1xuXG5cdFx0JCggcmVtb3ZlQnV0dG9uICkuY2xpY2soIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Ly8gQ2xlYXIgdGhlIGltYWdlIFVSTFxuXHRcdFx0aW1hZ2VVcmwudmFsKCBcIlwiICk7XG5cblx0XHRcdG9uTWVkaWFTZWxlY3QoKTtcblxuXHRcdFx0JCggcmVtb3ZlQnV0dG9uICkuaGlkZSgpO1xuXHRcdH0gKTtcblxuXHRcdCQoIGltYWdlQnV0dG9uICkuY2xpY2soIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHNvY2lhbFByZXZpZXdVcGxvYWRlci5vcGVuKCk7XG5cdFx0fSApO1xuXG5cdFx0JCggaW1hZ2VQcmV2aWV3RWxlbWVudCApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCBldmVudE9iamVjdCApIHtcblx0XHRcdHNvY2lhbFByZXZpZXdVcGxvYWRlci5vcGVuKCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgdGhlIGNob29zZSBpbWFnZSBidXR0b24gYW5kIGhpZGVzIHRoZSBpbnB1dCBmaWVsZC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHByZXZpZXcgVGhlIHByZXZpZXcgdG8gYWRkIHRoZSB1cGxvYWQgYnV0dG9uIHRvLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFkZFVwbG9hZEJ1dHRvbiggcHJldmlldyApIHtcblx0XHRpZiAoIHR5cGVvZiB3cC5tZWRpYSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgaW1hZ2VVcmwgPSAkKCBwcmV2aWV3LmVsZW1lbnQuZm9ybUNvbnRhaW5lciApLmZpbmQoIFwiLmpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKTtcblxuXHRcdHZhciBidXR0b25EaXYgPSAkKCBcIjxkaXY+PC9kaXY+XCIgKTtcblx0XHRidXR0b25EaXYuaW5zZXJ0QWZ0ZXIoIGltYWdlVXJsICk7XG5cblx0XHR2YXIgdXBsb2FkQnV0dG9uVGV4dCA9IGdldFVwbG9hZEJ1dHRvblRleHQoIHByZXZpZXcgKTtcblxuXHRcdHZhciBpbWFnZUZpZWxkSWQgICAgPSBqUXVlcnkoIGltYWdlVXJsICkuYXR0ciggXCJpZFwiICk7XG5cdFx0dmFyIGltYWdlQnV0dG9uSWQgICA9IGltYWdlRmllbGRJZCArIFwiX2J1dHRvblwiO1xuXHRcdHZhciBpbWFnZUJ1dHRvbkh0bWwgPSAnPGJ1dHRvbiBpZD1cIicgKyBpbWFnZUJ1dHRvbklkICsgJ1wiICcgK1xuXHRcdFx0J2NsYXNzPVwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHdwc2VvX3ByZXZpZXdfaW1hZ2VfdXBsb2FkX2J1dHRvblwiIHR5cGU9XCJidXR0b25cIj4nICsgdXBsb2FkQnV0dG9uVGV4dCArICc8L2J1dHRvbj4nO1xuXG5cdFx0dmFyIHJlbW92ZUJ1dHRvbklkICAgPSBpbWFnZUZpZWxkSWQgKyBcIl9yZW1vdmVfYnV0dG9uXCI7XG5cdFx0dmFyIHJlbW92ZUJ1dHRvbkh0bWwgPSAnPGJ1dHRvbiBpZD1cIicgKyByZW1vdmVCdXR0b25JZCArICdcIiB0eXBlPVwiYnV0dG9uXCIgJyArXG5cdFx0XHQnY2xhc3M9XCJidXR0b24gd3BzZW9fcHJldmlld19pbWFnZV91cGxvYWRfYnV0dG9uXCI+JyArIHlvYXN0U29jaWFsUHJldmlldy5yZW1vdmVJbWFnZUJ1dHRvbiArICc8L2J1dHRvbj4nO1xuXG5cdFx0JCggYnV0dG9uRGl2ICkuYXBwZW5kKCBpbWFnZUJ1dHRvbkh0bWwgKTtcblx0XHQkKCBidXR0b25EaXYgKS5hcHBlbmQoIHJlbW92ZUJ1dHRvbkh0bWwgKTtcblxuXHRcdGltYWdlVXJsLmhpZGUoKTtcblx0XHRpZiAoIGltYWdlVXJsLnZhbCgpID09PSBcIlwiICkge1xuXHRcdFx0JCggXCIjXCIgKyByZW1vdmVCdXR0b25JZCApLmhpZGUoKTtcblx0XHR9XG5cblx0XHRiaW5kVXBsb2FkQnV0dG9uRXZlbnRzKFxuXHRcdFx0aW1hZ2VVcmwsXG5cdFx0XHRcIiNcIiArIGltYWdlQnV0dG9uSWQsXG5cdFx0XHRcIiNcIiArIHJlbW92ZUJ1dHRvbklkLFxuXHRcdFx0cHJldmlldy51cGRhdGVQcmV2aWV3LmJpbmQoIHByZXZpZXcgKSxcblx0XHRcdCQoIHByZXZpZXcuZWxlbWVudC5jb250YWluZXIgKS5maW5kKCBcIi5lZGl0YWJsZS1wcmV2aWV3X19pbWFnZVwiIClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHR5cGUgb2YgdGhlIGN1cnJlbnQgcGFnZTogcG9zdCBvciB0ZXJtLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY3VycmVudCB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFR5cGUoKSB7XG5cdFx0Ly8gV2hlbiB0aGlzIGZpZWxkIGV4aXN0cywgaXQgaXMgYSBwb3N0LlxuXHRcdGlmICggJCggXCIjcG9zdF9JRFwiICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybiBcInBvc3RcIjtcblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoaXMgZmllbGQgaXMgZm91bmQsIGl0IGlzIGEgdGVybS5cblx0XHRpZiAoICQoIFwiaW5wdXRbbmFtZT10YWdfSURdXCIgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuIFwidGVybVwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByZWZpeCBmb3IgdGhlIGZpZWxkcywgYmVjYXVzZSBvZiB0aGUgZmllbGRzIGZvciB0aGUgcG9zdCBkbyBoYXZlIGFuIG90aGVyZSBwcmVmaXggdGhhbiB0aGUgb25lcyBmb3Jcblx0ICogYSB0YXhvbm9teS5cblx0ICpcblx0ICogQHJldHVybnMgeyp9IFRoZSBwcmVmaXggdG8gdXNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZmllbGRQcmVmaXgoKSB7XG5cdFx0c3dpdGNoKCBnZXRDdXJyZW50VHlwZSgpICkge1xuXHRcdFx0Y2FzZSBcInBvc3RcIjpcblx0XHRcdFx0cmV0dXJuIFwieW9hc3Rfd3BzZW9cIjtcblx0XHRcdGNhc2UgXCJ0ZXJtXCI6XG5cdFx0XHRcdHJldHVybiBcIndwc2VvXCI7XG5cdFx0XHRkZWZhdWx0IDpcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHRpbnltY2UgYW5kIHRleHRhcmVhIGZpZWxkcy5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIG5hbWUgZm9yIHRoZSBjb250ZW50IGZpZWxkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29udGVudFRleHROYW1lKCkge1xuXHRcdHN3aXRjaCAoIGdldEN1cnJlbnRUeXBlKCkgKSB7XG5cdFx0XHRjYXNlIFwicG9zdFwiIDpcblx0XHRcdFx0cmV0dXJuIFwiY29udGVudFwiO1xuXHRcdFx0Y2FzZSBcInRlcm1cIiA6XG5cdFx0XHRcdHJldHVybiBcImRlc2NyaXB0aW9uXCI7XG5cdFx0XHRkZWZhdWx0IDpcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIHNvY2lhbCBwcmV2aWV3IGNvbnRhaW5lciBhbmQgaGlkZXMgdGhlIG9sZCBmb3JtIHRhYmxlLCB0byByZXBsYWNlIGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc29jaWFsUHJldmlld2hvbGRlciBUaGUgaG9sZGVyIGVsZW1lbnQgd2hlcmUgdGhlIGNvbnRhaW5lciB3aWxsIGJlIGFwcGVuZCB0by5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbnRhaW5lcklkIFRoZSBpZCB0aGUgY29udGFpbmVyIHdpbGwgZ2V0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU29jaWFsUHJldmlld0NvbnRhaW5lciggc29jaWFsUHJldmlld2hvbGRlciwgY29udGFpbmVySWQgKSB7XG5cdFx0c29jaWFsUHJldmlld2hvbGRlci5hcHBlbmQoICc8ZGl2IGlkPVwiJyArIGNvbnRhaW5lcklkICsgJ1wiPjwvZGl2PicgKTtcblx0XHRzb2NpYWxQcmV2aWV3aG9sZGVyLmZpbmQoIFwiLmZvcm0tdGFibGVcIiApLmhpZGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBtZXRhIGRlc2NyaXB0aW9uIGZyb20gdGhlIHNuaXBwZXQgZWRpdG9yXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0TWV0YURlc2NyaXB0aW9uKCkge1xuXHRcdHJldHVybiAkKCBcIiN5b2FzdF93cHNlb19tZXRhZGVzY1wiICkudmFsKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcGxhY2Vob2xkZXIgZm9yIHRoZSBtZXRhIGRlc2NyaXB0aW9uIGZpZWxkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcGxhY2Vob2xkZXIgZm9yIHRoZSBtZXRhIGRlc2NyaXB0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U29jaWFsRGVzY3JpcHRpb25QbGFjZWhvbGRlcigpIHtcblx0XHR2YXIgZGVzY3JpcHRpb24gPSBnZXRNZXRhRGVzY3JpcHRpb24oKTtcblxuXHRcdGlmICggXCJcIiA9PT0gZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRkZXNjcmlwdGlvbiA9IGdldERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYXJndW1lbnRzIGZvciB0aGUgc29jaWFsIHByZXZpZXcgcHJvdG90eXBlcy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldEVsZW1lbnQgVGhlIGVsZW1lbnQgd2hlcmUgdGhlIHByZXZpZXcgaXMgbG9hZGVkLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZmllbGRQcmVmaXggVGhlIHByZWZpeCBlYWNoIGZvcm0gZWxlbWVudCBoYXMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHsge1xuXHQgKiBcdFx0dGFyZ2V0RWxlbWVudDogRWxlbWVudCxcblx0ICpcdFx0ZGF0YToge3RpdGxlOiAqLCBkZXNjcmlwdGlvbjogKiwgaW1hZ2VVcmw6ICp9LFxuXHQgKiBcdFx0YmFzZVVSTDogKixcblx0ICogXHRcdGNhbGxiYWNrczoge3VwZGF0ZVNvY2lhbFByZXZpZXc6IGNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3fVxuXHQgKiB9IH0gVGhlIGFyZ3VtZW50cyBmb3IgdGhlIHNvY2lhbCBwcmV2aWV3LlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U29jaWFsUHJldmlld0FyZ3MoIHRhcmdldEVsZW1lbnQsIGZpZWxkUHJlZml4ICkge1xuXHRcdHZhciB0aXRsZVBsYWNlaG9sZGVyID0gZ2V0VGl0bGVQbGFjZWhvbGRlcigpO1xuXHRcdHZhciBkZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gZ2V0U29jaWFsRGVzY3JpcHRpb25QbGFjZWhvbGRlcigpO1xuXG5cdFx0dmFyIGFyZ3MgPSB7XG5cdFx0XHR0YXJnZXRFbGVtZW50OiAkKCB0YXJnZXRFbGVtZW50ICkuZ2V0KCAwICksXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHRpdGxlOiAkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItdGl0bGVcIiApLnZhbCgpLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogJCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWRlc2NyaXB0aW9uXCIgKS52YWwoKSxcblx0XHRcdFx0aW1hZ2VVcmw6ICQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1pbWFnZVwiICkudmFsKCksXG5cdFx0XHR9LFxuXHRcdFx0YmFzZVVSTDogeW9hc3RTb2NpYWxQcmV2aWV3LndlYnNpdGUsXG5cdFx0XHRjYWxsYmFja3M6IHtcblx0XHRcdFx0dXBkYXRlU29jaWFsUHJldmlldzogZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0JCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLXRpdGxlXCIgKS52YWwoIGRhdGEudGl0bGUgKTtcblx0XHRcdFx0XHQkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItZGVzY3JpcHRpb25cIiApLnZhbCggZGF0YS5kZXNjcmlwdGlvbiApO1xuXHRcdFx0XHRcdCQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1pbWFnZVwiICkudmFsKCBkYXRhLmltYWdlVXJsICk7XG5cblx0XHRcdFx0XHQvLyBNYWtlIHN1cmUgVHdpdHRlciBpcyB1cGRhdGVkIGlmIGEgRmFjZWJvb2sgaW1hZ2UgaXMgc2V0XG5cdFx0XHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cblx0XHRcdFx0XHRpZiAoIGRhdGEuaW1hZ2VVcmwgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYnV0dG9uUHJlZml4ID0gdGFyZ2V0RWxlbWVudC5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCBcIlByZXZpZXdcIiwgXCJcIiApO1xuXHRcdFx0XHRcdFx0c2V0VXBsb2FkQnV0dG9uVmFsdWUoIGJ1dHRvblByZWZpeCwgeW9hc3RTb2NpYWxQcmV2aWV3LnVzZU90aGVySW1hZ2UgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRqUXVlcnkoIHRhcmdldEVsZW1lbnQgKS5maW5kKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcInRpdGxlVXBkYXRlXCIgKTtcblx0XHRcdFx0XHRqUXVlcnkoIHRhcmdldEVsZW1lbnQgKS5maW5kKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcImRlc2NyaXB0aW9uVXBkYXRlXCIgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bW9kaWZ5SW1hZ2VVcmw6IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdFx0XHRpZiAoIGltYWdlVXJsID09PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0aW1hZ2VVcmwgPSBnZXRGYWxsYmFja0ltYWdlKCBcIlwiICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGltYWdlVXJsO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RpZnlUaXRsZTogZnVuY3Rpb24oIHRpdGxlICkge1xuXHRcdFx0XHRcdGlmICggZmllbGRQcmVmaXguaW5kZXhPZiggXCJ0d2l0dGVyXCIgKSA+IC0xICkge1xuXHRcdFx0XHRcdFx0aWYgKCB0aXRsZSA9PT0gJCggXCIjdHdpdHRlci1lZGl0b3ItdGl0bGVcIiApLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZmFjZWJvb2tUaXRsZSA9ICQoIFwiI2ZhY2Vib29rLWVkaXRvci10aXRsZVwiICkudmFsKCk7XG5cdFx0XHRcdFx0XHRcdGlmICggZmFjZWJvb2tUaXRsZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZSA9IGZhY2Vib29rVGl0bGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFlvYXN0U0VPLndwLnJlcGxhY2VWYXJzUGx1Z2luLnJlcGxhY2VWYXJpYWJsZXMoIHRpdGxlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRcdFx0aWYgKCBmaWVsZFByZWZpeC5pbmRleE9mKCBcInR3aXR0ZXJcIiApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGRlc2NyaXB0aW9uID09PSAkKCBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiICkuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmYWNlYm9va0Rlc2NyaXB0aW9uID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBmYWNlYm9va0Rlc2NyaXB0aW9uICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gZmFjZWJvb2tEZXNjcmlwdGlvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBpc1VuZGVmaW5lZCggZGVzY3JpcHRpb24gKSApe1xuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9ICQoICcjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb24nICkuYXR0ciggJ3BsYWNlaG9sZGVyJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBZb2FzdFNFTy53cC5yZXBsYWNlVmFyc1BsdWdpbi5yZXBsYWNlVmFyaWFibGVzKCBkZXNjcmlwdGlvbiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdHBsYWNlaG9sZGVyOiB7XG5cdFx0XHRcdHRpdGxlOiB0aXRsZVBsYWNlaG9sZGVyLFxuXHRcdFx0fSxcblx0XHRcdGRlZmF1bHRWYWx1ZToge1xuXHRcdFx0XHR0aXRsZTogdGl0bGVQbGFjZWhvbGRlcixcblx0XHRcdH0sXG5cdFx0fTtcblxuXHRcdGlmICggXCJcIiAhPT0gZGVzY3JpcHRpb25QbGFjZWhvbGRlciApIHtcblx0XHRcdGFyZ3MucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdFx0YXJncy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmdzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyeSB0byBnZXQgdGhlIEZhY2Vib29rIGF1dGhvciBuYW1lIHZpYSBBSkFYIGFuZCBwdXQgaXQgdG8gdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RmFjZWJvb2tQcmV2aWV3fSBmYWNlYm9va1ByZXZpZXcgVGhlIEZhY2Vib29rIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFjZWJvb2tBdXRob3IoIGZhY2Vib29rUHJldmlldyApIHtcblx0XHQkLmdldChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19nZXRfZmFjZWJvb2tfbmFtZVwiLFxuXHRcdFx0XHRfYWpheF9ub25jZTogeW9hc3RTb2NpYWxQcmV2aWV3LmZhY2Vib29rTm9uY2UsXG5cdFx0XHRcdHVzZXJfaWQ6ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKS52YWwoKSxcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggYXV0aG9yICkge1xuXHRcdFx0XHRpZiAoIGF1dGhvciAhPT0gMCApIHtcblx0XHRcdFx0XHRmYWNlYm9va1ByZXZpZXcuc2V0QXV0aG9yKCBhdXRob3IgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgRmFjZWJvb2sgcHJldmlldy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGZhY2Vib29rSG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdEZhY2Vib29rKCBmYWNlYm9va0hvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCBmYWNlYm9va0hvbGRlciwgXCJmYWNlYm9va1ByZXZpZXdcIiApO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3ID0gbmV3IEZhY2Vib29rUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCBmYWNlYm9va1ByZXZpZXdDb250YWluZXIsIGZpZWxkUHJlZml4KCkgKyBcIl9vcGVuZ3JhcGhcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImltYWdlVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0VXBsb2FkQnV0dG9uVmFsdWUoIFwiZmFjZWJvb2tcIiwgZ2V0VXBsb2FkQnV0dG9uVGV4dCggZmFjZWJvb2tQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggZmFjZWJvb2tQcmV2aWV3ICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZhY2Vib29rUHJldmlldy5pbml0KCk7XG5cblx0XHRhZGRVcGxvYWRCdXR0b24oIGZhY2Vib29rUHJldmlldyApO1xuXG5cdFx0dmFyIHBvc3RBdXRob3JEcm9wZG93biA9ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKTtcblx0XHRpZiggcG9zdEF1dGhvckRyb3Bkb3duLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24ub24oIFwiY2hhbmdlXCIsIGdldEZhY2Vib29rQXV0aG9yLmJpbmQoIHRoaXMsIGZhY2Vib29rUHJldmlldyApICk7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24udHJpZ2dlciggXCJjaGFuZ2VcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSB0d2l0dGVyIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0d2l0dGVySG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIHR3aXR0ZXIgcHJldmlldy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0VHdpdHRlciggdHdpdHRlckhvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCB0d2l0dGVySG9sZGVyLCBcInR3aXR0ZXJQcmV2aWV3XCIgKTtcblxuXHRcdHZhciB0d2l0dGVyUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI3R3aXR0ZXJQcmV2aWV3XCIgKTtcblx0XHR0d2l0dGVyUHJldmlldyA9IG5ldyBUd2l0dGVyUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCB0d2l0dGVyUHJldmlld0NvbnRhaW5lciwgZmllbGRQcmVmaXgoKSArIFwiX3R3aXR0ZXJcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHR0d2l0dGVyUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwiaW1hZ2VVcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggXCJ0d2l0dGVyXCIsIGdldFVwbG9hZEJ1dHRvblRleHQoIHR3aXR0ZXJQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggdHdpdHRlclByZXZpZXcgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJ0aXRsZVVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0dHdpdHRlclRpdGxlRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKVxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImRlc2NyaXB0aW9uVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjay5iaW5kKCB0aGlzLCB0d2l0dGVyUHJldmlldyApXG5cdFx0KTtcblxuXHRcdHR3aXR0ZXJQcmV2aWV3LmluaXQoKTtcblxuXHRcdGFkZFVwbG9hZEJ1dHRvbiggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyVGl0bGVGYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHR3aXR0ZXIgdGl0bGUgaXMgZW1wdHksIHVzZSB0aGUgRmFjZWJvb2sgdGl0bGVcblx0ICpcblx0ICogQHBhcmFtIHtUd2l0dGVyUHJldmlld30gdHdpdHRlclByZXZpZXcgVGhlIHR3aXR0ZXIgcHJldmlldyBvYmplY3Rcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB0d2l0dGVyVGl0bGVGYWxsYmFjayggdHdpdHRlclByZXZpZXcgKSB7XG5cdFx0dmFyICR0d2l0dGVyVGl0bGUgPSAkKCBcIiN0d2l0dGVyLWVkaXRvci10aXRsZVwiICk7XG5cdFx0dmFyIHR3aXR0ZXJUaXRsZSA9ICR0d2l0dGVyVGl0bGUudmFsKCk7XG5cdFx0aWYoIHR3aXR0ZXJUaXRsZSAhPT0gXCJcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZmFjZWJvb2tUaXRsZSA9ICQoIFwiI2ZhY2Vib29rLWVkaXRvci10aXRsZVwiICkudmFsKCk7XG5cdFx0aWYgKCBmYWNlYm9va1RpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoIGZhY2Vib29rVGl0bGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoICR0d2l0dGVyVGl0bGUuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiB0d2l0dGVyIGRlc2NyaXB0aW9uIGlzIGVtcHR5LCB1c2UgdGhlIGRlc2NyaXB0aW9uIHRpdGxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7VHdpdHRlclByZXZpZXd9IHR3aXR0ZXJQcmV2aWV3IFRoZSB0d2l0dGVyIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHdpdHRlckRlc2NyaXB0aW9uRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICkge1xuXHRcdHZhciAkdHdpdHRlckRlc2NyaXB0aW9uID0gJCggXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIiApO1xuXHRcdHZhciB0d2l0dGVyRGVzY3JpcHRpb24gPSAkdHdpdHRlckRlc2NyaXB0aW9uLnZhbCgpO1xuXHRcdGlmKCB0d2l0dGVyRGVzY3JpcHRpb24gIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhY2Vib29rRGVzY3JpcHRpb24gPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIiApLnZhbCgpO1xuXHRcdGlmICggZmFjZWJvb2tEZXNjcmlwdGlvbiAhPT0gXCJcIiApIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCBmYWNlYm9va0Rlc2NyaXB0aW9uICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCAkdHdpdHRlckRlc2NyaXB0aW9uLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZmFsbGJhY2sgaW1hZ2UgZm9yIHRoZSBwcmV2aWV3IGlmIG5vIGltYWdlIGhhcyBiZWVuIHNldFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHNldCBmYWxsYmFjayBpbWFnZSBvbi5cblx0ICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG5cdGZ1bmN0aW9uIHNldEZhbGxiYWNrSW1hZ2UoIHByZXZpZXcgKSB7XG5cdFx0aWYgKCBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0XHRwcmV2aWV3LnNldEltYWdlKCBnZXRGYWxsYmFja0ltYWdlKCBcIlwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hhbmdlcyB0aGUgdXBsb2FkIGJ1dHRvbiB2YWx1ZSB3aGVuIHRoZXJlIGFyZSBmYWxsYmFjayBpbWFnZXMgcHJlc2VudC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblByZWZpeCBUaGUgdmFsdWUgYmVmb3JlIHRoZSBpZCBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCBvbiB0aGUgYnV0dG9uLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFVwbG9hZEJ1dHRvblZhbHVlKCBidXR0b25QcmVmaXgsIHRleHQgKSB7XG5cdFx0JCggXCIjXCIgICsgYnV0dG9uUHJlZml4ICsgXCItZWRpdG9yLWltYWdlVXJsX2J1dHRvblwiICkuaHRtbCggdGV4dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGltYWdlIGV2ZW50cyB0byBzZXQgdGhlIGZhbGxiYWNrIGFuZCByZW5kZXJpbmcgdGhlIHByZXZpZXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEltYWdlRXZlbnRzKCkge1xuXHRcdGlmICggZ2V0Q3VycmVudFR5cGUoKSA9PT0gXCJwb3N0XCIgKSB7XG5cdFx0XHRiaW5kRmVhdHVyZWRJbWFnZUV2ZW50cygpO1xuXHRcdH1cblxuXHRcdGJpbmRDb250ZW50RXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB0ZXh0IHRoYXQgdGhlIHVwbG9hZCBidXR0b24gbmVlZHMgdG8gZGlzcGxheVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHJlYWQgaW1hZ2UgZnJvbS5cblx0ICogQHJldHVybnMgeyp9IFRoZSB0ZXh0IGZvciB0aGUgYnV0dG9uLlxuICAgICAqL1xuXHRmdW5jdGlvbiBnZXRVcGxvYWRCdXR0b25UZXh0KCBwcmV2aWV3ICkge1xuXHRcdHJldHVybiBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgPyB5b2FzdFNvY2lhbFByZXZpZXcudXBsb2FkSW1hZ2UgOiB5b2FzdFNvY2lhbFByZXZpZXcudXNlT3RoZXJJbWFnZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgZXZlbnRzIGZvciB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEZlYXR1cmVkSW1hZ2VFdmVudHMoKSB7XG5cdFx0aWYgKCBpc1VuZGVmaW5lZCggd3AubWVkaWEgKSB8fCBpc1VuZGVmaW5lZCggd3AubWVkaWEuZmVhdHVyZWRJbWFnZSApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhlIGZlYXR1cmVkIGltYWdlIGlzIGJlaW5nIGNoYW5nZWRcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2Uub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGltYWdlRGV0YWlscyA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLmF0dHJpYnV0ZXM7XG5cblx0XHRcdGNhblJlYWRGZWF0dXJlZEltYWdlID0gdHJ1ZTtcblxuXHRcdFx0c2V0RmVhdHVyZWRJbWFnZSggaW1hZ2VEZXRhaWxzLnVybCApO1xuXHRcdH0gKTtcblxuXHRcdCQoIFwiI3Bvc3RpbWFnZWRpdlwiICkub24oIFwiY2xpY2tcIiwgXCIjcmVtb3ZlLXBvc3QtdGh1bWJuYWlsXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSBmYWxzZTtcblxuXHRcdFx0Y2xlYXJGZWF0dXJlZEltYWdlKCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGV2ZW50cyBmb3IgdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZENvbnRlbnRFdmVudHMoKSB7XG5cdFx0Ly8gQmluZCB0aGUgZXZlbnQgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGV4dCBlZGl0b3IuXG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gJCggXCIjXCIgKyBjb250ZW50VGV4dE5hbWUoKSApO1xuXHRcdGlmICggY29udGVudEVsZW1lbnQubGVuZ3RoID4gMCApIHtcblx0XHRcdGNvbnRlbnRFbGVtZW50Lm9uKCBcImlucHV0XCIsIGRldGVjdEltYWdlRmFsbGJhY2sgKTtcblx0XHR9XG5cblx0XHQvLyBCaW5kIHRoZSBldmVudHMgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGlueU1DRSBlZGl0b3IuXG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5vbiA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0dmFyIGV2ZW50cyA9IFsgXCJpbnB1dFwiLCBcImNoYW5nZVwiLCBcImN1dFwiLCBcInBhc3RlXCIgXTtcblx0XHRcdHRpbnlNQ0Uub24oIFwiYWRkRWRpdG9yXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0ZS5lZGl0b3Iub24oIGV2ZW50c1sgaSBdLCBkZXRlY3RJbWFnZUZhbGxiYWNrICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgZmFsbGJhY2sgdmFsdWUgYXMgYW4gZW1wdHkgdmFsdWUgYW5kIHJ1bnMgdGhlIGZhbGxiYWNrIG1ldGhvZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbGVhckZlYXR1cmVkSW1hZ2UoKSB7XG5cdFx0c2V0RmVhdHVyZWRJbWFnZSggXCJcIiApO1xuXHRcdGRldGVjdEltYWdlRmFsbGJhY2soKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbWFnZSBmYWxsYmFja3MgbGlrZSB0aGUgZmVhdHVyZWQgaW1hZ2UgKGluIGNhc2Ugb2YgYSBwb3N0KSBhbmQgdGhlIGNvbnRlbnQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGV0ZWN0SW1hZ2VGYWxsYmFjaygpIHtcblx0XHQvLyBJbiBjYXNlIG9mIGEgcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSBnZXRGZWF0dXJlZEltYWdlKCk7XG5cdFx0XHRzZXRGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdGlmICggZmVhdHVyZWRJbWFnZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNldENvbnRlbnRJbWFnZSggZ2V0Q29udGVudEltYWdlKCBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdFx0XHRzZXRDb250ZW50SW1hZ2UoIGltYWdlICk7XG5cdFx0fSApICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgYmFzZWQgb24gdGhlIGdpdmVuIGltYWdlIFVSTC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmVkSW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBmZWF0dXJlZEltYWdlICkge1xuXHRcdFx0aW1hZ2VGYWxsQmFjay5mZWF0dXJlZCA9IGZlYXR1cmVkSW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbnRlbnQgaW1hZ2UgYmFzZSBvbiB0aGUgZ2l2ZW4gaW1hZ2UgVVJMXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50SW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldENvbnRlbnRJbWFnZSggY29udGVudEltYWdlICkge1xuXHRcdGlmICggaW1hZ2VGYWxsQmFjay5jb250ZW50ICE9PSBjb250ZW50SW1hZ2UgKSB7XG5cdFx0XHRpbWFnZUZhbGxCYWNrLmNvbnRlbnQgPSBjb250ZW50SW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGZlYXR1cmVkIGltYWdlIHNvdXJjZSBmcm9tIHRoZSBET00uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB1cmwgdG8gdGhlIGZlYXR1cmVkIGltYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmVhdHVyZWRJbWFnZSgpIHtcblx0XHRpZiAoIGNhblJlYWRGZWF0dXJlZEltYWdlID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblxuXHRcdHZhciBwb3N0VGh1bWJuYWlsID0gJCggXCIuYXR0YWNobWVudC1wb3N0LXRodW1ibmFpbFwiICk7XG5cdFx0aWYgKCBwb3N0VGh1bWJuYWlsLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gJCggcG9zdFRodW1ibmFpbC5nZXQoIDAgKSApLmF0dHIoIFwic3JjXCIgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIGlmIGEgYmlnZ2VyIHNpemUgaXMgYXZhaWxhYmxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZmlyc3QgaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50SW1hZ2UoIGNhbGxiYWNrICkge1xuXHRcdHZhciBjb250ZW50ID0gZ2V0Q29udGVudCgpO1xuXG5cdFx0dmFyIGltYWdlcyA9IGdldEltYWdlcyggY29udGVudCApO1xuXHRcdHZhciBpbWFnZSAgPSBcIlwiO1xuXG5cdFx0aWYgKCBpbWFnZXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuIGltYWdlO1xuXHRcdH1cblxuXHRcdGRvIHtcblx0XHRcdHZhciBjdXJyZW50SW1hZ2UgPSBpbWFnZXMuc2hpZnQoKTtcblx0XHRcdGN1cnJlbnRJbWFnZSA9ICQoIGN1cnJlbnRJbWFnZSApO1xuXG5cdFx0XHR2YXIgaW1hZ2VTb3VyY2UgPSBjdXJyZW50SW1hZ2UucHJvcCggXCJzcmNcIiApO1xuXG5cdFx0XHRpZiAoIGltYWdlU291cmNlICkge1xuXHRcdFx0XHRpbWFnZSA9IGltYWdlU291cmNlO1xuXHRcdFx0fVxuXHRcdH0gd2hpbGUgKCBcIlwiID09PSBpbWFnZSAmJiBpbWFnZXMubGVuZ3RoID4gMCApO1xuXG5cdFx0aW1hZ2UgPSBnZXRCaWdnZXJJbWFnZSggaW1hZ2UsIGNhbGxiYWNrICk7XG5cblx0XHRyZXR1cm4gaW1hZ2U7XG5cdH1cblxuXHQvKipcblx0ICogVHJ5IHRvIHJldHJpZXZlIGEgYmlnZ2VyIGltYWdlIGZvciBhIGNlcnRhaW4gaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHVybCAgICAgIFRoZSBVUkwgdG8gcmV0cmlldmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBjYWxsIGlmIHRoZXJlIGlzIGEgYmlnZ2VyIGltYWdlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBiaWdnZXIgaW1hZ2UgdXJsLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0QmlnZ2VySW1hZ2UoIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCBfaGFzKCBiaWdnZXJJbWFnZXMsIHVybCApICkge1xuXHRcdFx0cmV0dXJuIGJpZ2dlckltYWdlc1sgdXJsIF07XG5cdFx0fVxuXG5cdFx0cmV0cmlldmVJbWFnZURhdGFGcm9tVVJMKCB1cmwsIGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdGJpZ2dlckltYWdlc1sgdXJsIF0gPSBpbWFnZVVybDtcblxuXHRcdFx0Y2FsbGJhY2soIGltYWdlVXJsICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGltYWdlIG1ldGFkYXRhIGZyb20gYW4gaW1hZ2UgdXJsIGFuZCBzYXZlcyBpdCB0byB0aGUgaW1hZ2UgbWFuYWdlciBhZnRlcndhcmRzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGltYWdlIFVSTCB0byByZXRyaWV2ZSB0aGUgbWV0YWRhdGEgZnJvbS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gY2FsbCB3aXRoIHRoZSBpbWFnZSBVUkwgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHJldHJpZXZlSW1hZ2VEYXRhRnJvbVVSTCggdXJsLCBjYWxsYmFjayApIHtcblx0XHQkLmdldEpTT04oIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJyZXRyaWV2ZV9pbWFnZV9kYXRhX2Zyb21fdXJsXCIsXG5cdFx0XHRpbWFnZVVSTDogdXJsLFxuXHRcdH0sIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggXCJzdWNjZXNzXCIgPT09IHJlc3BvbnNlLnN0YXR1cyApIHtcblx0XHRcdFx0Y2FsbGJhY2soIHJlc3BvbnNlLnJlc3VsdCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjb250ZW50IGZyb20gY3VycmVudCB2aXNpYmxlIGNvbnRlbnQgZWRpdG9yXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgdGlueW1jZSBib3guXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50KCkge1xuXHRcdGlmICggaXNUaW55TUNFQXZhaWxhYmxlKCkgKSB7XG5cdFx0XHRyZXR1cm4gdGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICkuZ2V0Q29udGVudCgpO1xuXHRcdH1cblxuXHRcdHZhciBjb250ZW50RWxlbWVudCA9ICQoIFwiI1wiICsgY29udGVudFRleHROYW1lKCkgKTtcblx0XHRpZiAoIGNvbnRlbnRFbGVtZW50Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudEVsZW1lbnQudmFsKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGlueW1jZSBpcyBhY3RpdmUgb24gdGhlIGN1cnJlbnQgcGFnZS5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiB0aW55bWNlIGlzIGF2YWlsYWJsZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGlzVGlueU1DRUF2YWlsYWJsZSgpIHtcblx0XHRpZiAoIHR5cGVvZiB0aW55TUNFID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0eXBlb2YgdGlueU1DRS5lZGl0b3JzID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0aW55TUNFLmVkaXRvcnMubGVuZ3RoID09PSAwIHx8XG5cdFx0XHR0aW55TUNFLmdldCggY29udGVudFRleHROYW1lKCkgKSA9PT0gbnVsbCB8fFxuXHRcdFx0dGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICApLmlzSGlkZGVuKCkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlcmUgaXMgYSBmYWxsYmFjayBpbWFnZSBsaWtlIHRoZSBmZWF0dXJlZCBpbWFnZSBvciB0aGUgZmlyc3QgaW1hZ2UgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkZWZhdWx0SW1hZ2UgVGhlIGRlZmF1bHQgaW1hZ2Ugd2hlbiBub3RoaW5nIGhhcyBiZWVuIGZvdW5kLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgaW1hZ2UgdG8gdXNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFsbGJhY2tJbWFnZSggZGVmYXVsdEltYWdlICkge1xuXHRcdC8vIFR3aXR0ZXIgYWx3YXlzIGZpcnN0IGZhbGxzIGJhY2sgdG8gRmFjZWJvb2tcblx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rUHJldmlldyApICYmIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsO1xuXHRcdH1cblxuXHRcdC8vIEluIGNhc2Ugb2YgYW4gcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBcIlwiICkge1xuXHRcdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5mZWF0dXJlZDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSBmZWF0dXJlZCBpbWFnZSBpcyBlbXB0eSwgdHJ5IGFuIGltYWdlIGluIHRoZSBjb250ZW50XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmNvbnRlbnQgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5jb250ZW50O1xuXHRcdH1cblxuXHRcdGlmICggZGVmYXVsdEltYWdlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gZGVmYXVsdEltYWdlO1xuXHRcdH1cblxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgdGhlIGhlbHAgcGFuZWxzIHRvIHRoZSBzb2NpYWwgcHJldmlld3Ncblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRIZWxwUGFuZWxzKCkge1xuXHRcdHZhciBwYW5lbHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI2ZhY2Vib29rLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi5mYWNlYm9va0ltYWdlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLmZhY2Vib29rSW1hZ2UsXG5cdFx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1pbWFnZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24uZmFjZWJvb2tUaXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC5mYWNlYm9va1RpdGxlLFxuXHRcdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItdGl0bGUtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLmZhY2Vib29rRGVzY3JpcHRpb24sXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAuZmFjZWJvb2tEZXNjcmlwdGlvbixcblx0XHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJJbWFnZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVySW1hZ2UsXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWltYWdlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJUaXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVyVGl0bGUsXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLXRpdGxlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJEZXNjcmlwdGlvbixcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVyRGVzY3JpcHRpb24sXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XTtcblxuXHRcdGZvckVhY2goIHBhbmVscywgZnVuY3Rpb24oIHBhbmVsICkge1xuXHRcdFx0JCggcGFuZWwuYmVmb3JlRWxlbWVudCApLmJlZm9yZShcblx0XHRcdFx0aGVscFBhbmVsLmhlbHBCdXR0b24oIHBhbmVsLmJ1dHRvblRleHQsIHBhbmVsLmlkICkgK1xuXHRcdFx0XHRoZWxwUGFuZWwuaGVscFRleHQoIHBhbmVsLmRlc2NyaXB0aW9uVGV4dCwgcGFuZWwuaWQgKVxuXHRcdFx0KTtcblx0XHR9ICk7XG5cblx0XHQkKCBcIi5zbmlwcGV0LWVkaXRvcl9fZm9ybVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3QtaGVscC1idXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9ICQoIHRoaXMgKSxcblx0XHRcdFx0aGVscFBhbmVsID0gJCggXCIjXCIgKyAkYnV0dG9uLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoIFwiOnZpc2libGVcIiApO1xuXG5cdFx0XHQkKCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGxpYnJhcnkgdHJhbnNsYXRpb25zXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2xhdGlvbnMgVGhlIHRyYW5zbGF0aW9ucyB0byB1c2UuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IHRyYW5zbGF0aW9ucyBtYXBwZWQgdG8gdGhlIHByb3BlciBkb21haW4uXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRMaWJyYXJ5VHJhbnNsYXRpb25zKCB0cmFuc2xhdGlvbnMgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdHJhbnNsYXRpb25zICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0cmFuc2xhdGlvbnMuZG9tYWluICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0dHJhbnNsYXRpb25zLmRvbWFpbiA9IFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI7XG5cdFx0XHR0cmFuc2xhdGlvbnMubG9jYWxlX2RhdGFbIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIgXSA9IGNsb25lKCB0cmFuc2xhdGlvbnMubG9jYWxlX2RhdGFbIFwid29yZHByZXNzLXNlby1wcmVtaXVtXCIgXSApO1xuXG5cdFx0XHRkZWxldGUoIHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ3b3JkcHJlc3Mtc2VvLXByZW1pdW1cIiBdICk7XG5cblx0XHRcdHJldHVybiB0cmFuc2xhdGlvbnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGRvbWFpbjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcdGxvY2FsZV9kYXRhOiB7XG5cdFx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XHRcIlwiOiB7fSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSBzb2NpYWwgcHJldmlld3MuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFlvYXN0U29jaWFsUHJldmlld3MoKSB7XG5cdFx0dmFyIGZhY2Vib29rSG9sZGVyID0gJCggXCIjd3BzZW9fZmFjZWJvb2tcIiApO1xuXHRcdHZhciB0d2l0dGVySG9sZGVyID0gJCggXCIjd3BzZW9fdHdpdHRlclwiICk7XG5cblx0XHRpZiAoIGZhY2Vib29rSG9sZGVyLmxlbmd0aCA+IDAgfHwgdHdpdHRlckhvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggXCJZb2FzdFNFTzpyZWFkeVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGV0ZWN0SW1hZ2VGYWxsYmFjaygpO1xuXG5cdFx0XHRcdGlmICggZmFjZWJvb2tIb2xkZXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRpbml0RmFjZWJvb2soIGZhY2Vib29rSG9sZGVyICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHR3aXR0ZXJIb2xkZXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRpbml0VHdpdHRlciggdHdpdHRlckhvbGRlciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWRkSGVscFBhbmVscygpO1xuXHRcdFx0XHRiaW5kSW1hZ2VFdmVudHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQkKCBpbml0WW9hc3RTb2NpYWxQcmV2aWV3cyApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qKlxuICogQHByZXNlcnZlIGplZC5qcyBodHRwczovL2dpdGh1Yi5jb20vU2xleEF4dG9uL0plZFxuICovXG4vKlxuLS0tLS0tLS0tLS1cbkEgZ2V0dGV4dCBjb21wYXRpYmxlIGkxOG4gbGlicmFyeSBmb3IgbW9kZXJuIEphdmFTY3JpcHQgQXBwbGljYXRpb25zXG5cbmJ5IEFsZXggU2V4dG9uIC0gQWxleFNleHRvbiBbYXRdIGdtYWlsIC0gQFNsZXhBeHRvblxuXG5NSVQgTGljZW5zZVxuXG5BIGpRdWVyeSBGb3VuZGF0aW9uIHByb2plY3QgLSByZXF1aXJlcyBDTEEgdG8gY29udHJpYnV0ZSAtXG5odHRwczovL2NvbnRyaWJ1dGUuanF1ZXJ5Lm9yZy9DTEEvXG5cblxuXG5KZWQgb2ZmZXJzIHRoZSBlbnRpcmUgYXBwbGljYWJsZSBHTlUgZ2V0dGV4dCBzcGVjJ2Qgc2V0IG9mXG5mdW5jdGlvbnMsIGJ1dCBhbHNvIG9mZmVycyBzb21lIG5pY2VyIHdyYXBwZXJzIGFyb3VuZCB0aGVtLlxuVGhlIGFwaSBmb3IgZ2V0dGV4dCB3YXMgd3JpdHRlbiBmb3IgYSBsYW5ndWFnZSB3aXRoIG5vIGZ1bmN0aW9uXG5vdmVybG9hZGluZywgc28gSmVkIGFsbG93cyBhIGxpdHRsZSBtb3JlIG9mIHRoYXQuXG5cbk1hbnkgdGhhbmtzIHRvIEpvc2h1YSBJLiBNaWxsZXIgLSB1bnJ0c3RAY3Bhbi5vcmcgLSB3aG8gd3JvdGVcbmdldHRleHQuanMgYmFjayBpbiAyMDA4LiBJIHdhcyBhYmxlIHRvIHZldCBhIGxvdCBvZiBteSBpZGVhc1xuYWdhaW5zdCBoaXMuIEkgYWxzbyBtYWRlIHN1cmUgSmVkIHBhc3NlZCBhZ2FpbnN0IGhpcyB0ZXN0c1xuaW4gb3JkZXIgdG8gb2ZmZXIgZWFzeSB1cGdyYWRlcyAtLSBqc2dldHRleHQuYmVybGlvcy5kZVxuKi9cbihmdW5jdGlvbiAocm9vdCwgdW5kZWYpIHtcblxuICAvLyBTZXQgdXAgc29tZSB1bmRlcnNjb3JlLXN0eWxlIGZ1bmN0aW9ucywgaWYgeW91IGFscmVhZHkgaGF2ZVxuICAvLyB1bmRlcnNjb3JlLCBmZWVsIGZyZWUgdG8gZGVsZXRlIHRoaXMgc2VjdGlvbiwgYW5kIHVzZSBpdFxuICAvLyBkaXJlY3RseSwgaG93ZXZlciwgdGhlIGFtb3VudCBvZiBmdW5jdGlvbnMgdXNlZCBkb2Vzbid0XG4gIC8vIHdhcnJhbnQgaGF2aW5nIHVuZGVyc2NvcmUgYXMgYSBmdWxsIGRlcGVuZGVuY3kuXG4gIC8vIFVuZGVyc2NvcmUgMS4zLjAgd2FzIHVzZWQgdG8gcG9ydCBhbmQgaXMgbGljZW5zZWRcbiAgLy8gdW5kZXIgdGhlIE1JVCBMaWNlbnNlIGJ5IEplcmVteSBBc2hrZW5hcy5cbiAgdmFyIEFycmF5UHJvdG8gICAgPSBBcnJheS5wcm90b3R5cGUsXG4gICAgICBPYmpQcm90byAgICAgID0gT2JqZWN0LnByb3RvdHlwZSxcbiAgICAgIHNsaWNlICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgaGFzT3duUHJvcCAgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5LFxuICAgICAgbmF0aXZlRm9yRWFjaCA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICAgIGJyZWFrZXIgICAgICAgPSB7fTtcblxuICAvLyBXZSdyZSBub3QgdXNpbmcgdGhlIE9PUCBzdHlsZSBfIHNvIHdlIGRvbid0IG5lZWQgdGhlXG4gIC8vIGV4dHJhIGxldmVsIG9mIGluZGlyZWN0aW9uLiBUaGlzIHN0aWxsIG1lYW5zIHRoYXQgeW91XG4gIC8vIHN1YiBvdXQgZm9yIHJlYWwgYF9gIHRob3VnaC5cbiAgdmFyIF8gPSB7XG4gICAgZm9yRWFjaCA6IGZ1bmN0aW9uKCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0ICkge1xuICAgICAgdmFyIGksIGwsIGtleTtcbiAgICAgIGlmICggb2JqID09PSBudWxsICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggbmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCApIHtcbiAgICAgICAgb2JqLmZvckVhY2goIGl0ZXJhdG9yLCBjb250ZXh0ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICggb2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGggKSB7XG4gICAgICAgIGZvciAoIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICBpZiAoIGkgaW4gb2JqICYmIGl0ZXJhdG9yLmNhbGwoIGNvbnRleHQsIG9ialtpXSwgaSwgb2JqICkgPT09IGJyZWFrZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICgga2V5IGluIG9iaikge1xuICAgICAgICAgIGlmICggaGFzT3duUHJvcC5jYWxsKCBvYmosIGtleSApICkge1xuICAgICAgICAgICAgaWYgKCBpdGVyYXRvci5jYWxsIChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmogKSA9PT0gYnJlYWtlciApIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZXh0ZW5kIDogZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgIHRoaXMuZm9yRWFjaCggc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksIGZ1bmN0aW9uICggc291cmNlICkge1xuICAgICAgICBmb3IgKCB2YXIgcHJvcCBpbiBzb3VyY2UgKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9O1xuICAvLyBFTkQgTWluaWF0dXJlIHVuZGVyc2NvcmUgaW1wbFxuXG4gIC8vIEplZCBpcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gIHZhciBKZWQgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgLy8gU29tZSBtaW5pbWFsIGRlZmF1bHRzXG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIFwibG9jYWxlX2RhdGFcIiA6IHtcbiAgICAgICAgXCJtZXNzYWdlc1wiIDoge1xuICAgICAgICAgIFwiXCIgOiB7XG4gICAgICAgICAgICBcImRvbWFpblwiICAgICAgIDogXCJtZXNzYWdlc1wiLFxuICAgICAgICAgICAgXCJsYW5nXCIgICAgICAgICA6IFwiZW5cIixcbiAgICAgICAgICAgIFwicGx1cmFsX2Zvcm1zXCIgOiBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIlxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUaGVyZSBhcmUgbm8gZGVmYXVsdCBrZXlzLCB0aG91Z2hcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRoZSBkZWZhdWx0IGRvbWFpbiBpZiBvbmUgaXMgbWlzc2luZ1xuICAgICAgXCJkb21haW5cIiA6IFwibWVzc2FnZXNcIixcbiAgICAgIC8vIGVuYWJsZSBkZWJ1ZyBtb2RlIHRvIGxvZyB1bnRyYW5zbGF0ZWQgc3RyaW5ncyB0byB0aGUgY29uc29sZVxuICAgICAgXCJkZWJ1Z1wiIDogZmFsc2VcbiAgICB9O1xuXG4gICAgLy8gTWl4IGluIHRoZSBzZW50IG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zXG4gICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zICk7XG4gICAgdGhpcy50ZXh0ZG9tYWluKCB0aGlzLm9wdGlvbnMuZG9tYWluICk7XG5cbiAgICBpZiAoIG9wdGlvbnMuZG9tYWluICYmICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyB0aGlzLm9wdGlvbnMuZG9tYWluIF0gKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RleHQgZG9tYWluIHNldCB0byBub24tZXhpc3RlbnQgZG9tYWluOiBgJyArIG9wdGlvbnMuZG9tYWluICsgJ2AnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGdldHRleHQgc3BlYyBzZXRzIHRoaXMgY2hhcmFjdGVyIGFzIHRoZSBkZWZhdWx0XG4gIC8vIGRlbGltaXRlciBmb3IgY29udGV4dCBsb29rdXBzLlxuICAvLyBlLmcuOiBjb250ZXh0XFx1MDAwNGtleVxuICAvLyBJZiB5b3VyIHRyYW5zbGF0aW9uIGNvbXBhbnkgdXNlcyBzb21ldGhpbmcgZGlmZmVyZW50LFxuICAvLyBqdXN0IGNoYW5nZSB0aGlzIGF0IGFueSB0aW1lIGFuZCBpdCB3aWxsIHVzZSB0aGF0IGluc3RlYWQuXG4gIEplZC5jb250ZXh0X2RlbGltaXRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoIDQgKTtcblxuICBmdW5jdGlvbiBnZXRQbHVyYWxGb3JtRnVuYyAoIHBsdXJhbF9mb3JtX3N0cmluZyApIHtcbiAgICByZXR1cm4gSmVkLlBGLmNvbXBpbGUoIHBsdXJhbF9mb3JtX3N0cmluZyB8fCBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIik7XG4gIH1cblxuICBmdW5jdGlvbiBDaGFpbigga2V5LCBpMThuICl7XG4gICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIHRoaXMuX2kxOG4gPSBpMThuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgY2hhaW5hYmxlIGFwaSBmb3IgYWRkaW5nIGFyZ3MgcHJldHRpbHlcbiAgXy5leHRlbmQoIENoYWluLnByb3RvdHlwZSwge1xuICAgIG9uRG9tYWluIDogZnVuY3Rpb24gKCBkb21haW4gKSB7XG4gICAgICB0aGlzLl9kb21haW4gPSBkb21haW47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHdpdGhDb250ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0ICkge1xuICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGlmUGx1cmFsIDogZnVuY3Rpb24gKCBudW0sIHBrZXkgKSB7XG4gICAgICB0aGlzLl92YWwgPSBudW07XG4gICAgICB0aGlzLl9wa2V5ID0gcGtleTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZmV0Y2ggOiBmdW5jdGlvbiAoIHNBcnIgKSB7XG4gICAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoIHNBcnIgKSAhPSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICBzQXJyID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuICggc0FyciAmJiBzQXJyLmxlbmd0aCA/IEplZC5zcHJpbnRmIDogZnVuY3Rpb24oeCl7IHJldHVybiB4OyB9ICkoXG4gICAgICAgIHRoaXMuX2kxOG4uZGNucGdldHRleHQodGhpcy5fZG9tYWluLCB0aGlzLl9jb250ZXh0LCB0aGlzLl9rZXksIHRoaXMuX3BrZXksIHRoaXMuX3ZhbCksXG4gICAgICAgIHNBcnJcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBZGQgZnVuY3Rpb25zIHRvIHRoZSBKZWQgcHJvdG90eXBlLlxuICAvLyBUaGVzZSB3aWxsIGJlIHRoZSBmdW5jdGlvbnMgb24gdGhlIG9iamVjdCB0aGF0J3MgcmV0dXJuZWRcbiAgLy8gZnJvbSBjcmVhdGluZyBhIGBuZXcgSmVkKClgXG4gIC8vIFRoZXNlIHNlZW0gcmVkdW5kYW50LCBidXQgdGhleSBnemlwIHByZXR0eSB3ZWxsLlxuICBfLmV4dGVuZCggSmVkLnByb3RvdHlwZSwge1xuICAgIC8vIFRoZSBzZXhpZXIgYXBpIHN0YXJ0IHBvaW50XG4gICAgdHJhbnNsYXRlIDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gbmV3IENoYWluKCBrZXksIHRoaXMgKTtcbiAgICB9LFxuXG4gICAgdGV4dGRvbWFpbiA6IGZ1bmN0aW9uICggZG9tYWluICkge1xuICAgICAgaWYgKCAhIGRvbWFpbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRkb21haW47XG4gICAgICB9XG4gICAgICB0aGlzLl90ZXh0ZG9tYWluID0gZG9tYWluO1xuICAgIH0sXG5cbiAgICBnZXR0ZXh0IDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBrZXkgKSB7XG4gICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkY2dldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiAsIGtleSAvKiwgY2F0ZWdvcnkgKi8gKSB7XG4gICAgICAvLyBJZ25vcmVzIHRoZSBjYXRlZ29yeSBhbnl3YXlzXG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgbmdldHRleHQgOiBmdW5jdGlvbiAoIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZGNuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBwZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBkcGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGNwZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBrZXkvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIG5wZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIC8vIFRoZSBtb3N0IGZ1bGx5IHF1YWxpZmllZCBnZXR0ZXh0IGZ1bmN0aW9uLiBJdCBoYXMgZXZlcnkgb3B0aW9uLlxuICAgIC8vIFNpbmNlIGl0IGhhcyBldmVyeSBvcHRpb24sIHdlIGNhbiB1c2UgaXQgZnJvbSBldmVyeSBvdGhlciBtZXRob2QuXG4gICAgLy8gVGhpcyBpcyB0aGUgYnJlYWQgYW5kIGJ1dHRlci5cbiAgICAvLyBUZWNobmljYWxseSB0aGVyZSBzaG91bGQgYmUgb25lIG1vcmUgYXJndW1lbnQgaW4gdGhpcyBmdW5jdGlvbiBmb3IgJ0NhdGVnb3J5JyxcbiAgICAvLyBidXQgc2luY2Ugd2UgbmV2ZXIgdXNlIGl0LCB3ZSBtaWdodCBhcyB3ZWxsIG5vdCB3YXN0ZSB0aGUgYnl0ZXMgdG8gZGVmaW5lIGl0LlxuICAgIGRjbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSwgdmFsICkge1xuICAgICAgLy8gU2V0IHNvbWUgZGVmYXVsdHNcblxuICAgICAgcGx1cmFsX2tleSA9IHBsdXJhbF9rZXkgfHwgc2luZ3VsYXJfa2V5O1xuXG4gICAgICAvLyBVc2UgdGhlIGdsb2JhbCBkb21haW4gZGVmYXVsdCBpZiBvbmVcbiAgICAgIC8vIGlzbid0IGV4cGxpY2l0bHkgcGFzc2VkIGluXG4gICAgICBkb21haW4gPSBkb21haW4gfHwgdGhpcy5fdGV4dGRvbWFpbjtcblxuICAgICAgdmFyIGZhbGxiYWNrO1xuXG4gICAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlc1xuXG4gICAgICAvLyBObyBvcHRpb25zIGZvdW5kXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zICkge1xuICAgICAgICAvLyBUaGVyZSdzIGxpa2VseSBzb21ldGhpbmcgd3JvbmcsIGJ1dCB3ZSdsbCByZXR1cm4gdGhlIGNvcnJlY3Qga2V5IGZvciBlbmdsaXNoXG4gICAgICAgIC8vIFdlIGRvIHRoaXMgYnkgaW5zdGFudGlhdGluZyBhIGJyYW5kIG5ldyBKZWQgaW5zdGFuY2Ugd2l0aCB0aGUgZGVmYXVsdCBzZXRcbiAgICAgICAgLy8gZm9yIGV2ZXJ5dGhpbmcgdGhhdCBjb3VsZCBiZSBicm9rZW4uXG4gICAgICAgIGZhbGxiYWNrID0gbmV3IEplZCgpO1xuICAgICAgICByZXR1cm4gZmFsbGJhY2suZGNucGdldHRleHQuY2FsbCggZmFsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXksIHZhbCApO1xuICAgICAgfVxuXG4gICAgICAvLyBObyB0cmFuc2xhdGlvbiBkYXRhIHByb3ZpZGVkXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBkYXRhIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb21haW4gYCcgKyBkb21haW4gKyAnYCB3YXMgbm90IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXVsgXCJcIiBdICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBtZXRhIGluZm9ybWF0aW9uIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHRydXRoeSBrZXkuIE90aGVyd2lzZSB3ZSBtaWdodCBzdGFydCBsb29raW5nXG4gICAgICAvLyBpbnRvIHRoZSBlbXB0eSBzdHJpbmcga2V5LCB3aGljaCBpcyB0aGUgb3B0aW9ucyBmb3IgdGhlIGxvY2FsZVxuICAgICAgLy8gZGF0YS5cbiAgICAgIGlmICggISBzaW5ndWxhcl9rZXkgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdHJhbnNsYXRpb24ga2V5IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ICA9IGNvbnRleHQgPyBjb250ZXh0ICsgSmVkLmNvbnRleHRfZGVsaW1pdGVyICsgc2luZ3VsYXJfa2V5IDogc2luZ3VsYXJfa2V5LFxuICAgICAgICAgIGxvY2FsZV9kYXRhID0gdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhLFxuICAgICAgICAgIGRpY3QgPSBsb2NhbGVfZGF0YVsgZG9tYWluIF0sXG4gICAgICAgICAgZGVmYXVsdENvbmYgPSAobG9jYWxlX2RhdGEubWVzc2FnZXMgfHwgdGhpcy5kZWZhdWx0cy5sb2NhbGVfZGF0YS5tZXNzYWdlcylbXCJcIl0sXG4gICAgICAgICAgcGx1cmFsRm9ybXMgPSBkaWN0W1wiXCJdLnBsdXJhbF9mb3JtcyB8fCBkaWN0W1wiXCJdW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRpY3RbXCJcIl1bXCJwbHVyYWwtZm9ybXNcIl0gfHwgZGVmYXVsdENvbmYucGx1cmFsX2Zvcm1zIHx8IGRlZmF1bHRDb25mW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRlZmF1bHRDb25mW1wicGx1cmFsLWZvcm1zXCJdLFxuICAgICAgICAgIHZhbF9saXN0LFxuICAgICAgICAgIHJlcztcblxuICAgICAgdmFyIHZhbF9pZHg7XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gdmFsdWUgcGFzc2VkIGluOyBhc3N1bWUgc2luZ3VsYXIga2V5IGxvb2t1cC5cbiAgICAgICAgdmFsX2lkeCA9IDA7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFZhbHVlIGhhcyBiZWVuIHBhc3NlZCBpbjsgdXNlIHBsdXJhbC1mb3JtcyBjYWxjdWxhdGlvbnMuXG5cbiAgICAgICAgLy8gSGFuZGxlIGludmFsaWQgbnVtYmVycywgYnV0IHRyeSBjYXN0aW5nIHN0cmluZ3MgZm9yIGdvb2QgbWVhc3VyZVxuICAgICAgICBpZiAoIHR5cGVvZiB2YWwgIT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgdmFsID0gcGFyc2VJbnQoIHZhbCwgMTAgKTtcblxuICAgICAgICAgIGlmICggaXNOYU4oIHZhbCApICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbnVtYmVyIHRoYXQgd2FzIHBhc3NlZCBpbiBpcyBub3QgYSBudW1iZXIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFsX2lkeCA9IGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSh2YWwpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiBhIGRvbWFpbiBpc24ndCBmb3VuZFxuICAgICAgaWYgKCAhIGRpY3QgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZG9tYWluIG5hbWVkIGAnICsgZG9tYWluICsgJ2AgY291bGQgYmUgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhbF9saXN0ID0gZGljdFsga2V5IF07XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG1hdGNoLCB0aGVuIHJldmVydCBiYWNrIHRvXG4gICAgICAvLyBlbmdsaXNoIHN0eWxlIHNpbmd1bGFyL3BsdXJhbCB3aXRoIHRoZSBrZXlzIHBhc3NlZCBpbi5cbiAgICAgIGlmICggISB2YWxfbGlzdCB8fCB2YWxfaWR4ID4gdmFsX2xpc3QubGVuZ3RoICkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKGtleSwgZG9tYWluKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuXG4gICAgICAgIC8vIGNvbGxlY3QgdW50cmFuc2xhdGVkIHN0cmluZ3NcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1Zz09PXRydWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNbIGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSggdmFsICkgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMoKSggdmFsICkgXTtcbiAgICAgIH1cblxuICAgICAgcmVzID0gdmFsX2xpc3RbIHZhbF9pZHggXTtcblxuICAgICAgLy8gVGhpcyBpbmNsdWRlcyBlbXB0eSBzdHJpbmdzIG9uIHB1cnBvc2VcbiAgICAgIGlmICggISByZXMgICkge1xuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuICAgICAgICByZXR1cm4gcmVzWyBnZXRQbHVyYWxGb3JtRnVuYygpKCB2YWwgKSBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH0pO1xuXG5cbiAgLy8gV2UgYWRkIGluIHNwcmludGYgY2FwYWJpbGl0aWVzIGZvciBwb3N0IHRyYW5zbGF0aW9uIHZhbHVlIGludGVyb2xhdGlvblxuICAvLyBUaGlzIGlzIG5vdCBpbnRlcm5hbGx5IHVzZWQsIHNvIHlvdSBjYW4gcmVtb3ZlIGl0IGlmIHlvdSBoYXZlIHRoaXNcbiAgLy8gYXZhaWxhYmxlIHNvbWV3aGVyZSBlbHNlLCBvciB3YW50IHRvIHVzZSBhIGRpZmZlcmVudCBzeXN0ZW0uXG5cbiAgLy8gV2UgX3NsaWdodGx5XyBtb2RpZnkgdGhlIG5vcm1hbCBzcHJpbnRmIGJlaGF2aW9yIHRvIG1vcmUgZ3JhY2VmdWxseSBoYW5kbGVcbiAgLy8gdW5kZWZpbmVkIHZhbHVlcy5cblxuICAvKipcbiAgIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCAwLjctYmV0YTFcbiAgIGh0dHA6Ly93d3cuZGl2ZWludG9qYXZhc2NyaXB0LmNvbS9wcm9qZWN0cy9qYXZhc2NyaXB0LXNwcmludGZcblxuICAgQ29weXJpZ2h0IChjKSBBbGV4YW5kcnUgTWFyYXN0ZWFudSA8YWxleGFob2xpYyBbYXQpIGdtYWlsIChkb3RdIGNvbT5cbiAgIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAgICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gICAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCBub3IgdGhlXG4gICAgICAgICBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xuICAgICAgICAgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuICAgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbiAgIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbiAgIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEFsZXhhbmRydSBNYXJhc3RlYW51IEJFIExJQUJMRSBGT1IgQU5ZXG4gICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuICAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4gICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICAqL1xuICB2YXIgc3ByaW50ZiA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0cl9yZXBlYXQoaW5wdXQsIG11bHRpcGxpZXIpIHtcbiAgICAgIGZvciAodmFyIG91dHB1dCA9IFtdOyBtdWx0aXBsaWVyID4gMDsgb3V0cHV0Wy0tbXVsdGlwbGllcl0gPSBpbnB1dCkgey8qIGRvIG5vdGhpbmcgKi99XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIHZhciBzdHJfZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXN0cl9mb3JtYXQuY2FjaGUuaGFzT3duUHJvcGVydHkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgICBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0gPSBzdHJfZm9ybWF0LnBhcnNlKGFyZ3VtZW50c1swXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyX2Zvcm1hdC5mb3JtYXQuY2FsbChudWxsLCBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0sIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuZm9ybWF0ID0gZnVuY3Rpb24ocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIG5vZGVfdHlwZSA9ICcnLCBhcmcsIG91dHB1dCA9IFtdLCBpLCBrLCBtYXRjaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbm9kZV90eXBlID0gZ2V0X3R5cGUocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIGlmIChub2RlX3R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZV90eXBlID09PSAnYXJyYXknKSB7XG4gICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXTtcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBtYXRjaFsyXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICBpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXVtrXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gcHJvcGVydHkgXCIlc1wiIGRvZXMgbm90IGV4aXN0JywgbWF0Y2hbMl1ba10pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmcgPSBhcmdbbWF0Y2hbMl1ba11dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbbWF0Y2hbMV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL1tec10vLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3coc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzJywgZ2V0X3R5cGUoYXJnKSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEplZCBFRElUXG4gICAgICAgICAgaWYgKCB0eXBlb2YgYXJnID09ICd1bmRlZmluZWQnIHx8IGFyZyA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIGFyZyA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBKZWQgRURJVFxuXG4gICAgICAgICAgc3dpdGNoIChtYXRjaFs4XSkge1xuICAgICAgICAgICAgY2FzZSAnYic6IGFyZyA9IGFyZy50b1N0cmluZygyKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjJzogYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2QnOiBhcmcgPSBwYXJzZUludChhcmcsIDEwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlJzogYXJnID0gbWF0Y2hbN10gPyBhcmcudG9FeHBvbmVudGlhbChtYXRjaFs3XSkgOiBhcmcudG9FeHBvbmVudGlhbCgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2YnOiBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKG1hdGNoWzddKSA6IHBhcnNlRmxvYXQoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdvJzogYXJnID0gYXJnLnRvU3RyaW5nKDgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3MnOiBhcmcgPSAoKGFyZyA9IFN0cmluZyhhcmcpKSAmJiBtYXRjaFs3XSA/IGFyZy5zdWJzdHJpbmcoMCwgbWF0Y2hbN10pIDogYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1JzogYXJnID0gTWF0aC5hYnMoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd4JzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdYJzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYXJnID0gKC9bZGVmXS8udGVzdChtYXRjaFs4XSkgJiYgbWF0Y2hbM10gJiYgYXJnID49IDAgPyAnKycrIGFyZyA6IGFyZyk7XG4gICAgICAgICAgcGFkX2NoYXJhY3RlciA9IG1hdGNoWzRdID8gbWF0Y2hbNF0gPT0gJzAnID8gJzAnIDogbWF0Y2hbNF0uY2hhckF0KDEpIDogJyAnO1xuICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIFN0cmluZyhhcmcpLmxlbmd0aDtcbiAgICAgICAgICBwYWQgPSBtYXRjaFs2XSA/IHN0cl9yZXBlYXQocGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCkgOiAnJztcbiAgICAgICAgICBvdXRwdXQucHVzaChtYXRjaFs1XSA/IGFyZyArIHBhZCA6IHBhZCArIGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuY2FjaGUgPSB7fTtcblxuICAgIHN0cl9mb3JtYXQucGFyc2UgPSBmdW5jdGlvbihmbXQpIHtcbiAgICAgIHZhciBfZm10ID0gZm10LCBtYXRjaCA9IFtdLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDA7XG4gICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICBpZiAoKG1hdGNoID0gL15bXlxceDI1XSsvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1ezJ9Ly5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaCgnJScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW15cXCldKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWZvc3V4WF0pLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDE7XG4gICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdO1xuICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcWyhcXGQrKVxcXS8uZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIG1peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICB9XG4gICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlX3RyZWU7XG4gICAgfTtcblxuICAgIHJldHVybiBzdHJfZm9ybWF0O1xuICB9KSgpO1xuXG4gIHZhciB2c3ByaW50ZiA9IGZ1bmN0aW9uKGZtdCwgYXJndikge1xuICAgIGFyZ3YudW5zaGlmdChmbXQpO1xuICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3YpO1xuICB9O1xuXG4gIEplZC5wYXJzZV9wbHVyYWwgPSBmdW5jdGlvbiAoIHBsdXJhbF9mb3JtcywgbiApIHtcbiAgICBwbHVyYWxfZm9ybXMgPSBwbHVyYWxfZm9ybXMucmVwbGFjZSgvbi9nLCBuKTtcbiAgICByZXR1cm4gSmVkLnBhcnNlX2V4cHJlc3Npb24ocGx1cmFsX2Zvcm1zKTtcbiAgfTtcblxuICBKZWQuc3ByaW50ZiA9IGZ1bmN0aW9uICggZm10LCBhcmdzICkge1xuICAgIGlmICgge30udG9TdHJpbmcuY2FsbCggYXJncyApID09ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICByZXR1cm4gdnNwcmludGYoIGZtdCwgW10uc2xpY2UuY2FsbChhcmdzKSApO1xuICAgIH1cbiAgICByZXR1cm4gc3ByaW50Zi5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykgKTtcbiAgfTtcblxuICBKZWQucHJvdG90eXBlLnNwcmludGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEplZC5zcHJpbnRmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIC8vIEVORCBzcHJpbnRmIEltcGxlbWVudGF0aW9uXG5cbiAgLy8gU3RhcnQgdGhlIFBsdXJhbCBmb3JtcyBzZWN0aW9uXG4gIC8vIFRoaXMgaXMgYSBmdWxsIHBsdXJhbCBmb3JtIGV4cHJlc3Npb24gcGFyc2VyLiBJdCBpcyB1c2VkIHRvIGF2b2lkXG4gIC8vIHJ1bm5pbmcgJ2V2YWwnIG9yICduZXcgRnVuY3Rpb24nIGRpcmVjdGx5IGFnYWluc3QgdGhlIHBsdXJhbFxuICAvLyBmb3Jtcy5cbiAgLy9cbiAgLy8gVGhpcyBjYW4gYmUgaW1wb3J0YW50IGlmIHlvdSBnZXQgdHJhbnNsYXRpb25zIGRvbmUgdGhyb3VnaCBhIDNyZFxuICAvLyBwYXJ0eSB2ZW5kb3IuIEkgZW5jb3VyYWdlIHlvdSB0byB1c2UgdGhpcyBpbnN0ZWFkLCBob3dldmVyLCBJXG4gIC8vIGFsc28gd2lsbCBwcm92aWRlIGEgJ3ByZWNvbXBpbGVyJyB0aGF0IHlvdSBjYW4gdXNlIGF0IGJ1aWxkIHRpbWVcbiAgLy8gdG8gb3V0cHV0IHZhbGlkL3NhZmUgZnVuY3Rpb24gcmVwcmVzZW50YXRpb25zIG9mIHRoZSBwbHVyYWwgZm9ybVxuICAvLyBleHByZXNzaW9ucy4gVGhpcyBtZWFucyB5b3UgY2FuIGJ1aWxkIHRoaXMgY29kZSBvdXQgZm9yIHRoZSBtb3N0XG4gIC8vIHBhcnQuXG4gIEplZC5QRiA9IHt9O1xuXG4gIEplZC5QRi5wYXJzZSA9IGZ1bmN0aW9uICggcCApIHtcbiAgICB2YXIgcGx1cmFsX3N0ciA9IEplZC5QRi5leHRyYWN0UGx1cmFsRXhwciggcCApO1xuICAgIHJldHVybiBKZWQuUEYucGFyc2VyLnBhcnNlLmNhbGwoSmVkLlBGLnBhcnNlciwgcGx1cmFsX3N0cik7XG4gIH07XG5cbiAgSmVkLlBGLmNvbXBpbGUgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gSGFuZGxlIHRydWVzIGFuZCBmYWxzZXMgYXMgMCBhbmQgMVxuICAgIGZ1bmN0aW9uIGltcGx5KCB2YWwgKSB7XG4gICAgICByZXR1cm4gKHZhbCA9PT0gdHJ1ZSA/IDEgOiB2YWwgPyB2YWwgOiAwKTtcbiAgICB9XG5cbiAgICB2YXIgYXN0ID0gSmVkLlBGLnBhcnNlKCBwICk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggbiApIHtcbiAgICAgIHJldHVybiBpbXBseSggSmVkLlBGLmludGVycHJldGVyKCBhc3QgKSggbiApICk7XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuaW50ZXJwcmV0ZXIgPSBmdW5jdGlvbiAoIGFzdCApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHN3aXRjaCAoIGFzdC50eXBlICkge1xuICAgICAgICBjYXNlICdHUk9VUCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApO1xuICAgICAgICBjYXNlICdURVJOQVJZJzpcbiAgICAgICAgICBpZiAoIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApICkge1xuICAgICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnRydXRoeSApKCBuICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5mYWxzZXkgKSggbiApO1xuICAgICAgICBjYXNlICdPUic6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIHx8IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnQU5EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJiYgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIDwgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdHVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID4gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVEUnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA8PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0dURSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID49IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnRVEnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA9PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ05FUSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICE9IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTU9EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ1ZBUic6XG4gICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIGNhc2UgJ05VTSc6XG4gICAgICAgICAgcmV0dXJuIGFzdC52YWw7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBUb2tlbiBmb3VuZC5cIik7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuZXh0cmFjdFBsdXJhbEV4cHIgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gdHJpbSBmaXJzdFxuICAgIHAgPSBwLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuXG4gICAgaWYgKCEgLztcXHMqJC8udGVzdChwKSkge1xuICAgICAgcCA9IHAuY29uY2F0KCc7Jyk7XG4gICAgfVxuXG4gICAgdmFyIG5wbHVyYWxzX3JlID0gL25wbHVyYWxzXFw9KFxcZCspOy8sXG4gICAgICAgIHBsdXJhbF9yZSA9IC9wbHVyYWxcXD0oLiopOy8sXG4gICAgICAgIG5wbHVyYWxzX21hdGNoZXMgPSBwLm1hdGNoKCBucGx1cmFsc19yZSApLFxuICAgICAgICByZXMgPSB7fSxcbiAgICAgICAgcGx1cmFsX21hdGNoZXM7XG5cbiAgICAvLyBGaW5kIHRoZSBucGx1cmFscyBudW1iZXJcbiAgICBpZiAoIG5wbHVyYWxzX21hdGNoZXMubGVuZ3RoID4gMSApIHtcbiAgICAgIHJlcy5ucGx1cmFscyA9IG5wbHVyYWxzX21hdGNoZXNbMV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCducGx1cmFscyBub3QgZm91bmQgaW4gcGx1cmFsX2Zvcm1zIHN0cmluZzogJyArIHAgKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgdGhhdCBkYXRhIHRvIGdldCB0byB0aGUgZm9ybXVsYVxuICAgIHAgPSBwLnJlcGxhY2UoIG5wbHVyYWxzX3JlLCBcIlwiICk7XG4gICAgcGx1cmFsX21hdGNoZXMgPSBwLm1hdGNoKCBwbHVyYWxfcmUgKTtcblxuICAgIGlmICghKCBwbHVyYWxfbWF0Y2hlcyAmJiBwbHVyYWxfbWF0Y2hlcy5sZW5ndGggPiAxICkgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BwbHVyYWxgIGV4cHJlc3Npb24gbm90IGZvdW5kOiAnICsgcCk7XG4gICAgfVxuICAgIHJldHVybiBwbHVyYWxfbWF0Y2hlc1sgMSBdO1xuICB9O1xuXG4gIC8qIEppc29uIGdlbmVyYXRlZCBwYXJzZXIgKi9cbiAgSmVkLlBGLnBhcnNlciA9IChmdW5jdGlvbigpe1xuXG52YXIgcGFyc2VyID0ge3RyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHsgfSxcbnl5OiB7fSxcbnN5bWJvbHNfOiB7XCJlcnJvclwiOjIsXCJleHByZXNzaW9uc1wiOjMsXCJlXCI6NCxcIkVPRlwiOjUsXCI/XCI6NixcIjpcIjo3LFwifHxcIjo4LFwiJiZcIjo5LFwiPFwiOjEwLFwiPD1cIjoxMSxcIj5cIjoxMixcIj49XCI6MTMsXCIhPVwiOjE0LFwiPT1cIjoxNSxcIiVcIjoxNixcIihcIjoxNyxcIilcIjoxOCxcIm5cIjoxOSxcIk5VTUJFUlwiOjIwLFwiJGFjY2VwdFwiOjAsXCIkZW5kXCI6MX0sXG50ZXJtaW5hbHNfOiB7MjpcImVycm9yXCIsNTpcIkVPRlwiLDY6XCI/XCIsNzpcIjpcIiw4OlwifHxcIiw5OlwiJiZcIiwxMDpcIjxcIiwxMTpcIjw9XCIsMTI6XCI+XCIsMTM6XCI+PVwiLDE0OlwiIT1cIiwxNTpcIj09XCIsMTY6XCIlXCIsMTc6XCIoXCIsMTg6XCIpXCIsMTk6XCJuXCIsMjA6XCJOVU1CRVJcIn0sXG5wcm9kdWN0aW9uc186IFswLFszLDJdLFs0LDVdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDFdLFs0LDFdXSxcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQseXlsZW5nLHl5bGluZW5vLHl5LHl5c3RhdGUsJCQsXyQpIHtcblxudmFyICQwID0gJCQubGVuZ3RoIC0gMTtcbnN3aXRjaCAoeXlzdGF0ZSkge1xuY2FzZSAxOiByZXR1cm4geyB0eXBlIDogJ0dST1VQJywgZXhwcjogJCRbJDAtMV0gfTtcbmJyZWFrO1xuY2FzZSAyOnRoaXMuJCA9IHsgdHlwZTogJ1RFUk5BUlknLCBleHByOiAkJFskMC00XSwgdHJ1dGh5IDogJCRbJDAtMl0sIGZhbHNleTogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMzp0aGlzLiQgPSB7IHR5cGU6IFwiT1JcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA0OnRoaXMuJCA9IHsgdHlwZTogXCJBTkRcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA1OnRoaXMuJCA9IHsgdHlwZTogJ0xUJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA2OnRoaXMuJCA9IHsgdHlwZTogJ0xURScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNzp0aGlzLiQgPSB7IHR5cGU6ICdHVCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgODp0aGlzLiQgPSB7IHR5cGU6ICdHVEUnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDk6dGhpcy4kID0geyB0eXBlOiAnTkVRJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMDp0aGlzLiQgPSB7IHR5cGU6ICdFUScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTE6dGhpcy4kID0geyB0eXBlOiAnTU9EJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMjp0aGlzLiQgPSB7IHR5cGU6ICdHUk9VUCcsIGV4cHI6ICQkWyQwLTFdIH07XG5icmVhaztcbmNhc2UgMTM6dGhpcy4kID0geyB0eXBlOiAnVkFSJyB9O1xuYnJlYWs7XG5jYXNlIDE0OnRoaXMuJCA9IHsgdHlwZTogJ05VTScsIHZhbDogTnVtYmVyKHl5dGV4dCkgfTtcbmJyZWFrO1xufVxufSxcbnRhYmxlOiBbezM6MSw0OjIsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHsxOlszXX0sezU6WzEsNl0sNjpbMSw3XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NDoxNywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezU6WzIsMTNdLDY6WzIsMTNdLDc6WzIsMTNdLDg6WzIsMTNdLDk6WzIsMTNdLDEwOlsyLDEzXSwxMTpbMiwxM10sMTI6WzIsMTNdLDEzOlsyLDEzXSwxNDpbMiwxM10sMTU6WzIsMTNdLDE2OlsyLDEzXSwxODpbMiwxM119LHs1OlsyLDE0XSw2OlsyLDE0XSw3OlsyLDE0XSw4OlsyLDE0XSw5OlsyLDE0XSwxMDpbMiwxNF0sMTE6WzIsMTRdLDEyOlsyLDE0XSwxMzpbMiwxNF0sMTQ6WzIsMTRdLDE1OlsyLDE0XSwxNjpbMiwxNF0sMTg6WzIsMTRdfSx7MTpbMiwxXX0sezQ6MTgsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjE5LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjEsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIyLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjQsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI1LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjcsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs2OlsxLDddLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzEsMjhdfSx7NjpbMSw3XSw3OlsxLDI5XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NTpbMiwzXSw2OlsyLDNdLDc6WzIsM10sODpbMiwzXSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiwzXX0sezU6WzIsNF0sNjpbMiw0XSw3OlsyLDRdLDg6WzIsNF0sOTpbMiw0XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsNF19LHs1OlsyLDVdLDY6WzIsNV0sNzpbMiw1XSw4OlsyLDVdLDk6WzIsNV0sMTA6WzIsNV0sMTE6WzIsNV0sMTI6WzIsNV0sMTM6WzIsNV0sMTQ6WzIsNV0sMTU6WzIsNV0sMTY6WzEsMTZdLDE4OlsyLDVdfSx7NTpbMiw2XSw2OlsyLDZdLDc6WzIsNl0sODpbMiw2XSw5OlsyLDZdLDEwOlsyLDZdLDExOlsyLDZdLDEyOlsyLDZdLDEzOlsyLDZdLDE0OlsyLDZdLDE1OlsyLDZdLDE2OlsxLDE2XSwxODpbMiw2XX0sezU6WzIsN10sNjpbMiw3XSw3OlsyLDddLDg6WzIsN10sOTpbMiw3XSwxMDpbMiw3XSwxMTpbMiw3XSwxMjpbMiw3XSwxMzpbMiw3XSwxNDpbMiw3XSwxNTpbMiw3XSwxNjpbMSwxNl0sMTg6WzIsN119LHs1OlsyLDhdLDY6WzIsOF0sNzpbMiw4XSw4OlsyLDhdLDk6WzIsOF0sMTA6WzIsOF0sMTE6WzIsOF0sMTI6WzIsOF0sMTM6WzIsOF0sMTQ6WzIsOF0sMTU6WzIsOF0sMTY6WzEsMTZdLDE4OlsyLDhdfSx7NTpbMiw5XSw2OlsyLDldLDc6WzIsOV0sODpbMiw5XSw5OlsyLDldLDEwOlsyLDldLDExOlsyLDldLDEyOlsyLDldLDEzOlsyLDldLDE0OlsyLDldLDE1OlsyLDldLDE2OlsxLDE2XSwxODpbMiw5XX0sezU6WzIsMTBdLDY6WzIsMTBdLDc6WzIsMTBdLDg6WzIsMTBdLDk6WzIsMTBdLDEwOlsyLDEwXSwxMTpbMiwxMF0sMTI6WzIsMTBdLDEzOlsyLDEwXSwxNDpbMiwxMF0sMTU6WzIsMTBdLDE2OlsxLDE2XSwxODpbMiwxMF19LHs1OlsyLDExXSw2OlsyLDExXSw3OlsyLDExXSw4OlsyLDExXSw5OlsyLDExXSwxMDpbMiwxMV0sMTE6WzIsMTFdLDEyOlsyLDExXSwxMzpbMiwxMV0sMTQ6WzIsMTFdLDE1OlsyLDExXSwxNjpbMiwxMV0sMTg6WzIsMTFdfSx7NTpbMiwxMl0sNjpbMiwxMl0sNzpbMiwxMl0sODpbMiwxMl0sOTpbMiwxMl0sMTA6WzIsMTJdLDExOlsyLDEyXSwxMjpbMiwxMl0sMTM6WzIsMTJdLDE0OlsyLDEyXSwxNTpbMiwxMl0sMTY6WzIsMTJdLDE4OlsyLDEyXX0sezQ6MzAsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs1OlsyLDJdLDY6WzEsN10sNzpbMiwyXSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDJdfV0sXG5kZWZhdWx0QWN0aW9uczogezY6WzIsMV19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbn0sXG5wYXJzZTogZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIHN0YWNrID0gWzBdLFxuICAgICAgICB2c3RhY2sgPSBbbnVsbF0sIC8vIHNlbWFudGljIHZhbHVlIHN0YWNrXG4gICAgICAgIGxzdGFjayA9IFtdLCAvLyBsb2NhdGlvbiBzdGFja1xuICAgICAgICB0YWJsZSA9IHRoaXMudGFibGUsXG4gICAgICAgIHl5dGV4dCA9ICcnLFxuICAgICAgICB5eWxpbmVubyA9IDAsXG4gICAgICAgIHl5bGVuZyA9IDAsXG4gICAgICAgIHJlY292ZXJpbmcgPSAwLFxuICAgICAgICBURVJST1IgPSAyLFxuICAgICAgICBFT0YgPSAxO1xuXG4gICAgLy90aGlzLnJlZHVjdGlvbkNvdW50ID0gdGhpcy5zaGlmdENvdW50ID0gMDtcblxuICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuICAgIHRoaXMubGV4ZXIueXkgPSB0aGlzLnl5O1xuICAgIHRoaXMueXkubGV4ZXIgPSB0aGlzLmxleGVyO1xuICAgIGlmICh0eXBlb2YgdGhpcy5sZXhlci55eWxsb2MgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHRoaXMubGV4ZXIueXlsbG9jID0ge307XG4gICAgdmFyIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgbHN0YWNrLnB1c2goeXlsb2MpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnl5LnBhcnNlRXJyb3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcblxuICAgIGZ1bmN0aW9uIHBvcFN0YWNrIChuKSB7XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIqbjtcbiAgICAgICAgdnN0YWNrLmxlbmd0aCA9IHZzdGFjay5sZW5ndGggLSBuO1xuICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCAxOyAvLyAkZW5kID0gMVxuICAgICAgICAvLyBpZiB0b2tlbiBpc24ndCBpdHMgbnVtZXJpYyB2YWx1ZSwgY29udmVydFxuICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdG9rZW4gPSBzZWxmLnN5bWJvbHNfW3Rva2VuXSB8fCB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfVxuXG4gICAgdmFyIHN5bWJvbCwgcHJlRXJyb3JTeW1ib2wsIHN0YXRlLCBhY3Rpb24sIGEsIHIsIHl5dmFsPXt9LHAsbGVuLG5ld1N0YXRlLCBleHBlY3RlZDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvLyByZXRyZWl2ZSBzdGF0ZSBudW1iZXIgZnJvbSB0b3Agb2Ygc3RhY2tcbiAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG5cbiAgICAgICAgLy8gdXNlIGRlZmF1bHQgYWN0aW9ucyBpZiBhdmFpbGFibGVcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIC8vIHJlYWQgYWN0aW9uIGZvciBjdXJyZW50IHN0YXRlIGFuZCBmaXJzdCBpbnB1dFxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBhcnNlIGVycm9yXG4gICAgICAgIF9oYW5kbGVfZXJyb3I6XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAndW5kZWZpbmVkJyB8fCAhYWN0aW9uLmxlbmd0aCB8fCAhYWN0aW9uWzBdKSB7XG5cbiAgICAgICAgICAgIGlmICghcmVjb3ZlcmluZykge1xuICAgICAgICAgICAgICAgIC8vIFJlcG9ydCBlcnJvclxuICAgICAgICAgICAgICAgIGV4cGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChwIGluIHRhYmxlW3N0YXRlXSkgaWYgKHRoaXMudGVybWluYWxzX1twXSAmJiBwID4gMikge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiK3RoaXMudGVybWluYWxzX1twXStcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZXhlci5zaG93UG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6XFxuXCIrdGhpcy5sZXhlci5zaG93UG9zaXRpb24oKStcIlxcbkV4cGVjdGluZyBcIitleHBlY3RlZC5qb2luKCcsICcpICsgXCIsIGdvdCAnXCIgKyB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSsgXCInXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6IFVuZXhwZWN0ZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzeW1ib2wgPT0gMSAvKkVPRiovID8gXCJlbmQgb2YgaW5wdXRcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFwiJ1wiKyh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpK1wiJ1wiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLCB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLCBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLCBsb2M6IHl5bG9jLCBleHBlY3RlZDogZXhwZWN0ZWR9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ganVzdCByZWNvdmVyZWQgZnJvbSBhbm90aGVyIGVycm9yXG4gICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBFT0YpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBjdXJyZW50IGxvb2thaGVhZCBhbmQgZ3JhYiBhbm90aGVyXG4gICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG4gICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRyeSB0byByZWNvdmVyIGZyb20gZXJyb3JcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGVycm9yIHJlY292ZXJ5IHJ1bGUgaW4gdGhpcyBzdGF0ZVxuICAgICAgICAgICAgICAgIGlmICgoVEVSUk9SLnRvU3RyaW5nKCkpIGluIHRhYmxlW3N0YXRlXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvcFN0YWNrKDEpO1xuICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IHN5bWJvbDsgLy8gc2F2ZSB0aGUgbG9va2FoZWFkIHRva2VuXG4gICAgICAgICAgICBzeW1ib2wgPSBURVJST1I7ICAgICAgICAgLy8gaW5zZXJ0IGdlbmVyaWMgZXJyb3Igc3ltYm9sIGFzIG5ldyBsb29rYWhlYWRcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtURVJST1JdO1xuICAgICAgICAgICAgcmVjb3ZlcmluZyA9IDM7IC8vIGFsbG93IDMgcmVhbCBzeW1ib2xzIHRvIGJlIHNoaWZ0ZWQgYmVmb3JlIHJlcG9ydGluZyBhIG5ldyBlcnJvclxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCB1bmxlc3MgcmVzb2x2ZSBkZWZhdWx0cyBhcmUgb2ZmXG4gICAgICAgIGlmIChhY3Rpb25bMF0gaW5zdGFuY2VvZiBBcnJheSAmJiBhY3Rpb24ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJzZSBFcnJvcjogbXVsdGlwbGUgYWN0aW9ucyBwb3NzaWJsZSBhdCBzdGF0ZTogJytzdGF0ZSsnLCB0b2tlbjogJytzeW1ib2wpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcblxuICAgICAgICAgICAgY2FzZSAxOiAvLyBzaGlmdFxuICAgICAgICAgICAgICAgIC8vdGhpcy5zaGlmdENvdW50Kys7XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHRoaXMubGV4ZXIueXlsbG9jKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGFjdGlvblsxXSk7IC8vIHB1c2ggc3RhdGVcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHsgLy8gbm9ybWFsIGV4ZWN1dGlvbi9ubyBlcnJvclxuICAgICAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGVycm9yIGp1c3Qgb2NjdXJyZWQsIHJlc3VtZSBvbGQgbG9va2FoZWFkIGYvIGJlZm9yZSBlcnJvclxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBwcmVFcnJvclN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOiAvLyByZWR1Y2VcbiAgICAgICAgICAgICAgICAvL3RoaXMucmVkdWN0aW9uQ291bnQrKztcblxuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG5cbiAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHNlbWFudGljIGFjdGlvblxuICAgICAgICAgICAgICAgIHl5dmFsLiQgPSB2c3RhY2tbdnN0YWNrLmxlbmd0aC1sZW5dOyAvLyBkZWZhdWx0IHRvICQkID0gJDFcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IGxvY2F0aW9uLCB1c2VzIGZpcnN0IHRva2VuIGZvciBmaXJzdHMsIGxhc3QgZm9yIGxhc3RzXG4gICAgICAgICAgICAgICAgeXl2YWwuXyQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLShsZW58fDEpXS5maXJzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLTFdLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0obGVufHwxKV0uZmlyc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGgtMV0ubGFzdF9jb2x1bW5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHIgPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh5eXZhbCwgeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB0aGlzLnl5LCBhY3Rpb25bMV0sIHZzdGFjaywgbHN0YWNrKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcG9wIG9mZiBzdGFja1xuICAgICAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgwLC0xKmxlbioyKTtcbiAgICAgICAgICAgICAgICAgICAgdnN0YWNrID0gdnN0YWNrLnNsaWNlKDAsIC0xKmxlbik7XG4gICAgICAgICAgICAgICAgICAgIGxzdGFjayA9IGxzdGFjay5zbGljZSgwLCAtMSpsZW4pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7ICAgIC8vIHB1c2ggbm9udGVybWluYWwgKHJlZHVjZSlcbiAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcbiAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG4gICAgICAgICAgICAgICAgLy8gZ290byBuZXcgc3RhdGUgPSB0YWJsZVtTVEFURV1bTk9OVEVSTUlOQUxdXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUgPSB0YWJsZVtzdGFja1tzdGFjay5sZW5ndGgtMl1dW3N0YWNrW3N0YWNrLmxlbmd0aC0xXV07XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gYWNjZXB0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufX07LyogSmlzb24gZ2VuZXJhdGVkIGxleGVyICovXG52YXIgbGV4ZXIgPSAoZnVuY3Rpb24oKXtcblxudmFyIGxleGVyID0gKHtFT0Y6MSxcbnBhcnNlRXJyb3I6ZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICAgICAgaWYgKHRoaXMueXkucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgdGhpcy55eS5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbiAgICAgICAgfVxuICAgIH0sXG5zZXRJbnB1dDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRoaXMuX2xlc3MgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZToxLGZpcnN0X2NvbHVtbjowLGxhc3RfbGluZToxLGxhc3RfY29sdW1uOjB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQrPWNoO1xuICAgICAgICB0aGlzLnl5bGVuZysrO1xuICAgICAgICB0aGlzLm1hdGNoKz1jaDtcbiAgICAgICAgdGhpcy5tYXRjaGVkKz1jaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goL1xcbi8pO1xuICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZSgxKTtcbiAgICAgICAgcmV0dXJuIGNoO1xuICAgIH0sXG51bnB1dDpmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBjaCArIHRoaXMuX2lucHV0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxubW9yZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxucGFzdElucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiAocGFzdC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG51cGNvbWluZ0lucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xuICAgICAgICBpZiAobmV4dC5sZW5ndGggPCAyMCkge1xuICAgICAgICAgICAgbmV4dCArPSB0aGlzLl9pbnB1dC5zdWJzdHIoMCwgMjAtbmV4dC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dC5zdWJzdHIoMCwyMCkrKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJzonJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxuc2hvd1Bvc2l0aW9uOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZSA9IHRoaXMucGFzdElucHV0KCk7XG4gICAgICAgIHZhciBjID0gbmV3IEFycmF5KHByZS5sZW5ndGggKyAxKS5qb2luKFwiLVwiKTtcbiAgICAgICAgcmV0dXJuIHByZSArIHRoaXMudXBjb21pbmdJbnB1dCgpICsgXCJcXG5cIiArIGMrXCJeXCI7XG4gICAgfSxcbm5leHQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdG9rZW4sXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIGNvbCxcbiAgICAgICAgICAgIGxpbmVzO1xuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDtpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGNoID0gdGhpcy5faW5wdXQubWF0Y2godGhpcy5ydWxlc1tydWxlc1tpXV0pO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBtYXRjaFswXS5tYXRjaCgvXFxuLiovZyk7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHtmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vKzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgPyBsaW5lc1tsaW5lcy5sZW5ndGgtMV0ubGVuZ3RoLTEgOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArIG1hdGNoWzBdLmxlbmd0aH1cbiAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgcnVsZXNbaV0sdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0xXSk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnKyh0aGlzLnl5bGluZW5vKzEpKycuIFVucmVjb2duaXplZCB0ZXh0LlxcbicrdGhpcy5zaG93UG9zaXRpb24oKSxcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IFwiXCIsIHRva2VuOiBudWxsLCBsaW5lOiB0aGlzLnl5bGluZW5vfSk7XG4gICAgICAgIH1cbiAgICB9LFxubGV4OmZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcbiAgICAgICAgfVxuICAgIH0sXG5iZWdpbjpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG4gICAgfSxcbnBvcFN0YXRlOmZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcbiAgICB9LFxuX2N1cnJlbnRSdWxlczpmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW3RoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV1dLnJ1bGVzO1xuICAgIH0sXG50b3BTdGF0ZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTJdO1xuICAgIH0sXG5wdXNoU3RhdGU6ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuYmVnaW4oY29uZGl0aW9uKTtcbiAgICB9fSk7XG5sZXhlci5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24gYW5vbnltb3VzKHl5LHl5XywkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLFlZX1NUQVJUKSB7XG5cbnZhciBZWVNUQVRFPVlZX1NUQVJUO1xuc3dpdGNoKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcbmNhc2UgMDovKiBza2lwIHdoaXRlc3BhY2UgKi9cbmJyZWFrO1xuY2FzZSAxOnJldHVybiAyMFxuYnJlYWs7XG5jYXNlIDI6cmV0dXJuIDE5XG5icmVhaztcbmNhc2UgMzpyZXR1cm4gOFxuYnJlYWs7XG5jYXNlIDQ6cmV0dXJuIDlcbmJyZWFrO1xuY2FzZSA1OnJldHVybiA2XG5icmVhaztcbmNhc2UgNjpyZXR1cm4gN1xuYnJlYWs7XG5jYXNlIDc6cmV0dXJuIDExXG5icmVhaztcbmNhc2UgODpyZXR1cm4gMTNcbmJyZWFrO1xuY2FzZSA5OnJldHVybiAxMFxuYnJlYWs7XG5jYXNlIDEwOnJldHVybiAxMlxuYnJlYWs7XG5jYXNlIDExOnJldHVybiAxNFxuYnJlYWs7XG5jYXNlIDEyOnJldHVybiAxNVxuYnJlYWs7XG5jYXNlIDEzOnJldHVybiAxNlxuYnJlYWs7XG5jYXNlIDE0OnJldHVybiAxN1xuYnJlYWs7XG5jYXNlIDE1OnJldHVybiAxOFxuYnJlYWs7XG5jYXNlIDE2OnJldHVybiA1XG5icmVhaztcbmNhc2UgMTc6cmV0dXJuICdJTlZBTElEJ1xuYnJlYWs7XG59XG59O1xubGV4ZXIucnVsZXMgPSBbL15cXHMrLywvXlswLTldKyhcXC5bMC05XSspP1xcYi8sL15uXFxiLywvXlxcfFxcfC8sL14mJi8sL15cXD8vLC9eOi8sL148PS8sL14+PS8sL148LywvXj4vLC9eIT0vLC9ePT0vLC9eJS8sL15cXCgvLC9eXFwpLywvXiQvLC9eLi9dO1xubGV4ZXIuY29uZGl0aW9ucyA9IHtcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3XSxcImluY2x1c2l2ZVwiOnRydWV9fTtyZXR1cm4gbGV4ZXI7fSkoKVxucGFyc2VyLmxleGVyID0gbGV4ZXI7XG5yZXR1cm4gcGFyc2VyO1xufSkoKTtcbi8vIEVuZCBwYXJzZXJcblxuICAvLyBIYW5kbGUgbm9kZSwgYW1kLCBhbmQgZ2xvYmFsIHN5c3RlbXNcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSmVkO1xuICAgIH1cbiAgICBleHBvcnRzLkplZCA9IEplZDtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBKZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gTGVhayBhIGdsb2JhbCByZWdhcmRsZXNzIG9mIG1vZHVsZSBzeXN0ZW1cbiAgICByb290WydKZWQnXSA9IEplZDtcbiAgfVxuXG59KSh0aGlzKTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgaGFzaENsZWFyID0gcmVxdWlyZSgnLi9faGFzaENsZWFyJyksXG4gICAgaGFzaERlbGV0ZSA9IHJlcXVpcmUoJy4vX2hhc2hEZWxldGUnKSxcbiAgICBoYXNoR2V0ID0gcmVxdWlyZSgnLi9faGFzaEdldCcpLFxuICAgIGhhc2hIYXMgPSByZXF1aXJlKCcuL19oYXNoSGFzJyksXG4gICAgaGFzaFNldCA9IHJlcXVpcmUoJy4vX2hhc2hTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPyBlbnRyaWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA/IGVudHJpZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA/IGVudHJpZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKSxcbiAgICBzZXRDYWNoZUFkZCA9IHJlcXVpcmUoJy4vX3NldENhY2hlQWRkJyksXG4gICAgc2V0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19zZXRDYWNoZUhhcycpO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA/IHZhbHVlcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEFkZHMgdGhlIGtleS12YWx1ZSBgcGFpcmAgdG8gYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyIFRoZSBrZXktdmFsdWUgcGFpciB0byBhZGQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBtYXBgLlxuICovXG5mdW5jdGlvbiBhZGRNYXBFbnRyeShtYXAsIHBhaXIpIHtcbiAgLy8gRG9uJ3QgcmV0dXJuIGBtYXAuc2V0YCBiZWNhdXNlIGl0J3Mgbm90IGNoYWluYWJsZSBpbiBJRSAxMS5cbiAgbWFwLnNldChwYWlyWzBdLCBwYWlyWzFdKTtcbiAgcmV0dXJuIG1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNYXBFbnRyeTtcbiIsIi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIGBzZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYWRkLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgc2V0YC5cbiAqL1xuZnVuY3Rpb24gYWRkU2V0RW50cnkoc2V0LCB2YWx1ZSkge1xuICAvLyBEb24ndCByZXR1cm4gYHNldC5hZGRgIGJlY2F1c2UgaXQncyBub3QgY2hhaW5hYmxlIGluIElFIDExLlxuICBzZXQuYWRkKHZhbHVlKTtcbiAgcmV0dXJuIHNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTZXRFbnRyeTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgaWYgKGluaXRBY2N1bSAmJiBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGFycmF5WysraW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYWNjdW11bGF0b3IgPSBpdGVyYXRlZShhY2N1bXVsYXRvciwgYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiBhY2N1bXVsYXRvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVJlZHVjZTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpbml0Q2xvbmVBcnJheSA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUFycmF5JyksXG4gICAgaW5pdENsb25lQnlUYWcgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRnVsbF0gU3BlY2lmeSBhIGNsb25lIGluY2x1ZGluZyBzeW1ib2xzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGlzRnVsbCwgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QsIHN0YWNrKSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cbiAgICBpZiAoaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZU9iamVjdChpc0Z1bmMgPyB7fSA6IHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgYmFzZUNsb25lLCBpc0RlZXApO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldCh2YWx1ZSk7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQ7XG4gIH1cbiAgc3RhY2suc2V0KHZhbHVlLCByZXN1bHQpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDogKGlzRnVsbCA/IGdldEFsbEtleXMgOiBrZXlzKSh2YWx1ZSk7XG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgYXNzaWduVmFsdWUocmVzdWx0LCBrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgaXNEZWVwLCBpc0Z1bGwsIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gaXNLZXkocGF0aCwgb2JqZWN0KSA/IFtwYXRoXSA6IGNhc3RQYXRoKHBhdGgpO1xuXG4gIHZhciBpbmRleCA9IDAsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbdG9LZXkocGF0aFtpbmRleCsrXSldO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhc0luKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhc0luO1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBiYXNlSXNFcXVhbERlZXAgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbERlZXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtiaXRtYXNrXSBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLlxuICogIFRoZSBiaXRtYXNrIG1heSBiZSBjb21wb3NlZCBvZiB0aGUgZm9sbG93aW5nIGZsYWdzOlxuICogICAgIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogICAgIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0KHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYmFzZUlzRXF1YWwsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgZXF1YWxBcnJheXMgPSByZXF1aXJlKCcuL19lcXVhbEFycmF5cycpLFxuICAgIGVxdWFsQnlUYWcgPSByZXF1aXJlKCcuL19lcXVhbEJ5VGFnJyksXG4gICAgZXF1YWxPYmplY3RzID0gcmVxdWlyZSgnLi9fZXF1YWxPYmplY3RzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gW2JpdG1hc2tdIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gYXJyYXlUYWcsXG4gICAgICBvdGhUYWcgPSBhcnJheVRhZztcblxuICBpZiAoIW9iaklzQXJyKSB7XG4gICAgb2JqVGFnID0gZ2V0VGFnKG9iamVjdCk7XG4gICAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIH1cbiAgaWYgKCFvdGhJc0Fycikge1xuICAgIG90aFRhZyA9IGdldFRhZyhvdGhlcik7XG4gICAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG4gIH1cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbERlZXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY29tcGFyaXNvbiBzdHlsZXMuICovXG52YXIgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyA9IDEsXG4gICAgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBjdXN0b21pemVyLCBVTk9SREVSRURfQ09NUEFSRV9GTEFHIHwgUEFSVElBTF9DT01QQVJFX0ZMQUcsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyksXG4gICAgYmFzZU1hdGNoZXNQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICAvLyBEb24ndCBzdG9yZSB0aGUgYHR5cGVvZmAgcmVzdWx0IGluIGEgdmFyaWFibGUgdG8gYXZvaWQgYSBKSVQgYnVnIGluIFNhZmFyaSA5LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NjAzNCBmb3IgbW9yZSBkZXRhaWxzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUl0ZXJhdGVlO1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShwYXRoLCBzcmNWYWx1ZSkge1xuICBpZiAoaXNLZXkocGF0aCkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKHNyY1ZhbHVlKSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSh0b0tleShwYXRoKSwgc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBnZXQob2JqZWN0LCBwYXRoKTtcbiAgICByZXR1cm4gKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgb2JqVmFsdWUgPT09IHNyY1ZhbHVlKVxuICAgICAgPyBoYXNJbihvYmplY3QsIHBhdGgpXG4gICAgICA6IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgdW5kZWZpbmVkLCBVTk9SREVSRURfQ09NUEFSRV9GTEFHIHwgUEFSVElBTF9DT01QQVJFX0ZMQUcpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzUHJvcGVydHk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eTtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVByb3BlcnR5YCB3aGljaCBzdXBwb3J0cyBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eURlZXAocGF0aCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHlEZWVwO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FjaGVIYXM7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHN0cmluZ1RvUGF0aCA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvUGF0aCcpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCJ2YXIgYWRkTWFwRW50cnkgPSByZXF1aXJlKCcuL19hZGRNYXBFbnRyeScpLFxuICAgIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9fYXJyYXlSZWR1Y2UnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvbmVGdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIG1hcC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVNYXAobWFwLCBpc0RlZXAsIGNsb25lRnVuYykge1xuICB2YXIgYXJyYXkgPSBpc0RlZXAgPyBjbG9uZUZ1bmMobWFwVG9BcnJheShtYXApLCB0cnVlKSA6IG1hcFRvQXJyYXkobWFwKTtcbiAgcmV0dXJuIGFycmF5UmVkdWNlKGFycmF5LCBhZGRNYXBFbnRyeSwgbmV3IG1hcC5jb25zdHJ1Y3Rvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVNYXA7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIGFkZFNldEVudHJ5ID0gcmVxdWlyZSgnLi9fYWRkU2V0RW50cnknKSxcbiAgICBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU2V0KHNldCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKHNldFRvQXJyYXkoc2V0KSwgdHJ1ZSkgOiBzZXRUb0FycmF5KHNldCk7XG4gIHJldHVybiBhcnJheVJlZHVjZShhcnJheSwgYWRkU2V0RW50cnksIG5ldyBzZXQuY29uc3RydWN0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGBzeW1ib2xgIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHN5bWJvbCBUaGUgc3ltYm9sIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzeW1ib2wgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjbG9uZVN5bWJvbChzeW1ib2wpIHtcbiAgcmV0dXJuIHN5bWJvbFZhbHVlT2YgPyBPYmplY3Qoc3ltYm9sVmFsdWVPZi5jYWxsKHN5bWJvbCkpIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTeW1ib2w7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHR5cGVkQXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdHlwZWRBcnJheSBUaGUgdHlwZWQgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHR5cGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZVR5cGVkQXJyYXkodHlwZWRBcnJheSwgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKHR5cGVkQXJyYXkuYnVmZmVyKSA6IHR5cGVkQXJyYXkuYnVmZmVyO1xuICByZXR1cm4gbmV3IHR5cGVkQXJyYXkuY29uc3RydWN0b3IoYnVmZmVyLCB0eXBlZEFycmF5LmJ5dGVPZmZzZXQsIHR5cGVkQXJyYXkubGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVR5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5QXJyYXk7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpO1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICB2YXIgaXNOZXcgPSAhb2JqZWN0O1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIHN5bWJvbCBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlTb21lID0gcmVxdWlyZSgnLi9fYXJyYXlTb21lJyksXG4gICAgY2FjaGVIYXMgPSByZXF1aXJlKCcuL19jYWNoZUhhcycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEFycmF5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICogIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBVTk9SREVSRURfQ09NUEFSRV9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0ga2V5cyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIga2V5ID0gcmVzdWx0W2xlbmd0aF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICByZXN1bHRbbGVuZ3RoXSA9IFtrZXksIHZhbHVlLCBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hdGNoRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFByb3RvdHlwZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2wgcHJvcGVydGllcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9IG5hdGl2ZUdldFN5bWJvbHMgPyBvdmVyQXJnKG5hdGl2ZUdldFN5bWJvbHMsIE9iamVjdCkgOiBzdHViQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVNYXAgPSByZXF1aXJlKCcuL19jbG9uZU1hcCcpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVNldCA9IHJlcXVpcmUoJy4vX2Nsb25lU2V0JyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGNsb25lRnVuYywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVNYXAob2JqZWN0LCBpc0RlZXAsIGNsb25lRnVuYyk7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIGNsb25lU2V0KG9iamVjdCwgaXNEZWVwLCBjbG9uZUZ1bmMpO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUgYW5kIG5vdCBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleSh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAhaXNPYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaWN0Q29tcGFyYWJsZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFRvQXJyYXk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgbWF0Y2hlc1Byb3BlcnR5YCBmb3Igc291cmNlIHZhbHVlcyBzdWl0YWJsZVxuICogZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKGtleSwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHNyY1ZhbHVlICYmXG4gICAgICAoc3JjVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIE9iamVjdChvYmplY3QpKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUxlYWRpbmdEb3QgPSAvXlxcLi8sXG4gICAgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemVDYXBwZWQoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG5cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAocmVMZWFkaW5nRG90LnRlc3Qoc3RyaW5nKSkge1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgfVxuICBzdHJpbmcucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1RvUGF0aDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYHZhbHVlYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cHM6Ly9tZG4uaW8vU3RydWN0dXJlZF9jbG9uZV9hbGdvcml0aG0pXG4gKiBhbmQgc3VwcG9ydHMgY2xvbmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLCBkYXRlIG9iamVjdHMsIG1hcHMsXG4gKiBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLCBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWRcbiAqIGFycmF5cy4gVGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhcmUgY2xvbmVkXG4gKiBhcyBwbGFpbiBvYmplY3RzLiBBbiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoXG4gKiBhcyBlcnJvciBvYmplY3RzLCBmdW5jdGlvbnMsIERPTSBub2RlcywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKiBAc2VlIF8uY2xvbmVEZWVwXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZShvYmplY3RzKTtcbiAqIGNvbnNvbGUubG9nKHNoYWxsb3dbMF0gPT09IG9iamVjdHNbMF0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBmYWxzZSwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoUmlnaHRcbiAqIEBleGFtcGxlXG4gKlxuICogXy5mb3JFYWNoKFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAxYCB0aGVuIGAyYC5cbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaCA6IGJhc2VFYWNoO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXNcbiAqIGB1bmRlZmluZWRgLCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgcmV0dXJuZWQgaW4gaXRzIHBsYWNlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy43LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBmb3IgYHVuZGVmaW5lZGAgcmVzb2x2ZWQgdmFsdWVzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2FbMF0uYi5jJyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCBbJ2EnLCAnMCcsICdiJywgJ2MnXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCAnYS5iLmMnLCAnZGVmYXVsdCcpO1xuICogLy8gPT4gJ2RlZmF1bHQnXG4gKi9cbmZ1bmN0aW9uIGdldChvYmplY3QsIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG4iLCJ2YXIgYmFzZUhhcyA9IHJlcXVpcmUoJy4vX2Jhc2VIYXMnKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IHsgJ2InOiAyIH0gfTtcbiAqIHZhciBvdGhlciA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvdGhlciwgJ2EnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhcyhvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXM7XG4iLCJ2YXIgYmFzZUhhc0luID0gcmVxdWlyZSgnLi9fYmFzZUhhc0luJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IG9yIGluaGVyaXRlZCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdiJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXNJbihvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc0luO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBpc09iamVjdCh2YWx1ZSkgPyBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGVcbiAqIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoZSBmaXJzdCBhcmd1bWVudFxuICogcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIG1hcCBjYWNoZSBrZXkuIFRoZSBgZnVuY2BcbiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICpcbiAqICoqTm90ZToqKiBUaGUgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWRcbiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYFxuICogY29uc3RydWN0b3Igd2l0aCBvbmUgd2hvc2UgaW5zdGFuY2VzIGltcGxlbWVudCB0aGVcbiAqIFtgTWFwYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcHJvcGVydGllcy1vZi10aGUtbWFwLXByb3RvdHlwZS1vYmplY3QpXG4gKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dCAqL1xuXG52YXIgbWF0Y2hTdHJpbmdXaXRoUmVnZXggPSByZXF1aXJlKCBcIi4vbWF0Y2hTdHJpbmdXaXRoUmVnZXguanNcIiApO1xuXG4vKipcbiAqIENoZWNrcyB0aGUgdGV4dCBmb3IgaW1hZ2VzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0c3RyaW5nIHRvIGNoZWNrIGZvciBpbWFnZXNcbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgY29udGFpbmluZyBhbGwgdHlwZXMgb2YgZm91bmQgaW1hZ2VzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHJldHVybiBtYXRjaFN0cmluZ1dpdGhSZWdleCggdGV4dCwgXCI8aW1nKD86W14+XSspPz5cIiApO1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvbWF0Y2hTdHJpbmdXaXRoUmVnZXggKi9cblxuLyoqXG4gKiBDaGVja3MgYSBzdHJpbmcgd2l0aCBhIHJlZ2V4LCByZXR1cm4gYWxsIG1hdGNoZXMgZm91bmQgd2l0aCB0aGF0IHJlZ2V4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIG1hdGNoIHRoZVxuICogQHBhcmFtIHtTdHJpbmd9IHJlZ2V4U3RyaW5nIEEgc3RyaW5nIHRvIHVzZSBhcyByZWdleC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgd2l0aCBtYXRjaGVzLCBlbXB0eSBhcnJheSBpZiBubyBtYXRjaGVzIGZvdW5kLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0LCByZWdleFN0cmluZyApIHtcblx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCggcmVnZXhTdHJpbmcsIFwiaWdcIiApO1xuXHR2YXIgbWF0Y2hlcyA9IHRleHQubWF0Y2goIHJlZ2V4ICk7XG5cblx0aWYgKCBtYXRjaGVzID09PSBudWxsICkge1xuXHRcdG1hdGNoZXMgPSBbXTtcblx0fVxuXG5cdHJldHVybiBtYXRjaGVzO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRGYWNlYm9va1ByZXZpZXc6IHJlcXVpcmUoIFwiLi9qcy9mYWNlYm9va1ByZXZpZXdcIiApLFxuXHRUd2l0dGVyUHJldmlldzogcmVxdWlyZSggXCIuL2pzL3R3aXR0ZXJQcmV2aWV3XCIgKVxufTtcbiIsInZhciBwbGFjZWhvbGRlclRlbXBsYXRlID0gcmVxdWlyZSggXCIuLi90ZW1wbGF0ZXNcIiApLmltYWdlUGxhY2Vob2xkZXI7XG5cbi8qKlxuICogU2V0cyB0aGUgcGxhY2Vob2xkZXIgd2l0aCBhIGdpdmVuIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZUNvbnRhaW5lciBUaGUgbG9jYXRpb24gdG8gcHV0IHRoZSBwbGFjZWhvbGRlciBpbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGFjZWhvbGRlciBUaGUgdmFsdWUgZm9yIHRoZSBwbGFjZWhvbGRlci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNFcnJvciBXaGVuIHRoZSBwbGFjZWhvbGRlciBzaG91bGQgYW4gZXJyb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kaWZpZXIgQSBjc3MgY2xhc3MgbW9kaWZpZXIgdG8gY2hhbmdlIHRoZSBzdHlsaW5nLlxuICovXG5mdW5jdGlvbiBzZXRJbWFnZVBsYWNlaG9sZGVyKCBpbWFnZUNvbnRhaW5lciwgcGxhY2Vob2xkZXIsIGlzRXJyb3IsIG1vZGlmaWVyICkge1xuXHR2YXIgY2xhc3NOYW1lcyA9IFsgXCJzb2NpYWwtaW1hZ2UtcGxhY2Vob2xkZXJcIiBdO1xuXHRpc0Vycm9yID0gaXNFcnJvciB8fCBmYWxzZTtcblx0bW9kaWZpZXIgPSBtb2RpZmllciB8fCBcIlwiO1xuXG5cdGlmICggaXNFcnJvciApIHtcblx0XHRjbGFzc05hbWVzLnB1c2goIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyLS1lcnJvclwiICk7XG5cdH1cblxuXHRpZiAoIFwiXCIgIT09IG1vZGlmaWVyICkge1xuXHRcdGNsYXNzTmFtZXMucHVzaCggXCJzb2NpYWwtaW1hZ2UtcGxhY2Vob2xkZXItLVwiICsgbW9kaWZpZXIgKTtcblx0fVxuXG5cdGltYWdlQ29udGFpbmVyLmlubmVySFRNTCA9IHBsYWNlaG9sZGVyVGVtcGxhdGUoIHtcblx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZXMuam9pbiggXCIgXCIgKSxcblx0XHRwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXJcblx0fSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cz0gc2V0SW1hZ2VQbGFjZWhvbGRlcjtcbiIsInZhciBpc0VtcHR5ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VtcHR5XCIgKTtcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoIFwibG9kYXNoL2Z1bmN0aW9uL2RlYm91bmNlXCIgKTtcblxudmFyIHN0cmlwSFRNTFRhZ3MgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qc1wiICk7XG52YXIgc3RyaXBTcGFjZXMgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanNcIiApO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBmaWVsZCBhbmQgc2V0cyB0aGUgZXZlbnRzIGZvciB0aGF0IGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dEZpZWxkIFRoZSBmaWVsZCB0byByZXByZXNlbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gdXNlLlxuICogQHBhcmFtIHtPYmplY3R8dW5kZWZpbmVkfSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZWQgYWZ0ZXIgZmllbGQgY2hhbmdlLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIElucHV0RWxlbWVudCggaW5wdXRGaWVsZCwgdmFsdWVzLCBjYWxsYmFjayApIHtcblx0dGhpcy5pbnB1dEZpZWxkID0gaW5wdXRGaWVsZDtcblx0dGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cdHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cblx0dGhpcy5zZXRWYWx1ZSggdGhpcy5nZXRJbnB1dFZhbHVlKCkgKTtcblxuXHR0aGlzLmJpbmRFdmVudHMoKTtcbn1cblxuLyoqXG4gKiBCaW5kcyB0aGUgZXZlbnRzXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBTZXQgdGhlIGV2ZW50cy5cblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5ZG93blwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJrZXl1cFwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImlucHV0XCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImZvY3VzXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImJsdXJcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcbn07XG5cbi8qKlxuICogRG8gdGhlIGNoYW5nZSBldmVudFxuICpcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5jaGFuZ2VFdmVudCA9IGRlYm91bmNlKCBmdW5jdGlvbigpIHtcblx0Ly8gV2hlbiB0aGVyZSBpcyBhIGNhbGxiYWNrIHJ1biBpdC5cblx0aWYgKCB0eXBlb2YgdGhpcy5fY2FsbGJhY2sgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0dGhpcy5fY2FsbGJhY2soKTtcblx0fVxuXG5cdHRoaXMuc2V0VmFsdWUoIHRoaXMuZ2V0SW5wdXRWYWx1ZSgpICk7XG59LCAyNSApO1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY3VycmVudCBmaWVsZCB2YWx1ZVxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmdldElucHV0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0cyB0aGUgYSB2YWx1ZSBmb3IgdGhlIHByZXZpZXcuIElmIHZhbHVlIGlzIGVtcHR5IGEgc2FtcGxlIHZhbHVlIGlzIHVzZWRcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHRpdGxlLCB3aXRob3V0IGh0bWwgdGFncy5cbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5mb3JtYXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG5cblx0dmFsdWUgPSBzdHJpcEhUTUxUYWdzKCB2YWx1ZSApO1xuXG5cdC8vIEFzIGFuIHVsdGltYXRlIGZhbGxiYWNrIHByb3ZpZGUgdGhlIHVzZXIgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZS5cblx0aWYgKCBpc0VtcHR5KCB2YWx1ZSApICkge1xuXHRcdHZhbHVlID0gdGhpcy52YWx1ZXMuZmFsbGJhY2s7XG5cdH1cblxuXHRyZXR1cm4gc3RyaXBTcGFjZXMoIHZhbHVlICk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm4gdGhlIHZhbHVlIG9yIGdldCBhIGZhbGxiYWNrIG9uZS5cbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdmFsdWUgPSB0aGlzLnZhbHVlcy5jdXJyZW50VmFsdWU7XG5cblx0Ly8gRmFsbGJhY2sgdG8gdGhlIGRlZmF1bHQgaWYgdmFsdWUgaXMgZW1wdHkuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLmRlZmF1bHRWYWx1ZTtcblx0fVxuXG5cdC8vIEZvciByZW5kZXJpbmcgd2UgY2FuIGZhbGxiYWNrIHRvIHRoZSBwbGFjZWhvbGRlciBhcyB3ZWxsLlxuXHRpZiAoIGlzRW1wdHkoIHZhbHVlICkgKSB7XG5cdFx0dmFsdWUgPSB0aGlzLnZhbHVlcy5wbGFjZWhvbGRlcjtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjdXJyZW50IHZhbHVlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXRcbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0dGhpcy52YWx1ZXMuY3VycmVudFZhbHVlID0gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0RWxlbWVudDtcblxuIiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxudmFyIGlzRWxlbWVudCA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvaXNFbGVtZW50XCIgKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvY2xvbmVcIiApO1xudmFyIGRlZmF1bHRzRGVlcCA9IHJlcXVpcmUoIFwibG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXBcIiApO1xuXG52YXIgSmVkID0gcmVxdWlyZSggXCJqZWRcIiApO1xuXG52YXIgaW1hZ2VEaXNwbGF5TW9kZSA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2ltYWdlRGlzcGxheU1vZGVcIiApO1xudmFyIHJlbmRlckRlc2NyaXB0aW9uID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvcmVuZGVyRGVzY3JpcHRpb25cIiApO1xudmFyIGltYWdlUGxhY2Vob2xkZXIgID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlclwiICk7XG52YXIgYmVtQWRkTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vYWRkTW9kaWZpZXJcIiApO1xudmFyIGJlbVJlbW92ZU1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL3JlbW92ZU1vZGlmaWVyXCIgKTtcblxudmFyIFRleHRGaWVsZCA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dElucHV0XCIgKTtcbnZhciBUZXh0QXJlYSA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dGFyZWFcIiApO1xuXG52YXIgSW5wdXRFbGVtZW50ID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW5wdXRcIiApO1xudmFyIFByZXZpZXdFdmVudHMgPSByZXF1aXJlKCBcIi4vcHJldmlldy9ldmVudHNcIiApO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSggXCIuL3RlbXBsYXRlcy5qc1wiICk7XG52YXIgZmFjZWJvb2tFZGl0b3JUZW1wbGF0ZSA9IHRlbXBsYXRlcy5mYWNlYm9va1ByZXZpZXc7XG52YXIgZmFjZWJvb2tBdXRob3JUZW1wbGF0ZSA9IHRlbXBsYXRlcy5mYWNlYm9va0F1dGhvcjtcblxudmFyIGZhY2Vib29rRGVmYXVsdHMgPSB7XG5cdGRhdGE6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRkZWZhdWx0VmFsdWU6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRiYXNlVVJMOiBcImV4YW1wbGUuY29tXCIsXG5cdGNhbGxiYWNrczoge1xuXHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCkge30sXG5cdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdHJldHVybiB0aXRsZTtcblx0XHR9LFxuXHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdFx0fSxcblx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0cmV0dXJuIGltYWdlVXJsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGlucHV0RmFjZWJvb2tQcmV2aWV3QmluZGluZ3MgPSBbXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X190aXRsZS0tZmFjZWJvb2tcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJ0aXRsZVwiXG5cdH0sXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJpbWFnZVVybFwiXG5cdH0sXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tZmFjZWJvb2tcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJkZXNjcmlwdGlvblwiXG5cdH1cbl07XG5cbnZhciBXSURUSF9GQUNFQk9PS19JTUFHRV9TTUFMTCA9IDE1ODtcbnZhciBXSURUSF9GQUNFQk9PS19JTUFHRV9MQVJHRSA9IDQ3MDtcblxudmFyIEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9XSURUSCA9IDIwMDtcbnZhciBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfSEVJR0hUID0gMjAwO1xuXG52YXIgRkFDRUJPT0tfSU1BR0VfVEhSRVNIT0xEX1dJRFRIID0gNjAwO1xudmFyIEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFQgPSAzMTU7XG5cbi8qKlxuICogQG1vZHVsZSBzbmlwcGV0UHJldmlld1xuICovXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29uZmlnIGFuZCBvdXRwdXRUYXJnZXQgZm9yIHRoZSBTbmlwcGV0UHJldmlld1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFNuaXBwZXQgcHJldmlldyBvcHRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlciAgICAgICAgICAgICAgIC0gVGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBmb3IgdGhlIGZpZWxkcywgd2lsbCBiZSBzaG93biBhc1xuICogYWN0dWFsIHBsYWNlaG9sZGVycyBpbiB0aGUgaW5wdXRzIGFuZCBhcyBhIGZhbGxiYWNrIGZvciB0aGUgcHJldmlldy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIudGl0bGUgICAgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgdGl0bGUgZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGRlc2NyaXB0aW9uIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBpbWFnZSB1cmwgZmllbGQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUgICAgICAgICAgICAgIC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoZSBmaWVsZHMsIGlmIHRoZSB1c2VyIGhhcyBub3RcbiAqIGNoYW5nZWQgYSBmaWVsZCwgdGhpcyB2YWx1ZSB3aWxsIGJlIHVzZWQgZm9yIHRoZSBhbmFseXplciwgcHJldmlldyBhbmQgdGhlIHByb2dyZXNzIGJhcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSAgICAgICAgLSBEZWZhdWx0IHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gIC0gRGVmYXVsdCBkZXNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsICAgICAtIERlZmF1bHQgaW1hZ2UgdXJsLlxuICogaXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5iYXNlVVJMICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiBGYWNlYm9vay5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICAgIG9wdHMudGFyZ2V0RWxlbWVudCAgICAgICAgICAgICAtIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5jYWxsYmFja3MgICAgICAgICAgICAgICAgIC0gRnVuY3Rpb25zIHRoYXQgYXJlIGNhbGxlZCBvbiBzcGVjaWZpYyBpbnN0YW5jZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBvcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3IC0gRnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHNvY2lhbCBwcmV2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGkxOG4gb2JqZWN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGkxOG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0RWxlbWVudCAgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50ICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgZWxlbWVudHMgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50LnJlbmRlcmVkICAgICAgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLnRpdGxlICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdGl0bGUgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuaW1hZ2VVcmwgICAgICAtIFRoZSByZW5kZXJlZCB1cmwgcGF0aCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbiAgIC0gVGhlIHJlbmRlcmVkIEZhY2Vib29rIGRlc2NyaXB0aW9uIGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5pbnB1dCAgICAgICAgICAgICAgICAgIC0gVGhlIGlucHV0IGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC50aXRsZSAgICAgICAgICAgIC0gVGhlIHRpdGxlIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmltYWdlVXJsICAgICAgICAgLSBUaGUgdXJsIHBhdGggaW5wdXQgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQuZGVzY3JpcHRpb24gICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uIGlucHV0IGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5jb250YWluZXIgICAgICAgICAgICAgIC0gVGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmZvcm1Db250YWluZXIgICAgICAgICAgLSBUaGUgZm9ybSBjb250YWluZXIgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuZWRpdFRvZ2dsZSAgICAgICAgICAgICAtIFRoZSBidXR0b24gdGhhdCB0b2dnbGVzIHRoZSBlZGl0b3IgZm9ybS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBkYXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgZGF0YSBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEudGl0bGUgICAgICAgICAgICAgICAgICAgICAtIFRoZSB0aXRsZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEuaW1hZ2VVcmwgICAgICAgICAgICAgICAgICAtIFRoZSB1cmwgcGF0aC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEuZGVzY3JpcHRpb24gICAgICAgICAgICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGJhc2VVUkwgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gZ29vZ2xlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgRmFjZWJvb2tQcmV2aWV3ID0gZnVuY3Rpb24oIG9wdHMsIGkxOG4gKSB7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cblx0ZmFjZWJvb2tEZWZhdWx0cy5wbGFjZWhvbGRlciA9IHtcblx0XHR0aXRsZTogdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlRoaXMgaXMgYW4gZXhhbXBsZSB0aXRsZSAtIGVkaXQgYnkgY2xpY2tpbmcgaGVyZVwiICksXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJNb2RpZnkgeW91ciAlMSRzIGRlc2NyaXB0aW9uIGJ5IGVkaXRpbmcgaXQgcmlnaHQgaGVyZVwiICksXG5cdFx0XHRcIkZhY2Vib29rXCJcblx0XHQpLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH07XG5cblx0ZGVmYXVsdHNEZWVwKCBvcHRzLCBmYWNlYm9va0RlZmF1bHRzICk7XG5cblx0aWYgKCAhaXNFbGVtZW50KCBvcHRzLnRhcmdldEVsZW1lbnQgKSApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiVGhlIEZhY2Vib29rIHByZXZpZXcgcmVxdWlyZXMgYSB2YWxpZCB0YXJnZXQgZWxlbWVudFwiICk7XG5cdH1cblxuXHR0aGlzLmRhdGEgPSBvcHRzLmRhdGE7XG5cdHRoaXMub3B0cyA9IG9wdHM7XG5cblxuXHR0aGlzLl9jdXJyZW50Rm9jdXMgPSBudWxsO1xuXHR0aGlzLl9jdXJyZW50SG92ZXIgPSBudWxsO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBpMThuIG9iamVjdCBiYXNlZCBvbiBwYXNzZWQgY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2xhdGlvbnMgLSBUaGUgdmFsdWVzIHRvIHRyYW5zbGF0ZS5cbiAqXG4gKiBAcmV0dXJucyB7SmVkfSAtIFRoZSBKZWQgdHJhbnNsYXRpb24gb2JqZWN0LlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmNvbnN0cnVjdEkxOG4gPSBmdW5jdGlvbiggdHJhbnNsYXRpb25zICkge1xuXHR2YXIgZGVmYXVsdFRyYW5zbGF0aW9ucyA9IHtcblx0XHRcImRvbWFpblwiOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdFwibG9jYWxlX2RhdGFcIjoge1xuXHRcdFx0XCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjoge1xuXHRcdFx0XHRcIlwiOiB7fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR0cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbnMgfHwge307XG5cblx0ZGVmYXVsdHNEZWVwKCB0cmFuc2xhdGlvbnMsIGRlZmF1bHRUcmFuc2xhdGlvbnMgKTtcblxuXHRyZXR1cm4gbmV3IEplZCggdHJhbnNsYXRpb25zICk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgdGhlIHRlbXBsYXRlIGFuZCBiaW5kIHRoZSBldmVudHMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbmRlclRlbXBsYXRlKCk7XG5cdHRoaXMuYmluZEV2ZW50cygpO1xuXHR0aGlzLnVwZGF0ZVByZXZpZXcoKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyBzbmlwcGV0IGVkaXRvciBhbmQgYWRkcyBpdCB0byB0aGUgdGFyZ2V0RWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdHRhcmdldEVsZW1lbnQuaW5uZXJIVE1MID0gZmFjZWJvb2tFZGl0b3JUZW1wbGF0ZSgge1xuXHRcdHJlbmRlcmVkOiB7XG5cdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdFx0aW1hZ2VVcmw6IFwiXCIsXG5cdFx0XHRiYXNlVXJsOiB0aGlzLm9wdHMuYmFzZVVSTFxuXHRcdH0sXG5cdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlcixcblx0XHRpMThuOiB7XG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0ZWRpdDogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJFZGl0ICUxJHMgcHJldmlld1wiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHNuaXBwZXRQcmV2aWV3OiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgcHJldmlld1wiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHNuaXBwZXRFZGl0b3I6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBlZGl0b3JcIiApLCBcIkZhY2Vib29rXCIgKVxuXHRcdH1cblx0fSApO1xuXG5cdHRoaXMuZWxlbWVudCA9IHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stdGl0bGVcIiApWzBdLFxuXHRcdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stZGVzY3JpcHRpb25cIiApWzBdXG5cdFx0fSxcblx0XHRmaWVsZHM6IHRoaXMuZ2V0RmllbGRzKCksXG5cdFx0Y29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlldy0tZmFjZWJvb2tcIiApWzBdLFxuXHRcdGZvcm1Db250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybVwiIClbMF0sXG5cdFx0ZWRpdFRvZ2dsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19lZGl0LWJ1dHRvblwiIClbMF0sXG5cdFx0Zm9ybUZpZWxkczogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtLWZpZWxkXCIgKSxcblx0XHRoZWFkaW5nRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yXCIgKVswXSxcblx0XHRhdXRob3JDb250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stYXV0aG9yXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMuZWxlbWVudC5maWVsZHMuaW1hZ2VVcmwucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMudGl0bGUucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMuZGVzY3JpcHRpb24ucmVuZGVyKCk7XG5cblx0dGhpcy5lbGVtZW50LmlucHV0ID0ge1xuXHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItdGl0bGVcIiApWzBdLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWzBdXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMgPSB0aGlzLmdldEZpZWxkRWxlbWVudHMoKTtcblx0dGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yID0gdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19zdWJtaXRcIiApWzBdO1xuXG5cdHRoaXMuZWxlbWVudC5sYWJlbCA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LmlucHV0LnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRoaXMuZWxlbWVudC5pbnB1dC5pbWFnZVVybC5wYXJlbnROb2RlLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQuaW5wdXQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5wcmV2aWV3ID0ge1xuXHRcdHRpdGxlOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQudGl0bGUucGFyZW50Tm9kZSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiIClbMF0sXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbi5wYXJlbnROb2RlXG5cdH07XG5cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZm9ybSBmaWVsZHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogKiwgZGVzY3JpcHRpb246ICosIGltYWdlVXJsOiAqLCBidXR0b246IEJ1dHRvbn19IE9iamVjdCB3aXRoIHRoZSBmaWVsZHMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX3RpdGxlIGpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItdGl0bGVcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgdGl0bGVcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGRlc2NyaXB0aW9uOiBuZXcgVGV4dEFyZWEoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2Rlc2NyaXB0aW9uIGpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZGVzY3JpcHRpb25cIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGltYWdlVXJsOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19pbWFnZVVybCBqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGltYWdlXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBmaWVsZCBlbGVtZW50cy5cbiAqXG4gKiBAcmV0dXJucyB7e3RpdGxlOiBJbnB1dEVsZW1lbnQsIGRlc2NyaXB0aW9uOiBJbnB1dEVsZW1lbnQsIGltYWdlVXJsOiBJbnB1dEVsZW1lbnR9fSBUaGUgZmllbGQgZWxlbWVudHMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItdGl0bGVcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0XHRmYWxsYmFjazogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIHRpdGxlIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHRcIkZhY2Vib29rXCJcblx0XHRcdFx0KVxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpLFxuXHRcdGRlc2NyaXB0aW9uOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbixcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHRpbWFnZVVybDogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHRcdGZhbGxiYWNrOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdClcblx0fTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBGYWNlYm9vayBwcmV2aWV3LlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnVwZGF0ZVByZXZpZXcgPSBmdW5jdGlvbigpIHtcblx0Ly8gVXBkYXRlIHRoZSBkYXRhLlxuXHR0aGlzLmRhdGEudGl0bGUgPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldElucHV0VmFsdWUoKTtcblx0dGhpcy5kYXRhLmltYWdlVXJsID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuaW1hZ2VVcmwuZ2V0SW5wdXRWYWx1ZSgpO1xuXG5cdC8vIFNldHMgdGhlIHRpdGxlIGZpZWxkXG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblx0dGhpcy5zZXRUaXRsZSggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldCB0aGUgZGVzY3JpcHRpb24gZmllbGQgYW5kIHBhcnNlIHRoZSBzdHlsaW5nIG9mIGl0LlxuXHR0aGlzLnNldERlc2NyaXB0aW9uKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRWYWx1ZSgpICk7XG5cblx0Ly8gU2V0cyB0aGUgSW1hZ2Vcblx0dGhpcy5zZXRJbWFnZSggdGhpcy5kYXRhLmltYWdlVXJsICk7XG5cblx0Ly8gQ2xvbmUgc28gdGhlIGRhdGEgaXNuJ3QgY2hhbmdlYWJsZS5cblx0dGhpcy5vcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3KCBjbG9uZSggdGhpcy5kYXRhICkgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyB0aXRsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIHRvIHNldFxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFRpdGxlID0gZnVuY3Rpb24oIHRpdGxlICkge1xuXHR0aXRsZSA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5VGl0bGUoIHRpdGxlICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcmV2aWV3IGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgZGVzY3JpcHRpb24gdG8gc2V0XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdGRlc2NyaXB0aW9uID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlEZXNjcmlwdGlvbiggZGVzY3JpcHRpb24gKTtcblxuXHR0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gZGVzY3JpcHRpb247XG5cdHJlbmRlckRlc2NyaXB0aW9uKCB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24sIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldElucHV0VmFsdWUoKSApO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbWFnZSBjb250YWluZXIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29udGFpbmVyIHRoYXQgd2lsbCBob2xkIHRoZSBpbWFnZS5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5nZXRJbWFnZUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGltYWdlIG9iamVjdCB3aXRoIHRoZSBuZXcgVVJMLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZVVybCBUaGUgaW1hZ2UgcGF0aC5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24gKCBpbWFnZVVybCApIHtcblx0aW1hZ2VVcmwgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeUltYWdlVXJsKCBpbWFnZVVybCApO1xuXG5cdGlmICggaW1hZ2VVcmwgPT09IFwiXCIgJiYgdGhpcy5kYXRhLmltYWdlVXJsID09PSBcIlwiICkge1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0cmV0dXJuIHRoaXMubm9VcmxTZXQoKTtcblx0fVxuXG5cdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCB0aGlzLmlzVG9vU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2VUb29TbWFsbCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U2l6aW5nQ2xhc3MoIGltZyApO1xuXHRcdHRoaXMuYWRkSW1hZ2VUb0NvbnRhaW5lciggaW1hZ2VVcmwgKTtcblx0fS5iaW5kKCB0aGlzICk7XG5cblx0aW1nLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHJldHVybiB0aGlzLmltYWdlRXJyb3IoKTtcblx0fS5iaW5kKCB0aGlzICk7XG5cblx0Ly8gTG9hZCBpbWFnZSB0byB0cmlnZ2VyIGxvYWQgb3IgZXJyb3IgZXZlbnQuXG5cdGltZy5zcmMgPSBpbWFnZVVybDtcbn07XG5cbi8qKlxuICogRGlzcGxheXMgdGhlIE5vIFVSTCBTZXQgd2FybmluZy5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLm5vVXJsU2V0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aW1hZ2VQbGFjZWhvbGRlcihcblx0XHR0aGlzLmdldEltYWdlQ29udGFpbmVyKCksXG5cdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBzZWxlY3QgYW4gaW1hZ2UgYnkgY2xpY2tpbmcgaGVyZVwiICksXG5cdFx0ZmFsc2UsXG5cdFx0XCJmYWNlYm9va1wiXG5cdCk7XG5cblx0cmV0dXJuO1xufTtcblxuLyoqXG4gKiBEaXNwbGF5cyB0aGUgSW1hZ2UgVG9vIFNtYWxsIGVycm9yLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuaW1hZ2VUb29TbWFsbCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbWVzc2FnZTtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHRtZXNzYWdlID0gdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiV2UgYXJlIHVuYWJsZSB0byBkZXRlY3QgYW4gaW1hZ2UgXCIgK1xuXHRcdFx0XHRcImluIHlvdXIgcG9zdCB0aGF0IGlzIGxhcmdlIGVub3VnaCB0byBiZSBkaXNwbGF5ZWQgb24gRmFjZWJvb2suIFdlIGFkdmlzZSB5b3UgXCIgK1xuXHRcdFx0XHRcInRvIHNlbGVjdCBhICUxJHMgaW1hZ2UgdGhhdCBmaXRzIHRoZSByZWNvbW1lbmRlZCBpbWFnZSBzaXplLlwiICksXG5cdFx0XHRcIkZhY2Vib29rXCJcblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdG1lc3NhZ2UgPSB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdC8qIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJUaGUgaW1hZ2UgeW91IHNlbGVjdGVkIGlzIHRvbyBzbWFsbCBmb3IgJTEkc1wiICksXG5cdFx0XHRcIkZhY2Vib29rXCJcblx0XHQpO1xuXHR9XG5cblx0aW1hZ2VQbGFjZWhvbGRlcihcblx0XHR0aGlzLmdldEltYWdlQ29udGFpbmVyKCksXG5cdFx0bWVzc2FnZSxcblx0XHR0cnVlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogRGlzcGxheXMgdGhlIFVybCBDYW5ub3QgQmUgTG9hZGVkIGVycm9yLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuaW1hZ2VFcnJvciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJUaGUgZ2l2ZW4gaW1hZ2UgdXJsIGNhbm5vdCBiZSBsb2FkZWRcIiApLFxuXHRcdHRydWUsXG5cdFx0XCJmYWNlYm9va1wiXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGltYWdlIG9mIHRoZSBpbWFnZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2UgVGhlIGltYWdlIHRvIHVzZS5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGFpbmVyID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBpbWFnZSArIFwiKVwiO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250YWluZXIuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjb250YWluZXIgPSB0aGlzLmdldEltYWdlQ29udGFpbmVyKCk7XG5cblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwiXCI7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByb3BlciBDU1MgY2xhc3MgZm9yIHRoZSBjdXJyZW50IGltYWdlLlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSB0byBiYXNlIHRoZSBzaXppbmcgY2xhc3Mgb24uXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRTaXppbmdDbGFzcyA9IGZ1bmN0aW9uICggaW1nICkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGlmICggaW1hZ2VEaXNwbGF5TW9kZSggaW1nICkgPT09IFwicG9ydHJhaXRcIiApIHtcblx0XHR0aGlzLnNldFBvcnRyYWl0SW1hZ2VDbGFzc2VzKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoIHRoaXMuaXNTbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHR0aGlzLnNldFNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLnNldExhcmdlSW1hZ2VDbGFzc2VzKCk7XG5cblx0cmV0dXJuO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXggaW1hZ2Ugd2lkdGhcbiAqXG4gKiBAcGFyYW0ge0ltYWdlfSBpbWcgVGhlIGltYWdlIG9iamVjdCB0byB1c2UuXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgY2FsY3VsYXRlZCBtYXh3aWR0aFxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldE1heEltYWdlV2lkdGggPSBmdW5jdGlvbiggaW1nICkge1xuXHRpZiAoIHRoaXMuaXNTbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHRyZXR1cm4gV0lEVEhfRkFDRUJPT0tfSU1BR0VfU01BTEw7XG5cdH1cblxuXHRyZXR1cm4gV0lEVEhfRkFDRUJPT0tfSU1BR0VfTEFSR0U7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIEZhY2Vib29rIHByZXZpZXcgc2hvdWxkIHN3aXRjaCB0byBzbWFsbCBpbWFnZSBtb2RlXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHNtYWxsLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmlzU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9XSURUSCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFRcblx0KTtcbn07XG5cbi8qKlxuICogRGV0ZWN0cyBpZiB0aGUgRmFjZWJvb2sgcHJldmlldyBpbWFnZSBpcyB0b28gc21hbGxcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgdG9vIHNtYWxsLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmlzVG9vU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9XSURUSCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9IRUlHSFRcblx0KTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgRmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIHNtYWxsIEZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRTbWFsbEltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIHNtYWxsIGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlU21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBmYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgbGFyZ2UgZmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldExhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbGFyZ2UgaW1hZ2UgY2xhc3Nlcy5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIEZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBwb3J0cmFpdCBGYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0UG9ydHJhaXRJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1ib3R0b21cIiwgXCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIHBvcnRyYWl0IGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlUG9ydHJhaXRJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1ib3R0b21cIiwgXCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlU21hbGxJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVMYXJnZUltYWdlQ2xhc3NlcygpO1xuXHR0aGlzLnJlbW92ZVBvcnRyYWl0SW1hZ2VDbGFzc2VzKCk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSByZWxvYWRTbmlwcGV0VGV4dCBmdW5jdGlvbiB0byB0aGUgYmx1ciBvZiB0aGUgc25pcHBldCBpbnB1dHMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcHJldmlld0V2ZW50cyA9IG5ldyBQcmV2aWV3RXZlbnRzKCBpbnB1dEZhY2Vib29rUHJldmlld0JpbmRpbmdzLCB0aGlzLmVsZW1lbnQsIHRydWUgKTtcblx0cHJldmlld0V2ZW50cy5iaW5kRXZlbnRzKCB0aGlzLmVsZW1lbnQuZWRpdFRvZ2dsZSwgdGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBGYWNlYm9vayBhdXRob3IgbmFtZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYXV0aG9yTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXV0aG9yIHRvIHNob3cuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0QXV0aG9yID0gZnVuY3Rpb24oIGF1dGhvck5hbWUgKSB7XG5cdHZhciBhdXRob3JIdG1sID0gXCJcIjtcblx0aWYgKCBhdXRob3JOYW1lICE9PSBcIlwiICkge1xuXHRcdGF1dGhvckh0bWwgPSBmYWNlYm9va0F1dGhvclRlbXBsYXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRhdXRob3JOYW1lOiBhdXRob3JOYW1lLFxuXHRcdFx0XHRhdXRob3JCeTogdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIkJ5XCIgKVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHR0aGlzLmVsZW1lbnQuYXV0aG9yQ29udGFpbmVyLmlubmVySFRNTCA9IGF1dGhvckh0bWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rUHJldmlldztcbiIsIi8qKlxuICogQWRkcyBhIGNsYXNzIHRvIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGFkZCB0aGUgY2xhc3MgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBhZGQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIGNsYXNzTmFtZSApIHtcblx0dmFyIGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCggXCIgXCIgKTtcblxuXHRpZiAoIC0xID09PSBjbGFzc2VzLmluZGV4T2YoIGNsYXNzTmFtZSApICkge1xuXHRcdGNsYXNzZXMucHVzaCggY2xhc3NOYW1lICk7XG5cdH1cblxuXHRlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbiggXCIgXCIgKTtcbn07XG4iLCJ2YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCBcIi4vLi4vYWRkQ2xhc3NcIiApO1xudmFyIGFkZE1vZGlmaWVyVG9DbGFzcyA9IHJlcXVpcmUoIFwiLi9hZGRNb2RpZmllclRvQ2xhc3NcIiApO1xuXG4vKipcbiAqIEFkZHMgYSBCRU0gbW9kaWZpZXIgdG8gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBNb2RpZmllciB0byBhZGQgdG8gdGhlIHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldENsYXNzIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBtb2RpZmllciB0b1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0UGFyZW50IFRoZSBwYXJlbnQgaW4gd2hpY2ggdGhlIHRhcmdldCBzaG91bGQgYmVcbiAqL1xuZnVuY3Rpb24gYWRkTW9kaWZpZXIoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcywgdGFyZ2V0UGFyZW50ICkge1xuXHR2YXIgZWxlbWVudCA9IHRhcmdldFBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB0YXJnZXRDbGFzcyApWzBdO1xuXHR2YXIgbmV3Q2xhc3MgPSBhZGRNb2RpZmllclRvQ2xhc3MoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcyApO1xuXG5cdGFkZENsYXNzKCBlbGVtZW50LCBuZXdDbGFzcyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1vZGlmaWVyO1xuIiwiLyoqXG4gKiBBZGRzIGEgbW9kaWZpZXIgdG8gYSBjbGFzcyBuYW1lLCBtYWtlcyBzdXJlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyIFRoZSBtb2RpZmllciB0byBhZGQgdG8gdGhlIGNsYXNzIG5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyBuYW1lIHRvIGFkZCB0aGUgbW9kaWZpZXIgdG8uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5ldyBjbGFzcyB3aXRoIHRoZSBtb2RpZmllci5cbiAqL1xuZnVuY3Rpb24gYWRkTW9kaWZpZXJUb0NsYXNzKCBtb2RpZmllciwgY2xhc3NOYW1lICkge1xuXHR2YXIgYmFzZUNsYXNzID0gY2xhc3NOYW1lLnJlcGxhY2UoIC8tLS4rLywgXCJcIiApO1xuXG5cdHJldHVybiBiYXNlQ2xhc3MgKyBcIi0tXCIgKyBtb2RpZmllcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNb2RpZmllclRvQ2xhc3M7XG4iLCJ2YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4vLi4vcmVtb3ZlQ2xhc3NcIiApO1xudmFyIGFkZE1vZGlmaWVyVG9DbGFzcyA9IHJlcXVpcmUoIFwiLi9hZGRNb2RpZmllclRvQ2xhc3NcIiApO1xuXG4vKipcbiAqIFJlbW92ZXMgYSBCRU0gbW9kaWZpZXIgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyIE1vZGlmaWVyIHRvIGFkZCB0byB0aGUgdGFyZ2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0Q2xhc3MgVGhlIHRhcmdldCB0byBhZGQgdGhlIG1vZGlmaWVyIHRvXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRQYXJlbnQgVGhlIHBhcmVudCBpbiB3aGljaCB0aGUgdGFyZ2V0IHNob3VsZCBiZVxuICovXG5mdW5jdGlvbiByZW1vdmVNb2RpZmllciggbW9kaWZpZXIsIHRhcmdldENsYXNzLCB0YXJnZXRQYXJlbnQgKSB7XG5cdHZhciBlbGVtZW50ID0gdGFyZ2V0UGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIHRhcmdldENsYXNzIClbMF07XG5cdHZhciBuZXdDbGFzcyA9IGFkZE1vZGlmaWVyVG9DbGFzcyggbW9kaWZpZXIsIHRhcmdldENsYXNzICk7XG5cblx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIG5ld0NsYXNzICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlTW9kaWZpZXI7XG4iLCIvKipcbiAqIFJldHJpZXZlcyB0aGUgaW1hZ2UgZGlzcGxheSBtb2RlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGltYWdlIFRoZSBpbWFnZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGlzcGxheSBtb2RlIG9mIHRoZSBpbWFnZS5cbiAqL1xuZnVuY3Rpb24gaW1hZ2VEaXNwbGF5TW9kZSggaW1hZ2UgKSB7XG5cdGlmICggaW1hZ2UuaGVpZ2h0ID4gaW1hZ2Uud2lkdGggKSB7XG5cdFx0cmV0dXJuIFwicG9ydHJhaXRcIjtcblx0fVxuXG5cdHJldHVybiBcImxhbmRzY2FwZVwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlRGlzcGxheU1vZGU7XG4iLCIvKipcbiAqIENsZWFucyBzcGFjZXMgZnJvbSB0aGUgaHRtbC5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGh0bWwgVGhlIGh0bWwgdG8gbWluaW1pemUuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG1pbmltaXplZCBodG1sIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gbWluaW1pemVIdG1sKCBodG1sICkge1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvKFxccyspL2csIFwiIFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8+IDwvZywgXCI+PFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gPi9nLCBcIj5cIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvPiAvZywgXCI+XCIgKTtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLyA8L2csIFwiPFwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gJC8sIFwiXCIgKTtcblxuXHRyZXR1cm4gaHRtbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtaW5pbWl6ZUh0bWw7XG4iLCIvKipcbiAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHJlbW92ZSB0aGUgY2xhc3MgZnJvbS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgVGhlIGNsYXNzIHRvIHJlbW92ZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggZWxlbWVudCwgY2xhc3NOYW1lICkge1xuXHR2YXIgY2xhc3NlcyA9IGVsZW1lbnQuY2xhc3NOYW1lLnNwbGl0KCBcIiBcIiApO1xuXHR2YXIgZm91bmRDbGFzcyA9IGNsYXNzZXMuaW5kZXhPZiggY2xhc3NOYW1lICk7XG5cblx0aWYgKCAtMSAhPT0gZm91bmRDbGFzcyApIHtcblx0XHRjbGFzc2VzLnNwbGljZSggZm91bmRDbGFzcywgMSApO1xuXHR9XG5cblx0ZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XG59O1xuIiwidmFyIGlzRW1wdHkgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRW1wdHlcIiApO1xuXG52YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkQ2xhc3NcIiApO1xudmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSggXCIuL3JlbW92ZUNsYXNzXCIgKTtcblxuLyoqXG4gKiBNYWtlcyB0aGUgcmVuZGVyZWQgZGVzY3JpcHRpb24gZ3JheSBpZiBubyBkZXNjcmlwdGlvbiBoYXMgYmVlbiBzZXQgYnkgdGhlIHVzZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uRWxlbWVudCBUYXJnZXQgZGVzY3JpcHRpb24gZWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIEN1cnJlbnQgZGVzY3JpcHRpb25cbiAqL1xuZnVuY3Rpb24gcmVuZGVyRGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uRWxlbWVudCwgZGVzY3JpcHRpb24gKSB7XG5cdGlmICggaXNFbXB0eSggZGVzY3JpcHRpb24gKSApIHtcblx0XHRhZGRDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtcmVuZGVyXCIgKTtcblx0XHRyZW1vdmVDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtZGVmYXVsdFwiICk7XG5cdH0gZWxzZSB7XG5cdFx0YWRkQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLWRlZmF1bHRcIiApO1xuXHRcdHJlbW92ZUNsYXNzKCBkZXNjcmlwdGlvbkVsZW1lbnQsIFwiZGVzYy1yZW5kZXJcIiApO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyRGVzY3JpcHRpb247XG4iLCJ2YXIgZGVmYXVsdHMgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNcIiApO1xudmFyIG1pbmltaXplSHRtbCA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9taW5pbWl6ZUh0bWxcIiApO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIHRoZSBpbnB1dGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZSBUZW1wbGF0ZSBvYmplY3QgdG8gdXNlLlxuICogQHJldHVybnMge1RleHRGaWVsZH0gVGhlIHRleHRmaWVsZCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGlucHV0RmllbGRGYWN0b3J5KCB0ZW1wbGF0ZSApIHtcblxuXHR2YXIgZGVmYXVsdEF0dHJpYnV0ZXMgPSB7XG5cdFx0dmFsdWU6IFwiXCIsXG5cdFx0Y2xhc3NOYW1lOiBcIlwiLFxuXHRcdGlkOiBcIlwiLFxuXHRcdHBsYWNlaG9sZGVyOiBcIlwiLFxuXHRcdG5hbWU6IFwiXCIsXG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0bGFiZWxDbGFzc05hbWU6IFwiXCJcblx0fTtcblxuXHQvKipcblx0ICogUmVwcmVzZW50cyBhbiBIVE1MIHRleHQgZmllbGRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGF0dHJpYnV0ZXMgVGhlIGF0dHJpYnV0ZXMgdG8gc2V0IG9uIHRoZSBIVE1MIGVsZW1lbnRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMudmFsdWUgVGhlIHZhbHVlIGZvciB0aGlzIHRleHQgZmllbGRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMucGxhY2Vob2xkZXIgVGhlIHBsYWNlaG9sZGVyIGZvciB0aGlzIHRleHQgZmllbGRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMubmFtZSBUaGUgbmFtZSBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLmlkIFRoZSBpZCBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLmNsYXNzTmFtZSBUaGUgY2xhc3MgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy50aXRsZSBUaGUgdGl0bGUgdGhhdCBkZXNjcmliZXMgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0ZnVuY3Rpb24gVGV4dEZpZWxkKCBhdHRyaWJ1dGVzICkge1xuXHRcdGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIHx8IHt9O1xuXHRcdGF0dHJpYnV0ZXMgPSBkZWZhdWx0cyggYXR0cmlidXRlcywgZGVmYXVsdEF0dHJpYnV0ZXMgKTtcblxuXHRcdHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIEhUTUwgYXR0cmlidXRlcyBzZXQgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgSFRNTCBhdHRyaWJ1dGVzXG5cdCAqL1xuXHRUZXh0RmllbGQucHJvdG90eXBlLmdldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5fYXR0cmlidXRlcztcblx0fTtcblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgdGV4dCBmaWVsZCB0byBIVE1MXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSByZW5kZXJlZCBIVE1MXG5cdCAqL1xuXHRUZXh0RmllbGQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBodG1sID0gdGVtcGxhdGUoIHRoaXMuZ2V0QXR0cmlidXRlcygpICk7XG5cblx0XHRodG1sID0gbWluaW1pemVIdG1sKCBodG1sICk7XG5cblx0XHRyZXR1cm4gaHRtbDtcblx0fTtcblxuXHQvKipcblx0ICogU2V0IHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmllbGRcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQgb24gdGhpcyBpbnB1dCBmaWVsZFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR0aGlzLl9hdHRyaWJ1dGVzLnZhbHVlID0gdmFsdWU7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgVGhlIGNsYXNzIHRvIHNldCBvbiB0aGlzIGlucHV0IGZpZWxkXG5cdCAqL1xuXHRUZXh0RmllbGQucHJvdG90eXBlLnNldENsYXNzTmFtZSA9IGZ1bmN0aW9uKCBjbGFzc05hbWUgKSB7XG5cdFx0dGhpcy5fYXR0cmlidXRlcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cdH07XG5cblx0cmV0dXJuIFRleHRGaWVsZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dEZpZWxkRmFjdG9yeTtcbiIsInZhciBpbnB1dEZpZWxkRmFjdG9yeSA9IHJlcXVpcmUoIFwiLi9pbnB1dEZpZWxkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dEZpZWxkRmFjdG9yeSggcmVxdWlyZSggXCIuLi90ZW1wbGF0ZXNcIiApLmZpZWxkcy50ZXh0ICk7XG4iLCJ2YXIgaW5wdXRGaWVsZEZhY3RvcnkgPSByZXF1aXJlKCBcIi4vaW5wdXRGaWVsZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3RvcnkoIHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5maWVsZHMudGV4dGFyZWEgKTtcbiIsInZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvY29sbGVjdGlvbi9mb3JFYWNoXCIgKTtcblxudmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuLi9oZWxwZXJzL2FkZENsYXNzLmpzXCIgKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9yZW1vdmVDbGFzcy5qc1wiICk7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5ncyBUaGUgZmllbGRzIHRvIGJpbmQuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBiaW5kIHRoZSBldmVudHMgdG8uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsd2F5c09wZW4gV2hldGhlciB0aGUgaW5wdXQgZm9ybSBzaG91bGQgYWx3YXlzIGJlIG9wZW4uXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUHJldmlld0V2ZW50cyggYmluZGluZ3MsIGVsZW1lbnQsIGFsd2F5c09wZW4gKSB7XG5cdHRoaXMuX2JpbmRpbmdzID0gYmluZGluZ3M7XG5cdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdHRoaXMuX2Fsd2F5c09wZW4gPSBhbHdheXNPcGVuO1xufVxuXG4vKipcbiAqIEJpbmQgdGhlIGV2ZW50cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZWRpdFRvZ2dsZSAtIFRoZSBlZGl0IHRvZ2dsZSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gY2xvc2VFZGl0b3IgLSBUaGUgYnV0dG9uIHRvIGNsb3NlIHRoZSBlZGl0b3JcbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCBlZGl0VG9nZ2xlLCBjbG9zZUVkaXRvciApIHtcblx0aWYgKCAhdGhpcy5fYWx3YXlzT3BlbiApIHtcblx0XHRlZGl0VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgdGhpcy50b2dnbGVFZGl0b3IuYmluZCggdGhpcyApICk7XG5cdFx0Y2xvc2VFZGl0b3IuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCB0aGlzLmNsb3NlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHR9XG5cblx0Ly8gTG9vcCB0aHJvdWdoIHRoZSBiaW5kaW5ncyBhbmQgYmluZCBhIGNsaWNrIGhhbmRsZXIgdG8gdGhlIGNsaWNrIHRvIGZvY3VzIHRoZSBmb2N1cyBlbGVtZW50LlxuXHRmb3JFYWNoKCB0aGlzLl9iaW5kaW5ncywgdGhpcy5iaW5kSW5wdXRFdmVudC5iaW5kKCB0aGlzICkgKTtcbn07XG5cbi8qKlxuICogQmluZHMgdGhlIGV2ZW50IGZvciB0aGUgaW5wdXRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmluZGluZyBUaGUgZmllbGQgdG8gYmluZC5cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuYmluZElucHV0RXZlbnQgPSBmdW5jdGlvbiggYmluZGluZyApIHtcblx0dmFyIHByZXZpZXdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggYmluZGluZy5wcmV2aWV3IClbMF07XG5cdHZhciBpbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuaW5wdXRbIGJpbmRpbmcuaW5wdXRGaWVsZCBdO1xuXG5cdC8vIE1ha2UgdGhlIHByZXZpZXcgZWxlbWVudCBjbGljayBvcGVuIHRoZSBlZGl0b3IgYW5kIGZvY3VzIHRoZSBjb3JyZWN0IGlucHV0LlxuXHRwcmV2aWV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMub3BlbkVkaXRvcigpO1xuXHRcdGlucHV0RWxlbWVudC5mb2N1cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdC8vIE1ha2UgZm9jdXNpbmcgYW4gaW5wdXQsIHVwZGF0ZSB0aGUgY2FyZXRzLlxuXHRpbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJmb2N1c1wiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9jdXJyZW50Rm9jdXMgPSBiaW5kaW5nLmlucHV0RmllbGQ7XG5cblx0XHR0aGlzLl91cGRhdGVGb2N1c0NhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdC8vIE1ha2UgcmVtb3ZpbmcgZm9jdXMgZnJvbSBhbiBlbGVtZW50LCB1cGRhdGUgdGhlIGNhcmV0cy5cblx0aW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiYmx1clwiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9jdXJyZW50Rm9jdXMgPSBudWxsO1xuXG5cdFx0dGhpcy5fdXBkYXRlRm9jdXNDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHRwcmV2aWV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9jdXJyZW50SG92ZXIgPSBiaW5kaW5nLmlucHV0RmllbGQ7XG5cblx0XHR0aGlzLl91cGRhdGVIb3ZlckNhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdHByZXZpZXdFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcblxuXHRcdHRoaXMuX3VwZGF0ZUhvdmVyQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIE9wZW5zIHRoZSBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUub3BlbkVkaXRvciA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmICggdGhpcy5fYWx3YXlzT3BlbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBIaWRlIHRoZXNlIGVsZW1lbnRzLlxuXHRhZGRDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICAgIFwic25pcHBldC1lZGl0b3ItLWhpZGRlblwiICk7XG5cblx0Ly8gU2hvdyB0aGVzZSBlbGVtZW50cy5cblx0cmVtb3ZlQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmhlYWRpbmdFZGl0b3IsIFwic25pcHBldC1lZGl0b3ItLWhpZGRlblwiICk7XG5cblx0dGhpcy5vcGVuZWQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiBDbG9zZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5jbG9zZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmICggdGhpcy5fYWx3YXlzT3BlbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBIaWRlIHRoZXNlIGVsZW1lbnRzLlxuXHRhZGRDbGFzcyggdGhpcy5lbGVtZW50LmZvcm1Db250YWluZXIsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXHRhZGRDbGFzcyggdGhpcy5lbGVtZW50LmhlYWRpbmdFZGl0b3IsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdC8vIFNob3cgdGhlc2UgZWxlbWVudHMuXG5cdHJlbW92ZUNsYXNzKCB0aGlzLmVsZW1lbnQuZWRpdFRvZ2dsZSwgICAgIFwic25pcHBldC1lZGl0b3ItLWhpZGRlblwiICk7XG5cblx0dGhpcy5vcGVuZWQgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogVG9nZ2xlcyB0aGUgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLnRvZ2dsZUVkaXRvciA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHRoaXMub3BlbmVkICkge1xuXHRcdHRoaXMuY2xvc2VFZGl0b3IoKTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLm9wZW5FZGl0b3IoKTtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIGNhcmV0cyBiZWZvcmUgdGhlIHByZXZpZXcgYW5kIGlucHV0IGZpZWxkcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5fdXBkYXRlRm9jdXNDYXJldHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGZvY3VzZWRMYWJlbCwgZm9jdXNlZFByZXZpZXc7XG5cblx0Ly8gRGlzYWJsZSBhbGwgY2FyZXRzIG9uIHRoZSBsYWJlbHMuXG5cdGZvckVhY2goIHRoaXMuZWxlbWVudC5sYWJlbCwgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIFwic25pcHBldC1lZGl0b3JfX2xhYmVsLS1mb2N1c1wiICk7XG5cdH0gKTtcblxuXHQvLyBEaXNhYmxlIGFsbCBjYXJldHMgb24gdGhlIHByZXZpZXdzLlxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQucHJldmlldywgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIFwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lci0tZm9jdXNcIiApO1xuXHR9ICk7XG5cblx0aWYgKCBudWxsICE9PSB0aGlzLl9jdXJyZW50Rm9jdXMgKSB7XG5cdFx0Zm9jdXNlZExhYmVsID0gdGhpcy5lbGVtZW50LmxhYmVsWyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblx0XHRmb2N1c2VkUHJldmlldyA9IHRoaXMuZWxlbWVudC5wcmV2aWV3WyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblxuXHRcdGFkZENsYXNzKCBmb2N1c2VkTGFiZWwsIFwic25pcHBldC1lZGl0b3JfX2xhYmVsLS1mb2N1c1wiICk7XG5cdFx0YWRkQ2xhc3MoIGZvY3VzZWRQcmV2aWV3LCBcInNuaXBwZXQtZWRpdG9yX19jb250YWluZXItLWZvY3VzXCIgKTtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIGhvdmVyIGNhcmV0cyBiZWZvcmUgdGhlIGlucHV0IGZpZWxkcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5fdXBkYXRlSG92ZXJDYXJldHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGhvdmVyZWRMYWJlbDtcblxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQubGFiZWwsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0taG92ZXJcIiApO1xuXHR9ICk7XG5cblx0aWYgKCBudWxsICE9PSB0aGlzLl9jdXJyZW50SG92ZXIgKSB7XG5cdFx0aG92ZXJlZExhYmVsID0gdGhpcy5lbGVtZW50LmxhYmVsWyB0aGlzLl9jdXJyZW50SG92ZXIgXTtcblxuXHRcdGFkZENsYXNzKCBob3ZlcmVkTGFiZWwsIFwic25pcHBldC1lZGl0b3JfX2xhYmVsLS1ob3ZlclwiICk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJldmlld0V2ZW50cztcbiIsIjsoZnVuY3Rpb24oKSB7XG4gIHZhciB1bmRlZmluZWQ7XG5cbiAgdmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4gIHZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4gIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4gIHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuICB2YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4gIC8qKiBVc2VkIGFzIGEgc2FmZSByZWZlcmVuY2UgZm9yIGB1bmRlZmluZWRgIGluIHByZS1FUzUgZW52aXJvbm1lbnRzLiAqL1xuICB2YXIgdW5kZWZpbmVkO1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBzZW1hbnRpYyB2ZXJzaW9uIG51bWJlci4gKi9cbiAgdmFyIFZFUlNJT04gPSAnNC4xNi40JztcblxuICAvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbiAgdmFyIElORklOSVRZID0gMSAvIDA7XG5cbiAgLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xuICB2YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xuICB2YXIgcmVVbmVzY2FwZWRIdG1sID0gL1smPD5cIiddL2csXG4gICAgICByZUhhc1VuZXNjYXBlZEh0bWwgPSBSZWdFeHAocmVVbmVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbiAgLyoqIFVzZWQgdG8gbWFwIGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy4gKi9cbiAgdmFyIGh0bWxFc2NhcGVzID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7J1xuICB9O1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG4gIHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xuICB2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICAgKiBzaG9ydGhhbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYF8uZXNjYXBlYCB0byBjb252ZXJ0IGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICovXG4gIHZhciBlc2NhcGVIdG1sQ2hhciA9IGJhc2VQcm9wZXJ0eU9mKGh0bWxFc2NhcGVzKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG4gIHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAgICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gICAqIG9mIHZhbHVlcy5cbiAgICovXG4gIHZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4gIC8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xuICB2YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbiAgLyoqIFVzZWQgdG8gbG9va3VwIHVubWluaWZpZWQgZnVuY3Rpb24gbmFtZXMuICovXG4gIHZhciByZWFsTmFtZXMgPSB7fTtcblxuICAvKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbiAgdmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICAgKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gICAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICAgIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICAgKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICAgKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy50b1N0cmluZyhudWxsKTtcbiAgICogLy8gPT4gJydcbiAgICpcbiAgICogXy50b1N0cmluZygtMCk7XG4gICAqIC8vID0+ICctMCdcbiAgICpcbiAgICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAnMSwyLDMnXG4gICAqL1xuICBmdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY2hhcmFjdGVycyBcIiZcIiwgXCI8XCIsIFwiPlwiLCAnXCInLCBhbmQgXCInXCIgaW4gYHN0cmluZ2AgdG8gdGhlaXJcbiAgICogY29ycmVzcG9uZGluZyBIVE1MIGVudGl0aWVzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogTm8gb3RoZXIgY2hhcmFjdGVycyBhcmUgZXNjYXBlZC4gVG8gZXNjYXBlIGFkZGl0aW9uYWxcbiAgICogY2hhcmFjdGVycyB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gICAqXG4gICAqIFRob3VnaCB0aGUgXCI+XCIgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2VcbiAgICogXCI+XCIgYW5kIFwiL1wiIGRvbid0IG5lZWQgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmdcbiAgICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICAgKiBbTWF0aGlhcyBCeW5lbnMncyBhcnRpY2xlXShodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMpXG4gICAqICh1bmRlciBcInNlbWktcmVsYXRlZCBmdW4gZmFjdFwiKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKlxuICAgKiBXaGVuIHdvcmtpbmcgd2l0aCBIVE1MIHlvdSBzaG91bGQgYWx3YXlzXG4gICAqIFtxdW90ZSBhdHRyaWJ1dGUgdmFsdWVzXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZykgdG8gcmVkdWNlXG4gICAqIFhTUyB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZXNjYXBlKCdmcmVkLCBiYXJuZXksICYgcGViYmxlcycpO1xuICAgKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJ1xuICAgKi9cbiAgZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICAgIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNVbmVzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICAgID8gc3RyaW5nLnJlcGxhY2UocmVVbmVzY2FwZWRIdG1sLCBlc2NhcGVIdG1sQ2hhcilcbiAgICAgIDogc3RyaW5nO1xuICB9XG5cbiAgdmFyIF8gPSB7ICdlc2NhcGUnOiBlc2NhcGUgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIHZhciB0ZW1wbGF0ZXMgPSB7XG4gICAgJ2ZhY2Vib29rQXV0aG9yJzoge30sXG4gICAgJ2ZhY2Vib29rUHJldmlldyc6IHt9LFxuICAgICdmaWVsZHMnOiB7XG4gICAgICAgICdidXR0b24nOiB7fSxcbiAgICAgICAgJ3RleHQnOiB7fSxcbiAgICAgICAgJ3RleHRhcmVhJzoge31cbiAgICB9LFxuICAgICdpbWFnZVBsYWNlaG9sZGVyJzoge30sXG4gICAgJ3R3aXR0ZXJQcmV2aWV3Jzoge31cbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZhY2Vib29rQXV0aG9yJ10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2stcGlwZVwiPnw8L3NwYW4+ICcgK1xuICAgIF9fZSggYXV0aG9yQnkgKSArXG4gICAgJ1xcbjxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fYXV0aG9yLS1mYWNlYm9va1wiPicgK1xuICAgIF9fZSggYXV0aG9yTmFtZSApICtcbiAgICAnPC9zcGFuPlxcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmFjZWJvb2tQcmV2aWV3J10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3IGVkaXRhYmxlLXByZXZpZXctLWZhY2Vib29rXCI+XFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWV5ZVwiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0UHJldmlldyApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxzZWN0aW9uIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19faW5uZXIgZWRpdGFibGUtcHJldmlld19faW5uZXItLWZhY2Vib29rXCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJzb2NpYWwtcHJldmlld19faW5uZXIgc29jaWFsLXByZXZpZXdfX2lubmVyLS1mYWNlYm9va1wiPlxcblx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlciBlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tZmFjZWJvb2sgZWRpdGFibGUtcHJldmlld19fdGl0bGUtLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stdGl0bGVcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLnRpdGxlICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tZmFjZWJvb2sgZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stZGVzY3JpcHRpb25cIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmRlc2NyaXB0aW9uICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tbm8tY2FyZXQgZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay11cmxcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmJhc2VVcmwgKSArXG4gICAgJ1xcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWF1dGhvclwiPjwvc3Bhbj5cXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L3NlY3Rpb24+XFxuXFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3Igc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1lZGl0XCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRFZGl0b3IgKSArXG4gICAgJzwvaDM+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2Zvcm1cIj5cXG5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmllbGRzJ11bJ2J1dHRvbiddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIGZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGJ1dHRvblxcblx0dHlwZT1cImJ1dHRvblwiXFxuXHQnO1xuICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgX19wICs9ICdjbGFzcz1cIicgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbj5cXG5cdCcgK1xuICAgIF9fZSggdmFsdWUgKSArXG4gICAgJ1xcbjwvYnV0dG9uPic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmllbGRzJ11bJ3RleHQnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbiAgICBmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxsYWJlbCc7XG4gICAgIGlmIChpZCkge1xuICAgIF9fcCArPSAnIGZvcj1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuXG4gICAgIGlmIChsYWJlbENsYXNzTmFtZSkge1xuICAgIF9fcCArPSAnIGNsYXNzPVwiJyArXG4gICAgX19lKCBsYWJlbENsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICc+XFxuXHQnICtcbiAgICBfX2UoIHRpdGxlICkgK1xuICAgICdcXG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiXFxuXHRcdCc7XG4gICAgIGlmICh2YWx1ZSkge1xuICAgIF9fcCArPSAndmFsdWU9XCInICtcbiAgICBfX2UoIHZhbHVlICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAocGxhY2Vob2xkZXIpIHtcbiAgICBfX3AgKz0gJ3BsYWNlaG9sZGVyPVwiJyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKGlkKSB7XG4gICAgX19wICs9ICdpZD1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmIChuYW1lKSB7XG4gICAgX19wICs9ICduYW1lPVwiJyArXG4gICAgX19lKCBuYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Lz5cXG48L2xhYmVsPlxcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmllbGRzJ11bJ3RleHRhcmVhJ10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZSwgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8bGFiZWwnO1xuICAgICBpZiAoaWQpIHtcbiAgICBfX3AgKz0gJyBmb3I9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cblxuICAgICBpZiAobGFiZWxDbGFzc05hbWUpIHtcbiAgICBfX3AgKz0gJyBjbGFzcz1cIicgK1xuICAgIF9fZSggbGFiZWxDbGFzc05hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnPlxcblx0JyArXG4gICAgX19lKCB0aXRsZSApICtcbiAgICAnXFxuXHQ8dGV4dGFyZWFcXG5cXG5cdFx0ICAgJztcbiAgICAgaWYgKHBsYWNlaG9sZGVyKSB7XG4gICAgX19wICs9ICdwbGFjZWhvbGRlcj1cIicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCAgICc7XG4gICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICBfX3AgKz0gJ2NsYXNzPVwiJyArXG4gICAgX19lKCBjbGFzc05hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCAgICc7XG4gICAgIGlmIChpZCkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQgICAnO1xuICAgICBpZiAobmFtZSkge1xuICAgIF9fcCArPSAnbmFtZT1cIicgK1xuICAgIF9fZSggbmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdD5cXG5cdFx0JztcbiAgICAgaWYgKHZhbHVlKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB2YWx1ZSApO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdDwvdGV4dGFyZWE+XFxuPC9sYWJlbD5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ltYWdlUGxhY2Vob2xkZXInXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cXCcnICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXFwnPicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJzwvZGl2Pic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1sndHdpdHRlclByZXZpZXcnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXcgZWRpdGFibGUtcHJldmlldy0tdHdpdHRlclwiPlxcblx0PGgzIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2hlYWRpbmcgc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1leWVcIj4nICtcbiAgICBfX2UoIGkxOG4uc25pcHBldFByZXZpZXcgKSArXG4gICAgJzwvaDM+XFxuXFxuXHQ8c2VjdGlvbiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX2lubmVyIGVkaXRhYmxlLXByZXZpZXdfX2lubmVyLS10d2l0dGVyXCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJzb2NpYWwtcHJldmlld19faW5uZXIgc29jaWFsLXByZXZpZXdfX2lubmVyLS10d2l0dGVyXCI+XFxuXHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19faW1hZ2UgZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXIgc25pcHBldF9jb250YWluZXJcIj5cXG5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXIgZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tdHdpdHRlciBlZGl0YWJsZS1wcmV2aWV3X190aXRsZS0tdHdpdHRlciBzbmlwcGV0X2NvbnRhaW5lclwiID5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS10d2l0dGVyLXRpdGxlIFwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQudGl0bGUgKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS10d2l0dGVyIGVkaXRhYmxlLXByZXZpZXdfX2Rlc2NyaXB0aW9uLS10d2l0dGVyIHR3aXR0ZXItcHJldmlld19fZGVzY3JpcHRpb24gc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS10d2l0dGVyLWRlc2NyaXB0aW9uXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC5kZXNjcmlwdGlvbiApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLW5vLWNhcmV0IGVkaXRhYmxlLXByZXZpZXdfX3dlYnNpdGUtLXR3aXR0ZXIgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIFwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuYmFzZVVybCApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9zZWN0aW9uPlxcblxcblx0PGgzIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2hlYWRpbmcgc25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWljb24tZWRpdFwiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmIChmcmVlTW9kdWxlKSB7XG4gICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcykudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICAgIGZyZWVFeHBvcnRzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxuICBlbHNlIHtcbiAgICByb290LnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cbnZhciBpc0VsZW1lbnQgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRWxlbWVudFwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2Nsb25lXCIgKTtcbnZhciBkZWZhdWx0c0RlZXAgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNEZWVwXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcblxudmFyIHJlbmRlckRlc2NyaXB0aW9uID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvcmVuZGVyRGVzY3JpcHRpb25cIiApO1xudmFyIGltYWdlUGxhY2Vob2xkZXIgID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlclwiICk7XG52YXIgYmVtQWRkTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vYWRkTW9kaWZpZXJcIiApO1xudmFyIGJlbVJlbW92ZU1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL3JlbW92ZU1vZGlmaWVyXCIgKTtcblxudmFyIFRleHRGaWVsZCA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dElucHV0XCIgKTtcbnZhciBUZXh0QXJlYSA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dGFyZWFcIiApO1xuXG52YXIgSW5wdXRFbGVtZW50ID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW5wdXRcIiApO1xudmFyIFByZXZpZXdFdmVudHMgPSByZXF1aXJlKCBcIi4vcHJldmlldy9ldmVudHNcIiApO1xuXG52YXIgdHdpdHRlckVkaXRvclRlbXBsYXRlID0gcmVxdWlyZSggXCIuL3RlbXBsYXRlc1wiICkudHdpdHRlclByZXZpZXc7XG5cbnZhciB0d2l0dGVyRGVmYXVsdHMgPSB7XG5cdGRhdGE6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRkZWZhdWx0VmFsdWU6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRiYXNlVVJMOiBcImV4YW1wbGUuY29tXCIsXG5cdGNhbGxiYWNrczoge1xuXHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCkge30sXG5cdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdHJldHVybiB0aXRsZTtcblx0XHR9LFxuXHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdFx0fSxcblx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0cmV0dXJuIGltYWdlVXJsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGlucHV0VHdpdHRlclByZXZpZXdCaW5kaW5ncyA9IFtcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS10d2l0dGVyXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwidGl0bGVcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJpbWFnZVVybFwiXG5cdH0sXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tdHdpdHRlclwiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcImRlc2NyaXB0aW9uXCJcblx0fVxuXTtcblxudmFyIFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEwgPSAxMjA7XG52YXIgV0lEVEhfVFdJVFRFUl9JTUFHRV9MQVJHRSA9IDUwNjtcbnZhciBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9XSURUSCA9IDI4MDtcbnZhciBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFQgPSAxNTA7XG5cbi8qKlxuICogQG1vZHVsZSBzbmlwcGV0UHJldmlld1xuICovXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29uZmlnIGFuZCBvdXRwdXRUYXJnZXQgZm9yIHRoZSBTbmlwcGV0UHJldmlld1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFNuaXBwZXQgcHJldmlldyBvcHRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlciAgICAgICAgICAgICAgIC0gVGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBmb3IgdGhlIGZpZWxkcywgd2lsbCBiZSBzaG93biBhc1xuICogYWN0dWFsIHBsYWNlaG9sZGVycyBpbiB0aGUgaW5wdXRzIGFuZCBhcyBhIGZhbGxiYWNrIGZvciB0aGUgcHJldmlldy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIudGl0bGUgICAgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgdGl0bGUgZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGRlc2NyaXB0aW9uIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBpbWFnZSB1cmwgZmllbGQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUgICAgICAgICAgICAgIC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoZSBmaWVsZHMsIGlmIHRoZSB1c2VyIGhhcyBub3RcbiAqIGNoYW5nZWQgYSBmaWVsZCwgdGhpcyB2YWx1ZSB3aWxsIGJlIHVzZWQgZm9yIHRoZSBhbmFseXplciwgcHJldmlldyBhbmQgdGhlIHByb2dyZXNzIGJhcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSAgICAgICAgLSBEZWZhdWx0IHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gIC0gRGVmYXVsdCBkZXNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsICAgICAtIERlZmF1bHQgaW1hZ2UgdXJsLlxuICogaXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5iYXNlVVJMICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0d2l0dGVyLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gICAgb3B0cy50YXJnZXRFbGVtZW50ICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmNhbGxiYWNrcyAgICAgICAgICAgICAgICAgLSBGdW5jdGlvbnMgdGhhdCBhcmUgY2FsbGVkIG9uIHNwZWNpZmljIGluc3RhbmNlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIG9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcgLSBGdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgc29jaWFsIHByZXZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgaTE4biBvYmplY3QuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50ICAgICAgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBlbGVtZW50cyBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQucmVuZGVyZWQgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQudGl0bGUgICAgICAgICAtIFRoZSByZW5kZXJlZCB0aXRsZSBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC5pbWFnZVVybCAgICAgIC0gVGhlIHJlbmRlcmVkIHVybCBwYXRoIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uICAgLSBUaGUgcmVuZGVyZWQgdHdpdHRlciBkZXNjcmlwdGlvbiBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQuaW5wdXQgICAgICAgICAgICAgICAgICAtIFRoZSBpbnB1dCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQudGl0bGUgICAgICAgICAgICAtIFRoZSB0aXRsZSBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5pbWFnZVVybCAgICAgICAgIC0gVGhlIHVybCBwYXRoIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbiBpbnB1dCBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuY29udGFpbmVyICAgICAgICAgICAgICAtIFRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5mb3JtQ29udGFpbmVyICAgICAgICAgIC0gVGhlIGZvcm0gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmVkaXRUb2dnbGUgICAgICAgICAgICAgLSBUaGUgYnV0dG9uIHRoYXQgdG9nZ2xlcyB0aGUgZWRpdG9yIGZvcm0uXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGRhdGEgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLnRpdGxlICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdGl0bGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmltYWdlVXJsICAgICAgICAgICAgICAgICAgLSBUaGUgdXJsIHBhdGguXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmRlc2NyaXB0aW9uICAgICAgICAgICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBiYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIGdvb2dsZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFR3aXR0ZXJQcmV2aWV3ID0gZnVuY3Rpb24oIG9wdHMsIGkxOG4gKSB7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cblx0dHdpdHRlckRlZmF1bHRzLnBsYWNlaG9sZGVyID0ge1xuXHRcdHRpdGxlOiB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhpcyBpcyBhbiBleGFtcGxlIHRpdGxlIC0gZWRpdCBieSBjbGlja2luZyBoZXJlXCIgKSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiTW9kaWZ5IHlvdXIgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIGl0IHJpZ2h0IGhlcmVcIiApLFxuXHRcdFx0XCJUd2l0dGVyXCJcblx0XHQpLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH07XG5cblx0ZGVmYXVsdHNEZWVwKCBvcHRzLCB0d2l0dGVyRGVmYXVsdHMgKTtcblxuXHRpZiAoICFpc0VsZW1lbnQoIG9wdHMudGFyZ2V0RWxlbWVudCApICkge1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJUaGUgVHdpdHRlciBwcmV2aWV3IHJlcXVpcmVzIGEgdmFsaWQgdGFyZ2V0IGVsZW1lbnRcIiApO1xuXHR9XG5cblx0dGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXHR0aGlzLmkxOG4gPSBpMThuIHx8IHRoaXMuY29uc3RydWN0STE4bigpO1xuXHR0aGlzLm9wdHMgPSBvcHRzO1xuXG5cdHRoaXMuX2N1cnJlbnRGb2N1cyA9IG51bGw7XG5cdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGkxOG4gb2JqZWN0IGJhc2VkIG9uIHBhc3NlZCBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyAtIFRoZSB2YWx1ZXMgdG8gdHJhbnNsYXRlLlxuICpcbiAqIEByZXR1cm5zIHtKZWR9IC0gVGhlIEplZCB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0XCJkb21haW5cIjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcImxvY2FsZV9kYXRhXCI6IHtcblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge31cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbmRlclRlbXBsYXRlKCk7XG5cdHRoaXMuYmluZEV2ZW50cygpO1xuXHR0aGlzLnVwZGF0ZVByZXZpZXcoKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyBzbmlwcGV0IGVkaXRvciBhbmQgYWRkcyBpdCB0byB0aGUgdGFyZ2V0RWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0dGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSB0d2l0dGVyRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkxcblx0XHR9LFxuXHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIsXG5cdFx0aTE4bjoge1xuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0ZWRpdDogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJFZGl0ICUxJHMgcHJldmlld1wiICksIFwiVHdpdHRlclwiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRzbmlwcGV0UHJldmlldzogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHByZXZpZXdcIiApLCBcIlR3aXR0ZXJcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0c25pcHBldEVkaXRvcjogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGVkaXRvclwiICksIFwiVHdpdHRlclwiIClcblx0XHR9XG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItdGl0bGVcIiApWzBdLFxuXHRcdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci1kZXNjcmlwdGlvblwiIClbMF1cblx0XHR9LFxuXHRcdGZpZWxkczogdGhpcy5nZXRGaWVsZHMoKSxcblx0XHRjb250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3LS10d2l0dGVyXCIgKVswXSxcblx0XHRmb3JtQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm1cIiApWzBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWzBdLFxuXHRcdGNsb3NlRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX3N1Ym1pdFwiIClbMF0sXG5cdFx0Zm9ybUZpZWxkczogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtLWZpZWxkXCIgKSxcblx0XHRoZWFkaW5nRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMuZWxlbWVudC5maWVsZHMuaW1hZ2VVcmwucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMudGl0bGUucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMuZGVzY3JpcHRpb24ucmVuZGVyKCk7XG5cblx0dGhpcy5lbGVtZW50LmlucHV0ID0ge1xuXHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItdGl0bGVcIiApWzBdLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWzBdXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMgPSB0aGlzLmdldEZpZWxkRWxlbWVudHMoKTtcblx0dGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yID0gdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19zdWJtaXRcIiApWzBdO1xuXG5cdHRoaXMuZWxlbWVudC5sYWJlbCA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LmlucHV0LnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRoaXMuZWxlbWVudC5pbnB1dC5pbWFnZVVybC5wYXJlbnROb2RlLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQuaW5wdXQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5wcmV2aWV3ID0ge1xuXHRcdHRpdGxlOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQudGl0bGUucGFyZW50Tm9kZSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIgKVswXSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLnBhcmVudE5vZGVcblx0fTtcblxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmb3JtIGZpZWxkcy5cbiAqXG4gKiBAcmV0dXJucyB7e3RpdGxlOiAqLCBkZXNjcmlwdGlvbjogKiwgaW1hZ2VVcmw6ICosIGJ1dHRvbjogQnV0dG9ufX0gT2JqZWN0IHdpdGggdGhlIGZpZWxkcy5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX190aXRsZSBqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiLFxuXHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItdGl0bGVcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHRpdGxlXCIgKSxcblx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdCksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSxcblx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdCksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRpbWFnZVVybDogbmV3IFRleHRGaWVsZCgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9faW1hZ2VVcmwganMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCxcblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBpbWFnZVwiICksXG5cdFx0XHRcdFwiVHdpdHRlclwiXG5cdFx0XHQpLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9IClcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnQuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRGaWVsZEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0cmV0dXJuIHtcblx0XHR0aXRsZTogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLnRpdGxlLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUudGl0bGUsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIudGl0bGUsXG5cdFx0XHRcdGZhbGxiYWNrOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyB0aXRsZSBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdFx0KVxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpLFxuXHRcdCBkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdCB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWzBdLFxuXHRcdFx0IHtcblx0XHRcdFx0IGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHQgZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHQgcGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdFx0IGZhbGxiYWNrOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0ICAgIC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0XHQgdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0IFwiVHdpdHRlclwiXG5cdFx0XHRcdCApXG5cdFx0XHQgfSxcblx0XHRcdCB0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0ICksXG5cdFx0aW1hZ2VVcmw6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0XHRmYWxsYmFjazogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpXG5cdH07XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHR3aXR0ZXIgcHJldmlldy5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnVwZGF0ZVByZXZpZXcgPSBmdW5jdGlvbigpIHtcbi8vIFVwZGF0ZSB0aGUgZGF0YS5cblx0dGhpcy5kYXRhLnRpdGxlID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5pbWFnZVVybCA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmltYWdlVXJsLmdldElucHV0VmFsdWUoKTtcblxuXHQvLyBTZXRzIHRoZSB0aXRsZSBmaWVsZFxuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cblx0Ly8gU2V0IHRoZSBkZXNjcmlwdGlvbiBmaWVsZCBhbmQgcGFyc2UgdGhlIHN0eWxpbmcgb2YgaXQuXG5cdHRoaXMuc2V0RGVzY3JpcHRpb24oIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXRzIHRoZSBJbWFnZSBVUkxcblx0dGhpcy5zZXRJbWFnZSggdGhpcy5kYXRhLmltYWdlVXJsICk7XG5cblx0Ly8gQ2xvbmUgc28gdGhlIGRhdGEgaXNuJ3QgY2hhbmdlYWJsZS5cblx0dGhpcy5vcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3KCBjbG9uZSggdGhpcy5kYXRhICkgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyB0aXRsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgVGhlIG5ldyB0aXRsZS5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFRpdGxlID0gZnVuY3Rpb24oIHRpdGxlICkge1xuXHR0aXRsZSA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5VGl0bGUoIHRpdGxlICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHByZXZpZXcgZGVzY3JpcHRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBkZXNjcmlwdGlvbiB0byBzZXQuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uKCBkZXNjcmlwdGlvbiApIHtcblx0ZGVzY3JpcHRpb24gPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeURlc2NyaXB0aW9uKCBkZXNjcmlwdGlvbiApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBkZXNjcmlwdGlvbjtcblx0cmVuZGVyRGVzY3JpcHRpb24oIHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbiwgdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0SW5wdXRWYWx1ZSgpICk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGltYWdlIGNvbnRhaW5lci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgdGhlIGltYWdlLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0SW1hZ2VDb250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZWxlbWVudC5wcmV2aWV3LmltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBpbWFnZSBvYmplY3Qgd2l0aCB0aGUgbmV3IFVSTC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmwgVGhlIGltYWdlIHBhdGguXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0aW1hZ2VVcmwgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeUltYWdlVXJsKCBpbWFnZVVybCApO1xuXG5cdGlmICggaW1hZ2VVcmwgPT09IFwiXCIgJiYgdGhpcy5kYXRhLmltYWdlVXJsID09PSBcIlwiICkge1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblx0XHR0aGlzLnNldFBsYWNlSG9sZGVyKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5pc1Rvb1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRcdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cdFx0XHR0aGlzLnNldFBsYWNlSG9sZGVyKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnNldFNpemluZ0NsYXNzKCBpbWcgKTtcblx0XHR0aGlzLmFkZEltYWdlVG9Db250YWluZXIoIGltYWdlVXJsICk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXHRcdHRoaXMuc2V0UGxhY2VIb2xkZXIoKTtcblx0fS5iaW5kKCB0aGlzICk7XG5cblx0Ly8gTG9hZCBpbWFnZSB0byB0cmlnZ2VyIGxvYWQgb3IgZXJyb3IgZXZlbnQuXG5cdGltZy5zcmMgPSBpbWFnZVVybDtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgaW1hZ2Ugb2YgdGhlIGltYWdlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZSBUaGUgaW1hZ2UgdG8gdXNlLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgaW1hZ2UgKyBcIilcIjtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgaW1hZ2UgZnJvbSB0aGUgY29udGFpbmVyLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjb250YWluZXIgPSB0aGlzLmdldEltYWdlQ29udGFpbmVyKCk7XG5cblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwiXCI7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByb3BlciBDU1MgY2xhc3MgZm9yIHRoZSBjdXJyZW50IGltYWdlLlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSB0byBiYXNlIHRoZSBzaXppbmcgY2xhc3Mgb24uXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRTaXppbmdDbGFzcyA9IGZ1bmN0aW9uKCBpbWcgKSB7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoXG4gKlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSBvYmplY3QgdG8gdXNlLlxuICogQHJldHVybnMge2ludH0gVGhlIGNhbGN1bGF0ZWQgbWF4IHdpZHRoLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0TWF4SW1hZ2VXaWR0aCA9IGZ1bmN0aW9uKCBpbWcgKSB7XG5cdGlmICggdGhpcy5pc1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdHJldHVybiBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMO1xuXHR9XG5cblx0cmV0dXJuIFdJRFRIX1RXSVRURVJfSU1BR0VfTEFSR0U7XG59O1xuLyoqXG4gKiBTZXRzIHRoZSBkZWZhdWx0IHR3aXR0ZXIgcGxhY2Vob2xkZXJcbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFBsYWNlSG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc2V0U21hbGxJbWFnZUNsYXNzZXMoKTtcblxuXHRpbWFnZVBsYWNlaG9sZGVyKFxuXHRcdHRoaXMuZWxlbWVudC5wcmV2aWV3LmltYWdlVXJsLFxuXHRcdFwiXCIsXG5cdFx0ZmFsc2UsXG5cdFx0XCJ0d2l0dGVyXCJcblx0KTtcblxufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSB0d2l0dGVyIHByZXZpZXcgc2hvdWxkIHN3aXRjaCB0byBzbWFsbCBpbWFnZSBtb2RlXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHNtYWxsLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuaXNTbWFsbEltYWdlID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHRyZXR1cm4gKFxuXHRcdGltYWdlLndpZHRoIDwgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFRcblx0KTtcbn07XG5cbi8qKlxuICogRGV0ZWN0cyBpZiB0aGUgdHdpdHRlciBwcmV2aWV3IGltYWdlIGlzIHRvbyBzbWFsbFxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyB0b28gc21hbGwuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5pc1Rvb1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMIHx8XG5cdFx0aW1hZ2UuaGVpZ2h0IDwgV0lEVEhfVFdJVFRFUl9JTUFHRV9TTUFMTFxuXHQpO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBmYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgc21hbGwgZmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVTbWFsbEltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBmYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgbGFyZ2UgZmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0TGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVtb3ZlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVtb3ZlU21hbGxJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVMYXJnZUltYWdlQ2xhc3NlcygpO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcmVsb2FkU25pcHBldFRleHQgZnVuY3Rpb24gdG8gdGhlIGJsdXIgb2YgdGhlIHNuaXBwZXQgaW5wdXRzLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcHJldmlld0V2ZW50cyA9IG5ldyBQcmV2aWV3RXZlbnRzKCBpbnB1dFR3aXR0ZXJQcmV2aWV3QmluZGluZ3MsIHRoaXMuZWxlbWVudCwgdHJ1ZSApO1xuXHRwcmV2aWV3RXZlbnRzLmJpbmRFdmVudHMoIHRoaXMuZWxlbWVudC5lZGl0VG9nZ2xlLCB0aGlzLmVsZW1lbnQuY2xvc2VFZGl0b3IgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHdpdHRlclByZXZpZXc7XG4iLCIvKipcbiAqIEBwcmVzZXJ2ZSBqZWQuanMgaHR0cHM6Ly9naXRodWIuY29tL1NsZXhBeHRvbi9KZWRcbiAqL1xuLypcbi0tLS0tLS0tLS0tXG5BIGdldHRleHQgY29tcGF0aWJsZSBpMThuIGxpYnJhcnkgZm9yIG1vZGVybiBKYXZhU2NyaXB0IEFwcGxpY2F0aW9uc1xuXG5ieSBBbGV4IFNleHRvbiAtIEFsZXhTZXh0b24gW2F0XSBnbWFpbCAtIEBTbGV4QXh0b25cbldURlBMIGxpY2Vuc2UgZm9yIHVzZVxuRG9qbyBDTEEgZm9yIGNvbnRyaWJ1dGlvbnNcblxuSmVkIG9mZmVycyB0aGUgZW50aXJlIGFwcGxpY2FibGUgR05VIGdldHRleHQgc3BlYydkIHNldCBvZlxuZnVuY3Rpb25zLCBidXQgYWxzbyBvZmZlcnMgc29tZSBuaWNlciB3cmFwcGVycyBhcm91bmQgdGhlbS5cblRoZSBhcGkgZm9yIGdldHRleHQgd2FzIHdyaXR0ZW4gZm9yIGEgbGFuZ3VhZ2Ugd2l0aCBubyBmdW5jdGlvblxub3ZlcmxvYWRpbmcsIHNvIEplZCBhbGxvd3MgYSBsaXR0bGUgbW9yZSBvZiB0aGF0LlxuXG5NYW55IHRoYW5rcyB0byBKb3NodWEgSS4gTWlsbGVyIC0gdW5ydHN0QGNwYW4ub3JnIC0gd2hvIHdyb3RlXG5nZXR0ZXh0LmpzIGJhY2sgaW4gMjAwOC4gSSB3YXMgYWJsZSB0byB2ZXQgYSBsb3Qgb2YgbXkgaWRlYXNcbmFnYWluc3QgaGlzLiBJIGFsc28gbWFkZSBzdXJlIEplZCBwYXNzZWQgYWdhaW5zdCBoaXMgdGVzdHNcbmluIG9yZGVyIHRvIG9mZmVyIGVhc3kgdXBncmFkZXMgLS0ganNnZXR0ZXh0LmJlcmxpb3MuZGVcbiovXG4oZnVuY3Rpb24gKHJvb3QsIHVuZGVmKSB7XG5cbiAgLy8gU2V0IHVwIHNvbWUgdW5kZXJzY29yZS1zdHlsZSBmdW5jdGlvbnMsIGlmIHlvdSBhbHJlYWR5IGhhdmVcbiAgLy8gdW5kZXJzY29yZSwgZmVlbCBmcmVlIHRvIGRlbGV0ZSB0aGlzIHNlY3Rpb24sIGFuZCB1c2UgaXRcbiAgLy8gZGlyZWN0bHksIGhvd2V2ZXIsIHRoZSBhbW91bnQgb2YgZnVuY3Rpb25zIHVzZWQgZG9lc24ndFxuICAvLyB3YXJyYW50IGhhdmluZyB1bmRlcnNjb3JlIGFzIGEgZnVsbCBkZXBlbmRlbmN5LlxuICAvLyBVbmRlcnNjb3JlIDEuMy4wIHdhcyB1c2VkIHRvIHBvcnQgYW5kIGlzIGxpY2Vuc2VkXG4gIC8vIHVuZGVyIHRoZSBNSVQgTGljZW5zZSBieSBKZXJlbXkgQXNoa2VuYXMuXG4gIHZhciBBcnJheVByb3RvICAgID0gQXJyYXkucHJvdG90eXBlLFxuICAgICAgT2JqUHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICBzbGljZSAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIGhhc093blByb3AgICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgIG5hdGl2ZUZvckVhY2ggPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgICBicmVha2VyICAgICAgID0ge307XG5cbiAgLy8gV2UncmUgbm90IHVzaW5nIHRoZSBPT1Agc3R5bGUgXyBzbyB3ZSBkb24ndCBuZWVkIHRoZVxuICAvLyBleHRyYSBsZXZlbCBvZiBpbmRpcmVjdGlvbi4gVGhpcyBzdGlsbCBtZWFucyB0aGF0IHlvdVxuICAvLyBzdWIgb3V0IGZvciByZWFsIGBfYCB0aG91Z2guXG4gIHZhciBfID0ge1xuICAgIGZvckVhY2ggOiBmdW5jdGlvbiggb2JqLCBpdGVyYXRvciwgY29udGV4dCApIHtcbiAgICAgIHZhciBpLCBsLCBrZXk7XG4gICAgICBpZiAoIG9iaiA9PT0gbnVsbCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2ggKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKCBpdGVyYXRvciwgY29udGV4dCApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoICkge1xuICAgICAgICBmb3IgKCBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgaWYgKCBpIGluIG9iaiAmJiBpdGVyYXRvci5jYWxsKCBjb250ZXh0LCBvYmpbaV0sIGksIG9iaiApID09PSBicmVha2VyICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAoIGtleSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoIGhhc093blByb3AuY2FsbCggb2JqLCBrZXkgKSApIHtcbiAgICAgICAgICAgIGlmICggaXRlcmF0b3IuY2FsbCAoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqICkgPT09IGJyZWFrZXIgKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGV4dGVuZCA6IGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICB0aGlzLmZvckVhY2goIHNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLCBmdW5jdGlvbiAoIHNvdXJjZSApIHtcbiAgICAgICAgZm9yICggdmFyIHByb3AgaW4gc291cmNlICkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfTtcbiAgLy8gRU5EIE1pbmlhdHVyZSB1bmRlcnNjb3JlIGltcGxcblxuICAvLyBKZWQgaXMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvblxuICB2YXIgSmVkID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgIC8vIFNvbWUgbWluaW1hbCBkZWZhdWx0c1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBcImxvY2FsZV9kYXRhXCIgOiB7XG4gICAgICAgIFwibWVzc2FnZXNcIiA6IHtcbiAgICAgICAgICBcIlwiIDoge1xuICAgICAgICAgICAgXCJkb21haW5cIiAgICAgICA6IFwibWVzc2FnZXNcIixcbiAgICAgICAgICAgIFwibGFuZ1wiICAgICAgICAgOiBcImVuXCIsXG4gICAgICAgICAgICBcInBsdXJhbF9mb3Jtc1wiIDogXCJucGx1cmFscz0yOyBwbHVyYWw9KG4gIT0gMSk7XCJcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVGhlcmUgYXJlIG5vIGRlZmF1bHQga2V5cywgdGhvdWdoXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBUaGUgZGVmYXVsdCBkb21haW4gaWYgb25lIGlzIG1pc3NpbmdcbiAgICAgIFwiZG9tYWluXCIgOiBcIm1lc3NhZ2VzXCIsXG4gICAgICAvLyBlbmFibGUgZGVidWcgbW9kZSB0byBsb2cgdW50cmFuc2xhdGVkIHN0cmluZ3MgdG8gdGhlIGNvbnNvbGVcbiAgICAgIFwiZGVidWdcIiA6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIE1peCBpbiB0aGUgc2VudCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xuICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyApO1xuICAgIHRoaXMudGV4dGRvbWFpbiggdGhpcy5vcHRpb25zLmRvbWFpbiApO1xuXG4gICAgaWYgKCBvcHRpb25zLmRvbWFpbiAmJiAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgdGhpcy5vcHRpb25zLmRvbWFpbiBdICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0IGRvbWFpbiBzZXQgdG8gbm9uLWV4aXN0ZW50IGRvbWFpbjogYCcgKyBvcHRpb25zLmRvbWFpbiArICdgJyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBnZXR0ZXh0IHNwZWMgc2V0cyB0aGlzIGNoYXJhY3RlciBhcyB0aGUgZGVmYXVsdFxuICAvLyBkZWxpbWl0ZXIgZm9yIGNvbnRleHQgbG9va3Vwcy5cbiAgLy8gZS5nLjogY29udGV4dFxcdTAwMDRrZXlcbiAgLy8gSWYgeW91ciB0cmFuc2xhdGlvbiBjb21wYW55IHVzZXMgc29tZXRoaW5nIGRpZmZlcmVudCxcbiAgLy8ganVzdCBjaGFuZ2UgdGhpcyBhdCBhbnkgdGltZSBhbmQgaXQgd2lsbCB1c2UgdGhhdCBpbnN0ZWFkLlxuICBKZWQuY29udGV4dF9kZWxpbWl0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCA0ICk7XG5cbiAgZnVuY3Rpb24gZ2V0UGx1cmFsRm9ybUZ1bmMgKCBwbHVyYWxfZm9ybV9zdHJpbmcgKSB7XG4gICAgcmV0dXJuIEplZC5QRi5jb21waWxlKCBwbHVyYWxfZm9ybV9zdHJpbmcgfHwgXCJucGx1cmFscz0yOyBwbHVyYWw9KG4gIT0gMSk7XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gQ2hhaW4oIGtleSwgaTE4biApe1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICB0aGlzLl9pMThuID0gaTE4bjtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIGNoYWluYWJsZSBhcGkgZm9yIGFkZGluZyBhcmdzIHByZXR0aWx5XG4gIF8uZXh0ZW5kKCBDaGFpbi5wcm90b3R5cGUsIHtcbiAgICBvbkRvbWFpbiA6IGZ1bmN0aW9uICggZG9tYWluICkge1xuICAgICAgdGhpcy5fZG9tYWluID0gZG9tYWluO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB3aXRoQ29udGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCApIHtcbiAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpZlBsdXJhbCA6IGZ1bmN0aW9uICggbnVtLCBwa2V5ICkge1xuICAgICAgdGhpcy5fdmFsID0gbnVtO1xuICAgICAgdGhpcy5fcGtleSA9IHBrZXk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGZldGNoIDogZnVuY3Rpb24gKCBzQXJyICkge1xuICAgICAgaWYgKCB7fS50b1N0cmluZy5jYWxsKCBzQXJyICkgIT0gJ1tvYmplY3QgQXJyYXldJyApIHtcbiAgICAgICAgc0FyciA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoIHNBcnIgJiYgc0Fyci5sZW5ndGggPyBKZWQuc3ByaW50ZiA6IGZ1bmN0aW9uKHgpeyByZXR1cm4geDsgfSApKFxuICAgICAgICB0aGlzLl9pMThuLmRjbnBnZXR0ZXh0KHRoaXMuX2RvbWFpbiwgdGhpcy5fY29udGV4dCwgdGhpcy5fa2V5LCB0aGlzLl9wa2V5LCB0aGlzLl92YWwpLFxuICAgICAgICBzQXJyXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWRkIGZ1bmN0aW9ucyB0byB0aGUgSmVkIHByb3RvdHlwZS5cbiAgLy8gVGhlc2Ugd2lsbCBiZSB0aGUgZnVuY3Rpb25zIG9uIHRoZSBvYmplY3QgdGhhdCdzIHJldHVybmVkXG4gIC8vIGZyb20gY3JlYXRpbmcgYSBgbmV3IEplZCgpYFxuICAvLyBUaGVzZSBzZWVtIHJlZHVuZGFudCwgYnV0IHRoZXkgZ3ppcCBwcmV0dHkgd2VsbC5cbiAgXy5leHRlbmQoIEplZC5wcm90b3R5cGUsIHtcbiAgICAvLyBUaGUgc2V4aWVyIGFwaSBzdGFydCBwb2ludFxuICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgcmV0dXJuIG5ldyBDaGFpbigga2V5LCB0aGlzICk7XG4gICAgfSxcblxuICAgIHRleHRkb21haW4gOiBmdW5jdGlvbiAoIGRvbWFpbiApIHtcbiAgICAgIGlmICggISBkb21haW4gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0ZG9tYWluO1xuICAgICAgfVxuICAgICAgdGhpcy5fdGV4dGRvbWFpbiA9IGRvbWFpbjtcbiAgICB9LFxuXG4gICAgZ2V0dGV4dCA6IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwga2V5ICkge1xuICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGNnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4gLCBrZXkgLyosIGNhdGVnb3J5ICovICkge1xuICAgICAgLy8gSWdub3JlcyB0aGUgY2F0ZWdvcnkgYW55d2F5c1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIG5nZXR0ZXh0IDogZnVuY3Rpb24gKCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkbmdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRjbmdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgc2tleSwgcGtleSwgdmFsLyosIGNhdGVnb3J5ICovKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgcGdldHRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQsIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZHBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIGRjcGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwga2V5LyosIGNhdGVnb3J5ICovKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBucGdldHRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZG5wZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICAvLyBUaGUgbW9zdCBmdWxseSBxdWFsaWZpZWQgZ2V0dGV4dCBmdW5jdGlvbi4gSXQgaGFzIGV2ZXJ5IG9wdGlvbi5cbiAgICAvLyBTaW5jZSBpdCBoYXMgZXZlcnkgb3B0aW9uLCB3ZSBjYW4gdXNlIGl0IGZyb20gZXZlcnkgb3RoZXIgbWV0aG9kLlxuICAgIC8vIFRoaXMgaXMgdGhlIGJyZWFkIGFuZCBidXR0ZXIuXG4gICAgLy8gVGVjaG5pY2FsbHkgdGhlcmUgc2hvdWxkIGJlIG9uZSBtb3JlIGFyZ3VtZW50IGluIHRoaXMgZnVuY3Rpb24gZm9yICdDYXRlZ29yeScsXG4gICAgLy8gYnV0IHNpbmNlIHdlIG5ldmVyIHVzZSBpdCwgd2UgbWlnaHQgYXMgd2VsbCBub3Qgd2FzdGUgdGhlIGJ5dGVzIHRvIGRlZmluZSBpdC5cbiAgICBkY25wZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXksIHZhbCApIHtcbiAgICAgIC8vIFNldCBzb21lIGRlZmF1bHRzXG5cbiAgICAgIHBsdXJhbF9rZXkgPSBwbHVyYWxfa2V5IHx8IHNpbmd1bGFyX2tleTtcblxuICAgICAgLy8gVXNlIHRoZSBnbG9iYWwgZG9tYWluIGRlZmF1bHQgaWYgb25lXG4gICAgICAvLyBpc24ndCBleHBsaWNpdGx5IHBhc3NlZCBpblxuICAgICAgZG9tYWluID0gZG9tYWluIHx8IHRoaXMuX3RleHRkb21haW47XG5cbiAgICAgIHZhciBmYWxsYmFjaztcblxuICAgICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZXNcblxuICAgICAgLy8gTm8gb3B0aW9ucyBmb3VuZFxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucyApIHtcbiAgICAgICAgLy8gVGhlcmUncyBsaWtlbHkgc29tZXRoaW5nIHdyb25nLCBidXQgd2UnbGwgcmV0dXJuIHRoZSBjb3JyZWN0IGtleSBmb3IgZW5nbGlzaFxuICAgICAgICAvLyBXZSBkbyB0aGlzIGJ5IGluc3RhbnRpYXRpbmcgYSBicmFuZCBuZXcgSmVkIGluc3RhbmNlIHdpdGggdGhlIGRlZmF1bHQgc2V0XG4gICAgICAgIC8vIGZvciBldmVyeXRoaW5nIHRoYXQgY291bGQgYmUgYnJva2VuLlxuICAgICAgICBmYWxsYmFjayA9IG5ldyBKZWQoKTtcbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrLmRjbnBnZXR0ZXh0LmNhbGwoIGZhbGxiYWNrLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5LCB2YWwgKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gdHJhbnNsYXRpb24gZGF0YSBwcm92aWRlZFxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBsb2NhbGUgZGF0YSBwcm92aWRlZC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgZG9tYWluIF0gKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9tYWluIGAnICsgZG9tYWluICsgJ2Agd2FzIG5vdCBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgZG9tYWluIF1bIFwiXCIgXSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBsb2NhbGUgbWV0YSBpbmZvcm1hdGlvbiBwcm92aWRlZC4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYSB0cnV0aHkga2V5LiBPdGhlcndpc2Ugd2UgbWlnaHQgc3RhcnQgbG9va2luZ1xuICAgICAgLy8gaW50byB0aGUgZW1wdHkgc3RyaW5nIGtleSwgd2hpY2ggaXMgdGhlIG9wdGlvbnMgZm9yIHRoZSBsb2NhbGVcbiAgICAgIC8vIGRhdGEuXG4gICAgICBpZiAoICEgc2luZ3VsYXJfa2V5ICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHRyYW5zbGF0aW9uIGtleSBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSAgPSBjb250ZXh0ID8gY29udGV4dCArIEplZC5jb250ZXh0X2RlbGltaXRlciArIHNpbmd1bGFyX2tleSA6IHNpbmd1bGFyX2tleSxcbiAgICAgICAgICBsb2NhbGVfZGF0YSA9IHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YSxcbiAgICAgICAgICBkaWN0ID0gbG9jYWxlX2RhdGFbIGRvbWFpbiBdLFxuICAgICAgICAgIGRlZmF1bHRDb25mID0gKGxvY2FsZV9kYXRhLm1lc3NhZ2VzIHx8IHRoaXMuZGVmYXVsdHMubG9jYWxlX2RhdGEubWVzc2FnZXMpW1wiXCJdLFxuICAgICAgICAgIHBsdXJhbEZvcm1zID0gZGljdFtcIlwiXS5wbHVyYWxfZm9ybXMgfHwgZGljdFtcIlwiXVtcIlBsdXJhbC1Gb3Jtc1wiXSB8fCBkaWN0W1wiXCJdW1wicGx1cmFsLWZvcm1zXCJdIHx8IGRlZmF1bHRDb25mLnBsdXJhbF9mb3JtcyB8fCBkZWZhdWx0Q29uZltcIlBsdXJhbC1Gb3Jtc1wiXSB8fCBkZWZhdWx0Q29uZltcInBsdXJhbC1mb3Jtc1wiXSxcbiAgICAgICAgICB2YWxfbGlzdCxcbiAgICAgICAgICByZXM7XG5cbiAgICAgIHZhciB2YWxfaWR4O1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIHZhbHVlIHBhc3NlZCBpbjsgYXNzdW1lIHNpbmd1bGFyIGtleSBsb29rdXAuXG4gICAgICAgIHZhbF9pZHggPSAwO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBWYWx1ZSBoYXMgYmVlbiBwYXNzZWQgaW47IHVzZSBwbHVyYWwtZm9ybXMgY2FsY3VsYXRpb25zLlxuXG4gICAgICAgIC8vIEhhbmRsZSBpbnZhbGlkIG51bWJlcnMsIGJ1dCB0cnkgY2FzdGluZyBzdHJpbmdzIGZvciBnb29kIG1lYXN1cmVcbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsICE9ICdudW1iZXInICkge1xuICAgICAgICAgIHZhbCA9IHBhcnNlSW50KCB2YWwsIDEwICk7XG5cbiAgICAgICAgICBpZiAoIGlzTmFOKCB2YWwgKSApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIG51bWJlciB0aGF0IHdhcyBwYXNzZWQgaW4gaXMgbm90IGEgbnVtYmVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhbF9pZHggPSBnZXRQbHVyYWxGb3JtRnVuYyhwbHVyYWxGb3JtcykodmFsKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhyb3cgYW4gZXJyb3IgaWYgYSBkb21haW4gaXNuJ3QgZm91bmRcbiAgICAgIGlmICggISBkaWN0ICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRvbWFpbiBuYW1lZCBgJyArIGRvbWFpbiArICdgIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICB2YWxfbGlzdCA9IGRpY3RbIGtleSBdO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBtYXRjaCwgdGhlbiByZXZlcnQgYmFjayB0b1xuICAgICAgLy8gZW5nbGlzaCBzdHlsZSBzaW5ndWxhci9wbHVyYWwgd2l0aCB0aGUga2V5cyBwYXNzZWQgaW4uXG4gICAgICBpZiAoICEgdmFsX2xpc3QgfHwgdmFsX2lkeCA+IHZhbF9saXN0Lmxlbmd0aCApIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5taXNzaW5nX2tleV9jYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5taXNzaW5nX2tleV9jYWxsYmFjayhrZXksIGRvbWFpbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gWyBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXkgXTtcblxuICAgICAgICAvLyBjb2xsZWN0IHVudHJhbnNsYXRlZCBzdHJpbmdzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWc9PT10cnVlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzWyBnZXRQbHVyYWxGb3JtRnVuYyhwbHVyYWxGb3JtcykoIHZhbCApIF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNbIGdldFBsdXJhbEZvcm1GdW5jKCkoIHZhbCApIF07XG4gICAgICB9XG5cbiAgICAgIHJlcyA9IHZhbF9saXN0WyB2YWxfaWR4IF07XG5cbiAgICAgIC8vIFRoaXMgaW5jbHVkZXMgZW1wdHkgc3RyaW5ncyBvbiBwdXJwb3NlXG4gICAgICBpZiAoICEgcmVzICApIHtcbiAgICAgICAgcmVzID0gWyBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXkgXTtcbiAgICAgICAgcmV0dXJuIHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMoKSggdmFsICkgXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9KTtcblxuXG4gIC8vIFdlIGFkZCBpbiBzcHJpbnRmIGNhcGFiaWxpdGllcyBmb3IgcG9zdCB0cmFuc2xhdGlvbiB2YWx1ZSBpbnRlcm9sYXRpb25cbiAgLy8gVGhpcyBpcyBub3QgaW50ZXJuYWxseSB1c2VkLCBzbyB5b3UgY2FuIHJlbW92ZSBpdCBpZiB5b3UgaGF2ZSB0aGlzXG4gIC8vIGF2YWlsYWJsZSBzb21ld2hlcmUgZWxzZSwgb3Igd2FudCB0byB1c2UgYSBkaWZmZXJlbnQgc3lzdGVtLlxuXG4gIC8vIFdlIF9zbGlnaHRseV8gbW9kaWZ5IHRoZSBub3JtYWwgc3ByaW50ZiBiZWhhdmlvciB0byBtb3JlIGdyYWNlZnVsbHkgaGFuZGxlXG4gIC8vIHVuZGVmaW5lZCB2YWx1ZXMuXG5cbiAgLyoqXG4gICBzcHJpbnRmKCkgZm9yIEphdmFTY3JpcHQgMC43LWJldGExXG4gICBodHRwOi8vd3d3LmRpdmVpbnRvamF2YXNjcmlwdC5jb20vcHJvamVjdHMvamF2YXNjcmlwdC1zcHJpbnRmXG5cbiAgIENvcHlyaWdodCAoYykgQWxleGFuZHJ1IE1hcmFzdGVhbnUgPGFsZXhhaG9saWMgW2F0KSBnbWFpbCAoZG90XSBjb20+XG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG4gICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICAgICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICAgICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBzcHJpbnRmKCkgZm9yIEphdmFTY3JpcHQgbm9yIHRoZVxuICAgICAgICAgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHNcbiAgICAgICAgIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkRcbiAgIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG4gICBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFXG4gICBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBBbGV4YW5kcnUgTWFyYXN0ZWFudSBCRSBMSUFCTEUgRk9SIEFOWVxuICAgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAgIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAgIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICAgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAgIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAgKi9cbiAgdmFyIHNwcmludGYgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZ2V0X3R5cGUodmFyaWFibGUpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdHJfcmVwZWF0KGlucHV0LCBtdWx0aXBsaWVyKSB7XG4gICAgICBmb3IgKHZhciBvdXRwdXQgPSBbXTsgbXVsdGlwbGllciA+IDA7IG91dHB1dFstLW11bHRpcGxpZXJdID0gaW5wdXQpIHsvKiBkbyBub3RoaW5nICovfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICB9XG5cbiAgICB2YXIgc3RyX2Zvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzdHJfZm9ybWF0LmNhY2hlLmhhc093blByb3BlcnR5KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgc3RyX2Zvcm1hdC5jYWNoZVthcmd1bWVudHNbMF1dID0gc3RyX2Zvcm1hdC5wYXJzZShhcmd1bWVudHNbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cl9mb3JtYXQuZm9ybWF0LmNhbGwobnVsbCwgc3RyX2Zvcm1hdC5jYWNoZVthcmd1bWVudHNbMF1dLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzdHJfZm9ybWF0LmZvcm1hdCA9IGZ1bmN0aW9uKHBhcnNlX3RyZWUsIGFyZ3YpIHtcbiAgICAgIHZhciBjdXJzb3IgPSAxLCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoLCBub2RlX3R5cGUgPSAnJywgYXJnLCBvdXRwdXQgPSBbXSwgaSwgaywgbWF0Y2gsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5vZGVfdHlwZSA9IGdldF90eXBlKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICBpZiAobm9kZV90eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGVfdHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgIG1hdGNoID0gcGFyc2VfdHJlZVtpXTsgLy8gY29udmVuaWVuY2UgcHVycG9zZXMgb25seVxuICAgICAgICAgIGlmIChtYXRjaFsyXSkgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl07XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbWF0Y2hbMl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgaWYgKCFhcmcuaGFzT3duUHJvcGVydHkobWF0Y2hbMl1ba10pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3coc3ByaW50ZignW3NwcmludGZdIHByb3BlcnR5IFwiJXNcIiBkb2VzIG5vdCBleGlzdCcsIG1hdGNoWzJdW2tdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXJnID0gYXJnW21hdGNoWzJdW2tdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAobWF0Y2hbMV0pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W21hdGNoWzFdXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9bXnNdLy50ZXN0KG1hdGNoWzhdKSAmJiAoZ2V0X3R5cGUoYXJnKSAhPSAnbnVtYmVyJykpIHtcbiAgICAgICAgICAgIHRocm93KHNwcmludGYoJ1tzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlcycsIGdldF90eXBlKGFyZykpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBKZWQgRURJVFxuICAgICAgICAgIGlmICggdHlwZW9mIGFyZyA9PSAndW5kZWZpbmVkJyB8fCBhcmcgPT09IG51bGwgKSB7XG4gICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSmVkIEVESVRcblxuICAgICAgICAgIHN3aXRjaCAobWF0Y2hbOF0pIHtcbiAgICAgICAgICAgIGNhc2UgJ2InOiBhcmcgPSBhcmcudG9TdHJpbmcoMik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYyc6IGFyZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkJzogYXJnID0gcGFyc2VJbnQoYXJnLCAxMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZSc6IGFyZyA9IG1hdGNoWzddID8gYXJnLnRvRXhwb25lbnRpYWwobWF0Y2hbN10pIDogYXJnLnRvRXhwb25lbnRpYWwoKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmJzogYXJnID0gbWF0Y2hbN10gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbyc6IGFyZyA9IGFyZy50b1N0cmluZyg4KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzJzogYXJnID0gKChhcmcgPSBTdHJpbmcoYXJnKSkgJiYgbWF0Y2hbN10gPyBhcmcuc3Vic3RyaW5nKDAsIG1hdGNoWzddKSA6IGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndSc6IGFyZyA9IE1hdGguYWJzKGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAneCc6IGFyZyA9IGFyZy50b1N0cmluZygxNik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnWCc6IGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZyA9ICgvW2RlZl0vLnRlc3QobWF0Y2hbOF0pICYmIG1hdGNoWzNdICYmIGFyZyA+PSAwID8gJysnKyBhcmcgOiBhcmcpO1xuICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBtYXRjaFs0XSA/IG1hdGNoWzRdID09ICcwJyA/ICcwJyA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6ICcgJztcbiAgICAgICAgICBwYWRfbGVuZ3RoID0gbWF0Y2hbNl0gLSBTdHJpbmcoYXJnKS5sZW5ndGg7XG4gICAgICAgICAgcGFkID0gbWF0Y2hbNl0gPyBzdHJfcmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogJyc7XG4gICAgICAgICAgb3V0cHV0LnB1c2gobWF0Y2hbNV0gPyBhcmcgKyBwYWQgOiBwYWQgKyBhcmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH07XG5cbiAgICBzdHJfZm9ybWF0LmNhY2hlID0ge307XG5cbiAgICBzdHJfZm9ybWF0LnBhcnNlID0gZnVuY3Rpb24oZm10KSB7XG4gICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2ggPSBbXSwgcGFyc2VfdHJlZSA9IFtdLCBhcmdfbmFtZXMgPSAwO1xuICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgaWYgKChtYXRjaCA9IC9eW15cXHgyNV0rLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNXsyfS8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1KD86KFsxLTldXFxkKilcXCR8XFwoKFteXFwpXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1mb3N1eFhdKS8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxO1xuICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXTtcbiAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSAnJykge1xuICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gL15cXFsoXFxkKylcXF0vLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhcmdfbmFtZXMgfD0gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgfVxuICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZV90cmVlO1xuICAgIH07XG5cbiAgICByZXR1cm4gc3RyX2Zvcm1hdDtcbiAgfSkoKTtcblxuICB2YXIgdnNwcmludGYgPSBmdW5jdGlvbihmbXQsIGFyZ3YpIHtcbiAgICBhcmd2LnVuc2hpZnQoZm10KTtcbiAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBhcmd2KTtcbiAgfTtcblxuICBKZWQucGFyc2VfcGx1cmFsID0gZnVuY3Rpb24gKCBwbHVyYWxfZm9ybXMsIG4gKSB7XG4gICAgcGx1cmFsX2Zvcm1zID0gcGx1cmFsX2Zvcm1zLnJlcGxhY2UoL24vZywgbik7XG4gICAgcmV0dXJuIEplZC5wYXJzZV9leHByZXNzaW9uKHBsdXJhbF9mb3Jtcyk7XG4gIH07XG5cbiAgSmVkLnNwcmludGYgPSBmdW5jdGlvbiAoIGZtdCwgYXJncyApIHtcbiAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoIGFyZ3MgKSA9PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgcmV0dXJuIHZzcHJpbnRmKCBmbXQsIFtdLnNsaWNlLmNhbGwoYXJncykgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcmludGYuYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpICk7XG4gIH07XG5cbiAgSmVkLnByb3RvdHlwZS5zcHJpbnRmID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBKZWQuc3ByaW50Zi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuICAvLyBFTkQgc3ByaW50ZiBJbXBsZW1lbnRhdGlvblxuXG4gIC8vIFN0YXJ0IHRoZSBQbHVyYWwgZm9ybXMgc2VjdGlvblxuICAvLyBUaGlzIGlzIGEgZnVsbCBwbHVyYWwgZm9ybSBleHByZXNzaW9uIHBhcnNlci4gSXQgaXMgdXNlZCB0byBhdm9pZFxuICAvLyBydW5uaW5nICdldmFsJyBvciAnbmV3IEZ1bmN0aW9uJyBkaXJlY3RseSBhZ2FpbnN0IHRoZSBwbHVyYWxcbiAgLy8gZm9ybXMuXG4gIC8vXG4gIC8vIFRoaXMgY2FuIGJlIGltcG9ydGFudCBpZiB5b3UgZ2V0IHRyYW5zbGF0aW9ucyBkb25lIHRocm91Z2ggYSAzcmRcbiAgLy8gcGFydHkgdmVuZG9yLiBJIGVuY291cmFnZSB5b3UgdG8gdXNlIHRoaXMgaW5zdGVhZCwgaG93ZXZlciwgSVxuICAvLyBhbHNvIHdpbGwgcHJvdmlkZSBhICdwcmVjb21waWxlcicgdGhhdCB5b3UgY2FuIHVzZSBhdCBidWlsZCB0aW1lXG4gIC8vIHRvIG91dHB1dCB2YWxpZC9zYWZlIGZ1bmN0aW9uIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgcGx1cmFsIGZvcm1cbiAgLy8gZXhwcmVzc2lvbnMuIFRoaXMgbWVhbnMgeW91IGNhbiBidWlsZCB0aGlzIGNvZGUgb3V0IGZvciB0aGUgbW9zdFxuICAvLyBwYXJ0LlxuICBKZWQuUEYgPSB7fTtcblxuICBKZWQuUEYucGFyc2UgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgdmFyIHBsdXJhbF9zdHIgPSBKZWQuUEYuZXh0cmFjdFBsdXJhbEV4cHIoIHAgKTtcbiAgICByZXR1cm4gSmVkLlBGLnBhcnNlci5wYXJzZS5jYWxsKEplZC5QRi5wYXJzZXIsIHBsdXJhbF9zdHIpO1xuICB9O1xuXG4gIEplZC5QRi5jb21waWxlID0gZnVuY3Rpb24gKCBwICkge1xuICAgIC8vIEhhbmRsZSB0cnVlcyBhbmQgZmFsc2VzIGFzIDAgYW5kIDFcbiAgICBmdW5jdGlvbiBpbXBseSggdmFsICkge1xuICAgICAgcmV0dXJuICh2YWwgPT09IHRydWUgPyAxIDogdmFsID8gdmFsIDogMCk7XG4gICAgfVxuXG4gICAgdmFyIGFzdCA9IEplZC5QRi5wYXJzZSggcCApO1xuICAgIHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICByZXR1cm4gaW1wbHkoIEplZC5QRi5pbnRlcnByZXRlciggYXN0ICkoIG4gKSApO1xuICAgIH07XG4gIH07XG5cbiAgSmVkLlBGLmludGVycHJldGVyID0gZnVuY3Rpb24gKCBhc3QgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggbiApIHtcbiAgICAgIHZhciByZXM7XG4gICAgICBzd2l0Y2ggKCBhc3QudHlwZSApIHtcbiAgICAgICAgY2FzZSAnR1JPVVAnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5leHByICkoIG4gKTtcbiAgICAgICAgY2FzZSAnVEVSTkFSWSc6XG4gICAgICAgICAgaWYgKCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5leHByICkoIG4gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC50cnV0aHkgKSggbiApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QuZmFsc2V5ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnT1InOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSB8fCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0FORCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICYmIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTFQnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA8IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnR1QnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA+IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTFRFJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPD0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdHVEUnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA+PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0VRJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPT0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdORVEnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAhPSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ01PRCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICUgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdWQVInOlxuICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICBjYXNlICdOVU0nOlxuICAgICAgICAgIHJldHVybiBhc3QudmFsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgVG9rZW4gZm91bmQuXCIpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgSmVkLlBGLmV4dHJhY3RQbHVyYWxFeHByID0gZnVuY3Rpb24gKCBwICkge1xuICAgIC8vIHRyaW0gZmlyc3RcbiAgICBwID0gcC5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcblxuICAgIGlmICghIC87XFxzKiQvLnRlc3QocCkpIHtcbiAgICAgIHAgPSBwLmNvbmNhdCgnOycpO1xuICAgIH1cblxuICAgIHZhciBucGx1cmFsc19yZSA9IC9ucGx1cmFsc1xcPShcXGQrKTsvLFxuICAgICAgICBwbHVyYWxfcmUgPSAvcGx1cmFsXFw9KC4qKTsvLFxuICAgICAgICBucGx1cmFsc19tYXRjaGVzID0gcC5tYXRjaCggbnBsdXJhbHNfcmUgKSxcbiAgICAgICAgcmVzID0ge30sXG4gICAgICAgIHBsdXJhbF9tYXRjaGVzO1xuXG4gICAgLy8gRmluZCB0aGUgbnBsdXJhbHMgbnVtYmVyXG4gICAgaWYgKCBucGx1cmFsc19tYXRjaGVzLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXMubnBsdXJhbHMgPSBucGx1cmFsc19tYXRjaGVzWzFdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbnBsdXJhbHMgbm90IGZvdW5kIGluIHBsdXJhbF9mb3JtcyBzdHJpbmc6ICcgKyBwICk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoYXQgZGF0YSB0byBnZXQgdG8gdGhlIGZvcm11bGFcbiAgICBwID0gcC5yZXBsYWNlKCBucGx1cmFsc19yZSwgXCJcIiApO1xuICAgIHBsdXJhbF9tYXRjaGVzID0gcC5tYXRjaCggcGx1cmFsX3JlICk7XG5cbiAgICBpZiAoISggcGx1cmFsX21hdGNoZXMgJiYgcGx1cmFsX21hdGNoZXMubGVuZ3RoID4gMSApICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgcGx1cmFsYCBleHByZXNzaW9uIG5vdCBmb3VuZDogJyArIHApO1xuICAgIH1cbiAgICByZXR1cm4gcGx1cmFsX21hdGNoZXNbIDEgXTtcbiAgfTtcblxuICAvKiBKaXNvbiBnZW5lcmF0ZWQgcGFyc2VyICovXG4gIEplZC5QRi5wYXJzZXIgPSAoZnVuY3Rpb24oKXtcblxudmFyIHBhcnNlciA9IHt0cmFjZTogZnVuY3Rpb24gdHJhY2UoKSB7IH0sXG55eToge30sXG5zeW1ib2xzXzoge1wiZXJyb3JcIjoyLFwiZXhwcmVzc2lvbnNcIjozLFwiZVwiOjQsXCJFT0ZcIjo1LFwiP1wiOjYsXCI6XCI6NyxcInx8XCI6OCxcIiYmXCI6OSxcIjxcIjoxMCxcIjw9XCI6MTEsXCI+XCI6MTIsXCI+PVwiOjEzLFwiIT1cIjoxNCxcIj09XCI6MTUsXCIlXCI6MTYsXCIoXCI6MTcsXCIpXCI6MTgsXCJuXCI6MTksXCJOVU1CRVJcIjoyMCxcIiRhY2NlcHRcIjowLFwiJGVuZFwiOjF9LFxudGVybWluYWxzXzogezI6XCJlcnJvclwiLDU6XCJFT0ZcIiw2OlwiP1wiLDc6XCI6XCIsODpcInx8XCIsOTpcIiYmXCIsMTA6XCI8XCIsMTE6XCI8PVwiLDEyOlwiPlwiLDEzOlwiPj1cIiwxNDpcIiE9XCIsMTU6XCI9PVwiLDE2OlwiJVwiLDE3OlwiKFwiLDE4OlwiKVwiLDE5OlwiblwiLDIwOlwiTlVNQkVSXCJ9LFxucHJvZHVjdGlvbnNfOiBbMCxbMywyXSxbNCw1XSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwxXSxbNCwxXV0sXG5wZXJmb3JtQWN0aW9uOiBmdW5jdGlvbiBhbm9ueW1vdXMoeXl0ZXh0LHl5bGVuZyx5eWxpbmVubyx5eSx5eXN0YXRlLCQkLF8kKSB7XG5cbnZhciAkMCA9ICQkLmxlbmd0aCAtIDE7XG5zd2l0Y2ggKHl5c3RhdGUpIHtcbmNhc2UgMTogcmV0dXJuIHsgdHlwZSA6ICdHUk9VUCcsIGV4cHI6ICQkWyQwLTFdIH07XG5icmVhaztcbmNhc2UgMjp0aGlzLiQgPSB7IHR5cGU6ICdURVJOQVJZJywgZXhwcjogJCRbJDAtNF0sIHRydXRoeSA6ICQkWyQwLTJdLCBmYWxzZXk6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDM6dGhpcy4kID0geyB0eXBlOiBcIk9SXCIsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNDp0aGlzLiQgPSB7IHR5cGU6IFwiQU5EXCIsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNTp0aGlzLiQgPSB7IHR5cGU6ICdMVCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNjp0aGlzLiQgPSB7IHR5cGU6ICdMVEUnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDc6dGhpcy4kID0geyB0eXBlOiAnR1QnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDg6dGhpcy4kID0geyB0eXBlOiAnR1RFJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA5OnRoaXMuJCA9IHsgdHlwZTogJ05FUScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTA6dGhpcy4kID0geyB0eXBlOiAnRVEnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDExOnRoaXMuJCA9IHsgdHlwZTogJ01PRCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTI6dGhpcy4kID0geyB0eXBlOiAnR1JPVVAnLCBleHByOiAkJFskMC0xXSB9O1xuYnJlYWs7XG5jYXNlIDEzOnRoaXMuJCA9IHsgdHlwZTogJ1ZBUicgfTtcbmJyZWFrO1xuY2FzZSAxNDp0aGlzLiQgPSB7IHR5cGU6ICdOVU0nLCB2YWw6IE51bWJlcih5eXRleHQpIH07XG5icmVhaztcbn1cbn0sXG50YWJsZTogW3szOjEsNDoyLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7MTpbM119LHs1OlsxLDZdLDY6WzEsN10sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XX0sezQ6MTcsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs1OlsyLDEzXSw2OlsyLDEzXSw3OlsyLDEzXSw4OlsyLDEzXSw5OlsyLDEzXSwxMDpbMiwxM10sMTE6WzIsMTNdLDEyOlsyLDEzXSwxMzpbMiwxM10sMTQ6WzIsMTNdLDE1OlsyLDEzXSwxNjpbMiwxM10sMTg6WzIsMTNdfSx7NTpbMiwxNF0sNjpbMiwxNF0sNzpbMiwxNF0sODpbMiwxNF0sOTpbMiwxNF0sMTA6WzIsMTRdLDExOlsyLDE0XSwxMjpbMiwxNF0sMTM6WzIsMTRdLDE0OlsyLDE0XSwxNTpbMiwxNF0sMTY6WzIsMTRdLDE4OlsyLDE0XX0sezE6WzIsMV19LHs0OjE4LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoxOSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjAsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIxLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjMsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI0LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjYsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI3LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NjpbMSw3XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsxLDI4XX0sezY6WzEsN10sNzpbMSwyOV0sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XX0sezU6WzIsM10sNjpbMiwzXSw3OlsyLDNdLDg6WzIsM10sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsM119LHs1OlsyLDRdLDY6WzIsNF0sNzpbMiw0XSw4OlsyLDRdLDk6WzIsNF0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDRdfSx7NTpbMiw1XSw2OlsyLDVdLDc6WzIsNV0sODpbMiw1XSw5OlsyLDVdLDEwOlsyLDVdLDExOlsyLDVdLDEyOlsyLDVdLDEzOlsyLDVdLDE0OlsyLDVdLDE1OlsyLDVdLDE2OlsxLDE2XSwxODpbMiw1XX0sezU6WzIsNl0sNjpbMiw2XSw3OlsyLDZdLDg6WzIsNl0sOTpbMiw2XSwxMDpbMiw2XSwxMTpbMiw2XSwxMjpbMiw2XSwxMzpbMiw2XSwxNDpbMiw2XSwxNTpbMiw2XSwxNjpbMSwxNl0sMTg6WzIsNl19LHs1OlsyLDddLDY6WzIsN10sNzpbMiw3XSw4OlsyLDddLDk6WzIsN10sMTA6WzIsN10sMTE6WzIsN10sMTI6WzIsN10sMTM6WzIsN10sMTQ6WzIsN10sMTU6WzIsN10sMTY6WzEsMTZdLDE4OlsyLDddfSx7NTpbMiw4XSw2OlsyLDhdLDc6WzIsOF0sODpbMiw4XSw5OlsyLDhdLDEwOlsyLDhdLDExOlsyLDhdLDEyOlsyLDhdLDEzOlsyLDhdLDE0OlsyLDhdLDE1OlsyLDhdLDE2OlsxLDE2XSwxODpbMiw4XX0sezU6WzIsOV0sNjpbMiw5XSw3OlsyLDldLDg6WzIsOV0sOTpbMiw5XSwxMDpbMiw5XSwxMTpbMiw5XSwxMjpbMiw5XSwxMzpbMiw5XSwxNDpbMiw5XSwxNTpbMiw5XSwxNjpbMSwxNl0sMTg6WzIsOV19LHs1OlsyLDEwXSw2OlsyLDEwXSw3OlsyLDEwXSw4OlsyLDEwXSw5OlsyLDEwXSwxMDpbMiwxMF0sMTE6WzIsMTBdLDEyOlsyLDEwXSwxMzpbMiwxMF0sMTQ6WzIsMTBdLDE1OlsyLDEwXSwxNjpbMSwxNl0sMTg6WzIsMTBdfSx7NTpbMiwxMV0sNjpbMiwxMV0sNzpbMiwxMV0sODpbMiwxMV0sOTpbMiwxMV0sMTA6WzIsMTFdLDExOlsyLDExXSwxMjpbMiwxMV0sMTM6WzIsMTFdLDE0OlsyLDExXSwxNTpbMiwxMV0sMTY6WzIsMTFdLDE4OlsyLDExXX0sezU6WzIsMTJdLDY6WzIsMTJdLDc6WzIsMTJdLDg6WzIsMTJdLDk6WzIsMTJdLDEwOlsyLDEyXSwxMTpbMiwxMl0sMTI6WzIsMTJdLDEzOlsyLDEyXSwxNDpbMiwxMl0sMTU6WzIsMTJdLDE2OlsyLDEyXSwxODpbMiwxMl19LHs0OjMwLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NTpbMiwyXSw2OlsxLDddLDc6WzIsMl0sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiwyXX1dLFxuZGVmYXVsdEFjdGlvbnM6IHs2OlsyLDFdfSxcbnBhcnNlRXJyb3I6IGZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG59LFxucGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBzdGFjayA9IFswXSxcbiAgICAgICAgdnN0YWNrID0gW251bGxdLCAvLyBzZW1hbnRpYyB2YWx1ZSBzdGFja1xuICAgICAgICBsc3RhY2sgPSBbXSwgLy8gbG9jYXRpb24gc3RhY2tcbiAgICAgICAgdGFibGUgPSB0aGlzLnRhYmxlLFxuICAgICAgICB5eXRleHQgPSAnJyxcbiAgICAgICAgeXlsaW5lbm8gPSAwLFxuICAgICAgICB5eWxlbmcgPSAwLFxuICAgICAgICByZWNvdmVyaW5nID0gMCxcbiAgICAgICAgVEVSUk9SID0gMixcbiAgICAgICAgRU9GID0gMTtcblxuICAgIC8vdGhpcy5yZWR1Y3Rpb25Db3VudCA9IHRoaXMuc2hpZnRDb3VudCA9IDA7XG5cbiAgICB0aGlzLmxleGVyLnNldElucHV0KGlucHV0KTtcbiAgICB0aGlzLmxleGVyLnl5ID0gdGhpcy55eTtcbiAgICB0aGlzLnl5LmxleGVyID0gdGhpcy5sZXhlcjtcbiAgICBpZiAodHlwZW9mIHRoaXMubGV4ZXIueXlsbG9jID09ICd1bmRlZmluZWQnKVxuICAgICAgICB0aGlzLmxleGVyLnl5bGxvYyA9IHt9O1xuICAgIHZhciB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgIGxzdGFjay5wdXNoKHl5bG9jKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy55eS5wYXJzZUVycm9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0aGlzLnl5LnBhcnNlRXJyb3I7XG5cbiAgICBmdW5jdGlvbiBwb3BTdGFjayAobikge1xuICAgICAgICBzdGFjay5sZW5ndGggPSBzdGFjay5sZW5ndGggLSAyKm47XG4gICAgICAgIHZzdGFjay5sZW5ndGggPSB2c3RhY2subGVuZ3RoIC0gbjtcbiAgICAgICAgbHN0YWNrLmxlbmd0aCA9IGxzdGFjay5sZW5ndGggLSBuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICB0b2tlbiA9IHNlbGYubGV4ZXIubGV4KCkgfHwgMTsgLy8gJGVuZCA9IDFcbiAgICAgICAgLy8gaWYgdG9rZW4gaXNuJ3QgaXRzIG51bWVyaWMgdmFsdWUsIGNvbnZlcnRcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRva2VuID0gc2VsZi5zeW1ib2xzX1t0b2tlbl0gfHwgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIHZhciBzeW1ib2wsIHByZUVycm9yU3ltYm9sLCBzdGF0ZSwgYWN0aW9uLCBhLCByLCB5eXZhbD17fSxwLGxlbixuZXdTdGF0ZSwgZXhwZWN0ZWQ7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgLy8gcmV0cmVpdmUgc3RhdGUgbnVtYmVyIGZyb20gdG9wIG9mIHN0YWNrXG4gICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuXG4gICAgICAgIC8vIHVzZSBkZWZhdWx0IGFjdGlvbnMgaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuICAgICAgICAgICAgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3ltYm9sID09IG51bGwpXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG4gICAgICAgICAgICAvLyByZWFkIGFjdGlvbiBmb3IgY3VycmVudCBzdGF0ZSBhbmQgZmlyc3QgaW5wdXRcbiAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bc3ltYm9sXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwYXJzZSBlcnJvclxuICAgICAgICBfaGFuZGxlX2Vycm9yOlxuICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xuXG4gICAgICAgICAgICBpZiAoIXJlY292ZXJpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXBvcnQgZXJyb3JcbiAgICAgICAgICAgICAgICBleHBlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAocCBpbiB0YWJsZVtzdGF0ZV0pIGlmICh0aGlzLnRlcm1pbmFsc19bcF0gJiYgcCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQucHVzaChcIidcIit0aGlzLnRlcm1pbmFsc19bcF0rXCInXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZXJyU3RyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyclN0ciA9ICdQYXJzZSBlcnJvciBvbiBsaW5lICcrKHl5bGluZW5vKzEpK1wiOlxcblwiK3RoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKCkrXCJcXG5FeHBlY3RpbmcgXCIrZXhwZWN0ZWQuam9pbignLCAnKSArIFwiLCBnb3QgJ1wiICsgdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0rIFwiJ1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVyclN0ciA9ICdQYXJzZSBlcnJvciBvbiBsaW5lICcrKHl5bGluZW5vKzEpK1wiOiBVbmV4cGVjdGVkIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3ltYm9sID09IDEgLypFT0YqLyA/IFwiZW5kIG9mIGlucHV0XCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIidcIisodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKStcIidcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoZXJyU3RyLFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogdGhpcy5sZXhlci5tYXRjaCwgdG9rZW46IHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCwgbGluZTogdGhpcy5sZXhlci55eWxpbmVubywgbG9jOiB5eWxvYywgZXhwZWN0ZWQ6IGV4cGVjdGVkfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGp1c3QgcmVjb3ZlcmVkIGZyb20gYW5vdGhlciBlcnJvclxuICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gRU9GKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJTdHIgfHwgJ1BhcnNpbmcgaGFsdGVkLicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRpc2NhcmQgY3VycmVudCBsb29rYWhlYWQgYW5kIGdyYWIgYW5vdGhlclxuICAgICAgICAgICAgICAgIHl5bGVuZyA9IHRoaXMubGV4ZXIueXlsZW5nO1xuICAgICAgICAgICAgICAgIHl5dGV4dCA9IHRoaXMubGV4ZXIueXl0ZXh0O1xuICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0cnkgdG8gcmVjb3ZlciBmcm9tIGVycm9yXG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBlcnJvciByZWNvdmVyeSBydWxlIGluIHRoaXMgc3RhdGVcbiAgICAgICAgICAgICAgICBpZiAoKFRFUlJPUi50b1N0cmluZygpKSBpbiB0YWJsZVtzdGF0ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJTdHIgfHwgJ1BhcnNpbmcgaGFsdGVkLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwb3BTdGFjaygxKTtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBzeW1ib2w7IC8vIHNhdmUgdGhlIGxvb2thaGVhZCB0b2tlblxuICAgICAgICAgICAgc3ltYm9sID0gVEVSUk9SOyAgICAgICAgIC8vIGluc2VydCBnZW5lcmljIGVycm9yIHN5bWJvbCBhcyBuZXcgbG9va2FoZWFkXG4gICAgICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bVEVSUk9SXTtcbiAgICAgICAgICAgIHJlY292ZXJpbmcgPSAzOyAvLyBhbGxvdyAzIHJlYWwgc3ltYm9scyB0byBiZSBzaGlmdGVkIGJlZm9yZSByZXBvcnRpbmcgYSBuZXcgZXJyb3JcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMgc2hvdWxkbid0IGhhcHBlbiwgdW5sZXNzIHJlc29sdmUgZGVmYXVsdHMgYXJlIG9mZlxuICAgICAgICBpZiAoYWN0aW9uWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgYWN0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyc2UgRXJyb3I6IG11bHRpcGxlIGFjdGlvbnMgcG9zc2libGUgYXQgc3RhdGU6ICcrc3RhdGUrJywgdG9rZW46ICcrc3ltYm9sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gc2hpZnRcbiAgICAgICAgICAgICAgICAvL3RoaXMuc2hpZnRDb3VudCsrO1xuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHRoaXMubGV4ZXIueXl0ZXh0KTtcbiAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh0aGlzLmxleGVyLnl5bGxvYyk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhY3Rpb25bMV0pOyAvLyBwdXNoIHN0YXRlXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIXByZUVycm9yU3ltYm9sKSB7IC8vIG5vcm1hbCBleGVjdXRpb24vbm8gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG4gICAgICAgICAgICAgICAgICAgIHl5dGV4dCA9IHRoaXMubGV4ZXIueXl0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvdmVyaW5nID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY292ZXJpbmctLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBlcnJvciBqdXN0IG9jY3VycmVkLCByZXN1bWUgb2xkIGxvb2thaGVhZCBmLyBiZWZvcmUgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIHByZUVycm9yU3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMjogLy8gcmVkdWNlXG4gICAgICAgICAgICAgICAgLy90aGlzLnJlZHVjdGlvbkNvdW50Kys7XG5cbiAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzFdO1xuXG4gICAgICAgICAgICAgICAgLy8gcGVyZm9ybSBzZW1hbnRpYyBhY3Rpb25cbiAgICAgICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGgtbGVuXTsgLy8gZGVmYXVsdCB0byAkJCA9ICQxXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBsb2NhdGlvbiwgdXNlcyBmaXJzdCB0b2tlbiBmb3IgZmlyc3RzLCBsYXN0IGZvciBsYXN0c1xuICAgICAgICAgICAgICAgIHl5dmFsLl8kID0ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0obGVufHwxKV0uZmlyc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0xXS5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGgtKGxlbnx8MSldLmZpcnN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoLTFdLmxhc3RfY29sdW1uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwoeXl2YWwsIHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgdGhpcy55eSwgYWN0aW9uWzFdLCB2c3RhY2ssIGxzdGFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHBvcCBvZmYgc3RhY2tcbiAgICAgICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMCwtMSpsZW4qMik7XG4gICAgICAgICAgICAgICAgICAgIHZzdGFjayA9IHZzdGFjay5zbGljZSgwLCAtMSpsZW4pO1xuICAgICAgICAgICAgICAgICAgICBsc3RhY2sgPSBsc3RhY2suc2xpY2UoMCwgLTEqbGVuKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMF0pOyAgICAvLyBwdXNoIG5vbnRlcm1pbmFsIChyZWR1Y2UpXG4gICAgICAgICAgICAgICAgdnN0YWNrLnB1c2goeXl2YWwuJCk7XG4gICAgICAgICAgICAgICAgbHN0YWNrLnB1c2goeXl2YWwuXyQpO1xuICAgICAgICAgICAgICAgIC8vIGdvdG8gbmV3IHN0YXRlID0gdGFibGVbU1RBVEVdW05PTlRFUk1JTkFMXVxuICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gdGFibGVbc3RhY2tbc3RhY2subGVuZ3RoLTJdXVtzdGFja1tzdGFjay5sZW5ndGgtMV1dO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3U3RhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6IC8vIGFjY2VwdFxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn19Oy8qIEppc29uIGdlbmVyYXRlZCBsZXhlciAqL1xudmFyIGxleGVyID0gKGZ1bmN0aW9uKCl7XG5cbnZhciBsZXhlciA9ICh7RU9GOjEsXG5wYXJzZUVycm9yOmZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG4gICAgICAgIGlmICh0aGlzLnl5LnBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMueXkucGFyc2VFcnJvcihzdHIsIGhhc2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG4gICAgICAgIH1cbiAgICB9LFxuc2V0SW5wdXQ6ZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9sZXNzID0gdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICAgIHRoaXMueXlsaW5lbm8gPSB0aGlzLnl5bGVuZyA9IDA7XG4gICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy5tYXRjaGVkID0gdGhpcy5tYXRjaCA9ICcnO1xuICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrID0gWydJTklUSUFMJ107XG4gICAgICAgIHRoaXMueXlsbG9jID0ge2ZpcnN0X2xpbmU6MSxmaXJzdF9jb2x1bW46MCxsYXN0X2xpbmU6MSxsYXN0X2NvbHVtbjowfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbmlucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoID0gdGhpcy5faW5wdXRbMF07XG4gICAgICAgIHRoaXMueXl0ZXh0Kz1jaDtcbiAgICAgICAgdGhpcy55eWxlbmcrKztcbiAgICAgICAgdGhpcy5tYXRjaCs9Y2g7XG4gICAgICAgIHRoaXMubWF0Y2hlZCs9Y2g7XG4gICAgICAgIHZhciBsaW5lcyA9IGNoLm1hdGNoKC9cXG4vKTtcbiAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vKys7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XG4gICAgICAgIHJldHVybiBjaDtcbiAgICB9LFxudW5wdXQ6ZnVuY3Rpb24gKGNoKSB7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gY2ggKyB0aGlzLl9pbnB1dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbm1vcmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9tb3JlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbnBhc3RJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXN0ID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gdGhpcy5tYXRjaC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJzonJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxudXBjb21pbmdJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0ID0gdGhpcy5tYXRjaDtcbiAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwLW5leHQubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQuc3Vic3RyKDAsMjApKyhuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLic6JycpKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgfSxcbnNob3dQb3NpdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuICAgICAgICB2YXIgYyA9IG5ldyBBcnJheShwcmUubGVuZ3RoICsgMSkuam9pbihcIi1cIik7XG4gICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjK1wiXlwiO1xuICAgIH0sXG5uZXh0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgdmFyIHRva2VuLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICBjb2wsXG4gICAgICAgICAgICBsaW5lcztcbiAgICAgICAgaWYgKCF0aGlzLl9tb3JlKSB7XG4gICAgICAgICAgICB0aGlzLnl5dGV4dCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5tYXRjaCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMuX2N1cnJlbnRSdWxlcygpO1xuICAgICAgICBmb3IgKHZhciBpPTA7aSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goL1xcbi4qL2cpO1xuICAgICAgICAgICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZTogdGhpcy55eWxsb2MubGFzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubysxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gbGluZXNbbGluZXMubGVuZ3RoLTFdLmxlbmd0aC0xIDogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGh9XG4gICAgICAgICAgICAgICAgdGhpcy55eXRleHQgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZXMgPSBtYXRjaDtcbiAgICAgICAgICAgICAgICB0aGlzLnl5bGVuZyA9IHRoaXMueXl0ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZShtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHRoaXMsIHRoaXMueXksIHRoaXMsIHJ1bGVzW2ldLHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV0pO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pbnB1dCA9PT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJysodGhpcy55eWxpbmVubysxKSsnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nK3RoaXMuc2hvd1Bvc2l0aW9uKCksXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiBcIlwiLCB0b2tlbjogbnVsbCwgbGluZTogdGhpcy55eWxpbmVub30pO1xuICAgICAgICB9XG4gICAgfSxcbmxleDpmdW5jdGlvbiBsZXgoKSB7XG4gICAgICAgIHZhciByID0gdGhpcy5uZXh0KCk7XG4gICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGV4KCk7XG4gICAgICAgIH1cbiAgICB9LFxuYmVnaW46ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sucHVzaChjb25kaXRpb24pO1xuICAgIH0sXG5wb3BTdGF0ZTpmdW5jdGlvbiBwb3BTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2sucG9wKCk7XG4gICAgfSxcbl9jdXJyZW50UnVsZXM6ZnVuY3Rpb24gX2N1cnJlbnRSdWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1t0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTFdXS5ydWxlcztcbiAgICB9LFxudG9wU3RhdGU6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0yXTtcbiAgICB9LFxucHVzaFN0YXRlOmZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuICAgICAgICB0aGlzLmJlZ2luKGNvbmRpdGlvbik7XG4gICAgfX0pO1xubGV4ZXIucGVyZm9ybUFjdGlvbiA9IGZ1bmN0aW9uIGFub255bW91cyh5eSx5eV8sJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucyxZWV9TVEFSVCkge1xuXG52YXIgWVlTVEFURT1ZWV9TVEFSVDtcbnN3aXRjaCgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5jYXNlIDA6Lyogc2tpcCB3aGl0ZXNwYWNlICovXG5icmVhaztcbmNhc2UgMTpyZXR1cm4gMjBcbmJyZWFrO1xuY2FzZSAyOnJldHVybiAxOVxuYnJlYWs7XG5jYXNlIDM6cmV0dXJuIDhcbmJyZWFrO1xuY2FzZSA0OnJldHVybiA5XG5icmVhaztcbmNhc2UgNTpyZXR1cm4gNlxuYnJlYWs7XG5jYXNlIDY6cmV0dXJuIDdcbmJyZWFrO1xuY2FzZSA3OnJldHVybiAxMVxuYnJlYWs7XG5jYXNlIDg6cmV0dXJuIDEzXG5icmVhaztcbmNhc2UgOTpyZXR1cm4gMTBcbmJyZWFrO1xuY2FzZSAxMDpyZXR1cm4gMTJcbmJyZWFrO1xuY2FzZSAxMTpyZXR1cm4gMTRcbmJyZWFrO1xuY2FzZSAxMjpyZXR1cm4gMTVcbmJyZWFrO1xuY2FzZSAxMzpyZXR1cm4gMTZcbmJyZWFrO1xuY2FzZSAxNDpyZXR1cm4gMTdcbmJyZWFrO1xuY2FzZSAxNTpyZXR1cm4gMThcbmJyZWFrO1xuY2FzZSAxNjpyZXR1cm4gNVxuYnJlYWs7XG5jYXNlIDE3OnJldHVybiAnSU5WQUxJRCdcbmJyZWFrO1xufVxufTtcbmxleGVyLnJ1bGVzID0gWy9eXFxzKy8sL15bMC05XSsoXFwuWzAtOV0rKT9cXGIvLC9eblxcYi8sL15cXHxcXHwvLC9eJiYvLC9eXFw/LywvXjovLC9ePD0vLC9ePj0vLC9ePC8sL14+LywvXiE9LywvXj09LywvXiUvLC9eXFwoLywvXlxcKS8sL14kLywvXi4vXTtcbmxleGVyLmNvbmRpdGlvbnMgPSB7XCJJTklUSUFMXCI6e1wicnVsZXNcIjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxN10sXCJpbmNsdXNpdmVcIjp0cnVlfX07cmV0dXJuIGxleGVyO30pKClcbnBhcnNlci5sZXhlciA9IGxleGVyO1xucmV0dXJuIHBhcnNlcjtcbn0pKCk7XG4vLyBFbmQgcGFyc2VyXG5cbiAgLy8gSGFuZGxlIG5vZGUsIGFtZCwgYW5kIGdsb2JhbCBzeXN0ZW1zXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEplZDtcbiAgICB9XG4gICAgZXhwb3J0cy5KZWQgPSBKZWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgZGVmaW5lKCdqZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEplZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBMZWFrIGEgZ2xvYmFsIHJlZ2FyZGxlc3Mgb2YgbW9kdWxlIHN5c3RlbVxuICAgIHJvb3RbJ0plZCddID0gSmVkO1xuICB9XG5cbn0pKHRoaXMpO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUVhY2gnKSxcbiAgICBjcmVhdGVGb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRm9yRWFjaCcpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGludm9raW5nIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBgaXRlcmF0ZWVgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseVxuICogYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIiBwcm9wZXJ0eVxuICogYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIGBfLmZvckluYCBvciBgXy5mb3JPd25gXG4gKiBtYXkgYmUgdXNlZCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGl0ZXJhdGVlYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXyhbMSwgMl0pLmZvckVhY2goZnVuY3Rpb24obikge1xuICogICBjb25zb2xlLmxvZyhuKTtcbiAqIH0pLnZhbHVlKCk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUgZnJvbSBsZWZ0IHRvIHJpZ2h0IGFuZCByZXR1cm5zIHRoZSBhcnJheVxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKG4sIGtleSkge1xuICogICBjb25zb2xlLmxvZyhuLCBrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUta2V5IHBhaXIgYW5kIHJldHVybnMgdGhlIG9iamVjdCAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG52YXIgZm9yRWFjaCA9IGNyZWF0ZUZvckVhY2goYXJyYXlFYWNoLCBiYXNlRWFjaCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBnZXROYXRpdmUoRGF0ZSwgJ25vdycpO1xuXG4vKipcbiAqIEdldHMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAqICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IGxvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGZ1bmN0aW9uIHRvIGJlIGludm9rZWRcbiAqL1xudmFyIG5vdyA9IG5hdGl2ZU5vdyB8fCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi4vZGF0ZS9ub3cnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgaW52b2NhdGlvbnMuIFByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QgdG8gaW5kaWNhdGUgdGhhdCBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdFxuICogYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpcyBpbnZva2VkXG4gKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzXG4gKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHA6Ly9kcnVwYWxtb3Rpb24uY29tL2FydGljbGUvZGVib3VuY2UtYW5kLXRocm90dGxlLXZpc3VhbC1leHBsYW5hdGlvbilcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZ1xuICogIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF0gVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZVxuICogIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmdcbiAqICBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4XG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIGludm9rZSBgc2VuZE1haWxgIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHNcbiAqIGpRdWVyeSgnI3Bvc3Rib3gnKS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHNcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gKiAgICdtYXhXYWl0JzogMTAwMFxuICogfSkpO1xuICpcbiAqIC8vIGNhbmNlbCBhIGRlYm91bmNlZCBjYWxsXG4gKiB2YXIgdG9kb0NoYW5nZXMgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAxMDAwKTtcbiAqIE9iamVjdC5vYnNlcnZlKG1vZGVscy50b2RvLCB0b2RvQ2hhbmdlcyk7XG4gKlxuICogT2JqZWN0Lm9ic2VydmUobW9kZWxzLCBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gKiAgIGlmIChfLmZpbmQoY2hhbmdlcywgeyAndXNlcic6ICd0b2RvJywgJ3R5cGUnOiAnZGVsZXRlJ30pKSB7XG4gKiAgICAgdG9kb0NoYW5nZXMuY2FuY2VsKCk7XG4gKiAgIH1cbiAqIH0sIFsnZGVsZXRlJ10pO1xuICpcbiAqIC8vIC4uLmF0IHNvbWUgcG9pbnQgYG1vZGVscy50b2RvYCBpcyBjaGFuZ2VkXG4gKiBtb2RlbHMudG9kby5jb21wbGV0ZWQgPSB0cnVlO1xuICpcbiAqIC8vIC4uLmJlZm9yZSAxIHNlY29uZCBoYXMgcGFzc2VkIGBtb2RlbHMudG9kb2AgaXMgZGVsZXRlZFxuICogLy8gd2hpY2ggY2FuY2VscyB0aGUgZGVib3VuY2VkIGB0b2RvQ2hhbmdlc2AgY2FsbFxuICogZGVsZXRlIG1vZGVscy50b2RvO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBhcmdzLFxuICAgICAgbWF4VGltZW91dElkLFxuICAgICAgcmVzdWx0LFxuICAgICAgc3RhbXAsXG4gICAgICB0aGlzQXJnLFxuICAgICAgdGltZW91dElkLFxuICAgICAgdHJhaWxpbmdDYWxsLFxuICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICBtYXhXYWl0ID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHdhaXQgPCAwID8gMCA6ICgrd2FpdCB8fCAwKTtcbiAgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgdHJhaWxpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhXYWl0ID0gJ21heFdhaXQnIGluIG9wdGlvbnMgJiYgbmF0aXZlTWF4KCtvcHRpb25zLm1heFdhaXQgfHwgMCwgd2FpdCk7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGxhc3RDYWxsZWQgPSAwO1xuICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBsZXRlKGlzQ2FsbGVkLCBpZCkge1xuICAgIGlmIChpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9XG4gICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsYXllZCgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3coKSAtIHN0YW1wKTtcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgY29tcGxldGUodHJhaWxpbmdDYWxsLCBtYXhUaW1lb3V0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF4RGVsYXllZCgpIHtcbiAgICBjb21wbGV0ZSh0cmFpbGluZywgdGltZW91dElkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHN0YW1wID0gbm93KCk7XG4gICAgdGhpc0FyZyA9IHRoaXM7XG4gICAgdHJhaWxpbmdDYWxsID0gdHJhaWxpbmcgJiYgKHRpbWVvdXRJZCB8fCAhbGVhZGluZyk7XG5cbiAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgIHZhciBsZWFkaW5nQ2FsbCA9IGxlYWRpbmcgJiYgIXRpbWVvdXRJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgfVxuICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICBpc0NhbGxlZCA9IHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IG1heFdhaXQ7XG5cbiAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBtYXhUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KG1heERlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiB0aW1lb3V0SWQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGltZW91dElkICYmIHdhaXQgIT09IG1heFdhaXQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgfVxuICAgIGlmIChsZWFkaW5nQ2FsbCkge1xuICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlDb3B5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5Q29weTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbkRlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogb2JqZWN0VmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduRGVmYXVsdHM7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbldpdGg7XG4iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuL2Jhc2VDb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9hcnJheUVhY2gnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9iYXNlQXNzaWduJyksXG4gICAgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vYmFzZUZvck93bicpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vaW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9XG5jbG9uZWFibGVUYWdzW2RhdGVUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MzJUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW21hcFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZ1xuICogYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcgdmFsdWVzLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IGB2YWx1ZWAgYmVsb25ncyB0by5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIGNsb25lcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QpIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnO1xuXG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gaW5pdENsb25lT2JqZWN0KGlzRnVuYyA/IHt9IDogdmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbG9uZWFibGVUYWdzW3RhZ11cbiAgICAgICAgPyBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBpc0RlZXApXG4gICAgICAgIDogKG9iamVjdCA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG5cbiAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgIH1cbiAgfVxuICAvLyBBZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMgYW5kIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyBjbG9uZS5cbiAgc3RhY2tBLnB1c2godmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gIChpc0FyciA/IGFycmF5RWFjaCA6IGJhc2VGb3JPd24pKHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2tBLCBzdGFja0IpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCIvKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb3B5KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvckluYCBhbmQgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzXG4gKiBvdmVyIGBvYmplY3RgIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvclxuICogZWFjaCBwcm9wZXJ0eS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5XG4gKiByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckluYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9ySW4ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JJbjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL2FycmF5RWFjaCcpLFxuICAgIGJhc2VNZXJnZURlZXAgPSByZXF1aXJlKCcuL2Jhc2VNZXJnZURlZXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgdmFsdWVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICB2YXIgaXNTcmNBcnIgPSBpc0FycmF5TGlrZShzb3VyY2UpICYmIChpc0FycmF5KHNvdXJjZSkgfHwgaXNUeXBlZEFycmF5KHNvdXJjZSkpLFxuICAgICAgcHJvcHMgPSBpc1NyY0FyciA/IHVuZGVmaW5lZCA6IGtleXMoc291cmNlKTtcblxuICBhcnJheUVhY2gocHJvcHMgfHwgc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzcmNWYWx1ZTtcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc09iamVjdExpa2Uoc3JjVmFsdWUpKSB7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgICByZXN1bHQgPSBjdXN0b21pemVyID8gY3VzdG9taXplcih2YWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChpc0NvbW1vbikge1xuICAgICAgICByZXN1bHQgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICgocmVzdWx0ICE9PSB1bmRlZmluZWQgfHwgKGlzU3JjQXJyICYmICEoa2V5IGluIG9iamVjdCkpKSAmJlxuICAgICAgICAgIChpc0NvbW1vbiB8fCAocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzUGxhaW5PYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIHRvUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL3RvUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoLFxuICAgICAgc3JjVmFsdWUgPSBzb3VyY2Vba2V5XTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gc3JjVmFsdWUpIHtcbiAgICAgIG9iamVjdFtrZXldID0gc3RhY2tCW2xlbmd0aF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIodmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgcmVzdWx0ID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKHNyY1ZhbHVlKSAmJiAoaXNBcnJheShzcmNWYWx1ZSkgfHwgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkpIHtcbiAgICAgIHJlc3VsdCA9IGlzQXJyYXkodmFsdWUpXG4gICAgICAgID8gdmFsdWVcbiAgICAgICAgOiAoaXNBcnJheUxpa2UodmFsdWUpID8gYXJyYXlDb3B5KHZhbHVlKSA6IFtdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICByZXN1bHQgPSBpc0FyZ3VtZW50cyh2YWx1ZSlcbiAgICAgICAgPyB0b1BsYWluT2JqZWN0KHZhbHVlKVxuICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFkZCB0aGUgc291cmNlIHZhbHVlIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgYXNzb2NpYXRlXG4gIC8vIGl0IHdpdGggaXRzIG1lcmdlZCB2YWx1ZS5cbiAgc3RhY2tBLnB1c2goc3JjVmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIG9iamVjdFtrZXldID0gbWVyZ2VGdW5jKHJlc3VsdCwgc3JjVmFsdWUsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB7XG4gICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2VEZWVwO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuIiwiLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBBcnJheUJ1ZmZlciA9IGdsb2JhbC5BcnJheUJ1ZmZlcixcbiAgICBVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBnaXZlbiBhcnJheSBidWZmZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIuYnl0ZUxlbmd0aCksXG4gICAgICB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkocmVzdWx0KTtcblxuICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidWZmZXJDbG9uZTtcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5hc3NpZ25gLCBgXy5kZWZhdWx0c2AsIG9yIGBfLm1lcmdlYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3RQYXJhbShmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAyID8gc291cmNlc1tsZW5ndGggLSAyXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGhpc0FyZyA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBiaW5kQ2FsbGJhY2soY3VzdG9taXplciwgdGhpc0FyZywgNSk7XG4gICAgICBsZW5ndGggLT0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VzdG9taXplciA9IHR5cGVvZiB0aGlzQXJnID09ICdmdW5jdGlvbicgPyB0aGlzQXJnIDogdW5kZWZpbmVkO1xuICAgICAgbGVuZ3RoIC09IChjdXN0b21pemVyID8gMSA6IDApO1xuICAgIH1cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGdldExlbmd0aChjb2xsZWN0aW9uKSA6IDA7XG4gICAgaWYgKCFpc0xlbmd0aChsZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSB0b09iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCJ2YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIGBfLmZvckluYCBvciBgXy5mb3JJblJpZ2h0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaXRlcmFibGUgPSB0b09iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5kZWZhdWx0c2Agb3IgYF8uZGVmYXVsdHNEZWVwYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVmYXVsdHMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRzKGFzc2lnbmVyLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBvYmplY3QgPSBhcmdzWzBdO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgYXJncy5wdXNoKGN1c3RvbWl6ZXIpO1xuICAgIHJldHVybiBhc3NpZ25lci5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWZhdWx0cztcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gZm9yIGBfLmZvckVhY2hgIG9yIGBfLmZvckVhY2hSaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFycmF5RnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGFuIGFycmF5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBlYWNoIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGb3JFYWNoKGFycmF5RnVuYywgZWFjaEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgaXRlcmF0ZWUgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnID09PSB1bmRlZmluZWQgJiYgaXNBcnJheShjb2xsZWN0aW9uKSlcbiAgICAgID8gYXJyYXlGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKVxuICAgICAgOiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBiaW5kQ2FsbGJhY2soaXRlcmF0ZWUsIHRoaXNBcmcsIDMpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGb3JFYWNoO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGVuZ3RoO1xuIiwidmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnLi4vbGFuZy9pc05hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsIi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIGFycmF5IHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGJ1ZmZlckNsb25lID0gcmVxdWlyZSgnLi9idWZmZXJDbG9uZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBidWZmZXJDbG9uZShvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgdmFyIGJ1ZmZlciA9IG9iamVjdC5idWZmZXI7XG4gICAgICByZXR1cm4gbmV3IEN0b3IoaXNEZWVwID8gYnVmZmVyQ2xvbmUoYnVmZmVyKSA6IGJ1ZmZlciwgb2JqZWN0LmJ5dGVPZmZzZXQsIG9iamVjdC5sZW5ndGgpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yKG9iamVjdC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhvYmplY3QpKTtcbiAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSBvYmplY3QubGFzdEluZGV4O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCIvKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICghKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSB7XG4gICAgQ3RvciA9IE9iamVjdDtcbiAgfVxuICByZXR1cm4gbmV3IEN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuLi9vYmplY3QvbWVyZ2UnKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzRGVlcGAgdG8gY3VzdG9taXplIGl0cyBgXy5tZXJnZWAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9iamVjdFZhbHVlIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNvdXJjZVZhbHVlIFRoZSBzb3VyY2Ugb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBtZXJnZURlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogbWVyZ2Uob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBtZXJnZURlZmF1bHRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZURlZmF1bHRzO1xuIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaW1LZXlzO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b09iamVjdDtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlQ2xvbmUnKSxcbiAgICBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB2YWx1ZWAuIElmIGBpc0RlZXBgIGlzIGB0cnVlYCBuZXN0ZWQgb2JqZWN0cyBhcmUgY2xvbmVkLFxuICogb3RoZXJ3aXNlIHRoZXkgYXJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3NcbiAqIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGBcbiAqIGNsb25pbmcgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG9cbiAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHVwIHRvIHRocmVlIGFyZ3VtZW50OyAodmFsdWUgWywgaW5kZXh8a2V5LCBvYmplY3RdKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNpbnRlcm5hbC1zdHJ1Y3R1cmVkLWNsb25pbmctYWxnb3JpdGhtKS5cbiAqIFRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhbmQgb2JqZWN0cyBjcmVhdGVkIGJ5XG4gKiBjb25zdHJ1Y3RvcnMgb3RoZXIgdGhhbiBgT2JqZWN0YCBhcmUgY2xvbmVkIHRvIHBsYWluIGBPYmplY3RgIG9iamVjdHMuIEFuXG4gKiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoIGFzIGZ1bmN0aW9ucywgRE9NIG5vZGVzLFxuICogTWFwcywgU2V0cywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZSh1c2Vycyk7XG4gKiBzaGFsbG93WzBdID09PSB1c2Vyc1swXTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmUodXNlcnMsIHRydWUpO1xuICogZGVlcFswXSA9PT0gdXNlcnNbMF07XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGVsID0gXy5jbG9uZShkb2N1bWVudC5ib2R5LCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZShmYWxzZSk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIGVsID09PSBkb2N1bWVudC5ib2R5XG4gKiAvLyA9PiBmYWxzZVxuICogZWwubm9kZU5hbWVcbiAqIC8vID0+IEJPRFlcbiAqIGVsLmNoaWxkTm9kZXMubGVuZ3RoO1xuICogLy8gPT4gMFxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCB0aGlzQXJnKSB7XG4gIGlmIChpc0RlZXAgJiYgdHlwZW9mIGlzRGVlcCAhPSAnYm9vbGVhbicgJiYgaXNJdGVyYXRlZUNhbGwodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplcikpIHtcbiAgICBpc0RlZXAgPSBmYWxzZTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaXNEZWVwID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzQXJnID0gY3VzdG9taXplcjtcbiAgICBjdXN0b21pemVyID0gaXNEZWVwO1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nXG4gICAgPyBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDMpKVxuICAgIDogYmFzZUNsb25lKHZhbHVlLCBpc0RlZXApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VsZW1lbnQoZG9jdW1lbnQuYm9keSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VsZW1lbnQoJzxib2R5PicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHZhbHVlLm5vZGVUeXBlID09PSAxICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzUGxhaW5PYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudDtcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBlbXB0eS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGVtcHR5IHVubGVzcyBpdCdzIGFuXG4gKiBgYXJndW1lbnRzYCBvYmplY3QsIGFycmF5LCBzdHJpbmcsIG9yIGpRdWVyeS1saWtlIGNvbGxlY3Rpb24gd2l0aCBhIGxlbmd0aFxuICogZ3JlYXRlciB0aGFuIGAwYCBvciBhbiBvYmplY3Qgd2l0aCBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gIWtleXModmFsdWUpLmxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZywgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsInZhciBiYXNlRm9ySW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlRm9ySW4nKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGFzc3VtZXMgb2JqZWN0cyBjcmVhdGVkIGJ5IHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3RvclxuICogaGF2ZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHZhciBDdG9yO1xuXG4gIC8vIEV4aXQgZWFybHkgZm9yIG5vbiBgT2JqZWN0YCBvYmplY3RzLlxuICBpZiAoIShpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IG9iamVjdFRhZyAmJiAhaXNBcmd1bWVudHModmFsdWUpKSB8fFxuICAgICAgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY29uc3RydWN0b3InKSAmJiAoQ3RvciA9IHZhbHVlLmNvbnN0cnVjdG9yLCB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmICEoQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gSUUgPCA5IGl0ZXJhdGVzIGluaGVyaXRlZCBwcm9wZXJ0aWVzIGJlZm9yZSBvd24gcHJvcGVydGllcy4gSWYgdGhlIGZpcnN0XG4gIC8vIGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWRcbiAgLy8gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICB2YXIgcmVzdWx0O1xuICAvLyBJbiBtb3N0IGVudmlyb25tZW50cyBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcyBhcmUgaXRlcmF0ZWQgYmVmb3JlXG4gIC8vIGl0cyBpbmhlcml0ZWQgcHJvcGVydGllcy4gSWYgdGhlIGxhc3QgaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3NcbiAgLy8gb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gIGJhc2VGb3JJbih2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIHJlc3VsdCA9IGtleTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCByZXN1bHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCJ2YXIgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9XG50eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9IHR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlQ29weSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VDb3B5JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZVxuICogcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNvcHkodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYXNzaWduV2l0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Fzc2lnbldpdGgnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUFzc2lnbicpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlQXNzaWduZXInKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICogSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzOlxuICogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyksXG4gICAgYXNzaWduRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25EZWZhdWx0cycpLFxuICAgIGNyZWF0ZURlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMnKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdCBmb3IgYWxsIGRlc3RpbmF0aW9uIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgLiBPbmNlIGFcbiAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGRlZmF1bHRzID0gY3JlYXRlRGVmYXVsdHMoYXNzaWduLCBhc3NpZ25EZWZhdWx0cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCJ2YXIgY3JlYXRlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cycpLFxuICAgIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpLFxuICAgIG1lcmdlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9tZXJnZURlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5kZWZhdWx0c2AgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgYXNzaWduc1xuICogZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHNEZWVwKHsgJ3VzZXInOiB7ICduYW1lJzogJ2Jhcm5leScgfSB9LCB7ICd1c2VyJzogeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDM2IH0gfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSB9XG4gKlxuICovXG52YXIgZGVmYXVsdHNEZWVwID0gY3JlYXRlRGVmYXVsdHMobWVyZ2UsIG1lcmdlRGVmYXVsdHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzRGVlcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICBsZW5ndGggPSAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAqIGRvbid0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgaW50byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAqIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLiBJZiBgY3VzdG9taXplcmAgaXNcbiAqIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvbiBhbmRcbiAqIHNvdXJjZSBwcm9wZXJ0aWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCBtZXJnaW5nIGlzIGhhbmRsZWRcbiAqIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAqIHdpdGggZml2ZSBhcmd1bWVudHM6IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSB7XG4gKiAgICdkYXRhJzogW3sgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICd1c2VyJzogJ2ZyZWQnIH1dXG4gKiB9O1xuICpcbiAqIHZhciBhZ2VzID0ge1xuICogICAnZGF0YSc6IFt7ICdhZ2UnOiAzNiB9LCB7ICdhZ2UnOiA0MCB9XVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKHVzZXJzLCBhZ2VzKTtcbiAqIC8vID0+IHsgJ2RhdGEnOiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dIH1cbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gKiAgICd2ZWdldGFibGVzJzogWydiZWV0J11cbiAqIH07XG4gKlxuICogdmFyIG90aGVyID0ge1xuICogICAnZnJ1aXRzJzogWydiYW5hbmEnXSxcbiAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2NhcnJvdCddXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlciwgZnVuY3Rpb24oYSwgYikge1xuICogICBpZiAoXy5pc0FycmF5KGEpKSB7XG4gKiAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICogICB9XG4gKiB9KTtcbiAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdCddIH1cbiAqL1xudmFyIG1lcmdlID0gY3JlYXRlQXNzaWduZXIoYmFzZU1lcmdlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncyAqL1xuXG52YXIgc3RyaXBTcGFjZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanNcIiApO1xuXG4vKipcbiAqIFN0cmlwIEhUTUwtdGFncyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFtePl0rKT4pL2lnLCBcIiBcIiApO1xuXHR0ZXh0ID0gc3RyaXBTcGFjZXMoIHRleHQgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcyAqL1xuXG4vKipcbiAqIFN0cmlwIGRvdWJsZSBzcGFjZXMgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgc3BhY2VzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGRvdWJsZSBzcGFjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblxuXHQvLyBSZXBsYWNlIG11bHRpcGxlIHNwYWNlcyB3aXRoIHNpbmdsZSBzcGFjZVxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxzezIsfS9nLCBcIiBcIiApO1xuXG5cdC8vIFJlcGxhY2Ugc3BhY2VzIGZvbGxvd2VkIGJ5IHBlcmlvZHMgd2l0aCBvbmx5IHRoZSBwZXJpb2QuXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXHNcXC4vZywgXCIuXCIgKTtcblxuXHQvLyBSZW1vdmUgZmlyc3QvbGFzdCBjaGFyYWN0ZXIgaWYgc3BhY2Vcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL15cXHMrfFxccyskL2csIFwiXCIgKTtcblxuXHRyZXR1cm4gdGV4dDtcbn07XG4iXX0=
