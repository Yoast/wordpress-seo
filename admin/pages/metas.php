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

$options = WPSEO_Options::get_options( array( 'wpseo_titles', 'wpseo_permalinks', 'wpseo_internallinks' ) );

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );

$tabs = new WPSEO_Option_Tabs( 'metas' );
$tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'home', __( 'Homepage', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-homepage' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'post-types', __( 'Post Types', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-post-types' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'taxonomies', __( 'Taxonomies', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-taxonomies' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'archives', __( 'Archives', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-archives' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'other', __( 'Other', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-metas-other' ) ) ) );
$tabs->display( $yform, $options );

$yform->admin_footer();

/**
 * Add help tabs
 *
 * @param array $tabs Current help center tabs.
 *
 * @return array
 */
function yoast_add_meta_options_help_center_tabs( $tabs ) {
	$tabs[] = new WPSEO_Help_Center_Item(
		'basic-help',
		__( 'Template explanation', 'wordpress-seo' ),
		array(
			'content' => "\n\t\t<h2>" . __( 'Template explanation', 'wordpress-seo' ) . "</h2>\n\t\t" . '<p><p>' .
				sprintf(
					/* translators: %1$s expands to Yoast SEO. */
					__( 'The title &amp; metas settings for %1$s are made up of variables that are replaced by specific values from the page when the page is displayed. The tabs on the left explain the available variables.', 'wordpress-seo' ),
					'Yoast SEO' ) .
				'</p><p>' . __( 'Note that not all variables can be used in every template.', 'wordpress-seo' ) . '</p>',
		)
	);

	$tabs[] = new WPSEO_Help_Center_Item(
		'title-vars',
		__( 'Basic Variables', 'wordpress-seo' ),
		array(
			'content' => '<h2>' . __( 'Basic Variables', 'wordpress-seo' ) . '</h2>' . WPSEO_Replace_Vars::get_basic_help_texts(),
		)
	);

	$tabs[] = new WPSEO_Help_Center_Item(
		'title-vars-advanced',
		__( 'Advanced Variables', 'wordpress-seo' ),
		array(
			'content' => '<h2>' . __( 'Advanced Variables', 'wordpress-seo' ) . '</h2>' . WPSEO_Replace_Vars::get_advanced_help_texts(),
		)
	);

	return $tabs;
}
