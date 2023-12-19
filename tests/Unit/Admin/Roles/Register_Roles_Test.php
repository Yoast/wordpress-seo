<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Roles;

use WPSEO_Register_Roles;
use WPSEO_Role_Manager_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 */
final class Register_Roles_Test extends TestCase {

	/**
	 * Tests registration of the roles.
	 *
	 * @covers WPSEO_Register_Roles::register
	 *
	 * @return void
	 */
	public function test_register() {
		$manager = WPSEO_Role_Manager_Factory::get();

		$register = new WPSEO_Register_Roles();
		$register->register();

		$registered = $manager->get_roles();

		$this->assertContains( 'wpseo_manager', $registered );
		$this->assertContains( 'wpseo_editor', $registered );
	}
}
