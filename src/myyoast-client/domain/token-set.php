<?php

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

use InvalidArgumentException;
use SensitiveParameter;

/**
 * Immutable value object representing a set of OAuth tokens.
 *
 * Can represent both user-level tokens (from authorization code flow, with
 * refresh_token and id_token) and site-level tokens (from client_credentials,
 * access_token only).
 */
class Token_Set {

	/**
	 * Seconds before actual expiry to consider the token expired.
	 * Accounts for request latency and minor clock differences.
	 */
	private const EXPIRY_BUFFER_SECONDS = 60;

	/**
	 * The access token (opaque string — do not parse).
	 *
	 * @var string
	 */
	private $access_token;

	/**
	 * The Unix timestamp at which the access token expires.
	 *
	 * @var int
	 */
	private $expires_at;

	/**
	 * The refresh token, if available (user-level tokens only).
	 *
	 * @var string|null
	 */
	private $refresh_token;

	/**
	 * The OIDC ID token, if available (user-level tokens only).
	 *
	 * @var string|null
	 */
	private $id_token;

	/**
	 * The granted scope string.
	 *
	 * @var string|null
	 */
	private $scope;

	/**
	 * The token type (e.g. "DPoP" or "Bearer").
	 *
	 * @var string
	 */
	private $token_type;

	/**
	 * The number of consecutive refresh errors.
	 *
	 * @var int
	 */
	private $error_count;

	/**
	 * Token_Set constructor.
	 *
	 * @param string      $access_token  The access token.
	 * @param int         $expires_at    Unix timestamp of token expiry.
	 * @param string      $token_type    The token type (e.g. "DPoP").
	 * @param string|null $refresh_token The refresh token.
	 * @param string|null $id_token      The OIDC ID token.
	 * @param string|null $scope         The granted scope.
	 * @param int         $error_count   The number of consecutive refresh errors.
	 *
	 * @throws InvalidArgumentException If required fields are empty or invalid.
	 */
	public function __construct(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $access_token,
		int $expires_at,
		string $token_type = 'DPoP',
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		?string $refresh_token = null,
		?string $id_token = null,
		?string $scope = null,
		int $error_count = 0
	) {
		if ( $access_token === '' ) {
			throw new InvalidArgumentException( 'Token_Set requires a non-empty access_token.' );
		}
		if ( $expires_at <= 0 ) {
			throw new InvalidArgumentException( 'Token_Set requires a positive expires_at timestamp.' );
		}
		if ( $token_type === '' ) {
			throw new InvalidArgumentException( 'Token_Set requires a non-empty token_type.' );
		}

		$this->access_token  = $access_token;
		$this->expires_at    = $expires_at;
		$this->token_type    = $token_type;
		$this->refresh_token = $refresh_token;
		$this->id_token      = $id_token;
		$this->scope         = $scope;
		$this->error_count   = $error_count;
	}

	/**
	 * Returns the access token.
	 *
	 * @return string
	 */
	public function get_access_token(): string {
		return $this->access_token;
	}

	/**
	 * Returns the Unix timestamp at which the access token expires.
	 *
	 * @return int
	 */
	public function get_expires_at(): int {
		return $this->expires_at;
	}

	/**
	 * Returns the token type.
	 *
	 * @return string
	 */
	public function get_token_type(): string {
		return $this->token_type;
	}

	/**
	 * Returns the refresh token, or null if not available.
	 *
	 * @return string|null
	 */
	public function get_refresh_token(): ?string {
		return $this->refresh_token;
	}

	/**
	 * Returns the OIDC ID token, or null if not available.
	 *
	 * @return string|null
	 */
	public function get_id_token(): ?string {
		return $this->id_token;
	}

	/**
	 * Returns the granted scope string, or null if not available.
	 *
	 * @return string|null
	 */
	public function get_scope(): ?string {
		return $this->scope;
	}

	/**
	 * Checks if the token set has the required scope(s).
	 * Returns true if AT LEAST all required scopes are granted, false otherwise.
	 *
	 * @param string[] $required_scopes The required scopes as an array of strings.
	 *
	 * @return bool True if all required scopes are granted, false otherwise.
	 */
	public function has_scopes( array $required_scopes ): bool {
		if ( $this->scope === null ) {
			return \count( $required_scopes ) === 0;
		}
		$granted_scopes = \explode( ' ', $this->scope );
		return \count( \array_diff( $required_scopes, $granted_scopes ) ) === 0;
	}

	/**
	 * Returns the number of consecutive refresh errors.
	 *
	 * @return int
	 */
	public function get_error_count(): int {
		return $this->error_count;
	}

	/**
	 * Returns a new Token_Set with an incremented error count.
	 *
	 * @return self
	 */
	public function with_incremented_error_count(): self {
		return new self(
			$this->access_token,
			$this->expires_at,
			$this->token_type,
			$this->refresh_token,
			$this->id_token,
			$this->scope,
			$this->error_count + 1,
		);
	}

	/**
	 * Whether the access token has expired.
	 *
	 * Uses a 60-second buffer to allow for request latency.
	 *
	 * @return bool
	 */
	public function is_expired(): bool {
		return \time() >= ( $this->expires_at - self::EXPIRY_BUFFER_SECONDS );
	}

	/**
	 * Converts the token set to an associative array for storage.
	 *
	 * @return array<string, string|int|null> The token set as an array.
	 */
	public function to_array(): array {
		return [
			'access_token'  => $this->access_token,
			'expires_at'    => $this->expires_at,
			'token_type'    => $this->token_type,
			'refresh_token' => $this->refresh_token,
			'id_token'      => $this->id_token,
			'scope'         => $this->scope,
			'error_count'   => $this->error_count,
		];
	}

	/**
	 * Creates a Token_Set from a stored array.
	 *
	 * @param array<string, string|int|null> $data The stored array data.
	 *
	 * @return self
	 */
	public static function from_array( array $data ): self {
		return new self(
			(string) ( $data['access_token'] ?? '' ),
			(int) ( $data['expires_at'] ?? 0 ),
			( $data['token_type'] ?? 'DPoP' ),
			( $data['refresh_token'] ?? null ),
			( $data['id_token'] ?? null ),
			( $data['scope'] ?? null ),
			(int) ( $data['error_count'] ?? 0 ),
		);
	}

	/**
	 * Creates a Token_Set from a token endpoint response.
	 *
	 * @param array<string, string|int|null> $response The parsed JSON response from the token endpoint.
	 *
	 * @return self
	 *
	 * @throws InvalidArgumentException If the response is missing a valid access_token.
	 */
	public static function from_response( array $response ): self {
		if ( empty( $response['access_token'] ) || ! \is_string( $response['access_token'] ) ) {
			throw new InvalidArgumentException( 'Token response is missing a valid access_token.' );
		}

		$expires_in = (int) ( $response['expires_in'] ?? 900 );

		return new self(
			$response['access_token'],
			( \time() + $expires_in ),
			( $response['token_type'] ?? 'DPoP' ),
			( $response['refresh_token'] ?? null ),
			( $response['id_token'] ?? null ),
			( $response['scope'] ?? null ),
		);
	}
}
