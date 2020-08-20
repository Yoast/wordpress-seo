<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Post_Type_Sitemap_Provider_Double extends WPSEO_Post_Type_Sitemap_Provider {

	/**
	 * Produce array of URL parts for given post object.
	 *
	 * @param object $post Post object to get URL parts for.
	 *
	 * @return array|bool
	 */
	public function get_url( $post ) {
		return parent::get_url( $post );
	}

	/**
	 * Retrieves a list with the excluded post ids.
	 *
	 * @param string $post_type Post type.
	 *
	 * @return array Array with post ids to exclude.
	 */
	public function get_excluded_posts( $post_type ) {
		return parent::get_excluded_posts( $post_type );
	}
}
