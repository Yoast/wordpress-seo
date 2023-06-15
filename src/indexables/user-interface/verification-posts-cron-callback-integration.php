<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Verification_Posts_Cron_Callback_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * @var \Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler
	 */
	protected $cron_schedule_handler;

	/**
	 * @var \Yoast\WP\SEO\Helpers\Options_Helper
	 */
	protected $options_helper;

	/**
	 * @var \Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler
	 */
	protected $cron_batch_handler;

	/**
	 * @var \Yoast\WP\SEO\Indexables\Application\Verify_Post_Indexables_Command_Handler
	 */
	protected $verify_post_indexables_command_handler;

	/**
	 * @var Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * @param Cron_Verification_Gate                 $cron_verification_gate
	 * @param Verification_Cron_Schedule_Handler     $cron_schedule_handler
	 * @param Options_Helper                         $options_helper
	 * @param Verification_Cron_Batch_Handler        $cron_batch_handler
	 * @param Verify_Post_Indexables_Command_Handler $verify_post_indexables_command_handler
	 */
	public function __construct(
		Cron_Verification_Gate $cron_verification_gate,
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Options_Helper $options_helper,
		Verification_Cron_Batch_Handler $cron_batch_handler,
		Verify_Post_Indexables_Command_Handler $verify_post_indexables_command_handler
	) {
		$this->cron_verification_gate                 = $cron_verification_gate;
		$this->cron_schedule_handler                  = $cron_schedule_handler;
		$this->options_helper                         = $options_helper;
		$this->cron_batch_handler                     = $cron_batch_handler;
		$this->verify_post_indexables_command_handler = $verify_post_indexables_command_handler;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action(
			//Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_POST_INDEXABLES_NAME,
		'admin_init',
			[
				$this,
				'start_verify_posts',
			]
		);
	}

	public function start_verify_posts(): void {
		if ( \wp_doing_cron() && ! $this->cron_verification_gate->should_verify_on_cron() ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();

			return;
		}
		$batch_size = 10;

		$last_batch         = $this->cron_batch_handler->get_current_post_indexables_batch();
		$plugin_deactivated = $this->options_helper->get( Mark_Deactivation_Integration::PLUGIN_DEACTIVATED_AT_OPTION, \time() );

		$this->verify_post_indexables_command_handler->handle( new Verify_Post_Indexables_Command( $batch_size, $last_batch, $plugin_deactivated ) );
	}
}
