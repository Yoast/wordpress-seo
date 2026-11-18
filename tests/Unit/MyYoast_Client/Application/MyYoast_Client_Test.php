<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Redirect_URI_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Token_Revocation_Handler;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
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
	 * The redirect URI provider mock.
	 *
	 * @var Redirect_URI_Provider_Interface|Mockery\MockInterface
	 */
	private $redirect_uri_provider;

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

		$this->redirect_uri_provider = Mockery::mock( Redirect_URI_Provider_Interface::class );
		$this->redirect_uri_provider->allows( 'get_redirect_uris' )->andReturn( [ 'https://example.com/callback' ] );

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
			$this->redirect_uri_provider,
		);
	}

	/**
	 * Mockery matcher for "is the default Resource_Indicator".
	 *
	 * @return Mockery\Matcher\MatcherAbstract
	 */
	private function default_indicator() {
		return Mockery::on(
			static function ( $indicator ) {
				return $indicator instanceof Resource_Indicator && $indicator->is_default();
			},
		);
	}

	/**
	 * Tests that is_registered reflects whether a registered client is stored.
	 *
	 * @covers ::is_registered
	 *
	 * @return void
	 */
	public function test_is_registered() {
		$this->client_registration
			->expects( 'get_registered_client' )
			->twice()
			->andReturn( new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' ), null );

		$this->assertTrue( $this->instance->is_registered() );
		$this->assertFalse( $this->instance->is_registered() );
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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

		$this->client_registration->expects( 'get_registered_client' )->once()->andReturn( new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' ) );
		$this->client_registration->shouldNotReceive( 'ensure_registered' );

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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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

		$this->client_registration->expects( 'get_registered_client' )->once()->andReturn( new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' ) );
		$this->client_registration->shouldNotReceive( 'ensure_registered' );

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
	 * Tests that get_site_token refuses to issue a token when the site isn't registered with MyYoast.
	 * Registration is a precondition handled by the user-driven connect flow; this method never
	 * triggers DCR on its own. Callers (e.g. the AI auth sender) see a typed Token_Request_Failed
	 * with `not_registered` and fall back accordingly.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_throws_when_site_not_registered() {
		$this->token_storage->expects( 'get' )->once()->andReturn( null );

		$this->client_registration->expects( 'get_registered_client' )->once()->andReturn( null );
		$this->client_registration->shouldNotReceive( 'ensure_registered' );

		$this->grant_handler->shouldNotReceive( 'request_token' );
		$this->token_storage->shouldNotReceive( 'store' );

		try {
			$this->instance->get_site_token();
			$this->fail( 'Expected Token_Request_Failed_Exception.' );
		}
		catch ( Token_Request_Failed_Exception $exception ) {
			$this->assertSame( 'not_registered', $exception->get_error_code() );
		}
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
			->with( 42, $this->default_indicator() )
			->andReturn( $token_set );

		$this->revocation_handler
			->expects( 'revoke' )
			->with( 'access-only', 'access_token' )
			->once()
			->andReturn( true );

		$this->user_token_storage
			->expects( 'delete' )
			->with( 42, $this->default_indicator() )
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
			->with( 42, $this->default_indicator() )
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
			->with( [ 'https://example.com/callback' ] )
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

	/**
	 * Tests that get_registered_client delegates to the client registration port.
	 *
	 * @covers ::get_registered_client
	 *
	 * @return void
	 */
	public function test_get_registered_client_delegates() {
		$registered = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->once()
			->andReturn( $registered );

		$this->assertSame( $registered, $this->instance->get_registered_client() );
	}

	/**
	 * Tests that get_site_token forwards the resource indicator to storage and grant.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_with_resource_indicator() {
		$indicator_matches = static function ( $indicator ) {
			return $indicator instanceof Resource_Indicator
				&& $indicator->value() === 'https://ai.yoa.st';
		};

		$this->token_storage
			->expects( 'get' )
			->withArgs(
				static function ( $indicator ) use ( $indicator_matches ) {
					return $indicator_matches( $indicator );
				},
			)
			->andReturn( null );

		$this->client_registration
			->expects( 'get_registered_client' )
			->once()
			->andReturn( new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' ) );

		$fresh = ( new Token_Set( 'ai-tok', ( \time() + 900 ) ) )->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->grant_handler
			->expects( 'request_token' )
			->withArgs(
				static function ( $grant, $requested_resource ) use ( $indicator_matches ) {
					return $indicator_matches( $requested_resource );
				},
			)
			->andReturn( $fresh );

		$this->token_storage
			->expects( 'store' )
			->with( $fresh )
			->once();

		$result = $this->instance->get_site_token( [ 'service:ai:consume' ], 'https://ai.yoa.st' );

		$this->assertSame( 'https://ai.yoa.st', $result->get_resource_indicator()->value() );
	}

	/**
	 * Tests that get_user_token refresh keeps the resource indicator binding.
	 *
	 * @covers ::get_user_token
	 *
	 * @return void
	 */
	public function test_get_user_token_refresh_preserves_resource_indicator() {
		$indicator_matches = static function ( $indicator ) {
			return $indicator instanceof Resource_Indicator
				&& $indicator->value() === 'https://ai.yoa.st';
		};

		$expired = ( new Token_Set( 'old', ( \time() - 100 ), 'DPoP', 'refresh-tok' ) )
			->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );
		$fresh   = ( new Token_Set( 'new', ( \time() + 900 ), 'DPoP', 'new-refresh' ) )
			->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->user_token_storage
			->expects( 'get' )
			->withArgs(
				static function ( $user_id, $indicator ) use ( $indicator_matches ) {
					return $user_id === 42 && $indicator_matches( $indicator );
				},
			)
			->andReturn( $expired );

		$this->lock_helper
			->expects( 'execute' )
			->andReturnUsing(
				static function ( $key, $callback ) {
					return $callback();
				},
			);

		$this->grant_handler
			->expects( 'request_token' )
			->withArgs(
				static function ( $grant, $requested_resource ) use ( $indicator_matches ) {
					return $indicator_matches( $requested_resource );
				},
			)
			->andReturn( $fresh );

		$this->user_token_storage
			->expects( 'store' )
			->with( 42, $fresh )
			->once();

		$result = $this->instance->get_user_token( 42, [], 'https://ai.yoa.st' );

		$this->assertSame( 'https://ai.yoa.st', $result->get_resource_indicator()->value() );
	}

	/**
	 * Tests that revoke_user_token targets only the requested resource bucket.
	 *
	 * @covers ::revoke_user_token
	 *
	 * @return void
	 */
	public function test_revoke_user_token_targets_resource_bucket() {
		$indicator_matches = static function ( $indicator ) {
			return $indicator instanceof Resource_Indicator
				&& $indicator->value() === 'https://ai.yoa.st';
		};

		$token_set = ( new Token_Set( 'ai-access', ( \time() + 3600 ), 'DPoP', 'ai-refresh' ) )
			->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->user_token_storage
			->expects( 'get' )
			->withArgs(
				static function ( $user_id, $indicator ) use ( $indicator_matches ) {
					return $user_id === 42 && $indicator_matches( $indicator );
				},
			)
			->andReturn( $token_set );

		$this->revocation_handler->expects( 'revoke' )->with( 'ai-access', 'access_token' )->andReturn( true );
		$this->revocation_handler->expects( 'revoke' )->with( 'ai-refresh', 'refresh_token' )->andReturn( true );

		$this->user_token_storage
			->expects( 'delete' )
			->withArgs(
				static function ( $user_id, $indicator ) use ( $indicator_matches ) {
					return $user_id === 42 && $indicator_matches( $indicator );
				},
			)
			->once();

		$this->instance->revoke_user_token( 42, 'https://ai.yoa.st' );
	}

	/**
	 * Tests that clear_site_token forwards the resource indicator to storage.
	 *
	 * @covers ::clear_site_token
	 *
	 * @return void
	 */
	public function test_clear_site_token_with_resource_indicator() {
		$this->token_storage
			->expects( 'delete' )
			->withArgs(
				static function ( $indicator ) {
					return $indicator instanceof Resource_Indicator
						&& $indicator->value() === 'https://ai.yoa.st';
				},
			)
			->once();

		$this->instance->clear_site_token( 'https://ai.yoa.st' );
	}

	/**
	 * Tests that revoke_all_user_tokens revokes every stored bucket.
	 *
	 * @covers ::revoke_all_user_tokens
	 *
	 * @return void
	 */
	public function test_revoke_all_user_tokens() {
		$default_token = new Token_Set( 'default-access', ( \time() + 3600 ), 'DPoP', 'default-refresh' );
		$ai_token      = ( new Token_Set( 'ai-access', ( \time() + 3600 ), 'DPoP', 'ai-refresh' ) )
			->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->user_token_storage
			->expects( 'get_all' )
			->with( 42 )
			->andReturn( [ $default_token, $ai_token ] );

		$this->revocation_handler->expects( 'revoke' )->with( 'default-access', 'access_token' )->andReturn( true );
		$this->revocation_handler->expects( 'revoke' )->with( 'default-refresh', 'refresh_token' )->andReturn( true );
		$this->revocation_handler->expects( 'revoke' )->with( 'ai-access', 'access_token' )->andReturn( true );
		$this->revocation_handler->expects( 'revoke' )->with( 'ai-refresh', 'refresh_token' )->andReturn( true );

		$this->user_token_storage->expects( 'delete' )->with( 42, $this->default_indicator() )->once();
		$this->user_token_storage->expects( 'delete' )->withArgs(
			static function ( $user_id, $indicator ) {
				return $user_id === 42
					&& $indicator instanceof Resource_Indicator
					&& $indicator->value() === 'https://ai.yoa.st';
			},
		)->once();

		$this->instance->revoke_all_user_tokens( 42 );
	}
}
