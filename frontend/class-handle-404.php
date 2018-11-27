<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_Handle_404
 *
 * Handles intercepting requests.
 *
 * @since 9.4
 */
class WPSEO_Handle_404 implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'pre_handle_404', array( $this, 'handle_404' ) );
	}

	/**
	 * Handle the 404 status code.
	 *
	 * @param bool $handled Whether we've handled the request.
	 *
	 * @return bool True if it's 404.
	 */
	public function handle_404( $handled ) {

		if ( is_feed() ) {
			return $this->is_feed_404( $handled );
		}

		return $handled;
	}

	/**
	 * If there are no posts in a feed, make it 404 instead of sending an empty RSS feed.
	 *
	 * @global WP_Query $wp_query
	 *
	 * @param bool $handled Whether we've handled the request.
	 *
	 * @return bool True if it's 404.
	 */
	protected function is_feed_404( $handled ) {
		global $wp_query;

		// Don't 404 if the query contains post(s) or an object.
		if ( $wp_query->posts || $wp_query->get_queried_object() ) {
			return $handled;
		}

		// Don't 404 if it's main feed or search feed.
		if ( $this->is_main_feed() || $wp_query->is_search() ) {
			return $handled;
		}

		$wp_query->is_feed = false;
		$this->set_404();

		return true;
	}

	/**
	 * Determine whether this is the main feed.
	 *
	 * @global WP       $wp
	 * @global WP_Query $wp_query
	 *
	 * @return bool Whether or not the request is the main feed.
	 */
	protected function is_main_feed() {
		global $wp, $wp_query;

		if ( $wp_query->is_archive() || $wp_query->is_singular() || $wp_query->is_search() ) {
			return false;
		}

		if ( array_keys( $wp->query_vars ) !== array( 'feed' ) && ! $wp_query->is_comment_feed() ) {
			return false;
		}

		return true;
	}

	/**
	 * Sets the 404 status code.
	 *
	 * @global WP_Query $wp_query
	 *
	 * @return void
	 */
	private function set_404() {
		global $wp_query;

		// Overwrite Content-Type header.
		if ( ! headers_sent() ) {
			header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ), true );
		}

		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}
}
