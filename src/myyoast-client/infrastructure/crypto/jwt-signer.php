<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use Exception;
use JsonException;
use Random\RandomException;
use SensitiveParameter;
use SodiumException;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;

/**
 * Creates and signs JWTs using Ed25519 (EdDSA) via libsodium.
 *
 * Supports compact serialization (header.payload.signature) as used by
 * DPoP proofs, client assertions, and other OAuth/OIDC JWTs.
 */
class JWT_Signer {

	private const SIGNING_ALG = 'EdDSA';

	/**
	 * Signs a JWT with the given header and payload using an Ed25519 private key.
	 *
	 * @param array<string, string|int|array<string, string>> $header      The JWT header (e.g. typ, alg, jwk/kid).
	 * @param array<string, string|int|array<string, string>> $payload     The JWT payload claims.
	 * @param string                                          $private_key The 64-byte Ed25519 secret key (keypair format).
	 *
	 * @return string The compact-serialized JWT (header.payload.signature).
	 *
	 * @throws JWT_Signing_Exception If signing fails.
	 */
	public function sign(
		array $header,
		array $payload,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $private_key
	): string {
		try {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode, Yoast.Yoast.JsonEncodeAlternative.FoundWithAdditionalParams -- Using json_encode directly: JSON_THROW_ON_ERROR must propagate so encoding failures surface as exceptions, and wp_json_encode's silent UTF-8 transcoding would mutate JWT claim values.
			$header_b64 = Base64url::encode( \json_encode( $header, \JSON_THROW_ON_ERROR ) );
			// phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode, Yoast.Yoast.JsonEncodeAlternative.FoundWithAdditionalParams -- Using json_encode directly: JSON_THROW_ON_ERROR must propagate so encoding failures surface as exceptions, and wp_json_encode's silent UTF-8 transcoding would mutate JWT claim values.
			$payload_b64 = Base64url::encode( \json_encode( $payload, \JSON_THROW_ON_ERROR ) );
		}
		catch ( JsonException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new JWT_Signing_Exception( 'JWT encoding failed: ' . $e->getMessage(), 0, $e );
		}

		$signing_input = $header_b64 . '.' . $payload_b64;

		try {
			$signature = \sodium_crypto_sign_detached( $signing_input, $private_key );
		}
		catch ( SodiumException $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new JWT_Signing_Exception( 'JWT signing failed: ' . $e->getMessage(), 0, $e );
		}

		$signature_b64 = Base64url::encode( $signature );

		return $signing_input . '.' . $signature_b64;
	}

	/**
	 * Creates a client_assertion JWT for private_key_jwt authentication.
	 *
	 * @param string   $client_id      The registered client_id.
	 * @param string   $token_endpoint The token endpoint URL (used as audience).
	 * @param Key_Pair $key_pair       The key pair to sign with.
	 *
	 * @return string The signed client_assertion JWT.
	 *
	 * @throws JWT_Signing_Exception If signing fails or jti generation fails.
	 */
	public function create_client_assertion( string $client_id, string $token_endpoint, Key_Pair $key_pair ): string {
		$now = \time();

		$header = [
			'alg' => self::SIGNING_ALG,
			'kid' => $key_pair->get_kid(),
		];

		try {
			$jti = $this->generate_jti();
		} catch ( Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new JWT_Signing_Exception( 'Failed to generate jti for client_assertion: ' . $e->getMessage(), 0, $e );
		}

		$payload = [
			'iss' => $client_id,
			'sub' => $client_id,
			'aud' => $token_endpoint,
			'iat' => $now,
			'nbf' => $now,
			'exp' => ( $now + ( \MINUTE_IN_SECONDS * 2 ) ),
			'jti' => $jti,
		];

		return $this->sign( $header, $payload, $key_pair->get_private_key() );
	}

