<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface\Opt_In_Route;

/**
 * Tests the Opt_In_Route can_see_opt_in method.
 *
 * @group opt-in-route
 *
 * @covers \Yoast\WP\SEO\General\User_Interface\Opt_In_Route::can_see_opt_in
 */
final class Can_See_Opt_In_Test extends Abstract_Opt_In_Route_Test {

	/**
	 * Tests the can_see_opt_in method.
	 *
	 * @return void
	 */
	public function test_can_see_opt_in() {
		$this->capability_helper
			->expects( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_see_opt_in() );
	}
}
