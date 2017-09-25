<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Registers the filter for filtering posts by cornerstone content.
 */
class WPSEO_Cornerstone_Filter extends WPSEO_Abstract_Post_Filter {

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return {string} The query value this filter uses.
	 */
	public function get_query_val() {
		return 'cornerstone';
	}

	/**
	 * Modify the query based on the seo_filter variable in $_GET
	 *
	 * @param string $where Query variables.
	 *
	 * @return string The modified query.
	 */
	public function filter_posts( $where ) {
		if ( $this->is_filter_active() ) {
			global $wpdb;

			$where .= sprintf(
				' AND ' . $wpdb->posts . '.ID IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%s" AND meta_value = "1" ) ',
				WPSEO_Cornerstone::META_NAME
			);
		}

		return $where;
	}

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	protected function get_label() {
		return __( 'Cornerstone content', 'wordpress-seo' );
	}

	/**
	 * Returns a text explaining this filter.
	 *
	 * @return string The explanation.
	 */
	protected function get_explanation() {
		return sprintf(
			/* translators: %1$s expands anchor to knowledge base article, %2$s expands to </a> */
			__( 'You can mark the most important articles or pages on your website as \'cornerstone content\' to improve your site structure. %1$sRead more about cornerstone content%2$s.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1i9' ) . '" target="_blank">',
			'</a>'
		);
	}

	/**
	 * Returns the total amount of articles marked as cornerstone content.
	 *
	 * @return integer
	 */
	protected function get_post_total() {
		global $wpdb;

		return (int) $wpdb->get_var(
			$wpdb->prepare( '
				SELECT COUNT( 1 )
				FROM ' . $wpdb->postmeta . '
				WHERE post_id IN( SELECT ID FROM ' . $wpdb->posts . ' WHERE post_type = "%s" ) && 
				meta_value = "1" AND meta_key = "%s"
				',
				$this->get_current_post_type(),
				WPSEO_Cornerstone::META_NAME
			)
		);
	}
}
