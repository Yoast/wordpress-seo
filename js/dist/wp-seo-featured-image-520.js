(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {
	"use strict";

	var featuredImagePlugin;
	var $featuredImageElement;
	var $postImageDiv;
	var $postImageDivHeading;

	var FeaturedImagePlugin = function FeaturedImagePlugin(app) {
		this._app = app;

		this.featuredImage = null;
		this.pluginName = "addFeaturedImagePlugin";

		this.registerPlugin();
		this.registerModifications();
	};

	/**
  * Set's the featured image to use in the analysis
  *
  * @param {String} featuredImage
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.setFeaturedImage = function (featuredImage) {
		this.featuredImage = featuredImage;

		this._app.pluginReloaded(this.pluginName);
	};

	/**
  * Removes featured image and reloads analyzer
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.removeFeaturedImage = function () {
		this.setFeaturedImage(null);
	};

	/**
  * Registers this plugin to YoastSEO
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.registerPlugin = function () {
		this._app.registerPlugin(this.pluginName, { status: "ready" });
	};

	/**
  * Registers modifications to YoastSEO
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.registerModifications = function () {
		this._app.registerModification("content", this.addImageToContent.bind(this), this.pluginName, 10);
	};

	/**
  * Adds featured image to sort so it can be analyzed
  *
  * @param {String} content
  * @returns {String}
  */
	FeaturedImagePlugin.prototype.addImageToContent = function (content) {
		if (null !== this.featuredImage) {
			content += this.featuredImage;
		}

		return content;
	};

	/**
  * Remove opengraph warning frame and borders
  *
  * @returns {void}
  */
	function removeOpengraphWarning() {
		$("#yst_opengraph_image_warning").remove();
		$postImageDiv.removeClass("yoast-opengraph-image-notice");
	}

	/**
  * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
  * @param {object} featuredImage
  *
  * @returns {void}
  */
	function checkFeaturedImage(featuredImage) {
		var attachment = featuredImage.state().get("selection").first().toJSON();

		if (attachment.width < 200 || attachment.height < 200) {
			// Show warning to user and do not add image to OG
			if (0 === $("#yst_opengraph_image_warning").length) {
				// Create a warning using native WordPress notices styling.
				$('<div id="yst_opengraph_image_warning" class="notice notice-error notice-alt"><p>' + wpseoFeaturedImageL10n.featured_image_notice + "</p></div>").insertAfter($postImageDivHeading);

				$postImageDiv.addClass("yoast-opengraph-image-notice");

				(0, _a11ySpeak2.default)(wpseoFeaturedImageL10n.featured_image_notice, "assertive");
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	$(document).ready(function () {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin(YoastSEO.app);

		$postImageDiv = $("#postimagediv");
		$postImageDivHeading = $postImageDiv.find(".hndle");

		featuredImage.on("select", function () {
			var selectedImageHTML, selectedImage, alt;

			checkFeaturedImage(featuredImage);

			selectedImage = featuredImage.state().get("selection").first();

			// WordPress falls back to the title for the alt attribute if no alt is present.
			alt = selectedImage.get("alt");

			if ("" === alt) {
				alt = selectedImage.get("title");
			}

			selectedImageHTML = "<img" + ' src="' + selectedImage.get("url") + '"' + ' width="' + selectedImage.get("width") + '"' + ' height="' + selectedImage.get("height") + '"' + ' alt="' + alt + '"/>';

			featuredImagePlugin.setFeaturedImage(selectedImageHTML);
		});

		$postImageDiv.on("click", "#remove-post-thumbnail", function () {
			featuredImagePlugin.removeFeaturedImage();
			removeOpengraphWarning();
		});

		$featuredImageElement = $("#set-post-thumbnail > img");
		if ("undefined" !== typeof $featuredImageElement.prop("src")) {
			featuredImagePlugin.setFeaturedImage($("#set-post-thumbnail ").html());
		}
	});
})(jQuery);

/* eslint-disable */
/* jshint ignore:start */
/**
 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
 * @param {object} featuredImage
 *
 * @deprecated since 3.1
 */
/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */
function yst_checkFeaturedImage(featuredImage) {
	return;
}

/**
 * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id
 * @type {number}
 *
 * @deprecated since 3.1
 */
var thumbIdCounter = 0;

/**
 * Variable to hold the onclick function for remove-post-thumbnail.
 * @type {function}
 *
 * @deprecated since 3.1
 */
var removeThumb;

/**
 * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning
 * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop
 *
 * @deprecated since 3.1
 */
function yst_overrideElemFunction() {
	return;
}

/**
 * Remove error message
 */
function yst_removeOpengraphWarning() {
	return;
}

window.yst_checkFeaturedImage = yst_checkFeaturedImage;
window.thumbIdCounter = thumbIdCounter;
window.removeThumb = removeThumb;
window.yst_overrideElemFunction = yst_overrideElemFunction;
window.yst_removeOpengraphWarning = yst_removeOpengraphWarning;
/* jshint ignore:end */
/* eslint-enable */

},{"a11y-speak":2}],2:[function(require,module,exports){
var containerPolite, containerAssertive, previousMessage = "";

/**
 * Build the live regions markup.
 *
 * @param {String} ariaLive Optional. Value for the "aria-live" attribute, default "polite".
 *
 * @returns {Object} $container The ARIA live region jQuery object.
 */
var addContainer = function( ariaLive ) {
	ariaLive = ariaLive || "polite";

	var container = document.createElement( "div" );
	container.id = "a11y-speak-" + ariaLive;
	container.className = "a11y-speak-region";

	var screenReaderTextStyle = "clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;";
	container.setAttribute( "style", screenReaderTextStyle );

	container.setAttribute( "aria-live", ariaLive );
	container.setAttribute( "aria-relevant", "additions text" );
	container.setAttribute( "aria-atomic", "true" );

	document.querySelector( "body" ).appendChild( container );
	return container;
};

/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Function} callback A function to execute after the DOM is ready.
 *
 * @returns {void}
 */
var domReady = function( callback ) {
	if ( document.readyState === "complete" || ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
		return callback();
	}

	document.addEventListener( "DOMContentLoaded", callback );
};

/**
 * Create the live regions when the DOM is fully loaded.
 */
domReady( function() {
	containerPolite = document.getElementById( "a11y-speak-polite" );
	containerAssertive = document.getElementById( "a11y-speak-assertive" );

	if ( containerPolite === null ) {
		containerPolite = addContainer( "polite" );
	}
	if ( containerAssertive === null ) {
		containerAssertive = addContainer( "assertive" );
	}
} );

/**
 * Clear the live regions.
 */
var clear = function() {
	var regions = document.querySelectorAll( ".a11y-speak-region" );
	for ( var i = 0; i < regions.length; i++ ) {
		regions[ i ].textContent = "";
	}
};

/**
 * Update the ARIA live notification area text node.
 *
 * @param {String} message  The message to be announced by Assistive Technologies.
 * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:
 *                          polite or assertive. Default polite.
 */
var A11ySpeak = function( message, ariaLive ) {
	// Clear previous messages to allow repeated strings being read out.
	clear();

	/*
	 * Strip HTML tags (if any) from the message string. Ideally, messages should
	 * be simple strings, carefully crafted for specific use with A11ySpeak.
	 * When re-using already existing strings this will ensure simple HTML to be
	 * stripped out and replaced with a space. Browsers will collapse multiple
	 * spaces natively.
	 */
	message = message.replace( /<[^<>]+>/g, " " );

	if ( previousMessage === message ) {
		message = message + "\u00A0";
	}

	previousMessage = message;

	if ( containerAssertive && "assertive" === ariaLive ) {
		containerAssertive.textContent = message;
	} else if ( containerPolite ) {
		containerPolite.textContent = message;
	}
};

module.exports = A11ySpeak;

},{}]},{},[1]);
