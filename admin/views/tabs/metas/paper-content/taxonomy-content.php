<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @uses Yoast_Form                               $yform                        Form object.
 * @uses WP_Taxonomy                              $wpseo_taxonomy
 * @uses Yoast_View_Utils                         $view_utils
 * @uses string                                   $title
 * @uses WPSEO_Admin_Recommended_Replace_Vars     $recommended_replace_vars
 * @uses WPSEO_Admin_Editor_Specific_Replace_Vars $editor_specific_replace_vars
 */

if ( $wpseo_taxonomy->name === 'post_format' ) {
	$yform->light_switch(
		'disable-post_format',
		__( 'Format-based archives', 'wordpress-seo' ),
		array( __( 'Enabled', 'wordpress-seo' ), __( 'Disabled', 'wordpress-seo' ) ),
		false
	);
}

echo "<div id='" . esc_attr( $wpseo_taxonomy->name ) . "-titles-metas'>";

$taxonomies_help = $view_utils->search_results_setting_help( $wpseo_taxonomy );

$yform->index_switch(
	'noindex-tax-' . $wpseo_taxonomy->name,
	$title,
	$taxonomies_help->get_button_html() . $taxonomies_help->get_panel_html()
);


// Determine the page type for the term, this is needed for the recommended replacement variables.
$page_type = $recommended_replace_vars->determine_for_term( $wpseo_taxonomy->name );

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	array(
		'title'                 => 'title-tax-' . $wpseo_taxonomy->name,
		'description'           => 'metadesc-tax-' . $wpseo_taxonomy->name,
		'page_type_recommended' => $recommended_replace_vars->determine_for_term( $wpseo_taxonomy->name ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_term( $wpseo_taxonomy->name ),
		'paper_style'           => false,
	)
);
$editor->render();

if ( $wpseo_taxonomy->name !== 'post_format' ) {
	/* translators: %1$s expands to Yoast SEO */
	$yform->show_hide_switch( 'display-metabox-tax-' . $wpseo_taxonomy->name, sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
}

/**
 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab
 *
 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
 * @api  Object             $tax    The taxonomy
 */
do_action( 'wpseo_admin_page_meta_taxonomies', $yform, $wpseo_taxonomy );

echo '</div>';
