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
	 * Registered_Client constructor.
	 *
	 * @param string                              $client_id                 The registered client ID.
	 * @param string                              $registration_access_token The registration access token.
	 * @param string                              $registration_client_uri   The management endpoint URL.
	 * @param array<string, string|array<string>> $metadata                  Additional metadata from the registration response.
	 *
	 * @throws InvalidArgumentException If client_id is empty.
	 */
	public function __construct(
		string $client_id,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $registration_access_token,
		string $registration_client_uri,
		array $metadata = []
	) {
		if ( $client_id === '' ) {
			throw new InvalidArgumentException( 'Registered_Client requires a non-empty client_id.' );
		}

		$this->client_id                 = $client_id;
		$this->registration_access_token = $registration_access_token;
		$this->registration_client_uri   = $registration_client_uri;
		$this->metadata                  = $metadata;
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
		];
	}
}
