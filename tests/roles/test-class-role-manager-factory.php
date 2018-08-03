<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

/**
 * Unit Test Class.
 */
class WPSEO_Role_Manager_Factory_Tests extends PHPUnit_Framework_TestCase {

	public function test_get() {
		$instance  = WPSEO_Role_Manager_Factory::get();
		$instance2 = WPSEO_Role_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
