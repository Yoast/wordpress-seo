<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Capabilities
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Unit Test Class.
 */
class WPSEO_Capability_Manager_Factory_Test extends TestCase {

	/**
	 * Tests whether the same factory instance is returned when the get function is called twice.
	 *
	 * @covers WPSEO_Capability_Manager_Factory::get
	 */
	public function test_get() {
		$instance  = WPSEO_Capability_Manager_Factory::get();
		$instance2 = WPSEO_Capability_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
