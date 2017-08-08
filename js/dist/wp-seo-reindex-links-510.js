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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXJlaW5kZXgtbGlua3MuanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0tBOzs7Ozs7OztBQUxBOztBQUVBLElBQUksV0FBVyxzQkFBc0IsSUFBckM7QUFDQSxJQUFJLHdCQUF3QixLQUE1Qjs7QUFJQTs7O0lBR00sZ0I7O0FBRUw7Ozs7O0FBS0EsMkJBQWEsS0FBYixFQUFxQjtBQUFBOztBQUNwQixPQUFLLE9BQUwsR0FBZSxPQUFRLDBCQUFSLENBQWY7QUFDQSxPQUFLLGlCQUFMLEdBQXlCLE9BQVEsZ0NBQVIsRUFBMkMsV0FBM0MsQ0FBd0QsRUFBRSxPQUFPLENBQVQsRUFBeEQsQ0FBekI7QUFDQSxPQUFLLEtBQUwsR0FBYSxTQUFVLEtBQVYsRUFBaUIsRUFBakIsQ0FBYjtBQUNBLE9BQUssY0FBTCxHQUFzQixDQUF0QjtBQUNBOztBQUVEOzs7Ozs7Ozs7Ozt5QkFPUSxjLEVBQWlCO0FBQ3hCLFFBQUssY0FBTCxJQUF1QixjQUF2QjtBQUNBLE9BQUksV0FBVyxLQUFLLGNBQUwsSUFBd0IsTUFBTSxLQUFLLEtBQW5DLENBQWY7O0FBRUEsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxLQUFLLEtBQUwsQ0FBWSxRQUFaLENBQTdDO0FBQ0EsUUFBSyxPQUFMLENBQWEsSUFBYixDQUFtQixLQUFLLGNBQXhCO0FBQ0E7O0FBRUQ7Ozs7Ozs7OzZCQUtXO0FBQ1YsUUFBSyxpQkFBTCxDQUF1QixXQUF2QixDQUFvQyxPQUFwQyxFQUE2QyxHQUE3QztBQUNBOzs7Ozs7QUFJRjs7Ozs7Ozs7OztBQVFBLFNBQVMsZ0JBQVQsQ0FBMkIsV0FBM0IsRUFBd0MsT0FBeEMsRUFBa0Q7QUFDakQ7QUFDQSxRQUFPLElBQVAsQ0FBYTtBQUNaLFFBQU0sS0FETTtB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dW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHlvYXN0UmVpbmRleExpbmtzRGF0YSwgalF1ZXJ5LCB0Yl9yZW1vdmUgKi9cblxubGV0IHNldHRpbmdzID0geW9hc3RSZWluZGV4TGlua3NEYXRhLmRhdGE7XG5sZXQgbGlua0luZGV4aW5nQ29tcGxldGVkID0gZmFsc2U7XG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwcm9ncmVzc2JhciBmb3IgdGhlIHJlaW5kZXhpbmcgZm9yIHRoZSBsaW5rcy5cbiAqL1xuY2xhc3MgSW5kZXhQcm9ncmVzc0JhciB7XG5cblx0LyoqXG5cdCAqIFRoZSBjb25zdHJ1Y3Rvci5cblx0ICpcblx0ICogQHBhcmFtIHtpbnR9IHRvdGFsIFRoZSB0b3RhbCBhbW91bnQgb2YgaXRlbXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggdG90YWwgKSB7XG5cdFx0dGhpcy5lbGVtZW50ID0galF1ZXJ5KCBcIiN3cHNlb19jb3VudF9pbmRleF9saW5rc1wiICk7XG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldCA9IGpRdWVyeSggXCIjd3BzZW9faW5kZXhfbGlua3NfcHJvZ3Jlc3NiYXJcIiApLnByb2dyZXNzYmFyKCB7IHZhbHVlOiAwIH0gKTtcblx0XHR0aGlzLnRvdGFsID0gcGFyc2VJbnQoIHRvdGFsLCAxMCApO1xuXHRcdHRoaXMudG90YWxQcm9jZXNzZWQgPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHByb2Nlc3NiYXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7aW50fSBjb3VudFByb2Nlc3NlZCBUaGUgYW1vdW50IG9mIGl0ZW1zIHRoYXQgaGFzIGJlZW4gcHJvY2Vzcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHR1cGRhdGUoIGNvdW50UHJvY2Vzc2VkICkge1xuXHRcdHRoaXMudG90YWxQcm9jZXNzZWQgKz0gY291bnRQcm9jZXNzZWQ7XG5cdFx0bGV0IG5ld1dpZHRoID0gdGhpcy50b3RhbFByb2Nlc3NlZCAqICggMTAwIC8gdGhpcy50b3RhbCApO1xuXG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldC5wcm9ncmVzc2JhciggXCJ2YWx1ZVwiLCBNYXRoLnJvdW5kKCBuZXdXaWR0aCApICk7XG5cdFx0dGhpcy5lbGVtZW50Lmh0bWwoIHRoaXMudG90YWxQcm9jZXNzZWQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb21wbGV0ZXMgdGhlIHByb2Nlc3NiYXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0Y29tcGxldGUoKSB7XG5cdFx0dGhpcy5wcm9ncmVzc2JhclRhcmdldC5wcm9ncmVzc2JhciggXCJ2YWx1ZVwiLCAxMDAgKTtcblx0fVxuXG59XG5cbi8qKlxuICogRG9lcyB0aGUgcmVpbmRleCByZXF1ZXN0IGZvciB0aGUgY3VycmVudCBwb3N0IGFuZCB1cGRhdGVzIHRoZSBwcm9jZXNzYmFyLlxuICpcbiAqIEBwYXJhbSB7SW5kZXhQcm9ncmVzc0Jhcn0gcHJvZ3Jlc3NiYXIgVGhlIHByb2dyZXNzYmFyLlxuICogQHBhcmFtIHtQcm9taXNlLnJlc29sdmV9ICByZXNvbHZlICAgICBUaGUgbWV0aG9kIHRvIGNvbXBsZXRlIGluZGV4IHByb2Nlc3MuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGRvUmVpbmRleFJlcXVlc3QoIHByb2dyZXNzYmFyLCByZXNvbHZlICkge1xuXHQvLyBEb1xuXHRqUXVlcnkuYWpheCgge1xuXHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0dXJsOiBzZXR0aW5ncy5yZXN0QXBpLnJvb3QgKyBzZXR0aW5ncy5yZXN0QXBpLmVuZHBvaW50LFxuXHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCBzZXR0aW5ncy5yZXN0QXBpLm5vbmNlICk7XG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRsZXQgdG90YWxJbmRleGVkID0gcGFyc2VJbnQoIHJlc3BvbnNlLCAxMCApO1xuXHRcdFx0aWYgKCB0b3RhbEluZGV4ZWQgIT09IDAgKSB7XG5cdFx0XHRcdHByb2dyZXNzYmFyLnVwZGF0ZSggdG90YWxJbmRleGVkICk7XG5cblx0XHRcdFx0ZG9SZWluZGV4UmVxdWVzdCggcHJvZ3Jlc3NiYXIsIHJlc29sdmUgKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHByb2dyZXNzYmFyLmNvbXBsZXRlKCk7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSxcblx0fSApO1xufVxuXG4vKipcbiAqIFN0YXJ0cyB0aGUgcmVpbmRleGluZyBvZiB0aGUgbGlua3MuXG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UuXG4gKi9cbmZ1bmN0aW9uIHJlaW5kZXhMaW5rcygpIHtcblx0Ly8gRG8gcmVxdWVzdCB0byBnZXQgcG9zdCBpZHNcblx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUgKSA9PiB7XG5cdFx0bGV0IHByb2dyZXNzYmFyID0gbmV3IEluZGV4UHJvZ3Jlc3NCYXIoIHNldHRpbmdzLmFtb3VudCApO1xuXHRcdGRvUmVpbmRleFJlcXVlc3QoIHByb2dyZXNzYmFyLCByZXNvbHZlICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBmaW5pc2ggbWVzc2FnZSwgd2hlbiBpbmRleGluZyBoYXMgYmVlbiBjb21wbGV0ZWQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGNvbXBsZXRlUmVpbmRleGluZygpIHtcblx0bGlua0luZGV4aW5nQ29tcGxldGVkID0gdHJ1ZTtcblx0YTExeVNwZWFrKCBzZXR0aW5ncy5sMTBuLmNhbGN1bGF0aW9uQ29tcGxldGVkICk7XG5cdGpRdWVyeSggXCIjcmVpbmRleExpbmtzXCIgKS5odG1sKCBzZXR0aW5ncy5tZXNzYWdlLmluZGV4aW5nQ29tcGxldGVkICk7XG5cblx0dGJfcmVtb3ZlKCk7XG59XG5cbi8qKlxuICogU3RhcnRzIHRoZSByZWluZGV4aW5nIG9mIHRoZSBsaW5rcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRSZWluZGV4aW5nKCkge1xuXHRhMTF5U3BlYWsoIHNldHRpbmdzLmwxMG4uY2FsY3VsYXRpb25JblByb2dyZXNzICk7XG5cblx0bGV0IHByb21pc2VzID0gW107XG5cdHByb21pc2VzLnB1c2goIHJlaW5kZXhMaW5rcygpICk7XG5cdFByb21pc2UuYWxsKCBwcm9taXNlcyApLnRoZW4oIGNvbXBsZXRlUmVpbmRleGluZyApO1xufVxuXG4vKipcbiAqIE9wZW5zIHRoZSBsaW5rIGluZGV4aW5nIG1vZGFsLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBvcGVuTGlua0luZGV4aW5nKCkge1xuXHRqUXVlcnkoIFwiI2dlbmVyYWwtdGFiXCIgKS5jbGljaygpO1xuXG5cdGlmICggbGlua0luZGV4aW5nQ29tcGxldGVkID09PSBmYWxzZSApIHtcblx0XHRqUXVlcnkoIFwiI29wZW5MaW5rSW5kZXhpbmdcIiApLmNsaWNrKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgaW5kZXhhdGlvbiBvZiBsaW5rcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcblx0bGV0IHJlY2FsY3VsYXRpbmcgPSBmYWxzZTtcblx0alF1ZXJ5KCBcIi55b2FzdC1qcy1jYWxjdWxhdGUtaW5kZXgtbGlua3MtLWFsbCBcIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGlmKCByZWNhbGN1bGF0aW5nID09PSBmYWxzZSApIHtcblx0XHRcdHN0YXJ0UmVpbmRleGluZygpO1xuXG5cdFx0XHRyZWNhbGN1bGF0aW5nID0gdHJ1ZTtcblx0XHR9XG5cdH0gKTtcblxuXHRqUXVlcnkoIFwiI25vdGljZVJ1bkxpbmtJbmRleFwiICkuY2xpY2soIG9wZW5MaW5rSW5kZXhpbmcgKTtcbn1cblxualF1ZXJ5KCBpbml0ICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
