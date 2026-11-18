<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Post_Type_Sitemap_Provider;

/**
 * Test Helper Class.
 */
final class Post_Type_Sitemap_Provider_Double extends WPSEO_Post_Type_Sitemap_Provider {

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

	/**
	 * Produces set of links to prepend at start of first sitemap page.
	 *
	 * @param string $post_type Post type to produce links for.
	 *
	 * @return array<array<string>> Array of link data.
	 */
	public function get_first_links( $post_type ) {
		return parent::get_first_links( $post_type );
	}
}
