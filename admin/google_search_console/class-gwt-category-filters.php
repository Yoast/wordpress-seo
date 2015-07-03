<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Category_Filters
 *
 * This class will get all category counts from the options and will parse the filter links that are displayed above
 * the crawl issue tables.
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
	 * @param string $screen_id
	 */
	public function __construct( $screen_id ) {
		add_filter( 'views_' . $screen_id, array( $this, 'as_array' ) );
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
	 * Setting the view counts based on the saved data. The info will be used to display the category filters
	 *
	 * @param string $platform
	 */
	public function set_counts( $platform ) {
		$platform        = WPSEO_GWT_Mapper::platform( $platform );
		$platform_counts = $this->get_counts();

		if ( array_key_exists( $platform, $platform_counts ) ) {
			$this->category_counts = $this->parse_counts( $platform_counts[ $platform ] );
		}

		$this->set_filter_values();
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
		$this->set_filter_value( 'access_denied', __( 'Access denied', 'wordpress-seo' ), __( 'Server requires authentication or is blocking Googlebot from accessing the site.', 'wordpress-seo' ) );
		$this->set_filter_value( 'faulty_redirects', __( 'Faulty redirects', 'wordpress-seo' ) );
		$this->set_filter_value( 'not_followed',__( 'Not followed', 'wordpress-seo' ) );
		$this->set_filter_value( 'not_found', __( 'Not found', 'wordpress-seo' ), __( 'URL points to a non-existent page.', 'wordpress-seo' ) );
		$this->set_filter_value( 'other', __( 'Other', 'wordpress-seo' ), __( 'Google was unable to crawl this URL due to an undetermined issue.', 'wordpress-seo' ) );
		$this->set_filter_value( 'roboted', __( 'Blocked', 'wordpress-seo' ), __( 'Googlebot could access your site, but certain URLs are blocked for Googlebot-mobile for smartphones in your robots.txt file.', 'wordpress-seo' ) );
		$this->set_filter_value( 'server_error', __( 'Server Error', 'wordpress-seo' ), __( 'Request timed out or site is blocking Google.', 'wordpress_seo' ) );
		$this->set_filter_value( 'soft_404', __( 'Soft 404', 'wordpress-seo' ), __( "The target URL doesn't exist, but your server is not returning a 404 (file not found) error.", 'wordpress-seo' ) );
	}

	/**
	 * Add new filter value to the filter_values
	 * @param string $key
	 * @param string $value
	 * @param string $description
	 */
	private function set_filter_value( $key, $value, $description = '' ) {
		$this->filter_values[ $key ] = array(
			'value'       => $value,
			'description' => $description,
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
		$href  = add_query_arg( array( 'category' => $key, 'paged' => 1 ) );

		$class = 'gsc_category';
		if ( $this->current_view == $key ) {
			$class .= ' current';
		}

		$title = '';
		if ( $this->filter_values[ $key ]['description'] !== '' ) {
			$title = " title='" . esc_attr( $this->filter_values[ $key ]['description'] ) . "'";
		}

		return sprintf(
			'<a href="%1$s" class="%2$s" %3$s>%4$s</a> (%5$s)',
			esc_attr( $href ),
			$class,
			$title,
			$this->filter_values[ $key ]['value'],
			$count
		);
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
