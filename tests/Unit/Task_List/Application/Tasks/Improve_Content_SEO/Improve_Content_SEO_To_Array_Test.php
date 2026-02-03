<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;

/**
 * Test class for the Improve Content SEO to_array method.
 *
 * @group Improve_Content_SEO
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_duration
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_link
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::to_array
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::is_valid
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_To_Array_Test extends Abstract_Improve_Content_SEO_Test {

	/**
	 * Tests the task's to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->instance->set_post_type( 'post' );

		$expected_result = [
			'id'           => 'improve-content-seo-post',
			'duration'     => 15,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve your content\'s SEO',
			'why'          => 'Improving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems.',
			'how'          => 'Follow the instructions displayed in the SEO analysis to improve your content\'s SEO. Pro tip: Use AI Optimize to speed up the process with quality suggestions.',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_completed() {
		$this->instance->set_post_type( 'post' );
		$child_task = Mockery::mock( Improve_Content_SEO_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )
			->andReturn( true );

		$this->instance->set_child_tasks( [ $child_task ] );

		$expected_result = [
			'id'           => 'improve-content-seo-post',
			'duration'     => 15,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => true,
			'callToAction' => null,
			'title'        => 'Improve your content\'s SEO',
			'why'          => 'Improving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems.',
			'how'          => 'Follow the instructions displayed in the SEO analysis to improve your content\'s SEO. Pro tip: Use AI Optimize to speed up the process with quality suggestions.',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests the task's to_array method.
	 *
	 * @return void
	 */
	public function test_to_array_when_child_task_exists_and_is_not_completed() {
		$this->instance->set_post_type( 'post' );
		$child_task = Mockery::mock( Improve_Content_SEO_Child::class );
		$child_task->shouldReceive( 'get_is_completed' )
			->andReturn( false );

		$this->instance->set_child_tasks( [ $child_task ] );

		$expected_result = [
			'id'           => 'improve-content-seo-post',
			'duration'     => 15,
			'priority'     => 'medium',
			'badge'        => null,
			'isCompleted'  => false,
			'callToAction' => null,
			'title'        => 'Improve your content\'s SEO',
			'why'          => 'Improving your content\'s SEO increases the discoverability on search engines, LLMs and other AI systems.',
			'how'          => 'Follow the instructions displayed in the SEO analysis to improve your content\'s SEO. Pro tip: Use AI Optimize to speed up the process with quality suggestions.',
			'parentTask'   => true,
		];

		$this->assertSame( $expected_result, $this->instance->to_array() );
	}

	/**
	 * Tests that the task ID includes the post type.
	 *
	 * @return void
	 */
	public function test_get_id_includes_post_type() {
		$this->instance->set_post_type( 'page' );

		$this->assertSame( 'improve-content-seo-page', $this->instance->get_id() );
	}
}
