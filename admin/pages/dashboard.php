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

$options = get_option( 'wpseo' );

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	$options['yoast_tracking'] = ( $_GET['allow_tracking'] == 'yes' );
	update_option( 'wpseo', $options );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo' );

do_action( 'wpseo_all_admin_notices' );

if ( is_array( $options['blocking_files'] ) && count( $options['blocking_files'] ) > 0 ) {

	$xml_sitemap_options = WPSEO_Options::get_option( 'wpseo_xml' );
	if ( $xml_sitemap_options['enablexmlsitemap'] ) {

		echo '<p id="blocking_files" class="wrong">';
		echo '<a href="javascript:wpseoKillBlockingFiles(\'', esc_js( wp_create_nonce( 'wpseo-blocking-files' ) ), '\')" class="button fixit">', __( 'Fix it.', 'wordpress-seo' ), '</a>';
		echo __( 'The following file(s) is/are blocking your XML sitemaps from working properly:', 'wordpress-seo' ), '<br/>';
		foreach ( $options['blocking_files'] as $file ) {
			echo esc_html( $file ), '<br/>';
		}
		unset( $file );

		/* translators: %1$s expands to Yoast SEO */
		echo sprintf( __( 'Either delete them (this can be done with the "Fix it" button) or disable %1$s XML sitemaps.', 'wordpress-seo' ), 'Yoast SEO' ), '</p>';
	}
}

$tabs = new WPSEO_Option_Tabs( 'dashboard' );
$tabs->add_tab( new WPSEO_Option_Tab( 'dashboard', __( 'Dashboard', 'wordpress-seo' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-general' ) ) );
$knowledge_graph_label = ( 'company' === $options['company_or_person'] ) ? __( 'Company Info', 'wordpress-seo' ) : __( 'Your Info', 'wordpress-seo' );
$tabs->add_tab( new WPSEO_Option_Tab( 'knowledge-graph', __( $knowledge_graph_label, 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-knowledge-graph' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'webmaster-tools', __( 'Webmaster Tools', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-general-search-console' ) ) );
$tabs->add_tab( new WPSEO_Option_Tab( 'security', __( 'Security', 'wordpress-seo' ), array( 'video_url' => 'https://yoa.st/screencast-security' ) ) );
$tabs->display( $yform, $options );

do_action( 'wpseo_dashboard' );

$yform->admin_footer();
