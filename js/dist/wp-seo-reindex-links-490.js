(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global yoastReindexLinksData, jQuery, tb_remove */

var settings = yoastReindexLinksData.data;

/**
 * Represents the progressbar for the reindexing for the links.
 */
var IndexProgressBar = function () {

	/**
  * The constructor.
  *
  * @param {string} postType The post type.
  * @param {int}    total    The total amount of items for post type.
  */
	function IndexProgressBar(postType, total) {
		_classCallCheck(this, IndexProgressBar);

		this.element = jQuery("#wpseo_count_index_links_" + postType);
		this.progressbarTarget = jQuery("#wpseo_index_links_" + postType + "_progressbar").progressbar({ value: 0 });
		this.total = parseInt(total, 10);
		this.totalProcessed = 0;
	}

	/**
  * Updates the processbar.
  *
  * @param {int} countProcessed The amount of items that has been process.
  *
  * @returns {void}
  */


	_createClass(IndexProgressBar, [{
		key: "update",
		value: function update(countProcessed) {
			this.totalProcessed += countProcessed;
			var newWidth = this.totalProcessed * (100 / this.total);

			this.progressbarTarget.progressbar("value", Math.round(newWidth));
			this.element.html(this.totalProcessed);
		}

		/**
   * Completes the processbar.
   *
   * @returns {void}
   */

	}, {
		key: "complete",
		value: function complete() {
			this.progressbarTarget.progressbar("value", 100);
		}
	}]);

	return IndexProgressBar;
}();

/**
 * Does the reindex request for current post and
 *
 * @param {string}           postType    The postttype to reindex.
 * @param {IndexProgressBar} progressbar The progressbar.
 * @param {Promise.resolve}  resolve     The method to complete index process.
 *
 * @returns {void}
 */


function doReindexRequest(postType, progressbar, resolve) {
	// Do
	jQuery.ajax({
		type: "GET",
		url: settings.restApi.root + settings.restApi.endpoint,
		data: {
			postType: postType
		},
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", settings.restApi.nonce);
		},
		success: function success(response) {
			var totalIndexed = parseInt(response, 10);
			if (totalIndexed !== 0) {
				progressbar.update(totalIndexed);

				doReindexRequest(postType, progressbar, resolve);

				return;
			}

			progressbar.complete();
			resolve();
		}
	});
}

/**
 * Starts the reindexing the links for given post type.
 *
 * @param {string} postType The posttype to reindex.
 *
 * @returns {Promise} Promise.
 */
function reindexLinks(postType) {

	// Do request to get post ids
	return new Promise(function (resolve) {
		var progressbar = new IndexProgressBar(postType, settings.amount[postType]);
		doReindexRequest(postType, progressbar, resolve);
	});
}

/**
 * Sets the finish message, when indexing has been completed.
 *
 * @returns {void}
 */
