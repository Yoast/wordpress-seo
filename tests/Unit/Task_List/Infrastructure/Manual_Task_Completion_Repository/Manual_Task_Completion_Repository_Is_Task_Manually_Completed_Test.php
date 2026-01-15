<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Manual_Task_Completion_Repository;

/**
 * Test class for is_task_manually_completed.
 *
 * @group Manual_Task_Completion_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Manual_Task_Completion_Repository::is_task_manually_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manual_Task_Completion_Repository_Is_Task_Manually_Completed_Test extends Abstract_Manual_Task_Completion_Repository_Test {

	/**
	 * Tests that is_task_manually_completed returns true when task is in the list.
	 *
	 * @return void
	 */
	public function test_is_task_manually_completed_returns_true() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1', 'task2' ] );

		$result = $this->instance->is_task_manually_completed( 'task1' );

		$this->assertTrue( $result );
	}

	/**
	 * Tests that is_task_manually_completed returns false when task is not in the list.
	 *
	 * @return void
	 */
	public function test_is_task_manually_completed_returns_false() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1', 'task2' ] );

		$result = $this->instance->is_task_manually_completed( 'task3' );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that is_task_manually_completed returns false when the list is empty.
	 *
	 * @return void
	 */
	public function test_is_task_manually_completed_returns_false_when_empty() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [] );

		$result = $this->instance->is_task_manually_completed( 'task1' );

		$this->assertFalse( $result );
	}
}
