<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Registers the filter for filtering posts by cornerstone content.
 */
class WPSEO_Cornerstone_Filter {

	const FILTER_QUERY_ARG = 'yoast_cornerstone';

	/**
	 * Registers the hook.
	 */
	public function register_hooks() {
		add_filter( 'views_edit-post', array( $this, 'add_filter_link' ) );
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

		$cornerstone_url = $this->get_cornerstone_url();

		$views['yoast_cornerstone'] = sprintf(
			'<a href="%1$s" class="%2$s" >%3$s</a> (%4$s)',
			esc_url( $cornerstone_url ),
			( $this->is_cornerstone_filter_active() ) ? 'current' : '',
			__( 'Cornerstone articles', 'wordpress-seo' ),
			$this->get_cornerstone_total()
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
		if ( $this->is_cornerstone_filter_active() ) {
			$where .= " AND ID IN( SELECT post_id FROM wp_postmeta WHERE meta_key = '" . WPSEO_Cornerstone::META_NAME . "' AND meta_value = 1 ) ";
		}

		return $where;
	}

	/**
	 * Removes the post_type from the REQUEST URL because of the cornerstone filter is in the same line.
	 * After removing the post_type it will add a query arg for filtering the cornerstone content.
	 *
	 * @return string
	 */
	protected function get_cornerstone_url() {
		$cornerstone_url = remove_query_arg( array( 'post_status' ) );
		$cornerstone_url = add_query_arg( self::FILTER_QUERY_ARG, '1', $cornerstone_url );

		return $cornerstone_url;
	}

	/**
	 * Returns the total amount of articles marked as cornerstone content.
	 *
	 * @return integer
	 */
	protected function get_cornerstone_total() {
		global $wpdb;

		// @codingStandardsIgnoreStart
		return (int) $wpdb->get_var( "
			SELECT COUNT( post_id )
			FROM   wp_postmeta
			WHERE  meta_key = '" . WPSEO_Cornerstone::META_NAME . "'
		" );
		// @codingStandardsIgnoreEnd
	}

	/**
	 * Returns true when the cornerstone filter is active.
	 *
	 * @return bool
	 */
	protected function is_cornerstone_filter_active() {
		return ( filter_input( INPUT_GET, self::FILTER_QUERY_ARG ) === '1' );
	}
}
