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
  * Sets the featured image to use in the analysis
  *
  * @param {String} featuredImage The featured image to use.
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
  * @param {String} content The content to alter.
  *
  * @returns {String} Returns the possible altered content.
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
  *
  * @param {object} featuredImage The featured image object.
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

		if (typeof YoastSEO === "undefined") {
			return;
		}

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDS0E7Ozs7OztBQUVFLFdBQVUsQ0FBVixFQUFjO0FBQ2Y7O0FBQ0EsS0FBSSxtQkFBSjtBQUNBLEtBQUkscUJBQUo7QUFDQSxLQUFJLGFBQUo7QUFDQSxLQUFJLG9CQUFKOztBQUVBLEtBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLEdBQVYsRUFBZ0I7QUFDekMsT0FBSyxJQUFMLEdBQVksR0FBWjs7QUFFQSxPQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxPQUFLLFVBQUwsR0FBa0Isd0JBQWxCOztBQUVBLE9BQUssY0FBTDtBQUNBLE9BQUsscUJBQUw7QUFDQSxFQVJEOztBQVVBOzs7Ozs7O0FBT0EscUJBQW9CLFNBQXBCLENBQThCLGdCQUE5QixHQUFpRCxVQUFVLGFBQVYsRUFBMEI7QUFDMUUsT0FBSyxhQUFMLEdBQXFCLGFBQXJCOztBQUVBLE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQjtBQUNBLEVBSkQ7O0FBTUE7Ozs7O0FBS0EscUJBQW9CLFNBQXBCLENBQThCLG1CQUE5QixHQUFvRCxZQUFXO0FBQzlELE9BQUssZ0JBQUwsQ0FBdUIsSUFBdkI7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLHFCQUFvQixTQUFwQixDQUE4QixjQUE5QixHQUErQyxZQUFXO0FBQ3pELE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQixFQUEyQyxFQUFFLFFBQVEsT0FBVixFQUEzQztBQUNBLEVBRkQ7O0FBSUE7Ozs7O0FBS0EscUJBQW9CLFNBQXBCLENBQThCLHFCQUE5QixHQUFzRCxZQUFXO0FBQ2hFLE9BQUssSUFBTCxDQUFVLG9CQUFWLENBQWdDLFNBQWhDLEVB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cCAqL1xuLyogZ2xvYmFsIHdwc2VvRmVhdHVyZWRJbWFnZUwxMG4gKi9cbi8qIGdsb2JhbCBZb2FzdFNFTyAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgLVcwMDMgKi9cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdHZhciBmZWF0dXJlZEltYWdlUGx1Z2luO1xuXHR2YXIgJGZlYXR1cmVkSW1hZ2VFbGVtZW50O1xuXHR2YXIgJHBvc3RJbWFnZURpdjtcblx0dmFyICRwb3N0SW1hZ2VEaXZIZWFkaW5nO1xuXG5cdHZhciBGZWF0dXJlZEltYWdlUGx1Z2luID0gZnVuY3Rpb24oIGFwcCApIHtcblx0XHR0aGlzLl9hcHAgPSBhcHA7XG5cblx0XHR0aGlzLmZlYXR1cmVkSW1hZ2UgPSBudWxsO1xuXHRcdHRoaXMucGx1Z2luTmFtZSA9IFwiYWRkRmVhdHVyZWRJbWFnZVBsdWdpblwiO1xuXG5cdFx0dGhpcy5yZWdpc3RlclBsdWdpbigpO1xuXHRcdHRoaXMucmVnaXN0ZXJNb2RpZmljYXRpb25zKCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGZlYXR1cmVkIGltYWdlIHRvIHVzZSBpbiB0aGUgYW5hbHlzaXNcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGZlYXR1cmVkSW1hZ2UgVGhlIGZlYXR1cmVkIGltYWdlIHRvIHVzZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5zZXRGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0dGhpcy5mZWF0dXJlZEltYWdlID0gZmVhdHVyZWRJbWFnZTtcblxuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWxvYWRlZCggdGhpcy5wbHVnaW5OYW1lICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgZmVhdHVyZWQgaW1hZ2UgYW5kIHJlbG9hZHMgYW5hbHl6ZXJcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZW1vdmVGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRGZWF0dXJlZEltYWdlKCBudWxsICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyB0aGlzIHBsdWdpbiB0byBZb2FzdFNFT1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyUGx1Z2luID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyUGx1Z2luKCB0aGlzLnBsdWdpbk5hbWUsIHsgc3RhdHVzOiBcInJlYWR5XCIgfSApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgbW9kaWZpY2F0aW9ucyB0byBZb2FzdFNFT1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggXCJjb250ZW50XCIsIHRoaXMuYWRkSW1hZ2VUb0NvbnRlbnQuYmluZCggdGhpcyApLCB0aGlzLnBsdWdpbk5hbWUsIDEwICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMgZmVhdHVyZWQgaW1hZ2UgdG8gc29ydCBzbyBpdCBjYW4gYmUgYW5hbHl6ZWRcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgVGhlIGNvbnRlbnQgdG8gYWx0ZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFJldHVybnMgdGhlIHBvc3NpYmxlIGFsdGVyZWQgY29udGVudC5cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLmFkZEltYWdlVG9Db250ZW50ID0gZnVuY3Rpb24oIGNvbnRlbnQgKSB7XG5cdFx0aWYgKCBudWxsICE9PSB0aGlzLmZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0XHRjb250ZW50ICs9IHRoaXMuZmVhdHVyZWRJbWFnZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlIG9wZW5ncmFwaCB3YXJuaW5nIGZyYW1lIGFuZCBib3JkZXJzXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlT3BlbmdyYXBoV2FybmluZygpIHtcblx0XHQkKCBcIiN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiApLnJlbW92ZSgpO1xuXHRcdCRwb3N0SW1hZ2VEaXYucmVtb3ZlQ2xhc3MoIFwieW9hc3Qtb3BlbmdyYXBoLWltYWdlLW5vdGljZVwiICk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgaW1hZ2UgaXMgc21hbGxlciB0aGFuIDIwMHgyMDAgcGl4ZWxzLiBJZiB0aGlzIGlzIHRoZSBjYXNlLCBzaG93IGEgd2FybmluZ1xuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZmVhdHVyZWRJbWFnZSBUaGUgZmVhdHVyZWQgaW1hZ2Ugb2JqZWN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcblx0XHR2YXIgYXR0YWNobWVudCA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLnRvSlNPTigpO1xuXG5cdFx0aWYgKCBhdHRhY2htZW50LndpZHRoIDwgMjAwIHx8IGF0dGFjaG1lbnQuaGVpZ2h0IDwgMjAwICkge1xuXHRcdFx0Ly8gU2hvdyB3YXJuaW5nIHRvIHVzZXIgYW5kIGRvIG5vdCBhZGQgaW1hZ2UgdG8gT0dcblx0XHRcdGlmICggMCA9PT0gJCggXCIjeXN0X29wZW5ncmFwaF9pbWFnZV93YXJuaW5nXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdC8vIENyZWF0ZSBhIHdhcm5pbmcgdXNpbmcgbmF0aXZlIFdvcmRQcmVzcyBub3RpY2VzIHN0eWxpbmcuXG5cdFx0XHRcdCQoICc8ZGl2IGlkPVwieXN0X29wZW5ncmFwaF9pbWFnZV93YXJuaW5nXCIgY2xhc3M9XCJub3RpY2Ugbm90aWNlLWVycm9yIG5vdGljZS1hbHRcIj48cD4nICtcblx0XHRcdFx0XHR3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuLmZlYXR1cmVkX2ltYWdlX25vdGljZSArXG5cdFx0XHRcdFx0XCI8L3A+PC9kaXY+XCIgKVxuXHRcdFx0XHRcdC5pbnNlcnRBZnRlciggJHBvc3RJbWFnZURpdkhlYWRpbmcgKTtcblxuXHRcdFx0XHQkcG9zdEltYWdlRGl2LmFkZENsYXNzKCBcInlvYXN0LW9wZW5ncmFwaC1pbWFnZS1ub3RpY2VcIiApO1xuXG5cdFx0XHRcdGExMXlTcGVhayggd3BzZW9GZWF0dXJlZEltYWdlTDEwbi5mZWF0dXJlZF9pbWFnZV9ub3RpY2UsIFwiYXNzZXJ0aXZlXCIgKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRm9yY2UgcmVzZXQgd2FybmluZ1xuXHRcdFx0cmVtb3ZlT3BlbmdyYXBoV2FybmluZygpO1xuXHRcdH1cblx0fVxuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBmZWF0dXJlZEltYWdlID0gd3AubWVkaWEuZmVhdHVyZWRJbWFnZS5mcmFtZSgpO1xuXG5cdFx0aWYgKCB0eXBlb2YgWW9hc3RTRU8gPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbiA9IG5ldyBGZWF0dXJlZEltYWdlUGx1Z2luKCBZb2FzdFNFTy5hcHAgKTtcblxuXHRcdCRwb3N0SW1hZ2VEaXYgPSAkKCBcIiNwb3N0aW1hZ2VkaXZcIiApO1xuXHRcdCRwb3N0SW1hZ2VEaXZIZWFkaW5nID0gJHBvc3RJbWFnZURpdi5maW5kKCBcIi5obmRsZVwiICk7XG5cblx0XHRmZWF0dXJlZEltYWdlLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxlY3RlZEltYWdlSFRNTCwgc2VsZWN0ZWRJbWFnZSwgYWx0O1xuXG5cdFx0XHRjaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKTtcblxuXHRcdFx0c2VsZWN0ZWRJbWFnZSA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpO1xuXG5cdFx0XHQvLyBXb3JkUHJlc3MgZmFsbHMgYmFjayB0byB0aGUgdGl0bGUgZm9yIHRoZSBhbHQgYXR0cmlidXRlIGlmIG5vIGFsdCBpcyBwcmVzZW50LlxuXHRcdFx0YWx0ID0gc2VsZWN0ZWRJbWFnZS5nZXQoIFwiYWx0XCIgKTtcblxuXHRcdFx0aWYgKCBcIlwiID09PSBhbHQgKSB7XG5cdFx0XHRcdGFsdCA9IHNlbGVjdGVkSW1hZ2UuZ2V0KCBcInRpdGxlXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0ZWRJbWFnZUhUTUwgPSBcIjxpbWdcIiArXG5cdFx0XHRcdCcgc3JjPVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCBcInVybFwiICkgKyAnXCInICtcblx0XHRcdFx0JyB3aWR0aD1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggXCJ3aWR0aFwiICkgKyAnXCInICtcblx0XHRcdFx0JyBoZWlnaHQ9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwiaGVpZ2h0XCIgKSArICdcIicgK1xuXHRcdFx0XHQnIGFsdD1cIicgKyBhbHQgK1xuXHRcdFx0XHQnXCIvPic7XG5cblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4uc2V0RmVhdHVyZWRJbWFnZSggc2VsZWN0ZWRJbWFnZUhUTUwgKTtcblx0XHR9ICk7XG5cblx0XHQkcG9zdEltYWdlRGl2Lm9uKCBcImNsaWNrXCIsIFwiI3JlbW92ZS1wb3N0LXRodW1ibmFpbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4ucmVtb3ZlRmVhdHVyZWRJbWFnZSgpO1xuXHRcdFx0cmVtb3ZlT3BlbmdyYXBoV2FybmluZygpO1xuXHRcdH0gKTtcblxuXHRcdCRmZWF0dXJlZEltYWdlRWxlbWVudCA9ICQoIFwiI3NldC1wb3N0LXRodW1ibmFpbCA+IGltZ1wiICk7XG5cdFx0aWYgKCBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgJGZlYXR1cmVkSW1hZ2VFbGVtZW50LnByb3AoIFwic3JjXCIgKSApIHtcblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4uc2V0RmVhdHVyZWRJbWFnZSggJCggXCIjc2V0LXBvc3QtdGh1bWJuYWlsIFwiICkuaHRtbCgpICk7XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuLyoqXG4gKiBDaGVjayBpZiBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gMjAweDIwMCBwaXhlbHMuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHNob3cgYSB3YXJuaW5nXG4gKiBAcGFyYW0ge29iamVjdH0gZmVhdHVyZWRJbWFnZVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG5mdW5jdGlvbiB5c3RfY2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICkge1xuXHRyZXR1cm47XG59XG5cbi8qKlxuICogQ291bnRlciB0byBtYWtlIHN1cmUgd2UgZG8gbm90IGVuZCB1cCBpbiBhbiBlbmRsZXNzIGxvb3AgaWYgdGhlcmUnIG5vIHJlbW92ZS1wb3N0LXRodW1ibmFpbCBpZFxuICogQHR5cGUge251bWJlcn1cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xudmFyIHRodW1iSWRDb3VudGVyID0gMDtcblxuLyoqXG4gKiBWYXJpYWJsZSB0byBob2xkIHRoZSBvbmNsaWNrIGZ1bmN0aW9uIGZvciByZW1vdmUtcG9zdC10aHVtYm5haWwuXG4gKiBAdHlwZSB7ZnVuY3Rpb259XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbnZhciByZW1vdmVUaHVtYjtcblxuLyoqXG4gKiBJZiB0aGVyZSdzIGEgcmVtb3ZlLXBvc3QtdGh1bWJuYWlsIGlkLCBhZGQgYW4gb25jbGljay4gV2hlbiB0aGlzIGlkIGlzIGNsaWNrZWQsIGNhbGwgeXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmdcbiAqIElmIG5vdCwgY2hlY2sgYWdhaW4gYWZ0ZXIgMTAwbXMuIERvIG5vdCBkbyB0aGlzIGZvciBtb3JlIHRoYW4gMTAgdGltZXMgc28gd2UgZG8gbm90IGVuZCB1cCBpbiBhbiBlbmRsZXNzIGxvb3BcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xuZnVuY3Rpb24geXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uKCkge1xuXHRyZXR1cm47XG59XG5cbi8qKlxuICogUmVtb3ZlIGVycm9yIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24geXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKSB7XG5cdHJldHVybjtcbn1cblxud2luZG93LnlzdF9jaGVja0ZlYXR1cmVkSW1hZ2UgPSB5c3RfY2hlY2tGZWF0dXJlZEltYWdlO1xud2luZG93LnRodW1iSWRDb3VudGVyID0gdGh1bWJJZENvdW50ZXI7XG53aW5kb3cucmVtb3ZlVGh1bWIgPSByZW1vdmVUaHVtYjtcbndpbmRvdy55c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24gPSB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb247XG53aW5kb3cueXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmcgPSB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZztcbi8qIGpzaGludCBpZ25vcmU6ZW5kICovXG4vKiBlc2xpbnQtZW5hYmxlICovXG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
