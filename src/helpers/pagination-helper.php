<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;
use Yoast\WP\SEO\Wrappers\WP_Rewrite_Wrapper;

/**
 * A helper object for pagination.
 *
 * Used for the canonical URL and the rel "next" and "prev" meta tags.
 */
class Pagination_Helper {

	/**
	 * Holds the WP rewrite wrapper instance.
	 *
	 * @var WP_Rewrite_Wrapper WP_Rewrite wrapper.
	 */
	protected $wp_rewrite_wrapper;

	/**
	 * Holds the WP query wrapper instance.
	 *
	 * @var WP_Query_Wrapper WP_Query wrapper.
	 */
	protected $wp_query_wrapper;

	/**
	 * Pagination_Helper constructor.
	 *
	 * @param WP_Rewrite_Wrapper $wp_rewrite_wrapper The rewrite wrapper.
	 * @param WP_Query_Wrapper   $wp_query_wrapper   The query wrapper.
	 */
	public function __construct(
		WP_Rewrite_Wrapper $wp_rewrite_wrapper,
		WP_Query_Wrapper $wp_query_wrapper
	) {
		$this->wp_rewrite_wrapper = $wp_rewrite_wrapper;
		$this->wp_query_wrapper   = $wp_query_wrapper;
	}

	/**
	 * Checks whether adjacent rel links are disabled.
	 *
	 * @return bool Whether adjacent rel links are disabled or not.
	 */
	public function is_rel_adjacent_disabled() {
		/**
		 * Filter: 'wpseo_disable_adjacent_rel_links' - Allows disabling of Yoast adjacent links if this is being handled by other code.
		 *
		 * @api bool $links_generated Indicates if other code has handled adjacent links.
		 */
		return \apply_filters( 'wpseo_disable_adjacent_rel_links', false );
	}

	/**
	 * Builds a paginated URL.
	 *
	 * @param string $url                   The un-paginated URL of the current archive.
	 * @param string $page                  The page number to add on to $url for the $link tag.
	 * @param bool   $add_pagination_base   Optional. Whether to add the pagination base (`page`) to the url.
	 * @param string $pagination_query_name Optional. The name of the query argument that holds the current page.
	 *
	 * @return string The paginated URL.
	 */
	public function get_paginated_url( $url, $page, $add_pagination_base = true, $pagination_query_name = 'page' ) {
		$wp_rewrite = $this->wp_rewrite_wrapper->get();

		if ( $wp_rewrite->using_permalinks() ) {
			$url_parts      = \wp_parse_url( $url );
			$has_url_params = \array_key_exists( 'query', $url_parts );

			if ( $has_url_params ) {
				// We need to first remove the query params, before potentially adding the pagination parts.
				\wp_parse_str( $url_parts['query'], $query_parts );

				$url = \trailingslashit( \remove_query_arg( \array_keys( $query_parts ), $url ) );

				if ( $add_pagination_base ) {
					$url .= \trailingslashit( $wp_rewrite->pagination_base );
				}

				// We can now re-add the query params, after appending the last pagination parts.
				return \add_query_arg( $query_parts, \user_trailingslashit( $url . $page ) );
			}

			$url = \trailingslashit( $url );
			if ( $add_pagination_base ) {
				$url .= \trailingslashit( $wp_rewrite->pagination_base );
			}

			return \user_trailingslashit( $url . $page );
		}

		return \add_query_arg( $pagination_query_name, $page, \user_trailingslashit( $url ) );
	}

	/**
	 * Gets the number of archive pages.
	 *
	 * @return int The number of archive pages.
	 */
	public function get_number_of_archive_pages() {
		$wp_query = $this->wp_query_wrapper->get_query();

		return (int) $wp_query->max_num_pages;
	}

	/**
	 * Returns the current page for paged archives.
	 *
	 * @return int The current archive page.
	 */
	public function get_current_archive_page_number() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return (int) $wp_query->get( 'paged' );
	}

	/**
	 * Returns the current page for paged post types.
	 *
	 * @return int The current post page.
	 */
	public function get_current_post_page_number() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return (int) $wp_query->get( 'page' );
	}

	/**
	 * Returns the current page number.
	 *
	 * @return int The current page number.
	 */
	public function get_current_page_number() {
		// Get the page number for an archive page.
		$page_number = \get_query_var( 'paged', 1 );
		if ( $page_number > 1 ) {
			return $page_number;
		}

		// Get the page number for a page in a paginated post.
		return \get_query_var( 'page', 1 );
	}
}
