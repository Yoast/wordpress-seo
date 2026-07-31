<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

/**
 * Exception thrown when the authorization server rate-limits a DCR or
 * RFC 7592 request (HTTP 429).
 *
 * Extends Registration_Failed_Exception so existing catch sites keep working.
 * Carries the parsed `Retry-After` value (in seconds) so the UI can show
 * the user how long to wait.
 */
class Rate_Limited_Exception extends Registration_Failed_Exception {

	/**
	 * Number of seconds the caller should wait before retrying, or null
	 * when the server didn't send a usable `Retry-After` header.
	 *
	 * @var int|null
	 */
	private $retry_after_seconds;

	/**
	 * Rate_Limited_Exception constructor.
	 *
	 * @param string   $message             The exception message.
	 * @param int|null $retry_after_seconds Seconds until the caller may retry, or null.
	 */
	public function __construct( string $message, ?int $retry_after_seconds = null ) {
		parent::__construct( $message );
		$this->retry_after_seconds = $retry_after_seconds;
	}

	/**
	 * Returns the parsed `Retry-After` value in seconds, or null when absent.
	 *
	 * @return int|null
	 */
	public function get_retry_after_seconds(): ?int {
		return $this->retry_after_seconds;
	}

	/**
	 * Parses an HTTP `Retry-After` value into seconds-until-retry.
	 *
	 * Accepts either the delta-seconds form (`"120"`) or the HTTP-date form
	 * (`"Wed, 27 May 2026 14:30:00 GMT"`) per RFC 9110 §10.2.3.
	 *
	 * phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- Raw header value is heterogeneous (string, numeric, array, or null).
	 *
	 * @param mixed $retry_after The raw header value (string, numeric, array, or null).
	 *
	 * @return int|null Seconds until retry (clamped to >= 0), or null when unparseable.
	 *
	 * phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
	 */
	public static function parse_retry_after( $retry_after ): ?int {
		if ( \is_array( $retry_after ) ) {
			$retry_after = \reset( $retry_after );
		}

		if ( $retry_after === null || $retry_after === '' ) {
			return null;
		}

		if ( \is_numeric( $retry_after ) ) {
			return \max( 0, (int) $retry_after );
		}

		$timestamp = \strtotime( (string) $retry_after );
		if ( $timestamp === false ) {
			return null;
		}

		return \max( 0, ( $timestamp - \time() ) );
	}
}
