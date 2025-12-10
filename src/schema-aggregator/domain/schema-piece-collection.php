<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Type-safe collection for Schema_Piece objects.
 */
class Schema_Piece_Collection {

	/**
	 * The schema pieces.
	 *
	 * @var array<Schema_Piece>
	 */
	private $pieces = [];

	/**
	 * Class constructor.
	 *
	 * @param array<Schema_Piece> $pieces Optional array of Schema_Piece objects.
	 */
	public function __construct( array $pieces = [] ) {
		foreach ( $pieces as $piece ) {
			$this->add( $piece );
		}
	}

	/**
	 * Adds a schema piece to the collection.
	 *
	 * @param Schema_Piece $piece The schema piece to add.
	 *
	 * @return void
	 */
	public function add( Schema_Piece $piece ): void {
		$this->pieces[] = $piece;
	}

	/**
	 * Gets all schema pieces as an array.
	 *
	 * @return array<Schema_Piece> The schema pieces.
	 */
	public function to_array(): array {
		return $this->pieces;
	}
}
