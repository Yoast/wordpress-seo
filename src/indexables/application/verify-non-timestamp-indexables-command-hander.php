<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexable_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Non_Timestamped_Objects_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;

class Verify_Non_Timestamp_Indexables_Command_Handler {
	/**
	 * @var Verify_Indexable_Action_Factory_Interface
	 */
	protected $verify_indexable_action_factory;

	/**
	 * @var Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;


	public function __construct(
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Verify_Indexable_Action_Factory_Interface $verify_indexable_action_factory
	) {
		$this->cron_schedule_handler               = $cron_schedule_handler;
		$this->verify_indexable_action_factory = $verify_indexable_action_factory;
	}

	/**
	 * @param Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command
	 *
	 * @return void
	 */
	public function handle( Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command ): void {
		// Need to do something with this.
		$batch_size = 10;

		$verification_action = $this->verify_indexable_action_factory->get($verify_non_timestamp_indexables_command->get_current_action());
		$has_more_to_index = $verification_action->re_build_indexables($verify_non_timestamp_indexables_command->get_last_batch_count());
		// for each fix
		if($has_more_to_index){
			//option + batch size

			return;
		}
		try {
		$next_action = 	$this->verify_indexable_action_factory->determine_next_verify_action($verify_non_timestamp_indexables_command->get_current_action());
		// update option.
		}catch (No_Verification_Action_Left_Exception $exception){
			$this->cron_schedule_handler->unschedule_verify_non_timestamped_indexables_cron();
		}
	}
}
