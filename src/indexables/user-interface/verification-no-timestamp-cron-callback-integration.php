<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * The Verification_Cron_Callback_Integration class.
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Verification_No_Timestamp_Cron_Callback_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The cron scheduler handler instance.
	 *
	 * @var Verification_Cron_Schedule_Handler
	 */
	protected $cron_schedule_handler;

	/**
	 * The options helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The verification cron batch handler.
	 *
	 * @var Verification_Cron_Batch_Handler
	 */
	protected $cron_batch_handler;

	/**
	 * The non timestamp command handler.
	 *
	 * @var Verify_Non_Timestamp_Indexables_Command_Handler
	 */
	protected $non_timestamp_indexables_command_handler;

	/**
	 * The next verification action handler instance.
	 *
	 * @var Next_Verification_Action_Handler
	 */
	protected $verification_action_handler;

	/**
	 * The cron verification gate instance.
	 *
	 * @var Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * The constructor.
	 *
	 * @param Cron_Verification_Gate                          $cron_verification_gate The cron verification gate.
	 * @param Verification_Cron_Schedule_Handler              $cron_schedule_handler The cron schedule handler.
	 * @param Options_Helper                                  $options_helper The options helper.
	 * @param Verification_Cron_Batch_Handler                 $cron_batch_handler The cron batch handler.
	 * @param Verify_Non_Timestamp_Indexables_Command_Handler $non_timestamp_indexables_command_handler The non timestamp indexables command handler.
	 * @param Next_Verification_Action_Handler                $verification_action_handler The verification action handler.
	 */
	public function __construct(
		Cron_Verification_Gate $cron_verification_gate,
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Options_Helper $options_helper,
		Verification_Cron_Batch_Handler $cron_batch_handler,
		Verify_Non_Timestamp_Indexables_Command_Handler $non_timestamp_indexables_command_handler,
		Next_Verification_Action_Handler $verification_action_handler
	) {
		$this->cron_verification_gate                   = $cron_verification_gate;
		$this->cron_schedule_handler                    = $cron_schedule_handler;
		$this->options_helper                           = $options_helper;
		$this->cron_batch_handler                       = $cron_batch_handler;
		$this->non_timestamp_indexables_command_handler = $non_timestamp_indexables_command_handler;
		$this->verification_action_handler              = $verification_action_handler;
	}

	/**
	 * Registers the hooks with WordPress.
	 */
	public function register_hooks() {
		\add_action(
			Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME,
			[
				$this,
				'start_verify_non_timestamped_indexables',
			]
		);
	}

	/**
	 * Start the non timestamp cron handler callback.
	 *
	 * @return void
	 */
	public function start_verify_non_timestamped_indexables() {
		if ( \wp_doing_cron() && ! $this->cron_verification_gate->should_verify_on_cron() ) {
			$this->cron_schedule_handler->unschedule_verify_non_timestamped_indexables_cron();

			return;
		}

		$batch_size    = 10;
		$current_batch = $this->cron_batch_handler->get_current_non_timestamped_indexables_batch();
		$action        = $this->verification_action_handler->get_current_verification_action();
		$command       = new Verify_Non_Timestamp_Indexables_Command( $current_batch, $batch_size, $action );

		$this->non_timestamp_indexables_command_handler->handle( $command );
	}
}
