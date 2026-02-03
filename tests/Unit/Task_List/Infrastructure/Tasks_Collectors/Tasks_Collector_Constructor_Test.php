<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for the constructor.
 *
 * @group Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Constructor_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests constructor with no tasks.
	 *
	 * @return void
	 */
	public function test_constructor_no_tasks() {
		$instance = new Tasks_Collector();
		$tasks    = $this->getPropertyValue( $instance, 'tasks' );

		$this->assertIsArray( $tasks );
		$this->assertEmpty( $tasks );
	}

	/**
	 * Tests constructor with regular tasks.
	 *
	 * @return void
	 */
	public function test_constructor_with_regular_tasks() {
		$task1 = $this->create_mock_task( 'task-1' );
		$task2 = $this->create_mock_task( 'task-2' );

		$instance = new Tasks_Collector( $task1, $task2 );
		$tasks    = $this->getPropertyValue( $instance, 'tasks' );

		$this->assertCount( 2, $tasks );
		$this->assertArrayHasKey( 'task-1', $tasks );
		$this->assertArrayHasKey( 'task-2', $tasks );
		$this->assertSame( $task1, $tasks['task-1'] );
		$this->assertSame( $task2, $tasks['task-2'] );
	}

	/**
	 * Tests constructor filters out post type tasks.
	 *
	 * @return void
	 */
	public function test_constructor_filters_post_type_tasks() {
		$regular_task   = $this->create_mock_task( 'regular-task' );
		$post_type_task = $this->create_mock_task( 'post-type-task', [], Post_Type_Task_Interface::class );

		$instance = new Tasks_Collector( $regular_task, $post_type_task );
		$tasks    = $this->getPropertyValue( $instance, 'tasks' );

		$this->assertCount( 1, $tasks );
		$this->assertArrayHasKey( 'regular-task', $tasks );
		$this->assertArrayNotHasKey( 'post-type-task', $tasks );
		$this->assertSame( $regular_task, $tasks['regular-task'] );
	}

	/**
	 * Tests constructor with mixed task types.
	 *
	 * @return void
	 */
	public function test_constructor_with_mixed_tasks() {
		$regular_task      = $this->create_mock_task( 'regular-task' );
		$completeable_task = $this->create_mock_task( 'completeable-task', [], Completeable_Task_Interface::class );
		$post_type_task1   = $this->create_mock_task( 'post-type-1', [], Post_Type_Task_Interface::class );
		$post_type_task2   = $this->create_mock_task( 'post-type-2', [], Post_Type_Task_Interface::class );

		$instance = new Tasks_Collector( $regular_task, $completeable_task, $post_type_task1, $post_type_task2 );
		$tasks    = $this->getPropertyValue( $instance, 'tasks' );

		$this->assertCount( 2, $tasks );
		$this->assertArrayHasKey( 'regular-task', $tasks );
		$this->assertArrayHasKey( 'completeable-task', $tasks );
		$this->assertArrayNotHasKey( 'post-type-1', $tasks );
		$this->assertArrayNotHasKey( 'post-type-2', $tasks );
	}
}
