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


$presenter = new WPSEO_Paper_Presenter(
	esc_html__( 'Media & attachment URLs', 'wordpress-seo' ),
	dirname( __FILE__ ) . '/media/media-content.php',
	array( 'collapsible' => true, 'expanded' => true )
);

echo $presenter->render();
