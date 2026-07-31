<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Suggestion_Bucket
 * Represents a collection of Suggestion objects.
 *
 * @deprecated 28.3
 * @codeCoverageIgnore
 */
class Suggestions_Bucket {

	/**
	 * The suggestions.
	 *
	 * @var array<Suggestion>
	 */
	private $suggestions;

	/**
	 * Class constructor.
	 *
	 * @deprecated 28.3
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.3' );
		$this->suggestions = [];
	}

	/**
	 * Adds a suggestion to the bucket.
	 *
	 * @deprecated 28.3
	 * @codeCoverageIgnore
	 *
	 * @param Suggestion $suggestion The suggestion to add.
	 *
	 * @return void
	 */
	public function add_suggestion( Suggestion $suggestion ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.3' );
		$this->suggestions[] = $suggestion;
	}

	/**
	 * Returns the suggestions as an array.
	 *
	 * @deprecated 28.3
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public function to_array() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.3' );
		return \array_map(
			static function ( $item ) {
				return $item->get_value();
			},
			$this->suggestions,
		);
	}
}
