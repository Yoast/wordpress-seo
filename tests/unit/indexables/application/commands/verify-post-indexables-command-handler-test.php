<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application\Commands;

use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Ports\Outdated_Post_Indexables_Repository_Interface;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Indexables_Action;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verify_Non_Timestamp_Indexables_Command_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Commands\Verify_Post_Indexables_Command_Handler
 */
class Verify_Post_Indexables_Command_Handler_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Verify_Post_Indexables_Command_Handler
	 */
	private $instance;

	/**
	 * The cron schedule handler.
	 *
	 * @var MockInterface|Verification_Cron_Schedule_Handler $cron_schedule_handler
	 */
	private $cron_schedule_handler;

	/**
	 * The cron batch handler.
	 *
	 * @var MockInterface|Verification_Cron_Batch_Handler $cron_batch_handler
	 */
	private $cron_batch_handler;

	/**
	 * The outdated post indexable repository.
	 *
	 * @var MockInterface|Outdated_Post_Indexables_Repository_Interface $outdated_post_indexables_repository
	 */
	private $outdated_post_indexables_repository;

	/**
	 * The indexable builder.
	 *
	 * @var MockInterface|Indexable_Builder $indexables_builder
	 */
	private $indexables_builder;

	/**
	 * The command.
	 *
	 * @var Verify_Non_Timestamp_Indexables_Command $command
	 */
	private $command;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->cron_schedule_handler               = Mockery::mock( Verification_Cron_Schedule_Handler::class );
		$this->cron_batch_handler                  = Mockery::mock( Verification_Cron_Batch_Handler::class );
		$this->outdated_post_indexables_repository = Mockery::mock( Outdated_Post_Indexables_Repository_Interface::class );
		$this->indexables_builder                  = Mockery::mock( Indexable_Builder::class );
		$this->command                             = new Verify_Post_Indexables_Command( 1, 0 );
		$this->instance                            = new Verify_Post_Indexables_Command_Handler( $this->outdated_post_indexables_repository, $this->cron_schedule_handler, $this->cron_batch_handler, $this->indexables_builder );
	}

	/**
	 * Tests the handle function.
	 *
	 * @covers ::handle
	 * @return void
	 */
	public function test_handle_with_next_batch() {

		$indexable_list  = new Outdated_Post_Indexables_List();
		$indexable_mock  = Mockery::mock( Indexable::class );
		$indexable_mock1 = Mockery::mock( Indexable::class );
		$indexable_mock2 = Mockery::mock( Indexable::class );
		$indexable_mock3 = Mockery::mock( Indexable::class );
		$indexable_list->add_post_indexable( $indexable_mock );
		$indexable_list->add_post_indexable( $indexable_mock1 );
		$indexable_list->add_post_indexable( $indexable_mock2 );
		$indexable_list->add_post_indexable( $indexable_mock3 );
		$this->outdated_post_indexables_repository->expects( 'get_outdated_post_indexables' )
			->with( $this->command->get_last_batch_count() )
			->andReturn( $indexable_list );


		$this->indexables_builder->expects()->build( $indexable_mock );
		$this->indexables_builder->expects()->build( $indexable_mock1 );
		$this->indexables_builder->expects()->build( $indexable_mock2 );
		$this->indexables_builder->expects()->build( $indexable_mock3 );

		$this->cron_batch_handler->expects( 'set_current_post_indexables_batch' )
			->with( $this->command->get_last_batch_count(), $this->command->get_batch_size() );
		$this->instance->handle( $this->command );
	}

	/**
	 * Tests the handle function.
	 *
	 * @covers ::handle
	 * @return void
	 */
	public function test_handle_with_action_not_found() {
		$this->outdated_post_indexables_repository->expects( 'get_outdated_post_indexables' )
			->with( $this->command->get_last_batch_count() )
			->andThrow( new No_Outdated_Posts_Found_Exception() );
		$this->cron_schedule_handler->expects( 'unschedule_verify_post_indexables_cron' )->once();
		$this->instance->handle( $this->command );
	}
}
