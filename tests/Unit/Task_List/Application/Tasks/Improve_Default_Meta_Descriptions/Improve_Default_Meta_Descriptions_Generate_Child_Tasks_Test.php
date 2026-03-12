<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Tests the generate_child_tasks method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::generate_child_tasks
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::populate_child_tasks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Generate_Child_Tasks_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that generate_child_tasks populates and returns child tasks.
	 *
	 * @return void
	 */
	public function test_generate_child_tasks_populates_and_returns_child_tasks() {
		$this->instance->set_post_type( 'post' );

		$content_item = new Meta_Description_Content_Item_Data( 1, 'Test Post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_without_description' )
			->once()
			->andReturn( [ $content_item ] );

		$child_tasks = $this->instance->generate_child_tasks();

		$this->assertCount( 1, $child_tasks );
		$this->assertInstanceOf( Improve_Default_Meta_Descriptions_Child::class, $child_tasks[0] );
	}

	/**
	 * Tests that generate_child_tasks stores the child tasks on the instance.
	 *
	 * @return void
	 */
	public function test_generate_child_tasks_stores_child_tasks_on_instance() {
		$this->instance->set_post_type( 'post' );

		$content_item = new Meta_Description_Content_Item_Data( 1, 'Test Post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_without_description' )
			->once()
			->andReturn( [ $content_item ] );

		$this->instance->generate_child_tasks();

		$this->assertCount( 1, $this->instance->get_child_tasks() );
	}

	/**
	 * Tests that generate_child_tasks returns empty array when no content found.
	 *
	 * @return void
	 */
	public function test_generate_child_tasks_returns_empty_when_no_content() {
		$this->instance->set_post_type( 'post' );

		$this->recent_content_indexable_collector
			->expects( 'get_recent_content_without_description' )
			->once()
			->andReturn( [] );

		$child_tasks = $this->instance->generate_child_tasks();

		$this->assertSame( [], $child_tasks );
		$this->assertSame( [], $this->instance->get_child_tasks() );
	}
}

