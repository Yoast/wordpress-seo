<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;

/**
 * Tests the to_array method of the Improve Default Meta Descriptions Child task.
 *
 * @group Improve_Default_Meta_Descriptions_Child
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_id
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_is_completed
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_priority
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_link
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_copy_set
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry::to_array
 * @covers Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_To_Array_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests the to_array method returns correct structure.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$content_item = new Content_Item_Score_Data( 456, 'My Amazing Blog Post', '', 'post' );

		$parent_copy_set = new Copy_Set(
			'Default meta descriptions: Posts',
			'<p>Parent about text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-default-meta-descriptions-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 456, '&' )
			->andReturn( 'https://example.com/wp-admin/post.php?post=456&action=edit' );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with(
				[
					'yoast-tab'       => 'seo',
					'yoast-scroll-to' => 'meta-description',
				],
				'https://example.com/wp-admin/post.php?post=456&action=edit'
			)
			->andReturn( 'https://example.com/wp-admin/post.php?post=456&action=edit&yoast-tab=seo&yoast-scroll-to=meta-description' );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$instance->set_enhanced_call_to_action( $instance->get_call_to_action() );
		$result = $instance->to_array();

		$this->assertSame( 'improve-default-meta-descriptions-post-456', $result['id'] );
		$this->assertSame( 5, $result['duration'] );
		$this->assertSame( 'medium', $result['priority'] );
		$this->assertNull( $result['badge'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertSame( 'improve-default-meta-descriptions-post', $result['parentTaskId'] );
		$this->assertSame( 'My Amazing Blog Post', $result['title'] );
		$this->assertSame( '<p>Parent about text.</p>', $result['about'] );
		$this->assertNull( $result['analyzer'] );
		$this->assertSame( 'Open social appearance', $result['callToAction']['label'] );
		$this->assertSame( 'link', $result['callToAction']['type'] );
		$this->assertSame( 'https://example.com/wp-admin/post.php?post=456&action=edit&yoast-tab=seo&yoast-scroll-to=meta-description', $result['callToAction']['href'] );
	}

	/**
	 * Tests that get_is_completed always returns false.
	 *
	 * @return void
	 */
	public function test_get_is_completed_always_returns_false() {
		$this->assertFalse( $this->instance->get_is_completed() );
	}

	/**
	 * Tests that get_analyzer returns null (no analyzer for this task).
	 *
	 * @return void
	 */
	public function test_get_analyzer_returns_null() {
		$this->assertNull( $this->instance->get_analyzer() );
	}
}
