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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcc3JjXFx3cC1zZW8tYWRtaW4tbWVkaWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFRLFFBQVIsRUFBbUIsS0FBbkIsQ0FDQyxVQUFVLENBQVYsRUFBYztBQUNiOztBQUNBLEtBQUksT0FBTyxHQUFHLEtBQVYsS0FBb0IsV0FBeEIsRUFBc0M7QUFDckM7QUFDQTs7QUFFRCxHQUFHLDRCQUFILEVBQWtDLElBQWxDLENBQXdDLFVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEyQjtBQUNsRSxNQUFJLGtCQUFrQixFQUFHLE9BQUgsRUFBYSxJQUFiLENBQW1CLElBQW5CLEVBQTBCLE9BQTFCLENBQW1DLFVBQW5DLEVBQStDLEVBQS9DLENBQXRCO0FBQ0EsTUFBSSx3QkFBd0IsR0FBRyxLQUFILENBQVMsTUFBVCxDQUFnQixVQUFoQixHQUE2QixHQUFHLEtBQUgsQ0FBVTtBQUNsRSxVQUFPLGVBQWUsWUFENEM7QUFFbEUsV0FBUSxFQUFFLE1BQU0sZUFBZSxZQUF2QixFQUYwRDtBQUdsRSxhQUFVO0FBSHdELEdBQVYsQ0FBekQ7O0FBTUEsd0JBQXNCLEVBQXRCLENBQTBCLFFBQTFCLEVBQW9DLFlBQVc7QUFDOUMsT0FBSSxhQUFhLHNCQUFzQixLQUF0QixHQUE4QixHQUE5QixDQUFtQyxXQUFuQyxFQUFpRCxLQUFqRCxHQUF5RCxNQUF6RCxFQUFqQjtBQUNBLEtBQUcsTUFBTSxlQUFULEVBQTJCLEdBQTNCLENBQWdDLFdBQVcsR0FBM0M7QUFDQSxHQUhEOztBQU1BLElBQUcsT0FBSCxFQUFhLEtBQWIsQ0FBb0IsVUFBVSxDQUFWLEVBQWM7QUFDakMsS0FBRSxjQUFGO0FBQ0EseUJBQXNCLElBQXRCO0FBQ0EsR0FIRDtBQUlBLEVBbEJEO0FBbUJBLENBMUJGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cHNlb01lZGlhTDEwbiAqL1xyXG4vKiBnbG9iYWwgd3AgKi9cclxuLyoganNoaW50IC1XMDk3ICovXHJcbi8qIGpzaGludCAtVzAwMyAqL1xyXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXHJcblxyXG4vLyBUYWtlbiBhbmQgYWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cud2VibWFzdGVyLXNvdXJjZS5jb20vMjAxMy8wMi8wNi91c2luZy10aGUtd29yZHByZXNzLTMtNS1tZWRpYS11cGxvYWRlci1pbi15b3VyLXBsdWdpbi1vci10aGVtZS9cclxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxyXG5cdGZ1bmN0aW9uKCAkICkge1xyXG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0XHRpZiggdHlwZW9mIHdwLm1lZGlhID09PSBcInVuZGVmaW5lZFwiICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0JCggXCIud3BzZW9faW1hZ2VfdXBsb2FkX2J1dHRvblwiICkuZWFjaCggZnVuY3Rpb24oIGluZGV4LCBlbGVtZW50ICkge1xyXG5cdFx0XHR2YXIgd3BzZW9fdGFyZ2V0X2lkID0gJCggZWxlbWVudCApLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC9fYnV0dG9uJC8sIFwiXCIgKTtcclxuXHRcdFx0dmFyIHdwc2VvX2N1c3RvbV91cGxvYWRlciA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoIHtcclxuXHRcdFx0XHR0aXRsZTogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlLFxyXG5cdFx0XHRcdGJ1dHRvbjogeyB0ZXh0OiB3cHNlb01lZGlhTDEwbi5jaG9vc2VfaW1hZ2UgfSxcclxuXHRcdFx0XHRtdWx0aXBsZTogZmFsc2UsXHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdHdwc2VvX2N1c3RvbV91cGxvYWRlci5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGF0dGFjaG1lbnQgPSB3cHNlb19jdXN0b21fdXBsb2FkZXIuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLnRvSlNPTigpO1xyXG5cdFx0XHRcdCQoIFwiI1wiICsgd3BzZW9fdGFyZ2V0X2lkICkudmFsKCBhdHRhY2htZW50LnVybCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQkKCBlbGVtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR3cHNlb19jdXN0b21fdXBsb2FkZXIub3BlbigpO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblx0fVxyXG4pO1xyXG4iXX0=