	/**
	 * Verifies a JWT signature and validates standard time-based claims (RFC 7519).
	 *
	 * Checks the Ed25519 signature, then validates:
	 * - exp: rejects expired tokens (with clock-skew tolerance)
	 * - nbf: rejects tokens not yet valid (with clock-skew tolerance), if present
	 * - iat: rejects tokens issued unreasonably far in the past, if present
	 *
	 * Does NOT validate application-level claims (iss, aud, nonce, etc.).
	 *
	 * @param string $jwt        The compact-serialized JWT.
	 * @param string $public_key The 32-byte Ed25519 public key.
	 * @param int    $leeway     Clock-skew tolerance in seconds for exp/nbf checks.
	 *
	 * @return array{header: array<string, string|int|array<string, string>>, payload: array<string, string|int|array<string, string>>} The decoded header and payload.
	 *
	 * @throws JWT_Signature_Exception  If the signature is invalid, the JWT is malformed, or the token was tampered with.
	 * @throws JWT_Validation_Exception If the token's time-based claims are invalid (expired, not yet valid, or too old).
	 */
	public function verify( string $jwt, string $public_key, int $leeway = 60 ): array {
		$parts = \explode( '.', $jwt );
		if ( \count( $parts ) !== 3 ) {
			throw new JWT_Signature_Exception( 'Invalid JWT format: expected 3 segments.' );
		}

		$this->verify_signature( $parts, $public_key );

		$header  = \json_decode( Base64url::decode( $parts[0] ), true );
		$payload = \json_decode( Base64url::decode( $parts[1] ), true );

		if ( ! \is_array( $header ) || ! \is_array( $payload ) ) {
			throw new JWT_Signature_Exception( 'Invalid JWT payload encoding.' );
		}

		$this->validate_time_claims( $payload, $leeway );

		return [
			'header'  => $header,
			'payload' => $payload,
		];
	}

	/**
	 * Generates a unique JWT ID (jti).
	 *
	 * @return string A unique identifier.
	 *
	 * @throws RandomException If random bytes generation fails.
	 */
	public function generate_jti(): string {
		return Base64url::encode( \random_bytes( 16 ) );
	}

	/**
	 * Verifies the Ed25519 signature of a split JWT.
	 *
	 * @param array<int, string> $parts      The three JWT segments (header, payload, signature).
	 * @param string             $public_key The 32-byte Ed25519 public key.
	 *
	 * @return void
	 *
	 * @throws JWT_Signature_Exception If the signature is invalid, malformed, or verification errors.
	 */
	private function verify_signature( array $parts, string $public_key ): void {
		$signing_input = $parts[0] . '.' . $parts[1];
		$signature     = Base64url::decode( $parts[2] );

		if ( $signature === false ) {
			throw new JWT_Signature_Exception( 'Invalid JWT signature encoding.' );
		}

		try {
			$valid = \sodium_crypto_sign_verify_detached( $signature, $signing_input, $public_key );
		}
		catch ( Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new JWT_Signature_Exception( 'JWT signature verification error: ' . $e->getMessage(), 0, $e );
		}

		if ( ! $valid ) {
			throw new JWT_Signature_Exception( 'JWT signature verification failed.' );
		}
	}

	/**
	 * Validates RFC 7519 time-based claims (exp, nbf, iat).
	 *
	 * @param array<string, string|int|array<string, string>> $payload The decoded JWT payload.
	 * @param int                                             $leeway  Clock-skew tolerance in seconds for exp/nbf.
	 *
	 * @return void
	 *
	 * @throws JWT_Validation_Exception If any time claim is invalid.
	 */
	private function validate_time_claims( array $payload, int $leeway ): void {
		$now = \time();

		// RFC 7519 Section 4.1.4: reject expired tokens.
		if ( isset( $payload['exp'] ) && ( $payload['exp'] + $leeway ) < $now ) {
			throw new JWT_Validation_Exception( 'JWT has expired.' );
		}

		// RFC 7519 Section 4.1.5: reject tokens not yet valid.
		if ( isset( $payload['nbf'] ) && $payload['nbf'] > ( $now + $leeway ) ) {
			throw new JWT_Validation_Exception( 'JWT is not yet valid (nbf claim is in the future).' );
		}

		// RFC 7519 Section 4.1.6: reject tokens issued unreasonably far in the past.
		if ( isset( $payload['iat'] ) && $payload['iat'] < ( $now - \HOUR_IN_SECONDS ) ) {
			throw new JWT_Validation_Exception( 'JWT iat claim is too old.' );
		}
	}
}
