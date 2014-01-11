<?php
/**
 * @package Internals
 *
 * Code used when the plugin is removed (not just deactivated but actively deleted through the WordPress Admin).
 *
 * // flush rewrite rules => not needed, is done on deactivate
 *
 * @todo remove meta data for posts/pages ?
 * @todo remove wpseo_taxonomy_meta option ?
 * @todo remove meta data added to users ?
 * => may be add an options page where users can choose whether or not to remove this kind of data ?
 * or try and hook into the uninstall routine and ask the user there & then
 *
 *
 * @todo deal with multisite uninstall ?
 */

if ( ! current_user_can( 'activate_plugins' ) || ( ! defined( 'ABSPATH' ) || ! defined( 'WP_UNINSTALL_PLUGIN' ) ) )
	exit();

// @todo change code to deal with wpseo_ms option as a (multi) site option
foreach ( array( 'wpseo', 'wpseo_indexation', 'wpseo_permalinks', 'wpseo_titles', 'wpseo_rss', 'wpseo_internallinks', 'wpseo_xml', 'wpseo_social', 'wpseo_ms' ) as $option ) {
	delete_option( $option );
}

/* Should already have been removed on deactivate, but let's make double sure */
if ( wp_next_scheduled( 'yoast_tracking' ) !== false ) {
	wp_clear_scheduled_hook( 'yoast_tracking' );
}