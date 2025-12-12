<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\User_Interface\Complete_Task;

/**
 * Test class for permission_manage_options.
 *
 * @group Complete_Task_Route
 *
 * @covers Yoast\WP\SEO\Task_List\User_Interface\Tasks\Complete_Task_Route::permission_manage_options
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_Task_Route_Permission_Manage_Options_Test extends Abstract_Complete_Task_Route_Test {

	/**
	 * Tests permission callback when user has capability.
	 *
	 * @return void
	 */
	public function test_permission_manage_options_user_can() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$result = $this->instance->permission_manage_options();

		$this->assertTrue( $result );
	}

	/**
	 * Tests permission callback when user lacks capability.
	 *
	 * @return void
	 */
	public function test_permission_manage_options_user_cannot() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$result = $this->instance->permission_manage_options();

		$this->assertFalse( $result );
	}
}
