(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

(function () {
	/**
  * Displays console notifications.
  *
  * Looks at a global variable to display all notifications in there.
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
  */
	function hideAlertPopup() {
		$("#wp-admin-bar-root-default > li").off("hover", hideAlertPopup);
		$(".yoast-issue-added").fadeOut(200);
	}

	/**
  * Show popup with new alerts message
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
  */
	function stopVideos() {
		$("#wpbody-content").find(".wpseo-tab-video__data").children().remove();
	}

	/**
  * Open tab
  *
  * @param {object} $container Container that contains the tab.
  * @param {object} $tab Tab that is activated.
  *
  * @returns {void}
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
  *
  * @returns {void}
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
  *
  * @returns {void}
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
			$("#sidebar-container").hide();
		} else {
			closeVideoSlideout();
			$("#sidebar-container").show();
		}
	});
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsYUFBVztBQUNaOzs7Ozs7O0FBT0EsVUFBUywyQkFBVCxHQUF1QztBQUN0QyxNQUFLLE9BQU8sT0FBTyx5QkFBZCxLQUE0QyxXQUE1QyxJQUEyRCxPQUFPLE9BQVAsS0FBbUIsV0FBbkYsRUFBaUc7QUFDaEc7QUFDQTs7QUFFRDtBQUNBLE9BQU0sSUFBSSxRQUFRLENBQWxCLEVBQXFCLFFBQVEsMEJBQTBCLE1BQXZELEVBQStELE9BQS9ELEVBQXlFO0FBQ3hFLFdBQVEsSUFBUixDQUFjLDBCQUEyQixLQUEzQixDQUFkO0FBQ0E7QUFDRDtBQUNBOztBQUVELFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQiwyQkFBMUI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLEtBQXBDLEVBQTRDO0FBQzNDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSw4QkFEYTtBQUVyQixhQUFVO0FBRlcsR0FBdEI7QUFLQTs7QUFFRDs7Ozs7Ozs7O0FBU0EsVUFBUyxjQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLEtBQXZDLEVBQStDO0FBQzlDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSxrQkFEYTtBQUVyQixXQUFRLE1BRmE7QUFHckIsYUFBVTtBQUhXLEdBQXRCLEVBSUcsVUFBVSxJQUFWLEVBQWlCO0FBQ25CLE9BQUssSUFBTCxFQUFZO0FBQ1gsV0FBUSxNQUFNLElBQWQsRUFBcUIsSUFBckI7QUFDQSxXQUFRLG9CQUFvQixNQUE1QixFQUFxQyxHQUFyQyxDQUEwQyxRQUExQztBQUNBO0FBQ0QsR0FURDtBQVdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxnQkFBVCxDQUEyQixZ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LENBQWlCLG9DQUFqQixFQUF3RCxJQUF4RCxDQUE4RCxlQUE5RCxFQUErRSxPQUEvRTs7QUFFQSxJQUFHLFlBQUgsRUFBa0IsV0FBbEIsQ0FBK0Isd0JBQS9CO0FBQ0E7O0FBRUQsR0FBRyxVQUFILEVBQWdCLEtBQWhCLENBQXVCLFlBQVc7QUFDakM7QUFDQSxFQUZEOztBQUlBLEdBQUcsNEJBQUgsRUFBa0MsRUFBbEMsQ0FBc0MsT0FBdEMsRUFBK0Msb0NBQS9DLEVBQXFGLFVBQVUsQ0FBVixFQUFjO0FBQ2xHLE1BQUksYUFBYSxFQUFHLEVBQUUsY0FBTCxDQUFqQjtBQUNBLE1BQUksWUFBWSxXQUFXLElBQVgsQ0FBaUIsMkJBQWpCLENBQWhCO0FBQ0EsTUFBSyxVQUFVLEVBQVYsQ0FBYyxTQUFkLENBQUwsRUFBaUM7QUFDaEMscUJBQW1CLFVBQW5CO0FBQ0EsS0FBRyxvQkFBSCxFQUEwQixJQUExQjtBQUNBLEdBSEQsTUFJSztBQUNKO0FBQ0EsS0FBRyxvQkFBSCxFQUEwQixJQUExQjtBQUNBO0FBQ0QsRUFYRDtBQVlBLENBcEhDLEdBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCB3cHNlb0FkbWluR2xvYmFsTDEwbiwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG5cbiggZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBjb25zb2xlIG5vdGlmaWNhdGlvbnMuXG5cdCAqXG5cdCAqIExvb2tzIGF0IGEgZ2xvYmFsIHZhcmlhYmxlIHRvIGRpc3BsYXkgYWxsIG5vdGlmaWNhdGlvbnMgaW4gdGhlcmUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zKCkge1xuXHRcdGlmICggdHlwZW9mIHdpbmRvdy53cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMubGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0Y29uc29sZS53YXJuKCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zWyBpbmRleCBdICk7XG5cdFx0fVxuXHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucyApO1xuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIGRpc21pc3MgdGhlIHRhZ2xpbmUgbm90aWNlIGZvciBhIHNwZWNpZmljIHVzZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fZGlzbWlzc190YWdsaW5lX25vdGljZVwiLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gcmVtb3ZlIHRoZSBhZG1pbiBub3RpY2VzIGZvciBzZXZlcmFsIHB1cnBvc2VzLCBkaWVzIG9uIGV4aXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TZXRJZ25vcmUoIG9wdGlvbiwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19zZXRfaWdub3JlXCIsXG5cdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIjaGlkZGVuX2lnbm9yZV9cIiArIG9wdGlvbiApLnZhbCggXCJpZ25vcmVcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIGRpc21pc3NhYmxlIGFuY2hvciBidXR0b25cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRpc21pc3NfbGluayBUaGUgVVJMIHRoYXQgbGVhZHMgdG8gdGhlIGRpc21pc3Npbmcgb2YgdGhlIG5vdGljZS5cblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gQW5jaG9yIHRvIGRpc21pc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NMaW5rKCBkaXNtaXNzX2xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NfbGluayArICdcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJub3RpY2UtZGlzbWlzc1wiPicgK1xuXHRcdFx0JzxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+RGlzbWlzcyB0aGlzIG5vdGljZS48L3NwYW4+JyArXG5cdFx0XHRcIjwvYT5cIlxuXHRcdCk7XG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeSggXCIueW9hc3QtZGlzbWlzc2libGVcIiApLm9uKCBcImNsaWNrXCIsIFwiLnlvYXN0LW5vdGljZS1kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRwYXJlbnREaXYgPSBqUXVlcnkoIHRoaXMgKS5wYXJlbnQoKTtcblxuXHRcdFx0Ly8gRGVwcmVjYXRlZCwgdG9kbzogcmVtb3ZlIHdoZW4gYWxsIG5vdGlmaWVycyBoYXZlIGJlZW4gaW1wbGVtZW50ZWQuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvLS9nLCBcIl9cIiApLFxuXHRcdFx0XHRcdF93cG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19ub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkcGFyZW50RGl2LmZhZGVUbyggMTAwLCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHBhcmVudERpdi5zbGlkZVVwKCAxMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRwYXJlbnREaXYucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gKTtcblxuXHRcdGpRdWVyeSggXCIueW9hc3QtaGVscC1idXR0b25cIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRidXR0b24gPSBqUXVlcnkoIHRoaXMgKSxcblx0XHRcdFx0aGVscFBhbmVsID0galF1ZXJ5KCBcIiNcIiArICRidXR0b24uYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSApLFxuXHRcdFx0XHRpc1BhbmVsVmlzaWJsZSA9IGhlbHBQYW5lbC5pcyggXCI6dmlzaWJsZVwiICk7XG5cblx0XHRcdGpRdWVyeSggaGVscFBhbmVsICkuc2xpZGVUb2dnbGUoIDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRidXR0b24uYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsICEgaXNQYW5lbFZpc2libGUgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH0gKTtcblx0d2luZG93Lndwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UgPSB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlO1xuXHR3aW5kb3cud3BzZW9TZXRJZ25vcmUgPSB3cHNlb1NldElnbm9yZTtcblx0d2luZG93Lndwc2VvRGlzbWlzc0xpbmsgPSB3cHNlb0Rpc21pc3NMaW5rO1xufSgpICk7XG5cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciAkID0galF1ZXJ5O1xuXG5cdC8qKlxuXHQgKiBIaWRlIHBvcHVwIHNob3dpbmcgbmV3IGFsZXJ0cyBhcmUgcHJlc2VudFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBbGVydFBvcHVwKCkge1xuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub2ZmKCBcImhvdmVyXCIsIGhpZGVBbGVydFBvcHVwICk7XG5cdFx0JCggXCIueW9hc3QtaXNzdWUtYWRkZWRcIiApLmZhZGVPdXQoIDIwMCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3cgcG9wdXAgd2l0aCBuZXcgYWxlcnRzIG1lc3NhZ2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93QWxlcnRQb3B1cCgpIHtcblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiICkuaG92ZXIoIGhpZGVBbGVydFBvcHVwICkuZmFkZUluKCk7XG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vbiggXCJob3ZlclwiLCBoaWRlQWxlcnRQb3B1cCApO1xuXHRcdHNldFRpbWVvdXQoIGhpZGVBbGVydFBvcHVwLCAzMDAwICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXNcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9ICRzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgQUpBWCByZXNwb25zZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlKCAkc291cmNlLCByZXNwb25zZSApIHtcblx0XHQkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApLm9mZiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiICk7XG5cblx0XHRpZiAoIHR5cGVvZiByZXNwb25zZS5odG1sID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggcmVzcG9uc2UuaHRtbCApIHtcblx0XHRcdCRzb3VyY2UuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKS5odG1sKCByZXNwb25zZS5odG1sICk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXHRcdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0XHRcdC8qIGVzbGludC1lbmFibGUgKi9cblx0XHR9XG5cblx0XHR2YXIgJHdwc2VvX21lbnUgPSAkKCBcIiN3cC1hZG1pbi1iYXItd3BzZW8tbWVudVwiICk7XG5cdFx0dmFyICRpc3N1ZV9jb3VudGVyID0gJHdwc2VvX21lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cblx0XHRpZiAoICEgJGlzc3VlX2NvdW50ZXIubGVuZ3RoICkge1xuXHRcdFx0JHdwc2VvX21lbnUuZmluZCggXCI+IGE6Zmlyc3QtY2hpbGRcIiApLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1pc3N1ZS1jb3VudGVyXCIvPicgKTtcblx0XHRcdCRpc3N1ZV9jb3VudGVyID0gJHdwc2VvX21lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cdFx0fVxuXG5cdFx0JGlzc3VlX2NvdW50ZXIuaHRtbCggcmVzcG9uc2UudG90YWwgKTtcblx0XHRpZiAoIHJlc3BvbnNlLnRvdGFsID09PSAwICkge1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5zaG93KCk7XG5cdFx0fVxuXG5cdFx0JCggXCIjdG9wbGV2ZWxfcGFnZV93cHNlb19kYXNoYm9hcmQgLnVwZGF0ZS1wbHVnaW5zXCIgKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCBcInVwZGF0ZS1wbHVnaW5zIGNvdW50LVwiICsgcmVzcG9uc2UudG90YWwgKTtcblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAucGx1Z2luLWNvdW50XCIgKS5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhvb2sgdGhlIHJlc3RvcmUgYW5kIGRpc21pc3MgYnV0dG9uc1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKSB7XG5cdFx0dmFyICRkaXNtaXNzaWJsZSA9ICQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtbm8tYWx0XCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3NfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X3Jlc3RvcmVfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbG9yIG9mIHRoZSBzdmcgZm9yIHRoZSBwcmVtaXVtIGluZGljYXRvciBiYXNlZCBvbiB0aGUgY29sb3Igb2YgdGhlIGNvbG9yIHNjaGVtZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRQcmVtaXVtSW5kaWNhdG9yQ29sb3IoKSB7XG5cdFx0bGV0ICRwcmVtaXVtSW5kaWNhdG9yID0galF1ZXJ5KCBcIi53cHNlby1qcy1wcmVtaXVtLWluZGljYXRvclwiICk7XG5cdFx0bGV0ICRzdmcgPSAkcHJlbWl1bUluZGljYXRvci5maW5kKCBcInN2Z1wiICk7XG5cblx0XHQvLyBEb24ndCBjaGFuZ2UgdGhlIGNvbG9yIHRvIHN0YW5kIG91dCB3aGVuIHByZW1pdW0gaXMgYWN0dWFsbHkgZW5hYmxlZC5cblx0XHRpZiAoICRwcmVtaXVtSW5kaWNhdG9yLmhhc0NsYXNzKCBcIndwc2VvLXByZW1pdW0taW5kaWNhdG9yLS1ub1wiICkgKSB7XG5cdFx0XHRsZXQgJHN2Z1BhdGggPSAkc3ZnLmZpbmQoIFwicGF0aFwiICk7XG5cblx0XHRcdGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAkcHJlbWl1bUluZGljYXRvci5jc3MoIFwiYmFja2dyb3VuZENvbG9yXCIgKTtcblxuXHRcdFx0JHN2Z1BhdGguY3NzKCBcImZpbGxcIiwgYmFja2dyb3VuZENvbG9yICk7XG5cdFx0fVxuXG5cdFx0JHN2Zy5jc3MoIFwiZGlzcGxheVwiLCBcImJsb2NrXCIgKTtcblx0XHQkcHJlbWl1bUluZGljYXRvci5jc3MoIHtcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuXHRcdFx0d2lkdGg6IFwiMjBweFwiLFxuXHRcdFx0aGVpZ2h0OiBcIjIwcHhcIixcblx0XHR9ICk7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRzaG93QWxlcnRQb3B1cCgpO1xuXHRcdGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKTtcblx0XHRzZXRQcmVtaXVtSW5kaWNhdG9yQ29sb3IoKTtcblx0fSApO1xufSgpICk7XG5cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciAkID0galF1ZXJ5O1xuXG5cdC8qKlxuXHQgKiBTdGFydCB2aWRlbyBpZiBmb3VuZCBvbiB0aGUgdGFiXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhY3RpdmF0ZVZpZGVvKCAkdGFiICkge1xuXHRcdHZhciAkZGF0YSA9ICR0YWIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKTtcblx0XHRpZiAoICRkYXRhLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZGF0YS5hcHBlbmQoICc8aWZyYW1lIHdpZHRoPVwiNTYwXCIgaGVpZ2h0PVwiMzE1XCIgc3JjPVwiJyArICRkYXRhLmRhdGEoIFwidXJsXCIgKSArICdcIiB0aXRsZT1cIicgKyB3cHNlb0FkbWluR2xvYmFsTDEwbi5oZWxwX3ZpZGVvX2lmcmFtZV90aXRsZSArICdcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3AgcGxheWluZyBhbnkgdmlkZW8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcFZpZGVvcygpIHtcblx0XHQkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW4gdGFiXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIENvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSB0YWIuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJHRhYiApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLmNvbnRleHR1YWwtaGVscC10YWJzLXdyYXAgZGl2XCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdCR0YWIuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblx0XHRhY3RpdmF0ZVZpZGVvKCAkdGFiICk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbiBWaWRlbyBTbGlkZW91dFxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBUYWIgdG8gb3BlbiB2aWRlbyBzbGlkZXIgb2YuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmNzcyggXCJkaXNwbGF5XCIsIFwiZmxleFwiICk7XG5cblx0XHR2YXIgJGFjdGl2ZVRhYkxpbmsgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0uYWN0aXZlID4gYVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXG5cdFx0aWYgKCAkYWN0aXZlVGFiTGluay5sZW5ndGggPiAwICkge1xuXHRcdFx0dmFyIGFjdGl2ZVRhYiA9ICRhY3RpdmVUYWJMaW5rLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICk7XG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCAkKCBcIiNcIiArIGFjdGl2ZVRhYiApICk7XG5cblx0XHRcdCRjb250YWluZXIub24oIFwiY2xpY2tcIiwgXCIud3BzZW8taGVscC1jZW50ZXItaXRlbSA+IGFcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdHZhciAkbGluayA9ICQoIHRoaXMgKTtcblx0XHRcdFx0dmFyIHRhcmdldCA9ICRsaW5rLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICk7XG5cblx0XHRcdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0XHQkbGluay5wYXJlbnQoKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHRcdG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkKCBcIiNcIiArIHRhcmdldCApICk7XG5cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGFjdGl2YXRlVmlkZW8oICRjb250YWluZXIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2UgVmlkZW8gU2xpZGVvdXRcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZVZpZGVvU2xpZGVvdXQoKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmNzcyggXCJkaXNwbGF5XCIsIFwiXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblxuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cdH1cblxuXHQkKCBcIi5uYXYtdGFiXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdH0gKTtcblxuXHQkKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKS5vbiggXCJjbGlja1wiLCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBlLmRlbGVnYXRlVGFyZ2V0ICk7XG5cdFx0dmFyICRzbGlkZW91dCA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKTtcblx0XHRpZiAoICRzbGlkZW91dC5pcyggXCI6aGlkZGVuXCIgKSApIHtcblx0XHRcdG9wZW5WaWRlb1NsaWRlb3V0KCAkY29udGFpbmVyICk7XG5cdFx0XHQkKCBcIiNzaWRlYmFyLWNvbnRhaW5lclwiICkuaGlkZSgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNsb3NlVmlkZW9TbGlkZW91dCgpO1xuXHRcdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLnNob3coKTtcblx0XHR9XG5cdH0gKTtcbn0oKSApO1xuIl19
