<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Crawl_Issue_Marker
 */
class WPSEO_Crawl_Issue_Marker {

	/**
	 * @var WPSEO_Crawl_Category_Issues
	 */
	private $crawl_issues;

	/**
	 * @var string
	 */
	private $url = '';

	/**
	 * @var string
	 */
	private $platform;

	/**
	 * @var string
	 */
	private $category;

	/**
	 * Setting up the needed API libs and return the result
	 *
	 * If param URL is given, the request is performed by a bulk action
	 *
	 * @param string $url
	 */
	public function __construct( $url = '' ) {
		Yoast_Api_Libs::load_api_libraries( array( 'google' ) );

		$this->url = $url;

		$result = $this->get_result();

		// If there is an ajax request, die response with the result
		if ( defined( DOING_AJAX ) && DOING_AJAX ) {
			wp_die( $result );
		}
	}

	/**
	 * Setting the result, this method will check if current
	 *
	 * @return string
	 */
	private function get_result() {
		if ( $this->can_be_marked_as_fixed() ) {
			if ( $this->set_crawl_issue() && $this->send_mark_as_fixed() && $this->delete_crawl_issue() ) {
				return 'true';
			}
		}

		return 'false';
	}

	/**
	 * Check if request is valid by verifying the posted nonce and return the URL if this one is set
	 *
	 * @return bool|string
	 */
	private function can_be_marked_as_fixed() {
		if ( $this->url !== '' ) {
			return $this->url;
		}

		return false;
	}

	/**
	 * Storing the data belonging to the current issue, this data is needed in the 'mark as fixed' flow
	 *
	 * @return bool
	 */
	private function set_crawl_issue() {
		$this->platform = filter_input( INPUT_POST, 'platform' );
		$this->category = filter_input( INPUT_POST, 'category' );
		if ( $this->platform && $this->category ) {
			$this->crawl_issues = new WPSEO_Crawl_Category_Issues( $this->platform, $this->category );

			return true;
		}
	}

	/**
	 * Sending a request to the Google Search Console API to let them know we marked an issue as fixed.
	 *
	 * @return bool
	 */
	private function send_mark_as_fixed( ) {
		$service = new WPSEO_GWT_Service();
		if ( $service->mark_as_fixed( $this->url, $this->platform, $this->category ) ) {
			return true;
		}
	}

	/**
	 * Delete the crawl issue from the database
	 *
	 * @return bool
	 */
	private function delete_crawl_issue() {
		return $this->crawl_issues->delete_issue( $this->url );
	}

}