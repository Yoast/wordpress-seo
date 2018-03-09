<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( filter_input( INPUT_GET, 'intro' ) ) {
	update_user_meta( get_current_user_id(), 'wpseo_seen_about_version', WPSEO_VERSION );
	require WPSEO_PATH . 'admin/views/about.php';

	return;
}

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	WPSEO_Options::set( 'yoast_tracking', ( $_GET['allow_tracking'] === 'yes' ) );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo' );

do_action( 'wpseo_all_admin_notices' );

$tabs = new WPSEO_Option_Tabs( 'dashboard' );
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'dashboard',
		__( 'Dashboard', 'wordpress-seo' ),
		array(
			'video_url'   => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-notification-center' ),
			'save_button' => false,
		)
	)
);
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'features',
		__( 'Features', 'wordpress-seo' ),
		array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-features' ) )
	)
);
$tabs->add_tab(
	new WPSEO_Option_Tab(
		'webmaster-tools',
		__( 'Webmaster tools', 'wordpress-seo' ),
		array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-general-search-console' ) )
	)
);

do_action( 'wpseo_settings_tabs_dashboard', $tabs );

$tabs->display( $yform );

do_action( 'wpseo_dashboard' );

$yform->admin_footer();
