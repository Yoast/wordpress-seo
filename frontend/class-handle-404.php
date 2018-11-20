<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_JSON_LD
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since 1.8
 */
class WPSEO_Handle_404 implements WPSEO_WordPress_Integration {
	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'pre_handle_404', array( $this, 'filter_feed_404s' ), 10, 2 );
	}

	/**
	 * If there are no posts in a feed, make it 404 instead of sending an empty RSS feed.
	 *
	 * @param boolean  $handled  Whether we've handled the request.
	 * @param WP_Query $wp_query The Query object.
	 *
	 * @return bool
	 */
	public function filter_feed_404s( $handled, $wp_query ) {
		global $wp_query;
		if ( is_feed() ) {
			if ( $wp_query->found_posts === 0 ) {
				// Guess it's time to 404, we need to overwrite the already sent XML header.
				header( 'Content-Type: ' . get_bloginfo( 'html_type' ) . '; charset=' . get_bloginfo( 'charset' ), true );
				$wp_query->set_404();
				$wp_query->is_feed = false;
				status_header( 404 );
				nocache_headers();

				return true;
			}
		}

		return $handled;
	}
}