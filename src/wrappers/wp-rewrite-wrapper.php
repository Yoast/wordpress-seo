<?php
/**
 * Wrapper for WP_Rewrite.
 *
 * @package Yoast\YoastSEO\Wrappers
 */

namespace Yoast\WP\SEO\Wrappers;

use WP_Rewrite;

/**
 * Class WP_Rewrite_Wrapper
 */
class WP_Rewrite_Wrapper {

	/**
	 * Returns the global WP_Rewrite_Wrapper object.
	 *
	 * @return WP_Rewrite The WP_Query object.
	 */
	public function get() {
		return $GLOBALS['wp_rewrite'];
	}
}
