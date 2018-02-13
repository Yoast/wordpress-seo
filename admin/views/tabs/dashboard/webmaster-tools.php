<?php
/**
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$webmaster_tools_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-webmaster-tools',
	__( 'Learn more about the Webmaster Tools verification', 'wordpress-seo' ),
	__( 'You can use the boxes below to verify with the different Webmaster Tools, if your site is already verified, you can just forget about these.', 'wordpress-seo' ),
	'has-wrapper'
);

echo '<h2 class="help-button-inline">' . esc_html__( 'Webmaster Tools verification', 'wordpress-seo' ) . $webmaster_tools_help->get_button_html() . '</h2>';
echo $webmaster_tools_help->get_panel_html();

$yform->textinput( 'msverify', '<a target="_blank" href="' . esc_url( 'http://www.bing.com/webmaster/?rfp=1#/Dashboard/?url=' . urlencode( str_replace( 'http://', '', get_bloginfo( 'url' ) ) ) ) . '">' . __( 'Bing Webmaster Tools', 'wordpress-seo' ) . '</a>' );
$yform->textinput( 'googleverify', '<a target="_blank" href="' . esc_url( 'https://www.google.com/webmasters/verification/verification?hl=en&siteUrl=' . urlencode( get_bloginfo( 'url' ) ) . '/' ) . '">Google Search Console</a>' );
$yform->textinput( 'yandexverify', '<a target="_blank" href="http://help.yandex.com/webmaster/service/rights.xml#how-to">' . __( 'Yandex Webmaster Tools', 'wordpress-seo' ) . '</a>' );
