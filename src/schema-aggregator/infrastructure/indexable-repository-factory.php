<?php

namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

/**
 * Factory for creating indexable repositories based on availability.
 */
class Indexable_Repository_Factory {

	/**
	 * The native indexable repository.
	 *
	 * @var Native_Indexable_Repository
	 */
	private $native_repository;

	/**
	 * The WordPress indexable repository.
	 *
	 * @var WordPress_Indexable_Repository
	 */
	private $wordpress_repository;

	/**
	 * Constructor.
	 *
	 * @param Native_Indexable_Repository    $native_repository    The native indexable repository.
	 * @param WordPress_Indexable_Repository $wordpress_repository The WordPress indexable repository.
	 */
	public function __construct(
		Native_Indexable_Repository $native_repository,
		WordPress_Indexable_Repository $wordpress_repository
	) {
		$this->native_repository    = $native_repository;
		$this->wordpress_repository = $wordpress_repository;
	}

	/**
	 * Gets the appropriate indexable repository based on availability.
	 *
	 * @param bool $indexables_available Whether native indexables are available.
	 *
	 * @return Indexable_Repository_Interface The selected indexable repository.
	 */
	public function get_repository( bool $indexables_available ): Indexable_Repository_Interface {
		if ( $indexables_available ) {
			return $this->native_repository;
		}

		return $this->wordpress_repository;
	}
}
