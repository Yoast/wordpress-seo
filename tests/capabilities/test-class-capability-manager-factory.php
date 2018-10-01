<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Capabilities
 */

/**
 * Unit Test Class.
 */
class WPSEO_Capability_Manager_Factory_Tests extends PHPUnit_Framework_TestCase {

	public function test_get() {
		$instance  = WPSEO_Capability_Manager_Factory::get();
		$instance2 = WPSEO_Capability_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
