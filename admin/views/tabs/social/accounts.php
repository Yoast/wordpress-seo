<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses    Yoast_Form $yform Form object.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$social_profiles_help = new WPSEO_Admin_Help_Panel(
	'social-accounts',
	__( 'Learn more about your social profiles settings', 'wordpress-seo' ),
	__( 'To let search engines know which social profiles are associated to this site, enter your site social profiles data below.', 'wordpress-seo' ) . ' ' .
	__( 'If a Wikipedia page for you or your organization exists, add it too.', 'wordpress-seo' ),
	'has-wrapper'
);

echo '<div id="yoast-social-profiles"></div>';

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
do_action( 'wpseo_admin_other_section_internal' );

/**
 * Admin other section hook.
 *
 * @deprecated 19.10 No replacement available.
 */
do_action_deprecated(
	'wpseo_admin_other_section',
	[],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);
