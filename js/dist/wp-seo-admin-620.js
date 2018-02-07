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
				var msg = wpseoAdminL10n.variable_warning.replace("%s", "%%" + variable + "%%");
				if (jQuery("#" + errorId).length) {
					jQuery("#" + errorId).html(msg);
				} else {
					e.after(' <div id="' + errorId + '" class="wpseo-variable-warning">' + msg + "</div>");
				}

				(0, _a11ySpeak2.default)(wpseoAdminL10n.variable_warning.replace("%s", variable), "assertive");

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
  * Copies the meta description for the homepage
  *
  * @returns {void}
  */
	function wpseoCopyHomeMeta() {
		jQuery("#og_frontpage_desc").val(jQuery("#meta_description").val());
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
  * Add a Facebook admin for via AJAX.
  *
  * @returns {void}
  */
	function wpseoAddFbAdmin() {
		var targetForm = jQuery("#TB_ajaxContent");

		jQuery.post(ajaxurl, {
			_wpnonce: targetForm.find("input[name=fb_admin_nonce]").val(),
			admin_name: targetForm.find("input[name=fb_admin_name]").val(),
			admin_id: targetForm.find("input[name=fb_admin_id]").val(),
			action: "wpseo_add_fb_admin"
		}, function (response) {
			var resp = jQuery.parseJSON(response);

			targetForm.find("p.notice").remove();

			switch (resp.success) {
				case 1:

					targetForm.find("input[type=text]").val("");

					jQuery("#user_admin").append(resp.html);
					jQuery("#connected_fb_admins").show();
					tb_remove();
					break;
				case 0:
					targetForm.find(".form-wrap").prepend(resp.html);
					break;
			}
		});
	}

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
		jQuery("#post_types-post-maintax").select2({
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
	window.wpseoAddFbAdmin = wpseoAddFbAdmin;
	window.wpseo_add_fb_admin = wpseoAddFbAdmin;
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
			if (activeTab.hasClass('nosave')) {
				jQuery('#submit').hide();
			} else {
				jQuery('#submit').show();
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
		jQuery(".template").change(function () {
			wpseoDetectWrongVariables(jQuery(this));
		}).change();

		// Prevent form submission when pressing Enter on the switch-toggles.
		jQuery(".switch-yoast-seo input").on("keydown", function (event) {
			if ("keydown" === event.type && 13 === event.which) {
				event.preventDefault();
			}
		});

		setInitialActiveTab();
		initSelect2();
	});
})(); /* global wpseoAdminL10n, ajaxurl, tb_remove, wpseoSelect2Locale */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9BZG1pbkwxMG4sIGFqYXh1cmwsIHRiX3JlbW92ZSwgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERldGVjdHMgdGhlIHdyb25nIHVzZSBvZiB2YXJpYWJsZXMgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGUgVGhlIGVsZW1lbnQgdG8gdmVyaWZ5LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMoIGUgKSB7XG5cdFx0dmFyIHdhcm4gPSBmYWxzZTtcblx0XHR2YXIgZXJyb3JJZCA9IFwiXCI7XG5cdFx0dmFyIHdyb25nVmFyaWFibGVzID0gW107XG5cdFx0dmFyIGF1dGhvclZhcmlhYmxlcyA9IFsgXCJ1c2VyaWRcIiwgXCJuYW1lXCIsIFwidXNlcl9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIGRhdGVWYXJpYWJsZXMgPSBbIFwiZGF0ZVwiIF07XG5cdFx0dmFyIHBvc3RWYXJpYWJsZXMgPSBbIFwidGl0bGVcIiwgXCJwYXJlbnRfdGl0bGVcIiwgXCJleGNlcnB0XCIsIFwiZXhjZXJwdF9vbmx5XCIsIFwiY2FwdGlvblwiLCBcImZvY3Vza3dcIiwgXCJwdF9zaW5nbGVcIiwgXCJwdF9wbHVyYWxcIiwgXCJtb2RpZmllZFwiLCBcImlkXCIgXTtcblx0XHR2YXIgc3BlY2lhbFZhcmlhYmxlcyA9IFsgXCJ0ZXJtNDA0XCIsIFwic2VhcmNocGhyYXNlXCIgXTtcblx0XHR2YXIgdGF4b25vbXlWYXJpYWJsZXMgPSBbIFwidGVybV90aXRsZVwiLCBcInRlcm1fZGVzY3JpcHRpb25cIiBdO1xuXHRcdHZhciB0YXhvbm9teVBvc3RWYXJpYWJsZXMgPSBbIFwiY2F0ZWdvcnlcIiwgXCJjYXRlZ29yeV9kZXNjcmlwdGlvblwiLCBcInRhZ1wiLCBcInRhZ19kZXNjcmlwdGlvblwiIF07XG5cdFx0aWYgKCBlLmhhc0NsYXNzKCBcInBvc3R0eXBlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJob21lcGFnZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInRheG9ub215LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiYXV0aG9yLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBwb3N0VmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImRhdGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJzZWFyY2gtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInRlcm00MDRcIiBdICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImVycm9yNDA0LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMsIFsgXCJzZWFyY2hwaHJhc2VcIiBdICk7XG5cdFx0fVxuXHRcdGpRdWVyeS5lYWNoKCB3cm9uZ1ZhcmlhYmxlcywgZnVuY3Rpb24oIGluZGV4LCB2YXJpYWJsZSApIHtcblx0XHRcdGVycm9ySWQgPSBlLmF0dHIoIFwiaWRcIiApICsgXCItXCIgKyB2YXJpYWJsZSArIFwiLXdhcm5pbmdcIjtcblx0XHRcdGlmICggZS52YWwoKS5zZWFyY2goIFwiJSVcIiArIHZhcmlhYmxlICsgXCIlJVwiICkgIT09IC0xICkge1xuXHRcdFx0XHRlLmFkZENsYXNzKCBcIndwc2VvLXZhcmlhYmxlLXdhcm5pbmctZWxlbWVudFwiICk7XG5cdFx0XHRcdHZhciBtc2cgPSB3cHNlb0FkbWluTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoIFwiJXNcIiwgXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKTtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmh0bWwoIG1zZyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGUuYWZ0ZXIoICcgPGRpdiBpZD1cIicgKyBlcnJvcklkICsgJ1wiIGNsYXNzPVwid3BzZW8tdmFyaWFibGUtd2FybmluZ1wiPicgKyBtc2cgKyBcIjwvZGl2PlwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhMTF5U3BlYWsoIHdwc2VvQWRtaW5MMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCB2YXJpYWJsZSApLCBcImFzc2VydGl2ZVwiICk7XG5cblx0XHRcdFx0d2FybiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCB3YXJuID09PSBmYWxzZSApIHtcblx0XHRcdGUucmVtb3ZlQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIHNwZWNpZmljIFdQIG9wdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uIFRoZSBvcHRpb24gdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3dmFsIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBvcHRpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlICAgVGhlIElEIG9mIHRoZSBlbGVtZW50IHRvIGhpZGUgb24gc3VjY2Vzcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBUaGUgbm9uY2UgZm9yIHRoZSBhY3Rpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0V1BPcHRpb24oIG9wdGlvbiwgbmV3dmFsLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9vcHRpb25cIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0bmV3dmFsOiBuZXd2YWwsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmb3IgdGhlIGhvbWVwYWdlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9Db3B5SG9tZU1ldGEoKSB7XG5cdFx0alF1ZXJ5KCBcIiNvZ19mcm9udHBhZ2VfZGVzY1wiICkudmFsKCBqUXVlcnkoIFwiI21ldGFfZGVzY3JpcHRpb25cIiApLnZhbCgpICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgc3VyZSB3ZSBzdG9yZSB0aGUgYWN0aW9uIGhhc2ggc28gd2UgY2FuIHJldHVybiB0byB0aGUgcmlnaHQgaGFzaFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0VGFiSGFzaCgpIHtcblx0XHR2YXIgY29uZiA9IGpRdWVyeSggXCIjd3BzZW8tY29uZlwiICk7XG5cdFx0aWYgKCBjb25mLmxlbmd0aCApIHtcblx0XHRcdHZhciBjdXJyZW50VXJsID0gY29uZi5hdHRyKCBcImFjdGlvblwiICkuc3BsaXQoIFwiI1wiIClbIDAgXTtcblx0XHRcdGNvbmYuYXR0ciggXCJhY3Rpb25cIiwgY3VycmVudFVybCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2hcblx0ICovXG5cdGpRdWVyeSggd2luZG93ICkub24oIFwiaGFzaGNoYW5nZVwiLCB3cHNlb1NldFRhYkhhc2ggKTtcblxuXHQvKipcblx0ICogQWRkIGEgRmFjZWJvb2sgYWRtaW4gZm9yIHZpYSBBSkFYLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQWRkRmJBZG1pbigpIHtcblx0XHR2YXIgdGFyZ2V0Rm9ybSA9IGpRdWVyeSggXCIjVEJfYWpheENvbnRlbnRcIiApO1xuXG5cdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRhamF4dXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRfd3Bub25jZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbm9uY2VdXCIgKS52YWwoKSxcblx0XHRcdFx0YWRtaW5fbmFtZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbmFtZV1cIiApLnZhbCgpLFxuXHRcdFx0XHRhZG1pbl9pZDogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5faWRdXCIgKS52YWwoKSxcblx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2FkZF9mYl9hZG1pblwiLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0dmFyIHJlc3AgPSBqUXVlcnkucGFyc2VKU09OKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCJwLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRcdFx0c3dpdGNoICggcmVzcC5zdWNjZXNzICkge1xuXHRcdFx0XHRcdGNhc2UgMTpcblxuXHRcdFx0XHRcdFx0dGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W3R5cGU9dGV4dF1cIiApLnZhbCggXCJcIiApO1xuXG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI3VzZXJfYWRtaW5cIiApLmFwcGVuZCggcmVzcC5odG1sICk7XG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI2Nvbm5lY3RlZF9mYl9hZG1pbnNcIiApLnNob3coKTtcblx0XHRcdFx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAwIDpcblx0XHRcdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCIuZm9ybS13cmFwXCIgKS5wcmVwZW5kKCByZXNwLmh0bWwgKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHNlbGVjdDIgZm9yIHNlbGVjdGVkIGZpZWxkcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHR2YXIgc2VsZWN0MldpZHRoID0gXCI0MDBweFwiO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgR2VuZXJhbCBzZXR0aW5nczogeW91ciBpbmZvOiBjb21wYW55IG9yIHBlcnNvbi4gV2lkdGggaXMgdGhlIHNhbWUgYXMgdGhlIHdpZHRoIGZvciB0aGUgb3RoZXIgZmllbGRzIG9uIHRoaXMgcGFnZS5cblx0XHRqUXVlcnkoIFwiI2NvbXBhbnlfb3JfcGVyc29uXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBUd2l0dGVyIGNhcmQgbWV0YSBkYXRhIGluIFNldHRpbmdzXG5cdFx0alF1ZXJ5KCBcIiN0d2l0dGVyX2NhcmRfdHlwZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgdGF4b25vbXkgYnJlYWRjcnVtYnMgaW4gQWR2YW5jZWRcblx0XHRqUXVlcnkoIFwiI3Bvc3RfdHlwZXMtcG9zdC1tYWludGF4XCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBwcm9maWxlIGluIFNlYXJjaCBDb25zb2xlXG5cdFx0alF1ZXJ5KCBcIiNwcm9maWxlXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBpbml0aWFsIGFjdGl2ZSB0YWIgaW4gdGhlIHNldHRpbmdzIHBhZ2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEluaXRpYWxBY3RpdmVUYWIoKSB7XG5cdFx0dmFyIGFjdGl2ZVRhYklkID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggXCIjdG9wI1wiLCBcIlwiICk7XG5cdFx0Lypcblx0XHQgKiBXb3JkUHJlc3MgdXNlcyBmcmFnbWVudCBpZGVudGlmaWVycyBmb3IgaXRzIG93biBpbi1wYWdlIGxpbmtzLCBlLmcuXG5cdFx0ICogYCN3cGJvZHktY29udGVudGAgYW5kIG90aGVyIHBsdWdpbnMgbWF5IGRvIHRoYXQgYXMgd2VsbC4gQWxzbywgZmFjZWJvb2tcblx0XHQgKiBhZGRzIGEgYCNfPV9gIHNlZSBQUiA1MDYuIEluIHRoZXNlIGNhc2VzIGFuZCB3aGVuIGl0J3MgZW1wdHksIGRlZmF1bHRcblx0XHQgKiB0byB0aGUgZmlyc3QgdGFiLlxuXHRcdCAqL1xuXHRcdGlmICggXCJcIiA9PT0gYWN0aXZlVGFiSWQgfHwgXCIjXCIgPT09IGFjdGl2ZVRhYklkLmNoYXJBdCggMCApICkge1xuXHRcdFx0Lypcblx0XHRcdCAqIFJlbWluZGVyOiBqUXVlcnkgYXR0cigpIGdldHMgdGhlIGF0dHJpYnV0ZSB2YWx1ZSBmb3Igb25seSB0aGUgZmlyc3Rcblx0XHRcdCAqIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0IHNvIHRoaXMgd2lsbCBhbHdheXMgYmUgdGhlIGZpcnN0IHRhYiBpZC5cblx0XHRcdCAqL1xuXHRcdFx0YWN0aXZlVGFiSWQgPSBqUXVlcnkoIFwiLndwc2VvdGFiXCIgKS5hdHRyKCBcImlkXCIgKTtcblx0XHR9XG5cblx0XHRqUXVlcnkoIFwiI1wiICsgYWN0aXZlVGFiSWQgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdGpRdWVyeSggXCIjXCIgKyBhY3RpdmVUYWJJZCArIFwiLXRhYlwiICkuYWRkQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApLmNsaWNrKCk7XG5cdH1cblxuXHR3aW5kb3cud3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyA9IHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXM7XG5cdHdpbmRvdy5zZXRXUE9wdGlvbiA9IHNldFdQT3B0aW9uO1xuXHR3aW5kb3cud3BzZW9Db3B5SG9tZU1ldGEgPSB3cHNlb0NvcHlIb21lTWV0YTtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdHdpbmRvdy53cHNlb0FkZEZiQWRtaW4gPSB3cHNlb0FkZEZiQWRtaW47XG5cdHdpbmRvdy53cHNlb19hZGRfZmJfYWRtaW4gPSB3cHNlb0FkZEZiQWRtaW47XG5cdHdpbmRvdy53cHNlb1NldFRhYkhhc2ggPSB3cHNlb1NldFRhYkhhc2g7XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHQvKipcblx0XHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoLlxuXHRcdCAqL1xuXHRcdHdwc2VvU2V0VGFiSGFzaCgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBBdXRob3IgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtYXV0aG9yIGlucHV0W3R5cGU9J3JhZGlvJ11cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUaGUgdmFsdWUgb24gaXMgZGlzYWJsZWQsIG9mZiBpcyBlbmFibGVkLlxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjYXV0aG9yLWFyY2hpdmVzLXRpdGxlcy1tZXRhcy1jb250ZW50XCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBEYXRlIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWRhdGUgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNkYXRlLWFyY2hpdmVzLXRpdGxlcy1tZXRhcy1jb250ZW50XCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBNZWRpYSBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1hdHRhY2htZW50IGlucHV0W3R5cGU9J3JhZGlvJ11cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUaGUgdmFsdWUgb24gaXMgZGlzYWJsZWQsIG9mZiBpcyBlbmFibGVkLlxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjbWVkaWFfc2V0dGluZ3NcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEZvcm1hdC1iYXNlZCBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1wb3N0X2Zvcm1hdFwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjcG9zdF9mb3JtYXQtdGl0bGVzLW1ldGFzXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpub3QoOmNoZWNrZWQpXCIgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgQnJlYWRjcnVtYnMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2JyZWFkY3J1bWJzLWVuYWJsZVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjYnJlYWRjcnVtYnNpbmZvXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIEhhbmRsZSB0aGUgc2V0dGluZ3MgcGFnZXMgdGFicy5cblx0XHRqUXVlcnkoIFwiI3dwc2VvLXRhYnNcIiApLmZpbmQoIFwiYVwiICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiN3cHNlby10YWJzXCIgKS5maW5kKCBcImFcIiApLnJlbW92ZUNsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKTtcblx0XHRcdGpRdWVyeSggXCIud3BzZW90YWJcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiLXRhYlwiLCBcIlwiICk7XG5cdFx0XHR2YXIgYWN0aXZlVGFiID0galF1ZXJ5KCBcIiNcIiArIGlkICk7XG5cdFx0XHRhY3RpdmVUYWIuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdGpRdWVyeSggdGhpcyApLmFkZENsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKTtcblx0XHRcdGlmICggYWN0aXZlVGFiLmhhc0NsYXNzKCAnbm9zYXZlJyApICkge1xuXHRcdFx0XHRqUXVlcnkoICcjc3VibWl0JyApLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggJyNzdWJtaXQnICkuc2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEhhbmRsZSB0aGUgQ29tcGFueSBvciBQZXJzb24gc2VsZWN0LlxuXHRcdGpRdWVyeSggXCIjY29tcGFueV9vcl9wZXJzb25cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY29tcGFueU9yUGVyc29uID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRpZiAoIFwiY29tcGFueVwiID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLnNob3coKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggXCJwZXJzb25cIiA9PT0gY29tcGFueU9yUGVyc29uICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuc2hvdygpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gQ2hlY2sgY29ycmVjdCB2YXJpYWJsZXMgdXNhZ2UgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlcy5cblx0XHRqUXVlcnkoIFwiLnRlbXBsYXRlXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0d3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBQcmV2ZW50IGZvcm0gc3VibWlzc2lvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHRoZSBzd2l0Y2gtdG9nZ2xlcy5cblx0XHRqUXVlcnkoIFwiLnN3aXRjaC15b2FzdC1zZW8gaW5wdXRcIiApLm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0aWYgKCBcImtleWRvd25cIiA9PT0gZXZlbnQudHlwZSAmJiAxMyA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0c2V0SW5pdGlhbEFjdGl2ZVRhYigpO1xuXHRcdGluaXRTZWxlY3QyKCk7XG5cdH0gKTtcbn0oKSApO1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
