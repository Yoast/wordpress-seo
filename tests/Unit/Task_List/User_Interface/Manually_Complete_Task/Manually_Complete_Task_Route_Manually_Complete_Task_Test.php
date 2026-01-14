<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Manually_Complete_Task;

use Brain\Monkey\Functions;
use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;

/**
 * Test class for manually_complete_task.
 *
 * @group Manually_Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Manually_Complete_Task_Route::manually_complete_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Route_Manually_Complete_Task_Test extends Abstract_Manually_Complete_Task_Route_Test {

	/**
	 * Tests manually completing a task successfully.
	 *
	 * @return void
	 */
	public function test_manually_complete_task_success() {
		$task    = Mockery::mock( Task_Interface::class );
		$request = $this->create_mock_request(
			[
				'task_id'   => 'task1',
				'completed' => true,
			]
		);

		$this->tasks_collector->expects( 'get_task' )
			->once()
			->with( 'task1' )
			->andReturn( $task );

		$this->manual_task_completion_repository->expects( 'set_task_manually_completed' )
			->once()
			->with( 'task1' );
		$this->manual_task_completion_repository->expects( 'clear_task_manual_completion' )->never();

		Functions\expect( 'delete_transient' )
			->once()
			->with( Cached_Tasks_Collector::TASKS_TRANSIENT );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->manually_complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests clearing manual completion for a task successfully.
	 *
	 * @return void
	 */
	public function test_manually_complete_task_clear_completion() {
		$task    = Mockery::mock( Task_Interface::class );
		$request = $this->create_mock_request(
			[
				'task_id'   => 'task1',
				'completed' => false,
			]
		);

		$this->tasks_collector->expects( 'get_task' )
			->once()
			->with( 'task1' )
			->andReturn( $task );

		$this->manual_task_completion_repository->expects( 'set_task_manually_completed' )->never();
		$this->manual_task_completion_repository->expects( 'clear_task_manual_completion' )
			->once()
			->with( 'task1' );

		Functions\expect( 'delete_transient' )
			->once()
			->with( Cached_Tasks_Collector::TASKS_TRANSIENT );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->manually_complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests manually completing a task when task is not found.
	 *
	 * @return void
	 */
	public function test_manually_complete_task_not_found() {
		$request = $this->create_mock_request(
			[
				'task_id'   => 'non-existent-task',
				'completed' => true,
			]
		);

		$this->tasks_collector->expects( 'get_task' )
			->once()
			->with( 'non-existent-task' )
			->andReturn( null );

		$this->manual_task_completion_repository->expects( 'set_task_manually_completed' )->never();
		$this->manual_task_completion_repository->expects( 'clear_task_manual_completion' )->never();

		// Should not call delete_transient when task fails.
		Functions\expect( 'delete_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->manually_complete_task( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
