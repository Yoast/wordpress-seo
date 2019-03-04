<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Google+ settings', 'wordpress-seo' ) . '</h2>';

printf(
	'<p>%s</p>',
	esc_html__( 'If you have a Google+ page for your business, add that URL here and link it on your Google+ page\'s about page.', 'wordpress-seo' )
);

$yform->textinput( 'plus-publisher', __( 'Google Publisher Page', 'wordpress-seo' ) );

do_action( 'wpseo_admin_googleplus_section' );
