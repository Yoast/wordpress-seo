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
		$container.find(".yoast-help-center-tabs-wrap div").removeClass("active");
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
		$container.find(".wpseo-tab-video-slideout").removeClass("hidden");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsYUFBVztBQUNaOzs7Ozs7O0FBT0EsVUFBUywyQkFBVCxHQUF1QztBQUN0QyxNQUFLLE9BQU8sT0FBTyx5QkFBZCxLQUE0QyxXQUE1QyxJQUEyRCxPQUFPLE9BQVAsS0FBbUIsV0FBbkYsRUFBaUc7QUFDaEc7QUFDQTs7QUFFRDtBQUNBLE9BQU0sSUFBSSxRQUFRLENBQWxCLEVBQXFCLFFBQVEsMEJBQTBCLE1BQXZELEVBQStELE9BQS9ELEVBQXlFO0FBQ3hFLFdBQVEsSUFBUixDQUFjLDBCQUEyQixLQUEzQixDQUFkO0FBQ0E7QUFDRDtBQUNBOztBQUVELFFBQVEsUUFBUixFQUFtQixLQUFuQixDQUEwQiwyQkFBMUI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFTLHlCQUFULENBQW9DLEtBQXBDLEVBQTRDO0FBQzNDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSw4QkFEYTtBQUVyQixhQUFVO0FBRlcsR0FBdEI7QUFLQTs7QUFFRDs7Ozs7Ozs7O0FBU0EsVUFBUyxjQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLEtBQXZDLEVBQStDO0FBQzlDLFNBQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0I7QUFDckIsV0FBUSxrQkFEYTtBQUVyQixXQUFRLE1BRmE7QUFHckIsYUFBVTtBQUhXLEdBQXRCLEVBSUcsVUFBVSxJQUFWLEVBQWlCO0FBQ25CLE9BQUssSUFBTCxFQUFZO0FBQ1gsV0FBUSxNQUFNLElBQWQsRUFBcUIsSUFBckI7QUFDQSxXQUFRLG9CQUFvQixNQUE1QixFQUFxQyxHQUFyQyxDQUEwQyxRQUExQztBQUNBO0FBQ0QsR0FURDtBQVdBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxnQkFBVCxDQUEyQixZQUEzQixFQUEwQztBQUN6QyxTQUFPLE9BQ04sY0FBYyxZQUFkLEdBQTZCLHlDQUE3QixHQUNBLDhEQURBLEdBRUEsTUFITSxDQUFQO0FBS0E7O0FBRUQsUUFBUSxRQUFSLEVBQW1CLEtBQW5CLENBQTBCLFlBQVc7QUFDcEMsU0FBUSxvQkFBUixFQUErQixFQUEvQixDQUFtQyxPQUFuQyxFQUE0Qyx1QkFBNUMsRUFBcUUsWUFBVztBQUMvRSxPQUFJLGFBQWEsT0FBUSxJQUFSLEVBQWUsTUFBZixFQUFqQjs7QUFFQTtBQUNBLFVBQU8sSUFBUCxDQUNDLE9BREQsRUFFQztBQUNDLFlBQVEsV0FBVyxJQUFYLENBQWlCLElBQWpCLEVBQXdCLE9BQXhCLENBQWlDLElBQWpDLEVBQXVDLEdBQXZDLENBRFQ7QUFFQyxjQUFVLFdBQVcsSUFBWCxDQUFpQixPQUFqQixDQUZYO0FBR0MsVUFBTSxXQUFXLElBQVgsQ0FBaUIsTUFBakI7QUFIUCxJQUZEOztBQVNBLFVBQU8sSUFBUCxDQUNDLE9BREQsRUFFQztBQUNDLFlBQVEsNEJBRFQ7QUFFQyxrQkFBYyxXQUFXLElBQVgsQ0FBaUIsSUFBakIsQ0FGZjtBQUdDLFdBQU8sV0FBVyxJQUFYLENBQWlCLE9BQWpCLENBSFI7QUFJQyxVQUFNLFdBQVcsSUFBWCxDQUFpQixNQUFqQjtBQUpQLElBRkQ7O0FBVUEsY0FBVyxNQUFYLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLFlBQVc7QUFDckMsZUFBVyxPQUFYLENBQW9CLEdBQXBCLEVBQXlCLFlBQVc7QUFDbkMsZ0JBQVcsTUFBWDtBQUNBLEtBRkQ7QUFHQSxJQUpEOztBQU1BLFVBQU8sS0FBUDtBQUNBLEdBOUJEOztBQWdDQSxTQUFRLG9CQUFSLEVBQStCLEVBQS9CLENBQW1DLE9BQW5DLEVBQTRDLFlBQVc7QUFDdEQsT0FBSSxVQUFVLE9BQVEsSUFBUixDQUFkO0FBQUEsT0FDQyxZQUFZLE9BQVEsTUFBTSxRQUFRLElBQVIsQ0FBYyxlQUFkLENBQWQsQ0FEYjtBQUFBLE9BRUMsaUJBQWlCLFVBQVUsRUFBVixDQUFjLFVBQWQsQ0FGbEI7O0FBSUEsVUFBUSxTQUFSLEVBQW9CLFdBQXBCLENBQWlDLEdBQWpDLEVBQXNDLFlBQVc7QUFDaEQsWUFBUSxJQUFSLENBQWMsZUFBZCxFQUErQixDQUFFLGNBQWpDO0FBQ0EsSUFGRDtBQUdBLEdBUkQ7QUFTQSxFQTFDRDtBQTJDQSxRQUFPLHlCQUFQLEdBQW1DLHlCQUFuQztBQUNBLFFBQU8sY0FBUCxHQUF3QixjQUF4QjtBQUNBLFFBQU8sZ0JBQVAsR0FBMEIsZ0JBQTFCO0FBQ0EsQ0F6SEMsR0FBRjs7QUEySEUsYUFBVztBQUNaOztBQUVBLEtBQUksSUFBSSxNQUFSOztBQUVBOzs7OztBQUtBLFVBQVMsY0FBVCxHQUEwQjtBQUN6QjtBQUNBLElBQUcsaUNBQUgsRUFBdUMsR0FBdkMsQ0FBNEMsdUJBQTVDO0FBQ0E7QUFDQSxJQUFHLG9CQUFILEVBQTBCLE9BQTFCLENBQW1DLEdBQW5DO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxjQUFULEdBQTBCO0FBQ3pCO0FBQ0EsSUFBRyxvQkFBSCxFQUNFLEVBREYsQ0FDTSxPQUROLEVBQ2UsVUFBVSxHQUFWLEVBQWdCO0FBQzdCO0FBQ0EsT0FBSSxlQUFKO0FBQ0E7QUFDQTtBQUNBLEdBTkYsRUFPRSxNQVBGOztBQVNBOzs7Ozs7QUFNQSxJQUFHLGlDQUFILEVBQXVDLEVBQXZDLENBQTJDLHVCQUEzQyxFQUFvRSxjQUFwRTs7QUFFQTtBQUNBLGFBQVksY0FBWixFQUE0QixJQUE1QjtBQUNBOztBQUVEOzs7Ozs7OztBQVFBLFVBQVMsNEJBQVQsQ0FBdUMsT0FBdkMsRUFBZ0QsUUFBaEQsRUFBMkQ7QUFDMUQsSUFBRyxxQkFBSCxFQUEyQixHQUEzQixDQUFnQyxPQUFoQyxFQUF5QyxVQUF6QyxFQUFzRCxHQUF0RCxDQUEyRCxPQUEzRCxFQUFvRSxVQUFwRTs7QUFFQSxNQUFLLE9BQU8sU0FBUyxJQUFoQixLQUF5QixXQUE5QixFQUE0QztBQUMzQztBQUNBOztBQUVELE1BQUssU0FBUyxJQUFkLEVBQXFCO0FBQ3BCLFdBQVEsT0FBUixDQUFpQixrQkFBakIsRUFBc0MsSUFBdEMsQ0FBNEMsU0FBUyxJQUFyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRCxNQUFJLGNBQWMsRUFBRywwQkFBSCxDQUFsQjtBQUNBLE1BQUksaUJBQWlCLFlBQVksSUFBWixDQUFrQixzQkFBbEIsQ0FBckI7O0FBRUEsTUFBSyxDQUFFLGVBQWUsTUFBdEIsRUFBK0I7QUFDOUIsZUFBWSxJQUFaLENBQWtCLGlCQUFsQixFQUFzQyxNQUF0QyxDQUE4QyxvQ0FBOUM7QUFDQSxvQkFBaUIsWUFBWSxJQUFaLENBQWtCLHNCQUFsQixDQUFqQjtBQUNBOztBQUVELGlCQUFlLElBQWYsQ0FBcUIsU0FBUyxLQUE5QjtBQUNBLE1BQUssU0FBUyxLQUFULEtBQW1CLENBQXhCLEVBQTRCO0FBQzNCLGtCQUFlLElBQWY7QUFDQSxHQUZELE1BRU87QUFDTixrQkFBZSxJQUFmO0FBQ0E7O0FBRUQsSUFBRyxnREFBSCxFQUFzRCxXQUF0RCxHQUFvRSxRQUFwRSxDQUE4RSwwQkFBMEIsU0FBUyxLQUFqSDtBQUNBLElBQUcsOENBQUgsRUFBb0QsSUFBcEQsQ0FBMEQsU0FBUyxLQUFuRTtBQUNBOztBQUVEOzs7OztBQUtBLFVBQVMseUJBQVQsR0FBcUM7QUFDcEMsTUFBSSxlQUFlLEVBQUcscUJBQUgsQ0FBbkI7O0FBRUEsZUFBYSxFQUFiLENBQWlCLE9BQWpCLEVBQTBCLFVBQTFCLEVBQXNDLFlBQVc7QUFDaEQsT0FBSSxRQUFRLEVBQUcsSUFBSCxDQUFaO0FBQ0EsT0FBSSxVQUFVLE1BQU0sT0FBTixDQUFlLHFCQUFmLENBQWQ7O0FBRUEsT0FBSSxhQUFhLE1BQU0sT0FBTixDQUFlLGtCQUFmLENBQWpCO0FBQ0EsY0FBVyxNQUFYLENBQW1CLHlDQUFuQjs7QUFFQSxTQUFNLElBQU4sQ0FBWSxNQUFaLEVBQXFCLFdBQXJCLENBQWtDLGtCQUFsQyxFQUF1RCxRQUF2RCxDQUFpRSxxQkFBakU7O0FBRUEsS0FBRSxJQUFGLENBQ0MsT0FERCxFQUVDO0FBQ0MsWUFBUSxxQkFEVDtBQUVDLGtCQUFjLFFBQVEsSUFBUixDQUFjLElBQWQsQ0FGZjtBQUdDLFdBQU8sUUFBUSxJQUFSLENBQWMsT0FBZCxDQUhSO0FBSUMsVUFBTSxRQUFRLElBQVIsQ0FBYyxNQUFkO0FBSlAsSUFGRCxFQVFDLDZCQUE2QixJQUE3QixDQUFtQyxJQUFuQyxFQUF5QyxPQUF6QyxDQVJELEVBU0MsTUFURDtBQVdBLEdBcEJEOztBQXNCQSxlQUFhLEVBQWIsQ0FBaUIsT0FBakIsRUFBMEIsVUFBMUIsRUFBc0MsWUFBVztBQUNoRCxPQUFJLFFBQVEsRUFBRyxJQUFILENBQVo7QUFDQSxPQUFJLFVBQVUsTUFBTSxPQUFOLENBQWUscUJBQWYsQ0FBZDs7QUFFQSxPQUFJLGFBQWEsTUFBTSxPQUFOLENBQWUsa0JBQWYsQ0FBakI7QUFDQSxjQUFXLE1BQVgsQ0FBbUIseUNBQW5COztBQUVBLFNBQU0sSUFBTixDQUFZLE1BQVosRUFBcUIsV0FBckIsQ0FBa0Msb0JBQWxDLEVBQXlELFFBQXpELENBQW1FLHFCQUFuRTs7QUFFQSxLQUFFLElBQUYsQ0FDQyxPQURELEVBRUM7QUFDQyxZQUFRLHFCQURUO0FBRUMsa0JBQWMsUUFBUSxJQUFSLENBQWMsSUFBZCxDQUZmO0FBR0MsV0FBTyxRQUFRLElBQVIsQ0FBYyxPQUFkLENBSFI7QUFJQyxVQUFNLFFBQVEsSUFBUixDQUFjLE1BQWQ7QUFKUCxJQUZELEVBUUMsNkJBQTZCLElBQTdCLENBQW1DLElBQW5DLEVBQXlDLE9BQXpDLENBUkQsRUFTQyxNQVREO0FBV0EsR0FwQkQ7QUFxQkE7O0FBRUQ7Ozs7O0FBS0EsVUFBUyx3QkFBVCxHQUFvQztBQUNuQyxNQUFJLG9CQUFvQixPQUFRLDZCQUFSLENBQXhCO0FBQ0EsTUFBSSxPQUFPLGtCQUFrQixJQUFsQixDQUF3QixLQUF4QixDQUFYOztBQUVBO0FBQ0EsTUFBSyxrQkFBa0IsUUFBbEIsQ0FBNEIsNkJBQTVCLENBQUwsRUFBbUU7QUFDbEUsT0FBSSxXQUFXLEtBQUssSUFBTCxDQUFXLE1BQVgsQ0FBZjs7QUFFQSxPQUFJLGtCQUFrQixrQkFBa0IsR0FBbEIsQ0FBdUIsaUJBQXZCLENBQXRCOztBQUVBLFlBQVMsR0FBVCxDQUFjLE1BQWQsRUFBc0IsZUFBdEI7QUFDQTs7QUFFRCxPQUFLLEdBQUwsQ0FBVSxTQUFWLEVBQXFCLE9BQXJCO0FBQ0Esb0JBQWtCLEdBQWxCLENBQXVCO0FBQ3RCLG9CQUFpQixhQURLO0FBRXRCLFVBQU8sTUFGZTtBQUd0QixXQUFRO0FBSGMsR0FBdkI7QUFLQTs7QUFFRCxHQUFHLFFBQUgsRUFBYyxLQUFkLENBQXFCLFlBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsRUFKRDtBQUtBLENBNUtDLEdBQUY7O0FBOEtFLGFBQVc7QUFDWjs7QUFFQSxLQUFJLElBQUksTUFBUjs7QUFFQTs7Ozs7OztBQU9BLFVBQVMsYUFBVCxDQUF3QixJQUF4QixFQUErQjtBQUM5QixNQUFJLFFBQVEsS0FBSyxJQUFMLENBQVcsd0JBQVgsQ0FBWjtBQUNBLE1BQUssTUFBTSxNQUFOLEtBQWlCLENBQXRCLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQsUUFBTSxNQUFOLENBQWMsMkNBQTJDLE1BQU0sSUFBTixDQUFZLEtBQVosQ0FBM0MsR0FBaUUsV0FBakUsR0FBK0UscUJBQXFCLHVCQUFwRyxHQUE4SCw2Q0FBNUk7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLFVBQVQsR0FBc0I7QUFDckIsSUFBRyxpQkFBSCxFQUF1QixJQUF2QixDQUE2Qix3QkFBN0IsRUFBd0QsUUFBeEQsR0FBbUUsTUFBbkU7QUFDQTs7QUFFRDs7Ozs7Ozs7QUFRQSxVQUFTLGlCQUFULENBQTRCLFVBQTVCLEVBQXdDLElBQXhDLEVBQStDO0FBQzlDLGFBQVcsSUFBWCxDQUFpQixrQ0FBakIsRUFBc0QsV0FBdEQsQ0FBbUUsUUFBbkU7QUFDQSxPQUFLLFFBQUwsQ0FBZSxRQUFmOztBQUVBO0FBQ0EsZ0JBQWUsSUFBZjtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxpQkFBVCxDQUE0QixVQUE1QixFQUF5QztBQUN4QyxhQUFXLElBQVgsQ0FBaUIsZ0JBQWpCLEVBQW9DLFdBQXBDLENBQWlELHNCQUFqRCxFQUEwRSxRQUExRSxDQUFvRixvQkFBcEY7QUFDQSxhQUFXLElBQVgsQ0FBaUIsb0NBQWpCLEVBQXdELElBQXhELENBQThELGVBQTlELEVBQStFLE1BQS9FO0FBQ0EsYUFBVyxJQUFYLENBQWlCLDJCQUFqQixFQUErQyxXQUEvQyxDQUE0RCxRQUE1RDs7QUFFQSxNQUFJLGlCQUFpQixXQUFXLElBQVgsQ0FBaUIsb0NBQWpCLENBQXJCOztBQUVBLElBQUcsWUFBSCxFQUFrQixRQUFsQixDQUE0Qix3QkFBNUI7O0FBRUEsTUFBSyxlQUFlLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMsT0FBSSxZQUFZLGVBQWUsSUFBZixDQUFxQixlQUFyQixDQUFoQjtBQUNBLGlCQUFlLEVBQUcsTUFBTSxTQUFULENBQWY7O0FBRUEsY0FBVyxFQUFYLENBQWUsT0FBZixFQUF3Qiw2QkFBeEIsRUFBdUQsVUFBVSxDQUFWLEVBQWM7QUFDcEUsUUFBSSxRQUFRLEVBQUcsSUFBSCxDQUFaO0FBQ0EsUUFBSSxTQUFTLE1BQU0sSUFBTixDQUFZLGVBQVosQ0FBYjs7QUFFQSxlQUFXLElBQVgsQ0FBaUIseUJBQWpCLEVBQTZDLFdBQTdDLENBQTBELFFBQTFEO0FBQ0EsVUFBTSxNQUFOLEdBQWUsUUFBZixDQUF5QixRQUF6Qjs7QUFFQSxzQkFBbUIsVUFBbkIsRUFBK0IsRUFBRyxNQUFNLE1BQVQsQ0FBL0I7O0FBRUEsTUFBRSxjQUFGO0FBQ0EsSUFWRDtBQVdBLEdBZkQsTUFnQks7QUFDSixpQkFBZSxVQUFmO0FBQ0E7O0FBRUQsSUFBRyxvQkFBSCxFQUEwQixJQUExQjtBQUNBOztBQUVEOzs7OztBQUtBLFVBQVMsa0JBQVQsR0FBOEI7QUFDN0IsTUFBSSxhQUFhLEVBQUcsaUJBQUgsRUFBdUIsSUFBdkIsQ0FBNkIsNEJBQTdCLENBQWpCO0FBQ0EsYUFBVyxJQUFYLENBQWlCLDJCQUFqQixFQUErQyxRQUEvQyxDQUF5RCxRQUF6RDs7QUFFQTs7QUFFQSxhQUFXLElBQVgsQ0FBaUIsZ0JBQWpCLEVBQW9DLFdBQXBDLENBQWlELG9CQUFqRCxFQUF3RSxRQUF4RSxDQUFrRixzQkFBbEY7QUFDQSxhQUFXLElBQVgsQ0FBaUIsb0NBQWpCLEVBQXdELElBQXhELENBQThELGVBQTlELEVBQStFLE9BQS9FOztBQUVBLElBQUcsWUFBSCxFQUFrQixXQUFsQixDQUErQix3QkFBL0I7QUFDQSxJQUFHLG9CQUFILEVBQTBCLElBQTFCO0FBQ0E7O0FBRUQsR0FBRyxVQUFILEVBQWdCLEtBQWhCLENBQXVCLFlBQVc7QUFDakM7QUFDQSxFQUZEOztBQUlBLEdBQUcsNEJBQUgsRUFBa0MsRUFBbEMsQ0FBc0MsT0FBdEMsRUFBK0Msb0NBQS9DLEVBQXFGLFVBQVUsQ0FBVixFQUFjO0FBQ2xHLE1BQUksYUFBYSxFQUFHLEVBQUUsY0FBTCxDQUFqQjtBQUNBLE1BQUksWUFBWSxXQUFXLElBQVgsQ0FBaUIsMkJBQWpCLENBQWhCO0FBQ0EsTUFBSyxVQUFVLFFBQVYsQ0FBb0IsUUFBcEIsQ0FBTCxFQUFzQztBQUNyQyxxQkFBbUIsVUFBbkI7QUFDQSxHQUZELE1BRU87QUFDTjtBQUNBO0FBQ0QsRUFSRDtBQVNBLENBcEhDLEdBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCB3cHNlb0FkbWluR2xvYmFsTDEwbiwgd3BzZW9Db25zb2xlTm90aWZpY2F0aW9ucyAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG5cbiggZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBEaXNwbGF5cyBjb25zb2xlIG5vdGlmaWNhdGlvbnMuXG5cdCAqXG5cdCAqIExvb2tzIGF0IGEgZ2xvYmFsIHZhcmlhYmxlIHRvIGRpc3BsYXkgYWxsIG5vdGlmaWNhdGlvbnMgaW4gdGhlcmUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGxheUNvbnNvbGVOb3RpZmljYXRpb25zKCkge1xuXHRcdGlmICggdHlwZW9mIHdpbmRvdy53cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHdwc2VvQ29uc29sZU5vdGlmaWNhdGlvbnMubGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0Y29uc29sZS53YXJuKCB3cHNlb0NvbnNvbGVOb3RpZmljYXRpb25zWyBpbmRleCBdICk7XG5cdFx0fVxuXHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kICovXG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGRpc3BsYXlDb25zb2xlTm90aWZpY2F0aW9ucyApO1xuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIGRpc21pc3MgdGhlIHRhZ2xpbmUgbm90aWNlIGZvciBhIHNwZWNpZmljIHVzZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UoIG5vbmNlICkge1xuXHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fZGlzbWlzc190YWdsaW5lX25vdGljZVwiLFxuXHRcdFx0X3dwbm9uY2U6IG5vbmNlLFxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gcmVtb3ZlIHRoZSBhZG1pbiBub3RpY2VzIGZvciBzZXZlcmFsIHB1cnBvc2VzLCBkaWVzIG9uIGV4aXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25cblx0ICogQHBhcmFtIHtzdHJpbmd9IGhpZGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TZXRJZ25vcmUoIG9wdGlvbiwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19zZXRfaWdub3JlXCIsXG5cdFx0XHRvcHRpb246IG9wdGlvbixcblx0XHRcdF93cG5vbmNlOiBub25jZSxcblx0XHR9LCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0alF1ZXJ5KCBcIiNcIiArIGhpZGUgKS5oaWRlKCk7XG5cdFx0XHRcdGpRdWVyeSggXCIjaGlkZGVuX2lnbm9yZV9cIiArIG9wdGlvbiApLnZhbCggXCJpZ25vcmVcIiApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIGRpc21pc3NhYmxlIGFuY2hvciBidXR0b25cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRpc21pc3NfbGluayBUaGUgVVJMIHRoYXQgbGVhZHMgdG8gdGhlIGRpc21pc3Npbmcgb2YgdGhlIG5vdGljZS5cblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gQW5jaG9yIHRvIGRpc21pc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NMaW5rKCBkaXNtaXNzX2xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NfbGluayArICdcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJub3RpY2UtZGlzbWlzc1wiPicgK1xuXHRcdFx0JzxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+RGlzbWlzcyB0aGlzIG5vdGljZS48L3NwYW4+JyArXG5cdFx0XHRcIjwvYT5cIlxuXHRcdCk7XG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeSggXCIueW9hc3QtZGlzbWlzc2libGVcIiApLm9uKCBcImNsaWNrXCIsIFwiLnlvYXN0LW5vdGljZS1kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRwYXJlbnREaXYgPSBqUXVlcnkoIHRoaXMgKS5wYXJlbnQoKTtcblxuXHRcdFx0Ly8gRGVwcmVjYXRlZCwgdG9kbzogcmVtb3ZlIHdoZW4gYWxsIG5vdGlmaWVycyBoYXZlIGJlZW4gaW1wbGVtZW50ZWQuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogJHBhcmVudERpdi5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvLS9nLCBcIl9cIiApLFxuXHRcdFx0XHRcdF93cG5vbmNlOiAkcGFyZW50RGl2LmRhdGEoIFwibm9uY2VcIiApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggXCJqc29uXCIgKSxcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19ub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRub3RpZmljYXRpb246ICRwYXJlbnREaXYuYXR0ciggXCJpZFwiICksXG5cdFx0XHRcdFx0bm9uY2U6ICRwYXJlbnREaXYuZGF0YSggXCJub25jZVwiICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCBcImpzb25cIiApLFxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkcGFyZW50RGl2LmZhZGVUbyggMTAwLCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHBhcmVudERpdi5zbGlkZVVwKCAxMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRwYXJlbnREaXYucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gKTtcblxuXHRcdGpRdWVyeSggXCIueW9hc3QtaGVscC1idXR0b25cIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRidXR0b24gPSBqUXVlcnkoIHRoaXMgKSxcblx0XHRcdFx0aGVscFBhbmVsID0galF1ZXJ5KCBcIiNcIiArICRidXR0b24uYXR0ciggXCJhcmlhLWNvbnRyb2xzXCIgKSApLFxuXHRcdFx0XHRpc1BhbmVsVmlzaWJsZSA9IGhlbHBQYW5lbC5pcyggXCI6dmlzaWJsZVwiICk7XG5cblx0XHRcdGpRdWVyeSggaGVscFBhbmVsICkuc2xpZGVUb2dnbGUoIDIwMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRidXR0b24uYXR0ciggXCJhcmlhLWV4cGFuZGVkXCIsICEgaXNQYW5lbFZpc2libGUgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH0gKTtcblx0d2luZG93Lndwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UgPSB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlO1xuXHR3aW5kb3cud3BzZW9TZXRJZ25vcmUgPSB3cHNlb1NldElnbm9yZTtcblx0d2luZG93Lndwc2VvRGlzbWlzc0xpbmsgPSB3cHNlb0Rpc21pc3NMaW5rO1xufSgpICk7XG5cbiggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciAkID0galF1ZXJ5O1xuXG5cdC8qKlxuXHQgKiBIaWRlIHBvcHVwIHNob3dpbmcgbmV3IGFsZXJ0cyBtZXNzYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBbGVydFBvcHVwKCkge1xuXHRcdC8vIFJlbW92ZSB0aGUgbmFtZXNwYWNlZCBob3ZlciBldmVudCBmcm9tIHRoZSBtZW51IHRvcCBsZXZlbCBsaXN0IGl0ZW1zLlxuXHRcdCQoIFwiI3dwLWFkbWluLWJhci1yb290LWRlZmF1bHQgPiBsaVwiICkub2ZmKCBcImhvdmVyLnlvYXN0YWxlcnRwb3B1cFwiICk7XG5cdFx0Ly8gSGlkZSB0aGUgbm90aWZpY2F0aW9uIHBvcHVwIGJ5IGZhZGluZyBpdCBvdXQuXG5cdFx0JCggXCIueW9hc3QtaXNzdWUtYWRkZWRcIiApLmZhZGVPdXQoIDIwMCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNob3cgcG9wdXAgd2l0aCBuZXcgYWxlcnRzIG1lc3NhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0FsZXJ0UG9wdXAoKSB7XG5cdFx0Ly8gQXR0YWNoIGFuIGhvdmVyIGV2ZW50IGFuZCBzaG93IHRoZSBub3RpZmljYXRpb24gcG9wdXAgYnkgZmFkaW5nIGl0IGluLlxuXHRcdCQoIFwiLnlvYXN0LWlzc3VlLWFkZGVkXCIgKVxuXHRcdFx0Lm9uKCBcImhvdmVyXCIsIGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0XHRcdC8vIEF2b2lkIHRoZSBob3ZlciBldmVudCB0byBwcm9wYWdhdGUgb24gdGhlIHBhcmVudCBlbGVtZW50cy5cblx0XHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHQvLyBIaWRlIHRoZSBub3RpZmljYXRpb24gcG9wdXAgd2hlbiBob3ZlcmluZyBvbiBpdC5cblx0XHRcdFx0aGlkZUFsZXJ0UG9wdXAoKTtcblx0XHRcdH0gKVxuXHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0Lypcblx0XHQgKiBBdHRhY2ggYSBuYW1lc3BhY2VkIGhvdmVyIGV2ZW50IG9uIHRoZSBtZW51IHRvcCBsZXZlbCBpdGVtcyB0byBoaWRlXG5cdFx0ICogdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCB3aGVuIGhvdmVyaW5nIHRoZW0uXG5cdFx0ICogTm90ZTogdGhpcyB3aWxsIHdvcmsganVzdCB0aGUgZmlyc3QgdGltZSB0aGUgbGlzdCBpdGVtcyBnZXQgaG92ZXJlZCBpbiB0aGVcblx0XHQgKiBmaXJzdCAzIHNlY29uZHMgYWZ0ZXIgRE9NIHJlYWR5IGJlY2F1c2UgdGhpcyBldmVudCBpcyB0aGVuIHJlbW92ZWQuXG5cdFx0ICovXG5cdFx0JCggXCIjd3AtYWRtaW4tYmFyLXJvb3QtZGVmYXVsdCA+IGxpXCIgKS5vbiggXCJob3Zlci55b2FzdGFsZXJ0cG9wdXBcIiwgaGlkZUFsZXJ0UG9wdXAgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG5vdGlmaWNhdGlvbiBwb3B1cCBhZnRlciAzIHNlY29uZHMgZnJvbSBET00gcmVhZHkuXG5cdFx0c2V0VGltZW91dCggaGlkZUFsZXJ0UG9wdXAsIDMwMDAgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGUgZGlzbWlzcyBhbmQgcmVzdG9yZSBBSkFYIHJlc3BvbnNlc1xuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gJHNvdXJjZSBPYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBBSkFYIHJlc3BvbnNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UoICRzb3VyY2UsIHJlc3BvbnNlICkge1xuXHRcdCQoIFwiLnlvYXN0LWFsZXJ0LWhvbGRlclwiICkub2ZmKCBcImNsaWNrXCIsIFwiLnJlc3RvcmVcIiApLm9mZiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIgKTtcblxuXHRcdGlmICggdHlwZW9mIHJlc3BvbnNlLmh0bWwgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCByZXNwb25zZS5odG1sICkge1xuXHRcdFx0JHNvdXJjZS5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApLmh0bWwoIHJlc3BvbnNlLmh0bWwgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlICovXG5cdFx0XHRob29rRGlzbWlzc1Jlc3RvcmVCdXR0b25zKCk7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXHRcdFx0LyogZXNsaW50LWVuYWJsZSAqL1xuXHRcdH1cblxuXHRcdHZhciAkd3BzZW9fbWVudSA9ICQoIFwiI3dwLWFkbWluLWJhci13cHNlby1tZW51XCIgKTtcblx0XHR2YXIgJGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblxuXHRcdGlmICggISAkaXNzdWVfY291bnRlci5sZW5ndGggKSB7XG5cdFx0XHQkd3BzZW9fbWVudS5maW5kKCBcIj4gYTpmaXJzdC1jaGlsZFwiICkuYXBwZW5kKCAnPGRpdiBjbGFzcz1cInlvYXN0LWlzc3VlLWNvdW50ZXJcIi8+JyApO1xuXHRcdFx0JGlzc3VlX2NvdW50ZXIgPSAkd3BzZW9fbWVudS5maW5kKCBcIi55b2FzdC1pc3N1ZS1jb3VudGVyXCIgKTtcblx0XHR9XG5cblx0XHQkaXNzdWVfY291bnRlci5odG1sKCByZXNwb25zZS50b3RhbCApO1xuXHRcdGlmICggcmVzcG9uc2UudG90YWwgPT09IDAgKSB7XG5cdFx0XHQkaXNzdWVfY291bnRlci5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRpc3N1ZV9jb3VudGVyLnNob3coKTtcblx0XHR9XG5cblx0XHQkKCBcIiN0b3BsZXZlbF9wYWdlX3dwc2VvX2Rhc2hib2FyZCAudXBkYXRlLXBsdWdpbnNcIiApLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoIFwidXBkYXRlLXBsdWdpbnMgY291bnQtXCIgKyByZXNwb25zZS50b3RhbCApO1xuXHRcdCQoIFwiI3RvcGxldmVsX3BhZ2Vfd3BzZW9fZGFzaGJvYXJkIC5wbHVnaW4tY291bnRcIiApLmh0bWwoIHJlc3BvbnNlLnRvdGFsICk7XG5cdH1cblxuXHQvKipcblx0ICogSG9vayB0aGUgcmVzdG9yZSBhbmQgZGlzbWlzcyBidXR0b25zXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpIHtcblx0XHR2YXIgJGRpc21pc3NpYmxlID0gJCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdCRkaXNtaXNzaWJsZS5vbiggXCJjbGlja1wiLCBcIi5kaXNtaXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0dmFyICRzb3VyY2UgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1hbGVydC1ob2xkZXJcIiApO1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoIFwiLnlvYXN0LWNvbnRhaW5lclwiICk7XG5cdFx0XHQkY29udGFpbmVyLmFwcGVuZCggJzxkaXYgY2xhc3M9XCJ5b2FzdC1jb250YWluZXItZGlzYWJsZWRcIi8+JyApO1xuXG5cdFx0XHQkdGhpcy5maW5kKCBcInNwYW5cIiApLnJlbW92ZUNsYXNzKCBcImRhc2hpY29ucy1uby1hbHRcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZGlzbWlzc19hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cblx0XHQkZGlzbWlzc2libGUub24oIFwiY2xpY2tcIiwgXCIucmVzdG9yZVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciAkc291cmNlID0gJHRoaXMuY2xvc2VzdCggXCIueW9hc3QtYWxlcnQtaG9sZGVyXCIgKTtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCBcIi55b2FzdC1jb250YWluZXJcIiApO1xuXHRcdFx0JGNvbnRhaW5lci5hcHBlbmQoICc8ZGl2IGNsYXNzPVwieW9hc3QtY29udGFpbmVyLWRpc2FibGVkXCIvPicgKTtcblxuXHRcdFx0JHRoaXMuZmluZCggXCJzcGFuXCIgKS5yZW1vdmVDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctdXBcIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1yYW5kb21pemVcIiApO1xuXG5cdFx0XHQkLnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246IFwieW9hc3RfcmVzdG9yZV9hbGVydFwiLFxuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbjogJHNvdXJjZS5hdHRyKCBcImlkXCIgKSxcblx0XHRcdFx0XHRub25jZTogJHNvdXJjZS5kYXRhKCBcIm5vbmNlXCIgKSxcblx0XHRcdFx0XHRkYXRhOiAkc291cmNlLmRhdGEoIFwianNvblwiICksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhhbmRsZURpc21pc3NSZXN0b3JlUmVzcG9uc2UuYmluZCggdGhpcywgJHNvdXJjZSApLFxuXHRcdFx0XHRcImpzb25cIlxuXHRcdFx0KTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgY29sb3Igb2YgdGhlIHN2ZyBmb3IgdGhlIHByZW1pdW0gaW5kaWNhdG9yIGJhc2VkIG9uIHRoZSBjb2xvciBvZiB0aGUgY29sb3Igc2NoZW1lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpIHtcblx0XHRsZXQgJHByZW1pdW1JbmRpY2F0b3IgPSBqUXVlcnkoIFwiLndwc2VvLWpzLXByZW1pdW0taW5kaWNhdG9yXCIgKTtcblx0XHRsZXQgJHN2ZyA9ICRwcmVtaXVtSW5kaWNhdG9yLmZpbmQoIFwic3ZnXCIgKTtcblxuXHRcdC8vIERvbid0IGNoYW5nZSB0aGUgY29sb3IgdG8gc3RhbmQgb3V0IHdoZW4gcHJlbWl1bSBpcyBhY3R1YWxseSBlbmFibGVkLlxuXHRcdGlmICggJHByZW1pdW1JbmRpY2F0b3IuaGFzQ2xhc3MoIFwid3BzZW8tcHJlbWl1bS1pbmRpY2F0b3ItLW5vXCIgKSApIHtcblx0XHRcdGxldCAkc3ZnUGF0aCA9ICRzdmcuZmluZCggXCJwYXRoXCIgKTtcblxuXHRcdFx0bGV0IGJhY2tncm91bmRDb2xvciA9ICRwcmVtaXVtSW5kaWNhdG9yLmNzcyggXCJiYWNrZ3JvdW5kQ29sb3JcIiApO1xuXG5cdFx0XHQkc3ZnUGF0aC5jc3MoIFwiZmlsbFwiLCBiYWNrZ3JvdW5kQ29sb3IgKTtcblx0XHR9XG5cblx0XHQkc3ZnLmNzcyggXCJkaXNwbGF5XCIsIFwiYmxvY2tcIiApO1xuXHRcdCRwcmVtaXVtSW5kaWNhdG9yLmNzcygge1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG5cdFx0XHR3aWR0aDogXCIyMHB4XCIsXG5cdFx0XHRoZWlnaHQ6IFwiMjBweFwiLFxuXHRcdH0gKTtcblx0fVxuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHNob3dBbGVydFBvcHVwKCk7XG5cdFx0aG9va0Rpc21pc3NSZXN0b3JlQnV0dG9ucygpO1xuXHRcdHNldFByZW1pdW1JbmRpY2F0b3JDb2xvcigpO1xuXHR9ICk7XG59KCkgKTtcblxuKCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyICQgPSBqUXVlcnk7XG5cblx0LyoqXG5cdCAqIFN0YXJ0IHZpZGVvIGlmIGZvdW5kIG9uIHRoZSB0YWJcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlVmlkZW8oICR0YWIgKSB7XG5cdFx0dmFyICRkYXRhID0gJHRhYi5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApO1xuXHRcdGlmICggJGRhdGEubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCRkYXRhLmFwcGVuZCggJzxpZnJhbWUgd2lkdGg9XCI1NjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCInICsgJGRhdGEuZGF0YSggXCJ1cmxcIiApICsgJ1wiIHRpdGxlPVwiJyArIHdwc2VvQWRtaW5HbG9iYWxMMTBuLmhlbHBfdmlkZW9faWZyYW1lX3RpdGxlICsgJ1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nICk7XG5cdH1cblxuXHQvKipcblx0ICogU3RvcCBwbGF5aW5nIGFueSB2aWRlby5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wVmlkZW9zKCkge1xuXHRcdCQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW9fX2RhdGFcIiApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogT3BlbiB0YWJcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgQ29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIHRhYi5cblx0ICogQHBhcmFtIHtvYmplY3R9ICR0YWIgVGFiIHRoYXQgaXMgYWN0aXZhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkdGFiICkge1xuXHRcdCRjb250YWluZXIuZmluZCggXCIueW9hc3QtaGVscC1jZW50ZXItdGFicy13cmFwIGRpdlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHQkdGFiLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cdFx0YWN0aXZhdGVWaWRlbyggJHRhYiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW4gVmlkZW8gU2xpZGVvdXRcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRjb250YWluZXIgVGFiIHRvIG9wZW4gdmlkZW8gc2xpZGVyIG9mLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5WaWRlb1NsaWRlb3V0KCAkY29udGFpbmVyICkge1xuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LWRvd25cIiApLmFkZENsYXNzKCBcImRhc2hpY29ucy1hcnJvdy11cFwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIiApO1xuXHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0XCIgKS5yZW1vdmVDbGFzcyggXCJoaWRkZW5cIiApO1xuXG5cdFx0dmFyICRhY3RpdmVUYWJMaW5rID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby1oZWxwLWNlbnRlci1pdGVtLmFjdGl2ZSA+IGFcIiApO1xuXG5cdFx0JCggXCIjd3Bjb250ZW50XCIgKS5hZGRDbGFzcyggXCJ5b2FzdC1oZWxwLWNlbnRlci1vcGVuXCIgKTtcblxuXHRcdGlmICggJGFjdGl2ZVRhYkxpbmsubGVuZ3RoID4gMCApIHtcblx0XHRcdHZhciBhY3RpdmVUYWIgPSAkYWN0aXZlVGFiTGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApO1xuXHRcdFx0YWN0aXZhdGVWaWRlbyggJCggXCIjXCIgKyBhY3RpdmVUYWIgKSApO1xuXG5cdFx0XHQkY29udGFpbmVyLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0gPiBhXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgJGxpbmsgPSAkKCB0aGlzICk7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkbGluay5hdHRyKCBcImFyaWEtY29udHJvbHNcIiApO1xuXG5cdFx0XHRcdCRjb250YWluZXIuZmluZCggXCIud3BzZW8taGVscC1jZW50ZXItaXRlbVwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdFx0JGxpbmsucGFyZW50KCkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0XHRvcGVuSGVscENlbnRlclRhYiggJGNvbnRhaW5lciwgJCggXCIjXCIgKyB0YXJnZXQgKSApO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCAkY29udGFpbmVyICk7XG5cdFx0fVxuXG5cdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLmhpZGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9zZSBWaWRlbyBTbGlkZW91dFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlVmlkZW9TbGlkZW91dCgpIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIFwiI3dwYm9keS1jb250ZW50XCIgKS5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyXCIgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoIFwiLndwc2VvLXRhYi12aWRlby1zbGlkZW91dFwiICkuYWRkQ2xhc3MoIFwiaGlkZGVuXCIgKTtcblxuXHRcdHN0b3BWaWRlb3MoKTtcblxuXHRcdCRjb250YWluZXIuZmluZCggXCIudG9nZ2xlX19hcnJvd1wiICkucmVtb3ZlQ2xhc3MoIFwiZGFzaGljb25zLWFycm93LXVwXCIgKS5hZGRDbGFzcyggXCJkYXNoaWNvbnMtYXJyb3ctZG93blwiICk7XG5cdFx0JGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGVcIiApLmF0dHIoIFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIgKTtcblxuXHRcdCQoIFwiI3dwY29udGVudFwiICkucmVtb3ZlQ2xhc3MoIFwieW9hc3QtaGVscC1jZW50ZXItb3BlblwiICk7XG5cdFx0JCggXCIjc2lkZWJhci1jb250YWluZXJcIiApLnNob3coKTtcblx0fVxuXG5cdCQoIFwiLm5hdi10YWJcIiApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0fSApO1xuXG5cdCQoIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJcIiApLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLXRhYi12aWRlby1jb250YWluZXJfX2hhbmRsZVwiLCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoIGUuZGVsZWdhdGVUYXJnZXQgKTtcblx0XHR2YXIgJHNsaWRlb3V0ID0gJGNvbnRhaW5lci5maW5kKCBcIi53cHNlby10YWItdmlkZW8tc2xpZGVvdXRcIiApO1xuXHRcdGlmICggJHNsaWRlb3V0Lmhhc0NsYXNzKCBcImhpZGRlblwiICkgKSB7XG5cdFx0XHRvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0XHR9XG5cdH0gKTtcbn0oKSApO1xuIl19
