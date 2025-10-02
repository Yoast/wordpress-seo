<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Domain;

/**
 * Class Suggestion
 * Represents a suggestion from the AI Generator API.
 *
 * @deprecated
 * @codeCoverageIgnore
 */
class Suggestion {

	/**
	 * The suggestion text.
	 *
	 * @var string
	 */
	private $value;

	/**
	 * The constructor.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param string $value The suggestion text.
	 */
	public function __construct( string $value ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Generate\Domain\Suggestion::__construct' );

		$this->value = $value;
	}

	/**
	 * Returns the suggestion text.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Generate\Domain\Suggestion::get_value' );

		return $this->value;
	}
}
