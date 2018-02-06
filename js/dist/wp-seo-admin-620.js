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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7Ozs7OztBQUVFLGFBQVc7QUFDWjs7QUFFQTs7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLENBQXBDLEVBQXdDO0FBQ3ZDLE1BQUksT0FBTyxLQUFYO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksa0JBQWtCLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0Isa0JBQXBCLENBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxNQUFGLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsQ0FBRSxPQUFGLEVBQVcsY0FBWCxFQUEyQixTQUEzQixFQUFzQyxjQUF0QyxFQUFzRCxTQUF0RCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixXQUF6RixFQUFzRyxVQUF0RyxFQUFrSCxJQUFsSCxDQUFwQjtBQUNBLE1BQUksbUJBQW1CLENBQUUsU0FBRixFQUFhLGNBQWIsQ0FBdkI7QUFDQSxNQUFJLG9CQUFvQixDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCLENBQXhCO0FBQ0EsTUFBSSx3QkFBd0IsQ0FBRSxVQUFGLEVBQWMsc0JBQWQsRUFBc0MsS0FBdEMsRUFBNkMsaUJBQTdDLENBQTVCO0FBQ0EsTUFBSyxFQUFFLFFBQUYsQ0FBWSxtQkFBWixDQUFMLEVBQXlDO0FBQ3hDLG9CQUFpQixlQUFlLE1BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUFqQjtBQUNBLEdBRkQsTUFHSyxJQUFLLEVBQUUsUUFBRixDQUFZLG1CQUFaLENBQUwsRUFBeUM7QUFDN0Msb0JBQWlCLGVBQWUsTUFBZixDQUF1QixlQUF2QixFQUF3QyxhQUF4QyxFQUF1RCxhQUF2RCxFQUFzRSxnQkFB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LEdBZEQsRUFjSSxNQWRKOztBQWdCQTtBQUNBLFNBQVEsV0FBUixFQUFzQixNQUF0QixDQUE4QixZQUFXO0FBQ3hDLDZCQUEyQixPQUFRLElBQVIsQ0FBM0I7QUFDQSxHQUZELEVBRUksTUFGSjs7QUFJQTtBQUNBLFNBQVEseUJBQVIsRUFBb0MsRUFBcEMsQ0FBd0MsU0FBeEMsRUFBbUQsVUFBVSxLQUFWLEVBQWtCO0FBQ3BFLE9BQUssY0FBYyxNQUFNLElBQXBCLElBQTRCLE9BQU8sTUFBTSxLQUE5QyxFQUFzRDtBQUNyRCxVQUFNLGNBQU47QUFDQTtBQUNELEdBSkQ7O0FBTUE7QUFDQTtBQUNBLEVBakZEO0FBa0ZBLENBbFRDLEdBQUYsQyxDQUpBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHdwc2VvQWRtaW5MMTBuLCBhamF4dXJsLCB0Yl9yZW1vdmUsIHdwc2VvU2VsZWN0MkxvY2FsZSAqL1xuXG5pbXBvcnQgYTExeVNwZWFrIGZyb20gXCJhMTF5LXNwZWFrXCI7XG5cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8qKlxuXHQgKiBEZXRlY3RzIHRoZSB3cm9uZyB1c2Ugb2YgdmFyaWFibGVzIGluIHRpdGxlIGFuZCBkZXNjcmlwdGlvbiB0ZW1wbGF0ZXNcblx0ICpcblx0ICogQHBhcmFtIHtlbGVtZW50fSBlIFRoZSBlbGVtZW50IHRvIHZlcmlmeS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzKCBlICkge1xuXHRcdHZhciB3YXJuID0gZmFsc2U7XG5cdFx0dmFyIGVycm9ySWQgPSBcIlwiO1xuXHRcdHZhciB3cm9uZ1ZhcmlhYmxlcyA9IFtdO1xuXHRcdHZhciBhdXRob3JWYXJpYWJsZXMgPSBbIFwidXNlcmlkXCIsIFwibmFtZVwiLCBcInVzZXJfZGVzY3JpcHRpb25cIiBdO1xuXHRcdHZhciBkYXRlVmFyaWFibGVzID0gWyBcImRhdGVcIiBdO1xuXHRcdHZhciBwb3N0VmFyaWFibGVzID0gWyBcInRpdGxlXCIsIFwicGFyZW50X3RpdGxlXCIsIFwiZXhjZXJwdFwiLCBcImV4Y2VycHRfb25seVwiLCBcImNhcHRpb25cIiwgXCJmb2N1c2t3XCIsIFwicHRfc2luZ2xlXCIsIFwicHRfcGx1cmFsXCIsIFwibW9kaWZpZWRcIiwgXCJpZFwiIF07XG5cdFx0dmFyIHNwZWNpYWxWYXJpYWJsZXMgPSBbIFwidGVybTQwNFwiLCBcInNlYXJjaHBocmFzZVwiIF07XG5cdFx0dmFyIHRheG9ub215VmFyaWFibGVzID0gWyBcInRlcm1fdGl0bGVcIiwgXCJ0ZXJtX2Rlc2NyaXB0aW9uXCIgXTtcblx0XHR2YXIgdGF4b25vbXlQb3N0VmFyaWFibGVzID0gWyBcImNhdGVnb3J5XCIsIFwiY2F0ZWdvcnlfZGVzY3JpcHRpb25cIiwgXCJ0YWdcIiwgXCJ0YWdfZGVzY3JpcHRpb25cIiBdO1xuXHRcdGlmICggZS5oYXNDbGFzcyggXCJwb3N0dHlwZS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwiaG9tZXBhZ2UtdGVtcGxhdGVcIiApICkge1xuXHRcdFx0d3JvbmdWYXJpYWJsZXMgPSB3cm9uZ1ZhcmlhYmxlcy5jb25jYXQoIGF1dGhvclZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgcG9zdFZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJ0YXhvbm9teS10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCBzcGVjaWFsVmFyaWFibGVzICk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCBlLmhhc0NsYXNzKCBcImF1dGhvci10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggcG9zdFZhcmlhYmxlcywgZGF0ZVZhcmlhYmxlcywgc3BlY2lhbFZhcmlhYmxlcywgdGF4b25vbXlWYXJpYWJsZXMsIHRheG9ub215UG9zdFZhcmlhYmxlcyApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJkYXRlLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHNwZWNpYWxWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMgKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIGUuaGFzQ2xhc3MoIFwic2VhcmNoLXRlbXBsYXRlXCIgKSApIHtcblx0XHRcdHdyb25nVmFyaWFibGVzID0gd3JvbmdWYXJpYWJsZXMuY29uY2F0KCBhdXRob3JWYXJpYWJsZXMsIGRhdGVWYXJpYWJsZXMsIHBvc3RWYXJpYWJsZXMsIHRheG9ub215VmFyaWFibGVzLCB0YXhvbm9teVBvc3RWYXJpYWJsZXMsIFsgXCJ0ZXJtNDA0XCIgXSApO1xuXHRcdH1cblx0XHRlbHNlIGlmICggZS5oYXNDbGFzcyggXCJlcnJvcjQwNC10ZW1wbGF0ZVwiICkgKSB7XG5cdFx0XHR3cm9uZ1ZhcmlhYmxlcyA9IHdyb25nVmFyaWFibGVzLmNvbmNhdCggYXV0aG9yVmFyaWFibGVzLCBkYXRlVmFyaWFibGVzLCBwb3N0VmFyaWFibGVzLCB0YXhvbm9teVZhcmlhYmxlcywgdGF4b25vbXlQb3N0VmFyaWFibGVzLCBbIFwic2VhcmNocGhyYXNlXCIgXSApO1xuXHRcdH1cblx0XHRqUXVlcnkuZWFjaCggd3JvbmdWYXJpYWJsZXMsIGZ1bmN0aW9uKCBpbmRleCwgdmFyaWFibGUgKSB7XG5cdFx0XHRlcnJvcklkID0gZS5hdHRyKCBcImlkXCIgKSArIFwiLVwiICsgdmFyaWFibGUgKyBcIi13YXJuaW5nXCI7XG5cdFx0XHRpZiAoIGUudmFsKCkuc2VhcmNoKCBcIiUlXCIgKyB2YXJpYWJsZSArIFwiJSVcIiApICE9PSAtMSApIHtcblx0XHRcdFx0ZS5hZGRDbGFzcyggXCJ3cHNlby12YXJpYWJsZS13YXJuaW5nLWVsZW1lbnRcIiApO1xuXHRcdFx0XHR2YXIgbXNnID0gd3BzZW9BZG1pbkwxMG4udmFyaWFibGVfd2FybmluZy5yZXBsYWNlKCBcIiVzXCIsIFwiJSVcIiArIHZhcmlhYmxlICsgXCIlJVwiICk7XG5cdFx0XHRcdGlmICggalF1ZXJ5KCBcIiNcIiArIGVycm9ySWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGVycm9ySWQgKS5odG1sKCBtc2cgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRlLmFmdGVyKCAnIDxkaXYgaWQ9XCInICsgZXJyb3JJZCArICdcIiBjbGFzcz1cIndwc2VvLXZhcmlhYmxlLXdhcm5pbmdcIj4nICsgbXNnICsgXCI8L2Rpdj5cIiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YTExeVNwZWFrKCB3cHNlb0FkbWluTDEwbi52YXJpYWJsZV93YXJuaW5nLnJlcGxhY2UoIFwiJXNcIiwgdmFyaWFibGUgKSwgXCJhc3NlcnRpdmVcIiApO1xuXG5cdFx0XHRcdHdhcm4gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmICggalF1ZXJ5KCBcIiNcIiArIGVycm9ySWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGVycm9ySWQgKS5yZW1vdmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHRcdGlmICggd2FybiA9PT0gZmFsc2UgKSB7XG5cdFx0XHRlLnJlbW92ZUNsYXNzKCBcIndwc2VvLXZhcmlhYmxlLXdhcm5pbmctZWxlbWVudFwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgYSBzcGVjaWZpYyBXUCBvcHRpb25cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbiBUaGUgb3B0aW9uIHRvIHVwZGF0ZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5ld3ZhbCBUaGUgbmV3IHZhbHVlIGZvciB0aGUgb3B0aW9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaGlkZSAgIFRoZSBJRCBvZiB0aGUgZWxlbWVudCB0byBoaWRlIG9uIHN1Y2Nlc3MuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSAgVGhlIG5vbmNlIGZvciB0aGUgYWN0aW9uLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFdQT3B0aW9uKCBvcHRpb24sIG5ld3ZhbCwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19zZXRfb3B0aW9uXCIsXG5cdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdG5ld3ZhbDogbmV3dmFsLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0aWYgKCBkYXRhICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgaGlkZSApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb3BpZXMgdGhlIG1ldGEgZGVzY3JpcHRpb24gZm9yIHRoZSBob21lcGFnZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvQ29weUhvbWVNZXRhKCkge1xuXHRcdGpRdWVyeSggXCIjb2dfZnJvbnRwYWdlX2Rlc2NcIiApLnZhbCggalF1ZXJ5KCBcIiNtZXRhX2Rlc2NyaXB0aW9uXCIgKS52YWwoKSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHN1cmUgd2Ugc3RvcmUgdGhlIGFjdGlvbiBoYXNoIHNvIHdlIGNhbiByZXR1cm4gdG8gdGhlIHJpZ2h0IGhhc2hcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb1NldFRhYkhhc2goKSB7XG5cdFx0dmFyIGNvbmYgPSBqUXVlcnkoIFwiI3dwc2VvLWNvbmZcIiApO1xuXHRcdGlmICggY29uZi5sZW5ndGggKSB7XG5cdFx0XHR2YXIgY3VycmVudFVybCA9IGNvbmYuYXR0ciggXCJhY3Rpb25cIiApLnNwbGl0KCBcIiNcIiApWyAwIF07XG5cdFx0XHRjb25mLmF0dHIoIFwiYWN0aW9uXCIsIGN1cnJlbnRVcmwgKyB3aW5kb3cubG9jYXRpb24uaGFzaCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHRoZSBoYXNoIGNoYW5nZXMsIGdldCB0aGUgYmFzZSB1cmwgZnJvbSB0aGUgYWN0aW9uIGFuZCB0aGVuIGFkZCB0aGUgY3VycmVudCBoYXNoXG5cdCAqL1xuXHRqUXVlcnkoIHdpbmRvdyApLm9uKCBcImhhc2hjaGFuZ2VcIiwgd3BzZW9TZXRUYWJIYXNoICk7XG5cblx0LyoqXG5cdCAqIEFkZCBhIEZhY2Vib29rIGFkbWluIGZvciB2aWEgQUpBWC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0FkZEZiQWRtaW4oKSB7XG5cdFx0dmFyIHRhcmdldEZvcm0gPSBqUXVlcnkoIFwiI1RCX2FqYXhDb250ZW50XCIgKTtcblxuXHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0YWpheHVybCxcblx0XHRcdHtcblx0XHRcdFx0X3dwbm9uY2U6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX25vbmNlXVwiICkudmFsKCksXG5cdFx0XHRcdGFkbWluX25hbWU6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX25hbWVdXCIgKS52YWwoKSxcblx0XHRcdFx0YWRtaW5faWQ6IHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFtuYW1lPWZiX2FkbWluX2lkXVwiICkudmFsKCksXG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19hZGRfZmJfYWRtaW5cIixcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdHZhciByZXNwID0galF1ZXJ5LnBhcnNlSlNPTiggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHR0YXJnZXRGb3JtLmZpbmQoIFwicC5ub3RpY2VcIiApLnJlbW92ZSgpO1xuXG5cdFx0XHRcdHN3aXRjaCAoIHJlc3Auc3VjY2VzcyApIHtcblx0XHRcdFx0XHRjYXNlIDE6XG5cblx0XHRcdFx0XHRcdHRhcmdldEZvcm0uZmluZCggXCJpbnB1dFt0eXBlPXRleHRdXCIgKS52YWwoIFwiXCIgKTtcblxuXHRcdFx0XHRcdFx0alF1ZXJ5KCBcIiN1c2VyX2FkbWluXCIgKS5hcHBlbmQoIHJlc3AuaHRtbCApO1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBcIiNjb25uZWN0ZWRfZmJfYWRtaW5zXCIgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR0Yl9yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMCA6XG5cdFx0XHRcdFx0XHR0YXJnZXRGb3JtLmZpbmQoIFwiLmZvcm0td3JhcFwiICkucHJlcGVuZCggcmVzcC5odG1sICk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFNlbGVjdDIoKSB7XG5cdFx0dmFyIHNlbGVjdDJXaWR0aCA9IFwiNDAwcHhcIjtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIEdlbmVyYWwgc2V0dGluZ3M6IHlvdXIgaW5mbzogY29tcGFueSBvciBwZXJzb24uIFdpZHRoIGlzIHRoZSBzYW1lIGFzIHRoZSB3aWR0aCBmb3IgdGhlIG90aGVyIGZpZWxkcyBvbiB0aGlzIHBhZ2UuXG5cdFx0alF1ZXJ5KCBcIiNjb21wYW55X29yX3BlcnNvblwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgVHdpdHRlciBjYXJkIG1ldGEgZGF0YSBpbiBTZXR0aW5nc1xuXHRcdGpRdWVyeSggXCIjdHdpdHRlcl9jYXJkX3R5cGVcIiApLnNlbGVjdDIoIHtcblx0XHRcdHdpZHRoOiBzZWxlY3QyV2lkdGgsXG5cdFx0XHRsYW5ndWFnZTogd3BzZW9TZWxlY3QyTG9jYWxlLFxuXHRcdH0gKTtcblxuXHRcdC8vIFNlbGVjdDIgZm9yIHRheG9ub215IGJyZWFkY3J1bWJzIGluIEFkdmFuY2VkXG5cdFx0alF1ZXJ5KCBcIiNwb3N0X3R5cGVzLXBvc3QtbWFpbnRheFwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2VsZWN0MiBmb3IgcHJvZmlsZSBpbiBTZWFyY2ggQ29uc29sZVxuXHRcdGpRdWVyeSggXCIjcHJvZmlsZVwiICkuc2VsZWN0Migge1xuXHRcdFx0d2lkdGg6IHNlbGVjdDJXaWR0aCxcblx0XHRcdGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgaW5pdGlhbCBhY3RpdmUgdGFiIGluIHRoZSBzZXR0aW5ncyBwYWdlcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRJbml0aWFsQWN0aXZlVGFiKCkge1xuXHRcdHZhciBhY3RpdmVUYWJJZCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoIFwiI3RvcCNcIiwgXCJcIiApO1xuXHRcdC8qXG5cdFx0ICogV29yZFByZXNzIHVzZXMgZnJhZ21lbnQgaWRlbnRpZmllcnMgZm9yIGl0cyBvd24gaW4tcGFnZSBsaW5rcywgZS5nLlxuXHRcdCAqIGAjd3Bib2R5LWNvbnRlbnRgIGFuZCBvdGhlciBwbHVnaW5zIG1heSBkbyB0aGF0IGFzIHdlbGwuIEFsc28sIGZhY2Vib29rXG5cdFx0ICogYWRkcyBhIGAjXz1fYCBzZWUgUFIgNTA2LiBJbiB0aGVzZSBjYXNlcyBhbmQgd2hlbiBpdCdzIGVtcHR5LCBkZWZhdWx0XG5cdFx0ICogdG8gdGhlIGZpcnN0IHRhYi5cblx0XHQgKi9cblx0XHRpZiAoIFwiXCIgPT09IGFjdGl2ZVRhYklkIHx8IFwiI1wiID09PSBhY3RpdmVUYWJJZC5jaGFyQXQoIDAgKSApIHtcblx0XHRcdC8qXG5cdFx0XHQgKiBSZW1pbmRlcjogalF1ZXJ5IGF0dHIoKSBnZXRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIG9ubHkgdGhlIGZpcnN0XG5cdFx0XHQgKiBlbGVtZW50IGluIHRoZSBtYXRjaGVkIHNldCBzbyB0aGlzIHdpbGwgYWx3YXlzIGJlIHRoZSBmaXJzdCB0YWIgaWQuXG5cdFx0XHQgKi9cblx0XHRcdGFjdGl2ZVRhYklkID0galF1ZXJ5KCBcIi53cHNlb3RhYlwiICkuYXR0ciggXCJpZFwiICk7XG5cdFx0fVxuXG5cdFx0alF1ZXJ5KCBcIiNcIiArIGFjdGl2ZVRhYklkICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRqUXVlcnkoIFwiI1wiICsgYWN0aXZlVGFiSWQgKyBcIi10YWJcIiApLmFkZENsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKS5jbGljaygpO1xuXHR9XG5cblx0d2luZG93Lndwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMgPSB3cHNlb0RldGVjdFdyb25nVmFyaWFibGVzO1xuXHR3aW5kb3cuc2V0V1BPcHRpb24gPSBzZXRXUE9wdGlvbjtcblx0d2luZG93Lndwc2VvQ29weUhvbWVNZXRhID0gd3BzZW9Db3B5SG9tZU1ldGE7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXHR3aW5kb3cud3BzZW9BZGRGYkFkbWluID0gd3BzZW9BZGRGYkFkbWluO1xuXHR3aW5kb3cud3BzZW9fYWRkX2ZiX2FkbWluID0gd3BzZW9BZGRGYkFkbWluO1xuXHR3aW5kb3cud3BzZW9TZXRUYWJIYXNoID0gd3BzZW9TZXRUYWJIYXNoO1xuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0LyoqXG5cdFx0ICogV2hlbiB0aGUgaGFzaCBjaGFuZ2VzLCBnZXQgdGhlIGJhc2UgdXJsIGZyb20gdGhlIGFjdGlvbiBhbmQgdGhlbiBhZGQgdGhlIGN1cnJlbnQgaGFzaC5cblx0XHQgKi9cblx0XHR3cHNlb1NldFRhYkhhc2goKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgQXV0aG9yIGFyY2hpdmVzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNkaXNhYmxlLWF1dGhvciBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2F1dGhvci1hcmNoaXZlcy10aXRsZXMtbWV0YXMtY29udGVudFwiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgRGF0ZSBhcmNoaXZlcyBzZWN0aW9uLlxuXHRcdGpRdWVyeSggXCIjZGlzYWJsZS1kYXRlIGlucHV0W3R5cGU9J3JhZGlvJ11cIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBUaGUgdmFsdWUgb24gaXMgZGlzYWJsZWQsIG9mZiBpcyBlbmFibGVkLlxuXHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjZGF0ZS1hcmNoaXZlcy10aXRsZXMtbWV0YXMtY29udGVudFwiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS52YWwoKSA9PT0gXCJvZmZcIiApO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIFRvZ2dsZSB0aGUgTWVkaWEgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtYXR0YWNobWVudCBpbnB1dFt0eXBlPSdyYWRpbyddXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gVGhlIHZhbHVlIG9uIGlzIGRpc2FibGVkLCBvZmYgaXMgZW5hYmxlZC5cblx0XHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmNoZWNrZWRcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI21lZGlhX3NldHRpbmdzXCIgKS50b2dnbGUoIGpRdWVyeSggdGhpcyApLnZhbCgpID09PSBcIm9mZlwiICk7XG5cdFx0XHR9XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gVG9nZ2xlIHRoZSBGb3JtYXQtYmFzZWQgYXJjaGl2ZXMgc2VjdGlvbi5cblx0XHRqUXVlcnkoIFwiI2Rpc2FibGUtcG9zdF9mb3JtYXRcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI3Bvc3RfZm9ybWF0LXRpdGxlcy1tZXRhc1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6bm90KDpjaGVja2VkKVwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBUb2dnbGUgdGhlIEJyZWFkY3J1bWJzIHNlY3Rpb24uXG5cdFx0alF1ZXJ5KCBcIiNicmVhZGNydW1icy1lbmFibGVcIiApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIFwiI2JyZWFkY3J1bWJzaW5mb1wiICkudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKS5pcyggXCI6Y2hlY2tlZFwiICkgKTtcblx0XHR9ICkuY2hhbmdlKCk7XG5cblx0XHQvLyBIYW5kbGUgdGhlIHNldHRpbmdzIHBhZ2VzIHRhYnMuXG5cdFx0alF1ZXJ5KCBcIiN3cHNlby10YWJzXCIgKS5maW5kKCBcImFcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggXCIjd3BzZW8tdGFic1wiICkuZmluZCggXCJhXCIgKS5yZW1vdmVDbGFzcyggXCJuYXYtdGFiLWFjdGl2ZVwiICk7XG5cdFx0XHRqUXVlcnkoIFwiLndwc2VvdGFiXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHR2YXIgaWQgPSBqUXVlcnkoIHRoaXMgKS5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCBcIi10YWJcIiwgXCJcIiApO1xuXHRcdFx0alF1ZXJ5KCBcIiNcIiArIGlkICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdGpRdWVyeSggdGhpcyApLmFkZENsYXNzKCBcIm5hdi10YWItYWN0aXZlXCIgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgdGhlIENvbXBhbnkgb3IgUGVyc29uIHNlbGVjdC5cblx0XHRqUXVlcnkoIFwiI2NvbXBhbnlfb3JfcGVyc29uXCIgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNvbXBhbnlPclBlcnNvbiA9IGpRdWVyeSggdGhpcyApLnZhbCgpO1xuXHRcdFx0aWYgKCBcImNvbXBhbnlcIiA9PT0gY29tcGFueU9yUGVyc29uICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5zaG93KCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIFwicGVyc29uXCIgPT09IGNvbXBhbnlPclBlcnNvbiApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNrbm93bGVkZ2UtZ3JhcGgtY29tcGFueVwiICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1wZXJzb25cIiApLnNob3coKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRqUXVlcnkoIFwiI2tub3dsZWRnZS1ncmFwaC1jb21wYW55XCIgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIja25vd2xlZGdlLWdyYXBoLXBlcnNvblwiICkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKS5jaGFuZ2UoKTtcblxuXHRcdC8vIENoZWNrIGNvcnJlY3QgdmFyaWFibGVzIHVzYWdlIGluIHRpdGxlIGFuZCBkZXNjcmlwdGlvbiB0ZW1wbGF0ZXMuXG5cdFx0alF1ZXJ5KCBcIi50ZW1wbGF0ZVwiICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcblx0XHRcdHdwc2VvRGV0ZWN0V3JvbmdWYXJpYWJsZXMoIGpRdWVyeSggdGhpcyApICk7XG5cdFx0fSApLmNoYW5nZSgpO1xuXG5cdFx0Ly8gUHJldmVudCBmb3JtIHN1Ym1pc3Npb24gd2hlbiBwcmVzc2luZyBFbnRlciBvbiB0aGUgc3dpdGNoLXRvZ2dsZXMuXG5cdFx0alF1ZXJ5KCBcIi5zd2l0Y2gteW9hc3Qtc2VvIGlucHV0XCIgKS5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGlmICggXCJrZXlkb3duXCIgPT09IGV2ZW50LnR5cGUgJiYgMTMgPT09IGV2ZW50LndoaWNoICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHNldEluaXRpYWxBY3RpdmVUYWIoKTtcblx0XHRpbml0U2VsZWN0MigpO1xuXHR9ICk7XG59KCkgKTtcbiIsInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuIl19
