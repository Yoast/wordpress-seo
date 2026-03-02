<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Sample_Page;

use Brain\Monkey;
use Mockery;
use WP_Post;

/**
 * Test class for the is_valid method.
 *
 * @group Delete_Sample_Page
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::is_valid
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Delete_Sample_Page_Is_Valid_Test extends Abstract_Delete_Sample_Page_Test {

	/**
	 * Tests that the task is valid when the sample page does not exist.
	 *
	 * @return void
	 */
	public function test_is_valid_when_no_sample_page() {
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

		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests that the task is valid when the sample page exists and has not been modified.
	 *
	 * @return void
	 */
	public function test_is_valid_when_sample_page_is_unmodified() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:12';

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

		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests that the task is invalid when the sample page has been modified.
	 *
	 * @return void
	 */
	public function test_is_invalid_when_sample_page_is_modified() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:13';

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

		$this->assertFalse( $this->instance->is_valid() );
	}
}
