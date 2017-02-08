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
})();

(function () {
	"use strict";

	var $ = jQuery;

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
  * Makes tables scrollable.
  *
  * Usage: see related stylesheet.
  *
  * @returns {void}
  */
	function createScrollableTables() {
		$(".yoast-table-scrollable").each(function () {
			var $table = $(this);

			/*
    * Create an element with a hint message and insert it in the DOM
    * before each table.
    */
			var $scrollHint = $("<div />", {
				"class": "yoast-table-scrollable__hintwrapper",
				html: "<span class='yoast-table-scrollable__hint' aria-hidden='true' />"
			}).insertBefore($table);

			// Set the hint message text.
			$scrollHint.find(".yoast-table-scrollable__hint").text(wpseoAdminGlobalL10n.scrollable_table_hint);

			/*
    * Create a wrapper element with an inner div necessary for
    * styling and insert them in the DOM before each table.
    */
			var $scrollContainer = $("<div />", {
				"class": "yoast-table-scrollable__container",
				html: "<div class='yoast-table-scrollable__inner' />"
			}).insertBefore($table);

			// For each table, store a reference to its wrapper element.
			$table.data("scrollContainer", $scrollContainer);

			// Move the scrollable table inside the wrapper.
			$table.appendTo($scrollContainer.find(".yoast-table-scrollable__inner"));

			checkScrollableTablesSize($table);
		});
	}

	/**
  * Checks the scrollable tables size.
  *
  * Compares the scrollable tables size against their parent container and
  * adds or removes CSS classes accordingly.
  *
  * @returns {void}
  */
	function checkScrollableTablesSize($table) {
		console.log("checking tables", $table);
		// Check if the table is wider than its parent.
		if ($table.outerWidth() > $table.parent().outerWidth()) {
			$(".yoast-table-scrollable__hintwrapper").addClass("yoast-has-scroll");
			$table.data("scrollContainer").addClass("yoast-has-scroll");
		}

		/*
   * When the viewport size changes, check again the elements size.
   * About the events: technically `wp-window-resized` is triggered on
   * the body but since it bubbles, it happens also on the window.
   * Also, instead of trying to detect events support on devices and
   * browsers, we just run the check on both `wp-window-resized` and
   * `orientationchange`. We also need a custom event, for example
   * when tables inside the Help Center tabs become visible.
   */
		$(window).on("wp-window-resized orientationchange yoast-table-scrollable-check-size", function () {

			// Skip hidden tables.
			if ($table.is(":hidden")) {
				// Equivalent of 'continue' for jQuery loop.
				return true;
			}

			if ($table.outerWidth() > $table.parent().outerWidth()) {
				$(".yoast-table-scrollable__hintwrapper").addClass("yoast-has-scroll");
				$table.data("scrollContainer").addClass("yoast-has-scroll");
			} else {
				$(".yoast-table-scrollable__hintwrapper").removeClass("yoast-has-scroll");
				$table.data("scrollContainer").removeClass("yoast-has-scroll");
			}
		});
	}

	$(document).ready(function () {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
		createScrollableTables();
	});
})();

