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
	 * @var object
	 */
	private $category;

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @param WPSEO_GWT_Service $service
	 * @param object            $category
	 *
	 */
	public function __construct( WPSEO_GWT_Service $service, $category ) {
		$this->service  = $service;
		$this->category = $category;
	}

	/**
	 * Fetching the issues for current category
	 *
	 * @param array $crawl_issues
	 */
	public function fetch_issues( array &$crawl_issues ) {

		if ( $issues = $this->service->fetch_category_issues( $this->category->platform, $this->category->category ) ) {
			foreach ( $issues as $issue ) {
				$crawl_issues[] = $this->create_issue( $issue );
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
			(string) $this->category->platform,
			(string) $this->category->category,
			new DateTime( (string) $issue->first_detected ),
			(string) ( ! empty( $issue->responseCode ) ) ? $issue->responseCode : null,
			false
		);
	}

}