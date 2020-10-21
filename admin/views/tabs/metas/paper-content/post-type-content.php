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

/* translators: %s is the singular version of the post type's name. */
echo '<h3>' . esc_html( sprintf( __( 'Settings for single %s URLs', 'wordpress-seo' ), $wpseo_post_type->labels->singular_name ) ) . '</h3>';

require __DIR__ . '/post_type/post-type.php';

if ( $wpseo_post_type->name === 'product' && YoastSEO()->helpers->woocommerce->is_active() ) {
	require __DIR__ . '/post_type/woocommerce-shop-page.php';

	return;
}

if ( WPSEO_Post_Type::has_archive( $wpseo_post_type ) ) {
	$plural_label = $wpseo_post_type->labels->name;

	/* translators: %s is the plural version of the post type's name. */
	echo '<h3>' . esc_html( sprintf( __( 'Settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h3>';

	$custom_post_type_archive_help = $view_utils->search_results_setting_help( $wpseo_post_type, 'archive' );

	$yform->index_switch(
		'noindex-ptarchive-' . $wpseo_post_type->name,
		sprintf(
			/* translators: %s expands to the post type's name. */
			__( 'the archive for %s', 'wordpress-seo' ),
			$plural_label
		),
		$custom_post_type_archive_help->get_button_html() . $custom_post_type_archive_help->get_panel_html()
	);

	$page_type = $recommended_replace_vars->determine_for_archive( $wpseo_post_type->name );

	$editor = new WPSEO_Replacevar_Editor(
		$yform,
		[
			'title'                 => 'title-ptarchive-' . $wpseo_post_type->name,
			'description'           => 'metadesc-ptarchive-' . $wpseo_post_type->name,
			'page_type_recommended' => $recommended_replace_vars->determine_for_archive( $wpseo_post_type->name ),
			'page_type_specific'    => $editor_specific_replace_vars->determine_for_archive( $wpseo_post_type->name ),
			'paper_style'           => false,
		]
	);
	$editor->render();

	if ( WPSEO_Options::get( 'breadcrumbs-enable' ) === true ) {
		/* translators: %s is the plural version of the post type's name. */
		echo '<h4>' . esc_html( sprintf( __( 'Breadcrumb settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h4>';
		$yform->textinput( 'bctitle-ptarchive-' . $wpseo_post_type->name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
	}
}

/**
 * Allow adding a custom checkboxes to the admin meta page - Post Types tab.
 *
 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
 * @api  String  $name  The post type name
 */
do_action( 'wpseo_admin_page_meta_post_types', $yform, $wpseo_post_type->name );
