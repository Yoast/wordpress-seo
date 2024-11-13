<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomy_Filters;

use Yoast\WP\SEO\General\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\General\Domain\Taxonomy_Filters\Taxonomy_Filter_Interface;
use Yoast\WP\SEO\General\Infrastructure\Taxonomies\Taxonomies_Collector;

/**
 * The repository to get taxonomy filters.
 */
class Taxonomy_Filters_Repository {

	/**
	 * The taxonomies collector.
	 *
	 * @var Taxonomies_Collector
	 */
	private $taxonomies_collector;

	/**
	 * All taxonomy filters.
	 *
	 * @var Taxonomy_Filter_Interface[]
	 */
	private $taxonomy_filters;

	/**
	 * The constructor.
	 *
	 * @param Taxonomies_Collector      $taxonomies_collector The taxonomies collector.
	 * @param Taxonomy_Filter_Interface ...$taxonomy_filters  All taxonomy filters.
	 */
	public function __construct(
		Taxonomies_Collector $taxonomies_collector,
		Taxonomy_Filter_Interface ...$taxonomy_filters
	) {
		$this->taxonomies_collector = $taxonomies_collector;
		$this->taxonomy_filters     = $taxonomy_filters;
	}

	/**
	 * Returns a taxonomy based on a content type, by looking into taxonomy filters.
	 *
	 * @param string $content_type The content type.
	 *
	 * @return Taxonomy|null The taxonomy filter.
	 */
	public function get_taxonomy( string $content_type ): ?Taxonomy {
		foreach ( $this->taxonomy_filters as $taxonomy_filter ) {
			if ( $taxonomy_filter->get_filtered_content_type() === $content_type ) {
				return $this->taxonomies_collector->get_taxonomy( $taxonomy_filter->get_filtering_taxonomy(), $content_type );
			}
		}

		return null;
	}
}
