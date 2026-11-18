<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding;

/**
 * Base64url encoding and decoding per RFC 7515 / RFC 4648 Section 5.
 *
 * Provides URL-safe, unpadded Base64 encoding as required by JWTs, JWKs,
 * PKCE challenges, and other OAuth/OIDC constructs.
 */
class Base64url {

	/**
	 * Encodes data using base64url (URL-safe, no padding).
	 *
	 * @param string $data The data to encode.
	 *
	 * @return string The base64url-encoded string.
	 */
	public static function encode( string $data ): string {
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Base64URL encoding per RFC 7515.
		return \rtrim( \strtr( \base64_encode( $data ), '+/', '-_' ), '=' );
	}

	/**
	 * Decodes a base64url-encoded string.
	 *
	 * @param string $data The base64url-encoded string.
	 *
	 * @return string|false The decoded data, or false on failure.
	 */
	public static function decode( string $data ) {
		$remainder = ( \strlen( $data ) % 4 );
		if ( $remainder !== 0 ) {
			$data .= \str_repeat( '=', ( 4 - $remainder ) );
		}

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Base64URL decoding per RFC 7515.
		return \base64_decode( \strtr( $data, '-_', '+/' ), true );
	}
}
