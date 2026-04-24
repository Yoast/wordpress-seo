<?php

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;

/**
 * Immutable value object representing an OIDC discovery document.
 *
 * Wraps the full response from `{issuer}/.well-known/openid-configuration`.
 * The constructor validates spec-required fields (OIDC Discovery 1.0 Section 3),
 * client-required fields (registration and revocation endpoints), and server
 * capabilities (grant types, PKCE, DPoP, etc.).
 */
class Discovery_Document {

	/**
	 * String fields required by the OIDC Discovery 1.0 specification (Section 3).
	 *
	 * Note: `token_endpoint` is spec-required unless only the Implicit Flow is used;
	 * since this client uses Authorization Code + PKCE, it is always required here.
	 *
	 * @var string[]
	 */
	private const SPEC_REQUIRED_STRING_FIELDS = [
		'issuer',
		'authorization_endpoint',
		'token_endpoint',
		'jwks_uri',
	];

	/**
	 * Array fields required by the OIDC Discovery 1.0 specification (Section 3).
	 *
	 * @var string[]
	 */
	private const SPEC_REQUIRED_ARRAY_FIELDS = [
		'response_types_supported',
		'subject_types_supported',
		'id_token_signing_alg_values_supported',
	];

	/**
	 * String fields not required by the OIDC spec but required by this client.
	 *
	 * - `registration_endpoint`: RECOMMENDED per OIDC Discovery spec; required for DCR (RFC 7591).
	 * - `revocation_endpoint`: Defined by RFC 8414; required for token revocation (RFC 7009).
	 *
	 * @var string[]
	 */
	private const CLIENT_REQUIRED_STRING_FIELDS = [
		'registration_endpoint',
		'revocation_endpoint',
	];

	/**
	 * The full discovery document data.
	 *
	 * @var array<string, string|string[]|bool>
	 */
	private $data;

	/**
	 * Discovery_Document constructor.
	 *
	 * Validates that all OIDC-spec-required fields are present and that the
	 * server advertises support for all features this client depends on.
	 *
	 * @param array<string, string|string[]|bool> $data The full discovery document data.
	 *
	 * @throws Discovery_Failed_Exception  If spec-required fields are missing or empty.
	 * @throws Server_Capability_Exception If the server lacks required capabilities.
	 *
	 * phpcs:ignore Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Server_Capability_Exception is thrown by validate_server_capabilities().
	 */
	public function __construct( array $data ) {
		$spec_invalid = [];
		foreach ( self::SPEC_REQUIRED_STRING_FIELDS as $key ) {
			if ( ! isset( $data[ $key ] ) || ! \is_string( $data[ $key ] ) || $data[ $key ] === '' ) {
				$spec_invalid[] = $key;
			}
		}
		foreach ( self::SPEC_REQUIRED_ARRAY_FIELDS as $key ) {
			if ( ! isset( $data[ $key ] ) || ! self::is_non_empty_string_array( $data[ $key ] ) ) {
				$spec_invalid[] = $key;
			}
		}

		if ( ! empty( $spec_invalid ) ) {
			throw new Discovery_Failed_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'OIDC discovery document has missing or invalid spec-required fields: %s', \implode( ', ', $spec_invalid ) ),
			);
		}

		$client_invalid = [];
		foreach ( self::CLIENT_REQUIRED_STRING_FIELDS as $key ) {
			if ( ! isset( $data[ $key ] ) || ! \is_string( $data[ $key ] ) || $data[ $key ] === '' ) {
				$client_invalid[] = $key;
			}
		}

		if ( ! empty( $client_invalid ) ) {
			throw new Server_Capability_Exception(
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				\sprintf( 'Server does not provide endpoints required by this client: %s', \implode( ', ', $client_invalid ) ),
			);
		}

		self::validate_server_capabilities( $data );

		$this->data = $data;
	}

	/**
	 * Returns the issuer identifier.
	 *
	 * @return string
	 */
	public function get_issuer(): string {
		return $this->data['issuer'];
	}

	/**
	 * Returns the authorization endpoint URL.
	 *
	 * @return string
	 */
	public function get_authorization_endpoint(): string {
		return $this->data['authorization_endpoint'];
	}

	/**
	 * Returns the token endpoint URL.
	 *
	 * @return string
	 */
	public function get_token_endpoint(): string {
		return $this->data['token_endpoint'];
	}

	/**
	 * Returns the dynamic client registration endpoint URL.
	 *
	 * @return string
	 */
	public function get_registration_endpoint(): string {
		return $this->data['registration_endpoint'];
	}

	/**
	 * Returns the token revocation endpoint URL.
	 *
	 * @return string
	 */
	public function get_revocation_endpoint(): string {
		return $this->data['revocation_endpoint'];
	}

	/**
	 * Returns the JSON Web Key Set URI.
	 *
	 * @return string
	 */
	public function get_jwks_uri(): string {
		return $this->data['jwks_uri'];
	}

	/**
	 * Returns the full discovery document data for cache storage.
	 *
	 * Stores the complete server response so that newly required fields
	 * are available from cache without requiring a fresh fetch.
	 *
	 * @return array<string, string|string[]|bool> The full discovery document.
	 */
	public function to_array(): array {
		return $this->data;
	}

	/**
	 * Validates that the server advertises support for all required features.
	 *
	 * @param array<string, string|string[]|bool> $config The parsed discovery document.
	 *
	 * @return void
	 *
	 * @throws Server_Capability_Exception If the server lacks required capabilities.
	 */
	private static function validate_server_capabilities( array $config ): void {
		$checks = [
			[
				'field'    => 'code_challenge_methods_supported',
				'required' => 'S256',
				'message'  => 'Server does not support S256 PKCE code challenge method.',
			],
			[
				'field'    => 'grant_types_supported',
				'required' => 'authorization_code',
				'message'  => 'Server does not support authorization_code grant type.',
			],
			[
				'field'    => 'grant_types_supported',
				'required' => 'refresh_token',
				'message'  => 'Server does not support refresh_token grant type.',
			],
			[
				'field'    => 'grant_types_supported',
				'required' => 'client_credentials',
				'message'  => 'Server does not support client_credentials grant type.',
			],
			[
				'field'    => 'token_endpoint_auth_methods_supported',
				'required' => 'private_key_jwt',
				'message'  => 'Server does not support private_key_jwt authentication.',
			],
			[
				'field'    => 'token_endpoint_auth_signing_alg_values_supported',
				'required' => 'EdDSA',
				'message'  => 'Server does not support EdDSA for token endpoint auth signing.',
			],
			[
				'field'    => 'dpop_signing_alg_values_supported',
				'required' => 'EdDSA',
				'message'  => 'Server does not support EdDSA for DPoP signing.',
			],
		];

		foreach ( $checks as $check ) {
			$supported = ( $config[ $check['field'] ] ?? [] );
			if ( ! \is_array( $supported ) || ! \in_array( $check['required'], $supported, true ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw new Server_Capability_Exception( $check['message'] );
			}
		}
	}

	/**
	 * Checks whether a value is a non-empty array containing only strings.
	 *
	 * phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- Validation method, accepts any type for checking.
	 *
	 * @param mixed $value The value to check.
	 *
	 * phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
	 *
	 * @return bool True if the value is a non-empty array of strings.
	 */
	private static function is_non_empty_string_array( $value ): bool {
		if ( ! \is_array( $value ) || $value === [] ) {
			return false;
		}

		foreach ( $value as $item ) {
			if ( ! \is_string( $item ) ) {
				return false;
			}
		}

		return true;
	}
}
