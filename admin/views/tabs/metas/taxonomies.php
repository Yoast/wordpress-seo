<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

//$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
//if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
//	foreach ( $taxonomies as $tax ) {
//
//		// Explicitly hide all the core taxonomies we never want to do stuff for.
//		if ( in_array( $tax->name, array( 'link_category', 'nav_menu' ), true ) ) {
//			continue;
//		}
//		$presenter = new WPSEO_presenter_paper(
//			$tax->labels->name,
//			dirname( __FILE__ ) . '/taxonomies/taxonomy.php',
//			array(
//				'collapsible' => true,
//				'expanded' => true,
//				'paper_id' => $tax->name,
//			)
//		);
//		echo $presenter->render();
//		/**
//		 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab
//		 *
//		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
//		 * @api  Object             $tax    The taxonomy
//		 */
//		do_action( 'wpseo_admin_page_meta_taxonomies', $yform, $tax );
//	}
//unset( $tax );
//}
//unset( $taxonomies );
//
//$presenter = new WPSEO_presenter_paper(
//	esc_html__( ' Category URLs', 'wordpress-seo' ),
//	dirname( __FILE__ ) . '/taxonomies/category-url.php',
//	array(
//		'collapsible' => true,
//		'expanded' => true,
//		'' => ''
//	)
//);
