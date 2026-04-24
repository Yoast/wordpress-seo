<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use SodiumException;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Manages Ed25519 key pairs for DPoP proofs and private_key_jwt authentication.
 *
 * Generates, stores (encrypted), retrieves, and rotates key pairs.
 * Two independent key pairs are maintained:
 * - 'registration': for private_key_jwt client_assertion signing
 * - 'dpop': for DPoP proof signing
 */
class Key_Pair_Manager implements LoggerAwareInterface {
	use LoggerAwareTrait;

	public const PURPOSE_REGISTRATION = 'registration';
	public const PURPOSE_DPOP         = 'dpop';

	private const OPTION_PREFIX  = 'wpseo_myyoast_key_pair_';
	private const CONTEXT_PREFIX = 'yoast-myyoast-key-';

	private const JWK_KTY = 'OKP';
	private const JWK_CRV = 'Ed25519';
	private const JWK_ALG = 'EdDSA';

	/**
	 * The encryption service.
	 *
	 * @var Encryption
	 */
	private $encryption;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * In-memory cache for decrypted key pairs, keyed by purpose.
	 *
	 * @var array<string, Key_Pair|null>
	 */
	private $cached_key_pairs = [];

	/**
	 * Key_Pair_Manager constructor.
	 *
	 * @param Encryption    $encryption    The encryption service.
	 * @param Issuer_Config $issuer_config The issuer configuration.
	 */
	public function __construct( Encryption $encryption, Issuer_Config $issuer_config ) {
		$this->encryption    = $encryption;
		$this->issuer_config = $issuer_config;
		$this->logger        = new NullLogger();
	}

	/**
	 * Gets an existing key pair or creates a new one for the given purpose.
	 * Creates a new key pair if none exists or if decryption of the stored private key fails (e.g. due to corruption or missing/rotated key).
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return Key_Pair The key pair value object.
	 *
	 * @throws Encryption_Exception If encryption fails.
	 */
	public function get_or_create_key_pair( string $purpose ): Key_Pair {
		$option_key = $this->get_option_key( $purpose );
		if ( \array_key_exists( $option_key, $this->cached_key_pairs ) ) {
			$cached = $this->cached_key_pairs[ $option_key ];
			if ( $cached !== null ) {
				return $cached;
			}

			return $this->generate_and_store_key_pair( $purpose );
		}

		try {
			$stored = $this->get_stored_key_pair( $purpose );
		} catch ( Encryption_Exception $e ) {
			$this->logger->warning(
				'Failed to decrypt {purpose} key pair, auto-rotating: {error}',
				[
					'purpose' => $purpose,
					'error'   => $e->getMessage(),
				],
			);
			return $this->rotate_key_pair( $purpose );
		}

		return ( $stored ?? $this->generate_and_store_key_pair( $purpose ) );
	}

	/**
	 * Generates a new key pair, replacing any existing one for the given purpose.
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return Key_Pair The key pair value object.
	 *
	 * @throws Encryption_Exception If encryption fails.
	 */
	public function rotate_key_pair( string $purpose ): Key_Pair {
		return $this->generate_and_store_key_pair( $purpose );
	}

	/**
	 * Returns the public key as a JWK (JSON Web Key) for the given key pair.
	 *
	 * @param Key_Pair $key_pair The key pair to extract the public JWK from.
	 *
	 * @return array<string, string> The JWK array with kty, crv, x, kid, use, and alg fields.
	 */
	public function get_public_key_jwk( Key_Pair $key_pair ): array {
		return [
			'kty' => self::JWK_KTY,
			'crv' => self::JWK_CRV,
			'x'   => Base64url::encode( $key_pair->get_public_key() ),
			'kid' => $key_pair->get_kid(),
			'use' => 'sig',
			'alg' => self::JWK_ALG,
		];
	}

	/**
	 * Generates a new Ed25519 key pair in memory without persisting it.
	 *
	 * Use store_key_pair() to persist after confirming success of external operations.
	 *
	 * @return Key_Pair The generated key pair.
	 *
	 * @throws Encryption_Exception If key generation fails.
	 */
	public function generate_key_pair(): Key_Pair {
		$keypair = '';

		try {
			$keypair     = \sodium_crypto_sign_keypair();
			$public_key  = \sodium_crypto_sign_publickey( $keypair );
			$private_key = \sodium_crypto_sign_secretkey( $keypair );
			$kid         = Base64url::encode( \hash( 'sha256', $public_key, true ) );

			return new Key_Pair( $public_key, $private_key, $kid );
		}
		catch ( SodiumException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Encryption_Exception( 'Key pair generation failed: ' . $e->getMessage(), 0, $e );
		}
		finally {
			if ( $keypair !== '' ) {
				try {
					\sodium_memzero( $keypair );
				}
				catch ( SodiumException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Best-effort cleanup.
					// Best-effort: keypair will be freed when it goes out of scope.
				}
			}
		}
	}

