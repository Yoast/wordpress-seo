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
	 * Default schema types to include (whitelist)
	 *
	 * @var array<string>
	 */
	private const DEFAULT_SCHEMA_TYPES = [
		'Recipe',
		'Article',
		'Product',
		'ProductGroup',
		'Event',
		'Person',
		'Organization',
		'WebSite',
	];

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
		$default_post_types = $this->post_type_helper->get_indexable_post_types();

		$post_types = \apply_filters( 'wpseo_schema_aggregator_post_types', $default_post_types );

		if ( ! \is_array( $post_types ) ) {
			return $default_post_types;
		}

		return $post_types;
	}
}
