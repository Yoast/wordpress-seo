<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Represents a piece of schema.org data.
 */
class Schema_Piece {

	/**
	 * The type(s) of the schema piece.
	 *
	 * @var string|array<string>
	 */
	private $type;

	/**
	 * The data of the schema piece.
	 *
	 * @var array<string, string|int|bool>
	 */
	private $data;

	/**
	 * Class constructor.
	 *
	 * @param array<string, string|int|bool> $data The data of the schema piece.
	 * @param string|array<string>           $type The type of the schema piece.
	 */
	public function __construct( array $data, $type ) {
		$this->data = $data;
		$this->type = $type;
	}

	/**
	 * Gets the type of the schema piece.
	 *
	 * @return string|array<string> The type(s) of the schema piece.
	 */
	public function get_type() {
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
		return ( $this->data['@id'] ?? null );
	}

	/**
	 * Converts multiple schema pieces to a JSON-LD-encoded graph.
	 *
	 * @return array<string, string|int|bool> The JSON-LD graph representation.
	 */
	public function to_json_ld_graph(): array {
		return [
			'@context' => 'https://schema.org',
			'@graph'   => $this->data,
		];
	}
}
