<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Tracking;

/**
 * Test class for the to_array method.
 *
 * @group setup_steps_tracking
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking::to_array
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Setup_Steps_Tracking_To_Array_Test extends Abstract_Setup_Steps_Tracking_Test {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$expected = [
			'setupWidgetLoaded'     => 'yes',
			'firstInteractionStage' => 'INSTALL',
			'lastInteractionStage'  => 'CONNECT',
			'setupWidgetDismissed'  => 'no',
		];

		$this->assertEquals( $expected, $this->instance->to_array() );
	}
}
