<?php

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

use Yoast\WP\SEO\MyYoast_Client\Domain\Exceptions\Invalid_Resource_Exception;

/**
 * Immutable value object representing an RFC 8707 resource indicator.
 *
 * A resource indicator is an absolute URI (RFC 3986 §4.3) without a fragment
 * that identifies a target resource server. RFC 8707 does not restrict the
 * scheme — http, https, urn, did, etc. are all valid. The authorization
 * server decides which specific values it accepts via the OAuth
 * `invalid_target` error.
 *
 * Per the spec's trust model (RFC 8707 §2 and §4), the client is the source
 * of truth for the canonical form. Every value we put on the wire — including
 * on refresh — must satisfy §2. The constructor enforces this, and there is
 * no path that wraps an unvalidated string in this class.
 *
 * Null-object pattern: passing null (or calling ::default()) yields an
 * instance representing "the default resource" — no `resource` parameter
 * goes on the wire, and storage uses the default bucket. Callers don't
 * need to null-check; ask is_default() instead.
 */
class Resource_Indicator {

	/**
	 * RFC 3986 §3.1 scheme: ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ).
	 *
	 * @var string
	 */
	private const SCHEME_PATTERN = '[A-Za-z][A-Za-z0-9+.\-]*';

	/**
	 * RFC 3986 character set permitted in the rest of a URI, excluding the
	 * fragment delimiter "#" — RFC 8707 §2 forbids fragments and we reject
	 * them explicitly with a more specific error.
	 *
	 * Includes: unreserved / pct-encoded / sub-delims / ":" / "/" / "?" / "[" / "]" / "@".
	 *
	 * @var string
	 */
	private const URI_TAIL_PATTERN = '[A-Za-z0-9\-._~:\/?\[\]@!$&\'()*+,;=%]+';

	/**
	 * The canonical string form, or null when this instance represents the default resource.
	 *
	 * @var string|null
	 */
	private $value;

	/**
	 * Resource_Indicator constructor.
	 *
	 * Null yields the default-resource instance — no validation, no wire
	 * parameter, default storage bucket. Non-null is validated per RFC 8707 §2
	 * (absolute URI per RFC 3986 §4.3, no fragment) and has its trailing slash
	 * canonicalized for storage-key stability.
	 *
	 * @param string|null $value The resource indicator string, or null for the default resource.
	 *
	 * @throws Invalid_Resource_Exception When the value is non-null but malformed.
	 */
	public function __construct( ?string $value ) {
		if ( $value === null ) {
			$this->value = null;
			return;
		}

		$trimmed = \trim( $value );
		if ( $trimmed === '' ) {
			throw new Invalid_Resource_Exception( 'Resource indicator must not be empty.' );
		}

		// Fragment forbidden by RFC 8707 §2. Checked before the absolute-URI
		// regex so the caller gets a more specific error message.
		if ( \strpos( $trimmed, '#' ) !== false ) {
			throw new Invalid_Resource_Exception( 'Resource indicator must not contain a fragment (RFC 8707 §2).' );
		}

		// RFC 3986 §4.3 absolute-URI: scheme ":" hier-part [ "?" query ].
		// We don't deeply validate hier-part — the authorization server will
		// reject unrecognized formats via OAuth `invalid_target`.
		//
		// Anchors are \A (start-of-string) and \z (end-of-string), NOT ^ and $.
		// ^/$ are line-aware: $ matches before a trailing \n by default, and
		// with /m both match at every line boundary. That lets a two-line
		// input smuggle a second URI past the check while still appearing to
		// "match the whole string". \A and \z always mean literal start/end of
		// the entire input regardless of newlines or regex flags, which is
		// what we need when validating untrusted input that goes on the wire.
		$absolute_uri_pattern = '/\A' . self::SCHEME_PATTERN . ':' . self::URI_TAIL_PATTERN . '\z/';
		if ( \preg_match( $absolute_uri_pattern, $trimmed ) !== 1 ) {
			throw new Invalid_Resource_Exception( 'Resource indicator must be an absolute URI (RFC 3986 §4.3, RFC 8707 §2).' );
		}

		$this->value = self::normalize_trailing_slash( $trimmed );
	}

	/**
	 * Returns an instance representing the default resource.
	 *
	 * Equivalent to `new Resource_Indicator( null )` — provided for readability
	 * at call sites that want to express the intent explicitly.
	 *
	 * @return self
	 */
	public static function default(): self {
		return new self( null );
	}

	/**
	 * Returns the canonical string form, or null when this is the default resource.
	 *
	 * @return string|null
	 */
	public function value(): ?string {
		return $this->value;
	}

	/**
	 * Whether this instance represents the default resource.
	 *
	 * @return bool
	 */
	public function is_default(): bool {
		return $this->value === null;
	}

	/**
	 * Returns the canonical string form, or empty string for the default resource.
	 *
	 * @return string
	 */
	public function __toString(): string {
		return ( $this->value ?? '' );
	}

	/**
	 * Returns true when the other indicator has the same canonical value.
	 *
	 * @param self $other The other indicator.
	 *
	 * @return bool
	 */
	public function equals( self $other ): bool {
		return $this->value === $other->value;
	}

	/**
	 * Strips a single trailing slash from URIs that have an authority and a
	 * root-only path, so "https://host/" and "https://host" map to the same
	 * canonical form. URIs without an authority (urn:, did:, etc.) are left
	 * alone.
	 *
	 * @param string $uri A validated absolute URI.
	 *
	 * @return string The URI, with the root-path trailing slash trimmed when applicable.
	 */
	private static function normalize_trailing_slash( string $uri ): string {
		if ( \strpos( $uri, '://' ) === false ) {
			return $uri;
		}

		$after_authority = \substr( $uri, ( \strpos( $uri, '://' ) + 3 ) );
		$query_pos       = \strpos( $after_authority, '?' );
		$path_segment    = ( $query_pos === false ) ? $after_authority : \substr( $after_authority, 0, $query_pos );

		$slash_pos = \strpos( $path_segment, '/' );
		if ( $slash_pos === false ) {
			return $uri;
		}

		$path = \substr( $path_segment, $slash_pos );
		if ( $path === '/' ) {
			$prefix_end = \strpos( $uri, '/', ( \strpos( $uri, '://' ) + 3 ) );

			return \substr( $uri, 0, $prefix_end ) . ( ( $query_pos === false ) ? '' : \substr( $after_authority, $query_pos ) );
		}

		return $uri;
	}
}
