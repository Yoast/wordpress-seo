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
		[ __( 'On', 'wordpress-seo' ), __( 'Off', 'wordpress-seo' ) ],
		false
	);
}

echo '<div class="yoast-settings-section">';
echo "<div id='" . esc_attr( $wpseo_taxonomy->name ) . "-titles-metas'>";

$taxonomies_help = $view_utils->search_results_setting_help( $wpseo_taxonomy );

$yform->index_switch(
	'noindex-tax-' . $wpseo_taxonomy->name,
	$title,
	$taxonomies_help->get_button_html() . $taxonomies_help->get_panel_html()
);

if ( $wpseo_taxonomy->name !== 'post_format' ) {
	$yform->show_hide_switch(
		'display-metabox-tax-' . $wpseo_taxonomy->name,
		/* translators: %s: Expands to an indexable object's name, like a post type or taxonomy. */
		sprintf( __( 'Show SEO settings for %1$s?', 'wordpress-seo' ), $title )
	);
}

echo '</div>';
echo '</div>';

echo '<div class="yoast-settings-section">';

// Determine the page type for the term, this is needed for the recommended replacement variables.
$page_type = $recommended_replace_vars->determine_for_term( $wpseo_taxonomy->name );

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'title-tax-' . $wpseo_taxonomy->name,
		'description'           => 'metadesc-tax-' . $wpseo_taxonomy->name,
		'page_type_recommended' => $recommended_replace_vars->determine_for_term( $wpseo_taxonomy->name ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_term( $wpseo_taxonomy->name ),
		'paper_style'           => false,
	]
);
$editor->render();

echo '</div>';

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
do_action( 'Yoast\WP\SEO\admin_taxonomies_meta_internal', $yform, $wpseo_taxonomy );

/**
 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab.
 *
 * @deprecated 19.10 No replacement available.
 *
 * @param Yoast_Form  $yform          The Yoast_Form object.
 * @param WP_Taxonomy $wpseo_taxonomy The taxonomy.
 */
do_action_deprecated(
	'Yoast\WP\SEO\admin_taxonomies_meta',
	[ $yform, $wpseo_taxonomy ],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);

/**
 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab.
 *
 * @deprecated 16.3 Use {@see 'Yoast\WP\SEO\admin_taxonomies_meta'} instead.
 *
 * @param Yoast_Form  $yform          The Yoast_Form object.
 * @param WP_Taxonomy $wpseo_taxonomy The taxonomy.
 */
do_action_deprecated(
	'wpseo_admin_page_meta_taxonomies',
	[ $yform, $wpseo_taxonomy ],
	'16.3',
	'Yoast\WP\SEO\admin_taxonomies_meta'
);
