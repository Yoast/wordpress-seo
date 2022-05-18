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
		if ( $this->options_helper->get( 'remove_feed_post_comments' ) === true ) {
			// Replace core's feed_links_extra with our own which allows us control over which feeds to show.
			remove_action( 'wp_head', 'feed_links_extra', 3 );
			add_action( 'wp_head', [ $this, 'feed_links_extra_replacement' ], 3 );
		}

		// Redirect the ones we don't want to exist.
		add_action( 'wp', [ $this, 'redirect_unwanted_feeds' ], - 10000 );
	}

	/**
	 * Adapted from `feed_links_extra` in WP core, this is a version that allows us to control which feeds to show.
	 *
	 * @param array $args Optional arguments.
	 */
	public function feed_links_extra_replacement( $args = array() ) {
		$defaults = [
			/* translators: Separator between blog name and feed type in feed links. */
			'separator'     => _x( '&raquo;', 'feed link', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Post title. */
			'singletitle'   => __( '%1$s %2$s %3$s Comments Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Category name. */
			'cattitle'      => __( '%1$s %2$s %3$s Category Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Tag name. */
			'tagtitle'      => __( '%1$s %2$s %3$s Tag Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Term name, 4: Taxonomy singular name. */
			'taxtitle'      => __( '%1$s %2$s %3$s %4$s Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Author name. */
			'authortitle'   => __( '%1$s %2$s Posts by %3$s Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Search query. */
			'searchtitle'   => __( '%1$s %2$s Search Results for &#8220;%3$s&#8221; Feed', 'wordpress-seo' ),
			/* translators: 1: Blog name, 2: Separator (raquo), 3: Post type name. */
			'posttypetitle' => __( '%1$s %2$s %3$s Feed', 'wordpress-seo' ),
		];

		$args = \wp_parse_args( $args, $defaults );

		if ( \is_singular() ) {
			return;
		}
		elseif ( \is_post_type_archive() ) {
			$post_type = get_query_var( 'post_type' );
			if ( \is_array( $post_type ) ) {
				$post_type = reset( $post_type );
			}

			$post_type_obj = \get_post_type_object( $post_type );
			$title         = \sprintf( $args['posttypetitle'], \get_bloginfo( 'name' ), $args['separator'], $post_type_obj->labels->name );
			$href          = \get_post_type_archive_feed_link( $post_type_obj->name );
		}
		elseif ( \is_category() ) {
			$term = \get_queried_object();

			if ( $term ) {
				$title = \sprintf( $args['cattitle'], \get_bloginfo( 'name' ), $args['separator'], $term->name );
				$href  = \get_category_feed_link( $term->term_id );
			}
		}
		elseif ( \is_tag() ) {
			$term = \get_queried_object();

			if ( $term ) {
				$title = \sprintf( $args['tagtitle'], \get_bloginfo( 'name' ), $args['separator'], $term->name );
				$href  = \get_tag_feed_link( $term->term_id );
			}
		}
		elseif ( is_tax() ) {
			$term = get_queried_object();

			if ( $term ) {
				$tax   = \get_taxonomy( $term->taxonomy );
				$title = \sprintf( $args['taxtitle'], \get_bloginfo( 'name' ), $args['separator'], $term->name, $tax->labels->singular_name );
				$href  = \get_term_feed_link( $term->term_id, $term->taxonomy );
			}
		}
		elseif ( \is_author() ) {
			$author_id = (int) \get_query_var( 'author' );

			$title = \sprintf( $args['authortitle'], \get_bloginfo( 'name' ), $args['separator'], \get_the_author_meta( 'display_name', $author_id ) );
			$href  = \get_author_feed_link( $author_id );
		}
		elseif ( \is_search() ) {
			$title = \sprintf( $args['searchtitle'], \get_bloginfo( 'name' ), $args['separator'], \get_search_query( false ) );
			$href  = \get_search_feed_link();
		}

		if ( isset( $title ) && isset( $href ) ) {
			echo '<link rel="alternate" type="' . \esc_attr( \feed_content_type() ) . '" title="' . \esc_attr( $title ) . '" href="' . \esc_url( $href ) . '" />' . "\n";
		}
	}

	/**
	 * Redirect feeds we don't want away.
	 */
	public function redirect_unwanted_feeds() {
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
