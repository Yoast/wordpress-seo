<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Registers the filter for filtering posts by orphaned content.
 */
class WPSEO_Premium_Orphaned_Filter extends WPSEO_Abstract_Post_Filter {

	/**
	 * @var string|null
	 */
	protected $link_table_name = null;

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return {string} The query value this filter uses.
	 */
	public function get_query_val() {
		return 'orphaned';
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

			$where .= ' AND ' . $wpdb->posts . '.ID NOT IN( SELECT post_id FROM ' . $this->get_link_table_name() . ' UNION SELECT target_post_id FROM ' . $this->get_link_table_name() . ' ) ';
		}

		return $where;
	}

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	protected function get_label() {
		return __( 'Orphaned content', 'wordpress-seo-premium' );
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
				FROM ' . $wpdb->posts . '
				WHERE ' . $wpdb->posts . '.ID NOT IN( SELECT post_id FROM ' . $this->get_link_table_name() . ' UNION SELECT target_post_id FROM ' . $this->get_link_table_name() . ' )
				AND ' . $wpdb->posts . '.post_type = "%s"
				AND ' . $wpdb->posts . '.post_status IN ("publish", "future", "draft", "pending", "private")
				',
				$this->get_current_post_type()
			)
		);
	}

	/**
	 * Returns the name of the Yoast link table.
	 *
	 * @return string The nameof the Yoast link table.
	 */
	protected function get_link_table_name() {
		if ( $this->link_table_name === null ) {
			$link_storage = new WPSEO_Link_Storage();
			$this->link_table_name = $link_storage->get_table_name();
		}

		return $this->link_table_name;
	}
}
