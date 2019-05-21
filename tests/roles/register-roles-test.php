<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Roles
 */

/**
 * Unit Test Class.
 */
class Register_Roles extends \Yoast\Tests\TestCase {

	public function test_register() {
		$manager = WPSEO_Role_Manager_Factory::get();

		$register = new WPSEO_Register_Roles();
		$register->register();

		$registered = $manager->get_roles();

		$this->assertContains( 'wpseo_manager', $registered );
		$this->assertContains( 'wpseo_editor', $registered );
	}
}
