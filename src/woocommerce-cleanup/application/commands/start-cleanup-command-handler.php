<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands;

use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Cleanup_Cron_Scheduler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure\Cleanup_Status_Options_Repository;

/**
 * Handles the registration and initialization of the cleanup process.
 */
class Start_Cleanup_Command_Handler {

	/**
	 * The minimum WooCommerce version required to run this cleanup.
	 */
	private const REQUIRED_WC_VERSION = '10.5';

	/**
	 * The cleanup status repository.
	 *
	 * @var Cleanup_Status_Options_Repository
	 */
	private $status_repository;

	/**
	 * The cron scheduler.
	 *
	 * @var Cleanup_Cron_Scheduler
	 */
	private $cron_scheduler;

	/**
	 * Constructor.
	 *
	 * @param Cleanup_Status_Options_Repository $status_repository The cleanup status repository.
	 * @param Cleanup_Cron_Scheduler            $cron_scheduler    The cron scheduler.
	 */
	public function __construct(
		Cleanup_Status_Options_Repository $status_repository,
		Cleanup_Cron_Scheduler $cron_scheduler
	) {
		$this->status_repository = $status_repository;
		$this->cron_scheduler    = $cron_scheduler;
	}

	/**
	 * Starts the cleanup process.
	 *
	 * Checks preconditions and schedules the cron job if needed.
	 *
	 * @return void
	 */
	public function handle(): void {
		// Only run if WooCommerce is active and meets the minimum version requirement.
		if ( ! $this->is_woocommerce_version_sufficient() ) {
			return;
		}

		$status = $this->status_repository->get_status();

		// If already completed, do nothing.
		if ( $status->is_completed() ) {
			return;
		}

		// Schedule the cron job if not already scheduled.
		if ( ! $this->cron_scheduler->is_scheduled() ) {
			// Reset cursor to start from the beginning.
			$this->status_repository->reset_cursor();
			$this->cron_scheduler->schedule_cleanup();
		}
	}

	/**
	 * Checks if WooCommerce is active and meets the minimum version requirement.
	 *
	 * @return bool True if WooCommerce version is sufficient.
	 */
	public function is_woocommerce_version_sufficient(): bool {
		if ( ! \defined( 'WC_VERSION' ) ) {
			return false;
		}

		return \version_compare( \WC_VERSION, self::REQUIRED_WC_VERSION, '>=' );
	}
}
