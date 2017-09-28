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
	 * Modifies the query based on the seo_filter variable in $_GET
	 *
	 * @param string $where Query variables.
	 *
	 * @return string The modified query.
	 */
	public function filter_posts( $where ) {
		if ( $this->is_filter_active() ) {
			global $wpdb;

			$where .= ' AND ' . $wpdb->posts . '.ID IN ( ' . $this->get_subquery() . ' ) ';
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
	 * Returns the total amount of articles that are orphaned content.
	 *
	 * @return integer
	 */
	protected function get_post_total() {
		global $wpdb;

		return (int) $wpdb->get_var(
			$wpdb->prepare('
				SELECT COUNT(id)
				FROM ' . $wpdb->posts . '
				WHERE  ' . $wpdb->posts . '.ID IN (' . $this->get_subquery() . ')
				AND ' . $wpdb->posts . '.post_status IN ("publish", "future", "pending", "private")
				AND ' . $wpdb->posts . '.post_type = %s;',
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
			$link_storage = new WPSEO_Meta_Storage();
			$this->link_table_name = $link_storage->get_table_name();
		}

		return $this->link_table_name;
	}

	/**
	 * Returns a query that gets all IDs of objects that have no incoming or outgoing links.
	 *
	 * @return string The query.
	 */
	protected function get_subquery() {
		return 'SELECT object_id
				FROM ' . $this->get_link_table_name() . '
				WHERE ' . $this->get_link_table_name() . '.internal_link_count = 0
				AND ( ' . $this->get_link_table_name() . '.incoming_link_count IS NULL
				OR ' . $this->get_link_table_name() . '.incoming_link_count = 0 )';
	}
}
