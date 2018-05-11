(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global tb_remove, wpseo_send_mark_as_fixed, yoastPremiumGSC */

/**
 * Adds a redirect from the Google Search Console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseoPostRedirectToGSC() {
	var targetForm = jQuery("#TB_ajaxContent");
	var oldURL = jQuery(targetForm).find("input[name=current_url]").val();
	var newURL = jQuery(targetForm).find("input[name=new_url]").val();
	var isChecked = jQuery(targetForm).find("input[name=mark_as_fixed]").prop("checked");
	var type = parseInt(jQuery(targetForm).find("select[name=redirect-type]").val(), 10);

	jQuery.ajax({
		type: "POST",
		url: yoastPremiumGSC.data.restAPI.root + "yoast/v1/redirects",
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", yoastPremiumGSC.data.restAPI.nonce);
		},
		dataType: "json",
		data: {
			origin: oldURL,
			target: newURL,
			type: type
		},
		success: function success(response) {
			if (response === "true" && isChecked === true) {
				wpseo_send_mark_as_fixed(jQuery(".wpseo-gsc-ajax-security").val(), jQuery("#field_platform").val(), jQuery("#field_category").val(), oldURL);
			}

			// Remove the thickbox.
			tb_remove();
		}
	});

	return false;
}

/**
 * Adds onchange event to the dropdowns.
 *
 * @returns {void}
 */
jQuery(function () {
	var redirectTypes = jQuery("select[name=redirect-type]");

	var ALLOW_EMPTY_TARGET = [410, 451];

	redirectTypes.on("change", function (evt) {
		var type = parseInt(this.value, 10);
		var fieldToToggle = jQuery(evt.target).closest(".wpseo_content_wrapper").find(".form-field-target")[0];

		// Hide the target field in case of a 410 redirect.
		if (jQuery.inArray(type, ALLOW_EMPTY_TARGET) > -1) {
			jQuery(fieldToToggle).hide();
		} else {
			jQuery(fieldToToggle).show();
		}
	});
});

window.wpseoPostRedirectToGSC = wpseoPostRedirectToGSC;

},{}]},{},[1]);
