<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for redirects.
 */
class Redirect_Helper {

	/**
	 * Wraps wp_redirect to allow testing for redirects.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 * @param string $reason   The reason for the redirect.
	 */
	public function do_unsafe_redirect( $location, $status = 302, $reason = 'Yoast SEO' ) {
		// phpcs:ignore WordPress.Security.SafeRedirect -- intentional, function has been renamed to make unsafe more clear.
		\wp_redirect( $location, $status, $reason );
		exit;
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for safe redirects.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 * @param string $reason   The reason for the redirect.
	 */
	public function do_safe_redirect( $location, $status = 302, $reason = 'Yoast SEO' ) {
		\wp_safe_redirect( $location, $status, $reason );
		exit;
	}

	/**
	 * Wraps wp_redirect to allow testing for redirects.
	 *
	 * @deprecated 16.x
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 */
	public function do_redirect( $location, $status = 302 ) {
		\_deprecated_function( __METHOD__, 'WPSEO 16.x', 'Yoast\WP\SEO\Helpers\Redirect_Helper::do_unsafe_redirect' );

		$this->do_unsafe_redirect( $location, $status );
	}
}
