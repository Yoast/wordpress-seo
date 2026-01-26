<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\User_Interface\Action_Tracking;

/**
 * Test class for get_conditionals.
 *
 * @group Action_Tracking_Route
 *
 * @covers Yoast\WP\SEO\Tracking\User_Interface\Action_Tracking_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Action_Tracking_Route_Get_Conditionals_Test extends Abstract_Action_Tracking_Route_Test {

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected_result = [];

		$this->assertEquals( $expected_result, $this->instance::get_conditionals() );
	}
}
