<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Cleanup_Cron_Scheduler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands\Reset_Cleanup_Command_Handler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands\Run_Cleanup_Batch_Command_Handler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands\Start_Cleanup_Command_Handler;

/**
 * Scheduled cleanup integration for WooCommerce product permalinks.
 *
 * This integration runs a background job that processes all WooCommerce products in chunks,
 * comparing each product's current permalink with the one stored in its indexable. If they differ,
 * the indexable's permalink is updated so it reflects the correct value.
 *
 * Once all products have been processed, a completion flag is set in the database.
 */
class Woocommerce_Product_Permalink_Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The start cleanup command handler.
	 *
	 * @var Start_Cleanup_Command_Handler
	 */
	private $start_cleanup_handler;

	/**
	 * The run cleanup batch command handler.
	 *
	 * @var Run_Cleanup_Batch_Command_Handler
	 */
	private $run_cleanup_batch_handler;

	/**
	 * The reset cleanup command handler.
	 *
	 * @var Reset_Cleanup_Command_Handler
	 */
	private $reset_cleanup_handler;

	/**
	 * Constructor.
	 *
	 * @param Start_Cleanup_Command_Handler     $start_cleanup_handler     The start cleanup command handler.
	 * @param Run_Cleanup_Batch_Command_Handler $run_cleanup_batch_handler The run cleanup batch command handler.
	 * @param Reset_Cleanup_Command_Handler     $reset_cleanup_handler     The reset cleanup command handler.
	 */
	public function __construct(
		Start_Cleanup_Command_Handler $start_cleanup_handler,
		Run_Cleanup_Batch_Command_Handler $run_cleanup_batch_handler,
		Reset_Cleanup_Command_Handler $reset_cleanup_handler
	) {
		$this->start_cleanup_handler     = $start_cleanup_handler;
		$this->run_cleanup_batch_handler = $run_cleanup_batch_handler;
		$this->reset_cleanup_handler     = $reset_cleanup_handler;
	}

	/**
	 * Registers the hooks for the cleanup integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'register_cleanup' ] );
		\add_action( Cleanup_Cron_Scheduler::CRON_HOOK, [ $this, 'run_cleanup_batch' ] );
		\add_action( 'wpseo_deactivate', [ $this, 'reset_cleanup' ] );
	}

	/**
	 * Starts the cleanup process.
	 *
	 * @return void
	 */
	public function register_cleanup(): void {
		$this->start_cleanup_handler->handle();
	}

	/**
	 * Runs a single batch of the cleanup.
	 *
	 * @return void
	 */
	public function run_cleanup_batch(): void {
		// Check if WooCommerce is active and meets the minimum version requirement.
		if ( ! $this->start_cleanup_handler->is_woocommerce_version_sufficient() ) {
			// Don't reset cleanup - WooCommerce might be updated later.
			return;
		}

		$this->run_cleanup_batch_handler->handle();
	}

	/**
	 * Resets the cleanup state and unschedules the cron job.
	 *
	 * @return void
	 */
	public function reset_cleanup(): void {
		$this->reset_cleanup_handler->handle();
	}
}
