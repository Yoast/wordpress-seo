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

$webmaster_tools_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/3yn',
	esc_html__( 'Learn more about the Webmaster Tools verification', 'wordpress-seo' )
);
echo '<div class="tab-block yoast-feature">';
echo '<h2 class="help-button-inline">' . esc_html__( 'Webmaster Tools verification', 'wordpress-seo' ) . $webmaster_tools_help . '</h2>';

$msverify_link = 'https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=' .
	rawurlencode( str_replace( 'http://', '', get_bloginfo( 'url' ) ) );

$googleverify_link = add_query_arg(
	[
		'hl'      => 'en',
		'tid'     => 'alternate',
		'siteUrl' => rawurlencode( get_bloginfo( 'url' ) ) . '/',
	],
	'https://www.google.com/webmasters/verification/verification'
);

$yform->textinput( 'baiduverify', __( 'Baidu verification code', 'wordpress-seo' ) );
echo '<p>';
printf(
	/* translators: %1$s expands to a link start tag to the Baidu Webmaster Tools site add page, %2$s is the link closing tag. */
	esc_html__( 'Get your Baidu verification code in %1$sBaidu Webmaster Tools%2$s.', 'wordpress-seo' ),
	/**
	 * Get the Baidu Webmaster Tools site add link from this 3rd party article.
	 * {@link http://www.dragonmetrics.com/how-to-optimize-your-site-with-baidu-webmaster-tools/}
	 * We are unable to create a Baidu Webmaster Tools account due to the Chinese phone number verification.
	 */
	'<a target="_blank" href="' . esc_url( 'https://ziyuan.baidu.com/site/siteadd' ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'msverify', __( 'Bing verification code', 'wordpress-seo' ) );
echo '<p>';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Bing verification code in %1$sBing Webmaster Tools%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( $msverify_link ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'googleverify', __( 'Google verification code', 'wordpress-seo' ) );
echo '<p>';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Google verification code in %1$sGoogle Search Console%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( $googleverify_link ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';

$yform->textinput( 'yandexverify', __( 'Yandex verification code', 'wordpress-seo' ) );
echo '<p>';
printf(
	/* translators: 1: link open tag; 2: link close tag. */
	esc_html__( 'Get your Yandex verification code in %1$sYandex Webmaster Tools%2$s.', 'wordpress-seo' ),
	'<a target="_blank" href="' . esc_url( 'https://webmaster.yandex.com/sites/add/' ) . '" rel="noopener noreferrer">',
	'</a>'
);
echo '</p>';
echo '</div>';
