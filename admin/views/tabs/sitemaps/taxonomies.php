<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Filter the taxonomies to present in interface for exclusion.
 *
 * @param array $taxonomies Array of taxonomy objects.
 */
$taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', get_taxonomies( array( 'public' => true ), 'objects' ) );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	foreach ( $taxonomies as $tax ) {
		// Explicitly hide all the core taxonomies we never want in our sitemap.
		if ( in_array( $tax->name, array( 'link_category', 'nav_menu' ) ) ) {
			continue;
		}

		$all_options = WPSEO_Options::get_all();

		if ( 'post_format' === $tax->name && ! empty( $all_options['disable-post_format'] ) ) {
			continue;
		}

		if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' ) {
			$yform->toggle_switch(
				'taxonomies-' . $tax->name . '-not_in_sitemap',
				$switch_values,
				$tax->labels->name . ' (<code>' . $tax->name . '</code>)'
			);
		}
	}
}
