<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomies;

use Yoast\WP\SEO\General\Application\Taxonomy_Filters\Taxonomy_Filters_Repository;
use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\General\Infrastructure\Taxonomies\Taxonomies_Collector;

/**
 * The repository to get taxonomies.
 */
class Taxonomies_Repository {

	/**
	 * The taxonomies collector.
	 *
	 * @var Taxonomies_Collector
	 */
	private $taxonomies_collector;

	/**
	 * The taxonomy filters repository.
	 *
	 * @var Taxonomy_Filters_Repository
	 */
	private $taxonomy_filters_repository;

	/**
	 * The constructor.
	 *
	 * @param Taxonomies_Collector        $taxonomies_collector        The taxonomies collector.
	 * @param Taxonomy_Filters_Repository $taxonomy_filters_repository The taxonomy filters repository.
	 */
	public function __construct(
		Taxonomies_Collector $taxonomies_collector,
		Taxonomy_Filters_Repository $taxonomy_filters_repository
	) {
		$this->taxonomies_collector        = $taxonomies_collector;
		$this->taxonomy_filters_repository = $taxonomy_filters_repository;
	}

	/**
	 * Returns the object of the filtering taxonomy of a content type.
	 *
	 * @param string $content_type The content type that the taxonomy filters.
	 *
	 * @return Taxonomy|null The filtering taxonomy of the content type.
	 */
	public function get_content_type_taxonomy( string $content_type ) {
		// First we check if there's a filter that overrides the filtering taxonomy for this content type.
		$taxonomy = $this->taxonomies_collector->get_custom_filtering_taxonomy( $content_type );
		if ( $taxonomy ) {
			return $taxonomy;
		}

		// Then we check if there is a filter explicitly made for this content type.
		$taxonomy = $this->taxonomy_filters_repository->get_taxonomy( $content_type );
		if ( $taxonomy ) {
			return $taxonomy;
		}

		// If everything else returned empty, we can always try the fallback taxonomy.
		return $this->taxonomies_collector->get_fallback_taxonomy( $content_type );
	}
}
