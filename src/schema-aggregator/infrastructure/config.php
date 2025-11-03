<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use WPSEO_Addon_Manager;

/**
 * Configuration for the Schema Aggregator.
 */
class Config {

	/**
	 * Default items per page
	 *
	 * @var int
	 */
	private const DEFAULT_PER_PAGE = 100;

	/**
	 * Maximum items per page
	 *
	 * @var int
	 */
	private const MAX_PER_PAGE = 100;

	/**
	 * Default post types to include in schema aggregation
	 *
	 * Note: 'product' is only included if Yoast WooCommerce SEO extension is active
	 * because without it, WooCommerce products don't generate Product schema in Yoast's graph
	 *
	 * @var array<string>
	 */
	private const DEFAULT_POST_TYPES = [ 'post', 'page' ];

	/**
	 * Default schema types to include (whitelist)
	 *
	 * @var array<string>
	 */
	private const DEFAULT_SCHEMA_TYPES = [
		'Recipe',
		'Article',
		'Product',
		'Event',
		'Person',
		'Organization',
		'WebPage',
		'WebSite',
	];

	private const PROPERTIES_AVOID_LIST = [ 'breadcrumb', 'potentialAction' ];

	/**
	 * Get default items per page
	 *
	 * @return int
	 */
	public function get_per_page(): int {
		return (int) \apply_filters( 'wpseo_schema_aggregator_per_page', self::DEFAULT_PER_PAGE );
	}

	/**
	 * Get maximum items per page
	 *
	 * @return int
	 */
	public function get_max_per_page(): int {
		return self::MAX_PER_PAGE;
	}

	/**
	 * Get configured post types
	 *
	 * @return array<string>
	 */
	public function get_allowed_post_types(): array {
		$default_post_types = self::DEFAULT_POST_TYPES;

		// Only include 'product' if Yoast WooCommerce SEO extension is active.

		if ( $this->is_yoast_woocommerce_active() ) {
			$default_post_types[] = 'product';
		}

		$post_types = \apply_filters( 'wpseo_schema_aggregator_post_types', $default_post_types );

		// Ensure it's an array.
		if ( ! \is_array( $post_types ) ) {
			return $default_post_types;
		}

		return $post_types;
	}

	/**
	 * Get configured schema types (whitelist)
	 *
	 * @return array<string>
	 */
	public function get_allowed_schema_types(): array {
		$schema_types = \apply_filters( 'wpseo_schema_aggregator_schema_types', self::DEFAULT_SCHEMA_TYPES );

		if ( ! \is_array( $schema_types ) ) {
			return self::DEFAULT_SCHEMA_TYPES;
		}

		return $schema_types;
	}

	/**
	 * Get list of properties to remove from a schema piece.
	 *
	 * @return array<string>
	 */
	public function get_properties_avoid_list(): array {
		$properties_avoid_list = \apply_filters( 'wpseo_schema_aggregator_properties_avoid_list', self::PROPERTIES_AVOID_LIST );

		if ( ! \is_array( $properties_avoid_list ) ) {
			return self::PROPERTIES_AVOID_LIST;
		}

		return $properties_avoid_list;
	}

	/**
	 * Check if Yoast WooCommerce SEO extension is active
	 *
	 * @return bool
	 */
	private function is_yoast_woocommerce_active(): bool {
		$addon_manager = new WPSEO_Addon_Manager();
		$plugin_file   = $addon_manager->get_plugin_file( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG );

		return $plugin_file && \is_plugin_active( $plugin_file );
	}
}
