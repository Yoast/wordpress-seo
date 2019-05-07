<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

/**
 * Unit Test Class.
 */
class Role_Manager_Factory extends \Yoast\Tests\TestCase {

	public function test_get() {
		$instance  = WPSEO_Role_Manager_Factory::get();
		$instance2 = WPSEO_Role_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
