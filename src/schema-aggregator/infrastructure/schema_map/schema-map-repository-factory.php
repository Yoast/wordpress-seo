<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

/**
 * Factory for getting the amount of posts per post type.
 */
class Schema_Map_Repository_Factory {

	/**
	 * The native indexable repository.
	 *
	 * @var Schema_Map_Indexable_Repository
	 */
	private $native_repository;

	/**
	 * The WordPress indexable repository.
	 *
	 * @var Schema_Map_WordPress_Repository
	 */
	private $wordpress_repository;

	/**
	 * Constructor.
	 *
	 * @param Schema_Map_Indexable_Repository $native_repository    The native indexable repository.
	 * @param Schema_Map_WordPress_Repository $wordpress_repository The WordPress indexable repository.
	 */
	public function __construct(
		Schema_Map_Indexable_Repository $native_repository,
		Schema_Map_WordPress_Repository $wordpress_repository
	) {
		$this->native_repository    = $native_repository;
		$this->wordpress_repository = $wordpress_repository;
	}

	/**
	 * Gets the appropriate indexable repository based on availability.
	 *
	 * @param bool $indexables_available Whether native indexables are available.
	 *
	 * @return Schema_Map_Repository_Interface The selected indexable repository.
	 */
	public function get_repository( bool $indexables_available ): Schema_Map_Repository_Interface {
		if ( $indexables_available ) {
			return $this->native_repository;
		}

		return $this->wordpress_repository;
	}
}
