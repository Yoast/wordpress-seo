<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Add primary term meta field.
 */
class Primary_Term_Metadata implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Initializes the integration.
	 *
	 * Add the primary term fields.
	 *
	 * @return void
	 */
	public function initialize() {
		/**
		 * Called by WPSEO_Meta to add extra meta fields to the ones defined there.
		 */
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_meta_field' ] );
		$taxonomies = $this->get_hierarchical_taxonomies_names();
		foreach ( $taxonomies as $taxonomy_name ) {
			\add_filter( 'wpseo_sanitize_post_meta_primary_' . $taxonomy_name, [ $this, 'sanitize_primary_term' ], 10, 4 );
		}
	}

	/**
	 * Get the hierarchical taxonomies.
	 *
	 * @return array<WP_Taxonomy> The hierarchical taxonomies.
	 */
	private function get_hierarchical_taxonomies_names() {
		return \get_taxonomies( [ 'hierarchical' => true ], 'names' );
	}

	/**
	 * Sanitize the primary term.
	 *
	 * @param int|string    $clean      The clean value to sanitize.
	 * @param int|string    $meta_value The meta value.
	 * @param array<string> $field_def  The field definition.
	 * @param string        $meta_key   The meta key.
	 *
	 * @return string The sanitized value.
	 */
	public function sanitize_primary_term( $clean, $meta_value, $field_def, $meta_key ) {
		$clean = '';
		if ( \strpos( $meta_key, WPSEO_Meta::$meta_prefix . 'primary_' ) === 0 ) {
			$int = WPSEO_Utils::validate_int( $meta_value );
			if ( $int !== false && $int > 0 ) {
				$clean = \strval( $int );
			}
		}
		return $clean;
	}

	/**
	 * Adds the primary term to general tab.
	 *
	 * @param array<string|array<string>> $fields The currently registered meta fields.
	 *
	 * @return array<string|array<string>> A new array with meta fields.
	 */
	public function add_meta_field( $fields ) {

		$taxonomies = \get_taxonomies( [ 'hierarchical' => true ], 'names' );
		foreach ( $taxonomies as $taxonomy_name ) {
			$fields['primary_terms'][ 'primary_' . $taxonomy_name ] = [
				'type'          => 'hidden',
				'title'         => '',
				'default_value' => '',
				'description'   => '',
			];
		}

		return $fields;
	}
}
