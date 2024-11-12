<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\General\Application\Taxonomy_Filters;

use WP_Taxonomy;
use Yoast\WP\SEO\General\Domain\Taxonomy_Filters\Taxonomy_Filter_Interface;

/**
 * The repository to get taxonomy filters.
 */
class Taxonomy_Filters_Repository {

	/**
	 * All taxonomy filters.
	 *
	 * @var Taxonomy_Filter_Interface[]
	 */
	private $taxonomy_filters;

	/**
	 * The constructor.
	 *
	 * @param Taxonomy_Filter_Interface ...$taxonomy_filters All taxonomy filters.
	 */
	public function __construct(
		Taxonomy_Filter_Interface ...$taxonomy_filters
	) {
		$this->taxonomy_filters = $taxonomy_filters;
	}

	/**
	 * Returns a taxonomy filter based on a content type.
	 *
	 * @param string $content_type The content type.
	 *
	 * @return WP_Taxonomy|false The taxonomy filter.
	 */
	public function get_taxonomy_filter( string $content_type ) {
		foreach ( $this->taxonomy_filters as $taxonomy_filter ) {
			if ( $taxonomy_filter->get_filtered_content_type() === $content_type ) {
				$taxonomy = \get_taxonomy( $taxonomy_filter->get_filtering_taxonomy() );

				return $taxonomy;
			}
		}

		return false;
	}
}
