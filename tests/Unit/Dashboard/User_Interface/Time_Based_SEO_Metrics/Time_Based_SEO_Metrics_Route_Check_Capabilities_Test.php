<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Time_Based_SEO_Metrics;

/**
 * Test class for the permission_manage_options method.
 *
 * @group time_based_SEO_metrics_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Time_Based_SEO_Metrics\Time_Based_SEO_Metrics_Route::permission_manage_options
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Route_Check_Capabilities_Test extends Abstract_Time_Based_SEO_Metrics_Route_Test {

	/**
	 * Tests permission_manage_options.
	 *
	 * @return void
	 */
	public function test_check_capabilities() {
		$this->capability_helper->expects( 'current_user_can' )
			->twice()
			->with( 'wpseo_manage_options' )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->permission_manage_options() );
		$this->assertFalse( $this->instance->permission_manage_options() );
	}
}
