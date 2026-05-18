<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

/**
 * Tests the get_call_to_action method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_call_to_action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Get_Call_To_Action_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that get_call_to_action always returns null.
	 *
	 * @return void
	 */
	public function test_get_call_to_action_returns_null() {
		$this->assertNull( $this->instance->get_call_to_action() );
	}
}
