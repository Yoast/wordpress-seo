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
  * @param {int} total The total amount of items.
  */
	function IndexProgressBar(total) {
		_classCallCheck(this, IndexProgressBar);

		this.element = jQuery("#wpseo_count_index_links");
		this.progressbarTarget = jQuery("#wpseo_index_links_progressbar").progressbar({ value: 0 });
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
 * @param {IndexProgressBar} progressbar The progressbar.
 * @param {Promise.resolve}  resolve     The method to complete index process.
 *
 * @returns {void}
 */


function doReindexRequest(progressbar, resolve) {
	// Do
	jQuery.ajax({
		type: "GET",
		url: settings.restApi.root + settings.restApi.endpoint,
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", settings.restApi.nonce);
		},
		success: function success(response) {
			var totalIndexed = parseInt(response, 10);
			if (totalIndexed !== 0) {
				progressbar.update(totalIndexed);

				doReindexRequest(progressbar, resolve);

				return;
			}

			progressbar.complete();
			resolve();
		}
	});
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {Promise} Promise.
 */
function reindexLinks() {
	// Do request to get post ids
	return new Promise(function (resolve) {
		var progressbar = new IndexProgressBar(settings.amount);
		doReindexRequest(progressbar, resolve);
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
	promises.push(reindexLinks());
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

	if (window.location.href.indexOf("&reIndexLinks=1") !== -1) {
		jQuery(openLinkIndexing);
	}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXJlaW5kZXgtbGlua3MuanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0tBOzs7Ozs7OztBQUxBOztBQUVBLElBQUksV0FBVyxzQkFBc0IsSUFBckM7QUFDQSxJQUFJLHdCQUF3QixLQUE1Qjs7QUFJQTs7O0lBR00sZ0I7O0FBRUw7Ozs7O0FBS0EsMkJBQWEsS0FBYixFQUFxQjtBQUFBOztBQUNwQixPQUFLLE9BQUwsR0FBZSxPQUFRLDBCQUFSLENBQWY7QUFDQSxPQUFLLGlCQUFMLEdBQXlCLE9BQVEsZ0NBQVIsRUFBMkMsV0FBM0MsQ0FBd0QsRUFBRSxPQUFPLENBQVQsRUFBeEQsQ0FBekI7QUFDQSxPQUFLLEtBQUwsR0FBYSxTQUFVLEtBQVYsRUFBaUIsRUFBakIsQ0FBYjtBQUNBLE9BQUssY0FBTCxHQUFzQixDQUF0QjtBQUNBOztBQUVEOzs7Ozs7Ozs7Ozt5QkFPUSxjLEVBQWlCO0FBQ3hCLFFBQUssY0FBTCxJQUF1QixjQUF2QjtBQUNBLE9BQUksV0FBVyxLQUFLLGNBQUwsSUFBd0IsTUFBTSxLQUFLLEtBQW5DLENBQWY7O0FBRUEsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxLQUFLLEtBQUwsQ0FBWSxRQUFaLENBQTdDO0FBQ0EsUUFBSyxPQUFMLENBQWEsSUFBYixDQUFtQixLQUFLLGNBQXhCO0FBQ0E7O0FBRUQ7Ozs7Ozs7OzZCQUtXO0FBQ1YsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxHQUE3QztBQUNBOzs7Ozs7QUFJRjs7Ozs7Ozs7OztBQVFBLFNBQVMsZ0JBQVQsQ0FBMkIsV0FBM0IsRUFBd0MsT0FBeEMsRUFBa0Q7QUFDakQ7QUFDQSxRQUFPLElBQVAsQ0FBYTtBQUNaLFFBQU0sS0FETTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB5b2FzdFJlaW5kZXhMaW5rc0RhdGEsIGpRdWVyeSwgdGJfcmVtb3ZlICovXG5cbmxldCBzZXR0aW5ncyA9IHlvYXN0UmVpbmRleExpbmtzRGF0YS5kYXRhO1xubGV0IGxpbmtJbmRleGluZ0NvbXBsZXRlZCA9IGZhbHNlO1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvZ3Jlc3NiYXIgZm9yIHRoZSByZWluZGV4aW5nIGZvciB0aGUgbGlua3MuXG4gKi9cbmNsYXNzIEluZGV4UHJvZ3Jlc3NCYXIge1xuXG5cdC8qKlxuXHQgKiBUaGUgY29uc3RydWN0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSB7aW50fSB0b3RhbCBUaGUgdG90YWwgYW1vdW50IG9mIGl0ZW1zLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHRvdGFsICkge1xuXHRcdHRoaXMuZWxlbWVudCA9IGpRdWVyeSggXCIjd3BzZW9fY291bnRfaW5kZXhfbGlua3NcIiApO1xuXHRcdHRoaXMucHJvZ3Jlc3NiYXJUYXJnZXQgPSBqUXVlcnkoIFwiI3dwc2VvX2luZGV4X2xpbmtzX3Byb2dyZXNzYmFyXCIgKS5wcm9ncmVzc2JhciggeyB2YWx1ZTogMCB9ICk7XG5cdFx0dGhpcy50b3RhbCA9IHBhcnNlSW50KCB0b3RhbCwgMTAgKTtcblx0XHR0aGlzLnRvdGFsUHJvY2Vzc2VkID0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwcm9jZXNzYmFyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2ludH0gY291bnRQcm9jZXNzZWQgVGhlIGFtb3VudCBvZiBpdGVtcyB0aGF0IGhhcyBiZWVuIHByb2Nlc3MuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0dXBkYXRlKCBjb3VudFByb2Nlc3NlZCApIHtcblx0XHR0aGlzLnRvdGFsUHJvY2Vzc2VkICs9IGNvdW50UHJvY2Vzc2VkO1xuXHRcdGxldCBuZXdXaWR0aCA9IHRoaXMudG90YWxQcm9jZXNzZWQgKiAoIDEwMCAvIHRoaXMudG90YWwgKTtcblxuXHRcdHRoaXMucHJvZ3Jlc3NiYXJUYXJnZXQucHJvZ3Jlc3NiYXIoIFwidmFsdWVcIiwgTWF0aC5yb3VuZCggbmV3V2lkdGggKSApO1xuXHRcdHRoaXMuZWxlbWVudC5odG1sKCB0aGlzLnRvdGFsUHJvY2Vzc2VkICk7XG5cdH1cblxuXHQvKipcblx0ICogQ29tcGxldGVzIHRoZSBwcm9jZXNzYmFyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGNvbXBsZXRlKCkge1xuXHRcdHRoaXMucHJvZ3Jlc3NiYXJUYXJnZXQucHJvZ3Jlc3NiYXIoIFwidmFsdWVcIiwgMTAwICk7XG5cdH1cblxufVxuXG4vKipcbiAqIERvZXMgdGhlIHJlaW5kZXggcmVxdWVzdCBmb3IgdGhlIGN1cnJlbnQgcG9zdCBhbmQgdXBkYXRlcyB0aGUgcHJvY2Vzc2Jhci5cbiAqXG4gKiBAcGFyYW0ge0luZGV4UHJvZ3Jlc3NCYXJ9IHByb2dyZXNzYmFyIFRoZSBwcm9ncmVzc2Jhci5cbiAqIEBwYXJhbSB7UHJvbWlzZS5yZXNvbHZlfSAgcmVzb2x2ZSAgICAgVGhlIG1ldGhvZCB0byBjb21wbGV0ZSBpbmRleCBwcm9jZXNzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBkb1JlaW5kZXhSZXF1ZXN0KCBwcm9ncmVzc2JhciwgcmVzb2x2ZSApIHtcblx0Ly8gRG9cblx0alF1ZXJ5LmFqYXgoIHtcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdHVybDogc2V0dGluZ3MucmVzdEFwaS5yb290ICsgc2V0dGluZ3MucmVzdEFwaS5lbmRwb2ludCxcblx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgc2V0dGluZ3MucmVzdEFwaS5ub25jZSApO1xuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0bGV0IHRvdGFsSW5kZXhlZCA9IHBhcnNlSW50KCByZXNwb25zZSwgMTAgKTtcblx0XHRcdGlmICggdG90YWxJbmRleGVkICE9PSAwICkge1xuXHRcdFx0XHRwcm9ncmVzc2Jhci51cGRhdGUoIHRvdGFsSW5kZXhlZCApO1xuXG5cdFx0XHRcdGRvUmVpbmRleFJlcXVlc3QoIHByb2dyZXNzYmFyLCByZXNvbHZlICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRwcm9ncmVzc2Jhci5jb21wbGV0ZSgpO1xuXHRcdFx0cmVzb2x2ZSgpO1xuXHRcdH0sXG5cdH0gKTtcbn1cblxuLyoqXG4gKiBTdGFydHMgdGhlIHJlaW5kZXhpbmcgb2YgdGhlIGxpbmtzLlxuICpcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlLlxuICovXG5mdW5jdGlvbiByZWluZGV4TGlua3MoKSB7XG5cdC8vIERvIHJlcXVlc3QgdG8gZ2V0IHBvc3QgaWRzXG5cdHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlICkgPT4ge1xuXHRcdGxldCBwcm9ncmVzc2JhciA9IG5ldyBJbmRleFByb2dyZXNzQmFyKCBzZXR0aW5ncy5hbW91bnQgKTtcblx0XHRkb1JlaW5kZXhSZXF1ZXN0KCBwcm9ncmVzc2JhciwgcmVzb2x2ZSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgZmluaXNoIG1lc3NhZ2UsIHdoZW4gaW5kZXhpbmcgaGFzIGJlZW4gY29tcGxldGVkLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBjb21wbGV0ZVJlaW5kZXhpbmcoKSB7XG5cdGxpbmtJbmRleGluZ0NvbXBsZXRlZCA9IHRydWU7XG5cdGExMXlTcGVhayggc2V0dGluZ3MubDEwbi5jYWxjdWxhdGlvbkNvbXBsZXRlZCApO1xuXHRqUXVlcnkoIFwiI3JlaW5kZXhMaW5rc1wiICkuaHRtbCggc2V0dGluZ3MubWVzc2FnZS5pbmRleGluZ0NvbXBsZXRlZCApO1xuXG5cdHRiX3JlbW92ZSgpO1xufVxuXG4vKipcbiAqIFN0YXJ0cyB0aGUgcmVpbmRleGluZyBvZiB0aGUgbGlua3MuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHN0YXJ0UmVpbmRleGluZygpIHtcblx0YTExeVNwZWFrKCBzZXR0aW5ncy5sMTBuLmNhbGN1bGF0aW9uSW5Qcm9ncmVzcyApO1xuXG5cdGxldCBwcm9taXNlcyA9IFtdO1xuXHRwcm9taXNlcy5wdXNoKCByZWluZGV4TGlua3MoKSApO1xuXHRQcm9taXNlLmFsbCggcHJvbWlzZXMgKS50aGVuKCBjb21wbGV0ZVJlaW5kZXhpbmcgKTtcbn1cblxuLyoqXG4gKiBPcGVucyB0aGUgbGluayBpbmRleGluZyBtb2RhbC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gb3BlbkxpbmtJbmRleGluZygpIHtcblx0alF1ZXJ5KCBcIiNnZW5lcmFsLXRhYlwiICkuY2xpY2soKTtcblxuXHRpZiAoIGxpbmtJbmRleGluZ0NvbXBsZXRlZCA9PT0gZmFsc2UgKSB7XG5cdFx0alF1ZXJ5KCBcIiNvcGVuTGlua0luZGV4aW5nXCIgKS5jbGljaygpO1xuXHR9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIGluZGV4YXRpb24gb2YgbGlua3MuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdGxldCByZWNhbGN1bGF0aW5nID0gZmFsc2U7XG5cdGpRdWVyeSggXCIueW9hc3QtanMtY2FsY3VsYXRlLWluZGV4LWxpbmtzLS1hbGwgXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRpZiggcmVjYWxjdWxhdGluZyA9PT0gZmFsc2UgKSB7XG5cdFx0XHRzdGFydFJlaW5kZXhpbmcoKTtcblxuXHRcdFx0cmVjYWxjdWxhdGluZyA9IHRydWU7XG5cdFx0fVxuXHR9ICk7XG5cblx0alF1ZXJ5KCBcIiNub3RpY2VSdW5MaW5rSW5kZXhcIiApLmNsaWNrKCBvcGVuTGlua0luZGV4aW5nICk7XG5cblx0aWYgKCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCBcIiZyZUluZGV4TGlua3M9MVwiICkgIT09IC0xICkge1xuXHRcdGpRdWVyeSggb3BlbkxpbmtJbmRleGluZyApO1xuXHR9XG59XG5cbmpRdWVyeSggaW5pdCApO1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
