<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Marker
 */
class WPSEO_GSC_Marker {

	/**
	 * @var WPSEO_GSC_Issues
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
	 * @var string
	 */
	private $result;

	/**
	 * Setting up the needed API libs and return the result
	 *
	 * If param URL is given, the request is performed by a bulk action
	 *
	 * @param string $url
	 */
	public function __construct( $url = '' ) {
		$this->url    = $url;
		$this->result = $this->get_result();
	}

	/**
	 * Getting the response for the AJAX request
	 * @return string
	 */
	public function get_response() {
		return $this->result;
	}

	/**
	 * Setting the result, this method will check if current
	 *
	 * @return string
	 */
	private function get_result() {
		if ( $this->can_be_marked_as_fixed() ) {
			$service = new WPSEO_GSC_Service( WPSEO_GSC_Settings::get_profile() );

			if ( $this->set_crawl_issues() && $this->send_mark_as_fixed( $service ) && $this->delete_crawl_issue() ) {
				$this->update_issue_count( $service );

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
	private function set_crawl_issues() {
		$this->platform = filter_input( INPUT_POST, 'platform' );
		$this->category = filter_input( INPUT_POST, 'category' );
		if ( $this->platform && $this->category ) {
			$this->crawl_issues = new WPSEO_GSC_Issues( $this->platform, $this->category );

			return true;
		}

		return false;
	}

	/**
	 * Sending a request to the Google Search Console API to let them know we marked an issue as fixed.
	 *
	 * @param WPSEO_GSC_Service $service
	 *
	 * @return bool
	 */
	private function send_mark_as_fixed( WPSEO_GSC_Service $service ) {
		return $service->mark_as_fixed( $this->url, $this->platform, $this->category );
	}

	/**
	 * Delete the crawl issue from the database
	 *
	 * @return bool
	 */
	private function delete_crawl_issue() {
		return $this->crawl_issues->delete_issue( $this->url );
	}

	/**
	 * Getting the counts for current platform - category combination and update the score of it.
	 *
	 * @param WPSEO_GSC_Service $service
	 */
	private function update_issue_count( WPSEO_GSC_Service $service ) {
		$counts  = new WPSEO_GSC_Count( $service );

		// Get the issues.
		$total_issues = $counts->get_issue_count( $this->platform, $this->category );

		// Lower the current count with 1.
		$total_issues = ( $total_issues - 1 );

		// And update the count.
		$counts->update_issue_count( $this->platform, $this->category, $total_issues );
	}

}
