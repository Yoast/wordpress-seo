<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Category_Filters
 *
 * This class will get all category counts from the options and will parse the filter links that are displayed above
 * the crawl issue tables.
 *
 */
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
	 * Constructing this object
	 *
	 * Setting the hook to create the issues categories as the links
	 *
	 * @param string $platform
	 * @param string $screen_id
	 */
	public function __construct( $platform, $screen_id ) {
		$platform        = WPSEO_GWT_Mapper::platform( $platform );

		add_filter( 'views_' . $screen_id, array( $this, 'as_array' ) );

		$platform_counts = $this->get_counts();

		if ( array_key_exists( $platform, $platform_counts ) ) {
			$this->category_counts = $this->parse_counts( $platform_counts[ $platform ] );
		}

		$this->set_filter_values();
	}

	/**
	 * Getting the current view
	 */
	public function current_view() {
		$view        = ( $status = filter_input( INPUT_GET, 'category' )) ? $status : 'not_found';
		$mapped_view = WPSEO_GWT_Mapper::category( $view );

		if ( filter_input( INPUT_GET, 'category' ) === null && empty( $this->category_counts[ $mapped_view ] ) ) {
			$view = WPSEO_GWT_Mapper::category( key( $this->category_counts ), true );
		}

		return $this->current_view = $view;
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

		foreach ( $this->category_counts as $category_name => $category ) {
			$new_views[] = $this->create_view_link( WPSEO_GWT_Mapper::category( $category_name, true ), $category['count'] );
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
				'value'       => __( 'Access denied', 'wordpress-seo' ),
				'description' => __( 'Server requires authentication or is blocking Googlebot from accessing the site.', 'wordpress-seo' ),
			),
			'faulty_redirects' => array(
				'value' => __( 'Faulty redirects', 'wordpress-seo' ),
			),
			'not_followed'     => array(
				'value' => __( 'Not followed', 'wordpress-seo' ),
			),
			'not_found'        => array(
				'value'       => __( 'Not found', 'wordpress-seo' ),
				'description' => __( 'URL points to a non-existent page.', 'wordpress-seo' ),
			),
			'other'            => array(
				'value'       => __( 'Other', 'wordpress-seo' ),
				'description' => __( 'Google was unable to crawl this URL due to an undetermined issue.', 'wordpress-seo' ),
			),
			'roboted'          => array(
				'value'       => __( 'Blocked', 'wordpress-seo' ),
				'description' => __( 'Googlebot could access your site, but certain URLs are blocked for Googlebot-mobile for smartphones in your robots.txt file.', 'wordpress-seo' ),
			),
			'server_error'     => array(
				'value'       => __( 'Server Error', 'wordpress-seo' ),
				'description' => __( 'Request timed out or site is blocking Google.', 'wordpress_seo' )
			),
			'soft_404'         => array(
				'value'       => __( 'Soft 404', 'wordpress-seo' ),
				'description' => __( "The target URL doesn't exist, but your server is not returning a 404 (file not found) error.", 'wordpress-seo' ),
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

	/**
	 * Parsing the category counts. When there are 0 issues for a specific category, just remove that one from the array
	 *
	 * @param array $category_counts
	 *
	 * @return mixed
	 */
	private function parse_counts( $category_counts ) {
		foreach ( $category_counts as $category_name => $category ) {
			if ( $category['count'] === '0' ) {
				unset( $category_counts[ $category_name ] );
			}
		}

		return $category_counts;
	}

}
