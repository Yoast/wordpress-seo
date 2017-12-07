<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Class that has functions to ease detection of certain states in the WP query.
 */
class WPSEO_Query {
	/**
	 * Determine whether this is the homepage and shows posts.
	 *
	 * @return bool
	 */
	public static function is_home_posts_page() {
		return ( is_home() && 'posts' === get_option( 'show_on_front' ) );
	}

	/**
	 * Determine whether the this is the static frontpage.
	 *
	 * @return bool
	 */
	public static function is_home_static_page() {
		return ( is_front_page() && 'page' === get_option( 'show_on_front' ) && is_page( get_option( 'page_on_front' ) ) );
	}

	/**
	 * Determine whether this is the posts page, when it's not the frontpage.
	 *
	 * @return bool
	 */
	public static function is_posts_page() {
		return ( is_home() && 'page' === get_option( 'show_on_front' ) );
	}

	/**
	 * Check if term archive query is for multiple terms (/term-1,term2/ or /term-1+term-2/).
	 *
	 * @return bool
	 */
	public static function is_multiple_terms_query() {

		global $wp_query;

		if ( ! is_tax() && ! is_tag() && ! is_category() ) {
			return false;
		}

		$term          = get_queried_object();
		$queried_terms = $wp_query->tax_query->queried_terms;

		if ( empty( $queried_terms[ $term->taxonomy ]['terms'] ) ) {
			return false;
		}

		return count( $queried_terms[ $term->taxonomy ]['terms'] ) > 1;
	}
}
