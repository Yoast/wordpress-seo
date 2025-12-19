<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Invalid_Post_Type_Tasks_Exception;
use Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration;

/**
 * Test class for register_post_type_tasks.
 *
 * @group Register_Post_Type_Tasks_Integration
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration::register_post_type_tasks
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration::get_post_type_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Post_Type_Tasks_Integration_Register_Post_Type_Tasks_Test extends Abstract_Register_Post_Type_Tasks_Integration_Test {

	/**
	 * Tests register_post_type_tasks with no post type tasks.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_no_tasks() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post', 'page', 'product' ] );

		$existing_tasks = [ 'existing-task' => 'task-data' ];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		$this->assertSame( $existing_tasks, $result );
	}

	/**
	 * Tests register_post_type_tasks with post type tasks.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_with_tasks() {
		$post_type_task = $this->create_duplicatable_post_type_task( 'search-appearance', [ 'post', 'page' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $post_type_task ] );

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post', 'page', 'attachment', 'custom_post' ] );

		$existing_tasks = [ 'existing-task' => 'task-data' ];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		// Should contain existing tasks plus the duplicated post type tasks.
		$this->assertArrayHasKey( 'existing-task', $result );
		$this->assertCount( 3, $result ); // 1 existing + 2 duplicated tasks.
	}

	/**
	 * Tests register_post_type_tasks filters post types to allowed ones.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_filters_allowed_post_types() {
		$post_type_task = $this->create_duplicatable_post_type_task( 'search-appearance', [ 'post', 'page', 'product' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $post_type_task ] );

		// Return more post types than allowed.
		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post', 'page', 'attachment', 'custom_post', 'product', 'shop_order' ] );

		$existing_tasks = [];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		// Should only create tasks for 'post', 'page', and 'product' (intersection with allowed types).
		$this->assertCount( 3, $result );
	}

	/**
	 * Tests register_post_type_tasks with no public post types.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_no_public_post_types() {
		$post_type_task = $this->create_mock_post_type_task( 'search-appearance' );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $post_type_task ] );

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [] );

		$existing_tasks = [ 'existing-task' => 'task-data' ];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		// Should return only existing tasks since no public post types match allowed ones.
		$this->assertSame( $existing_tasks, $result );
	}

	/**
	 * Tests register_post_type_tasks with public post types but none in allowed list.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_no_allowed_post_types() {
		$post_type_task = $this->create_mock_post_type_task( 'search-appearance' );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $post_type_task ] );

		// Return post types not in the allowed list.
		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'attachment', 'revision', 'nav_menu_item' ] );

		$existing_tasks = [ 'existing-task' => 'task-data' ];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		// Should return only existing tasks since no intersection with allowed post types.
		$this->assertSame( $existing_tasks, $result );
	}

	/**
	 * Tests register_post_type_tasks with multiple tasks and post types.
	 *
	 * @return void
	 */
	public function test_register_post_type_tasks_multiple_tasks_and_post_types() {
		$task1 = $this->create_duplicatable_post_type_task( 'task-1', [ 'post', 'page' ] );
		$task2 = $this->create_duplicatable_post_type_task( 'task-2', [ 'post', 'page' ] );

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $task1, $task2 ] );

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post', 'page' ] );

		$existing_tasks = [ 'existing-task' => 'task-data' ];
		$result         = $this->instance->register_post_type_tasks( $existing_tasks );

		$this->assertCount( 5, $result );
		$this->assertArrayHasKey( 'existing-task', $result );
	}

	/**
	 * Tests get_post_type_tasks when invalid tasks are provided.
	 *
	 * @return void
	 */
	public function test_register_post_type_invalid_tasks_multiple_tasks_and_post_types() {
		$invalid_task = [ 'invalid-task' => 'task-data' ];

		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_task_list_post_type_tasks', [] )
			->andReturn( [ $invalid_task ] );

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'irrelevant' ] );

		$this->expectException( Invalid_Post_Type_Tasks_Exception::class );

		$this->instance->register_post_type_tasks( [] );
	}
}
