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
				// jQuery equivalent of `continue` within an `each()` loop.
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
		// Bail if there are no tables.
		if (!window.wpseoScrollableTables.length) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7Ozs7OztBQU9BLFVBQVMsMkJBQVQsR0FBdUM7QUFDdEMsTUFBSyxPQUFPLE9BQU8seUJBQWQsS0FBNEMsV0FBNUMsSUFBMkQsT0FBTyxPQUFQLEtBQW1CLFdBQW5GLEVBQWlHO0FBQ2hHO0FBQ0E7O0FBRUQ7QUFDQSxPQUFNLElBQUksUUFBUSxDQUFsQixFQUFxQixRQUFRLDBCQUEwQixNQUF2RCxFQUErRCxPQUEvRCxFQUF5RTtBQUN4RSxXQUFRLElBQVIsQ0FBYywwQkFBMkIsS0FBM0IsQ0FBZDtBQUNBO0FBQ0Q7QUFDQTs7QUFFRCxRQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FBMEIsMkJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyx5QkFBVCxDQUFvQyxLQUFwQyxFQUE0QztBQUMzQyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsOEJBRGE7QUFFckIsYUFBVTtBQUZXLEdBQXRCO0FBS0E7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUErQztBQUM5QyxTQUFPLElBQVAsQ0FBYSxPQUFiLEVBQXNCO0FBQ3JCLFdBQVEsa0JBRGE7QUFFckIsV0FBUSxNQUZhO0FBR3JCLGFBQVU7QUFIVyxHQUF0QixFQUlHLFVBQVUsSUFBVixFQUFpQjtBQUNuQixPQUFLLElBQUwsRUFBWTtBQUNYLFdBQVEsTUFBTSxJQUFkLEVBQXFCLElBQXJCO0FBQ0EsV0FBUSxvQkFBb0IsTUFBNUIsRUFBcUMsR0FBckMsQ0FBMEMsUUFBMUM7QUFDQTtBQUNELEdBVEQ7QUFXQTs7QUFFRDs7Ozs7OztBQU9BLFVBQVMsZ0JB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SUFBRyxvQkFBSCxFQUEwQixJQUExQjtBQUNBOztBQUVELEdBQUcsVUFBSCxFQUFnQixLQUFoQixDQUF1QixZQUFXO0FBQ2pDO0FBQ0EsRUFGRDs7QUFJQSxHQUFHLDRCQUFILEVBQWtDLEVBQWxDLENBQXNDLE9BQXRDLEVBQStDLG9DQUEvQyxFQUFxRixVQUFVLENBQVYsRUFBYztBQUNsRyxNQUFJLGFBQWEsRUFBRyxFQUFFLGNBQUwsQ0FBakI7QUFDQSxNQUFJLFlBQVksV0FBVyxJQUFYLENBQWlCLDJCQUFqQixDQUFoQjtBQUNBLE1BQUssVUFBVSxRQUFWLENBQW9CLFFBQXBCLENBQUwsRUFBc0M7QUFDckMscUJBQW1CLFVBQW5CO0FBQ0EsR0FGRCxNQUVPO0FBQ047QUFDQTtBQUNELEVBUkQ7QUFTQSxDQTNoQkMsRUEyaEJDLE1BM2hCRCxDQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgd3BzZW9BZG1pbkdsb2JhbEwxMG4sIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCAkICkge1xuXHQvKipcblx0ICogRGlzcGxheXMgY29uc29sZSBub3RpZmljYXRpb25zLlxuXHQgKlxuXHQgKiBMb29rcyBhdCBhIGdsb2JhbCB2YXJpYWJsZSB0byBkaXNwbGF5IGFsbCBub3RpZmljYXRpb25zIGluIHRoZXJlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucygpIHtcblx0XHRpZiAoIHR5cGVvZiB3aW5kb3cud3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zLmxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRcdGNvbnNvbGUud2Fybiggd3BzZW9Db25zb2xlTm90aWZpY2F0aW9uc1sgaW5kZXggXSApO1xuXHRcdH1cblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMgKTtcblxuXHQvKipcblx0ICogVXNlZCB0byBkaXNtaXNzIHRoZSB0YWdsaW5lIG5vdGljZSBmb3IgYSBzcGVjaWZpYyB1c2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgTm9uY2UgZm9yIHZlcmlmaWNhdGlvbi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlKCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX2Rpc21pc3NfdGFnbGluZV9ub3RpY2VcIixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIHJlbW92ZSB0aGUgYWRtaW4gbm90aWNlcyBmb3Igc2V2ZXJhbCBwdXJwb3NlcywgZGllcyBvbiBleGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uIFRoZSBvcHRpb24gdG8gaWdub3JlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaGlkZSAgIFRoZSB0YXJnZXQgZWxlbWVudCB0byBoaWRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgIE5vbmNlIGZvciB2ZXJpZmljYXRpb24uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TZXRJZ25vcmUoIG9wdGlvbiwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19zZXRfaWdub3JlXCIsXG5cdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIjaGlkZGVuX2lnbm9yZV9cIiArIG9wdGlvbiApLnZhbCggXCJpZ25vcmVcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIGRpc21pc3NhYmxlIGFuY2hvciBidXR0b24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkaXNtaXNzTGluayBUaGUgVVJMIHRoYXQgbGVhZHMgdG8gdGhlIGRpc21pc3Npbmcgb2YgdGhlIG5vdGljZS5cblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gQW5jaG9yIHRvIGRpc21pc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NMaW5rKCBkaXNtaXNzTGluayApIHtcblx0XHRyZXR1cm4galF1ZXJ5KFxuXHRcdFx0JzxhIGhyZWY9XCInICsgZGlzbWlzc0xpbmsgKyAnXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibm90aWNlLWRpc21pc3NcIj4nICtcblx0XHRcdCc8c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPkRpc21pc3MgdGhpcyBub3RpY2UuPC9zcGFuPicgK1xuXHRcdFx0XCI8L2E+XCJcblx0XHQpO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIFwiLnlvYXN0LWRpc21pc3NpYmxlXCIgKS5vbiggXCJjbGlja1wiLCBcIi55b2FzdC1ub3RpY2UtZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkcGFyZW50RGl2ID0galF1ZXJ5KCB0aGlzICkucGFyZW50KCk7XG5cblx0XHRcdC8vIERlcHJlY2F0ZWQsIHRvZG86IHJlbW92ZSB3aGVuIGFsbCBub3RpZmllcnMgaGF2ZSBiZWVuIGltcGxlbWVudGVkLlxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICkucmVwbGFjZSggLy0vZywgXCJfXCIgKSxcblx0XHRcdFx0XHRfd3Bub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3Nfbm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JHBhcmVudERpdi5mYWRlVG8oIDEwMCwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRwYXJlbnREaXYuc2xpZGVVcCggMTAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkcGFyZW50RGl2LnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ICk7XG5cblx0XHRqUXVlcnkoIFwiLnlvYXN0LWhlbHAtYnV0dG9uXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkYnV0dG9uID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdGhlbHBQYW5lbCA9IGpRdWVyeSggXCIjXCIgKyAkYnV0dG9uLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoIFwiOnZpc2libGVcIiApO1xuXG5cdFx0XHRqUXVlcnkoIGhlbHBQYW5lbCApLnNsaWRlVG9nZ2xlKCAyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkYnV0dG9uLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIGlzUGFuZWxWaXNpYmxlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlID0gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZTtcblx0d2luZG93Lndwc2VvU2V0SWdub3JlID0gd3BzZW9TZXRJZ25vcmU7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NMaW5rID0gd3BzZW9EaXNtaXNzTGluaztcblxuXHQvKipcblx0ICogSGlkZXMgcG9wdXAgc2hvd2luZyBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaGlkZUFsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gUmVtb3ZlIHRoZSBuYW1lc3BhY2VkIGhvdmVyIGV2ZW50IGZyb20gdGhlIG1lbnUgdG9wIGxldmVsIGxpc3QgaXRlbXMuXG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vZmYoIFwibW91c2VlbnRlci55b2FzdGFsZXJ0cG9wdXAgbW91c2VsZWF2ZS55b2FzdGFsZXJ0cG9wdXBcIiApO1xuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBieSBmYWRpbmcgaXQgb3V0LlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKS5mYWRlT3V0KCAyMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93cyBwb3B1cCB3aXRoIG5ldyBhbGVydHMgbWVzc2FnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93QWxlcnRQb3B1cCgpIHtcblx0XHQvLyBBdHRhY2ggYW4gaG92ZXIgZXZlbnQgYW5kIHNob3cgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBieSBmYWRpbmcgaXQgaW4uXG5cdFx0JCggXCIueW9hc3QtaXNzdWUtYWRkZWRcIiApXG5cdFx0XHQub24oIFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdC8vIEF2b2lkIHRoZSBob3ZlciBldmVudCB0byBwcm9wYWdhdGUgb24gdGhlIHBhcmVudCBlbGVtZW50cy5cblx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyBvbiBpdC5cblx0XHRcdFx0aGlkZUFsZXJ0UG9wdXAoKTtcblx0XHRcdH0gKVxuXHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0Lypcblx0XHQgKiBBdHRhY2ggYSBuYW1lc3BhY2VkIGhvdmVyIGV2ZW50IG9uIHRoZSBtZW51IHRvcCBsZXZlbCBpdGVtcyB0byBoaWRlXG5cdFx0ICogdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCB3aGVuIGhvdmVyaW5nIHRoZW0uXG5cdFx0ICogTm90ZTogdGhpcyB3aWxsIHdvcmsganVzdCB0aGUgZmlyc3QgdGltZSB0aGUgbGlzdCBpdGVtcyBnZXQgaG92ZXJlZCBpbiB0aGVcblx0XHQgKiBmaXJzdCAzIHNlY29uZHMgYWZ0ZXIgRE9NIHJlYWR5IGJlY2F1c2UgdGhpcyBldmVudCBpcyB0aGVuIHJlbW92ZWQuXG5cdFx0ICovXG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vbiggXCJtb3VzZWVudGVyLnlvYXN0YWxlcnRwb3B1cCBtb3VzZWxlYXZlLnlvYXN0YWxlcnRwb3B1cFwiLCBoaWRlQWxlcnRQb3B1cCApO1xuXG5cdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGFmdGVyIDMgc2Vjb25kcyBmcm9tIERPTSByZWFkeS5cblx0XHRzZXRUaW1lb3V0KCBoaWRlQWxlcnRQb3B1cCwgMzAwMCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgZGlzbWlzcyBhbmQgcmVzdG9yZSBBSkFYIHJlc3BvbnNlcy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9ICRzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgQUpBWCByZXNwb25zZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlKCAkc291cmNlLCByZXNwb25zZSApIHtcblx0XHQkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApLm9mZiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiICk7XG5cblx0XHRpZiAoIHR5cGVvZiByZXNwb25zZS5odG1sID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggcmVzcG9uc2UuaHRtbCApIHtcblx0XHRcdCRzb3VyY2UuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKS5odG1sKCByZXNwb25zZS5odG1sICk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXHRcdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0XHRcdC8qIGVzbGludC1lbmFibGUgKi9cblx0XHR9XG5cblx0XHR2YXIgJHdwc2VvTWVudSA9ICQoIFwiI3dwLWFkbWluLWJhci13cHNlby1tZW51XCIgKTtcblx0XHR2YXIgJGlzc3VlQ291bnRlciA9ICR3cHNlb01lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cblx0XHRpZiAoICEgJGlzc3VlQ291bnRlci5sZW5ndGggKSB7XG5cdFx0XHQkd3BzZW9NZW51LmZpbmQoIFwiPiBhOmZpcnN0LWNoaWxkXCIgKS5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtaXNzdWUtY291bnRlclwiLz4nICk7XG5cdFx0XHQkaXNzdWVDb3VudGVyID0gJHdwc2VvTWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblx0XHR9XG5cblx0XHQkaXNzdWVDb3VudGVyLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdFx0aWYgKCByZXNwb25zZS50b3RhbCA9PT0gMCApIHtcblx0XHRcdCRpc3N1ZUNvdW50ZXIuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaXNzdWVDb3VudGVyLnNob3coKTtcblx0XHR9XG5cblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAudXBkYXRlLXBsdWdpbnNcIiApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoIFwidXBkYXRlLXBsdWdpbnMgY291bnQtXCIgKyByZXNwb25zZS50b3RhbCApO1xuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC5wbHVnaW4tY291bnRcIiApLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdH1cblxuXHQvKipcblx0ICogSG9va3MgdGhlIHJlc3RvcmUgYW5kIGRpc21pc3MgYnV0dG9ucy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCkge1xuXHRcdHZhciAkZGlzbWlzc2libGUgPSAkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLW5vLWFsdFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9yZXN0b3JlX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb2xvciBvZiB0aGUgc3ZnIGZvciB0aGUgcHJlbWl1bSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIGNvbG9yIG9mIHRoZSBjb2xvciBzY2hlbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCkge1xuXHRcdGxldCAkcHJlbWl1bUluZGljYXRvciA9IGpRdWVyeSggXCIud3BzZW8tanMtcHJlbWl1bS1pbmRpY2F0b3JcIiApO1xuXHRcdGxldCAkc3ZnID0gJHByZW1pdW1JbmRpY2F0b3IuZmluZCggXCJzdmdcIiApO1xuXG5cdFx0Ly8gRG9uJ3QgY2hhbmdlIHRoZSBjb2xvciB0byBzdGFuZCBvdXQgd2hlbiBwcmVtaXVtIGlzIGFjdHVhbGx5IGVuYWJsZWQuXG5cdFx0aWYgKCAkcHJlbWl1bUluZGljYXRvci5oYXNDbGFzcyggXCJ3cHNlby1wcmVtaXVtLWluZGljYXRvci0tbm9cIiApICkge1xuXHRcdFx0bGV0ICRzdmdQYXRoID0gJHN2Zy5maW5kKCBcInBhdGhcIiApO1xuXG5cdFx0XHRsZXQgYmFja2dyb3VuZENvbG9yID0gJHByZW1pdW1JbmRpY2F0b3IuY3NzKCBcImJhY2tncm91bmRDb2xvclwiICk7XG5cblx0XHRcdCRzdmdQYXRoLmNzcyggXCJmaWxsXCIsIGJhY2tncm91bmRDb2xvciApO1xuXHRcdH1cblxuXHRcdCRzdmcuY3NzKCBcImRpc3BsYXlcIiwgXCJibG9ja1wiICk7XG5cdFx0JHByZW1pdW1JbmRpY2F0b3IuY3NzKCB7XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdHdpZHRoOiBcIjIwcHhcIixcblx0XHRcdGhlaWdodDogXCIyMHB4XCIsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBhIHNjcm9sbGFibGUgdGFibGUgd2lkdGguXG5cdCAqXG5cdCAqIENvbXBhcmVzIHRoZSBzY3JvbGxhYmxlIHRhYmxlIHdpZHRoIGFnYWluc3QgdGhlIHNpemUgb2YgaXRzIGNvbnRhaW5lciBhbmRcblx0ICogYWRkcyBvciByZW1vdmVzIENTUyBjbGFzc2VzIGFjY29yZGluZ2x5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGFibGUgQSBqUXVlcnkgb2JqZWN0IHdpdGggb25lIHNjcm9sbGFibGUgdGFibGUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tTY3JvbGxhYmxlVGFibGVTaXplKCB0YWJsZSApIHtcblx0XHQvLyBCYWlsIGlmIHRoZSB0YWJsZSBpcyBoaWRkZW4uXG5cdFx0aWYgKCB0YWJsZS5pcyggXCI6aGlkZGVuXCIgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSB0YWJsZSBpcyB3aWRlciB0aGFuIGl0cyBwYXJlbnQsIG1ha2UgaXQgc2Nyb2xsYWJsZS5cblx0XHRpZiAoIHRhYmxlLm91dGVyV2lkdGgoKSA+IHRhYmxlLnBhcmVudCgpLm91dGVyV2lkdGgoKSApIHtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsSGludFwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsSGludFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB0aGUgd2lkdGggb2YgbXVsdGlwbGUgc2Nyb2xsYWJsZSB0YWJsZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB0YWJsZXMgQSBqUXVlcnkgY29sbGVjdGlvbiBvZiBzY3JvbGxhYmxlIHRhYmxlcy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIHRhYmxlcyApIHtcblx0XHR0YWJsZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjaGVja1Njcm9sbGFibGVUYWJsZVNpemUoICQoIHRoaXMgKSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYWtlcyB0YWJsZXMgc2Nyb2xsYWJsZS5cblx0ICpcblx0ICogVXNhZ2U6IHNlZSByZWxhdGVkIHN0eWxlc2hlZXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpIHtcblx0XHQvLyBHZXQgdGhlIHRhYmxlcyBlbGVjdGVkIHRvIGJlIHNjcm9sbGFibGUgYW5kIHN0b3JlIHRoZW0gZm9yIGxhdGVyIHJldXNlLlxuXHRcdHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMgPSAkKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlXCIgKTtcblxuXHRcdC8vIEJhaWwgaWYgdGhlcmUgYXJlIG5vIHRhYmxlcy5cblx0XHRpZiAoICEgd2luZG93Lndwc2VvU2Nyb2xsYWJsZVRhYmxlcy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gTG9vcCBvdmVyIHRoZSBjb2xsZWN0aW9uIG9mIHRhYmxlcyBhbmQgYnVpbGQgc29tZSBIVE1MIGFyb3VuZCB0aGVtLlxuXHRcdHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGFibGUgPSAkKCB0aGlzICk7XG5cblx0XHRcdC8vIENvbnRpbnVlIGlmIHRoZSB0YWJsZSBhbHJlYWR5IGhhcyB0aGUgbmVjZXNzYXJ5IG1hcmt1cC5cblx0XHRcdGlmICggdGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApICkge1xuXHRcdFx0XHQvLyBqUXVlcnkgZXF1aXZhbGVudCBvZiBgY29udGludWVgIHdpdGhpbiBhbiBgZWFjaCgpYCBsb29wLlxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8qXG5cdFx0XHQgKiBDcmVhdGUgYW4gZWxlbWVudCB3aXRoIGEgaGludCBtZXNzYWdlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIERPTVxuXHRcdFx0ICogYmVmb3JlIGVhY2ggdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBzY3JvbGxIaW50ID0gJCggXCI8ZGl2IC8+XCIsIHtcblx0XHRcdFx0XCJjbGFzc1wiOiBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPHNwYW4gY2xhc3M9J3lvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnQnIGFyaWEtaGlkZGVuPSd0cnVlJyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggdGFibGUgKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhIHdyYXBwZXIgZWxlbWVudCB3aXRoIGFuIGlubmVyIGRpdiBuZWNlc3NhcnkgZm9yXG5cdFx0XHQgKiBzdHlsaW5nIGFuZCBpbnNlcnQgdGhlbSBpbiB0aGUgRE9NIGJlZm9yZSBlYWNoIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHR2YXIgc2Nyb2xsQ29udGFpbmVyID0gJCggXCI8ZGl2IC8+XCIsIHtcblx0XHRcdFx0XCJjbGFzc1wiOiBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2NvbnRhaW5lclwiLFxuXHRcdFx0XHRodG1sOiBcIjxkaXYgY2xhc3M9J3lvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2lubmVyJyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggdGFibGUgKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBoaW50IG1lc3NhZ2UgdGV4dC5cblx0XHRcdHNjcm9sbEhpbnQuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludFwiICkudGV4dCggd3BzZW9BZG1pbkdsb2JhbEwxMG4uc2Nyb2xsYWJsZV90YWJsZV9oaW50ICk7XG5cblx0XHRcdC8vIEZvciBlYWNoIHRhYmxlLCBzdG9yZSBhIHJlZmVyZW5jZSB0byBpdHMgd3JhcHBlciBlbGVtZW50LlxuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiwgc2Nyb2xsQ29udGFpbmVyICk7XG5cblx0XHRcdC8vIEZvciBlYWNoIHRhYmxlLCBzdG9yZSBhIHJlZmVyZW5jZSB0byBpdHMgaGludCBtZXNzYWdlLlxuXHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxIaW50XCIsIHNjcm9sbEhpbnQgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgc2Nyb2xsYWJsZSB0YWJsZSBpbnNpZGUgdGhlIHdyYXBwZXIuXG5cdFx0XHR0YWJsZS5hcHBlbmRUbyggc2Nyb2xsQ29udGFpbmVyLmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2lubmVyXCIgKSApO1xuXG5cdFx0XHQvLyBDaGVjayBlYWNoIHRhYmxlJ3Mgd2lkdGguXG5cdFx0XHRjaGVja1Njcm9sbGFibGVUYWJsZVNpemUoIHRhYmxlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Lypcblx0ICogV2hlbiB0aGUgdmlld3BvcnQgc2l6ZSBjaGFuZ2VzLCBjaGVjayBhZ2FpbiB0aGUgc2Nyb2xsYWJsZSB0YWJsZXMgd2lkdGguXG5cdCAqIEFib3V0IHRoZSBldmVudHM6IHRlY2huaWNhbGx5IGB3cC13aW5kb3ctcmVzaXplZGAgaXMgdHJpZ2dlcmVkIG9uIHRoZVxuXHQgKiBib2R5IGJ1dCBzaW5jZSBpdCBidWJibGVzLCBpdCBoYXBwZW5zIGFsc28gb24gdGhlIHdpbmRvdy5cblx0ICogQWxzbywgaW5zdGVhZCBvZiB0cnlpbmcgdG8gZGV0ZWN0IGV2ZW50cyBzdXBwb3J0IG9uIGRldmljZXMgYW5kIGJyb3dzZXJzLFxuXHQgKiB3ZSBqdXN0IHJ1biB0aGUgY2hlY2sgb24gYm90aCBgd3Atd2luZG93LXJlc2l6ZWRgIGFuZCBgb3JpZW50YXRpb25jaGFuZ2VgLlxuXHQgKi9cblx0JCggd2luZG93ICkub24oIFwid3Atd2luZG93LXJlc2l6ZWQgb3JpZW50YXRpb25jaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBpZiB0aGVyZSBhcmUgbm8gdGFibGVzLlxuXHRcdGlmICggISB3aW5kb3cud3BzZW9TY3JvbGxhYmxlVGFibGVzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjaGVja011bHRpcGxlU2Nyb2xsYWJsZVRhYmxlc1NpemUoIHdpbmRvdy53cHNlb1Njcm9sbGFibGVUYWJsZXMgKTtcblx0fSApO1xuXG5cdC8qXG5cdCAqIEdlbmVyYXRlcyB0aGUgc2Nyb2xsYWJsZSB0YWJsZXMgbWFya3VvIHdoZW4gdGhlIHJlYWN0IHRhYnMgYXJlIG1vdW50ZWQsXG5cdCAqIHdoZW4gYSB0YWJsZSBpcyBpbiB0aGUgYWN0aXZlIHRhYi4gT3IsIGdlbmVyYXRlcyB0aGUgbWFya3VwIHdoZW4gYSByZWFjdFxuXHQgKiB0YWJzIGlzIHNlbGVjdGVkLiBVc2VzIGEgdGltZW91dCB0byB3YWl0IGZvciB0aGUgSFRNTCBpbmplY3Rpb24gb2YgdGhlIHRhYmxlLlxuXHQgKi9cblx0JCggd2luZG93ICkub24oIHtcblx0XHRcIllvYXN0OllvYXN0VGFic01vdW50ZWRcIjogZnVuY3Rpb24oKSB7XG5cdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y3JlYXRlU2Nyb2xsYWJsZVRhYmxlcygpO1xuXHRcdFx0fSwgMTAwICk7XG5cdFx0fSxcblx0XHRcIllvYXN0OllvYXN0VGFic1NlbGVjdGVkXCI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKTtcblx0XHRcdH0sIDEwMCApO1xuXHRcdH1cblx0fSApO1xuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHNob3dBbGVydFBvcHVwKCk7XG5cdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpO1xuXHRcdGNyZWF0ZVNjcm9sbGFibGVUYWJsZXMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBTdGFydHMgdmlkZW8gaWYgZm91bmQgb24gdGhlIHRhYi5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlVmlkZW8oICR0YWIgKSB7XG5cdFx0dmFyICRkYXRhID0gJHRhYi5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApO1xuXHRcdGlmICggJGRhdGEubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCRkYXRhLmFwcGVuZCggJzxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCInICsgJGRhdGEuZGF0YSggXCJ1cmxcIiApICsgJ1wiIHRpdGxlPVwiJyArIHdwc2VvQWRtaW5HbG9iYWxMMTBuLmhlbHBfdmlkZW9faWZyYW1lX3RpdGxlICsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nICk7XG5cdH1cblxuXHQvKipcblx0ICogU3RvcHMgcGxheWluZyBhbnkgdmlkZW8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcFZpZGVvcygpIHtcblx0XHQkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIGEgdGFiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBDb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgdGFiLlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHRhYiBUYWIgdGhhdCBpcyBhY3RpdmF0ZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICR0YWIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi55b2FzdC1oZWxwLWNlbnRlci10YWJzLXdyYXAgZGl2XCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdCR0YWIuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblx0XHRhY3RpdmF0ZVZpZGVvKCAkdGFiICk7XG5cdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCAkdGFiLmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVcIiApICk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgdGhlIFZpZGVvIFNsaWRlb3V0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBUYWIgdG8gb3BlbiB2aWRlbyBzbGlkZXIgb2YuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gb3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKSB7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLnJlbW92ZUNsYXNzKCBcImhpZGRlblwiICk7XG5cblx0XHR2YXIgJGFjdGl2ZVRhYkxpbmsgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0uYWN0aXZlID4gYVwiICk7XG5cblx0XHQkKCBcIiN3cGNvbnRlbnRcIiApLmFkZENsYXNzKCBcInlvYXN0LWhlbHAtY2VudGVyLW9wZW5cIiApO1xuXG5cdFx0aWYgKCAkYWN0aXZlVGFiTGluay5sZW5ndGggPiAwICkge1xuXHRcdFx0dmFyIGFjdGl2ZVRhYklkID0gJGFjdGl2ZVRhYkxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSxcblx0XHRcdFx0YWN0aXZlVGFiID0gJCggXCIjXCIgKyBhY3RpdmVUYWJJZCApO1xuXG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCBhY3RpdmVUYWIgKTtcblxuXHRcdFx0Y2hlY2tNdWx0aXBsZVNjcm9sbGFibGVUYWJsZXNTaXplKCBhY3RpdmVUYWIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZVwiICkgKTtcblxuXHRcdFx0JGNvbnRhaW5lci5vbiggXCJjbGlja1wiLCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtID4gYVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyICRsaW5rID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gJGxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblxuXHRcdFx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW1cIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdCRsaW5rLnBhcmVudCgpLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdFx0b3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICQoIFwiI1wiICsgdGFyZ2V0ICkgKTtcblxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRvZG86IGNvbnNpZGVyIGlmIHNjcm9sbGFibGUgdGFibGVzIG5lZWQgdG8gYmUgY2hlY2tlZCBoZXJlIHRvby5cblx0XHRcdGFjdGl2YXRlVmlkZW8oICRjb250YWluZXIgKTtcblx0XHR9XG5cblx0XHQkKCBcIiNzaWRlYmFyLWNvbnRhaW5lclwiICkuaGlkZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgVmlkZW8gU2xpZGVvdXQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvc2VWaWRlb1NsaWRlb3V0KCkge1xuXHRcdHZhciAkY29udGFpbmVyID0gJCggXCIjd3Bib2R5LWNvbnRlbnRcIiApLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKS5hZGRDbGFzcyggXCJoaWRkZW5cIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi50b2dnbGVfX2Fycm93XCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiICkuYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIiApO1xuXG5cdFx0JCggXCIjd3Bjb250ZW50XCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oZWxwLWNlbnRlci1vcGVuXCIgKTtcblx0XHQkKCBcIiNzaWRlYmFyLWNvbnRhaW5lclwiICkuc2hvdygpO1xuXHR9XG5cblx0JCggXCIubmF2LXRhYlwiICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdGNsb3NlVmlkZW9TbGlkZW91dCgpO1xuXHR9ICk7XG5cblx0JCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICkub24oIFwiY2xpY2tcIiwgXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciAkY29udGFpbmVyID0gJCggZS5kZWxlZ2F0ZVRhcmdldCApO1xuXHRcdHZhciAkc2xpZGVvdXQgPSAkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICk7XG5cdFx0aWYgKCAkc2xpZGVvdXQuaGFzQ2xhc3MoIFwiaGlkZGVuXCIgKSApIHtcblx0XHRcdG9wZW5WaWRlb1NsaWRlb3V0KCAkY29udGFpbmVyICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsb3NlVmlkZW9TbGlkZW91dCgpO1xuXHRcdH1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiJdfQ==
