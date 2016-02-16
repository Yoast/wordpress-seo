<?php
/**
 * @package WPSEO\Admin\XML Sitemaps
 */

/**
 * Class that handles the Admin side of XML sitemaps
 */
class WPSEO_Sitemaps_Admin {

	/**
	 * Class constructor
	 */
	function __construct() {
		add_action( 'transition_post_status', array( $this, 'status_transition' ), 10, 3 );
		add_action( 'admin_init', array( $this, 'detect_blocking_filesystem_sitemaps' ) );
	}

	/**
	 * Find sitemaps residing on disk as they will block our rewrite.
	 *
	 * @todo issue #561 https://github.com/Yoast/wordpress-seo/issues/561
	 */
	public function detect_blocking_filesystem_sitemaps() {
		$wpseo_options = WPSEO_Options::get_option('wpseo');
		if ( $wpseo_options['enablexmlsitemap'] !== true ) {
			return;
		}

		$file_to_check_for = array(
			/**
			 * ABSPATH . 'sitemap.xml',
			 * ABSPATH . 'sitemap.xslt',
			 * ABSPATH . 'sitemap.xsl',
			 */
			ABSPATH . 'sitemap_index.xml',
		);

		if ( ! is_array( $wpseo_options['blocking_files'] ) ) {
			$wpseo_options['blocking_files'] = array();
		}

		$update_option = false;

		foreach ( $file_to_check_for as $file ) {

			$file_exists = file_exists( $file );
			$in_options = array_search( $file, $wpseo_options['blocking_files'] );

			if ( $file_exists && false === $in_options ) {
				$wpseo_xml_options['blocking_files'][] = $file;

				$update_option = true;
			}

			if ( ! $file_exists && false !== $in_options ) {
				unset( $wpseo_options['blocking_files'][ $in_options ] );

				$update_option = true;
			}
		}

		if ( $update_option === true ) {
			update_option( 'wpseo', $wpseo_options );
		}
	}

	/**
	 * Hooked into transition_post_status. Will initiate search engine pings
	 * if the post is being published, is a post type that a sitemap is built for
	 * and is a post that is included in sitemaps.
	 *
	 * @param string   $new_status New post status.
	 * @param string   $old_status Old post status.
	 * @param \WP_Post $post       Post object.
	 */
	function status_transition( $new_status, $old_status, $post ) {
		if ( $new_status != 'publish' ) {
			return;
		}

		wp_cache_delete( 'lastpostmodified:gmt:' . $post->post_type, 'timeinfo' ); // #17455.

		$options = WPSEO_Options::get_options( array( 'wpseo_xml', 'wpseo_titles' ) );
		if (
			( isset( $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] ) && $options[ 'post_types-' . $post->post_type . '-not_in_sitemap' ] === true )
			|| ( $post->post_type === 'nav_menu_item' )
		) {
			return;
		}

		if ( WP_CACHE ) {
			wp_schedule_single_event( ( time() + 300 ), 'wpseo_hit_sitemap_index' );
		}

		/**
		 * Filter: 'wpseo_allow_xml_sitemap_ping' - Check if pinging is not allowed (allowed by default)
		 *
		 * @api boolean $allow_ping The boolean that is set to true by default.
		 */
		if ( apply_filters( 'wpseo_allow_xml_sitemap_ping', true ) === false ) {
			return;
		}

		// Allow the pinging to happen slightly after the hit sitemap index so the sitemap is fully regenerated when the ping happens.
		$excluded_posts = explode( ',', $options['excluded-posts'] );
		if ( ! in_array( $post->ID, $excluded_posts ) ) {
			if ( defined( 'YOAST_SEO_PING_IMMEDIATELY' ) && YOAST_SEO_PING_IMMEDIATELY ) {
				wpseo_ping_search_engines();
			}
			else {
				wp_schedule_single_event( ( time() + 300 ), 'wpseo_ping_search_engines' );
			}
		}
	}
} /* End of class */
