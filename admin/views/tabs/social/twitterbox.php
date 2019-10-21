<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform                                   Form object.
 * @uses array      WPSEO_Option_Social::$twitter_card_types
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Twitter settings', 'wordpress-seo' ) . '</h2>';

printf(
	'<p>%s</p>',
	esc_html__( 'Twitter uses Open Graph metadata just like Facebook, so be sure to keep the Open Graph checkbox on the Facebook tab checked if you want to optimize your site for Twitter.', 'wordpress-seo' )
);

$yform->light_switch( 'twitter', __( 'Add Twitter card meta data', 'wordpress-seo' ), array(), true, '', true );

echo '<p>';
esc_html_e( 'Enable this feature if you want Twitter to display a preview with images and a text excerpt when a link to your site is shared.', 'wordpress-seo' );
echo '</p>';

echo '<br />';

$yform->select( 'twitter_card_type', __( 'The default card type to use', 'wordpress-seo' ), WPSEO_Option_Social::$twitter_card_types );

do_action( 'wpseo_admin_twitter_section' );
