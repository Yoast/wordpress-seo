(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* jshint -W097 */

var redirectFunctions = require("./redirects/functions");

/**
 * Use notification counter so we can count how many times the function wpseoShowNotification is called.
 *
 * @type {number}
 */
var wpseoNotificationCounter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter
 * with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 *
 * @returns {void}
 */
function wpseoShowNotification() {
	jQuery.post(ajaxurl, { action: "yoast_get_notifications" }, function (response) {
		if (response !== "") {
			var insertAfterElement = jQuery(".wrap").children().eq(0);
			jQuery(response).insertAfter(insertAfterElement);
			wpseoNotificationCounter = 0;
		}

		if (wpseoNotificationCounter < 20 && response === "") {
			wpseoNotificationCounter++;
			setTimeout(wpseoShowNotification, 500);
		}
	});
}

window.wpseoShowNotification = wpseoShowNotification;

/**
 * Gets the current page based on the current URL.
 *
 * @returns {string} The current page.
 */
function wpseoGetCurrentPage() {
	return jQuery(location).attr("pathname").split("/").pop();
}

window.wpseoGetCurrentPage = wpseoGetCurrentPage;

/**
 * Gets the current slug of a post based on the current page and post or term being edited.
 *
 * @returns {string} The slug of the current post or term.
 */
function wpseoGetCurrentSlug() {
	var currentPost = wpseoGetItemId();
	var currentPage = wpseoGetCurrentPage();

	if (currentPage === "edit.php") {
		return jQuery("#inline_" + currentPost).find(".post_name").html();
	}

	if (currentPage === "edit-tags.php") {
		return jQuery("#inline_" + currentPost).find(".slug").html();
	}

	return "";
}

window.wpseoGetCurrentSlug = wpseoGetCurrentSlug;

/**
 * Checks whether or not the slug has changed.
 *
 * @returns {boolean} Whether or not the slug has changed.
 */
function wpseoSlugChanged() {
	var editor = wpseoGetActiveEditor();
	var currentSlug = wpseoGetCurrentSlug();
	var wpseo_new_slug = editor.find("input[name=post_name]").val();

	return currentSlug !== wpseo_new_slug;
}

window.wpseoSlugChanged = wpseoSlugChanged;

/**
 * Gets the currently active editor used in quick edit.
 *
 * @returns {Object} The editor that is currently active.
 */
function wpseoGetActiveEditor() {
	return jQuery("tr.inline-editor");
}

window.wpseoGetActiveEditor = wpseoGetActiveEditor;

/**
 * Gets the current post or term id.
 * Returns an empty string if no editor is currently active.
 *
 * @returns {string} The ID of the current post or term.
 */
function wpseoGetItemId() {
	var editor = wpseoGetActiveEditor();

	if (editor.length === 0 || editor === "") {
		return "";
	}

	return editor.attr("id").replace("edit-", "");
}

window.wpseoGetItemId = wpseoGetItemId;

/**
 * Handles the key-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseoHandleKeyEvents(ev) {
	// 13 refers to the enter key.
	if (ev.which === 13 && wpseoSlugChanged()) {
		wpseoShowNotification();
	}
}

window.wpseoHandleKeyEvents = wpseoHandleKeyEvents;

/**
 * Handles the button-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseoHandleButtonEvents(ev) {
	if (jQuery(ev.target).attr("id") !== "save-order" && wpseoSlugChanged()) {
		wpseoShowNotification();
	}
}

window.wpseoHandleButtonEvents = wpseoHandleButtonEvents;

window.wpseoUndoRedirect = redirectFunctions.wpseoUndoRedirect;
window.wpseoCreateRedirect = redirectFunctions.wpseoCreateRedirect;

jQuery(function () {
	var wpseoCurrentPage = wpseoGetCurrentPage();

	// If current page is edit*.php, continue execution.
	if (wpseoCurrentPage === "edit.php" || wpseoCurrentPage === "edit-tags.php") {
		jQuery("#inline-edit input").on("keydown", function (ev) {
			wpseoHandleKeyEvents(ev);
		});

		jQuery(".button-primary").click(function (ev) {
			wpseoHandleButtonEvents(ev);
		});
	}
});

},{"./redirects/functions":2}],2:[function(require,module,exports){
"use strict";

/* global wpseoPremiumStrings, ajaxurl */

/**
 * Undoes a redirect.
 *
 * @param {string} origin The redirect's origin.
 * @param {string} target The redirect's target.
 * @param {string} type The type of redirect.
 * @param {string} nonce The nonce being used to validate the current AJAX request.
 * @param {object} source The DOMElement containing the alerts.
 *
 * @returns {void}
 */
function wpseoUndoRedirect(origin, target, type, nonce, source) {
	jQuery.post(ajaxurl, {
		action: "wpseo_delete_redirect_plain",
		ajax_nonce: nonce,
		redirect: {
			origin: origin,
			target: target,
			type: type
		}
	}, function () {
		jQuery(source).closest(".yoast-alert").fadeOut("slow");
	});
}

/**
 * Creates a redirect
 *
 * @param {string} origin The origin.
 * @param {string} type   The redirect type, regex or plain.
 * @param {string} nonce  The nonce.
 * @param {object} source The source of the redirect.
 *
 * @returns {void}
 */
function wpseoCreateRedirect(origin, type, nonce, source) {
	var target = "";

	if (parseInt(type, 10) !== 410) {
		/* eslint-disable no-alert */
		target = window.prompt(wpseoPremiumStrings.enter_new_url.replace("%s", origin));
		/* eslint-enable no-alert */

		if (target === "") {
			/* eslint-disable no-alert */
			window.alert(wpseoPremiumStrings.error_new_url);
			/* eslint-enable no-alert */
			return;
		}
	}

	jQuery.post(ajaxurl, {
		action: "wpseo_add_redirect_plain",
		ajax_nonce: nonce,
		redirect: {
			origin: origin,
			target: target,
			type: type
		}
	}, function (response) {
		var notice = jQuery(source).closest(".yoast-alert");
		// Remove the classes first.
		jQuery(notice).removeClass("updated").removeClass("error");

		// Remove possibly added redirect errors.
		jQuery(notice).find(".redirect_error").remove();

		if (response.error) {
			// Add paragraph on top of the notice with actions and set class to error.
			jQuery(notice).addClass("error").prepend("<p class=\"redirect_error\">" + response.error.message + "</p>");

			return;
		}

		// Parse the success message.
		var successMessage = "";
		if (parseInt(type, 10) === 410) {
			successMessage = wpseoPremiumStrings.redirect_saved_no_target;
		} else {
			successMessage = wpseoPremiumStrings.redirect_saved.replace("%2$s", "<code>" + response.target + "</code>");
		}

		successMessage = successMessage.replace("%1$s", "<code>" + response.origin + "</code>");

		// Set class to updated and replace html with the success message.
		jQuery(notice).addClass("updated").html("<p>" + successMessage + "</p>");
	}, "json");
}

module.exports = {
	wpseoCreateRedirect: wpseoCreateRedirect,
	wpseoUndoRedirect: wpseoUndoRedirect
};

},{}]},{},[1]);
