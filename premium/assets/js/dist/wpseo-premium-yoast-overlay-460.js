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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LW92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxnQkFBZ0IsSUFBcEI7QUFDQSxDQUFFLFVBQVUsQ0FBVixFQUFjO0FBQ2YsaUJBQWdCO0FBQ2YsWUFBVSxFQURLO0FBRWYsbUJBQWlCLElBRkY7QUFHZixlQUFhLHFCQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsU0FBdkIsRUFBbUM7QUFDL0MsUUFBSyxRQUFMLENBQWMsSUFBZCxDQUFvQixFQUFFLE9BQU8sS0FBVCxFQUFnQixNQUFNLElBQXRCLEVBQTRCLFdBQVcsU0FBdkMsRUFBcEI7QUFDQSxRQUFLLGVBQUw7QUFDQSxHQU5jO0FBT2YsaUJBQWUsdUJBQVUsRUFBVixFQUFlO0FBQzdCLEtBQUcsRUFBSCxFQUFRLE1BQVI7QUFDQSxRQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxRQUFLLGVBQUw7QUFDQSxHQVhjO0FBWWYsbUJBQWlCLDJCQUFXO0FBQzNCLE9BQUssS0FBSyxlQUFMLEtBQXlCLElBQXpCLElBQWlDLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBN0QsRUFBaUU7QUFDaEU7QUFDQSxRQUFJLE9BQU8sSUFBWDs7QUFFQTtBQUNBLFNBQUssZUFBTCxHQUF1QixLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQXZCOztBQUVBO0FBQ0EsUUFBSSxLQUFLLEVBQUcsT0FBSCxDQUFUOztBQUVBO0FBQ0EsTUFBRyxFQUFILEVBQ0UsR0FERixDQUNPLFVBRFAsRUFDbUIsT0FEbkIsRUFFRSxHQUZGLENBRU8sS0FGUCxFQUVjLEtBRmQsRUFHRSxHQUhGLENBR08sTUFIUCxFQUdlLEtBSGYsRUFJRSxHQUpGLENBSU8sT0FKUCxFQUlnQixHQUpoQixFQUtFLEdBTEYsQ0FLTyxZQUxQLEVBS3FCLEdBTHJCLEVBTUUsR0FORixDQU1PLFNBTlAsRUFNa0IsTUFObEIsRUFPRSxHQVBGLENBT08sWUFQUCxFQU9xQixTQVByQixFQVFFLEdBUkYsQ0FRTyxRQVJQLEVBUWlCLG1CQVJqQjs7QUFVQTtBQUNBLE1BQUcsRUFBSCxFQUFRLEdBQVIsQ0FBYSxhQUFiLEVBQTRCLE1BQVEsRUFBRyxFQUFILEVBQVEsS0FBUixLQUFrQixHQUExQixHQUFrQyxJQUE5RDs7QUFFQTtBQUNBLE1BQUcsRUFBSCxFQUFRLE1BQVIsQ0FBZ0IsRUFBRyxNQUFILEVBQ2QsSUFEYyxDQUNSLEtBQUssZUFBTCxDQUFxQixLQURiLEVBRWQsR0FGYyxDQUVULFFBRlMsRUFFQyxDQUZELEVBR2QsR0FIYyxDQUdULFNBSFMsRUFHRSxTQUhGLEVBSWQsR0FKYyxDQUlULGVBSlMsRUFJUSxtQkFKUixDQUFoQjs7QUFNQTtBQUNBLE1BQUcsRUFBSCxFQUFRLE1BQVIsQ0FBZ0IsRUFBRyxLQUFILEVBQVcsR0FBWCxDQUFnQixlQUFoQixFQUFpQyxDQUFqQyxFQUFxQyxJQUFyQyxDQUEyQyxLQUFLLGVBQUwsQ0FBcUIsSUFBaEUsQ0FBaEI7O0FBRUE7QUFDQSxRQUFJLFVBQVUsRUFBRyxLQUFILEVBQ1osR0FEWSxDQUNQLFVBRE8sRUFDSyxVQURMLEVBRVosR0FGWSxDQUVQLEtBRk8sRUFFQSxDQUZBLEVBR1osR0FIWSxDQUdQLE9BSE8sRUFHRSxDQUhGLEVBSVosR0FKWSxDQUlQLFNBSk8sRUFJSSxPQUpKLEVBS1osR0FMWSxDQUtQLFFBTE8sRUFLRyxLQUxILEVBTVosR0FOWSxDQU1QLGFBTk8sRUFNUSxNQU5SLEVBT1osR0FQWSxDQU9QLFFBUE8sRUFPRyxTQVBILEVBUVosR0FSWSxDQVFQLE9BUk8sRUFRRSxTQVJGLEVBU1osR0FUWSxDQVNQLGFBVE8sRUFTUSxNQVRSLEVBVVosR0FWWSxDQVVQLFFBVk8sRUFVRyxtQkFWSCxDQUFkO0FBV0EsTUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixHQUFuQjtBQUNBLE1BQUcsT0FBSCxFQUFhLEtBQWIsQ0FBb0IsWUFBVztBQUM5QixVQUFLLGFBQUwsQ0FBb0IsRUFBcEI7QUFDQSxLQUZEO0FBSUEsTUFBRyxFQUFILEVBQVEsTUFBUixDQUFnQixPQUFoQjs7QUFFQTtBQUNBLE1BQUcsTUFBSCxFQUFZLE1BQVosQ0FBb0IsRUFBcEI7O0FBRUE7QUFDQSxRQUFLLEtBQUssZUFBTCxDQUFxQixTQUFyQixLQUFtQyxTQUFuQyxJQUNKLEtBQUssZUFBTCxDQUFxQixTQUFyQixLQUFtQyxLQUQvQixJQUVKLEtBQUssZUFBTCxDQUFxQixTQUFyQixHQUFpQyxDQUZsQyxFQUVzQztBQUNyQyxnQkFBWSxZQUFXO0FBQ3RCLFdBQUssYUFBTCxDQUFvQixFQUFwQjtBQUNBLE1BRkQsRUFFSyxLQUFLLGVBQUwsQ0FBcUIsU0FBckIsR0FBaUMsSUFGdEM7QUFJQTtBQUNEO0FBQ0Q7QUEvRWMsRUFBaEI7QUFpRkEsQ0FsRkQsRUFrRkssTUFsRkwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IC1XMDk3ICovXG52YXIgeW9hc3Rfb3ZlcmxheSA9IG51bGw7XG4oIGZ1bmN0aW9uKCAkICkge1xuXHR5b2FzdF9vdmVybGF5ID0ge1xuXHRcdG1lc3NhZ2VzOiBbXSxcblx0XHRjdXJyZW50X21lc3NhZ2U6IG51bGwsXG5cdFx0YWRkX21lc3NhZ2U6IGZ1bmN0aW9uKCB0aXRsZSwgdGV4dCwgYXV0b2Nsb3NlICkge1xuXHRcdFx0dGhpcy5tZXNzYWdlcy5wdXNoKCB7IHRpdGxlOiB0aXRsZSwgdGV4dDogdGV4dCwgYXV0b2Nsb3NlOiBhdXRvY2xvc2UgfSApO1xuXHRcdFx0dGhpcy5kaXNwbGF5X21lc3NhZ2UoKTtcblx0XHR9LFxuXHRcdGNsb3NlX21lc3NhZ2U6IGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdCQoIGVsICkucmVtb3ZlKCk7XG5cdFx0XHR0aGlzLmN1cnJlbnRfbWVzc2FnZSA9IG51bGw7XG5cdFx0XHR0aGlzLmRpc3BsYXlfbWVzc2FnZSgpO1xuXHRcdH0sXG5cdFx0ZGlzcGxheV9tZXNzYWdlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggdGhpcy5jdXJyZW50X21lc3NhZ2UgPT09IG51bGwgJiYgdGhpcy5tZXNzYWdlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHQvLyBTdG9yZSB0aGlzIGluIGEgbG9jYWwgdmFyLlxuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRcdFx0Ly8gU2V0IHRoZSBjdXJyZW50IG1lc3NhZ2UuXG5cdFx0XHRcdHRoaXMuY3VycmVudF9tZXNzYWdlID0gdGhpcy5tZXNzYWdlcy5zaGlmdCgpO1xuXG5cdFx0XHRcdC8vIENyZWF0ZSB0aGUgZWxlbWVudC5cblx0XHRcdFx0dmFyIGVsID0gJCggXCI8ZGl2PlwiICk7XG5cblx0XHRcdFx0Ly8gU2V0IHRoZSBDU1MuXG5cdFx0XHRcdCQoIGVsIClcblx0XHRcdFx0XHQuY3NzKCBcInBvc2l0aW9uXCIsIFwiZml4ZWRcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJ0b3BcIiwgXCIyMCVcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJsZWZ0XCIsIFwiNTAlXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwid2lkdGhcIiwgMzUwIClcblx0XHRcdFx0XHQuY3NzKCBcIm1pbi1oZWlnaHRcIiwgMTAwIClcblx0XHRcdFx0XHQuY3NzKCBcInBhZGRpbmdcIiwgXCIyNXB4XCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwiYmFja2dyb3VuZFwiLCBcIiNmZmZmZmZcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJib3JkZXJcIiwgXCIycHggc29saWQgI2RjZGRkZVwiICk7XG5cblx0XHRcdFx0Ly8gSG9yaXpvbnRhbCBwb3NpdGlvbmluZy5cblx0XHRcdFx0JCggZWwgKS5jc3MoIFwibWFyZ2luLWxlZnRcIiwgXCItXCIgKyAoICQoIGVsICkud2lkdGgoKSAqIDAuNSApICsgXCJweFwiICk7XG5cblx0XHRcdFx0Ly8gVGhlIHRpdGxlLlxuXHRcdFx0XHQkKCBlbCApLmFwcGVuZCggJCggXCI8aDI+XCIgKVxuXHRcdFx0XHRcdC5odG1sKCB0aGlzLmN1cnJlbnRfbWVzc2FnZS50aXRsZSApXG5cdFx0XHRcdFx0LmNzcyggXCJtYXJnaW5cIiwgMCApXG5cdFx0XHRcdFx0LmNzcyggXCJwYWRkaW5nXCIsIFwiMCAwIDdweFwiIClcblx0XHRcdFx0XHQuY3NzKCBcImJvcmRlci1ib3R0b21cIiwgXCIxcHggc29saWQgI2YxODUwMFwiICkgKTtcblxuXHRcdFx0XHQvLyBUaGUgdGV4dC5cblx0XHRcdFx0JCggZWwgKS5hcHBlbmQoICQoIFwiPHA+XCIgKS5jc3MoIFwibWFyZ2luLWJvdHRvbVwiLCAwICkuaHRtbCggdGhpcy5jdXJyZW50X21lc3NhZ2UudGV4dCApICk7XG5cblx0XHRcdFx0Ly8gVGhlIGNsb3NlIGJ1dHRvbi5cblx0XHRcdFx0dmFyIGVsQ2xvc2UgPSAkKCBcIjxhPlwiIClcblx0XHRcdFx0XHQuY3NzKCBcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJ0b3BcIiwgMCApXG5cdFx0XHRcdFx0LmNzcyggXCJyaWdodFwiLCAwIClcblx0XHRcdFx0XHQuY3NzKCBcInBhZGRpbmdcIiwgXCIwIDVweFwiIClcblx0XHRcdFx0XHQuY3NzKCBcIm1hcmdpblwiLCBcIjVweFwiIClcblx0XHRcdFx0XHQuY3NzKCBcImxpbmUtaGVpZ2h0XCIsIFwiMTdweFwiIClcblx0XHRcdFx0XHQuY3NzKCBcImN1cnNvclwiLCBcInBvaW50ZXJcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJjb2xvclwiLCBcIiNmMTg1MDBcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJmb250LXdlaWdodFwiLCBcImJvbGRcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJib3JkZXJcIiwgXCIxcHggc29saWQgI2YxODUwMFwiICk7XG5cdFx0XHRcdCQoIGVsQ2xvc2UgKS5odG1sKCBcIlhcIiApO1xuXHRcdFx0XHQkKCBlbENsb3NlICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRoYXQuY2xvc2VfbWVzc2FnZSggZWwgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0XHQkKCBlbCApLmFwcGVuZCggZWxDbG9zZSApO1xuXG5cdFx0XHRcdC8vIEFwcGVuZCB0aGUgZWxlbWVudCB0byBib2R5XG5cdFx0XHRcdCQoIFwiYm9keVwiICkuYXBwZW5kKCBlbCApO1xuXG5cdFx0XHRcdC8vIENoZWNrIGF1dG9jbG9zZVxuXHRcdFx0XHRpZiAoIHRoaXMuY3VycmVudF9tZXNzYWdlLmF1dG9jbG9zZSAhPT0gdW5kZWZpbmVkICYmXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50X21lc3NhZ2UuYXV0b2Nsb3NlICE9PSBmYWxzZSAmJlxuXHRcdFx0XHRcdHRoaXMuY3VycmVudF9tZXNzYWdlLmF1dG9jbG9zZSA+IDAgKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmNsb3NlX21lc3NhZ2UoIGVsICk7XG5cdFx0XHRcdFx0fSwgKCB0aGlzLmN1cnJlbnRfbWVzc2FnZS5hdXRvY2xvc2UgKiAxMDAwIClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn0gKSggalF1ZXJ5ICk7XG4iXX0=
