<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application\Grants;

use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Client_Credentials_Grant;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Client_Credentials_Grant class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Grants\Client_Credentials_Grant
 */
final class Client_Credentials_Grant_Test extends TestCase {

	/**
	 * Tests that get_grant_type returns 'client_credentials'.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_type
	 *
	 * @return void
	 */
	public function test_get_grant_type() {
		$grant = new Client_Credentials_Grant( [], 'https://example.com/' );

		$this->assertSame( 'client_credentials', $grant->get_grant_type() );
	}

	/**
	 * Tests that get_grant_params includes site_url and scope.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_params
	 *
	 * @return void
	 */
	public function test_get_grant_params_with_scopes() {
		$grant  = new Client_Credentials_Grant( [ 'service:licenses:read' ], 'https://example.com/' );
		$params = $grant->get_grant_params();

		$this->assertSame( 'https://example.com/', $params['site_url'] );
		$this->assertSame( 'service:licenses:read', $params['scope'] );
	}

	/**
	 * Tests that get_grant_params omits scope when empty.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_params
	 *
	 * @return void
	 */
	public function test_get_grant_params_without_scopes() {
		$grant  = new Client_Credentials_Grant( [], 'https://example.com/' );
		$params = $grant->get_grant_params();

		$this->assertSame( 'https://example.com/', $params['site_url'] );
		$this->assertArrayNotHasKey( 'scope', $params );
	}
}
