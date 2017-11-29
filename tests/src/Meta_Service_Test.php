<?php

namespace Yoast\Tests;

use Yoast\YoastSEO\Meta_Service;

class Meta_Service_Test extends \WPSEO_UnitTestCase {
	/**
	 * Tests registering hooks.
	 */
	public function test_register_hooks() {
		$instance = new Meta_Service();
		$instance->register_hooks();

		$this->assertEquals( 10, has_action( 'save_post', array( $instance, 'save_post' ) ) );
	}
}
