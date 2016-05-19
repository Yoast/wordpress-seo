<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$switch_values = array(
	'off' => __( 'In sitemap', 'wordpress-seo' ),
	'on'  => __( 'Not in sitemap', 'wordpress-seo' ),
);

/**
 * Filter the post types to present in interface for exclusion.
 *
 * @param array $post_types Array of post type objects.
 */
$post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', get_post_types( array( 'public' => true ), 'objects' ) );
if ( is_array( $post_types ) && $post_types !== array() ) {
	foreach ( $post_types as $pt ) {
		$yform->toggle_switch(
			'post_types-' . $pt->name . '-not_in_sitemap',
			$switch_values,
			$pt->labels->name . ' (<code>' . $pt->name . '</code>)'
		);
	}
}

