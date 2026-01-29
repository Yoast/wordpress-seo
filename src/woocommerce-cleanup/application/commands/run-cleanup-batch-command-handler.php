<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands;

use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Cleanup_Cron_Scheduler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure\Cleanup_Status_Options_Repository;
use Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure\Product_Batch_Collector;
use Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure\Product_Indexable_Repository;

/**
 * Handles the execution of a cleanup batch.
 */
class Run_Cleanup_Batch_Command_Handler {

	/**
	 * The default batch size.
	 */
	private const DEFAULT_BATCH_SIZE = 100;

	/**
	 * The cleanup status repository.
	 *
	 * @var Cleanup_Status_Options_Repository
	 */
	private $status_repository;

	/**
	 * The product batch collector.
	 *
	 * @var Product_Batch_Collector
	 */
	private $product_batch_collector;

	/**
	 * The product indexable repository.
	 *
	 * @var Product_Indexable_Repository
	 */
	private $product_indexable_repository;

	/**
	 * The cron scheduler.
	 *
	 * @var Cleanup_Cron_Scheduler
	 */
	private $cron_scheduler;

	/**
	 * Constructor.
	 *
	 * @param Cleanup_Status_Options_Repository $status_repository            The cleanup status repository.
	 * @param Product_Batch_Collector           $product_batch_collector      The product batch collector.
	 * @param Product_Indexable_Repository      $product_indexable_repository The product indexable repository.
	 * @param Cleanup_Cron_Scheduler            $cron_scheduler               The cron scheduler.
	 */
	public function __construct(
		Cleanup_Status_Options_Repository $status_repository,
		Product_Batch_Collector $product_batch_collector,
		Product_Indexable_Repository $product_indexable_repository,
		Cleanup_Cron_Scheduler $cron_scheduler
	) {
		$this->status_repository            = $status_repository;
		$this->product_batch_collector      = $product_batch_collector;
		$this->product_indexable_repository = $product_indexable_repository;
		$this->cron_scheduler               = $cron_scheduler;
	}

	/**
	 * Runs a single batch of the cleanup.
	 *
	 * @return void
	 */
	public function handle(): void {
		$status = $this->status_repository->get_status();

		// If already completed, unschedule and return.
		if ( $status->is_completed() ) {
			$this->cron_scheduler->unschedule_cleanup();
			return;
		}

		$cursor = $status->get_cursor();
		$limit  = $this->get_batch_size();

		// Get the next batch of products with ID greater than cursor.
		$products = $this->product_batch_collector->get_products_batch( $cursor, $limit );

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
		$this->status_repository->update_cursor( $last_product_id );

		// If we processed fewer than the limit, we've reached the end.
		if ( \count( $products ) < $limit ) {
			$this->mark_completed();
		}
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
	private function process_product( int $product_id ): void {
		$indexable = $this->product_indexable_repository->find_by_product_id( $product_id );

		// Skip if no indexable exists.
		if ( ! $indexable || $indexable === false ) {
			return;
		}

		$current_permalink   = $this->product_batch_collector->get_product_permalink( $product_id );
		$indexable_permalink = $indexable->permalink;

		// Only update if permalinks differ.
		if ( $current_permalink !== $indexable_permalink ) {
			$this->product_indexable_repository->update_permalink( $indexable, $current_permalink );
		}
	}

	/**
	 * Marks the cleanup as completed and unschedules the cron.
	 *
	 * @return void
	 */
	private function mark_completed(): void {
		$this->status_repository->mark_completed();
		$this->cron_scheduler->unschedule_cleanup();
	}

	/**
	 * Gets the batch size for processing.
	 *
	 * @return int The number of products to process per batch.
	 */
	private function get_batch_size(): int {
		/**
		 * Filter: Allows modifying the batch size for product permalink cleanup.
		 *
		 * @param int $batch_size The number of products to process per batch. Default 100.
		 */
		$batch_size = \apply_filters( 'wpseo_product_permalink_cleanup_batch_size', self::DEFAULT_BATCH_SIZE );

		if ( ! \is_int( $batch_size ) || $batch_size < 1 ) {
			$batch_size = self::DEFAULT_BATCH_SIZE;
		}

		return $batch_size;
	}
}
