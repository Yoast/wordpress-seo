<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Tests the get_id method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_id
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Get_Id_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_id returns the parent task ID combined with the content ID.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->parent_task
			->shouldReceive( 'get_id' )
			->once()
			->andReturn( 'improve-default-meta-descriptions-post' );

		$this->assertSame( 'improve-default-meta-descriptions-post-123', $this->instance->get_id() );
	}

	/**
	 * Tests that get_id works with a different content item ID.
	 *
	 * @return void
	 */
	public function test_get_id_with_different_content_id() {
		$content_item = new Meta_Description_Content_Item_Data( 789, 'Another Post' );
		$instance     = new Improve_Default_Meta_Descriptions_Child(
			$this->parent_task,
			$content_item,
		);

		$this->parent_task
			->shouldReceive( 'get_id' )
			->once()
			->andReturn( 'improve-default-meta-descriptions-page' );

		$this->assertSame( 'improve-default-meta-descriptions-page-789', $instance->get_id() );
	}
}

