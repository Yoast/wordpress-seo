(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var redirectFunctions = require("./redirects/functions");

window.wpseo_undo_redirect = redirectFunctions.wpseo_undo_redirect;
window.wpseo_create_redirect = redirectFunctions.wpseo_create_redirect;

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
