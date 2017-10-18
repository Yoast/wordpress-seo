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
  * @param {string} nonce Nonce for verification.
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
  * @param {string} option The option to ignore.
  * @param {string} hide   The target element to hide.
  * @param {string} nonce  Nonce for verification.
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
  * @param {string} dismissLink The URL that leads to the dismissing of the notice.
  *
  * @returns {Object} Anchor to dismiss.
  */
	function wpseoDismissLink(dismissLink) {
		return jQuery('<a href="' + dismissLink + '" type="button" class="notice-dismiss">' + '<span class="screen-reader-text">Dismiss this notice.</span>' + "</a>");
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

		var $wpseoMenu = $("#wp-admin-bar-wpseo-menu");
		var $issueCounter = $wpseoMenu.find(".yoast-issue-counter");

		if (!$issueCounter.length) {
			$wpseoMenu.find("> a:first-child").append('<div class="yoast-issue-counter"/>');
			$issueCounter = $wpseoMenu.find(".yoast-issue-counter");
		}

		$issueCounter.html(response.total);
		if (response.total === 0) {
			$issueCounter.hide();
		} else {
			$issueCounter.show();
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

	/*
  * Generates the scrollable tables markuo when the react tabs are mounted,
  * in case a table is in the first tab. Or, generates the markup when a react
  * tabs is selected, with a timeout to wait for the HTML injection of the tab content.
  */
	$(window).on({
		"Yoast:YoastTabsMounted": function YoastYoastTabsMounted() {
			createScrollableTables();
		},
		"Yoast:YoastTabsSelected": function YoastYoastTabsSelected() {
			setTimeout(createScrollableTables, 100);
		}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7Ozs7OztBQU9BLFVBQVMsMkJBQVQsR0FBdUM7QUFDdEMsTUFBSyxPQUFPLE9BQU8seUJBQWQsS0FBNEMsV0FBNUMsSUFBMkQsT0FBTyxPQUFQLEtBQW1CLFdBQW5GLEVBQWlHO0FBQ2hHO0FBQ0E7O0FBRUQ7QUFDQSxPQUFNLElBQUksUUFBUSxDQUFsQixFQUFxQixRQUFRLDBCQUEwQixNQUF2RCxFQUErRCxPQUEvRCxFQUF5RTtBQUN4RSxXQUFRLElBQVIsQ0FBYywwQkFBMkIsS0FBM0IsQ0FBZDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRCxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsMkJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyx5QkFBVCxDQUFvQyxLQUFwQyxFQUE0QztBQUMzQyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsOEJBRGE7QUFFckIsYUFBVTtBQUZXLEdBQXRCO0FBS0E7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JB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QUFzQyxPQUF0QyxFQUErQyxvQ0FBL0MsRUFBcUYsVUFBVSxDQUFWLEVBQWM7QUFDbEcsTUFBSSxhQUFhLEVBQUcsRUFBRSxjQUFMLENBQWpCO0FBQ0EsTUFBSSxZQUFZLFdBQVcsSUFBWCxDQUFpQiwyQkFBakIsQ0FBaEI7QUFDQSxNQUFLLFVBQVUsUUFBVixDQUFvQixRQUFwQixDQUFMLEVBQXNDO0FBQ3JDLHFCQUFtQixVQUFuQjtBQUNBLEdBRkQsTUFFTztBQUNOO0FBQ0E7QUFDRCxFQVJEO0FBU0EsQ0FqaEJDLEVBaWhCQyxNQWpoQkQsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHdwc2VvQWRtaW5HbG9iYWxMMTBuLCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggJCApIHtcblx0LyoqXG5cdCAqIERpc3BsYXlzIGNvbnNvbGUgbm90aWZpY2F0aW9ucy5cblx0ICpcblx0ICogTG9va3MgYXQgYSBnbG9iYWwgdmFyaWFibGUgdG8gZGlzcGxheSBhbGwgbm90aWZpY2F0aW9ucyBpbiB0aGVyZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMoKSB7XG5cdFx0aWYgKCB0eXBlb2Ygd2luZG93Lndwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGNvbnNvbGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucy5sZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnNbIGluZGV4IF0gKTtcblx0XHR9XG5cdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zICk7XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gZGlzbWlzcyB0aGUgdGFnbGluZSBub3RpY2UgZm9yIGEgc3BlY2lmaWMgdXNlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlIE5vbmNlIGZvciB2ZXJpZmljYXRpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSggbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19kaXNtaXNzX3RhZ2xpbmVfbm90aWNlXCIsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogVXNlZCB0byByZW1vdmUgdGhlIGFkbWluIG5vdGljZXMgZm9yIHNldmVyYWwgcHVycG9zZXMsIGRpZXMgb24gZXhpdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbiBUaGUgb3B0aW9uIHRvIGlnbm9yZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGUgICBUaGUgdGFyZ2V0IGVsZW1lbnQgdG8gaGlkZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBOb25jZSBmb3IgdmVyaWZpY2F0aW9uLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0SWdub3JlKCBvcHRpb24sIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X2lnbm9yZVwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2hpZGRlbl9pZ25vcmVfXCIgKyBvcHRpb24gKS52YWwoIFwiaWdub3JlXCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSBkaXNtaXNzYWJsZSBhbmNob3IgYnV0dG9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlzbWlzc0xpbmsgVGhlIFVSTCB0aGF0IGxlYWRzIHRvIHRoZSBkaXNtaXNzaW5nIG9mIHRoZSBub3RpY2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEFuY2hvciB0byBkaXNtaXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzTGluayggZGlzbWlzc0xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NMaW5rICsgJ1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5vdGljZS1kaXNtaXNzXCI+JyArXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj5EaXNtaXNzIHRoaXMgbm90aWNlLjwvc3Bhbj4nICtcblx0XHRcdFwiPC9hPlwiXG5cdFx0KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1kaXNtaXNzaWJsZVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3Qtbm90aWNlLWRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBhcmVudERpdiA9IGpRdWVyeSggdGhpcyApLnBhcmVudCgpO1xuXG5cdFx0XHQvLyBEZXByZWNhdGVkLCB0b2RvOiByZW1vdmUgd2hlbiBhbGwgbm90aWZpZXJzIGhhdmUgYmVlbiBpbXBsZW1lbnRlZC5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC8tL2csIFwiX1wiICksXG5cdFx0XHRcdFx0X3dwbm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX25vdGlmaWNhdGlvblwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCRwYXJlbnREaXYuZmFkZVRvKCAxMDAsIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkcGFyZW50RGl2LnNsaWRlVXAoIDEwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHBhcmVudERpdi5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSApO1xuXG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSBqUXVlcnkoIFwiI1wiICsgJGJ1dHRvbi5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApICksXG5cdFx0XHRcdGlzUGFuZWxWaXNpYmxlID0gaGVscFBhbmVsLmlzKCBcIjp2aXNpYmxlXCIgKTtcblxuXHRcdFx0alF1ZXJ5KCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fSApO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSA9IHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2U7XG5cdHdpbmRvdy53cHNlb1NldElnbm9yZSA9IHdwc2VvU2V0SWdub3JlO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzTGluayA9IHdwc2VvRGlzbWlzc0xpbms7XG5cblx0LyoqXG5cdCAqIEhpZGVzIHBvcHVwIHNob3dpbmcgbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBbGVydFBvcHVwKCkge1xuXHRcdC8vIFJlbW92ZSB0aGUgbmFtZXNwYWNlZCBob3ZlciBldmVudCBmcm9tIHRoZSBtZW51IHRvcCBsZXZlbCBsaXN0IGl0ZW1zLlxuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub2ZmKCBcIm1vdXNlZW50ZXIueW9hc3RhbGVydHBvcHVwIG1vdXNlbGVhdmUueW9hc3RhbGVydHBvcHVwXCIgKTtcblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IG91dC5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiICkuZmFkZU91dCggMjAwICk7XG5cdH1cblxuXHQvKipcblx0ICogU2hvd3MgcG9wdXAgd2l0aCBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0FsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gQXR0YWNoIGFuIGhvdmVyIGV2ZW50IGFuZCBzaG93IHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IGluLlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKVxuXHRcdFx0Lm9uKCBcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHQvLyBBdm9pZCB0aGUgaG92ZXIgZXZlbnQgdG8gcHJvcGFnYXRlIG9uIHRoZSBwYXJlbnQgZWxlbWVudHMuXG5cdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIHdoZW4gaG92ZXJpbmcgb24gaXQuXG5cdFx0XHRcdGhpZGVBbGVydFBvcHVwKCk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdC8qXG5cdFx0ICogQXR0YWNoIGEgbmFtZXNwYWNlZCBob3ZlciBldmVudCBvbiB0aGUgbWVudSB0b3AgbGV2ZWwgaXRlbXMgdG8gaGlkZVxuXHRcdCAqIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyB0aGVtLlxuXHRcdCAqIE5vdGU6IHRoaXMgd2lsbCB3b3JrIGp1c3QgdGhlIGZpcnN0IHRpbWUgdGhlIGxpc3QgaXRlbXMgZ2V0IGhvdmVyZWQgaW4gdGhlXG5cdFx0ICogZmlyc3QgMyBzZWNvbmRzIGFmdGVyIERPTSByZWFkeSBiZWNhdXNlIHRoaXMgZXZlbnQgaXMgdGhlbiByZW1vdmVkLlxuXHRcdCAqL1xuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub24oIFwibW91c2VlbnRlci55b2FzdGFsZXJ0cG9wdXAgbW91c2VsZWF2ZS55b2FzdGFsZXJ0cG9wdXBcIiwgaGlkZUFsZXJ0UG9wdXAgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBhZnRlciAzIHNlY29uZHMgZnJvbSBET00gcmVhZHkuXG5cdFx0c2V0VGltZW91dCggaGlkZUFsZXJ0UG9wdXAsIDMwMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSAkc291cmNlIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIEFKQVggcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZSggJHNvdXJjZSwgcmVzcG9uc2UgKSB7XG5cdFx0JCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiICkub2ZmKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiApO1xuXG5cdFx0aWYgKCB0eXBlb2YgcmVzcG9uc2UuaHRtbCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHJlc3BvbnNlLmh0bWwgKSB7XG5cdFx0XHQkc291cmNlLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICkuaHRtbCggcmVzcG9uc2UuaHRtbCApO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgKi9cblx0XHRcdGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlICovXG5cdFx0fVxuXG5cdFx0dmFyICR3cHNlb01lbnUgPSAkKCBcIiN3cC1hZG1pbi1iYXItd3BzZW8tbWVudVwiICk7XG5cdFx0dmFyICRpc3N1ZUNvdW50ZXIgPSAkd3BzZW9NZW51LmZpbmQoIFwiLnlvYXN0LWlzc3VlLWNvdW50ZXJcIiApO1xuXG5cdFx0aWYgKCAhICRpc3N1ZUNvdW50ZXIubGVuZ3RoICkge1xuXHRcdFx0JHdwc2VvTWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlQ291bnRlciA9ICR3cHNlb01lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cdFx0fVxuXG5cdFx0JGlzc3VlQ291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVDb3VudGVyLmhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGlzc3VlQ291bnRlci5zaG93KCk7XG5cdFx0fVxuXG5cdFx0JCggXCIjdG9wbGV2ZWxfcGFnZV93cHNlb19kYXNoYm9hcmQgLnVwZGF0ZS1wbHVnaW5zXCIgKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCBcInVwZGF0ZS1wbHVnaW5zIGNvdW50LVwiICsgcmVzcG9uc2UudG90YWwgKTtcblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAucGx1Z2luLWNvdW50XCIgKS5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhvb2tzIHRoZSByZXN0b3JlIGFuZCBkaXNtaXNzIGJ1dHRvbnMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpIHtcblx0XHR2YXIgJGRpc21pc3NpYmxlID0gJCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1uby1hbHRcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfcmVzdG9yZV9hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY29sb3Igb2YgdGhlIHN2ZyBmb3IgdGhlIHByZW1pdW0gaW5kaWNhdG9yIGJhc2VkIG9uIHRoZSBjb2xvciBvZiB0aGUgY29sb3Igc2NoZW1lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpIHtcblx0XHRsZXQgJHByZW1pdW1JbmRpY2F0b3IgPSBqUXVlcnkoIFwiLndwc2VvLWpzLXByZW1pdW0taW5kaWNhdG9yXCIgKTtcblx0XHRsZXQgJHN2ZyA9ICRwcmVtaXVtSW5kaWNhdG9yLmZpbmQoIFwic3ZnXCIgKTtcblxuXHRcdC8vIERvbid0IGNoYW5nZSB0aGUgY29sb3IgdG8gc3RhbmQgb3V0IHdoZW4gcHJlbWl1bSBpcyBhY3R1YWxseSBlbmFibGVkLlxuXHRcdGlmICggJHByZW1pdW1JbmRpY2F0b3IuaGFzQ2xhc3MoIFwid3BzZW8tcHJlbWl1bS1pbmRpY2F0b3ItLW5vXCIgKSApIHtcblx0XHRcdGxldCAkc3ZnUGF0aCA9ICRzdmcuZmluZCggXCJwYXRoXCIgKTtcblxuXHRcdFx0bGV0IGJhY2tncm91bmRDb2xvciA9ICRwcmVtaXVtSW5kaWNhdG9yLmNzcyggXCJiYWNrZ3JvdW5kQ29sb3JcIiApO1xuXG5cdFx0XHQkc3ZnUGF0aC5jc3MoIFwiZmlsbFwiLCBiYWNrZ3JvdW5kQ29sb3IgKTtcblx0XHR9XG5cblx0XHQkc3ZnLmNzcyggXCJkaXNwbGF5XCIsIFwiYmxvY2tcIiApO1xuXHRcdCRwcmVtaXVtSW5kaWNhdG9yLmNzcygge1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG5cdFx0XHR3aWR0aDogXCIyMHB4XCIsXG5cdFx0XHRoZWlnaHQ6IFwiMjBweFwiLFxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgYSBzY3JvbGxhYmxlIHRhYmxlIHdpZHRoLlxuXHQgKlxuXHQgKiBDb21wYXJlcyB0aGUgc2Nyb2xsYWJsZSB0YWJsZSB3aWR0aCBhZ2FpbnN0IHRoZSBzaXplIG9mIGl0cyBjb250YWluZXIgYW5kXG5cdCAqIGFkZHMgb3IgcmVtb3ZlcyBDU1MgY2xhc3NlcyBhY2NvcmRpbmdseS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHRhYmxlIEEgalF1ZXJ5IG9iamVjdCB3aXRoIG9uZSBzY3JvbGxhYmxlIHRhYmxlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrU2Nyb2xsYWJsZVRhYmxlU2l6ZSggdGFibGUgKSB7XG5cdFx0Ly8gQmFpbCBpZiB0aGUgdGFibGUgaXMgaGlkZGVuLlxuXHRcdGlmICggdGFibGUuaXMoIFwiOmhpZGRlblwiICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUgdGFibGUgaXMgd2lkZXIgdGhhbiBpdHMgcGFyZW50LCBtYWtlIGl0IHNjcm9sbGFibGUuXG5cdFx0aWYgKCB0YWJsZS5vdXRlcldpZHRoKCkgPiB0YWJsZS5wYXJlbnQoKS5vdXRlcldpZHRoKCkgKSB7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgdGhlIHdpZHRoIG9mIG11bHRpcGxlIHNjcm9sbGFibGUgdGFibGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGFibGVzIEEgalF1ZXJ5IGNvbGxlY3Rpb24gb2Ygc2Nyb2xsYWJsZSB0YWJsZXMuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCB0YWJsZXMgKSB7XG5cdFx0dGFibGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2hlY2tTY3JvbGxhYmxlVGFibGVTaXplKCAkKCB0aGlzICkgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgdGFibGVzIHNjcm9sbGFibGUuXG5cdCAqXG5cdCAqIFVzYWdlOiBzZWUgcmVsYXRlZCBzdHlsZXNoZWV0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKSB7XG5cdFx0Ly8gR2V0IHRoZSB0YWJsZXMgZWxlY3RlZCB0byBiZSBzY3JvbGxhYmxlIGFuZCBzdG9yZSB0aGVtIGZvciBsYXRlciByZXVzZS5cblx0XHR3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzID0gJCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICk7XG5cblx0XHQvLyBCYWlsIGlmIHRoZXJlIGFyZSBubyB0YWJsZXMuXG5cdFx0aWYgKCAhIHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIExvb3Agb3ZlciB0aGUgY29sbGVjdGlvbiBvZiB0YWJsZXMgYW5kIGJ1aWxkIHNvbWUgSFRNTCBhcm91bmQgdGhlbS5cblx0XHR3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRhYmxlID0gJCggdGhpcyApO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogQ3JlYXRlIGFuIGVsZW1lbnQgd2l0aCBhIGhpbnQgbWVzc2FnZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBET01cblx0XHRcdCAqIGJlZm9yZSBlYWNoIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHR2YXIgc2Nyb2xsSGludCA9ICQoIFwiPGRpdiAvPlwiLCB7XG5cdFx0XHRcdFwiY2xhc3NcIjogXCJ5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50d3JhcHBlclwiLFxuXHRcdFx0XHRodG1sOiBcIjxzcGFuIGNsYXNzPSd5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50JyBhcmlhLWhpZGRlbj0ndHJ1ZScgLz5cIixcblx0XHRcdH0gKS5pbnNlcnRCZWZvcmUoIHRhYmxlICk7XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBDcmVhdGUgYSB3cmFwcGVyIGVsZW1lbnQgd2l0aCBhbiBpbm5lciBkaXYgbmVjZXNzYXJ5IGZvclxuXHRcdFx0ICogc3R5bGluZyBhbmQgaW5zZXJ0IHRoZW0gaW4gdGhlIERPTSBiZWZvcmUgZWFjaCB0YWJsZS5cblx0XHRcdCAqL1xuXHRcdFx0dmFyIHNjcm9sbENvbnRhaW5lciA9ICQoIFwiPGRpdiAvPlwiLCB7XG5cdFx0XHRcdFwiY2xhc3NcIjogXCJ5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19jb250YWluZXJcIixcblx0XHRcdFx0aHRtbDogXCI8ZGl2IGNsYXNzPSd5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19pbm5lcicgLz5cIixcblx0XHRcdH0gKS5pbnNlcnRCZWZvcmUoIHRhYmxlICk7XG5cblx0XHRcdC8vIFNldCB0aGUgaGludCBtZXNzYWdlIHRleHQuXG5cdFx0XHRzY3JvbGxIaW50LmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnRcIiApLnRleHQoIHdwc2VvQWRtaW5HbG9iYWxMMTBuLnNjcm9sbGFibGVfdGFibGVfaGludCApO1xuXG5cdFx0XHQvLyBGb3IgZWFjaCB0YWJsZSwgc3RvcmUgYSByZWZlcmVuY2UgdG8gaXRzIHdyYXBwZXIgZWxlbWVudC5cblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIsIHNjcm9sbENvbnRhaW5lciApO1xuXG5cdFx0XHQvLyBGb3IgZWFjaCB0YWJsZSwgc3RvcmUgYSByZWZlcmVuY2UgdG8gaXRzIGhpbnQgbWVzc2FnZS5cblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsSGludFwiLCBzY3JvbGxIaW50ICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIHNjcm9sbGFibGUgdGFibGUgaW5zaWRlIHRoZSB3cmFwcGVyLlxuXHRcdFx0dGFibGUuYXBwZW5kVG8oIHNjcm9sbENvbnRhaW5lci5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlX19pbm5lclwiICkgKTtcblxuXHRcdFx0Ly8gQ2hlY2sgZWFjaCB0YWJsZSdzIHdpZHRoLlxuXHRcdFx0Y2hlY2tTY3JvbGxhYmxlVGFibGVTaXplKCB0YWJsZSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qXG5cdCAqIFdoZW4gdGhlIHZpZXdwb3J0IHNpemUgY2hhbmdlcywgY2hlY2sgYWdhaW4gdGhlIHNjcm9sbGFibGUgdGFibGVzIHdpZHRoLlxuXHQgKiBBYm91dCB0aGUgZXZlbnRzOiB0ZWNobmljYWxseSBgd3Atd2luZG93LXJlc2l6ZWRgIGlzIHRyaWdnZXJlZCBvbiB0aGVcblx0ICogYm9keSBidXQgc2luY2UgaXQgYnViYmxlcywgaXQgaGFwcGVucyBhbHNvIG9uIHRoZSB3aW5kb3cuXG5cdCAqIEFsc28sIGluc3RlYWQgb2YgdHJ5aW5nIHRvIGRldGVjdCBldmVudHMgc3VwcG9ydCBvbiBkZXZpY2VzIGFuZCBicm93c2Vycyxcblx0ICogd2UganVzdCBydW4gdGhlIGNoZWNrIG9uIGJvdGggYHdwLXdpbmRvdy1yZXNpemVkYCBhbmQgYG9yaWVudGF0aW9uY2hhbmdlYC5cblx0ICovXG5cdCQoIHdpbmRvdyApLm9uKCBcIndwLXdpbmRvdy1yZXNpemVkIG9yaWVudGF0aW9uY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgaWYgdGhlcmUgYXJlIG5vIHRhYmxlcy5cblx0XHRpZiAoICEgd2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzICk7XG5cdH0gKTtcblxuXHQvKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIHNjcm9sbGFibGUgdGFibGVzIG1hcmt1byB3aGVuIHRoZSByZWFjdCB0YWJzIGFyZSBtb3VudGVkLFxuXHQgKiBpbiBjYXNlIGEgdGFibGUgaXMgaW4gdGhlIGZpcnN0IHRhYi4gT3IsIGdlbmVyYXRlcyB0aGUgbWFya3VwIHdoZW4gYSByZWFjdFxuXHQgKiB0YWJzIGlzIHNlbGVjdGVkLCB3aXRoIGEgdGltZW91dCB0byB3YWl0IGZvciB0aGUgSFRNTCBpbmplY3Rpb24gb2YgdGhlIHRhYiBjb250ZW50LlxuXHQgKi9cblx0JCggd2luZG93ICkub24oIHtcblx0XHRcIllvYXN0OllvYXN0VGFic01vdW50ZWRcIjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjcmVhdGVTY3JvbGxhYmxlVGFibGVzKCk7XG5cdFx0fSxcblx0XHRcIllvYXN0OllvYXN0VGFic1NlbGVjdGVkXCI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2V0VGltZW91dCggY3JlYXRlU2Nyb2xsYWJsZVRhYmxlcywgMTAwICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0c2hvd0FsZXJ0UG9wdXAoKTtcblx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0c2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCk7XG5cdFx0Y3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB2aWRlbyBpZiBmb3VuZCBvbiB0aGUgdGFiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHRhYiBUYWIgdGhhdCBpcyBhY3RpdmF0ZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWN0aXZhdGVWaWRlbyggJHRhYiApIHtcblx0XHR2YXIgJGRhdGEgPSAkdGFiLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlb19fZGF0YVwiICk7XG5cdFx0aWYgKCAkZGF0YS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGRhdGEuYXBwZW5kKCAnPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cIicgKyAkZGF0YS5kYXRhKCBcInVybFwiICkgKyAnXCIgdGl0bGU9XCInICsgd3BzZW9BZG1pbkdsb2JhbEwxMG4uaGVscF92aWRlb19pZnJhbWVfdGl0bGUgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9wcyBwbGF5aW5nIGFueSB2aWRlby5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wVmlkZW9zKCkge1xuXHRcdCQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgYSB0YWIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIENvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSB0YWIuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJHRhYiApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnlvYXN0LWhlbHAtY2VudGVyLXRhYnMtd3JhcCBkaXZcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0JHRhYi5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXHRcdGFjdGl2YXRlVmlkZW8oICR0YWIgKTtcblx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoICR0YWIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyB0aGUgVmlkZW8gU2xpZGVvdXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIFRhYiB0byBvcGVuIHZpZGVvIHNsaWRlciBvZi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnRvZ2dsZV9fYXJyb3dcIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIgKS5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkucmVtb3ZlQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblxuXHRcdHZhciAkYWN0aXZlVGFiTGluayA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbS5hY3RpdmUgPiBhXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cblx0XHRpZiAoICRhY3RpdmVUYWJMaW5rLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlVGFiSWQgPSAkYWN0aXZlVGFiTGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApLFxuXHRcdFx0XHRhY3RpdmVUYWIgPSAkKCBcIiNcIiArIGFjdGl2ZVRhYklkICk7XG5cblx0XHRcdGFjdGl2YXRlVmlkZW8oIGFjdGl2ZVRhYiApO1xuXG5cdFx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIGFjdGl2ZVRhYi5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlXCIgKSApO1xuXG5cdFx0XHQkY29udGFpbmVyLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0gPiBhXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgJGxpbmsgPSAkKCB0aGlzICk7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkbGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApO1xuXG5cdFx0XHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbVwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdFx0JGxpbmsucGFyZW50KCkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0XHRvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJCggXCIjXCIgKyB0YXJnZXQgKSApO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVG9kbzogY29uc2lkZXIgaWYgc2Nyb2xsYWJsZSB0YWJsZXMgbmVlZCB0byBiZSBjaGVja2VkIGhlcmUgdG9vLlxuXHRcdFx0YWN0aXZhdGVWaWRlbyggJGNvbnRhaW5lciApO1xuXHRcdH1cblxuXHRcdCQoIFwiI3NpZGViYXItY29udGFpbmVyXCIgKS5oaWRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBWaWRlbyBTbGlkZW91dC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZVZpZGVvU2xpZGVvdXQoKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmFkZENsYXNzKCBcImhpZGRlblwiICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnRvZ2dsZV9fYXJyb3dcIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LWRvd25cIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIgKS5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXHRcdCQoIFwiI3NpZGViYXItY29udGFpbmVyXCIgKS5zaG93KCk7XG5cdH1cblxuXHQkKCBcIi5uYXYtdGFiXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdH0gKTtcblxuXHQkKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKS5vbiggXCJjbGlja1wiLCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBlLmRlbGVnYXRlVGFyZ2V0ICk7XG5cdFx0dmFyICRzbGlkZW91dCA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKTtcblx0XHRpZiAoICRzbGlkZW91dC5oYXNDbGFzcyggXCJoaWRkZW5cIiApICkge1xuXHRcdFx0b3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIl19
