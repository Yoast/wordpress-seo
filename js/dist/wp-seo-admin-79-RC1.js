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
		jQuery("body").on("click", "button.toggleable-container-trigger", function (event) {
			var target = jQuery(event.currentTarget);
			var toggleableContainer = target.parent().siblings(".toggleable-container");

			toggleableContainer.toggleClass("toggleable-container-hidden");
			target.attr("aria-expanded", !toggleableContainer.hasClass("toggleable-container-hidden")).find("span").toggleClass("dashicons-arrow-up-alt2 dashicons-arrow-down-alt2");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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LE9BQUksU0FBUyxPQUFRLE1BQU0sYUFBZCxDQUFiO0FBQ0EsT0FBSSxzQkFBc0IsT0FBTyxNQUFQLEdBQWdCLFFBQWhCLENBQTBCLHVCQUExQixDQUExQjs7QUFFQSx1QkFBb0IsV0FBcEIsQ0FBaUMsNkJBQWpDO0FBQ0EsVUFDRSxJQURGLENBQ1EsZUFEUixFQUN5QixDQUFFLG9CQUFvQixRQUFwQixDQUE4Qiw2QkFBOUIsQ0FEM0IsRUFFRSxJQUZGLENBRVEsTUFGUixFQUVpQixXQUZqQixDQUU4QixtREFGOUI7QUFHQSxHQVJEOztBQVVBO0FBQ0E7QUFDQTtBQUNBLEVBbkdEO0FBb0dBLENBblNDLEdBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwc2VvQWRtaW5HbG9iYWxMMTBuLCBhamF4dXJsLCB3cHNlb1NlbGVjdDJMb2NhbGUgKi9cblxuaW1wb3J0IGExMXlTcGVhayBmcm9tIFwiYTExeS1zcGVha1wiO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvKipcblx0ICogRGV0ZWN0cyB0aGUgd3JvbmcgdXNlIG9mIHZhcmlhYmxlcyBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gZSBUaGUgZWxlbWVudCB0byB2ZXJpZnkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggZSApIHtcblx0XHR2YXIgd2FybiA9IGZhbHNlO1xuXHRcdHZhciBlcnJvcklkID0gXCJcIjtcblx0XHR2YXIgd3JvbmdWYXJpYWJsZXMgPSBbXTtcblx0XHR2YXIgYXV0aG9yVmFyaWFibGVzID0gWyBcInVzZXJpZFwiLCBcIm5hbWVcIiwgXCJ1c2VyX2Rlc2NyaXB0aW9uXCIgXTtcblx0XHR2YXIgZGF0ZVZhcmlhYmxlcyA9IFsgXCJkYXRlXCIgXTtcblx0XHR2YXIgcG9zdFZhcmlhYmxlcyA9IFsgXCJ0aXRsZVwiLCBcInBhcmVudF90aXRsZVwiLCBcImV4Y2VycHRcIiwgXCJleGNlcnB0X29ubHlcIiwgXCJjYXB0aW9uXCIsIFwiZm9jdXNrd1wiLCBcInB0X3NpbmdsZVwiLCBcInB0X3BsdXJhbFwiLCBcIm1vZGlmaWVkXCIsIFwiaWRcIiBdO1xuXHRcdHZhciBzcGVjaWFsVmFyaWFibGVzID0gWyBcInRlcm00MDRcIiwgXCJzZWFyY2hwaHJhc2VcIiBdO1xuXHRcdHZhciB0YXhvbm9teVZhcmlhYmxlcyA9IFsgXCJ0ZXJtX3RpdGxlXCIsIFwidGVybV9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIHRheG9ub215UG9zdFZhcmlhYmxlcyA9IFsgXCJjYXRlZ29yeVwiLCBcImNhdGVnb3J5X2Rlc2NyaXB0aW9uXCIsIFwidGFnXCIsIFwidGFnX2Rlc2NyaXB0aW9uXCIgXTtcblx0XHRpZiAoIGUuaGFzQ2xhc3MoIFwicG9zdHR5cGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImhvbWVwYWdlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwidGF4b25vbXktdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJhdXRob3ItdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIHBvc3RWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiZGF0ZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInNlYXJjaC10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzLCBbIFwidGVybTQwNFwiIF0gKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiZXJyb3I0MDQtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInNlYXJjaHBocmFzZVwiIF0gKTtcblx0XHR9XG5cdFx0alF1ZXJ5LmVhY2goIHdyb25nVmFyaWFibGVzLCBmdW5jdGlvbiggaW5kZXgsIHZhcmlhYmxlICkge1xuXHRcdFx0ZXJyb3JJZCA9IGUuYXR0ciggXCJpZFwiICkgKyBcIi1cIiArIHZhcmlhYmxlICsgXCItd2FybmluZ1wiO1xuXHRcdFx0aWYgKCBlLnZhbCgpLnNlYXJjaCggXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKSAhPT0gLTEgKSB7XG5cdFx0XHRcdGUuYWRkQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHRcdFx0dmFyIG1zZyA9IHdwc2VvQWRtaW5HbG9iYWxMMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCBcIiUlXCIgKyB2YXJpYWJsZSArIFwiJSVcIiApO1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkuaHRtbCggbXNnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZS5hZnRlciggJyA8ZGl2IGlkPVwiJyArIGVycm9ySWQgKyAnXCIgY2xhc3M9XCJ3cHNlby12YXJpYWJsZS13YXJuaW5nXCI+JyArIG1zZyArIFwiPC9kaXY+XCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGExMXlTcGVhayggd3BzZW9BZG1pbkdsb2JhbEwxMG4udmFyaWFibGVfd2FybmluZy5yZXBsYWNlKCBcIiVzXCIsIHZhcmlhYmxlICksIFwiYXNzZXJ0aXZlXCIgKTtcblxuXHRcdFx0XHR3YXJuID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0XHRpZiAoIHdhcm4gPT09IGZhbHNlICkge1xuXHRcdFx0ZS5yZW1vdmVDbGFzcyggXCJ3cHNlby12YXJpYWJsZS13YXJuaW5nLWVsZW1lbnRcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIGEgc3BlY2lmaWMgV1Agb3B0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb24gVGhlIG9wdGlvbiB0byB1cGRhdGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuZXd2YWwgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIG9wdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGUgICBUaGUgSUQgb2YgdGhlIGVsZW1lbnQgdG8gaGlkZSBvbiBzdWNjZXNzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgIFRoZSBub25jZSBmb3IgdGhlIGFjdGlvbi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRXUE9wdGlvbiggb3B0aW9uLCBuZXd2YWwsIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X29wdGlvblwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRuZXd2YWw6IG5ld3ZhbCxcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29waWVzIHRoZSBtZXRhIGRlc2NyaXB0aW9uIGZvciB0aGUgaG9tZXBhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9Db3B5SG9tZU1ldGEoKSB7XG5cdFx0alF1ZXJ5KCBcIiNjb3B5LWhvbWUtbWV0YS1kZXNjcmlwdGlvblwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI29nX2Zyb250cGFnZV9kZXNjXCIgKS52YWwoIGpRdWVyeSggXCIjbWV0YV9kZXNjcmlwdGlvblwiICkudmFsKCkgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgc3VyZSB3ZSBzdG9yZSB0aGUgYWN0aW9uIGhhc2ggc28gd2UgY2FuIHJldHVybiB0byB0aGUgcmlnaHQgaGFzaFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0VGFiSGFzaCgpIHtcblx0XHR2YXIgY29uZiA9IGpRdWVyeSggXCIjd3BzZW8tY29uZlwiICk7XG5cdFx0aWYgKCBjb25mLmxlbmd0aCApIHtcblx0XHRcdHZhciBjdXJyZW50VXJsID0gY29uZi5hdHRyKCBcImFjdGlvblwiICkuc3BsaXQoIFwiI1wiIClbIDAgXTtcblx0XHRcdGNvbmYuYXR0ciggXCJhY3Rpb25cIiwgY3VycmVudFVybCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2hcblx0ICovXG5cdGpRdWVyeSggd2luZG93ICkub24oIFwiaGFzaGNoYW5nZVwiLCB3cHNlb1NldFRhYkhhc2ggKTtcblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFNlbGVjdDIoKSB7XG5cdFx0dmFyIHNlbGVjdDJXaWR0aCA9IFwiNDAwcHhcIjtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIEdlbmVyYWwgc2V0dGluZ3M6IHlvdXIgaW5mbzogY29tcGFueSBvciBwZXJzb24uIFdpZHRoIGlzIHRoZSBzYW1lIGFzIHRoZSB3aWR0aCBmb3IgdGhlIG90aGVyIGZpZWxkcyBvbiB0aGlzIHBhZ2UuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgVHdpdHRlciBjYXJkIG1ldGEgZGF0YSBpbiBTZXR0aW5nc1xuXHRcdGpRdWVyeSggXCIjdHdpdHRlcl9jYXJkX3R5cGVcIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIHRheG9ub215IGJyZWFkY3J1bWJzIGluIEFkdmFuY2VkXG5cdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1icyBzZWxlY3RcIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIHByb2ZpbGUgaW4gU2VhcmNoIENvbnNvbGVcblx0XHRqUXVlcnkoIFwiI3Byb2ZpbGVcIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIGluaXRpYWwgYWN0aXZlIHRhYiBpbiB0aGUgc2V0dGluZ3MgcGFnZXMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0SW5pdGlhbEFjdGl2ZVRhYigpIHtcblx0XHR2YXIgYWN0aXZlVGFiSWQgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCBcIiN0b3AjXCIsIFwiXCIgKTtcblx0XHQvKiBJbiBzb21lIGNhc2VzLCB0aGUgc2Vjb25kICMgZ2V0cyByZXBsYWNlIGJ5ICUyMywgd2hpY2ggbWFrZXMgdGhlIHRhYlxuXHRcdCAqIHN3aXRjaGluZyBub3Qgd29yayB1bmxlc3Mgd2UgZG8gdGhpcy4gKi9cblx0XHRpZiAoIGFjdGl2ZVRhYklkLnNlYXJjaCggXCIjdG9wXCIgKSAhPT0gLTEgKSB7XG5cdFx0XHRhY3RpdmVUYWJJZCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoIFwiI3RvcCUyM1wiLCBcIlwiICk7XG5cdFx0fVxuXHRcdC8qXG5cdFx0ICogV29yZFByZXNzIHVzZXMgZnJhZ21lbnQgaWRlbnRpZmllcnMgZm9yIGl0cyBvd24gaW4tcGFnZSBsaW5rcywgZS5nLlxuXHRcdCAqIGAjd3Bib2R5LWNvbnRlbnRgIGFuZCBvdGhlciBwbHVnaW5zIG1heSBkbyB0aGF0IGFzIHdlbGwuIEFsc28sIGZhY2Vib29rXG5cdFx0ICogYWRkcyBhIGAjXz1fYCBzZWUgUFIgNTA2LiBJbiB0aGVzZSBjYXNlcyBhbmQgd2hlbiBpdCdzIGVtcHR5LCBkZWZhdWx0XG5cdFx0ICogdG8gdGhlIGZpcnN0IHRhYi5cblx0XHQgKi9cblx0XHRpZiAoIFwiXCIgPT09IGFjdGl2ZVRhYklkIHx8IFwiI1wiID09PSBhY3RpdmVUYWJJZC5jaGFyQXQoIDAgKSApIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBSZW1pbmRlcjogalF1ZXJ5IGF0dHIoKSBnZXRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIG9ubHkgdGhlIGZpcnN0XG5cdFx0XHQgKiBlbGVtZW50IGluIHRoZSBtYXRjaGVkIHNldCBzbyB0aGlzIHdpbGwgYWx3YXlzIGJlIHRoZSBmaXJzdCB0YWIgaWQuXG5cdFx0XHQgKi9cblx0XHRcdGFjdGl2ZVRhYklkID0galF1ZXJ5KCBcIi53cHNlb3RhYlwiICkuYXR0ciggXCJpZFwiICk7XG5cdFx0fVxuXG5cdFx0alF1ZXJ5KCBcIiNcIiArIGFjdGl2ZVRhYklkICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRqUXVlcnkoIFwiI1wiICsgYWN0aXZlVGFiSWQgKyBcIi10YWJcIiApLmFkZENsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKS5jbGljaygpO1xuXHR9XG5cblx0d2luZG93Lndwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMgPSB3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzO1xuXHR3aW5kb3cuc2V0V1BPcHRpb24gPSBzZXRXUE9wdGlvbjtcblx0d2luZG93Lndwc2VvQ29weUhvbWVNZXRhID0gd3BzZW9Db3B5SG9tZU1ldGE7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXHR3aW5kb3cud3BzZW9TZXRUYWJIYXNoID0gd3BzZW9TZXRUYWJIYXNoO1xuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0LyoqXG5cdFx0ICogV2hlbiB0aGUgaGFzaCBjaGFuZ2VzLCBnZXQgdGhlIGJhc2UgdXJsIGZyb20gdGhlIGFjdGlvbiBhbmQgdGhlbiBhZGQgdGhlIGN1cnJlbnQgaGFzaC5cblx0XHQgKi9cblx0XHR3cHNlb1NldFRhYkhhc2goKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgQXV0aG9yIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWF1dGhvciBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2F1dGhvci1hcmNoaXZlcy10aXRsZXMtbWV0YXMtY29udGVudFwiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgRGF0ZSBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1kYXRlIGlucHV0W3R5cGU9J3JhZGlvJ11cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUaGUgdmFsdWUgb24gaXMgZGlzYWJsZWQsIG9mZiBpcyBlbmFibGVkLlxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjZGF0ZS1hcmNoaXZlcy10aXRsZXMtbWV0YXMtY29udGVudFwiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgTWVkaWEgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtYXR0YWNobWVudCBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI21lZGlhX3NldHRpbmdzXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBGb3JtYXQtYmFzZWQgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtcG9zdF9mb3JtYXRcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3Bvc3RfZm9ybWF0LXRpdGxlcy1tZXRhc1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6bm90KDpjaGVja2VkKVwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEJyZWFkY3J1bWJzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1icy1lbmFibGVcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI2JyZWFkY3J1bWJzaW5mb1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBIYW5kbGUgdGhlIHNldHRpbmdzIHBhZ2VzIHRhYnMuXG5cdFx0alF1ZXJ5KCBcIiN3cHNlby10YWJzXCIgKS5maW5kKCBcImFcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjd3BzZW8tdGFic1wiICkuZmluZCggXCJhXCIgKS5yZW1vdmVDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICk7XG5cdFx0XHRqUXVlcnkoIFwiLndwc2VvdGFiXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCBcIi10YWJcIiwgXCJcIiApO1xuXHRcdFx0dmFyIGFjdGl2ZVRhYiA9IGpRdWVyeSggXCIjXCIgKyBpZCApO1xuXHRcdFx0YWN0aXZlVGFiLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICk7XG5cdFx0XHRpZiAoIGFjdGl2ZVRhYi5oYXNDbGFzcyggXCJub3NhdmVcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI3N1Ym1pdFwiICkuaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNzdWJtaXRcIiApLnNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgdGhlIENvbXBhbnkgb3IgUGVyc29uIHNlbGVjdC5cblx0XHRqUXVlcnkoIFwiI2NvbXBhbnlfb3JfcGVyc29uXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbXBhbnlPclBlcnNvbiA9IGpRdWVyeSggdGhpcyApLnZhbCgpO1xuXHRcdFx0aWYgKCBcImNvbXBhbnlcIiA9PT0gY29tcGFueU9yUGVyc29uICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5zaG93KCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIFwicGVyc29uXCIgPT09IGNvbXBhbnlPclBlcnNvbiApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLnNob3coKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIENoZWNrIGNvcnJlY3QgdmFyaWFibGVzIHVzYWdlIGluIHRpdGxlIGFuZCBkZXNjcmlwdGlvbiB0ZW1wbGF0ZXMuXG5cdFx0alF1ZXJ5KCBcIi50ZW1wbGF0ZVwiICkub24oIFwiaW5wdXRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIFByZXZlbnQgZm9ybSBzdWJtaXNzaW9uIHdoZW4gcHJlc3NpbmcgRW50ZXIgb24gdGhlIHN3aXRjaC10b2dnbGVzLlxuXHRcdGpRdWVyeSggXCIuc3dpdGNoLXlvYXN0LXNlbyBpbnB1dFwiICkub24oIFwia2V5ZG93blwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRpZiAoIFwia2V5ZG93blwiID09PSBldmVudC50eXBlICYmIDEzID09PSBldmVudC53aGljaCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBBbGxvdyBjb2xsYXBzaW5nIG9mIHRoZSBjb250ZW50IHR5cGVzIHNlY3Rpb25zLlxuXHRcdGpRdWVyeSggXCJib2R5XCIgKS5vbiggXCJjbGlja1wiLCBcImJ1dHRvbi50b2dnbGVhYmxlLWNvbnRhaW5lci10cmlnZ2VyXCIsICggZXZlbnQgKSA9PiB7XG5cdFx0XHRsZXQgdGFyZ2V0ID0galF1ZXJ5KCBldmVudC5jdXJyZW50VGFyZ2V0ICk7XG5cdFx0XHRsZXQgdG9nZ2xlYWJsZUNvbnRhaW5lciA9IHRhcmdldC5wYXJlbnQoKS5zaWJsaW5ncyggXCIudG9nZ2xlYWJsZS1jb250YWluZXJcIiApO1xuXG5cdFx0XHR0b2dnbGVhYmxlQ29udGFpbmVyLnRvZ2dsZUNsYXNzKCBcInRvZ2dsZWFibGUtY29udGFpbmVyLWhpZGRlblwiICk7XG5cdFx0XHR0YXJnZXRcblx0XHRcdFx0LmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIHRvZ2dsZWFibGVDb250YWluZXIuaGFzQ2xhc3MoIFwidG9nZ2xlYWJsZS1jb250YWluZXItaGlkZGVuXCIgKSApXG5cdFx0XHRcdC5maW5kKCBcInNwYW5cIiApLnRvZ2dsZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cC1hbHQyIGRhc2hpY29ucy1hcnJvdy1kb3duLWFsdDJcIiApO1xuXHRcdH0gKTtcblxuXHRcdHdwc2VvQ29weUhvbWVNZXRhKCk7XG5cdFx0c2V0SW5pdGlhbEFjdGl2ZVRhYigpO1xuXHRcdGluaXRTZWxlY3QyKCk7XG5cdH0gKTtcbn0oKSApO1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
