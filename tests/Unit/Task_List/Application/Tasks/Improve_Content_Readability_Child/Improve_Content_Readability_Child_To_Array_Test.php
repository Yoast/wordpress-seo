<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_Readability_Child;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Bad_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Good_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Ok_Readability_Score_Group;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;

/**
 * Tests the to_array method of the Improve Content Readability Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_Readability_Child_To_Array_Test extends Abstract_Improve_Content_Readability_Child_Test {

	/**
	 * Tests the to_array method returns correct structure.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$content_item = new Content_Item_Score_Data( 456, 'My Amazing Blog Post', new Ok_Readability_Score_Group(), 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>Parent about text.</p>'
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-content-readability-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item
		);

		$result = $instance->to_array();

		$this->assertSame( 'improve-content-readability-post-456', $result['id'] );
		$this->assertSame( 10, $result['duration'] );
		$this->assertSame( 'medium', $result['priority'] );
		$this->assertNull( $result['badge'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertSame( 'improve-content-readability-post', $result['parentTaskId'] );
		$this->assertSame( 'My Amazing Blog Post', $result['title'] );
		$this->assertSame( '<p>Parent about text.</p>', $result['about'] );
		// callToAction is null because enhanced_call_to_action is not set.
		$this->assertNull( $result['callToAction'] );
		$this->assertIsArray( $result['analyzer'] );
		$this->assertSame( 'score', $result['analyzer']['type'] );
		$this->assertSame( 'ok', $result['analyzer']['score'] );
	}

	/**
	 * Tests the to_array method when task is completed.
	 *
	 * @return void
	 */
	public function test_to_array_when_completed() {
		$content_item = new Content_Item_Score_Data( 789, 'Completed Post', new Good_Readability_Score_Group(), 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>Parent about text.</p>'
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-content-readability-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item
		);

		$result = $instance->to_array();

		$this->assertSame( 'improve-content-readability-post-789', $result['id'] );
		$this->assertTrue( $result['isCompleted'] );
		$this->assertSame( 'medium', $result['priority'] );
	}

	/**
	 * Tests the to_array method when task has bad score (high priority).
	 *
	 * @return void
	 */
	public function test_to_array_with_bad_score_has_high_priority() {
		$content_item = new Content_Item_Score_Data( 111, 'Bad Score Post', new Bad_Readability_Score_Group(), 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>Parent about text.</p>'
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-content-readability-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item
		);

		$result = $instance->to_array();

		$this->assertSame( 'high', $result['priority'] );
		$this->assertFalse( $result['isCompleted'] );
	}
}
