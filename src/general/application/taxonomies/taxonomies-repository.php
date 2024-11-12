<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomies;

use WP_Taxonomy;
use Yoast\WP\SEO\General\Application\Taxonomy_Filters\Taxonomy_Filters_Repository;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy;

/**
 * The repository to get all content types.
 */
class Taxonomies_Repository {

	/**
	 * The taxonomy filters repository.
	 *
	 * @var Taxonomy_Filters_Repository
	 */
	private $taxonomy_filters_repository;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Filters_Repository $taxonomy_filters_repository The taxonomy filters repository.
	 */
	public function __construct(
		Taxonomy_Filters_Repository $taxonomy_filters_repository
	) {
		$this->taxonomy_filters_repository = $taxonomy_filters_repository;
	}

	/**
	 * Returns the object of the filtering taxonomy of a content type.
	 *
	 * @param string $content_type The content type the taxonomy filters.
	 *
	 * @return array<string, string> The filtering taxonomy of the content type.
	 */
	public function get_content_type_taxonomy( string $content_type ): array {
		// First we check if there's a filter that overrides the filtering taxonomy for this content type.

		/**
		 * Filter: 'wpseo_{$content_type}_filtering_taxonomy' - Allows overriding which taxonomy filters the content type.
		 *
		 * @param string $filtering_taxonomy The taxonomy that filters the content type.
		 */
		$filtering_taxonomy = \apply_filters( "wpseo_{$content_type}_filtering_taxonomy", '' );
		if ( $filtering_taxonomy !== '' ) {
			$taxonomy = \get_taxonomy( $filtering_taxonomy );

			if ( $this->is_taxonomy_valid( $taxonomy, $content_type ) ) {
				return $this->get_taxonomy_map( $taxonomy );
			}

			\_doing_it_wrong(
				'Filter: \'wpseo_{$content_type}_filtering_taxonomy\'',
				'The `wpseo_{$content_type}_filtering_taxonomy` filter should return a public taxonomy, available in REST API, that is associated with that content type.',
				'YoastSEO v24.1'
			);
		}

		// Then we check if we have made an explicit filter for this content type.
		$taxonomy_filters = $this->taxonomy_filters_repository->get_taxonomy_filters();
		foreach ( $taxonomy_filters as $taxonomy_filter ) {
			if ( $taxonomy_filter->get_filtered_content_type() === $content_type ) {
				$taxonomy = \get_taxonomy( $taxonomy_filter->get_filtering_taxonomy() );

				if ( $this->is_taxonomy_valid( $taxonomy, $content_type ) ) {
					return $this->get_taxonomy_map( $taxonomy );
				}
			}
		}

		// As a fallback, we check if the content type has a category taxonomy and we make it the filtering taxonomy if so.
		$taxonomy = \get_taxonomy( 'category' );
		if ( $this->is_taxonomy_valid( $taxonomy, $content_type ) ) {
			return $this->get_taxonomy_map( $taxonomy );
		}

		return [];
	}

	/**
	 * Returns the map of the filtering taxonomy.
	 *
	 * @param WP_Taxonomy $taxonomy The taxonomy.
	 *
	 * @return array<string, string> The filtering taxonomy of the content type.
	 */
	private function get_taxonomy_map( WP_Taxonomy $taxonomy ): array {
		$taxonomy_instance = new Taxonomy( $taxonomy );
		return $taxonomy_instance->map_to_array();
	}

	/**
	 * Returns whether the taxonomy in question is valid and associated with a given content type.
	 *
	 * @param WP_Taxonomy|false $taxonomy     The taxonomy to check.
	 * @param string            $content_type The name of the content type to check.
	 *
	 * @return bool Whether the taxonomy in question is valid.
	 */
	private function is_taxonomy_valid( $taxonomy, $content_type ): bool {
		return \is_a( $taxonomy, 'WP_Taxonomy' )
			&& $taxonomy->public
			&& $taxonomy->show_in_rest
			&& \in_array( $taxonomy->name, \get_object_taxonomies( $content_type ), true );
	}
}
