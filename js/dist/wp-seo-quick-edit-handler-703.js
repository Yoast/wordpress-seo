(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */

jQuery(function ($) {
	var currentPage = $(location).attr("pathname").split("/").pop();

	// If current page is edit*.php, continue execution.
	var isEditPage = currentPage === "edit.php" || currentPage !== "edit-tags.php";
	if (!isEditPage) {
		return;
	}

	var notificationTarget = jQuery(".wrap").children().eq(0);

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
		jQuery.post(ajaxurl, {
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
		if (currentPage === "edit.php") {
			return jQuery("#inline_" + currentPost).find(".post_name").html();
		}

		if (currentPage === "edit-tags.php") {
			return jQuery("#inline_" + currentPost).find(".slug").html();
		}

		return "";
	}

	/**
  * Checks whether or not the slug has changed.
  *
  * @returns {boolean} Whether or not the slug has changed.
  */
	function wpseoSlugChanged() {
		var editor = jQuery("tr.inline-editor");
		var currentPost = wpseoGetItemId(editor);
		var currentSlug = wpseoGetCurrentSlug(currentPost);
		var newSlug = editor.find("input[name=post_name]").val();

		return currentSlug !== newSlug;
	}

	jQuery("#inline-edit input").on("keydown", function (ev) {
		// 13 refers to the enter key.
		if (ev.which === 13 && wpseoSlugChanged()) {
			wpseoShowNotification();
		}
	});

	jQuery(".button-primary").click(function (ev) {
		if (jQuery(ev.target).attr("id") !== "save-order" && wpseoSlugChanged()) {
			wpseoShowNotification();
		}
	});
}(jQuery));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXF1aWNrLWVkaXQtaGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUUsT0FBUSxVQUFVLENBQVYsRUFBYztBQUN2QixLQUFJLGNBQWMsRUFBRyxRQUFILEVBQWMsSUFBZCxDQUFvQixVQUFwQixFQUFpQyxLQUFqQyxDQUF3QyxHQUF4QyxFQUE4QyxHQUE5QyxFQUFsQjs7QUFFQTtBQUNBLEtBQUksYUFBZSxnQkFBZ0IsVUFBaEIsSUFBOEIsZ0JBQWdCLGVBQWpFO0FBQ0EsS0FBSyxDQUFFLFVBQVAsRUFBb0I7QUFDbkI7QUFDQTs7QUFFRCxLQUFJLHFCQUFxQixPQUFRLE9BQVIsRUFBa0IsUUFBbEIsR0FBNkIsRUFBN0IsQ0FBaUMsQ0FBakMsQ0FBekI7O0FBRUE7Ozs7O0FBS0EsS0FBSSwyQkFBMkIsQ0FBL0I7O0FBRUEsS0FBSSxxQkFBcUIsRUFBekI7O0FBRUE7Ozs7Ozs7QUFPQSxVQUFTLG9CQUFULENBQStCLFlBQS9CLEVBQThDO0FBQzdDLE1BQUssQ0FBRSxtQkFBbUIsUUFBbkIsQ0FBNkIsWUFBN0IsQ0FBUCxFQUFxRDtBQUNwRCxzQkFBbUIsSUFBbkIsQ0FBeUIsWUFBekI7O0FBRUEsS0FBRyxZQUFILEVBQWtCLFdBQWxCLENBQStCLGtCQUEvQjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsVUFBUyxxQkFBVCxHQUFpQztBQUNoQyxTQUFPLElBQVAsQ0FDQyxPQURELEVBRUM7QUFDQyxXQUFRLHlCQURUO0FBRUMsWUFBUztBQUZWLEdBRkQsRUFNQyxVQUFVLFFBQVYsRUFBcUI7QUFDcEIsT0FBSyxhQUFhLEVBQWxCLEVBQXVCO0FBQ3RCLCtCQUEyQixDQUEzQjs7QUFFQSxRQUFJLGdCQUFnQixLQUFLLEtBQUwsQ0FBWSxRQUFaLENBQXBCO0FBQ0Esa0JBQWMsR0FBZCxDQUFtQixvQkFBbkI7QUFDQTs7QUFFRCxPQUFLLDJCQUEyQixFQUEzQixJQUFpQyxhQUFhLEVBQW5ELEVBQXdEO0FBQ3ZEO0FBQ0EsZUFBWSxxQkFBWixFQUFtQyxHQUFuQztBQUNBO0FBQ0QsR0FsQkY7QUFvQkE7O0FBRUQ7Ozs7Ozs7OztBQVNBLFVBQVMsY0FBVCxDQUF5QixNQUF6QixFQUFrQztBQUNqQyxNQUFLLE9BQU8sTUFBUCxLQUFrQixDQUFsQixJQUF1QixXQUFXLEVBQXZDLEVBQTRDO0FBQzNDLFVBQU8sRUFBUDtBQUNBOztBQUVELFNBQU8sT0FBTyxJQUFQLENBQWEsSUFBYixFQUFvQixPQUFwQixDQUE2QixPQUE3QixFQUFzQyxFQUF0QyxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxVQUFTLG1CQUFULENBQThCLFdBQTlCLEVBQTRDO0FBQzNDLE1BQUssZ0JBQWdCLFVBQXJCLEVBQWtDO0FBQ2pDLFVBQU8sT0FBUSxhQUFhLFdBQXJCLEVBQW1DLElBQW5DLENBQXlDLFlBQXpDLEVBQXdELElBQXhELEVBQVA7QUFDQTs7QUFFRCxNQUFLLGdCQUFnQixlQUFyQixFQUF1QztBQUN0QyxVQUFPLE9BQVEsYUFBYSxXQUFyQixFQUFtQyxJQUFuQyxDQUF5QyxPQUF6QyxFQUFtRCxJQUFuRCxFQUFQO0FBQ0E7O0FBRUQsU0FBTyxFQUFQO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsVUFBUyxnQkFBVCxHQUE0QjtBQUMzQixNQUFJLFNBQVMsT0FBUSxrQkFBUixDQUFiO0FBQ0EsTUFBSSxjQUFjLGVBQWdCLE1BQWhCLENBQWxCO0FBQ0EsTUFBSSxjQUFjLG9CQUFxQixXQUFyQixDQUFsQjtBQUNBLE1BQUksVUFBVSxPQUFPLElBQVAsQ0FBYSx1QkFBYixFQUF1QyxHQUF2QyxFQUFkOztBQUVBLFNBQU8sZ0JBQWdCLE9BQXZCO0FBQ0E7O0FBRUQsUUFBUSxvQkFBUixFQUErQixFQUEvQixDQUFtQyxTQUFuQyxFQUE4QyxVQUFVLEVBQVYsRUFBZTtBQUM1RDtBQUNBLE1BQUssR0FBRyxLQUFILEtBQWEsRUFBYixJQUFtQixrQkFBeEIsRUFBNkM7QUFDNUM7QUFDQTtBQUNELEVBTEQ7O0FBT0EsUUFBUSxpQkFBUixFQUE0QixLQUE1QixDQUFtQyxVQUFVLEVBQVYsRUFBZTtBQUNqRCxNQUFLLE9BQVEsR0FBRyxNQUFYLEVBQW9CLElBQXBCLENBQTBCLElBQTFCLE1BQXFDLFlBQXJDLElBQXFELGtCQUExRCxFQUErRTtBQUM5RTtBQUNBO0FBQ0QsRUFKRDtBQUtBLENBaElTLENBZ0lQLE1BaElPLENBQVIsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgYWpheHVybCAqL1xuXG4oIGpRdWVyeSggZnVuY3Rpb24oICQgKSB7XG5cdGxldCBjdXJyZW50UGFnZSA9ICQoIGxvY2F0aW9uICkuYXR0ciggXCJwYXRobmFtZVwiICkuc3BsaXQoIFwiL1wiICkucG9wKCk7XG5cblx0Ly8gSWYgY3VycmVudCBwYWdlIGlzIGVkaXQqLnBocCwgY29udGludWUgZXhlY3V0aW9uLlxuXHRsZXQgaXNFZGl0UGFnZSA9ICggY3VycmVudFBhZ2UgPT09IFwiZWRpdC5waHBcIiB8fCBjdXJyZW50UGFnZSAhPT0gXCJlZGl0LXRhZ3MucGhwXCIgKTtcblx0aWYgKCAhIGlzRWRpdFBhZ2UgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0IG5vdGlmaWNhdGlvblRhcmdldCA9IGpRdWVyeSggXCIud3JhcFwiICkuY2hpbGRyZW4oKS5lcSggMCApO1xuXG5cdC8qKlxuXHQgKiBVc2Ugbm90aWZpY2F0aW9uIGNvdW50ZXIgc28gd2UgY2FuIGNvdW50IGhvdyBtYW55IHRpbWVzIHRoZSBmdW5jdGlvbiB3cHNlb1Nob3dOb3RpZmljYXRpb24gaXMgY2FsbGVkLlxuXHQgKlxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0bGV0IHdwc2VvTm90aWZpY2F0aW9uQ291bnRlciA9IDA7XG5cblx0bGV0IGFkZGVkTm90aWZpY2F0aW9ucyA9IFtdO1xuXG5cdC8qKlxuXHQgKiBBZGRzIHRoZSBnaXZlbiBub3RpZmljYXRpb24gdG8gdGhlIERPTSBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub3RpZmljYXRpb24gVGhlIG5vdGlmaWNhdGlvbiB0byBhZGQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkTm90aWZpY2F0aW9uVG9Eb20oIG5vdGlmaWNhdGlvbiApIHtcblx0XHRpZiAoICEgYWRkZWROb3RpZmljYXRpb25zLmluY2x1ZGVzKCBub3RpZmljYXRpb24gKSApIHtcblx0XHRcdGFkZGVkTm90aWZpY2F0aW9ucy5wdXNoKCBub3RpZmljYXRpb24gKTtcblxuXHRcdFx0JCggbm90aWZpY2F0aW9uICkuaW5zZXJ0QWZ0ZXIoIG5vdGlmaWNhdGlvblRhcmdldCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBTaG93cyBub3RpZmljYXRpb24gdG8gdXNlciB3aGVuIGEgcmVkaXJlY3QgaXMgY3JlYXRlZC5cblx0ICpcblx0ICogV2hlbiB0aGUgcmVzcG9uc2UgaXMgZW1wdHksIHVwIHRoZSBub3RpZmljYXRpb24gY291bnRlciB3aXRoIDEsIHdhaXQgNTAwIG1zIGFuZCBjYWxsIHRoZSBmdW5jdGlvbiBhZ2Fpbi5cblx0ICogU3RvcHMgd2hlbiB0aGUgbm90aWZpY2F0aW9uIGNvdW50ZXIgaXMgbW9yZSB0aGFuIDIwLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2hvd05vdGlmaWNhdGlvbigpIHtcblx0XHRqUXVlcnkucG9zdChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdGFjdGlvbjogXCJ5b2FzdF9nZXRfbm90aWZpY2F0aW9uc1wiLFxuXHRcdFx0XHR2ZXJzaW9uOiAyLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0aWYgKCByZXNwb25zZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHR3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIgPSAwO1xuXG5cdFx0XHRcdFx0bGV0IG5vdGlmaWNhdGlvbnMgPSBKU09OLnBhcnNlKCByZXNwb25zZSApO1xuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbnMubWFwKCBhZGROb3RpZmljYXRpb25Ub0RvbSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIgPCAyMCAmJiByZXNwb25zZSA9PT0gXCJcIiApIHtcblx0XHRcdFx0XHR3cHNlb05vdGlmaWNhdGlvbkNvdW50ZXIrKztcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCB3cHNlb1Nob3dOb3RpZmljYXRpb24sIDUwMCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBjdXJyZW50IHBvc3Qgb3IgdGVybSBJRC5cblx0ICpcblx0ICogUmV0dXJucyBhbiBlbXB0eSBzdHJpbmcgaWYgbm8gZWRpdG9yIGlzIGN1cnJlbnRseSBhY3RpdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBlZGl0b3IgVGhlIGVkaXRvciB0byBnZXQgdGhlIElEIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBJRCBvZiB0aGUgY3VycmVudCBwb3N0IG9yIHRlcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0dldEl0ZW1JZCggZWRpdG9yICkge1xuXHRcdGlmICggZWRpdG9yLmxlbmd0aCA9PT0gMCB8fCBlZGl0b3IgPT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gZWRpdG9yLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiZWRpdC1cIiwgXCJcIiApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGN1cnJlbnQgc2x1ZyBvZiBhIHBvc3QgYmFzZWQgb24gdGhlIGN1cnJlbnQgcGFnZSBhbmQgcG9zdCBvciB0ZXJtIGJlaW5nIGVkaXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGN1cnJlbnRQb3N0IFRoZSBjdXJyZW50IGVsZW1lbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzbHVnIG9mIHRoZSBjdXJyZW50IHBvc3Qgb3IgdGVybS5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvR2V0Q3VycmVudFNsdWcoIGN1cnJlbnRQb3N0ICkge1xuXHRcdGlmICggY3VycmVudFBhZ2UgPT09IFwiZWRpdC5waHBcIiApIHtcblx0XHRcdHJldHVybiBqUXVlcnkoIFwiI2lubGluZV9cIiArIGN1cnJlbnRQb3N0ICkuZmluZCggXCIucG9zdF9uYW1lXCIgKS5odG1sKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCBjdXJyZW50UGFnZSA9PT0gXCJlZGl0LXRhZ3MucGhwXCIgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5KCBcIiNpbmxpbmVfXCIgKyBjdXJyZW50UG9zdCApLmZpbmQoIFwiLnNsdWdcIiApLmh0bWwoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhlIHNsdWcgaGFzIGNoYW5nZWQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgc2x1ZyBoYXMgY2hhbmdlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHdwc2VvU2x1Z0NoYW5nZWQoKSB7XG5cdFx0bGV0IGVkaXRvciA9IGpRdWVyeSggXCJ0ci5pbmxpbmUtZWRpdG9yXCIgKTtcblx0XHRsZXQgY3VycmVudFBvc3QgPSB3cHNlb0dldEl0ZW1JZCggZWRpdG9yICk7XG5cdFx0bGV0IGN1cnJlbnRTbHVnID0gd3BzZW9HZXRDdXJyZW50U2x1ZyggY3VycmVudFBvc3QgKTtcblx0XHRsZXQgbmV3U2x1ZyA9IGVkaXRvci5maW5kKCBcImlucHV0W25hbWU9cG9zdF9uYW1lXVwiICkudmFsKCk7XG5cblx0XHRyZXR1cm4gY3VycmVudFNsdWcgIT09IG5ld1NsdWc7XG5cdH1cblxuXHRqUXVlcnkoIFwiI2lubGluZS1lZGl0IGlucHV0XCIgKS5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldiApIHtcblx0XHQvLyAxMyByZWZlcnMgdG8gdGhlIGVudGVyIGtleS5cblx0XHRpZiAoIGV2LndoaWNoID09PSAxMyAmJiB3cHNlb1NsdWdDaGFuZ2VkKCkgKSB7XG5cdFx0XHR3cHNlb1Nob3dOb3RpZmljYXRpb24oKTtcblx0XHR9XG5cdH0gKTtcblxuXHRqUXVlcnkoIFwiLmJ1dHRvbi1wcmltYXJ5XCIgKS5jbGljayggZnVuY3Rpb24oIGV2ICkge1xuXHRcdGlmICggalF1ZXJ5KCBldi50YXJnZXQgKS5hdHRyKCBcImlkXCIgKSAhPT0gXCJzYXZlLW9yZGVyXCIgJiYgd3BzZW9TbHVnQ2hhbmdlZCgpICkge1xuXHRcdFx0d3BzZW9TaG93Tm90aWZpY2F0aW9uKCk7XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApICApO1xuIl19
