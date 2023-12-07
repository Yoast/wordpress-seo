<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application\Commands;

use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command;
use Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler;
use Yoast\WP\SEO\Indexables\Application\Next_Verification_Action_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Batch_Handler;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Indexables_Action;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verify_Non_Timestamp_Indexables_Command_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Commands\Verify_Non_Timestamp_Indexables_Command_Handler
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Verify_Non_Timestamp_Indexables_Command_Handler_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Verify_Non_Timestamp_Indexables_Command_Handler $instance
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
	 * The indexable action factory.
	 *
	 * @var MockInterface|Verify_Indexables_Action_Factory_Interface $indexables_action_factory
	 */
	private $indexables_action_factory;

	/**
	 *  The next action handler.
	 *
	 * @var MockInterface|Next_Verification_Action_Handler $next_verification_action_handler
	 */
	private $next_verification_action_handler;

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

		$this->cron_schedule_handler            = Mockery::mock( Verification_Cron_Schedule_Handler::class );
		$this->cron_batch_handler               = Mockery::mock( Verification_Cron_Batch_Handler::class );
		$this->indexables_action_factory        = Mockery::mock( Verify_Indexables_Action_Factory_Interface::class );
		$this->next_verification_action_handler = Mockery::mock( Next_Verification_Action_Handler::class );
		$this->command                          = new Verify_Non_Timestamp_Indexables_Command( 10, 10, 'term' );
		$this->instance                         = new Verify_Non_Timestamp_Indexables_Command_Handler( $this->cron_schedule_handler, $this->cron_batch_handler, $this->indexables_action_factory, $this->next_verification_action_handler );
	}

	/**
	 * Tests the handle function.
	 *
	 * @covers ::handle
	 * @covers ::__construct
	 * @return void
	 */
	public function test_handle_with_next_batch() {

		$action_mock = Mockery::mock( Verify_Term_Indexables_Action::class );
		$action_mock->expects( 're_build_indexables' )->andReturnTrue();

		$this->indexables_action_factory->expects( 'get' )
			->with( $this->command->get_current_action() )
			->andReturn( $action_mock );
		$this->cron_batch_handler->expects( 'set_current_non_timestamped_indexables_batch' )
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
		$this->indexables_action_factory->expects( 'get' )
			->with( $this->command->get_current_action() )
			->andThrow( new Verify_Action_Not_Found_Exception() );
		$this->cron_schedule_handler->expects( 'unschedule_verify_non_timestamped_indexables_cron' )->once();
		$this->instance->handle( $this->command );
	}

	/**
	 * Tests the handle function.
	 *
	 * @covers ::handle
	 * @throws No_Verification_Action_Left_Exception Throws when there is no verification action left.
	 * @throws Verify_Action_Not_Found_Exception Throws when the verification action is not found.
	 * @return void
	 */
	public function test_handle_with_no_next_batch_action_found() {

		$action_mock = Mockery::mock( Verify_Term_Indexables_Action::class );
		$action_mock->expects( 're_build_indexables' )->andReturnFalse();

		$new_action = new Current_Verification_Action( 'general' );
		$this->indexables_action_factory->expects()
			->get( $this->command->get_current_action() )
			->andReturn( $action_mock );
		$this->indexables_action_factory->expects()
			->determine_next_verify_action( $this->command->get_current_action() )
			->andReturn( $new_action );
		$this->next_verification_action_handler->expects()->set_current_verification_action( $new_action );
		$this->cron_batch_handler->expects( 'set_current_non_timestamped_indexables_batch' );
		$this->instance->handle( $this->command );
	}

	/**
	 * Tests the handle function.
	 *
	 * @covers ::handle
	 * @throws No_Verification_Action_Left_Exception Throws when there is no verification action left.
	 * @throws Verify_Action_Not_Found_Exception Throws when the verification action is not found.
	 * @return void
	 */
	public function test_handle_with_no_next_batch_action_not_found() {

		$action_mock = Mockery::mock( Verify_Term_Indexables_Action::class );
		$action_mock->expects( 're_build_indexables' )->andReturnFalse();

		$new_action = new Current_Verification_Action( 'general' );
		$this->indexables_action_factory->expects()
			->get( $this->command->get_current_action() )
			->andReturn( $action_mock );
		$this->indexables_action_factory->expects()
			->determine_next_verify_action( $this->command->get_current_action() )
			->andThrow( new No_Verification_Action_Left_Exception() );
		$this->next_verification_action_handler->expects()->set_current_verification_action( $new_action )->never();
		$this->cron_batch_handler->expects( 'set_current_non_timestamped_indexables_batch' )->never();
		$this->cron_schedule_handler->expects( 'unschedule_verify_non_timestamped_indexables_cron' )->once();

		$this->instance->handle( $this->command );
	}
}
