<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey;
use Exception;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Authorization_Flow_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Management_Route;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Management_Route class.
 *
 * @group routes
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\Management_Route
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
final class Management_Route_Test extends TestCase {

	/**
	 * The MyYoast client facade mock.
	 *
	 * @var MyYoast_Client|Mockery\MockInterface
	 */
	private $myyoast_client;

	/**
	 * The status presenter mock.
	 *
	 * @var Status_Presenter|Mockery\MockInterface
	 */
	private $status_presenter;

	/**
	 * The issuer config mock.
	 *
	 * @var Issuer_Config|Mockery\MockInterface
	 */
	private $issuer_config;

	/**
	 * The client registration port mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The instance under test.
	 *
	 * @var Management_Route
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->myyoast_client      = Mockery::mock( MyYoast_Client::class );
		$this->status_presenter    = Mockery::mock( Status_Presenter::class );
		$this->issuer_config       = Mockery::mock( Issuer_Config::class );
		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );

		$this->instance = new Management_Route(
			$this->myyoast_client,
			$this->status_presenter,
			$this->issuer_config,
			$this->client_registration,
		);

		// Default throttle stubs: the issuer key is always available and the marker
		// is absent (cache miss). Writes/deletes are asserted per-test with
		// Functions\expect(); a Functions\when() default here would shadow those
		// expectations, so it is intentionally omitted.
		$this->issuer_config->shouldReceive( 'get_issuer_key' )->andReturn( 'abcd1234' )->byDefault();
		Monkey\Functions\when( 'get_transient' )->justReturn( false );
	}

	/**
	 * Marks the config as provisioned (default in most tests).
	 *
	 * @return void
	 */
	private function provision(): void {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( 'jwt' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( 'iat' );
	}

	/**
	 * Marks the config as unprovisioned.
	 *
	 * @return void
	 */
	private function unprovision(): void {
		$this->issuer_config->shouldReceive( 'get_software_statement' )->andReturn( '' );
		$this->issuer_config->shouldReceive( 'get_initial_access_token' )->andReturn( '' );
	}

	/**
	 * Builds a REST request mock whose `return_url` param returns the given value.
	 *
	 * @param string|null $return_url The value `get_param( 'return_url' )` should return.
	 *
	 * @return WP_REST_Request|Mockery\MockInterface
	 */
	private function request_with_return_url( ?string $return_url ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->shouldReceive( 'get_param' )->with( 'return_url' )->andReturn( $return_url );

		return $request;
	}

	/**
	 * Returns the default status payload used by mocked presenter calls.
	 *
	 * @return array<string, mixed>
	 */
	private function status_payload(): array {
		return [
			'is_provisioned'      => true,
			'is_registered'       => true,
			'registered_at'       => 1_731_369_600,
			'registered_at_iso'   => '2025-11-12T00:00:00+00:00',
			'redirect_uris'       => [
				[
					'uri'         => 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard&yoast_myyoast_oauth_callback=1',
					'origin'      => 'https://example.com',
					'is_verified' => false,
				],
			],
			'redirect_uris_match' => true,
		];
	}

	/**
	 * Tests the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ MyYoast_Connection_Conditional::class ],
			Management_Route::get_conditionals(),
		);
	}

	/**
	 * Tests that all routes are registered. Five register_rest_route calls
	 * are made: /status (GET), /refresh-status (POST), /register (POST),
	 * /registration (PUT + DELETE on the same path), and /authorize (POST).
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )->times( 5 );

		$this->instance->register_routes();
	}

	/**
	 * Tests that the permission callback checks `wpseo_manage_options`.
	 *
	 * @covers ::can_manage
	 *
	 * @return void
	 */
	public function test_can_manage() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->can_manage() );
	}

	/**
	 * Tests GET /myyoast/status.
	 *
	 * @covers ::get_status
	 * @covers ::respond_with_connection_status
	 *
	 * @return void
	 */
	public function test_get_status_returns_payload() {
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->get_status();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that refresh_status dispatches to the facade, sets the throttle
	 * marker, and returns a success payload.
	 *
	 * @covers ::refresh_status
	 * @covers ::get_refresh_throttle_key
	 *
	 * @return void
	 */
	public function test_refresh_status_success() {
		$this->provision();
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )->once()->andReturn( [] );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_myyoast_refresh_throttle_abcd1234', 1, \HOUR_IN_SECONDS );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->refresh_status();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that refresh_status skips the upstream call when the throttle marker
	 * is present, returning the local status without touching the facade.
	 *
	 * @covers ::refresh_status
	 * @covers ::get_refresh_throttle_key
	 *
	 * @return void
	 */
	public function test_refresh_status_skips_when_throttled() {
		$this->provision();
		Monkey\Functions\when( 'get_transient' )->justReturn( 1 );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		$this->myyoast_client->shouldNotReceive( 'refresh_registration_status' );
		Monkey\Functions\expect( 'set_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->refresh_status();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that a failed upstream refresh does not set the throttle marker, so
	 * the next load retries.
	 *
	 * @covers ::refresh_status
	 *
	 * @return void
	 */
	public function test_refresh_status_does_not_throttle_on_failure() {
		$this->provision();
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )
			->once()
			->andThrow( new Rate_Limited_Exception( 'slow down' ) );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Monkey\Functions\expect( 'set_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->refresh_status();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that refresh_status hitting Registration_Not_Found_Exception surfaces registration_gone.
	 *
	 * @covers ::refresh_status
	 * @covers ::handle_exception
	 *
	 * @return void
	 */
	public function test_refresh_status_with_registration_gone() {
		$this->provision();
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )
			->once()
			->andThrow( new Registration_Not_Found_Exception( 'gone' ) );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->refresh_status();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests that a Rate_Limited_Exception carrying a Retry-After value
	 * surfaces it on the response body under `details.retry_after_seconds`.
	 *
	 * @covers ::handle_exception
	 * @covers ::error_response
	 *
	 * @return void
	 */
	public function test_rate_limited_response_includes_retry_after_details() {
		$this->provision();
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )
			->once()
			->andThrow( new Rate_Limited_Exception( 'slow down', 240 ) );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		$captured = null;
		$mock     = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$mock->shouldReceive( '__construct' )->andReturnUsing(
			static function ( $body ) use ( &$captured ): void {
				$captured = $body;
			},
		);

		$this->instance->refresh_status();

		$this->assertIsArray( $captured );
		$this->assertSame( 'rate_limited', $captured['error_code'] );
		$this->assertArrayHasKey( 'details', $captured );
		$this->assertSame( [ 'retry_after_seconds' => 240 ], $captured['details'] );
	}

	/**
	 * Tests that a Rate_Limited_Exception without a Retry-After value omits
	 * the `details` field entirely.
	 *
	 * @covers ::handle_exception
	 * @covers ::error_response
	 *
	 * @return void
	 */
	public function test_rate_limited_response_omits_details_when_retry_after_missing() {
		$this->provision();
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )
			->once()
			->andThrow( new Rate_Limited_Exception( 'slow down' ) );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		$captured = null;
		$mock     = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$mock->shouldReceive( '__construct' )->andReturnUsing(
			static function ( $body ) use ( &$captured ): void {
				$captured = $body;
			},
		);

		$this->instance->refresh_status();

		$this->assertIsArray( $captured );
		$this->assertSame( 'rate_limited', $captured['error_code'] );
		$this->assertArrayNotHasKey( 'details', $captured );
	}

	/**
	 * Tests that handle_exception maps each domain exception to a response (smoke
	 * test — exception-mapping coverage is per-branch but groups into one test).
	 *
	 * Driven through update_registration, which catches the full Throwable family;
	 * refresh_status only catches Registration_Failed_Exception (its declared
	 * throw type), so it cannot reach the sibling branches exercised here.
	 *
	 * @covers ::handle_exception
	 *
	 * @return void
	 */
	public function test_handle_exception_branches() {
		$this->provision();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );
		Monkey\Functions\expect( 'delete_transient' )->never();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$exceptions = [
			new Rate_Limited_Exception( 'rate' ),
			new Server_Capability_Exception( 'cap' ),
			new Discovery_Failed_Exception( 'discovery' ),
			new Token_Request_Failed_Exception( 'invalid_grant', 'bad', 400 ),
			new Token_Request_Failed_Exception( 'invalid_client', 'bad', 400 ),
			new Token_Storage_Exception( 'storage' ),
			new Registration_Failed_Exception( 'other' ),
			new Exception( 'boom' ),
		];

		foreach ( $exceptions as $exception ) {
			$this->myyoast_client->shouldReceive( 'ensure_registered' )
				->once()
				->andThrow( $exception );

			$response = $this->instance->update_registration();

			$this->assertInstanceOf( WP_REST_Response::class, $response );
		}
	}

	/**
	 * Tests POST /myyoast/register delegates to ensure_registered, which resolves the
	 * redirect URIs itself.
	 *
	 * @covers ::register
	 *
	 * @return void
	 */
	public function test_register_delegates_to_ensure_registered() {
		$this->provision();

		$this->myyoast_client->shouldNotReceive( 'deregister' );
		$this->myyoast_client->shouldReceive( 'ensure_registered' )->once()->withNoArgs();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'wpseo_myyoast_refresh_throttle_abcd1234' );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->register();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests PUT /myyoast/registration re-syncs the registration via ensure_registered.
	 *
	 * @covers ::update_registration
	 *
	 * @return void
	 */
	public function test_update_registration() {
		$this->provision();

		$this->myyoast_client->shouldReceive( 'ensure_registered' )->once()->withNoArgs();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'wpseo_myyoast_refresh_throttle_abcd1234' );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->update_registration();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests update_registration surfaces Registration_Not_Found as a normal error response.
	 *
	 * @covers ::update_registration
	 * @covers ::handle_exception
	 *
	 * @return void
	 */
	public function test_update_registration_handles_registration_gone() {
		$this->provision();

		$this->myyoast_client->shouldReceive( 'ensure_registered' )
			->once()
			->andThrow( new Registration_Not_Found_Exception( 'gone' ) );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->update_registration();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests deregister dispatches to the facade and also clears all site tokens.
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_success() {
		$this->provision();

		$this->myyoast_client->shouldReceive( 'deregister' )->once()->andReturn( true );
		$this->myyoast_client->shouldReceive( 'clear_all_site_tokens' )->once();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'wpseo_myyoast_refresh_throttle_abcd1234' );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->deregister();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests deregister still clears site tokens and reports success when the
	 * server-side teardown could not be confirmed (transport failure).
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_succeeds_locally_when_remote_unconfirmed() {
		$this->provision();

		$this->myyoast_client->shouldReceive( 'deregister' )->once()->andReturn( false );
		$this->myyoast_client->shouldReceive( 'clear_all_site_tokens' )->once();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );
		Monkey\Functions\expect( 'delete_transient' )->zeroOrMoreTimes();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->deregister();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests deregister still clears site tokens when the remote call throws
	 * unexpectedly, so the site is never left half-connected.
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_clears_tokens_when_remote_throws() {
		$this->provision();

		$this->myyoast_client->shouldReceive( 'deregister' )->once()->andThrow( new Exception( 'boom' ) );
		$this->myyoast_client->shouldReceive( 'clear_all_site_tokens' )->once();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );
		Monkey\Functions\expect( 'delete_transient' )->zeroOrMoreTimes();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->deregister();

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests the registration-mutating endpoints short-circuit when the plugin is
	 * not provisioned.
	 *
	 * The register/update endpoints gate on provisioning; authorize gates on
	 * having a registered client (a stricter precondition that also implies
	 * provisioning), so with no client stubbed it short-circuits before touching
	 * the facade too. The refresh-status and deregister endpoints work without
	 * provisioning and are covered by their own tests.
	 *
	 * @covers ::require_provisioned
	 *
	 * @return void
	 */
	public function test_registration_actions_blocked_when_not_provisioned() {
		$this->unprovision();
		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( null );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		$this->myyoast_client->shouldNotReceive( 'ensure_registered' );
		$this->myyoast_client->shouldNotReceive( 'get_authorization_url' );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->register() );
		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->update_registration() );
		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->authorize( $this->request_with_return_url( null ) ) );
	}

	/**
	 * Tests refresh_status works regardless of provisioning — it talks to MyYoast with
	 * the stored registration access token, not the software statement.
	 *
	 * @covers ::refresh_status
	 *
	 * @return void
	 */
	public function test_refresh_status_works_when_not_provisioned() {
		$this->unprovision();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );
		$this->myyoast_client->shouldReceive( 'refresh_registration_status' )->once();
		Monkey\Functions\expect( 'set_transient' )->zeroOrMoreTimes();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->refresh_status() );
	}

	/**
	 * Tests deregister works regardless of provisioning — disconnecting only
	 * needs the stored registration, not the software statement.
	 *
	 * @covers ::deregister
	 *
	 * @return void
	 */
	public function test_deregister_works_when_not_provisioned() {
		$this->unprovision();
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );
		$this->myyoast_client->shouldReceive( 'deregister' )->once()->andReturn( true );
		$this->myyoast_client->shouldReceive( 'clear_all_site_tokens' )->once();
		Monkey\Functions\expect( 'delete_transient' )->zeroOrMoreTimes();

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->deregister() );
	}

	/**
	 * Tests authorize passes a valid same-host return URL through to the facade.
	 *
	 * @covers ::authorize
	 * @covers ::resolve_return_url
	 *
	 * @return void
	 */
	public function test_authorize_passes_valid_return_url() {
		$this->provision();

		$return_url    = 'https://example.com/wp-admin/admin.php?page=wpseo_integrations';
		$authorize_url = 'https://my.yoast.com/auth?code_challenge=abc';

		$this->client_registration->shouldReceive( 'get_registered_client' )
			->andReturn(
				new Registered_Client(
					'client-123',
					'rat',
					'https://my.yoast.com/clients/client-123',
					[ 'redirect_uris' => [ 'https://example.com/cb' ] ],
				),
			);

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 42 );

		Monkey\Functions\expect( 'wp_validate_redirect' )
			->once()
			->with( $return_url, '' )
			->andReturn( $return_url );

		$this->myyoast_client->shouldReceive( 'get_authorization_url' )
			->once()
			->with( 42, [ 'openid' ], null, $return_url )
			->andReturn( $authorize_url );

		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->authorize( $this->request_with_return_url( $return_url ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests authorize passes null to the facade when no return URL is supplied,
	 * so the callback later surfaces a standalone outcome instead of redirecting.
	 *
	 * @covers ::authorize
	 * @covers ::resolve_return_url
	 *
	 * @return void
	 */
	public function test_authorize_passes_null_when_return_url_absent() {
		$this->provision();

		$this->client_registration->shouldReceive( 'get_registered_client' )
			->andReturn(
				new Registered_Client(
					'client-123',
					'rat',
					'https://my.yoast.com/clients/client-123',
					[ 'redirect_uris' => [ 'https://example.com/cb' ] ],
				),
			);

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 42 );
		Monkey\Functions\expect( 'wp_validate_redirect' )->never();

		$this->myyoast_client->shouldReceive( 'get_authorization_url' )
			->once()
			->with( 42, [ 'openid' ], null, null )
			->andReturn( 'https://my.yoast.com/auth?code_challenge=abc' );

		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->authorize( $this->request_with_return_url( null ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests authorize drops an off-site return URL to null rather than forwarding
	 * it, closing the open-redirect surface at the route.
	 *
	 * @covers ::authorize
	 * @covers ::resolve_return_url
	 *
	 * @return void
	 */
	public function test_authorize_drops_offsite_return_url() {
		$this->provision();

		$evil_url = 'https://evil.example.org/phish';

		$this->client_registration->shouldReceive( 'get_registered_client' )
			->andReturn(
				new Registered_Client(
					'client-123',
					'rat',
					'https://my.yoast.com/clients/client-123',
					[ 'redirect_uris' => [ 'https://example.com/cb' ] ],
				),
			);

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 42 );

		// wp_validate_redirect returns the (empty) fallback for an off-site URL.
		Monkey\Functions\expect( 'wp_validate_redirect' )
			->once()
			->with( $evil_url, '' )
			->andReturn( '' );

		$this->myyoast_client->shouldReceive( 'get_authorization_url' )
			->once()
			->with( 42, [ 'openid' ], null, null )
			->andReturn( 'https://my.yoast.com/auth?code_challenge=abc' );

		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$response = $this->instance->authorize( $this->request_with_return_url( $evil_url ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
	}

	/**
	 * Tests authorize surfaces an error when the site is not registered.
	 *
	 * @covers ::authorize
	 *
	 * @return void
	 */
	public function test_authorize_when_not_registered() {
		$this->provision();

		$this->client_registration->shouldReceive( 'get_registered_client' )->andReturn( null );
		$this->myyoast_client->shouldNotReceive( 'get_authorization_url' );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->authorize( $this->request_with_return_url( null ) ) );
	}

	/**
	 * Tests authorize maps Authorization_Flow_Exception to a registration_failed error.
	 *
	 * @covers ::authorize
	 *
	 * @return void
	 */
	public function test_authorize_handles_flow_exception() {
		$this->provision();

		$this->client_registration->shouldReceive( 'get_registered_client' )
			->andReturn(
				new Registered_Client(
					'client-123',
					'rat',
					'https://my.yoast.com/clients/client-123',
					[ 'redirect_uris' => [ 'https://example.com/cb' ] ],
				),
			);

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 42 );

		$this->myyoast_client->shouldReceive( 'get_authorization_url' )
			->andThrow( new Authorization_Flow_Exception( 'registration_failed', 'boom' ) );

		$this->status_presenter->shouldReceive( 'present' )->andReturn( $this->status_payload() );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->authorize( $this->request_with_return_url( null ) ) );
	}
}
