<?php


namespace Yoast\WP\SEO\Indexables\Application\Commands;

use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;

class Verify_Post_Indexables_Command_Handler {

	/**
	 * @var Outdated_Post_Indexables_Repository_Interface
	 */
	protected $outdated_post_indexables_repository;

	/**
	 * @var \Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler
	 */
	private $cron_schedule_handler;

	/**
	 * @var \Yoast\WP\SEO\Builders\Indexable_Post_Builder
	 */
	protected $indexable_post_builder;

	public function __construct(
		Outdated_Post_Indexables_Repository_Interface $outdated_post_indexables_repository,
		Verification_Cron_Schedule_Handler $cron_schedule_handler,
		Indexable_Post_Builder $indexable_post_builder
	) {

		$this->outdated_post_indexables_repository = $outdated_post_indexables_repository;
		$this->cron_schedule_handler               = $cron_schedule_handler;
		$this->indexable_post_builder              = $indexable_post_builder;
	}

	/**
	 * @param Verify_Post_Indexables_Command $verify_post_indexables_command
	 */
	public function handle( Verify_Post_Indexables_Command $verify_post_indexables_command ): void {
		// Need to do something with this.
		$batch_size = 10;

		try {
			$outdated_post_indexables_list = $this->outdated_post_indexables_repository->get_outdated_post_indexables( $verify_post_indexables_command->get_last_batch_count(), $verify_post_indexables_command->get_plugin_deactivated_at() );
		} catch ( No_Outdated_Posts_Found_Exception $exception ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();

			return;
		}

		foreach ( $outdated_post_indexables_list as $post_indexable ) {
			$this->indexable_post_builder->build( $post_indexable->object_id, $post_indexable );
		}

		if ( $outdated_post_indexables_list->count() < $batch_size ) {
			$this->cron_schedule_handler->unschedule_verify_post_indexables_cron();
		}
	}
}
