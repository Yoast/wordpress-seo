(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function ($) {
	// Set the yoast-tooltips on the list table links columns.
	$(".yoast-column-header-has-tooltip").each(function () {
		var parentLink = $(this).closest("a");

		parentLink.addClass("yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline").attr("aria-label", $(this).data("label"));
	});
	// Clean up the HTML for the links columns title in the Screen Options.
	$("#screen-meta .yoast-column-header-has-tooltip").each(function () {
		var text = $(this).text();
		$(this).replaceWith(text);
	});
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUUsV0FBVSxDQUFWLEVBQWM7QUFDZjtBQUNBLEdBQUcsa0NBQUgsRUFBd0MsSUFBeEMsQ0FBOEMsWUFBVztBQUN4RCxNQUFJLGFBQWEsRUFBRyxJQUFILEVBQVUsT0FBVixDQUFtQixHQUFuQixDQUFqQjs7QUFFQSxhQUNFLFFBREYsQ0FDWSx1REFEWixFQUVFLElBRkYsQ0FFUSxZQUZSLEVBRXNCLEVBQUcsSUFBSCxFQUFVLElBQVYsQ0FBZ0IsT0FBaEIsQ0FGdEI7QUFHQSxFQU5EO0FBT0E7QUFDQSxHQUFHLCtDQUFILEVBQXFELElBQXJELENBQTJELFlBQVc7QUFDckUsTUFBSSxPQUFPLEVBQUcsSUFBSCxFQUFVLElBQVYsRUFBWDtBQUNBLElBQUcsSUFBSCxFQUFVLFdBQVYsQ0FBdUIsSUFBdkI7QUFDQSxFQUhEO0FBSUEsQ0FkQyxFQWNDLE1BZEQsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBTZXQgdGhlIHlvYXN0LXRvb2x0aXBzIG9uIHRoZSBsaXN0IHRhYmxlIGxpbmtzIGNvbHVtbnMuXG5cdCQoIFwiLnlvYXN0LWNvbHVtbi1oZWFkZXItaGFzLXRvb2x0aXBcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYXJlbnRMaW5rID0gJCggdGhpcyApLmNsb3Nlc3QoIFwiYVwiICk7XG5cblx0XHRwYXJlbnRMaW5rXG5cdFx0XHQuYWRkQ2xhc3MoIFwieW9hc3QtdG9vbHRpcCB5b2FzdC10b29sdGlwLW4geW9hc3QtdG9vbHRpcC1tdWx0aWxpbmVcIiApXG5cdFx0XHQuYXR0ciggXCJhcmlhLWxhYmVsXCIsICQoIHRoaXMgKS5kYXRhKCBcImxhYmVsXCIgKSApO1xuXHR9KVxuXHQvLyBDbGVhbiB1cCB0aGUgSFRNTCBmb3IgdGhlIGxpbmtzIGNvbHVtbnMgdGl0bGUgaW4gdGhlIFNjcmVlbiBPcHRpb25zLlxuXHQkKCBcIiNzY3JlZW4tbWV0YSAueW9hc3QtY29sdW1uLWhlYWRlci1oYXMtdG9vbHRpcFwiICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpO1xuXHRcdCQoIHRoaXMgKS5yZXBsYWNlV2l0aCggdGV4dCApO1xuXHR9KTtcbn0oIGpRdWVyeSApICk7XG4iXX0=
