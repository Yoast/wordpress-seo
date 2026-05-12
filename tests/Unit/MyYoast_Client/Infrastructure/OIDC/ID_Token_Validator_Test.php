<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\OIDC;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\ID_Token_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Discovery_Client;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\ID_Token_Validator;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the ID_Token_Validator class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\ID_Token_Validator
 */
final class ID_Token_Validator_Test extends TestCase {

	/**
	 * The issuer key suffix used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The discovery client mock.
	 *
	 * @var Discovery_Client|Mockery\MockInterface
	 */
	private $discovery_client;

	/**
	 * The JWT signer (real instance).
	 *
	 * @var JWT_Signer
	 */
	private $jwt_signer;

	/**
	 * The issuer config mock.
	 *
	 * @var Issuer_Config|Mockery\MockInterface
	 */
	private $issuer_config;

	/**
	 * The test instance.
	 *
	 * @var ID_Token_Validator
	 */
	private $instance;

	/**
	 * Test key pair.
	 *
	 * @var string
	 */
	private $keypair;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->discovery_client = Mockery::mock( Discovery_Client::class );
		$this->jwt_signer       = new JWT_Signer();
		$this->issuer_config    = Mockery::mock( Issuer_Config::class );
		$this->issuer_config->allows( 'get_issuer_key' )->andReturn( self::ISSUER_KEY );
		$http_client    = Mockery::mock( HTTP_Client::class );
		$this->instance = new ID_Token_Validator( $this->discovery_client, $this->jwt_signer, $http_client, $this->issuer_config );
		$this->keypair  = \sodium_crypto_sign_keypair();
	}

	/**
	 * Tests successful ID token validation.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_success() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'client-123',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-456',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_myyoast_jwks_' . self::ISSUER_KEY )
			->andReturn( $jwks );

		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$payload = $this->instance->validate( $id_token, 'client-123', 'test-nonce' );

		$this->assertSame( 'user-456', $payload['sub'] );
		$this->assertSame( 'https://my.yoast.com', $payload['iss'] );
	}

	/**
	 * Tests that validation fails for expired ID tokens.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_expired_token_surfaces_expiry_reason() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'client-123',
				'iat'   => ( \time() - 7200 ),
				'exp'   => ( \time() - 3600 ),
				'nonce' => 'test-nonce',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'expired' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation fails for nonce mismatch.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_nonce_mismatch() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'     => 'https://my.yoast.com',
				'aud'     => 'client-123',
				'iat'     => \time(),
				'exp'     => ( \time() + 3600 ),
				'nonce'   => 'correct-nonce',
				'sub'     => 'user-456',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'nonce' );
		$this->instance->validate( $id_token, 'client-123', 'wrong-nonce' );
	}

	/**
	 * Tests that validation fails for audience mismatch.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_audience_mismatch() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'different-client',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'nonce',
				'sub'   => 'user-456',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'audience' );
		$this->instance->validate( $id_token, 'client-123', 'nonce' );
	}

	/**
	 * Tests that validation fails for invalid JWT format.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_invalid_format() {
		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'Invalid ID token format' );
		$this->instance->validate( 'not-a-jwt', 'client-123', 'nonce' );
	}

	/**
	 * Tests that validation fails for unsupported algorithm.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_unsupported_algorithm() {
		$header  = Base64url::encode(
			\json_encode(
				[
					'alg' => 'RS256',
					'kid' => 'test',
				],
			),
		);
		$payload = Base64url::encode( \json_encode( [ 'iss' => 'test' ] ) );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'Unsupported ID token algorithm: RS256' );
		$this->instance->validate( $header . '.' . $payload . '.fake-sig', 'client-123', 'nonce' );
	}

	/**
	 * Tests that validation fails for invalid header JSON.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_invalid_header() {
		$header  = Base64url::encode( 'not-json' );
		$payload = Base64url::encode( \json_encode( [ 'iss' => 'test' ] ) );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'Invalid ID token header' );
		$this->instance->validate( $header . '.' . $payload . '.fake-sig', 'client-123', 'nonce' );
	}

	/**
	 * Tests that validation fails for issuer mismatch.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_issuer_mismatch() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://evil.example.com',
				'aud'   => 'client-123',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-456',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'issuer mismatch' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation fails when a required OIDC claim is missing.
	 *
	 * @covers ::validate
	 *
	 * @dataProvider data_missing_required_claims
	 *
	 * @param string $missing_claim The claim to omit from the token payload.
	 *
	 * @return void
	 */
	public function test_validate_missing_required_claim( string $missing_claim ) {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$payload = [
			'iss'   => 'https://my.yoast.com',
			'aud'   => 'client-123',
			'iat'   => \time(),
			'exp'   => ( \time() + 3600 ),
			'nonce' => 'test-nonce',
			'sub'   => 'user-456',
		];

		unset( $payload[ $missing_claim ] );

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			$payload,
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'missing required claim: ' . $missing_claim );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Data provider for required OIDC claims.
	 *
	 * @return array<string, array{string}> The test data.
	 */
	public static function data_missing_required_claims(): array {
		return [
			'missing exp' => [ 'exp' ],
			'missing iat' => [ 'iat' ],
			'missing sub' => [ 'sub' ],
		];
	}

	/**
	 * Tests that validation succeeds with array audience containing the client_id.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_array_audience_containing_client_id() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => [ 'other-client', 'client-123' ],
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-789',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$payload = $this->instance->validate( $id_token, 'client-123', 'test-nonce' );

		$this->assertSame( 'user-789', $payload['sub'] );
	}

	/**
	 * Tests that validation fails when array audience has azp that doesn't match client_id.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_array_audience_with_azp_mismatch() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => [ 'other-client', 'client-123' ],
				'azp'   => 'other-client',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-789',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'azp claim does not match client_id' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation fails when array audience does not contain client_id.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_array_audience_without_client_id() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => [ 'other-client', 'another-client' ],
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-456',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'audience does not contain client_id' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation fails when iat claim is too old.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_iat_too_old_surfaces_reason() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'client-123',
				'iat'   => ( \time() - 7200 ),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
			],
			$private_key,
		);

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );
		$document = new Discovery_Document( $this->get_valid_discovery_response() );

		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'iat claim is too old' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation fails when signature verification fails (wrong key).
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_signature_verification_failure() {
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'test-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'client-123',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
			],
			$private_key,
		);

		// Use a different key pair for JWKS.
		$different_keypair = \sodium_crypto_sign_keypair();
		$wrong_public_key  = \sodium_crypto_sign_publickey( $different_keypair );

		$jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $wrong_public_key ),
				],
			],
		];

		Functions\expect( 'get_transient' )->andReturn( $jwks );

		$this->expectException( ID_Token_Validation_Exception::class );
		$this->expectExceptionMessage( 'signature verification failed' );
		$this->instance->validate( $id_token, 'client-123', 'test-nonce' );
	}

	/**
	 * Tests that validation refreshes JWKS cache when kid is not found.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_refreshes_jwks_on_cache_miss() {
		$public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$private_key = \sodium_crypto_sign_secretkey( $this->keypair );
		$kid         = 'new-kid';

		$id_token = $this->jwt_signer->sign(
			[
				'alg' => 'EdDSA',
				'kid' => $kid,
			],
			[
				'iss'   => 'https://my.yoast.com',
				'aud'   => 'client-123',
				'iat'   => \time(),
				'exp'   => ( \time() + 3600 ),
				'nonce' => 'test-nonce',
				'sub'   => 'user-999',
			],
			$private_key,
		);

		$stale_jwks = [
			'keys' => [
				[
					'kid' => 'old-kid',
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		$fresh_jwks = [
			'keys' => [
				[
					'kid' => $kid,
					'kty' => 'OKP',
					'crv' => 'Ed25519',
					'x'   => Base64url::encode( $public_key ),
				],
			],
		];

		// First call returns stale JWKS (kid not matching), second returns fresh.
		Functions\expect( 'get_transient' )
			->with( 'wpseo_myyoast_jwks_' . self::ISSUER_KEY )
			->andReturn( $stale_jwks, false );

		Functions\expect( 'delete_transient' )
			->with( 'wpseo_myyoast_jwks_' . self::ISSUER_KEY )
			->once();

		$document = new Discovery_Document( $this->get_valid_discovery_response() );
		$this->discovery_client
			->shouldReceive( 'get_document' )
			->andReturn( $document );

		$http_client = Mockery::mock( HTTP_Client::class );
		$http_client
			->expects( 'request' )
			->with(
				'GET',
				'https://my.yoast.com/api/oauth/jwks',
				Mockery::type( 'array' ),
			)
			->andReturn(
				new HTTP_Response( 200, [], $fresh_jwks ),
			);

		Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_myyoast_jwks_' . self::ISSUER_KEY, $fresh_jwks, Mockery::type( 'int' ) );

		// Create a new instance with the http_client mock that has request expectations.
		$instance = new ID_Token_Validator( $this->discovery_client, $this->jwt_signer, $http_client, $this->issuer_config );

		$payload = $instance->validate( $id_token, 'client-123', 'test-nonce' );

		$this->assertSame( 'user-999', $payload['sub'] );
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
