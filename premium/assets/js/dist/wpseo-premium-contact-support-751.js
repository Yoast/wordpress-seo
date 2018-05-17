(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global HS */
(function ($) {
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

	$(window).on("YoastSEO:ContactSupport", function (e, data) {
		if (typeof data.usedQueries !== "undefined") {
			var identity = HS.beacon.get_helpscout_beacon_identity();
			identity["User searched for"] = usedQueriesWithHTML(data.usedQueries);
			HS.beacon.identify(identity);
		}
		HS.beacon.open();
	});
})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2NvbnRhY3Qtc3VwcG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxDQUFFLFVBQVUsQ0FBVixFQUFjO0FBQ2Y7Ozs7OztBQU1BLFVBQVMsWUFBVCxDQUF1QixLQUF2QixFQUErQjtBQUM5QixNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUksUUFBUSxJQUFaO0FBQ0EsTUFBSyxFQUFFLGFBQUYsQ0FBaUIsS0FBakIsQ0FBTCxFQUFnQztBQUMvQixhQUFVLDRDQUFWO0FBQ0EsR0FGRCxNQUVPO0FBQ04sS0FBRSxJQUFGLENBQVEsS0FBUixFQUFlLFVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF5QjtBQUN2QyxRQUFLLFVBQVUsS0FBZixFQUF1QjtBQUN0QixlQUFVLFdBQVY7QUFDQTtBQUNELGNBQVUsa0JBQWtCLEtBQUssSUFBdkIsR0FBOEIsSUFBOUIsR0FBcUMsS0FBSyxLQUExQyxHQUFrRCxXQUE1RDtBQUNBLFlBQVEsS0FBUjtBQUNBLElBTkQ7QUFPQTs7QUFFRCxTQUFPLE1BQVA7QUFDQTs7QUFFRDs7Ozs7O0FBTUEsVUFBUyxtQkFBVCxDQUE4QixXQUE5QixFQUE0QztBQUMzQyxNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUssRUFBRSxhQUFGLENBQWlCLFdBQWpCLENBQUwsRUFBc0M7QUFDckMsYUFBVSxtQ0FBVjtBQUNBLEdBRkQsTUFFTztBQUNOLGFBQVUsOERBQVY7QUFDQSxLQUFFLElBQUYsQ0FBUSxXQUFSLEVBQXFCLFVBQVUsWUFBVixFQUF3QixLQUF4QixFQUFnQztBQUNwRCxjQUFVLGFBQWEsWUFBYixHQUE0QixPQUF0QztBQUNBLGNBQVUsYUFBYyxLQUFkLENBQVY7QUFDQSxjQUFVLE9BQVY7QUFDQSxJQUpEO0FBS0EsWUFBUyxTQUFTLFVBQWxCO0FBQ0E7O0FBRUQsU0FBTyxNQUFQO0FBQ0E7O0FBR0QsR0FBRyxNQUFILEVBQVksRUFBWixDQUFnQix5QkFBaEIsRUFBMkMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFvQjtBQUM5RCxNQUFJLE9BQU8sS0FBSyxXQUFaLEtBQTRCLFdBQWhDLEVBQThDO0FBQzdDLE9BQUksV0FBVyxHQUFHLE1BQUgsQ0FBVSw2QkFBVixFQUFmO0FBQ0EsWUFBVSxtQkFBVixJQUFrQyxvQkFBcUIsS0FBSyxXQUExQixDQUFsQztBQUNBLE1BQUcsTUFBSCxDQUFVLFFBQVYsQ0FBb0IsUUFBcEI7QUFDQTtBQUNELEtBQUcsTUFBSCxDQUFVLElBQVY7QUFDQSxFQVBEO0FBUUEsQ0F6REQsRUF5REssTUF6REwiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIEhTICovXG4oIGZ1bmN0aW9uKCAkICkge1xuXHQvKipcblx0ICogRm9ybWF0IHRoZSBwb3N0cyBsb29rZWQgYXQgYnkgdGhlIHVzZXIgaW4gSFRNTFxuXHQgKlxuXHQgKiBAcGFyYW0ge2FycmF5fSBwb3N0cyBMaXN0IG9mIHBvc3RzIG9wZW5lZCBieSB0aGUgdXNlci5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGdlbmVyYXRlZCBvdXRwdXQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQb3N0c0hUTUwoIHBvc3RzICkge1xuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xuXHRcdHZhciBmaXJzdCA9IHRydWU7XG5cdFx0aWYgKCAkLmlzRW1wdHlPYmplY3QoIHBvc3RzICkgKSB7XG5cdFx0XHRvdXRwdXQgKz0gXCI8dGQ+PGVtPk5vIGFydGljbGVzIHdlcmUgb3BlbmVkLjwvZW0+PC90ZD5cIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JC5lYWNoKCBwb3N0cywgZnVuY3Rpb24oIHBvc3RJZCwgcG9zdCApIHtcblx0XHRcdFx0aWYgKCBmaXJzdCA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0b3V0cHV0ICs9IFwiPHRkPjwvdGQ+XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0cHV0ICs9IFwiPHRkPjxhIGhyZWY9J1wiICsgcG9zdC5saW5rICsgXCInPlwiICsgcG9zdC50aXRsZSArIFwiPC9hPjwvdGQ+XCI7XG5cdFx0XHRcdGZpcnN0ID0gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgdGhlIHNlYXJjaCBxdWVyaWVzIGRvbmUgYnkgdGhlIHVzZXIgaW4gSFRNTFxuXHQgKlxuXHQgKiBAcGFyYW0ge2FycmF5fSB1c2VkUXVlcmllcyBMaXN0IG9mIHF1ZXJpZXMgZW50ZXJlZCBieSB0aGUgdXNlci5cblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGdlbmVyYXRlZCBvdXRwdXQuXG5cdCAqL1xuXHRmdW5jdGlvbiB1c2VkUXVlcmllc1dpdGhIVE1MKCB1c2VkUXVlcmllcyApIHtcblx0XHR2YXIgb3V0cHV0ID0gXCJcIjtcblx0XHRpZiAoICQuaXNFbXB0eU9iamVjdCggdXNlZFF1ZXJpZXMgKSApIHtcblx0XHRcdG91dHB1dCArPSBcIjxlbT5TZWFyY2ggaGlzdG9yeSBpcyBlbXB0eS48L2VtPlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXRwdXQgKz0gXCI8dGFibGU+PHRyPjx0aD5TZWFyY2hlZCBmb3I8L3RoPjx0aD5PcGVuZWQgYXJ0aWNsZTwvdGg+PC90cj5cIjtcblx0XHRcdCQuZWFjaCggdXNlZFF1ZXJpZXMsIGZ1bmN0aW9uKCBzZWFyY2hTdHJpbmcsIHBvc3RzICkge1xuXHRcdFx0XHRvdXRwdXQgKz0gXCI8dHI+PHRkPlwiICsgc2VhcmNoU3RyaW5nICsgXCI8L3RkPlwiO1xuXHRcdFx0XHRvdXRwdXQgKz0gZ2V0UG9zdHNIVE1MKCBwb3N0cyApO1xuXHRcdFx0XHRvdXRwdXQgKz0gXCI8L3RyPlwiO1xuXHRcdFx0fSApO1xuXHRcdFx0b3V0cHV0ID0gb3V0cHV0ICsgXCI8L3RhYmxlPlwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXG5cdCQoIHdpbmRvdyApLm9uKCBcIllvYXN0U0VPOkNvbnRhY3RTdXBwb3J0XCIsIGZ1bmN0aW9uKCBlLCBkYXRhICkge1xuXHRcdGlmKCB0eXBlb2YgZGF0YS51c2VkUXVlcmllcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHZhciBpZGVudGl0eSA9IEhTLmJlYWNvbi5nZXRfaGVscHNjb3V0X2JlYWNvbl9pZGVudGl0eSgpO1xuXHRcdFx0aWRlbnRpdHlbIFwiVXNlciBzZWFyY2hlZCBmb3JcIiBdID0gdXNlZFF1ZXJpZXNXaXRoSFRNTCggZGF0YS51c2VkUXVlcmllcyApO1xuXHRcdFx0SFMuYmVhY29uLmlkZW50aWZ5KCBpZGVudGl0eSApO1xuXHRcdH1cblx0XHRIUy5iZWFjb24ub3BlbigpO1xuXHR9ICk7XG59ICkoIGpRdWVyeSApO1xuIl19
