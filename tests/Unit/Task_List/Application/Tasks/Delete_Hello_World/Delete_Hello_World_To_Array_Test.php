<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Hello_World;

use Brain\Monkey;
use Mockery;
use WP_Comment;
use WP_Post;

/**
 * Test class for getting the id.
 *
 * @group Delete_Hello_World
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_badge
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::get_link
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Delete_Hello_World_To_Array_Test extends Abstract_Delete_Hello_World_Test {

	/**
	 * Tests the task's to_array method when completed.
	 *
	 * @return void
	 */
	public function test_to_array_not_completed() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_status   = 'publish';
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:12';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		$get_comments_args             = [
			'post_id' => 1,
			'number'  => 1,
			'order'   => 'ASC',
		];
		$comment                       = Mockery::mock( WP_Comment::class );
		$comment->comment_author_email = 'wapuu@wordpress.example';
		Monkey\Functions\expect( 'get_comments' )
			->once()
			->with( $get_comments_args )
			->andReturn( [ $comment ] );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed because there's a post with ID 1 but no comments.
	 *
	 * @return void
	 */
	public function test_to_array_completed_because_has_no_comments() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_status   = 'publish';
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:12';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		$get_comments_args = [
			'post_id' => 1,
			'number'  => 1,
			'order'   => 'ASC',
		];
		Monkey\Functions\expect( 'get_comments' )
			->once()
			->with( $get_comments_args )
			->andReturn( [] );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when completed because there's a post with ID 1 but no comments with the right author.
	 *
	 * @return void
	 */
	public function test_to_array_completed_because_has_no_comments_with_right_author() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_status   = 'publish';
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:12';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		$get_comments_args             = [
			'post_id' => 1,
			'number'  => 1,
			'order'   => 'ASC',
		];
		$comment                       = Mockery::mock( WP_Comment::class );
		$comment->comment_author_email = 'not_wapuu@wordpress.example';
		Monkey\Functions\expect( 'get_comments' )
			->once()
			->with( $get_comments_args )
			->andReturn( [ $comment ] );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when hello world is deleted.
	 *
	 * @return void
	 */
	public function test_to_array_deleted_hello_world() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( null );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when hello world is modified.
	 *
	 * @return void
	 */
	public function test_to_array_modified_hello_world() {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_status   = 'publish';
		$post->post_date     = '2024-03-08 07:26:12';
		$post->post_modified = '2024-03-08 07:26:13';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		$get_comments_args             = [
			'post_id' => 1,
			'number'  => 1,
			'order'   => 'ASC',
		];
		$comment                       = Mockery::mock( WP_Comment::class );
		$comment->comment_author_email = 'wapuu@wordpress.example';
		Monkey\Functions\expect( 'get_comments' )
			->once()
			->with( $get_comments_args )
			->andReturn( [ $comment ] );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when hello world is unpublished.
	 *
	 * @return void
	 */
	public function test_to_array_unpublished_hello_world() {
		$post              = Mockery::mock( WP_Post::class );
		$post->post_status = 'draft';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		$expected_result = [
			'id'           => 'delete-hello-world',
			'duration'     => 1,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => [
				'label' => 'Delete for me',
				'type'  => 'delete',
				'href'  => null,
			],
			'title'        => 'Remove the “Hello World” post',
			'why'          => 'Leaving placeholder content makes your site look unfinished and untrustworthy. Removing it keeps your site clean and professional for visitors and search engines.',
			'how'          => null,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
