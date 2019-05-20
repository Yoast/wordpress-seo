<?php

namespace Yoast\WP\Free\Tests\Config;

use Yoast\WP\Free\Config\Frontend;

/**
 * Class Frontend_Test.
 *
 * @package Yoast\Tests\Config
 */
class Frontend_Test extends \Yoast\WP\Free\Tests\TestCase {

	/**
	 * Tests if the class is based upon the Integration interface.
	 */
	public function test_class_instance() {
		$this->assertInstanceOf( '\Yoast\WP\Free\WordPress\Integration', new Frontend() );
	}
}
