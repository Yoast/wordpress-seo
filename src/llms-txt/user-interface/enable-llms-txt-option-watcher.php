<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use Google\Site_Kit_Dependencies\Google\Service\Adsense\Payment;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;

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
	 * Constructor.
	 *
	 * @param Llms_Txt_Cron_Scheduler     $scheduler                   The cron scheduler.
	 * @param Remove_File_Command_Handler $remove_file_command_handler The remove file command handler.
	 */
	public function __construct(
		Llms_Txt_Cron_Scheduler $scheduler,
		Remove_File_Command_Handler $remove_file_command_handler
	) {
		$this->scheduler                   = $scheduler;
		$this->remove_file_command_handler = $remove_file_command_handler;
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
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return bool Whether the option is set.
	 */
	public function check_toggle_llms_txt( $old_value, $new_value ) {
		$option_name = 'enable_llms_txt';

		if ( \array_key_exists( $option_name, $old_value ) && \array_key_exists( $option_name, $new_value ) && $old_value[ $option_name ] !== $new_value[ $option_name ] ) {
			if ( $new_value[ $option_name ] === true ) {
				$this->scheduler->schedule_llms_txt_population();
			}
			else {
				$this->scheduler->unschedule_llms_txt_population();
				$this->remove_file_command_handler->handle( new Remove_File_Command( \ABSPATH . 'llms.txt' ) );
			}

			return true;
		}

		return false;
	}
}
