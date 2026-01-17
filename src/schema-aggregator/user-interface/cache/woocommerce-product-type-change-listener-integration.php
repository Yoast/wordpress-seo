<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache;

use WC_Product;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * This class listens to WooCommerce product type changes and resets the cache.
 *
 * When a product type changes (e.g., from simple to variable or vice versa),
 * this integration invalidates the relevant schema aggregator cache to ensure
 * the cached schema reflects the new product structure.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class WooCommerce_Product_Type_Change_Listener_Integration extends Abstract_Cache_Listener_Integration {

	/**
	 * Registers the hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'woocommerce_product_type_changed', [ $this, 'reset_cache' ], \PHP_INT_MAX, 1 );
	}

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [
			Schema_Aggregator_Conditional::class,
			WooCommerce_Conditional::class,
		];
	}

	/**
	 * This method resets the cache for the cached page where the product is located.
	 *
	 * @param WC_Product $product The product whose type was changed.
	 *
	 * @return bool
	 */
	public function reset_cache( $product ) {
		$product_id = $product->get_id();

		if ( ! $product_id ) {
			return false;
		}
		$indexable = $this->indexable_repository->find_by_id_and_type( $product_id, 'post' );

		if ( ! $indexable ) {
			$this->manager->invalidate_all();
			$this->xml_manager->invalidate();

			return false;
		}

		$page = $this->get_page_number( $indexable );
		$this->manager->invalidate( 'product', $page );
		$this->xml_manager->invalidate();

		return true;
	}
}
