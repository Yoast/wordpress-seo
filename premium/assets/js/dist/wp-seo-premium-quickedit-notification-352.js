(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global ajaxurl */
/* jshint -W097 */

var redirectFunctions = require("./redirects/functions");

/**
 * Use notification counter so we can count how many times the function wpseo_show_notification is called.
 *
 * @type {number}
 */
var wpseo_notification_counter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 *
 * @returns {void}
 */
function wpseo_show_notification() {
	jQuery.post(ajaxurl, { action: "yoast_get_notifications" }, function (response) {
		if (response !== "") {
			var insertAfterElement = jQuery(".wrap").children().eq(0);
			jQuery(response).insertAfter(insertAfterElement);
			wpseo_notification_counter = 0;
		}

		if (wpseo_notification_counter < 20 && response === "") {
			wpseo_notification_counter++;
			setTimeout(wpseo_show_notification, 500);
		}
	});
}

window.wpseo_show_notification = wpseo_show_notification;

/**
 * Gets the current page based on the current URL.
 *
 * @returns {string} The current page.
 */
function wpseo_get_current_page() {
	return jQuery(location).attr("pathname").split("/").pop();
}

window.wpseo_get_current_page = wpseo_get_current_page;

/**
 * Gets the current slug of a post based on the current page and post or term being edited.
 *
 * @returns {string} The slug of the current post or term.
 */
function wpseo_get_current_slug() {
	var currentPost = wpseo_get_item_id();
	var currentPage = wpseo_get_current_page();

	if (currentPage === "edit.php") {
		return jQuery("#inline_" + currentPost).find(".post_name").html();
	}

	if (currentPage === "edit-tags.php") {
		return jQuery("#inline_" + currentPost).find(".slug").html();
	}

	return "";
}

window.wpseo_get_current_slug = wpseo_get_current_slug;

/**
 * Checks whether or not the slug has changed.
 *
 * @returns {boolean} Whether or not the slug has changed.
 */
function wpseo_slug_changed() {
	var editor = wpseo_get_active_editor();
	var currentSlug = wpseo_get_current_slug();
	var wpseo_new_slug = editor.find("input[name=post_name]").val();

	return currentSlug !== wpseo_new_slug;
}

window.wpseo_slug_changed = wpseo_slug_changed;

/**
 * Gets the currently active editor used in quick edit.
 *
 * @returns {Object} The editor that is currently active.
 */
function wpseo_get_active_editor() {
	return jQuery("tr.inline-editor");
}

window.wpseo_get_active_editor = wpseo_get_active_editor;

/**
 * Gets the current post or term id.
 * Returns an empty string if no editor is currently active.
 *
 * @returns {string} The ID of the current post or term.
 */
function wpseo_get_item_id() {
	var editor = wpseo_get_active_editor();

	if (editor === "") {
		return "";
	}

	return editor.attr("id").replace("edit-", "");
}

window.wpseo_get_item_id = wpseo_get_item_id;

/**
 * Handles the key-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseo_handle_key_events(ev) {
	// 13 refers to the enter key.
	if (ev.which === 13 && wpseo_slug_changed()) {
		wpseo_show_notification();
	}
}

window.wpseo_handle_key_events = wpseo_handle_key_events;

/**
 * Handles the button-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseo_handle_button_events(ev) {
	if (jQuery(ev.target).attr("id") !== "save-order" && wpseo_slug_changed()) {
		wpseo_show_notification();
	}
}

window.wpseo_handle_button_events = wpseo_handle_button_events;

window.wpseo_undo_redirect = redirectFunctions.wpseo_undo_redirect;
window.wpseo_create_redirect = redirectFunctions.wpseo_create_redirect;

jQuery(function () {
	var wpseoCurrentPage = wpseo_get_current_page();

	// If current page is edit*.php, continue execution.
	if (wpseoCurrentPage === "edit.php" || wpseoCurrentPage === "edit-tags.php") {
		jQuery("#inline-edit input").on("keydown", function (ev) {
			wpseo_handle_key_events(ev);
		});

		jQuery(".button-primary").click(function (ev) {
			wpseo_handle_button_events(ev);
		});
	}
});

},{"./redirects/functions":2}],2:[function(require,module,exports){
"use strict";

/* global wpseo_premium_strings, ajaxurl */

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
function wpseo_undo_redirect(origin, target, type, nonce, source) {
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
function wpseo_create_redirect(origin, type, nonce, source) {
	var target = "";

	if (parseInt(type, 10) !== 410) {
		/* eslint-disable no-alert */
		target = window.prompt(wpseo_premium_strings.enter_new_url.replace("%s", origin));
		/* eslint-enable no-alert */

		if (target === '') {
			/* eslint-disable no-alert */
			window.alert(wpseo_premium_strings.error_new_url);
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
			successMessage = wpseo_premium_strings.redirect_saved_no_target;
		} else {
			successMessage = wpseo_premium_strings.redirect_saved.replace("%2$s", "<code>" + response.target + "</code>");
		}

		successMessage = successMessage.replace("%1$s", "<code>" + response.origin + "</code>");

		// Set class to updated and replace html with the success message.
		jQuery(notice).addClass("updated").html("<p>" + successMessage + "</p>");
	}, "json");
}

module.exports = {
	wpseo_create_redirect: wpseo_create_redirect,
	wpseo_undo_redirect: wpseo_undo_redirect
};

},{}]},{},[1]);
