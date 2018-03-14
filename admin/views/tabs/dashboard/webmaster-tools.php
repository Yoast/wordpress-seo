<?php
/**
 * WPSEO plugin file.
 *
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
	'dashboard-webmaster-tools',
	esc_html__( 'Learn more about the Webmaster Tools verification', 'wordpress-seo' ),
	esc_html__( 'You can use the boxes below to verify with the different Webmaster Tools. This feature will add a verification meta tag on your home page. Follow the links to the different Webmaster Tools and look for instructions for the meta tag verification method to get the verification code. If your site is already verified, you can just forget about these.', 'wordpress-seo' ),
	'has-wrapper'
);

echo '<h2 class="help-button-inline">' . esc_html__( 'Webmaster Tools verification', 'wordpress-seo' ) . $webmaster_tools_help->get_button_html() . '</h2>';
echo $webmaster_tools_help->get_panel_html();

$msverify_link = 'https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=' .
	rawurlencode( str_replace( 'http://', '', get_bloginfo( 'url' ) ) );

$googleverify_link = add_query_arg(
	array(
		'hl'      => 'en',
		'tid'     => 'alternate',
		'siteUrl' => rawurlencode( get_bloginfo( 'url' ) ) . '/',
	),
	'https://www.google.com/webmasters/verification/verification'
);


$yform->textinput( 'msverify', __( 'Bing verification code', 'wordpress-seo' ) );
echo '<p class="desc label">';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Bing verification code in %1$sBing Webmaster Tools%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( $msverify_link ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'googleverify', __( 'Google verification code', 'wordpress-seo' ) );
echo '<p class="desc label">';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Google verification code in %1$sGoogle Search Console%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( $googleverify_link ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'yandexverify', __( 'Yandex verification code', 'wordpress-seo' ) );
echo '<p class="desc label">';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Yandex verification code in %1$sYandex Webmaster Tools%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( 'https://webmaster.yandex.com/sites/add/' ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';
