<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Authorization_Flow_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Authorization_Code_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\ID_Token_Validator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Redirect_URI_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Authorization_Code_Handler class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler
 */
final class Authorization_Code_Handler_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Authorization_Code_Handler
	 */
	private $instance;

	/**
	 * The discovery mock.
	 *
	 * @var Discovery_Interface|Mockery\MockInterface
	 */
	private $discovery;

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The OAuth grant handler mock.
	 *
	 * @var OAuth_Grant_Handler|Mockery\MockInterface
	 */
	private $grant_handler;

	/**
	 * The ID token validator mock.
	 *
	 * @var ID_Token_Validator_Interface|Mockery\MockInterface
	 */
	private $id_token_validator;

	/**
	 * The expiring store mock.
	 *
	 * @var Expiring_Store|Mockery\MockInterface
	 */
	private $expiring_store;

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

		$this->discovery             = Mockery::mock( Discovery_Interface::class );
		$this->client_registration   = Mockery::mock( Client_Registration_Interface::class );
		$this->grant_handler         = Mockery::mock( OAuth_Grant_Handler::class );
		$this->id_token_validator    = Mockery::mock( ID_Token_Validator_Interface::class );
		$this->expiring_store        = Mockery::mock( Expiring_Store::class );
		$this->redirect_uri_provider = Mockery::mock( Redirect_URI_Provider_Interface::class );

		$this->redirect_uri_provider->allows( 'get_redirect_uris' )->andReturn( [ 'https://example.com/callback' ] );
		$this->redirect_uri_provider->allows( 'get_authorization_redirect_uri' )->andReturn( 'https://example.com/callback' )->byDefault();

		$this->instance = new Authorization_Code_Handler(
			$this->discovery,
			$this->client_registration,
			$this->grant_handler,
			$this->id_token_validator,
			$this->expiring_store,
			$this->redirect_uri_provider,
		);
	}

	/**
	 * Tests that get_authorization_url produces a valid URL with required parameters.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url() {
		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $registered_client );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( $document );

		$this->expiring_store
			->expects( 'persist_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', Mockery::type( 'array' ), 600, 1 );

		$url = $this->instance->get_authorization_url( 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertStringStartsWith( 'https://my.yoast.com/api/oauth/auth?', $url );
		$this->assertStringContainsString( 'response_type=code', $url );
		$this->assertStringContainsString( 'client_id=client-123', $url );
		$this->assertStringContainsString( 'code_challenge_method=S256', $url );
		$this->assertStringContainsString( 'prompt=consent', $url );
		$this->assertStringContainsString( 'state=', $url );
		$this->assertStringNotContainsString( 'nonce=', $url );
		$this->assertStringNotContainsString( 'resource=', $url );
	}

	/**
	 * Tests that get_authorization_url embeds the redirect URI resolved by the provider from the
	 * registered client.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url_embeds_provider_resolved_redirect_uri() {
		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $registered_client );

		// Override the blanket set_up stub: assert the provider receives the registered client and
		// flow context, and that its returned URI is the one embedded in the authorization URL.
		$this->redirect_uri_provider
			->expects( 'get_authorization_redirect_uri' )
			->once()
			->with( $registered_client, 1, [ 'profile' ], Mockery::type( Resource_Indicator::class ), null )
			->andReturn( 'https://proxy.example/cb' );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( new Discovery_Document( $this->get_valid_discovery_response() ) );

		$this->expiring_store->expects( 'persist_for_user' )->once();

		$url = $this->instance->get_authorization_url( 1, [ 'profile' ], Resource_Indicator::default() );

		$this->assertStringContainsString( 'redirect_uri=' . \rawurlencode( 'https://proxy.example/cb' ), $url );
	}

	/**
	 * Tests that get_authorization_url throws when the site is not registered, without triggering
	 * DCR or contacting discovery.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url_throws_when_not_registered() {
		$this->client_registration
			->expects( 'get_registered_client' )
			->once()
			->andReturn( null );

		$this->discovery->shouldNotReceive( 'get_document' );
		$this->expiring_store->shouldNotReceive( 'persist_for_user' );

		try {
			$this->instance->get_authorization_url( 1, [ 'profile' ], Resource_Indicator::default() );
			$this->fail( 'Expected Authorization_Flow_Exception.' );
		}
		catch ( Authorization_Flow_Exception $exception ) {
			$this->assertSame( 'not_registered', $exception->get_error_code() );
		}
	}

	/**
	 * Tests that get_authorization_url includes nonce when openid scope is requested.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url_includes_nonce_with_openid_scope() {
		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $registered_client );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( $document );

		$this->expiring_store
			->expects( 'persist_for_user' )
			->once()
			->with(
				'myyoast_current_authorization_state',
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& \is_string( $value['nonce'] )
							&& $value['nonce'] !== '';
					},
				),
				600,
				1,
			);

		$url = $this->instance->get_authorization_url( 1, [ 'openid', 'profile' ], Resource_Indicator::default() );

		$this->assertStringContainsString( 'nonce=', $url );
	}

	/**
	 * Tests that get_authorization_url stores the return_url in flow state.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url_with_return_url() {
		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $registered_client );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( $document );

		$this->expiring_store
			->expects( 'persist_for_user' )
			->once()
			->with(
				'myyoast_current_authorization_state',
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& $value['return_url'] === 'https://example.com/settings';
					},
				),
				600,
				1,
			);

		$url = $this->instance->get_authorization_url( 1, [ 'profile' ], Resource_Indicator::default(), 'https://example.com/settings' );

		$this->assertStringStartsWith( 'https://my.yoast.com/api/oauth/auth?', $url );
	}

	/**
	 * Tests that get_return_url returns the stored return URL.
	 *
	 * @covers ::get_return_url
	 * @covers ::get_flow_state
	 *
	 * @return void
	 */
	public function test_get_return_url() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'some-state',
					'code_verifier' => 'verifier',
					'nonce'         => 'nonce',
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => 'https://example.com/settings',
				],
			);

		$this->assertSame( 'https://example.com/settings', $this->instance->get_return_url( 1 ) );
	}

	/**
	 * Tests that get_return_url returns null when no pending flow exists.
	 *
	 * @covers ::get_return_url
	 * @covers ::get_flow_state
	 *
	 * @return void
	 */
	public function test_get_return_url_returns_null_when_no_flow() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andThrow( new Key_Not_Found_Exception( 'not found' ) );

		$this->assertNull( $this->instance->get_return_url( 1 ) );
	}

	/**
	 * Tests that exchange_code fails on state mismatch.
	 *
	 * @covers ::exchange_code
	 * @covers ::get_flow_state
	 *
	 * @return void
	 */
	public function test_exchange_code_state_mismatch() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'correct-state',
					'code_verifier' => 'verifier',
					'nonce'         => 'nonce',
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => null,
				],
			);

		$this->expiring_store
			->expects( 'delete_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 );

		$this->expectException( Token_Request_Failed_Exception::class );
		$this->expectExceptionMessage( 'State parameter mismatch' );
		$this->instance->exchange_code( 1, 'auth-code', 'wrong-state' );
	}

	/**
	 * Tests that exchange_code fails when no pending authorization exists.
	 *
	 * @covers ::exchange_code
	 * @covers ::get_flow_state
	 *
	 * @return void
	 */
	public function test_exchange_code_no_pending_authorization() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andThrow( new Key_Not_Found_Exception( 'not found' ) );

		$this->expectException( Token_Request_Failed_Exception::class );
		$this->expectExceptionMessage( 'No pending authorization' );
		$this->instance->exchange_code( 1, 'auth-code', 'state' );
	}

	/**
	 * Tests the happy path of exchange_code without an ID token.
	 *
	 * @covers ::exchange_code
	 * @covers ::get_flow_state
	 * @covers ::validate_id_token_nonce
	 *
	 * @return void
	 */
	public function test_exchange_code_success_without_id_token() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'the-state',
					'code_verifier' => 'the-verifier',
					'nonce'         => null,
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => null,
				],
			);

		$this->expiring_store
			->expects( 'delete_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 );

		$token_set = new Token_Set( 'access-tok', ( \time() + 3600 ), 'DPoP', 'refresh-tok' );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->with(
				Mockery::type( Authorization_Code_Grant::class ),
				Mockery::on(
					static function ( $indicator ) {
						return $indicator instanceof Resource_Indicator && $indicator->is_default();
					},
				),
			)
			->andReturn( $token_set );

		$this->client_registration
			->expects( 'mark_uri_validated' )
			->once()
			->with( 'https://example.com/callback' );

		$result = $this->instance->exchange_code( 1, 'auth-code', 'the-state' );

		$this->assertSame( $token_set, $result );
	}

	/**
	 * Tests exchange_code with an ID token but no nonce (openid not requested).
	 *
	 * @covers ::exchange_code
	 * @covers ::get_flow_state
	 * @covers ::validate_id_token_nonce
	 *
	 * @return void
	 */
	public function test_exchange_code_success_with_id_token_no_nonce() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'the-state',
					'code_verifier' => 'the-verifier',
					'nonce'         => null,
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => null,
				],
			);

		$this->expiring_store
			->expects( 'delete_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 );

		$token_set = new Token_Set( 'access-tok', ( \time() + 3600 ), 'DPoP', 'refresh-tok', 'eyJ.id.token' );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->with(
				Mockery::type( Authorization_Code_Grant::class ),
				Mockery::on(
					static function ( $indicator ) {
						return $indicator instanceof Resource_Indicator && $indicator->is_default();
					},
				),
			)
			->andReturn( $token_set );

		$this->client_registration
			->expects( 'mark_uri_validated' )
			->once()
			->with( 'https://example.com/callback' );

		$result = $this->instance->exchange_code( 1, 'auth-code', 'the-state' );

		$this->assertSame( $token_set, $result );
	}

	/**
	 * Tests exchange_code with an ID token and nonce validation (openid was requested).
	 *
	 * @covers ::exchange_code
	 * @covers ::get_flow_state
	 * @covers ::validate_id_token_nonce
	 *
	 * @return void
	 */
	public function test_exchange_code_success_with_id_token_and_nonce() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'the-state',
					'code_verifier' => 'the-verifier',
					'nonce'         => 'the-nonce',
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => null,
				],
			);

		$this->expiring_store
			->expects( 'delete_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 );

		$token_set = new Token_Set( 'access-tok', ( \time() + 3600 ), 'DPoP', 'refresh-tok', 'eyJ.id.token' );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->with(
				Mockery::type( Authorization_Code_Grant::class ),
				Mockery::on(
					static function ( $indicator ) {
						return $indicator instanceof Resource_Indicator && $indicator->is_default();
					},
				),
			)
			->andReturn( $token_set );

		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->once()
			->andReturn( $registered_client );

		$this->id_token_validator
			->expects( 'validate' )
			->once()
			->with( 'eyJ.id.token', 'client-123', 'the-nonce' )
			->andReturn( [ 'sub' => 'user-1' ] );

		$this->client_registration
			->expects( 'mark_uri_validated' )
			->once()
			->with( 'https://example.com/callback' );

		$result = $this->instance->exchange_code( 1, 'auth-code', 'the-state' );

		$this->assertSame( $token_set, $result );
	}

	/**
	 * Tests that exchange_code does not mark the site connected when the token request fails.
	 *
	 * @covers ::exchange_code
	 *
	 * @return void
	 */
	public function test_exchange_code_does_not_mark_uri_validated_on_failure() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 )
			->andReturn(
				[
					'state'         => 'the-state',
					'code_verifier' => 'the-verifier',
					'nonce'         => null,
					'redirect_uri'  => 'https://example.com/callback',
					'return_url'    => null,
				],
			);

		$this->expiring_store
			->expects( 'delete_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', 1 );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->with(
				Mockery::type( Authorization_Code_Grant::class ),
				Mockery::on(
					static function ( $indicator ) {
						return $indicator instanceof Resource_Indicator && $indicator->is_default();
					},
				),
			)
			->andThrow( new Token_Request_Failed_Exception( 'invalid_grant', 'Authorization code expired.' ) );

		// The strict mock fails the test if mark_uri_validated is called without an expectation.
		$this->expectException( Token_Request_Failed_Exception::class );

		$this->instance->exchange_code( 1, 'auth-code', 'the-state' );
	}

	/**
	 * Tests that get_authorization_url includes the resource indicator in the URL and persists it.
	 *
	 * @covers ::get_authorization_url
	 *
	 * @return void
	 */
	public function test_get_authorization_url_with_resource_indicator() {
		$registered_client = new Registered_Client( 'client-123', 'rat', 'https://my.yoast.com/reg/client-123' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $registered_client );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );
		$this->discovery->expects( 'get_document' )->andReturn( $document );

		$this->expiring_store
			->expects( 'persist_for_user' )
			->once()
			->with(
				'myyoast_current_authorization_state',
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& ( $value['resource_indicator'] ?? null ) === 'https://ai.yoa.st';
					},
				),
				600,
				1,
			);

		$url = $this->instance->get_authorization_url( 1, [ 'profile' ], new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->assertStringContainsString( 'resource=https%3A%2F%2Fai.yoa.st', $url );
	}

	/**
	 * Tests that exchange_code forwards the stored resource indicator to the grant and grant handler.
	 *
	 * @covers ::exchange_code
	 *
	 * @return void
	 */
	public function test_exchange_code_forwards_resource_indicator() {
		$this->expiring_store
			->expects( 'get_for_user' )
			->once()
			->andReturn(
				[
					'state'              => 'the-state',
					'code_verifier'      => 'the-verifier',
					'nonce'              => null,
					'redirect_uri'       => 'https://example.com/callback',
					'return_url'         => null,
					'resource_indicator' => 'https://ai.yoa.st',
				],
			);

		$this->expiring_store->expects( 'delete_for_user' )->once();

		$token_set = ( new Token_Set( 'access-tok', ( \time() + 3600 ), 'DPoP', 'refresh-tok' ) )
			->with_resource_indicator( new Resource_Indicator( 'https://ai.yoa.st' ) );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->withArgs(
				static function ( $grant, $indicator ) {
					return $grant instanceof Authorization_Code_Grant
						&& $indicator instanceof Resource_Indicator
						&& $indicator->value() === 'https://ai.yoa.st';
				},
			)
			->andReturn( $token_set );

		$this->client_registration
			->expects( 'mark_uri_validated' )
			->once()
			->with( 'https://example.com/callback' );

		$result = $this->instance->exchange_code( 1, 'auth-code', 'the-state' );

		$this->assertSame( 'https://ai.yoa.st', $result->get_resource_indicator()->value() );
	}

	/**
	 * Returns a valid OIDC discovery response array.
	 *
	 * @return array<string, string|string[]> The discovery response.
	 */
	private function get_valid_discovery_response(): array {
		return [
			'issuer'                                           => 'https://my.yoast.com',
			'authorization_endpoint'                           => 'https://my.yoast.com/api/oauth/auth',
			'token_endpoint'                                   => 'https://my.yoast.com/api/oauth/token',
			'registration_endpoint'                            => 'https://my.yoast.com/api/oauth/reg',
			'revocation_endpoint'                              => 'https://my.yoast.com/api/oauth/token/revocation',
			'jwks_uri'                                         => 'https://my.yoast.com/api/oauth/jwks',
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
}
