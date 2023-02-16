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
	esc_html__( 'Twitter uses Open Graph metadata just like Facebook, so be sure to keep the "Add Open Graph metadata" setting on the Facebook tab enabled if you want to optimize your site for Twitter.', 'wordpress-seo' )
);

$yform->light_switch( 'twitter', __( 'Add Twitter card meta data', 'wordpress-seo' ) );

echo '<p>';
esc_html_e( 'Enable this feature if you want Twitter to display a preview with images and a text excerpt when a link to your site is shared.', 'wordpress-seo' );
echo '</p>';

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
do_action( 'wpseo_admin_twitter_section_internal' );

/**
 * Admin Twitter section hook.
 *
 * @deprecated 19.10 No replacement available.
 */
do_action_deprecated(
	'wpseo_admin_twitter_section',
	[],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);
