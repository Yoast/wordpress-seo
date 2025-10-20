<?php

namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain;

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
	 * Converts the schema piece to a schema.org  array.
	 *
	 * @return array<string, string|int|bool> The schema.org array representation.
	 */
	public function to_schema_array(): array {
		return [
			'@type' => $this->type,
			...$this->data,
		];
	}

	/**
	 * Encodes the schema piece in JSON-LD format.
	 *
	 * @return string The JSON-LD representation.
	 */
	public function to_json_ld(): string {
		$schema_array = $this->to_schema_array();
		return WPSEO_Utils::format_json_encode( $schema_array );
	}

	/**
	 * Converts multiple schema pieces to a JSON-LD-encoded graph.
	 *
	 * @param Schema_Piece[] $schema_pieces Array of schema pieces.
	 * @return string The JSON-LD graph representation.
	 */
	public static function to_json_ld_graph( array $schema_pieces ): string {
		$graph = [];
		foreach ( $schema_pieces as $piece ) {
			if ( $piece instanceof self ) {
				$graph[] = $piece->to_schema_array();
			}
		}

		$schema_graph = [
			'@context' => 'https://schema.org',
			'@graph'   => $graph,
		];

		return WPSEO_Utils::format_json_encode( $schema_graph );
	}
}
