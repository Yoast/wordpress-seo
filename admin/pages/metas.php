<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

add_filter( 'wpseo_help_center_items', 'yoast_add_meta_options_help_center_tabs' );

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );

$tabs = new WPSEO_Option_Tabs( 'metas' );
$tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'post-types', __( 'Content Types', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-post-types' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'media', __( 'Media', 'wordpress-seo' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'taxonomies', __( 'Taxonomies', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-taxonomies' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'archives', __( 'Archives', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-archives' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'breadcrumbs', __( 'Breadcrumbs', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-breadcrumbs' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'rss', __( 'RSS', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-rss' ) ) ) );
$tabs->display( $yform );

$yform->admin_footer();

/**
 * Adds help tabs.
 *
 * @param array $tabs Current help center tabs.
 *
 * @return array List containing all the additional tabs.
 */
function yoast_add_meta_options_help_center_tabs( $tabs ) {

	$tabs[] = new WPSEO_Help_Center_Item(
		'template-variables',
		__( 'Template explanation', 'wordpress-seo' ),
		array( 'content' => wpseo_add_template_variables_helpcenter() )
	);

	return $tabs;
}

/**
 * Adds template variables to the help center.
 *
 * @return string The content for the template variables tab.
 */
function wpseo_add_template_variables_helpcenter() {
	$explanation = sprintf(
		/* translators: %1$s expands to Yoast SEO. */
		__( 'The search appearance settings for %1$s are made up of variables that are replaced by specific values from the page when the page is displayed. The table below contains a list of the available variables.', 'wordpress-seo' ),
		'Yoast SEO'
	);

	$output_explanation = sprintf(
		'<h2>%s</h2><p>%s</p><p>%s</p>',
		esc_html( __( 'Template explanation', 'wordpress-seo' ) ),
		esc_html( $explanation ),
		esc_html( __( 'Note that not all variables can be used in every template.', 'wordpress-seo' ) )
	);

	$output_basic = sprintf(
		'<h2>%s</h2>%s',
		esc_html( __( 'Basic Variables', 'wordpress-seo' ) ),
		WPSEO_Replace_Vars::get_basic_help_texts()
	);

	$output_advanced = sprintf(
		'<h2>%s</h2>%s',
		esc_html( __( 'Advanced Variables', 'wordpress-seo' ) ),
		WPSEO_Replace_Vars::get_advanced_help_texts()
	);

	return $output_explanation . $output_basic . $output_advanced;
}
