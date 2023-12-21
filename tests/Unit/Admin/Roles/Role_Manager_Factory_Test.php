<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Roles;

use WPSEO_Role_Manager_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 */
final class Role_Manager_Factory_Test extends TestCase {

	/**
	 * Tests getting the role manager.
	 *
	 * @covers WPSEO_Role_Manager_Factory::get
	 *
	 * @return void
	 */
	public function test_get() {
		$instance  = WPSEO_Role_Manager_Factory::get();
		$instance2 = WPSEO_Role_Manager_Factory::get();

		$this->assertSame( $instance, $instance2 );
	}
}
