<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;

/**
 * Provides the features that agents can read the status of, including those they cannot enable or disable on the site.
 */
class Feature_Repository {

	/**
	 * The features.
	 *
	 * @var array<Feature_Interface>
	 */
	private $features;

	/**
	 * Constructor.
	 *
	 * @param Feature_Interface ...$features The features.
	 */
	public function __construct( Feature_Interface ...$features ) {
		$this->features = $features;
	}

	/**
	 * Returns all the features.
	 *
	 * @return array<Feature_Interface> The features.
	 */
	public function get_all(): array {
		return $this->features;
	}
}
