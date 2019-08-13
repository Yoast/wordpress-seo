<?php

namespace Yoast\WP\Free\Tests\Roles;

use WPSEO_Register_Roles;
use WPSEO_Role_Manager_Factory;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 */
class Register_Roles_Test extends TestCase {

	public function test_register() {
		$manager = WPSEO_Role_Manager_Factory::get();

		$register = new WPSEO_Register_Roles();
		$register->register();

		$registered = $manager->get_roles();

		$this->assertContains( 'wpseo_manager', $registered );
		$this->assertContains( 'wpseo_editor', $registered );
	}
}
