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

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	WPSEO_Options::set( 'yoast_tracking', ( $_GET['allow_tracking'] === 'yes' ) );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( wp_unslash( $_SERVER['HTTP_REFERER'] ), 307 );
		exit;
	}
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo' );

do_action( 'wpseo_all_admin_notices' );

$dashboard_tabs = new WPSEO_Option_Tabs( 'dashboard' );
$dashboard_tabs->add_tab(
	new WPSEO_Option_Tab(
		'dashboard',
		__( 'Dashboard', 'wordpress-seo' ),
		[
			'save_button' => false,
		]
	)
);
$dashboard_tabs->add_tab(
	new WPSEO_Option_Tab(
		'features',
		__( 'Features', 'wordpress-seo' )
	)
);
$dashboard_tabs->add_tab(
	new WPSEO_Option_Tab(
		'integrations',
		__( 'Integrations', 'wordpress-seo' )
	)
);
$dashboard_tabs->add_tab(
	new WPSEO_Option_Tab(
		'webmaster-tools',
		__( 'Webmaster Tools', 'wordpress-seo' )
	)
);

do_action( 'wpseo_settings_tabs_dashboard', $dashboard_tabs );

$dashboard_tabs->display( $yform );

do_action( 'wpseo_dashboard' );

$yform->admin_footer();
