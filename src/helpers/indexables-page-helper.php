<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * A helper object for the indexable page.
 */
class Indexables_Page_Helper {

	/**
	 * Indexables_Page_Helper constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

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
		return \apply_filters( 'wpseo_indexables_list_size', 5 );
	}

	/**
	 * Retrieves the size of the buffer for the Indexables lists. This size is the amount of indexables that are fetched upon page load and it's by default 20 times bigger than the listed items.
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_buffer_size() {
		/**
		 * Filter 'wpseo_indexables_buffer_size' - Allow filtering the size of the buffer for the Indexables lists.
		 *
		 * @api int The size of the buffer for the Indexables lists.
		 */
		$times = \apply_filters( 'wpseo_indexables_buffer_size', 20 );
		if ( $times < 3 ) {
			$times = 3;
		}

		return ( $this->get_indexables_list_size() * intval( $times ) );
	}

	/**
	 * Checks if link suggestions are enabled or not
	 *
	 * @return bool Wether enable_link_suggestions is set to true or not.
	 */
	public function get_link_suggestions_enabled() {
		return $this->options->get( 'enable_link_suggestions', false ) === true;
	}
}
