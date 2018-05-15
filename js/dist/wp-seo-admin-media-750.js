(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wpseoMediaL10n */
/* global wp */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */

// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery(document).ready(function ($) {
	"use strict";

	if (typeof wp.media === "undefined") {
		return;
	}

	$(".wpseo_image_upload_button").each(function (index, element) {
		var wpseoTargetId = $(element).attr("id").replace(/_button$/, "");
		// eslint-disable-next-line
		var wpseoCustomUploader = wp.media.frames.file_frame = wp.media({
			title: wpseoMediaL10n.choose_image,
			button: { text: wpseoMediaL10n.choose_image },
			multiple: false
		});

		wpseoCustomUploader.on("select", function () {
			var attachment = wpseoCustomUploader.state().get("selection").first().toJSON();
			$("#" + wpseoTargetId).val(attachment.url);
		});

		$(element).click(function (e) {
			e.preventDefault();
			wpseoCustomUploader.open();
		});
	});
});

},{}]},{},[1]);
