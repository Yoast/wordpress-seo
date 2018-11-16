<?php

namespace Yoast\Tests\UnitTests\Config;

use Yoast\YoastSEO\Config\Frontend;

/**
 * Class Frontend_Test
 *
 * @package Yoast\Tests\Config
 */
class Frontend_Test extends \PHPUnit_Framework_TestCase {

	/**
	 * Tests if the class is based upon the Integration interface
	 */
	public function test_class_instance() {
		$this->assertInstanceOf( '\Yoast\YoastSEO\WordPress\Integration', new Frontend() );
	}
}
