<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Tests the get_copy_set method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_copy_set
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Copy_Set_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_copy_set returns a Copy_Set with the correct title and about text from the parent.
	 *
	 * @return void
	 */
	public function test_get_copy_set() {
		$content_item = new Meta_Description_Content_Item_Data( 456, 'My Amazing Blog Post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>First paragraph from parent.</p><p>Second paragraph from parent.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
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
		$content_item = new Meta_Description_Content_Item_Data( 456, 'Sarah&#8217;s Blog Post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>About text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( "\u{2019}", \mb_substr( $array['title'], 5, 1 ) );
		$this->assertSame( 'Sarah' . "\u{2019}" . 's Blog Post', $array['title'] );
	}

	/**
	 * Tests that get_copy_set decodes ampersands in the title.
	 *
	 * @return void
	 */
	public function test_get_copy_set_decodes_ampersands_in_title() {
		$content_item = new Meta_Description_Content_Item_Data( 456, 'Tom &amp; Jerry' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>About text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'Tom & Jerry', $array['title'] );
	}

	/**
	 * Tests that get_copy_set decodes quote entities in the title.
	 *
	 * @return void
	 */
	public function test_get_copy_set_decodes_quote_entities_in_title() {
		$content_item = new Meta_Description_Content_Item_Data( 456, 'A &quot;Quoted&quot; Title' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>About text.</p>',
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'A "Quoted" Title', $array['title'] );
	}
}
