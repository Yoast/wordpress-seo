<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;

/**
 * Tests the get_duration method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_duration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Duration_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_duration returns 0 when there are no child tasks.
	 *
	 * @return void
	 */
	public function test_get_duration_returns_zero_when_no_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$this->assertSame( 0, $this->instance->get_duration() );
	}

	/**
	 * Tests that get_duration returns 0 when all child tasks are completed.
	 *
	 * @return void
	 */
	public function test_get_duration_returns_zero_when_all_child_tasks_completed() {
		$this->instance->set_post_type( 'post' );

		$child_task_1 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_1->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$child_task_2 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_2->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$this->instance->set_child_tasks( [ $child_task_1, $child_task_2 ] );

		$this->assertSame( 0, $this->instance->get_duration() );
	}

	/**
	 * Tests that get_duration sums only incomplete child task durations.
	 *
	 * @return void
	 */
	public function test_get_duration_sums_only_incomplete_child_task_durations() {
		$this->instance->set_post_type( 'post' );

		$completed_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$completed_task->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$incomplete_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$incomplete_task->shouldReceive( 'get_is_completed' )
			->andReturn( false );
		$incomplete_task->shouldReceive( 'get_duration' )
			->andReturn( 5 );

		$this->instance->set_child_tasks( [ $completed_task, $incomplete_task ] );

		$this->assertSame( 5, $this->instance->get_duration() );
	}

	/**
	 * Tests that get_duration sums all child task durations when none are completed.
	 *
	 * @return void
	 */
	public function test_get_duration_sums_all_durations_when_none_completed() {
		$this->instance->set_post_type( 'post' );

		$child_task_1 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_1->shouldReceive( 'get_is_completed' )
			->andReturn( false );
		$child_task_1->shouldReceive( 'get_duration' )
			->andReturn( 5 );

		$child_task_2 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_2->shouldReceive( 'get_is_completed' )
			->andReturn( false );
		$child_task_2->shouldReceive( 'get_duration' )
			->andReturn( 5 );

		$child_task_3 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task_3->shouldReceive( 'get_is_completed' )
			->andReturn( false );
		$child_task_3->shouldReceive( 'get_duration' )
			->andReturn( 5 );

		$this->instance->set_child_tasks( [ $child_task_1, $child_task_2, $child_task_3 ] );

		$this->assertSame( 15, $this->instance->get_duration() );
	}
}

