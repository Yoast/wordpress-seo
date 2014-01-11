<?php
/**
 * @package XML_Sitemaps
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
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
	 *
	 * @todo - I suggest we change this to a simple directory walker with a preg_match() on any files which would
	 * match our rewrite rule expressions.
	 * Still we wouldn't want *that* to run each and every time a page loads, so we should change the way this
	 * function is called
	 *
	 * Ideas on when/how to call it alternatively:
	 * - always on dashboard.php ?
	 * - if the enablexmlssitemap option is set to true (on option update)
	 * - on (re-)activation and/or upgrade
	 * - via a weekly cronjob to keep an eye on things in the mean time (for if a user would install another sitemap
	 *   plugin while WP SEO is installed and enablexmlsitemap == true
	 *
	 * Would also need a warning (+ignore setting) to be displayed on every admin page if a blocking file
	 * would be found (like via cron) as otherwise the user may not see it.
	 *
	 * Warning message reset logic would need a good think though, if ignore is set to true and new files are found,
	 * what should be done ?
	 *
	 * Also: the method should be renamed, it currently does not delete the sitemaps (that's done in the ajax file),
	 * it only tries to find them. So : find_blocking_file() would be the better name
	 */
	function delete_sitemaps() {
		$options = WPSEO_Options::get_all();
		if ( $options[ 'enablexmlsitemap' ] === true ) {
			
			$file_to_check_for = array(
//				ABSPATH . 'sitemap.xml',
				ABSPATH . 'sitemap_index.xml',
//				ABSPATH . 'sitemap.xslt',
//				ABSPATH . 'sitemap.xsl',
			);
			
			foreach ( $file_to_check_for as $file ) {

				if ( ( $options['blocking_files'] === array() || ( $options['blocking_files'] !== array() && in_array( $file, $options[ 'blocking_files'] ) === false ) ) && file_exists( $file ) ) {
					$options['blocking_files'][] = $file;
					update_option( 'wpseo', $options );
				}
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