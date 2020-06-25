<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\PaperContent
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Taxonomy                              $wpseo_post_type
 * @uses Yoast_View_Utils                         $view_utils
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 * @uses WPSEO_Admin_Editor_Specific_Replace_Vars $editor_specific_replace_vars
 */

$noindex_option_name = 'noindex-' . $wpseo_post_type->name;

$yform->index_switch(
	$noindex_option_name,
	$wpseo_post_type->labels->name,
	$view_utils->search_results_setting_help()
);

$yform->show_hide_switch(
	'showdate-' . $wpseo_post_type->name,
	__( 'Date in Google Preview', 'wordpress-seo' )
);

$yform->show_hide_switch(
	'display-metabox-pt-' . $wpseo_post_type->name,
	/* translators: %s expands to an indexable object's name, like a post type or taxonomy */
	sprintf( __( 'Show SEO settings for %1$s', 'wordpress-seo' ), $wpseo_post_type->labels->name )
);

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'title-' . $wpseo_post_type->name,
		'description'           => 'metadesc-' . $wpseo_post_type->name,
		'page_type_recommended' => $recommended_replace_vars->determine_for_post_type( $wpseo_post_type->name ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_post_type( $wpseo_post_type->name ),
		'paper_style'           => false,
	]
);
$editor->render();
