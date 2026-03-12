<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Tests the to_array method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
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
		$content_item = new Meta_Description_Content_Item_Data( 456, 'My Amazing Blog Post' );

		$parent_copy_set = new Copy_Set(
			'Improve default meta descriptions: Posts',
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
				'yoast-scroll-to',
				'meta-description',
				'https://example.com/wp-admin/post.php?post=456&action=edit',
			)
			->andReturn( 'https://example.com/wp-admin/post.php?post=456&action=edit&yoast-scroll-to=meta-description' );

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
		$this->assertSame( 'https://example.com/wp-admin/post.php?post=456&action=edit&yoast-scroll-to=meta-description', $result['callToAction']['href'] );
	}

	/**
	 * Tests the to_array method when enhanced call to action is not set (null callToAction).
	 *
	 * @return void
	 */
	public function test_to_array_without_enhanced_call_to_action() {
		$content_item = new Meta_Description_Content_Item_Data( 456, 'My Amazing Blog Post' );

		$parent_copy_set = new Copy_Set(
			'Improve default meta descriptions: Posts',
			'<p>Parent about text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-default-meta-descriptions-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$result = $instance->to_array();

		$this->assertSame( 'improve-default-meta-descriptions-post-456', $result['id'] );
		$this->assertSame( 5, $result['duration'] );
		$this->assertSame( 'medium', $result['priority'] );
		$this->assertNull( $result['badge'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertNull( $result['callToAction'] );
		$this->assertSame( 'improve-default-meta-descriptions-post', $result['parentTaskId'] );
		$this->assertSame( 'My Amazing Blog Post', $result['title'] );
		$this->assertSame( '<p>Parent about text.</p>', $result['about'] );
		$this->assertNull( $result['analyzer'] );
	}

	/**
	 * Tests the to_array method when get_edit_post_link returns null.
	 *
	 * @return void
	 */
	public function test_to_array_with_null_link() {
		$content_item = new Meta_Description_Content_Item_Data( 999, 'Post With No Edit Link' );

		$parent_copy_set = new Copy_Set(
			'Improve default meta descriptions: Posts',
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
			->with( 999, '&' )
			->andReturn( null );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$instance->set_enhanced_call_to_action( $instance->get_call_to_action() );
		$result = $instance->to_array();

		$this->assertSame( 'improve-default-meta-descriptions-post-999', $result['id'] );
		$this->assertFalse( $result['isCompleted'] );
		$this->assertSame( 'Post With No Edit Link', $result['title'] );
		$this->assertSame( 'Open social appearance', $result['callToAction']['label'] );
		$this->assertSame( 'link', $result['callToAction']['type'] );
		$this->assertNull( $result['callToAction']['href'] );
	}

	/**
	 * Tests the to_array method with HTML entities in the title.
	 *
	 * @return void
	 */
	public function test_to_array_with_html_entities_in_title() {
		$content_item = new Meta_Description_Content_Item_Data( 456, 'Tom &amp; Jerry&#8217;s Post' );

		$parent_copy_set = new Copy_Set(
			'Improve default meta descriptions: Posts',
			'<p>Parent about text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->andReturn( 'improve-default-meta-descriptions-post' );

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$result = $instance->to_array();

		$this->assertSame( 'Tom & Jerry' . "\u{2019}" . 's Post', $result['title'] );
	}
}
