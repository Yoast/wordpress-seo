<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Manual_Task_Completion_Repository;

/**
 * Test class for clear_task_manual_completion.
 *
 * @group Manual_Task_Completion_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Manual_Task_Completion_Repository::clear_task_manual_completion
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manual_Task_Completion_Repository_Clear_Task_Manual_Completion_Test extends Abstract_Manual_Task_Completion_Repository_Test {

	/**
	 * Tests that clear_task_manual_completion removes the task from the list.
	 *
	 * @return void
	 */
	public function test_clear_task_manual_completion_removes_task() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1', 'task2', 'task3' ] );

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'manually_completed_tasks', [ 'task1', 'task3' ] );

		$this->instance->clear_task_manual_completion( 'task2' );
	}

	/**
	 * Tests that clear_task_manual_completion handles non-existent task gracefully.
	 *
	 * @return void
	 */
	public function test_clear_task_manual_completion_handles_non_existent_task() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1', 'task2' ] );

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'manually_completed_tasks', [ 'task1', 'task2' ] );

		$this->instance->clear_task_manual_completion( 'non-existent-task' );
	}

	/**
	 * Tests that clear_task_manual_completion handles empty list.
	 *
	 * @return void
	 */
	public function test_clear_task_manual_completion_handles_empty_list() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [] );

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'manually_completed_tasks', [] );

		$this->instance->clear_task_manual_completion( 'task1' );
	}
}
