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
		$("#wp-admin-bar-root-default > li").off("hover.yoastalertpopup");
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
		$(".yoast-issue-added").on("hover", function (evt) {
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
		$("#wp-admin-bar-root-default > li").on("hover.yoastalertpopup", hideAlertPopup);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7Ozs7OztBQU9BLFVBQVMsMkJBQVQsR0FBdUM7QUFDdEMsTUFBSyxPQUFPLE9BQU8seUJBQWQsS0FBNEMsV0FBNUMsSUFBMkQsT0FBTyxPQUFQLEtBQW1CLFdBQW5GLEVBQWlHO0FBQ2hHO0FBQ0E7O0FBRUQ7QUFDQSxPQUFNLElBQUksUUFBUSxDQUFsQixFQUFxQixRQUFRLDBCQUEwQixNQUF2RCxFQUErRCxPQUEvRCxFQUF5RTtBQUN4RSxXQUFRLElBQVIsQ0FBYywwQkFBMkIsS0FBM0IsQ0FBZDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRCxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsMkJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyx5QkFBVCxDQUFvQyxLQUFwQyxFQUE0QztBQUMzQyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsOEJBRGE7QUFFckIsYUFBVTtBQUZXLEdBQXRCO0FBS0E7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JB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LFFBQVYsQ0FBb0IsUUFBcEIsQ0FBTCxFQUFzQztBQUNyQyxxQkFBbUIsVUFBbkI7QUFDQSxHQUZELE1BRU87QUFDTjtBQUNBO0FBQ0QsRUFSRDtBQVNBLENBbmdCQyxFQW1nQkMsTUFuZ0JELENBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCB3cHNlb0FkbWluR2xvYmFsTDEwbiwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBjb25zb2xlIG5vdGlmaWNhdGlvbnMuXG5cdCAqXG5cdCAqIExvb2tzIGF0IGEgZ2xvYmFsIHZhcmlhYmxlIHRvIGRpc3BsYXkgYWxsIG5vdGlmaWNhdGlvbnMgaW4gdGhlcmUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zKCkge1xuXHRcdGlmICggdHlwZW9mIHdpbmRvdy53cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMubGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0Y29uc29sZS53YXJuKCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zWyBpbmRleCBdICk7XG5cdFx0fVxuXHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucyApO1xuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIGRpc21pc3MgdGhlIHRhZ2xpbmUgbm90aWNlIGZvciBhIHNwZWNpZmljIHVzZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fZGlzbWlzc190YWdsaW5lX25vdGljZVwiLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gcmVtb3ZlIHRoZSBhZG1pbiBub3RpY2VzIGZvciBzZXZlcmFsIHB1cnBvc2VzLCBkaWVzIG9uIGV4aXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TZXRJZ25vcmUoIG9wdGlvbiwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19zZXRfaWdub3JlXCIsXG5cdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIjaGlkZGVuX2lnbm9yZV9cIiArIG9wdGlvbiApLnZhbCggXCJpZ25vcmVcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIGRpc21pc3NhYmxlIGFuY2hvciBidXR0b24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkaXNtaXNzX2xpbmsgVGhlIFVSTCB0aGF0IGxlYWRzIHRvIHRoZSBkaXNtaXNzaW5nIG9mIHRoZSBub3RpY2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEFuY2hvciB0byBkaXNtaXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzTGluayggZGlzbWlzc19saW5rICkge1xuXHRcdHJldHVybiBqUXVlcnkoXG5cdFx0XHQnPGEgaHJlZj1cIicgKyBkaXNtaXNzX2xpbmsgKyAnXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibm90aWNlLWRpc21pc3NcIj4nICtcblx0XHRcdCc8c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPkRpc21pc3MgdGhpcyBub3RpY2UuPC9zcGFuPicgK1xuXHRcdFx0XCI8L2E+XCJcblx0XHQpO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIFwiLnlvYXN0LWRpc21pc3NpYmxlXCIgKS5vbiggXCJjbGlja1wiLCBcIi55b2FzdC1ub3RpY2UtZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkcGFyZW50RGl2ID0galF1ZXJ5KCB0aGlzICkucGFyZW50KCk7XG5cblx0XHRcdC8vIERlcHJlY2F0ZWQsIHRvZG86IHJlbW92ZSB3aGVuIGFsbCBub3RpZmllcnMgaGF2ZSBiZWVuIGltcGxlbWVudGVkLlxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICkucmVwbGFjZSggLy0vZywgXCJfXCIgKSxcblx0XHRcdFx0XHRfd3Bub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3Nfbm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JHBhcmVudERpdi5mYWRlVG8oIDEwMCwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRwYXJlbnREaXYuc2xpZGVVcCggMTAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkcGFyZW50RGl2LnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ICk7XG5cblx0XHRqUXVlcnkoIFwiLnlvYXN0LWhlbHAtYnV0dG9uXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkYnV0dG9uID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdGhlbHBQYW5lbCA9IGpRdWVyeSggXCIjXCIgKyAkYnV0dG9uLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoIFwiOnZpc2libGVcIiApO1xuXG5cdFx0XHRqUXVlcnkoIGhlbHBQYW5lbCApLnNsaWRlVG9nZ2xlKCAyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkYnV0dG9uLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIGlzUGFuZWxWaXNpYmxlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlID0gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZTtcblx0d2luZG93Lndwc2VvU2V0SWdub3JlID0gd3BzZW9TZXRJZ25vcmU7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NMaW5rID0gd3BzZW9EaXNtaXNzTGluaztcblxuXHQvKipcblx0ICogSGlkZXMgcG9wdXAgc2hvd2luZyBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGlkZUFsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gUmVtb3ZlIHRoZSBuYW1lc3BhY2VkIGhvdmVyIGV2ZW50IGZyb20gdGhlIG1lbnUgdG9wIGxldmVsIGxpc3QgaXRlbXMuXG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vZmYoIFwiaG92ZXIueW9hc3RhbGVydHBvcHVwXCIgKTtcblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IG91dC5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiICkuZmFkZU91dCggMjAwICk7XG5cdH1cblxuXHQvKipcblx0ICogU2hvd3MgcG9wdXAgd2l0aCBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0FsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gQXR0YWNoIGFuIGhvdmVyIGV2ZW50IGFuZCBzaG93IHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IGluLlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKVxuXHRcdFx0Lm9uKCBcImhvdmVyXCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdC8vIEF2b2lkIHRoZSBob3ZlciBldmVudCB0byBwcm9wYWdhdGUgb24gdGhlIHBhcmVudCBlbGVtZW50cy5cblx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyBvbiBpdC5cblx0XHRcdFx0aGlkZUFsZXJ0UG9wdXAoKTtcblx0XHRcdH0gKVxuXHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0Lypcblx0XHQgKiBBdHRhY2ggYSBuYW1lc3BhY2VkIGhvdmVyIGV2ZW50IG9uIHRoZSBtZW51IHRvcCBsZXZlbCBpdGVtcyB0byBoaWRlXG5cdFx0ICogdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCB3aGVuIGhvdmVyaW5nIHRoZW0uXG5cdFx0ICogTm90ZTogdGhpcyB3aWxsIHdvcmsganVzdCB0aGUgZmlyc3QgdGltZSB0aGUgbGlzdCBpdGVtcyBnZXQgaG92ZXJlZCBpbiB0aGVcblx0XHQgKiBmaXJzdCAzIHNlY29uZHMgYWZ0ZXIgRE9NIHJlYWR5IGJlY2F1c2UgdGhpcyBldmVudCBpcyB0aGVuIHJlbW92ZWQuXG5cdFx0ICovXG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vbiggXCJob3Zlci55b2FzdGFsZXJ0cG9wdXBcIiwgaGlkZUFsZXJ0UG9wdXAgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBhZnRlciAzIHNlY29uZHMgZnJvbSBET00gcmVhZHkuXG5cdFx0c2V0VGltZW91dCggaGlkZUFsZXJ0UG9wdXAsIDMwMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSAkc291cmNlIE9iamVjdCB0aGF0IHRyaWdnZXJlZCB0aGUgcmVxdWVzdC5cblx0ICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIEFKQVggcmVzcG9uc2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZSggJHNvdXJjZSwgcmVzcG9uc2UgKSB7XG5cdFx0JCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiICkub2ZmKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiApO1xuXG5cdFx0aWYgKCB0eXBlb2YgcmVzcG9uc2UuaHRtbCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHJlc3BvbnNlLmh0bWwgKSB7XG5cdFx0XHQkc291cmNlLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICkuaHRtbCggcmVzcG9uc2UuaHRtbCApO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgKi9cblx0XHRcdGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlICovXG5cdFx0fVxuXG5cdFx0dmFyICR3cHNlb19tZW51ID0gJCggXCIjd3AtYWRtaW4tYmFyLXdwc2VvLW1lbnVcIiApO1xuXHRcdHZhciAkaXNzdWVfY291bnRlciA9ICR3cHNlb19tZW51LmZpbmQoIFwiLnlvYXN0LWlzc3VlLWNvdW50ZXJcIiApO1xuXG5cdFx0aWYgKCAhICRpc3N1ZV9jb3VudGVyLmxlbmd0aCApIHtcblx0XHRcdCR3cHNlb19tZW51LmZpbmQoIFwiPiBhOmZpcnN0LWNoaWxkXCIgKS5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtaXNzdWUtY291bnRlclwiLz4nICk7XG5cdFx0XHQkaXNzdWVfY291bnRlciA9ICR3cHNlb19tZW51LmZpbmQoIFwiLnlvYXN0LWlzc3VlLWNvdW50ZXJcIiApO1xuXHRcdH1cblxuXHRcdCRpc3N1ZV9jb3VudGVyLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdFx0aWYgKCByZXNwb25zZS50b3RhbCA9PT0gMCApIHtcblx0XHRcdCRpc3N1ZV9jb3VudGVyLmhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIuc2hvdygpO1xuXHRcdH1cblxuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC51cGRhdGUtcGx1Z2luc1wiICkucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyggXCJ1cGRhdGUtcGx1Z2lucyBjb3VudC1cIiArIHJlc3BvbnNlLnRvdGFsICk7XG5cdFx0JCggXCIjdG9wbGV2ZWxfcGFnZV93cHNlb19kYXNoYm9hcmQgLnBsdWdpbi1jb3VudFwiICkuaHRtbCggcmVzcG9uc2UudG90YWwgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIb29rcyB0aGUgcmVzdG9yZSBhbmQgZGlzbWlzcyBidXR0b25zLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKSB7XG5cdFx0dmFyICRkaXNtaXNzaWJsZSA9ICQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtbm8tYWx0XCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3NfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X3Jlc3RvcmVfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbG9yIG9mIHRoZSBzdmcgZm9yIHRoZSBwcmVtaXVtIGluZGljYXRvciBiYXNlZCBvbiB0aGUgY29sb3Igb2YgdGhlIGNvbG9yIHNjaGVtZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRQcmVtaXVtSW5kaWNhdG9yQ29sb3IoKSB7XG5cdFx0bGV0ICRwcmVtaXVtSW5kaWNhdG9yID0galF1ZXJ5KCBcIi53cHNlby1qcy1wcmVtaXVtLWluZGljYXRvclwiICk7XG5cdFx0bGV0ICRzdmcgPSAkcHJlbWl1bUluZGljYXRvci5maW5kKCBcInN2Z1wiICk7XG5cblx0XHQvLyBEb24ndCBjaGFuZ2UgdGhlIGNvbG9yIHRvIHN0YW5kIG91dCB3aGVuIHByZW1pdW0gaXMgYWN0dWFsbHkgZW5hYmxlZC5cblx0XHRpZiAoICRwcmVtaXVtSW5kaWNhdG9yLmhhc0NsYXNzKCBcIndwc2VvLXByZW1pdW0taW5kaWNhdG9yLS1ub1wiICkgKSB7XG5cdFx0XHRsZXQgJHN2Z1BhdGggPSAkc3ZnLmZpbmQoIFwicGF0aFwiICk7XG5cblx0XHRcdGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAkcHJlbWl1bUluZGljYXRvci5jc3MoIFwiYmFja2dyb3VuZENvbG9yXCIgKTtcblxuXHRcdFx0JHN2Z1BhdGguY3NzKCBcImZpbGxcIiwgYmFja2dyb3VuZENvbG9yICk7XG5cdFx0fVxuXG5cdFx0JHN2Zy5jc3MoIFwiZGlzcGxheVwiLCBcImJsb2NrXCIgKTtcblx0XHQkcHJlbWl1bUluZGljYXRvci5jc3MoIHtcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuXHRcdFx0d2lkdGg6IFwiMjBweFwiLFxuXHRcdFx0aGVpZ2h0OiBcIjIwcHhcIixcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGEgc2Nyb2xsYWJsZSB0YWJsZSB3aWR0aC5cblx0ICpcblx0ICogQ29tcGFyZXMgdGhlIHNjcm9sbGFibGUgdGFibGUgd2lkdGggYWdhaW5zdCB0aGUgc2l6ZSBvZiBpdHMgY29udGFpbmVyIGFuZFxuXHQgKiBhZGRzIG9yIHJlbW92ZXMgQ1NTIGNsYXNzZXMgYWNjb3JkaW5nbHkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB0YWJsZSBBIGpRdWVyeSBvYmplY3Qgd2l0aCBvbmUgc2Nyb2xsYWJsZSB0YWJsZS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja1Njcm9sbGFibGVUYWJsZVNpemUoIHRhYmxlICkge1xuXHRcdC8vIEJhaWwgaWYgdGhlIHRhYmxlIGlzIGhpZGRlbi5cblx0XHRpZiAoIHRhYmxlLmlzKCBcIjpoaWRkZW5cIiApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhlIHRhYmxlIGlzIHdpZGVyIHRoYW4gaXRzIHBhcmVudCwgbWFrZSBpdCBzY3JvbGxhYmxlLlxuXHRcdGlmICggdGFibGUub3V0ZXJXaWR0aCgpID4gdGFibGUucGFyZW50KCkub3V0ZXJXaWR0aCgpICkge1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxIaW50XCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxIaW50XCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHRoZSB3aWR0aCBvZiBtdWx0aXBsZSBzY3JvbGxhYmxlIHRhYmxlcy5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHRhYmxlcyBBIGpRdWVyeSBjb2xsZWN0aW9uIG9mIHNjcm9sbGFibGUgdGFibGVzLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrTXVsdGlwbGVTY3JvbGxhYmxlVGFibGVzU2l6ZSggdGFibGVzICkge1xuXHRcdHRhYmxlcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNoZWNrU2Nyb2xsYWJsZVRhYmxlU2l6ZSggJCggdGhpcyApICk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHRhYmxlcyBzY3JvbGxhYmxlLlxuXHQgKlxuXHQgKiBVc2FnZTogc2VlIHJlbGF0ZWQgc3R5bGVzaGVldC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTY3JvbGxhYmxlVGFibGVzKCkge1xuXHRcdC8vIEdldCB0aGUgdGFibGVzIGVsZWN0ZWQgdG8gYmUgc2Nyb2xsYWJsZSBhbmQgc3RvcmUgdGhlbSBmb3IgbGF0ZXIgcmV1c2UuXG5cdFx0d2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcyA9ICQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVcIiApO1xuXG5cdFx0Ly8gQmFpbCBpZiB0aGVyZSBhcmUgbm8gdGFibGVzLlxuXHRcdGlmICggISB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBMb29wIG92ZXIgdGhlIGNvbGxlY3Rpb24gb2YgdGFibGVzIGFuZCBidWlsZCBzb21lIEhUTUwgYXJvdW5kIHRoZW0uXG5cdFx0d2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0YWJsZSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhbiBlbGVtZW50IHdpdGggYSBoaW50IG1lc3NhZ2UgYW5kIGluc2VydCBpdCBpbiB0aGUgRE9NXG5cdFx0XHQgKiBiZWZvcmUgZWFjaCB0YWJsZS5cblx0XHRcdCAqL1xuXHRcdFx0dmFyIHNjcm9sbEhpbnQgPSAkKCBcIjxkaXYgLz5cIiwge1xuXHRcdFx0XHRcImNsYXNzXCI6IFwieW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludHdyYXBwZXJcIixcblx0XHRcdFx0aHRtbDogXCI8c3BhbiBjbGFzcz0neW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludCcgYXJpYS1oaWRkZW49J3RydWUnIC8+XCIsXG5cdFx0XHR9ICkuaW5zZXJ0QmVmb3JlKCB0YWJsZSApO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogQ3JlYXRlIGEgd3JhcHBlciBlbGVtZW50IHdpdGggYW4gaW5uZXIgZGl2IG5lY2Vzc2FyeSBmb3Jcblx0XHRcdCAqIHN0eWxpbmcgYW5kIGluc2VydCB0aGVtIGluIHRoZSBET00gYmVmb3JlIGVhY2ggdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBzY3JvbGxDb250YWluZXIgPSAkKCBcIjxkaXYgLz5cIiwge1xuXHRcdFx0XHRcImNsYXNzXCI6IFwieW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9fY29udGFpbmVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPGRpdiBjbGFzcz0neW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXInIC8+XCIsXG5cdFx0XHR9ICkuaW5zZXJ0QmVmb3JlKCB0YWJsZSApO1xuXG5cdFx0XHQvLyBTZXQgdGhlIGhpbnQgbWVzc2FnZSB0ZXh0LlxuXHRcdFx0c2Nyb2xsSGludC5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50XCIgKS50ZXh0KCB3cHNlb0FkbWluR2xvYmFsTDEwbi5zY3JvbGxhYmxlX3RhYmxlX2hpbnQgKTtcblxuXHRcdFx0Ly8gRm9yIGVhY2ggdGFibGUsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGl0cyB3cmFwcGVyIGVsZW1lbnQuXG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiLCBzY3JvbGxDb250YWluZXIgKTtcblxuXHRcdFx0Ly8gRm9yIGVhY2ggdGFibGUsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIGl0cyBoaW50IG1lc3NhZ2UuXG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbEhpbnRcIiwgc2Nyb2xsSGludCApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBzY3JvbGxhYmxlIHRhYmxlIGluc2lkZSB0aGUgd3JhcHBlci5cblx0XHRcdHRhYmxlLmFwcGVuZFRvKCBzY3JvbGxDb250YWluZXIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXJcIiApICk7XG5cblx0XHRcdC8vIENoZWNrIGVhY2ggdGFibGUncyB3aWR0aC5cblx0XHRcdGNoZWNrU2Nyb2xsYWJsZVRhYmxlU2l6ZSggdGFibGUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKlxuXHQgKiBXaGVuIHRoZSB2aWV3cG9ydCBzaXplIGNoYW5nZXMsIGNoZWNrIGFnYWluIHRoZSBzY3JvbGxhYmxlIHRhYmxlcyB3aWR0aC5cblx0ICogQWJvdXQgdGhlIGV2ZW50czogdGVjaG5pY2FsbHkgYHdwLXdpbmRvdy1yZXNpemVkYCBpcyB0cmlnZ2VyZWQgb24gdGhlXG5cdCAqIGJvZHkgYnV0IHNpbmNlIGl0IGJ1YmJsZXMsIGl0IGhhcHBlbnMgYWxzbyBvbiB0aGUgd2luZG93LlxuXHQgKiBBbHNvLCBpbnN0ZWFkIG9mIHRyeWluZyB0byBkZXRlY3QgZXZlbnRzIHN1cHBvcnQgb24gZGV2aWNlcyBhbmQgYnJvd3NlcnMsXG5cdCAqIHdlIGp1c3QgcnVuIHRoZSBjaGVjayBvbiBib3RoIGB3cC13aW5kb3ctcmVzaXplZGAgYW5kIGBvcmllbnRhdGlvbmNoYW5nZWAuXG5cdCAqL1xuXHQkKCB3aW5kb3cgKS5vbiggXCJ3cC13aW5kb3ctcmVzaXplZCBvcmllbnRhdGlvbmNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIGlmIHRoZXJlIGFyZSBubyB0YWJsZXMuXG5cdFx0aWYgKCAhIHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNoZWNrTXVsdGlwbGVTY3JvbGxhYmxlVGFibGVzU2l6ZSggd2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcyApO1xuXHR9ICk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0c2hvd0FsZXJ0UG9wdXAoKTtcblx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0c2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCk7XG5cdFx0Y3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB2aWRlbyBpZiBmb3VuZCBvbiB0aGUgdGFiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHRhYiBUYWIgdGhhdCBpcyBhY3RpdmF0ZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWN0aXZhdGVWaWRlbyggJHRhYiApIHtcblx0XHR2YXIgJGRhdGEgPSAkdGFiLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlb19fZGF0YVwiICk7XG5cdFx0aWYgKCAkZGF0YS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGRhdGEuYXBwZW5kKCAnPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cIicgKyAkZGF0YS5kYXRhKCBcInVybFwiICkgKyAnXCIgdGl0bGU9XCInICsgd3BzZW9BZG1pbkdsb2JhbEwxMG4uaGVscF92aWRlb19pZnJhbWVfdGl0bGUgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9wcyBwbGF5aW5nIGFueSB2aWRlby5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wVmlkZW9zKCkge1xuXHRcdCQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgYSB0YWIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIENvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSB0YWIuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJHRhYiApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnlvYXN0LWhlbHAtY2VudGVyLXRhYnMtd3JhcCBkaXZcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0JHRhYi5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXHRcdGFjdGl2YXRlVmlkZW8oICR0YWIgKTtcblx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoICR0YWIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyB0aGUgVmlkZW8gU2xpZGVvdXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIFRhYiB0byBvcGVuIHZpZGVvIHNsaWRlciBvZi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnRvZ2dsZV9fYXJyb3dcIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIgKS5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkucmVtb3ZlQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblxuXHRcdHZhciAkYWN0aXZlVGFiTGluayA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbS5hY3RpdmUgPiBhXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cblx0XHRpZiAoICRhY3RpdmVUYWJMaW5rLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlVGFiSWQgPSAkYWN0aXZlVGFiTGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApLFxuXHRcdFx0XHRhY3RpdmVUYWIgPSAkKCBcIiNcIiArIGFjdGl2ZVRhYklkICk7XG5cblx0XHRcdGFjdGl2YXRlVmlkZW8oIGFjdGl2ZVRhYiApO1xuXG5cdFx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIGFjdGl2ZVRhYi5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlXCIgKSApO1xuXG5cdFx0XHQkY29udGFpbmVyLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0gPiBhXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgJGxpbmsgPSAkKCB0aGlzICk7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkbGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApO1xuXG5cdFx0XHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbVwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdFx0JGxpbmsucGFyZW50KCkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0XHRvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJCggXCIjXCIgKyB0YXJnZXQgKSApO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVG9kbzogY29uc2lkZXIgaWYgc2Nyb2xsYWJsZSB0YWJsZXMgbmVlZCB0byBiZSBjaGVja2VkIGhlcmUgdG9vLlxuXHRcdFx0YWN0aXZhdGVWaWRlbyggJGNvbnRhaW5lciApO1xuXHRcdH1cblxuXHRcdCQoIFwiI3NpZGViYXItY29udGFpbmVyXCIgKS5oaWRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBWaWRlbyBTbGlkZW91dC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZVZpZGVvU2xpZGVvdXQoKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmFkZENsYXNzKCBcImhpZGRlblwiICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnRvZ2dsZV9fYXJyb3dcIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LWRvd25cIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIgKS5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXHRcdCQoIFwiI3NpZGViYXItY29udGFpbmVyXCIgKS5zaG93KCk7XG5cdH1cblxuXHQkKCBcIi5uYXYtdGFiXCIgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdH0gKTtcblxuXHQkKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKS5vbiggXCJjbGlja1wiLCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBlLmRlbGVnYXRlVGFyZ2V0ICk7XG5cdFx0dmFyICRzbGlkZW91dCA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKTtcblx0XHRpZiAoICRzbGlkZW91dC5oYXNDbGFzcyggXCJoaWRkZW5cIiApICkge1xuXHRcdFx0b3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIl19
