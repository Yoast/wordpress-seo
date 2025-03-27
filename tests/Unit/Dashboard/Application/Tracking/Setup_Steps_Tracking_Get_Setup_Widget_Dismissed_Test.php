<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Tracking;

/**
 * Test class for the get_setup_widget_dismissed method.
 *
 * @group setup_steps_tracking
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking::get_setup_widget_dismissed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_Get_Setup_Widget_Dismissed_Test extends Abstract_Setup_Steps_Tracking_Test {

	/**
	 * Tests the retrieval of the setup widget dismissed status.
	 *
	 * @return void
	 */
	public function test_get_setup_widget_dismissed() {
		$this->assertEquals( 'no', $this->instance->get_setup_widget_dismissed() );
	}
}
