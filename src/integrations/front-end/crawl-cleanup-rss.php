<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Class name is just very long
/**
 * Adds customizations to the front end for breadcrumbs.
 *
 */
class Crawl_Cleanup_Rss_Integration implements Integration_Interface {

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
		$this->options_helper   = $options_helper;
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
	 * Registers our RSS related shortcode.
	 *
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		if ( \is_singular() && $this->options_helper->get( 'remove_feed_post_comments' ) === true ) {
			// Replace core's feed_links_extra with our own which allows us control over which feeds to show.
			remove_action( 'wp_head', 'feed_links_extra', 3 );
		}
	}

	/**
	 * Sends a cache control header.
	 *
	 * @param int $expiration The expiration time.
	 */
	public function cache_control_header( int $expiration ): void {
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
	 * Retrieves the queried post type.
	 *
	 * @return string The queried post type.
	 */
	private function get_queried_post_type(): string {
		$post_type = \get_query_var( 'post_type' );
		if ( \is_array( $post_type ) ) {
			$post_type = \reset( $post_type );
		}
		return $post_type;
	}

	/**
	 * Redirect a feed result to somewhere else.
	 *
	 * @param string $url    The location we're redirecting to.
	 * @param string $reason The reason we're redirecting.
	 */
	private function redirect_feed( string $url, string $reason ): void {
		\header_remove( 'Content-Type' );
		\header_remove( 'Last-Modified' );

		$this->cache_control_header( 7 * DAY_IN_SECONDS );

		\wp_safe_redirect( $url, 301, 'Yoast Crawl Cleanup: ' . $reason );
		exit;
	}
}
