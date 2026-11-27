<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Debug_Display;

use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast_Notification_Center;

/**
 * Test class for the constructor.
 *
 * @group Debug_Display
 *
 * @covers Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Debug_Display_Alert_Constructor_Test extends Abstract_Debug_Display_Alert_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' ),
		);
		$this->assertInstanceOf(
			Environment_Helper::class,
			$this->getPropertyValue( $this->instance, 'environment_helper' ),
		);
	}
}
