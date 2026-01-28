<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Scheduled cleanup for WooCommerce product permalinks.
 *
 * This integration runs a background job that processes all WooCommerce products in chunks,
 * comparing each product's current permalink with the one stored in its indexable. If they differ,
 * the indexable's permalink is reset so it will be recalculated on the next request.
 *
 * Once all products have been processed, a completion flag is set in the database.
 */
class Woocommerce_Product_Permalink_Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Option key for tracking the current cursor (last processed product ID).
	 */
	public const CURSOR_OPTION = 'product_permalink_cleanup_cursor';

	/**
	 * Option key for the completion flag.
	 */
	public const COMPLETED_OPTION = 'product_permalink_cleanup_completed';

	/**
	 * Identifier for the cron job.
	 */
	public const CRON_HOOK = 'wpseo_product_permalink_cleanup_cron';

	/**
	 * Identifier for starting the cleanup.
	 */
	public const START_HOOK = 'wpseo_start_product_permalink_cleanup';

	/**
	 * The minimum WooCommerce version required to run this cleanup.
	 */
	public const REQUIRED_WC_VERSION = '10.5';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The current cursor value for the posts_where filter.
	 *
	 * @var int
	 */
	private $current_cursor = 0;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper       $options_helper       The options helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Indexable_Repository $indexable_repository
	) {
		$this->options_helper       = $options_helper;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Registers the hooks for the cleanup integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( self::START_HOOK, [ $this, 'start_cleanup' ] );
		\add_action( self::CRON_HOOK, [ $this, 'run_cleanup_batch' ] );
		\add_action( 'wpseo_deactivate', [ $this, 'reset_cleanup' ] );
	}

	/**
	 * Starts the cleanup process.
	 *
	 * Resets the cursor and schedules the first batch.
	 *
	 * @return void
	 */
	public function start_cleanup() {
		// If already completed, do nothing.
		if ( $this->is_completed() ) {
			return;
		}

		// Only run if WooCommerce is active and meets the minimum version requirement.
		if ( ! $this->is_woocommerce_version_sufficient() ) {
			return;
		}

		// Reset cursor to start from the beginning.
		$this->options_helper->set( self::CURSOR_OPTION, 0 );

		// Schedule the cron job if not already scheduled.
		if ( ! \wp_next_scheduled( self::CRON_HOOK ) ) {
			\wp_schedule_event( \time(), 'hourly', self::CRON_HOOK );
		}

		// Run the first batch immediately.
		$this->run_cleanup_batch();
	}

	/**
	 * Runs a single batch of the cleanup.
	 *
	 * @return void
	 */
	public function run_cleanup_batch() {
		// If already completed, unschedule and return.
		if ( $this->is_completed() ) {
			$this->reset_cleanup();
			return;
		}

		// Check if WooCommerce is active and meets the minimum version requirement.
		if ( ! $this->is_woocommerce_version_sufficient() ) {
			// Don't reset cleanup - WooCommerce might be updated later.
			return;
		}

		$cursor = (int) $this->options_helper->get( self::CURSOR_OPTION, 0 );
		$limit  = $this->get_batch_size();

		// Get the next batch of products with ID greater than cursor.
		$products = $this->get_products_batch( $cursor, $limit );

		if ( empty( $products ) ) {
			// No more products to process, mark as completed.
			$this->mark_completed();
			return;
		}

		$last_product_id = $cursor;

		foreach ( $products as $product_id ) {
			$this->process_product( $product_id );
			$last_product_id = $product_id;
		}

		// Update the cursor to the last processed product ID.
		$this->options_helper->set( self::CURSOR_OPTION, $last_product_id );

		// If we processed fewer than the limit, we've reached the end.
		if ( \count( $products ) < $limit ) {
			$this->mark_completed();
		}
	}

	/**
	 * Gets a batch of product IDs to process.
	 *
	 * @param int $cursor The last processed product ID.
	 * @param int $limit  The maximum number of products to fetch.
	 *
	 * @return int[] Array of product IDs.
	 */
	private function get_products_batch( $cursor, $limit ) {
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
	 * @param string    $where    The WHERE clause.
	 * @param \WP_Query $wp_query The WP_Query instance.
	 *
	 * @return string The modified WHERE clause.
	 */
	public function filter_products_by_cursor( $where, $wp_query ) {
		global $wpdb;

		if ( $this->current_cursor > 0 ) {
			$where .= $wpdb->prepare( " AND {$wpdb->posts}.ID > %d", $this->current_cursor );
		}

		return $where;
	}

	/**
	 * Processes a single product.
	 *
	 * Compares the product's current permalink with the one stored in its indexable.
	 * If they differ, updates the indexable's permalink to the current value.
	 *
	 * @param int $product_id The product ID.
	 *
	 * @return void
	 */
	private function process_product( $product_id ) {
		$indexable = $this->indexable_repository->find_by_id_and_type( $product_id, 'post', false );

		// Skip if no indexable exists.
		if ( ! $indexable || $indexable === false ) {
			return;
		}

		$current_permalink   = \get_permalink( $product_id );
		$indexable_permalink = $indexable->permalink;

		// Only update if permalinks differ.
		if ( $current_permalink !== $indexable_permalink ) {
			$indexable->permalink = $current_permalink;
			$indexable->save();
		}
	}

	/**
	 * Checks if WooCommerce is active and meets the minimum version requirement.
	 *
	 * @return bool True if WooCommerce version is sufficient.
	 */
	private function is_woocommerce_version_sufficient() {
		if ( ! \defined( 'WC_VERSION' ) ) {
			return false;
		}

		return \version_compare( WC_VERSION, self::REQUIRED_WC_VERSION, '>=' );
	}

	/**
	 * Gets the batch size for processing.
	 *
	 * @return int The number of products to process per batch.
	 */
	private function get_batch_size() {
		/**
		 * Filter: Allows modifying the batch size for product permalink cleanup.
		 *
		 * @param int $batch_size The number of products to process per batch. Default 100.
		 */
		$batch_size = \apply_filters( 'wpseo_product_permalink_cleanup_batch_size', 100 );

		if ( ! \is_int( $batch_size ) || $batch_size < 1 ) {
			$batch_size = 100;
		}

		return $batch_size;
	}

	/**
	 * Checks if the cleanup has been completed.
	 *
	 * @return bool True if cleanup is completed.
	 */
	public function is_completed() {
		return (bool) $this->options_helper->get( self::COMPLETED_OPTION, false );
	}

	/**
	 * Marks the cleanup as completed.
	 *
	 * @return void
	 */
	private function mark_completed() {
		$this->options_helper->set( self::COMPLETED_OPTION, true );
		$this->reset_cleanup();
	}

	/**
	 * Resets the cleanup state and unschedules the cron job.
	 *
	 * @return void
	 */
	public function reset_cleanup() {
		$this->options_helper->set( self::CURSOR_OPTION, 0 );
		\wp_unschedule_hook( self::CRON_HOOK );
	}

	/**
	 * Resets the completion flag (for testing or re-running the cleanup).
	 *
	 * @return void
	 */
	public function reset_completed_flag() {
		$this->options_helper->set( self::COMPLETED_OPTION, false );
	}
}
