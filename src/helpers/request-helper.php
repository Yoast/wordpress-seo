<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the request state.
 */
class Request_Helper {

	/**
	 * Checks if the current request is a REST request.
	 *
	 * @return bool True when the current request is a REST request.
	 */
	public function is_rest_request() {
		return \defined( 'REST_REQUEST' ) && \REST_REQUEST === true;
	}

	/**
	 * Returns a variable from the PHP superglobal query string, or `null` if
	 * it does not exist or is not a string.
	 *
	 * @param string $variable_name The name of the query variable.
	 *
	 * @return string|null The value of the query variable.
	 */
	public function get_variable_from_query_string( $variable_name ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( isset( $_GET[ $variable_name ] ) && \is_string( $_GET[ $variable_name ] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
			return \sanitize_text_field( \wp_unslash( $_GET[ $variable_name ] ) );
		}
		return null;
	}
}
