<?php
/**
 * @package    WPSEO
 * @subpackage Premium
 */

/**
 * Class WPSEO_Crawl_Category_Issues
 */
class WPSEO_Crawl_Category_Issues {

	/**
	 * @var string
	 */
	private $category;

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @var string
	 */
	private $platform;

	/**
	 * @param string $platform
	 * @param string $category
	 */
	public function __construct( $platform, $category ) {
		$this->service  = new WPSEO_GWT_Service();
		$this->platform = $platform;
		$this->category = $category;
	}

	/**
	 * Fetching the issues for current category
	 */
	public function fetch_issues() {
		if ( $issues = $this->service->fetch_category_issues( $this->platform, $this->category ) ) {
			foreach ( $issues as $issue ) {
				$this->save_issue(
					$this->create_issue( $issue )
				);
			}
		}
	}

	/**
	 * Creates the issue
	 * @param stdClass $issue
	 *
	 * @return WPSEO_Crawl_Issue
	 */
	private function create_issue( $issue ) {
		return new WPSEO_Crawl_Issue(
			WPSEO_Redirect_Manager::format_url( (string) $issue->pageUrl ),
			(string) $this->platform,
			(string) $this->category,
			new DateTime( (string) $issue->first_detected ),
			(string) ( ! empty( $issue->responseCode ) ) ? $issue->responseCode : null,
			false
		);
	}

	/**
	 * Saving the crawl issue in the database
	 *
	 * @param WPSEO_Crawl_Issue $crawl_issue
	 */
	private function save_issue( WPSEO_Crawl_Issue $crawl_issue ) {
		$crawl_issue->save();
	}

}