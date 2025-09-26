<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Domain;

/**
 * Class Suggestion
 * Represents a suggestion from the AI Generator API.
 *
 * @deprecated 26.2
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
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param string $value The suggestion text.
	 */
	public function __construct( string $value ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Domain\Suggestion::__construct' );
	}

	/**
	 * Returns the suggestion text.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Domain\Suggestion::get_value' );

		return '';
	}
}
