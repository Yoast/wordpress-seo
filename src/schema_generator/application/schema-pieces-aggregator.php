<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application;

use Yoast\WP\SEO\NLWeb\Schema_Aggregator\Domain\Schema_Piece;
class Schema_Pieces_Aggregator {

	/**
	 * This class is responsible for taking an array of Schema_Pieces and return another array of Schema_Pieces where:
	 * 1. Schema_Pieces are deduplicated by using the id property
	 * 2. if a copy of the same Schema_Piece exists, properties are merged together
	 *
	 * @param array<Schema_Piece> $schema_pieces The schema pieces to aggregate.
	 */
	public function aggregate( array $schema_pieces ): array {
		$aggregated_schema = [];

		foreach ( $schema_pieces as $piece ) {
			$data = $piece->get_data();
			$type = $piece->get_type();
			$id   = $piece->get_id();
			if ( \is_null( $id ) ) {
				continue;
			}

			if ( isset( $aggregated_schema[ $id ] ) ) {
				// Merge properties if the piece already exists.
				$aggregated_schema[ $id ] = new Schema_Piece( $this->merge_properties( $aggregated_schema[ $id ]->get_data(), $data ), $type );

			}
			else {
				// Add new piece.
				$aggregated_schema[ $id ] = new Schema_Piece( $data, $type );
			}
		}

		// Return only the values to get rid of the keys (which are @id).
		return \array_values( $aggregated_schema );
	}

	/**
	 * Merge properties from two schema entities with the same @id
	 *
	 * Strategy (FR-012):
	 * - @type: Special handling - merge types into unified array
	 * - @id: Skip (always the same)
	 * - Arrays: Combine unique values
	 * - Scalars: Prefer non-empty over empty
	 * - Objects: Deep merge recursively
	 * - Null vs value: Prefer non-null
	 *
	 * @param array $entity1 First entity.
	 * @param array $entity2 Second entity.
	 * @return array Merged entity.
	 */
	private function merge_properties( array $entity1, array $entity2 ): array {
		$merged = $entity1;

		foreach ( $entity2 as $key => $value ) {
			// Skip @id - these should always be the same
			if ( $key === '@id' ) {
				continue;
			}

			// Special handling for @type - merge types (JSON-LD allows multiple types)
			if ( $key === '@type' ) {
				$merged['@type'] = $this->merge_types(
					$merged['@type'] ?? null,
					$value
				);
				continue;
			}

			if ( ! isset( $merged[ $key ] ) || $merged[ $key ] === '' ) {
				// Property doesn't exist in entity1 or is empty - use entity2's value
				$merged[ $key ] = $value;
			}
			elseif ( \is_array( $merged[ $key ] ) && \is_array( $value ) ) {
				// Both are arrays - check if associative (object) or indexed (list)
				if ( $this->is_associative_array( $merged[ $key ] ) || $this->is_associative_array( $value ) ) {
					// Deep merge objects
					$merged[ $key ] = $this->merge_properties( $merged[ $key ], $value );
				}
				else {
					// Combine arrays and get unique values
					$merged[ $key ] = \array_values( \array_unique( \array_merge( $merged[ $key ], $value ), \SORT_REGULAR ) );
				}
			}
			// Else: entity1's value is non-empty scalar, keep it (prefer first occurrence)
		}

		return $merged;
	}

	/**
	 * Merge @type values from two entities
	 *
	 * JSON-LD allows @type to be either a string or an array of strings.
	 * This method combines types from both entities, deduplicates them,
	 * and normalizes the result (string if 1 type, array if multiple).
	 *
	 * Examples:
	 * - merge_types("Person", "Person") → "Person"
	 * - merge_types("Person", "Author") → ["Person", "Author"]
	 * - merge_types("Person", ["Author", "Employee"]) → ["Person", "Author", "Employee"]
	 * - merge_types(["Person"], "Person") → "Person"
	 * - merge_types(["Person", "Author"], ["Author", "Employee"]) → ["Person", "Author", "Employee"]
	 *
	 * @param string|array|null $type1 First @type value.
	 * @param string|array|null $type2 Second @type value.
	 * @return string|array Merged and normalized @type value.
	 */
	private function merge_types( $type1, $type2 ) {
		// Normalize both to arrays
		$types1 = $this->normalize_type_to_array( $type1 );
		$types2 = $this->normalize_type_to_array( $type2 );

		// Combine and deduplicate
		$merged = \array_unique( \array_merge( $types1, $types2 ), \SORT_REGULAR );

		// Normalize result: string if 1 type, array if multiple
		return $this->normalize_type_from_array( $merged );
	}

	/**
	 * Normalize @type value to array format
	 *
	 * @param string|array|null $type Type value to normalize.
	 * @return array Array of type strings.
	 */
	private function normalize_type_to_array( $type ): array {
		if ( $type === null ) {
			return [];
		}

		if ( \is_string( $type ) ) {
			return [ $type ];
		}

		if ( \is_array( $type ) ) {
			// Filter out non-strings for safety
			return \array_values( \array_filter( $type, 'is_string' ) );
		}

		// Invalid type format
		\error_log( 'Yoast NLWeb Aggregator: Invalid @type format: ' . \gettype( $type ) );
		return [];
	}

	/**
	 * Normalize array of types back to string or array
	 *
	 * Returns string if single type, array if multiple types.
	 * This keeps the output compact while supporting multi-type entities.
	 *
	 * @param array $types Array of type strings.
	 * @return string|array Normalized type value.
	 */
	private function normalize_type_from_array( array $types ) {
		// Remove duplicates and re-index
		$types = \array_values( \array_unique( $types ) );

		if ( empty( $types ) ) {
			// Fallback - should not happen in normal flow
			return 'Thing'; // schema.org root type
		}

		if ( \count( $types ) === 1 ) {
			return $types[0]; // Return as string for single type
		}

		return $types; // Return as array for multiple types
	}

	/**
	 * Check if array is associative (object-like) vs indexed (list-like)
	 *
	 * @param array $array Array to check.
	 * @return bool True if associative.
	 */
	private function is_associative_array( array $array ): bool {
		if ( empty( $array ) ) {
			return false;
		}
		return \array_keys( $array ) !== \range( 0, ( \count( $array ) - 1 ) );
	}
}
