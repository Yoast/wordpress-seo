(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
	"use strict";

	/**
  * Detects the wrong use of variables in title and description templates
  *
  * @param {element} e The element to verify.
  *
  * @returns {void}
  */

	function wpseoDetectWrongVariables(e) {
		var warn = false;
		var errorId = "";
		var wrongVariables = [];
		var authorVariables = ["userid", "name", "user_description"];
		var dateVariables = ["date"];
		var postVariables = ["title", "parent_title", "excerpt", "excerpt_only", "caption", "focuskw", "pt_single", "pt_plural", "modified", "id"];
		var specialVariables = ["term404", "searchphrase"];
		var taxonomyVariables = ["term_title", "term_description"];
		var taxonomyPostVariables = ["category", "category_description", "tag", "tag_description"];
		if (e.hasClass("posttype-template")) {
			wrongVariables = wrongVariables.concat(specialVariables, taxonomyVariables);
		} else if (e.hasClass("homepage-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("taxonomy-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, specialVariables);
		} else if (e.hasClass("author-template")) {
			wrongVariables = wrongVariables.concat(postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("date-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables);
		} else if (e.hasClass("search-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, ["term404"]);
		} else if (e.hasClass("error404-template")) {
			wrongVariables = wrongVariables.concat(authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, ["searchphrase"]);
		}
		jQuery.each(wrongVariables, function (index, variable) {
			errorId = e.attr("id") + "-" + variable + "-warning";
			if (e.val().search("%%" + variable + "%%") !== -1) {
				e.addClass("wpseo-variable-warning-element");
				var msg = wpseoAdminGlobalL10n.variable_warning.replace("%s", "%%" + variable + "%%");
				if (jQuery("#" + errorId).length) {
					jQuery("#" + errorId).html(msg);
				} else {
					e.after(' <div id="' + errorId + '" class="wpseo-variable-warning">' + msg + "</div>");
				}

				(0, _a11ySpeak2.default)(wpseoAdminGlobalL10n.variable_warning.replace("%s", variable), "assertive");

				warn = true;
			} else {
				if (jQuery("#" + errorId).length) {
					jQuery("#" + errorId).remove();
				}
			}
		});
		if (warn === false) {
			e.removeClass("wpseo-variable-warning-element");
		}
	}

	/**
  * Sets a specific WP option
  *
  * @param {string} option The option to update.
  * @param {string} newval The new value for the option.
  * @param {string} hide   The ID of the element to hide on success.
  * @param {string} nonce  The nonce for the action.
  *
  * @returns {void}
  */
	function setWPOption(option, newval, hide, nonce) {
		jQuery.post(ajaxurl, {
			action: "wpseo_set_option",
			option: option,
			newval: newval,
			_wpnonce: nonce
		}, function (data) {
			if (data) {
				jQuery("#" + hide).hide();
			}
		});
	}

	/**
  * Copies the meta description for the homepage.
  *
  * @returns {void}
  */
	function wpseoCopyHomeMeta() {
		jQuery("#copy-home-meta-description").on("click", function () {
			jQuery("#og_frontpage_desc").val(jQuery("#meta_description").val());
		});
	}

	/**
  * Makes sure we store the action hash so we can return to the right hash
  *
  * @returns {void}
  */
	function wpseoSetTabHash() {
		var conf = jQuery("#wpseo-conf");
		if (conf.length) {
			var currentUrl = conf.attr("action").split("#")[0];
			conf.attr("action", currentUrl + window.location.hash);
		}
	}

	/**
  * When the hash changes, get the base url from the action and then add the current hash
  */
	jQuery(window).on("hashchange", wpseoSetTabHash);

	/**
  * Adds select2 for selected fields.
  *
  * @returns {void}
  */
	function initSelect2() {
		var select2Width = "400px";

		// Select2 for General settings: your info: company or person. Width is the same as the width for the other fields on this page.
		jQuery("#company_or_person").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for Twitter card meta data in Settings
		jQuery("#twitter_card_type").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery("#breadcrumbs select").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});

		// Select2 for profile in Search Console
		jQuery("#profile").select2({
			width: select2Width,
			language: wpseoSelect2Locale
		});
	}

	/**
  * Set the initial active tab in the settings pages.
  *
  * @returns {void}
  */
	function setInitialActiveTab() {
		var activeTabId = window.location.hash.replace("#top#", "");
		/* In some cases, the second # gets replace by %23, which makes the tab
   * switching not work unless we do this. */
		if (activeTabId.search("#top") !== -1) {
			activeTabId = window.location.hash.replace("#top%23", "");
		}
		/*
   * WordPress uses fragment identifiers for its own in-page links, e.g.
   * `#wpbody-content` and other plugins may do that as well. Also, facebook
   * adds a `#_=_` see PR 506. In these cases and when it's empty, default
   * to the first tab.
   */
		if ("" === activeTabId || "#" === activeTabId.charAt(0)) {
			/*
    * Reminder: jQuery attr() gets the attribute value for only the first
    * element in the matched set so this will always be the first tab id.
    */
			activeTabId = jQuery(".wpseotab").attr("id");
		}

		jQuery("#" + activeTabId).addClass("active");
		jQuery("#" + activeTabId + "-tab").addClass("nav-tab-active").click();
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	// eslint-disable-next-line
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery(document).ready(function () {
		/**
   * When the hash changes, get the base url from the action and then add the current hash.
   */
		wpseoSetTabHash();

		// Toggle the Author archives section.
		jQuery("#disable-author input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#author-archives-titles-metas-content").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Date archives section.
		jQuery("#disable-date input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#date-archives-titles-metas-content").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Media section.
		jQuery("#disable-attachment input[type='radio']").change(function () {
			// The value on is disabled, off is enabled.
			if (jQuery(this).is(":checked")) {
				jQuery("#media_settings").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Toggle the Format-based archives section.
		jQuery("#disable-post_format").change(function () {
			jQuery("#post_format-titles-metas").toggle(jQuery(this).is(":not(:checked)"));
		}).change();

		// Toggle the Breadcrumbs section.
		jQuery("#breadcrumbs-enable").change(function () {
			jQuery("#breadcrumbsinfo").toggle(jQuery(this).is(":checked"));
		}).change();

		// Handle the settings pages tabs.
		jQuery("#wpseo-tabs").find("a").click(function () {
			jQuery("#wpseo-tabs").find("a").removeClass("nav-tab-active");
			jQuery(".wpseotab").removeClass("active");

			var id = jQuery(this).attr("id").replace("-tab", "");
			var activeTab = jQuery("#" + id);
			activeTab.addClass("active");
			jQuery(this).addClass("nav-tab-active");
			if (activeTab.hasClass("nosave")) {
				jQuery("#submit").hide();
			} else {
				jQuery("#submit").show();
			}
		});

		// Handle the Company or Person select.
		jQuery("#company_or_person").change(function () {
			var companyOrPerson = jQuery(this).val();
			if ("company" === companyOrPerson) {
				jQuery("#knowledge-graph-company").show();
				jQuery("#knowledge-graph-person").hide();
			} else if ("person" === companyOrPerson) {
				jQuery("#knowledge-graph-company").hide();
				jQuery("#knowledge-graph-person").show();
			} else {
				jQuery("#knowledge-graph-company").hide();
				jQuery("#knowledge-graph-person").hide();
			}
		}).change();

		// Check correct variables usage in title and description templates.
		jQuery(".template").on("input", function () {
			wpseoDetectWrongVariables(jQuery(this));
		});

		// Prevent form submission when pressing Enter on the switch-toggles.
		jQuery(".switch-yoast-seo input").on("keydown", function (event) {
			if ("keydown" === event.type && 13 === event.which) {
				event.preventDefault();
			}
		});

		// Allow collapsing of the content types sections.
		jQuery(".toggleable-container-trigger").on("click", function (event) {
			event.preventDefault();

			var target = jQuery(event.target);

			target.find("span").toggleClass("dashicons-arrow-up-alt2 dashicons-arrow-down-alt2");
			target.parent().siblings(".toggleable-container").toggleClass("toggleable-container-hidden");
		});

		wpseoCopyHomeMeta();
		setInitialActiveTab();
		initSelect2();
	});
})(); /* global wpseoAdminGlobalL10n, ajaxurl, wpseoSelect2Locale */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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QUFFQSxPQUFJLFNBQVMsT0FBUSxNQUFNLE1BQWQsQ0FBYjs7QUFFQSxVQUFPLElBQVAsQ0FBYSxNQUFiLEVBQXNCLFdBQXRCLENBQW1DLG1EQUFuQztBQUNBLFVBQU8sTUFBUCxHQUFnQixRQUFoQixDQUEwQix1QkFBMUIsRUFBb0QsV0FBcEQsQ0FBaUUsNkJBQWpFO0FBQ0EsR0FQRDs7QUFTQTtBQUNBO0FBQ0E7QUFDQSxFQWxHRDtBQW1HQSxDQWxTQyxHQUFGLEMsQ0FKQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cHNlb0FkbWluR2xvYmFsTDEwbiwgYWpheHVybCwgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERldGVjdHMgdGhlIHdyb25nIHVzZSBvZiB2YXJpYWJsZXMgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGUgVGhlIGVsZW1lbnQgdG8gdmVyaWZ5LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMoIGUgKSB7XG5cdFx0dmFyIHdhcm4gPSBmYWxzZTtcblx0XHR2YXIgZXJyb3JJZCA9IFwiXCI7XG5cdFx0dmFyIHdyb25nVmFyaWFibGVzID0gW107XG5cdFx0dmFyIGF1dGhvclZhcmlhYmxlcyA9IFsgXCJ1c2VyaWRcIiwgXCJuYW1lXCIsIFwidXNlcl9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIGRhdGVWYXJpYWJsZXMgPSBbIFwiZGF0ZVwiIF07XG5cdFx0dmFyIHBvc3RWYXJpYWJsZXMgPSBbIFwidGl0bGVcIiwgXCJwYXJlbnRfdGl0bGVcIiwgXCJleGNlcnB0XCIsIFwiZXhjZXJwdF9vbmx5XCIsIFwiY2FwdGlvblwiLCBcImZvY3Vza3dcIiwgXCJwdF9zaW5nbGVcIiwgXCJwdF9wbHVyYWxcIiwgXCJtb2RpZmllZFwiLCBcImlkXCIgXTtcblx0XHR2YXIgc3BlY2lhbFZhcmlhYmxlcyA9IFsgXCJ0ZXJtNDA0XCIsIFwic2VhcmNocGhyYXNlXCIgXTtcblx0XHR2YXIgdGF4b25vbXlWYXJpYWJsZXMgPSBbIFwidGVybV90aXRsZVwiLCBcInRlcm1fZGVzY3JpcHRpb25cIiBdO1xuXHRcdHZhciB0YXhvbm9teVBvc3RWYXJpYWJsZXMgPSBbIFwiY2F0ZWdvcnlcIiwgXCJjYXRlZ29yeV9kZXNjcmlwdGlvblwiLCBcInRhZ1wiLCBcInRhZ19kZXNjcmlwdGlvblwiIF07XG5cdFx0aWYgKCBlLmhhc0NsYXNzKCBcInBvc3R0eXBlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJob21lcGFnZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInRheG9ub215LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiYXV0aG9yLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBwb3N0VmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImRhdGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJzZWFyY2gtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInRlcm00MDRcIiBdICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImVycm9yNDA0LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMsIFsgXCJzZWFyY2hwaHJhc2VcIiBdICk7XG5cdFx0fVxuXHRcdGpRdWVyeS5lYWNoKCB3cm9uZ1ZhcmlhYmxlcywgZnVuY3Rpb24oIGluZGV4LCB2YXJpYWJsZSApIHtcblx0XHRcdGVycm9ySWQgPSBlLmF0dHIoIFwiaWRcIiApICsgXCItXCIgKyB2YXJpYWJsZSArIFwiLXdhcm5pbmdcIjtcblx0XHRcdGlmICggZS52YWwoKS5zZWFyY2goIFwiJSVcIiArIHZhcmlhYmxlICsgXCIlJVwiICkgIT09IC0xICkge1xuXHRcdFx0XHRlLmFkZENsYXNzKCBcIndwc2VvLXZhcmlhYmxlLXdhcm5pbmctZWxlbWVudFwiICk7XG5cdFx0XHRcdHZhciBtc2cgPSB3cHNlb0FkbWluR2xvYmFsTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoIFwiJXNcIiwgXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKTtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmh0bWwoIG1zZyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGUuYWZ0ZXIoICcgPGRpdiBpZD1cIicgKyBlcnJvcklkICsgJ1wiIGNsYXNzPVwid3BzZW8tdmFyaWFibGUtd2FybmluZ1wiPicgKyBtc2cgKyBcIjwvZGl2PlwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhMTF5U3BlYWsoIHdwc2VvQWRtaW5HbG9iYWxMMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCB2YXJpYWJsZSApLCBcImFzc2VydGl2ZVwiICk7XG5cblx0XHRcdFx0d2FybiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCB3YXJuID09PSBmYWxzZSApIHtcblx0XHRcdGUucmVtb3ZlQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIHNwZWNpZmljIFdQIG9wdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uIFRoZSBvcHRpb24gdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3dmFsIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBvcHRpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlICAgVGhlIElEIG9mIHRoZSBlbGVtZW50IHRvIGhpZGUgb24gc3VjY2Vzcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBUaGUgbm9uY2UgZm9yIHRoZSBhY3Rpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0V1BPcHRpb24oIG9wdGlvbiwgbmV3dmFsLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9vcHRpb25cIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0bmV3dmFsOiBuZXd2YWwsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmb3IgdGhlIGhvbWVwYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQ29weUhvbWVNZXRhKCkge1xuXHRcdGpRdWVyeSggXCIjY29weS1ob21lLW1ldGEtZGVzY3JpcHRpb25cIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiNvZ19mcm9udHBhZ2VfZGVzY1wiICkudmFsKCBqUXVlcnkoIFwiI21ldGFfZGVzY3JpcHRpb25cIiApLnZhbCgpICk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHN1cmUgd2Ugc3RvcmUgdGhlIGFjdGlvbiBoYXNoIHNvIHdlIGNhbiByZXR1cm4gdG8gdGhlIHJpZ2h0IGhhc2hcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb1NldFRhYkhhc2goKSB7XG5cdFx0dmFyIGNvbmYgPSBqUXVlcnkoIFwiI3dwc2VvLWNvbmZcIiApO1xuXHRcdGlmICggY29uZi5sZW5ndGggKSB7XG5cdFx0XHR2YXIgY3VycmVudFVybCA9IGNvbmYuYXR0ciggXCJhY3Rpb25cIiApLnNwbGl0KCBcIiNcIiApWyAwIF07XG5cdFx0XHRjb25mLmF0dHIoIFwiYWN0aW9uXCIsIGN1cnJlbnRVcmwgKyB3aW5kb3cubG9jYXRpb24uaGFzaCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoXG5cdCAqL1xuXHRqUXVlcnkoIHdpbmRvdyApLm9uKCBcImhhc2hjaGFuZ2VcIiwgd3BzZW9TZXRUYWJIYXNoICk7XG5cblx0LyoqXG5cdCAqIEFkZHMgc2VsZWN0MiBmb3Igc2VsZWN0ZWQgZmllbGRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRTZWxlY3QyKCkge1xuXHRcdHZhciBzZWxlY3QyV2lkdGggPSBcIjQwMHB4XCI7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBHZW5lcmFsIHNldHRpbmdzOiB5b3VyIGluZm86IGNvbXBhbnkgb3IgcGVyc29uLiBXaWR0aCBpcyB0aGUgc2FtZSBhcyB0aGUgd2lkdGggZm9yIHRoZSBvdGhlciBmaWVsZHMgb24gdGhpcyBwYWdlLlxuXHRcdGpRdWVyeSggXCIjY29tcGFueV9vcl9wZXJzb25cIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIFR3aXR0ZXIgY2FyZCBtZXRhIGRhdGEgaW4gU2V0dGluZ3Ncblx0XHRqUXVlcnkoIFwiI3R3aXR0ZXJfY2FyZF90eXBlXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciB0YXhvbm9teSBicmVhZGNydW1icyBpbiBBZHZhbmNlZFxuXHRcdGpRdWVyeSggXCIjYnJlYWRjcnVtYnMgc2VsZWN0XCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBwcm9maWxlIGluIFNlYXJjaCBDb25zb2xlXG5cdFx0alF1ZXJ5KCBcIiNwcm9maWxlXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBpbml0aWFsIGFjdGl2ZSB0YWIgaW4gdGhlIHNldHRpbmdzIHBhZ2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEluaXRpYWxBY3RpdmVUYWIoKSB7XG5cdFx0dmFyIGFjdGl2ZVRhYklkID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggXCIjdG9wI1wiLCBcIlwiICk7XG5cdFx0LyogSW4gc29tZSBjYXNlcywgdGhlIHNlY29uZCAjIGdldHMgcmVwbGFjZSBieSAlMjMsIHdoaWNoIG1ha2VzIHRoZSB0YWJcblx0XHQgKiBzd2l0Y2hpbmcgbm90IHdvcmsgdW5sZXNzIHdlIGRvIHRoaXMuICovXG5cdFx0aWYgKCBhY3RpdmVUYWJJZC5zZWFyY2goIFwiI3RvcFwiICkgIT09IC0xICkge1xuXHRcdFx0YWN0aXZlVGFiSWQgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCBcIiN0b3AlMjNcIiwgXCJcIiApO1xuXHRcdH1cblx0XHQvKlxuXHRcdCAqIFdvcmRQcmVzcyB1c2VzIGZyYWdtZW50IGlkZW50aWZpZXJzIGZvciBpdHMgb3duIGluLXBhZ2UgbGlua3MsIGUuZy5cblx0XHQgKiBgI3dwYm9keS1jb250ZW50YCBhbmQgb3RoZXIgcGx1Z2lucyBtYXkgZG8gdGhhdCBhcyB3ZWxsLiBBbHNvLCBmYWNlYm9va1xuXHRcdCAqIGFkZHMgYSBgI189X2Agc2VlIFBSIDUwNi4gSW4gdGhlc2UgY2FzZXMgYW5kIHdoZW4gaXQncyBlbXB0eSwgZGVmYXVsdFxuXHRcdCAqIHRvIHRoZSBmaXJzdCB0YWIuXG5cdFx0ICovXG5cdFx0aWYgKCBcIlwiID09PSBhY3RpdmVUYWJJZCB8fCBcIiNcIiA9PT0gYWN0aXZlVGFiSWQuY2hhckF0KCAwICkgKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogUmVtaW5kZXI6IGpRdWVyeSBhdHRyKCkgZ2V0cyB0aGUgYXR0cmlidXRlIHZhbHVlIGZvciBvbmx5IHRoZSBmaXJzdFxuXHRcdFx0ICogZWxlbWVudCBpbiB0aGUgbWF0Y2hlZCBzZXQgc28gdGhpcyB3aWxsIGFsd2F5cyBiZSB0aGUgZmlyc3QgdGFiIGlkLlxuXHRcdFx0ICovXG5cdFx0XHRhY3RpdmVUYWJJZCA9IGpRdWVyeSggXCIud3BzZW90YWJcIiApLmF0dHIoIFwiaWRcIiApO1xuXHRcdH1cblxuXHRcdGpRdWVyeSggXCIjXCIgKyBhY3RpdmVUYWJJZCApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0alF1ZXJ5KCBcIiNcIiArIGFjdGl2ZVRhYklkICsgXCItdGFiXCIgKS5hZGRDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICkuY2xpY2soKTtcblx0fVxuXG5cdHdpbmRvdy53cHNlb0RldGVjdFdyb25nVmFyaWFibGVzID0gd3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcztcblx0d2luZG93LnNldFdQT3B0aW9uID0gc2V0V1BPcHRpb247XG5cdHdpbmRvdy53cHNlb0NvcHlIb21lTWV0YSA9IHdwc2VvQ29weUhvbWVNZXRhO1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93Lndwc2VvU2V0VGFiSGFzaCA9IHdwc2VvU2V0VGFiSGFzaDtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdC8qKlxuXHRcdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2guXG5cdFx0ICovXG5cdFx0d3BzZW9TZXRUYWJIYXNoKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEF1dGhvciBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1hdXRob3IgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNhdXRob3ItYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIERhdGUgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtZGF0ZSBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2RhdGUtYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIE1lZGlhIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWF0dGFjaG1lbnQgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNtZWRpYV9zZXR0aW5nc1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgRm9ybWF0LWJhc2VkIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLXBvc3RfZm9ybWF0XCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiNwb3N0X2Zvcm1hdC10aXRsZXMtbWV0YXNcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOm5vdCg6Y2hlY2tlZClcIiApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBCcmVhZGNydW1icyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjYnJlYWRjcnVtYnMtZW5hYmxlXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1ic2luZm9cIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBzZXR0aW5ncyBwYWdlcyB0YWJzLlxuXHRcdGpRdWVyeSggXCIjd3BzZW8tdGFic1wiICkuZmluZCggXCJhXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3dwc2VvLXRhYnNcIiApLmZpbmQoIFwiYVwiICkucmVtb3ZlQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCBcIi53cHNlb3RhYlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuYXR0ciggXCJpZFwiICkucmVwbGFjZSggXCItdGFiXCIsIFwiXCIgKTtcblx0XHRcdHZhciBhY3RpdmVUYWIgPSBqUXVlcnkoIFwiI1wiICsgaWQgKTtcblx0XHRcdGFjdGl2ZVRhYi5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdFx0aWYgKCBhY3RpdmVUYWIuaGFzQ2xhc3MoIFwibm9zYXZlXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNzdWJtaXRcIiApLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjc3VibWl0XCIgKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBDb21wYW55IG9yIFBlcnNvbiBzZWxlY3QuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb21wYW55T3JQZXJzb24gPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblx0XHRcdGlmICggXCJjb21wYW55XCIgPT09IGNvbXBhbnlPclBlcnNvbiApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuc2hvdygpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcInBlcnNvblwiID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBDaGVjayBjb3JyZWN0IHZhcmlhYmxlcyB1c2FnZSBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzLlxuXHRcdGpRdWVyeSggXCIudGVtcGxhdGVcIiApLm9uKCBcImlucHV0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0d3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBQcmV2ZW50IGZvcm0gc3VibWlzc2lvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHRoZSBzd2l0Y2gtdG9nZ2xlcy5cblx0XHRqUXVlcnkoIFwiLnN3aXRjaC15b2FzdC1zZW8gaW5wdXRcIiApLm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0aWYgKCBcImtleWRvd25cIiA9PT0gZXZlbnQudHlwZSAmJiAxMyA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWxsb3cgY29sbGFwc2luZyBvZiB0aGUgY29udGVudCB0eXBlcyBzZWN0aW9ucy5cblx0XHRqUXVlcnkoIFwiLnRvZ2dsZWFibGUtY29udGFpbmVyLXRyaWdnZXJcIiApLm9uKCBcImNsaWNrXCIsICggZXZlbnQgKSA9PiB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRsZXQgdGFyZ2V0ID0galF1ZXJ5KCBldmVudC50YXJnZXQgKTtcblxuXHRcdFx0dGFyZ2V0LmZpbmQoIFwic3BhblwiICkudG9nZ2xlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwLWFsdDIgZGFzaGljb25zLWFycm93LWRvd24tYWx0MlwiICk7XG5cdFx0XHR0YXJnZXQucGFyZW50KCkuc2libGluZ3MoIFwiLnRvZ2dsZWFibGUtY29udGFpbmVyXCIgKS50b2dnbGVDbGFzcyggXCJ0b2dnbGVhYmxlLWNvbnRhaW5lci1oaWRkZW5cIiApXG5cdFx0fSApO1xuXG5cdFx0d3BzZW9Db3B5SG9tZU1ldGEoKTtcblx0XHRzZXRJbml0aWFsQWN0aXZlVGFiKCk7XG5cdFx0aW5pdFNlbGVjdDIoKTtcblx0fSApO1xufSgpICk7XG4iLCJ2YXIgY29udGFpbmVyUG9saXRlLCBjb250YWluZXJBc3NlcnRpdmUsIHByZXZpb3VzTWVzc2FnZSA9IFwiXCI7XG5cbi8qKlxuICogQnVpbGQgdGhlIGxpdmUgcmVnaW9ucyBtYXJrdXAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBWYWx1ZSBmb3IgdGhlIFwiYXJpYS1saXZlXCIgYXR0cmlidXRlLCBkZWZhdWx0IFwicG9saXRlXCIuXG4gKlxuICogQHJldHVybnMge09iamVjdH0gJGNvbnRhaW5lciBUaGUgQVJJQSBsaXZlIHJlZ2lvbiBqUXVlcnkgb2JqZWN0LlxuICovXG52YXIgYWRkQ29udGFpbmVyID0gZnVuY3Rpb24oIGFyaWFMaXZlICkge1xuXHRhcmlhTGl2ZSA9IGFyaWFMaXZlIHx8IFwicG9saXRlXCI7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0Y29udGFpbmVyLmlkID0gXCJhMTF5LXNwZWFrLVwiICsgYXJpYUxpdmU7XG5cdGNvbnRhaW5lci5jbGFzc05hbWUgPSBcImExMXktc3BlYWstcmVnaW9uXCI7XG5cblx0dmFyIHNjcmVlblJlYWRlclRleHRTdHlsZSA9IFwiY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpOyBwb3NpdGlvbjogYWJzb2x1dGU7IGhlaWdodDogMXB4OyB3aWR0aDogMXB4OyBvdmVyZmxvdzogaGlkZGVuOyB3b3JkLXdyYXA6IG5vcm1hbDtcIjtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJzdHlsZVwiLCBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgKTtcblxuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtbGl2ZVwiLCBhcmlhTGl2ZSApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhZGRpdGlvbnMgdGV4dFwiICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1hdG9taWNcIiwgXCJ0cnVlXCIgKTtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBcImJvZHlcIiApLmFwcGVuZENoaWxkKCBjb250YWluZXIgKTtcblx0cmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogU3BlY2lmeSBhIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIERPTSBpcyByZWFkeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiB8fCAoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayApO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGxpdmUgcmVnaW9ucyB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICovXG5kb21SZWFkeSggZnVuY3Rpb24oKSB7XG5cdGNvbnRhaW5lclBvbGl0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstcG9saXRlXCIgKTtcblx0Y29udGFpbmVyQXNzZXJ0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1hc3NlcnRpdmVcIiApO1xuXG5cdGlmICggY29udGFpbmVyUG9saXRlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZSA9IGFkZENvbnRhaW5lciggXCJwb2xpdGVcIiApO1xuXHR9XG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlID09PSBudWxsICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZSA9IGFkZENvbnRhaW5lciggXCJhc3NlcnRpdmVcIiApO1xuXHR9XG59ICk7XG5cbi8qKlxuICogQ2xlYXIgdGhlIGxpdmUgcmVnaW9ucy5cbiAqL1xudmFyIGNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIuYTExeS1zcGVhay1yZWdpb25cIiApO1xuXHRmb3IgKCB2YXIgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrICkge1xuXHRcdHJlZ2lvbnNbIGkgXS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBBUklBIGxpdmUgbm90aWZpY2F0aW9uIGFyZWEgdGV4dCBub2RlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIGFyaWEtbGl2ZS4gUG9zc2libGUgdmFsdWVzOlxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBvbGl0ZSBvciBhc3NlcnRpdmUuIERlZmF1bHQgcG9saXRlLlxuICovXG52YXIgQTExeVNwZWFrID0gZnVuY3Rpb24oIG1lc3NhZ2UsIGFyaWFMaXZlICkge1xuXHQvLyBDbGVhciBwcmV2aW91cyBtZXNzYWdlcyB0byBhbGxvdyByZXBlYXRlZCBzdHJpbmdzIGJlaW5nIHJlYWQgb3V0LlxuXHRjbGVhcigpO1xuXG5cdC8qXG5cdCAqIFN0cmlwIEhUTUwgdGFncyAoaWYgYW55KSBmcm9tIHRoZSBtZXNzYWdlIHN0cmluZy4gSWRlYWxseSwgbWVzc2FnZXMgc2hvdWxkXG5cdCAqIGJlIHNpbXBsZSBzdHJpbmdzLCBjYXJlZnVsbHkgY3JhZnRlZCBmb3Igc3BlY2lmaWMgdXNlIHdpdGggQTExeVNwZWFrLlxuXHQgKiBXaGVuIHJlLXVzaW5nIGFscmVhZHkgZXhpc3Rpbmcgc3RyaW5ncyB0aGlzIHdpbGwgZW5zdXJlIHNpbXBsZSBIVE1MIHRvIGJlXG5cdCAqIHN0cmlwcGVkIG91dCBhbmQgcmVwbGFjZWQgd2l0aCBhIHNwYWNlLiBCcm93c2VycyB3aWxsIGNvbGxhcHNlIG11bHRpcGxlXG5cdCAqIHNwYWNlcyBuYXRpdmVseS5cblx0ICovXG5cdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoIC88W148Pl0rPi9nLCBcIiBcIiApO1xuXG5cdGlmICggcHJldmlvdXNNZXNzYWdlID09PSBtZXNzYWdlICkge1xuXHRcdG1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXHUwMEEwXCI7XG5cdH1cblxuXHRwcmV2aW91c01lc3NhZ2UgPSBtZXNzYWdlO1xuXG5cdGlmICggY29udGFpbmVyQXNzZXJ0aXZlICYmIFwiYXNzZXJ0aXZlXCIgPT09IGFyaWFMaXZlICkge1xuXHRcdGNvbnRhaW5lckFzc2VydGl2ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoIGNvbnRhaW5lclBvbGl0ZSApIHtcblx0XHRjb250YWluZXJQb2xpdGUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEExMXlTcGVhaztcbiJdfQ==
