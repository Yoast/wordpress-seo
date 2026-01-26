<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors;

use Mockery;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Child_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_tasks_data with parent tasks.
 *
 * @group Tasks_Collector
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_tasks_data
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector::get_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Tasks_Collector_Parent_Tasks_Test extends Abstract_Tasks_Collector_Test {

	/**
	 * Tests that parent tasks have their child tasks generated and included in output.
	 *
	 * @return void
	 */
	public function test_parent_task_generates_and_includes_child_tasks() {
		$child_task_1 = $this->create_mock_child_task(
			'improve-content-seo-1',
			[
				'id'          => 'improve-content-seo-1',
				'title'       => 'Improve SEO for "First Post"',
				'is_complete' => false,
				'priority'    => 'high',
				'duration'    => 10,
			]
		);

		$child_task_2 = $this->create_mock_child_task(
			'improve-content-seo-2',
			[
				'id'          => 'improve-content-seo-2',
				'title'       => 'Improve SEO for "Second Post"',
				'is_complete' => true,
				'priority'    => 'medium',
				'duration'    => 10,
			]
		);

		$parent_task = $this->create_mock_parent_task(
			'improve-content-seo',
			[
				'id'          => 'improve-content-seo',
				'title'       => 'Improve content SEO',
				'is_complete' => false,
				'priority'    => 'medium',
				'duration'    => 10,
			],
			[ $child_task_1, $child_task_2 ]
		);

		$instance = new Tasks_Collector( $parent_task );
		$instance->set_tracking_link_adapter( $this->tracking_link_adapter );

		$this->tracking_link_adapter
			->expects( 'create_tracking_link_for_tasks' )
			->times( 3 )
			->andReturnArg( 0 );

		$result = $instance->get_tasks_data();

		$this->assertArrayHasKey( 'improve-content-seo', $result );
		$this->assertArrayHasKey( 'childTasks', $result['improve-content-seo'] );

		$child_tasks = $result['improve-content-seo']['childTasks'];
		$this->assertCount( 2, $child_tasks );
		$this->assertArrayHasKey( 'improve-content-seo-1', $child_tasks );
		$this->assertArrayHasKey( 'improve-content-seo-2', $child_tasks );
	}

	/**
	 * Tests that generate_child_tasks is called on parent tasks.
	 *
	 * @return void
	 */
	public function test_generate_child_tasks_is_called() {
		$parent_task = Mockery::mock( Parent_Task_Interface::class );
		$cta_mock    = $this->create_mock_cta();

		$parent_task->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( 'improve-content-seo' );
		$parent_task->shouldReceive( 'is_valid' )->zeroOrMoreTimes()->andReturn( true );
		$parent_task->shouldReceive( 'get_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );
		$parent_task->shouldReceive( 'set_enhanced_call_to_action' )->zeroOrMoreTimes();
		$parent_task->shouldReceive( 'to_array' )->andReturn( [ 'id' => 'improve-content-seo' ] );
		$parent_task->shouldReceive( 'get_child_tasks' )->andReturn( [] );

		// This is the key assertion - generate_child_tasks must be called.
		$parent_task->expects( 'generate_child_tasks' )->once();

		$instance = new Tasks_Collector( $parent_task );
		$instance->set_tracking_link_adapter( $this->tracking_link_adapter );

		$this->tracking_link_adapter
			->shouldReceive( 'create_tracking_link_for_tasks' )
			->andReturnArg( 0 );

		$instance->get_tasks_data();
	}

	/**
	 * Tests that child tasks have enhanced CTA links.
	 *
	 * @return void
	 */
	public function test_child_tasks_have_enhanced_cta_links() {
		$cta_mock = $this->create_mock_cta();

		$child_task = Mockery::mock( Child_Task_Interface::class );
		$child_task->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( 'improve-content-seo-1' );
		$child_task->shouldReceive( 'is_valid' )->zeroOrMoreTimes()->andReturn( true );
		$child_task->shouldReceive( 'get_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );
		$child_task->shouldReceive( 'to_array' )->andReturn( [ 'id' => 'improve-content-seo-1' ] );

		// The child task should have set_enhanced_call_to_action called exactly once.
		$child_task->expects( 'set_enhanced_call_to_action' )->once();

		$parent_task = $this->create_mock_parent_task(
			'improve-content-seo',
			[
				'id'          => 'improve-content-seo',
				'title'       => 'Improve content SEO',
				'is_complete' => false,
				'priority'    => 'medium',
				'duration'    => 10,
			],
			[ $child_task ]
		);

		$instance = new Tasks_Collector( $parent_task );
		$instance->set_tracking_link_adapter( $this->tracking_link_adapter );

		$this->tracking_link_adapter
			->expects( 'create_tracking_link_for_tasks' )
			->times( 2 )
			->andReturnArg( 0 );

		$instance->get_tasks_data();
	}

	/**
	 * Creates a mock parent task.
	 *
	 * @param string                  $id          The task ID.
	 * @param array<string,bool>      $to_array    The array representation.
	 * @param Mockery\MockInterface[] $child_tasks The child tasks.
	 *
	 * @return Mockery\MockInterface
	 */
	private function create_mock_parent_task( $id, $to_array, $child_tasks = [] ) {
		$mock     = Mockery::mock( Parent_Task_Interface::class );
		$cta_mock = $this->create_mock_cta();

		$mock->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $id );
		$mock->shouldReceive( 'is_valid' )->zeroOrMoreTimes()->andReturn( true );
		$mock->shouldReceive( 'get_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );
		$mock->shouldReceive( 'set_enhanced_call_to_action' )->zeroOrMoreTimes();
		$mock->shouldReceive( 'generate_child_tasks' )->zeroOrMoreTimes();
		$mock->shouldReceive( 'get_child_tasks' )->andReturn( $child_tasks );
		$mock->expects( 'to_array' )->andReturn( $to_array );

		return $mock;
	}

	/**
	 * Creates a mock child task.
	 *
	 * @param string             $id       The task ID.
	 * @param array<string,bool> $to_array The array representation.
	 *
	 * @return Mockery\MockInterface
	 */
	private function create_mock_child_task( $id, $to_array ) {
		$mock     = Mockery::mock( Child_Task_Interface::class );
		$cta_mock = $this->create_mock_cta();

		$mock->shouldReceive( 'get_id' )->zeroOrMoreTimes()->andReturn( $id );
		$mock->shouldReceive( 'is_valid' )->zeroOrMoreTimes()->andReturn( true );
		$mock->shouldReceive( 'get_call_to_action' )->zeroOrMoreTimes()->andReturn( $cta_mock );
		$mock->shouldReceive( 'set_enhanced_call_to_action' )->zeroOrMoreTimes();
		$mock->expects( 'to_array' )->andReturn( $to_array );

		return $mock;
	}
}
