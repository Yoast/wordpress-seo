<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface\Tracking;

use Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Setup_Steps_Tracking_Repository_Interface;

/**
 * Test class for the constructor.
 *
 * @group setup_steps_tracking_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Tracking\Setup_Steps_Tracking_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Route_Constructor_Test extends Abstract_Setup_Steps_Tracking_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Setup_Steps_Tracking_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'setup_steps_tracking_repository' )
		);
	}
}
