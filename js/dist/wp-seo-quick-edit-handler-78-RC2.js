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

},{}]},{},[1]);
