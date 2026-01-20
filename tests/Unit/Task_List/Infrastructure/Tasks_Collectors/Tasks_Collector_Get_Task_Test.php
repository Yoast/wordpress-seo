<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_task.
 *
 * @group Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Get_Task_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests getting an existing task.
	 *
	 * @return void
	 */
	public function test_get_existing_task() {
		$task1 = $this->create_mock_task( 'task-1' );
		$task2 = $this->create_mock_task( 'task-2' );
		$tasks = [
			'task-1' => $task1,
			'task-2' => $task2,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $tasks )
			->andReturn( $tasks );

		$instance = new Tasks_Collector( $task1, $task2 );
		$result   = $instance->get_task( 'task-1' );

		$this->assertSame( $task1, $result );
	}

	/**
	 * Tests getting a non-existing task.
	 *
	 * @return void
	 */
	public function test_get_non_existing_task() {
		$task1 = $this->create_mock_task( 'task-1' );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', [ 'task-1' => $task1 ] )
			->andReturn( [ 'task-1' => $task1 ] );

		$instance = new Tasks_Collector( $task1 );
		$result   = $instance->get_task( 'non-existing-task' );

		$this->assertNull( $result );
	}

	/**
	 * Tests getting task from empty collector.
	 *
	 * @return void
	 */
	public function test_get_task_empty_collector() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', [] )
			->andReturn( [] );

		$instance = new Tasks_Collector();
		$result   = $instance->get_task( 'any-task' );

		$this->assertNull( $result );
	}
}
