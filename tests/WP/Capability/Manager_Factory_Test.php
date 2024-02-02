<?php

namespace Yoast\WP\SEO\Tests\WP\Capability;

use WPSEO_Capability_Manager_Factory;
use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Unit Test Class.
 */
final class Manager_Factory_Test extends TestCase {

	/**
	 * Tests whether the same factory instance is returned when the get function is called twice.
	 *
	 * @covers WPSEO_Capability_Manager_Factory::get
	 *
	 * @return void
	 */
	public function test_get() {
		$instance  = WPSEO_Capability_Manager_Factory::get();
		$instance2 = WPSEO_Capability_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
