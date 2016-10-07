(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* jshint -W097 */
var yoast_overlay = null;
(function ($) {
	yoast_overlay = {
		messages: [],
		current_message: null,
		add_message: function add_message(title, text, autoclose) {
			this.messages.push({ title: title, text: text, autoclose: autoclose });
			this.display_message();
		},
		close_message: function close_message(el) {
			$(el).remove();
			this.current_message = null;
			this.display_message();
		},
		display_message: function display_message() {
			if (this.current_message === null && this.messages.length > 0) {
				// Store this in a local var.
				var that = this;

				// Set the current message.
				this.current_message = this.messages.shift();

				// Create the element.
				var el = $("<div>");

				// Set the CSS.
				$(el).css("position", "fixed").css("top", "20%").css("left", "50%").css("width", 350).css("min-height", 100).css("padding", "25px").css("background", "#ffffff").css("border", "2px solid #dcddde");

				// Horizontal positioning.
				$(el).css("margin-left", "-" + $(el).width() * 0.5 + "px");

				// The title.
				$(el).append($("<h2>").html(this.current_message.title).css("margin", 0).css("padding", "0 0 7px").css("border-bottom", "1px solid #f18500"));

				// The text.
				$(el).append($("<p>").css("margin-bottom", 0).html(this.current_message.text));

				// The close button.
				var elClose = $("<a>").css("position", "absolute").css("top", 0).css("right", 0).css("padding", "0 5px").css("margin", "5px").css("line-height", "17px").css("cursor", "pointer").css("color", "#f18500").css("font-weight", "bold").css("border", "1px solid #f18500");
				$(elClose).html("X");
				$(elClose).click(function () {
					that.close_message(el);
				});
				$(el).append(elClose);

				// Append the element to body
				$("body").append(el);

				// Check autoclose
				if (this.current_message.autoclose !== undefined && this.current_message.autoclose !== false && this.current_message.autoclose > 0) {
					setTimeout(function () {
						that.close_message(el);
					}, this.current_message.autoclose * 1000);
				}
			}
		}
	};
})(jQuery);

},{}]},{},[1]);
