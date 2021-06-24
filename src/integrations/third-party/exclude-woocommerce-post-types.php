<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Exclude certain WooCommerce-specific post types from the indexable table.
 *
 * Posts with these post types will not be saved to the indexable table.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Exclude_WooCommerce_Post_Types implements Integration_Interface {

	/**
	 * Initializes the integration.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'exclude_woocommerce_post_types' ] );
	}

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
	 * Exclude certain WooCommerce-specific post types from the indexable table.
	 *
	 * Posts with these post types will not be saved to the indexable table.
	 *
	 * @param array $excluded_post_types The excluded post types.
	 *
	 * @return array The excluded post types, including the excluded WooCommerce post types.
	 */
	public function exclude_woocommerce_post_types( $excluded_post_types ) {
		$excluded_post_types[] = 'shop_order';

		return $excluded_post_types;
	}
}
