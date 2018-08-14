yoastWebpackJsonp([25],{

/***/ 1938:
/***/ (function(module, exports, __webpack_require__) {

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

/***/ })

},[1938]);