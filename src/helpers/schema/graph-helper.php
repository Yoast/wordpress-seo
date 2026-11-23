<?php

namespace Yoast\WP\SEO\Helpers\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Reads pieces out of a generated Schema graph.
 *
 * Pieces are recognized by the IDs the schema generators give them rather than by their types, as the types are what
 * varies per page and can be changed by filters.
 */
class Graph_Helper {

	/**
	 * Returns the pieces of a Schema graph.
	 *
	 * @param array<string, string|array<array<string, string|array<string|array<string, string>>>>>|string|bool|null $schema The Schema, as output on the front end, in whatever shape a filter left it.
	 *
	 * @return array<array<string, string|array<string|array<string, string>>>> The graph pieces.
	 */
	public function get_pieces( $schema ): array {
		// The `wpseo_schema_graph` filter can return any shape, so only well-formed pieces are read.
		if ( ! \is_array( $schema ) || ! isset( $schema['@graph'] ) || ! \is_array( $schema['@graph'] ) ) {
			return [];
		}

		return \array_filter( $schema['@graph'], 'is_array' );
	}

	/**
	 * Returns the WebPage piece of a page, whose ID is the main Schema ID of the page.
	 *
	 * @param array<array<string, string|array<string|array<string, string>>>> $pieces         The graph pieces.
	 * @param string|null                                                      $main_schema_id The main Schema ID of the page.
	 *
	 * @return array<string, string|array<string|array<string, string>>>|null The WebPage piece, or null when there is none.
	 */
	public function get_webpage_piece( array $pieces, $main_schema_id ): ?array {
		foreach ( $pieces as $piece ) {
			if ( ( $piece['@id'] ?? null ) === $main_schema_id ) {
				return $piece;
			}
		}

		return null;
	}

	/**
	 * Returns the Article piece of a page.
	 *
	 * The ID of the Article piece is the canonical URL followed by `#article`, and it points to the WebPage piece of the
	 * page through `isPartOf`. The ID is not rebuilt from the canonical URL, as the rendered canonical is filtered and
	 * can differ from it.
	 *
	 * @param array<array<string, string|array<string|array<string, string>>>> $pieces         The graph pieces.
	 * @param string|null                                                      $main_schema_id The main Schema ID of the page.
	 *
	 * @return array<string, string|array<string|array<string, string>>>|null The Article piece, or null when there is none.
	 */
	public function get_article_piece( array $pieces, $main_schema_id ): ?array {
		foreach ( $pieces as $piece ) {
			$id = ( $piece['@id'] ?? null );

			if ( ! \is_string( $id ) ) {
				continue;
			}

			$has_article_id     = \substr( $id, -\strlen( Schema_IDs::ARTICLE_HASH ) ) === Schema_IDs::ARTICLE_HASH;
			$is_part_of_webpage = ( $piece['isPartOf']['@id'] ?? null ) === $main_schema_id;

			if ( $has_article_id && $is_part_of_webpage ) {
				return $piece;
			}
		}

		return null;
	}

	/**
	 * Returns the types of a graph piece, which the front end outputs as either a single type or a list of types, as a list.
	 *
	 * @param array<string, string|array<string|array<string, string>>> $piece The graph piece.
	 *
	 * @return array<string> The types.
	 */
	public function get_types( array $piece ): array {
		// Filters can return any shape, so keep only non-empty strings and drop keys to always return a list of type names.
		return \array_values(
			\array_filter(
				(array) ( $piece['@type'] ?? null ),
				static function ( $type ) {
					return \is_string( $type ) && $type !== '';
				},
			),
		);
	}
}
