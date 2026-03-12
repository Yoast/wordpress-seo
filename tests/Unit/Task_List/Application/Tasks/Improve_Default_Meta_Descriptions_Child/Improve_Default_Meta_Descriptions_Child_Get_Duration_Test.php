<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

/**
 * Tests the get_duration method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_duration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Get_Duration_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_duration returns 5.
	 *
	 * @return void
	 */
	public function test_get_duration_returns_five() {
		$this->assertSame( 5, $this->instance->get_duration() );
	}
}

