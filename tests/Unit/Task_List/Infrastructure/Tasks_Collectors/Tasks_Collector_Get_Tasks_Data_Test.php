<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_tasks_data.
 *
 * @group Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_tasks_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Get_Tasks_Data_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests getting tasks data.
	 *
	 * @dataProvider data_get_tasks_data
	 *
	 * @param array<string, array<string,bool>> $task_configs        Array of task configurations [id => to_array_result].
	 * @param array<string, array<string,bool>> $expected_tasks_data Expected tasks data result.
	 *
	 * @return void
	 */
	public function test_get_tasks_data( $task_configs, $expected_tasks_data ) {
		$tasks = [];
		foreach ( $task_configs as $id => $to_array_result ) {
			$tasks[] = $this->create_mock_task( $id, $to_array_result );
		}

		$instance = new Tasks_Collector( ...$tasks );
		$result   = $instance->get_tasks_data();

		$this->assertSame( $expected_tasks_data, $result );
	}

	/**
	 * Tests getting tasks data from empty collector.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_empty_collector() {
		$instance = new Tasks_Collector();
		$result   = $instance->get_tasks_data();

		$this->assertSame( [], $result );
	}

	/**
	 * Data provider for test_get_tasks_data.
	 *
	 * @return array<string, array<string, array<string,bool>>>
	 */
	public static function data_get_tasks_data() {
		return [
			'Single task' => [
				'task_configs' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete First Time Configuration',
						'is_complete' => false,
						'priority'    => 'high',
						'duration'    => 15,
					],
				],
				'expected_tasks_data' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete First Time Configuration',
						'is_complete' => false,
						'priority'    => 'high',
						'duration'    => 15,
					],
				],
			],
			'Multiple tasks' => [
				'task_configs' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete FTC',
						'is_complete' => true,
						'priority'    => 'high',
						'duration'    => 15,
					],
					'create-content'     => [
						'id'          => 'create-content',
						'title'       => 'Create New Content',
						'is_complete' => false,
						'priority'    => 'medium',
						'duration'    => 30,
					],
					'delete-hello-world' => [
						'id'          => 'delete-hello-world',
						'title'       => 'Delete Hello World Post',
						'is_complete' => false,
						'priority'    => 'low',
						'duration'    => 5,
					],
				],
				'expected_tasks_data' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete FTC',
						'is_complete' => true,
						'priority'    => 'high',
						'duration'    => 15,
					],
					'create-content'     => [
						'id'          => 'create-content',
						'title'       => 'Create New Content',
						'is_complete' => false,
						'priority'    => 'medium',
						'duration'    => 30,
					],
					'delete-hello-world' => [
						'id'          => 'delete-hello-world',
						'title'       => 'Delete Hello World Post',
						'is_complete' => false,
						'priority'    => 'low',
						'duration'    => 5,
					],
				],
			],
		];
	}
}
