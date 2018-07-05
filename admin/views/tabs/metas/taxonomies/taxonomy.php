<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @var Yoast_Form $yform
 */

if ( $paper_id === 'post_format' ) {
	$yform->light_switch(
		'disable-post_format',
		__( 'Format-based archives', 'wordpress-seo' ),
		array( __( 'Enabled', 'wordpress-seo' ), __( 'Disabled', 'wordpress-seo' ) ),
		false
	);
}
$view_utils      = new Yoast_View_Utils();
$taxonomies_help = $view_utils->search_results_setting_help( $paper_id );

$yform->index_switch(
	'noindex-tax-' . $paper_id,
	$title,
	$taxonomies_help->get_button_html() . $taxonomies_help->get_panel_html()
);

// Determine the page type for the term, this is needed for the recommended replacement variables.
$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
$page_type                = $recommended_replace_vars->determine_for_term( $paper_id );

$editor = new WPSEO_Replacevar_Editor( $yform, 'title-tax-' . $paper_id, 'metadesc-tax-' . $paper_id, $page_type, false );
$editor->render();

if ( $paper_id !== 'post_format' ) {
	/* translators: %1$s expands to Yoast SEO */
	$yform->show_hide_switch( 'display-metabox-tax-' . $paper_id, sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
}
