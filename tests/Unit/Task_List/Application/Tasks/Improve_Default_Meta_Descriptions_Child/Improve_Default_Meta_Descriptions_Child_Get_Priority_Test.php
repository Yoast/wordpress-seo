<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

/**
 * Tests the get_priority method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_priority
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Get_Priority_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_priority always returns 'medium'.
	 *
	 * @return void
	 */
	public function test_get_priority_returns_medium() {
		$this->assertSame( 'medium', $this->instance->get_priority() );
	}
}
