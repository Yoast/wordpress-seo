<?php
/**
 * @package XML_Sitemaps
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

/**
 * Class that handles the Admin side of XML sitemaps
 */
class WPSEO_Sitemaps_Admin {

	/**
	 * Class constructor
	 */
	function __construct() {

		$options = get_option( 'wpseo_xml' );
		if ( $options[ 'enablexmlsitemap' ] !== true )
			return;

		add_action( 'transition_post_status', array( $this, 'status_transition' ), 10, 3 );
		add_action( 'admin_init', array( $this, 'delete_sitemaps' ) );
	}

	/**
	 * Remove sitemaps residing on disk as they will block our rewrite.
	 */
	function delete_sitemaps() {
		$options = WPSEO_Options::get_all();
		if ( $options[ 'enablexmlsitemap' ] === true ) {
			$file = ABSPATH . 'sitemap_index.xml';
			if ( ( $options['blocking_files'] === array() || in_array( $file, $options[ 'blocking_files'] ) === false ) &&
				file_exists( $file )
			) {
				$options['blocking_files'][] = $file;
				update_option( 'wpseo', $options );
			}
		}
	}

	/**
	 * Hooked into transition_post_status. Will initiate search engine pings
	 * if the post is being published, is a post type that a sitemap is built for
	 * and is a post that is included in sitemaps.
	 */
	function status_transition( $new_status, $old_status, $post ) {
		if ( $new_status != 'publish' )
			return;

		wp_cache_delete( 'lastpostmodified:gmt:' . $post->post_type, 'timeinfo' ); // #17455

		$options = WPSEO_Options::get_all();
		if ( isset( $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] ) && $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] === true )
			return;

		if ( WP_CACHE )
			wp_schedule_single_event( time() + 300, 'wpseo_hit_sitemap_index' );

		// Allow the pinging to happen slightly after the hit sitemap index so the sitemap is fully regenerated when the ping happens.
		if ( wpseo_get_value( 'sitemap-include', $post->ID ) != 'never' ) {
			if ( defined( 'YOAST_SEO_PING_IMMEDIATELY' ) && YOAST_SEO_PING_IMMEDIATELY )
				wpseo_ping_search_engines();
			else
				wp_schedule_single_event( ( time() + 300 ), 'wpseo_ping_search_engines' );
		}
	}
}

// Instantiate class
$wpseo_sitemaps_admin = new WPSEO_Sitemaps_Admin();