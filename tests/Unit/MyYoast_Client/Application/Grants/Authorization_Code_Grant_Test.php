<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application\Grants;

use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Authorization_Code_Grant;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Authorization_Code_Grant class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Grants\Authorization_Code_Grant
 */
final class Authorization_Code_Grant_Test extends TestCase {

	/**
	 * Tests that get_grant_type returns 'authorization_code'.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_type
	 *
	 * @return void
	 */
	public function test_get_grant_type() {
		$grant = new Authorization_Code_Grant( 'code-123', 'https://example.com/callback', 'verifier-abc' );

		$this->assertSame( 'authorization_code', $grant->get_grant_type() );
	}

	/**
	 * Tests that get_grant_params returns the correct parameters.
	 *
	 * @covers ::__construct
	 * @covers ::get_grant_params
	 *
	 * @return void
	 */
	public function test_get_grant_params() {
		$grant  = new Authorization_Code_Grant( 'code-123', 'https://example.com/callback', 'verifier-abc' );
		$params = $grant->get_grant_params();

		$this->assertSame( 'code-123', $params['code'] );
		$this->assertSame( 'https://example.com/callback', $params['redirect_uri'] );
		$this->assertSame( 'verifier-abc', $params['code_verifier'] );
	}
}
