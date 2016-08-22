<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Twitter settings', 'wordpress-seo' ) . '</h2>';

$yform->light_switch( 'twitter', __( 'Add Twitter card meta data', 'wordpress-seo' ) );

/* translators: %s expands to <code>&lt;head&gt;</code> */
$p = sprintf( __( 'Add Twitter card meta data to your site\'s %s section.', 'wordpress-seo' ), '<code>&lt;head&gt;</code>' );
printf( '<p>%s</p>', $p );

echo '<br />';

$yform->select( 'twitter_card_type', __( 'The default card type to use', 'wordpress-seo' ), WPSEO_Option_Social::$twitter_card_types );

do_action( 'wpseo_admin_twitter_section' );
