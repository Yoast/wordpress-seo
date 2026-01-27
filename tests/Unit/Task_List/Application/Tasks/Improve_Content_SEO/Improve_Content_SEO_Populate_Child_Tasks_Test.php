<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;

/**
 * Test class for the Improve Content SEO populate_child_tasks method.
 *
 * @group Improve_Content_SEO
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::populate_child_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Populate_Child_Tasks_Test extends Abstract_Improve_Content_SEO_Test {

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
	 * Tests populate_child_tasks returns empty array when no content items found.
	 *
	 * @return void
	 */
	public function test_populate_child_tasks_returns_empty_when_no_content_found() {
		$this->instance->set_post_type( 'post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_with_seo_scores' )
			->once()
			->andReturn( [] );

		$child_tasks = $this->instance->populate_child_tasks();

		$this->assertSame( [], $child_tasks );
	}

	/**
	 * Tests populate_child_tasks returns child tasks when content items exist.
	 *
	 * @return void
	 */
	public function test_populate_child_tasks_returns_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$content_item_1 = new Content_Item_SEO_Data( 1, 'Test Post 1', 30, 'post' );
		$content_item_2 = new Content_Item_SEO_Data( 2, 'Test Post 2', 55, 'post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_with_seo_scores' )
			->once()
			->andReturn( [ $content_item_1, $content_item_2 ] );

		$child_tasks = $this->instance->populate_child_tasks();

		$this->assertCount( 2, $child_tasks );
		$this->assertInstanceOf( Improve_Content_SEO_Child::class, $child_tasks[0] );
		$this->assertInstanceOf( Improve_Content_SEO_Child::class, $child_tasks[1] );
	}
}
