<?php
/**
 * A helper object for WordPress posts.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Current_Post_Helper
 */
class Redirect_Helper {

	/**
	 * Wraps wp_safe_redirect to allow testing for redirects.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	public function do_redirect( $location, $status = 302 ) {
		header( 'X-Redirect-By: Yoast SEO' );
		\wp_safe_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}
}
