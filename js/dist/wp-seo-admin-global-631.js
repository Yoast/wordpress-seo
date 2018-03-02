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

			// Continue if the table already has the necessary markup.
			if (table.data("scrollContainer")) {
				// This is a jQuery equivalent of `continue` within an `each()` loop.
				return;
			}

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
		/*
   * Bail if there are no tables. Check also for the jQuery object itself,
   * see https://github.com/Yoast/wordpress-seo/issues/8214
   */
		if (!window.wpseoScrollableTables || !window.wpseoScrollableTables.length) {
			return;
		}

		checkMultipleScrollableTablesSize(window.wpseoScrollableTables);
	});

	/*
  * Generates the scrollable tables markuo when the react tabs are mounted,
  * when a table is in the active tab. Or, generates the markup when a react
  * tabs is selected. Uses a timeout to wait for the HTML injection of the table.
  */
	$(window).on({
		"Yoast:YoastTabsMounted": function YoastYoastTabsMounted() {
			setTimeout(function () {
				createScrollableTables();
			}, 100);
		},
		"Yoast:YoastTabsSelected": function YoastYoastTabsSelected() {
			setTimeout(function () {
				createScrollableTables();
			}, 100);
		}
	});

	$(document).ready(function () {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
		createScrollableTables();
	});
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7Ozs7OztBQU9BLFVBQVMsMkJBQVQsR0FBdUM7QUFDdEMsTUFBSyxPQUFPLE9BQU8seUJBQWQsS0FBNEMsV0FBNUMsSUFBMkQsT0FBTyxPQUFQLEtBQW1CLFdBQW5GLEVBQWlHO0FBQ2hHO0FBQ0E7O0FBRUQ7QUFDQSxPQUFNLElBQUksUUFBUSxDQUFsQixFQUFxQixRQUFRLDBCQUEwQixNQUF2RCxFQUErRCxPQUEvRCxFQUF5RTtBQUN4RSxXQUFRLElBQVIsQ0FBYywwQkFBMkIsS0FBM0IsQ0FBZDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRCxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsMkJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyx5QkFBVCxDQUFvQyxLQUFwQyxFQUE0QztBQUMzQyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsOEJBRGE7QUFFckIsYUFBVTtBQUZXLEdBQXRCO0FBS0E7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JB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QUFhQSxHQUFHLFFBQUgsRUFBYyxLQUFkLENBQXFCLFlBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUxEO0FBTUEsQ0F6YUMsRUF5YUMsTUF6YUQsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHdwc2VvQWRtaW5HbG9iYWxMMTBuLCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggJCApIHtcblx0LyoqXG5cdCAqIERpc3BsYXlzIGNvbnNvbGUgbm90aWZpY2F0aW9ucy5cblx0ICpcblx0ICogTG9va3MgYXQgYSBnbG9iYWwgdmFyaWFibGUgdG8gZGlzcGxheSBhbGwgbm90aWZpY2F0aW9ucyBpbiB0aGVyZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMoKSB7XG5cdFx0aWYgKCB0eXBlb2Ygd2luZG93Lndwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGNvbnNvbGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucy5sZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnNbIGluZGV4IF0gKTtcblx0XHR9XG5cdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zICk7XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gZGlzbWlzcyB0aGUgdGFnbGluZSBub3RpY2UgZm9yIGEgc3BlY2lmaWMgdXNlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlIE5vbmNlIGZvciB2ZXJpZmljYXRpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSggbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19kaXNtaXNzX3RhZ2xpbmVfbm90aWNlXCIsXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogVXNlZCB0byByZW1vdmUgdGhlIGFkbWluIG5vdGljZXMgZm9yIHNldmVyYWwgcHVycG9zZXMsIGRpZXMgb24gZXhpdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbiBUaGUgb3B0aW9uIHRvIGlnbm9yZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGUgICBUaGUgdGFyZ2V0IGVsZW1lbnQgdG8gaGlkZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlICBOb25jZSBmb3IgdmVyaWZpY2F0aW9uLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0SWdub3JlKCBvcHRpb24sIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X2lnbm9yZVwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2hpZGRlbl9pZ25vcmVfXCIgKyBvcHRpb24gKS52YWwoIFwiaWdub3JlXCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSBkaXNtaXNzYWJsZSBhbmNob3IgYnV0dG9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlzbWlzc0xpbmsgVGhlIFVSTCB0aGF0IGxlYWRzIHRvIHRoZSBkaXNtaXNzaW5nIG9mIHRoZSBub3RpY2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEFuY2hvciB0byBkaXNtaXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzTGluayggZGlzbWlzc0xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NMaW5rICsgJ1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5vdGljZS1kaXNtaXNzXCI+JyArXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj5EaXNtaXNzIHRoaXMgbm90aWNlLjwvc3Bhbj4nICtcblx0XHRcdFwiPC9hPlwiXG5cdFx0KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1kaXNtaXNzaWJsZVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3Qtbm90aWNlLWRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBhcmVudERpdiA9IGpRdWVyeSggdGhpcyApLnBhcmVudCgpO1xuXG5cdFx0XHQvLyBEZXByZWNhdGVkLCB0b2RvOiByZW1vdmUgd2hlbiBhbGwgbm90aWZpZXJzIGhhdmUgYmVlbiBpbXBsZW1lbnRlZC5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC8tL2csIFwiX1wiICksXG5cdFx0XHRcdFx0X3dwbm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX25vdGlmaWNhdGlvblwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCRwYXJlbnREaXYuZmFkZVRvKCAxMDAsIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkcGFyZW50RGl2LnNsaWRlVXAoIDEwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHBhcmVudERpdi5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSApO1xuXG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSBqUXVlcnkoIFwiI1wiICsgJGJ1dHRvbi5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApICksXG5cdFx0XHRcdGlzUGFuZWxWaXNpYmxlID0gaGVscFBhbmVsLmlzKCBcIjp2aXNpYmxlXCIgKTtcblxuXHRcdFx0alF1ZXJ5KCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fSApO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSA9IHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2U7XG5cdHdpbmRvdy53cHNlb1NldElnbm9yZSA9IHdwc2VvU2V0SWdub3JlO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzTGluayA9IHdwc2VvRGlzbWlzc0xpbms7XG5cblx0LyoqXG5cdCAqIEhpZGVzIHBvcHVwIHNob3dpbmcgbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBbGVydFBvcHVwKCkge1xuXHRcdC8vIFJlbW92ZSB0aGUgbmFtZXNwYWNlZCBob3ZlciBldmVudCBmcm9tIHRoZSBtZW51IHRvcCBsZXZlbCBsaXN0IGl0ZW1zLlxuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub2ZmKCBcIm1vdXNlZW50ZXIueW9hc3RhbGVydHBvcHVwIG1vdXNlbGVhdmUueW9hc3RhbGVydHBvcHVwXCIgKTtcblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IG91dC5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiICkuZmFkZU91dCggMjAwICk7XG5cdH1cblxuXHQvKipcblx0ICogU2hvd3MgcG9wdXAgd2l0aCBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0FsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gQXR0YWNoIGFuIGhvdmVyIGV2ZW50IGFuZCBzaG93IHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IGluLlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKVxuXHRcdFx0Lm9uKCBcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHQvLyBBdm9pZCB0aGUgaG92ZXIgZXZlbnQgdG8gcHJvcGFnYXRlIG9uIHRoZSBwYXJlbnQgZWxlbWVudHMuXG5cdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIHdoZW4gaG92ZXJpbmcgb24gaXQuXG5cdFx0XHRcdGhpZGVBbGVydFBvcHVwKCk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdC8qXG5cdFx0ICogQXR0YWNoIGEgbmFtZXNwYWNlZCBob3ZlciBldmVudCBvbiB0aGUgbWVudSB0b3AgbGV2ZWwgaXRlbXMgdG8gaGlkZVxuXHRcdCAqIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyB0aGVtLlxuXHRcdCAqIE5vdGU6IHRoaXMgd2lsbCB3b3JrIGp1c3QgdGhlIGZpcnN0IHRpbWUgdGhlIGxpc3QgaXRlbXMgZ2V0IGhvdmVyZWQgaW4gdGhlXG5cdFx0ICogZmlyc3QgMyBzZWNvbmRzIGFmdGVyIERPTSByZWFkeSBiZWNhdXNlIHRoaXMgZXZlbnQgaXMgdGhlbiByZW1vdmVkLlxuXHRcdCAqL1xuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub24oIFwibW91c2VlbnRlci55b2FzdGFsZXJ0cG9wdXAgbW91c2VsZWF2ZS55b2FzdGFsZXJ0cG9wdXBcIiwgaGlkZUFsZXJ0UG9wdXAgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBhZnRlciAzIHNlY29uZHMgZnJvbSBET00gcmVhZHkuXG5cdFx0c2V0VGltZW91dCggaGlkZUFsZXJ0UG9wdXAsIDMwMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSAkc291cmNlIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIEFKQVggcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZSggJHNvdXJjZSwgcmVzcG9uc2UgKSB7XG5cdFx0JCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiICkub2ZmKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiApO1xuXG5cdFx0aWYgKCB0eXBlb2YgcmVzcG9uc2UuaHRtbCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHJlc3BvbnNlLmh0bWwgKSB7XG5cdFx0XHQkc291cmNlLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICkuaHRtbCggcmVzcG9uc2UuaHRtbCApO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgKi9cblx0XHRcdGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlICovXG5cdFx0fVxuXG5cdFx0dmFyICR3cHNlb01lbnUgPSAkKCBcIiN3cC1hZG1pbi1iYXItd3BzZW8tbWVudVwiICk7XG5cdFx0dmFyICRpc3N1ZUNvdW50ZXIgPSAkd3BzZW9NZW51LmZpbmQoIFwiLnlvYXN0LWlzc3VlLWNvdW50ZXJcIiApO1xuXG5cdFx0aWYgKCAhICRpc3N1ZUNvdW50ZXIubGVuZ3RoICkge1xuXHRcdFx0JHdwc2VvTWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlQ291bnRlciA9ICR3cHNlb01lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cdFx0fVxuXG5cdFx0JGlzc3VlQ291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVDb3VudGVyLmhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGlzc3VlQ291bnRlci5zaG93KCk7XG5cdFx0fVxuXG5cdFx0JCggXCIjdG9wbGV2ZWxfcGFnZV93cHNlb19kYXNoYm9hcmQgLnVwZGF0ZS1wbHVnaW5zXCIgKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCBcInVwZGF0ZS1wbHVnaW5zIGNvdW50LVwiICsgcmVzcG9uc2UudG90YWwgKTtcblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAucGx1Z2luLWNvdW50XCIgKS5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhvb2tzIHRoZSByZXN0b3JlIGFuZCBkaXNtaXNzIGJ1dHRvbnMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpIHtcblx0XHR2YXIgJGRpc21pc3NpYmxlID0gJCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1uby1hbHRcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfcmVzdG9yZV9hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY29sb3Igb2YgdGhlIHN2ZyBmb3IgdGhlIHByZW1pdW0gaW5kaWNhdG9yIGJhc2VkIG9uIHRoZSBjb2xvciBvZiB0aGUgY29sb3Igc2NoZW1lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpIHtcblx0XHRsZXQgJHByZW1pdW1JbmRpY2F0b3IgPSBqUXVlcnkoIFwiLndwc2VvLWpzLXByZW1pdW0taW5kaWNhdG9yXCIgKTtcblx0XHRsZXQgJHN2ZyA9ICRwcmVtaXVtSW5kaWNhdG9yLmZpbmQoIFwic3ZnXCIgKTtcblxuXHRcdC8vIERvbid0IGNoYW5nZSB0aGUgY29sb3IgdG8gc3RhbmQgb3V0IHdoZW4gcHJlbWl1bSBpcyBhY3R1YWxseSBlbmFibGVkLlxuXHRcdGlmICggJHByZW1pdW1JbmRpY2F0b3IuaGFzQ2xhc3MoIFwid3BzZW8tcHJlbWl1bS1pbmRpY2F0b3ItLW5vXCIgKSApIHtcblx0XHRcdGxldCAkc3ZnUGF0aCA9ICRzdmcuZmluZCggXCJwYXRoXCIgKTtcblxuXHRcdFx0bGV0IGJhY2tncm91bmRDb2xvciA9ICRwcmVtaXVtSW5kaWNhdG9yLmNzcyggXCJiYWNrZ3JvdW5kQ29sb3JcIiApO1xuXG5cdFx0XHQkc3ZnUGF0aC5jc3MoIFwiZmlsbFwiLCBiYWNrZ3JvdW5kQ29sb3IgKTtcblx0XHR9XG5cblx0XHQkc3ZnLmNzcyggXCJkaXNwbGF5XCIsIFwiYmxvY2tcIiApO1xuXHRcdCRwcmVtaXVtSW5kaWNhdG9yLmNzcygge1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG5cdFx0XHR3aWR0aDogXCIyMHB4XCIsXG5cdFx0XHRoZWlnaHQ6IFwiMjBweFwiLFxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgYSBzY3JvbGxhYmxlIHRhYmxlIHdpZHRoLlxuXHQgKlxuXHQgKiBDb21wYXJlcyB0aGUgc2Nyb2xsYWJsZSB0YWJsZSB3aWR0aCBhZ2FpbnN0IHRoZSBzaXplIG9mIGl0cyBjb250YWluZXIgYW5kXG5cdCAqIGFkZHMgb3IgcmVtb3ZlcyBDU1MgY2xhc3NlcyBhY2NvcmRpbmdseS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHRhYmxlIEEgalF1ZXJ5IG9iamVjdCB3aXRoIG9uZSBzY3JvbGxhYmxlIHRhYmxlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrU2Nyb2xsYWJsZVRhYmxlU2l6ZSggdGFibGUgKSB7XG5cdFx0Ly8gQmFpbCBpZiB0aGUgdGFibGUgaXMgaGlkZGVuLlxuXHRcdGlmICggdGFibGUuaXMoIFwiOmhpZGRlblwiICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUgdGFibGUgaXMgd2lkZXIgdGhhbiBpdHMgcGFyZW50LCBtYWtlIGl0IHNjcm9sbGFibGUuXG5cdFx0aWYgKCB0YWJsZS5vdXRlcldpZHRoKCkgPiB0YWJsZS5wYXJlbnQoKS5vdXRlcldpZHRoKCkgKSB7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgdGhlIHdpZHRoIG9mIG11bHRpcGxlIHNjcm9sbGFibGUgdGFibGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGFibGVzIEEgalF1ZXJ5IGNvbGxlY3Rpb24gb2Ygc2Nyb2xsYWJsZSB0YWJsZXMuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCB0YWJsZXMgKSB7XG5cdFx0dGFibGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2hlY2tTY3JvbGxhYmxlVGFibGVTaXplKCAkKCB0aGlzICkgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZXMgdGFibGVzIHNjcm9sbGFibGUuXG5cdCAqXG5cdCAqIFVzYWdlOiBzZWUgcmVsYXRlZCBzdHlsZXNoZWV0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKSB7XG5cdFx0Ly8gR2V0IHRoZSB0YWJsZXMgZWxlY3RlZCB0byBiZSBzY3JvbGxhYmxlIGFuZCBzdG9yZSB0aGVtIGZvciBsYXRlciByZXVzZS5cblx0XHR3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzID0gJCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICk7XG5cblx0XHQvLyBCYWlsIGlmIHRoZXJlIGFyZSBubyB0YWJsZXMuXG5cdFx0aWYgKCAhIHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIExvb3Agb3ZlciB0aGUgY29sbGVjdGlvbiBvZiB0YWJsZXMgYW5kIGJ1aWxkIHNvbWUgSFRNTCBhcm91bmQgdGhlbS5cblx0XHR3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRhYmxlID0gJCggdGhpcyApO1xuXG5cdFx0XHQvLyBDb250aW51ZSBpZiB0aGUgdGFibGUgYWxyZWFkeSBoYXMgdGhlIG5lY2Vzc2FyeSBtYXJrdXAuXG5cdFx0XHRpZiAoIHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKSApIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBhIGpRdWVyeSBlcXVpdmFsZW50IG9mIGBjb250aW51ZWAgd2l0aGluIGFuIGBlYWNoKClgIGxvb3AuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhbiBlbGVtZW50IHdpdGggYSBoaW50IG1lc3NhZ2UgYW5kIGluc2VydCBpdCBpbiB0aGUgRE9NXG5cdFx0XHQgKiBiZWZvcmUgZWFjaCB0YWJsZS5cblx0XHRcdCAqL1xuXHRcdFx0dmFyIHNjcm9sbEhpbnQgPSAkKCBcIjxkaXYgLz5cIiwge1xuXHRcdFx0XHRcImNsYXNzXCI6IFwieW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludHdyYXBwZXJcIixcblx0XHRcdFx0aHRtbDogXCI8c3BhbiBjbGFzcz0neW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludCcgYXJpYS1oaWRkZW49J3RydWUnIC8+XCIsXG5cdFx0XHR9ICkuaW5zZXJ0QmVmb3JlKCB0YWJsZSApO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogQ3JlYXRlIGEgd3JhcHBlciBlbGVtZW50IHdpdGggYW4gaW5uZXIgZGl2IG5lY2Vzc2FyeSBmb3Jcblx0XHRcdCAqIHN0eWxpbmcgYW5kIGluc2VydCB0aGVtIGluIHRoZSBET00gYmVmb3JlIGVhY2ggdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBzY3JvbGxDb250YWluZXIgPSAkKCBcIjxkaXYgLz5cIiwge1xuXHRcdFx0XHRcImNsYXNzXCI6IFwieW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9fY29udGFpbmVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPGRpdiBjbGFzcz0neW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXInIC8+XCIsXG5cdFx0XHR9ICkuaW5zZXJ0QmVmb3JlKCB0YWJsZSApO1xuXG5cdFx0XHQvLyBTZXQgdGhlIGhpbnQgbWVzc2FnZSB0ZXh0LlxuXHRcdFx0c2Nyb2xsSGludC5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50XCIgKS50ZXh0KCB3cHNlb0FkbWluR2xvYmFsTDEwbi5zY3JvbGxhYmxlX3RhYmxlX2hpbnQgKTtcblxuXHRcdFx0Ly8gRm9yIGVhY2ggdGFibGUsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGl0cyB3cmFwcGVyIGVsZW1lbnQuXG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiLCBzY3JvbGxDb250YWluZXIgKTtcblxuXHRcdFx0Ly8gRm9yIGVhY2ggdGFibGUsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGl0cyBoaW50IG1lc3NhZ2UuXG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiwgc2Nyb2xsSGludCApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBzY3JvbGxhYmxlIHRhYmxlIGluc2lkZSB0aGUgd3JhcHBlci5cblx0XHRcdHRhYmxlLmFwcGVuZFRvKCBzY3JvbGxDb250YWluZXIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXJcIiApICk7XG5cblx0XHRcdC8vIENoZWNrIGVhY2ggdGFibGUncyB3aWR0aC5cblx0XHRcdGNoZWNrU2Nyb2xsYWJsZVRhYmxlU2l6ZSggdGFibGUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKlxuXHQgKiBXaGVuIHRoZSB2aWV3cG9ydCBzaXplIGNoYW5nZXMsIGNoZWNrIGFnYWluIHRoZSBzY3JvbGxhYmxlIHRhYmxlcyB3aWR0aC5cblx0ICogQWJvdXQgdGhlIGV2ZW50czogdGVjaG5pY2FsbHkgYHdwLXdpbmRvdy1yZXNpemVkYCBpcyB0cmlnZ2VyZWQgb24gdGhlXG5cdCAqIGJvZHkgYnV0IHNpbmNlIGl0IGJ1YmJsZXMsIGl0IGhhcHBlbnMgYWxzbyBvbiB0aGUgd2luZG93LlxuXHQgKiBBbHNvLCBpbnN0ZWFkIG9mIHRyeWluZyB0byBkZXRlY3QgZXZlbnRzIHN1cHBvcnQgb24gZGV2aWNlcyBhbmQgYnJvd3NlcnMsXG5cdCAqIHdlIGp1c3QgcnVuIHRoZSBjaGVjayBvbiBib3RoIGB3cC13aW5kb3ctcmVzaXplZGAgYW5kIGBvcmllbnRhdGlvbmNoYW5nZWAuXG5cdCAqL1xuXHQkKCB3aW5kb3cgKS5vbiggXCJ3cC13aW5kb3ctcmVzaXplZCBvcmllbnRhdGlvbmNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHQvKlxuXHRcdCAqIEJhaWwgaWYgdGhlcmUgYXJlIG5vIHRhYmxlcy4gQ2hlY2sgYWxzbyBmb3IgdGhlIGpRdWVyeSBvYmplY3QgaXRzZWxmLFxuXHRcdCAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vWW9hc3Qvd29yZHByZXNzLXNlby9pc3N1ZXMvODIxNFxuXHRcdCAqL1xuXHRcdGlmICggISB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzIHx8ICEgd2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzICk7XG5cdH0gKTtcblxuXHQvKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIHNjcm9sbGFibGUgdGFibGVzIG1hcmt1byB3aGVuIHRoZSByZWFjdCB0YWJzIGFyZSBtb3VudGVkLFxuXHQgKiB3aGVuIGEgdGFibGUgaXMgaW4gdGhlIGFjdGl2ZSB0YWIuIE9yLCBnZW5lcmF0ZXMgdGhlIG1hcmt1cCB3aGVuIGEgcmVhY3Rcblx0ICogdGFicyBpcyBzZWxlY3RlZC4gVXNlcyBhIHRpbWVvdXQgdG8gd2FpdCBmb3IgdGhlIEhUTUwgaW5qZWN0aW9uIG9mIHRoZSB0YWJsZS5cblx0ICovXG5cdCQoIHdpbmRvdyApLm9uKCB7XG5cdFx0XCJZb2FzdDpZb2FzdFRhYnNNb3VudGVkXCI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKTtcblx0XHRcdH0sIDEwMCApO1xuXHRcdH0sXG5cdFx0XCJZb2FzdDpZb2FzdFRhYnNTZWxlY3RlZFwiOiBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjcmVhdGVTY3JvbGxhYmxlVGFibGVzKCk7XG5cdFx0XHR9LCAxMDAgKTtcblx0XHR9LFxuXHR9ICk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0c2hvd0FsZXJ0UG9wdXAoKTtcblx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0c2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCk7XG5cdFx0Y3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpO1xuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIl19
