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
	 * The token type (an Auth_Token_Type constant).
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
	 * The RFC 8707 resource indicator this token was minted for.
	 *
	 * @var Resource_Indicator
	 */
	private $resource_indicator;

	/**
	 * Token_Set constructor.
	 *
	 * @param string                  $access_token       The access token.
	 * @param int                     $expires_at         Unix timestamp of token expiry.
	 * @param string                  $token_type         An Auth_Token_Type constant.
	 * @param string|null             $refresh_token      The refresh token.
	 * @param string|null             $id_token           The OIDC ID token.
	 * @param string|null             $scope              The granted scope.
	 * @param int                     $error_count        The number of consecutive refresh errors.
	 * @param Resource_Indicator|null $resource_indicator The resource indicator (RFC 8707) the token was minted for. Null is treated as Resource_Indicator::default().
	 *
	 * @throws InvalidArgumentException If required fields are empty or invalid.
	 */
	public function __construct(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $access_token,
		int $expires_at,
		string $token_type = Auth_Token_Type::DPOP,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		?string $refresh_token = null,
		?string $id_token = null,
		?string $scope = null,
		int $error_count = 0,
		?Resource_Indicator $resource_indicator = null
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

		$this->access_token       = $access_token;
		$this->expires_at         = $expires_at;
		$this->token_type         = $token_type;
		$this->refresh_token      = $refresh_token;
		$this->id_token           = $id_token;
		$this->scope              = $scope;
		$this->error_count        = $error_count;
		$this->resource_indicator = ( $resource_indicator ?? new Resource_Indicator( null ) );
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
	 * Returns the RFC 8707 resource indicator this token was minted for.
	 *
	 * @return Resource_Indicator
	 */
	public function get_resource_indicator(): Resource_Indicator {
		return $this->resource_indicator;
	}

	/**
	 * Returns a new Token_Set bound to the given resource indicator.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator.
	 *
	 * @return self
	 */
	public function with_resource_indicator( Resource_Indicator $resource_indicator ): self {
		return new self(
			$this->access_token,
			$this->expires_at,
			$this->token_type,
			$this->refresh_token,
			$this->id_token,
			$this->scope,
			$this->error_count,
			$resource_indicator,
		);
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
			$this->resource_indicator,
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
			'access_token'       => $this->access_token,
			'expires_at'         => $this->expires_at,
			'token_type'         => $this->token_type,
			'refresh_token'      => $this->refresh_token,
			'id_token'           => $this->id_token,
			'scope'              => $this->scope,
			'error_count'        => $this->error_count,
			'resource_indicator' => $this->resource_indicator->value(),
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
		$stored_indicator = ( $data['resource_indicator'] ?? null );

		return new self(
			(string) ( $data['access_token'] ?? '' ),
			(int) ( $data['expires_at'] ?? 0 ),
			( $data['token_type'] ?? Auth_Token_Type::DPOP ),
			( $data['refresh_token'] ?? null ),
			( $data['id_token'] ?? null ),
			( $data['scope'] ?? null ),
			(int) ( $data['error_count'] ?? 0 ),
			new Resource_Indicator( ( \is_string( $stored_indicator ) && $stored_indicator !== '' ) ? $stored_indicator : null ),
		);
	}

	/**
	 * Creates a Token_Set from a token endpoint response.
	 *
	 * Per RFC 8707 §3 the AS may echo a `resource` field to confirm the audience
	 * it minted the token for. The spec does not require the client to honour
	 * the echo, and trusting an unverified echo into storage could later violate
	 * §2 on refresh. We deliberately ignore the echoed field; the caller is
	 * expected to stamp the requested indicator via with_resource_indicator().
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
			( $response['token_type'] ?? Auth_Token_Type::DPOP ),
			( $response['refresh_token'] ?? null ),
			( $response['id_token'] ?? null ),
			( $response['scope'] ?? null ),
		);
	}
}
