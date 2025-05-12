<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;


/**
 *
 */
class Schedule_Population_On_Activation_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * @var Remove_File_Command_Handler The command handler.
	 */
	private $command_handler;

	/**
	 * @var Options_Helper $options_helper The options helper.
	 */
	private $options_helper;

	/**
	 * @var Llms_Txt_Cron_Scheduler $scheduler The scheduler.
	 */
	private $scheduler;

	/**
	 * The constructor.
	 *
	 * @param Llms_Txt_Cron_Scheduler $scheduler      The cron scheduler.
	 * @param Options_Helper          $options_helper The options helper.
	 */
	public function __construct( Llms_Txt_Cron_Scheduler $scheduler, Options_Helper $options_helper, Remove_File_Command_Handler $command_handler) {
		$this->scheduler      = $scheduler;
		$this->options_helper = $options_helper;
		$this->command_handler = $command_handler;
	}

	/**
	 * Registers the scheduling of the cron to the activation action.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_activate', [ $this, 'schedule_llms_txt_population' ] );
	}

	/**
	 * Schedules the cron if the option is turned on.
	 *
	 * @return void
	 */
	public function schedule_llms_txt_population() {
		if ( $this->options_helper->get( 'enable_llms_txt', true ) === true ) {
			$this->scheduler->schedule_llms_txt_population();
		}
		else {
			$this->scheduler->unschedule_llms_txt_population();
			$this->command_handler->handle( new Remove_File_Command( \ABSPATH . 'llms.txt' ) );
		}
	}
}
