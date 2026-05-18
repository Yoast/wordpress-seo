<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

/**
 * Tests the get_badge method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_badge
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Badge_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_badge returns null.
	 *
	 * @return void
	 */
	public function test_get_badge_returns_null() {
		$this->assertNull( $this->instance->get_badge() );
	}
}
