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

use Yoast\WP\SEO\Helpers\Schema\Article_Helper;

$show_post_type_help = $view_utils->search_results_setting_help( $wpseo_post_type );
$noindex_option_name = 'noindex-' . $wpseo_post_type->name;

echo '<div class="yoast-settings-section">';

$yform->index_switch(
	$noindex_option_name,
	$wpseo_post_type->labels->name,
	$show_post_type_help->get_button_html() . $show_post_type_help->get_panel_html()
);

$yform->show_hide_switch(
	'display-metabox-pt-' . $wpseo_post_type->name,
	/* translators: %s expands to an indexable object's name, like a post type or taxonomy */
	sprintf( esc_html__( 'Show SEO settings for %1$s', 'wordpress-seo' ), '<strong>' . $wpseo_post_type->labels->name . '</strong>' )
);

echo '</div>';

echo '<div class="yoast-settings-section">';

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

echo '</div>';

/**
 * Allow adding custom fields to the admin meta page - Content Types tab.
 *
 * @param Yoast_Form $yform The Yoast_Form object.
 * @param string     $name  The post type name.
 */
do_action( 'Yoast\WP\SEO\admin_post_types_meta', $yform, $wpseo_post_type->name );

echo '<div class="yoast-settings-section">';

// Schema settings.
$article_helper             = new Article_Helper();
$schema_page_type_option    = 'schema-page-type-' . $wpseo_post_type->name;
$schema_article_type_option = 'schema-article-type-' . $wpseo_post_type->name;
$yform->hidden( $schema_page_type_option );
if ( $wpseo_post_type->name !== 'page' && $article_helper->is_author_supported( $wpseo_post_type->name ) ) {
	$yform->hidden( $schema_article_type_option );
}
printf(
	'<div class="yoast-schema-settings-container" data-schema-settings data-schema-settings-post-type="%1$s" data-schema-settings-post-type-name="%2$s" data-schema-settings-page-type-field-id="%3$s" data-schema-settings-article-type-field-id="%4$s" data-schema-settings-page-type-default="%5$s" data-schema-settings-article-type-default="%6$s"></div>',
	$wpseo_post_type->name,
	$wpseo_post_type->labels->name,
	'hidden_' . $schema_page_type_option,
	'hidden_' . $schema_article_type_option,
	WPSEO_Options::get_default( 'wpseo_titles', $schema_page_type_option ),
	WPSEO_Options::get_default( 'wpseo_titles', $schema_article_type_option )
);

echo '</div>';
