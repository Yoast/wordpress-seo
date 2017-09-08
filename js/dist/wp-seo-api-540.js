(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global jQuery, wpApiSettings */

(function ($, wpApiSettings) {
	window.wpseoApi = {
		/**
   * Performs a GET request to the Yoast REST Api.
   *
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
   *
   * @returns {void}
   */
		get: function get(route, data, success, error) {
			this.request("GET", route, data, success, error);
		},

		/**
   * Performs a POST request to the Yoast REST Api.
   *
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
   *
   * @returns {void}
   */
		post: function post(route, data, success, error) {
			this.request("POST", route, data, success, error);
		},

		/**
   * Performs a PUT request to the Yoast REST Api.
   *
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
   *
   * @returns {void}
   */
		put: function put(route, data, success, error) {
			this.request("PUT", route, data, success, error);
		},

		/**
   * Performs a PATCH request to the Yoast REST Api.
   *
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
   *
   * @returns {void}
   */
		patch: function patch(route, data, success, error) {
			this.request("PATCH", route, data, success, error);
		},

		/**
   * Performs a DELETE request to the Yoast REST Api.
   *
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
   *
   * @returns {void}
   */
		delete: function _delete(route, data, success, error) {
			this.request("DELETE", route, data, success, error);
		},

		/**
   * Performs a request to the Yoast REST Api.
   *
   * @param {string}   method    The request method.
   * @param {string}   route     The endpoint to query.
   * @param {Object}   [data]    The data to send to the endpoint.
   * @param {function} [success] The success callback, can be passed as third argument if no data is provided.
   * @param {function} [error]   The error callback, can be passed as fourth argument if no data is provided.
   *
   * @returns {void}
   */
		request: function request(method, route, data, success, error) {
			// If no data was passed along use the third argument as the success callback
			// and the fourth argument as the error callback.
			if ($.isFunction(data) && typeof error === "undefined") {
				error = success;
				success = data;
				data = {};
			}

			$.ajax({
				url: wpApiSettings.root + "yoast/v1/" + route,
				method: method,
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader("X-WP-Nonce", wpApiSettings.nonce);
				},
				data: data
			}).done(success).fail(error);
		}
	};
})(jQuery, wpApiSettings);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUUsV0FBVSxDQUFWLEVBQWEsYUFBYixFQUE2QjtBQUM5QixRQUFPLFFBQVAsR0FBa0I7QUFDakI7Ozs7Ozs7Ozs7QUFVQSxPQUFLLGFBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixPQUF2QixFQUFnQyxLQUFoQyxFQUF3QztBQUM1QyxRQUFLLE9BQUwsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLEVBQWtDLE9BQWxDLEVBQTJDLEtBQTNDO0FBQ0EsR0FiZ0I7O0FBZWpCOzs7Ozs7Ozs7O0FBVUEsUUFBTSxjQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDN0MsUUFBSyxPQUFMLENBQWMsTUFBZCxFQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUE0QyxLQUE1QztBQUNBLEdBM0JnQjs7QUE2QmpCOzs7Ozs7Ozs7O0FBVUEsT0FBSyxhQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDNUMsUUFBSyxPQUFMLENBQWMsS0FBZCxFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQyxPQUFsQyxFQUEyQyxLQUEzQztBQUNBLEdBekNnQjs7QUEyQ2pCOzs7Ozs7Ozs7O0FBVUEsU0FBTyxlQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDOUMsUUFBSyxPQUFMLENBQWMsT0FBZCxFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQyxPQUFwQyxFQUE2QyxLQUE3QztBQUNBLEdBdkRnQjs7QUF5RGpCOzs7Ozs7Ozs7O0FBVUEsVUFBUSxpQkFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLE9BQXZCLEVBQWdDLEtBQWhDLEVBQXdDO0FBQy9DLFFBQUssT0FBTCxDQUFjLFFBQWQsRUFBd0IsS0FBeEIsRUFBK0IsSUFBL0IsRUFBcUMsT0FBckMsRUFBOEMsS0FBOUM7QUFDQSxHQXJFZ0I7O0FBdUVqQjs7Ozs7Ozs7Ozs7QUFXQSxXQUFTLGlCQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUIsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0MsS0FBeEMsRUFBZ0Q7QUFDeEQ7QUFDQTtBQUNBLE9BQUssRUFBRSxVQUFGLENBQWMsSUFBZCxLQUF3QixPQUFPLEtBQVAsS0FBaUIsV0FBOUMsRUFBNEQ7QUFDM0QsWUFBVSxPQUFWO0FBQ0EsY0FBVSxJQUFWO0FBQ0EsV0FBVSxFQUFWO0FBQ0E7O0FBRUQsS0FBRSxJQUFGLENBQVE7QUFDUCxTQUFLLGNBQWMsSUFBZCxHQUFxQixXQUFyQixHQUFtQyxLQURqQztBQUVQLFlBQVEsTUFGRDtBQUdQLGdCQUFZLG9CQUFVLEdBQVYsRUFBZ0I7QUFDM0IsU0FBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxjQUFjLEtBQWxEO0FBQ0EsS0FMTTtBQU1QLFVBQU07QUFOQyxJQUFSLEVBT0ksSUFQSixDQU9VLE9BUFYsRUFPb0IsSUFQcEIsQ0FPMEIsS0FQMUI7QUFRQTtBQW5HZ0IsRUFBbEI7QUFxR0EsQ0F0R0MsRUFzR0MsTUF0R0QsRUFzR1MsYUF0R1QsQ0FBRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgalF1ZXJ5LCB3cEFwaVNldHRpbmdzICovXG5cbiggZnVuY3Rpb24oICQsIHdwQXBpU2V0dGluZ3MgKSB7XG5cdHdpbmRvdy53cHNlb0FwaSA9IHtcblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIEdFVCByZXF1ZXN0IHRvIHRoZSBZb2FzdCBSRVNUIEFwaS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHJvdXRlICAgICBUaGUgZW5kcG9pbnQgdG8gcXVlcnkuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgW2RhdGFdICAgIFRoZSBkYXRhIHRvIHNlbmQgdG8gdGhlIGVuZHBvaW50LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzdWNjZXNzXSBUaGUgc3VjY2VzcyBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdICAgVGhlIGVycm9yIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHRoaXJkIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHRnZXQ6IGZ1bmN0aW9uKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoIFwiR0VUXCIsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIFBPU1QgcmVxdWVzdCB0byB0aGUgWW9hc3QgUkVTVCBBcGkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICByb3V0ZSAgICAgVGhlIGVuZHBvaW50IHRvIHF1ZXJ5LlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSAgIFtkYXRhXSAgICBUaGUgZGF0YSB0byBzZW5kIHRvIHRoZSBlbmRwb2ludC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbc3VjY2Vzc10gVGhlIHN1Y2Nlc3MgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgc2Vjb25kIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW2Vycm9yXSAgIFRoZSBlcnJvciBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyB0aGlyZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0cG9zdDogZnVuY3Rpb24oIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApIHtcblx0XHRcdHRoaXMucmVxdWVzdCggXCJQT1NUXCIsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIFBVVCByZXF1ZXN0IHRvIHRoZSBZb2FzdCBSRVNUIEFwaS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHJvdXRlICAgICBUaGUgZW5kcG9pbnQgdG8gcXVlcnkuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgW2RhdGFdICAgIFRoZSBkYXRhIHRvIHNlbmQgdG8gdGhlIGVuZHBvaW50LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzdWNjZXNzXSBUaGUgc3VjY2VzcyBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdICAgVGhlIGVycm9yIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHRoaXJkIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHRwdXQ6IGZ1bmN0aW9uKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoIFwiUFVUXCIsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIFBBVENIIHJlcXVlc3QgdG8gdGhlIFlvYXN0IFJFU1QgQXBpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgcm91dGUgICAgIFRoZSBlbmRwb2ludCB0byBxdWVyeS5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBbZGF0YV0gICAgVGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgZW5kcG9pbnQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW3N1Y2Nlc3NdIFRoZSBzdWNjZXNzIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHNlY29uZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gICBUaGUgZXJyb3IgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgdGhpcmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHBhdGNoOiBmdW5jdGlvbiggcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICkge1xuXHRcdFx0dGhpcy5yZXF1ZXN0KCBcIlBBVENIXCIsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIERFTEVURSByZXF1ZXN0IHRvIHRoZSBZb2FzdCBSRVNUIEFwaS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHJvdXRlICAgICBUaGUgZW5kcG9pbnQgdG8gcXVlcnkuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgW2RhdGFdICAgIFRoZSBkYXRhIHRvIHNlbmQgdG8gdGhlIGVuZHBvaW50LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzdWNjZXNzXSBUaGUgc3VjY2VzcyBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdICAgVGhlIGVycm9yIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHRoaXJkIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHRkZWxldGU6IGZ1bmN0aW9uKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoIFwiREVMRVRFXCIsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQZXJmb3JtcyBhIHJlcXVlc3QgdG8gdGhlIFlvYXN0IFJFU1QgQXBpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgbWV0aG9kICAgIFRoZSByZXF1ZXN0IG1ldGhvZC5cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICByb3V0ZSAgICAgVGhlIGVuZHBvaW50IHRvIHF1ZXJ5LlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSAgIFtkYXRhXSAgICBUaGUgZGF0YSB0byBzZW5kIHRvIHRoZSBlbmRwb2ludC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbc3VjY2Vzc10gVGhlIHN1Y2Nlc3MgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgdGhpcmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdICAgVGhlIGVycm9yIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIGZvdXJ0aCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0cmVxdWVzdDogZnVuY3Rpb24oIG1ldGhvZCwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICkge1xuXHRcdFx0Ly8gSWYgbm8gZGF0YSB3YXMgcGFzc2VkIGFsb25nIHVzZSB0aGUgdGhpcmQgYXJndW1lbnQgYXMgdGhlIHN1Y2Nlc3MgY2FsbGJhY2tcblx0XHRcdC8vIGFuZCB0aGUgZm91cnRoIGFyZ3VtZW50IGFzIHRoZSBlcnJvciBjYWxsYmFjay5cblx0XHRcdGlmICggJC5pc0Z1bmN0aW9uKCBkYXRhICkgJiYgdHlwZW9mIGVycm9yID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRlcnJvciAgID0gc3VjY2Vzcztcblx0XHRcdFx0c3VjY2VzcyA9IGRhdGE7XG5cdFx0XHRcdGRhdGEgICAgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd3BBcGlTZXR0aW5ncy5yb290ICsgXCJ5b2FzdC92MS9cIiArIHJvdXRlLFxuXHRcdFx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHdwQXBpU2V0dGluZ3Mubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdH0gKS5kb25lKCBzdWNjZXNzICkuZmFpbCggZXJyb3IgKTtcblx0XHR9LFxuXHR9O1xufSggalF1ZXJ5LCB3cEFwaVNldHRpbmdzICkgKTtcbiJdfQ==
