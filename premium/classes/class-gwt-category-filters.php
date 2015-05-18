<?php

class WPSEO_GWT_Category_Filters {

	/**
	 * The counts per category
	 *
	 * @var array
	 */
	private $category_counts = array();

	/**
	 * All the possible filters
	 *
	 * @var array
	 */
	private $filter_values   = array();

	/**
	 * The current view
	 *
	 * @var string
	 */
	private $current_view;

	/**
	 * Constructing this opject
	 *
	 * @param string $platform
	 * @param string $current_view
	 */
	public function __construct( $platform, $current_view ) {
		$platform        = WPSEO_GWT_Mapper::platform( $platform );
		$platform_counts = $this->get_counts();

		if ( array_key_exists( $platform, $platform_counts ) ) {
			$this->category_counts = $platform_counts[ $platform ];
		}

		$this->set_filter_values();

		$this->current_view = $current_view;
	}

	/**
	 * Returns the current filters as an array
	 *
	 * Only return categories with more than 0 issues
	 *
	 * @return array
	 */
	public function as_array() {
		$new_views = array();

		foreach ( $this->category_counts as $category ) {
			if ( $category['count'] > 0 ) {
				$new_views[] = $this->create_view_link( WPSEO_GWT_Mapper::category( $category['category'], true ), $category['count'] );
			}
		}

		return $new_views;
	}

	/**
	 * Getting the options with the counts
	 *
	 * @return mixed
	 */
	private function get_counts() {
		return get_option( WPSEO_Crawl_Issue_Count::OPTION_CI_COUNTS, array() );
	}

	/**
	 * Setting the values for the filter
	 */
	private function set_filter_values() {
		$this->filter_values = array(
			'access_denied'    => array(
				'value' => __( 'Access denied', 'wordpress-seo' ),
			),
			'faulty_redirects' => array(
				'value' => __( 'Faulty redirects', 'wordpress-seo' ),
			),
			'not_followed' => array(
				'value' => __( 'Not followed', 'wordpress-seo' ),
			),
			'not_found'    => array(
				'value' => __( 'Not found', 'wordpress-seo' ),
			),
			'other'        => array(
				'value' => __( 'Other', 'wordpress-seo' ),
			),
			'roboted'      => array(
				'value' => __( 'Roboted', 'wordpress-seo' ),
			),
			'server_error' => array(
				'value' => __( 'Server Error', 'wordpress-seo' ),
			),
			'soft_404'     => array(
				'value' => __( 'Soft 404', 'wordpress-seo' ),
			),
		);
	}

	/**
	 * Creates a filter link
	 *
	 * @param string  $key
	 * @param integer $count
	 *
	 * @return string
	 */
	private function create_view_link( $key, $count ) {
		$href  = esc_attr( add_query_arg( array( 'category' => $key, 'paged' => 1 ) ) );
		$class = ( ( $this->current_view == $key ) ? " class='current'" : '' );
		return "<a href='{$href}'{$class}>{$this->filter_values[ $key ]['value']}</a> ({$count})";
	}

}