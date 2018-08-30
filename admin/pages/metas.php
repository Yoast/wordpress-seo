<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$tab = new WPSEO_Help_Center_Template_Variables_Tab();
$tab->register_hooks();

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
