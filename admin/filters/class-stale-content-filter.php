<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Registers the filter for filtering stale content.
 */
class WPSEO_Stale_Content_Filter extends WPSEO_Abstract_Post_Filter {

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return string The query value this filter uses.
	 */
	public function get_query_val() {
		return 'stale-content';
	}

	/**
	 * Modifies the query based on the seo_filter variable in $_GET.
	 *
	 * @param string $where The where statement.
	 *
	 * @return string The modified query.
	 */
	public function filter_posts( $where ) {
		if ( ! $this->is_filter_active() ) {
			return $where;
		}

		global $wpdb;

		$where .= sprintf(
			' AND ' . $wpdb->posts . '.ID IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%s" AND meta_value = "1" ) AND ' . $wpdb->posts . '.post_modified < "%s" ',
			WPSEO_Meta::$meta_prefix . WPSEO_Cornerstone::META_NAME,
			$this->date_threshold()
		);

		return $where;
	}

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	protected function get_label() {
		return __( 'Stale content', 'wordpress-seo' );
	}

	/**
	 * Returns a text explaining this filter.
	 *
	 * @return string The explanation for this filter.
	 */
	protected function get_explanation() {
		$post_type_object = get_post_type_object( $this->get_current_post_type() );

		if ( $post_type_object === null ) {
			return null;
		}

		return sprintf(
		/* translators: %1$s expands to the posttype label, %2$s expands anchor to blog post about cornerstone content, %3$s expands to </a> */
			__( 'Stale content refers to cornerstone content that hasn’t been updated in the last 6 months. Make sure to keep these %s up-to-date. %2$sLearn more about cornerstone content%3$s.', 'wordpress-seo' ),
			strtolower( $post_type_object->labels->name ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1i9' ) . '" target="_blank">',
			'</a>'
		);
	}

	/**
	 * Returns the total amount of stale content.
	 *
	 * @return integer The total amount of stale content.
	 */
	protected function get_post_total() {
		global $wpdb;

		return (int) $wpdb->get_var(
			$wpdb->prepare( '
				SELECT COUNT( 1 )
				FROM ' . $wpdb->postmeta . '
				WHERE post_id IN( SELECT ID FROM ' . $wpdb->posts . ' WHERE post_type = %s && post_modified < %s ) &&
				meta_value = "1" AND meta_key = %s
				',
				$this->get_current_post_type(),
				$this->date_threshold(),
				WPSEO_Meta::$meta_prefix . WPSEO_Cornerstone::META_NAME
			)
		);
	}

	/**
	 * Returns the post types to which this filter should be added.
	 *
	 * @return array The post types to which this filter should be added.
	 */
	protected function get_post_types() {
		$post_types = apply_filters( 'wpseo_cornerstone_post_types', parent::get_post_types() );
		if ( ! is_array( $post_types ) ) {
			return array();
		}

		return $post_types;
	}

	/**
	 * Returns the date 6 months ago.
	 *
	 * @return string The formatted date.
	 */
	protected function date_threshold() {
		return gmdate( 'Y-m-d', strtotime( '-6months' ) );
	}
}
