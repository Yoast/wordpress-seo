<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Suggestion
 * Represents a suggestion from the AI Generator API.
 *
 * @deprecated 27.5
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
	 * @param string $value The suggestion text.
	 */
	public function __construct( string $value ) {
		$this->value = $value;
	}

	/**
	 * Returns the suggestion text.
	 *
	 * @return string
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return $this->value;
	}
}
