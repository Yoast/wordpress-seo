/* global jQuery, wpApiSettings */

( function ( $, wpApiSettings ) {
	let wpseoApi = {
		/**
		 * Performs a GET request to the Yoast REST Api.
		 *
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
		 */
		get: function ( route, data, success, error ) {
			this.request( 'GET', route, data, success, error );
		},

		/**
		 * Performs a POST request to the Yoast REST Api.
		 *
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
		 */
		post: function ( route, data, success, error ) {
			this.request( 'POST', route, data, success, error );
		},

		/**
		 * Performs a PUT request to the Yoast REST Api.
		 *
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
		 */
		put: function ( route, data, success, error ) {
			this.request( 'PUT', route, data, success, error );
		},

		/**
		 * Performs a PATCH request to the Yoast REST Api.
		 *
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
		 */
		patch: function ( route, data, success, error ) {
			this.request( 'PATCH', route, data, success, error );
		},

		/**
		 * Performs a DELETE request to the Yoast REST Api.
		 *
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as second argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as third argument if no data is provided.
		 */
		delete: function ( route, data, success, error ) {
			this.request( 'DELETE', route, data, success, error );
		},

		/**
		 * Performs a request to the Yoast REST Api.
		 *
		 * @param {string}   method    The request method.
		 * @param {string}   route     The endpoint to query.
		 * @param {string}   [data]    The data to send to the endpoint.
		 * @param {function} [success] The success callback, can be passed as third argument if no data is provided.
		 * @param {function} [error]   The error callback, can be passed as fourth argument if no data is provided.
		 */
		request: function ( method, route, data, success, error ) {
			// If no data was passed along use the third argument as the success callback
			// and the fourth argument as the error callback.
			if ( $.isFunction( data ) && error === undefined ) {
				error   = success;
				success = data;
				data    = undefined;
			}

			$.ajax( {
				url: wpApiSettings.root + 'yoast/v1/' + route,
				method: method,
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
				},
				data: data,
			} ).done( success ).fail( error );
		}
	};

	window.wpseoApi = wpseoApi;
} )( jQuery, wpApiSettings );
