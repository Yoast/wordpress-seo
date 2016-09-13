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
		var wpseo_target_id = $(element).attr("id").replace(/_button$/, "");
		var wpseo_custom_uploader = wp.media.frames.file_frame = wp.media({
			title: wpseoMediaL10n.choose_image,
			button: { text: wpseoMediaL10n.choose_image },
			multiple: false
		});

		wpseo_custom_uploader.on("select", function () {
			var attachment = wpseo_custom_uploader.state().get("selection").first().toJSON();
			$("#" + wpseo_target_id).val(attachment.url);
		});

		$(element).click(function (e) {
			e.preventDefault();
			wpseo_custom_uploader.open();
		});
	});
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLW1lZGlhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBUSxRQUFSLEVBQW1CLEtBQW5CLENBQ0MsVUFBVSxDQUFWLEVBQWM7QUFDYjs7QUFDQSxLQUFJLE9BQU8sR0FBRyxLQUFWLEtBQW9CLFdBQXhCLEVBQXNDO0FBQ3JDO0FBQ0E7O0FBRUQsR0FBRyw0QkFBSCxFQUFrQyxJQUFsQyxDQUF3QyxVQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMkI7QUFDbEUsTUFBSSxrQkFBa0IsRUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixJQUFuQixFQUEwQixPQUExQixDQUFtQyxVQUFuQyxFQUErQyxFQUEvQyxDQUF0QjtBQUNBLE1BQUksd0JBQXdCLEdBQUcsS0FBSCxDQUFTLE1BQVQsQ0FBZ0IsVUFBaEIsR0FBNkIsR0FBRyxLQUFILENBQVU7QUFDbEUsVUFBTyxlQUFlLFlBRDRDO0FBRWxFLFdBQVEsRUFBRSxNQUFNLGVBQWUsWUFBdkIsRUFGMEQ7QUFHbEUsYUFBVTtBQUh3RCxHQUFWLENBQXpEOztBQU1BLHdCQUFzQixFQUF0QixDQUEwQixRQUExQixFQUFvQyxZQUFXO0FBQzlDLE9BQUksYUFBYSxzQkFBc0IsS0FBdEIsR0FBOEIsR0FBOUIsQ0FBbUMsV0FBbkMsRUFBaUQsS0FBakQsR0FBeUQsTUFBekQsRUFBakI7QUFDQSxLQUFHLE1BQU0sZUFBVCxFQUEyQixHQUEzQixDQUFnQyxXQUFXLEdBQTNDO0FBQ0EsR0FIRDs7QUFNQSxJQUFHLE9BQUgsRUFBYSxLQUFiLENBQW9CLFVBQVUsQ0FBVixFQUFjO0FBQ2pDLEtBQUUsY0FBRjtBQUNBLHlCQUFzQixJQUF0QjtBQUNBLEdBSEQ7QUFJQSxFQWxCRDtBQW1CQSxDQTFCRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9NZWRpYUwxMG4gKi9cbi8qIGdsb2JhbCB3cCAqL1xuLyoganNoaW50IC1XMDk3ICovXG4vKiBqc2hpbnQgLVcwMDMgKi9cbi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cblxuLy8gVGFrZW4gYW5kIGFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LndlYm1hc3Rlci1zb3VyY2UuY29tLzIwMTMvMDIvMDYvdXNpbmctdGhlLXdvcmRwcmVzcy0zLTUtbWVkaWEtdXBsb2FkZXItaW4teW91ci1wbHVnaW4tb3ItdGhlbWUvXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoXG5cdGZ1bmN0aW9uKCAkICkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXHRcdGlmKCB0eXBlb2Ygd3AubWVkaWEgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JCggXCIud3BzZW9faW1hZ2VfdXBsb2FkX2J1dHRvblwiICkuZWFjaCggZnVuY3Rpb24oIGluZGV4LCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIHdwc2VvX3RhcmdldF9pZCA9ICQoIGVsZW1lbnQgKS5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvX2J1dHRvbiQvLCBcIlwiICk7XG5cdFx0XHR2YXIgd3BzZW9fY3VzdG9tX3VwbG9hZGVyID0gd3AubWVkaWEuZnJhbWVzLmZpbGVfZnJhbWUgPSB3cC5tZWRpYSgge1xuXHRcdFx0XHR0aXRsZTogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlLFxuXHRcdFx0XHRidXR0b246IHsgdGV4dDogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlIH0sXG5cdFx0XHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHRcdH0gKTtcblxuXHRcdFx0d3BzZW9fY3VzdG9tX3VwbG9hZGVyLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGF0dGFjaG1lbnQgPSB3cHNlb19jdXN0b21fdXBsb2FkZXIuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLnRvSlNPTigpO1xuXHRcdFx0XHQkKCBcIiNcIiArIHdwc2VvX3RhcmdldF9pZCApLnZhbCggYXR0YWNobWVudC51cmwgKTtcblx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCQoIGVsZW1lbnQgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0d3BzZW9fY3VzdG9tX3VwbG9hZGVyLm9wZW4oKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cbik7XG4iXX0=
