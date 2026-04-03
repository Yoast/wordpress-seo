<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signature_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the JWT_Signer class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer
 */
final class JWT_Signer_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var JWT_Signer
	 */
	private $instance;

	/**
	 * Ed25519 key pair for testing.
	 *
	 * @var string
	 */
	private $keypair;

	/**
	 * Ed25519 public key.
	 *
	 * @var string
	 */
	private $public_key;

	/**
	 * Ed25519 secret key.
	 *
	 * @var string
	 */
	private $private_key;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance    = new JWT_Signer();
		$this->keypair     = \sodium_crypto_sign_keypair();
		$this->public_key  = \sodium_crypto_sign_publickey( $this->keypair );
		$this->private_key = \sodium_crypto_sign_secretkey( $this->keypair );
	}

	/**
	 * Tests that sign() produces a valid compact JWT with three parts.
	 *
	 * @covers ::sign
	 *
	 * @return void
	 */
	public function test_sign_produces_three_part_jwt() {
		$jwt = $this->instance->sign(
			[
				'alg' => 'EdDSA',
				'typ' => 'JWT',
			],
			[ 'sub' => 'test' ],
			$this->private_key,
		);

		$parts = \explode( '.', $jwt );
		$this->assertCount( 3, $parts );
	}

	/**
	 * Tests that sign() produces a JWT that verify() can validate.
	 *
	 * @covers ::sign
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_sign_and_verify_round_trip() {
		$header  = [
			'alg' => 'EdDSA',
			'typ' => 'JWT',
		];
		$payload = [
			'iss' => 'test-client',
			'sub' => 'test-client',
		];

		$jwt    = $this->instance->sign( $header, $payload, $this->private_key );
		$result = $this->instance->verify( $jwt, $this->public_key );

		$this->assertIsArray( $result );
		$this->assertSame( $header, $result['header'] );
		$this->assertSame( $payload, $result['payload'] );
	}

	/**
	 * Tests that verify() rejects a JWT signed with a different key.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_wrong_key() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[ 'sub' => 'test' ],
			$this->private_key,
		);

		$other_keypair    = \sodium_crypto_sign_keypair();
		$other_public_key = \sodium_crypto_sign_publickey( $other_keypair );

		$this->expectException( JWT_Signature_Exception::class );
		$this->instance->verify( $jwt, $other_public_key );
	}

	/**
	 * Tests that verify() rejects a tampered JWT.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_tampered_jwt() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[ 'sub' => 'original' ],
			$this->private_key,
		);

		$parts    = \explode( '.', $jwt );
		$parts[1] = Base64url::encode( \wp_json_encode( [ 'sub' => 'tampered' ] ) );
		$tampered = \implode( '.', $parts );

		$this->expectException( JWT_Signature_Exception::class );
		$this->instance->verify( $tampered, $this->public_key );
	}

	/**
	 * Tests that verify() rejects malformed JWTs.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_malformed_jwt() {
		$this->expectException( JWT_Signature_Exception::class );
		$this->instance->verify( 'only-one-part', $this->public_key );
	}

	/**
	 * Tests that create_client_assertion() produces a valid JWT with correct claims.
	 *
	 * @covers ::create_client_assertion
	 * @covers ::sign
	 * @covers ::generate_jti
	 *
	 * @return void
	 */
	public function test_create_client_assertion() {
		$client_id      = 'my-client-id';
		$token_endpoint = 'https://my.yoast.com/api/oauth/token';
		$kid            = 'test-kid-123';

		$key_pair = new Key_Pair( $this->public_key, $this->private_key, $kid );
		$jwt      = $this->instance->create_client_assertion( $client_id, $token_endpoint, $key_pair );
		$result   = $this->instance->verify( $jwt, $this->public_key );

		$this->assertIsArray( $result );
		$this->assertSame( 'EdDSA', $result['header']['alg'] );
		$this->assertSame( $kid, $result['header']['kid'] );
		$this->assertSame( $client_id, $result['payload']['iss'] );
		$this->assertSame( $client_id, $result['payload']['sub'] );
		$this->assertSame( $token_endpoint, $result['payload']['aud'] );
		$this->assertArrayHasKey( 'iat', $result['payload'] );
		$this->assertArrayHasKey( 'exp', $result['payload'] );
		$this->assertArrayHasKey( 'jti', $result['payload'] );
		$this->assertSame( ( $result['payload']['iat'] + 120 ), $result['payload']['exp'] );
	}

	/**
	 * Tests that verify() rejects an expired JWT.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_expired_jwt() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[
				'sub' => 'test',
				'exp' => ( \time() - 3600 ),
				'iat' => \time(),
			],
			$this->private_key,
		);

		$this->expectException( JWT_Validation_Exception::class );
		$this->expectExceptionMessage( 'expired' );
		$this->instance->verify( $jwt, $this->public_key );
	}

	/**
	 * Tests that verify() accepts a JWT within the clock-skew leeway.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_accepts_jwt_within_leeway() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[
				'sub' => 'test',
				'exp' => ( \time() - 30 ),
				'iat' => \time(),
			],
			$this->private_key,
		);

		// Default 60s leeway should accept a token expired 30s ago.
		$result = $this->instance->verify( $jwt, $this->public_key );
		$this->assertIsArray( $result );
	}

	/**
	 * Tests that verify() rejects a JWT with a not-yet-valid nbf claim.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_not_yet_valid_jwt() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[
				'sub' => 'test',
				'nbf' => ( \time() + 3600 ),
				'exp' => ( \time() + 7200 ),
			],
			$this->private_key,
		);

		$this->expectException( JWT_Validation_Exception::class );
		$this->expectExceptionMessage( 'not yet valid' );
		$this->instance->verify( $jwt, $this->public_key );
	}

	/**
	 * Tests that verify() rejects a JWT with an unreasonably old iat claim.
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_rejects_stale_iat() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[
				'sub' => 'test',
				'iat' => ( \time() - 7200 ),
				'exp' => ( \time() + 3600 ),
			],
			$this->private_key,
		);

		$this->expectException( JWT_Validation_Exception::class );
		$this->expectExceptionMessage( 'iat claim is too old' );
		$this->instance->verify( $jwt, $this->public_key );
	}

	/**
	 * Tests that verify() accepts a JWT without time claims (they are optional per RFC 7519).
	 *
	 * @covers ::verify
	 *
	 * @return void
	 */
	public function test_verify_accepts_jwt_without_time_claims() {
		$jwt = $this->instance->sign(
			[ 'alg' => 'EdDSA' ],
			[ 'sub' => 'test' ],
			$this->private_key,
		);

		$result = $this->instance->verify( $jwt, $this->public_key );
		$this->assertIsArray( $result );
	}

	/**
	 * Tests that generate_jti produces unique values.
	 *
	 * @covers ::generate_jti
	 *
	 * @return void
	 */
	public function test_generate_jti_is_unique() {
		$jti_a = JWT_Signer::generate_jti();
		$jti_b = JWT_Signer::generate_jti();

		$this->assertNotSame( $jti_a, $jti_b );
		$this->assertNotEmpty( $jti_a );
	}
}
