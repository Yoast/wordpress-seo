<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP;

use Exception;
use SensitiveParameter;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;

/**
 * Creates DPoP proof JWTs per RFC 9449 and manages server-provided nonces.
 *
 * DPoP (Demonstrating Proof of Possession) binds access tokens to a
 * cryptographic key pair, preventing token theft.
 */
class DPoP_Handler {

	private const NONCE_TRANSIENT_PREFIX = 'wpseo_myyoast_dpop_nonce_';
	private const NONCE_TTL_IN_SECONDS   = ( \MINUTE_IN_SECONDS * 5 );
	private const PROOF_ALG              = 'EdDSA';

	/**
	 * The key pair manager.
	 *
	 * @var Key_Pair_Manager
	 */
	private $key_pair_manager;

	/**
	 * The JWT signer.
	 *
	 * @var JWT_Signer
	 */
	private $jwt_signer;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * DPoP_Handler constructor.
	 *
	 * @param Key_Pair_Manager $key_pair_manager The key pair manager.
	 * @param JWT_Signer       $jwt_signer       The JWT signer.
	 * @param Issuer_Config    $issuer_config    The issuer configuration.
	 */
	public function __construct( Key_Pair_Manager $key_pair_manager, JWT_Signer $jwt_signer, Issuer_Config $issuer_config ) {
		$this->key_pair_manager = $key_pair_manager;
		$this->jwt_signer       = $jwt_signer;
		$this->issuer_config    = $issuer_config;
	}

	/**
	 * Creates a DPoP proof JWT.
	 *
	 * @param string      $http_method  The HTTP method (e.g. "POST", "GET").
	 * @param string      $url          The request URL (scheme, host, and path — no query/fragment).
	 * @param string|null $access_token The access token to bind (for resource requests, includes ath claim).
	 *
	 * @return string The signed DPoP proof JWT.
	 *
	 * @throws DPoP_Proof_Exception If proof generation fails.
	 */
	public function create_proof(
		string $http_method,
		string $url,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		?string $access_token = null
	): string {
		try {
			$key_pair = $this->key_pair_manager->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_DPOP );
		}
		catch ( Encryption_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new DPoP_Proof_Exception( 'DPoP key pair generation failed: ' . $e->getMessage(), 0, $e );
		}

		$jwk = $this->key_pair_manager->get_public_key_jwk( $key_pair );

		$header = [
			'typ' => 'dpop+jwt',
			'alg' => self::PROOF_ALG,
			'jwk' => $jwk,
		];

		// Strip query and fragment from URL per RFC 9449.
		$htu = $this->normalize_url( $url );
		try {
			$jti = JWT_Signer::generate_jti();
		}
		catch ( Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new DPoP_Proof_Exception( 'Failed to generate jti for DPoP proof: ' . $e->getMessage(), 0, $e );
		}

		$payload = [
			'htm' => \strtoupper( $http_method ),
			'htu' => $htu,
			'iat' => \time(),
			'jti' => $jti,
		];

		// Include nonce if the server has provided one.
		$nonce = $this->get_stored_nonce();
		if ( $nonce !== null ) {
			$payload['nonce'] = $nonce;
		}

		// Include ath (access token hash) for resource requests.
		if ( $access_token !== null ) {
			$payload['ath'] = Base64url::encode(
				\hash( 'sha256', $access_token, true ),
			);
		}

		try {
			return $this->jwt_signer->sign( $header, $payload, $key_pair->get_private_key() );
		}
		catch ( Encryption_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new DPoP_Proof_Exception( 'DPoP proof signing failed: ' . $e->getMessage(), 0, $e );
		}
	}

	/**
	 * Extracts and stores a DPoP-Nonce from response headers.
	 *
	 * @param array<string, string|string[]> $response_headers The response headers.
	 *
	 * @return void
	 */
	public function handle_nonce_response( array $response_headers ): void {
		$nonce = $this->extract_header( $response_headers, 'dpop-nonce' );
		if ( $nonce === null ) {
			return;
		}

		// Transients are safe here: DPoP nonces are optional per RFC 9449 Section 4.1.
		// If the nonce is missing or stale, the server responds with `use_dpop_nonce`
		// and provides a fresh one. HTTP_Client retries automatically, so broken
		// transients only cause an extra round-trip, never a functional failure.
		// We use a generic key since the MyYoast server uses one nonce for all endpoints.
		\set_transient( $this->get_nonce_transient_key(), $nonce, self::NONCE_TTL_IN_SECONDS );
	}

	/**
	 * Returns the stored DPoP nonce.
	 *
	 * @return string|null The stored nonce, or null if none exists.
	 */
	public function get_stored_nonce(): ?string {
		$nonce = \get_transient( $this->get_nonce_transient_key() );
		if ( \is_string( $nonce ) && $nonce !== '' ) {
			return $nonce;
		}

		return null;
	}

	/**
	 * Returns the issuer-scoped transient key for the DPoP nonce.
	 *
	 * @return string The transient key.
	 */
	private function get_nonce_transient_key(): string {
		return self::NONCE_TRANSIENT_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Normalizes a URL by removing query string and fragment.
	 *
	 * @param string $url The URL to normalize.
	 *
	 * @return string The normalized URL (scheme + host + path).
	 */
	private function normalize_url( string $url ): string {
		$parsed = \wp_parse_url( $url );
		if ( $parsed === false ) {
			return $url;
		}

		$scheme = ( $parsed['scheme'] ?? 'https' );
		$host   = ( $parsed['host'] ?? '' );
		$port   = isset( $parsed['port'] ) ? ':' . $parsed['port'] : '';
		$path   = ( $parsed['path'] ?? '/' );

		return $scheme . '://' . $host . $port . $path;
	}

	/**
	 * Extracts a header value from response headers (case-insensitive).
	 *
	 * @param array<string, string|string[]> $headers     The response headers.
	 * @param string                         $header_name The header name to find.
	 *
	 * @return string|null The header value, or null if not found.
	 */
	private function extract_header( array $headers, string $header_name ): ?string {
		$header_name_lower = \strtolower( $header_name );

		foreach ( $headers as $key => $value ) {
			if ( \strtolower( $key ) === $header_name_lower ) {
				return \is_array( $value ) ? $value[0] : (string) $value;
			}
		}

		return null;
	}
}
