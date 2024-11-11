<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomies;

use Yoast\WP\SEO\General\Application\Taxonomy_Filters\Taxonomy_Filters_Repository;
use Yoast\WP\SEO\General\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy_Map;

/**
 * The repository to get all content types.
 */
class Taxonomies_Repository {

	/**
	 * The map of the taxonomy.
	 *
	 * @var Taxonomy_Map
	 */
	private $taxonomy_map;

	/**
	 * The taxonomy filters repository.
	 *
	 * @var Taxonomy_Filters_Repository
	 */
	private $taxonomy_filters_repository;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Map                $taxonomy_map                The taxonomy map.
	 * @param Taxonomy_Filters_Repository $taxonomy_filters_repository The taxonomy filters repository.
	 */
	public function __construct(
		Taxonomy_Map $taxonomy_map,
		Taxonomy_Filters_Repository $taxonomy_filters_repository
	) {
		$this->taxonomy_map                = $taxonomy_map;
		$this->taxonomy_filters_repository = $taxonomy_filters_repository;
	}

	/**
	 * Returns the object of the filtering taxonomy of a content type.
	 *
	 * @param Content_Type $content_type The content type the taxonomy filters.
	 *
	 * @return array<string, string> The filtering taxonomy of the content type.
	 */
	public function get_content_type_taxonomy( Content_Type $content_type ): array {
		$content_type_name = $content_type->get_name();

		// First we check if there's a filter that overrides the filtering taxonomy for this content type.

		/**
		 * Filter: 'wpseo_{$content_type_name}_filtering_taxonomy' - Allows overriding which taxonomy filters the content type.
		 *
		 * @param string $filtering_taxonomy The taxonomy that filters the content type.
		 */
		$filtering_taxonomy = \apply_filters( "wpseo_{$content_type_name}_filtering_taxonomy", '' );
		if ( $filtering_taxonomy !== '' ) {
			$taxonomy = \get_taxonomy( $filtering_taxonomy );

			if ( $this->is_taxonomy_valid( $taxonomy, $content_type_name ) ) {
				return $this->get_taxonomy_map( $taxonomy->name, $taxonomy->label );
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
			if ( $taxonomy_filter->get_filtered_content_type() === $content_type_name ) {
				$taxonomy = \get_taxonomy( $taxonomy_filter->get_filtering_taxonomy() );

				if ( $this->is_taxonomy_valid( $taxonomy, $content_type_name ) ) {
					return $this->get_taxonomy_map( $taxonomy->name, $taxonomy->label );
				}
			}
		}

		// As a fallback, we check if the content type has a category taxonomy and we make it the filtering taxonomy if so.
		$taxonomy = \get_taxonomy( 'category' );

		if ( $this->is_taxonomy_valid( $taxonomy, $content_type_name ) ) {
			return $this->get_taxonomy_map( 'category', \__( 'Category', 'wordpress-seo' ) );
		}

		return [];
	}

	/**
	 * Returns the map of the filtering taxonomy.
	 *
	 * @param string $taxonomy_name  The name of the taxonomy.
	 * @param string $taxonomy_label The label of the taxonomy.
	 *
	 * @return array<string, string> The filtering taxonomy of the content type.
	 */
	private function get_taxonomy_map( string $taxonomy_name, string $taxonomy_label ): array {
		$taxonomy_instance = new Taxonomy( $taxonomy_name, $taxonomy_label );
		$this->taxonomy_map->add_taxonomy( $taxonomy_instance );
		return $this->taxonomy_map->map_to_array();
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
