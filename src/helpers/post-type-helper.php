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

	/**
	 * Removes all shortcode tags from the given content.
	 *
	 * @param string $content Content to remove all the shortcode tags from.
	 *
	 * @return string Content without shortcode tags.
	 */
	public function strip_shortcodes( $content ) {
		return \strip_shortcodes( $content );
	}

	/**
	 * Retrieves the post excerpt (without tags).
	 *
	 * @param int|\WP_Post $post Optional. Post ID or WP_Post object. Default is global $post.
	 *
	 * @return string Post excerpt (without tags).
	 */
	public function get_the_excerpt( $post = null ) {
		return \wp_strip_all_tags( (string) \get_the_excerpt( $post ) );
	}
}
