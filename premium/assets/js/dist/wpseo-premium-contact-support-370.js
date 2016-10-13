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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2NvbnRhY3Qtc3VwcG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxDQUFFLFVBQVUsQ0FBVixFQUFjO0FBQ2YsR0FBRyxNQUFILEVBQVksRUFBWixDQUFnQix5QkFBaEIsRUFBMkMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFvQjtBQUM5RCxNQUFJLEtBQUssV0FBTCxLQUFxQixTQUF6QixFQUFxQztBQUNwQyxPQUFJLFdBQVcsR0FBRyxNQUFILENBQVUsNkJBQVYsRUFBZjtBQUNBLFlBQVUsbUJBQVYsSUFBa0Msb0JBQXFCLEtBQUssV0FBMUIsQ0FBbEM7QUFDQSxNQUFHLE1BQUgsQ0FBVSxRQUFWLENBQW9CLFFBQXBCO0FBQ0E7QUFDRCxLQUFHLE1BQUgsQ0FBVSxJQUFWO0FBQ0EsRUFQRDs7QUFTQTs7Ozs7O0FBTUEsVUFBUyxtQkFBVCxDQUE4QixXQUE5QixFQUE0QztBQUMzQyxNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUssRUFBRSxhQUFGLENBQWlCLFdBQWpCLENBQUwsRUFBc0M7QUFDckMsYUFBVSxtQ0FBVjtBQUNBLEdBRkQsTUFFTztBQUNOLGFBQVUsOERBQVY7QUFDQSxLQUFFLElBQUYsQ0FBUSxXQUFSLEVBQXFCLFVBQVUsWUFBVixFQUF3QixLQUF4QixFQUFnQztBQUNwRCxjQUFVLGFBQWEsWUFBYixHQUE0QixPQUF0QztBQUNBLGNBQVUsYUFBYyxLQUFkLENBQVY7QUFDQSxjQUFVLE9BQVY7QUFDQSxJQUpEO0FBS0EsWUFBUyxTQUFTLFVBQWxCO0FBQ0E7O0FBRUQsU0FBTyxNQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVMsWUFBVCxDQUF1QixLQUF2QixFQUErQjtBQUM5QixNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUksUUFBUSxJQUFaO0FBQ0EsTUFBSyxFQUFFLGFBQUYsQ0FBaUIsS0FBakIsQ0FBTCxFQUFnQztBQUMvQixhQUFVLDRDQUFWO0FBQ0EsR0FGRCxNQUVPO0FBQ04sS0FBRSxJQUFGLENBQVEsS0FBUixFQUFlLFVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF5QjtBQUN2QyxRQUFLLFVBQVUsS0FBZixFQUF1QjtBQUN0QixlQUFVLFdBQVY7QUFDQTtBQUNELGNBQVUsa0JBQWtCLEtBQUssSUFBdkIsR0FBOEIsSUFBOUIsR0FBcUMsS0FBSyxLQUExQyxHQUFrRCxXQUE1RDtBQUNBLFlBQVEsS0FBUjtBQUNBLElBTkQ7QUFPQTs7QUFFRCxTQUFPLE1BQVA7QUFDQTtBQUNELENBeERELEVBd0RLLE1BeERMIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBIUyAqL1xuKCBmdW5jdGlvbiggJCApIHtcblx0JCggd2luZG93ICkub24oIFwiWW9hc3RTRU86Q29udGFjdFN1cHBvcnRcIiwgZnVuY3Rpb24oIGUsIGRhdGEgKSB7XG5cdFx0aWYoIGRhdGEudXNlZFF1ZXJpZXMgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHZhciBpZGVudGl0eSA9IEhTLmJlYWNvbi5nZXRfaGVscHNjb3V0X2JlYWNvbl9pZGVudGl0eSgpO1xuXHRcdFx0aWRlbnRpdHlbIFwiVXNlciBzZWFyY2hlZCBmb3JcIiBdID0gdXNlZFF1ZXJpZXNXaXRoSFRNTCggZGF0YS51c2VkUXVlcmllcyApO1xuXHRcdFx0SFMuYmVhY29uLmlkZW50aWZ5KCBpZGVudGl0eSApO1xuXHRcdH1cblx0XHRIUy5iZWFjb24ub3BlbigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEZvcm1hdCB0aGUgc2VhcmNoIHF1ZXJpZXMgZG9uZSBieSB0aGUgdXNlciBpbiBIVE1MXG5cdCAqXG5cdCAqIEBwYXJhbSB7YXJyYXl9IHVzZWRRdWVyaWVzIExpc3Qgb2YgcXVlcmllcyBlbnRlcmVkIGJ5IHRoZSB1c2VyLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIG91dHB1dC5cblx0ICovXG5cdGZ1bmN0aW9uIHVzZWRRdWVyaWVzV2l0aEhUTUwoIHVzZWRRdWVyaWVzICkge1xuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xuXHRcdGlmICggJC5pc0VtcHR5T2JqZWN0KCB1c2VkUXVlcmllcyApICkge1xuXHRcdFx0b3V0cHV0ICs9IFwiPGVtPlNlYXJjaCBoaXN0b3J5IGlzIGVtcHR5LjwvZW0+XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dHB1dCArPSBcIjx0YWJsZT48dHI+PHRoPlNlYXJjaGVkIGZvcjwvdGg+PHRoPk9wZW5lZCBhcnRpY2xlPC90aD48L3RyPlwiO1xuXHRcdFx0JC5lYWNoKCB1c2VkUXVlcmllcywgZnVuY3Rpb24oIHNlYXJjaFN0cmluZywgcG9zdHMgKSB7XG5cdFx0XHRcdG91dHB1dCArPSBcIjx0cj48dGQ+XCIgKyBzZWFyY2hTdHJpbmcgKyBcIjwvdGQ+XCI7XG5cdFx0XHRcdG91dHB1dCArPSBnZXRQb3N0c0hUTUwoIHBvc3RzICk7XG5cdFx0XHRcdG91dHB1dCArPSBcIjwvdHI+XCI7XG5cdFx0XHR9ICk7XG5cdFx0XHRvdXRwdXQgPSBvdXRwdXQgKyBcIjwvdGFibGU+XCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXQgdGhlIHBvc3RzIGxvb2tlZCBhdCBieSB0aGUgdXNlciBpbiBIVE1MXG5cdCAqXG5cdCAqIEBwYXJhbSB7YXJyYXl9IHBvc3RzIExpc3Qgb2YgcG9zdHMgb3BlbmVkIGJ5IHRoZSB1c2VyLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIG91dHB1dC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFBvc3RzSFRNTCggcG9zdHMgKSB7XG5cdFx0dmFyIG91dHB1dCA9IFwiXCI7XG5cdFx0dmFyIGZpcnN0ID0gdHJ1ZTtcblx0XHRpZiAoICQuaXNFbXB0eU9iamVjdCggcG9zdHMgKSApIHtcblx0XHRcdG91dHB1dCArPSBcIjx0ZD48ZW0+Tm8gYXJ0aWNsZXMgd2VyZSBvcGVuZWQuPC9lbT48L3RkPlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkLmVhY2goIHBvc3RzLCBmdW5jdGlvbiggcG9zdElkLCBwb3N0ICkge1xuXHRcdFx0XHRpZiAoIGZpcnN0ID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRvdXRwdXQgKz0gXCI8dGQ+PC90ZD5cIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRwdXQgKz0gXCI8dGQ+PGEgaHJlZj0nXCIgKyBwb3N0LmxpbmsgKyBcIic+XCIgKyBwb3N0LnRpdGxlICsgXCI8L2E+PC90ZD5cIjtcblx0XHRcdFx0Zmlyc3QgPSBmYWxzZTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG59ICkoIGpRdWVyeSApO1xuIl19
