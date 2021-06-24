<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;

/**
 * Exclude certain oEmbed Cache-specific post types from the indexable table.
 *
 * Posts with these post types will not be saved to the indexable table.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Exclude_Oembed_Cache_Post_Type extends Exclude_Post_Type {

	/**
	 * This integration is only active when the database migrations have been run.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Returns the name of the post type to be excluded.
	 * To be used in the wpseo_indexable_excluded_post_types filter.
	 *
	 * @return string the name of the post type.
	 */
	public function get_post_type() {
		return 'oembed_cache';
	}
}
