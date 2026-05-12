<?php

namespace Yoast\WP\SEO\AI_Authorization\Domain;

/**
 * Class Token
 * Represents a token used for authentication with the AI Generator API.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
class Token {

	/**
	 * The token value.
	 *
	 * @var string
	 */
	private $value;

	/**
	 * The expiration time.
	 *
	 * @var int
	 */
	private $expiration;

	/**
	 * Token constructor.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param string $value      The token value.
	 * @param int    $expiration The expiration time.
	 */
	public function __construct( string $value, int $expiration ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->value      = $value;
		$this->expiration = $expiration;
	}

	/**
	 * Get the token value.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string The token value.
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return $this->value;
	}

	/**
	 * Whether the token is expired.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return bool True if the token is expired, false otherwise.
	 */
	public function is_expired(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return $this->expiration < \time();
	}
}
