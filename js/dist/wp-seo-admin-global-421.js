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
  * Hide popup showing new alerts message.
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
  * Show popup with new alerts message.
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

	/**
  * Make tables scrollable.
  *
  * @returns {void}
  */
	function scrollableTables() {
		$(".yoast-table-scrollable").each(function () {
			var table = $(this);

			/*
    * Create an element with a hint message and insert it in the DOM
    * before each table.
    */
			var scrollHint = $("<div />", {
				"class": "yoast-table-scrollable__hintwrapper",
				html: "<span class='yoast-table-scrollable__hint' />"
			}).insertBefore(table);

			// Set the hint message text.
			scrollHint.find(".yoast-table-scrollable__hint").text(wpseoAdminGlobalL10n.scrollableTableHint);

			/*
    * Create a wrapper element with an inner div necessary for
    * styling and insert them in the DOM before each table.
    */
			var scrollContainer = $("<div />", {
				"class": "yoast-table-scrollable__container",
				html: "<div class='yoast-table-scrollable__inner' />"
			}).insertBefore(table);

			// For each table, store a reference to its wrapper element.
			table.data("scrollContainer", scrollContainer);

			// Move the scrollable table inside the wrapper.
			table.appendTo(scrollContainer.find(".yoast-table-scrollable__inner"));

			// Check if the table is wider than its parent.
			if (table.outerWidth() > table.parent().outerWidth()) {
				$(".yoast-table-scrollable__hintwrapper").addClass("yoast-has-scroll");
				table.data("scrollContainer").addClass("yoast-has-scroll");
			}

			// When the viewport size changes, check again if the table needs to be scrollable.
			$(window).on("wp-window-resized orientationchange", function () {
				if (table.outerWidth() > table.parent().outerWidth()) {
					$(".yoast-table-scrollable__hintwrapper").addClass("yoast-has-scroll");
					table.data("scrollContainer").addClass("yoast-has-scroll");
				} else {
					$(".yoast-table-scrollable__hintwrapper").removeClass("yoast-has-scroll");
					table.data("scrollContainer").removeClass("yoast-has-scroll");
				}
			});
		});
	}

	$(document).ready(function () {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
		scrollableTables();
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

		$("#sidebar-container").hide();
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
		$("#sidebar-container").show();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsYUFBVztBQUNaOzs7Ozs7O0FBT0EsVUFBUywyQkFBVCxHQUF1QztBQUN0QyxNQUFLLE9BQU8sT0FBTyx5QkFBZCxLQUE0QyxXQUE1QyxJQUEyRCxPQUFPLE9BQVAsS0FBbUIsV0FBbkYsRUFBaUc7QUFDaEc7QUFDQTs7QUFFRDtBQUNBLE9BQU0sSUFBSSxRQUFRLENBQWxCLEVBQXFCLFFBQVEsMEJBQTBCLE1BQXZELEVBQStELE9BQS9ELEVBQXlFO0FBQ3hFLFdBQVEsSUFBUixDQUFjLDBCQUEyQixLQUEzQixDQUFkO0FBQ0E7QUFDRDtBQUNBOztBQUVELFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQiwyQkFBMUI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLEtBQXBDLEVBQTRDO0FBQzNDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSw4QkFEYTtBQUVyQixhQUFVO0FBRlcsR0FBdEI7QUFLQTs7QUFFRDs7Ozs7Ozs7O0FBU0EsVUFBUyxjQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLEtBQXZDLEVBQStDO0FBQzlDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSxrQkFEYTtBQUVyQixXQUFRLE1BRmE7QUFHckIsYUFBVTtBQUhXLEdBQXRCLEVBSUcsVUFBVSxJQUFWLEVBQWlCO0FBQ25CLE9BQUssSUFBTCxFQUFZO0FBQ1gsV0FBUSxNQUFNLElBQWQsRUFBcUIsSUFBckI7QUFDQSxXQUFRLG9CQUFvQixNQUE1QixFQUFxQyxHQUFyQyxDQUEwQyxRQUExQztBQUNBO0FBQ0QsR0FURDtBQVdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxnQkFBVCxDQUEyQixZ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LEVBQUcsaUJBQUgsRUFBdUIsSUFBdkIsQ0FBNkIsNEJBQTdCLENBQWpCO0FBQ0EsYUFBVyxJQUFYLENBQWlCLDJCQUFqQixFQUErQyxHQUEvQyxDQUFvRCxTQUFwRCxFQUErRCxFQUEvRDs7QUFFQTs7QUFFQSxhQUFXLElBQVgsQ0FBaUIsZ0JBQWpCLEVBQW9DLFdBQXBDLENBQWlELG9CQUFqRCxFQUF3RSxRQUF4RSxDQUFrRixzQkFBbEY7QUFDQSxhQUFXLElBQVgsQ0FBaUIsb0NBQWpCLEVBQXdELElBQXhELENBQThELGVBQTlELEVBQStFLE9BQS9FOztBQUVBLElBQUcsWUFBSCxFQUFrQixXQUFsQixDQUErQix3QkFBL0I7QUFDQSxJQUFHLG9CQUFILEVBQTBCLElBQTFCO0FBQ0E7O0FBRUQsR0FBRyxVQUFILEVBQWdCLEtBQWhCLENBQXVCLFlBQVc7QUFDakM7QUFDQSxFQUZEOztBQUlBLEdBQUcsNEJBQUgsRUFBa0MsRUFBbEMsQ0FBc0MsT0FBdEMsRUFBK0Msb0NBQS9DLEVBQXFGLFVBQVUsQ0FBVixFQUFjO0FBQ2xHLE1BQUksYUFBYSxFQUFHLEVBQUUsY0FBTCxDQUFqQjtBQUNBLE1BQUksWUFBWSxXQUFXLElBQVgsQ0FBaUIsMkJBQWpCLENBQWhCO0FBQ0EsTUFBSyxVQUFVLEVBQVYsQ0FBYyxTQUFkLENBQUwsRUFBaUM7QUFDaEMscUJBQW1CLFVBQW5CO0FBQ0EsR0FGRCxNQUVPO0FBQ047QUFDQTtBQUNELEVBUkQ7QUFTQSxDQXBIQyxHQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgd3BzZW9BZG1pbkdsb2JhbEwxMG4sIHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogRGlzcGxheXMgY29uc29sZSBub3RpZmljYXRpb25zLlxuXHQgKlxuXHQgKiBMb29rcyBhdCBhIGdsb2JhbCB2YXJpYWJsZSB0byBkaXNwbGF5IGFsbCBub3RpZmljYXRpb25zIGluIHRoZXJlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucygpIHtcblx0XHRpZiAoIHR5cGVvZiB3aW5kb3cud3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zLmxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRcdGNvbnNvbGUud2Fybiggd3BzZW9Db25zb2xlTm90aWZpY2F0aW9uc1sgaW5kZXggXSApO1xuXHRcdH1cblx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBkaXNwbGF5Q29uc29sZU5vdGlmaWNhdGlvbnMgKTtcblxuXHQvKipcblx0ICogVXNlZCB0byBkaXNtaXNzIHRoZSB0YWdsaW5lIG5vdGljZSBmb3IgYSBzcGVjaWZpYyB1c2VyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2Vcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlKCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX2Rpc21pc3NfdGFnbGluZV9ub3RpY2VcIixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIHJlbW92ZSB0aGUgYWRtaW4gbm90aWNlcyBmb3Igc2V2ZXJhbCBwdXJwb3NlcywgZGllcyBvbiBleGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2V0SWdub3JlKCBvcHRpb24sIGhpZGUsIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fc2V0X2lnbm9yZVwiLFxuXHRcdFx0b3B0aW9uOiBvcHRpb24sXG5cdFx0XHRfd3Bub25jZTogbm9uY2UsXG5cdFx0fSwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGpRdWVyeSggXCIjXCIgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0XHRqUXVlcnkoIFwiI2hpZGRlbl9pZ25vcmVfXCIgKyBvcHRpb24gKS52YWwoIFwiaWdub3JlXCIgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgYSBkaXNtaXNzYWJsZSBhbmNob3IgYnV0dG9uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkaXNtaXNzX2xpbmsgVGhlIFVSTCB0aGF0IGxlYWRzIHRvIHRoZSBkaXNtaXNzaW5nIG9mIHRoZSBub3RpY2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IEFuY2hvciB0byBkaXNtaXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9EaXNtaXNzTGluayggZGlzbWlzc19saW5rICkge1xuXHRcdHJldHVybiBqUXVlcnkoXG5cdFx0XHQnPGEgaHJlZj1cIicgKyBkaXNtaXNzX2xpbmsgKyAnXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibm90aWNlLWRpc21pc3NcIj4nICtcblx0XHRcdCc8c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPkRpc21pc3MgdGhpcyBub3RpY2UuPC9zcGFuPicgK1xuXHRcdFx0XCI8L2E+XCJcblx0XHQpO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIFwiLnlvYXN0LWRpc21pc3NpYmxlXCIgKS5vbiggXCJjbGlja1wiLCBcIi55b2FzdC1ub3RpY2UtZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkcGFyZW50RGl2ID0galF1ZXJ5KCB0aGlzICkucGFyZW50KCk7XG5cblx0XHRcdC8vIERlcHJlY2F0ZWQsIHRvZG86IHJlbW92ZSB3aGVuIGFsbCBub3RpZmllcnMgaGF2ZSBiZWVuIGltcGxlbWVudGVkLlxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICkucmVwbGFjZSggLy0vZywgXCJfXCIgKSxcblx0XHRcdFx0XHRfd3Bub25jZTogJHBhcmVudERpdi5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkcGFyZW50RGl2LmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdGpRdWVyeS5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3Nfbm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkcGFyZW50RGl2LmF0dHIoIFwiaWRcIiApLFxuXHRcdFx0XHRcdG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JHBhcmVudERpdi5mYWRlVG8oIDEwMCwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRwYXJlbnREaXYuc2xpZGVVcCggMTAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkcGFyZW50RGl2LnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ICk7XG5cblx0XHRqUXVlcnkoIFwiLnlvYXN0LWhlbHAtYnV0dG9uXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkYnV0dG9uID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdGhlbHBQYW5lbCA9IGpRdWVyeSggXCIjXCIgKyAkYnV0dG9uLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoIFwiOnZpc2libGVcIiApO1xuXG5cdFx0XHRqUXVlcnkoIGhlbHBQYW5lbCApLnNsaWRlVG9nZ2xlKCAyMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkYnV0dG9uLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCAhIGlzUGFuZWxWaXNpYmxlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlID0gd3BzZW9EaXNtaXNzVGFnbGluZU5vdGljZTtcblx0d2luZG93Lndwc2VvU2V0SWdub3JlID0gd3BzZW9TZXRJZ25vcmU7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NMaW5rID0gd3BzZW9EaXNtaXNzTGluaztcbn0oKSApO1xuXG4oIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgJCA9IGpRdWVyeTtcblxuXHQvKipcblx0ICogSGlkZSBwb3B1cCBzaG93aW5nIG5ldyBhbGVydHMgbWVzc2FnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlQWxlcnRQb3B1cCgpIHtcblx0XHQvLyBSZW1vdmUgdGhlIG5hbWVzcGFjZWQgaG92ZXIgZXZlbnQgZnJvbSB0aGUgbWVudSB0b3AgbGV2ZWwgbGlzdCBpdGVtcy5cblx0XHQkKCBcIiN3cC1hZG1pbi1iYXItcm9vdC1kZWZhdWx0ID4gbGlcIiApLm9mZiggXCJob3Zlci55b2FzdGFsZXJ0cG9wdXBcIiApO1xuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBieSBmYWRpbmcgaXQgb3V0LlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKS5mYWRlT3V0KCAyMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93IHBvcHVwIHdpdGggbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dBbGVydFBvcHVwKCkge1xuXHRcdC8vIEF0dGFjaCBhbiBob3ZlciBldmVudCBhbmQgc2hvdyB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBpbi5cblx0XHQkKCBcIi55b2FzdC1pc3N1ZS1hZGRlZFwiIClcblx0XHRcdC5vbiggXCJob3ZlclwiLCBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHQvLyBBdm9pZCB0aGUgaG92ZXIgZXZlbnQgdG8gcHJvcGFnYXRlIG9uIHRoZSBwYXJlbnQgZWxlbWVudHMuXG5cdFx0XHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIHdoZW4gaG92ZXJpbmcgb24gaXQuXG5cdFx0XHRcdGhpZGVBbGVydFBvcHVwKCk7XG5cdFx0XHR9IClcblx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdC8qXG5cdFx0ICogQXR0YWNoIGEgbmFtZXNwYWNlZCBob3ZlciBldmVudCBvbiB0aGUgbWVudSB0b3AgbGV2ZWwgaXRlbXMgdG8gaGlkZVxuXHRcdCAqIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyB0aGVtLlxuXHRcdCAqIE5vdGU6IHRoaXMgd2lsbCB3b3JrIGp1c3QgdGhlIGZpcnN0IHRpbWUgdGhlIGxpc3QgaXRlbXMgZ2V0IGhvdmVyZWQgaW4gdGhlXG5cdFx0ICogZmlyc3QgMyBzZWNvbmRzIGFmdGVyIERPTSByZWFkeSBiZWNhdXNlIHRoaXMgZXZlbnQgaXMgdGhlbiByZW1vdmVkLlxuXHRcdCAqL1xuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub24oIFwiaG92ZXIueW9hc3RhbGVydHBvcHVwXCIsIGhpZGVBbGVydFBvcHVwICk7XG5cblx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgYWZ0ZXIgMyBzZWNvbmRzIGZyb20gRE9NIHJlYWR5LlxuXHRcdHNldFRpbWVvdXQoIGhpZGVBbGVydFBvcHVwLCAzMDAwICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGRpc21pc3MgYW5kIHJlc3RvcmUgQUpBWCByZXNwb25zZXNcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9ICRzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSByZXF1ZXN0LlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgQUpBWCByZXNwb25zZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlKCAkc291cmNlLCByZXNwb25zZSApIHtcblx0XHQkKCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApLm9mZiggXCJjbGlja1wiLCBcIi5yZXN0b3JlXCIgKS5vZmYoIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiICk7XG5cblx0XHRpZiAoIHR5cGVvZiByZXNwb25zZS5odG1sID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggcmVzcG9uc2UuaHRtbCApIHtcblx0XHRcdCRzb3VyY2UuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKS5odG1sKCByZXNwb25zZS5odG1sICk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXHRcdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0XHRcdC8qIGVzbGludC1lbmFibGUgKi9cblx0XHR9XG5cblx0XHR2YXIgJHdwc2VvX21lbnUgPSAkKCBcIiN3cC1hZG1pbi1iYXItd3BzZW8tbWVudVwiICk7XG5cdFx0dmFyICRpc3N1ZV9jb3VudGVyID0gJHdwc2VvX21lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cblx0XHRpZiAoICEgJGlzc3VlX2NvdW50ZXIubGVuZ3RoICkge1xuXHRcdFx0JHdwc2VvX21lbnUuZmluZCggXCI+IGE6Zmlyc3QtY2hpbGRcIiApLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1pc3N1ZS1jb3VudGVyXCIvPicgKTtcblx0XHRcdCRpc3N1ZV9jb3VudGVyID0gJHdwc2VvX21lbnUuZmluZCggXCIueW9hc3QtaXNzdWUtY291bnRlclwiICk7XG5cdFx0fVxuXG5cdFx0JGlzc3VlX2NvdW50ZXIuaHRtbCggcmVzcG9uc2UudG90YWwgKTtcblx0XHRpZiAoIHJlc3BvbnNlLnRvdGFsID09PSAwICkge1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5zaG93KCk7XG5cdFx0fVxuXG5cdFx0JCggXCIjdG9wbGV2ZWxfcGFnZV93cHNlb19kYXNoYm9hcmQgLnVwZGF0ZS1wbHVnaW5zXCIgKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCBcInVwZGF0ZS1wbHVnaW5zIGNvdW50LVwiICsgcmVzcG9uc2UudG90YWwgKTtcblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAucGx1Z2luLWNvdW50XCIgKS5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhvb2sgdGhlIHJlc3RvcmUgYW5kIGRpc21pc3MgYnV0dG9uc1xuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhvb2tEaXNtaXNzUmVzdG9yZUJ1dHRvbnMoKSB7XG5cdFx0dmFyICRkaXNtaXNzaWJsZSA9ICQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIuZGlzbWlzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtbm8tYWx0XCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X2Rpc21pc3NfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXG5cdFx0JGRpc21pc3NpYmxlLm9uKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgJHNvdXJjZSA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICk7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtY29udGFpbmVyXCIgKTtcblx0XHRcdCRjb250YWluZXIuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWNvbnRhaW5lci1kaXNhYmxlZFwiLz4nICk7XG5cblx0XHRcdCR0aGlzLmZpbmQoIFwic3BhblwiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtcmFuZG9taXplXCIgKTtcblxuXHRcdFx0JC5wb3N0KFxuXHRcdFx0XHRhamF4dXJsLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YWN0aW9uOiBcInlvYXN0X3Jlc3RvcmVfYWxlcnRcIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRzb3VyY2UuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRzb3VyY2UuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHNvdXJjZS5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoYW5kbGVEaXNtaXNzUmVzdG9yZVJlc3BvbnNlLmJpbmQoIHRoaXMsICRzb3VyY2UgKSxcblx0XHRcdFx0XCJqc29uXCJcblx0XHRcdCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbG9yIG9mIHRoZSBzdmcgZm9yIHRoZSBwcmVtaXVtIGluZGljYXRvciBiYXNlZCBvbiB0aGUgY29sb3Igb2YgdGhlIGNvbG9yIHNjaGVtZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRQcmVtaXVtSW5kaWNhdG9yQ29sb3IoKSB7XG5cdFx0bGV0ICRwcmVtaXVtSW5kaWNhdG9yID0galF1ZXJ5KCBcIi53cHNlby1qcy1wcmVtaXVtLWluZGljYXRvclwiICk7XG5cdFx0bGV0ICRzdmcgPSAkcHJlbWl1bUluZGljYXRvci5maW5kKCBcInN2Z1wiICk7XG5cblx0XHQvLyBEb24ndCBjaGFuZ2UgdGhlIGNvbG9yIHRvIHN0YW5kIG91dCB3aGVuIHByZW1pdW0gaXMgYWN0dWFsbHkgZW5hYmxlZC5cblx0XHRpZiAoICRwcmVtaXVtSW5kaWNhdG9yLmhhc0NsYXNzKCBcIndwc2VvLXByZW1pdW0taW5kaWNhdG9yLS1ub1wiICkgKSB7XG5cdFx0XHRsZXQgJHN2Z1BhdGggPSAkc3ZnLmZpbmQoIFwicGF0aFwiICk7XG5cblx0XHRcdGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAkcHJlbWl1bUluZGljYXRvci5jc3MoIFwiYmFja2dyb3VuZENvbG9yXCIgKTtcblxuXHRcdFx0JHN2Z1BhdGguY3NzKCBcImZpbGxcIiwgYmFja2dyb3VuZENvbG9yICk7XG5cdFx0fVxuXG5cdFx0JHN2Zy5jc3MoIFwiZGlzcGxheVwiLCBcImJsb2NrXCIgKTtcblx0XHQkcHJlbWl1bUluZGljYXRvci5jc3MoIHtcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuXHRcdFx0d2lkdGg6IFwiMjBweFwiLFxuXHRcdFx0aGVpZ2h0OiBcIjIwcHhcIixcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogTWFrZSB0YWJsZXMgc2Nyb2xsYWJsZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzY3JvbGxhYmxlVGFibGVzKCkge1xuXHRcdCQoIFwiLnlvYXN0LXRhYmxlLXNjcm9sbGFibGVcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRhYmxlID0gJCggdGhpcyApO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogQ3JlYXRlIGFuIGVsZW1lbnQgd2l0aCBhIGhpbnQgbWVzc2FnZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBET01cblx0XHRcdCAqIGJlZm9yZSBlYWNoIHRhYmxlLlxuXHRcdFx0ICovXG5cdFx0XHR2YXIgc2Nyb2xsSGludCA9ICQoIFwiPGRpdiAvPlwiLCB7XG5cdFx0XHRcdFwiY2xhc3NcIjogXCJ5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50d3JhcHBlclwiLFxuXHRcdFx0XHRodG1sOiBcIjxzcGFuIGNsYXNzPSd5b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50JyAvPlwiLFxuXHRcdFx0fSApLmluc2VydEJlZm9yZSggdGFibGUgKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBoaW50IG1lc3NhZ2UgdGV4dC5cblx0XHRcdHNjcm9sbEhpbnQuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludFwiICkudGV4dCggd3BzZW9BZG1pbkdsb2JhbEwxMG4uc2Nyb2xsYWJsZVRhYmxlSGludCApO1xuXG5cdFx0XHQvKlxuXHRcdFx0ICogQ3JlYXRlIGEgd3JhcHBlciBlbGVtZW50IHdpdGggYW4gaW5uZXIgZGl2IG5lY2Vzc2FyeSBmb3Jcblx0XHRcdCAqIHN0eWxpbmcgYW5kIGluc2VydCB0aGVtIGluIHRoZSBET00gYmVmb3JlIGVhY2ggdGFibGUuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBzY3JvbGxDb250YWluZXIgPSAkKCBcIjxkaXYgLz5cIiwge1xuXHRcdFx0XHRcImNsYXNzXCI6IFwieW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9fY29udGFpbmVyXCIsXG5cdFx0XHRcdGh0bWw6IFwiPGRpdiBjbGFzcz0neW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXInIC8+XCIsXG5cdFx0XHR9ICkuaW5zZXJ0QmVmb3JlKCB0YWJsZSApO1xuXG5cdFx0XHQvLyBGb3IgZWFjaCB0YWJsZSwgc3RvcmUgYSByZWZlcmVuY2UgdG8gaXRzIHdyYXBwZXIgZWxlbWVudC5cblx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIsIHNjcm9sbENvbnRhaW5lciApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBzY3JvbGxhYmxlIHRhYmxlIGluc2lkZSB0aGUgd3JhcHBlci5cblx0XHRcdHRhYmxlLmFwcGVuZFRvKCBzY3JvbGxDb250YWluZXIuZmluZCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faW5uZXJcIiApICk7XG5cblx0XHRcdC8vIENoZWNrIGlmIHRoZSB0YWJsZSBpcyB3aWRlciB0aGFuIGl0cyBwYXJlbnQuXG5cdFx0XHRpZiAoIHRhYmxlLm91dGVyV2lkdGgoKSA+IHRhYmxlLnBhcmVudCgpLm91dGVyV2lkdGgoKSApIHtcblx0XHRcdFx0JCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludHdyYXBwZXJcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0XHR0YWJsZS5kYXRhKCBcInNjcm9sbENvbnRhaW5lclwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdoZW4gdGhlIHZpZXdwb3J0IHNpemUgY2hhbmdlcywgY2hlY2sgYWdhaW4gaWYgdGhlIHRhYmxlIG5lZWRzIHRvIGJlIHNjcm9sbGFibGUuXG5cdFx0XHQkKCB3aW5kb3cgKS5vbiggXCJ3cC13aW5kb3ctcmVzaXplZCBvcmllbnRhdGlvbmNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0YWJsZS5vdXRlcldpZHRoKCkgPiB0YWJsZS5wYXJlbnQoKS5vdXRlcldpZHRoKCkgKSB7XG5cdFx0XHRcdFx0JCggXCIueW9hc3QtdGFibGUtc2Nyb2xsYWJsZV9faGludHdyYXBwZXJcIiApLmFkZENsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0XHRcdHRhYmxlLmRhdGEoIFwic2Nyb2xsQ29udGFpbmVyXCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oYXMtc2Nyb2xsXCIgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKCBcIi55b2FzdC10YWJsZS1zY3JvbGxhYmxlX19oaW50d3JhcHBlclwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGFzLXNjcm9sbFwiICk7XG5cdFx0XHRcdFx0dGFibGUuZGF0YSggXCJzY3JvbGxDb250YWluZXJcIiApLnJlbW92ZUNsYXNzKCBcInlvYXN0LWhhcy1zY3JvbGxcIiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0c2hvd0FsZXJ0UG9wdXAoKTtcblx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0c2V0UHJlbWl1bUluZGljYXRvckNvbG9yKCk7XG5cdFx0c2Nyb2xsYWJsZVRhYmxlcygpO1xuXHR9ICk7XG59KCkgKTtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyICQgPSBqUXVlcnk7XG5cblx0LyoqXG5cdCAqIFN0YXJ0IHZpZGVvIGlmIGZvdW5kIG9uIHRoZSB0YWJcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlVmlkZW8oICR0YWIgKSB7XG5cdFx0dmFyICRkYXRhID0gJHRhYi5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApO1xuXHRcdGlmICggJGRhdGEubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCRkYXRhLmFwcGVuZCggJzxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCInICsgJGRhdGEuZGF0YSggXCJ1cmxcIiApICsgJ1wiIHRpdGxlPVwiJyArIHdwc2VvQWRtaW5HbG9iYWxMMTBuLmhlbHBfdmlkZW9faWZyYW1lX3RpdGxlICsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nICk7XG5cdH1cblxuXHQvKipcblx0ICogU3RvcCBwbGF5aW5nIGFueSB2aWRlby5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wVmlkZW9zKCkge1xuXHRcdCQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbiB0YWJcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgQ29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIHRhYi5cblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkdGFiICkge1xuXHRcdCRjb250YWluZXIuZmluZCggXCIuY29udGV4dHVhbC1oZWxwLXRhYnMtd3JhcCBkaXZcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0JHRhYi5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXHRcdGFjdGl2YXRlVmlkZW8oICR0YWIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVuIFZpZGVvIFNsaWRlb3V0XG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIFRhYiB0byBvcGVuIHZpZGVvIHNsaWRlciBvZi5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLnRvZ2dsZV9fYXJyb3dcIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1hcnJvdy1kb3duXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlXCIgKS5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkuY3NzKCBcImRpc3BsYXlcIiwgXCJmbGV4XCIgKTtcblxuXHRcdHZhciAkYWN0aXZlVGFiTGluayA9ICRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbS5hY3RpdmUgPiBhXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkuYWRkQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cblx0XHRpZiAoICRhY3RpdmVUYWJMaW5rLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHR2YXIgYWN0aXZlVGFiID0gJGFjdGl2ZVRhYkxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblx0XHRcdGFjdGl2YXRlVmlkZW8oICQoIFwiI1wiICsgYWN0aXZlVGFiICkgKTtcblxuXHRcdFx0JGNvbnRhaW5lci5vbiggXCJjbGlja1wiLCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtID4gYVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyICRsaW5rID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gJGxpbmsuYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKTtcblxuXHRcdFx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW1cIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdCRsaW5rLnBhcmVudCgpLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRcdFx0b3BlbkhlbHBDZW50ZXJUYWIoICRjb250YWluZXIsICQoIFwiI1wiICsgdGFyZ2V0ICkgKTtcblxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0YWN0aXZhdGVWaWRlbyggJGNvbnRhaW5lciApO1xuXHRcdH1cblxuXHRcdCQoIFwiI3NpZGViYXItY29udGFpbmVyXCIgKS5oaWRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2UgVmlkZW8gU2xpZGVvdXRcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZVZpZGVvU2xpZGVvdXQoKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBcIiN3cGJvZHktY29udGVudFwiICkuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lclwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApLmNzcyggXCJkaXNwbGF5XCIsIFwiXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblxuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLnNob3coKTtcblx0fVxuXG5cdCQoIFwiLm5hdi10YWJcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0fSApO1xuXG5cdCQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIGUuZGVsZWdhdGVUYXJnZXQgKTtcblx0XHR2YXIgJHNsaWRlb3V0ID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApO1xuXHRcdGlmICggJHNsaWRlb3V0LmlzKCBcIjpoaWRkZW5cIiApICkge1xuXHRcdFx0b3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdFx0fVxuXHR9ICk7XG59KCkgKTtcbiJdfQ==
