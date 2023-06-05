<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Non_Timestamped_Objects_Found_Exception;

class Verify_Non_Timestamp_Indexables_Command_Handler {

	/**
	 * @var Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;


	public function __construct(
		Verification_Cron_Schedule_Handler $cron_schedule_handler
	) {
		$this->cron_schedule_handler               = $cron_schedule_handler;
	}

	/**
	 * @param Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command
	 *
	 * @return void
	 */
	public function handle( Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command ): void {
		// Need to do something with this.
		$batch_size = 10;

		try {
			// Bla
			} catch ( No_Non_Timestamped_Objects_Found_Exception $exception ) {
			$this->cron_schedule_handler->unschedule_verify_non_timestamped_indexables_cron();

			return;
		}

	}
}
