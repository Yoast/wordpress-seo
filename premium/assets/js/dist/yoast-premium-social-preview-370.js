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
    __p += '\n	<input type="text"\n		';
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
    __p += '\n	<textarea\n		   ';
     if ( placeholder ) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		   ';
     if ( className ) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		   ';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		   ';
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlci5qcyIsIi4uL2pzL3NyYy9hbmFseXNpcy9nZXRMMTBuT2JqZWN0LmpzIiwiLi4vanMvc3JjL2FuYWx5c2lzL2dldFRpdGxlUGxhY2Vob2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVW5kZWZpbmVkLmpzIiwiYXNzZXRzL2pzL3NyYy9oZWxwUGFuZWwuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LXByZW1pdW0tc29jaWFsLXByZXZpZXcuanMiLCJub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fSGFzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZE1hcEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYWRkU2V0RW50cnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFBhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZURhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVJlZ0V4cC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNTdHJpY3RDb21wYXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tZW1vaXplQ2FwcGVkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUFkZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2Nsb25lLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL21hdGNoU3RyaW5nV2l0aFJlZ2V4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2luZGV4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9lbGVtZW50L2lucHV0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2ZhY2Vib29rUHJldmlldy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2FkZENsYXNzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyVG9DbGFzcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2ltYWdlRGlzcGxheU1vZGUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9taW5pbWl6ZUh0bWwuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW1vdmVDbGFzcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL3JlbmRlckRlc2NyaXB0aW9uLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy9pbnB1dEZpZWxkLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0SW5wdXQuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL3RleHRhcmVhLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3ByZXZpZXcvZXZlbnRzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3RlbXBsYXRlcy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy90d2l0dGVyUHJldmlldy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbGxlY3Rpb24vZm9yRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2RhdGUvbm93LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnVuY3Rpb24vZGVib3VuY2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9mdW5jdGlvbi9yZXN0UGFyYW0uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUNvcHkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUVhY2guanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hc3NpZ25EZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbldpdGguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQXNzaWduLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNsb25lLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VGb3IuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9ySW4uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9yT3duLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlRGVlcC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VQcm9wZXJ0eS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2JpbmRDYWxsYmFjay5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2J1ZmZlckNsb25lLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQXNzaWduZXIuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVCYXNlRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VGb3IuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUZvckVhY2guanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXROYXRpdmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pbml0Q2xvbmVBcnJheS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUJ5VGFnLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaW5pdENsb25lT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNBcnJheUxpa2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0luZGV4LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0xlbmd0aC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL21lcmdlRGVmYXVsdHMuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9zaGltS2V5cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3RvT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9jbG9uZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNBcmd1bWVudHMuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzRWxlbWVudC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNFbXB0eS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNGdW5jdGlvbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNOYXRpdmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1BsYWluT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1N0cmluZy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNUeXBlZEFycmF5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy90b1BsYWluT2JqZWN0LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2Fzc2lnbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXAuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9rZXlzSW4uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3QvbWVyZ2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC91dGlsaXR5L2lkZW50aXR5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZ0JBQWdCLFFBQVMsaUJBQVQsQ0FBcEI7O0FBRUE7Ozs7O0FBS0EsU0FBUyx5QkFBVCxHQUFxQztBQUNwQyxLQUFJLHlCQUF5QixFQUE3QjtBQUNBLEtBQUksYUFBYSxlQUFqQjs7QUFFQSxLQUFLLFVBQUwsRUFBa0I7QUFDakIsMkJBQXlCLFdBQVcsaUJBQXBDO0FBQ0E7O0FBRUQsUUFBTyxzQkFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQix5QkFBakI7Ozs7O0FDbEJBLElBQUksY0FBYyxRQUFTLG9CQUFULENBQWxCOztBQUVBOzs7OztBQUtBLFNBQVMsYUFBVCxHQUF5QjtBQUN4QixLQUFJLGFBQWEsSUFBakI7O0FBRUEsS0FBSyxDQUFFLFlBQWEsT0FBTyxvQkFBcEIsQ0FBUCxFQUFvRDtBQUNuRCxlQUFhLE9BQU8sb0JBQXBCO0FBQ0EsRUFGRCxNQUVPLElBQUssQ0FBRSxZQUFhLE9BQU8sb0JBQXBCLENBQVAsRUFBb0Q7QUFDMUQsZUFBYSxPQUFPLG9CQUFwQjtBQUNBOztBQUVELFFBQU8sVUFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7Ozs7QUNuQkEsSUFBSSxnQkFBZ0IsUUFBUyxpQkFBVCxDQUFwQjs7QUFFQTs7Ozs7QUFLQSxTQUFTLG1CQUFULEdBQStCO0FBQzlCLEtBQUksbUJBQW1CLEVBQXZCO0FBQ0EsS0FBSSxhQUFhLGVBQWpCOztBQUVBLEtBQUssVUFBTCxFQUFrQjtBQUNqQixxQkFBbUIsV0FBVyxjQUE5QjtBQUNBOztBQUVELEtBQUsscUJBQXFCLEVBQTFCLEVBQStCO0FBQzlCLHFCQUFtQiwwQkFBbkI7QUFDQTs7QUFFRCxRQUFPLGdCQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLG1CQUFqQjs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0QkE7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBUyxVQUFULENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXNDO0FBQ3JDLFNBQU8sZ0dBQ04saUJBRE0sR0FDYyxRQURkLEdBQ3lCLHFDQUR6QixHQUNpRSxJQURqRSxHQUN3RSxrQkFEL0U7QUFFQTs7QUFFRDs7Ozs7Ozs7QUFRQSxTQUFTLFFBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsRUFBekIsRUFBOEI7QUFDN0IsU0FBTyxZQUFZLEVBQVosR0FBaUIsNkJBQWpCLEdBQWlELElBQWpELEdBQXdELE1BQS9EO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLGNBQVksVUFESTtBQUVoQixZQUFVO0FBRk0sQ0FBakI7Ozs7O0FDM0JBO0FBQ0E7O0FBRUEsSUFBSSxZQUFZLFFBQVMsMENBQVQsQ0FBaEI7QUFDQSxJQUFJLFlBQVksUUFBUyxhQUFULENBQWhCO0FBQ0EsSUFBSSxzQkFBc0IsUUFBUyxpREFBVCxDQUExQjtBQUNBLElBQUksNEJBQTRCLFFBQVMsdURBQVQsQ0FBaEM7O0FBRUEsSUFBSSxRQUFRLFFBQVMsY0FBVCxDQUFaO0FBQ0EsSUFBSSxVQUFVLFFBQVMsZ0JBQVQsQ0FBZDtBQUNBLElBQUksT0FBTyxRQUFTLFlBQVQsQ0FBWDtBQUNBLElBQUksY0FBYyxRQUFTLG9CQUFULENBQWxCOztBQUVBLElBQUksTUFBTSxRQUFTLEtBQVQsQ0FBVjtBQUNBLElBQUksaUJBQWlCLFFBQVMsdUJBQVQsQ0FBckI7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7OztBQUlBLEtBQUksZ0JBQWdCO0FBQ25CLFdBQVMsRUFEVTtBQUVuQixZQUFVO0FBRlMsRUFBcEI7O0FBS0EsS0FBSSx1QkFBdUIsSUFBM0I7O0FBRUEsS0FBSSxrQkFBa0IsZUFBZSxlQUFyQztBQUNBLEtBQUksaUJBQWlCLGVBQWUsY0FBcEM7O0FBRUEsS0FBSSxlQUFKLEVBQXFCLGNBQXJCOztBQUVBLEtBQUksZUFBZSxtQkFBbUIsSUFBdEM7O0FBRUEsS0FBSSxPQUFPLElBQUksR0FBSixDQUFTLHVCQUF3QixhQUFhLE9BQXJDLENBQVQsQ0FBWDtBQUNBLEtBQUksZUFBZSxFQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxVQUFTLHNCQUFULENBQWlDLFFBQWpDLEVBQTJDLFdBQTNDLEVBQXdELFlBQXhELEVBQXNFLGFBQXRFLEVBQXFGLG1CQUFyRixFQUEyRztBQUMxRyxNQUFJLHdCQUF3QixHQUFHLEtBQUgsQ0FBUyxNQUFULENBQWdCLFVBQWhCLEdBQTZCLEdBQUcsS0FBSCxDQUFVO0FBQ2xFLFVBQU8sbUJBQW1CLFlBRHdDO0FBRWxFLFdBQVEsRUFBRSxNQUFNLG1CQUFtQixZQUEzQixFQUYwRDtBQUdsRSxhQUFVO0FBSHdELEdBQVYsQ0FBekQ7O0FBTUEsd0JBQXNCLEVBQXRCLENBQTBCLFFBQTFCLEVBQW9DLFlBQVc7QUFDOUMsT0FBSSxhQUFhLHNCQUFzQixLQUF0QixHQUE4QixHQUE5QixDQUFtQyxXQUFuQyxFQUFpRCxLQUFqRCxHQUF5RCxNQUF6RCxFQUFqQjs7QUFFQTtBQUNBLFlBQVMsR0FBVCxDQUFjLFdBQVcsR0FBekI7O0FBRUE7O0FBRUEsS0FBRyxZQUFILEVBQWtCLElBQWxCO0FBQ0EsR0FURDs7QUFXQSxJQUFHLFlBQUgsRUFBa0IsS0FBbEIsQ0FBeUIsVUFBVSxHQUFWLEVBQWdCO0FBQ3hDLE9BQUksY0FBSjs7QUFFQTtBQUNBLFlBQVMsR0FBVCxDQUFjLEVBQWQ7O0FBRUE7O0FBRUEsS0FBRyxZQUFILEVBQWtCLElBQWxCO0FBQ0EsR0FURDs7QUFXQSxJQUFHLFdBQUgsRUFBaUIsS0FBakIsQ0FBd0IsVUFBVSxHQUFWLEVBQWdCO0FBQ3ZDLE9BQUksY0FBSjtBQUNBLHlCQUFzQixJQUF0QjtBQUNBLEdBSEQ7O0FBS0EsSUFBRyxtQkFBSCxFQUF5QixFQUF6QixDQUE2QixPQUE3QixFQUFzQyxVQUFVLFdBQVYsRUFBd0I7QUFDN0QseUJBQXNCLElBQXRCO0FBQ0EsR0FGRDtBQUdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxlQUFULENBQTBCLE9BQTFCLEVBQW9DO0FBQ25DLE1BQUssT0FBTyxHQUFHLEtBQVYsS0FBb0IsV0FBekIsRUFBdUM7QUFDdEM7QUFDQTs7QUFFRCxNQUFJLFdBQVcsRUFBRyxRQUFRLE9BQVIsQ0FBZ0IsYUFBbkIsRUFBbUMsSUFBbkMsQ0FBeUMsNkJBQXpDLENBQWY7O0FBRUEsTUFBSSxZQUFZLEVBQUcsYUFBSCxDQUFoQjtBQUNBLFlBQVUsV0FBVixDQUF1QixRQUF2Qjs7QUFFQSxNQUFJLG1CQUFtQixvQkFBcUIsT0FBckIsQ0FBdkI7O0FBRUEsTUFBSSxlQUFrQixPQUFRLFFBQVIsRUFBbUIsSUFBbkIsQ0FBeUIsSUFBekIsQ0FBdEI7QUFDQSxNQUFJLGdCQUFrQixlQUFlLFNBQXJDO0FBQ0EsTUFBSSxrQkFBa0IsaUJBQWlCLGFBQWpCLEdBQWlDLElBQWpDLEdBQ3JCLGdGQURxQixHQUM4RCxnQkFEOUQsR0FDaUYsV0FEdkc7O0FBR0EsTUFBSSxpQkFBbUIsZUFBZSxnQkFBdEM7QUFDQSxNQUFJLG1CQUFtQixpQkFBaUIsY0FBakIsR0FBa0Msa0JBQWxDLEdBQ3RCLG1EQURzQixHQUNnQyxtQkFBbUIsaUJBRG5ELEdBQ3VFLFdBRDlGOztBQUdBLElBQUcsU0FBSCxFQUFlLE1BQWYsQ0FBdUIsZUFBdkI7QUFDQSxJQUFHLFNBQUgsRUFBZSxNQUFmLENBQXVCLGdCQUF2Qjs7QUFFQSxXQUFTLElBQVQ7QUFDQSxNQUFLLFNBQVMsR0FBVCxPQUFtQixFQUF4QixFQUE2QjtBQUM1QixLQUFHLE1BQU0sY0FBVCxFQUEwQixJQUExQjtBQUNBOztBQUVELHlCQUNDLFFBREQsRUFFQyxNQUFNLGFBRlAsRUFHQyxNQUFNLGNBSFAsRUFJQyxRQUFRLGFBQVIsQ0FBc0IsSUFBdEIsQ0FBNEIsT0FBNUIsQ0FKRCxFQUtDLEVBQUcsUUFBUSxPQUFSLENBQWdCLFNBQW5CLEVBQStCLElBQS9CLENBQXFDLDBCQUFyQyxDQUxEO0FBT0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxjQUFULEdBQTBCO0FBQ3pCO0FBQ0EsTUFBSyxFQUFHLFVBQUgsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBOUIsRUFBa0M7QUFDakMsVUFBTyxNQUFQO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLLEVBQUcsb0JBQUgsRUFBMEIsTUFBMUIsR0FBbUMsQ0FBeEMsRUFBNEM7QUFDM0MsVUFBTyxNQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsV0FBVCxHQUF1QjtBQUN0QixVQUFRLGdCQUFSO0FBQ0MsUUFBSyxNQUFMO0FBQ0MsV0FBTyxhQUFQO0FBQ0QsUUFBSyxNQUFMO0FBQ0MsV0FBTyxPQUFQO0FBQ0Q7QUFDQyxXQUFPLEVBQVA7QUFORjtBQVFBOztBQUVEOzs7OztBQUtBLFVBQVMsZUFBVCxHQUEyQjtBQUMxQixVQUFTLGdCQUFUO0FBQ0MsUUFBSyxNQUFMO0FBQ0MsV0FBTyxTQUFQO0FBQ0QsUUFBSyxNQUFMO0FBQ0MsV0FBTyxhQUFQO0FBQ0Q7QUFDQyxXQUFPLEVBQVA7QUFORjtBQVFBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyw0QkFBVCxDQUF1QyxtQkFBdkMsRUFBNEQsV0FBNUQsRUFBMEU7QUFDekUsc0JBQW9CLE1BQXBCLENBQTRCLGNBQWMsV0FBZCxHQUE0QixVQUF4RDtBQUNBLHNCQUFvQixJQUFwQixDQUEwQixhQUExQixFQUEwQyxJQUExQztBQUNBOztBQUVEOzs7O0FBSUEsVUFBUyxrQkFBVCxHQUE4QjtBQUM3QixTQUFPLEVBQUcsdUJBQUgsRUFBNkIsR0FBN0IsRUFBUDtBQUNBOztBQUVEOzs7OztBQUtBLFVBQVMsK0JBQVQsR0FBMkM7QUFDMUMsTUFBSSxjQUFjLG9CQUFsQjs7QUFFQSxNQUFLLE9BQU8sV0FBWixFQUEwQjtBQUN6QixpQkFBYywyQkFBZDtBQUNBOztBQUVELFNBQU8sV0FBUDtBQUNBOztBQUVEOzs7Ozs7Ozs7Ozs7O0FBYUEsVUFBUyxvQkFBVCxDQUErQixhQUEvQixFQUE4QyxXQUE5QyxFQUE0RDtBQUMzRCxNQUFJLG1CQUFtQixxQkFBdkI7QUFDQSxNQUFJLHlCQUF5QixpQ0FBN0I7O0FBRUEsTUFBSSxPQUFPO0FBQ1Ysa0JBQWUsRUFBRyxhQUFILEVBQW1CLEdBQW5CLENBQXdCLENBQXhCLENBREw7QUFFVixTQUFNO0FBQ0wsV0FBTyxFQUFHLE1BQU0sV0FBTixHQUFvQixRQUF2QixFQUFrQyxHQUFsQyxFQURGO0FBRUwsaUJBQWEsRUFBRyxNQUFNLFdBQU4sR0FBb0IsY0FBdkIsRUFBd0MsR0FBeEMsRUFGUjtBQUdMLGNBQVUsRUFBRyxNQUFNLFdBQU4sR0FBb0IsUUFBdkIsRUFBa0MsR0FBbEM7QUFITCxJQUZJO0FBT1YsWUFBUyxtQkFBbUIsT0FQbEI7QUFRVixjQUFXO0FBQ1YseUJBQXFCLDZCQUFVLElBQVYsRUFBaUI7QUFDckMsT0FBRyxNQUFNLFdBQU4sR0FBb0IsUUFBdkIsRUFBa0MsR0FBbEMsQ0FBdUMsS0FBSyxLQUE1QztBQUNBLE9BQUcsTUFBTSxXQUFOLEdBQW9CLGNBQXZCLEVBQXdDLEdBQXhDLENBQTZDLEtBQUssV0FBbEQ7QUFDQSxPQUFHLE1BQU0sV0FBTixHQUFvQixRQUF2QixFQUFrQyxHQUFsQyxDQUF1QyxLQUFLLFFBQTVDOztBQUVBO0FBQ0EsT0FBRyxtQkFBSCxFQUF5QixPQUF6QixDQUFrQyxhQUFsQzs7QUFFQSxTQUFLLEtBQUssUUFBTCxLQUFrQixFQUF2QixFQUE0QjtBQUMzQixVQUFJLGVBQWUsY0FBYyxJQUFkLENBQW9CLElBQXBCLEVBQTJCLE9BQTNCLENBQW9DLFNBQXBDLEVBQStDLEVBQS9DLENBQW5CO0FBQ0EsMkJBQXNCLFlBQXRCLEVBQW9DLG1CQUFtQixhQUF2RDtBQUNBOztBQUVELFlBQVEsYUFBUixFQUF3QixJQUF4QixDQUE4QixtQkFBOUIsRUFBb0QsT0FBcEQsQ0FBNkQsYUFBN0Q7QUFDQSxZQUFRLGFBQVIsRUFBd0IsSUFBeEIsQ0FBOEIsbUJBQTlCLEVBQW9ELE9BQXBELENBQTZELG1CQUE3RDtBQUNBLEtBaEJTO0FBaUJWLG9CQUFnQix3QkFBVSxRQUFWLEVBQXFCO0FBQ3BDLFNBQUssYUFBYSxFQUFsQixFQUF1QjtBQUN0QixpQkFBVyxpQkFBa0IsRUFBbEIsQ0FBWDtBQUNBOztBQUVELFlBQU8sUUFBUDtBQUNBLEtBdkJTO0FBd0JWLGlCQUFhLHFCQUFVLEtBQVYsRUFBa0I7QUFDOUIsU0FBSyxZQUFZLE9BQVosQ0FBcUIsU0FBckIsSUFBbUMsQ0FBQyxDQUF6QyxFQUE2QztBQUM1QyxVQUFLLFVBQVUsRUFBRyx1QkFBSCxFQUE2QixJQUE3QixDQUFtQyxhQUFuQyxDQUFmLEVBQW9FO0FBQ25FLFdBQUksZ0JBQWdCLEVBQUcsd0JBQUgsRUFBOEIsR0FBOUIsRUFBcEI7QUFDQSxXQUFLLGtCQUFrQixFQUF2QixFQUE0QjtBQUMzQixnQkFBUSxhQUFSO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsWUFBTyxTQUFTLEVBQVQsQ0FBWSxpQkFBWixDQUE4QixnQkFBOUIsQ0FBZ0QsS0FBaEQsQ0FBUDtBQUNBLEtBbENTO0FBbUNWLHVCQUFtQiwyQkFBVSxXQUFWLEVBQXdCO0FBQzFDLFNBQUssWUFBWSxPQUFaLENBQXFCLFNBQXJCLElBQW1DLENBQUMsQ0FBekMsRUFBNkM7QUFDNUMsVUFBSyxnQkFBZ0IsRUFBRyw2QkFBSCxFQUFtQyxJQUFuQyxDQUF5QyxhQUF6QyxDQUFyQixFQUFnRjtBQUMvRSxXQUFJLHNCQUFzQixFQUFHLDhCQUFILEVBQW9DLEdBQXBDLEVBQTFCO0FBQ0EsV0FBSyx3QkFBd0IsRUFBN0IsRUFBa0M7QUFDakMsc0JBQWMsbUJBQWQ7QUFDQTtBQUNEO0FBQ0QsVUFBSyxZQUFhLFdBQWIsQ0FBTCxFQUFpQztBQUNoQyxxQkFBYyxFQUFHLDZCQUFILEVBQW1DLElBQW5DLENBQXlDLGFBQXpDLENBQWQ7QUFDQTtBQUNEOztBQUVELFlBQU8sU0FBUyxFQUFULENBQVksaUJBQVosQ0FBOEIsZ0JBQTlCLENBQWdELFdBQWhELENBQVA7QUFDQTtBQWpEUyxJQVJEO0FBMkRWLGdCQUFhO0FBQ1osV0FBTztBQURLLElBM0RIO0FBOERWLGlCQUFjO0FBQ2IsV0FBTztBQURNO0FBOURKLEdBQVg7O0FBbUVBLE1BQUssT0FBTyxzQkFBWixFQUFxQztBQUNwQyxRQUFLLFdBQUwsQ0FBaUIsV0FBakIsR0FBK0Isc0JBQS9CO0FBQ0EsUUFBSyxZQUFMLENBQWtCLFdBQWxCLEdBQWdDLHNCQUFoQztBQUNBOztBQUVELFNBQU8sSUFBUDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGlCQUFULENBQTRCLGVBQTVCLEVBQThDO0FBQzdDLElBQUUsR0FBRixDQUNDLE9BREQsRUFFQztBQUNDLFdBQVEseUJBRFQ7QUFFQyxnQkFBYSxtQkFBbUIsYUFGakM7QUFHQyxZQUFTLEVBQUcsdUJBQUgsRUFBNkIsR0FBN0I7QUFIVixHQUZELEVBT0MsVUFBVSxNQUFWLEVBQW1CO0FBQ2xCLE9BQUssV0FBVyxDQUFoQixFQUFvQjtBQUNuQixvQkFBZ0IsU0FBaEIsQ0FBMkIsTUFBM0I7QUFDQTtBQUNELEdBWEY7QUFhQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxZQUFULENBQXVCLGNBQXZCLEVBQXdDO0FBQ3ZDLCtCQUE4QixjQUE5QixFQUE4QyxpQkFBOUM7O0FBRUEsTUFBSSwyQkFBMkIsRUFBRyxrQkFBSCxDQUEvQjtBQUNBLG9CQUFrQixJQUFJLGVBQUosQ0FDakIscUJBQXNCLHdCQUF0QixFQUFnRCxnQkFBZ0IsWUFBaEUsQ0FEaUIsRUFFakIsSUFGaUIsQ0FBbEI7O0FBS0EsMkJBQXlCLEVBQXpCLENBQ0MsYUFERCxFQUVDLG1CQUZELEVBR0MsWUFBVztBQUNWLHdCQUFzQixVQUF0QixFQUFrQyxvQkFBcUIsZUFBckIsQ0FBbEM7QUFDQSxvQkFBa0IsZUFBbEI7QUFDQSxHQU5GOztBQVNBLGtCQUFnQixJQUFoQjs7QUFFQSxrQkFBaUIsZUFBakI7O0FBRUEsTUFBSSxxQkFBcUIsRUFBRyx1QkFBSCxDQUF6QjtBQUNBLE1BQUksbUJBQW1CLE1BQW5CLEdBQTRCLENBQWhDLEVBQW9DO0FBQ25DLHNCQUFtQixFQUFuQixDQUF1QixRQUF2QixFQUFpQyxrQkFBa0IsSUFBbEIsQ0FBd0IsSUFBeEIsRUFBOEIsZUFBOUIsQ0FBakM7QUFDQSxzQkFBbUIsT0FBbkIsQ0FBNEIsUUFBNUI7QUFDQTtBQUNEOztBQUVEOzs7Ozs7QUFNQSxVQUFTLFdBQVQsQ0FBc0IsYUFBdEIsRUFBc0M7QUFDckMsK0JBQThCLGFBQTlCLEVBQTZDLGdCQUE3Qzs7QUFFQSxNQUFJLDBCQUEwQixFQUFHLGlCQUFILENBQTlCO0FBQ0EsbUJBQWlCLElBQUksY0FBSixDQUNoQixxQkFBc0IsdUJBQXRCLEVBQStDLGdCQUFnQixVQUEvRCxDQURnQixFQUVoQixJQUZnQixDQUFqQjs7QUFLQSwwQkFBd0IsRUFBeEIsQ0FDQyxhQURELEVBRUMsbUJBRkQsRUFHQyxZQUFXO0FBQ1Ysd0JBQXNCLFNBQXRCLEVBQWlDLG9CQUFxQixjQUFyQixDQUFqQztBQUNBLG9CQUFrQixjQUFsQjtBQUNBLEdBTkY7O0FBU0EsTUFBSSwyQkFBMkIsRUFBRyxrQkFBSCxDQUEvQjtBQUNBLDJCQUF5QixFQUF6QixDQUNDLGFBREQsRUFFQyxtQkFGRCxFQUdDLHFCQUFxQixJQUFyQixDQUEyQixJQUEzQixFQUFpQyxjQUFqQyxDQUhEOztBQU1BLDJCQUF5QixFQUF6QixDQUNDLG1CQURELEVBRUMsbUJBRkQsRUFHQywyQkFBMkIsSUFBM0IsQ0FBaUMsSUFBakMsRUFBdUMsY0FBdkMsQ0FIRDs7QUFNQSxpQkFBZSxJQUFmOztBQUVBLGtCQUFpQixjQUFqQjtBQUNBLHVCQUFzQixjQUF0QjtBQUNBLDZCQUE0QixjQUE1QjtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLG9CQUFULENBQStCLGNBQS9CLEVBQWdEO0FBQy9DLE1BQUksZ0JBQWdCLEVBQUcsdUJBQUgsQ0FBcEI7QUFDQSxNQUFJLGVBQWUsY0FBYyxHQUFkLEVBQW5CO0FBQ0EsTUFBSSxpQkFBaUIsRUFBckIsRUFBMEI7QUFDekI7QUFDQTs7QUFFRCxNQUFJLGdCQUFnQixFQUFHLHdCQUFILEVBQThCLEdBQTlCLEVBQXBCO0FBQ0EsTUFBSyxrQkFBa0IsRUFBdkIsRUFBNEI7QUFDM0Isa0JBQWUsUUFBZixDQUF5QixhQUF6QjtBQUNBLEdBRkQsTUFFTztBQUNOLGtCQUFlLFFBQWYsQ0FBeUIsY0FBYyxJQUFkLENBQW9CLGFBQXBCLENBQXpCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBUywwQkFBVCxDQUFxQyxjQUFyQyxFQUFzRDtBQUNyRCxNQUFJLHNCQUFzQixFQUFHLDZCQUFILENBQTFCO0FBQ0EsTUFBSSxxQkFBcUIsb0JBQW9CLEdBQXBCLEVBQXpCO0FBQ0EsTUFBSSx1QkFBdUIsRUFBM0IsRUFBZ0M7QUFDL0I7QUFDQTs7QUFFRCxNQUFJLHNCQUFzQixFQUFHLDhCQUFILEVBQW9DLEdBQXBDLEVBQTFCO0FBQ0EsTUFBSyx3QkFBd0IsRUFBN0IsRUFBa0M7QUFDakMsa0JBQWUsY0FBZixDQUErQixtQkFBL0I7QUFDQSxHQUZELE1BRU87QUFDTixrQkFBZSxjQUFmLENBQStCLG9CQUFvQixJQUFwQixDQUEwQixhQUExQixDQUEvQjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsZ0JBQVQsQ0FBMkIsT0FBM0IsRUFBcUM7QUFDcEMsTUFBSyxRQUFRLElBQVIsQ0FBYSxRQUFiLEtBQTBCLEVBQS9CLEVBQW9DO0FBQ25DLFdBQVEsUUFBUixDQUFrQixpQkFBa0IsRUFBbEIsQ0FBbEI7QUFDQTtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxvQkFBVCxDQUErQixZQUEvQixFQUE2QyxJQUE3QyxFQUFvRDtBQUNuRCxJQUFHLE1BQU8sWUFBUCxHQUFzQix5QkFBekIsRUFBcUQsSUFBckQsQ0FBMkQsSUFBM0Q7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGVBQVQsR0FBMkI7QUFDMUIsTUFBSyxxQkFBcUIsTUFBMUIsRUFBbUM7QUFDbEM7QUFDQTs7QUFFRDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLG1CQUFULENBQThCLE9BQTlCLEVBQXdDO0FBQ3ZDLFNBQU8sUUFBUSxJQUFSLENBQWEsUUFBYixLQUEwQixFQUExQixHQUErQixtQkFBbUIsV0FBbEQsR0FBZ0UsbUJBQW1CLGFBQTFGO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyx1QkFBVCxHQUFtQztBQUNsQyxNQUFLLFlBQWEsR0FBRyxLQUFoQixLQUEyQixZQUFhLEdBQUcsS0FBSCxDQUFTLGFBQXRCLENBQWhDLEVBQXdFO0FBQ3ZFO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLGdCQUFnQixHQUFHLEtBQUgsQ0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQXBCOztBQUVBLGdCQUFjLEVBQWQsQ0FBa0IsUUFBbEIsRUFBNEIsWUFBVztBQUN0QyxPQUFJLGVBQWUsY0FBYyxLQUFkLEdBQXNCLEdBQXRCLENBQTJCLFdBQTNCLEVBQXlDLEtBQXpDLEdBQWlELFVBQXBFOztBQUVBLDBCQUF1QixJQUF2Qjs7QUFFQSxvQkFBa0IsYUFBYSxHQUEvQjtBQUNBLEdBTkQ7O0FBUUEsSUFBRyxlQUFILEVBQXFCLEVBQXJCLENBQXlCLE9BQXpCLEVBQWtDLHdCQUFsQyxFQUE0RCxZQUFXO0FBQ3RFLDBCQUF1QixLQUF2Qjs7QUFFQTtBQUNBLEdBSkQ7QUFLQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGlCQUFULEdBQTZCO0FBQzVCO0FBQ0EsTUFBSSxpQkFBaUIsRUFBRyxNQUFNLGlCQUFULENBQXJCO0FBQ0EsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsa0JBQWUsRUFBZixDQUFtQixPQUFuQixFQUE0QixtQkFBNUI7QUFDQTs7QUFFRDtBQUNBLE1BQUssT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sUUFBUSxFQUFmLEtBQXNCLFVBQTdELEVBQTBFO0FBQ3pFLE9BQUksU0FBUyxDQUFFLE9BQUYsRUFBVyxRQUFYLEVBQXFCLEtBQXJCLEVBQTRCLE9BQTVCLENBQWI7QUFDQSxXQUFRLEVBQVIsQ0FBWSxXQUFaLEVBQXlCLFVBQVUsQ0FBVixFQUFjO0FBQ3RDLFNBQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxPQUFPLE1BQTVCLEVBQW9DLEdBQXBDLEVBQTBDO0FBQ3pDLE9BQUUsTUFBRixDQUFTLEVBQVQsQ0FBYSxPQUFRLENBQVIsQ0FBYixFQUEwQixtQkFBMUI7QUFDQTtBQUNELElBSkQ7QUFLQTtBQUNEOztBQUVEOzs7OztBQUtBLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsbUJBQWtCLEVBQWxCO0FBQ0E7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLG1CQUFULEdBQStCO0FBQzlCO0FBQ0EsTUFBSyxxQkFBcUIsTUFBMUIsRUFBbUM7QUFDbEMsT0FBSSxnQkFBZ0Isa0JBQXBCO0FBQ0Esb0JBQWtCLGFBQWxCOztBQUVBLE9BQUssa0JBQWtCLEVBQXZCLEVBQTRCO0FBQzNCO0FBQ0E7QUFDRDs7QUFFRCxrQkFBaUIsZ0JBQWlCLFVBQVUsS0FBVixFQUFrQjtBQUNuRCxtQkFBaUIsS0FBakI7QUFDQSxHQUZnQixDQUFqQjtBQUdBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGdCQUFULENBQTJCLGFBQTNCLEVBQTJDO0FBQzFDLE1BQUssY0FBYyxRQUFkLEtBQTJCLGFBQWhDLEVBQWdEO0FBQy9DLGlCQUFjLFFBQWQsR0FBeUIsYUFBekI7O0FBRUE7QUFDQSxLQUFHLG1CQUFILEVBQXlCLE9BQXpCLENBQWtDLGFBQWxDO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxlQUFULENBQTBCLFlBQTFCLEVBQXlDO0FBQ3hDLE1BQUssY0FBYyxPQUFkLEtBQTBCLFlBQS9CLEVBQThDO0FBQzdDLGlCQUFjLE9BQWQsR0FBd0IsWUFBeEI7O0FBRUE7QUFDQSxLQUFHLG1CQUFILEVBQXlCLE9BQXpCLENBQWtDLGFBQWxDO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7QUFLQSxVQUFTLGdCQUFULEdBQTRCO0FBQzNCLE1BQUsseUJBQXlCLEtBQTlCLEVBQXNDO0FBQ3JDLFVBQU8sRUFBUDtBQUNBOztBQUVELE1BQUksZ0JBQWdCLEVBQUcsNEJBQUgsQ0FBcEI7QUFDQSxNQUFLLGNBQWMsTUFBZCxHQUF1QixDQUE1QixFQUFnQztBQUMvQixVQUFPLEVBQUcsY0FBYyxHQUFkLENBQW1CLENBQW5CLENBQUgsRUFBNEIsSUFBNUIsQ0FBa0MsS0FBbEMsQ0FBUDtBQUNBOztBQUVELFNBQU8sRUFBUDtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxlQUFULENBQTBCLFFBQTFCLEVBQXFDO0FBQ3BDLE1BQUksVUFBVSxZQUFkOztBQUVBLE1BQUksU0FBUyxVQUFXLE9BQVgsQ0FBYjtBQUNBLE1BQUksUUFBUyxFQUFiOztBQUVBLE1BQUssT0FBTyxNQUFQLEtBQWtCLENBQXZCLEVBQTJCO0FBQzFCLFVBQU8sS0FBUDtBQUNBOztBQUVELEtBQUc7QUFDRixPQUFJLGVBQWUsT0FBTyxLQUFQLEVBQW5CO0FBQ0Esa0JBQWUsRUFBRyxZQUFILENBQWY7O0FBRUEsT0FBSSxjQUFjLGFBQWEsSUFBYixDQUFtQixLQUFuQixDQUFsQjs7QUFFQSxPQUFLLFdBQUwsRUFBbUI7QUFDbEIsWUFBUSxXQUFSO0FBQ0E7QUFDRCxHQVRELFFBU1UsT0FBTyxLQUFQLElBQWdCLE9BQU8sTUFBUCxHQUFnQixDQVQxQzs7QUFXQSxVQUFRLGVBQWdCLEtBQWhCLEVBQXVCLFFBQXZCLENBQVI7O0FBRUEsU0FBTyxLQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGNBQVQsQ0FBeUIsR0FBekIsRUFBOEIsUUFBOUIsRUFBeUM7QUFDeEMsTUFBSyxLQUFNLFlBQU4sRUFBb0IsR0FBcEIsQ0FBTCxFQUFpQztBQUNoQyxVQUFPLGFBQWMsR0FBZCxDQUFQO0FBQ0E7O0FBRUQsMkJBQTBCLEdBQTFCLEVBQStCLFVBQVUsUUFBVixFQUFxQjtBQUNuRCxnQkFBYyxHQUFkLElBQXNCLFFBQXRCOztBQUVBLFlBQVUsUUFBVjtBQUNBLEdBSkQ7O0FBTUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLHdCQUFULENBQW1DLEdBQW5DLEVBQXdDLFFBQXhDLEVBQW1EO0FBQ2xELElBQUUsT0FBRixDQUFXLE9BQVgsRUFBb0I7QUFDbkIsV0FBUSw4QkFEVztBQUVuQixhQUFVO0FBRlMsR0FBcEIsRUFHRyxVQUFVLFFBQVYsRUFBcUI7QUFDdkIsT0FBSyxjQUFjLFNBQVMsTUFBNUIsRUFBcUM7QUFDcEMsYUFBVSxTQUFTLE1BQW5CO0FBQ0E7QUFDRCxHQVBEO0FBUUE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxVQUFULEdBQXNCO0FBQ3JCLE1BQUssb0JBQUwsRUFBNEI7QUFDM0IsVUFBTyxRQUFRLEdBQVIsQ0FBYSxpQkFBYixFQUFpQyxVQUFqQyxFQUFQO0FBQ0E7O0FBRUQsTUFBSSxpQkFBaUIsRUFBRyxNQUFNLGlCQUFULENBQXJCO0FBQ0EsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsVUFBTyxlQUFlLEdBQWYsRUFBUDtBQUNBOztBQUVELFNBQU8sRUFBUDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGtCQUFULEdBQThCO0FBQzdCLE1BQUssT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQ0osT0FBTyxRQUFRLE9BQWYsS0FBMkIsV0FEdkIsSUFFSixRQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsS0FBMkIsQ0FGdkIsSUFHSixRQUFRLEdBQVIsQ0FBYSxpQkFBYixNQUFxQyxJQUhqQyxJQUlKLFFBQVEsR0FBUixDQUFhLGlCQUFiLEVBQWtDLFFBQWxDLEVBSkQsRUFJZ0Q7QUFDL0MsVUFBTyxLQUFQO0FBQ0E7O0FBRUQsU0FBTyxJQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsZ0JBQVQsQ0FBMkIsWUFBM0IsRUFBMEM7QUFDekM7QUFDQSxNQUFLLENBQUUsWUFBYSxlQUFiLENBQUYsSUFBb0MsZ0JBQWdCLElBQWhCLENBQXFCLFFBQXJCLEtBQWtDLEVBQTNFLEVBQWdGO0FBQy9FLFVBQU8sZ0JBQWdCLElBQWhCLENBQXFCLFFBQTVCO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLLHFCQUFxQixNQUExQixFQUFtQztBQUNsQyxPQUFLLGNBQWMsUUFBZCxLQUEyQixFQUFoQyxFQUFxQztBQUNwQyxXQUFPLGNBQWMsUUFBckI7QUFDQTtBQUNEOztBQUVEO0FBQ0EsTUFBSyxjQUFjLE9BQWQsS0FBMEIsRUFBL0IsRUFBb0M7QUFDbkMsVUFBTyxjQUFjLE9BQXJCO0FBQ0E7O0FBRUQsTUFBSyxpQkFBaUIsU0FBdEIsRUFBa0M7QUFDakMsVUFBTyxZQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxhQUFULEdBQXlCO0FBQ3hCLE1BQUksU0FBUyxDQUNaO0FBQ0Msa0JBQWUsMkJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsYUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLGFBSHBDO0FBSUMsT0FBSTtBQUpMLEdBRFksRUFPWjtBQUNDLGtCQUFlLHdCQURoQjtBQUVDLGVBQVksYUFBYSxVQUFiLENBQXdCLGFBRnJDO0FBR0Msb0JBQWlCLGFBQWEsSUFBYixDQUFrQixhQUhwQztBQUlDLE9BQUk7QUFKTCxHQVBZLEVBYVo7QUFDQyxrQkFBZSw4QkFEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixtQkFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLG1CQUhwQztBQUlDLE9BQUk7QUFKTCxHQWJZLEVBbUJaO0FBQ0Msa0JBQWUsMEJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsWUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLFlBSHBDO0FBSUMsT0FBSTtBQUpMLEdBbkJZLEVBeUJaO0FBQ0Msa0JBQWUsdUJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsWUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLFlBSHBDO0FBSUMsT0FBSTtBQUpMLEdBekJZLEVBK0JaO0FBQ0Msa0JBQWUsNkJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0Isa0JBRnJDO0FBR0Msb0JBQWlCLGFBQWEsSUFBYixDQUFrQixrQkFIcEM7QUFJQyxPQUFJO0FBSkwsR0EvQlksQ0FBYjs7QUF1Q0EsVUFBUyxNQUFULEVBQWlCLFVBQVUsS0FBVixFQUFrQjtBQUNsQyxLQUFHLE1BQU0sYUFBVCxFQUF5QixNQUF6QixDQUNDLFVBQVUsVUFBVixDQUFzQixNQUFNLFVBQTVCLEVBQXdDLE1BQU0sRUFBOUMsSUFDQSxVQUFVLFFBQVYsQ0FBb0IsTUFBTSxlQUExQixFQUEyQyxNQUFNLEVBQWpELENBRkQ7QUFJQSxHQUxEOztBQU9BLElBQUcsdUJBQUgsRUFBNkIsRUFBN0IsQ0FBaUMsT0FBakMsRUFBMEMsb0JBQTFDLEVBQWdFLFlBQVc7QUFDMUUsT0FBSSxVQUFVLEVBQUcsSUFBSCxDQUFkO0FBQUEsT0FDQyxZQUFZLEVBQUcsTUFBTSxRQUFRLElBQVIsQ0FBYyxlQUFkLENBQVQsQ0FEYjtBQUFBLE9BRUMsaUJBQWlCLFVBQVUsRUFBVixDQUFjLFVBQWQsQ0FGbEI7O0FBSUEsS0FBRyxTQUFILEVBQWUsV0FBZixDQUE0QixHQUE1QixFQUFpQyxZQUFXO0FBQzNDLFlBQVEsSUFBUixDQUFjLGVBQWQsRUFBK0IsQ0FBRSxjQUFqQztBQUNBLElBRkQ7QUFHQSxHQVJEO0FBU0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxzQkFBVCxDQUFpQyxZQUFqQyxFQUFnRDtBQUMvQyxNQUFLLE9BQU8sWUFBUCxLQUF3QixXQUF4QixJQUF1QyxPQUFPLGFBQWEsTUFBcEIsS0FBK0IsV0FBM0UsRUFBeUY7QUFDeEYsZ0JBQWEsTUFBYixHQUFzQix1QkFBdEI7QUFDQSxnQkFBYSxXQUFiLENBQTBCLHVCQUExQixJQUFzRCxNQUFPLGFBQWEsV0FBYixDQUEwQix1QkFBMUIsQ0FBUCxDQUF0RDs7QUFFQSxVQUFRLGFBQWEsV0FBYixDQUEwQix1QkFBMUIsQ0FBUjs7QUFFQSxVQUFPLFlBQVA7QUFDQTs7QUFFRCxTQUFPO0FBQ04sV0FBUSx1QkFERjtBQUVOLGdCQUFhO0FBQ1osNkJBQXlCO0FBQ3hCLFNBQUk7QUFEb0I7QUFEYjtBQUZQLEdBQVA7QUFRQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLHVCQUFULEdBQW1DO0FBQ2xDLE1BQUksaUJBQWlCLEVBQUcsaUJBQUgsQ0FBckI7QUFDQSxNQUFJLGdCQUFnQixFQUFHLGdCQUFILENBQXBCOztBQUVBLE1BQUssZUFBZSxNQUFmLEdBQXdCLENBQXhCLElBQTZCLGNBQWMsTUFBZCxHQUF1QixDQUF6RCxFQUE2RDtBQUM1RCxVQUFRLE1BQVIsRUFBaUIsRUFBakIsQ0FBcUIsZ0JBQXJCLEVBQXVDLFlBQVc7QUFDakQ7O0FBRUEsUUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsa0JBQWMsY0FBZDtBQUNBOztBQUVELFFBQUssY0FBYyxNQUFkLEdBQXVCLENBQTVCLEVBQWdDO0FBQy9CLGlCQUFhLGFBQWI7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsSUFiRDtBQWNBO0FBQ0Q7O0FBRUQsR0FBRyx1QkFBSDtBQUNBLENBdDJCQyxFQXMyQkMsTUF0MkJELENBQUY7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzVnQkE7O0FBRUEsSUFBSSxZQUFZLFFBQVMsdUJBQVQsQ0FBaEI7QUFDQSxJQUFJLFFBQVEsUUFBUyxtQkFBVCxDQUFaO0FBQ0EsSUFBSSxlQUFlLFFBQVMsNEJBQVQsQ0FBbkI7O0FBRUEsSUFBSSxNQUFNLFFBQVMsS0FBVCxDQUFWOztBQUVBLElBQUksb0JBQW9CLFFBQVMsNkJBQVQsQ0FBeEI7QUFDQSxJQUFJLG1CQUFvQixRQUFTLDRCQUFULENBQXhCO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUywyQkFBVCxDQUFyQjtBQUNBLElBQUksb0JBQW9CLFFBQVMsOEJBQVQsQ0FBeEI7O0FBRUEsSUFBSSxZQUFZLFFBQVMsb0JBQVQsQ0FBaEI7QUFDQSxJQUFJLFdBQVcsUUFBUyxtQkFBVCxDQUFmOztBQUVBLElBQUksZUFBZSxRQUFTLGlCQUFULENBQW5CO0FBQ0EsSUFBSSxnQkFBZ0IsUUFBUyxrQkFBVCxDQUFwQjs7QUFFQSxJQUFJLHdCQUF3QixRQUFTLGFBQVQsRUFBeUIsY0FBckQ7O0FBRUEsSUFBSSxrQkFBa0I7QUFDckIsT0FBTTtBQUNMLFNBQU8sRUFERjtBQUVMLGVBQWEsRUFGUjtBQUdMLFlBQVU7QUFITCxFQURlO0FBTXJCLGVBQWM7QUFDYixTQUFPLEVBRE07QUFFYixlQUFhLEVBRkE7QUFHYixZQUFVO0FBSEcsRUFOTztBQVdyQixVQUFTLGFBWFk7QUFZckIsWUFBVztBQUNWLHVCQUFxQiwrQkFBVyxDQUFFLENBRHhCO0FBRVYsZUFBYSxxQkFBVSxLQUFWLEVBQWtCO0FBQzlCLFVBQU8sS0FBUDtBQUNBLEdBSlM7QUFLVixxQkFBbUIsMkJBQVUsV0FBVixFQUF3QjtBQUMxQyxVQUFPLFdBQVA7QUFDQSxHQVBTO0FBUVYsa0JBQWdCLHdCQUFVLFFBQVYsRUFBcUI7QUFDcEMsVUFBTyxRQUFQO0FBQ0E7QUFWUztBQVpVLENBQXRCOztBQTBCQSxJQUFJLDhCQUE4QixDQUNqQztBQUNDLFlBQVcsa0NBRFo7QUFFQyxlQUFjO0FBRmYsQ0FEaUMsRUFLakM7QUFDQyxZQUFXLGtDQURaO0FBRUMsZUFBYztBQUZmLENBTGlDLEVBU2pDO0FBQ0MsWUFBVyx3Q0FEWjtBQUVDLGVBQWM7QUFGZixDQVRpQyxDQUFsQzs7QUFlQSxJQUFJLDRCQUE0QixHQUFoQztBQUNBLElBQUksNEJBQTRCLEdBQWhDO0FBQ0EsSUFBSSxnQ0FBZ0MsR0FBcEM7QUFDQSxJQUFJLGlDQUFpQyxHQUFyQzs7QUFFQTs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFEQSxJQUFJLGlCQUFpQixTQUFqQixjQUFpQixDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBdUI7QUFDM0MsTUFBSyxJQUFMLEdBQVksUUFBUSxLQUFLLGFBQUwsRUFBcEI7O0FBRUEsaUJBQWdCLFdBQWhCLEdBQThCO0FBQzdCLFNBQU8sS0FBSyxJQUFMLENBQVUsUUFBVixDQUFvQix1QkFBcEIsRUFBNkMsa0RBQTdDLENBRHNCO0FBRTdCLGVBQWEsS0FBSyxJQUFMLENBQVUsT0FBVjtBQUNaO0FBQ0EsT0FBSyxJQUFMLENBQVUsUUFBVixDQUFvQix1QkFBcEIsRUFBNkMsdURBQTdDLENBRlksRUFHWixTQUhZLENBRmdCO0FBTzdCLFlBQVU7QUFQbUIsRUFBOUI7O0FBVUEsY0FBYyxJQUFkLEVBQW9CLGVBQXBCOztBQUVBLEtBQUssQ0FBQyxVQUFXLEtBQUssYUFBaEIsQ0FBTixFQUF3QztBQUN2QyxRQUFNLElBQUksS0FBSixDQUFXLHFEQUFYLENBQU47QUFDQTs7QUFFRCxNQUFLLElBQUwsR0FBWSxLQUFLLElBQWpCO0FBQ0EsTUFBSyxJQUFMLEdBQVksUUFBUSxLQUFLLGFBQUwsRUFBcEI7QUFDQSxNQUFLLElBQUwsR0FBWSxJQUFaOztBQUVBLE1BQUssYUFBTCxHQUFxQixJQUFyQjtBQUNBLE1BQUssYUFBTCxHQUFxQixJQUFyQjtBQUNBLENBekJEOztBQTJCQTs7Ozs7OztBQU9BLGVBQWUsU0FBZixDQUF5QixhQUF6QixHQUF5QyxVQUFVLFlBQVYsRUFBeUI7QUFDakUsS0FBSSxzQkFBc0I7QUFDekIsWUFBVSx1QkFEZTtBQUV6QixpQkFBZTtBQUNkLDRCQUF5QjtBQUN4QixRQUFJO0FBRG9CO0FBRFg7QUFGVSxFQUExQjs7QUFTQSxnQkFBZSxnQkFBZ0IsRUFBL0I7O0FBRUEsY0FBYyxZQUFkLEVBQTRCLG1CQUE1Qjs7QUFFQSxRQUFPLElBQUksR0FBSixDQUFTLFlBQVQsQ0FBUDtBQUNBLENBZkQ7O0FBaUJBOzs7OztBQUtBLGVBQWUsU0FBZixDQUF5QixJQUF6QixHQUFnQyxZQUFXO0FBQzFDLE1BQUssY0FBTDtBQUNBLE1BQUssVUFBTDtBQUNBLE1BQUssYUFBTDtBQUNBLENBSkQ7O0FBTUE7Ozs7O0FBS0EsZUFBZSxTQUFmLENBQXlCLGNBQXpCLEdBQTBDLFlBQVc7QUFDcEQsS0FBSSxnQkFBZ0IsS0FBSyxJQUFMLENBQVUsYUFBOUI7O0FBRUEsZUFBYyxTQUFkLEdBQTBCLHNCQUF1QjtBQUNoRCxZQUFVO0FBQ1QsVUFBTyxFQURFO0FBRVQsZ0JBQWEsRUFGSjtBQUdULGFBQVUsRUFIRDtBQUlULFlBQVMsS0FBSyxJQUFMLENBQVU7QUFKVixHQURzQztBQU9oRCxlQUFhLEtBQUssSUFBTCxDQUFVLFdBUHlCO0FBUWhELFFBQU07QUFDTDtBQUNBLFNBQU0sS0FBSyxJQUFMLENBQVUsT0FBVixDQUFtQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQW9CLHVCQUFwQixFQUE2QyxtQkFBN0MsQ0FBbkIsRUFBdUYsU0FBdkYsQ0FGRDtBQUdMO0FBQ0EsbUJBQWdCLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBbUIsS0FBSyxJQUFMLENBQVUsUUFBVixDQUFvQix1QkFBcEIsRUFBNkMsY0FBN0MsQ0FBbkIsRUFBa0YsU0FBbEYsQ0FKWDtBQUtMO0FBQ0Esa0JBQWUsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFtQixLQUFLLElBQUwsQ0FBVSxRQUFWLENBQW9CLHVCQUFwQixFQUE2QyxhQUE3QyxDQUFuQixFQUFpRixTQUFqRjtBQU5WO0FBUjBDLEVBQXZCLENBQTFCOztBQWtCQSxNQUFLLE9BQUwsR0FBZTtBQUNkLFlBQVU7QUFDVCxVQUFPLGNBQWMsc0JBQWQsQ0FBc0Msd0NBQXRDLEVBQWlGLENBQWpGLENBREU7QUFFVCxnQkFBYSxjQUFjLHNCQUFkLENBQXNDLDhDQUF0QyxFQUF1RixDQUF2RjtBQUZKLEdBREk7QUFLZCxVQUFRLEtBQUssU0FBTCxFQUxNO0FBTWQsYUFBVyxjQUFjLHNCQUFkLENBQXNDLDJCQUF0QyxFQUFvRSxDQUFwRSxDQU5HO0FBT2QsaUJBQWUsY0FBYyxzQkFBZCxDQUFzQyxzQkFBdEMsRUFBK0QsQ0FBL0QsQ0FQRDtBQVFkLGNBQVksY0FBYyxzQkFBZCxDQUFzQyw2QkFBdEMsRUFBc0UsQ0FBdEUsQ0FSRTtBQVNkLGVBQWEsY0FBYyxzQkFBZCxDQUFzQyx3QkFBdEMsRUFBaUUsQ0FBakUsQ0FUQztBQVVkLGNBQVksY0FBYyxzQkFBZCxDQUFzQyw0QkFBdEMsQ0FWRTtBQVdkLGlCQUFlLGNBQWMsc0JBQWQsQ0FBc0MsZ0NBQXRDLEVBQXlFLENBQXpFO0FBWEQsRUFBZjs7QUFjQSxNQUFLLE9BQUwsQ0FBYSxhQUFiLENBQTJCLFNBQTNCLEdBQXVDLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsUUFBcEIsQ0FBNkIsTUFBN0IsS0FDcEMsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixLQUFwQixDQUEwQixNQUExQixFQURvQyxHQUVwQyxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLFdBQXBCLENBQWdDLE1BQWhDLEVBRkg7O0FBSUEsTUFBSyxPQUFMLENBQWEsS0FBYixHQUFxQjtBQUNwQixTQUFPLGNBQWMsc0JBQWQsQ0FBc0MseUJBQXRDLEVBQWtFLENBQWxFLENBRGE7QUFFcEIsWUFBVSxjQUFjLHNCQUFkLENBQXNDLDRCQUF0QyxFQUFxRSxDQUFyRSxDQUZVO0FBR3BCLGVBQWEsY0FBYyxzQkFBZCxDQUFzQywrQkFBdEMsRUFBd0UsQ0FBeEU7QUFITyxFQUFyQjs7QUFNQSxNQUFLLE9BQUwsQ0FBYSxhQUFiLEdBQTZCLEtBQUssZ0JBQUwsRUFBN0I7QUFDQSxNQUFLLE9BQUwsQ0FBYSxXQUFiLEdBQTJCLGNBQWMsc0JBQWQsQ0FBc0Msd0JBQXRDLEVBQWlFLENBQWpFLENBQTNCOztBQUVBLE1BQUssT0FBTCxDQUFhLEtBQWIsR0FBcUI7QUFDcEIsU0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQW5CLENBQXlCLFVBRFo7QUFFcEIsWUFBVSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLFFBQW5CLENBQTRCLFVBRmxCO0FBR3BCLGVBQWEsS0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixXQUFuQixDQUErQjtBQUh4QixFQUFyQjs7QUFNQSxNQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCO0FBQ3RCLFNBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixLQUF0QixDQUE0QixVQURiO0FBRXRCLFlBQVUsY0FBYyxzQkFBZCxDQUFzQyxrQ0FBdEMsRUFBMkUsQ0FBM0UsQ0FGWTtBQUd0QixlQUFhLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsV0FBdEIsQ0FBa0M7QUFIekIsRUFBdkI7QUFNQSxDQTVERDs7QUE4REE7Ozs7O0FBS0EsZUFBZSxTQUFmLENBQXlCLFNBQXpCLEdBQXFDLFlBQVc7QUFDL0MsUUFBTztBQUNOLFNBQU8sSUFBSSxTQUFKLENBQWU7QUFDckIsY0FBVyxxRUFEVTtBQUVyQixPQUFJLHNCQUZpQjtBQUdyQixVQUFPLEtBQUssSUFBTCxDQUFVLEtBSEk7QUFJckIsZ0JBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixLQUpkO0FBS3JCLFVBQU8sS0FBSyxJQUFMLENBQVUsT0FBVjtBQUNOO0FBQ0EsUUFBSyxJQUFMLENBQVUsUUFBVixDQUFvQix1QkFBcEIsRUFBNkMsWUFBN0MsQ0FGTSxFQUdOLFNBSE0sQ0FMYztBQVVyQixtQkFBZ0I7QUFWSyxHQUFmLENBREQ7QUFhTixlQUFhLElBQUksUUFBSixDQUFjO0FBQzFCLGNBQVcsaUZBRGU7QUFFMUIsT0FBSSw0QkFGc0I7QUFHMUIsVUFBTyxLQUFLLElBQUwsQ0FBVSxXQUhTO0FBSTFCLGdCQUFhLEtBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsV0FKVDtBQUsxQixVQUFPLEtBQUssSUFBTCxDQUFVLE9BQVY7QUFDTjtBQUNBLFFBQUssSUFBTCxDQUFVLFFBQVYsQ0FBb0IsdUJBQXBCLEVBQTZDLGtCQUE3QyxDQUZNLEVBR04sU0FITSxDQUxtQjtBQVUxQixtQkFBZ0I7QUFWVSxHQUFkLENBYlA7QUF5Qk4sWUFBVSxJQUFJLFNBQUosQ0FBZTtBQUN4QixjQUFXLDJFQURhO0FBRXhCLE9BQUkseUJBRm9CO0FBR3hCLFVBQU8sS0FBSyxJQUFMLENBQVUsUUFITztBQUl4QixnQkFBYSxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLFFBSlg7QUFLeEIsVUFBTyxLQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ047QUFDQSxRQUFLLElBQUwsQ0FBVSxRQUFWLENBQW9CLHVCQUFwQixFQUE2QyxZQUE3QyxDQUZNLEVBR04sU0FITSxDQUxpQjtBQVV4QixtQkFBZ0I7QUFWUSxHQUFmO0FBekJKLEVBQVA7QUFzQ0EsQ0F2Q0Q7O0FBeUNBOzs7OztBQUtBLGVBQWUsU0FBZixDQUF5QixnQkFBekIsR0FBNEMsWUFBVztBQUN0RCxLQUFJLGdCQUFnQixLQUFLLElBQUwsQ0FBVSxhQUE5Qjs7QUFFQSxRQUFPO0FBQ04sU0FBTyxJQUFJLFlBQUosQ0FDTixjQUFjLHNCQUFkLENBQXNDLHlCQUF0QyxFQUFrRSxDQUFsRSxDQURNLEVBRU47QUFDQyxpQkFBYyxLQUFLLElBQUwsQ0FBVSxLQUR6QjtBQUVDLGlCQUFjLEtBQUssSUFBTCxDQUFVLFlBQVYsQ0FBdUIsS0FGdEM7QUFHQyxnQkFBYSxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLEtBSHBDO0FBSUMsYUFBVSxLQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ1Q7QUFDQSxRQUFLLElBQUwsQ0FBVSxRQUFWLENBQW9CLHVCQUFwQixFQUE2QywyREFBN0MsQ0FGUyxFQUdULFNBSFM7QUFKWCxHQUZNLEVBWU4sS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXlCLElBQXpCLENBWk0sQ0FERDtBQWVMLGVBQWEsSUFBSSxZQUFKLENBQ1osY0FBYyxzQkFBZCxDQUFzQywrQkFBdEMsRUFBd0UsQ0FBeEUsQ0FEWSxFQUVaO0FBQ0MsaUJBQWMsS0FBSyxJQUFMLENBQVUsV0FEekI7QUFFQyxpQkFBYyxLQUFLLElBQUwsQ0FBVSxZQUFWLENBQXVCLFdBRnRDO0FBR0MsZ0JBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixXQUhwQztBQUlDLGFBQVUsS0FBSyxJQUFMLENBQVUsT0FBVjtBQUNQO0FBQ0YsUUFBSyxJQUFMLENBQVUsUUFBVixDQUFvQix1QkFBcEIsRUFBNkMsaUVBQTdDLENBRlMsRUFHVCxTQUhTO0FBSlgsR0FGWSxFQVlaLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF5QixJQUF6QixDQVpZLENBZlI7QUE2Qk4sWUFBVSxJQUFJLFlBQUosQ0FDVCxjQUFjLHNCQUFkLENBQXNDLDRCQUF0QyxFQUFxRSxDQUFyRSxDQURTLEVBRVQ7QUFDQyxpQkFBYyxLQUFLLElBQUwsQ0FBVSxRQUR6QjtBQUVDLGlCQUFjLEtBQUssSUFBTCxDQUFVLFlBQVYsQ0FBdUIsUUFGdEM7QUFHQyxnQkFBYSxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLFFBSHBDO0FBSUMsYUFBVTtBQUpYLEdBRlMsRUFRVCxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBeUIsSUFBekIsQ0FSUztBQTdCSixFQUFQO0FBd0NBLENBM0NEOztBQTZDQTs7O0FBR0EsZUFBZSxTQUFmLENBQXlCLGFBQXpCLEdBQXlDLFlBQVc7QUFDcEQ7QUFDQyxNQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEtBQUssT0FBTCxDQUFhLGFBQWIsQ0FBMkIsS0FBM0IsQ0FBaUMsYUFBakMsRUFBbEI7QUFDQSxNQUFLLElBQUwsQ0FBVSxXQUFWLEdBQXdCLEtBQUssT0FBTCxDQUFhLGFBQWIsQ0FBMkIsV0FBM0IsQ0FBdUMsYUFBdkMsRUFBeEI7QUFDQSxNQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLEtBQUssT0FBTCxDQUFhLGFBQWIsQ0FBMkIsUUFBM0IsQ0FBb0MsYUFBcEMsRUFBckI7O0FBRUE7QUFDQSxNQUFLLFFBQUwsQ0FBZSxLQUFLLE9BQUwsQ0FBYSxhQUFiLENBQTJCLEtBQTNCLENBQWlDLFFBQWpDLEVBQWY7O0FBRUE7QUFDQSxNQUFLLGNBQUwsQ0FBcUIsS0FBSyxPQUFMLENBQWEsYUFBYixDQUEyQixXQUEzQixDQUF1QyxRQUF2QyxFQUFyQjs7QUFFQTtBQUNBLE1BQUssUUFBTCxDQUFlLEtBQUssSUFBTCxDQUFVLFFBQXpCOztBQUVBO0FBQ0EsTUFBSyxJQUFMLENBQVUsU0FBVixDQUFvQixtQkFBcEIsQ0FBeUMsTUFBTyxLQUFLLElBQVosQ0FBekM7QUFDQSxDQWpCRDs7QUFtQkE7Ozs7O0FBS0EsZUFBZSxTQUFmLENBQXlCLFFBQXpCLEdBQW9DLFVBQVUsS0FBVixFQUFrQjtBQUNyRCxTQUFRLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsV0FBcEIsQ0FBaUMsS0FBakMsQ0FBUjs7QUFFQSxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLEtBQXRCLENBQTRCLFNBQTVCLEdBQXdDLEtBQXhDO0FBQ0EsQ0FKRDs7QUFNQTs7Ozs7QUFLQSxlQUFlLFNBQWYsQ0FBeUIsY0FBekIsR0FBMEMsVUFBVSxXQUFWLEVBQXdCO0FBQ2pFLGVBQWMsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixpQkFBcEIsQ0FBdUMsV0FBdkMsQ0FBZDs7QUFFQSxNQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLFdBQXRCLENBQWtDLFNBQWxDLEdBQThDLFdBQTlDO0FBQ0EsbUJBQW1CLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsV0FBekMsRUFBc0QsS0FBSyxPQUFMLENBQWEsYUFBYixDQUEyQixXQUEzQixDQUF1QyxhQUF2QyxFQUF0RDtBQUNBLENBTEQ7O0FBT0E7Ozs7QUFJQSxlQUFlLFNBQWYsQ0FBeUIsaUJBQXpCLEdBQTZDLFlBQVc7QUFDdkQsUUFBTyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFFBQTVCO0FBQ0EsQ0FGRDs7QUFJQTs7Ozs7QUFLQSxlQUFlLFNBQWYsQ0FBeUIsUUFBekIsR0FBb0MsVUFBVSxRQUFWLEVBQXFCO0FBQ3hELFlBQVcsS0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixjQUFwQixDQUFvQyxRQUFwQyxDQUFYOztBQUVBLEtBQUssYUFBYSxFQUFiLElBQW1CLEtBQUssSUFBTCxDQUFVLFFBQVYsS0FBdUIsRUFBL0MsRUFBb0Q7QUFDbkQsT0FBSyx3QkFBTDtBQUNBLE9BQUssa0JBQUw7QUFDQSxPQUFLLGNBQUw7O0FBRUE7QUFDQTs7QUFFRCxLQUFJLE1BQU0sSUFBSSxLQUFKLEVBQVY7O0FBRUEsS0FBSSxNQUFKLEdBQWEsWUFBVztBQUN2QixNQUFLLEtBQUssZUFBTCxDQUFzQixHQUF0QixDQUFMLEVBQW1DO0FBQ2xDLFFBQUssd0JBQUw7QUFDQSxRQUFLLGtCQUFMO0FBQ0EsUUFBSyxjQUFMOztBQUVBO0FBQ0E7O0FBRUQsT0FBSyxjQUFMLENBQXFCLEdBQXJCO0FBQ0EsT0FBSyxtQkFBTCxDQUEwQixRQUExQjtBQUNBLEVBWFksQ0FXWCxJQVhXLENBV0wsSUFYSyxDQUFiOztBQWFBLEtBQUksT0FBSixHQUFjLFlBQVc7QUFDeEIsT0FBSyx3QkFBTDtBQUNBLE9BQUssa0JBQUw7QUFDQSxPQUFLLGNBQUw7QUFDQSxFQUphLENBSVosSUFKWSxDQUlOLElBSk0sQ0FBZDs7QUFNQTtBQUNBLEtBQUksR0FBSixHQUFVLFFBQVY7QUFDQSxDQWxDRDs7QUFvQ0E7Ozs7QUFJQSxlQUFlLFNBQWYsQ0FBeUIsbUJBQXpCLEdBQStDLFVBQVUsS0FBVixFQUFrQjtBQUNoRSxLQUFJLFlBQVksS0FBSyxpQkFBTCxFQUFoQjs7QUFFQSxXQUFVLFNBQVYsR0FBc0IsRUFBdEI7QUFDQSxXQUFVLEtBQVYsQ0FBZ0IsZUFBaEIsR0FBa0MsU0FBUyxLQUFULEdBQWlCLEdBQW5EO0FBQ0EsQ0FMRDs7QUFPQTs7O0FBR0EsZUFBZSxTQUFmLENBQXlCLHdCQUF6QixHQUFvRCxZQUFXO0FBQzlELEtBQUksWUFBWSxLQUFLLGlCQUFMLEVBQWhCOztBQUVBLFdBQVUsS0FBVixDQUFnQixlQUFoQixHQUFrQyxFQUFsQztBQUNBLENBSkQ7O0FBTUE7Ozs7OztBQU1BLGVBQWUsU0FBZixDQUF5QixjQUF6QixHQUEwQyxVQUFVLEdBQVYsRUFBZ0I7QUFDekQsTUFBSyxrQkFBTDs7QUFFQSxLQUFLLEtBQUssWUFBTCxDQUFtQixHQUFuQixDQUFMLEVBQWdDO0FBQy9CLE9BQUssb0JBQUw7O0FBRUE7QUFDQTs7QUFFRCxNQUFLLG9CQUFMOztBQUVBO0FBQ0EsQ0FaRDs7QUFjQTs7Ozs7O0FBTUEsZUFBZSxTQUFmLENBQXlCLGdCQUF6QixHQUE0QyxVQUFVLEdBQVYsRUFBZ0I7QUFDM0QsS0FBSyxLQUFLLFlBQUwsQ0FBbUIsR0FBbkIsQ0FBTCxFQUFnQztBQUMvQixTQUFPLHlCQUFQO0FBQ0E7O0FBRUQsUUFBTyx5QkFBUDtBQUNBLENBTkQ7QUFPQTs7O0FBR0EsZUFBZSxTQUFmLENBQXlCLGNBQXpCLEdBQTBDLFlBQVc7QUFDcEQsTUFBSyxvQkFBTDs7QUFFQSxrQkFDQyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFFBRHRCLEVBRUMsRUFGRCxFQUdDLEtBSEQsRUFJQyxTQUpEO0FBT0EsQ0FWRDs7QUFZQTs7Ozs7OztBQU9BLGVBQWUsU0FBZixDQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBa0I7QUFDekQsUUFDQyxNQUFNLEtBQU4sR0FBYyw2QkFBZCxJQUNBLE1BQU0sTUFBTixHQUFlLDhCQUZoQjtBQUlBLENBTEQ7O0FBT0E7Ozs7Ozs7QUFPQSxlQUFlLFNBQWYsQ0FBeUIsZUFBekIsR0FBMkMsVUFBVSxLQUFWLEVBQWtCO0FBQzVELFFBQ0MsTUFBTSxLQUFOLEdBQWMseUJBQWQsSUFDQSxNQUFNLE1BQU4sR0FBZSx5QkFGaEI7QUFJQSxDQUxEOztBQU9BOzs7QUFHQSxlQUFlLFNBQWYsQ0FBeUIsb0JBQXpCLEdBQWdELFlBQVc7QUFDMUQsS0FBSSxnQkFBZ0IsS0FBSyxJQUFMLENBQVUsYUFBOUI7O0FBRUEsZ0JBQWdCLGVBQWhCLEVBQWlDLHVCQUFqQyxFQUEwRCxhQUExRDtBQUNBLGdCQUFnQixlQUFoQixFQUFpQyxrQ0FBakMsRUFBcUUsYUFBckU7QUFDQSxnQkFBZ0IsZUFBaEIsRUFBaUMsd0NBQWpDLEVBQTJFLGFBQTNFO0FBQ0EsQ0FORDs7QUFRQSxlQUFlLFNBQWYsQ0FBeUIsdUJBQXpCLEdBQW1ELFlBQVc7QUFDN0QsS0FBSSxnQkFBZ0IsS0FBSyxJQUFMLENBQVUsYUFBOUI7O0FBRUEsbUJBQW1CLGVBQW5CLEVBQW9DLHVCQUFwQyxFQUE2RCxhQUE3RDtBQUNBLG1CQUFtQixlQUFuQixFQUFvQyxrQ0FBcEMsRUFBd0UsYUFBeEU7QUFDQSxtQkFBbUIsZUFBbkIsRUFBb0Msd0NBQXBDLEVBQThFLGFBQTlFO0FBQ0EsQ0FORDs7QUFRQTs7O0FBR0EsZUFBZSxTQUFmLENBQXlCLG9CQUF6QixHQUFnRCxZQUFXO0FBQzFELEtBQUksZ0JBQWdCLEtBQUssSUFBTCxDQUFVLGFBQTlCOztBQUVBLGdCQUFnQixlQUFoQixFQUFpQyx1QkFBakMsRUFBMEQsYUFBMUQ7QUFDQSxnQkFBZ0IsZUFBaEIsRUFBaUMsa0NBQWpDLEVBQXFFLGFBQXJFO0FBQ0EsZ0JBQWdCLGVBQWhCLEVBQWlDLHdDQUFqQyxFQUEyRSxhQUEzRTtBQUNBLENBTkQ7O0FBUUEsZUFBZSxTQUFmLENBQXlCLHVCQUF6QixHQUFtRCxZQUFXO0FBQzdELEtBQUksZ0JBQWdCLEtBQUssSUFBTCxDQUFVLGFBQTlCOztBQUVBLG1CQUFtQixlQUFuQixFQUFvQyx1QkFBcEMsRUFBNkQsYUFBN0Q7QUFDQSxtQkFBbUIsZUFBbkIsRUFBb0Msa0NBQXBDLEVBQXdFLGFBQXhFO0FBQ0EsbUJBQW1CLGVBQW5CLEVBQW9DLHdDQUFwQyxFQUE4RSxhQUE5RTtBQUNBLENBTkQ7O0FBUUE7OztBQUdBLGVBQWUsU0FBZixDQUF5QixrQkFBekIsR0FBOEMsWUFBVztBQUN4RCxNQUFLLHVCQUFMO0FBQ0EsTUFBSyx1QkFBTDtBQUNBLENBSEQ7O0FBS0E7OztBQUdBLGVBQWUsU0FBZixDQUF5QixVQUF6QixHQUFzQyxZQUFXO0FBQ2hELEtBQUksZ0JBQWdCLElBQUksYUFBSixDQUFtQiwyQkFBbkIsRUFBZ0QsS0FBSyxPQUFyRCxFQUE4RCxJQUE5RCxDQUFwQjtBQUNBLGVBQWMsVUFBZCxDQUEwQixLQUFLLE9BQUwsQ0FBYSxVQUF2QyxFQUFtRCxLQUFLLE9BQUwsQ0FBYSxXQUFoRTtBQUNBLENBSEQ7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLGNBQWpCOzs7QUNqbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5L0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGdldEwxMG5PYmplY3QgPSByZXF1aXJlKCBcIi4vZ2V0TDEwbk9iamVjdFwiICk7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGVzY3JpcHRpb24gcGxhY2Vob2xkZXIgZm9yIHVzZSBpbiB0aGUgZGVzY3JpcHRpb24gZm9ybXMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRlc2NyaXB0aW9uIHBsYWNlaG9sZGVyLlxuICovXG5mdW5jdGlvbiBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyKCkge1xuXHR2YXIgZGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IFwiXCI7XG5cdHZhciBsMTBuT2JqZWN0ID0gZ2V0TDEwbk9iamVjdCgpO1xuXG5cdGlmICggbDEwbk9iamVjdCApIHtcblx0XHRkZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gbDEwbk9iamVjdC5tZXRhZGVzY190ZW1wbGF0ZTtcblx0fVxuXG5cdHJldHVybiBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERlc2NyaXB0aW9uUGxhY2Vob2xkZXI7XG4iLCJ2YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbDEwbiBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhZ2UsIGVpdGhlciB0ZXJtIG9yIHBvc3QuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gVGhlIGwxMG4gb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYWdlLlxuICovXG5mdW5jdGlvbiBnZXRMMTBuT2JqZWN0KCkge1xuXHR2YXIgbDEwbk9iamVjdCA9IG51bGw7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCB3aW5kb3cud3BzZW9Qb3N0U2NyYXBlckwxMG4gKSApIHtcblx0XHRsMTBuT2JqZWN0ID0gd2luZG93Lndwc2VvUG9zdFNjcmFwZXJMMTBuO1xuXHR9IGVsc2UgaWYgKCAhIGlzVW5kZWZpbmVkKCB3aW5kb3cud3BzZW9UZXJtU2NyYXBlckwxMG4gKSApIHtcblx0XHRsMTBuT2JqZWN0ID0gd2luZG93Lndwc2VvVGVybVNjcmFwZXJMMTBuO1xuXHR9XG5cblx0cmV0dXJuIGwxMG5PYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TDEwbk9iamVjdDtcbiIsInZhciBnZXRMMTBuT2JqZWN0ID0gcmVxdWlyZSggXCIuL2dldEwxMG5PYmplY3RcIiApO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHRpdGxlIHBsYWNlaG9sZGVyIGZvciB1c2UgaW4gdGhlIHRpdGxlIGZvcm1zLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0aXRsZSBwbGFjZWhvbGRlci5cbiAqL1xuZnVuY3Rpb24gZ2V0VGl0bGVQbGFjZWhvbGRlcigpIHtcblx0dmFyIHRpdGxlUGxhY2Vob2xkZXIgPSBcIlwiO1xuXHR2YXIgbDEwbk9iamVjdCA9IGdldEwxMG5PYmplY3QoKTtcblxuXHRpZiAoIGwxMG5PYmplY3QgKSB7XG5cdFx0dGl0bGVQbGFjZWhvbGRlciA9IGwxMG5PYmplY3QudGl0bGVfdGVtcGxhdGU7XG5cdH1cblxuXHRpZiAoIHRpdGxlUGxhY2Vob2xkZXIgPT09IFwiXCIgKSB7XG5cdFx0dGl0bGVQbGFjZWhvbGRlciA9IFwiJSV0aXRsZSUlIC0gJSVzaXRlbmFtZSUlXCI7XG5cdH1cblxuXHRyZXR1cm4gdGl0bGVQbGFjZWhvbGRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUaXRsZVBsYWNlaG9sZGVyO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKHZvaWQgMCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1VuZGVmaW5lZChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVW5kZWZpbmVkO1xuIiwiLyoganNoaW50IC1XMDk3ICovXG5cbi8qKlxuICogUmV0dXJucyB0aGUgSFRNTCBmb3IgYSBoZWxwIGJ1dHRvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHB1dCBpbiB0aGUgYnV0dG9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRyb2xzIFRoZSBIVE1MIElEIG9mIHRoZSBlbGVtZW50IHRoaXMgYnV0dG9uIGNvbnRyb2xzLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBIVE1MLlxuICovXG5mdW5jdGlvbiBoZWxwQnV0dG9uKCB0ZXh0LCBjb250cm9scyApIHtcblx0cmV0dXJuICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInlvYXN0X2hlbHAgeW9hc3QtaGVscC1idXR0b24gZGFzaGljb25zXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgJyArXG5cdFx0J2FyaWEtY29udHJvbHM9XCInICsgY29udHJvbHMgKyAnXCI+PHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj4nICsgdGV4dCArICc8L3NwYW4+PC9idXR0b24+Jztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBIVE1MIGZvciBhIGhlbHAgYnV0dG9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcHV0IGluIHRoZSBidXR0b24uXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIEhUTUwgSUQgdG8gZ2l2ZSB0aGlzIGJ1dHRvbi5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIEhUTWwuXG4gKi9cbmZ1bmN0aW9uIGhlbHBUZXh0KCB0ZXh0LCBpZCApIHtcblx0cmV0dXJuICc8cCBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cInlvYXN0LWhlbHAtcGFuZWxcIj4nICsgdGV4dCArICc8L3A+Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGhlbHBCdXR0b246IGhlbHBCdXR0b24sXG5cdGhlbHBUZXh0OiBoZWxwVGV4dCxcbn07XG4iLCIvKiBnbG9iYWwgeW9hc3RTb2NpYWxQcmV2aWV3LCB0aW55TUNFLCByZXF1aXJlLCB3cCwgWW9hc3RTRU8sIGFqYXh1cmwgICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cblxudmFyIGdldEltYWdlcyA9IHJlcXVpcmUoIFwieW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dFwiICk7XG52YXIgaGVscFBhbmVsID0gcmVxdWlyZSggXCIuL2hlbHBQYW5lbFwiICk7XG52YXIgZ2V0VGl0bGVQbGFjZWhvbGRlciA9IHJlcXVpcmUoIFwiLi4vLi4vLi4vLi4vanMvc3JjL2FuYWx5c2lzL2dldFRpdGxlUGxhY2Vob2xkZXJcIiApO1xudmFyIGdldERlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSByZXF1aXJlKCBcIi4uLy4uLy4uLy4uL2pzL3NyYy9hbmFseXNpcy9nZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyXCIgKTtcblxudmFyIGNsb25lID0gcmVxdWlyZSggXCJsb2Rhc2gvY2xvbmVcIiApO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBfaGFzID0gcmVxdWlyZSggXCJsb2Rhc2gvaGFzXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcbnZhciBzb2NpYWxQcmV2aWV3cyA9IHJlcXVpcmUoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIgKTtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0LyoqXG5cdCAqIFdlIHdhbnQgdG8gc3RvcmUgdGhlIGZhbGxiYWNrcyBpbiBhbiBvYmplY3QsIHRvIGhhdmUgZGlyZWN0bHkgYWNjZXNzIHRvIHRoZW0uXG5cdCAqIEB0eXBlIHt7Y29udGVudDogc3RyaW5nLCBmZWF0dXJlZDogc3RyaW5nfX1cblx0ICovXG5cdHZhciBpbWFnZUZhbGxCYWNrID0ge1xuXHRcdGNvbnRlbnQ6IFwiXCIsXG5cdFx0ZmVhdHVyZWQ6IFwiXCIsXG5cdH07XG5cblx0dmFyIGNhblJlYWRGZWF0dXJlZEltYWdlID0gdHJ1ZTtcblxuXHR2YXIgRmFjZWJvb2tQcmV2aWV3ID0gc29jaWFsUHJldmlld3MuRmFjZWJvb2tQcmV2aWV3O1xuXHR2YXIgVHdpdHRlclByZXZpZXcgPSBzb2NpYWxQcmV2aWV3cy5Ud2l0dGVyUHJldmlldztcblxuXHR2YXIgZmFjZWJvb2tQcmV2aWV3LCB0d2l0dGVyUHJldmlldztcblxuXHR2YXIgdHJhbnNsYXRpb25zID0geW9hc3RTb2NpYWxQcmV2aWV3LmkxOG47XG5cblx0dmFyIGkxOG4gPSBuZXcgSmVkKCBhZGRMaWJyYXJ5VHJhbnNsYXRpb25zKCB0cmFuc2xhdGlvbnMubGlicmFyeSApICk7XG5cdHZhciBiaWdnZXJJbWFnZXMgPSB7fTtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgZXZlbnRzIGZvciBvcGVuaW5nIHRoZSBXUCBtZWRpYSBsaWJyYXJ5IHdoZW4gcHJlc3NpbmcgdGhlIGJ1dHRvbi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGltYWdlVXJsIFRoZSBpbWFnZSBVUkwgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VCdXR0b24gSUQgbmFtZSBmb3IgdGhlIGltYWdlIGJ1dHRvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHJlbW92ZUJ1dHRvbiBJRCBuYW1lIGZvciB0aGUgcmVtb3ZlIGJ1dHRvbi5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gb25NZWRpYVNlbGVjdCBUaGUgZXZlbnQgdGhhdCB3aWxsIGJlIHJhbiB3aGVuIGltYWdlIGlzIGNob3Nlbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IGltYWdlUHJldmlld0VsZW1lbnQgVGhlIGltYWdlIHByZXZpZXcgZWxlbWVudCB0aGF0IGNhbiBiZSBjbGlja2VkIHRvIHVwZGF0ZSBhcyB3ZWxsLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGJpbmRVcGxvYWRCdXR0b25FdmVudHMoIGltYWdlVXJsLCBpbWFnZUJ1dHRvbiwgcmVtb3ZlQnV0dG9uLCBvbk1lZGlhU2VsZWN0LCBpbWFnZVByZXZpZXdFbGVtZW50ICkge1xuXHRcdHZhciBzb2NpYWxQcmV2aWV3VXBsb2FkZXIgPSB3cC5tZWRpYS5mcmFtZXMuZmlsZV9mcmFtZSA9IHdwLm1lZGlhKCB7XG5cdFx0XHR0aXRsZTogeW9hc3RTb2NpYWxQcmV2aWV3LmNob29zZV9pbWFnZSxcblx0XHRcdGJ1dHRvbjogeyB0ZXh0OiB5b2FzdFNvY2lhbFByZXZpZXcuY2hvb3NlX2ltYWdlIH0sXG5cdFx0XHRtdWx0aXBsZTogZmFsc2UsXG5cdFx0fSApO1xuXG5cdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhdHRhY2htZW50ID0gc29jaWFsUHJldmlld1VwbG9hZGVyLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS50b0pTT04oKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBpbWFnZSBVUkwuXG5cdFx0XHRpbWFnZVVybC52YWwoIGF0dGFjaG1lbnQudXJsICk7XG5cblx0XHRcdG9uTWVkaWFTZWxlY3QoKTtcblxuXHRcdFx0JCggcmVtb3ZlQnV0dG9uICkuc2hvdygpO1xuXHRcdH0gKTtcblxuXHRcdCQoIHJlbW92ZUJ1dHRvbiApLmNsaWNrKCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIENsZWFyIHRoZSBpbWFnZSBVUkxcblx0XHRcdGltYWdlVXJsLnZhbCggXCJcIiApO1xuXG5cdFx0XHRvbk1lZGlhU2VsZWN0KCk7XG5cblx0XHRcdCQoIHJlbW92ZUJ1dHRvbiApLmhpZGUoKTtcblx0XHR9ICk7XG5cblx0XHQkKCBpbWFnZUJ1dHRvbiApLmNsaWNrKCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRzb2NpYWxQcmV2aWV3VXBsb2FkZXIub3BlbigpO1xuXHRcdH0gKTtcblxuXHRcdCQoIGltYWdlUHJldmlld0VsZW1lbnQgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbiggZXZlbnRPYmplY3QgKSB7XG5cdFx0XHRzb2NpYWxQcmV2aWV3VXBsb2FkZXIub3BlbigpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSBjaG9vc2UgaW1hZ2UgYnV0dG9uIGFuZCBoaWRlcyB0aGUgaW5wdXQgZmllbGQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2aWV3IFRoZSBwcmV2aWV3IHRvIGFkZCB0aGUgdXBsb2FkIGJ1dHRvbiB0by5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRVcGxvYWRCdXR0b24oIHByZXZpZXcgKSB7XG5cdFx0aWYgKCB0eXBlb2Ygd3AubWVkaWEgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGltYWdlVXJsID0gJCggcHJldmlldy5lbGVtZW50LmZvcm1Db250YWluZXIgKS5maW5kKCBcIi5qcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiICk7XG5cblx0XHR2YXIgYnV0dG9uRGl2ID0gJCggXCI8ZGl2PjwvZGl2PlwiICk7XG5cdFx0YnV0dG9uRGl2Lmluc2VydEFmdGVyKCBpbWFnZVVybCApO1xuXG5cdFx0dmFyIHVwbG9hZEJ1dHRvblRleHQgPSBnZXRVcGxvYWRCdXR0b25UZXh0KCBwcmV2aWV3ICk7XG5cblx0XHR2YXIgaW1hZ2VGaWVsZElkICAgID0galF1ZXJ5KCBpbWFnZVVybCApLmF0dHIoIFwiaWRcIiApO1xuXHRcdHZhciBpbWFnZUJ1dHRvbklkICAgPSBpbWFnZUZpZWxkSWQgKyBcIl9idXR0b25cIjtcblx0XHR2YXIgaW1hZ2VCdXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgaW1hZ2VCdXR0b25JZCArICdcIiAnICtcblx0XHRcdCdjbGFzcz1cImJ1dHRvbiBidXR0b24tcHJpbWFyeSB3cHNlb19wcmV2aWV3X2ltYWdlX3VwbG9hZF9idXR0b25cIiB0eXBlPVwiYnV0dG9uXCI+JyArIHVwbG9hZEJ1dHRvblRleHQgKyAnPC9idXR0b24+JztcblxuXHRcdHZhciByZW1vdmVCdXR0b25JZCAgID0gaW1hZ2VGaWVsZElkICsgXCJfcmVtb3ZlX2J1dHRvblwiO1xuXHRcdHZhciByZW1vdmVCdXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgcmVtb3ZlQnV0dG9uSWQgKyAnXCIgdHlwZT1cImJ1dHRvblwiICcgK1xuXHRcdFx0J2NsYXNzPVwiYnV0dG9uIHdwc2VvX3ByZXZpZXdfaW1hZ2VfdXBsb2FkX2J1dHRvblwiPicgKyB5b2FzdFNvY2lhbFByZXZpZXcucmVtb3ZlSW1hZ2VCdXR0b24gKyAnPC9idXR0b24+JztcblxuXHRcdCQoIGJ1dHRvbkRpdiApLmFwcGVuZCggaW1hZ2VCdXR0b25IdG1sICk7XG5cdFx0JCggYnV0dG9uRGl2ICkuYXBwZW5kKCByZW1vdmVCdXR0b25IdG1sICk7XG5cblx0XHRpbWFnZVVybC5oaWRlKCk7XG5cdFx0aWYgKCBpbWFnZVVybC52YWwoKSA9PT0gXCJcIiApIHtcblx0XHRcdCQoIFwiI1wiICsgcmVtb3ZlQnV0dG9uSWQgKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0YmluZFVwbG9hZEJ1dHRvbkV2ZW50cyhcblx0XHRcdGltYWdlVXJsLFxuXHRcdFx0XCIjXCIgKyBpbWFnZUJ1dHRvbklkLFxuXHRcdFx0XCIjXCIgKyByZW1vdmVCdXR0b25JZCxcblx0XHRcdHByZXZpZXcudXBkYXRlUHJldmlldy5iaW5kKCBwcmV2aWV3ICksXG5cdFx0XHQkKCBwcmV2aWV3LmVsZW1lbnQuY29udGFpbmVyICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld19faW1hZ2VcIiApXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBjdXJyZW50IHBhZ2U6IHBvc3Qgb3IgdGVybS5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGN1cnJlbnQgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRUeXBlKCkge1xuXHRcdC8vIFdoZW4gdGhpcyBmaWVsZCBleGlzdHMsIGl0IGlzIGEgcG9zdC5cblx0XHRpZiAoICQoIFwiI3Bvc3RfSURcIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gXCJwb3N0XCI7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGlzIGZpZWxkIGlzIGZvdW5kLCBpdCBpcyBhIHRlcm0uXG5cdFx0aWYgKCAkKCBcImlucHV0W25hbWU9dGFnX0lEXVwiICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybiBcInRlcm1cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwcmVmaXggZm9yIHRoZSBmaWVsZHMsIGJlY2F1c2Ugb2YgdGhlIGZpZWxkcyBmb3IgdGhlIHBvc3QgZG8gaGF2ZSBhbiBvdGhlcmUgcHJlZml4IHRoYW4gdGhlIG9uZXMgZm9yXG5cdCAqIGEgdGF4b25vbXkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgcHJlZml4IHRvIHVzZS5cblx0ICovXG5cdGZ1bmN0aW9uIGZpZWxkUHJlZml4KCkge1xuXHRcdHN3aXRjaCggZ2V0Q3VycmVudFR5cGUoKSApIHtcblx0XHRcdGNhc2UgXCJwb3N0XCI6XG5cdFx0XHRcdHJldHVybiBcInlvYXN0X3dwc2VvXCI7XG5cdFx0XHRjYXNlIFwidGVybVwiOlxuXHRcdFx0XHRyZXR1cm4gXCJ3cHNlb1wiO1xuXHRcdFx0ZGVmYXVsdCA6XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0aW55bWNlIGFuZCB0ZXh0YXJlYSBmaWVsZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuYW1lIGZvciB0aGUgY29udGVudCBmaWVsZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvbnRlbnRUZXh0TmFtZSgpIHtcblx0XHRzd2l0Y2ggKCBnZXRDdXJyZW50VHlwZSgpICkge1xuXHRcdFx0Y2FzZSBcInBvc3RcIiA6XG5cdFx0XHRcdHJldHVybiBcImNvbnRlbnRcIjtcblx0XHRcdGNhc2UgXCJ0ZXJtXCIgOlxuXHRcdFx0XHRyZXR1cm4gXCJkZXNjcmlwdGlvblwiO1xuXHRcdFx0ZGVmYXVsdCA6XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBzb2NpYWwgcHJldmlldyBjb250YWluZXIgYW5kIGhpZGVzIHRoZSBvbGQgZm9ybSB0YWJsZSwgdG8gcmVwbGFjZSBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNvY2lhbFByZXZpZXdob2xkZXIgVGhlIGhvbGRlciBlbGVtZW50IHdoZXJlIHRoZSBjb250YWluZXIgd2lsbCBiZSBhcHBlbmQgdG8uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb250YWluZXJJZCBUaGUgaWQgdGhlIGNvbnRhaW5lciB3aWxsIGdldFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNvY2lhbFByZXZpZXdDb250YWluZXIoIHNvY2lhbFByZXZpZXdob2xkZXIsIGNvbnRhaW5lcklkICkge1xuXHRcdHNvY2lhbFByZXZpZXdob2xkZXIuYXBwZW5kKCAnPGRpdiBpZD1cIicgKyBjb250YWluZXJJZCArICdcIj48L2Rpdj4nICk7XG5cdFx0c29jaWFsUHJldmlld2hvbGRlci5maW5kKCBcIi5mb3JtLXRhYmxlXCIgKS5oaWRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzbmlwcGV0IGVkaXRvclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGdldE1ldGFEZXNjcmlwdGlvbigpIHtcblx0XHRyZXR1cm4gJCggXCIjeW9hc3Rfd3BzZW9fbWV0YWRlc2NcIiApLnZhbCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmaWVsZC5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgbWV0YSBkZXNjcmlwdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNvY2lhbERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKSB7XG5cdFx0dmFyIGRlc2NyaXB0aW9uID0gZ2V0TWV0YURlc2NyaXB0aW9uKCk7XG5cblx0XHRpZiAoIFwiXCIgPT09IGRlc2NyaXB0aW9uICkge1xuXHRcdFx0ZGVzY3JpcHRpb24gPSBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIHNvY2lhbCBwcmV2aWV3IHByb3RvdHlwZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRFbGVtZW50IFRoZSBlbGVtZW50IHdoZXJlIHRoZSBwcmV2aWV3IGlzIGxvYWRlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkUHJlZml4IFRoZSBwcmVmaXggZWFjaCBmb3JtIGVsZW1lbnQgaGFzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7IHtcblx0ICogXHRcdHRhcmdldEVsZW1lbnQ6IEVsZW1lbnQsXG5cdCAqXHRcdGRhdGE6IHt0aXRsZTogKiwgZGVzY3JpcHRpb246ICosIGltYWdlVXJsOiAqfSxcblx0ICogXHRcdGJhc2VVUkw6ICosXG5cdCAqIFx0XHRjYWxsYmFja3M6IHt1cGRhdGVTb2NpYWxQcmV2aWV3OiBjYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlld31cblx0ICogfSB9IFRoZSBhcmd1bWVudHMgZm9yIHRoZSBzb2NpYWwgcHJldmlldy5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNvY2lhbFByZXZpZXdBcmdzKCB0YXJnZXRFbGVtZW50LCBmaWVsZFByZWZpeCApIHtcblx0XHR2YXIgdGl0bGVQbGFjZWhvbGRlciA9IGdldFRpdGxlUGxhY2Vob2xkZXIoKTtcblx0XHR2YXIgZGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IGdldFNvY2lhbERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKTtcblxuXHRcdHZhciBhcmdzID0ge1xuXHRcdFx0dGFyZ2V0RWxlbWVudDogJCggdGFyZ2V0RWxlbWVudCApLmdldCggMCApLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0aXRsZTogJCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLXRpdGxlXCIgKS52YWwoKSxcblx0XHRcdFx0ZGVzY3JpcHRpb246ICQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1kZXNjcmlwdGlvblwiICkudmFsKCksXG5cdFx0XHRcdGltYWdlVXJsOiAkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItaW1hZ2VcIiApLnZhbCgpLFxuXHRcdFx0fSxcblx0XHRcdGJhc2VVUkw6IHlvYXN0U29jaWFsUHJldmlldy53ZWJzaXRlLFxuXHRcdFx0Y2FsbGJhY2tzOiB7XG5cdFx0XHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdCQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi10aXRsZVwiICkudmFsKCBkYXRhLnRpdGxlICk7XG5cdFx0XHRcdFx0JCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWRlc2NyaXB0aW9uXCIgKS52YWwoIGRhdGEuZGVzY3JpcHRpb24gKTtcblx0XHRcdFx0XHQkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItaW1hZ2VcIiApLnZhbCggZGF0YS5pbWFnZVVybCApO1xuXG5cdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIFR3aXR0ZXIgaXMgdXBkYXRlZCBpZiBhIEZhY2Vib29rIGltYWdlIGlzIHNldFxuXHRcdFx0XHRcdCQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiaW1hZ2VVcGRhdGVcIiApO1xuXG5cdFx0XHRcdFx0aWYgKCBkYXRhLmltYWdlVXJsICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0dmFyIGJ1dHRvblByZWZpeCA9IHRhcmdldEVsZW1lbnQuYXR0ciggXCJpZFwiICkucmVwbGFjZSggXCJQcmV2aWV3XCIsIFwiXCIgKTtcblx0XHRcdFx0XHRcdHNldFVwbG9hZEJ1dHRvblZhbHVlKCBidXR0b25QcmVmaXgsIHlvYXN0U29jaWFsUHJldmlldy51c2VPdGhlckltYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0alF1ZXJ5KCB0YXJnZXRFbGVtZW50ICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJ0aXRsZVVwZGF0ZVwiICk7XG5cdFx0XHRcdFx0alF1ZXJ5KCB0YXJnZXRFbGVtZW50ICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJkZXNjcmlwdGlvblVwZGF0ZVwiICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeUltYWdlVXJsOiBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGltYWdlVXJsID0gZ2V0RmFsbGJhY2tJbWFnZSggXCJcIiApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHRcdFx0fSxcblx0XHRcdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdFx0XHRpZiAoIGZpZWxkUHJlZml4LmluZGV4T2YoIFwidHdpdHRlclwiICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdGlmICggdGl0bGUgPT09ICQoIFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlXCIgKS5hdHRyKCBcInBsYWNlaG9sZGVyXCIgKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZhY2Vib29rVGl0bGUgPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVcIiApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIGZhY2Vib29rVGl0bGUgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGl0bGUgPSBmYWNlYm9va1RpdGxlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBZb2FzdFNFTy53cC5yZXBsYWNlVmFyc1BsdWdpbi5yZXBsYWNlVmFyaWFibGVzKCB0aXRsZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RpZnlEZXNjcmlwdGlvbjogZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRcdFx0XHRcdGlmICggZmllbGRQcmVmaXguaW5kZXhPZiggXCJ0d2l0dGVyXCIgKSA+IC0xICkge1xuXHRcdFx0XHRcdFx0aWYgKCBkZXNjcmlwdGlvbiA9PT0gJCggXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIiApLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZmFjZWJvb2tEZXNjcmlwdGlvbiA9ICQoIFwiI2ZhY2Vib29rLWVkaXRvci1kZXNjcmlwdGlvblwiICkudmFsKCk7XG5cdFx0XHRcdFx0XHRcdGlmICggZmFjZWJvb2tEZXNjcmlwdGlvbiAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9IGZhY2Vib29rRGVzY3JpcHRpb247XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggaXNVbmRlZmluZWQoIGRlc2NyaXB0aW9uICkgKXtcblx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSAkKCAnI3R3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uJyApLmF0dHIoICdwbGFjZWhvbGRlcicgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gWW9hc3RTRU8ud3AucmVwbGFjZVZhcnNQbHVnaW4ucmVwbGFjZVZhcmlhYmxlcyggZGVzY3JpcHRpb24gKTtcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRwbGFjZWhvbGRlcjoge1xuXHRcdFx0XHR0aXRsZTogdGl0bGVQbGFjZWhvbGRlcixcblx0XHRcdH0sXG5cdFx0XHRkZWZhdWx0VmFsdWU6IHtcblx0XHRcdFx0dGl0bGU6IHRpdGxlUGxhY2Vob2xkZXIsXG5cdFx0XHR9LFxuXHRcdH07XG5cblx0XHRpZiAoIFwiXCIgIT09IGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgKSB7XG5cdFx0XHRhcmdzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcblx0XHRcdGFyZ3MuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJncztcblx0fVxuXG5cdC8qKlxuXHQgKiBUcnkgdG8gZ2V0IHRoZSBGYWNlYm9vayBhdXRob3IgbmFtZSB2aWEgQUpBWCBhbmQgcHV0IGl0IHRvIHRoZSBGYWNlYm9vayBwcmV2aWV3LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0ZhY2Vib29rUHJldmlld30gZmFjZWJvb2tQcmV2aWV3IFRoZSBGYWNlYm9vayBwcmV2aWV3IG9iamVjdFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGdldEZhY2Vib29rQXV0aG9yKCBmYWNlYm9va1ByZXZpZXcgKSB7XG5cdFx0JC5nZXQoXG5cdFx0XHRhamF4dXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRhY3Rpb246IFwid3BzZW9fZ2V0X2ZhY2Vib29rX25hbWVcIixcblx0XHRcdFx0X2FqYXhfbm9uY2U6IHlvYXN0U29jaWFsUHJldmlldy5mYWNlYm9va05vbmNlLFxuXHRcdFx0XHR1c2VyX2lkOiAkKCBcIiNwb3N0X2F1dGhvcl9vdmVycmlkZVwiICkudmFsKCksXG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24oIGF1dGhvciApIHtcblx0XHRcdFx0aWYgKCBhdXRob3IgIT09IDAgKSB7XG5cdFx0XHRcdFx0ZmFjZWJvb2tQcmV2aWV3LnNldEF1dGhvciggYXV0aG9yICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBmYWNlYm9va0hvbGRlciBUYXJnZXQgZWxlbWVudCBmb3IgYWRkaW5nIHRoZSBGYWNlYm9vayBwcmV2aWV3LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRGYWNlYm9vayggZmFjZWJvb2tIb2xkZXIgKSB7XG5cdFx0Y3JlYXRlU29jaWFsUHJldmlld0NvbnRhaW5lciggZmFjZWJvb2tIb2xkZXIsIFwiZmFjZWJvb2tQcmV2aWV3XCIgKTtcblxuXHRcdHZhciBmYWNlYm9va1ByZXZpZXdDb250YWluZXIgPSAkKCBcIiNmYWNlYm9va1ByZXZpZXdcIiApO1xuXHRcdGZhY2Vib29rUHJldmlldyA9IG5ldyBGYWNlYm9va1ByZXZpZXcoXG5cdFx0XHRnZXRTb2NpYWxQcmV2aWV3QXJncyggZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLCBmaWVsZFByZWZpeCgpICsgXCJfb3BlbmdyYXBoXCIgKSxcblx0XHRcdGkxOG5cblx0XHQpO1xuXG5cdFx0ZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJpbWFnZVVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNldFVwbG9hZEJ1dHRvblZhbHVlKCBcImZhY2Vib29rXCIsIGdldFVwbG9hZEJ1dHRvblRleHQoIGZhY2Vib29rUHJldmlldyApICk7XG5cdFx0XHRcdHNldEZhbGxiYWNrSW1hZ2UoIGZhY2Vib29rUHJldmlldyApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXcuaW5pdCgpO1xuXG5cdFx0YWRkVXBsb2FkQnV0dG9uKCBmYWNlYm9va1ByZXZpZXcgKTtcblxuXHRcdHZhciBwb3N0QXV0aG9yRHJvcGRvd24gPSAkKCBcIiNwb3N0X2F1dGhvcl9vdmVycmlkZVwiICk7XG5cdFx0aWYoIHBvc3RBdXRob3JEcm9wZG93bi5sZW5ndGggPiAwICkge1xuXHRcdFx0cG9zdEF1dGhvckRyb3Bkb3duLm9uKCBcImNoYW5nZVwiLCBnZXRGYWNlYm9va0F1dGhvci5iaW5kKCB0aGlzLCBmYWNlYm9va1ByZXZpZXcgKSApO1xuXHRcdFx0cG9zdEF1dGhvckRyb3Bkb3duLnRyaWdnZXIoIFwiY2hhbmdlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgdHdpdHRlciBwcmV2aWV3LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdHdpdHRlckhvbGRlciBUYXJnZXQgZWxlbWVudCBmb3IgYWRkaW5nIHRoZSB0d2l0dGVyIHByZXZpZXcuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFR3aXR0ZXIoIHR3aXR0ZXJIb2xkZXIgKSB7XG5cdFx0Y3JlYXRlU29jaWFsUHJldmlld0NvbnRhaW5lciggdHdpdHRlckhvbGRlciwgXCJ0d2l0dGVyUHJldmlld1wiICk7XG5cblx0XHR2YXIgdHdpdHRlclByZXZpZXdDb250YWluZXIgPSAkKCBcIiN0d2l0dGVyUHJldmlld1wiICk7XG5cdFx0dHdpdHRlclByZXZpZXcgPSBuZXcgVHdpdHRlclByZXZpZXcoXG5cdFx0XHRnZXRTb2NpYWxQcmV2aWV3QXJncyggdHdpdHRlclByZXZpZXdDb250YWluZXIsIGZpZWxkUHJlZml4KCkgKyBcIl90d2l0dGVyXCIgKSxcblx0XHRcdGkxOG5cblx0XHQpO1xuXG5cdFx0dHdpdHRlclByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImltYWdlVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0VXBsb2FkQnV0dG9uVmFsdWUoIFwidHdpdHRlclwiLCBnZXRVcGxvYWRCdXR0b25UZXh0KCB0d2l0dGVyUHJldmlldyApICk7XG5cdFx0XHRcdHNldEZhbGxiYWNrSW1hZ2UoIHR3aXR0ZXJQcmV2aWV3ICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHZhciBmYWNlYm9va1ByZXZpZXdDb250YWluZXIgPSAkKCBcIiNmYWNlYm9va1ByZXZpZXdcIiApO1xuXHRcdGZhY2Vib29rUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwidGl0bGVVcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdHR3aXR0ZXJUaXRsZUZhbGxiYWNrLmJpbmQoIHRoaXMsIHR3aXR0ZXJQcmV2aWV3IClcblx0XHQpO1xuXG5cdFx0ZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJkZXNjcmlwdGlvblVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0dHdpdHRlckRlc2NyaXB0aW9uRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKVxuXHRcdCk7XG5cblx0XHR0d2l0dGVyUHJldmlldy5pbml0KCk7XG5cblx0XHRhZGRVcGxvYWRCdXR0b24oIHR3aXR0ZXJQcmV2aWV3ICk7XG5cdFx0dHdpdHRlclRpdGxlRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICk7XG5cdFx0dHdpdHRlckRlc2NyaXB0aW9uRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICk7XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiB0d2l0dGVyIHRpdGxlIGlzIGVtcHR5LCB1c2UgdGhlIEZhY2Vib29rIHRpdGxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7VHdpdHRlclByZXZpZXd9IHR3aXR0ZXJQcmV2aWV3IFRoZSB0d2l0dGVyIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHdpdHRlclRpdGxlRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICkge1xuXHRcdHZhciAkdHdpdHRlclRpdGxlID0gJCggXCIjdHdpdHRlci1lZGl0b3ItdGl0bGVcIiApO1xuXHRcdHZhciB0d2l0dGVyVGl0bGUgPSAkdHdpdHRlclRpdGxlLnZhbCgpO1xuXHRcdGlmKCB0d2l0dGVyVGl0bGUgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhY2Vib29rVGl0bGUgPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVcIiApLnZhbCgpO1xuXHRcdGlmICggZmFjZWJvb2tUaXRsZSAhPT0gXCJcIiApIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldFRpdGxlKCBmYWNlYm9va1RpdGxlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldFRpdGxlKCAkdHdpdHRlclRpdGxlLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdHdpdHRlciBkZXNjcmlwdGlvbiBpcyBlbXB0eSwgdXNlIHRoZSBkZXNjcmlwdGlvbiB0aXRsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge1R3aXR0ZXJQcmV2aWV3fSB0d2l0dGVyUHJldmlldyBUaGUgdHdpdHRlciBwcmV2aWV3IG9iamVjdFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHR3aXR0ZXJEZXNjcmlwdGlvbkZhbGxiYWNrKCB0d2l0dGVyUHJldmlldyApIHtcblx0XHR2YXIgJHR3aXR0ZXJEZXNjcmlwdGlvbiA9ICQoIFwiI3R3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uXCIgKTtcblx0XHR2YXIgdHdpdHRlckRlc2NyaXB0aW9uID0gJHR3aXR0ZXJEZXNjcmlwdGlvbi52YWwoKTtcblx0XHRpZiggdHdpdHRlckRlc2NyaXB0aW9uICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBmYWNlYm9va0Rlc2NyaXB0aW9uID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIgKS52YWwoKTtcblx0XHRpZiAoIGZhY2Vib29rRGVzY3JpcHRpb24gIT09IFwiXCIgKSB7XG5cdFx0XHR0d2l0dGVyUHJldmlldy5zZXREZXNjcmlwdGlvbiggZmFjZWJvb2tEZXNjcmlwdGlvbiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0d2l0dGVyUHJldmlldy5zZXREZXNjcmlwdGlvbiggJHR3aXR0ZXJEZXNjcmlwdGlvbi5hdHRyKCBcInBsYWNlaG9sZGVyXCIgKSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIGZhbGxiYWNrIGltYWdlIGZvciB0aGUgcHJldmlldyBpZiBubyBpbWFnZSBoYXMgYmVlbiBzZXRcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHByZXZpZXcgUHJldmlldyB0byBzZXQgZmFsbGJhY2sgaW1hZ2Ugb24uXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuXHRmdW5jdGlvbiBzZXRGYWxsYmFja0ltYWdlKCBwcmV2aWV3ICkge1xuXHRcdGlmICggcHJldmlldy5kYXRhLmltYWdlVXJsID09PSBcIlwiICkge1xuXHRcdFx0cHJldmlldy5zZXRJbWFnZSggZ2V0RmFsbGJhY2tJbWFnZSggXCJcIiApICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoYW5nZXMgdGhlIHVwbG9hZCBidXR0b24gdmFsdWUgd2hlbiB0aGVyZSBhcmUgZmFsbGJhY2sgaW1hZ2VzIHByZXNlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBidXR0b25QcmVmaXggVGhlIHZhbHVlIGJlZm9yZSB0aGUgaWQgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgb24gdGhlIGJ1dHRvbi5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRVcGxvYWRCdXR0b25WYWx1ZSggYnV0dG9uUHJlZml4LCB0ZXh0ICkge1xuXHRcdCQoIFwiI1wiICArIGJ1dHRvblByZWZpeCArIFwiLWVkaXRvci1pbWFnZVVybF9idXR0b25cIiApLmh0bWwoIHRleHQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kIHRoZSBpbWFnZSBldmVudHMgdG8gc2V0IHRoZSBmYWxsYmFjayBhbmQgcmVuZGVyaW5nIHRoZSBwcmV2aWV3LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGJpbmRJbWFnZUV2ZW50cygpIHtcblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0YmluZEZlYXR1cmVkSW1hZ2VFdmVudHMoKTtcblx0XHR9XG5cblx0XHRiaW5kQ29udGVudEV2ZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgdGV4dCB0aGF0IHRoZSB1cGxvYWQgYnV0dG9uIG5lZWRzIHRvIGRpc3BsYXlcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHByZXZpZXcgUHJldmlldyB0byByZWFkIGltYWdlIGZyb20uXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgdGV4dCBmb3IgdGhlIGJ1dHRvbi5cbiAgICAgKi9cblx0ZnVuY3Rpb24gZ2V0VXBsb2FkQnV0dG9uVGV4dCggcHJldmlldyApIHtcblx0XHRyZXR1cm4gcHJldmlldy5kYXRhLmltYWdlVXJsID09PSBcIlwiID8geW9hc3RTb2NpYWxQcmV2aWV3LnVwbG9hZEltYWdlIDogeW9hc3RTb2NpYWxQcmV2aWV3LnVzZU90aGVySW1hZ2U7XG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgdGhlIGV2ZW50cyBmb3IgdGhlIGZlYXR1cmVkIGltYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGJpbmRGZWF0dXJlZEltYWdlRXZlbnRzKCkge1xuXHRcdGlmICggaXNVbmRlZmluZWQoIHdwLm1lZGlhICkgfHwgaXNVbmRlZmluZWQoIHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSBmZWF0dXJlZCBpbWFnZSBpcyBiZWluZyBjaGFuZ2VkXG5cdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSB3cC5tZWRpYS5mZWF0dXJlZEltYWdlLmZyYW1lKCk7XG5cblx0XHRmZWF0dXJlZEltYWdlLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbWFnZURldGFpbHMgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS5hdHRyaWJ1dGVzO1xuXG5cdFx0XHRjYW5SZWFkRmVhdHVyZWRJbWFnZSA9IHRydWU7XG5cblx0XHRcdHNldEZlYXR1cmVkSW1hZ2UoIGltYWdlRGV0YWlscy51cmwgKTtcblx0XHR9ICk7XG5cblx0XHQkKCBcIiNwb3N0aW1hZ2VkaXZcIiApLm9uKCBcImNsaWNrXCIsIFwiI3JlbW92ZS1wb3N0LXRodW1ibmFpbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdGNhblJlYWRGZWF0dXJlZEltYWdlID0gZmFsc2U7XG5cblx0XHRcdGNsZWFyRmVhdHVyZWRJbWFnZSgpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kIHRoZSBldmVudHMgZm9yIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGJpbmRDb250ZW50RXZlbnRzKCkge1xuXHRcdC8vIEJpbmQgdGhlIGV2ZW50IHdoZW4gc29tZXRoaW5nIGNoYW5nZWQgaW4gdGhlIHRleHQgZWRpdG9yLlxuXHRcdHZhciBjb250ZW50RWxlbWVudCA9ICQoIFwiI1wiICsgY29udGVudFRleHROYW1lKCkgKTtcblx0XHRpZiAoIGNvbnRlbnRFbGVtZW50Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRjb250ZW50RWxlbWVudC5vbiggXCJpbnB1dFwiLCBkZXRlY3RJbWFnZUZhbGxiYWNrICk7XG5cdFx0fVxuXG5cdFx0Ly8gQmluZCB0aGUgZXZlbnRzIHdoZW4gc29tZXRoaW5nIGNoYW5nZWQgaW4gdGhlIHRpbnlNQ0UgZWRpdG9yLlxuXHRcdGlmICggdHlwZW9mIHRpbnlNQ0UgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRpbnlNQ0Uub24gPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdHZhciBldmVudHMgPSBbIFwiaW5wdXRcIiwgXCJjaGFuZ2VcIiwgXCJjdXRcIiwgXCJwYXN0ZVwiIF07XG5cdFx0XHR0aW55TUNFLm9uKCBcImFkZEVkaXRvclwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdGUuZWRpdG9yLm9uKCBldmVudHNbIGkgXSwgZGV0ZWN0SW1hZ2VGYWxsYmFjayApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGZlYXR1cmVkIGltYWdlIGZhbGxiYWNrIHZhbHVlIGFzIGFuIGVtcHR5IHZhbHVlIGFuZCBydW5zIHRoZSBmYWxsYmFjayBtZXRob2QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2xlYXJGZWF0dXJlZEltYWdlKCkge1xuXHRcdHNldEZlYXR1cmVkSW1hZ2UoIFwiXCIgKTtcblx0XHRkZXRlY3RJbWFnZUZhbGxiYWNrKCk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgaW1hZ2UgZmFsbGJhY2tzIGxpa2UgdGhlIGZlYXR1cmVkIGltYWdlIChpbiBjYXNlIG9mIGEgcG9zdCkgYW5kIHRoZSBjb250ZW50IGltYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRldGVjdEltYWdlRmFsbGJhY2soKSB7XG5cdFx0Ly8gSW4gY2FzZSBvZiBhIHBvc3Q6IHdlIHdhbnQgdG8gaGF2ZSB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdFx0aWYgKCBnZXRDdXJyZW50VHlwZSgpID09PSBcInBvc3RcIiApIHtcblx0XHRcdHZhciBmZWF0dXJlZEltYWdlID0gZ2V0RmVhdHVyZWRJbWFnZSgpO1xuXHRcdFx0c2V0RmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApO1xuXG5cdFx0XHRpZiAoIGZlYXR1cmVkSW1hZ2UgIT09IFwiXCIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzZXRDb250ZW50SW1hZ2UoIGdldENvbnRlbnRJbWFnZSggZnVuY3Rpb24oIGltYWdlICkge1xuXHRcdFx0c2V0Q29udGVudEltYWdlKCBpbWFnZSApO1xuXHRcdH0gKSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGZlYXR1cmVkIGltYWdlIGJhc2VkIG9uIHRoZSBnaXZlbiBpbWFnZSBVUkwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmZWF0dXJlZEltYWdlIFRoZSBpbWFnZSB3ZSB3YW50IHRvIHNldC5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICkge1xuXHRcdGlmICggaW1hZ2VGYWxsQmFjay5mZWF0dXJlZCAhPT0gZmVhdHVyZWRJbWFnZSApIHtcblx0XHRcdGltYWdlRmFsbEJhY2suZmVhdHVyZWQgPSBmZWF0dXJlZEltYWdlO1xuXG5cdFx0XHQvLyBKdXN0IHJlZnJlc2ggdGhlIGltYWdlIFVSTC5cblx0XHRcdCQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiaW1hZ2VVcGRhdGVcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb250ZW50IGltYWdlIGJhc2Ugb24gdGhlIGdpdmVuIGltYWdlIFVSTFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudEltYWdlIFRoZSBpbWFnZSB3ZSB3YW50IHRvIHNldC5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRDb250ZW50SW1hZ2UoIGNvbnRlbnRJbWFnZSApIHtcblx0XHRpZiAoIGltYWdlRmFsbEJhY2suY29udGVudCAhPT0gY29udGVudEltYWdlICkge1xuXHRcdFx0aW1hZ2VGYWxsQmFjay5jb250ZW50ID0gY29udGVudEltYWdlO1xuXG5cdFx0XHQvLyBKdXN0IHJlZnJlc2ggdGhlIGltYWdlIFVSTC5cblx0XHRcdCQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiaW1hZ2VVcGRhdGVcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBmZWF0dXJlZCBpbWFnZSBzb3VyY2UgZnJvbSB0aGUgRE9NLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdXJsIHRvIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEZlYXR1cmVkSW1hZ2UoKSB7XG5cdFx0aWYgKCBjYW5SZWFkRmVhdHVyZWRJbWFnZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cblx0XHR2YXIgcG9zdFRodW1ibmFpbCA9ICQoIFwiLmF0dGFjaG1lbnQtcG9zdC10aHVtYm5haWxcIiApO1xuXHRcdGlmICggcG9zdFRodW1ibmFpbC5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuICQoIHBvc3RUaHVtYm5haWwuZ2V0KCAwICkgKS5hdHRyKCBcInNyY1wiICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgaW1hZ2UgZnJvbSB0aGUgY29udGVudC5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCBpZiBhIGJpZ2dlciBzaXplIGlzIGF2YWlsYWJsZS5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGZpcnN0IGltYWdlIGZvdW5kIGluIHRoZSBjb250ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0Q29udGVudEltYWdlKCBjYWxsYmFjayApIHtcblx0XHR2YXIgY29udGVudCA9IGdldENvbnRlbnQoKTtcblxuXHRcdHZhciBpbWFnZXMgPSBnZXRJbWFnZXMoIGNvbnRlbnQgKTtcblx0XHR2YXIgaW1hZ2UgID0gXCJcIjtcblxuXHRcdGlmICggaW1hZ2VzLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybiBpbWFnZTtcblx0XHR9XG5cblx0XHRkbyB7XG5cdFx0XHR2YXIgY3VycmVudEltYWdlID0gaW1hZ2VzLnNoaWZ0KCk7XG5cdFx0XHRjdXJyZW50SW1hZ2UgPSAkKCBjdXJyZW50SW1hZ2UgKTtcblxuXHRcdFx0dmFyIGltYWdlU291cmNlID0gY3VycmVudEltYWdlLnByb3AoIFwic3JjXCIgKTtcblxuXHRcdFx0aWYgKCBpbWFnZVNvdXJjZSApIHtcblx0XHRcdFx0aW1hZ2UgPSBpbWFnZVNvdXJjZTtcblx0XHRcdH1cblx0XHR9IHdoaWxlICggXCJcIiA9PT0gaW1hZ2UgJiYgaW1hZ2VzLmxlbmd0aCA+IDAgKTtcblxuXHRcdGltYWdlID0gZ2V0QmlnZ2VySW1hZ2UoIGltYWdlLCBjYWxsYmFjayApO1xuXG5cdFx0cmV0dXJuIGltYWdlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyeSB0byByZXRyaWV2ZSBhIGJpZ2dlciBpbWFnZSBmb3IgYSBjZXJ0YWluIGltYWdlIGZvdW5kIGluIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gICB1cmwgICAgICBUaGUgVVJMIHRvIHJldHJpZXZlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gY2FsbCBpZiB0aGVyZSBpcyBhIGJpZ2dlciBpbWFnZS5cblx0ICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYmlnZ2VyIGltYWdlIHVybC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEJpZ2dlckltYWdlKCB1cmwsIGNhbGxiYWNrICkge1xuXHRcdGlmICggX2hhcyggYmlnZ2VySW1hZ2VzLCB1cmwgKSApIHtcblx0XHRcdHJldHVybiBiaWdnZXJJbWFnZXNbIHVybCBdO1xuXHRcdH1cblxuXHRcdHJldHJpZXZlSW1hZ2VEYXRhRnJvbVVSTCggdXJsLCBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdFx0XHRiaWdnZXJJbWFnZXNbIHVybCBdID0gaW1hZ2VVcmw7XG5cblx0XHRcdGNhbGxiYWNrKCBpbWFnZVVybCApO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiB1cmw7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBpbWFnZSBtZXRhZGF0YSBmcm9tIGFuIGltYWdlIHVybCBhbmQgc2F2ZXMgaXQgdG8gdGhlIGltYWdlIG1hbmFnZXIgYWZ0ZXJ3YXJkc1xuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBpbWFnZSBVUkwgdG8gcmV0cmlldmUgdGhlIG1ldGFkYXRhIGZyb20uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRvIGNhbGwgd2l0aCB0aGUgaW1hZ2UgVVJMIHJlc3VsdC5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiByZXRyaWV2ZUltYWdlRGF0YUZyb21VUkwoIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0JC5nZXRKU09OKCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwicmV0cmlldmVfaW1hZ2VfZGF0YV9mcm9tX3VybFwiLFxuXHRcdFx0aW1hZ2VVUkw6IHVybCxcblx0XHR9LCBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRpZiAoIFwic3VjY2Vzc1wiID09PSByZXNwb25zZS5zdGF0dXMgKSB7XG5cdFx0XHRcdGNhbGxiYWNrKCByZXNwb25zZS5yZXN1bHQgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgY29udGVudCBmcm9tIGN1cnJlbnQgdmlzaWJsZSBjb250ZW50IGVkaXRvclxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdmFsdWUgb2YgdGhlIHRpbnltY2UgYm94LlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0Q29udGVudCgpIHtcblx0XHRpZiAoIGlzVGlueU1DRUF2YWlsYWJsZSgpICkge1xuXHRcdFx0cmV0dXJuIHRpbnlNQ0UuZ2V0KCBjb250ZW50VGV4dE5hbWUoKSApLmdldENvbnRlbnQoKTtcblx0XHR9XG5cblx0XHR2YXIgY29udGVudEVsZW1lbnQgPSAkKCBcIiNcIiArIGNvbnRlbnRUZXh0TmFtZSgpICk7XG5cdFx0aWYgKCBjb250ZW50RWxlbWVudC5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuIGNvbnRlbnRFbGVtZW50LnZhbCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHRpbnltY2UgaXMgYWN0aXZlIG9uIHRoZSBjdXJyZW50IHBhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gdGlueW1jZSBpcyBhdmFpbGFibGUuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1RpbnlNQ0VBdmFpbGFibGUoKSB7XG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuXHRcdFx0dHlwZW9mIHRpbnlNQ0UuZWRpdG9ycyA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuXHRcdFx0dGlueU1DRS5lZGl0b3JzLmxlbmd0aCA9PT0gMCB8fFxuXHRcdFx0dGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICkgPT09IG51bGwgfHxcblx0XHRcdHRpbnlNQ0UuZ2V0KCBjb250ZW50VGV4dE5hbWUoKSAgKS5pc0hpZGRlbigpICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHRoZXJlIGlzIGEgZmFsbGJhY2sgaW1hZ2UgbGlrZSB0aGUgZmVhdHVyZWQgaW1hZ2Ugb3IgdGhlIGZpcnN0IGltYWdlIGluIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGVmYXVsdEltYWdlIFRoZSBkZWZhdWx0IGltYWdlIHdoZW4gbm90aGluZyBoYXMgYmVlbiBmb3VuZC5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGltYWdlIHRvIHVzZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEZhbGxiYWNrSW1hZ2UoIGRlZmF1bHRJbWFnZSApIHtcblx0XHQvLyBUd2l0dGVyIGFsd2F5cyBmaXJzdCBmYWxscyBiYWNrIHRvIEZhY2Vib29rXG5cdFx0aWYgKCAhIGlzVW5kZWZpbmVkKCBmYWNlYm9va1ByZXZpZXcgKSAmJiBmYWNlYm9va1ByZXZpZXcuZGF0YS5pbWFnZVVybCAhPT0gXCJcIiApIHtcblx0XHRcdHJldHVybiBmYWNlYm9va1ByZXZpZXcuZGF0YS5pbWFnZVVybDtcblx0XHR9XG5cblx0XHQvLyBJbiBjYXNlIG9mIGFuIHBvc3Q6IHdlIHdhbnQgdG8gaGF2ZSB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdFx0aWYgKCBnZXRDdXJyZW50VHlwZSgpID09PSBcInBvc3RcIiApIHtcblx0XHRcdGlmICggaW1hZ2VGYWxsQmFjay5mZWF0dXJlZCAhPT0gXCJcIiApIHtcblx0XHRcdFx0cmV0dXJuIGltYWdlRmFsbEJhY2suZmVhdHVyZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUgZmVhdHVyZWQgaW1hZ2UgaXMgZW1wdHksIHRyeSBhbiBpbWFnZSBpbiB0aGUgY29udGVudFxuXHRcdGlmICggaW1hZ2VGYWxsQmFjay5jb250ZW50ICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuIGltYWdlRmFsbEJhY2suY29udGVudDtcblx0XHR9XG5cblx0XHRpZiAoIGRlZmF1bHRJbWFnZSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRJbWFnZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSBoZWxwIHBhbmVscyB0byB0aGUgc29jaWFsIHByZXZpZXdzXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkSGVscFBhbmVscygpIHtcblx0XHR2YXIgcGFuZWxzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiNmYWNlYm9vay1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24uZmFjZWJvb2tJbWFnZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC5mYWNlYm9va0ltYWdlLFxuXHRcdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItaW1hZ2UtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLmZhY2Vib29rVGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAuZmFjZWJvb2tUaXRsZSxcblx0XHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLXRpdGxlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI2ZhY2Vib29rLWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi5mYWNlYm9va0Rlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLmZhY2Vib29rRGVzY3JpcHRpb24sXG5cdFx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1kZXNjcmlwdGlvbi1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiN0d2l0dGVyLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi50d2l0dGVySW1hZ2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAudHdpdHRlckltYWdlLFxuXHRcdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1pbWFnZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiN0d2l0dGVyLWVkaXRvci10aXRsZVwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi50d2l0dGVyVGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAudHdpdHRlclRpdGxlLFxuXHRcdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci10aXRsZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi50d2l0dGVyRGVzY3JpcHRpb24sXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAudHdpdHRlckRlc2NyaXB0aW9uLFxuXHRcdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvbi1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdF07XG5cblx0XHRmb3JFYWNoKCBwYW5lbHMsIGZ1bmN0aW9uKCBwYW5lbCApIHtcblx0XHRcdCQoIHBhbmVsLmJlZm9yZUVsZW1lbnQgKS5iZWZvcmUoXG5cdFx0XHRcdGhlbHBQYW5lbC5oZWxwQnV0dG9uKCBwYW5lbC5idXR0b25UZXh0LCBwYW5lbC5pZCApICtcblx0XHRcdFx0aGVscFBhbmVsLmhlbHBUZXh0KCBwYW5lbC5kZXNjcmlwdGlvblRleHQsIHBhbmVsLmlkIClcblx0XHRcdCk7XG5cdFx0fSApO1xuXG5cdFx0JCggXCIuc25pcHBldC1lZGl0b3JfX2Zvcm1cIiApLm9uKCBcImNsaWNrXCIsIFwiLnlvYXN0LWhlbHAtYnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRidXR0b24gPSAkKCB0aGlzICksXG5cdFx0XHRcdGhlbHBQYW5lbCA9ICQoIFwiI1wiICsgJGJ1dHRvbi5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApICksXG5cdFx0XHRcdGlzUGFuZWxWaXNpYmxlID0gaGVscFBhbmVsLmlzKCBcIjp2aXNpYmxlXCIgKTtcblxuXHRcdFx0JCggaGVscFBhbmVsICkuc2xpZGVUb2dnbGUoIDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRidXR0b24uYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsICEgaXNQYW5lbFZpc2libGUgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBsaWJyYXJ5IHRyYW5zbGF0aW9uc1xuXHQgKiBAcGFyYW0ge09iamVjdH0gdHJhbnNsYXRpb25zIFRoZSB0cmFuc2xhdGlvbnMgdG8gdXNlLlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSB0cmFuc2xhdGlvbnMgbWFwcGVkIHRvIHRoZSBwcm9wZXIgZG9tYWluLlxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkTGlicmFyeVRyYW5zbGF0aW9ucyggdHJhbnNsYXRpb25zICkge1xuXHRcdGlmICggdHlwZW9mIHRyYW5zbGF0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdHJhbnNsYXRpb25zLmRvbWFpbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHRyYW5zbGF0aW9ucy5kb21haW4gPSBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiO1xuXHRcdFx0dHJhbnNsYXRpb25zLmxvY2FsZV9kYXRhWyBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiIF0gPSBjbG9uZSggdHJhbnNsYXRpb25zLmxvY2FsZV9kYXRhWyBcIndvcmRwcmVzcy1zZW8tcHJlbWl1bVwiIF0gKTtcblxuXHRcdFx0ZGVsZXRlKCB0cmFuc2xhdGlvbnMubG9jYWxlX2RhdGFbIFwid29yZHByZXNzLXNlby1wcmVtaXVtXCIgXSApO1xuXG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRpb25zO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRkb21haW46IFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsXG5cdFx0XHRsb2NhbGVfZGF0YToge1xuXHRcdFx0XHRcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiOiB7XG5cdFx0XHRcdFx0XCJcIjoge30sXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgc29jaWFsIHByZXZpZXdzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRZb2FzdFNvY2lhbFByZXZpZXdzKCkge1xuXHRcdHZhciBmYWNlYm9va0hvbGRlciA9ICQoIFwiI3dwc2VvX2ZhY2Vib29rXCIgKTtcblx0XHR2YXIgdHdpdHRlckhvbGRlciA9ICQoIFwiI3dwc2VvX3R3aXR0ZXJcIiApO1xuXG5cdFx0aWYgKCBmYWNlYm9va0hvbGRlci5sZW5ndGggPiAwIHx8IHR3aXR0ZXJIb2xkZXIubGVuZ3RoID4gMCApIHtcblx0XHRcdGpRdWVyeSggd2luZG93ICkub24oIFwiWW9hc3RTRU86cmVhZHlcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRldGVjdEltYWdlRmFsbGJhY2soKTtcblxuXHRcdFx0XHRpZiAoIGZhY2Vib29rSG9sZGVyLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0aW5pdEZhY2Vib29rKCBmYWNlYm9va0hvbGRlciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB0d2l0dGVySG9sZGVyLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0aW5pdFR3aXR0ZXIoIHR3aXR0ZXJIb2xkZXIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFkZEhlbHBQYW5lbHMoKTtcblx0XHRcdFx0YmluZEltYWdlRXZlbnRzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0JCggaW5pdFlvYXN0U29jaWFsUHJldmlld3MgKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKipcbiAqIEBwcmVzZXJ2ZSBqZWQuanMgaHR0cHM6Ly9naXRodWIuY29tL1NsZXhBeHRvbi9KZWRcbiAqL1xuLypcbi0tLS0tLS0tLS0tXG5BIGdldHRleHQgY29tcGF0aWJsZSBpMThuIGxpYnJhcnkgZm9yIG1vZGVybiBKYXZhU2NyaXB0IEFwcGxpY2F0aW9uc1xuXG5ieSBBbGV4IFNleHRvbiAtIEFsZXhTZXh0b24gW2F0XSBnbWFpbCAtIEBTbGV4QXh0b25cblxuTUlUIExpY2Vuc2VcblxuQSBqUXVlcnkgRm91bmRhdGlvbiBwcm9qZWN0IC0gcmVxdWlyZXMgQ0xBIHRvIGNvbnRyaWJ1dGUgLVxuaHR0cHM6Ly9jb250cmlidXRlLmpxdWVyeS5vcmcvQ0xBL1xuXG5cblxuSmVkIG9mZmVycyB0aGUgZW50aXJlIGFwcGxpY2FibGUgR05VIGdldHRleHQgc3BlYydkIHNldCBvZlxuZnVuY3Rpb25zLCBidXQgYWxzbyBvZmZlcnMgc29tZSBuaWNlciB3cmFwcGVycyBhcm91bmQgdGhlbS5cblRoZSBhcGkgZm9yIGdldHRleHQgd2FzIHdyaXR0ZW4gZm9yIGEgbGFuZ3VhZ2Ugd2l0aCBubyBmdW5jdGlvblxub3ZlcmxvYWRpbmcsIHNvIEplZCBhbGxvd3MgYSBsaXR0bGUgbW9yZSBvZiB0aGF0LlxuXG5NYW55IHRoYW5rcyB0byBKb3NodWEgSS4gTWlsbGVyIC0gdW5ydHN0QGNwYW4ub3JnIC0gd2hvIHdyb3RlXG5nZXR0ZXh0LmpzIGJhY2sgaW4gMjAwOC4gSSB3YXMgYWJsZSB0byB2ZXQgYSBsb3Qgb2YgbXkgaWRlYXNcbmFnYWluc3QgaGlzLiBJIGFsc28gbWFkZSBzdXJlIEplZCBwYXNzZWQgYWdhaW5zdCBoaXMgdGVzdHNcbmluIG9yZGVyIHRvIG9mZmVyIGVhc3kgdXBncmFkZXMgLS0ganNnZXR0ZXh0LmJlcmxpb3MuZGVcbiovXG4oZnVuY3Rpb24gKHJvb3QsIHVuZGVmKSB7XG5cbiAgLy8gU2V0IHVwIHNvbWUgdW5kZXJzY29yZS1zdHlsZSBmdW5jdGlvbnMsIGlmIHlvdSBhbHJlYWR5IGhhdmVcbiAgLy8gdW5kZXJzY29yZSwgZmVlbCBmcmVlIHRvIGRlbGV0ZSB0aGlzIHNlY3Rpb24sIGFuZCB1c2UgaXRcbiAgLy8gZGlyZWN0bHksIGhvd2V2ZXIsIHRoZSBhbW91bnQgb2YgZnVuY3Rpb25zIHVzZWQgZG9lc24ndFxuICAvLyB3YXJyYW50IGhhdmluZyB1bmRlcnNjb3JlIGFzIGEgZnVsbCBkZXBlbmRlbmN5LlxuICAvLyBVbmRlcnNjb3JlIDEuMy4wIHdhcyB1c2VkIHRvIHBvcnQgYW5kIGlzIGxpY2Vuc2VkXG4gIC8vIHVuZGVyIHRoZSBNSVQgTGljZW5zZSBieSBKZXJlbXkgQXNoa2VuYXMuXG4gIHZhciBBcnJheVByb3RvICAgID0gQXJyYXkucHJvdG90eXBlLFxuICAgICAgT2JqUHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICBzbGljZSAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIGhhc093blByb3AgICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgIG5hdGl2ZUZvckVhY2ggPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgICBicmVha2VyICAgICAgID0ge307XG5cbiAgLy8gV2UncmUgbm90IHVzaW5nIHRoZSBPT1Agc3R5bGUgXyBzbyB3ZSBkb24ndCBuZWVkIHRoZVxuICAvLyBleHRyYSBsZXZlbCBvZiBpbmRpcmVjdGlvbi4gVGhpcyBzdGlsbCBtZWFucyB0aGF0IHlvdVxuICAvLyBzdWIgb3V0IGZvciByZWFsIGBfYCB0aG91Z2guXG4gIHZhciBfID0ge1xuICAgIGZvckVhY2ggOiBmdW5jdGlvbiggb2JqLCBpdGVyYXRvciwgY29udGV4dCApIHtcbiAgICAgIHZhciBpLCBsLCBrZXk7XG4gICAgICBpZiAoIG9iaiA9PT0gbnVsbCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2ggKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKCBpdGVyYXRvciwgY29udGV4dCApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoICkge1xuICAgICAgICBmb3IgKCBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgaWYgKCBpIGluIG9iaiAmJiBpdGVyYXRvci5jYWxsKCBjb250ZXh0LCBvYmpbaV0sIGksIG9iaiApID09PSBicmVha2VyICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAoIGtleSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoIGhhc093blByb3AuY2FsbCggb2JqLCBrZXkgKSApIHtcbiAgICAgICAgICAgIGlmICggaXRlcmF0b3IuY2FsbCAoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqICkgPT09IGJyZWFrZXIgKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGV4dGVuZCA6IGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICB0aGlzLmZvckVhY2goIHNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLCBmdW5jdGlvbiAoIHNvdXJjZSApIHtcbiAgICAgICAgZm9yICggdmFyIHByb3AgaW4gc291cmNlICkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfTtcbiAgLy8gRU5EIE1pbmlhdHVyZSB1bmRlcnNjb3JlIGltcGxcblxuICAvLyBKZWQgaXMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvblxuICB2YXIgSmVkID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgIC8vIFNvbWUgbWluaW1hbCBkZWZhdWx0c1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBcImxvY2FsZV9kYXRhXCIgOiB7XG4gICAgICAgIFwibWVzc2FnZXNcIiA6IHtcbiAgICAgICAgICBcIlwiIDoge1xuICAgICAgICAgICAgXCJkb21haW5cIiAgICAgICA6IFwibWVzc2FnZXNcIixcbiAgICAgICAgICAgIFwibGFuZ1wiICAgICAgICAgOiBcImVuXCIsXG4gICAgICAgICAgICBcInBsdXJhbF9mb3Jtc1wiIDogXCJucGx1cmFscz0yOyBwbHVyYWw9KG4gIT0gMSk7XCJcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVGhlcmUgYXJlIG5vIGRlZmF1bHQga2V5cywgdGhvdWdoXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBUaGUgZGVmYXVsdCBkb21haW4gaWYgb25lIGlzIG1pc3NpbmdcbiAgICAgIFwiZG9tYWluXCIgOiBcIm1lc3NhZ2VzXCIsXG4gICAgICAvLyBlbmFibGUgZGVidWcgbW9kZSB0byBsb2cgdW50cmFuc2xhdGVkIHN0cmluZ3MgdG8gdGhlIGNvbnNvbGVcbiAgICAgIFwiZGVidWdcIiA6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIE1peCBpbiB0aGUgc2VudCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9uc1xuICAgIHRoaXMub3B0aW9ucyA9IF8uZXh0ZW5kKCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyApO1xuICAgIHRoaXMudGV4dGRvbWFpbiggdGhpcy5vcHRpb25zLmRvbWFpbiApO1xuXG4gICAgaWYgKCBvcHRpb25zLmRvbWFpbiAmJiAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgdGhpcy5vcHRpb25zLmRvbWFpbiBdICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZXh0IGRvbWFpbiBzZXQgdG8gbm9uLWV4aXN0ZW50IGRvbWFpbjogYCcgKyBvcHRpb25zLmRvbWFpbiArICdgJyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBnZXR0ZXh0IHNwZWMgc2V0cyB0aGlzIGNoYXJhY3RlciBhcyB0aGUgZGVmYXVsdFxuICAvLyBkZWxpbWl0ZXIgZm9yIGNvbnRleHQgbG9va3Vwcy5cbiAgLy8gZS5nLjogY29udGV4dFxcdTAwMDRrZXlcbiAgLy8gSWYgeW91ciB0cmFuc2xhdGlvbiBjb21wYW55IHVzZXMgc29tZXRoaW5nIGRpZmZlcmVudCxcbiAgLy8ganVzdCBjaGFuZ2UgdGhpcyBhdCBhbnkgdGltZSBhbmQgaXQgd2lsbCB1c2UgdGhhdCBpbnN0ZWFkLlxuICBKZWQuY29udGV4dF9kZWxpbWl0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCA0ICk7XG5cbiAgZnVuY3Rpb24gZ2V0UGx1cmFsRm9ybUZ1bmMgKCBwbHVyYWxfZm9ybV9zdHJpbmcgKSB7XG4gICAgcmV0dXJuIEplZC5QRi5jb21waWxlKCBwbHVyYWxfZm9ybV9zdHJpbmcgfHwgXCJucGx1cmFscz0yOyBwbHVyYWw9KG4gIT0gMSk7XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gQ2hhaW4oIGtleSwgaTE4biApe1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICB0aGlzLl9pMThuID0gaTE4bjtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIGNoYWluYWJsZSBhcGkgZm9yIGFkZGluZyBhcmdzIHByZXR0aWx5XG4gIF8uZXh0ZW5kKCBDaGFpbi5wcm90b3R5cGUsIHtcbiAgICBvbkRvbWFpbiA6IGZ1bmN0aW9uICggZG9tYWluICkge1xuICAgICAgdGhpcy5fZG9tYWluID0gZG9tYWluO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB3aXRoQ29udGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCApIHtcbiAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpZlBsdXJhbCA6IGZ1bmN0aW9uICggbnVtLCBwa2V5ICkge1xuICAgICAgdGhpcy5fdmFsID0gbnVtO1xuICAgICAgdGhpcy5fcGtleSA9IHBrZXk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGZldGNoIDogZnVuY3Rpb24gKCBzQXJyICkge1xuICAgICAgaWYgKCB7fS50b1N0cmluZy5jYWxsKCBzQXJyICkgIT0gJ1tvYmplY3QgQXJyYXldJyApIHtcbiAgICAgICAgc0FyciA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoIHNBcnIgJiYgc0Fyci5sZW5ndGggPyBKZWQuc3ByaW50ZiA6IGZ1bmN0aW9uKHgpeyByZXR1cm4geDsgfSApKFxuICAgICAgICB0aGlzLl9pMThuLmRjbnBnZXR0ZXh0KHRoaXMuX2RvbWFpbiwgdGhpcy5fY29udGV4dCwgdGhpcy5fa2V5LCB0aGlzLl9wa2V5LCB0aGlzLl92YWwpLFxuICAgICAgICBzQXJyXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQWRkIGZ1bmN0aW9ucyB0byB0aGUgSmVkIHByb3RvdHlwZS5cbiAgLy8gVGhlc2Ugd2lsbCBiZSB0aGUgZnVuY3Rpb25zIG9uIHRoZSBvYmplY3QgdGhhdCdzIHJldHVybmVkXG4gIC8vIGZyb20gY3JlYXRpbmcgYSBgbmV3IEplZCgpYFxuICAvLyBUaGVzZSBzZWVtIHJlZHVuZGFudCwgYnV0IHRoZXkgZ3ppcCBwcmV0dHkgd2VsbC5cbiAgXy5leHRlbmQoIEplZC5wcm90b3R5cGUsIHtcbiAgICAvLyBUaGUgc2V4aWVyIGFwaSBzdGFydCBwb2ludFxuICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgcmV0dXJuIG5ldyBDaGFpbigga2V5LCB0aGlzICk7XG4gICAgfSxcblxuICAgIHRleHRkb21haW4gOiBmdW5jdGlvbiAoIGRvbWFpbiApIHtcbiAgICAgIGlmICggISBkb21haW4gKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0ZG9tYWluO1xuICAgICAgfVxuICAgICAgdGhpcy5fdGV4dGRvbWFpbiA9IGRvbWFpbjtcbiAgICB9LFxuXG4gICAgZ2V0dGV4dCA6IGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwga2V5ICkge1xuICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGNnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4gLCBrZXkgLyosIGNhdGVnb3J5ICovICkge1xuICAgICAgLy8gSWdub3JlcyB0aGUgY2F0ZWdvcnkgYW55d2F5c1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIG5nZXR0ZXh0IDogZnVuY3Rpb24gKCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkbmdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRjbmdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgc2tleSwgcGtleSwgdmFsLyosIGNhdGVnb3J5ICovKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgcGdldHRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQsIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZHBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIGRjcGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwga2V5LyosIGNhdGVnb3J5ICovKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBucGdldHRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZG5wZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICAvLyBUaGUgbW9zdCBmdWxseSBxdWFsaWZpZWQgZ2V0dGV4dCBmdW5jdGlvbi4gSXQgaGFzIGV2ZXJ5IG9wdGlvbi5cbiAgICAvLyBTaW5jZSBpdCBoYXMgZXZlcnkgb3B0aW9uLCB3ZSBjYW4gdXNlIGl0IGZyb20gZXZlcnkgb3RoZXIgbWV0aG9kLlxuICAgIC8vIFRoaXMgaXMgdGhlIGJyZWFkIGFuZCBidXR0ZXIuXG4gICAgLy8gVGVjaG5pY2FsbHkgdGhlcmUgc2hvdWxkIGJlIG9uZSBtb3JlIGFyZ3VtZW50IGluIHRoaXMgZnVuY3Rpb24gZm9yICdDYXRlZ29yeScsXG4gICAgLy8gYnV0IHNpbmNlIHdlIG5ldmVyIHVzZSBpdCwgd2UgbWlnaHQgYXMgd2VsbCBub3Qgd2FzdGUgdGhlIGJ5dGVzIHRvIGRlZmluZSBpdC5cbiAgICBkY25wZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXksIHZhbCApIHtcbiAgICAgIC8vIFNldCBzb21lIGRlZmF1bHRzXG5cbiAgICAgIHBsdXJhbF9rZXkgPSBwbHVyYWxfa2V5IHx8IHNpbmd1bGFyX2tleTtcblxuICAgICAgLy8gVXNlIHRoZSBnbG9iYWwgZG9tYWluIGRlZmF1bHQgaWYgb25lXG4gICAgICAvLyBpc24ndCBleHBsaWNpdGx5IHBhc3NlZCBpblxuICAgICAgZG9tYWluID0gZG9tYWluIHx8IHRoaXMuX3RleHRkb21haW47XG5cbiAgICAgIHZhciBmYWxsYmFjaztcblxuICAgICAgLy8gSGFuZGxlIHNwZWNpYWwgY2FzZXNcblxuICAgICAgLy8gTm8gb3B0aW9ucyBmb3VuZFxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucyApIHtcbiAgICAgICAgLy8gVGhlcmUncyBsaWtlbHkgc29tZXRoaW5nIHdyb25nLCBidXQgd2UnbGwgcmV0dXJuIHRoZSBjb3JyZWN0IGtleSBmb3IgZW5nbGlzaFxuICAgICAgICAvLyBXZSBkbyB0aGlzIGJ5IGluc3RhbnRpYXRpbmcgYSBicmFuZCBuZXcgSmVkIGluc3RhbmNlIHdpdGggdGhlIGRlZmF1bHQgc2V0XG4gICAgICAgIC8vIGZvciBldmVyeXRoaW5nIHRoYXQgY291bGQgYmUgYnJva2VuLlxuICAgICAgICBmYWxsYmFjayA9IG5ldyBKZWQoKTtcbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrLmRjbnBnZXR0ZXh0LmNhbGwoIGZhbGxiYWNrLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5LCB2YWwgKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gdHJhbnNsYXRpb24gZGF0YSBwcm92aWRlZFxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBsb2NhbGUgZGF0YSBwcm92aWRlZC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgZG9tYWluIF0gKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9tYWluIGAnICsgZG9tYWluICsgJ2Agd2FzIG5vdCBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhIHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YVsgZG9tYWluIF1bIFwiXCIgXSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBsb2NhbGUgbWV0YSBpbmZvcm1hdGlvbiBwcm92aWRlZC4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYSB0cnV0aHkga2V5LiBPdGhlcndpc2Ugd2UgbWlnaHQgc3RhcnQgbG9va2luZ1xuICAgICAgLy8gaW50byB0aGUgZW1wdHkgc3RyaW5nIGtleSwgd2hpY2ggaXMgdGhlIG9wdGlvbnMgZm9yIHRoZSBsb2NhbGVcbiAgICAgIC8vIGRhdGEuXG4gICAgICBpZiAoICEgc2luZ3VsYXJfa2V5ICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHRyYW5zbGF0aW9uIGtleSBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGtleSAgPSBjb250ZXh0ID8gY29udGV4dCArIEplZC5jb250ZXh0X2RlbGltaXRlciArIHNpbmd1bGFyX2tleSA6IHNpbmd1bGFyX2tleSxcbiAgICAgICAgICBsb2NhbGVfZGF0YSA9IHRoaXMub3B0aW9ucy5sb2NhbGVfZGF0YSxcbiAgICAgICAgICBkaWN0ID0gbG9jYWxlX2RhdGFbIGRvbWFpbiBdLFxuICAgICAgICAgIGRlZmF1bHRDb25mID0gKGxvY2FsZV9kYXRhLm1lc3NhZ2VzIHx8IHRoaXMuZGVmYXVsdHMubG9jYWxlX2RhdGEubWVzc2FnZXMpW1wiXCJdLFxuICAgICAgICAgIHBsdXJhbEZvcm1zID0gZGljdFtcIlwiXS5wbHVyYWxfZm9ybXMgfHwgZGljdFtcIlwiXVtcIlBsdXJhbC1Gb3Jtc1wiXSB8fCBkaWN0W1wiXCJdW1wicGx1cmFsLWZvcm1zXCJdIHx8IGRlZmF1bHRDb25mLnBsdXJhbF9mb3JtcyB8fCBkZWZhdWx0Q29uZltcIlBsdXJhbC1Gb3Jtc1wiXSB8fCBkZWZhdWx0Q29uZltcInBsdXJhbC1mb3Jtc1wiXSxcbiAgICAgICAgICB2YWxfbGlzdCxcbiAgICAgICAgICByZXM7XG5cbiAgICAgIHZhciB2YWxfaWR4O1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIE5vIHZhbHVlIHBhc3NlZCBpbjsgYXNzdW1lIHNpbmd1bGFyIGtleSBsb29rdXAuXG4gICAgICAgIHZhbF9pZHggPSAwO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBWYWx1ZSBoYXMgYmVlbiBwYXNzZWQgaW47IHVzZSBwbHVyYWwtZm9ybXMgY2FsY3VsYXRpb25zLlxuXG4gICAgICAgIC8vIEhhbmRsZSBpbnZhbGlkIG51bWJlcnMsIGJ1dCB0cnkgY2FzdGluZyBzdHJpbmdzIGZvciBnb29kIG1lYXN1cmVcbiAgICAgICAgaWYgKCB0eXBlb2YgdmFsICE9ICdudW1iZXInICkge1xuICAgICAgICAgIHZhbCA9IHBhcnNlSW50KCB2YWwsIDEwICk7XG5cbiAgICAgICAgICBpZiAoIGlzTmFOKCB2YWwgKSApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIG51bWJlciB0aGF0IHdhcyBwYXNzZWQgaW4gaXMgbm90IGEgbnVtYmVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhbF9pZHggPSBnZXRQbHVyYWxGb3JtRnVuYyhwbHVyYWxGb3JtcykodmFsKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhyb3cgYW4gZXJyb3IgaWYgYSBkb21haW4gaXNuJ3QgZm91bmRcbiAgICAgIGlmICggISBkaWN0ICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRvbWFpbiBuYW1lZCBgJyArIGRvbWFpbiArICdgIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICB2YWxfbGlzdCA9IGRpY3RbIGtleSBdO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBtYXRjaCwgdGhlbiByZXZlcnQgYmFjayB0b1xuICAgICAgLy8gZW5nbGlzaCBzdHlsZSBzaW5ndWxhci9wbHVyYWwgd2l0aCB0aGUga2V5cyBwYXNzZWQgaW4uXG4gICAgICBpZiAoICEgdmFsX2xpc3QgfHwgdmFsX2lkeCA+IHZhbF9saXN0Lmxlbmd0aCApIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5taXNzaW5nX2tleV9jYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5taXNzaW5nX2tleV9jYWxsYmFjayhrZXksIGRvbWFpbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gWyBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXkgXTtcblxuICAgICAgICAvLyBjb2xsZWN0IHVudHJhbnNsYXRlZCBzdHJpbmdzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWc9PT10cnVlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzWyBnZXRQbHVyYWxGb3JtRnVuYyhwbHVyYWxGb3JtcykoIHZhbCApIF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNbIGdldFBsdXJhbEZvcm1GdW5jKCkoIHZhbCApIF07XG4gICAgICB9XG5cbiAgICAgIHJlcyA9IHZhbF9saXN0WyB2YWxfaWR4IF07XG5cbiAgICAgIC8vIFRoaXMgaW5jbHVkZXMgZW1wdHkgc3RyaW5ncyBvbiBwdXJwb3NlXG4gICAgICBpZiAoICEgcmVzICApIHtcbiAgICAgICAgcmVzID0gWyBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXkgXTtcbiAgICAgICAgcmV0dXJuIHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMoKSggdmFsICkgXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9KTtcblxuXG4gIC8vIFdlIGFkZCBpbiBzcHJpbnRmIGNhcGFiaWxpdGllcyBmb3IgcG9zdCB0cmFuc2xhdGlvbiB2YWx1ZSBpbnRlcm9sYXRpb25cbiAgLy8gVGhpcyBpcyBub3QgaW50ZXJuYWxseSB1c2VkLCBzbyB5b3UgY2FuIHJlbW92ZSBpdCBpZiB5b3UgaGF2ZSB0aGlzXG4gIC8vIGF2YWlsYWJsZSBzb21ld2hlcmUgZWxzZSwgb3Igd2FudCB0byB1c2UgYSBkaWZmZXJlbnQgc3lzdGVtLlxuXG4gIC8vIFdlIF9zbGlnaHRseV8gbW9kaWZ5IHRoZSBub3JtYWwgc3ByaW50ZiBiZWhhdmlvciB0byBtb3JlIGdyYWNlZnVsbHkgaGFuZGxlXG4gIC8vIHVuZGVmaW5lZCB2YWx1ZXMuXG5cbiAgLyoqXG4gICBzcHJpbnRmKCkgZm9yIEphdmFTY3JpcHQgMC43LWJldGExXG4gICBodHRwOi8vd3d3LmRpdmVpbnRvamF2YXNjcmlwdC5jb20vcHJvamVjdHMvamF2YXNjcmlwdC1zcHJpbnRmXG5cbiAgIENvcHlyaWdodCAoYykgQWxleGFuZHJ1IE1hcmFzdGVhbnUgPGFsZXhhaG9saWMgW2F0KSBnbWFpbCAoZG90XSBjb20+XG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG4gICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICAgICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICAgICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBzcHJpbnRmKCkgZm9yIEphdmFTY3JpcHQgbm9yIHRoZVxuICAgICAgICAgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHNcbiAgICAgICAgIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkRcbiAgIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG4gICBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFXG4gICBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBBbGV4YW5kcnUgTWFyYXN0ZWFudSBCRSBMSUFCTEUgRk9SIEFOWVxuICAgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAgIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAgIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICAgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAgIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAgKi9cbiAgdmFyIHNwcmludGYgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZ2V0X3R5cGUodmFyaWFibGUpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdHJfcmVwZWF0KGlucHV0LCBtdWx0aXBsaWVyKSB7XG4gICAgICBmb3IgKHZhciBvdXRwdXQgPSBbXTsgbXVsdGlwbGllciA+IDA7IG91dHB1dFstLW11bHRpcGxpZXJdID0gaW5wdXQpIHsvKiBkbyBub3RoaW5nICovfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICB9XG5cbiAgICB2YXIgc3RyX2Zvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzdHJfZm9ybWF0LmNhY2hlLmhhc093blByb3BlcnR5KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgc3RyX2Zvcm1hdC5jYWNoZVthcmd1bWVudHNbMF1dID0gc3RyX2Zvcm1hdC5wYXJzZShhcmd1bWVudHNbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cl9mb3JtYXQuZm9ybWF0LmNhbGwobnVsbCwgc3RyX2Zvcm1hdC5jYWNoZVthcmd1bWVudHNbMF1dLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzdHJfZm9ybWF0LmZvcm1hdCA9IGZ1bmN0aW9uKHBhcnNlX3RyZWUsIGFyZ3YpIHtcbiAgICAgIHZhciBjdXJzb3IgPSAxLCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoLCBub2RlX3R5cGUgPSAnJywgYXJnLCBvdXRwdXQgPSBbXSwgaSwgaywgbWF0Y2gsIHBhZCwgcGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5vZGVfdHlwZSA9IGdldF90eXBlKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICBpZiAobm9kZV90eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGVfdHlwZSA9PT0gJ2FycmF5Jykge1xuICAgICAgICAgIG1hdGNoID0gcGFyc2VfdHJlZVtpXTsgLy8gY29udmVuaWVuY2UgcHVycG9zZXMgb25seVxuICAgICAgICAgIGlmIChtYXRjaFsyXSkgeyAvLyBrZXl3b3JkIGFyZ3VtZW50XG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl07XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbWF0Y2hbMl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgaWYgKCFhcmcuaGFzT3duUHJvcGVydHkobWF0Y2hbMl1ba10pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3coc3ByaW50ZignW3NwcmludGZdIHByb3BlcnR5IFwiJXNcIiBkb2VzIG5vdCBleGlzdCcsIG1hdGNoWzJdW2tdKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYXJnID0gYXJnW21hdGNoWzJdW2tdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAobWF0Y2hbMV0pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W21hdGNoWzFdXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9bXnNdLy50ZXN0KG1hdGNoWzhdKSAmJiAoZ2V0X3R5cGUoYXJnKSAhPSAnbnVtYmVyJykpIHtcbiAgICAgICAgICAgIHRocm93KHNwcmludGYoJ1tzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlcycsIGdldF90eXBlKGFyZykpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBKZWQgRURJVFxuICAgICAgICAgIGlmICggdHlwZW9mIGFyZyA9PSAndW5kZWZpbmVkJyB8fCBhcmcgPT09IG51bGwgKSB7XG4gICAgICAgICAgICBhcmcgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSmVkIEVESVRcblxuICAgICAgICAgIHN3aXRjaCAobWF0Y2hbOF0pIHtcbiAgICAgICAgICAgIGNhc2UgJ2InOiBhcmcgPSBhcmcudG9TdHJpbmcoMik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYyc6IGFyZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkJzogYXJnID0gcGFyc2VJbnQoYXJnLCAxMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZSc6IGFyZyA9IG1hdGNoWzddID8gYXJnLnRvRXhwb25lbnRpYWwobWF0Y2hbN10pIDogYXJnLnRvRXhwb25lbnRpYWwoKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmJzogYXJnID0gbWF0Y2hbN10gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbyc6IGFyZyA9IGFyZy50b1N0cmluZyg4KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzJzogYXJnID0gKChhcmcgPSBTdHJpbmcoYXJnKSkgJiYgbWF0Y2hbN10gPyBhcmcuc3Vic3RyaW5nKDAsIG1hdGNoWzddKSA6IGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndSc6IGFyZyA9IE1hdGguYWJzKGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAneCc6IGFyZyA9IGFyZy50b1N0cmluZygxNik7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnWCc6IGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZyA9ICgvW2RlZl0vLnRlc3QobWF0Y2hbOF0pICYmIG1hdGNoWzNdICYmIGFyZyA+PSAwID8gJysnKyBhcmcgOiBhcmcpO1xuICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBtYXRjaFs0XSA/IG1hdGNoWzRdID09ICcwJyA/ICcwJyA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6ICcgJztcbiAgICAgICAgICBwYWRfbGVuZ3RoID0gbWF0Y2hbNl0gLSBTdHJpbmcoYXJnKS5sZW5ndGg7XG4gICAgICAgICAgcGFkID0gbWF0Y2hbNl0gPyBzdHJfcmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogJyc7XG4gICAgICAgICAgb3V0cHV0LnB1c2gobWF0Y2hbNV0gPyBhcmcgKyBwYWQgOiBwYWQgKyBhcmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH07XG5cbiAgICBzdHJfZm9ybWF0LmNhY2hlID0ge307XG5cbiAgICBzdHJfZm9ybWF0LnBhcnNlID0gZnVuY3Rpb24oZm10KSB7XG4gICAgICB2YXIgX2ZtdCA9IGZtdCwgbWF0Y2ggPSBbXSwgcGFyc2VfdHJlZSA9IFtdLCBhcmdfbmFtZXMgPSAwO1xuICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgaWYgKChtYXRjaCA9IC9eW15cXHgyNV0rLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaFswXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNXsyfS8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2goJyUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1KD86KFsxLTldXFxkKilcXCR8XFwoKFteXFwpXSspXFwpKT8oXFwrKT8oMHwnW14kXSk/KC0pPyhcXGQrKT8oPzpcXC4oXFxkKykpPyhbYi1mb3N1eFhdKS8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxO1xuICAgICAgICAgICAgdmFyIGZpZWxkX2xpc3QgPSBbXSwgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSwgZmllbGRfbWF0Y2ggPSBbXTtcbiAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSAnJykge1xuICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcLihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gL15cXFsoXFxkKylcXF0vLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhcmdfbmFtZXMgfD0gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aHJvdygnW3NwcmludGZdIGh1aD8nKTtcbiAgICAgICAgfVxuICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZV90cmVlO1xuICAgIH07XG5cbiAgICByZXR1cm4gc3RyX2Zvcm1hdDtcbiAgfSkoKTtcblxuICB2YXIgdnNwcmludGYgPSBmdW5jdGlvbihmbXQsIGFyZ3YpIHtcbiAgICBhcmd2LnVuc2hpZnQoZm10KTtcbiAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBhcmd2KTtcbiAgfTtcblxuICBKZWQucGFyc2VfcGx1cmFsID0gZnVuY3Rpb24gKCBwbHVyYWxfZm9ybXMsIG4gKSB7XG4gICAgcGx1cmFsX2Zvcm1zID0gcGx1cmFsX2Zvcm1zLnJlcGxhY2UoL24vZywgbik7XG4gICAgcmV0dXJuIEplZC5wYXJzZV9leHByZXNzaW9uKHBsdXJhbF9mb3Jtcyk7XG4gIH07XG5cbiAgSmVkLnNwcmludGYgPSBmdW5jdGlvbiAoIGZtdCwgYXJncyApIHtcbiAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoIGFyZ3MgKSA9PSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgcmV0dXJuIHZzcHJpbnRmKCBmbXQsIFtdLnNsaWNlLmNhbGwoYXJncykgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwcmludGYuYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpICk7XG4gIH07XG5cbiAgSmVkLnByb3RvdHlwZS5zcHJpbnRmID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBKZWQuc3ByaW50Zi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuICAvLyBFTkQgc3ByaW50ZiBJbXBsZW1lbnRhdGlvblxuXG4gIC8vIFN0YXJ0IHRoZSBQbHVyYWwgZm9ybXMgc2VjdGlvblxuICAvLyBUaGlzIGlzIGEgZnVsbCBwbHVyYWwgZm9ybSBleHByZXNzaW9uIHBhcnNlci4gSXQgaXMgdXNlZCB0byBhdm9pZFxuICAvLyBydW5uaW5nICdldmFsJyBvciAnbmV3IEZ1bmN0aW9uJyBkaXJlY3RseSBhZ2FpbnN0IHRoZSBwbHVyYWxcbiAgLy8gZm9ybXMuXG4gIC8vXG4gIC8vIFRoaXMgY2FuIGJlIGltcG9ydGFudCBpZiB5b3UgZ2V0IHRyYW5zbGF0aW9ucyBkb25lIHRocm91Z2ggYSAzcmRcbiAgLy8gcGFydHkgdmVuZG9yLiBJIGVuY291cmFnZSB5b3UgdG8gdXNlIHRoaXMgaW5zdGVhZCwgaG93ZXZlciwgSVxuICAvLyBhbHNvIHdpbGwgcHJvdmlkZSBhICdwcmVjb21waWxlcicgdGhhdCB5b3UgY2FuIHVzZSBhdCBidWlsZCB0aW1lXG4gIC8vIHRvIG91dHB1dCB2YWxpZC9zYWZlIGZ1bmN0aW9uIHJlcHJlc2VudGF0aW9ucyBvZiB0aGUgcGx1cmFsIGZvcm1cbiAgLy8gZXhwcmVzc2lvbnMuIFRoaXMgbWVhbnMgeW91IGNhbiBidWlsZCB0aGlzIGNvZGUgb3V0IGZvciB0aGUgbW9zdFxuICAvLyBwYXJ0LlxuICBKZWQuUEYgPSB7fTtcblxuICBKZWQuUEYucGFyc2UgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgdmFyIHBsdXJhbF9zdHIgPSBKZWQuUEYuZXh0cmFjdFBsdXJhbEV4cHIoIHAgKTtcbiAgICByZXR1cm4gSmVkLlBGLnBhcnNlci5wYXJzZS5jYWxsKEplZC5QRi5wYXJzZXIsIHBsdXJhbF9zdHIpO1xuICB9O1xuXG4gIEplZC5QRi5jb21waWxlID0gZnVuY3Rpb24gKCBwICkge1xuICAgIC8vIEhhbmRsZSB0cnVlcyBhbmQgZmFsc2VzIGFzIDAgYW5kIDFcbiAgICBmdW5jdGlvbiBpbXBseSggdmFsICkge1xuICAgICAgcmV0dXJuICh2YWwgPT09IHRydWUgPyAxIDogdmFsID8gdmFsIDogMCk7XG4gICAgfVxuXG4gICAgdmFyIGFzdCA9IEplZC5QRi5wYXJzZSggcCApO1xuICAgIHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICByZXR1cm4gaW1wbHkoIEplZC5QRi5pbnRlcnByZXRlciggYXN0ICkoIG4gKSApO1xuICAgIH07XG4gIH07XG5cbiAgSmVkLlBGLmludGVycHJldGVyID0gZnVuY3Rpb24gKCBhc3QgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggbiApIHtcbiAgICAgIHZhciByZXM7XG4gICAgICBzd2l0Y2ggKCBhc3QudHlwZSApIHtcbiAgICAgICAgY2FzZSAnR1JPVVAnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5leHByICkoIG4gKTtcbiAgICAgICAgY2FzZSAnVEVSTkFSWSc6XG4gICAgICAgICAgaWYgKCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5leHByICkoIG4gKSApIHtcbiAgICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC50cnV0aHkgKSggbiApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QuZmFsc2V5ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnT1InOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSB8fCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0FORCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICYmIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTFQnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA8IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnR1QnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA+IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTFRFJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPD0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdHVEUnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA+PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0VRJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPT0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdORVEnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAhPSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ01PRCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICUgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdWQVInOlxuICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICBjYXNlICdOVU0nOlxuICAgICAgICAgIHJldHVybiBhc3QudmFsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgVG9rZW4gZm91bmQuXCIpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgSmVkLlBGLmV4dHJhY3RQbHVyYWxFeHByID0gZnVuY3Rpb24gKCBwICkge1xuICAgIC8vIHRyaW0gZmlyc3RcbiAgICBwID0gcC5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcblxuICAgIGlmICghIC87XFxzKiQvLnRlc3QocCkpIHtcbiAgICAgIHAgPSBwLmNvbmNhdCgnOycpO1xuICAgIH1cblxuICAgIHZhciBucGx1cmFsc19yZSA9IC9ucGx1cmFsc1xcPShcXGQrKTsvLFxuICAgICAgICBwbHVyYWxfcmUgPSAvcGx1cmFsXFw9KC4qKTsvLFxuICAgICAgICBucGx1cmFsc19tYXRjaGVzID0gcC5tYXRjaCggbnBsdXJhbHNfcmUgKSxcbiAgICAgICAgcmVzID0ge30sXG4gICAgICAgIHBsdXJhbF9tYXRjaGVzO1xuXG4gICAgLy8gRmluZCB0aGUgbnBsdXJhbHMgbnVtYmVyXG4gICAgaWYgKCBucGx1cmFsc19tYXRjaGVzLmxlbmd0aCA+IDEgKSB7XG4gICAgICByZXMubnBsdXJhbHMgPSBucGx1cmFsc19tYXRjaGVzWzFdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbnBsdXJhbHMgbm90IGZvdW5kIGluIHBsdXJhbF9mb3JtcyBzdHJpbmc6ICcgKyBwICk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoYXQgZGF0YSB0byBnZXQgdG8gdGhlIGZvcm11bGFcbiAgICBwID0gcC5yZXBsYWNlKCBucGx1cmFsc19yZSwgXCJcIiApO1xuICAgIHBsdXJhbF9tYXRjaGVzID0gcC5tYXRjaCggcGx1cmFsX3JlICk7XG5cbiAgICBpZiAoISggcGx1cmFsX21hdGNoZXMgJiYgcGx1cmFsX21hdGNoZXMubGVuZ3RoID4gMSApICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgcGx1cmFsYCBleHByZXNzaW9uIG5vdCBmb3VuZDogJyArIHApO1xuICAgIH1cbiAgICByZXR1cm4gcGx1cmFsX21hdGNoZXNbIDEgXTtcbiAgfTtcblxuICAvKiBKaXNvbiBnZW5lcmF0ZWQgcGFyc2VyICovXG4gIEplZC5QRi5wYXJzZXIgPSAoZnVuY3Rpb24oKXtcblxudmFyIHBhcnNlciA9IHt0cmFjZTogZnVuY3Rpb24gdHJhY2UoKSB7IH0sXG55eToge30sXG5zeW1ib2xzXzoge1wiZXJyb3JcIjoyLFwiZXhwcmVzc2lvbnNcIjozLFwiZVwiOjQsXCJFT0ZcIjo1LFwiP1wiOjYsXCI6XCI6NyxcInx8XCI6OCxcIiYmXCI6OSxcIjxcIjoxMCxcIjw9XCI6MTEsXCI+XCI6MTIsXCI+PVwiOjEzLFwiIT1cIjoxNCxcIj09XCI6MTUsXCIlXCI6MTYsXCIoXCI6MTcsXCIpXCI6MTgsXCJuXCI6MTksXCJOVU1CRVJcIjoyMCxcIiRhY2NlcHRcIjowLFwiJGVuZFwiOjF9LFxudGVybWluYWxzXzogezI6XCJlcnJvclwiLDU6XCJFT0ZcIiw2OlwiP1wiLDc6XCI6XCIsODpcInx8XCIsOTpcIiYmXCIsMTA6XCI8XCIsMTE6XCI8PVwiLDEyOlwiPlwiLDEzOlwiPj1cIiwxNDpcIiE9XCIsMTU6XCI9PVwiLDE2OlwiJVwiLDE3OlwiKFwiLDE4OlwiKVwiLDE5OlwiblwiLDIwOlwiTlVNQkVSXCJ9LFxucHJvZHVjdGlvbnNfOiBbMCxbMywyXSxbNCw1XSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwzXSxbNCwxXSxbNCwxXV0sXG5wZXJmb3JtQWN0aW9uOiBmdW5jdGlvbiBhbm9ueW1vdXMoeXl0ZXh0LHl5bGVuZyx5eWxpbmVubyx5eSx5eXN0YXRlLCQkLF8kKSB7XG5cbnZhciAkMCA9ICQkLmxlbmd0aCAtIDE7XG5zd2l0Y2ggKHl5c3RhdGUpIHtcbmNhc2UgMTogcmV0dXJuIHsgdHlwZSA6ICdHUk9VUCcsIGV4cHI6ICQkWyQwLTFdIH07XG5icmVhaztcbmNhc2UgMjp0aGlzLiQgPSB7IHR5cGU6ICdURVJOQVJZJywgZXhwcjogJCRbJDAtNF0sIHRydXRoeSA6ICQkWyQwLTJdLCBmYWxzZXk6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDM6dGhpcy4kID0geyB0eXBlOiBcIk9SXCIsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNDp0aGlzLiQgPSB7IHR5cGU6IFwiQU5EXCIsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNTp0aGlzLiQgPSB7IHR5cGU6ICdMVCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNjp0aGlzLiQgPSB7IHR5cGU6ICdMVEUnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDc6dGhpcy4kID0geyB0eXBlOiAnR1QnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDg6dGhpcy4kID0geyB0eXBlOiAnR1RFJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA5OnRoaXMuJCA9IHsgdHlwZTogJ05FUScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTA6dGhpcy4kID0geyB0eXBlOiAnRVEnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDExOnRoaXMuJCA9IHsgdHlwZTogJ01PRCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTI6dGhpcy4kID0geyB0eXBlOiAnR1JPVVAnLCBleHByOiAkJFskMC0xXSB9O1xuYnJlYWs7XG5jYXNlIDEzOnRoaXMuJCA9IHsgdHlwZTogJ1ZBUicgfTtcbmJyZWFrO1xuY2FzZSAxNDp0aGlzLiQgPSB7IHR5cGU6ICdOVU0nLCB2YWw6IE51bWJlcih5eXRleHQpIH07XG5icmVhaztcbn1cbn0sXG50YWJsZTogW3szOjEsNDoyLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7MTpbM119LHs1OlsxLDZdLDY6WzEsN10sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XX0sezQ6MTcsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs1OlsyLDEzXSw2OlsyLDEzXSw3OlsyLDEzXSw4OlsyLDEzXSw5OlsyLDEzXSwxMDpbMiwxM10sMTE6WzIsMTNdLDEyOlsyLDEzXSwxMzpbMiwxM10sMTQ6WzIsMTNdLDE1OlsyLDEzXSwxNjpbMiwxM10sMTg6WzIsMTNdfSx7NTpbMiwxNF0sNjpbMiwxNF0sNzpbMiwxNF0sODpbMiwxNF0sOTpbMiwxNF0sMTA6WzIsMTRdLDExOlsyLDE0XSwxMjpbMiwxNF0sMTM6WzIsMTRdLDE0OlsyLDE0XSwxNTpbMiwxNF0sMTY6WzIsMTRdLDE4OlsyLDE0XX0sezE6WzIsMV19LHs0OjE4LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoxOSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjAsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIxLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjMsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI0LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjYsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI3LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NjpbMSw3XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsxLDI4XX0sezY6WzEsN10sNzpbMSwyOV0sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XX0sezU6WzIsM10sNjpbMiwzXSw3OlsyLDNdLDg6WzIsM10sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsM119LHs1OlsyLDRdLDY6WzIsNF0sNzpbMiw0XSw4OlsyLDRdLDk6WzIsNF0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDRdfSx7NTpbMiw1XSw2OlsyLDVdLDc6WzIsNV0sODpbMiw1XSw5OlsyLDVdLDEwOlsyLDVdLDExOlsyLDVdLDEyOlsyLDVdLDEzOlsyLDVdLDE0OlsyLDVdLDE1OlsyLDVdLDE2OlsxLDE2XSwxODpbMiw1XX0sezU6WzIsNl0sNjpbMiw2XSw3OlsyLDZdLDg6WzIsNl0sOTpbMiw2XSwxMDpbMiw2XSwxMTpbMiw2XSwxMjpbMiw2XSwxMzpbMiw2XSwxNDpbMiw2XSwxNTpbMiw2XSwxNjpbMSwxNl0sMTg6WzIsNl19LHs1OlsyLDddLDY6WzIsN10sNzpbMiw3XSw4OlsyLDddLDk6WzIsN10sMTA6WzIsN10sMTE6WzIsN10sMTI6WzIsN10sMTM6WzIsN10sMTQ6WzIsN10sMTU6WzIsN10sMTY6WzEsMTZdLDE4OlsyLDddfSx7NTpbMiw4XSw2OlsyLDhdLDc6WzIsOF0sODpbMiw4XSw5OlsyLDhdLDEwOlsyLDhdLDExOlsyLDhdLDEyOlsyLDhdLDEzOlsyLDhdLDE0OlsyLDhdLDE1OlsyLDhdLDE2OlsxLDE2XSwxODpbMiw4XX0sezU6WzIsOV0sNjpbMiw5XSw3OlsyLDldLDg6WzIsOV0sOTpbMiw5XSwxMDpbMiw5XSwxMTpbMiw5XSwxMjpbMiw5XSwxMzpbMiw5XSwxNDpbMiw5XSwxNTpbMiw5XSwxNjpbMSwxNl0sMTg6WzIsOV19LHs1OlsyLDEwXSw2OlsyLDEwXSw3OlsyLDEwXSw4OlsyLDEwXSw5OlsyLDEwXSwxMDpbMiwxMF0sMTE6WzIsMTBdLDEyOlsyLDEwXSwxMzpbMiwxMF0sMTQ6WzIsMTBdLDE1OlsyLDEwXSwxNjpbMSwxNl0sMTg6WzIsMTBdfSx7NTpbMiwxMV0sNjpbMiwxMV0sNzpbMiwxMV0sODpbMiwxMV0sOTpbMiwxMV0sMTA6WzIsMTFdLDExOlsyLDExXSwxMjpbMiwxMV0sMTM6WzIsMTFdLDE0OlsyLDExXSwxNTpbMiwxMV0sMTY6WzIsMTFdLDE4OlsyLDExXX0sezU6WzIsMTJdLDY6WzIsMTJdLDc6WzIsMTJdLDg6WzIsMTJdLDk6WzIsMTJdLDEwOlsyLDEyXSwxMTpbMiwxMl0sMTI6WzIsMTJdLDEzOlsyLDEyXSwxNDpbMiwxMl0sMTU6WzIsMTJdLDE2OlsyLDEyXSwxODpbMiwxMl19LHs0OjMwLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NTpbMiwyXSw2OlsxLDddLDc6WzIsMl0sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiwyXX1dLFxuZGVmYXVsdEFjdGlvbnM6IHs2OlsyLDFdfSxcbnBhcnNlRXJyb3I6IGZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG59LFxucGFyc2U6IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBzdGFjayA9IFswXSxcbiAgICAgICAgdnN0YWNrID0gW251bGxdLCAvLyBzZW1hbnRpYyB2YWx1ZSBzdGFja1xuICAgICAgICBsc3RhY2sgPSBbXSwgLy8gbG9jYXRpb24gc3RhY2tcbiAgICAgICAgdGFibGUgPSB0aGlzLnRhYmxlLFxuICAgICAgICB5eXRleHQgPSAnJyxcbiAgICAgICAgeXlsaW5lbm8gPSAwLFxuICAgICAgICB5eWxlbmcgPSAwLFxuICAgICAgICByZWNvdmVyaW5nID0gMCxcbiAgICAgICAgVEVSUk9SID0gMixcbiAgICAgICAgRU9GID0gMTtcblxuICAgIC8vdGhpcy5yZWR1Y3Rpb25Db3VudCA9IHRoaXMuc2hpZnRDb3VudCA9IDA7XG5cbiAgICB0aGlzLmxleGVyLnNldElucHV0KGlucHV0KTtcbiAgICB0aGlzLmxleGVyLnl5ID0gdGhpcy55eTtcbiAgICB0aGlzLnl5LmxleGVyID0gdGhpcy5sZXhlcjtcbiAgICBpZiAodHlwZW9mIHRoaXMubGV4ZXIueXlsbG9jID09ICd1bmRlZmluZWQnKVxuICAgICAgICB0aGlzLmxleGVyLnl5bGxvYyA9IHt9O1xuICAgIHZhciB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgIGxzdGFjay5wdXNoKHl5bG9jKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy55eS5wYXJzZUVycm9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSB0aGlzLnl5LnBhcnNlRXJyb3I7XG5cbiAgICBmdW5jdGlvbiBwb3BTdGFjayAobikge1xuICAgICAgICBzdGFjay5sZW5ndGggPSBzdGFjay5sZW5ndGggLSAyKm47XG4gICAgICAgIHZzdGFjay5sZW5ndGggPSB2c3RhY2subGVuZ3RoIC0gbjtcbiAgICAgICAgbHN0YWNrLmxlbmd0aCA9IGxzdGFjay5sZW5ndGggLSBuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICB0b2tlbiA9IHNlbGYubGV4ZXIubGV4KCkgfHwgMTsgLy8gJGVuZCA9IDFcbiAgICAgICAgLy8gaWYgdG9rZW4gaXNuJ3QgaXRzIG51bWVyaWMgdmFsdWUsIGNvbnZlcnRcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRva2VuID0gc2VsZi5zeW1ib2xzX1t0b2tlbl0gfHwgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIHZhciBzeW1ib2wsIHByZUVycm9yU3ltYm9sLCBzdGF0ZSwgYWN0aW9uLCBhLCByLCB5eXZhbD17fSxwLGxlbixuZXdTdGF0ZSwgZXhwZWN0ZWQ7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgLy8gcmV0cmVpdmUgc3RhdGUgbnVtYmVyIGZyb20gdG9wIG9mIHN0YWNrXG4gICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuXG4gICAgICAgIC8vIHVzZSBkZWZhdWx0IGFjdGlvbnMgaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuICAgICAgICAgICAgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3ltYm9sID09IG51bGwpXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG4gICAgICAgICAgICAvLyByZWFkIGFjdGlvbiBmb3IgY3VycmVudCBzdGF0ZSBhbmQgZmlyc3QgaW5wdXRcbiAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bc3ltYm9sXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBwYXJzZSBlcnJvclxuICAgICAgICBfaGFuZGxlX2Vycm9yOlxuICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3VuZGVmaW5lZCcgfHwgIWFjdGlvbi5sZW5ndGggfHwgIWFjdGlvblswXSkge1xuXG4gICAgICAgICAgICBpZiAoIXJlY292ZXJpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXBvcnQgZXJyb3JcbiAgICAgICAgICAgICAgICBleHBlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAocCBpbiB0YWJsZVtzdGF0ZV0pIGlmICh0aGlzLnRlcm1pbmFsc19bcF0gJiYgcCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQucHVzaChcIidcIit0aGlzLnRlcm1pbmFsc19bcF0rXCInXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZXJyU3RyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyclN0ciA9ICdQYXJzZSBlcnJvciBvbiBsaW5lICcrKHl5bGluZW5vKzEpK1wiOlxcblwiK3RoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKCkrXCJcXG5FeHBlY3RpbmcgXCIrZXhwZWN0ZWQuam9pbignLCAnKSArIFwiLCBnb3QgJ1wiICsgdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0rIFwiJ1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVyclN0ciA9ICdQYXJzZSBlcnJvciBvbiBsaW5lICcrKHl5bGluZW5vKzEpK1wiOiBVbmV4cGVjdGVkIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3ltYm9sID09IDEgLypFT0YqLyA/IFwiZW5kIG9mIGlucHV0XCIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIidcIisodGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sKStcIidcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoZXJyU3RyLFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogdGhpcy5sZXhlci5tYXRjaCwgdG9rZW46IHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCwgbGluZTogdGhpcy5sZXhlci55eWxpbmVubywgbG9jOiB5eWxvYywgZXhwZWN0ZWQ6IGV4cGVjdGVkfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGp1c3QgcmVjb3ZlcmVkIGZyb20gYW5vdGhlciBlcnJvclxuICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gRU9GKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJTdHIgfHwgJ1BhcnNpbmcgaGFsdGVkLicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRpc2NhcmQgY3VycmVudCBsb29rYWhlYWQgYW5kIGdyYWIgYW5vdGhlclxuICAgICAgICAgICAgICAgIHl5bGVuZyA9IHRoaXMubGV4ZXIueXlsZW5nO1xuICAgICAgICAgICAgICAgIHl5dGV4dCA9IHRoaXMubGV4ZXIueXl0ZXh0O1xuICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0cnkgdG8gcmVjb3ZlciBmcm9tIGVycm9yXG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBlcnJvciByZWNvdmVyeSBydWxlIGluIHRoaXMgc3RhdGVcbiAgICAgICAgICAgICAgICBpZiAoKFRFUlJPUi50b1N0cmluZygpKSBpbiB0YWJsZVtzdGF0ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJTdHIgfHwgJ1BhcnNpbmcgaGFsdGVkLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwb3BTdGFjaygxKTtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBzeW1ib2w7IC8vIHNhdmUgdGhlIGxvb2thaGVhZCB0b2tlblxuICAgICAgICAgICAgc3ltYm9sID0gVEVSUk9SOyAgICAgICAgIC8vIGluc2VydCBnZW5lcmljIGVycm9yIHN5bWJvbCBhcyBuZXcgbG9va2FoZWFkXG4gICAgICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIGFjdGlvbiA9IHRhYmxlW3N0YXRlXSAmJiB0YWJsZVtzdGF0ZV1bVEVSUk9SXTtcbiAgICAgICAgICAgIHJlY292ZXJpbmcgPSAzOyAvLyBhbGxvdyAzIHJlYWwgc3ltYm9scyB0byBiZSBzaGlmdGVkIGJlZm9yZSByZXBvcnRpbmcgYSBuZXcgZXJyb3JcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMgc2hvdWxkbid0IGhhcHBlbiwgdW5sZXNzIHJlc29sdmUgZGVmYXVsdHMgYXJlIG9mZlxuICAgICAgICBpZiAoYWN0aW9uWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgYWN0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyc2UgRXJyb3I6IG11bHRpcGxlIGFjdGlvbnMgcG9zc2libGUgYXQgc3RhdGU6ICcrc3RhdGUrJywgdG9rZW46ICcrc3ltYm9sKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uWzBdKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTogLy8gc2hpZnRcbiAgICAgICAgICAgICAgICAvL3RoaXMuc2hpZnRDb3VudCsrO1xuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHRoaXMubGV4ZXIueXl0ZXh0KTtcbiAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh0aGlzLmxleGVyLnl5bGxvYyk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChhY3Rpb25bMV0pOyAvLyBwdXNoIHN0YXRlXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIXByZUVycm9yU3ltYm9sKSB7IC8vIG5vcm1hbCBleGVjdXRpb24vbm8gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG4gICAgICAgICAgICAgICAgICAgIHl5dGV4dCA9IHRoaXMubGV4ZXIueXl0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvdmVyaW5nID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY292ZXJpbmctLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBlcnJvciBqdXN0IG9jY3VycmVkLCByZXN1bWUgb2xkIGxvb2thaGVhZCBmLyBiZWZvcmUgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG4gICAgICAgICAgICAgICAgICAgIHByZUVycm9yU3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMjogLy8gcmVkdWNlXG4gICAgICAgICAgICAgICAgLy90aGlzLnJlZHVjdGlvbkNvdW50Kys7XG5cbiAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzFdO1xuXG4gICAgICAgICAgICAgICAgLy8gcGVyZm9ybSBzZW1hbnRpYyBhY3Rpb25cbiAgICAgICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGgtbGVuXTsgLy8gZGVmYXVsdCB0byAkJCA9ICQxXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBsb2NhdGlvbiwgdXNlcyBmaXJzdCB0b2tlbiBmb3IgZmlyc3RzLCBsYXN0IGZvciBsYXN0c1xuICAgICAgICAgICAgICAgIHl5dmFsLl8kID0ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0obGVufHwxKV0uZmlyc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0xXS5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGgtKGxlbnx8MSldLmZpcnN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoLTFdLmxhc3RfY29sdW1uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwoeXl2YWwsIHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgdGhpcy55eSwgYWN0aW9uWzFdLCB2c3RhY2ssIGxzdGFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHBvcCBvZmYgc3RhY2tcbiAgICAgICAgICAgICAgICBpZiAobGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMCwtMSpsZW4qMik7XG4gICAgICAgICAgICAgICAgICAgIHZzdGFjayA9IHZzdGFjay5zbGljZSgwLCAtMSpsZW4pO1xuICAgICAgICAgICAgICAgICAgICBsc3RhY2sgPSBsc3RhY2suc2xpY2UoMCwgLTEqbGVuKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMF0pOyAgICAvLyBwdXNoIG5vbnRlcm1pbmFsIChyZWR1Y2UpXG4gICAgICAgICAgICAgICAgdnN0YWNrLnB1c2goeXl2YWwuJCk7XG4gICAgICAgICAgICAgICAgbHN0YWNrLnB1c2goeXl2YWwuXyQpO1xuICAgICAgICAgICAgICAgIC8vIGdvdG8gbmV3IHN0YXRlID0gdGFibGVbU1RBVEVdW05PTlRFUk1JTkFMXVxuICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gdGFibGVbc3RhY2tbc3RhY2subGVuZ3RoLTJdXVtzdGFja1tzdGFjay5sZW5ndGgtMV1dO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2gobmV3U3RhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDM6IC8vIGFjY2VwdFxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn19Oy8qIEppc29uIGdlbmVyYXRlZCBsZXhlciAqL1xudmFyIGxleGVyID0gKGZ1bmN0aW9uKCl7XG5cbnZhciBsZXhlciA9ICh7RU9GOjEsXG5wYXJzZUVycm9yOmZ1bmN0aW9uIHBhcnNlRXJyb3Ioc3RyLCBoYXNoKSB7XG4gICAgICAgIGlmICh0aGlzLnl5LnBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMueXkucGFyc2VFcnJvcihzdHIsIGhhc2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG4gICAgICAgIH1cbiAgICB9LFxuc2V0SW5wdXQ6ZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9sZXNzID0gdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICAgIHRoaXMueXlsaW5lbm8gPSB0aGlzLnl5bGVuZyA9IDA7XG4gICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy5tYXRjaGVkID0gdGhpcy5tYXRjaCA9ICcnO1xuICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrID0gWydJTklUSUFMJ107XG4gICAgICAgIHRoaXMueXlsbG9jID0ge2ZpcnN0X2xpbmU6MSxmaXJzdF9jb2x1bW46MCxsYXN0X2xpbmU6MSxsYXN0X2NvbHVtbjowfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbmlucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoID0gdGhpcy5faW5wdXRbMF07XG4gICAgICAgIHRoaXMueXl0ZXh0Kz1jaDtcbiAgICAgICAgdGhpcy55eWxlbmcrKztcbiAgICAgICAgdGhpcy5tYXRjaCs9Y2g7XG4gICAgICAgIHRoaXMubWF0Y2hlZCs9Y2g7XG4gICAgICAgIHZhciBsaW5lcyA9IGNoLm1hdGNoKC9cXG4vKTtcbiAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vKys7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XG4gICAgICAgIHJldHVybiBjaDtcbiAgICB9LFxudW5wdXQ6ZnVuY3Rpb24gKGNoKSB7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gY2ggKyB0aGlzLl9pbnB1dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbm1vcmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9tb3JlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbnBhc3RJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXN0ID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gdGhpcy5tYXRjaC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJzonJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxudXBjb21pbmdJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0ID0gdGhpcy5tYXRjaDtcbiAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwLW5leHQubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQuc3Vic3RyKDAsMjApKyhuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLic6JycpKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgfSxcbnNob3dQb3NpdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuICAgICAgICB2YXIgYyA9IG5ldyBBcnJheShwcmUubGVuZ3RoICsgMSkuam9pbihcIi1cIik7XG4gICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjK1wiXlwiO1xuICAgIH0sXG5uZXh0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgdmFyIHRva2VuLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICBjb2wsXG4gICAgICAgICAgICBsaW5lcztcbiAgICAgICAgaWYgKCF0aGlzLl9tb3JlKSB7XG4gICAgICAgICAgICB0aGlzLnl5dGV4dCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5tYXRjaCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHRoaXMuX2N1cnJlbnRSdWxlcygpO1xuICAgICAgICBmb3IgKHZhciBpPTA7aSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goL1xcbi4qL2cpO1xuICAgICAgICAgICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZTogdGhpcy55eWxsb2MubGFzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubysxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X2NvbHVtbjogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9jb2x1bW46IGxpbmVzID8gbGluZXNbbGluZXMubGVuZ3RoLTFdLmxlbmd0aC0xIDogdGhpcy55eWxsb2MubGFzdF9jb2x1bW4gKyBtYXRjaFswXS5sZW5ndGh9XG4gICAgICAgICAgICAgICAgdGhpcy55eXRleHQgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZXMgPSBtYXRjaDtcbiAgICAgICAgICAgICAgICB0aGlzLnl5bGVuZyA9IHRoaXMueXl0ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3JlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZShtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlZCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHRoaXMsIHRoaXMueXksIHRoaXMsIHJ1bGVzW2ldLHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV0pO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbikgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pbnB1dCA9PT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJysodGhpcy55eWxpbmVubysxKSsnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nK3RoaXMuc2hvd1Bvc2l0aW9uKCksXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiBcIlwiLCB0b2tlbjogbnVsbCwgbGluZTogdGhpcy55eWxpbmVub30pO1xuICAgICAgICB9XG4gICAgfSxcbmxleDpmdW5jdGlvbiBsZXgoKSB7XG4gICAgICAgIHZhciByID0gdGhpcy5uZXh0KCk7XG4gICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGV4KCk7XG4gICAgICAgIH1cbiAgICB9LFxuYmVnaW46ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sucHVzaChjb25kaXRpb24pO1xuICAgIH0sXG5wb3BTdGF0ZTpmdW5jdGlvbiBwb3BTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2sucG9wKCk7XG4gICAgfSxcbl9jdXJyZW50UnVsZXM6ZnVuY3Rpb24gX2N1cnJlbnRSdWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1t0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTFdXS5ydWxlcztcbiAgICB9LFxudG9wU3RhdGU6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0yXTtcbiAgICB9LFxucHVzaFN0YXRlOmZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuICAgICAgICB0aGlzLmJlZ2luKGNvbmRpdGlvbik7XG4gICAgfX0pO1xubGV4ZXIucGVyZm9ybUFjdGlvbiA9IGZ1bmN0aW9uIGFub255bW91cyh5eSx5eV8sJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucyxZWV9TVEFSVCkge1xuXG52YXIgWVlTVEFURT1ZWV9TVEFSVDtcbnN3aXRjaCgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5jYXNlIDA6Lyogc2tpcCB3aGl0ZXNwYWNlICovXG5icmVhaztcbmNhc2UgMTpyZXR1cm4gMjBcbmJyZWFrO1xuY2FzZSAyOnJldHVybiAxOVxuYnJlYWs7XG5jYXNlIDM6cmV0dXJuIDhcbmJyZWFrO1xuY2FzZSA0OnJldHVybiA5XG5icmVhaztcbmNhc2UgNTpyZXR1cm4gNlxuYnJlYWs7XG5jYXNlIDY6cmV0dXJuIDdcbmJyZWFrO1xuY2FzZSA3OnJldHVybiAxMVxuYnJlYWs7XG5jYXNlIDg6cmV0dXJuIDEzXG5icmVhaztcbmNhc2UgOTpyZXR1cm4gMTBcbmJyZWFrO1xuY2FzZSAxMDpyZXR1cm4gMTJcbmJyZWFrO1xuY2FzZSAxMTpyZXR1cm4gMTRcbmJyZWFrO1xuY2FzZSAxMjpyZXR1cm4gMTVcbmJyZWFrO1xuY2FzZSAxMzpyZXR1cm4gMTZcbmJyZWFrO1xuY2FzZSAxNDpyZXR1cm4gMTdcbmJyZWFrO1xuY2FzZSAxNTpyZXR1cm4gMThcbmJyZWFrO1xuY2FzZSAxNjpyZXR1cm4gNVxuYnJlYWs7XG5jYXNlIDE3OnJldHVybiAnSU5WQUxJRCdcbmJyZWFrO1xufVxufTtcbmxleGVyLnJ1bGVzID0gWy9eXFxzKy8sL15bMC05XSsoXFwuWzAtOV0rKT9cXGIvLC9eblxcYi8sL15cXHxcXHwvLC9eJiYvLC9eXFw/LywvXjovLC9ePD0vLC9ePj0vLC9ePC8sL14+LywvXiE9LywvXj09LywvXiUvLC9eXFwoLywvXlxcKS8sL14kLywvXi4vXTtcbmxleGVyLmNvbmRpdGlvbnMgPSB7XCJJTklUSUFMXCI6e1wicnVsZXNcIjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxN10sXCJpbmNsdXNpdmVcIjp0cnVlfX07cmV0dXJuIGxleGVyO30pKClcbnBhcnNlci5sZXhlciA9IGxleGVyO1xucmV0dXJuIHBhcnNlcjtcbn0pKCk7XG4vLyBFbmQgcGFyc2VyXG5cbiAgLy8gSGFuZGxlIG5vZGUsIGFtZCwgYW5kIGdsb2JhbCBzeXN0ZW1zXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEplZDtcbiAgICB9XG4gICAgZXhwb3J0cy5KZWQgPSBKZWQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSmVkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIExlYWsgYSBnbG9iYWwgcmVnYXJkbGVzcyBvZiBtb2R1bGUgc3lzdGVtXG4gICAgcm9vdFsnSmVkJ10gPSBKZWQ7XG4gIH1cblxufSkodGhpcyk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID8gZW50cmllcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPyBlbnRyaWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0Q2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIG1hcENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDYWNoZUNsZWFyJyksXG4gICAgbWFwQ2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19tYXBDYWNoZURlbGV0ZScpLFxuICAgIG1hcENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVHZXQnKSxcbiAgICBtYXBDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX21hcENhY2hlSGFzJyksXG4gICAgbWFwQ2FjaGVTZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPyBlbnRyaWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyksXG4gICAgc2V0Q2FjaGVBZGQgPSByZXF1aXJlKCcuL19zZXRDYWNoZUFkZCcpLFxuICAgIHNldENhY2hlSGFzID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVIYXMnKTtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxubW9kdWxlLmV4cG9ydHMgPSBTZXRDYWNoZTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBZGRzIHRoZSBrZXktdmFsdWUgYHBhaXJgIHRvIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gcGFpciBUaGUga2V5LXZhbHVlIHBhaXIgdG8gYWRkLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgbWFwYC5cbiAqL1xuZnVuY3Rpb24gYWRkTWFwRW50cnkobWFwLCBwYWlyKSB7XG4gIC8vIERvbid0IHJldHVybiBgbWFwLnNldGAgYmVjYXVzZSBpdCdzIG5vdCBjaGFpbmFibGUgaW4gSUUgMTEuXG4gIG1hcC5zZXQocGFpclswXSwgcGFpclsxXSk7XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTWFwRW50cnk7XG4iLCIvKipcbiAqIEFkZHMgYHZhbHVlYCB0byBgc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFkZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYHNldGAuXG4gKi9cbmZ1bmN0aW9uIGFkZFNldEVudHJ5KHNldCwgdmFsdWUpIHtcbiAgLy8gRG9uJ3QgcmV0dXJuIGBzZXQuYWRkYCBiZWNhdXNlIGl0J3Mgbm90IGNoYWluYWJsZSBpbiBJRSAxMS5cbiAgc2V0LmFkZCh2YWx1ZSk7XG4gIHJldHVybiBzZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkU2V0RW50cnk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWFwO1xuIiwiLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UHVzaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnJlZHVjZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbYWNjdW11bGF0b3JdIFRoZSBpbml0aWFsIHZhbHVlLlxuICogQHBhcmFtIHtib29sZWFufSBbaW5pdEFjY3VtXSBTcGVjaWZ5IHVzaW5nIHRoZSBmaXJzdCBlbGVtZW50IG9mIGBhcnJheWAgYXNcbiAqICB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlSZWR1Y2UoYXJyYXksIGl0ZXJhdGVlLCBhY2N1bXVsYXRvciwgaW5pdEFjY3VtKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gIGlmIChpbml0QWNjdW0gJiYgbGVuZ3RoKSB7XG4gICAgYWNjdW11bGF0b3IgPSBhcnJheVsrK2luZGV4XTtcbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gaXRlcmF0ZWUoYWNjdW11bGF0b3IsIGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gYWNjdW11bGF0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlSZWR1Y2U7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVNvbWU7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGFzc2lnblZhbHVlYCBhbmQgYGFzc2lnbk1lcmdlVmFsdWVgIHdpdGhvdXRcbiAqIHZhbHVlIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgICAnZW51bWVyYWJsZSc6IHRydWUsXG4gICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICd3cml0YWJsZSc6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnblZhbHVlO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Z1bGxdIFNwZWNpZnkgYSBjbG9uZSBpbmNsdWRpbmcgc3ltYm9scy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBpc0Z1bGwsIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVPYmplY3QoaXNGdW5jID8ge30gOiB2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGJhc2VDbG9uZSwgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IChpc0Z1bGwgPyBnZXRBbGxLZXlzIDoga2V5cykodmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgaXNGdWxsLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGlzS2V5KHBhdGgsIG9iamVjdCkgPyBbcGF0aF0gOiBjYXN0UGF0aChwYXRoKTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0QWxsS2V5cztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXNJbihvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYga2V5IGluIE9iamVjdChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXNJbjtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtib29sZWFufSBbYml0bWFza10gVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy5cbiAqICBUaGUgYml0bWFzayBtYXkgYmUgY29tcG9zZWQgb2YgdGhlIGZvbGxvd2luZyBmbGFnczpcbiAqICAgICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAgICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdCh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJhc2VJc0VxdWFsLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IFtiaXRtYXNrXSBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICogIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IGFycmF5VGFnLFxuICAgICAgb3RoVGFnID0gYXJyYXlUYWc7XG5cbiAgaWYgKCFvYmpJc0Fycikge1xuICAgIG9ialRhZyA9IGdldFRhZyhvYmplY3QpO1xuICAgIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICB9XG4gIGlmICghb3RoSXNBcnIpIHtcbiAgICBvdGhUYWcgPSBnZXRUYWcob3RoZXIpO1xuICAgIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuICB9XG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWxEZWVwO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hdGNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoRGF0YSBUaGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3MgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gbWF0Y2hEYXRhLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IGluZGV4LFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuICFsZW5ndGg7XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIGlmICgobm9DdXN0b21pemVyICYmIGRhdGFbMl0pXG4gICAgICAgICAgPyBkYXRhWzFdICE9PSBvYmplY3RbZGF0YVswXV1cbiAgICAgICAgICA6ICEoZGF0YVswXSBpbiBvYmplY3QpXG4gICAgICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIHZhciBrZXkgPSBkYXRhWzBdLFxuICAgICAgICBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBzcmNWYWx1ZSA9IGRhdGFbMV07XG5cbiAgICBpZiAobm9DdXN0b21pemVyICYmIGRhdGFbMl0pIHtcbiAgICAgIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2sgPSBuZXcgU3RhY2s7XG4gICAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghKHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgY3VzdG9taXplciwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHLCBzdGFjaylcbiAgICAgICAgICAgIDogcmVzdWx0XG4gICAgICAgICAgKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hdGNoO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc01hc2tlZCA9IHJlcXVpcmUoJy4vX2lzTWFza2VkJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hdGl2ZTtcbiIsInZhciBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwidmFyIGJhc2VJc01hdGNoID0gcmVxdWlyZSgnLi9fYmFzZUlzTWF0Y2gnKSxcbiAgICBnZXRNYXRjaERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXRjaERhdGEnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc2Agd2hpY2ggZG9lc24ndCBjbG9uZSBgc291cmNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgbWF0Y2hEYXRhID0gZ2V0TWF0Y2hEYXRhKHNvdXJjZSk7XG4gIGlmIChtYXRjaERhdGEubGVuZ3RoID09IDEgJiYgbWF0Y2hEYXRhWzBdWzJdKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKG1hdGNoRGF0YVswXVswXSwgbWF0Y2hEYXRhWzBdWzFdKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gc291cmNlIHx8IGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzO1xuIiwidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIHVuZGVmaW5lZCwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5RGVlcDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhY2hlSGFzO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNhc3QgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2FzdFBhdGgodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBzdHJpbmdUb1BhdGgodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwidmFyIFVpbnQ4QXJyYXkgPSByZXF1aXJlKCcuL19VaW50OEFycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUFycmF5QnVmZmVyO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIGFsbG9jVW5zYWZlID0gQnVmZmVyID8gQnVmZmVyLmFsbG9jVW5zYWZlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVCdWZmZXI7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGRhdGFWaWV3YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFWaWV3IFRoZSBkYXRhIHZpZXcgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIGRhdGEgdmlldy5cbiAqL1xuZnVuY3Rpb24gY2xvbmVEYXRhVmlldyhkYXRhVmlldywgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlcikgOiBkYXRhVmlldy5idWZmZXI7XG4gIHJldHVybiBuZXcgZGF0YVZpZXcuY29uc3RydWN0b3IoYnVmZmVyLCBkYXRhVmlldy5ieXRlT2Zmc2V0LCBkYXRhVmlldy5ieXRlTGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURhdGFWaWV3O1xuIiwidmFyIGFkZE1hcEVudHJ5ID0gcmVxdWlyZSgnLi9fYWRkTWFwRW50cnknKSxcbiAgICBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBtYXAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lTWFwKG1hcCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKG1hcFRvQXJyYXkobWFwKSwgdHJ1ZSkgOiBtYXBUb0FycmF5KG1hcCk7XG4gIHJldHVybiBhcnJheVJlZHVjZShhcnJheSwgYWRkTWFwRW50cnksIG5ldyBtYXAuY29uc3RydWN0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lTWFwO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGByZWdleHBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVnZXhwIFRoZSByZWdleHAgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgcmVnZXhwLlxuICovXG5mdW5jdGlvbiBjbG9uZVJlZ0V4cChyZWdleHApIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyByZWdleHAuY29uc3RydWN0b3IocmVnZXhwLnNvdXJjZSwgcmVGbGFncy5leGVjKHJlZ2V4cCkpO1xuICByZXN1bHQubGFzdEluZGV4ID0gcmVnZXhwLmxhc3RJbmRleDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVJlZ0V4cDtcbiIsInZhciBhZGRTZXRFbnRyeSA9IHJlcXVpcmUoJy4vX2FkZFNldEVudHJ5JyksXG4gICAgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBzZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc2V0LlxuICovXG5mdW5jdGlvbiBjbG9uZVNldChzZXQsIGlzRGVlcCwgY2xvbmVGdW5jKSB7XG4gIHZhciBhcnJheSA9IGlzRGVlcCA/IGNsb25lRnVuYyhzZXRUb0FycmF5KHNldCksIHRydWUpIDogc2V0VG9BcnJheShzZXQpO1xuICByZXR1cm4gYXJyYXlSZWR1Y2UoYXJyYXksIGFkZFNldEVudHJ5LCBuZXcgc2V0LmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2wgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY29tcGFyaXNvbiBzdHlsZXMuICovXG52YXIgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyA9IDEsXG4gICAgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBVTk9SREVSRURfQ09NUEFSRV9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxBcnJheXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gVU5PUkRFUkVEX0NPTVBBUkVfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEJ5VGFnO1xuIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY29tcGFyaXNvbiBzdHlsZXMuICovXG52YXIgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRyxcbiAgICAgIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsT2JqZWN0cztcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hcERhdGE7XG4iLCJ2YXIgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIEdldHMgdGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG1hdGNoIGRhdGEgb2YgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGdldE1hdGNoRGF0YShvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXMob2JqZWN0KSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGtleSA9IHJlc3VsdFtsZW5ndGhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgcmVzdWx0W2xlbmd0aF0gPSBba2V5LCB2YWx1ZSwgaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXRjaERhdGE7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9sIHByb3BlcnRpZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSBuYXRpdmVHZXRTeW1ib2xzID8gb3ZlckFyZyhuYXRpdmVHZXRTeW1ib2xzLCBPYmplY3QpIDogc3R1YkFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgZXhpc3RzIG9uIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgaGFzRnVuYykge1xuICBwYXRoID0gaXNLZXkocGF0aCwgb2JqZWN0KSA/IFtwYXRoXSA6IGNhc3RQYXRoKHBhdGgpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID8gb2JqZWN0Lmxlbmd0aCA6IDA7XG4gIHJldHVybiAhIWxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNQYXRoO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKSxcbiAgICBjbG9uZURhdGFWaWV3ID0gcmVxdWlyZSgnLi9fY2xvbmVEYXRhVmlldycpLFxuICAgIGNsb25lTWFwID0gcmVxdWlyZSgnLi9fY2xvbmVNYXAnKSxcbiAgICBjbG9uZVJlZ0V4cCA9IHJlcXVpcmUoJy4vX2Nsb25lUmVnRXhwJyksXG4gICAgY2xvbmVTZXQgPSByZXF1aXJlKCcuL19jbG9uZVNldCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvbmVGdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBjbG9uZUZ1bmMsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgcmV0dXJuIGNsb25lRGF0YVZpZXcob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVUeXBlZEFycmF5KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lTWFwKG9iamVjdCwgaXNEZWVwLCBjbG9uZUZ1bmMpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lUmVnRXhwKG9iamVjdCk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVNldChvYmplY3QsIGlzRGVlcCwgY2xvbmVGdW5jKTtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYG1hdGNoZXNQcm9wZXJ0eWAgZm9yIHNvdXJjZSB2YWx1ZXMgc3VpdGFibGVcbiAqIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShrZXksIHNyY1ZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdFtrZXldID09PSBzcmNWYWx1ZSAmJlxuICAgICAgKHNyY1ZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVBZGQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVIYXM7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsInZhciBtZW1vaXplQ2FwcGVkID0gcmVxdWlyZSgnLi9fbWVtb2l6ZUNhcHBlZCcpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVMZWFkaW5nRG90ID0gL15cXC4vLFxuICAgIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHJlTGVhZGluZ0RvdC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGB2YWx1ZWAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24gdGhlXG4gKiBbc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG1dKGh0dHBzOi8vbWRuLmlvL1N0cnVjdHVyZWRfY2xvbmVfYWxnb3JpdGhtKVxuICogYW5kIHN1cHBvcnRzIGNsb25pbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucywgZGF0ZSBvYmplY3RzLCBtYXBzLFxuICogbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcywgc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkXG4gKiBhcnJheXMuIFRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYXJlIGNsb25lZFxuICogYXMgcGxhaW4gb2JqZWN0cy4gQW4gZW1wdHkgb2JqZWN0IGlzIHJldHVybmVkIGZvciB1bmNsb25lYWJsZSB2YWx1ZXMgc3VjaFxuICogYXMgZXJyb3Igb2JqZWN0cywgZnVuY3Rpb25zLCBET00gbm9kZXMsIGFuZCBXZWFrTWFwcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lRGVlcFxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhzaGFsbG93WzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY2xvbmUodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgZmFsc2UsIHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiB7ICdiJzogMiB9IH07XG4gKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXMob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob3RoZXIsICdhJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzO1xuIiwidmFyIGJhc2VIYXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VIYXNJbicpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBvciBpbmhlcml0ZWQgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzSW4ob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNJbjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5JyksXG4gICAgYmFzZVByb3BlcnR5RGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eURlZXAnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFtcbiAqICAgeyAnYSc6IHsgJ2InOiAyIH0gfSxcbiAqICAgeyAnYSc6IHsgJ2InOiAxIH0gfVxuICogXTtcbiAqXG4gKiBfLm1hcChvYmplY3RzLCBfLnByb3BlcnR5KCdhLmInKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChfLnNvcnRCeShvYmplY3RzLCBfLnByb3BlcnR5KFsnYScsICdiJ10pKSwgJ2EuYicpO1xuICogLy8gPT4gWzEsIDJdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcmV0dXJuIGlzS2V5KHBhdGgpID8gYmFzZVByb3BlcnR5KHRvS2V5KHBhdGgpKSA6IGJhc2VQcm9wZXJ0eURlZXAocGF0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJBcnJheTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvaW1hZ2VJblRleHQgKi9cblxudmFyIG1hdGNoU3RyaW5nV2l0aFJlZ2V4ID0gcmVxdWlyZSggXCIuL21hdGNoU3RyaW5nV2l0aFJlZ2V4LmpzXCIgKTtcblxuLyoqXG4gKiBDaGVja3MgdGhlIHRleHQgZm9yIGltYWdlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dHN0cmluZyB0byBjaGVjayBmb3IgaW1hZ2VzXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IGNvbnRhaW5pbmcgYWxsIHR5cGVzIG9mIGZvdW5kIGltYWdlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRyZXR1cm4gbWF0Y2hTdHJpbmdXaXRoUmVnZXgoIHRleHQsIFwiPGltZyg/OltePl0rKT8+XCIgKTtcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL21hdGNoU3RyaW5nV2l0aFJlZ2V4ICovXG5cbi8qKlxuICogQ2hlY2tzIGEgc3RyaW5nIHdpdGggYSByZWdleCwgcmV0dXJuIGFsbCBtYXRjaGVzIGZvdW5kIHdpdGggdGhhdCByZWdleC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBtYXRjaCB0aGVcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWdleFN0cmluZyBBIHN0cmluZyB0byB1c2UgYXMgcmVnZXguXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IHdpdGggbWF0Y2hlcywgZW1wdHkgYXJyYXkgaWYgbm8gbWF0Y2hlcyBmb3VuZC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCwgcmVnZXhTdHJpbmcgKSB7XG5cdHZhciByZWdleCA9IG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nLCBcImlnXCIgKTtcblx0dmFyIG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKCByZWdleCApO1xuXG5cdGlmICggbWF0Y2hlcyA9PT0gbnVsbCApIHtcblx0XHRtYXRjaGVzID0gW107XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlcztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0RmFjZWJvb2tQcmV2aWV3OiByZXF1aXJlKCBcIi4vanMvZmFjZWJvb2tQcmV2aWV3XCIgKSxcblx0VHdpdHRlclByZXZpZXc6IHJlcXVpcmUoIFwiLi9qcy90d2l0dGVyUHJldmlld1wiIClcbn07XG4iLCJ2YXIgcGxhY2Vob2xkZXJUZW1wbGF0ZSA9IHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5pbWFnZVBsYWNlaG9sZGVyO1xuXG4vKipcbiAqIFNldHMgdGhlIHBsYWNlaG9sZGVyIHdpdGggYSBnaXZlbiB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VDb250YWluZXIgVGhlIGxvY2F0aW9uIHRvIHB1dCB0aGUgcGxhY2Vob2xkZXIgaW4uXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhY2Vob2xkZXIgVGhlIHZhbHVlIGZvciB0aGUgcGxhY2Vob2xkZXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRXJyb3IgV2hlbiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGFuIGVycm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyIEEgY3NzIGNsYXNzIG1vZGlmaWVyIHRvIGNoYW5nZSB0aGUgc3R5bGluZy5cbiAqL1xuZnVuY3Rpb24gc2V0SW1hZ2VQbGFjZWhvbGRlciggaW1hZ2VDb250YWluZXIsIHBsYWNlaG9sZGVyLCBpc0Vycm9yLCBtb2RpZmllciApIHtcblx0dmFyIGNsYXNzTmFtZXMgPSBbIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyXCIgXTtcblx0aXNFcnJvciA9IGlzRXJyb3IgfHwgZmFsc2U7XG5cdG1vZGlmaWVyID0gbW9kaWZpZXIgfHwgXCJcIjtcblxuXHRpZiAoIGlzRXJyb3IgKSB7XG5cdFx0Y2xhc3NOYW1lcy5wdXNoKCBcInNvY2lhbC1pbWFnZS1wbGFjZWhvbGRlci0tZXJyb3JcIiApO1xuXHR9XG5cblx0aWYgKCBcIlwiICE9PSBtb2RpZmllciApIHtcblx0XHRjbGFzc05hbWVzLnB1c2goIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyLS1cIiArIG1vZGlmaWVyICk7XG5cdH1cblxuXHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBwbGFjZWhvbGRlclRlbXBsYXRlKCB7XG5cdFx0Y2xhc3NOYW1lOiBjbGFzc05hbWVzLmpvaW4oIFwiIFwiICksXG5cdFx0cGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyXG5cdH0gKTtcbn1cblxubW9kdWxlLmV4cG9ydHM9IHNldEltYWdlUGxhY2Vob2xkZXI7XG4iLCJ2YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvaXNFbXB0eVwiICk7XG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCBcImxvZGFzaC9mdW5jdGlvbi9kZWJvdW5jZVwiICk7XG5cbnZhciBzdHJpcEhUTUxUYWdzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MuanNcIiApO1xudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIgKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgZmllbGQgYW5kIHNldHMgdGhlIGV2ZW50cyBmb3IgdGhhdCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRGaWVsZCBUaGUgZmllbGQgdG8gcmVwcmVzZW50LlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fHVuZGVmaW5lZH0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGVkIGFmdGVyIGZpZWxkIGNoYW5nZS5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dEVsZW1lbnQoIGlucHV0RmllbGQsIHZhbHVlcywgY2FsbGJhY2sgKSB7XG5cdHRoaXMuaW5wdXRGaWVsZCA9IGlucHV0RmllbGQ7XG5cdHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHR0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG5cdHRoaXMuc2V0VmFsdWUoIHRoaXMuZ2V0SW5wdXRWYWx1ZSgpICk7XG5cblx0dGhpcy5iaW5kRXZlbnRzKCk7XG59XG5cbi8qKlxuICogQmluZHMgdGhlIGV2ZW50c1xuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBldmVudHMuXG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImtleWRvd25cIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5dXBcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblxuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJpbnB1dFwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJmb2N1c1wiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJibHVyXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIERvIHRoZSBjaGFuZ2UgZXZlbnRcbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuY2hhbmdlRXZlbnQgPSBkZWJvdW5jZSggZnVuY3Rpb24oKSB7XG5cdC8vIFdoZW4gdGhlcmUgaXMgYSBjYWxsYmFjayBydW4gaXQuXG5cdGlmICggdHlwZW9mIHRoaXMuX2NhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdHRoaXMuX2NhbGxiYWNrKCk7XG5cdH1cblxuXHR0aGlzLnNldFZhbHVlKCB0aGlzLmdldElucHV0VmFsdWUoKSApO1xufSwgMjUgKTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGN1cnJlbnQgZmllbGQgdmFsdWVcbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5nZXRJbnB1dFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmlucHV0RmllbGQudmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGEgdmFsdWUgZm9yIHRoZSBwcmV2aWV3LiBJZiB2YWx1ZSBpcyBlbXB0eSBhIHNhbXBsZSB2YWx1ZSBpcyB1c2VkXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB0aXRsZSwgd2l0aG91dCBodG1sIHRhZ3MuXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZm9ybWF0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuXG5cdHZhbHVlID0gc3RyaXBIVE1MVGFncyggdmFsdWUgKTtcblxuXHQvLyBBcyBhbiB1bHRpbWF0ZSBmYWxsYmFjayBwcm92aWRlIHRoZSB1c2VyIHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLmZhbGxiYWNrO1xuXHR9XG5cblx0cmV0dXJuIHN0cmlwU3BhY2VzKCB2YWx1ZSApO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJuIHRoZSB2YWx1ZSBvciBnZXQgYSBmYWxsYmFjayBvbmUuXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZhbHVlID0gdGhpcy52YWx1ZXMuY3VycmVudFZhbHVlO1xuXG5cdC8vIEZhbGxiYWNrIHRvIHRoZSBkZWZhdWx0IGlmIHZhbHVlIGlzIGVtcHR5LlxuXHRpZiAoIGlzRW1wdHkoIHZhbHVlICkgKSB7XG5cdFx0dmFsdWUgPSB0aGlzLnZhbHVlcy5kZWZhdWx0VmFsdWU7XG5cdH1cblxuXHQvLyBGb3IgcmVuZGVyaW5nIHdlIGNhbiBmYWxsYmFjayB0byB0aGUgcGxhY2Vob2xkZXIgYXMgd2VsbC5cblx0aWYgKCBpc0VtcHR5KCB2YWx1ZSApICkge1xuXHRcdHZhbHVlID0gdGhpcy52YWx1ZXMucGxhY2Vob2xkZXI7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdHRoaXMudmFsdWVzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dEVsZW1lbnQ7XG5cbiIsIi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cbnZhciBpc0VsZW1lbnQgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRWxlbWVudFwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2Nsb25lXCIgKTtcbnZhciBkZWZhdWx0c0RlZXAgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNEZWVwXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcblxudmFyIGltYWdlRGlzcGxheU1vZGUgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbWFnZURpc3BsYXlNb2RlXCIgKTtcbnZhciByZW5kZXJEZXNjcmlwdGlvbiA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL3JlbmRlckRlc2NyaXB0aW9uXCIgKTtcbnZhciBpbWFnZVBsYWNlaG9sZGVyICA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2ltYWdlUGxhY2Vob2xkZXJcIiApO1xudmFyIGJlbUFkZE1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyXCIgKTtcbnZhciBiZW1SZW1vdmVNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllclwiICk7XG5cbnZhciBUZXh0RmllbGQgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRJbnB1dFwiICk7XG52YXIgVGV4dEFyZWEgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRhcmVhXCIgKTtcblxudmFyIElucHV0RWxlbWVudCA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2lucHV0XCIgKTtcbnZhciBQcmV2aWV3RXZlbnRzID0gcmVxdWlyZSggXCIuL3ByZXZpZXcvZXZlbnRzXCIgKTtcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoIFwiLi90ZW1wbGF0ZXMuanNcIiApO1xudmFyIGZhY2Vib29rRWRpdG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tQcmV2aWV3O1xudmFyIGZhY2Vib29rQXV0aG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tBdXRob3I7XG5cbnZhciBmYWNlYm9va0RlZmF1bHRzID0ge1xuXHRkYXRhOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0YmFzZVVSTDogXCJleGFtcGxlLmNvbVwiLFxuXHRjYWxsYmFja3M6IHtcblx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbigpIHt9LFxuXHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRyZXR1cm4gdGl0bGU7XG5cdFx0fSxcblx0XHRtb2RpZnlEZXNjcmlwdGlvbjogZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRcdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHRcdH0sXG5cdFx0bW9kaWZ5SW1hZ2VVcmw6IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHR9XG5cdH1cbn07XG5cbnZhciBpbnB1dEZhY2Vib29rUHJldmlld0JpbmRpbmdzID0gW1xuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fdGl0bGUtLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwidGl0bGVcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiaW1hZ2VVcmxcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiZGVzY3JpcHRpb25cIlxuXHR9XG5dO1xuXG52YXIgV0lEVEhfRkFDRUJPT0tfSU1BR0VfU01BTEwgPSAxNTg7XG52YXIgV0lEVEhfRkFDRUJPT0tfSU1BR0VfTEFSR0UgPSA0NzA7XG5cbnZhciBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfV0lEVEggPSAyMDA7XG52YXIgRkFDRUJPT0tfSU1BR0VfVE9PX1NNQUxMX0hFSUdIVCA9IDIwMDtcblxudmFyIEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9XSURUSCA9IDYwMDtcbnZhciBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfSEVJR0hUID0gMzE1O1xuXG4vKipcbiAqIEBtb2R1bGUgc25pcHBldFByZXZpZXdcbiAqL1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbmZpZyBhbmQgb3V0cHV0VGFyZ2V0IGZvciB0aGUgU25pcHBldFByZXZpZXdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBTbmlwcGV0IHByZXZpZXcgb3B0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIgICAgICAgICAgICAgICAtIFRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgZm9yIHRoZSBmaWVsZHMsIHdpbGwgYmUgc2hvd24gYXNcbiAqIGFjdHVhbCBwbGFjZWhvbGRlcnMgaW4gdGhlIGlucHV0cyBhbmQgYXMgYSBmYWxsYmFjayBmb3IgdGhlIHByZXZpZXcuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLnRpdGxlICAgICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIHRpdGxlIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbiAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBkZXNjcmlwdGlvbiBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgaW1hZ2UgdXJsIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlICAgICAgICAgICAgICAtIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZmllbGRzLCBpZiB0aGUgdXNlciBoYXMgbm90XG4gKiBjaGFuZ2VkIGEgZmllbGQsIHRoaXMgdmFsdWUgd2lsbCBiZSB1c2VkIGZvciB0aGUgYW5hbHl6ZXIsIHByZXZpZXcgYW5kIHRoZSBwcm9ncmVzcyBiYXJzLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUudGl0bGUgICAgICAgIC0gRGVmYXVsdCB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uICAtIERlZmF1bHQgZGVzY3JpcHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCAgICAgLSBEZWZhdWx0IGltYWdlIHVybC5cbiAqIGl0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuYmFzZVVSTCAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gRmFjZWJvb2suXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICBvcHRzLnRhcmdldEVsZW1lbnQgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuY2FsbGJhY2tzICAgICAgICAgICAgICAgICAtIEZ1bmN0aW9ucyB0aGF0IGFyZSBjYWxsZWQgb24gc3BlY2lmaWMgaW5zdGFuY2VzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgb3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyAtIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBzb2NpYWwgcHJldmlldyBpcyB1cGRhdGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIGkxOG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBpMThuIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdHJhbnNsYXRpb24gb2JqZWN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnQgICAgICAgICAgICAgICAgICAtIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudCAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGVsZW1lbnRzIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5yZW5kZXJlZCAgICAgICAgICAgICAgIC0gVGhlIHJlbmRlcmVkIGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC50aXRsZSAgICAgICAgIC0gVGhlIHJlbmRlcmVkIHRpdGxlIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmltYWdlVXJsICAgICAgLSBUaGUgcmVuZGVyZWQgdXJsIHBhdGggZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24gICAtIFRoZSByZW5kZXJlZCBGYWNlYm9vayBkZXNjcmlwdGlvbiBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQuaW5wdXQgICAgICAgICAgICAgICAgICAtIFRoZSBpbnB1dCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQudGl0bGUgICAgICAgICAgICAtIFRoZSB0aXRsZSBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5pbWFnZVVybCAgICAgICAgIC0gVGhlIHVybCBwYXRoIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbiBpbnB1dCBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuY29udGFpbmVyICAgICAgICAgICAgICAtIFRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5mb3JtQ29udGFpbmVyICAgICAgICAgIC0gVGhlIGZvcm0gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmVkaXRUb2dnbGUgICAgICAgICAgICAgLSBUaGUgYnV0dG9uIHRoYXQgdG9nZ2xlcyB0aGUgZWRpdG9yIGZvcm0uXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGRhdGEgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLnRpdGxlICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdGl0bGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmltYWdlVXJsICAgICAgICAgICAgICAgICAgLSBUaGUgdXJsIHBhdGguXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmRlc2NyaXB0aW9uICAgICAgICAgICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBiYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIGdvb2dsZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEZhY2Vib29rUHJldmlldyA9IGZ1bmN0aW9uKCBvcHRzLCBpMThuICkge1xuXHR0aGlzLmkxOG4gPSBpMThuIHx8IHRoaXMuY29uc3RydWN0STE4bigpO1xuXG5cdGZhY2Vib29rRGVmYXVsdHMucGxhY2Vob2xkZXIgPSB7XG5cdFx0dGl0bGU6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJUaGlzIGlzIGFuIGV4YW1wbGUgdGl0bGUgLSBlZGl0IGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiTW9kaWZ5IHlvdXIgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIGl0IHJpZ2h0IGhlcmVcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KSxcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9O1xuXG5cdGRlZmF1bHRzRGVlcCggb3B0cywgZmFjZWJvb2tEZWZhdWx0cyApO1xuXG5cdGlmICggIWlzRWxlbWVudCggb3B0cy50YXJnZXRFbGVtZW50ICkgKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcIlRoZSBGYWNlYm9vayBwcmV2aWV3IHJlcXVpcmVzIGEgdmFsaWQgdGFyZ2V0IGVsZW1lbnRcIiApO1xuXHR9XG5cblx0dGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXHR0aGlzLm9wdHMgPSBvcHRzO1xuXG5cblx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgaTE4biBvYmplY3QgYmFzZWQgb24gcGFzc2VkIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNsYXRpb25zIC0gVGhlIHZhbHVlcyB0byB0cmFuc2xhdGUuXG4gKlxuICogQHJldHVybnMge0plZH0gLSBUaGUgSmVkIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0XCJkb21haW5cIjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcImxvY2FsZV9kYXRhXCI6IHtcblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge31cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW5kZXJUZW1wbGF0ZSgpO1xuXHR0aGlzLmJpbmRFdmVudHMoKTtcblx0dGhpcy51cGRhdGVQcmV2aWV3KCk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgc25pcHBldCBlZGl0b3IgYW5kIGFkZHMgaXQgdG8gdGhlIHRhcmdldEVsZW1lbnQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHR0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9IGZhY2Vib29rRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkxcblx0XHR9LFxuXHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIsXG5cdFx0aTE4bjoge1xuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdGVkaXQ6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiRWRpdCAlMSRzIHByZXZpZXdcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRzbmlwcGV0UHJldmlldzogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHByZXZpZXdcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRzbmlwcGV0RWRpdG9yOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZWRpdG9yXCIgKSwgXCJGYWNlYm9va1wiIClcblx0XHR9XG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXRpdGxlXCIgKVswXSxcblx0XHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWRlc2NyaXB0aW9uXCIgKVswXVxuXHRcdH0sXG5cdFx0ZmllbGRzOiB0aGlzLmdldEZpZWxkcygpLFxuXHRcdGNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXctLWZhY2Vib29rXCIgKVswXSxcblx0XHRmb3JtQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm1cIiApWzBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWzBdLFxuXHRcdGZvcm1GaWVsZHM6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybS1maWVsZFwiICksXG5cdFx0aGVhZGluZ0VkaXRvcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvclwiIClbMF0sXG5cdFx0YXV0aG9yQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWF1dGhvclwiIClbMF1cblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuZmllbGRzLmltYWdlVXJsLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLnRpdGxlLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLmRlc2NyaXB0aW9uLnJlbmRlcigpO1xuXG5cdHRoaXMuZWxlbWVudC5pbnB1dCA9IHtcblx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKVswXSxcblx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzID0gdGhpcy5nZXRGaWVsZEVsZW1lbnRzKCk7XG5cdHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciA9IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fc3VibWl0XCIgKVswXTtcblxuXHR0aGlzLmVsZW1lbnQubGFiZWwgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5pbnB1dC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0aGlzLmVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwucGFyZW50Tm9kZSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uLnBhcmVudE5vZGVcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQucHJldmlldyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX190aXRsZSBqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLnRpdGxlLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHRpdGxlXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRpbWFnZVVybDogbmV3IFRleHRGaWVsZCgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9faW1hZ2VVcmwganMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBpbWFnZVwiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9IClcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyB0aXRsZSBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGZhbGxiYWNrOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdFwiRmFjZWJvb2tcIlxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0XHRmYWxsYmFjazogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpXG5cdH07XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgRmFjZWJvb2sgcHJldmlldy5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS51cGRhdGVQcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG5cdC8vIFVwZGF0ZSB0aGUgZGF0YS5cblx0dGhpcy5kYXRhLnRpdGxlID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5pbWFnZVVybCA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmltYWdlVXJsLmdldElucHV0VmFsdWUoKTtcblxuXHQvLyBTZXRzIHRoZSB0aXRsZSBmaWVsZFxuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXQgdGhlIGRlc2NyaXB0aW9uIGZpZWxkIGFuZCBwYXJzZSB0aGUgc3R5bGluZyBvZiBpdC5cblx0dGhpcy5zZXREZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldHMgdGhlIEltYWdlXG5cdHRoaXMuc2V0SW1hZ2UoIHRoaXMuZGF0YS5pbWFnZVVybCApO1xuXG5cdC8vIENsb25lIHNvIHRoZSBkYXRhIGlzbid0IGNoYW5nZWFibGUuXG5cdHRoaXMub3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyggY2xvbmUoIHRoaXMuZGF0YSApICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByZXZpZXcgdGl0bGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSB0byBzZXRcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRUaXRsZSA9IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0dGl0bGUgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeVRpdGxlKCB0aXRsZSApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIHRvIHNldFxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCB0aGUgaW1hZ2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0SW1hZ2VDb250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZWxlbWVudC5wcmV2aWV3LmltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBpbWFnZSBvYmplY3Qgd2l0aCB0aGUgbmV3IFVSTC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmwgVGhlIGltYWdlIHBhdGguXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uICggaW1hZ2VVcmwgKSB7XG5cdGltYWdlVXJsID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlJbWFnZVVybCggaW1hZ2VVcmwgKTtcblxuXHRpZiAoIGltYWdlVXJsID09PSBcIlwiICYmIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHJldHVybiB0aGlzLm5vVXJsU2V0KCk7XG5cdH1cblxuXHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5pc1Rvb1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRcdHJldHVybiB0aGlzLmltYWdlVG9vU21hbGwoKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFNpemluZ0NsYXNzKCBpbWcgKTtcblx0XHR0aGlzLmFkZEltYWdlVG9Db250YWluZXIoIGltYWdlVXJsICk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRyZXR1cm4gdGhpcy5pbWFnZUVycm9yKCk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdC8vIExvYWQgaW1hZ2UgdG8gdHJpZ2dlciBsb2FkIG9yIGVycm9yIGV2ZW50LlxuXHRpbWcuc3JjID0gaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBObyBVUkwgU2V0IHdhcm5pbmcuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5ub1VybFNldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2Ugc2VsZWN0IGFuIGltYWdlIGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGZhbHNlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogRGlzcGxheXMgdGhlIEltYWdlIFRvbyBTbWFsbCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlVG9vU21hbGwgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1lc3NhZ2U7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0bWVzc2FnZSA9IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIldlIGFyZSB1bmFibGUgdG8gZGV0ZWN0IGFuIGltYWdlIFwiICtcblx0XHRcdFx0XCJpbiB5b3VyIHBvc3QgdGhhdCBpcyBsYXJnZSBlbm91Z2ggdG8gYmUgZGlzcGxheWVkIG9uIEZhY2Vib29rLiBXZSBhZHZpc2UgeW91IFwiICtcblx0XHRcdFx0XCJ0byBzZWxlY3QgYSAlMSRzIGltYWdlIHRoYXQgZml0cyB0aGUgcmVjb21tZW5kZWQgaW1hZ2Ugc2l6ZS5cIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRtZXNzYWdlID0gdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGltYWdlIHlvdSBzZWxlY3RlZCBpcyB0b28gc21hbGwgZm9yICUxJHNcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fVxuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdG1lc3NhZ2UsXG5cdFx0dHJ1ZSxcblx0XHRcImZhY2Vib29rXCJcblx0KTtcblxuXHRyZXR1cm47XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBVcmwgQ2Fubm90IEJlIExvYWRlZCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpbWFnZVBsYWNlaG9sZGVyKFxuXHRcdHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKSxcblx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGdpdmVuIGltYWdlIHVybCBjYW5ub3QgYmUgbG9hZGVkXCIgKSxcblx0XHR0cnVlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBpbWFnZSBvZiB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgaW1hZ2UgKyBcIilcIjtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgaW1hZ2UgZnJvbSB0aGUgY29udGFpbmVyLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcIlwiO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcm9wZXIgQ1NTIGNsYXNzIGZvciB0aGUgY3VycmVudCBpbWFnZS5cbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2UgdG8gYmFzZSB0aGUgc2l6aW5nIGNsYXNzIG9uLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U2l6aW5nQ2xhc3MgPSBmdW5jdGlvbiAoIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIGltYWdlRGlzcGxheU1vZGUoIGltZyApID09PSBcInBvcnRyYWl0XCIgKSB7XG5cdFx0dGhpcy5zZXRQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoXG4gKlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSBvYmplY3QgdG8gdXNlLlxuICogQHJldHVybnMge2ludH0gVGhlIGNhbGN1bGF0ZWQgbWF4d2lkdGhcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX1NNQUxMO1xuXHR9XG5cblx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX0xBUkdFO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNob3VsZCBzd2l0Y2ggdG8gc21hbGwgaW1hZ2UgbW9kZVxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIEZhY2Vib29rIHByZXZpZXcgaW1hZ2UgaXMgdG9vIHNtYWxsXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1Rvb1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIEZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBGYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzbWFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIGxhcmdlIGZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGxhcmdlIGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgcG9ydHJhaXQgRmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBwb3J0cmFpdCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cdHRoaXMucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcmVsb2FkU25pcHBldFRleHQgZnVuY3Rpb24gdG8gdGhlIGJsdXIgb2YgdGhlIHNuaXBwZXQgaW5wdXRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHByZXZpZXdFdmVudHMgPSBuZXcgUHJldmlld0V2ZW50cyggaW5wdXRGYWNlYm9va1ByZXZpZXdCaW5kaW5ncywgdGhpcy5lbGVtZW50LCB0cnVlICk7XG5cdHByZXZpZXdFdmVudHMuYmluZEV2ZW50cyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsIHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgRmFjZWJvb2sgYXV0aG9yIG5hbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGF1dGhvck5hbWUgVGhlIG5hbWUgb2YgdGhlIGF1dGhvciB0byBzaG93LlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldEF1dGhvciA9IGZ1bmN0aW9uKCBhdXRob3JOYW1lICkge1xuXHR2YXIgYXV0aG9ySHRtbCA9IFwiXCI7XG5cdGlmICggYXV0aG9yTmFtZSAhPT0gXCJcIiApIHtcblx0XHRhdXRob3JIdG1sID0gZmFjZWJvb2tBdXRob3JUZW1wbGF0ZShcblx0XHRcdHtcblx0XHRcdFx0YXV0aG9yTmFtZTogYXV0aG9yTmFtZSxcblx0XHRcdFx0YXV0aG9yQnk6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJCeVwiIClcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dGhpcy5lbGVtZW50LmF1dGhvckNvbnRhaW5lci5pbm5lckhUTUwgPSBhdXRob3JIdG1sO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9va1ByZXZpZXc7XG4iLCIvKipcbiAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgdG8gYWRkLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBlbGVtZW50LCBjbGFzc05hbWUgKSB7XG5cdHZhciBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoIFwiIFwiICk7XG5cblx0aWYgKCAtMSA9PT0gY2xhc3Nlcy5pbmRleE9mKCBjbGFzc05hbWUgKSApIHtcblx0XHRjbGFzc2VzLnB1c2goIGNsYXNzTmFtZSApO1xuXHR9XG5cblx0ZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XG59O1xuIiwidmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuLy4uL2FkZENsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBBZGRzIGEgQkVNIG1vZGlmaWVyIHRvIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kaWZpZXIgTW9kaWZpZXIgdG8gYWRkIHRvIHRoZSB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRDbGFzcyBUaGUgdGFyZ2V0IHRvIGFkZCB0aGUgbW9kaWZpZXIgdG9cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFBhcmVudCBUaGUgcGFyZW50IGluIHdoaWNoIHRoZSB0YXJnZXQgc2hvdWxkIGJlXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MsIHRhcmdldFBhcmVudCApIHtcblx0dmFyIGVsZW1lbnQgPSB0YXJnZXRQYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggdGFyZ2V0Q2xhc3MgKVswXTtcblx0dmFyIG5ld0NsYXNzID0gYWRkTW9kaWZpZXJUb0NsYXNzKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MgKTtcblxuXHRhZGRDbGFzcyggZWxlbWVudCwgbmV3Q2xhc3MgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNb2RpZmllcjtcbiIsIi8qKlxuICogQWRkcyBhIG1vZGlmaWVyIHRvIGEgY2xhc3MgbmFtZSwgbWFrZXMgc3VyZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBUaGUgbW9kaWZpZXIgdG8gYWRkIHRvIHRoZSBjbGFzcyBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSB0byBhZGQgdGhlIG1vZGlmaWVyIHRvLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuZXcgY2xhc3Mgd2l0aCB0aGUgbW9kaWZpZXIuXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyVG9DbGFzcyggbW9kaWZpZXIsIGNsYXNzTmFtZSApIHtcblx0dmFyIGJhc2VDbGFzcyA9IGNsYXNzTmFtZS5yZXBsYWNlKCAvLS0uKy8sIFwiXCIgKTtcblxuXHRyZXR1cm4gYmFzZUNsYXNzICsgXCItLVwiICsgbW9kaWZpZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTW9kaWZpZXJUb0NsYXNzO1xuIiwidmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSggXCIuLy4uL3JlbW92ZUNsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgQkVNIG1vZGlmaWVyIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBNb2RpZmllciB0byBhZGQgdG8gdGhlIHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldENsYXNzIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBtb2RpZmllciB0b1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0UGFyZW50IFRoZSBwYXJlbnQgaW4gd2hpY2ggdGhlIHRhcmdldCBzaG91bGQgYmVcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTW9kaWZpZXIoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcywgdGFyZ2V0UGFyZW50ICkge1xuXHR2YXIgZWxlbWVudCA9IHRhcmdldFBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB0YXJnZXRDbGFzcyApWzBdO1xuXHR2YXIgbmV3Q2xhc3MgPSBhZGRNb2RpZmllclRvQ2xhc3MoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcyApO1xuXG5cdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBuZXdDbGFzcyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZU1vZGlmaWVyO1xuIiwiLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGltYWdlIGRpc3BsYXkgbW9kZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRpc3BsYXkgbW9kZSBvZiB0aGUgaW1hZ2UuXG4gKi9cbmZ1bmN0aW9uIGltYWdlRGlzcGxheU1vZGUoIGltYWdlICkge1xuXHRpZiAoIGltYWdlLmhlaWdodCA+IGltYWdlLndpZHRoICkge1xuXHRcdHJldHVybiBcInBvcnRyYWl0XCI7XG5cdH1cblxuXHRyZXR1cm4gXCJsYW5kc2NhcGVcIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbWFnZURpc3BsYXlNb2RlO1xuIiwiLyoqXG4gKiBDbGVhbnMgc3BhY2VzIGZyb20gdGhlIGh0bWwuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBodG1sIFRoZSBodG1sIHRvIG1pbmltaXplLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBtaW5pbWl6ZWQgaHRtbCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG1pbmltaXplSHRtbCggaHRtbCApIHtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLyhcXHMrKS9nLCBcIiBcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvPiA8L2csIFwiPjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvID4vZywgXCI+XCIgKTtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLz4gL2csIFwiPlwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gPC9nLCBcIjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvICQvLCBcIlwiICk7XG5cblx0cmV0dXJuIGh0bWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWluaW1pemVIdG1sO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGNsYXNzIGZyb20uXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byByZW1vdmUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIGNsYXNzTmFtZSApIHtcblx0dmFyIGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCggXCIgXCIgKTtcblx0dmFyIGZvdW5kQ2xhc3MgPSBjbGFzc2VzLmluZGV4T2YoIGNsYXNzTmFtZSApO1xuXG5cdGlmICggLTEgIT09IGZvdW5kQ2xhc3MgKSB7XG5cdFx0Y2xhc3Nlcy5zcGxpY2UoIGZvdW5kQ2xhc3MsIDEgKTtcblx0fVxuXG5cdGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCBcIiBcIiApO1xufTtcbiIsInZhciBpc0VtcHR5ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VtcHR5XCIgKTtcblxudmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuL2FkZENsYXNzXCIgKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoIFwiLi9yZW1vdmVDbGFzc1wiICk7XG5cbi8qKlxuICogTWFrZXMgdGhlIHJlbmRlcmVkIGRlc2NyaXB0aW9uIGdyYXkgaWYgbm8gZGVzY3JpcHRpb24gaGFzIGJlZW4gc2V0IGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbkVsZW1lbnQgVGFyZ2V0IGRlc2NyaXB0aW9uIGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBDdXJyZW50IGRlc2NyaXB0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckRlc2NyaXB0aW9uKCBkZXNjcmlwdGlvbkVsZW1lbnQsIGRlc2NyaXB0aW9uICkge1xuXHRpZiAoIGlzRW1wdHkoIGRlc2NyaXB0aW9uICkgKSB7XG5cdFx0YWRkQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLXJlbmRlclwiICk7XG5cdFx0cmVtb3ZlQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLWRlZmF1bHRcIiApO1xuXHR9IGVsc2Uge1xuXHRcdGFkZENsYXNzKCBkZXNjcmlwdGlvbkVsZW1lbnQsIFwiZGVzYy1kZWZhdWx0XCIgKTtcblx0XHRyZW1vdmVDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtcmVuZGVyXCIgKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckRlc2NyaXB0aW9uO1xuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzXCIgKTtcbnZhciBtaW5pbWl6ZUh0bWwgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvbWluaW1pemVIdG1sXCIgKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgaW5wdXRmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGUgVGVtcGxhdGUgb2JqZWN0IHRvIHVzZS5cbiAqIEByZXR1cm5zIHtUZXh0RmllbGR9IFRoZSB0ZXh0ZmllbGQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbnB1dEZpZWxkRmFjdG9yeSggdGVtcGxhdGUgKSB7XG5cblx0dmFyIGRlZmF1bHRBdHRyaWJ1dGVzID0ge1xuXHRcdHZhbHVlOiBcIlwiLFxuXHRcdGNsYXNzTmFtZTogXCJcIixcblx0XHRpZDogXCJcIixcblx0XHRwbGFjZWhvbGRlcjogXCJcIixcblx0XHRuYW1lOiBcIlwiLFxuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGxhYmVsQ2xhc3NOYW1lOiBcIlwiXG5cdH07XG5cblx0LyoqXG5cdCAqIFJlcHJlc2VudHMgYW4gSFRNTCB0ZXh0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIFRoZSBhdHRyaWJ1dGVzIHRvIHNldCBvbiB0aGUgSFRNTCBlbGVtZW50XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLm5hbWUgVGhlIG5hbWUgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5pZCBUaGUgaWQgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5jbGFzc05hbWUgVGhlIGNsYXNzIGZvciB0aGlzIHRleHQgZmllbGRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMudGl0bGUgVGhlIHRpdGxlIHRoYXQgZGVzY3JpYmVzIHRoaXMgdGV4dCBmaWVsZFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGZ1bmN0aW9uIFRleHRGaWVsZCggYXR0cmlidXRlcyApIHtcblx0XHRhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcblx0XHRhdHRyaWJ1dGVzID0gZGVmYXVsdHMoIGF0dHJpYnV0ZXMsIGRlZmF1bHRBdHRyaWJ1dGVzICk7XG5cblx0XHR0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBIVE1MIGF0dHJpYnV0ZXMgc2V0IGZvciB0aGlzIHRleHQgZmllbGRcblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIEhUTUwgYXR0cmlidXRlc1xuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHRleHQgZmllbGQgdG8gSFRNTFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVuZGVyZWQgSFRNTFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaHRtbCA9IHRlbXBsYXRlKCB0aGlzLmdldEF0dHJpYnV0ZXMoKSApO1xuXG5cdFx0aHRtbCA9IG1pbmltaXplSHRtbCggaHRtbCApO1xuXG5cdFx0cmV0dXJuIGh0bWw7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoaXMgaW5wdXQgZmllbGRcblx0ICovXG5cdFRleHRGaWVsZC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dGhpcy5fYXR0cmlidXRlcy52YWx1ZSA9IHZhbHVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaWVsZFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBzZXQgb24gdGhpcyBpbnB1dCBmaWVsZFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5zZXRDbGFzc05hbWUgPSBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdHRoaXMuX2F0dHJpYnV0ZXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdHJldHVybiBUZXh0RmllbGQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3Rvcnk7XG4iLCJ2YXIgaW5wdXRGaWVsZEZhY3RvcnkgPSByZXF1aXJlKCBcIi4vaW5wdXRGaWVsZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3RvcnkoIHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5maWVsZHMudGV4dCApO1xuIiwidmFyIGlucHV0RmllbGRGYWN0b3J5ID0gcmVxdWlyZSggXCIuL2lucHV0RmllbGRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0RmllbGRGYWN0b3J5KCByZXF1aXJlKCBcIi4uL3RlbXBsYXRlc1wiICkuZmllbGRzLnRleHRhcmVhICk7XG4iLCJ2YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2NvbGxlY3Rpb24vZm9yRWFjaFwiICk7XG5cbnZhciBhZGRDbGFzcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9hZGRDbGFzcy5qc1wiICk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvcmVtb3ZlQ2xhc3MuanNcIiApO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmluZGluZ3MgVGhlIGZpZWxkcyB0byBiaW5kLlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gYmluZCB0aGUgZXZlbnRzIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBhbHdheXNPcGVuIFdoZXRoZXIgdGhlIGlucHV0IGZvcm0gc2hvdWxkIGFsd2F5cyBiZSBvcGVuLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFByZXZpZXdFdmVudHMoIGJpbmRpbmdzLCBlbGVtZW50LCBhbHdheXNPcGVuICkge1xuXHR0aGlzLl9iaW5kaW5ncyA9IGJpbmRpbmdzO1xuXHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHR0aGlzLl9hbHdheXNPcGVuID0gYWx3YXlzT3Blbjtcbn1cblxuLyoqXG4gKiBCaW5kIHRoZSBldmVudHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVkaXRUb2dnbGUgLSBUaGUgZWRpdCB0b2dnbGUgZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IGNsb3NlRWRpdG9yIC0gVGhlIGJ1dHRvbiB0byBjbG9zZSB0aGUgZWRpdG9yXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiggZWRpdFRvZ2dsZSwgY2xvc2VFZGl0b3IgKSB7XG5cdGlmICggIXRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0ZWRpdFRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIHRoaXMudG9nZ2xlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHRcdGNsb3NlRWRpdG9yLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgdGhpcy5jbG9zZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0fVxuXG5cdC8vIExvb3AgdGhyb3VnaCB0aGUgYmluZGluZ3MgYW5kIGJpbmQgYSBjbGljayBoYW5kbGVyIHRvIHRoZSBjbGljayB0byBmb2N1cyB0aGUgZm9jdXMgZWxlbWVudC5cblx0Zm9yRWFjaCggdGhpcy5fYmluZGluZ3MsIHRoaXMuYmluZElucHV0RXZlbnQuYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSBldmVudCBmb3IgdGhlIGlucHV0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJpbmRpbmcgVGhlIGZpZWxkIHRvIGJpbmQuXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRJbnB1dEV2ZW50ID0gZnVuY3Rpb24oIGJpbmRpbmcgKSB7XG5cdHZhciBwcmV2aWV3RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGJpbmRpbmcucHJldmlldyApWzBdO1xuXHR2YXIgaW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LmlucHV0WyBiaW5kaW5nLmlucHV0RmllbGQgXTtcblxuXHQvLyBNYWtlIHRoZSBwcmV2aWV3IGVsZW1lbnQgY2xpY2sgb3BlbiB0aGUgZWRpdG9yIGFuZCBmb2N1cyB0aGUgY29ycmVjdCBpbnB1dC5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm9wZW5FZGl0b3IoKTtcblx0XHRpbnB1dEVsZW1lbnQuZm9jdXMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIGZvY3VzaW5nIGFuIGlucHV0LCB1cGRhdGUgdGhlIGNhcmV0cy5cblx0aW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiZm9jdXNcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlRm9jdXNDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIHJlbW92aW5nIGZvY3VzIGZyb20gYW4gZWxlbWVudCwgdXBkYXRlIHRoZSBjYXJldHMuXG5cdGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImJsdXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblxuXHRcdHRoaXMuX3VwZGF0ZUZvY3VzQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEhvdmVyID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlSG92ZXJDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHRwcmV2aWV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG5cblx0XHR0aGlzLl91cGRhdGVIb3ZlckNhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBPcGVucyB0aGUgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLm9wZW5FZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5lZGl0VG9nZ2xlLCAgICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdC8vIFNob3cgdGhlc2UgZWxlbWVudHMuXG5cdHJlbW92ZUNsYXNzKCB0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lciwgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0cmVtb3ZlQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogQ2xvc2VzIHRoZSBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuY2xvc2VFZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblxuXHQvLyBTaG93IHRoZXNlIGVsZW1lbnRzLlxuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS50b2dnbGVFZGl0b3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB0aGlzLm9wZW5lZCApIHtcblx0XHR0aGlzLmNsb3NlRWRpdG9yKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5vcGVuRWRpdG9yKCk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBjYXJldHMgYmVmb3JlIHRoZSBwcmV2aWV3IGFuZCBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUZvY3VzQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBmb2N1c2VkTGFiZWwsIGZvY3VzZWRQcmV2aWV3O1xuXG5cdC8vIERpc2FibGUgYWxsIGNhcmV0cyBvbiB0aGUgbGFiZWxzLlxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQubGFiZWwsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0tZm9jdXNcIiApO1xuXHR9ICk7XG5cblx0Ly8gRGlzYWJsZSBhbGwgY2FyZXRzIG9uIHRoZSBwcmV2aWV3cy5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LnByZXZpZXcsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jb250YWluZXItLWZvY3VzXCIgKTtcblx0fSApO1xuXG5cdGlmICggbnVsbCAhPT0gdGhpcy5fY3VycmVudEZvY3VzICkge1xuXHRcdGZvY3VzZWRMYWJlbCA9IHRoaXMuZWxlbWVudC5sYWJlbFsgdGhpcy5fY3VycmVudEZvY3VzIF07XG5cdFx0Zm9jdXNlZFByZXZpZXcgPSB0aGlzLmVsZW1lbnQucHJldmlld1sgdGhpcy5fY3VycmVudEZvY3VzIF07XG5cblx0XHRhZGRDbGFzcyggZm9jdXNlZExhYmVsLCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0tZm9jdXNcIiApO1xuXHRcdGFkZENsYXNzKCBmb2N1c2VkUHJldmlldywgXCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyLS1mb2N1c1wiICk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBob3ZlciBjYXJldHMgYmVmb3JlIHRoZSBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUhvdmVyQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBob3ZlcmVkTGFiZWw7XG5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmxhYmVsLCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRyZW1vdmVDbGFzcyggZWxlbWVudCwgXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWwtLWhvdmVyXCIgKTtcblx0fSApO1xuXG5cdGlmICggbnVsbCAhPT0gdGhpcy5fY3VycmVudEhvdmVyICkge1xuXHRcdGhvdmVyZWRMYWJlbCA9IHRoaXMuZWxlbWVudC5sYWJlbFsgdGhpcy5fY3VycmVudEhvdmVyIF07XG5cblx0XHRhZGRDbGFzcyggaG92ZXJlZExhYmVsLCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0taG92ZXJcIiApO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpZXdFdmVudHM7XG4iLCI7KGZ1bmN0aW9uKCkge1xuICB2YXIgdW5kZWZpbmVkO1xuXG4gIHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuICB2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuICB2YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuICB2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbiAgdmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUtRVM1IGVudmlyb25tZW50cy4gKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCBhcyB0aGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuICovXG4gIHZhciBWRVJTSU9OID0gJzQuMTYuNCc7XG5cbiAgLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG4gIHZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4gIC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbiAgdmFyIHJlVW5lc2NhcGVkSHRtbCA9IC9bJjw+XCInXS9nLFxuICAgICAgcmVIYXNVbmVzY2FwZWRIdG1sID0gUmVnRXhwKHJlVW5lc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4gIC8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG4gIHZhciBodG1sRXNjYXBlcyA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OydcbiAgfTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbiAgdmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAgICogc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlPZmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVByb3BlcnR5T2Yob2JqZWN0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLmVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICB2YXIgZXNjYXBlSHRtbENoYXIgPSBiYXNlUHJvcGVydHlPZihodG1sRXNjYXBlcyk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gICAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICAgKiBvZiB2YWx1ZXMuXG4gICAqL1xuICB2YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG4gIC8qKiBVc2VkIHRvIGxvb2t1cCB1bm1pbmlmaWVkIGZ1bmN0aW9uIG5hbWVzLiAqL1xuICB2YXIgcmVhbE5hbWVzID0ge307XG5cbiAgLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG4gIHZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAgICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAgIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNBcnJheSgnYWJjJyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNBcnJheShfLm5vb3ApO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAgICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2Uoe30pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAgICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8udG9TdHJpbmcobnVsbCk7XG4gICAqIC8vID0+ICcnXG4gICAqXG4gICAqIF8udG9TdHJpbmcoLTApO1xuICAgKiAvLyA9PiAnLTAnXG4gICAqXG4gICAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gJzEsMiwzJ1xuICAgKi9cbiAgZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgXCImXCIsIFwiPFwiLCBcIj5cIiwgJ1wiJywgYW5kIFwiJ1wiIGluIGBzdHJpbmdgIHRvIHRoZWlyXG4gICAqIGNvcnJlc3BvbmRpbmcgSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogKipOb3RlOioqIE5vIG90aGVyIGNoYXJhY3RlcnMgYXJlIGVzY2FwZWQuIFRvIGVzY2FwZSBhZGRpdGlvbmFsXG4gICAqIGNoYXJhY3RlcnMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICAgKlxuICAgKiBUaG91Z2ggdGhlIFwiPlwiIGNoYXJhY3RlciBpcyBlc2NhcGVkIGZvciBzeW1tZXRyeSwgY2hhcmFjdGVycyBsaWtlXG4gICAqIFwiPlwiIGFuZCBcIi9cIiBkb24ndCBuZWVkIGVzY2FwaW5nIGluIEhUTUwgYW5kIGhhdmUgbm8gc3BlY2lhbCBtZWFuaW5nXG4gICAqIHVubGVzcyB0aGV5J3JlIHBhcnQgb2YgYSB0YWcgb3IgdW5xdW90ZWQgYXR0cmlidXRlIHZhbHVlLiBTZWVcbiAgICogW01hdGhpYXMgQnluZW5zJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzKVxuICAgKiAodW5kZXIgXCJzZW1pLXJlbGF0ZWQgZnVuIGZhY3RcIikgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogV2hlbiB3b3JraW5nIHdpdGggSFRNTCB5b3Ugc2hvdWxkIGFsd2F5c1xuICAgKiBbcXVvdGUgYXR0cmlidXRlIHZhbHVlc10oaHR0cDovL3dvbmtvLmNvbS9wb3N0L2h0bWwtZXNjYXBpbmcpIHRvIHJlZHVjZVxuICAgKiBYU1MgdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnKTtcbiAgICogLy8gPT4gJ2ZyZWQsIGJhcm5leSwgJmFtcDsgcGViYmxlcydcbiAgICovXG4gIGZ1bmN0aW9uIGVzY2FwZShzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICAgIHJldHVybiAoc3RyaW5nICYmIHJlSGFzVW5lc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgICA/IHN0cmluZy5yZXBsYWNlKHJlVW5lc2NhcGVkSHRtbCwgZXNjYXBlSHRtbENoYXIpXG4gICAgICA6IHN0cmluZztcbiAgfVxuXG4gIHZhciBfID0geyAnZXNjYXBlJzogZXNjYXBlIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICB2YXIgdGVtcGxhdGVzID0ge1xuICAgICdmYWNlYm9va0F1dGhvcic6IHt9LFxuICAgICdmYWNlYm9va1ByZXZpZXcnOiB7fSxcbiAgICAnZmllbGRzJzoge1xuICAgICAgICAnYnV0dG9uJzoge30sXG4gICAgICAgICd0ZXh0Jzoge30sXG4gICAgICAgICd0ZXh0YXJlYSc6IHt9XG4gICAgfSxcbiAgICAnaW1hZ2VQbGFjZWhvbGRlcic6IHt9LFxuICAgICd0d2l0dGVyUHJldmlldyc6IHt9XG4gIH07XG5cbiAgdGVtcGxhdGVzWydmYWNlYm9va0F1dGhvciddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8c3BhbiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3dlYnNpdGUtLWZhY2Vib29rLXBpcGVcIj58PC9zcGFuPiAnICtcbiAgICBfX2UoIGF1dGhvckJ5ICkgK1xuICAgICdcXG48c3BhbiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX2F1dGhvci0tZmFjZWJvb2tcIj4nICtcbiAgICBfX2UoIGF1dGhvck5hbWUgKSArXG4gICAgJzwvc3Bhbj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZhY2Vib29rUHJldmlldyddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlldyBlZGl0YWJsZS1wcmV2aWV3LS1mYWNlYm9va1wiPlxcblx0PGgzIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2hlYWRpbmcgc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1leWVcIj4nICtcbiAgICBfX2UoIGkxOG4uc25pcHBldFByZXZpZXcgKSArXG4gICAgJzwvaDM+XFxuXFxuXHQ8c2VjdGlvbiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX2lubmVyIGVkaXRhYmxlLXByZXZpZXdfX2lubmVyLS1mYWNlYm9va1wiPlxcblx0XHQ8ZGl2IGNsYXNzPVwic29jaWFsLXByZXZpZXdfX2lubmVyIHNvY2lhbC1wcmV2aWV3X19pbm5lci0tZmFjZWJvb2tcIj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZSBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXIgZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCI+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLWZhY2Vib29rIGVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXRpdGxlXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC50aXRsZSApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLWZhY2Vib29rIGVkaXRhYmxlLXByZXZpZXdfX2Rlc2NyaXB0aW9uLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWRlc2NyaXB0aW9uXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC5kZXNjcmlwdGlvbiApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLW5vLWNhcmV0IGVkaXRhYmxlLXByZXZpZXdfX3dlYnNpdGUtLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stdXJsXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC5iYXNlVXJsICkgK1xuICAgICdcXG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1hdXRob3JcIj48L3NwYW4+XFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9zZWN0aW9uPlxcblxcblx0PGgzIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2hlYWRpbmcgc25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWljb24tZWRpdFwiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWydidXR0b24nXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbiAgICBmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxidXR0b25cXG5cdHR5cGU9XCJidXR0b25cIlxcblx0JztcbiAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4+XFxuXHQnICtcbiAgICBfX2UoIHZhbHVlICkgK1xuICAgICdcXG48L2J1dHRvbj4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0J10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZSwgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8bGFiZWwnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnIGZvcj1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuXG4gICAgIGlmICggbGFiZWxDbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICcgY2xhc3M9XCInICtcbiAgICBfX2UoIGxhYmVsQ2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJz4nO1xuXG4gICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHRpdGxlICkgK1xuICAgICc8L2xhYmVsPic7XG4gICAgIH0gZWxzZSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiXFxuXHRcdCc7XG4gICAgIGlmICggdmFsdWUgKSB7XG4gICAgX19wICs9ICd2YWx1ZT1cIicgK1xuICAgIF9fZSggdmFsdWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggcGxhY2Vob2xkZXIgKSB7XG4gICAgX19wICs9ICdwbGFjZWhvbGRlcj1cIicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggY2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBuYW1lICkge1xuICAgIF9fcCArPSAnbmFtZT1cIicgK1xuICAgIF9fZSggbmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdC8+XFxuJztcbiAgICAgaWYgKCAhIGlkICkge1xuICAgIF9fcCArPSAnPC9sYWJlbD4nO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0YXJlYSddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIGZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGxhYmVsJztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJyBmb3I9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cblxuICAgICBpZiAoIGxhYmVsQ2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnIGNsYXNzPVwiJyArXG4gICAgX19lKCBsYWJlbENsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICc+JztcblxuICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApICtcbiAgICAnPC9sYWJlbD4nO1xuICAgICB9IGVsc2Uge1xuICAgIF9fcCArPVxuICAgIF9fZSggdGl0bGUgKTtcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHQ8dGV4dGFyZWFcXG5cdFx0ICAgJztcbiAgICAgaWYgKCBwbGFjZWhvbGRlciApIHtcbiAgICBfX3AgKz0gJ3BsYWNlaG9sZGVyPVwiJyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0ICAgJztcbiAgICAgaWYgKCBjbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICdjbGFzcz1cIicgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQgICAnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQgICAnO1xuICAgICBpZiAoIG5hbWUgKSB7XG4gICAgX19wICs9ICduYW1lPVwiJyArXG4gICAgX19lKCBuYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Plxcblx0XHQnO1xuICAgICBpZiAodmFsdWUpIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHZhbHVlICk7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0PC90ZXh0YXJlYT5cXG4nO1xuICAgICBpZiAoICEgaWQgKSB7XG4gICAgX19wICs9ICc8L2xhYmVsPic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snaW1hZ2VQbGFjZWhvbGRlciddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVxcJycgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcXCc+JyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnPC9kaXY+JztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWyd0d2l0dGVyUHJldmlldyddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlldyBlZGl0YWJsZS1wcmV2aWV3LS10d2l0dGVyXCI+XFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWV5ZVwiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0UHJldmlldyApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxzZWN0aW9uIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19faW5uZXIgZWRpdGFibGUtcHJldmlld19faW5uZXItLXR3aXR0ZXJcIj5cXG5cdFx0PGRpdiBjbGFzcz1cInNvY2lhbC1wcmV2aWV3X19pbm5lciBzb2NpYWwtcHJldmlld19faW5uZXItLXR3aXR0ZXJcIj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZSBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlciBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlciBlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiPlxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS10d2l0dGVyIGVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCIgPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItdGl0bGUgXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC50aXRsZSApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLXR3aXR0ZXIgZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLXR3aXR0ZXIgdHdpdHRlci1wcmV2aWV3X19kZXNjcmlwdGlvbiBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItZGVzY3JpcHRpb25cIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmRlc2NyaXB0aW9uICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tbm8tY2FyZXQgZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tdHdpdHRlciBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC5iYXNlVXJsICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L3NlY3Rpb24+XFxuXFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3Igc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1lZGl0XCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRFZGl0b3IgKSArXG4gICAgJzwvaDM+XFxuXFxuXHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2Zvcm1cIj5cXG5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgaWYgKGZyZWVNb2R1bGUpIHtcbiAgICAoZnJlZU1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVzKS50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXM7XG4gICAgZnJlZUV4cG9ydHMudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICB9XG4gIGVsc2Uge1xuICAgIHJvb3QudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICB9XG59LmNhbGwodGhpcykpO1xuIiwiLyoganNoaW50IGJyb3dzZXI6IHRydWUgKi9cblxudmFyIGlzRWxlbWVudCA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvaXNFbGVtZW50XCIgKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvY2xvbmVcIiApO1xudmFyIGRlZmF1bHRzRGVlcCA9IHJlcXVpcmUoIFwibG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXBcIiApO1xuXG52YXIgSmVkID0gcmVxdWlyZSggXCJqZWRcIiApO1xuXG52YXIgcmVuZGVyRGVzY3JpcHRpb24gPSByZXF1aXJlKCBcIi4vaGVscGVycy9yZW5kZXJEZXNjcmlwdGlvblwiICk7XG52YXIgaW1hZ2VQbGFjZWhvbGRlciAgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbWFnZVBsYWNlaG9sZGVyXCIgKTtcbnZhciBiZW1BZGRNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9hZGRNb2RpZmllclwiICk7XG52YXIgYmVtUmVtb3ZlTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vcmVtb3ZlTW9kaWZpZXJcIiApO1xuXG52YXIgVGV4dEZpZWxkID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0SW5wdXRcIiApO1xudmFyIFRleHRBcmVhID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0YXJlYVwiICk7XG5cbnZhciBJbnB1dEVsZW1lbnQgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbnB1dFwiICk7XG52YXIgUHJldmlld0V2ZW50cyA9IHJlcXVpcmUoIFwiLi9wcmV2aWV3L2V2ZW50c1wiICk7XG5cbnZhciB0d2l0dGVyRWRpdG9yVGVtcGxhdGUgPSByZXF1aXJlKCBcIi4vdGVtcGxhdGVzXCIgKS50d2l0dGVyUHJldmlldztcblxudmFyIHR3aXR0ZXJEZWZhdWx0cyA9IHtcblx0ZGF0YToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH0sXG5cdGRlZmF1bHRWYWx1ZToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH0sXG5cdGJhc2VVUkw6IFwiZXhhbXBsZS5jb21cIixcblx0Y2FsbGJhY2tzOiB7XG5cdFx0dXBkYXRlU29jaWFsUHJldmlldzogZnVuY3Rpb24oKSB7fSxcblx0XHRtb2RpZnlUaXRsZTogZnVuY3Rpb24oIHRpdGxlICkge1xuXHRcdFx0cmV0dXJuIHRpdGxlO1xuXHRcdH0sXG5cdFx0bW9kaWZ5RGVzY3JpcHRpb246IGZ1bmN0aW9uKCBkZXNjcmlwdGlvbiApIHtcblx0XHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0XHR9LFxuXHRcdG1vZGlmeUltYWdlVXJsOiBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2VVcmw7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgaW5wdXRUd2l0dGVyUHJldmlld0JpbmRpbmdzID0gW1xuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fdGl0bGUtLXR3aXR0ZXJcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJ0aXRsZVwiXG5cdH0sXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcImltYWdlVXJsXCJcblx0fSxcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX2Rlc2NyaXB0aW9uLS10d2l0dGVyXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiZGVzY3JpcHRpb25cIlxuXHR9XG5dO1xuXG52YXIgV0lEVEhfVFdJVFRFUl9JTUFHRV9TTUFMTCA9IDEyMDtcbnZhciBXSURUSF9UV0lUVEVSX0lNQUdFX0xBUkdFID0gNTA2O1xudmFyIFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX1dJRFRIID0gMjgwO1xudmFyIFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX0hFSUdIVCA9IDE1MDtcblxuLyoqXG4gKiBAbW9kdWxlIHNuaXBwZXRQcmV2aWV3XG4gKi9cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjb25maWcgYW5kIG91dHB1dFRhcmdldCBmb3IgdGhlIFNuaXBwZXRQcmV2aWV3XG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cyAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gU25pcHBldCBwcmV2aWV3IG9wdGlvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyICAgICAgICAgICAgICAgLSBUaGUgcGxhY2Vob2xkZXIgdmFsdWVzIGZvciB0aGUgZmllbGRzLCB3aWxsIGJlIHNob3duIGFzXG4gKiBhY3R1YWwgcGxhY2Vob2xkZXJzIGluIHRoZSBpbnB1dHMgYW5kIGFzIGEgZmFsbGJhY2sgZm9yIHRoZSBwcmV2aWV3LlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci50aXRsZSAgICAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSB0aXRsZSBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgZGVzY3JpcHRpb24gZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGltYWdlIHVybCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZSAgICAgICAgICAgICAgLSBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhlIGZpZWxkcywgaWYgdGhlIHVzZXIgaGFzIG5vdFxuICogY2hhbmdlZCBhIGZpZWxkLCB0aGlzIHZhbHVlIHdpbGwgYmUgdXNlZCBmb3IgdGhlIGFuYWx5emVyLCBwcmV2aWV3IGFuZCB0aGUgcHJvZ3Jlc3MgYmFycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlICAgICAgICAtIERlZmF1bHQgdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbiAgLSBEZWZhdWx0IGRlc2NyaXB0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwgICAgIC0gRGVmYXVsdCBpbWFnZSB1cmwuXG4gKiBpdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmJhc2VVUkwgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIHR3aXR0ZXIuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICBvcHRzLnRhcmdldEVsZW1lbnQgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuY2FsbGJhY2tzICAgICAgICAgICAgICAgICAtIEZ1bmN0aW9ucyB0aGF0IGFyZSBjYWxsZWQgb24gc3BlY2lmaWMgaW5zdGFuY2VzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgb3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyAtIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBzb2NpYWwgcHJldmlldyBpcyB1cGRhdGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIGkxOG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBpMThuIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdHJhbnNsYXRpb24gb2JqZWN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnQgICAgICAgICAgICAgICAgICAtIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudCAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGVsZW1lbnRzIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5yZW5kZXJlZCAgICAgICAgICAgICAgIC0gVGhlIHJlbmRlcmVkIGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC50aXRsZSAgICAgICAgIC0gVGhlIHJlbmRlcmVkIHRpdGxlIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmltYWdlVXJsICAgICAgLSBUaGUgcmVuZGVyZWQgdXJsIHBhdGggZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24gICAtIFRoZSByZW5kZXJlZCB0d2l0dGVyIGRlc2NyaXB0aW9uIGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5pbnB1dCAgICAgICAgICAgICAgICAgIC0gVGhlIGlucHV0IGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC50aXRsZSAgICAgICAgICAgIC0gVGhlIHRpdGxlIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmltYWdlVXJsICAgICAgICAgLSBUaGUgdXJsIHBhdGggaW5wdXQgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQuZGVzY3JpcHRpb24gICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uIGlucHV0IGVsZW1lbnQuXG4gKlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5jb250YWluZXIgICAgICAgICAgICAgIC0gVGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmZvcm1Db250YWluZXIgICAgICAgICAgLSBUaGUgZm9ybSBjb250YWluZXIgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuZWRpdFRvZ2dsZSAgICAgICAgICAgICAtIFRoZSBidXR0b24gdGhhdCB0b2dnbGVzIHRoZSBlZGl0b3IgZm9ybS5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBkYXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgZGF0YSBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEudGl0bGUgICAgICAgICAgICAgICAgICAgICAtIFRoZSB0aXRsZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEuaW1hZ2VVcmwgICAgICAgICAgICAgICAgICAtIFRoZSB1cmwgcGF0aC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRhdGEuZGVzY3JpcHRpb24gICAgICAgICAgICAgICAtIFRoZSBtZXRhIGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGJhc2VVUkwgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gZ29vZ2xlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgVHdpdHRlclByZXZpZXcgPSBmdW5jdGlvbiggb3B0cywgaTE4biApIHtcblx0dGhpcy5pMThuID0gaTE4biB8fCB0aGlzLmNvbnN0cnVjdEkxOG4oKTtcblxuXHR0d2l0dGVyRGVmYXVsdHMucGxhY2Vob2xkZXIgPSB7XG5cdFx0dGl0bGU6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJUaGlzIGlzIGFuIGV4YW1wbGUgdGl0bGUgLSBlZGl0IGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJNb2RpZnkgeW91ciAlMSRzIGRlc2NyaXB0aW9uIGJ5IGVkaXRpbmcgaXQgcmlnaHQgaGVyZVwiICksXG5cdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fTtcblxuXHRkZWZhdWx0c0RlZXAoIG9wdHMsIHR3aXR0ZXJEZWZhdWx0cyApO1xuXG5cdGlmICggIWlzRWxlbWVudCggb3B0cy50YXJnZXRFbGVtZW50ICkgKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcIlRoZSBUd2l0dGVyIHByZXZpZXcgcmVxdWlyZXMgYSB2YWxpZCB0YXJnZXQgZWxlbWVudFwiICk7XG5cdH1cblxuXHR0aGlzLmRhdGEgPSBvcHRzLmRhdGE7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cdHRoaXMub3B0cyA9IG9wdHM7XG5cblx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgaTE4biBvYmplY3QgYmFzZWQgb24gcGFzc2VkIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNsYXRpb25zIC0gVGhlIHZhbHVlcyB0byB0cmFuc2xhdGUuXG4gKlxuICogQHJldHVybnMge0plZH0gLSBUaGUgSmVkIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmNvbnN0cnVjdEkxOG4gPSBmdW5jdGlvbiggdHJhbnNsYXRpb25zICkge1xuXHR2YXIgZGVmYXVsdFRyYW5zbGF0aW9ucyA9IHtcblx0XHRcImRvbWFpblwiOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdFwibG9jYWxlX2RhdGFcIjoge1xuXHRcdFx0XCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjoge1xuXHRcdFx0XHRcIlwiOiB7fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR0cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbnMgfHwge307XG5cblx0ZGVmYXVsdHNEZWVwKCB0cmFuc2xhdGlvbnMsIGRlZmF1bHRUcmFuc2xhdGlvbnMgKTtcblxuXHRyZXR1cm4gbmV3IEplZCggdHJhbnNsYXRpb25zICk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgdGhlIHRlbXBsYXRlIGFuZCBiaW5kIHRoZSBldmVudHMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVuZGVyVGVtcGxhdGUoKTtcblx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdHRoaXMudXBkYXRlUHJldmlldygpO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHNuaXBwZXQgZWRpdG9yIGFuZCBhZGRzIGl0IHRvIHRoZSB0YXJnZXRFbGVtZW50LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHR0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9IHR3aXR0ZXJFZGl0b3JUZW1wbGF0ZSgge1xuXHRcdHJlbmRlcmVkOiB7XG5cdFx0XHR0aXRsZTogXCJcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdFx0aW1hZ2VVcmw6IFwiXCIsXG5cdFx0XHRiYXNlVXJsOiB0aGlzLm9wdHMuYmFzZVVSTFxuXHRcdH0sXG5cdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlcixcblx0XHRpMThuOiB7XG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRlZGl0OiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIkVkaXQgJTEkcyBwcmV2aWV3XCIgKSwgXCJUd2l0dGVyXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdHNuaXBwZXRQcmV2aWV3OiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgcHJldmlld1wiICksIFwiVHdpdHRlclwiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRzbmlwcGV0RWRpdG9yOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZWRpdG9yXCIgKSwgXCJUd2l0dGVyXCIgKVxuXHRcdH1cblx0fSApO1xuXG5cdHRoaXMuZWxlbWVudCA9IHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci10aXRsZVwiIClbMF0sXG5cdFx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS10d2l0dGVyLWRlc2NyaXB0aW9uXCIgKVswXVxuXHRcdH0sXG5cdFx0ZmllbGRzOiB0aGlzLmdldEZpZWxkcygpLFxuXHRcdGNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXctLXR3aXR0ZXJcIiApWzBdLFxuXHRcdGZvcm1Db250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybVwiIClbMF0sXG5cdFx0ZWRpdFRvZ2dsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19lZGl0LWJ1dHRvblwiIClbMF0sXG5cdFx0Y2xvc2VFZGl0b3I6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fc3VibWl0XCIgKVswXSxcblx0XHRmb3JtRmllbGRzOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm0tZmllbGRcIiApLFxuXHRcdGhlYWRpbmdFZGl0b3I6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3JcIiApWzBdXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gdGhpcy5lbGVtZW50LmZpZWxkcy5pbWFnZVVybC5yZW5kZXIoKVxuXHRcdCsgdGhpcy5lbGVtZW50LmZpZWxkcy50aXRsZS5yZW5kZXIoKVxuXHRcdCsgdGhpcy5lbGVtZW50LmZpZWxkcy5kZXNjcmlwdGlvbi5yZW5kZXIoKTtcblxuXHR0aGlzLmVsZW1lbnQuaW5wdXQgPSB7XG5cdFx0dGl0bGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiIClbMF0sXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbMF0sXG5cdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF1cblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cyA9IHRoaXMuZ2V0RmllbGRFbGVtZW50cygpO1xuXHR0aGlzLmVsZW1lbnQuY2xvc2VFZGl0b3IgPSB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX3N1Ym1pdFwiIClbMF07XG5cblx0dGhpcy5lbGVtZW50LmxhYmVsID0ge1xuXHRcdHRpdGxlOiB0aGlzLmVsZW1lbnQuaW5wdXQudGl0bGUucGFyZW50Tm9kZSxcblx0XHRpbWFnZVVybDogdGhpcy5lbGVtZW50LmlucHV0LmltYWdlVXJsLnBhcmVudE5vZGUsXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbi5wYXJlbnROb2RlXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LnByZXZpZXcgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX3RpdGxlIGpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci10aXRsZVwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIudGl0bGUsXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgdGl0bGVcIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGRlc2NyaXB0aW9uOiBuZXcgVGV4dEFyZWEoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2Rlc2NyaXB0aW9uIGpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5kZXNjcmlwdGlvbixcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZGVzY3JpcHRpb25cIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGltYWdlVXJsOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19pbWFnZVVybCBqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGltYWdlXCIgKSxcblx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdCksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBmaWVsZCBlbGVtZW50cy5cbiAqXG4gKiBAcmV0dXJucyB7e3RpdGxlOiBJbnB1dEVsZW1lbnQsIGRlc2NyaXB0aW9uOiBJbnB1dEVsZW1lbnQsIGltYWdlVXJsOiBJbnB1dEVsZW1lbnR9fSBUaGUgZmllbGQgZWxlbWVudC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIHRpdGxlIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0IGRlc2NyaXB0aW9uOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF0sXG5cdFx0XHQge1xuXHRcdFx0XHQgY3VycmVudFZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHQgZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQgICAgLyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHRcdCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIGRlc2NyaXB0aW9uIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHQgXCJUd2l0dGVyXCJcblx0XHRcdFx0IClcblx0XHRcdCB9LFxuXHRcdFx0IHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQgKSxcblx0XHRpbWFnZVVybDogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHRcdGZhbGxiYWNrOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdClcblx0fTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgdHdpdHRlciBwcmV2aWV3LlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUudXBkYXRlUHJldmlldyA9IGZ1bmN0aW9uKCkge1xuLy8gVXBkYXRlIHRoZSBkYXRhLlxuXHR0aGlzLmRhdGEudGl0bGUgPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldElucHV0VmFsdWUoKTtcblx0dGhpcy5kYXRhLmltYWdlVXJsID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuaW1hZ2VVcmwuZ2V0SW5wdXRWYWx1ZSgpO1xuXG5cdC8vIFNldHMgdGhlIHRpdGxlIGZpZWxkXG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXQgdGhlIGRlc2NyaXB0aW9uIGZpZWxkIGFuZCBwYXJzZSB0aGUgc3R5bGluZyBvZiBpdC5cblx0dGhpcy5zZXREZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldHMgdGhlIEltYWdlIFVSTFxuXHR0aGlzLnNldEltYWdlKCB0aGlzLmRhdGEuaW1hZ2VVcmwgKTtcblxuXHQvLyBDbG9uZSBzbyB0aGUgZGF0YSBpc24ndCBjaGFuZ2VhYmxlLlxuXHR0aGlzLm9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcoIGNsb25lKCB0aGlzLmRhdGEgKSApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcmV2aWV3IHRpdGxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSBUaGUgbmV3IHRpdGxlLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0VGl0bGUgPSBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdHRpdGxlID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlUaXRsZSggdGl0bGUgKTtcblxuXHR0aGlzLmVsZW1lbnQucmVuZGVyZWQudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgcHJldmlldyBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIHRvIHNldC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCB0aGUgaW1hZ2UuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRJbWFnZUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGltYWdlIG9iamVjdCB3aXRoIHRoZSBuZXcgVVJMLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZVVybCBUaGUgaW1hZ2UgcGF0aC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRpbWFnZVVybCA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5SW1hZ2VVcmwoIGltYWdlVXJsICk7XG5cblx0aWYgKCBpbWFnZVVybCA9PT0gXCJcIiAmJiB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXHRcdHRoaXMuc2V0UGxhY2VIb2xkZXIoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCB0aGlzLmlzVG9vU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblx0XHRcdHRoaXMuc2V0UGxhY2VIb2xkZXIoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U2l6aW5nQ2xhc3MoIGltZyApO1xuXHRcdHRoaXMuYWRkSW1hZ2VUb0NvbnRhaW5lciggaW1hZ2VVcmwgKTtcblx0fS5iaW5kKCB0aGlzICk7XG5cblx0aW1nLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHQvLyBMb2FkIGltYWdlIHRvIHRyaWdnZXIgbG9hZCBvciBlcnJvciBldmVudC5cblx0aW1nLnNyYyA9IGltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBpbWFnZSBvZiB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGFpbmVyID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBpbWFnZSArIFwiKVwiO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250YWluZXIuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVJbWFnZUZyb21Db250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJcIjtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJvcGVyIENTUyBjbGFzcyBmb3IgdGhlIGN1cnJlbnQgaW1hZ2UuXG4gKiBAcGFyYW0ge0ltYWdlfSBpbWcgVGhlIGltYWdlIHRvIGJhc2UgdGhlIHNpemluZyBjbGFzcyBvbi5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFNpemluZ0NsYXNzID0gZnVuY3Rpb24oIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIHRoaXMuaXNTbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHR0aGlzLnNldFNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLnNldExhcmdlSW1hZ2VDbGFzc2VzKCk7XG5cblx0cmV0dXJuO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXggaW1hZ2Ugd2lkdGhcbiAqXG4gKiBAcGFyYW0ge0ltYWdlfSBpbWcgVGhlIGltYWdlIG9iamVjdCB0byB1c2UuXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgY2FsY3VsYXRlZCBtYXggd2lkdGguXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEw7XG5cdH1cblxuXHRyZXR1cm4gV0lEVEhfVFdJVFRFUl9JTUFHRV9MQVJHRTtcbn07XG4vKipcbiAqIFNldHMgdGhlIGRlZmF1bHQgdHdpdHRlciBwbGFjZWhvbGRlclxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0UGxhY2VIb2xkZXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmwsXG5cdFx0XCJcIixcblx0XHRmYWxzZSxcblx0XHRcInR3aXR0ZXJcIlxuXHQpO1xuXG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIHR3aXR0ZXIgcHJldmlldyBzaG91bGQgc3dpdGNoIHRvIHNtYWxsIGltYWdlIG1vZGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgc21hbGwuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5pc1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9XSURUSCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX0hFSUdIVFxuXHQpO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSB0d2l0dGVyIHByZXZpZXcgaW1hZ2UgaXMgdG9vIHNtYWxsXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmlzVG9vU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEwgfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIGZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBmYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRTbWFsbEltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIGZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBsYXJnZSBmYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZUxhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGltYWdlIGNsYXNzZXMuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVTbWFsbEltYWdlQ2xhc3NlcygpO1xuXHR0aGlzLnJlbW92ZUxhcmdlSW1hZ2VDbGFzc2VzKCk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSByZWxvYWRTbmlwcGV0VGV4dCBmdW5jdGlvbiB0byB0aGUgYmx1ciBvZiB0aGUgc25pcHBldCBpbnB1dHMuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBwcmV2aWV3RXZlbnRzID0gbmV3IFByZXZpZXdFdmVudHMoIGlucHV0VHdpdHRlclByZXZpZXdCaW5kaW5ncywgdGhpcy5lbGVtZW50LCB0cnVlICk7XG5cdHByZXZpZXdFdmVudHMuYmluZEV2ZW50cyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsIHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUd2l0dGVyUHJldmlldztcbiIsIi8qKlxuICogQHByZXNlcnZlIGplZC5qcyBodHRwczovL2dpdGh1Yi5jb20vU2xleEF4dG9uL0plZFxuICovXG4vKlxuLS0tLS0tLS0tLS1cbkEgZ2V0dGV4dCBjb21wYXRpYmxlIGkxOG4gbGlicmFyeSBmb3IgbW9kZXJuIEphdmFTY3JpcHQgQXBwbGljYXRpb25zXG5cbmJ5IEFsZXggU2V4dG9uIC0gQWxleFNleHRvbiBbYXRdIGdtYWlsIC0gQFNsZXhBeHRvblxuV1RGUEwgbGljZW5zZSBmb3IgdXNlXG5Eb2pvIENMQSBmb3IgY29udHJpYnV0aW9uc1xuXG5KZWQgb2ZmZXJzIHRoZSBlbnRpcmUgYXBwbGljYWJsZSBHTlUgZ2V0dGV4dCBzcGVjJ2Qgc2V0IG9mXG5mdW5jdGlvbnMsIGJ1dCBhbHNvIG9mZmVycyBzb21lIG5pY2VyIHdyYXBwZXJzIGFyb3VuZCB0aGVtLlxuVGhlIGFwaSBmb3IgZ2V0dGV4dCB3YXMgd3JpdHRlbiBmb3IgYSBsYW5ndWFnZSB3aXRoIG5vIGZ1bmN0aW9uXG5vdmVybG9hZGluZywgc28gSmVkIGFsbG93cyBhIGxpdHRsZSBtb3JlIG9mIHRoYXQuXG5cbk1hbnkgdGhhbmtzIHRvIEpvc2h1YSBJLiBNaWxsZXIgLSB1bnJ0c3RAY3Bhbi5vcmcgLSB3aG8gd3JvdGVcbmdldHRleHQuanMgYmFjayBpbiAyMDA4LiBJIHdhcyBhYmxlIHRvIHZldCBhIGxvdCBvZiBteSBpZGVhc1xuYWdhaW5zdCBoaXMuIEkgYWxzbyBtYWRlIHN1cmUgSmVkIHBhc3NlZCBhZ2FpbnN0IGhpcyB0ZXN0c1xuaW4gb3JkZXIgdG8gb2ZmZXIgZWFzeSB1cGdyYWRlcyAtLSBqc2dldHRleHQuYmVybGlvcy5kZVxuKi9cbihmdW5jdGlvbiAocm9vdCwgdW5kZWYpIHtcblxuICAvLyBTZXQgdXAgc29tZSB1bmRlcnNjb3JlLXN0eWxlIGZ1bmN0aW9ucywgaWYgeW91IGFscmVhZHkgaGF2ZVxuICAvLyB1bmRlcnNjb3JlLCBmZWVsIGZyZWUgdG8gZGVsZXRlIHRoaXMgc2VjdGlvbiwgYW5kIHVzZSBpdFxuICAvLyBkaXJlY3RseSwgaG93ZXZlciwgdGhlIGFtb3VudCBvZiBmdW5jdGlvbnMgdXNlZCBkb2Vzbid0XG4gIC8vIHdhcnJhbnQgaGF2aW5nIHVuZGVyc2NvcmUgYXMgYSBmdWxsIGRlcGVuZGVuY3kuXG4gIC8vIFVuZGVyc2NvcmUgMS4zLjAgd2FzIHVzZWQgdG8gcG9ydCBhbmQgaXMgbGljZW5zZWRcbiAgLy8gdW5kZXIgdGhlIE1JVCBMaWNlbnNlIGJ5IEplcmVteSBBc2hrZW5hcy5cbiAgdmFyIEFycmF5UHJvdG8gICAgPSBBcnJheS5wcm90b3R5cGUsXG4gICAgICBPYmpQcm90byAgICAgID0gT2JqZWN0LnByb3RvdHlwZSxcbiAgICAgIHNsaWNlICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgaGFzT3duUHJvcCAgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5LFxuICAgICAgbmF0aXZlRm9yRWFjaCA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICAgIGJyZWFrZXIgICAgICAgPSB7fTtcblxuICAvLyBXZSdyZSBub3QgdXNpbmcgdGhlIE9PUCBzdHlsZSBfIHNvIHdlIGRvbid0IG5lZWQgdGhlXG4gIC8vIGV4dHJhIGxldmVsIG9mIGluZGlyZWN0aW9uLiBUaGlzIHN0aWxsIG1lYW5zIHRoYXQgeW91XG4gIC8vIHN1YiBvdXQgZm9yIHJlYWwgYF9gIHRob3VnaC5cbiAgdmFyIF8gPSB7XG4gICAgZm9yRWFjaCA6IGZ1bmN0aW9uKCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0ICkge1xuICAgICAgdmFyIGksIGwsIGtleTtcbiAgICAgIGlmICggb2JqID09PSBudWxsICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggbmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCApIHtcbiAgICAgICAgb2JqLmZvckVhY2goIGl0ZXJhdG9yLCBjb250ZXh0ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICggb2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGggKSB7XG4gICAgICAgIGZvciAoIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICBpZiAoIGkgaW4gb2JqICYmIGl0ZXJhdG9yLmNhbGwoIGNvbnRleHQsIG9ialtpXSwgaSwgb2JqICkgPT09IGJyZWFrZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICgga2V5IGluIG9iaikge1xuICAgICAgICAgIGlmICggaGFzT3duUHJvcC5jYWxsKCBvYmosIGtleSApICkge1xuICAgICAgICAgICAgaWYgKCBpdGVyYXRvci5jYWxsIChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmogKSA9PT0gYnJlYWtlciApIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZXh0ZW5kIDogZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgIHRoaXMuZm9yRWFjaCggc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksIGZ1bmN0aW9uICggc291cmNlICkge1xuICAgICAgICBmb3IgKCB2YXIgcHJvcCBpbiBzb3VyY2UgKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9O1xuICAvLyBFTkQgTWluaWF0dXJlIHVuZGVyc2NvcmUgaW1wbFxuXG4gIC8vIEplZCBpcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gIHZhciBKZWQgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgLy8gU29tZSBtaW5pbWFsIGRlZmF1bHRzXG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIFwibG9jYWxlX2RhdGFcIiA6IHtcbiAgICAgICAgXCJtZXNzYWdlc1wiIDoge1xuICAgICAgICAgIFwiXCIgOiB7XG4gICAgICAgICAgICBcImRvbWFpblwiICAgICAgIDogXCJtZXNzYWdlc1wiLFxuICAgICAgICAgICAgXCJsYW5nXCIgICAgICAgICA6IFwiZW5cIixcbiAgICAgICAgICAgIFwicGx1cmFsX2Zvcm1zXCIgOiBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIlxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUaGVyZSBhcmUgbm8gZGVmYXVsdCBrZXlzLCB0aG91Z2hcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRoZSBkZWZhdWx0IGRvbWFpbiBpZiBvbmUgaXMgbWlzc2luZ1xuICAgICAgXCJkb21haW5cIiA6IFwibWVzc2FnZXNcIixcbiAgICAgIC8vIGVuYWJsZSBkZWJ1ZyBtb2RlIHRvIGxvZyB1bnRyYW5zbGF0ZWQgc3RyaW5ncyB0byB0aGUgY29uc29sZVxuICAgICAgXCJkZWJ1Z1wiIDogZmFsc2VcbiAgICB9O1xuXG4gICAgLy8gTWl4IGluIHRoZSBzZW50IG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zXG4gICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zICk7XG4gICAgdGhpcy50ZXh0ZG9tYWluKCB0aGlzLm9wdGlvbnMuZG9tYWluICk7XG5cbiAgICBpZiAoIG9wdGlvbnMuZG9tYWluICYmICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyB0aGlzLm9wdGlvbnMuZG9tYWluIF0gKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RleHQgZG9tYWluIHNldCB0byBub24tZXhpc3RlbnQgZG9tYWluOiBgJyArIG9wdGlvbnMuZG9tYWluICsgJ2AnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGdldHRleHQgc3BlYyBzZXRzIHRoaXMgY2hhcmFjdGVyIGFzIHRoZSBkZWZhdWx0XG4gIC8vIGRlbGltaXRlciBmb3IgY29udGV4dCBsb29rdXBzLlxuICAvLyBlLmcuOiBjb250ZXh0XFx1MDAwNGtleVxuICAvLyBJZiB5b3VyIHRyYW5zbGF0aW9uIGNvbXBhbnkgdXNlcyBzb21ldGhpbmcgZGlmZmVyZW50LFxuICAvLyBqdXN0IGNoYW5nZSB0aGlzIGF0IGFueSB0aW1lIGFuZCBpdCB3aWxsIHVzZSB0aGF0IGluc3RlYWQuXG4gIEplZC5jb250ZXh0X2RlbGltaXRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoIDQgKTtcblxuICBmdW5jdGlvbiBnZXRQbHVyYWxGb3JtRnVuYyAoIHBsdXJhbF9mb3JtX3N0cmluZyApIHtcbiAgICByZXR1cm4gSmVkLlBGLmNvbXBpbGUoIHBsdXJhbF9mb3JtX3N0cmluZyB8fCBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIik7XG4gIH1cblxuICBmdW5jdGlvbiBDaGFpbigga2V5LCBpMThuICl7XG4gICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIHRoaXMuX2kxOG4gPSBpMThuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgY2hhaW5hYmxlIGFwaSBmb3IgYWRkaW5nIGFyZ3MgcHJldHRpbHlcbiAgXy5leHRlbmQoIENoYWluLnByb3RvdHlwZSwge1xuICAgIG9uRG9tYWluIDogZnVuY3Rpb24gKCBkb21haW4gKSB7XG4gICAgICB0aGlzLl9kb21haW4gPSBkb21haW47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHdpdGhDb250ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0ICkge1xuICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGlmUGx1cmFsIDogZnVuY3Rpb24gKCBudW0sIHBrZXkgKSB7XG4gICAgICB0aGlzLl92YWwgPSBudW07XG4gICAgICB0aGlzLl9wa2V5ID0gcGtleTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZmV0Y2ggOiBmdW5jdGlvbiAoIHNBcnIgKSB7XG4gICAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoIHNBcnIgKSAhPSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICBzQXJyID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuICggc0FyciAmJiBzQXJyLmxlbmd0aCA/IEplZC5zcHJpbnRmIDogZnVuY3Rpb24oeCl7IHJldHVybiB4OyB9ICkoXG4gICAgICAgIHRoaXMuX2kxOG4uZGNucGdldHRleHQodGhpcy5fZG9tYWluLCB0aGlzLl9jb250ZXh0LCB0aGlzLl9rZXksIHRoaXMuX3BrZXksIHRoaXMuX3ZhbCksXG4gICAgICAgIHNBcnJcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBZGQgZnVuY3Rpb25zIHRvIHRoZSBKZWQgcHJvdG90eXBlLlxuICAvLyBUaGVzZSB3aWxsIGJlIHRoZSBmdW5jdGlvbnMgb24gdGhlIG9iamVjdCB0aGF0J3MgcmV0dXJuZWRcbiAgLy8gZnJvbSBjcmVhdGluZyBhIGBuZXcgSmVkKClgXG4gIC8vIFRoZXNlIHNlZW0gcmVkdW5kYW50LCBidXQgdGhleSBnemlwIHByZXR0eSB3ZWxsLlxuICBfLmV4dGVuZCggSmVkLnByb3RvdHlwZSwge1xuICAgIC8vIFRoZSBzZXhpZXIgYXBpIHN0YXJ0IHBvaW50XG4gICAgdHJhbnNsYXRlIDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gbmV3IENoYWluKCBrZXksIHRoaXMgKTtcbiAgICB9LFxuXG4gICAgdGV4dGRvbWFpbiA6IGZ1bmN0aW9uICggZG9tYWluICkge1xuICAgICAgaWYgKCAhIGRvbWFpbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRkb21haW47XG4gICAgICB9XG4gICAgICB0aGlzLl90ZXh0ZG9tYWluID0gZG9tYWluO1xuICAgIH0sXG5cbiAgICBnZXR0ZXh0IDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBrZXkgKSB7XG4gICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkY2dldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiAsIGtleSAvKiwgY2F0ZWdvcnkgKi8gKSB7XG4gICAgICAvLyBJZ25vcmVzIHRoZSBjYXRlZ29yeSBhbnl3YXlzXG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgbmdldHRleHQgOiBmdW5jdGlvbiAoIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZGNuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBwZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBkcGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGNwZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBrZXkvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIG5wZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIC8vIFRoZSBtb3N0IGZ1bGx5IHF1YWxpZmllZCBnZXR0ZXh0IGZ1bmN0aW9uLiBJdCBoYXMgZXZlcnkgb3B0aW9uLlxuICAgIC8vIFNpbmNlIGl0IGhhcyBldmVyeSBvcHRpb24sIHdlIGNhbiB1c2UgaXQgZnJvbSBldmVyeSBvdGhlciBtZXRob2QuXG4gICAgLy8gVGhpcyBpcyB0aGUgYnJlYWQgYW5kIGJ1dHRlci5cbiAgICAvLyBUZWNobmljYWxseSB0aGVyZSBzaG91bGQgYmUgb25lIG1vcmUgYXJndW1lbnQgaW4gdGhpcyBmdW5jdGlvbiBmb3IgJ0NhdGVnb3J5JyxcbiAgICAvLyBidXQgc2luY2Ugd2UgbmV2ZXIgdXNlIGl0LCB3ZSBtaWdodCBhcyB3ZWxsIG5vdCB3YXN0ZSB0aGUgYnl0ZXMgdG8gZGVmaW5lIGl0LlxuICAgIGRjbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSwgdmFsICkge1xuICAgICAgLy8gU2V0IHNvbWUgZGVmYXVsdHNcblxuICAgICAgcGx1cmFsX2tleSA9IHBsdXJhbF9rZXkgfHwgc2luZ3VsYXJfa2V5O1xuXG4gICAgICAvLyBVc2UgdGhlIGdsb2JhbCBkb21haW4gZGVmYXVsdCBpZiBvbmVcbiAgICAgIC8vIGlzbid0IGV4cGxpY2l0bHkgcGFzc2VkIGluXG4gICAgICBkb21haW4gPSBkb21haW4gfHwgdGhpcy5fdGV4dGRvbWFpbjtcblxuICAgICAgdmFyIGZhbGxiYWNrO1xuXG4gICAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlc1xuXG4gICAgICAvLyBObyBvcHRpb25zIGZvdW5kXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zICkge1xuICAgICAgICAvLyBUaGVyZSdzIGxpa2VseSBzb21ldGhpbmcgd3JvbmcsIGJ1dCB3ZSdsbCByZXR1cm4gdGhlIGNvcnJlY3Qga2V5IGZvciBlbmdsaXNoXG4gICAgICAgIC8vIFdlIGRvIHRoaXMgYnkgaW5zdGFudGlhdGluZyBhIGJyYW5kIG5ldyBKZWQgaW5zdGFuY2Ugd2l0aCB0aGUgZGVmYXVsdCBzZXRcbiAgICAgICAgLy8gZm9yIGV2ZXJ5dGhpbmcgdGhhdCBjb3VsZCBiZSBicm9rZW4uXG4gICAgICAgIGZhbGxiYWNrID0gbmV3IEplZCgpO1xuICAgICAgICByZXR1cm4gZmFsbGJhY2suZGNucGdldHRleHQuY2FsbCggZmFsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXksIHZhbCApO1xuICAgICAgfVxuXG4gICAgICAvLyBObyB0cmFuc2xhdGlvbiBkYXRhIHByb3ZpZGVkXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBkYXRhIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb21haW4gYCcgKyBkb21haW4gKyAnYCB3YXMgbm90IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXVsgXCJcIiBdICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBtZXRhIGluZm9ybWF0aW9uIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHRydXRoeSBrZXkuIE90aGVyd2lzZSB3ZSBtaWdodCBzdGFydCBsb29raW5nXG4gICAgICAvLyBpbnRvIHRoZSBlbXB0eSBzdHJpbmcga2V5LCB3aGljaCBpcyB0aGUgb3B0aW9ucyBmb3IgdGhlIGxvY2FsZVxuICAgICAgLy8gZGF0YS5cbiAgICAgIGlmICggISBzaW5ndWxhcl9rZXkgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdHJhbnNsYXRpb24ga2V5IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ICA9IGNvbnRleHQgPyBjb250ZXh0ICsgSmVkLmNvbnRleHRfZGVsaW1pdGVyICsgc2luZ3VsYXJfa2V5IDogc2luZ3VsYXJfa2V5LFxuICAgICAgICAgIGxvY2FsZV9kYXRhID0gdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhLFxuICAgICAgICAgIGRpY3QgPSBsb2NhbGVfZGF0YVsgZG9tYWluIF0sXG4gICAgICAgICAgZGVmYXVsdENvbmYgPSAobG9jYWxlX2RhdGEubWVzc2FnZXMgfHwgdGhpcy5kZWZhdWx0cy5sb2NhbGVfZGF0YS5tZXNzYWdlcylbXCJcIl0sXG4gICAgICAgICAgcGx1cmFsRm9ybXMgPSBkaWN0W1wiXCJdLnBsdXJhbF9mb3JtcyB8fCBkaWN0W1wiXCJdW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRpY3RbXCJcIl1bXCJwbHVyYWwtZm9ybXNcIl0gfHwgZGVmYXVsdENvbmYucGx1cmFsX2Zvcm1zIHx8IGRlZmF1bHRDb25mW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRlZmF1bHRDb25mW1wicGx1cmFsLWZvcm1zXCJdLFxuICAgICAgICAgIHZhbF9saXN0LFxuICAgICAgICAgIHJlcztcblxuICAgICAgdmFyIHZhbF9pZHg7XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gdmFsdWUgcGFzc2VkIGluOyBhc3N1bWUgc2luZ3VsYXIga2V5IGxvb2t1cC5cbiAgICAgICAgdmFsX2lkeCA9IDA7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFZhbHVlIGhhcyBiZWVuIHBhc3NlZCBpbjsgdXNlIHBsdXJhbC1mb3JtcyBjYWxjdWxhdGlvbnMuXG5cbiAgICAgICAgLy8gSGFuZGxlIGludmFsaWQgbnVtYmVycywgYnV0IHRyeSBjYXN0aW5nIHN0cmluZ3MgZm9yIGdvb2QgbWVhc3VyZVxuICAgICAgICBpZiAoIHR5cGVvZiB2YWwgIT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgdmFsID0gcGFyc2VJbnQoIHZhbCwgMTAgKTtcblxuICAgICAgICAgIGlmICggaXNOYU4oIHZhbCApICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbnVtYmVyIHRoYXQgd2FzIHBhc3NlZCBpbiBpcyBub3QgYSBudW1iZXIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFsX2lkeCA9IGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSh2YWwpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiBhIGRvbWFpbiBpc24ndCBmb3VuZFxuICAgICAgaWYgKCAhIGRpY3QgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZG9tYWluIG5hbWVkIGAnICsgZG9tYWluICsgJ2AgY291bGQgYmUgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhbF9saXN0ID0gZGljdFsga2V5IF07XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG1hdGNoLCB0aGVuIHJldmVydCBiYWNrIHRvXG4gICAgICAvLyBlbmdsaXNoIHN0eWxlIHNpbmd1bGFyL3BsdXJhbCB3aXRoIHRoZSBrZXlzIHBhc3NlZCBpbi5cbiAgICAgIGlmICggISB2YWxfbGlzdCB8fCB2YWxfaWR4ID4gdmFsX2xpc3QubGVuZ3RoICkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKGtleSwgZG9tYWluKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuXG4gICAgICAgIC8vIGNvbGxlY3QgdW50cmFuc2xhdGVkIHN0cmluZ3NcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1Zz09PXRydWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNbIGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSggdmFsICkgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMoKSggdmFsICkgXTtcbiAgICAgIH1cblxuICAgICAgcmVzID0gdmFsX2xpc3RbIHZhbF9pZHggXTtcblxuICAgICAgLy8gVGhpcyBpbmNsdWRlcyBlbXB0eSBzdHJpbmdzIG9uIHB1cnBvc2VcbiAgICAgIGlmICggISByZXMgICkge1xuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuICAgICAgICByZXR1cm4gcmVzWyBnZXRQbHVyYWxGb3JtRnVuYygpKCB2YWwgKSBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH0pO1xuXG5cbiAgLy8gV2UgYWRkIGluIHNwcmludGYgY2FwYWJpbGl0aWVzIGZvciBwb3N0IHRyYW5zbGF0aW9uIHZhbHVlIGludGVyb2xhdGlvblxuICAvLyBUaGlzIGlzIG5vdCBpbnRlcm5hbGx5IHVzZWQsIHNvIHlvdSBjYW4gcmVtb3ZlIGl0IGlmIHlvdSBoYXZlIHRoaXNcbiAgLy8gYXZhaWxhYmxlIHNvbWV3aGVyZSBlbHNlLCBvciB3YW50IHRvIHVzZSBhIGRpZmZlcmVudCBzeXN0ZW0uXG5cbiAgLy8gV2UgX3NsaWdodGx5XyBtb2RpZnkgdGhlIG5vcm1hbCBzcHJpbnRmIGJlaGF2aW9yIHRvIG1vcmUgZ3JhY2VmdWxseSBoYW5kbGVcbiAgLy8gdW5kZWZpbmVkIHZhbHVlcy5cblxuICAvKipcbiAgIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCAwLjctYmV0YTFcbiAgIGh0dHA6Ly93d3cuZGl2ZWludG9qYXZhc2NyaXB0LmNvbS9wcm9qZWN0cy9qYXZhc2NyaXB0LXNwcmludGZcblxuICAgQ29weXJpZ2h0IChjKSBBbGV4YW5kcnUgTWFyYXN0ZWFudSA8YWxleGFob2xpYyBbYXQpIGdtYWlsIChkb3RdIGNvbT5cbiAgIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAgICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gICAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCBub3IgdGhlXG4gICAgICAgICBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xuICAgICAgICAgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuICAgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbiAgIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbiAgIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEFsZXhhbmRydSBNYXJhc3RlYW51IEJFIExJQUJMRSBGT1IgQU5ZXG4gICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuICAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4gICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICAqL1xuICB2YXIgc3ByaW50ZiA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0cl9yZXBlYXQoaW5wdXQsIG11bHRpcGxpZXIpIHtcbiAgICAgIGZvciAodmFyIG91dHB1dCA9IFtdOyBtdWx0aXBsaWVyID4gMDsgb3V0cHV0Wy0tbXVsdGlwbGllcl0gPSBpbnB1dCkgey8qIGRvIG5vdGhpbmcgKi99XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIHZhciBzdHJfZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXN0cl9mb3JtYXQuY2FjaGUuaGFzT3duUHJvcGVydHkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgICBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0gPSBzdHJfZm9ybWF0LnBhcnNlKGFyZ3VtZW50c1swXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyX2Zvcm1hdC5mb3JtYXQuY2FsbChudWxsLCBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0sIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuZm9ybWF0ID0gZnVuY3Rpb24ocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIG5vZGVfdHlwZSA9ICcnLCBhcmcsIG91dHB1dCA9IFtdLCBpLCBrLCBtYXRjaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbm9kZV90eXBlID0gZ2V0X3R5cGUocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIGlmIChub2RlX3R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZV90eXBlID09PSAnYXJyYXknKSB7XG4gICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXTtcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBtYXRjaFsyXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICBpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXVtrXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gcHJvcGVydHkgXCIlc1wiIGRvZXMgbm90IGV4aXN0JywgbWF0Y2hbMl1ba10pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmcgPSBhcmdbbWF0Y2hbMl1ba11dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbbWF0Y2hbMV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL1tec10vLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3coc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzJywgZ2V0X3R5cGUoYXJnKSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEplZCBFRElUXG4gICAgICAgICAgaWYgKCB0eXBlb2YgYXJnID09ICd1bmRlZmluZWQnIHx8IGFyZyA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIGFyZyA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBKZWQgRURJVFxuXG4gICAgICAgICAgc3dpdGNoIChtYXRjaFs4XSkge1xuICAgICAgICAgICAgY2FzZSAnYic6IGFyZyA9IGFyZy50b1N0cmluZygyKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjJzogYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2QnOiBhcmcgPSBwYXJzZUludChhcmcsIDEwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlJzogYXJnID0gbWF0Y2hbN10gPyBhcmcudG9FeHBvbmVudGlhbChtYXRjaFs3XSkgOiBhcmcudG9FeHBvbmVudGlhbCgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2YnOiBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKG1hdGNoWzddKSA6IHBhcnNlRmxvYXQoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdvJzogYXJnID0gYXJnLnRvU3RyaW5nKDgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3MnOiBhcmcgPSAoKGFyZyA9IFN0cmluZyhhcmcpKSAmJiBtYXRjaFs3XSA/IGFyZy5zdWJzdHJpbmcoMCwgbWF0Y2hbN10pIDogYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1JzogYXJnID0gTWF0aC5hYnMoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd4JzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdYJzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYXJnID0gKC9bZGVmXS8udGVzdChtYXRjaFs4XSkgJiYgbWF0Y2hbM10gJiYgYXJnID49IDAgPyAnKycrIGFyZyA6IGFyZyk7XG4gICAgICAgICAgcGFkX2NoYXJhY3RlciA9IG1hdGNoWzRdID8gbWF0Y2hbNF0gPT0gJzAnID8gJzAnIDogbWF0Y2hbNF0uY2hhckF0KDEpIDogJyAnO1xuICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIFN0cmluZyhhcmcpLmxlbmd0aDtcbiAgICAgICAgICBwYWQgPSBtYXRjaFs2XSA/IHN0cl9yZXBlYXQocGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCkgOiAnJztcbiAgICAgICAgICBvdXRwdXQucHVzaChtYXRjaFs1XSA/IGFyZyArIHBhZCA6IHBhZCArIGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuY2FjaGUgPSB7fTtcblxuICAgIHN0cl9mb3JtYXQucGFyc2UgPSBmdW5jdGlvbihmbXQpIHtcbiAgICAgIHZhciBfZm10ID0gZm10LCBtYXRjaCA9IFtdLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDA7XG4gICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICBpZiAoKG1hdGNoID0gL15bXlxceDI1XSsvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1ezJ9Ly5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaCgnJScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW15cXCldKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWZvc3V4WF0pLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDE7XG4gICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdO1xuICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcWyhcXGQrKVxcXS8uZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIG1peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICB9XG4gICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlX3RyZWU7XG4gICAgfTtcblxuICAgIHJldHVybiBzdHJfZm9ybWF0O1xuICB9KSgpO1xuXG4gIHZhciB2c3ByaW50ZiA9IGZ1bmN0aW9uKGZtdCwgYXJndikge1xuICAgIGFyZ3YudW5zaGlmdChmbXQpO1xuICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3YpO1xuICB9O1xuXG4gIEplZC5wYXJzZV9wbHVyYWwgPSBmdW5jdGlvbiAoIHBsdXJhbF9mb3JtcywgbiApIHtcbiAgICBwbHVyYWxfZm9ybXMgPSBwbHVyYWxfZm9ybXMucmVwbGFjZSgvbi9nLCBuKTtcbiAgICByZXR1cm4gSmVkLnBhcnNlX2V4cHJlc3Npb24ocGx1cmFsX2Zvcm1zKTtcbiAgfTtcblxuICBKZWQuc3ByaW50ZiA9IGZ1bmN0aW9uICggZm10LCBhcmdzICkge1xuICAgIGlmICgge30udG9TdHJpbmcuY2FsbCggYXJncyApID09ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICByZXR1cm4gdnNwcmludGYoIGZtdCwgW10uc2xpY2UuY2FsbChhcmdzKSApO1xuICAgIH1cbiAgICByZXR1cm4gc3ByaW50Zi5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykgKTtcbiAgfTtcblxuICBKZWQucHJvdG90eXBlLnNwcmludGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEplZC5zcHJpbnRmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIC8vIEVORCBzcHJpbnRmIEltcGxlbWVudGF0aW9uXG5cbiAgLy8gU3RhcnQgdGhlIFBsdXJhbCBmb3JtcyBzZWN0aW9uXG4gIC8vIFRoaXMgaXMgYSBmdWxsIHBsdXJhbCBmb3JtIGV4cHJlc3Npb24gcGFyc2VyLiBJdCBpcyB1c2VkIHRvIGF2b2lkXG4gIC8vIHJ1bm5pbmcgJ2V2YWwnIG9yICduZXcgRnVuY3Rpb24nIGRpcmVjdGx5IGFnYWluc3QgdGhlIHBsdXJhbFxuICAvLyBmb3Jtcy5cbiAgLy9cbiAgLy8gVGhpcyBjYW4gYmUgaW1wb3J0YW50IGlmIHlvdSBnZXQgdHJhbnNsYXRpb25zIGRvbmUgdGhyb3VnaCBhIDNyZFxuICAvLyBwYXJ0eSB2ZW5kb3IuIEkgZW5jb3VyYWdlIHlvdSB0byB1c2UgdGhpcyBpbnN0ZWFkLCBob3dldmVyLCBJXG4gIC8vIGFsc28gd2lsbCBwcm92aWRlIGEgJ3ByZWNvbXBpbGVyJyB0aGF0IHlvdSBjYW4gdXNlIGF0IGJ1aWxkIHRpbWVcbiAgLy8gdG8gb3V0cHV0IHZhbGlkL3NhZmUgZnVuY3Rpb24gcmVwcmVzZW50YXRpb25zIG9mIHRoZSBwbHVyYWwgZm9ybVxuICAvLyBleHByZXNzaW9ucy4gVGhpcyBtZWFucyB5b3UgY2FuIGJ1aWxkIHRoaXMgY29kZSBvdXQgZm9yIHRoZSBtb3N0XG4gIC8vIHBhcnQuXG4gIEplZC5QRiA9IHt9O1xuXG4gIEplZC5QRi5wYXJzZSA9IGZ1bmN0aW9uICggcCApIHtcbiAgICB2YXIgcGx1cmFsX3N0ciA9IEplZC5QRi5leHRyYWN0UGx1cmFsRXhwciggcCApO1xuICAgIHJldHVybiBKZWQuUEYucGFyc2VyLnBhcnNlLmNhbGwoSmVkLlBGLnBhcnNlciwgcGx1cmFsX3N0cik7XG4gIH07XG5cbiAgSmVkLlBGLmNvbXBpbGUgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gSGFuZGxlIHRydWVzIGFuZCBmYWxzZXMgYXMgMCBhbmQgMVxuICAgIGZ1bmN0aW9uIGltcGx5KCB2YWwgKSB7XG4gICAgICByZXR1cm4gKHZhbCA9PT0gdHJ1ZSA/IDEgOiB2YWwgPyB2YWwgOiAwKTtcbiAgICB9XG5cbiAgICB2YXIgYXN0ID0gSmVkLlBGLnBhcnNlKCBwICk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggbiApIHtcbiAgICAgIHJldHVybiBpbXBseSggSmVkLlBGLmludGVycHJldGVyKCBhc3QgKSggbiApICk7XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuaW50ZXJwcmV0ZXIgPSBmdW5jdGlvbiAoIGFzdCApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHN3aXRjaCAoIGFzdC50eXBlICkge1xuICAgICAgICBjYXNlICdHUk9VUCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApO1xuICAgICAgICBjYXNlICdURVJOQVJZJzpcbiAgICAgICAgICBpZiAoIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApICkge1xuICAgICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnRydXRoeSApKCBuICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5mYWxzZXkgKSggbiApO1xuICAgICAgICBjYXNlICdPUic6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIHx8IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnQU5EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJiYgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIDwgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdHVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID4gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVEUnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA8PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0dURSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID49IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnRVEnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA9PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ05FUSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICE9IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTU9EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ1ZBUic6XG4gICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIGNhc2UgJ05VTSc6XG4gICAgICAgICAgcmV0dXJuIGFzdC52YWw7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBUb2tlbiBmb3VuZC5cIik7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuZXh0cmFjdFBsdXJhbEV4cHIgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gdHJpbSBmaXJzdFxuICAgIHAgPSBwLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuXG4gICAgaWYgKCEgLztcXHMqJC8udGVzdChwKSkge1xuICAgICAgcCA9IHAuY29uY2F0KCc7Jyk7XG4gICAgfVxuXG4gICAgdmFyIG5wbHVyYWxzX3JlID0gL25wbHVyYWxzXFw9KFxcZCspOy8sXG4gICAgICAgIHBsdXJhbF9yZSA9IC9wbHVyYWxcXD0oLiopOy8sXG4gICAgICAgIG5wbHVyYWxzX21hdGNoZXMgPSBwLm1hdGNoKCBucGx1cmFsc19yZSApLFxuICAgICAgICByZXMgPSB7fSxcbiAgICAgICAgcGx1cmFsX21hdGNoZXM7XG5cbiAgICAvLyBGaW5kIHRoZSBucGx1cmFscyBudW1iZXJcbiAgICBpZiAoIG5wbHVyYWxzX21hdGNoZXMubGVuZ3RoID4gMSApIHtcbiAgICAgIHJlcy5ucGx1cmFscyA9IG5wbHVyYWxzX21hdGNoZXNbMV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCducGx1cmFscyBub3QgZm91bmQgaW4gcGx1cmFsX2Zvcm1zIHN0cmluZzogJyArIHAgKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgdGhhdCBkYXRhIHRvIGdldCB0byB0aGUgZm9ybXVsYVxuICAgIHAgPSBwLnJlcGxhY2UoIG5wbHVyYWxzX3JlLCBcIlwiICk7XG4gICAgcGx1cmFsX21hdGNoZXMgPSBwLm1hdGNoKCBwbHVyYWxfcmUgKTtcblxuICAgIGlmICghKCBwbHVyYWxfbWF0Y2hlcyAmJiBwbHVyYWxfbWF0Y2hlcy5sZW5ndGggPiAxICkgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BwbHVyYWxgIGV4cHJlc3Npb24gbm90IGZvdW5kOiAnICsgcCk7XG4gICAgfVxuICAgIHJldHVybiBwbHVyYWxfbWF0Y2hlc1sgMSBdO1xuICB9O1xuXG4gIC8qIEppc29uIGdlbmVyYXRlZCBwYXJzZXIgKi9cbiAgSmVkLlBGLnBhcnNlciA9IChmdW5jdGlvbigpe1xuXG52YXIgcGFyc2VyID0ge3RyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHsgfSxcbnl5OiB7fSxcbnN5bWJvbHNfOiB7XCJlcnJvclwiOjIsXCJleHByZXNzaW9uc1wiOjMsXCJlXCI6NCxcIkVPRlwiOjUsXCI/XCI6NixcIjpcIjo3LFwifHxcIjo4LFwiJiZcIjo5LFwiPFwiOjEwLFwiPD1cIjoxMSxcIj5cIjoxMixcIj49XCI6MTMsXCIhPVwiOjE0LFwiPT1cIjoxNSxcIiVcIjoxNixcIihcIjoxNyxcIilcIjoxOCxcIm5cIjoxOSxcIk5VTUJFUlwiOjIwLFwiJGFjY2VwdFwiOjAsXCIkZW5kXCI6MX0sXG50ZXJtaW5hbHNfOiB7MjpcImVycm9yXCIsNTpcIkVPRlwiLDY6XCI/XCIsNzpcIjpcIiw4OlwifHxcIiw5OlwiJiZcIiwxMDpcIjxcIiwxMTpcIjw9XCIsMTI6XCI+XCIsMTM6XCI+PVwiLDE0OlwiIT1cIiwxNTpcIj09XCIsMTY6XCIlXCIsMTc6XCIoXCIsMTg6XCIpXCIsMTk6XCJuXCIsMjA6XCJOVU1CRVJcIn0sXG5wcm9kdWN0aW9uc186IFswLFszLDJdLFs0LDVdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDFdLFs0LDFdXSxcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQseXlsZW5nLHl5bGluZW5vLHl5LHl5c3RhdGUsJCQsXyQpIHtcblxudmFyICQwID0gJCQubGVuZ3RoIC0gMTtcbnN3aXRjaCAoeXlzdGF0ZSkge1xuY2FzZSAxOiByZXR1cm4geyB0eXBlIDogJ0dST1VQJywgZXhwcjogJCRbJDAtMV0gfTtcbmJyZWFrO1xuY2FzZSAyOnRoaXMuJCA9IHsgdHlwZTogJ1RFUk5BUlknLCBleHByOiAkJFskMC00XSwgdHJ1dGh5IDogJCRbJDAtMl0sIGZhbHNleTogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMzp0aGlzLiQgPSB7IHR5cGU6IFwiT1JcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA0OnRoaXMuJCA9IHsgdHlwZTogXCJBTkRcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA1OnRoaXMuJCA9IHsgdHlwZTogJ0xUJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA2OnRoaXMuJCA9IHsgdHlwZTogJ0xURScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNzp0aGlzLiQgPSB7IHR5cGU6ICdHVCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgODp0aGlzLiQgPSB7IHR5cGU6ICdHVEUnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDk6dGhpcy4kID0geyB0eXBlOiAnTkVRJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMDp0aGlzLiQgPSB7IHR5cGU6ICdFUScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTE6dGhpcy4kID0geyB0eXBlOiAnTU9EJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMjp0aGlzLiQgPSB7IHR5cGU6ICdHUk9VUCcsIGV4cHI6ICQkWyQwLTFdIH07XG5icmVhaztcbmNhc2UgMTM6dGhpcy4kID0geyB0eXBlOiAnVkFSJyB9O1xuYnJlYWs7XG5jYXNlIDE0OnRoaXMuJCA9IHsgdHlwZTogJ05VTScsIHZhbDogTnVtYmVyKHl5dGV4dCkgfTtcbmJyZWFrO1xufVxufSxcbnRhYmxlOiBbezM6MSw0OjIsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHsxOlszXX0sezU6WzEsNl0sNjpbMSw3XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NDoxNywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezU6WzIsMTNdLDY6WzIsMTNdLDc6WzIsMTNdLDg6WzIsMTNdLDk6WzIsMTNdLDEwOlsyLDEzXSwxMTpbMiwxM10sMTI6WzIsMTNdLDEzOlsyLDEzXSwxNDpbMiwxM10sMTU6WzIsMTNdLDE2OlsyLDEzXSwxODpbMiwxM119LHs1OlsyLDE0XSw2OlsyLDE0XSw3OlsyLDE0XSw4OlsyLDE0XSw5OlsyLDE0XSwxMDpbMiwxNF0sMTE6WzIsMTRdLDEyOlsyLDE0XSwxMzpbMiwxNF0sMTQ6WzIsMTRdLDE1OlsyLDE0XSwxNjpbMiwxNF0sMTg6WzIsMTRdfSx7MTpbMiwxXX0sezQ6MTgsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjE5LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjEsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIyLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjQsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI1LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjcsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs2OlsxLDddLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzEsMjhdfSx7NjpbMSw3XSw3OlsxLDI5XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NTpbMiwzXSw2OlsyLDNdLDc6WzIsM10sODpbMiwzXSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiwzXX0sezU6WzIsNF0sNjpbMiw0XSw3OlsyLDRdLDg6WzIsNF0sOTpbMiw0XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsNF19LHs1OlsyLDVdLDY6WzIsNV0sNzpbMiw1XSw4OlsyLDVdLDk6WzIsNV0sMTA6WzIsNV0sMTE6WzIsNV0sMTI6WzIsNV0sMTM6WzIsNV0sMTQ6WzIsNV0sMTU6WzIsNV0sMTY6WzEsMTZdLDE4OlsyLDVdfSx7NTpbMiw2XSw2OlsyLDZdLDc6WzIsNl0sODpbMiw2XSw5OlsyLDZdLDEwOlsyLDZdLDExOlsyLDZdLDEyOlsyLDZdLDEzOlsyLDZdLDE0OlsyLDZdLDE1OlsyLDZdLDE2OlsxLDE2XSwxODpbMiw2XX0sezU6WzIsN10sNjpbMiw3XSw3OlsyLDddLDg6WzIsN10sOTpbMiw3XSwxMDpbMiw3XSwxMTpbMiw3XSwxMjpbMiw3XSwxMzpbMiw3XSwxNDpbMiw3XSwxNTpbMiw3XSwxNjpbMSwxNl0sMTg6WzIsN119LHs1OlsyLDhdLDY6WzIsOF0sNzpbMiw4XSw4OlsyLDhdLDk6WzIsOF0sMTA6WzIsOF0sMTE6WzIsOF0sMTI6WzIsOF0sMTM6WzIsOF0sMTQ6WzIsOF0sMTU6WzIsOF0sMTY6WzEsMTZdLDE4OlsyLDhdfSx7NTpbMiw5XSw2OlsyLDldLDc6WzIsOV0sODpbMiw5XSw5OlsyLDldLDEwOlsyLDldLDExOlsyLDldLDEyOlsyLDldLDEzOlsyLDldLDE0OlsyLDldLDE1OlsyLDldLDE2OlsxLDE2XSwxODpbMiw5XX0sezU6WzIsMTBdLDY6WzIsMTBdLDc6WzIsMTBdLDg6WzIsMTBdLDk6WzIsMTBdLDEwOlsyLDEwXSwxMTpbMiwxMF0sMTI6WzIsMTBdLDEzOlsyLDEwXSwxNDpbMiwxMF0sMTU6WzIsMTBdLDE2OlsxLDE2XSwxODpbMiwxMF19LHs1OlsyLDExXSw2OlsyLDExXSw3OlsyLDExXSw4OlsyLDExXSw5OlsyLDExXSwxMDpbMiwxMV0sMTE6WzIsMTFdLDEyOlsyLDExXSwxMzpbMiwxMV0sMTQ6WzIsMTFdLDE1OlsyLDExXSwxNjpbMiwxMV0sMTg6WzIsMTFdfSx7NTpbMiwxMl0sNjpbMiwxMl0sNzpbMiwxMl0sODpbMiwxMl0sOTpbMiwxMl0sMTA6WzIsMTJdLDExOlsyLDEyXSwxMjpbMiwxMl0sMTM6WzIsMTJdLDE0OlsyLDEyXSwxNTpbMiwxMl0sMTY6WzIsMTJdLDE4OlsyLDEyXX0sezQ6MzAsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs1OlsyLDJdLDY6WzEsN10sNzpbMiwyXSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDJdfV0sXG5kZWZhdWx0QWN0aW9uczogezY6WzIsMV19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbn0sXG5wYXJzZTogZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIHN0YWNrID0gWzBdLFxuICAgICAgICB2c3RhY2sgPSBbbnVsbF0sIC8vIHNlbWFudGljIHZhbHVlIHN0YWNrXG4gICAgICAgIGxzdGFjayA9IFtdLCAvLyBsb2NhdGlvbiBzdGFja1xuICAgICAgICB0YWJsZSA9IHRoaXMudGFibGUsXG4gICAgICAgIHl5dGV4dCA9ICcnLFxuICAgICAgICB5eWxpbmVubyA9IDAsXG4gICAgICAgIHl5bGVuZyA9IDAsXG4gICAgICAgIHJlY292ZXJpbmcgPSAwLFxuICAgICAgICBURVJST1IgPSAyLFxuICAgICAgICBFT0YgPSAxO1xuXG4gICAgLy90aGlzLnJlZHVjdGlvbkNvdW50ID0gdGhpcy5zaGlmdENvdW50ID0gMDtcblxuICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuICAgIHRoaXMubGV4ZXIueXkgPSB0aGlzLnl5O1xuICAgIHRoaXMueXkubGV4ZXIgPSB0aGlzLmxleGVyO1xuICAgIGlmICh0eXBlb2YgdGhpcy5sZXhlci55eWxsb2MgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHRoaXMubGV4ZXIueXlsbG9jID0ge307XG4gICAgdmFyIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgbHN0YWNrLnB1c2goeXlsb2MpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnl5LnBhcnNlRXJyb3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcblxuICAgIGZ1bmN0aW9uIHBvcFN0YWNrIChuKSB7XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIqbjtcbiAgICAgICAgdnN0YWNrLmxlbmd0aCA9IHZzdGFjay5sZW5ndGggLSBuO1xuICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCAxOyAvLyAkZW5kID0gMVxuICAgICAgICAvLyBpZiB0b2tlbiBpc24ndCBpdHMgbnVtZXJpYyB2YWx1ZSwgY29udmVydFxuICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdG9rZW4gPSBzZWxmLnN5bWJvbHNfW3Rva2VuXSB8fCB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfVxuXG4gICAgdmFyIHN5bWJvbCwgcHJlRXJyb3JTeW1ib2wsIHN0YXRlLCBhY3Rpb24sIGEsIHIsIHl5dmFsPXt9LHAsbGVuLG5ld1N0YXRlLCBleHBlY3RlZDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvLyByZXRyZWl2ZSBzdGF0ZSBudW1iZXIgZnJvbSB0b3Agb2Ygc3RhY2tcbiAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG5cbiAgICAgICAgLy8gdXNlIGRlZmF1bHQgYWN0aW9ucyBpZiBhdmFpbGFibGVcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIC8vIHJlYWQgYWN0aW9uIGZvciBjdXJyZW50IHN0YXRlIGFuZCBmaXJzdCBpbnB1dFxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBhcnNlIGVycm9yXG4gICAgICAgIF9oYW5kbGVfZXJyb3I6XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAndW5kZWZpbmVkJyB8fCAhYWN0aW9uLmxlbmd0aCB8fCAhYWN0aW9uWzBdKSB7XG5cbiAgICAgICAgICAgIGlmICghcmVjb3ZlcmluZykge1xuICAgICAgICAgICAgICAgIC8vIFJlcG9ydCBlcnJvclxuICAgICAgICAgICAgICAgIGV4cGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChwIGluIHRhYmxlW3N0YXRlXSkgaWYgKHRoaXMudGVybWluYWxzX1twXSAmJiBwID4gMikge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiK3RoaXMudGVybWluYWxzX1twXStcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZXhlci5zaG93UG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6XFxuXCIrdGhpcy5sZXhlci5zaG93UG9zaXRpb24oKStcIlxcbkV4cGVjdGluZyBcIitleHBlY3RlZC5qb2luKCcsICcpICsgXCIsIGdvdCAnXCIgKyB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSsgXCInXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6IFVuZXhwZWN0ZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzeW1ib2wgPT0gMSAvKkVPRiovID8gXCJlbmQgb2YgaW5wdXRcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFwiJ1wiKyh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpK1wiJ1wiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLCB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLCBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLCBsb2M6IHl5bG9jLCBleHBlY3RlZDogZXhwZWN0ZWR9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ganVzdCByZWNvdmVyZWQgZnJvbSBhbm90aGVyIGVycm9yXG4gICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBFT0YpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBjdXJyZW50IGxvb2thaGVhZCBhbmQgZ3JhYiBhbm90aGVyXG4gICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG4gICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRyeSB0byByZWNvdmVyIGZyb20gZXJyb3JcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGVycm9yIHJlY292ZXJ5IHJ1bGUgaW4gdGhpcyBzdGF0ZVxuICAgICAgICAgICAgICAgIGlmICgoVEVSUk9SLnRvU3RyaW5nKCkpIGluIHRhYmxlW3N0YXRlXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvcFN0YWNrKDEpO1xuICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IHN5bWJvbDsgLy8gc2F2ZSB0aGUgbG9va2FoZWFkIHRva2VuXG4gICAgICAgICAgICBzeW1ib2wgPSBURVJST1I7ICAgICAgICAgLy8gaW5zZXJ0IGdlbmVyaWMgZXJyb3Igc3ltYm9sIGFzIG5ldyBsb29rYWhlYWRcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtURVJST1JdO1xuICAgICAgICAgICAgcmVjb3ZlcmluZyA9IDM7IC8vIGFsbG93IDMgcmVhbCBzeW1ib2xzIHRvIGJlIHNoaWZ0ZWQgYmVmb3JlIHJlcG9ydGluZyBhIG5ldyBlcnJvclxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCB1bmxlc3MgcmVzb2x2ZSBkZWZhdWx0cyBhcmUgb2ZmXG4gICAgICAgIGlmIChhY3Rpb25bMF0gaW5zdGFuY2VvZiBBcnJheSAmJiBhY3Rpb24ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJzZSBFcnJvcjogbXVsdGlwbGUgYWN0aW9ucyBwb3NzaWJsZSBhdCBzdGF0ZTogJytzdGF0ZSsnLCB0b2tlbjogJytzeW1ib2wpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcblxuICAgICAgICAgICAgY2FzZSAxOiAvLyBzaGlmdFxuICAgICAgICAgICAgICAgIC8vdGhpcy5zaGlmdENvdW50Kys7XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHRoaXMubGV4ZXIueXlsbG9jKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGFjdGlvblsxXSk7IC8vIHB1c2ggc3RhdGVcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHsgLy8gbm9ybWFsIGV4ZWN1dGlvbi9ubyBlcnJvclxuICAgICAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGVycm9yIGp1c3Qgb2NjdXJyZWQsIHJlc3VtZSBvbGQgbG9va2FoZWFkIGYvIGJlZm9yZSBlcnJvclxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBwcmVFcnJvclN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOiAvLyByZWR1Y2VcbiAgICAgICAgICAgICAgICAvL3RoaXMucmVkdWN0aW9uQ291bnQrKztcblxuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG5cbiAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHNlbWFudGljIGFjdGlvblxuICAgICAgICAgICAgICAgIHl5dmFsLiQgPSB2c3RhY2tbdnN0YWNrLmxlbmd0aC1sZW5dOyAvLyBkZWZhdWx0IHRvICQkID0gJDFcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IGxvY2F0aW9uLCB1c2VzIGZpcnN0IHRva2VuIGZvciBmaXJzdHMsIGxhc3QgZm9yIGxhc3RzXG4gICAgICAgICAgICAgICAgeXl2YWwuXyQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLShsZW58fDEpXS5maXJzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLTFdLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0obGVufHwxKV0uZmlyc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGgtMV0ubGFzdF9jb2x1bW5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHIgPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh5eXZhbCwgeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB0aGlzLnl5LCBhY3Rpb25bMV0sIHZzdGFjaywgbHN0YWNrKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcG9wIG9mZiBzdGFja1xuICAgICAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgwLC0xKmxlbioyKTtcbiAgICAgICAgICAgICAgICAgICAgdnN0YWNrID0gdnN0YWNrLnNsaWNlKDAsIC0xKmxlbik7XG4gICAgICAgICAgICAgICAgICAgIGxzdGFjayA9IGxzdGFjay5zbGljZSgwLCAtMSpsZW4pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7ICAgIC8vIHB1c2ggbm9udGVybWluYWwgKHJlZHVjZSlcbiAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcbiAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG4gICAgICAgICAgICAgICAgLy8gZ290byBuZXcgc3RhdGUgPSB0YWJsZVtTVEFURV1bTk9OVEVSTUlOQUxdXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUgPSB0YWJsZVtzdGFja1tzdGFjay5sZW5ndGgtMl1dW3N0YWNrW3N0YWNrLmxlbmd0aC0xXV07XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gYWNjZXB0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufX07LyogSmlzb24gZ2VuZXJhdGVkIGxleGVyICovXG52YXIgbGV4ZXIgPSAoZnVuY3Rpb24oKXtcblxudmFyIGxleGVyID0gKHtFT0Y6MSxcbnBhcnNlRXJyb3I6ZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICAgICAgaWYgKHRoaXMueXkucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgdGhpcy55eS5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbiAgICAgICAgfVxuICAgIH0sXG5zZXRJbnB1dDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRoaXMuX2xlc3MgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZToxLGZpcnN0X2NvbHVtbjowLGxhc3RfbGluZToxLGxhc3RfY29sdW1uOjB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQrPWNoO1xuICAgICAgICB0aGlzLnl5bGVuZysrO1xuICAgICAgICB0aGlzLm1hdGNoKz1jaDtcbiAgICAgICAgdGhpcy5tYXRjaGVkKz1jaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goL1xcbi8pO1xuICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZSgxKTtcbiAgICAgICAgcmV0dXJuIGNoO1xuICAgIH0sXG51bnB1dDpmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBjaCArIHRoaXMuX2lucHV0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxubW9yZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxucGFzdElucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiAocGFzdC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG51cGNvbWluZ0lucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xuICAgICAgICBpZiAobmV4dC5sZW5ndGggPCAyMCkge1xuICAgICAgICAgICAgbmV4dCArPSB0aGlzLl9pbnB1dC5zdWJzdHIoMCwgMjAtbmV4dC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dC5zdWJzdHIoMCwyMCkrKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJzonJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxuc2hvd1Bvc2l0aW9uOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZSA9IHRoaXMucGFzdElucHV0KCk7XG4gICAgICAgIHZhciBjID0gbmV3IEFycmF5KHByZS5sZW5ndGggKyAxKS5qb2luKFwiLVwiKTtcbiAgICAgICAgcmV0dXJuIHByZSArIHRoaXMudXBjb21pbmdJbnB1dCgpICsgXCJcXG5cIiArIGMrXCJeXCI7XG4gICAgfSxcbm5leHQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdG9rZW4sXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIGNvbCxcbiAgICAgICAgICAgIGxpbmVzO1xuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDtpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGNoID0gdGhpcy5faW5wdXQubWF0Y2godGhpcy5ydWxlc1tydWxlc1tpXV0pO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBtYXRjaFswXS5tYXRjaCgvXFxuLiovZyk7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHtmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vKzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgPyBsaW5lc1tsaW5lcy5sZW5ndGgtMV0ubGVuZ3RoLTEgOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArIG1hdGNoWzBdLmxlbmd0aH1cbiAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgcnVsZXNbaV0sdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0xXSk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnKyh0aGlzLnl5bGluZW5vKzEpKycuIFVucmVjb2duaXplZCB0ZXh0LlxcbicrdGhpcy5zaG93UG9zaXRpb24oKSxcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IFwiXCIsIHRva2VuOiBudWxsLCBsaW5lOiB0aGlzLnl5bGluZW5vfSk7XG4gICAgICAgIH1cbiAgICB9LFxubGV4OmZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcbiAgICAgICAgfVxuICAgIH0sXG5iZWdpbjpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG4gICAgfSxcbnBvcFN0YXRlOmZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcbiAgICB9LFxuX2N1cnJlbnRSdWxlczpmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW3RoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV1dLnJ1bGVzO1xuICAgIH0sXG50b3BTdGF0ZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTJdO1xuICAgIH0sXG5wdXNoU3RhdGU6ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuYmVnaW4oY29uZGl0aW9uKTtcbiAgICB9fSk7XG5sZXhlci5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24gYW5vbnltb3VzKHl5LHl5XywkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLFlZX1NUQVJUKSB7XG5cbnZhciBZWVNUQVRFPVlZX1NUQVJUO1xuc3dpdGNoKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcbmNhc2UgMDovKiBza2lwIHdoaXRlc3BhY2UgKi9cbmJyZWFrO1xuY2FzZSAxOnJldHVybiAyMFxuYnJlYWs7XG5jYXNlIDI6cmV0dXJuIDE5XG5icmVhaztcbmNhc2UgMzpyZXR1cm4gOFxuYnJlYWs7XG5jYXNlIDQ6cmV0dXJuIDlcbmJyZWFrO1xuY2FzZSA1OnJldHVybiA2XG5icmVhaztcbmNhc2UgNjpyZXR1cm4gN1xuYnJlYWs7XG5jYXNlIDc6cmV0dXJuIDExXG5icmVhaztcbmNhc2UgODpyZXR1cm4gMTNcbmJyZWFrO1xuY2FzZSA5OnJldHVybiAxMFxuYnJlYWs7XG5jYXNlIDEwOnJldHVybiAxMlxuYnJlYWs7XG5jYXNlIDExOnJldHVybiAxNFxuYnJlYWs7XG5jYXNlIDEyOnJldHVybiAxNVxuYnJlYWs7XG5jYXNlIDEzOnJldHVybiAxNlxuYnJlYWs7XG5jYXNlIDE0OnJldHVybiAxN1xuYnJlYWs7XG5jYXNlIDE1OnJldHVybiAxOFxuYnJlYWs7XG5jYXNlIDE2OnJldHVybiA1XG5icmVhaztcbmNhc2UgMTc6cmV0dXJuICdJTlZBTElEJ1xuYnJlYWs7XG59XG59O1xubGV4ZXIucnVsZXMgPSBbL15cXHMrLywvXlswLTldKyhcXC5bMC05XSspP1xcYi8sL15uXFxiLywvXlxcfFxcfC8sL14mJi8sL15cXD8vLC9eOi8sL148PS8sL14+PS8sL148LywvXj4vLC9eIT0vLC9ePT0vLC9eJS8sL15cXCgvLC9eXFwpLywvXiQvLC9eLi9dO1xubGV4ZXIuY29uZGl0aW9ucyA9IHtcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3XSxcImluY2x1c2l2ZVwiOnRydWV9fTtyZXR1cm4gbGV4ZXI7fSkoKVxucGFyc2VyLmxleGVyID0gbGV4ZXI7XG5yZXR1cm4gcGFyc2VyO1xufSkoKTtcbi8vIEVuZCBwYXJzZXJcblxuICAvLyBIYW5kbGUgbm9kZSwgYW1kLCBhbmQgZ2xvYmFsIHN5c3RlbXNcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSmVkO1xuICAgIH1cbiAgICBleHBvcnRzLkplZCA9IEplZDtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoJ2plZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSmVkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIExlYWsgYSBnbG9iYWwgcmVnYXJkbGVzcyBvZiBtb2R1bGUgc3lzdGVtXG4gICAgcm9vdFsnSmVkJ10gPSBKZWQ7XG4gIH1cblxufSkodGhpcyk7XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlRWFjaCcpLFxuICAgIGNyZWF0ZUZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVGb3JFYWNoJyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgaW52b2tpbmcgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGBpdGVyYXRlZWAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5XG4gKiBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiIHByb3BlcnR5XG4gKiBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgYF8uZm9ySW5gIG9yIGBfLmZvck93bmBcbiAqIG1heSBiZSB1c2VkIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgaXRlcmF0ZWVgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfKFsxLCAyXSkuZm9yRWFjaChmdW5jdGlvbihuKSB7XG4gKiAgIGNvbnNvbGUubG9nKG4pO1xuICogfSkudmFsdWUoKTtcbiAqIC8vID0+IGxvZ3MgZWFjaCB2YWx1ZSBmcm9tIGxlZnQgdG8gcmlnaHQgYW5kIHJldHVybnMgdGhlIGFycmF5XG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24obiwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKG4sIGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IGxvZ3MgZWFjaCB2YWx1ZS1rZXkgcGFpciBhbmQgcmV0dXJucyB0aGUgb2JqZWN0IChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbnZhciBmb3JFYWNoID0gY3JlYXRlRm9yRWFjaChhcnJheUVhY2gsIGJhc2VFYWNoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2dldE5hdGl2ZScpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IGdldE5hdGl2ZShEYXRlLCAnbm93Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgVW5peCBlcG9jaFxuICogKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gbG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgZnVuY3Rpb24gdG8gYmUgaW52b2tlZFxuICovXG52YXIgbm93ID0gbmF0aXZlTm93IHx8IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuLi9kYXRlL25vdycpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBpbnZvY2F0aW9ucy4gUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0byBpbmRpY2F0ZSB0aGF0IGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICogU3Vic2VxdWVudCBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0XG4gKiBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzIGludm9rZWRcbiAqIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gaXNcbiAqIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cDovL2RydXBhbG1vdGlvbi5jb20vYXJ0aWNsZS9kZWJvdW5jZS1hbmQtdGhyb3R0bGUtdmlzdWFsLWV4cGxhbmF0aW9uKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXSBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nXG4gKiAgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XSBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlXG4gKiAgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZ1xuICogIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIGF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXhcbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gaW52b2tlIGBzZW5kTWFpbGAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxsc1xuICogalF1ZXJ5KCcjcG9zdGJveCcpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gZW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxsc1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHtcbiAqICAgJ21heFdhaXQnOiAxMDAwXG4gKiB9KSk7XG4gKlxuICogLy8gY2FuY2VsIGEgZGVib3VuY2VkIGNhbGxcbiAqIHZhciB0b2RvQ2hhbmdlcyA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDEwMDApO1xuICogT2JqZWN0Lm9ic2VydmUobW9kZWxzLnRvZG8sIHRvZG9DaGFuZ2VzKTtcbiAqXG4gKiBPYmplY3Qub2JzZXJ2ZShtb2RlbHMsIGZ1bmN0aW9uKGNoYW5nZXMpIHtcbiAqICAgaWYgKF8uZmluZChjaGFuZ2VzLCB7ICd1c2VyJzogJ3RvZG8nLCAndHlwZSc6ICdkZWxldGUnfSkpIHtcbiAqICAgICB0b2RvQ2hhbmdlcy5jYW5jZWwoKTtcbiAqICAgfVxuICogfSwgWydkZWxldGUnXSk7XG4gKlxuICogLy8gLi4uYXQgc29tZSBwb2ludCBgbW9kZWxzLnRvZG9gIGlzIGNoYW5nZWRcbiAqIG1vZGVscy50b2RvLmNvbXBsZXRlZCA9IHRydWU7XG4gKlxuICogLy8gLi4uYmVmb3JlIDEgc2Vjb25kIGhhcyBwYXNzZWQgYG1vZGVscy50b2RvYCBpcyBkZWxldGVkXG4gKiAvLyB3aGljaCBjYW5jZWxzIHRoZSBkZWJvdW5jZWQgYHRvZG9DaGFuZ2VzYCBjYWxsXG4gKiBkZWxldGUgbW9kZWxzLnRvZG87XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGFyZ3MsXG4gICAgICBtYXhUaW1lb3V0SWQsXG4gICAgICByZXN1bHQsXG4gICAgICBzdGFtcCxcbiAgICAgIHRoaXNBcmcsXG4gICAgICB0aW1lb3V0SWQsXG4gICAgICB0cmFpbGluZ0NhbGwsXG4gICAgICBsYXN0Q2FsbGVkID0gMCxcbiAgICAgIG1heFdhaXQgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gd2FpdCA8IDAgPyAwIDogKCt3YWl0IHx8IDApO1xuICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgIHZhciBsZWFkaW5nID0gdHJ1ZTtcbiAgICB0cmFpbGluZyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heFdhaXQgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucyAmJiBuYXRpdmVNYXgoK29wdGlvbnMubWF4V2FpdCB8fCAwLCB3YWl0KTtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICB9XG4gICAgbGFzdENhbGxlZCA9IDA7XG4gICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcGxldGUoaXNDYWxsZWQsIGlkKSB7XG4gICAgaWYgKGlkKSB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH1cbiAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBhcmdzID0gdGhpc0FyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZWxheWVkKCkge1xuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdygpIC0gc3RhbXApO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICBjb21wbGV0ZSh0cmFpbGluZ0NhbGwsIG1heFRpbWVvdXRJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYXhEZWxheWVkKCkge1xuICAgIGNvbXBsZXRlKHRyYWlsaW5nLCB0aW1lb3V0SWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgc3RhbXAgPSBub3coKTtcbiAgICB0aGlzQXJnID0gdGhpcztcbiAgICB0cmFpbGluZ0NhbGwgPSB0cmFpbGluZyAmJiAodGltZW91dElkIHx8ICFsZWFkaW5nKTtcblxuICAgIGlmIChtYXhXYWl0ID09PSBmYWxzZSkge1xuICAgICAgdmFyIGxlYWRpbmdDYWxsID0gbGVhZGluZyAmJiAhdGltZW91dElkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1heFRpbWVvdXRJZCAmJiAhbGVhZGluZykge1xuICAgICAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgICB9XG4gICAgICB2YXIgcmVtYWluaW5nID0gbWF4V2FpdCAtIChzdGFtcCAtIGxhc3RDYWxsZWQpLFxuICAgICAgICAgIGlzQ2FsbGVkID0gcmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gbWF4V2FpdDtcblxuICAgICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICBtYXhUaW1lb3V0SWQgPSBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghbWF4VGltZW91dElkKSB7XG4gICAgICAgIG1heFRpbWVvdXRJZCA9IHNldFRpbWVvdXQobWF4RGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmIHRpbWVvdXRJZCkge1xuICAgICAgdGltZW91dElkID0gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aW1lb3V0SWQgJiYgd2FpdCAhPT0gbWF4V2FpdCkge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChkZWxheWVkLCB3YWl0KTtcbiAgICB9XG4gICAgaWYgKGxlYWRpbmdDYWxsKSB7XG4gICAgICBpc0NhbGxlZCA9IHRydWU7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIH1cbiAgICBpZiAoaXNDYWxsZWQgJiYgIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICBhcmdzID0gdGhpc0FyZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uIGFuZCBhcmd1bWVudHMgZnJvbSBgc3RhcnRgIGFuZCBiZXlvbmQgcHJvdmlkZWQgYXMgYW4gYXJyYXkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uIHRoZSBbcmVzdCBwYXJhbWV0ZXJdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9GdW5jdGlvbnMvcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzYXkgPSBfLnJlc3RQYXJhbShmdW5jdGlvbih3aGF0LCBuYW1lcykge1xuICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAqIH0pO1xuICpcbiAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiByZXN0UGFyYW0oZnVuYywgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogKCtzdGFydCB8fCAwKSwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICByZXN0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN0W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCByZXN0KTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCByZXN0KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSByZXN0O1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzdFBhcmFtO1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUNvcHkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlDb3B5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c2AgdG8gY3VzdG9taXplIGl0cyBgXy5hc3NpZ25gIHVzZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBvYmplY3RWYWx1ZSBUaGUgZGVzdGluYXRpb24gb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHBhcmFtIHsqfSBzb3VyY2VWYWx1ZSBUaGUgc291cmNlIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduRGVmYXVsdHMob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKSB7XG4gIHJldHVybiBvYmplY3RWYWx1ZSA9PT0gdW5kZWZpbmVkID8gc291cmNlVmFsdWUgOiBvYmplY3RWYWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25EZWZhdWx0cztcbiIsInZhciBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uYXNzaWduYCBmb3IgY3VzdG9taXppbmcgYXNzaWduZWQgdmFsdWVzIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLCBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplcih2YWx1ZSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuXG4gICAgaWYgKChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB8fFxuICAgICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduV2l0aDtcbiIsInZhciBiYXNlQ29weSA9IHJlcXVpcmUoJy4vYmFzZUNvcHknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsXG4gKiBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIHNvdXJjZSA9PSBudWxsXG4gICAgPyBvYmplY3RcbiAgICA6IGJhc2VDb3B5KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgYXJyYXlDb3B5ID0gcmVxdWlyZSgnLi9hcnJheUNvcHknKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL2FycmF5RWFjaCcpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL2Jhc2VBc3NpZ24nKSxcbiAgICBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9iYXNlRm9yT3duJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL2luaXRDbG9uZUFycmF5JyksXG4gICAgaW5pdENsb25lQnlUYWcgPSByZXF1aXJlKCcuL2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2Jvb2xUYWddID1cbmNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPSBjbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID1cbmNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDhUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xuY2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cbmNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nXG4gKiBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgYHZhbHVlYCBiZWxvbmdzIHRvLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgY2xvbmVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCkgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBhcnJheUNvcHkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWc7XG5cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVPYmplY3QoaXNGdW5jID8ge30gOiB2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNsb25lYWJsZVRhZ3NbdGFnXVxuICAgICAgICA/IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGlzRGVlcClcbiAgICAgICAgOiAob2JqZWN0ID8gdmFsdWUgOiB7fSk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrQSB8fCAoc3RhY2tBID0gW10pO1xuICBzdGFja0IgfHwgKHN0YWNrQiA9IFtdKTtcblxuICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF07XG4gICAgfVxuICB9XG4gIC8vIEFkZCB0aGUgc291cmNlIHZhbHVlIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgYXNzb2NpYXRlIGl0IHdpdGggaXRzIGNsb25lLlxuICBzdGFja0EucHVzaCh2YWx1ZSk7XG4gIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgKGlzQXJyID8gYXJyYXlFYWNoIDogYmFzZUZvck93bikodmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IGJhc2VDbG9uZShzdWJWYWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFja0EsIHN0YWNrQik7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsIi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvcHkoc291cmNlLCBwcm9wcywgb2JqZWN0KSB7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBvYmplY3Rba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvcHk7XG4iLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9ySW5gIGFuZCBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXNcbiAqIG92ZXIgYG9iamVjdGAgcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGludm9raW5nIGBpdGVyYXRlZWAgZm9yXG4gKiBlYWNoIHByb3BlcnR5LiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHlcbiAqIHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL2Jhc2VGb3InKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9ySW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JJbihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvckluO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vYXJyYXlFYWNoJyksXG4gICAgYmFzZU1lcmdlRGVlcCA9IHJlcXVpcmUoJy4vYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNUeXBlZEFycmF5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsXG4gKiBtdWx0aXBsZSBzb3VyY2VzLCBhbmQgYHRoaXNgIGJpbmRpbmcgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyB2YWx1ZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyLCBzdGFja0EsIHN0YWNrQikge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIHZhciBpc1NyY0FyciA9IGlzQXJyYXlMaWtlKHNvdXJjZSkgJiYgKGlzQXJyYXkoc291cmNlKSB8fCBpc1R5cGVkQXJyYXkoc291cmNlKSksXG4gICAgICBwcm9wcyA9IGlzU3JjQXJyID8gdW5kZWZpbmVkIDoga2V5cyhzb3VyY2UpO1xuXG4gIGFycmF5RWFjaChwcm9wcyB8fCBzb3VyY2UsIGZ1bmN0aW9uKHNyY1ZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHNyY1ZhbHVlO1xuICAgICAgc3JjVmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0TGlrZShzcmNWYWx1ZSkpIHtcbiAgICAgIHN0YWNrQSB8fCAoc3RhY2tBID0gW10pO1xuICAgICAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG4gICAgICBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKHZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgaXNDb21tb24gPSByZXN1bHQgPT09IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKGlzQ29tbW9uKSB7XG4gICAgICAgIHJlc3VsdCA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKChyZXN1bHQgIT09IHVuZGVmaW5lZCB8fCAoaXNTcmNBcnIgJiYgIShrZXkgaW4gb2JqZWN0KSkpICYmXG4gICAgICAgICAgKGlzQ29tbW9uIHx8IChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSkpIHtcbiAgICAgICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2U7XG4iLCJ2YXIgYXJyYXlDb3B5ID0gcmVxdWlyZSgnLi9hcnJheUNvcHknKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNQbGFpbk9iamVjdCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNUeXBlZEFycmF5JyksXG4gICAgdG9QbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvdG9QbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZU1lcmdlYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIG1lcmdlcyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBtZXJnZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIG1lcmdlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgdmFsdWVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2VEZWVwKG9iamVjdCwgc291cmNlLCBrZXksIG1lcmdlRnVuYywgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGgsXG4gICAgICBzcmNWYWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSBzcmNWYWx1ZSkge1xuICAgICAgb2JqZWN0W2tleV0gPSBzdGFja0JbbGVuZ3RoXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICByZXN1bHQgPSBjdXN0b21pemVyID8gY3VzdG9taXplcih2YWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpIDogdW5kZWZpbmVkLFxuICAgICAgaXNDb21tb24gPSByZXN1bHQgPT09IHVuZGVmaW5lZDtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICByZXN1bHQgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uoc3JjVmFsdWUpICYmIChpc0FycmF5KHNyY1ZhbHVlKSB8fCBpc1R5cGVkQXJyYXkoc3JjVmFsdWUpKSkge1xuICAgICAgcmVzdWx0ID0gaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgPyB2YWx1ZVxuICAgICAgICA6IChpc0FycmF5TGlrZSh2YWx1ZSkgPyBhcnJheUNvcHkodmFsdWUpIDogW10pO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHNyY1ZhbHVlKSB8fCBpc0FyZ3VtZW50cyhzcmNWYWx1ZSkpIHtcbiAgICAgIHJlc3VsdCA9IGlzQXJndW1lbnRzKHZhbHVlKVxuICAgICAgICA/IHRvUGxhaW5PYmplY3QodmFsdWUpXG4gICAgICAgIDogKGlzUGxhaW5PYmplY3QodmFsdWUpID8gdmFsdWUgOiB7fSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQWRkIHRoZSBzb3VyY2UgdmFsdWUgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzIGFuZCBhc3NvY2lhdGVcbiAgLy8gaXQgd2l0aCBpdHMgbWVyZ2VkIHZhbHVlLlxuICBzdGFja0EucHVzaChzcmNWYWx1ZSk7XG4gIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgb2JqZWN0W2tleV0gPSBtZXJnZUZ1bmMocmVzdWx0LCBzcmNWYWx1ZSwgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpO1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlc3VsdCAhPT0gdmFsdWUpIDogKHZhbHVlID09PSB2YWx1ZSkpIHtcbiAgICBvYmplY3Rba2V5XSA9IHJlc3VsdDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZURlZXA7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvaWRlbnRpdHknKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VDYWxsYmFja2Agd2hpY2ggb25seSBzdXBwb3J0cyBgdGhpc2AgYmluZGluZ1xuICogYW5kIHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gYmluZENhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0aGlzQXJnID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuICBzd2l0Y2ggKGFyZ0NvdW50KSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA1OiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kQ2FsbGJhY2s7XG4iLCIvKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIEFycmF5QnVmZmVyID0gZ2xvYmFsLkFycmF5QnVmZmVyLFxuICAgIFVpbnQ4QXJyYXkgPSBnbG9iYWwuVWludDhBcnJheTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGdpdmVuIGFycmF5IGJ1ZmZlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5QnVmZmVyKGJ1ZmZlci5ieXRlTGVuZ3RoKSxcbiAgICAgIHZpZXcgPSBuZXcgVWludDhBcnJheShyZXN1bHQpO1xuXG4gIHZpZXcuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1ZmZlckNsb25lO1xuIiwidmFyIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJy4vYmluZENhbGxiYWNrJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgcmVzdFBhcmFtID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24vcmVzdFBhcmFtJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLmFzc2lnbmAsIGBfLmRlZmF1bHRzYCwgb3IgYF8ubWVyZ2VgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdFBhcmFtKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzW2xlbmd0aCAtIDJdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkLFxuICAgICAgICB0aGlzQXJnID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY3VzdG9taXplciA9IGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCA1KTtcbiAgICAgIGxlbmd0aCAtPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21pemVyID0gdHlwZW9mIHRoaXNBcmcgPT0gJ2Z1bmN0aW9uJyA/IHRoaXNBcmcgOiB1bmRlZmluZWQ7XG4gICAgICBsZW5ndGggLT0gKGN1c3RvbWl6ZXIgPyAxIDogMCk7XG4gICAgfVxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCJ2YXIgZ2V0TGVuZ3RoID0gcmVxdWlyZSgnLi9nZXRMZW5ndGgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b09iamVjdCA9IHJlcXVpcmUoJy4vdG9PYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uID8gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pIDogMDtcbiAgICBpZiAoIWlzTGVuZ3RoKGxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IHRvT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcbiIsInZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vdG9PYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgYF8uZm9ySW5gIG9yIGBfLmZvckluUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpdGVyYWJsZSA9IHRvT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG4iLCJ2YXIgcmVzdFBhcmFtID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24vcmVzdFBhcmFtJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLmRlZmF1bHRzYCBvciBgXy5kZWZhdWx0c0RlZXBgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWZhdWx0cyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGVmYXVsdHMoYXNzaWduZXIsIGN1c3RvbWl6ZXIpIHtcbiAgcmV0dXJuIHJlc3RQYXJhbShmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIG9iamVjdCA9IGFyZ3NbMF07XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBhcmdzLnB1c2goY3VzdG9taXplcik7XG4gICAgcmV0dXJuIGFzc2lnbmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlZmF1bHRzO1xuIiwidmFyIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJy4vYmluZENhbGxiYWNrJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBmb3IgYF8uZm9yRWFjaGAgb3IgYF8uZm9yRWFjaFJpZ2h0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXJyYXlGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYW4gYXJyYXkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGVhY2ggZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goYXJyYXlGdW5jLCBlYWNoRnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBpdGVyYXRlZSA9PSAnZnVuY3Rpb24nICYmIHRoaXNBcmcgPT09IHVuZGVmaW5lZCAmJiBpc0FycmF5KGNvbGxlY3Rpb24pKVxuICAgICAgPyBhcnJheUZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpXG4gICAgICA6IGVhY2hGdW5jKGNvbGxlY3Rpb24sIGJpbmRDYWxsYmFjayhpdGVyYXRlZSwgdGhpc0FyZywgMykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZvckVhY2g7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9iYXNlUHJvcGVydHknKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIHRoYXQgYWZmZWN0cyBTYWZhcmkgb24gYXQgbGVhc3QgaU9TIDguMS04LjMgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMZW5ndGg7XG4iLCJ2YXIgaXNOYXRpdmUgPSByZXF1aXJlKCcuLi9sYW5nL2lzTmF0aXZlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwiLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgYXJyYXkgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgYnVmZmVyQ2xvbmUgPSByZXF1aXJlKCcuL2J1ZmZlckNsb25lJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGJ1ZmZlckNsb25lKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICB2YXIgYnVmZmVyID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIHJldHVybiBuZXcgQ3Rvcihpc0RlZXAgPyBidWZmZXJDbG9uZShidWZmZXIpIDogYnVmZmVyLCBvYmplY3QuYnl0ZU9mZnNldCwgb2JqZWN0Lmxlbmd0aCk7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3Iob2JqZWN0LnNvdXJjZSwgcmVGbGFncy5leGVjKG9iamVjdCkpO1xuICAgICAgcmVzdWx0Lmxhc3RJbmRleCA9IG9iamVjdC5sYXN0SW5kZXg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsIi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCEodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yIGluc3RhbmNlb2YgQ3RvcikpIHtcbiAgICBDdG9yID0gT2JqZWN0O1xuICB9XG4gIHJldHVybiBuZXcgQ3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCJ2YXIgZ2V0TGVuZ3RoID0gcmVxdWlyZSgnLi9nZXRMZW5ndGgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXlxcZCskLztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpID8gK3ZhbHVlIDogLTE7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG4iLCIvKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4uL29iamVjdC9tZXJnZScpO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNEZWVwYCB0byBjdXN0b21pemUgaXRzIGBfLm1lcmdlYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlRGVmYXVsdHMob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKSB7XG4gIHJldHVybiBvYmplY3RWYWx1ZSA9PT0gdW5kZWZpbmVkID8gc291cmNlVmFsdWUgOiBtZXJnZShvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIG1lcmdlRGVmYXVsdHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlRGVmYXVsdHM7XG4iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZVxuICogb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIHNoaW1LZXlzKG9iamVjdCkge1xuICB2YXIgcHJvcHMgPSBrZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gcHJvcHNMZW5ndGggJiYgb2JqZWN0Lmxlbmd0aDtcblxuICB2YXIgYWxsb3dJbmRleGVzID0gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoKGFsbG93SW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgfHwgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hpbUtleXM7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBvYmplY3QgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpID8gdmFsdWUgOiBPYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvT2JqZWN0O1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VDbG9uZScpLFxuICAgIGJpbmRDYWxsYmFjayA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHZhbHVlYC4gSWYgYGlzRGVlcGAgaXMgYHRydWVgIG5lc3RlZCBvYmplY3RzIGFyZSBjbG9uZWQsXG4gKiBvdGhlcndpc2UgdGhleSBhcmUgYXNzaWduZWQgYnkgcmVmZXJlbmNlLiBJZiBgY3VzdG9taXplcmAgaXMgcHJvdmlkZWQgaXQnc1xuICogaW52b2tlZCB0byBwcm9kdWNlIHRoZSBjbG9uZWQgdmFsdWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYFxuICogY2xvbmluZyBpcyBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0b1xuICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdXAgdG8gdGhyZWUgYXJndW1lbnQ7ICh2YWx1ZSBbLCBpbmRleHxrZXksIG9iamVjdF0pLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZVxuICogW3N0cnVjdHVyZWQgY2xvbmUgYWxnb3JpdGhtXShodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9pbmZyYXN0cnVjdHVyZS5odG1sI2ludGVybmFsLXN0cnVjdHVyZWQtY2xvbmluZy1hbGdvcml0aG0pLlxuICogVGhlIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgYXJndW1lbnRzYCBvYmplY3RzIGFuZCBvYmplY3RzIGNyZWF0ZWQgYnlcbiAqIGNvbnN0cnVjdG9ycyBvdGhlciB0aGFuIGBPYmplY3RgIGFyZSBjbG9uZWQgdG8gcGxhaW4gYE9iamVjdGAgb2JqZWN0cy4gQW5cbiAqIGVtcHR5IG9iamVjdCBpcyByZXR1cm5lZCBmb3IgdW5jbG9uZWFibGUgdmFsdWVzIHN1Y2ggYXMgZnVuY3Rpb25zLCBET00gbm9kZXMsXG4gKiBNYXBzLCBTZXRzLCBhbmQgV2Vha01hcHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JyB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnIH1cbiAqIF07XG4gKlxuICogdmFyIHNoYWxsb3cgPSBfLmNsb25lKHVzZXJzKTtcbiAqIHNoYWxsb3dbMF0gPT09IHVzZXJzWzBdO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIHZhciBkZWVwID0gXy5jbG9uZSh1c2VycywgdHJ1ZSk7XG4gKiBkZWVwWzBdID09PSB1c2Vyc1swXTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgZWwgPSBfLmNsb25lKGRvY3VtZW50LmJvZHksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGlmIChfLmlzRWxlbWVudCh2YWx1ZSkpIHtcbiAqICAgICByZXR1cm4gdmFsdWUuY2xvbmVOb2RlKGZhbHNlKTtcbiAqICAgfVxuICogfSk7XG4gKlxuICogZWwgPT09IGRvY3VtZW50LmJvZHlcbiAqIC8vID0+IGZhbHNlXG4gKiBlbC5ub2RlTmFtZVxuICogLy8gPT4gQk9EWVxuICogZWwuY2hpbGROb2Rlcy5sZW5ndGg7XG4gKiAvLyA9PiAwXG4gKi9cbmZ1bmN0aW9uIGNsb25lKHZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIsIHRoaXNBcmcpIHtcbiAgaWYgKGlzRGVlcCAmJiB0eXBlb2YgaXNEZWVwICE9ICdib29sZWFuJyAmJiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyKSkge1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpc0RlZXAgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXNBcmcgPSBjdXN0b21pemVyO1xuICAgIGN1c3RvbWl6ZXIgPSBpc0RlZXA7XG4gICAgaXNEZWVwID0gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbidcbiAgICA/IGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBiaW5kQ2FsbGJhY2soY3VzdG9taXplciwgdGhpc0FyZywgMykpXG4gICAgOiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJiAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2dldE5hdGl2ZScpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNBcnJheSA9IGdldE5hdGl2ZShBcnJheSwgJ2lzQXJyYXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheVRhZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBET00gZWxlbWVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBET00gZWxlbWVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRWxlbWVudChkb2N1bWVudC5ib2R5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRWxlbWVudCgnPGJvZHk+Jyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdmFsdWUubm9kZVR5cGUgPT09IDEgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNQbGFpbk9iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50O1xuIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpLFxuICAgIGlzU3RyaW5nID0gcmVxdWlyZSgnLi9pc1N0cmluZycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGVtcHR5LiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgZW1wdHkgdW5sZXNzIGl0J3MgYW5cbiAqIGBhcmd1bWVudHNgIG9iamVjdCwgYXJyYXksIHN0cmluZywgb3IgalF1ZXJ5LWxpa2UgY29sbGVjdGlvbiB3aXRoIGEgbGVuZ3RoXG4gKiBncmVhdGVyIHRoYW4gYDBgIG9yIGFuIG9iamVjdCB3aXRoIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VtcHR5KG51bGwpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSh0cnVlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNFbXB0eSh7ICdhJzogMSB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc1N0cmluZyh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpIHx8XG4gICAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnNwbGljZSkpKSkge1xuICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICB9XG4gIHJldHVybiAha2V5cyh2YWx1ZSkubGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpIHdoaWNoIHJldHVybiAnZnVuY3Rpb24nIGZvciByZWdleGVzXG4gIC8vIGFuZCBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvcnMuXG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmblRvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgcmV0dXJuIHJlSXNOYXRpdmUudGVzdChmblRvU3RyaW5nLmNhbGwodmFsdWUpKTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiByZUlzSG9zdEN0b3IudGVzdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYXRpdmU7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwidmFyIGJhc2VGb3JJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VGb3JJbicpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCB0aGF0IGlzLCBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGVcbiAqIGBPYmplY3RgIGNvbnN0cnVjdG9yIG9yIG9uZSB3aXRoIGEgYFtbUHJvdG90eXBlXV1gIG9mIGBudWxsYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgYXNzdW1lcyBvYmplY3RzIGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yXG4gKiBoYXZlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgdmFyIEN0b3I7XG5cbiAgLy8gRXhpdCBlYXJseSBmb3Igbm9uIGBPYmplY3RgIG9iamVjdHMuXG4gIGlmICghKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0VGFnICYmICFpc0FyZ3VtZW50cyh2YWx1ZSkpIHx8XG4gICAgICAoIWhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjb25zdHJ1Y3RvcicpICYmIChDdG9yID0gdmFsdWUuY29uc3RydWN0b3IsIHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgIShDdG9yIGluc3RhbmNlb2YgQ3RvcikpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBJRSA8IDkgaXRlcmF0ZXMgaW5oZXJpdGVkIHByb3BlcnRpZXMgYmVmb3JlIG93biBwcm9wZXJ0aWVzLiBJZiB0aGUgZmlyc3RcbiAgLy8gaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZFxuICAvLyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gIHZhciByZXN1bHQ7XG4gIC8vIEluIG1vc3QgZW52aXJvbm1lbnRzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIGFyZSBpdGVyYXRlZCBiZWZvcmVcbiAgLy8gaXRzIGluaGVyaXRlZCBwcm9wZXJ0aWVzLiBJZiB0aGUgbGFzdCBpdGVyYXRlZCBwcm9wZXJ0eSBpcyBhbiBvYmplY3Qnc1xuICAvLyBvd24gcHJvcGVydHkgdGhlbiB0aGVyZSBhcmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAgYmFzZUZvckluKHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0ID0ga2V5O1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHJlc3VsdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQbGFpbk9iamVjdDtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3RyaW5nVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiIsInZhciBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID0gdHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID0gdHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID0gdHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID0gdHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID0gdHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmpUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwidmFyIGJhc2VDb3B5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUNvcHknKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5c0luJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHBsYWluIG9iamVjdCBmbGF0dGVuaW5nIGluaGVyaXRlZCBlbnVtZXJhYmxlXG4gKiBwcm9wZXJ0aWVzIG9mIGB2YWx1ZWAgdG8gb3duIHByb3BlcnRpZXMgb2YgdGhlIHBsYWluIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgcGxhaW4gb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBuZXcgRm9vKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIF8udG9QbGFpbk9iamVjdChuZXcgRm9vKSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfVxuICovXG5mdW5jdGlvbiB0b1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ29weSh2YWx1ZSwga2V5c0luKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QbGFpbk9iamVjdDtcbiIsInZhciBhc3NpZ25XaXRoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYXNzaWduV2l0aCcpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlQXNzaWduJyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lcicpO1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICogb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXMgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuXG4gKiBJZiBgY3VzdG9taXplcmAgaXMgcHJvdmlkZWQgaXQncyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGFzc2lnbmVkIHZhbHVlcy5cbiAqIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gKiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgYmFzZWQgb25cbiAqIFtgT2JqZWN0LmFzc2lnbmBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5hc3NpZ24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgZXh0ZW5kXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmFzc2lnbih7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogNDAgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gKiAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHZhbHVlKSA/IG90aGVyIDogdmFsdWU7XG4gKiB9KTtcbiAqXG4gKiBkZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiBjdXN0b21pemVyXG4gICAgPyBhc3NpZ25XaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKVxuICAgIDogYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ247XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnLi9hc3NpZ24nKSxcbiAgICBhc3NpZ25EZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Fzc2lnbkRlZmF1bHRzJyksXG4gICAgY3JlYXRlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cycpO1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICogb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIE9uY2UgYVxuICogcHJvcGVydHkgaXMgc2V0LCBhZGRpdGlvbmFsIHZhbHVlcyBvZiB0aGUgc2FtZSBwcm9wZXJ0eSBhcmUgaWdub3JlZC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmF1bHRzKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICovXG52YXIgZGVmYXVsdHMgPSBjcmVhdGVEZWZhdWx0cyhhc3NpZ24sIGFzc2lnbkRlZmF1bHRzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsInZhciBjcmVhdGVEZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZURlZmF1bHRzJyksXG4gICAgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyksXG4gICAgbWVyZ2VEZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL21lcmdlRGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmRlZmF1bHRzYCBleGNlcHQgdGhhdCBpdCByZWN1cnNpdmVseSBhc3NpZ25zXG4gKiBkZWZhdWx0IHByb3BlcnRpZXMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0c0RlZXAoeyAndXNlcic6IHsgJ25hbWUnOiAnYmFybmV5JyB9IH0sIHsgJ3VzZXInOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogMzYgfSB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9IH1cbiAqXG4gKi9cbnZhciBkZWZhdWx0c0RlZXAgPSBjcmVhdGVEZWZhdWx0cyhtZXJnZSwgbWVyZ2VEZWZhdWx0cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHNEZWVwO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2dldE5hdGl2ZScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKSxcbiAgICBzaGltS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL3NoaW1LZXlzJyk7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IGdldE5hdGl2ZShPYmplY3QsICdrZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbnZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgQ3RvciA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCkgfHxcbiAgICAgICh0eXBlb2Ygb2JqZWN0ICE9ICdmdW5jdGlvbicgJiYgaXNBcnJheUxpa2Uob2JqZWN0KSkpIHtcbiAgICByZXR1cm4gc2hpbUtleXMob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gaXNPYmplY3Qob2JqZWN0KSA/IG5hdGl2ZUtleXMob2JqZWN0KSA6IFtdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIGxlbmd0aCA9IChsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSkgJiYgbGVuZ3RoKSB8fCAwO1xuXG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGlzUHJvdG8gPSB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBsZW5ndGggPiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IChpbmRleCArICcnKTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoc2tpcEluZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpICYmXG4gICAgICAgICEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuIiwidmFyIGJhc2VNZXJnZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VNZXJnZScpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlQXNzaWduZXInKTtcblxuLyoqXG4gKiBSZWN1cnNpdmVseSBtZXJnZXMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiB0aGUgc291cmNlIG9iamVjdChzKSwgdGhhdFxuICogZG9uJ3QgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYCBpbnRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlc1xuICogb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuIElmIGBjdXN0b21pemVyYCBpc1xuICogcHJvdmlkZWQgaXQncyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uIGFuZFxuICogc291cmNlIHByb3BlcnRpZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgIG1lcmdpbmcgaXMgaGFuZGxlZFxuICogYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZFxuICogd2l0aCBmaXZlIGFyZ3VtZW50czogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjdXN0b21pemVyYC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IHtcbiAqICAgJ2RhdGEnOiBbeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ3VzZXInOiAnZnJlZCcgfV1cbiAqIH07XG4gKlxuICogdmFyIGFnZXMgPSB7XG4gKiAgICdkYXRhJzogW3sgJ2FnZSc6IDM2IH0sIHsgJ2FnZSc6IDQwIH1dXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2UodXNlcnMsIGFnZXMpO1xuICogLy8gPT4geyAnZGF0YSc6IFt7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfV0gfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIG9iamVjdCA9IHtcbiAqICAgJ2ZydWl0cyc6IFsnYXBwbGUnXSxcbiAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICogfTtcbiAqXG4gKiB2YXIgb3RoZXIgPSB7XG4gKiAgICdmcnVpdHMnOiBbJ2JhbmFuYSddLFxuICogICAndmVnZXRhYmxlcyc6IFsnY2Fycm90J11cbiAqIH07XG4gKlxuICogXy5tZXJnZShvYmplY3QsIG90aGVyLCBmdW5jdGlvbihhLCBiKSB7XG4gKiAgIGlmIChfLmlzQXJyYXkoYSkpIHtcbiAqICAgICByZXR1cm4gYS5jb25jYXQoYik7XG4gKiAgIH1cbiAqIH0pO1xuICogLy8gPT4geyAnZnJ1aXRzJzogWydhcHBsZScsICdiYW5hbmEnXSwgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnLCAnY2Fycm90J10gfVxuICovXG52YXIgbWVyZ2UgPSBjcmVhdGVBc3NpZ25lcihiYXNlTWVyZ2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byBpdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzICovXG5cbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcy5qc1wiICk7XG5cbi8qKlxuICogU3RyaXAgSFRNTC10YWdzIGZyb20gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHRoZSBIVE1MLXRhZ3MgZnJvbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgSFRNTC10YWdzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvKDwoW14+XSspPikvaWcsIFwiIFwiICk7XG5cdHRleHQgPSBzdHJpcFNwYWNlcyggdGV4dCApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzICovXG5cbi8qKlxuICogU3RyaXAgZG91YmxlIHNwYWNlcyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCBzcGFjZXMgZnJvbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgZG91YmxlIHNwYWNlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXG5cdC8vIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzIHdpdGggc2luZ2xlIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXHN7Mix9L2csIFwiIFwiICk7XG5cblx0Ly8gUmVwbGFjZSBzcGFjZXMgZm9sbG93ZWQgYnkgcGVyaW9kcyB3aXRoIG9ubHkgdGhlIHBlcmlvZC5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc1xcLi9nLCBcIi5cIiApO1xuXG5cdC8vIFJlbW92ZSBmaXJzdC9sYXN0IGNoYXJhY3RlciBpZiBzcGFjZVxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXlxccyt8XFxzKyQvZywgXCJcIiApO1xuXG5cdHJldHVybiB0ZXh0O1xufTtcbiJdfQ==
