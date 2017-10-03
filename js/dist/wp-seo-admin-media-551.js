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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLW1lZGlhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBUSxRQUFSLEVBQW1CLEtBQW5CLENBQ0MsVUFBVSxDQUFWLEVBQWM7QUFDYjs7QUFDQSxLQUFJLE9BQU8sR0FBRyxLQUFWLEtBQW9CLFdBQXhCLEVBQXNDO0FBQ3JDO0FBQ0E7O0FBRUQsR0FBRyw0QkFBSCxFQUFrQyxJQUFsQyxDQUF3QyxVQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMkI7QUFDbEUsTUFBSSxnQkFBZ0IsRUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixJQUFuQixFQUEwQixPQUExQixDQUFtQyxVQUFuQyxFQUErQyxFQUEvQyxDQUFwQjtBQUNBO0FBQ0EsTUFBSSxzQkFBc0IsR0FBRyxLQUFILENBQVMsTUFBVCxDQUFnQixVQUFoQixHQUE2QixHQUFHLEtBQUgsQ0FBVTtBQUNoRSxVQUFPLGVBQWUsWUFEMEM7QUFFaEUsV0FBUSxFQUFFLE1BQU0sZUFBZSxZQUF2QixFQUZ3RDtBQUdoRSxhQUFVO0FBSHNELEdBQVYsQ0FBdkQ7O0FBTUEsc0JBQW9CLEVBQXBCLENBQXdCLFFBQXhCLEVBQWtDLFlBQVc7QUFDNUMsT0FBSSxhQUFhLG9CQUFvQixLQUFwQixHQUE0QixHQUE1QixDQUFpQyxXQUFqQyxFQUErQyxLQUEvQyxHQUF1RCxNQUF2RCxFQUFqQjtBQUNBLEtBQUcsTUFBTSxhQUFULEVBQXlCLEdBQXpCLENBQThCLFdBQVcsR0FBekM7QUFDQSxHQUhEOztBQU1BLElBQUcsT0FBSCxFQUFhLEtBQWIsQ0FBb0IsVUFBVSxDQUFWLEVBQWM7QUFDakMsS0FBRSxjQUFGO0FBQ0EsdUJBQW9CLElBQXBCO0FBQ0EsR0FIRDtBQUlBLEVBbkJEO0FBb0JBLENBM0JGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cHNlb01lZGlhTDEwbiAqL1xuLyogZ2xvYmFsIHdwICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCAtVzAwMyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuXG4vLyBUYWtlbiBhbmQgYWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cud2VibWFzdGVyLXNvdXJjZS5jb20vMjAxMy8wMi8wNi91c2luZy10aGUtd29yZHByZXNzLTMtNS1tZWRpYS11cGxvYWRlci1pbi15b3VyLXBsdWdpbi1vci10aGVtZS9cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeShcblx0ZnVuY3Rpb24oICQgKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0aWYoIHR5cGVvZiB3cC5tZWRpYSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkKCBcIi53cHNlb19pbWFnZV91cGxvYWRfYnV0dG9uXCIgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgd3BzZW9UYXJnZXRJZCA9ICQoIGVsZW1lbnQgKS5hdHRyKCBcImlkXCIgKS5yZXBsYWNlKCAvX2J1dHRvbiQvLCBcIlwiICk7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0XHRcdHZhciB3cHNlb0N1c3RvbVVwbG9hZGVyID0gd3AubWVkaWEuZnJhbWVzLmZpbGVfZnJhbWUgPSB3cC5tZWRpYSgge1xuXHRcdFx0XHR0aXRsZTogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlLFxuXHRcdFx0XHRidXR0b246IHsgdGV4dDogd3BzZW9NZWRpYUwxMG4uY2hvb3NlX2ltYWdlIH0sXG5cdFx0XHRcdG11bHRpcGxlOiBmYWxzZSxcblx0XHRcdH0gKTtcblxuXHRcdFx0d3BzZW9DdXN0b21VcGxvYWRlci5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBhdHRhY2htZW50ID0gd3BzZW9DdXN0b21VcGxvYWRlci5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XG5cdFx0XHRcdCQoIFwiI1wiICsgd3BzZW9UYXJnZXRJZCApLnZhbCggYXR0YWNobWVudC51cmwgKTtcblx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHRcdCQoIGVsZW1lbnQgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0d3BzZW9DdXN0b21VcGxvYWRlci5vcGVuKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG4pO1xuIl19
