<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Represents the classifier for determine the type of the currently opened page.
 */
class WPSEO_Frontend_Page_Type {

	/**
	 * Checks if the currently opened page is a simple page.
	 *
	 * @return bool Whether the currently opened page is a simple page.
	 */
	public function is_simple_page() {
		return $this->get_simple_page_id() > 0;
	}

	/**
	 * Returns the id of the currently opened page.
	 *
	 * @return int The id of the currently opened page.
	 */
	public function get_simple_page_id() {
		if ( is_singular() ) {
			return get_the_ID();
		}

		if ( $this->is_posts_page() ) {
			return get_option( 'page_for_posts' );
		}

		/**
		 * Filter: Allow changing the default page id.
		 *
		 * @api int $page_id The default page id.
		 */
		return apply_filters( 'wpseo_frontend_page_type_simple_page_id', 0 );
	}

	/**
	 * Determine whether this is the homepage and shows posts.
	 *
	 * @return bool Whether or not the current page is the homepage that displays posts.
	 */
	public function is_home_posts_page() {
		return ( is_home() && get_option( 'show_on_front' ) === 'posts' );
	}

	/**
	 * Determine whether this is the static frontpage.
	 *
	 * @return bool Whether or not the current page is a static frontpage.
	 */
	public function is_home_static_page() {
		return ( is_front_page() && get_option( 'show_on_front' ) === 'page' && is_page( get_option( 'page_on_front' ) ) );
	}

	/**
	 * Determine whether this is the statically set posts page, when it's not the frontpage.
	 *
	 * @return bool Whether or not it's a non-frontpage, statically set posts page.
	 */
	public function is_posts_page() {
		return ( is_home() && get_option( 'show_on_front' ) === 'page' );
	}
}
