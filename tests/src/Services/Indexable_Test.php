<?php

namespace Yoast\Tests\Services;

use Yoast\YoastSEO\Services\Indexable;

class Indexable_Test extends \WPSEO_UnitTestCase {
	/**
	 * Tests registering hooks.
	 */
	public function test_register_hooks() {
		$instance = new Indexable();
		$instance->register_hooks();

		$this->assertEquals( PHP_INT_MAX, has_action( 'wp_insert_post', array( $instance, 'save_post_meta' ) ) );
	}
}
