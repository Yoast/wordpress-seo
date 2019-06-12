<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 */
class Role_Manager_Factory extends TestCase {

	public function test_get() {
		$instance  = WPSEO_Role_Manager_Factory::get();
		$instance2 = WPSEO_Role_Manager_Factory::get();

		$this->assertEquals( $instance, $instance2 );
	}
}
