<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository;

/**
 * Factory for creating indexable repositories based on availability.
 */
class Indexable_Repository_Factory {

	/**
	 * The native indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $native_repository;

	/**
	 * The WordPress indexable repository.
	 *
	 * @var WordPress_Query_Repository
	 */
	private $wordpress_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository       $native_repository    The native indexable repository.
	 * @param WordPress_Query_Repository $wordpress_repository The WordPress indexable repository.
	 */
	public function __construct(
		Indexable_Repository $native_repository,
		WordPress_Query_Repository $wordpress_repository
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
