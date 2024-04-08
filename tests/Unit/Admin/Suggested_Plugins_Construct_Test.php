<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use WPSEO_Plugin_Availability;
use Yoast_Notification_Center;

/**
 * Test class for WPSEO_Suggested_Plugins::__construct.
 *
 * @covers WPSEO_Suggested_Plugins::__construct
 */
final class Suggested_Plugins_Construct_Test extends Suggested_Plugins_TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers WPSEO_Suggested_Plugins::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			WPSEO_Plugin_Availability::class,
			$this->getPropertyValue( $this->instance, 'availability_checker' )
		);

		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' )
		);
	}
}
