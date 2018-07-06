<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @var Yoast_Form  $yform
 * @var WP_Taxonomy $wpseo_taxonomy
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

$view_utils      = new Yoast_View_Utils();
$taxonomies_help = $view_utils->search_results_setting_help( $wpseo_taxonomy );

$yform->index_switch(
	'noindex-tax-' . $wpseo_taxonomy->name,
	$title,
	$taxonomies_help->get_button_html() . $taxonomies_help->get_panel_html()
);


// Determine the page type for the term, this is needed for the recommended replacement variables.
$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
$page_type                = $recommended_replace_vars->determine_for_term( $wpseo_taxonomy->name );

$editor = new WPSEO_Replacevar_Editor( $yform, 'title-tax-' . $wpseo_taxonomy->name, 'metadesc-tax-' . $wpseo_taxonomy->name, $page_type, false );
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
