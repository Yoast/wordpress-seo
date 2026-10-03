<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Encryption class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption
 */
final class Encryption_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Encryption
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		if ( ! \defined( 'AUTH_KEY' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WordPress core constant.
			\define( 'AUTH_KEY', 'test-auth-key-for-unit-tests-must-be-unique' );
		}

		$this->instance = new Encryption();
	}

	/**
	 * Tests that encrypt and decrypt round-trip correctly.
	 *
	 * @covers ::encrypt
	 * @covers ::decrypt
	 * @covers ::derive_key
	 *
	 * @return void
	 */
	public function test_encrypt_decrypt_round_trip() {
		$plaintext = 'This is a secret message';
		$context   = 'test-context';

		$encrypted = $this->instance->encrypt( $plaintext, $context );
		$decrypted = $this->instance->decrypt( $encrypted, $context );

		$this->assertSame( $plaintext, $decrypted );
	}

	/**
	 * Tests that different contexts produce different ciphertexts.
	 *
	 * @covers ::encrypt
	 * @covers ::derive_key
	 *
	 * @return void
	 */
	public function test_different_contexts_produce_different_ciphertexts() {
		$plaintext = 'same-plaintext';

		$encrypted_a = $this->instance->encrypt( $plaintext, 'context-a' );
		$encrypted_b = $this->instance->encrypt( $plaintext, 'context-b' );

		$this->assertNotSame( $encrypted_a, $encrypted_b );
	}

	/**
	 * Tests that decrypting with wrong context fails.
	 *
	 * @covers ::decrypt
	 * @covers ::derive_key
	 *
	 * @return void
	 */
	public function test_decrypt_with_wrong_context_throws() {
		$encrypted = $this->instance->encrypt( 'secret', 'correct-context' );

		$this->expectException( Encryption_Exception::class );
		$this->instance->decrypt( $encrypted, 'wrong-context' );
	}

	/**
	 * Tests that decrypting corrupted data fails.
	 *
	 * @covers ::decrypt
	 *
	 * @return void
	 */
	public function test_decrypt_corrupted_data_throws() {
		$this->expectException( Encryption_Exception::class );
		$this->instance->decrypt( 'not-valid-base64!@#$', 'context' );
	}

	/**
	 * Tests that decrypting a too-short ciphertext fails.
	 *
	 * @covers ::decrypt
	 *
	 * @return void
	 */
	public function test_decrypt_too_short_ciphertext_throws() {
		$this->expectException( Encryption_Exception::class );
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Test fixture.
		$this->instance->decrypt( \base64_encode( 'short' ), 'context' );
	}

	/**
	 * Tests that encrypted output is base64-encoded.
	 *
	 * @covers ::encrypt
	 *
	 * @return void
	 */
	public function test_encrypted_output_is_base64() {
		$encrypted = $this->instance->encrypt( 'test', 'context' );

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Test assertion.
		$this->assertNotFalse( \base64_decode( $encrypted, true ) );
	}

	/**
	 * Tests that encrypting the same plaintext produces different ciphertexts (random nonce).
	 *
	 * @covers ::encrypt
	 *
	 * @return void
	 */
	public function test_encrypt_produces_unique_ciphertexts() {
		$encrypted_a = $this->instance->encrypt( 'same', 'same-context' );
		$encrypted_b = $this->instance->encrypt( 'same', 'same-context' );

		$this->assertNotSame( $encrypted_a, $encrypted_b );
	}

	/**
	 * Tests that binary data survives the round trip.
	 *
	 * @covers ::encrypt
	 * @covers ::decrypt
	 *
	 * @return void
	 */
	public function test_binary_data_round_trip() {
		$binary_data = \random_bytes( 64 );

		$encrypted = $this->instance->encrypt( $binary_data, 'binary-context' );
		$decrypted = $this->instance->decrypt( $encrypted, 'binary-context' );

		$this->assertSame( $binary_data, $decrypted );
	}
}
