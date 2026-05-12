<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application\Grants;

use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Refresh_Token_Grant;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Refresh_Token_Grant class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Grants\Refresh_Token_Grant
 */
final class Refresh_Token_Grant_Test extends TestCase {

	/**
	 * Tests that get_grant_type returns 'refresh_token'.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_type
	 *
	 * @return void
	 */
	public function test_get_grant_type() {
		$grant = new Refresh_Token_Grant( 'rt-abc-123' );

		$this->assertSame( 'refresh_token', $grant->get_grant_type() );
	}

	/**
	 * Tests that get_grant_params returns the refresh token.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_params
	 *
	 * @return void
	 */
	public function test_get_grant_params() {
		$grant  = new Refresh_Token_Grant( 'rt-abc-123' );
		$params = $grant->get_grant_params();

		$this->assertSame( 'rt-abc-123', $params['refresh_token'] );
	}
}
