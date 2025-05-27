<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

/**
 * Watches and handles changes to the LLMS.txt enabled option.
 */
class Enable_Llms_Txt_Option_Watcher implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The scheduler.
	 *
	 * @var Llms_Txt_Cron_Scheduler
	 */
	private $scheduler;

	/**
	 * The remove file command handler.
	 *
	 * @var Remove_File_Command_Handler
	 */
	private $remove_file_command_handler;

	/**
	 * The populate file command handler.
	 *
	 * @var Populate_File_Command_Handler
	 */
	private $populate_file_command_handler;

	/**
	 * Constructor.
	 *
	 * @param Llms_Txt_Cron_Scheduler       $scheduler                     The cron scheduler.
	 * @param Remove_File_Command_Handler   $remove_file_command_handler   The remove file command handler.
	 * @param Populate_File_Command_Handler $populate_file_command_handler The populate file command handler.
	 */
	public function __construct(
		Llms_Txt_Cron_Scheduler $scheduler,
		Remove_File_Command_Handler $remove_file_command_handler,
		Populate_File_Command_Handler $populate_file_command_handler
	) {
		$this->scheduler                     = $scheduler;
		$this->remove_file_command_handler   = $remove_file_command_handler;
		$this->populate_file_command_handler = $populate_file_command_handler;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo', [ $this, 'check_toggle_llms_txt' ], 10, 2 );
	}

	/**
	 * Checks if the LLMS.txt feature is toggled.
	 *
	 * @param array<string|int|bool|array<string|int|bool>> $old_value The old value of the option.
	 * @param array<string|int|bool|array<string|int|bool>> $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_toggle_llms_txt( $old_value, $new_value ): void {
		$option_name = 'enable_llms_txt';

		if ( \array_key_exists( $option_name, $old_value ) && \array_key_exists( $option_name, $new_value ) && $old_value[ $option_name ] !== $new_value[ $option_name ] ) {
			if ( $new_value[ $option_name ] === true ) {
				$this->scheduler->schedule_weekly_llms_txt_population();
				$this->populate_file_command_handler->handle();
			}
			else {
				$this->scheduler->unschedule_llms_txt_population();
				$this->remove_file_command_handler->handle();
			}
		}
	}
}
