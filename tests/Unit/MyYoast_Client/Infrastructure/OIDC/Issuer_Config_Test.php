<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\OIDC;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Issuer_Config class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config
 */
final class Issuer_Config_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Issuer_Config
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Issuer_Config();
	}

	/**
	 * Tests that get_issuer_url returns the default URL.
	 *
	 * @covers ::get_issuer_url
	 *
	 * @return void
	 */
	public function test_get_issuer_url_default() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_issuer_url', 'https://my.yoast.com' )
			->once()
			->andReturn( 'https://my.yoast.com' );

		$this->assertSame( 'https://my.yoast.com', $this->instance->get_issuer_url() );
	}

	/**
	 * Tests that get_issuer_url strips trailing slash.
	 *
	 * @covers ::get_issuer_url
	 *
	 * @return void
	 */
	public function test_get_issuer_url_strips_trailing_slash() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_issuer_url', 'https://my.yoast.com' )
			->once()
			->andReturn( 'https://staging.yoast.com/' );

		$this->assertSame( 'https://staging.yoast.com', $this->instance->get_issuer_url() );
	}

	/**
	 * Tests that get_discovery_url appends the well-known path.
	 *
	 * @covers ::get_discovery_url
	 * @covers ::get_issuer_url
	 *
	 * @return void
	 */
	public function test_get_discovery_url() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_issuer_url', 'https://my.yoast.com' )
			->once()
			->andReturn( 'https://my.yoast.com' );

		$this->assertSame(
			'https://my.yoast.com/.well-known/openid-configuration',
			$this->instance->get_discovery_url(),
		);
	}

	/**
	 * Tests that get_issuer_key returns a deterministic 8-char hash of the issuer URL.
	 *
	 * @covers ::get_issuer_key
	 * @covers ::get_issuer_url
	 *
	 * @return void
	 */
	public function test_get_issuer_key() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_issuer_url', 'https://my.yoast.com' )
			->once()
			->andReturn( 'https://my.yoast.com' );

		$suffix = $this->instance->get_issuer_key();

		$this->assertSame( \substr( \md5( 'https://my.yoast.com' ), 0, 8 ), $suffix );
	}

	/**
	 * Tests that get_issuer_key returns a different hash for different issuers.
	 *
	 * @covers ::get_issuer_key
	 * @covers ::get_issuer_url
	 *
	 * @return void
	 */
	public function test_get_issuer_key_differs_per_issuer() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_issuer_url', 'https://my.yoast.com' )
			->andReturn( 'https://staging.yoast.com' );

		$staging_suffix    = $this->instance->get_issuer_key();
		$production_suffix = \substr( \md5( 'https://my.yoast.com' ), 0, 8 );

		$this->assertNotSame( $production_suffix, $staging_suffix );
	}

	/**
	 * Tests that get_software_statement returns filtered value.
	 *
	 * @covers ::get_software_statement
	 *
	 * @return void
	 */
	public function test_get_software_statement() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_software_statement', '' )
			->once()
			->andReturn( 'test-jwt' );

		$this->assertSame( 'test-jwt', $this->instance->get_software_statement() );
	}

	/**
	 * Tests that get_initial_access_token returns filtered value.
	 *
	 * @covers ::get_initial_access_token
	 *
	 * @return void
	 */
	public function test_get_initial_access_token() {
		Functions\expect( 'apply_filters' )
			->with( 'Yoast\WP\SEO\myyoast_initial_access_token', '' )
			->once()
			->andReturn( 'test-iat' );

		$this->assertSame( 'test-iat', $this->instance->get_initial_access_token() );
	}
}
