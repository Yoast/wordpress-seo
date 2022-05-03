<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Adds customizations to the front end for the primary category.
 *
 * @deprecated 14.0
 */
class WPSEO_Frontend_Primary_Category implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks necessary for correct primary category behaviour.
	 */
	public function register_hooks() {
		add_filter( 'post_link_category', [ $this, 'post_link_category' ], 10, 3 );
	}

	/**
	 * Filters post_link_category to change the category to the chosen category by the user.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param stdClass     $category   The category that is now used for the post link.
	 * @param array|null   $categories This parameter is not used.
	 * @param WP_Post|null $post       The post in question.
	 *
	 * @return array|object|WP_Error|null The category we want to use for the post link.
	 */
	public function post_link_category( $category, $categories = null, $post = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $category;
	}
}
