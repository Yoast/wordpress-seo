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
	 */
	public function do_redirect( $location, $status = 302 ) {
		\wp_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for safe redirects.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 */
	public function do_safe_redirect( $location, $status = 302 ) {
		\wp_safe_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}
}
