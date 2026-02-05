<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;

/**
 * Tests the get_copy_set method of the Improve Content SEO Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_copy_set
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Child_Copy_Set_Test extends Abstract_Improve_Content_SEO_Child_Test {

	/**
	 * Tests the get_copy_set method.
	 *
	 * @return void
	 */
	public function test_get_copy_set() {
		$content_item = new Content_Item_Score_Data( 456, 'My Amazing Blog Post', 'ok', 'post' );

		$parent_copy_set = new Copy_Set(
			'Parent Title',
			'<p>First paragraph from parent.</p><p>Second paragraph from parent.</p>'
		);

		$this->parent_task
			->shouldReceive( 'get_copy_set' )
			->once()
			->andReturn( $parent_copy_set );

		$instance = new Improve_Content_SEO_Child(
			$this->parent_task,
			$content_item
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'My Amazing Blog Post', $array['title'] );
		$this->assertSame(
			'<p>First paragraph from parent.</p><p>Second paragraph from parent.</p>',
			$array['about']
		);
	}
}
