<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

/**
 * Exception thrown when the server temporarily refuses new Dynamic Client
 * Registrations (HTTP 503 `temporarily_unavailable`).
 *
 * This happens when the registration emergency brake is engaged server-side during
 * a controlled rollout. It is a transient condition: the caller should fall back to
 * the legacy auth path and try again later.
 *
 * Extends {@see Registration_Failed_Exception} so existing handlers that catch
 * registration failures keep working; handlers that want to surface the suggested
 * retry delay can catch this subtype and read {@see self::get_retry_after_seconds()}.
 */
class Registration_Temporarily_Unavailable_Exception extends Registration_Failed_Exception {

	/**
	 * The server-suggested retry delay in seconds, or null when none was provided.
	 *
	 * Display-only: the plugin does not schedule or enforce a wait based on this value.
	 *
	 * @var int|null
	 */
	private $retry_after_seconds;

	/**
	 * Constructs the exception.
	 *
	 * @param string   $message             The exception message.
	 * @param int|null $retry_after_seconds The server-suggested retry delay in seconds, or null when unknown.
	 */
	public function __construct( string $message, ?int $retry_after_seconds = null ) {
		parent::__construct( $message );

		$this->retry_after_seconds = $retry_after_seconds;
	}

	/**
	 * Returns the server-suggested retry delay in seconds, or null when none was provided.
	 *
	 * @return int|null The retry delay in seconds, or null.
	 */
	public function get_retry_after_seconds(): ?int {
		return $this->retry_after_seconds;
	}
}
