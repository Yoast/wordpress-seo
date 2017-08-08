<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_social' );

$tabs = new WPSEO_Option_Tabs( 'social' );
$tabs->add_tab( new WPSEO_Option_Tab( 'accounts', __( 'Accounts', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-social-accounts' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'facebook', __( 'Facebook', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-social-facebook' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'twitterbox', __( 'Twitter', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-social-twitter' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'pinterest', __( 'Pinterest', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-social-pinterest' ) ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'google', __( 'Google+', 'wordpress-seo' ), array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-social-google' ) ) ) );
$tabs->display( $yform );

$yform->admin_footer();
