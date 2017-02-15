(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global HS */
(function ($) {
	$(window).on("YoastSEO:ContactSupport", function (e, data) {
		if (data.usedQueries !== undefined) {
			var identity = HS.beacon.get_helpscout_beacon_identity();
			identity["User searched for"] = usedQueriesWithHTML(data.usedQueries);
			HS.beacon.identify(identity);
		}
		HS.beacon.open();
	});

	/**
  * Format the search queries done by the user in HTML
  *
  * @param {array} usedQueries List of queries entered by the user.
  * @returns {string} The generated output.
  */
	function usedQueriesWithHTML(usedQueries) {
		var output = "";
		if ($.isEmptyObject(usedQueries)) {
			output += "<em>Search history is empty.</em>";
		} else {
			output += "<table><tr><th>Searched for</th><th>Opened article</th></tr>";
			$.each(usedQueries, function (searchString, posts) {
				output += "<tr><td>" + searchString + "</td>";
				output += getPostsHTML(posts);
				output += "</tr>";
			});
			output = output + "</table>";
		}

		return output;
	}

	/**
  * Format the posts looked at by the user in HTML
  *
  * @param {array} posts List of posts opened by the user.
  * @returns {string} The generated output.
  */
	function getPostsHTML(posts) {
		var output = "";
		var first = true;
		if ($.isEmptyObject(posts)) {
			output += "<td><em>No articles were opened.</em></td>";
		} else {
			$.each(posts, function (postId, post) {
				if (first === false) {
					output += "<td></td>";
				}
				output += "<td><a href='" + post.link + "'>" + post.title + "</a></td>";
				first = false;
			});
		}

		return output;
	}
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxzcmNcXGNvbnRhY3Qtc3VwcG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxDQUFFLFVBQVUsQ0FBVixFQUFjO0FBQ2YsR0FBRyxNQUFILEVBQVksRUFBWixDQUFnQix5QkFBaEIsRUFBMkMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFvQjtBQUM5RCxNQUFJLEtBQUssV0FBTCxLQUFxQixTQUF6QixFQUFxQztBQUNwQyxPQUFJLFdBQVcsR0FBRyxNQUFILENBQVUsNkJBQVYsRUFBZjtBQUNBLFlBQVUsbUJBQVYsSUFBa0Msb0JBQXFCLEtBQUssV0FBMUIsQ0FBbEM7QUFDQSxNQUFHLE1BQUgsQ0FBVSxRQUFWLENBQW9CLFFBQXBCO0FBQ0E7QUFDRCxLQUFHLE1BQUgsQ0FBVSxJQUFWO0FBQ0EsRUFQRDs7QUFTQTs7Ozs7O0FBTUEsVUFBUyxtQkFBVCxDQUE4QixXQUE5QixFQUE0QztBQUMzQyxNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUssRUFBRSxhQUFGLENBQWlCLFdBQWpCLENBQUwsRUFBc0M7QUFDckMsYUFBVSxtQ0FBVjtBQUNBLEdBRkQsTUFFTztBQUNOLGFBQVUsOERBQVY7QUFDQSxLQUFFLElBQUYsQ0FBUSxXQUFSLEVBQXFCLFVBQVUsWUFBVixFQUF3QixLQUF4QixFQUFnQztBQUNwRCxjQUFVLGFBQWEsWUFBYixHQUE0QixPQUF0QztBQUNBLGNBQVUsYUFBYyxLQUFkLENBQVY7QUFDQSxjQUFVLE9BQVY7QUFDQSxJQUpEO0FBS0EsWUFBUyxTQUFTLFVBQWxCO0FBQ0E7O0FBRUQsU0FBTyxNQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsWUFBVCxDQUF1QixLQUF2QixFQUErQjtBQUM5QixNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUksUUFBUSxJQUFaO0FBQ0EsTUFBSyxFQUFFLGFBQUYsQ0FBaUIsS0FBakIsQ0FBTCxFQUFnQztBQUMvQixhQUFVLDRDQUFWO0FBQ0EsR0FGRCxNQUVPO0FBQ04sS0FBRSxJQUFGLENBQVEsS0FBUixFQUFlLFVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF5QjtBQUN2QyxRQUFLLFVBQVUsS0FBZixFQUF1QjtBQUN0QixlQUFVLFdBQVY7QUFDQTtBQUNELGNBQVUsa0JBQWtCLEtBQUssSUFBdkIsR0FBOEIsSUFBOUIsR0FBcUMsS0FBSyxLQUExQyxHQUFrRCxXQUE1RDtBQUNBLFlBQVEsS0FBUjtBQUNBLElBTkQ7QUFPQTs7QUFFRCxTQUFPLE1BQVA7QUFDQTtBQUNELENBeERELEVBd0RLLE1BeERMIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBIUyAqL1xyXG4oIGZ1bmN0aW9uKCAkICkge1xyXG5cdCQoIHdpbmRvdyApLm9uKCBcIllvYXN0U0VPOkNvbnRhY3RTdXBwb3J0XCIsIGZ1bmN0aW9uKCBlLCBkYXRhICkge1xyXG5cdFx0aWYoIGRhdGEudXNlZFF1ZXJpZXMgIT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0dmFyIGlkZW50aXR5ID0gSFMuYmVhY29uLmdldF9oZWxwc2NvdXRfYmVhY29uX2lkZW50aXR5KCk7XHJcblx0XHRcdGlkZW50aXR5WyBcIlVzZXIgc2VhcmNoZWQgZm9yXCIgXSA9IHVzZWRRdWVyaWVzV2l0aEhUTUwoIGRhdGEudXNlZFF1ZXJpZXMgKTtcclxuXHRcdFx0SFMuYmVhY29uLmlkZW50aWZ5KCBpZGVudGl0eSApO1xyXG5cdFx0fVxyXG5cdFx0SFMuYmVhY29uLm9wZW4oKTtcclxuXHR9ICk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZvcm1hdCB0aGUgc2VhcmNoIHF1ZXJpZXMgZG9uZSBieSB0aGUgdXNlciBpbiBIVE1MXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge2FycmF5fSB1c2VkUXVlcmllcyBMaXN0IG9mIHF1ZXJpZXMgZW50ZXJlZCBieSB0aGUgdXNlci5cclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIG91dHB1dC5cclxuXHQgKi9cclxuXHRmdW5jdGlvbiB1c2VkUXVlcmllc1dpdGhIVE1MKCB1c2VkUXVlcmllcyApIHtcclxuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0aWYgKCAkLmlzRW1wdHlPYmplY3QoIHVzZWRRdWVyaWVzICkgKSB7XHJcblx0XHRcdG91dHB1dCArPSBcIjxlbT5TZWFyY2ggaGlzdG9yeSBpcyBlbXB0eS48L2VtPlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0b3V0cHV0ICs9IFwiPHRhYmxlPjx0cj48dGg+U2VhcmNoZWQgZm9yPC90aD48dGg+T3BlbmVkIGFydGljbGU8L3RoPjwvdHI+XCI7XHJcblx0XHRcdCQuZWFjaCggdXNlZFF1ZXJpZXMsIGZ1bmN0aW9uKCBzZWFyY2hTdHJpbmcsIHBvc3RzICkge1xyXG5cdFx0XHRcdG91dHB1dCArPSBcIjx0cj48dGQ+XCIgKyBzZWFyY2hTdHJpbmcgKyBcIjwvdGQ+XCI7XHJcblx0XHRcdFx0b3V0cHV0ICs9IGdldFBvc3RzSFRNTCggcG9zdHMgKTtcclxuXHRcdFx0XHRvdXRwdXQgKz0gXCI8L3RyPlwiO1xyXG5cdFx0XHR9ICk7XHJcblx0XHRcdG91dHB1dCA9IG91dHB1dCArIFwiPC90YWJsZT5cIjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRm9ybWF0IHRoZSBwb3N0cyBsb29rZWQgYXQgYnkgdGhlIHVzZXIgaW4gSFRNTFxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHthcnJheX0gcG9zdHMgTGlzdCBvZiBwb3N0cyBvcGVuZWQgYnkgdGhlIHVzZXIuXHJcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGdlbmVyYXRlZCBvdXRwdXQuXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gZ2V0UG9zdHNIVE1MKCBwb3N0cyApIHtcclxuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0dmFyIGZpcnN0ID0gdHJ1ZTtcclxuXHRcdGlmICggJC5pc0VtcHR5T2JqZWN0KCBwb3N0cyApICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gXCI8dGQ+PGVtPk5vIGFydGljbGVzIHdlcmUgb3BlbmVkLjwvZW0+PC90ZD5cIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZWFjaCggcG9zdHMsIGZ1bmN0aW9uKCBwb3N0SWQsIHBvc3QgKSB7XHJcblx0XHRcdFx0aWYgKCBmaXJzdCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRvdXRwdXQgKz0gXCI8dGQ+PC90ZD5cIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b3V0cHV0ICs9IFwiPHRkPjxhIGhyZWY9J1wiICsgcG9zdC5saW5rICsgXCInPlwiICsgcG9zdC50aXRsZSArIFwiPC9hPjwvdGQ+XCI7XHJcblx0XHRcdFx0Zmlyc3QgPSBmYWxzZTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fVxyXG59ICkoIGpRdWVyeSApO1xyXG4iXX0=
