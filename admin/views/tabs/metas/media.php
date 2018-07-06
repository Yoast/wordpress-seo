<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$wpseo_media_presenter = new WPSEO_Paper_Presenter(
	esc_html__( 'Media & attachment URLs', 'wordpress-seo' ),
	dirname( __FILE__ ) . '/paper-content/media-content.php'
);

echo $wpseo_media_presenter->get_output();
