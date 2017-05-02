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

				/* eslint-disable camelcase */
				if (typeof this.current_message.autoclose !== "undefined" && this.current_message.autoclose !== false && this.current_message.autoclose > 0) {
					setTimeout(function () {
						that.close_message(el);
					}, this.current_message.autoclose * 1000);
				}
				/* eslint-enable camelcase */
			}
		}
	};
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LW92ZXJsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBSSxnQkFBZ0IsSUFBcEI7QUFDQSxDQUFFLFVBQVUsQ0FBVixFQUFjO0FBQ2YsaUJBQWdCO0FBQ2YsWUFBVSxFQURLO0FBRWYsbUJBQWlCLElBRkY7QUFHZixlQUFhLHFCQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsU0FBdkIsRUFBbUM7QUFDL0MsUUFBSyxRQUFMLENBQWMsSUFBZCxDQUFvQixFQUFFLE9BQU8sS0FBVCxFQUFnQixNQUFNLElBQXRCLEVBQTRCLFdBQVcsU0FBdkMsRUFBcEI7QUFDQSxRQUFLLGVBQUw7QUFDQSxHQU5jO0FBT2YsaUJBQWUsdUJBQVUsRUFBVixFQUFlO0FBQzdCLEtBQUcsRUFBSCxFQUFRLE1BQVI7QUFDQSxRQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxRQUFLLGVBQUw7QUFDQSxHQVhjO0FBWWYsbUJBQWlCLDJCQUFXO0FBQzNCLE9BQUssS0FBSyxlQUFMLEtBQXlCLElBQXpCLElBQWlDLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBN0QsRUFBaUU7QUFDaEU7QUFDQSxRQUFJLE9BQU8sSUFBWDs7QUFFQTtBQUNBLFNBQUssZUFBTCxHQUF1QixLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQXZCOztBQUVBO0FBQ0EsUUFBSSxLQUFLLEVBQUcsT0FBSCxDQUFUOztBQUVBO0FBQ0EsTUFBRyxFQUFILEVBQ0UsR0FERixDQUNPLFVBRFAsRUFDbUIsT0FEbkIsRUFFRSxHQUZGLENBRU8sS0FGUCxFQUVjLEtBRmQsRUFHRSxHQUhGLENBR08sTUFIUCxFQUdlLEtBSGYsRUFJRSxHQUpGLENBSU8sT0FKUCxFQUlnQixHQUpoQixFQUtFLEdBTEYsQ0FLTyxZQUxQLEVBS3FCLEdBTHJCLEVBTUUsR0FORixDQU1PLFNBTlAsRUFNa0IsTUFObEIsRUFPRSxHQVBGLENBT08sWUFQUCxFQU9xQixTQVByQixFQVFFLEdBUkYsQ0FRTyxRQVJQLEVBUWlCLG1CQVJqQjs7QUFVQTtBQUNBLE1BQUcsRUFBSCxFQUFRLEdBQVIsQ0FBYSxhQUFiLEVBQTRCLE1BQVEsRUFBRyxFQUFILEVBQVEsS0FBUixLQUFrQixHQUExQixHQUFrQyxJQUE5RDs7QUFFQTtBQUNBLE1BQUcsRUFBSCxFQUFRLE1BQVIsQ0FBZ0IsRUFBRyxNQUFILEVBQ2QsSUFEYyxDQUNSLEtBQUssZUFBTCxDQUFxQixLQURiLEVBRWQsR0FGYyxDQUVULFFBRlMsRUFFQyxDQUZELEVBR2QsR0FIYyxDQUdULFNBSFMsRUFHRSxTQUhGLEVBSWQsR0FKYyxDQUlULGVBSlMsRUFJUSxtQkFKUixDQUFoQjs7QUFNQTtBQUNBLE1BQUcsRUFBSCxFQUFRLE1BQVIsQ0FBZ0IsRUFBRyxLQUFILEVBQVcsR0FBWCxDQUFnQixlQUFoQixFQUFpQyxDQUFqQyxFQUFxQyxJQUFyQyxDQUEyQyxLQUFLLGVBQUwsQ0FBcUIsSUFBaEUsQ0FBaEI7O0FBRUE7QUFDQSxRQUFJLFVBQVUsRUFBRyxLQUFILEVBQ1osR0FEWSxDQUNQLFVBRE8sRUFDSyxVQURMLEVBRVosR0FGWSxDQUVQLEtBRk8sRUFFQSxDQUZBLEVBR1osR0FIWSxDQUdQLE9BSE8sRUFHRSxDQUhGLEVBSVosR0FKWSxDQUlQLFNBSk8sRUFJSSxPQUpKLEVBS1osR0FMWSxDQUtQLFFBTE8sRUFLRyxLQUxILEVBTVosR0FOWSxDQU1QLGFBTk8sRUFNUSxNQU5SLEVBT1osR0FQWSxDQU9QLFFBUE8sRUFPRyxTQVBILEVBUVosR0FSWSxDQVFQLE9BUk8sRUFRRSxTQVJGLEVBU1osR0FUWSxDQVNQLGFBVE8sRUFTUSxNQVRSLEVBVVosR0FWWSxDQVVQLFFBVk8sRUFVRyxtQkFWSCxDQUFkO0FBV0EsTUFBRyxPQUFILEVBQWEsSUFBYixDQUFtQixHQUFuQjtBQUNBLE1BQUcsT0FBSCxFQUFhLEtBQWIsQ0FBb0IsWUFBVztBQUM5QixVQUFLLGFBQUwsQ0FBb0IsRUFBcEI7QUFDQSxLQUZEO0FBSUEsTUFBRyxFQUFILEVBQVEsTUFBUixDQUFnQixPQUFoQjs7QUFFQTtBQUNBLE1BQUcsTUFBSCxFQUFZLE1BQVosQ0FBb0IsRUFBcEI7O0FBRUE7O0FBRUE7QUFDQSxRQUFLLE9BQU8sS0FBSyxlQUFMLENBQXFCLFNBQTVCLEtBQTBDLFdBQTFDLElBQ0osS0FBSyxlQUFMLENBQXFCLFNBQXJCLEtBQW1DLEtBRC9CLElBRUosS0FBSyxlQUFMLENBQXFCLFNBQXJCLEdBQWlDLENBRmxDLEVBRXNDO0FBQ3JDLGdCQUFZLFlBQVc7QUFDdEIsV0FBSyxhQUFMLENBQW9CLEVBQXBCO0FBQ0EsTUFGRCxFQUVLLEtBQUssZUFBTCxDQUFxQixTQUFyQixHQUFpQyxJQUZ0QztBQUlBO0FBQ0Q7QUFDQTtBQUNEO0FBbEZjLEVBQWhCO0FBb0ZBLENBckZELEVBcUZLLE1BckZMIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCAtVzA5NyAqL1xudmFyIHlvYXN0X292ZXJsYXkgPSBudWxsO1xuKCBmdW5jdGlvbiggJCApIHtcblx0eW9hc3Rfb3ZlcmxheSA9IHtcblx0XHRtZXNzYWdlczogW10sXG5cdFx0Y3VycmVudF9tZXNzYWdlOiBudWxsLFxuXHRcdGFkZF9tZXNzYWdlOiBmdW5jdGlvbiggdGl0bGUsIHRleHQsIGF1dG9jbG9zZSApIHtcblx0XHRcdHRoaXMubWVzc2FnZXMucHVzaCggeyB0aXRsZTogdGl0bGUsIHRleHQ6IHRleHQsIGF1dG9jbG9zZTogYXV0b2Nsb3NlIH0gKTtcblx0XHRcdHRoaXMuZGlzcGxheV9tZXNzYWdlKCk7XG5cdFx0fSxcblx0XHRjbG9zZV9tZXNzYWdlOiBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHQkKCBlbCApLnJlbW92ZSgpO1xuXHRcdFx0dGhpcy5jdXJyZW50X21lc3NhZ2UgPSBudWxsO1xuXHRcdFx0dGhpcy5kaXNwbGF5X21lc3NhZ2UoKTtcblx0XHR9LFxuXHRcdGRpc3BsYXlfbWVzc2FnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHRoaXMuY3VycmVudF9tZXNzYWdlID09PSBudWxsICYmIHRoaXMubWVzc2FnZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Ly8gU3RvcmUgdGhpcyBpbiBhIGxvY2FsIHZhci5cblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0XHRcdC8vIFNldCB0aGUgY3VycmVudCBtZXNzYWdlLlxuXHRcdFx0XHR0aGlzLmN1cnJlbnRfbWVzc2FnZSA9IHRoaXMubWVzc2FnZXMuc2hpZnQoKTtcblxuXHRcdFx0XHQvLyBDcmVhdGUgdGhlIGVsZW1lbnQuXG5cdFx0XHRcdHZhciBlbCA9ICQoIFwiPGRpdj5cIiApO1xuXG5cdFx0XHRcdC8vIFNldCB0aGUgQ1NTLlxuXHRcdFx0XHQkKCBlbCApXG5cdFx0XHRcdFx0LmNzcyggXCJwb3NpdGlvblwiLCBcImZpeGVkXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwidG9wXCIsIFwiMjAlXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwibGVmdFwiLCBcIjUwJVwiIClcblx0XHRcdFx0XHQuY3NzKCBcIndpZHRoXCIsIDM1MCApXG5cdFx0XHRcdFx0LmNzcyggXCJtaW4taGVpZ2h0XCIsIDEwMCApXG5cdFx0XHRcdFx0LmNzcyggXCJwYWRkaW5nXCIsIFwiMjVweFwiIClcblx0XHRcdFx0XHQuY3NzKCBcImJhY2tncm91bmRcIiwgXCIjZmZmZmZmXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwiYm9yZGVyXCIsIFwiMnB4IHNvbGlkICNkY2RkZGVcIiApO1xuXG5cdFx0XHRcdC8vIEhvcml6b250YWwgcG9zaXRpb25pbmcuXG5cdFx0XHRcdCQoIGVsICkuY3NzKCBcIm1hcmdpbi1sZWZ0XCIsIFwiLVwiICsgKCAkKCBlbCApLndpZHRoKCkgKiAwLjUgKSArIFwicHhcIiApO1xuXG5cdFx0XHRcdC8vIFRoZSB0aXRsZS5cblx0XHRcdFx0JCggZWwgKS5hcHBlbmQoICQoIFwiPGgyPlwiIClcblx0XHRcdFx0XHQuaHRtbCggdGhpcy5jdXJyZW50X21lc3NhZ2UudGl0bGUgKVxuXHRcdFx0XHRcdC5jc3MoIFwibWFyZ2luXCIsIDAgKVxuXHRcdFx0XHRcdC5jc3MoIFwicGFkZGluZ1wiLCBcIjAgMCA3cHhcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJib3JkZXItYm90dG9tXCIsIFwiMXB4IHNvbGlkICNmMTg1MDBcIiApICk7XG5cblx0XHRcdFx0Ly8gVGhlIHRleHQuXG5cdFx0XHRcdCQoIGVsICkuYXBwZW5kKCAkKCBcIjxwPlwiICkuY3NzKCBcIm1hcmdpbi1ib3R0b21cIiwgMCApLmh0bWwoIHRoaXMuY3VycmVudF9tZXNzYWdlLnRleHQgKSApO1xuXG5cdFx0XHRcdC8vIFRoZSBjbG9zZSBidXR0b24uXG5cdFx0XHRcdHZhciBlbENsb3NlID0gJCggXCI8YT5cIiApXG5cdFx0XHRcdFx0LmNzcyggXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwidG9wXCIsIDAgKVxuXHRcdFx0XHRcdC5jc3MoIFwicmlnaHRcIiwgMCApXG5cdFx0XHRcdFx0LmNzcyggXCJwYWRkaW5nXCIsIFwiMCA1cHhcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJtYXJnaW5cIiwgXCI1cHhcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJsaW5lLWhlaWdodFwiLCBcIjE3cHhcIiApXG5cdFx0XHRcdFx0LmNzcyggXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwiY29sb3JcIiwgXCIjZjE4NTAwXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwiZm9udC13ZWlnaHRcIiwgXCJib2xkXCIgKVxuXHRcdFx0XHRcdC5jc3MoIFwiYm9yZGVyXCIsIFwiMXB4IHNvbGlkICNmMTg1MDBcIiApO1xuXHRcdFx0XHQkKCBlbENsb3NlICkuaHRtbCggXCJYXCIgKTtcblx0XHRcdFx0JCggZWxDbG9zZSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0aGF0LmNsb3NlX21lc3NhZ2UoIGVsICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdFx0JCggZWwgKS5hcHBlbmQoIGVsQ2xvc2UgKTtcblxuXHRcdFx0XHQvLyBBcHBlbmQgdGhlIGVsZW1lbnQgdG8gYm9keVxuXHRcdFx0XHQkKCBcImJvZHlcIiApLmFwcGVuZCggZWwgKTtcblxuXHRcdFx0XHQvLyBDaGVjayBhdXRvY2xvc2VcblxuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cblx0XHRcdFx0aWYgKCB0eXBlb2YgdGhpcy5jdXJyZW50X21lc3NhZ2UuYXV0b2Nsb3NlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50X21lc3NhZ2UuYXV0b2Nsb3NlICE9PSBmYWxzZSAmJlxuXHRcdFx0XHRcdHRoaXMuY3VycmVudF9tZXNzYWdlLmF1dG9jbG9zZSA+IDAgKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGF0LmNsb3NlX21lc3NhZ2UoIGVsICk7XG5cdFx0XHRcdFx0fSwgKCB0aGlzLmN1cnJlbnRfbWVzc2FnZS5hdXRvY2xvc2UgKiAxMDAwIClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlICovXG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn0gKSggalF1ZXJ5ICk7XG4iXX0=
