<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\General\Domain\Taxonomy_Filters;

/**
 * This class describes the product category filter.
 */
class Product_Category_Filter implements Taxonomy_Filter_Interface {

	/**
	 * Gets the filtering taxonomy.
	 *
	 * @return string The filtering taxonomy.
	 */
	public function get_filtering_taxonomy(): string {
		return 'product_cat';
	}

	/**
	 * Gets the filtered content type.
	 *
	 * @return string The filtered content type.
	 */
	public function get_filtered_content_type(): string {
		return 'product';
	}
}
