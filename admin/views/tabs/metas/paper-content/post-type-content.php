<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Post_Type                             $wpseo_post_type
 * @uses Yoast_View_Utils                         $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 * @uses WPSEO_Admin_Editor_Specific_Replace_Vars $editor_specific_replace_vars
 */

$single_label = $wpseo_post_type->labels->singular_name;
$paper_style  = false;
$has_archive  = WPSEO_Post_Type::has_archive( $wpseo_post_type );

require __DIR__ . '/post_type/post-type.php';

if ( $wpseo_post_type->name === 'product' && WPSEO_Utils::is_woocommerce_active() ) {
	require __DIR__ . '/post_type/woocommerce-shop-page.php';

	return;
}

/**
 * Allow adding a custom checkboxes to the admin meta page - Post Types tab.
 *
 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
 * @api  String  $name  The post type name
 */
do_action( 'wpseo_admin_page_meta_post_types', $yform, $wpseo_post_type->name );
