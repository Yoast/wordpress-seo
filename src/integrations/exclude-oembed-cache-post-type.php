<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;

/**
 * Exclude certain Elementor-specific post types from the indexable table.
 *
 * Posts with these post types will not be saved to the indexable table.
 */
class Exclude_Oembed_Cache_Post_Type implements Integration_Interface {

	/**
	 * Initializes the integration.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'exclude_oembed_cache_post_type' ] );
	}

	/**
	 * This integration is only active when the database migrations have been run.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Exclude the oembed_cache post type from the indexable table.
	 *
	 * @param array $excluded_post_types The excluded post types.
	 *
	 * @return array The excluded post types, including the oembed_cache post types.
	 */
	public function exclude_oembed_cache_post_type( $excluded_post_types ) {
		$excluded_post_types[] = 'oembed_cache';

		return $excluded_post_types;
	}
}
