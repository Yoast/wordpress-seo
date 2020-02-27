<?php
/**
 * A helper object for redirects.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Redirect_Helper
 */
class Redirect_Helper {

	/**
	 * Wraps wp_redirect to allow testing for redirects.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 */
	public function do_redirect( $location, $status = 302 ) {
		\wp_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for safe redirects.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   The status code to use.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 */
	public function do_safe_redirect( $location, $status = 302 ) {
		\wp_safe_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}
}
