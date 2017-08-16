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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDS0E7Ozs7OztBQUVFLFdBQVUsQ0FBVixFQUFjO0FBQ2Y7O0FBQ0EsS0FBSSxtQkFBSjtBQUNBLEtBQUkscUJBQUo7QUFDQSxLQUFJLGFBQUo7QUFDQSxLQUFJLG9CQUFKOztBQUVBLEtBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLEdBQVYsRUFBZ0I7QUFDekMsT0FBSyxJQUFMLEdBQVksR0FBWjs7QUFFQSxPQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxPQUFLLFVBQUwsR0FBa0Isd0JBQWxCOztBQUVBLE9BQUssY0FBTDtBQUNBLE9BQUsscUJBQUw7QUFDQSxFQVJEOztBQVVBOzs7Ozs7O0FBT0EscUJBQW9CLFNBQXBCLENBQThCLGdCQUE5QixHQUFpRCxVQUFVLGFBQVYsRUFBMEI7QUFDMUUsT0FBSyxhQUFMLEdBQXFCLGFBQXJCOztBQUVBLE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQjtBQUNBLEVBSkQ7O0FBTUE7Ozs7O0FBS0EscUJBQW9CLFNBQXBCLENBQThCLG1CQUE5QixHQUFvRCxZQUFXO0FBQzlELE9BQUssZ0JBQUwsQ0FBdUIsSUFBdkI7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLHFCQUFvQixTQUFwQixDQUE4QixjQUE5QixHQUErQyxZQUFXO0FBQ3pELE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQixFQUEyQyxFQUFFLFFBQVEsT0FBVixFQUEzQztBQUNBLEVBRkQ7O0FBSUE7Ozs7O0FBS0EscUJBQW9CLFNBQXBCLENBQThCLHFCQUE5QixHQUFzRCxZQUFXO0FBQ2hFLE9BQUssSUFBTCxDQUFVLG9CQUFWLENBQWdDLFNBQWhDLEVB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b3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3AgKi9cbi8qIGdsb2JhbCB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuICovXG4vKiBnbG9iYWwgWW9hc3RTRU8gKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IC1XMDAzICovXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgZmVhdHVyZWRJbWFnZVBsdWdpbjtcblx0dmFyICRmZWF0dXJlZEltYWdlRWxlbWVudDtcblx0dmFyICRwb3N0SW1hZ2VEaXY7XG5cdHZhciAkcG9zdEltYWdlRGl2SGVhZGluZztcblxuXHR2YXIgRmVhdHVyZWRJbWFnZVBsdWdpbiA9IGZ1bmN0aW9uKCBhcHAgKSB7XG5cdFx0dGhpcy5fYXBwID0gYXBwO1xuXG5cdFx0dGhpcy5mZWF0dXJlZEltYWdlID0gbnVsbDtcblx0XHR0aGlzLnBsdWdpbk5hbWUgPSBcImFkZEZlYXR1cmVkSW1hZ2VQbHVnaW5cIjtcblxuXHRcdHRoaXMucmVnaXN0ZXJQbHVnaW4oKTtcblx0XHR0aGlzLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucygpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBmZWF0dXJlZCBpbWFnZSB0byB1c2UgaW4gdGhlIGFuYWx5c2lzXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBmZWF0dXJlZEltYWdlIFRoZSBmZWF0dXJlZCBpbWFnZSB0byB1c2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUuc2V0RmVhdHVyZWRJbWFnZSA9IGZ1bmN0aW9uKCBmZWF0dXJlZEltYWdlICkge1xuXHRcdHRoaXMuZmVhdHVyZWRJbWFnZSA9IGZlYXR1cmVkSW1hZ2U7XG5cblx0XHR0aGlzLl9hcHAucGx1Z2luUmVsb2FkZWQoIHRoaXMucGx1Z2luTmFtZSApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGZlYXR1cmVkIGltYWdlIGFuZCByZWxvYWRzIGFuYWx5emVyXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUucmVtb3ZlRmVhdHVyZWRJbWFnZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0RmVhdHVyZWRJbWFnZSggbnVsbCApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGhpcyBwbHVnaW4gdG8gWW9hc3RTRU9cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZWdpc3RlclBsdWdpbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3RlclBsdWdpbiggdGhpcy5wbHVnaW5OYW1lLCB7IHN0YXR1czogXCJyZWFkeVwiIH0gKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIG1vZGlmaWNhdGlvbnMgdG8gWW9hc3RTRU9cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZWdpc3Rlck1vZGlmaWNhdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJNb2RpZmljYXRpb24oIFwiY29udGVudFwiLCB0aGlzLmFkZEltYWdlVG9Db250ZW50LmJpbmQoIHRoaXMgKSwgdGhpcy5wbHVnaW5OYW1lLCAxMCApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBBZGRzIGZlYXR1cmVkIGltYWdlIHRvIHNvcnQgc28gaXQgY2FuIGJlIGFuYWx5emVkXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50IFRoZSBjb250ZW50IHRvIGFsdGVyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXR1cm5zIHRoZSBwb3NzaWJsZSBhbHRlcmVkIGNvbnRlbnQuXG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGVudCA9IGZ1bmN0aW9uKCBjb250ZW50ICkge1xuXHRcdGlmICggbnVsbCAhPT0gdGhpcy5mZWF0dXJlZEltYWdlICkge1xuXHRcdFx0Y29udGVudCArPSB0aGlzLmZlYXR1cmVkSW1hZ2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZSBvcGVuZ3JhcGggd2FybmluZyBmcmFtZSBhbmQgYm9yZGVyc1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKSB7XG5cdFx0JCggXCIjeXN0X29wZW5ncmFwaF9pbWFnZV93YXJuaW5nXCIgKS5yZW1vdmUoKTtcblx0XHQkcG9zdEltYWdlRGl2LnJlbW92ZUNsYXNzKCBcInlvYXN0LW9wZW5ncmFwaC1pbWFnZS1ub3RpY2VcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGltYWdlIGlzIHNtYWxsZXIgdGhhbiAyMDB4MjAwIHBpeGVscy4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgc2hvdyBhIHdhcm5pbmdcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2UgVGhlIGZlYXR1cmVkIGltYWdlIG9iamVjdC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0dmFyIGF0dGFjaG1lbnQgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS50b0pTT04oKTtcblxuXHRcdGlmICggYXR0YWNobWVudC53aWR0aCA8IDIwMCB8fCBhdHRhY2htZW50LmhlaWdodCA8IDIwMCApIHtcblx0XHRcdC8vIFNob3cgd2FybmluZyB0byB1c2VyIGFuZCBkbyBub3QgYWRkIGltYWdlIHRvIE9HXG5cdFx0XHRpZiAoIDAgPT09ICQoIFwiI3lzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiICkubGVuZ3RoICkge1xuXHRcdFx0XHQvLyBDcmVhdGUgYSB3YXJuaW5nIHVzaW5nIG5hdGl2ZSBXb3JkUHJlc3Mgbm90aWNlcyBzdHlsaW5nLlxuXHRcdFx0XHQkKCAnPGRpdiBpZD1cInlzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiIGNsYXNzPVwibm90aWNlIG5vdGljZS1lcnJvciBub3RpY2UtYWx0XCI+PHA+JyArXG5cdFx0XHRcdFx0d3BzZW9GZWF0dXJlZEltYWdlTDEwbi5mZWF0dXJlZF9pbWFnZV9ub3RpY2UgK1xuXHRcdFx0XHRcdFwiPC9wPjwvZGl2PlwiIClcblx0XHRcdFx0XHQuaW5zZXJ0QWZ0ZXIoICRwb3N0SW1hZ2VEaXZIZWFkaW5nICk7XG5cblx0XHRcdFx0JHBvc3RJbWFnZURpdi5hZGRDbGFzcyggXCJ5b2FzdC1vcGVuZ3JhcGgtaW1hZ2Utbm90aWNlXCIgKTtcblxuXHRcdFx0XHRhMTF5U3BlYWsoIHdwc2VvRmVhdHVyZWRJbWFnZUwxMG4uZmVhdHVyZWRfaW1hZ2Vfbm90aWNlLCBcImFzc2VydGl2ZVwiICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEZvcmNlIHJlc2V0IHdhcm5pbmdcblx0XHRcdHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKTtcblx0XHR9XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4gPSBuZXcgRmVhdHVyZWRJbWFnZVBsdWdpbiggWW9hc3RTRU8uYXBwICk7XG5cblx0XHQkcG9zdEltYWdlRGl2ID0gJCggXCIjcG9zdGltYWdlZGl2XCIgKTtcblx0XHQkcG9zdEltYWdlRGl2SGVhZGluZyA9ICRwb3N0SW1hZ2VEaXYuZmluZCggXCIuaG5kbGVcIiApO1xuXG5cdFx0ZmVhdHVyZWRJbWFnZS5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRJbWFnZUhUTUwsIHNlbGVjdGVkSW1hZ2UsIGFsdDtcblxuXHRcdFx0Y2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdHNlbGVjdGVkSW1hZ2UgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKTtcblxuXHRcdFx0Ly8gV29yZFByZXNzIGZhbGxzIGJhY2sgdG8gdGhlIHRpdGxlIGZvciB0aGUgYWx0IGF0dHJpYnV0ZSBpZiBubyBhbHQgaXMgcHJlc2VudC5cblx0XHRcdGFsdCA9IHNlbGVjdGVkSW1hZ2UuZ2V0KCBcImFsdFwiICk7XG5cblx0XHRcdGlmICggXCJcIiA9PT0gYWx0ICkge1xuXHRcdFx0XHRhbHQgPSBzZWxlY3RlZEltYWdlLmdldCggXCJ0aXRsZVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdGVkSW1hZ2VIVE1MID0gXCI8aW1nXCIgK1xuXHRcdFx0XHQnIHNyYz1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggXCJ1cmxcIiApICsgJ1wiJyArXG5cdFx0XHRcdCcgd2lkdGg9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwid2lkdGhcIiApICsgJ1wiJyArXG5cdFx0XHRcdCcgaGVpZ2h0PVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCBcImhlaWdodFwiICkgKyAnXCInICtcblx0XHRcdFx0JyBhbHQ9XCInICsgYWx0ICtcblx0XHRcdFx0J1wiLz4nO1xuXG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnNldEZlYXR1cmVkSW1hZ2UoIHNlbGVjdGVkSW1hZ2VIVE1MICk7XG5cdFx0fSApO1xuXG5cdFx0JHBvc3RJbWFnZURpdi5vbiggXCJjbGlja1wiLCBcIiNyZW1vdmUtcG9zdC10aHVtYm5haWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnJlbW92ZUZlYXR1cmVkSW1hZ2UoKTtcblx0XHRcdHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKTtcblx0XHR9ICk7XG5cblx0XHQkZmVhdHVyZWRJbWFnZUVsZW1lbnQgPSAkKCBcIiNzZXQtcG9zdC10aHVtYm5haWwgPiBpbWdcIiApO1xuXHRcdGlmICggXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mICRmZWF0dXJlZEltYWdlRWxlbWVudC5wcm9wKCBcInNyY1wiICkgKSB7XG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnNldEZlYXR1cmVkSW1hZ2UoICQoIFwiI3NldC1wb3N0LXRodW1ibmFpbCBcIiApLmh0bWwoKSApO1xuXHRcdH1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcblxuLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cbi8qKlxuICogQ2hlY2sgaWYgaW1hZ2UgaXMgc21hbGxlciB0aGFuIDIwMHgyMDAgcGl4ZWxzLiBJZiB0aGlzIGlzIHRoZSBjYXNlLCBzaG93IGEgd2FybmluZ1xuICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2VcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xuZnVuY3Rpb24geXN0X2NoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcblx0cmV0dXJuO1xufVxuXG4vKipcbiAqIENvdW50ZXIgdG8gbWFrZSBzdXJlIHdlIGRvIG5vdCBlbmQgdXAgaW4gYW4gZW5kbGVzcyBsb29wIGlmIHRoZXJlJyBubyByZW1vdmUtcG9zdC10aHVtYm5haWwgaWRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbnZhciB0aHVtYklkQ291bnRlciA9IDA7XG5cbi8qKlxuICogVmFyaWFibGUgdG8gaG9sZCB0aGUgb25jbGljayBmdW5jdGlvbiBmb3IgcmVtb3ZlLXBvc3QtdGh1bWJuYWlsLlxuICogQHR5cGUge2Z1bmN0aW9ufVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG52YXIgcmVtb3ZlVGh1bWI7XG5cbi8qKlxuICogSWYgdGhlcmUncyBhIHJlbW92ZS1wb3N0LXRodW1ibmFpbCBpZCwgYWRkIGFuIG9uY2xpY2suIFdoZW4gdGhpcyBpZCBpcyBjbGlja2VkLCBjYWxsIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nXG4gKiBJZiBub3QsIGNoZWNrIGFnYWluIGFmdGVyIDEwMG1zLiBEbyBub3QgZG8gdGhpcyBmb3IgbW9yZSB0aGFuIDEwIHRpbWVzIHNvIHdlIGRvIG5vdCBlbmQgdXAgaW4gYW4gZW5kbGVzcyBsb29wXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbmZ1bmN0aW9uIHlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbigpIHtcblx0cmV0dXJuO1xufVxuXG4vKipcbiAqIFJlbW92ZSBlcnJvciBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xuXHRyZXR1cm47XG59XG5cbndpbmRvdy55c3RfY2hlY2tGZWF0dXJlZEltYWdlID0geXN0X2NoZWNrRmVhdHVyZWRJbWFnZTtcbndpbmRvdy50aHVtYklkQ291bnRlciA9IHRodW1iSWRDb3VudGVyO1xud2luZG93LnJlbW92ZVRodW1iID0gcmVtb3ZlVGh1bWI7XG53aW5kb3cueXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uID0geXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uO1xud2luZG93LnlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nID0geXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmc7XG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuLyogZXNsaW50LWVuYWJsZSAqL1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
