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

},{}]},{},[1]);
