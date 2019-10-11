<?php
/**
 * A helper object for the rel "next" and "prev" meta tags.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\Wrappers\WP_Rewrite_Wrapper;

/**
 * Class Rel_Adjacent_Helper
 */
class Rel_Adjacent_Helper {

	/**
	 * @var WP_Rewrite_Wrapper WP_Rewrite wrapper.
	 */
	private $wp_rewrite_wrapper;

	/**
	 * Rel_Adjacent_Helper constructor.
	 *
	 * @param WP_Rewrite_Wrapper $wp_rewrite_wrapper The rewrite wrapper.
	 */
	public function __construct( WP_Rewrite_Wrapper $wp_rewrite_wrapper ) {
		$this->wp_rewrite_wrapper = $wp_rewrite_wrapper;
	}

	/**
	 * Checks whether adjacent rel links are disabled.
	 */
	public function is_disabled() {
		/**
		 * Filter: 'wpseo_disable_adjacent_rel_links' - Allows disabling of Yoast adjacent links if this is being handled by other code.
		 *
		 * @api bool $links_generated Indicates if other code has handled adjacent links.
		 */
		return \apply_filters( 'wpseo_disable_adjacent_rel_links', false );
	}

	/**
	 * Build a paginated URL.
	 *
	 * @param string $url             The un-paginated URL of the current archive.
	 * @param string $page            The page number to add on to $url for the $link tag.
	 * @param string $query_arg       Optional. The argument to use to set for the page to load.
	 * @param string $pagination_base Optional. Used for the front page.
	 *
	 * @return string The paginated URL.
	 */
	public function get_paginated_url( $url, $page, $query_arg = 'paged', $pagination_base = '' ) {
		if ( $this->wp_rewrite_wrapper->get()->using_permalinks() ) {
			return \user_trailingslashit( \trailingslashit( $url ) . $pagination_base . $page );
		}
		else {
			return \add_query_arg( $query_arg, $page, $url );
		}
	}
}
