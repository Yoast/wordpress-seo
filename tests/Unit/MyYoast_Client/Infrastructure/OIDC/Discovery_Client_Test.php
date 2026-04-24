<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\OIDC;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Discovery_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Discovery_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Discovery_Client
 */
final class Discovery_Client_Test extends TestCase {

	/**
	 * The default issuer URL used in tests.
	 *
	 * @var string
	 */
	private const ISSUER_URL = 'https://my.yoast.com';

	/**
	 * The issuer config mock.
	 *
	 * @var Issuer_Config|Mockery\MockInterface
	 */
	private $issuer_config;

	/**
	 * The HTTP client mock.
	 *
	 * @var HTTP_Client|Mockery\MockInterface
	 */
	private $http_client;

	/**
	 * The test instance.
	 *
	 * @var Discovery_Client
	 */
	private $instance;

	/**
	 * A valid full discovery response (also used as cached transient data,
	 * since the full response is stored in the cache).
	 *
	 * @var array<string, string|string[]>
	 */
	private $valid_response;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->issuer_config = Mockery::mock( Issuer_Config::class );
		$this->issuer_config->allows( 'get_issuer_url' )->andReturn( self::ISSUER_URL );
		$this->issuer_config->allows( 'get_issuer_key' )->andReturn( \substr( \md5( self::ISSUER_URL ), 0, 8 ) );
		$this->http_client = Mockery::mock( HTTP_Client::class );
		$this->instance    = new Discovery_Client( $this->issuer_config, $this->http_client );

