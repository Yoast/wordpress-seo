<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Taxonomies sitemap settings', 'wordpress-seo' ) . '</h2>';

/**
 * Filter the taxonomies to present in interface for exclusion.
 *
 * @param array $taxonomies Array of taxonomy objects.
 */
$taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', get_taxonomies( array( 'public' => true ), 'objects' ) );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	foreach ( $taxonomies as $tax ) {
		// Explicitly hide all the core taxonomies we never want in our sitemap.
		if ( in_array( $tax->name, array( 'link_category', 'nav_menu' ), true ) ) {
			continue;
		}

		$title_options = WPSEO_Options::get_option( 'wpseo_titles' );

		if ( 'post_format' === $tax->name && ! empty( $title_options['disable-post_format'] ) ) {
			continue;
		}

		if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) !== '' ) {
			$yform->toggle_switch(
				'taxonomies-' . $tax->name . '-not_in_sitemap',
				$switch_values,
				$tax->labels->name . ' (<code>' . $tax->name . '</code>)'
			);
		}
	}
}
