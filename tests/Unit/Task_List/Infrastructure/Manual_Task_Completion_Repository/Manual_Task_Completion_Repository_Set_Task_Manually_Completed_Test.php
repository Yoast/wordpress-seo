<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Manual_Task_Completion_Repository;

/**
 * Test class for set_task_manually_completed.
 *
 * @group Manual_Task_Completion_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Manual_Task_Completion_Repository::set_task_manually_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manual_Task_Completion_Repository_Set_Task_Manually_Completed_Test extends Abstract_Manual_Task_Completion_Repository_Test {

	/**
	 * Tests that set_task_manually_completed adds the task to the list.
	 *
	 * @return void
	 */
	public function test_set_task_manually_completed_adds_task() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1' ] );

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'manually_completed_tasks', [ 'task1', 'task2' ] );

		$this->instance->set_task_manually_completed( 'task2' );
	}

	/**
	 * Tests that set_task_manually_completed does not add duplicates.
	 *
	 * @return void
	 */
	public function test_set_task_manually_completed_avoids_duplicates() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [ 'task1', 'task2' ] );

		$this->options_helper->expects( 'set' )->never();

		$this->instance->set_task_manually_completed( 'task1' );
	}

	/**
	 * Tests that set_task_manually_completed adds the first task to an empty list.
	 *
	 * @return void
	 */
	public function test_set_task_manually_completed_adds_first_task() {
		$this->options_helper->expects( 'get' )
			->once()
			->with( 'manually_completed_tasks', [] )
			->andReturn( [] );

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'manually_completed_tasks', [ 'task1' ] );

		$this->instance->set_task_manually_completed( 'task1' );
	}
}
