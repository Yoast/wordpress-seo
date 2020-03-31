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
		add_filter( 'post_link_category', array( $this, 'post_link_category' ), 10, 3 );
	}

	/**
	 * Filters post_link_category to change the category to the chosen category by the user.
	 *
	 * @param stdClass $category   The category that is now used for the post link.
	 * @param array    $categories This parameter is not used.
	 * @param WP_Post  $post       The post in question.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array|null|object|WP_Error The category we want to use for the post link.
	 */
	public function post_link_category( $category, $categories = null, $post = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $category;
	}
}
