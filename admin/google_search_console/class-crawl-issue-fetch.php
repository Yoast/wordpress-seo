<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_Crawl_Issue_Fetch
 */
class WPSEO_Crawl_Issue_Fetch {

	/**
	 * All the categories
	 * @var array|void
	 */
	private $issues = array();

	/**
	 * @var string
	 */
	private $platform;

	/**
	 * @var string
	 */
	private $category;

	/**
	 * @var WPSEO_Crawl_Issue_Count
	 */
	private $issue_count;

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @param string                  $platform
	 * @param string                  $category
	 * @param WPSEO_Crawl_Issue_Count $issue_count
	 * @param WPSEO_GWT_Service       $service
	 */
	public function __construct( $platform, $category, WPSEO_Crawl_Issue_Count $issue_count, WPSEO_GWT_Service $service ) {
		$this->platform    = $platform;
		$this->category    = $category;
		$this->issue_count = $issue_count;
		$this->service     = $service;

		$this->list_issues();
	}

	/**
	 * Getting the array with all the issues for current platform - category
	 *
	 * @return array|void
	 */
	public function get_issues() {
		return $this->issues;
	}

	/**
	 * Getting the category issue crawler
	 *
	 * @return WPSEO_Crawl_Category_Issues
	 */
	public function get_issue_crawler() {
		return new WPSEO_Crawl_Category_Issues( $this->platform, $this->category );
	}

	/**
	 * Listing the issues from the database
	 */
	private function list_issues() {
		$counts = $this->issue_count->get_counts();

		if ( array_key_exists( $this->platform, $counts ) ) {
			$counts[ $this->platform ] = $this->list_category_issues( $counts[ $this->platform ] );

			// Write the new counts value.
			$this->issue_count->set_counts( $counts );
		}
	}

	/**
	 * Listing the issues for current category.
     *
	 * @param array $counts
	 *
	 * @return mixed
	 */
	private function list_category_issues( $counts ) {
		// Fetching the issues.
		$issue_crawler = $this->get_issue_crawler();

		// When the issues have to be fetched.
		if ( array_key_exists( $this->category, $counts ) && $counts[ $this->category ]['count'] > 0 && $counts[ $this->category ]['last_fetch'] <= strtotime( '-12 hours' ) ) {
			$issue_crawler->fetch_issues();

			// Set last fetch.
			$counts[ $this->category ]['last_fetch'] = time();
		}

		$this->issues = $issue_crawler->get_issues();

		return $counts;
	}

}
