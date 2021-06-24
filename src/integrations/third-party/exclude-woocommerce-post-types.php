<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Exclude_Post_Type;

/**
 * Exclude certain WooCommerce-specific post types from the indexable table.
 *
 * Posts with these post types will not be saved to the indexable table.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Exclude_WooCommerce_Post_Types extends Exclude_Post_Type {

	/**
	 * This integration is only active when the WooCommerce plugin
	 * is installed and activated.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ WooCommerce_Conditional::class ];
	}

	/**
	 * Returns the name of the post type to be excluded.
	 * To be used in the wpseo_indexable_excluded_post_types filter.
	 *
	 * @return string the name of the post type.
	 */
	public function get_post_type() {
		return 'shop_order';
	}
}
