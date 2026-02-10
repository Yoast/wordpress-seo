<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_Readability;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Bad_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Ok_Readability_Score_Group;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_Readability_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;

/**
 * Test class for the Improve Content Readability populate_child_tasks method.
 *
 * @group Improve_Content_Readability
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_Readability::populate_child_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_Readability_Populate_Child_Tasks_Test extends Abstract_Improve_Content_Readability_Test {

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
			->expects( 'get_recent_content_with_readability_scores' )
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

		$content_item_1 = new Content_Item_Score_Data( 1, 'Test Post 1', new Bad_Readability_Score_Group(), 'post' );
		$content_item_2 = new Content_Item_Score_Data( 2, 'Test Post 2', new Ok_Readability_Score_Group(), 'post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_with_readability_scores' )
			->once()
			->andReturn( [ $content_item_1, $content_item_2 ] );

		$child_tasks = $this->instance->populate_child_tasks();

		$this->assertCount( 2, $child_tasks );
		$this->assertInstanceOf( Improve_Content_Readability_Child::class, $child_tasks[0] );
		$this->assertInstanceOf( Improve_Content_Readability_Child::class, $child_tasks[1] );
	}
}
