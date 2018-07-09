(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */

jQuery(function ($) {
	var currentScreen = $(location).attr("pathname").split("/").pop();
	var slugField = currentScreen === "edit-tags.php" ? "slug" : "post_name";
	var notificationTarget = $(".wrap").children().eq(0);

	/**
  * Use notification counter so we can count how many times the function wpseoShowNotification is called.
  *
  * @type {number}
  */
	var wpseoNotificationCounter = 0;

	var addedNotifications = [];

	/**
  * Adds the given notification to the DOM if it doesn't already exist.
  *
  * @param {string} notification The notification to add.
  *
  * @returns {void}
  */
	function addNotificationToDom(notification) {
		if (!addedNotifications.includes(notification)) {
			addedNotifications.push(notification);

			$(notification).insertAfter(notificationTarget);
		}
	}

	/**
  * Shows notification to user when a redirect is created.
  *
  * When the response is empty, up the notification counter with 1, wait 500 ms and call the function again.
  * Stops when the notification counter is more than 20.
  *
  * @returns {void}
  */
	function wpseoShowNotification() {
		$.post(ajaxurl, {
			action: "yoast_get_notifications",
			version: 2
		}, function (response) {
			if (response !== "") {
				wpseoNotificationCounter = 0;

				var notifications = JSON.parse(response);
				notifications.map(addNotificationToDom);
			}

			if (wpseoNotificationCounter < 20 && response === "") {
				wpseoNotificationCounter++;
				setTimeout(wpseoShowNotification, 500);
			}
		});
	}

	/**
  * Gets the current post or term ID.
  *
  * Returns an empty string if no editor is currently active.
  *
  * @param {Object} editor The editor to get the ID from.
  *
  * @returns {string} The ID of the current post or term.
  */
	function wpseoGetItemId(editor) {
		if (editor.length === 0 || editor === "") {
			return "";
		}

		return editor.attr("id").replace("edit-", "");
	}

	/**
  * Gets the current slug of a post based on the current page and post or term being edited.
  *
  * @param {string} currentPost The current element.
  *
  * @returns {string} The slug of the current post or term.
  */
	function wpseoGetCurrentSlug(currentPost) {
		return $("#inline_" + currentPost).find("." + slugField).html();
	}

	/**
  * Checks whether or not the slug has changed.
  *
  * @returns {boolean} Whether or not the slug has changed.
  */
	function wpseoSlugChanged() {
		var editor = $("tr.inline-editor");
		var currentPost = wpseoGetItemId(editor);
		var currentSlug = wpseoGetCurrentSlug(currentPost);
		var newSlug = editor.find("input[name=" + slugField + "]").val();

		return currentSlug !== newSlug;
	}

	if (["edit.php", "edit-tags.php"].includes(currentScreen)) {
		$("#inline-edit input").on("keydown", function (ev) {
			// 13 refers to the enter key.
			if (ev.which === 13 && wpseoSlugChanged()) {
				wpseoShowNotification();
			}
		});

		$(".button-primary").click(function (ev) {
			if ($(ev.target).attr("id") !== "save-order" && wpseoSlugChanged()) {
				wpseoShowNotification();
			}
		});
	}

	if (currentScreen === "edit-tags.php") {
		$(document).on("ajaxComplete", function (e, xhr, settings) {
			if (settings.data.indexOf("action=delete-tag") > -1) {
				wpseoShowNotification();
			}
		});
	}
}(jQuery));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXF1aWNrLWVkaXQtaGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUUsT0FBUSxVQUFVLENBQVYsRUFBYztBQUN2QixLQUFNLGdCQUFxQixFQUFHLFFBQUgsRUFBYyxJQUFkLENBQW9CLFVBQXBCLEVBQWlDLEtBQWpDLENBQXdDLEdBQXhDLEVBQThDLEdBQTlDLEVBQTNCO0FBQ0EsS0FBTSxZQUFxQixrQkFBa0IsZUFBbEIsR0FBb0MsTUFBcEMsR0FBNkMsV0FBeEU7QUFDQSxLQUFNLHFCQUFxQixFQUFHLE9BQUgsRUFBYSxRQUFiLEdBQXdCLEVBQXhCLENBQTRCLENBQTVCLENBQTNCOztBQUVBOzs7OztBQUtBLEtBQUksMkJBQTJCLENBQS9COztBQUVBLEtBQUkscUJBQXFCLEVBQXpCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyxvQkFBVCxDQUErQixZQUEvQixFQUE4QztBQUM3QyxNQUFLLENBQUUsbUJBQW1CLFFBQW5CLENBQTZCLFlBQTdCLENBQVAsRUFBcUQ7QUFDcEQsc0JBQW1CLElBQW5CLENBQXlCLFlBQXpCOztBQUVBLEtBQUcsWUFBSCxFQUFrQixXQUFsQixDQUErQixrQkFBL0I7QUFDQTtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFVBQVMscUJBQVQsR0FBaUM7QUFDaEMsSUFBRSxJQUFGLENBQ0MsT0FERCxFQUVDO0FBQ0MsV0FBUSx5QkFEVDtBQUVDLFlBQVM7QUFGVixHQUZELEVBTUMsVUFBVSxRQUFWLEVBQXFCO0FBQ3BCLE9BQUssYUFBYSxFQUFsQixFQUF1QjtBQUN0QiwrQkFBMkIsQ0FBM0I7O0FBRUEsUUFBSSxnQkFBZ0IsS0FBSyxLQUFMLENBQVksUUFBWixDQUFwQjtBQUNBLGtCQUFjLEdBQWQsQ0FBbUIsb0JBQW5CO0FBQ0E7O0FBRUQsT0FBSywyQkFBMkIsRUFBM0IsSUFBaUMsYUFBYSxFQUFuRCxFQUF3RDtBQUN2RDtBQUNBLGVBQVkscUJBQVosRUFBbUMsR0FBbkM7QUFDQTtBQUNELEdBbEJGO0FBb0JBOztBQUVEOzs7Ozs7Ozs7QUFTQSxVQUFTLGNBQVQsQ0FBeUIsTUFBekIsRUFBa0M7QUFDakMsTUFBSyxPQUFPLE1BQVAsS0FBa0IsQ0FBbEIsSUFBdUIsV0FBVyxFQUF2QyxFQUE0QztBQUMzQyxVQUFPLEVBQVA7QUFDQTs7QUFFRCxTQUFPLE9BQU8sSUFBUCxDQUFhLElBQWIsRUFBb0IsT0FBcEIsQ0FBNkIsT0FBN0IsRUFBc0MsRUFBdEMsQ0FBUDtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxtQkFBVCxDQUE4QixXQUE5QixFQUE0QztBQUMzQyxTQUFPLEVBQUcsYUFBYSxXQUFoQixFQUE4QixJQUE5QixDQUFvQyxNQUFNLFNBQTFDLEVBQXNELElBQXRELEVBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGdCQUFULEdBQTRCO0FBQzNCLE1BQU0sU0FBYyxFQUFHLGtCQUFILENBQXBCO0FBQ0EsTUFBTSxjQUFjLGVBQWdCLE1BQWhCLENBQXBCO0FBQ0EsTUFBTSxjQUFjLG9CQUFxQixXQUFyQixDQUFwQjtBQUNBLE1BQU0sVUFBYyxPQUFPLElBQVAsQ0FBYSxnQkFBZ0IsU0FBaEIsR0FBNEIsR0FBekMsRUFBK0MsR0FBL0MsRUFBcEI7O0FBRUEsU0FBTyxnQkFBZ0IsT0FBdkI7QUFDQTs7QUFFRCxLQUFLLENBQUUsVUFBRixFQUFjLGVBQWQsRUFBZ0MsUUFBaEMsQ0FBMEMsYUFBMUMsQ0FBTCxFQUFpRTtBQUNoRSxJQUFHLG9CQUFILEVBQTBCLEVBQTFCLENBQThCLFNBQTlCLEVBQXlDLFVBQVUsRUFBVixFQUFlO0FBQ3ZEO0FBQ0EsT0FBSyxHQUFHLEtBQUgsS0FBYSxFQUFiLElBQW1CLGtCQUF4QixFQUE2QztBQUM1QztBQUNBO0FBQ0QsR0FMRDs7QUFPQSxJQUFHLGlCQUFILEVBQXVCLEtBQXZCLENBQThCLFVBQVUsRUFBVixFQUFlO0FBQzVDLE9BQUssRUFBRyxHQUFHLE1BQU4sRUFBZSxJQUFmLENBQXFCLElBQXJCLE1BQWdDLFlBQWhDLElBQWdELGtCQUFyRCxFQUEwRTtBQUN6RTtBQUNBO0FBQ0QsR0FKRDtBQUtBOztBQUVELEtBQUssa0JBQWtCLGVBQXZCLEVBQXlDO0FBQ3hDLElBQUcsUUFBSCxFQUFjLEVBQWQsQ0FBa0IsY0FBbEIsRUFBa0MsVUFBVSxDQUFWLEVBQWEsR0FBYixFQUFrQixRQUFsQixFQUE2QjtBQUM5RCxPQUFLLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBdUIsbUJBQXZCLElBQStDLENBQUMsQ0FBckQsRUFBeUQ7QUFDeEQ7QUFDQTtBQUNELEdBSkQ7QUFLQTtBQUNELENBNUhTLENBNEhQLE1BNUhPLENBQVIsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuXG4oIGpRdWVyeSggZnVuY3Rpb24oICQgKSB7XG5cdGNvbnN0IGN1cnJlbnRTY3JlZW4gICAgICA9ICQoIGxvY2F0aW9uICkuYXR0ciggXCJwYXRobmFtZVwiICkuc3BsaXQoIFwiL1wiICkucG9wKCk7XG5cdGNvbnN0IHNsdWdGaWVsZCAgICAgICAgICA9IGN1cnJlbnRTY3JlZW4gPT09IFwiZWRpdC10YWdzLnBocFwiID8gXCJzbHVnXCIgOiBcInBvc3RfbmFtZVwiO1xuXHRjb25zdCBub3RpZmljYXRpb25UYXJnZXQgPSAkKCBcIi53cmFwXCIgKS5jaGlsZHJlbigpLmVxKCAwICk7XG5cblx0LyoqXG5cdCAqIFVzZSBub3RpZmljYXRpb24gY291bnRlciBzbyB3ZSBjYW4gY291bnQgaG93IG1hbnkgdGltZXMgdGhlIGZ1bmN0aW9uIHdwc2VvU2hvd05vdGlmaWNhdGlvbiBpcyBjYWxsZWQuXG5cdCAqXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRsZXQgd3BzZW9Ob3RpZmljYXRpb25Db3VudGVyID0gMDtcblxuXHRsZXQgYWRkZWROb3RpZmljYXRpb25zID0gW107XG5cblx0LyoqXG5cdCAqIEFkZHMgdGhlIGdpdmVuIG5vdGlmaWNhdGlvbiB0byB0aGUgRE9NIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbiBUaGUgbm90aWZpY2F0aW9uIHRvIGFkZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGROb3RpZmljYXRpb25Ub0RvbSggbm90aWZpY2F0aW9uICkge1xuXHRcdGlmICggISBhZGRlZE5vdGlmaWNhdGlvbnMuaW5jbHVkZXMoIG5vdGlmaWNhdGlvbiApICkge1xuXHRcdFx0YWRkZWROb3RpZmljYXRpb25zLnB1c2goIG5vdGlmaWNhdGlvbiApO1xuXG5cdFx0XHQkKCBub3RpZmljYXRpb24gKS5pbnNlcnRBZnRlciggbm90aWZpY2F0aW9uVGFyZ2V0ICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNob3dzIG5vdGlmaWNhdGlvbiB0byB1c2VyIHdoZW4gYSByZWRpcmVjdCBpcyBjcmVhdGVkLlxuXHQgKlxuXHQgKiBXaGVuIHRoZSByZXNwb25zZSBpcyBlbXB0eSwgdXAgdGhlIG5vdGlmaWNhdGlvbiBjb3VudGVyIHdpdGggMSwgd2FpdCA1MDAgbXMgYW5kIGNhbGwgdGhlIGZ1bmN0aW9uIGFnYWluLlxuXHQgKiBTdG9wcyB3aGVuIHRoZSBub3RpZmljYXRpb24gY291bnRlciBpcyBtb3JlIHRoYW4gMjAuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TaG93Tm90aWZpY2F0aW9uKCkge1xuXHRcdCQucG9zdChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9nZXRfbm90aWZpY2F0aW9uc1wiLFxuXHRcdFx0XHR2ZXJzaW9uOiAyLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0aWYgKCByZXNwb25zZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHR3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIgPSAwO1xuXG5cdFx0XHRcdFx0bGV0IG5vdGlmaWNhdGlvbnMgPSBKU09OLnBhcnNlKCByZXNwb25zZSApO1xuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbnMubWFwKCBhZGROb3RpZmljYXRpb25Ub0RvbSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIgPCAyMCAmJiByZXNwb25zZSA9PT0gXCJcIiApIHtcblx0XHRcdFx0XHR3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIrKztcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCB3cHNlb1Nob3dOb3RpZmljYXRpb24sIDUwMCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjdXJyZW50IHBvc3Qgb3IgdGVybSBJRC5cblx0ICpcblx0ICogUmV0dXJucyBhbiBlbXB0eSBzdHJpbmcgaWYgbm8gZWRpdG9yIGlzIGN1cnJlbnRseSBhY3RpdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBlZGl0b3IgVGhlIGVkaXRvciB0byBnZXQgdGhlIElEIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBJRCBvZiB0aGUgY3VycmVudCBwb3N0IG9yIHRlcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0dldEl0ZW1JZCggZWRpdG9yICkge1xuXHRcdGlmICggZWRpdG9yLmxlbmd0aCA9PT0gMCB8fCBlZGl0b3IgPT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gZWRpdG9yLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiZWRpdC1cIiwgXCJcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGN1cnJlbnQgc2x1ZyBvZiBhIHBvc3QgYmFzZWQgb24gdGhlIGN1cnJlbnQgcGFnZSBhbmQgcG9zdCBvciB0ZXJtIGJlaW5nIGVkaXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN1cnJlbnRQb3N0IFRoZSBjdXJyZW50IGVsZW1lbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzbHVnIG9mIHRoZSBjdXJyZW50IHBvc3Qgb3IgdGVybS5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvR2V0Q3VycmVudFNsdWcoIGN1cnJlbnRQb3N0ICkge1xuXHRcdHJldHVybiAkKCBcIiNpbmxpbmVfXCIgKyBjdXJyZW50UG9zdCApLmZpbmQoIFwiLlwiICsgc2x1Z0ZpZWxkICkuaHRtbCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyB3aGV0aGVyIG9yIG5vdCB0aGUgc2x1ZyBoYXMgY2hhbmdlZC5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBzbHVnIGhhcyBjaGFuZ2VkLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TbHVnQ2hhbmdlZCgpIHtcblx0XHRjb25zdCBlZGl0b3IgICAgICA9ICQoIFwidHIuaW5saW5lLWVkaXRvclwiICk7XG5cdFx0Y29uc3QgY3VycmVudFBvc3QgPSB3cHNlb0dldEl0ZW1JZCggZWRpdG9yICk7XG5cdFx0Y29uc3QgY3VycmVudFNsdWcgPSB3cHNlb0dldEN1cnJlbnRTbHVnKCBjdXJyZW50UG9zdCApO1xuXHRcdGNvbnN0IG5ld1NsdWcgICAgID0gZWRpdG9yLmZpbmQoIFwiaW5wdXRbbmFtZT1cIiArIHNsdWdGaWVsZCArIFwiXVwiICkudmFsKCk7XG5cblx0XHRyZXR1cm4gY3VycmVudFNsdWcgIT09IG5ld1NsdWc7XG5cdH1cblxuXHRpZiAoIFsgXCJlZGl0LnBocFwiLCBcImVkaXQtdGFncy5waHBcIiBdLmluY2x1ZGVzKCBjdXJyZW50U2NyZWVuICkgKSB7XG5cdFx0JCggXCIjaW5saW5lLWVkaXQgaW5wdXRcIiApLm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0Ly8gMTMgcmVmZXJzIHRvIHRoZSBlbnRlciBrZXkuXG5cdFx0XHRpZiAoIGV2LndoaWNoID09PSAxMyAmJiB3cHNlb1NsdWdDaGFuZ2VkKCkgKSB7XG5cdFx0XHRcdHdwc2VvU2hvd05vdGlmaWNhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdCQoIFwiLmJ1dHRvbi1wcmltYXJ5XCIgKS5jbGljayggZnVuY3Rpb24oIGV2ICkge1xuXHRcdFx0aWYgKCAkKCBldi50YXJnZXQgKS5hdHRyKCBcImlkXCIgKSAhPT0gXCJzYXZlLW9yZGVyXCIgJiYgd3BzZW9TbHVnQ2hhbmdlZCgpICkge1xuXHRcdFx0XHR3cHNlb1Nob3dOb3RpZmljYXRpb24oKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRpZiAoIGN1cnJlbnRTY3JlZW4gPT09IFwiZWRpdC10YWdzLnBocFwiICkge1xuXHRcdCQoIGRvY3VtZW50ICkub24oIFwiYWpheENvbXBsZXRlXCIsIGZ1bmN0aW9uKCBlLCB4aHIsIHNldHRpbmdzICkge1xuXHRcdFx0aWYgKCBzZXR0aW5ncy5kYXRhLmluZGV4T2YoIFwiYWN0aW9uPWRlbGV0ZS10YWdcIiApID4gLTEgKSB7XG5cdFx0XHRcdHdwc2VvU2hvd05vdGlmaWNhdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSggalF1ZXJ5ICkgKSAgKTtcbiJdfQ==
