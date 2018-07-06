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

$wpseo_rss_presenter = new WPSEO_Paper_Presenter(
	esc_html__( 'RSS feed settings', 'wordpress-seo' ),
	dirname( __FILE__ ) . '/paper-content/rss-content.php'
);

echo $wpseo_rss_presenter->get_output();

