<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;

/**
 * Provides the features that agents can enable or disable.
 */
class Feature_Repository {

	/**
	 * The features, keyed by their key.
	 *
	 * @var array<string, Feature_Interface>
	 */
	private $features = [];

	/**
	 * Constructor.
	 *
	 * @param Feature_Interface ...$features The features.
	 */
	public function __construct( Feature_Interface ...$features ) {
		foreach ( $features as $feature ) {
			$this->features[ $feature->get_key() ] = $feature;
		}
	}

	/**
	 * Returns a feature by its key.
	 *
	 * @param string $key The key of the feature, the `KEY` constant of its class.
	 *
	 * @return Feature_Interface|null The feature, or null if no feature has the key.
	 */
	public function get( string $key ): ?Feature_Interface {
		return ( $this->features[ $key ] ?? null );
	}

	/**
	 * Returns all the features.
	 *
	 * @return array<Feature_Interface> The features.
	 */
	public function get_all(): array {
		return \array_values( $this->features );
	}
}
