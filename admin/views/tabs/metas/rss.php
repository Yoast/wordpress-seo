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
	dirname( __FILE__ ) . '/paper-content/rss-content.php',
	[
		'help_button' => new WPSEO_Admin_Help_Button(
			'https://yoa.st/3ym',
			__( 'Learn more about the RSS feed setting', 'wordpress-seo' )
		),
		'paper_id'  => 'settings-rss-feed',
		'class'     => 'search-appearance',
	]
);

echo $wpseo_rss_presenter->get_output();
