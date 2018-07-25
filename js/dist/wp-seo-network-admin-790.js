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
		var action;

		event.preventDefault();

		$(".wrap > .notice").remove();

		action = $form.find("input[name='action']").val();
		if ($submit.attr("name") === "action") {
			action = $submit.val();
		}

		formData = formData.replace(/action=([a-zA-Z0-9_]+)/, "action=" + action);

		$.ajax({
			type: "POST",
			url: ajaxurl,
			data: formData,
			success: function success(response) {
				if (!response.data) {
					return;
				}

				displaySettingsErrors(response.data);
			},
			error: function error(xhr) {
				var response = xhr.responseJSON;

				if (!response.data) {
					return;
				}

				displaySettingsErrors(response.data);
			}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQTs7Ozs7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHFCQUFULENBQWdDLGNBQWhDLEVBQWlEO0FBQ2hELE1BQUksV0FBVyxFQUFHLFlBQUgsQ0FBZjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFLLENBQUUsZUFBZSxNQUF0QixFQUErQjtBQUM5QjtBQUNBOztBQUVELFlBQVUsZUFBZSxHQUFmLENBQW9CLFVBQVUsYUFBVixFQUEwQjtBQUN2RCxVQUFPLGlCQUFpQixjQUFjLElBQS9CLEdBQXNDLGNBQXRDLEdBQXVELGNBQWMsT0FBckUsR0FBK0UsWUFBdEY7QUFDQSxHQUZTLENBQVY7O0FBSUEsV0FBUyxLQUFULENBQWdCLFFBQVEsSUFBUixDQUFjLEVBQWQsQ0FBaEI7O0FBRUEsV0FBUyw0QkFBNEIsWUFBckM7QUFDQSxNQUFLLGVBQWdCLENBQWhCLEVBQW9CLElBQXBCLEtBQTZCLFNBQWxDLEVBQThDO0FBQzdDLFlBQVMsNEJBQTRCLGNBQXJDO0FBQ0E7O0FBRUQsMkJBQVcsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLGVBQWdCLENBQWhCLEVBQW9CLE9BQTFDLENBQVgsRUFBZ0UsV0FBaEU7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBdUM7QUFDdEMsTUFBSSxRQUFXLEVBQUcsSUFBSCxDQUFmO0FBQ0EsTUFBSSxVQUFXLE1BQU0sSUFBTixDQUFZLHVCQUFaLENBQWY7QUFDQSxNQUFJLFdBQVcsTUFBTSxTQUFOLEVBQWY7QUFDQSxNQUFJLE1BQUo7O0FBRUEsUUFBTSxjQUFOOztBQUVBLElBQUcsaUJBQUgsRUFBdUIsTUFBdkI7O0FBRUEsV0FBUyxNQUFNLElBQU4sQ0FBWSxzQkFBWixFQUFxQyxHQUFyQyxFQUFUO0FBQ0EsTUFBSyxRQUFRLElBQVIsQ0FBYyxNQUFkLE1BQTJCLFFBQWhDLEVBQTJDO0FBQzFDLFlBQVMsUUFBUSxHQUFSLEVBQVQ7QUFDQTs7QUFFRCxhQUFXLFNBQVMsT0FBVCxDQUFrQix3QkFBbEIsRUFBNEMsWUFBWSxNQUF4RCxDQUFYOztBQUVBLElBQUUsSUFBRixDQUFRO0FBQ1AsU0FBTSxNQURDO0FBRVAsUUFBSyxPQUZFO0FBR1AsU0FBTSxRQUhDO0FBSVAsWUFBUyxpQkFBVSxRQUFWLEVBQXFCO0FBQzdCLFFBQUssQ0FBRSxTQUFTLElBQWhCLEVBQXVCO0FBQ3RCO0FBQ0E7O0FBRUQsMEJBQXVCLFNBQVMsSUFBaEM7QUFDQSxJQVZNO0FBV1AsVUFBTyxlQUFVLEdBQVYsRUFBZ0I7QUFDdEIsUUFBSSxXQUFXLElBQUksWUFBbkI7O0FBRUEsUUFBSyxDQUFFLFNBQVMsSUFBaEIsRUFBdUI7QUFDdEI7QUFDQTs7QUFFRCwwQkFBdUIsU0FBUyxJQUFoQztBQUNBO0FBbkJNLEdBQVI7O0FBc0JBLFNBQU8sS0FBUDtBQUNBOztBQUVELEdBQUcsUUFBSCxFQUFjLEtBQWQsQ0FBcUIsWUFBVztBQUMvQixNQUFJLFFBQVEsRUFBRyxhQUFILENBQVo7O0FBRUEsTUFBSyxDQUFFLE1BQU0sTUFBYixFQUFzQjtBQUNyQjtBQUNBOztBQUVELFFBQU0sRUFBTixDQUFVLFFBQVYsRUFBb0Isb0JBQXBCO0FBQ0EsRUFSRDtBQVNBLENBM0ZDLEVBMkZDLE1BM0ZELENBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwc2VvTmV0d29ya0FkbWluR2xvYmFsTDEwbiwgYWpheHVybCAqL1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBnaXZlbiBzZXR0aW5ncyBlcnJvcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc0Vycm9ycyBUaGUgbGlzdCBvZiBzZXR0aW5ncyBlcnJvciBvYmplY3RzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlTZXR0aW5nc0Vycm9ycyggc2V0dGluZ3NFcnJvcnMgKSB7XG5cdFx0dmFyICRoZWFkaW5nID0gJCggXCIud3JhcCA+IGgxXCIgKTtcblx0XHR2YXIgbm90aWNlcztcblx0XHR2YXIgcHJlZml4O1xuXG5cdFx0aWYgKCAhIHNldHRpbmdzRXJyb3JzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub3RpY2VzID0gc2V0dGluZ3NFcnJvcnMubWFwKCBmdW5jdGlvbiggc2V0dGluZ3NFcnJvciApIHtcblx0XHRcdHJldHVybiBcIjxkaXYgY2xhc3M9J1wiICsgc2V0dGluZ3NFcnJvci50eXBlICsgXCIgbm90aWNlJz48cD5cIiArIHNldHRpbmdzRXJyb3IubWVzc2FnZSArIFwiPC9wPjwvZGl2PlwiO1xuXHRcdH0gKTtcblxuXHRcdCRoZWFkaW5nLmFmdGVyKCBub3RpY2VzLmpvaW4oIFwiXCIgKSApO1xuXG5cdFx0cHJlZml4ID0gd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLmVycm9yX3ByZWZpeDtcblx0XHRpZiAoIHNldHRpbmdzRXJyb3JzWyAwIF0udHlwZSA9PT0gXCJ1cGRhdGVkXCIgKSB7XG5cdFx0XHRwcmVmaXggPSB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uc3VjY2Vzc19wcmVmaXg7XG5cdFx0fVxuXG5cdFx0YTExeVNwZWFrKCBwcmVmaXgucmVwbGFjZSggXCIlc1wiLCBzZXR0aW5nc0Vycm9yc1sgMCBdLm1lc3NhZ2UgKSwgXCJhc3NlcnRpdmVcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgYSBmb3JtIHN1Ym1pc3Npb24gd2l0aCBBSkFYLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgc3VibWlzc2lvbiBldmVudC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVBSkFYU3VibWlzc2lvbiggZXZlbnQgKSB7XG5cdFx0dmFyICRmb3JtICAgID0gJCggdGhpcyApO1xuXHRcdHZhciAkc3VibWl0ICA9ICRmb3JtLmZpbmQoIFwiW3R5cGU9J3N1Ym1pdCddOmZvY3VzXCIgKTtcblx0XHR2YXIgZm9ybURhdGEgPSAkZm9ybS5zZXJpYWxpemUoKTtcblx0XHR2YXIgYWN0aW9uO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoIFwiLndyYXAgPiAubm90aWNlXCIgKS5yZW1vdmUoKTtcblxuXHRcdGFjdGlvbiA9ICRmb3JtLmZpbmQoIFwiaW5wdXRbbmFtZT0nYWN0aW9uJ11cIiApLnZhbCgpO1xuXHRcdGlmICggJHN1Ym1pdC5hdHRyKCBcIm5hbWVcIiApID09PSBcImFjdGlvblwiICkge1xuXHRcdFx0YWN0aW9uID0gJHN1Ym1pdC52YWwoKTtcblx0XHR9XG5cblx0XHRmb3JtRGF0YSA9IGZvcm1EYXRhLnJlcGxhY2UoIC9hY3Rpb249KFthLXpBLVowLTlfXSspLywgXCJhY3Rpb249XCIgKyBhY3Rpb24gKTtcblxuXHRcdCQuYWpheCgge1xuXHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0XHRkYXRhOiBmb3JtRGF0YSxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZUpTT047XG5cblx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlLmRhdGEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlzcGxheVNldHRpbmdzRXJyb3JzKCByZXNwb25zZS5kYXRhICk7XG5cdFx0XHR9LFxuXHRcdH0gKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkZm9ybSA9ICQoIFwiI3dwc2VvLWNvbmZcIiApO1xuXG5cdFx0aWYgKCAhICRmb3JtLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZm9ybS5vbiggXCJzdWJtaXRcIiwgaGFuZGxlQUpBWFN1Ym1pc3Npb24gKTtcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuIl19
