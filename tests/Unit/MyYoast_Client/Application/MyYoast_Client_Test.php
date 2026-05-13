<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\DPoP_Proof_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Token_Revocation_Handler;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client
 */
final class MyYoast_Client_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Client
	 */
	private $instance;

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The user token storage mock.
	 *
	 * @var User_Token_Storage_Interface|Mockery\MockInterface
	 */
	private $user_token_storage;

	/**
	 * The token storage mock.
	 *
	 * @var Token_Storage_Interface|Mockery\MockInterface
	 */
	private $token_storage;

	/**
	 * The token revocation handler mock.
	 *
	 * @var Token_Revocation_Handler|Mockery\MockInterface
	 */
	private $revocation_handler;

	/**
	 * The OAuth grant handler mock.
	 *
	 * @var OAuth_Grant_Handler|Mockery\MockInterface
	 */
	private $grant_handler;

	/**
	 * The lock helper mock.
	 *
	 * @var Lock_Helper|Mockery\MockInterface
	 */
	private $lock_helper;

	/**
	 * The authorization code handler mock.
	 *
	 * @var Authorization_Code_Handler|Mockery\MockInterface
	 */
	private $auth_code_handler;

	/**
	 * The HTTP client mock.
	 *
	 * @var OAuth_Server_Client_Interface|Mockery\MockInterface
	 */
	private $http_client;

	/**
	 * The DPoP proof provider mock.
	 *
	 * @var DPoP_Proof_Provider_Interface|Mockery\MockInterface
	 */
	private $dpop_proof_provider;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );
		$this->user_token_storage  = Mockery::mock( User_Token_Storage_Interface::class );
		$this->token_storage       = Mockery::mock( Token_Storage_Interface::class );
		$this->revocation_handler  = Mockery::mock( Token_Revocation_Handler::class );
		$this->grant_handler       = Mockery::mock( OAuth_Grant_Handler::class );
		$this->lock_helper         = Mockery::mock( Lock_Helper::class );
		$this->auth_code_handler   = Mockery::mock( Authorization_Code_Handler::class );
		$this->http_client         = Mockery::mock( OAuth_Server_Client_Interface::class );

		$site_url_provider = Mockery::mock( Site_URL_Provider_Interface::class );
		$site_url_provider->allows( 'get' )->andReturn( 'https://example.com/' );

		$this->dpop_proof_provider = Mockery::mock( DPoP_Proof_Provider_Interface::class );

		$this->instance = new MyYoast_Client(
			$this->client_registration,
			$this->auth_code_handler,
			$this->grant_handler,
			$this->revocation_handler,
			$this->http_client,
			$this->lock_helper,
			$this->token_storage,
			$this->user_token_storage,
			$site_url_provider,
			$this->dpop_proof_provider,
		);
	}

	/**
	 * Tests that is_registered delegates to client_registration.
	 *
	 * @covers ::is_registered
	 *
	 * @return void
	 */
	public function test_is_registered() {
		$this->client_registration
			->expects( 'is_registered' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->is_registered() );
	}

	/**
	 * Tests that get_user_token returns valid non-expired token.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_valid_token() {
		$token_set = new Token_Set( 'access', ( \time() + 3600 ), 'DPoP', 'refresh' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->once()
			->andReturn( $token_set );

		$result = $this->instance->get_user_token( 42 );

		$this->assertSame( 'access', $result->get_access_token() );
	}

	/**
	 * Tests that get_user_token refreshes expired token.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_refreshes_expired() {
		$expired = new Token_Set( 'old', ( \time() - 100 ), 'DPoP', 'refresh-token' );
		$fresh   = new Token_Set( 'new', ( \time() + 900 ), 'DPoP', 'new-refresh' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->once()
			->with(
				'wpseo_myyoast_refresh:' . \hash( 'sha256', 'refresh-token' ),
				Mockery::type( 'callable' ),
				30,
			)
			->andReturnUsing(
				static function ( $key, $callback ) {
					return $callback();
				},
			);

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->andReturn( $fresh );

		$this->user_token_storage
			->expects( 'store' )
			->with( 42, $fresh )
			->once();

		$result = $this->instance->get_user_token( 42 );

		$this->assertSame( 'new', $result->get_access_token() );
	}

	/**
	 * Tests that get_user_token returns null when user hasn't authorized.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_null_when_no_token() {
		$this->user_token_storage
			->expects( 'get' )
			->andReturn( null );

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that get_user_token clears tokens after repeated invalid_grant errors.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_clears_after_repeated_errors() {
		$expired = new Token_Set( 'old', ( \time() - 100 ), 'DPoP', 'refresh', null, null, 1 );

		$this->user_token_storage
			->expects( 'get' )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->once()
			->andReturnUsing(
				static function ( $key, $callback ) {
					return $callback();
				},
			);

		$this->grant_handler
			->expects( 'request_token' )
			->andThrow( new Token_Request_Failed_Exception( 'invalid_grant', 'consumed' ) );

		$this->user_token_storage
			->expects( 'delete' )
			->with( 42 )
			->once();

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that get_user_token returns null on lock timeout.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_null_on_lock_timeout() {
		$expired = new Token_Set( 'old', ( \time() - 100 ), 'DPoP', 'refresh-token' );

		$this->user_token_storage
			->expects( 'get' )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->once()
			->andThrow( new Lock_Timeout_Exception( 'lock-key', 30 ) );

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that revoke_user_token revokes and deletes.
	 *
	 * @covers ::revoke_user_token
	 *
	 * @return void
	 */
	public function test_revoke_user_token() {
		$token_set = new Token_Set( 'access', ( \time() + 3600 ), 'DPoP', 'refresh-to-revoke' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $token_set );

		$this->revocation_handler
			->expects( 'revoke' )
			->with( 'access', 'access_token' )
			->once()
			->andReturn( true );

		$this->revocation_handler
			->expects( 'revoke' )
			->with( 'refresh-to-revoke', 'refresh_token' )
			->once()
			->andReturn( true );

		$this->user_token_storage
			->expects( 'delete' )
			->with( 42 )
			->once();

		$this->instance->revoke_user_token( 42 );
	}

	/**
	 * Tests has_user_token.
	 *
	 * @covers ::has_user_token
	 *
	 * @return void
	 */
	public function test_has_user_token() {
		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( new Token_Set( 'access', ( \time() + 3600 ) ) );

		$this->assertTrue( $this->instance->has_user_token( 42 ) );
	}

	/**
	 * Tests that get_site_token returns cached token when valid.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_returns_cached() {
		$cached = new Token_Set( 'cached-token', ( \time() + 3600 ) );

		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( $cached );

		$result = $this->instance->get_site_token();

		$this->assertSame( 'cached-token', $result->get_access_token() );
	}

	/**
	 * Tests that get_site_token requests a new token when cache is expired.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_requests_new_when_expired() {
		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( null );

		$fresh = new Token_Set( 'new-site-token', ( \time() + 900 ) );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->andReturn( $fresh );

		$this->token_storage
			->expects( 'store' )
			->once();

		$result = $this->instance->get_site_token();

		$this->assertSame( 'new-site-token', $result->get_access_token() );
	}

	/**
	 * Tests that get_user_token returns null when expired and no refresh token.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_null_when_expired_no_refresh() {
		$expired = new Token_Set( 'access', ( \time() - 120 ) );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $expired );

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that get_user_token still returns the token when storage fails after refresh.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_token_when_storage_fails_after_refresh() {
		$expired = new Token_Set( 'old-access', ( \time() - 120 ), 'DPoP', 'refresh-tok' );
		$fresh   = new Token_Set( 'new-access', ( \time() + 3600 ), 'DPoP', 'new-refresh' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->andReturn( $fresh );

		$this->user_token_storage
			->expects( 'store' )
			->with( 42, $fresh )
			->andThrow( new Token_Storage_Exception( 'Encryption failed' ) );

		$result = $this->instance->get_user_token( 42 );

		$this->assertSame( 'new-access', $result->get_access_token() );
	}

	/**
	 * Tests that get_user_token returns null on non-invalid_grant error.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_null_on_server_error() {
		$expired = new Token_Set( 'access', ( \time() - 120 ), 'DPoP', 'refresh-tok' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->andThrow( new Token_Request_Failed_Exception( 'server_error', 'Internal error' ) );

		// Should NOT delete the stored token for non-invalid_grant errors.
		$this->user_token_storage->expects( 'delete' )->never();

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that get_user_token returns null when token lacks required scopes.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_null_when_missing_required_scopes() {
		$token_set = new Token_Set( 'access', ( \time() + 3600 ), 'DPoP', 'refresh', null, 'profile' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $token_set );

		$this->assertNull( $this->instance->get_user_token( 42, [ 'profile', 'email' ] ) );
	}

	/**
	 * Tests that get_user_token returns the token when required scopes are satisfied.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_returns_token_when_scopes_match() {
		$token_set = new Token_Set( 'access', ( \time() + 3600 ), 'DPoP', 'refresh', null, 'profile email' );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $token_set );

		$result = $this->instance->get_user_token( 42, [ 'profile' ] );

		$this->assertSame( 'access', $result->get_access_token() );
	}

	/**
	 * Tests that get_site_token requests a new token when cached token lacks required scopes.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_requests_new_when_scopes_missing() {
		$cached = new Token_Set( 'cached-token', ( \time() + 3600 ), 'DPoP', null, null, 'service:licenses:read' );

		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( $cached );

		$fresh = new Token_Set( 'new-token', ( \time() + 900 ), 'DPoP', null, null, 'service:licenses:read service:subscriptions:read' );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->andReturn( $fresh );

		$this->token_storage
			->expects( 'store' )
			->once();

		$result = $this->instance->get_site_token( [ 'service:subscriptions:read' ] );

		$this->assertSame( 'new-token', $result->get_access_token() );
	}

	/**
	 * Tests that revoke_user_token skips refresh token revocation when absent.
	 *
	 * @covers ::revoke_user_token
	 *
	 * @return void
	 */
	public function test_revoke_user_token_without_refresh_token() {
		$token_set = new Token_Set( 'access-only', ( \time() + 3600 ) );

		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( $token_set );

		$this->revocation_handler
			->expects( 'revoke' )
			->with( 'access-only', 'access_token' )
			->once()
			->andReturn( true );

		$this->user_token_storage
			->expects( 'delete' )
			->with( 42 )
			->once();

		$this->instance->revoke_user_token( 42 );
	}

	/**
	 * Tests that revoke_user_token does nothing when no token exists.
	 *
	 * @covers ::revoke_user_token
	 *
	 * @return void
	 */
	public function test_revoke_user_token_noop_when_no_token() {
		$this->user_token_storage
			->expects( 'get' )
			->with( 42 )
			->andReturn( null );

		$this->revocation_handler->expects( 'revoke' )->never();
		$this->user_token_storage->expects( 'delete' )->never();

		$this->instance->revoke_user_token( 42 );
	}

	/**
	 * Tests that the first invalid_grant increments error count instead of clearing.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_increments_error_count_on_first_invalid_grant() {
		$expired = new Token_Set( 'old', ( \time() - 100 ), 'DPoP', 'refresh', null, null, 0 );

		$this->user_token_storage
			->expects( 'get' )
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->once()
			->andReturnUsing(
				static function ( $key, $callback ) {
					return $callback();
				},
			);

		$this->grant_handler
			->expects( 'request_token' )
			->andThrow( new Token_Request_Failed_Exception( 'invalid_grant', 'consumed' ) );

		// Should NOT delete, but store with incremented error count.
		$this->user_token_storage->expects( 'delete' )->never();
		$this->user_token_storage
			->expects( 'store' )
			->with(
				42,
				Mockery::on(
					static function ( Token_Set $token_set ) {
						return $token_set->get_error_count() === 1;
					},
				),
			)
			->once();

		$this->assertNull( $this->instance->get_user_token( 42 ) );
	}

	/**
	 * Tests that authenticated_request delegates to the HTTP client.
	 *
	 * @covers ::authenticated_request
	 *
	 * @return void
	 */
	public function test_authenticated_request_delegates() {
		$token_set = new Token_Set( 'my-access-token', ( \time() + 3600 ), 'DPoP' );

		$this->http_client
			->expects( 'authenticated_request' )
			->with( 'GET', 'https://api.example.com/resource', 'my-access-token', 'DPoP', [] )
			->once()
			->andReturn(
				new HTTP_Response( 200, [], [ 'data' => 'value' ] ),
			);

		$result = $this->instance->authenticated_request( 'GET', 'https://api.example.com/resource', $token_set );

		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( [ 'data' => 'value' ], $result->get_body() );
	}

	/**
	 * Tests that ensure_registered delegates to client_registration.
	 *
	 * @covers ::ensure_registered
	 *
	 * @return void
	 */
	public function test_ensure_registered_delegates() {
		$registered = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );

		$this->client_registration
			->expects( 'ensure_registered' )
			->once()
			->andReturn( $registered );

		$result = $this->instance->ensure_registered();

		$this->assertSame( 'cid', $result->get_client_id() );
	}

	/**
	 * Tests that exchange_authorization_code exchanges code and stores the token.
	 *
	 * @covers ::exchange_authorization_code
	 *
	 * @return void
	 */
	public function test_exchange_authorization_code() {
		$token_set = new Token_Set( 'new-access', ( \time() + 3600 ), 'DPoP', 'new-refresh' );

		$this->auth_code_handler
			->expects( 'exchange_code' )
			->with( 42, 'auth-code', 'state-param' )
			->once()
			->andReturn( $token_set );

		$this->user_token_storage
			->expects( 'store' )
			->with( 42, $token_set )
			->once();

		// First-time exchange flips the site-wide "connected" flag from missing → true.
		Functions\expect( 'get_option' )->once()->with( 'wpseo_myyoast_site_connected', false )->andReturn( false );
		Functions\expect( 'update_option' )->once()->with( 'wpseo_myyoast_site_connected', true, false );

		$result = $this->instance->exchange_authorization_code( 42, 'auth-code', 'state-param' );

		$this->assertSame( 'new-access', $result->get_access_token() );
	}

	/**
	 * Tests that clear_site_token delegates to token_storage.
	 *
	 * @covers ::clear_site_token
	 *
	 * @return void
	 */
	public function test_clear_site_token() {
		$this->token_storage
			->expects( 'delete' )
			->once();

		$this->instance->clear_site_token();
	}

	/**
	 * Tests that revoke_token delegates to revocation_handler.
	 *
	 * @covers ::revoke_token
	 *
	 * @return void
	 */
	public function test_revoke_token() {
		$this->revocation_handler
			->expects( 'revoke' )
			->with( 'some-token', 'access_token' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->revoke_token( 'some-token', 'access_token' ) );
	}
}
