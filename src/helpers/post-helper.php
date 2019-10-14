<?php
/**
 * A helper object for the post.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Post_Helper
 */
class Post_Helper {

	/**
	 * Retrieves post data given a post ID or post object.
	 *
	 * @param int|WP_Post|null $post   Optional. Post ID or post object. Defaults to global $post.
	 *
	 * @return WP_Post|array|null Type corresponding to $output on success or null on failure.
	 */
	public function get_post( $post ) {
		return \get_post( $post );
	}
}
