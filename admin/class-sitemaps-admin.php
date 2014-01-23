<?php
/**
 * @package XML_Sitemaps
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Sitemaps_Admin' ) ) {
	/**
	 * Class that handles the Admin side of XML sitemaps
	 */
	class WPSEO_Sitemaps_Admin {

		/**
		 * Class constructor
		 */
		function __construct() {
			add_action( 'transition_post_status', array( $this, 'status_transition' ), 10, 3 );
			add_action( 'admin_init', array( $this, 'delete_sitemaps' ) );
		}

		/**
		 * Find sitemaps residing on disk as they will block our rewrite.
		 *
		 * @todo - [JRF => Yoast] I suggest we change this to a simple directory walker with a preg_match() on any files which would
		 * match our sitemap rewrite rule expressions. Now only sitemap_index.xml is looked for and that may not be
		 * enough.
		 * Also we may want to check for other plugins which are known to generate sitemap files rather than
		 * just the files themselves. If one of those plugins is installed, there is a problem anyway.
		 * Still we wouldn't want *that* to run each and every time an admin page loads, so we
		 * should change the way this function is called. It's a bit silly running this on every admin page load
		 * now anyways.
		 *
		 * Ideas on when/how to call it alternatively:
		 * - always on dashboard.php ?
		 * - when the enablexmlssitemap option is set to true (on option update)
		 * - on (re-)activation and/or upgrade
		 * - via a weekly cronjob to keep an eye on things in the mean time (for if a user would install another sitemap
		 *   plugin while WP SEO is installed and enablexmlsitemap === true
		 * - when a plugin is installed to check that it is not one of the blocking plugins (which generate sitemap files)
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
					//ABSPATH . 'sitemap.xml',
					ABSPATH . 'sitemap_index.xml',
					//ABSPATH . 'sitemap.xslt',
					//ABSPATH . 'sitemap.xsl',
				);

				$new_files_found = false;

				foreach ( $file_to_check_for as $file ) {
					if ( ( $options['blocking_files'] === array() || ( $options['blocking_files'] !== array() && in_array( $file, $options[ 'blocking_files'] ) === false ) ) && file_exists( $file ) ) {
						$options['blocking_files'][] = $file;
						$new_files_found             = true;
					}
				}
				if ( $new_files_found === true ) {
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
			if ( isset( $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] ) && $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] === true ) {
				return;
			}

			if ( WP_CACHE ) {
				wp_schedule_single_event( time() + 300, 'wpseo_hit_sitemap_index' );
			}

			// Allow the pinging to happen slightly after the hit sitemap index so the sitemap is fully regenerated when the ping happens.
			if ( WPSEO_Meta::get_value( 'sitemap-include', $post->ID ) !== 'never' ) {
				if ( defined( 'YOAST_SEO_PING_IMMEDIATELY' ) && YOAST_SEO_PING_IMMEDIATELY ) {
					wpseo_ping_search_engines();
				}
				else {
					wp_schedule_single_event( ( time() + 300 ), 'wpseo_ping_search_engines' );
				}
			}
		}
	} /* End of class */

} /* End of class-exists wrapper */
