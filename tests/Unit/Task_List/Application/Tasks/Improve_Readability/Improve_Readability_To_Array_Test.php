<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Readability;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Readability_Child;

/**
 * Test class for the Improve Readability to_array method.
 *
 * @group Improve_Readability
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_link
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Readability::is_valid
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Readability_To_Array_Test extends Abstract_Improve_Readability_Test {

	/**
	 * Tests the task's to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->instance->set_post_type( 'post' );

		$expected_result = [
			'id'           => 'improve-readability-post',
			'duration'     => 0,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve your content\'s readability',
			'about'        => '<p>Improving your content\'s readability makes it easier for your audience to understand and engage with your content. Follow the instructions displayed in the readability analysis to improve your content\'s readability.</p><p><strong>Pro tip</strong>: Use <strong>AI Optimize</strong> to speed up the process with high-quality, actionable suggestions.</p>',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when child task exists and is completed.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_completed() {
		$this->instance->set_post_type( 'post' );
		$child_task = Mockery::mock( Improve_Readability_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$this->instance->set_child_tasks( [ $child_task ] );

		$expected_result = [
			'id'           => 'improve-readability-post',
			'duration'     => 0,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve your content\'s readability',
			'about'        => '<p>Improving your content\'s readability makes it easier for your audience to understand and engage with your content. Follow the instructions displayed in the readability analysis to improve your content\'s readability.</p><p><strong>Pro tip</strong>: Use <strong>AI Optimize</strong> to speed up the process with high-quality, actionable suggestions.</p>',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method when child task exists and is not completed.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_not_completed() {
		$this->instance->set_post_type( 'post' );
		$child_task = Mockery::mock( Improve_Readability_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )
			->andReturn( false );
		$child_task->shouldReceive( 'get_duration' )
			->andReturn( 5 );

		$this->instance->set_child_tasks( [ $child_task ] );

		$expected_result = [
			'id'           => 'improve-readability-post',
			'duration'     => 5,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => null,
			'title'        => 'Improve your content\'s readability',
			'about'        => '<p>Improving your content\'s readability makes it easier for your audience to understand and engage with your content. Follow the instructions displayed in the readability analysis to improve your content\'s readability.</p><p><strong>Pro tip</strong>: Use <strong>AI Optimize</strong> to speed up the process with high-quality, actionable suggestions.</p>',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}
}
