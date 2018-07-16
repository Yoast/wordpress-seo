(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global tinyMCE */
/* global wpseoShortcodePluginL10n */
/* global ajaxurl */
/* global _ */
/* global JSON */
/* global console */
var shortcodeNameMatcher = "[^<>&/\\[\\]\x00-\x20=]+?";
var shortcodeAttributesMatcher = "( [^\\]]+?)?";

var shortcodeStartRegex = new RegExp("\\[" + shortcodeNameMatcher + shortcodeAttributesMatcher + "\\]", "g");
var shortcodeEndRegex = new RegExp("\\[/" + shortcodeNameMatcher + "\\]", "g");

(function () {
	/**
  * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for
  * shortcodes which it will preload using AJAX.
  *
  * @constructor
  * @property {RegExp} keywordRegex Used to match a given string for valid shortcode keywords.
  * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.
  * @property {RegExp} nonCaptureRegex Used to match a given string for non capturing shortcodes.
  * @property {Array} parsedShortcodes Used to store parsed shortcodes.
  *
  * @param {app} app The app object.
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
  * Removes all unknown shortcodes. Not all plugins properly registerd their shortcodes in the WordPress backend.
  * Since we cannot use the data from these shortcodes they must be removed.
  *
  * @param {string} data The text to remove unknown shortcodes.
  * @returns {string} The text with removed unknown shortcodes.
  */
	YoastShortcodePlugin.prototype.removeUnknownShortCodes = function (data) {
		data = data.replace(shortcodeStartRegex, "");
		data = data.replace(shortcodeEndRegex, "");

		return data;
	};

	/**
  * The callback used to replace the shortcodes.
  *
  * @param {string} data The text to replace the shortcodes in.
  *
  * @returns {string} The text with replaced shortcodes.
  */
	YoastShortcodePlugin.prototype.replaceShortcodes = function (data) {
		var parsedShortcodes = this.parsedShortcodes;

		if (typeof data === "string" && parsedShortcodes.length > 0) {
			for (var i = 0; i < parsedShortcodes.length; i++) {
				data = data.replace(parsedShortcodes[i].shortcode, parsedShortcodes[i].output);
			}
		}

		data = this.removeUnknownShortCodes(data);

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
  * Gets content from the content field, if tinyMCE is initialized, use the getContent function to
  * get the data from tinyMCE.
  *
  * @returns {String} Content from tinyMCE.
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
  * @param {Array} shortcodes The shortcodes to check.
  *
  * @returns {Array} Array with unparsed shortcodes.
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
  * @param {string} shortcode The shortcode to check.
  *
  * @returns {boolean} True when shortcode is not parsed yet.
  */
	YoastShortcodePlugin.prototype.isUnparsedShortcode = function (shortcode) {
		var alreadyExists = false;

		for (var i = 0; i < this.parsedShortcodes.length; i++) {
			if (this.parsedShortcodes[i].shortcode === shortcode) {
				alreadyExists = true;
			}
		}

		return alreadyExists === false;
	};

	/**
  * Gets the shortcodes from a given piece of text.
  *
  * @param {string} text Text to extract shortcodes from.
  *
  * @returns {array} The matched shortcodes.
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
  * @param {string} text Text to get the capturing shortcodes from.
  *
  * @returns {Array} The capturing shortcodes.
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
  * @param {string} text Text to get the non capturing shortcodes from.
  *
  * @returns {Array}     The non capturing shortcodes.
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
  * @param {Array}    shortcodeResults Shortcodes that must be saved.
  * @param {function} callback         Callback to execute of saving shortcodes.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXNob3J0Y29kZS1wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTSx1QkFBdUIsMkJBQTdCO0FBQ0EsSUFBTSw2QkFBNkIsY0FBbkM7O0FBRUEsSUFBTSxzQkFBc0IsSUFBSSxNQUFKLENBQVksUUFBUSxvQkFBUixHQUErQiwwQkFBL0IsR0FBNEQsS0FBeEUsRUFBK0UsR0FBL0UsQ0FBNUI7QUFDQSxJQUFNLG9CQUFvQixJQUFJLE1BQUosQ0FBWSxTQUFTLG9CQUFULEdBQWdDLEtBQTVDLEVBQW1ELEdBQW5ELENBQTFCOztBQUVFLGFBQVc7QUFDWjs7Ozs7Ozs7Ozs7O0FBWUEsS0FBSSx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQVUsR0FBVixFQUFnQjtBQUMxQyxPQUFLLElBQUwsR0FBWSxHQUFaOztBQUVBLE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsc0JBQTFCLEVBQWtELEVBQUUsUUFBUSxTQUFWLEVBQWxEO0FBQ0EsT0FBSyxpQkFBTDs7QUFFQSxNQUFJLHFCQUFxQixNQUFNLHlCQUF5QixvQkFBekIsQ0FBOEMsSUFBOUMsQ0FBb0QsR0FBcEQsQ0FBTixHQUFrRSxHQUEzRjs7QUFFQTtBQUNBLE9BQUssWUFBTCxHQUFvQixJQUFJLE1BQUosQ0FBWSxrQkFBWixFQUFnQyxHQUFoQyxDQUFwQjtBQUNBLE9BQUssZUFBTCxHQUF1QixJQUFJLE1BQUosQ0FBWSxXQUFXLGtCQUFYLEdBQWdDLEtBQTVDLEVBQW1ELEdBQW5ELENBQXZCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLElBQUksTUFBSixDQUFZLFFBQVEsa0JBQVIsR0FBNkIsYUFBekMsRUFBd0QsR0FBeEQsQ0FBdkI7O0FBRUEsT0FBSyxnQkFBTCxHQUF3QixFQUF4Qjs7QUFFQSxPQUFLLGNBQUwsQ0FBcUIs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ckIsVUFBTTtBQUhlLElBQXRCLEVBS0MsVUFBVSxnQkFBVixFQUE2QjtBQUM1QixTQUFLLG9CQUFMLENBQTJCLGdCQUEzQixFQUE2QyxRQUE3QztBQUNBLElBRkQsQ0FFRSxJQUZGLENBRVEsSUFGUixDQUxEO0FBU0EsR0FWRCxNQVVPO0FBQ04sVUFBTyxVQUFQO0FBQ0E7QUFDRCxFQXJCRDs7QUF1QkE7Ozs7Ozs7O0FBUUEsc0JBQXFCLFNBQXJCLENBQStCLG9CQUEvQixHQUFzRCxVQUFVLGdCQUFWLEVBQTRCLFFBQTVCLEVBQXVDO0FBQzVGLHFCQUFtQixLQUFLLEtBQUwsQ0FBWSxnQkFBWixDQUFuQjtBQUNBLE9BQU0sSUFBSSxJQUFJLENBQWQsRUFBaUIsSUFBSSxpQkFBaUIsTUFBdEMsRUFBOEMsR0FBOUMsRUFBb0Q7QUFDbkQsUUFBSyxnQkFBTCxDQUFzQixJQUF0QixDQUE0QixpQkFBa0IsQ0FBbEIsQ0FBNUI7QUFDQTs7QUFFRDtBQUNBLEVBUEQ7O0FBU0EsUUFBTyxvQkFBUCxHQUE4QixvQkFBOUI7QUFDQSxDQXZUQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB0aW55TUNFICovXG4vKiBnbG9iYWwgd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuICovXG4vKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIF8gKi9cbi8qIGdsb2JhbCBKU09OICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuY29uc3Qgc2hvcnRjb2RlTmFtZU1hdGNoZXIgPSBcIltePD4mL1xcXFxbXFxcXF1cXHgwMC1cXHgyMD1dKz9cIjtcbmNvbnN0IHNob3J0Y29kZUF0dHJpYnV0ZXNNYXRjaGVyID0gXCIoIFteXFxcXF1dKz8pP1wiO1xuXG5jb25zdCBzaG9ydGNvZGVTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJcXFxcW1wiICsgc2hvcnRjb2RlTmFtZU1hdGNoZXIgKyBzaG9ydGNvZGVBdHRyaWJ1dGVzTWF0Y2hlciArIFwiXFxcXF1cIiwgXCJnXCIgKTtcbmNvbnN0IHNob3J0Y29kZUVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJcXFxcWy9cIiArIHNob3J0Y29kZU5hbWVNYXRjaGVyICsgXCJcXFxcXVwiLCBcImdcIiApO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogVGhlIFlvYXN0IFNob3J0Y29kZSBwbHVnaW4gcGFyc2VzIHRoZSBzaG9ydGNvZGVzIGluIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC4gSXQgYW5hbHl6ZXMgbXVsdGlwbGUgaW5wdXQgZmllbGRzIGZvclxuXHQgKiBzaG9ydGNvZGVzIHdoaWNoIGl0IHdpbGwgcHJlbG9hZCB1c2luZyBBSkFYLlxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGtleXdvcmRSZWdleCBVc2VkIHRvIG1hdGNoIGEgZ2l2ZW4gc3RyaW5nIGZvciB2YWxpZCBzaG9ydGNvZGUga2V5d29yZHMuXG5cdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBjbG9zaW5nVGFnUmVnZXggVXNlZCB0byBtYXRjaCBhIGdpdmVuIHN0cmluZyBmb3Igc2hvcnRjb2RlIGNsb3NpbmcgdGFncy5cblx0ICogQHByb3BlcnR5IHtSZWdFeHB9IG5vbkNhcHR1cmVSZWdleCBVc2VkIHRvIG1hdGNoIGEgZ2l2ZW4gc3RyaW5nIGZvciBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMuXG5cdCAqIEBwcm9wZXJ0eSB7QXJyYXl9IHBhcnNlZFNob3J0Y29kZXMgVXNlZCB0byBzdG9yZSBwYXJzZWQgc2hvcnRjb2Rlcy5cblx0ICpcblx0ICogQHBhcmFtIHthcHB9IGFwcCBUaGUgYXBwIG9iamVjdC5cblx0ICovXG5cdHZhciBZb2FzdFNob3J0Y29kZVBsdWdpbiA9IGZ1bmN0aW9uKCBhcHAgKSB7XG5cdFx0dGhpcy5fYXBwID0gYXBwO1xuXG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyUGx1Z2luKCBcIllvYXN0U2hvcnRjb2RlUGx1Z2luXCIsIHsgc3RhdHVzOiBcImxvYWRpbmdcIiB9ICk7XG5cdFx0dGhpcy5iaW5kRWxlbWVudEV2ZW50cygpO1xuXG5cdFx0dmFyIGtleXdvcmRSZWdleFN0cmluZyA9IFwiKFwiICsgd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuLndwc2VvX3Nob3J0Y29kZV90YWdzLmpvaW4oIFwifFwiICkgKyBcIilcIjtcblxuXHRcdC8vIFRoZSByZWdleCBmb3IgbWF0Y2hpbmcgc2hvcnRjb2RlcyBiYXNlZCBvbiB0aGUgYXZhaWxhYmxlIHNob3J0Y29kZSBrZXl3b3Jkcy5cblx0XHR0aGlzLmtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoIGtleXdvcmRSZWdleFN0cmluZywgXCJnXCIgKTtcblx0XHR0aGlzLmNsb3NpbmdUYWdSZWdleCA9IG5ldyBSZWdFeHAoIFwiXFxcXFtcXFxcL1wiICsga2V5d29yZFJlZ2V4U3RyaW5nICsgXCJcXFxcXVwiLCBcImdcIiApO1xuXHRcdHRoaXMubm9uQ2FwdHVyZVJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJcXFxcW1wiICsga2V5d29yZFJlZ2V4U3RyaW5nICsgXCJbXlxcXFxdXSo/XFxcXF1cIiwgXCJnXCIgKTtcblxuXHRcdHRoaXMucGFyc2VkU2hvcnRjb2RlcyA9IFtdO1xuXG5cdFx0dGhpcy5sb2FkU2hvcnRjb2RlcyggdGhpcy5kZWNsYXJlUmVhZHkuYmluZCggdGhpcyApICk7XG5cdH07XG5cblx0LyogWU9BU1QgU0VPIENMSUVOVCAqL1xuXG5cdC8qKlxuXHQgKiBEZWNsYXJlcyByZWFkeSB3aXRoIFlvYXN0U0VPLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5kZWNsYXJlUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucGx1Z2luUmVhZHkoIFwiWW9hc3RTaG9ydGNvZGVQbHVnaW5cIiApO1xuXHRcdHRoaXMucmVnaXN0ZXJNb2RpZmljYXRpb25zKCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIERlY2xhcmVzIHJlbG9hZGVkIHdpdGggWW9hc3RTRU8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmRlY2xhcmVSZWxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWxvYWRlZCggXCJZb2FzdFNob3J0Y29kZVBsdWdpblwiICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyB0aGUgbW9kaWZpY2F0aW9ucyBmb3IgdGhlIGNvbnRlbnQgaW4gd2hpY2ggd2Ugd2FudCB0byByZXBsYWNlIHNob3J0Y29kZXMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggXCJjb250ZW50XCIsIHRoaXMucmVwbGFjZVNob3J0Y29kZXMuYmluZCggdGhpcyApLCBcIllvYXN0U2hvcnRjb2RlUGx1Z2luXCIgKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIGFsbCB1bmtub3duIHNob3J0Y29kZXMuIE5vdCBhbGwgcGx1Z2lucyBwcm9wZXJseSByZWdpc3RlcmQgdGhlaXIgc2hvcnRjb2RlcyBpbiB0aGUgV29yZFByZXNzIGJhY2tlbmQuXG5cdCAqIFNpbmNlIHdlIGNhbm5vdCB1c2UgdGhlIGRhdGEgZnJvbSB0aGVzZSBzaG9ydGNvZGVzIHRoZXkgbXVzdCBiZSByZW1vdmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSBUaGUgdGV4dCB0byByZW1vdmUgdW5rbm93biBzaG9ydGNvZGVzLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHJlbW92ZWQgdW5rbm93biBzaG9ydGNvZGVzLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnJlbW92ZVVua25vd25TaG9ydENvZGVzID0gZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSggc2hvcnRjb2RlU3RhcnRSZWdleCwgXCJcIiApO1xuXHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIHNob3J0Y29kZUVuZFJlZ2V4LCBcIlwiICk7XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fTtcblxuXHQvKipcblx0ICogVGhlIGNhbGxiYWNrIHVzZWQgdG8gcmVwbGFjZSB0aGUgc2hvcnRjb2Rlcy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRhdGEgVGhlIHRleHQgdG8gcmVwbGFjZSB0aGUgc2hvcnRjb2RlcyBpbi5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCByZXBsYWNlZCBzaG9ydGNvZGVzLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnJlcGxhY2VTaG9ydGNvZGVzID0gZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0dmFyIHBhcnNlZFNob3J0Y29kZXMgPSB0aGlzLnBhcnNlZFNob3J0Y29kZXM7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICYmIHBhcnNlZFNob3J0Y29kZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHBhcnNlZFNob3J0Y29kZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIHBhcnNlZFNob3J0Y29kZXNbIGkgXS5zaG9ydGNvZGUsIHBhcnNlZFNob3J0Y29kZXNbIGkgXS5vdXRwdXQgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRkYXRhID0gdGhpcy5yZW1vdmVVbmtub3duU2hvcnRDb2RlcyggZGF0YSApO1xuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH07XG5cblx0LyogREFUQSBTT1VSQ0lORyAqL1xuXG5cdC8qKlxuXHQgKiBHZXQgZGF0YSBmcm9tIGlucHV0ZmllbGRzIGFuZCBzdG9yZSB0aGVtIGluIGFuIGFuYWx5emVyRGF0YSBvYmplY3QuIFRoaXMgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBmaWxsXG5cdCAqIHRoZSBhbmFseXplciBhbmQgdGhlIHNuaXBwZXRwcmV2aWV3XG5cdCAqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRvIGRlY2xhcmUgZWl0aGVyIHJlYWR5IG9yIHJlbG9hZGVkIGFmdGVyIHBhcnNpbmcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmxvYWRTaG9ydGNvZGVzID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRcdHZhciB1bnBhcnNlZFNob3J0Y29kZXMgPSB0aGlzLmdldFVucGFyc2VkU2hvcnRjb2RlcyggdGhpcy5nZXRTaG9ydGNvZGVzKCB0aGlzLmdldENvbnRlbnRUaW55TUNFKCkgKSApO1xuXHRcdGlmICggdW5wYXJzZWRTaG9ydGNvZGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR0aGlzLnBhcnNlU2hvcnRjb2RlcyggdW5wYXJzZWRTaG9ydGNvZGVzLCBjYWxsYmFjayApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEJpbmQgZWxlbWVudHMgdG8gYmUgYWJsZSB0byByZWxvYWQgdGhlIGRhdGFzZXQgaWYgc2hvcnRjb2RlcyBnZXQgYWRkZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmJpbmRFbGVtZW50RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiY29udGVudFwiICkgfHwgZmFsc2U7XG5cdFx0dmFyIGNhbGxiYWNrID0gIF8uZGVib3VuY2UoXHR0aGlzLmxvYWRTaG9ydGNvZGVzLmJpbmQoIHRoaXMsIHRoaXMuZGVjbGFyZVJlbG9hZGVkLmJpbmQoIHRoaXMgKSApLCA1MDAgKTtcblxuXHRcdGlmICggY29udGVudEVsZW1lbnQgKSB7XG5cdFx0XHRjb250ZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImtleXVwXCIsIGNhbGxiYWNrICk7XG5cdFx0XHRjb250ZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImNoYW5nZVwiLCBjYWxsYmFjayApO1xuXHRcdH1cblxuXHRcdGlmKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5vbiA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0dGlueU1DRS5vbiggXCJhZGRFZGl0b3JcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuZWRpdG9yLm9uKCBcImNoYW5nZVwiLCBjYWxsYmFjayApO1xuXHRcdFx0XHRlLmVkaXRvci5vbiggXCJrZXl1cFwiLCBjYWxsYmFjayApO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogR2V0cyBjb250ZW50IGZyb20gdGhlIGNvbnRlbnQgZmllbGQsIGlmIHRpbnlNQ0UgaXMgaW5pdGlhbGl6ZWQsIHVzZSB0aGUgZ2V0Q29udGVudCBmdW5jdGlvbiB0b1xuXHQgKiBnZXQgdGhlIGRhdGEgZnJvbSB0aW55TUNFLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBDb250ZW50IGZyb20gdGlueU1DRS5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRDb250ZW50VGlueU1DRSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJjb250ZW50XCIgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJjb250ZW50XCIgKS52YWx1ZSB8fCBcIlwiO1xuXHRcdGlmICggdHlwZW9mIHRpbnlNQ0UgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRpbnlNQ0UuZWRpdG9ycyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aW55TUNFLmVkaXRvcnMubGVuZ3RoICE9PSAwICkge1xuXHRcdFx0dmFsID0gdGlueU1DRS5nZXQoIFwiY29udGVudFwiICkgJiYgdGlueU1DRS5nZXQoIFwiY29udGVudFwiICkuZ2V0Q29udGVudCgpIHx8IFwiXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbDtcblx0fTtcblxuXHQvKiBTSE9SVENPREUgUEFSU0lORyAqL1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSB1bnBhcnNlZCBzaG9ydGNvZGVzIG91dCBvZiBhIGNvbGxlY3Rpb24gb2Ygc2hvcnRjb2Rlcy5cblx0ICpcblx0ICogQHBhcmFtIHtBcnJheX0gc2hvcnRjb2RlcyBUaGUgc2hvcnRjb2RlcyB0byBjaGVjay5cblx0ICpcblx0ICogQHJldHVybnMge0FycmF5fSBBcnJheSB3aXRoIHVucGFyc2VkIHNob3J0Y29kZXMuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuZ2V0VW5wYXJzZWRTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHNob3J0Y29kZXMgKSB7XG5cdFx0aWYgKCB0eXBlb2Ygc2hvcnRjb2RlcyAhPT0gXCJvYmplY3RcIiApIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiRmFpbGVkIHRvIGdldCB1bnBhcnNlZCBzaG9ydGNvZGVzLiBFeHBlY3RlZCBwYXJhbWV0ZXIgdG8gYmUgYW4gYXJyYXksIGluc3RlYWQgcmVjZWl2ZWQgXCIgKyB0eXBlb2Ygc2hvcnRjb2RlcyApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciB1bnBhcnNlZFNob3J0Y29kZXMgPSBbXTtcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHNob3J0Y29kZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR2YXIgc2hvcnRjb2RlID0gc2hvcnRjb2Rlc1sgaSBdO1xuXHRcdFx0aWYgKCB1bnBhcnNlZFNob3J0Y29kZXMuaW5kZXhPZiggc2hvcnRjb2RlICkgPT09IC0xICYmIHRoaXMuaXNVbnBhcnNlZFNob3J0Y29kZSggc2hvcnRjb2RlICkgKSB7XG5cdFx0XHRcdHVucGFyc2VkU2hvcnRjb2Rlcy5wdXNoKCBzaG9ydGNvZGUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdW5wYXJzZWRTaG9ydGNvZGVzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYSBnaXZlbiBzaG9ydGNvZGUgd2FzIGFscmVhZHkgcGFyc2VkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2hvcnRjb2RlIFRoZSBzaG9ydGNvZGUgdG8gY2hlY2suXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIHdoZW4gc2hvcnRjb2RlIGlzIG5vdCBwYXJzZWQgeWV0LlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmlzVW5wYXJzZWRTaG9ydGNvZGUgPSBmdW5jdGlvbiggc2hvcnRjb2RlICkge1xuXHRcdHZhciBhbHJlYWR5RXhpc3RzID0gZmFsc2U7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnNlZFNob3J0Y29kZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyc2VkU2hvcnRjb2Rlc1sgaSBdLnNob3J0Y29kZSA9PT0gc2hvcnRjb2RlICkge1xuXHRcdFx0XHRhbHJlYWR5RXhpc3RzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gYWxyZWFkeUV4aXN0cyA9PT0gZmFsc2U7XG5cdH07XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIHNob3J0Y29kZXMgZnJvbSBhIGdpdmVuIHBpZWNlIG9mIHRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gZXh0cmFjdCBzaG9ydGNvZGVzIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHthcnJheX0gVGhlIG1hdGNoZWQgc2hvcnRjb2Rlcy5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdGV4dCAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdGNvbnNvbGUuZXJyb3IoIFwiRmFpbGVkIHRvIGdldCBzaG9ydGNvZGVzLiBFeHBlY3RlZCBwYXJhbWV0ZXIgdG8gYmUgYSBzdHJpbmcsIGluc3RlYWQgcmVjZWl2ZWRcIiArIHR5cGVvZiB0ZXh0ICk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCovXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIGNhcHR1cmVzID0gdGhpcy5tYXRjaENhcHR1cmluZ1Nob3J0Y29kZXMoIHRleHQgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgY2FwdHVyaW5nIHNob3J0Y29kZXMgZnJvbSB0aGUgdGV4dCBiZWZvcmUgdHJ5aW5nIHRvIG1hdGNoIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBjYXB0dXJlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGNhcHR1cmVzWyBpIF0sIFwiXCIgKTtcblx0XHR9XG5cblx0XHR2YXIgbm9uQ2FwdHVyZXMgPSB0aGlzLm1hdGNoTm9uQ2FwdHVyaW5nU2hvcnRjb2RlcyggdGV4dCApO1xuXG5cdFx0cmV0dXJuIGNhcHR1cmVzLmNvbmNhdCggbm9uQ2FwdHVyZXMgKTtcblx0fTtcblxuXHQvKipcblx0ICogTWF0Y2hlcyB0aGUgY2FwdHVyaW5nIHNob3J0Y29kZXMgZnJvbSBhIGdpdmVuIHBpZWNlIG9mIHRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gZ2V0IHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBmcm9tLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5tYXRjaENhcHR1cmluZ1Nob3J0Y29kZXMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0XHR2YXIgY2FwdHVyZXMgPSBbXTtcblxuXHRcdC8vIEZpcnN0IGlkZW50aWZ5IHdoaWNoIHRhZ3MgYXJlIGJlaW5nIHVzZWQgaW4gYSBjYXB0dXJpbmcgc2hvcnRjb2RlIGJ5IGxvb2tpbmcgZm9yIGNsb3NpbmcgdGFncy5cblx0XHR2YXIgY2FwdHVyZUtleXdvcmRzID0gKCB0ZXh0Lm1hdGNoKCB0aGlzLmNsb3NpbmdUYWdSZWdleCApIHx8IFtdICkuam9pbiggXCIgXCIgKS5tYXRjaCggdGhpcy5rZXl3b3JkUmVnZXggKSB8fCBbXTtcblxuXHRcdC8vIEZldGNoIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBhbmQgc3RyaXAgdGhlbSBmcm9tIHRoZSB0ZXh0IHNvIHdlIGNhbiBlYXNpbHkgbWF0Y2ggdGhlIG5vbiBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBjYXB0dXJlS2V5d29yZHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR2YXIgY2FwdHVyZUtleXdvcmQgPSBjYXB0dXJlS2V5d29yZHNbIGkgXTtcblx0XHRcdHZhciBjYXB0dXJlUmVnZXggPSBcIlxcXFxbXCIgKyBjYXB0dXJlS2V5d29yZCArIFwiW15cXFxcXV0qP1xcXFxdLio/XFxcXFtcXFxcL1wiICsgY2FwdHVyZUtleXdvcmQgKyBcIlxcXFxdXCI7XG5cdFx0XHR2YXIgbWF0Y2hlcyA9IHRleHQubWF0Y2goIG5ldyBSZWdFeHAoIGNhcHR1cmVSZWdleCwgXCJnXCIgKSApIHx8IFtdO1xuXG5cdFx0XHRjYXB0dXJlcyA9IGNhcHR1cmVzLmNvbmNhdCggbWF0Y2hlcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjYXB0dXJlcztcblx0fTtcblxuXHQvKipcblx0ICogTWF0Y2hlcyB0aGUgbm9uIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHRvIGdldCB0aGUgbm9uIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gICAgIFRoZSBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubWF0Y2hOb25DYXB0dXJpbmdTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0cmV0dXJuIHRleHQubWF0Y2goIHRoaXMubm9uQ2FwdHVyZVJlZ2V4ICkgfHwgW107XG5cdH07XG5cblx0LyoqXG5cdCAqIFBhcnNlcyB0aGUgdW5wYXJzZWQgc2hvcnRjb2RlcyB0aHJvdWdoIEFKQVggYW5kIGNsZWFycyB0aGVtLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzaG9ydGNvZGVzIHNob3J0Y29kZXMgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhlIEFKQVggY2FsbGJhY2suXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLnBhcnNlU2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCBzaG9ydGNvZGVzLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdFx0Y29uc29sZS5lcnJvciggXCJGYWlsZWQgdG8gcGFyc2Ugc2hvcnRjb2Rlcy4gRXhwZWN0ZWQgcGFyYW1ldGVyIHRvIGJlIGEgZnVuY3Rpb24sIGluc3RlYWQgcmVjZWl2ZWQgXCIgKyB0eXBlb2YgY2FsbGJhY2sgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2Ygc2hvcnRjb2RlcyA9PT0gXCJvYmplY3RcIiAmJiBzaG9ydGNvZGVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0XHRhY3Rpb246IFwid3BzZW9fZmlsdGVyX3Nob3J0Y29kZXNcIixcblx0XHRcdFx0X3dwbm9uY2U6IHdwc2VvU2hvcnRjb2RlUGx1Z2luTDEwbi53cHNlb19maWx0ZXJfc2hvcnRjb2Rlc19ub25jZSxcblx0XHRcdFx0ZGF0YTogc2hvcnRjb2Rlcyxcblx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uKCBzaG9ydGNvZGVSZXN1bHRzICkge1xuXHRcdFx0XHRcdHRoaXMuc2F2ZVBhcnNlZFNob3J0Y29kZXMoIHNob3J0Y29kZVJlc3VsdHMsIGNhbGxiYWNrICk7XG5cdFx0XHRcdH0uYmluZCggdGhpcyApXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIFNhdmVzIHRoZSBzaG9ydGNvZGVzIHRoYXQgd2VyZSBwYXJzZWQgd2l0aCBBSkFYIHRvIGB0aGlzLnBhcnNlZFNob3J0Y29kZXNgXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9ICAgIHNob3J0Y29kZVJlc3VsdHMgU2hvcnRjb2RlcyB0aGF0IG11c3QgYmUgc2F2ZWQuXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrICAgICAgICAgQ2FsbGJhY2sgdG8gZXhlY3V0ZSBvZiBzYXZpbmcgc2hvcnRjb2Rlcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuc2F2ZVBhcnNlZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlUmVzdWx0cywgY2FsbGJhY2sgKSB7XG5cdFx0c2hvcnRjb2RlUmVzdWx0cyA9IEpTT04ucGFyc2UoIHNob3J0Y29kZVJlc3VsdHMgKTtcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBzaG9ydGNvZGVSZXN1bHRzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dGhpcy5wYXJzZWRTaG9ydGNvZGVzLnB1c2goIHNob3J0Y29kZVJlc3VsdHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrKCk7XG5cdH07XG5cblx0d2luZG93LllvYXN0U2hvcnRjb2RlUGx1Z2luID0gWW9hc3RTaG9ydGNvZGVQbHVnaW47XG59KCkgKTtcbiJdfQ==
