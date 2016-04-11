<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$options = WPSEO_Options::get_options( array( 'wpseo_titles', 'wpseo_permalinks', 'wpseo_internallinks' ) );

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );

$tabs = new WPSEO_Option_Tabs( 'metas' );
$tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'home', __( 'Homepage', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas-homepage' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'post-types', __( 'Post Types', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas-post-types' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'taxonomies', __( 'Taxonomies', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas-taxonomies' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'archives', __( 'Archives', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas-archives' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'other', __( 'Other', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-metas-other' ) ) );
$tabs->display( $yform, $options );

$yform->admin_footer();
