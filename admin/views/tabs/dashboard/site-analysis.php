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
 * Fires when displaying the site wide analysis tab.
 *
 * @deprecated 19.9 No replacement available.
 *
 * @param Yoast_Form $yform The yoast form object.
 */
do_action_deprecated(
	'wpseo_settings_tab_site_analysis',
	[ $yform ],
	'19.9',
	'',
	'Deprecated since 19.9. Will be removed in 20.0.'
);
