<?php

namespace Yoast\Tests\UnitTests\Config;

use Yoast\YoastSEO\Config\Admin;

/**
 * Class Admin_Test
 *
 * @package Yoast\Tests\Config
 */
class Admin_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * Tests if the class is based upon the Integration interface
	 */
	public function test_class_instance() {
		$this->assertInstanceOf( '\Yoast\YoastSEO\WordPress\Integration', new Admin() );
	}
}
