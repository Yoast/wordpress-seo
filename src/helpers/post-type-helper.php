<?php
/**
 * A helper object for post types.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WPSEO_Post_Type;

/**
 * Class Post_Type_Helper
 */
class Post_Type_Helper {

	/**
	 * Checks if the request post type is public and indexable.
	 *
	 * @param string $post_type_name The name of the post type to lookup.
	 *
	 * @return bool True when post type is set to index.
	 */
	public function is_indexable( $post_type_name ) {
		return WPSEO_Post_Type::is_post_type_indexable( $post_type_name );
	}

	/**
	 * Returns an array with the public post types.
	 *
	 * @return array Array with all the public post_types.
	 */
	public function get_public_post_types() {
		return \get_post_types( [ 'public' => true ] );
	}
}