		$this->valid_response = [
			'issuer'                                           => self::ISSUER_URL,
			'authorization_endpoint'                           => self::ISSUER_URL . '/api/oauth/auth',
			'token_endpoint'                                   => self::ISSUER_URL . '/api/oauth/token',
			'registration_endpoint'                            => self::ISSUER_URL . '/api/oauth/reg',
			'revocation_endpoint'                              => self::ISSUER_URL . '/api/oauth/token/revocation',
			'jwks_uri'                                         => self::ISSUER_URL . '/api/oauth/jwks',
			'response_types_supported'                         => [ 'code' ],
			'subject_types_supported'                          => [ 'public' ],
			'id_token_signing_alg_values_supported'            => [ 'EdDSA' ],
			'code_challenge_methods_supported'                 => [ 'S256' ],
			'grant_types_supported'                            => [ 'authorization_code', 'refresh_token', 'client_credentials' ],
			'token_endpoint_auth_methods_supported'            => [ 'none', 'private_key_jwt' ],
			'token_endpoint_auth_signing_alg_values_supported' => [ 'EdDSA' ],
			'dpop_signing_alg_values_supported'                => [ 'EdDSA' ],
		];
	}

	/**
	 * Tests that get_document returns cached transient data.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_get_document_returns_cached_transient() {
		Functions\expect( 'get_transient' )
			->once()
			->with( $this->get_expected_cache_key() )
			->andReturn( $this->valid_response );

		$result = $this->instance->get_document();

		$this->assertInstanceOf( Discovery_Document::class, $result );
		$this->assertSame( self::ISSUER_URL, $result->get_issuer() );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/token', $result->get_token_endpoint() );
	}

	/**
	 * Tests that get_document fetches from server when no cache.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_get_document_fetches_from_server() {
		$this->issuer_config
			->expects( 'get_discovery_url' )
			->once()
			->andReturn( self::ISSUER_URL . '/.well-known/openid-configuration' );

		Functions\expect( 'get_transient' )
			->once()
			->with( $this->get_expected_cache_key() )
			->andReturn( false );

		$this->http_client
			->expects( 'request' )
			->once()
			->andReturn(
				new HTTP_Response( 200, [], $this->valid_response ),
			);

		Functions\expect( 'set_transient' )->once()->andReturn( true );

		$result = $this->instance->get_document();

		$this->assertInstanceOf( Discovery_Document::class, $result );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/token', $result->get_token_endpoint() );
	}

	/**
	 * Tests that a missing required capability throws Server_Capability_Exception.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_missing_capability_throws_exception() {
		$config = $this->valid_response;
		unset( $config['dpop_signing_alg_values_supported'] );

		$this->issuer_config
			->expects( 'get_discovery_url' )
			->andReturn( self::ISSUER_URL . '/.well-known/openid-configuration' );

		Functions\expect( 'get_transient' )
			->once()
			->with( $this->get_expected_cache_key() )
			->andReturn( false );

		$this->http_client
			->expects( 'request' )
			->once()
			->andReturn(
				new HTTP_Response( 200, [], $config ),
			);

		$this->expectException( Server_Capability_Exception::class );
		$this->instance->get_document();
	}

	/**
	 * Tests that a network error throws Discovery_Failed_Exception.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_network_error_throws_exception() {
		$this->issuer_config
			->expects( 'get_discovery_url' )
			->andReturn( self::ISSUER_URL . '/.well-known/openid-configuration' );

		Functions\expect( 'get_transient' )
			->once()
			->with( $this->get_expected_cache_key() )
			->andReturn( false );

		$this->http_client
			->expects( 'request' )
			->once()
			->andReturn(
				new HTTP_Response(
					0,
					[],
					[
						'error'             => 'network_error',
						'error_description' => 'Connection timed out',
					],
				),
			);

		$this->expectException( Discovery_Failed_Exception::class );
		$this->instance->get_document();
	}

	/**
	 * Tests that invalidate_cache clears both in-memory and transient cache.
	 *
	 * @covers ::invalidate_cache
	 *
	 * @return void
	 */
	public function test_invalidate_cache() {
		Functions\expect( 'delete_transient' )
			->once()
			->with( $this->get_expected_cache_key() );

		$this->instance->invalidate_cache();
	}

	/**
	 * Tests that get_document returns a Discovery_Document with all endpoints accessible.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_document_endpoint_accessors() {
		Functions\expect( 'get_transient' )
			->with( $this->get_expected_cache_key() )
			->andReturn( $this->valid_response );

		$document = $this->instance->get_document();

		$this->assertSame( self::ISSUER_URL . '/api/oauth/auth', $document->get_authorization_endpoint() );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/token', $document->get_token_endpoint() );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/reg', $document->get_registration_endpoint() );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/token/revocation', $document->get_revocation_endpoint() );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/jwks', $document->get_jwks_uri() );
		$this->assertSame( self::ISSUER_URL, $document->get_issuer() );
	}

	/**
	 * Tests that changing the issuer URL results in a cache miss and fresh fetch.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_issuer_change_causes_cache_miss() {
		$staging_issuer   = 'https://staging.yoast.com';
		$staging_response = $this->valid_response;

		$staging_response['issuer']                 = $staging_issuer;
		$staging_response['authorization_endpoint'] = $staging_issuer . '/api/oauth/auth';
		$staging_response['token_endpoint']         = $staging_issuer . '/api/oauth/token';
		$staging_response['registration_endpoint']  = $staging_issuer . '/api/oauth/reg';
		$staging_response['revocation_endpoint']    = $staging_issuer . '/api/oauth/token/revocation';
		$staging_response['jwks_uri']               = $staging_issuer . '/api/oauth/jwks';

		// Fresh mocks: issuer config now returns staging URL.
		$issuer_config = Mockery::mock( Issuer_Config::class );
		$issuer_config->allows( 'get_issuer_url' )->andReturn( $staging_issuer );
		$issuer_config->allows( 'get_issuer_key' )->andReturn( \substr( \md5( $staging_issuer ), 0, 8 ) );
		$issuer_config
			->expects( 'get_discovery_url' )
			->once()
			->andReturn( $staging_issuer . '/.well-known/openid-configuration' );

		$instance = new Discovery_Client( $issuer_config, $this->http_client );

		// The cache key is derived from the staging issuer URL, so the old
		// production cache is never consulted — it's a natural cache miss.
		Functions\expect( 'get_transient' )
			->once()
			->with( $this->get_expected_cache_key( $staging_issuer ) )
			->andReturn( false );

		$this->http_client
			->expects( 'request' )
			->once()
			->andReturn(
				new HTTP_Response( 200, [], $staging_response ),
			);

		Functions\expect( 'set_transient' )->once()->andReturn( true );

		$result = $instance->get_document();

		$this->assertInstanceOf( Discovery_Document::class, $result );
		$this->assertSame( $staging_issuer, $result->get_issuer() );
		$this->assertSame( $staging_issuer . '/api/oauth/token', $result->get_token_endpoint() );
	}

	/**
	 * Tests that corrupted cache is discarded and a fresh fetch is performed.
	 *
	 * @covers ::get_document
	 *
	 * @return void
	 */
	public function test_corrupted_cache_falls_through_to_fetch() {
		$corrupted_cache = [ 'issuer' => self::ISSUER_URL ]; // Missing required fields.

		$this->issuer_config
			->expects( 'get_discovery_url' )
			->once()
			->andReturn( self::ISSUER_URL . '/.well-known/openid-configuration' );

		Functions\expect( 'get_transient' )
			->with( $this->get_expected_cache_key() )
			->once()
			->andReturn( $corrupted_cache );

		Functions\expect( 'delete_transient' )
			->with( $this->get_expected_cache_key() )
			->once();

		$this->http_client
			->expects( 'request' )
			->once()
			->andReturn(
				new HTTP_Response( 200, [], $this->valid_response ),
			);

		Functions\expect( 'set_transient' )->once()->andReturn( true );

		$result = $this->instance->get_document();

		$this->assertInstanceOf( Discovery_Document::class, $result );
		$this->assertSame( self::ISSUER_URL . '/api/oauth/token', $result->get_token_endpoint() );
	}

	/**
	 * Returns the expected transient cache key for a given issuer URL.
	 *
	 * @param string $issuer_url The issuer URL.
	 *
	 * @return string The expected cache key.
	 */
	private function get_expected_cache_key( string $issuer_url = self::ISSUER_URL ): string {
		return 'wpseo_myyoast_oidc_' . \substr( \md5( $issuer_url ), 0, 8 );
	}
}
