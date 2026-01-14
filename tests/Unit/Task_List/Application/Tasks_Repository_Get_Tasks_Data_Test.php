<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application;

/**
 * Test class for getting tasks data.
 *
 * @group Tasks_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks_Repository::get_tasks_data
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks_Repository::apply_manual_completion_overrides
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Repository_Get_Tasks_Data_Test extends Abstract_Tasks_Repository_Test {

	/**
	 * Tests getting tasks data with no manual completion.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_no_manual_completion() {
		$base_tasks = [
			'task1' => [
				'id'          => 'task1',
				'title'       => 'Test Task 1',
				'isCompleted' => false,
			],
			'task2' => [
				'id'          => 'task2',
				'title'       => 'Test Task 2',
				'isCompleted' => true,
			],
		];

		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $base_tasks );

		$this->options_helper->expects( 'get' )
			->with( 'manually_completed_tasks', [] )
			->andReturn( [] );

		$result = $this->instance->get_tasks_data();
		$this->assertSame( $base_tasks, $result );
	}

	/**
	 * Tests getting tasks data with a manually completed task.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_with_manual_completion() {
		$base_tasks         = [
			'task1' => [
				'id'          => 'task1',
				'title'       => 'Test Task 1',
				'isCompleted' => false,
			],
			'task2' => [
				'id'          => 'task2',
				'title'       => 'Test Task 2',
				'isCompleted' => true,
			],
		];
		$manually_completed = [ 'task1' ];
		$expected_tasks     = $base_tasks;

		$expected_tasks['task1']['isCompleted'] = true;
		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $base_tasks );

		$this->options_helper->expects( 'get' )
			->with( 'manually_completed_tasks', [] )
			->andReturn( $manually_completed );

		$result = $this->instance->get_tasks_data();
		$this->assertSame( $expected_tasks, $result );
	}

	/**
	 * Tests getting tasks data with an empty string in manual completion (should be skipped).
	 *
	 * @return void
	 */
	public function test_get_tasks_data_with_empty_string_manual_completion() {
		$base_tasks         = [
			'task1' => [
				'id'          => 'task1',
				'title'       => 'Test Task 1',
				'isCompleted' => false,
			],
			'task2' => [
				'id'          => 'task2',
				'title'       => 'Test Task 2',
				'isCompleted' => true,
			],
		];
		$manually_completed = [ '' ];

		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $base_tasks );

		$this->options_helper->expects( 'get' )
			->with( 'manually_completed_tasks', [] )
			->andReturn( $manually_completed );

		$result = $this->instance->get_tasks_data();
		$this->assertSame( $base_tasks, $result );
	}

	/**
	 * Tests getting tasks data with a non-array manual completion value (should be ignored).
	 *
	 * @return void
	 */
	public function test_get_tasks_data_with_non_array_manual_completion() {
		$base_tasks = [
			'task1' => [
				'id'          => 'task1',
				'title'       => 'Test Task 1',
				'isCompleted' => false,
			],
			'task2' => [
				'id'          => 'task2',
				'title'       => 'Test Task 2',
				'isCompleted' => true,
			],
		];
		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $base_tasks );

		$this->options_helper->expects( 'get' )
			->with( 'manually_completed_tasks', [] )
			->andReturn( null );

		$result = $this->instance->get_tasks_data();
		$this->assertSame( $base_tasks, $result );
	}
}
