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
 * => maybe add an options page where users can choose whether or not to remove this kind of data ?
 * or try and hook into the uninstall routine and ask the user there & then
 *
 * @todo remove option Yoast_Tracking_Hash ?
 * @todo remove transients created by this plugin ?
 *
 * @todo deal with multisite uninstall - the options and other data will need to be removed for all blogs ?
 */

if ( ! current_user_can( 'activate_plugins' ) || ( ! defined( 'ABSPATH' ) || ! defined( 'WP_UNINSTALL_PLUGIN' ) ) )
	exit();


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
);
// @todo change code to deal with wpseo_ms option as a (multi) site option
foreach ( $wpseo_option_keys as $option ) {
	delete_option( $option );
}

/* Should already have been removed on deactivate, but let's make double sure */
if ( wp_next_scheduled( 'yoast_tracking' ) !== false ) {
	wp_clear_scheduled_hook( 'yoast_tracking' );
}


/**
 * @todo Some sort of mechanism should be worked out in which we ask the user whether they also want
 * to delete all entered meta data
 * If so, the below should be run (for all blog when multi-site uninstall)
 */
/*
	delete_option( 'wpseo_taxonomy_meta' );
*/


/*
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
	'_yoast_wpseo_meta-robots', // old, may not exists at all
);

foreach( $wpseo_meta_keys as $key ) {
	delete_post_meta_by_key( $key );
}
*/