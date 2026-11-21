<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Exception;
use WC_Structured_Data;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Domain\External_Schema_Piece_Repository_Interface;

/**
 * The WooCommerce schema piece repository.
 */
class Woo_Schema_Piece_Repository implements External_Schema_Piece_Repository_Interface {

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
	 * Checks if this repository supports the given post type.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool True if this repository can provide schema for the post type.
	 */
	public function supports( string $post_type ): bool {
		return $this->woocommerce_conditional->is_met() && $post_type === 'product';
	}

	/**
	 * Collects product schema pieces for WooCommerce products.
	 *
	 * Hooks into 'wpseo_schema_product' filter to capture enriched Product schema.
	 * Triggers WooCommerce's schema generation via WC_Structured_Data.
	 * Returns the captured Product entity.
	 *
	 * @param int $post_id Product post ID.
	 *
	 * @return array<array<string,string|int|bool|array>> Product schema pieces (empty array if unavailable).
	 */
	public function collect( int $post_id ): array {
		if ( ! $this->woocommerce_conditional->is_met() ) {
			return [];
		}

		try {
			$product = \wc_get_product( $post_id );

			if ( ! $product || ! \is_a( $product, 'WC_Product' ) ) {
				return [];
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
				return [];
			}

			return [ $captured_schema ];
		} catch ( Exception $e ) {
			return [];
		}
	}
}