function completeReindexing() {
	(0, _a11ySpeak2.default)(settings.l10n.calculationCompleted);
	jQuery("#reindexLinks").html(settings.message.indexingCompleted);

	tb_remove();
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {void}
 */
function startReindexing() {
	(0, _a11ySpeak2.default)(settings.l10n.calculationInProgress);

	var promises = [];
	Object.keys(settings.amount).forEach(function (post_type) {
		promises.push(reindexLinks(post_type));
	});

	Promise.all(promises).then(completeReindexing);
}

/**
 * Initializes the indexation of links
 *
 * @returns {void}
 */
function init() {
	var recalculating = false;
	jQuery(".yoast-js-calculate-index-links--all ").on("click", function () {
		if (recalculating === false) {
			startReindexing();

			recalculating = true;
		}
	});
}

jQuery(init);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXJlaW5kZXgtbGlua3MuanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0lBOzs7Ozs7OztBQUpBOztBQUVBLElBQUksV0FBVyxzQkFBc0IsSUFBckM7O0FBSUE7OztJQUdNLGdCOztBQUVMOzs7Ozs7QUFNQSwyQkFBYSxRQUFiLEVBQXVCLEtBQXZCLEVBQStCO0FBQUE7O0FBQzlCLE9BQUssT0FBTCxHQUFlLE9BQVEsOEJBQThCLFFBQXRDLENBQWY7QUFDQSxPQUFLLGlCQUFMLEdBQXlCLE9BQVEsd0JBQXdCLFFBQXhCLEdBQW1DLGNBQTNDLEVBQTRELFdBQTVELENBQXlFLEVBQUUsT0FBTyxDQUFULEVBQXpFLENBQXpCO0FBQ0EsT0FBSyxLQUFMLEdBQWEsU0FBVSxLQUFWLEVBQWlCLEVBQWpCLENBQWI7QUFDQSxPQUFLLGNBQUwsR0FBc0IsQ0FBdEI7QUFDQTs7QUFFRDs7Ozs7Ozs7Ozs7eUJBT1EsYyxFQUFpQjtBQUN4QixRQUFLLGNBQUwsSUFBdUIsY0FBdkI7QUFDQSxPQUFJLFdBQVcsS0FBSyxjQUFMLElBQXdCLE1BQU0sS0FBSyxLQUFuQyxDQUFmOztBQUVBLFFBQUssaUJBQUwsQ0FBdUIsV0FBdkIsQ0FBb0MsT0FBcEMsRUFBNkMsS0FBSyxLQUFMLENBQVksUUFBWixDQUE3QztBQUNBLFFBQUssT0FBTCxDQUFhLElBQWIsQ0FBbUIsS0FBSyxjQUF4QjtBQUNBOztBQUVEOzs7Ozs7Ozs2QkFLVztBQUNWLFFBQUssaUJBQUwsQ0FBdUIsV0FBdkIsQ0FBb0MsT0FBcEMsRUFBNkMsR0FBN0M7QUFDQTs7Ozs7O0FBSUY7Ozs7Ozs7Ozs7O0FBU0EsU0FBUyxnQkFBVCxDQUEyQixRQUEzQixFQUFxQyxXQUFyQyxFQUFrRCxPQUFsRCxFQUE0RDtBQUMzRDtBQUNBLFFB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OiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB5b2FzdFJlaW5kZXhMaW5rc0RhdGEsIGpRdWVyeSwgdGJfcmVtb3ZlICovXG5cbmxldCBzZXR0aW5ncyA9IHlvYXN0UmVpbmRleExpbmtzRGF0YS5kYXRhO1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvZ3Jlc3NiYXIgZm9yIHRoZSByZWluZGV4aW5nIGZvciB0aGUgbGlua3MuXG4gKi9cbmNsYXNzIEluZGV4UHJvZ3Jlc3NCYXIge1xuXG5cdC8qKlxuXHQgKiBUaGUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwb3N0VHlwZSBUaGUgcG9zdCB0eXBlLlxuXHQgKiBAcGFyYW0ge2ludH0gICAgdG90YWwgICAgVGhlIHRvdGFsIGFtb3VudCBvZiBpdGVtcyBmb3IgcG9zdCB0eXBlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHBvc3RUeXBlLCB0b3RhbCApIHtcblx0XHR0aGlzLmVsZW1lbnQgPSBqUXVlcnkoIFwiI3dwc2VvX2NvdW50X2luZGV4X2xpbmtzX1wiICsgcG9zdFR5cGUgKTtcblx0XHR0aGlzLnByb2dyZXNzYmFyVGFyZ2V0ID0galF1ZXJ5KCBcIiN3cHNlb19pbmRleF9saW5rc19cIiArIHBvc3RUeXBlICsgXCJfcHJvZ3Jlc3NiYXJcIiApLnByb2dyZXNzYmFyKCB7IHZhbHVlOiAwIH0gKTtcblx0XHR0aGlzLnRvdGFsID0gcGFyc2VJbnQoIHRvdGFsLCAxMCApO1xuXHRcdHRoaXMudG90YWxQcm9jZXNzZWQgPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHByb2Nlc3NiYXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7aW50fSBjb3VudFByb2Nlc3NlZCBUaGUgYW1vdW50IG9mIGl0ZW1zIHRoYXQgaGFzIGJlZW4gcHJvY2Vzcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHR1cGRhdGUoIGNvdW50UHJvY2Vzc2VkICkge1xuXHRcdHRoaXMudG90YWxQcm9jZXNzZWQgKz0gY291bnRQcm9jZXNzZWQ7XG5cdFx0bGV0IG5ld1dpZHRoID0gdGhpcy50b3RhbFByb2Nlc3NlZCAqICggMTAwIC8gdGhpcy50b3RhbCApO1xuXG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldC5wcm9ncmVzc2JhciggXCJ2YWx1ZVwiLCBNYXRoLnJvdW5kKCBuZXdXaWR0aCApICk7XG5cdFx0dGhpcy5lbGVtZW50Lmh0bWwoIHRoaXMudG90YWxQcm9jZXNzZWQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb21wbGV0ZXMgdGhlIHByb2Nlc3NiYXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0Y29tcGxldGUoKSB7XG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldC5wcm9ncmVzc2JhciggXCJ2YWx1ZVwiLCAxMDAgKTtcblx0fVxuXG59XG5cbi8qKlxuICogRG9lcyB0aGUgcmVpbmRleCByZXF1ZXN0IGZvciBjdXJyZW50IHBvc3QgYW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICBwb3N0VHlwZSAgICBUaGUgcG9zdHR0eXBlIHRvIHJlaW5kZXguXG4gKiBAcGFyYW0ge0luZGV4UHJvZ3Jlc3NCYXJ9IHByb2dyZXNzYmFyIFRoZSBwcm9ncmVzc2Jhci5cbiAqIEBwYXJhbSB7UHJvbWlzZS5yZXNvbHZlfSAgcmVzb2x2ZSAgICAgVGhlIG1ldGhvZCB0byBjb21wbGV0ZSBpbmRleCBwcm9jZXNzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBkb1JlaW5kZXhSZXF1ZXN0KCBwb3N0VHlwZSwgcHJvZ3Jlc3NiYXIsIHJlc29sdmUgKSB7XG5cdC8vIERvXG5cdGpRdWVyeS5hamF4KCB7XG5cdFx0dHlwZTogXCJHRVRcIixcblx0XHR1cmw6IHNldHRpbmdzLnJlc3RBcGkucm9vdCArIHNldHRpbmdzLnJlc3RBcGkuZW5kcG9pbnQsXG5cdFx0ZGF0YToge1xuXHRcdFx0cG9zdFR5cGU6IHBvc3RUeXBlLFxuXHRcdH0sXG5cdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHNldHRpbmdzLnJlc3RBcGkubm9uY2UgKTtcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGxldCB0b3RhbEluZGV4ZWQgPSBwYXJzZUludCggcmVzcG9uc2UsIDEwICk7XG5cdFx0XHRpZiAoIHRvdGFsSW5kZXhlZCAhPT0gMCApIHtcblx0XHRcdFx0cHJvZ3Jlc3NiYXIudXBkYXRlKCB0b3RhbEluZGV4ZWQgKTtcblxuXHRcdFx0XHRkb1JlaW5kZXhSZXF1ZXN0KCBwb3N0VHlwZSwgcHJvZ3Jlc3NiYXIsIHJlc29sdmUgKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHByb2dyZXNzYmFyLmNvbXBsZXRlKCk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSxcblx0fSApO1xufVxuXG4vKipcbiAqIFN0YXJ0cyB0aGUgcmVpbmRleGluZyB0aGUgbGlua3MgZm9yIGdpdmVuIHBvc3QgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zdFR5cGUgVGhlIHBvc3R0eXBlIHRvIHJlaW5kZXguXG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlaW5kZXhMaW5rcyggcG9zdFR5cGUgKSB7XG5cblx0Ly8gRG8gcmVxdWVzdCB0byBnZXQgcG9zdCBpZHNcblx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUgKSA9PiB7XG5cdFx0bGV0IHByb2dyZXNzYmFyID0gbmV3IEluZGV4UHJvZ3Jlc3NCYXIoIHBvc3RUeXBlLCBzZXR0aW5ncy5hbW91bnRbIHBvc3RUeXBlIF0gKTtcblx0XHRkb1JlaW5kZXhSZXF1ZXN0KCBwb3N0VHlwZSwgcHJvZ3Jlc3NiYXIsIHJlc29sdmUgKTtcblx0fSApO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGZpbmlzaCBtZXNzYWdlLCB3aGVuIGluZGV4aW5nIGhhcyBiZWVuIGNvbXBsZXRlZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY29tcGxldGVSZWluZGV4aW5nKCkge1xuXHRhMTF5U3BlYWsoIHNldHRpbmdzLmwxMG4uY2FsY3VsYXRpb25Db21wbGV0ZWQgKTtcblx0alF1ZXJ5KCBcIiNyZWluZGV4TGlua3NcIiApLmh0bWwoIHNldHRpbmdzLm1lc3NhZ2UuaW5kZXhpbmdDb21wbGV0ZWQgKTtcblxuXHR0Yl9yZW1vdmUoKTtcbn1cblxuLyoqXG4gKiBTdGFydHMgdGhlIHJlaW5kZXhpbmcgb2YgdGhlIGxpbmtzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBzdGFydFJlaW5kZXhpbmcoKSB7XG5cdGExMXlTcGVhayggc2V0dGluZ3MubDEwbi5jYWxjdWxhdGlvbkluUHJvZ3Jlc3MgKTtcblxuXHRsZXQgcHJvbWlzZXMgPSBbXTtcblx0T2JqZWN0LmtleXMoIHNldHRpbmdzLmFtb3VudCApLmZvckVhY2goIGZ1bmN0aW9uKCBwb3N0X3R5cGUgKSB7XG5cdFx0cHJvbWlzZXMucHVzaCggcmVpbmRleExpbmtzKCBwb3N0X3R5cGUgKSApO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIHByb21pc2VzICkudGhlbiggY29tcGxldGVSZWluZGV4aW5nICk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIGluZGV4YXRpb24gb2YgbGlua3NcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcblx0bGV0IHJlY2FsY3VsYXRpbmcgPSBmYWxzZTtcblx0alF1ZXJ5KCBcIi55b2FzdC1qcy1jYWxjdWxhdGUtaW5kZXgtbGlua3MtLWFsbCBcIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGlmKCByZWNhbGN1bGF0aW5nID09PSBmYWxzZSApIHtcblx0XHRcdHN0YXJ0UmVpbmRleGluZygpO1xuXG5cdFx0XHRyZWNhbGN1bGF0aW5nID0gdHJ1ZTtcblx0XHR9XG5cdH0gKTtcbn1cblxualF1ZXJ5KCBpbml0ICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
