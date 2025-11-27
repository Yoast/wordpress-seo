<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use WC_Structured_Data;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;

/**
 * The Schema_Piece repository.
 */
class Woo_Schema_Piece_Repository {

	/**
	 * The WooCommerce Conditional.
	 *
	 * @var WooCommerce_Conditional
	 */
	private $woocommerce_conditional;

	/**
	 * Woo_Schema_Piece_Repository constructor.
	 *
	 * @param WooCommerce_Conditional $woocommerce_conditional The WooCommerce Conditional.
	 */
	public function __construct( WooCommerce_Conditional $woocommerce_conditional ) {
		$this->woocommerce_conditional = $woocommerce_conditional;
	}

	/**
	 * Collect Product schema for WooCommerce products.
	 *
	 * ## How it Works
	 *
	 * Hooks into 'wpseo_schema_product' filter to capture enriched Product schema
	 * Triggers WooCommerce's schema generation via WC_Structured_Data
	 * Returns the captured Product entity
	 *
	 * @param int $post_id Product post ID.
	 *
	 * @return array<string,array<string>>|null Product schema entity or null if unavailable.
	 */
	public function collect_product_schema( int $post_id ): ?array {

		if ( ! $this->woocommerce_conditional->is_met() ) {
			return null;
		}

		try {
			$product = \wc_get_product( $post_id );

			if ( ! $product || ! \is_a( $product, 'WC_Product' ) ) {
				return null;
			}

			$captured_schema = null;

			$capture_filter = static function ( $schema_data ) use ( &$captured_schema ) {
				$captured_schema = $schema_data;

				return $schema_data;
			};

			\add_filter( 'wpseo_schema_product', $capture_filter, 999 );

			// This will trigger the woocommerce_structured_data_product filter.
			// which Yoast WooCommerce SEO hooks into to enrich the schema.
			// which then triggers our wpseo_schema_product filter above.
			$structured_data = new WC_Structured_Data();
			$structured_data->generate_product_data( $product );

			\remove_filter( 'wpseo_schema_product', $capture_filter, 999 );

			if ( ! \is_array( $captured_schema ) ) {
				return null;
			}

			return $captured_schema;
		} catch ( Exception $e ) {
			return null;
		}
	}
}
