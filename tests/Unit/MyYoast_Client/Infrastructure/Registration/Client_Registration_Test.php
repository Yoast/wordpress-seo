<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Registration;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Discovery_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Registration\Client_Registration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Client_Registration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Registration\Client_Registration
 */
final class Client_Registration_Test extends TestCase {

	/**
	 * The issuer key used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The expected option key.
	 *
	 * @var string
	 */
	private const OPTION_KEY = 'wpseo_myyoast_client_registration_' . self::ISSUER_KEY;

	/**
	 * The test instance.
	 *
	 * @var Client_Registration
	 */
	private $instance;

	/**
	 * The discovery client mock.
	 *
	 * @var Discovery_Client|Mockery\MockInterface
	 */
	private $discovery_client;

	/**
	 * The key pair manager mock.
	 *
	 * @var Key_Pair_Manager|Mockery\MockInterface
	 */
	private $key_pair_manager;

	/**
	 * The encryption mock.
	 *
	 * @var Encryption|Mockery\MockInterface
	 */
	private $encryption;

	/**
	 * The issuer config mock.
	 *
	 * @var Issuer_Config|Mockery\MockInterface
	 */
	private $issuer_config;

	/**
	 * The lock helper mock.
	 *
	 * @var Lock_Helper|Mockery\MockInterface
	 */
	private $lock_helper;

	/**
	 * The HTTP client mock.
	 *
	 * @var HTTP_Client|Mockery\MockInterface
	 */
	private $http_client;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->discovery_client = Mockery::mock( Discovery_Client::class );
		$this->key_pair_manager = Mockery::mock( Key_Pair_Manager::class );
		$this->encryption       = Mockery::mock( Encryption::class );
		$this->issuer_config    = Mockery::mock( Issuer_Config::class );
		$this->issuer_config->allows( 'get_issuer_key' )->andReturn( self::ISSUER_KEY );
		$this->lock_helper = Mockery::mock( Lock_Helper::class );
		$this->http_client = Mockery::mock( HTTP_Client::class );

