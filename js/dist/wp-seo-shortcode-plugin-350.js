(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* global tinyMCE */
/* global wpseoShortcodePluginL10n */
/* global ajaxurl */
/* global _ */
/* global JSON */
/* global console */
(function () {
	"use strict";

	/**
  * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for shortcodes which it will preload using AJAX.
  *
  * @constructor
  * @property {RegExp} keywordRegex Used to match a given string for valid shortcode keywords.
  * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.
  * @property {RegExp} nonCaptureRegex Used to match a given string for non capturing shortcodes.
  * @property {Array} parsedShortcodes Used to store parsed shortcodes.
  */

	var YoastShortcodePlugin = function YoastShortcodePlugin(app) {
		this._app = app;

		this._app.registerPlugin("YoastShortcodePlugin", { status: "loading" });
		this.bindElementEvents();

		var keywordRegexString = "(" + wpseoShortcodePluginL10n.wpseo_shortcode_tags.join("|") + ")";

		// The regex for matching shortcodes based on the available shortcode keywords.
		this.keywordRegex = new RegExp(keywordRegexString, "g");
		this.closingTagRegex = new RegExp("\\[\\/" + keywordRegexString + "\\]", "g");
		this.nonCaptureRegex = new RegExp("\\[" + keywordRegexString + "[^\\]]*?\\]", "g");

		this.parsedShortcodes = [];

		this.loadShortcodes(this.declareReady.bind(this));
	};

	/* YOAST SEO CLIENT */

	/**
  * Declares ready with YoastSEO.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.declareReady = function () {
		this._app.pluginReady("YoastShortcodePlugin");
		this.registerModifications();
	};

	/**
  * Declares reloaded with YoastSEO.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.declareReloaded = function () {
		this._app.pluginReloaded("YoastShortcodePlugin");
	};

	/**
  * Registers the modifications for the content in which we want to replace shortcodes.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.registerModifications = function () {
		this._app.registerModification("content", this.replaceShortcodes.bind(this), "YoastShortcodePlugin");
	};

	/**
  * The callback used to replace the shortcodes.
  *
  * @param {string} data
  * @returns {string}
  */
	YoastShortcodePlugin.prototype.replaceShortcodes = function (data) {
		var parsedShortcodes = this.parsedShortcodes;

		if (typeof data === "string" && parsedShortcodes.length > 0) {
			for (var i = 0; i < parsedShortcodes.length; i++) {
				data = data.replace(parsedShortcodes[i].shortcode, parsedShortcodes[i].output);
			}
		}

		return data;
	};

	/* DATA SOURCING */

	/**
  * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
  * the analyzer and the snippetpreview
  *
  * @param {function} callback To declare either ready or reloaded after parsing.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.loadShortcodes = function (callback) {
		var unparsedShortcodes = this.getUnparsedShortcodes(this.getShortcodes(this.getContentTinyMCE()));
		if (unparsedShortcodes.length > 0) {
			this.parseShortcodes(unparsedShortcodes, callback);
		} else {
			return callback();
		}
	};

	/**
  * Bind elements to be able to reload the dataset if shortcodes get added.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.bindElementEvents = function () {
		var contentElement = document.getElementById("content") || false;
		var callback = _.debounce(this.loadShortcodes.bind(this, this.declareReloaded.bind(this)), 500);

		if (contentElement) {
			contentElement.addEventListener("keyup", callback);
			contentElement.addEventListener("change", callback);
		}

		if (typeof tinyMCE !== "undefined" && typeof tinyMCE.on === "function") {
			tinyMCE.on("addEditor", function (e) {
				e.editor.on("change", callback);
				e.editor.on("keyup", callback);
			});
		}
	};

	/**
  * gets content from the content field, if tinyMCE is initialized, use the getContent function to get the data from tinyMCE
  * @returns {String}
  */
	YoastShortcodePlugin.prototype.getContentTinyMCE = function () {
		var val = document.getElementById("content") && document.getElementById("content").value || "";
		if (typeof tinyMCE !== "undefined" && typeof tinyMCE.editors !== "undefined" && tinyMCE.editors.length !== 0) {
			val = tinyMCE.get("content") && tinyMCE.get("content").getContent() || "";
		}

		return val;
	};

	/* SHORTCODE PARSING */

	/**
  * Returns the unparsed shortcodes out of a collection of shortcodes.
  *
  * @param {Array} shortcodes
  * @returns {Array}
  */
	YoastShortcodePlugin.prototype.getUnparsedShortcodes = function (shortcodes) {
		if ((typeof shortcodes === "undefined" ? "undefined" : _typeof(shortcodes)) !== "object") {
			console.error("Failed to get unparsed shortcodes. Expected parameter to be an array, instead received " + (typeof shortcodes === "undefined" ? "undefined" : _typeof(shortcodes)));
			return false;
		}

		var unparsedShortcodes = [];

		for (var i = 0; i < shortcodes.length; i++) {
			var shortcode = shortcodes[i];
			if (unparsedShortcodes.indexOf(shortcode) === -1 && this.isUnparsedShortcode(shortcode)) {
				unparsedShortcodes.push(shortcode);
			}
		}

		return unparsedShortcodes;
	};

	/**
  * Checks if a given shortcode was already parsed.
  *
  * @param {string} shortcode
  * @returns {boolean}
  */
	YoastShortcodePlugin.prototype.isUnparsedShortcode = function (shortcode) {
		var already_exists = false;

		for (var i = 0; i < this.parsedShortcodes.length; i++) {
			if (this.parsedShortcodes[i].shortcode === shortcode) {
				already_exists = true;
			}
		}

		return already_exists === false;
	};

	/**
  * Gets the shortcodes from a given piece of text.
  *
  * @param {string} text
  * @returns {array} The matched shortcodes
  */
	YoastShortcodePlugin.prototype.getShortcodes = function (text) {
		if (typeof text !== "string") {
			/* jshint ignore:start */
			console.error("Failed to get shortcodes. Expected parameter to be a string, instead received" + (typeof text === "undefined" ? "undefined" : _typeof(text)));
			/* jshint ignore:end*/
			return false;
		}

		var captures = this.matchCapturingShortcodes(text);

		// Remove the capturing shortcodes from the text before trying to match the capturing shortcodes.
		for (var i = 0; i < captures.length; i++) {
			text = text.replace(captures[i], "");
		}

		var nonCaptures = this.matchNonCapturingShortcodes(text);

		return captures.concat(nonCaptures);
	};

	/**
  * Matches the capturing shortcodes from a given piece of text.
  *
  * @param {string} text
  * @returns {Array}
  */
	YoastShortcodePlugin.prototype.matchCapturingShortcodes = function (text) {
		var captures = [];

		// First identify which tags are being used in a capturing shortcode by looking for closing tags.
		var captureKeywords = (text.match(this.closingTagRegex) || []).join(" ").match(this.keywordRegex) || [];

		// Fetch the capturing shortcodes and strip them from the text so we can easily match the non capturing shortcodes.
		for (var i = 0; i < captureKeywords.length; i++) {
			var captureKeyword = captureKeywords[i];
			var captureRegex = "\\[" + captureKeyword + "[^\\]]*?\\].*?\\[\\/" + captureKeyword + "\\]";
			var matches = text.match(new RegExp(captureRegex, "g")) || [];

			captures = captures.concat(matches);
		}

		return captures;
	};

	/**
  * Matches the non capturing shortcodes from a given piece of text.
  *
  * @param {string} text
  * @returns {Array}
  */
	YoastShortcodePlugin.prototype.matchNonCapturingShortcodes = function (text) {
		return text.match(this.nonCaptureRegex) || [];
	};

	/**
  * Parses the unparsed shortcodes through AJAX and clears them.
  *
  * @param {Array} shortcodes shortcodes to be parsed.
  * @param {function} callback function to be called in the context of the AJAX callback.
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.parseShortcodes = function (shortcodes, callback) {
		if (typeof callback !== "function") {
			/* jshint ignore:start */
			console.error("Failed to parse shortcodes. Expected parameter to be a function, instead received " + (typeof callback === "undefined" ? "undefined" : _typeof(callback)));
			/* jshint ignore:end */
			return false;
		}

		if ((typeof shortcodes === "undefined" ? "undefined" : _typeof(shortcodes)) === "object" && shortcodes.length > 0) {
			jQuery.post(ajaxurl, {
				action: "wpseo_filter_shortcodes",
				_wpnonce: wpseoShortcodePluginL10n.wpseo_filter_shortcodes_nonce,
				data: shortcodes
			}, function (shortcodeResults) {
				this.saveParsedShortcodes(shortcodeResults, callback);
			}.bind(this));
		} else {
			return callback();
		}
	};

	/**
  * Saves the shortcodes that were parsed with AJAX to `this.parsedShortcodes`
  *
  * @param {Array} shortcodeResults
  * @param {function} callback
  *
  * @returns {void}
  */
	YoastShortcodePlugin.prototype.saveParsedShortcodes = function (shortcodeResults, callback) {
		shortcodeResults = JSON.parse(shortcodeResults);
		for (var i = 0; i < shortcodeResults.length; i++) {
			this.parsedShortcodes.push(shortcodeResults[i]);
		}

		callback();
	};

	window.YoastShortcodePlugin = YoastShortcodePlugin;
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXNob3J0Y29kZS1wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDTUUsYUFBVztBQUNaOzs7Ozs7Ozs7Ozs7QUFXQSxLQUFJLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBVSxHQUFWLEVBQWdCO0FBQzFDLE9BQUssSUFBTCxHQUFZLEdBQVo7O0FBRUEsT0FBSyxJQUFMLENBQVUsY0FBVixDQUEwQixzQkFBMUIsRUFBa0QsRUFBRSxRQUFRLFNBQVYsRUFBbEQ7QUFDQSxPQUFLLGlCQUFMOztBQUVBLE1BQUkscUJBQXFCLE1BQU0seUJBQXlCLG9CQUF6QixDQUE4QyxJQUE5QyxDQUFvRCxHQUFwRCxDQUFOLEdBQWtFLEdBQTNGOzs7QUFHQSxPQUFLLFlBQUwsR0FBb0IsSUFBSSxNQUFKLENBQVksa0JBQVosRUFBZ0MsR0FBaEMsQ0FBcEI7QUFDQSxPQUFLLGVBQUwsR0FBdUIsSUFBSSxNQUFKLENBQVksV0FBVyxrQkFBWCxHQUFnQyxLQUE1QyxFQUFtRCxHQUFuRCxDQUF2QjtBQUNBLE9BQUssZUFBTCxHQUF1QixJQUFJLE1BQUosQ0FBWSxRQUFRLGtCQUFSLEdBQTZCLGFBQXpDLEVBQXdELEdBQXhELENBQXZCOztBQUVBLE9BQUssZ0JBQUwsR0FBd0IsRUFBeEI7O0FBRUEsT0FBSyxjQUFMLENBQXFCLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLEVBaEJEOzs7Ozs7Ozs7QUF5QkEsc0JBQXFCLFNBQXJCLENBQStCLFlBQS9CLEdBQThDLFlBQVc7QUFDeEQsT0FBSyxJQUFMLENBQVUsV0FBVixDQUF1QixzQkFBdkI7QUFDQSxPQUFLLHFCQUFMO0FBQ0EsRUFIRDs7Ozs7OztBQVVBLHNCQUFxQixTQUFyQixDQUErQixlQUEvQixHQUFpRCxZQUFXO0FBQzNELE9BQUssSUFBTCxDQUFVLGNB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Ozs7Ozs7Ozs7QUFZQSxzQkFBcUIsU0FBckIsQ0FBK0IsZUFBL0IsR0FBaUQsVUFBVSxVQUFWLEVBQXNCLFFBQXRCLEVBQWlDO0FBQ2pGLE1BQUssT0FBTyxRQUFQLEtBQW9CLFVBQXpCLEVBQXNDOztBQUVyQyxXQUFRLEtBQVIsQ0FBZSwrRkFBOEYsUUFBOUYseUNBQThGLFFBQTlGLEVBQWY7O0FBRUEsVUFBTyxLQUFQO0FBQ0E7O0FBRUQsTUFBSyxRQUFPLFVBQVAseUNBQU8sVUFBUCxPQUFzQixRQUF0QixJQUFrQyxXQUFXLE1BQVgsR0FBb0IsQ0FBM0QsRUFBK0Q7QUFDOUQsVUFBTyxJQUFQLENBQWEsT0FBYixFQUFzQjtBQUNyQixZQUFRLHlCQURhO0FBRXJCLGNBQVUseUJBQXlCLDZCQUZkO0FBR3JCLFVBQU07QUFIZSxJQUF0QixFQUtDLFVBQVUsZ0JBQVYsRUFBNkI7QUFDNUIsU0FBSyxvQkFBTCxDQUEyQixnQkFBM0IsRUFBNkMsUUFBN0M7QUFDQSxJQUZELENBRUUsSUFGRixDQUVRLElBRlIsQ0FMRDtBQVNBLEdBVkQsTUFXSztBQUNKLFVBQU8sVUFBUDtBQUNBO0FBQ0QsRUF0QkQ7Ozs7Ozs7Ozs7QUFnQ0Esc0JBQXFCLFNBQXJCLENBQStCLG9CQUEvQixHQUFzRCxVQUFVLGdCQUFWLEVBQTRCLFFBQTVCLEVBQXVDO0FBQzVGLHFCQUFtQixLQUFLLEtBQUwsQ0FBWSxnQkFBWixDQUFuQjtBQUNBLE9BQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxpQkFBaUIsTUFBdEMsRUFBOEMsR0FBOUMsRUFBb0Q7QUFDbkQsUUFBSyxnQkFBTCxDQUFzQixJQUF0QixDQUE0QixpQkFBa0IsQ0FBbEIsQ0FBNUI7QUFDQTs7QUFFRDtBQUNBLEVBUEQ7O0FBU0EsUUFBTyxvQkFBUCxHQUE4QixvQkFBOUI7QUFDQSxDQTlSQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB0aW55TUNFICovXG4vKiBnbG9iYWwgd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuICovXG4vKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIF8gKi9cbi8qIGdsb2JhbCBKU09OICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIFRoZSBZb2FzdCBTaG9ydGNvZGUgcGx1Z2luIHBhcnNlcyB0aGUgc2hvcnRjb2RlcyBpbiBhIGdpdmVuIHBpZWNlIG9mIHRleHQuIEl0IGFuYWx5emVzIG11bHRpcGxlIGlucHV0IGZpZWxkcyBmb3Igc2hvcnRjb2RlcyB3aGljaCBpdCB3aWxsIHByZWxvYWQgdXNpbmcgQUpBWC5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBrZXl3b3JkUmVnZXggVXNlZCB0byBtYXRjaCBhIGdpdmVuIHN0cmluZyBmb3IgdmFsaWQgc2hvcnRjb2RlIGtleXdvcmRzLlxuXHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gY2xvc2luZ1RhZ1JlZ2V4IFVzZWQgdG8gbWF0Y2ggYSBnaXZlbiBzdHJpbmcgZm9yIHNob3J0Y29kZSBjbG9zaW5nIHRhZ3MuXG5cdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBub25DYXB0dXJlUmVnZXggVXNlZCB0byBtYXRjaCBhIGdpdmVuIHN0cmluZyBmb3Igbm9uIGNhcHR1cmluZyBzaG9ydGNvZGVzLlxuXHQgKiBAcHJvcGVydHkge0FycmF5fSBwYXJzZWRTaG9ydGNvZGVzIFVzZWQgdG8gc3RvcmUgcGFyc2VkIHNob3J0Y29kZXMuXG5cdCAqL1xuXHR2YXIgWW9hc3RTaG9ydGNvZGVQbHVnaW4gPSBmdW5jdGlvbiggYXBwICkge1xuXHRcdHRoaXMuX2FwcCA9IGFwcDtcblxuXHRcdHRoaXMuX2FwcC5yZWdpc3RlclBsdWdpbiggXCJZb2FzdFNob3J0Y29kZVBsdWdpblwiLCB7IHN0YXR1czogXCJsb2FkaW5nXCIgfSApO1xuXHRcdHRoaXMuYmluZEVsZW1lbnRFdmVudHMoKTtcblxuXHRcdHZhciBrZXl3b3JkUmVnZXhTdHJpbmcgPSBcIihcIiArIHdwc2VvU2hvcnRjb2RlUGx1Z2luTDEwbi53cHNlb19zaG9ydGNvZGVfdGFncy5qb2luKCBcInxcIiApICsgXCIpXCI7XG5cblx0XHQvLyBUaGUgcmVnZXggZm9yIG1hdGNoaW5nIHNob3J0Y29kZXMgYmFzZWQgb24gdGhlIGF2YWlsYWJsZSBzaG9ydGNvZGUga2V5d29yZHMuXG5cdFx0dGhpcy5rZXl3b3JkUmVnZXggPSBuZXcgUmVnRXhwKCBrZXl3b3JkUmVnZXhTdHJpbmcsIFwiZ1wiICk7XG5cdFx0dGhpcy5jbG9zaW5nVGFnUmVnZXggPSBuZXcgUmVnRXhwKCBcIlxcXFxbXFxcXC9cIiArIGtleXdvcmRSZWdleFN0cmluZyArIFwiXFxcXF1cIiwgXCJnXCIgKTtcblx0XHR0aGlzLm5vbkNhcHR1cmVSZWdleCA9IG5ldyBSZWdFeHAoIFwiXFxcXFtcIiArIGtleXdvcmRSZWdleFN0cmluZyArIFwiW15cXFxcXV0qP1xcXFxdXCIsIFwiZ1wiICk7XG5cblx0XHR0aGlzLnBhcnNlZFNob3J0Y29kZXMgPSBbXTtcblxuXHRcdHRoaXMubG9hZFNob3J0Y29kZXMoIHRoaXMuZGVjbGFyZVJlYWR5LmJpbmQoIHRoaXMgKSApO1xuXHR9O1xuXG5cdC8qIFlPQVNUIFNFTyBDTElFTlQgKi9cblxuXHQvKipcblx0ICogRGVjbGFyZXMgcmVhZHkgd2l0aCBZb2FzdFNFTy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuZGVjbGFyZVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnBsdWdpblJlYWR5KCBcIllvYXN0U2hvcnRjb2RlUGx1Z2luXCIgKTtcblx0XHR0aGlzLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucygpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEZWNsYXJlcyByZWxvYWRlZCB3aXRoIFlvYXN0U0VPLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5kZWNsYXJlUmVsb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucGx1Z2luUmVsb2FkZWQoIFwiWW9hc3RTaG9ydGNvZGVQbHVnaW5cIiApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGhlIG1vZGlmaWNhdGlvbnMgZm9yIHRoZSBjb250ZW50IGluIHdoaWNoIHdlIHdhbnQgdG8gcmVwbGFjZSBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5yZWdpc3Rlck1vZGlmaWNhdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJNb2RpZmljYXRpb24oIFwiY29udGVudFwiLCB0aGlzLnJlcGxhY2VTaG9ydGNvZGVzLmJpbmQoIHRoaXMgKSwgXCJZb2FzdFNob3J0Y29kZVBsdWdpblwiICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFRoZSBjYWxsYmFjayB1c2VkIHRvIHJlcGxhY2UgdGhlIHNob3J0Y29kZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucmVwbGFjZVNob3J0Y29kZXMgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgcGFyc2VkU2hvcnRjb2RlcyA9IHRoaXMucGFyc2VkU2hvcnRjb2RlcztcblxuXHRcdGlmICggdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgJiYgcGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSggcGFyc2VkU2hvcnRjb2Rlc1sgaSBdLnNob3J0Y29kZSwgcGFyc2VkU2hvcnRjb2Rlc1sgaSBdLm91dHB1dCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXG5cdC8qIERBVEEgU09VUkNJTkcgKi9cblxuXHQvKipcblx0ICogR2V0IGRhdGEgZnJvbSBpbnB1dGZpZWxkcyBhbmQgc3RvcmUgdGhlbSBpbiBhbiBhbmFseXplckRhdGEgb2JqZWN0LiBUaGlzIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gZmlsbFxuXHQgKiB0aGUgYW5hbHl6ZXIgYW5kIHRoZSBzbmlwcGV0cHJldmlld1xuXHQgKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUbyBkZWNsYXJlIGVpdGhlciByZWFkeSBvciByZWxvYWRlZCBhZnRlciBwYXJzaW5nLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5sb2FkU2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0XHR2YXIgdW5wYXJzZWRTaG9ydGNvZGVzID0gdGhpcy5nZXRVbnBhcnNlZFNob3J0Y29kZXMoIHRoaXMuZ2V0U2hvcnRjb2RlcyggdGhpcy5nZXRDb250ZW50VGlueU1DRSgpICkgKTtcblx0XHRpZiAoIHVucGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0dGhpcy5wYXJzZVNob3J0Y29kZXMoIHVucGFyc2VkU2hvcnRjb2RlcywgY2FsbGJhY2sgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBCaW5kIGVsZW1lbnRzIHRvIGJlIGFibGUgdG8gcmVsb2FkIHRoZSBkYXRhc2V0IGlmIHNob3J0Y29kZXMgZ2V0IGFkZGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5iaW5kRWxlbWVudEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImNvbnRlbnRcIiApIHx8IGZhbHNlO1xuXHRcdHZhciBjYWxsYmFjayA9ICBfLmRlYm91bmNlKFx0dGhpcy5sb2FkU2hvcnRjb2Rlcy5iaW5kKCB0aGlzLCB0aGlzLmRlY2xhcmVSZWxvYWRlZC5iaW5kKCB0aGlzICkgKSwgNTAwICk7XG5cblx0XHRpZiAoIGNvbnRlbnRFbGVtZW50ICkge1xuXHRcdFx0Y29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJrZXl1cFwiLCBjYWxsYmFjayApO1xuXHRcdFx0Y29udGVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJjaGFuZ2VcIiwgY2FsbGJhY2sgKTtcblx0XHR9XG5cblx0XHRpZiggdHlwZW9mIHRpbnlNQ0UgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRpbnlNQ0Uub24gPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdHRpbnlNQ0Uub24oIFwiYWRkRWRpdG9yXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLmVkaXRvci5vbiggXCJjaGFuZ2VcIiwgY2FsbGJhY2sgKTtcblx0XHRcdFx0ZS5lZGl0b3Iub24oIFwia2V5dXBcIiwgY2FsbGJhY2sgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIGdldHMgY29udGVudCBmcm9tIHRoZSBjb250ZW50IGZpZWxkLCBpZiB0aW55TUNFIGlzIGluaXRpYWxpemVkLCB1c2UgdGhlIGdldENvbnRlbnQgZnVuY3Rpb24gdG8gZ2V0IHRoZSBkYXRhIGZyb20gdGlueU1DRVxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmdldENvbnRlbnRUaW55TUNFID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImNvbnRlbnRcIiApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImNvbnRlbnRcIiApLnZhbHVlIHx8IFwiXCI7XG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5lZGl0b3JzICE9PSBcInVuZGVmaW5lZFwiICYmIHRpbnlNQ0UuZWRpdG9ycy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHR2YWwgPSB0aW55TUNFLmdldCggXCJjb250ZW50XCIgKSAmJiB0aW55TUNFLmdldCggXCJjb250ZW50XCIgKS5nZXRDb250ZW50KCkgfHwgXCJcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsO1xuXHR9O1xuXG5cdC8qIFNIT1JUQ09ERSBQQVJTSU5HICovXG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHVucGFyc2VkIHNob3J0Y29kZXMgb3V0IG9mIGEgY29sbGVjdGlvbiBvZiBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzaG9ydGNvZGVzXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRVbnBhcnNlZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlcyApIHtcblx0XHRpZiAoIHR5cGVvZiBzaG9ydGNvZGVzICE9PSBcIm9iamVjdFwiICkge1xuXHRcdFx0Y29uc29sZS5lcnJvciggXCJGYWlsZWQgdG8gZ2V0IHVucGFyc2VkIHNob3J0Y29kZXMuIEV4cGVjdGVkIHBhcmFtZXRlciB0byBiZSBhbiBhcnJheSwgaW5zdGVhZCByZWNlaXZlZCBcIiArIHR5cGVvZiBzaG9ydGNvZGVzICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIHVucGFyc2VkU2hvcnRjb2RlcyA9IFtdO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgc2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHZhciBzaG9ydGNvZGUgPSBzaG9ydGNvZGVzWyBpIF07XG5cdFx0XHRpZiAoIHVucGFyc2VkU2hvcnRjb2Rlcy5pbmRleE9mKCBzaG9ydGNvZGUgKSA9PT0gLTEgJiYgdGhpcy5pc1VucGFyc2VkU2hvcnRjb2RlKCBzaG9ydGNvZGUgKSApIHtcblx0XHRcdFx0dW5wYXJzZWRTaG9ydGNvZGVzLnB1c2goIHNob3J0Y29kZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1bnBhcnNlZFNob3J0Y29kZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhIGdpdmVuIHNob3J0Y29kZSB3YXMgYWxyZWFkeSBwYXJzZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzaG9ydGNvZGVcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuaXNVbnBhcnNlZFNob3J0Y29kZSA9IGZ1bmN0aW9uKCBzaG9ydGNvZGUgKSB7XG5cdFx0dmFyIGFscmVhZHlfZXhpc3RzID0gZmFsc2U7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnNlZFNob3J0Y29kZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyc2VkU2hvcnRjb2Rlc1sgaSBdLnNob3J0Y29kZSA9PT0gc2hvcnRjb2RlICkge1xuXHRcdFx0XHRhbHJlYWR5X2V4aXN0cyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFscmVhZHlfZXhpc3RzID09PSBmYWxzZTtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgc2hvcnRjb2RlcyBmcm9tIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHRcblx0ICogQHJldHVybnMge2FycmF5fSBUaGUgbWF0Y2hlZCBzaG9ydGNvZGVzXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuZ2V0U2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdGlmICggdHlwZW9mIHRleHQgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0XHRjb25zb2xlLmVycm9yKCBcIkZhaWxlZCB0byBnZXQgc2hvcnRjb2Rlcy4gRXhwZWN0ZWQgcGFyYW1ldGVyIHRvIGJlIGEgc3RyaW5nLCBpbnN0ZWFkIHJlY2VpdmVkXCIgKyB0eXBlb2YgdGV4dCApO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTplbmQqL1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciBjYXB0dXJlcyA9IHRoaXMubWF0Y2hDYXB0dXJpbmdTaG9ydGNvZGVzKCB0ZXh0ICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20gdGhlIHRleHQgYmVmb3JlIHRyeWluZyB0byBtYXRjaCB0aGUgY2FwdHVyaW5nIHNob3J0Y29kZXMuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgY2FwdHVyZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBjYXB0dXJlc1sgaSBdLCBcIlwiICk7XG5cdFx0fVxuXG5cdFx0dmFyIG5vbkNhcHR1cmVzID0gdGhpcy5tYXRjaE5vbkNhcHR1cmluZ1Nob3J0Y29kZXMoIHRleHQgKTtcblxuXHRcdHJldHVybiBjYXB0dXJlcy5jb25jYXQoIG5vbkNhcHR1cmVzICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE1hdGNoZXMgdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubWF0Y2hDYXB0dXJpbmdTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0dmFyIGNhcHR1cmVzID0gW107XG5cblx0XHQvLyBGaXJzdCBpZGVudGlmeSB3aGljaCB0YWdzIGFyZSBiZWluZyB1c2VkIGluIGEgY2FwdHVyaW5nIHNob3J0Y29kZSBieSBsb29raW5nIGZvciBjbG9zaW5nIHRhZ3MuXG5cdFx0dmFyIGNhcHR1cmVLZXl3b3JkcyA9ICggdGV4dC5tYXRjaCggdGhpcy5jbG9zaW5nVGFnUmVnZXggKSB8fCBbXSApLmpvaW4oIFwiIFwiICkubWF0Y2goIHRoaXMua2V5d29yZFJlZ2V4ICkgfHwgW107XG5cblx0XHQvLyBGZXRjaCB0aGUgY2FwdHVyaW5nIHNob3J0Y29kZXMgYW5kIHN0cmlwIHRoZW0gZnJvbSB0aGUgdGV4dCBzbyB3ZSBjYW4gZWFzaWx5IG1hdGNoIHRoZSBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgY2FwdHVyZUtleXdvcmRzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dmFyIGNhcHR1cmVLZXl3b3JkID0gY2FwdHVyZUtleXdvcmRzWyBpIF07XG5cdFx0XHR2YXIgY2FwdHVyZVJlZ2V4ID0gXCJcXFxcW1wiICsgY2FwdHVyZUtleXdvcmQgKyBcIlteXFxcXF1dKj9cXFxcXS4qP1xcXFxbXFxcXC9cIiArIGNhcHR1cmVLZXl3b3JkICsgXCJcXFxcXVwiO1xuXHRcdFx0dmFyIG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKCBuZXcgUmVnRXhwKCBjYXB0dXJlUmVnZXgsIFwiZ1wiICkgKSB8fCBbXTtcblxuXHRcdFx0Y2FwdHVyZXMgPSBjYXB0dXJlcy5jb25jYXQoIG1hdGNoZXMgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2FwdHVyZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIE1hdGNoZXMgdGhlIG5vbiBjYXB0dXJpbmcgc2hvcnRjb2RlcyBmcm9tIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHRcblx0ICogQHJldHVybnMge0FycmF5fVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLm1hdGNoTm9uQ2FwdHVyaW5nU2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdHJldHVybiB0ZXh0Lm1hdGNoKCB0aGlzLm5vbkNhcHR1cmVSZWdleCApIHx8IFtdO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIHVucGFyc2VkIHNob3J0Y29kZXMgdGhyb3VnaCBBSkFYIGFuZCBjbGVhcnMgdGhlbS5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheX0gc2hvcnRjb2RlcyBzaG9ydGNvZGVzIHRvIGJlIHBhcnNlZC5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBBSkFYIGNhbGxiYWNrLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5wYXJzZVNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlcywgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiRmFpbGVkIHRvIHBhcnNlIHNob3J0Y29kZXMuIEV4cGVjdGVkIHBhcmFtZXRlciB0byBiZSBhIGZ1bmN0aW9uLCBpbnN0ZWFkIHJlY2VpdmVkIFwiICsgdHlwZW9mIGNhbGxiYWNrICk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHNob3J0Y29kZXMgPT09IFwib2JqZWN0XCIgJiYgc2hvcnRjb2Rlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2ZpbHRlcl9zaG9ydGNvZGVzXCIsXG5cdFx0XHRcdF93cG5vbmNlOiB3cHNlb1Nob3J0Y29kZVBsdWdpbkwxMG4ud3BzZW9fZmlsdGVyX3Nob3J0Y29kZXNfbm9uY2UsXG5cdFx0XHRcdGRhdGE6IHNob3J0Y29kZXMsXG5cdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbiggc2hvcnRjb2RlUmVzdWx0cyApIHtcblx0XHRcdFx0XHR0aGlzLnNhdmVQYXJzZWRTaG9ydGNvZGVzKCBzaG9ydGNvZGVSZXN1bHRzLCBjYWxsYmFjayApO1xuXHRcdFx0XHR9LmJpbmQoIHRoaXMgKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFNhdmVzIHRoZSBzaG9ydGNvZGVzIHRoYXQgd2VyZSBwYXJzZWQgd2l0aCBBSkFYIHRvIGB0aGlzLnBhcnNlZFNob3J0Y29kZXNgXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHNob3J0Y29kZVJlc3VsdHNcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuc2F2ZVBhcnNlZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlUmVzdWx0cywgY2FsbGJhY2sgKSB7XG5cdFx0c2hvcnRjb2RlUmVzdWx0cyA9IEpTT04ucGFyc2UoIHNob3J0Y29kZVJlc3VsdHMgKTtcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBzaG9ydGNvZGVSZXN1bHRzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dGhpcy5wYXJzZWRTaG9ydGNvZGVzLnB1c2goIHNob3J0Y29kZVJlc3VsdHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrKCk7XG5cdH07XG5cblx0d2luZG93LllvYXN0U2hvcnRjb2RlUGx1Z2luID0gWW9hc3RTaG9ydGNvZGVQbHVnaW47XG59KCkgKTtcbiJdfQ==
