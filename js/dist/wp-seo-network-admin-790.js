(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {
	"use strict";

	/**
  * Displays given settings errors.
  *
  * @param {Object} settingsErrors The list of settings error objects.
  *
  * @returns {void}
  */

	function displaySettingsErrors(settingsErrors) {
		var $heading = $(".wrap > h1");
		var notices;
		var prefix;

		if (!settingsErrors.length) {
			return;
		}

		notices = settingsErrors.map(function (settingsError) {
			return "<div class='" + settingsError.type + " notice'><p>" + settingsError.message + "</p></div>";
		});

		$heading.after(notices.join(""));

		prefix = wpseoNetworkAdminGlobalL10n.error_prefix;
		if (settingsErrors[0].type === "updated") {
			prefix = wpseoNetworkAdminGlobalL10n.success_prefix;
		}

		(0, _a11ySpeak2.default)(prefix.replace("%s", settingsErrors[0].message), "assertive");
	}

	/**
  * Handles a form submission with AJAX.
  *
  * @param {Event} event The submission event.
  *
  * @returns {void}
  */
	function handleAJAXSubmission(event) {
		var $form = $(this);
		var $submit = $form.find("[type='submit']:focus");
		var formData = $form.serialize();

		event.preventDefault();

		$(".wrap > .notice").remove();

		if (!$submit.length) {
			$submit = $(".wpseotab.active [type='submit']");
		}

		if ($submit.attr("name") === "action") {
			formData = formData.replace(/action=([a-zA-Z0-9_]+)/, "action=" + $submit.val());
		}

		$.ajax({
			type: "POST",
			url: ajaxurl,
			data: formData
		}).done(function (response) {
			if (!response.data) {
				return;
			}

			displaySettingsErrors(response.data);
		}).fail(function (xhr) {
			var response = xhr.responseJSON;

			if (!response || !response.data) {
				return;
			}

			displaySettingsErrors(response.data);
		});

		return false;
	}

	$(document).ready(function () {
		var $form = $("#wpseo-conf");

		if (!$form.length) {
			return;
		}

		$form.on("submit", handleAJAXSubmission);
	});
})(jQuery); /* global wpseoNetworkAdminGlobalL10n, ajaxurl */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQTs7Ozs7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHFCQUFULENBQWdDLGNBQWhDLEVBQWlEO0FBQ2hELE1BQUksV0FBVyxFQUFHLFlBQUgsQ0FBZjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFLLENBQUUsZUFBZSxNQUF0QixFQUErQjtBQUM5QjtBQUNBOztBQUVELFlBQVUsZUFBZSxHQUFmLENBQW9CLFVBQVUsYUFBVixFQUEwQjtBQUN2RCxVQUFPLGlCQUFpQixjQUFjLElBQS9CLEdBQXNDLGNBQXRDLEdBQXVELGNBQWMsT0FBckUsR0FBK0UsWUFBdEY7QUFDQSxHQUZTLENBQVY7O0FBSUEsV0FBUyxLQUFULENBQWdCLFFBQVEsSUFBUixDQUFjLEVBQWQsQ0FBaEI7O0FBRUEsV0FBUyw0QkFBNEIsWUFBckM7QUFDQSxNQUFLLGVBQWdCLENBQWhCLEVBQW9CLElBQXBCLEtBQTZCLFNBQWxDLEVBQThDO0FBQzdDLFlBQVMsNEJBQTRCLGNBQXJDO0FBQ0E7O0FBRUQsMkJBQVcsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLGVBQWdCLENBQWhCLEVBQW9CLE9BQTFDLENBQVgsRUFBZ0UsV0FBaEU7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBdUM7QUFDdEMsTUFBSSxRQUFXLEVBQUcsSUFBSCxDQUFmO0FBQ0EsTUFBSSxVQUFXLE1BQU0sSUFBTixDQUFZLHVCQUFaLENBQWY7QUFDQSxNQUFJLFdBQVcsTUFBTSxTQUFOLEVBQWY7O0FBRUEsUUFBTSxjQUFOOztBQUVBLElBQUcsaUJBQUgsRUFBdUIsTUFBdkI7O0FBRUEsTUFBSyxDQUFFLFFBQVEsTUFBZixFQUF3QjtBQUN2QixhQUFVLEVBQUcsa0NBQUgsQ0FBVjtBQUNBOztBQUVELE1BQUssUUFBUSxJQUFSLENBQWMsTUFBZCxNQUEyQixRQUFoQyxFQUEyQztBQUMxQyxjQUFXLFNBQVMsT0FBVCxDQUFrQix3QkFBbEIsRUFBNEMsWUFBWSxRQUFRLEdBQVIsRUFBeEQsQ0FBWDtBQUNBOztBQUVELElBQUUsSUFBRixDQUFRO0FBQ1AsU0FBTSxNQURDO0FBRVAsUUFBSyxPQUZFO0FBR1AsU0FBTTtBQUhDLEdBQVIsRUFLRSxJQUxGLENBS1EsVUFBVSxRQUFWLEVBQXFCO0FBQzNCLE9BQUssQ0FBRSxTQUFTLElBQWhCLEVBQXVCO0FBQ3RCO0FBQ0E7O0FBRUQseUJBQXVCLFNBQVMsSUFBaEM7QUFDQSxHQVhGLEVBWUUsSUFaRixDQVlRLFVBQVUsR0FBVixFQUFnQjtBQUN0QixPQUFJLFdBQVcsSUFBSSxZQUFuQjs7QUFFQSxPQUFLLENBQUUsUUFBRixJQUFjLENBQUUsU0FBUyxJQUE5QixFQUFxQztBQUNwQztBQUNBOztBQUVELHlCQUF1QixTQUFTLElBQWhDO0FBQ0EsR0FwQkY7O0FBc0JBLFNBQU8sS0FBUDtBQUNBOztBQUVELEdBQUcsUUFBSCxFQUFjLEtBQWQsQ0FBcUIsWUFBVztBQUMvQixNQUFJLFFBQVEsRUFBRyxhQUFILENBQVo7O0FBRUEsTUFBSyxDQUFFLE1BQU0sTUFBYixFQUFzQjtBQUNyQjtBQUNBOztBQUVELFFBQU0sRUFBTixDQUFVLFFBQVYsRUFBb0Isb0JBQXBCO0FBQ0EsRUFSRDtBQVNBLENBM0ZDLEVBMkZDLE1BM0ZELENBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwc2VvTmV0d29ya0FkbWluR2xvYmFsTDEwbiwgYWpheHVybCAqL1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBnaXZlbiBzZXR0aW5ncyBlcnJvcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc0Vycm9ycyBUaGUgbGlzdCBvZiBzZXR0aW5ncyBlcnJvciBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlTZXR0aW5nc0Vycm9ycyggc2V0dGluZ3NFcnJvcnMgKSB7XG5cdFx0dmFyICRoZWFkaW5nID0gJCggXCIud3JhcCA+IGgxXCIgKTtcblx0XHR2YXIgbm90aWNlcztcblx0XHR2YXIgcHJlZml4O1xuXG5cdFx0aWYgKCAhIHNldHRpbmdzRXJyb3JzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub3RpY2VzID0gc2V0dGluZ3NFcnJvcnMubWFwKCBmdW5jdGlvbiggc2V0dGluZ3NFcnJvciApIHtcblx0XHRcdHJldHVybiBcIjxkaXYgY2xhc3M9J1wiICsgc2V0dGluZ3NFcnJvci50eXBlICsgXCIgbm90aWNlJz48cD5cIiArIHNldHRpbmdzRXJyb3IubWVzc2FnZSArIFwiPC9wPjwvZGl2PlwiO1xuXHRcdH0gKTtcblxuXHRcdCRoZWFkaW5nLmFmdGVyKCBub3RpY2VzLmpvaW4oIFwiXCIgKSApO1xuXG5cdFx0cHJlZml4ID0gd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLmVycm9yX3ByZWZpeDtcblx0XHRpZiAoIHNldHRpbmdzRXJyb3JzWyAwIF0udHlwZSA9PT0gXCJ1cGRhdGVkXCIgKSB7XG5cdFx0XHRwcmVmaXggPSB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uc3VjY2Vzc19wcmVmaXg7XG5cdFx0fVxuXG5cdFx0YTExeVNwZWFrKCBwcmVmaXgucmVwbGFjZSggXCIlc1wiLCBzZXR0aW5nc0Vycm9yc1sgMCBdLm1lc3NhZ2UgKSwgXCJhc3NlcnRpdmVcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSBmb3JtIHN1Ym1pc3Npb24gd2l0aCBBSkFYLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgc3VibWlzc2lvbiBldmVudC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVBSkFYU3VibWlzc2lvbiggZXZlbnQgKSB7XG5cdFx0dmFyICRmb3JtICAgID0gJCggdGhpcyApO1xuXHRcdHZhciAkc3VibWl0ICA9ICRmb3JtLmZpbmQoIFwiW3R5cGU9J3N1Ym1pdCddOmZvY3VzXCIgKTtcblx0XHR2YXIgZm9ybURhdGEgPSAkZm9ybS5zZXJpYWxpemUoKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKCBcIi53cmFwID4gLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRpZiAoICEgJHN1Ym1pdC5sZW5ndGggKSB7XG5cdFx0XHQkc3VibWl0ID0gJCggXCIud3BzZW90YWIuYWN0aXZlIFt0eXBlPSdzdWJtaXQnXVwiICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAkc3VibWl0LmF0dHIoIFwibmFtZVwiICkgPT09IFwiYWN0aW9uXCIgKSB7XG5cdFx0XHRmb3JtRGF0YSA9IGZvcm1EYXRhLnJlcGxhY2UoIC9hY3Rpb249KFthLXpBLVowLTlfXSspLywgXCJhY3Rpb249XCIgKyAkc3VibWl0LnZhbCgpICk7XG5cdFx0fVxuXG5cdFx0JC5hamF4KCB7XG5cdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdHVybDogYWpheHVybCxcblx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdH0gKVxuXHRcdFx0LmRvbmUoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWlsKCBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHR2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VKU09OO1xuXG5cdFx0XHRcdGlmICggISByZXNwb25zZSB8fCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJGZvcm0gPSAkKCBcIiN3cHNlby1jb25mXCIgKTtcblxuXHRcdGlmICggISAkZm9ybS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGZvcm0ub24oIFwic3VibWl0XCIsIGhhbmRsZUFKQVhTdWJtaXNzaW9uICk7XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
