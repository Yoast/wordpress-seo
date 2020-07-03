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


$plural_label = $wpseo_post_type->labels->name;

$yform->index_switch(
	'noindex-ptarchive-' . $wpseo_post_type->name,
	sprintf(
	/* translators: %s expands to the post type's name. */
		__( 'the archive for %s', 'wordpress-seo' ),
		$plural_label
	),
	$view_utils->search_results_setting_help()
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
	echo '<h3>' . __( 'Breadcrumb settings', 'wordpress-seo' ) . '</h3>';
	$yform->textinput( 'bctitle-ptarchive-' . $wpseo_post_type->name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
}
