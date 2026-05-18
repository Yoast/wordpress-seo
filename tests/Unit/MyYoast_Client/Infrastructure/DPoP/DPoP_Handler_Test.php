<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\DPoP;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Handler;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the DPoP_Handler class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Handler
 */
final class DPoP_Handler_Test extends TestCase {

	/**
	 * The issuer key suffix used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The key pair manager mock.
	 *
	 * @var Key_Pair_Manager|Mockery\MockInterface
	 */
	private $key_pair_manager;

	/**
	 * The JWT signer instance (real, not mocked).
	 *
	 * @var JWT_Signer
	 */
	private $jwt_signer;

	/**
	 * The test instance.
	 *
	 * @var DPoP_Handler
	 */
	private $instance;

	/**
	 * Test key pair.
	 *
	 * @var Key_Pair
	 */
	private $key_pair;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->key_pair_manager = Mockery::mock( Key_Pair_Manager::class );
		$this->jwt_signer       = new JWT_Signer();
		$issuer_config          = Mockery::mock( Issuer_Config::class );
		$issuer_config->allows( 'get_issuer_key' )->andReturn( self::ISSUER_KEY );
		$this->instance = new DPoP_Handler( $this->key_pair_manager, $this->jwt_signer, $issuer_config );

		$keypair        = \sodium_crypto_sign_keypair();
		$public_key     = \sodium_crypto_sign_publickey( $keypair );
		$private_key    = \sodium_crypto_sign_secretkey( $keypair );
		$kid            = Base64url::encode( \hash( 'sha256', $public_key, true ) );
		$this->key_pair = new Key_Pair( $public_key, $private_key, $kid );
	}

	/**
	 * Tests that create_proof produces a valid DPoP proof JWT.
	 *
	 * @covers ::create_proof
	 * @covers ::normalize_url
	 *
	 * @return void
	 */
	public function test_create_proof_structure() {
		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->with( Key_Pair_Manager::PURPOSE_DPOP )
			->andReturn( $this->key_pair );

		$this->key_pair_manager
			->expects( 'get_public_key_jwk' )
			->with( $this->key_pair )
			->andReturn(
				[
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $this->key_pair->get_public_key() ),
					'kid' => 'test-kid',
					'use' => 'sig',
					'alg' => 'EdDSA',
				],
			);

		Functions\expect( 'get_transient' )->andReturn( false );
		Functions\expect( 'wp_parse_url' )->andReturnUsing( 'parse_url' );

		$proof  = $this->instance->create_proof( 'POST', 'https://my.yoast.com/api/oauth/token' );
		$result = $this->jwt_signer->verify( $proof, $this->key_pair->get_public_key() );

		$this->assertIsArray( $result );
		$this->assertSame( 'dpop+jwt', $result['header']['typ'] );
		$this->assertSame( 'EdDSA', $result['header']['alg'] );
		$this->assertArrayHasKey( 'jwk', $result['header'] );
		$this->assertSame( 'POST', $result['payload']['htm'] );
		$this->assertSame( 'https://my.yoast.com/api/oauth/token', $result['payload']['htu'] );
		$this->assertArrayHasKey( 'iat', $result['payload'] );
		$this->assertArrayHasKey( 'jti', $result['payload'] );
		$this->assertArrayNotHasKey( 'ath', $result['payload'] );
	}

	/**
	 * Tests that create_proof includes ath claim when access_token is provided.
	 *
	 * @covers ::create_proof
	 *
	 * @return void
	 */
	public function test_create_proof_with_access_token_includes_ath() {
		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->andReturn( $this->key_pair );

		$this->key_pair_manager
			->expects( 'get_public_key_jwk' )
			->andReturn(
				[
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $this->key_pair->get_public_key() ),
				],
			);

		Functions\expect( 'get_transient' )->andReturn( false );
		Functions\expect( 'wp_parse_url' )->andReturnUsing( 'parse_url' );

		$access_token = 'eyJhbGciOiJFZERTQSJ9.test-token';
		$proof        = $this->instance->create_proof( 'GET', 'https://my.yoast.com/api/resource', $access_token );
		$result       = $this->jwt_signer->verify( $proof, $this->key_pair->get_public_key() );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'ath', $result['payload'] );

		$expected_ath = Base64url::encode( \hash( 'sha256', $access_token, true ) );
		$this->assertSame( $expected_ath, $result['payload']['ath'] );
	}

	/**
	 * Tests that create_proof includes nonce when stored.
	 *
	 * @covers ::create_proof
	 * @covers ::get_stored_nonce
	 *
	 * @return void
	 */
	public function test_create_proof_includes_nonce() {
		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->andReturn( $this->key_pair );

		$this->key_pair_manager
			->expects( 'get_public_key_jwk' )
			->andReturn(
				[
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => 'test',
				],
			);

		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_myyoast_dpop_nonce_' . self::ISSUER_KEY )
			->andReturn( 'server-nonce-123' );

		Functions\expect( 'wp_parse_url' )->andReturnUsing( 'parse_url' );

		$proof  = $this->instance->create_proof( 'POST', 'https://my.yoast.com/api/oauth/token' );
		$result = $this->jwt_signer->verify( $proof, $this->key_pair->get_public_key() );

		$this->assertSame( 'server-nonce-123', $result['payload']['nonce'] );
	}

	/**
	 * Tests that handle_nonce_response stores the nonce from headers.
	 *
	 * @covers ::handle_nonce_response
	 *
	 * @return void
	 */
	public function test_handle_nonce_response_stores_nonce() {
		Functions\expect( 'set_transient' )
			->with( 'wpseo_myyoast_dpop_nonce_' . self::ISSUER_KEY, 'new-nonce-456', 300 )
			->once()
			->andReturn( true );

		$this->instance->handle_nonce_response( [ 'dpop-nonce' => 'new-nonce-456' ] );
	}

	/**
	 * Tests that handle_nonce_response ignores headers without DPoP-Nonce.
	 *
	 * @covers ::handle_nonce_response
	 *
	 * @return void
	 */
	public function test_handle_nonce_response_ignores_missing_header() {
		$this->instance->handle_nonce_response( [ 'content-type' => 'application/json' ] );
		Functions\expect( 'set_transient' )->never();
	}

	/**
	 * Tests that create_proof strips query and fragment from URL.
	 *
	 * @covers ::create_proof
	 * @covers ::normalize_url
	 *
	 * @return void
	 */
	public function test_create_proof_strips_query_and_fragment() {
		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->andReturn( $this->key_pair );

		$this->key_pair_manager
			->expects( 'get_public_key_jwk' )
			->andReturn(
				[
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => 'test',
				],
			);

		Functions\expect( 'get_transient' )->andReturn( false );
		Functions\expect( 'wp_parse_url' )->andReturnUsing( 'parse_url' );

		$proof  = $this->instance->create_proof( 'GET', 'https://my.yoast.com/api/resource?foo=bar#frag' );
		$result = $this->jwt_signer->verify( $proof, $this->key_pair->get_public_key() );

		$this->assertSame( 'https://my.yoast.com/api/resource', $result['payload']['htu'] );
	}
}
