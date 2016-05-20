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
		/**
		 * Allow adding custom checkboxes to the admin sitemap page - Post Types tab
		 *
		 * @api  Yoast_Form  $yform  The Yoast_Form object
		 * @api  Object  $pt  The post type
		 */
		do_action( 'wpseo_admin_page_sitemap_post_types', $yform, $pt );
	}
}

