<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomies;

use Yoast\WP\SEO\General\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy_Map;
use Yoast\WP\SEO\General\Domain\Taxonomy_Filters\Taxonomy_Filter_Interface;

/**
 * The repository to get all content types.
 *
 * @makePublic
 */
class Taxonomies_Repository {

	/**
	 * The map of the taxonomy.
	 *
	 * @var Taxonomy_Map
	 */
	private $taxonomy_map;

	/**
	 * The taxonomy filter repository.
	 *
	 * @var Taxonomy_Filter_Interface[]
	 */
	private $taxonomy_filters;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Map              $taxonomy_map        The taxonomy map.
	 * @param Taxonomy_Filter_Interface ...$taxonomy_filters All taxonomies.
	 */
	public function __construct(
		Taxonomy_Map $taxonomy_map,
		Taxonomy_Filter_Interface ...$taxonomy_filters
	) {
		$this->taxonomy_map     = $taxonomy_map;
		$this->taxonomy_filters = $taxonomy_filters;
	}

	/**
	 * Returns the object of the filtering taxonomy of a content type.
	 *
	 * @param Content_Type $content_type The content type the taxonomy filters.
	 *
	 * @return array<string, string> The filtering taxonomy of the content type.
	 */
	public function get_content_type_taxonomy( Content_Type $content_type ): array {
		// @TODO: First we check if there's a filter that overrides the filtering taxonomy for this content type.

		// Then we check if we have made an explicit filter for this content type.
		// @TODO: Maybe: $taxonomy_filters = $this->taxonomy_filters_repository->get_taxonomy_filters( $content_type );.
		foreach ( $this->taxonomy_filters as $taxonomy_filter ) {
			if ( $taxonomy_filter->get_filtered_content_type() === $content_type->get_name() ) {
				$taxonomy = \get_taxonomy( $taxonomy_filter->get_filtering_taxonomy() );
				if ( \is_a( $taxonomy, 'WP_Taxonomy' ) ) {
					$taxonomy_instance = new Taxonomy( $taxonomy->name, $taxonomy->label );
					$this->taxonomy_map->add_taxonomy( $taxonomy_instance );

					return $this->taxonomy_map->map_to_array();
				}
			}
		}

		// As a fallback, we check if the content type has a category taxonomy and we make it the filtering taxonomy if so.
		if ( \in_array( 'category', \get_object_taxonomies( $content_type->get_name() ), true ) ) {
			$taxonomy_instance = new Taxonomy( 'category', \__( 'Category', 'wordpress-seo' ) );
			$this->taxonomy_map->add_taxonomy( $taxonomy_instance );
			return $this->taxonomy_map->map_to_array();
		}

		return [];
	}
}
