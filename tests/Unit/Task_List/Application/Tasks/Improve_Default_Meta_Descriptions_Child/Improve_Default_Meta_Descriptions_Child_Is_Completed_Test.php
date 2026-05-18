<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the get_is_completed method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_is_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Is_Completed_Test extends TestCase {

	/**
	 * Tests that get_is_completed returns true when the post has a custom meta description.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_true_when_has_description() {
		$parent_task       = Mockery::mock( Parent_Task_Interface::class );
		$content_item_data = new Meta_Description_Content_Item_Data( 123, 'Test Post Title', true );

		$instance = new Improve_Default_Meta_Descriptions_Child( $parent_task, $content_item_data );

		$this->assertTrue( $instance->get_is_completed() );
	}

	/**
	 * Tests that get_is_completed returns false when the post does not have a custom meta description.
	 *
	 * @return void
	 */
	public function test_get_is_completed_returns_false_when_no_description() {
		$parent_task       = Mockery::mock( Parent_Task_Interface::class );
		$content_item_data = new Meta_Description_Content_Item_Data( 123, 'Test Post Title', false );

		$instance = new Improve_Default_Meta_Descriptions_Child( $parent_task, $content_item_data );

		$this->assertFalse( $instance->get_is_completed() );
	}
}
