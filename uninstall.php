<?php
/**
 * @package Internals
 *
 * Code used when the plugin is removed (not just deactivated but actively deleted through the WordPress Admin).
 *
 * @todo remove meta data for posts/pages ?
 * @todo remove wpseo_taxonomy_meta option ?
 * @todo deal with multisite uninstall ?
 */

if ( !current_user_can( 'activate_plugins' ) || ( !defined( 'ABSPATH' ) || !defined( 'WP_UNINSTALL_PLUGIN' ) ) )
	exit();

foreach ( array( 'wpseo', 'wpseo_indexation', 'wpseo_permalinks', 'wpseo_titles', 'wpseo_rss', 'wpseo_internallinks', 'wpseo_xml', 'wpseo_social', 'wpseo_ms' ) as $option ) {
	delete_option( $option );
}
