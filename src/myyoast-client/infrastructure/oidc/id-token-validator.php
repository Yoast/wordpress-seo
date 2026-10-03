<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\ID_Token_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\ID_Token_Validator_Interface;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signature_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Validation_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Validates OIDC ID tokens.
 *
 * Fetches the server's JWKS, verifies the EdDSA signature, and validates
 * required claims (iss, aud, exp, nonce).
 */
class ID_Token_Validator implements ID_Token_Validator_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

	private const JWKS_TRANSIENT_PREFIX = 'wpseo_myyoast_jwks_';
	private const JWKS_TTL              = \MONTH_IN_SECONDS;

	private const EXPECTED_ALG = 'EdDSA';
	private const EXPECTED_KTY = 'OKP';
	private const EXPECTED_CRV = 'Ed25519';

	/**
	 * The discovery client.
	 *
	 * @var Discovery_Client
	 */
	private $discovery_client;

	/**
	 * The JWT signer.
	 *
	 * @var JWT_Signer
	 */
	private $jwt_signer;

	/**
	 * The HTTP client.
	 *
	 * @var HTTP_Client
	 */
	private $http_client;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * ID_Token_Validator constructor.
	 *
	 * @param Discovery_Client $discovery_client The discovery client.
	 * @param JWT_Signer       $jwt_signer       The JWT signer.
	 * @param HTTP_Client      $http_client      The HTTP client.
	 * @param Issuer_Config    $issuer_config    The issuer configuration.
	 */
	public function __construct( Discovery_Client $discovery_client, JWT_Signer $jwt_signer, HTTP_Client $http_client, Issuer_Config $issuer_config ) {
		$this->discovery_client = $discovery_client;
		$this->jwt_signer       = $jwt_signer;
		$this->http_client      = $http_client;
		$this->issuer_config    = $issuer_config;
		$this->logger           = new NullLogger();
	}

	/**
	 * Validates an ID token.
	 *
	 * @param string $id_token       The raw ID token JWT.
	 * @param string $client_id      The expected client_id (audience).
	 * @param string $expected_nonce The nonce sent in the authorization request.
	 *
	 * @return array<string, string|int|array<string>> The validated ID token payload (claims).
	 *
	 * @throws ID_Token_Validation_Exception If validation fails.
	 * @throws Discovery_Failed_Exception    If the discovery document cannot be fetched.
	 * @throws Server_Capability_Exception   If the server lacks required capabilities.
	 *
	 * phpcs:ignore Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Discovery exceptions are thrown by get_document().
	 */
	public function validate( string $id_token, string $client_id, string $expected_nonce ): array {
		// Parse the header to get the kid.
		$parts = \explode( '.', $id_token );
		if ( \count( $parts ) !== 3 ) {
			throw new ID_Token_Validation_Exception( 'Invalid ID token format.' );
		}

		$header = \json_decode( Base64url::decode( $parts[0] ), true );
		if ( ! \is_array( $header ) ) {
			throw new ID_Token_Validation_Exception( 'Invalid ID token header.' );
		}

		if ( ( $header['alg'] ?? '' ) !== self::EXPECTED_ALG ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new ID_Token_Validation_Exception( 'Unsupported ID token algorithm: ' . ( $header['alg'] ?? 'none' ) );
		}

		// Fetch the public key from JWKS.
		$public_key = $this->get_public_key( ( $header['kid'] ?? '' ) );
		if ( $public_key === null ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new ID_Token_Validation_Exception( 'No matching key found in JWKS for kid: ' . ( $header['kid'] ?? 'none' ) );
		}

		// Verify signature and time-based claims (exp, nbf, iat).
		try {
			$result = $this->jwt_signer->verify( $id_token, $public_key );
		} catch ( JWT_Signature_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new ID_Token_Validation_Exception( 'ID token signature verification failed: ' . $e->getMessage(), 0, $e );
		} catch ( JWT_Validation_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new ID_Token_Validation_Exception( 'ID token rejected: ' . $e->getMessage(), 0, $e );
		}

		$payload = $result['payload'];

		// OIDC Core 1.0 §2: exp, iat and sub are required claims.
		foreach ( [ 'exp', 'iat', 'sub' ] as $required_claim ) {
			if ( ! isset( $payload[ $required_claim ] ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw new ID_Token_Validation_Exception( 'ID token is missing required claim: ' . $required_claim );
			}
		}

		// Validate issuer.
		$expected_issuer = $this->discovery_client->get_document()->get_issuer();
		if ( ! \hash_equals( $expected_issuer, ( $payload['iss'] ?? '' ) ) ) {
			throw new ID_Token_Validation_Exception( 'ID token issuer mismatch.' );
		}

		// Validate audience.
		$aud = ( $payload['aud'] ?? '' );
		if ( \is_array( $aud ) ) {
			if ( ! \in_array( $client_id, $aud, true ) ) {
				throw new ID_Token_Validation_Exception( 'ID token audience does not contain client_id.' );
			}
			// OIDC Core 1.0 §2: when aud has multiple values, azp MUST equal client_id.
			$azp = ( $payload['azp'] ?? '' );
			if ( $azp !== '' && $azp !== $client_id ) {
				throw new ID_Token_Validation_Exception( 'ID token azp claim does not match client_id.' );
			}
		}
		elseif ( $aud !== $client_id ) {
			throw new ID_Token_Validation_Exception( 'ID token audience mismatch.' );
		}

		// Validate nonce.
		if ( ! \hash_equals( $expected_nonce, ( $payload['nonce'] ?? '' ) ) ) {
			throw new ID_Token_Validation_Exception( 'ID token nonce mismatch.' );
		}

		return $payload;
	}

	/**
	 * Returns the issuer-scoped transient key for the JWKS cache.
	 *
	 * @return string The transient key.
	 */
	private function get_jwks_transient_key(): string {
		return self::JWKS_TRANSIENT_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Fetches the public key from JWKS for the given kid.
	 *
	 * @param string $kid The key ID to find.
	 *
	 * @return string|null The 32-byte Ed25519 public key, or null if not found.
	 */
	private function get_public_key( string $kid ): ?string {
		$jwks = $this->fetch_jwks();
		$key  = ( $jwks !== null ) ? $this->find_ed25519_key( $jwks, $kid ) : null;
		if ( $key !== null ) {
			return $key;
		}

		// Kid not found in cache — try refreshing JWKS.
		$this->logger->debug( 'Key kid={kid} not found in cached JWKS, refreshing.', [ 'kid' => $kid ] );
		\delete_transient( $this->get_jwks_transient_key() );
		$jwks = $this->fetch_jwks();

		return ( $jwks !== null ) ? $this->find_ed25519_key( $jwks, $kid ) : null;
	}

	/**
	 * Finds an Ed25519 public key by kid in a JWKS.
	 *
	 * @param array<string, array<int, array<string, string>>> $jwks The JWKS.
	 * @param string                                           $kid  The key ID to find.
	 *
	 * @return string|null The 32-byte Ed25519 public key, or null if not found.
	 */
	private function find_ed25519_key( array $jwks, string $kid ): ?string {
		foreach ( ( $jwks['keys'] ?? [] ) as $key ) {
			if ( ( $key['kid'] ?? '' ) === $kid && ( $key['kty'] ?? '' ) === self::EXPECTED_KTY && ( $key['crv'] ?? '' ) === self::EXPECTED_CRV ) {
				$x = Base64url::decode( ( $key['x'] ?? '' ) );
				if ( $x !== false && \strlen( $x ) === \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES ) {
					return $x;
				}
			}
		}

		return null;
	}

	/**
	 * Fetches the JWKS from the server (cached).
	 *
	 * @return array<string, array<int, array<string, string>>>|null The JWKS, or null on failure.
	 */
	private function fetch_jwks(): ?array {
		$cached = \get_transient( $this->get_jwks_transient_key() );
		if ( \is_array( $cached ) && ! empty( $cached['keys'] ) ) {
			return $cached;
		}

		try {
			$jwks_uri = $this->discovery_client->get_document()->get_jwks_uri();
		} catch ( Discovery_Failed_Exception | Server_Capability_Exception $e ) {
			$this->logger->warning( 'Cannot fetch JWKS: discovery failed: {error}', [ 'error' => $e->getMessage() ] );
			return null;
		}

		$result = $this->http_client->request(
			'GET',
			$jwks_uri,
			[
				'timeout' => 10,
				'headers' => [ 'Accept' => 'application/json' ],
			],
		);

		if ( $result->get_status() !== 200 ) {
			$this->logger->warning(
				'JWKS fetch returned HTTP {status} from {url}.',
				[
					'status' => $result->get_status(),
					'url'    => $jwks_uri,
				],
			);
			return null;
		}

		$body = $result->get_body();
		if ( ! \is_array( $body ) || empty( $body['keys'] ) ) {
			$this->logger->warning( 'JWKS response from {url} has no keys.', [ 'url' => $jwks_uri ] );
			return null;
		}

		\set_transient( $this->get_jwks_transient_key(), $body, self::JWKS_TTL );

		return $body;
	}
}
