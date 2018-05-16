(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function ($) {
	// Set the yoast-tooltips on the list table links columns that have links.
	$(".yoast-column-header-has-tooltip").each(function () {
		var parentLink = $(this).closest("th").find("a");

		parentLink.addClass("yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline").attr("aria-label", $(this).data("label"));
	});

	// Clean up the columns titles HTML for the Screen Options checkboxes labels.
	$(".yoast-column-header-has-tooltip, .yoast-tooltip", "#screen-meta").each(function () {
		var text = $(this).text();
		$(this).replaceWith(text);
	});
})(jQuery);

},{}]},{},[1]);
