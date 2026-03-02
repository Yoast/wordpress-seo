<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Sample_Page;

use Brain\Monkey;
use Mockery;
use WP_Post;

/**
 * Test class for the to_array method.
 *
 * @group Delete_Sample_Page
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_badge
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Sample_Page::get_link
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Delete_Sample_Page_To_Array_Test extends Abstract_Delete_Sample_Page_Test {

	/**
	 * Tests the task's to_array method when not completed.
	 *
	 * @return void
	 */
	public function test_to_array_not_completed() {
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

		$expected_result = [
			'id'           => 'delete-sample-page',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the "Sample Page"',
			'about'        => '<p>Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.</p>',
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed because the sample page does not exist.
	 *
	 * @return void
	 */
	public function test_to_array_completed() {
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

		$expected_result = [
			'id'           => 'delete-sample-page',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the "Sample Page"',
			'about'        => '<p>Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.</p>',
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed because the sample page has been modified.
	 *
	 * @return void
	 */
	public function test_to_array_completed_because_page_is_modified() {
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

		$expected_result = [
			'id'           => 'delete-sample-page',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the "Sample Page"',
			'about'        => '<p>Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.</p>',
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