		$this->instance = new Client_Registration(
			$this->discovery_client,
			$this->key_pair_manager,
			$this->encryption,
			$this->issuer_config,
			$this->lock_helper,
			$this->http_client,
		);
	}

	/**
	 * Tests that get_client returns null when not registered.
	 *
	 * @covers ::get_registered_client
	 *
	 * @return void
	 */
	public function test_get_client_returns_null_when_not_registered() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->assertNull( $this->instance->get_registered_client() );
	}

	/**
	 * Tests that get_client returns the stored credentials.
	 *
	 * @covers ::get_registered_client
	 *
	 * @return void
	 */
	public function test_get_client_returns_stored_credentials() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn(
				[
					'client_id'               => 'test-client-id',
					'encrypted_rat'           => 'encrypted-rat-value',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/test-client-id',
					'metadata'                => [],
				],
			);

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-rat-value', 'yoast-myyoast-registration-credentials' )
			->andReturn( 'decrypted-rat' );

		$result = $this->instance->get_registered_client();

		$this->assertNotNull( $result );
		$this->assertSame( 'test-client-id', $result->get_client_id() );
		$this->assertSame( 'decrypted-rat', $result->get_registration_access_token() );
	}

	/**
	 * Tests that is_registered returns correct values.
	 *
	 * @covers ::is_registered
	 *
	 * @return void
	 */
	public function test_is_registered() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_registered() );
	}

	/**
	 * Tests that register throws when another registration is in progress.
	 *
	 * @covers ::register
	 *
	 * @return void
	 */
	public function test_register_throws_when_locked() {
		Functions\expect( 'get_current_blog_id' )->andReturn( 1 );

		$this->lock_helper
			->expects( 'execute' )
			->once()
			->andThrow( new Lock_Timeout_Exception( 'wpseo_myyoast_dcr_lock:1', 5 ) );

		$this->expectException( Registration_Failed_Exception::class );
		$this->expectExceptionMessage( 'Another registration' );
		$this->instance->register( [] );
	}

	/**
	 * Tests that delete_registration clears stored data.
	 *
	 * @covers ::forget_registration
	 *
	 * @return void
	 */
	public function test_delete_registration() {
		Functions\expect( 'delete_option' )
			->once()
			->with( self::OPTION_KEY )
			->andReturn( true );

		$this->instance->forget_registration();
	}

	/**
	 * Tests that rotate_registration_keys throws when not registered.
	 *
	 * @covers ::rotate_registration_keys
	 *
	 * @return void
	 */
	public function test_rotate_throws_when_not_registered() {
		Functions\expect( 'get_current_blog_id' )->andReturn( 1 );
		$this->lock_helper->allows( 'execute' )->andReturnUsing(
			static function ( $key, $callback ) {
				return $callback();
			},
		);

		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->expectException( Registration_Failed_Exception::class );
		$this->instance->rotate_registration_keys();
	}

	/**
	 * Tests that rotate_registration_keys succeeds and persists the new key pair.
	 *
	 * @covers ::rotate_registration_keys
	 *
	 * @return void
	 */
	public function test_rotate_succeeds() {
		Functions\expect( 'get_current_blog_id' )->andReturn( 1 );
		$this->lock_helper->allows( 'execute' )->andReturnUsing(
			static function ( $key, $callback ) {
				return $callback();
			},
		);

		$this->mock_get_client();

		$keypair  = \sodium_crypto_sign_keypair();
		$key_pair = new Key_Pair(
			\sodium_crypto_sign_publickey( $keypair ),
			\sodium_crypto_sign_secretkey( $keypair ),
			'new-kid',
		);

		$this->key_pair_manager->expects( 'generate_key_pair' )->andReturn( $key_pair );
		$this->key_pair_manager->expects( 'get_public_key_jwk' )->with( $key_pair )->andReturn( [ 'kty' => 'OKP' ] );

		$this->issuer_config->expects( 'get_software_statement' )->andReturn( 'fresh-ss-jwt' );

		Functions\expect( 'wp_json_encode' )->andReturn( '{}' );

		$this->http_client
			->expects( 'authenticated_request' )
			->once()
			->andReturn(
				new HTTP_Response(
					200,
					[],
					[
						'client_id'                 => 'cid',
						'registration_access_token' => 'new-rat',
						'registration_client_uri'   => 'https://my.yoast.com/api/oauth/reg/cid',
					],
				),
			);

		$this->key_pair_manager->expects( 'store_key_pair' )->once()->with( Key_Pair_Manager::PURPOSE_REGISTRATION, $key_pair );
		$this->encryption->expects( 'encrypt' )->andReturn( 'encrypted-rat' );
		Functions\expect( 'update_option' )->once()->andReturn( true );

		$result = $this->instance->rotate_registration_keys();
		$this->assertSame( 'cid', $result->get_client_id() );
	}

	/**
	 * Tests that rotate_registration_keys throws on server error without persisting keys.
	 *
	 * @covers ::rotate_registration_keys
	 *
	 * @return void
	 */
	public function test_rotate_throws_on_server_error() {
		Functions\expect( 'get_current_blog_id' )->andReturn( 1 );
		$this->lock_helper->allows( 'execute' )->andReturnUsing(
			static function ( $key, $callback ) {
				return $callback();
			},
		);

		$this->mock_get_client();

		$keypair  = \sodium_crypto_sign_keypair();
		$key_pair = new Key_Pair(
			\sodium_crypto_sign_publickey( $keypair ),
			\sodium_crypto_sign_secretkey( $keypair ),
			'new-kid',
		);

		$this->key_pair_manager->expects( 'generate_key_pair' )->andReturn( $key_pair );
		$this->key_pair_manager->expects( 'get_public_key_jwk' )->andReturn( [ 'kty' => 'OKP' ] );

		$this->issuer_config->expects( 'get_software_statement' )->andReturn( 'fresh-ss-jwt' );

		Functions\expect( 'wp_json_encode' )->andReturn( '{}' );

		$this->http_client
			->expects( 'authenticated_request' )
			->andReturn(
				new HTTP_Response( 500, [], [ 'error' => 'server_error' ] ),
			);

		$this->key_pair_manager->expects( 'store_key_pair' )->never();

		$this->expectException( Registration_Failed_Exception::class );
		$this->instance->rotate_registration_keys();
	}

	/**
	 * Tests that deregister returns true when not registered.
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_when_not_registered() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->assertTrue( $this->instance->deregister() );
	}

	/**
	 * Tests that deregister sends DELETE and cleans up.
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_sends_delete() {
		$this->mock_get_client();

		$this->http_client
			->expects( 'authenticated_request' )
			->once()
			->with(
				'DELETE',
				'https://my.yoast.com/api/oauth/reg/cid',
				'decrypted-rat',
				'Bearer',
				Mockery::type( 'array' ),
			)
			->andReturn(
				new HTTP_Response( 204, [], '' ),
			);

		Functions\expect( 'delete_option' )
			->once()
			->with( self::OPTION_KEY )
			->andReturn( true );

		$this->assertTrue( $this->instance->deregister() );
	}

	/**
	 * Tests that rotate_registration_keys strips server-assigned fields from the request body.
	 *
	 * @covers ::rotate_registration_keys
	 *
	 * @return void
	 */
	public function test_rotate_strips_server_assigned_fields_from_request_body() {
		Functions\expect( 'get_current_blog_id' )->andReturn( 1 );
		$this->lock_helper->allows( 'execute' )->andReturnUsing(
			static function ( $key, $callback ) {
				return $callback();
			},
		);

		$this->mock_get_client(
			[
				'client_id'                 => 'cid',
				'registration_client_uri'   => 'https://my.yoast.com/api/oauth/reg/cid',
				'client_id_issued_at'       => 1_234_567_890,
				'client_secret'             => 'old-secret',
				'client_secret_expires_at'  => 0,
				'software_statement'        => 'stale-ss-jwt',
				'redirect_uris'             => [ 'https://example.com/callback' ],
			],
		);

		$keypair  = \sodium_crypto_sign_keypair();
		$key_pair = new Key_Pair(
			\sodium_crypto_sign_publickey( $keypair ),
			\sodium_crypto_sign_secretkey( $keypair ),
			'new-kid',
		);

		$this->key_pair_manager->expects( 'generate_key_pair' )->andReturn( $key_pair );
		$this->key_pair_manager->expects( 'get_public_key_jwk' )->with( $key_pair )->andReturn( [ 'kty' => 'OKP' ] );

		$this->issuer_config->expects( 'get_software_statement' )->andReturn( 'fresh-ss-jwt' );

		Functions\expect( 'wp_json_encode' )
			->once()
			->with(
				Mockery::on(
					static function ( $body ) {
						// Server-assigned fields must be stripped.
						return ! \array_key_exists( 'registration_client_uri', $body )
							&& ! \array_key_exists( 'registration_access_token', $body )
							&& ! \array_key_exists( 'client_id_issued_at', $body )
							&& ! \array_key_exists( 'client_secret', $body )
							&& ! \array_key_exists( 'client_secret_expires_at', $body )
							// Software statement must be the fresh one.
							&& $body['software_statement'] === 'fresh-ss-jwt'
							// Client-provided fields must be preserved.
							&& $body['client_id'] === 'cid'
							&& isset( $body['jwks'] )
							&& isset( $body['redirect_uris'] );
					},
				),
			)
			->andReturn( '{}' );

		$this->http_client
			->expects( 'authenticated_request' )
			->once()
			->andReturn(
				new HTTP_Response(
					200,
					[],
					[
						'client_id'                 => 'cid',
						'registration_access_token' => 'new-rat',
						'registration_client_uri'   => 'https://my.yoast.com/api/oauth/reg/cid',
					],
				),
			);

		$this->key_pair_manager->expects( 'store_key_pair' )->once()->with( Key_Pair_Manager::PURPOSE_REGISTRATION, $key_pair );
		$this->encryption->expects( 'encrypt' )->andReturn( 'encrypted-rat' );
		Functions\expect( 'update_option' )->once()->andReturn( true );

		$result = $this->instance->rotate_registration_keys();
		$this->assertSame( 'cid', $result->get_client_id() );
	}

	/**
	 * Sets up mocks for get_client() to return a valid Registered_Client.
	 *
	 * @param array<string, mixed> $metadata Optional metadata to include in the stored registration.
	 *
	 * @return void
	 */
	private function mock_get_client( array $metadata = [] ): void {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn(
				[
					'client_id'               => 'cid',
					'encrypted_rat'           => 'encrypted-rat',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/cid',
					'metadata'                => $metadata,
				],
			);

		$this->encryption
			->expects( 'decrypt' )
			->andReturn( 'decrypted-rat' );
	}
}
