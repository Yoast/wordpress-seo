<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
/**
 * Configuration for the Schema Aggregator.
 */
class Aggregator_Config {
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
	 * The WooCommerce Conditional.
	 *
	 * @var WooCommerce_Conditional
	 */
	private $woocommerce_conditional;

	/**
	 * The Post Type Helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Aggregator_Config constructor.
	 *
	 * @param WooCommerce_Conditional $woocommerce_conditional The WooCommerce Conditional.
	 * @param Post_Type_Helper        $post_type_helper        The Post Type Helper.
	 */
	public function __construct( WooCommerce_Conditional $woocommerce_conditional, Post_Type_Helper $post_type_helper ) {
		$this->woocommerce_conditional = $woocommerce_conditional;
		$this->post_type_helper        = $post_type_helper;
	}

	/**
	 * Get configured post types
	 *
	 * @return array<string>
	 */
	public function get_allowed_post_types(): array {
		$default_post_types = self::DEFAULT_POST_TYPES;

		// Only include 'product' if Yoast WooCommerce SEO extension is active.

		if ( $this->woocommerce_conditional->is_met() ) {
			$default_post_types[] = 'product';
		}

		$post_types = \apply_filters( 'wpseo_schema_aggregator_post_types', $default_post_types );

		// Ensure it's an array.
		if ( ! \is_array( $post_types ) ) {
			return $default_post_types;
		}

		return \array_intersect( $post_types, $this->post_type_helper->get_indexable_post_types() );
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
}
