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
$yform->admin_header( true, 'wpseo_social' );

$social_tabs = new WPSEO_Option_Tabs( 'social' );
$social_tabs->add_tab( new WPSEO_Option_Tab( 'accounts', __( 'Accounts', 'wordpress-seo' ) ) );
$social_tabs->add_tab( new WPSEO_Option_Tab( 'facebook', __( 'Facebook', 'wordpress-seo' ) ) );
$social_tabs->add_tab( new WPSEO_Option_Tab( 'twitterbox', __( 'Twitter', 'wordpress-seo' ) ) );
$social_tabs->add_tab( new WPSEO_Option_Tab( 'pinterest', __( 'Pinterest', 'wordpress-seo' ) ) );

$social_tabs->display( $yform );

$yform->admin_footer();
