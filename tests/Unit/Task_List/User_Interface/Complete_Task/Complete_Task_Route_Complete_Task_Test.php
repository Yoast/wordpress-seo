<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Complete_Task;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;

/**
 * Test class for complete_task.
 *
 * @group Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route::complete_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_Task_Route_Complete_Task_Test extends Abstract_Complete_Task_Route_Test {

	/**
	 * Tests completing a task successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_success() {
		$task    = $this->create_mock_completeable_task( 'complete-ftc' );
		$request = $this->create_mock_request( [ 'task' => 'complete-ftc' ] );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_first_actioned_on' );

		$this->tasks_collector->expects( 'get_completeable_task' )
			->once()
			->with( 'complete-ftc' )
			->andReturn( $task );

		$task->expects( 'complete_task' )
			->once();

		Functions\expect( 'delete_transient' )
			->once()
			->with( Cached_Tasks_Collector::TASKS_TRANSIENT );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests completing a task when task is not found.
	 *
	 * @return void
	 */
	public function test_complete_task_not_found() {
		$request = $this->create_mock_request( [ 'task' => 'non-existent-task' ] );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_first_actioned_on' );

		$this->tasks_collector->expects( 'get_completeable_task' )
			->once()
			->with( 'non-existent-task' )
			->andReturn( null );

		// Should not call delete_transient when task fails.
		Functions\expect( 'delete_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests completing a task when task throws an exception.
	 *
	 * @return void
	 */
	public function test_complete_task_throws_exception() {
		$task      = $this->create_mock_completeable_task( 'failing-task' );
		$request   = $this->create_mock_request( [ 'task' => 'failing-task' ] );
		$exception = new Exception( 'Task completion failed', 500 );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_first_actioned_on' );

		$this->tasks_collector->expects( 'get_completeable_task' )
			->once()
			->with( 'failing-task' )
			->andReturn( $task );

		$task->expects( 'complete_task' )
			->once()
			->andThrow( $exception );

		// Should not call delete_transient when task fails.
		Functions\expect( 'delete_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests completing a task when Task_Not_Found_Exception is thrown explicitly.
	 *
	 * @return void
	 */
	public function test_complete_task_not_found_exception() {
		$request = $this->create_mock_request( [ 'task' => 'non-existent-task' ] );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_first_actioned_on' );

		$this->tasks_collector->expects( 'get_completeable_task' )
			->once()
			->with( 'non-existent-task' )
			->andReturn( null );

		// Should not call delete_transient when task fails.
		Functions\expect( 'delete_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
