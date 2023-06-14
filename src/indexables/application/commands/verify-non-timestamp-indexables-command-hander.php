<?php


namespace Yoast\WP\SEO\Indexables\Application\Commands;

use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexable_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;

class Verify_Non_Timestamp_Indexables_Command_Handler {

	/**
	 * @var Verify_Indexable_Action_Factory_Interface
	 */
	protected $verify_indexable_action_factory;

	/**
	 * @var Verification_Cron_Batch_Handler
	 */
	protected $cron_batch_handler;

	/**
	 * @var Next_Verification_Action_Handler
	 */
	protected $action_handler;

	/**
	 * @var Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;

	public function __construct(
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Verification_Cron_Batch_Handler $cron_batch_handler,
		Verify_Indexable_Action_Factory_Interface $verify_indexable_action_factory,
		Next_Verification_Action_Handler $action_handler
	) {
		$this->cron_schedule_handler           = $cron_schedule_handler;
		$this->cron_batch_handler              = $cron_batch_handler;
		$this->verify_indexable_action_factory = $verify_indexable_action_factory;
		$this->action_handler                  = $action_handler;
	}

	/**
	 * @param Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command
	 *
	 * @return void
	 */
	public function handle( Verify_Non_Timestamp_Indexables_Command $verify_non_timestamp_indexables_command ): void {

		try {
			$verification_action = $this->verify_indexable_action_factory->get( $verify_non_timestamp_indexables_command->get_current_action() );
		}catch(Verify_Action_Not_Found_Exception $exception){
			$this->cron_schedule_handler->unschedule_verify_non_timestamped_indexables_cron();
			return;
		}

		$has_more_to_index   = $verification_action->re_build_indexables( $verify_non_timestamp_indexables_command->get_last_batch_count(), $verify_non_timestamp_indexables_command->get_batch_size() );
		// for each fix
		if ( $has_more_to_index ) {
			$this->cron_batch_handler->set_current_non_timestamped_indexables_batch( $verify_non_timestamp_indexables_command->get_last_batch_count(), $verify_non_timestamp_indexables_command->get_batch_size() );

			return;
		}
		try {
			$next_action = $this->verify_indexable_action_factory->determine_next_verify_action( $verify_non_timestamp_indexables_command->get_current_action() );
			$this->action_handler->set_current_verification_action( $next_action );
			$this->cron_batch_handler->set_current_non_timestamped_indexables_batch( new Last_Batch_Count( 0 ), new Batch_Size( 0 ) );
		} catch ( No_Verification_Action_Left_Exception $exception ) {
			$this->cron_schedule_handler->unschedule_verify_non_timestamped_indexables_cron();
		}
	}
}
