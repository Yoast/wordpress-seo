<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$wpseo_taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
if ( is_array( $wpseo_taxonomies ) && $wpseo_taxonomies !== array() ) {
	$view_utils                   = new Yoast_View_Utils();
	$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
	$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();

	// Explicitly hide all the core taxonomies we never want to do stuff for.
	$wpseo_taxonomies = array_diff_key( $wpseo_taxonomies, array_flip( array( 'link_category', 'nav_menu' ) ) );

	foreach ( array_values( $wpseo_taxonomies ) as $wpseo_taxonomy_index => $wpseo_taxonomy ) {
		$wpseo_taxonomy_presenter = new WPSEO_Paper_Presenter(
			$wpseo_taxonomy->labels->name,
			dirname( __FILE__ ) . '/paper-content/taxonomy-content.php',
			array(
				'collapsible' => true,
				'expanded'    => ( $wpseo_taxonomy_index === 0 ),
				'paper_id'    => $wpseo_taxonomy->name,
				'view_data'   => array(
					'wpseo_taxonomy'               => $wpseo_taxonomy,
					'view_utils'                   => $view_utils,
					'recommended_replace_vars'     => $recommended_replace_vars,
					'editor_specific_replace_vars' => $editor_specific_replace_vars,
				),
				'title_after' => ' (<code>' . esc_html( $wpseo_taxonomy->name ) . '</code>)',
			)
		);
		echo $wpseo_taxonomy_presenter->get_output();
	}

	unset( $wpseo_taxonomy_index, $wpseo_taxonomy_presenter, $view_utils, $recommended_replace_vars );
}

unset( $wpseo_taxonomies );

printf( '<h2>%s</h2>', esc_html__( 'Category URLs', 'wordpress-seo' ) );
require dirname( __FILE__ ) . '/taxonomies/category-url.php';
