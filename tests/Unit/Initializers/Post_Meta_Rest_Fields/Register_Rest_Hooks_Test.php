<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Post_Meta_Rest_Fields;

use Brain\Monkey;

/**
 * Test class for the register_rest_hooks method.
 *
 * @group initializers
 *
 * @covers Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields::register_rest_hooks
 */
final class Register_Rest_Hooks_Test extends Abstract_Test {

	/**
	 * Tests that register_rest_hooks registers the filter that normalizes the primary term meta.
	 *
	 * @return void
	 */
	public function test_register_rest_hooks() {
		Monkey\Filters\expectAdded( 'get_post_metadata' )
			->with( [ $this->instance, 'normalize_primary_term_meta' ], \PHP_INT_MAX, 3 )
			->once();

		$this->instance->register_rest_hooks();
	}
}
