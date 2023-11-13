<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Application\Commands;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;

/**
 * Command handler class.
 */
class Verify_Post_Indexables_Command_Handler {

	/**
	 * The Outdated_Post_Indexables_Repository_Interface instance.
	 *
	 * @var Outdated_Post_Indexables_Repository_Interface
	 */
	protected $outdated_post_indexables_repository;

	/**
	 * The Verification_Cron_Batch_Handler instance.
	 *
	 * @var Verification_Cron_Batch_Handler
	 */
	protected $verification_cron_batch_handler;

	/**
	 * The Verification_Cron_Schedule_Handler instance.
	 *
	 * @var Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;

	/**
	 * The Indexable_Builder instance.
	 *
	 * @var Indexable_Builder
	 */
	protected $indexable_builder;

	/**
	 * The constructor.
	 *
	 * @param Outdated_Post_Indexables_Repository_Interface $outdated_post_indexables_repository The outdated post
	 *                                                                                           indexables repository.
	 * @param Verification_Cron_Schedule_Handler            $cron_schedule_handler               The cron schedule
	 *                                                                                           handler.
	 * @param Verification_Cron_Batch_Handler               $verification_cron_batch_handler     The verification cron
	 *                                                                                           batch handler.
	 * @param Indexable_Builder                             $indexable_builder                   The indexable builder.
	 */
	public function __construct(
		Outdated_Post_Indexables_Repository_Interface $outdated_post_indexables_repository,
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Verification_Cron_Batch_Handler $verification_cron_batch_handler,
		Indexable_Builder $indexable_builder
	) {

		$this->outdated_post_indexables_repository = $outdated_post_indexables_repository;
		$this->cron_schedule_handler               = $cron_schedule_handler;
		$this->indexable_builder                   = $indexable_builder;
		$this->verification_cron_batch_handler     = $verification_cron_batch_handler;
	}

	/**
	 * Handles the Verify_Post_Indexables_Command command.
	 *
	 * @param Verify_Post_Indexables_Command $verify_post_indexables_command The command.
	 */
	public function handle( Verify_Post_Indexables_Command $verify_post_indexables_command ): void {
		try {
			$outdated_post_indexables_list = $this->outdated_post_indexables_repository->get_outdated_post_indexables( $verify_post_indexables_command->get_last_batch_count() );
		} catch ( No_Outdated_Posts_Found_Exception $exception ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();

			return;
		}

		foreach ( $outdated_post_indexables_list as $post_indexable ) {
			$this->indexable_builder->build( $post_indexable );
		}

		if ( ! $verify_post_indexables_command->get_batch_size()
			->should_keep_going( $outdated_post_indexables_list->count() ) ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();

			return;
		}

		$next_batch = ( $verify_post_indexables_command->get_last_batch_count()
				->get_last_batch() + $verify_post_indexables_command->get_batch_size()->get_batch_size() );
		$this->verification_cron_batch_handler->set_current_post_indexables_batch( $next_batch );
	}
}
