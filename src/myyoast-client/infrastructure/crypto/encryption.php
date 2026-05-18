<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use Exception;
use SensitiveParameter;
use SodiumException;

/**
 * Provides symmetric encryption and decryption using libsodium.
 *
 * Derives per-purpose 256-bit encryption keys from the WordPress AUTH_KEY
 * constant via HKDF-SHA256. The encryption key is never stored — it is
 * derived on every call.
 */
class Encryption {

	/**
	 * Encrypts a plaintext string using sodium_crypto_secretbox (XSalsa20-Poly1305).
	 *
	 * @param string $plaintext The data to encrypt.
	 * @param string $context   A unique context string for key derivation (e.g. "yoast-myyoast-dpop-key").
	 *
	 * @return string Base64-encoded nonce + ciphertext.
	 *
	 * @throws Encryption_Exception If encryption fails.
	 */
	public function encrypt(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $plaintext,
		string $context
	): string {
		$key = $this->derive_key( $context );

		try {
			$nonce      = \random_bytes( \SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
			$ciphertext = \sodium_crypto_secretbox( $plaintext, $nonce, $key );

			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Binary ciphertext needs safe encoding.
			return \base64_encode( $nonce . $ciphertext );
		} catch ( Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Encryption_Exception( 'Encryption failed: ' . $e->getMessage(), 0, $e );
		}
		finally {
			// Securely wipe the derived key from memory to prevent leakage via memory dumps or core files.
			try {
				\sodium_memzero( $key );
			} catch ( SodiumException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Best-effort cleanup.
				// Best-effort: key will be freed when $key goes out of scope.
			}
		}
	}

	/**
	 * Decrypts a previously encrypted string.
	 *
	 * @param string $encrypted Base64-encoded nonce + ciphertext from encrypt().
	 * @param string $context   The same context string used during encryption.
	 *
	 * @return string The decrypted plaintext.
	 *
	 * @throws Encryption_Exception If decryption fails (corrupt data, wrong key, tampered ciphertext).
	 */
	public function decrypt( string $encrypted, string $context ): string {
		$key = $this->derive_key( $context );

		try {
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Decoding our own base64-encoded ciphertext.
			$decoded = \base64_decode( $encrypted, true );
			if ( $decoded === false ) {
				throw new Encryption_Exception( 'Decryption failed: invalid base64 encoding.' );
			}

			if ( \strlen( $decoded ) < ( \SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + \SODIUM_CRYPTO_SECRETBOX_MACBYTES ) ) {
				throw new Encryption_Exception( 'Decryption failed: ciphertext too short.' );
			}

			$nonce      = \substr( $decoded, 0, \SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
			$ciphertext = \substr( $decoded, \SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
			$plaintext  = \sodium_crypto_secretbox_open( $ciphertext, $nonce, $key );

			if ( $plaintext === false ) {
				throw new Encryption_Exception( 'Decryption failed: authentication tag verification failed.' );
			}

			return $plaintext;
		}
		finally {
			// Securely wipe the derived key from memory to prevent leakage via memory dumps or core files.
			try {
				\sodium_memzero( $key );
			}
			catch ( SodiumException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Best-effort cleanup.
				// Best-effort: key will be freed when $key goes out of scope.
			}
		}
	}

	/**
	 * Derives a 256-bit encryption key from AUTH_KEY using HKDF-SHA256.
	 *
	 * @param string $context A unique context string for key derivation.
	 *
	 * @return string A 32-byte derived key.
	 *
	 * @throws Encryption_Exception If AUTH_KEY is not defined or sodium is unavailable.
	 */
	private function derive_key( string $context ): string {
		if ( ! \function_exists( 'sodium_crypto_secretbox' ) ) {
			throw new Encryption_Exception( 'The sodium PHP extension is required but not available.' );
		}

		if ( ! \defined( 'AUTH_KEY' ) || \AUTH_KEY === '' || \AUTH_KEY === 'put your unique phrase here' ) {
			throw new Encryption_Exception( 'AUTH_KEY is not configured. Please set a unique AUTH_KEY in wp-config.php.' );
		}

		return \hash_hkdf( 'sha256', \AUTH_KEY, \SODIUM_CRYPTO_SECRETBOX_KEYBYTES, $context );
	}
}
