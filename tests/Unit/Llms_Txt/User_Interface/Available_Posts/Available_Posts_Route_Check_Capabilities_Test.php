<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

/**
 * Test class for the permission_manage_options method.
 *
 * @group available_posts_route
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::permission_manage_options
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Available_Posts_Route_Check_Capabilities_Test extends Abstract_Available_Posts_Route_Test {

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
