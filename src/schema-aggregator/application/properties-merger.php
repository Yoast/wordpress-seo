<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;

/**
 * Merges properties of two schema pieces with the same @id.
 */
class Properties_Merger {

	/**
	 * Merges two Schema_Pieces into one by merging their properties.
	 *
	 * @param Schema_Piece $piece1 First schema piece.
	 * @param Schema_Piece $piece2 Second schema piece.
	 *
	 * @return Schema_Piece Merged schema piece.
	 */
	public function merge( Schema_Piece $piece1, Schema_Piece $piece2 ): Schema_Piece {
		$merged_properties = $this->merge_properties( $piece1->get_data(), $piece2->get_data() );
		// TODO: Shall we check if $type !== null?
		return new Schema_Piece( $merged_properties, $merged_properties['@type'] );
	}

	/**
	 * Merge properties from two schema entities with the same @id
	 *
	 * Strategy:
	 * - @type: Special handling - merge types into unified array
	 * - @id: Skip (always the same)
	 * - Arrays: Combine unique values
	 * - Scalars: Prefer non-empty over empty
	 * - Objects: Deep merge recursively
	 * - Null vs value: Prefer non-null
	 *
	 * @param array<string, string|int|bool> $entity1 First entity.
	 * @param array<string, string|int|bool> $entity2 Second entity.
	 *
	 * @return array<string, string|int|bool> Merged entity.
	 */
	private function merge_properties( array $entity1, array $entity2 ): array {
		$merged = $entity1;

		foreach ( $entity2 as $key => $value ) {

			if ( $key === '@id' ) {
				continue;
			}

			// Special handling for @type - merge types (JSON-LD allows multiple types).
			if ( $key === '@type' ) {
				$merged['@type'] = $this->merge_types(
					( $merged['@type'] ?? null ),
					$value,
				);
				continue;
			}

			if ( ! isset( $merged[ $key ] ) || $merged[ $key ] === '' ) {

				$merged[ $key ] = $value;
			}
			elseif ( \is_array( $merged[ $key ] ) && \is_array( $value ) ) {
				// Both are arrays - check if associative (object) or indexed (list).
				if ( $this->is_associative_array( $merged[ $key ] ) || $this->is_associative_array( $value ) ) {
					// Deep merge objects.
					$merged[ $key ] = $this->merge_properties( $merged[ $key ], $value );
				}
				else {
					// Combine arrays and get unique values.
					$merged[ $key ] = \array_values( \array_unique( \array_merge( $merged[ $key ], $value ), \SORT_REGULAR ) );
				}
			}
			// Else: entity1's value is non-empty scalar, keep it (prefer first occurrence).
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
	 * @param string|array<string>|null $type1 First @type value.
	 * @param string|array<string>|null $type2 Second @type value.
	 * @return string|array<string> Merged and normalized @type value.
	 */
	private function merge_types( $type1, $type2 ) {

		$types1 = $this->normalize_type_to_array( $type1 );
		$types2 = $this->normalize_type_to_array( $type2 );

		$merged = \array_unique( \array_merge( $types1, $types2 ), \SORT_REGULAR );

		return $this->normalize_type_from_array( $merged );
	}

	/**
	 * Normalize @type value to array format
	 *
	 * @param string|array<string>|null $type Type value to normalize.
	 * @return array<string> Array of type strings.
	 */
	private function normalize_type_to_array( $type ): array {
		if ( $type === null ) {
			return [];
		}

		if ( \is_string( $type ) ) {
			return [ $type ];
		}

		if ( \is_array( $type ) ) {

			return \array_values( \array_filter( $type, 'is_string' ) );
		}

		return [];
	}

	/**
	 * Normalize array of types back to string or array.
	 *
	 * Returns string if single type, array if multiple types.
	 * This keeps the output compact while supporting multi-type entities.
	 *
	 * @param array<string> $types Array of type strings.
	 * @return string|array<string> Normalized type value.
	 */
	private function normalize_type_from_array( array $types ) {
		// Remove duplicates and re-index.
		$types = \array_values( \array_unique( $types ) );

		if ( empty( $types ) ) {
			// Fallback - should not happen in normal flow.
			return 'Thing'; // schema.org root type.
		}

		if ( \count( $types ) === 1 ) {
			return $types[0];
		}

		return $types;
	}

	/**
	 * Check if array is associative (object-like) vs indexed (list-like)
	 *
	 * @param array<string|int, string|int|bool|array<string|int|bool>> $argument Array to check.
	 * @return bool True if associative.
	 */
	private function is_associative_array( array $argument ): bool {
		if ( empty( $argument ) ) {
			return false;
		}
		return \array_keys( $argument ) !== \range( 0, ( \count( $argument ) - 1 ) );
	}
}
