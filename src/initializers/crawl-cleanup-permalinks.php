<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;

/**
 * Class Crawl_Cleanup_Permalinks.
 */
class Crawl_Cleanup_Permalinks implements Initializer_Interface {

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
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function initialize() {
		// We need to hook after 10 because otherwise our options helper isn't available yet.
		\add_action( 'plugins_loaded', [ $this, 'register_hooks' ], 15 );
	}

	/**
	 * Hooks our required hooks.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( $this->options_helper->get( 'clean_campaign_tracking_urls' ) && ! empty( \get_option( 'permalink_structure' ) ) ) {
			\add_action( 'template_redirect', [ $this, 'utm_redirect' ], 0 );
		}
		if ( $this->options_helper->get( 'clean_permalinks' ) && ! empty( \get_option( 'permalink_structure' ) ) ) {
			\add_action( 'template_redirect', [ $this, 'clean_permalinks' ], 1 );
		}
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Redirect utm variables away.
	 */
	public function utm_redirect() {
		// Prevents WP CLI from throwing an error.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( ! isset( $_SERVER['REQUEST_URI'] ) || \strpos( $_SERVER['REQUEST_URI'], '?' ) === false ) {
			return;
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		if ( ! \stripos( $_SERVER['REQUEST_URI'], 'utm_' ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$parsed = \wp_parse_url( $_SERVER['REQUEST_URI'] );

		$query      = \explode( '&', $parsed['query'] );
		$utms       = [];
		$other_args = [];


		foreach ( $query as $query_arg ) {
			if ( \stripos( $query_arg, 'utm_' ) === 0 ) {
				$utms[] = $query_arg;
				continue;
			}
			$other_args[] = $query_arg;
		}

		if ( empty( $utms ) ) {
			return;
		}

		$other_args_str = '';
		if ( \count( $other_args ) > 0 ) {
			$other_args_str = '?' . \implode( '&', $other_args );
		}

		$new_path = $parsed['path'] . $other_args_str . '#' . \implode( '&', $utms );

		$message = \sprintf(
			/* translators: %1$s: Yoast SEO */
			\__( '%1$s: redirect utm variables to #', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$this->redirect_helper->do_safe_redirect( \trailingslashit( $this->url_helper->recreate_current_url( false ) ) . \ltrim( $new_path, '/' ), 301, $message );

		return;
	}

	/**
	 * Removes unneeded query variables from the URL.
	 *
	 * @return void
	 */
	public function clean_permalinks() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing anything yet...
		if ( $this->clean_permalinks_avoid_redirect() ) {
			return;
		}

		$current_url    = $this->url_helper->recreate_current_url();
		$allowed_params = $this->allowed_params( $current_url );

		// If we had only allowed params, let's just bail out, no further processing needed.
		if ( empty( $allowed_params['query'] ) ) {
			return;
		}

		global $wp_query;

		$proper_url = '';

		if ( \is_singular() ) {
			// Prevent cleaning out posts & page previews for people capable of viewing them.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We know this is scary.
			if ( isset( $_GET['preview'] ) && isset( $_GET['preview_nonce'] ) && \current_user_can( 'edit_post' ) ) {
				return;
			}
			$proper_url = $this->singular_url();
		}
		elseif ( \is_front_page() ) {
			$proper_url = $this->front_page_url();
		}
		elseif ( $this->current_page_helper->is_posts_page() ) {
			$proper_url = \get_permalink( \get_option( 'page_for_posts' ) );
		}
		elseif ( \is_category() || \is_tag() || \is_tax() ) {
			$proper_url = $this->taxonomy_url();
		}
		elseif ( \is_search() ) {
			$proper_url = $this->search_url();
		}
		elseif ( \is_404() ) {
			$proper_url = $this->page_not_found_url( $current_url );
		}
		if ( ! empty( $proper_url ) && $wp_query->query_vars['paged'] !== 0 && $wp_query->post_count !== 0 ) {
			if ( \is_search() ) {
				$proper_url = \get_bloginfo( 'url' ) . '/page/' . $wp_query->query_vars['paged'] . '/?s=' . \rawurlencode( \get_search_query() );
			}
			else {
				$proper_url = \user_trailingslashit( \trailingslashit( $proper_url ) . 'page/' . $wp_query->query_vars['paged'] );
			}
		}

		$proper_url = \add_query_arg( $allowed_params['allowed_query'], $proper_url );

		if ( ! empty( $proper_url ) && $current_url !== $proper_url ) {
			\header( 'Content-Type: redirect', true );
			\header_remove( 'Content-Type' );
			\header_remove( 'Last-Modified' );
			\header_remove( 'X-Pingback' );

			$message = \sprintf(
				/* translators: %1$s: Yoast SEO */
				\__( '%1$s: unregistered URL parameter removed', 'wordpress-seo' ),
				'Yoast SEO'
			);

			$this->redirect_helper->do_safe_redirect( $proper_url, 301, $message );
			return;
		}
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
		 * Note: This is a Premium plugin-only hook.
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

		// @todo parse_str changes spaces in param names into `_`, we should find a better way to support them.
		\wp_parse_str( $parsed_url, $query );

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
	 * Checks if the current URL is not robots, sitemap, empty or user is logged in.
	 *
	 * @return bool True if the current URL is a valid URL.
	 */
	public function clean_permalinks_avoid_redirect() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- We're not processing anything yet...
		if ( \is_robots() || \get_query_var( 'sitemap' ) || empty( $_GET ) || \is_user_logged_in() ) {
			return true;
		}
		return false;
	}

	/**
	 * Returns the proper URL for singular pages.
	 *
	 * @return string The proper URL.
	 */
	public function singular_url() {

			global $post;
			$proper_url = \get_permalink( $post->ID );

			$page = \get_query_var( 'page' );
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

	/**
	 * Returns the proper URL for 404 page.
	 *
	 * @return string The proper URL.
	 */
	public function page_not_found_url( $current_url ) {
		if ( !\is_multisite() || \is_subdomain_install() || !\is_main_site() ) {
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

}
