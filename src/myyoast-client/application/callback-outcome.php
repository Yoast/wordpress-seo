<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

/**
 * Immutable result of handling an OAuth authorization-code callback.
 *
 * Describes the outcome in OAuth terms: a success, a no-op (the request was not
 * a real callback), a provider error (the authorization endpoint redirected back
 * with an `error`), or an exchange error (the token endpoint rejected the code).
 * It invents no severity vocabulary of its own — it passes through whichever
 * native OAuth error code was reported and records which OAuth phase produced
 * it, leaving each consumer to translate that onto its own surface (a
 * notification, a REST error response, CLI output, ...).
 *
 * The phase matters because the same absence of a recognised code means
 * different things per phase: an unrecognised provider error is unexpected,
 * whereas an unrecognised token-endpoint error is a generic token failure.
 */
final class Callback_Outcome {

	public const PHASE_NONE     = 'none';
	public const PHASE_PROVIDER = 'provider';
	public const PHASE_EXCHANGE = 'exchange';

	/**
	 * Whether the callback completed successfully.
	 *
	 * @var bool
	 */
	private $is_success;

	/**
	 * Whether the request carried no actionable callback parameters.
	 *
	 * @var bool
	 */
	private $is_no_op;

	/**
	 * The OAuth phase that produced a failure (a PHASE_* constant).
	 *
	 * @var string
	 */
	private $error_phase;

	/**
	 * The native OAuth error code on failure, or null when there is none
	 * (a success, a no-op, or a failure with no OAuth response at all).
	 *
	 * @var string|null
	 */
	private $error_code;

	/**
	 * Callback_Outcome constructor.
	 *
	 * @param bool        $is_success  Whether the callback succeeded.
	 * @param bool        $is_no_op    Whether the request was not a real callback.
	 * @param string      $error_phase The OAuth phase that produced a failure.
	 * @param string|null $error_code  The native OAuth error code on failure.
	 */
	private function __construct( bool $is_success, bool $is_no_op, string $error_phase, ?string $error_code ) {
		$this->is_success  = $is_success;
		$this->is_no_op    = $is_no_op;
		$this->error_phase = $error_phase;
		$this->error_code  = $error_code;
	}

	/**
	 * Creates a successful outcome (the code was exchanged and tokens stored).
	 *
	 * @return self
	 */
	public static function success(): self {
		return new self( true, false, self::PHASE_NONE, null );
	}

	/**
	 * Creates a no-op outcome (empty code/state — not a real callback).
	 *
	 * @return self
	 */
	public static function no_op(): self {
		return new self( false, true, self::PHASE_NONE, null );
	}

	/**
	 * Creates an outcome for an error reported by the authorization endpoint
	 * redirect (the `error` query parameter on the callback).
	 *
	 * @param string $oauth_error_code The native OAuth error code.
	 *
	 * @return self
	 */
	public static function provider_error( string $oauth_error_code ): self {
		return new self( false, false, self::PHASE_PROVIDER, $oauth_error_code );
	}

	/**
	 * Creates an outcome for a failure while exchanging the code at the token
	 * endpoint.
	 *
	 * @param string|null $oauth_error_code The native OAuth error code, or null
	 *                                       when the failure produced no OAuth
	 *                                       response at all.
	 *
	 * @return self
	 */
	public static function exchange_error( ?string $oauth_error_code ): self {
		return new self( false, false, self::PHASE_EXCHANGE, $oauth_error_code );
	}

	/**
	 * Whether the callback completed successfully.
	 *
	 * @return bool
	 */
	public function is_success(): bool {
		return $this->is_success;
	}

	/**
	 * Whether the request carried no actionable callback parameters.
	 *
	 * @return bool
	 */
	public function is_no_op(): bool {
		return $this->is_no_op;
	}

	/**
	 * Whether the callback failed.
	 *
	 * @return bool
	 */
	public function is_failure(): bool {
		return ! $this->is_success && ! $this->is_no_op;
	}

	/**
	 * Returns the OAuth phase that produced a failure.
	 *
	 * @return string A PHASE_* constant.
	 */
	public function get_error_phase(): string {
		return $this->error_phase;
	}

	/**
	 * Returns the native OAuth error code on failure.
	 *
	 * @return string|null The OAuth error code, or null when there is none.
	 */
	public function get_error_code(): ?string {
		return $this->error_code;
	}

	/**
	 * Converts the outcome to an associative array for storage.
	 *
	 * @return array{is_success: bool, is_no_op: bool, error_phase: string, error_code: string|null}
	 */
	public function to_array(): array {
		return [
			'is_success'  => $this->is_success,
			'is_no_op'    => $this->is_no_op,
			'error_phase' => $this->error_phase,
			'error_code'  => $this->error_code,
		];
	}

	/**
	 * Creates a Callback_Outcome from a stored array.
	 *
	 * @param array<string, bool|string|null> $data The stored array data.
	 *
	 * @return self
	 */
	public static function from_array( array $data ): self {
		$error_phase = ( isset( $data['error_phase'] ) && \is_string( $data['error_phase'] ) ) ? $data['error_phase'] : self::PHASE_NONE;
		$error_code  = ( isset( $data['error_code'] ) && \is_string( $data['error_code'] ) ) ? $data['error_code'] : null;

		return new self(
			! empty( $data['is_success'] ),
			! empty( $data['is_no_op'] ),
			$error_phase,
			$error_code,
		);
	}
}
