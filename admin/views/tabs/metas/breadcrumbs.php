<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$presenter = new WPSEO_presenter_paper(
	esc_html__( 'Breadcrumbs settings', 'wordpress-seo' ),
	dirname( __FILE__ ) . '/breadcrumbs/breadcrumbs-content.php'
);
echo $presenter->render();
