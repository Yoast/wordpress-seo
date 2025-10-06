<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Domain;

/**
 * Class Token
 * Represents a token used for authentication with the AI Generator API.
 *
 * @deprecated 26.3
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
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param string $value      The token value.
	 * @param int    $expiration The expiration time.
	 */
	public function __construct( string $value, int $expiration ) {

		$this->value      = $value;
		$this->expiration = $expiration;
	}

	/**
	 * Get the token value.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The token value.
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Authorization\Domain\Token::get_value' );

		return $this->value;
	}

	/**
	 * Whether the token is expired.
	 *
	 * @deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return bool True if the token is expired, false otherwise.
	 */
	public function is_expired(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Authorization\Domain\Token::is_expired' );

		return $this->expiration < \time();
	}
}
