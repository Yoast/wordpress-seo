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

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_ms' );

$tabs = new WPSEO_Option_Tabs( 'network' );
$tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'features', __( 'Features', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-features' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'restore-site', __( 'Restore Site', 'wordpress-seo' ), array( 'save_button' => false ) ) );
$tabs->display( $yform );

$yform->admin_footer();
