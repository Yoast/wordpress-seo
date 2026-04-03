<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Discovery_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Token_Revocation_Handler;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Token_Revocation_Handler class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Token_Revocation_Handler
 */
final class Token_Revocation_Handler_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Token_Revocation_Handler
	 */
	private $instance;

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
	 * The discovery mock.
	 *
	 * @var Discovery_Interface|Mockery\MockInterface
	 */
	private $discovery;

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
		$this->instance              = new Token_Revocation_Handler(
			$this->discovery,
			$this->client_registration,
			$this->client_authenticator,
			$this->token_endpoint_client,
		);
	}

	/**
	 * Tests successful revocation.
	 *
	 * @covers ::revoke
	 *
	 * @return void
	 */
	public function test_revoke_success() {
		$credentials = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );

		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( $credentials );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery
			->expects( 'get_document' )
			->andReturn( $document );

		$this->client_authenticator
			->expects( 'create_client_assertion' )
			->andReturn( 'client-assertion-jwt' );

		$this->token_endpoint_client
			->expects( 'request' )
			->once()
			->andReturn(
				[
					'status'  => 200,
					'headers' => [],
					'body'    => '',
				],
			);

		$this->assertTrue( $this->instance->revoke( 'token-to-revoke' ) );
	}

	/**
	 * Tests that revoke returns false when not registered.
	 *
	 * @covers ::revoke
	 *
	 * @return void
	 */
	public function test_revoke_returns_false_when_not_registered() {
		$this->client_registration
			->expects( 'get_registered_client' )
			->andReturn( null );

		$this->assertFalse( $this->instance->revoke( 'token' ) );
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
