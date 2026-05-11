<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Key_Pair value object.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair
 */
final class Key_Pair_Test extends TestCase {

	/**
	 * Tests the constructor and getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_public_key
	 * @covers ::get_private_key
	 * @covers ::get_kid
	 *
	 * @return void
	 */
	public function test_getters() {
		$keypair     = \sodium_crypto_sign_keypair();
		$public_key  = \sodium_crypto_sign_publickey( $keypair );
		$private_key = \sodium_crypto_sign_secretkey( $keypair );

		$key_pair = new Key_Pair( $public_key, $private_key, 'kid-123' );

		$this->assertSame( $public_key, $key_pair->get_public_key() );
		$this->assertSame( $private_key, $key_pair->get_private_key() );
		$this->assertSame( 'kid-123', $key_pair->get_kid() );
	}

	/**
	 * Tests that the constructor throws on invalid public key length.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_invalid_public_key_length() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Public key must be' );

		$keypair = \sodium_crypto_sign_keypair();
		new Key_Pair( 'too-short', \sodium_crypto_sign_secretkey( $keypair ), 'kid' );
	}

	/**
	 * Tests that the constructor throws on invalid private key length.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_invalid_private_key_length() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Private key must be' );

		$keypair = \sodium_crypto_sign_keypair();
		new Key_Pair( \sodium_crypto_sign_publickey( $keypair ), 'too-short', 'kid' );
	}

	/**
	 * Tests that a Key_Pair can be constructed with real Ed25519 keys.
	 *
	 * @covers ::__construct
	 * @covers ::get_public_key
	 * @covers ::get_private_key
	 *
	 * @return void
	 */
	public function test_with_real_keys() {
		$keypair     = \sodium_crypto_sign_keypair();
		$public_key  = \sodium_crypto_sign_publickey( $keypair );
		$private_key = \sodium_crypto_sign_secretkey( $keypair );

		$key_pair = new Key_Pair( $public_key, $private_key, 'test-kid' );

		$this->assertSame( \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES, \strlen( $key_pair->get_public_key() ) );
		$this->assertSame( \SODIUM_CRYPTO_SIGN_SECRETKEYBYTES, \strlen( $key_pair->get_private_key() ) );
		$this->assertSame( 'test-kid', $key_pair->get_kid() );
	}
}
