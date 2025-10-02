<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Domain;

/**
 * Class Suggestions_Bucket
 * Represents a collection of Suggestion objects.
 *
 * @deprecated
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
	 * @deprecated
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Generate\Domain\Suggestions_Bucket::__construct' );

		$this->suggestions = [];
	}

	/**
	 * Adds a suggestion to the bucket.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param Suggestion $suggestion The suggestion to add.
	 *
	 * @return void
	 */
	public function add_suggestion( Suggestion $suggestion ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Generate\Domain\Suggestions_Bucket::add_suggestion' );

		$this->suggestions[] = $suggestion;
	}

	/**
	 * Returns the suggestions as an array.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public function to_array() {
		\_deprecated_function( __METHOD__, 'Yoast SEO ', 'Yoast\WP\SEO\AI\Generate\Domain\Suggestions_Bucket::to_array' );

		return \array_map(
			static function ( $item ) {
				return $item->get_value();
			},
			$this->suggestions
		);
	}
}
