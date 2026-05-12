<?php

namespace Yoast\WP\SEO\Expiring_Store\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Runs expiring store cleanup on a recurring weekly WP-Cron schedule.
 */
class Expiring_Store_Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	public const CRON_HOOK = 'wpseo_expiring_store_cleanup';

	/**
	 * The expiring store.
	 *
	 * @var Expiring_Store
	 */
	private $expiring_store;

	/**
	 * The constructor.
	 *
	 * @param Expiring_Store $expiring_store The expiring store.
	 */
	public function __construct( Expiring_Store $expiring_store ) {
		$this->expiring_store = $expiring_store;
	}

	/**
	 * Registers action hooks.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_action( 'admin_init', [ $this, 'schedule_cleanup' ] );
		\add_action( self::CRON_HOOK, [ $this, 'run_cleanup' ] );
		\add_action( 'wpseo_deactivate', [ $this, 'unschedule_cleanup' ] );
	}

	/**
	 * Schedules the weekly cleanup cron if not already scheduled.
	 *
	 * @return void
	 */
	public function schedule_cleanup(): void {
		if ( ! \wp_next_scheduled( self::CRON_HOOK ) ) {
			\wp_schedule_event( \time(), 'weekly', self::CRON_HOOK );
		}
	}

	/**
	 * Clears all scheduled cleanup events.
	 *
	 * @return void
	 */
	public function unschedule_cleanup(): void {
		\wp_clear_scheduled_hook( self::CRON_HOOK );
	}

	/**
	 * Runs the expiring store cleanup.
	 *
	 * @return void
	 */
	public function run_cleanup(): void {
		$this->expiring_store->cleanup_expired();
	}
}
