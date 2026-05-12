<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Authorization_Code_Grant;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\ID_Token_Validator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
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
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->discovery           = Mockery::mock( Discovery_Interface::class );
		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );
		$this->grant_handler       = Mockery::mock( OAuth_Grant_Handler::class );
		$this->id_token_validator  = Mockery::mock( ID_Token_Validator_Interface::class );
		$this->expiring_store      = Mockery::mock( Expiring_Store::class );

		$this->instance = new Authorization_Code_Handler(
			$this->discovery,
			$this->client_registration,
			$this->grant_handler,
			$this->id_token_validator,
			$this->expiring_store,
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
			->expects( 'ensure_registered' )
			->andReturn( $registered_client );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( $document );

		$this->expiring_store
			->expects( 'persist_for_user' )
			->once()
			->with( 'myyoast_current_authorization_state', Mockery::type( 'array' ), 600, 1 );

		$url = $this->instance->get_authorization_url( 1, 'https://example.com/callback', [ 'profile' ] );

		$this->assertStringStartsWith( 'https://my.yoast.com/api/oauth/auth?', $url );
		$this->assertStringContainsString( 'response_type=code', $url );
		$this->assertStringContainsString( 'client_id=client-123', $url );
		$this->assertStringContainsString( 'code_challenge_method=S256', $url );
		$this->assertStringContainsString( 'prompt=consent', $url );
		$this->assertStringContainsString( 'state=', $url );
		$this->assertStringNotContainsString( 'nonce=', $url );
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
			->expects( 'ensure_registered' )
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

		$url = $this->instance->get_authorization_url( 1, 'https://example.com/callback', [ 'openid', 'profile' ] );

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
			->expects( 'ensure_registered' )
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

		$url = $this->instance->get_authorization_url( 1, 'https://example.com/callback', [ 'profile' ], 'https://example.com/settings' );

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
			->with( Mockery::type( Authorization_Code_Grant::class ) )
			->andReturn( $token_set );

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
			->with( Mockery::type( Authorization_Code_Grant::class ) )
			->andReturn( $token_set );

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
			->with( Mockery::type( Authorization_Code_Grant::class ) )
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

		$result = $this->instance->exchange_code( 1, 'auth-code', 'the-state' );

		$this->assertSame( $token_set, $result );
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
