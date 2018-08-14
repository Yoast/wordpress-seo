yoastWebpackJsonp([20],{

/***/ 1053:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 1941:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _a11ySpeak = __webpack_require__(1053);

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

/***/ })

},[1941]);