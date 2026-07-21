<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;

use Brain\Monkey\Functions;

/**
 * Tests resolve.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver::resolve
 */
final class Resolve_Test extends Abstract_Post_Editability_Resolver_Test {

	/**
	 * Tests that no post IDs yields an empty map without priming caches or checking permissions.
	 *
	 * @return void
	 */
	public function test_resolve_returns_empty_for_no_ids() {
		$this->post_access_checker->expects( 'can_edit' )->never();

		$this->assertSame( [], $this->instance->resolve( [] ) );
	}

	/**
	 * Tests that each post ID is mapped to whether the current user may edit it.
	 *
	 * @return void
	 */
	public function test_resolve_maps_each_id_to_its_edit_permission() {
		Functions\expect( '_prime_post_caches' )->once()->with( [ 1, 2, 3 ], false, false );

		$this->post_access_checker->expects( 'can_edit' )->with( 1 )->andReturnTrue();
		$this->post_access_checker->expects( 'can_edit' )->with( 2 )->andReturnFalse();
		$this->post_access_checker->expects( 'can_edit' )->with( 3 )->andReturnTrue();

		$this->assertSame(
			[
				1 => true,
				2 => false,
				3 => true,
			],
			$this->instance->resolve( [ 1, 2, 3 ] ),
		);
	}
}
