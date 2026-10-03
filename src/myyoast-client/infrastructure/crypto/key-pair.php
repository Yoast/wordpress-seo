<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use InvalidArgumentException;
use SensitiveParameter;

/**
 * Immutable value object representing an Ed25519 key pair with its key ID.
 */
class Key_Pair {

	/**
	 * The 32-byte Ed25519 public key.
	 *
	 * @var string
	 */
	private $public_key;

	/**
	 * The 64-byte Ed25519 secret key (keypair format).
	 *
	 * @var string
	 */
	private $private_key;

	/**
	 * The key ID (derived from the public key thumbprint).
	 *
	 * @var string
	 */
	private $kid;

	/**
	 * Key_Pair constructor.
	 *
	 * @param string $public_key  The 32-byte Ed25519 public key.
	 * @param string $private_key The 64-byte Ed25519 secret key.
	 * @param string $kid         The key ID.
	 *
	 * @throws InvalidArgumentException If key lengths are invalid.
	 */
	public function __construct(
		string $public_key,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $private_key,
		string $kid
	) {
		if ( \strlen( $public_key ) !== \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES ) {
			throw new InvalidArgumentException(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Public key must be %d bytes, got %d.', \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES, \strlen( $public_key ) ),
			);
		}
		if ( \strlen( $private_key ) !== \SODIUM_CRYPTO_SIGN_SECRETKEYBYTES ) {
			throw new InvalidArgumentException(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Private key must be %d bytes, got %d.', \SODIUM_CRYPTO_SIGN_SECRETKEYBYTES, \strlen( $private_key ) ),
			);
		}

		$this->public_key  = $public_key;
		$this->private_key = $private_key;
		$this->kid         = $kid;
	}

	/**
	 * Returns the public key.
	 *
	 * @return string The 32-byte Ed25519 public key.
	 */
	public function get_public_key(): string {
		return $this->public_key;
	}

	/**
	 * Returns the private key.
	 *
	 * @return string The 64-byte Ed25519 secret key.
	 */
	public function get_private_key(): string {
		return $this->private_key;
	}

	/**
	 * Returns the key ID.
	 *
	 * @return string The key ID.
	 */
	public function get_kid(): string {
		return $this->kid;
	}
}
