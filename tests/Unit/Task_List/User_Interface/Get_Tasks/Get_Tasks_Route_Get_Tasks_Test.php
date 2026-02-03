<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Get_Tasks;

use Exception;
use Mockery;
use WP_REST_Response;

/**
 * Test class for get_tasks.
 *
 * @group Get_Tasks_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Get_Tasks_Route::get_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Tasks_Route_Get_Tasks_Test extends Abstract_Get_Tasks_Route_Test {

	/**
	 * Tests getting tasks successfully.
	 *
	 * @return void
	 */
	public function test_get_tasks_success() {
		$expected_tasks = [
			'complete-ftc' => [
				'id'          => 'complete-ftc',
				'title'       => 'Complete First Time Configuration',
				'is_complete' => false,
				'priority'    => 'high',
				'duration'    => 15,
			],
			'create-content' => [
				'id'          => 'create-content',
				'title'       => 'Create New Content',
				'is_complete' => false,
				'priority'    => 'medium',
				'duration'    => 30,
			],
		];

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_list_first_opened_on' );

		$this->tasks_repository->expects( 'get_tasks_data' )
			->once()
			->andReturn( $expected_tasks );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->get_tasks();

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests getting tasks when repository throws an exception.
	 *
	 * @return void
	 */
	public function test_get_tasks_repository_throws_exception() {
		$exception = new Exception( 'Repository error', 500 );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_list_first_opened_on' );

		$this->tasks_repository->expects( 'get_tasks_data' )
			->once()
			->andThrow( $exception );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->get_tasks();

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests getting tasks with empty data.
	 *
	 * @return void
	 */
	public function test_get_tasks_empty_data() {
		$this->tasks_repository->expects( 'get_tasks_data' )
			->once()
			->andReturn( [] );

		$this->action_tracker->expects( 'track_version_for_performed_action' )
			->once()
			->with( 'task_list_first_opened_on' );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$result = $this->instance->get_tasks();

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
