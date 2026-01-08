<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Hello_World;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Complete_Hello_World_Task_Exception;

/**
 * Test class for completing the task.
 *
 * @group Delete_Hello_World
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World::complete_task
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Delete_Hello_World_Complete_Task_Test extends Abstract_Delete_Hello_World_Test {

	/**
	 * Tests the complete_task method when completed successfully.
	 *
	 * @return void
	 */
	public function test_complete_task_success() {
		$post     = Mockery::mock( WP_Post::class );
		$post->ID = 1;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		Monkey\Functions\expect( 'wp_delete_post' )
			->once()
			->with( 1 )
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
		$post->ID = 1;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )
			->andReturn( $post );

		Monkey\Functions\expect( 'wp_delete_post' )
			->once()
			->with( 1 )
			->andReturn( false );

		$this->expectException( Complete_Hello_World_Task_Exception::class );

		$this->instance->complete_task();
	}
}
