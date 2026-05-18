<?php

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

use InvalidArgumentException;

/**
 * Immutable value object representing the state of an in-progress authorization code flow.
 *
 * Stores the PKCE code verifier, CSRF state, nonce, redirect URI, and optional
 * return URL for post-authorization redirect.
 */
class Auth_Flow_State {

	/**
	 * The PKCE code verifier.
	 *
	 * @var string
	 */
	private $code_verifier;

	/**
	 * The CSRF state parameter.
	 *
	 * @var string
	 */
	private $state;

	/**
	 * The nonce for ID token replay protection (only set when openid scope is requested).
	 *
	 * @var string|null
	 */
	private $nonce;

	/**
	 * The callback redirect URI.
	 *
	 * @var string
	 */
	private $redirect_uri;

	/**
	 * The URL to return the user to after authorization completes.
	 *
	 * @var string|null
	 */
	private $return_url;

	/**
	 * Auth_Flow_State constructor.
	 *
	 * @param string      $code_verifier The PKCE code verifier.
	 * @param string      $state         The CSRF state parameter.
	 * @param string|null $nonce         The nonce for ID token validation (only when openid scope is requested).
	 * @param string      $redirect_uri  The callback redirect URI.
	 * @param string|null $return_url    The URL to return the user to after authorization.
	 *
	 * @throws InvalidArgumentException If required fields are empty.
	 */
	public function __construct(
		string $code_verifier,
		string $state,
		?string $nonce,
		string $redirect_uri,
		?string $return_url = null
	) {
		if ( $code_verifier === '' || $state === '' || $redirect_uri === '' ) {
			throw new InvalidArgumentException( 'Auth_Flow_State requires non-empty code_verifier, state, and redirect_uri.' );
		}

		$this->code_verifier = $code_verifier;
		$this->state         = $state;
		$this->nonce         = $nonce;
		$this->redirect_uri  = $redirect_uri;
		$this->return_url    = $return_url;
	}

	/**
	 * Returns the PKCE code verifier.
	 *
	 * @return string
	 */
	public function get_code_verifier(): string {
		return $this->code_verifier;
	}

	/**
	 * Returns the CSRF state parameter.
	 *
	 * @return string
	 */
	public function get_state(): string {
		return $this->state;
	}

	/**
	 * Returns the nonce.
	 *
	 * @return string|null
	 */
	public function get_nonce(): ?string {
		return $this->nonce;
	}

	/**
	 * Returns the callback redirect URI.
	 *
	 * @return string
	 */
	public function get_redirect_uri(): string {
		return $this->redirect_uri;
	}

	/**
	 * Returns the post-authorization return URL.
	 *
	 * @return string|null
	 */
	public function get_return_url(): ?string {
		return $this->return_url;
	}

	/**
	 * Converts the state to an associative array for storage.
	 *
	 * @return array<string, string|null>
	 */
	public function to_array(): array {
		return [
			'code_verifier' => $this->code_verifier,
			'state'         => $this->state,
			'nonce'         => $this->nonce,
			'redirect_uri'  => $this->redirect_uri,
			'return_url'    => $this->return_url,
		];
	}

	/**
	 * Creates an Auth_Flow_State from a stored array.
	 *
	 * @param array<string, string|null> $data The stored array data.
	 *
	 * @return self
	 *
	 * @throws InvalidArgumentException If required fields are missing or have invalid types.
	 */
	public static function from_array( array $data ): self {
		$required = [ 'code_verifier', 'state', 'redirect_uri' ];
		foreach ( $required as $key ) {
			if ( ! isset( $data[ $key ] ) || ! \is_string( $data[ $key ] ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw new InvalidArgumentException( "Auth_Flow_State::from_array() requires a string value for '{$key}'." );
			}
		}
		$optional_strings = [ 'nonce', 'return_url' ];
		foreach ( $optional_strings as $key ) {
			if ( isset( $data[ $key ] ) && ! \is_string( $data[ $key ] ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
				throw new InvalidArgumentException( "Auth_Flow_State::from_array() requires '{$key}' to be a string or null." );
			}
		}

		return new self(
			$data['code_verifier'],
			$data['state'],
			( $data['nonce'] ?? null ),
			$data['redirect_uri'],
			( $data['return_url'] ?? null ),
		);
	}
}
