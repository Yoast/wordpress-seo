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

$wpseo_breadcrumbs_presenter = new WPSEO_Paper_Presenter(
	esc_html__( 'Breadcrumbs settings', 'wordpress-seo' ),
	__DIR__ . '/paper-content/breadcrumbs-content.php',
	[
		'paper_id' => 'settings-breadcrumbs',
		'class'    => 'search-appearance',
	]
);
echo $wpseo_breadcrumbs_presenter->get_output();
