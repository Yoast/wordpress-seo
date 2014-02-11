<?php
/**
 * @package Internals
 *
 * Code used when the plugin is removed (not just deactivated but actively deleted through the WordPress Admin).
 *
 * // flush rewrite rules => not needed, is done on deactivate
 *
 * @todo [JRF => whomever] Implement most of the sample code for removing the rest of the data from this plugin
 *
 * @todo [JRF => whomever] maybe add an options page where users can choose whether or not to remove meta data ?
 * or try and hook into the uninstall routine and ask the user there & then
 * (Nearly) all the code needed for a removal of this data for a single blog has been added below (commented out)
 *
 * @todo [JRF => whomever] deal with multisite uninstall - the options and other data will need to be removed for all blogs ? delete_blog_option() on all blogs
 */

if ( ! current_user_can( 'activate_plugins' ) || ( ! defined( 'ABSPATH' ) || ! defined( 'WP_UNINSTALL_PLUGIN' ) ) ) {
	exit();
}

/* Remove WPSEO options */
$wpseo_option_keys = array(
	'wpseo',
	'wpseo_indexation',
	'wpseo_permalinks',
	'wpseo_titles',
	'wpseo_rss',
	'wpseo_internallinks',
	'wpseo_xml',
	'wpseo_social',
	'wpseo_ms',
	'wpseo_flush_rewrite',
//	'Yoast_Tracking_Hash',
);
// @todo [JRF => whomever] change code to deal with wpseo_ms option as a (multi) site option using delete_site_option()
foreach ( $wpseo_option_keys as $option ) {
	delete_option( $option );
}

/* Should already have been removed on deactivate, but let's make double sure */
if ( wp_next_scheduled( 'yoast_tracking' ) !== false ) {
	wp_clear_scheduled_hook( 'yoast_tracking' );
}

/* Undo change we made to Woo SEO * /
if ( function_exists( 'woo_version_init' ) ) {
	update_option( 'seo_woo_use_third_party_data', 'false' );
}
*/



/* Remove transients * /
$wpseo_transients = array(
	'html-sitemap',
	'yoast_tracking_cache',
);
foreach ( $wpseo_transients as $transient ) {
	delete_transient( $transient );
}


global $wpdb;
$query   = "SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'googleplus' AND meta_value != ''";
$user_ids = $query->get_col( $query );
foreach ( $user_ids as $user_id ) {
	delete_transient( 'gplus_' . $user_id );
}
unset( $query, $user_ids, $user_id );
*/




/**
 * @todo [JRF => whomever] Some sort of mechanism should be worked out in which we ask the user whether they also want
 * to delete all entered meta data
 * If so, the below should be run (for all blogs when multi-site uninstall)
 */

/* Remove taxonomy meta values * /
delete_option( 'wpseo_taxonomy_meta' );
*/

/* Remove user meta values * /
$wpseo_user_meta_keys = array(
	'wpseo_title',
	'wpseo_metadesc',
	'wpseo_metakey',

	'_yoast_wpseo_profile_updated',
	'wpseo_posts_per_page',
);
foreach ( $wpseo_user_meta_keys as $key ) {
	delete_metadata( 'user', null, $key, '', true );
//	delete_metadata( 'user', null, $wpdb->get_blog_prefix() . $key, '', true ); // multisite
}
*/

/* Remove post meta values * /
$wpseo_meta_keys = array(
	'_yoast_wpseo_focuskw',
	'_yoast_wpseo_title',
	'_yoast_wpseo_metadesc',
	'_yoast_wpseo_metakeywords',
	'_yoast_wpseo_meta-robots-noindex',
	'_yoast_wpseo_meta-robots-nofollow',
	'_yoast_wpseo_meta-robots-adv',,
	'_yoast_wpseo_bctitle',
	'_yoast_wpseo_sitemap-prio',
	'_yoast_wpseo_sitemap-include',
	'_yoast_wpseo_sitemap-html-include',
	'_yoast_wpseo_canonical',
	'_yoast_wpseo_redirect',
	'_yoast_wpseo_opengraph-description',
	'_yoast_wpseo_opengraph-image',
	'_yoast_wpseo_google-plus-description',
	'_yoast_wpseo_linkdex',
	'_yoast_wpseo_meta-robots', // old, shouldn't exists at all anymore after upgrade to 1.5, but just in case
);

foreach ( $wpseo_meta_keys as $key ) {
	delete_post_meta_by_key( $key );
}
*/