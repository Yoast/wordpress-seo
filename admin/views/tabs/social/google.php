<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform->light_switch( 'googleplus', __( 'Add Google+ specific post meta data', 'wordpress-seo' ) );

printf( '<p>%s</p>', __( 'If you have a Google+ page for your business, add that URL here and link it on your Google+ page\'s about page.', 'wordpress-seo' ) );

$yform->textinput( 'plus-publisher', __( 'Google Publisher Page', 'wordpress-seo' ) );

do_action( 'wpseo_admin_googleplus_section' );
