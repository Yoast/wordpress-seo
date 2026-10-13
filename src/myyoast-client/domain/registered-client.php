<?php

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

use InvalidArgumentException;
use SensitiveParameter;

/**
 * Immutable value object representing the result of Dynamic Client Registration.
 *
 * Stores the client_id, registration access token, and management endpoint URI
 * received from the authorization server during DCR (RFC 7591).
 */
class Registered_Client {

	/**
	 * The registered OAuth client ID.
	 *
	 * @var string
	 */
	private $client_id;

	/**
	 * The registration access token for RFC 7592 management operations.
	 *
	 * @var string
	 */
	private $registration_access_token;

	/**
	 * The management endpoint URL for this client registration.
	 *
	 * @var string
	 */
	private $registration_client_uri;

	/**
	 * Additional metadata from the registration response.
	 *
	 * @var array<string, string|array<string>>
	 */
	private $metadata;

	/**
	 * The redirect URIs that have completed the authorization-code flow on this site.
	 *
	 * Stored alongside the client (rather than in $metadata, which is reserved for standardized
	 * authorization-server metadata) so the validation state is invalidated automatically whenever
	 * the registration is removed or replaced.
	 *
	 * @var string[]
	 */
	private $validated_uris;

	/**
	 * Registered_Client constructor.
	 *
	 * @param string                              $client_id                 The registered client ID.
	 * @param string                              $registration_access_token The registration access token.
	 * @param string                              $registration_client_uri   The management endpoint URL.
	 * @param array<string, string|array<string>> $metadata                  Additional metadata from the registration response.
	 * @param string[]                            $validated_uris            Redirect URIs that have completed the auth-code flow.
	 *
	 * @throws InvalidArgumentException If client_id is empty.
	 */
	public function __construct(
		string $client_id,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $registration_access_token,
		string $registration_client_uri,
		array $metadata = [],
		array $validated_uris = []
	) {
		if ( $client_id === '' ) {
			throw new InvalidArgumentException( 'Registered_Client requires a non-empty client_id.' );
		}

		$this->client_id                 = $client_id;
		$this->registration_access_token = $registration_access_token;
		$this->registration_client_uri   = $registration_client_uri;
		$this->metadata                  = $metadata;
		$this->validated_uris            = \array_values( $validated_uris );
	}

	/**
	 * Returns the registered client ID.
	 *
	 * @return string
	 */
	public function get_client_id(): string {
		return $this->client_id;
	}

	/**
	 * Returns the registration access token.
	 *
	 * @return string
	 */
	public function get_registration_access_token(): string {
		return $this->registration_access_token;
	}

	/**
	 * Returns the management endpoint URL.
	 *
	 * @return string
	 */
	public function get_registration_client_uri(): string {
		return $this->registration_client_uri;
	}

	/**
	 * Returns additional metadata from the registration response.
	 *
	 * @return array<string, string|array<string>>
	 */
	public function get_metadata(): array {
		return $this->metadata;
	}

	/**
	 * Returns the redirect URIs this client is registered with.
	 *
	 * @return string[]
	 */
	public function get_redirect_uris(): array {
		$redirect_uris = ( $this->metadata['redirect_uris'] ?? [] );

		return ( \is_array( $redirect_uris ) ) ? \array_values( $redirect_uris ) : [];
	}

	/**
	 * Whether this client's registered redirect URIs exactly match the given set (order-insensitive),
	 * so both additions and removals count as a mismatch.
	 *
	 * @param string[] $redirect_uris The redirect-URI set to compare against.
	 *
	 * @return bool
	 */
	public function has_redirect_uris( array $redirect_uris ): bool {
		$wanted = \array_unique( $redirect_uris );
		$stored = \array_unique( $this->get_redirect_uris() );
		\sort( $wanted );
		\sort( $stored );

		return $wanted === $stored;
	}

	/**
	 * Returns the redirect URIs that have completed the authorization-code flow on this site.
	 *
	 * @return string[]
	 */
	public function get_validated_uris(): array {
		return $this->validated_uris;
	}

	/**
	 * Whether the given redirect URI has completed the authorization-code flow on this site.
	 *
	 * @param string $redirect_uri The redirect URI to check.
	 *
	 * @return bool
	 */
	public function is_uri_validated( string $redirect_uri ): bool {
		return \in_array( $redirect_uri, $this->validated_uris, true );
	}

	/**
	 * Returns a copy of this client with its validated redirect URIs replaced.
	 *
	 * @param string[] $validated_uris The redirect URIs that have completed the auth-code flow.
	 *
	 * @return self
	 */
	public function with_validated_uris( array $validated_uris ): self {
		return new self(
			$this->client_id,
			$this->registration_access_token,
			$this->registration_client_uri,
			$this->metadata,
			$validated_uris,
		);
	}

	/**
	 * Converts the DTO to an associative array for storage.
	 *
	 * @return array<string, string|array<string>>
	 */
	public function to_array(): array {
		return [
			'client_id'                 => $this->client_id,
			'registration_access_token' => $this->registration_access_token,
			'registration_client_uri'   => $this->registration_client_uri,
			'metadata'                  => $this->metadata,
			'validated_uris'            => $this->validated_uris,
		];
	}
}
