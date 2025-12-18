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
	 * @param array<string, array<string,bool>> $task_configs               Array of task configurations [id => to_array_result].
	 * @param int                               $create_tracking_link_times Number of times create_tracking_link_for_tasks is expected to be called.
	 * @param array<string, array<string,bool>> $expected_tasks_data        Expected tasks data result.
	 *
	 * @return void
	 */
	public function test_get_tasks_data( $task_configs, $create_tracking_link_times, $expected_tasks_data ) {
		$tasks = [];
		foreach ( $task_configs as $id => $to_array_result ) {
			$mock_task = $this->create_mock_task( $id, $to_array_result );
			$mock_task->shouldReceive( 'set_enhanced_call_to_action' )->once();
			$tasks[] = $mock_task;
		}

		$instance = new Tasks_Collector( ...$tasks );
		$instance->set_tracking_link_adapter( $this->tracking_link_adapter );
		$this->tracking_link_adapter
			->expects( 'create_tracking_link_for_tasks' )
			->times( $create_tracking_link_times )
			->andReturnArg( 0 );

		$result = $instance->get_tasks_data();

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
				'task_configs'               => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete First Time Configuration',
						'is_complete' => false,
						'priority'    => 'high',
						'duration'    => 15,
					],
				],
				'create_tracking_link_times' => 1,
				'expected_tasks_data'        => [
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
				'task_configs'               => [
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
				'create_tracking_link_times' => 3,
				'expected_tasks_data'        => [
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
