<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Grants\Grant_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the OAuth_Grant_Handler class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler
 */
final class OAuth_Grant_Handler_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var OAuth_Grant_Handler
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
	 * The client authenticator mock.
	 *
	 * @var Client_Authenticator_Interface|Mockery\MockInterface
	 */
	private $client_authenticator;

	/**
	 * The token endpoint client mock.
	 *
	 * @var OAuth_Server_Client_Interface|Mockery\MockInterface
	 */
	private $token_endpoint_client;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->discovery             = Mockery::mock( Discovery_Interface::class );
		$this->client_registration   = Mockery::mock( Client_Registration_Interface::class );
		$this->client_authenticator  = Mockery::mock( Client_Authenticator_Interface::class );
		$this->token_endpoint_client = Mockery::mock( OAuth_Server_Client_Interface::class );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->instance = new OAuth_Grant_Handler(
			$this->discovery,
			$this->client_registration,
			$this->client_authenticator,
			$this->token_endpoint_client,
		);
	}

	/**
	 * Tests that request_token builds the correct request body and returns a token set.
	 *
	 * @covers ::request_token
	 *
	 * @return void
	 */
	public function test_request_token_success() {
		$credentials = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );
		$this->client_registration->expects( 'ensure_registered' )->andReturn( $credentials );

		$this->client_authenticator
			->expects( 'create_client_assertion' )
			->andReturn( 'client-assertion-jwt' );

		$grant = Mockery::mock( Grant_Interface::class );
		$grant->expects( 'get_grant_type' )->andReturn( 'client_credentials' );
		$grant->expects( 'get_grant_params' )->andReturn( [ 'site_url' => 'https://example.com/' ] );

		$this->token_endpoint_client
			->expects( 'request' )
			->once()
			->with(
				'POST',
				'https://my.yoast.com/api/oauth/token',
				Mockery::on(
					static function ( $options ) {
						$body = ( $options['body'] ?? [] );
						return $body['grant_type'] === 'client_credentials'
							&& $body['client_id'] === 'cid'
							&& $body['client_assertion_type'] === 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
							&& $body['client_assertion'] === 'client-assertion-jwt'
							&& $body['site_url'] === 'https://example.com/'
							&& ! empty( $options['dpop'] );
					},
				),
			)
			->andReturn(
				new HTTP_Response(
					200,
					[],
					[
						'access_token' => 'new-token',
						'token_type'   => 'DPoP',
						'expires_in'   => 900,
					],
				),
			);

		$result = $this->instance->request_token( $grant );

		$this->assertSame( 'new-token', $result->get_access_token() );
	}

	/**
	 * Tests that request_token throws on error response.
	 *
	 * @covers ::request_token
	 *
	 * @return void
	 */
	public function test_request_token_throws_on_error() {
		$credentials = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );
		$this->client_registration->expects( 'ensure_registered' )->andReturn( $credentials );

		$this->client_authenticator
			->expects( 'create_client_assertion' )
			->andReturn( 'client-assertion-jwt' );

		$grant = Mockery::mock( Grant_Interface::class );
		$grant->expects( 'get_grant_type' )->twice()->andReturn( 'client_credentials' );
		$grant->expects( 'get_grant_params' )->andReturn( [] );

		$this->token_endpoint_client
			->expects( 'request' )
			->andReturn(
				new HTTP_Response(
					401,
					[],
					[
						'error'             => 'invalid_client',
						'error_description' => 'Not found',
					],
				),
			);

		$this->expectException( Token_Request_Failed_Exception::class );
		$this->instance->request_token( $grant );
	}

	/**
	 * Tests that request_token throws on non-JSON error response.
	 *
	 * @covers ::request_token
	 *
	 * @return void
	 */
	public function test_request_token_throws_on_non_json_error() {
		$credentials = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );
		$this->client_registration->expects( 'ensure_registered' )->andReturn( $credentials );

		$this->client_authenticator
			->expects( 'create_client_assertion' )
			->andReturn( 'client-assertion-jwt' );

		$grant = Mockery::mock( Grant_Interface::class );
		$grant->expects( 'get_grant_type' )->twice()->andReturn( 'client_credentials' );
		$grant->expects( 'get_grant_params' )->andReturn( [] );

		$this->token_endpoint_client
			->expects( 'request' )
			->andReturn(
				new HTTP_Response(
					500,
					[],
					'Internal Server Error',
				),
			);

		$this->expectException( Token_Request_Failed_Exception::class );
		$this->expectExceptionMessage( 'HTTP 500' );
		$this->instance->request_token( $grant );
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
