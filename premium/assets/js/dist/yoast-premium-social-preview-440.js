(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./matchStringWithRegex.js":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./getL10nObject":4}],4:[function(require,module,exports){
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

},{"lodash/isUndefined":6}],5:[function(require,module,exports){
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

},{"./getL10nObject":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../../../../js/src/analysis/getDescriptionPlaceholder":3,"../../../../js/src/analysis/getTitlePlaceholder":5,"./helpPanel":7,"jed":9,"lodash/clone":120,"lodash/debounce":121,"lodash/forEach":123,"lodash/has":124,"lodash/isUndefined":136,"yoast-social-previews":146,"yoastseo/js/stringProcessing/imageInText":1}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":71,"./_root":110}],11:[function(require,module,exports){
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

},{"./_hashClear":79,"./_hashDelete":80,"./_hashGet":81,"./_hashHas":82,"./_hashSet":83}],12:[function(require,module,exports){
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

},{"./_listCacheClear":92,"./_listCacheDelete":93,"./_listCacheGet":94,"./_listCacheHas":95,"./_listCacheSet":96}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":71,"./_root":110}],14:[function(require,module,exports){
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

},{"./_mapCacheClear":97,"./_mapCacheDelete":98,"./_mapCacheGet":99,"./_mapCacheHas":100,"./_mapCacheSet":101}],15:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":71,"./_root":110}],16:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":71,"./_root":110}],17:[function(require,module,exports){
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

},{"./_ListCache":12,"./_stackClear":112,"./_stackDelete":113,"./_stackGet":114,"./_stackHas":115,"./_stackSet":116}],18:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":110}],19:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":110}],20:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":71,"./_root":110}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./_baseTimes":46,"./_isIndex":87,"./isArguments":126,"./isArray":127,"./isBuffer":129,"./isTypedArray":135}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./_baseAssignValue":32,"./eq":122}],29:[function(require,module,exports){
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

},{"./eq":122}],30:[function(require,module,exports){
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

},{"./_copyObject":60,"./keys":137}],31:[function(require,module,exports){
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

},{"./_copyObject":60,"./keysIn":138}],32:[function(require,module,exports){
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

},{"./_defineProperty":66}],33:[function(require,module,exports){
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

},{"./_Stack":17,"./_arrayEach":23,"./_assignValue":28,"./_baseAssign":30,"./_baseAssignIn":31,"./_cloneBuffer":52,"./_copyArray":59,"./_copySymbols":61,"./_copySymbolsIn":62,"./_getAllKeys":68,"./_getAllKeysIn":69,"./_getTag":76,"./_initCloneArray":84,"./_initCloneByTag":85,"./_initCloneObject":86,"./isArray":127,"./isBuffer":129,"./isObject":132,"./keys":137}],34:[function(require,module,exports){
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

},{"./isObject":132}],35:[function(require,module,exports){
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

},{"./_baseForOwn":37,"./_createBaseEach":64}],36:[function(require,module,exports){
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

},{"./_createBaseFor":65}],37:[function(require,module,exports){
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

},{"./_baseFor":36,"./keys":137}],38:[function(require,module,exports){
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

},{"./_arrayPush":26,"./isArray":127}],39:[function(require,module,exports){
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
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":18,"./_getRawTag":73,"./_objectToString":108}],40:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":133}],42:[function(require,module,exports){
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

},{"./_isMasked":90,"./_toSource":119,"./isFunction":130,"./isObject":132}],43:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isLength":131,"./isObjectLike":133}],44:[function(require,module,exports){
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

},{"./_isPrototype":91,"./_nativeKeys":105}],45:[function(require,module,exports){
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

},{"./_isPrototype":91,"./_nativeKeysIn":106,"./isObject":132}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{"./_Symbol":18,"./_arrayMap":25,"./isArray":127,"./isSymbol":134}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"./identity":125}],50:[function(require,module,exports){
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

},{"./_isKey":88,"./_stringToPath":117,"./isArray":127,"./toString":144}],51:[function(require,module,exports){
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

},{"./_Uint8Array":19}],52:[function(require,module,exports){
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

},{"./_root":110}],53:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":51}],54:[function(require,module,exports){
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

},{"./_addMapEntry":21,"./_arrayReduce":27,"./_mapToArray":102}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{"./_addSetEntry":22,"./_arrayReduce":27,"./_setToArray":111}],57:[function(require,module,exports){
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

},{"./_Symbol":18}],58:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":51}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{"./_assignValue":28,"./_baseAssignValue":32}],61:[function(require,module,exports){
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

},{"./_copyObject":60,"./_getSymbols":74}],62:[function(require,module,exports){
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

},{"./_copyObject":60,"./_getSymbolsIn":75}],63:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":110}],64:[function(require,module,exports){
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

},{"./isArrayLike":128}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":71}],67:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],68:[function(require,module,exports){
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

},{"./_baseGetAllKeys":38,"./_getSymbols":74,"./keys":137}],69:[function(require,module,exports){
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

},{"./_baseGetAllKeys":38,"./_getSymbolsIn":75,"./keysIn":138}],70:[function(require,module,exports){
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

},{"./_isKeyable":89}],71:[function(require,module,exports){
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

},{"./_baseIsNative":42,"./_getValue":77}],72:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":109}],73:[function(require,module,exports){
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

},{"./_Symbol":18}],74:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":109,"./stubArray":141}],75:[function(require,module,exports){
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

},{"./_arrayPush":26,"./_getPrototype":72,"./_getSymbols":74,"./stubArray":141}],76:[function(require,module,exports){
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

},{"./_DataView":10,"./_Map":13,"./_Promise":15,"./_Set":16,"./_WeakMap":20,"./_baseGetTag":39,"./_toSource":119}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{"./_castPath":50,"./_isIndex":87,"./_toKey":118,"./isArguments":126,"./isArray":127,"./isLength":131}],79:[function(require,module,exports){
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

},{"./_nativeCreate":104}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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

},{"./_nativeCreate":104}],82:[function(require,module,exports){
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

},{"./_nativeCreate":104}],83:[function(require,module,exports){
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

},{"./_nativeCreate":104}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":51,"./_cloneDataView":53,"./_cloneMap":54,"./_cloneRegExp":55,"./_cloneSet":56,"./_cloneSymbol":57,"./_cloneTypedArray":58}],86:[function(require,module,exports){
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

},{"./_baseCreate":34,"./_getPrototype":72,"./_isPrototype":91}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
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

},{"./isArray":127,"./isSymbol":134}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{"./_coreJsData":63}],91:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],94:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],95:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],96:[function(require,module,exports){
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

},{"./_assocIndexOf":29}],97:[function(require,module,exports){
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

},{"./_Hash":11,"./_ListCache":12,"./_Map":13}],98:[function(require,module,exports){
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

},{"./_getMapData":70}],99:[function(require,module,exports){
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

},{"./_getMapData":70}],100:[function(require,module,exports){
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

},{"./_getMapData":70}],101:[function(require,module,exports){
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

},{"./_getMapData":70}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
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

},{"./memoize":139}],104:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":71}],105:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":109}],106:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
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

},{"./_freeGlobal":67}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":67}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
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

},{"./_ListCache":12}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{}],116:[function(require,module,exports){
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

},{"./_ListCache":12,"./_Map":13,"./_MapCache":14}],117:[function(require,module,exports){
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

},{"./_memoizeCapped":103}],118:[function(require,module,exports){
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

},{"./isSymbol":134}],119:[function(require,module,exports){
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

},{}],120:[function(require,module,exports){
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

},{"./_baseClone":33}],121:[function(require,module,exports){
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

},{"./isObject":132,"./now":140,"./toNumber":143}],122:[function(require,module,exports){
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

},{}],123:[function(require,module,exports){
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

},{"./_arrayEach":23,"./_baseEach":35,"./_castFunction":49,"./isArray":127}],124:[function(require,module,exports){
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

},{"./_baseHas":40,"./_hasPath":78}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{"./_baseIsArguments":41,"./isObjectLike":133}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
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

},{"./isFunction":130,"./isLength":131}],129:[function(require,module,exports){
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

},{"./_root":110,"./stubFalse":142}],130:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObject":132}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":133}],135:[function(require,module,exports){
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

},{"./_baseIsTypedArray":43,"./_baseUnary":48,"./_nodeUtil":107}],136:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],137:[function(require,module,exports){
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

},{"./_arrayLikeKeys":24,"./_baseKeys":44,"./isArrayLike":128}],138:[function(require,module,exports){
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

},{"./_arrayLikeKeys":24,"./_baseKeysIn":45,"./isArrayLike":128}],139:[function(require,module,exports){
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

},{"./_MapCache":14}],140:[function(require,module,exports){
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

},{"./_root":110}],141:[function(require,module,exports){
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

},{}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{"./isObject":132,"./isSymbol":134}],144:[function(require,module,exports){
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

},{"./_baseToString":47}],145:[function(require,module,exports){
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

},{}],146:[function(require,module,exports){
module.exports = {
	FacebookPreview: require( "./js/facebookPreview" ),
	TwitterPreview: require( "./js/twitterPreview" )
};

},{"./js/facebookPreview":149,"./js/twitterPreview":163}],147:[function(require,module,exports){
var placeholderTemplate = require( "../templates" ).imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object} imageContainer The location to put the placeholder in.
 * @param {string} placeholder The value for the placeholder.
 * @param {boolean} isError When the placeholder should an error.
 * @param {string} modifier A css class modifier to change the styling.
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
		placeholder: placeholder
	} );
}

module.exports= setImagePlaceholder;

},{"../templates":162}],148:[function(require,module,exports){
var isEmpty = require( "lodash/lang/isEmpty" );
var debounce = require( "lodash/function/debounce" );

var stripHTMLTags = require( "yoastseo/js/stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "yoastseo/js/stringProcessing/stripSpaces.js" );

/**
 * Represents a field and sets the events for that field.
 *
 * @param {Object} inputField The field to represent.
 * @param {Object} values The values to use.
 * @param {Object|undefined} callback The callback to executed after field change.
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
 * Binds the events
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
 * Do the change event
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
 *
 * @returns {string} The current field value
 */
InputElement.prototype.getInputValue = function() {
	return this.inputField.value;
};

/**
 * Formats the a value for the preview. If value is empty a sample value is used
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
 * Get the value
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
 * Set the current value
 *
 * @param {string} value The value to set
 */
InputElement.prototype.setValue = function( value ) {
	this.values.currentValue = value;
};

module.exports = InputElement;


},{"lodash/function/debounce":166,"lodash/lang/isEmpty":206,"yoastseo/js/stringProcessing/stripHTMLTags.js":222,"yoastseo/js/stringProcessing/stripSpaces.js":223}],149:[function(require,module,exports){
/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var imageDisplayMode = require( "./helpers/imageDisplayMode" );
var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder  = require( "./element/imagePlaceholder" );
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
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
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
		}
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
var FacebookPreview = function( opts, i18n ) {
	this.i18n = i18n || this.constructI18n();

	facebookDefaults.placeholder = {
		title: this.i18n.dgettext( "yoast-social-previews", "This is an example title - edit by clicking here" ),
		description: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext( "yoast-social-previews", "Modify your %1$s description by editing it right here" ),
			"Facebook"
		),
		imageUrl: ""
	};

	defaultsDeep( opts, facebookDefaults );

	if ( !isElement( opts.targetElement ) ) {
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
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
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
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Facebook */
			edit: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "Edit %1$s preview" ), "Facebook" ),
			/** translators: %1$s expands to Facebook */
			snippetPreview: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s preview" ), "Facebook" ),
			/** translators: %1$s expands to Facebook */
			snippetEditor: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s editor" ), "Facebook" )
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
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0],
		authorContainer: targetElement.getElementsByClassName( "editable-preview__value--facebook-author" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render()
		+ this.element.fields.title.render()
		+ this.element.fields.description.render();

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
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s title" ), "Facebook" ),
			labelClassName: "snippet-editor__label"
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s description" ), "Facebook" ),
			labelClassName: "snippet-editor__label"
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s image" ), "Facebook" ),
			labelClassName: "snippet-editor__label"
		} )
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
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.sprintf(
					/** translators: %1$s expands to Facebook */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s title by editing the snippet below." ),
					"Facebook"
				)
			},
			this.updatePreview.bind( this )
		),
		description: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-description" )[0],
			{
				currentValue: this.data.description,
				defaultValue: this.opts.defaultValue.description,
				placeholder: this.opts.placeholder.description,
				fallback: this.i18n.sprintf(
					/** translators: %1$s expands to Facebook */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s description by editing the snippet below." ),
					"Facebook"
				)
			},
			this.updatePreview.bind( this )
		),
		imageUrl: new InputElement(
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
 * Updates the Facebook preview.
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
 * @param {string} title The title to set
 */
FacebookPreview.prototype.setTitle = function( title ) {
	title = this.opts.callbacks.modifyTitle( title );

	this.element.rendered.title.innerHTML = title;
};

/**
 * Sets the preview description.
 *
 * @param {string} description The description to set
 */
FacebookPreview.prototype.setDescription = function( description ) {
	description = this.opts.callbacks.modifyDescription( description );

	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
FacebookPreview.prototype.getImageContainer = function() {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 * @returns {void}
 */
FacebookPreview.prototype.setImage = function ( imageUrl ) {
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
 * @param {string} image The image to use.
 */
FacebookPreview.prototype.addImageToContainer = function( image ) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
FacebookPreview.prototype.removeImageFromContainer = function() {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 * @returns {void}
 */
FacebookPreview.prototype.setSizingClass = function ( img ) {
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
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated maxwidth
 */
FacebookPreview.prototype.getMaxImageWidth = function( img ) {
	if ( this.isSmallImage( img ) ) {
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
FacebookPreview.prototype.isSmallImage = function( image ) {
	return (
		image.width < FACEBOOK_IMAGE_THRESHOLD_WIDTH ||
		image.height < FACEBOOK_IMAGE_THRESHOLD_HEIGHT
	);
};

/**
 * Detects if the Facebook preview image is too small
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
 * Sets the classes on the Facebook preview so that it will display a small Facebook image preview
 */
FacebookPreview.prototype.setSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-small", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the small image classes.
 */
FacebookPreview.prototype.removeSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-small", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
FacebookPreview.prototype.setLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-large", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the large image classes.
 */
FacebookPreview.prototype.removeLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-large", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the Facebook preview so that it will display a portrait Facebook image preview
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
 */
FacebookPreview.prototype.setAuthor = function( authorName ) {
	var authorHtml = "";
	if ( authorName !== "" ) {
		authorHtml = facebookAuthorTemplate(
			{
				authorName: authorName,
				authorBy: this.i18n.dgettext( "yoast-social-previews", "By" )
			}
		);
	}

	this.element.authorContainer.innerHTML = authorHtml;
};

module.exports = FacebookPreview;

},{"./element/imagePlaceholder":147,"./element/input":148,"./helpers/bem/addModifier":151,"./helpers/bem/removeModifier":153,"./helpers/imageDisplayMode":154,"./helpers/renderDescription":157,"./inputs/textInput":159,"./inputs/textarea":160,"./preview/events":161,"./templates.js":162,"jed":9,"lodash/lang/clone":202,"lodash/lang/isElement":205,"lodash/object/defaultsDeep":216}],150:[function(require,module,exports){
/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
module.exports = function( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

},{}],151:[function(require,module,exports){
var addClass = require( "./../addClass" );
var addModifierToClass = require( "./addModifierToClass" );

/**
 * Adds a BEM modifier to an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function addModifier( modifier, targetClass, targetParent ) {
	var element = targetParent.getElementsByClassName( targetClass )[0];
	var newClass = addModifierToClass( modifier, targetClass );

	addClass( element, newClass );
}

module.exports = addModifier;

},{"./../addClass":150,"./addModifierToClass":152}],152:[function(require,module,exports){
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

},{}],153:[function(require,module,exports){
var removeClass = require( "./../removeClass" );
var addModifierToClass = require( "./addModifierToClass" );

/**
 * Removes a BEM modifier from an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function removeModifier( modifier, targetClass, targetParent ) {
	var element = targetParent.getElementsByClassName( targetClass )[0];
	var newClass = addModifierToClass( modifier, targetClass );

	removeClass( element, newClass );
}

module.exports = removeModifier;

},{"./../removeClass":156,"./addModifierToClass":152}],154:[function(require,module,exports){
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

},{}],155:[function(require,module,exports){
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

},{}],156:[function(require,module,exports){
/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
module.exports = function( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

},{}],157:[function(require,module,exports){
var isEmpty = require( "lodash/lang/isEmpty" );

var addClass = require( "./addClass" );
var removeClass = require( "./removeClass" );

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @param {string} descriptionElement Target description element
 * @param {string} description Current description
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

},{"./addClass":150,"./removeClass":156,"lodash/lang/isEmpty":206}],158:[function(require,module,exports){
var defaults = require( "lodash/object/defaults" );
var minimizeHtml = require( "../helpers/minimizeHtml" );

/**
 * Factory for the inputfield.
 *
 * @param {Object} template Template object to use.
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
	function TextField( attributes ) {
		attributes = attributes || {};
		attributes = defaults( attributes, defaultAttributes );

		this._attributes = attributes;
	}

	/**
	 * Returns the HTML attributes set for this text field
	 *
	 * @returns {Object} The HTML attributes
	 */
	TextField.prototype.getAttributes = function() {
		return this._attributes;
	};

	/**
	 * Renders the text field to HTML
	 *
	 * @returns {string} The rendered HTML
	 */
	TextField.prototype.render = function() {
		var html = template( this.getAttributes() );

		html = minimizeHtml( html );

		return html;
	};

	/**
	 * Set the value of the input field
	 *
	 * @param {string} value The value to set on this input field
	 */
	TextField.prototype.setValue = function( value ) {
		this._attributes.value = value;
	};

	/**
	 * Set the value of the input field
	 *
	 * @param {string} className The class to set on this input field
	 */
	TextField.prototype.setClassName = function( className ) {
		this._attributes.className = className;
	};

	return TextField;
}

module.exports = inputFieldFactory;

},{"../helpers/minimizeHtml":155,"lodash/object/defaults":215}],159:[function(require,module,exports){
var inputFieldFactory = require( "./inputField" );

module.exports = inputFieldFactory( require( "../templates" ).fields.text );

},{"../templates":162,"./inputField":158}],160:[function(require,module,exports){
var inputFieldFactory = require( "./inputField" );

module.exports = inputFieldFactory( require( "../templates" ).fields.textarea );

},{"../templates":162,"./inputField":158}],161:[function(require,module,exports){
var forEach = require( "lodash/collection/forEach" );

var addClass = require( "../helpers/addClass.js" );
var removeClass = require( "../helpers/removeClass.js" );

/**
 *
 * @param {Object} bindings The fields to bind.
 * @param {Object} element The element to bind the events to.
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
 * @param {Object} editToggle - The edit toggle element
 * @param {Object} closeEditor - The button to close the editor
 */
PreviewEvents.prototype.bindEvents = function( editToggle, closeEditor ) {
	if ( !this._alwaysOpen ) {
		editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
		closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );
	}

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( this._bindings, this.bindInputEvent.bind( this ) );
};

/**
 * Binds the event for the input
 *
 * @param {Object} binding The field to bind.
 */
PreviewEvents.prototype.bindInputEvent = function( binding ) {
	var previewElement = document.getElementsByClassName( binding.preview )[0];
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
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

module.exports = PreviewEvents;

},{"../helpers/addClass.js":150,"../helpers/removeClass.js":156,"lodash/collection/forEach":164}],162:[function(require,module,exports){
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
  var VERSION = '4.16.6';

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
    value = Object(value);
    return (symToStringTag && symToStringTag in value)
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

},{}],163:[function(require,module,exports){
/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder  = require( "./element/imagePlaceholder" );
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
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
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
		}
	}
};

var inputTwitterPreviewBindings = [
	{
		"preview": "editable-preview__title--twitter",
		"inputField": "title"
	},
	{
		"preview": "editable-preview__image--twitter",
		"inputField": "imageUrl"
	},
	{
		"preview": "editable-preview__description--twitter",
		"inputField": "description"
	}
];

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
var TwitterPreview = function( opts, i18n ) {
	this.i18n = i18n || this.constructI18n();

	twitterDefaults.placeholder = {
		title: this.i18n.dgettext( "yoast-social-previews", "This is an example title - edit by clicking here" ),
		description: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext( "yoast-social-previews", "Modify your %1$s description by editing it right here" ),
			"Twitter"
		),
		imageUrl: ""
	};

	defaultsDeep( opts, twitterDefaults );

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The Twitter preview requires a valid target element" );
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
TwitterPreview.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
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
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Twitter */
			edit: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "Edit %1$s preview" ), "Twitter" ),
			/** translators: %1$s expands to Twitter */
			snippetPreview: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s preview" ), "Twitter" ),
			/** translators: %1$s expands to Twitter */
			snippetEditor: this.i18n.sprintf( this.i18n.dgettext( "yoast-social-previews", "%1$s editor" ), "Twitter" )
		}
	} );

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName( "editable-preview__value--twitter-title" )[0],
			description: targetElement.getElementsByClassName( "editable-preview__value--twitter-description" )[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName( "editable-preview--twitter" )[0],
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render()
		+ this.element.fields.title.render()
		+ this.element.fields.description.render();

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
		imageUrl: targetElement.getElementsByClassName( "editable-preview__image--twitter" )[0],
		description: this.element.rendered.description.parentNode
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
			labelClassName: "snippet-editor__label"
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
			labelClassName: "snippet-editor__label"
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
			labelClassName: "snippet-editor__label"
		} )
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
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.sprintf(
					/** translators: %1$s expands to Twitter */
					this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s title by editing the snippet below." ),
					"Twitter"
				)
			},
			this.updatePreview.bind( this )
		),
		 description: new InputElement(
			 targetElement.getElementsByClassName( "js-snippet-editor-description" )[0],
			 {
				 currentValue: this.data.description,
				 defaultValue: this.opts.defaultValue.description,
				 placeholder: this.opts.placeholder.description,
				 fallback: this.i18n.sprintf(
				    /** translators: %1$s expands to Twitter */
					 this.i18n.dgettext( "yoast-social-previews", "Please provide a %1$s description by editing the snippet below." ),
					 "Twitter"
				 )
			 },
			 this.updatePreview.bind( this )
		 ),
		imageUrl: new InputElement(
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
 */
TwitterPreview.prototype.setTitle = function( title ) {
	title = this.opts.callbacks.modifyTitle( title );

	this.element.rendered.title.innerHTML = title;
};

/**
 * Set the preview description.
 *
 * @param {string} description The description to set.
 */
TwitterPreview.prototype.setDescription = function( description ) {
	description = this.opts.callbacks.modifyDescription( description );

	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
TwitterPreview.prototype.getImageContainer = function() {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
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
 * @param {string} image The image to use.
 */
TwitterPreview.prototype.addImageToContainer = function( image ) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
TwitterPreview.prototype.removeImageFromContainer = function() {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
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
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated max width.
 */
TwitterPreview.prototype.getMaxImageWidth = function( img ) {
	if ( this.isSmallImage( img ) ) {
		return WIDTH_TWITTER_IMAGE_SMALL;
	}

	return WIDTH_TWITTER_IMAGE_LARGE;
};
/**
 * Sets the default twitter placeholder
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
 * Detects if the twitter preview should switch to small image mode
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
 * Detects if the twitter preview image is too small
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
 * Sets the classes on the facebook preview so that it will display a small facebook image preview
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
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
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
 */
TwitterPreview.prototype.removeImageClasses = function() {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
TwitterPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputTwitterPreviewBindings, this.element, true );
	previewEvents.bindEvents( this.element.editToggle, this.element.closeEditor );
};

module.exports = TwitterPreview;

},{"./element/imagePlaceholder":147,"./element/input":148,"./helpers/bem/addModifier":151,"./helpers/bem/removeModifier":153,"./helpers/renderDescription":157,"./inputs/textInput":159,"./inputs/textarea":160,"./preview/events":161,"./templates":162,"jed":9,"lodash/lang/clone":202,"lodash/lang/isElement":205,"lodash/object/defaultsDeep":216}],164:[function(require,module,exports){
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

},{"../internal/arrayEach":169,"../internal/baseEach":175,"../internal/createForEach":188}],165:[function(require,module,exports){
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

},{"../internal/getNative":190}],166:[function(require,module,exports){
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

},{"../date/now":165,"../lang/isObject":209}],167:[function(require,module,exports){
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

},{}],168:[function(require,module,exports){
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

},{}],169:[function(require,module,exports){
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

},{}],170:[function(require,module,exports){
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

},{}],171:[function(require,module,exports){
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

},{"../object/keys":217}],172:[function(require,module,exports){
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

},{"../object/keys":217,"./baseCopy":174}],173:[function(require,module,exports){
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

},{"../lang/isArray":204,"../lang/isObject":209,"./arrayCopy":168,"./arrayEach":169,"./baseAssign":172,"./baseForOwn":178,"./initCloneArray":191,"./initCloneByTag":192,"./initCloneObject":193}],174:[function(require,module,exports){
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

},{}],175:[function(require,module,exports){
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

},{"./baseForOwn":178,"./createBaseEach":185}],176:[function(require,module,exports){
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

},{"./createBaseFor":186}],177:[function(require,module,exports){
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

},{"../object/keysIn":218,"./baseFor":176}],178:[function(require,module,exports){
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

},{"../object/keys":217,"./baseFor":176}],179:[function(require,module,exports){
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

},{"../lang/isArray":204,"../lang/isObject":209,"../lang/isTypedArray":212,"../object/keys":217,"./arrayEach":169,"./baseMergeDeep":180,"./isArrayLike":194,"./isObjectLike":198}],180:[function(require,module,exports){
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

},{"../lang/isArguments":203,"../lang/isArray":204,"../lang/isPlainObject":210,"../lang/isTypedArray":212,"../lang/toPlainObject":213,"./arrayCopy":168,"./isArrayLike":194}],181:[function(require,module,exports){
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

},{}],182:[function(require,module,exports){
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

},{"../utility/identity":220}],183:[function(require,module,exports){
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

},{}],184:[function(require,module,exports){
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

},{"../function/restParam":167,"./bindCallback":182,"./isIterateeCall":196}],185:[function(require,module,exports){
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

},{"./getLength":189,"./isLength":197,"./toObject":201}],186:[function(require,module,exports){
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

},{"./toObject":201}],187:[function(require,module,exports){
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

},{"../function/restParam":167}],188:[function(require,module,exports){
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

},{"../lang/isArray":204,"./bindCallback":182}],189:[function(require,module,exports){
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

},{"./baseProperty":181}],190:[function(require,module,exports){
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

},{"../lang/isNative":208}],191:[function(require,module,exports){
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

},{}],192:[function(require,module,exports){
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

},{"./bufferClone":183}],193:[function(require,module,exports){
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

},{}],194:[function(require,module,exports){
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

},{"./getLength":189,"./isLength":197}],195:[function(require,module,exports){
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

},{}],196:[function(require,module,exports){
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

},{"../lang/isObject":209,"./isArrayLike":194,"./isIndex":195}],197:[function(require,module,exports){
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

},{}],198:[function(require,module,exports){
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

},{}],199:[function(require,module,exports){
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

},{"../object/merge":219}],200:[function(require,module,exports){
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

},{"../lang/isArguments":203,"../lang/isArray":204,"../object/keysIn":218,"./isIndex":195,"./isLength":197}],201:[function(require,module,exports){
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

},{"../lang/isObject":209}],202:[function(require,module,exports){
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

},{"../internal/baseClone":173,"../internal/bindCallback":182,"../internal/isIterateeCall":196}],203:[function(require,module,exports){
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

},{"../internal/isArrayLike":194,"../internal/isObjectLike":198}],204:[function(require,module,exports){
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

},{"../internal/getNative":190,"../internal/isLength":197,"../internal/isObjectLike":198}],205:[function(require,module,exports){
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

},{"../internal/isObjectLike":198,"./isPlainObject":210}],206:[function(require,module,exports){
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

},{"../internal/isArrayLike":194,"../internal/isObjectLike":198,"../object/keys":217,"./isArguments":203,"./isArray":204,"./isFunction":207,"./isString":211}],207:[function(require,module,exports){
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

},{"./isObject":209}],208:[function(require,module,exports){
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

},{"../internal/isObjectLike":198,"./isFunction":207}],209:[function(require,module,exports){
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

},{}],210:[function(require,module,exports){
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

},{"../internal/baseForIn":177,"../internal/isObjectLike":198,"./isArguments":203}],211:[function(require,module,exports){
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

},{"../internal/isObjectLike":198}],212:[function(require,module,exports){
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

},{"../internal/isLength":197,"../internal/isObjectLike":198}],213:[function(require,module,exports){
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

},{"../internal/baseCopy":174,"../object/keysIn":218}],214:[function(require,module,exports){
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

},{"../internal/assignWith":171,"../internal/baseAssign":172,"../internal/createAssigner":184}],215:[function(require,module,exports){
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

},{"../internal/assignDefaults":170,"../internal/createDefaults":187,"./assign":214}],216:[function(require,module,exports){
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

},{"../internal/createDefaults":187,"../internal/mergeDefaults":199,"./merge":219}],217:[function(require,module,exports){
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

},{"../internal/getNative":190,"../internal/isArrayLike":194,"../internal/shimKeys":200,"../lang/isObject":209}],218:[function(require,module,exports){
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

},{"../internal/isIndex":195,"../internal/isLength":197,"../lang/isArguments":203,"../lang/isArray":204,"../lang/isObject":209}],219:[function(require,module,exports){
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

},{"../internal/baseMerge":179,"../internal/createAssigner":184}],220:[function(require,module,exports){
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

},{}],221:[function(require,module,exports){
var blockElements = [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption",
	"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav",
	"noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ];
var inlineElements = [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea" ];

var blockElementsRegex = new RegExp( "^(" + blockElements.join( "|" ) + ")$", "i" );
var inlineElementsRegex = new RegExp( "^(" + inlineElements.join( "|" ) + ")$", "i" );

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );
var blockElementEndRegex = new RegExp( "^</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

var inlineElementStartRegex = new RegExp( "^<(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );
var inlineElementEndRegex = new RegExp( "^</(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require( "tokenizer2/core" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	htmlBlockTokenizer.addRule( contentRegex, "content" );
	htmlBlockTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );

	htmlBlockTokenizer.addRule( blockElementStartRegex, "block-start" );
	htmlBlockTokenizer.addRule( blockElementEndRegex, "block-end" );
	htmlBlockTokenizer.addRule( inlineElementStartRegex, "inline-start" );
	htmlBlockTokenizer.addRule( inlineElementEndRegex, "inline-end" );

	htmlBlockTokenizer.addRule( otherElementStartRegex, "other-element-start" );
	htmlBlockTokenizer.addRule( otherElementEndRegex, "other-element-end" );
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement( htmlElementName ) {
	return blockElementsRegex.test( htmlElementName );
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement( htmlElementName ) {
	return inlineElementsRegex.test( htmlElementName );
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks( text ) {
	var blocks = [], depth = 0,
		blockStartTag = "",
		currentBlock = "",
		blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace( commentRegex, "" );

	createTokenizer();
	htmlBlockTokenizer.onText( text );

	htmlBlockTokenizer.end();

	forEach( tokens, function( token, i ) {
		var nextToken = tokens[ i + 1 ];

		switch ( token.type ) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if ( ! nextToken || ( depth === 0 && ( nextToken.type === "block-start" || nextToken.type === "block-end" ) ) ) {
					currentBlock += token.src;

					blocks.push( currentBlock );
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if ( depth !== 0 ) {
					if ( currentBlock.trim() !== "" ) {
						blocks.push( currentBlock );
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
				if ( "" !== blockStartTag && "" !== blockEndTag ) {
					blocks.push( blockStartTag + currentBlock + blockEndTag );
				} else if ( "" !== currentBlock.trim() ) {
					blocks.push( currentBlock );
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if ( depth < 0 ) {
			depth = 0;
		}
	} );

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize( getBlocks ),
};

},{"lodash/forEach":278,"lodash/memoize":290,"tokenizer2/core":145}],222:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var blockElements = require( "../helpers/html.js" ).blockElements;

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>", "i" );
var blockElementEndRegex = new RegExp( "</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function( text ) {
	text = text.replace( /^(<\/([^>]+)>)+/i, "" );
	text = text.replace( /(<([^\/>]+)>)+$/i, "" );
	return text;
};

/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
var stripBlockTagsAtStartEnd = function( text ) {
	text = text.replace( blockElementStartRegex, "" );
	text = text.replace( blockElementEndRegex, "" );
	return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

module.exports = {
	stripFullTags: stripFullTags,
	stripIncompleteTags: stripIncompleteTags,
	stripBlockTagsAtStartEnd: stripBlockTagsAtStartEnd,
};

},{"../helpers/html.js":221,"../stringProcessing/stripSpaces.js":223}],223:[function(require,module,exports){
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

},{}],224:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./_hashClear":251,"./_hashDelete":252,"./_hashGet":253,"./_hashHas":254,"./_hashSet":255,"dup":11}],225:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_listCacheClear":260,"./_listCacheDelete":261,"./_listCacheGet":262,"./_listCacheHas":263,"./_listCacheSet":264,"dup":12}],226:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./_getNative":248,"./_root":275,"dup":13}],227:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./_mapCacheClear":265,"./_mapCacheDelete":266,"./_mapCacheGet":267,"./_mapCacheHas":268,"./_mapCacheSet":269,"dup":14}],228:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"./_root":275,"dup":18}],229:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],230:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./_baseTimes":240,"./_isIndex":256,"./isArguments":280,"./isArray":281,"./isBuffer":283,"./isTypedArray":288,"dup":24}],231:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./eq":277,"dup":29}],232:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./_baseForOwn":234,"./_createBaseEach":244,"dup":35}],233:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./_createBaseFor":245,"dup":36}],234:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./_baseFor":233,"./keys":289,"dup":37}],235:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"./_Symbol":228,"./_getRawTag":249,"./_objectToString":273,"dup":39}],236:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./_baseGetTag":235,"./isObjectLike":287,"dup":41}],237:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./_isMasked":258,"./_toSource":276,"./isFunction":284,"./isObject":286,"dup":42}],238:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"./_baseGetTag":235,"./isLength":285,"./isObjectLike":287,"dup":43}],239:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./_isPrototype":259,"./_nativeKeys":271,"dup":44}],240:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],241:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],242:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./identity":279,"dup":49}],243:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"./_root":275,"dup":63}],244:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"./isArrayLike":282,"dup":64}],245:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],246:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],247:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"./_isKeyable":257,"dup":70}],248:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"./_baseIsNative":237,"./_getValue":250,"dup":71}],249:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"./_Symbol":228,"dup":73}],250:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"dup":77}],251:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./_nativeCreate":270,"dup":79}],252:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"dup":80}],253:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"./_nativeCreate":270,"dup":81}],254:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"./_nativeCreate":270,"dup":82}],255:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./_nativeCreate":270,"dup":83}],256:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],257:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"dup":89}],258:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"./_coreJsData":243,"dup":90}],259:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"dup":91}],260:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],261:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"./_assocIndexOf":231,"dup":93}],262:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"./_assocIndexOf":231,"dup":94}],263:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"./_assocIndexOf":231,"dup":95}],264:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./_assocIndexOf":231,"dup":96}],265:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"./_Hash":224,"./_ListCache":225,"./_Map":226,"dup":97}],266:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"./_getMapData":247,"dup":98}],267:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./_getMapData":247,"dup":99}],268:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"./_getMapData":247,"dup":100}],269:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"./_getMapData":247,"dup":101}],270:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"./_getNative":248,"dup":104}],271:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./_overArg":274,"dup":105}],272:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"./_freeGlobal":246,"dup":107}],273:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],274:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],275:[function(require,module,exports){
arguments[4][110][0].apply(exports,arguments)
},{"./_freeGlobal":246,"dup":110}],276:[function(require,module,exports){
arguments[4][119][0].apply(exports,arguments)
},{"dup":119}],277:[function(require,module,exports){
arguments[4][122][0].apply(exports,arguments)
},{"dup":122}],278:[function(require,module,exports){
arguments[4][123][0].apply(exports,arguments)
},{"./_arrayEach":229,"./_baseEach":232,"./_castFunction":242,"./isArray":281,"dup":123}],279:[function(require,module,exports){
arguments[4][125][0].apply(exports,arguments)
},{"dup":125}],280:[function(require,module,exports){
arguments[4][126][0].apply(exports,arguments)
},{"./_baseIsArguments":236,"./isObjectLike":287,"dup":126}],281:[function(require,module,exports){
arguments[4][127][0].apply(exports,arguments)
},{"dup":127}],282:[function(require,module,exports){
arguments[4][128][0].apply(exports,arguments)
},{"./isFunction":284,"./isLength":285,"dup":128}],283:[function(require,module,exports){
arguments[4][129][0].apply(exports,arguments)
},{"./_root":275,"./stubFalse":291,"dup":129}],284:[function(require,module,exports){
arguments[4][130][0].apply(exports,arguments)
},{"./_baseGetTag":235,"./isObject":286,"dup":130}],285:[function(require,module,exports){
arguments[4][131][0].apply(exports,arguments)
},{"dup":131}],286:[function(require,module,exports){
arguments[4][132][0].apply(exports,arguments)
},{"dup":132}],287:[function(require,module,exports){
arguments[4][133][0].apply(exports,arguments)
},{"dup":133}],288:[function(require,module,exports){
arguments[4][135][0].apply(exports,arguments)
},{"./_baseIsTypedArray":238,"./_baseUnary":241,"./_nodeUtil":272,"dup":135}],289:[function(require,module,exports){
arguments[4][137][0].apply(exports,arguments)
},{"./_arrayLikeKeys":230,"./_baseKeys":239,"./isArrayLike":282,"dup":137}],290:[function(require,module,exports){
arguments[4][139][0].apply(exports,arguments)
},{"./_MapCache":227,"dup":139}],291:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"dup":142}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9Zb2FzdFNFTy9qcy9zdHJpbmdQcm9jZXNzaW5nL2ltYWdlSW5UZXh0LmpzIiwiLi4vLi4vWW9hc3RTRU8vanMvc3RyaW5nUHJvY2Vzc2luZy9tYXRjaFN0cmluZ1dpdGhSZWdleC5qcyIsIi4uL2pzL3NyYy9hbmFseXNpcy9nZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyLmpzIiwiLi4vanMvc3JjL2FuYWx5c2lzL2dldEwxMG5PYmplY3QuanMiLCIuLi9qcy9zcmMvYW5hbHlzaXMvZ2V0VGl0bGVQbGFjZWhvbGRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNVbmRlZmluZWQuanMiLCJhc3NldHMvanMvc3JjL2hlbHBQYW5lbC5qcyIsImFzc2V0cy9qcy9zcmMveW9hc3QtcHJlbWl1bS1zb2NpYWwtcHJldmlldy5qcyIsIm5vZGVfbW9kdWxlcy9qZWQvamVkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZE1hcEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYWRkU2V0RW50cnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25Jbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yT3duLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldEFsbEtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUJ1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL3Rva2VuaXplcjIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZWxlbWVudC9pbnB1dC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZmFjZWJvb2tQcmV2aWV3LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2FkZENsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9hZGRNb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9iZW0vYWRkTW9kaWZpZXJUb0NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9pbWFnZURpc3BsYXlNb2RlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL21pbmltaXplSHRtbC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9yZW5kZXJEZXNjcmlwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL2lucHV0RmllbGQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0SW5wdXQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2lucHV0cy90ZXh0YXJlYS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvcHJldmlldy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3RlbXBsYXRlcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvdHdpdHRlclByZXZpZXcuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvY29sbGVjdGlvbi9mb3JFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2RhdGUvbm93LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2Z1bmN0aW9uL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2Z1bmN0aW9uL3Jlc3RQYXJhbS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9hcnJheUNvcHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYXJyYXlFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbkRlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbldpdGguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQ2xvbmUuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNvcHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9ySW4uanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZvck93bi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlTWVyZ2UuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1lcmdlRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmluZENhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2J1ZmZlckNsb25lLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VFYWNoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VGb3IuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlRm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9nZXRMZW5ndGguanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9tZXJnZURlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3NoaW1LZXlzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3RvT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvY2xvbmUuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0VsZW1lbnQuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1BsYWluT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNTdHJpbmcuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy90b1BsYWluT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9kZWZhdWx0c0RlZXAuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3QvbWVyZ2UuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvdXRpbGl0eS9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2hlbHBlcnMvaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy95b2FzdHNlby9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQSxJQUFJLHVCQUF1QixRQUEzQixBQUEyQixBQUFTOztBQUVwQzs7Ozs7O0FBTUEsT0FBQSxBQUFPLFVBQVUsVUFBQSxBQUFVLE1BQU8sQUFDakM7U0FBTyxxQkFBQSxBQUFzQixNQUE3QixBQUFPLEFBQTRCLEFBQ25DO0FBRkQ7Ozs7O0FDVkE7O0FBRUE7Ozs7Ozs7O0FBT0EsT0FBQSxBQUFPLFVBQVUsVUFBQSxBQUFVLE1BQVYsQUFBZ0IsYUFBYyxBQUM5QztNQUFJLFFBQVEsSUFBQSxBQUFJLE9BQUosQUFBWSxhQUF4QixBQUFZLEFBQXlCLEFBQ3JDO01BQUksVUFBVSxLQUFBLEFBQUssTUFBbkIsQUFBYyxBQUFZLEFBRTFCOztNQUFLLFlBQUwsQUFBaUIsTUFBTyxBQUN2QjtjQUFBLEFBQVUsQUFDVjtBQUVEOztTQUFBLEFBQU8sQUFDUDtBQVREOzs7OztBQ1RBLElBQUksZ0JBQWdCLFFBQVMsaUJBQVQsQ0FBcEI7O0FBRUE7Ozs7O0FBS0EsU0FBUyx5QkFBVCxHQUFxQztBQUNwQyxLQUFJLHlCQUF5QixFQUE3QjtBQUNBLEtBQUksYUFBYSxlQUFqQjs7QUFFQSxLQUFLLFVBQUwsRUFBa0I7QUFDakIsMkJBQXlCLFdBQVcsaUJBQXBDO0FBQ0E7O0FBRUQsUUFBTyxzQkFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQix5QkFBakI7Ozs7O0FDbEJBLElBQUksY0FBYyxRQUFTLG9CQUFULENBQWxCOztBQUVBOzs7OztBQUtBLFNBQVMsYUFBVCxHQUF5QjtBQUN4QixLQUFJLGFBQWEsSUFBakI7O0FBRUEsS0FBSyxDQUFFLFlBQWEsT0FBTyxvQkFBcEIsQ0FBUCxFQUFvRDtBQUNuRCxlQUFhLE9BQU8sb0JBQXBCO0FBQ0EsRUFGRCxNQUVPLElBQUssQ0FBRSxZQUFhLE9BQU8sb0JBQXBCLENBQVAsRUFBb0Q7QUFDMUQsZUFBYSxPQUFPLG9CQUFwQjtBQUNBOztBQUVELFFBQU8sVUFBUDtBQUNBOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQjs7Ozs7QUNuQkEsSUFBSSxnQkFBZ0IsUUFBUyxpQkFBVCxDQUFwQjs7QUFFQTs7Ozs7QUFLQSxTQUFTLG1CQUFULEdBQStCO0FBQzlCLEtBQUksbUJBQW1CLEVBQXZCO0FBQ0EsS0FBSSxhQUFhLGVBQWpCOztBQUVBLEtBQUssVUFBTCxFQUFrQjtBQUNqQixxQkFBbUIsV0FBVyxjQUE5QjtBQUNBOztBQUVELEtBQUsscUJBQXFCLEVBQTFCLEVBQStCO0FBQzlCLHFCQUFtQiwwQkFBbkI7QUFDQTs7QUFFRCxRQUFPLGdCQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLG1CQUFqQjs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0QkE7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBUyxVQUFULENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXNDO0FBQ3JDLFNBQU8sZ0dBQ04saUJBRE0sR0FDYyxRQURkLEdBQ3lCLHFDQUR6QixHQUNpRSxJQURqRSxHQUN3RSxrQkFEL0U7QUFFQTs7QUFFRDs7Ozs7Ozs7QUFRQSxTQUFTLFFBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsRUFBekIsRUFBOEI7QUFDN0IsU0FBTyxZQUFZLEVBQVosR0FBaUIsNkJBQWpCLEdBQWlELElBQWpELEdBQXdELE1BQS9EO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLGNBQVksVUFESTtBQUVoQixZQUFVO0FBRk0sQ0FBakI7Ozs7O0FDM0JBO0FBQ0E7O0FBRUEsSUFBSSxZQUFZLFFBQVMsMENBQVQsQ0FBaEI7QUFDQSxJQUFJLFlBQVksUUFBUyxhQUFULENBQWhCO0FBQ0EsSUFBSSxzQkFBc0IsUUFBUyxpREFBVCxDQUExQjtBQUNBLElBQUksNEJBQTRCLFFBQVMsdURBQVQsQ0FBaEM7O0FBRUEsSUFBSSxZQUFZLFFBQVEsaUJBQVIsQ0FBaEI7QUFDQSxJQUFJLFFBQVEsUUFBUyxjQUFULENBQVo7QUFDQSxJQUFJLFVBQVUsUUFBUyxnQkFBVCxDQUFkO0FBQ0EsSUFBSSxPQUFPLFFBQVMsWUFBVCxDQUFYO0FBQ0EsSUFBSSxjQUFjLFFBQVMsb0JBQVQsQ0FBbEI7O0FBRUEsSUFBSSxNQUFNLFFBQVMsS0FBVCxDQUFWO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUyx1QkFBVCxDQUFyQjs7QUFFRSxXQUFVLENBQVYsRUFBYztBQUNmOzs7O0FBSUEsS0FBSSxnQkFBZ0I7QUFDbkIsV0FBUyxFQURVO0FBRW5CLFlBQVU7QUFGUyxFQUFwQjs7QUFLQSxLQUFJLHVCQUF1QixJQUEzQjs7QUFFQSxLQUFJLGtCQUFrQixlQUFlLGVBQXJDO0FBQ0EsS0FBSSxpQkFBaUIsZUFBZSxjQUFwQzs7QUFFQSxLQUFJLGVBQUosRUFBcUIsY0FBckI7O0FBRUEsS0FBSSxlQUFlLG1CQUFtQixJQUF0Qzs7QUFFQSxLQUFJLE9BQU8sSUFBSSxHQUFKLENBQVMsdUJBQXdCLGFBQWEsT0FBckMsQ0FBVCxDQUFYO0FBQ0EsS0FBSSxlQUFlLEVBQW5COztBQUVBLEtBQUksbUJBQW1CLE9BQXZCOztBQUVBOzs7Ozs7Ozs7OztBQVdBLFVBQVMsc0JBQVQsQ0FBaUMsUUFBakMsRUFBMkMsV0FBM0MsRUFBd0QsWUFBeEQsRUFBc0UsYUFBdEUsRUFBcUYsbUJBQXJGLEVBQTJHO0FBQzFHLE1BQUksd0JBQXdCLEdBQUcsS0FBSCxDQUFTLE1BQVQsQ0FBZ0IsVUFBaEIsR0FBNkIsR0FBRyxLQUFILENBQVU7QUFDbEUsVUFBTyxtQkFBbUIsWUFEd0M7QUFFbEUsV0FBUSxFQUFFLE1BQU0sbUJBQW1CLFlBQTNCLEVBRjBEO0FBR2xFLGFBQVU7QUFId0QsR0FBVixDQUF6RDs7QUFNQSx3QkFBc0IsRUFBdEIsQ0FBMEIsUUFBMUIsRUFBb0MsWUFBVztBQUM5QyxPQUFJLGFBQWEsc0JBQXNCLEtBQXRCLEdBQThCLEdBQTlCLENBQW1DLFdBQW5DLEVBQWlELEtBQWpELEdBQXlELE1BQXpELEVBQWpCOztBQUVBO0FBQ0EsWUFBUyxHQUFULENBQWMsV0FBVyxHQUF6Qjs7QUFFQTs7QUFFQSxLQUFHLFlBQUgsRUFBa0IsSUFBbEI7QUFDQSxHQVREOztBQVdBLElBQUcsWUFBSCxFQUFrQixLQUFsQixDQUF5QixVQUFVLEdBQVYsRUFBZ0I7QUFDeEMsT0FBSSxjQUFKOztBQUVBO0FBQ0EsWUFBUyxHQUFULENBQWMsRUFBZDs7QUFFQTs7QUFFQSxLQUFHLFlBQUgsRUFBa0IsSUFBbEI7QUFDQSxHQVREOztBQVdBLElBQUcsV0FBSCxFQUFpQixLQUFqQixDQUF3QixVQUFVLEdBQVYsRUFBZ0I7QUFDdkMsT0FBSSxjQUFKO0FBQ0EseUJBQXNCLElBQXRCO0FBQ0EsR0FIRDs7QUFLQSxJQUFHLG1CQUFILEVBQXlCLEVBQXpCLENBQTZCLE9BQTdCLEVBQXNDLFVBQVUsV0FBVixFQUF3QjtBQUM3RCx5QkFBc0IsSUFBdEI7QUFDQSxHQUZEO0FBR0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGVBQVQsQ0FBMEIsT0FBMUIsRUFBb0M7QUFDbkMsTUFBSyxPQUFPLEdBQUcsS0FBVixLQUFvQixXQUF6QixFQUF1QztBQUN0QztBQUNBOztBQUVELE1BQUksV0FBVyxFQUFHLFFBQVEsT0FBUixDQUFnQixhQUFuQixFQUFtQyxJQUFuQyxDQUF5Qyw2QkFBekMsQ0FBZjs7QUFFQSxNQUFJLFlBQVksRUFBRyxhQUFILENBQWhCO0FBQ0EsWUFBVSxXQUFWLENBQXVCLFFBQXZCOztBQUVBLE1BQUksbUJBQW1CLG9CQUFxQixPQUFyQixDQUF2Qjs7QUFFQSxNQUFJLGVBQWtCLE9BQVEsUUFBUixFQUFtQixJQUFuQixDQUF5QixJQUF6QixDQUF0QjtBQUNBLE1BQUksZ0JBQWtCLGVBQWUsU0FBckM7QUFDQSxNQUFJLGtCQUFrQixpQkFBaUIsYUFBakIsR0FBaUMsSUFBakMsR0FDckIsZ0ZBRHFCLEdBQzhELGdCQUQ5RCxHQUNpRixXQUR2Rzs7QUFHQSxNQUFJLGlCQUFtQixlQUFlLGdCQUF0QztBQUNBLE1BQUksbUJBQW1CLGlCQUFpQixjQUFqQixHQUFrQyxrQkFBbEMsR0FDdEIsbURBRHNCLEdBQ2dDLG1CQUFtQixpQkFEbkQsR0FDdUUsV0FEOUY7O0FBR0EsSUFBRyxTQUFILEVBQWUsTUFBZixDQUF1QixlQUF2QjtBQUNBLElBQUcsU0FBSCxFQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCOztBQUVBLFdBQVMsSUFBVDtBQUNBLE1BQUssU0FBUyxHQUFULE9BQW1CLEVBQXhCLEVBQTZCO0FBQzVCLEtBQUcsTUFBTSxjQUFULEVBQTBCLElBQTFCO0FBQ0E7O0FBRUQseUJBQ0MsUUFERCxFQUVDLE1BQU0sYUFGUCxFQUdDLE1BQU0sY0FIUCxFQUlDLFFBQVEsYUFBUixDQUFzQixJQUF0QixDQUE0QixPQUE1QixDQUpELEVBS0MsRUFBRyxRQUFRLE9BQVIsQ0FBZ0IsU0FBbkIsRUFBK0IsSUFBL0IsQ0FBcUMsMEJBQXJDLENBTEQ7QUFPQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGNBQVQsR0FBMEI7QUFDekI7QUFDQSxNQUFLLEVBQUcsVUFBSCxFQUFnQixNQUFoQixHQUF5QixDQUE5QixFQUFrQztBQUNqQyxVQUFPLE1BQVA7QUFDQTs7QUFFRDtBQUNBLE1BQUssRUFBRyxvQkFBSCxFQUEwQixNQUExQixHQUFtQyxDQUF4QyxFQUE0QztBQUMzQyxVQUFPLE1BQVA7QUFDQTs7QUFFRCxTQUFPLEVBQVA7QUFDQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxXQUFULEdBQXVCO0FBQ3RCLFVBQVEsZ0JBQVI7QUFDQyxRQUFLLE1BQUw7QUFDQyxXQUFPLGFBQVA7QUFDRCxRQUFLLE1BQUw7QUFDQyxXQUFPLE9BQVA7QUFDRDtBQUNDLFdBQU8sRUFBUDtBQU5GO0FBUUE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxlQUFULEdBQTJCO0FBQzFCLFVBQVMsZ0JBQVQ7QUFDQyxRQUFLLE1BQUw7QUFDQyxXQUFPLFNBQVA7QUFDRCxRQUFLLE1BQUw7QUFDQyxXQUFPLGFBQVA7QUFDRDtBQUNDLFdBQU8sRUFBUDtBQU5GO0FBUUE7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLDRCQUFULENBQXVDLG1CQUF2QyxFQUE0RCxXQUE1RCxFQUEwRTtBQUN6RSxzQkFBb0IsTUFBcEIsQ0FBNEIsY0FBYyxXQUFkLEdBQTRCLFVBQXhEO0FBQ0E7O0FBRUQ7Ozs7QUFJQSxVQUFTLGtCQUFULEdBQThCO0FBQzdCLFNBQU8sRUFBRyx1QkFBSCxFQUE2QixHQUE3QixFQUFQO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUywrQkFBVCxHQUEyQztBQUMxQyxNQUFJLGNBQWMsb0JBQWxCOztBQUVBLE1BQUssT0FBTyxXQUFaLEVBQTBCO0FBQ3pCLGlCQUFjLDJCQUFkO0FBQ0E7O0FBRUQsU0FBTyxXQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFhQSxVQUFTLG9CQUFULENBQStCLGFBQS9CLEVBQThDLFdBQTlDLEVBQTREO0FBQzNELE1BQUksbUJBQW1CLHFCQUF2QjtBQUNBLE1BQUkseUJBQXlCLGlDQUE3Qjs7QUFFQSxNQUFJLE9BQU87QUFDVixrQkFBZSxFQUFHLGFBQUgsRUFBbUIsR0FBbkIsQ0FBd0IsQ0FBeEIsQ0FETDtBQUVWLFNBQU07QUFDTCxXQUFPLEVBQUcsTUFBTSxXQUFOLEdBQW9CLFFBQXZCLEVBQWtDLEdBQWxDLEVBREY7QUFFTCxpQkFBYSxFQUFHLE1BQU0sV0FBTixHQUFvQixjQUF2QixFQUF3QyxHQUF4QyxFQUZSO0FBR0wsY0FBVSxFQUFHLE1BQU0sV0FBTixHQUFvQixRQUF2QixFQUFrQyxHQUFsQztBQUhMLElBRkk7QUFPVixZQUFTLG1CQUFtQixPQVBsQjtBQVFWLGNBQVc7QUFDVix5QkFBcUIsNkJBQVUsSUFBVixFQUFpQjtBQUNyQyxPQUFHLE1BQU0sV0FBTixHQUFvQixRQUF2QixFQUFrQyxHQUFsQyxDQUF1QyxLQUFLLEtBQTVDO0FBQ0EsT0FBRyxNQUFNLFdBQU4sR0FBb0IsY0FBdkIsRUFBd0MsR0FBeEMsQ0FBNkMsS0FBSyxXQUFsRDtBQUNBLE9BQUcsTUFBTSxXQUFOLEdBQW9CLFFBQXZCLEVBQWtDLEdBQWxDLENBQXVDLEtBQUssUUFBNUM7O0FBRUE7QUFDQSxPQUFHLG1CQUFILEVBQXlCLE9BQXpCLENBQWtDLGFBQWxDOztBQUVBLFNBQUssS0FBSyxRQUFMLEtBQWtCLEVBQXZCLEVBQTRCO0FBQzNCLFVBQUksZUFBZSxjQUFjLElBQWQsQ0FBb0IsSUFBcEIsRUFBMkIsT0FBM0IsQ0FBb0MsU0FBcEMsRUFBK0MsRUFBL0MsQ0FBbkI7QUFDQSwyQkFBc0IsWUFBdEIsRUFBb0MsbUJBQW1CLGFBQXZEO0FBQ0E7O0FBRUQsWUFBUSxhQUFSLEVBQXdCLElBQXhCLENBQThCLG1CQUE5QixFQUFvRCxPQUFwRCxDQUE2RCxhQUE3RDtBQUNBLFlBQVEsYUFBUixFQUF3QixJQUF4QixDQUE4QixtQkFBOUIsRUFBb0QsT0FBcEQsQ0FBNkQsbUJBQTdEO0FBQ0EsS0FoQlM7QUFpQlYsb0JBQWdCLHdCQUFVLFFBQVYsRUFBcUI7QUFDcEMsU0FBSyxhQUFhLEVBQWxCLEVBQXVCO0FBQ3RCLGlCQUFXLGlCQUFrQixFQUFsQixDQUFYO0FBQ0E7O0FBRUQsWUFBTyxRQUFQO0FBQ0EsS0F2QlM7QUF3QlYsaUJBQWEscUJBQVUsS0FBVixFQUFrQjtBQUM5QixTQUFLLFlBQVksT0FBWixDQUFxQixTQUFyQixJQUFtQyxDQUFDLENBQXpDLEVBQTZDO0FBQzVDLFVBQUssVUFBVSxFQUFHLHVCQUFILEVBQTZCLElBQTdCLENBQW1DLGFBQW5DLENBQWYsRUFBb0U7QUFDbkUsV0FBSSxnQkFBZ0IsRUFBRyx3QkFBSCxFQUE4QixHQUE5QixFQUFwQjtBQUNBLFdBQUssQ0FBRSxZQUFhLGFBQWIsQ0FBRixJQUFrQyxrQkFBa0IsRUFBekQsRUFBOEQ7QUFDN0QsZ0JBQVEsYUFBUjtBQUNBO0FBQ0Q7QUFDRDtBQUNELFlBQU8sU0FBUyxFQUFULENBQVksaUJBQVosQ0FBOEIsZ0JBQTlCLENBQWdELEtBQWhELENBQVA7QUFDQSxLQWxDUztBQW1DVix1QkFBbUIsMkJBQVUsV0FBVixFQUF3QjtBQUMxQyxTQUFLLFlBQVksT0FBWixDQUFxQixTQUFyQixJQUFtQyxDQUFDLENBQXpDLEVBQTZDO0FBQzVDLFVBQUssZ0JBQWdCLEVBQUcsNkJBQUgsRUFBbUMsSUFBbkMsQ0FBeUMsYUFBekMsQ0FBckIsRUFBZ0Y7QUFDL0UsV0FBSSxzQkFBc0IsRUFBRyw4QkFBSCxFQUFvQyxHQUFwQyxFQUExQjtBQUNBLFdBQUssd0JBQXdCLEVBQTdCLEVBQWtDO0FBQ2pDLHNCQUFjLG1CQUFkO0FBQ0E7QUFDRDtBQUNELFVBQUssWUFBYSxXQUFiLENBQUwsRUFBaUM7QUFDaEMscUJBQWMsRUFBRyw2QkFBSCxFQUFtQyxJQUFuQyxDQUF5QyxhQUF6QyxDQUFkO0FBQ0E7QUFDRDs7QUFFRCxZQUFPLFNBQVMsRUFBVCxDQUFZLGlCQUFaLENBQThCLGdCQUE5QixDQUFnRCxXQUFoRCxDQUFQO0FBQ0E7QUFqRFMsSUFSRDtBQTJEVixnQkFBYTtBQUNaLFdBQU87QUFESyxJQTNESDtBQThEVixpQkFBYztBQUNiLFdBQU87QUFETTtBQTlESixHQUFYOztBQW1FQSxNQUFLLE9BQU8sc0JBQVosRUFBcUM7QUFDcEMsUUFBSyxXQUFMLENBQWlCLFdBQWpCLEdBQStCLHNCQUEvQjtBQUNBLFFBQUssWUFBTCxDQUFrQixXQUFsQixHQUFnQyxzQkFBaEM7QUFDQTs7QUFFRCxTQUFPLElBQVA7QUFDQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxpQkFBVCxDQUE0QixlQUE1QixFQUE4QztBQUM3QyxJQUFFLEdBQUYsQ0FDQyxPQURELEVBRUM7QUFDQyxXQUFRLHlCQURUO0FBRUMsZ0JBQWEsbUJBQW1CLGFBRmpDO0FBR0MsWUFBUyxFQUFHLHVCQUFILEVBQTZCLEdBQTdCO0FBSFYsR0FGRCxFQU9DLFVBQVUsTUFBVixFQUFtQjtBQUNsQixPQUFLLFdBQVcsQ0FBaEIsRUFBb0I7QUFDbkIsb0JBQWdCLFNBQWhCLENBQTJCLE1BQTNCO0FBQ0E7QUFDRCxHQVhGO0FBYUE7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsWUFBVCxDQUF1QixjQUF2QixFQUF3QztBQUN2QywrQkFBOEIsY0FBOUIsRUFBOEMsaUJBQTlDOztBQUVBLE1BQUksMkJBQTJCLEVBQUcsa0JBQUgsQ0FBL0I7QUFDQSxvQkFBa0IsSUFBSSxlQUFKLENBQ2pCLHFCQUFzQix3QkFBdEIsRUFBZ0QsZ0JBQWdCLFlBQWhFLENBRGlCLEVBRWpCLElBRmlCLENBQWxCOztBQUtBLDJCQUF5QixFQUF6QixDQUNDLGFBREQsRUFFQyxtQkFGRCxFQUdDLFlBQVc7QUFDVix3QkFBc0IsVUFBdEIsRUFBa0Msb0JBQXFCLGVBQXJCLENBQWxDO0FBQ0Esb0JBQWtCLGVBQWxCO0FBQ0EsR0FORjs7QUFTQSxrQkFBZ0IsSUFBaEI7O0FBRUEsa0JBQWlCLGVBQWpCOztBQUVBLE1BQUkscUJBQXFCLEVBQUcsdUJBQUgsQ0FBekI7QUFDQSxNQUFJLG1CQUFtQixNQUFuQixHQUE0QixDQUFoQyxFQUFvQztBQUNuQyxzQkFBbUIsRUFBbkIsQ0FBdUIsUUFBdkIsRUFBaUMsa0JBQWtCLElBQWxCLENBQXdCLElBQXhCLEVBQThCLGVBQTlCLENBQWpDO0FBQ0Esc0JBQW1CLE9BQW5CLENBQTRCLFFBQTVCO0FBQ0E7O0FBRUQsSUFBRyxNQUFNLGdCQUFULEVBQTRCLEVBQTVCLENBQ0MsZ0NBREQsRUFFQyxVQUFXLGdCQUFnQixhQUFoQixDQUE4QixJQUE5QixDQUFvQyxlQUFwQyxDQUFYLEVBQWtFLEdBQWxFLENBRkQ7QUFJQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxXQUFULENBQXNCLGFBQXRCLEVBQXNDO0FBQ3JDLCtCQUE4QixhQUE5QixFQUE2QyxnQkFBN0M7O0FBRUEsTUFBSSwwQkFBMEIsRUFBRyxpQkFBSCxDQUE5QjtBQUNBLG1CQUFpQixJQUFJLGNBQUosQ0FDaEIscUJBQXNCLHVCQUF0QixFQUErQyxnQkFBZ0IsVUFBL0QsQ0FEZ0IsRUFFaEIsSUFGZ0IsQ0FBakI7O0FBS0EsMEJBQXdCLEVBQXhCLENBQ0MsYUFERCxFQUVDLG1CQUZELEVBR0MsWUFBVztBQUNWLHdCQUFzQixTQUF0QixFQUFpQyxvQkFBcUIsY0FBckIsQ0FBakM7QUFDQSxvQkFBa0IsY0FBbEI7QUFDQSxHQU5GOztBQVNBLE1BQUksMkJBQTJCLEVBQUcsa0JBQUgsQ0FBL0I7QUFDQSwyQkFBeUIsRUFBekIsQ0FDQyxhQURELEVBRUMsbUJBRkQsRUFHQyxxQkFBcUIsSUFBckIsQ0FBMkIsSUFBM0IsRUFBaUMsY0FBakMsQ0FIRDs7QUFNQSwyQkFBeUIsRUFBekIsQ0FDQyxtQkFERCxFQUVDLG1CQUZELEVBR0MsMkJBQTJCLElBQTNCLENBQWlDLElBQWpDLEVBQXVDLGNBQXZDLENBSEQ7O0FBTUEsaUJBQWUsSUFBZjs7QUFFQSxrQkFBaUIsY0FBakI7QUFDQSx1QkFBc0IsY0FBdEI7QUFDQSw2QkFBNEIsY0FBNUI7O0FBRUEsSUFBRyxNQUFNLGdCQUFULEVBQTRCLEVBQTVCLENBQ0MsZ0NBREQsRUFFQyxVQUFXLHFCQUFxQixJQUFyQixDQUEyQixJQUEzQixFQUFpQyxjQUFqQyxDQUFYLEVBQThELEdBQTlELENBRkQ7QUFJQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxvQkFBVCxDQUErQixjQUEvQixFQUFnRDtBQUMvQyxNQUFJLGdCQUFnQixFQUFHLHVCQUFILENBQXBCO0FBQ0EsTUFBSSxlQUFlLGNBQWMsR0FBZCxFQUFuQjtBQUNBLE1BQUksaUJBQWlCLEVBQXJCLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQsTUFBSSxnQkFBZ0IsRUFBRyx3QkFBSCxFQUE4QixHQUE5QixFQUFwQjtBQUNBLE1BQUssQ0FBRSxZQUFhLGFBQWIsQ0FBRixJQUFrQyxrQkFBa0IsRUFBekQsRUFBOEQ7QUFDN0Qsa0JBQWUsUUFBZixDQUF5QixhQUF6QjtBQUNBLEdBRkQsTUFFTztBQUNOLGtCQUFlLFFBQWYsQ0FBeUIsY0FBYyxJQUFkLENBQW9CLGFBQXBCLENBQXpCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBUywwQkFBVCxDQUFxQyxjQUFyQyxFQUFzRDtBQUNyRCxNQUFJLHNCQUFzQixFQUFHLDZCQUFILENBQTFCO0FBQ0EsTUFBSSxxQkFBcUIsb0JBQW9CLEdBQXBCLEVBQXpCO0FBQ0EsTUFBSSx1QkFBdUIsRUFBM0IsRUFBZ0M7QUFDL0I7QUFDQTs7QUFFRCxNQUFJLHNCQUFzQixFQUFHLDhCQUFILEVBQW9DLEdBQXBDLEVBQTFCO0FBQ0EsTUFBSyx3QkFBd0IsRUFBN0IsRUFBa0M7QUFDakMsa0JBQWUsY0FBZixDQUErQixtQkFBL0I7QUFDQSxHQUZELE1BRU87QUFDTixrQkFBZSxjQUFmLENBQStCLG9CQUFvQixJQUFwQixDQUEwQixhQUExQixDQUEvQjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsZ0JBQVQsQ0FBMkIsT0FBM0IsRUFBcUM7QUFDcEMsTUFBSyxRQUFRLElBQVIsQ0FBYSxRQUFiLEtBQTBCLEVBQS9CLEVBQW9DO0FBQ25DLFdBQVEsUUFBUixDQUFrQixpQkFBa0IsRUFBbEIsQ0FBbEI7QUFDQTtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxvQkFBVCxDQUErQixZQUEvQixFQUE2QyxJQUE3QyxFQUFvRDtBQUNuRCxJQUFHLE1BQU8sWUFBUCxHQUFzQix5QkFBekIsRUFBcUQsSUFBckQsQ0FBMkQsSUFBM0Q7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGVBQVQsR0FBMkI7QUFDMUIsTUFBSyxxQkFBcUIsTUFBMUIsRUFBbUM7QUFDbEM7QUFDQTs7QUFFRDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLG1CQUFULENBQThCLE9BQTlCLEVBQXdDO0FBQ3ZDLFNBQU8sUUFBUSxJQUFSLENBQWEsUUFBYixLQUEwQixFQUExQixHQUErQixtQkFBbUIsV0FBbEQsR0FBZ0UsbUJBQW1CLGFBQTFGO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyx1QkFBVCxHQUFtQztBQUNsQyxNQUFLLFlBQWEsR0FBRyxLQUFoQixLQUEyQixZQUFhLEdBQUcsS0FBSCxDQUFTLGFBQXRCLENBQWhDLEVBQXdFO0FBQ3ZFO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLGdCQUFnQixHQUFHLEtBQUgsQ0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQXBCOztBQUVBLGdCQUFjLEVBQWQsQ0FBa0IsUUFBbEIsRUFBNEIsWUFBVztBQUN0QyxPQUFJLGVBQWUsY0FBYyxLQUFkLEdBQXNCLEdBQXRCLENBQTJCLFdBQTNCLEVBQXlDLEtBQXpDLEdBQWlELFVBQXBFOztBQUVBLDBCQUF1QixJQUF2Qjs7QUFFQSxvQkFBa0IsYUFBYSxHQUEvQjtBQUNBLEdBTkQ7O0FBUUEsSUFBRyxlQUFILEVBQXFCLEVBQXJCLENBQXlCLE9BQXpCLEVBQWtDLHdCQUFsQyxFQUE0RCxZQUFXO0FBQ3RFLDBCQUF1QixLQUF2Qjs7QUFFQTtBQUNBLEdBSkQ7QUFLQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGlCQUFULEdBQTZCO0FBQzVCO0FBQ0EsTUFBSSxpQkFBaUIsRUFBRyxNQUFNLGlCQUFULENBQXJCO0FBQ0EsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsa0JBQWUsRUFBZixDQUFtQixPQUFuQixFQUE0QixtQkFBNUI7QUFDQTs7QUFFRDtBQUNBLE1BQUssT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sUUFBUSxFQUFmLEtBQXNCLFVBQTdELEVBQTBFO0FBQ3pFLE9BQUksU0FBUyxDQUFFLE9BQUYsRUFBVyxRQUFYLEVBQXFCLEtBQXJCLEVBQTRCLE9BQTVCLENBQWI7QUFDQSxXQUFRLEVBQVIsQ0FBWSxXQUFaLEVBQXlCLFVBQVUsQ0FBVixFQUFjO0FBQ3RDLFNBQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxPQUFPLE1BQTVCLEVBQW9DLEdBQXBDLEVBQTBDO0FBQ3pDLE9BQUUsTUFBRixDQUFTLEVBQVQsQ0FBYSxPQUFRLENBQVIsQ0FBYixFQUEwQixtQkFBMUI7QUFDQTtBQUNELElBSkQ7QUFLQTtBQUNEOztBQUVEOzs7OztBQUtBLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsbUJBQWtCLEVBQWxCO0FBQ0E7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLG1CQUFULEdBQStCO0FBQzlCO0FBQ0EsTUFBSyxxQkFBcUIsTUFBMUIsRUFBbUM7QUFDbEMsT0FBSSxnQkFBZ0Isa0JBQXBCO0FBQ0Esb0JBQWtCLGFBQWxCOztBQUVBLE9BQUssa0JBQWtCLEVBQXZCLEVBQTRCO0FBQzNCO0FBQ0E7QUFDRDs7QUFFRCxrQkFBaUIsZ0JBQWlCLFVBQVUsS0FBVixFQUFrQjtBQUNuRCxtQkFBaUIsS0FBakI7QUFDQSxHQUZnQixDQUFqQjtBQUdBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGdCQUFULENBQTJCLGFBQTNCLEVBQTJDO0FBQzFDLE1BQUssY0FBYyxRQUFkLEtBQTJCLGFBQWhDLEVBQWdEO0FBQy9DLGlCQUFjLFFBQWQsR0FBeUIsYUFBekI7O0FBRUE7QUFDQSxLQUFHLG1CQUFILEVBQXlCLE9BQXpCLENBQWtDLGFBQWxDO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxlQUFULENBQTBCLFlBQTFCLEVBQXlDO0FBQ3hDLE1BQUssY0FBYyxPQUFkLEtBQTBCLFlBQS9CLEVBQThDO0FBQzdDLGlCQUFjLE9BQWQsR0FBd0IsWUFBeEI7O0FBRUE7QUFDQSxLQUFHLG1CQUFILEVBQXlCLE9BQXpCLENBQWtDLGFBQWxDO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7QUFLQSxVQUFTLGdCQUFULEdBQTRCO0FBQzNCLE1BQUsseUJBQXlCLEtBQTlCLEVBQXNDO0FBQ3JDLFVBQU8sRUFBUDtBQUNBOztBQUVELE1BQUksZ0JBQWdCLEVBQUcsNEJBQUgsQ0FBcEI7QUFDQSxNQUFLLGNBQWMsTUFBZCxHQUF1QixDQUE1QixFQUFnQztBQUMvQixVQUFPLEVBQUcsY0FBYyxHQUFkLENBQW1CLENBQW5CLENBQUgsRUFBNEIsSUFBNUIsQ0FBa0MsS0FBbEMsQ0FBUDtBQUNBOztBQUVELFNBQU8sRUFBUDtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxlQUFULENBQTBCLFFBQTFCLEVBQXFDO0FBQ3BDLE1BQUksVUFBVSxZQUFkOztBQUVBLE1BQUksU0FBUyxVQUFXLE9BQVgsQ0FBYjtBQUNBLE1BQUksUUFBUyxFQUFiOztBQUVBLE1BQUssT0FBTyxNQUFQLEtBQWtCLENBQXZCLEVBQTJCO0FBQzFCLFVBQU8sS0FBUDtBQUNBOztBQUVELEtBQUc7QUFDRixPQUFJLGVBQWUsT0FBTyxLQUFQLEVBQW5CO0FBQ0Esa0JBQWUsRUFBRyxZQUFILENBQWY7O0FBRUEsT0FBSSxjQUFjLGFBQWEsSUFBYixDQUFtQixLQUFuQixDQUFsQjs7QUFFQSxPQUFLLFdBQUwsRUFBbUI7QUFDbEIsWUFBUSxXQUFSO0FBQ0E7QUFDRCxHQVRELFFBU1UsT0FBTyxLQUFQLElBQWdCLE9BQU8sTUFBUCxHQUFnQixDQVQxQzs7QUFXQSxVQUFRLGVBQWdCLEtBQWhCLEVBQXVCLFFBQXZCLENBQVI7O0FBRUEsU0FBTyxLQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLGNBQVQsQ0FBeUIsR0FBekIsRUFBOEIsUUFBOUIsRUFBeUM7QUFDeEMsTUFBSyxLQUFNLFlBQU4sRUFBb0IsR0FBcEIsQ0FBTCxFQUFpQztBQUNoQyxVQUFPLGFBQWMsR0FBZCxDQUFQO0FBQ0E7O0FBRUQsMkJBQTBCLEdBQTFCLEVBQStCLFVBQVUsUUFBVixFQUFxQjtBQUNuRCxnQkFBYyxHQUFkLElBQXNCLFFBQXRCOztBQUVBLFlBQVUsUUFBVjtBQUNBLEdBSkQ7O0FBTUEsU0FBTyxHQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLHdCQUFULENBQW1DLEdBQW5DLEVBQXdDLFFBQXhDLEVBQW1EO0FBQ2xELElBQUUsT0FBRixDQUFXLE9BQVgsRUFBb0I7QUFDbkIsV0FBUSw4QkFEVztBQUVuQixhQUFVO0FBRlMsR0FBcEIsRUFHRyxVQUFVLFFBQVYsRUFBcUI7QUFDdkIsT0FBSyxjQUFjLFNBQVMsTUFBNUIsRUFBcUM7QUFDcEMsYUFBVSxTQUFTLE1BQW5CO0FBQ0E7QUFDRCxHQVBEO0FBUUE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxVQUFULEdBQXNCO0FBQ3JCLE1BQUssb0JBQUwsRUFBNEI7QUFDM0IsVUFBTyxRQUFRLEdBQVIsQ0FBYSxpQkFBYixFQUFpQyxVQUFqQyxFQUFQO0FBQ0E7O0FBRUQsTUFBSSxpQkFBaUIsRUFBRyxNQUFNLGlCQUFULENBQXJCO0FBQ0EsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsVUFBTyxlQUFlLEdBQWYsRUFBUDtBQUNBOztBQUVELFNBQU8sRUFBUDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxVQUFTLGtCQUFULEdBQThCO0FBQzdCLE1BQUssT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQ0osT0FBTyxRQUFRLE9BQWYsS0FBMkIsV0FEdkIsSUFFSixRQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsS0FBMkIsQ0FGdkIsSUFHSixRQUFRLEdBQVIsQ0FBYSxpQkFBYixNQUFxQyxJQUhqQyxJQUlKLFFBQVEsR0FBUixDQUFhLGlCQUFiLEVBQWtDLFFBQWxDLEVBSkQsRUFJZ0Q7QUFDL0MsVUFBTyxLQUFQO0FBQ0E7O0FBRUQsU0FBTyxJQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsZ0JBQVQsQ0FBMkIsWUFBM0IsRUFBMEM7QUFDekM7QUFDQSxNQUFLLENBQUUsWUFBYSxlQUFiLENBQUYsSUFBb0MsZ0JBQWdCLElBQWhCLENBQXFCLFFBQXJCLEtBQWtDLEVBQTNFLEVBQWdGO0FBQy9FLFVBQU8sZ0JBQWdCLElBQWhCLENBQXFCLFFBQTVCO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLLHFCQUFxQixNQUExQixFQUFtQztBQUNsQyxPQUFLLGNBQWMsUUFBZCxLQUEyQixFQUFoQyxFQUFxQztBQUNwQyxXQUFPLGNBQWMsUUFBckI7QUFDQTtBQUNEOztBQUVEO0FBQ0EsTUFBSyxjQUFjLE9BQWQsS0FBMEIsRUFBL0IsRUFBb0M7QUFDbkMsVUFBTyxjQUFjLE9BQXJCO0FBQ0E7O0FBRUQsTUFBSyxpQkFBaUIsU0FBdEIsRUFBa0M7QUFDakMsVUFBTyxZQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxhQUFULEdBQXlCO0FBQ3hCLE1BQUksU0FBUyxDQUNaO0FBQ0Msa0JBQWUsMkJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsYUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLGFBSHBDO0FBSUMsT0FBSTtBQUpMLEdBRFksRUFPWjtBQUNDLGtCQUFlLHdCQURoQjtBQUVDLGVBQVksYUFBYSxVQUFiLENBQXdCLGFBRnJDO0FBR0Msb0JBQWlCLGFBQWEsSUFBYixDQUFrQixhQUhwQztBQUlDLE9BQUk7QUFKTCxHQVBZLEVBYVo7QUFDQyxrQkFBZSw4QkFEaEI7QUFFQyxlQUFZLGFBQWEsVUFBYixDQUF3QixtQkFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLG1CQUhwQztBQUlDLE9BQUk7QUFKTCxHQWJZLEVBbUJaO0FBQ0Msa0JBQWUsMEJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsWUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLFlBSHBDO0FBSUMsT0FBSTtBQUpMLEdBbkJZLEVBeUJaO0FBQ0Msa0JBQWUsdUJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0IsWUFGckM7QUFHQyxvQkFBaUIsYUFBYSxJQUFiLENBQWtCLFlBSHBDO0FBSUMsT0FBSTtBQUpMLEdBekJZLEVBK0JaO0FBQ0Msa0JBQWUsNkJBRGhCO0FBRUMsZUFBWSxhQUFhLFVBQWIsQ0FBd0Isa0JBRnJDO0FBR0Msb0JBQWlCLGFBQWEsSUFBYixDQUFrQixrQkFIcEM7QUFJQyxPQUFJO0FBSkwsR0EvQlksQ0FBYjs7QUF1Q0EsVUFBUyxNQUFULEVBQWlCLFVBQVUsS0FBVixFQUFrQjtBQUNsQyxLQUFHLE1BQU0sYUFBVCxFQUF5QixNQUF6QixDQUNDLFVBQVUsVUFBVixDQUFzQixNQUFNLFVBQTVCLEVBQXdDLE1BQU0sRUFBOUMsSUFDQSxVQUFVLFFBQVYsQ0FBb0IsTUFBTSxlQUExQixFQUEyQyxNQUFNLEVBQWpELENBRkQ7QUFJQSxHQUxEOztBQU9BLElBQUcsdUJBQUgsRUFBNkIsRUFBN0IsQ0FBaUMsT0FBakMsRUFBMEMsb0JBQTFDLEVBQWdFLFlBQVc7QUFDMUUsT0FBSSxVQUFVLEVBQUcsSUFBSCxDQUFkO0FBQUEsT0FDQyxZQUFZLEVBQUcsTUFBTSxRQUFRLElBQVIsQ0FBYyxlQUFkLENBQVQsQ0FEYjtBQUFBLE9BRUMsaUJBQWlCLFVBQVUsRUFBVixDQUFjLFVBQWQsQ0FGbEI7O0FBSUEsS0FBRyxTQUFILEVBQWUsV0FBZixDQUE0QixHQUE1QixFQUFpQyxZQUFXO0FBQzNDLFlBQVEsSUFBUixDQUFjLGVBQWQsRUFBK0IsQ0FBRSxjQUFqQztBQUNBLElBRkQ7QUFHQSxHQVJEO0FBU0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxzQkFBVCxDQUFpQyxZQUFqQyxFQUFnRDtBQUMvQyxNQUFLLE9BQU8sWUFBUCxLQUF3QixXQUF4QixJQUF1QyxPQUFPLGFBQWEsTUFBcEIsS0FBK0IsV0FBM0UsRUFBeUY7QUFDeEYsZ0JBQWEsTUFBYixHQUFzQix1QkFBdEI7QUFDQSxnQkFBYSxXQUFiLENBQTBCLHVCQUExQixJQUFzRCxNQUFPLGFBQWEsV0FBYixDQUEwQix1QkFBMUIsQ0FBUCxDQUF0RDs7QUFFQSxVQUFRLGFBQWEsV0FBYixDQUEwQix1QkFBMUIsQ0FBUjs7QUFFQSxVQUFPLFlBQVA7QUFDQTs7QUFFRCxTQUFPO0FBQ04sV0FBUSx1QkFERjtBQUVOLGdCQUFhO0FBQ1osNkJBQXlCO0FBQ3hCLFNBQUk7QUFEb0I7QUFEYjtBQUZQLEdBQVA7QUFRQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLHVCQUFULEdBQW1DO0FBQ2xDLE1BQUksaUJBQWlCLEVBQUcsaUJBQUgsQ0FBckI7QUFDQSxNQUFJLGdCQUFnQixFQUFHLGdCQUFILENBQXBCOztBQUVBLE1BQUssZUFBZSxNQUFmLEdBQXdCLENBQXhCLElBQTZCLGNBQWMsTUFBZCxHQUF1QixDQUF6RCxFQUE2RDtBQUM1RCxVQUFRLE1BQVIsRUFBaUIsRUFBakIsQ0FBcUIsZ0JBQXJCLEVBQXVDLFlBQVc7QUFDakQ7O0FBRUEsUUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsa0JBQWMsY0FBZDtBQUNBOztBQUVELFFBQUssY0FBYyxNQUFkLEdBQXVCLENBQTVCLEVBQWdDO0FBQy9CLGlCQUFhLGFBQWI7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsSUFiRDtBQWNBO0FBQ0Q7O0FBRUQsR0FBRyx1QkFBSDtBQUNBLENBajNCQyxFQWkzQkMsTUFqM0JELENBQUY7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDenJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDemtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9pbWFnZUluVGV4dCAqL1xuXG52YXIgbWF0Y2hTdHJpbmdXaXRoUmVnZXggPSByZXF1aXJlKCBcIi4vbWF0Y2hTdHJpbmdXaXRoUmVnZXguanNcIiApO1xuXG4vKipcbiAqIENoZWNrcyB0aGUgdGV4dCBmb3IgaW1hZ2VzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0c3RyaW5nIHRvIGNoZWNrIGZvciBpbWFnZXNcbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgY29udGFpbmluZyBhbGwgdHlwZXMgb2YgZm91bmQgaW1hZ2VzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHJldHVybiBtYXRjaFN0cmluZ1dpdGhSZWdleCggdGV4dCwgXCI8aW1nKD86W14+XSspPz5cIiApO1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvbWF0Y2hTdHJpbmdXaXRoUmVnZXggKi9cblxuLyoqXG4gKiBDaGVja3MgYSBzdHJpbmcgd2l0aCBhIHJlZ2V4LCByZXR1cm4gYWxsIG1hdGNoZXMgZm91bmQgd2l0aCB0aGF0IHJlZ2V4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIG1hdGNoIHRoZVxuICogQHBhcmFtIHtTdHJpbmd9IHJlZ2V4U3RyaW5nIEEgc3RyaW5nIHRvIHVzZSBhcyByZWdleC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgd2l0aCBtYXRjaGVzLCBlbXB0eSBhcnJheSBpZiBubyBtYXRjaGVzIGZvdW5kLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0LCByZWdleFN0cmluZyApIHtcblx0dmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCggcmVnZXhTdHJpbmcsIFwiaWdcIiApO1xuXHR2YXIgbWF0Y2hlcyA9IHRleHQubWF0Y2goIHJlZ2V4ICk7XG5cblx0aWYgKCBtYXRjaGVzID09PSBudWxsICkge1xuXHRcdG1hdGNoZXMgPSBbXTtcblx0fVxuXG5cdHJldHVybiBtYXRjaGVzO1xufTtcbiIsInZhciBnZXRMMTBuT2JqZWN0ID0gcmVxdWlyZSggXCIuL2dldEwxMG5PYmplY3RcIiApO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGRlc2NyaXB0aW9uIHBsYWNlaG9sZGVyIGZvciB1c2UgaW4gdGhlIGRlc2NyaXB0aW9uIGZvcm1zLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBkZXNjcmlwdGlvbiBwbGFjZWhvbGRlci5cbiAqL1xuZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcigpIHtcblx0dmFyIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBcIlwiO1xuXHR2YXIgbDEwbk9iamVjdCA9IGdldEwxMG5PYmplY3QoKTtcblxuXHRpZiAoIGwxMG5PYmplY3QgKSB7XG5cdFx0ZGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IGwxMG5PYmplY3QubWV0YWRlc2NfdGVtcGxhdGU7XG5cdH1cblxuXHRyZXR1cm4gZGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuIiwidmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGwxMG4gb2JqZWN0IGZvciB0aGUgY3VycmVudCBwYWdlLCBlaXRoZXIgdGVybSBvciBwb3N0LlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBsMTBuIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFnZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TDEwbk9iamVjdCgpIHtcblx0dmFyIGwxMG5PYmplY3QgPSBudWxsO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggd2luZG93Lndwc2VvUG9zdFNjcmFwZXJMMTBuICkgKSB7XG5cdFx0bDEwbk9iamVjdCA9IHdpbmRvdy53cHNlb1Bvc3RTY3JhcGVyTDEwbjtcblx0fSBlbHNlIGlmICggISBpc1VuZGVmaW5lZCggd2luZG93Lndwc2VvVGVybVNjcmFwZXJMMTBuICkgKSB7XG5cdFx0bDEwbk9iamVjdCA9IHdpbmRvdy53cHNlb1Rlcm1TY3JhcGVyTDEwbjtcblx0fVxuXG5cdHJldHVybiBsMTBuT2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEwxMG5PYmplY3Q7XG4iLCJ2YXIgZ2V0TDEwbk9iamVjdCA9IHJlcXVpcmUoIFwiLi9nZXRMMTBuT2JqZWN0XCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aXRsZSBwbGFjZWhvbGRlciBmb3IgdXNlIGluIHRoZSB0aXRsZSBmb3Jtcy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGl0bGUgcGxhY2Vob2xkZXIuXG4gKi9cbmZ1bmN0aW9uIGdldFRpdGxlUGxhY2Vob2xkZXIoKSB7XG5cdHZhciB0aXRsZVBsYWNlaG9sZGVyID0gXCJcIjtcblx0dmFyIGwxMG5PYmplY3QgPSBnZXRMMTBuT2JqZWN0KCk7XG5cblx0aWYgKCBsMTBuT2JqZWN0ICkge1xuXHRcdHRpdGxlUGxhY2Vob2xkZXIgPSBsMTBuT2JqZWN0LnRpdGxlX3RlbXBsYXRlO1xuXHR9XG5cblx0aWYgKCB0aXRsZVBsYWNlaG9sZGVyID09PSBcIlwiICkge1xuXHRcdHRpdGxlUGxhY2Vob2xkZXIgPSBcIiUldGl0bGUlJSAtICUlc2l0ZW5hbWUlJVwiO1xuXHR9XG5cblx0cmV0dXJuIHRpdGxlUGxhY2Vob2xkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGl0bGVQbGFjZWhvbGRlcjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNVbmRlZmluZWQobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1VuZGVmaW5lZDtcbiIsIi8qIGpzaGludCAtVzA5NyAqL1xuXG4vKipcbiAqIFJldHVybnMgdGhlIEhUTUwgZm9yIGEgaGVscCBidXR0b25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBwdXQgaW4gdGhlIGJ1dHRvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250cm9scyBUaGUgSFRNTCBJRCBvZiB0aGUgZWxlbWVudCB0aGlzIGJ1dHRvbiBjb250cm9scy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBHZW5lcmF0ZWQgSFRNTC5cbiAqL1xuZnVuY3Rpb24gaGVscEJ1dHRvbiggdGV4dCwgY29udHJvbHMgKSB7XG5cdHJldHVybiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ5b2FzdF9oZWxwIHlvYXN0LWhlbHAtYnV0dG9uIGRhc2hpY29uc1wiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiICcgK1xuXHRcdCdhcmlhLWNvbnRyb2xzPVwiJyArIGNvbnRyb2xzICsgJ1wiPjxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+JyArIHRleHQgKyAnPC9zcGFuPjwvYnV0dG9uPic7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgSFRNTCBmb3IgYSBoZWxwIGJ1dHRvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHB1dCBpbiB0aGUgYnV0dG9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBIVE1MIElEIHRvIGdpdmUgdGhpcyBidXR0b24uXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGdlbmVyYXRlZCBIVE1sLlxuICovXG5mdW5jdGlvbiBoZWxwVGV4dCggdGV4dCwgaWQgKSB7XG5cdHJldHVybiAnPHAgaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJ5b2FzdC1oZWxwLXBhbmVsXCI+JyArIHRleHQgKyAnPC9wPic7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRoZWxwQnV0dG9uOiBoZWxwQnV0dG9uLFxuXHRoZWxwVGV4dDogaGVscFRleHQsXG59O1xuIiwiLyogZ2xvYmFsIHlvYXN0U29jaWFsUHJldmlldywgdGlueU1DRSwgcmVxdWlyZSwgd3AsIFlvYXN0U0VPLCBhamF4dXJsICAqL1xuLyoganNoaW50IC1XMDk3ICovXG5cbnZhciBnZXRJbWFnZXMgPSByZXF1aXJlKCBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvaW1hZ2VJblRleHRcIiApO1xudmFyIGhlbHBQYW5lbCA9IHJlcXVpcmUoIFwiLi9oZWxwUGFuZWxcIiApO1xudmFyIGdldFRpdGxlUGxhY2Vob2xkZXIgPSByZXF1aXJlKCBcIi4uLy4uLy4uLy4uL2pzL3NyYy9hbmFseXNpcy9nZXRUaXRsZVBsYWNlaG9sZGVyXCIgKTtcbnZhciBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gcmVxdWlyZSggXCIuLi8uLi8uLi8uLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlclwiICk7XG5cbnZhciBfZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoL2RlYm91bmNlXCIpO1xudmFyIGNsb25lID0gcmVxdWlyZSggXCJsb2Rhc2gvY2xvbmVcIiApO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBfaGFzID0gcmVxdWlyZSggXCJsb2Rhc2gvaGFzXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcbnZhciBzb2NpYWxQcmV2aWV3cyA9IHJlcXVpcmUoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIgKTtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0LyoqXG5cdCAqIFdlIHdhbnQgdG8gc3RvcmUgdGhlIGZhbGxiYWNrcyBpbiBhbiBvYmplY3QsIHRvIGhhdmUgZGlyZWN0bHkgYWNjZXNzIHRvIHRoZW0uXG5cdCAqIEB0eXBlIHt7Y29udGVudDogc3RyaW5nLCBmZWF0dXJlZDogc3RyaW5nfX1cblx0ICovXG5cdHZhciBpbWFnZUZhbGxCYWNrID0ge1xuXHRcdGNvbnRlbnQ6IFwiXCIsXG5cdFx0ZmVhdHVyZWQ6IFwiXCIsXG5cdH07XG5cblx0dmFyIGNhblJlYWRGZWF0dXJlZEltYWdlID0gdHJ1ZTtcblxuXHR2YXIgRmFjZWJvb2tQcmV2aWV3ID0gc29jaWFsUHJldmlld3MuRmFjZWJvb2tQcmV2aWV3O1xuXHR2YXIgVHdpdHRlclByZXZpZXcgPSBzb2NpYWxQcmV2aWV3cy5Ud2l0dGVyUHJldmlldztcblxuXHR2YXIgZmFjZWJvb2tQcmV2aWV3LCB0d2l0dGVyUHJldmlldztcblxuXHR2YXIgdHJhbnNsYXRpb25zID0geW9hc3RTb2NpYWxQcmV2aWV3LmkxOG47XG5cblx0dmFyIGkxOG4gPSBuZXcgSmVkKCBhZGRMaWJyYXJ5VHJhbnNsYXRpb25zKCB0cmFuc2xhdGlvbnMubGlicmFyeSApICk7XG5cdHZhciBiaWdnZXJJbWFnZXMgPSB7fTtcblxuXHRsZXQgcG9zdFRpdGxlSW5wdXRJZCA9IFwidGl0bGVcIjtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgZXZlbnRzIGZvciBvcGVuaW5nIHRoZSBXUCBtZWRpYSBsaWJyYXJ5IHdoZW4gcHJlc3NpbmcgdGhlIGJ1dHRvbi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGltYWdlVXJsIFRoZSBpbWFnZSBVUkwgb2JqZWN0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VCdXR0b24gSUQgbmFtZSBmb3IgdGhlIGltYWdlIGJ1dHRvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHJlbW92ZUJ1dHRvbiBJRCBuYW1lIGZvciB0aGUgcmVtb3ZlIGJ1dHRvbi5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gb25NZWRpYVNlbGVjdCBUaGUgZXZlbnQgdGhhdCB3aWxsIGJlIHJhbiB3aGVuIGltYWdlIGlzIGNob3Nlbi5cblx0ICogQHBhcmFtIHtPYmplY3R9IGltYWdlUHJldmlld0VsZW1lbnQgVGhlIGltYWdlIHByZXZpZXcgZWxlbWVudCB0aGF0IGNhbiBiZSBjbGlja2VkIHRvIHVwZGF0ZSBhcyB3ZWxsLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGJpbmRVcGxvYWRCdXR0b25FdmVudHMoIGltYWdlVXJsLCBpbWFnZUJ1dHRvbiwgcmVtb3ZlQnV0dG9uLCBvbk1lZGlhU2VsZWN0LCBpbWFnZVByZXZpZXdFbGVtZW50ICkge1xuXHRcdHZhciBzb2NpYWxQcmV2aWV3VXBsb2FkZXIgPSB3cC5tZWRpYS5mcmFtZXMuZmlsZV9mcmFtZSA9IHdwLm1lZGlhKCB7XG5cdFx0XHR0aXRsZTogeW9hc3RTb2NpYWxQcmV2aWV3LmNob29zZV9pbWFnZSxcblx0XHRcdGJ1dHRvbjogeyB0ZXh0OiB5b2FzdFNvY2lhbFByZXZpZXcuY2hvb3NlX2ltYWdlIH0sXG5cdFx0XHRtdWx0aXBsZTogZmFsc2UsXG5cdFx0fSApO1xuXG5cdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhdHRhY2htZW50ID0gc29jaWFsUHJldmlld1VwbG9hZGVyLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS50b0pTT04oKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBpbWFnZSBVUkwuXG5cdFx0XHRpbWFnZVVybC52YWwoIGF0dGFjaG1lbnQudXJsICk7XG5cblx0XHRcdG9uTWVkaWFTZWxlY3QoKTtcblxuXHRcdFx0JCggcmVtb3ZlQnV0dG9uICkuc2hvdygpO1xuXHRcdH0gKTtcblxuXHRcdCQoIHJlbW92ZUJ1dHRvbiApLmNsaWNrKCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIENsZWFyIHRoZSBpbWFnZSBVUkxcblx0XHRcdGltYWdlVXJsLnZhbCggXCJcIiApO1xuXG5cdFx0XHRvbk1lZGlhU2VsZWN0KCk7XG5cblx0XHRcdCQoIHJlbW92ZUJ1dHRvbiApLmhpZGUoKTtcblx0XHR9ICk7XG5cblx0XHQkKCBpbWFnZUJ1dHRvbiApLmNsaWNrKCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRzb2NpYWxQcmV2aWV3VXBsb2FkZXIub3BlbigpO1xuXHRcdH0gKTtcblxuXHRcdCQoIGltYWdlUHJldmlld0VsZW1lbnQgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbiggZXZlbnRPYmplY3QgKSB7XG5cdFx0XHRzb2NpYWxQcmV2aWV3VXBsb2FkZXIub3BlbigpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSBjaG9vc2UgaW1hZ2UgYnV0dG9uIGFuZCBoaWRlcyB0aGUgaW5wdXQgZmllbGQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2aWV3IFRoZSBwcmV2aWV3IHRvIGFkZCB0aGUgdXBsb2FkIGJ1dHRvbiB0by5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRVcGxvYWRCdXR0b24oIHByZXZpZXcgKSB7XG5cdFx0aWYgKCB0eXBlb2Ygd3AubWVkaWEgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGltYWdlVXJsID0gJCggcHJldmlldy5lbGVtZW50LmZvcm1Db250YWluZXIgKS5maW5kKCBcIi5qcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiICk7XG5cblx0XHR2YXIgYnV0dG9uRGl2ID0gJCggXCI8ZGl2PjwvZGl2PlwiICk7XG5cdFx0YnV0dG9uRGl2Lmluc2VydEFmdGVyKCBpbWFnZVVybCApO1xuXG5cdFx0dmFyIHVwbG9hZEJ1dHRvblRleHQgPSBnZXRVcGxvYWRCdXR0b25UZXh0KCBwcmV2aWV3ICk7XG5cblx0XHR2YXIgaW1hZ2VGaWVsZElkICAgID0galF1ZXJ5KCBpbWFnZVVybCApLmF0dHIoIFwiaWRcIiApO1xuXHRcdHZhciBpbWFnZUJ1dHRvbklkICAgPSBpbWFnZUZpZWxkSWQgKyBcIl9idXR0b25cIjtcblx0XHR2YXIgaW1hZ2VCdXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgaW1hZ2VCdXR0b25JZCArICdcIiAnICtcblx0XHRcdCdjbGFzcz1cImJ1dHRvbiBidXR0b24tcHJpbWFyeSB3cHNlb19wcmV2aWV3X2ltYWdlX3VwbG9hZF9idXR0b25cIiB0eXBlPVwiYnV0dG9uXCI+JyArIHVwbG9hZEJ1dHRvblRleHQgKyAnPC9idXR0b24+JztcblxuXHRcdHZhciByZW1vdmVCdXR0b25JZCAgID0gaW1hZ2VGaWVsZElkICsgXCJfcmVtb3ZlX2J1dHRvblwiO1xuXHRcdHZhciByZW1vdmVCdXR0b25IdG1sID0gJzxidXR0b24gaWQ9XCInICsgcmVtb3ZlQnV0dG9uSWQgKyAnXCIgdHlwZT1cImJ1dHRvblwiICcgK1xuXHRcdFx0J2NsYXNzPVwiYnV0dG9uIHdwc2VvX3ByZXZpZXdfaW1hZ2VfdXBsb2FkX2J1dHRvblwiPicgKyB5b2FzdFNvY2lhbFByZXZpZXcucmVtb3ZlSW1hZ2VCdXR0b24gKyAnPC9idXR0b24+JztcblxuXHRcdCQoIGJ1dHRvbkRpdiApLmFwcGVuZCggaW1hZ2VCdXR0b25IdG1sICk7XG5cdFx0JCggYnV0dG9uRGl2ICkuYXBwZW5kKCByZW1vdmVCdXR0b25IdG1sICk7XG5cblx0XHRpbWFnZVVybC5oaWRlKCk7XG5cdFx0aWYgKCBpbWFnZVVybC52YWwoKSA9PT0gXCJcIiApIHtcblx0XHRcdCQoIFwiI1wiICsgcmVtb3ZlQnV0dG9uSWQgKS5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0YmluZFVwbG9hZEJ1dHRvbkV2ZW50cyhcblx0XHRcdGltYWdlVXJsLFxuXHRcdFx0XCIjXCIgKyBpbWFnZUJ1dHRvbklkLFxuXHRcdFx0XCIjXCIgKyByZW1vdmVCdXR0b25JZCxcblx0XHRcdHByZXZpZXcudXBkYXRlUHJldmlldy5iaW5kKCBwcmV2aWV3ICksXG5cdFx0XHQkKCBwcmV2aWV3LmVsZW1lbnQuY29udGFpbmVyICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld19faW1hZ2VcIiApXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBjdXJyZW50IHBhZ2U6IHBvc3Qgb3IgdGVybS5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGN1cnJlbnQgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRUeXBlKCkge1xuXHRcdC8vIFdoZW4gdGhpcyBmaWVsZCBleGlzdHMsIGl0IGlzIGEgcG9zdC5cblx0XHRpZiAoICQoIFwiI3Bvc3RfSURcIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gXCJwb3N0XCI7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGlzIGZpZWxkIGlzIGZvdW5kLCBpdCBpcyBhIHRlcm0uXG5cdFx0aWYgKCAkKCBcImlucHV0W25hbWU9dGFnX0lEXVwiICkubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybiBcInRlcm1cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwcmVmaXggZm9yIHRoZSBmaWVsZHMsIGJlY2F1c2Ugb2YgdGhlIGZpZWxkcyBmb3IgdGhlIHBvc3QgZG8gaGF2ZSBhbiBvdGhlcmUgcHJlZml4IHRoYW4gdGhlIG9uZXMgZm9yXG5cdCAqIGEgdGF4b25vbXkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHsqfSBUaGUgcHJlZml4IHRvIHVzZS5cblx0ICovXG5cdGZ1bmN0aW9uIGZpZWxkUHJlZml4KCkge1xuXHRcdHN3aXRjaCggZ2V0Q3VycmVudFR5cGUoKSApIHtcblx0XHRcdGNhc2UgXCJwb3N0XCI6XG5cdFx0XHRcdHJldHVybiBcInlvYXN0X3dwc2VvXCI7XG5cdFx0XHRjYXNlIFwidGVybVwiOlxuXHRcdFx0XHRyZXR1cm4gXCJ3cHNlb1wiO1xuXHRcdFx0ZGVmYXVsdCA6XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0aW55bWNlIGFuZCB0ZXh0YXJlYSBmaWVsZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuYW1lIGZvciB0aGUgY29udGVudCBmaWVsZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNvbnRlbnRUZXh0TmFtZSgpIHtcblx0XHRzd2l0Y2ggKCBnZXRDdXJyZW50VHlwZSgpICkge1xuXHRcdFx0Y2FzZSBcInBvc3RcIiA6XG5cdFx0XHRcdHJldHVybiBcImNvbnRlbnRcIjtcblx0XHRcdGNhc2UgXCJ0ZXJtXCIgOlxuXHRcdFx0XHRyZXR1cm4gXCJkZXNjcmlwdGlvblwiO1xuXHRcdFx0ZGVmYXVsdCA6XG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBzb2NpYWwgcHJldmlldyBjb250YWluZXIgYW5kIGhpZGVzIHRoZSBvbGQgZm9ybSB0YWJsZSwgdG8gcmVwbGFjZSBpdC5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNvY2lhbFByZXZpZXdob2xkZXIgVGhlIGhvbGRlciBlbGVtZW50IHdoZXJlIHRoZSBjb250YWluZXIgd2lsbCBiZSBhcHBlbmQgdG8uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb250YWluZXJJZCBUaGUgaWQgdGhlIGNvbnRhaW5lciB3aWxsIGdldFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNvY2lhbFByZXZpZXdDb250YWluZXIoIHNvY2lhbFByZXZpZXdob2xkZXIsIGNvbnRhaW5lcklkICkge1xuXHRcdHNvY2lhbFByZXZpZXdob2xkZXIuYXBwZW5kKCAnPGRpdiBpZD1cIicgKyBjb250YWluZXJJZCArICdcIj48L2Rpdj4nICk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmcm9tIHRoZSBzbmlwcGV0IGVkaXRvclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGdldE1ldGFEZXNjcmlwdGlvbigpIHtcblx0XHRyZXR1cm4gJCggXCIjeW9hc3Rfd3BzZW9fbWV0YWRlc2NcIiApLnZhbCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmaWVsZC5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgbWV0YSBkZXNjcmlwdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNvY2lhbERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKSB7XG5cdFx0dmFyIGRlc2NyaXB0aW9uID0gZ2V0TWV0YURlc2NyaXB0aW9uKCk7XG5cblx0XHRpZiAoIFwiXCIgPT09IGRlc2NyaXB0aW9uICkge1xuXHRcdFx0ZGVzY3JpcHRpb24gPSBnZXREZXNjcmlwdGlvblBsYWNlaG9sZGVyKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIHNvY2lhbCBwcmV2aWV3IHByb3RvdHlwZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRFbGVtZW50IFRoZSBlbGVtZW50IHdoZXJlIHRoZSBwcmV2aWV3IGlzIGxvYWRlZC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkUHJlZml4IFRoZSBwcmVmaXggZWFjaCBmb3JtIGVsZW1lbnQgaGFzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7IHtcblx0ICogXHRcdHRhcmdldEVsZW1lbnQ6IEVsZW1lbnQsXG5cdCAqXHRcdGRhdGE6IHt0aXRsZTogKiwgZGVzY3JpcHRpb246ICosIGltYWdlVXJsOiAqfSxcblx0ICogXHRcdGJhc2VVUkw6ICosXG5cdCAqIFx0XHRjYWxsYmFja3M6IHt1cGRhdGVTb2NpYWxQcmV2aWV3OiBjYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlld31cblx0ICogfSB9IFRoZSBhcmd1bWVudHMgZm9yIHRoZSBzb2NpYWwgcHJldmlldy5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNvY2lhbFByZXZpZXdBcmdzKCB0YXJnZXRFbGVtZW50LCBmaWVsZFByZWZpeCApIHtcblx0XHR2YXIgdGl0bGVQbGFjZWhvbGRlciA9IGdldFRpdGxlUGxhY2Vob2xkZXIoKTtcblx0XHR2YXIgZGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IGdldFNvY2lhbERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKTtcblxuXHRcdHZhciBhcmdzID0ge1xuXHRcdFx0dGFyZ2V0RWxlbWVudDogJCggdGFyZ2V0RWxlbWVudCApLmdldCggMCApLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR0aXRsZTogJCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLXRpdGxlXCIgKS52YWwoKSxcblx0XHRcdFx0ZGVzY3JpcHRpb246ICQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1kZXNjcmlwdGlvblwiICkudmFsKCksXG5cdFx0XHRcdGltYWdlVXJsOiAkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItaW1hZ2VcIiApLnZhbCgpLFxuXHRcdFx0fSxcblx0XHRcdGJhc2VVUkw6IHlvYXN0U29jaWFsUHJldmlldy53ZWJzaXRlLFxuXHRcdFx0Y2FsbGJhY2tzOiB7XG5cdFx0XHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdCQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi10aXRsZVwiICkudmFsKCBkYXRhLnRpdGxlICk7XG5cdFx0XHRcdFx0JCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWRlc2NyaXB0aW9uXCIgKS52YWwoIGRhdGEuZGVzY3JpcHRpb24gKTtcblx0XHRcdFx0XHQkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItaW1hZ2VcIiApLnZhbCggZGF0YS5pbWFnZVVybCApO1xuXG5cdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIFR3aXR0ZXIgaXMgdXBkYXRlZCBpZiBhIEZhY2Vib29rIGltYWdlIGlzIHNldFxuXHRcdFx0XHRcdCQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiaW1hZ2VVcGRhdGVcIiApO1xuXG5cdFx0XHRcdFx0aWYgKCBkYXRhLmltYWdlVXJsICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0dmFyIGJ1dHRvblByZWZpeCA9IHRhcmdldEVsZW1lbnQuYXR0ciggXCJpZFwiICkucmVwbGFjZSggXCJQcmV2aWV3XCIsIFwiXCIgKTtcblx0XHRcdFx0XHRcdHNldFVwbG9hZEJ1dHRvblZhbHVlKCBidXR0b25QcmVmaXgsIHlvYXN0U29jaWFsUHJldmlldy51c2VPdGhlckltYWdlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0alF1ZXJ5KCB0YXJnZXRFbGVtZW50ICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJ0aXRsZVVwZGF0ZVwiICk7XG5cdFx0XHRcdFx0alF1ZXJ5KCB0YXJnZXRFbGVtZW50ICkuZmluZCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJkZXNjcmlwdGlvblVwZGF0ZVwiICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeUltYWdlVXJsOiBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGltYWdlVXJsID0gZ2V0RmFsbGJhY2tJbWFnZSggXCJcIiApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHRcdFx0fSxcblx0XHRcdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdFx0XHRpZiAoIGZpZWxkUHJlZml4LmluZGV4T2YoIFwidHdpdHRlclwiICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdGlmICggdGl0bGUgPT09ICQoIFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlXCIgKS5hdHRyKCBcInBsYWNlaG9sZGVyXCIgKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZhY2Vib29rVGl0bGUgPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVcIiApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rVGl0bGUgKSAmJiBmYWNlYm9va1RpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0XHRcdHRpdGxlID0gZmFjZWJvb2tUaXRsZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gWW9hc3RTRU8ud3AucmVwbGFjZVZhcnNQbHVnaW4ucmVwbGFjZVZhcmlhYmxlcyggdGl0bGUgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bW9kaWZ5RGVzY3JpcHRpb246IGZ1bmN0aW9uKCBkZXNjcmlwdGlvbiApIHtcblx0XHRcdFx0XHRpZiAoIGZpZWxkUHJlZml4LmluZGV4T2YoIFwidHdpdHRlclwiICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdGlmICggZGVzY3JpcHRpb24gPT09ICQoIFwiI3R3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uXCIgKS5hdHRyKCBcInBsYWNlaG9sZGVyXCIgKSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZhY2Vib29rRGVzY3JpcHRpb24gPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIiApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIGZhY2Vib29rRGVzY3JpcHRpb24gIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb24gPSBmYWNlYm9va0Rlc2NyaXB0aW9uO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIGlzVW5kZWZpbmVkKCBkZXNjcmlwdGlvbiApICl7XG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gJCggJyN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvbicgKS5hdHRyKCAncGxhY2Vob2xkZXInICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIFlvYXN0U0VPLndwLnJlcGxhY2VWYXJzUGx1Z2luLnJlcGxhY2VWYXJpYWJsZXMoIGRlc2NyaXB0aW9uICk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdFx0cGxhY2Vob2xkZXI6IHtcblx0XHRcdFx0dGl0bGU6IHRpdGxlUGxhY2Vob2xkZXIsXG5cdFx0XHR9LFxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0XHRcdHRpdGxlOiB0aXRsZVBsYWNlaG9sZGVyLFxuXHRcdFx0fSxcblx0XHR9O1xuXG5cdFx0aWYgKCBcIlwiICE9PSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyICkge1xuXHRcdFx0YXJncy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uUGxhY2Vob2xkZXI7XG5cdFx0XHRhcmdzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uUGxhY2Vob2xkZXI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyZ3M7XG5cdH1cblxuXHQvKipcblx0ICogVHJ5IHRvIGdldCB0aGUgRmFjZWJvb2sgYXV0aG9yIG5hbWUgdmlhIEFKQVggYW5kIHB1dCBpdCB0byB0aGUgRmFjZWJvb2sgcHJldmlldy5cblx0ICpcblx0ICogQHBhcmFtIHtGYWNlYm9va1ByZXZpZXd9IGZhY2Vib29rUHJldmlldyBUaGUgRmFjZWJvb2sgcHJldmlldyBvYmplY3Rcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRGYWNlYm9va0F1dGhvciggZmFjZWJvb2tQcmV2aWV3ICkge1xuXHRcdCQuZ2V0KFxuXHRcdFx0YWpheHVybCxcblx0XHRcdHtcblx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2dldF9mYWNlYm9va19uYW1lXCIsXG5cdFx0XHRcdF9hamF4X25vbmNlOiB5b2FzdFNvY2lhbFByZXZpZXcuZmFjZWJvb2tOb25jZSxcblx0XHRcdFx0dXNlcl9pZDogJCggXCIjcG9zdF9hdXRob3Jfb3ZlcnJpZGVcIiApLnZhbCgpLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCBhdXRob3IgKSB7XG5cdFx0XHRcdGlmICggYXV0aG9yICE9PSAwICkge1xuXHRcdFx0XHRcdGZhY2Vib29rUHJldmlldy5zZXRBdXRob3IoIGF1dGhvciApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSBGYWNlYm9vayBwcmV2aWV3LlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZmFjZWJvb2tIb2xkZXIgVGFyZ2V0IGVsZW1lbnQgZm9yIGFkZGluZyB0aGUgRmFjZWJvb2sgcHJldmlldy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0RmFjZWJvb2soIGZhY2Vib29rSG9sZGVyICkge1xuXHRcdGNyZWF0ZVNvY2lhbFByZXZpZXdDb250YWluZXIoIGZhY2Vib29rSG9sZGVyLCBcImZhY2Vib29rUHJldmlld1wiICk7XG5cblx0XHR2YXIgZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyID0gJCggXCIjZmFjZWJvb2tQcmV2aWV3XCIgKTtcblx0XHRmYWNlYm9va1ByZXZpZXcgPSBuZXcgRmFjZWJvb2tQcmV2aWV3KFxuXHRcdFx0Z2V0U29jaWFsUHJldmlld0FyZ3MoIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciwgZmllbGRQcmVmaXgoKSArIFwiX29wZW5ncmFwaFwiICksXG5cdFx0XHRpMThuXG5cdFx0KTtcblxuXHRcdGZhY2Vib29rUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwiaW1hZ2VVcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggXCJmYWNlYm9va1wiLCBnZXRVcGxvYWRCdXR0b25UZXh0KCBmYWNlYm9va1ByZXZpZXcgKSApO1xuXHRcdFx0XHRzZXRGYWxsYmFja0ltYWdlKCBmYWNlYm9va1ByZXZpZXcgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0ZmFjZWJvb2tQcmV2aWV3LmluaXQoKTtcblxuXHRcdGFkZFVwbG9hZEJ1dHRvbiggZmFjZWJvb2tQcmV2aWV3ICk7XG5cblx0XHR2YXIgcG9zdEF1dGhvckRyb3Bkb3duID0gJCggXCIjcG9zdF9hdXRob3Jfb3ZlcnJpZGVcIiApO1xuXHRcdGlmKCBwb3N0QXV0aG9yRHJvcGRvd24ubGVuZ3RoID4gMCApIHtcblx0XHRcdHBvc3RBdXRob3JEcm9wZG93bi5vbiggXCJjaGFuZ2VcIiwgZ2V0RmFjZWJvb2tBdXRob3IuYmluZCggdGhpcywgZmFjZWJvb2tQcmV2aWV3ICkgKTtcblx0XHRcdHBvc3RBdXRob3JEcm9wZG93bi50cmlnZ2VyKCBcImNoYW5nZVwiICk7XG5cdFx0fVxuXG5cdFx0JCggXCIjXCIgKyBwb3N0VGl0bGVJbnB1dElkICkub24oXG5cdFx0XHRcImtleWRvd24ga2V5dXAgaW5wdXQgZm9jdXMgYmx1clwiLFxuXHRcdFx0X2RlYm91bmNlKCBmYWNlYm9va1ByZXZpZXcudXBkYXRlUHJldmlldy5iaW5kKCBmYWNlYm9va1ByZXZpZXcgKSwgNTAwIClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHR3aXR0ZXIgcHJldmlldy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHR3aXR0ZXJIb2xkZXIgVGFyZ2V0IGVsZW1lbnQgZm9yIGFkZGluZyB0aGUgdHdpdHRlciBwcmV2aWV3LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRUd2l0dGVyKCB0d2l0dGVySG9sZGVyICkge1xuXHRcdGNyZWF0ZVNvY2lhbFByZXZpZXdDb250YWluZXIoIHR3aXR0ZXJIb2xkZXIsIFwidHdpdHRlclByZXZpZXdcIiApO1xuXG5cdFx0dmFyIHR3aXR0ZXJQcmV2aWV3Q29udGFpbmVyID0gJCggXCIjdHdpdHRlclByZXZpZXdcIiApO1xuXHRcdHR3aXR0ZXJQcmV2aWV3ID0gbmV3IFR3aXR0ZXJQcmV2aWV3KFxuXHRcdFx0Z2V0U29jaWFsUHJldmlld0FyZ3MoIHR3aXR0ZXJQcmV2aWV3Q29udGFpbmVyLCBmaWVsZFByZWZpeCgpICsgXCJfdHdpdHRlclwiICksXG5cdFx0XHRpMThuXG5cdFx0KTtcblxuXHRcdHR3aXR0ZXJQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJpbWFnZVVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNldFVwbG9hZEJ1dHRvblZhbHVlKCBcInR3aXR0ZXJcIiwgZ2V0VXBsb2FkQnV0dG9uVGV4dCggdHdpdHRlclByZXZpZXcgKSApO1xuXHRcdFx0XHRzZXRGYWxsYmFja0ltYWdlKCB0d2l0dGVyUHJldmlldyApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR2YXIgZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyID0gJCggXCIjZmFjZWJvb2tQcmV2aWV3XCIgKTtcblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcInRpdGxlVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHR0d2l0dGVyVGl0bGVGYWxsYmFjay5iaW5kKCB0aGlzLCB0d2l0dGVyUHJldmlldyApXG5cdFx0KTtcblxuXHRcdGZhY2Vib29rUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwiZGVzY3JpcHRpb25VcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdHR3aXR0ZXJEZXNjcmlwdGlvbkZhbGxiYWNrLmJpbmQoIHRoaXMsIHR3aXR0ZXJQcmV2aWV3IClcblx0XHQpO1xuXG5cdFx0dHdpdHRlclByZXZpZXcuaW5pdCgpO1xuXG5cdFx0YWRkVXBsb2FkQnV0dG9uKCB0d2l0dGVyUHJldmlldyApO1xuXHRcdHR3aXR0ZXJUaXRsZUZhbGxiYWNrKCB0d2l0dGVyUHJldmlldyApO1xuXHRcdHR3aXR0ZXJEZXNjcmlwdGlvbkZhbGxiYWNrKCB0d2l0dGVyUHJldmlldyApO1xuXG5cdFx0JCggXCIjXCIgKyBwb3N0VGl0bGVJbnB1dElkICkub24oXG5cdFx0XHRcImtleWRvd24ga2V5dXAgaW5wdXQgZm9jdXMgYmx1clwiLFxuXHRcdFx0X2RlYm91bmNlKCB0d2l0dGVyVGl0bGVGYWxsYmFjay5iaW5kKCB0aGlzLCB0d2l0dGVyUHJldmlldyApLCA1MDAgKVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiB0d2l0dGVyIHRpdGxlIGlzIGVtcHR5LCB1c2UgdGhlIEZhY2Vib29rIHRpdGxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7VHdpdHRlclByZXZpZXd9IHR3aXR0ZXJQcmV2aWV3IFRoZSB0d2l0dGVyIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHdpdHRlclRpdGxlRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICkge1xuXHRcdHZhciAkdHdpdHRlclRpdGxlID0gJCggXCIjdHdpdHRlci1lZGl0b3ItdGl0bGVcIiApO1xuXHRcdHZhciB0d2l0dGVyVGl0bGUgPSAkdHdpdHRlclRpdGxlLnZhbCgpO1xuXHRcdGlmKCB0d2l0dGVyVGl0bGUgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhY2Vib29rVGl0bGUgPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVcIiApLnZhbCgpO1xuXHRcdGlmICggISBpc1VuZGVmaW5lZCggZmFjZWJvb2tUaXRsZSApICYmIGZhY2Vib29rVGl0bGUgIT09IFwiXCIgKSB7XG5cdFx0XHR0d2l0dGVyUHJldmlldy5zZXRUaXRsZSggZmFjZWJvb2tUaXRsZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0d2l0dGVyUHJldmlldy5zZXRUaXRsZSggJHR3aXR0ZXJUaXRsZS5hdHRyKCBcInBsYWNlaG9sZGVyXCIgKSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHR3aXR0ZXIgZGVzY3JpcHRpb24gaXMgZW1wdHksIHVzZSB0aGUgZGVzY3JpcHRpb24gdGl0bGVcblx0ICpcblx0ICogQHBhcmFtIHtUd2l0dGVyUHJldmlld30gdHdpdHRlclByZXZpZXcgVGhlIHR3aXR0ZXIgcHJldmlldyBvYmplY3Rcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjayggdHdpdHRlclByZXZpZXcgKSB7XG5cdFx0dmFyICR0d2l0dGVyRGVzY3JpcHRpb24gPSAkKCBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiICk7XG5cdFx0dmFyIHR3aXR0ZXJEZXNjcmlwdGlvbiA9ICR0d2l0dGVyRGVzY3JpcHRpb24udmFsKCk7XG5cdFx0aWYoIHR3aXR0ZXJEZXNjcmlwdGlvbiAhPT0gXCJcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgZmFjZWJvb2tEZXNjcmlwdGlvbiA9ICQoIFwiI2ZhY2Vib29rLWVkaXRvci1kZXNjcmlwdGlvblwiICkudmFsKCk7XG5cdFx0aWYgKCBmYWNlYm9va0Rlc2NyaXB0aW9uICE9PSBcIlwiICkge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0RGVzY3JpcHRpb24oIGZhY2Vib29rRGVzY3JpcHRpb24gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0RGVzY3JpcHRpb24oICR0d2l0dGVyRGVzY3JpcHRpb24uYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBmYWxsYmFjayBpbWFnZSBmb3IgdGhlIHByZXZpZXcgaWYgbm8gaW1hZ2UgaGFzIGJlZW4gc2V0XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2aWV3IFByZXZpZXcgdG8gc2V0IGZhbGxiYWNrIGltYWdlIG9uLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cblx0ZnVuY3Rpb24gc2V0RmFsbGJhY2tJbWFnZSggcHJldmlldyApIHtcblx0XHRpZiAoIHByZXZpZXcuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHRcdHByZXZpZXcuc2V0SW1hZ2UoIGdldEZhbGxiYWNrSW1hZ2UoIFwiXCIgKSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGFuZ2VzIHRoZSB1cGxvYWQgYnV0dG9uIHZhbHVlIHdoZW4gdGhlcmUgYXJlIGZhbGxiYWNrIGltYWdlcyBwcmVzZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUHJlZml4IFRoZSB2YWx1ZSBiZWZvcmUgdGhlIGlkIG5hbWUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IG9uIHRoZSBidXR0b24uXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0VXBsb2FkQnV0dG9uVmFsdWUoIGJ1dHRvblByZWZpeCwgdGV4dCApIHtcblx0XHQkKCBcIiNcIiAgKyBidXR0b25QcmVmaXggKyBcIi1lZGl0b3ItaW1hZ2VVcmxfYnV0dG9uXCIgKS5odG1sKCB0ZXh0ICk7XG5cdH1cblxuXHQvKipcblx0ICogQmluZCB0aGUgaW1hZ2UgZXZlbnRzIHRvIHNldCB0aGUgZmFsbGJhY2sgYW5kIHJlbmRlcmluZyB0aGUgcHJldmlldy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBiaW5kSW1hZ2VFdmVudHMoKSB7XG5cdFx0aWYgKCBnZXRDdXJyZW50VHlwZSgpID09PSBcInBvc3RcIiApIHtcblx0XHRcdGJpbmRGZWF0dXJlZEltYWdlRXZlbnRzKCk7XG5cdFx0fVxuXG5cdFx0YmluZENvbnRlbnRFdmVudHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHRleHQgdGhhdCB0aGUgdXBsb2FkIGJ1dHRvbiBuZWVkcyB0byBkaXNwbGF5XG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2aWV3IFByZXZpZXcgdG8gcmVhZCBpbWFnZSBmcm9tLlxuXHQgKiBAcmV0dXJucyB7Kn0gVGhlIHRleHQgZm9yIHRoZSBidXR0b24uXG4gICAgICovXG5cdGZ1bmN0aW9uIGdldFVwbG9hZEJ1dHRvblRleHQoIHByZXZpZXcgKSB7XG5cdFx0cmV0dXJuIHByZXZpZXcuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiA/IHlvYXN0U29jaWFsUHJldmlldy51cGxvYWRJbWFnZSA6IHlvYXN0U29jaWFsUHJldmlldy51c2VPdGhlckltYWdlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIHRoZSBldmVudHMgZm9yIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBiaW5kRmVhdHVyZWRJbWFnZUV2ZW50cygpIHtcblx0XHRpZiAoIGlzVW5kZWZpbmVkKCB3cC5tZWRpYSApIHx8IGlzVW5kZWZpbmVkKCB3cC5tZWRpYS5mZWF0dXJlZEltYWdlICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUgZmVhdHVyZWQgaW1hZ2UgaXMgYmVpbmcgY2hhbmdlZFxuXHRcdHZhciBmZWF0dXJlZEltYWdlID0gd3AubWVkaWEuZmVhdHVyZWRJbWFnZS5mcmFtZSgpO1xuXG5cdFx0ZmVhdHVyZWRJbWFnZS5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaW1hZ2VEZXRhaWxzID0gZmVhdHVyZWRJbWFnZS5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkuYXR0cmlidXRlcztcblxuXHRcdFx0Y2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSB0cnVlO1xuXG5cdFx0XHRzZXRGZWF0dXJlZEltYWdlKCBpbWFnZURldGFpbHMudXJsICk7XG5cdFx0fSApO1xuXG5cdFx0JCggXCIjcG9zdGltYWdlZGl2XCIgKS5vbiggXCJjbGlja1wiLCBcIiNyZW1vdmUtcG9zdC10aHVtYm5haWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRjYW5SZWFkRmVhdHVyZWRJbWFnZSA9IGZhbHNlO1xuXG5cdFx0XHRjbGVhckZlYXR1cmVkSW1hZ2UoKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQmluZCB0aGUgZXZlbnRzIGZvciB0aGUgY29udGVudC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBiaW5kQ29udGVudEV2ZW50cygpIHtcblx0XHQvLyBCaW5kIHRoZSBldmVudCB3aGVuIHNvbWV0aGluZyBjaGFuZ2VkIGluIHRoZSB0ZXh0IGVkaXRvci5cblx0XHR2YXIgY29udGVudEVsZW1lbnQgPSAkKCBcIiNcIiArIGNvbnRlbnRUZXh0TmFtZSgpICk7XG5cdFx0aWYgKCBjb250ZW50RWxlbWVudC5sZW5ndGggPiAwICkge1xuXHRcdFx0Y29udGVudEVsZW1lbnQub24oIFwiaW5wdXRcIiwgZGV0ZWN0SW1hZ2VGYWxsYmFjayApO1xuXHRcdH1cblxuXHRcdC8vIEJpbmQgdGhlIGV2ZW50cyB3aGVuIHNvbWV0aGluZyBjaGFuZ2VkIGluIHRoZSB0aW55TUNFIGVkaXRvci5cblx0XHRpZiAoIHR5cGVvZiB0aW55TUNFICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aW55TUNFLm9uID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cdFx0XHR2YXIgZXZlbnRzID0gWyBcImlucHV0XCIsIFwiY2hhbmdlXCIsIFwiY3V0XCIsIFwicGFzdGVcIiBdO1xuXHRcdFx0dGlueU1DRS5vbiggXCJhZGRFZGl0b3JcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRlLmVkaXRvci5vbiggZXZlbnRzWyBpIF0sIGRldGVjdEltYWdlRmFsbGJhY2sgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBmZWF0dXJlZCBpbWFnZSBmYWxsYmFjayB2YWx1ZSBhcyBhbiBlbXB0eSB2YWx1ZSBhbmQgcnVucyB0aGUgZmFsbGJhY2sgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNsZWFyRmVhdHVyZWRJbWFnZSgpIHtcblx0XHRzZXRGZWF0dXJlZEltYWdlKCBcIlwiICk7XG5cdFx0ZGV0ZWN0SW1hZ2VGYWxsYmFjaygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGltYWdlIGZhbGxiYWNrcyBsaWtlIHRoZSBmZWF0dXJlZCBpbWFnZSAoaW4gY2FzZSBvZiBhIHBvc3QpIGFuZCB0aGUgY29udGVudCBpbWFnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkZXRlY3RJbWFnZUZhbGxiYWNrKCkge1xuXHRcdC8vIEluIGNhc2Ugb2YgYSBwb3N0OiB3ZSB3YW50IHRvIGhhdmUgdGhlIGZlYXR1cmVkIGltYWdlLlxuXHRcdGlmICggZ2V0Q3VycmVudFR5cGUoKSA9PT0gXCJwb3N0XCIgKSB7XG5cdFx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IGdldEZlYXR1cmVkSW1hZ2UoKTtcblx0XHRcdHNldEZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKTtcblxuXHRcdFx0aWYgKCBmZWF0dXJlZEltYWdlICE9PSBcIlwiICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2V0Q29udGVudEltYWdlKCBnZXRDb250ZW50SW1hZ2UoIGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0XHRcdHNldENvbnRlbnRJbWFnZSggaW1hZ2UgKTtcblx0XHR9ICkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBmZWF0dXJlZCBpbWFnZSBiYXNlZCBvbiB0aGUgZ2l2ZW4gaW1hZ2UgVVJMLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZmVhdHVyZWRJbWFnZSBUaGUgaW1hZ2Ugd2Ugd2FudCB0byBzZXQuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0RmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcblx0XHRpZiAoIGltYWdlRmFsbEJhY2suZmVhdHVyZWQgIT09IGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0XHRpbWFnZUZhbGxCYWNrLmZlYXR1cmVkID0gZmVhdHVyZWRJbWFnZTtcblxuXHRcdFx0Ly8gSnVzdCByZWZyZXNoIHRoZSBpbWFnZSBVUkwuXG5cdFx0XHQkKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcImltYWdlVXBkYXRlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY29udGVudCBpbWFnZSBiYXNlIG9uIHRoZSBnaXZlbiBpbWFnZSBVUkxcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRJbWFnZSBUaGUgaW1hZ2Ugd2Ugd2FudCB0byBzZXQuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0Q29udGVudEltYWdlKCBjb250ZW50SW1hZ2UgKSB7XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmNvbnRlbnQgIT09IGNvbnRlbnRJbWFnZSApIHtcblx0XHRcdGltYWdlRmFsbEJhY2suY29udGVudCA9IGNvbnRlbnRJbWFnZTtcblxuXHRcdFx0Ly8gSnVzdCByZWZyZXNoIHRoZSBpbWFnZSBVUkwuXG5cdFx0XHQkKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcImltYWdlVXBkYXRlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2Ugc291cmNlIGZyb20gdGhlIERPTS5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHVybCB0byB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRGZWF0dXJlZEltYWdlKCkge1xuXHRcdGlmICggY2FuUmVhZEZlYXR1cmVkSW1hZ2UgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXG5cdFx0dmFyIHBvc3RUaHVtYm5haWwgPSAkKCBcIi5hdHRhY2htZW50LXBvc3QtdGh1bWJuYWlsXCIgKTtcblx0XHRpZiAoIHBvc3RUaHVtYm5haWwubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybiAkKCBwb3N0VGh1bWJuYWlsLmdldCggMCApICkuYXR0ciggXCJzcmNcIiApO1xuXHRcdH1cblxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGltYWdlIGZyb20gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgaWYgYSBiaWdnZXIgc2l6ZSBpcyBhdmFpbGFibGUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmaXJzdCBpbWFnZSBmb3VuZCBpbiB0aGUgY29udGVudC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldENvbnRlbnRJbWFnZSggY2FsbGJhY2sgKSB7XG5cdFx0dmFyIGNvbnRlbnQgPSBnZXRDb250ZW50KCk7XG5cblx0XHR2YXIgaW1hZ2VzID0gZ2V0SW1hZ2VzKCBjb250ZW50ICk7XG5cdFx0dmFyIGltYWdlICA9IFwiXCI7XG5cblx0XHRpZiAoIGltYWdlcy5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2U7XG5cdFx0fVxuXG5cdFx0ZG8ge1xuXHRcdFx0dmFyIGN1cnJlbnRJbWFnZSA9IGltYWdlcy5zaGlmdCgpO1xuXHRcdFx0Y3VycmVudEltYWdlID0gJCggY3VycmVudEltYWdlICk7XG5cblx0XHRcdHZhciBpbWFnZVNvdXJjZSA9IGN1cnJlbnRJbWFnZS5wcm9wKCBcInNyY1wiICk7XG5cblx0XHRcdGlmICggaW1hZ2VTb3VyY2UgKSB7XG5cdFx0XHRcdGltYWdlID0gaW1hZ2VTb3VyY2U7XG5cdFx0XHR9XG5cdFx0fSB3aGlsZSAoIFwiXCIgPT09IGltYWdlICYmIGltYWdlcy5sZW5ndGggPiAwICk7XG5cblx0XHRpbWFnZSA9IGdldEJpZ2dlckltYWdlKCBpbWFnZSwgY2FsbGJhY2sgKTtcblxuXHRcdHJldHVybiBpbWFnZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcnkgdG8gcmV0cmlldmUgYSBiaWdnZXIgaW1hZ2UgZm9yIGEgY2VydGFpbiBpbWFnZSBmb3VuZCBpbiB0aGUgY29udGVudC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9ICAgdXJsICAgICAgVGhlIFVSTCB0byByZXRyaWV2ZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGNhbGwgaWYgdGhlcmUgaXMgYSBiaWdnZXIgaW1hZ2UuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGJpZ2dlciBpbWFnZSB1cmwuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRCaWdnZXJJbWFnZSggdXJsLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIF9oYXMoIGJpZ2dlckltYWdlcywgdXJsICkgKSB7XG5cdFx0XHRyZXR1cm4gYmlnZ2VySW1hZ2VzWyB1cmwgXTtcblx0XHR9XG5cblx0XHRyZXRyaWV2ZUltYWdlRGF0YUZyb21VUkwoIHVybCwgZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0YmlnZ2VySW1hZ2VzWyB1cmwgXSA9IGltYWdlVXJsO1xuXG5cdFx0XHRjYWxsYmFjayggaW1hZ2VVcmwgKTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgaW1hZ2UgbWV0YWRhdGEgZnJvbSBhbiBpbWFnZSB1cmwgYW5kIHNhdmVzIGl0IHRvIHRoZSBpbWFnZSBtYW5hZ2VyIGFmdGVyd2FyZHNcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgaW1hZ2UgVVJMIHRvIHJldHJpZXZlIHRoZSBtZXRhZGF0YSBmcm9tLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBjYWxsIHdpdGggdGhlIGltYWdlIFVSTCByZXN1bHQuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gcmV0cmlldmVJbWFnZURhdGFGcm9tVVJMKCB1cmwsIGNhbGxiYWNrICkge1xuXHRcdCQuZ2V0SlNPTiggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcInJldHJpZXZlX2ltYWdlX2RhdGFfZnJvbV91cmxcIixcblx0XHRcdGltYWdlVVJMOiB1cmwsXG5cdFx0fSwgZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCBcInN1Y2Nlc3NcIiA9PT0gcmVzcG9uc2Uuc3RhdHVzICkge1xuXHRcdFx0XHRjYWxsYmFjayggcmVzcG9uc2UucmVzdWx0ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGNvbnRlbnQgZnJvbSBjdXJyZW50IHZpc2libGUgY29udGVudCBlZGl0b3Jcblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSB0aW55bWNlIGJveC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XG5cdFx0aWYgKCBpc1RpbnlNQ0VBdmFpbGFibGUoKSApIHtcblx0XHRcdHJldHVybiB0aW55TUNFLmdldCggY29udGVudFRleHROYW1lKCkgKS5nZXRDb250ZW50KCk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gJCggXCIjXCIgKyBjb250ZW50VGV4dE5hbWUoKSApO1xuXHRcdGlmICggY29udGVudEVsZW1lbnQubGVuZ3RoID4gMCApIHtcblx0XHRcdHJldHVybiBjb250ZW50RWxlbWVudC52YWwoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiB0aW55bWNlIGlzIGFjdGl2ZSBvbiB0aGUgY3VycmVudCBwYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIHRpbnltY2UgaXMgYXZhaWxhYmxlLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNUaW55TUNFQXZhaWxhYmxlKCkge1xuXHRcdGlmICggdHlwZW9mIHRpbnlNQ0UgPT09IFwidW5kZWZpbmVkXCIgfHxcblx0XHRcdHR5cGVvZiB0aW55TUNFLmVkaXRvcnMgPT09IFwidW5kZWZpbmVkXCIgfHxcblx0XHRcdHRpbnlNQ0UuZWRpdG9ycy5sZW5ndGggPT09IDAgfHxcblx0XHRcdHRpbnlNQ0UuZ2V0KCBjb250ZW50VGV4dE5hbWUoKSApID09PSBudWxsIHx8XG5cdFx0XHR0aW55TUNFLmdldCggY29udGVudFRleHROYW1lKCkgICkuaXNIaWRkZW4oKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiB0aGVyZSBpcyBhIGZhbGxiYWNrIGltYWdlIGxpa2UgdGhlIGZlYXR1cmVkIGltYWdlIG9yIHRoZSBmaXJzdCBpbWFnZSBpbiB0aGUgY29udGVudC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRlZmF1bHRJbWFnZSBUaGUgZGVmYXVsdCBpbWFnZSB3aGVuIG5vdGhpbmcgaGFzIGJlZW4gZm91bmQuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBpbWFnZSB0byB1c2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRGYWxsYmFja0ltYWdlKCBkZWZhdWx0SW1hZ2UgKSB7XG5cdFx0Ly8gVHdpdHRlciBhbHdheXMgZmlyc3QgZmFsbHMgYmFjayB0byBGYWNlYm9va1xuXHRcdGlmICggISBpc1VuZGVmaW5lZCggZmFjZWJvb2tQcmV2aWV3ICkgJiYgZmFjZWJvb2tQcmV2aWV3LmRhdGEuaW1hZ2VVcmwgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gZmFjZWJvb2tQcmV2aWV3LmRhdGEuaW1hZ2VVcmw7XG5cdFx0fVxuXG5cdFx0Ly8gSW4gY2FzZSBvZiBhbiBwb3N0OiB3ZSB3YW50IHRvIGhhdmUgdGhlIGZlYXR1cmVkIGltYWdlLlxuXHRcdGlmICggZ2V0Q3VycmVudFR5cGUoKSA9PT0gXCJwb3N0XCIgKSB7XG5cdFx0XHRpZiAoIGltYWdlRmFsbEJhY2suZmVhdHVyZWQgIT09IFwiXCIgKSB7XG5cdFx0XHRcdHJldHVybiBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhlIGZlYXR1cmVkIGltYWdlIGlzIGVtcHR5LCB0cnkgYW4gaW1hZ2UgaW4gdGhlIGNvbnRlbnRcblx0XHRpZiAoIGltYWdlRmFsbEJhY2suY29udGVudCAhPT0gXCJcIiApIHtcblx0XHRcdHJldHVybiBpbWFnZUZhbGxCYWNrLmNvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBkZWZhdWx0SW1hZ2UgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiBkZWZhdWx0SW1hZ2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgaGVscCBwYW5lbHMgdG8gdGhlIHNvY2lhbCBwcmV2aWV3c1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFkZEhlbHBQYW5lbHMoKSB7XG5cdFx0dmFyIHBhbmVscyA9IFtcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjZmFjZWJvb2stZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLmZhY2Vib29rSW1hZ2UsXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAuZmFjZWJvb2tJbWFnZSxcblx0XHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWltYWdlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI2ZhY2Vib29rLWVkaXRvci10aXRsZVwiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi5mYWNlYm9va1RpdGxlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLmZhY2Vib29rVGl0bGUsXG5cdFx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci10aXRsZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24uZmFjZWJvb2tEZXNjcmlwdGlvbixcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC5mYWNlYm9va0Rlc2NyaXB0aW9uLFxuXHRcdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb24taGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlckltYWdlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJJbWFnZSxcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItaW1hZ2UtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItdGl0bGVcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlclRpdGxlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJUaXRsZSxcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItdGl0bGUtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24udHdpdHRlckRlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLnR3aXR0ZXJEZXNjcmlwdGlvbixcblx0XHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb24taGVscFwiLFxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0Zm9yRWFjaCggcGFuZWxzLCBmdW5jdGlvbiggcGFuZWwgKSB7XG5cdFx0XHQkKCBwYW5lbC5iZWZvcmVFbGVtZW50ICkuYmVmb3JlKFxuXHRcdFx0XHRoZWxwUGFuZWwuaGVscEJ1dHRvbiggcGFuZWwuYnV0dG9uVGV4dCwgcGFuZWwuaWQgKSArXG5cdFx0XHRcdGhlbHBQYW5lbC5oZWxwVGV4dCggcGFuZWwuZGVzY3JpcHRpb25UZXh0LCBwYW5lbC5pZCApXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCQoIFwiLnNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKS5vbiggXCJjbGlja1wiLCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkYnV0dG9uID0gJCggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSAkKCBcIiNcIiArICRidXR0b24uYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSApLFxuXHRcdFx0XHRpc1BhbmVsVmlzaWJsZSA9IGhlbHBQYW5lbC5pcyggXCI6dmlzaWJsZVwiICk7XG5cblx0XHRcdCQoIGhlbHBQYW5lbCApLnNsaWRlVG9nZ2xlKCAyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkYnV0dG9uLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIGlzUGFuZWxWaXNpYmxlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgbGlicmFyeSB0cmFuc2xhdGlvbnNcblx0ICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyBUaGUgdHJhbnNsYXRpb25zIHRvIHVzZS5cblx0ICogQHJldHVybnMge09iamVjdH0gdHJhbnNsYXRpb25zIG1hcHBlZCB0byB0aGUgcHJvcGVyIGRvbWFpbi5cblx0ICovXG5cdGZ1bmN0aW9uIGFkZExpYnJhcnlUcmFuc2xhdGlvbnMoIHRyYW5zbGF0aW9ucyApIHtcblx0XHRpZiAoIHR5cGVvZiB0cmFuc2xhdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRyYW5zbGF0aW9ucy5kb21haW4gIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHR0cmFuc2xhdGlvbnMuZG9tYWluID0gXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjtcblx0XHRcdHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiBdID0gY2xvbmUoIHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ3b3JkcHJlc3Mtc2VvLXByZW1pdW1cIiBdICk7XG5cblx0XHRcdGRlbGV0ZSggdHJhbnNsYXRpb25zLmxvY2FsZV9kYXRhWyBcIndvcmRwcmVzcy1zZW8tcHJlbWl1bVwiIF0gKTtcblxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0aW9ucztcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0ZG9tYWluOiBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLFxuXHRcdFx0bG9jYWxlX2RhdGE6IHtcblx0XHRcdFx0XCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIjoge1xuXHRcdFx0XHRcdFwiXCI6IHt9LFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHNvY2lhbCBwcmV2aWV3cy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0WW9hc3RTb2NpYWxQcmV2aWV3cygpIHtcblx0XHR2YXIgZmFjZWJvb2tIb2xkZXIgPSAkKCBcIiN3cHNlb19mYWNlYm9va1wiICk7XG5cdFx0dmFyIHR3aXR0ZXJIb2xkZXIgPSAkKCBcIiN3cHNlb190d2l0dGVyXCIgKTtcblxuXHRcdGlmICggZmFjZWJvb2tIb2xkZXIubGVuZ3RoID4gMCB8fCB0d2l0dGVySG9sZGVyLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRqUXVlcnkoIHdpbmRvdyApLm9uKCBcIllvYXN0U0VPOnJlYWR5XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkZXRlY3RJbWFnZUZhbGxiYWNrKCk7XG5cblx0XHRcdFx0aWYgKCBmYWNlYm9va0hvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGluaXRGYWNlYm9vayggZmFjZWJvb2tIb2xkZXIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggdHdpdHRlckhvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGluaXRUd2l0dGVyKCB0d2l0dGVySG9sZGVyICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhZGRIZWxwUGFuZWxzKCk7XG5cdFx0XHRcdGJpbmRJbWFnZUV2ZW50cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdCQoIGluaXRZb2FzdFNvY2lhbFByZXZpZXdzICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyoqXG4gKiBAcHJlc2VydmUgamVkLmpzIGh0dHBzOi8vZ2l0aHViLmNvbS9TbGV4QXh0b24vSmVkXG4gKi9cbi8qXG4tLS0tLS0tLS0tLVxuQSBnZXR0ZXh0IGNvbXBhdGlibGUgaTE4biBsaWJyYXJ5IGZvciBtb2Rlcm4gSmF2YVNjcmlwdCBBcHBsaWNhdGlvbnNcblxuYnkgQWxleCBTZXh0b24gLSBBbGV4U2V4dG9uIFthdF0gZ21haWwgLSBAU2xleEF4dG9uXG5cbk1JVCBMaWNlbnNlXG5cbkEgalF1ZXJ5IEZvdW5kYXRpb24gcHJvamVjdCAtIHJlcXVpcmVzIENMQSB0byBjb250cmlidXRlIC1cbmh0dHBzOi8vY29udHJpYnV0ZS5qcXVlcnkub3JnL0NMQS9cblxuXG5cbkplZCBvZmZlcnMgdGhlIGVudGlyZSBhcHBsaWNhYmxlIEdOVSBnZXR0ZXh0IHNwZWMnZCBzZXQgb2ZcbmZ1bmN0aW9ucywgYnV0IGFsc28gb2ZmZXJzIHNvbWUgbmljZXIgd3JhcHBlcnMgYXJvdW5kIHRoZW0uXG5UaGUgYXBpIGZvciBnZXR0ZXh0IHdhcyB3cml0dGVuIGZvciBhIGxhbmd1YWdlIHdpdGggbm8gZnVuY3Rpb25cbm92ZXJsb2FkaW5nLCBzbyBKZWQgYWxsb3dzIGEgbGl0dGxlIG1vcmUgb2YgdGhhdC5cblxuTWFueSB0aGFua3MgdG8gSm9zaHVhIEkuIE1pbGxlciAtIHVucnRzdEBjcGFuLm9yZyAtIHdobyB3cm90ZVxuZ2V0dGV4dC5qcyBiYWNrIGluIDIwMDguIEkgd2FzIGFibGUgdG8gdmV0IGEgbG90IG9mIG15IGlkZWFzXG5hZ2FpbnN0IGhpcy4gSSBhbHNvIG1hZGUgc3VyZSBKZWQgcGFzc2VkIGFnYWluc3QgaGlzIHRlc3RzXG5pbiBvcmRlciB0byBvZmZlciBlYXN5IHVwZ3JhZGVzIC0tIGpzZ2V0dGV4dC5iZXJsaW9zLmRlXG4qL1xuKGZ1bmN0aW9uIChyb290LCB1bmRlZikge1xuXG4gIC8vIFNldCB1cCBzb21lIHVuZGVyc2NvcmUtc3R5bGUgZnVuY3Rpb25zLCBpZiB5b3UgYWxyZWFkeSBoYXZlXG4gIC8vIHVuZGVyc2NvcmUsIGZlZWwgZnJlZSB0byBkZWxldGUgdGhpcyBzZWN0aW9uLCBhbmQgdXNlIGl0XG4gIC8vIGRpcmVjdGx5LCBob3dldmVyLCB0aGUgYW1vdW50IG9mIGZ1bmN0aW9ucyB1c2VkIGRvZXNuJ3RcbiAgLy8gd2FycmFudCBoYXZpbmcgdW5kZXJzY29yZSBhcyBhIGZ1bGwgZGVwZW5kZW5jeS5cbiAgLy8gVW5kZXJzY29yZSAxLjMuMCB3YXMgdXNlZCB0byBwb3J0IGFuZCBpcyBsaWNlbnNlZFxuICAvLyB1bmRlciB0aGUgTUlUIExpY2Vuc2UgYnkgSmVyZW15IEFzaGtlbmFzLlxuICB2YXIgQXJyYXlQcm90byAgICA9IEFycmF5LnByb3RvdHlwZSxcbiAgICAgIE9ialByb3RvICAgICAgPSBPYmplY3QucHJvdG90eXBlLFxuICAgICAgc2xpY2UgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgICBoYXNPd25Qcm9wICAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHksXG4gICAgICBuYXRpdmVGb3JFYWNoID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgICAgYnJlYWtlciAgICAgICA9IHt9O1xuXG4gIC8vIFdlJ3JlIG5vdCB1c2luZyB0aGUgT09QIHN0eWxlIF8gc28gd2UgZG9uJ3QgbmVlZCB0aGVcbiAgLy8gZXh0cmEgbGV2ZWwgb2YgaW5kaXJlY3Rpb24uIFRoaXMgc3RpbGwgbWVhbnMgdGhhdCB5b3VcbiAgLy8gc3ViIG91dCBmb3IgcmVhbCBgX2AgdGhvdWdoLlxuICB2YXIgXyA9IHtcbiAgICBmb3JFYWNoIDogZnVuY3Rpb24oIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQgKSB7XG4gICAgICB2YXIgaSwgbCwga2V5O1xuICAgICAgaWYgKCBvYmogPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCBuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoICkge1xuICAgICAgICBvYmouZm9yRWFjaCggaXRlcmF0b3IsIGNvbnRleHQgKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCApIHtcbiAgICAgICAgZm9yICggaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIGlmICggaSBpbiBvYmogJiYgaXRlcmF0b3IuY2FsbCggY29udGV4dCwgb2JqW2ldLCBpLCBvYmogKSA9PT0gYnJlYWtlciApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKCBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKCBoYXNPd25Qcm9wLmNhbGwoIG9iaiwga2V5ICkgKSB7XG4gICAgICAgICAgICBpZiAoIGl0ZXJhdG9yLmNhbGwgKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaiApID09PSBicmVha2VyICkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBleHRlbmQgOiBmdW5jdGlvbiggb2JqICkge1xuICAgICAgdGhpcy5mb3JFYWNoKCBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKSwgZnVuY3Rpb24gKCBzb3VyY2UgKSB7XG4gICAgICAgIGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gIH07XG4gIC8vIEVORCBNaW5pYXR1cmUgdW5kZXJzY29yZSBpbXBsXG5cbiAgLy8gSmVkIGlzIGEgY29uc3RydWN0b3IgZnVuY3Rpb25cbiAgdmFyIEplZCA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcbiAgICAvLyBTb21lIG1pbmltYWwgZGVmYXVsdHNcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgXCJsb2NhbGVfZGF0YVwiIDoge1xuICAgICAgICBcIm1lc3NhZ2VzXCIgOiB7XG4gICAgICAgICAgXCJcIiA6IHtcbiAgICAgICAgICAgIFwiZG9tYWluXCIgICAgICAgOiBcIm1lc3NhZ2VzXCIsXG4gICAgICAgICAgICBcImxhbmdcIiAgICAgICAgIDogXCJlblwiLFxuICAgICAgICAgICAgXCJwbHVyYWxfZm9ybXNcIiA6IFwibnBsdXJhbHM9MjsgcGx1cmFsPShuICE9IDEpO1wiXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFRoZXJlIGFyZSBubyBkZWZhdWx0IGtleXMsIHRob3VnaFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVGhlIGRlZmF1bHQgZG9tYWluIGlmIG9uZSBpcyBtaXNzaW5nXG4gICAgICBcImRvbWFpblwiIDogXCJtZXNzYWdlc1wiLFxuICAgICAgLy8gZW5hYmxlIGRlYnVnIG1vZGUgdG8gbG9nIHVudHJhbnNsYXRlZCBzdHJpbmdzIHRvIHRoZSBjb25zb2xlXG4gICAgICBcImRlYnVnXCIgOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBNaXggaW4gdGhlIHNlbnQgb3B0aW9ucyB3aXRoIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAgICB0aGlzLm9wdGlvbnMgPSBfLmV4dGVuZCgge30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMgKTtcbiAgICB0aGlzLnRleHRkb21haW4oIHRoaXMub3B0aW9ucy5kb21haW4gKTtcblxuICAgIGlmICggb3B0aW9ucy5kb21haW4gJiYgISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIHRoaXMub3B0aW9ucy5kb21haW4gXSApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGV4dCBkb21haW4gc2V0IHRvIG5vbi1leGlzdGVudCBkb21haW46IGAnICsgb3B0aW9ucy5kb21haW4gKyAnYCcpO1xuICAgIH1cbiAgfTtcblxuICAvLyBUaGUgZ2V0dGV4dCBzcGVjIHNldHMgdGhpcyBjaGFyYWN0ZXIgYXMgdGhlIGRlZmF1bHRcbiAgLy8gZGVsaW1pdGVyIGZvciBjb250ZXh0IGxvb2t1cHMuXG4gIC8vIGUuZy46IGNvbnRleHRcXHUwMDA0a2V5XG4gIC8vIElmIHlvdXIgdHJhbnNsYXRpb24gY29tcGFueSB1c2VzIHNvbWV0aGluZyBkaWZmZXJlbnQsXG4gIC8vIGp1c3QgY2hhbmdlIHRoaXMgYXQgYW55IHRpbWUgYW5kIGl0IHdpbGwgdXNlIHRoYXQgaW5zdGVhZC5cbiAgSmVkLmNvbnRleHRfZGVsaW1pdGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZSggNCApO1xuXG4gIGZ1bmN0aW9uIGdldFBsdXJhbEZvcm1GdW5jICggcGx1cmFsX2Zvcm1fc3RyaW5nICkge1xuICAgIHJldHVybiBKZWQuUEYuY29tcGlsZSggcGx1cmFsX2Zvcm1fc3RyaW5nIHx8IFwibnBsdXJhbHM9MjsgcGx1cmFsPShuICE9IDEpO1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENoYWluKCBrZXksIGkxOG4gKXtcbiAgICB0aGlzLl9rZXkgPSBrZXk7XG4gICAgdGhpcy5faTE4biA9IGkxOG47XG4gIH1cblxuICAvLyBDcmVhdGUgYSBjaGFpbmFibGUgYXBpIGZvciBhZGRpbmcgYXJncyBwcmV0dGlseVxuICBfLmV4dGVuZCggQ2hhaW4ucHJvdG90eXBlLCB7XG4gICAgb25Eb21haW4gOiBmdW5jdGlvbiAoIGRvbWFpbiApIHtcbiAgICAgIHRoaXMuX2RvbWFpbiA9IGRvbWFpbjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgd2l0aENvbnRleHQgOiBmdW5jdGlvbiAoIGNvbnRleHQgKSB7XG4gICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaWZQbHVyYWwgOiBmdW5jdGlvbiAoIG51bSwgcGtleSApIHtcbiAgICAgIHRoaXMuX3ZhbCA9IG51bTtcbiAgICAgIHRoaXMuX3BrZXkgPSBwa2V5O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBmZXRjaCA6IGZ1bmN0aW9uICggc0FyciApIHtcbiAgICAgIGlmICgge30udG9TdHJpbmcuY2FsbCggc0FyciApICE9ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICAgIHNBcnIgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKCBzQXJyICYmIHNBcnIubGVuZ3RoID8gSmVkLnNwcmludGYgOiBmdW5jdGlvbih4KXsgcmV0dXJuIHg7IH0gKShcbiAgICAgICAgdGhpcy5faTE4bi5kY25wZ2V0dGV4dCh0aGlzLl9kb21haW4sIHRoaXMuX2NvbnRleHQsIHRoaXMuX2tleSwgdGhpcy5fcGtleSwgdGhpcy5fdmFsKSxcbiAgICAgICAgc0FyclxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFkZCBmdW5jdGlvbnMgdG8gdGhlIEplZCBwcm90b3R5cGUuXG4gIC8vIFRoZXNlIHdpbGwgYmUgdGhlIGZ1bmN0aW9ucyBvbiB0aGUgb2JqZWN0IHRoYXQncyByZXR1cm5lZFxuICAvLyBmcm9tIGNyZWF0aW5nIGEgYG5ldyBKZWQoKWBcbiAgLy8gVGhlc2Ugc2VlbSByZWR1bmRhbnQsIGJ1dCB0aGV5IGd6aXAgcHJldHR5IHdlbGwuXG4gIF8uZXh0ZW5kKCBKZWQucHJvdG90eXBlLCB7XG4gICAgLy8gVGhlIHNleGllciBhcGkgc3RhcnQgcG9pbnRcbiAgICB0cmFuc2xhdGUgOiBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIHJldHVybiBuZXcgQ2hhaW4oIGtleSwgdGhpcyApO1xuICAgIH0sXG5cbiAgICB0ZXh0ZG9tYWluIDogZnVuY3Rpb24gKCBkb21haW4gKSB7XG4gICAgICBpZiAoICEgZG9tYWluICkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dGRvbWFpbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RleHRkb21haW4gPSBkb21haW47XG4gICAgfSxcblxuICAgIGdldHRleHQgOiBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIGRnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGtleSApIHtcbiAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwga2V5ICk7XG4gICAgfSxcblxuICAgIGRjZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluICwga2V5IC8qLCBjYXRlZ29yeSAqLyApIHtcbiAgICAgIC8vIElnbm9yZXMgdGhlIGNhdGVnb3J5IGFueXdheXNcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBuZ2V0dGV4dCA6IGZ1bmN0aW9uICggc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZG5nZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkY25nZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIHNrZXksIHBrZXksIHZhbC8qLCBjYXRlZ29yeSAqLykge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIHBnZXR0ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0LCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIGRwZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBkY3BnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIGtleS8qLCBjYXRlZ29yeSAqLykge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRucGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgLy8gVGhlIG1vc3QgZnVsbHkgcXVhbGlmaWVkIGdldHRleHQgZnVuY3Rpb24uIEl0IGhhcyBldmVyeSBvcHRpb24uXG4gICAgLy8gU2luY2UgaXQgaGFzIGV2ZXJ5IG9wdGlvbiwgd2UgY2FuIHVzZSBpdCBmcm9tIGV2ZXJ5IG90aGVyIG1ldGhvZC5cbiAgICAvLyBUaGlzIGlzIHRoZSBicmVhZCBhbmQgYnV0dGVyLlxuICAgIC8vIFRlY2huaWNhbGx5IHRoZXJlIHNob3VsZCBiZSBvbmUgbW9yZSBhcmd1bWVudCBpbiB0aGlzIGZ1bmN0aW9uIGZvciAnQ2F0ZWdvcnknLFxuICAgIC8vIGJ1dCBzaW5jZSB3ZSBuZXZlciB1c2UgaXQsIHdlIG1pZ2h0IGFzIHdlbGwgbm90IHdhc3RlIHRoZSBieXRlcyB0byBkZWZpbmUgaXQuXG4gICAgZGNucGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5LCB2YWwgKSB7XG4gICAgICAvLyBTZXQgc29tZSBkZWZhdWx0c1xuXG4gICAgICBwbHVyYWxfa2V5ID0gcGx1cmFsX2tleSB8fCBzaW5ndWxhcl9rZXk7XG5cbiAgICAgIC8vIFVzZSB0aGUgZ2xvYmFsIGRvbWFpbiBkZWZhdWx0IGlmIG9uZVxuICAgICAgLy8gaXNuJ3QgZXhwbGljaXRseSBwYXNzZWQgaW5cbiAgICAgIGRvbWFpbiA9IGRvbWFpbiB8fCB0aGlzLl90ZXh0ZG9tYWluO1xuXG4gICAgICB2YXIgZmFsbGJhY2s7XG5cbiAgICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2VzXG5cbiAgICAgIC8vIE5vIG9wdGlvbnMgZm91bmRcbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMgKSB7XG4gICAgICAgIC8vIFRoZXJlJ3MgbGlrZWx5IHNvbWV0aGluZyB3cm9uZywgYnV0IHdlJ2xsIHJldHVybiB0aGUgY29ycmVjdCBrZXkgZm9yIGVuZ2xpc2hcbiAgICAgICAgLy8gV2UgZG8gdGhpcyBieSBpbnN0YW50aWF0aW5nIGEgYnJhbmQgbmV3IEplZCBpbnN0YW5jZSB3aXRoIHRoZSBkZWZhdWx0IHNldFxuICAgICAgICAvLyBmb3IgZXZlcnl0aGluZyB0aGF0IGNvdWxkIGJlIGJyb2tlbi5cbiAgICAgICAgZmFsbGJhY2sgPSBuZXcgSmVkKCk7XG4gICAgICAgIHJldHVybiBmYWxsYmFjay5kY25wZ2V0dGV4dC5jYWxsKCBmYWxsYmFjaywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSwgdmFsICk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vIHRyYW5zbGF0aW9uIGRhdGEgcHJvdmlkZWRcbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGEgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbG9jYWxlIGRhdGEgcHJvdmlkZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIGRvbWFpbiBdICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvbWFpbiBgJyArIGRvbWFpbiArICdgIHdhcyBub3QgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICggISB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGFbIGRvbWFpbiBdWyBcIlwiIF0gKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gbG9jYWxlIG1ldGEgaW5mb3JtYXRpb24gcHJvdmlkZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdHJ1dGh5IGtleS4gT3RoZXJ3aXNlIHdlIG1pZ2h0IHN0YXJ0IGxvb2tpbmdcbiAgICAgIC8vIGludG8gdGhlIGVtcHR5IHN0cmluZyBrZXksIHdoaWNoIGlzIHRoZSBvcHRpb25zIGZvciB0aGUgbG9jYWxlXG4gICAgICAvLyBkYXRhLlxuICAgICAgaWYgKCAhIHNpbmd1bGFyX2tleSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB0cmFuc2xhdGlvbiBrZXkgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBrZXkgID0gY29udGV4dCA/IGNvbnRleHQgKyBKZWQuY29udGV4dF9kZWxpbWl0ZXIgKyBzaW5ndWxhcl9rZXkgOiBzaW5ndWxhcl9rZXksXG4gICAgICAgICAgbG9jYWxlX2RhdGEgPSB0aGlzLm9wdGlvbnMubG9jYWxlX2RhdGEsXG4gICAgICAgICAgZGljdCA9IGxvY2FsZV9kYXRhWyBkb21haW4gXSxcbiAgICAgICAgICBkZWZhdWx0Q29uZiA9IChsb2NhbGVfZGF0YS5tZXNzYWdlcyB8fCB0aGlzLmRlZmF1bHRzLmxvY2FsZV9kYXRhLm1lc3NhZ2VzKVtcIlwiXSxcbiAgICAgICAgICBwbHVyYWxGb3JtcyA9IGRpY3RbXCJcIl0ucGx1cmFsX2Zvcm1zIHx8IGRpY3RbXCJcIl1bXCJQbHVyYWwtRm9ybXNcIl0gfHwgZGljdFtcIlwiXVtcInBsdXJhbC1mb3Jtc1wiXSB8fCBkZWZhdWx0Q29uZi5wbHVyYWxfZm9ybXMgfHwgZGVmYXVsdENvbmZbXCJQbHVyYWwtRm9ybXNcIl0gfHwgZGVmYXVsdENvbmZbXCJwbHVyYWwtZm9ybXNcIl0sXG4gICAgICAgICAgdmFsX2xpc3QsXG4gICAgICAgICAgcmVzO1xuXG4gICAgICB2YXIgdmFsX2lkeDtcbiAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBObyB2YWx1ZSBwYXNzZWQgaW47IGFzc3VtZSBzaW5ndWxhciBrZXkgbG9va3VwLlxuICAgICAgICB2YWxfaWR4ID0gMDtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVmFsdWUgaGFzIGJlZW4gcGFzc2VkIGluOyB1c2UgcGx1cmFsLWZvcm1zIGNhbGN1bGF0aW9ucy5cblxuICAgICAgICAvLyBIYW5kbGUgaW52YWxpZCBudW1iZXJzLCBidXQgdHJ5IGNhc3Rpbmcgc3RyaW5ncyBmb3IgZ29vZCBtZWFzdXJlXG4gICAgICAgIGlmICggdHlwZW9mIHZhbCAhPSAnbnVtYmVyJyApIHtcbiAgICAgICAgICB2YWwgPSBwYXJzZUludCggdmFsLCAxMCApO1xuXG4gICAgICAgICAgaWYgKCBpc05hTiggdmFsICkgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBudW1iZXIgdGhhdCB3YXMgcGFzc2VkIGluIGlzIG5vdCBhIG51bWJlci4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YWxfaWR4ID0gZ2V0UGx1cmFsRm9ybUZ1bmMocGx1cmFsRm9ybXMpKHZhbCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRocm93IGFuIGVycm9yIGlmIGEgZG9tYWluIGlzbid0IGZvdW5kXG4gICAgICBpZiAoICEgZGljdCApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBkb21haW4gbmFtZWQgYCcgKyBkb21haW4gKyAnYCBjb3VsZCBiZSBmb3VuZC4nKTtcbiAgICAgIH1cblxuICAgICAgdmFsX2xpc3QgPSBkaWN0WyBrZXkgXTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbWF0Y2gsIHRoZW4gcmV2ZXJ0IGJhY2sgdG9cbiAgICAgIC8vIGVuZ2xpc2ggc3R5bGUgc2luZ3VsYXIvcGx1cmFsIHdpdGggdGhlIGtleXMgcGFzc2VkIGluLlxuICAgICAgaWYgKCAhIHZhbF9saXN0IHx8IHZhbF9pZHggPiB2YWxfbGlzdC5sZW5ndGggKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWlzc2luZ19rZXlfY2FsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMubWlzc2luZ19rZXlfY2FsbGJhY2soa2V5LCBkb21haW4pO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IFsgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5IF07XG5cbiAgICAgICAgLy8gY29sbGVjdCB1bnRyYW5zbGF0ZWQgc3RyaW5nc1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnPT09dHJ1ZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMocGx1cmFsRm9ybXMpKCB2YWwgKSBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzWyBnZXRQbHVyYWxGb3JtRnVuYygpKCB2YWwgKSBdO1xuICAgICAgfVxuXG4gICAgICByZXMgPSB2YWxfbGlzdFsgdmFsX2lkeCBdO1xuXG4gICAgICAvLyBUaGlzIGluY2x1ZGVzIGVtcHR5IHN0cmluZ3Mgb24gcHVycG9zZVxuICAgICAgaWYgKCAhIHJlcyAgKSB7XG4gICAgICAgIHJlcyA9IFsgc2luZ3VsYXJfa2V5LCBwbHVyYWxfa2V5IF07XG4gICAgICAgIHJldHVybiByZXNbIGdldFBsdXJhbEZvcm1GdW5jKCkoIHZhbCApIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfSk7XG5cblxuICAvLyBXZSBhZGQgaW4gc3ByaW50ZiBjYXBhYmlsaXRpZXMgZm9yIHBvc3QgdHJhbnNsYXRpb24gdmFsdWUgaW50ZXJvbGF0aW9uXG4gIC8vIFRoaXMgaXMgbm90IGludGVybmFsbHkgdXNlZCwgc28geW91IGNhbiByZW1vdmUgaXQgaWYgeW91IGhhdmUgdGhpc1xuICAvLyBhdmFpbGFibGUgc29tZXdoZXJlIGVsc2UsIG9yIHdhbnQgdG8gdXNlIGEgZGlmZmVyZW50IHN5c3RlbS5cblxuICAvLyBXZSBfc2xpZ2h0bHlfIG1vZGlmeSB0aGUgbm9ybWFsIHNwcmludGYgYmVoYXZpb3IgdG8gbW9yZSBncmFjZWZ1bGx5IGhhbmRsZVxuICAvLyB1bmRlZmluZWQgdmFsdWVzLlxuXG4gIC8qKlxuICAgc3ByaW50ZigpIGZvciBKYXZhU2NyaXB0IDAuNy1iZXRhMVxuICAgaHR0cDovL3d3dy5kaXZlaW50b2phdmFzY3JpcHQuY29tL3Byb2plY3RzL2phdmFzY3JpcHQtc3ByaW50ZlxuXG4gICBDb3B5cmlnaHQgKGMpIEFsZXhhbmRydSBNYXJhc3RlYW51IDxhbGV4YWhvbGljIFthdCkgZ21haWwgKGRvdF0gY29tPlxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAgICAgICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICAgICAqIE5laXRoZXIgdGhlIG5hbWUgb2Ygc3ByaW50ZigpIGZvciBKYXZhU2NyaXB0IG5vciB0aGVcbiAgICAgICAgIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzXG4gICAgICAgICBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblxuICAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG4gICBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuICAgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRVxuICAgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgQWxleGFuZHJ1IE1hcmFzdGVhbnUgQkUgTElBQkxFIEZPUiBBTllcbiAgIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gICBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcbiAgIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gICovXG4gIHZhciBzcHJpbnRmID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGdldF90eXBlKHZhcmlhYmxlKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RyX3JlcGVhdChpbnB1dCwgbXVsdGlwbGllcikge1xuICAgICAgZm9yICh2YXIgb3V0cHV0ID0gW107IG11bHRpcGxpZXIgPiAwOyBvdXRwdXRbLS1tdWx0aXBsaWVyXSA9IGlucHV0KSB7LyogZG8gbm90aGluZyAqL31cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgdmFyIHN0cl9mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc3RyX2Zvcm1hdC5jYWNoZS5oYXNPd25Qcm9wZXJ0eShhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSA9IHN0cl9mb3JtYXQucGFyc2UoYXJndW1lbnRzWzBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJfZm9ybWF0LmZvcm1hdC5jYWxsKG51bGwsIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5mb3JtYXQgPSBmdW5jdGlvbihwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgbm9kZV90eXBlID0gJycsIGFyZywgb3V0cHV0ID0gW10sIGksIGssIG1hdGNoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICBub2RlX3R5cGUgPSBnZXRfdHlwZShwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBvdXRwdXQucHVzaChwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlX3R5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICBtYXRjaCA9IHBhcnNlX3RyZWVbaV07IC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICBpZiAobWF0Y2hbMl0pIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IG1hdGNoWzJdLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xuICAgICAgICAgICAgICAgIHRocm93KHNwcmludGYoJ1tzcHJpbnRmXSBwcm9wZXJ0eSBcIiVzXCIgZG9lcyBub3QgZXhpc3QnLCBtYXRjaFsyXVtrXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKG1hdGNoWzFdKSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgYXJnID0gYXJndlttYXRjaFsxXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICgvW15zXS8udGVzdChtYXRjaFs4XSkgJiYgKGdldF90eXBlKGFyZykgIT0gJ251bWJlcicpKSB7XG4gICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gZXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJXMnLCBnZXRfdHlwZShhcmcpKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSmVkIEVESVRcbiAgICAgICAgICBpZiAoIHR5cGVvZiBhcmcgPT0gJ3VuZGVmaW5lZCcgfHwgYXJnID09PSBudWxsICkge1xuICAgICAgICAgICAgYXJnID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEplZCBFRElUXG5cbiAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzhdKSB7XG4gICAgICAgICAgICBjYXNlICdiJzogYXJnID0gYXJnLnRvU3RyaW5nKDIpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2MnOiBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZCc6IGFyZyA9IHBhcnNlSW50KGFyZywgMTApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2UnOiBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZic6IGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ28nOiBhcmcgPSBhcmcudG9TdHJpbmcoOCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncyc6IGFyZyA9ICgoYXJnID0gU3RyaW5nKGFyZykpICYmIG1hdGNoWzddID8gYXJnLnN1YnN0cmluZygwLCBtYXRjaFs3XSkgOiBhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3UnOiBhcmcgPSBNYXRoLmFicyhhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhcmcgPSAoL1tkZWZdLy50ZXN0KG1hdGNoWzhdKSAmJiBtYXRjaFszXSAmJiBhcmcgPj0gMCA/ICcrJysgYXJnIDogYXJnKTtcbiAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PSAnMCcgPyAnMCcgOiBtYXRjaFs0XS5jaGFyQXQoMSkgOiAnICc7XG4gICAgICAgICAgcGFkX2xlbmd0aCA9IG1hdGNoWzZdIC0gU3RyaW5nKGFyZykubGVuZ3RoO1xuICAgICAgICAgIHBhZCA9IG1hdGNoWzZdID8gc3RyX3JlcGVhdChwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoKSA6ICcnO1xuICAgICAgICAgIG91dHB1dC5wdXNoKG1hdGNoWzVdID8gYXJnICsgcGFkIDogcGFkICsgYXJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5jYWNoZSA9IHt9O1xuXG4gICAgc3RyX2Zvcm1hdC5wYXJzZSA9IGZ1bmN0aW9uKGZtdCkge1xuICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoID0gW10sIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMDtcbiAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgIGlmICgobWF0Y2ggPSAvXlteXFx4MjVdKy8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjV7Mn0vLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZm9zdXhYXSkvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICBhcmdfbmFtZXMgfD0gMTtcbiAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL14oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL15cXC4oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFxbKFxcZCspXFxdLy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhyb3coJ1tzcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgIH1cbiAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VfdHJlZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0cl9mb3JtYXQ7XG4gIH0pKCk7XG5cbiAgdmFyIHZzcHJpbnRmID0gZnVuY3Rpb24oZm10LCBhcmd2KSB7XG4gICAgYXJndi51bnNoaWZ0KGZtdCk7XG4gICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgYXJndik7XG4gIH07XG5cbiAgSmVkLnBhcnNlX3BsdXJhbCA9IGZ1bmN0aW9uICggcGx1cmFsX2Zvcm1zLCBuICkge1xuICAgIHBsdXJhbF9mb3JtcyA9IHBsdXJhbF9mb3Jtcy5yZXBsYWNlKC9uL2csIG4pO1xuICAgIHJldHVybiBKZWQucGFyc2VfZXhwcmVzc2lvbihwbHVyYWxfZm9ybXMpO1xuICB9O1xuXG4gIEplZC5zcHJpbnRmID0gZnVuY3Rpb24gKCBmbXQsIGFyZ3MgKSB7XG4gICAgaWYgKCB7fS50b1N0cmluZy5jYWxsKCBhcmdzICkgPT0gJ1tvYmplY3QgQXJyYXldJyApIHtcbiAgICAgIHJldHVybiB2c3ByaW50ZiggZm10LCBbXS5zbGljZS5jYWxsKGFyZ3MpICk7XG4gICAgfVxuICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSApO1xuICB9O1xuXG4gIEplZC5wcm90b3R5cGUuc3ByaW50ZiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSmVkLnNwcmludGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgLy8gRU5EIHNwcmludGYgSW1wbGVtZW50YXRpb25cblxuICAvLyBTdGFydCB0aGUgUGx1cmFsIGZvcm1zIHNlY3Rpb25cbiAgLy8gVGhpcyBpcyBhIGZ1bGwgcGx1cmFsIGZvcm0gZXhwcmVzc2lvbiBwYXJzZXIuIEl0IGlzIHVzZWQgdG8gYXZvaWRcbiAgLy8gcnVubmluZyAnZXZhbCcgb3IgJ25ldyBGdW5jdGlvbicgZGlyZWN0bHkgYWdhaW5zdCB0aGUgcGx1cmFsXG4gIC8vIGZvcm1zLlxuICAvL1xuICAvLyBUaGlzIGNhbiBiZSBpbXBvcnRhbnQgaWYgeW91IGdldCB0cmFuc2xhdGlvbnMgZG9uZSB0aHJvdWdoIGEgM3JkXG4gIC8vIHBhcnR5IHZlbmRvci4gSSBlbmNvdXJhZ2UgeW91IHRvIHVzZSB0aGlzIGluc3RlYWQsIGhvd2V2ZXIsIElcbiAgLy8gYWxzbyB3aWxsIHByb3ZpZGUgYSAncHJlY29tcGlsZXInIHRoYXQgeW91IGNhbiB1c2UgYXQgYnVpbGQgdGltZVxuICAvLyB0byBvdXRwdXQgdmFsaWQvc2FmZSBmdW5jdGlvbiByZXByZXNlbnRhdGlvbnMgb2YgdGhlIHBsdXJhbCBmb3JtXG4gIC8vIGV4cHJlc3Npb25zLiBUaGlzIG1lYW5zIHlvdSBjYW4gYnVpbGQgdGhpcyBjb2RlIG91dCBmb3IgdGhlIG1vc3RcbiAgLy8gcGFydC5cbiAgSmVkLlBGID0ge307XG5cbiAgSmVkLlBGLnBhcnNlID0gZnVuY3Rpb24gKCBwICkge1xuICAgIHZhciBwbHVyYWxfc3RyID0gSmVkLlBGLmV4dHJhY3RQbHVyYWxFeHByKCBwICk7XG4gICAgcmV0dXJuIEplZC5QRi5wYXJzZXIucGFyc2UuY2FsbChKZWQuUEYucGFyc2VyLCBwbHVyYWxfc3RyKTtcbiAgfTtcblxuICBKZWQuUEYuY29tcGlsZSA9IGZ1bmN0aW9uICggcCApIHtcbiAgICAvLyBIYW5kbGUgdHJ1ZXMgYW5kIGZhbHNlcyBhcyAwIGFuZCAxXG4gICAgZnVuY3Rpb24gaW1wbHkoIHZhbCApIHtcbiAgICAgIHJldHVybiAodmFsID09PSB0cnVlID8gMSA6IHZhbCA/IHZhbCA6IDApO1xuICAgIH1cblxuICAgIHZhciBhc3QgPSBKZWQuUEYucGFyc2UoIHAgKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuICAgICAgcmV0dXJuIGltcGx5KCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdCApKCBuICkgKTtcbiAgICB9O1xuICB9O1xuXG4gIEplZC5QRi5pbnRlcnByZXRlciA9IGZ1bmN0aW9uICggYXN0ICkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICB2YXIgcmVzO1xuICAgICAgc3dpdGNoICggYXN0LnR5cGUgKSB7XG4gICAgICAgIGNhc2UgJ0dST1VQJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QuZXhwciApKCBuICk7XG4gICAgICAgIGNhc2UgJ1RFUk5BUlknOlxuICAgICAgICAgIGlmICggSmVkLlBGLmludGVycHJldGVyKCBhc3QuZXhwciApKCBuICkgKSB7XG4gICAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QudHJ1dGh5ICkoIG4gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmZhbHNleSApKCBuICk7XG4gICAgICAgIGNhc2UgJ09SJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgfHwgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdBTkQnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAmJiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0xUJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPCBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0dUJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0xURSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIDw9IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnR1RFJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgPj0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdFUSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID09IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTkVRJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgIT0gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdNT0QnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSAlIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnVkFSJzpcbiAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgY2FzZSAnTlVNJzpcbiAgICAgICAgICByZXR1cm4gYXN0LnZhbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFRva2VuIGZvdW5kLlwiKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIEplZC5QRi5leHRyYWN0UGx1cmFsRXhwciA9IGZ1bmN0aW9uICggcCApIHtcbiAgICAvLyB0cmltIGZpcnN0XG4gICAgcCA9IHAucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG5cbiAgICBpZiAoISAvO1xccyokLy50ZXN0KHApKSB7XG4gICAgICBwID0gcC5jb25jYXQoJzsnKTtcbiAgICB9XG5cbiAgICB2YXIgbnBsdXJhbHNfcmUgPSAvbnBsdXJhbHNcXD0oXFxkKyk7LyxcbiAgICAgICAgcGx1cmFsX3JlID0gL3BsdXJhbFxcPSguKik7LyxcbiAgICAgICAgbnBsdXJhbHNfbWF0Y2hlcyA9IHAubWF0Y2goIG5wbHVyYWxzX3JlICksXG4gICAgICAgIHJlcyA9IHt9LFxuICAgICAgICBwbHVyYWxfbWF0Y2hlcztcblxuICAgIC8vIEZpbmQgdGhlIG5wbHVyYWxzIG51bWJlclxuICAgIGlmICggbnBsdXJhbHNfbWF0Y2hlcy5sZW5ndGggPiAxICkge1xuICAgICAgcmVzLm5wbHVyYWxzID0gbnBsdXJhbHNfbWF0Y2hlc1sxXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25wbHVyYWxzIG5vdCBmb3VuZCBpbiBwbHVyYWxfZm9ybXMgc3RyaW5nOiAnICsgcCApO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSB0aGF0IGRhdGEgdG8gZ2V0IHRvIHRoZSBmb3JtdWxhXG4gICAgcCA9IHAucmVwbGFjZSggbnBsdXJhbHNfcmUsIFwiXCIgKTtcbiAgICBwbHVyYWxfbWF0Y2hlcyA9IHAubWF0Y2goIHBsdXJhbF9yZSApO1xuXG4gICAgaWYgKCEoIHBsdXJhbF9tYXRjaGVzICYmIHBsdXJhbF9tYXRjaGVzLmxlbmd0aCA+IDEgKSApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHBsdXJhbGAgZXhwcmVzc2lvbiBub3QgZm91bmQ6ICcgKyBwKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsdXJhbF9tYXRjaGVzWyAxIF07XG4gIH07XG5cbiAgLyogSmlzb24gZ2VuZXJhdGVkIHBhcnNlciAqL1xuICBKZWQuUEYucGFyc2VyID0gKGZ1bmN0aW9uKCl7XG5cbnZhciBwYXJzZXIgPSB7dHJhY2U6IGZ1bmN0aW9uIHRyYWNlKCkgeyB9LFxueXk6IHt9LFxuc3ltYm9sc186IHtcImVycm9yXCI6MixcImV4cHJlc3Npb25zXCI6MyxcImVcIjo0LFwiRU9GXCI6NSxcIj9cIjo2LFwiOlwiOjcsXCJ8fFwiOjgsXCImJlwiOjksXCI8XCI6MTAsXCI8PVwiOjExLFwiPlwiOjEyLFwiPj1cIjoxMyxcIiE9XCI6MTQsXCI9PVwiOjE1LFwiJVwiOjE2LFwiKFwiOjE3LFwiKVwiOjE4LFwiblwiOjE5LFwiTlVNQkVSXCI6MjAsXCIkYWNjZXB0XCI6MCxcIiRlbmRcIjoxfSxcbnRlcm1pbmFsc186IHsyOlwiZXJyb3JcIiw1OlwiRU9GXCIsNjpcIj9cIiw3OlwiOlwiLDg6XCJ8fFwiLDk6XCImJlwiLDEwOlwiPFwiLDExOlwiPD1cIiwxMjpcIj5cIiwxMzpcIj49XCIsMTQ6XCIhPVwiLDE1OlwiPT1cIiwxNjpcIiVcIiwxNzpcIihcIiwxODpcIilcIiwxOTpcIm5cIiwyMDpcIk5VTUJFUlwifSxcbnByb2R1Y3Rpb25zXzogWzAsWzMsMl0sWzQsNV0sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsM10sWzQsMV0sWzQsMV1dLFxucGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCx5eWxlbmcseXlsaW5lbm8seXkseXlzdGF0ZSwkJCxfJCkge1xuXG52YXIgJDAgPSAkJC5sZW5ndGggLSAxO1xuc3dpdGNoICh5eXN0YXRlKSB7XG5jYXNlIDE6IHJldHVybiB7IHR5cGUgOiAnR1JPVVAnLCBleHByOiAkJFskMC0xXSB9O1xuYnJlYWs7XG5jYXNlIDI6dGhpcy4kID0geyB0eXBlOiAnVEVSTkFSWScsIGV4cHI6ICQkWyQwLTRdLCB0cnV0aHkgOiAkJFskMC0yXSwgZmFsc2V5OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAzOnRoaXMuJCA9IHsgdHlwZTogXCJPUlwiLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDQ6dGhpcy4kID0geyB0eXBlOiBcIkFORFwiLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDU6dGhpcy4kID0geyB0eXBlOiAnTFQnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDY6dGhpcy4kID0geyB0eXBlOiAnTFRFJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA3OnRoaXMuJCA9IHsgdHlwZTogJ0dUJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA4OnRoaXMuJCA9IHsgdHlwZTogJ0dURScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgOTp0aGlzLiQgPSB7IHR5cGU6ICdORVEnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDEwOnRoaXMuJCA9IHsgdHlwZTogJ0VRJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMTp0aGlzLiQgPSB7IHR5cGU6ICdNT0QnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDEyOnRoaXMuJCA9IHsgdHlwZTogJ0dST1VQJywgZXhwcjogJCRbJDAtMV0gfTtcbmJyZWFrO1xuY2FzZSAxMzp0aGlzLiQgPSB7IHR5cGU6ICdWQVInIH07XG5icmVhaztcbmNhc2UgMTQ6dGhpcy4kID0geyB0eXBlOiAnTlVNJywgdmFsOiBOdW1iZXIoeXl0ZXh0KSB9O1xuYnJlYWs7XG59XG59LFxudGFibGU6IFt7MzoxLDQ6MiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezE6WzNdfSx7NTpbMSw2XSw2OlsxLDddLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl19LHs0OjE3LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NTpbMiwxM10sNjpbMiwxM10sNzpbMiwxM10sODpbMiwxM10sOTpbMiwxM10sMTA6WzIsMTNdLDExOlsyLDEzXSwxMjpbMiwxM10sMTM6WzIsMTNdLDE0OlsyLDEzXSwxNTpbMiwxM10sMTY6WzIsMTNdLDE4OlsyLDEzXX0sezU6WzIsMTRdLDY6WzIsMTRdLDc6WzIsMTRdLDg6WzIsMTRdLDk6WzIsMTRdLDEwOlsyLDE0XSwxMTpbMiwxNF0sMTI6WzIsMTRdLDEzOlsyLDE0XSwxNDpbMiwxNF0sMTU6WzIsMTRdLDE2OlsyLDE0XSwxODpbMiwxNF19LHsxOlsyLDFdfSx7NDoxOCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MTksMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIwLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMSwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjIsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIzLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjUsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI2LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezY6WzEsN10sODpbMSw4XSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMSwyOF19LHs2OlsxLDddLDc6WzEsMjldLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl19LHs1OlsyLDNdLDY6WzIsM10sNzpbMiwzXSw4OlsyLDNdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDNdfSx7NTpbMiw0XSw2OlsyLDRdLDc6WzIsNF0sODpbMiw0XSw5OlsyLDRdLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiw0XX0sezU6WzIsNV0sNjpbMiw1XSw3OlsyLDVdLDg6WzIsNV0sOTpbMiw1XSwxMDpbMiw1XSwxMTpbMiw1XSwxMjpbMiw1XSwxMzpbMiw1XSwxNDpbMiw1XSwxNTpbMiw1XSwxNjpbMSwxNl0sMTg6WzIsNV19LHs1OlsyLDZdLDY6WzIsNl0sNzpbMiw2XSw4OlsyLDZdLDk6WzIsNl0sMTA6WzIsNl0sMTE6WzIsNl0sMTI6WzIsNl0sMTM6WzIsNl0sMTQ6WzIsNl0sMTU6WzIsNl0sMTY6WzEsMTZdLDE4OlsyLDZdfSx7NTpbMiw3XSw2OlsyLDddLDc6WzIsN10sODpbMiw3XSw5OlsyLDddLDEwOlsyLDddLDExOlsyLDddLDEyOlsyLDddLDEzOlsyLDddLDE0OlsyLDddLDE1OlsyLDddLDE2OlsxLDE2XSwxODpbMiw3XX0sezU6WzIsOF0sNjpbMiw4XSw3OlsyLDhdLDg6WzIsOF0sOTpbMiw4XSwxMDpbMiw4XSwxMTpbMiw4XSwxMjpbMiw4XSwxMzpbMiw4XSwxNDpbMiw4XSwxNTpbMiw4XSwxNjpbMSwxNl0sMTg6WzIsOF19LHs1OlsyLDldLDY6WzIsOV0sNzpbMiw5XSw4OlsyLDldLDk6WzIsOV0sMTA6WzIsOV0sMTE6WzIsOV0sMTI6WzIsOV0sMTM6WzIsOV0sMTQ6WzIsOV0sMTU6WzIsOV0sMTY6WzEsMTZdLDE4OlsyLDldfSx7NTpbMiwxMF0sNjpbMiwxMF0sNzpbMiwxMF0sODpbMiwxMF0sOTpbMiwxMF0sMTA6WzIsMTBdLDExOlsyLDEwXSwxMjpbMiwxMF0sMTM6WzIsMTBdLDE0OlsyLDEwXSwxNTpbMiwxMF0sMTY6WzEsMTZdLDE4OlsyLDEwXX0sezU6WzIsMTFdLDY6WzIsMTFdLDc6WzIsMTFdLDg6WzIsMTFdLDk6WzIsMTFdLDEwOlsyLDExXSwxMTpbMiwxMV0sMTI6WzIsMTFdLDEzOlsyLDExXSwxNDpbMiwxMV0sMTU6WzIsMTFdLDE2OlsyLDExXSwxODpbMiwxMV19LHs1OlsyLDEyXSw2OlsyLDEyXSw3OlsyLDEyXSw4OlsyLDEyXSw5OlsyLDEyXSwxMDpbMiwxMl0sMTE6WzIsMTJdLDEyOlsyLDEyXSwxMzpbMiwxMl0sMTQ6WzIsMTJdLDE1OlsyLDEyXSwxNjpbMiwxMl0sMTg6WzIsMTJdfSx7NDozMCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezU6WzIsMl0sNjpbMSw3XSw3OlsyLDJdLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsMl19XSxcbmRlZmF1bHRBY3Rpb25zOiB7NjpbMiwxXX0sXG5wYXJzZUVycm9yOiBmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xufSxcbnBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgc3RhY2sgPSBbMF0sXG4gICAgICAgIHZzdGFjayA9IFtudWxsXSwgLy8gc2VtYW50aWMgdmFsdWUgc3RhY2tcbiAgICAgICAgbHN0YWNrID0gW10sIC8vIGxvY2F0aW9uIHN0YWNrXG4gICAgICAgIHRhYmxlID0gdGhpcy50YWJsZSxcbiAgICAgICAgeXl0ZXh0ID0gJycsXG4gICAgICAgIHl5bGluZW5vID0gMCxcbiAgICAgICAgeXlsZW5nID0gMCxcbiAgICAgICAgcmVjb3ZlcmluZyA9IDAsXG4gICAgICAgIFRFUlJPUiA9IDIsXG4gICAgICAgIEVPRiA9IDE7XG5cbiAgICAvL3RoaXMucmVkdWN0aW9uQ291bnQgPSB0aGlzLnNoaWZ0Q291bnQgPSAwO1xuXG4gICAgdGhpcy5sZXhlci5zZXRJbnB1dChpbnB1dCk7XG4gICAgdGhpcy5sZXhlci55eSA9IHRoaXMueXk7XG4gICAgdGhpcy55eS5sZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmxleGVyLnl5bGxvYyA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgdGhpcy5sZXhlci55eWxsb2MgPSB7fTtcbiAgICB2YXIgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICBsc3RhY2sucHVzaCh5eWxvYyk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMueXkucGFyc2VFcnJvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gdGhpcy55eS5wYXJzZUVycm9yO1xuXG4gICAgZnVuY3Rpb24gcG9wU3RhY2sgKG4pIHtcbiAgICAgICAgc3RhY2subGVuZ3RoID0gc3RhY2subGVuZ3RoIC0gMipuO1xuICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG4gICAgICAgIGxzdGFjay5sZW5ndGggPSBsc3RhY2subGVuZ3RoIC0gbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsZXgoKSB7XG4gICAgICAgIHZhciB0b2tlbjtcbiAgICAgICAgdG9rZW4gPSBzZWxmLmxleGVyLmxleCgpIHx8IDE7IC8vICRlbmQgPSAxXG4gICAgICAgIC8vIGlmIHRva2VuIGlzbid0IGl0cyBudW1lcmljIHZhbHVlLCBjb252ZXJ0XG4gICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHNlbGYuc3ltYm9sc19bdG9rZW5dIHx8IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG5cbiAgICB2YXIgc3ltYm9sLCBwcmVFcnJvclN5bWJvbCwgc3RhdGUsIGFjdGlvbiwgYSwgciwgeXl2YWw9e30scCxsZW4sbmV3U3RhdGUsIGV4cGVjdGVkO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIC8vIHJldHJlaXZlIHN0YXRlIG51bWJlciBmcm9tIHRvcCBvZiBzdGFja1xuICAgICAgICBzdGF0ZSA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcblxuICAgICAgICAvLyB1c2UgZGVmYXVsdCBhY3Rpb25zIGlmIGF2YWlsYWJsZVxuICAgICAgICBpZiAodGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV0pIHtcbiAgICAgICAgICAgIGFjdGlvbiA9IHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgLy8gcmVhZCBhY3Rpb24gZm9yIGN1cnJlbnQgc3RhdGUgYW5kIGZpcnN0IGlucHV0XG4gICAgICAgICAgICBhY3Rpb24gPSB0YWJsZVtzdGF0ZV0gJiYgdGFibGVbc3RhdGVdW3N5bWJvbF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgcGFyc2UgZXJyb3JcbiAgICAgICAgX2hhbmRsZV9lcnJvcjpcbiAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICd1bmRlZmluZWQnIHx8ICFhY3Rpb24ubGVuZ3RoIHx8ICFhY3Rpb25bMF0pIHtcblxuICAgICAgICAgICAgaWYgKCFyZWNvdmVyaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVwb3J0IGVycm9yXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHAgaW4gdGFibGVbc3RhdGVdKSBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkLnB1c2goXCInXCIrdGhpcy50ZXJtaW5hbHNfW3BdK1wiJ1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGVyclN0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnNob3dQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnKyh5eWxpbmVubysxKStcIjpcXG5cIit0aGlzLmxleGVyLnNob3dQb3NpdGlvbigpK1wiXFxuRXhwZWN0aW5nIFwiK2V4cGVjdGVkLmpvaW4oJywgJykgKyBcIiwgZ290ICdcIiArIHRoaXMudGVybWluYWxzX1tzeW1ib2xdKyBcIidcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnKyh5eWxpbmVubysxKStcIjogVW5leHBlY3RlZCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbCA9PSAxIC8qRU9GKi8gPyBcImVuZCBvZiBpbnB1dFwiIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXCInXCIrKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkrXCInXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUVycm9yKGVyclN0cixcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IHRoaXMubGV4ZXIubWF0Y2gsIHRva2VuOiB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wsIGxpbmU6IHRoaXMubGV4ZXIueXlsaW5lbm8sIGxvYzogeXlsb2MsIGV4cGVjdGVkOiBleHBlY3RlZH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBqdXN0IHJlY292ZXJlZCBmcm9tIGFub3RoZXIgZXJyb3JcbiAgICAgICAgICAgIGlmIChyZWNvdmVyaW5nID09IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3ltYm9sID09IEVPRikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyU3RyIHx8ICdQYXJzaW5nIGhhbHRlZC4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIGN1cnJlbnQgbG9va2FoZWFkIGFuZCBncmFiIGFub3RoZXJcbiAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJ5IHRvIHJlY292ZXIgZnJvbSBlcnJvclxuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZXJyb3IgcmVjb3ZlcnkgcnVsZSBpbiB0aGlzIHN0YXRlXG4gICAgICAgICAgICAgICAgaWYgKChURVJST1IudG9TdHJpbmcoKSkgaW4gdGFibGVbc3RhdGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyU3RyIHx8ICdQYXJzaW5nIGhhbHRlZC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9wU3RhY2soMSk7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZUVycm9yU3ltYm9sID0gc3ltYm9sOyAvLyBzYXZlIHRoZSBsb29rYWhlYWQgdG9rZW5cbiAgICAgICAgICAgIHN5bWJvbCA9IFRFUlJPUjsgICAgICAgICAvLyBpbnNlcnQgZ2VuZXJpYyBlcnJvciBzeW1ib2wgYXMgbmV3IGxvb2thaGVhZFxuICAgICAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgICAgICBhY3Rpb24gPSB0YWJsZVtzdGF0ZV0gJiYgdGFibGVbc3RhdGVdW1RFUlJPUl07XG4gICAgICAgICAgICByZWNvdmVyaW5nID0gMzsgLy8gYWxsb3cgMyByZWFsIHN5bWJvbHMgdG8gYmUgc2hpZnRlZCBiZWZvcmUgcmVwb3J0aW5nIGEgbmV3IGVycm9yXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIHNob3VsZG4ndCBoYXBwZW4sIHVubGVzcyByZXNvbHZlIGRlZmF1bHRzIGFyZSBvZmZcbiAgICAgICAgaWYgKGFjdGlvblswXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiAnK3N0YXRlKycsIHRva2VuOiAnK3N5bWJvbCk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGFjdGlvblswXSkge1xuXG4gICAgICAgICAgICBjYXNlIDE6IC8vIHNoaWZ0XG4gICAgICAgICAgICAgICAgLy90aGlzLnNoaWZ0Q291bnQrKztcblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh0aGlzLmxleGVyLnl5dGV4dCk7XG4gICAgICAgICAgICAgICAgbHN0YWNrLnB1c2godGhpcy5sZXhlci55eWxsb2MpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goYWN0aW9uWzFdKTsgLy8gcHVzaCBzdGF0ZVxuICAgICAgICAgICAgICAgIHN5bWJvbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkgeyAvLyBub3JtYWwgZXhlY3V0aW9uL25vIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHl5bGVuZyA9IHRoaXMubGV4ZXIueXlsZW5nO1xuICAgICAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuICAgICAgICAgICAgICAgICAgICB5eWxvYyA9IHRoaXMubGV4ZXIueXlsbG9jO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvdmVyaW5nLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gZXJyb3IganVzdCBvY2N1cnJlZCwgcmVzdW1lIG9sZCBsb29rYWhlYWQgZi8gYmVmb3JlIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHN5bWJvbCA9IHByZUVycm9yU3ltYm9sO1xuICAgICAgICAgICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDI6IC8vIHJlZHVjZVxuICAgICAgICAgICAgICAgIC8vdGhpcy5yZWR1Y3Rpb25Db3VudCsrO1xuXG4gICAgICAgICAgICAgICAgbGVuID0gdGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVsxXTtcblxuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gc2VtYW50aWMgYWN0aW9uXG4gICAgICAgICAgICAgICAgeXl2YWwuJCA9IHZzdGFja1t2c3RhY2subGVuZ3RoLWxlbl07IC8vIGRlZmF1bHQgdG8gJCQgPSAkMVxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbG9jYXRpb24sIHVzZXMgZmlyc3QgdG9rZW4gZm9yIGZpcnN0cywgbGFzdCBmb3IgbGFzdHNcbiAgICAgICAgICAgICAgICB5eXZhbC5fJCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGgtKGxlbnx8MSldLmZpcnN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGgtMV0ubGFzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoLShsZW58fDEpXS5maXJzdF9jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0xXS5sYXN0X2NvbHVtblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgciA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHl5dmFsLCB5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHRoaXMueXksIGFjdGlvblsxXSwgdnN0YWNrLCBsc3RhY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwb3Agb2ZmIHN0YWNrXG4gICAgICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLnNsaWNlKDAsLTEqbGVuKjIpO1xuICAgICAgICAgICAgICAgICAgICB2c3RhY2sgPSB2c3RhY2suc2xpY2UoMCwgLTEqbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrID0gbHN0YWNrLnNsaWNlKDAsIC0xKmxlbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzBdKTsgICAgLy8gcHVzaCBub250ZXJtaW5hbCAocmVkdWNlKVxuICAgICAgICAgICAgICAgIHZzdGFjay5wdXNoKHl5dmFsLiQpO1xuICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHl5dmFsLl8kKTtcbiAgICAgICAgICAgICAgICAvLyBnb3RvIG5ldyBzdGF0ZSA9IHRhYmxlW1NUQVRFXVtOT05URVJNSU5BTF1cbiAgICAgICAgICAgICAgICBuZXdTdGF0ZSA9IHRhYmxlW3N0YWNrW3N0YWNrLmxlbmd0aC0yXV1bc3RhY2tbc3RhY2subGVuZ3RoLTFdXTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5ld1N0YXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAzOiAvLyBhY2NlcHRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59fTsvKiBKaXNvbiBnZW5lcmF0ZWQgbGV4ZXIgKi9cbnZhciBsZXhlciA9IChmdW5jdGlvbigpe1xuXG52YXIgbGV4ZXIgPSAoe0VPRjoxLFxucGFyc2VFcnJvcjpmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuICAgICAgICBpZiAodGhpcy55eS5wYXJzZUVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnl5LnBhcnNlRXJyb3Ioc3RyLCBoYXNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuICAgICAgICB9XG4gICAgfSxcbnNldElucHV0OmZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgICAgICB0aGlzLl9tb3JlID0gdGhpcy5fbGVzcyA9IHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnl5bGluZW5vID0gdGhpcy55eWxlbmcgPSAwO1xuICAgICAgICB0aGlzLnl5dGV4dCA9IHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2ggPSAnJztcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjayA9IFsnSU5JVElBTCddO1xuICAgICAgICB0aGlzLnl5bGxvYyA9IHtmaXJzdF9saW5lOjEsZmlyc3RfY29sdW1uOjAsbGFzdF9saW5lOjEsbGFzdF9jb2x1bW46MH07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5pbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjaCA9IHRoaXMuX2lucHV0WzBdO1xuICAgICAgICB0aGlzLnl5dGV4dCs9Y2g7XG4gICAgICAgIHRoaXMueXlsZW5nKys7XG4gICAgICAgIHRoaXMubWF0Y2grPWNoO1xuICAgICAgICB0aGlzLm1hdGNoZWQrPWNoO1xuICAgICAgICB2YXIgbGluZXMgPSBjaC5tYXRjaCgvXFxuLyk7XG4gICAgICAgIGlmIChsaW5lcykgdGhpcy55eWxpbmVubysrO1xuICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKDEpO1xuICAgICAgICByZXR1cm4gY2g7XG4gICAgfSxcbnVucHV0OmZ1bmN0aW9uIChjaCkge1xuICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5tb3JlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5wYXN0SW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFzdCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIHRoaXMubWF0Y2gubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIChwYXN0Lmxlbmd0aCA+IDIwID8gJy4uLic6JycpICsgcGFzdC5zdWJzdHIoLTIwKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgfSxcbnVwY29taW5nSW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmV4dCA9IHRoaXMubWF0Y2g7XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA8IDIwKSB7XG4gICAgICAgICAgICBuZXh0ICs9IHRoaXMuX2lucHV0LnN1YnN0cigwLCAyMC1uZXh0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0LnN1YnN0cigwLDIwKSsobmV4dC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG5zaG93UG9zaXRpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJlID0gdGhpcy5wYXN0SW5wdXQoKTtcbiAgICAgICAgdmFyIGMgPSBuZXcgQXJyYXkocHJlLmxlbmd0aCArIDEpLmpvaW4oXCItXCIpO1xuICAgICAgICByZXR1cm4gcHJlICsgdGhpcy51cGNvbWluZ0lucHV0KCkgKyBcIlxcblwiICsgYytcIl5cIjtcbiAgICB9LFxubmV4dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2lucHV0KSB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciB0b2tlbixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgY29sLFxuICAgICAgICAgICAgbGluZXM7XG4gICAgICAgIGlmICghdGhpcy5fbW9yZSkge1xuICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSAnJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaT0wO2kgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSB0aGlzLl9pbnB1dC5tYXRjaCh0aGlzLnJ1bGVzW3J1bGVzW2ldXSk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBsaW5lcyA9IG1hdGNoWzBdLm1hdGNoKC9cXG4uKi9nKTtcbiAgICAgICAgICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8gKz0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jID0ge2ZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8rMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/IGxpbmVzW2xpbmVzLmxlbmd0aC0xXS5sZW5ndGgtMSA6IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uICsgbWF0Y2hbMF0ubGVuZ3RofVxuICAgICAgICAgICAgICAgIHRoaXMueXl0ZXh0ICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2ggKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVzID0gbWF0Y2g7XG4gICAgICAgICAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9yZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnl5LCB0aGlzLCBydWxlc1tpXSx0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTFdKTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW5wdXQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcignTGV4aWNhbCBlcnJvciBvbiBsaW5lICcrKHRoaXMueXlsaW5lbm8rMSkrJy4gVW5yZWNvZ25pemVkIHRleHQuXFxuJyt0aGlzLnNob3dQb3NpdGlvbigpLFxuICAgICAgICAgICAgICAgICAgICB7dGV4dDogXCJcIiwgdG9rZW46IG51bGwsIGxpbmU6IHRoaXMueXlsaW5lbm99KTtcbiAgICAgICAgfVxuICAgIH0sXG5sZXg6ZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xuICAgICAgICBpZiAodHlwZW9mIHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxleCgpO1xuICAgICAgICB9XG4gICAgfSxcbmJlZ2luOmZ1bmN0aW9uIGJlZ2luKGNvbmRpdGlvbikge1xuICAgICAgICB0aGlzLmNvbmRpdGlvblN0YWNrLnB1c2goY29uZGl0aW9uKTtcbiAgICB9LFxucG9wU3RhdGU6ZnVuY3Rpb24gcG9wU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrLnBvcCgpO1xuICAgIH0sXG5fY3VycmVudFJ1bGVzOmZ1bmN0aW9uIF9jdXJyZW50UnVsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnNbdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0xXV0ucnVsZXM7XG4gICAgfSxcbnRvcFN0YXRlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMl07XG4gICAgfSxcbnB1c2hTdGF0ZTpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5iZWdpbihjb25kaXRpb24pO1xuICAgIH19KTtcbmxleGVyLnBlcmZvcm1BY3Rpb24gPSBmdW5jdGlvbiBhbm9ueW1vdXMoeXkseXlfLCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMsWVlfU1RBUlQpIHtcblxudmFyIFlZU1RBVEU9WVlfU1RBUlQ7XG5zd2l0Y2goJGF2b2lkaW5nX25hbWVfY29sbGlzaW9ucykge1xuY2FzZSAwOi8qIHNraXAgd2hpdGVzcGFjZSAqL1xuYnJlYWs7XG5jYXNlIDE6cmV0dXJuIDIwXG5icmVhaztcbmNhc2UgMjpyZXR1cm4gMTlcbmJyZWFrO1xuY2FzZSAzOnJldHVybiA4XG5icmVhaztcbmNhc2UgNDpyZXR1cm4gOVxuYnJlYWs7XG5jYXNlIDU6cmV0dXJuIDZcbmJyZWFrO1xuY2FzZSA2OnJldHVybiA3XG5icmVhaztcbmNhc2UgNzpyZXR1cm4gMTFcbmJyZWFrO1xuY2FzZSA4OnJldHVybiAxM1xuYnJlYWs7XG5jYXNlIDk6cmV0dXJuIDEwXG5icmVhaztcbmNhc2UgMTA6cmV0dXJuIDEyXG5icmVhaztcbmNhc2UgMTE6cmV0dXJuIDE0XG5icmVhaztcbmNhc2UgMTI6cmV0dXJuIDE1XG5icmVhaztcbmNhc2UgMTM6cmV0dXJuIDE2XG5icmVhaztcbmNhc2UgMTQ6cmV0dXJuIDE3XG5icmVhaztcbmNhc2UgMTU6cmV0dXJuIDE4XG5icmVhaztcbmNhc2UgMTY6cmV0dXJuIDVcbmJyZWFrO1xuY2FzZSAxNzpyZXR1cm4gJ0lOVkFMSUQnXG5icmVhaztcbn1cbn07XG5sZXhlci5ydWxlcyA9IFsvXlxccysvLC9eWzAtOV0rKFxcLlswLTldKyk/XFxiLywvXm5cXGIvLC9eXFx8XFx8LywvXiYmLywvXlxcPy8sL146LywvXjw9LywvXj49LywvXjwvLC9ePi8sL14hPS8sL149PS8sL14lLywvXlxcKC8sL15cXCkvLC9eJC8sL14uL107XG5sZXhlci5jb25kaXRpb25zID0ge1wiSU5JVElBTFwiOntcInJ1bGVzXCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTddLFwiaW5jbHVzaXZlXCI6dHJ1ZX19O3JldHVybiBsZXhlcjt9KSgpXG5wYXJzZXIubGV4ZXIgPSBsZXhlcjtcbnJldHVybiBwYXJzZXI7XG59KSgpO1xuLy8gRW5kIHBhcnNlclxuXG4gIC8vIEhhbmRsZSBub2RlLCBhbWQsIGFuZCBnbG9iYWwgc3lzdGVtc1xuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBKZWQ7XG4gICAgfVxuICAgIGV4cG9ydHMuSmVkID0gSmVkO1xuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEplZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBMZWFrIGEgZ2xvYmFsIHJlZ2FyZGxlc3Mgb2YgbW9kdWxlIHN5c3RlbVxuICAgIHJvb3RbJ0plZCddID0gSmVkO1xuICB9XG5cbn0pKHRoaXMpO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQWRkcyB0aGUga2V5LXZhbHVlIGBwYWlyYCB0byBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXIgVGhlIGtleS12YWx1ZSBwYWlyIHRvIGFkZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG1hcGAuXG4gKi9cbmZ1bmN0aW9uIGFkZE1hcEVudHJ5KG1hcCwgcGFpcikge1xuICAvLyBEb24ndCByZXR1cm4gYG1hcC5zZXRgIGJlY2F1c2UgaXQncyBub3QgY2hhaW5hYmxlIGluIElFIDExLlxuICBtYXAuc2V0KHBhaXJbMF0sIHBhaXJbMV0pO1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1hcEVudHJ5O1xuIiwiLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gYHNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBtb2RpZnkuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhZGQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBzZXRgLlxuICovXG5mdW5jdGlvbiBhZGRTZXRFbnRyeShzZXQsIHZhbHVlKSB7XG4gIC8vIERvbid0IHJldHVybiBgc2V0LmFkZGAgYmVjYXVzZSBpdCdzIG5vdCBjaGFpbmFibGUgaW4gSUUgMTEuXG4gIHNldC5hZGQodmFsdWUpO1xuICByZXR1cm4gc2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFNldEVudHJ5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICBpZiAoaW5pdEFjY3VtICYmIGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gYXJyYXlbKytpbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCBhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UmVkdWNlO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGJhc2VBc3NpZ25JbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25JbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgY29weVN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzSW4nKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX0ZMQVRfRkxBRyA9IDIsXG4gICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0YVZpZXdUYWddID1cbmNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGVUYWddID1cbmNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3ltYm9sVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xuY2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgYW5kIGBfLmNsb25lRGVlcGAgd2hpY2ggdHJhY2tzXG4gKiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIERlZXAgY2xvbmVcbiAqICAyIC0gRmxhdHRlbiBpbmhlcml0ZWQgcHJvcGVydGllc1xuICogIDQgLSBDbG9uZSBzeW1ib2xzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgcGFyZW50IG9iamVjdCBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGFuZCB0aGVpciBjbG9uZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0LFxuICAgICAgaXNEZWVwID0gYml0bWFzayAmIENMT05FX0RFRVBfRkxBRyxcbiAgICAgIGlzRmxhdCA9IGJpdG1hc2sgJiBDTE9ORV9GTEFUX0ZMQUcsXG4gICAgICBpc0Z1bGwgPSBiaXRtYXNrICYgQ0xPTkVfU1lNQk9MU19GTEFHO1xuXG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QsIHN0YWNrKSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cbiAgICBpZiAoaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIHJlc3VsdCA9IChpc0ZsYXQgfHwgaXNGdW5jKSA/IHt9IDogaW5pdENsb25lT2JqZWN0KHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBpc0ZsYXRcbiAgICAgICAgICA/IGNvcHlTeW1ib2xzSW4odmFsdWUsIGJhc2VBc3NpZ25JbihyZXN1bHQsIHZhbHVlKSlcbiAgICAgICAgICA6IGNvcHlTeW1ib2xzKHZhbHVlLCBiYXNlQXNzaWduKHJlc3VsdCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjbG9uZWFibGVUYWdzW3RhZ10pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdCA/IHZhbHVlIDoge307XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBiYXNlQ2xvbmUsIGlzRGVlcCk7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2VzIGFuZCByZXR1cm4gaXRzIGNvcnJlc3BvbmRpbmcgY2xvbmUuXG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KHZhbHVlKTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfVxuICBzdGFjay5zZXQodmFsdWUsIHJlc3VsdCk7XG5cbiAgdmFyIGtleXNGdW5jID0gaXNGdWxsXG4gICAgPyAoaXNGbGF0ID8gZ2V0QWxsS2V5c0luIDogZ2V0QWxsS2V5cylcbiAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IGtleXNGdW5jKHZhbHVlKTtcbiAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzdWJWYWx1ZTtcbiAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90byBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbnZhciBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBvYmplY3QoKSB7fVxuICByZXR1cm4gZnVuY3Rpb24ocHJvdG8pIHtcbiAgICBpZiAoIWlzT2JqZWN0KHByb3RvKSkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBpZiAob2JqZWN0Q3JlYXRlKSB7XG4gICAgICByZXR1cm4gb2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICB9XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHZhciByZXN1bHQgPSBuZXcgb2JqZWN0O1xuICAgIG9iamVjdC5wcm90b3R5cGUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICB2YWx1ZSA9IE9iamVjdCh2YWx1ZSk7XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gdmFsdWUpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBhbGxvY1Vuc2FmZSA9IEJ1ZmZlciA/IEJ1ZmZlci5hbGxvY1Vuc2FmZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgIGBidWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge0J1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVCdWZmZXIoYnVmZmVyLCBpc0RlZXApIHtcbiAgaWYgKGlzRGVlcCkge1xuICAgIHJldHVybiBidWZmZXIuc2xpY2UoKTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFsbG9jVW5zYWZlID8gYWxsb2NVbnNhZmUobGVuZ3RoKSA6IG5ldyBidWZmZXIuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICBidWZmZXIuY29weShyZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsInZhciBhZGRNYXBFbnRyeSA9IHJlcXVpcmUoJy4vX2FkZE1hcEVudHJ5JyksXG4gICAgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIG1hcFRvQXJyYXkgPSByZXF1aXJlKCcuL19tYXBUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBtYXAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lTWFwKG1hcCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKG1hcFRvQXJyYXkobWFwKSwgQ0xPTkVfREVFUF9GTEFHKSA6IG1hcFRvQXJyYXkobWFwKTtcbiAgcmV0dXJuIGFycmF5UmVkdWNlKGFycmF5LCBhZGRNYXBFbnRyeSwgbmV3IG1hcC5jb25zdHJ1Y3Rvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVNYXA7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHJlZ2V4cGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWdleHAgVGhlIHJlZ2V4cCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCByZWdleHAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lUmVnRXhwKHJlZ2V4cCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IHJlZ2V4cC5jb25zdHJ1Y3RvcihyZWdleHAuc291cmNlLCByZUZsYWdzLmV4ZWMocmVnZXhwKSk7XG4gIHJlc3VsdC5sYXN0SW5kZXggPSByZWdleHAubGFzdEluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lUmVnRXhwO1xuIiwidmFyIGFkZFNldEVudHJ5ID0gcmVxdWlyZSgnLi9fYWRkU2V0RW50cnknKSxcbiAgICBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvbmVGdW5jIFRoZSBmdW5jdGlvbiB0byBjbG9uZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHNldC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTZXQoc2V0LCBpc0RlZXAsIGNsb25lRnVuYykge1xuICB2YXIgYXJyYXkgPSBpc0RlZXAgPyBjbG9uZUZ1bmMoc2V0VG9BcnJheShzZXQpLCBDTE9ORV9ERUVQX0ZMQUcpIDogc2V0VG9BcnJheShzZXQpO1xuICByZXR1cm4gYXJyYXlSZWR1Y2UoYXJyYXksIGFkZFNldEVudHJ5LCBuZXcgc2V0LmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpO1xuXG4vKipcbiAqIENvcGllcyBvd24gYW5kIGluaGVyaXRlZCBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9sc0luKHNvdXJjZSwgb2JqZWN0KSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHNvdXJjZSwgZ2V0U3ltYm9sc0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHNJbjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5cztcbiIsInZhciBiYXNlR2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRBbGxLZXlzJyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi9rZXlzSW4nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNJbiwgZ2V0U3ltYm9sc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzSW47XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSBuYXRpdmVHZXRTeW1ib2xzID8gb3ZlckFyZyhuYXRpdmVHZXRTeW1ib2xzLCBPYmplY3QpIDogc3R1YkFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgZ2V0U3ltYm9scyA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHMnKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHNJbjtcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVNYXAgPSByZXF1aXJlKCcuL19jbG9uZU1hcCcpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVNldCA9IHJlcXVpcmUoJy4vX2Nsb25lU2V0JyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGNsb25lRnVuYywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVNYXAob2JqZWN0LCBpc0RlZXAsIGNsb25lRnVuYyk7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIGNsb25lU2V0KG9iamVjdCwgaXNEZWVwLCBjbG9uZUZ1bmMpO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUgYW5kIG5vdCBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleSh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFRvQXJyYXk7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzSW47XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheSBvZiBpdHMgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb0FycmF5O1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCJ2YXIgbWVtb2l6ZUNhcHBlZCA9IHJlcXVpcmUoJy4vX21lbW9pemVDYXBwZWQnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlTGVhZGluZ0RvdCA9IC9eXFwuLyxcbiAgICByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAocmVMZWFkaW5nRG90LnRlc3Qoc3RyaW5nKSkge1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgfVxuICBzdHJpbmcucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1RvUGF0aDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2hhbGxvdyBjbG9uZSBvZiBgdmFsdWVgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZVxuICogW3N0cnVjdHVyZWQgY2xvbmUgYWxnb3JpdGhtXShodHRwczovL21kbi5pby9TdHJ1Y3R1cmVkX2Nsb25lX2FsZ29yaXRobSlcbiAqIGFuZCBzdXBwb3J0cyBjbG9uaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsIGRhdGUgb2JqZWN0cywgbWFwcyxcbiAqIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZFxuICogYXJyYXlzLiBUaGUgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgYXJndW1lbnRzYCBvYmplY3RzIGFyZSBjbG9uZWRcbiAqIGFzIHBsYWluIG9iamVjdHMuIEFuIGVtcHR5IG9iamVjdCBpcyByZXR1cm5lZCBmb3IgdW5jbG9uZWFibGUgdmFsdWVzIHN1Y2hcbiAqIGFzIGVycm9yIG9iamVjdHMsIGZ1bmN0aW9ucywgRE9NIG5vZGVzLCBhbmQgV2Vha01hcHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZURlZXBcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gKlxuICogdmFyIHNoYWxsb3cgPSBfLmNsb25lKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coc2hhbGxvd1swXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNsb25lKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX1NZTUJPTFNfRkxBRyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJ2YXIgYmFzZUhhcyA9IHJlcXVpcmUoJy4vX2Jhc2VIYXMnKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IHsgJ2InOiAyIH0gfTtcbiAqIHZhciBvdGhlciA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvdGhlciwgJ2EnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhcyhvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXM7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5c0luID0gcmVxdWlyZSgnLi9fYmFzZUtleXNJbicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgZmluZE1hdGNoaW5nUnVsZSA9IGZ1bmN0aW9uKHJ1bGVzLCB0ZXh0KXtcbiAgdmFyIGk7XG4gIGZvcihpPTA7IGk8cnVsZXMubGVuZ3RoOyBpKyspXG4gICAgaWYocnVsZXNbaV0ucmVnZXgudGVzdCh0ZXh0KSlcbiAgICAgIHJldHVybiBydWxlc1tpXTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbnZhciBmaW5kTWF4SW5kZXhBbmRSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaSwgcnVsZSwgbGFzdF9tYXRjaGluZ19ydWxlO1xuICBmb3IoaT0wOyBpPHRleHQubGVuZ3RoOyBpKyspe1xuICAgIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCB0ZXh0LnN1YnN0cmluZygwLCBpICsgMSkpO1xuICAgIGlmKHJ1bGUpXG4gICAgICBsYXN0X21hdGNoaW5nX3J1bGUgPSBydWxlO1xuICAgIGVsc2UgaWYobGFzdF9tYXRjaGluZ19ydWxlKVxuICAgICAgcmV0dXJuIHttYXhfaW5kZXg6IGksIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX07XG4gIH1cbiAgcmV0dXJuIGxhc3RfbWF0Y2hpbmdfcnVsZSA/IHttYXhfaW5kZXg6IHRleHQubGVuZ3RoLCBydWxlOiBsYXN0X21hdGNoaW5nX3J1bGV9IDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvblRva2VuX29yaWcpe1xuICB2YXIgYnVmZmVyID0gXCJcIjtcbiAgdmFyIHJ1bGVzID0gW107XG4gIHZhciBsaW5lID0gMTtcbiAgdmFyIGNvbCA9IDE7XG5cbiAgdmFyIG9uVG9rZW4gPSBmdW5jdGlvbihzcmMsIHR5cGUpe1xuICAgIG9uVG9rZW5fb3JpZyh7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgc3JjOiBzcmMsXG4gICAgICBsaW5lOiBsaW5lLFxuICAgICAgY29sOiBjb2xcbiAgICB9KTtcbiAgICB2YXIgbGluZXMgPSBzcmMuc3BsaXQoXCJcXG5cIik7XG4gICAgbGluZSArPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgIGNvbCA9IChsaW5lcy5sZW5ndGggPiAxID8gMSA6IGNvbCkgKyBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRSdWxlOiBmdW5jdGlvbihyZWdleCwgdHlwZSl7XG4gICAgICBydWxlcy5wdXNoKHtyZWdleDogcmVnZXgsIHR5cGU6IHR5cGV9KTtcbiAgICB9LFxuICAgIG9uVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICB2YXIgc3RyID0gYnVmZmVyICsgdGV4dDtcbiAgICAgIHZhciBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIHdoaWxlKG0gJiYgbS5tYXhfaW5kZXggIT09IHN0ci5sZW5ndGgpe1xuICAgICAgICBvblRva2VuKHN0ci5zdWJzdHJpbmcoMCwgbS5tYXhfaW5kZXgpLCBtLnJ1bGUudHlwZSk7XG5cbiAgICAgICAgLy9ub3cgZmluZCB0aGUgbmV4dCB0b2tlblxuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKG0ubWF4X2luZGV4KTtcbiAgICAgICAgbSA9IGZpbmRNYXhJbmRleEFuZFJ1bGUocnVsZXMsIHN0cik7XG4gICAgICB9XG4gICAgICBidWZmZXIgPSBzdHI7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZihidWZmZXIubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBydWxlID0gZmluZE1hdGNoaW5nUnVsZShydWxlcywgYnVmZmVyKTtcbiAgICAgIGlmKCFydWxlKXtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcInVuYWJsZSB0byB0b2tlbml6ZVwiKTtcbiAgICAgICAgZXJyLnRva2VuaXplcjIgPSB7XG4gICAgICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBjb2w6IGNvbFxuICAgICAgICB9O1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIG9uVG9rZW4oYnVmZmVyLCBydWxlLnR5cGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0RmFjZWJvb2tQcmV2aWV3OiByZXF1aXJlKCBcIi4vanMvZmFjZWJvb2tQcmV2aWV3XCIgKSxcblx0VHdpdHRlclByZXZpZXc6IHJlcXVpcmUoIFwiLi9qcy90d2l0dGVyUHJldmlld1wiIClcbn07XG4iLCJ2YXIgcGxhY2Vob2xkZXJUZW1wbGF0ZSA9IHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5pbWFnZVBsYWNlaG9sZGVyO1xuXG4vKipcbiAqIFNldHMgdGhlIHBsYWNlaG9sZGVyIHdpdGggYSBnaXZlbiB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VDb250YWluZXIgVGhlIGxvY2F0aW9uIHRvIHB1dCB0aGUgcGxhY2Vob2xkZXIgaW4uXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhY2Vob2xkZXIgVGhlIHZhbHVlIGZvciB0aGUgcGxhY2Vob2xkZXIuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzRXJyb3IgV2hlbiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGFuIGVycm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZGlmaWVyIEEgY3NzIGNsYXNzIG1vZGlmaWVyIHRvIGNoYW5nZSB0aGUgc3R5bGluZy5cbiAqL1xuZnVuY3Rpb24gc2V0SW1hZ2VQbGFjZWhvbGRlciggaW1hZ2VDb250YWluZXIsIHBsYWNlaG9sZGVyLCBpc0Vycm9yLCBtb2RpZmllciApIHtcblx0dmFyIGNsYXNzTmFtZXMgPSBbIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyXCIgXTtcblx0aXNFcnJvciA9IGlzRXJyb3IgfHwgZmFsc2U7XG5cdG1vZGlmaWVyID0gbW9kaWZpZXIgfHwgXCJcIjtcblxuXHRpZiAoIGlzRXJyb3IgKSB7XG5cdFx0Y2xhc3NOYW1lcy5wdXNoKCBcInNvY2lhbC1pbWFnZS1wbGFjZWhvbGRlci0tZXJyb3JcIiApO1xuXHR9XG5cblx0aWYgKCBcIlwiICE9PSBtb2RpZmllciApIHtcblx0XHRjbGFzc05hbWVzLnB1c2goIFwic29jaWFsLWltYWdlLXBsYWNlaG9sZGVyLS1cIiArIG1vZGlmaWVyICk7XG5cdH1cblxuXHRpbWFnZUNvbnRhaW5lci5pbm5lckhUTUwgPSBwbGFjZWhvbGRlclRlbXBsYXRlKCB7XG5cdFx0Y2xhc3NOYW1lOiBjbGFzc05hbWVzLmpvaW4oIFwiIFwiICksXG5cdFx0cGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyXG5cdH0gKTtcbn1cblxubW9kdWxlLmV4cG9ydHM9IHNldEltYWdlUGxhY2Vob2xkZXI7XG4iLCJ2YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2xhbmcvaXNFbXB0eVwiICk7XG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCBcImxvZGFzaC9mdW5jdGlvbi9kZWJvdW5jZVwiICk7XG5cbnZhciBzdHJpcEhUTUxUYWdzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MuanNcIiApO1xudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIgKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgZmllbGQgYW5kIHNldHMgdGhlIGV2ZW50cyBmb3IgdGhhdCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRGaWVsZCBUaGUgZmllbGQgdG8gcmVwcmVzZW50LlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fHVuZGVmaW5lZH0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGVkIGFmdGVyIGZpZWxkIGNoYW5nZS5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dEVsZW1lbnQoIGlucHV0RmllbGQsIHZhbHVlcywgY2FsbGJhY2sgKSB7XG5cdHRoaXMuaW5wdXRGaWVsZCA9IGlucHV0RmllbGQ7XG5cdHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHR0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG5cdHRoaXMuc2V0VmFsdWUoIHRoaXMuZ2V0SW5wdXRWYWx1ZSgpICk7XG5cblx0dGhpcy5iaW5kRXZlbnRzKCk7XG59XG5cbi8qKlxuICogQmluZHMgdGhlIGV2ZW50c1xuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0Ly8gU2V0IHRoZSBldmVudHMuXG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImtleWRvd25cIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5dXBcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblxuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJpbnB1dFwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJmb2N1c1wiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJibHVyXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIERvIHRoZSBjaGFuZ2UgZXZlbnRcbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuY2hhbmdlRXZlbnQgPSBkZWJvdW5jZSggZnVuY3Rpb24oKSB7XG5cdC8vIFdoZW4gdGhlcmUgaXMgYSBjYWxsYmFjayBydW4gaXQuXG5cdGlmICggdHlwZW9mIHRoaXMuX2NhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdHRoaXMuX2NhbGxiYWNrKCk7XG5cdH1cblxuXHR0aGlzLnNldFZhbHVlKCB0aGlzLmdldElucHV0VmFsdWUoKSApO1xufSwgMjUgKTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGN1cnJlbnQgZmllbGQgdmFsdWVcbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5nZXRJbnB1dFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmlucHV0RmllbGQudmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdHMgdGhlIGEgdmFsdWUgZm9yIHRoZSBwcmV2aWV3LiBJZiB2YWx1ZSBpcyBlbXB0eSBhIHNhbXBsZSB2YWx1ZSBpcyB1c2VkXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB0aXRsZSwgd2l0aG91dCBodG1sIHRhZ3MuXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZm9ybWF0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuXG5cdHZhbHVlID0gc3RyaXBIVE1MVGFncyggdmFsdWUgKTtcblxuXHQvLyBBcyBhbiB1bHRpbWF0ZSBmYWxsYmFjayBwcm92aWRlIHRoZSB1c2VyIHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLmZhbGxiYWNrO1xuXHR9XG5cblx0cmV0dXJuIHN0cmlwU3BhY2VzKCB2YWx1ZSApO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJuIHRoZSB2YWx1ZSBvciBnZXQgYSBmYWxsYmFjayBvbmUuXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHZhbHVlID0gdGhpcy52YWx1ZXMuY3VycmVudFZhbHVlO1xuXG5cdC8vIEZhbGxiYWNrIHRvIHRoZSBkZWZhdWx0IGlmIHZhbHVlIGlzIGVtcHR5LlxuXHRpZiAoIGlzRW1wdHkoIHZhbHVlICkgKSB7XG5cdFx0dmFsdWUgPSB0aGlzLnZhbHVlcy5kZWZhdWx0VmFsdWU7XG5cdH1cblxuXHQvLyBGb3IgcmVuZGVyaW5nIHdlIGNhbiBmYWxsYmFjayB0byB0aGUgcGxhY2Vob2xkZXIgYXMgd2VsbC5cblx0aWYgKCBpc0VtcHR5KCB2YWx1ZSApICkge1xuXHRcdHZhbHVlID0gdGhpcy52YWx1ZXMucGxhY2Vob2xkZXI7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY3VycmVudCB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0XG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdHRoaXMudmFsdWVzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dEVsZW1lbnQ7XG5cbiIsIi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cbnZhciBpc0VsZW1lbnQgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRWxlbWVudFwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2Nsb25lXCIgKTtcbnZhciBkZWZhdWx0c0RlZXAgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNEZWVwXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcblxudmFyIGltYWdlRGlzcGxheU1vZGUgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbWFnZURpc3BsYXlNb2RlXCIgKTtcbnZhciByZW5kZXJEZXNjcmlwdGlvbiA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL3JlbmRlckRlc2NyaXB0aW9uXCIgKTtcbnZhciBpbWFnZVBsYWNlaG9sZGVyICA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2ltYWdlUGxhY2Vob2xkZXJcIiApO1xudmFyIGJlbUFkZE1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyXCIgKTtcbnZhciBiZW1SZW1vdmVNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllclwiICk7XG5cbnZhciBUZXh0RmllbGQgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRJbnB1dFwiICk7XG52YXIgVGV4dEFyZWEgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRhcmVhXCIgKTtcblxudmFyIElucHV0RWxlbWVudCA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2lucHV0XCIgKTtcbnZhciBQcmV2aWV3RXZlbnRzID0gcmVxdWlyZSggXCIuL3ByZXZpZXcvZXZlbnRzXCIgKTtcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoIFwiLi90ZW1wbGF0ZXMuanNcIiApO1xudmFyIGZhY2Vib29rRWRpdG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tQcmV2aWV3O1xudmFyIGZhY2Vib29rQXV0aG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZXMuZmFjZWJvb2tBdXRob3I7XG5cbnZhciBmYWNlYm9va0RlZmF1bHRzID0ge1xuXHRkYXRhOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0YmFzZVVSTDogXCJleGFtcGxlLmNvbVwiLFxuXHRjYWxsYmFja3M6IHtcblx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbigpIHt9LFxuXHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRyZXR1cm4gdGl0bGU7XG5cdFx0fSxcblx0XHRtb2RpZnlEZXNjcmlwdGlvbjogZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRcdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHRcdH0sXG5cdFx0bW9kaWZ5SW1hZ2VVcmw6IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHR9XG5cdH1cbn07XG5cbnZhciBpbnB1dEZhY2Vib29rUHJldmlld0JpbmRpbmdzID0gW1xuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fdGl0bGUtLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwidGl0bGVcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiaW1hZ2VVcmxcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLWZhY2Vib29rXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiZGVzY3JpcHRpb25cIlxuXHR9XG5dO1xuXG52YXIgV0lEVEhfRkFDRUJPT0tfSU1BR0VfU01BTEwgPSAxNTg7XG52YXIgV0lEVEhfRkFDRUJPT0tfSU1BR0VfTEFSR0UgPSA0NzA7XG5cbnZhciBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfV0lEVEggPSAyMDA7XG52YXIgRkFDRUJPT0tfSU1BR0VfVE9PX1NNQUxMX0hFSUdIVCA9IDIwMDtcblxudmFyIEZBQ0VCT09LX0lNQUdFX1RIUkVTSE9MRF9XSURUSCA9IDYwMDtcbnZhciBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfSEVJR0hUID0gMzE1O1xuXG4vKipcbiAqIEBtb2R1bGUgc25pcHBldFByZXZpZXdcbiAqL1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbmZpZyBhbmQgb3V0cHV0VGFyZ2V0IGZvciB0aGUgU25pcHBldFByZXZpZXdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBTbmlwcGV0IHByZXZpZXcgb3B0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIgICAgICAgICAgICAgICAtIFRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgZm9yIHRoZSBmaWVsZHMsIHdpbGwgYmUgc2hvd24gYXNcbiAqIGFjdHVhbCBwbGFjZWhvbGRlcnMgaW4gdGhlIGlucHV0cyBhbmQgYXMgYSBmYWxsYmFjayBmb3IgdGhlIHByZXZpZXcuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLnRpdGxlICAgICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIHRpdGxlIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbiAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBkZXNjcmlwdGlvbiBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgaW1hZ2UgdXJsIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlICAgICAgICAgICAgICAtIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZmllbGRzLCBpZiB0aGUgdXNlciBoYXMgbm90XG4gKiBjaGFuZ2VkIGEgZmllbGQsIHRoaXMgdmFsdWUgd2lsbCBiZSB1c2VkIGZvciB0aGUgYW5hbHl6ZXIsIHByZXZpZXcgYW5kIHRoZSBwcm9ncmVzcyBiYXJzLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUudGl0bGUgICAgICAgIC0gRGVmYXVsdCB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uICAtIERlZmF1bHQgZGVzY3JpcHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCAgICAgLSBEZWZhdWx0IGltYWdlIHVybC5cbiAqIGl0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuYmFzZVVSTCAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gRmFjZWJvb2suXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAgICBvcHRzLnRhcmdldEVsZW1lbnQgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuY2FsbGJhY2tzICAgICAgICAgICAgICAgICAtIEZ1bmN0aW9ucyB0aGF0IGFyZSBjYWxsZWQgb24gc3BlY2lmaWMgaW5zdGFuY2VzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgb3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyAtIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBzb2NpYWwgcHJldmlldyBpcyB1cGRhdGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIGkxOG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBpMThuIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdHJhbnNsYXRpb24gb2JqZWN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldEVsZW1lbnQgICAgICAgICAgICAgICAgICAtIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudCAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGVsZW1lbnRzIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZWxlbWVudC5yZW5kZXJlZCAgICAgICAgICAgICAgIC0gVGhlIHJlbmRlcmVkIGVsZW1lbnRzLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC50aXRsZSAgICAgICAgIC0gVGhlIHJlbmRlcmVkIHRpdGxlIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmltYWdlVXJsICAgICAgLSBUaGUgcmVuZGVyZWQgdXJsIHBhdGggZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24gICAtIFRoZSByZW5kZXJlZCBGYWNlYm9vayBkZXNjcmlwdGlvbiBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQuaW5wdXQgICAgICAgICAgICAgICAgICAtIFRoZSBpbnB1dCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQudGl0bGUgICAgICAgICAgICAtIFRoZSB0aXRsZSBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5pbWFnZVVybCAgICAgICAgIC0gVGhlIHVybCBwYXRoIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbiBpbnB1dCBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuY29udGFpbmVyICAgICAgICAgICAgICAtIFRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5mb3JtQ29udGFpbmVyICAgICAgICAgIC0gVGhlIGZvcm0gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmVkaXRUb2dnbGUgICAgICAgICAgICAgLSBUaGUgYnV0dG9uIHRoYXQgdG9nZ2xlcyB0aGUgZWRpdG9yIGZvcm0uXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGRhdGEgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLnRpdGxlICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdGl0bGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmltYWdlVXJsICAgICAgICAgICAgICAgICAgLSBUaGUgdXJsIHBhdGguXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmRlc2NyaXB0aW9uICAgICAgICAgICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBiYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIGdvb2dsZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIEZhY2Vib29rUHJldmlldyA9IGZ1bmN0aW9uKCBvcHRzLCBpMThuICkge1xuXHR0aGlzLmkxOG4gPSBpMThuIHx8IHRoaXMuY29uc3RydWN0STE4bigpO1xuXG5cdGZhY2Vib29rRGVmYXVsdHMucGxhY2Vob2xkZXIgPSB7XG5cdFx0dGl0bGU6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJUaGlzIGlzIGFuIGV4YW1wbGUgdGl0bGUgLSBlZGl0IGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiTW9kaWZ5IHlvdXIgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIGl0IHJpZ2h0IGhlcmVcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KSxcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9O1xuXG5cdGRlZmF1bHRzRGVlcCggb3B0cywgZmFjZWJvb2tEZWZhdWx0cyApO1xuXG5cdGlmICggIWlzRWxlbWVudCggb3B0cy50YXJnZXRFbGVtZW50ICkgKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCBcIlRoZSBGYWNlYm9vayBwcmV2aWV3IHJlcXVpcmVzIGEgdmFsaWQgdGFyZ2V0IGVsZW1lbnRcIiApO1xuXHR9XG5cblx0dGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXHR0aGlzLm9wdHMgPSBvcHRzO1xuXG5cblx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblx0dGhpcy5fY3VycmVudEhvdmVyID0gbnVsbDtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgaTE4biBvYmplY3QgYmFzZWQgb24gcGFzc2VkIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdHJhbnNsYXRpb25zIC0gVGhlIHZhbHVlcyB0byB0cmFuc2xhdGUuXG4gKlxuICogQHJldHVybnMge0plZH0gLSBUaGUgSmVkIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0XCJkb21haW5cIjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcImxvY2FsZV9kYXRhXCI6IHtcblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge31cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW5kZXJUZW1wbGF0ZSgpO1xuXHR0aGlzLmJpbmRFdmVudHMoKTtcblx0dGhpcy51cGRhdGVQcmV2aWV3KCk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgc25pcHBldCBlZGl0b3IgYW5kIGFkZHMgaXQgdG8gdGhlIHRhcmdldEVsZW1lbnQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHR0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9IGZhY2Vib29rRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkxcblx0XHR9LFxuXHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIsXG5cdFx0aTE4bjoge1xuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gRmFjZWJvb2sgKi9cblx0XHRcdGVkaXQ6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiRWRpdCAlMSRzIHByZXZpZXdcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRzbmlwcGV0UHJldmlldzogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHByZXZpZXdcIiApLCBcIkZhY2Vib29rXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRzbmlwcGV0RWRpdG9yOiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZWRpdG9yXCIgKSwgXCJGYWNlYm9va1wiIClcblx0XHR9XG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXRpdGxlXCIgKVswXSxcblx0XHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWRlc2NyaXB0aW9uXCIgKVswXVxuXHRcdH0sXG5cdFx0ZmllbGRzOiB0aGlzLmdldEZpZWxkcygpLFxuXHRcdGNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXctLWZhY2Vib29rXCIgKVswXSxcblx0XHRmb3JtQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm1cIiApWzBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWzBdLFxuXHRcdGZvcm1GaWVsZHM6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybS1maWVsZFwiICksXG5cdFx0aGVhZGluZ0VkaXRvcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvclwiIClbMF0sXG5cdFx0YXV0aG9yQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWF1dGhvclwiIClbMF1cblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuZmllbGRzLmltYWdlVXJsLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLnRpdGxlLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLmRlc2NyaXB0aW9uLnJlbmRlcigpO1xuXG5cdHRoaXMuZWxlbWVudC5pbnB1dCA9IHtcblx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKVswXSxcblx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzID0gdGhpcy5nZXRGaWVsZEVsZW1lbnRzKCk7XG5cdHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciA9IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fc3VibWl0XCIgKVswXTtcblxuXHR0aGlzLmVsZW1lbnQubGFiZWwgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5pbnB1dC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0aGlzLmVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwucGFyZW50Tm9kZSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uLnBhcmVudE5vZGVcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQucHJldmlldyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX190aXRsZSBqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLnRpdGxlLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHRpdGxlXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRpbWFnZVVybDogbmV3IFRleHRGaWVsZCgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9faW1hZ2VVcmwganMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBpbWFnZVwiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9IClcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyB0aXRsZSBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGZhbGxiYWNrOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdFwiRmFjZWJvb2tcIlxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0XHRmYWxsYmFjazogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpXG5cdH07XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgRmFjZWJvb2sgcHJldmlldy5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS51cGRhdGVQcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG5cdC8vIFVwZGF0ZSB0aGUgZGF0YS5cblx0dGhpcy5kYXRhLnRpdGxlID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5pbWFnZVVybCA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmltYWdlVXJsLmdldElucHV0VmFsdWUoKTtcblxuXHQvLyBTZXRzIHRoZSB0aXRsZSBmaWVsZFxuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXQgdGhlIGRlc2NyaXB0aW9uIGZpZWxkIGFuZCBwYXJzZSB0aGUgc3R5bGluZyBvZiBpdC5cblx0dGhpcy5zZXREZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldHMgdGhlIEltYWdlXG5cdHRoaXMuc2V0SW1hZ2UoIHRoaXMuZGF0YS5pbWFnZVVybCApO1xuXG5cdC8vIENsb25lIHNvIHRoZSBkYXRhIGlzbid0IGNoYW5nZWFibGUuXG5cdHRoaXMub3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyggY2xvbmUoIHRoaXMuZGF0YSApICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByZXZpZXcgdGl0bGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSB0byBzZXRcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRUaXRsZSA9IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0dGl0bGUgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeVRpdGxlKCB0aXRsZSApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIHRvIHNldFxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCB0aGUgaW1hZ2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0SW1hZ2VDb250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZWxlbWVudC5wcmV2aWV3LmltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBpbWFnZSBvYmplY3Qgd2l0aCB0aGUgbmV3IFVSTC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmwgVGhlIGltYWdlIHBhdGguXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uICggaW1hZ2VVcmwgKSB7XG5cdGltYWdlVXJsID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlJbWFnZVVybCggaW1hZ2VVcmwgKTtcblxuXHRpZiAoIGltYWdlVXJsID09PSBcIlwiICYmIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHJldHVybiB0aGlzLm5vVXJsU2V0KCk7XG5cdH1cblxuXHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5pc1Rvb1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRcdHJldHVybiB0aGlzLmltYWdlVG9vU21hbGwoKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFNpemluZ0NsYXNzKCBpbWcgKTtcblx0XHR0aGlzLmFkZEltYWdlVG9Db250YWluZXIoIGltYWdlVXJsICk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRyZXR1cm4gdGhpcy5pbWFnZUVycm9yKCk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdC8vIExvYWQgaW1hZ2UgdG8gdHJpZ2dlciBsb2FkIG9yIGVycm9yIGV2ZW50LlxuXHRpbWcuc3JjID0gaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBObyBVUkwgU2V0IHdhcm5pbmcuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5ub1VybFNldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2Ugc2VsZWN0IGFuIGltYWdlIGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGZhbHNlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogRGlzcGxheXMgdGhlIEltYWdlIFRvbyBTbWFsbCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlVG9vU21hbGwgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1lc3NhZ2U7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0bWVzc2FnZSA9IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIldlIGFyZSB1bmFibGUgdG8gZGV0ZWN0IGFuIGltYWdlIFwiICtcblx0XHRcdFx0XCJpbiB5b3VyIHBvc3QgdGhhdCBpcyBsYXJnZSBlbm91Z2ggdG8gYmUgZGlzcGxheWVkIG9uIEZhY2Vib29rLiBXZSBhZHZpc2UgeW91IFwiICtcblx0XHRcdFx0XCJ0byBzZWxlY3QgYSAlMSRzIGltYWdlIHRoYXQgZml0cyB0aGUgcmVjb21tZW5kZWQgaW1hZ2Ugc2l6ZS5cIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRtZXNzYWdlID0gdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGltYWdlIHlvdSBzZWxlY3RlZCBpcyB0b28gc21hbGwgZm9yICUxJHNcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fVxuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdG1lc3NhZ2UsXG5cdFx0dHJ1ZSxcblx0XHRcImZhY2Vib29rXCJcblx0KTtcblxuXHRyZXR1cm47XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBVcmwgQ2Fubm90IEJlIExvYWRlZCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpbWFnZVBsYWNlaG9sZGVyKFxuXHRcdHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKSxcblx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGdpdmVuIGltYWdlIHVybCBjYW5ub3QgYmUgbG9hZGVkXCIgKSxcblx0XHR0cnVlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBpbWFnZSBvZiB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgaW1hZ2UgKyBcIilcIjtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgaW1hZ2UgZnJvbSB0aGUgY29udGFpbmVyLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcIlwiO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcm9wZXIgQ1NTIGNsYXNzIGZvciB0aGUgY3VycmVudCBpbWFnZS5cbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2UgdG8gYmFzZSB0aGUgc2l6aW5nIGNsYXNzIG9uLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U2l6aW5nQ2xhc3MgPSBmdW5jdGlvbiAoIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIGltYWdlRGlzcGxheU1vZGUoIGltZyApID09PSBcInBvcnRyYWl0XCIgKSB7XG5cdFx0dGhpcy5zZXRQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoXG4gKlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSBvYmplY3QgdG8gdXNlLlxuICogQHJldHVybnMge2ludH0gVGhlIGNhbGN1bGF0ZWQgbWF4d2lkdGhcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX1NNQUxMO1xuXHR9XG5cblx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX0xBUkdFO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNob3VsZCBzd2l0Y2ggdG8gc21hbGwgaW1hZ2UgbW9kZVxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIEZhY2Vib29rIHByZXZpZXcgaW1hZ2UgaXMgdG9vIHNtYWxsXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1Rvb1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIEZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBGYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzbWFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIGxhcmdlIGZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGxhcmdlIGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgcG9ydHJhaXQgRmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBwb3J0cmFpdCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cdHRoaXMucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcmVsb2FkU25pcHBldFRleHQgZnVuY3Rpb24gdG8gdGhlIGJsdXIgb2YgdGhlIHNuaXBwZXQgaW5wdXRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHByZXZpZXdFdmVudHMgPSBuZXcgUHJldmlld0V2ZW50cyggaW5wdXRGYWNlYm9va1ByZXZpZXdCaW5kaW5ncywgdGhpcy5lbGVtZW50LCB0cnVlICk7XG5cdHByZXZpZXdFdmVudHMuYmluZEV2ZW50cyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsIHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgRmFjZWJvb2sgYXV0aG9yIG5hbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGF1dGhvck5hbWUgVGhlIG5hbWUgb2YgdGhlIGF1dGhvciB0byBzaG93LlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldEF1dGhvciA9IGZ1bmN0aW9uKCBhdXRob3JOYW1lICkge1xuXHR2YXIgYXV0aG9ySHRtbCA9IFwiXCI7XG5cdGlmICggYXV0aG9yTmFtZSAhPT0gXCJcIiApIHtcblx0XHRhdXRob3JIdG1sID0gZmFjZWJvb2tBdXRob3JUZW1wbGF0ZShcblx0XHRcdHtcblx0XHRcdFx0YXV0aG9yTmFtZTogYXV0aG9yTmFtZSxcblx0XHRcdFx0YXV0aG9yQnk6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJCeVwiIClcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dGhpcy5lbGVtZW50LmF1dGhvckNvbnRhaW5lci5pbm5lckhUTUwgPSBhdXRob3JIdG1sO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9va1ByZXZpZXc7XG4iLCIvKipcbiAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgdG8gYWRkLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBlbGVtZW50LCBjbGFzc05hbWUgKSB7XG5cdHZhciBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoIFwiIFwiICk7XG5cblx0aWYgKCAtMSA9PT0gY2xhc3Nlcy5pbmRleE9mKCBjbGFzc05hbWUgKSApIHtcblx0XHRjbGFzc2VzLnB1c2goIGNsYXNzTmFtZSApO1xuXHR9XG5cblx0ZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XG59O1xuIiwidmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuLy4uL2FkZENsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBBZGRzIGEgQkVNIG1vZGlmaWVyIHRvIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kaWZpZXIgTW9kaWZpZXIgdG8gYWRkIHRvIHRoZSB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRDbGFzcyBUaGUgdGFyZ2V0IHRvIGFkZCB0aGUgbW9kaWZpZXIgdG9cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFBhcmVudCBUaGUgcGFyZW50IGluIHdoaWNoIHRoZSB0YXJnZXQgc2hvdWxkIGJlXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MsIHRhcmdldFBhcmVudCApIHtcblx0dmFyIGVsZW1lbnQgPSB0YXJnZXRQYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggdGFyZ2V0Q2xhc3MgKVswXTtcblx0dmFyIG5ld0NsYXNzID0gYWRkTW9kaWZpZXJUb0NsYXNzKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MgKTtcblxuXHRhZGRDbGFzcyggZWxlbWVudCwgbmV3Q2xhc3MgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNb2RpZmllcjtcbiIsIi8qKlxuICogQWRkcyBhIG1vZGlmaWVyIHRvIGEgY2xhc3MgbmFtZSwgbWFrZXMgc3VyZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBUaGUgbW9kaWZpZXIgdG8gYWRkIHRvIHRoZSBjbGFzcyBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSB0byBhZGQgdGhlIG1vZGlmaWVyIHRvLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuZXcgY2xhc3Mgd2l0aCB0aGUgbW9kaWZpZXIuXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyVG9DbGFzcyggbW9kaWZpZXIsIGNsYXNzTmFtZSApIHtcblx0dmFyIGJhc2VDbGFzcyA9IGNsYXNzTmFtZS5yZXBsYWNlKCAvLS0uKy8sIFwiXCIgKTtcblxuXHRyZXR1cm4gYmFzZUNsYXNzICsgXCItLVwiICsgbW9kaWZpZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTW9kaWZpZXJUb0NsYXNzO1xuIiwidmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSggXCIuLy4uL3JlbW92ZUNsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgQkVNIG1vZGlmaWVyIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBNb2RpZmllciB0byBhZGQgdG8gdGhlIHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldENsYXNzIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBtb2RpZmllciB0b1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0UGFyZW50IFRoZSBwYXJlbnQgaW4gd2hpY2ggdGhlIHRhcmdldCBzaG91bGQgYmVcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTW9kaWZpZXIoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcywgdGFyZ2V0UGFyZW50ICkge1xuXHR2YXIgZWxlbWVudCA9IHRhcmdldFBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB0YXJnZXRDbGFzcyApWzBdO1xuXHR2YXIgbmV3Q2xhc3MgPSBhZGRNb2RpZmllclRvQ2xhc3MoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcyApO1xuXG5cdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBuZXdDbGFzcyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZU1vZGlmaWVyO1xuIiwiLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGltYWdlIGRpc3BsYXkgbW9kZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRpc3BsYXkgbW9kZSBvZiB0aGUgaW1hZ2UuXG4gKi9cbmZ1bmN0aW9uIGltYWdlRGlzcGxheU1vZGUoIGltYWdlICkge1xuXHRpZiAoIGltYWdlLmhlaWdodCA+IGltYWdlLndpZHRoICkge1xuXHRcdHJldHVybiBcInBvcnRyYWl0XCI7XG5cdH1cblxuXHRyZXR1cm4gXCJsYW5kc2NhcGVcIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbWFnZURpc3BsYXlNb2RlO1xuIiwiLyoqXG4gKiBDbGVhbnMgc3BhY2VzIGZyb20gdGhlIGh0bWwuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBodG1sIFRoZSBodG1sIHRvIG1pbmltaXplLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBtaW5pbWl6ZWQgaHRtbCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG1pbmltaXplSHRtbCggaHRtbCApIHtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLyhcXHMrKS9nLCBcIiBcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvPiA8L2csIFwiPjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvID4vZywgXCI+XCIgKTtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLz4gL2csIFwiPlwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gPC9nLCBcIjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvICQvLCBcIlwiICk7XG5cblx0cmV0dXJuIGh0bWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWluaW1pemVIdG1sO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGNsYXNzIGZyb20uXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byByZW1vdmUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIGNsYXNzTmFtZSApIHtcblx0dmFyIGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCggXCIgXCIgKTtcblx0dmFyIGZvdW5kQ2xhc3MgPSBjbGFzc2VzLmluZGV4T2YoIGNsYXNzTmFtZSApO1xuXG5cdGlmICggLTEgIT09IGZvdW5kQ2xhc3MgKSB7XG5cdFx0Y2xhc3Nlcy5zcGxpY2UoIGZvdW5kQ2xhc3MsIDEgKTtcblx0fVxuXG5cdGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCBcIiBcIiApO1xufTtcbiIsInZhciBpc0VtcHR5ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VtcHR5XCIgKTtcblxudmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuL2FkZENsYXNzXCIgKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoIFwiLi9yZW1vdmVDbGFzc1wiICk7XG5cbi8qKlxuICogTWFrZXMgdGhlIHJlbmRlcmVkIGRlc2NyaXB0aW9uIGdyYXkgaWYgbm8gZGVzY3JpcHRpb24gaGFzIGJlZW4gc2V0IGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbkVsZW1lbnQgVGFyZ2V0IGRlc2NyaXB0aW9uIGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBDdXJyZW50IGRlc2NyaXB0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckRlc2NyaXB0aW9uKCBkZXNjcmlwdGlvbkVsZW1lbnQsIGRlc2NyaXB0aW9uICkge1xuXHRpZiAoIGlzRW1wdHkoIGRlc2NyaXB0aW9uICkgKSB7XG5cdFx0YWRkQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLXJlbmRlclwiICk7XG5cdFx0cmVtb3ZlQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLWRlZmF1bHRcIiApO1xuXHR9IGVsc2Uge1xuXHRcdGFkZENsYXNzKCBkZXNjcmlwdGlvbkVsZW1lbnQsIFwiZGVzYy1kZWZhdWx0XCIgKTtcblx0XHRyZW1vdmVDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtcmVuZGVyXCIgKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckRlc2NyaXB0aW9uO1xuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzXCIgKTtcbnZhciBtaW5pbWl6ZUh0bWwgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvbWluaW1pemVIdG1sXCIgKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgaW5wdXRmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGUgVGVtcGxhdGUgb2JqZWN0IHRvIHVzZS5cbiAqIEByZXR1cm5zIHtUZXh0RmllbGR9IFRoZSB0ZXh0ZmllbGQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbnB1dEZpZWxkRmFjdG9yeSggdGVtcGxhdGUgKSB7XG5cblx0dmFyIGRlZmF1bHRBdHRyaWJ1dGVzID0ge1xuXHRcdHZhbHVlOiBcIlwiLFxuXHRcdGNsYXNzTmFtZTogXCJcIixcblx0XHRpZDogXCJcIixcblx0XHRwbGFjZWhvbGRlcjogXCJcIixcblx0XHRuYW1lOiBcIlwiLFxuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGxhYmVsQ2xhc3NOYW1lOiBcIlwiXG5cdH07XG5cblx0LyoqXG5cdCAqIFJlcHJlc2VudHMgYW4gSFRNTCB0ZXh0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIFRoZSBhdHRyaWJ1dGVzIHRvIHNldCBvbiB0aGUgSFRNTCBlbGVtZW50XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLm5hbWUgVGhlIG5hbWUgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5pZCBUaGUgaWQgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5jbGFzc05hbWUgVGhlIGNsYXNzIGZvciB0aGlzIHRleHQgZmllbGRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMudGl0bGUgVGhlIHRpdGxlIHRoYXQgZGVzY3JpYmVzIHRoaXMgdGV4dCBmaWVsZFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGZ1bmN0aW9uIFRleHRGaWVsZCggYXR0cmlidXRlcyApIHtcblx0XHRhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcblx0XHRhdHRyaWJ1dGVzID0gZGVmYXVsdHMoIGF0dHJpYnV0ZXMsIGRlZmF1bHRBdHRyaWJ1dGVzICk7XG5cblx0XHR0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBIVE1MIGF0dHJpYnV0ZXMgc2V0IGZvciB0aGlzIHRleHQgZmllbGRcblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIEhUTUwgYXR0cmlidXRlc1xuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHRleHQgZmllbGQgdG8gSFRNTFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVuZGVyZWQgSFRNTFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaHRtbCA9IHRlbXBsYXRlKCB0aGlzLmdldEF0dHJpYnV0ZXMoKSApO1xuXG5cdFx0aHRtbCA9IG1pbmltaXplSHRtbCggaHRtbCApO1xuXG5cdFx0cmV0dXJuIGh0bWw7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoaXMgaW5wdXQgZmllbGRcblx0ICovXG5cdFRleHRGaWVsZC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dGhpcy5fYXR0cmlidXRlcy52YWx1ZSA9IHZhbHVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaWVsZFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBzZXQgb24gdGhpcyBpbnB1dCBmaWVsZFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5zZXRDbGFzc05hbWUgPSBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdHRoaXMuX2F0dHJpYnV0ZXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdHJldHVybiBUZXh0RmllbGQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3Rvcnk7XG4iLCJ2YXIgaW5wdXRGaWVsZEZhY3RvcnkgPSByZXF1aXJlKCBcIi4vaW5wdXRGaWVsZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3RvcnkoIHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5maWVsZHMudGV4dCApO1xuIiwidmFyIGlucHV0RmllbGRGYWN0b3J5ID0gcmVxdWlyZSggXCIuL2lucHV0RmllbGRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0RmllbGRGYWN0b3J5KCByZXF1aXJlKCBcIi4uL3RlbXBsYXRlc1wiICkuZmllbGRzLnRleHRhcmVhICk7XG4iLCJ2YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2NvbGxlY3Rpb24vZm9yRWFjaFwiICk7XG5cbnZhciBhZGRDbGFzcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9hZGRDbGFzcy5qc1wiICk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvcmVtb3ZlQ2xhc3MuanNcIiApO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmluZGluZ3MgVGhlIGZpZWxkcyB0byBiaW5kLlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gYmluZCB0aGUgZXZlbnRzIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBhbHdheXNPcGVuIFdoZXRoZXIgdGhlIGlucHV0IGZvcm0gc2hvdWxkIGFsd2F5cyBiZSBvcGVuLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFByZXZpZXdFdmVudHMoIGJpbmRpbmdzLCBlbGVtZW50LCBhbHdheXNPcGVuICkge1xuXHR0aGlzLl9iaW5kaW5ncyA9IGJpbmRpbmdzO1xuXHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHR0aGlzLl9hbHdheXNPcGVuID0gYWx3YXlzT3Blbjtcbn1cblxuLyoqXG4gKiBCaW5kIHRoZSBldmVudHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVkaXRUb2dnbGUgLSBUaGUgZWRpdCB0b2dnbGUgZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IGNsb3NlRWRpdG9yIC0gVGhlIGJ1dHRvbiB0byBjbG9zZSB0aGUgZWRpdG9yXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiggZWRpdFRvZ2dsZSwgY2xvc2VFZGl0b3IgKSB7XG5cdGlmICggIXRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0ZWRpdFRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIHRoaXMudG9nZ2xlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHRcdGNsb3NlRWRpdG9yLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgdGhpcy5jbG9zZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0fVxuXG5cdC8vIExvb3AgdGhyb3VnaCB0aGUgYmluZGluZ3MgYW5kIGJpbmQgYSBjbGljayBoYW5kbGVyIHRvIHRoZSBjbGljayB0byBmb2N1cyB0aGUgZm9jdXMgZWxlbWVudC5cblx0Zm9yRWFjaCggdGhpcy5fYmluZGluZ3MsIHRoaXMuYmluZElucHV0RXZlbnQuYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSBldmVudCBmb3IgdGhlIGlucHV0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJpbmRpbmcgVGhlIGZpZWxkIHRvIGJpbmQuXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRJbnB1dEV2ZW50ID0gZnVuY3Rpb24oIGJpbmRpbmcgKSB7XG5cdHZhciBwcmV2aWV3RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGJpbmRpbmcucHJldmlldyApWzBdO1xuXHR2YXIgaW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LmlucHV0WyBiaW5kaW5nLmlucHV0RmllbGQgXTtcblxuXHQvLyBNYWtlIHRoZSBwcmV2aWV3IGVsZW1lbnQgY2xpY2sgb3BlbiB0aGUgZWRpdG9yIGFuZCBmb2N1cyB0aGUgY29ycmVjdCBpbnB1dC5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm9wZW5FZGl0b3IoKTtcblx0XHRpbnB1dEVsZW1lbnQuZm9jdXMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIGZvY3VzaW5nIGFuIGlucHV0LCB1cGRhdGUgdGhlIGNhcmV0cy5cblx0aW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiZm9jdXNcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlRm9jdXNDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIHJlbW92aW5nIGZvY3VzIGZyb20gYW4gZWxlbWVudCwgdXBkYXRlIHRoZSBjYXJldHMuXG5cdGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImJsdXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblxuXHRcdHRoaXMuX3VwZGF0ZUZvY3VzQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEhvdmVyID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlSG92ZXJDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHRwcmV2aWV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG5cblx0XHR0aGlzLl91cGRhdGVIb3ZlckNhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBPcGVucyB0aGUgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLm9wZW5FZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5lZGl0VG9nZ2xlLCAgICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdC8vIFNob3cgdGhlc2UgZWxlbWVudHMuXG5cdHJlbW92ZUNsYXNzKCB0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lciwgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0cmVtb3ZlQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogQ2xvc2VzIHRoZSBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuY2xvc2VFZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblxuXHQvLyBTaG93IHRoZXNlIGVsZW1lbnRzLlxuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS50b2dnbGVFZGl0b3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB0aGlzLm9wZW5lZCApIHtcblx0XHR0aGlzLmNsb3NlRWRpdG9yKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5vcGVuRWRpdG9yKCk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBjYXJldHMgYmVmb3JlIHRoZSBwcmV2aWV3IGFuZCBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUZvY3VzQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBmb2N1c2VkTGFiZWwsIGZvY3VzZWRQcmV2aWV3O1xuXG5cdC8vIERpc2FibGUgYWxsIGNhcmV0cyBvbiB0aGUgbGFiZWxzLlxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQubGFiZWwsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0tZm9jdXNcIiApO1xuXHR9ICk7XG5cblx0Ly8gRGlzYWJsZSBhbGwgY2FyZXRzIG9uIHRoZSBwcmV2aWV3cy5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LnByZXZpZXcsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jb250YWluZXItLWZvY3VzXCIgKTtcblx0fSApO1xuXG5cdGlmICggbnVsbCAhPT0gdGhpcy5fY3VycmVudEZvY3VzICkge1xuXHRcdGZvY3VzZWRMYWJlbCA9IHRoaXMuZWxlbWVudC5sYWJlbFsgdGhpcy5fY3VycmVudEZvY3VzIF07XG5cdFx0Zm9jdXNlZFByZXZpZXcgPSB0aGlzLmVsZW1lbnQucHJldmlld1sgdGhpcy5fY3VycmVudEZvY3VzIF07XG5cblx0XHRhZGRDbGFzcyggZm9jdXNlZExhYmVsLCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0tZm9jdXNcIiApO1xuXHRcdGFkZENsYXNzKCBmb2N1c2VkUHJldmlldywgXCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyLS1mb2N1c1wiICk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBob3ZlciBjYXJldHMgYmVmb3JlIHRoZSBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUhvdmVyQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBob3ZlcmVkTGFiZWw7XG5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmxhYmVsLCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRyZW1vdmVDbGFzcyggZWxlbWVudCwgXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWwtLWhvdmVyXCIgKTtcblx0fSApO1xuXG5cdGlmICggbnVsbCAhPT0gdGhpcy5fY3VycmVudEhvdmVyICkge1xuXHRcdGhvdmVyZWRMYWJlbCA9IHRoaXMuZWxlbWVudC5sYWJlbFsgdGhpcy5fY3VycmVudEhvdmVyIF07XG5cblx0XHRhZGRDbGFzcyggaG92ZXJlZExhYmVsLCBcInNuaXBwZXQtZWRpdG9yX19sYWJlbC0taG92ZXJcIiApO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByZXZpZXdFdmVudHM7XG4iLCI7KGZ1bmN0aW9uKCkge1xuICB2YXIgdW5kZWZpbmVkO1xuXG4gIHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuICB2YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuICB2YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuICB2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbiAgdmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUtRVM1IGVudmlyb25tZW50cy4gKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCBhcyB0aGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuICovXG4gIHZhciBWRVJTSU9OID0gJzQuMTYuNic7XG5cbiAgLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG4gIHZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4gIC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbiAgdmFyIHJlVW5lc2NhcGVkSHRtbCA9IC9bJjw+XCInXS9nLFxuICAgICAgcmVIYXNVbmVzY2FwZWRIdG1sID0gUmVnRXhwKHJlVW5lc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4gIC8qKiBVc2VkIHRvIG1hcCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuICovXG4gIHZhciBodG1sRXNjYXBlcyA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OydcbiAgfTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbiAgdmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAgICogc2hvcnRoYW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYF8uZXNjYXBlYCB0byBjb252ZXJ0IGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICovXG4gIHZhciBlc2NhcGVIdG1sQ2hhciA9IGJhc2VQcm9wZXJ0eU9mKGh0bWxFc2NhcGVzKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG4gIHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gICAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICAgKiBvZiB2YWx1ZXMuXG4gICAqL1xuICB2YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbiAgdmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbiAgLyoqIFVzZWQgdG8gbG9va3VwIHVubWluaWZpZWQgZnVuY3Rpb24gbmFtZXMuICovXG4gIHZhciByZWFsTmFtZXMgPSB7fTtcblxuICAvKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbiAgdmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gICAgfVxuICAgIHZhbHVlID0gT2JqZWN0KHZhbHVlKTtcbiAgICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIHZhbHVlKVxuICAgICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAgICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAgIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gICAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgICB0cnkge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgIGlmICh1bm1hc2tlZCkge1xuICAgICAgaWYgKGlzT3duKSB7XG4gICAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgMC4xLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICpcbiAgICogXy5pc0FycmF5KF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICAgKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQHNpbmNlIDQuMC4wXG4gICAqIEBjYXRlZ29yeSBMYW5nXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICAgKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy50b1N0cmluZyhudWxsKTtcbiAgICogLy8gPT4gJydcbiAgICpcbiAgICogXy50b1N0cmluZygtMCk7XG4gICAqIC8vID0+ICctMCdcbiAgICpcbiAgICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICAgKiAvLyA9PiAnMSwyLDMnXG4gICAqL1xuICBmdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyB0aGUgY2hhcmFjdGVycyBcIiZcIiwgXCI8XCIsIFwiPlwiLCAnXCInLCBhbmQgXCInXCIgaW4gYHN0cmluZ2AgdG8gdGhlaXJcbiAgICogY29ycmVzcG9uZGluZyBIVE1MIGVudGl0aWVzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogTm8gb3RoZXIgY2hhcmFjdGVycyBhcmUgZXNjYXBlZC4gVG8gZXNjYXBlIGFkZGl0aW9uYWxcbiAgICogY2hhcmFjdGVycyB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gICAqXG4gICAqIFRob3VnaCB0aGUgXCI+XCIgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2VcbiAgICogXCI+XCIgYW5kIFwiL1wiIGRvbid0IG5lZWQgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmdcbiAgICogdW5sZXNzIHRoZXkncmUgcGFydCBvZiBhIHRhZyBvciB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuIFNlZVxuICAgKiBbTWF0aGlhcyBCeW5lbnMncyBhcnRpY2xlXShodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMpXG4gICAqICh1bmRlciBcInNlbWktcmVsYXRlZCBmdW4gZmFjdFwiKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKlxuICAgKiBXaGVuIHdvcmtpbmcgd2l0aCBIVE1MIHlvdSBzaG91bGQgYWx3YXlzXG4gICAqIFtxdW90ZSBhdHRyaWJ1dGUgdmFsdWVzXShodHRwOi8vd29ua28uY29tL3Bvc3QvaHRtbC1lc2NhcGluZykgdG8gcmVkdWNlXG4gICAqIFhTUyB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZXNjYXBlKCdmcmVkLCBiYXJuZXksICYgcGViYmxlcycpO1xuICAgKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJ1xuICAgKi9cbiAgZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICAgIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNVbmVzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICAgID8gc3RyaW5nLnJlcGxhY2UocmVVbmVzY2FwZWRIdG1sLCBlc2NhcGVIdG1sQ2hhcilcbiAgICAgIDogc3RyaW5nO1xuICB9XG5cbiAgdmFyIF8gPSB7ICdlc2NhcGUnOiBlc2NhcGUgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIHZhciB0ZW1wbGF0ZXMgPSB7XG4gICAgJ2ZhY2Vib29rQXV0aG9yJzoge30sXG4gICAgJ2ZhY2Vib29rUHJldmlldyc6IHt9LFxuICAgICdmaWVsZHMnOiB7XG4gICAgICAgICdidXR0b24nOiB7fSxcbiAgICAgICAgJ3RleHQnOiB7fSxcbiAgICAgICAgJ3RleHRhcmVhJzoge31cbiAgICB9LFxuICAgICdpbWFnZVBsYWNlaG9sZGVyJzoge30sXG4gICAgJ3R3aXR0ZXJQcmV2aWV3Jzoge31cbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZhY2Vib29rQXV0aG9yJ10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2stcGlwZVwiPnw8L3NwYW4+ICcgK1xuICAgIF9fZSggYXV0aG9yQnkgKSArXG4gICAgJ1xcbjxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fYXV0aG9yLS1mYWNlYm9va1wiPicgK1xuICAgIF9fZSggYXV0aG9yTmFtZSApICtcbiAgICAnPC9zcGFuPlxcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmFjZWJvb2tQcmV2aWV3J10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZTtcbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3IGVkaXRhYmxlLXByZXZpZXctLWZhY2Vib29rXCI+XFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWV5ZSBlZGl0YWJsZS1wcmV2aWV3X19oZWFkaW5nIFwiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0UHJldmlldyApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxzZWN0aW9uIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19faW5uZXIgZWRpdGFibGUtcHJldmlld19faW5uZXItLWZhY2Vib29rXCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJzb2NpYWwtcHJldmlld19faW5uZXIgc29jaWFsLXByZXZpZXdfX2lubmVyLS1mYWNlYm9va1wiPlxcblx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlciBlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tZmFjZWJvb2sgZWRpdGFibGUtcHJldmlld19fdGl0bGUtLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stdGl0bGVcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLnRpdGxlICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tZmFjZWJvb2sgZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stZGVzY3JpcHRpb25cIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmRlc2NyaXB0aW9uICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tbm8tY2FyZXQgZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay11cmxcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmJhc2VVcmwgKSArXG4gICAgJ1xcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLWF1dGhvclwiPjwvc3Bhbj5cXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L3NlY3Rpb24+XFxuXFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3Igc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1lZGl0IGVkaXRhYmxlLXByZXZpZXdfX2hlYWRpbmdcIj4nICtcbiAgICBfX2UoIGkxOG4uc25pcHBldEVkaXRvciApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fZm9ybVwiPlxcblxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWydmaWVsZHMnXVsnYnV0dG9uJ10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZSwgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8YnV0dG9uXFxuXHR0eXBlPVwiYnV0dG9uXCJcXG5cdCc7XG4gICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICBfX3AgKz0gJ2NsYXNzPVwiJyArXG4gICAgX19lKCBjbGFzc05hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuPlxcblx0JyArXG4gICAgX19lKCB2YWx1ZSApICtcbiAgICAnXFxuPC9idXR0b24+JztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWydmaWVsZHMnXVsndGV4dCddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIGZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGxhYmVsJztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJyBmb3I9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cblxuICAgICBpZiAoIGxhYmVsQ2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnIGNsYXNzPVwiJyArXG4gICAgX19lKCBsYWJlbENsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICc+JztcblxuICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApICtcbiAgICAnPC9sYWJlbD4nO1xuICAgICB9IGVsc2Uge1xuICAgIF9fcCArPVxuICAgIF9fZSggdGl0bGUgKTtcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIlxcblx0XHQnO1xuICAgICBpZiAoIHZhbHVlICkge1xuICAgIF9fcCArPSAndmFsdWU9XCInICtcbiAgICBfX2UoIHZhbHVlICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIHBsYWNlaG9sZGVyICkge1xuICAgIF9fcCArPSAncGxhY2Vob2xkZXI9XCInICtcbiAgICBfX2UoIHBsYWNlaG9sZGVyICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIGNsYXNzTmFtZSApIHtcbiAgICBfX3AgKz0gJ2NsYXNzPVwiJyArXG4gICAgX19lKCBjbGFzc05hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9ICdpZD1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggbmFtZSApIHtcbiAgICBfX3AgKz0gJ25hbWU9XCInICtcbiAgICBfX2UoIG5hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHQvPlxcbic7XG4gICAgIGlmICggISBpZCApIHtcbiAgICBfX3AgKz0gJzwvbGFiZWw+JztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuJztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWydmaWVsZHMnXVsndGV4dGFyZWEnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbiAgICBmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxsYWJlbCc7XG4gICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9ICcgZm9yPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnXCInO1xuICAgICB9XG5cbiAgICAgaWYgKCBsYWJlbENsYXNzTmFtZSApIHtcbiAgICBfX3AgKz0gJyBjbGFzcz1cIicgK1xuICAgIF9fZSggbGFiZWxDbGFzc05hbWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnPic7XG5cbiAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPVxuICAgIF9fZSggdGl0bGUgKSArXG4gICAgJzwvbGFiZWw+JztcbiAgICAgfSBlbHNlIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHRpdGxlICk7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0PHRleHRhcmVhXFxuXHRcdCAgICc7XG4gICAgIGlmICggcGxhY2Vob2xkZXIgKSB7XG4gICAgX19wICs9ICdwbGFjZWhvbGRlcj1cIicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCAgICc7XG4gICAgIGlmICggY2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0ICAgJztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0ICAgJztcbiAgICAgaWYgKCBuYW1lICkge1xuICAgIF9fcCArPSAnbmFtZT1cIicgK1xuICAgIF9fZSggbmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdD5cXG5cdFx0JztcbiAgICAgaWYgKHZhbHVlKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB2YWx1ZSApO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdDwvdGV4dGFyZWE+XFxuJztcbiAgICAgaWYgKCAhIGlkICkge1xuICAgIF9fcCArPSAnPC9sYWJlbD4nO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ltYWdlUGxhY2Vob2xkZXInXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cXCcnICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXFwnPicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJzwvZGl2Pic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1sndHdpdHRlclByZXZpZXcnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXcgZWRpdGFibGUtcHJldmlldy0tdHdpdHRlclwiPlxcblx0PGgzIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2hlYWRpbmcgc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1leWUgZWRpdGFibGUtcHJldmlld19faGVhZGluZ1wiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0UHJldmlldyApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxzZWN0aW9uIGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19faW5uZXIgZWRpdGFibGUtcHJldmlld19faW5uZXItLXR3aXR0ZXJcIj5cXG5cdFx0PGRpdiBjbGFzcz1cInNvY2lhbC1wcmV2aWV3X19pbm5lciBzb2NpYWwtcHJldmlld19faW5uZXItLXR3aXR0ZXJcIj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZSBlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlciBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlciBlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiPlxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS10d2l0dGVyIGVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCIgPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItdGl0bGUgXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC50aXRsZSApICtcbiAgICAnXFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLXR3aXR0ZXIgZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLXR3aXR0ZXIgdHdpdHRlci1wcmV2aWV3X19kZXNjcmlwdGlvbiBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItZGVzY3JpcHRpb25cIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmRlc2NyaXB0aW9uICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tbm8tY2FyZXQgZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tdHdpdHRlciBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgXCI+XFxuXHRcdFx0XHRcdFx0JyArXG4gICAgX19lKCByZW5kZXJlZC5iYXNlVXJsICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L3NlY3Rpb24+XFxuXFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3Igc25pcHBldC1lZGl0b3JfX2hlYWRpbmctaWNvbi1lZGl0IGVkaXRhYmxlLXByZXZpZXdfX2hlYWRpbmdcIj4nICtcbiAgICBfX2UoIGkxOG4uc25pcHBldEVkaXRvciApICtcbiAgICAnPC9oMz5cXG5cXG5cdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fZm9ybVwiPlxcblxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICBpZiAoZnJlZU1vZHVsZSkge1xuICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZXMpLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgICBmcmVlRXhwb3J0cy50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXM7XG4gIH1cbiAgZWxzZSB7XG4gICAgcm9vdC50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXM7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuXG52YXIgaXNFbGVtZW50ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VsZW1lbnRcIiApO1xudmFyIGNsb25lID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9jbG9uZVwiICk7XG52YXIgZGVmYXVsdHNEZWVwID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzRGVlcFwiICk7XG5cbnZhciBKZWQgPSByZXF1aXJlKCBcImplZFwiICk7XG5cbnZhciByZW5kZXJEZXNjcmlwdGlvbiA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL3JlbmRlckRlc2NyaXB0aW9uXCIgKTtcbnZhciBpbWFnZVBsYWNlaG9sZGVyICA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2ltYWdlUGxhY2Vob2xkZXJcIiApO1xudmFyIGJlbUFkZE1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL2FkZE1vZGlmaWVyXCIgKTtcbnZhciBiZW1SZW1vdmVNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9yZW1vdmVNb2RpZmllclwiICk7XG5cbnZhciBUZXh0RmllbGQgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRJbnB1dFwiICk7XG52YXIgVGV4dEFyZWEgPSByZXF1aXJlKCBcIi4vaW5wdXRzL3RleHRhcmVhXCIgKTtcblxudmFyIElucHV0RWxlbWVudCA9IHJlcXVpcmUoIFwiLi9lbGVtZW50L2lucHV0XCIgKTtcbnZhciBQcmV2aWV3RXZlbnRzID0gcmVxdWlyZSggXCIuL3ByZXZpZXcvZXZlbnRzXCIgKTtcblxudmFyIHR3aXR0ZXJFZGl0b3JUZW1wbGF0ZSA9IHJlcXVpcmUoIFwiLi90ZW1wbGF0ZXNcIiApLnR3aXR0ZXJQcmV2aWV3O1xuXG52YXIgdHdpdHRlckRlZmF1bHRzID0ge1xuXHRkYXRhOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0dGl0bGU6IFwiXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fSxcblx0YmFzZVVSTDogXCJleGFtcGxlLmNvbVwiLFxuXHRjYWxsYmFja3M6IHtcblx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbigpIHt9LFxuXHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRyZXR1cm4gdGl0bGU7XG5cdFx0fSxcblx0XHRtb2RpZnlEZXNjcmlwdGlvbjogZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRcdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHRcdH0sXG5cdFx0bW9kaWZ5SW1hZ2VVcmw6IGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdHJldHVybiBpbWFnZVVybDtcblx0XHR9XG5cdH1cbn07XG5cbnZhciBpbnB1dFR3aXR0ZXJQcmV2aWV3QmluZGluZ3MgPSBbXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X190aXRsZS0tdHdpdHRlclwiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcInRpdGxlXCJcblx0fSxcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwiaW1hZ2VVcmxcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19fZGVzY3JpcHRpb24tLXR3aXR0ZXJcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJkZXNjcmlwdGlvblwiXG5cdH1cbl07XG5cbnZhciBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMID0gMTIwO1xudmFyIFdJRFRIX1RXSVRURVJfSU1BR0VfTEFSR0UgPSA1MDY7XG52YXIgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfV0lEVEggPSAyODA7XG52YXIgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfSEVJR0hUID0gMTUwO1xuXG4vKipcbiAqIEBtb2R1bGUgc25pcHBldFByZXZpZXdcbiAqL1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGNvbmZpZyBhbmQgb3V0cHV0VGFyZ2V0IGZvciB0aGUgU25pcHBldFByZXZpZXdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBTbmlwcGV0IHByZXZpZXcgb3B0aW9ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIgICAgICAgICAgICAgICAtIFRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgZm9yIHRoZSBmaWVsZHMsIHdpbGwgYmUgc2hvd24gYXNcbiAqIGFjdHVhbCBwbGFjZWhvbGRlcnMgaW4gdGhlIGlucHV0cyBhbmQgYXMgYSBmYWxsYmFjayBmb3IgdGhlIHByZXZpZXcuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLnRpdGxlICAgICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIHRpdGxlIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbiAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBkZXNjcmlwdGlvbiBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgaW1hZ2UgdXJsIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlICAgICAgICAgICAgICAtIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGUgZmllbGRzLCBpZiB0aGUgdXNlciBoYXMgbm90XG4gKiBjaGFuZ2VkIGEgZmllbGQsIHRoaXMgdmFsdWUgd2lsbCBiZSB1c2VkIGZvciB0aGUgYW5hbHl6ZXIsIHByZXZpZXcgYW5kIHRoZSBwcm9ncmVzcyBiYXJzLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUudGl0bGUgICAgICAgIC0gRGVmYXVsdCB0aXRsZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmRlc2NyaXB0aW9uICAtIERlZmF1bHQgZGVzY3JpcHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCAgICAgLSBEZWZhdWx0IGltYWdlIHVybC5cbiAqIGl0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuYmFzZVVSTCAgICAgICAgICAgICAgICAgICAtIFRoZSBiYXNpYyBVUkwgYXMgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdHdpdHRlci5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICAgIG9wdHMudGFyZ2V0RWxlbWVudCAgICAgICAgICAgICAtIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5jYWxsYmFja3MgICAgICAgICAgICAgICAgIC0gRnVuY3Rpb25zIHRoYXQgYXJlIGNhbGxlZCBvbiBzcGVjaWZpYyBpbnN0YW5jZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICBvcHRzLmNhbGxiYWNrcy51cGRhdGVTb2NpYWxQcmV2aWV3IC0gRnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHNvY2lhbCBwcmV2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGkxOG4gb2JqZWN0LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGkxOG4gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0RWxlbWVudCAgICAgICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50ICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgZWxlbWVudHMgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50LnJlbmRlcmVkICAgICAgICAgICAgICAgLSBUaGUgcmVuZGVyZWQgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLnRpdGxlICAgICAgICAgLSBUaGUgcmVuZGVyZWQgdGl0bGUgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQuaW1hZ2VVcmwgICAgICAtIFRoZSByZW5kZXJlZCB1cmwgcGF0aCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbiAgIC0gVGhlIHJlbmRlcmVkIHR3aXR0ZXIgZGVzY3JpcHRpb24gZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50LmlucHV0ICAgICAgICAgICAgICAgICAgLSBUaGUgaW5wdXQgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LnRpdGxlICAgICAgICAgICAgLSBUaGUgdGl0bGUgaW5wdXQgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwgICAgICAgICAtIFRoZSB1cmwgcGF0aCBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbiAgICAgIC0gVGhlIG1ldGEgZGVzY3JpcHRpb24gaW5wdXQgZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmNvbnRhaW5lciAgICAgICAgICAgICAgLSBUaGUgbWFpbiBjb250YWluZXIgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuZm9ybUNvbnRhaW5lciAgICAgICAgICAtIFRoZSBmb3JtIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5lZGl0VG9nZ2xlICAgICAgICAgICAgIC0gVGhlIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIGVkaXRvciBmb3JtLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBkYXRhIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS50aXRsZSAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRpdGxlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5pbWFnZVVybCAgICAgICAgICAgICAgICAgIC0gVGhlIHVybCBwYXRoLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5kZXNjcmlwdGlvbiAgICAgICAgICAgICAgIC0gVGhlIG1ldGEgZGVzY3JpcHRpb24uXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgYmFzZVVSTCAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiBnb29nbGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBUd2l0dGVyUHJldmlldyA9IGZ1bmN0aW9uKCBvcHRzLCBpMThuICkge1xuXHR0aGlzLmkxOG4gPSBpMThuIHx8IHRoaXMuY29uc3RydWN0STE4bigpO1xuXG5cdHR3aXR0ZXJEZWZhdWx0cy5wbGFjZWhvbGRlciA9IHtcblx0XHR0aXRsZTogdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlRoaXMgaXMgYW4gZXhhbXBsZSB0aXRsZSAtIGVkaXQgYnkgY2xpY2tpbmcgaGVyZVwiICksXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIk1vZGlmeSB5b3VyICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyBpdCByaWdodCBoZXJlXCIgKSxcblx0XHRcdFwiVHdpdHRlclwiXG5cdFx0KSxcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9O1xuXG5cdGRlZmF1bHRzRGVlcCggb3B0cywgdHdpdHRlckRlZmF1bHRzICk7XG5cblx0aWYgKCAhaXNFbGVtZW50KCBvcHRzLnRhcmdldEVsZW1lbnQgKSApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiVGhlIFR3aXR0ZXIgcHJldmlldyByZXF1aXJlcyBhIHZhbGlkIHRhcmdldCBlbGVtZW50XCIgKTtcblx0fVxuXG5cdHRoaXMuZGF0YSA9IG9wdHMuZGF0YTtcblx0dGhpcy5pMThuID0gaTE4biB8fCB0aGlzLmNvbnN0cnVjdEkxOG4oKTtcblx0dGhpcy5vcHRzID0gb3B0cztcblxuXHR0aGlzLl9jdXJyZW50Rm9jdXMgPSBudWxsO1xuXHR0aGlzLl9jdXJyZW50SG92ZXIgPSBudWxsO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBpMThuIG9iamVjdCBiYXNlZCBvbiBwYXNzZWQgY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2xhdGlvbnMgLSBUaGUgdmFsdWVzIHRvIHRyYW5zbGF0ZS5cbiAqXG4gKiBAcmV0dXJucyB7SmVkfSAtIFRoZSBKZWQgdHJhbnNsYXRpb24gb2JqZWN0LlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuY29uc3RydWN0STE4biA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbnMgKSB7XG5cdHZhciBkZWZhdWx0VHJhbnNsYXRpb25zID0ge1xuXHRcdFwiZG9tYWluXCI6IFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsXG5cdFx0XCJsb2NhbGVfZGF0YVwiOiB7XG5cdFx0XHRcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiOiB7XG5cdFx0XHRcdFwiXCI6IHt9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9ucyB8fCB7fTtcblxuXHRkZWZhdWx0c0RlZXAoIHRyYW5zbGF0aW9ucywgZGVmYXVsdFRyYW5zbGF0aW9ucyApO1xuXG5cdHJldHVybiBuZXcgSmVkKCB0cmFuc2xhdGlvbnMgKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyB0aGUgdGVtcGxhdGUgYW5kIGJpbmQgdGhlIGV2ZW50cy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW5kZXJUZW1wbGF0ZSgpO1xuXHR0aGlzLmJpbmRFdmVudHMoKTtcblx0dGhpcy51cGRhdGVQcmV2aWV3KCk7XG59O1xuXG4vKipcbiAqIFJlbmRlcnMgc25pcHBldCBlZGl0b3IgYW5kIGFkZHMgaXQgdG8gdGhlIHRhcmdldEVsZW1lbnQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdHRhcmdldEVsZW1lbnQuaW5uZXJIVE1MID0gdHdpdHRlckVkaXRvclRlbXBsYXRlKCB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiBcIlwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0XHRpbWFnZVVybDogXCJcIixcblx0XHRcdGJhc2VVcmw6IHRoaXMub3B0cy5iYXNlVVJMXG5cdFx0fSxcblx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLFxuXHRcdGkxOG46IHtcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdGVkaXQ6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiRWRpdCAlMSRzIHByZXZpZXdcIiApLCBcIlR3aXR0ZXJcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0c25pcHBldFByZXZpZXc6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBwcmV2aWV3XCIgKSwgXCJUd2l0dGVyXCIgKSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdHNuaXBwZXRFZGl0b3I6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBlZGl0b3JcIiApLCBcIlR3aXR0ZXJcIiApXG5cdFx0fVxuXHR9ICk7XG5cblx0dGhpcy5lbGVtZW50ID0ge1xuXHRcdHJlbmRlcmVkOiB7XG5cdFx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS10d2l0dGVyLXRpdGxlXCIgKVswXSxcblx0XHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItZGVzY3JpcHRpb25cIiApWzBdXG5cdFx0fSxcblx0XHRmaWVsZHM6IHRoaXMuZ2V0RmllbGRzKCksXG5cdFx0Y29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlldy0tdHdpdHRlclwiIClbMF0sXG5cdFx0Zm9ybUNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKVswXSxcblx0XHRlZGl0VG9nZ2xlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2VkaXQtYnV0dG9uXCIgKVswXSxcblx0XHRjbG9zZUVkaXRvcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19zdWJtaXRcIiApWzBdLFxuXHRcdGZvcm1GaWVsZHM6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZm9ybS1maWVsZFwiICksXG5cdFx0aGVhZGluZ0VkaXRvcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvclwiIClbMF1cblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSB0aGlzLmVsZW1lbnQuZmllbGRzLmltYWdlVXJsLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLnRpdGxlLnJlbmRlcigpXG5cdFx0KyB0aGlzLmVsZW1lbnQuZmllbGRzLmRlc2NyaXB0aW9uLnJlbmRlcigpO1xuXG5cdHRoaXMuZWxlbWVudC5pbnB1dCA9IHtcblx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRpbWFnZVVybDogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKVswXSxcblx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzID0gdGhpcy5nZXRGaWVsZEVsZW1lbnRzKCk7XG5cdHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciA9IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fc3VibWl0XCIgKVswXTtcblxuXHR0aGlzLmVsZW1lbnQubGFiZWwgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5pbnB1dC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0aGlzLmVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwucGFyZW50Tm9kZSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5lbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uLnBhcmVudE5vZGVcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQucHJldmlldyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiIClbMF0sXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuZWxlbWVudC5yZW5kZXJlZC5kZXNjcmlwdGlvbi5wYXJlbnROb2RlXG5cdH07XG5cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZm9ybSBmaWVsZHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogKiwgZGVzY3JpcHRpb246ICosIGltYWdlVXJsOiAqLCBidXR0b246IEJ1dHRvbn19IE9iamVjdCB3aXRoIHRoZSBmaWVsZHMuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRGaWVsZHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR0aXRsZTogbmV3IFRleHRGaWVsZCgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9fdGl0bGUganMtc25pcHBldC1lZGl0b3ItdGl0bGVcIixcblx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLnRpdGxlLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyB0aXRsZVwiICksXG5cdFx0XHRcdFwiVHdpdHRlclwiXG5cdFx0XHQpLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9ICksXG5cdFx0ZGVzY3JpcHRpb246IG5ldyBUZXh0QXJlYSgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9fZGVzY3JpcHRpb24ganMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIixcblx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdHRpdGxlOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBkZXNjcmlwdGlvblwiICksXG5cdFx0XHRcdFwiVHdpdHRlclwiXG5cdFx0XHQpLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9ICksXG5cdFx0aW1hZ2VVcmw6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2ltYWdlVXJsIGpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgaW1hZ2VcIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApXG5cdH07XG59O1xuXG4vKipcbiAqIFJldHVybnMgYWxsIGZpZWxkIGVsZW1lbnRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6IElucHV0RWxlbWVudCwgZGVzY3JpcHRpb246IElucHV0RWxlbWVudCwgaW1hZ2VVcmw6IElucHV0RWxlbWVudH19IFRoZSBmaWVsZCBlbGVtZW50LlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItdGl0bGVcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLnRpdGxlLFxuXHRcdFx0XHRmYWxsYmFjazogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgdGl0bGUgYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdFwiVHdpdHRlclwiXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHQgZGVzY3JpcHRpb246IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHQgdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIgKVswXSxcblx0XHRcdCB7XG5cdFx0XHRcdCBjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS5kZXNjcmlwdGlvbixcblx0XHRcdFx0IGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbixcblx0XHRcdFx0IHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBmYWxsYmFjazogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdCAgICAvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdFx0IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdCBcIlR3aXR0ZXJcIlxuXHRcdFx0XHQgKVxuXHRcdFx0IH0sXG5cdFx0XHQgdGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCApLFxuXHRcdGltYWdlVXJsOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLWltYWdlVXJsXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS5pbWFnZVVybCxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCxcblx0XHRcdFx0ZmFsbGJhY2s6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KVxuXHR9O1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB0d2l0dGVyIHByZXZpZXcuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS51cGRhdGVQcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG4vLyBVcGRhdGUgdGhlIGRhdGEuXG5cdHRoaXMuZGF0YS50aXRsZSA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldElucHV0VmFsdWUoKTtcblx0dGhpcy5kYXRhLmRlc2NyaXB0aW9uID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuaW1hZ2VVcmwgPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5pbWFnZVVybC5nZXRJbnB1dFZhbHVlKCk7XG5cblx0Ly8gU2V0cyB0aGUgdGl0bGUgZmllbGRcblx0dGhpcy5zZXRUaXRsZSggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldCB0aGUgZGVzY3JpcHRpb24gZmllbGQgYW5kIHBhcnNlIHRoZSBzdHlsaW5nIG9mIGl0LlxuXHR0aGlzLnNldERlc2NyaXB0aW9uKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRWYWx1ZSgpICk7XG5cblx0Ly8gU2V0cyB0aGUgSW1hZ2UgVVJMXG5cdHRoaXMuc2V0SW1hZ2UoIHRoaXMuZGF0YS5pbWFnZVVybCApO1xuXG5cdC8vIENsb25lIHNvIHRoZSBkYXRhIGlzbid0IGNoYW5nZWFibGUuXG5cdHRoaXMub3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyggY2xvbmUoIHRoaXMuZGF0YSApICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByZXZpZXcgdGl0bGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIFRoZSBuZXcgdGl0bGUuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRUaXRsZSA9IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0dGl0bGUgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeVRpdGxlKCB0aXRsZSApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBwcmV2aWV3IGRlc2NyaXB0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgZGVzY3JpcHRpb24gdG8gc2V0LlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdGRlc2NyaXB0aW9uID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlEZXNjcmlwdGlvbiggZGVzY3JpcHRpb24gKTtcblxuXHR0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gZGVzY3JpcHRpb247XG5cdHJlbmRlckRlc2NyaXB0aW9uKCB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24sIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldElucHV0VmFsdWUoKSApO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbWFnZSBjb250YWluZXIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29udGFpbmVyIHRoYXQgd2lsbCBob2xkIHRoZSBpbWFnZS5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldEltYWdlQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmVsZW1lbnQucHJldmlldy5pbWFnZVVybDtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgaW1hZ2Ugb2JqZWN0IHdpdGggdGhlIG5ldyBVUkwuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsIFRoZSBpbWFnZSBwYXRoLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0SW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdGltYWdlVXJsID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlJbWFnZVVybCggaW1hZ2VVcmwgKTtcblxuXHRpZiAoIGltYWdlVXJsID09PSBcIlwiICYmIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG5cdGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMuaXNUb29TbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0XHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXHRcdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTaXppbmdDbGFzcyggaW1nICk7XG5cdFx0dGhpcy5hZGRJbWFnZVRvQ29udGFpbmVyKCBpbWFnZVVybCApO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHRpbWcub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VGcm9tQ29udGFpbmVyKCk7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblx0XHR0aGlzLnNldFBsYWNlSG9sZGVyKCk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdC8vIExvYWQgaW1hZ2UgdG8gdHJpZ2dlciBsb2FkIG9yIGVycm9yIGV2ZW50LlxuXHRpbWcuc3JjID0gaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGltYWdlIG9mIHRoZSBpbWFnZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2UgVGhlIGltYWdlIHRvIHVzZS5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmFkZEltYWdlVG9Db250YWluZXIgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHZhciBjb250YWluZXIgPSB0aGlzLmdldEltYWdlQ29udGFpbmVyKCk7XG5cblx0Y29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cdGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGltYWdlICsgXCIpXCI7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGltYWdlIGZyb20gdGhlIGNvbnRhaW5lci5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcIlwiO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcm9wZXIgQ1NTIGNsYXNzIGZvciB0aGUgY3VycmVudCBpbWFnZS5cbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2UgdG8gYmFzZSB0aGUgc2l6aW5nIGNsYXNzIG9uLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0U2l6aW5nQ2xhc3MgPSBmdW5jdGlvbiggaW1nICkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGlmICggdGhpcy5pc1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdHRoaXMuc2V0U21hbGxJbWFnZUNsYXNzZXMoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuc2V0TGFyZ2VJbWFnZUNsYXNzZXMoKTtcblxuXHRyZXR1cm47XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heCBpbWFnZSB3aWR0aFxuICpcbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2Ugb2JqZWN0IHRvIHVzZS5cbiAqIEByZXR1cm5zIHtpbnR9IFRoZSBjYWxjdWxhdGVkIG1heCB3aWR0aC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldE1heEltYWdlV2lkdGggPSBmdW5jdGlvbiggaW1nICkge1xuXHRpZiAoIHRoaXMuaXNTbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHRyZXR1cm4gV0lEVEhfVFdJVFRFUl9JTUFHRV9TTUFMTDtcblx0fVxuXG5cdHJldHVybiBXSURUSF9UV0lUVEVSX0lNQUdFX0xBUkdFO1xufTtcbi8qKlxuICogU2V0cyB0aGUgZGVmYXVsdCB0d2l0dGVyIHBsYWNlaG9sZGVyXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRQbGFjZUhvbGRlciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNldFNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cblx0aW1hZ2VQbGFjZWhvbGRlcihcblx0XHR0aGlzLmVsZW1lbnQucHJldmlldy5pbWFnZVVybCxcblx0XHRcIlwiLFxuXHRcdGZhbHNlLFxuXHRcdFwidHdpdHRlclwiXG5cdCk7XG5cbn07XG5cbi8qKlxuICogRGV0ZWN0cyBpZiB0aGUgdHdpdHRlciBwcmV2aWV3IHNob3VsZCBzd2l0Y2ggdG8gc21hbGwgaW1hZ2UgbW9kZVxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyBzbWFsbC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmlzU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX1dJRFRIIHx8XG5cdFx0aW1hZ2UuaGVpZ2h0IDwgVFdJVFRFUl9JTUFHRV9USFJFU0hPTERfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIHR3aXR0ZXIgcHJldmlldyBpbWFnZSBpcyB0b28gc21hbGxcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgdG9vIHNtYWxsLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuaXNUb29TbWFsbEltYWdlID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHRyZXR1cm4gKFxuXHRcdGltYWdlLndpZHRoIDwgV0lEVEhfVFdJVFRFUl9JTUFHRV9TTUFMTCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTExcblx0KTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIHNtYWxsIGZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVtb3ZlU21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIGxhcmdlIGZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldExhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwgaW1hZ2UgY2xhc3Nlcy5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cdHRoaXMucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMoKTtcbn07XG5cbi8qKlxuICogQmluZHMgdGhlIHJlbG9hZFNuaXBwZXRUZXh0IGZ1bmN0aW9uIHRvIHRoZSBibHVyIG9mIHRoZSBzbmlwcGV0IGlucHV0cy5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHByZXZpZXdFdmVudHMgPSBuZXcgUHJldmlld0V2ZW50cyggaW5wdXRUd2l0dGVyUHJldmlld0JpbmRpbmdzLCB0aGlzLmVsZW1lbnQsIHRydWUgKTtcblx0cHJldmlld0V2ZW50cy5iaW5kRXZlbnRzKCB0aGlzLmVsZW1lbnQuZWRpdFRvZ2dsZSwgdGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFR3aXR0ZXJQcmV2aWV3O1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUVhY2gnKSxcbiAgICBjcmVhdGVGb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRm9yRWFjaCcpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGludm9raW5nIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBgaXRlcmF0ZWVgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseVxuICogYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIiBwcm9wZXJ0eVxuICogYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIGBfLmZvckluYCBvciBgXy5mb3JPd25gXG4gKiBtYXkgYmUgdXNlZCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGl0ZXJhdGVlYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXyhbMSwgMl0pLmZvckVhY2goZnVuY3Rpb24obikge1xuICogICBjb25zb2xlLmxvZyhuKTtcbiAqIH0pLnZhbHVlKCk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUgZnJvbSBsZWZ0IHRvIHJpZ2h0IGFuZCByZXR1cm5zIHRoZSBhcnJheVxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKG4sIGtleSkge1xuICogICBjb25zb2xlLmxvZyhuLCBrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBsb2dzIGVhY2ggdmFsdWUta2V5IHBhaXIgYW5kIHJldHVybnMgdGhlIG9iamVjdCAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG52YXIgZm9yRWFjaCA9IGNyZWF0ZUZvckVhY2goYXJyYXlFYWNoLCBiYXNlRWFjaCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBnZXROYXRpdmUoRGF0ZSwgJ25vdycpO1xuXG4vKipcbiAqIEdldHMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAqICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IGxvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGZ1bmN0aW9uIHRvIGJlIGludm9rZWRcbiAqL1xudmFyIG5vdyA9IG5hdGl2ZU5vdyB8fCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi4vZGF0ZS9ub3cnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgaW52b2NhdGlvbnMuIFByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QgdG8gaW5kaWNhdGUgdGhhdCBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdFxuICogYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpcyBpbnZva2VkXG4gKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzXG4gKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHA6Ly9kcnVwYWxtb3Rpb24uY29tL2FydGljbGUvZGVib3VuY2UtYW5kLXRocm90dGxlLXZpc3VhbC1leHBsYW5hdGlvbilcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZ1xuICogIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF0gVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZVxuICogIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV0gU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmdcbiAqICBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4XG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIGludm9rZSBgc2VuZE1haWxgIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHNcbiAqIGpRdWVyeSgnI3Bvc3Rib3gnKS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHNcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gKiAgICdtYXhXYWl0JzogMTAwMFxuICogfSkpO1xuICpcbiAqIC8vIGNhbmNlbCBhIGRlYm91bmNlZCBjYWxsXG4gKiB2YXIgdG9kb0NoYW5nZXMgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAxMDAwKTtcbiAqIE9iamVjdC5vYnNlcnZlKG1vZGVscy50b2RvLCB0b2RvQ2hhbmdlcyk7XG4gKlxuICogT2JqZWN0Lm9ic2VydmUobW9kZWxzLCBmdW5jdGlvbihjaGFuZ2VzKSB7XG4gKiAgIGlmIChfLmZpbmQoY2hhbmdlcywgeyAndXNlcic6ICd0b2RvJywgJ3R5cGUnOiAnZGVsZXRlJ30pKSB7XG4gKiAgICAgdG9kb0NoYW5nZXMuY2FuY2VsKCk7XG4gKiAgIH1cbiAqIH0sIFsnZGVsZXRlJ10pO1xuICpcbiAqIC8vIC4uLmF0IHNvbWUgcG9pbnQgYG1vZGVscy50b2RvYCBpcyBjaGFuZ2VkXG4gKiBtb2RlbHMudG9kby5jb21wbGV0ZWQgPSB0cnVlO1xuICpcbiAqIC8vIC4uLmJlZm9yZSAxIHNlY29uZCBoYXMgcGFzc2VkIGBtb2RlbHMudG9kb2AgaXMgZGVsZXRlZFxuICogLy8gd2hpY2ggY2FuY2VscyB0aGUgZGVib3VuY2VkIGB0b2RvQ2hhbmdlc2AgY2FsbFxuICogZGVsZXRlIG1vZGVscy50b2RvO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBhcmdzLFxuICAgICAgbWF4VGltZW91dElkLFxuICAgICAgcmVzdWx0LFxuICAgICAgc3RhbXAsXG4gICAgICB0aGlzQXJnLFxuICAgICAgdGltZW91dElkLFxuICAgICAgdHJhaWxpbmdDYWxsLFxuICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICBtYXhXYWl0ID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHdhaXQgPCAwID8gMCA6ICgrd2FpdCB8fCAwKTtcbiAgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgdHJhaWxpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhXYWl0ID0gJ21heFdhaXQnIGluIG9wdGlvbnMgJiYgbmF0aXZlTWF4KCtvcHRpb25zLm1heFdhaXQgfHwgMCwgd2FpdCk7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGxhc3RDYWxsZWQgPSAwO1xuICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXBsZXRlKGlzQ2FsbGVkLCBpZCkge1xuICAgIGlmIChpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9XG4gICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsYXllZCgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3coKSAtIHN0YW1wKTtcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgY29tcGxldGUodHJhaWxpbmdDYWxsLCBtYXhUaW1lb3V0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF4RGVsYXllZCgpIHtcbiAgICBjb21wbGV0ZSh0cmFpbGluZywgdGltZW91dElkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHN0YW1wID0gbm93KCk7XG4gICAgdGhpc0FyZyA9IHRoaXM7XG4gICAgdHJhaWxpbmdDYWxsID0gdHJhaWxpbmcgJiYgKHRpbWVvdXRJZCB8fCAhbGVhZGluZyk7XG5cbiAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgIHZhciBsZWFkaW5nQ2FsbCA9IGxlYWRpbmcgJiYgIXRpbWVvdXRJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgfVxuICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICBpc0NhbGxlZCA9IHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IG1heFdhaXQ7XG5cbiAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBtYXhUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KG1heERlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiB0aW1lb3V0SWQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGltZW91dElkICYmIHdhaXQgIT09IG1heFdhaXQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgfVxuICAgIGlmIChsZWFkaW5nQ2FsbCkge1xuICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgYXJncyA9IHRoaXNBcmcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiBhbmQgYXJndW1lbnRzIGZyb20gYHN0YXJ0YCBhbmQgYmV5b25kIHByb3ZpZGVkIGFzIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGUgW3Jlc3QgcGFyYW1ldGVyXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvRnVuY3Rpb25zL3Jlc3RfcGFyYW1ldGVycykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2F5ID0gXy5yZXN0UGFyYW0oZnVuY3Rpb24od2hhdCwgbmFtZXMpIHtcbiAqICAgcmV0dXJuIHdoYXQgKyAnICcgKyBfLmluaXRpYWwobmFtZXMpLmpvaW4oJywgJykgK1xuICogICAgIChfLnNpemUobmFtZXMpID4gMSA/ICcsICYgJyA6ICcnKSArIF8ubGFzdChuYW1lcyk7XG4gKiB9KTtcbiAqXG4gKiBzYXkoJ2hlbGxvJywgJ2ZyZWQnLCAnYmFybmV5JywgJ3BlYmJsZXMnKTtcbiAqIC8vID0+ICdoZWxsbyBmcmVkLCBiYXJuZXksICYgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gcmVzdFBhcmFtKGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6ICgrc3RhcnQgfHwgMCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdFtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHN0YXJ0KSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpcywgcmVzdCk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgcmVzdCk7XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgcmVzdCk7XG4gICAgfVxuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIGluZGV4ID0gLTE7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gcmVzdDtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RQYXJhbTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlDb3B5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5Q29weTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIFVzZWQgYnkgYF8uZGVmYXVsdHNgIHRvIGN1c3RvbWl6ZSBpdHMgYF8uYXNzaWduYCB1c2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0VmFsdWUgVGhlIGRlc3RpbmF0aW9uIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc291cmNlVmFsdWUgVGhlIHNvdXJjZSBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbkRlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogb2JqZWN0VmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduRGVmYXVsdHM7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmFzc2lnbmAgZm9yIGN1c3RvbWl6aW5nIGFzc2lnbmVkIHZhbHVlcyB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZywgbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYFxuICogZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGtleXMoc291cmNlKSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIodmFsdWUsIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKTtcblxuICAgIGlmICgocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkgfHxcbiAgICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbldpdGg7XG4iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuL2Jhc2VDb3B5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBzb3VyY2UgPT0gbnVsbFxuICAgID8gb2JqZWN0XG4gICAgOiBiYXNlQ29weShzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9hcnJheUVhY2gnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9iYXNlQXNzaWduJyksXG4gICAgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vYmFzZUZvck93bicpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vaW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9XG5jbG9uZWFibGVUYWdzW2RhdGVUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MzJUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW21hcFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZ1xuICogYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcgdmFsdWVzLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IGB2YWx1ZWAgYmVsb25ncyB0by5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIGNsb25lcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QpIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gYXJyYXlDb3B5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnO1xuXG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gaW5pdENsb25lT2JqZWN0KGlzRnVuYyA/IHt9IDogdmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjbG9uZWFibGVUYWdzW3RhZ11cbiAgICAgICAgPyBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBpc0RlZXApXG4gICAgICAgIDogKG9iamVjdCA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgc3RhY2tCIHx8IChzdGFja0IgPSBbXSk7XG5cbiAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgIH1cbiAgfVxuICAvLyBBZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMgYW5kIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyBjbG9uZS5cbiAgc3RhY2tBLnB1c2godmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gIChpc0FyciA/IGFycmF5RWFjaCA6IGJhc2VGb3JPd24pKHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2tBLCBzdGFja0IpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCIvKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb3B5KHNvdXJjZSwgcHJvcHMsIG9iamVjdCkge1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgb2JqZWN0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb3B5O1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvckluYCBhbmQgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzXG4gKiBvdmVyIGBvYmplY3RgIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvclxuICogZWFjaCBwcm9wZXJ0eS4gSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5XG4gKiByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckluYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9ySW4ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JJbjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL2FycmF5RWFjaCcpLFxuICAgIGJhc2VNZXJnZURlZXAgPSByZXF1aXJlKCcuL2Jhc2VNZXJnZURlZXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFyZ3VtZW50IGp1Z2dsaW5nLFxuICogbXVsdGlwbGUgc291cmNlcywgYW5kIGB0aGlzYCBiaW5kaW5nIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgdmFsdWVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplciwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICB2YXIgaXNTcmNBcnIgPSBpc0FycmF5TGlrZShzb3VyY2UpICYmIChpc0FycmF5KHNvdXJjZSkgfHwgaXNUeXBlZEFycmF5KHNvdXJjZSkpLFxuICAgICAgcHJvcHMgPSBpc1NyY0FyciA/IHVuZGVmaW5lZCA6IGtleXMoc291cmNlKTtcblxuICBhcnJheUVhY2gocHJvcHMgfHwgc291cmNlLCBmdW5jdGlvbihzcmNWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzcmNWYWx1ZTtcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc09iamVjdExpa2Uoc3JjVmFsdWUpKSB7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IFtdKTtcbiAgICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBiYXNlTWVyZ2UsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgICByZXN1bHQgPSBjdXN0b21pemVyID8gY3VzdG9taXplcih2YWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChpc0NvbW1vbikge1xuICAgICAgICByZXN1bHQgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICgocmVzdWx0ICE9PSB1bmRlZmluZWQgfHwgKGlzU3JjQXJyICYmICEoa2V5IGluIG9iamVjdCkpKSAmJlxuICAgICAgICAgIChpc0NvbW1vbiB8fCAocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFycmF5Q29weSA9IHJlcXVpcmUoJy4vYXJyYXlDb3B5JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzUGxhaW5PYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzVHlwZWRBcnJheScpLFxuICAgIHRvUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL3RvUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VNZXJnZWAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBtZXJnZXMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgbWVyZ2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBtZXJnZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBtZXJnZUZ1bmMsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoLFxuICAgICAgc3JjVmFsdWUgPSBzb3VyY2Vba2V5XTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gc3JjVmFsdWUpIHtcbiAgICAgIG9iamVjdFtrZXldID0gc3RhY2tCW2xlbmd0aF07XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIodmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGlzQ29tbW9uID0gcmVzdWx0ID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgcmVzdWx0ID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKHNyY1ZhbHVlKSAmJiAoaXNBcnJheShzcmNWYWx1ZSkgfHwgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkpIHtcbiAgICAgIHJlc3VsdCA9IGlzQXJyYXkodmFsdWUpXG4gICAgICAgID8gdmFsdWVcbiAgICAgICAgOiAoaXNBcnJheUxpa2UodmFsdWUpID8gYXJyYXlDb3B5KHZhbHVlKSA6IFtdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICByZXN1bHQgPSBpc0FyZ3VtZW50cyh2YWx1ZSlcbiAgICAgICAgPyB0b1BsYWluT2JqZWN0KHZhbHVlKVxuICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFkZCB0aGUgc291cmNlIHZhbHVlIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgYXNzb2NpYXRlXG4gIC8vIGl0IHdpdGggaXRzIG1lcmdlZCB2YWx1ZS5cbiAgc3RhY2tBLnB1c2goc3JjVmFsdWUpO1xuICBzdGFja0IucHVzaChyZXN1bHQpO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIG9iamVjdFtrZXldID0gbWVyZ2VGdW5jKHJlc3VsdCwgc3JjVmFsdWUsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPT09IHJlc3VsdCA/IChyZXN1bHQgIT09IHZhbHVlKSA6ICh2YWx1ZSA9PT0gdmFsdWUpKSB7XG4gICAgb2JqZWN0W2tleV0gPSByZXN1bHQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWVyZ2VEZWVwO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZENhbGxiYWNrO1xuIiwiLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBBcnJheUJ1ZmZlciA9IGdsb2JhbC5BcnJheUJ1ZmZlcixcbiAgICBVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBnaXZlbiBhcnJheSBidWZmZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBidWZmZXJDbG9uZShidWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheUJ1ZmZlcihidWZmZXIuYnl0ZUxlbmd0aCksXG4gICAgICB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkocmVzdWx0KTtcblxuICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidWZmZXJDbG9uZTtcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5hc3NpZ25gLCBgXy5kZWZhdWx0c2AsIG9yIGBfLm1lcmdlYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3RQYXJhbShmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAyID8gc291cmNlc1tsZW5ndGggLSAyXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGhpc0FyZyA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBiaW5kQ2FsbGJhY2soY3VzdG9taXplciwgdGhpc0FyZywgNSk7XG4gICAgICBsZW5ndGggLT0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VzdG9taXplciA9IHR5cGVvZiB0aGlzQXJnID09ICdmdW5jdGlvbicgPyB0aGlzQXJnIDogdW5kZWZpbmVkO1xuICAgICAgbGVuZ3RoIC09IChjdXN0b21pemVyID8gMSA6IDApO1xuICAgIH1cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGdldExlbmd0aChjb2xsZWN0aW9uKSA6IDA7XG4gICAgaWYgKCFpc0xlbmd0aChsZW5ndGgpKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSB0b09iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCJ2YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIGBfLmZvckluYCBvciBgXy5mb3JJblJpZ2h0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaXRlcmFibGUgPSB0b09iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIHJlc3RQYXJhbSA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uL3Jlc3RQYXJhbScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5kZWZhdWx0c2Agb3IgYF8uZGVmYXVsdHNEZWVwYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVmYXVsdHMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRzKGFzc2lnbmVyLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBvYmplY3QgPSBhcmdzWzBdO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgYXJncy5wdXNoKGN1c3RvbWl6ZXIpO1xuICAgIHJldHVybiBhc3NpZ25lci5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWZhdWx0cztcbiIsInZhciBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuL2JpbmRDYWxsYmFjaycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gZm9yIGBfLmZvckVhY2hgIG9yIGBfLmZvckVhY2hSaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFycmF5RnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGFuIGFycmF5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBlYWNoIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGb3JFYWNoKGFycmF5RnVuYywgZWFjaEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgaXRlcmF0ZWUgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnID09PSB1bmRlZmluZWQgJiYgaXNBcnJheShjb2xsZWN0aW9uKSlcbiAgICAgID8gYXJyYXlGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKVxuICAgICAgOiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBiaW5kQ2FsbGJhY2soaXRlcmF0ZWUsIHRoaXNBcmcsIDMpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGb3JFYWNoO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGVuZ3RoO1xuIiwidmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnLi4vbGFuZy9pc05hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgcmV0dXJuIGlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsIi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIGFycmF5IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gbmV3IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIGFycmF5IHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGJ1ZmZlckNsb25lID0gcmVxdWlyZSgnLi9idWZmZXJDbG9uZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBgUmVnRXhwYCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUZsYWdzID0gL1xcdyokLztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBidWZmZXJDbG9uZShvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgdmFyIGJ1ZmZlciA9IG9iamVjdC5idWZmZXI7XG4gICAgICByZXR1cm4gbmV3IEN0b3IoaXNEZWVwID8gYnVmZmVyQ2xvbmUoYnVmZmVyKSA6IGJ1ZmZlciwgb2JqZWN0LmJ5dGVPZmZzZXQsIG9iamVjdC5sZW5ndGgpO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yKG9iamVjdC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhvYmplY3QpKTtcbiAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSBvYmplY3QubGFzdEluZGV4O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCIvKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICghKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSB7XG4gICAgQ3RvciA9IE9iamVjdDtcbiAgfVxuICByZXR1cm4gbmV3IEN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuLi9vYmplY3QvbWVyZ2UnKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzRGVlcGAgdG8gY3VzdG9taXplIGl0cyBgXy5tZXJnZWAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9iamVjdFZhbHVlIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNvdXJjZVZhbHVlIFRoZSBzb3VyY2Ugb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBtZXJnZURlZmF1bHRzKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHNvdXJjZVZhbHVlIDogbWVyZ2Uob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBtZXJnZURlZmF1bHRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZURlZmF1bHRzO1xuIiwidmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9ICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBwcm9wc0xlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgaWYgKChhbGxvd0luZGV4ZXMgJiYgaXNJbmRleChrZXksIGxlbmd0aCkpIHx8IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaW1LZXlzO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b09iamVjdDtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlQ2xvbmUnKSxcbiAgICBiaW5kQ2FsbGJhY2sgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB2YWx1ZWAuIElmIGBpc0RlZXBgIGlzIGB0cnVlYCBuZXN0ZWQgb2JqZWN0cyBhcmUgY2xvbmVkLFxuICogb3RoZXJ3aXNlIHRoZXkgYXJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3NcbiAqIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGBcbiAqIGNsb25pbmcgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG9cbiAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHVwIHRvIHRocmVlIGFyZ3VtZW50OyAodmFsdWUgWywgaW5kZXh8a2V5LCBvYmplY3RdKS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNpbnRlcm5hbC1zdHJ1Y3R1cmVkLWNsb25pbmctYWxnb3JpdGhtKS5cbiAqIFRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhbmQgb2JqZWN0cyBjcmVhdGVkIGJ5XG4gKiBjb25zdHJ1Y3RvcnMgb3RoZXIgdGhhbiBgT2JqZWN0YCBhcmUgY2xvbmVkIHRvIHBsYWluIGBPYmplY3RgIG9iamVjdHMuIEFuXG4gKiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoIGFzIGZ1bmN0aW9ucywgRE9NIG5vZGVzLFxuICogTWFwcywgU2V0cywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZSh1c2Vycyk7XG4gKiBzaGFsbG93WzBdID09PSB1c2Vyc1swXTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiB2YXIgZGVlcCA9IF8uY2xvbmUodXNlcnMsIHRydWUpO1xuICogZGVlcFswXSA9PT0gdXNlcnNbMF07XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGVsID0gXy5jbG9uZShkb2N1bWVudC5ib2R5LCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZShmYWxzZSk7XG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIGVsID09PSBkb2N1bWVudC5ib2R5XG4gKiAvLyA9PiBmYWxzZVxuICogZWwubm9kZU5hbWVcbiAqIC8vID0+IEJPRFlcbiAqIGVsLmNoaWxkTm9kZXMubGVuZ3RoO1xuICogLy8gPT4gMFxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjdXN0b21pemVyLCB0aGlzQXJnKSB7XG4gIGlmIChpc0RlZXAgJiYgdHlwZW9mIGlzRGVlcCAhPSAnYm9vbGVhbicgJiYgaXNJdGVyYXRlZUNhbGwodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplcikpIHtcbiAgICBpc0RlZXAgPSBmYWxzZTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgaXNEZWVwID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzQXJnID0gY3VzdG9taXplcjtcbiAgICBjdXN0b21pemVyID0gaXNEZWVwO1xuICAgIGlzRGVlcCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nXG4gICAgPyBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDMpKVxuICAgIDogYmFzZUNsb25lKHZhbHVlLCBpc0RlZXApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBnZXROYXRpdmUoQXJyYXksICdpc0FycmF5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlUYWc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VsZW1lbnQoZG9jdW1lbnQuYm9keSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VsZW1lbnQoJzxib2R5PicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHZhbHVlLm5vZGVUeXBlID09PSAxICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzUGxhaW5PYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudDtcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBlbXB0eS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGVtcHR5IHVubGVzcyBpdCdzIGFuXG4gKiBgYXJndW1lbnRzYCBvYmplY3QsIGFycmF5LCBzdHJpbmcsIG9yIGpRdWVyeS1saWtlIGNvbGxlY3Rpb24gd2l0aCBhIGxlbmd0aFxuICogZ3JlYXRlciB0aGFuIGAwYCBvciBhbiBvYmplY3Qgd2l0aCBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gIWtleXModmFsdWUpLmxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaSB3aGljaCByZXR1cm4gJ2Z1bmN0aW9uJyBmb3IgcmVnZXhlc1xuICAvLyBhbmQgU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgY29uc3RydWN0b3JzLlxuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZm5Ub1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZywgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsInZhciBiYXNlRm9ySW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlRm9ySW4nKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGFzc3VtZXMgb2JqZWN0cyBjcmVhdGVkIGJ5IHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3RvclxuICogaGF2ZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogXy5pc1BsYWluT2JqZWN0KG5ldyBGb28pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHZhciBDdG9yO1xuXG4gIC8vIEV4aXQgZWFybHkgZm9yIG5vbiBgT2JqZWN0YCBvYmplY3RzLlxuICBpZiAoIShpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IG9iamVjdFRhZyAmJiAhaXNBcmd1bWVudHModmFsdWUpKSB8fFxuICAgICAgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY29uc3RydWN0b3InKSAmJiAoQ3RvciA9IHZhbHVlLmNvbnN0cnVjdG9yLCB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmICEoQ3RvciBpbnN0YW5jZW9mIEN0b3IpKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gSUUgPCA5IGl0ZXJhdGVzIGluaGVyaXRlZCBwcm9wZXJ0aWVzIGJlZm9yZSBvd24gcHJvcGVydGllcy4gSWYgdGhlIGZpcnN0XG4gIC8vIGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWRcbiAgLy8gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICB2YXIgcmVzdWx0O1xuICAvLyBJbiBtb3N0IGVudmlyb25tZW50cyBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcyBhcmUgaXRlcmF0ZWQgYmVmb3JlXG4gIC8vIGl0cyBpbmhlcml0ZWQgcHJvcGVydGllcy4gSWYgdGhlIGxhc3QgaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3NcbiAgLy8gb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gIGJhc2VGb3JJbih2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIHJlc3VsdCA9IGtleTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCByZXN1bHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCJ2YXIgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9XG50eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9IHR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlQ29weSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VDb3B5JyksXG4gICAga2V5c0luID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXNJbicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwbGFpbiBvYmplY3QgZmxhdHRlbmluZyBpbmhlcml0ZWQgZW51bWVyYWJsZVxuICogcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIHBsYWluIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgbmV3IEZvbyk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBfLnRvUGxhaW5PYmplY3QobmV3IEZvbykpO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH1cbiAqL1xuZnVuY3Rpb24gdG9QbGFpbk9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNvcHkodmFsdWUsIGtleXNJbih2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGxhaW5PYmplY3Q7XG4iLCJ2YXIgYXNzaWduV2l0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Fzc2lnbldpdGgnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUFzc2lnbicpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlQXNzaWduZXInKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLlxuICogSWYgYGN1c3RvbWl6ZXJgIGlzIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZpdmUgYXJndW1lbnRzOlxuICogKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAgYW5kIGlzIGJhc2VkIG9uXG4gKiBbYE9iamVjdC5hc3NpZ25gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QuYXNzaWduKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGFsaWFzIGV4dGVuZFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5hc3NpZ24oeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDQwIH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqIC8vIHVzaW5nIGEgY3VzdG9taXplciBjYWxsYmFja1xuICogdmFyIGRlZmF1bHRzID0gXy5wYXJ0aWFsUmlnaHQoXy5hc3NpZ24sIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICogICByZXR1cm4gXy5pc1VuZGVmaW5lZCh2YWx1ZSkgPyBvdGhlciA6IHZhbHVlO1xuICogfSk7XG4gKlxuICogZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gY3VzdG9taXplclxuICAgID8gYXNzaWduV2l0aChvYmplY3QsIHNvdXJjZSwgY3VzdG9taXplcilcbiAgICA6IGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vYXNzaWduJyksXG4gICAgYXNzaWduRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25EZWZhdWx0cycpLFxuICAgIGNyZWF0ZURlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMnKTtcblxuLyoqXG4gKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAqIG9iamVjdCBmb3IgYWxsIGRlc3RpbmF0aW9uIHByb3BlcnRpZXMgdGhhdCByZXNvbHZlIHRvIGB1bmRlZmluZWRgLiBPbmNlIGFcbiAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCB2YWx1ZXMgb2YgdGhlIHNhbWUgcHJvcGVydHkgYXJlIGlnbm9yZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0cyh7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJyB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAqL1xudmFyIGRlZmF1bHRzID0gY3JlYXRlRGVmYXVsdHMoYXNzaWduLCBhc3NpZ25EZWZhdWx0cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCJ2YXIgY3JlYXRlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVEZWZhdWx0cycpLFxuICAgIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZScpLFxuICAgIG1lcmdlRGVmYXVsdHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9tZXJnZURlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5kZWZhdWx0c2AgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgYXNzaWduc1xuICogZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHNEZWVwKHsgJ3VzZXInOiB7ICduYW1lJzogJ2Jhcm5leScgfSB9LCB7ICd1c2VyJzogeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDM2IH0gfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSB9XG4gKlxuICovXG52YXIgZGVmYXVsdHNEZWVwID0gY3JlYXRlRGVmYXVsdHMobWVyZ2UsIG1lcmdlRGVmYXVsdHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzRGVlcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9nZXROYXRpdmUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBnZXROYXRpdmUoT2JqZWN0LCAna2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICBsZW5ndGggPSAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlTWVyZ2UnKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAqIGRvbid0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgaW50byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAqIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLiBJZiBgY3VzdG9taXplcmAgaXNcbiAqIHByb3ZpZGVkIGl0J3MgaW52b2tlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvbiBhbmRcbiAqIHNvdXJjZSBwcm9wZXJ0aWVzLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCBtZXJnaW5nIGlzIGhhbmRsZWRcbiAqIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAqIHdpdGggZml2ZSBhcmd1bWVudHM6IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY3VzdG9taXplcmAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSB7XG4gKiAgICdkYXRhJzogW3sgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICd1c2VyJzogJ2ZyZWQnIH1dXG4gKiB9O1xuICpcbiAqIHZhciBhZ2VzID0ge1xuICogICAnZGF0YSc6IFt7ICdhZ2UnOiAzNiB9LCB7ICdhZ2UnOiA0MCB9XVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKHVzZXJzLCBhZ2VzKTtcbiAqIC8vID0+IHsgJ2RhdGEnOiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfSwgeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dIH1cbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBvYmplY3QgPSB7XG4gKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gKiAgICd2ZWdldGFibGVzJzogWydiZWV0J11cbiAqIH07XG4gKlxuICogdmFyIG90aGVyID0ge1xuICogICAnZnJ1aXRzJzogWydiYW5hbmEnXSxcbiAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2NhcnJvdCddXG4gKiB9O1xuICpcbiAqIF8ubWVyZ2Uob2JqZWN0LCBvdGhlciwgZnVuY3Rpb24oYSwgYikge1xuICogICBpZiAoXy5pc0FycmF5KGEpKSB7XG4gKiAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICogICB9XG4gKiB9KTtcbiAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdCddIH1cbiAqL1xudmFyIG1lcmdlID0gY3JlYXRlQXNzaWduZXIoYmFzZU1lcmdlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBibG9ja0VsZW1lbnRzID0gWyBcImFkZHJlc3NcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJibG9ja3F1b3RlXCIsIFwiY2FudmFzXCIsIFwiZGRcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLFxuXHRcImZpZ3VyZVwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImxpXCIsIFwibWFpblwiLCBcIm5hdlwiLFxuXHRcIm5vc2NyaXB0XCIsIFwib2xcIiwgXCJvdXRwdXRcIiwgXCJwXCIsIFwicHJlXCIsIFwic2VjdGlvblwiLCBcInRhYmxlXCIsIFwidGZvb3RcIiwgXCJ1bFwiLCBcInZpZGVvXCIgXTtcbnZhciBpbmxpbmVFbGVtZW50cyA9IFsgXCJiXCIsIFwiYmlnXCIsIFwiaVwiLCBcInNtYWxsXCIsIFwidHRcIiwgXCJhYmJyXCIsIFwiYWNyb255bVwiLCBcImNpdGVcIiwgXCJjb2RlXCIsIFwiZGZuXCIsIFwiZW1cIiwgXCJrYmRcIiwgXCJzdHJvbmdcIixcblx0XCJzYW1wXCIsIFwidGltZVwiLCBcInZhclwiLCBcImFcIiwgXCJiZG9cIiwgXCJiclwiLCBcImltZ1wiLCBcIm1hcFwiLCBcIm9iamVjdFwiLCBcInFcIiwgXCJzY3JpcHRcIiwgXCJzcGFuXCIsIFwic3ViXCIsIFwic3VwXCIsIFwiYnV0dG9uXCIsXG5cdFwiaW5wdXRcIiwgXCJsYWJlbFwiLCBcInNlbGVjdFwiLCBcInRleHRhcmVhXCIgXTtcblxudmFyIGJsb2NrRWxlbWVudHNSZWdleCA9IG5ldyBSZWdFeHAoIFwiXihcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwvKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcblxudmFyIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePChcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG52YXIgaW5saW5lRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo+JFwiLCBcImlcIiApO1xuXG52YXIgb3RoZXJFbGVtZW50U3RhcnRSZWdleCA9IC9ePChbXj5cXHNcXC9dKylbXj5dKj4kLztcbnZhciBvdGhlckVsZW1lbnRFbmRSZWdleCA9IC9ePFxcLyhbXj5cXHNdKylbXj5dKj4kLztcblxudmFyIGNvbnRlbnRSZWdleCA9IC9eW148XSskLztcbnZhciBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCA9IC9ePFtePjxdKiQvO1xuXG52YXIgY29tbWVudFJlZ2V4ID0gLzwhLS0oLnxbXFxyXFxuXSkqPy0tPi9nO1xuXG52YXIgY29yZSA9IHJlcXVpcmUoIFwidG9rZW5pemVyMi9jb3JlXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xuXG52YXIgdG9rZW5zID0gW107XG52YXIgaHRtbEJsb2NrVG9rZW5pemVyO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0b2tlbml6ZXIgdG8gdG9rZW5pemUgSFRNTCBpbnRvIGJsb2Nrcy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuXHR0b2tlbnMgPSBbXTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIgPSBjb3JlKCBmdW5jdGlvbiggdG9rZW4gKSB7XG5cdFx0dG9rZW5zLnB1c2goIHRva2VuICk7XG5cdH0gKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggY29udGVudFJlZ2V4LCBcImNvbnRlbnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggZ3JlYXRlclRoYW5Db250ZW50UmVnZXgsIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiYmxvY2stZW5kXCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4LCBcImlubGluZS1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBpbmxpbmVFbGVtZW50RW5kUmVnZXgsIFwiaW5saW5lLWVuZFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudFN0YXJ0UmVnZXgsIFwib3RoZXItZWxlbWVudC1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBvdGhlckVsZW1lbnRFbmRSZWdleCwgXCJvdGhlci1lbGVtZW50LWVuZFwiICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGEgYmxvY2sgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYSBibG9jayBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBpc0Jsb2NrRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gYmxvY2tFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYW4gaW5saW5lIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzSW5saW5lRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gaW5saW5lRWxlbWVudHNSZWdleC50ZXN0KCBodG1sRWxlbWVudE5hbWUgKTtcbn1cblxuLyoqXG4gKiBTcGxpdHMgYSB0ZXh0IGludG8gYmxvY2tzIGJhc2VkIG9uIEhUTUwgYmxvY2sgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3BsaXQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgbGlzdCBvZiBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0QmxvY2tzKCB0ZXh0ICkge1xuXHR2YXIgYmxvY2tzID0gW10sIGRlcHRoID0gMCxcblx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIixcblx0XHRjdXJyZW50QmxvY2sgPSBcIlwiLFxuXHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblxuXHQvLyBSZW1vdmUgYWxsIGNvbW1lbnRzIGJlY2F1c2UgaXQgaXMgdmVyeSBoYXJkIHRvIHRva2VuaXplIHRoZW0uXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGNvbW1lbnRSZWdleCwgXCJcIiApO1xuXG5cdGNyZWF0ZVRva2VuaXplcigpO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIub25UZXh0KCB0ZXh0ICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmVuZCgpO1xuXG5cdGZvckVhY2goIHRva2VucywgZnVuY3Rpb24oIHRva2VuLCBpICkge1xuXHRcdHZhciBuZXh0VG9rZW4gPSB0b2tlbnNbIGkgKyAxIF07XG5cblx0XHRzd2l0Y2ggKCB0b2tlbi50eXBlICkge1xuXG5cdFx0XHRjYXNlIFwiY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImdyZWF0ZXItdGhhbi1zaWduLWNvbnRlbnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtc3RhcnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtZW5kXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItdGFnXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcIm90aGVyLWVsZW1lbnQtZW5kXCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlciB0aGFuIHNpZ25cIjpcblx0XHRcdFx0aWYgKCAhIG5leHRUb2tlbiB8fCAoIGRlcHRoID09PSAwICYmICggbmV4dFRva2VuLnR5cGUgPT09IFwiYmxvY2stc3RhcnRcIiB8fCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1lbmRcIiApICkgKSB7XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiYmxvY2stc3RhcnRcIjpcblx0XHRcdFx0aWYgKCBkZXB0aCAhPT0gMCApIHtcblx0XHRcdFx0XHRpZiAoIGN1cnJlbnRCbG9jay50cmltKCkgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRibG9ja3MucHVzaCggY3VycmVudEJsb2NrICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVwdGgrKztcblx0XHRcdFx0YmxvY2tTdGFydFRhZyA9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1lbmRcIjpcblx0XHRcdFx0ZGVwdGgtLTtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSB0b2tlbi5zcmM7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ICogV2UgdHJ5IHRvIG1hdGNoIHRoZSBtb3N0IGRlZXAgYmxvY2tzIHNvIGRpc2NhcmQgYW55IG90aGVyIGJsb2NrcyB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGJ1dCBub3Rcblx0XHRcdFx0ICogZmluaXNoZWQuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRpZiAoIFwiXCIgIT09IGJsb2NrU3RhcnRUYWcgJiYgXCJcIiAhPT0gYmxvY2tFbmRUYWcgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGJsb2NrU3RhcnRUYWcgKyBjdXJyZW50QmxvY2sgKyBibG9ja0VuZFRhZyApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBcIlwiICE9PSBjdXJyZW50QmxvY2sudHJpbSgpICkge1xuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvLyBIYW5kbGVzIEhUTUwgd2l0aCB0b28gbWFueSBjbG9zaW5nIHRhZ3MuXG5cdFx0aWYgKCBkZXB0aCA8IDAgKSB7XG5cdFx0XHRkZXB0aCA9IDA7XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIGJsb2Nrcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGJsb2NrRWxlbWVudHM6IGJsb2NrRWxlbWVudHMsXG5cdGlubGluZUVsZW1lbnRzOiBpbmxpbmVFbGVtZW50cyxcblx0aXNCbG9ja0VsZW1lbnQ6IGlzQmxvY2tFbGVtZW50LFxuXHRpc0lubGluZUVsZW1lbnQ6IGlzSW5saW5lRWxlbWVudCxcblx0Z2V0QmxvY2tzOiBtZW1vaXplKCBnZXRCbG9ja3MgKSxcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MgKi9cblxudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudHMgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvaHRtbC5qc1wiICkuYmxvY2tFbGVtZW50cztcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PlwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCI8LyhcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPz4kXCIsIFwiaVwiICk7XG5cbi8qKlxuICogU3RyaXAgaW5jb21wbGV0ZSB0YWdzIHdpdGhpbiBhIHRleHQuIFN0cmlwcyBhbiBlbmR0YWcgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHN0cmluZyBhbmQgdGhlIHN0YXJ0IHRhZyBhdCB0aGUgZW5kIG9mIGFcbiAqIHN0YXJ0IG9mIGEgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgdGhlIEhUTUwtdGFncyBmcm9tIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBIVE1MLXRhZ3MgYXQgdGhlIGJlZ2luIGFuZCBlbmQuXG4gKi9cbnZhciBzdHJpcEluY29tcGxldGVUYWdzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eKDxcXC8oW14+XSspPikrL2ksIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFteXFwvPl0rKT4pKyQvaSwgXCJcIiApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgYmxvY2sgZWxlbWVudCB0YWdzIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZyBhbmQgcmV0dXJucyB0aGlzIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdW5mb3JtYXR0ZWQgc3RyaW5nLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCByZW1vdmVkIEhUTUwgYmVnaW4gYW5kIGVuZCBibG9jayBlbGVtZW50c1xuICovXG52YXIgc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiXCIgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFN0cmlwIEhUTUwtdGFncyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncy5cbiAqL1xudmFyIHN0cmlwRnVsbFRhZ3MgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFtePl0rKT4pL2lnLCBcIiBcIiApO1xuXHR0ZXh0ID0gc3RyaXBTcGFjZXMoIHRleHQgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RyaXBGdWxsVGFnczogc3RyaXBGdWxsVGFncyxcblx0c3RyaXBJbmNvbXBsZXRlVGFnczogc3RyaXBJbmNvbXBsZXRlVGFncyxcblx0c3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kOiBzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmQsXG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcyAqL1xuXG4vKipcbiAqIFN0cmlwIGRvdWJsZSBzcGFjZXMgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgc3BhY2VzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGRvdWJsZSBzcGFjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0Ly8gUmVwbGFjZSBtdWx0aXBsZSBzcGFjZXMgd2l0aCBzaW5nbGUgc3BhY2Vcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc3syLH0vZywgXCIgXCIgKTtcblxuXHQvLyBSZXBsYWNlIHNwYWNlcyBmb2xsb3dlZCBieSBwZXJpb2RzIHdpdGggb25seSB0aGUgcGVyaW9kLlxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxzXFwuL2csIFwiLlwiICk7XG5cblx0Ly8gUmVtb3ZlIGZpcnN0L2xhc3QgY2hhcmFjdGVyIGlmIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eXFxzK3xcXHMrJC9nLCBcIlwiICk7XG5cblx0cmV0dXJuIHRleHQ7XG59O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIl19
