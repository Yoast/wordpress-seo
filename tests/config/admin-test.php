<?php

namespace Yoast\Tests\Config;

use Yoast\WP\Free\Config\Admin;

/**
 * Class Admin_Test.
 *
 * @package Yoast\Tests\Config
 */
class Admin_Test extends \Yoast\Tests\TestCase {

	/**
	 * Tests if the class is based upon the Integration interface.
	 */
	public function test_class_instance() {
		$this->assertInstanceOf( '\Yoast\WP\Free\WordPress\Integration', new Admin() );
	}
}
