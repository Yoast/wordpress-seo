<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Class to contain a collection of Indexable_Count objects.
 */
class Indexable_Count_Collection {

	/**
	 * The array of Indexable_Count objects.
	 *
	 * @var array<int, Indexable_Count>
	 */
	private array $indexable_counts;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->indexable_counts = [];
	}

	/**
	 * Adds an Indexable_Count object to the collection.
	 *
	 * @param Indexable_Count $indexable_count The Indexable_Count object to add.
	 * @return void
	 */
	public function add_indexable_count( Indexable_Count $indexable_count ): void {
		$this->indexable_counts[] = $indexable_count;
	}

	/**
	 * Gets all indexable counts.
	 *
	 * @return array<int, Indexable_Count> The array of Indexable_Count objects.
	 */
	public function get_indexable_counts(): array {
		return $this->indexable_counts;
	}
}
