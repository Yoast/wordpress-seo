<?php
/**
 * @package WPSEO\Admin\Filters
 */

/**
 * Class WPSEO_Abstract_Post_Filter
 */
abstract class WPSEO_Abstract_Post_Filter implements WPSEO_WordPress_Integration {

	const FILTER_QUERY_ARG = 'yoast_filter';

	/**
	 * Modify the query based on the FILTER_QUERY_ARG variable in $_GET
	 *
	 * @param array $where Query variables.
	 *
	 * @return array The modified query.
	 */
	public abstract function filter_posts( $where );

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return {string} The query value this filter uses.
	 */
	public abstract function get_query_val();

	/**
	 * Returns the total number of posts that match this filter.
	 *
	 * @return number The total number of posts that match this filter.
	 */
	protected abstract function get_post_total();

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	protected abstract function get_label();

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
		$views[ 'yoast_' . $this->get_query_val() ] = sprintf(
			'<a href="%1$s" class="%2$s">%3$s</a> (%4$s)',
			esc_url( $this->get_filter_url() ),
			( $this->is_filter_active() ) ? 'current' : '',
			$this->get_label(),
			$this->get_post_total()
		);

		return $views;
	}

	/**
	 * Removes the post_status from the REQUEST URL because of the filter is in the same line.
	 * After removing the post_status it will add a query arg for this filter.
	 *
	 * @return string The url to activate this filter.
	 */
	protected function get_filter_url() {
		$filter_url = remove_query_arg( array( 'post_status' ) );
		$filter_url = add_query_arg( self::FILTER_QUERY_ARG, $this->get_query_val(), $filter_url );

		return $filter_url;
	}

	/**
	 * Returns true when the filter is active.
	 *
	 * @return bool Whether or not the filter is active.
	 */
	protected function is_filter_active() {
		return ( filter_input( INPUT_GET, self::FILTER_QUERY_ARG ) === $this->get_query_val() );
	}

	/**
	 * Returns the current post type.
	 *
	 * @return string The current post type.
	 */
	protected function get_current_post_type() {
		return filter_input(
			INPUT_GET, 'post_type', FILTER_DEFAULT, array(
				'options' => array( 'default' => 'post' ),
			)
		);
	}

	/**
	 * Returns the post types to which this filter should be added.
	 *
	 * @return array The post types to which this filter should be added.
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}
}
