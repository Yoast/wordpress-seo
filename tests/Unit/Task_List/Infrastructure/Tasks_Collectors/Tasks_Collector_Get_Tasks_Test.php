<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Invalid_Tasks_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_tasks.
 *
 * @group Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Get_Tasks_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests getting tasks when no filter modifications.
	 *
	 * @return void
	 */
	public function test_get_tasks_no_filter_modifications() {
		$task1 = $this->create_mock_task( 'task-1' );
		$task2 = $this->create_mock_task( 'task-2' );

		$expected_tasks = [
			'task-1' => $task1,
			'task-2' => $task2,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $expected_tasks )
			->andReturn( $expected_tasks );

		$instance = new Tasks_Collector( $task1, $task2 );
		$result   = $instance->get_tasks();

		$this->assertSame( $expected_tasks, $result );
	}

	/**
	 * Tests getting tasks when filter adds tasks.
	 *
	 * @return void
	 */
	public function test_get_tasks_filter_adds_tasks() {
		$task1           = $this->create_mock_task( 'task-1' );
		$additional_task = $this->create_mock_task( 'additional-task', [], Task_Interface::class );

		$original_tasks = [ 'task-1' => $task1 ];
		$filtered_tasks = [
			'task-1'          => $task1,
			'additional-task' => $additional_task,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $original_tasks )
			->andReturn( $filtered_tasks );

		$instance = new Tasks_Collector( $task1 );
		$result   = $instance->get_tasks();

		$this->assertSame( $filtered_tasks, $result );
	}

	/**
	 * Tests getting tasks from empty collector.
	 *
	 * @return void
	 */
	public function test_get_tasks_empty_collector() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', [] )
			->andReturn( [] );

		$instance = new Tasks_Collector();
		$result   = $instance->get_tasks();

		$this->assertSame( [], $result );
	}

	/**
	 * Tests that invalid tasks added via filter throw exception.
	 *
	 * @return void
	 */
	public function test_get_tasks_invalid_task_throws_exception() {
		$task1        = $this->create_mock_task( 'task-1' );
		$invalid_task = 'not-a-task-object';

		$original_tasks = [ 'task-1' => $task1 ];
		$filtered_tasks = [
			'task-1'  => $task1,
			'invalid' => $invalid_task,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $original_tasks )
			->andReturn( $filtered_tasks );

		$instance = new Tasks_Collector( $task1 );

		$this->expectException( Invalid_Tasks_Exception::class );
		$instance->get_tasks();
	}

	/**
	 * Tests that non-Task_Interface objects added via filter throw exception.
	 *
	 * @return void
	 */
	public function test_get_tasks_non_task_interface_throws_exception() {
		$task1           = $this->create_mock_task( 'task-1' );
		$non_task_object = Mockery::mock( 'SomeOtherClass' );

		$original_tasks = [ 'task-1' => $task1 ];
		$filtered_tasks = [
			'task-1'   => $task1,
			'non-task' => $non_task_object,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $original_tasks )
			->andReturn( $filtered_tasks );

		$instance = new Tasks_Collector( $task1 );

		$this->expectException( Invalid_Tasks_Exception::class );
		$instance->get_tasks();
	}

	/**
	 * Tests that non valid tasks are removed from the collection.
	 *
	 * @return void
	 */
	public function test_get_tasks_not_valid_task() {
		$task1 = $this->create_mock_task( 'task-1', [], Task_Interface::class, false );
		$task2 = $this->create_mock_task( 'task-2' );

		$expected_tasks_to_filter = [
			'task-1' => $task1,
			'task-2' => $task2,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $expected_tasks_to_filter )
			->andReturn( $expected_tasks_to_filter );

		$instance = new Tasks_Collector( $task1, $task2 );
		$result   = $instance->get_tasks();

		$expected_tasks = [
			'task-2' => $task2,
		];

		$this->assertSame( $expected_tasks, $result );
	}
}
