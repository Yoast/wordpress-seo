<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure;

use Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration;

/**
 * Test class for the constructor.
 *
 * @group Register_Post_Type_Tasks_Integration
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Post_Type_Tasks_Integration_Constructor_Test extends Abstract_Register_Post_Type_Tasks_Integration_Test {

	/**
	 * Tests constructor with no tasks.
	 *
	 * @return void
	 */
	public function test_constructor_no_tasks() {
		$instance = new Register_Post_Type_Tasks_Integration();
		$tasks    = $this->getPropertyValue( $instance, 'post_type_tasks' );

		$this->assertIsArray( $tasks );
		$this->assertEmpty( $tasks );
	}

	/**
	 * Tests constructor with post type tasks.
	 *
	 * @return void
	 */
	public function test_constructor_with_tasks() {
		$task1 = $this->create_mock_post_type_task( 'task-1' );
		$task2 = $this->create_mock_post_type_task( 'task-2' );

		$instance = new Register_Post_Type_Tasks_Integration( $task1, $task2 );
		$tasks    = $this->getPropertyValue( $instance, 'post_type_tasks' );

		$this->assertCount( 2, $tasks );
		$this->assertContains( $task1, $tasks );
		$this->assertContains( $task2, $tasks );
	}
}
