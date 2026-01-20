<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_completeable_task.
 *
 * @group Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_completeable_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Get_Completeable_Task_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests getting an existing completeable task.
	 *
	 * @return void
	 */
	public function test_get_existing_completeable_task() {
		$regular_task      = $this->create_mock_task( 'regular-task' );
		$completeable_task = $this->create_mock_task( 'completeable-task', [], Completeable_Task_Interface::class );
		$tasks             = [
			'regular-task'      => $regular_task,
			'completeable-task' => $completeable_task,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $tasks )
			->andReturn( $tasks );

		$instance = new Tasks_Collector( $regular_task, $completeable_task );
		$result   = $instance->get_completeable_task( 'completeable-task' );

		$this->assertSame( $completeable_task, $result );
		$this->assertInstanceOf( Completeable_Task_Interface::class, $result );
	}

	/**
	 * Tests getting a regular task as completeable task returns null.
	 *
	 * @return void
	 */
	public function test_get_regular_task_as_completeable_returns_null() {
		$regular_task      = $this->create_mock_task( 'regular-task' );
		$completeable_task = $this->create_mock_task( 'completeable-task', [], Completeable_Task_Interface::class );
		$tasks             = [
			'regular-task'      => $regular_task,
			'completeable-task' => $completeable_task,
		];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', $tasks )
			->andReturn( $tasks );

		$instance = new Tasks_Collector( $regular_task, $completeable_task );
		$result   = $instance->get_completeable_task( 'regular-task' );

		$this->assertNull( $result );
	}

	/**
	 * Tests getting a non-existing completeable task.
	 *
	 * @return void
	 */
	public function test_get_non_existing_completeable_task() {
		$completeable_task = $this->create_mock_task( 'completeable-task', [], Completeable_Task_Interface::class );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', [ 'completeable-task' => $completeable_task ] )
			->andReturn( [ 'completeable-task' => $completeable_task ] );

		$instance = new Tasks_Collector( $completeable_task );
		$result   = $instance->get_completeable_task( 'non-existing-task' );

		$this->assertNull( $result );
	}

	/**
	 * Tests getting completeable task from empty collector.
	 *
	 * @return void
	 */
	public function test_get_completeable_task_empty_collector() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_tasks', [] )
			->andReturn( [] );

		$instance = new Tasks_Collector();
		$result   = $instance->get_completeable_task( 'any-task' );

		$this->assertNull( $result );
	}
}
