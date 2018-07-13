(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQTs7Ozs7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHFCQUFULENBQWdDLGNBQWhDLEVBQWlEO0FBQ2hELE1BQUksV0FBVyxFQUFHLFlBQUgsQ0FBZjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFLLENBQUUsZUFBZSxNQUF0QixFQUErQjtBQUM5QjtBQUNBOztBQUVELFlBQVUsZUFBZSxHQUFmLENBQW9CLFVBQVUsYUFBVixFQUEwQjtBQUN2RCxVQUFPLGlCQUFpQixjQUFjLElBQS9CLEdBQXNDLGNBQXRDLEdBQXVELGNBQWMsT0FBckUsR0FBK0UsWUFBdEY7QUFDQSxHQUZTLENBQVY7O0FBSUEsV0FBUyxLQUFULENBQWdCLFFBQVEsSUFBUixDQUFjLEVBQWQsQ0FBaEI7O0FBRUEsV0FBUyw0QkFBNEIsWUFBckM7QUFDQSxNQUFLLGVBQWdCLENBQWhCLEVBQW9CLElBQXBCLEtBQTZCLFNBQWxDLEVBQThDO0FBQzdDLFlBQVMsNEJBQTRCLGNBQXJDO0FBQ0E7O0FBRUQsMkJBQVcsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLGVBQWdCLENBQWhCLEVBQW9CLE9BQTFDLENBQVgsRUFBZ0UsV0FBaEU7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBdUM7QUFDdEMsTUFBSSxRQUFXLEVBQUcsSUFBSCxDQUFmO0FBQ0EsTUFBSSxVQUFXLE1BQU0sSUFBTixDQUFZLHVCQUFaLENBQWY7QUFDQSxNQUFJLFdBQVcsTUFBTSxTQUFOLEVBQWY7QUFDQSxNQUFJLE1BQUo7O0FBRUEsUUFBTSxjQUFOOztBQUVBLElBQUcsaUJBQUgsRUFBdUIsTUFBdkI7O0FBRUEsV0FBUyxNQUFNLElBQU4sQ0FBWSxzQkFBWixFQUFxQyxHQUFyQyxFQUFUO0FBQ0EsTUFBSyxRQUFRLElBQVIsQ0FBYyxNQUFkLE1BQTJCLFFBQWhDLEVBQTJDO0FBQzFDLFlBQVMsUUFBUSxHQUFSLEVBQVQ7QUFDQTs7QUFFRCxhQUFXLFNBQVMsT0FBVCxDQUFrQix3QkFBbEIsRUFBNEMsWUFBWSxNQUF4RCxDQUFYOztBQUVBLElBQUUsSUFBRixDQUFRO0FBQ1AsU0FBTSxNQURDO0FBRVAsUUFBSyxPQUZFO0FBR1AsU0FBTSxRQUhDO0FBSVAsWUFBUyxpQkFBVSxRQUFWLEVBQXFCO0FBQzdCLFFBQUssQ0FBRSxTQUFTLElBQWhCLEVBQXVCO0FBQ3RCO0FBQ0E7O0FBRUQsMEJBQXVCLFNBQVMsSUFBaEM7QUFDQSxJQVZNO0FBV1AsVUFBTyxlQUFVLEdBQVYsRUFBZ0I7QUFDdEIsUUFBSSxXQUFXLElBQUksWUFBbkI7O0FBRUEsUUFBSyxDQUFFLFNBQVMsSUFBaEIsRUFBdUI7QUFDdEI7QUFDQTs7QUFFRCwwQkFBdUIsU0FBUyxJQUFoQztBQUNBO0FBbkJNLEdBQVI7O0FBc0JBLFNBQU8sS0FBUDtBQUNBOztBQUVELEdBQUcsUUFBSCxFQUFjLEtBQWQsQ0FBcUIsWUFBVztBQUMvQixNQUFJLFFBQVEsRUFBRyxhQUFILENBQVo7O0FBRUEsTUFBSyxDQUFFLE1BQU0sTUFBYixFQUFzQjtBQUNyQjtBQUNBOztBQUVELFFBQU0sRUFBTixDQUFVLFFBQVYsRUFBb0Isb0JBQXBCO0FBQ0EsRUFSRDtBQVNBLENBM0ZDLEVBMkZDLE1BM0ZELENBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWwgd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLCBhamF4dXJsICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERpc3BsYXlzIGdpdmVuIHNldHRpbmdzIGVycm9ycy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzRXJyb3JzIFRoZSBsaXN0IG9mIHNldHRpbmdzIGVycm9yIG9iamVjdHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGxheVNldHRpbmdzRXJyb3JzKCBzZXR0aW5nc0Vycm9ycyApIHtcblx0XHR2YXIgJGhlYWRpbmcgPSAkKCBcIi53cmFwID4gaDFcIiApO1xuXHRcdHZhciBub3RpY2VzO1xuXHRcdHZhciBwcmVmaXg7XG5cblx0XHRpZiAoICEgc2V0dGluZ3NFcnJvcnMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5vdGljZXMgPSBzZXR0aW5nc0Vycm9ycy5tYXAoIGZ1bmN0aW9uKCBzZXR0aW5nc0Vycm9yICkge1xuXHRcdFx0cmV0dXJuIFwiPGRpdiBjbGFzcz0nXCIgKyBzZXR0aW5nc0Vycm9yLnR5cGUgKyBcIiBub3RpY2UnPjxwPlwiICsgc2V0dGluZ3NFcnJvci5tZXNzYWdlICsgXCI8L3A+PC9kaXY+XCI7XG5cdFx0fSApO1xuXG5cdFx0JGhlYWRpbmcuYWZ0ZXIoIG5vdGljZXMuam9pbiggXCJcIiApICk7XG5cblx0XHRwcmVmaXggPSB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uZXJyb3JfcHJlZml4O1xuXHRcdGlmICggc2V0dGluZ3NFcnJvcnNbIDAgXS50eXBlID09PSBcInVwZGF0ZWRcIiApIHtcblx0XHRcdHByZWZpeCA9IHdwc2VvTmV0d29ya0FkbWluR2xvYmFsTDEwbi5zdWNjZXNzX3ByZWZpeDtcblx0XHR9XG5cblx0XHRhMTF5U3BlYWsoIHByZWZpeC5yZXBsYWNlKCBcIiVzXCIsIHNldHRpbmdzRXJyb3JzWyAwIF0ubWVzc2FnZSApLCBcImFzc2VydGl2ZVwiICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhIGZvcm0gc3VibWlzc2lvbiB3aXRoIEFKQVguXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBzdWJtaXNzaW9uIGV2ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZUFKQVhTdWJtaXNzaW9uKCBldmVudCApIHtcblx0XHR2YXIgJGZvcm0gICAgPSAkKCB0aGlzICk7XG5cdFx0dmFyICRzdWJtaXQgID0gJGZvcm0uZmluZCggXCJbdHlwZT0nc3VibWl0J106Zm9jdXNcIiApO1xuXHRcdHZhciBmb3JtRGF0YSA9ICRmb3JtLnNlcmlhbGl6ZSgpO1xuXHRcdHZhciBhY3Rpb247XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0JCggXCIud3JhcCA+IC5ub3RpY2VcIiApLnJlbW92ZSgpO1xuXG5cdFx0YWN0aW9uID0gJGZvcm0uZmluZCggXCJpbnB1dFtuYW1lPSdhY3Rpb24nXVwiICkudmFsKCk7XG5cdFx0aWYgKCAkc3VibWl0LmF0dHIoIFwibmFtZVwiICkgPT09IFwiYWN0aW9uXCIgKSB7XG5cdFx0XHRhY3Rpb24gPSAkc3VibWl0LnZhbCgpO1xuXHRcdH1cblxuXHRcdGZvcm1EYXRhID0gZm9ybURhdGEucmVwbGFjZSggL2FjdGlvbj0oW2EtekEtWjAtOV9dKykvLCBcImFjdGlvbj1cIiArIGFjdGlvbiApO1xuXG5cdFx0JC5hamF4KCB7XG5cdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdHVybDogYWpheHVybCxcblx0XHRcdGRhdGE6IGZvcm1EYXRhLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRpZiAoICEgcmVzcG9uc2UuZGF0YSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaXNwbGF5U2V0dGluZ3NFcnJvcnMoIHJlc3BvbnNlLmRhdGEgKTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlSlNPTjtcblxuXHRcdFx0XHRpZiAoICEgcmVzcG9uc2UuZGF0YSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaXNwbGF5U2V0dGluZ3NFcnJvcnMoIHJlc3BvbnNlLmRhdGEgKTtcblx0XHRcdH0sXG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRmb3JtID0gJCggXCIjd3BzZW8tY29uZlwiICk7XG5cblx0XHRpZiAoICEgJGZvcm0ubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCRmb3JtLm9uKCBcInN1Ym1pdFwiLCBoYW5kbGVBSkFYU3VibWlzc2lvbiApO1xuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
