<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Sample_Page;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Complete_Sample_Page_Task_Exception;

/**
 * Test class for completing the task.
 *
 * @group Delete_Sample_Page
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::complete_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Delete_Sample_Page_Complete_Task_Test extends Abstract_Delete_Sample_Page_Test {

	/**
	 * Tests the complete_task method when completed successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_success() {
		$post     = Mockery::mock( WP_Post::class );
		$post->ID = 5;

		$get_posts_args = [
			'name'        => 'sample-page',
			'post_type'   => 'page',
			'post_status' => 'publish',
			'numberposts' => 1,
		];

		Monkey\Functions\expect( 'get_posts' )
			->once()
			->with( $get_posts_args )
			->andReturn( [ $post ] );

		Monkey\Functions\expect( 'wp_delete_post' )
			->once()
			->with( 5 )
			->andReturn( true );

		$this->instance->complete_task();
	}

	/**
	 * Tests the complete_task method when completed not successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_failure() {
		$post     = Mockery::mock( WP_Post::class );
		$post->ID = 5;

		$get_posts_args = [
			'name'        => 'sample-page',
			'post_type'   => 'page',
			'post_status' => 'publish',
			'numberposts' => 1,
		];

		Monkey\Functions\expect( 'get_posts' )
			->once()
			->with( $get_posts_args )
			->andReturn( [ $post ] );

		Monkey\Functions\expect( 'wp_delete_post' )
			->once()
			->with( 5 )
			->andReturn( false );

		$this->expectException( Complete_Sample_Page_Task_Exception::class );

		$this->instance->complete_task();
	}

	/**
	 * Tests the complete_task method when there is no sample page to delete.
	 *
	 * @return void
	 */
	public function test_complete_task_no_sample_page() {
		$get_posts_args = [
			'name'        => 'sample-page',
			'post_type'   => 'page',
			'post_status' => 'publish',
			'numberposts' => 1,
		];

		Monkey\Functions\expect( 'get_posts' )
			->once()
			->with( $get_posts_args )
			->andReturn( [] );

		Monkey\Functions\expect( 'wp_delete_post' )
			->never();

		$this->instance->complete_task();
	}
}
