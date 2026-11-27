<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Post_Meta_Rest_Fields;

use Brain\Monkey;

/**
 * Test class for the initialize method.
 *
 * @group initializers
 *
 * @covers Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields::__construct
 * @covers Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields::initialize
 */
final class Initialize_Test extends Abstract_Test {

	/**
	 * Tests that initialize registers the hooks.
	 *
	 * @return void
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'wp_loaded' )
			->with( [ $this->instance, 'register_post_meta' ] )
			->once();
		Monkey\Actions\expectAdded( 'rest_api_init' )
			->with( [ $this->instance, 'register_rest_hooks' ] )
			->once();

		$this->instance->initialize();
	}
}
