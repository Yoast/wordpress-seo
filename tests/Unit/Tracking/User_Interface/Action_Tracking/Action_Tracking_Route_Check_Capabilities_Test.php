<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Tracking\User_Interface\Action_Tracking;

/**
 * Test class for check_capabilities.
 *
 * @group Action_Tracking_Route
 *
 * @covers Yoast\WP\SEO\Tracking\User_Interface\Action_Tracking_Route::check_capabilities
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Action_Tracking_Route_Check_Capabilities_Test extends Abstract_Action_Tracking_Route_Test {

	/**
	 * Tests permission callback when user has capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_user_can() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$result = $this->instance->check_capabilities();

		$this->assertTrue( $result );
	}

	/**
	 * Tests permission callback when user lacks capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_user_cannot() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$result = $this->instance->check_capabilities();

		$this->assertFalse( $result );
	}
}
