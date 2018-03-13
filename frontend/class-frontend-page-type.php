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

		if ( is_home() && 'page' === get_option( 'show_on_front' ) ) {
			return get_option( 'page_for_posts' );
		}

		/**
		 * Filter: Allow changing the default page id.
		 *
		 * @api int $page_id The default page id.
		 */
		return apply_filters( 'wpseo_frontend_page_type_simple_page_id', 0 );
	}
}
