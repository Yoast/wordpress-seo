<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Integrations\Integration_Interface;


/**
 * The Verification_Posts_Cron_Callback_Integration class.
 */
class Verification_Posts_Cron_Callback_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The verification cron schedule handler instance.
	 *
	 * @var Verification_Cron_Schedule_Handler $cron_schedule_handler
	 */
	private $cron_schedule_handler;

	/**
	 * The cron batch handler instance.
	 *
	 * @var Verification_Cron_Batch_Handler $cron_batch_handler
	 */
	private $cron_batch_handler;

	/**
	 * The verify post indexables command handler.
	 *
	 * @var Verify_Post_Indexables_Command_Handler $verify_post_indexables_command_handler
	 */
	private $verify_post_indexables_command_handler;

	/**
	 * The cron verification gate instance.
	 *
	 * @var Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * The constructor.
	 *
	 * @param Cron_Verification_Gate                 $cron_verification_gate                 The cron verification
	 *                                                                                       gate.
	 * @param Verification_Cron_Schedule_Handler     $cron_schedule_handler                  The cron schedule handler.
	 * @param Verification_Cron_Batch_Handler        $cron_batch_handler                     The cron batch handler.
	 * @param Verify_Post_Indexables_Command_Handler $verify_post_indexables_command_handler The verify post indexables command handler.
	 */
	public function __construct(
		Cron_Verification_Gate $cron_verification_gate,
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Verification_Cron_Batch_Handler $cron_batch_handler,
		Verify_Post_Indexables_Command_Handler $verify_post_indexables_command_handler
	) {
		$this->cron_verification_gate                 = $cron_verification_gate;
		$this->cron_schedule_handler                  = $cron_schedule_handler;
		$this->cron_batch_handler                     = $cron_batch_handler;
		$this->verify_post_indexables_command_handler = $verify_post_indexables_command_handler;
	}

	/**
	 * Registers the hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action(
			Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_POST_INDEXABLES_NAME,
			[
				$this,
				'start_verify_posts',
			]
		);
	}

	/**
	 * Starts the post verification post cron handlers.
	 *
	 * @return void
	 */
	public function start_verify_posts(): void {
		if ( \wp_doing_cron() && ! $this->cron_verification_gate->should_verify_on_cron() ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();

			return;
		}

		/**
		 * Filter: 'Yoast\WP\SEO\post_verify_indexing_limit_size' - Adds the possibility to limit the number of items that are indexed when in cron action.
		 *
		 * @api int $limit Maximum number of indexables to be indexed per indexing action.
		 */
		$batch_size = \apply_filters( 'Yoast\WP\SEO\post_verify_indexing_limit_size', 15 ); //@phpcs:ignore Yoast.NamingConventions.ValidHookName.MaxExceeded -- The name needs to be descriptive since it is a very niche use case
		$last_batch = $this->cron_batch_handler->get_current_post_indexables_batch();

		$this->verify_post_indexables_command_handler->handle( new Verify_Post_Indexables_Command( $batch_size, $last_batch ) );
	}
}
