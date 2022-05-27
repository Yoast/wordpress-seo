<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds actions that cleanup unwanted rss feed links.
 */
class Crawl_Cleanup_Rss implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Crawl Cleanup RSS integration constructor.
	 *
	 * @param Options_Helper $options_helper The option helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Register our RSS related hooks.
	 */
	public function register_hooks() {
		if ( $this->is_true( 'remove_feed_global' ) ) {
			\add_action( 'feed_links_show_posts_feed', '__return_false' );
		}
		\add_action( 'wp', [ $this, 'maybe_disable_feeds' ] );
		\add_action( 'wp', [ $this, 'maybe_redirect_feeds' ], - 10000 );
	}

	/**
	 * Disable feeds on selected cases.
	 */
	public function maybe_disable_feeds() {
		if ( \is_singular() && $this->is_true( 'remove_feed_post_comments' ) ) {
			\remove_action( 'wp_head', 'feed_links_extra', 3 );
		}
		elseif (
			( \is_category() && $this->is_true( 'remove_feed_categories' ) )
			|| ( \is_tag() && $this->is_true( 'remove_feed_tags' ) )
			|| ( \is_tax() && $this->is_true( 'remove_feed_custom_taxonomies' ) )
		) {
			\remove_action( 'wp_head', 'feed_links_extra', 3 );
		}
	}

	/**
	 * Redirect feeds we don't want away.
	 */
	public function maybe_redirect_feeds() {
		global $wp_query;

		if ( ! \is_feed() ) {
			return;
		}

		if ( \in_array( \get_query_var( 'feed' ), [ 'atom', 'rdf' ], true ) && $this->is_true( 'remove_atom_rdf_feeds' ) ) {
			$this->redirect_feed( \home_url(), 'We disable Atom/RDF feeds for performance reasons.' );
		}
		// Only if we're on the global feed, the query is _just_ `'feed' => 'feed'`, hence this check.
		elseif ( $wp_query->query === [ 'feed' => 'feed' ] && $this->is_true( 'remove_feed_global' ) ) {
			$this->redirect_feed( \home_url(), 'We disable the RSS feed for performance reasons.' );
		}
		elseif ( \is_comment_feed() && \is_singular() && $this->is_true( 'remove_feed_post_comments' ) ) {
			$url = \get_permalink( \get_queried_object() );
			$this->redirect_feed( $url, 'We disable post comment feeds for performance reasons.' );
		}
		elseif (
			( \is_category() && $this->is_true( 'remove_feed_categories' ) )
			|| ( \is_tag() && $this->is_true( 'remove_feed_tags' ) )
			|| ( \is_tax() && $this->is_true( 'remove_feed_custom_taxonomies' ) )
		) {
			$term = \get_queried_object();
			$url  = \get_term_link( $term, $term->taxonomy );
			if ( \is_wp_error( $url ) ) {
				$url = \home_url();
			}
			$this->redirect_feed( $url, 'We disable taxonomy feeds for performance reasons.' );
		}
	}

	/**
	 * Sends a cache control header.
	 *
	 * @param int $expiration The expiration time.
	 */
	public function cache_control_header( $expiration ) {
		\header_remove( 'Expires' );

		// The cacheability of the current request. 'public' allows caching, 'private' would not allow caching by proxies like CloudFlare.
		$cacheability = 'public';
		$format       = '%1$s, max-age=%2$d, s-maxage=%2$d, stale-while-revalidate=120, stale-if-error=14400';

		if ( \is_user_logged_in() ) {
			$expiration   = 0;
			$cacheability = 'private';
			$format       = '%1$s, max-age=%2$d';
		}

		\header( \sprintf( 'Cache-Control: ' . $format, $cacheability, $expiration ), true );
	}

	/**
	 * Redirect a feed result to somewhere else.
	 *
	 * @param string $url    The location we're redirecting to.
	 * @param string $reason The reason we're redirecting.
	 */
	private function redirect_feed( $url, $reason ) {
		\header_remove( 'Content-Type' );
		\header_remove( 'Last-Modified' );

		$this->cache_control_header( 7 * DAY_IN_SECONDS );

		\wp_safe_redirect( $url, 301, 'Yoast SEO: ' . $reason );
		exit;
	}

	/**
	 * Checks if the value of an option is set to true.
	 *
	 * @param string $option_name The option name.
	 *
	 * @return bool
	 */
	private function is_true( $option_name ) {
		return $this->options_helper->get( $option_name ) === true;
	}
}
