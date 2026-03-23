<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Suggestion_Bucket
 * Represents a collection of Suggestion objects.
 *
 * @deprecated 27.5
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
	 */
	public function __construct() {
		$this->suggestions = [];
	}

	/**
	 * Adds a suggestion to the bucket.
	 *
	 * @param Suggestion $suggestion The suggestion to add.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function add_suggestion( Suggestion $suggestion ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		$this->suggestions[] = $suggestion;
	}

	/**
	 * Returns the suggestions as an array.
	 *
	 * @return array<string>
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function to_array() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return \array_map(
			static function ( $item ) {
				return $item->get_value();
			},
			$this->suggestions,
		);
	}
}