(function () {
	"use strict";

	var $ = jQuery;

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
		// The first tab might contain scrollable tables: trigger a custom event to check their size.
		$(window).trigger("yoast-table-scrollable-check-size");

		if ($activeTabLink.length > 0) {
			var activeTab = $activeTabLink.attr("aria-controls");
			activateVideo($("#" + activeTab));

			$container.on("click", ".wpseo-help-center-item > a", function (e) {
				var $link = $(this);
				var target = $link.attr("aria-controls");

				$container.find(".wpseo-help-center-item").removeClass("active");
				$link.parent().addClass("active");

				openHelpCenterTab($container, $("#" + target));
				// Trigger a custom event to check the scrollable tables size.
				$(window).trigger("yoast-table-scrollable-check-size");

				e.preventDefault();
			});
		} else {
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
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsYUFBVztBQUNaOzs7Ozs7O0FBT0EsVUFBUywyQkFBVCxHQUF1QztBQUN0QyxNQUFLLE9BQU8sT0FBTyx5QkFBZCxLQUE0QyxXQUE1QyxJQUEyRCxPQUFPLE9BQVAsS0FBbUIsV0FBbkYsRUFBaUc7QUFDaEc7QUFDQTs7QUFFRDtBQUNBLE9BQU0sSUFBSSxRQUFRLENBQWxCLEVBQXFCLFFBQVEsMEJBQTBCLE1BQXZELEVBQStELE9BQS9ELEVBQXlFO0FBQ3hFLFdBQVEsSUFBUixDQUFjLDBCQUEyQixLQUEzQixDQUFkO0FBQ0E7QUFDRDtBQUNBOztBQUVELFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQiwyQkFBMUI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLEtBQXBDLEVBQTRDO0FBQzNDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSw4QkFEYTtBQUVyQixhQUFVO0FBRlcsR0FBdEI7QUFLQTs7QUFFRDs7Ozs7Ozs7O0FBU0EsVUFBUyxjQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLEtBQXZDLEVBQStDO0FBQzlDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSxrQkFEYTtBQUVyQixXQUFRLE1BRmE7QUFHckIsYUFBVTtBQUhXLEdBQXRCLEVBSUcsVUFBVSxJQUFWLEVBQWlCO0FBQ25CLE9BQUssSUFBTCxFQUFZO0FBQ1gsV0FBUSxNQUFNLElBQWQsRUFBcUIsSUFBckI7QUFDQSxXQUFRLG9CQUFvQixNQUE1QixFQUFxQyxHQUFyQyxDQUEwQyxRQUExQztBQUNBO0FBQ0QsR0FURDtBQVdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxnQkFBVCxDQUEyQixZ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QUFTQSxDQXhIQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgd3BzZW9BZG1pbkdsb2JhbEwxMG4sIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogRGlzcGxheXMgY29uc29sZSBub3RpZmljYXRpb25zLlxuXHQgKlxuXHQgKiBMb29rcyBhdCBhIGdsb2JhbCB2YXJpYWJsZSB0byBkaXNwbGF5IGFsbCBub3RpZmljYXRpb25zIGluIHRoZXJlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucygpIHtcblx0XHRpZiAoIHR5cGVvZiB3aW5kb3cud3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zLmxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRcdGNvbnNvbGUud2Fybiggd3BzZW9Db25zb2xlTm90aWZpY2F0aW9uc1sgaW5kZXggXSApO1xuXHRcdH1cblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMgKTtcblxuXHQvKipcblx0ICogVXNlZCB0byBkaXNtaXNzIHRoZSB0YWdsaW5lIG5vdGljZSBmb3IgYSBzcGVjaWZpYyB1c2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlKCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX2Rpc21pc3NfdGFnbGluZV9ub3RpY2VcIixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIHJlbW92ZSB0aGUgYWRtaW4gbm90aWNlcyBmb3Igc2V2ZXJhbCBwdXJwb3NlcywgZGllcyBvbiBleGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0SWdub3JlKCBvcHRpb24sIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X2lnbm9yZVwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2hpZGRlbl9pZ25vcmVfXCIgKyBvcHRpb24gKS52YWwoIFwiaWdub3JlXCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSBkaXNtaXNzYWJsZSBhbmNob3IgYnV0dG9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGlzbWlzc19saW5rIFRoZSBVUkwgdGhhdCBsZWFkcyB0byB0aGUgZGlzbWlzc2luZyBvZiB0aGUgbm90aWNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSBBbmNob3IgdG8gZGlzbWlzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc0xpbmsoIGRpc21pc3NfbGluayApIHtcblx0XHRyZXR1cm4galF1ZXJ5KFxuXHRcdFx0JzxhIGhyZWY9XCInICsgZGlzbWlzc19saW5rICsgJ1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5vdGljZS1kaXNtaXNzXCI+JyArXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJzY3JlZW4tcmVhZGVyLXRleHRcIj5EaXNtaXNzIHRoaXMgbm90aWNlLjwvc3Bhbj4nICtcblx0XHRcdFwiPC9hPlwiXG5cdFx0KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1kaXNtaXNzaWJsZVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3Qtbm90aWNlLWRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBhcmVudERpdiA9IGpRdWVyeSggdGhpcyApLnBhcmVudCgpO1xuXG5cdFx0XHQvLyBEZXByZWNhdGVkLCB0b2RvOiByZW1vdmUgd2hlbiBhbGwgbm90aWZpZXJzIGhhdmUgYmVlbiBpbXBsZW1lbnRlZC5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC8tL2csIFwiX1wiICksXG5cdFx0XHRcdFx0X3dwbm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX25vdGlmaWNhdGlvblwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCRwYXJlbnREaXYuZmFkZVRvKCAxMDAsIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkcGFyZW50RGl2LnNsaWRlVXAoIDEwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHBhcmVudERpdi5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSApO1xuXG5cdFx0alF1ZXJ5KCBcIi55b2FzdC1oZWxwLWJ1dHRvblwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSBqUXVlcnkoIFwiI1wiICsgJGJ1dHRvbi5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApICksXG5cdFx0XHRcdGlzUGFuZWxWaXNpYmxlID0gaGVscFBhbmVsLmlzKCBcIjp2aXNpYmxlXCIgKTtcblxuXHRcdFx0alF1ZXJ5KCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fSApO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZSA9IHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2U7XG5cdHdpbmRvdy53cHNlb1NldElnbm9yZSA9IHdwc2VvU2V0SWdub3JlO1xuXHR3aW5kb3cud3BzZW9EaXNtaXNzTGluayA9IHdwc2VvRGlzbWlzc0xpbms7XG59KCkgKTtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyICQgPSBqUXVlcnk7XG5cblx0LyoqXG5cdCAqIEhpZGVzIHBvcHVwIHNob3dpbmcgbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBbGVydFBvcHVwKCkge1xuXHRcdC8vIFJlbW92ZSB0aGUgbmFtZXNwYWNlZCBob3ZlciBldmVudCBmcm9tIHRoZSBtZW51IHRvcCBsZXZlbCBsaXN0IGl0ZW1zLlxuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub2ZmKCBcImhvdmVyLnlvYXN0YWxlcnRwb3B1cFwiICk7XG5cdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBvdXQuXG5cdFx0JCggXCIueW9hc3QtaXNzdWUtYWRkZWRcIiApLmZhZGVPdXQoIDIwMCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3dzIHBvcHVwIHdpdGggbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dBbGVydFBvcHVwKCkge1xuXHRcdC8vIEF0dGFjaCBhbiBob3ZlciBldmVudCBhbmQgc2hvdyB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBpbi5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiIClcblx0XHRcdC5vbiggXCJob3ZlclwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHQvLyBBdm9pZCB0aGUgaG92ZXIgZXZlbnQgdG8gcHJvcGFnYXRlIG9uIHRoZSBwYXJlbnQgZWxlbWVudHMuXG5cdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIHdoZW4gaG92ZXJpbmcgb24gaXQuXG5cdFx0XHRcdGhpZGVBbGVydFBvcHVwKCk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdC8qXG5cdFx0ICogQXR0YWNoIGEgbmFtZXNwYWNlZCBob3ZlciBldmVudCBvbiB0aGUgbWVudSB0b3AgbGV2ZWwgaXRlbXMgdG8gaGlkZVxuXHRcdCAqIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyB0aGVtLlxuXHRcdCAqIE5vdGU6IHRoaXMgd2lsbCB3b3JrIGp1c3QgdGhlIGZpcnN0IHRpbWUgdGhlIGxpc3QgaXRlbXMgZ2V0IGhvdmVyZWQgaW4gdGhlXG5cdFx0ICogZmlyc3QgMyBzZWNvbmRzIGFmdGVyIERPTSByZWFkeSBiZWNhdXNlIHRoaXMgZXZlbnQgaXMgdGhlbiByZW1vdmVkLlxuXHRcdCAqL1xuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub24oIFwiaG92ZXIueW9hc3RhbGVydHBvcHVwXCIsIGhpZGVBbGVydFBvcHVwICk7XG5cblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYWZ0ZXIgMyBzZWNvbmRzIGZyb20gRE9NIHJlYWR5LlxuXHRcdHNldFRpbWVvdXQoIGhpZGVBbGVydFBvcHVwLCAzMDAwICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBkaXNtaXNzIGFuZCByZXN0b3JlIEFKQVggcmVzcG9uc2VzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gJHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBBSkFYIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UoICRzb3VyY2UsIHJlc3BvbnNlICkge1xuXHRcdCQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICkub2ZmKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiApLm9mZiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIgKTtcblxuXHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmh0bWwgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCByZXNwb25zZS5odG1sICkge1xuXHRcdFx0JHNvdXJjZS5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApLmh0bWwoIHJlc3BvbnNlLmh0bWwgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlICovXG5cdFx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdFx0LyogZXNsaW50LWVuYWJsZSAqL1xuXHRcdH1cblxuXHRcdHZhciAkd3BzZW9fbWVudSA9ICQoIFwiI3dwLWFkbWluLWJhci13cHNlby1tZW51XCIgKTtcblx0XHR2YXIgJGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblxuXHRcdGlmICggISAkaXNzdWVfY291bnRlci5sZW5ndGggKSB7XG5cdFx0XHQkd3BzZW9fbWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblx0XHR9XG5cblx0XHQkaXNzdWVfY291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpc3N1ZV9jb3VudGVyLnNob3coKTtcblx0XHR9XG5cblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAudXBkYXRlLXBsdWdpbnNcIiApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoIFwidXBkYXRlLXBsdWdpbnMgY291bnQtXCIgKyByZXNwb25zZS50b3RhbCApO1xuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC5wbHVnaW4tY291bnRcIiApLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdH1cblxuXHQvKipcblx0ICogSG9va3MgdGhlIHJlc3RvcmUgYW5kIGRpc21pc3MgYnV0dG9ucy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCkge1xuXHRcdHZhciAkZGlzbWlzc2libGUgPSAkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLmRpc21pc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLW5vLWFsdFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9kaXNtaXNzX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICkuYWRkQ2xhc3MoIFwiZGFzaGljb25zLXJhbmRvbWl6ZVwiICk7XG5cblx0XHRcdCQucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9yZXN0b3JlX2FsZXJ0XCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkc291cmNlLmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkc291cmNlLmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRzb3VyY2UuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0aGFuZGxlRGlzbWlzc1Jlc3RvcmVSZXNwb25zZS5iaW5kKCB0aGlzLCAkc291cmNlICksXG5cdFx0XHRcdFwianNvblwiXG5cdFx0XHQpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBjb2xvciBvZiB0aGUgc3ZnIGZvciB0aGUgcHJlbWl1bSBpbmRpY2F0b3IgYmFzZWQgb24gdGhlIGNvbG9yIG9mIHRoZSBjb2xvciBzY2hlbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCkge1xuXHRcdGxldCAkcHJlbWl1bUluZGljYXRvciA9IGpRdWVyeSggXCIud3BzZW8tanMtcHJlbWl1bS1pbmRpY2F0b3JcIiApO1xuXHRcdGxldCAkc3ZnID0gJHByZW1pdW1JbmRpY2F0b3IuZmluZCggXCJzdmdcIiApO1xuXG5cdFx0Ly8gRG9uJ3QgY2hhbmdlIHRoZSBjb2xvciB0byBzdGFuZCBvdXQgd2hlbiBwcmVtaXVtIGlzIGFjdHVhbGx5IGVuYWJsZWQuXG5cdFx0aWYgKCAkcHJlbWl1bUluZGljYXRvci5oYXNDbGFzcyggXCJ3cHNlby1wcmVtaXVtLWluZGljYXRvci0tbm9cIiApICkge1xuXHRcdFx0bGV0ICRzdmdQYXRoID0gJHN2Zy5maW5kKCBcInBhdGhcIiApO1xuXG5cdFx0XHRsZXQgYmFja2dyb3VuZENvbG9yID0gJHByZW1pdW1JbmRpY2F0b3IuY3NzKCBcImJhY2tncm91bmRDb2xvclwiICk7XG5cblx0XHRcdCRzdmdQYXRoLmNzcyggXCJmaWxsXCIsIGJhY2tncm91bmRDb2xvciApO1xuXHRcdH1cblxuXHRcdCRzdmcuY3NzKCBcImRpc3BsYXlcIiwgXCJibG9ja1wiICk7XG5cdFx0JHByZW1pdW1JbmRpY2F0b3IuY3NzKCB7XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdHdpZHRoOiBcIjIwcHhcIixcblx0XHRcdGhlaWdodDogXCIyMHB4XCIsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2VzIHRhYmxlcyBzY3JvbGxhYmxlLlxuXHQgKlxuXHQgKiBVc2FnZTogc2VlIHJlbGF0ZWQgc3R5bGVzaGVldC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTY3JvbGxhYmxlVGFibGVzKCkge1xuXHRcdCQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0YWJsZSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhbiBlbGVtZW50IHdpdGggYSBoaW50IG1lc3NhZ2UgYW5kIGluc2VydCBpdCBpbiB0aGUgRE9NXG5cdFx0XHQgKiBiZWZvcmUgZWFjaCB0YWJsZS5cblx0XHRcdCAqL1xuXHRcdFx0dmFyICRzY3JvbGxIaW50ID0gJCggXCI8ZGl2IC8+XCIsIHtcblx0XHRcdFx0XCJjbGFzc1wiOiBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPHNwYW4gY2xhc3M9J3lvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnQnIGFyaWEtaGlkZGVuPSd0cnVlJyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggJHRhYmxlICk7XG5cblx0XHRcdC8vIFNldCB0aGUgaGludCBtZXNzYWdlIHRleHQuXG5cdFx0XHQkc2Nyb2xsSGludC5maW5kKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50XCIgKS50ZXh0KCB3cHNlb0FkbWluR2xvYmFsTDEwbi5zY3JvbGxhYmxlX3RhYmxlX2hpbnQgKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIENyZWF0ZSBhIHdyYXBwZXIgZWxlbWVudCB3aXRoIGFuIGlubmVyIGRpdiBuZWNlc3NhcnkgZm9yXG5cdFx0XHQgKiBzdHlsaW5nIGFuZCBpbnNlcnQgdGhlbSBpbiB0aGUgRE9NIGJlZm9yZSBlYWNoIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHR2YXIgJHNjcm9sbENvbnRhaW5lciA9ICQoIFwiPGRpdiAvPlwiLCB7XG5cdFx0XHRcdFwiY2xhc3NcIjogXCJ5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19jb250YWluZXJcIixcblx0XHRcdFx0aHRtbDogXCI8ZGl2IGNsYXNzPSd5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19pbm5lcicgLz5cIixcblx0XHRcdH0gKS5pbnNlcnRCZWZvcmUoICR0YWJsZSApO1xuXG5cdFx0XHQvLyBGb3IgZWFjaCB0YWJsZSwgc3RvcmUgYSByZWZlcmVuY2UgdG8gaXRzIHdyYXBwZXIgZWxlbWVudC5cblx0XHRcdCR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiLCAkc2Nyb2xsQ29udGFpbmVyICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIHNjcm9sbGFibGUgdGFibGUgaW5zaWRlIHRoZSB3cmFwcGVyLlxuXHRcdFx0JHRhYmxlLmFwcGVuZFRvKCAkc2Nyb2xsQ29udGFpbmVyLmZpbmQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2lubmVyXCIgKSApO1xuXG5cdFx0XHRjaGVja1Njcm9sbGFibGVUYWJsZXNTaXplKCAkdGFibGUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIHRoZSBzY3JvbGxhYmxlIHRhYmxlcyBzaXplLlxuXHQgKlxuXHQgKiBDb21wYXJlcyB0aGUgc2Nyb2xsYWJsZSB0YWJsZXMgc2l6ZSBhZ2FpbnN0IHRoZWlyIHBhcmVudCBjb250YWluZXIgYW5kXG5cdCAqIGFkZHMgb3IgcmVtb3ZlcyBDU1MgY2xhc3NlcyBhY2NvcmRpbmdseS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja1Njcm9sbGFibGVUYWJsZXNTaXplKCAkdGFibGUgKSB7XG5cdFx0Y29uc29sZS5sb2coXCJjaGVja2luZyB0YWJsZXNcIiwkdGFibGUpO1xuXHRcdC8vIENoZWNrIGlmIHRoZSB0YWJsZSBpcyB3aWRlciB0aGFuIGl0cyBwYXJlbnQuXG5cdFx0aWYgKCAkdGFibGUub3V0ZXJXaWR0aCgpID4gJHRhYmxlLnBhcmVudCgpLm91dGVyV2lkdGgoKSApIHtcblx0XHRcdCQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdCR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0fVxuXG5cdFx0Lypcblx0XHQgKiBXaGVuIHRoZSB2aWV3cG9ydCBzaXplIGNoYW5nZXMsIGNoZWNrIGFnYWluIHRoZSBlbGVtZW50cyBzaXplLlxuXHRcdCAqIEFib3V0IHRoZSBldmVudHM6IHRlY2huaWNhbGx5IGB3cC13aW5kb3ctcmVzaXplZGAgaXMgdHJpZ2dlcmVkIG9uXG5cdFx0ICogdGhlIGJvZHkgYnV0IHNpbmNlIGl0IGJ1YmJsZXMsIGl0IGhhcHBlbnMgYWxzbyBvbiB0aGUgd2luZG93LlxuXHRcdCAqIEFsc28sIGluc3RlYWQgb2YgdHJ5aW5nIHRvIGRldGVjdCBldmVudHMgc3VwcG9ydCBvbiBkZXZpY2VzIGFuZFxuXHRcdCAqIGJyb3dzZXJzLCB3ZSBqdXN0IHJ1biB0aGUgY2hlY2sgb24gYm90aCBgd3Atd2luZG93LXJlc2l6ZWRgIGFuZFxuXHRcdCAqIGBvcmllbnRhdGlvbmNoYW5nZWAuIFdlIGFsc28gbmVlZCBhIGN1c3RvbSBldmVudCwgZm9yIGV4YW1wbGVcblx0XHQgKiB3aGVuIHRhYmxlcyBpbnNpZGUgdGhlIEhlbHAgQ2VudGVyIHRhYnMgYmVjb21lIHZpc2libGUuXG5cdFx0ICovXG5cdFx0JCggd2luZG93ICkub24oIFwid3Atd2luZG93LXJlc2l6ZWQgb3JpZW50YXRpb25jaGFuZ2UgeW9hc3QtdGFibGUtc2Nyb2xsYWJsZS1jaGVjay1zaXplXCIsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBTa2lwIGhpZGRlbiB0YWJsZXMuXG5cdFx0XHRpZiAoICR0YWJsZS5pcyggXCI6aGlkZGVuXCIgKSApIHtcblx0XHRcdFx0Ly8gRXF1aXZhbGVudCBvZiAnY29udGludWUnIGZvciBqUXVlcnkgbG9vcC5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJHRhYmxlLm91dGVyV2lkdGgoKSA+ICR0YWJsZS5wYXJlbnQoKS5vdXRlcldpZHRoKCkgKSB7XG5cdFx0XHRcdCQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdFx0JHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVfX2hpbnR3cmFwcGVyXCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdFx0JHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRzaG93QWxlcnRQb3B1cCgpO1xuXHRcdGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKTtcblx0XHRzZXRQcmVtaXVtSW5kaWNhdG9yQ29sb3IoKTtcblx0XHRjcmVhdGVTY3JvbGxhYmxlVGFibGVzKCk7XG5cdH0gKTtcbn0oKSApO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgJCA9IGpRdWVyeTtcblxuXHQvKipcblx0ICogU3RhcnRzIHZpZGVvIGlmIGZvdW5kIG9uIHRoZSB0YWIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhY3RpdmF0ZVZpZGVvKCAkdGFiICkge1xuXHRcdHZhciAkZGF0YSA9ICR0YWIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvX19kYXRhXCIgKTtcblx0XHRpZiAoICRkYXRhLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZGF0YS5hcHBlbmQoICc8aWZyYW1lIHdpZHRoPVwiNTYwXCIgaGVpZ2h0PVwiMzE1XCIgc3JjPVwiJyArICRkYXRhLmRhdGEoIFwidXJsXCIgKSArICdcIiB0aXRsZT1cIicgKyB3cHNlb0FkbWluR2xvYmFsTDEwbi5oZWxwX3ZpZGVvX2lmcmFtZV90aXRsZSArICdcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3BzIHBsYXlpbmcgYW55IHZpZGVvLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHN0b3BWaWRlb3MoKSB7XG5cdFx0JCggXCIjd3Bib2R5LWNvbnRlbnRcIiApLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlb19fZGF0YVwiICkuY2hpbGRyZW4oKS5yZW1vdmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyBhIHRhYi5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgQ29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIHRhYi5cblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkdGFiICkge1xuXHRcdCRjb250YWluZXIuZmluZCggXCIueW9hc3QtaGVscC1jZW50ZXItdGFicy13cmFwIGRpdlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHQkdGFiLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cdFx0YWN0aXZhdGVWaWRlbyggJHRhYiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIHRoZSBWaWRlbyBTbGlkZW91dC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgVGFiIHRvIG9wZW4gdmlkZW8gc2xpZGVyIG9mLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5WaWRlb1NsaWRlb3V0KCAkY29udGFpbmVyICkge1xuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LWRvd25cIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKS5yZW1vdmVDbGFzcyggXCJoaWRkZW5cIiApO1xuXG5cdFx0dmFyICRhY3RpdmVUYWJMaW5rID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtLmFjdGl2ZSA+IGFcIiApO1xuXG5cdFx0JCggXCIjd3Bjb250ZW50XCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oZWxwLWNlbnRlci1vcGVuXCIgKTtcblx0XHQvLyBUaGUgZmlyc3QgdGFiIG1pZ2h0IGNvbnRhaW4gc2Nyb2xsYWJsZSB0YWJsZXM6IHRyaWdnZXIgYSBjdXN0b20gZXZlbnQgdG8gY2hlY2sgdGhlaXIgc2l6ZS5cblx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCBcInlvYXN0LXRhYmxlLXNjcm9sbGFibGUtY2hlY2stc2l6ZVwiICk7XG5cblx0XHRpZiAoICRhY3RpdmVUYWJMaW5rLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlVGFiID0gJGFjdGl2ZVRhYkxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblx0XHRcdGFjdGl2YXRlVmlkZW8oICQoIFwiI1wiICsgYWN0aXZlVGFiICkgKTtcblxuXHRcdFx0JGNvbnRhaW5lci5vbiggXCJjbGlja1wiLCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtID4gYVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyICRsaW5rID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gJGxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblxuXHRcdFx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW1cIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdCRsaW5rLnBhcmVudCgpLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdFx0b3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICQoIFwiI1wiICsgdGFyZ2V0ICkgKTtcblx0XHRcdFx0Ly8gVHJpZ2dlciBhIGN1c3RvbSBldmVudCB0byBjaGVjayB0aGUgc2Nyb2xsYWJsZSB0YWJsZXMgc2l6ZS5cblx0XHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggXCJ5b2FzdC10YWJsZS1zY3JvbGxhYmxlLWNoZWNrLXNpemVcIiApO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCAkY29udGFpbmVyICk7XG5cdFx0fVxuXG5cdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLmhpZGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9zZXMgdGhlIFZpZGVvIFNsaWRlb3V0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlVmlkZW9TbGlkZW91dCgpIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkuYWRkQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblxuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLnNob3coKTtcblx0fVxuXG5cdCQoIFwiLm5hdi10YWJcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0fSApO1xuXG5cdCQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIGUuZGVsZWdhdGVUYXJnZXQgKTtcblx0XHR2YXIgJHNsaWRlb3V0ID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApO1xuXHRcdGlmICggJHNsaWRlb3V0Lmhhc0NsYXNzKCBcImhpZGRlblwiICkgKSB7XG5cdFx0XHRvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0XHR9XG5cdH0gKTtcbn0oKSApO1xuIl19
