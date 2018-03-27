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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUUsV0FBVSxDQUFWLEVBQWM7QUFDZjtBQUNBLEdBQUcsa0NBQUgsRUFBd0MsSUFBeEMsQ0FBOEMsWUFBVztBQUN4RCxNQUFJLGFBQWEsRUFBRyxJQUFILEVBQVUsT0FBVixDQUFtQixJQUFuQixFQUEwQixJQUExQixDQUFnQyxHQUFoQyxDQUFqQjs7QUFFQSxhQUNFLFFBREYsQ0FDWSx1REFEWixFQUVFLElBRkYsQ0FFUSxZQUZSLEVBRXNCLEVBQUcsSUFBSCxFQUFVLElBQVYsQ0FBZ0IsT0FBaEIsQ0FGdEI7QUFHQSxFQU5EOztBQVFBO0FBQ0EsR0FBRyxrREFBSCxFQUF1RCxjQUF2RCxFQUF3RSxJQUF4RSxDQUE4RSxZQUFXO0FBQ3hGLE1BQUksT0FBTyxFQUFHLElBQUgsRUFBVSxJQUFWLEVBQVg7QUFDQSxJQUFHLElBQUgsRUFBVSxXQUFWLENBQXVCLElBQXZCO0FBQ0EsRUFIRDtBQUlBLENBZkMsRUFlQyxNQWZELENBQUYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKCBmdW5jdGlvbiggJCApIHtcblx0Ly8gU2V0IHRoZSB5b2FzdC10b29sdGlwcyBvbiB0aGUgbGlzdCB0YWJsZSBsaW5rcyBjb2x1bW5zIHRoYXQgaGF2ZSBsaW5rcy5cblx0JCggXCIueW9hc3QtY29sdW1uLWhlYWRlci1oYXMtdG9vbHRpcFwiICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBhcmVudExpbmsgPSAkKCB0aGlzICkuY2xvc2VzdCggXCJ0aFwiICkuZmluZCggXCJhXCIgKTtcblxuXHRcdHBhcmVudExpbmtcblx0XHRcdC5hZGRDbGFzcyggXCJ5b2FzdC10b29sdGlwIHlvYXN0LXRvb2x0aXAtbiB5b2FzdC10b29sdGlwLW11bHRpbGluZVwiIClcblx0XHRcdC5hdHRyKCBcImFyaWEtbGFiZWxcIiwgJCggdGhpcyApLmRhdGEoIFwibGFiZWxcIiApICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhbiB1cCB0aGUgY29sdW1ucyB0aXRsZXMgSFRNTCBmb3IgdGhlIFNjcmVlbiBPcHRpb25zIGNoZWNrYm94ZXMgbGFiZWxzLlxuXHQkKCBcIi55b2FzdC1jb2x1bW4taGVhZGVyLWhhcy10b29sdGlwLCAueW9hc3QtdG9vbHRpcFwiLCBcIiNzY3JlZW4tbWV0YVwiICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpO1xuXHRcdCQoIHRoaXMgKS5yZXBsYWNlV2l0aCggdGV4dCApO1xuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIl19
