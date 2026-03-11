<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Test class for the Improve Default Meta Descriptions populate_child_tasks method.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Default_Meta_Descriptions::populate_child_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Populate_Child_Tasks_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests populate_child_tasks returns empty array when post type is empty string.
	 *
	 * @return void
	 */
	public function test_populate_child_tasks_returns_empty_when_post_type_is_empty() {
		$this->instance->set_post_type( '' );

		$this->assertSame( [], $this->instance->populate_child_tasks() );
	}

	/**
	 * Tests populate_child_tasks returns empty array when no content items are found.
	 *
	 * @return void
	 */
	public function test_populate_child_tasks_returns_empty_when_no_content_found() {
		$this->instance->set_post_type( 'post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_without_description' )
			->once()
			->andReturn( [] );

		$this->assertSame( [], $this->instance->populate_child_tasks() );
	}

	/**
	 * Tests populate_child_tasks returns child tasks when content items exist.
	 *
	 * @return void
	 */
	public function test_populate_child_tasks_returns_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$content_item_1 = new Meta_Description_Content_Item_Data( 1, 'Test Post 1' );
		$content_item_2 = new Meta_Description_Content_Item_Data( 2, 'Test Post 2' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_without_description' )
			->once()
			->andReturn( [ $content_item_1, $content_item_2 ] );

		$child_tasks = $this->instance->populate_child_tasks();

		$this->assertCount( 2, $child_tasks );
		$this->assertInstanceOf( Improve_Default_Meta_Descriptions_Child::class, $child_tasks[0] );
		$this->assertInstanceOf( Improve_Default_Meta_Descriptions_Child::class, $child_tasks[1] );
	}
}
