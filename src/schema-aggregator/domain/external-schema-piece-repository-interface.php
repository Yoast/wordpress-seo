<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Interface for external schema piece repositories.
 *
 * Implementations provide schema pieces from external sources (e.g., WooCommerce, EDD).
 */
interface External_Schema_Piece_Repository_Interface {

	/**
	 * Checks if this repository supports the given post type.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return bool True if this repository can provide schema for the post type.
	 */
	public function supports( string $post_type ): bool;

	/**
	 * Collects external schema pieces for the given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return array<array<string,string|int|bool|array>> The schema pieces (always an array, may be empty).
	 */
	public function collect( int $post_id ): array;
}
