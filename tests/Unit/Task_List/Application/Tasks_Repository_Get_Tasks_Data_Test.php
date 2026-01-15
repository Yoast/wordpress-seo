<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application;

/**
 * Test class for getting tasks data.
 *
 * @group Tasks_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks_Repository::get_tasks_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Repository_Get_Tasks_Data_Test extends Abstract_Tasks_Repository_Test {

	/**
	 * Tests getting tasks data.
	 *
	 * @return void
	 */
	public function test_get_tasks_data() {
		$expected_tasks = [
			'task1' => [
				'id'          => 'task1',
				'title'       => 'Test Task 1',
				'is_complete' => false,
			],
			'task2' => [
				'id'          => 'task2',
				'title'       => 'Test Task 2',
				'is_complete' => true,
			],
		];

		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $expected_tasks );

		$result = $this->instance->get_tasks_data();

		$this->assertSame( $expected_tasks, $result );
	}
}
