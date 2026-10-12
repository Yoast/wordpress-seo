<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Nonces;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Nonce_Repository.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository::get_rest_nonce
 */
final class Nonce_Repository_Test extends TestCase {

	/**
	 * Tests getting the REST nonce.
	 *
	 * @return void
	 */
	public function test_get_rest_nonce() {
		Functions\expect( 'wp_create_nonce' )
			->once()
			->with( 'wp_rest' )
			->andReturn( 'rest-nonce' );

		$instance = new Nonce_Repository();

		$this->assertSame( 'rest-nonce', $instance->get_rest_nonce() );
	}
}
