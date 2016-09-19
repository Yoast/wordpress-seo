(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

(function () {
	"use strict";

	/**
  * Displays console notifications.
  *
  * Looks at a global variable to display all notifications in there.
  */

	function displayConsoleNotifications() {
		if (typeof window.wpseoConsoleNotifications === "undefined" || typeof console === "undefined") {
			return;
		}

		/* jshint ignore:start */
		for (var index = 0; index < wpseoConsoleNotifications.length; index++) {
			console.warn(wpseoConsoleNotifications[index]);
		}
		/* jshint ignore:end */
	}

	jQuery(document).ready(displayConsoleNotifications);

	/**
  * Used to dismiss the tagline notice for a specific user.
  *
  * @param {string} nonce
  */
	function wpseoDismissTaglineNotice(nonce) {
		jQuery.post(ajaxurl, {
			action: "wpseo_dismiss_tagline_notice",
			_wpnonce: nonce
		});
	}

	/**
  * Used to remove the admin notices for several purposes, dies on exit.
  *
  * @param {string} option
  * @param {string} hide
  * @param {string} nonce
  */
	function wpseoSetIgnore(option, hide, nonce) {
		jQuery.post(ajaxurl, {
			action: "wpseo_set_ignore",
			option: option,
			_wpnonce: nonce
		}, function (data) {
			if (data) {
				jQuery("#" + hide).hide();
				jQuery("#hidden_ignore_" + option).val("ignore");
			}
		});
	}

	/**
  * Generates a dismissable anchor button
  *
  * @param {string} dismiss_link The URL that leads to the dismissing of the notice.
  *
  * @returns {Object} Anchor to dismiss.
  */
	function wpseoDismissLink(dismiss_link) {
		return jQuery('<a href="' + dismiss_link + '" type="button" class="notice-dismiss">' + '<span class="screen-reader-text">Dismiss this notice.</span>' + "</a>");
	}

	jQuery(document).ready(function () {
		jQuery(".yoast-dismissible").on("click", ".yoast-notice-dismiss", function () {
			var $parentDiv = jQuery(this).parent();

			// Deprecated, todo: remove when all notifiers have been implemented.
			jQuery.post(ajaxurl, {
				action: $parentDiv.attr("id").replace(/-/g, "_"),
				_wpnonce: $parentDiv.data("nonce"),
				data: $parentDiv.data("json")
			});

			jQuery.post(ajaxurl, {
				action: "yoast_dismiss_notification",
				notification: $parentDiv.attr("id"),
				nonce: $parentDiv.data("nonce"),
				data: $parentDiv.data("json")
			});

			$parentDiv.fadeTo(100, 0, function () {
				$parentDiv.slideUp(100, function () {
					$parentDiv.remove();
				});
			});

			return false;
		});

		jQuery(".yoast-help-button").on("click", function () {
			var $button = jQuery(this),
			    helpPanel = jQuery("#" + $button.attr("aria-controls")),
			    isPanelVisible = helpPanel.is(":visible");

			jQuery(helpPanel).slideToggle(200, function () {
				$button.attr("aria-expanded", !isPanelVisible);
			});
		});
	});
	window.wpseoDismissTaglineNotice = wpseoDismissTaglineNotice;
	window.wpseoSetIgnore = wpseoSetIgnore;
	window.wpseoDismissLink = wpseoDismissLink;
})();

(function () {
	"use strict";

	var $ = jQuery;

	/**
  * Hide popup showing new alerts are present
  */
	function hideAlertPopup() {
		$("#wp-admin-bar-root-default > li").off("hover", hideAlertPopup);
		$(".yoast-issue-added").fadeOut(200);
	}

	/**
  * Show popup with new alerts message
  */
	function showAlertPopup() {
		$(".yoast-issue-added").hover(hideAlertPopup).fadeIn();
		$("#wp-admin-bar-root-default > li").on("hover", hideAlertPopup);
		setTimeout(hideAlertPopup, 3000);
	}

	/**
  * Handle dismiss and restore AJAX responses
  *
  * @param {Object} $source Object that triggered the request.
  * @param {Object} response AJAX response.
  */
	function handleDismissRestoreResponse($source, response) {
		$(".yoast-alert-holder").off("click", ".restore").off("click", ".dismiss");

		if (typeof response.html === "undefined") {
			return;
		}

		if (response.html) {
			$source.closest(".yoast-container").html(response.html);
			/* jshint ignore:start */
			/* eslint-disable */
			hookDismissRestoreButtons();
			/* jshint ignore:end */
			/* eslint-enable */
		}

		var $wpseo_menu = $("#wp-admin-bar-wpseo-menu");
		var $issue_counter = $wpseo_menu.find(".yoast-issue-counter");

		if (!$issue_counter.length) {
			$wpseo_menu.find("> a:first-child").append('<div class="yoast-issue-counter"/>');
			$issue_counter = $wpseo_menu.find(".yoast-issue-counter");
		}

		$issue_counter.html(response.total);
		if (response.total === 0) {
			$issue_counter.hide();
		} else {
			$issue_counter.show();
		}

		$("#toplevel_page_wpseo_dashboard .update-plugins").removeClass().addClass("update-plugins count-" + response.total);
		$("#toplevel_page_wpseo_dashboard .plugin-count").html(response.total);
	}

	/**
  * Hook the restore and dismiss buttons
  */
	function hookDismissRestoreButtons() {
		var $dismissible = $(".yoast-alert-holder");

		$dismissible.on("click", ".dismiss", function () {
			var $this = $(this);
			var $source = $this.closest(".yoast-alert-holder");

			var $container = $this.closest(".yoast-container");
			$container.append('<div class="yoast-container-disabled"/>');

			$this.find("span").removeClass("dashicons-no-alt").addClass("dashicons-randomize");

			$.post(ajaxurl, {
				action: "yoast_dismiss_alert",
				notification: $source.attr("id"),
				nonce: $source.data("nonce"),
				data: $source.data("json")
			}, handleDismissRestoreResponse.bind(this, $source), "json");
		});

		$dismissible.on("click", ".restore", function () {
			var $this = $(this);
			var $source = $this.closest(".yoast-alert-holder");

			var $container = $this.closest(".yoast-container");
			$container.append('<div class="yoast-container-disabled"/>');

			$this.find("span").removeClass("dashicons-arrow-up").addClass("dashicons-randomize");

			$.post(ajaxurl, {
				action: "yoast_restore_alert",
				notification: $source.attr("id"),
				nonce: $source.data("nonce"),
				data: $source.data("json")
			}, handleDismissRestoreResponse.bind(this, $source), "json");
		});
	}

	/**
  * Sets the color of the svg for the premium indicator based on the color of the color scheme.
  *
  * @returns {void}
  */
	function setPremiumIndicatorColor() {
		var $premiumIndicator = jQuery(".wpseo-js-premium-indicator");
		var $svg = $premiumIndicator.find("svg");

		// Don't change the color to stand out when premium is actually enabled.
		if ($premiumIndicator.hasClass("wpseo-premium-indicator--no")) {
			var $svgPath = $svg.find("path");

			var backgroundColor = $premiumIndicator.css("backgroundColor");

			$svgPath.css("fill", backgroundColor);
		}

		$svg.css("display", "block");
		$premiumIndicator.css({
			backgroundColor: "transparent",
			width: "20px",
			height: "20px"
		});
	}

	$(document).ready(function () {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
	});
})();

(function () {
	"use strict";

	var $ = jQuery;

	/**
  * Start video if found on the tab
  *
  * @param {object} $tab Tab that is activated.
  */
	function activateVideo($tab) {
		var $data = $tab.find(".wpseo-tab-video__data");
		if ($data.length === 0) {
			return;
		}

		$data.append('<iframe width="560" height="315" src="' + $data.data("url") + '" title="' + wpseoAdminGlobalL10n.help_video_iframe_title + '" frameborder="0" allowfullscreen></iframe>');
	}

	/**
  * Stop playing any video.
  */
	function stopVideos() {
		$("#wpbody-content").find(".wpseo-tab-video__data").children().remove();
	}

	/**
  * Open tab
  *
  * @param {object} $container Container that contains the tab.
  * @param {object} $tab Tab that is activated.
  */
	function openHelpCenterTab($container, $tab) {
		$container.find(".contextual-help-tabs-wrap div").removeClass("active");
		$tab.addClass("active");

		stopVideos();
		activateVideo($tab);
	}

	/**
  * Open Video Slideout
  *
  * @param {object} $container Tab to open video slider of.
  */
	function openVideoSlideout($container) {
		$container.find(".toggle__arrow").removeClass("dashicons-arrow-down").addClass("dashicons-arrow-up");
		$container.find(".wpseo-tab-video-container__handle").attr("aria-expanded", "true");
		$container.find(".wpseo-tab-video-slideout").css("display", "flex");

		var $activeTabLink = $container.find(".wpseo-help-center-item.active > a");

		$("#wpcontent").addClass("yoast-help-center-open");

		if ($activeTabLink.length > 0) {
			var activeTab = $activeTabLink.attr("aria-controls");
			activateVideo($("#" + activeTab));

			$container.on("click", ".wpseo-help-center-item > a", function (e) {
				var $link = $(this);
				var target = $link.attr("aria-controls");

				$container.find(".wpseo-help-center-item").removeClass("active");
				$link.parent().addClass("active");

				openHelpCenterTab($container, $("#" + target));

				e.preventDefault();
			});
		} else {
			activateVideo($container);
		}
	}

	/**
  * Close Video Slideout
  */
	function closeVideoSlideout() {
		var $container = $("#wpbody-content").find(".wpseo-tab-video-container");
		$container.find(".wpseo-tab-video-slideout").css("display", "");

		stopVideos();

		$container.find(".toggle__arrow").removeClass("dashicons-arrow-up").addClass("dashicons-arrow-down");
		$container.find(".wpseo-tab-video-container__handle").attr("aria-expanded", "false");

		$("#wpcontent").removeClass("yoast-help-center-open");
	}

	$(".nav-tab").click(function () {
		closeVideoSlideout();
	});

	$(".wpseo-tab-video-container").on("click", ".wpseo-tab-video-container__handle", function (e) {
		var $container = $(e.delegateTarget);
		var $slideout = $container.find(".wpseo-tab-video-slideout");
		if ($slideout.is(":hidden")) {
			openVideoSlideout($container);
		} else {
			closeVideoSlideout();
		}
	});
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsYUFBVztBQUNaOztBQUVBOzs7Ozs7QUFLQSxVQUFTLDJCQUFULEdBQXVDO0FBQ3RDLE1BQUssT0FBTyxPQUFPLHlCQUFkLEtBQTRDLFdBQTVDLElBQTJELE9BQU8sT0FBUCxLQUFtQixXQUFuRixFQUFpRztBQUNoRztBQUNBOztBQUVEO0FBQ0EsT0FBTSxJQUFJLFFBQVEsQ0FBbEIsRUFBcUIsUUFBUSwwQkFBMEIsTUFBdkQsRUFBK0QsT0FBL0QsRUFBeUU7QUFDeEUsV0FBUSxJQUFSLENBQWMsMEJBQTJCLEtBQTNCLENBQWQ7QUFDQTtBQUNEO0FBQ0E7O0FBRUQsUUFBUSxRQUFSLEVBQW1CLEtBQW5CLENBQTBCLDJCQUExQjs7QUFFQTs7Ozs7QUFLQSxVQUFTLHlCQUFULENBQW9DLEtBQXBDLEVBQTRDO0FBQzNDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSw4QkFEYTtBQUVyQixhQUFVO0FBRlcsR0FBdEI7QUFLQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JBQVQsQ0FBMkIs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d0QsSUFBeEQsQ0FBOEQsZUFBOUQsRUFBK0UsT0FBL0U7O0FBRUEsSUFBRyxZQUFILEVBQWtCLFdBQWxCLENBQStCLHdCQUEvQjtBQUNBOztBQUVELEdBQUcsVUFBSCxFQUFnQixLQUFoQixDQUF1QixZQUFXO0FBQ2pDO0FBQ0EsRUFGRDs7QUFJQSxHQUFHLDRCQUFILEVBQWtDLEVBQWxDLENBQXNDLE9BQXRDLEVBQStDLG9DQUEvQyxFQUFxRixVQUFVLENBQVYsRUFBYztBQUNsRyxNQUFJLGFBQWEsRUFBRyxFQUFFLGNBQUwsQ0FBakI7QUFDQSxNQUFJLFlBQVksV0FBVyxJQUFYLENBQWlCLDJCQUFqQixDQUFoQjtBQUNBLE1BQUssVUFBVSxFQUFWLENBQWMsU0FBZCxDQUFMLEVBQWlDO0FBQ2hDLHFCQUFtQixVQUFuQjtBQUNBLEdBRkQsTUFHSztBQUNKO0FBQ0E7QUFDRCxFQVREO0FBVUEsQ0F4R0MsR0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHdwc2VvQWRtaW5HbG9iYWxMMTBuLCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERpc3BsYXlzIGNvbnNvbGUgbm90aWZpY2F0aW9ucy5cblx0ICpcblx0ICogTG9va3MgYXQgYSBnbG9iYWwgdmFyaWFibGUgdG8gZGlzcGxheSBhbGwgbm90aWZpY2F0aW9ucyBpbiB0aGVyZS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucygpIHtcblx0XHRpZiAoIHR5cGVvZiB3aW5kb3cud3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zLmxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRcdGNvbnNvbGUud2Fybiggd3BzZW9Db25zb2xlTm90aWZpY2F0aW9uc1sgaW5kZXggXSApO1xuXHRcdH1cblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMgKTtcblxuXHQvKipcblx0ICogVXNlZCB0byBkaXNtaXNzIHRoZSB0YWdsaW5lIG5vdGljZSBmb3IgYSBzcGVjaWZpYyB1c2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2Vcblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fZGlzbWlzc190YWdsaW5lX25vdGljZVwiLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gcmVtb3ZlIHRoZSBhZG1pbiBub3RpY2VzIGZvciBzZXZlcmFsIHB1cnBvc2VzLCBkaWVzIG9uIGV4aXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb1NldElnbm9yZSggb3B0aW9uLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9pZ25vcmVcIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0aWYgKCBkYXRhICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgaGlkZSApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNoaWRkZW5faWdub3JlX1wiICsgb3B0aW9uICkudmFsKCBcImlnbm9yZVwiICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgZGlzbWlzc2FibGUgYW5jaG9yIGJ1dHRvblxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlzbWlzc19saW5rIFRoZSBVUkwgdGhhdCBsZWFkcyB0byB0aGUgZGlzbWlzc2luZyBvZiB0aGUgbm90aWNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBBbmNob3IgdG8gZGlzbWlzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc0xpbmsoIGRpc21pc3NfbGluayApIHtcblx0XHRyZXR1cm4galF1ZXJ5KFxuXHRcdFx0JzxhIGhyZWY9XCInICsgZGlzbWlzc19saW5rICsgJ1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5vdGljZS1kaXNtaXNzXCI+JyArXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj5EaXNtaXNzIHRoaXMgbm90aWNlLjwvc3Bhbj4nICtcblx0XHRcdFwiPC9hPlwiXG5cdFx0KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1kaXNtaXNzaWJsZVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3Qtbm90aWNlLWRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBhcmVudERpdiA9IGpRdWVyeSggdGhpcyApLnBhcmVudCgpO1xuXG5cdFx0XHQvLyBEZXByZWNhdGVkLCB0b2RvOiByZW1vdmUgd2hlbiBhbGwgbm90aWZpZXJzIGhhdmUgYmVlbiBpbXBsZW1lbnRlZC5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC8tL2csIFwiX1wiICksXG5cdFx0XHRcdFx0X3dwbm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX25vdGlmaWNhdGlvblwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCRwYXJlbnREaXYuZmFkZVRvKCAxMDAsIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkcGFyZW50RGl2LnNsaWRlVXAoIDEwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHBhcmVudERpdi5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSApO1xuXG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSBqUXVlcnkoIFwiI1wiICsgJGJ1dHRvbi5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApICksXG5cdFx0XHRcdGlzUGFuZWxWaXNpYmxlID0gaGVscFBhbmVsLmlzKCBcIjp2aXNpYmxlXCIgKTtcblxuXHRcdFx0alF1ZXJ5KCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fSApO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSA9IHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2U7XG5cdHdpbmRvdy53cHNlb1NldElnbm9yZSA9IHdwc2VvU2V0SWdub3JlO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzTGluayA9IHdwc2VvRGlzbWlzc0xpbms7XG59KCkgKTtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyICQgPSBqUXVlcnk7XG5cblx0LyoqXG5cdCAqIEhpZGUgcG9wdXAgc2hvd2luZyBuZXcgYWxlcnRzIGFyZSBwcmVzZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlQWxlcnRQb3B1cCgpIHtcblx0XHQkKCBcIiN3cC1hZG1pbi1iYXItcm9vdC1kZWZhdWx0ID4gbGlcIiApLm9mZiggXCJob3ZlclwiLCBoaWRlQWxlcnRQb3B1cCApO1xuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKS5mYWRlT3V0KCAyMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93IHBvcHVwIHdpdGggbmV3IGFsZXJ0cyBtZXNzYWdlXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93QWxlcnRQb3B1cCgpIHtcblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiICkuaG92ZXIoIGhpZGVBbGVydFBvcHVwICkuZmFkZUluKCk7XG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vbiggXCJob3ZlclwiLCBoaWRlQWxlcnRQb3B1cCApO1xuXHRcdHNldFRpbWVvdXQoIGhpZGVBbGVydFBvcHVwLCAzMDAwICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXNcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9ICRzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgQUpBWCByZXNwb25zZS5cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UoICRzb3VyY2UsIHJlc3BvbnNlICkge1xuXHRcdCQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICkub2ZmKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiApLm9mZiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIgKTtcblxuXHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmh0bWwgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCByZXNwb25zZS5odG1sICkge1xuXHRcdFx0JHNvdXJjZS5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApLmh0bWwoIHJlc3BvbnNlLmh0bWwgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlICovXG5cdFx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdFx0LyogZXNsaW50LWVuYWJsZSAqL1xuXHRcdH1cblxuXHRcdHZhciAkd3BzZW9fbWVudSA9ICQoIFwiI3dwLWFkbWluLWJhci13cHNlby1tZW51XCIgKTtcblx0XHR2YXIgJGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblxuXHRcdGlmICggISAkaXNzdWVfY291bnRlci5sZW5ndGggKSB7XG5cdFx0XHQkd3BzZW9fbWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblx0XHR9XG5cblx0XHQkaXNzdWVfY291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpc3N1ZV9jb3VudGVyLnNob3coKTtcblx0XHR9XG5cblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAudXBkYXRlLXBsdWdpbnNcIiApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoIFwidXBkYXRlLXBsdWdpbnMgY291bnQtXCIgKyByZXNwb25zZS50b3RhbCApO1xuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC5wbHVnaW4tY291bnRcIiApLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdH1cblxuXHQvKipcblx0ICogSG9vayB0aGUgcmVzdG9yZSBhbmQgZGlzbWlzcyBidXR0b25zXG5cdCAqL1xuXHRmdW5jdGlvbiBob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCkge1xuXHRcdHZhciAkZGlzbWlzc2libGUgPSAkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLW5vLWFsdFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9yZXN0b3JlX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb2xvciBvZiB0aGUgc3ZnIGZvciB0aGUgcHJlbWl1bSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIGNvbG9yIG9mIHRoZSBjb2xvciBzY2hlbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCkge1xuXHRcdGxldCAkcHJlbWl1bUluZGljYXRvciA9IGpRdWVyeSggXCIud3BzZW8tanMtcHJlbWl1bS1pbmRpY2F0b3JcIiApO1xuXHRcdGxldCAkc3ZnID0gJHByZW1pdW1JbmRpY2F0b3IuZmluZCggXCJzdmdcIiApO1xuXG5cdFx0Ly8gRG9uJ3QgY2hhbmdlIHRoZSBjb2xvciB0byBzdGFuZCBvdXQgd2hlbiBwcmVtaXVtIGlzIGFjdHVhbGx5IGVuYWJsZWQuXG5cdFx0aWYgKCAkcHJlbWl1bUluZGljYXRvci5oYXNDbGFzcyggXCJ3cHNlby1wcmVtaXVtLWluZGljYXRvci0tbm9cIiApICkge1xuXHRcdFx0bGV0ICRzdmdQYXRoID0gJHN2Zy5maW5kKCBcInBhdGhcIiApO1xuXG5cdFx0XHRsZXQgYmFja2dyb3VuZENvbG9yID0gJHByZW1pdW1JbmRpY2F0b3IuY3NzKCBcImJhY2tncm91bmRDb2xvclwiICk7XG5cblx0XHRcdCRzdmdQYXRoLmNzcyggXCJmaWxsXCIsIGJhY2tncm91bmRDb2xvciApO1xuXHRcdH1cblxuXHRcdCRzdmcuY3NzKCBcImRpc3BsYXlcIiwgXCJibG9ja1wiICk7XG5cdFx0JHByZW1pdW1JbmRpY2F0b3IuY3NzKCB7XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdHdpZHRoOiBcIjIwcHhcIixcblx0XHRcdGhlaWdodDogXCIyMHB4XCIsXG5cdFx0fSApO1xuXHR9XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0c2hvd0FsZXJ0UG9wdXAoKTtcblx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0c2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCk7XG5cdH0gKTtcbn0oKSApO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgJCA9IGpRdWVyeTtcblxuXHQvKipcblx0ICogU3RhcnQgdmlkZW8gaWYgZm91bmQgb24gdGhlIHRhYlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHRhYiBUYWIgdGhhdCBpcyBhY3RpdmF0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBhY3RpdmF0ZVZpZGVvKCAkdGFiICkge1xuXHRcdHZhciAkZGF0YSA9ICR0YWIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKTtcblx0XHRpZiAoICRkYXRhLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZGF0YS5hcHBlbmQoICc8aWZyYW1lIHdpZHRoPVwiNTYwXCIgaGVpZ2h0PVwiMzE1XCIgc3JjPVwiJyArICRkYXRhLmRhdGEoIFwidXJsXCIgKSArICdcIiB0aXRsZT1cIicgKyB3cHNlb0FkbWluR2xvYmFsTDEwbi5oZWxwX3ZpZGVvX2lmcmFtZV90aXRsZSArICdcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3AgcGxheWluZyBhbnkgdmlkZW8uXG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wVmlkZW9zKCkge1xuXHRcdCQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbiB0YWJcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgQ29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIHRhYi5cblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICR0YWIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi5jb250ZXh0dWFsLWhlbHAtdGFicy13cmFwIGRpdlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHQkdGFiLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cdFx0YWN0aXZhdGVWaWRlbyggJHRhYiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW4gVmlkZW8gU2xpZGVvdXRcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgVGFiIHRvIG9wZW4gdmlkZW8gc2xpZGVyIG9mLlxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmNzcyggXCJkaXNwbGF5XCIsIFwiZmxleFwiICk7XG5cblx0XHR2YXIgJGFjdGl2ZVRhYkxpbmsgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0uYWN0aXZlID4gYVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXG5cdFx0aWYgKCAkYWN0aXZlVGFiTGluay5sZW5ndGggPiAwICkge1xuXHRcdFx0dmFyIGFjdGl2ZVRhYiA9ICRhY3RpdmVUYWJMaW5rLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICk7XG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCAkKCBcIiNcIiArIGFjdGl2ZVRhYiApICk7XG5cblx0XHRcdCRjb250YWluZXIub24oIFwiY2xpY2tcIiwgXCIud3BzZW8taGVscC1jZW50ZXItaXRlbSA+IGFcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdHZhciAkbGluayA9ICQoIHRoaXMgKTtcblx0XHRcdFx0dmFyIHRhcmdldCA9ICRsaW5rLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICk7XG5cblx0XHRcdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0XHQkbGluay5wYXJlbnQoKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHRcdG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkKCBcIiNcIiArIHRhcmdldCApICk7XG5cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGFjdGl2YXRlVmlkZW8oICRjb250YWluZXIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2UgVmlkZW8gU2xpZGVvdXRcblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlVmlkZW9TbGlkZW91dCgpIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkuY3NzKCBcImRpc3BsYXlcIiwgXCJcIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIiApO1xuXG5cdFx0JCggXCIjd3Bjb250ZW50XCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oZWxwLWNlbnRlci1vcGVuXCIgKTtcblx0fVxuXG5cdCQoIFwiLm5hdi10YWJcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0fSApO1xuXG5cdCQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIGUuZGVsZWdhdGVUYXJnZXQgKTtcblx0XHR2YXIgJHNsaWRlb3V0ID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApO1xuXHRcdGlmICggJHNsaWRlb3V0LmlzKCBcIjpoaWRkZW5cIiApICkge1xuXHRcdFx0b3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0XHR9XG5cdH0gKTtcbn0oKSApO1xuIl19
