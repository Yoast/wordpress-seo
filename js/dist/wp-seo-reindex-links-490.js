(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global yoastReindexLinksData, jQuery, tb_remove */

var settings = yoastReindexLinksData.data;
var linkIndexingCompleted = false;

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
 * Does the reindex request for the current post and updates the processbar.
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
	linkIndexingCompleted = true;
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
 * Opens the link indexing modal.
 *
 * @returns {void}
 */
function openLinkIndexing() {
	jQuery("#general-tab").click();

	if (linkIndexingCompleted === false) {
		jQuery("#openLinkIndexing").click();
	}
}

/**
 * Initializes the indexation of links.
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

	jQuery("#noticeRunLinkIndex").click(openLinkIndexing);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXJlaW5kZXgtbGlua3MuanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0tBOzs7Ozs7OztBQUxBOztBQUVBLElBQUksV0FBVyxzQkFBc0IsSUFBckM7QUFDQSxJQUFJLHdCQUF3QixLQUE1Qjs7QUFJQTs7O0lBR00sZ0I7O0FBRUw7Ozs7OztBQU1BLDJCQUFhLFFBQWIsRUFBdUIsS0FBdkIsRUFBK0I7QUFBQTs7QUFDOUIsT0FBSyxPQUFMLEdBQWUsT0FBUSw4QkFBOEIsUUFBdEMsQ0FBZjtBQUNBLE9BQUssaUJBQUwsR0FBeUIsT0FBUSx3QkFBd0IsUUFBeEIsR0FBbUMsY0FBM0MsRUFBNEQsV0FBNUQsQ0FBeUUsRUFBRSxPQUFPLENBQVQsRUFBekUsQ0FBekI7QUFDQSxPQUFLLEtBQUwsR0FBYSxTQUFVLEtBQVYsRUFBaUIsRUFBakIsQ0FBYjtBQUNBLE9BQUssY0FBTCxHQUFzQixDQUF0QjtBQUNBOztBQUVEOzs7Ozs7Ozs7Ozt5QkFPUSxjLEVBQWlCO0FBQ3hCLFFBQUssY0FBTCxJQUF1QixjQUF2QjtBQUNBLE9BQUksV0FBVyxLQUFLLGNBQUwsSUFBd0IsTUFBTSxLQUFLLEtBQW5DLENBQWY7O0FBRUEsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxLQUFLLEtBQUwsQ0FBWSxRQUFaLENBQTdDO0FBQ0EsUUFBSyxPQUFMLENBQWEsSUFBYixDQUFtQixLQUFLLGNBQXhCO0FBQ0E7O0FBRUQ7Ozs7Ozs7OzZCQUtXO0FBQ1YsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxHQUE3QztBQUNBOzs7Ozs7QUFJRjs7Ozs7Ozs7Ozs7QUFTQSxTQUFTLGdCQUFULENBQTJCLFFBQTNCLEVBQXFDLFdBQXJDLEVBQWtELE9B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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgeW9hc3RSZWluZGV4TGlua3NEYXRhLCBqUXVlcnksIHRiX3JlbW92ZSAqL1xuXG5sZXQgc2V0dGluZ3MgPSB5b2FzdFJlaW5kZXhMaW5rc0RhdGEuZGF0YTtcbmxldCBsaW5rSW5kZXhpbmdDb21wbGV0ZWQgPSBmYWxzZTtcblxuaW1wb3J0IGExMXlTcGVhayBmcm9tIFwiYTExeS1zcGVha1wiO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHByb2dyZXNzYmFyIGZvciB0aGUgcmVpbmRleGluZyBmb3IgdGhlIGxpbmtzLlxuICovXG5jbGFzcyBJbmRleFByb2dyZXNzQmFyIHtcblxuXHQvKipcblx0ICogVGhlIGNvbnN0cnVjdG9yLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcG9zdFR5cGUgVGhlIHBvc3QgdHlwZS5cblx0ICogQHBhcmFtIHtpbnR9ICAgIHRvdGFsICAgIFRoZSB0b3RhbCBhbW91bnQgb2YgaXRlbXMgZm9yIHBvc3QgdHlwZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCBwb3N0VHlwZSwgdG90YWwgKSB7XG5cdFx0dGhpcy5lbGVtZW50ID0galF1ZXJ5KCBcIiN3cHNlb19jb3VudF9pbmRleF9saW5rc19cIiArIHBvc3RUeXBlICk7XG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldCA9IGpRdWVyeSggXCIjd3BzZW9faW5kZXhfbGlua3NfXCIgKyBwb3N0VHlwZSArIFwiX3Byb2dyZXNzYmFyXCIgKS5wcm9ncmVzc2JhciggeyB2YWx1ZTogMCB9ICk7XG5cdFx0dGhpcy50b3RhbCA9IHBhcnNlSW50KCB0b3RhbCwgMTAgKTtcblx0XHR0aGlzLnRvdGFsUHJvY2Vzc2VkID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwcm9jZXNzYmFyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2ludH0gY291bnRQcm9jZXNzZWQgVGhlIGFtb3VudCBvZiBpdGVtcyB0aGF0IGhhcyBiZWVuIHByb2Nlc3MuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0dXBkYXRlKCBjb3VudFByb2Nlc3NlZCApIHtcblx0XHR0aGlzLnRvdGFsUHJvY2Vzc2VkICs9IGNvdW50UHJvY2Vzc2VkO1xuXHRcdGxldCBuZXdXaWR0aCA9IHRoaXMudG90YWxQcm9jZXNzZWQgKiAoIDEwMCAvIHRoaXMudG90YWwgKTtcblxuXHRcdHRoaXMucHJvZ3Jlc3NiYXJUYXJnZXQucHJvZ3Jlc3NiYXIoIFwidmFsdWVcIiwgTWF0aC5yb3VuZCggbmV3V2lkdGggKSApO1xuXHRcdHRoaXMuZWxlbWVudC5odG1sKCB0aGlzLnRvdGFsUHJvY2Vzc2VkICk7XG5cdH1cblxuXHQvKipcblx0ICogQ29tcGxldGVzIHRoZSBwcm9jZXNzYmFyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGNvbXBsZXRlKCkge1xuXHRcdHRoaXMucHJvZ3Jlc3NiYXJUYXJnZXQucHJvZ3Jlc3NiYXIoIFwidmFsdWVcIiwgMTAwICk7XG5cdH1cblxufVxuXG4vKipcbiAqIERvZXMgdGhlIHJlaW5kZXggcmVxdWVzdCBmb3IgdGhlIGN1cnJlbnQgcG9zdCBhbmQgdXBkYXRlcyB0aGUgcHJvY2Vzc2Jhci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgIHBvc3RUeXBlICAgIFRoZSBwb3N0dHR5cGUgdG8gcmVpbmRleC5cbiAqIEBwYXJhbSB7SW5kZXhQcm9ncmVzc0Jhcn0gcHJvZ3Jlc3NiYXIgVGhlIHByb2dyZXNzYmFyLlxuICogQHBhcmFtIHtQcm9taXNlLnJlc29sdmV9ICByZXNvbHZlICAgICBUaGUgbWV0aG9kIHRvIGNvbXBsZXRlIGluZGV4IHByb2Nlc3MuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGRvUmVpbmRleFJlcXVlc3QoIHBvc3RUeXBlLCBwcm9ncmVzc2JhciwgcmVzb2x2ZSApIHtcblx0Ly8gRG9cblx0alF1ZXJ5LmFqYXgoIHtcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdHVybDogc2V0dGluZ3MucmVzdEFwaS5yb290ICsgc2V0dGluZ3MucmVzdEFwaS5lbmRwb2ludCxcblx0XHRkYXRhOiB7XG5cdFx0XHRwb3N0VHlwZTogcG9zdFR5cGUsXG5cdFx0fSxcblx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgc2V0dGluZ3MucmVzdEFwaS5ub25jZSApO1xuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0bGV0IHRvdGFsSW5kZXhlZCA9IHBhcnNlSW50KCByZXNwb25zZSwgMTAgKTtcblx0XHRcdGlmICggdG90YWxJbmRleGVkICE9PSAwICkge1xuXHRcdFx0XHRwcm9ncmVzc2Jhci51cGRhdGUoIHRvdGFsSW5kZXhlZCApO1xuXG5cdFx0XHRcdGRvUmVpbmRleFJlcXVlc3QoIHBvc3RUeXBlLCBwcm9ncmVzc2JhciwgcmVzb2x2ZSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cHJvZ3Jlc3NiYXIuY29tcGxldGUoKTtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9LFxuXHR9ICk7XG59XG5cbi8qKlxuICogU3RhcnRzIHRoZSByZWluZGV4aW5nIHRoZSBsaW5rcyBmb3IgZ2l2ZW4gcG9zdCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3N0VHlwZSBUaGUgcG9zdHR5cGUgdG8gcmVpbmRleC5cbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gcmVpbmRleExpbmtzKCBwb3N0VHlwZSApIHtcblx0Ly8gRG8gcmVxdWVzdCB0byBnZXQgcG9zdCBpZHNcblx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUgKSA9PiB7XG5cdFx0bGV0IHByb2dyZXNzYmFyID0gbmV3IEluZGV4UHJvZ3Jlc3NCYXIoIHBvc3RUeXBlLCBzZXR0aW5ncy5hbW91bnRbIHBvc3RUeXBlIF0gKTtcblx0XHRkb1JlaW5kZXhSZXF1ZXN0KCBwb3N0VHlwZSwgcHJvZ3Jlc3NiYXIsIHJlc29sdmUgKTtcblx0fSApO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGZpbmlzaCBtZXNzYWdlLCB3aGVuIGluZGV4aW5nIGhhcyBiZWVuIGNvbXBsZXRlZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY29tcGxldGVSZWluZGV4aW5nKCkge1xuXHRsaW5rSW5kZXhpbmdDb21wbGV0ZWQgPSB0cnVlO1xuXHRhMTF5U3BlYWsoIHNldHRpbmdzLmwxMG4uY2FsY3VsYXRpb25Db21wbGV0ZWQgKTtcblx0alF1ZXJ5KCBcIiNyZWluZGV4TGlua3NcIiApLmh0bWwoIHNldHRpbmdzLm1lc3NhZ2UuaW5kZXhpbmdDb21wbGV0ZWQgKTtcblxuXHR0Yl9yZW1vdmUoKTtcbn1cblxuLyoqXG4gKiBTdGFydHMgdGhlIHJlaW5kZXhpbmcgb2YgdGhlIGxpbmtzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBzdGFydFJlaW5kZXhpbmcoKSB7XG5cdGExMXlTcGVhayggc2V0dGluZ3MubDEwbi5jYWxjdWxhdGlvbkluUHJvZ3Jlc3MgKTtcblxuXHRsZXQgcHJvbWlzZXMgPSBbXTtcblx0T2JqZWN0LmtleXMoIHNldHRpbmdzLmFtb3VudCApLmZvckVhY2goIGZ1bmN0aW9uKCBwb3N0X3R5cGUgKSB7XG5cdFx0cHJvbWlzZXMucHVzaCggcmVpbmRleExpbmtzKCBwb3N0X3R5cGUgKSApO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIHByb21pc2VzICkudGhlbiggY29tcGxldGVSZWluZGV4aW5nICk7XG59XG5cbi8qKlxuICogT3BlbnMgdGhlIGxpbmsgaW5kZXhpbmcgbW9kYWwuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIG9wZW5MaW5rSW5kZXhpbmcoKSB7XG5cdGpRdWVyeSggXCIjZ2VuZXJhbC10YWJcIiApLmNsaWNrKCk7XG5cblx0aWYgKCBsaW5rSW5kZXhpbmdDb21wbGV0ZWQgPT09IGZhbHNlICkge1xuXHRcdGpRdWVyeSggXCIjb3BlbkxpbmtJbmRleGluZ1wiICkuY2xpY2soKTtcblx0fVxufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBpbmRleGF0aW9uIG9mIGxpbmtzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBpbml0KCkge1xuXHRsZXQgcmVjYWxjdWxhdGluZyA9IGZhbHNlO1xuXHRqUXVlcnkoIFwiLnlvYXN0LWpzLWNhbGN1bGF0ZS1pbmRleC1saW5rcy0tYWxsIFwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0aWYoIHJlY2FsY3VsYXRpbmcgPT09IGZhbHNlICkge1xuXHRcdFx0c3RhcnRSZWluZGV4aW5nKCk7XG5cblx0XHRcdHJlY2FsY3VsYXRpbmcgPSB0cnVlO1xuXHRcdH1cblx0fSApO1xuXG5cdGpRdWVyeSggXCIjbm90aWNlUnVuTGlua0luZGV4XCIgKS5jbGljayggb3BlbkxpbmtJbmRleGluZyApO1xufVxuXG5qUXVlcnkoIGluaXQgKTtcbiIsInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuIl19
