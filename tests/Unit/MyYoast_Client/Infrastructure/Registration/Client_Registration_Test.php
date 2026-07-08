<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Registration;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception;
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
	 * Tests that is_uri_validated returns false when the site is not registered.
	 *
	 * @covers ::is_uri_validated
	 *
	 * @return void
	 */
	public function test_is_uri_validated_returns_false_when_not_registered() {
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_uri_validated( 'https://example.com/callback' ) );
	}

	/**
	 * Tests that is_uri_validated returns false when the URI has not been validated yet.
	 *
	 * @covers ::is_uri_validated
	 *
	 * @return void
	 */
	public function test_is_uri_validated_returns_false_when_uri_not_validated() {
		$this->mock_get_client();

		$this->assertFalse( $this->instance->is_uri_validated( 'https://example.com/callback' ) );
	}

	/**
	 * Tests that is_uri_validated returns true only for a redirect URI that has been validated.
	 *
	 * @covers ::is_uri_validated
	 *
	 * @return void
	 */
	public function test_is_uri_validated_returns_true_for_a_validated_uri() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn(
				[
					'client_id'               => 'cid',
					'encrypted_rat'           => 'encrypted-rat',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/cid',
					'metadata'                => [],
					'validated_uris'          => [ 'https://example.com/callback' ],
				],
			);

		$this->encryption->expects( 'decrypt' )->andReturn( 'decrypted-rat' );

		$this->assertTrue( $this->instance->is_uri_validated( 'https://example.com/callback' ) );
		$this->assertFalse( $this->instance->is_uri_validated( 'https://other.example/callback' ) );
	}

	/**
	 * Tests that ensure_registered is a no-op (no HTTP, returns the stored client) when the
	 * redirect-URI set already matches.
	 *
	 * @covers ::ensure_registered
	 *
	 * @return void
	 */
	public function test_ensure_registered_is_noop_when_set_matches() {
		$this->mock_get_client( [ 'redirect_uris' => [ 'https://example.com/callback' ] ] );

		$this->http_client->expects( 'authenticated_request' )->never();
		$this->http_client->expects( 'request' )->never();

		$result = $this->instance->ensure_registered( [ 'https://example.com/callback' ] );

		$this->assertSame( 'cid', $result->get_client_id() );
	}

	/**
	 * Tests that ensure_registered throws when not registered and no redirect URIs are given,
	 * so a token/auth flow can never silently register an empty client.
	 *
	 * @covers ::ensure_registered
	 *
	 * @return void
	 */
	public function test_ensure_registered_throws_when_not_registered_and_no_uris() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		$this->http_client->expects( 'request' )->never();
		$this->http_client->expects( 'authenticated_request' )->never();

		$this->expectException( Registration_Failed_Exception::class );
		$this->expectExceptionMessage( 'At least one redirect URI is required' );

		$this->instance->ensure_registered( [] );
	}

	/**
	 * Tests that ensure_registered updates the registration in place (RFC 7592 PUT, no
	 * deregister/re-register) when the redirect-URI set differs, preserving the client_id and
	 * pruning the validated URIs to the new set.
	 *
	 * @covers ::ensure_registered
	 * @covers ::update_redirect_uris
	 * @covers ::store_credentials
	 *
	 * @return void
	 */
	public function test_ensure_registered_updates_in_place_and_prunes_validated_uris() {
		// Registered with A + B, both validated.
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, Mockery::any() )
			->andReturn(
				[
					'client_id'               => 'cid',
					'encrypted_rat'           => 'encrypted-rat',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/cid',
					'metadata'                => [ 'redirect_uris' => [ 'https://a.example/cb', 'https://b.example/cb' ] ],
					'validated_uris'          => [ 'https://a.example/cb', 'https://b.example/cb' ],
				],
			);

		$this->encryption->allows( 'decrypt' )->andReturn( 'decrypted-rat' );
		$this->encryption->allows( 'encrypt' )->andReturn( 'encrypted-rat' );
		$this->issuer_config->expects( 'get_software_statement' )->andReturn( 'fresh-ss-jwt' );
		Functions\expect( 'wp_json_encode' )->andReturn( '{}' );

		// A single in-place PUT — never a DELETE or a POST register.
		$this->http_client
			->expects( 'authenticated_request' )
			->once()
			->with( 'PUT', Mockery::any(), Mockery::any(), Mockery::any(), Mockery::any() )
			->andReturn(
				new HTTP_Response(
					200,
					[],
					[
						'client_id'                 => 'cid',
						'registration_access_token' => 'rat',
						'registration_client_uri'   => 'https://my.yoast.com/api/oauth/reg/cid',
						'redirect_uris'             => [ 'https://a.example/cb', 'https://c.example/cb' ],
					],
				),
			);

		// B is pruned (removed from the set); C is not validated (newly added); A is kept.
		Functions\expect( 'update_option' )
			->once()
			->with(
				self::OPTION_KEY,
				Mockery::on(
					static function ( $option ) {
						return ( $option['validated_uris'] ?? null ) === [ 'https://a.example/cb' ];
					},
				),
				false,
			)
			->andReturn( true );

		$result = $this->instance->ensure_registered( [ 'https://a.example/cb', 'https://c.example/cb' ] );

		$this->assertSame( 'cid', $result->get_client_id() );
		$this->assertSame( [ 'https://a.example/cb' ], $result->get_validated_uris() );
	}

	/**
	 * Tests that store_credentials resets validated_uris when the server returns a different
	 * client_id, since a new client must re-validate every redirect URI from scratch.
	 *
	 * @covers ::store_credentials
	 *
	 * @return void
	 */
	public function test_store_credentials_resets_validated_uris_for_a_new_client_id() {
		// Registered as "old-cid" with A validated.
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, Mockery::any() )
			->andReturn(
				[
					'client_id'               => 'old-cid',
					'encrypted_rat'           => 'encrypted-rat',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/old-cid',
					'metadata'                => [ 'redirect_uris' => [ 'https://a.example/cb' ] ],
					'validated_uris'          => [ 'https://a.example/cb' ],
				],
			);

		$this->encryption->allows( 'decrypt' )->andReturn( 'decrypted-rat' );
		$this->encryption->allows( 'encrypt' )->andReturn( 'encrypted-rat' );
		$this->issuer_config->expects( 'get_software_statement' )->andReturn( 'fresh-ss-jwt' );
		Functions\expect( 'wp_json_encode' )->andReturn( '{}' );

		// The server responds with a different client_id and the same redirect URI.
		$this->http_client
			->expects( 'authenticated_request' )
			->once()
			->andReturn(
				new HTTP_Response(
					200,
					[],
					[
						'client_id'                 => 'new-cid',
						'registration_access_token' => 'rat',
						'registration_client_uri'   => 'https://my.yoast.com/api/oauth/reg/new-cid',
						'redirect_uris'             => [ 'https://a.example/cb' ],
					],
				),
			);

		// A was validated under the old client_id, but the new client_id resets all verification.
		Functions\expect( 'update_option' )
			->once()
			->with(
				self::OPTION_KEY,
				Mockery::on(
					static function ( $option ) {
						return ( $option['validated_uris'] ?? null ) === [];
					},
				),
				false,
			)
			->andReturn( true );

		$result = $this->instance->ensure_registered( [ 'https://b.example/cb' ] );

		$this->assertSame( 'new-cid', $result->get_client_id() );
		$this->assertSame( [], $result->get_validated_uris() );
	}

	/**
	 * Tests that mark_uri_validated appends the redirect URI to the stored registration.
	 *
	 * @covers ::mark_uri_validated
	 *
	 * @return void
	 */
	public function test_mark_uri_validated_appends_and_persists() {
		$stored = [
			'client_id'               => 'cid',
			'encrypted_rat'           => 'encrypted-rat',
			'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/cid',
			'metadata'                => [],
		];

		// Matches both the get_registered_client() read (default false) and the re-read for the update (default []).
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, Mockery::any() )
			->andReturn( $stored );

		$this->encryption->expects( 'decrypt' )->andReturn( 'decrypted-rat' );

		Functions\expect( 'update_option' )
			->once()
			->with(
				self::OPTION_KEY,
				Mockery::on(
					static function ( $option ) {
						return ( $option['validated_uris'] ?? null ) === [ 'https://example.com/callback' ];
					},
				),
				false,
			)
			->andReturn( true );

		$this->instance->mark_uri_validated( 'https://example.com/callback' );
	}

	/**
	 * Tests that mark_uri_validated is idempotent: re-marking an already-validated URI does not
	 * persist a duplicate.
	 *
	 * @covers ::mark_uri_validated
	 *
	 * @return void
	 */
	public function test_mark_uri_validated_is_idempotent() {
		Functions\expect( 'get_option' )
			->with( self::OPTION_KEY, false )
			->andReturn(
				[
					'client_id'               => 'cid',
					'encrypted_rat'           => 'encrypted-rat',
					'registration_client_uri' => 'https://my.yoast.com/api/oauth/reg/cid',
					'metadata'                => [],
					'validated_uris'          => [ 'https://example.com/callback' ],
				],
			);

		$this->encryption->expects( 'decrypt' )->andReturn( 'decrypted-rat' );

		Functions\expect( 'update_option' )->never();

		$this->instance->mark_uri_validated( 'https://example.com/callback' );
	}

	/**
	 * Tests that mark_uri_validated is a no-op when the site is not registered.
	 *
	 * @covers ::mark_uri_validated
	 *
	 * @return void
	 */
	public function test_mark_uri_validated_is_noop_when_not_registered() {
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY, false )
			->andReturn( false );

		Functions\expect( 'update_option' )->never();

		$this->instance->mark_uri_validated( 'https://example.com/callback' );
	}

	/**
	 * Tests that a 401 from the RFC 7592 read clears local state and throws Registration_Not_Found_Exception.
	 *
	 * @covers ::read_registration
	 *
	 * @return void
	 */
	public function test_read_registration_throws_not_found_on_401() {
		$this->mock_get_client();

		$this->http_client
			->expects( 'authenticated_request' )
			->andReturn( new HTTP_Response( 401, [], [ 'error' => 'invalid_token' ] ) );

		Functions\expect( 'delete_option' )->once()->with( self::OPTION_KEY )->andReturn( true );

		$this->expectException( Registration_Not_Found_Exception::class );
		$this->instance->read_registration();
	}

	/**
	 * Tests that a 404 from the RFC 7592 read clears local state and throws Registration_Not_Found_Exception.
	 *
	 * @covers ::read_registration
	 *
	 * @return void
	 */
	public function test_read_registration_throws_not_found_on_404() {
		$this->mock_get_client();

		$this->http_client
			->expects( 'authenticated_request' )
			->andReturn( new HTTP_Response( 404, [], [] ) );

		Functions\expect( 'delete_option' )->once()->with( self::OPTION_KEY )->andReturn( true );

		$this->expectException( Registration_Not_Found_Exception::class );
		$this->instance->read_registration();
	}

	/**
	 * Tests that a 429 from the RFC 7592 read throws Rate_Limited_Exception carrying the Retry-After.
	 *
	 * @covers ::read_registration
	 * @covers ::get_retry_after_seconds
	 *
	 * @return void
	 */
	public function test_read_registration_throws_rate_limited_on_429() {
		$this->mock_get_client();

		$this->http_client
			->expects( 'authenticated_request' )
			->andReturn( new HTTP_Response( 429, [ 'retry-after' => '120' ], [] ) );

		try {
			$this->instance->read_registration();
			$this->fail( 'Expected Rate_Limited_Exception was not thrown.' );
		} catch ( Rate_Limited_Exception $e ) {
			$this->assertSame( 120, $e->get_retry_after_seconds() );
		}
	}

	/**
	 * Tests that the typed registration exceptions are still caught as Registration_Failed_Exception.
	 *
	 * @covers \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception
	 * @covers \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception
	 *
	 * @return void
	 */
	public function test_typed_exceptions_extend_registration_failed_exception() {
		$this->assertInstanceOf( Registration_Failed_Exception::class, new Rate_Limited_Exception( 'rate limited' ) );
		$this->assertInstanceOf( Registration_Failed_Exception::class, new Registration_Not_Found_Exception( 'gone' ) );
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
