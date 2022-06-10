<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Indicates this variable is a Network_Admin_Options_Service.
 *
 * @var \Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service $network_admin_options_service
 */
$network_admin_options_service = YoastSEO()->classes->get( Network_Admin_Options_Service::class );

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, $network_admin_options_service->option_name );

$network_tabs = new WPSEO_Option_Tabs( 'network' );
$network_tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ) ) );
$network_tabs->add_tab( new WPSEO_Option_Tab( 'features', __( 'Features', 'wordpress-seo' ) ) );
$network_tabs->add_tab( new WPSEO_Option_Tab( 'integrations', __( 'Integrations', 'wordpress-seo' ) ) );
$network_tabs->add_tab( new WPSEO_Option_Tab( 'restore-site', __( 'Restore Site', 'wordpress-seo' ), [ 'save_button' => false ] ) );
$network_tabs->display( $yform );

$yform->admin_footer();
