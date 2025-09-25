<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Domain;

/**
 * Class Suggestions_Bucket
 * Represents a collection of Suggestion objects.
 *
 * @deprecated 26.2
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
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Bucket::__construct' );
	}

	/**
	 * Adds a suggestion to the bucket.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Suggestion $suggestion The suggestion to add.
	 *
	 * @return void
	 */
	public function add_suggestion( Suggestion $suggestion ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Bucket::add_suggestion' );
	}

	/**
	 * Returns the suggestions as an array.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public function to_array() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Bucket::to_array' );

		return [];
	}
}
