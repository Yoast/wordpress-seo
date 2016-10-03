(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */

(function ($) {
	"use strict";

	var featuredImagePlugin;
	var featuredImageElement;

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
		$("#postimagediv").css("border", "none");
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
				var $postImageDiv = $("#postimagediv");
				$('<div id="yst_opengraph_image_warning"><p>' + wpseoFeaturedImageL10n.featured_image_notice + "</p></div>").insertBefore($postImageDiv);
				$postImageDiv.css({
					border: "solid #dd3d36",
					borderWidth: "3px 4px 4px 4px"
				});
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	$(document).ready(function () {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin(YoastSEO.app);

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

		$("#postimagediv").on("click", "#remove-post-thumbnail", function () {
			featuredImagePlugin.removeFeaturedImage();
			removeOpengraphWarning();
		});

		featuredImageElement = $("#set-post-thumbnail > img");
		if ("undefined" !== typeof featuredImageElement.prop("src")) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNNRSxXQUFVLENBQVYsRUFBYztBQUNmOztBQUNBLEtBQUksbUJBQUo7QUFDQSxLQUFJLG9CQUFKOztBQUVBLEtBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLEdBQVYsRUFBZ0I7QUFDekMsT0FBSyxJQUFMLEdBQVksR0FBWjs7QUFFQSxPQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxPQUFLLFVBQUwsR0FBa0Isd0JBQWxCOztBQUVBLE9BQUssY0FBTDtBQUNBLE9BQUsscUJBQUw7QUFDQSxFQVJEOzs7Ozs7Ozs7QUFpQkEscUJBQW9CLFNBQXBCLENBQThCLGdCQUE5QixHQUFpRCxVQUFVLGFBQVYsRUFBMEI7QUFDMUUsT0FBSyxhQUFMLEdBQXFCLGFBQXJCOztBQUVBLE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQjtBQUNBLEVBSkQ7Ozs7Ozs7QUFXQSxxQkFBb0IsU0FBcEIsQ0FBOEIsbUJBQTlCLEdBQW9ELFlBQVc7QUFDOUQsT0FBSyxnQkFBTCxDQUF1QixJQUF2QjtBQUNBLEVBRkQ7Ozs7Ozs7QUFTQSxxQkFBb0IsU0FBcEIsQ0FBOEIsY0FBOUIsR0FBK0MsWUFBVztBQUN6RCxPQUFLLElBQUwsQ0FBVSxjQUFWLENBQTBCLEtBQUssVUFBL0IsRUFBMkMsRUFBRSxRQUFRLE9BQVYsRUFBM0M7QUFDQSxFQUZEOzs7Ozs7O0FBU0EscUJBQW9CLFNBQXBCLENBQThCLHFCQUE5QixHQUFzRCxZQUFXO0FBQ2hFLE9BQUssSUFBTCxDQUFVLG9CQUFWLENBQWdDLFNBQWhDLEVBQTJDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNkIsSUFBN0IsQ0FBM0MsRUFBZ0YsS0FBSyxVQUFyRixFQUFpRyxFQUFqRztBQUNBLEVBRkQ7Ozs7Ozs7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RCxTQUFTLDBCQUFULEdBQXNDO0FBQ3JDO0FBQ0E7O0FBRUQsT0FBTyxzQkFBUCxHQUFnQyxzQkFBaEM7QUFDQSxPQUFPLGNBQVAsR0FBd0IsY0FBeEI7QUFDQSxPQUFPLFdBQVAsR0FBcUIsV0FBckI7QUFDQSxPQUFPLHdCQUFQLEdBQWtDLHdCQUFsQztBQUNBLE9BQU8sMEJBQVAsR0FBb0MsMEJBQXBDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cCAqL1xuLyogZ2xvYmFsIHdwc2VvRmVhdHVyZWRJbWFnZUwxMG4gKi9cbi8qIGdsb2JhbCBZb2FzdFNFTyAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgLVcwMDMgKi9cblxuKCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdHZhciBmZWF0dXJlZEltYWdlUGx1Z2luO1xuXHR2YXIgZmVhdHVyZWRJbWFnZUVsZW1lbnQ7XG5cblx0dmFyIEZlYXR1cmVkSW1hZ2VQbHVnaW4gPSBmdW5jdGlvbiggYXBwICkge1xuXHRcdHRoaXMuX2FwcCA9IGFwcDtcblxuXHRcdHRoaXMuZmVhdHVyZWRJbWFnZSA9IG51bGw7XG5cdFx0dGhpcy5wbHVnaW5OYW1lID0gXCJhZGRGZWF0dXJlZEltYWdlUGx1Z2luXCI7XG5cblx0XHR0aGlzLnJlZ2lzdGVyUGx1Z2luKCk7XG5cdFx0dGhpcy5yZWdpc3Rlck1vZGlmaWNhdGlvbnMoKTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0J3MgdGhlIGZlYXR1cmVkIGltYWdlIHRvIHVzZSBpbiB0aGUgYW5hbHlzaXNcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGZlYXR1cmVkSW1hZ2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5zZXRGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0dGhpcy5mZWF0dXJlZEltYWdlID0gZmVhdHVyZWRJbWFnZTtcblxuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWxvYWRlZCggdGhpcy5wbHVnaW5OYW1lICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgZmVhdHVyZWQgaW1hZ2UgYW5kIHJlbG9hZHMgYW5hbHl6ZXJcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZW1vdmVGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRGZWF0dXJlZEltYWdlKCBudWxsICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyB0aGlzIHBsdWdpbiB0byBZb2FzdFNFT1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyUGx1Z2luID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyUGx1Z2luKCB0aGlzLnBsdWdpbk5hbWUsIHsgc3RhdHVzOiBcInJlYWR5XCIgfSApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgbW9kaWZpY2F0aW9ucyB0byBZb2FzdFNFT1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggXCJjb250ZW50XCIsIHRoaXMuYWRkSW1hZ2VUb0NvbnRlbnQuYmluZCggdGhpcyApLCB0aGlzLnBsdWdpbk5hbWUsIDEwICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMgZmVhdHVyZWQgaW1hZ2UgdG8gc29ydCBzbyBpdCBjYW4gYmUgYW5hbHl6ZWRcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnRcblx0ICogQHJldHVybnMge1N0cmluZ31cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLmFkZEltYWdlVG9Db250ZW50ID0gZnVuY3Rpb24oIGNvbnRlbnQgKSB7XG5cdFx0aWYgKCBudWxsICE9PSB0aGlzLmZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0XHRjb250ZW50ICs9IHRoaXMuZmVhdHVyZWRJbWFnZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlIG9wZW5ncmFwaCB3YXJuaW5nIGZyYW1lIGFuZCBib3JkZXJzXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlT3BlbmdyYXBoV2FybmluZygpIHtcblx0XHQkKCBcIiN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiApLnJlbW92ZSgpO1xuXHRcdCQoIFwiI3Bvc3RpbWFnZWRpdlwiICkuY3NzKCBcImJvcmRlclwiLCBcIm5vbmVcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIGltYWdlIGlzIHNtYWxsZXIgdGhhbiAyMDB4MjAwIHBpeGVscy4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgc2hvdyBhIHdhcm5pbmdcblx0ICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0dmFyIGF0dGFjaG1lbnQgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS50b0pTT04oKTtcblxuXHRcdGlmICggYXR0YWNobWVudC53aWR0aCA8IDIwMCB8fCBhdHRhY2htZW50LmhlaWdodCA8IDIwMCApIHtcblx0XHRcdC8vIFNob3cgd2FybmluZyB0byB1c2VyIGFuZCBkbyBub3QgYWRkIGltYWdlIHRvIE9HXG5cdFx0XHRpZiAoIDAgPT09ICQoIFwiI3lzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiICkubGVuZ3RoICkge1xuXHRcdFx0XHR2YXIgJHBvc3RJbWFnZURpdiA9ICQoIFwiI3Bvc3RpbWFnZWRpdlwiICk7XG5cdFx0XHRcdCQoICc8ZGl2IGlkPVwieXN0X29wZW5ncmFwaF9pbWFnZV93YXJuaW5nXCI+PHA+JyArIHdwc2VvRmVhdHVyZWRJbWFnZUwxMG4uZmVhdHVyZWRfaW1hZ2Vfbm90aWNlICsgXCI8L3A+PC9kaXY+XCIgKS5pbnNlcnRCZWZvcmUoICRwb3N0SW1hZ2VEaXYgKTtcblx0XHRcdFx0JHBvc3RJbWFnZURpdi5jc3MoIHtcblx0XHRcdFx0XHRib3JkZXI6IFwic29saWQgI2RkM2QzNlwiLFxuXHRcdFx0XHRcdGJvcmRlcldpZHRoOiBcIjNweCA0cHggNHB4IDRweFwiLFxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEZvcmNlIHJlc2V0IHdhcm5pbmdcblx0XHRcdHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKTtcblx0XHR9XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4gPSBuZXcgRmVhdHVyZWRJbWFnZVBsdWdpbiggWW9hc3RTRU8uYXBwICk7XG5cblx0XHRmZWF0dXJlZEltYWdlLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxlY3RlZEltYWdlSFRNTCwgc2VsZWN0ZWRJbWFnZSwgYWx0O1xuXG5cdFx0XHRjaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKTtcblxuXHRcdFx0c2VsZWN0ZWRJbWFnZSA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpO1xuXG5cdFx0XHQvLyBXb3JkUHJlc3MgZmFsbHMgYmFjayB0byB0aGUgdGl0bGUgZm9yIHRoZSBhbHQgYXR0cmlidXRlIGlmIG5vIGFsdCBpcyBwcmVzZW50LlxuXHRcdFx0YWx0ID0gc2VsZWN0ZWRJbWFnZS5nZXQoIFwiYWx0XCIgKTtcblxuXHRcdFx0aWYgKCBcIlwiID09PSBhbHQgKSB7XG5cdFx0XHRcdGFsdCA9IHNlbGVjdGVkSW1hZ2UuZ2V0KCBcInRpdGxlXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0ZWRJbWFnZUhUTUwgPSBcIjxpbWdcIiArXG5cdFx0XHRcdCcgc3JjPVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCBcInVybFwiICkgKyAnXCInICtcblx0XHRcdFx0JyB3aWR0aD1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggXCJ3aWR0aFwiICkgKyAnXCInICtcblx0XHRcdFx0JyBoZWlnaHQ9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwiaGVpZ2h0XCIgKSArICdcIicgK1xuXHRcdFx0XHQnIGFsdD1cIicgKyBhbHQgK1xuXHRcdFx0XHQnXCIvPic7XG5cblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4uc2V0RmVhdHVyZWRJbWFnZSggc2VsZWN0ZWRJbWFnZUhUTUwgKTtcblx0XHR9ICk7XG5cblx0XHQkKCBcIiNwb3N0aW1hZ2VkaXZcIiApLm9uKCBcImNsaWNrXCIsIFwiI3JlbW92ZS1wb3N0LXRodW1ibmFpbFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdGZlYXR1cmVkSW1hZ2VQbHVnaW4ucmVtb3ZlRmVhdHVyZWRJbWFnZSgpO1xuXHRcdFx0cmVtb3ZlT3BlbmdyYXBoV2FybmluZygpO1xuXHRcdH0gKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2VFbGVtZW50ID0gJCggXCIjc2V0LXBvc3QtdGh1bWJuYWlsID4gaW1nXCIgKTtcblx0XHRpZiAoIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBmZWF0dXJlZEltYWdlRWxlbWVudC5wcm9wKCBcInNyY1wiICkgKSB7XG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnNldEZlYXR1cmVkSW1hZ2UoICQoIFwiI3NldC1wb3N0LXRodW1ibmFpbCBcIiApLmh0bWwoKSApO1xuXHRcdH1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcblxuLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cbi8qKlxuICogQ2hlY2sgaWYgaW1hZ2UgaXMgc21hbGxlciB0aGFuIDIwMHgyMDAgcGl4ZWxzLiBJZiB0aGlzIGlzIHRoZSBjYXNlLCBzaG93IGEgd2FybmluZ1xuICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2VcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xuZnVuY3Rpb24geXN0X2NoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcblx0cmV0dXJuO1xufVxuXG4vKipcbiAqIENvdW50ZXIgdG8gbWFrZSBzdXJlIHdlIGRvIG5vdCBlbmQgdXAgaW4gYW4gZW5kbGVzcyBsb29wIGlmIHRoZXJlJyBubyByZW1vdmUtcG9zdC10aHVtYm5haWwgaWRcbiAqIEB0eXBlIHtudW1iZXJ9XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbnZhciB0aHVtYklkQ291bnRlciA9IDA7XG5cbi8qKlxuICogVmFyaWFibGUgdG8gaG9sZCB0aGUgb25jbGljayBmdW5jdGlvbiBmb3IgcmVtb3ZlLXBvc3QtdGh1bWJuYWlsLlxuICogQHR5cGUge2Z1bmN0aW9ufVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG52YXIgcmVtb3ZlVGh1bWI7XG5cbi8qKlxuICogSWYgdGhlcmUncyBhIHJlbW92ZS1wb3N0LXRodW1ibmFpbCBpZCwgYWRkIGFuIG9uY2xpY2suIFdoZW4gdGhpcyBpZCBpcyBjbGlja2VkLCBjYWxsIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nXG4gKiBJZiBub3QsIGNoZWNrIGFnYWluIGFmdGVyIDEwMG1zLiBEbyBub3QgZG8gdGhpcyBmb3IgbW9yZSB0aGFuIDEwIHRpbWVzIHNvIHdlIGRvIG5vdCBlbmQgdXAgaW4gYW4gZW5kbGVzcyBsb29wXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbmZ1bmN0aW9uIHlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbigpIHtcblx0cmV0dXJuO1xufVxuXG4vKipcbiAqIFJlbW92ZSBlcnJvciBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xuXHRyZXR1cm47XG59XG5cbndpbmRvdy55c3RfY2hlY2tGZWF0dXJlZEltYWdlID0geXN0X2NoZWNrRmVhdHVyZWRJbWFnZTtcbndpbmRvdy50aHVtYklkQ291bnRlciA9IHRodW1iSWRDb3VudGVyO1xud2luZG93LnJlbW92ZVRodW1iID0gcmVtb3ZlVGh1bWI7XG53aW5kb3cueXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uID0geXN0X292ZXJyaWRlRWxlbUZ1bmN0aW9uO1xud2luZG93LnlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nID0geXN0X3JlbW92ZU9wZW5ncmFwaFdhcm5pbmc7XG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuLyogZXNsaW50LWVuYWJsZSAqL1xuIl19
