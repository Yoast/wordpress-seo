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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFBdEUsRUFBd0YsaUJBQXhGLEVBQTJHLHFCQUEzRyxDQUFqQjtBQUNBLEdBRkksTUFHQSxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFBdEUsQ0FBakI7QUFDQSxHQUZJLE1BR0EsSUFBSyxFQUFFLFFBQUYsQ0FBWSxpQkFBWixDQUFMLEVBQXVDO0FBQzNDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsYUFBdkIsRUFBc0MsYUFBdEMsRUFBcUQsZ0JBQXJELEVBQXVFLGlCQUF2RSxFQUEwRixxQkFBMUYsQ0FBakI7QUFDQSxHQUZJLE1BR0EsSUFBSyxFQUFFLFFBQUYsQ0FBWSxlQUFaLENBQUwsRUFBcUM7QUFDekMsb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxnQkFBdkQsRUFBeUUsaUJBQXpFLEVBQTRGLHFCQUE1RixDQUFqQjtBQUNBLEdBRkksTUFHQSxJQUFLLEVBQUUsUUFBRixDQUFZLGlCQUFaLENBQUwsRUFBdUM7QUFDM0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxpQkFBdEUsRUFBeUYscUJBQXpGLEVBQWdILENBQUUsU0FBRixDQUFoSCxDQUFqQjtBQUNBLEdBRkksTUFHQSxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxpQkFBdEUsRUFBeUYscUJBQXpGLEVBQWdILENBQUUsY0FBRixDQUFoSCxDQUFqQjtBQUNBO0FBQ0QsU0FBTyxJQUFQLENBQWEsY0FBYixFQUE2QixVQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBNEI7QUFDeEQsYUFBVSxFQUFFLElBQUYsQ0FBUSxJQUFSLElBQWlCLEdBQWpCLEdBQXVCLFFBQXZCLEdBQWtDLFVBQTVDO0FBQ0EsT0FBSyxFQUFFLEdBQUYsR0FBUSxNQUFSLENBQWdCLE9BQU8sUUFBUCxHQUFrQixJQUFsQyxNQUE2QyxDQUFDLENBQW5ELEVBQXVEO0FBQ3RELE1BQUUsUUFBRixDQUFZLGdDQUFaO0FBQ0EsUUFBSSxNQUFNLGVBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsQ0FBeUMsSUFBekMsRUFBK0MsT0FBTyxRQUFQLEdBQWtCLElBQWpFLENBQVY7QUFDQSxRQUFLLE9BQVEsTUFBTSxPQUFkLEVBQXdCLE1BQTdCLEVBQXNDO0FBQ3JDLFlBQVEsTUFBTSxPQUFkLEVBQXdCLElBQXhCLENBQThCLEdBQTlCO0FBQ0EsS0FGRCxNQUdLO0FBQ0osT0FBRSxLQUFGLENBQVMsZUFBZSxPQUFmLEdBQXlCLG1DQUF6QixHQUErRCxHQUEvRCxHQUFxRSxRQUE5RTtBQUNBOztBQUVELDZCQUFXLGVBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsQ0FBeUMsSUFBekMsRUFBK0MsUUFBL0MsQ0FBWCxFQUFzRSxXQUF0RTs7QUFFQSxXQUFPLElBQVA7QUFDQSxJQWJELE1BY0s7QUFDSixRQUFLLE9BQVEsTUFBTSxPQUFkLEVBQXdCLE1BQTdCLEVBQXNDO0FBQ3JDLFlBQVEsTUFBTSxPQUFkLEVBQXdCLE1BQXhCO0FBQ0E7QUFDRDtBQUNELEdBckJEO0FBdUJBLE1BQUssU0FBUyxLQUFkLEVBQXNCO0FBQ3JCLEtBQUUsV0FBRixDQUFlLGdDQUFmO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFVBQVMsV0FBVCxDQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxJQUF0QyxFQUE0QyxLQUE1QyxFQUFvRDtBQUNuRCxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLFdBQVEsTUFIYTtBQUlyQixhQUFVO0FBSlcsR0FBdEIsRUFLRyxVQUFVLElBQVYsRUFBaUI7QUFDbkIsT0FBSyxJQUFMLEVBQVk7QUFDWCxXQUFRLE1BQU0sSUFBZCxFQUFxQixJQUFyQjtBQUNBO0FBQ0QsR0FURDtBQVdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxzQkFBVCxDQUFpQyxLQUFqQyxFQUF5QztBQUN4QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsMkJBRGE7QUFFckI7QUFDQSxnQkFBYTtBQUhRLEdBQXRCLEVBSUksSUFKSixDQUlVLFVBQVUsUUFBVixFQUFxQjtBQUM5QixPQUFJLGtCQUFrQixPQUFRLDhCQUFSLENBQXRCO0FBQUEsT0FDQyxrQkFBa0IsT0FBUSxpQkFBUixDQURuQjs7QUFHQSxtQkFBZ0IsSUFBaEIsQ0FBc0IsU0FBUyxJQUFULENBQWMsT0FBcEM7QUFDQTtBQUNBLG1CQUFnQixJQUFoQixDQUFzQixVQUF0QixFQUFrQyxJQUFsQyxFQUF5QyxLQUF6Qzs7QUFFQSxPQUFLLFNBQVMsT0FBZCxFQUF3QjtBQUN2QixvQkFBZ0IsV0FBaEIsQ0FBNkIsY0FBN0IsRUFBOEMsUUFBOUMsQ0FBd0QsZ0JBQXhEO0FBQ0EsSUFGRCxNQUVPO0FBQ04sb0JBQWdCLFFBQWhCLENBQTBCLDRCQUExQjtBQUNBO0FBQ0QsR0FqQkQ7QUFrQkE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxpQkFBVCxHQUE2QjtBQUM1QixTQUFRLG9CQUFSLEVBQStCLEdBQS9CLENBQW9DLE9BQVEsbUJBQVIsRUFBOEIsR0FBOUIsRUFBcEM7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGVBQVQsR0FBMkI7QUFDMUIsTUFBSSxPQUFPLE9BQVEsYUFBUixDQUFYO0FBQ0EsTUFBSyxLQUFLLE1BQVYsRUFBbUI7QUFDbEIsT0FBSSxhQUFhLEtBQUssSUFBTCxDQUFXLFFBQVgsRUFBc0IsS0FBdEIsQ0FBNkIsR0FBN0IsRUFBb0MsQ0FBcEMsQ0FBakI7QUFDQSxRQUFLLElBQUwsQ0FBVyxRQUFYLEVBQXFCLGFBQWEsT0FBTyxRQUFQLENBQWdCLElBQWxEO0FBQ0E7QUFDRDs7QUFFRDs7O0FBR0EsUUFBUSxNQUFSLEVBQWlCLEVBQWpCLENBQXFCLFlBQXJCLEVBQW1DLGVBQW5DOztBQUVBOzs7OztBQUtBLFVBQVMsZUFBVCxHQUEyQjtBQUMxQixNQUFJLGFBQWEsT0FBUSxpQkFBUixDQUFqQjs7QUFFQSxTQUFPLElBQVAsQ0FDQyxPQURELEVBRUM7QUFDQyxhQUFVLFdBQVcsSUFBWCxDQUFpQiw0QkFBakIsRUFBZ0QsR0FBaEQsRUFEWDtBQUVDLGVBQVksV0FBVyxJQUFYLENBQWlCLDJCQUFqQixFQUErQyxHQUEvQyxFQUZiO0FBR0MsYUFBVSxXQUFXLElBQVgsQ0FBaUIseUJBQWpCLEVBQTZDLEdBQTdDLEVBSFg7QUFJQyxXQUFRO0FBSlQsR0FGRCxFQVFDLFVBQVUsUUFBVixFQUFxQjtBQUNwQixPQUFJLE9BQU8sT0FBTyxTQUFQLENBQWtCLFFBQWxCLENBQVg7O0FBRUEsY0FBVyxJQUFYLENBQWlCLFVBQWpCLEVBQThCLE1BQTlCOztBQUVBLFdBQVMsS0FBSyxPQUFkO0FBQ0MsU0FBSyxDQUFMOztBQUVDLGdCQUFXLElBQVgsQ0FBaUIsa0JBQWpCLEVBQXNDLEdBQXRDLENBQTJDLEVBQTNDOztBQUVBLFlBQVEsYUFBUixFQUF3QixNQUF4QixDQUFnQyxLQUFLLElBQXJDO0FBQ0EsWUFBUSxzQkFBUixFQUFpQyxJQUFqQztBQUNBO0FBQ0E7QUFDRCxTQUFLLENBQUw7QUFDQyxnQkFBVyxJQUFYLENBQWlCLFlBQWpCLEVBQWdDLE9BQWhDLENBQXlDLEtBQUssSUFBOUM7QUFDQTtBQVhGO0FBYUEsR0ExQkY7QUE0QkE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxXQUFULEdBQXVCO0FBQ3RCLE1BQUksZUFBZSxPQUFuQjs7QUFFQTtBQUNBLFNBQVEsb0JBQVIsRUFBK0IsT0FBL0IsQ0FBd0M7QUFDdkMsVUFBTyxZQURnQztBQUV2QyxhQUFVO0FBRjZCLEdBQXhDOztBQUtBO0FBQ0EsU0FBUSxvQkFBUixFQUErQixPQUEvQixDQUF3QztBQUN2QyxVQUFPLFlBRGdDO0FBRXZDLGFBQVU7QUFGNkIsR0FBeEM7O0FBS0E7QUFDQSxTQUFRLDBCQUFSLEVBQXFDLE9BQXJDLENBQThDO0FBQzdDLFVBQU8sWUFEc0M7QUFFN0MsYUFBVTtBQUZtQyxHQUE5Qzs7QUFLQTtBQUNBLFNBQVEsVUFBUixFQUFxQixPQUFyQixDQUE4QjtBQUM3QixVQUFPLFlBRHNCO0FBRTdCLGFBQVU7QUFGbUIsR0FBOUI7QUFJQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLG1CQUFULEdBQStCO0FBQzlCLE1BQUksY0FBYyxPQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsQ0FBcUIsT0FBckIsQ0FBOEIsT0FBOUIsRUFBdUMsRUFBdkMsQ0FBbEI7QUFDQTs7Ozs7O0FBTUEsTUFBSyxPQUFPLFdBQVAsSUFBc0IsUUFBUSxZQUFZLE1BQVosQ0FBb0IsQ0FBcEIsQ0FBbkMsRUFBNkQ7QUFDNUQ7Ozs7QUFJQSxpQkFBYyxPQUFRLFdBQVIsRUFBc0IsSUFBdEIsQ0FBNEIsSUFBNUIsQ0FBZDtBQUNBOztBQUVELFNBQVEsTUFBTSxXQUFkLEVBQTRCLFFBQTVCLENBQXNDLFFBQXRDO0FBQ0EsU0FBUSxNQUFNLFdBQU4sR0FBb0IsTUFBNUIsRUFBcUMsUUFBckMsQ0FBK0MsZ0JBQS9DLEVBQWtFLEtBQWxFO0FBQ0E7O0FBRUQsUUFBTyx5QkFBUCxHQUFtQyx5QkFBbkM7QUFDQSxRQUFPLFdBQVAsR0FBcUIsV0FBckI7QUFDQSxRQUFPLHNCQUFQLEdBQWdDLHNCQUFoQztBQUNBLFFBQU8saUJBQVAsR0FBMkIsaUJBQTNCO0FBQ0E7QUFDQSxRQUFPLGVBQVAsR0FBeUIsZUFBekI7QUFDQSxRQUFPLGtCQUFQLEdBQTRCLGVBQTVCO0FBQ0EsUUFBTyxlQUFQLEdBQXlCLGVBQXpCOztBQUVBLFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQixZQUFXO0FBQ3BDOzs7QUFHQTs7QUFFQTtBQUNBLFNBQVEscUNBQVIsRUFBZ0QsTUFBaEQsQ0FBd0QsWUFBVztBQUNsRTtBQUNBLE9BQUssT0FBUSxJQUFSLEVBQWUsRUFBZixDQUFtQixVQUFuQixDQUFMLEVBQXVDO0FBQ3RDLFdBQVEsdUNBQVIsRUFBa0QsTUFBbEQsQ0FBMEQsT0FBUSxJQUFSLEVBQWUsR0FBZixPQUF5QixLQUFuRjtBQUNBO0FBQ0QsR0FMRCxFQUtJLE1BTEo7O0FBT0E7QUFDQSxTQUFRLG1DQUFSLEVBQThDLE1BQTlDLENBQXNELFlBQVc7QUFDaEU7QUFDQSxPQUFLLE9BQVEsSUFBUixFQUFlLEVBQWYsQ0FBbUIsVUFBbkIsQ0FBTCxFQUF1QztBQUN0QyxXQUFRLHFDQUFSLEVBQWdELE1BQWhELENBQXdELE9BQVEsSUFBUixFQUFlLEdBQWYsT0FBeUIsS0FBakY7QUFDQTtBQUNELEdBTEQsRUFLSSxNQUxKOztBQU9BO0FBQ0EsU0FBUSxzQkFBUixFQUFpQyxNQUFqQyxDQUF5QyxZQUFXO0FBQ25ELFVBQVEsMkJBQVIsRUFBc0MsTUFBdEMsQ0FBOEMsT0FBUSxJQUFSLEVBQWUsRUFBZixDQUFtQixnQkFBbkIsQ0FBOUM7QUFDQSxHQUZELEVBRUksTUFGSjs7QUFJQTtBQUNBLFNBQVEscUJBQVIsRUFBZ0MsTUFBaEMsQ0FBd0MsWUFBVztBQUNsRCxVQUFRLGtCQUFSLEVBQTZCLE1BQTdCLENBQXFDLE9BQVEsSUFBUixFQUFlLEVBQWYsQ0FBbUIsVUFBbkIsQ0FBckM7QUFDQSxHQUZELEVBRUksTUFGSjs7QUFJQTtBQUNBLFNBQVEsYUFBUixFQUF3QixJQUF4QixDQUE4QixHQUE5QixFQUFvQyxLQUFwQyxDQUEyQyxZQUFXO0FBQ3JELFVBQVEsYUFBUixFQUF3QixJQUF4QixDQUE4QixHQUE5QixFQUFvQyxXQUFwQyxDQUFpRCxnQkFBakQ7QUFDQSxVQUFRLFdBQVIsRUFBc0IsV0FBdEIsQ0FBbUMsUUFBbkM7O0FBRUEsT0FBSSxLQUFLLE9BQVEsSUFBUixFQUFlLElBQWYsQ0FBcUIsSUFBckIsRUFBNEIsT0FBNUIsQ0FBcUMsTUFBckMsRUFBNkMsRUFBN0MsQ0FBVDtBQUNBLFVBQVEsTUFBTSxFQUFkLEVBQW1CLFFBQW5CLENBQTZCLFFBQTdCO0FBQ0EsVUFBUSxJQUFSLEVBQWUsUUFBZixDQUF5QixnQkFBekI7QUFDQSxHQVBEOztBQVNBO0FBQ0EsU0FBUSxvQkFBUixFQUErQixNQUEvQixDQUF1QyxZQUFXO0FBQ2pELE9BQUksa0JBQWtCLE9BQVEsSUFBUixFQUFlLEdBQWYsRUFBdEI7QUFDQSxPQUFLLGNBQWMsZUFBbkIsRUFBcUM7QUFDcEMsV0FBUSwwQkFBUixFQUFxQyxJQUFyQztBQUNBLFdBQVEseUJBQVIsRUFBb0MsSUFBcEM7QUFDQSxJQUhELE1BSUssSUFBSyxhQUFhLGVBQWxCLEVBQW9DO0FBQ3hDLFdBQVEsMEJBQVIsRUFBcUMsSUFBckM7QUFDQSxXQUFRLHlCQUFSLEVBQW9DLElBQXBDO0FBQ0EsSUFISSxNQUlBO0FBQ0osV0FBUSwwQkFBUixFQUFxQyxJQUFyQztBQUNBLFdBQVEseUJBQVIsRUFBb0MsSUFBcEM7QUFDQTtBQUNELEdBZEQsRUFjSSxNQWRKOztBQWdCQTtBQUNBLFNBQVEsV0FBUixFQUFzQixNQUF0QixDQUE4QixZQUFXO0FBQ3hDLDZCQUEyQixPQUFRLElBQVIsQ0FBM0I7QUFDQSxHQUZELEVBRUksTUFGSjs7QUFJQTtBQUNBLFNBQVEseUJBQVIsRUFBb0MsRUFBcEMsQ0FBd0MsT0FBeEMsRUFBaUQsWUFBVztBQUMzRCwwQkFBd0IsT0FBUSxJQUFSLEVBQWUsSUFBZixDQUFxQixPQUFyQixDQUF4QjtBQUNBLEdBRkQ7O0FBSUE7QUFDQSxTQUFRLHlCQUFSLEVBQW9DLEVBQXBDLENBQXdDLFNBQXhDLEVBQW1ELFVBQVUsS0FBVixFQUFrQjtBQUNwRSxPQUFLLGNBQWMsTUFBTSxJQUFwQixJQUE0QixPQUFPLE1BQU0sS0FBOUMsRUFBc0Q7QUFDckQsVUFBTSxjQUFOO0FBQ0E7QUFDRCxHQUpEOztBQU1BO0FBQ0E7QUFDQSxFQTlFRDtBQStFQSxDQTVVQyxHQUFGLEMsQ0FKQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cHNlb0FkbWluTDEwbiwgYWpheHVybCwgdGJfcmVtb3ZlLCB3cHNlb1NlbGVjdDJMb2NhbGUgKi9cblxuaW1wb3J0IGExMXlTcGVhayBmcm9tIFwiYTExeS1zcGVha1wiO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvKipcblx0ICogRGV0ZWN0cyB0aGUgd3JvbmcgdXNlIG9mIHZhcmlhYmxlcyBpbiB0aXRsZSBhbmQgZGVzY3JpcHRpb24gdGVtcGxhdGVzXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZWxlbWVudH0gZSBUaGUgZWxlbWVudCB0byB2ZXJpZnkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggZSApIHtcblx0XHR2YXIgd2FybiA9IGZhbHNlO1xuXHRcdHZhciBlcnJvcklkID0gXCJcIjtcblx0XHR2YXIgd3JvbmdWYXJpYWJsZXMgPSBbXTtcblx0XHR2YXIgYXV0aG9yVmFyaWFibGVzID0gWyBcInVzZXJpZFwiLCBcIm5hbWVcIiwgXCJ1c2VyX2Rlc2NyaXB0aW9uXCIgXTtcblx0XHR2YXIgZGF0ZVZhcmlhYmxlcyA9IFsgXCJkYXRlXCIgXTtcblx0XHR2YXIgcG9zdFZhcmlhYmxlcyA9IFsgXCJ0aXRsZVwiLCBcInBhcmVudF90aXRsZVwiLCBcImV4Y2VycHRcIiwgXCJleGNlcnB0X29ubHlcIiwgXCJjYXB0aW9uXCIsIFwiZm9jdXNrd1wiLCBcInB0X3NpbmdsZVwiLCBcInB0X3BsdXJhbFwiLCBcIm1vZGlmaWVkXCIsIFwiaWRcIiBdO1xuXHRcdHZhciBzcGVjaWFsVmFyaWFibGVzID0gWyBcInRlcm00MDRcIiwgXCJzZWFyY2hwaHJhc2VcIiBdO1xuXHRcdHZhciB0YXhvbm9teVZhcmlhYmxlcyA9IFsgXCJ0ZXJtX3RpdGxlXCIsIFwidGVybV9kZXNjcmlwdGlvblwiIF07XG5cdFx0dmFyIHRheG9ub215UG9zdFZhcmlhYmxlcyA9IFsgXCJjYXRlZ29yeVwiLCBcImNhdGVnb3J5X2Rlc2NyaXB0aW9uXCIsIFwidGFnXCIsIFwidGFnX2Rlc2NyaXB0aW9uXCIgXTtcblx0XHRpZiAoIGUuaGFzQ2xhc3MoIFwicG9zdHR5cGUtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImhvbWVwYWdlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwidGF4b25vbXktdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJhdXRob3ItdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIHBvc3RWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiZGF0ZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcInNlYXJjaC10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzLCBbIFwidGVybTQwNFwiIF0gKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiZXJyb3I0MDQtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcywgWyBcInNlYXJjaHBocmFzZVwiIF0gKTtcblx0XHR9XG5cdFx0alF1ZXJ5LmVhY2goIHdyb25nVmFyaWFibGVzLCBmdW5jdGlvbiggaW5kZXgsIHZhcmlhYmxlICkge1xuXHRcdFx0ZXJyb3JJZCA9IGUuYXR0ciggXCJpZFwiICkgKyBcIi1cIiArIHZhcmlhYmxlICsgXCItd2FybmluZ1wiO1xuXHRcdFx0aWYgKCBlLnZhbCgpLnNlYXJjaCggXCIlJVwiICsgdmFyaWFibGUgKyBcIiUlXCIgKSAhPT0gLTEgKSB7XG5cdFx0XHRcdGUuYWRkQ2xhc3MoIFwid3BzZW8tdmFyaWFibGUtd2FybmluZy1lbGVtZW50XCIgKTtcblx0XHRcdFx0dmFyIG1zZyA9IHdwc2VvQWRtaW5MMTBuLnZhcmlhYmxlX3dhcm5pbmcucmVwbGFjZSggXCIlc1wiLCBcIiUlXCIgKyB2YXJpYWJsZSArIFwiJSVcIiApO1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkuaHRtbCggbXNnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZS5hZnRlciggJyA8ZGl2IGlkPVwiJyArIGVycm9ySWQgKyAnXCIgY2xhc3M9XCJ3cHNlby12YXJpYWJsZS13YXJuaW5nXCI+JyArIG1zZyArIFwiPC9kaXY+XCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGExMXlTcGVhayggd3BzZW9BZG1pbkwxMG4udmFyaWFibGVfd2FybmluZy5yZXBsYWNlKCBcIiVzXCIsIHZhcmlhYmxlICksIFwiYXNzZXJ0aXZlXCIgKTtcblxuXHRcdFx0XHR3YXJuID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAoIGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBlcnJvcklkICkucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0XHRpZiAoIHdhcm4gPT09IGZhbHNlICkge1xuXHRcdFx0ZS5yZW1vdmVDbGFzcyggXCJ3cHNlby12YXJpYWJsZS13YXJuaW5nLWVsZW1lbnRcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIGEgc3BlY2lmaWMgV1Agb3B0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb24gVGhlIG9wdGlvbiB0byB1cGRhdGUuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuZXd2YWwgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIG9wdGlvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGUgICBUaGUgSUQgb2YgdGhlIGVsZW1lbnQgdG8gaGlkZSBvbiBzdWNjZXNzLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgIFRoZSBub25jZSBmb3IgdGhlIGFjdGlvbi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRXUE9wdGlvbiggb3B0aW9uLCBuZXd2YWwsIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X29wdGlvblwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRuZXd2YWw6IG5ld3ZhbCxcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogRG8gdGhlIGtpbGwgYmxvY2tpbmcgZmlsZXMgYWN0aW9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSBOb25jZSB0byB2YWxpZGF0ZSByZXF1ZXN0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvS2lsbEJsb2NraW5nRmlsZXMoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fa2lsbF9ibG9ja2luZ19maWxlc1wiLFxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdFx0XHRfYWpheF9ub25jZTogbm9uY2UsXG5cdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdHZhciBub3RpY2VDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LW5vdGljZS1ibG9ja2luZy1maWxlc1wiICksXG5cdFx0XHRcdG5vdGljZVBhcmFncmFwaCA9IGpRdWVyeSggXCIjYmxvY2tpbmdfZmlsZXNcIiApO1xuXG5cdFx0XHRub3RpY2VQYXJhZ3JhcGguaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHQvLyBNYWtlIHRoZSBub3RpY2UgZm9jdXNhYmxlIGFuZCBtb3ZlIGZvY3VlIG9uIGl0IHNvIHNjcmVlbiByZWFkZXJzIHdpbGwgcmVhZCBvdXQgaXRzIGNvbnRlbnQuXG5cdFx0XHRub3RpY2VDb250YWluZXIuYXR0ciggXCJ0YWJpbmRleFwiLCBcIi0xXCIgKS5mb2N1cygpO1xuXG5cdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgKSB7XG5cdFx0XHRcdG5vdGljZUNvbnRhaW5lci5yZW1vdmVDbGFzcyggXCJub3RpY2UtZXJyb3JcIiApLmFkZENsYXNzKCBcIm5vdGljZS1zdWNjZXNzXCIgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vdGljZUNvbnRhaW5lci5hZGRDbGFzcyggXCJ5b2FzdC1ibG9ja2luZy1maWxlcy1lcnJvclwiICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvcGllcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBmb3IgdGhlIGhvbWVwYWdlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9Db3B5SG9tZU1ldGEoKSB7XG5cdFx0alF1ZXJ5KCBcIiNvZ19mcm9udHBhZ2VfZGVzY1wiICkudmFsKCBqUXVlcnkoIFwiI21ldGFfZGVzY3JpcHRpb25cIiApLnZhbCgpICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgc3VyZSB3ZSBzdG9yZSB0aGUgYWN0aW9uIGhhc2ggc28gd2UgY2FuIHJldHVybiB0byB0aGUgcmlnaHQgaGFzaFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0VGFiSGFzaCgpIHtcblx0XHR2YXIgY29uZiA9IGpRdWVyeSggXCIjd3BzZW8tY29uZlwiICk7XG5cdFx0aWYgKCBjb25mLmxlbmd0aCApIHtcblx0XHRcdHZhciBjdXJyZW50VXJsID0gY29uZi5hdHRyKCBcImFjdGlvblwiICkuc3BsaXQoIFwiI1wiIClbIDAgXTtcblx0XHRcdGNvbmYuYXR0ciggXCJhY3Rpb25cIiwgY3VycmVudFVybCArIHdpbmRvdy5sb2NhdGlvbi5oYXNoICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2hcblx0ICovXG5cdGpRdWVyeSggd2luZG93ICkub24oIFwiaGFzaGNoYW5nZVwiLCB3cHNlb1NldFRhYkhhc2ggKTtcblxuXHQvKipcblx0ICogQWRkIGEgRmFjZWJvb2sgYWRtaW4gZm9yIHZpYSBBSkFYLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQWRkRmJBZG1pbigpIHtcblx0XHR2YXIgdGFyZ2V0Rm9ybSA9IGpRdWVyeSggXCIjVEJfYWpheENvbnRlbnRcIiApO1xuXG5cdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRhamF4dXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRfd3Bub25jZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbm9uY2VdXCIgKS52YWwoKSxcblx0XHRcdFx0YWRtaW5fbmFtZTogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5fbmFtZV1cIiApLnZhbCgpLFxuXHRcdFx0XHRhZG1pbl9pZDogdGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W25hbWU9ZmJfYWRtaW5faWRdXCIgKS52YWwoKSxcblx0XHRcdFx0YWN0aW9uOiBcIndwc2VvX2FkZF9mYl9hZG1pblwiLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0dmFyIHJlc3AgPSBqUXVlcnkucGFyc2VKU09OKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCJwLm5vdGljZVwiICkucmVtb3ZlKCk7XG5cblx0XHRcdFx0c3dpdGNoICggcmVzcC5zdWNjZXNzICkge1xuXHRcdFx0XHRcdGNhc2UgMTpcblxuXHRcdFx0XHRcdFx0dGFyZ2V0Rm9ybS5maW5kKCBcImlucHV0W3R5cGU9dGV4dF1cIiApLnZhbCggXCJcIiApO1xuXG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI3VzZXJfYWRtaW5cIiApLmFwcGVuZCggcmVzcC5odG1sICk7XG5cdFx0XHRcdFx0XHRqUXVlcnkoIFwiI2Nvbm5lY3RlZF9mYl9hZG1pbnNcIiApLnNob3coKTtcblx0XHRcdFx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAwIDpcblx0XHRcdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCIuZm9ybS13cmFwXCIgKS5wcmVwZW5kKCByZXNwLmh0bWwgKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIHNlbGVjdDIgZm9yIHNlbGVjdGVkIGZpZWxkcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHR2YXIgc2VsZWN0MldpZHRoID0gXCI0MDBweFwiO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgR2VuZXJhbCBzZXR0aW5nczogeW91ciBpbmZvOiBjb21wYW55IG9yIHBlcnNvbi4gV2lkdGggaXMgdGhlIHNhbWUgYXMgdGhlIHdpZHRoIGZvciB0aGUgb3RoZXIgZmllbGRzIG9uIHRoaXMgcGFnZS5cblx0XHRqUXVlcnkoIFwiI2NvbXBhbnlfb3JfcGVyc29uXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBUd2l0dGVyIGNhcmQgbWV0YSBkYXRhIGluIFNldHRpbmdzXG5cdFx0alF1ZXJ5KCBcIiN0d2l0dGVyX2NhcmRfdHlwZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgdGF4b25vbXkgYnJlYWRjcnVtYnMgaW4gQWR2YW5jZWRcblx0XHRqUXVlcnkoIFwiI3Bvc3RfdHlwZXMtcG9zdC1tYWludGF4XCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cblx0XHQvLyBTZWxlY3QyIGZvciBwcm9maWxlIGluIFNlYXJjaCBDb25zb2xlXG5cdFx0alF1ZXJ5KCBcIiNwcm9maWxlXCIgKS5zZWxlY3QyKCB7XG5cdFx0XHR3aWR0aDogc2VsZWN0MldpZHRoLFxuXHRcdFx0bGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSxcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBpbml0aWFsIGFjdGl2ZSB0YWIgaW4gdGhlIHNldHRpbmdzIHBhZ2VzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEluaXRpYWxBY3RpdmVUYWIoKSB7XG5cdFx0dmFyIGFjdGl2ZVRhYklkID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSggXCIjdG9wI1wiLCBcIlwiICk7XG5cdFx0Lypcblx0XHQgKiBXb3JkUHJlc3MgdXNlcyBmcmFnbWVudCBpZGVudGlmaWVycyBmb3IgaXRzIG93biBpbi1wYWdlIGxpbmtzLCBlLmcuXG5cdFx0ICogYCN3cGJvZHktY29udGVudGAgYW5kIG90aGVyIHBsdWdpbnMgbWF5IGRvIHRoYXQgYXMgd2VsbC4gQWxzbywgZmFjZWJvb2tcblx0XHQgKiBhZGRzIGEgYCNfPV9gIHNlZSBQUiA1MDYuIEluIHRoZXNlIGNhc2VzIGFuZCB3aGVuIGl0J3MgZW1wdHksIGRlZmF1bHRcblx0XHQgKiB0byB0aGUgZmlyc3QgdGFiLlxuXHRcdCAqL1xuXHRcdGlmICggXCJcIiA9PT0gYWN0aXZlVGFiSWQgfHwgXCIjXCIgPT09IGFjdGl2ZVRhYklkLmNoYXJBdCggMCApICkge1xuXHRcdFx0Lypcblx0XHRcdCAqIFJlbWluZGVyOiBqUXVlcnkgYXR0cigpIGdldHMgdGhlIGF0dHJpYnV0ZSB2YWx1ZSBmb3Igb25seSB0aGUgZmlyc3Rcblx0XHRcdCAqIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0IHNvIHRoaXMgd2lsbCBhbHdheXMgYmUgdGhlIGZpcnN0IHRhYiBpZC5cblx0XHRcdCAqL1xuXHRcdFx0YWN0aXZlVGFiSWQgPSBqUXVlcnkoIFwiLndwc2VvdGFiXCIgKS5hdHRyKCBcImlkXCIgKTtcblx0XHR9XG5cblx0XHRqUXVlcnkoIFwiI1wiICsgYWN0aXZlVGFiSWQgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdGpRdWVyeSggXCIjXCIgKyBhY3RpdmVUYWJJZCArIFwiLXRhYlwiICkuYWRkQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApLmNsaWNrKCk7XG5cdH1cblxuXHR3aW5kb3cud3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyA9IHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXM7XG5cdHdpbmRvdy5zZXRXUE9wdGlvbiA9IHNldFdQT3B0aW9uO1xuXHR3aW5kb3cud3BzZW9LaWxsQmxvY2tpbmdGaWxlcyA9IHdwc2VvS2lsbEJsb2NraW5nRmlsZXM7XG5cdHdpbmRvdy53cHNlb0NvcHlIb21lTWV0YSA9IHdwc2VvQ29weUhvbWVNZXRhO1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0d2luZG93Lndwc2VvQWRkRmJBZG1pbiA9IHdwc2VvQWRkRmJBZG1pbjtcblx0d2luZG93Lndwc2VvX2FkZF9mYl9hZG1pbiA9IHdwc2VvQWRkRmJBZG1pbjtcblx0d2luZG93Lndwc2VvU2V0VGFiSGFzaCA9IHdwc2VvU2V0VGFiSGFzaDtcblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdC8qKlxuXHRcdCAqIFdoZW4gdGhlIGhhc2ggY2hhbmdlcywgZ2V0IHRoZSBiYXNlIHVybCBmcm9tIHRoZSBhY3Rpb24gYW5kIHRoZW4gYWRkIHRoZSBjdXJyZW50IGhhc2guXG5cdFx0ICovXG5cdFx0d3BzZW9TZXRUYWJIYXNoKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEF1dGhvciBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1hdXRob3IgaW5wdXRbdHlwZT0ncmFkaW8nXVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRoZSB2YWx1ZSBvbiBpcyBkaXNhYmxlZCwgb2ZmIGlzIGVuYWJsZWQuXG5cdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNhdXRob3ItYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIERhdGUgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtZGF0ZSBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2RhdGUtYXJjaGl2ZXMtdGl0bGVzLW1ldGFzLWNvbnRlbnRcIiApLnRvZ2dsZSggalF1ZXJ5KCB0aGlzICkudmFsKCkgPT09IFwib2ZmXCIgKTtcblx0XHRcdH1cblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEZvcm1hdC1iYXNlZCBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1wb3N0X2Zvcm1hdFwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjcG9zdF9mb3JtYXQtdGl0bGVzLW1ldGFzXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpub3QoOmNoZWNrZWQpXCIgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgQnJlYWRjcnVtYnMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2JyZWFkY3J1bWJzLWVuYWJsZVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjYnJlYWRjcnVtYnNpbmZvXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLmlzKCBcIjpjaGVja2VkXCIgKSApO1xuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIEhhbmRsZSB0aGUgc2V0dGluZ3MgcGFnZXMgdGFicy5cblx0XHRqUXVlcnkoIFwiI3dwc2VvLXRhYnNcIiApLmZpbmQoIFwiYVwiICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBcIiN3cHNlby10YWJzXCIgKS5maW5kKCBcImFcIiApLnJlbW92ZUNsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKTtcblx0XHRcdGpRdWVyeSggXCIud3BzZW90YWJcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdHZhciBpZCA9IGpRdWVyeSggdGhpcyApLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiLXRhYlwiLCBcIlwiICk7XG5cdFx0XHRqUXVlcnkoIFwiI1wiICsgaWQgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIFwibmF2LXRhYi1hY3RpdmVcIiApO1xuXHRcdH0gKTtcblxuXHRcdC8vIEhhbmRsZSB0aGUgQ29tcGFueSBvciBQZXJzb24gc2VsZWN0LlxuXHRcdGpRdWVyeSggXCIjY29tcGFueV9vcl9wZXJzb25cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY29tcGFueU9yUGVyc29uID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cdFx0XHRpZiAoIFwiY29tcGFueVwiID09PSBjb21wYW55T3JQZXJzb24gKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLnNob3coKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggXCJwZXJzb25cIiA9PT0gY29tcGFueU9yUGVyc29uICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuc2hvdygpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLWNvbXBhbnlcIiApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtcGVyc29uXCIgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gQ2hlY2sgY29ycmVjdCB2YXJpYWJsZXMgdXNhZ2UgaW4gdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRlbXBsYXRlcy5cblx0XHRqUXVlcnkoIFwiLnRlbXBsYXRlXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0d3BzZW9EZXRlY3RXcm9uZ1ZhcmlhYmxlcyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBYTUwgc2l0ZW1hcHMgXCJGaXggaXRcIiBidXR0b24uXG5cdFx0alF1ZXJ5KCBcIiNibG9ja2luZ19maWxlcyAuYnV0dG9uXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHdwc2VvS2lsbEJsb2NraW5nRmlsZXMoIGpRdWVyeSggdGhpcyApLmRhdGEoIFwibm9uY2VcIiApICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gUHJldmVudCBmb3JtIHN1Ym1pc3Npb24gd2hlbiBwcmVzc2luZyBFbnRlciBvbiB0aGUgc3dpdGNoLXRvZ2dsZXMuXG5cdFx0alF1ZXJ5KCBcIi5zd2l0Y2gteW9hc3Qtc2VvIGlucHV0XCIgKS5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGlmICggXCJrZXlkb3duXCIgPT09IGV2ZW50LnR5cGUgJiYgMTMgPT09IGV2ZW50LndoaWNoICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHNldEluaXRpYWxBY3RpdmVUYWIoKTtcblx0XHRpbml0U2VsZWN0MigpO1xuXHR9ICk7XG59KCkgKTtcbiIsInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuIl19
