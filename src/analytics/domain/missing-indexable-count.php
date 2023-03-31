<?php

namespace Yoast\WP\SEO\Analytics\Domain;

/**
 * Domain object that holds indexable count information.
 */
class Missing_Indexable_Count {

	/**
	 * The indexable type that is represented by this.
	 *
	 * @var string $indexable_type
	 */
	private $indexable_type;

	/**
	 * The amount of missing indexables.
	 *
	 * @var int $count
	 */
	private $count;

	/**
	 * The constructor.
	 *
	 * @param string $indexable_type The indexable type that is represented by this.
	 * @param int    $count          The amount of missing indexables.
	 */
	public function __construct( string $indexable_type, int $count ) {
		$this->indexable_type = $indexable_type;
		$this->count          = $count;
	}

	/**
	 * Returns an array representation of the data.
	 *
	 * @return array Returns both values in an array format.
	 */
	public function to_array(): array {
		return [
			'indexable_type' => $this->get_indexable_type(),
			'count'          => $this->get_count(),
		];
	}

	/**
	 * Gets the indexable type.
	 *
	 * @return string Returns the indexable type.
	 */
	public function get_indexable_type(): string {
		return $this->indexable_type;
	}

	/**
	 * Gets the count.
	 *
	 * @return int Returns the amount of missing indexables.
	 */
	public function get_count(): int {
		return $this->count;
	}
}
