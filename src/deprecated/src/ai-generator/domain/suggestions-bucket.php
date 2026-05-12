<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Suggestion_Bucket
 * Represents a collection of Suggestion objects.
 *
 * @deprecated 27.7
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
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->suggestions = [];
	}

	/**
	 * Adds a suggestion to the bucket.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param Suggestion $suggestion The suggestion to add.
	 *
	 * @return void
	 */
	public function add_suggestion( Suggestion $suggestion ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->suggestions[] = $suggestion;
	}

	/**
	 * Returns the suggestions as an array.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public function to_array() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return \array_map(
			static function ( $item ) {
				\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
				return $item->get_value();
			},
			$this->suggestions,
		);
	}
}
