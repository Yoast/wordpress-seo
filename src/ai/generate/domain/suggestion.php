<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\Generate\Domain;

/**
 * Class Suggestion
 * Represents a suggestion from the AI Generator API.
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
	 * @param string $value The suggestion text.
	 */
	public function __construct( string $value ) {
		$this->value = $value;
	}

	/**
	 * Returns the suggestion text.
	 *
	 * @return string
	 */
	public function get_value(): string {
		return $this->value;
	}
}
