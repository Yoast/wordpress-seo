<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;

/**
 * Test class for the Improve Default Meta Descriptions to_array method.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_link
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_To_Array_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests the task's to_array method when no child tasks exist (task is complete).
	 *
	 * @return void
	 */
	public function test_to_array_with_no_children() {
		$this->instance->set_post_type( 'post' );

		$expected_result = [
			'id'           => 'improve-default-meta-descriptions-post',
			'duration'     => 0,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve default meta descriptions: Posts',
			'about'        => '<p>Default meta descriptions don\'t always highlight what makes your page unique. Write your own to improve clarity and drive more clicks.</p><p>Short on time? In <strong>Yoast SEO Premium</strong>, use <strong>AI Generate</strong> to create tailored meta descriptions in seconds.</p>',
			'isParentTask' => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array when an incomplete child task exists.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_not_completed() {
		$this->instance->set_post_type( 'post' );

		$child_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )->andReturn( false );
		$child_task->shouldReceive( 'get_duration' )->andReturn( 5 );

		$this->instance->set_child_tasks( [ $child_task ] );

		$result = $this->instance->to_array();

		$this->assertSame( 'improve-default-meta-descriptions-post', $result['id'] );
		$this->assertSame( 5, $result['duration'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertTrue( $result['isParentTask'] );
	}

	/**
	 * Tests the task's to_array when a completed child task exists.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_completed() {
		$this->instance->set_post_type( 'post' );

		$child_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )->andReturn( true );

		$this->instance->set_child_tasks( [ $child_task ] );

		$expected_result = [
			'id'           => 'improve-default-meta-descriptions-post',
			'duration'     => 0,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve default meta descriptions: Posts',
			'about'        => '<p>Default meta descriptions don\'t always highlight what makes your page unique. Write your own to improve clarity and drive more clicks.</p><p>Short on time? In <strong>Yoast SEO Premium</strong>, use <strong>AI Generate</strong> to create tailored meta descriptions in seconds.</p>',
			'isParentTask' => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array with multiple child tasks of mixed completion.
	 *
	 * @return void
	 */
	public function test_to_array_with_mixed_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$completed_task = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$completed_task->shouldReceive( 'get_is_completed' )->andReturn( true );

		$incomplete_task_1 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$incomplete_task_1->shouldReceive( 'get_is_completed' )->andReturn( false );
		$incomplete_task_1->shouldReceive( 'get_duration' )->andReturn( 5 );

		$incomplete_task_2 = Mockery::mock( Improve_Default_Meta_Descriptions_Child::class );
		$incomplete_task_2->shouldReceive( 'get_is_completed' )->andReturn( false );
		$incomplete_task_2->shouldReceive( 'get_duration' )->andReturn( 5 );

		$this->instance->set_child_tasks( [ $completed_task, $incomplete_task_1, $incomplete_task_2 ] );

		$result = $this->instance->to_array();

		$this->assertSame( 'improve-default-meta-descriptions-post', $result['id'] );
		$this->assertSame( 10, $result['duration'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertTrue( $result['isParentTask'] );
	}

	/**
	 * Tests that the task ID includes the post type.
	 *
	 * @return void
	 */
	public function test_get_id_includes_post_type() {
		$this->instance->set_post_type( 'page' );

		$this->assertSame( 'improve-default-meta-descriptions-page', $this->instance->get_id() );
	}
}
