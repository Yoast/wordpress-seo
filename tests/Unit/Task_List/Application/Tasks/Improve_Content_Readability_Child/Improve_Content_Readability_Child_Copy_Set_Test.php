<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_Readability_Child;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;

/**
 * Tests the get_copy_set method of the Improve Content Readability Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child::get_copy_set
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_Readability_Child_Copy_Set_Test extends Abstract_Improve_Content_Readability_Child_Test {

	/**
	 * Tests that get_copy_set returns a Copy_Set with the correct title.
	 *
	 * @return void
	 */
	public function test_get_copy_set() {
		$content_item = new Content_Item_Score_Data( 456, 'My Amazing Blog Post', 'ok', 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>First paragraph from parent.</p><p>Second paragraph from parent.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'My Amazing Blog Post', $array['title'] );
		$this->assertSame(
			'<p>First paragraph from parent.</p><p>Second paragraph from parent.</p>',
			$array['about'],
		);
	}

	/**
	 * Tests that get_copy_set decodes HTML entities in the title.
	 *
	 * @return void
	 */
	public function test_get_copy_set_decodes_html_entities_in_title() {
		$content_item = new Content_Item_Score_Data( 456, 'Sarah&#8217;s Blog Post', 'ok', 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>About text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'Sarah\'s Blog Post', $array['title'] );
	}

	/**
	 * Tests that get_copy_set uses "(no title)" fallback when title is empty.
	 *
	 * @return void
	 */
	public function test_get_copy_set_uses_no_title_fallback_when_title_is_empty() {
		$content_item = new Content_Item_Score_Data( 456, '', 'ok', 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>About text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_Readability_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( '(no title)', $array['title'] );
	}
}
