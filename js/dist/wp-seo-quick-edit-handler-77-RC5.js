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

	// Listen to events based on the current screen.
	switch (currentScreen) {

		// Terms list screen.
		case "edit-tags.php":
			$(document).on("ajaxComplete", function (e, xhr, settings) {
				if (settings.data.indexOf("action=delete-tag") > -1) {
					wpseoShowNotification();
				}
			});

		// Posts list screen.
		case "edit.php":
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

			break;
	}
}(jQuery));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXF1aWNrLWVkaXQtaGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUUsT0FBUSxVQUFVLENBQVYsRUFBYztBQUN2QixLQUFNLGdCQUFxQixFQUFHLFFBQUgsRUFBYyxJQUFkLENBQW9CLFVBQXBCLEVBQWlDLEtBQWpDLENBQXdDLEdBQXhDLEVBQThDLEdBQTlDLEVBQTNCO0FBQ0EsS0FBTSxZQUFxQixrQkFBa0IsZUFBbEIsR0FBb0MsTUFBcEMsR0FBNkMsV0FBeEU7QUFDQSxLQUFNLHFCQUFxQixFQUFHLE9BQUgsRUFBYSxRQUFiLEdBQXdCLEVBQXhCLENBQTRCLENBQTVCLENBQTNCOztBQUVBOzs7OztBQUtBLEtBQUksMkJBQTJCLENBQS9COztBQUVBLEtBQUkscUJBQXFCLEVBQXpCOztBQUVBOzs7Ozs7O0FBT0EsVUFBUyxvQkFBVCxDQUErQixZQUEvQixFQUE4QztBQUM3QyxNQUFLLENBQUUsbUJBQW1CLFFBQW5CLENBQTZCLFlBQTdCLENBQVAsRUFBcUQ7QUFDcEQsc0JBQW1CLElBQW5CLENBQXlCLFlBQXpCOztBQUVBLEtBQUcsWUFBSCxFQUFrQixXQUFsQixDQUErQixrQkFBL0I7QUFDQTtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFVBQVMscUJBQVQsR0FBaUM7QUFDaEMsSUFBRSxJQUFGLENBQ0MsT0FERCxFQUVDO0FBQ0MsV0FBUSx5QkFEVDtBQUVDLFlBQVM7QUFGVixHQUZELEVBTUMsVUFBVSxRQUFWLEVBQXFCO0FBQ3BCLE9BQUssYUFBYSxFQUFsQixFQUF1QjtBQUN0QiwrQkFBMkIsQ0FBM0I7O0FBRUEsUUFBSSxnQkFBZ0IsS0FBSyxLQUFMLENBQVksUUFBWixDQUFwQjtBQUNBLGtCQUFjLEdBQWQsQ0FBbUIsb0JBQW5CO0FBQ0E7O0FBRUQsT0FBSywyQkFBMkIsRUFBM0IsSUFBaUMsYUFBYSxFQUFuRCxFQUF3RDtBQUN2RDtBQUNBLGVBQVkscUJBQVosRUFBbUMsR0FBbkM7QUFDQTtBQUNELEdBbEJGO0FBb0JBOztBQUVEOzs7Ozs7Ozs7QUFTQSxVQUFTLGNBQVQsQ0FBeUIsTUFBekIsRUFBa0M7QUFDakMsTUFBSyxPQUFPLE1BQVAsS0FBa0IsQ0FBbEIsSUFBdUIsV0FBVyxFQUF2QyxFQUE0QztBQUMzQyxVQUFPLEVBQVA7QUFDQTs7QUFFRCxTQUFPLE9BQU8sSUFBUCxDQUFhLElBQWIsRUFBb0IsT0FBcEIsQ0FBNkIsT0FBN0IsRUFBc0MsRUFBdEMsQ0FBUDtBQUNBOztBQUVEOzs7Ozs7O0FBT0EsVUFBUyxtQkFBVCxDQUE4QixXQUE5QixFQUE0QztBQUMzQyxTQUFPLEVBQUcsYUFBYSxXQUFoQixFQUE4QixJQUE5QixDQUFvQyxNQUFNLFNBQTFDLEVBQXNELElBQXRELEVBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxVQUFTLGdCQUFULEdBQTRCO0FBQzNCLE1BQU0sU0FBYyxFQUFHLGtCQUFILENBQXBCO0FBQ0EsTUFBTSxjQUFjLGVBQWdCLE1BQWhCLENBQXBCO0FBQ0EsTUFBTSxjQUFjLG9CQUFxQixXQUFyQixDQUFwQjtBQUNBLE1BQU0sVUFBYyxPQUFPLElBQVAsQ0FBYSxnQkFBZ0IsU0FBaEIsR0FBNEIsR0FBekMsRUFBK0MsR0FBL0MsRUFBcEI7O0FBRUEsU0FBTyxnQkFBZ0IsT0FBdkI7QUFDQTs7QUFFRDtBQUNBLFNBQVMsYUFBVDs7QUFFQztBQUNBLE9BQUssZUFBTDtBQUNDLEtBQUcsUUFBSCxFQUFjLEVBQWQsQ0FBa0IsY0FBbEIsRUFBa0MsVUFBVSxDQUFWLEVBQWEsR0FBYixFQUFrQixRQUFsQixFQUE2QjtBQUM5RCxRQUFLLFNBQVMsSUFBVCxDQUFjLE9BQWQsQ0FBdUIsbUJBQXZCLElBQStDLENBQUMsQ0FBckQsRUFBeUQ7QUFDeEQ7QUFDQTtBQUNELElBSkQ7O0FBTUQ7QUFDQSxPQUFLLFVBQUw7QUFDQyxLQUFHLG9CQUFILEVBQTBCLEVBQTFCLENBQThCLFNBQTlCLEVBQXlDLFVBQVUsRUFBVixFQUFlO0FBQ3ZEO0FBQ0EsUUFBSyxHQUFHLEtBQUgsS0FBYSxFQUFiLElBQW1CLGtCQUF4QixFQUE2QztBQUM1QztBQUNBO0FBQ0QsSUFMRDs7QUFPQSxLQUFHLGlCQUFILEVBQXVCLEtBQXZCLENBQThCLFVBQVUsRUFBVixFQUFlO0FBQzVDLFFBQUssRUFBRyxHQUFHLE1BQU4sRUFBZSxJQUFmLENBQXFCLElBQXJCLE1BQWdDLFlBQWhDLElBQWdELGtCQUFyRCxFQUEwRTtBQUN6RTtBQUNBO0FBQ0QsSUFKRDs7QUFNQTtBQXpCRjtBQTJCQSxDQWxJUyxDQWtJUCxNQWxJTyxDQUFSLENBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGFqYXh1cmwgKi9cblxuKCBqUXVlcnkoIGZ1bmN0aW9uKCAkICkge1xuXHRjb25zdCBjdXJyZW50U2NyZWVuICAgICAgPSAkKCBsb2NhdGlvbiApLmF0dHIoIFwicGF0aG5hbWVcIiApLnNwbGl0KCBcIi9cIiApLnBvcCgpO1xuXHRjb25zdCBzbHVnRmllbGQgICAgICAgICAgPSBjdXJyZW50U2NyZWVuID09PSBcImVkaXQtdGFncy5waHBcIiA/IFwic2x1Z1wiIDogXCJwb3N0X25hbWVcIjtcblx0Y29uc3Qgbm90aWZpY2F0aW9uVGFyZ2V0ID0gJCggXCIud3JhcFwiICkuY2hpbGRyZW4oKS5lcSggMCApO1xuXG5cdC8qKlxuXHQgKiBVc2Ugbm90aWZpY2F0aW9uIGNvdW50ZXIgc28gd2UgY2FuIGNvdW50IGhvdyBtYW55IHRpbWVzIHRoZSBmdW5jdGlvbiB3cHNlb1Nob3dOb3RpZmljYXRpb24gaXMgY2FsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0bGV0IHdwc2VvTm90aWZpY2F0aW9uQ291bnRlciA9IDA7XG5cblx0bGV0IGFkZGVkTm90aWZpY2F0aW9ucyA9IFtdO1xuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSBnaXZlbiBub3RpZmljYXRpb24gdG8gdGhlIERPTSBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb24gVGhlIG5vdGlmaWNhdGlvbiB0byBhZGQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkTm90aWZpY2F0aW9uVG9Eb20oIG5vdGlmaWNhdGlvbiApIHtcblx0XHRpZiAoICEgYWRkZWROb3RpZmljYXRpb25zLmluY2x1ZGVzKCBub3RpZmljYXRpb24gKSApIHtcblx0XHRcdGFkZGVkTm90aWZpY2F0aW9ucy5wdXNoKCBub3RpZmljYXRpb24gKTtcblxuXHRcdFx0JCggbm90aWZpY2F0aW9uICkuaW5zZXJ0QWZ0ZXIoIG5vdGlmaWNhdGlvblRhcmdldCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93cyBub3RpZmljYXRpb24gdG8gdXNlciB3aGVuIGEgcmVkaXJlY3QgaXMgY3JlYXRlZC5cblx0ICpcblx0ICogV2hlbiB0aGUgcmVzcG9uc2UgaXMgZW1wdHksIHVwIHRoZSBub3RpZmljYXRpb24gY291bnRlciB3aXRoIDEsIHdhaXQgNTAwIG1zIGFuZCBjYWxsIHRoZSBmdW5jdGlvbiBhZ2Fpbi5cblx0ICogU3RvcHMgd2hlbiB0aGUgbm90aWZpY2F0aW9uIGNvdW50ZXIgaXMgbW9yZSB0aGFuIDIwLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2hvd05vdGlmaWNhdGlvbigpIHtcblx0XHQkLnBvc3QoXG5cdFx0XHRhamF4dXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRhY3Rpb246IFwieW9hc3RfZ2V0X25vdGlmaWNhdGlvbnNcIixcblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdGlmICggcmVzcG9uc2UgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0d3BzZW9Ob3RpZmljYXRpb25Db3VudGVyID0gMDtcblxuXHRcdFx0XHRcdGxldCBub3RpZmljYXRpb25zID0gSlNPTi5wYXJzZSggcmVzcG9uc2UgKTtcblx0XHRcdFx0XHRub3RpZmljYXRpb25zLm1hcCggYWRkTm90aWZpY2F0aW9uVG9Eb20gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd3BzZW9Ob3RpZmljYXRpb25Db3VudGVyIDwgMjAgJiYgcmVzcG9uc2UgPT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0d3BzZW9Ob3RpZmljYXRpb25Db3VudGVyKys7XG5cdFx0XHRcdFx0c2V0VGltZW91dCggd3BzZW9TaG93Tm90aWZpY2F0aW9uLCA1MDAgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgY3VycmVudCBwb3N0IG9yIHRlcm0gSUQuXG5cdCAqXG5cdCAqIFJldHVybnMgYW4gZW1wdHkgc3RyaW5nIGlmIG5vIGVkaXRvciBpcyBjdXJyZW50bHkgYWN0aXZlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gZWRpdG9yIFRoZSBlZGl0b3IgdG8gZ2V0IHRoZSBJRCBmcm9tLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgSUQgb2YgdGhlIGN1cnJlbnQgcG9zdCBvciB0ZXJtLlxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9HZXRJdGVtSWQoIGVkaXRvciApIHtcblx0XHRpZiAoIGVkaXRvci5sZW5ndGggPT09IDAgfHwgZWRpdG9yID09PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVkaXRvci5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCBcImVkaXQtXCIsIFwiXCIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjdXJyZW50IHNsdWcgb2YgYSBwb3N0IGJhc2VkIG9uIHRoZSBjdXJyZW50IHBhZ2UgYW5kIHBvc3Qgb3IgdGVybSBiZWluZyBlZGl0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjdXJyZW50UG9zdCBUaGUgY3VycmVudCBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc2x1ZyBvZiB0aGUgY3VycmVudCBwb3N0IG9yIHRlcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0dldEN1cnJlbnRTbHVnKCBjdXJyZW50UG9zdCApIHtcblx0XHRyZXR1cm4gJCggXCIjaW5saW5lX1wiICsgY3VycmVudFBvc3QgKS5maW5kKCBcIi5cIiArIHNsdWdGaWVsZCApLmh0bWwoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhlIHNsdWcgaGFzIGNoYW5nZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgc2x1ZyBoYXMgY2hhbmdlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2x1Z0NoYW5nZWQoKSB7XG5cdFx0Y29uc3QgZWRpdG9yICAgICAgPSAkKCBcInRyLmlubGluZS1lZGl0b3JcIiApO1xuXHRcdGNvbnN0IGN1cnJlbnRQb3N0ID0gd3BzZW9HZXRJdGVtSWQoIGVkaXRvciApO1xuXHRcdGNvbnN0IGN1cnJlbnRTbHVnID0gd3BzZW9HZXRDdXJyZW50U2x1ZyggY3VycmVudFBvc3QgKTtcblx0XHRjb25zdCBuZXdTbHVnICAgICA9IGVkaXRvci5maW5kKCBcImlucHV0W25hbWU9XCIgKyBzbHVnRmllbGQgKyBcIl1cIiApLnZhbCgpO1xuXG5cdFx0cmV0dXJuIGN1cnJlbnRTbHVnICE9PSBuZXdTbHVnO1xuXHR9XG5cblx0Ly8gTGlzdGVuIHRvIGV2ZW50cyBiYXNlZCBvbiB0aGUgY3VycmVudCBzY3JlZW4uXG5cdHN3aXRjaCAoIGN1cnJlbnRTY3JlZW4gKSB7XG5cblx0XHQvLyBUZXJtcyBsaXN0IHNjcmVlbi5cblx0XHRjYXNlIFwiZWRpdC10YWdzLnBocFwiOlxuXHRcdFx0JCggZG9jdW1lbnQgKS5vbiggXCJhamF4Q29tcGxldGVcIiwgZnVuY3Rpb24oIGUsIHhociwgc2V0dGluZ3MgKSB7XG5cdFx0XHRcdGlmICggc2V0dGluZ3MuZGF0YS5pbmRleE9mKCBcImFjdGlvbj1kZWxldGUtdGFnXCIgKSA+IC0xICkge1xuXHRcdFx0XHRcdHdwc2VvU2hvd05vdGlmaWNhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHQvLyBQb3N0cyBsaXN0IHNjcmVlbi5cblx0XHRjYXNlIFwiZWRpdC5waHBcIjpcblx0XHRcdCQoIFwiI2lubGluZS1lZGl0IGlucHV0XCIgKS5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0Ly8gMTMgcmVmZXJzIHRvIHRoZSBlbnRlciBrZXkuXG5cdFx0XHRcdGlmICggZXYud2hpY2ggPT09IDEzICYmIHdwc2VvU2x1Z0NoYW5nZWQoKSApIHtcblx0XHRcdFx0XHR3cHNlb1Nob3dOb3RpZmljYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQkKCBcIi5idXR0b24tcHJpbWFyeVwiICkuY2xpY2soIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0aWYgKCAkKCBldi50YXJnZXQgKS5hdHRyKCBcImlkXCIgKSAhPT0gXCJzYXZlLW9yZGVyXCIgJiYgd3BzZW9TbHVnQ2hhbmdlZCgpICkge1xuXHRcdFx0XHRcdHdwc2VvU2hvd05vdGlmaWNhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdGJyZWFrO1xuXHR9XG59KCBqUXVlcnkgKSApICApO1xuIl19
