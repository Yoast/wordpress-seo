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
  * @param {object[]} settingsErrors The list of settings error objects.
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

		prefix = settingsErrors[0].type === "updated" ? wpseoNetworkAdminGlobalL10n.success_prefix : wpseoNetworkAdminGlobalL10n.error_prefix;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMiLCJub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQTs7Ozs7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHFCQUFULENBQWdDLGNBQWhDLEVBQWlEO0FBQ2hELE1BQUksV0FBVyxFQUFHLFlBQUgsQ0FBZjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFLLENBQUUsZUFBZSxNQUF0QixFQUErQjtBQUM5QjtBQUNBOztBQUVELFlBQVUsZUFBZSxHQUFmLENBQW9CLFVBQVUsYUFBVixFQUEwQjtBQUN2RCxVQUFPLGlCQUFpQixjQUFjLElBQS9CLEdBQXNDLGNBQXRDLEdBQXVELGNBQWMsT0FBckUsR0FBK0UsWUFBdEY7QUFDQSxHQUZTLENBQVY7O0FBSUEsV0FBUyxLQUFULENBQWdCLFFBQVEsSUFBUixDQUFjLEVBQWQsQ0FBaEI7O0FBRUEsV0FBUyxlQUFnQixDQUFoQixFQUFvQixJQUFwQixLQUE2QixTQUE3QixHQUF5Qyw0QkFBNEIsY0FBckUsR0FBc0YsNEJBQTRCLFlBQTNIO0FBQ0EsMkJBQVcsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLGVBQWdCLENBQWhCLEVBQW9CLE9BQTFDLENBQVgsRUFBZ0UsV0FBaEU7QUFDQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsb0JBQVQsQ0FBK0IsS0FBL0IsRUFBdUM7QUFDdEMsTUFBSSxRQUFXLEVBQUcsSUFBSCxDQUFmO0FBQ0EsTUFBSSxVQUFXLE1BQU0sSUFBTixDQUFZLHVCQUFaLENBQWY7QUFDQSxNQUFJLFdBQVcsTUFBTSxTQUFOLEVBQWY7QUFDQSxNQUFJLE1BQUo7O0FBRUEsUUFBTSxjQUFOOztBQUVBLElBQUcsaUJBQUgsRUFBdUIsTUFBdkI7O0FBRUEsV0FBUyxNQUFNLElBQU4sQ0FBWSxzQkFBWixFQUFxQyxHQUFyQyxFQUFUO0FBQ0EsTUFBSyxRQUFRLElBQVIsQ0FBYyxNQUFkLE1BQTJCLFFBQWhDLEVBQTJDO0FBQzFDLFlBQVMsUUFBUSxHQUFSLEVBQVQ7QUFDQTs7QUFFRCxhQUFXLFNBQVMsT0FBVCxDQUFrQix3QkFBbEIsRUFBNEMsWUFBWSxNQUF4RCxDQUFYOztBQUVBLElBQUUsSUFBRixDQUFRO0FBQ1AsU0FBTSxNQURDO0FBRVAsUUFBSyxPQUZFO0FBR1AsU0FBTSxRQUhDO0FBSVAsWUFBUyxpQkFBVSxRQUFWLEVBQXFCO0FBQzdCLFFBQUssQ0FBRSxTQUFTLElBQWhCLEVBQXVCO0FBQ3RCO0FBQ0E7O0FBRUQsMEJBQXVCLFNBQVMsSUFBaEM7QUFDQSxJQVZNO0FBV1AsVUFBTyxlQUFVLEdBQVYsRUFBZ0I7QUFDdEIsUUFBSSxXQUFXLElBQUksWUFBbkI7O0FBRUEsUUFBSyxDQUFFLFNBQVMsSUFBaEIsRUFBdUI7QUFDdEI7QUFDQTs7QUFFRCwwQkFBdUIsU0FBUyxJQUFoQztBQUNBO0FBbkJNLEdBQVI7O0FBc0JBLFNBQU8sS0FBUDtBQUNBOztBQUVELEdBQUcsUUFBSCxFQUFjLEtBQWQsQ0FBcUIsWUFBVztBQUMvQixNQUFJLFFBQVEsRUFBRyxhQUFILENBQVo7O0FBRUEsTUFBSyxDQUFFLE1BQU0sTUFBYixFQUFzQjtBQUNyQjtBQUNBOztBQUVELFFBQU0sRUFBTixDQUFVLFFBQVYsRUFBb0Isb0JBQXBCO0FBQ0EsRUFSRDtBQVNBLENBdkZDLEVBdUZDLE1BdkZELENBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWwgd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLCBhamF4dXJsICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERpc3BsYXlzIGdpdmVuIHNldHRpbmdzIGVycm9ycy5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3RbXX0gc2V0dGluZ3NFcnJvcnMgVGhlIGxpc3Qgb2Ygc2V0dGluZ3MgZXJyb3Igb2JqZWN0cy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNwbGF5U2V0dGluZ3NFcnJvcnMoIHNldHRpbmdzRXJyb3JzICkge1xuXHRcdHZhciAkaGVhZGluZyA9ICQoIFwiLndyYXAgPiBoMVwiICk7XG5cdFx0dmFyIG5vdGljZXM7XG5cdFx0dmFyIHByZWZpeDtcblxuXHRcdGlmICggISBzZXR0aW5nc0Vycm9ycy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bm90aWNlcyA9IHNldHRpbmdzRXJyb3JzLm1hcCggZnVuY3Rpb24oIHNldHRpbmdzRXJyb3IgKSB7XG5cdFx0XHRyZXR1cm4gXCI8ZGl2IGNsYXNzPSdcIiArIHNldHRpbmdzRXJyb3IudHlwZSArIFwiIG5vdGljZSc+PHA+XCIgKyBzZXR0aW5nc0Vycm9yLm1lc3NhZ2UgKyBcIjwvcD48L2Rpdj5cIjtcblx0XHR9ICk7XG5cblx0XHQkaGVhZGluZy5hZnRlciggbm90aWNlcy5qb2luKCBcIlwiICkgKTtcblxuXHRcdHByZWZpeCA9IHNldHRpbmdzRXJyb3JzWyAwIF0udHlwZSA9PT0gXCJ1cGRhdGVkXCIgPyB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uc3VjY2Vzc19wcmVmaXggOiB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uZXJyb3JfcHJlZml4O1xuXHRcdGExMXlTcGVhayggcHJlZml4LnJlcGxhY2UoIFwiJXNcIiwgc2V0dGluZ3NFcnJvcnNbIDAgXS5tZXNzYWdlICksIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGEgZm9ybSBzdWJtaXNzaW9uIHdpdGggQUpBWC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIHN1Ym1pc3Npb24gZXZlbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGFuZGxlQUpBWFN1Ym1pc3Npb24oIGV2ZW50ICkge1xuXHRcdHZhciAkZm9ybSAgICA9ICQoIHRoaXMgKTtcblx0XHR2YXIgJHN1Ym1pdCAgPSAkZm9ybS5maW5kKCBcIlt0eXBlPSdzdWJtaXQnXTpmb2N1c1wiICk7XG5cdFx0dmFyIGZvcm1EYXRhID0gJGZvcm0uc2VyaWFsaXplKCk7XG5cdFx0dmFyIGFjdGlvbjtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQkKCBcIi53cmFwID4gLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRhY3Rpb24gPSAkZm9ybS5maW5kKCBcImlucHV0W25hbWU9J2FjdGlvbiddXCIgKS52YWwoKTtcblx0XHRpZiAoICRzdWJtaXQuYXR0ciggXCJuYW1lXCIgKSA9PT0gXCJhY3Rpb25cIiApIHtcblx0XHRcdGFjdGlvbiA9ICRzdWJtaXQudmFsKCk7XG5cdFx0fVxuXG5cdFx0Zm9ybURhdGEgPSBmb3JtRGF0YS5yZXBsYWNlKCAvYWN0aW9uPShbYS16QS1aMC05X10rKS8sIFwiYWN0aW9uPVwiICsgYWN0aW9uICk7XG5cblx0XHQkLmFqYXgoIHtcblx0XHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0dXJsOiBhamF4dXJsLFxuXHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdGlmICggISByZXNwb25zZS5kYXRhICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpc3BsYXlTZXR0aW5nc0Vycm9ycyggcmVzcG9uc2UuZGF0YSApO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHR2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VKU09OO1xuXG5cdFx0XHRcdGlmICggISByZXNwb25zZS5kYXRhICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpc3BsYXlTZXR0aW5nc0Vycm9ycyggcmVzcG9uc2UuZGF0YSApO1xuXHRcdFx0fSxcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHR2YXIgJGZvcm0gPSAkKCBcIiN3cHNlby1jb25mXCIgKTtcblxuXHRcdGlmICggISAkZm9ybS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGZvcm0ub24oIFwic3VibWl0XCIsIGhhbmRsZUFKQVhTdWJtaXNzaW9uICk7XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
