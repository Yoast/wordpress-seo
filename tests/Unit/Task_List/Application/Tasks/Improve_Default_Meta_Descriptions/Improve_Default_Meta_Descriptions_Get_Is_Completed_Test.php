<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;

/**
 * Tests the get_is_completed method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_is_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Is_Completed_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_is_completed returns true when there are no child tasks.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_true_when_no_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$this->assertTrue( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that get_is_completed returns true when all child tasks are completed.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_true_when_all_children_completed() {
		$this->instance->set_post_type( 'post' );

		$child_task_1 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_1->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$child_task_2 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_2->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$this->instance->set_child_tasks( [ $child_task_1, $child_task_2 ] );

		$this->assertTrue( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that get_is_completed returns false when one child task is not completed.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_false_when_one_child_incomplete() {
		$this->instance->set_post_type( 'post' );

		$completed_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$completed_task->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$incomplete_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$incomplete_task->shouldReceive( 'get_is_completed' )
			->andReturn( false );

		$this->instance->set_child_tasks( [ $completed_task, $incomplete_task ] );

		$this->assertFalse( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that get_is_completed returns false when all child tasks are not completed.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_false_when_all_children_incomplete() {
		$this->instance->set_post_type( 'post' );

		$incomplete_task_1 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$incomplete_task_1->shouldReceive( 'get_is_completed' )
			->andReturn( false );

		$incomplete_task_2 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );

		$this->instance->set_child_tasks( [ $incomplete_task_1, $incomplete_task_2 ] );

		$this->assertFalse( $this->instance->get_is_completed() );
	}
}

