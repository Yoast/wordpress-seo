<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Configuration;

/**
 * Abstract class for the Permanently Dismissed Site Kit Configuration Repository tests.
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Consent_Management_Route::check_capabilities
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Consent_Management_Route_Check_Capabilities_Test extends Abstract_Site_Kit_Consent_Management_Route_Test {

	/**
	 * Tests that the capability that is tested for is `wpseo_manage_options`.
	 *
	 * @return void
	 */
	public function test_check_capabilities() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( $this->instance->check_capabilities() );
	}
}
