<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route;

use Brain\Monkey\Functions;

/**
 * Tests the Banner_Permanent_Dismissal_Route check_capabilities method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Banner_Permanent_Dismissal_Route::check_capabilities
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Check_Capabilities_Test extends Abstract_Banner_Permanent_Dismissal_Route_Test {

	/**
	 * Tests that check_capabilities returns true when the user has the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_returns_true_when_user_can_edit_posts() {
		Functions\when( 'current_user_can' )->justReturn( true );

		$this->assertTrue( $this->instance->check_capabilities() );
	}

	/**
	 * Tests that check_capabilities returns false when the user lacks the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_returns_false_when_user_cannot_edit_posts() {
		Functions\when( 'current_user_can' )->justReturn( false );

		$this->assertFalse( $this->instance->check_capabilities() );
	}
}
