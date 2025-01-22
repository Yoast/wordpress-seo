<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface;

use Brain\Monkey\Functions;

/**
 * Abstract class for the Permanently Dismissed Site Kit Widget Repository tests.
 *
 * @group site_kit_widget_permanent_dismissal_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Site_Kit_Widget_Permanent_Dismissal_Route::check_capabilities
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Check_Capabilities_Test extends Abstract_Site_Kit_Widget_Permanent_Dismissal_Route_Test {

	/**
	 * Tests that the capability that is tested for is `administrator`.
	 *
	 * @return void
	 */
	public function test_check_capabilities() {
		Functions\expect( 'current_user_can' )->once()->with( 'administrator' )->andReturn( true );

		$this->assertTrue( $this->instance->check_capabilities() );
	}
}
