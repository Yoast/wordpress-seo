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

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
do_action( 'wpseo_settings_tab_site_analysis_internal', $yform );

/**
 * Fires when displaying the site wide analysis tab.
 *
 * @deprecated 19.10 No replacement available.
 *
 * @param Yoast_Form $yform The yoast form object.
 */
do_action_deprecated(
	'wpseo_settings_tab_site_analysis',
	[ $yform ],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);
