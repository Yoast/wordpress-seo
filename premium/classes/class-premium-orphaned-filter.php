<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Registers the filter for filtering posts by orphaned content.
 */
class WPSEO_Premium_Orphaned_Filter implements WPSEO_WordPress_Integration {

	const FILTER_QUERY_ARG = 'yoast_orphaned';

	/**
	 * @var string
	 */
	var $link_table_name = null;

	/**
	 * Registers the hook.
	 */
	public function register_hooks() {
		foreach ( $this->get_post_types() as $post_type ) {
			add_filter( 'views_edit-' . $post_type, array( $this, 'add_filter_link' ) );
		}

		add_filter( 'posts_where', array( $this, 'filter_posts' ) );
	}

	/**
	 * Adds a filter link to the views.
	 *
	 * @param array $views Array with the views.
	 *
	 * @return array
	 */
	public function add_filter_link( array $views ) {

		$orphaned_url = $this->get_orphaned_url();

		$views['yoast_orphaned'] = sprintf(
			'<a href="%1$s" class="%2$s">%3$s</a> (%4$s)',
			esc_url( $orphaned_url ),
			( $this->is_orphaned_filter_active() ) ? 'current' : '',
			__( 'Orphaned content', 'wordpress-seo' ),
			$this->get_orphaned_total()
		);

		return $views;
	}

	/**
	 * Modify the query based on the seo_filter variable in $_GET
	 *
	 * @param array $where Query variables.
	 *
	 * @return array
	 */
	public function filter_posts( $where ) {
		if ( $this->is_orphaned_filter_active() ) {
			global $wpdb;

			$where .= ' AND ' . $wpdb->posts . '.ID NOT IN( SELECT post_id FROM ' .$this->get_link_table_name() . ' UNION SELECT target_post_id FROM ' .$this->get_link_table_name() . ' ) ';
		}

		return $where;
	}

	/**
	 * Removes the post_type from the REQUEST URL because of the orphaned filter is in the same line.
	 * After removing the post_type it will add a query arg for filtering the orphaned content.
	 *
	 * @return string
	 */
	protected function get_orphaned_url() {
		$orphaned_url = remove_query_arg( array( 'post_status' ) );
		$orphaned_url = add_query_arg( self::FILTER_QUERY_ARG, '1', $orphaned_url );

		return $orphaned_url;
	}

	/**
	 * Returns the total amount of articles marked as orphaned content.
	 *
	 * @return integer
	 */
	protected function get_orphaned_total() {
		global $wpdb;

		return (int) $wpdb->get_var(
			$wpdb->prepare( '
				SELECT COUNT( 1 )
				FROM ' . $wpdb->posts . '
				WHERE ID NOT IN( SELECT post_id FROM ' . $this->get_link_table_name() . ' UNION SELECT target_post_id FROM ' . $this->get_link_table_name() . ' ) AND post_type = "%s" AND post_status = "publish"
				',
				$this->get_current_post_type()
			)
		);
	}

	/**
	 * Returns true when the orphaned filter is active.
	 *
	 * @return bool
	 */
	protected function is_orphaned_filter_active() {
		return ( filter_input( INPUT_GET, self::FILTER_QUERY_ARG ) === '1' );
	}

	/**
	 * Returns the current post type.
	 *
	 * @return string
	 */
	protected function get_current_post_type() {
		return filter_input(
			INPUT_GET, 'post_type', FILTER_DEFAULT, array(
				'options' => array( 'default' => 'post' ),
			)
		);
	}

	/**
	 * Returns the post types which can be used to set as orphaned content.
	 *
	 * @return array
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}

	protected function get_link_table_name() {
		if ( $this->link_table_name === null ) {
			$link_storage = new WPSEO_Link_Storage();
			$this->link_table_name = $link_storage->get_table_name();
		}

		return $this->link_table_name;
	}
}
