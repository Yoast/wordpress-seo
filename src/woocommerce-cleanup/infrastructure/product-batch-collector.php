<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure;

/**
 * WordPress implementation for querying WooCommerce products.
 */
class Product_Batch_Collector {

	/**
	 * The current cursor value for the posts_where filter.
	 *
	 * @var int
	 */
	private $current_cursor = 0;

	/**
	 * Gets a batch of product IDs starting after a given cursor.
	 *
	 * @param int $cursor The last processed product ID.
	 * @param int $limit  The maximum number of products to fetch.
	 *
	 * @return int[] Array of product IDs.
	 */
	public function get_products_batch( int $cursor, int $limit ): array {
		// Store cursor for the where filter.
		$this->current_cursor = $cursor;

		// Add filter to inject efficient WHERE clause.
		\add_filter( 'posts_where', [ $this, 'filter_products_by_cursor' ], 10, 2 );

		$args = [
			'post_type'              => 'product',
			'post_status'            => [ 'publish', 'pending', 'draft', 'private' ],
			'posts_per_page'         => $limit,
			'fields'                 => 'ids',
			'orderby'                => 'ID',
			'order'                  => 'ASC',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'suppress_filters'       => false,
		];

		$product_ids = \get_posts( $args );

		// Remove the filter after use.
		\remove_filter( 'posts_where', [ $this, 'filter_products_by_cursor' ], 10 );

		return $product_ids;
	}

	/**
	 * Filters the WHERE clause to only get products with ID greater than the cursor.
	 *
	 * @param string $where The WHERE clause.
	 *
	 * @return string The modified WHERE clause.
	 */
	public function filter_products_by_cursor( $where ): string {
		if ( $this->current_cursor > 0 ) {
			global $wpdb;

			$where .= $wpdb->prepare( " AND {$wpdb->posts}.ID > %d", $this->current_cursor );
		}

		return $where;
	}

	/**
	 * Gets the current permalink for a product.
	 *
	 * @param int $product_id The product ID.
	 *
	 * @return string The product permalink.
	 */
	public function get_product_permalink( int $product_id ): string {
		return \get_permalink( $product_id );
	}
}
