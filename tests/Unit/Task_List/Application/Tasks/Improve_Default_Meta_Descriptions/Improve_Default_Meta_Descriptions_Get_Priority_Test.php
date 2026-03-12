<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

/**
 * Tests the get_priority method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_priority
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Priority_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_priority returns 'medium'.
	 *
	 * @return void
	 */
	public function test_get_priority_returns_medium() {
		$this->assertSame( 'medium', $this->instance->get_priority() );
	}
}
