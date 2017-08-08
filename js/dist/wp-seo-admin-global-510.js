(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

(function ($) {
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
  * Generates a dismissable anchor button.
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

	/**
  * Hides popup showing new alerts message.
  *
  * @returns {void}
  */
	function hideAlertPopup() {
		// Remove the namespaced hover event from the menu top level list items.
		$("#wp-admin-bar-root-default > li").off("mouseenter.yoastalertpopup mouseleave.yoastalertpopup");
		// Hide the notification popup by fading it out.
		$(".yoast-issue-added").fadeOut(200);
	}

	/**
  * Shows popup with new alerts message.
  *
  * @returns {void}
  */
	function showAlertPopup() {
		// Attach an hover event and show the notification popup by fading it in.
		$(".yoast-issue-added").on("mouseenter mouseleave", function (evt) {
			// Avoid the hover event to propagate on the parent elements.
			evt.stopPropagation();
			// Hide the notification popup when hovering on it.
			hideAlertPopup();
		}).fadeIn();

		/*
   * Attach a namespaced hover event on the menu top level items to hide
   * the notification popup when hovering them.
   * Note: this will work just the first time the list items get hovered in the
   * first 3 seconds after DOM ready because this event is then removed.
   */
		$("#wp-admin-bar-root-default > li").on("mouseenter.yoastalertpopup mouseleave.yoastalertpopup", hideAlertPopup);

		// Hide the notification popup after 3 seconds from DOM ready.
		setTimeout(hideAlertPopup, 3000);
	}

	/**
  * Handles dismiss and restore AJAX responses.
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
  * Hooks the restore and dismiss buttons.
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

	/**
  * Checks a scrollable table width.
  *
  * Compares the scrollable table width against the size of its container and
  * adds or removes CSS classes accordingly.
  *
  * @param {object} table A jQuery object with one scrollable table.
  * @returns {void}
  */
	function checkScrollableTableSize(table) {
		// Bail if the table is hidden.
		if (table.is(":hidden")) {
			return;
		}

		// When the table is wider than its parent, make it scrollable.
		if (table.outerWidth() > table.parent().outerWidth()) {
			table.data("scrollHint").addClass("yoast-has-scroll");
			table.data("scrollContainer").addClass("yoast-has-scroll");
		} else {
			table.data("scrollHint").removeClass("yoast-has-scroll");
			table.data("scrollContainer").removeClass("yoast-has-scroll");
		}
	}

	/**
  * Checks the width of multiple scrollable tables.
  *
  * @param {object} tables A jQuery collection of scrollable tables.
  * @returns {void}
  */
	function checkMultipleScrollableTablesSize(tables) {
		tables.each(function () {
			checkScrollableTableSize($(this));
		});
	}

	/**
  * Makes tables scrollable.
  *
  * Usage: see related stylesheet.
  *
  * @returns {void}
  */
	function createScrollableTables() {
		// Get the tables elected to be scrollable and store them for later reuse.
		window.wpseoScrollableTables = $(".yoast-table-scrollable");

		// Bail if there are no tables.
		if (!window.wpseoScrollableTables.length) {
			return;
		}

		// Loop over the collection of tables and build some HTML around them.
		window.wpseoScrollableTables.each(function () {
			var table = $(this);

			/*
    * Create an element with a hint message and insert it in the DOM
    * before each table.
    */
			var scrollHint = $("<div />", {
				"class": "yoast-table-scrollable__hintwrapper",
				html: "<span class='yoast-table-scrollable__hint' aria-hidden='true' />"
			}).insertBefore(table);

			/*
    * Create a wrapper element with an inner div necessary for
    * styling and insert them in the DOM before each table.
    */
			var scrollContainer = $("<div />", {
				"class": "yoast-table-scrollable__container",
				html: "<div class='yoast-table-scrollable__inner' />"
			}).insertBefore(table);

			// Set the hint message text.
			scrollHint.find(".yoast-table-scrollable__hint").text(wpseoAdminGlobalL10n.scrollable_table_hint);

			// For each table, store a reference to its wrapper element.
			table.data("scrollContainer", scrollContainer);

			// For each table, store a reference to its hint message.
			table.data("scrollHint", scrollHint);

			// Move the scrollable table inside the wrapper.
			table.appendTo(scrollContainer.find(".yoast-table-scrollable__inner"));

			// Check each table's width.
			checkScrollableTableSize(table);
		});
	}

	/*
  * When the viewport size changes, check again the scrollable tables width.
  * About the events: technically `wp-window-resized` is triggered on the
  * body but since it bubbles, it happens also on the window.
  * Also, instead of trying to detect events support on devices and browsers,
  * we just run the check on both `wp-window-resized` and `orientationchange`.
  */
	$(window).on("wp-window-resized orientationchange", function () {
		// Bail if there are no tables.
		if (!window.wpseoScrollableTables.length) {
			return;
		}

		checkMultipleScrollableTablesSize(window.wpseoScrollableTables);
	});

	$(document).ready(function () {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
		createScrollableTables();
	});

	/**
  * Starts video if found on the tab.
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
  * Stops playing any video.
  *
  * @returns {void}
  */
	function stopVideos() {
		$("#wpbody-content").find(".wpseo-tab-video__data").children().remove();
	}

	/**
  * Opens a tab.
  *
  * @param {object} $container Container that contains the tab.
  * @param {object} $tab Tab that is activated.
  *
  * @returns {void}
  */
	function openHelpCenterTab($container, $tab) {
		$container.find(".yoast-help-center-tabs-wrap div").removeClass("active");
		$tab.addClass("active");

		stopVideos();
		activateVideo($tab);
		checkMultipleScrollableTablesSize($tab.find(".yoast-table-scrollable"));
	}

	/**
  * Opens the Video Slideout.
  *
  * @param {object} $container Tab to open video slider of.
  *
  * @returns {void}
  */
	function openVideoSlideout($container) {
		$container.find(".toggle__arrow").removeClass("dashicons-arrow-down").addClass("dashicons-arrow-up");
		$container.find(".wpseo-tab-video-container__handle").attr("aria-expanded", "true");
		$container.find(".wpseo-tab-video-slideout").removeClass("hidden");

		var $activeTabLink = $container.find(".wpseo-help-center-item.active > a");

		$("#wpcontent").addClass("yoast-help-center-open");

		if ($activeTabLink.length > 0) {
			var activeTabId = $activeTabLink.attr("aria-controls"),
			    activeTab = $("#" + activeTabId);

			activateVideo(activeTab);

			checkMultipleScrollableTablesSize(activeTab.find(".yoast-table-scrollable"));

			$container.on("click", ".wpseo-help-center-item > a", function (e) {
				var $link = $(this);
				var target = $link.attr("aria-controls");

				$container.find(".wpseo-help-center-item").removeClass("active");
				$link.parent().addClass("active");

				openHelpCenterTab($container, $("#" + target));

				e.preventDefault();
			});
		} else {
			// Todo: consider if scrollable tables need to be checked here too.
			activateVideo($container);
		}

		$("#sidebar-container").hide();
	}

	/**
  * Closes the Video Slideout.
  *
  * @returns {void}
  */
	function closeVideoSlideout() {
		var $container = $("#wpbody-content").find(".wpseo-tab-video-container");
		$container.find(".wpseo-tab-video-slideout").addClass("hidden");

		stopVideos();

		$container.find(".toggle__arrow").removeClass("dashicons-arrow-up").addClass("dashicons-arrow-down");
		$container.find(".wpseo-tab-video-container__handle").attr("aria-expanded", "false");

		$("#wpcontent").removeClass("yoast-help-center-open");
		$("#sidebar-container").show();
	}

	$(".nav-tab").click(function () {
		closeVideoSlideout();
	});

	$(".wpseo-tab-video-container").on("click", ".wpseo-tab-video-container__handle", function (e) {
		var $container = $(e.delegateTarget);
		var $slideout = $container.find(".wpseo-tab-video-slideout");
		if ($slideout.hasClass("hidden")) {
			openVideoSlideout($container);
		} else {
			closeVideoSlideout();
		}
	});
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7Ozs7OztBQU9BLFVBQVMsMkJBQVQsR0FBdUM7QUFDdEMsTUFBSyxPQUFPLE9BQU8seUJBQWQsS0FBNEMsV0FBNUMsSUFBMkQsT0FBTyxPQUFQLEtBQW1CLFdBQW5GLEVBQWlHO0FBQ2hHO0FBQ0E7O0FBRUQ7QUFDQSxPQUFNLElBQUksUUFBUSxDQUFsQixFQUFxQixRQUFRLDBCQUEwQixNQUF2RCxFQUErRCxPQUEvRCxFQUF5RTtBQUN4RSxXQUFRLElBQVIsQ0FBYywwQkFBMkIsS0FBM0IsQ0FBZDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRCxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsMkJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyx5QkFBVCxDQUFvQyxLQUFwQyxFQUE0QztBQUMzQyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsOEJBRGE7QUFFckIsYUFBVTtBQUZXLEdBQXRCO0FBS0E7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JB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QVUsUUFBVixDQUFvQixRQUFwQixDQUFMLEVBQXNDO0FBQ3JDLHFCQUFtQixVQUFuQjtBQUNBLEdBRkQsTUFFTztBQUNOO0FBQ0E7QUFDRCxFQVJEO0FBU0EsQ0FuZ0JDLEVBbWdCQyxNQW5nQkQsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHdwc2VvQWRtaW5HbG9iYWxMMTBuLCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggJCApIHtcblx0LyoqXG5cdCAqIERpc3BsYXlzIGNvbnNvbGUgbm90aWZpY2F0aW9ucy5cblx0ICpcblx0ICogTG9va3MgYXQgYSBnbG9iYWwgdmFyaWFibGUgdG8gZGlzcGxheSBhbGwgbm90aWZpY2F0aW9ucyBpbiB0aGVyZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMoKSB7XG5cdFx0aWYgKCB0eXBlb2Ygd2luZG93Lndwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGNvbnNvbGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucy5sZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnNbIGluZGV4IF0gKTtcblx0XHR9XG5cdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zICk7XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gZGlzbWlzcyB0aGUgdGFnbGluZSBub3RpY2UgZm9yIGEgc3BlY2lmaWMgdXNlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSggbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19kaXNtaXNzX3RhZ2xpbmVfbm90aWNlXCIsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogVXNlZCB0byByZW1vdmUgdGhlIGFkbWluIG5vdGljZXMgZm9yIHNldmVyYWwgcHVycG9zZXMsIGRpZXMgb24gZXhpdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvblxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaGlkZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb1NldElnbm9yZSggb3B0aW9uLCBoaWRlLCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX3NldF9pZ25vcmVcIixcblx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0aWYgKCBkYXRhICkge1xuXHRcdFx0XHRqUXVlcnkoIFwiI1wiICsgaGlkZSApLmhpZGUoKTtcblx0XHRcdFx0alF1ZXJ5KCBcIiNoaWRkZW5faWdub3JlX1wiICsgb3B0aW9uICkudmFsKCBcImlnbm9yZVwiICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgZGlzbWlzc2FibGUgYW5jaG9yIGJ1dHRvbi5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRpc21pc3NfbGluayBUaGUgVVJMIHRoYXQgbGVhZHMgdG8gdGhlIGRpc21pc3Npbmcgb2YgdGhlIG5vdGljZS5cblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gQW5jaG9yIHRvIGRpc21pc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NMaW5rKCBkaXNtaXNzX2xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NfbGluayArICdcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJub3RpY2UtZGlzbWlzc1wiPicgK1xuXHRcdFx0JzxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+RGlzbWlzcyB0aGlzIG5vdGljZS48L3NwYW4+JyArXG5cdFx0XHRcIjwvYT5cIlxuXHRcdCk7XG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeSggXCIueW9hc3QtZGlzbWlzc2libGVcIiApLm9uKCBcImNsaWNrXCIsIFwiLnlvYXN0LW5vdGljZS1kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRwYXJlbnREaXYgPSBqUXVlcnkoIHRoaXMgKS5wYXJlbnQoKTtcblxuXHRcdFx0Ly8gRGVwcmVjYXRlZCwgdG9kbzogcmVtb3ZlIHdoZW4gYWxsIG5vdGlmaWVycyBoYXZlIGJlZW4gaW1wbGVtZW50ZWQuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvLS9nLCBcIl9cIiApLFxuXHRcdFx0XHRcdF93cG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19ub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkcGFyZW50RGl2LmZhZGVUbyggMTAwLCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHBhcmVudERpdi5zbGlkZVVwKCAxMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRwYXJlbnREaXYucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gKTtcblxuXHRcdGpRdWVyeSggXCIueW9hc3QtaGVscC1idXR0b25cIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRidXR0b24gPSBqUXVlcnkoIHRoaXMgKSxcblx0XHRcdFx0aGVscFBhbmVsID0galF1ZXJ5KCBcIiNcIiArICRidXR0b24uYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSApLFxuXHRcdFx0XHRpc1BhbmVsVmlzaWJsZSA9IGhlbHBQYW5lbC5pcyggXCI6dmlzaWJsZVwiICk7XG5cblx0XHRcdGpRdWVyeSggaGVscFBhbmVsICkuc2xpZGVUb2dnbGUoIDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRidXR0b24uYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsICEgaXNQYW5lbFZpc2libGUgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH0gKTtcblx0d2luZG93Lndwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UgPSB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlO1xuXHR3aW5kb3cud3BzZW9TZXRJZ25vcmUgPSB3cHNlb1NldElnbm9yZTtcblx0d2luZG93Lndwc2VvRGlzbWlzc0xpbmsgPSB3cHNlb0Rpc21pc3NMaW5rO1xuXG5cdC8qKlxuXHQgKiBIaWRlcyBwb3B1cCBzaG93aW5nIG5ldyBhbGVydHMgbWVzc2FnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlQWxlcnRQb3B1cCgpIHtcblx0XHQvLyBSZW1vdmUgdGhlIG5hbWVzcGFjZWQgaG92ZXIgZXZlbnQgZnJvbSB0aGUgbWVudSB0b3AgbGV2ZWwgbGlzdCBpdGVtcy5cblx0XHQkKCBcIiN3cC1hZG1pbi1iYXItcm9vdC1kZWZhdWx0ID4gbGlcIiApLm9mZiggXCJtb3VzZWVudGVyLnlvYXN0YWxlcnRwb3B1cCBtb3VzZWxlYXZlLnlvYXN0YWxlcnRwb3B1cFwiICk7XG5cdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBvdXQuXG5cdFx0JCggXCIueW9hc3QtaXNzdWUtYWRkZWRcIiApLmZhZGVPdXQoIDIwMCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3dzIHBvcHVwIHdpdGggbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dBbGVydFBvcHVwKCkge1xuXHRcdC8vIEF0dGFjaCBhbiBob3ZlciBldmVudCBhbmQgc2hvdyB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBpbi5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiIClcblx0XHRcdC5vbiggXCJtb3VzZWVudGVyIG1vdXNlbGVhdmVcIiwgZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdFx0Ly8gQXZvaWQgdGhlIGhvdmVyIGV2ZW50IHRvIHByb3BhZ2F0ZSBvbiB0aGUgcGFyZW50IGVsZW1lbnRzLlxuXHRcdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCB3aGVuIGhvdmVyaW5nIG9uIGl0LlxuXHRcdFx0XHRoaWRlQWxlcnRQb3B1cCgpO1xuXHRcdFx0fSApXG5cdFx0XHQuZmFkZUluKCk7XG5cblx0XHQvKlxuXHRcdCAqIEF0dGFjaCBhIG5hbWVzcGFjZWQgaG92ZXIgZXZlbnQgb24gdGhlIG1lbnUgdG9wIGxldmVsIGl0ZW1zIHRvIGhpZGVcblx0XHQgKiB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIHdoZW4gaG92ZXJpbmcgdGhlbS5cblx0XHQgKiBOb3RlOiB0aGlzIHdpbGwgd29yayBqdXN0IHRoZSBmaXJzdCB0aW1lIHRoZSBsaXN0IGl0ZW1zIGdldCBob3ZlcmVkIGluIHRoZVxuXHRcdCAqIGZpcnN0IDMgc2Vjb25kcyBhZnRlciBET00gcmVhZHkgYmVjYXVzZSB0aGlzIGV2ZW50IGlzIHRoZW4gcmVtb3ZlZC5cblx0XHQgKi9cblx0XHQkKCBcIiN3cC1hZG1pbi1iYXItcm9vdC1kZWZhdWx0ID4gbGlcIiApLm9uKCBcIm1vdXNlZW50ZXIueW9hc3RhbGVydHBvcHVwIG1vdXNlbGVhdmUueW9hc3RhbGVydHBvcHVwXCIsIGhpZGVBbGVydFBvcHVwICk7XG5cblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYWZ0ZXIgMyBzZWNvbmRzIGZyb20gRE9NIHJlYWR5LlxuXHRcdHNldFRpbWVvdXQoIGhpZGVBbGVydFBvcHVwLCAzMDAwICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBkaXNtaXNzIGFuZCByZXN0b3JlIEFKQVggcmVzcG9uc2VzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gJHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBBSkFYIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UoICRzb3VyY2UsIHJlc3BvbnNlICkge1xuXHRcdCQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICkub2ZmKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiApLm9mZiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIgKTtcblxuXHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmh0bWwgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCByZXNwb25zZS5odG1sICkge1xuXHRcdFx0JHNvdXJjZS5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApLmh0bWwoIHJlc3BvbnNlLmh0bWwgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlICovXG5cdFx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdFx0LyogZXNsaW50LWVuYWJsZSAqL1xuXHRcdH1cblxuXHRcdHZhciAkd3BzZW9fbWVudSA9ICQoIFwiI3dwLWFkbWluLWJhci13cHNlby1tZW51XCIgKTtcblx0XHR2YXIgJGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblxuXHRcdGlmICggISAkaXNzdWVfY291bnRlci5sZW5ndGggKSB7XG5cdFx0XHQkd3BzZW9fbWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblx0XHR9XG5cblx0XHQkaXNzdWVfY291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpc3N1ZV9jb3VudGVyLnNob3coKTtcblx0XHR9XG5cblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAudXBkYXRlLXBsdWdpbnNcIiApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoIFwidXBkYXRlLXBsdWdpbnMgY291bnQtXCIgKyByZXNwb25zZS50b3RhbCApO1xuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC5wbHVnaW4tY291bnRcIiApLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdH1cblxuXHQvKipcblx0ICogSG9va3MgdGhlIHJlc3RvcmUgYW5kIGRpc21pc3MgYnV0dG9ucy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCkge1xuXHRcdHZhciAkZGlzbWlzc2libGUgPSAkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLW5vLWFsdFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9yZXN0b3JlX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb2xvciBvZiB0aGUgc3ZnIGZvciB0aGUgcHJlbWl1bSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIGNvbG9yIG9mIHRoZSBjb2xvciBzY2hlbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCkge1xuXHRcdGxldCAkcHJlbWl1bUluZGljYXRvciA9IGpRdWVyeSggXCIud3BzZW8tanMtcHJlbWl1bS1pbmRpY2F0b3JcIiApO1xuXHRcdGxldCAkc3ZnID0gJHByZW1pdW1JbmRpY2F0b3IuZmluZCggXCJzdmdcIiApO1xuXG5cdFx0Ly8gRG9uJ3QgY2hhbmdlIHRoZSBjb2xvciB0byBzdGFuZCBvdXQgd2hlbiBwcmVtaXVtIGlzIGFjdHVhbGx5IGVuYWJsZWQuXG5cdFx0aWYgKCAkcHJlbWl1bUluZGljYXRvci5oYXNDbGFzcyggXCJ3cHNlby1wcmVtaXVtLWluZGljYXRvci0tbm9cIiApICkge1xuXHRcdFx0bGV0ICRzdmdQYXRoID0gJHN2Zy5maW5kKCBcInBhdGhcIiApO1xuXG5cdFx0XHRsZXQgYmFja2dyb3VuZENvbG9yID0gJHByZW1pdW1JbmRpY2F0b3IuY3NzKCBcImJhY2tncm91bmRDb2xvclwiICk7XG5cblx0XHRcdCRzdmdQYXRoLmNzcyggXCJmaWxsXCIsIGJhY2tncm91bmRDb2xvciApO1xuXHRcdH1cblxuXHRcdCRzdmcuY3NzKCBcImRpc3BsYXlcIiwgXCJibG9ja1wiICk7XG5cdFx0JHByZW1pdW1JbmRpY2F0b3IuY3NzKCB7XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdHdpZHRoOiBcIjIwcHhcIixcblx0XHRcdGhlaWdodDogXCIyMHB4XCIsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBhIHNjcm9sbGFibGUgdGFibGUgd2lkdGguXG5cdCAqXG5cdCAqIENvbXBhcmVzIHRoZSBzY3JvbGxhYmxlIHRhYmxlIHdpZHRoIGFnYWluc3QgdGhlIHNpemUgb2YgaXRzIGNvbnRhaW5lciBhbmRcblx0ICogYWRkcyBvciByZW1vdmVzIENTUyBjbGFzc2VzIGFjY29yZGluZ2x5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGFibGUgQSBqUXVlcnkgb2JqZWN0IHdpdGggb25lIHNjcm9sbGFibGUgdGFibGUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tTY3JvbGxhYmxlVGFibGVTaXplKCB0YWJsZSApIHtcblx0XHQvLyBCYWlsIGlmIHRoZSB0YWJsZSBpcyBoaWRkZW4uXG5cdFx0aWYgKCB0YWJsZS5pcyggXCI6aGlkZGVuXCIgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSB0YWJsZSBpcyB3aWRlciB0aGFuIGl0cyBwYXJlbnQsIG1ha2UgaXQgc2Nyb2xsYWJsZS5cblx0XHRpZiAoIHRhYmxlLm91dGVyV2lkdGgoKSA+IHRhYmxlLnBhcmVudCgpLm91dGVyV2lkdGgoKSApIHtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsSGludFwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsSGludFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB0aGUgd2lkdGggb2YgbXVsdGlwbGUgc2Nyb2xsYWJsZSB0YWJsZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB0YWJsZXMgQSBqUXVlcnkgY29sbGVjdGlvbiBvZiBzY3JvbGxhYmxlIHRhYmxlcy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIHRhYmxlcyApIHtcblx0XHR0YWJsZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjaGVja1Njcm9sbGFibGVUYWJsZVNpemUoICQoIHRoaXMgKSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYWtlcyB0YWJsZXMgc2Nyb2xsYWJsZS5cblx0ICpcblx0ICogVXNhZ2U6IHNlZSByZWxhdGVkIHN0eWxlc2hlZXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpIHtcblx0XHQvLyBHZXQgdGhlIHRhYmxlcyBlbGVjdGVkIHRvIGJlIHNjcm9sbGFibGUgYW5kIHN0b3JlIHRoZW0gZm9yIGxhdGVyIHJldXNlLlxuXHRcdHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMgPSAkKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlXCIgKTtcblxuXHRcdC8vIEJhaWwgaWYgdGhlcmUgYXJlIG5vIHRhYmxlcy5cblx0XHRpZiAoICEgd2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gTG9vcCBvdmVyIHRoZSBjb2xsZWN0aW9uIG9mIHRhYmxlcyBhbmQgYnVpbGQgc29tZSBIVE1MIGFyb3VuZCB0aGVtLlxuXHRcdHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGFibGUgPSAkKCB0aGlzICk7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBDcmVhdGUgYW4gZWxlbWVudCB3aXRoIGEgaGludCBtZXNzYWdlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIERPTVxuXHRcdFx0ICogYmVmb3JlIGVhY2ggdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBzY3JvbGxIaW50ID0gJCggXCI8ZGl2IC8+XCIsIHtcblx0XHRcdFx0XCJjbGFzc1wiOiBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPHNwYW4gY2xhc3M9J3lvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnQnIGFyaWEtaGlkZGVuPSd0cnVlJyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggdGFibGUgKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhIHdyYXBwZXIgZWxlbWVudCB3aXRoIGFuIGlubmVyIGRpdiBuZWNlc3NhcnkgZm9yXG5cdFx0XHQgKiBzdHlsaW5nIGFuZCBpbnNlcnQgdGhlbSBpbiB0aGUgRE9NIGJlZm9yZSBlYWNoIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHR2YXIgc2Nyb2xsQ29udGFpbmVyID0gJCggXCI8ZGl2IC8+XCIsIHtcblx0XHRcdFx0XCJjbGFzc1wiOiBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2NvbnRhaW5lclwiLFxuXHRcdFx0XHRodG1sOiBcIjxkaXYgY2xhc3M9J3lvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2lubmVyJyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggdGFibGUgKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBoaW50IG1lc3NhZ2UgdGV4dC5cblx0XHRcdHNjcm9sbEhpbnQuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludFwiICkudGV4dCggd3BzZW9BZG1pbkdsb2JhbEwxMG4uc2Nyb2xsYWJsZV90YWJsZV9oaW50ICk7XG5cblx0XHRcdC8vIEZvciBlYWNoIHRhYmxlLCBzdG9yZSBhIHJlZmVyZW5jZSB0byBpdHMgd3JhcHBlciBlbGVtZW50LlxuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiwgc2Nyb2xsQ29udGFpbmVyICk7XG5cblx0XHRcdC8vIEZvciBlYWNoIHRhYmxlLCBzdG9yZSBhIHJlZmVyZW5jZSB0byBpdHMgaGludCBtZXNzYWdlLlxuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxIaW50XCIsIHNjcm9sbEhpbnQgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgc2Nyb2xsYWJsZSB0YWJsZSBpbnNpZGUgdGhlIHdyYXBwZXIuXG5cdFx0XHR0YWJsZS5hcHBlbmRUbyggc2Nyb2xsQ29udGFpbmVyLmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2lubmVyXCIgKSApO1xuXG5cdFx0XHQvLyBDaGVjayBlYWNoIHRhYmxlJ3Mgd2lkdGguXG5cdFx0XHRjaGVja1Njcm9sbGFibGVUYWJsZVNpemUoIHRhYmxlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Lypcblx0ICogV2hlbiB0aGUgdmlld3BvcnQgc2l6ZSBjaGFuZ2VzLCBjaGVjayBhZ2FpbiB0aGUgc2Nyb2xsYWJsZSB0YWJsZXMgd2lkdGguXG5cdCAqIEFib3V0IHRoZSBldmVudHM6IHRlY2huaWNhbGx5IGB3cC13aW5kb3ctcmVzaXplZGAgaXMgdHJpZ2dlcmVkIG9uIHRoZVxuXHQgKiBib2R5IGJ1dCBzaW5jZSBpdCBidWJibGVzLCBpdCBoYXBwZW5zIGFsc28gb24gdGhlIHdpbmRvdy5cblx0ICogQWxzbywgaW5zdGVhZCBvZiB0cnlpbmcgdG8gZGV0ZWN0IGV2ZW50cyBzdXBwb3J0IG9uIGRldmljZXMgYW5kIGJyb3dzZXJzLFxuXHQgKiB3ZSBqdXN0IHJ1biB0aGUgY2hlY2sgb24gYm90aCBgd3Atd2luZG93LXJlc2l6ZWRgIGFuZCBgb3JpZW50YXRpb25jaGFuZ2VgLlxuXHQgKi9cblx0JCggd2luZG93ICkub24oIFwid3Atd2luZG93LXJlc2l6ZWQgb3JpZW50YXRpb25jaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBpZiB0aGVyZSBhcmUgbm8gdGFibGVzLlxuXHRcdGlmICggISB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMgKTtcblx0fSApO1xuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHNob3dBbGVydFBvcHVwKCk7XG5cdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpO1xuXHRcdGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBTdGFydHMgdmlkZW8gaWYgZm91bmQgb24gdGhlIHRhYi5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlVmlkZW8oICR0YWIgKSB7XG5cdFx0dmFyICRkYXRhID0gJHRhYi5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApO1xuXHRcdGlmICggJGRhdGEubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCRkYXRhLmFwcGVuZCggJzxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCInICsgJGRhdGEuZGF0YSggXCJ1cmxcIiApICsgJ1wiIHRpdGxlPVwiJyArIHdwc2VvQWRtaW5HbG9iYWxMMTBuLmhlbHBfdmlkZW9faWZyYW1lX3RpdGxlICsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nICk7XG5cdH1cblxuXHQvKipcblx0ICogU3RvcHMgcGxheWluZyBhbnkgdmlkZW8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcFZpZGVvcygpIHtcblx0XHQkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIGEgdGFiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBDb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgdGFiLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHRhYiBUYWIgdGhhdCBpcyBhY3RpdmF0ZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICR0YWIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi55b2FzdC1oZWxwLWNlbnRlci10YWJzLXdyYXAgZGl2XCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdCR0YWIuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblx0XHRhY3RpdmF0ZVZpZGVvKCAkdGFiICk7XG5cdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCAkdGFiLmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVcIiApICk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgdGhlIFZpZGVvIFNsaWRlb3V0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBUYWIgdG8gb3BlbiB2aWRlbyBzbGlkZXIgb2YuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLnJlbW92ZUNsYXNzKCBcImhpZGRlblwiICk7XG5cblx0XHR2YXIgJGFjdGl2ZVRhYkxpbmsgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0uYWN0aXZlID4gYVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXG5cdFx0aWYgKCAkYWN0aXZlVGFiTGluay5sZW5ndGggPiAwICkge1xuXHRcdFx0dmFyIGFjdGl2ZVRhYklkID0gJGFjdGl2ZVRhYkxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSxcblx0XHRcdFx0YWN0aXZlVGFiID0gJCggXCIjXCIgKyBhY3RpdmVUYWJJZCApO1xuXG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCBhY3RpdmVUYWIgKTtcblxuXHRcdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCBhY3RpdmVUYWIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICkgKTtcblxuXHRcdFx0JGNvbnRhaW5lci5vbiggXCJjbGlja1wiLCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtID4gYVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyICRsaW5rID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gJGxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblxuXHRcdFx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW1cIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdCRsaW5rLnBhcmVudCgpLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdFx0b3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICQoIFwiI1wiICsgdGFyZ2V0ICkgKTtcblxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRvZG86IGNvbnNpZGVyIGlmIHNjcm9sbGFibGUgdGFibGVzIG5lZWQgdG8gYmUgY2hlY2tlZCBoZXJlIHRvby5cblx0XHRcdGFjdGl2YXRlVmlkZW8oICRjb250YWluZXIgKTtcblx0XHR9XG5cblx0XHQkKCBcIiNzaWRlYmFyLWNvbnRhaW5lclwiICkuaGlkZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgVmlkZW8gU2xpZGVvdXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvc2VWaWRlb1NsaWRlb3V0KCkge1xuXHRcdHZhciAkY29udGFpbmVyID0gJCggXCIjd3Bib2R5LWNvbnRlbnRcIiApLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKS5hZGRDbGFzcyggXCJoaWRkZW5cIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIiApO1xuXG5cdFx0JCggXCIjd3Bjb250ZW50XCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oZWxwLWNlbnRlci1vcGVuXCIgKTtcblx0XHQkKCBcIiNzaWRlYmFyLWNvbnRhaW5lclwiICkuc2hvdygpO1xuXHR9XG5cblx0JCggXCIubmF2LXRhYlwiICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdGNsb3NlVmlkZW9TbGlkZW91dCgpO1xuXHR9ICk7XG5cblx0JCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICkub24oIFwiY2xpY2tcIiwgXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciAkY29udGFpbmVyID0gJCggZS5kZWxlZ2F0ZVRhcmdldCApO1xuXHRcdHZhciAkc2xpZGVvdXQgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICk7XG5cdFx0aWYgKCAkc2xpZGVvdXQuaGFzQ2xhc3MoIFwiaGlkZGVuXCIgKSApIHtcblx0XHRcdG9wZW5WaWRlb1NsaWRlb3V0KCAkY29udGFpbmVyICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsb3NlVmlkZW9TbGlkZW91dCgpO1xuXHRcdH1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiJdfQ==
