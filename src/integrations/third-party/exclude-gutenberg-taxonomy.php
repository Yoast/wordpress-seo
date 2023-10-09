<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Integrations\Abstract_Exclude_Taxonomy;

/**
 * Excludes certain Elementor-specific taxonomies from the indexable table.
 *
 * Posts with these taxonomies will not be saved to the indexable table.
 */
class Exclude_Gutenberg_Taxonomy extends Abstract_Exclude_Taxonomy {

	/**
	 * Returns the names of the taxonomies to be excluded.
	 * To be used in the wpseo_indexable_excluded_taxonomies filter.
	 *
	 * @return array The names of the taxonomies.
	 */
	public function get_taxonomy() {
		return [ 'wp_pattern_category' ];
	}
}
