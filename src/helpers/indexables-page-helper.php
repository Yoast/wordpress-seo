<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the indexable page.
 */
class Indexables_Page_Helper {

	/**
	 * The default size of the indexable lists.
	 *
	 * @var int
	 */
	const LIST_SIZE = 5;

	/**
	 * The default size of the buffer, in terms of how many times is bigger than the list size.
	 *
	 * @var int
	 */
	const BUFFER_SIZE = 20;

	/**
	 * The default minimum threshold for the amount of posts in the site.
	 *
	 * @var int
	 */
	const POSTS_THRESHOLD = 20;

	/**
	 * Retrieves the size of the Indexables lists. This size is the amount of indexables that are displayed in each list.
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_indexables_list_size() {
		/**
		 * Filter 'wpseo_indexables_list_size' - Allow filtering the size of the Indexables lists.
		 *
		 * @api int The size of the Indexables lists.
		 */
		return \apply_filters( 'wpseo_indexables_list_size', self::LIST_SIZE );
	}

	/**
	 * Retrieves the size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size. This size is the amount of indexables that are fetched upon page load.
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_buffer_size() {
		/**
		 * Filter 'wpseo_indexables_buffer_size' - Allow filtering the size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size.
		 *
		 * @api int The size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size.
		 */
		$times = \apply_filters( 'wpseo_indexables_buffer_size', self::BUFFER_SIZE );
		if ( $times < 3 ) {
			$times = 3;
		}

		return ( $this->get_indexables_list_size() * intval( $times ) );
	}

	/**
	 * Retrieves the minimum threshold for the amount of posts in the site, in order for lists to be relevant.
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_minimum_posts_threshold() {
		/**
		 * Filter 'wpseo_posts_threshold' - Allow filtering the minimum threshold for the amount of posts in the site, in order for Indexable lists to be relevant.
		 *
		 * @api int The minimum threshold for the amount of posts in the site, in order for Indexable lists to be relevant.
		 */
		return \apply_filters( 'wpseo_posts_threshold', 20 );
	}
}
