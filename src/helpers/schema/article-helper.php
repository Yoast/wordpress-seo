<?php

namespace Yoast\WP\SEO\Helpers\Schema;

/**
 * Class Article_Helper.
 */
class Article_Helper {

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @param string|null $post_type Post type to check.
	 *
	 * @return bool True if it has Article schema, false if not.
	 */
	public function is_article_post_type( $post_type = null ) {
		if ( \is_null( $post_type ) ) {
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

	/**
	 * Checks whether author is supported for the passed object sub type.
	 *
	 * @param string $object_sub_type The sub type of the object to check author support for.
	 *
	 * @return bool True if author is supported for the passed object sub type.
	 */
	public function is_author_supported( $object_sub_type ) {
		return \post_type_supports( $object_sub_type, 'author' );
	}
}
