<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Suggestion
 * Represents a suggestion from the AI Generator API.
 *
 * @deprecated 27.7
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
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param string $value The suggestion text.
	 */
	public function __construct( string $value ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->value = $value;
	}

	/**
	 * Returns the suggestion text.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_value(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return $this->value;
	}
}
