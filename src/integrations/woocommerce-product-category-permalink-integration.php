<?php

namespace Yoast\WP\SEO\Integrations;

use WP_Term;
use Yoast\WP\SEO\Conditionals\Dynamic_Product_Permalinks_Conditional;
use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Version_Conditional;

/**
 * Integration for WooCommerce product category permalink handling.
 */
class Woocommerce_Product_Category_Permalink_Integration implements Integration_Interface {

	/**
	 * Holds the Dynamic_Product_Permalinks_Conditional.
	 *
	 * @var Dynamic_Product_Permalinks_Conditional
	 */
	private $dynamic_product_permalinks_conditional;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			WooCommerce_Version_Conditional::class,
			Woo_SEO_Inactive_Conditional::class,
		];
	}

	/**
	 * Constructs Support_Integration.
	 *
	 * @param Dynamic_Product_Permalinks_Conditional $dynamic_product_permalinks_conditional The Dynamic_Product_Permalinks_Conditional.
	 */
	public function __construct(
		Dynamic_Product_Permalinks_Conditional $dynamic_product_permalinks_conditional
	) {
		$this->dynamic_product_permalinks_conditional = $dynamic_product_permalinks_conditional;
	}

	/**
	 * Registers the hooks for this integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wc_product_post_type_link_product_cat', [ $this, 'restore_legacy_permalink_category' ], 10, 2 );
	}

	/**
	 * Handles the product category link filter. Basically restores the pre-10.5 behavior for now.
	 *
	 * @param WP_Term   $category The deepest category (new default behavior).
	 * @param WP_Term[] $terms    All categories assigned to the product.
	 *
	 * @return WP_Term The category to use in the permalink.
	 */
	public function restore_legacy_permalink_category( $category, $terms ) {
		if ( $this->dynamic_product_permalinks_conditional->is_met() ) {
			return $category;
		}

		$sorted_terms = \wp_list_sort(
			$terms,
			[
				'parent'  => 'DESC',
				'term_id' => 'ASC',
			]
		);
		return $sorted_terms[0];
	}
}
