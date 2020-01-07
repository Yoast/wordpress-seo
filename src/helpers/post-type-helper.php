<?php
/**
 * A helper object for post types.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Post_Type;

/**
 * Class Post_Type_Helper
 */
class Post_Type_Helper {

	/**
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Taxonomy_Helper constructor.
	 *
	 * @param String_Helper $string The string helper.
	 */
	public function __construct( String_Helper $string ) {
		$this->string = $string;
	}

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
	 * @param int $post_id Post ID.
	 *
	 * @return string Post excerpt (without tags).
	 */
	public function get_the_excerpt( $post_id ) {
		return $this->string->strip_all_tags( \get_the_excerpt( $post_id ) );
	}

	/**
	 * Retrieves the post type of the current post.
	 *
	 * @param WP_Post $post The post.
	 *
	 * @return string|false          Post type on success, false on failure.
	 */
	public function get_post_type( $post = null ) {
		return \get_post_type( $post );
	}
}
