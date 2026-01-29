<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Application\Commands;

use Yoast\WP\SEO\Woocommerce_Cleanup\Application\Cleanup_Cron_Scheduler;
use Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure\Cleanup_Status_Options_Repository;

/**
 * Handles resetting the cleanup state.
 */
class Reset_Cleanup_Command_Handler {

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
	 * Resets the cleanup state and unschedules the cron job.
	 *
	 * @return void
	 */
	public function handle(): void {
		$this->status_repository->reset_cursor();
		$this->cron_scheduler->unschedule_cleanup();
	}
}
