<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Helpers\Schema
 */

namespace Yoast\WP\SEO\Helpers\Schema;

/**
 * Class Article_Helper
 *
 * @package Yoast\WP\SEO\Helpers
 */
class Article_Helper {

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @param string $post_type Post type to check.
	 *
	 * @return bool True if it has article schema, false if not.
	 */
	public function is_article_post_type( $post_type = null ) {
		if ( is_null( $post_type ) ) {
			$post_type = \get_post_type();
		}

		/**
		 * Filter: 'wpseo_schema_article_post_types' - Allow changing for which post types we output Article schema.
		 *
		 * @api string[] $post_types The post types for which we output Article.
		 */
		$post_types = \apply_filters( 'wpseo_schema_article_post_types', [ 'post' ] );

		return \in_array( $post_type, $post_types, true );
	}
}
