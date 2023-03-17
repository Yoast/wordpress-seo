<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;

/**
 * Class Crawl_Cleanup_Helper.
 *
 * Used by the Crawl_Cleanup_Permalinks class.
 */
class Crawl_Cleanup_Helper {

	/**
	 * The current page helper
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * The Redirect_Helper.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect_helper;

	/**
	 * Crawl Cleanup Basic integration constructor.
	 *
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 * @param Options_Helper      $options_helper      The option helper.
	 * @param Url_Helper          $url_helper          The URL helper.
	 */
	public function __construct(
		Current_Page_Helper $current_page_helper,
		Options_Helper $options_helper,
		Url_Helper $url_helper,
		Redirect_Helper $redirect_helper
	) {
		$this->current_page_helper = $current_page_helper;
		$this->options_helper      = $options_helper;
		$this->url_helper          = $url_helper;
		$this->redirect_helper     = $redirect_helper;
	}

	/**
	 * Checks if the current URL is not robots, sitemap, empty or user is logged in.
	 *
	 * @return bool True if the current URL is a valid URL.
	 */
	public function avoid_redirect() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing anything yet...
		if ( \is_robots() || \get_query_var( 'sitemap' ) || empty( $_GET ) || \is_user_logged_in() ) {
			return true;
		}
		return false;
	}

	/**
	 * Returns the list of the allowed extra vars.
	 *
	 * @return array The list of the allowed extra vars.
	 */
	public function get_allowed_extravars() {
		/**
		 * Filter: 'Yoast\WP\SEO\allowlist_permalink_vars' - Allows plugins to register their own variables not to clean.
		 *
		 * @since 19.2.0
		 *
		 * @param array $allowed_extravars The list of the allowed vars (empty by default).
		 */
		$allowed_extravars = \apply_filters( 'Yoast\WP\SEO\allowlist_permalink_vars', [] );

		$clean_permalinks_extra_variables = $this->options_helper->get( 'clean_permalinks_extra_variables' );

		if ( $clean_permalinks_extra_variables !== '' ) {
			$allowed_extravars = \array_merge( $allowed_extravars, \explode( ',', $clean_permalinks_extra_variables ) );
		}
		return $allowed_extravars;
	}

	/**
	 * Gets the allowed query vars from the current URL.
	 *
	 * @param string $current_url The current URL.
	 *
	 * @return array is_allowed and allowed_query.
	 */
	public function allowed_params( $current_url ) {
		// This is a Premium plugin-only function: Allows plugins to register their own variables not to clean.
		$allowed_extravars = $this->get_allowed_extravars();

		$allowed_query = [];

		$parsed_url = \wp_parse_url( $current_url, \PHP_URL_QUERY );

		$query = $this->url_helper->parse_str_params( $parsed_url );

		if ( ! empty( $allowed_extravars ) ) {
			foreach ( $allowed_extravars as $get ) {
				$get = \trim( $get );
				if ( isset( $query[ $get ] ) ) {
					$allowed_query[ $get ] = \rawurlencode_deep( $query[ $get ] );
					unset( $query[ $get ] );
				}
			}
		}
		return [
			'query'         => $query,
			'allowed_query' => $allowed_query,
		];
	}

	/**
	 * Returns the proper URL for singular pages.
	 *
	 * @return string The proper URL.
	 */
	public function singular_url() {

		global $post;
		$proper_url = \get_permalink( $post->ID );
		$page       = \get_query_var( 'page' );

		if ( $page && $page !== 1 ) {
			$the_post   = \get_post( $post->ID );
			$page_count = \substr_count( $the_post->post_content, '<!--nextpage-->' );
			$proper_url = \user_trailingslashit( \trailingslashit( $proper_url ) . $page );
			if ( $page > ( $page_count + 1 ) ) {
				$proper_url = \user_trailingslashit( \trailingslashit( $proper_url ) . ( $page_count + 1 ) );
			}
		}

		// Fix reply to comment links, whoever decided this should be a GET variable?
        // phpcs:ignore WordPress.Security -- We know this is scary.
		if ( isset( $_SERVER['REQUEST_URI'] ) && \preg_match( '`(\?replytocom=[^&]+)`', \sanitize_text_field( $_SERVER['REQUEST_URI'] ), $matches ) ) {
			$proper_url .= \str_replace( '?replytocom=', '#comment-', $matches[0] );
		}
		unset( $matches );

		return $proper_url;
	}

	/**
	 * Tests singular_url.
	 *
	 * @covers ::singular_url
	 *
	 * @dataProvider singular_url_provider
	 *
	 * @param $permalink the permalink.
	 * @param int                     $page param.
	 * @param string                  $server_request_uri $_SERVER['REQUEST_URI'].
	 * @param string                  $expected expected return value.
	 */
	public function test_singular_url( $permalink, $page, $server_request_uri, $content, $expected ) {

		global $post;
		$post = Mockery::mock( WP_Post::class );

		$post->ID           = 108;
		$post->post_content = $content;

		$_SERVER['REQUEST_URI'] = $server_request_uri;

		Monkey\Functions\stubs(
			[
				'get_permalink' => $permalink,
				'get_query_var' => $page,
				'get_post'      => $post,

			]
		);

		$this->assertSame( $expected, $this->instance->singular_url() );
	}

	/**
	 *
	 * Data provider for test_singular_url.
	 *
	 * @return array $permalink, $page, $server_request_uri, $content ,$expected.
	 */
	public function singular_url_provider() {
		return [
			[ 'http://basic.wordpress.test/products/108', 0, null, null, 'http://basic.wordpress.test/products/108' ],
			[ 'http://basic.wordpress.test/products/108', 0, 'http://basic.wordpress.test/products/108?replytocom=123', null, 'http://basic.wordpress.test/products/108#comment-123' ],
			[ 'http://basic.wordpress.test/?page_id=123', 2, 'http://basic.wordpress.test/?page_id=123&unknown=123', '<!--nextpage--><!--nextpage--><!--nextpage-->', 'http://basic.wordpress.test/?page_id=123/2/' ],
			[ 'http://basic.wordpress.test/?page_id=123', 2, 'http://basic.wordpress.test/?page_id=123&unknown=123', '', 'http://basic.wordpress.test/?page_id=123/2/1/' ],
		];
	}

	/**
	 * Returns the proper URL for front page.
	 *
	 * @return string The proper URL.
	 */
	public function front_page_url() {
		if ( $this->current_page_helper->is_home_posts_page() ) {
			return \home_url( '/' );
		}
		if ( $this->current_page_helper->is_home_static_page() ) {
			return \get_permalink( $GLOBALS['post']->ID );
		}
		return '';
	}

		/**
		 * Returns the proper URL for 404 page.
		 *
		 * @return string The proper URL.
		 */
	public function page_not_found_url( $current_url ) {
		if ( ! \is_multisite() || \is_subdomain_install() || ! \is_main_site() ) {
			return '';
		}

		if ( $current_url !== \home_url() . '/blog/' && $current_url !== \home_url() . '/blog' ) {
			return '';
		}

		if ( $this->current_page_helper->is_home_static_page() ) {
			return \get_permalink( \get_option( 'page_for_posts' ) );
		}

		return \home_url();
	}

	/**
	 * Returns the proper URL for taxonomy page.
	 *
	 * @return string The proper URL.
	 */
	public function taxonomy_url() {
		global $wp_query;
		$term = $wp_query->get_queried_object();

		if ( \is_feed() ) {
			return \get_term_feed_link( $term->term_id, $term->taxonomy );
		}
		return \get_term_link( $term, $term->taxonomy );
	}

	/**
	 * Returns the proper URL for search page.
	 *
	 * @return string The proper URL.
	 */
	public function search_url() {
		$s = \get_search_query();
		return \home_url() . '/?s=' . \rawurlencode( $s );
	}
}
