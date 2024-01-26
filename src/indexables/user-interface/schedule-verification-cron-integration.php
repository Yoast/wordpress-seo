<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * This integration schedules the verification cron tasks.
 */
class Schedule_Verification_Cron_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The verification cron schedule handler.
	 *
	 * @var Verification_Cron_Schedule_Handler
	 */
	protected $cron_schedule_handler;

	/**
	 * The constructor.
	 *
	 * @param Verification_Cron_Schedule_Handler $cron_schedule_handler The cron schedule handler.
	 */
	public function __construct( Verification_Cron_Schedule_Handler $cron_schedule_handler ) {
		$this->cron_schedule_handler = $cron_schedule_handler;
	}

	/**
	 * Registers the action with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_activate', [ $this->cron_schedule_handler, 'schedule_indexable_verification' ] );
	}
}
