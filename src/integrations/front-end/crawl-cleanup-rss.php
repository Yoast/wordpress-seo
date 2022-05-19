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
	 *
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\add_action( 'wp', [ $this, 'maybe_disable_feeds' ] );
		\add_action( 'wp', [ $this, 'maybe_redirect_feeds' ], - 10000 );
	}

	/**
	 * Disable feeds on selected cases.
	 */
	public function maybe_disable_feeds() {
		if ( \is_singular() && $this->options_helper->get( 'remove_feed_post_comments' ) === true ) {
			\remove_action( 'wp_head', 'feed_links_extra', 3 );
		}
	}

	/**
	 * Redirect feeds we don't want away.
	 */
	public function maybe_redirect_feeds() {
		if ( ! \is_feed() ) {
			return;
		}

		if ( \is_comment_feed() && \is_singular() && $this->options_helper->get( 'remove_feed_post_comments' ) === true ) {
			$url = \get_permalink( \get_queried_object() );
			$this->redirect_feed( $url, 'We disable post comment feeds for performance reasons.' );
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
}
