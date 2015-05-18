<?php
/**
 * @package	   WPSEO
 * @subpackage Premium
 */

/**
 * Class WPSEO_Crawl_Issue_Marker
 */
class WPSEO_Crawl_Issue_Marker {

	/**
	 * The client holder - this will perform the request to Google
	 *
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * The holder for the requested data
	 *
	 * @var array
	 */
	private $crawl_issue = array();

	/**
	 * Setting up the needed API libs and return the result
	 */
	public function __construct() {
		Yoast_Api_Libs::load_api_libraries( array( 'google' ) );

		wp_die( $this->get_result() );
	}

	/**
	 * Setting the result, this method will check if current
	 *
	 * @return string
	 */
	private function get_result() {
		if ( $url = $this->can_be_marked_as_fixed() ) {
			if ( $this->set_crawl_issue( $url ) && $this->send_mark_as_fixed() && $this->delete_crawl_issue() ) {
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
		if ( $url = filter_input( INPUT_POST, 'url' ) ) {
			return $url;
		}

		return false;
	}

	/**
	 * Storing the data belonging to the current issue, this data is needed in the 'mark as fixed' flow
	 *
	 * @param string $url
	 *
	 * @return bool
	 */
	private function set_crawl_issue( $url ) {
		if ( $crawl_issue = get_page_by_title( $url, OBJECT, WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE ) ) {
			$this->crawl_issue = array(
				'ID'       => $crawl_issue->ID,
				'url'      => $url,
				'category' => get_post_meta( $crawl_issue->ID, WPSEO_Crawl_Issue::PM_CI_CATEGORY, true ),
				'platform' => get_post_meta( $crawl_issue->ID, WPSEO_Crawl_Issue::PM_CI_PLATFORM, true ),
			);

			return true;
		}
	}

	/**
	 * Sending a request to the Google Webmaster Tools API to let them know we marked an issue as fixed.
	 *
	 * @return bool
	 */
	private function send_mark_as_fixed( ) {
		$this->service = new WPSEO_GWT_Service();

		if ( $this->service->mark_as_fixed( $this->crawl_issue['url'], $this->crawl_issue['platform'], $this->crawl_issue['category'] ) ) {
			return true;
		}
	}

	/**
	 * Delete the crawl issue from the database
	 *
	 * @return bool
	 */
	private function delete_crawl_issue() {
		// Check if there is a result
		if ( ! empty( $this->crawl_issue['ID'] ) ) {
			wp_delete_post( $this->crawl_issue['ID'], true );
			return true;
		}
	}

}