	/**
	 * Builds a JWK from a raw public key without requiring it to be stored.
	 *
	 * @param string $public_key The 32-byte Ed25519 public key.
	 *
	 * @return array<string, string> The JWK array.
	 */
	public function build_public_key_jwk( string $public_key ): array {
		$kid = Base64url::encode( \hash( 'sha256', $public_key, true ) );

		return [
			'kty' => self::JWK_KTY,
			'crv' => self::JWK_CRV,
			'x'   => Base64url::encode( $public_key ),
			'kid' => $kid,
			'use' => 'sig',
			'alg' => self::JWK_ALG,
		];
	}

	/**
	 * Persists a key pair (encrypting the private key).
	 *
	 * @param string   $purpose  One of the PURPOSE_* constants.
	 * @param Key_Pair $key_pair The key pair to store.
	 *
	 * @return void
	 *
	 * @throws Encryption_Exception If encryption fails.
	 */
	public function store_key_pair( string $purpose, Key_Pair $key_pair ): void {
		$option_key        = $this->get_option_key( $purpose );
		$encrypted_private = $this->encryption->encrypt(
			$key_pair->get_private_key(),
			self::CONTEXT_PREFIX . $purpose,
		);

		\update_option(
			$option_key,
			[
				// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Binary Ed25519 key needs safe encoding.
				'public_key'            => \base64_encode( $key_pair->get_public_key() ),
				'private_key_encrypted' => $encrypted_private,
				'kid'                   => $key_pair->get_kid(),
				'created_at'            => \time(),
			],
			false,
		);
		$this->cached_key_pairs[ $option_key ] = $key_pair;
	}

	/**
	 * Deletes the key pair for the given purpose.
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return void
	 */
	public function delete_key_pair( string $purpose ): void {
		unset( $this->cached_key_pairs[ $this->get_option_key( $purpose ) ] );
		\delete_option( $this->get_option_key( $purpose ) );
	}

	/**
	 * Returns the issuer-scoped option key for the given purpose.
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return string The option key.
	 */
	private function get_option_key( string $purpose ): string {
		return self::OPTION_PREFIX . $purpose . '_' . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Retrieves a stored key pair, decrypting the private key.
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return Key_Pair|null The key pair or null if not stored.
	 *
	 * @throws Encryption_Exception If decryption fails.
	 */
	private function get_stored_key_pair( string $purpose ): ?Key_Pair {
		$stored = \get_option( $this->get_option_key( $purpose ), [] );
		if ( ! \is_array( $stored ) || empty( $stored['public_key'] ) || empty( $stored['private_key_encrypted'] ) || empty( $stored['kid'] ) ) {
			$this->cached_key_pairs[ $this->get_option_key( $purpose ) ] = null;
			return null;
		}

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Decoding our own base64-encoded key.
		$public_key  = \base64_decode( $stored['public_key'], true );
		$private_key = $this->encryption->decrypt(
			$stored['private_key_encrypted'],
			self::CONTEXT_PREFIX . $purpose,
		);

		if ( $public_key === false || \strlen( $public_key ) !== \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES ) {
			$this->cached_key_pairs[ $this->get_option_key( $purpose ) ] = null;
			return null;
		}

		$key_pair = new Key_Pair( $public_key, $private_key, $stored['kid'] );
		$this->cached_key_pairs[ $this->get_option_key( $purpose ) ] = $key_pair;
		return $key_pair;
	}

	/**
	 * Generates a new Ed25519 key pair and stores it (private key encrypted).
	 *
	 * @param string $purpose One of the PURPOSE_* constants.
	 *
	 * @return Key_Pair The key pair value object.
	 *
	 * @throws Encryption_Exception If encryption or key generation fails.
	 */
	private function generate_and_store_key_pair( string $purpose ): Key_Pair {
		$key_pair = $this->generate_key_pair();
		$this->store_key_pair( $purpose, $key_pair );
		$this->logger->info( 'Generated and stored new {purpose} key pair.', [ 'purpose' => $purpose ] );

		return $key_pair;
	}
}
