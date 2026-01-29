<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Responsible for scheduling and unscheduling the cleanup cron.
 */
class Cleanup_Cron_Scheduler {

	/**
	 * The name of the cron job.
	 */
	public const CRON_HOOK = 'wpseo_product_permalink_cleanup_cron';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Schedules the cleanup cron job.
	 *
	 * @return void
	 */
	public function schedule_cleanup(): void {
		if ( ! \wp_next_scheduled( self::CRON_HOOK ) ) {
			\wp_schedule_event( \time(), 'hourly', self::CRON_HOOK );
		}
	}

	/**
	 * Unschedules the cleanup cron job.
	 *
	 * @return void
	 */
	public function unschedule_cleanup(): void {
		\wp_unschedule_hook( self::CRON_HOOK );
	}

	/**
	 * Checks if the cleanup cron is already scheduled.
	 *
	 * @return bool True if scheduled.
	 */
	public function is_scheduled(): bool {
		return (bool) \wp_next_scheduled( self::CRON_HOOK );
	}
}
