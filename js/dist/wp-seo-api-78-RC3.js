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
			/*
    * If no data was passed along use the third argument as the success callback
    * and the fourth argument as the error callback.
    */
			if ($.isFunction(data) && typeof error === "undefined") {
				error = success;
				success = data;
				data = {};
			}

			// If this is no GET or POST request then use API's method override for maximum compatibility.
			if (method !== "POST" && method !== "GET") {
				data["_method"] = method;
				method = "POST";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUUsV0FBVSxDQUFWLEVBQWEsYUFBYixFQUE2QjtBQUM5QixRQUFPLFFBQVAsR0FBa0I7QUFDakI7Ozs7Ozs7Ozs7QUFVQSxPQUFLLGFBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixPQUF2QixFQUFnQyxLQUFoQyxFQUF3QztBQUM1QyxRQUFLLE9BQUwsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLEVBQWtDLE9BQWxDLEVBQTJDLEtBQTNDO0FBQ0EsR0FiZ0I7O0FBZWpCOzs7Ozs7Ozs7O0FBVUEsUUFBTSxjQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDN0MsUUFBSyxPQUFMLENBQWMsTUFBZCxFQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUE0QyxLQUE1QztBQUNBLEdBM0JnQjs7QUE2QmpCOzs7Ozs7Ozs7O0FBVUEsT0FBSyxhQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDNUMsUUFBSyxPQUFMLENBQWMsS0FBZCxFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQyxPQUFsQyxFQUEyQyxLQUEzQztBQUNBLEdBekNnQjs7QUEyQ2pCOzs7Ozs7Ozs7O0FBVUEsU0FBTyxlQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDOUMsUUFBSyxPQUFMLENBQWMsT0FBZCxFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQyxPQUFwQyxFQUE2QyxLQUE3QztBQUNBLEdBdkRnQjs7QUF5RGpCOzs7Ozs7Ozs7O0FBVUEsVUFBUSxpQkFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLE9BQXZCLEVBQWdDLEtBQWhDLEVBQXdDO0FBQy9DLFFBQUssT0FBTCxDQUFjLFFBQWQsRUFBd0IsS0FBeEIsRUFBK0IsSUFBL0IsRUFBcUMsT0FBckMsRUFBOEMsS0FBOUM7QUFDQSxHQXJFZ0I7O0FBdUVqQjs7Ozs7Ozs7Ozs7QUFXQSxXQUFTLGlCQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUIsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0MsS0FBeEMsRUFBZ0Q7QUFDeEQ7Ozs7QUFJQSxPQUFLLEVBQUUsVUFBRixDQUFjLElBQWQsS0FBd0IsT0FBTyxLQUFQLEtBQWlCLFdBQTlDLEVBQTREO0FBQzNELFlBQVUsT0FBVjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQVUsRUFBVjtBQUNBOztBQUVEO0FBQ0EsT0FBSyxXQUFXLE1BQVgsSUFBcUIsV0FBVyxLQUFyQyxFQUE2QztBQUM1QyxTQUFLLFNBQUwsSUFBa0IsTUFBbEI7QUFDQSxhQUFTLE1BQVQ7QUFDQTs7QUFFRCxLQUFFLElBQUYsQ0FBUTtBQUNQLFNBQUssY0FBYyxJQUFkLEdBQXFCLFdBQXJCLEdBQW1DLEtBRGpDO0FBRVAsWUFBUSxNQUZEO0FBR1AsZ0JBQVksb0JBQVUsR0FBVixFQUFnQjtBQUMzQixTQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLGNBQWMsS0FBbEQ7QUFDQSxLQUxNO0FBTVAsVUFBTTtBQU5DLElBQVIsRUFPSSxJQVBKLENBT1UsT0FQVixFQU9vQixJQVBwQixDQU8wQixLQVAxQjtBQVFBO0FBM0dnQixFQUFsQjtBQTZHQSxDQTlHQyxFQThHQyxNQTlHRCxFQThHUyxhQTlHVCxDQUFGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBqUXVlcnksIHdwQXBpU2V0dGluZ3MgKi9cblxuKCBmdW5jdGlvbiggJCwgd3BBcGlTZXR0aW5ncyApIHtcblx0d2luZG93Lndwc2VvQXBpID0ge1xuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgR0VUIHJlcXVlc3QgdG8gdGhlIFlvYXN0IFJFU1QgQXBpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgcm91dGUgICAgIFRoZSBlbmRwb2ludCB0byBxdWVyeS5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBbZGF0YV0gICAgVGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgZW5kcG9pbnQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW3N1Y2Nlc3NdIFRoZSBzdWNjZXNzIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHNlY29uZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gICBUaGUgZXJyb3IgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgdGhpcmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdGdldDogZnVuY3Rpb24oIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApIHtcblx0XHRcdHRoaXMucmVxdWVzdCggXCJHRVRcIiwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBZb2FzdCBSRVNUIEFwaS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHJvdXRlICAgICBUaGUgZW5kcG9pbnQgdG8gcXVlcnkuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgW2RhdGFdICAgIFRoZSBkYXRhIHRvIHNlbmQgdG8gdGhlIGVuZHBvaW50LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzdWNjZXNzXSBUaGUgc3VjY2VzcyBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdICAgVGhlIGVycm9yIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHRoaXJkIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHRwb3N0OiBmdW5jdGlvbiggcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICkge1xuXHRcdFx0dGhpcy5yZXF1ZXN0KCBcIlBPU1RcIiwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgUFVUIHJlcXVlc3QgdG8gdGhlIFlvYXN0IFJFU1QgQXBpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgcm91dGUgICAgIFRoZSBlbmRwb2ludCB0byBxdWVyeS5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBbZGF0YV0gICAgVGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgZW5kcG9pbnQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW3N1Y2Nlc3NdIFRoZSBzdWNjZXNzIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHNlY29uZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gICBUaGUgZXJyb3IgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgdGhpcmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdHB1dDogZnVuY3Rpb24oIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApIHtcblx0XHRcdHRoaXMucmVxdWVzdCggXCJQVVRcIiwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgUEFUQ0ggcmVxdWVzdCB0byB0aGUgWW9hc3QgUkVTVCBBcGkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICByb3V0ZSAgICAgVGhlIGVuZHBvaW50IHRvIHF1ZXJ5LlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSAgIFtkYXRhXSAgICBUaGUgZGF0YSB0byBzZW5kIHRvIHRoZSBlbmRwb2ludC5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbc3VjY2Vzc10gVGhlIHN1Y2Nlc3MgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgc2Vjb25kIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW2Vycm9yXSAgIFRoZSBlcnJvciBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyB0aGlyZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3ZvaWR9XG5cdFx0ICovXG5cdFx0cGF0Y2g6IGZ1bmN0aW9uKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoIFwiUEFUQ0hcIiwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgREVMRVRFIHJlcXVlc3QgdG8gdGhlIFlvYXN0IFJFU1QgQXBpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9ICAgcm91dGUgICAgIFRoZSBlbmRwb2ludCB0byBxdWVyeS5cblx0XHQgKiBAcGFyYW0ge09iamVjdH0gICBbZGF0YV0gICAgVGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgZW5kcG9pbnQuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW3N1Y2Nlc3NdIFRoZSBzdWNjZXNzIGNhbGxiYWNrLCBjYW4gYmUgcGFzc2VkIGFzIHNlY29uZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gICBUaGUgZXJyb3IgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgdGhpcmQgYXJndW1lbnQgaWYgbm8gZGF0YSBpcyBwcm92aWRlZC5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHt2b2lkfVxuXHRcdCAqL1xuXHRcdGRlbGV0ZTogZnVuY3Rpb24oIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApIHtcblx0XHRcdHRoaXMucmVxdWVzdCggXCJERUxFVEVcIiwgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFBlcmZvcm1zIGEgcmVxdWVzdCB0byB0aGUgWW9hc3QgUkVTVCBBcGkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gICBtZXRob2QgICAgVGhlIHJlcXVlc3QgbWV0aG9kLlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHJvdXRlICAgICBUaGUgZW5kcG9pbnQgdG8gcXVlcnkuXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9ICAgW2RhdGFdICAgIFRoZSBkYXRhIHRvIHNlbmQgdG8gdGhlIGVuZHBvaW50LlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzdWNjZXNzXSBUaGUgc3VjY2VzcyBjYWxsYmFjaywgY2FuIGJlIHBhc3NlZCBhcyB0aGlyZCBhcmd1bWVudCBpZiBubyBkYXRhIGlzIHByb3ZpZGVkLlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gICBUaGUgZXJyb3IgY2FsbGJhY2ssIGNhbiBiZSBwYXNzZWQgYXMgZm91cnRoIGFyZ3VtZW50IGlmIG5vIGRhdGEgaXMgcHJvdmlkZWQuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7dm9pZH1cblx0XHQgKi9cblx0XHRyZXF1ZXN0OiBmdW5jdGlvbiggbWV0aG9kLCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHQvKlxuXHRcdFx0ICogSWYgbm8gZGF0YSB3YXMgcGFzc2VkIGFsb25nIHVzZSB0aGUgdGhpcmQgYXJndW1lbnQgYXMgdGhlIHN1Y2Nlc3MgY2FsbGJhY2tcblx0XHRcdCAqIGFuZCB0aGUgZm91cnRoIGFyZ3VtZW50IGFzIHRoZSBlcnJvciBjYWxsYmFjay5cblx0XHRcdCAqL1xuXHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oIGRhdGEgKSAmJiB0eXBlb2YgZXJyb3IgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdGVycm9yICAgPSBzdWNjZXNzO1xuXHRcdFx0XHRzdWNjZXNzID0gZGF0YTtcblx0XHRcdFx0ZGF0YSAgICA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGlzIGlzIG5vIEdFVCBvciBQT1NUIHJlcXVlc3QgdGhlbiB1c2UgQVBJJ3MgbWV0aG9kIG92ZXJyaWRlIGZvciBtYXhpbXVtIGNvbXBhdGliaWxpdHkuXG5cdFx0XHRpZiAoIG1ldGhvZCAhPT0gXCJQT1NUXCIgJiYgbWV0aG9kICE9PSBcIkdFVFwiICkge1xuXHRcdFx0XHRkYXRhW1wiX21ldGhvZFwiXSA9IG1ldGhvZDtcblx0XHRcdFx0bWV0aG9kID0gXCJQT1NUXCI7XG5cdFx0XHR9XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdwQXBpU2V0dGluZ3Mucm9vdCArIFwieW9hc3QvdjEvXCIgKyByb3V0ZSxcblx0XHRcdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB3cEFwaVNldHRpbmdzLm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHR9ICkuZG9uZSggc3VjY2VzcyApLmZhaWwoIGVycm9yICk7XG5cdFx0fSxcblx0fTtcbn0oIGpRdWVyeSwgd3BBcGlTZXR0aW5ncyApICk7XG4iXX0=
