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
  * Do the kill blocking files action
  *
  * @param {string} nonce Nonce to validate request.
  *
  * @returns {void}
  */
	function wpseoKillBlockingFiles(nonce) {
		jQuery.post(ajaxurl, {
			action: "wpseo_kill_blocking_files",
			// eslint-disable-next-line
			_ajax_nonce: nonce
		}).done(function (response) {
			var noticeContainer = jQuery(".yoast-notice-blocking-files"),
			    noticeParagraph = jQuery("#blocking_files");

			noticeParagraph.html(response.data.message);
			// Make the notice focusable and move focue on it so screen readers will read out its content.
			noticeContainer.attr("tabindex", "-1").focus();

			if (response.success) {
				noticeContainer.removeClass("notice-error").addClass("notice-success");
			} else {
				noticeContainer.addClass("yoast-blocking-files-error");
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
	window.wpseoKillBlockingFiles = wpseoKillBlockingFiles;
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

		// Toggle the XML sitemap section.
		jQuery("#enablexmlsitemap").change(function () {
			jQuery("#sitemapinfo").toggle(jQuery(this).is(":checked"));
		}).change();

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

		// Toggle the Format-based archives section.
		jQuery("#disable-post_format").change(function () {
			jQuery("#post_format-titles-metas").toggle(jQuery(this).is(":not(:checked)"));
		}).change();

		// Toggle the Breadcrumbs section.
		jQuery("#breadcrumbs-enable").change(function () {
			jQuery("#breadcrumbsinfo").toggle(jQuery(this).is(":checked"));
		}).change();

		// Toggle the Author / user sitemap section.
		jQuery("#disable_author_sitemap").find("input:radio").change(function () {
			if (jQuery(this).is(":checked")) {
				jQuery("#xml_user_block").toggle(jQuery(this).val() === "off");
			}
		}).change();

		// Handle the settings pages tabs.
		jQuery("#wpseo-tabs").find("a").click(function () {
			jQuery("#wpseo-tabs").find("a").removeClass("nav-tab-active");
			jQuery(".wpseotab").removeClass("active");

			var id = jQuery(this).attr("id").replace("-tab", "");
			jQuery("#" + id).addClass("active");
			jQuery(this).addClass("nav-tab-active");
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

		// XML sitemaps "Fix it" button.
		jQuery("#blocking_files .button").on("click", function () {
			wpseoKillBlockingFiles(jQuery(this).data("nonce"));
		});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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Q0EsU0FBUSx5QkFBUixFQUFvQyxFQUFwQyxDQUF3QyxTQUF4QyxFQUFtRCxVQUFVLEtBQVYsRUFBa0I7QUFDcEUsT0FBSyxjQUFjLE1BQU0sSUFBcEIsSUFBNEIsT0FBTyxNQUFNLEtBQTlDLEVBQXNEO0FBQ3JELFVBQU0sY0FBTjtBQUNBO0FBQ0QsR0FKRDs7QUFNQTtBQUNBO0FBQ0EsRUExRkQ7QUEyRkEsQ0F4VkMsR0FBRixDLENBSkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9BZG1pbkwxMG4sIGFqYXh1cmwsIHRiX3JlbW92ZSwgd3BzZW9TZWxlY3QyTG9jYWxlICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERldGVjdHMgdGhlIHdyb25nIHVzZSBvZiB2YXJpYWJsZXMgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge2VsZW1lbnR9IGUgVGhlIGVsZW1lbnQgdG8gdmVyaWZ5LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMoIGUgKSB7XG5cdFx0dmFyIHdhcm4gPSBmYWxzZTtcblx0XHR2YXIgZXJyb3JJZCA9IFwiXCI7XG5cdFx0dmFyIHdyb25nVmFyaWFibGVzID0gW107XG5cdFx0dmFyIGF1dGhvclZhcmlhYmxlcyA9IFsgXCJ1c2VyaWRcIiwgXCJuYW1lXCIsIFwidXNlcl9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIGRhdGVWYXJpYWJsZXMgPSBbIFwiZGF0ZVwiIF07XG5cdFx0dmFyIHBvc3RWYXJpYWJsZXMgPSBbIFwidGl0bGVcIiwgXCJwYXJlbnRfdGl0bGVcIiwgXCJleGNlcnB0XCIsIFwiZXhjZXJwdF9vbmx5XCIsIFwiY2FwdGlvblwiLCBcImZvY3Vza3dcIiwgXCJwdF9zaW5nbGVcIiwgXCJwdF9wbHVyYWxcIiwgXCJtb2RpZmllZFwiLCBcImlkXCIgXTtcblx0XHR2YXIgc3BlY2lhbFZhcmlhYmxlcyA9IFsgXCJ0ZXJtNDA0XCIsIFwic2VhcmNocGhyYXNlXCIgXTtcblx0XHR2YXIgdGF4b25vbXlWYXJpYWJsZXMgPSBbIFwidGVybV90aXRsZVwiLCBcInRlcm1fZGVzY3JpcHRpb25cIiBdO1xuXHRcdHZhciB0YXhvbm9teVBvc3RWYXJpYWJsZXMgPSBbIFwiY2F0ZWdvcnlcIiwgXCJjYXRlZ29yeV9kZXNjcmlwdGlvblwiLCBcInRhZ1wiLCBcInRhZ19kZXNjcmlwdGlvblwiIF07XG5cdFx0aWYgKCBlLmhhc0NsYXNzKCBcInBvc3R0eXBlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJob21lcGFnZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInRheG9ub215LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiYXV0aG9yLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBwb3N0VmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImRhdGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJzZWFyY2gtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInRlcm00MDRcIiBdICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImVycm9yNDA0LXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMsIFsgXCJzZWFyY2hwaHJhc2VcIiBdICk7XG5cdFx0fVxuXHRcdGpRdWVyeS5lYWNoKCB3cm9uZ1ZhcmlhYmxlcywgZnVuY3Rpb24oIGluZGV4LCB2YXJpYWJsZSApIHtcblx0XHRcdGVycm9ySWQgPSBlLmF0dHIoIFwiaWRcIiApICsgXCItXCIgKyB2YXJpYWJsZSArIFwiLXdhcm5pbmdcIjtcblx0XHRcdGlmICggZS52YWwoKS5zZWFyY2goIFwiJSVcIiArIHZhcmlhYmxlICsgXCIlJVwiICkgIT09IC0xICkge1xuXHRcdFx0XHRlLmFkZENsYXNzKCBcIndwc2VvLXZhcmlhYmxlLXdhcm5pbmctZWxlbWVudFwiICk7XG5cdFx0XHRcdHZhciBtc2cgPSB3cHNlb0FkbWluTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoIFwiJXNcIiwgXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKTtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmh0bWwoIG1zZyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGUuYWZ0ZXIoICcgPGRpdiBpZD1cIicgKyBlcnJvcklkICsgJ1wiIGNsYXNzPVwid3BzZW8tdmFyaWFibGUtd2FybmluZ1wiPicgKyBtc2cgKyBcIjwvZGl2PlwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhMTF5U3BlYWsoIHdwc2VvQWRtaW5MMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCB2YXJpYWJsZSApLCBcImFzc2VydGl2ZVwiICk7XG5cblx0XHRcdFx0d2FybiA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgZXJyb3JJZCApLnJlbW92ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdFx0aWYgKCB3YXJuID09PSBmYWxzZSApIHtcblx0XHRcdGUucmVtb3ZlQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBhIHNwZWNpZmljIFdQIG9wdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uIFRoZSBvcHRpb24gdG8gdXBkYXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmV3dmFsIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBvcHRpb24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlICAgVGhlIElEIG9mIHRoZSBlbGVtZW50IHRvIGhpZGUgb24gc3VjY2Vzcy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBUaGUgbm9uY2UgZm9yIHRoZSBhY3Rpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0V1BPcHRpb24oIG9wdGlvbiwgbmV3dmFsLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9vcHRpb25cIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0bmV3dmFsOiBuZXd2YWwsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvIHRoZSBraWxsIGJsb2NraW5nIGZpbGVzIGFjdGlvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgTm9uY2UgdG8gdmFsaWRhdGUgcmVxdWVzdC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0tpbGxCbG9ja2luZ0ZpbGVzKCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX2tpbGxfYmxvY2tpbmdfZmlsZXNcIixcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXHRcdFx0X2FqYXhfbm9uY2U6IG5vbmNlLFxuXHRcdH0gKS5kb25lKCBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHR2YXIgbm90aWNlQ29udGFpbmVyID0galF1ZXJ5KCBcIi55b2FzdC1ub3RpY2UtYmxvY2tpbmctZmlsZXNcIiApLFxuXHRcdFx0XHRub3RpY2VQYXJhZ3JhcGggPSBqUXVlcnkoIFwiI2Jsb2NraW5nX2ZpbGVzXCIgKTtcblxuXHRcdFx0bm90aWNlUGFyYWdyYXBoLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0Ly8gTWFrZSB0aGUgbm90aWNlIGZvY3VzYWJsZSBhbmQgbW92ZSBmb2N1ZSBvbiBpdCBzbyBzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgb3V0IGl0cyBjb250ZW50LlxuXHRcdFx0bm90aWNlQ29udGFpbmVyLmF0dHIoIFwidGFiaW5kZXhcIiwgXCItMVwiICkuZm9jdXMoKTtcblxuXHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzICkge1xuXHRcdFx0XHRub3RpY2VDb250YWluZXIucmVtb3ZlQ2xhc3MoIFwibm90aWNlLWVycm9yXCIgKS5hZGRDbGFzcyggXCJub3RpY2Utc3VjY2Vzc1wiICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub3RpY2VDb250YWluZXIuYWRkQ2xhc3MoIFwieW9hc3QtYmxvY2tpbmctZmlsZXMtZXJyb3JcIiApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIG1ldGEgZGVzY3JpcHRpb24gZm9yIHRoZSBob21lcGFnZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQ29weUhvbWVNZXRhKCkge1xuXHRcdGpRdWVyeSggXCIjb2dfZnJvbnRwYWdlX2Rlc2NcIiApLnZhbCggalF1ZXJ5KCBcIiNtZXRhX2Rlc2NyaXB0aW9uXCIgKS52YWwoKSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHN1cmUgd2Ugc3RvcmUgdGhlIGFjdGlvbiBoYXNoIHNvIHdlIGNhbiByZXR1cm4gdG8gdGhlIHJpZ2h0IGhhc2hcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb1NldFRhYkhhc2goKSB7XG5cdFx0dmFyIGNvbmYgPSBqUXVlcnkoIFwiI3dwc2VvLWNvbmZcIiApO1xuXHRcdGlmICggY29uZi5sZW5ndGggKSB7XG5cdFx0XHR2YXIgY3VycmVudFVybCA9IGNvbmYuYXR0ciggXCJhY3Rpb25cIiApLnNwbGl0KCBcIiNcIiApWyAwIF07XG5cdFx0XHRjb25mLmF0dHIoIFwiYWN0aW9uXCIsIGN1cnJlbnRVcmwgKyB3aW5kb3cubG9jYXRpb24uaGFzaCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoXG5cdCAqL1xuXHRqUXVlcnkoIHdpbmRvdyApLm9uKCBcImhhc2hjaGFuZ2VcIiwgd3BzZW9TZXRUYWJIYXNoICk7XG5cblx0LyoqXG5cdCAqIEFkZCBhIEZhY2Vib29rIGFkbWluIGZvciB2aWEgQUpBWC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0FkZEZiQWRtaW4oKSB7XG5cdFx0dmFyIHRhcmdldEZvcm0gPSBqUXVlcnkoIFwiI1RCX2FqYXhDb250ZW50XCIgKTtcblxuXHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0YWpheHVybCxcblx0XHRcdHtcblx0XHRcdFx0X3dwbm9uY2U6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX25vbmNlXVwiICkudmFsKCksXG5cdFx0XHRcdGFkbWluX25hbWU6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX25hbWVdXCIgKS52YWwoKSxcblx0XHRcdFx0YWRtaW5faWQ6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX2lkXVwiICkudmFsKCksXG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19hZGRfZmJfYWRtaW5cIixcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdHZhciByZXNwID0galF1ZXJ5LnBhcnNlSlNPTiggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHR0YXJnZXRGb3JtLmZpbmQoIFwicC5ub3RpY2VcIiApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHN3aXRjaCAoIHJlc3Auc3VjY2VzcyApIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cblx0XHRcdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFt0eXBlPXRleHRdXCIgKS52YWwoIFwiXCIgKTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBcIiN1c2VyX2FkbWluXCIgKS5hcHBlbmQoIHJlc3AuaHRtbCApO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBcIiNjb25uZWN0ZWRfZmJfYWRtaW5zXCIgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR0Yl9yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMCA6XG5cdFx0XHRcdFx0XHR0YXJnZXRGb3JtLmZpbmQoIFwiLmZvcm0td3JhcFwiICkucHJlcGVuZCggcmVzcC5odG1sICk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFNlbGVjdDIoKSB7XG5cdFx0dmFyIHNlbGVjdDJXaWR0aCA9IFwiNDAwcHhcIjtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIEdlbmVyYWwgc2V0dGluZ3M6IHlvdXIgaW5mbzogY29tcGFueSBvciBwZXJzb24uIFdpZHRoIGlzIHRoZSBzYW1lIGFzIHRoZSB3aWR0aCBmb3IgdGhlIG90aGVyIGZpZWxkcyBvbiB0aGlzIHBhZ2UuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgVHdpdHRlciBjYXJkIG1ldGEgZGF0YSBpbiBTZXR0aW5nc1xuXHRcdGpRdWVyeSggXCIjdHdpdHRlcl9jYXJkX3R5cGVcIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIHRheG9ub215IGJyZWFkY3J1bWJzIGluIEFkdmFuY2VkXG5cdFx0alF1ZXJ5KCBcIiNwb3N0X3R5cGVzLXBvc3QtbWFpbnRheFwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgcHJvZmlsZSBpbiBTZWFyY2ggQ29uc29sZVxuXHRcdGpRdWVyeSggXCIjcHJvZmlsZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgaW5pdGlhbCBhY3RpdmUgdGFiIGluIHRoZSBzZXR0aW5ncyBwYWdlcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRJbml0aWFsQWN0aXZlVGFiKCkge1xuXHRcdHZhciBhY3RpdmVUYWJJZCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoIFwiI3RvcCNcIiwgXCJcIiApO1xuXHRcdC8qXG5cdFx0ICogV29yZFByZXNzIHVzZXMgZnJhZ21lbnQgaWRlbnRpZmllcnMgZm9yIGl0cyBvd24gaW4tcGFnZSBsaW5rcywgZS5nLlxuXHRcdCAqIGAjd3Bib2R5LWNvbnRlbnRgIGFuZCBvdGhlciBwbHVnaW5zIG1heSBkbyB0aGF0IGFzIHdlbGwuIEFsc28sIGZhY2Vib29rXG5cdFx0ICogYWRkcyBhIGAjXz1fYCBzZWUgUFIgNTA2LiBJbiB0aGVzZSBjYXNlcyBhbmQgd2hlbiBpdCdzIGVtcHR5LCBkZWZhdWx0XG5cdFx0ICogdG8gdGhlIGZpcnN0IHRhYi5cblx0XHQgKi9cblx0XHRpZiAoIFwiXCIgPT09IGFjdGl2ZVRhYklkIHx8IFwiI1wiID09PSBhY3RpdmVUYWJJZC5jaGFyQXQoIDAgKSApIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBSZW1pbmRlcjogalF1ZXJ5IGF0dHIoKSBnZXRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIG9ubHkgdGhlIGZpcnN0XG5cdFx0XHQgKiBlbGVtZW50IGluIHRoZSBtYXRjaGVkIHNldCBzbyB0aGlzIHdpbGwgYWx3YXlzIGJlIHRoZSBmaXJzdCB0YWIgaWQuXG5cdFx0XHQgKi9cblx0XHRcdGFjdGl2ZVRhYklkID0galF1ZXJ5KCBcIi53cHNlb3RhYlwiICkuYXR0ciggXCJpZFwiICk7XG5cdFx0fVxuXG5cdFx0alF1ZXJ5KCBcIiNcIiArIGFjdGl2ZVRhYklkICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRqUXVlcnkoIFwiI1wiICsgYWN0aXZlVGFiSWQgKyBcIi10YWJcIiApLmFkZENsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKS5jbGljaygpO1xuXHR9XG5cblx0d2luZG93Lndwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMgPSB3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzO1xuXHR3aW5kb3cuc2V0V1BPcHRpb24gPSBzZXRXUE9wdGlvbjtcblx0d2luZG93Lndwc2VvS2lsbEJsb2NraW5nRmlsZXMgPSB3cHNlb0tpbGxCbG9ja2luZ0ZpbGVzO1xuXHR3aW5kb3cud3BzZW9Db3B5SG9tZU1ldGEgPSB3cHNlb0NvcHlIb21lTWV0YTtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdHdpbmRvdy53cHNlb0FkZEZiQWRtaW4gPSB3cHNlb0FkZEZiQWRtaW47XG5cdHdpbmRvdy53cHNlb19hZGRfZmJfYWRtaW4gPSB3cHNlb0FkZEZiQWRtaW47XG5cdHdpbmRvdy53cHNlb1NldFRhYkhhc2ggPSB3cHNlb1NldFRhYkhhc2g7XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHQvKipcblx0XHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoLlxuXHRcdCAqL1xuXHRcdHdwc2VvU2V0VGFiSGFzaCgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBYTUwgc2l0ZW1hcCBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZW5hYmxleG1sc2l0ZW1hcFwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjc2l0ZW1hcGluZm9cIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBBdXRob3IgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtYXV0aG9yIGlucHV0W3R5cGU9J3JhZGlvJ11cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUaGUgdmFsdWUgb24gaXMgZGlzYWJsZWQsIG9mZiBpcyBlbmFibGVkLlxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjYXV0aG9yLWFyY2hpdmVzLXRpdGxlcy1tZXRhcy1jb250ZW50XCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBEYXRlIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWRhdGUgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNkYXRlLWFyY2hpdmVzLXRpdGxlcy1tZXRhcy1jb250ZW50XCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBGb3JtYXQtYmFzZWQgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtcG9zdF9mb3JtYXRcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3Bvc3RfZm9ybWF0LXRpdGxlcy1tZXRhc1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6bm90KDpjaGVja2VkKVwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEJyZWFkY3J1bWJzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1icy1lbmFibGVcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI2JyZWFkY3J1bWJzaW5mb1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEF1dGhvciAvIHVzZXIgc2l0ZW1hcCBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZV9hdXRob3Jfc2l0ZW1hcFwiICkuZmluZCggXCJpbnB1dDpyYWRpb1wiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI3htbF91c2VyX2Jsb2NrXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBzZXR0aW5ncyBwYWdlcyB0YWJzLlxuXHRcdGpRdWVyeSggXCIjd3BzZW8tdGFic1wiICkuZmluZCggXCJhXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3dwc2VvLXRhYnNcIiApLmZpbmQoIFwiYVwiICkucmVtb3ZlQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCBcIi53cHNlb3RhYlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0dmFyIGlkID0galF1ZXJ5KCB0aGlzICkuYXR0ciggXCJpZFwiICkucmVwbGFjZSggXCItdGFiXCIsIFwiXCIgKTtcblx0XHRcdGpRdWVyeSggXCIjXCIgKyBpZCApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBDb21wYW55IG9yIFBlcnNvbiBzZWxlY3QuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjb21wYW55T3JQZXJzb24gPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblx0XHRcdGlmICggXCJjb21wYW55XCIgPT09IGNvbXBhbnlPclBlcnNvbiApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuc2hvdygpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcInBlcnNvblwiID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBDaGVjayBjb3JyZWN0IHZhcmlhYmxlcyB1c2FnZSBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzLlxuXHRcdGpRdWVyeSggXCIudGVtcGxhdGVcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFhNTCBzaXRlbWFwcyBcIkZpeCBpdFwiIGJ1dHRvbi5cblx0XHRqUXVlcnkoIFwiI2Jsb2NraW5nX2ZpbGVzIC5idXR0b25cIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0d3BzZW9LaWxsQmxvY2tpbmdGaWxlcyggalF1ZXJ5KCB0aGlzICkuZGF0YSggXCJub25jZVwiICkgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBQcmV2ZW50IGZvcm0gc3VibWlzc2lvbiB3aGVuIHByZXNzaW5nIEVudGVyIG9uIHRoZSBzd2l0Y2gtdG9nZ2xlcy5cblx0XHRqUXVlcnkoIFwiLnN3aXRjaC15b2FzdC1zZW8gaW5wdXRcIiApLm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0aWYgKCBcImtleWRvd25cIiA9PT0gZXZlbnQudHlwZSAmJiAxMyA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0c2V0SW5pdGlhbEFjdGl2ZVRhYigpO1xuXHRcdGluaXRTZWxlY3QyKCk7XG5cdH0gKTtcbn0oKSApO1xuIiwidmFyIGNvbnRhaW5lclBvbGl0ZSwgY29udGFpbmVyQXNzZXJ0aXZlLCBwcmV2aW91c01lc3NhZ2UgPSBcIlwiO1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBsaXZlIHJlZ2lvbnMgbWFya3VwLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmlhTGl2ZSBPcHRpb25hbC4gVmFsdWUgZm9yIHRoZSBcImFyaWEtbGl2ZVwiIGF0dHJpYnV0ZSwgZGVmYXVsdCBcInBvbGl0ZVwiLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICRjb250YWluZXIgVGhlIEFSSUEgbGl2ZSByZWdpb24galF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGFkZENvbnRhaW5lciA9IGZ1bmN0aW9uKCBhcmlhTGl2ZSApIHtcblx0YXJpYUxpdmUgPSBhcmlhTGl2ZSB8fCBcInBvbGl0ZVwiO1xuXG5cdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdGNvbnRhaW5lci5pZCA9IFwiYTExeS1zcGVhay1cIiArIGFyaWFMaXZlO1xuXHRjb250YWluZXIuY2xhc3NOYW1lID0gXCJhMTF5LXNwZWFrLXJlZ2lvblwiO1xuXG5cdHZhciBzY3JlZW5SZWFkZXJUZXh0U3R5bGUgPSBcImNsaXA6IHJlY3QoMXB4LCAxcHgsIDFweCwgMXB4KTsgcG9zaXRpb246IGFic29sdXRlOyBoZWlnaHQ6IDFweDsgd2lkdGg6IDFweDsgb3ZlcmZsb3c6IGhpZGRlbjsgd29yZC13cmFwOiBub3JtYWw7XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIHByZXZpb3VzTWVzc2FnZSA9PT0gbWVzc2FnZSApIHtcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArIFwiXFx1MDBBMFwiO1xuXHR9XG5cblx0cHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iXX0=
