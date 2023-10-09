<?php

namespace Yoast\WP\SEO\Integrations;

/**
 * Abstract class for excluding certain taxonomies from being indexed.
 */
abstract class Abstract_Exclude_Taxonomy implements Integration_Interface {

	/**
	 * Initializes the integration.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_indexable_excluded_taxonomies', [ $this, 'exclude_taxonomies' ] );
	}

	/**
	 * Exclude the taxonomy from the indexable table.
	 *
	 * @param array $excluded_taxonomies The excluded taxonomies.
	 *
	 * @return array The excluded taxonomies, including the specific taxonomy.
	 */
	public function exclude_taxonomies( $excluded_taxonomies ) {
		return \array_merge( $excluded_taxonomies, $this->get_taxonomy() );
	}

	/**
	 * This integration is only active when the child class's conditionals are met.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Returns the names of the taxonomies to be excluded.
	 * To be used in the wpseo_indexable_excluded_taxonomies filter.
	 *
	 * @return array The names of the taxonomies.
	 */
	abstract public function get_taxonomy();
}
