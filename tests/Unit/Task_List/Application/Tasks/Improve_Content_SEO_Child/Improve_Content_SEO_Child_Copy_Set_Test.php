<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;

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
		$content_item = new Content_Item_SEO_Data( 456, 'My Amazing Blog Post', 60, 'post' );

		$instance = new Improve_Content_SEO_Child(
			$this->parent_task,
			$content_item,
			$this->seo_score_groups_repository
		);

		$copy_set = $instance->get_copy_set();
		$array    = $copy_set->to_array();

		$this->assertSame( 'Improve SEO for "My Amazing Blog Post"', $array['title'] );
		$this->assertSame(
			'Add a focus keyphrase and follow the SEO analysis recommendations to improve this content.',
			$array['how']
		);
		$this->assertSame(
			'Optimize the SEO for "My Amazing Blog Post" to increase its visibility.',
			$array['why']
		);
	}
}
