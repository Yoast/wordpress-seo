<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

use WPSEO_Utils;

/**
 * Represents a piece of schema.org data.
 */
class Schema_Piece {

	/**
	 * The type of the schema piece.
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * The data of the schema piece.
	 *
	 * @var array<string, string|int|bool>
	 */
	protected $data;

	/**
	 * Class constructor.
	 *
	 * @param array<string, string|int|bool> $data The data of the schema piece.
	 * @param string                         $type The type of the schema piece.
	 */
	public function __construct( array $data, string $type ) {
		$this->data = $data;
		$this->type = $type;
	}

	/**
	 * Gets the type of the schema piece.
	 *
	 * @return string The type of the schema piece.
	 */
	public function get_type(): string {
		return $this->type;
	}

	/**
	 * Gets the data of the schema piece.
	 *
	 * @return array<string, string|int|bool> The data of the schema piece.
	 */
	public function get_data(): array {
		return $this->data;
	}

	/**
	 * Gets the ID of the schema piece.
	 *
	 * @return string|null The ID of the schema piece, or null if not set.
	 */
	public function get_id(): ?string {
		return $this->data['@id'] ?? null;
	}

	/**
	 * Converts multiple schema pieces to a JSON-LD-encoded graph.
	 *
	 * @param Schema_Piece[] $schema_pieces Array of schema pieces.
	 *
	 * @return array<string, string|int|bool> The JSON-LD graph representation.
	 */
	public  function to_json_ld_graph(): array {
		return [
			'@context' => 'https://schema.org',
			'@graph'   => $this->data,
		];
	}
}
